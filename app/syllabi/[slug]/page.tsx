import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SyllabusDetail } from "../../components/syllabus-detail";
import { allLearningResources, allOfficialSyllabi, allPastPaperArchives, allProjects } from "../../data";

export function generateStaticParams() {
  return allOfficialSyllabi.map((syllabus) => ({ slug: syllabus.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const syllabus = allOfficialSyllabi.find((record) => record.slug === slug);
  if (!syllabus) return {};
  return { title: `${syllabus.title.zh} / ${syllabus.title.en}`, description: `${syllabus.summary.zh} ${syllabus.summary.en}` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const syllabus = allOfficialSyllabi.find((record) => record.slug === slug);
  if (!syllabus) notFound();
  const project = allProjects.find((record) => record.id === syllabus.projectId);
  if (!project) notFound();
  const learningResources = allLearningResources.filter((resource) => resource.projectIds.includes(project.id));
  const pastPaperArchive = allPastPaperArchives.find((record) => record.projectId === project.id);
  return <SyllabusDetail syllabus={syllabus} project={project} learningResources={learningResources} pastPaperArchive={pastPaperArchive} />;
}
