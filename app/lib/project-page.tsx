import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "../components/project-detail";
import { allBookResources, allLearningResources, allOfficialSyllabi, allPastPaperArchives, allProjects, allSources, allThresholds, allVideoResources } from "../data";
import type { Track } from "./types";

export function projectParams(track: Track) {
  return allProjects.filter((project) => project.track === track).map((project) => ({ slug: project.slug }));
}

export async function projectMetadata(params: Promise<{ slug: string }>, track: Track): Promise<Metadata> {
  const { slug } = await params;
  const project = allProjects.find((item) => item.track === track && item.slug === slug);
  if (!project) return {};
  return { title: `${project.title.zh} / ${project.title.en}`, description: `${project.summary.zh} ${project.summary.en}` };
}

export async function ProjectPage({ params, track }: { params: Promise<{ slug: string }>; track: Track }) {
  const { slug } = await params;
  const project = allProjects.find((item) => item.track === track && item.slug === slug);
  if (!project) notFound();
  const related = (project.relatedIds ?? [])
    .map((id) => allProjects.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item !== undefined && item.track === project.track);
  const learningResources = allLearningResources.filter((resource) => resource.projectIds.includes(project.id) && resource.kind !== "official-textbook");
  const videoResources = allVideoResources.filter((resource) => resource.projectIds.includes(project.id));
  const bookResources = allBookResources.filter((resource) => resource.projectIds.includes(project.id));
  const syllabus = allOfficialSyllabi.find((record) => record.projectId === project.id);
  const pastPaperArchive = allPastPaperArchives.find((record) => record.projectId === project.id);
  return <ProjectDetail project={project} sources={allSources} thresholds={allThresholds} related={related} learningResources={learningResources} videoResources={videoResources} bookResources={bookResources} syllabus={syllabus} pastPaperArchive={pastPaperArchive} />;
}
