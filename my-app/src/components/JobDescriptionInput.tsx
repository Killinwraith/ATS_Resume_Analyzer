import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardAction,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

interface jobDescriptionInputProps {
  onJobDescriptionTyping: (description: string) => void;
  IsAnalyszing: boolean;
}

const JobDescriptionInput = ({
  onJobDescriptionTyping,
  IsAnalyszing,
}: jobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState("");

  const handleJobDescriptionChange = (e: string) => {
    const text = e;
    setJobDescription(text);
    onJobDescriptionTyping(text);
  };

  const wordCount = jobDescription
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Paste the job description to analyze resume compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm font-bold text-left">Job Description</p>
            <Textarea
              placeholder="Paste the job description to analyze resume compatibility"
              onChange={(e) => handleJobDescriptionChange(e.target.value)}
              value={jobDescription}
              className="min-h-[250px] max-h-[400px]"
              disabled={IsAnalyszing}
            />
            <p className="text-sm text-muted-foreground text-left">
              {wordCount} words
            </p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default JobDescriptionInput;
