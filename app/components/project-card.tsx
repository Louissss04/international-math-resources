import Link from "next/link";
import type { ProjectRecord } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";
import { StatusBadge } from "./status-badge";
import { canonicalGrade, canonicalRegion, trackLabel } from "../lib/display-labels";

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article
      className="project-card"
      data-project-id={project.id}
      data-track={project.track}
      data-grades={project.gradeBands.map(canonicalGrade).join("|")}
      data-regions={project.regions.map(canonicalRegion).join("|")}
      data-status={project.status}
      data-cost={project.costBand}
      data-search={[project.title.zh, project.title.en, project.shortTitle, project.organizer.zh, project.organizer.en, ...project.searchTerms].join(" ").toLowerCase()}
    >
      <div className="card-meta">
        <div className="card-tags">
          <span className={`track-badge track-${project.track}`}><Localized text={trackLabel(project.track)} /></span>
          <StatusBadge status={project.status} />
        </div>
        <span>{project.cycle}</span>
      </div>
      <h3><Localized text={project.title} /></h3>
      <p><Localized text={project.summary} /></p>
      <dl>
        {project.facts.slice(0, 3).map((fact) => (
          <div key={fact.label.en}>
            <dt><Localized text={fact.label} /></dt>
            <dd><Localized text={fact.value} /></dd>
          </div>
        ))}
      </dl>
      <Link className="card-link" href={projectHref(project)}>
        <span className="lang-zh">查看详情</span>
        <span className="lang-en">View details</span>
      </Link>
    </article>
  );
}
