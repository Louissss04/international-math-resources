import Link from "next/link";
import { t, type AdmissionRequirementRecord, type AdmissionRequirementType, type AssessmentSyllabusRecord, type BookResourceRecord, type LearningResourceRecord, type PastPaperArchiveRecord, type ProjectRecord, type SourceKind, type SourceRecord, type SyllabusClassification, type ThresholdRecord, type Track, type VideoResourceRecord } from "../lib/types";
import { trackLabel } from "../lib/display-labels";
import { projectHref, syllabusHref, trackPath } from "../lib/paths";
import { syllabusClassificationLabels } from "../lib/syllabus-labels";
import { AddToPlan } from "./add-to-plan";
import { Breadcrumbs } from "./breadcrumbs";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";
import { StatusBadge } from "./status-badge";
import { LearningResourceList } from "./learning-resource-list";
import { PastPaperSection } from "./past-paper-section";
import { VideoResourceList } from "./video-resource-list";
import { BookResourceList } from "./book-resource-list";
import { AcademicIntegrityNotice } from "./academic-integrity-notice";

const dateSectionLabels: Record<Track, ReturnType<typeof t>> = {
  competition: t("赛程与报名节点", "Competition schedule and registration"),
  modeling: t("日期与提交节点", "Dates and submission milestones"),
  research: t("研究节点", "Research milestones"),
  summer: t("申请与项目日期", "Application and program dates"),
  curriculum: t("课程与统考节点", "Course and subject-exam milestones"),
  assessment: t("考试日期与报名节点", "Test dates and registration"),
};

const thresholdSectionLabels: Record<Track, ReturnType<typeof t>> = {
  competition: t("历年奖项线与晋级线", "Historical award and qualification thresholds"),
  modeling: t("历年结果数据", "Historical result data"),
  research: t("历年结果数据", "Historical result data"),
  summer: t("历年录取数据", "Historical admissions data"),
  curriculum: t("历年成绩与等级边界", "Historical scores and grade boundaries"),
  assessment: t("历年成绩与参考分数", "Historical scores and reference values"),
};

const thresholdColumnLabels: Record<Track, { sitting: ReturnType<typeof t>; metric: ReturnType<typeof t>; value: ReturnType<typeof t> }> = {
  competition: { sitting: t("场次／组别", "Sitting / division"), metric: t("奖项／晋级指标", "Award / qualification metric"), value: t("分数线／数值", "Threshold / value") },
  modeling: { sitting: t("赛季", "Cycle"), metric: t("结果指标", "Result metric"), value: t("数值", "Value") },
  research: { sitting: t("周期", "Cycle"), metric: t("结果指标", "Result metric"), value: t("数值", "Value") },
  summer: { sitting: t("申请季", "Application cycle"), metric: t("录取指标", "Admissions metric"), value: t("数值", "Value") },
  curriculum: { sitting: t("考试系列／课程", "Exam series / course"), metric: t("成绩／等级指标", "Score / grade metric"), value: t("分数／边界", "Score / boundary") },
  assessment: { sitting: t("考试场次", "Test sitting"), metric: t("成绩指标", "Score metric"), value: t("分数／等级", "Score / level") },
};

const resourceSectionLabels: Record<Track, { title: ReturnType<typeof t> }> = {
  competition: { title: t("官方样卷、试题与练习资料", "Official samples, papers and practice resources") },
  modeling: { title: t("官方题目、指南与示例", "Official problems, guides and examples") },
  research: { title: t("官方研究与规范资料", "Official research and standards resources") },
  summer: { title: t("官方课程与申请材料", "Official program and application materials") },
  curriculum: { title: t("官方考纲、样卷与课程资料", "Official specifications, specimens and course resources") },
  assessment: { title: t("官方样卷与备考资料", "Official specimen and preparation resources") },
};

const sourceKinds: Record<SourceKind, ReturnType<typeof t>> = {
  official: t("官方页面", "Official page"),
  "official-data": t("官方数据", "Official data"),
  "official-archive": t("官方档案", "Official archive"),
  "secondary-archive": t("历史汇编", "Secondary archive"),
};

