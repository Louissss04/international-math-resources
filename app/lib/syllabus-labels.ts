import { t, type LocalizedText, type SyllabusClassification, type SyllabusSourceRecord } from "./types";

export const syllabusClassificationLabels: Record<SyllabusClassification, LocalizedText> = {
  "formal-specification": t("官方考纲", "Official specification"),
  "content-framework": t("官方内容框架", "Official content framework"),
  "structure-only": t("仅公布范围与结构", "Published scope and structure only"),
};

export const syllabusClassificationDescriptions: Record<SyllabusClassification, LocalizedText> = {
  "formal-specification": t("官方按知识点列出考试范围。", "The official specification lists the tested content by topic."),
  "content-framework": t("官方公布测试领域和题型，未提供逐项知识点考纲。", "The official framework lists tested domains and question types, but not a topic-by-topic specification."),
  "structure-only": t("官方只公布模块或能力范围，未提供逐项知识点考纲。", "The official source lists modules or skill areas, but not a topic-by-topic specification."),
};

export const syllabusSourceFormatLabels: Record<SyllabusSourceRecord["format"], LocalizedText> = {
  webpage: t("官方网页", "Official webpage"),
  pdf: t("官方 PDF", "Official PDF"),
  platform: t("官方平台", "Official platform"),
};
