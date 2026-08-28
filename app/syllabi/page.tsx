import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { StatusBadge } from "../components/status-badge";
import { allOfficialSyllabi, allProjects } from "../data";
import { trackLabel } from "../lib/display-labels";
import { projectHref, syllabusHref } from "../lib/paths";
import { syllabusClassificationDescriptions, syllabusClassificationLabels } from "../lib/syllabus-labels";
import { t, type SyllabusClassification, type Track } from "../lib/types";

export const metadata: Metadata = {
  title: "官方考纲、范围、样卷与教材",
  description: "数学竞赛、国际课程统考、入学考试数学模块及学校定量测评的官方考纲、内容范围、样卷和官方教材中文整理。",
};

const LAST_UPDATED = "2026-08-29";
const classificationOrder: SyllabusClassification[] = ["formal-specification", "content-framework", "structure-only"];
const trackOrder: Track[] = ["competition", "curriculum", "assessment"];
const projectById = new Map(allProjects.map((project) => [project.id, project]));

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("官方考纲、范围、样卷与教材", "Official syllabi, scope, specimens and textbooks") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">官方考纲、范围、样卷与教材</span><span className="lang-en">Official syllabi, scope, specimens and textbooks</span></h1>
            <p><span className="lang-zh">只整理数学内容。依据主办方或考试机构当前有效的官方文件，逐项列出中文考纲、官方样卷、样题、答案、教材与课程。</span><span className="lang-en">Mathematics content only. Current organiser and awarding-body documents are used for translated syllabi, official specimens, samples, answers, textbooks and courses.</span></p>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{LAST_UPDATED}</p>
          </div>
          <b>{allOfficialSyllabi.length}</b>
        </div>
      </header>

      <div className="page-container">
        <section className="syllabus-classification-legend" aria-label="Syllabus classifications">
          {classificationOrder.map((classification) => (
            <article key={classification}>
              <strong><Localized text={syllabusClassificationLabels[classification]} /></strong>
              <p><Localized text={syllabusClassificationDescriptions[classification]} /></p>
            </article>
          ))}
        </section>

        {trackOrder.map((track) => {
          const syllabi = allOfficialSyllabi.filter((syllabus) => projectById.get(syllabus.projectId)?.track === track);
          if (!syllabi.length) return null;
          return (
            <section className="resource-group" id={track} key={track}>
              <div className="section-title-row"><h2><Localized text={trackLabel(track)} /></h2><b>{syllabi.length}</b></div>
              <div className="syllabus-index-grid">
                {syllabi.map((syllabus) => {
                  const project = projectById.get(syllabus.projectId);
                  if (!project) return null;
                  return (
                    <article className="syllabus-index-card" data-syllabus-id={syllabus.id} key={syllabus.id}>
                      <div>
                        <StatusBadge status={syllabus.status} />
                        <span className={`syllabus-classification syllabus-${syllabus.classification}`}><Localized text={syllabusClassificationLabels[syllabus.classification]} /></span>
                      </div>
                      <h2><Link href={syllabusHref(syllabus.slug)}><Localized text={syllabus.title} /></Link></h2>
                      <p><Localized text={syllabus.summary} /></p>
                      <footer>
                        <Link href={syllabusHref(syllabus.slug)}><span className="lang-zh">查看中文整理</span><span className="lang-en">Open translated record</span></Link>
                        <Link href={projectHref(project)}>{project.shortTitle}</Link>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
