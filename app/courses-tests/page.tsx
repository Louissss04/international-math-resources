import type { Metadata } from "next";
import { CategoryGateway } from "../components/category-gateway";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "课程与考试", description: "国际数学课程统考与数学入学考试分类入口。" };

export default function Page() {
  const curricula = allProjects.filter((project) => project.track === "curriculum");
  const assessments = allProjects.filter((project) => project.track === "assessment");
  return <CategoryGateway title={t("课程与考试", "Courses and tests")} description={t("国际数学课程与数学入学考试。", "International mathematics curricula and mathematics admissions tests.")} items={[
    { track: "curriculum", href: "/courses", title: t("国际数学课程与统考", "Mathematics curricula and subject exams"), description: t("AP、Cambridge International、Pearson Edexcel International 与 IB 数学。", "AP, Cambridge International, Pearson Edexcel International and IB mathematics."), count: curricula.length },
    { track: "assessment", href: "/assessments", title: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments"), description: t("报名、考试形式、数学考纲、样卷、成绩与送分。", "Registration, format, mathematics scope, samples, scores and score reporting."), count: assessments.length },
  ]} />;
}
