import { t, type LocalizedText, type SyllabusClassification, type SyllabusSourceRecord } from "./types";

export const syllabusClassificationLabels: Record<SyllabusClassification, LocalizedText> = {
  "formal-specification": t("正式官方考纲", "Formal official specification"),
  "content-framework": t("官方内容框架", "Official content framework"),
  "structure-only": t("仅公布范围与结构", "Published scope and structure only"),
};

export const syllabusClassificationDescriptions: Record<SyllabusClassification, LocalizedText> = {
  "formal-specification": t("主办方发布了可逐项核对的知识范围、内容说明或课程与考试说明。", "The organiser publishes a topic-level specification, content description, or course and exam description."),
  "content-framework": t("主办方说明了测试领域和题型，但没有发布逐知识点的封闭考纲。", "The organiser defines tested domains and question types but does not publish a closed, topic-by-topic syllabus."),
  "structure-only": t("主办方只公布模块、能力或竞赛范围，没有逐知识点的封闭考纲；真题或详细题库也可能受限。", "The organiser publishes modules, abilities or contest scope without a closed topic-by-topic syllabus; detailed items or past papers may also be restricted."),
};

export const syllabusSourceFormatLabels: Record<SyllabusSourceRecord["format"], LocalizedText> = {
  webpage: t("官方网页", "Official webpage"),
  pdf: t("官方 PDF", "Official PDF"),
  platform: t("官方平台", "Official platform"),
};
