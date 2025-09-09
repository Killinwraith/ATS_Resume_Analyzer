"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileSearch, ArrowLeft } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionInput from "@/components/JobDescriptionInput";

const Dashboard = () => {
  const handleFileSelect = (file: File) => {
    console.log(file);
  };

  const handleJobDescriptionSubmit = (jobDescription: string): void => {
    console.log(jobDescription);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 text-center space-y-4">
        <h2>Upload Your Resume</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get instant feedback on how well your resume matches job requirements.
          Our AI-powered analyzer checks for skills, keywords, experience, and
          more.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResumeUploader onFileSelect={handleFileSelect} />

          <JobDescriptionInput
            onJobDescriptionSubmit={handleJobDescriptionSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
