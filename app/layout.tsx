import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { SiteEngagement } from "./components/site-engagement";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "面向中国中学生与升学规划师的数学资料库：竞赛、建模、科研、夏校、国际课程、数学入学考试及各留学地区要求。";

  return {
    metadataBase: new URL(origin),
    title: {
      default: "国际升学数学资料库",
      template: "%s｜国际升学数学资料库",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "国际升学数学资料库",
      title: "国际升学数学资料库",
      description,
      images: [{ url: `${origin}/og.png`, width: 1760, height: 917, alt: "国际升学数学资料库" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "国际升学数学资料库",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const engagementApiUrl = process.env.NEXT_PUBLIC_ENGAGEMENT_API_URL ?? "";

  return (
    <html lang="zh-CN" data-language="zh">
      <body>
        <a className="skip-link" href="#main-content"><span className="lang-zh">跳至正文</span><span className="lang-en">Skip to content</span></a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteEngagement apiUrl={engagementApiUrl} />
        <SiteFooter />
        <script src="/engagement.js" defer />
      </body>
    </html>
  );
}
