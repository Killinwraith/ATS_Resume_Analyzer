import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

console.log("GEMINI_API_KEY in API route: ", GEMINI_API_KEY);

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    console.log("Request: ", request);
    const formData = await request.formData();

    console.log("Form Data: ", formData);
    const resume = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    console.log("Resume: ", resume);

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Resume and job description are required" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    console.log("Resume: ", resume);
    console.log("Job Description: ", jobDescription);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `extract the skills from the resume and the job description: Resume: ${resume}; Job Description: ${jobDescription}`,
    });

    console.log("Analysis: ", response);

    return NextResponse.json({
      analysis: response.text,
      success: true,
    });
  } catch (error) {
    console.error("Error in resume analysis:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
