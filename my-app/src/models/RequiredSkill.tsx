import { SkillImportance, SkillStatus } from "./Constants";

export class RequiredSkill {
  name: string;
  status: SkillStatus;
  importance: SkillImportance;

  constructor(name: string, status: SkillStatus, importance: SkillImportance) {
    this.name = name;
    this.status = status || SkillStatus.MISSING;
    this.importance = importance || SkillImportance.LOW;
  }
}
