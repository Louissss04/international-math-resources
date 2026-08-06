import type { JournalRecord, ProjectRecord, Track } from "./types";

export const trackPath: Record<Track, string> = {
  competition: "competitions",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  curriculum: "courses",
  assessment: "assessments",
};

export function projectHref(project: Pick<ProjectRecord, "track" | "slug">) {
  return `/${trackPath[project.track]}/${project.slug}`;
}

export function journalHref(journal: Pick<JournalRecord, "slug">) {
  return `/journals/${journal.slug}`;
}

export function syllabusHref(slug: string) {
  return `/syllabi/${slug}`;
}
