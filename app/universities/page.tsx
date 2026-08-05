import type { Metadata } from "next";
import { AdmissionRequirementsClient } from "../components/admission-requirements-client";
import { Breadcrumbs } from "../components/breadcrumbs";
import { admissionRequirements, allProjects, allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "学校与专业考试要求",
  description: "按学校、专业和申请年份查询官网明确列出的考试要求、录取条件、官方建议及招生参考政策。",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; project?: string; type?: string }>;
}) {
  const { q = "", country = "all", project = "all", type = "all" } = await searchParams;
  const lastUpdated = admissionRequirements.map((record) => record.lastVerified).sort().at(-1);
  const projectIds = new Set(admissionRequirements.flatMap((record) => record.projectIds));
  const sourceIds = new Set(admissionRequirements.flatMap((record) => record.sourceIds));
  const relatedProjects = allProjects.filter((record) => projectIds.has(record.id));
  const relatedSources = allSources.filter((record) => sourceIds.has(record.id));

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("学校与专业考试要求", "School and programme test requirements") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">学校与专业考试要求</span><span className="lang-en">School and programme test requirements</span></h1>
            <p><span className="lang-zh">查询院校官网明确列出的考试要求、录取条件、官方建议和招生参考政策。</span><span className="lang-en">Published test requirements, offer conditions, recommendations and admissions-use policies from university websites.</span></p>
            {lastUpdated && <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{lastUpdated}</p>}
          </div>
          <b>{admissionRequirements.length}</b>
        </div>
      </header>

      <section className="page-container directory-section">
        <div className="requirement-key" aria-label="Policy classification">
          <p><b><span className="lang-zh">必须满足：</span><span className="lang-en">Must be met: </span></b><span className="lang-zh">明确要求、必选其一、录取条件</span><span className="lang-en">Required, required alternative, offer condition</span></p>
          <p><b><span className="lang-zh">不是硬性要求：</span><span className="lang-en">Not mandatory: </span></b><span className="lang-zh">官方建议、招生参考</span><span className="lang-en">Recommended, considered</span></p>
          <p className="requirement-competition-note"><span className="lang-zh">当前核实记录未发现大学把数学竞赛成绩列为硬性申请条件；Waterloo、NTU 等按“官方建议”或“招生参考”收录。</span><span className="lang-en">No verified record currently makes a mathematics competition result a mandatory application condition; Waterloo, NTU and similar cases are listed only as recommended or considered.</span></p>
        </div>
        <AdmissionRequirementsClient
          requirements={admissionRequirements}
          projects={relatedProjects}
          sources={relatedSources}
          initialQuery={q}
          initialCountry={country}
          initialProject={project}
          initialType={type}
        />
      </section>
    </main>
  );
}
