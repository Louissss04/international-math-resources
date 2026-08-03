import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CompareClient } from "../components/compare-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "项目比较", description: "并排比较数学竞赛、建模、科研、夏校和考试项目。" };
export default function Page() { return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("项目比较", "Compare") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">项目比较</span><span className="lang-en">Compare records</span></h1><p><span className="lang-zh">选择 2—4 项，并排查看统一字段。</span><span className="lang-en">Select 2–4 records and compare standardized fields.</span></p></div></div></header><section className="page-container directory-section"><CompareClient projects={allProjects} /></section></main>; }

