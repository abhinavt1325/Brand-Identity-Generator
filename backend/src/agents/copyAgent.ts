import { GenerateInput, StrategyResult, CopyResult } from '../types';
import { copySchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const copyAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<CopyResult> => {
  const systemPrompt = `You are an expert copywriter. Based on the startup's info and strategy, write the foundational brand copy. Return the output matching the requested JSON schema.`;
  const userPrompt = `Startup Name: ${input.startupName}\nValue Proposition: ${input.valueProp}\n\nBrand Strategy:\n${JSON.stringify(strategy)}\n\nWrite a tagline, elevator pitch, and brand story.`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      copySchema,
      "CopyOutput",
      "Brand copywriting elements"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[CopyAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        tagline: "Empowering your future.",
        elevatorPitch: `We are ${input.startupName}, providing the best in ${input.industry} by focusing on ${input.valueProp}.`,
        story: "It started with a simple idea: to make things better. Now, we are leading the way."
      };
    }
    throw error;
  }
};
