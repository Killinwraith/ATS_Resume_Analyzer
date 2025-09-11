import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Score } from "@/models/Score";

interface ScoreCardProps {
  score: Score;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBadge = (score: number) => {
  if (score >= 80) return { label: "Excellent", variant: "default" as const };
  if (score >= 60) return { label: "Good", variant: "secondary" as const };
  return { label: "Needs Improvement", variant: "destructive" as const };
};

const ScoreCard = ({ score }: ScoreCardProps) => {
  const badge = getScoreBadge(score.overallScore);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`${getScoreColor(score.overallScore)} mb-2`}>
              {score.overallScore}%
            </div>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Skills Match</span>
                <span className={`text-sm ${getScoreColor(score.skillsMatch)}`}>
                  {score.skillsMatch}%
                </span>
              </div>
              <Progress value={score.skillsMatch} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Experience Match</span>
                <span
                  className={`text-sm ${getScoreColor(score.experienceMatch)}`}
                >
                  {score.experienceMatch}%
                </span>
              </div>
              <Progress value={score.experienceMatch} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Education Match</span>
                <span
                  className={`text-sm ${getScoreColor(score.educationMatch)}`}
                >
                  {score.educationMatch}%
                </span>
              </div>
              <Progress value={score.educationMatch} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Keywords Match</span>
                <span
                  className={`text-sm ${getScoreColor(score.keywordsMatch)}`}
                >
                  {score.keywordsMatch}%
                </span>
              </div>
              <Progress value={score.keywordsMatch} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreCard;
