import { competitionProjects, competitionSources, competitionThresholds } from "./competitions";
import { programProjects, programSources, programThresholds } from "./programs";
import { assessmentProjects, assessmentSources, assessmentThresholds, universityPolicies as policies } from "./assessments";
import type { ProjectRecord, SourceRecord, ThresholdRecord, UniversityPolicyRecord } from "../lib/types";

function uniqueById<T extends { id: string }>(records: T[]): T[] {
  const seen = new Set<string>();
  return records.filter((record) => {
    if (seen.has(record.id)) return false;
    seen.add(record.id);
    return true;
  });
}

export const allProjects: ProjectRecord[] = uniqueById([
  ...competitionProjects,
  ...programProjects,
  ...assessmentProjects,
]);

export const allSources: SourceRecord[] = uniqueById([
  ...competitionSources,
  ...programSources,
  ...assessmentSources,
]);

export const allThresholds: ThresholdRecord[] = uniqueById([
  ...competitionThresholds,
  ...programThresholds,
  ...assessmentThresholds,
]);

export const universityPolicies: UniversityPolicyRecord[] = uniqueById(policies);
