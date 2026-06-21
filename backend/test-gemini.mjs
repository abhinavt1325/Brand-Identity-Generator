import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const competitorSchema = z.object({
  name: z.string(),
  analysis: z.string(),
});

const researchSchema = z.object({
  competitors: z.array(competitorSchema),
  audience: z.string(),
  marketTrends: z.array(z.string()),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "your_api_key_here",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function run() {
  try {
    const systemPrompt = `You are an expert market researcher. Conduct preliminary research for a new startup.
You must return ONLY a JSON object with the following exact keys:
- "competitors": an array of objects where each object has:
  - "name": string (competitor company name)
  - "analysis": string (detailed analysis of the competitor)
- "audience": string (description of target audience)
- "marketTrends": an array of strings representing market trends.

Do NOT return keys like startup_name, target_audience, competitor_analysis, or market_trends. You must use the exact casing and names specified.`;
    
    const userPrompt = `Startup Name: AstroBrew\nIndustry: Specialty Coffee\nValue Proposition: Space-roasted coffee.\n\nProvide an analysis of competitors, target audience, and market trends.`;

    const response = await openai.chat.completions.create({
      model: "gemini-3.1-flash-lite",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_object"
      }
    });

    const content = response.choices[0].message.content;
    console.log("RAW CONTENT:\n", content);
    const parsed = JSON.parse(content);
    console.log("PARSED:\n", parsed);
    researchSchema.parse(parsed);
    console.log("ZOD PARSE SUCCESS!");
  } catch (e) {
    console.error("ERROR:", e);
  }
}

run();
