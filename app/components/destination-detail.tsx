import Link from "next/link";
import type { DestinationGuideRecord, ProjectRecord, SourceKind, SourceRecord } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Breadcrumbs } from "./breadcrumbs";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";

const sourceKinds: Record<SourceKind, { zh: string; en: string }> = {
  official: { zh: "官方页面", en: "Official page" },
  "official-data": { zh: "官方数据", en: "Official data" },
  "official-archive": { zh: "官方档案", en: "Official archive" },
  "secondary-archive": { zh: "历史汇编", en: "Secondary archive" },
};

export function DestinationDetail({
  guide,
  sources,
  relatedProjects,
}: {
  guide: DestinationGuideRecord;
  sources: SourceRecord[];
  relatedProjects: ProjectRecord[];
}) {
  const guideSources = guide.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));

  return (
    <main>
      <div className="page-container detail-top">
        <Breadcrumbs items={[
          { label: { zh: "按留学地区查询", en: "Study destinations" }, href: "/destinations" },
          { label: guide.shortTitle },
        ]} />
        <div className="record-heading">
          <div>
            <p className="label"><span className="lang-zh">本科数学要求</span><span className="lang-en">Undergraduate mathematics requirements</span></p>
            <h1><Localized text={guide.title} /></h1>
            <p className="record-summary"><Localized text={guide.summary} /></p>
          </div>
          {guideSources[0] && (
            <div className="record-actions">
              <a className="secondary-button" href={guideSources[0].url} target="_blank" rel="noreferrer">
                <span className="lang-zh">首要官方入口</span><span className="lang-en">Primary official source</span>
              </a>
            </div>
          )}
        </div>
        <dl className="fact-grid">
          {guide.facts.map((fact) => (
            <div key={fact.label.en}>
              <dt><Localized text={fact.label} /></dt>
              <dd><Localized text={fact.value} /><SourceCitations ids={fact.sourceIds} sources={sources} /></dd>
            </div>
          ))}
        </dl>
        <div className="record-stamp">
          <span><span className="lang-zh">范围</span><span className="lang-en">Scope</span>: <span className="lang-zh">仅数学相关要求</span><span className="lang-en">Mathematics only</span></span>
          <span><span className="lang-zh">最后更新</span><span className="lang-en">Last updated</span>: {guide.lastVerified}</span>
        </div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          {guide.sections.map((section) => <a key={section.id} href={`#${section.id}`}><Localized text={section.title} /></a>)}
          {relatedProjects.length > 0 && <a href="#related-records"><span className="lang-zh">相关课程与考试</span><span className="lang-en">Related curricula and tests</span></a>}
          <a href="#sources"><span className="lang-zh">官方来源</span><span className="lang-en">Official sources</span></a>
        </aside>

        <div className="record-content">
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} className="record-section">
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

          {relatedProjects.length > 0 && (
            <section id="related-records" className="record-section related-records">
              <h2><span className="lang-zh">相关课程与考试</span><span className="lang-en">Related curricula and tests</span></h2>
              <div>{relatedProjects.map((project) => (
                <Link key={project.id} href={projectHref(project)}>
                  <span>{project.shortTitle}</span>
                  <small><Localized text={project.title} /></small>
                </Link>
              ))}</div>
            </section>
          )}

          <section id="sources" className="record-section">
            <h2><span className="lang-zh">官方来源</span><span className="lang-en">Official sources</span></h2>
            <ul className="source-records">{guideSources.map((source, index) => (
              <li key={source.id}>
                <span>[{index + 1}]</span>
                <div>
                  <a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a>
                  <p><Localized text={source.owner} /> · <span className="lang-zh">{sourceKinds[source.kind].zh}</span><span className="lang-en">{sourceKinds[source.kind].en}</span></p>
                  {source.note && <p><Localized text={source.note} /></p>}
                </div>
              </li>
            ))}</ul>
          </section>
        </div>
      </div>
    </main>
  );
}
