import type { Metadata } from "next";
import { ProjectPage, projectMetadata, projectParams } from "../../lib/project-page";
export function generateStaticParams() { return projectParams("modeling"); }
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { return projectMetadata(params, "modeling"); }
export default function Page({ params }: { params: Promise<{ slug: string }> }) { return <ProjectPage params={params} track="modeling" />; }

