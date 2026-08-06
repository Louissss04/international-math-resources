import Link from "next/link";
import {
  journalArticleTypeLabels,
  journalAudienceLabels,
  journalFeeLabels,
  journalLinkKindLabels,
  journalOutcomeLabels,
  journalReviewLabels,
  journalSubmissionLabels,
  journalTopicLabels,
  journalTypeLabels,
} from "../lib/journal-labels";
import { projectHref } from "../lib/paths";
import { t, type JournalRecord, type ProjectRecord, type SourceKind, type SourceRecord } from "../lib/types";
import { Breadcrumbs } from "./breadcrumbs";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";
import { StatusBadge } from "./status-badge";

const sourceKinds: Record<SourceKind, ReturnType<typeof t>> = {
  official: t("官方页面", "Official page"),
  "official-data": t("官方数据", "Official data"),
  "official-archive": t("官方档案", "Official archive"),
  "secondary-archive": t("历史汇编", "Secondary archive"),
};

export function JournalDetail({
  journal,
  sources,
  relatedProjects,
}: {
  journal: JournalRecord;
  sources: SourceRecord[];
  relatedProjects: ProjectRecord[];
}) {
  const journalSources = journal.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));
  const primaryLinks = [
    journal.links.find((link) => link.kind === "submission-portal"),
    journal.links.find((link) => link.kind === "author-guidelines"),
    journal.links.find((link) => link.kind === "home"),
  ].filter((link, index, links) => Boolean(link) && links.findIndex((candidate) => candidate?.url === link?.url) === index);

  return (
    <main>
      <div className="page-container detail-top journal-detail-top">
        <Breadcrumbs items={[
          { label: t("期刊与投稿", "Journals and submission"), href: "/journals" },
          { label: journal.title },
        ]} />
        <div className="record-heading">
          <div>
            <div className="record-kicker">
              {journal.status !== "confirmed" && <StatusBadge status={journal.status} />}
              <span><Localized text={journal.publisher} /></span>
              <span><Localized text={journalTypeLabels[journal.journalType]} /></span>
            </div>
            <h1><Localized text={journal.title} /></h1>
            <p className="record-summary"><Localized text={journal.summary} /></p>
          </div>
          <div className="record-actions">
            {primaryLinks.map((link, index) => link && (
              <a className={index === 0 ? "primary-button" : "secondary-button"} href={link.url} key={`${link.kind}-${link.url}`} target="_blank" rel="noreferrer">
                <Localized text={journalLinkKindLabels[link.kind]} />
              </a>
            ))}
          </div>
        </div>

        <dl className="fact-grid journal-fact-grid">
          {journal.facts.map((fact) => (
            <div key={fact.label.en}>
              <dt><Localized text={fact.label} /></dt>
              <dd><Localized text={fact.value} /><SourceCitations ids={fact.sourceIds} sources={sources} /></dd>
            </div>
          ))}
        </dl>
        <div className="record-stamp"><span><span className="lang-zh">最后更新</span><span className="lang-en">Last updated</span>: {journal.lastVerified}</span></div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          <a href="#journal-topics"><span className="lang-zh">主要主题与稿件类型</span><span className="lang-en">Topics and article types</span></a>
          <a href="#journal-submission-basics"><span className="lang-zh">投稿要点</span><span className="lang-en">Submission essentials</span></a>
          {journal.sections.map((section) => <a href={`#${section.id}`} key={section.id}><Localized text={section.title} /></a>)}
          <a href="#journal-official-links"><span className="lang-zh">官方投稿入口与材料</span><span className="lang-en">Official submission links</span></a>
          <a href="#journal-sources"><span className="lang-zh">来源</span><span className="lang-en">Sources</span></a>
        </aside>

        <div className="record-content">
          <section id="journal-topics" className="record-section">
            <h2><span className="lang-zh">主要主题与稿件类型</span><span className="lang-en">Main topics and article types</span></h2>
            <div className="journal-classification-grid">
              <div><h3><span className="lang-zh">数学主题</span><span className="lang-en">Mathematics topics</span></h3><div className="journal-topic-list">{journal.topicTags.map((topic) => <span key={topic}><Localized text={journalTopicLabels[topic]} /></span>)}</div></div>
              <div><h3><span className="lang-zh">稿件类型</span><span className="lang-en">Article types</span></h3><ul>{journal.articleTypes.map((type) => <li key={type}><Localized text={journalArticleTypeLabels[type]} /></li>)}</ul></div>
              <div><h3><span className="lang-zh">发表语言</span><span className="lang-en">Publication languages</span></h3><ul>{journal.languages.map((language) => <li key={language.en}><Localized text={language} /></li>)}</ul></div>
            </div>
          </section>

          <section id="journal-submission-basics" className="record-section">
            <h2><span className="lang-zh">投稿要点</span><span className="lang-en">Submission essentials</span></h2>
            <dl className="journal-policy-list">
              <div><dt><span className="lang-zh">作者范围</span><span className="lang-en">Author scope</span></dt><dd><Localized text={journalAudienceLabels[journal.audienceScope]} /></dd></div>
              <div><dt><span className="lang-zh">学生资格</span><span className="lang-en">Student eligibility</span></dt><dd><Localized text={journal.studentEligibility} /></dd></div>
              <div><dt><span className="lang-zh">导师与共同作者</span><span className="lang-en">Mentors and co-authors</span></dt><dd><Localized text={journal.mentorPolicy} /></dd></div>
              <div><dt><span className="lang-zh">评审方式</span><span className="lang-en">Review model</span></dt><dd><Localized text={journalReviewLabels[journal.reviewModel]} /></dd></div>
              <div><dt><span className="lang-zh">成果形式</span><span className="lang-en">Publication outcome</span></dt><dd><Localized text={journalOutcomeLabels[journal.outcomeType]} /></dd></div>
              <div><dt><span className="lang-zh">当前状态</span><span className="lang-en">Current status</span></dt><dd><Localized text={journalSubmissionLabels[journal.submissionStatus]} /></dd></div>
              <div><dt><span className="lang-zh">投稿时间</span><span className="lang-en">Submission timing</span></dt><dd><Localized text={journal.submissionSchedule} /></dd></div>
              <div><dt><span className="lang-zh">费用</span><span className="lang-en">Fees</span></dt><dd><Localized text={journal.fees} /> · <Localized text={journalFeeLabels[journal.feeCategory]} /></dd></div>
              <div><dt><span className="lang-zh">版权与许可</span><span className="lang-en">Copyright and licence</span></dt><dd><Localized text={journal.copyrightPolicy} /></dd></div>
            </dl>
          </section>

          {journal.sections.map((section) => (
            <section className="record-section" id={section.id} key={section.id}>
              <h2><Localized text={section.title} /></h2>
              {section.intro && <p className="section-intro"><Localized text={section.intro} /></p>}
              {section.paragraphs?.map((paragraph, index) => <p key={index}><Localized text={paragraph} /></p>)}
              {section.bullets && <ul className="fact-list">{section.bullets.map((bullet, index) => <li key={index}><Localized text={bullet} /></li>)}</ul>}
              {section.tables?.map((table, tableIndex) => (
                <div className="data-block" key={tableIndex}>
                  {table.title && <h3><Localized text={table.title} /></h3>}
                  <div className="table-scroll"><table>
                    <thead><tr>{table.columns.map((column) => <th key={column.en}><Localized text={column} /></th>)}</tr></thead>
                    <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}><Localized text={cell} />{cellIndex === row.cells.length - 1 && <SourceCitations ids={row.sourceIds} sources={sources} />}</td>)}</tr>)}</tbody>
                  </table></div>
                  {table.note && <p className="table-note"><Localized text={table.note} /></p>}
                </div>
              ))}
            </section>
          ))}

          <section id="journal-official-links" className="record-section">
            <h2><span className="lang-zh">官方投稿入口与材料</span><span className="lang-en">Official submission links and materials</span></h2>
            <div className="journal-link-grid">
              {journal.links.map((link) => (
                <a href={link.url} key={`${link.kind}-${link.url}`} target="_blank" rel="noreferrer">
                  <small><Localized text={journalLinkKindLabels[link.kind]} /></small>
                  <strong><Localized text={link.label} /></strong>
                  {link.note && <span><Localized text={link.note} /></span>}
                </a>
              ))}
            </div>
          </section>

          <section id="journal-sources" className="record-section">
            <h2><span className="lang-zh">来源</span><span className="lang-en">Sources</span></h2>
            <ol className="source-records">
              {journalSources.map((source, index) => (
                <li id={`source-${source.id}`} key={source.id}>
                  <b>{index + 1}</b>
                  <div><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a><p><Localized text={source.owner} /> · <Localized text={sourceKinds[source.kind]} /></p></div>
                </li>
              ))}
            </ol>
          </section>

          {relatedProjects.length > 0 && (
            <section className="record-section related-records">
              <h2><span className="lang-zh">相关研究准备</span><span className="lang-en">Related research preparation</span></h2>
              <div>{relatedProjects.map((project) => <Link href={projectHref(project)} key={project.id}><span>{project.shortTitle}</span><Localized text={project.title} /></Link>)}</div>
            </section>
          )}

          <p className="journal-back-link"><Link href="/journals"><span className="lang-zh">返回期刊目录</span><span className="lang-en">Back to journal directory</span></Link></p>
        </div>
      </div>
    </main>
  );
}
