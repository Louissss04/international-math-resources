import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CatalogClient } from "../components/catalog-client";
import { Localized } from "../components/localized";
import { allProjects } from "../data";
import { projectHref } from "../lib/paths";

export const metadata: Metadata = {
  title: "中学生数学研究项目",
  description: "面向中学生的数学研究项目、导师研究、研究训练和成果竞赛，注明中国学生申请路径与项目性质。",
};

export default function Page() {
  const records = allProjects.filter((item) => item.track === "research");
  const programs = records.filter((item) => item.eligibilityTags.includes("research-program"));
  const guides = records.filter((item) => !item.eligibilityTags.includes("research-program"));

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: { zh: "数学科研", en: "Mathematical research" } }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">中学生数学研究项目</span><span className="lang-en">Mathematics research programs for secondary students</span></h1>
            <p><span className="lang-zh">原创研究、研究训练、成果竞赛与商业导师项目分别标注。</span><span className="lang-en">Original research, research training, research competitions and commercial mentorship are labelled separately.</span></p>
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
              <tr><td><span className="lang-zh">中国学生路径</span><span className="lang-en">Access from China</span></td><td><span className="lang-zh">逐项注明可直接申请、需地区选拔、仅限美国居住者或须另行确认。</span><span className="lang-en">Each record states whether students in China may apply directly, require regional selection, are ineligible due to residency, or must confirm.</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-container directory-section">
        <div className="section-heading"><h2><span className="lang-zh">项目档案</span><span className="lang-en">Program records</span></h2></div>
        <CatalogClient projects={programs} fixedTrack="research" />
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
