import {
  t,
  type AssessmentSyllabusRecord,
  type FactRecord,
  type LearningResourceRecord,
  type PastPaperArchiveRecord,
  type PastPaperLinkRecord,
  type ProjectRecord,
  type SourceRecord,
  type SyllabusSourceRecord,
  type TableRow,
  type ThresholdRecord,
} from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";

const OMPT_ID = "ompt-mathematics-admissions-test";
const TESTAS_ID = "testas-mathematics-computer-science-natural-sciences";
const CISIA_ID = "cisia-tolc-i-cent-s";
const ETH_ID = "eth-zurich-entrance-examination";
const EPFL_ID = "epfl-bachelor-entrance-examination";

const source = (
  id: string,
  labelZh: string,
  labelEn: string,
  ownerZh: string,
  ownerEn: string,
  url: string,
  kind: SourceRecord["kind"],
  appliesTo: string,
  noteZh?: string,
  noteEn?: string,
): SourceRecord => ({
  id,
  label: t(labelZh, labelEn),
  owner: t(ownerZh, ownerEn),
  url,
  kind,
  verifiedAt: VERIFIED_AT,
  appliesTo,
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
});

const fact = (
  labelZh: string,
  labelEn: string,
  valueZh: string,
  valueEn: string,
  sourceIds: string[],
  status: FactRecord["status"] = "confirmed",
): FactRecord => ({
  label: t(labelZh, labelEn),
  value: t(valueZh, valueEn),
  sourceIds,
  status,
});

const row = (
  cells: Array<[string, string]>,
  sourceIds?: string[],
  status?: TableRow["status"],
): TableRow => ({
  cells: cells.map(([zh, en]) => t(zh, en)),
  ...(sourceIds ? { sourceIds } : {}),
  ...(status ? { status } : {}),
});

const syllabusSource = (
  titleZh: string,
  titleEn: string,
  providerZh: string,
  providerEn: string,
  url: string,
  format: SyllabusSourceRecord["format"],
  versionZh?: string,
  versionEn?: string,
  noteZh?: string,
  noteEn?: string,
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  format,
  ...(versionZh && versionEn ? { version: t(versionZh, versionEn) } : {}),
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
});

const learningResource = (
  id: string,
  projectIds: string[],
  titleZh: string,
  titleEn: string,
  providerZh: string,
  providerEn: string,
  url: string,
  kind: LearningResourceRecord["kind"],
  access: LearningResourceRecord["access"],
  descriptionZh: string,
  descriptionEn: string,
  noteZh?: string,
  noteEn?: string,
): LearningResourceRecord => ({
  id,
  projectIds,
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  kind,
  description: t(descriptionZh, descriptionEn),
  access,
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
  verifiedAt: VERIFIED_AT,
});

const paperLink = (
  titleZh: string,
  titleEn: string,
  providerZh: string,
  providerEn: string,
  url: string,
  kind: PastPaperLinkRecord["kind"],
  access: PastPaperLinkRecord["access"],
  noteZh: string,
  noteEn: string,
): PastPaperLinkRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  authority: "official",
  kind,
  access,
  note: t(noteZh, noteEn),
});