const syllabusCtaLabels: Record<SyllabusClassification, ReturnType<typeof t>> = {
  "formal-specification": t("查看中文考纲", "Open translated syllabus"),
  "content-framework": t("查看中文内容框架", "Open translated content framework"),
  "structure-only": t("查看中文范围与结构", "Open translated scope and structure"),
};

const admissionRequirementLabels: Record<AdmissionRequirementType, ReturnType<typeof t>> = {
  required: t("必须参加", "Required"),
  "required-alternative": t("指定替代路径", "Required alternative"),
  "offer-condition": t("录取条件", "Offer condition"),
  recommended: t("官方推荐", "Recommended"),
  considered: t("会参考", "Considered"),
};

export function ProjectDetail({
  project,
  sources,
  thresholds,
  related,
  learningResources,
  videoResources,
  bookResources,
  syllabus,
  pastPaperArchive,
  admissionRequirements,
}: {
  project: ProjectRecord;
  sources: SourceRecord[];
  thresholds: ThresholdRecord[];
  related: ProjectRecord[];
  learningResources: LearningResourceRecord[];
  videoResources: VideoResourceRecord[];
  bookResources: BookResourceRecord[];
  syllabus?: AssessmentSyllabusRecord;
  pastPaperArchive?: PastPaperArchiveRecord;
  admissionRequirements: AdmissionRequirementRecord[];
}) {
  const track = trackLabel(project.track);
  const dateSectionLabel = dateSectionLabels[project.track];
  const thresholdSectionLabel = thresholdSectionLabels[project.track];
  const thresholdColumns = thresholdColumnLabels[project.track];
  const resourceSection = resourceSectionLabels[project.track];
  const hasPastPaperSection = project.track === "competition"
    || (project.track === "modeling" && project.eligibilityTags.includes("modeling-competition"))
    || project.track === "curriculum"
    || project.track === "assessment";
  const archiveHref = project.track === "competition"
    ? `/competition-results?project=${project.id}`
    : project.track === "curriculum"
      ? `/course-scores?project=${project.id}`
    : project.track === "assessment"
      ? `/assessment-scores?project=${project.id}`
      : null;
  const projectThresholds = thresholds.filter((item) => item.projectId === project.id);
  const pageLastUpdated = [
    project.lastVerified,
    ...learningResources.map((resource) => resource.verifiedAt),
    ...videoResources.map((resource) => resource.verifiedAt),
    ...bookResources.map((resource) => resource.verifiedAt),
    syllabus?.lastVerified,
    pastPaperArchive?.lastVerified,
    ...admissionRequirements.map((record) => record.lastVerified),
  ].filter((date): date is string => Boolean(date)).sort().at(-1) ?? project.lastVerified;
  const projectSources = project.sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is SourceRecord => Boolean(source));
  const thresholdYears = Array.from(
    projectThresholds.reduce((groups, item) => {
      const records = groups.get(item.year) ?? [];
      records.push(item);
      groups.set(item.year, records);
      return groups;
    }, new Map<string, ThresholdRecord[]>()),
  ).sort(([yearA], [yearB]) => yearB.localeCompare(yearA));
  const integrityContext = project.track === "competition"
    ? "competition"
    : project.track === "modeling" || project.track === "research"
      ? "research"
      : project.track === "summer"
        ? "application"
        : "exam";

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
              {project.status !== "confirmed" && <StatusBadge status={project.status} />}
              <span><Localized text={project.organizer} /></span>
            </div>
            <h1><Localized text={project.title} /></h1>
            <p className="record-summary"><Localized text={project.summary} /></p>
          </div>
          <div className="record-actions">
            <AddToPlan project={project} />
            {syllabus && <Link className="secondary-button" href={syllabusHref(syllabus.slug)}><Localized text={syllabusClassificationLabels[syllabus.classification]} /></Link>}
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
        <AcademicIntegrityNotice context={integrityContext} showGuideLink={project.id !== "research-integrity"} />
        <div className="record-stamp">
          <span><span className="lang-zh">适用周期</span><span className="lang-en">Cycle</span>: {project.cycle}</span>
          <span><span className="lang-zh">最后更新</span><span className="lang-en">Last updated</span>: {pageLastUpdated}</span>
        </div>
      </div>

      <div className="record-layout page-container">
        <aside className="section-index" aria-label="On this page">
          <strong><span className="lang-zh">本页内容</span><span className="lang-en">On this page</span></strong>
          {project.dates.length > 0 && <a href="#dates"><Localized text={dateSectionLabel} /></a>}
          {project.sections.map((section) => <a key={section.id} href={`#${section.id}`}><Localized text={section.title} /></a>)}
          {syllabus && <a href="#official-syllabus"><Localized text={syllabusClassificationLabels[syllabus.classification]} /></a>}
          {hasPastPaperSection && <a href="#past-papers">{project.track === "modeling" ? <><span className="lang-zh">历届题目与作品</span><span className="lang-en">Past problems and work</span></> : <><span className="lang-zh">真题、样卷与答案</span><span className="lang-en">Past papers and samples</span></>}</a>}
          {learningResources.length > 0 && <a href="#official-learning-resources"><Localized text={resourceSection.title} /></a>}
          {videoResources.length > 0 && <a href="#video-resources"><span className="lang-zh">公开视频课程与讲解</span><span className="lang-en">Public video courses and walkthroughs</span></a>}
          {bookResources.length > 0 && <a href="#books"><span className="lang-zh">教材、习题集与参考书</span><span className="lang-en">Textbooks, problem books and references</span></a>}
          {projectThresholds.length > 0 && <a href="#thresholds"><Localized text={thresholdSectionLabel} /></a>}
          {admissionRequirements.length > 0 && <a href="#admission-requirements"><span className="lang-zh">学校与专业要求</span><span className="lang-en">School and programme requirements</span></a>}
          <a href="#sources"><span className="lang-zh">来源</span><span className="lang-en">Sources</span></a>
        </aside>

        <div className="record-content">
          {project.dates.length > 0 && (
            <section id="dates" className="record-section">
              <h2><Localized text={dateSectionLabel} /></h2>
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

          {syllabus && (
            <section id="official-syllabus" className="record-section syllabus-project-entry">
              <div className="section-title-row">
                <h2><Localized text={syllabus.title} /></h2>
                <span className={`syllabus-classification syllabus-${syllabus.classification}`}><Localized text={syllabusClassificationLabels[syllabus.classification]} /></span>
              </div>
              <p className="section-intro"><Localized text={syllabus.summary} /></p>
              <dl className="fact-grid syllabus-entry-facts">
                <div><dt><span className="lang-zh">适用版本</span><span className="lang-en">Applicable version</span></dt><dd><Localized text={syllabus.applicableCycle} /></dd></div>
              </dl>
              <Link className="primary-button syllabus-entry-link" href={syllabusHref(syllabus.slug)}><Localized text={syllabusCtaLabels[syllabus.classification]} /></Link>
            </section>
          )}

          {hasPastPaperSection && <PastPaperSection archive={pastPaperArchive} context={project.track === "modeling" ? "modeling" : "general"} />}

          {learningResources.length > 0 && (
            <section id="official-learning-resources" className="record-section">
              <h2><Localized text={resourceSection.title} /></h2>
              <LearningResourceList resources={learningResources} />
            </section>
          )}

          {videoResources.length > 0 && (
            <section id="video-resources" className="record-section">
              <h2><span className="lang-zh">公开视频课程与讲解</span><span className="lang-en">Public video courses and walkthroughs</span></h2>
              <p className="section-intro"><span className="lang-zh">YouTube 等海外平台在中国大陆可能无法直接访问。</span><span className="lang-en">Access to YouTube and other overseas platforms varies by region.</span></p>
              <VideoResourceList resources={videoResources} />
            </section>
          )}

          {bookResources.length > 0 && (
            <section id="books" className="record-section">
              <h2><span className="lang-zh">教材、习题集与参考书</span><span className="lang-en">Textbooks, problem books and references</span></h2>
              <BookResourceList resources={bookResources} />
            </section>
          )}

          {projectThresholds.length > 0 && (
            <section id="thresholds" className="record-section">
              <div className="section-title-row">
                <h2><Localized text={thresholdSectionLabel} /></h2>
                {archiveHref && <Link href={archiveHref}><span className="lang-zh">完整档案</span><span className="lang-en">Full archive</span></Link>}
              </div>
              <div className="threshold-years">
                {thresholdYears.map(([year, records], yearIndex) => (
                  <details className="threshold-year" key={year} open={yearIndex === 0}>
                    <summary>
                      <strong>{year}</strong>
                      <span><span className="lang-zh">{records.length} 项</span><span className="lang-en">{records.length} {records.length === 1 ? "entry" : "entries"}</span></span>
                    </summary>
                    <div className="table-scroll"><table>
                      <thead><tr>
                        <th><Localized text={thresholdColumns.sitting} /></th>
                        <th><Localized text={thresholdColumns.metric} /></th>
                        <th><Localized text={thresholdColumns.value} /></th>
                        <th><span className="lang-zh">状态／来源</span><span className="lang-en">Status / source</span></th>
                      </tr></thead>
                      <tbody>{records.map((item) => (
                        <tr key={item.id}>
                          <td>{item.sitting ?? "—"}</td><td><Localized text={item.metric} />{item.note && <small><Localized text={item.note} /></small>}</td>
                          <td>{item.value}{item.maxScore ? ` / ${item.maxScore}` : ""}</td>
                          <td><StatusBadge status={item.status} /><SourceCitations ids={item.sourceIds} sources={sources} /></td>
                        </tr>
                      ))}</tbody>
                    </table></div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {admissionRequirements.length > 0 && (
            <section id="admission-requirements" className="record-section">
              <div className="section-title-row">
                <h2><span className="lang-zh">明确使用本考试的学校与专业</span><span className="lang-en">Schools and programmes that explicitly use this test</span></h2>
                <Link href={`/universities?project=${project.id}`}><span className="lang-zh">查看全部</span><span className="lang-en">View all</span></Link>
              </div>
              <div className="project-requirement-list">
                {admissionRequirements.slice(0, 8).map((record) => (
                  <article key={record.id}>
                    <div>
                      <h3><Localized text={record.institution} /></h3>
                      <span className={`requirement-type requirement-${record.requirementType}`}><Localized text={admissionRequirementLabels[record.requirementType]} /></span>
                    </div>
                    <p><span className="lang-zh">{record.programs.length} 个专业／课程</span><span className="lang-en">{record.programs.length} {record.programs.length === 1 ? "programme" : "programmes"}</span></p>
                    <small><Localized text={record.applicableCycle} /></small>
                  </article>
                ))}
              </div>
              {admissionRequirements.length > 8 && (
                <p className="table-note"><span className="lang-zh">另有 {admissionRequirements.length - 8} 组课程要求，见完整目录。</span><span className="lang-en">{admissionRequirements.length - 8} more grouped requirements are listed in the full directory.</span></p>
              )}
            </section>
          )}

          <section id="sources" className="record-section">
            <h2><span className="lang-zh">来源</span><span className="lang-en">Sources</span></h2>
            <ol className="source-records">
              {projectSources.map((source, index) => (
                <li key={source.id} id={`source-${source.id}`}>
                  <b>{index + 1}</b>
                  <div><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a>
                    <p><Localized text={source.owner} /> · <Localized text={sourceKinds[source.kind]} /></p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {related.length > 0 && (
            <section className="record-section related-records">
              <h2><span className="lang-zh">相关项目</span><span className="lang-en">Related projects</span></h2>
              <div>{related.map((item) => <Link key={item.id} href={projectHref(item)}><span>{item.shortTitle}</span><Localized text={item.title} /></Link>)}</div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
