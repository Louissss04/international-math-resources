import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../components/breadcrumbs";
import { JournalDirectory } from "../components/journal-directory";
import { allJournals } from "../data";
import { t } from "../lib/types";
import { AcademicIntegrityNotice } from "../components/academic-integrity-notice";

export const metadata: Metadata = {
  title: "中学生数学论文期刊与投稿",
  description: "按数学主题、作者资格、评审方式、发表形式、投稿状态和费用查询适合中学生了解的数学期刊与刊物。",
};

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[
          { label: t("数学科研", "Mathematical research"), href: "/research" },
          { label: t("期刊与投稿", "Journals and submission") },
        ]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">中学生数学论文期刊与投稿</span><span className="lang-en">Mathematics journals and submission for secondary students</span></h1>
            <p><span className="lang-zh">查询主要数学主题、作者资格、稿件类型、评审方式、投稿状态和费用。</span><span className="lang-en">Search by mathematics topic, author eligibility, article type, review model, submission status, and fees.</span></p>
          </div>
          <b>{allJournals.length}</b>
        </div>
      </header>

      <div className="page-container integrity-page-note"><AcademicIntegrityNotice context="publication" /></div>

      <section className="page-container journal-scope" aria-labelledby="journal-scope-title">
        <h2 id="journal-scope-title"><span className="lang-zh">如何理解不同刊物</span><span className="lang-en">How the publications differ</span></h2>
        <div className="table-scroll"><table>
          <thead><tr>
            <th><span className="lang-zh">类型</span><span className="lang-en">Type</span></th>
            <th><span className="lang-zh">通常发表什么</span><span className="lang-en">Typical outcome</span></th>
            <th><span className="lang-zh">核对重点</span><span className="lang-en">What to verify</span></th>
          </tr></thead>
          <tbody>
            <tr><th scope="row"><span className="lang-zh">研究期刊</span><span className="lang-en">Research journal</span></th><td><span className="lang-zh">原创研究论文、短文或研究综述</span><span className="lang-en">Original research papers, notes, or surveys</span></td><td><span className="lang-zh">作者资格、同行评审主体、费用和版权</span><span className="lang-en">Author eligibility, who performs peer review, fees, and copyright</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">编辑遴选刊物</span><span className="lang-en">Editorial publication</span></th><td><span className="lang-zh">说明文、学生作品或专题文章</span><span className="lang-en">Expository writing, student work, or feature articles</span></td><td><span className="lang-zh">不要把编辑遴选表述为同行评审</span><span className="lang-en">Do not describe editorial selection as peer review</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">问题与题解刊物</span><span className="lang-en">Problem-solving publication</span></th><td><span className="lang-zh">原创问题、题解和读者来稿</span><span className="lang-en">Original problems, solutions, and reader contributions</span></td><td><span className="lang-zh">题解署名不等同于研究论文发表</span><span className="lang-en">Credited solutions are not research-paper publications</span></td></tr>
          </tbody>
        </table></div>
      </section>

      <section className="page-container journal-scope" aria-labelledby="journal-fit-title">
        <h2 id="journal-fit-title"><span className="lang-zh">按论文内容选择</span><span className="lang-en">Choose by paper content</span></h2>
        <div className="table-scroll"><table>
          <thead><tr>
            <th><span className="lang-zh">论文内容</span><span className="lang-en">Paper content</span></th>
            <th><span className="lang-zh">优先查看</span><span className="lang-en">Start with</span></th>
            <th><span className="lang-zh">适配条件</span><span className="lang-en">Fit condition</span></th>
          </tr></thead>
          <tbody>
            <tr><th scope="row"><span className="lang-zh">纯数学、定理与证明</span><span className="lang-en">Pure mathematics, theorems and proofs</span></th><td><Link href="/journals/rose-hulman-undergraduate-mathematics-journal">R-HUMJ</Link>、<Link href="/journals/journal-of-high-school-science">JHSS</Link>、<Link href="/journals/alabama-journal-of-mathematics">AJM</Link></td><td><span className="lang-zh">明确区分已知结果与新结果；证明完整，并由数学导师核对文献。</span><span className="lang-en">Separate known and new results, provide complete proofs, and have the literature checked by a mathematician.</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">建模、统计、计算与数据</span><span className="lang-en">Modeling, statistics, computation and data</span></th><td><Link href="/journals/national-high-school-journal-of-science">NHSJS</Link>、<Link href="/journals/journal-of-high-school-science">JHSS</Link>、<Link href="/journals/columbia-junior-science-journal">CJSJ</Link>、<Link href="/journals/young-scientists-journal">YSJ</Link></td><td><span className="lang-zh">写清数据、方法、验证、不确定性与局限；CJSJ 须能归入其科学范围。</span><span className="lang-en">State data, methods, validation, uncertainty and limitations; CJSJ work must fit its science scope.</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">说明文、综述、数学史</span><span className="lang-en">Exposition, surveys and history</span></th><td><Link href="/journals/parabola">Parabola</Link>、<Link href="/journals/mathematical-reflections">Mathematical Reflections</Link>、<Link href="/journals/young-scientists-journal">YSJ</Link>、<Link href="/journals/journal-of-humanistic-mathematics">JHM</Link></td><td><span className="lang-zh">不能只是资料汇总；需要清楚的问题、可靠来源和实质数学内容。</span><span className="lang-en">A source summary alone is insufficient; include a clear question, reliable references, and substantive mathematics.</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">原创问题与题解</span><span className="lang-en">Original problems and solutions</span></th><td><Link href="/journals/crux-mathematicorum">Crux／MathemAttic</Link>、<Link href="/journals/mathematical-reflections">Mathematical Reflections</Link>、<Link href="/journals/fibonacci-quarterly">Fibonacci Quarterly</Link>、<Link href="/journals/math-horizons">Math Horizons</Link></td><td><span className="lang-zh">附完整解答和来源；题解署名不能写成同行评审研究论文。</span><span className="lang-en">Include a complete solution and provenance; credited solutions are not peer-reviewed research papers.</span></td></tr>
            <tr><th scope="row"><span className="lang-zh">专业级组合与数列研究</span><span className="lang-en">Professional-level combinatorics and sequences</span></th><td><Link href="/journals/journal-of-integer-sequences">JIS</Link>、<Link href="/journals/integers-electronic-journal-of-combinatorial-number-theory">INTEGERS</Link>、<Link href="/journals/electronic-journal-of-combinatorics">EJC</Link></td><td><span className="lang-zh">只适合真实原创、达到专业期刊标准的少数稿件；年龄不是降标理由。</span><span className="lang-en">Only genuinely original work at professional-journal standard fits; age does not lower the bar.</span></td></tr>
          </tbody>
        </table></div>
        <p className="table-note"><span className="lang-zh">常见误区：Journal of Emerging Investigators 当前官网明确不收 Mathematics、Statistics、定理及无实验支撑的纯数学建模稿。</span><span className="lang-en">Common mismatch: the current Journal of Emerging Investigators scope excludes mathematics, statistics, theorem papers, and mathematical modeling without supporting experiments.</span> <a href="https://www.emerginginvestigators.org/submissions/hypothesis-driven-research" target="_blank" rel="noreferrer"><span className="lang-zh">查看官方范围</span><span className="lang-en">Official scope</span></a></p>
      </section>

      <section className="page-container directory-section">
        <JournalDirectory journals={allJournals} />
      </section>
    </main>
  );
}
