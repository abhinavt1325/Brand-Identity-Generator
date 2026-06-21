import { ResearchResult, StrategyResult, DesignResult, CopyResult, CoherenceResult } from '../types';
import { coherenceSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const coherenceAgent = async (
  research: ResearchResult,
  strategy: StrategyResult,
  design: DesignResult,
  copy: CopyResult
): Promise<CoherenceResult> => {
  const systemPrompt = `You are an expert brand auditor. Review the generated brand components for consistency and alignment.

CRITICAL: Return a JSON object with EXACTLY these three top-level keys:
  "score", "alignmentMetrics", "validationSummary"

KEY REQUIREMENTS:
- "score": a NUMBER between 0 and 100 representing overall brand coherence.
- "alignmentMetrics": an ARRAY of objects. Each object has EXACTLY two fields:
  "label" (a string) and "value" (a NUMBER between 0 and 100).
  DO NOT use any other field names like "name", "metric", "score", "rating" inside these objects.
- "validationSummary": a single plain string summarising the coherence assessment.`;

  // Summarise inputs to keep the prompt short and avoid Gemini's "empty output" error
  const competitorNames = research.competitors?.map(c => c.name).join(', ') ?? '';
  const palette = design.colorPalette?.map(c => `${c.name}(${c.hex})`).join(', ') ?? '';

  const userPrompt = `Assess brand coherence for these components:

- Audience: ${research.audience ?? ''}
- Positioning: ${strategy.positioning ?? ''}
- Tone: ${strategy.tone ?? ''}
- Mission: ${strategy.mission ?? ''}
- Competitors: ${competitorNames}
- Colors: ${palette}
- Heading Font: ${design.typography?.heading ?? ''}, Body Font: ${design.typography?.body ?? ''}
- Logo Direction: ${design.logoDirection ?? ''}
- Tagline: "${copy.tagline ?? ''}"
- Elevator Pitch: "${copy.elevatorPitch ?? ''}"

Return ONLY this JSON (with real values):
{
  "score": 87,
  "alignmentMetrics": [
    {"label": "Tone vs Audience", "value": 90},
    {"label": "Design vs Strategy", "value": 85},
    {"label": "Messaging Alignment", "value": 88},
    {"label": "Visual Consistency", "value": 84}
  ],
  "validationSummary": "A single paragraph summarising the brand coherence assessment."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      coherenceSchema,
      "CoherenceOutput",
      "Brand coherence analysis"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[CoherenceAgent] Mocking data.`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        score: 95,
        alignmentMetrics: [
          { label: "Tone vs Audience", value: 98 },
          { label: "Design vs Strategy", value: 92 }
        ],
        validationSummary: "The brand elements are highly aligned and present a unified front."
      };
    }
    throw error;
  }
};
