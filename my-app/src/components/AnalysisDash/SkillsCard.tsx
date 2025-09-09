import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillStatus, SkillImportance } from "@/models/Constants";
import { RequiredSkill } from "@/models/RequiredSkill";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface SkillsCardProps {
  requiredSkills: RequiredSkill[];
  additionalSkills: string[];
}

const getSkillStatusColor = (status: SkillStatus) => {
  switch (status) {
    case SkillStatus.FOUND:
      return "text-green-600";
    case SkillStatus.PARTIALLY_FOUND:
      return "text-yellow-600";
    case SkillStatus.MISSING:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};
const getSkillImportanceBadge = (importance: SkillImportance) => {
  switch (importance) {
    case SkillImportance.HIGH:
      return "destructive";
    case SkillImportance.MEDIUM:
      return "secondary";
    case SkillImportance.LOW:
      return "outline";
    default:
      return "outline";
  }
};

const getStatusIcon = (status: SkillStatus) => {
  switch (status) {
    case SkillStatus.FOUND:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case SkillStatus.MISSING:
      return <XCircle className="h-4 w-4 text-red-600" />;
    case SkillStatus.PARTIALLY_FOUND:
      return <Clock className="h-4 w-4 text-yellow-600" />;
  }
};

const SkillsCard = ({ requiredSkills, additionalSkills }: SkillsCardProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Found{" "}
            {
              requiredSkills.filter(
                (skill) => skill.status === SkillStatus.FOUND
              ).length
            }{" "}
            Skills out of {requiredSkills.length} Required Skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-3">Required Skills</h4>
            <div className="space-y-2">
              {requiredSkills.map((skill, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(skill.status)}
                      <span className="text-sm">{skill.name}</span>
                    </div>
                    <Badge
                      variant={getSkillImportanceBadge(skill.importance)}
                      className="text-xs"
                    >
                      {skill.importance}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {additionalSkills.length > 0 && (
            <div>
              <h4 className="mb-3">Additional Skills Found</h4>
              <div className="flex flex-wrap gap-2">
                {additionalSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SkillsCard;
