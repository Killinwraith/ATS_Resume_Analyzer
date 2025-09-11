import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import PDFParser from "pdf2json";
import fs from "fs/promises";
import { Analysis } from "@/models/Analysis";
import { CandidateInfo } from "@/models/CandidateInfo";
import { RequiredSkill } from "@/models/RequiredSkill";
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

  let jsonObject = JSON.parse(json);

  let fileName = resume.name;

  let candidateInfo = new CandidateInfo(
    jsonObject.CandidateName,
    jsonObject.CandidateEmail,
    jsonObject.CandidatePhone,
    jsonObject.CurrentLocation,
    `${jsonObject.TotalYearsExperience} years`,
    jsonObject.CurrentPosition
  );

  let requiredSkills: RequiredSkill[] = [];

  for (let item of jsonObject.JDListedSkills) {
    let name = item.Name;
    let type = item.Type;
    let _priority = item.Priority;

    let status = item.FoundInResume ? SkillStatus.FOUND : SkillStatus.MISSING;
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

  let recommendations: Recommendation[] = [];

  for (let item of jsonObject.Recommendations) {
    let type = item.type;
    let title = item.title;
    let description = item.description;
    let impact = item.impact;

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

    let recommendation = new Recommendation(Type, title, description, Impact);
    recommendations.push(recommendation);
  }

  let overallScore = jsonObject.OverallScore;
  let skillsMatch = jsonObject.CategoryScores.SkillsMatch;
  let experienceMatch = jsonObject.CategoryScores.ExperienceMatch;
  let educationMatch = jsonObject.CategoryScores.EducationMatch;
  let keywordsMatch = jsonObject.CategoryScores.KeywordsMatch;

  let score = new Score(
    overallScore,
    skillsMatch,
    experienceMatch,
    educationMatch,
    keywordsMatch
  );

  let additionalResumeSkills: string[] = jsonObject.AdditionalResumeSkills;

  let analysis = new Analysis(
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

    let prompt = await fs.readFile("./src/app/api/analyze/prompt.txt", "utf8");

    prompt = `${prompt} \n Resume: ${resumeText}; Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    //console.log("Response: ", response.text);
    //console.log("Response: ", response);

    let analysis: Analysis = convertJsonToAnalysis(resume, response.text);

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
