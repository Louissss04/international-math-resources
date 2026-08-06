import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JournalDetail } from "../../components/journal-detail";
import { allJournals, allProjects, allSources } from "../../data";

export function generateStaticParams() {
  return allJournals.map((journal) => ({ slug: journal.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const journal = allJournals.find((record) => record.slug === slug);
  if (!journal) return {};
  return { title: `${journal.title.zh} / ${journal.title.en}`, description: `${journal.summary.zh} ${journal.summary.en}` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const journal = allJournals.find((record) => record.slug === slug);
  if (!journal) notFound();
  const relatedProjects = (journal.relatedProjectIds ?? [])
    .map((id) => allProjects.find((project) => project.id === id))
    .filter((project) => project !== undefined);
  return <JournalDetail journal={journal} sources={allSources} relatedProjects={relatedProjects} />;
}
