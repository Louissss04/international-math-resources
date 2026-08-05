import Link from "next/link";
import type { AssessmentSyllabusRecord, LearningResourceRecord, PastPaperArchiveRecord, ProjectRecord } from "../lib/types";
import { trackLabel } from "../lib/display-labels";
import { projectHref, trackPath } from "../lib/paths";
import { syllabusClassificationDescriptions, syllabusClassificationLabels, syllabusSourceFormatLabels } from "../lib/syllabus-labels";
import { Breadcrumbs } from "./breadcrumbs";
import { LearningResourceList } from "./learning-resource-list";
import { Localized } from "./localized";
import { StatusBadge } from "./status-badge";
import { PastPaperSection } from "./past-paper-section";

export function SyllabusDetail({ syllabus, project, learningResources, pastPaperArchive }: { syllabus: AssessmentSyllabusRecord; project: ProjectRecord; learningResources: LearningResourceRecord[]; pastPaperArchive?: PastPaperArchiveRecord }) {
  const classification = syllabusClassificationLabels[syllabus.classification];
  const classificationDescription = syllabusClassificationDescriptions[syllabus.classification];

  return (
    <main>
      <div className="page-container detail-top">
        <Breadcrumbs items={[
          { label: trackLabel(project.track), href: `/${trackPath[project.track]}` },
          { label: project.title, href: projectHref(project) },
          { label: classification },
        ]} />
        <div className="record-heading">
          <div>
            <div className="record-kicker">
              <StatusBadge status={syllabus.status} />
              <span className={`syllabus-classification syllabus-${syllabus.classification}`}><Localized text={classification} /></span>
            </div>
            <h1><Localized text={syllabus.title} /></h1>
            <p className="record-summary"><Localized text={syllabus.summary} /></p>
          </div>
          <div className="record-actions">
            <Link className="secondary-button" href={projectHref(project)}>
              {project.track === "competition" ? (
                <><span className="lang-zh">返回竞赛详情</span><span className="lang-en">Back to contest details</span></>
              ) : project.track === "curriculum" ? (
                <><span className="lang-zh">返回课程详情</span><span className="lang-en">Back to course details</span></>
              ) : (
                <><span className="lang-zh">返回考试详情</span><span className="lang-en">Back to test details</span></>
              )}
            </Link>
            <a className="secondary-button" href={syllabus.sources[0]?.url ?? projectHref(project)} target="_blank" rel="noreferrer"><span className="lang-zh">打开官方原文</span><span className="lang-en">Open official source</span></a>
            <a className="secondary-button" href="#past-papers"><span className="lang-zh">真题与样卷</span><span className="lang-en">Past papers</span></a>
          </div>
        </div>

        <div className="syllabus-definition">
          <strong><Localized text={classification} /></strong>
          <p><Localized text={classificationDescription} /></p>
        </div>

        <dl className="fact-grid">
          <div><dt><span className="lang-zh">官方名称</span><span className="lang-en">Official name</span></dt><dd><Localized text={syllabus.officialName} /></dd></div>
          <div><dt><span className="lang-zh">适用版本</span><span className="lang-en">Applicable version</span></dt><dd><Localized text={syllabus.applicableCycle} /></dd></div>
          {syllabus.facts.map((fact) => <div key={fact.label.en}><dt><Localized text={fact.label} /></dt><dd><Localized text={fact.value} /></dd></div>)}
        </dl>
        <div className="record-stamp">
          {syllabus.effectiveFrom && <span><span className="lang-zh">生效日期</span><span className="lang-en">Effective from</span>: {syllabus.effectiveFrom}</span>}
          <span><span className="lang-zh">最后更新</span><span className="lang-en">Last updated</span>: {syllabus.lastVerified}</span>
        </div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          {syllabus.sections.map((section) => <a href={`#${section.id}`} key={section.id}><Localized text={section.title} /></a>)}
          <a href="#past-papers"><span className="lang-zh">真题、样卷与答案</span><span className="lang-en">Past papers and samples</span></a>
          {learningResources.length > 0 && <a href="#official-syllabus-materials"><span className="lang-zh">官方样卷与教材</span><span className="lang-en">Official samples and textbooks</span></a>}
          <a href="#official-syllabus-sources"><span className="lang-zh">官方原文</span><span className="lang-en">Official sources</span></a>
        </aside>

        <div className="record-content">
          <aside className="syllabus-translation-note">
            <strong><span className="lang-zh">中文译文说明</span><span className="lang-en">Chinese translation</span></strong>
            <p><Localized text={syllabus.translationNote} /></p>
          </aside>

          {syllabus.sections.map((section) => (
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
                    <tbody>{table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.cells.map((cell, cellIndex) => <td key={cellIndex}><Localized text={cell} /></td>)}</tr>)}</tbody>
                  </table></div>
                  {table.note && <p className="table-note"><Localized text={table.note} /></p>}
                </div>
              ))}
            </section>
          ))}

          <PastPaperSection archive={pastPaperArchive} />

          {learningResources.length > 0 && (
            <section className="record-section" id="official-syllabus-materials">
              <h2><span className="lang-zh">官方样卷、教材与配套资料</span><span className="lang-en">Official specimen papers, textbooks and supporting materials</span></h2>
              <p className="section-intro"><span className="lang-zh">优先列出主办方提供的样卷、样题、答案与机考练习，再列官方教材、课程、题库和历年材料。</span><span className="lang-en">Organiser specimen papers, sample questions, answers and computer-based practice are listed first, followed by official textbooks, courses, question banks and archives.</span></p>
              <LearningResourceList resources={learningResources} />
            </section>
          )}

          <section className="record-section" id="official-syllabus-sources">
            <h2><span className="lang-zh">官方原文与版本</span><span className="lang-en">Official sources and versions</span></h2>
            <div className="syllabus-source-grid">
              {syllabus.sources.map((source) => (
                <article className="syllabus-source-card" key={source.url}>
                  <div><span><Localized text={syllabusSourceFormatLabels[source.format]} /></span>{source.version && <b><Localized text={source.version} /></b>}</div>
                  <h3><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.title} /></a></h3>
                  <p><Localized text={source.provider} /></p>
                  {source.note && <small><Localized text={source.note} /></small>}
                  <a href={source.url} target="_blank" rel="noreferrer"><span className="lang-zh">打开官方原文</span><span className="lang-en">Open official source</span></a>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
