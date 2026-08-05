import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CompareClient } from "../components/compare-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学入学测评比较", description: "并排比较入学考试与测评的数学或定量部分、报名、形式、费用、成绩与送分。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "assessment");
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments"), href: "/assessments" }, { label: t("入学测评比较", "Compare admissions tests") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学入学考试与定量测评比较</span><span className="lang-en">Compare mathematics admissions tests and quantitative assessments</span></h1><p><span className="lang-zh">选择 2—4 项，对照数学或定量部分的用途、报名资格、形式、费用、成绩与送分。</span><span className="lang-en">Compare the mathematics or quantitative components, registration eligibility, format, cost, scores and score reporting across 2–4 records.</span></p></div></div></header><section className="page-container directory-section"><CompareClient projects={projects} fixedTrack="assessment" /></section></main>;
}
