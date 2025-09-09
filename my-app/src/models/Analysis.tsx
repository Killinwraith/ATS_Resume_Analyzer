import { CandidateInfo } from "./CandidateInfo";
import { RequiredSkill } from "./RequiredSkill";
import { Recommendation } from "./Recommendation";
import { Score } from "./Score";

export class Analysis {
  fileName: string;
  candidateInfo: CandidateInfo;
  requiredSkills: RequiredSkill[];
  recommendations: Recommendation[];
  score: Score;
  additionalSkills: string[];

  constructor(
    fileName: string,
    candidateInfo: CandidateInfo,
    requiredSkills: RequiredSkill[],
    recommendations: Recommendation[],
    score: Score,
    additionalSkills: string[]
  ) {
    this.fileName = fileName;
    this.candidateInfo = candidateInfo;
    this.requiredSkills = requiredSkills;
    this.recommendations = recommendations;
    this.score = score;
    this.additionalSkills = additionalSkills;
  }
}
