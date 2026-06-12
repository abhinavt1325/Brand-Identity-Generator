import { GenerateInput, ResearchResult, StrategyResult } from '../types';
import { strategySchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const strategyAgent = async (input: GenerateInput, research: ResearchResult): Promise<StrategyResult> => {
  const systemPrompt = `You are an expert brand strategist. Based on the startup's info and market research, formulate a brand strategy.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}\nValue Proposition: ${input.valueProp}

Research Data:
${JSON.stringify(research)}

Define the positioning, tone of voice, and brand mission using these EXACT top-level keys:
- "positioning": a string describing the brand's market position
- "tone": a string describing the tone of voice
- "mission": a string with the brand mission statement

Your JSON must look like:
{
  "positioning": "...",
  "tone": "...",
  "mission": "..."
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      strategySchema,
      "StrategyOutput",
      "Brand strategy definition"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[StrategyAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        positioning: `The premier solution for ${input.industry} that actually cares.`,
        tone: "Professional, friendly, and innovative.",
        mission: `To disrupt the ${input.industry} space with uncompromised quality.`
      };
    }
    throw error;
  }
};
