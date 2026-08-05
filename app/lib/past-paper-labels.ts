import { t, type LearningResourceAccess, type PastPaperAvailability, type PastPaperLinkAuthority, type PastPaperLinkKind } from "./types";

export const pastPaperAvailabilityLabels: Record<PastPaperAvailability, ReturnType<typeof t>> = {
  official: t("官方真题档案", "Official paper archive"),
  secondary: t("第三方公开整理", "Public third-party index"),
  "sample-only": t("仅有官方样卷", "Official samples only"),
  restricted: t("题库受限", "Restricted question bank"),
  "not-found": t("暂无公开入口", "No public source found"),
};

export const pastPaperAuthorityLabels: Record<PastPaperLinkAuthority, ReturnType<typeof t>> = {
  official: t("官方来源", "Official source"),
  secondary: t("第三方整理", "Third-party index"),
};

export const pastPaperKindLabels: Record<PastPaperLinkKind, ReturnType<typeof t>> = {
  archive: t("历年档案", "Archive"),
  "download-page": t("下载页", "Download page"),
  specimen: t("样卷／样题", "Specimen / sample"),
  solutions: t("答案／解析", "Solutions"),
  index: t("题目索引", "Problem index"),
};

export const pastPaperAccessLabels: Record<LearningResourceAccess, ReturnType<typeof t>> = {
  free: t("免费公开", "Free public access"),
  account: t("需要账户", "Account required"),
  mixed: t("部分公开", "Mixed access"),
  paid: t("付费材料", "Paid material"),
  school: t("学校／考点访问", "School / test-centre access"),
};
