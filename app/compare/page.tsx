import type { Metadata } from "next";
import { CategoryGateway } from "../components/category-gateway";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "分类比较", description: "分别比较数学竞赛、课程体系或入学测评。" };

export default function Page() {
  const competitions = allProjects.filter((project) => project.track === "competition");
  const curricula = allProjects.filter((project) => project.track === "curriculum");
  const assessments = allProjects.filter((project) => project.track === "assessment");
  return <CategoryGateway
    title={t("分类比较", "Compare by category")}
    description={t("竞赛、课程统考和入学测评分别在同类项目中比较。", "Competitions, subject qualifications and admissions assessments are compared within their own categories.")}
    items={[
      { track: "competition", href: "/competition-compare", title: t("比较数学竞赛", "Compare mathematics competitions"), description: t("对照参赛资格、赛制、费用、比赛日期、奖项与晋级。", "Compare eligibility, format, cost, contest dates, awards and qualification."), count: competitions.length },
      { track: "curriculum", href: "/course-compare", title: t("比较数学课程体系", "Compare mathematics curricula"), description: t("对照课程层级、内容范围、试卷、计算器规则和评分。", "Compare levels, content, papers, calculator rules and grading."), count: curricula.length },
      { track: "assessment", href: "/assessment-compare", title: t("比较数学入学考试与测评", "Compare mathematics admissions tests"), description: t("对照数学部分、报名资格、考试形式、费用、成绩与送分。", "Compare mathematics sections, registration eligibility, test format, cost, scores and score reporting."), count: assessments.length },
    ]}
  />;
}
