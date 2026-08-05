import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CalendarClient } from "../components/calendar-client";
import { allProjects, allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学课程统考日历", description: "AP、A Level、IGCSE 与 IB 数学的报名、考试和成绩日期。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "curriculum");
  const count = projects.reduce((sum, project) => sum + project.dates.length, 0);
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学课程与统考", "Mathematics curricula and subject exams"), href: "/courses" }, { label: t("课程统考日历", "Subject-exam calendar") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学课程统考日历</span><span className="lang-en">Mathematics subject-exam calendar</span></h1><p><span className="lang-zh">报名、考试、放榜与成绩查询日期；未公布的下一周期日期明确标为待公布。</span><span className="lang-en">Entry, examination, result and score-release dates; unannounced dates for the next cycle are marked pending.</span></p></div><b>{count}</b></div></header><section className="page-container directory-section"><CalendarClient projects={projects} sources={allSources} fixedTrack="curriculum" /></section></main>;
}
