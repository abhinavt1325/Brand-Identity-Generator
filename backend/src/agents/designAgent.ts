import { GenerateInput, StrategyResult, DesignResult } from '../types';
import { designSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const designAgent = async (input: GenerateInput, strategy: StrategyResult): Promise<DesignResult> => {
  const systemPrompt = `You are a world-class brand designer with expertise in visual identity systems, color theory, and typography. Your role is to create a comprehensive, professional-grade design system tailored to the startup's personality and strategy.`;

  const userPrompt = `Startup Name: ${input.startupName}
Industry: ${input.industry}
Brand Positioning: ${strategy.positioning}
Brand Tone: ${strategy.tone}
Mission: ${strategy.mission}

Create a complete design system. Return EXACTLY these top-level keys:

"colorPalette": An array of exactly 5 color objects. The first 3 are PRIMARY colors (dominant, accent, background). The last 2 are SECONDARY/utility colors (text, highlight or secondary accent). Each object has:
  - "hex": a precise hex code string like "#1A2B3C" that ACTUALLY FITS the brand's industry and tone
  - "name": a creative, descriptive name (e.g. "Deep Space Indigo", "Arctic White", "Signal Amber")

"typography": an object with:
  - "heading": a specific Google Font name for headings (pick one that matches the brand personality, e.g. "Sora", "Clash Display", "Playfair Display", "Space Grotesk")
  - "body": a specific Google Font name for body text (e.g. "Inter", "DM Sans", "Nunito", "Source Sans 3")

"logoDirection": a DETAILED paragraph (3-5 sentences) describing the complete logo concept including: the icon/mark concept, the wordmark style, what visual metaphor or shape is used, how colors are applied, and what feeling/impression the logo conveys to customers.

Your JSON must look EXACTLY like this structure:
{
  "colorPalette": [
    {"hex": "#0F172A", "name": "Midnight Navy"},
    {"hex": "#3B82F6", "name": "Electric Blue"},
    {"hex": "#F0F9FF", "name": "Sky Mist"},
    {"hex": "#1E293B", "name": "Slate Charcoal"},
    {"hex": "#F59E0B", "name": "Golden Amber"}
  ],
  "typography": {
    "heading": "Space Grotesk",
    "body": "Inter"
  },
  "logoDirection": "The logo features a bold geometric monogram built from the startup's initials, rendered with clean vector shapes that evoke precision and forward momentum. The primary mark uses a custom ligature where letterforms interlock to suggest connectivity and collaboration. Set against the Electric Blue primary color, the wordmark uses Space Grotesk in a semi-bold weight with tightened letter spacing for a confident, modern feel. A subtle gradient overlay transitions from Electric Blue to Midnight Navy, adding depth without sacrificing reproducibility at small sizes. The overall impression is of a trustworthy, technology-forward brand that balances innovation with approachability."
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
          { hex: "#0F172A", name: "Midnight Navy" },
          { hex: "#3B82F6", name: "Electric Blue" },
          { hex: "#F0F9FF", name: "Sky Mist" },
          { hex: "#1E293B", name: "Slate Charcoal" },
          { hex: "#F59E0B", name: "Golden Amber" }
        ],
        typography: { heading: "Space Grotesk", body: "Inter" },
        logoDirection: "The logo features a bold geometric monogram built from the startup's initials, rendered with clean vector shapes that evoke precision and forward momentum. The primary mark uses a custom ligature where letterforms interlock to suggest connectivity and collaboration. Set against Electric Blue, the wordmark uses Space Grotesk in a semi-bold weight with tightened letter spacing. A subtle gradient overlay transitions from Electric Blue to Midnight Navy, adding depth without sacrificing reproducibility at small sizes. The overall impression is of a trustworthy, technology-forward brand that balances innovation with approachability."
      };
    }
    throw error;
  }
};
