// src/services/groq.service.js
import Groq from "groq-sdk";
import "dotenv/config";
console.log("🔑 GROQ API key loaded?", !!process.env.GROQ_API_KEY);


// Initialize the client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// This is your prompt template
const PROMPT = `
You are a script breakdown assistant for film production.
Analyze the following script text and extract:
- Characters
- Props
- Locations (based on scene headings like INT. or EXT.)
- Wardrobe

Rules:
1. Return ONLY a clean JSON object.
2. JSON keys: "characters", "props", "locations", "wardrobe".
3. Each key has a list of unique strings.
4. If none found, return an empty list [].

Script:
---
{script_text}
---
`;

export async function getAiBreakdown(scriptText) {
  try {
    const prompt = PROMPT.replace("{script_text}", scriptText);

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // fast and accurate
      messages: [
        { role: "system", content: "You are a film script analysis assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content?.trim() || "{}";

    // Try to safely parse JSON
    const start = responseText.indexOf("{");
    const end = responseText.lastIndexOf("}");
    const jsonPart = responseText.slice(start, end + 1);

    return JSON.parse(jsonPart);
  } catch (error) {
    console.error("❌ GROQ AI Error:", error);
    throw new Error("Failed to get a valid response from the AI.");
  }
}
