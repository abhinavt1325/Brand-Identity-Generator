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
  const systemPrompt = `You are an expert brand auditor. Review the generated brand components for consistency and alignment. Return the output matching the requested JSON schema.`;
  const userPrompt = `Review these components for coherence:\n\nResearch: ${JSON.stringify(research)}\nStrategy: ${JSON.stringify(strategy)}\nDesign: ${JSON.stringify(design)}\nCopy: ${JSON.stringify(copy)}\n\nProvide an overall score (0-100), alignment metrics, and a validation summary.`;

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
