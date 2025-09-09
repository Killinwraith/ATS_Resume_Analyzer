"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { RequiredSkill } from "@/models/RequiredSkill";
import { Recommendation } from "@/models/Recommendation";
import { CandidateInfo } from "@/models/CandidateInfo";
import { Analysis } from "@/models/Analysis";
import { Score } from "@/models/Score";
import {
  SkillStatus,
  SkillImportance,
  RecommendationImpact,
  RecommendationType,
} from "@/models/Constants";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardAction,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreCard from "@/components/AnalysisDash/ScoreCard";
import SkillsCard from "@/components/AnalysisDash/SkillsCard";
import RecomendationCard from "@/components/AnalysisDash/RecomendationCard";

interface AnalysisDashboardProps {
  analysis: Analysis;
}

const AnalysisDashboard = ({ analysis }: AnalysisDashboardProps) => {
  {
    /**MOCK DATA */
  }
  const router = useRouter();

  let fileName = "mock_resume.pdf";
  let candidateInfo: CandidateInfo;
  let additionalSkills: string[];
  let requiredSkills: RequiredSkill[];
  let recommendations: Recommendation[];
  let score: Score;

  if (!analysis) {
    fileName = "mock_resume.pdf";
    candidateInfo = new CandidateInfo(
      "John Doe",
      "john.doe@example.com",
      "1234567890",
      "New York, NY",
      "5 years",
      "Software Engineer"
    );
    additionalSkills = [
      "JavaScript",
      "HTML/CSS",
      "Git",
      "Webpack",
      "Jest",
      "Redux",
      "Tailwind CSS",
      "Figma",
    ];
    requiredSkills = [
      new RequiredSkill("React", SkillStatus.FOUND, SkillImportance.HIGH),
      new RequiredSkill("TypeScript", SkillStatus.FOUND, SkillImportance.HIGH),
      new RequiredSkill(
        "Node.js",
        SkillStatus.PARTIALLY_FOUND,
        SkillImportance.MEDIUM
      ),
      new RequiredSkill("GraphQL", SkillStatus.MISSING, SkillImportance.MEDIUM),
      new RequiredSkill("Docker", SkillStatus.MISSING, SkillImportance.LOW),
      new RequiredSkill("AWS", SkillStatus.FOUND, SkillImportance.MEDIUM),
      new RequiredSkill("Python", SkillStatus.MISSING, SkillImportance.HIGH),
      new RequiredSkill("Kubernetes", SkillStatus.MISSING, SkillImportance.LOW),
    ];
    recommendations = [
      new Recommendation(
        RecommendationType.CRITICAL,
        "Add React Experience",
        "This role requires React expertise. Consider highlighting any React projects or adding relevant coursework.",
        RecommendationImpact.HIGH
      ),
      new Recommendation(
        RecommendationType.CRITICAL,
        "Add Node.js Experience",
        "This role requires Node.js expertise. Consider highlighting any Node.js projects or adding relevant coursework.",
        RecommendationImpact.HIGH
      ),
      new Recommendation(
        RecommendationType.CRITICAL,
        "Add MongoDB Experience",
        "This role requires MongoDB expertise. Consider highlighting any MongoDB projects or adding relevant coursework.",
        RecommendationImpact.HIGH
      ),
      new Recommendation(
        RecommendationType.CRITICAL,
        "Add Python Experience",
        "This role requires Python expertise. Consider highlighting any Python projects or adding relevant coursework.",
        RecommendationImpact.HIGH
      ),
      new Recommendation(
        RecommendationType.IMPROVEMENT,
        "Quantify Achievements",
        "Add specific metrics and numbers to your accomplishments (e.g., 'Improved page load time by 40%').",
        RecommendationImpact.HIGH
      ),
      new Recommendation(
        RecommendationType.OPTIMIZATION,
        "Include GraphQL Projects",
        "Mention any GraphQL experience or projects to better match job requirements.",
        RecommendationImpact.MEDIUM
      ),
      new Recommendation(
        RecommendationType.ENHANCEMENT,
        "Add Industry Keywords",
        "Include more industry-specific terms like 'scalable architecture' and 'microservices'.",
        RecommendationImpact.MEDIUM
      ),
      new Recommendation(
        RecommendationType.ENHANCEMENT,
        "Add more keywords",
        "Include more industry-specific terms like 'scalable architecture' and 'microservices'.",
        RecommendationImpact.MEDIUM
      ),
    ];

    score = new Score(82, 75, 85, 70, 90);
  } else {
    fileName = analysis.fileName;
    candidateInfo = analysis.candidateInfo;
    additionalSkills = analysis.additionalSkills;
    requiredSkills = analysis.requiredSkills;
    recommendations = analysis.recommendations;
    score = analysis.score;
  }

  const handleGoBack = () => {
    window.history.back();

    router.push("/dashboard");
  };

  return (
    <>
      <div className="flex flex-col text-left gap-2">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume Analysis Results
            </CardTitle>
            <CardDescription>Analysis for {fileName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{candidateInfo.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{candidateInfo.location}</span>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{candidateInfo.experience} experience</span>
                </div>
                <Badge variant="secondary">{candidateInfo.currentRole}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ScoreCard score={score} />
          </div>

          <div className="lg:col-span-2">
            <SkillsCard
              requiredSkills={requiredSkills}
              additionalSkills={additionalSkills}
            />
          </div>
        </div>

        <RecomendationCard recommendations={recommendations} />
      </div>
    </>
  );
};

export default AnalysisDashboard;
