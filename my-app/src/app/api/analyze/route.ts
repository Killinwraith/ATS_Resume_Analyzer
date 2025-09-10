import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import PDFParser from "pdf2json";
import fs from "fs/promises";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function parsePdf(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      reject(errData.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      const pages = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) => decodeURIComponent(t.R[0].T)).join(" ")
      ).join("\n\n");

      resolve(cleanPdfText(pages));
    });

    pdfParser.parseBuffer(fileBuffer);
  });
}

function cleanPdfText(text: string): string {
  // Collapse spaces between letters like "A u r o r a" → "Aurora"
  return text
    .replace(/\b(\w)\s(?=\w\b)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription");

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

    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await parsePdf(buffer);

    let prompt = await fs.readFile("./src/app/api/analyze/prompt.txt", "utf8");

    prompt = `${prompt} \n Resume: ${resumeText}; Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

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
