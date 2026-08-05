import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { PastPaperCopyright } from "../components/past-paper-section";
import { allPastPaperArchives, allProjects } from "../data";
import { pastPaperAccessLabels, pastPaperAuthorityLabels, pastPaperAvailabilityLabels, pastPaperKindLabels } from "../lib/past-paper-labels";
import { projectHref } from "../lib/paths";
import { t, type ProjectRecord, type Track } from "../lib/types";

export const metadata: Metadata = {
  title: "数学真题、样卷与答案入口 / Mathematics Past Papers and Samples",
  description: "按数学竞赛、数学建模、课程统考和入学测评查询官方真题、样卷、答案及明确标注的第三方公开索引。",
};

const groups: Array<{ track: Track; title: ReturnType<typeof t> }> = [
  { track: "competition", title: t("数学竞赛", "Mathematics competitions") },
  { track: "modeling", title: t("数学建模", "Mathematical modeling") },
  { track: "curriculum", title: t("数学课程与统考", "Mathematics curricula and subject exams") },
  { track: "assessment", title: t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments") },
];

export default function Page() {
  const records = allPastPaperArchives
    .map((archive) => ({ archive, project: allProjects.find((project) => project.id === archive.projectId) }))
    .filter((record): record is { archive: (typeof allPastPaperArchives)[number]; project: ProjectRecord } => Boolean(record.project));
  const lastUpdated = records.map(({ archive }) => archive.lastVerified).sort().at(-1) ?? "";

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("真题与样卷", "Past papers and samples") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">数学真题、样卷与答案入口</span><span className="lang-en">Mathematics past papers, samples and solutions</span></h1>
            <p><span className="lang-zh">官方档案优先；考试机构未公开完整真题时，列官方样卷、受限入口或明确标注的第三方公开索引。仅收录数学内容。</span><span className="lang-en">Official archives come first. Where an awarding body does not publish full past papers, official samples, restricted portals or clearly labelled public third-party indexes are listed. Mathematics content only.</span></p>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{lastUpdated}</p>
          </div>
          <b>{records.length}</b>
        </div>
      </header>

      <div className="page-container past-paper-directory">
        <nav className="resource-jump" aria-label="Past-paper categories">
          {groups.map((group) => {
            const count = records.filter(({ project }) => project.track === group.track).length;
            return <a href={`#${group.track}`} key={group.track}><Localized text={group.title} /><small>{count}</small></a>;
          })}
        </nav>

        <PastPaperCopyright />

        {groups.map((group) => {
          const groupRecords = records.filter(({ project }) => project.track === group.track);
          return (
            <section className="past-paper-directory-group" id={group.track} key={group.track}>
              <div className="section-heading">
                <h2><Localized text={group.title} /></h2>
              </div>
              <div className="past-paper-directory-list">
                {groupRecords.map(({ archive, project }) => (
                  <article className="past-paper-directory-card" data-past-paper-id={archive.id} key={archive.id}>
                    <div className="past-paper-directory-heading">
                      <div>
                        <span className={`past-paper-status past-paper-${archive.availability}`}><Localized text={pastPaperAvailabilityLabels[archive.availability]} /></span>
                        <h3><Link href={projectHref(project)}><Localized text={project.title} /></Link></h3>
                      </div>
                      <b>{project.shortTitle}</b>
                    </div>
                    <p><Localized text={archive.summary} /></p>
                    {archive.links.length > 0 ? (
                      <ul>
                        {archive.links.map((link) => (
                          <li key={`${archive.id}-${link.url}`}>
                            <a href={link.url} target="_blank" rel="noreferrer"><Localized text={link.title} /></a>
                            <span><Localized text={pastPaperAuthorityLabels[link.authority]} /> · <Localized text={pastPaperKindLabels[link.kind]} /> · <Localized text={pastPaperAccessLabels[link.access]} /></span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="past-paper-empty"><span className="lang-zh">暂未找到可核验的公开入口。</span><span className="lang-en">No verifiable public source has been found.</span></div>
                    )}
                    <footer><Link href={`${projectHref(project)}#past-papers`}><span className="lang-zh">查看项目说明</span><span className="lang-en">View project notes</span></Link></footer>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
