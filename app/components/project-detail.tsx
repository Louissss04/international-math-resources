import Link from "next/link";
import type { ProjectRecord, SourceRecord, ThresholdRecord, Track } from "../lib/types";
import { projectHref, trackPath } from "../lib/paths";
import { AddToPlan } from "./add-to-plan";
import { Breadcrumbs } from "./breadcrumbs";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";
import { StatusBadge } from "./status-badge";

const trackLabels: Record<Track, { zh: string; en: string }> = {
  competition: { zh: "数学竞赛", en: "Competitions" },
  modeling: { zh: "数学建模", en: "Modeling" },
  research: { zh: "数学科研", en: "Research" },
  summer: { zh: "数学夏校", en: "Summer programs" },
  assessment: { zh: "课程与考试", en: "Assessments" },
};

export function ProjectDetail({
  project,
  sources,
  thresholds,
  related,
}: {
  project: ProjectRecord;
  sources: SourceRecord[];
  thresholds: ThresholdRecord[];
  related: ProjectRecord[];
}) {
  const track = trackLabels[project.track];
  const projectThresholds = thresholds.filter((item) => item.projectId === project.id);
  const projectSources = project.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));

  return (
    <main>
      <div className="page-container detail-top">
        <Breadcrumbs items={[
          { label: track, href: `/${trackPath[project.track]}` },
          { label: project.title },
        ]} />
        <div className="record-heading">
          <div>
            <div className="record-kicker">
              <StatusBadge status={project.status} />
              <span>{project.organizer.zh} / {project.organizer.en}</span>
            </div>
            <h1><Localized text={project.title} /></h1>
            <p className="record-summary"><Localized text={project.summary} /></p>
          </div>
          <div className="record-actions">
            <AddToPlan project={project} />
            <a className="secondary-button" href={projectSources[0]?.url ?? "/sources"} target="_blank" rel="noreferrer">
              <span className="lang-zh">官方页面</span>
              <span className="lang-en">Official page</span>
            </a>
          </div>
        </div>
        <dl className="fact-grid">
          {project.facts.map((fact) => (
            <div key={fact.label.en}>
              <dt><Localized text={fact.label} /></dt>
              <dd>
                <Localized text={fact.value} />
                <SourceCitations ids={fact.sourceIds} sources={sources} />
              </dd>
            </div>
          ))}
        </dl>
        <div className="record-stamp">
          <span><span className="lang-zh">适用周期</span><span className="lang-en">Cycle</span>: {project.cycle}</span>
          <span><span className="lang-zh">最后核验</span><span className="lang-en">Last verified</span>: {project.lastVerified}</span>
        </div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          {project.dates.length > 0 && <a href="#dates"><span className="lang-zh">日期</span><span className="lang-en">Dates</span></a>}
          {project.sections.map((section) => <a key={section.id} href={`#${section.id}`}><Localized text={section.title} /></a>)}
          {projectThresholds.length > 0 && <a href="#thresholds"><span className="lang-zh">历年分数线</span><span className="lang-en">Historical thresholds</span></a>}
          <a href="#sources"><span className="lang-zh">来源</span><span className="lang-en">Sources</span></a>
        </aside>

        <div className="record-content">
          {project.dates.length > 0 && (
            <section id="dates" className="record-section">
              <h2><span className="lang-zh">日期</span><span className="lang-en">Dates</span></h2>
              <div className="table-scroll"><table>
                <thead><tr>
                  <th><span className="lang-zh">节点</span><span className="lang-en">Milestone</span></th>
                  <th><span className="lang-zh">日期</span><span className="lang-en">Date</span></th>
                  <th><span className="lang-zh">地区／时区</span><span className="lang-en">Region / time zone</span></th>
                  <th><span className="lang-zh">状态</span><span className="lang-en">Status</span></th>
                  <th><span className="lang-zh">说明</span><span className="lang-en">Note</span></th>
                </tr></thead>
                <tbody>{project.dates.map((item) => (
                  <tr key={item.id}>
                    <td><Localized text={item.label} /></td>
                    <td><time dateTime={item.date}>{item.date}{item.endDate ? ` — ${item.endDate}` : ""}{item.time ? ` ${item.time}` : ""}</time></td>
                    <td>{item.region ? <Localized text={item.region} /> : "—"}{item.timezone ? ` ${item.timezone}` : ""}</td>
                    <td><StatusBadge status={item.status} /></td>
                    <td>{item.note ? <Localized text={item.note} /> : "—"}<SourceCitations ids={item.sourceIds} sources={sources} /></td>
                  </tr>
                ))}</tbody>
              </table></div>
            </section>
          )}

          {project.sections.map((section) => (
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

          {projectThresholds.length > 0 && (
            <section id="thresholds" className="record-section">
              <div className="section-title-row">
                <h2><span className="lang-zh">历年分数线</span><span className="lang-en">Historical thresholds</span></h2>
                <Link href={`/archive?project=${project.id}`}><span className="lang-zh">打开完整档案</span><span className="lang-en">Open full archive</span></Link>
              </div>
              <div className="table-scroll"><table>
                <thead><tr>
                  <th><span className="lang-zh">年份</span><span className="lang-en">Year</span></th>
                  <th><span className="lang-zh">场次</span><span className="lang-en">Sitting</span></th>
                  <th><span className="lang-zh">指标</span><span className="lang-en">Metric</span></th>
                  <th><span className="lang-zh">分数</span><span className="lang-en">Value</span></th>
                  <th><span className="lang-zh">状态／来源</span><span className="lang-en">Status / source</span></th>
                </tr></thead>
                <tbody>{projectThresholds.slice().sort((a, b) => b.year.localeCompare(a.year)).map((item) => (
                  <tr key={item.id}>
                    <td>{item.year}</td><td>{item.sitting ?? "—"}</td><td><Localized text={item.metric} /></td>
                    <td>{item.value}{item.maxScore ? ` / ${item.maxScore}` : ""}</td>
                    <td><StatusBadge status={item.status} /><SourceCitations ids={item.sourceIds} sources={sources} /></td>
                  </tr>
                ))}</tbody>
              </table></div>
            </section>
          )}

          <section id="sources" className="record-section">
            <h2><span className="lang-zh">来源</span><span className="lang-en">Sources</span></h2>
            <ol className="source-records">
              {projectSources.map((source) => (
                <li key={source.id} id={`source-${source.id}`}>
                  <b>{source.id}</b>
                  <div><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a>
                    <p>{source.owner.zh} / {source.owner.en} · {source.kind} · <span className="lang-zh">核验</span><span className="lang-en">verified</span> {source.verifiedAt}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {related.length > 0 && (
            <section className="record-section related-records">
              <h2><span className="lang-zh">相关项目</span><span className="lang-en">Related records</span></h2>
              <div>{related.map((item) => <Link key={item.id} href={projectHref(item)}><span>{item.shortTitle}</span><Localized text={item.title} /></Link>)}</div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

