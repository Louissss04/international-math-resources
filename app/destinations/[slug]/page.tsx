import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationDetail } from "../../components/destination-detail";
import { allProjects, allSources, destinationGuides } from "../../data";

export function generateStaticParams() {
  return destinationGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = destinationGuides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title.zh, description: guide.summary.zh };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = destinationGuides.find((item) => item.slug === slug);
  if (!guide) notFound();
  return <DestinationDetail
    guide={guide}
    sources={allSources}
    relatedProjects={guide.relatedProjectIds.map((id) => allProjects.find((project) => project.id === id)).filter((project) => project !== undefined)}
  />;
}
