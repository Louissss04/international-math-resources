import type { Metadata } from "next";
import { ProjectPage, projectMetadata, projectParams } from "../../lib/project-page";
export function generateStaticParams() { return projectParams("summer"); }
export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { return projectMetadata(params, "summer"); }
export default function Page({ params }: { params: Promise<{ slug: string }> }) { return <ProjectPage params={params} track="summer" />; }

