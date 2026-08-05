import Link from "next/link";
import { Localized } from "./components/localized";
import { StatusBadge } from "./components/status-badge";
import { allProjects, destinationGuides } from "./data";
import { projectHref } from "./lib/paths";
import type { Track } from "./lib/types";

const LAST_UPDATED = "2026-08-06";

const programTracks: Array<{ track: Track; href: string; zh: string; en: string; fieldsZh: string; fieldsEn: string }> = [
  { track: "competition", href: "/competitions", zh: "数学竞赛", en: "Competitions", fieldsZh: "赛制、日期、报名、奖项线、考纲与历年题", fieldsEn: "Format, dates, registration, thresholds, scope and past papers" },
  { track: "modeling", href: "/modeling", zh: "数学建模", en: "Modeling", fieldsZh: "团队、赛期、论文要求、提交与奖项", fieldsEn: "Teams, contest windows, papers, submission and awards" },
  { track: "research", href: "/research", zh: "数学科研", en: "Research", fieldsZh: "科研项目、社会实践、申请资格、费用与成果", fieldsEn: "Programs, social practice, eligibility, cost and outputs" },
  { track: "summer", href: "/summer", zh: "数学夏校", en: "Summer programs", fieldsZh: "资格、国际生、费用、资助与申请材料", fieldsEn: "Eligibility, international access, cost, aid and applications" },
];

const academicTracks: Array<{ track: Track; href: string; zh: string; en: string; fieldsZh: string; fieldsEn: string }> = [
  { track: "curriculum", href: "/courses", zh: "国际数学课程与统考", en: "Mathematics curricula", fieldsZh: "AP、A Level、IGCSE、IB 的考纲、试卷与成绩", fieldsEn: "AP, A Level, IGCSE and IB specifications, papers and grades" },
  { track: "assessment", href: "/assessments", zh: "数学入学考试与测评", en: "Admissions tests", fieldsZh: "数学模块、报名、日期、考纲、样卷与成绩", fieldsEn: "Mathematics sections, registration, dates, scope, samples and scores" },
];

function trackRecordCount(track: Track) {
  return allProjects.filter((project) => project.track === track && (track !== "research" || project.eligibilityTags.includes("research-program"))).length;
}

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  const upcomingByTrack = [...programTracks, ...academicTracks].map((info) => ({
    ...info,
    dates: allProjects
      .filter((project) => project.track === info.track)
      .flatMap((project) => project.dates.map((date) => ({ ...date, project })))
      .filter((item) => item.status === "confirmed" && item.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 2),
  })).filter((group) => group.dates.length > 0);

  return (
    <main>
      <section className="home-hero">
        <div className="page-container home-hero-grid">
          <div>
            <p className="label"><span className="lang-zh">最后更新 {LAST_UPDATED}</span><span className="lang-en">Updated {LAST_UPDATED}</span></p>
            <h1><span className="lang-zh">国际升学数学资料库</span><span className="lang-en">Mathematics Resource Library for International Education</span></h1>
            <p><span className="lang-zh">面向中国中学生的数学竞赛、建模、科研、夏校、国际课程与入学考试资料。</span><span className="lang-en">Mathematics competitions, modeling, research, summer programs, international curricula and admissions tests for students in China.</span></p>
            <form className="home-search" action="/catalog" method="get"><input name="q" type="search" aria-label="Search" placeholder="AMC / HiMCM / PRIMES / AP / IB / TMUA" /><button className="primary-button" type="submit"><span className="lang-zh">查询</span><span className="lang-en">Search</span></button></form>
          </div>
          <nav className="home-entry-list" aria-label="Main sections">
            <Link href="/programs"><strong><span className="lang-zh">竞赛与项目</span><span className="lang-en">Competitions & programs</span></strong></Link>
            <Link href="/courses-tests"><strong><span className="lang-zh">课程与考试</span><span className="lang-en">Courses & tests</span></strong></Link>
            <Link href="/resources"><strong><span className="lang-zh">资料中心</span><span className="lang-en">Resources</span></strong></Link>
          </nav>
        </div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">竞赛与项目</span><span className="lang-en">Competitions and programs</span></h2><Link href="/programs"><span className="lang-zh">全部</span><span className="lang-en">All</span></Link></div>
        <div className="track-grid track-grid-four">{programTracks.map((item) => <Link className="track-tile" key={item.track} href={item.href}><b>{trackRecordCount(item.track)}</b><h3><span className="lang-zh">{item.zh}</span><span className="lang-en">{item.en}</span></h3><p><span className="lang-zh">{item.fieldsZh}</span><span className="lang-en">{item.fieldsEn}</span></p></Link>)}</div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">课程与考试</span><span className="lang-en">Courses and tests</span></h2><Link href="/courses-tests"><span className="lang-zh">全部</span><span className="lang-en">All</span></Link></div>
        <div className="track-grid track-grid-two">{academicTracks.map((item) => <Link className="track-tile" key={item.track} href={item.href}><b>{trackRecordCount(item.track)}</b><h3><span className="lang-zh">{item.zh}</span><span className="lang-en">{item.en}</span></h3><p><span className="lang-zh">{item.fieldsZh}</span><span className="lang-en">{item.fieldsEn}</span></p></Link>)}</div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">按留学地区查询</span><span className="lang-en">Study destinations</span></h2><Link href="/destinations"><span className="lang-zh">全部地区</span><span className="lang-en">All destinations</span></Link></div>
        <div className="destination-home-grid">{destinationGuides.map((guide) => <Link key={guide.id} href={`/destinations/${guide.slug}`}><strong><Localized text={guide.shortTitle} /></strong><span><Localized text={guide.facts[0].value} /></span></Link>)}</div>
      </section>

      <section className="home-section page-container">
        <div className="section-heading"><h2><span className="lang-zh">近期日期</span><span className="lang-en">Upcoming dates</span></h2><Link href="/calendar"><span className="lang-zh">完整日历</span><span className="lang-en">Full calendar</span></Link></div>
        <div className="deadline-groups">{upcomingByTrack.map((group) => <section className={`deadline-group deadline-group-${group.track}`} key={group.track}><div className="deadline-group-heading"><h3><span className="lang-zh">{group.zh}</span><span className="lang-en">{group.en}</span></h3><Link href={group.href}><span className="lang-zh">查看</span><span className="lang-en">View</span></Link></div><div className="deadline-list">{group.dates.map((item) => <Link className="deadline-card" key={`${item.project.id}-${item.id}`} href={projectHref(item.project)}><time dateTime={item.date}>{item.date}{item.endDate ? ` — ${item.endDate}` : ""}</time><StatusBadge status={item.status} /><h3>{item.project.shortTitle}</h3><p><Localized text={item.label} /></p></Link>)}</div></section>)}</div>
      </section>
    </main>
  );
}
