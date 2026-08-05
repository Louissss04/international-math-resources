import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CalendarClient } from "../components/calendar-client";
import { allProjects, allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "竞赛日历", description: "数学竞赛报名、比赛、晋级和放榜日期。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "competition");
  const count = projects.reduce((sum, project) => sum + project.dates.length, 0);
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学竞赛", "Mathematics competitions"), href: "/competitions" }, { label: t("竞赛日历", "Competition calendar") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">竞赛日历</span><span className="lang-en">Competition calendar</span></h1><p><span className="lang-zh">只显示数学竞赛的报名、比赛、晋级与结果日期。</span><span className="lang-en">Registration, contest, qualification and result dates for mathematics competitions only.</span></p></div><b>{count}</b></div></header><section className="page-container directory-section"><CalendarClient projects={projects} sources={allSources} fixedTrack="competition" /></section></main>;
}
