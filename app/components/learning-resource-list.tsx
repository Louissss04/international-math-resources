import Link from "next/link";
import type { LearningResourceAccess, LearningResourceKind, LearningResourceRecord, ProjectRecord } from "../lib/types";
import { t } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";

const kindLabels: Record<LearningResourceKind, ReturnType<typeof t>> = {
  "past-papers": t("历年试题与答案", "Past papers and solutions"),
  "sample-questions": t("官方样卷与样题", "Official specimen papers and samples"),
  "official-guide": t("官方说明与指南", "Official guide"),
  "official-textbook": t("官方教材与书目", "Official textbook or publication"),
  "practice-platform": t("官方练习平台", "Official practice platform"),
  courseware: t("课程与专题资源", "Courseware and topic resources"),
  "application-materials": t("申请材料", "Application materials"),
  "results-and-exemplars": t("结果与优秀作品", "Results and exemplars"),
};

const kindPriority: Record<LearningResourceKind, number> = {
  "sample-questions": 0,
  "past-papers": 1,
  "practice-platform": 2,
  "official-guide": 3,
  "official-textbook": 4,
  courseware: 5,
  "results-and-exemplars": 6,
  "application-materials": 7,
};

const accessLabels: Record<LearningResourceAccess, ReturnType<typeof t>> = {
  free: t("免费", "Free"),
  account: t("免费，可能需要账户", "Free; account may be required"),
  mixed: t("部分免费", "Some material is free"),
  paid: t("付费", "Paid"),
  school: t("由学校或考点提供", "Provided through a school or test centre"),
};

export function LearningResourceList({ resources, projects }: { resources: LearningResourceRecord[]; projects?: ProjectRecord[] }) {
  const orderedResources = [...resources].sort((left, right) => kindPriority[left.kind] - kindPriority[right.kind]);

  return (
    <div className="learning-resource-grid">
      {orderedResources.map((resource) => (
        <article className="learning-resource-card" data-resource-id={resource.id} key={resource.id}>
          <div className="learning-resource-meta">
            <span><Localized text={kindLabels[resource.kind]} /></span>
            <b><Localized text={accessLabels[resource.access]} /></b>
          </div>
          <h3><a href={resource.url} target="_blank" rel="noreferrer"><Localized text={resource.title} /></a></h3>
          <p className="learning-resource-provider"><Localized text={resource.provider} /></p>
          <p><Localized text={resource.description} /></p>
          {resource.note && <p className="learning-resource-note"><Localized text={resource.note} /></p>}
          {projects && <div className="learning-resource-projects"><span><span className="lang-zh">适用项目：</span><span className="lang-en">For: </span></span>{resource.projectIds.map((id) => projects.find((project) => project.id === id)).filter((project): project is ProjectRecord => project !== undefined).map((project) => <Link href={projectHref(project)} key={project.id}>{project.shortTitle}</Link>)}</div>}
          <a className="learning-resource-link" href={resource.url} target="_blank" rel="noreferrer">
            <span className="lang-zh">打开官方资料</span><span className="lang-en">Open official resource</span>
          </a>
        </article>
      ))}
    </div>
  );
}
