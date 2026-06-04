import { GenerateInput, StrategyResult, DesignResult } from '../types';
import { designSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const designAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<DesignResult> => {
  const systemPrompt = `You are an expert brand designer. Based on the startup's strategy, define the design system. Return the output matching the requested JSON schema.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}\n\nBrand Strategy:\n${JSON.stringify(strategy)}\n\nDefine a 3-color palette, typography (heading/body), and a logo direction.`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      designSchema,
      "DesignOutput",
      "Brand design system"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[DesignAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        colorPalette: [
          { hex: "#FF5733", name: "Primary Brand" },
          { hex: "#F3F4F6", name: "Background" },
          { hex: "#1F2937", name: "Text" }
        ],
        typography: { heading: "Inter", body: "Roboto" },
        logoDirection: "Minimalist geometric icon paired with a bold sans-serif wordmark."
      };
    }
    throw error;
  }
};
