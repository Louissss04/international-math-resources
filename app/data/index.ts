import { competitionProjects, competitionSources, competitionThresholds } from "./competitions";
import { programProjects, programSources, programThresholds } from "./programs";
import { researchProgramLearningResources, researchProgramProjects, researchProgramSources } from "./research-programs";
import { researchSkillsLearningResources, researchSkillsProjects, researchSkillsSources } from "./research-skills";
import { journals, journalSources } from "./journals";
export { universityCompetitions } from "./university-competitions";
import { assessmentSources, assessmentThresholds, universityPolicies as policies } from "./assessments";
import { mathAssessmentProjects } from "./assessment-projects-math";
import { applyMathematicsThresholdScope } from "./assessment-thresholds-math";
import { competitionLearningResources } from "./learning-resources-competitions";
import { programLearningResources } from "./learning-resources-programs";
import { assessmentLearningResources } from "./learning-resources-assessments";
import { maaOtherCompetitionMaterials } from "./learning-resources-competition-materials-maa-other";
import { cemcCompetitionMaterials } from "./learning-resources-competition-materials-cemc";
import { ukmtCompetitionMaterials } from "./learning-resources-competition-materials-ukmt";
import { officialSpecimenAndSampleResources } from "./learning-resources-official-samples";
import { assessmentOfficialTextbooks } from "./learning-resources-assessment-textbooks";
import { applyMathematicsResourceScope } from "./learning-resources-math";
import { competitionVideoResources } from "./video-resources-competitions";
import { courseVideoResources } from "./video-resources-courses";
import { assessmentVideoResources } from "./video-resources-assessments";
import { competitionBookResources } from "./book-resources-competitions";
import { courseBookResources } from "./book-resources-courses";
import { assessmentBookResources } from "./book-resources-assessments";
import { mathAssessmentSyllabi } from "./assessment-syllabi-math";
import { maaOtherCompetitionSyllabi } from "./competition-syllabi-maa-other";
import { cemcCompetitionSyllabi } from "./competition-syllabi-cemc";
import { ukmtCompetitionSyllabi } from "./competition-syllabi-ukmt";
import { maaOtherPastPaperArchives } from "./past-papers-competition-maa-other";
import { cemcUkmtPastPaperArchives } from "./past-papers-competition-cemc-ukmt";
import { assessmentPastPaperArchives } from "./past-papers-assessments";
import { modelingPastPaperArchives } from "./past-papers-modeling";
import { apCourseLearningResources, apCoursePastPaperArchives, apCourseProjects, apCourseSources, apCourseSyllabi, apCourseThresholds } from "./course-data-ap";
import { cambridgeCourseLearningResources, cambridgeCoursePastPaperArchives, cambridgeCourseProjects, cambridgeCourseSources, cambridgeCourseSyllabi, cambridgeCourseThresholds } from "./course-data-cambridge";
import { ibCourseLearningResources, ibCoursePastPaperArchives, ibCourseProjects, ibCourseSources, ibCourseSyllabi, ibCourseThresholds } from "./course-data-ib";
import { edexcelCourseLearningResources, edexcelCoursePastPaperArchives, edexcelCourseProjects, edexcelCourseSources, edexcelCourseSyllabi, edexcelCourseThresholds } from "./course-data-edexcel";
import { europeAssessmentLearningResources, europeAssessmentPastPaperArchives, europeAssessmentProjects, europeAssessmentSources, europeAssessmentSyllabi, europeAssessmentThresholds } from "./assessment-data-europe";
import { australiaEuropeDestinationGuides, australiaEuropeDestinationSources } from "./destination-data-australia-europe";
import { northAmericaDestinationGuides, northAmericaDestinationSources } from "./destination-data-north-america";
import { ukSingaporeDestinationGuides, ukSingaporeDestinationSources } from "./destination-data-uk-singapore";
import { admissionRequirementRecords, admissionRequirementSources } from "./admission-requirements";
import {
  modelingCatalogLearningResources,
  modelingCatalogPastPaperArchives,
  modelingCatalogProjects,
  modelingCatalogSources,
  modelingCatalogThresholds,
} from "./modeling-catalog";
import type { AdmissionRequirementRecord, AssessmentSyllabusRecord, BookResourceRecord, DestinationGuideRecord, JournalRecord, LearningResourceRecord, PastPaperArchiveRecord, ProjectRecord, SourceRecord, ThresholdRecord, UniversityPolicyRecord, VideoResourceRecord } from "../lib/types";

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
  ...modelingCatalogProjects,
  ...researchSkillsProjects,
  ...researchProgramProjects,
  ...apCourseProjects,
  ...cambridgeCourseProjects,
  ...ibCourseProjects,
  ...edexcelCourseProjects,
  ...europeAssessmentProjects,
  ...mathAssessmentProjects,
]);

export const allJournals: JournalRecord[] = uniqueById(journals);

const projectIds = new Set(allProjects.map((project) => project.id));

export const allSources: SourceRecord[] = uniqueById([
  ...competitionSources,
  ...programSources,
  ...modelingCatalogSources,
  ...researchSkillsSources,
  ...researchProgramSources,
  ...journalSources,
  ...apCourseSources,
  ...cambridgeCourseSources,
  ...ibCourseSources,
  ...edexcelCourseSources,
  ...europeAssessmentSources,
  ...australiaEuropeDestinationSources,
  ...northAmericaDestinationSources,
  ...ukSingaporeDestinationSources,
  ...admissionRequirementSources,
  ...assessmentSources.filter((source) => !source.id.startsWith("toefl-") && !source.id.startsWith("ielts-")),
]);

