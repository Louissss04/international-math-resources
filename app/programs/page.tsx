import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { allProjects } from "../data";
import { t, type Track } from "../lib/types";

export const metadata: Metadata = { title: "竞赛与项目", description: "数学竞赛、数学建模、数学科研项目与数学夏校分类入口。" };

const items: Array<{ track: Track; href: string; zh: string; en: string; descriptionZh: string; descriptionEn: string }> = [
  { track: "competition", href: "/competitions", zh: "数学竞赛", en: "Mathematics competitions", descriptionZh: "赛制、报名、日期、奖项线、考纲与历年题。", descriptionEn: "Format, registration, dates, thresholds, scope and past papers." },
  { track: "modeling", href: "/modeling", zh: "数学建模", en: "Mathematical modeling", descriptionZh: "组队、赛期、论文、提交、奖项与历届题目。", descriptionEn: "Teams, contest windows, papers, submission, awards and past problems." },
  { track: "research", href: "/research", zh: "数学科研", en: "Mathematical research", descriptionZh: "科研项目、技能工具、论文规范、期刊与投稿。", descriptionEn: "Research programs, skills, paper standards, journals and submission." },
  { track: "summer", href: "/summer", zh: "数学夏校", en: "Mathematics summer programs", descriptionZh: "项目内容、国际生资格、费用、资助与申请材料。", descriptionEn: "Programs, international eligibility, cost, aid and applications." },
];

export default function Page() {
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("竞赛与项目", "Competitions and programs") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">竞赛与项目</span><span className="lang-en">Competitions and programs</span></h1></div></div></header><section className="page-container directory-section"><div className="track-grid track-grid-four">{items.map((item) => <Link className="track-tile" href={item.href} key={item.track}><b>{allProjects.filter((project) => project.track === item.track && (item.track !== "research" || project.eligibilityTags.includes("research-program"))).length}</b><h2><span className="lang-zh">{item.zh}</span><span className="lang-en">{item.en}</span></h2><p><span className="lang-zh">{item.descriptionZh}</span><span className="lang-en">{item.descriptionEn}</span></p></Link>)}</div><p className="gateway-secondary"><Link href="/catalog"><span className="lang-zh">搜索全部条目</span><span className="lang-en">Search all records</span></Link></p></section></main>;
}
