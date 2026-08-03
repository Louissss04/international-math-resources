import type { Metadata } from "next";
import { ArchiveClient } from "../components/archive-client";
import { Breadcrumbs } from "../components/breadcrumbs";
import { allProjects, allSources, allThresholds } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "历年分数线与奖项档案", description: "按项目、年份、场次和奖项查询历史分数线。" };
export default function Page() { return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("历年分数线", "Historical thresholds") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">历年分数线与奖项档案</span><span className="lang-en">Historical thresholds and awards</span></h1><p><span className="lang-zh">每条记录包含年份、场次、指标、状态和来源。</span><span className="lang-en">Each record includes year, sitting, metric, status and source.</span></p></div><b>{allThresholds.length}</b></div></header><section className="page-container directory-section"><ArchiveClient records={allThresholds} projects={allProjects} sources={allSources} /></section></main>; }