export const allThresholds: ThresholdRecord[] = applyMathematicsThresholdScope(uniqueById([
  ...competitionThresholds,
  ...programThresholds,
  ...modelingCatalogThresholds,
  ...apCourseThresholds,
  ...cambridgeCourseThresholds,
  ...ibCourseThresholds,
  ...edexcelCourseThresholds,
  ...europeAssessmentThresholds,
  ...assessmentThresholds.filter((record) => projectIds.has(record.projectId)),
]));

export const allLearningResources: LearningResourceRecord[] = applyMathematicsResourceScope(uniqueById([
  ...competitionLearningResources,
  ...programLearningResources,
  ...modelingCatalogLearningResources,
  ...researchSkillsLearningResources,
  ...researchProgramLearningResources,
  ...apCourseLearningResources,
  ...cambridgeCourseLearningResources,
  ...ibCourseLearningResources,
  ...edexcelCourseLearningResources,
  ...europeAssessmentLearningResources,
  ...assessmentLearningResources,
  ...officialSpecimenAndSampleResources,
  ...assessmentOfficialTextbooks,
  ...maaOtherCompetitionMaterials,
  ...cemcCompetitionMaterials,
  ...ukmtCompetitionMaterials,
]).map((resource) => ({
  ...resource,
  projectIds: resource.projectIds.filter((projectId) => projectIds.has(projectId)),
})).filter((resource) => resource.projectIds.length > 0));

export const allVideoResources: VideoResourceRecord[] = uniqueById([
  ...competitionVideoResources,
  ...courseVideoResources,
  ...assessmentVideoResources,
]).map((resource) => ({
  ...resource,
  projectIds: resource.projectIds.filter((projectId) => projectIds.has(projectId)),
})).filter((resource) => resource.projectIds.length > 0);

const curatedBookResources: BookResourceRecord[] = uniqueById([
  ...competitionBookResources,
  ...courseBookResources,
  ...assessmentBookResources,
]).map((resource) => ({
  ...resource,
  projectIds: resource.projectIds.filter((projectId) => projectIds.has(projectId)),
})).filter((resource) => resource.projectIds.length > 0);

const migratedOfficialBooks: BookResourceRecord[] = allLearningResources
  .filter((resource) => resource.kind === "official-textbook")
  .filter((resource) => !curatedBookResources.some((book) => (
    book.url === resource.url
    && book.projectIds.some((projectId) => resource.projectIds.includes(projectId))
  )))
  .map((resource) => {
    const searchableText = `${resource.title.zh} ${resource.title.en} ${resource.description.zh} ${resource.description.en}`;
    const isRecommendation = /认可|推荐|书目|目录|endors|recommend|directory|book list/i.test(searchableText);
    return {
      id: `book-${resource.id}`,
      projectIds: resource.projectIds,
      title: resource.title,
      publisher: resource.provider,
      url: resource.url,
      authority: isRecommendation ? "official-endorsed" : "official",
      kind: isRecommendation ? "book-list" : "official-publication",
      access: resource.access,
      description: resource.description,
      note: resource.note,
      verifiedAt: resource.verifiedAt,
    };
  });

export const allBookResources: BookResourceRecord[] = uniqueById([
  ...migratedOfficialBooks,
  ...curatedBookResources,
]);

export const allCompetitionSyllabi: AssessmentSyllabusRecord[] = uniqueById([
  ...maaOtherCompetitionSyllabi,
  ...cemcCompetitionSyllabi,
  ...ukmtCompetitionSyllabi,
]);

export const allAssessmentSyllabi: AssessmentSyllabusRecord[] = uniqueById([
  ...mathAssessmentSyllabi,
  ...europeAssessmentSyllabi,
]);

export const allCurriculumSyllabi: AssessmentSyllabusRecord[] = uniqueById([
  ...apCourseSyllabi,
  ...cambridgeCourseSyllabi,
  ...ibCourseSyllabi,
  ...edexcelCourseSyllabi,
]);

export const allOfficialSyllabi: AssessmentSyllabusRecord[] = uniqueById([
  ...allCompetitionSyllabi,
  ...allCurriculumSyllabi,
  ...allAssessmentSyllabi,
]);

export const allPastPaperArchives: PastPaperArchiveRecord[] = uniqueById([
  ...maaOtherPastPaperArchives,
  ...cemcUkmtPastPaperArchives,
  ...assessmentPastPaperArchives,
  ...modelingPastPaperArchives,
  ...modelingCatalogPastPaperArchives,
  ...apCoursePastPaperArchives,
  ...cambridgeCoursePastPaperArchives,
  ...ibCoursePastPaperArchives,
  ...edexcelCoursePastPaperArchives,
  ...europeAssessmentPastPaperArchives,
]).filter((archive) => projectIds.has(archive.projectId));

export const universityPolicies: UniversityPolicyRecord[] = uniqueById(policies);

export const admissionRequirements: AdmissionRequirementRecord[] = uniqueById(admissionRequirementRecords);

export const destinationGuides: DestinationGuideRecord[] = uniqueById([
  ...northAmericaDestinationGuides,
  ...ukSingaporeDestinationGuides,
  ...australiaEuropeDestinationGuides,
]).sort((a, b) => {
  const order = [
    "united-states-undergraduate-mathematics-requirements",
    "uk-undergraduate-mathematics-admissions",
    "singapore-undergraduate-mathematics-admissions",
    "australia",
    "canada-undergraduate-mathematics-requirements",
    "europe-other",
  ];
  return order.indexOf(a.slug) - order.indexOf(b.slug);
});
