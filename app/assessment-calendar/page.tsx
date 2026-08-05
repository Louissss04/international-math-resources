import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CalendarClient } from "../components/calendar-client";
import { allProjects, allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学入学考试日历", description: "数学入学考试与定量测评的报名、考试、送分和成绩日期。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "assessment");
  const count = projects.reduce((sum, project) => sum + project.dates.length, 0);
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments"), href: "/assessments" }, { label: t("入学测评日历", "Admissions-test calendar") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学入学考试与定量测评日历</span><span className="lang-en">Mathematics admissions-test and quantitative-assessment calendar</span></h1><p><span className="lang-zh">只显示相关报名、考试、送分与成绩日期。</span><span className="lang-en">Registration, sitting, score-reporting and result dates for the listed admissions tests and quantitative assessments.</span></p></div><b>{count}</b></div></header><section className="page-container directory-section"><CalendarClient projects={projects} sources={allSources} fixedTrack="assessment" /></section></main>;
}
