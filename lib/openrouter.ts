import OpenAI from "openai";
import { ResumeLine, Suggestion } from "@/types/resume";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

export async function getSuggestionsFromOpenRouter(lines: ResumeLine[], jobDescription?: string): Promise<Suggestion[]> {
  const prompt = {
    task: "Improve ATS quality of this resume. Return JSON array only.",
    jobDescription: jobDescription || null,
    lines: lines.slice(0, 80).map((line) => ({ id: line.id, text: line.text, section: line.section })),
    responseSchema: {
      lineId: "string",
      reason: "string",
      proposedText: "string",
      impactOnATS: "string"
    }
  };

  const completion = await client.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert ATS resume editor. Give concise, high-impact, truthful rewrites. Output valid JSON only."
      },
      { role: "user", content: JSON.stringify(prompt) }
    ],
    temperature: 0.2
  });

  const raw = completion.choices[0]?.message?.content || "[]";
  try {
    const parsed = JSON.parse(raw) as Suggestion[];
    return parsed.slice(0, 30);
  } catch {
    return [];
  }
}
