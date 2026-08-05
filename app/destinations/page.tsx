import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { Localized } from "../components/localized";
import { destinationGuides } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "按留学地区查询数学要求",
  description: "美国、英国、新加坡、澳大利亚、加拿大及欧洲其他国家本科申请中的数学课程、先修要求与入学考试。",
};

export default function Page() {
  const systemRows = [
    {
      slug: "united-states-undergraduate-mathematics-requirements",
      destination: t("美国", "United States"),
      qualifications: t("美国高中课程；也常见 AP、IB、A Level 等国际课程", "US high-school curriculum; AP, IB and A Levels are also common"),
      assessments: t("SAT／ACT 是否提交由大学和申请年份决定；没有全国统一的大学数学入学考试", "Whether SAT/ACT is submitted depends on the university and cycle; there is no universal university mathematics admissions test"),
      china: t("按大学政策提交本校课程成绩、国际课程统考或中国普高材料", "Submit school results, international subject-exam results or Chinese senior-secondary records under each university's policy"),
    },
    {
      slug: "uk-undergraduate-mathematics-admissions",
      destination: t("英国", "United Kingdom"),
      qualifications: t("A Level Mathematics／Further Mathematics；IB Mathematics AA 等同类资格", "A Level Mathematics / Further Mathematics; IB Mathematics AA and equivalent qualifications"),
      assessments: t("部分数学及高数学含量专业另用 TMUA、ESAT 或 STEP", "Some mathematics and mathematics-intensive courses additionally use TMUA, ESAT or STEP"),
      china: t("通过 UCAS 申请；额外考试须按考试机构单独注册", "Apply through UCAS; register separately with the relevant admissions-test provider"),
    },
    {
      slug: "singapore-undergraduate-mathematics-admissions",
      destination: t("新加坡", "Singapore"),
      qualifications: t("Singapore-Cambridge A Level、IB、国际 A Level、NUS High School；部分学校也接受 AP 组合", "Singapore-Cambridge A Levels, IB, International A Levels and NUS High School; some institutions also accept AP combinations"),
      assessments: t("没有统一数学入学考试；部分国际学历或成绩尚未公布的申请人须按校方规则提交 SAT／ACT／AP", "No universal mathematics admissions test; some international qualifications or applicants awaiting final results must submit SAT/ACT/AP under university rules"),
      china: t("NUS、NTU 等使用各自网申；按实际高中资格选择申请类别", "NUS, NTU and other institutions use their own portals; select the route matching the actual school qualification"),
    },
    {
      slug: "australia",
      destination: t("澳大利亚", "Australia"),
      qualifications: t("州 Year 12 与 ATAR；IB、A Level、AP／SAT 组合或部分大学认可的高考", "State Year 12 and ATAR; IB, A Levels, AP/SAT combinations or Gaokao where accepted"),
      assessments: t("没有全国统一数学入学考试；重点核对 Mathematical Methods 等专业先修", "No universal mathematics admissions test; check programme prerequisites such as Mathematical Methods"),
      china: t("按资格和院校使用州招生中心或大学直申；高考路线逐校核对", "Use a state admissions centre or direct university application as applicable; check Gaokao routes institution by institution"),
    },
    {
      slug: "canada-undergraduate-mathematics-requirements",
      destination: t("加拿大", "Canada"),
      qualifications: t("各省高中课程；也接受 IB、A Level、AP 及大学列明的中国高中资格", "Provincial high-school curricula; IB, A Levels, AP and listed Chinese school qualifications are also accepted"),
      assessments: t("通常没有统一数学入学考试；部分专业另有补充申请、面试或数学能力材料", "Usually no universal mathematics admissions test; some programmes require supplementary applications, interviews or mathematics-related evidence"),
      china: t("通过省级平台或大学门户申请；数学先修按省课程等效表核对", "Apply through a provincial service or university portal; map mathematics prerequisites through the institution's equivalency table"),
    },
    {
      slug: "europe-other",
      destination: t("欧洲其他国家", "Other Europe"),
      qualifications: t("各国中学毕业资格；大学另行认定 IB、A Level 与中国高中资格的等效性", "National school-leaving qualifications; institutions separately assess IB, A Levels and Chinese credentials"),
      assessments: t("按国家和专业可能使用 OMPT、TestAS、TOLC-I、ETH 或 EPFL 入学考试", "Depending on country and programme, OMPT, TestAS, TOLC-I, or ETH/EPFL entrance examinations may apply"),
      china: t("先查国家学历认可与大学招生简章，再使用 Studielink、uni-assist、CISIA 或校方系统", "Check national credential recognition and the programme call before using Studielink, uni-assist, CISIA or an institutional portal"),
    },
  ];

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("按留学地区查询", "Study destinations") }]} />
        <div className="page-title-row"><div>
          <h1><span className="lang-zh">按留学地区查询数学要求</span><span className="lang-en">Mathematics requirements by study destination</span></h1>
          <p><span className="lang-zh">高中数学资格、专业先修要求、额外数学入学考试和中国学生报名方式。</span><span className="lang-en">School mathematics qualifications, programme prerequisites, additional mathematics admissions tests and routes for applicants in China.</span></p>
        </div><b>{destinationGuides.length}</b></div>
      </header>
      <section className="page-container destination-system-section" aria-labelledby="destination-system-heading">
        <h2 id="destination-system-heading"><span className="lang-zh">按申请体系对照</span><span className="lang-en">Application-system comparison</span></h2>
        <div className="table-scroll"><table className="destination-system-table">
          <thead><tr>
            <th><span className="lang-zh">地区</span><span className="lang-en">Destination</span></th>
            <th><span className="lang-zh">高中数学课程／统考</span><span className="lang-en">School mathematics qualification</span></th>
            <th><span className="lang-zh">额外入学考试</span><span className="lang-en">Additional admissions tests</span></th>
            <th><span className="lang-zh">中国学生申请入口</span><span className="lang-en">Route for applicants in China</span></th>
          </tr></thead>
          <tbody>{systemRows.map((row) => <tr key={row.slug}>
            <th scope="row"><Link href={`/destinations/${row.slug}`}><Localized text={row.destination} /></Link></th>
            <td><Localized text={row.qualifications} /></td>
            <td><Localized text={row.assessments} /></td>
            <td><Localized text={row.china} /></td>
          </tr>)}</tbody>
        </table></div>
      </section>
      <section className="page-container directory-section">
        <div className="destination-grid">
          {destinationGuides.map((guide) => (
            <Link className="destination-card" href={`/destinations/${guide.slug}`} key={guide.id}>
              <h2><Localized text={guide.shortTitle} /></h2>
              <p><Localized text={guide.summary} /></p>
              <dl>{guide.facts.slice(0, 3).map((fact) => <div key={fact.label.en}><dt><Localized text={fact.label} /></dt><dd><Localized text={fact.value} /></dd></div>)}</dl>
              <span className="card-link"><span className="lang-zh">查看数学要求</span><span className="lang-en">View mathematics requirements</span> →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
