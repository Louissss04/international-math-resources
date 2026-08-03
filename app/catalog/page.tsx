import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CatalogClient } from "../components/catalog-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "项目库", description: "按类型、年级、地区、状态和费用查询数学项目。" };
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("项目库", "Directory") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">项目库</span><span className="lang-en">Directory</span></h1><p><span className="lang-zh">竞赛、建模、科研、夏校和考试使用统一字段。</span><span className="lang-en">Competitions, modeling, research, summer programs and assessments in one schema.</span></p></div><b>{allProjects.length}</b></div></header><section className="page-container directory-section"><CatalogClient projects={allProjects} initialQuery={q} /></section></main>;
}
