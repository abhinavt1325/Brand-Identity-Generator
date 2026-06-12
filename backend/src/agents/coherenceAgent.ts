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
  const systemPrompt = `You are an expert brand auditor. Review the generated brand components for consistency and alignment.`;
  const userPrompt = `Review these brand components for coherence:

Research: ${JSON.stringify(research)}
Strategy: ${JSON.stringify(strategy)}
Design: ${JSON.stringify(design)}
Copy: ${JSON.stringify(copy)}

Evaluate brand coherence using these EXACT top-level keys:
- "score": a number from 0 to 100 indicating overall brand coherence
- "alignmentMetrics": an array of objects, each with "label" (string) and "value" (number 0-100)
- "validationSummary": a string summarising the coherence assessment

Your JSON must look like:
{
  "score": 87,
  "alignmentMetrics": [
    {"label": "Tone vs Audience", "value": 90},
    {"label": "Design vs Strategy", "value": 85}
  ],
  "validationSummary": "..."
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
