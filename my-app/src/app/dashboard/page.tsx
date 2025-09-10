"use client";
import React, { useState } from "react";
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
          console.log("Analysis successful:", analysis);
        } else {
          setProgress(75);
          const errorData = await response.json();
          console.error("Analysis failed:", errorData.error);
        }
      } catch (error) {
        setProgress(75);
        console.error("Error calling analysis API:", error);
      }
    }
    setIsAnalyzing(false);
    setProgress(100);
    console.log(analysis);

    router.push("/analysisDashboard");
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
          <ResumeUploader onFileSelect={handleFileSelect} IsAnalyszing={isAnalyzing}/>

          <JobDescriptionInput
            onJobDescriptionTyping={handleJobDescriptionTyping}
            IsAnalyszing={isAnalyzing}
          />
        </div>

        {isAnalyzing ? (
          <div className="text-center">
            <Progress value={progress} />
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={startAnalysis} size="lg" className="px-8">
              <FileSearch className="h-5 w-5 mr-2" />
              Start Analysis
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
