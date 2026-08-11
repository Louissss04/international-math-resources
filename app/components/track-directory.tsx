import Link from "next/link";
import type { ReactNode } from "react";
import type { LocalizedText, ProjectRecord, Track } from "../lib/types";
import { Breadcrumbs } from "./breadcrumbs";
import { CatalogClient } from "./catalog-client";
import { Localized } from "./localized";

const trackTools: Partial<Record<Track, Array<{ href: string; title: LocalizedText; description: LocalizedText }>>> = {
  competition: [
    { href: "/competition-results", title: { zh: "竞赛奖项与分数线", en: "Competition awards and thresholds" }, description: { zh: "按竞赛、年份和奖项查询。", en: "Search by competition, year and award." } },
    { href: "/competition-calendar", title: { zh: "竞赛日历", en: "Competition calendar" }, description: { zh: "报名、比赛、晋级与放榜日期。", en: "Registration, contest, qualification and result dates." } },
  ],
  assessment: [
    { href: "/assessment-scores", title: { zh: "数学考试成绩档案", en: "Mathematics test score archive" }, description: { zh: "按考试、年份和数学成绩指标查询。", en: "Search by test, year and mathematics score metric." } },
    { href: "/assessment-calendar", title: { zh: "数学考试日历", en: "Mathematics test calendar" }, description: { zh: "报名、考试、送分与成绩日期。", en: "Registration, test, score-reporting and result dates." } },
  ],
  curriculum: [
    { href: "/course-scores", title: { zh: "课程成绩与等级档案", en: "Course grade archive" }, description: { zh: "AP 成绩分布、等级边界及官方成绩说明。", en: "AP score distributions, grade boundaries and official grading guidance." } },
    { href: "/course-calendar", title: { zh: "课程统考日历", en: "Subject-exam calendar" }, description: { zh: "报名、考试、放榜与成绩节点。", en: "Entry, examination, result and score-reporting dates." } },
  ],
};

export function TrackDirectory({
  title,
  description,
  track,
  projects,
  children,
}: {
  title: LocalizedText;
  description: LocalizedText;
  track: Track;
  projects: ProjectRecord[];
  children?: ReactNode;
}) {
  const tools = [
    ...(trackTools[track] ?? []),
    {
      href: `/resources#${track}`,
      title: { zh: "官方学习资料", en: "Official learning resources" },
      description: { zh: "考纲、真题、样卷、答案与申请材料。", en: "Syllabi, papers, specimens, solutions and application materials." },
    },
  ];
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: title }]} />
        <div className="page-title-row"><div><h1><Localized text={title} /></h1><p><Localized text={description} /></p></div><b>{projects.length}</b></div>
      </header>
      <nav className={`page-container track-tools track-tools-${tools.length}`} aria-label="Category tools">
        {tools.map((tool) => <Link key={tool.href} href={tool.href}><strong><Localized text={tool.title} /></strong><span><Localized text={tool.description} /></span></Link>)}
      </nav>
      {children}
      <section className="page-container directory-section" id={`${track}-directory`}>
        <CatalogClient projects={projects} fixedTrack={track} />
      </section>
    </main>
  );
}
