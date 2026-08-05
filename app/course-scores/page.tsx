import type { Metadata } from "next";
import { ArchiveClient } from "../components/archive-client";
import { Breadcrumbs } from "../components/breadcrumbs";
import { allProjects, allSources, allThresholds } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学课程成绩与等级档案", description: "AP 数学成绩分布、A Level 与 IGCSE 等级边界及课程统考成绩资料。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "curriculum");
  const projectIds = new Set(projects.map((project) => project.id));
  const records = allThresholds.filter((record) => projectIds.has(record.projectId));
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学课程与统考", "Mathematics curricula and subject exams"), href: "/courses" }, { label: t("成绩与等级档案", "Score and grade archive") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学课程成绩与等级档案</span><span className="lang-en">Mathematics course score and grade archive</span></h1><p><span className="lang-zh">按课程、年份和考试系列查询官方成绩分布、等级边界及评分说明。</span><span className="lang-en">Official score distributions, grade boundaries and grading notes by course, year and exam series.</span></p></div><b>{records.length}</b></div></header><section className="page-container directory-section"><ArchiveClient records={records} projects={projects} sources={allSources} fixedTrack="curriculum" /></section></main>;
}
