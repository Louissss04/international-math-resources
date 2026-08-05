import type { Metadata } from "next";
import { ArchiveClient } from "../components/archive-client";
import { Breadcrumbs } from "../components/breadcrumbs";
import { allProjects, allSources, allThresholds } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学入学测评成绩档案", description: "数学入学考试与定量测评的历年成绩、等级、参考分数和官方统计。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "assessment");
  const projectIds = new Set(projects.map((project) => project.id));
  const records = allThresholds.filter((record) => projectIds.has(record.projectId));
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments"), href: "/assessments" }, { label: t("入学测评成绩档案", "Admissions-test score archive") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学入学考试与定量测评成绩档案</span><span className="lang-en">Mathematics admissions-test score archive</span></h1><p><span className="lang-zh">只显示入学考试与定量测评的成绩、等级、参考分数和官方统计，不包含课程统考等级或竞赛奖项线。</span><span className="lang-en">Scores, levels, reference values and official statistics for admissions tests and quantitative assessments; course grades and competition thresholds are excluded.</span></p></div><b>{records.length}</b></div></header><section className="page-container directory-section"><ArchiveClient records={records} projects={projects} sources={allSources} fixedTrack="assessment" /></section></main>;
}
