import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "信息更新清单",
  description: "检查国际升学数学资料库各项目日期、报名、规则、分数线、考纲、教材、参考书、公开视频与申请信息的维护流程和官网清单。",
};

const LAST_UPDATED = "2026-08-06";

type WatchlistItem = {
  familyZh: string;
  familyEn: string;
  owner: string;
  url: string;
  china?: { owner: string; url: string };
  checkZh: string;
  checkEn: string;
};

const watchlist: WatchlistItem[] = [
  { familyZh: "AMC / AIME", familyEn: "AMC / AIME", owner: "Mathematical Association of America", url: "https://maa.org/student-programs/amc/", checkZh: "年度日程、考点注册、资格、考试规则、AIME 晋级线和荣誉分数线", checkEn: "annual dates, host registration, eligibility, rules, AIME qualification and honour thresholds" },
  { familyZh: "Waterloo 竞赛", familyEn: "Waterloo contests", owner: "University of Waterloo CEMC", url: "https://cemc.uwaterloo.ca/contests", checkZh: "学校订购、国际参赛、各组别日期与形式、费用、证书线、荣誉榜和结果册", checkEn: "school ordering, international participation, each level's dates and format, fees, certificate cut-offs, honour rolls and result booklets" },
  { familyZh: "COMC", familyEn: "COMC", owner: "Canadian Mathematical Society", url: "https://cms.math.ca/competitions/comc/", checkZh: "当届日期、学校／个人报名、国际时区、监考、费用、分区奖项、四分位线和后续轮次资格", checkEn: "current dates, school/individual entry, international timing, proctoring, fees, regional awards, quartile thresholds and advancement" },
  { familyZh: "UKMT 挑战赛 / BMO", familyEn: "UKMT challenges / BMO", owner: "UK Mathematics Trust", url: "https://ukmt.org.uk/competitions", china: { owner: "ASEEDER", url: "https://www.seedasdan.asia/ukmt/" }, checkZh: "海外参赛、学校报名、日期、计分、证书线、后续轮次资格和官方试题", checkEn: "overseas entry, school registration, dates, scoring, certificate thresholds, follow-on qualification and papers" },
  { familyZh: "澳大利亚数学竞赛", familyEn: "Australian Mathematics Competition", owner: "Australian Maths Trust", url: "https://amt.edu.au/amc", china: { owner: "ASEEDER", url: "https://www.seedasdan.asia/en/amc-en/" }, checkZh: "全球规则与中国赛区的日期、年级分组、报名截止、题型、计分和奖项分别核对", checkEn: "check global and China-cycle dates, divisions, deadlines, format, scoring and awards separately" },
  { familyZh: "袋鼠数学", familyEn: "Math Kangaroo", owner: "Association Kangourou Sans Frontières", url: "https://www.aksf.org/", china: { owner: "Math Kangaroo China / ASEEDER", url: "https://www.seedasdan.asia/en/mkchina-en/" }, checkZh: "中国赛区当届日期、报名截止、分级、语言、计分、奖项和成绩查询", checkEn: "current China dates, deadline, levels, languages, scoring, awards and result access" },
  { familyZh: "全国高中数学联赛 / CMO", familyEn: "China League / CMO", owner: "中国数学会", url: "https://www.cms.org.cn/Home/comp/comp.html", checkZh: "全国通知、各赛区名单、获奖名单、冬令营和国家队信息", checkEn: "national notices, regional lists, awards, winter camp and national-team information" },
  { familyZh: "HiMCM", familyEn: "HiMCM", owner: "COMAP", url: "https://www.comap.com/contests/himcm-midmcm", checkZh: "注册期、比赛窗口、费用、队伍规则、提交规范、奖项比例和结果", checkEn: "registration window, contest window, fee, team rules, submission rules, award distribution and results" },
  { familyZh: "IMMC / IM²C", familyEn: "IMMC / IM²C", owner: "International Mathematical Modeling Challenge", url: "https://www.immchallenge.org/", checkZh: "国际规则、中华赛区通知、地区代表、提交期、晋级和国际结果", checkEn: "international rules, Greater China notices, regional representative, submission window, selection and results" },
  { familyZh: "SAT 数学", familyEn: "SAT Math", owner: "College Board SAT", url: "https://satsuite.collegeboard.org/sat", checkZh: "国际考点、账户与报名、考试日期、费用、设备要求、数学结构、分数发布和送分", checkEn: "international centres, account and registration, dates, fees, device rules, Math structure, score release and reporting" },
  { familyZh: "ACT", familyEn: "ACT", owner: "ACT International", url: "https://global.act.org/content/global/en/products-and-services/the-act-non-us/registration.html", checkZh: "国际日期与截止、MyACT 实时考位、费用、证件、可选科目和成绩发布", checkEn: "international dates and deadlines, live MyACT seats, fees, ID, optional sections and score release" },
  { familyZh: "SSAT", familyEn: "SSAT", owner: "E3n / Admission.org", url: "https://www.admission.org/assessments/ssat/about-the-ssat", china: { owner: "SSAT China / BTS Education", url: "https://test.ssatchina.cn/ssat/" }, checkZh: "考生所在地可用形式、中国纸笔日期与截止、费用、考点、重考限制和送分", checkEn: "location-based formats, China paper dates and deadlines, fees, centres, retest limits and score reporting" },
  { familyZh: "ISEE", familyEn: "ISEE", owner: "ERB", url: "https://www.erblearn.org/families/isee-registration/", checkZh: "级别、考试形式、实时日期与地点、费用、取消政策和送分", checkEn: "levels, formats, live dates and locations, fees, cancellation policy and score reporting" },
  { familyZh: "UKiset", familyEn: "UKiset", owner: "UKiset", url: "https://ukiset.com/the-process/", checkZh: "直接注册流程、线上监考可用性、证件、三部分形式、报告发送和目标学校要求", checkEn: "direct registration, online-invigilation availability, ID, three-part format, report delivery and target-school rules" },
  { familyZh: "CAT4", familyEn: "CAT4", owner: "GL Assessment", url: "https://www.gl-assessment.co.uk/products/cat4/", checkZh: "学校采购与组织方式、年龄和级别、测试形式、四类推理分项、SAS 报告及版本变化", checkEn: "school purchase and administration, age and level, format, four reasoning batteries, SAS reports and version changes" },
  { familyZh: "MAP Growth", familyEn: "MAP Growth", owner: "NWEA", url: "https://www.nwea.org/map-growth/", checkZh: "学校测试窗口、科目与版本、机考环境、RIT 量尺、常模、成长报告及学校自定用途", checkEn: "school testing windows, subjects and versions, device setup, RIT scale, norms, growth reports and school-defined uses" },
  { familyZh: "TMUA / ESAT", familyEn: "TMUA / ESAT", owner: "UAT-UK", url: "https://esat-tmua.ac.uk/", checkZh: "适用院校、考试窗口、Pearson VUE 预约、海外费用、证件和成绩发送", checkEn: "participating universities, test windows, Pearson VUE booking, overseas fees, ID and score delivery" },
  { familyZh: "STEP", familyEn: "STEP", owner: "OCR / University of Cambridge", url: "https://www.ocr.org.uk/students/step-mathematics/", checkZh: "年度日期、授权考点报名、费用、科目要求、成绩和往年试题", checkEn: "annual dates, authorised-centre entry, fees, paper requirements, results and past papers" },
  { familyZh: "PROMYS", familyEn: "PROMYS", owner: "PROMYS", url: "https://promys.org/programs/promys/for-students/", checkZh: "申请期、国际生资格、学费、资助、推荐信、签证和录取通知", checkEn: "application window, international eligibility, tuition, aid, recommendations, visas and decisions" },
  { familyZh: "SUMaC", familyEn: "SUMaC", owner: "Stanford Pre-Collegiate Studies", url: "https://sumac.spcs.stanford.edu/", checkZh: "申请期、年级资格、课程模式、学费、资助、国际生与签证要求", checkEn: "application window, grade eligibility, format, tuition, aid, international eligibility and visas" },
  { familyZh: "Mathcamp", familyEn: "Mathcamp", owner: "Canada/USA Mathcamp", url: "https://www.mathcamp.org/", checkZh: "申请期、资格、Qualifying Quiz、学费、资助、国际生和签证", checkEn: "application window, eligibility, Qualifying Quiz, tuition, aid, international applicants and visas" },
  { familyZh: "Ross", familyEn: "Ross", owner: "Ross Mathematics Program", url: "https://rossprogram.org/", checkZh: "申请期、年龄资格、申请题、校区、学费、资助和国际生要求", checkEn: "application window, age eligibility, application problems, site, tuition, aid and international requirements" },
  { familyZh: "MathILy", familyEn: "MathILy", owner: "MathILy", url: "https://mathily.org/", checkZh: "申请期、资格、申请题、学费、资助、国际生和签证", checkEn: "application window, eligibility, application problems, tuition, aid, international applicants and visas" },
  { familyZh: "SSP", familyEn: "SSP", owner: "Summer Science Program", url: "https://summerscience.org/", checkZh: "项目方向、申请期、年级资格、国际生名额、费用、资助和签证", checkEn: "program tracks, application window, grade eligibility, international places, cost, aid and visas" },
];

