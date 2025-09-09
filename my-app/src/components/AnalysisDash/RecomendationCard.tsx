import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/models/Recommendation";
import { RecommendationType, RecommendationImpact } from "@/models/Constants";

interface RecomendationCardProps {
  recommendations: Recommendation[];
}

const getTypeBadge = (type: RecommendationType) => {
  switch (type) {
    case RecommendationType.CRITICAL:
      return { label: "Critical", variant: "destructive" as const };
    case RecommendationType.IMPROVEMENT:
      return { label: "Improvement", variant: "default" as const };
    case RecommendationType.OPTIMIZATION:
      return { label: "Optimization", variant: "secondary" as const };
    case RecommendationType.ENHANCEMENT:
      return { label: "Enhancement", variant: "outline" as const };
  }
};

const getImpactBadge = (impact: RecommendationImpact) => {
  switch (impact) {
    case RecommendationImpact.HIGH:
      return "destructive";
    case RecommendationImpact.MEDIUM:
      return "secondary";
    case RecommendationImpact.LOW:
      return "outline";
  }
};

const RecomendationCard = ({ recommendations }: RecomendationCardProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Suggested Improvements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => {
              const typeBadge = getTypeBadge(recommendation.type);
              return (
                <div key={index} className="p-4 rounded-lg border bg-card/50">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5>{recommendation.title}</h5>
                        <div className="flex gap-2">
                          <Badge
                            variant={typeBadge.variant}
                            className="text-xs"
                          >
                            {typeBadge.label}
                          </Badge>
                          <Badge
                            variant={getImpactBadge(recommendation.impact)}
                            className="text-xs"
                          >
                            {recommendation.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecomendationCard;
