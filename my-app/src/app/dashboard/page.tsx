"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileSearch, ArrowLeft } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [canAnalyze, setCanAnalyze] = useState(false);
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showRetryButton, setShowRetryButton] = useState(false);

  const router = useRouter();

  const handleFileSelect = (file: File) => {
    //console.log(file);
    setResume(file);
    setCanAnalyze(resume && jobDescription.trim() ? true : false);
  };

  const handleJobDescriptionTyping = (jobDescription: string): void => {
    //console.log(jobDescription.trim());
    setJobDescription(jobDescription.trim());
    setCanAnalyze(resume && jobDescription.trim() ? true : false);
  };

  const startAnalysis = async () => {
    if (!resume && !jobDescription.trim()) {
      return;
    }
    console.log("Start Analysis");
    setIsAnalyzing(true);
    setProgress(0);
    setErrorMessage("");
    setShowRetryButton(false);

    const formData = new FormData();
    formData.append("resume", resume as File);
    formData.append("jobDescription", jobDescription);

    let analysis: string | null = null;
    if (resume && jobDescription) {
      setProgress(25);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        setProgress(50);
        if (response.ok) {
          setProgress(75);
          const data = await response.json();
          analysis = data.analysis;
          router.push("/analysisDashboard");
        } else {
          setProgress(75);
          const errorData = await response.json();
          console.error("Analysis failed:", errorData.error);

          // Handle specific error types
          if (errorData.retryable) {
            setErrorMessage(errorData.error);
            setShowRetryButton(true);
          } else {
            setErrorMessage(
              errorData.error || "Analysis failed. Please try again."
            );
            setShowRetryButton(false);
          }
        }
      } catch (error) {
        setProgress(75);
        console.error("Error calling analysis API:", error);
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
        setShowRetryButton(true);
      }
    }
    setIsAnalyzing(false);
    setProgress(100);
  };

  return (
    <>
      <div className=" mx-auto space-y-8 text-center space-y-4">
        <h2>Upload Your Resume</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get instant feedback on how well your resume matches job requirements.
          Our AI-powered analyzer checks for skills, keywords, experience, and
          more.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResumeUploader
            onFileSelect={handleFileSelect}
            IsAnalyszing={isAnalyzing}
          />

          <JobDescriptionInput
            onJobDescriptionTyping={handleJobDescriptionTyping}
            IsAnalyszing={isAnalyzing}
          />
        </div>

        {isAnalyzing ? (
          <div className="text-center">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing your resume... This may take a few moments.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-red-800 text-sm">{errorMessage}</p>
                {showRetryButton && (
                  <p className="text-red-600 text-xs mt-1">
                    This is usually temporary. Please try again.
                  </p>
                )}
              </div>
            )}
            <Button
              onClick={startAnalysis}
              size="lg"
              className="px-8"
              disabled={!canAnalyze}
            >
              <FileSearch className="h-5 w-5 mr-2" />
              {showRetryButton ? "Try Again" : "Start Analysis"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
