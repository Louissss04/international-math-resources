import type { Metadata } from "next";
import { CategoryGateway } from "../components/category-gateway";
import { allProjects, allThresholds } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "分类数据档案", description: "分别进入数学竞赛、课程统考或入学测评的数据档案。" };

export default function Page() {
  const competitionIds = new Set(allProjects.filter((project) => project.track === "competition").map((project) => project.id));
  const curriculumIds = new Set(allProjects.filter((project) => project.track === "curriculum").map((project) => project.id));
  const assessmentIds = new Set(allProjects.filter((project) => project.track === "assessment").map((project) => project.id));
  return <CategoryGateway
    title={t("分类数据档案", "Data archives by category")}
    description={t("竞赛奖项线、课程统考等级与入学测评成绩分开保存和查询。", "Competition thresholds, subject-qualification grades and admissions-test scores are kept separate.")}
    items={[
      { track: "competition", href: "/competition-results", title: t("竞赛奖项与分数线", "Competition awards and thresholds"), description: t("查询数学竞赛的奖项线、晋级线、百分位和历年成绩统计。", "Award thresholds, qualification cutoffs, percentiles and historical competition statistics."), count: allThresholds.filter((record) => competitionIds.has(record.projectId)).length },
      { track: "curriculum", href: "/course-scores", title: t("课程成绩与等级档案", "Course score and grade archive"), description: t("查询 AP 成绩分布、IGCSE 与 A Level 等级边界及官方评分资料。", "AP score distributions, IGCSE and A Level grade boundaries, and official grading material."), count: allThresholds.filter((record) => curriculumIds.has(record.projectId)).length },
      { track: "assessment", href: "/assessment-scores", title: t("入学测评成绩档案", "Admissions-test score archive"), description: t("查询入学考试与定量测评的成绩、等级、参考分数和官方统计。", "Scores, levels, reference values and official statistics for admissions and quantitative assessments."), count: allThresholds.filter((record) => assessmentIds.has(record.projectId)).length },
    ]}
  />;
}
