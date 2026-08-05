import type { AdmissionRequirementRecord, SourceRecord } from "../lib/types";
import {
  northAmericaAdmissionRequirements,
  northAmericaAdmissionRequirementSources,
} from "./admission-requirements-north-america";
import {
  ukAdmissionRequirements,
  ukAdmissionRequirementSources,
} from "./admission-requirements-uk";

export const admissionRequirementSources: SourceRecord[] = [
  ...ukAdmissionRequirementSources,
  ...northAmericaAdmissionRequirementSources,
];

export const admissionRequirementRecords: AdmissionRequirementRecord[] = [
  ...ukAdmissionRequirements,
  ...northAmericaAdmissionRequirements,
];
