import { GenerateInput, ResearchResult } from '../types';
import { researchSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const researchAgent = async (input: GenerateInput): Promise<ResearchResult> => {
  const systemPrompt = `You are an expert market researcher. Conduct preliminary research for a new startup.`;
  const userPrompt = `Startup Name: ${input.startupName}\nIndustry: ${input.industry}\nValue Proposition: ${input.valueProp}

Provide market research with these EXACT top-level keys:
- "competitors": an array of objects, each with "name" (string) and "analysis" (string)
- "audience": a string describing the target audience
- "marketTrends": an array of strings listing market trends

Your JSON must look like:
{
  "competitors": [{"name": "...", "analysis": "..."}],
  "audience": "...",
  "marketTrends": ["...", "..."]
}`;

  try {
    return await OpenAIService.generateStructuredOutput(
      systemPrompt,
      userPrompt,
      researchSchema,
      "ResearchOutput",
      "Market research analysis"
    );
  } catch (error: any) {
    if (error.message === 'MOCK_FALLBACK_REQUESTED') {
      logger.info(`[ResearchAgent] Mocking data for ${input.startupName}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        competitors: [{ name: "Mock Competitor", analysis: "They are doing well but lack focus." }],
        audience: "Tech-savvy millennials interested in " + input.industry,
        marketTrends: ["AI automation", "Sustainability"]
      };
    }
    throw error;
  }
};
