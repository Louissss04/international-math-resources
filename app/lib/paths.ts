import type { ProjectRecord, Track } from "./types";

export const trackPath: Record<Track, string> = {
  competition: "competitions",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  assessment: "assessments",
};

export function projectHref(project: Pick<ProjectRecord, "track" | "slug">) {
  return `/${trackPath[project.track]}/${project.slug}`;
}

