import type { Metadata } from "next";
import { AcademicIntegrityNotice } from "../components/academic-integrity-notice";
import { Breadcrumbs } from "../components/breadcrumbs";
import { UniversityCompetitionDirectory } from "../components/university-competition-directory";
import { universityCompetitions } from "../data/university-competitions";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "大学主办与学生组织数学竞赛",
  description: "查询由大学正式单位、大学生组织或多校合作组织的中学生数学竞赛及中国学生参与路径。",
};

const LAST_UPDATED = "2026-08-11";

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[
          { label: t("数学竞赛", "Mathematics competitions"), href: "/competitions" },
          { label: t("大学主办与学生组织竞赛", "University-organized competitions") },
        ]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">大学主办与学生组织数学竞赛</span><span className="lang-en">University-organized mathematics competitions</span></h1>
            <p><span className="lang-zh">收录面向中学生、由大学正式单位、大学生组织或大学合作网络持续运营的数学竞赛。</span><span className="lang-en">Mathematics competitions for secondary students run by university units, student organizations or university partnerships.</span></p>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{LAST_UPDATED}</p>
          </div>
          <b>{universityCompetitions.length}</b>
        </div>
      </header>

      <section className="page-container journal-scope" aria-labelledby="scope-heading">
        <h2 id="scope-heading"><span className="lang-zh">收录口径</span><span className="lang-en">Scope and classification</span></h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th><span className="lang-zh">类别</span><span className="lang-en">Category</span></th><th><span className="lang-zh">判定口径</span><span className="lang-en">Definition</span></th><th><span className="lang-zh">页面标注</span><span className="lang-en">How it is labelled</span></th></tr></thead>
            <tbody>
              <tr><td><strong><span className="lang-zh">大学正式单位</span><span className="lang-en">University unit</span></strong></td><td><span className="lang-zh">大学院系、研究中心或校级机构直接发布规则、报名或成绩。</span><span className="lang-en">A department, centre or university office publishes the rules, registration or results.</span></td><td><span className="lang-zh">列明负责单位及大学。</span><span className="lang-en">The responsible unit and university are named.</span></td></tr>
              <tr><td><strong><span className="lang-zh">大学生组织</span><span className="lang-en">Student organization</span></strong></td><td><span className="lang-zh">由在校生组织运营；可能使用学校场地或名称，但不代表招生办公室。</span><span className="lang-en">Run by university students; use of a campus or university name does not make it an admissions-office programme.</span></td><td><span className="lang-zh">明确标注学生组织或独立学生组织。</span><span className="lang-en">Labelled as a student or independent student organization.</span></td></tr>
              <tr><td><strong><span className="lang-zh">多校或大学合作</span><span className="lang-en">Multi-university or partnership</span></strong></td><td><span className="lang-zh">多个大学组织共同运营，或大学与外部机构共同承担项目。</span><span className="lang-en">Operated jointly by several university groups or through a documented university partnership.</span></td><td><span className="lang-zh">分别列出大学与实际运营方。</span><span className="lang-en">Universities and the operating organization are stated separately.</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-container directory-section" aria-labelledby="directory-heading">
        <div className="section-title-row">
          <h2 id="directory-heading"><span className="lang-zh">竞赛目录</span><span className="lang-en">Competition directory</span></h2>
          <b>{universityCompetitions.length}</b>
        </div>
        <UniversityCompetitionDirectory />
      </section>

      <section className="page-container record-section" aria-labelledby="classification-cautions">
        <h2 id="classification-cautions"><span className="lang-zh">未按“大学主办竞赛”收录的项目</span><span className="lang-en">Items not classified as university-organized competitions</span></h2>
        <div className="table-scroll">
          <table>
            <thead><tr><th><span className="lang-zh">名称</span><span className="lang-en">Name</span></th><th><span className="lang-zh">当前处理</span><span className="lang-en">Current treatment</span></th></tr></thead>
            <tbody>
              <tr data-search="mpfg mathematics prize for girls mit advantage testing foundation" data-region="north-america" data-organizer-type="university-partnership" data-status="upcoming" data-china-access="global-travel"><td>Mathematics Prize for Girls (MPFG)</td><td><span className="lang-zh">活动在 MIT 举行，但主办方是 Advantage Testing Foundation；场地不等于主办关系。</span><span className="lang-en">Held at MIT, but organized by the Advantage Testing Foundation; venue is not treated as organizer status.</span> <a href="https://mathprize.atfoundation.org/" target="_blank" rel="noreferrer"><span className="lang-zh">官网</span><span className="lang-en">Official site</span></a></td></tr>
              <tr><td>University of Toronto host listings</td><td><span className="lang-zh">仅证明大学提供场地或活动页面的项目，按实际主办方归类。</span><span className="lang-en">A university venue or event listing alone is classified under the actual organizer.</span> <a href="https://www.mathematics.utoronto.ca/outreach/current-programs/math-contests" target="_blank" rel="noreferrer"><span className="lang-zh">官方活动页</span><span className="lang-en">Official listing</span></a></td></tr>
              <tr><td>SFU / AKCSE activities</td><td><span className="lang-zh">AKCSE 主办、SFU 提供场地或合作支持的活动，不写作 SFU 主办竞赛。</span><span className="lang-en">AKCSE-operated activities with SFU venue or partnership support are not described as SFU-organized competitions.</span> <a href="https://www.sfu.ca/physics/akcse/2026/" target="_blank" rel="noreferrer"><span className="lang-zh">官方说明</span><span className="lang-en">Official page</span></a></td></tr>
              <tr><td>Imperial cZeus</td><td><span className="lang-zh">2026 总决赛由 Imperial 承办，但官方说明竞赛平台由 TMGCL 提供；目前按外部项目在大学举办处理。</span><span className="lang-en">Imperial hosted the 2026 final, while the official page identifies TMGCL as the platform provider; it is treated as an external event hosted by the university.</span> <a href="https://www.imperial.ac.uk/events/207262/year7-school-challenge/" target="_blank" rel="noreferrer"><span className="lang-zh">官方活动页</span><span className="lang-en">Official event page</span></a></td></tr>
              <tr><td>UBC Calculus Challenge</td><td><span className="lang-zh">这是可取得部分大学微积分学分的考试，不是竞赛；应归入考试或课程学分资料。</span><span className="lang-en">This is a credit examination that may award university calculus credit, not a competition; it belongs with assessment or course-credit records.</span> <a href="https://outreach.math.ubc.ca/calc_challenge.html" target="_blank" rel="noreferrer"><span className="lang-zh">官方考试页</span><span className="lang-en">Official exam page</span></a></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="page-container record-section" aria-labelledby="admissions-note">
        <h2 id="admissions-note"><span className="lang-zh">招生使用说明</span><span className="lang-en">Admissions context</span></h2>
        <p><span className="lang-zh">竞赛经历可以作为数学学习与活动经历的材料，但不能据主办学校名称推定录取优惠。除非招生官网明确说明，参赛、获奖或进入校园比赛均不构成该校的录取通道或招生承诺。</span><span className="lang-en">Participation may document mathematical study and activity, but the university named by an organizer does not imply an admissions benefit. Unless an admissions website states otherwise, participation, awards or an on-campus final do not create an admissions route or promise.</span></p>
        <AcademicIntegrityNotice context="competition" />
      </section>
    </main>
  );
}
