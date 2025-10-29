import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

   const prompt = `
Generate a quiz in JSON format with 5 questions about AI.
Each question must include:
- question
- 4 options
- correctAnswer
- explanation (why that answer is correct)

Output format:
{
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}



      Return only valid JSON, no explanations or markdown.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Try parsing the text as JSON safely
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);

    let quizData;
    try {
      quizData = JSON.parse(jsonString);
    } catch (err) {
      console.error("JSON Parse Error:", err);
      return NextResponse.json({ error: "AI did not return valid quiz format" }, { status: 500 });
    }

    return NextResponse.json(quizData);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