const curriculumWatchlist: WatchlistItem[] = [
  { familyZh: "AP 数学", familyEn: "AP Mathematics", owner: "College Board AP Students", url: "https://apstudents.collegeboard.org/courses", checkZh: "现行 CED、考试形式与日期、数字化方式、FRQ、成绩分布、中国考点与官方送分", checkEn: "current CED, format and dates, digital delivery, FRQs, score distributions, China testing and official score reporting" },
  { familyZh: "Cambridge International 数学", familyEn: "Cambridge International Mathematics", owner: "Cambridge International", url: "https://www.cambridgeinternational.org/programmes-and-qualifications/", checkZh: "0580、0607、0606、9709、9231 的现行 syllabus、option/component、Zone 5 日程、threshold、past papers 与 private candidate 路径", checkEn: "current syllabuses, options/components, Zone 5 timetable, thresholds, past papers and private-candidate route for 0580, 0607, 0606, 9709 and 9231" },
  { familyZh: "Pearson Edexcel International 数学", familyEn: "Pearson Edexcel International Mathematics", owner: "Pearson Qualifications", url: "https://qualifications.pearson.com/en/qualifications.html", china: { owner: "British Council China Pearson", url: "https://www.britishcouncil.cn/exams/school/pearson" }, checkZh: "IGCSE 规范与 SAM、IAL 模块组合和 cash-in、R 卷、考期、raw/UMS 分线、真题公开状态与教材", checkEn: "IGCSE specifications and SAMs, IAL unit combinations and cash-in, R papers, series, raw/UMS boundaries, paper access and textbooks" },
  { familyZh: "IB MYP / DP 数学", familyEn: "IB MYP / DP Mathematics", owner: "International Baccalaureate", url: "https://www.ibo.org/programmes/diploma-programme/curriculum/mathematics/", checkZh: "AA/AI SL/HL 与 MYP 数学的现行 guide、2029 过渡、考试结构、specimen、PRC/Store 权限和学校协调员报名", checkEn: "current AA/AI SL/HL and MYP guides, 2029 transition, assessment structure, specimens, PRC/Store access and school-coordinator registration" },
];

