import {
  t,
  type JournalArticleType,
  type JournalAudienceScope,
  type JournalFeeCategory,
  type JournalLinkKind,
  type JournalOutcomeType,
  type JournalReviewModel,
  type JournalSubmissionStatus,
  type JournalTopicTag,
  type JournalType,
} from "./types";

export const journalTypeLabels: Record<JournalType, ReturnType<typeof t>> = {
  "youth-research-journal": t("青少年研究期刊", "Youth research journal"),
  "student-research-journal": t("学生研究期刊", "Student research journal"),
  "professional-research-journal": t("专业研究期刊", "Professional research journal"),
  "expository-journal": t("数学说明与综述期刊", "Expository mathematics journal"),
  "problem-solving-publication": t("问题与题解刊物", "Problem-solving publication"),
  "showcase-magazine": t("学生作品展示刊物", "Student showcase magazine"),
};

export const journalAudienceLabels: Record<JournalAudienceScope, ReturnType<typeof t>> = {
  "secondary-only": t("仅中学生", "Secondary students only"),
  "secondary-and-undergraduate": t("中学生与本科生", "Secondary and undergraduate students"),
  "students-general": t("学生作者", "Student authors"),
  "no-age-restriction": t("未规定年龄限制", "No stated age restriction"),
  "eligibility-unclear": t("作者资格待确认", "Eligibility unclear"),
};

export const journalReviewLabels: Record<JournalReviewModel, ReturnType<typeof t>> = {
  "professional-peer-review": t("专业同行评审", "Professional peer review"),
  "student-peer-review": t("学生同行评审", "Student peer review"),
  "editorial-review": t("编辑审稿", "Editorial review"),
  "editorial-screening": t("编辑遴选", "Editorial screening"),
  mixed: t("混合评审", "Mixed review"),
  "not-stated": t("官网未说明", "Not stated"),
};

export const journalSubmissionLabels: Record<JournalSubmissionStatus, ReturnType<typeof t>> = {
  "open-rolling": t("长期收稿", "Rolling submissions"),
  "open-window": t("按期征稿", "Submission window"),
  closed: t("当前关闭", "Currently closed"),
  paused: t("暂停收稿", "Submissions paused"),
  historical: t("历史刊物／已停刊", "Historical / discontinued"),
  unclear: t("当前状态待确认", "Current status unclear"),
};

export const journalOutcomeLabels: Record<JournalOutcomeType, ReturnType<typeof t>> = {
  "problem-solution-credit": t("题解署名", "Problem-solution credit"),
  "editor-selected-article": t("编辑遴选文章", "Editor-selected article"),
  "peer-reviewed-research-paper": t("同行评审研究论文", "Peer-reviewed research paper"),
  mixed: t("多种成果形式", "Mixed outcomes"),
};

export const journalFeeLabels: Record<JournalFeeCategory, ReturnType<typeof t>> = {
  "no-fee": t("无强制费用", "No required fee"),
  "optional-fee": t("有可选费用", "Optional fee"),
  "paid-required": t("需要付费", "Required fee"),
  varies: t("费用因情况而异", "Fees vary"),
  unclear: t("费用待确认", "Fees unclear"),
};

export const journalTopicLabels: Record<JournalTopicTag, ReturnType<typeof t>> = {
  algebra: t("代数", "Algebra"),
  "number-theory": t("数论", "Number theory"),
  "geometry-topology": t("几何与拓扑", "Geometry and topology"),
  "combinatorics-graph-theory": t("组合与图论", "Combinatorics and graph theory"),
  "analysis-calculus": t("分析与微积分", "Analysis and calculus"),
  "probability-statistics": t("概率与统计", "Probability and statistics"),
  "applied-modeling": t("应用数学与建模", "Applied mathematics and modeling"),
  "data-computation": t("数据科学与计算", "Data science and computing"),
  "mathematics-education": t("数学教育", "Mathematics education"),
  "history-philosophy-exposition": t("数学史、哲学与说明文", "History, philosophy and exposition"),
  "general-mathematics": t("综合数学", "General mathematics"),
  "interdisciplinary-stem": t("跨学科 STEM", "Interdisciplinary STEM"),
};

export const journalArticleTypeLabels: Record<JournalArticleType, ReturnType<typeof t>> = {
  "original-research": t("原创研究论文", "Original research paper"),
  "expository-paper": t("说明性文章", "Expository paper"),
  "modeling-paper": t("数学建模论文", "Modeling paper"),
  "problem-solution": t("问题与题解", "Problem and solution"),
  "review-survey": t("综述文章", "Review or survey"),
  "computational-project": t("计算项目", "Computational project"),
  "short-note": t("短文／研究札记", "Short note"),
};

export const journalLinkKindLabels: Record<JournalLinkKind, ReturnType<typeof t>> = {
  home: t("期刊官网", "Journal home"),
  "author-guidelines": t("作者指南", "Author guidelines"),
  "submission-portal": t("投稿入口", "Submission portal"),
  template: t("论文模板", "Manuscript template"),
  fees: t("费用说明", "Fees"),
  ethics: t("出版伦理", "Publication ethics"),
  archive: t("往期文章", "Article archive"),
  "sample-article": t("示例文章", "Sample article"),
};
