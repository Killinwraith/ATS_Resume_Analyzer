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
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Calendar, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScoreCard from "@/components/AnalysisDash/ScoreCard";
import SkillsCard from "@/components/AnalysisDash/SkillsCard";
import RecomendationCard from "@/components/AnalysisDash/RecomendationCard";
import { useAnalysis } from "@/contexts/AnalysisContext";

const AnalysisDashboard = () => {
  const router = useRouter();
  const { analysis, isLoading, error, clearAnalysis } = useAnalysis();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !analysis) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 mb-4">
              {error || "No analysis data available"}
            </p>
            <div className="space-x-2">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={clearAnalysis} variant="default">
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the analysis
  const fileName = analysis.fileName;
  const candidateInfo = analysis.candidateInfo;
  const additionalSkills = analysis.additionalSkills;
  const requiredSkills = analysis.requiredSkills;
  const recommendations = analysis.recommendations;
  const score = analysis.score;

  const handleGoBack = () => {
    clearAnalysis();
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

        <ScoreCard score={score} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkillsCard
            requiredSkills={requiredSkills}
            additionalSkills={additionalSkills}
          />
          <RecomendationCard recommendations={recommendations} />
        </div>
      </div>
    </>
  );
};

export default AnalysisDashboard;
