import Link from "next/link";
import { allProjects, allSources, allThresholds } from "./data";
import { projectHref } from "./lib/paths";
import type { Track } from "./lib/types";
import { Localized } from "./components/localized";
import { StatusBadge } from "./components/status-badge";

const trackInfo: Array<{ track: Track; href: string; zh: string; en: string; fieldsZh: string; fieldsEn: string }> = [
  { track: "competition", href: "/competitions", zh: "数学竞赛", en: "Competitions", fieldsZh: "资格、赛制、日期、奖项、分数线", fieldsEn: "Eligibility, format, dates, awards, thresholds" },
  { track: "modeling", href: "/modeling", zh: "数学建模", en: "Modeling", fieldsZh: "团队、赛期、论文、提交、奖项", fieldsEn: "Team, window, paper, submission, awards" },
  { track: "research", href: "/research", zh: "数学科研", en: "Research", fieldsZh: "选题、检索、记录、作者、诚信", fieldsEn: "Questions, search, records, authorship, integrity" },
  { track: "summer", href: "/summer", zh: "夏校与夏令营", en: "Summer programs", fieldsZh: "资格、国际生、费用、资助、材料", fieldsEn: "Eligibility, international access, cost, aid, materials" },
  { track: "assessment", href: "/assessments", zh: "课程与考试", en: "Assessments", fieldsZh: "用途、报名、日期、形式、评分", fieldsEn: "Purpose, registration, dates, format, scoring" },
];

export default function Home() {
  const dateCount = allProjects.reduce((total, project) => total + project.dates.length, 0);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = allProjects.flatMap((project) => project.dates.map((date) => ({ ...date, project })))
    .filter((item) => item.status === "confirmed" && item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 9);

  return (
    <main>
      <section className="home-hero">
        <div className="page-container home-hero-grid">
          <div>
            <p className="label">MATHPATH · 中英双语 / BILINGUAL</p>
            <h1><span className="lang-zh">数学竞赛、建模、科研、夏校与考试数据库</span><span className="lang-en">Mathematics competitions, modeling, research, summer programs and assessments</span></h1>
            <p><span className="lang-zh">查询资格、日期、赛制、费用、奖项、历年分数线和官方来源。</span><span className="lang-en">Search eligibility, dates, format, cost, awards, historical thresholds and official sources.</span></p>
            <form className="home-search" action="/catalog" method="get"><input name="q" type="search" aria-label="Search" placeholder="AMC / PROMYS / TMUA / 中国高中数学联赛" /><button className="primary-button" type="submit"><span className="lang-zh">查询</span><span className="lang-en">Search</span></button></form>
          </div>
          <div className="home-stats">
            <div><strong>{allProjects.length}</strong><span className="lang-zh">项目档案</span><span className="lang-en">project records</span></div>
            <div><strong>{allThresholds.length}</strong><span className="lang-zh">分数线记录</span><span className="lang-en">threshold records</span></div>
            <div><strong>{dateCount}</strong><span className="lang-zh">日期节点</span><span className="lang-en">date records</span></div>
            <div><strong>{allSources.length}</strong><span className="lang-zh">来源记录</span><span className="lang-en">source records</span></div>
          </div>
        </div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">分类</span><span className="lang-en">Categories</span></h2><Link href="/catalog"><span className="lang-zh">打开全部项目</span><span className="lang-en">Open all records</span></Link></div>
        <div className="track-grid">{trackInfo.map((item) => <Link className="track-tile" key={item.track} href={item.href}><b>{allProjects.filter((project) => project.track === item.track).length}</b><h3><span className="lang-zh">{item.zh}</span><span className="lang-en">{item.en}</span></h3><p><span className="lang-zh">{item.fieldsZh}</span><span className="lang-en">{item.fieldsEn}</span></p></Link>)}</div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">最近已确认日期</span><span className="lang-en">Next confirmed dates</span></h2><Link href="/calendar"><span className="lang-zh">打开日历</span><span className="lang-en">Open calendar</span></Link></div>
        <div className="deadline-grid">{upcoming.map((item) => <Link className="deadline-card" key={`${item.project.id}-${item.id}`} href={projectHref(item.project)}><time dateTime={item.date}>{item.date}{item.endDate ? ` — ${item.endDate}` : ""}</time><StatusBadge status={item.status} /><h3>{item.project.shortTitle}</h3><p><Localized text={item.label} /></p></Link>)}</div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">信息状态</span><span className="lang-en">Data status</span></h2><Link href="/sources"><span className="lang-zh">查看来源</span><span className="lang-en">View sources</span></Link></div>
        <div className="status-legend">
          <div><StatusBadge status="confirmed" /><p><span className="lang-zh">来源已公布当前周期信息。</span><span className="lang-en">The source publishes current-cycle information.</span></p></div>
          <div><StatusBadge status="historical" /><p><span className="lang-zh">仅代表所标年份或往届记录。</span><span className="lang-en">Applies only to the stated past cycle.</span></p></div>
          <div><StatusBadge status="pending" /><p><span className="lang-zh">当前周期尚未公布。</span><span className="lang-en">The current cycle has not been published.</span></p></div>
          <div><StatusBadge status="conflict" /><p><span className="lang-zh">官方页面之间存在不一致。</span><span className="lang-en">Official pages contain inconsistent values.</span></p></div>
        </div>
      </section>
    </main>
  );
}
