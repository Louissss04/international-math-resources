import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CompareClient } from "../components/compare-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学课程体系比较", description: "比较 AP、A Level、IGCSE 与 IB 数学的层级、形式、试卷和评分。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "curriculum");
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学课程与统考", "Mathematics curricula and subject exams"), href: "/courses" }, { label: t("课程体系比较", "Compare curricula") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">数学课程体系比较</span><span className="lang-en">Compare mathematics curricula</span></h1><p><span className="lang-zh">选择 2—4 项，对照课程层级、内容范围、考试形式、计算器规则、评分和资料开放程度。</span><span className="lang-en">Compare level, content, exam format, calculator rules, grading and public-resource access across 2–4 curricula.</span></p></div></div></header><section className="page-container directory-section"><CompareClient projects={projects} fixedTrack="curriculum" /></section></main>;
}
