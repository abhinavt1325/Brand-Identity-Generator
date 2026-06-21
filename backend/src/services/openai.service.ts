import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { z } from 'zod';

// Initialise lazily so dotenv has already loaded when this runs
let _openai: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }
  return _openai;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalise raw parsed JSON from the model before we validate with Zod.
 *
 * Smaller models sometimes wrap the result in a superfluous outer key like
 * `{ "properties": { ... } }` or `{ "ResearchOutput": { ... } }`.
 * This unwraps one level so the root keys match what Zod expects.
 */
function unwrapIfNeeded(parsed: any, expectedKeys: string[]): any {
  if (typeof parsed !== 'object' || parsed === null) return parsed;

  const topLevelMatches = expectedKeys.filter(k => k in parsed).length;
  if (topLevelMatches >= 1) return parsed;

  const childKeys = Object.keys(parsed);
  for (const ck of childKeys) {
    const child = parsed[ck];
    if (typeof child === 'object' && child !== null) {
      const childMatches = expectedKeys.filter(k => k in child).length;
      if (childMatches >= 1) {
        logger.warn(`[OpenAIService] Unwrapping model output from key "${ck}"`);
        return child;
      }
    }
  }
  return parsed;
}

/**
 * Coerce a model response to fit the expected schema shape.
 *
 * The Gemini lite model frequently returns richer structures than the schema
 * requires. Instead of failing validation we coerce the response here so
 * these patterns are handled gracefully:
 *
 * Research schema issues:
 *  - competitors[].analysis missing → concatenate any string fields found
 *  - audience returned as array of objects → join into a plain string
 *  - marketTrends returned as array of objects → extract string fields
 */
function coerceToSchema(data: any, schemaName: string): any {
  if (typeof data !== 'object' || data === null) return data;

  const result = { ...data };

  // ── competitors: each item must have { name: string, analysis: string } ──
  if (Array.isArray(result.competitors)) {
    result.competitors = result.competitors.map((c: any) => {
      if (typeof c === 'string') {
        // Flat string: use as both name and analysis
        return { name: c, analysis: c };
      }
      if (typeof c === 'object' && c !== null) {
        const name = typeof c.name === 'string' ? c.name : String(c.name ?? 'Unknown');
        // "analysis" field might be missing; fall back to other string fields
        let analysis = typeof c.analysis === 'string' ? c.analysis : '';
        if (!analysis) {
          const extras = Object.entries(c)
            .filter(([k]) => k !== 'name')
            .map(([k, v]) => `${k}: ${v}`)
            .join('. ');
          analysis = extras || name;
        }
        return { name, analysis };
      }
      return { name: String(c), analysis: String(c) };
    });
  }

  // ── audience: must be a plain string ──
  if (Array.isArray(result.audience)) {
    // Array of objects like [{segment, description}, ...]
    result.audience = result.audience
      .map((a: any) => {
        if (typeof a === 'string') return a;
        if (typeof a === 'object' && a !== null) {
          return Object.values(a).filter(v => typeof v === 'string').join(': ');
        }
        return String(a);
      })
      .join('. ');
    logger.warn(`[OpenAIService] Coerced audience array → string`);
  } else if (typeof result.audience !== 'string') {
    result.audience = String(result.audience ?? '');
  }

  // ── marketTrends: must be string[] ──
  if (Array.isArray(result.marketTrends)) {
    result.marketTrends = result.marketTrends.map((t: any) => {
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t !== null) {
        // e.g. { trend: "...", impact: "..." } → join values
        return Object.values(t).filter(v => typeof v === 'string').join(': ');
      }
      return String(t);
    });
    logger.warn(`[OpenAIService] Coerced marketTrends items → strings`);
  }

  // ── colorPalette: each item must have { hex, name } ──
  const defaultColors = [
    { hex: "#0F172A", name: "Midnight Navy" },
    { hex: "#3B82F6", name: "Electric Blue" },
    { hex: "#F8FAFC", name: "Frost White" },
    { hex: "#1E293B", name: "Slate Charcoal" },
    { hex: "#F59E0B", name: "Golden Amber" }
  ];
  if (Array.isArray(result.colorPalette)) {
    result.colorPalette = result.colorPalette.map((c: any) => {
      if (typeof c === 'object' && c !== null) {
        const hex = typeof c.hex === 'string' ? c.hex : (c.color ?? c.value ?? '#000000');
        const name = typeof c.name === 'string' ? c.name : (c.label ?? 'Color');
        return { hex, name };
      }
      return { hex: '#000000', name: String(c) };
    });
    while (result.colorPalette.length < 5) {
      result.colorPalette.push(defaultColors[result.colorPalette.length]);
    }
    if (result.colorPalette.length > 5) {
      result.colorPalette = result.colorPalette.slice(0, 5);
    }
  } else {
    result.colorPalette = defaultColors;
  }

  // ── alignmentMetrics: each item must have { label: string, value: number } ──
  if (Array.isArray(result.alignmentMetrics)) {
    result.alignmentMetrics = result.alignmentMetrics.map((m: any) => {
      if (typeof m === 'object' && m !== null) {
        const label = typeof m.label === 'string' ? m.label : (m.name ?? m.metric ?? 'Metric');
        const value = typeof m.value === 'number' ? m.value : Number(m.score ?? m.rating ?? 80);
        return { label, value };
      }
      return { label: String(m), value: 80 };
    });
  }

  return result;
}

