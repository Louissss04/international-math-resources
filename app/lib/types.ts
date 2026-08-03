export type LocalizedText = {
  zh: string;
  en: string;
};

export type InformationStatus =
  | "confirmed"
  | "historical"
  | "pending"
  | "conflict";

export type Track =
  | "competition"
  | "modeling"
  | "research"
  | "summer"
  | "assessment";

export type SourceKind =
  | "official"
  | "official-data"
  | "official-archive"
  | "secondary-archive";

export type CostBand = "free" | "low" | "medium" | "high" | "varies";

export interface SourceRecord {
  id: string;
  label: LocalizedText;
  owner: LocalizedText;
  url: string;
  kind: SourceKind;
  verifiedAt: string;
  appliesTo?: string;
  note?: LocalizedText;
}

export interface FactRecord {
  label: LocalizedText;
  value: LocalizedText;
  status?: InformationStatus;
  sourceIds?: string[];
}

export interface DateRecord {
  id: string;
  label: LocalizedText;
  date: string;
  endDate?: string;
  time?: string;
  timezone?: string;
  region?: LocalizedText;
  status: InformationStatus;
  sourceIds: string[];
  note?: LocalizedText;
}

export interface TableRow {
  cells: LocalizedText[];
  status?: InformationStatus;
  sourceIds?: string[];
}

export interface DataTableRecord {
  title?: LocalizedText;
  columns: LocalizedText[];
  rows: TableRow[];
  note?: LocalizedText;
}

export interface ContentSection {
  id: string;
  title: LocalizedText;
  intro?: LocalizedText;
  paragraphs?: LocalizedText[];
  bullets?: LocalizedText[];
  tables?: DataTableRecord[];
}

export interface ThresholdRecord {
  id: string;
  projectId: string;
  year: string;
  sitting?: string;
  metric: LocalizedText;
  value: string;
  maxScore?: string;
  status: InformationStatus;
  sourceIds: string[];
  note?: LocalizedText;
}

export interface ProjectRecord {
  id: string;
  slug: string;
  track: Track;
  title: LocalizedText;
  shortTitle: string;
  organizer: LocalizedText;
  summary: LocalizedText;
  regions: string[];
  gradeBands: string[];
  eligibilityTags: string[];
  formatTags: string[];
  costBand: CostBand;
  status: InformationStatus;
  cycle: string;
  lastVerified: string;
  facts: FactRecord[];
  dates: DateRecord[];
  sections: ContentSection[];
  sourceIds: string[];
  relatedIds?: string[];
  searchTerms: string[];
}

export interface UniversityPolicyRecord {
  id: string;
  institution: LocalizedText;
  region: string;
  topic: LocalizedText;
  policy: LocalizedText;
  evidenceLevel: "required" | "recommended" | "accepted" | "context";
  applicableCycle: string;
  sourceIds: string[];
  lastVerified: string;
}

export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
