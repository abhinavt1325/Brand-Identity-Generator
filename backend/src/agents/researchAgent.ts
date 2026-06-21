import { GenerateInput, ResearchResult } from '../types';
import { researchSchema } from '../schemas/generate.schema';
import { OpenAIService } from '../services/openai.service';
import { logger } from '../utils/logger';

export const researchAgent = async (input: GenerateInput): Promise<ResearchResult> => {
  const systemPrompt = `You are an expert market researcher. Conduct preliminary research for a new startup.

CRITICAL: You MUST return a JSON object with EXACTLY these three top-level keys:
  "competitors", "audience", "marketTrends"

KEY REQUIREMENTS — read carefully:
- "competitors": an ARRAY of objects. Each object has EXACTLY two string fields: "name" and "analysis".
  DO NOT use any other field names like "strength", "weakness", "description", "impact", or "segment".
  The "analysis" field must be a single combined string describing the competitor.
- "audience": a SINGLE plain string describing the overall target audience. NOT an array. NOT an object.
- "marketTrends": an ARRAY of plain strings, where each string is a market trend.
  NOT an array of objects. Each element must be a raw string, NOT an object with "trend"/"impact" fields.`;

  const userPrompt = `Startup Name: ${input.startupName}
Industry: ${input.industry}
Value Proposition: ${input.valueProp}

Return ONLY this JSON (with real values, not placeholders):
{
  "competitors": [
    {"name": "Competitor A", "analysis": "Brief analysis of what they do, their strengths and weaknesses."},
    {"name": "Competitor B", "analysis": "Brief analysis of what they do, their strengths and weaknesses."},
    {"name": "Competitor C", "analysis": "Brief analysis of what they do, their strengths and weaknesses."}
  ],
  "audience": "A single sentence or two describing the overall target audience for this startup.",
  "marketTrends": [
    "First key market trend as a plain sentence.",
    "Second key market trend as a plain sentence.",
    "Third key market trend as a plain sentence."
  ]
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
        competitors: [{ name: "Mock Competitor", analysis: "They are doing well but lack focus in niche segments." }],
        audience: "Tech-savvy millennials interested in " + input.industry,
        marketTrends: ["AI automation is reshaping the industry", "Sustainability is a growing consumer priority"]
      };
    }
    throw error;
  }
};
