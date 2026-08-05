import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { LearningResourceList } from "../components/learning-resource-list";
import { Localized } from "../components/localized";
import { allLearningResources, allProjects } from "../data";
import { trackLabel, trackOrder } from "../lib/display-labels";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "资料中心",
  description: "集中查阅数学竞赛、课程和考试的考纲、真题、分数线档案、官网与资料来源。",
};

const LAST_UPDATED = "2026-08-06";

const projectById = new Map(allProjects.map((project) => [project.id, project]));
const groups = trackOrder
  .map((track) => ({
    track,
    resources: allLearningResources.filter((resource) =>
      resource.projectIds.some((projectId) => projectById.get(projectId)?.track === track),
    ),
  }))
  .filter((group) => group.resources.length > 0);

const resourceSections = [
  {
    href: "/syllabi",
    title: t("考纲与范围", "Syllabi & scope"),
    description: t("官方考纲、竞赛范围及中文整理。", "Official specifications, competition scope and Chinese summaries."),
  },
  {
    href: "/past-papers",
    title: t("真题与样卷", "Papers & specimens"),
    description: t("官方真题、样卷、样题与答案入口。", "Official past papers, specimens, samples and solutions."),
  },
  {
    href: "/archive",
    title: t("分数线与成绩档案", "Thresholds & score archive"),
    description: t("按年份查询奖项线、等级边界和成绩数据。", "Award thresholds, grade boundaries and score data by year."),
  },
  {
    href: "/official-sites",
    title: t("官网目录", "Official sites"),
    description: t("主办方、考试机构、大学及官方赛区入口。", "Organisers, testing agencies, universities and official regional sites."),
  },
  {
    href: "/sources",
    title: t("资料来源", "Sources"),
    description: t("本站引用的官方页面与公开文件。", "Official pages and public documents cited by this site."),
  },
];

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("资料中心", "Resources") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">资料中心</span><span className="lang-en">Resources</span></h1>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{LAST_UPDATED}</p>
          </div>
        </div>
      </header>

      <div className="page-container resource-layout">
        <nav className="track-tools" aria-label="Resource centre">
          {resourceSections.map((section) => (
            <Link key={section.href} href={section.href}>
              <strong><Localized text={section.title} /></strong>
              <span><Localized text={section.description} /></span>
            </Link>
          ))}
        </nav>

        <div className="section-title-row">
          <h2><span className="lang-zh">官方学习资料</span><span className="lang-en">Official learning resources</span></h2>
          <b>{allLearningResources.length}</b>
        </div>

        <nav className="resource-jump" aria-label="Resource categories">
          {groups.map((group) => (
            <a key={group.track} href={`#${group.track}`}>
              <Localized text={trackLabel(group.track)} />
              <small>{group.resources.length}</small>
            </a>
          ))}
        </nav>

        {groups.map((group) => (
          <section className="resource-group" id={group.track} key={group.track}>
            <div className="section-title-row">
              <h2><Localized text={trackLabel(group.track)} /></h2>
              <b>{group.resources.length}</b>
            </div>
            <LearningResourceList resources={group.resources} projects={allProjects} />
          </section>
        ))}

        <aside className="resource-note" id="copyright">
          <strong><span className="lang-zh">版权与使用</span><span className="lang-en">Copyright and use</span></strong>
          <p><span className="lang-zh">使用或转载前请遵守来源页版权条款。CAT4、MAP Growth、UKiset 等不公开完整官方真题，本站仅列官方熟悉材料。</span><span className="lang-en">Follow the source page’s copyright terms. CAT4, MAP Growth and UKiset do not publish full official papers; only official familiarisation materials are listed.</span></p>
        </aside>
      </div>
    </main>
  );
}
