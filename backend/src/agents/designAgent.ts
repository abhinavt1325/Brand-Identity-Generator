import { GenerateInput, StrategyResult, DesignResult } from '../types';
import { designSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const designAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<DesignResult> => {
  const systemPrompt = `You are an expert brand designer. Based on the startup's strategy, define the design system.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}

Brand Strategy:
${JSON.stringify(strategy)}

Define a design system using these EXACT top-level keys:
- "colorPalette": an array of exactly 3 objects, each with "hex" (string, e.g. "#FF5733") and "name" (string)
- "typography": an object with "heading" (string font name) and "body" (string font name)
- "logoDirection": a string describing the logo concept

Your JSON must look like:
{
  "colorPalette": [
    {"hex": "#FF5733", "name": "Primary"},
    {"hex": "#F3F4F6", "name": "Background"},
    {"hex": "#1F2937", "name": "Text"}
  ],
  "typography": {"heading": "Inter", "body": "Roboto"},
  "logoDirection": "..."
}`;

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
