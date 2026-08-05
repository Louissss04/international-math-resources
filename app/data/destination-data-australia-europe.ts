import { t, type DestinationGuideRecord, type SourceRecord } from "../lib/types";

const VERIFIED_AT = "2026-08-05";

function source(
  id: string,
  labelZh: string,
  labelEn: string,
  ownerZh: string,
  ownerEn: string,
  url: string,
  appliesTo: string,
  noteZh?: string,
  noteEn?: string,
): SourceRecord {
  return {
    id,
    label: t(labelZh, labelEn),
    owner: t(ownerZh, ownerEn),
    url,
    kind: "official",
    verifiedAt: VERIFIED_AT,
    appliesTo,
    ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
  };
}

export const australiaEuropeDestinationSources: SourceRecord[] = [
  source("dest-au-study-apply", "澳大利亚官方申请说明", "Official guide to applying in Australia", "澳大利亚政府 Study Australia", "Australian Government Study Australia", "https://www.studyaustralia.gov.au/en/plan-your-studies/how-to-apply-to-study", "Australia"),
  source("dest-au-school-qualifications", "澳大利亚中学资格、ATAR 与 IB", "Australian school qualifications, ATAR and IB", "澳大利亚政府 Study Australia", "Australian Government Study Australia", "https://www.studyaustralia.gov.au/en/plan-your-studies/schools.html", "Australia"),
  source("dest-au-uac-international", "UAC 国际 Year 12 申请资格", "UAC eligibility for international Year 12 applicants", "大学招生中心 UAC", "Universities Admissions Centre", "https://uac.edu.au/future-applicants/international-year-12-students", "Australia / NSW and ACT"),
  source("dest-au-uac-ib", "UAC IB 成绩转换说明", "UAC IB admissions score guidance", "大学招生中心 UAC", "Universities Admissions Centre", "https://uac.edu.au/future-applicants/admission-criteria/ib-applicants", "Australia / NSW and ACT"),
  source("dest-au-melbourne-entry", "墨尔本大学国际本科入学要求", "University of Melbourne international undergraduate entry requirements", "墨尔本大学", "University of Melbourne", "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/international-applications/entry-requirements", "Australia / University of Melbourne"),
  source("dest-au-melbourne-equivalents", "墨尔本大学 VCE 等效资格与数学先修", "University of Melbourne VCE-equivalent qualifications and mathematics prerequisites", "墨尔本大学", "University of Melbourne", "https://study.unimelb.edu.au/how-to-apply/undergraduate-study/recognised-vce-equivalent-qualifications", "Australia / University of Melbourne"),
  source("dest-au-monash-gaokao", "蒙纳士大学高考入学要求", "Monash University Gaokao entry requirements", "蒙纳士大学", "Monash University", "https://www.monash.edu/admissions/entry-requirements/china-gaokao", "Australia / Monash University / China"),
  source("dest-au-monash-prerequisites", "蒙纳士大学数学先修与补足途径", "Monash mathematics prerequisites and approved pathways", "蒙纳士大学", "Monash University", "https://www.monash.edu/study/courses/prerequisite-subjects-and-assumed-knowledge/maths-and-science-prerequisites", "Australia / Monash University"),
  source("dest-au-uq-guide", "昆士兰大学国际本科课程指南", "University of Queensland international undergraduate guide", "昆士兰大学", "University of Queensland", "https://study.uq.edu.au/sites/default/files/2023-05/international-guide-undergraduate-postgraduate.pdf", "Australia / University of Queensland / 2026", "含各国际资格与澳大利亚数学先修层级的对应表。", "Includes equivalencies between international qualifications and Australian mathematics prerequisite levels."),

  source("dest-eu-nl-admission", "荷兰本科入学要求说明", "Netherlands admission requirements", "Study in NL（Nuffic）", "Study in NL (Nuffic)", "https://www.studyinnl.org/plan-your-stay/admission-requirements", "Netherlands"),
  source("dest-eu-nl-apply", "荷兰 Studielink 申请说明", "Netherlands application through Studielink", "Study in NL（Nuffic）", "Study in NL (Nuffic)", "https://www.studyinnl.org/plan-your-stay/how-to-apply", "Netherlands"),
  source("dest-eu-groningen-math", "格罗宁根大学数学缺项补足证书", "University of Groningen certificates accepted for a mathematics deficiency", "格罗宁根大学", "University of Groningen", "https://www.rug.nl/education/application-enrolment-tuition-fees/admission/procedures/application-informatie/with-non-dutch-diploma/bachelor/bachelor-entry-requirements/accepted-certificates-to-lift-a-deficiency?lang=en", "Netherlands / University of Groningen / 2026-27"),
  source("dest-eu-daad-admission", "德国本科入学资格说明", "Germany undergraduate admission requirements", "德国学术交流中心 DAAD", "German Academic Exchange Service (DAAD)", "https://www.daad.de/en/studying-in-germany/requirements/overview/", "Germany"),
  source("dest-eu-uniassist-china", "uni-assist 中国学历材料清单", "uni-assist document requirements for China", "uni-assist", "uni-assist", "https://www.uni-assist.de/en/tools/info-country-by-country/details-country/country/cn/", "Germany / China"),
  source("dest-eu-testas", "TestAS 官方主页、日期与考点", "Official TestAS dates and test centres", "TestAS", "TestAS", "https://www.testas.de/en/", "Germany / TestAS"),
  source("dest-eu-testas-structure", "数字 TestAS 结构", "Digital TestAS structure", "TestAS", "TestAS", "https://www.testas.de/en/teilnehmende/the-digital-testas/structure-of-the-digital-testas", "Germany / TestAS"),
  source("dest-eu-tolc-rules", "2026 TOLC 官方规则", "Official 2026 TOLC rules", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/all-about-tolc/TOLC-rules", "Italy / 2026"),
  source("dest-eu-tolc-i", "TOLC-I 结构与数学考纲", "TOLC-I structure and mathematics syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus", "Italy / TOLC-I / 2026"),
  source("dest-eu-swiss-countries", "瑞士大学按国家入学条件", "Swiss university admission requirements by country", "swissuniversities", "swissuniversities", "https://www.swissuniversities.ch/en/topics/studying/admission-to-universities/countries-1", "Switzerland / 2026-27"),
  source("dest-eu-eth-2026", "ETH Zurich 2026/27 国际资格入学条件", "ETH Zurich international admission requirements 2026/27", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/ETH-ZulassungsbedingungenHS2026_EN.pdf", "Switzerland / ETH Zurich / 2026-27"),
  source("dest-eu-epfl-exam", "EPFL 本科入学考试", "EPFL Bachelor entrance examination", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/admission-examination/", "Switzerland / EPFL / 2026-27"),
  source("dest-eu-france-apply", "法国高等教育申请程序", "Application to French higher education", "法国高等教育署 Campus France", "Campus France", "https://www.campusfrance.org/en/application-higher-education-france", "France / China"),
  source("dest-eu-cao-gce", "爱尔兰 CAO GCE 计分与数学加分", "Ireland CAO GCE scoring and mathematics bonus", "爱尔兰中央申请办公室 CAO", "Central Applications Office (Ireland)", "https://www.cao.ie/index.php/index.php?page=scoring&s=gce", "Ireland / 2026"),
  source("dest-eu-ucd-china", "UCD 2026 中国申请者课程与数学要求", "UCD 2026 course and mathematics requirements for applicants from China", "都柏林大学", "University College Dublin", "https://www.ucd.ie/global/study-at-ucd/undergraduate/entryrequirements/china/", "Ireland / University College Dublin / China / 2026"),
];

const australiaGuide: DestinationGuideRecord = {
  id: "destination-australia",
  slug: "australia",
  title: t("澳大利亚本科申请：数学课程与考试体系", "Undergraduate study in Australia: mathematics curricula and tests"),
  shortTitle: t("澳大利亚", "Australia"),
  summary: t(
    "澳大利亚没有面向所有本科申请人的统一数学入学考试。录取通常同时核对总体学术成绩和课程规定的数学先修科目；ATAR、IB、A Level、AP/SAT 或高考是否可用，以及如何换算，均由大学和课程规定。",
    "Australia has no universal mathematics admissions test for all undergraduate applicants. Admission normally checks both the overall academic result and programme-specific mathematics prerequisites; each university and course determines whether and how ATAR, IB, A Levels, AP/SAT or Gaokao are used.",
  ),
  facts: [
    { label: t("统一数学入学考试", "Universal mathematics admissions test"), value: t("无；按大学和专业核对先修数学", "None; mathematics prerequisites are set by university and programme"), sourceIds: ["dest-au-study-apply"] },
    { label: t("主要本地体系", "Main domestic system"), value: t("州高中毕业资格 + ATAR；IB 可换算为可比较排名", "State senior-secondary qualification + ATAR; IB is converted to a comparable rank"), sourceIds: ["dest-au-school-qualifications", "dest-au-uac-ib"] },
    { label: t("中国普高路线", "Chinese national-curriculum route"), value: t("部分大学接受高考；是否满足数学先修需另查", "Some universities accept Gaokao; mathematics prerequisites are checked separately"), sourceIds: ["dest-au-monash-gaokao", "dest-au-uq-guide"] },
    { label: t("申请入口", "Application route"), value: t("按资格和学校使用州招生中心或大学直申", "Use a state admissions centre or apply directly, depending on qualification and institution"), sourceIds: ["dest-au-uac-international", "dest-au-study-apply"] },
  ],
  sections: [
    {
      id: "australia-system-map",
      title: t("资格体系与数学要求", "Qualification systems and mathematics requirements"),
      tables: [{
        columns: [t("申请资格", "Applicant qualification"), t("录取中如何使用", "How it is used"), t("数学要查什么", "Mathematics check")],
        rows: [
          { cells: [t("澳大利亚 Year 12（HSC、VCE、QCE、WACE、SACE 等）", "Australian Year 12 (HSC, VCE, QCE, WACE, SACE, etc.)"), t("各州成绩形成或转换为 ATAR／selection rank。", "State results produce or are converted into an ATAR / selection rank."), t("课程页会写 prerequisite、assumed knowledge 或 recommended study；三者约束力不同。", "Course pages distinguish prerequisites, assumed knowledge and recommended study; these are not equivalent." )], sourceIds: ["dest-au-school-qualifications", "dest-au-study-apply"] },
          { cells: [t("IB Diploma", "IB Diploma"), t("招生中心或大学将 IB 总分转换为可与 ATAR 比较的排名。", "Admissions centres or universities convert the IB result into a rank comparable with ATAR."), t("仍需满足具体 IB 数学课程与等级，如 AA/AI、SL/HL；不能只看 IB 总分。", "The specified IB mathematics course and grade—AA/AI and SL/HL—must still be met; the total score alone is insufficient." )], sourceIds: ["dest-au-uac-ib", "dest-au-melbourne-equivalents"] },
          { cells: [t("GCE A Level / International A Level", "GCE A Level / International A Level"), t("多数大学公布资格换算或在申请时评估。", "Universities publish qualification conversions or assess them during application."), t("数学先修通常按 A Level Mathematics 的成绩核对；要求 Further Mathematics 的课程会明确写出。", "A mathematics prerequisite is normally checked against A Level Mathematics; courses requiring Further Mathematics state this explicitly." )], sourceIds: ["dest-au-melbourne-equivalents", "dest-au-uq-guide"] },
          { cells: [t("美国高中 + AP / SAT / ACT", "US high school + AP / SAT / ACT"), t("仅在大学列明接受该组合时使用；不是澳大利亚全国统一要求。", "Used only where a university lists the combination as accepted; it is not a national Australian requirement."), t("检查 AP Calculus/Statistics 是否满足数学先修，不能用 SAT 总分替代未满足的科目要求，除非大学明示。", "Check whether AP Calculus or Statistics meets the subject prerequisite; an SAT total does not replace a missing prerequisite unless the university explicitly says so." )], sourceIds: ["dest-au-uq-guide", "dest-au-melbourne-entry"] },
          { cells: [t("中国高考 / 普高成绩", "China Gaokao / senior-secondary results"), t("部分大学直接接受高考，另一些要求预科、国际课程或个案评估。", "Some universities accept Gaokao directly; others require foundation study, an international curriculum or individual assessment."), t("核对高考数学或高中数学是否达到对应的 General Mathematics、Mathematical Methods 或 Specialist Mathematics 层级。", "Check whether Gaokao or school mathematics reaches the stated General Mathematics, Mathematical Methods or Specialist Mathematics equivalent." )], sourceIds: ["dest-au-monash-gaokao", "dest-au-uq-guide"] },
        ],
      }],
    },
    {
      id: "australia-what-to-take",
      title: t("可能需要参加的数学考试", "Mathematics examinations that may be needed"),
      intro: t("先确认自己使用哪一种高中毕业资格，再确认目标课程的数学先修；不要为澳大利亚申请额外假设一项全国数学考试。", "First identify the school-leaving qualification used for admission, then check the target course's mathematics prerequisite; do not assume an additional national mathematics test."),
      tables: [{
        columns: [t("情形", "Situation"), t("通常要考／提交", "What is normally taken or submitted"), t("结论", "Conclusion")],
        rows: [
          { cells: [t("在国际学校读 IB、A Level 或 AP", "Studying IB, A Levels or AP at an international school"), t("完成本体系数学课程和统考；提交官方最终成绩。", "Complete the mathematics course and subject examination in that system and submit official final results."), t("数学课程级别比是否参加额外标化更关键。", "The mathematics course level is usually more important than an extra standardised test." )], sourceIds: ["dest-au-melbourne-equivalents"] },
          { cells: [t("中国普高申请接受高考的大学", "Chinese national-curriculum applicant to a university accepting Gaokao"), t("提交高考总分、数学科目及大学要求的高中成绩材料。", "Submit the Gaokao total, mathematics result and the school records required by the university."), t("高考达到总体录取线不自动等于满足数学先修。", "Meeting the overall Gaokao entry score does not automatically meet the mathematics prerequisite." )], sourceIds: ["dest-au-monash-gaokao", "dest-au-uq-guide"] },
          { cells: [t("缺少规定的数学先修", "Missing the stated mathematics prerequisite"), t("使用大学认可的 bridging course、foundation mathematics 或指定在线课程。", "Use an approved bridging course, foundation mathematics subject or designated online course."), t("只接受课程页列出的补足方式；完成普通网课通常无效。", "Only a pathway listed by the university should be relied upon; an unrelated online course normally does not qualify." )], sourceIds: ["dest-au-monash-prerequisites", "dest-au-study-apply"] },
        ],
      }],
    },
    {
      id: "australia-examples",
      title: t("官方要求实例", "Examples from official requirements"),
      tables: [{
        columns: [t("大学／场景", "University / context"), t("数学要求实例", "Mathematics example"), t("使用方式", "How to use it")],
        rows: [
          { cells: [t("墨尔本大学：VCE Mathematical Methods 等效", "University of Melbourne: VCE Mathematical Methods equivalent"), t("IB 可用 AA SL、AA HL 或 AI HL，最低 4；GCE A Level 先修科目通常至少 C，具体课程如有更高要求则以课程页为准。", "IB AA SL, AA HL or AI HL can satisfy the equivalent with at least 4; a GCE A Level prerequisite normally requires at least C unless the course page specifies a higher result."), t("先看目标学位课程页，再用等效资格页翻译自己的数学课程。", "Check the target degree page first, then use the equivalency page to map the applicant's mathematics course." )], sourceIds: ["dest-au-melbourne-equivalents", "dest-au-melbourne-entry"] },
          { cells: [t("蒙纳士大学：中国高考", "Monash University: China Gaokao"), t("高考可用于多数本科直录；课程表另列是否要求 Gaokao Mathematics 或其他数学层级。", "Gaokao can be used for direct entry to many degrees; the course table separately indicates whether Gaokao Mathematics or another mathematics level is required."), t("同时核对总体高考百分比和数学先修列。", "Check both the overall Gaokao percentage and the mathematics-prerequisite column." )], sourceIds: ["dest-au-monash-gaokao"] },
          { cells: [t("昆士兰大学：国际资格数学等效", "University of Queensland: international mathematics equivalencies"), t("2026 国际指南把中国高考、IB、A Level、AP 等分别映射到 General Mathematics、Mathematical Methods、Specialist Mathematics。", "The 2026 international guide maps Gaokao, IB, A Levels, AP and other qualifications to General Mathematics, Mathematical Methods and Specialist Mathematics levels."), t("以申请年份最新版课程指南和具体学位页交叉核对。", "Cross-check the guide for the application year with the specific degree page." )], sourceIds: ["dest-au-uq-guide"] },
        ],
      }],
    },
    {
      id: "australia-china-application",
      title: t("中国学生申请入口", "Application routes for students in China"),
      bullets: [
        t("在中国读澳大利亚 Year 12、IB 或 NCEA，并申请 UAC 参与院校时，先核对 UAC 当年对国际 Year 12 申请人的资格范围。", "Students in China completing Australian Year 12, IB or NCEA and applying to a UAC institution should first check UAC's current eligibility rules for international Year 12 applicants."),
        t("使用中国高考、A Level、AP 等其他资格时，UAC 明确说明通常应直接向大学申请；各校也可能指定认可代理。", "For Gaokao, A Levels, AP and other qualifications, UAC states that applicants normally apply directly to the university; an institution may also nominate authorised agents."),
        t("成绩材料中应能识别数学课程名称、级别、考试局和最终成绩。只有中文的文件按大学要求提供认证翻译。", "Records should identify the mathematics subject, level, awarding body and final result. Chinese-only documents should be accompanied by the translation required by the institution."),
      ],
    },
  ],
  sourceIds: australiaEuropeDestinationSources.filter((item) => item.id.startsWith("dest-au-")).map((item) => item.id),
  relatedProjectIds: ["ap-calculus-ab", "ap-calculus-bc", "ap-statistics", "ib-dp-math-aa-sl", "ib-dp-math-aa-hl", "ib-dp-math-ai-sl", "ib-dp-math-ai-hl", "cie-as-a-level-mathematics-9709", "edexcel-ial-mathematics", "edexcel-ial-further-mathematics", "sat", "act"],
  lastVerified: VERIFIED_AT,
};

const europeGuide: DestinationGuideRecord = {
  id: "destination-europe-other",
  slug: "europe-other",
  title: t("欧洲其他国家本科申请：数学课程与考试体系", "Undergraduate study in other European countries: mathematics curricula and tests"),
  shortTitle: t("欧洲其他国家", "Other Europe"),
  summary: t(
    "欧洲没有统一的本科数学入学考试。荷兰、德国、意大利、瑞士、法国和爱尔兰分别使用本国学历认可、大学专业先修和指定考试；OMPT、TestAS、TOLC、ETH/EPFL 入学考试只在相应国家、大学或专业规则下适用。",
    "Europe has no single undergraduate mathematics admissions test. The Netherlands, Germany, Italy, Switzerland, France and Ireland use their own qualification-recognition, programme-prerequisite and designated-test rules; OMPT, TestAS, TOLC and ETH/EPFL entrance examinations apply only under the relevant national, university or programme rules.",
  ),
  facts: [
    { label: t("统一欧洲数学考试", "Europe-wide mathematics test"), value: t("无", "None"), sourceIds: ["dest-eu-nl-admission", "dest-eu-daad-admission", "dest-eu-france-apply"] },
    { label: t("常见附加数学考试", "Common additional mathematics tests"), value: t("OMPT、TestAS、TOLC-I、ETH/EPFL 入学考试；均非普遍必考", "OMPT, TestAS, TOLC-I and ETH/EPFL entrance exams; none is universally required"), sourceIds: ["dest-eu-groningen-math", "dest-eu-testas", "dest-eu-tolc-i", "dest-eu-epfl-exam"] },
    { label: t("中国学历特别程序", "China-specific procedures"), value: t("德国常见 APS；法国使用 Études en France；其他国家按大学要求提交认证材料", "Germany commonly requires APS; France uses Études en France; other countries follow institutional document rules"), sourceIds: ["dest-eu-uniassist-china", "dest-eu-france-apply"] },
    { label: t("三项独立审查", "Three separate checks"), value: t("学历入学资格、数学先修、数学补足考试分别判断", "Qualification eligibility, mathematics prerequisites and deficiency testing are assessed separately"), sourceIds: ["dest-eu-nl-admission", "dest-eu-daad-admission"] },
  ],
  sections: [
    {
      id: "europe-country-map",
      title: t("按国家区分", "Country-by-country system map"),
      tables: [{
        columns: [t("国家", "Country"), t("学历与数学先修", "Qualification and mathematics prerequisite"), t("可能出现的数学考试", "Possible mathematics test"), t("申请入口", "Application route")],
        rows: [
          { cells: [t("荷兰", "Netherlands"), t("大学判断学历是否等同 VWO，并按专业要求 Mathematics A/B 或同等数学。Nuffic 提供学历评估参考，最终决定属于大学。", "The university assesses whether the diploma is comparable to VWO and whether programme-level Mathematics A/B or equivalent is met. Nuffic advises on diploma level; the university makes the final decision."), t("数学缺项时，大学可能接受特定 OMPT-A/B/D、CCVX 或 Boswell-Bèta；不是所有学校接受，也不是所有专业用同一版本。", "For a mathematics deficiency, a university may accept a specified OMPT-A/B/D, CCVX or Boswell-Bèta certificate; acceptance and version vary by institution and programme."), t("通常先在 Studielink 登记，再完成大学自己的材料门户。", "Normally register in Studielink and then complete the university's own document portal." )], sourceIds: ["dest-eu-nl-admission", "dest-eu-nl-apply", "dest-eu-groningen-math"] },
          { cells: [t("德国", "Germany"), t("先确认 Hochschulzugangsberechtigung（大学入学资格）及可申请的专业范围。中国学历通常还涉及 APS 与高考/会考/高中材料。", "First confirm the Hochschulzugangsberechtigung (higher-education entrance qualification) and the permitted subject area. Chinese credentials commonly also involve APS and Gaokao/Huikao/school records."), t("TestAS 仅在大学要求或用于选拔时参加；本网站只整理 Core Module 与专业模块中的数学和数量推理。缺少直接入学资格时也可能走 Studienkolleg 与 Feststellungsprüfung。", "Take TestAS only where a university requires or uses it; this site covers only mathematics and quantitative reasoning in the Core and subject modules. Applicants without direct entry may instead need Studienkolleg and the Feststellungsprüfung."), t("先查 DAAD/uni-assist 数据库，再确认学校是经 uni-assist、VPD 还是校方直申。", "Use the DAAD/uni-assist databases first, then confirm whether the institution uses uni-assist, a VPD or direct application." )], sourceIds: ["dest-eu-daad-admission", "dest-eu-uniassist-china", "dest-eu-testas", "dest-eu-testas-structure"] },
          { cells: [t("意大利", "Italy"), t("高中毕业资格与专业条件由大学招生简章规定。部分高数学含量专业以 CISIA 测试评估先修。", "The university call for applications defines the school-leaving qualification and programme conditions. Some mathematics-intensive programmes use CISIA tests to assess preparation."), t("TOLC-I 2026 数学部分为 20 题、50 分钟；英语授课项目可能指定 English TOLC-I 或 CEnT-S。具体类型、数学最低分和最晚日期必须看专业简章。", "In 2026, the TOLC-I mathematics section has 20 questions in 50 minutes. English-taught programmes may specify English TOLC-I or CEnT-S. The programme call controls the test type, mathematics minimum and deadline."), t("在 CISIA 建号并预约被目标大学接受的场次，同时完成大学申请门户。", "Create a CISIA account and book a sitting accepted by the target university while also completing the university application." )], sourceIds: ["dest-eu-tolc-rules", "dest-eu-tolc-i"] },
          { cells: [t("瑞士", "Switzerland"), t("每所大学按学历国家制定条件。2026/27 中国普通高中资格在 ETH Zurich 通常还需中国认可大学同专业录取证明及 reduced entrance examination；EPFL 对中国资格列入入学考试路线。", "Each university sets country-specific conditions. For 2026/27, a Chinese upper-secondary credential at ETH Zurich normally also requires proof of admission in the intended subject at a recognised Chinese university and the reduced entrance examination; EPFL places Chinese credentials on an entrance-examination route."), t("ETH reduced/comprehensive entrance examination 或 EPFL entrance examination；均含较强数学内容，适用范围由学校审核材料后确定。", "ETH reduced/comprehensive entrance examination or the EPFL entrance examination; both are mathematics-intensive, and the institution determines which route applies after reviewing the file."), t("直接使用 ETH/EPFL 申请系统；考试通常需赴指定地点，不能假设中国远程考试。", "Apply through the ETH/EPFL system; examinations normally require attendance at the designated location and should not be assumed to be remotely available in China." )], sourceIds: ["dest-eu-swiss-countries", "dest-eu-eth-2026", "dest-eu-epfl-exam"] },
          { cells: [t("法国", "France"), t("公立大学 Licence 1 或选择性项目分别审核中学资格和专业准备；没有一项全国通用的本科数学入学考试。", "Public-university Licence 1 and selective programmes separately assess the school credential and subject preparation; there is no universal undergraduate mathematics admissions test."), t("CPGE、工程师学校或学校自设项目可能有选拔考试或面试；只按目标项目当年规则准备。", "CPGE, engineering schools or institution-specific programmes may run selection tests or interviews; prepare only for the current rules of the target programme."), t("中国属于 Études en France 程序国家。Licence 1 的 DAP、Parcoursup 适用范围及学校直申须按申请人资格和项目类型区分。", "China is an Études en France country. Whether Licence 1 DAP, Parcoursup or direct institutional application applies depends on the applicant's qualification and programme type." )], sourceIds: ["dest-eu-france-apply"] },
          { cells: [t("爱尔兰", "Ireland"), t("课程先看最低入学科目，再看竞争性 points。CAO 规定 A Level Mathematics、Further Mathematics、Pure Mathematics 中仅一门可获得当年的数学加分。", "Check minimum subject requirements before competitive points. Under CAO rules, only one of A Level Mathematics, Further Mathematics or Pure Mathematics can receive the applicable mathematics bonus."), t("大多数课程不另设全国数学考试；个别大学可接受指定数学补足测试。例如 UCD 2026 工程对部分中国申请人试行接受 OMPT-D 55%。", "Most courses have no separate national mathematics test; individual universities may accept a specified deficiency test. For example, UCD's 2026 engineering requirements pilot OMPT-D at 55% for certain Chinese applicants."), t("非欧盟申请人须查大学是否要求 CAO 或直接申请；CAO 明确由各大学决定资格评估。", "Non-EU applicants must check whether the institution requires CAO or direct application; CAO states that institutions determine qualification evaluation." )], sourceIds: ["dest-eu-cao-gce", "dest-eu-ucd-china"] },
        ],
      }],
    },
    {
      id: "europe-test-map",
      title: t("数学考试与综合测试中的数学部分", "Mathematics examinations and mathematics sections of broader tests"),
      tables: [{
        columns: [t("考试", "Test"), t("适用场景", "Where it applies"), t("数学内容与结构", "Mathematics content and structure"), t("报名注意", "Registration note")],
        rows: [
          { cells: [t("OMPT-A / B / D", "OMPT-A / B / D"), t("荷兰或少数其他欧洲大学指定的数学缺项补足；版本由专业决定。", "A mathematics-deficiency route designated by Dutch and a small number of other European institutions; the programme specifies the version."), t("内容范围随版本不同；大学会列出接受版本、最低总分、分类最低分和最大尝试次数。", "Scope differs by version; the university states the accepted version, overall minimum, category minimums and attempt limit."), t("只有收到大学明确要求或在官方要求页确认后再报；线上监考不等于所有学校认可。", "Book only after an institution explicitly requires it or lists it as accepted; online proctoring does not imply universal recognition." )], sourceIds: ["dest-eu-groningen-math", "dest-eu-ucd-china"] },
          { cells: [t("TestAS 数学与数量推理", "TestAS mathematics and quantitative reasoning"), t("德国大学对国际申请人的能力评估；是否必需由大学决定。", "An aptitude assessment used by German universities for international applicants; the university decides whether it is required."), t("数字版 Core Module 与专业模块各约 90 分钟。本网站只列其中的数学、公式、图表和数量推理要求；完整考试结构见官方页。", "The digital Core and subject modules each take about 90 minutes. This site lists only mathematics, formula, diagram and quantitative-reasoning requirements; see the official page for the complete test structure."), t("英文或德文，在官方授权考点参加；Core 与专业模块必须同场完成。中国考点和日期从 TestAS 官网实时查询。", "Available in English or German at licensed centres; Core and subject modules must be taken together. Check the official site for current China centres and dates." )], sourceIds: ["dest-eu-testas", "dest-eu-testas-structure"] },
          { cells: [t("TOLC-I 数学部分", "TOLC-I mathematics section"), t("意大利部分高数学含量本科专业。", "Some mathematics-intensive undergraduate programmes in Italy."), t("2026：数学 20 题／50 分钟，答对 +1、空答 0、答错 −0.25；大学自行规定数学最低分或总分规则。", "2026: Mathematics has 20 questions in 50 minutes; correct +1, blank 0, incorrect −0.25. Institutions set mathematics minima or overall-score rules."), t("先读大学招生简章，确认是 TOLC-I、English TOLC-I、CEnT-S 或其他测试以及接受的考试窗口。", "Read the university call first to confirm TOLC-I, English TOLC-I, CEnT-S or another test and the accepted testing window." )], sourceIds: ["dest-eu-tolc-rules", "dest-eu-tolc-i"] },
          { cells: [t("ETH / EPFL 入学考试", "ETH / EPFL entrance examination"), t("瑞士两所联邦理工对不满足直接录取条件的特定国际资格。", "Specified international qualifications that do not qualify for direct entry to the two Swiss federal institutes."), t("数学是核心科目；reduced 或 comprehensive/full 的科目范围由学校按学历审定。EPFL 公布当年科学科目考纲、日程和练习。", "Mathematics is central; the institution determines reduced or comprehensive/full scope from the credential. EPFL publishes the current scientific-subject programme, schedule and exercises."), t("先申请并由学校判定考试类型；考试日期、签证和赴瑞士安排需单独预留。", "Apply first and wait for the institution to determine the examination route; plan separately for dates, visa and travel to Switzerland." )], sourceIds: ["dest-eu-eth-2026", "dest-eu-epfl-exam"] },
        ],
      }],
    },
    {
      id: "europe-china-routes",
      title: t("中国学生的材料与报名", "Documents and registration for applicants in China"),
      tables: [{
        columns: [t("地区", "Destination"), t("中国申请人首先办理", "First action for an applicant in China"), t("容易混淆的事项", "Common point of confusion")],
        rows: [
          { cells: [t("荷兰", "Netherlands"), t("在 Studielink 建立申请，并按大学门户提交高中资格、数学课程与成绩。", "Create the application in Studielink and submit the school credential, mathematics subjects and results through the university portal."), t("OMPT 是缺项补足工具，不是所有中国申请人的统一入学考试。", "OMPT is a deficiency route, not a universal entrance test for applicants from China." )], sourceIds: ["dest-eu-nl-apply", "dest-eu-groningen-math"] },
          { cells: [t("德国", "Germany"), t("使用 DAAD/uni-assist 数据库确认入学资格；按要求准备 APS、高考、会考、高中毕业证及 10—12 年级成绩。", "Check eligibility in the DAAD/uni-assist databases and prepare APS, Gaokao, Huikao, school-leaving certificate and Grades 10–12 records as required."), t("TestAS 成绩不能自动代替不满足的大学入学资格；具体用途由学校规定。", "A TestAS result does not automatically replace a missing higher-education entrance qualification; the institution defines its use." )], sourceIds: ["dest-eu-daad-admission", "dest-eu-uniassist-china", "dest-eu-testas"] },
          { cells: [t("意大利", "Italy"), t("先锁定专业的当年 call for applications，再用 CISIA 账户预约其中认可的测试。", "Open the programme's current call for applications first, then use a CISIA account to book an accepted test."), t("考过 TOLC 不等于完成大学申请；测试和大学申请通常是两套流程。", "Taking a TOLC does not complete the university application; testing and university application are normally separate processes." )], sourceIds: ["dest-eu-tolc-rules"] },
          { cells: [t("瑞士", "Switzerland"), t("在 swissuniversities 和大学页按 China 查当年条件，再通过大学申请系统提交。", "Check the current China entry under swissuniversities and the university page, then apply through the institution's system."), t("ETH 与 EPFL 条件不同；不能用一校的考试或资格结论推断另一校。", "ETH and EPFL rules differ; one institution's examination or credential decision cannot be carried over to the other." )], sourceIds: ["dest-eu-swiss-countries", "dest-eu-eth-2026", "dest-eu-epfl-exam"] },
          { cells: [t("法国", "France"), t("中国申请人先确认 Études en France；再按 Licence 1 DAP、Parcoursup 或学校直申的适用范围办理。", "Applicants in China first determine the Études en France route, then follow the applicable Licence 1 DAP, Parcoursup or direct-institution procedure."), t("法国申请平台是申请流程，不是一项数学考试；数学要求仍由项目设置。", "The French application platform is a procedure, not a mathematics test; the programme still sets its mathematics requirements." )], sourceIds: ["dest-eu-france-apply"] },
          { cells: [t("爱尔兰", "Ireland"), t("先在大学的 China 页面核对高考/会考/高中数学或国际课程要求，再确认 CAO 或直申。", "Check the university's China page for Gaokao/Huikao/school mathematics or international-curriculum requirements, then confirm CAO or direct application."), t("points 竞争分与数学最低科目要求是两道门槛；加分不能替代最低科目要求。", "Competitive points and the minimum mathematics subject requirement are separate thresholds; bonus points do not replace the subject minimum." )], sourceIds: ["dest-eu-cao-gce", "dest-eu-ucd-china"] },
        ],
      }],
    },
  ],
  sourceIds: australiaEuropeDestinationSources.filter((item) => item.id.startsWith("dest-eu-")).map((item) => item.id),
  relatedProjectIds: [
    "ib-dp-math-aa-sl",
    "ib-dp-math-aa-hl",
    "ib-dp-math-ai-hl",
    "cie-as-a-level-mathematics-9709",
    "cie-as-a-level-further-mathematics-9231",
    "edexcel-ial-mathematics",
    "edexcel-ial-further-mathematics",
    "ap-calculus-ab",
    "ap-calculus-bc",
    "ompt-mathematics-admissions-test",
    "testas-mathematics-computer-science-natural-sciences",
    "cisia-tolc-i-cent-s",
    "eth-zurich-entrance-examination",
    "epfl-bachelor-entrance-examination",
  ],
  lastVerified: VERIFIED_AT,
};

export const australiaEuropeDestinationGuides: DestinationGuideRecord[] = [australiaGuide, europeGuide];
