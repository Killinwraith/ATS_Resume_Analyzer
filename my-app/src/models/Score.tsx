export class Score {
  overallScore: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordsMatch: number;

  constructor(
    overallScore: number,
    skillsMatch: number,
    experienceMatch: number,
    educationMatch: number,
    keywordsMatch: number
  ) {
    this.overallScore = overallScore || 0;
    this.skillsMatch = skillsMatch || 0;
    this.experienceMatch = experienceMatch || 0;
    this.educationMatch = educationMatch || 0;
    this.keywordsMatch = keywordsMatch || 0;
  }
}
