import Link from "next/link";
import type { ProjectRecord } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";
import { StatusBadge } from "./status-badge";

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <article className="project-card">
      <div className="card-meta">
        <StatusBadge status={project.status} />
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
        <span className="lang-zh">查看档案</span>
        <span className="lang-en">Open record</span>
      </Link>
    </article>
  );
}

