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
  | "curriculum"
  | "assessment";

export type SourceKind =
  | "official"
  | "official-data"
  | "official-archive"
  | "secondary-archive";

export type CostBand = "free" | "low" | "medium" | "high" | "varies";

export type LearningResourceKind =
  | "past-papers"
  | "sample-questions"
  | "official-guide"
  | "official-textbook"
  | "practice-platform"
  | "courseware"
  | "application-materials"
  | "results-and-exemplars";

export type LearningResourceAccess = "free" | "account" | "mixed" | "paid" | "school";

export interface LearningResourceRecord {
  id: string;
  projectIds: string[];
  title: LocalizedText;
  provider: LocalizedText;
  url: string;
  kind: LearningResourceKind;
  description: LocalizedText;
  access: LearningResourceAccess;
  note?: LocalizedText;
  verifiedAt: string;
}

export type VideoResourceAuthority = "official" | "official-partner" | "third-party";

export type VideoResourceFormat =
  | "course"
  | "playlist"
  | "lecture-series"
  | "problem-walkthroughs"
  | "test-familiarisation"
  | "webinar";

export type VideoResourceAccess = "free" | "free-account" | "mixed";

export interface VideoResourceRecord {
  id: string;
  projectIds: string[];
  title: LocalizedText;
  provider: LocalizedText;
  url: string;
  authority: VideoResourceAuthority;
  format: VideoResourceFormat;
  platform: string;
  language: LocalizedText;
  access: VideoResourceAccess;
  description: LocalizedText;
  note?: LocalizedText;
  verifiedAt: string;
}

export type BookResourceAuthority = "official" | "official-endorsed" | "third-party";

export type BookResourceKind =
  | "official-publication"
  | "endorsed-textbook"
  | "textbook"
  | "problem-book"
  | "workbook"
  | "reference-book"
  | "book-list";

export interface BookResourceRecord {
  id: string;
  projectIds: string[];
  title: LocalizedText;
  authors?: LocalizedText;
  publisher: LocalizedText;
  url: string;
  authority: BookResourceAuthority;
  kind: BookResourceKind;
  language?: LocalizedText;
  edition?: LocalizedText;
  isbn?: string;
  access: LearningResourceAccess;
  description: LocalizedText;
  note?: LocalizedText;
  verifiedAt: string;
}

export type PastPaperAvailability =
  | "official"
  | "secondary"
  | "sample-only"
  | "restricted"
  | "not-found";

export type PastPaperLinkAuthority = "official" | "secondary";

export type PastPaperLinkKind =
  | "archive"
  | "download-page"
  | "specimen"
  | "solutions"
  | "index";

export interface PastPaperLinkRecord {
  title: LocalizedText;
  provider: LocalizedText;
  url: string;
  authority: PastPaperLinkAuthority;
  kind: PastPaperLinkKind;
  access: LearningResourceAccess;
  note?: LocalizedText;
}

export interface PastPaperArchiveRecord {
  id: string;
  projectId: string;
  availability: PastPaperAvailability;
  summary: LocalizedText;
  links: PastPaperLinkRecord[];
  lastVerified: string;
}

export type SyllabusClassification = "formal-specification" | "content-framework" | "structure-only";

export interface SyllabusSourceRecord {
  title: LocalizedText;
  provider: LocalizedText;
  url: string;
  format: "webpage" | "pdf" | "platform";
  version?: LocalizedText;
  note?: LocalizedText;
}

export interface AssessmentSyllabusRecord {
  id: string;
  slug: string;
  projectId: string;
  classification: SyllabusClassification;
  title: LocalizedText;
  officialName: LocalizedText;
  applicableCycle: LocalizedText;
  effectiveFrom?: string;
  status: InformationStatus;
  summary: LocalizedText;
  facts: FactRecord[];
  sections: ContentSection[];
  sources: SyllabusSourceRecord[];
  translationNote: LocalizedText;
  lastVerified: string;
}

export type OfficialSyllabusRecord = AssessmentSyllabusRecord;

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

export interface DestinationGuideRecord {
  id: string;
  slug: string;
  title: LocalizedText;
  shortTitle: LocalizedText;
  summary: LocalizedText;
  facts: FactRecord[];
  sections: ContentSection[];
  sourceIds: string[];
  relatedProjectIds: string[];
  lastVerified: string;
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
