"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Analysis } from "@/models/Analysis";

interface AnalysisContextType {
  analysis: Analysis | null;
  setAnalysis: (analysis: Analysis | null) => void;
  clearAnalysis: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({
  children,
}) => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const value: AnalysisContextType = {
    analysis,
    setAnalysis,
    clearAnalysis,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
