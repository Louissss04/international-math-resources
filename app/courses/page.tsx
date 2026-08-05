import type { Metadata } from "next";
import Link from "next/link";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { projectHref } from "../lib/paths";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "数学课程与统考",
  description: "AP、Cambridge、Pearson Edexcel 与 IB 数学课程的考纲、考试形式、等级、日期和官方资料。",
};

export default function Page() {
  const projects = allProjects.filter((item) => item.track === "curriculum");
  const systems = [
    {
      id: "ap",
      title: t("College Board AP 数学", "College Board AP Mathematics"),
      description: t("Precalculus、Calculus AB、Calculus BC、Statistics；课程与每年一次的科目考试相连，成绩为 1—5。", "Precalculus, Calculus AB, Calculus BC and Statistics; courses lead to annual subject examinations scored 1–5."),
      test: (id: string) => id.startsWith("ap-"),
    },
    {
      id: "cambridge",
      title: t("Cambridge International 数学", "Cambridge International Mathematics"),
      description: t("IGCSE、Additional Mathematics、AS & A Level Mathematics 与 Further Mathematics；查询时必须同时看 syllabus code、option 和 component。", "IGCSE, Additional Mathematics, AS & A Level Mathematics and Further Mathematics; syllabus code, option and component must be checked together."),
      test: (id: string) => id.startsWith("cie-"),
    },
    {
      id: "edexcel",
      title: t("Pearson Edexcel International 数学", "Pearson Edexcel International Mathematics"),
      description: t("International GCSE 与模块制 International A Level；中国 6 月 IGCSE 使用 R 卷，IAL 需按模块组合和 cash-in 规则认证。", "International GCSE and modular International A Level; China uses IGCSE R papers in June, while IAL awards depend on unit combinations and cash-in rules."),
      test: (id: string) => id.startsWith("edexcel-"),
    },
    {
      id: "ib",
      title: t("IB 数学", "IB Mathematics"),
      description: t("MYP Mathematics／Extended Mathematics 与 DP AA、AI 的 SL／HL；注册由 IB World School 协调员办理。", "MYP Mathematics / Extended Mathematics and DP AA or AI at SL / HL; registration is handled by an IB World School coordinator."),
      test: (id: string) => id.startsWith("ib-"),
    },
  ];

  return <TrackDirectory
      title={t("数学课程与统考", "Mathematics curricula and subject exams")}
      description={t(
        "AP、Cambridge International、Pearson Edexcel International 与 IB 数学考纲、考试形式、成绩和官方资料。",
        "Specifications, exam formats, results and official resources for AP, Cambridge International, Pearson Edexcel International and IB mathematics.",
      )}
      track="curriculum"
      projects={projects}
    >
    <section className="page-container course-system-section" aria-labelledby="course-system-heading">
      <h2 id="course-system-heading"><span className="lang-zh">按课程体系查看</span><span className="lang-en">Browse by curriculum system</span></h2>
      <div className="course-system-grid">{systems.map((system) => {
        const records = projects.filter((project) => system.test(project.id));
        return <article id={`system-${system.id}`} key={system.id}>
          <header><h3><span className="lang-zh">{system.title.zh}</span><span className="lang-en">{system.title.en}</span></h3><b>{records.length}</b></header>
          <p><span className="lang-zh">{system.description.zh}</span><span className="lang-en">{system.description.en}</span></p>
          <ul>{records.map((project) => <li key={project.id}><Link href={projectHref(project)}>{project.shortTitle}</Link></li>)}</ul>
        </article>;
      })}</div>
    </section>
  </TrackDirectory>;
}
