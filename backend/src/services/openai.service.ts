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
const RETRY_DELAY_MS = 8000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Normalise raw parsed JSON from the model before we validate with Zod.
 *
 * Smaller models (e.g. gemini-3.1-flash-lite) sometimes wrap the result in a
 * superfluous outer key like `{ "properties": { ... actual keys ... } }` or
 * `{ "output": { ... } }` or even `{ "ResearchOutput": { ... } }`.
 *
 * This function detects that pattern and unwraps one level so the root keys
 * match what Zod expects.
 */
function unwrapIfNeeded(parsed: any, expectedKeys: string[]): any {
  if (typeof parsed !== 'object' || parsed === null) return parsed;

  // Check how many top-level keys overlap with what we expect
  const topLevelMatches = expectedKeys.filter(k => k in parsed).length;
  if (topLevelMatches >= 1) {
    // Already looks correct (at least one expected key is at the root)
    return parsed;
  }

  // Try one level of unwrapping — pick the single child object whose keys
  // include at least one expected key
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

  // Nothing matched — return as-is and let Zod produce a useful error
  return parsed;
}

/**
 * Extract just the required keys from the Zod schema so we can pass them
 * explicitly to the prompt and to unwrapIfNeeded.
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

You MUST respond with a single, valid JSON object. Follow these rules exactly:
1. The top-level JSON object must have ONLY these keys: ${keysStr}
2. Do NOT wrap the result inside any other object. Do NOT use keys like "properties", "output", "result", "${schemaName}", "data", or "response" as wrappers.
3. Use the EXACT key names listed above — correct spelling and camelCase where specified.
4. Return ONLY the raw JSON. No markdown fences (no \`\`\`json), no explanatory text before or after.

Example of CORRECT format (using placeholder values):
{
  ${expectedKeys.map(k => `"${k}": <value>`).join(',\n  ')}
}`;

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
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
        if (!content) throw new Error('Model returned empty content');

        let rawParsed: any;
        try {
          rawParsed = JSON.parse(content);
        } catch (parseErr) {
          // Try stripping markdown fences some models still add
          const stripped = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
          rawParsed = JSON.parse(stripped);
        }

        // Normalise the response structure before Zod validation
        const normalised = unwrapIfNeeded(rawParsed, expectedKeys);

        logger.debug({ normalised }, `[OpenAIService] Normalised response for ${schemaName}`);

        return schema.parse(normalised) as T;

      } catch (error: any) {
        lastError = error;

        // Log Zod validation errors clearly so we can see what the model actually returned
        if (error?.name === 'ZodError') {
          logger.error({ zodIssues: error.issues }, `[OpenAIService] Schema validation failed for ${schemaName} on attempt ${attempt}`);
          // Zod errors are not retryable HTTP errors — break immediately
          if (attempt >= MAX_RETRIES) throw error;
          const delay = RETRY_DELAY_MS;
          logger.warn(`[OpenAIService] Retrying after schema validation failure in ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        const isRetryable = error?.status === 503 || error?.status === 429 || error?.status === 500;

        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_MS * attempt;
          logger.warn(`[OpenAIService] ${error.status} error on attempt ${attempt}, retrying in ${delay}ms...`);
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
