import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  //CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploaderProps {
  onFileSelect: (file: File) => void;
}

const ResumeUploader = ({ onFileSelect }: ResumeUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      onFileSelect(file);
    }
  };
  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume to get instant feedback on how well it matches
            job requirements.
          </CardDescription>
          {/** <CardAction>Card Action</CardAction> */}
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="mb-2">Drag and drop your resume here, or</p>
              <Button variant="outline" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Choose File
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    hidden
                    onChange={handleFileInput}
                  />
                </label>
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Supported format: PDF, DOCX, DOC (max 10MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p>{uploadedFile?.name}</p>
                  <p className="text-sm text-muted-foreground text-left">
                    {uploadedFile
                      ? (uploadedFile.size / 1024 / 1024).toFixed(2)
                      : 0}
                    MB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default ResumeUploader;