/**
 * Extract just the required keys from the Zod schema.
 */
function getTopLevelKeys(schema: z.ZodType<any>): string[] {
  if (schema instanceof z.ZodObject) {
    return Object.keys(schema.shape);
  }
  return [];
}

export class OpenAIService {
  static async generateStructuredOutput<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodType<T>,
    schemaName: string,
    schemaDescription: string
  ): Promise<T> {
    const useMock = process.env.USE_MOCK_FALLBACK === 'true';

    if (useMock || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      logger.info(`[OpenAIService] Using MOCK fallback for ${schemaName}`);
      throw new Error('MOCK_FALLBACK_REQUESTED');
    }

    const openai = getOpenAIClient();
    const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS || '60000', 10);

    const expectedKeys = getTopLevelKeys(schema);
    const keysStr = expectedKeys.length > 0 ? expectedKeys.map(k => `"${k}"`).join(', ') : '(see schema)';

    const fullSystemPrompt = `${systemPrompt}

You MUST respond with a single, valid JSON object. Follow these rules STRICTLY:
1. The top-level JSON object must have ONLY these exact keys: ${keysStr}
2. Do NOT wrap the result inside any other object. Do NOT add wrapper keys like "properties", "output", "result", "${schemaName}", "data", or "response".
3. Use the EXACT key names specified — correct spelling and camelCase where required.
4. Return ONLY the raw JSON object. No markdown fences, no explanatory text.`;

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      let normalised: any;
      try {
        logger.info(`[OpenAIService] Attempt ${attempt}/${MAX_RETRIES} for ${schemaName}`);

        const response = await openai.chat.completions.create(
          {
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
              { role: 'system', content: fullSystemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
          },
          { timeout: timeoutMs }
        );

        const content = response.choices[0].message.content;
        if (!content) {
          // Gemini occasionally returns an empty response — treat as retryable
          throw Object.assign(new Error('Model returned empty content'), { status: 503 });
        }

        let rawParsed: any;
        try {
          rawParsed = JSON.parse(content);
        } catch (parseErr) {
          const stripped = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
          rawParsed = JSON.parse(stripped);
        }

        // Step 1: unwrap any outer wrapper key the model may have added
        normalised = unwrapIfNeeded(rawParsed, expectedKeys);

        // Step 2: coerce field types to match what the schema expects
        normalised = coerceToSchema(normalised, schemaName);

        logger.debug({ normalised }, `[OpenAIService] Normalised response for ${schemaName}`);

        return schema.parse(normalised) as T;

      } catch (error: any) {
        lastError = error;

        if (error?.name === 'ZodError') {
          logger.error(
            { zodIssues: error.issues, rawResponse: normalised },
            `[OpenAIService] Schema validation failed for ${schemaName} on attempt ${attempt}`
          );
          if (attempt >= MAX_RETRIES) throw error;
          logger.warn(`[OpenAIService] Retrying after schema validation failure in ${RETRY_DELAY_MS}ms...`);
          await sleep(RETRY_DELAY_MS);
          continue;
        }

        // Gemini 400 "model output empty" is also retryable
        const isEmptyOutput = error?.status === 400 &&
          (error?.message ?? '').toLowerCase().includes('model output');
        const isRetryable = isEmptyOutput ||
          error?.status === 503 || error?.status === 429 || error?.status === 500;
        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * attempt;
          logger.warn(`[OpenAIService] Retryable error on attempt ${attempt} (status ${error?.status}), retrying in ${delay}ms...`);
          await sleep(delay);
        } else {
          logger.error({ err: error }, `[OpenAIService] Failed generating output for ${schemaName} after ${attempt} attempts`);
          throw error;
        }
      }
    }

    throw lastError;
  }
}