const destinationWatchlist: WatchlistItem[] = [
  { familyZh: "美国", familyEn: "United States", owner: "College Board SAT", url: "https://satsuite.collegeboard.org/sat", checkZh: "SAT/ACT 当届政策、大学数学课程先修、AP/IB/A Level 认可和中国学生官方送分；逐校查招生官网", checkEn: "current SAT/ACT policy, university mathematics preparation, AP/IB/A Level treatment and official reporting from China; verify each admissions site" },
  { familyZh: "加拿大", familyEn: "Canada", owner: "OUInfo", url: "https://www.ouinfo.ca/", checkZh: "省级课程与国际资格数学对应、专业先修、补充申请和大学是否参考 Euclid/CSMC；逐校查当届要求", checkEn: "provincial and international mathematics equivalencies, programme prerequisites, supplements and whether Euclid/CSMC is considered; verify current university requirements" },
  { familyZh: "英国", familyEn: "United Kingdom", owner: "UCAS", url: "https://www.ucas.com/undergraduate/applying-university", china: { owner: "UAT-UK (TMUA / ESAT)", url: "https://esat-tmua.ac.uk/" }, checkZh: "课程 A Level/IB 数学与 Further Mathematics 要求、TMUA/ESAT/STEP 适用专业、考试窗口和海外报名", checkEn: "A Level/IB Mathematics and Further Mathematics requirements, TMUA/ESAT/STEP programmes, windows and overseas registration" },
  { familyZh: "新加坡", familyEn: "Singapore", owner: "NUS International Qualifications", url: "https://nus.edu.sg/oam/admissions/international-qualifications", checkZh: "NUS/NTU/SMU/SUTD 各资格数学要求、标准化考试组合和官方成绩提交；逐校逐专业复核", checkEn: "NUS/NTU/SMU/SUTD mathematics requirements by qualification, testing combinations and official score submission; verify by university and programme" },
  { familyZh: "澳大利亚", familyEn: "Australia", owner: "Australian Government Study Australia", url: "https://www.studyaustralia.gov.au/en/plan-your-studies/how-to-apply-to-study", checkZh: "ATAR/IB/国际资格换算、课程数学 prerequisite/assumed knowledge、高考路线、招生中心或直申方式", checkEn: "ATAR/IB/international qualification conversion, programme mathematics prerequisites or assumed knowledge, Gaokao route and admissions-centre versus direct application" },
  { familyZh: "欧洲其他国家", familyEn: "Other Europe", owner: "Study in NL", url: "https://www.studyinnl.org/plan-your-stay/admission-requirements", checkZh: "分别查荷兰 OMPT、德国 APS/TestAS、意大利 TOLC、瑞士 ETH/EPFL、法国 Études en France、爱尔兰 CAO；不得写成统一欧洲规则", checkEn: "separately verify Netherlands OMPT, Germany APS/TestAS, Italy TOLC, Swiss ETH/EPFL, France Études en France and Ireland CAO; never present these as one European rule" },
];

