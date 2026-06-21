import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  
  const systemPrompt = `You are an expert market researcher. Conduct preliminary research for a new startup.
You must return ONLY a JSON object with the following exact keys:
- "competitors": an array of objects where each object has:
  - "name": string (competitor company name)
  - "analysis": string (detailed analysis of the competitor)
- "audience": string (description of target audience)
- "marketTrends": an array of strings representing market trends.

Do NOT return keys like startup_name, target_audience, competitor_analysis, or market_trends. You must use the exact casing and names specified.`;

  const userPrompt = `Startup Name: AstroBrew\nIndustry: Specialty Coffee\nValue Proposition: Space-roasted coffee.\n\nProvide an analysis of competitors, target audience, and market trends.`;

  const body = {
    model: process.env.OPENAI_MODEL || "gemini-3.1-flash-lite",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body:", text);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

test();
