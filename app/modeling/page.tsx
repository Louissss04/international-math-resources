import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CatalogClient } from "../components/catalog-client";
import { Localized } from "../components/localized";
import { allProjects } from "../data";
import { projectHref } from "../lib/paths";

export const metadata: Metadata = {
  title: "中学生数学建模竞赛与项目",
  description: "数学建模竞赛、开放项目库和校内建模实践，注明赛制、报名资格、中国学生路径、成果与官方材料。",
};

export default function Page() {
  const records = allProjects.filter((item) => item.track === "modeling");
  const competitions = records.filter((item) => item.eligibilityTags.includes("modeling-competition"));
  const openProjects = records.filter((item) => item.eligibilityTags.includes("modeling-open-project"));

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: { zh: "数学建模", en: "Mathematical modeling" } }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">中学生数学建模竞赛与项目</span><span className="lang-en">Mathematical modeling competitions and projects for secondary students</span></h1>
            <p><span className="lang-zh">分别查询正式竞赛与开放建模项目；每项注明参赛资格、中国学生报名方式、成果要求、奖项及官方资料。</span><span className="lang-en">Formal competitions and open modeling projects are listed separately, with eligibility, access from China, required outputs, awards, and official resources.</span></p>
          </div>
          <b>{records.length}</b>
        </div>
      </header>

      <nav className="page-container track-tools track-tools-4" aria-label="Modeling resources">
        <Link href="/calendar"><strong><span className="lang-zh">报名与项目日历</span><span className="lang-en">Registration and project calendar</span></strong><span><span className="lang-zh">报名、比赛、提交与结果日期。</span><span className="lang-en">Registration, contest, submission and result dates.</span></span></Link>
        <Link href="/past-papers#modeling"><strong><span className="lang-zh">历届题目与作品</span><span className="lang-en">Problems and past work</span></strong><span><span className="lang-zh">官方题目、示例论文与结果档案。</span><span className="lang-en">Official problems, sample papers and result archives.</span></span></Link>
        <Link href="/resources#modeling"><strong><span className="lang-zh">官方学习资料</span><span className="lang-en">Official learning resources</span></strong><span><span className="lang-zh">规则、手册、题库、模板与评分材料。</span><span className="lang-en">Rules, handbooks, problem banks, templates and rubrics.</span></span></Link>
        <Link href="/research/skills"><strong><span className="lang-zh">建模与研究技能</span><span className="lang-en">Modeling and research skills</span></strong><span><span className="lang-zh">Python、MATLAB、LaTeX、数据与论文写作。</span><span className="lang-en">Python, MATLAB, LaTeX, data work and technical writing.</span></span></Link>
      </nav>

      <section className="page-container research-access-table">
        <div className="table-scroll">
          <table>
            <thead><tr><th><span className="lang-zh">分类</span><span className="lang-en">Category</span></th><th><span className="lang-zh">如何识别</span><span className="lang-en">Definition</span></th></tr></thead>
            <tbody>
              <tr><td><span className="lang-zh">正式竞赛</span><span className="lang-en">Formal competition</span></td><td><span className="lang-zh">主办方统一报名、命题、提交和评审，并公布奖项或结果。地区限制和中国学生报名路径在各详情页单列。</span><span className="lang-en">The organizer controls registration, problems, submission and judging, and publishes awards or results. Regional restrictions and access from China are stated on each detail page.</span></td></tr>
              <tr><td><span className="lang-zh">开放建模项目</span><span className="lang-en">Open modeling project</span></td><td><span className="lang-zh">使用公开题目、数据或教学框架自行完成报告、代码或展示；通常没有官方报名、排名或证书。</span><span className="lang-en">Students use public problems, data or teaching frameworks to produce a report, code or presentation; these normally have no formal entry, ranking or certificate.</span></td></tr>
              <tr><td><span className="lang-zh">地区受限项目</span><span className="lang-en">Region-restricted project</span></td><td><span className="lang-zh">只接受指定国家、地区、学校或选拔队伍。公开材料可以学习，但不能据此声称正式参赛。</span><span className="lang-en">Entry is limited to specified countries, regions, schools or selected teams. Public materials may still be used for study, but not claimed as formal participation.</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">数学建模竞赛</span><span className="lang-en">Mathematical modeling competitions</span></h2><p><span className="lang-zh">全球公开报名与地区限定项目均收录，先核对详情页的资格和报名方式。</span><span className="lang-en">Both global-entry and region-restricted contests are included; check eligibility and registration on the detail page first.</span></p></div>
        <CatalogClient projects={competitions} fixedTrack="modeling" />
      </section>

      {openProjects.length > 0 && <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">开放建模项目与训练</span><span className="lang-en">Open modeling projects and practice</span></h2><p><span className="lang-zh">适合课程作业、数学社团、EPQ 前期试作、科研入门或个人作品集。</span><span className="lang-en">Suitable for coursework, mathematics clubs, EPQ pilots, early research, or a personal portfolio.</span></p></div>
        <div className="research-guide-grid">
          {openProjects.map((project) => <Link href={projectHref(project)} key={project.id}><strong><Localized text={project.title} /></strong><span><Localized text={project.summary} /></span></Link>)}
        </div>
      </section>}
    </main>
  );
}
