import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "面向中国中学生与升学规划师的中英双语数学项目数据库：资格、赛制、日期、费用、奖项、历年分数线和官方来源。";

  return {
    metadataBase: new URL(origin),
    title: {
      default: "MathPath｜数学竞赛、建模、科研、夏校与考试数据库",
      template: "%s｜MathPath",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "MathPath",
      title: "MathPath｜数学竞赛、建模、科研、夏校与考试数据库",
      description,
      images: [{ url: `${origin}/og.png`, width: 1760, height: 917, alt: "MathPath bilingual mathematics pathways database" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "MathPath｜数学竞赛、建模、科研、夏校与考试数据库",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-language="zh">
      <body>
        <a className="skip-link" href="#main-content"><span className="lang-zh">跳至正文</span><span className="lang-en">Skip to content</span></a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
