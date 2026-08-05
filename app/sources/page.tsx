import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { allSources } from "../data";
import { t, type SourceKind } from "../lib/types";

export const metadata: Metadata = { title: "资料来源", description: "本站引用的官方页面、官方数据和历史档案。" };
const sourceKinds: Record<SourceKind, ReturnType<typeof t>> = {
  official: t("官方页面", "Official page"),
  "official-data": t("官方数据", "Official data"),
  "official-archive": t("官方档案", "Official archive"),
  "secondary-archive": t("历史汇编", "Secondary archive"),
};

export default function Page() {
  const sources = allSources.slice().sort((a, b) => a.id.localeCompare(b.id));
  const lastUpdated = sources.reduce((latest, source) => source.verifiedAt > latest ? source.verifiedAt : latest, "");
  return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("资料来源", "Sources") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">资料来源</span><span className="lang-en">Sources</span></h1><p><span className="lang-zh">本网站引用的官方页面、官方数据、历史档案和二手汇编。</span><span className="lang-en">Official pages, datasets, archives and secondary compilations cited on this site.</span></p><p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{lastUpdated}</p></div><b>{sources.length}</b></div></header><section className="page-container directory-section"><div className="source-directory">{sources.map((source, index) => <article key={source.id}><div><b>{index + 1}</b><p className="source-kind"><Localized text={sourceKinds[source.kind]} /></p></div><div><h2><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a></h2><p><Localized text={source.owner} /></p>{source.note && <p><Localized text={source.note} /></p>}</div></article>)}</div></section></main>;
}
