import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "来源台账", description: "MathPath 使用的官方页面、官方数据和历史档案。" };
export default function Page() { const sources = allSources.slice().sort((a, b) => a.id.localeCompare(b.id)); return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("来源台账", "Source register") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">来源台账</span><span className="lang-en">Source register</span></h1><p><span className="lang-zh">官方页面、官方数据、官方档案和二手历史汇编分级显示。</span><span className="lang-en">Official pages, official data, official archives and secondary historical archives are separated.</span></p></div><b>{sources.length}</b></div></header><section className="page-container directory-section"><div className="source-directory">{sources.map((source) => <article key={source.id}><div><b>{source.id}</b><p className="source-kind">{source.kind}</p></div><div><h2><a href={source.url} target="_blank" rel="noreferrer"><Localized text={source.label} /></a></h2><p>{source.owner.zh} / {source.owner.en}</p>{source.note && <p><Localized text={source.note} /></p>}</div><time dateTime={source.verifiedAt}><span className="lang-zh">核验</span><span className="lang-en">Verified</span> {source.verifiedAt}</time></article>)}</div></section></main>; }

