import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CatalogClient } from "../components/catalog-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "全部条目", description: "查询本站收录的数学竞赛、建模、科研、夏校、课程与考试条目。" };
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("全部条目", "All records") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">全部条目</span><span className="lang-en">All records</span></h1><p><span className="lang-zh">按类型、年级、地区、信息状态和费用筛选本站收录条目。</span><span className="lang-en">Filter all records by type, grade, region, information status and cost.</span></p></div><b>{allProjects.length}</b></div></header><section className="page-container directory-section"><CatalogClient projects={allProjects} initialQuery={q} /></section></main>;
}
