import type { Metadata } from "next";
import { ArchiveClient } from "../components/archive-client";
import { Breadcrumbs } from "../components/breadcrumbs";
import { allProjects, allSources, allThresholds } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "竞赛奖项与分数线", description: "数学竞赛历年奖项线、晋级线、百分位与成绩统计。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "competition");
  const projectIds = new Set(projects.map((project) => project.id));
  const records = allThresholds.filter((record) => projectIds.has(record.projectId));
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学竞赛", "Mathematics competitions"), href: "/competitions" }, { label: t("奖项与分数线", "Awards and thresholds") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">竞赛奖项与分数线</span><span className="lang-en">Competition awards and thresholds</span></h1><p><span className="lang-zh">只显示数学竞赛的奖项线、晋级线、百分位和历年成绩统计，不包含考试成绩。</span><span className="lang-en">Mathematics competition awards, qualification thresholds, percentiles and historical statistics only; test scores are excluded.</span></p></div><b>{records.length}</b></div></header><section className="page-container directory-section"><ArchiveClient records={records} projects={projects} sources={allSources} fixedTrack="competition" /></section></main>;
}
