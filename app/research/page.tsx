import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CatalogClient } from "../components/catalog-client";
import { Localized } from "../components/localized";
import { allJournals, allProjects } from "../data";
import { projectHref } from "../lib/paths";

export const metadata: Metadata = {
  title: "中学生数学科研",
  description: "面向中学生的数学研究项目、研究技能、论文写作、数学期刊和投稿资料。",
};

export default function Page() {
  const records = allProjects.filter((item) => item.track === "research");
  const programs = records.filter((item) => item.eligibilityTags.includes("research-program"));
  const guides = records
    .filter((item) => !item.eligibilityTags.includes("research-program"))
    .sort((left, right) => Number(right.id === "research-skills") - Number(left.id === "research-skills"));

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: { zh: "数学科研", en: "Mathematical research" } }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">中学生数学科研</span><span className="lang-en">Mathematics research for secondary students</span></h1>
            <p><span className="lang-zh">研究项目、技能工具、论文规范、期刊与投稿。</span><span className="lang-en">Research programs, technical skills, paper standards, journals, and submission.</span></p>
          </div>
          <b>{programs.length}</b>
        </div>
      </header>

      <section className="page-container research-access-table">
        <div className="table-scroll">
          <table>
            <thead><tr><th><span className="lang-zh">分类</span><span className="lang-en">Category</span></th><th><span className="lang-zh">说明</span><span className="lang-en">Definition</span></th></tr></thead>
            <tbody>
              <tr><td><span className="lang-zh">研究项目</span><span className="lang-en">Research program</span></td><td><span className="lang-zh">有明确研究问题、导师或协作机制，并形成报告、展示或论文；不等于保证发表。</span><span className="lang-en">A defined research question and mentoring or collaboration process, with a report, presentation or paper; publication is not guaranteed.</span></td></tr>
              <tr><td><span className="lang-zh">研究训练</span><span className="lang-en">Research training</span></td><td><span className="lang-zh">以高阶课程、证明训练和探索性项目为主，不标作正式原创研究。</span><span className="lang-en">Advanced coursework, proof training and guided exploration rather than a formal original-research placement.</span></td></tr>
              <tr><td><span className="lang-zh">商业导师项目</span><span className="lang-en">Commercial mentorship</span></td><td><span className="lang-zh">付费导师匹配或课程服务，与大学、非营利机构项目分开标注。</span><span className="lang-en">A paid mentoring or course service, labelled separately from university and nonprofit programs.</span></td></tr>
              <tr><td><span className="lang-zh">期刊与刊物</span><span className="lang-en">Journals and publications</span></td><td><span className="lang-zh">按数学主题、作者资格、稿件类型、评审、费用和投稿状态单独查询；不计入研究项目。</span><span className="lang-en">A separate directory by topic, author eligibility, article type, review, fees, and submission status; not counted as research programs.</span></td></tr>
              <tr><td><span className="lang-zh">中国学生路径</span><span className="lang-en">Access from China</span></td><td><span className="lang-zh">逐项注明可直接申请、需地区选拔、仅限美国居住者或须另行确认。</span><span className="lang-en">Each record states whether students in China may apply directly, require regional selection, are ineligible due to residency, or must confirm.</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">项目档案</span><span className="lang-en">Program records</span></h2></div>
        <CatalogClient projects={programs} fixedTrack="research" />
      </section>

      <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">数学论文期刊与投稿</span><span className="lang-en">Mathematics journals and submission</span></h2><Link href="/journals"><span className="lang-zh">查看全部</span><span className="lang-en">View all</span></Link></div>
        <div className="research-guide-grid research-journal-entry">
          <Link href="/journals">
            <strong><span className="lang-zh">期刊与刊物目录（{allJournals.length}）</span><span className="lang-en">Journal and publication directory ({allJournals.length})</span></strong>
            <span><span className="lang-zh">中学生研究期刊、数学说明杂志、题解栏目和专业研究期刊分开标注。</span><span className="lang-en">Student journals, expository magazines, problem columns, and professional research journals are labelled separately.</span></span>
          </Link>
        </div>
      </section>

      {guides.length > 0 && <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">方法与实践指南</span><span className="lang-en">Methods and practical guidance</span></h2></div>
        <div className="research-guide-grid">
          {guides.map((guide) => <Link href={projectHref(guide)} key={guide.id}><strong><Localized text={guide.title} /></strong><span><Localized text={guide.summary} /></span></Link>)}
        </div>
      </section>}
    </main>
  );
}
