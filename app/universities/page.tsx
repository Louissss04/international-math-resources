import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { SourceCitations } from "../components/source-citations";
import { allSources, universityPolicies } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "院校公开政策", description: "院校对数学课程、考试、竞赛和补充材料的公开政策。" };
const level = { required: ["硬性要求", "Required"], recommended: ["官方建议", "Recommended"], accepted: ["允许提交", "Accepted"], context: ["背景说明", "Context"] } as const;
export default function Page() { return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("院校公开政策", "Published university policies") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">院校公开政策</span><span className="lang-en">Published university policies</span></h1><p><span className="lang-zh">整理院校官网公布的考试要求、竞赛说明和补充材料政策，不收录未经证实的招生偏好。</span><span className="lang-en">Published requirements for tests, competitions and supplementary materials, without speculation about admissions preferences.</span></p></div><b>{universityPolicies.length}</b></div></header><section className="page-container directory-section"><div className="policy-list">{universityPolicies.map((item) => <article className="policy-card" key={item.id}><div><h2><Localized text={item.institution} /></h2><p>{item.region} · {item.applicableCycle}</p></div><div><span className="evidence-level"><span className="lang-zh">{level[item.evidenceLevel][0]}</span><span className="lang-en">{level[item.evidenceLevel][1]}</span></span><p><Localized text={item.topic} /></p></div><p><Localized text={item.policy} /></p><SourceCitations ids={item.sourceIds} sources={allSources} /></article>)}</div></section></main>; }
