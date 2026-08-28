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

export type JournalType =
  | "youth-research-journal"
  | "student-research-journal"
  | "professional-research-journal"
  | "expository-journal"
  | "problem-solving-publication"
  | "showcase-magazine";

export type JournalAudienceScope =
  | "secondary-only"
  | "secondary-and-undergraduate"
  | "students-general"
  | "no-age-restriction"
  | "eligibility-unclear";

export type JournalReviewModel =
  | "professional-peer-review"
  | "student-peer-review"
  | "editorial-review"
  | "editorial-screening"
  | "mixed"
  | "not-stated";

export type JournalSubmissionStatus =
  | "open-rolling"
  | "open-window"
  | "closed"
  | "paused"
  | "historical"
  | "unclear";

export type JournalOutcomeType =
  | "problem-solution-credit"
  | "editor-selected-article"
  | "peer-reviewed-research-paper"
  | "mixed";

export type JournalFeeCategory =
  | "no-fee"
  | "optional-fee"
  | "paid-required"
  | "varies"
  | "unclear";

export type JournalLinkKind =
  | "home"
  | "author-guidelines"
  | "submission-portal"
  | "template"
  | "fees"
  | "ethics"
  | "archive"
  | "sample-article";

export type JournalArticleType =
  | "original-research"
  | "expository-paper"
  | "modeling-paper"
  | "problem-solution"
  | "review-survey"
  | "computational-project"
  | "short-note";

export type JournalTopicTag =
  | "algebra"
  | "number-theory"
  | "geometry-topology"
  | "combinatorics-graph-theory"
  | "analysis-calculus"
  | "probability-statistics"
  | "applied-modeling"
  | "data-computation"
  | "mathematics-education"
  | "history-philosophy-exposition"
  | "general-mathematics"
  | "interdisciplinary-stem";

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

export interface JournalLinkRecord {
  label: LocalizedText;
  url: string;
  kind: JournalLinkKind;
  note?: LocalizedText;
}

export interface JournalRecord {
  id: string;
  slug: string;
  title: LocalizedText;
  shortTitle: string;
  publisher: LocalizedText;
  summary: LocalizedText;
  journalType: JournalType;
  audienceScope: JournalAudienceScope;
  topicTags: JournalTopicTag[];
  articleTypes: JournalArticleType[];
  languages: LocalizedText[];
  reviewModel: JournalReviewModel;
  submissionStatus: JournalSubmissionStatus;
  submissionSchedule: LocalizedText;
  outcomeType: JournalOutcomeType;
  feeCategory: JournalFeeCategory;
  studentEligibility: LocalizedText;
  mentorPolicy: LocalizedText;
  fees: LocalizedText;
  copyrightPolicy: LocalizedText;
  status: InformationStatus;
  facts: FactRecord[];
  sections: ContentSection[];
  links: JournalLinkRecord[];
  sourceIds: string[];
  relatedProjectIds?: string[];
  lastVerified: string;
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

export interface ProjectAlertRecord {
  title: LocalizedText;
  body: LocalizedText;
  sourceIds: string[];
  tone?: "warning" | "critical";
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
  alerts?: ProjectAlertRecord[];
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

export type AdmissionRequirementType =
  | "required"
  | "required-alternative"
  | "offer-condition"
  | "recommended"
  | "considered";

export type AdmissionRequirementStage =
  | "application"
  | "shortlisting"
  | "offer"
  | "qualification";

export interface AdmissionRequirementProgram {
  name: LocalizedText;
  code?: string;
  note?: LocalizedText;
}

export interface AdmissionRequirementRecord {
  id: string;
  institution: LocalizedText;
  countryCode: string;
  country: LocalizedText;
  programs: AdmissionRequirementProgram[];
  projectIds: string[];
  examLabels?: LocalizedText[];
  requirementType: AdmissionRequirementType;
  stage: AdmissionRequirementStage;
  requirement: LocalizedText;
  scoreCondition?: LocalizedText;
  exception?: LocalizedText;
  applicableCycle: LocalizedText;
  status: InformationStatus;
  sourceIds: string[];
  lastVerified: string;
  searchTerms?: string[];
}

export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
