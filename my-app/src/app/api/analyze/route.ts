import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import PDFParser from "pdf2json";
import fs from "fs/promises";
import { Analysis } from "@/models/Analysis";
import { CandidateInfo } from "@/models/CandidateInfo";
import { RequiredSkill } from "@/models/RequiredSkill";
import path from "path";
import {
  RecommendationImpact,
  RecommendationType,
  SkillImportance,
  SkillStatus,
} from "@/models/Constants";
import { Recommendation } from "@/models/Recommendation";
import { Score } from "@/models/Score";

interface ApiError {
  error?: {
    code?: number;
    status?: string;
  };
  message?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const promptPath = path.join(
  process.cwd(),
  "src",
  "app",
  "api",
  "analyze",
  "prompt.txt"
);

function parsePdf(fileBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
      reject(errData.parserError);
    });

    pdfParser.on(
      "pdfParser_dataReady",
      (pdfData: {
        Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }>;
      }) => {
        const pages = pdfData.Pages.map((page) =>
          page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(" ")
        ).join("\n\n");

        resolve(cleanPdfText(pages));
      }
    );

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

function convertJsonToAnalysis(
  resume: File,
  json: string | undefined
): Analysis {
  if (!json) {
    return new Analysis(
      "No analysis",
      new CandidateInfo("", "", "", "", "", ""),
      [],
      [],
      new Score(0, 0, 0, 0, 0),
      []
    );
  }

  json = json.replace("```json", "").replace("```", "");

  //console.log("Json: ", json);

  const jsonObject = JSON.parse(json);

  const fileName = resume.name;

  const candidateInfo = new CandidateInfo(
    jsonObject.CandidateName,
    jsonObject.CandidateEmail,
    jsonObject.CandidatePhone,
    jsonObject.CurrentLocation,
    `${jsonObject.TotalYearsExperience} years`,
    jsonObject.CurrentPosition
  );

  const requiredSkills: RequiredSkill[] = [];

  for (const item of jsonObject.JDListedSkills) {
    const name = item.Name;
    const _priority = item.Priority;

    const status = item.FoundInResume ? SkillStatus.FOUND : SkillStatus.MISSING;
    let priority = SkillImportance.LOW;
    switch (_priority) {
      case "High":
        priority = SkillImportance.HIGH;
        break;
      case "Medium":
        priority = SkillImportance.MEDIUM;
        break;
      case "Low":
        priority = SkillImportance.LOW;
        break;
      default:
        priority = SkillImportance.LOW;
        break;
    }
    requiredSkills.push(new RequiredSkill(name, status, priority));
  }

  const recommendations: Recommendation[] = [];

  for (const item of jsonObject.Recommendations) {
    const title = item.title;
    const description = item.description;
    const impact = item.impact;
    const type = item.type;

    let Type = RecommendationType.CRITICAL;
    switch (type) {
      case "Critical":
        Type = RecommendationType.CRITICAL;
        break;
      case "Improvement":
        Type = RecommendationType.IMPROVEMENT;
        break;
    }
    let Impact = RecommendationImpact.HIGH;
    switch (impact) {
      case "High":
        Impact = RecommendationImpact.HIGH;
        break;
      case "Medium":
        Impact = RecommendationImpact.MEDIUM;
        break;
      case "Low":
        Impact = RecommendationImpact.LOW;
        break;
    }

    const recommendation = new Recommendation(Type, title, description, Impact);
    recommendations.push(recommendation);
  }

  const overallScore = jsonObject.OverallScore;
  const skillsMatch = jsonObject.CategoryScores.SkillsMatch;
  const experienceMatch = jsonObject.CategoryScores.ExperienceMatch;
  const educationMatch = jsonObject.CategoryScores.EducationMatch;
  const keywordsMatch = jsonObject.CategoryScores.KeywordsMatch;

  const score = new Score(
    overallScore,
    skillsMatch,
    experienceMatch,
    educationMatch,
    keywordsMatch
  );

  const additionalResumeSkills: string[] = jsonObject.AdditionalResumeSkills;

  const analysis = new Analysis(
    fileName,
    candidateInfo,
    requiredSkills,
    recommendations,
    score,
    additionalResumeSkills
  );
  return analysis;
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

    let prompt = await fs.readFile(promptPath, "utf8");

    prompt = `${prompt} \n Resume: ${resumeText}; Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    //console.log("Response: ", response.text);
    //console.log("Response: ", response);

    const analysis: Analysis = convertJsonToAnalysis(resume, response.text);

    return NextResponse.json({
      analysis,
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error in resume analysis:", error);

    // Handle Google Gemini API overload error (503)
    if (
      (error as ApiError)?.error?.code === 503 ||
      (error as ApiError)?.error?.status === "UNAVAILABLE"
    ) {
      return NextResponse.json(
        {
          error:
            "The AI service is currently overloaded. Please try again in a few moments.",
          code: "SERVICE_OVERLOADED",
          retryable: true,
        },
        { status: 503 }
      );
    }

    // Handle other API errors
    if ((error as ApiError)?.error?.code) {
      return NextResponse.json(
        {
          error: "AI service temporarily unavailable. Please try again later.",
          code: "AI_SERVICE_ERROR",
          retryable: true,
        },
        { status: 503 }
      );
    }

    // Handle PDF parsing errors
    if (
      (error as ApiError)?.message?.includes("pdf") ||
      (error as ApiError)?.message?.includes("PDF")
    ) {
      return NextResponse.json(
        {
          error:
            "Failed to process PDF file. Please ensure it's a valid PDF document.",
        },
        { status: 400 }
      );
    }

    // Generic error fallback
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try again." },
      { status: 500 }
    );
  }
}