export const europeAssessmentSources: SourceRecord[] = [
  source("eu-ompt-home", "OMPT 官方主页与考试类型", "OMPT official test overview", "OMPT", "OMPT", "https://www.omptest.org/", "official", "OMPT-A/B/D; current format"),
  source("eu-ompt-required", "是否需要参加 OMPT", "Do I need to take the OMPT?", "OMPT 帮助中心", "OMPT Help Center", "https://help.omptest.org/hc/en-us/articles/4415889620881-Do-I-need-to-take-the-OMPT", "official", "Institutional requirement", "由目标院校招生办公室决定考试类型、最低分及是否必须参加。", "The target admissions office decides the test type, minimum score, and whether the test is required."),
  source("eu-ompt-program-selector", "OMPT 院校与专业选择入口", "OMPT institution and programme selector", "OMPT", "OMPT", "https://app.omptest.org/ompt/", "official", "Current programme requirements and registration period"),
  source("eu-ompt-recognized", "OMPT 合作及认可院校", "OMPT recognised institutions", "OMPT", "OMPT", "https://www.omptest.org/recognized-institutions", "official", "Institution list", "院校在名单中不等于其所有专业都要求或接受同一种 OMPT。", "An institution's presence does not mean every programme requires or accepts the same OMPT type."),
  source("eu-ompt-pricing", "OMPT 官方价格表", "OMPT official pricing", "OMPT", "OMPT", "https://www.omptest.org/pricing", "official", "2025/26 products; verified 2026-08-05"),
  source("eu-ompt-process", "OMPT 报名、监考与出分流程", "OMPT registration, proctoring and results process", "OMPT", "OMPT", "https://www.omptest.org/process", "official", "Current process"),
  source("eu-ompt-rules", "OMPT 在线考试规则", "OMPT online test rules and requirements", "OMPT", "OMPT", "https://www.omptest.org/rules", "official", "Current remote-proctoring rules"),
  source("eu-ompt-exceptions", "OMPT 各专业可考次数例外", "OMPT programme-specific attempt exceptions", "OMPT", "OMPT", "https://www.omptest.org/exceptions", "official", "Attempt limits by programme"),
  source("eu-ompt-practicing", "OMPT 官方练习与模拟考试", "OMPT official practice and mock tests", "OMPT", "OMPT", "https://www.omptest.org/practicing", "official", "Paid practice and mock products"),
  source("eu-ompt-a-syllabus", "OMPT-A 官方考纲", "OMPT-A official syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-a/syllabus", "official", "OMPT-A; 176 listed topics"),
  source("eu-ompt-a-weight", "OMPT-A 学习评估占比", "OMPT-A learning-assessment weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-a/learning-assessments", "official-data", "OMPT-A topic weights"),
  source("eu-ompt-b-syllabus", "OMPT-B 官方考纲", "OMPT-B official syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-b/syllabus", "official", "OMPT-B; 226 listed topics"),
  source("eu-ompt-b-weight", "OMPT-B 学习评估占比", "OMPT-B learning-assessment weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-b/learning-assessments", "official-data", "OMPT-B topic weights"),
  source("eu-ompt-d-syllabus", "OMPT-D 官方考纲", "OMPT-D official syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-d/syllabus", "official", "OMPT-D"),
  source("eu-ompt-d-weight", "OMPT-D 学习评估占比", "OMPT-D learning-assessment weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-d/learning-assessments", "official-data", "OMPT-D topic weights"),

  source("eu-testas-home", "TestAS 官方主页与近期日期", "TestAS official homepage and upcoming dates", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/", "official", "Current TestAS"),
  source("eu-testas-dates", "TestAS 日期、考点与中国说明", "TestAS dates, centres and China information", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/participants/my-testas/testas-dates-and-registration", "official", "Worldwide schedule and APS China route"),
  source("eu-testas-registration", "TestAS 报名常见问题", "TestAS registration FAQ", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/participants/my-testas/faq/faq-registration", "official", "Modules and registration deadlines"),
  source("eu-testas-general", "TestAS 考试性质与费用说明", "TestAS general FAQ", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/participants/my-testas/faq/faq-general", "official", "Current general rules and country-dependent fee"),
  source("eu-testas-digital-structure", "数字 TestAS 结构与专业模块", "Digital TestAS structure and subject modules", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-digital-testas/structure-of-the-digital-testas", "official", "Digital TestAS; MCNS module"),
  source("eu-testas-paper-structure", "纸笔 TestAS 结构与专业模块", "Paper-based TestAS structure and subject modules", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-paper-based-testas/structure-of-the-paper-based-testas", "official", "Paper-based TestAS; MCNS module"),
  source("eu-testas-digital-score", "数字 TestAS 计分", "Digital TestAS score reporting", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-digital-testas/evaluation-of-the-digital-testas", "official-data", "Digital score, percentile and overall score"),
  source("eu-testas-paper-score", "纸笔 TestAS 计分", "Paper-based TestAS score reporting", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-paper-based-testas/evaluation-of-the-paper-based-testas", "official-data", "Paper standard score and percentile"),
  source("eu-testas-conversion", "数字与纸笔 TestAS 分数换算表", "Digital and paper TestAS score conversion chart", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/240813_umrechnungstabelle_testas_score_eng.pdf", "official-data", "Conversion chart dated August 2024"),
  source("eu-testas-results", "TestAS 成绩与证书常见问题", "TestAS results and certificates FAQ", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/participants/my-testas/faq/faq-results-and-certificates", "official", "Result timing, validity and certificate use"),
  source("eu-testas-realisation", "TestAS 考试当天与作答规则", "TestAS test-day and delivery FAQ", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/participants/my-testas/faq/faq-realisation", "official", "Paper and digital delivery"),
  source("eu-testas-digital-prep", "数字 TestAS 官方备考材料", "Digital TestAS official preparation materials", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/230531_digitalertestas_preparatory_materials.pdf", "official-archive", "Digital sample tasks and solutions; April 2022 edition"),
  source("eu-testas-paper-sample", "纸笔 TestAS 官方样题册（英文）", "Paper-based TestAS official sample booklet (English)", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/pdf/Modellaufgabenheft_English.pdf", "official-archive", "Paper-based sample tasks including MCNS"),
  source("eu-testas-terms", "TestAS 条款与安全试题规则", "TestAS terms and secure-test rules", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/general-terms-and-conditions", "official", "Secure operational test material"),

  source("eu-cisia-tolci", "TOLC-I 结构、计分与数学考纲", "TOLC-I structure, scoring and mathematics syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus", "official", "Italian-language TOLC-I; 2026"),
  source("eu-cisia-tolc-rules", "2026 TOLC 官方规则", "Official 2026 TOLC rules", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/all-about-tolc/TOLC-rules", "official", "TOLC 2026; fee and delivery"),
  source("eu-cisia-tolc-overview", "TOLC 报名、重考与出分概览", "TOLC booking, retake and results overview", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/all-about-TOLC/what-is-the-TOLC", "official", "TOLC 2026"),
  source("eu-cisia-cent-overview", "CEnT-S 与 English TOLC 的替代关系", "CEnT-S and replacement of English TOLCs", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/all-about-CEnT/all-about-CEnT", "official", "CEnT-S 2025/26", "CISIA 明确说明自 2025 年 11 月起，English TOLC-E/I/F 由 CEnT-S 统一取代。", "CISIA states that from November 2025, English TOLC-E/I/F were replaced by the unified CEnT-S."),
  source("eu-cisia-cent-structure", "CEnT-S 结构、计分与数学考纲", "CEnT-S structure, scoring and mathematics syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/cent-s/structure-and-syllabus", "official", "CEnT-S 2025/26"),
  source("eu-cisia-cent-rules", "2026 CEnT-S 官方规则与日期", "Official 2026 CEnT-S rules and dates", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/all-about-CEnT/CEnT-rules", "official", "November 2025–October 2026"),
  source("eu-cisia-cent-rules-pdf", "2026 CEnT-S 考生规则 PDF", "2026 CEnT-S participant rules PDF", "CISIA", "CISIA", "https://www.cisiaonline.it/sites/default/files/Regolamenti/Rules-CEnT-2026.pdf", "official", "CEnT@UNI and CEnT@HOME"),
  source("eu-cisia-cent-booking", "CEnT-S 预约说明", "How to book a CEnT-S", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/all-about-CEnT/booking-a-CEnT", "official", "Current booking workflow"),
  source("eu-cisia-practice", "CISIA 官方练习区说明", "CISIA official practice-area guide", "CISIA", "CISIA", "https://guide.cisiaonline.it/en/Esercitati", "official", "TOLC and CEnT practice area"),
  source("eu-cisia-cent-practice", "CEnT-S 官方模拟已上线", "CEnT-S official simulations available", "CISIA", "CISIA", "https://www.cisiaonline.it/en/news/practice-cent-s-simulations-available-practice-area", "official", "CEnT-S simulations; account required"),

  source("eu-eth-main", "ETH Zurich 本科入学考试主页", "ETH Zurich entrance examination", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/en/studies/bachelor/application/non-swiss-matriculation-certificate/eth-entrance-examination.html", "official", "Autumn 2027 entry; examination January 2027"),
  source("eu-eth-admission", "ETH 国际学历本科入学条件", "ETH admission prerequisites for non-Swiss certificates", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/en/studies/bachelor/application/non-swiss-matriculation-certificate/admission-prerequisites.html", "official", "Current admissions decision process"),
  source("eu-eth-country-list", "ETH 2026/27 各国学历条件", "ETH country-specific admission requirements 2026/27", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/ETH-Zulassungsbedingungen-EN.pdf", "official", "2026/27; including China"),
  source("eu-eth-reduced-syllabus", "ETH 减免版入学考试要求", "ETH reduced entrance examination requirements", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsinhalte/rAP.pdf", "official", "Reduced examination; mathematics syllabus and format"),
  source("eu-eth-comprehensive-syllabus", "ETH 完整版入学考试要求", "ETH comprehensive entrance examination requirements", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsinhalte/uAP.pdf", "official", "Comprehensive examination; mathematics syllabus and format"),
  source("eu-eth-regulation", "ETH 入学考试条例", "ETH entrance examination regulations", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/eth-zurich/organisation/rechtssammlung/311.1.pdf", "official", "Pass rules, weights and retake"),
  source("eu-eth-math-example-1", "ETH 2024 数学示例卷 Part I", "ETH 2024 Mathematics example Part I", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_I-Beispiel-WEB.pdf", "official-archive", "Official example; German"),
  source("eu-eth-math-example-2", "ETH 2024 数学示例卷 Part II", "ETH 2024 Mathematics example Part II", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_II-Beispiel-WEB.pdf", "official-archive", "Official example; German"),
  source("eu-eth-textbooks", "ETH 入学考试数学教材建议", "ETH entrance-exam Mathematics textbook recommendations", "苏黎世联邦理工学院", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/Lehrb%C3%BCcher%20Empfehlungen%202021.pdf", "official", "Non-binding Mathematics textbook list; dated 3 March 2021", "教材表是备考参考，不定义考试范围；范围以入学考试要求 PDF 为准。", "The textbook list is advisory and does not define the syllabus; the examination-requirements PDFs control."),

  source("eu-epfl-main", "EPFL 本科入学考试主页", "EPFL Bachelor entrance examination", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/admission-examination/", "official", "2027 examination session"),
  source("eu-epfl-criteria", "EPFL 本科与 CMS 入学条件", "EPFL Bachelor and CMS admission criteria", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/", "official", "Current applicant eligibility"),
  source("eu-epfl-program-2027", "EPFL 2027 入学考试科学科目考纲", "EPFL 2027 entrance examination programme—scientific subjects", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2026/04/ProgrammeExAdm2027.pdf", "official", "Session 2027; Mathematics I and II"),
  source("eu-epfl-schedule-2027", "EPFL 2027 科学科目考试日程", "EPFL 2027 scientific-subject examination schedule", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2026/04/Horaire-Examen-Admission-Branches-scientifiques.pdf", "official", "18–22 January 2027"),
  source("eu-epfl-regulation", "EPFL 入学考试条例", "EPFL entrance examination regulation", "洛桑联邦理工学院", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2025/02/2024-Reglement-Examen-admission.pdf", "official", "Grades, coefficients, pass rules and retake"),
  source("eu-epfl-exercises", "EPFL 入学考试官方练习", "EPFL official entrance-exam exercises", "洛桑联邦理工学院", "EPFL", "https://courseware.epfl.ch/courses/course-v1%3AEPFL%2BadmissionEPFL%2B2020/about", "official", "French; analysis, linear algebra and analytic geometry exercises"),
  source("eu-epfl-trig-course", "EPFL 三角、对数与指数函数课程", "EPFL trigonometric, logarithmic and exponential functions course", "洛桑联邦理工学院", "EPFL", "https://courseware.epfl.ch/courses/course-v1%3AEPFL%2BTrigoExp%2B2019/about", "official", "French course and exercises"),
];

const omptProject: ProjectRecord = {
  id: OMPT_ID,
  slug: "ompt-mathematics-admissions-test",
  track: "assessment",
  title: t("OMPT 在线数学入学考试：A／B／D", "OMPT Online Mathematics Admissions Tests: A, B and D"),
  shortTitle: "OMPT A/B/D",
  organizer: t("OMPT（Paragin Group）", "OMPT (Paragin Group)"),
  summary: t(
    "OMPT 是部分欧洲大学或本科专业指定的在线数学入学考试。A、B、D 的题量、时长、内容和作答要求不同；只有目标专业明确要求或接受时才报名，并以专业选择器显示的考试类型、最低分和可考次数为准。",
    "OMPT is an online mathematics admissions test specified by some European universities or undergraduate programmes. A, B and D differ in length, content and response demands. Register only when the target programme requires or accepts it, and follow the programme selector for the test type, minimum score and attempt limit.",
  ),
  regions: ["Europe", "Netherlands", "Remote", "China"],
  gradeBands: ["Grade 11", "Grade 12", "Gap year"],
  eligibilityTags: ["Only if programme specifies", "International applicants", "Remote from China"],
  formatTags: ["Online", "Live proctoring", "On-demand", "No fixed annual date"],
  costBand: "high",
  status: "confirmed",
  cycle: "2025/26 products; programme-specific admissions cycles",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("是否普遍必考", "Universal requirement", "否。仅在目标院校或专业指定 OMPT 时参加；院校决定 A/B/D 类型、最低分和可考次数。", "No. Take OMPT only when the target institution or programme specifies it; the institution determines A/B/D, the minimum score and attempt limit.", ["eu-ompt-required", "eu-ompt-program-selector", "eu-ompt-exceptions"]),
    fact("考试地点", "Location", "在个人电脑上远程参加，由 ProctorU 实时监考；中国境内可参加，但须自行确认网络、设备、身份证件和监考时段。", "Taken remotely on a personal computer with live ProctorU supervision. It can be taken from China, subject to the candidate meeting network, equipment, ID and appointment requirements.", ["eu-ompt-home", "eu-ompt-process", "eu-ompt-rules"]),
    fact("预约", "Scheduling", "购买考试后在 ProctorU 预约；通常至少提前 72 小时。", "Purchase the attempt, then schedule through ProctorU, normally at least 72 hours in advance.", ["eu-ompt-process", "eu-ompt-rules"]),
    fact("成绩", "Results", "证书显示总分及分主题成绩；常规在提交后的 8 个工作日内出分，付费快速批改为 4 个工作日。", "The certificate reports the total and topic scores. Regular grading is within eight business days after submission; the paid fast-grading option is within four business days.", ["eu-ompt-process", "eu-ompt-rules", "eu-ompt-pricing"]),
    fact("统一及格线", "Universal pass mark", "没有；以目标专业当届招生要求为准。", "None; use the target programme's current admissions requirement.", ["eu-ompt-required", "eu-ompt-program-selector"]),
  ],
  dates: [],
  sections: [
    {
      id: "ompt-test-selection",
      title: t("A、B、D 的区别", "Choosing between A, B and D"),
      intro: t("三种考试不能自行视为可互换。注册前先在 OMPT 专业选择器和大学招生页核对指定类型。", "The three tests are not automatically interchangeable. Check the OMPT programme selector and the university admissions page before registering."),
      tables: [{
        columns: [t("考试", "Test"), t("题量与时长", "Questions and time"), t("数学范围", "Mathematics coverage"), t("当前单次考试费", "Current attempt price")],
        rows: [
          row([["OMPT-A", "OMPT-A"], ["52 题；120 分钟", "52 questions; 120 minutes"], ["数与代数、线性公式与方程、线性方程组、二次方程、函数、指数与对数、微分", "Numbers and algebra; linear formulae and equations; systems; quadratics; functions; exponentials and logarithms; differentiation"], ["€240", "€240"]], ["eu-ompt-home", "eu-ompt-a-syllabus", "eu-ompt-pricing"]),
          row([["OMPT-B", "OMPT-B"], ["64 题；150 分钟", "64 questions; 150 minutes"], ["A 的主要内容，另加三角函数与积分，微积分占比较高", "Most A topics, plus trigonometry and integration, with a heavier calculus component"], ["€240", "€240"]], ["eu-ompt-home", "eu-ompt-b-syllabus", "eu-ompt-pricing"]),
          row([["OMPT-D", "OMPT-D"], ["21 题；180 分钟", "21 questions; 180 minutes"], ["二次方程、函数、指数与对数、微分、三角、几何、积分；题目更强调分析和应用", "Quadratics, functions, exponentials and logarithms, differentiation, trigonometry, geometry and integration, with greater emphasis on analysis and application"], ["€270", "€270"]], ["eu-ompt-home", "eu-ompt-d-syllabus", "eu-ompt-pricing"]),
        ],
        note: t("费用为 2026-08-05 官方价格。练习、模拟和快速批改另收费；每次正式考试须单独购买。", "Prices are those published on 2026-08-05. Practice, mock tests and fast grading cost extra; every live attempt is purchased separately."),
      }],
    },
    {
      id: "ompt-topic-weights",
      title: t("官方主题占比", "Official topic weights"),
      tables: [{
        columns: [t("考试", "Test"), t("主题占比", "Published topic weights")],
        rows: [
          row([["OMPT-A", "OMPT-A"], ["数 15%；代数 15%；线性公式、方程与方程组 18%；二次方程与函数 22%；指数与对数 10%；微分 20%", "Numbers 15%; algebra 15%; linear formulae, equations and systems 18%; quadratics and functions 22%; exponentials and logarithms 10%; differentiation 20%"]], ["eu-ompt-a-weight"]),
          row([["OMPT-B", "OMPT-B"], ["数 5%；代数 10%；线性与方程组 8%；二次与函数 10%；指数与对数 10%；三角 15%；微分 25%；积分 17%", "Numbers 5%; algebra 10%; linear work and systems 8%; quadratics and functions 10%; exponentials and logarithms 10%; trigonometry 15%; differentiation 25%; integration 17%"]], ["eu-ompt-b-weight"]),
          row([["OMPT-D", "OMPT-D"], ["函数、方程与不等式 30%；三角 15%；微分 20%；几何 20%；积分 15%", "Functions, equations and inequalities 30%; trigonometry 15%; differentiation 20%; geometry 20%; integration 15%"]], ["eu-ompt-d-weight"]),
        ],
      }],
    },
    {
      id: "ompt-registration-china",
      title: t("中国学生报名与考试", "Registration and testing from China"),
      bullets: [
        t("先在大学专业页确认 OMPT 类型、最低分、最后接受日期和可考次数；OMPT 的院校名单不能替代专业招生要求。", "First confirm the OMPT type, minimum score, last accepted date and attempt limit on the programme page; the OMPT institution list does not replace programme requirements."),
        t("通过 OMPT 专业选择器建立账户并购买对应年度产品，再进入 ProctorU 完成设备测试和预约。", "Use the OMPT programme selector to create an account and purchase the correct admissions-cycle product, then complete the ProctorU equipment check and booking."),
        t("身份证件必须为政府签发的带照片证件，姓名信息使用拉丁字母。中国考生通常以护照最稳妥。", "The photo ID must be government-issued and use the Latin alphabet. A passport is normally the clearest option for candidates in China."),
        t("考试时间由考生预约，但应把常规 8 个工作日出分、大学材料截止日和可能的重考时间一并倒排。", "The appointment is flexible, but candidates should work backwards from the university deadline, allowing eight business days for regular grading and time for any permitted retake."),
      ],
    },
    {
      id: "ompt-test-day",
      title: t("考试当天规则", "Test-day rules"),
      tables: [{
        columns: [t("项目", "Item"), t("要求", "Requirement")],
        rows: [
          row([["设备", "Equipment"], ["电脑或笔记本、摄像头、麦克风、扬声器和稳定高速网络；不得用手机热点或第二显示器。", "Computer or laptop, webcam, microphone, speakers and stable high-speed internet; mobile hotspots and secondary monitors are not permitted."]], ["eu-ompt-rules"]),
          row([["允许物品", "Permitted items"], ["最多 3 张 A4 草稿纸、3 支铅笔、橡皮及考试内置 OMPT 计算器。", "Up to three A4 sheets of scratch paper, three pencils, an eraser and the built-in OMPT calculator."]], ["eu-ompt-rules"]),
          row([["禁止事项", "Not permitted"], ["钢笔、耳机、手表、食物、未经允许的程序或资料；考试期间不得离席或休息。", "Pens, headphones, watches, food, unauthorised software or materials; no breaks or leaving the desk during the test."]], ["eu-ompt-rules"]),
          row([["改期／取消", "Rescheduling or cancellation"], ["官方规则列明 €50 管理费；以账户结算页面为准。", "The rules list a €50 administration fee; confirm the charge in the account checkout."]], ["eu-ompt-rules"]),
        ],
      }],
    },
    {
      id: "ompt-materials",
      title: t("官方材料", "Official materials"),
      bullets: [
        t("A、B、D 均有公开考纲和主题占比页；这是确定复习范围的首要材料。", "A, B and D each have a public syllabus and topic-weight page; these are the primary sources for defining preparation scope."),
        t("官方练习材料和模拟考试为付费产品，含反馈或分主题结果；它们不是公开历年真题。", "Official practice materials and mock tests are paid products with feedback or topic results; they are not released past papers."),
        t("OMPT 不公开正式安全题库或历年实考试卷。本站只链接官方公开入口，不转载受保护试题。", "OMPT does not publish its secure operational item bank or past live forms. This site links only to official public access points and does not reproduce protected questions."),
      ],
    },
  ],
  sourceIds: europeAssessmentSources.filter((item) => item.id.startsWith("eu-ompt-")).map((item) => item.id),
  relatedIds: [],
  searchTerms: ["OMPT", "OMPT-A", "OMPT-B", "OMPT-D", "荷兰数学入学考试", "online mathematics admissions test", "ProctorU"],
};

const testasProject: ProjectRecord = {
  id: TESTAS_ID,
  slug: "testas-mathematics-computer-science-natural-sciences",
  track: "assessment",
  title: t("TestAS 数学相关部分（MCNS 模块）", "TestAS Mathematics-Related Content (MCNS Module)"),
  shortTitle: "TestAS Mathematics",
  organizer: t("g.a.s.t.／TestAS", "g.a.s.t. / TestAS"),
  summary: t(
    "TestAS 是德国高校面向国际本科申请人的学术能力测试。本页只整理 Core 中的数量推理，以及官方 MCNS 专业模块内与数学有关的公式、图表、模型和迁移能力。只有大学、预科或 APS 程序要求或使用 TestAS 时才参加；它不是所有德国本科申请人的统一必考。",
    "TestAS is an academic aptitude test used by German institutions for international undergraduate applicants. This page covers quantitative reasoning in the Core and only the mathematics-related formula, diagram, model and transfer skills within the official MCNS Subject Module. Take it only when a university, preparatory programme or APS procedure requires or uses it; it is not a universal German undergraduate test.",
  ),
  regions: ["Germany", "Worldwide test centres", "China / APS"],
  gradeBands: ["Grade 12", "Gap year", "International undergraduate applicant"],
  eligibilityTags: ["Only if institution or APS specifies", "International applicants", "APS China route"],
  formatTags: ["Licensed test centre", "Digital", "Paper-based", "English or German"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2026–2027 published dates",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("是否普遍必考", "Universal requirement", "否。大学决定是否要求、推荐或把成绩用于排名；专业模块也由目标专业要求决定。", "No. Each university decides whether TestAS is required, recommended or used for ranking, and which subject module applies.", ["eu-testas-general", "eu-testas-registration"]),
    fact("考试组合", "Required combination", "Core Module／Core Test 与一个专业模块必须同场、同语言完成；不能只考专业模块。", "The Core Module/Core Test and one Subject Module must be completed together in the same language; the subject module cannot be taken alone.", ["eu-testas-registration"]),
    fact("考试语言", "Language", "英文或德文；少数大学会指定语言。", "English or German; a small number of institutions specify the language.", ["eu-testas-digital-structure", "eu-testas-paper-structure"]),
    fact("考试地点", "Location", "授权 TestAS 考点；数字版也在考点电脑上完成，不是居家远程考试。", "A licensed TestAS centre; the digital version is also taken on a centre computer, not remotely at home.", ["eu-testas-digital-structure", "eu-testas-paper-structure"]),
    fact("费用", "Fee", "官方按国家分组定价，选择国家和场次后在报名系统显示；没有一个适用于全球的公开固定金额。", "The fee is country-group dependent and appears after the country and sitting are selected; there is no single public worldwide price.", ["eu-testas-general"]),
    fact("统一及格线", "Universal pass mark", "没有。大学自行决定最低分、权重或加分方式。", "None. Universities determine minimum scores, weighting or bonus treatment.", ["eu-testas-digital-score", "eu-testas-paper-score"]),
  ],
  dates: [
    { id: "testas-2026-10-24", label: t("TestAS 官方考试日", "Published TestAS date"), date: "2026-10-24", region: t("以实时考点列表为准", "Subject to the live centre list"), status: "confirmed", sourceIds: ["eu-testas-home", "eu-testas-dates"], note: t("具体考点、纸笔／数字形式及报名截止日以动态日历为准。", "The live calendar controls centres, paper/digital delivery and the registration deadline.") },
    { id: "testas-2026-11-26", label: t("TestAS 官方考试日", "Published TestAS date"), date: "2026-11-26", region: t("以实时考点列表为准", "Subject to the live centre list"), status: "confirmed", sourceIds: ["eu-testas-home", "eu-testas-dates"], note: t("具体考点、纸笔／数字形式及报名截止日以动态日历为准。", "The live calendar controls centres, paper/digital delivery and the registration deadline.") },
    { id: "testas-2027-02-25", label: t("TestAS 官方考试日", "Published TestAS date"), date: "2027-02-25", region: t("以实时考点列表为准", "Subject to the live centre list"), status: "confirmed", sourceIds: ["eu-testas-home", "eu-testas-dates"], note: t("具体考点、纸笔／数字形式及报名截止日以动态日历为准。", "The live calendar controls centres, paper/digital delivery and the registration deadline.") },
  ],
  sections: [
    {
      id: "testas-decision",
      title: t("适用条件与院校要求", "Applicability and institutional requirements"),
      tables: [{
        columns: [t("院校规定", "Institutional rule"), t("需要核对的内容", "What must be checked")],
        rows: [
          row([["大学招生简章明确要求", "The university call explicitly requires TestAS"], ["按简章选择纸笔或数字版、考试语言、MCNS 专业模块、最低分和最晚出分日期。", "Follow the call for paper or digital delivery, language, the MCNS module, minimum score and latest result date."]], ["eu-testas-registration", "eu-testas-dates"]),
          row([["大学写 accepted／optional／bonus", "The university says accepted, optional or bonus"], ["核对成绩如何换算、是否只看专业模块、是否有加分上限；不要把 optional 当作必考。", "Check conversion, whether the Subject Module is used and any bonus cap; do not treat optional as required."]], ["eu-testas-digital-score", "eu-testas-paper-score"]),
          row([["中国大陆 APS 程序", "Mainland-China APS procedure"], ["中国境内 TestAS 只能作为 APS China 程序的一部分参加，按 APS 通知报名；不能把全球普通报名流程直接套用到中国考点。", "In China, TestAS can only be taken as part of the APS China procedure. Register according to APS instructions rather than assuming ordinary worldwide booking is available at a Chinese centre."]], ["eu-testas-dates"]),
          row([["大学未提 TestAS", "The university does not mention TestAS"], ["先向招生办公室确认用途；TestAS 不能自动替代不满足的德国大学入学资格。", "Confirm its relevance with admissions first; TestAS does not automatically replace a missing German higher-education entrance qualification."]], ["eu-testas-general"]),
        ],
      }],
    },
    {
      id: "testas-format",
      title: t("纸笔版与数字版结构", "Paper-based and digital structures"),
      tables: [{
        columns: [t("形式", "Format"), t("Core", "Core"), t("MCNS 专业模块", "MCNS Subject Module"), t("作答规则", "Response rules")],
        rows: [
          row([["纸笔 TestAS", "Paper-based TestAS"], ["110 分钟；4 组各 22 题：数量问题 45 分钟、关系推断 10 分钟、图形补全 20 分钟另加 5 分钟说明、数列延续 25 分钟另加 5 分钟说明", "110 minutes; four groups of 22 items: Quantitative Problems 45 minutes, Inferring Relations 10, Completing Patterns 20 plus 5 minutes' instructions, Numerical Series 25 plus 5 minutes' instructions"], ["约 150 分钟；科学关系分析、形式化表示理解", "About 150 minutes; Analysing Scientific Interrelationships and Understanding Formal Depictions"], ["可在提供的草稿纸上记录；考试结束交回。", "Notes may be made on supplied paper and must be returned."]], ["eu-testas-paper-structure", "eu-testas-realisation"]),
          row([["数字 TestAS", "Digital TestAS"], ["约 90 分钟；图形序列、数学方程、拉丁方阵各 20 题、各 25 分钟，另含说明时间", "About 90 minutes; Figure Sequences, Mathematical Equations and Latin Squares, 20 items and 25 minutes each, plus instructions"], ["90 分钟；10–15 个 testlet，每个含 4–8 题", "90 minutes; 10–15 testlets with 4–8 questions each"], ["考点电脑作答；不得记笔记。", "Completed on a centre computer; note-taking is not permitted."]], ["eu-testas-digital-structure", "eu-testas-realisation"]),
        ],
        note: t("Core 与专业模块之间有 30 分钟休息。含签到和说明在内，纸笔版约 4.5 小时，数字版约 3.5 小时。", "There is a 30-minute break between the Core and Subject Module. Including administration and breaks, paper delivery is about 4.5 hours and digital delivery about 3.5 hours."),
      }],
    },
    {
      id: "testas-mcns-scope",
      title: t("MCNS 模块考什么", "What the MCNS module measures"),
      paragraphs: [
        t("TestAS 是学术能力测试，不是按高中章节逐项出题的课程考试。题目要求考生从文字、公式、图表、流程图或模型中提取信息，并把给定关系应用到新问题。", "TestAS is an academic aptitude test rather than a curriculum examination organised by school chapters. Tasks require candidates to extract information from text, formulae, diagrams, flow charts or models and apply the given relationships to new problems."),
      ],
      tables: [{
        columns: [t("形式", "Format"), t("官方说明", "Official framework")],
        rows: [
          row([["纸笔 MCNS", "Paper MCNS"], ["科学关系分析：识别变量、相关关系和结论；形式化表示理解：在文字、图形和流程表示之间转换并检验模型。", "Analysing Scientific Interrelationships: identify variables, relationships and conclusions. Understanding Formal Depictions: translate between verbal, graphical and flow representations and evaluate models."]], ["eu-testas-paper-structure"]),
          row([["数字 MCNS 的数学相关能力", "Mathematics-related skills in digital MCNS"], ["从 testlet 给出的文字、公式、图表和表格中提取数量关系，进行计算、解释模型，并把规则迁移到后续问题。官方没有发布逐章数学知识点清单。", "Extract quantitative relationships from the text, formulae, diagrams and tables supplied in a testlet; calculate, interpret models and transfer rules to follow-up questions. No chapter-by-chapter Mathematics checklist is published."]], ["eu-testas-digital-structure"]),
        ],
      }],
    },
    {
      id: "testas-scoring",
      title: t("成绩与院校分数线", "Scores and institutional cutoffs"),
      tables: [{
        columns: [t("形式", "Format"), t("成绩报告", "Score report"), t("如何使用", "How it is used")],
        rows: [
          row([["纸笔", "Paper-based"], ["Core 与专业模块分别报告 70–130 标准分和 1–100 百分位。", "Core and Subject Module each report a 70–130 standard score and a 1–100 percentile rank."], ["大学自行设最低分、排名或加分规则；TestAS 本身不设及格线。", "Universities set any minimum, ranking or bonus rule; TestAS itself sets no pass mark."]], ["eu-testas-paper-score"]),
          row([["数字", "Digital"], ["Core 与专业模块分别报告 0–200 TestAS Score 和 1–100 百分位；另有 0–400 总分。", "Core and Subject Module each report a 0–200 TestAS Score and a 1–100 percentile; an overall 0–400 score is also reported."], ["官方换算表可比较数字与纸笔成绩，但申请时仍以大学规定为准。", "The official conversion chart enables comparison with paper results, but the university's rule remains controlling."]], ["eu-testas-digital-score", "eu-testas-conversion"]),
        ],
      }],
      bullets: [
        t("数字版 100 为量尺中心；50–150 属官方所述平均范围，超过 150 表示高于平均。此说明不是大学录取线。", "On the digital scale, 100 is the centre; 50–150 is the published average range and above 150 is above average. This is not a university admission cutoff."),
        t("证书长期有效，但大学可以限制接受年份；Core 与专业模块不能从不同场次拼接。", "The certificate does not expire, but universities may restrict the accepted test age; Core and Subject Module results from different sittings cannot be combined."),
      ],
    },
    {
      id: "testas-registration-china",
      title: t("报名、出分与中国学生", "Registration, results and applicants in China"),
      bullets: [
        t("普通全球报名通过 TestAS 日期页选择日期、考点和形式；纸笔报名通常约在考前 5 周截止，数字版约在考前 1 周截止，具体以场次为准。", "Ordinary worldwide registration begins from the date page by selecting a date, centre and format. Paper registration normally closes about five weeks before the test and digital registration about one week before; the sitting listing is authoritative."),
        t("纸笔成绩通常约 4 周后公布，数字成绩约 3 周后公布；应在大学材料截止日前留足时间。", "Paper results normally take about four weeks and digital results about three weeks; allow sufficient time before the university document deadline."),
        t("中国境内参加者走 APS China 专门程序。若目标大学要求 TestAS、但学生不属于可在中国参加的 APS 路线，应向 TestAS 和大学确认可用的境外考点，而不是假设可居家远程参加。", "Test takers in China use the dedicated APS China procedure. If a target institution requires TestAS but the applicant is outside the applicable APS route, confirm an overseas centre with TestAS and the university rather than assuming remote home delivery."),
      ],
    },
    {
      id: "testas-materials",
      title: t("官方样题与练习", "Official samples and practice"),
      bullets: [
        t("数字版官方备考 PDF 含 Core 和 MCNS 样题、说明与解析；完成报名后还可在考生门户使用演示版。", "The official digital preparation PDF contains Core and MCNS sample tasks, instructions and solutions; registered candidates also receive access to a demo in the participant portal."),
        t("纸笔版官方英文样题册覆盖 Core 与 MCNS 题组，可用于按真实题型练习。", "The official English paper-based sample booklet covers the Core and MCNS task groups and is suitable for format-specific practice."),
        t("正式试卷属于安全材料，不设公开历年真题库。官方样题是首要练习来源。", "Operational forms are secure and there is no public archive of past live papers. Official samples are the primary preparation source."),
      ],
    },
  ],
  sourceIds: europeAssessmentSources.filter((item) => item.id.startsWith("eu-testas-")).map((item) => item.id),
  relatedIds: [],
  searchTerms: ["TestAS", "TestAS MCNS", "Mathematics Computer Science Natural Sciences", "德国本科入学考试", "APS TestAS", "数字 TestAS", "纸笔 TestAS"],
};

const cisiaProject: ProjectRecord = {
  id: CISIA_ID,
  slug: "cisia-tolc-i-cent-s",
  track: "assessment",
  title: t("CISIA 数学入学测试：TOLC-I 与 CEnT-S", "CISIA Mathematics Admissions Tests: TOLC-I and CEnT-S"),
  shortTitle: "TOLC-I / CEnT-S",
  organizer: t("CISIA", "CISIA"),
  summary: t(
    "意大利大学按专业招生简章指定 CISIA 测试。意大利语 TOLC-I 在 2026 年仍用于部分工程及技术、科学专业；旧 English TOLC-I 自 2025 年 11 月起被统一的 CEnT-S 取代。两者结构、数学题量、费用、重考周期和成绩报告不同，不能自行互换。",
    "Italian universities specify the relevant CISIA test in each programme call. Italian-language TOLC-I remains in use in 2026 for some engineering, technical and scientific programmes; the former English TOLC-I was replaced by the unified CEnT-S from November 2025. Their structures, mathematics sections, fees, retake cycles and results differ and are not interchangeable unless the call says so.",
  ),
  regions: ["Italy", "Remote where offered", "China"],
  gradeBands: ["Grade 12", "Gap year", "International undergraduate applicant"],
  eligibilityTags: ["Only if programme call specifies", "Italian-taught programme", "English-taught programme"],
  formatTags: ["TOLC@UNI", "TOLC@HOME", "CEnT@UNI", "CEnT@HOME", "Computer-based"],
  costBand: "low",
  status: "confirmed",
  cycle: "TOLC 2026; CEnT-S 1 November 2025–31 October 2026",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("是否普遍必考", "Universal requirement", "否。只有目标大学专业的当届 call for applications 指定 TOLC-I 或 CEnT-S 时才考。", "No. Take TOLC-I or CEnT-S only when the target programme's current call for applications specifies it.", ["eu-cisia-tolci", "eu-cisia-cent-structure", "eu-cisia-cent-booking"]),
    fact("2026 英语考试边界", "2026 English-test boundary", "旧 English TOLC-I／E／F 已自 2025 年 11 月起由 CEnT-S 取代；意大利语 TOLC-I 本身仍存在。", "The former English TOLC-I/E/F were replaced by CEnT-S from November 2025; Italian-language TOLC-I itself remains available.", ["eu-cisia-cent-overview", "eu-cisia-tolc-rules"]),
    fact("TOLC-I 费用", "TOLC-I fee", "2026 年每次 €35。", "€35 per attempt in 2026.", ["eu-cisia-tolc-rules", "eu-cisia-tolc-overview"]),
    fact("CEnT-S 费用", "CEnT-S fee", "每次 €55。", "€55 per attempt.", ["eu-cisia-cent-overview", "eu-cisia-cent-rules"]),
    fact("统一及格线", "Universal pass mark", "没有；大学专业分别规定最低总分、数学分、排名方式或补修义务 OFA。", "None; each programme sets any total or Mathematics minimum, ranking rule or OFA remedial obligation.", ["eu-cisia-tolci", "eu-cisia-cent-structure", "eu-cisia-cent-rules"]),
    fact("中国境内远程", "Remote testing from China", "只有日历中有 @HOME 场次且目标专业接受该形式时才可在中国远程参加；@UNI 必须到开考大学。", "Remote testing from China is possible only when an @HOME sitting is offered and the target programme accepts that format; @UNI requires attendance at the host university.", ["eu-cisia-cent-booking", "eu-cisia-cent-rules-pdf", "eu-cisia-tolc-overview"]),
  ],
  dates: [
    { id: "cent-s-2025-11-27", label: t("CEnT-S 第一宏周期", "CEnT-S first macro-period"), date: "2025-11-27", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"], note: t("14:15 起身份核验；是否实际开设及形式以可预约日历为准。", "Identification begins at 14:15; actual availability and format depend on the booking calendar.") },
    { id: "cent-s-2025-12-16", label: t("CEnT-S 第一宏周期", "CEnT-S first macro-period"), date: "2025-12-16", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-01-15", label: t("CEnT-S 第一宏周期", "CEnT-S first macro-period"), date: "2026-01-15", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-02-19", label: t("CEnT-S 第二宏周期", "CEnT-S second macro-period"), date: "2026-02-19", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-02-26", label: t("CEnT-S 第二宏周期", "CEnT-S second macro-period"), date: "2026-02-26", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-03-12", label: t("CEnT-S 第二宏周期", "CEnT-S second macro-period"), date: "2026-03-12", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-04-23", label: t("CEnT-S 第三宏周期", "CEnT-S third macro-period"), date: "2026-04-23", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-05-21", label: t("CEnT-S 第三宏周期", "CEnT-S third macro-period"), date: "2026-05-21", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-06-09", label: t("CEnT-S 第三宏周期", "CEnT-S third macro-period"), date: "2026-06-09", time: "14:15", timezone: "Europe/Rome", status: "historical", sourceIds: ["eu-cisia-cent-rules"] },
    { id: "cent-s-2026-09-17", label: t("CEnT-S 第四宏周期", "CEnT-S fourth macro-period"), date: "2026-09-17", time: "14:15", timezone: "Europe/Rome", status: "confirmed", sourceIds: ["eu-cisia-cent-rules"], note: t("正式标准化成绩最晚于 2026-10-30 发布。", "The final normalised score is released by 2026-10-30.") },
    { id: "cent-s-2026-10-15", label: t("CEnT-S 第四宏周期末场", "CEnT-S final date of fourth macro-period"), date: "2026-10-15", time: "14:15", timezone: "Europe/Rome", status: "confirmed", sourceIds: ["eu-cisia-cent-rules"], note: t("正式标准化成绩最晚于 2026-10-30 发布；以大学申请截止日是否允许等待该成绩为准。", "The final normalised score is released by 2026-10-30; confirm that the programme deadline allows this result date.") },
  ],
  sections: [
    {
      id: "cisia-boundary",
      title: t("TOLC-I、旧 English TOLC-I 与 CEnT-S", "TOLC-I, former English TOLC-I and CEnT-S"),
      tables: [{
        columns: [t("测试", "Test"), t("2026 状态", "2026 status"), t("适用场景", "Typical use"), t("结论", "Conclusion")],
        rows: [
          row([["TOLC-I", "TOLC-I"], ["继续提供", "Still offered"], ["用于部分意大利语授课本科专业；本页只整理其中数学部分。", "Used by some Italian-taught undergraduate programmes; this page covers only its Mathematics section."], ["只有专业简章指定 TOLC-I 时才报名。", "Book only when the programme call specifies TOLC-I."]], ["eu-cisia-tolci", "eu-cisia-tolc-rules"]),
          row([["English TOLC-I", "English TOLC-I"], ["旧考试，已被替代", "Legacy test, replaced"], ["历史英语版本；不再是新周期的现行考试。", "Historical English version; no longer the current test for new cycles."], ["自 2025 年 11 月起不应再按旧 English TOLC-I 准备新周期；旧考试只作历史参考，原 PDF 已从 CISIA 官网撤下。", "Do not prepare for a new-cycle sitting under the old English TOLC-I after November 2025. The former test is retained only as historical context, and CISIA has removed the old PDF."]], ["eu-cisia-cent-overview"]),
          row([["CEnT-S", "CEnT-S"], ["现行英语测试", "Current English test"], ["用于部分英语授课本科专业；本页只整理其中数学部分。", "Used by some English-taught undergraduate programmes; this page covers only its Mathematics section."], ["以专业简章指定的 CEnT-S 形式、有效期和分数规则为准。", "Follow the programme call for accepted CEnT-S format, validity and score rule."]], ["eu-cisia-cent-overview", "eu-cisia-cent-structure", "eu-cisia-cent-booking"]),
        ],
      }],
    },
    {
      id: "cisia-structures",
      title: t("考试结构", "Test structures"),
      tables: [{
        columns: [t("测试", "Test"), t("数学部分", "Mathematics section"), t("完整考试说明", "Complete-test note")],
        rows: [
          row([["TOLC-I", "TOLC-I"], ["20 题／50 分钟", "20 questions / 50 minutes"], ["完整考试还有其他独立计时部分；这里不展开。", "The complete test has additional separately timed sections, which are outside this Mathematics page."]], ["eu-cisia-tolci"]),
          row([["CEnT-S", "CEnT-S"], ["15 题／30 分钟", "15 questions / 30 minutes"], ["完整考试还有其他独立计时部分；这里不展开。", "The complete test has additional separately timed sections, which are outside this Mathematics page."]], ["eu-cisia-cent-structure"]),
        ],
        note: t("各部分独立计时；提前结束一部分后不能把剩余时间转给下一部分，也不能返回上一部分。", "Each section is separately timed. Unused time does not transfer, and a completed section cannot be reopened."),
      }],
    },
    {
      id: "cisia-math-scope",
      title: t("数学范围对照", "Mathematics scope comparison"),
      tables: [{
        columns: [t("范围", "Domain"), t("TOLC-I", "TOLC-I"), t("CEnT-S", "CEnT-S")],
        rows: [
          row([["数与代数", "Number and algebra"], ["整数、有理数、实数；绝对值、幂、根、对数与指数；多项式；一次、二次及可化简方程与不等式；方程组、分式与根式。", "Integers, rationals and reals; absolute value, powers, roots, logarithms and exponentials; polynomials; linear, quadratic and reducible equations and inequalities; systems, rational and radical forms."], ["整数、有理数、实数的运算与排序；整除、因数与倍数；整数／有理指数幂；百分比变化；代数式、恒等式、不等式、因式分解、一次与二次方程／不等式及简单方程组。", "Operations and ordering on integers, rationals and reals; division, factors and multiples; integer/rational powers; percentages; expressions, identities, inequalities, factorisation, linear and quadratic equations/inequalities, and simple systems."]], ["eu-cisia-tolci", "eu-cisia-cent-structure"]),
          row([["几何与坐标", "Geometry and coordinates"], ["平面与立体图形、长度面积体积；直线、平面和轨迹；解析几何中的直线、圆、椭圆、抛物线。", "Plane and solid geometry, lengths, areas and volumes; lines, planes and loci; analytic geometry of lines, circles, ellipses and parabolas."], ["常见平面与空间图形、周长面积体积、相似；平面直角坐标、点距、直线斜率与交点、圆方程，以及用方程／不等式表示平面区域。", "Common plane and solid figures, perimeter, area, volume and similarity; Cartesian coordinates, distance, line slopes and intersections, circle equations, and regions represented by equations or inequalities."]], ["eu-cisia-tolci", "eu-cisia-cent-structure"]),
          row([["函数", "Functions"], ["函数概念；幂、对数、指数等初等函数的图像与性质；对数与指数方程／不等式。", "Function concept; graphs and properties of elementary power, logarithmic and exponential functions; logarithmic and exponential equations/inequalities."], ["函数、复合与反函数；图像判读和变换；幂、根式、一二次多项式、1/(ax+b)、绝对值、指数与不同底数对数函数。", "Functions, composition and inverse; interpreting and transforming graphs; power, root, linear/quadratic polynomial, 1/(ax+b), absolute-value, exponential and logarithmic functions."]], ["eu-cisia-tolci", "eu-cisia-cent-structure"]),
          row([["三角", "Trigonometry"], ["正弦、余弦、正切的图像与性质；和差、倍角、半角公式；三角方程／不等式和解三角形。", "Graphs and properties of sine, cosine and tangent; addition, subtraction, double- and half-angle formulae; trigonometric equations/inequalities and triangles."], ["官方 CEnT-S 数学考纲未单列三角模块。", "The official CEnT-S Mathematics syllabus does not list a separate trigonometry domain."]], ["eu-cisia-tolci", "eu-cisia-cent-structure"]),
          row([["组合、概率与统计", "Combinatorics, probability and statistics"], ["排列组合、均值、方差、频数；频数图和直方图。", "Permutations and combinations, mean, variance and frequency; frequency diagrams and histograms."], ["有限集合计数、排列组合；有限样本空间中的概率、互斥事件并、独立事件交；表格与图形、绝对／相对频数、均值中位数众数。", "Counting finite sets and permutations/combinations; probability on finite sample spaces, unions of disjoint events and intersections of independent events; tables and graphs, absolute/relative frequency, mean, median and mode."]], ["eu-cisia-tolci", "eu-cisia-cent-structure"]),
        ],
      }],
    },
    {
      id: "cisia-scoring",
      title: t("计分与成绩线", "Scoring and cutoffs"),
      tables: [{
        columns: [t("测试", "Test"), t("原始计分", "Raw scoring"), t("正式成绩", "Official result"), t("最低分", "Minimum score")],
        rows: [
          row([["TOLC-I", "TOLC-I"], ["答对 +1；空答 0；答错 −0.25。英语水平部分答错不倒扣。", "+1 correct, 0 blank, −0.25 incorrect. The English-proficiency section has no wrong-answer penalty."], ["结束后可查看总分和分部分成绩；@HOME 成绩按规则延后确认。", "Total and section scores are shown after completion, subject to the @HOME verification timeline."], ["大学自行规定，可能同时看总分和数学分。", "Set by the university, which may use both total and Mathematics scores."]], ["eu-cisia-tolci", "eu-cisia-tolc-overview"]),
          row([["CEnT-S", "CEnT-S"], ["答对 +1；空答 0；答错 −0.25。", "+1 correct, 0 blank, −0.25 incorrect."], ["考试后先见原始统计；CISIA 在宏周期结束后按试卷难度加标准化系数，形成正式标准化成绩。", "Raw response counts appear after the test; CISIA applies a difficulty normalisation coefficient after the macro-period to produce the official result."], ["大学自行规定；不同日期的原始分不能直接当作最终可比成绩。", "Set by the university; raw scores from different dates are not the final comparable result."]], ["eu-cisia-cent-structure", "eu-cisia-cent-rules"]),
        ],
      }],
    },
    {
      id: "cisia-booking-china",
      title: t("报名与中国学生", "Booking and applicants in China"),
      bullets: [
        t("先下载目标专业当届招生简章，确认测试名称、接受的 @UNI／@HOME 形式、最低总分或数学分、最晚考试日和大学申请入口。CISIA 报名不等于完成大学申请。", "Download the current programme call first and confirm the test name, accepted @UNI/@HOME format, any total or Mathematics minimum, latest test date and university application portal. A CISIA booking is not the university application."),
        t("在 CISIA Student Area 建号，从动态日历选择大学、日期和形式并付款。可选择不同于目标大学的主办校，但目标专业必须接受该测试及形式。", "Create a CISIA Student Area account, then choose the host university, date and format from the live calendar and pay. The host may differ from the target institution, but the target programme must accept that test and format."),
        t("@HOME 场次需上传有效证件、安装指定软件并按意大利时间参加身份核验；是否能从中国参加取决于实际开放场次和大学认可，不是常年固定服务。", "An @HOME sitting requires a valid ID upload, specified software and identification at the published Italian time. Availability from China depends on an open sitting and programme recognition; it is not a permanently guaranteed service."),
        t("TOLC 同一类型通常每个自然月最多一次；CEnT-S 每个宏周期最多一次。两者重考规则不同。", "The same TOLC type is normally available once per calendar month; CEnT-S is available once per macro-period. Their retake rules are different."),
      ],
    },
    {
      id: "cisia-materials",
      title: t("官方练习与真题情况", "Official practice and past-paper status"),
      bullets: [
        t("CISIA Practice Area 提供模拟、样题或带解析题目、Mentor 和免费 MOOC；需登录账户查看具体可用内容。", "The CISIA Practice Area provides simulations, sample or solved questions, Mentor tools and free MOOCs; sign-in is required to see the available materials."),
        t("CEnT-S 官方模拟按真实结构和时长设置，也可用于检查 @HOME 设备。", "Official CEnT-S simulations follow the real structure and timing and can also be used to check @HOME equipment."),
        t("CISIA 不提供可自由转载的完整历年正式卷库。旧 English TOLC-I 考纲只作历史边界说明，不应用来替代现行 CEnT-S 考纲。", "CISIA does not provide a freely reproducible archive of complete live forms. The former English TOLC-I syllabus is retained only to explain the historical boundary and does not replace the current CEnT-S syllabus."),
      ],
    },
  ],
  sourceIds: europeAssessmentSources.filter((item) => item.id.startsWith("eu-cisia-")).map((item) => item.id),
  relatedIds: [],
  searchTerms: ["CISIA", "TOLC-I", "English TOLC-I", "CEnT-S", "意大利工程入学考试", "TOLC at HOME", "CEnT at HOME"],
};

const ethProject: ProjectRecord = {
  id: ETH_ID,
  slug: "eth-zurich-entrance-examination",
  track: "assessment",
  title: t("ETH Zurich 本科入学考试：减免版与完整版", "ETH Zurich Bachelor Entrance Examination: Reduced and Comprehensive"),
  shortTitle: "ETH Entrance Exam",
  organizer: t("苏黎世联邦理工学院", "ETH Zurich"),
  summary: t(
    "ETH 只在审阅完整本科申请后，才在录取决定中通知申请人是否须参加减免版或完整版入学考试。申请人不能脱离申请自行报名。两种版本的数学要求相同，均含笔试 Part I、Part II 和口试；考试以德语在苏黎世线下举行。",
    "ETH decides only after reviewing a complete Bachelor application whether the applicant must take the reduced or comprehensive entrance examination. The exam cannot be booked independently of an application. Both versions use the same Mathematics requirements, including written Parts I and II and an oral examination, and are held in German in Zurich.",
  ),
  regions: ["Switzerland", "Zurich", "China / travel required"],
  gradeBands: ["Grade 12", "Gap year", "International undergraduate applicant"],
  eligibilityTags: ["Only after ETH admissions decision", "Non-Swiss certificate", "In-person only"],
  formatTags: ["Written", "Oral", "German", "ETH Main Building"],
  costBand: "high",
  status: "confirmed",
  cycle: "Autumn 2027 entry",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("谁决定是否考试", "Who decides whether the exam is required", "ETH 在收到完整 eApply 申请后决定免试、减免版或完整版；录取决定会写明。", "ETH decides examination-free admission, the reduced exam or the comprehensive exam after receiving a complete eApply application; the admissions decision states the outcome.", ["eu-eth-main", "eu-eth-admission"]),
    fact("可否自行报名", "Independent registration", "不可以。没有本科申请和录取决定，不得参加入学考试。", "No. Sitting the examination without a Bachelor application and admissions decision is not permitted.", ["eu-eth-main"]),
    fact("考试语言", "Language", "德语；须熟悉各科德语术语。", "German; candidates must know the relevant subject terminology in German.", ["eu-eth-main"]),
    fact("考试地点", "Location", "ETH Zurich Main Building，线下参加；中国无考点，也不提供远程考试。", "ETH Zurich Main Building, in person; there is no China centre or remote delivery.", ["eu-eth-main"]),
    fact("费用", "Fee", "减免版 CHF 550；完整版 CHF 800；在 eApply 注册时以信用卡支付。", "CHF 550 for the reduced exam and CHF 800 for the comprehensive exam, paid by credit card during eApply registration.", ["eu-eth-main"]),
    fact("重考", "Retake", "条例允许失败后重考一次；第二次失败为最终结果。", "The regulations allow one retake after failure; a second failure is final.", ["eu-eth-regulation"]),
  ],
  dates: [
    { id: "eth-2027-application-deadline", label: t("本科申请截止", "Bachelor application deadline"), date: "2026-03-31", status: "historical", sourceIds: ["eu-eth-main"], note: t("这是参加 2027 年 1 月入学考试并于 2027 年秋入学的前置申请截止日。", "This was the prerequisite application deadline for the January 2027 exam and Autumn 2027 entry.") },
    { id: "eth-2027-exam-registration", label: t("入学考试注册", "Entrance-exam registration"), date: "2026-09-15", endDate: "2026-10-15", status: "confirmed", sourceIds: ["eu-eth-main"], note: t("只能由已收到考试决定的申请人在 eApply 内完成；退考截止同为 10 月 15 日。", "Only applicants who have received an examination decision may register in eApply; the deregistration deadline is also 15 October.") },
    { id: "eth-2027-exam", label: t("ETH 入学考试", "ETH entrance examination"), date: "2027-01-18", endDate: "2027-01-28", region: t("ETH Zurich Main Building", "ETH Zurich Main Building"), status: "confirmed", sourceIds: ["eu-eth-main"], note: t("笔试在第一周周一至周三；口试从第一周周四持续至第二周周四，个人口试表约考前一周发送。", "Written papers are Monday–Wednesday of week one; oral examinations run from Thursday of week one to Thursday of week two, with individual schedules sent about one week before.") },
  ],
  sections: [
    {
      id: "eth-route",
      title: t("资格审核、申请与考试安排", "Eligibility review, application and examination arrangements"),
      tables: [{
        columns: [t("阶段", "Stage"), t("要求", "Requirement")],
        rows: [
          row([["入学条件", "Admission prerequisites"], ["申请年份的各国学历表只能用于预判，最终以 ETH 对完整材料的评估为准。", "The country table for the application year is preliminary guidance; ETH's assessment of the complete file is final."]], ["eu-eth-admission", "eu-eth-country-list"]),
          row([["eApply 申请", "eApply application"], ["本科申请期内提交完整材料；ETH 不在正式申请前对个人材料作最终判定。", "The complete file is submitted during the Bachelor application period; ETH does not issue a final individual assessment before formal application."]], ["eu-eth-main", "eu-eth-admission"]),
          row([["学校决定", "Institutional decision"], ["录取决定写明免试、减免版或完整版，并提供相应考试注册信息。", "The admission decision states examination-free admission, the reduced exam or the comprehensive exam and provides the relevant registration information."]], ["eu-eth-main"]),
          row([["通过后的入学学期", "Entry after passing"], ["2027 年 1 月通过考试者可于 2027 年 9 月开始所申请专业，仍须按 eApply 要求提交原件和语言证明。", "Candidates passing in January 2027 may begin the chosen programme in September 2027, subject to submitting originals and language evidence required in eApply."]], ["eu-eth-main"]),
        ],
      }],
    },
    {
      id: "eth-reduced-comprehensive",
      title: t("减免版与完整版", "Reduced and comprehensive versions"),
      bullets: [
        t("减免版和完整版的数学考纲、两场笔试与口试形式完全相同；差别在完整考试还包含多少非数学考核，本页不展开。", "The reduced and comprehensive versions use the same Mathematics syllabus, two written papers and oral format. They differ in the additional non-Mathematics assessment, which is outside this page."),
        t("数学在减免版总评中的权重为 2，在完整版第一组中的权重为 4。数学成绩由口试权重 1 与合并笔试成绩权重 2 形成。", "Mathematics has weight 2 in the reduced overall result and weight 4 in Group 1 of the comprehensive result. The Mathematics grade combines the oral with weight 1 and the written result with weight 2."),
        t("两种版本都按全科加权结果判定，不存在只凭数学单科通过入学考试的规则。完整限制条件见 ETH 考试条例。", "Both versions are passed on weighted results across the complete examination; Mathematics alone does not pass the entrance examination. See the ETH regulations for all conditions."),
        t("ETH 根据申请材料指定版本，申请人不能自行选择。瑞士成绩 6 为最高，4 为及格。", "ETH assigns the version from the application file; the applicant cannot choose. On the Swiss scale, 6 is highest and 4 is sufficient."),
      ],
    },
    {
      id: "eth-math-format",
      title: t("数学考试形式", "Mathematics examination format"),
      tables: [{
        columns: [t("部分", "Part"), t("时长", "Duration"), t("形式与评分", "Format and marking"), t("允许材料", "Permitted aids")],
        rows: [
          row([["笔试 Part I", "Written Part I"], ["60 分钟", "60 minutes"], ["约 12 道短题；可能为选择题或只填最终答案，主要按最终答案评分。", "About 12 short tasks, including multiple choice or final-answer items, marked principally on the final result."], ["不得使用任何辅助材料。", "No aids permitted."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["笔试 Part II", "Written Part II"], ["180 分钟", "180 minutes"], ["约 5 道较长题；须清楚写出推理和中间步骤，可给过程分并考虑后续误差。", "About five extended tasks; reasoning and intermediate steps must be shown, with method marks and consequential-error treatment."], ["仅限指定计算器和指定公式手册。", "Only the specified calculator and formulary."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus", "eu-eth-main"]),
          row([["口试", "Oral"], ["15 分钟", "15 minutes"], ["按完整数学范围提问。数学总评中口试权重 1，合并笔试成绩权重 2。", "Questions may cover the full Mathematics scope. In the final Mathematics grade, the oral has weight 1 and the combined written grade weight 2."], ["按当届口试通知。", "Follow the current oral-exam instructions."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus", "eu-eth-regulation"]),
        ],
      }],
    },
    {
      id: "eth-math-scope",
      title: t("数学考纲", "Mathematics syllabus"),
      tables: [{
        columns: [t("领域", "Domain"), t("官方范围中文整理", "Chinese rendering of official scope")],
        rows: [
          row([["集合与方程", "Sets and equations"], ["集合基础；至多三元的一次方程与方程组；一元二次方程；指数方程。", "Basic set theory; linear equations and systems with at most three unknowns; quadratic equations in one variable; exponential equations."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["函数与图像", "Functions and graphs"], ["幂、对数、指数、三角函数及其图像；多项式、有理函数和简单超越函数的图像、渐近线与对称；多项式乘除。", "Power, logarithmic, exponential and trigonometric functions and graphs; graphs, asymptotes and symmetry of polynomial, rational and simple transcendental functions; polynomial multiplication and division."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["三角与数列", "Trigonometry and sequences"], ["三角恒等式与三角方程；正弦、余弦定理解三角形；等差、等比数列与和；数学归纳法；数列收敛与级数极限。", "Trigonometric identities and equations; solving triangles with the sine and cosine rules; arithmetic and geometric sequences and sums; induction; convergence of sequences and limits of series."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["复数", "Complex numbers"], ["代数式与极坐标形式、复数运算和方程；高斯平面及用复数表示简单区域。", "Algebraic and polar forms, operations and equations; the Argand plane and simple regions expressed in complex notation."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["微积分与优化", "Calculus and optimisation"], ["导数概念和规则、极值与拐点；原函数、定积分、分部积分与换元；面积、简单立体的体积和表面积；带约束极值问题。", "Derivative concepts and rules, extrema and inflection points; antiderivatives, definite integrals, integration by parts and substitution; areas, volumes and surfaces of simple solids; constrained optimisation."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["平面、空间与向量几何", "Plane, solid and vector geometry"], ["平面轨迹及应用；空间几何和垂直关系；三维以内向量空间、点积、叉积、混合积、体积、参数式和坐标方程，以及特殊位置圆锥曲线。", "Plane loci and applications; solid geometry and perpendicularity; vector spaces up to dimension three, dot, cross and scalar triple products, volume, parametric and coordinate equations, and conics in special position."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["组合、概率与统计", "Combinatorics, probability and statistics"], ["组合计数；随机试验和概率；相依、独立、互补事件；加法、乘法与条件概率；树状图；随机变量、期望、标准差、二项与正态分布。", "Combinatorial counting; random experiments and probability; dependent, independent and complementary events; addition, multiplication and conditional probability; tree diagrams; random variables, expectation, standard deviation, binomial and normal distributions."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
        ],
      }],
    },
    {
      id: "eth-aids",
      title: t("允许的公式手册与计算器", "Permitted formularies and calculators"),
      bullets: [
        t("Part II 只允许 TI-30 eco RS、Casio FX-82 Solar 或 Casio FX-82 Solar II。考试前会检查型号。", "Part II permits only the TI-30 eco RS, Casio FX-82 Solar or Casio FX-82 Solar II. Models are checked before the examination."),
        t("允许的公式手册为 ETH 主页列出的《Formeln, Tabellen, Begriffe. Mathematik–Physik–Chemie》或英文《Formulae, Tables and Concepts》；旧版可用。", "The permitted formularies are the editions of Formeln, Tabellen, Begriffe. Mathematik–Physik–Chemie or the English Formulae, Tables and Concepts listed on the ETH page; previous editions are accepted."),
        t("公式手册不得有手写内容；可以用荧光笔标记和无文字索引贴。", "The formulary may contain no handwritten material; highlighting and unlabelled index tabs are permitted."),
      ],
    },
    {
      id: "eth-china",
      title: t("中国学生注意事项", "Notes for applicants from China"),
      bullets: [
        t("中国学历是否免试、考减免版或完整版，以申请年份各国条件表和个人录取决定为准。不要仅凭往年案例自行判断。", "Whether a Chinese qualification leads to examination-free admission, the reduced exam or the comprehensive exam depends on the country requirements for the application year and the individual admissions decision. Do not infer the outcome from prior cases alone."),
        t("考试只在苏黎世举行，需自行安排签证、交通和住宿。ETH 不提供中国考点或线上替代。", "The examination is held only in Zurich. Candidates arrange visas, travel and accommodation; ETH offers no China centre or online alternative."),
        t("备考材料和示例卷为德语。ETH 不提供考前课程或德语课程，语言准备须在报名前完成。", "Preparation documents and example papers are in German. ETH does not provide pre-exam or German courses, so language preparation must be completed independently."),
      ],
    },
  ],
  sourceIds: europeAssessmentSources.filter((item) => item.id.startsWith("eu-eth-")).map((item) => item.id),
  relatedIds: [],
  searchTerms: ["ETH Zurich entrance examination", "ETH Aufnahmeprüfung", "ETH 入学考试", "reduced entrance examination", "comprehensive entrance examination", "苏黎世联邦理工"],
};

const epflProject: ProjectRecord = {
  id: EPFL_ID,
  slug: "epfl-bachelor-entrance-examination",
  track: "assessment",
  title: t("EPFL 本科入学考试：减免版与完整版", "EPFL Bachelor Entrance Examination: Reduced and Full"),
  shortTitle: "EPFL Entrance Exam",
  organizer: t("洛桑联邦理工学院", "EPFL"),
  summary: t(
    "EPFL 本科入学考试目前只向规定资格持有人开放，包括非欧盟、非 EFTA、非英国国家的高中毕业证持有人。EPFL 审阅材料后决定考减免版还是完整版。数学分为 Mathématiques I（分析）和 Mathématiques II（解析几何与线性代数），均为法语线下笔试。",
    "EPFL's Bachelor entrance examination is currently open only to specified credential holders, including holders of upper-secondary certificates from countries outside the EU, EFTA and UK. EPFL determines the reduced or full version after reviewing the file. Mathematics comprises Mathématiques I (analysis) and Mathématiques II (analytic geometry and linear algebra), both in-person written papers in French.",
  ),
  regions: ["Switzerland", "Lausanne", "China / travel required"],
  gradeBands: ["Grade 12", "Gap year", "International undergraduate applicant"],
  eligibilityTags: ["Restricted eligibility", "Only for EPFL admission route", "In-person only"],
  formatTags: ["Written", "French", "Reduced or full", "Lausanne"],
  costBand: "high",
  status: "confirmed",
  cycle: "2027 examination session",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("是否普遍必考", "Universal requirement", "否。仅适用于符合 EPFL 当前考试资格、并选择该入学路线的申请人。", "No. It applies only to applicants who meet EPFL's current examination eligibility and use that admissions route.", ["eu-epfl-main", "eu-epfl-criteria"]),
    fact("版本决定", "Version assignment", "EPFL 根据申请人的中学课程与材料决定减免版或完整版，申请人不能自行选择。", "EPFL assigns the reduced or full examination from the applicant's secondary curriculum and file; the applicant cannot choose the version.", ["eu-epfl-main", "eu-epfl-program-2027"]),
    fact("考试语言", "Language", "法语。EPFL 另说明本科就读至少需 B2 法语，强烈建议 C1。", "French. EPFL separately states that B2 French is required for Bachelor study and C1 is strongly recommended.", ["eu-epfl-program-2027", "eu-epfl-criteria"]),
    fact("地点与远程", "Location and remote delivery", "在洛桑线下举行；中国无考点，也不提供远程考试。", "Held in person in Lausanne; there is no China centre or remote delivery.", ["eu-epfl-main", "eu-epfl-schedule-2027"]),
    fact("费用", "Fees", "外国高中毕业证持有人注册费 CHF 150，另缴减免版 CHF 550 或完整版 CHF 800。", "Holders of foreign school-leaving certificates pay a CHF 150 registration tax, plus CHF 550 for the reduced or CHF 800 for the full examination.", ["eu-epfl-main"]),
    fact("2027 报名日期", "2027 registration dates", "截至 2026-08-05 尚未公布；应持续查看考试主页。", "Not yet announced as of 2026-08-05; monitor the examination page.", ["eu-epfl-main"], "pending"),
    fact("重考", "Retake", "失败后最多再考一次；CMS 失败也计作一次入学考试失败。", "One retake is permitted after failure; failure in the CMS also counts as an entrance-examination failure.", ["eu-epfl-regulation", "eu-epfl-criteria"]),
  ],
  dates: [
    { id: "epfl-2027-science-exam", label: t("EPFL 科学科目考试", "EPFL scientific-subject examinations"), date: "2027-01-18", endDate: "2027-01-22", region: t("EPFL Lausanne", "EPFL Lausanne"), status: "confirmed", sourceIds: ["eu-epfl-main", "eu-epfl-program-2027", "eu-epfl-schedule-2027"], note: t("减免版只考第一模块；完整版申请人须先达到第一模块要求，方可在 2027 年 8 月参加第二模块。", "The reduced exam comprises Block 1 only. Full-exam candidates must first meet the Block 1 requirement before taking Block 2 in August 2027.") },
    { id: "epfl-2027-general-exam", label: t("EPFL 完整版第二模块", "EPFL full-exam Block 2"), date: "2027-08-01", endDate: "2027-09-30", region: t("EPFL Lausanne", "EPFL Lausanne"), status: "pending", sourceIds: ["eu-epfl-main", "eu-epfl-program-2027"], note: t("官网仅公布 2027 年 8—9 月；精确日期待公布。", "The official page gives August–September 2027 only; exact dates are pending.") },
  ],
  sections: [
    {
      id: "epfl-eligibility",
      title: t("当前考试资格", "Current examination eligibility"),
      bullets: [
        t("考试目前只向瑞士职业／专业 maturité 持有人，以及非欧盟、非 EFTA、非英国国家的高中毕业证持有人等官网列明人群开放。中国普通高中毕业证属于可申请考试评估的国家类别，但 EPFL 仍须审查个人材料。", "The examination is currently limited to holders of Swiss vocational/specialised maturité and holders of upper-secondary certificates from countries outside the EU, EFTA and UK, plus the other categories listed by EPFL. A Chinese school-leaving certificate falls within an eligible country category, but EPFL still assesses the individual file."),
        t("满足考试报名资格不等于已获本科录取；须在 EPFL 系统完成考试注册、提交材料并缴费。", "Eligibility to register for the examination is not Bachelor admission; the examination registration, file and payment must be completed through EPFL."),
        t("EPFL 明确不建议只凭普通高中课程直接应考；考试范围达到其 CMS／大学预备水平。", "EPFL explicitly discourages attempting the examination with upper-secondary study as the only preparation; the syllabus reaches its CMS/university-preparatory level."),
      ],
    },
    {
      id: "epfl-versions",
      title: t("减免版与完整版结构", "Reduced and full structures"),
      bullets: [
        t("减免版和完整版在第一模块都考 Mathématiques I 与 Mathématiques II，数学范围和形式相同。", "Both the reduced and full examinations include Mathématiques I and Mathématiques II in Block 1, with the same scope and format."),
        t("完整版还包含后续非数学考核；只有第一模块达到规定平均后才能进入。非数学科目不在本页展开。", "The full examination includes later non-Mathematics assessment and candidates proceed only after meeting the required Block 1 average. Non-Mathematics subjects are outside this page."),
        t("EPFL 根据申请材料决定版本，申请人不能自行选择减免版。", "EPFL assigns the version from the application file; applicants cannot elect the reduced examination."),
      ],
    },
    {
      id: "epfl-math-format",
      title: t("数学 I 与数学 II", "Mathematics I and II"),
      tables: [{
        columns: [t("试卷", "Paper"), t("时长", "Duration"), t("重点", "Focus"), t("允许材料", "Permitted materials")],
        rows: [
          row([["Mathématiques I", "Mathématiques I"], ["3 小时 30 分钟", "3 hours 30 minutes"], ["分析：初等代数、三角、数列、单变量实函数、复数和积分。", "Analysis: elementary algebra, trigonometry, sequences, real functions of one variable, complex numbers and integration."], ["考场发公式表；不得使用个人计算器或资料。", "A formula sheet is supplied; no personal calculator or documents are permitted."]], ["eu-epfl-program-2027"]),
          row([["Mathématiques II", "Mathématiques II"], ["3 小时 30 分钟", "3 hours 30 minutes"], ["解析几何与线性代数，包括证明、向量空间、线性映射、矩阵和特征值。", "Analytic geometry and linear algebra, including proof, vector spaces, linear maps, matrices and eigenvalues."], ["不得使用计算器或个人资料；必须自带三角板。", "No calculator or personal documents; candidates must bring their own set square."]], ["eu-epfl-program-2027"]),
        ],
      }],
    },
    {
      id: "epfl-math1-scope",
      title: t("数学 I：分析考纲", "Mathematics I: analysis syllabus"),
      tables: [{
        columns: [t("领域", "Domain"), t("官方范围中文整理", "Chinese rendering of official scope")],
        rows: [
          row([["初等代数", "Elementary algebra"], ["方程、不等式、绝对值和牛顿二项式。", "Equations, inequalities, absolute value and the Newton binomial."]], ["eu-epfl-program-2027"]),
          row([["三角", "Trigonometry"], ["直角三角形与任意三角形求解；三角函数及反函数；三角方程与不等式。", "Right and general triangles; trigonometric functions and inverses; trigonometric equations and inequalities."]], ["eu-epfl-program-2027"]),
          row([["数列", "Sequences"], ["数列极限；等差数列和等比数列。", "Limits of sequences; arithmetic and geometric sequences."]], ["eu-epfl-program-2027"]),
          row([["单变量实函数", "Real functions of one variable"], ["幂、指数、双曲函数及反函数；极限与未定式、等价无穷小；连续与连续延拓；导数、隐函数与参数函数求导；单调、极值、微分、线性近似与泰勒展开；函数和参数曲线的完整研究。", "Power, exponential and hyperbolic functions and inverses; limits, indeterminate forms and equivalent infinitesimals; continuity and continuous extension; derivatives including implicit and parametric differentiation; monotonicity, extrema, differentials, linear approximation and Taylor expansions; full study of functions and parametric curves."]], ["eu-epfl-program-2027"]),
          row([["复数", "Complex numbers"], ["代数式与三角形式、高斯平面中的平移／位似／旋转／相似、棣莫弗公式，以及实／复多项式和不可约因式分解。", "Algebraic and trigonometric forms; translations, homotheties, rotations and similarities in the Argand plane; de Moivre's formula; real/complex polynomials and irreducible factorisation."]], ["eu-epfl-program-2027"]),
          row([["积分", "Integration"], ["原函数、分部积分、换元和有理函数积分；平面面积、旋转体或已知截面立体体积、弧长与旋转曲面面积。", "Antiderivatives, integration by parts, substitution and rational-function integration; plane areas, volumes of revolution or known cross-section, arc lengths and surfaces of revolution."]], ["eu-epfl-program-2027"]),
        ],
      }],
    },
    {
      id: "epfl-math2-scope",
      title: t("数学 II：解析几何与线性代数考纲", "Mathematics II: analytic geometry and linear algebra syllabus"),
      tables: [{
        columns: [t("领域", "Domain"), t("官方范围中文整理", "Chinese rendering of official scope")],
        rows: [
          row([["三角形与向量", "Triangles and vectors"], ["三角形的特殊直线与点、勾股和泰勒斯定理；向量运算、点积、叉积与混合积。", "Special lines and points of a triangle, Pythagoras and Thales; vector operations, dot, cross and scalar triple products."]], ["eu-epfl-program-2027"]),
          row([["仿射与欧氏平面／空间", "Affine and Euclidean plane/space"], ["坐标系；向量式、法式、参数式与笛卡尔方程；相对位置与方向；正交坐标、角度和距离。", "Coordinate frames; vector, normal, parametric and Cartesian equations; relative positions and directions; orthonormal coordinates, angles and distances."]], ["eu-epfl-program-2027"]),
          row([["变换与圆锥曲线", "Transformations and conics"], ["平移、投影、对称、旋转；欧氏平面内圆锥曲线的一般式、标准式、无穷远点、化标准式、作图与特征要素。", "Translations, projections, symmetries and rotations; general and canonical forms of conics, points at infinity, reduction, representation and characteristic elements."]], ["eu-epfl-program-2027"]),
          row([["逻辑、集合与映射", "Logic, sets and maps"], ["命题连接词、否定与证明方法；子集、补集、并交、笛卡尔积、像与原像、单射／满射／双射。", "Logical connectives, negation and proof methods; subsets, complements, unions/intersections, Cartesian products, images/preimages, injections, surjections and bijections."]], ["eu-epfl-program-2027"]),
          row([["向量空间", "Vector spaces"], ["实向量空间、线性组合、子空间、线性相关与无关、生成集、基与维数、秩及线性方程组。", "Real vector spaces, linear combinations, subspaces, dependence and independence, spanning sets, bases and dimension, rank and linear systems."]], ["eu-epfl-program-2027"]),
          row([["线性映射与矩阵", "Linear maps and matrices"], ["像、核、秩、表示矩阵、矩阵乘法与映射复合、换基和行列式。", "Image, kernel, rank, representing matrices, matrix multiplication and composition, change of basis and determinants."]], ["eu-epfl-program-2027"]),
          row([["特征值与对角化", "Eigenvalues and diagonalisation"], ["特征值、特征向量、特征多项式、对角化判据，以及二维和三维中的系统研究与几何性质。", "Eigenvalues, eigenvectors, characteristic polynomials, diagonalisation criteria, and systematic/geometric analysis in dimensions two and three."]], ["eu-epfl-program-2027"]),
        ],
      }],
    },
    {
      id: "epfl-scoring",
      title: t("成绩与通过规则", "Grades and pass rules"),
      tables: [{
        columns: [t("项目", "Item"), t("规则", "Rule")],
        rows: [
          row([["计分", "Grades"], ["各科按 1–6 分、0.25 分一档；4 分以下为不及格。", "Subjects are graded from 1 to 6 in quarter-point increments; below 4 is insufficient."]], ["eu-epfl-regulation"]),
          row([["数学系数", "Mathematics coefficients"], ["数学 I：10；数学 II：8。第一模块总评还包含其他考核，完整系数见官方条例。", "Mathematics I: 10; Mathematics II: 8. Block 1 also includes other assessment; see the official regulation for the full coefficient table."]], ["eu-epfl-regulation"]),
          row([["减免版通过", "Reduced pass"], ["第一模块加权平均至少 4.0。", "Block 1 weighted average at least 4.0."]], ["eu-epfl-regulation"]),
          row([["完整版通过", "Full pass"], ["先达到进入第二模块的第一模块要求；两个模块全部完成后的总加权平均至少 4.0。", "First meet the Block 1 requirement to proceed; after both blocks, the overall weighted average must be at least 4.0."]], ["eu-epfl-program-2027", "eu-epfl-regulation"]),
        ],
        note: t("EPFL 不公布一条只看数学 I 或数学 II 的独立通用录取线；通过与否按规定系数计算整组成绩。", "EPFL does not publish a separate universal admission cutoff for Mathematics I or II alone; the prescribed weighted block result determines the outcome."),
      }],
    },
    {
      id: "epfl-china",
      title: t("中国学生报名与行程", "Registration and travel for applicants from China"),
      bullets: [
        t("通过法语考试注册入口提交材料并缴注册费；EPFL 审查后确定减免版或完整版。2027 报名日期尚待官网公布。", "Submit the file and registration tax through the French-language examination portal; EPFL then assigns the reduced or full exam. Registration dates for 2027 remain pending."),
        t("考试只在洛桑举行。需尽早办理申根签证、交通和住宿；EPFL 明确由考生承担签证安排，不能因签证未出自动延期。", "The examination is held only in Lausanne. Arrange the Schengen visa, travel and accommodation early; EPFL makes candidates responsible for visas and does not automatically defer the exam when a visa is delayed."),
        t("Mathématiques I 与 II 均为长时间法语书面解题。除数学知识外，应练习法语题干、论证表达和无个人计算器作答。", "Mathématiques I and II are long French written problem-solving papers. In addition to mathematics, practise French prompts, written reasoning and working without a personal calculator."),
      ],
    },
    {
      id: "epfl-materials",
      title: t("官方学习材料与真题情况", "Official learning materials and past-paper status"),
      bullets: [
        t("2027 科学科目考纲是唯一应作为范围依据的文件，末页附考试提供的数学公式表。", "The 2027 scientific-subject programme is the controlling syllabus document and includes the supplied Mathematics formula sheet at the end."),
        t("EPFL 官方 courseware 提供分析、线性代数和解析几何练习；另有三角、对数和指数函数课程。两者均为法语。", "EPFL courseware provides analysis, linear-algebra and analytic-geometry exercises, together with a separate course on trigonometric, logarithmic and exponential functions. Both are in French."),
        t("截至最后核验，EPFL 未在当前考试页提供按年份排列的完整正式真题库。官方练习可用于判断难度，但不应标为历年真题。", "At the last verification, EPFL did not provide a year-by-year archive of complete live papers on the current examination page. Official exercises indicate the expected level but should not be labelled as past papers."),
      ],
    },
  ],
  sourceIds: europeAssessmentSources.filter((item) => item.id.startsWith("eu-epfl-")).map((item) => item.id),
  relatedIds: [],
  searchTerms: ["EPFL entrance examination", "EPFL examen admission", "EPFL 入学考试", "Mathématiques I", "Mathématiques II", "洛桑联邦理工"],
};

export const europeAssessmentProjects: ProjectRecord[] = [
  omptProject,
  testasProject,
  cisiaProject,
  ethProject,
  epflProject,
];

export const europeAssessmentThresholds: ThresholdRecord[] = [
  {
    id: "ompt-2026-programme-cutoff",
    projectId: OMPT_ID,
    year: "2026/27",
    metric: t("最低分", "Minimum score"),
    value: "Institution-defined",
    status: "confirmed",
    sourceIds: ["eu-ompt-required", "eu-ompt-program-selector"],
    note: t("OMPT 不设适用于所有院校的统一及格线。必须按目标专业核对考试类型、最低百分比、有效周期和可考次数。", "OMPT sets no universal pass mark. Check the target programme for test type, minimum percentage, validity cycle and attempt limit."),
  },
  {
    id: "testas-2026-paper-scale",
    projectId: TESTAS_ID,
    year: "2026",
    sitting: "Paper-based",
    metric: t("标准分量尺", "Standard-score scale"),
    value: "70–130",
    maxScore: "130",
    status: "confirmed",
    sourceIds: ["eu-testas-paper-score"],
    note: t("Core 与专业模块分别报告；另报 1–100 百分位。量尺范围不是统一录取线。", "Reported separately for Core and Subject Module, alongside a 1–100 percentile. The scale range is not a universal cutoff."),
  },
  {
    id: "testas-2026-digital-scale",
    projectId: TESTAS_ID,
    year: "2026",
    sitting: "Digital",
    metric: t("TestAS Score 量尺", "TestAS Score scale"),
    value: "0–200 per module; 0–400 overall",
    maxScore: "400",
    status: "confirmed",
    sourceIds: ["eu-testas-digital-score", "eu-testas-conversion"],
    note: t("Core 与专业模块各为 0–200，并另报总分和百分位。大学自行决定最低分或排名用途。", "Core and Subject Module are each 0–200, with an overall score and percentiles also reported. Universities determine any minimum or ranking use."),
  },
  {
    id: "testas-2026-cutoff",
    projectId: TESTAS_ID,
    year: "2026",
    metric: t("统一及格线", "Universal pass mark"),
    value: "None",
    status: "confirmed",
    sourceIds: ["eu-testas-digital-score", "eu-testas-paper-score"],
    note: t("应记录每所目标大学当届简章中的最低分、加分或排名规则，不能用第三方所谓“及格线”代替。", "Record each target university's current minimum, bonus or ranking rule; do not substitute a third-party 'pass mark'."),
  },
  {
    id: "tolci-2026-raw-score",
    projectId: CISIA_ID,
    year: "2026",
    sitting: "TOLC-I",
    metric: t("数学原始分计分", "Mathematics raw scoring"),
    value: "+1 / 0 / −0.25",
    maxScore: "20",
    status: "confirmed",
    sourceIds: ["eu-cisia-tolci"],
    note: t("答对、空答、答错分别为 +1、0、−0.25；数学满分 20。大学自行决定是否设数学最低分。", "Correct, blank and incorrect responses score +1, 0 and −0.25; Mathematics has a maximum raw score of 20. Universities decide whether to set a Mathematics minimum."),
  },
  {
    id: "cent-s-2026-raw-score",
    projectId: CISIA_ID,
    year: "2025/26",
    sitting: "CEnT-S",
    metric: t("原始分计分", "Raw scoring"),
    value: "+1 / 0 / −0.25",
    maxScore: "55",
    status: "confirmed",
    sourceIds: ["eu-cisia-cent-structure", "eu-cisia-cent-rules"],
    note: t("数学部分原始满分 15。正式结果在宏周期结束后加入难度标准化系数；院校再制定最低分或排名规则。", "Mathematics has a maximum raw score of 15. The official result adds a difficulty normalisation coefficient after the macro-period; institutions then set minimum or ranking rules."),
  },
  {
    id: "eth-2027-reduced-pass",
    projectId: ETH_ID,
    year: "2027",
    sitting: "Reduced examination",
    metric: t("通过规则", "Pass rule"),
    value: "Weighted average ≥ 4.0",
    maxScore: "6",
    status: "confirmed",
    sourceIds: ["eu-eth-regulation"],
    note: t("数学权重 2；通过按完整考试加权结果判定，并另有低分科目限制，完整规则见 ETH 考试条例。", "Mathematics has weight 2. Passing is based on the weighted complete examination and is also subject to low-grade restrictions; see the ETH regulation for the full rule."),
  },
  {
    id: "eth-2027-comprehensive-pass",
    projectId: ETH_ID,
    year: "2027",
    sitting: "Comprehensive examination",
    metric: t("通过规则", "Pass rule"),
    value: "Overall and Group 1 weighted averages ≥ 4.0",
    maxScore: "6",
    status: "confirmed",
    sourceIds: ["eu-eth-regulation"],
    note: t("数学权重 4；通过同时看完整考试与第一组加权平均，并另有低分限制，完整规则见 ETH 考试条例。", "Mathematics has weight 4. Passing uses both the complete-examination and Group 1 weighted averages and is subject to additional low-grade restrictions; see the ETH regulation for the full rule."),
  },
  {
    id: "epfl-2027-reduced-pass",
    projectId: EPFL_ID,
    year: "2027",
    sitting: "Reduced examination / Block 1",
    metric: t("通过规则", "Pass rule"),
    value: "Block 1 weighted average ≥ 4.0",
    maxScore: "6",
    status: "confirmed",
    sourceIds: ["eu-epfl-regulation"],
    note: t("数学 I 系数 10、数学 II 系数 8；不是分别达到 4 即可，按第一模块全科加权平均计算。", "Mathematics I has coefficient 10 and Mathematics II coefficient 8. Passing is based on the full Block 1 weighted average, not simply a separate 4 in each Mathematics paper."),
  },
  {
    id: "epfl-2027-full-pass",
    projectId: EPFL_ID,
    year: "2027",
    sitting: "Full examination",
    metric: t("通过规则", "Pass rule"),
    value: "Overall weighted average ≥ 4.0",
    maxScore: "6",
    status: "confirmed",
    sourceIds: ["eu-epfl-program-2027", "eu-epfl-regulation"],
    note: t("只有第一模块达到规定平均后才能进入第二模块；完成两模块后按全部科目系数计算总平均。", "Candidates proceed to Block 2 only after meeting the required Block 1 average; the final result uses the coefficients across both blocks."),
  },
];

const omptSyllabus = (
  id: string,
  slug: string,
  test: "A" | "B" | "D",
  applicableCycle: string,
  sourceId: string,
  sourceUrl: string,
  factValues: Array<[string, string, string, string]>,
  rows: TableRow[],
): AssessmentSyllabusRecord => ({
  id,
  slug,
  projectId: OMPT_ID,
  classification: "formal-specification",
  title: t(`OMPT-${test} 数学考纲中文整理`, `OMPT-${test} Mathematics Syllabus`),
  officialName: t(`OMPT-${test} Syllabus`, `OMPT-${test} Syllabus`),
  applicableCycle: t(applicableCycle, applicableCycle),
  status: "confirmed",
  summary: t(
    `按 OMPT-${test} 官方逐项考纲整理。下表用于快速定位范围；官方页面的完整条目及其后续更新具有优先效力。`,
    `Organised from the official itemised OMPT-${test} syllabus. The table is a navigational summary; the complete official list and any later revisions take priority.`,
  ),
  facts: factValues.map(([labelZh, labelEn, valueZh, valueEn]) => fact(labelZh, labelEn, valueZh, valueEn, [sourceId])),
  sections: [{
    id: `ompt-${test.toLowerCase()}-domains`,
    title: t("数学内容", "Mathematics content"),
    tables: [{
      columns: [t("领域", "Domain"), t("中文范围", "Chinese scope"), t("Official scope", "Official scope")],
      rows,
      note: t("具体小节、符号和例题以官方考纲页为准。", "Use the official syllabus page for the complete subtopic list, notation and examples."),
    }],
  }],
  sources: [syllabusSource(`OMPT-${test} 官方考纲`, `OMPT-${test} official syllabus`, "OMPT", "OMPT", sourceUrl, "webpage", applicableCycle, applicableCycle)],
  translationNote: t("中文为本站依据英文官方考纲所作的范围翻译，不取代 OMPT 原文。", "The Chinese text is this site's translation of the official English scope and does not replace the OMPT original."),
  lastVerified: VERIFIED_AT,
});

const omptASyllabus = omptSyllabus(
  "syllabus-ompt-a",
  "ompt-a-syllabus",
  "A",
  "Current 2025/26 product",
  "eu-ompt-a-syllabus",
  "https://www.omptest.org/tests/ompt-a/syllabus",
  [
    ["题量", "Questions", "52 题", "52 questions"],
    ["时长", "Duration", "120 分钟", "120 minutes"],
    ["官方主题条目", "Official topic entries", "176 项", "176 entries"],
    ["建议学习时间", "Recommended study time", "约 80 小时", "About 80 hours"],
  ],
  [
    row([["数", "Numbers"], ["数的类别与运算、分数与小数、百分数、比例、幂与根、运算顺序及数值表达。", "Number sets and operations, fractions and decimals, percentages, ratios, powers and roots, order of operations and numerical expressions."], ["Numbers", "Numbers"]], ["eu-ompt-a-syllabus"]),
    row([["代数", "Algebra"], ["代数式的读写、化简、展开与因式分解；分式代数式及代入。", "Reading, simplifying, expanding and factorising algebraic expressions; algebraic fractions and substitution."], ["Algebra", "Algebra"]], ["eu-ompt-a-syllabus"]),
    row([["线性公式与方程", "Linear formulae and equations"], ["一次方程、公式变形、比例关系、直线公式与应用题建模。", "Linear equations, rearranging formulae, proportional relationships, straight-line formulae and modelling word problems."], ["Linear formulas and equations", "Linear formulas and equations"]], ["eu-ompt-a-syllabus"]),
    row([["线性方程组", "Systems of linear equations"], ["二元线性方程组的代数和图像解法及实际问题。", "Algebraic and graphical solution of two-variable linear systems and applications."], ["Systems of linear equations", "Systems of linear equations"]], ["eu-ompt-a-syllabus"]),
    row([["二次方程", "Quadratic equations"], ["二次式展开与因式分解、二次方程的求解与图像联系。", "Expansion and factorisation of quadratics, solving quadratic equations and links to graphs."], ["Quadratic equations", "Quadratic equations"]], ["eu-ompt-a-syllabus"]),
    row([["函数", "Functions"], ["函数表示、公式、表格和图像；定义域、值域、图像变换及常见函数性质。", "Function notation and representations by formula, table and graph; domain, range, graph transformations and properties of common functions."], ["Functions", "Functions"]], ["eu-ompt-a-syllabus"]),
    row([["指数与对数", "Exponentials and logarithms"], ["指数与对数定义和运算律、指数／对数函数及基础方程。", "Definitions and laws of exponents and logarithms, exponential/logarithmic functions and basic equations."], ["Exponential functions and logarithms", "Exponential functions and logarithms"]], ["eu-ompt-a-syllabus"]),
    row([["微分", "Differentiation"], ["导数概念、基本求导规则、切线与变化率、单调性、极值及简单优化。", "Derivative concepts, basic rules, tangents and rates of change, monotonicity, extrema and elementary optimisation."], ["Differentiation", "Differentiation"]], ["eu-ompt-a-syllabus"]),
  ],
);

const omptBSyllabus = omptSyllabus(
  "syllabus-ompt-b",
  "ompt-b-syllabus",
  "B",
  "Current 2025/26 product",
  "eu-ompt-b-syllabus",
  "https://www.omptest.org/tests/ompt-b/syllabus",
  [
    ["题量", "Questions", "64 题", "64 questions"],
    ["时长", "Duration", "150 分钟", "150 minutes"],
    ["官方主题条目", "Official topic entries", "226 项", "226 entries"],
    ["建议学习时间", "Recommended study time", "约 100 小时", "About 100 hours"],
  ],
  [
    row([["数与代数", "Numbers and algebra"], ["数的运算、分数百分数与比例、幂根；代数式化简、展开、因式分解和分式。", "Number operations, fractions, percentages and ratios, powers and roots; simplifying, expanding and factorising expressions and algebraic fractions."], ["Numbers; Algebra", "Numbers; Algebra"]], ["eu-ompt-b-syllabus"]),
    row([["线性公式、方程与方程组", "Linear formulae, equations and systems"], ["公式变形、线性关系、直线图像、一次方程及二元方程组的代数／图像解法。", "Rearranging formulae, linear relationships, straight-line graphs, linear equations and algebraic/graphical solution of two-variable systems."], ["Linear formulas and equations; Systems of linear equations", "Linear formulas and equations; Systems of linear equations"]], ["eu-ompt-b-syllabus"]),
    row([["二次方程与函数", "Quadratics and functions"], ["二次式与二次方程；函数表示、定义域和值域、图像和变换、函数的组合应用。", "Quadratic expressions and equations; function representations, domain and range, graphs and transformations, and combined applications."], ["Quadratic equations; Functions", "Quadratic equations; Functions"]], ["eu-ompt-b-syllabus"]),
    row([["指数与对数", "Exponentials and logarithms"], ["运算律、函数图像、指数增长／衰减及指数或对数方程。", "Laws, graphs, exponential growth/decay and exponential or logarithmic equations."], ["Exponential functions and logarithms", "Exponential functions and logarithms"]], ["eu-ompt-b-syllabus"]),
    row([["三角", "Trigonometry"], ["弧度、三角函数与图像、恒等式、三角方程以及三角关系的应用。", "Radians, trigonometric functions and graphs, identities, trigonometric equations and applications of trigonometric relationships."], ["Trigonometry", "Trigonometry"]], ["eu-ompt-b-syllabus"]),
    row([["微分", "Differentiation"], ["求导规则、切线与法线、变化率、函数分析、极值和优化。", "Differentiation rules, tangents and normals, rates of change, curve analysis, extrema and optimisation."], ["Differentiation", "Differentiation"]], ["eu-ompt-b-syllabus"]),
    row([["积分", "Integration"], ["原函数与不定积分、定积分、曲线下面积及微积分基本应用。", "Antiderivatives and indefinite integrals, definite integrals, area under curves and basic applications of integration."], ["Integration", "Integration"]], ["eu-ompt-b-syllabus"]),
  ],
);

const omptDSyllabus = omptSyllabus(
  "syllabus-ompt-d",
  "ompt-d-syllabus",
  "D",
  "Current 2025/26 product",
  "eu-ompt-d-syllabus",
  "https://www.omptest.org/tests/ompt-d/syllabus",
  [
    ["题量", "Questions", "21 题", "21 questions"],
    ["时长", "Duration", "180 分钟", "180 minutes"],
    ["作答特点", "Task emphasis", "较少但更长的分析与应用题", "Fewer, longer analysis and application tasks"],
  ],
  [
    row([["二次方程", "Quadratic equations"], ["二次式、方程和不等式的代数处理、根与图像。", "Algebraic treatment of quadratic expressions, equations and inequalities, roots and graphs."], ["Quadratic equations", "Quadratic equations"]], ["eu-ompt-d-syllabus"]),
    row([["函数、方程与不等式", "Functions, equations and inequalities"], ["函数表示、定义域和值域、复合与反函数、图像变换，以及代数／图像方式求解方程和不等式。", "Function representation, domain and range, composition and inverses, graph transformations, and algebraic/graphical solution of equations and inequalities."], ["Functions", "Functions"]], ["eu-ompt-d-syllabus"]),
    row([["指数与对数", "Exponentials and logarithms"], ["指数／对数函数、运算律、方程、不等式及增长模型。", "Exponential/logarithmic functions, laws, equations, inequalities and growth models."], ["Exponential functions and logarithms", "Exponential functions and logarithms"]], ["eu-ompt-d-syllabus"]),
    row([["三角", "Trigonometry"], ["弧度、三角函数与图像、恒等式、方程和三角关系应用。", "Radians, trigonometric functions and graphs, identities, equations and applications."], ["Trigonometry", "Trigonometry"]], ["eu-ompt-d-syllabus"]),
    row([["几何", "Geometry"], ["平面与坐标几何、长度角度面积关系，以及几何条件的代数表达和应用。", "Plane and coordinate geometry, relationships among lengths, angles and areas, and algebraic representation and application of geometric conditions."], ["Geometry", "Geometry"]], ["eu-ompt-d-syllabus"]),
    row([["微分", "Differentiation"], ["求导规则、切线和法线、变化率、函数研究、极值和实际优化。", "Differentiation rules, tangents and normals, rates of change, curve analysis, extrema and applied optimisation."], ["Differentiation", "Differentiation"]], ["eu-ompt-d-syllabus"]),
    row([["积分", "Integration"], ["原函数、定积分、面积与其他应用；须把积分方法用于较长问题。", "Antiderivatives, definite integrals, area and other applications, including integration within extended problems."], ["Integration", "Integration"]], ["eu-ompt-d-syllabus"]),
  ],
);

const testasSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-testas-mcns",
  slug: "testas-mcns-framework",
  projectId: TESTAS_ID,
  classification: "content-framework",
  title: t("TestAS 数学推理与 MCNS 模块框架", "TestAS Mathematical Reasoning and MCNS Framework"),
  officialName: t("TestAS Core 与 Mathematics, Computer Science and Natural Sciences Subject Module", "TestAS Core and Mathematics, Computer Science and Natural Sciences Subject Module"),
  applicableCycle: t("现行纸笔版与数字版", "Current paper-based and digital formats"),
  status: "confirmed",
  summary: t("TestAS 官方发布的是能力与题型框架，而不是逐章知识点考纲。下表只整理与数学有关的 Core 题型和 MCNS 模块要求。", "TestAS publishes an aptitude and task framework rather than a chapter-by-chapter curriculum syllabus. This record covers only mathematics-related Core tasks and the MCNS requirements."),
  facts: [
    fact("考试性质", "Assessment type", "学术能力、应用与迁移测试，不是高中数学课程统考", "Academic aptitude, application and transfer assessment rather than a school mathematics curriculum exam", ["eu-testas-general", "eu-testas-digital-structure", "eu-testas-paper-structure"]),
    fact("组成", "Components", "Core 与 MCNS 专业模块必须同场、同语言完成", "Core and MCNS Subject Module must be taken together in the same language", ["eu-testas-registration"]),
  ],
  sections: [
    {
      id: "testas-core-math-framework",
      title: t("Core 中的数学与数量推理", "Mathematics and quantitative reasoning in the Core"),
      tables: [{
        columns: [t("形式", "Format"), t("题组", "Task group"), t("能力要求", "What is assessed")],
        rows: [
          row([["纸笔", "Paper"], ["Solving Quantitative Problems", "Solving Quantitative Problems"], ["用基本算术处理实际文字问题并建立数量关系。", "Use elementary arithmetic to solve practical word problems and formulate quantitative relationships."]], ["eu-testas-paper-structure"]),
          row([["纸笔", "Paper"], ["Continuing Numerical Series", "Continuing Numerical Series"], ["识别由四则运算构成的数列规律并继续序列。", "Identify numerical patterns based on basic arithmetic and continue the sequence."]], ["eu-testas-paper-structure"]),
          row([["数字", "Digital"], ["Mathematical Equations", "Mathematical Equations"], ["在多条约束下解字母代表 1–20 整数的方程组；每组变量只有一组满足全部条件的取值。", "Solve constrained systems in which letters represent integers from 1 to 20 and only one assignment satisfies all equations."]], ["eu-testas-digital-structure"]),
          row([["数字", "Digital"], ["Latin Squares", "Latin Squares"], ["依据每行每列字符不重复规则进行演绎推理。", "Apply row-and-column uniqueness constraints in deductive reasoning tasks."]], ["eu-testas-digital-structure"]),
        ],
      }],
    },
    {
      id: "testas-mcns-framework",
      title: t("MCNS 专业模块", "MCNS Subject Module"),
      tables: [{
        columns: [t("形式", "Format"), t("官方框架", "Official framework")],
        rows: [
          row([["纸笔", "Paper"], ["科学关系分析：从科学事实、变量、图表和给定信息中识别关系并得出结论；形式化表示理解：在文字、图形、模型或流程图之间转换和检验。", "Analysing Scientific Interrelationships: identify relationships and conclusions from scientific facts, variables, diagrams and supplied information. Understanding Formal Depictions: translate between and evaluate text, graphics, models and flow charts."]], ["eu-testas-paper-structure"]),
          row([["数字", "Digital"], ["数学相关题目以 testlet 呈现：先给文字、公式、图表或表格，再设置 4–8 道理解、计算、模型解释和迁移题。官方只说明须能处理公式和图表，并未发布逐章数学知识清单。", "Mathematics-related material appears in testlets: text, formulae, diagrams or tables are followed by 4–8 comprehension, calculation, model-interpretation and transfer questions. The official framework requires work with formulae and diagrams but publishes no chapter-by-chapter Mathematics checklist."]], ["eu-testas-digital-structure"]),
        ],
      }],
    },
  ],
  sources: [
    syllabusSource("数字 TestAS 结构与 MCNS 框架", "Digital TestAS structure and MCNS framework", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-digital-testas/structure-of-the-digital-testas", "webpage"),
    syllabusSource("纸笔 TestAS 结构与 MCNS 框架", "Paper-based TestAS structure and MCNS framework", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/teilnehmende/the-paper-based-testas/structure-of-the-paper-based-testas", "webpage"),
  ],
  translationNote: t("中文为能力框架翻译。TestAS 没有可替代官方样题册的“数学知识点清单”。", "The Chinese text translates the aptitude framework. TestAS does not publish a mathematics topic checklist that substitutes for the official sample booklets."),
  lastVerified: VERIFIED_AT,
};

const tolciSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-tolc-i-mathematics-2026",
  slug: "tolc-i-mathematics-syllabus-2026",
  projectId: CISIA_ID,
  classification: "formal-specification",
  title: t("2026 TOLC-I 数学考纲", "2026 TOLC-I Mathematics Syllabus"),
  officialName: t("TOLC-I Syllabus — Mathematics", "TOLC-I Syllabus — Mathematics"),
  applicableCycle: t("2026 TOLC", "2026 TOLC"),
  effectiveFrom: "2026-01-01",
  status: "confirmed",
  summary: t("本考纲适用于现行意大利语 TOLC-I 的数学部分，共 20 题、50 分钟。旧 English TOLC-I 已由 CEnT-S 取代，不能把本记录理解为现行英语考试。", "This syllabus applies to the current Italian-language TOLC-I Mathematics section, with 20 questions in 50 minutes. The former English TOLC-I has been replaced by CEnT-S; this record is not the current English test."),
  facts: [
    fact("题量", "Questions", "20 题", "20 questions", ["eu-cisia-tolci"]),
    fact("时长", "Duration", "50 分钟", "50 minutes", ["eu-cisia-tolci"]),
    fact("计分", "Scoring", "答对 +1；空答 0；答错 −0.25", "+1 correct; 0 blank; −0.25 incorrect", ["eu-cisia-tolci"]),
  ],
  sections: [{
    id: "tolci-math-domains",
    title: t("数学内容", "Mathematics content"),
    tables: [{
      columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
      rows: [
        row([["算术与代数", "Arithmetic and algebra"], ["整数、有理数、实数的性质与运算；绝对值；幂与根；对数与指数；符号运算；多项式运算与因式分解；一次、二次或可化为一次／二次的方程和不等式；一次方程组；分式方程／不等式及含根式方程／不等式。", "Properties and operations on integers, rationals and reals; absolute value; powers and roots; logarithms and exponentials; symbolic manipulation; polynomial operations and factorisation; linear, quadratic and reducible equations/inequalities; linear systems; rational and radical equations/inequalities."]], ["eu-cisia-tolci"]),
        row([["初等几何", "Elementary geometry"], ["线段与角；度量与性质；直线和平面；主要轨迹；三角形、圆、正多边形等平面图形及周长面积；球、圆锥、圆柱、棱柱、长方体、棱锥等立体图形及表面积体积。", "Segments and angles; measurement and properties; lines and planes; principal loci; plane figures including triangles, circles and regular polygons with perimeters and areas; solids including spheres, cones, cylinders, prisms, parallelepipeds and pyramids with surface areas and volumes."]], ["eu-cisia-tolci"]),
        row([["解析几何与数值函数", "Analytic geometry and numerical functions"], ["笛卡尔坐标；函数概念；直线、圆、椭圆、抛物线等简单轨迹的方程；幂、对数、指数等初等函数的图像与性质；对数计算；指数／对数方程与不等式。", "Cartesian coordinates; the function concept; equations of lines and simple loci such as circles, ellipses and parabolas; graphs and properties of elementary power, logarithmic and exponential functions; logarithmic calculations; exponential/logarithmic equations and inequalities."]], ["eu-cisia-tolci"]),
        row([["三角", "Trigonometry"], ["正弦、余弦、正切的图像与性质；和差、倍角、半角等主要公式；三角方程与不等式；三角形各元素之间的关系。", "Graphs and properties of sine, cosine and tangent; principal addition, subtraction, double-angle and half-angle formulae; trigonometric equations and inequalities; relationships among elements of a triangle."]], ["eu-cisia-tolci"]),
        row([["统计", "Statistics"], ["排列、组合、均值、方差和频数等基础概念；读取频数图和直方图。", "Elementary notions of permutations, combinations, mean, variance and frequency; reading frequency diagrams and histograms."]], ["eu-cisia-tolci"]),
      ],
    }],
  }],
  sources: [syllabusSource("TOLC-I 结构与官方考纲", "TOLC-I structure and official syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus", "webpage", "2026", "2026")],
  translationNote: t("中文按 CISIA 英文页面翻译。TOLC-I 实际试卷为意大利语；数学术语应结合意大利语样题练习。", "The Chinese text translates CISIA's English page. The TOLC-I paper itself is in Italian, so candidates should practise the corresponding Italian mathematical terminology."),
  lastVerified: VERIFIED_AT,
};

const centSSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-cent-s-mathematics-2025-26",
  slug: "cent-s-mathematics-syllabus-2025-26",
  projectId: CISIA_ID,
  classification: "formal-specification",
  title: t("2025/26 CEnT-S 数学考纲", "2025/26 CEnT-S Mathematics Syllabus"),
  officialName: t("CEnT-S Syllabus — Mathematics", "CEnT-S Syllabus — Mathematics"),
  applicableCycle: t("2025 年 11 月至 2026 年 10 月", "November 2025 to October 2026"),
  effectiveFrom: "2025-11-01",
  status: "confirmed",
  summary: t("CEnT-S 是取代旧 English TOLC-I／E／F 的现行英语测试。数学部分 15 题、30 分钟；本页只翻译 Mathematics 范围。", "CEnT-S is the current English test replacing the former English TOLC-I/E/F. Mathematics contains 15 questions in 30 minutes; this record translates only the Mathematics scope."),
  facts: [
    fact("题量", "Questions", "15 题", "15 questions", ["eu-cisia-cent-structure"]),
    fact("时长", "Duration", "30 分钟", "30 minutes", ["eu-cisia-cent-structure"]),
    fact("计分", "Scoring", "原始分：答对 +1、空答 0、答错 −0.25；宏周期结束后形成标准化成绩", "Raw score: +1 correct, 0 blank, −0.25 incorrect; the normalised result is produced after the macro-period", ["eu-cisia-cent-structure", "eu-cisia-cent-rules"]),
  ],
  sections: [{
    id: "cent-s-math-domains",
    title: t("数学内容", "Mathematics content"),
    tables: [{
      columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
      rows: [
        row([["数", "Numbers"], ["整数、有理数、实数的基本运算与排序；自然数带余除法、因式分解、因数与倍数；整数指数幂、正数开方和正数有理指数幂；百分数与百分比变化；数值式的计算和变形；估算并判断结果合理性。", "Basic operations and ordering on integers, rationals and reals; division with remainder, factorisation, divisors and multiples of natural numbers; integer powers, roots and rational powers of positive numbers; percentages and percentage change; evaluating and transforming numerical expressions; estimation and plausibility checks."]], ["eu-cisia-cent-structure"]),
        row([["代数", "Algebra"], ["含字母式的化简与代入、等式和不等式；多项式因式分解和根；方程、不等式、方程组的解与解集；一次、二次及相关方程／不等式；线性或其他简单方程组的变形和求解。", "Manipulation and evaluation of literal expressions, equalities and inequalities; polynomial factorisation and roots; solutions and solution sets of equations, inequalities and systems; linear, quadratic and related equations/inequalities; transformation and solution of linear or other simple systems."]], ["eu-cisia-cent-structure"]),
        row([["几何", "Geometry"], ["常见平面和空间图形的分类与性质，包括直线、平面、角、三角形、四边形、正多边形、圆、棱柱、棱锥、圆柱、圆锥和球；周长、面积、体积；相似；笛卡尔坐标与点距；直线方程、斜率和交点；圆方程；用方程、不等式或方程组表示平面子集。", "Classification and properties of common plane and solid figures, including lines, planes, angles, triangles, quadrilaterals, regular polygons, circles, prisms, pyramids, cylinders, cones and spheres; perimeters, areas and volumes; similarity; Cartesian coordinates and distance; line equations, slopes and intersections; circle equations; subsets of the plane represented by equations, inequalities or systems."]], ["eu-cisia-cent-structure"]),
        row([["函数", "Functions"], ["函数、复合函数、可逆函数与反函数；函数主要性质；图像判读和变换；用图像解函数方程／不等式；幂函数、根式函数、一二次多项式、1/(ax+b)、绝对值、指数和不同底数对数函数。", "Functions, composition, invertibility and inverse functions; principal properties; interpreting and transforming graphs; graphical solution of functional equations/inequalities; power and root functions, linear and quadratic polynomials, 1/(ax+b), absolute-value, exponential and logarithmic functions in different bases."]], ["eu-cisia-cent-structure"]),
        row([["指数与对数", "Exponentials and logarithms"], ["对数定义；幂与对数的基本代数性质；在对数式与幂式之间转换；简单指数／对数方程与不等式；估算和比较任意实指数幂及对数值。", "Definition of logarithm; elementary algebraic properties of powers and logarithms; conversion between logarithmic and exponential forms; elementary exponential/logarithmic equations and inequalities; estimating and comparing powers with real exponents and logarithms."]], ["eu-cisia-cent-structure"]),
        row([["组合与概率", "Combinatorics and probability"], ["有限集合的表示和计数；排列、组合；有限等可能结果下事件概率；互斥事件之并与独立事件之交的概率。", "Representation and counting of finite sets; arrangements, combinations and permutations; event probability in finite equally likely outcome spaces; probabilities of unions of disjoint events and intersections of independent events."]], ["eu-cisia-cent-structure"]),
        row([["基础统计", "Basic statistics"], ["表格与图形（直方图、饼图等）表示和解释数据；数据、变量、观测与名义／顺序／区间／比率尺度；绝对和相对频数；均值、中位数和众数。", "Representing and interpreting data with tables and graphs such as histograms and pie charts; data, variables, observations and nominal/ordinal/interval/ratio scales; absolute and relative frequency; mean, median and mode."]], ["eu-cisia-cent-structure"]),
      ],
    }],
  }],
  sources: [
    syllabusSource("CEnT-S 结构与官方考纲", "CEnT-S structure and official syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/cent-s/structure-and-syllabus", "webpage", "2025/26", "2025/26"),
    syllabusSource("2026 CEnT-S 官方规则", "Official 2026 CEnT-S rules", "CISIA", "CISIA", "https://www.cisiaonline.it/sites/default/files/Regolamenti/Rules-CEnT-2026.pdf", "pdf", "1 November 2025–31 October 2026", "1 November 2025–31 October 2026"),
  ],
  translationNote: t("中文按 CISIA 英文考纲翻译；如官方页面更新，以英文原文为准。", "The Chinese text translates CISIA's English syllabus; any later official revision takes priority."),
  lastVerified: VERIFIED_AT,
};

const ethSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-eth-entrance-mathematics-2027",
  slug: "eth-entrance-examination-mathematics-syllabus-2027",
  projectId: ETH_ID,
  classification: "formal-specification",
  title: t("ETH 入学考试数学考纲", "ETH Entrance Examination Mathematics Syllabus"),
  officialName: t("Prüfungsanforderungen — Mathematik", "Examination Requirements — Mathematics"),
  applicableCycle: t("2027 年 1 月入学考试", "January 2027 entrance examination"),
  status: "confirmed",
  summary: t("减免版和完整版使用同一数学考纲及考试形式。数学含 60 分钟短题笔试、180 分钟长题笔试和 15 分钟口试。", "The reduced and comprehensive examinations use the same Mathematics syllabus and format: a 60-minute short-answer paper, a 180-minute extended paper and a 15-minute oral examination."),
  facts: [
    fact("笔试 Part I", "Written Part I", "60 分钟，约 12 道短题，无辅助材料", "60 minutes, about 12 short tasks, no aids", ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
    fact("笔试 Part II", "Written Part II", "180 分钟，约 5 道长题，指定计算器和公式手册", "180 minutes, about five extended tasks, specified calculator and formulary", ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus", "eu-eth-main"]),
    fact("口试", "Oral", "15 分钟", "15 minutes", ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
    fact("语言", "Language", "德语", "German", ["eu-eth-main"]),
  ],
  sections: [
    {
      id: "eth-math-analysis-algebra",
      title: t("代数、函数与微积分", "Algebra, functions and calculus"),
      tables: [{
        columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
        rows: [
          row([["集合与方程", "Sets and equations"], ["集合论基础；至多三元的线性方程和方程组；一元二次方程；指数方程。", "Basic set theory; linear equations and systems with at most three unknowns; quadratic equations in one variable; exponential equations."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["函数与图像", "Functions and graphs"], ["一般幂函数、对数、指数、三角函数及其图像；多项式、有理函数和简单超越函数图像；渐近线与对称；多项式乘法和除法。", "General power, logarithmic, exponential and trigonometric functions and graphs; graphs of polynomial, rational and simple transcendental functions; asymptotes and symmetry; multiplication and division of polynomials."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["三角", "Trigonometry"], ["三角函数、加法定理等恒等式；三角方程；用正弦和余弦定理处理直角和一般三角形。", "Trigonometric functions and identities including addition theorems; trigonometric equations; right and general triangles using the sine and cosine rules."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["数列与级数", "Sequences and series"], ["数列概念；等差、等比数列及对应级数和；数学归纳法；数列收敛与级数极限。", "Sequences; arithmetic and geometric sequences and sums; mathematical induction; convergence of sequences and limits of series."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["复数", "Complex numbers"], ["代数式与极坐标形式、运算和方程；高斯平面；用复数记号表示简单区域。", "Algebraic and polar forms, operations and equations; the Argand plane; simple regions in complex notation."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["导数、原函数与积分", "Derivatives, antiderivatives and integrals"], ["导数概念和规则；曲线研究中的极值和拐点；原函数和定积分；分部积分、换元；面积、简单立体的体积和表面积；带约束极值。", "Derivative concepts and rules; extrema and inflection points in curve analysis; antiderivatives and definite integrals; integration by parts and substitution; areas, volumes and surfaces of simple solids; constrained extrema."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
        ],
      }],
    },
    {
      id: "eth-math-geometry-probability",
      title: t("几何、概率与统计", "Geometry, probability and statistics"),
      tables: [{
        columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
        rows: [
          row([["平面几何", "Plane geometry"], ["垂直平分线、角平分线、中位平行线、泰勒斯圆、定弦角轨迹、阿波罗尼斯圆等基本轨迹，并用于具体问题。", "Fundamental loci including perpendicular and angle bisectors, mid-parallels, the Thales circle, constant-angle loci and Apollonius circles, applied to concrete problems."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["空间几何", "Solid geometry"], ["用简单几何轨迹构造空间问题解；必要时用非作图式向量几何；空间元素的垂直关系。", "Developing stereometric solutions with simple loci; where appropriate, non-constructive vector geometry; perpendicularity of spatial elements."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["向量几何", "Vector geometry"], ["至多三维实向量空间；点积、叉积和混合积；体积；几何对象的参数式与坐标方程；特殊位置圆锥曲线；用于空间几何问题。", "Real vector spaces up to dimension three; dot, cross and scalar triple products; volume; parametric and coordinate equations of geometric objects; conics in special position; applications to solid geometry."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
          row([["组合、概率与统计", "Combinatorics, probability and statistics"], ["基本组合计数；随机试验与概率；相依、独立和互补事件；概率加法、乘法与条件概率；事件树；基本统计、随机变量、期望、标准差、二项分布和正态分布。", "Basic combinatorics; random experiments and probability; dependent, independent and complementary events; addition, multiplication and conditional probability; event trees; elementary statistics, random variables, expectation, standard deviation, binomial and normal distributions."]], ["eu-eth-reduced-syllabus", "eu-eth-comprehensive-syllabus"]),
        ],
      }],
    },
  ],
  sources: [
    syllabusSource("减免版入学考试要求", "Reduced entrance examination requirements", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsinhalte/rAP.pdf", "pdf", "Current for January 2027", "Current for January 2027"),
    syllabusSource("完整版入学考试要求", "Comprehensive entrance examination requirements", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsinhalte/uAP.pdf", "pdf", "Current for January 2027", "Current for January 2027"),
  ],
  translationNote: t("中文根据德语官方考试要求翻译。数学范围在两份文件中相同；如后续 PDF 更新，以 ETH 德语原文为准。", "The Chinese text translates the official German requirements. Mathematics is identical in both documents; any later ETH German PDF takes priority."),
  lastVerified: VERIFIED_AT,
};

const epflSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-epfl-entrance-mathematics-2027",
  slug: "epfl-entrance-examination-mathematics-2027",
  projectId: EPFL_ID,
  classification: "formal-specification",
  title: t("EPFL 2027 入学考试数学 I／II 考纲", "EPFL 2027 Entrance Examination Mathematics I/II Syllabus"),
  officialName: t("Programme de l’examen d’admission 2027 — Mathématiques I et II", "2027 Entrance Examination Programme — Mathematics I and II"),
  applicableCycle: t("2027 年考试", "2027 examination session"),
  effectiveFrom: "2026-04-01",
  status: "confirmed",
  summary: t("数学 I 考分析，数学 II 考解析几何与线性代数；两卷均为法语笔试，各 3 小时 30 分钟。减免版和完整版的第一模块均包含两卷。", "Mathematics I assesses analysis and Mathematics II analytic geometry and linear algebra. Both are 3-hour-30-minute written papers in French and form part of Block 1 in both the reduced and full examinations."),
  facts: [
    fact("数学 I", "Mathematics I", "分析；笔试 3 小时 30 分钟；考场发公式表；不得用个人计算器或资料", "Analysis; 3 hours 30 minutes written; formula sheet supplied; no personal calculator or documents", ["eu-epfl-program-2027"]),
    fact("数学 II", "Mathematics II", "解析几何与线性代数；笔试 3 小时 30 分钟；不得用计算器或资料；须自带三角板", "Analytic geometry and linear algebra; 3 hours 30 minutes written; no calculator or documents; own set square required", ["eu-epfl-program-2027"]),
    fact("语言", "Language", "法语", "French", ["eu-epfl-program-2027"]),
  ],
  sections: [
    {
      id: "epfl-mathematics-i",
      title: t("Mathématiques I：分析", "Mathématiques I: Analysis"),
      tables: [{
        columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
        rows: [
          row([["初等代数", "Elementary algebra"], ["方程、不等式、绝对值和牛顿二项式。", "Equations, inequalities, absolute value and the Newton binomial."]], ["eu-epfl-program-2027"]),
          row([["三角", "Trigonometry"], ["直角三角形三角学与一般三角形求解；三角函数及反函数；三角方程与不等式。", "Right-triangle trigonometry and solution of general triangles; trigonometric functions and inverses; trigonometric equations and inequalities."]], ["eu-epfl-program-2027"]),
          row([["数列", "Sequences"], ["数列极限；等差数列与等比数列。", "Limits of sequences; arithmetic and geometric sequences."]], ["eu-epfl-program-2027"]),
          row([["单变量实函数", "Real functions of one variable"], ["幂、指数、双曲函数及反函数；极限、未定式和等价无穷小；连续与连续延拓；导数的几何意义和规则，隐式／参数求导；单调、极值、微分、线性近似和泰勒展开；普通函数与参数函数的完整研究。", "Power, exponential and hyperbolic functions and inverses; limits, indeterminate forms and equivalent infinitesimals; continuity and extension; geometric interpretation and rules of derivatives, implicit and parametric differentiation; monotonicity, extrema, differentials, linear approximation and Taylor expansions; full study of ordinary and parametric functions."]], ["eu-epfl-program-2027"]),
          row([["复数", "Complex numbers"], ["代数形式与三角形式；高斯平面中的平移、位似、旋转和相似；棣莫弗公式；实／复多项式和不可约因式分解。", "Algebraic and trigonometric forms; translations, homotheties, rotations and similarities in the Argand plane; de Moivre's formula; real/complex polynomials and irreducible factorisation."]], ["eu-epfl-program-2027"]),
          row([["积分", "Integration"], ["原函数；分部积分、换元与有理函数积分；平面面积、旋转体或已知截面立体的体积、弧长和旋转曲面面积。", "Antiderivatives; integration by parts, substitution and rational functions; plane areas, volumes of revolution or solids with known cross-section, arc lengths and surfaces of revolution."]], ["eu-epfl-program-2027"]),
        ],
      }],
    },
    {
      id: "epfl-mathematics-ii",
      title: t("Mathématiques II：解析几何与线性代数", "Mathématiques II: Analytic Geometry and Linear Algebra"),
      tables: [{
        columns: [t("领域", "Domain"), t("中文翻译", "Chinese translation")],
        rows: [
          row([["三角形", "Triangle geometry"], ["特殊直线和点；勾股定理与泰勒斯定理。", "Special lines and points; Pythagoras and Thales theorems."]], ["eu-epfl-program-2027"]),
          row([["向量", "Vectors"], ["定义和运算；点积、叉积与混合积。", "Definitions and operations; dot, cross and scalar triple products."]], ["eu-epfl-program-2027"]),
          row([["仿射平面与空间", "Affine plane and space"], ["坐标架；向量式、法式、参数式和笛卡尔方程；对象之间的相对位置与方向。", "Coordinate frames; vector, normal, parametric and Cartesian equations; relative positions and directions."]], ["eu-epfl-program-2027"]),
          row([["欧氏平面与空间", "Euclidean plane and space"], ["正交坐标架；角度和距离计算。", "Orthonormal frames; angle and distance calculations."]], ["eu-epfl-program-2027"]),
          row([["几何变换与圆锥曲线", "Transformations and conics"], ["平移、投影、对称和旋转；圆锥曲线的一般式、标准式、齐次坐标下无穷远点、标准化和特征要素。", "Translations, projections, symmetries and rotations; general and canonical forms of conics, points at infinity in homogeneous coordinates, reduction and characteristic elements."]], ["eu-epfl-program-2027"]),
          row([["逻辑与证明", "Logic and proof"], ["且、或、蕴含、等价等连接词；否定；证明方法。", "Connectives including and, or, implication and equivalence; negation; proof methods."]], ["eu-epfl-program-2027"]),
          row([["集合与映射", "Sets and mappings"], ["子集、补集、并交、笛卡尔积；元素和子集的像／原像；单射、满射和双射。", "Subsets, complements, unions/intersections and Cartesian products; images and preimages of elements and subsets; injections, surjections and bijections."]], ["eu-epfl-program-2027"]),
          row([["实向量空间", "Real vector spaces"], ["经典空间、线性组合、子空间、线性相关／无关、生成集、基与维数、秩及线性方程组。", "Classical spaces, linear combinations, subspaces, dependence/independence, spanning sets, bases and dimension, rank and linear systems."]], ["eu-epfl-program-2027"]),
          row([["线性映射与矩阵", "Linear maps and matrices"], ["像、核、秩；表示矩阵；矩阵乘法与映射复合；换基和行列式。", "Image, kernel and rank; representing matrices; matrix multiplication and composition; change of basis and determinants."]], ["eu-epfl-program-2027"]),
          row([["约化", "Reduction"], ["特征值、特征向量、特征多项式、对角化判据；二维和三维中的系统研究及几何性质。", "Eigenvalues, eigenvectors, characteristic polynomials and diagonalisation criteria; systematic study and geometric nature in dimensions two and three."]], ["eu-epfl-program-2027"]),
        ],
      }],
    },
  ],
  sources: [syllabusSource("EPFL 2027 入学考试科学科目考纲", "EPFL 2027 scientific-subject entrance examination programme", "EPFL", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2026/04/ProgrammeExAdm2027.pdf", "pdf", "Session 2027", "Session 2027")],
  translationNote: t("中文根据法语官方考纲翻译；科目名称和考试用语保留法语。正式备考应同时阅读原 PDF 及其附录公式表。", "The Chinese text translates the official French programme; subject names and examination terminology retain the French. Candidates should also read the original PDF and its formula-sheet appendix."),
  lastVerified: VERIFIED_AT,
};

export const europeAssessmentSyllabi: AssessmentSyllabusRecord[] = [
  omptASyllabus,
  omptBSyllabus,
  omptDSyllabus,
  testasSyllabus,
  tolciSyllabus,
  centSSyllabus,
  ethSyllabus,
  epflSyllabus,
];

export const europeAssessmentLearningResources: LearningResourceRecord[] = [
  learningResource("resource-ompt-a-syllabus", [OMPT_ID], "OMPT-A 官方考纲", "OMPT-A Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-a/syllabus", "official-guide", "free", "176 项官方范围与子主题，是 OMPT-A 复习清单的首要来源。", "The 176-entry official scope and subtopics are the primary OMPT-A preparation checklist."),
  learningResource("resource-ompt-a-weights", [OMPT_ID], "OMPT-A 主题占比", "OMPT-A Topic Weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-a/learning-assessments", "official-guide", "free", "给出八类数学内容的官方占比，用于分配练习时间。", "Official weights across the eight Mathematics domains for allocating practice time."),
  learningResource("resource-ompt-b-syllabus", [OMPT_ID], "OMPT-B 官方考纲", "OMPT-B Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-b/syllabus", "official-guide", "free", "226 项官方范围与子主题，含三角、微分和积分。", "The 226-entry official scope and subtopics, including trigonometry, differentiation and integration."),
  learningResource("resource-ompt-b-weights", [OMPT_ID], "OMPT-B 主题占比", "OMPT-B Topic Weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-b/learning-assessments", "official-guide", "free", "给出各数学主题占比；微分 25%、积分 17%、三角 15%。", "Published Mathematics weights, including differentiation 25%, integration 17% and trigonometry 15%."),
  learningResource("resource-ompt-d-syllabus", [OMPT_ID], "OMPT-D 官方考纲", "OMPT-D Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-d/syllabus", "official-guide", "free", "列出函数、方程、微积分、三角和几何的详细范围。", "The detailed scope for functions, equations, calculus, trigonometry and geometry."),
  learningResource("resource-ompt-d-weights", [OMPT_ID], "OMPT-D 主题占比", "OMPT-D Topic Weights", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-d/learning-assessments", "official-guide", "free", "给出 OMPT-D 五大主题占比。", "Published weights across the five OMPT-D domains."),
  learningResource("resource-ompt-practice", [OMPT_ID], "OMPT 官方练习与模拟考试", "OMPT Official Practice and Mock Tests", "OMPT", "OMPT", "https://www.omptest.org/practicing", "practice-platform", "paid", "练习材料含理论、随机练习与反馈；模拟考试按分主题给出结果。", "Practice materials provide theory, randomised exercises and feedback; mock tests report topic-level results.", "需按 A／B／D 分别购买。正式安全试题不在此公开。", "Purchased separately for A/B/D. Secure operational questions are not released here."),

  learningResource("resource-testas-digital-prep", [TESTAS_ID], "数字 TestAS 官方样题与解析", "Digital TestAS Official Samples and Solutions", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/230531_digitalertestas_preparatory_materials.pdf", "sample-questions", "free", "含数字版 Core 数学方程、拉丁方阵及 MCNS 模块的官方说明、分难度样题和解析。", "Contains official instructions, graded sample tasks and solutions for the digital Core Mathematical Equations, Latin Squares and the MCNS module."),
  learningResource("resource-testas-paper-sample", [TESTAS_ID], "纸笔 TestAS 官方英文样题册", "Paper-based TestAS Official English Sample Booklet", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/pdf/Modellaufgabenheft_English.pdf", "sample-questions", "free", "用于练习数量问题、数列及 MCNS 的科学关系和形式化表示题型。", "Covers Quantitative Problems, Numerical Series and the MCNS task types for scientific relationships and formal depictions."),
  learningResource("resource-testas-digital-demo", [TESTAS_ID], "数字 TestAS 考生门户演示", "Digital TestAS Participant-Portal Demo", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://account.gast.de/", "practice-platform", "account", "完成报名后可进入数字考试演示，熟悉界面和操作。", "Registered candidates can use the digital-test demo to learn the interface and controls."),
  learningResource("resource-testas-score-conversion", [TESTAS_ID], "TestAS 数字与纸笔分数换算表", "TestAS Digital–Paper Score Conversion", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/240813_umrechnungstabelle_testas_score_eng.pdf", "official-guide", "free", "把数字版 0–200 TestAS Score 与纸笔版 70–130 标准分对应。", "Maps the digital 0–200 TestAS Score to the paper-based 70–130 standard score."),

  learningResource("resource-tolci-syllabus", [CISIA_ID], "TOLC-I 数学考纲", "TOLC-I Mathematics Syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus", "official-guide", "free", "现行意大利语 TOLC-I 数学范围、题量、时长和计分。", "Current Italian-language TOLC-I Mathematics scope, question count, timing and scoring."),
  learningResource("resource-cent-s-syllabus", [CISIA_ID], "CEnT-S 数学考纲", "CEnT-S Mathematics Syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/cent-s/structure-and-syllabus", "official-guide", "free", "现行 CEnT-S 数学范围、题量、时长和标准化说明。", "Current CEnT-S Mathematics scope, question count, timing and normalisation guidance."),
  learningResource("resource-cisia-practice", [CISIA_ID], "CISIA 官方练习区", "CISIA Official Practice Area", "CISIA", "CISIA", "https://guide.cisiaonline.it/en/Esercitati", "practice-platform", "account", "账户内提供模拟、样题或带解析题目、Mentor 与免费 MOOC；应选择目标测试的数学内容。", "The account area provides simulations, sample or solved tasks, Mentor tools and free MOOCs; select the Mathematics content for the required test."),
  learningResource("resource-cent-s-simulation", [CISIA_ID], "CEnT-S 官方全结构模拟", "Official CEnT-S Simulation", "CISIA", "CISIA", "https://www.cisiaonline.it/en/news/practice-cent-s-simulations-available-practice-area", "practice-platform", "account", "模拟与正式考试结构和时长一致，可单独复盘数学部分，并用于检查 @HOME 设备。", "The simulation follows the official structure and timing; candidates can review the Mathematics section and test @HOME equipment."),

  learningResource("resource-eth-math-example-1", [ETH_ID], "ETH 2024 数学示例卷 Part I", "ETH 2024 Mathematics Example Part I", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_I-Beispiel-WEB.pdf", "sample-questions", "free", "德语官方短题示例，适合按 60 分钟、无辅助材料完成。", "Official German short-task example for a 60-minute no-aids practice."),
  learningResource("resource-eth-math-example-2", [ETH_ID], "ETH 2024 数学示例卷 Part II", "ETH 2024 Mathematics Example Part II", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_II-Beispiel-WEB.pdf", "sample-questions", "free", "德语官方长题示例，须完整写出论证与中间步骤。", "Official German extended-task example requiring complete reasoning and intermediate work."),
  learningResource("resource-eth-math-requirements", [ETH_ID], "ETH 数学考试要求", "ETH Mathematics Examination Requirements", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsinhalte/rAP.pdf", "official-guide", "free", "减免版要求文件前两页给出完整数学考纲、形式和允许材料；完整版的数学范围相同。", "The first two pages of the reduced-exam requirements give the full Mathematics syllabus, format and permitted aids; Mathematics is identical in the comprehensive version."),
  learningResource("resource-eth-textbooks", [ETH_ID], "ETH 数学教材建议", "ETH Mathematics Textbook Recommendations", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/Lehrb%C3%BCcher%20Empfehlungen%202021.pdf", "official-textbook", "mixed", "ETH 列出的德语微分、积分与向量几何教材及 ISBN。", "ETH's advisory list of German textbooks and ISBNs for differential calculus, integral calculus and vector geometry.", "教材需另购，且书目不定义考试范围。", "Books are purchased separately, and the list does not define the syllabus."),
  learningResource("resource-eth-rules-aids", [ETH_ID], "ETH 指定公式手册与计算器", "ETH Permitted Formularies and Calculators", "ETH Zurich", "ETH Zurich", "https://ethz.ch/en/studies/bachelor/application/non-swiss-matriculation-certificate/eth-entrance-examination.html", "official-guide", "free", "官方主页列出当前允许的公式手册版本、ISBN 和三种计算器型号。", "The official page lists the currently permitted formulary editions, ISBNs and three calculator models."),

  learningResource("resource-epfl-program-2027", [EPFL_ID], "EPFL 2027 数学 I／II 考纲与公式表", "EPFL 2027 Mathematics I/II Syllabus and Formula Sheet", "EPFL", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2026/04/ProgrammeExAdm2027.pdf", "official-guide", "free", "法语正式考纲列出数学 I、数学 II 的范围、时长、允许材料、参考书和考场提供的公式表。", "The formal French programme lists the Mathematics I/II scope, timing, permitted materials, references and supplied formula sheet."),
  learningResource("resource-epfl-exercises", [EPFL_ID], "EPFL 入学考试数学练习", "EPFL Entrance-Examination Mathematics Exercises", "EPFL", "EPFL", "https://courseware.epfl.ch/courses/course-v1%3AEPFL%2BadmissionEPFL%2B2020/about", "practice-platform", "account", "法语练习集覆盖分析、线性代数和解析几何，用于判断入学考试要求的难度。", "A French exercise collection covering analysis, linear algebra and analytic geometry at the expected entrance-examination level."),
  learningResource("resource-epfl-trig", [EPFL_ID], "EPFL 三角、对数与指数函数预备课程", "EPFL Preparatory Course on Trigonometric, Logarithmic and Exponential Functions", "EPFL", "EPFL", "https://courseware.epfl.ch/courses/course-v1%3AEPFL%2BTrigoExp%2B2019/about", "courseware", "account", "法语课程共九章，含三角公式与方程、解三角形、连续与可导、对数和指数函数。", "A nine-chapter French course covering trigonometric formulae and equations, triangle solution, continuity and differentiability, logarithms and exponentials."),
];

export const europeAssessmentPastPaperArchives: PastPaperArchiveRecord[] = [
  {
    id: "past-papers-ompt-abd",
    projectId: OMPT_ID,
    availability: "restricted",
    summary: t("OMPT 不公开正式安全题库或历年实考试卷。公开考纲和主题占比免费；官方练习与模拟须付费购买，且不得当作已公开真题转载。", "OMPT does not release its secure operational item bank or past live forms. Syllabi and topic weights are public; official practice and mock tests are paid and must not be redistributed as released past papers."),
    links: [
      paperLink("OMPT-A 官方考纲", "OMPT-A Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-a/syllabus", "index", "free", "公开完整范围，不含正式题库。", "Public complete scope; no operational item bank."),
      paperLink("OMPT-B 官方考纲", "OMPT-B Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-b/syllabus", "index", "free", "公开完整范围，不含正式题库。", "Public complete scope; no operational item bank."),
      paperLink("OMPT-D 官方考纲", "OMPT-D Official Syllabus", "OMPT", "OMPT", "https://www.omptest.org/tests/ompt-d/syllabus", "index", "free", "公开完整范围，不含正式题库。", "Public complete scope; no operational item bank."),
      paperLink("官方练习与模拟入口", "Official Practice and Mock-Test Access", "OMPT", "OMPT", "https://www.omptest.org/practicing", "specimen", "paid", "按考试类型购买；仅限账户使用。", "Purchased by test type for account use only."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-testas-mcns",
    projectId: TESTAS_ID,
    availability: "sample-only",
    summary: t("TestAS 正式试卷属于安全材料，没有公开历年整卷库。官方提供纸笔和数字版样题、说明与解析；应优先使用这些材料。", "Operational TestAS forms are secure and there is no public archive of past full papers. Official paper-based and digital samples, instructions and solutions are the primary materials."),
    links: [
      paperLink("数字 TestAS 官方备考材料", "Digital TestAS Official Preparation Materials", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/fileadmin/bilder/4_pdf-video/1-teilnehmende/230531_digitalertestas_preparatory_materials.pdf", "specimen", "free", "含数学方程、拉丁方阵与 MCNS 样题和解析；不是历年实卷。", "Contains Mathematical Equations, Latin Squares and MCNS samples with solutions; not a past live form."),
      paperLink("纸笔 TestAS 官方英文样题册", "Paper-based TestAS Official English Sample Booklet", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://www.testas.de/en/pdf/Modellaufgabenheft_English.pdf", "specimen", "free", "含数量推理和 MCNS 官方题型；不是历年实卷。", "Contains official quantitative and MCNS task types; not a past live form."),
      paperLink("考生门户数字演示", "Participant-Portal Digital Demo", "g.a.s.t. / TestAS", "g.a.s.t. / TestAS", "https://account.gast.de/", "specimen", "account", "报名后登录使用。", "Available after registration and sign-in."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-cisia-tolci-cent-s",
    projectId: CISIA_ID,
    availability: "sample-only",
    summary: t("CISIA 不提供可自由下载和转载的完整历年正式卷库。账户练习区提供模拟、样题或带解析题目；CEnT-S 有官方全结构模拟。旧 English TOLC-I 考纲仅作历史参考。", "CISIA does not provide a freely downloadable and reproducible archive of complete past live forms. The account practice area offers simulations, samples or solved tasks, and CEnT-S has an official full-structure simulation. The former English TOLC-I syllabus is historical only."),
    links: [
      paperLink("CISIA 官方练习区", "CISIA Official Practice Area", "CISIA", "CISIA", "https://guide.cisiaonline.it/en/Esercitati", "index", "account", "登录后选择 TOLC-I 或 CEnT-S 数学材料。", "Sign in and select the Mathematics material for TOLC-I or CEnT-S."),
      paperLink("CEnT-S 官方模拟说明", "Official CEnT-S Simulation Notice", "CISIA", "CISIA", "https://www.cisiaonline.it/en/news/practice-cent-s-simulations-available-practice-area", "specimen", "account", "模拟在 CISIA Practice Area 内运行。", "The simulation runs inside the CISIA Practice Area."),
      paperLink("TOLC-I 数学考纲", "TOLC-I Mathematics Syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/tolc/tolc-i/structure-and-syllabus", "index", "free", "现行意大利语 TOLC-I 范围。", "Current Italian-language TOLC-I scope."),
      paperLink("CEnT-S 数学考纲", "CEnT-S Mathematics Syllabus", "CISIA", "CISIA", "https://www.cisiaonline.it/en/cent/cent-s/structure-and-syllabus", "index", "free", "现行英语 CEnT-S 范围。", "Current English CEnT-S scope."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-eth-entrance-mathematics",
    projectId: ETH_ID,
    availability: "sample-only",
    summary: t("ETH 当前公开 2024 数学 Part I 和 Part II 官方示例卷，但没有按年份连续发布的完整历年数学真题库。两份材料应标为 example material，而非完整档案。", "ETH currently publishes official 2024 Mathematics Part I and Part II examples but no continuous year-by-year archive of complete Mathematics papers. They should be labelled example material rather than a full archive."),
    links: [
      paperLink("2024 数学 Part I 示例", "2024 Mathematics Part I Example", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_I-Beispiel-WEB.pdf", "specimen", "free", "德语官方短题示例。", "Official German short-task example."),
      paperLink("2024 数学 Part II 示例", "2024 Mathematics Part II Example", "ETH Zurich", "ETH Zurich", "https://ethz.ch/content/dam/ethz/main/education/admission/bachelor/andere-qual/pruefungsbeispiele/AP24_Mathematik-Teil_II-Beispiel-WEB.pdf", "specimen", "free", "德语官方长题示例。", "Official German extended-task example."),
      paperLink("ETH 入学考试主页", "ETH Entrance Examination Hub", "ETH Zurich", "ETH Zurich", "https://ethz.ch/en/studies/bachelor/application/non-swiss-matriculation-certificate/eth-entrance-examination.html", "download-page", "free", "如 ETH 增加新版示例，应以该页面为准。", "Use this page for any later example releases."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-epfl-entrance-mathematics",
    projectId: EPFL_ID,
    availability: "not-found",
    summary: t("截至 2026-08-05，EPFL 当前入学考试页未提供按年份排列的完整数学真题下载库。官方 courseware 有专门数学练习，2027 考纲也列有参考书和公式表；两者均不是历年真题。", "As of 2026-08-05, EPFL's current examination page does not provide a year-by-year archive of complete Mathematics papers. Official courseware offers dedicated exercises and the 2027 programme provides references and a formula sheet; neither is a past-paper archive."),
    links: [
      paperLink("EPFL 入学考试数学练习", "EPFL Entrance-Examination Mathematics Exercises", "EPFL", "EPFL", "https://courseware.epfl.ch/courses/course-v1%3AEPFL%2BadmissionEPFL%2B2020/about", "specimen", "account", "官方练习集，覆盖分析、线性代数和解析几何；不是历年卷。", "Official exercise set covering analysis, linear algebra and analytic geometry; not past papers."),
      paperLink("EPFL 2027 数学考纲与公式表", "EPFL 2027 Mathematics Syllabus and Formula Sheet", "EPFL", "EPFL", "https://www.epfl.ch/education/admission/wp-content/uploads/2026/04/ProgrammeExAdm2027.pdf", "index", "free", "含正式范围、参考书和考场公式表。", "Contains the formal scope, references and supplied formula sheet."),
      paperLink("EPFL 入学考试主页", "EPFL Entrance Examination Hub", "EPFL", "EPFL", "https://www.epfl.ch/education/admission/admission-2/bachelor-admission-criteria-and-application/admission-examination/", "download-page", "free", "如后续发布样卷或真题，以此页为准。", "Use this page for any later sample or past-paper release."),
    ],
    lastVerified: VERIFIED_AT,
  },
];
