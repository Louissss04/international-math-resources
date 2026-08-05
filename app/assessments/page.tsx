import type { Metadata } from "next";
import Link from "next/link";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { projectHref } from "../lib/paths";
import { t } from "../lib/types";
export const metadata: Metadata = {
  title: "数学入学考试与定量测评",
  description: "大学和中学入学考试的数学模块，以及学校定量测评的用途、报名、形式和评分。",
};

export default function Page() {
  const projects = allProjects.filter((item) => item.track === "assessment");
  const systems = [
    {
      id: "us-university",
      title: t("美国本科申请考试", "US undergraduate admissions tests"),
      description: t("SAT 与 ACT 的数学部分。是否要求或审阅成绩由大学和申请年份决定。", "The mathematics sections of SAT and ACT. Testing policy depends on the institution and application cycle."),
      projectIds: ["sat", "act"],
    },
    {
      id: "uk-university",
      title: t("英国本科数学入学考试", "UK university mathematics admissions tests"),
      description: t("TMUA、ESAT Mathematics 1／2 与 STEP；先按大学课程和 UCAS code 确认考试。", "TMUA, ESAT Mathematics 1/2 and STEP; confirm the required test against the university course and UCAS code."),
      projectIds: ["tmua", "esat", "step"],
    },
    {
      id: "independent-schools",
      title: t("国际与私立中学入学考试", "International and independent-school admissions tests"),
      description: t("SSAT、ISEE 与 UKiset 的数学或数量推理部分；学校自行决定要求和参考分数。", "The mathematics or quantitative sections of SSAT, ISEE and UKiset; schools set their own requirements and reference scores."),
      projectIds: ["ssat", "isee", "ukiset"],
    },
    {
      id: "school-assessments",
      title: t("学校组织的数学与数量测评", "School-administered mathematics and quantitative assessments"),
      description: t("CAT4 数量推理与 MAP Growth Mathematics 由学校采购和组织，不设个人公开报名。", "CAT4 Quantitative Reasoning and MAP Growth Mathematics are purchased and administered by schools, with no public individual registration."),
      projectIds: ["cat4", "map-growth"],
    },
    {
      id: "europe-university",
      title: t("欧洲大学考试的数学部分与补足考试", "Mathematics sections and deficiency tests in European admissions"),
      description: t("OMPT 是数学补足考试；TestAS、TOLC-I／CEnT-S 只整理数学相关部分；ETH Zurich 与 EPFL 页面只列数学卷。适用范围由大学和专业规定。", "OMPT is a mathematics-deficiency test; only mathematics-related content is listed for TestAS and TOLC-I/CEnT-S, while ETH Zurich and EPFL pages cover their mathematics papers. Applicability is set by institution and programme."),
      projectIds: ["ompt-mathematics-admissions-test", "testas-mathematics-computer-science-natural-sciences", "cisia-tolc-i-cent-s", "eth-zurich-entrance-examination", "epfl-bachelor-entrance-examination"],
    },
  ];

  return <TrackDirectory
      title={t("数学入学考试与定量测评", "Mathematics admissions tests and quantitative assessments")}
      description={t(
        "本页收录大学和私校入学考试的数学部分，以及学校组织的定量或数学测评；课程统考与数学竞赛分别另列。",
        "This directory contains mathematics components of university and independent-school admissions tests, plus school-administered quantitative or mathematics assessments. Subject qualifications and competitions are listed separately.",
      )}
      track="assessment"
      projects={projects}
    >
      <section className="page-container system-index-section" aria-labelledby="assessment-system-heading">
        <h2 id="assessment-system-heading"><span className="lang-zh">按考试体系查看</span><span className="lang-en">Browse by assessment system</span></h2>
        <div className="system-index-grid">{systems.map((system) => {
          const records = system.projectIds
            .map((id) => projects.find((project) => project.id === id))
            .filter((project): project is (typeof projects)[number] => Boolean(project));
          if (records.length === 0) return null;
          return <article id={`system-${system.id}`} key={system.id}>
            <header><h3><span className="lang-zh">{system.title.zh}</span><span className="lang-en">{system.title.en}</span></h3><b>{records.length}</b></header>
            <p><span className="lang-zh">{system.description.zh}</span><span className="lang-en">{system.description.en}</span></p>
            <ul>{records.map((project) => <li key={project.id}><Link href={projectHref(project)}>{project.shortTitle}</Link></li>)}</ul>
          </article>;
        })}</div>
      </section>
    </TrackDirectory>;
}
