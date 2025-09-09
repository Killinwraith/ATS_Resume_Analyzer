import { RecommendationType, RecommendationImpact } from "./Constants";

export class Recommendation {
  type: RecommendationType;
  title: string;
  description: string;
  impact: RecommendationImpact;

  constructor(
    type: RecommendationType,
    title: string,
    description: string,
    impact: RecommendationImpact
  ) {
    this.type = type;
    this.title = title;
    this.description = description;
    this.impact = impact;
  }
}