const watchlistGroups = [
  { id: "competition", titleZh: "数学竞赛", titleEn: "Mathematics competitions", items: watchlist.slice(0, 7) },
  { id: "modeling", titleZh: "数学建模竞赛", titleEn: "Mathematical modeling competitions", items: watchlist.slice(7, 9) },
  { id: "assessment", titleZh: "数学考试与定量测评", titleEn: "Mathematics tests and quantitative assessments", items: watchlist.slice(9, 18) },
  { id: "curriculum", titleZh: "数学课程与统考", titleEn: "Mathematics curricula and subject exams", items: curriculumWatchlist },
  { id: "destination", titleZh: "留学地区数学要求", titleEn: "Mathematics requirements by destination", items: destinationWatchlist },
  { id: "summer", titleZh: "数学夏校与夏令营", titleEn: "Mathematics summer programs", items: watchlist.slice(18) },
];

const fieldRows = [
  ["本年度状态", "Current-cycle status", "已公布／未公布；旧年份内容标为历史信息。", "Published or pending; mark prior-cycle information as historical."],
  ["日期", "Dates", "报名开放、报名截止、比赛／考试、提交、放榜；记录时区。", "Opening, deadline, test/contest, submission and result dates, including time zone."],
  ["报名", "Registration", "学生能否个人报名、是否必须由学校／考点／地区代表办理；单列中国学生路径。", "Whether students register directly or through a school, centre or regional representative; state the China route separately."],
  ["资格与形式", "Eligibility and format", "年级／年龄、地区限制、语言、时长、题型、计算器和团队人数。", "Grade or age, region, language, duration, question types, calculator and team size."],
  ["费用与资助", "Fees and aid", "币种、国际费用、迟报名费、退款、奖学金或减免。", "Currency, international and late fees, refunds, scholarships or waivers."],
  ["分数线与奖项", "Thresholds and awards", "按年份保存晋级线、荣誉分数线、证书线、奖项比例和官方结果。", "Store qualification, honour and certificate thresholds, award shares and official results by year."],
  ["数学考纲、真题与样卷", "Mathematics syllabi and papers", "只整理数学模块。先查官方考纲、真题页、样卷、答案和评分方案；无官方真题时，可记录来源清楚的第三方公开索引，并明确标注非官方。", "Cover mathematics modules only. Check official syllabi, past-paper pages, samples, answers and marking schemes first. If no official papers exist, a clearly sourced public third-party index may be recorded and must be labelled unofficial."],
  ["公开视频课程", "Public video resources", "优先查主办方或考试机构的完整课程、系列讲座与题目讲解；第三方资源须标明提供者、平台、语言、访问条件和非官方性质。", "Check organiser or awarding-body courses, lecture series and problem walkthroughs first. Label third-party resources with provider, platform, language, access conditions and unofficial status."],
  ["教材与参考书", "Books and references", "区分官方出版、官方认可／推荐和第三方常用书；核对作者、出版社、版本、ISBN、语言、获取方式和现行考纲适配性，不链接盗版文件。", "Separate official, endorsed or recommended, and common third-party books. Check author, publisher, edition, ISBN, language, access and alignment with the current syllabus; never link unauthorised copies."],
];

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("信息更新清单", "Update checklist") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">信息更新清单</span><span className="lang-en">Update checklist</span></h1>
            <p><span className="lang-zh">用于逐页检查数学项目的日期、报名、规则、分数线、考纲、真题、教材、参考书与公开视频。</span><span className="lang-en">A page-by-page check of dates, registration, rules, thresholds, syllabi, past papers, books, references and public videos for mathematics projects.</span></p>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{LAST_UPDATED}</p>
          </div>
          <a className="secondary-button" href="/mathpath-update-maintenance-prompt.md" download>
            <span className="lang-zh">下载维护 Prompt</span><span className="lang-en">Download maintenance prompt</span>
          </a>
        </div>
      </header>

      <div className="page-container maintenance-layout">
        <section className="maintenance-section">
          <h2><span className="lang-zh">检查频率</span><span className="lang-en">Review schedule</span></h2>
          <div className="update-schedule">
            <article><b><span className="lang-zh">每月</span><span className="lang-en">Monthly</span></b><p><span className="lang-zh">检查全部官网链接、当前周期、日期和报名状态。</span><span className="lang-en">Check all official links, current cycle, dates and registration status.</span></p></article>
            <article><b><span className="lang-zh">旺季每周</span><span className="lang-en">Weekly in season</span></b><p><span className="lang-zh">8—11 月重点检查竞赛与英国入学考试；1—3 月重点检查夏校；3—6 月重点检查考试与放榜。</span><span className="lang-en">Focus on contests and UK admissions tests in Aug–Nov, summer programs in Jan–Mar, and exams/results in Mar–Jun.</span></p></article>
            <article><b><span className="lang-zh">事件触发</span><span className="lang-en">Event-triggered</span></b><p><span className="lang-zh">新年度页面、规则文件、成绩或获奖名单发布后立即检查对应项目页。</span><span className="lang-en">Review the relevant page when a new-cycle page, rulebook, score release or award list appears.</span></p></article>
          </div>
        </section>

        <section className="maintenance-section">
          <h2><span className="lang-zh">单页更新流程</span><span className="lang-en">Page update workflow</span></h2>
          <ol className="workflow-list">
            <li><b>1</b><div><strong><span className="lang-zh">打开主办方官网</span><span className="lang-en">Open the organiser’s site</span></strong><p><span className="lang-zh">先看当年主页、规则文件、报名页和结果页；代理机构信息只用于补充中国报名路径。</span><span className="lang-en">Start with the current-cycle home, rules, registration and result pages. Use agency information only to supplement the China registration route.</span></p></div></li>
            <li><b>2</b><div><strong><span className="lang-zh">逐字段比对</span><span className="lang-en">Compare each field</span></strong><p><span className="lang-zh">对照下表检查日期、资格、形式、费用、报名、分数线、数学考纲、真题、样卷、教材、参考书和公开视频；不能从官网确认的内容不写成确定事实，也不能根据历年题自行推断考纲。</span><span className="lang-en">Check dates, eligibility, format, fees, registration, thresholds, mathematics syllabi, past papers, official specimens, textbooks, references and public videos. Do not present unconfirmed details as current facts or infer a syllabus from past papers.</span></p></div></li>
            <li><b>3</b><div><strong><span className="lang-zh">保留历史记录</span><span className="lang-en">Preserve history</span></strong><p><span className="lang-zh">旧分数线和旧日程不覆盖，按年份归档；规则变化在新年度记录中反映。</span><span className="lang-en">Do not overwrite old thresholds or calendars. Archive by year and record rule changes in the new cycle.</span></p></div></li>
            <li><b>4</b><div><strong><span className="lang-zh">更新来源和页面日期</span><span className="lang-en">Update sources and page date</span></strong><p><span className="lang-zh">替换失效链接、补充新官方页面，并只修改该页面的“最后更新”。</span><span className="lang-en">Replace broken links, add new official pages and change only that page’s “Last updated” date.</span></p></div></li>
            <li><b>5</b><div><strong><span className="lang-zh">重新导出并检查</span><span className="lang-en">Export and check</span></strong><p><span className="lang-zh">确认中英文、内部链接、外部链接、表格年份、移动端横向滚动和搜索数据一致。</span><span className="lang-en">Check both languages, internal and external links, table years, mobile table scrolling and search data.</span></p></div></li>
          </ol>
        </section>

        <section className="maintenance-section">
          <h2><span className="lang-zh">每页必查字段</span><span className="lang-en">Fields required on every page</span></h2>
          <div className="table-scroll"><table><thead><tr><th><span className="lang-zh">字段</span><span className="lang-en">Field</span></th><th><span className="lang-zh">检查内容</span><span className="lang-en">What to check</span></th></tr></thead><tbody>{fieldRows.map(([zh, en, detailZh, detailEn]) => <tr key={en}><td><strong><span className="lang-zh">{zh}</span><span className="lang-en">{en}</span></strong></td><td><span className="lang-zh">{detailZh}</span><span className="lang-en">{detailEn}</span></td></tr>)}</tbody></table></div>
        </section>

        <section className="maintenance-section">
          <h2><span className="lang-zh">官网检查清单</span><span className="lang-en">Official-site watchlist</span></h2>
          <div className="watchlist-groups">{watchlistGroups.map((group) => <section className="watchlist-group" id={`watchlist-${group.id}`} key={group.id}><h3><span className="lang-zh">{group.titleZh}</span><span className="lang-en">{group.titleEn}</span></h3><div className="watchlist-table table-scroll"><table><thead><tr><th><span className="lang-zh">项目</span><span className="lang-en">Family</span></th><th><span className="lang-zh">官网／中国入口</span><span className="lang-en">Official / China entry</span></th><th><span className="lang-zh">重点检查</span><span className="lang-en">Review</span></th></tr></thead><tbody>{group.items.map((item) => <tr key={item.familyEn}><td><strong><span className="lang-zh">{item.familyZh}</span><span className="lang-en">{item.familyEn}</span></strong></td><td><a href={item.url} target="_blank" rel="noreferrer">{item.owner}</a>{item.china ? <><br /><a href={item.china.url} target="_blank" rel="noreferrer"><span className="lang-zh">中国报名：</span><span className="lang-en">China registration: </span>{item.china.owner}</a></> : null}</td><td><span className="lang-zh">{item.checkZh}</span><span className="lang-en">{item.checkEn}</span></td></tr>)}</tbody></table></div></section>)}</div>
        </section>
      </div>
    </main>
  );
}
