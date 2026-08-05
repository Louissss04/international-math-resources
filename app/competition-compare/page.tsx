import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CompareClient } from "../components/compare-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "竞赛比较", description: "并排比较数学竞赛的资格、赛制、费用、日期、奖项与晋级。" };

export default function Page() {
  const projects = allProjects.filter((project) => project.track === "competition");
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("数学竞赛", "Mathematics competitions"), href: "/competitions" }, { label: t("竞赛比较", "Compare competitions") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">竞赛比较</span><span className="lang-en">Compare competitions</span></h1><p><span className="lang-zh">选择 2—4 项数学竞赛，对照参赛资格、赛制、费用、比赛日期、奖项与晋级。</span><span className="lang-en">Compare eligibility, format, cost, contest dates, awards and qualification across 2–4 mathematics competitions.</span></p></div></div></header><section className="page-container directory-section"><CompareClient projects={projects} fixedTrack="competition" /></section></main>;
}
