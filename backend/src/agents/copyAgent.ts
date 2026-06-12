import { GenerateInput, StrategyResult, CopyResult } from '../types';
import { copySchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const copyAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<CopyResult> => {
  const systemPrompt = `You are an expert copywriter. Based on the startup's info and strategy, write the foundational brand copy.`;
  const userPrompt = `Startup Name: ${input.startupName}\nValue Proposition: ${input.valueProp}

Brand Strategy:
${JSON.stringify(strategy)}

Write brand copy using these EXACT top-level keys:
- "tagline": a short, memorable brand tagline (string)
- "elevatorPitch": a 2-3 sentence elevator pitch (string)
- "story": the brand origin and mission story, 3-4 sentences (string)

Your JSON must look like:
{
  "tagline": "...",
  "elevatorPitch": "...",
  "story": "..."
}`;

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
