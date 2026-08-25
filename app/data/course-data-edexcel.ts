import {
  t,
  type AssessmentSyllabusRecord,
  type ContentSection,
  type DateRecord,
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
const PEARSON_ZH = "Pearson Edexcel";
const PEARSON_EN = "Pearson Edexcel";

const source = (
  id: string,
  labelZh: string,
  labelEn: string,
  url: string,
  kind: SourceRecord["kind"],
  appliesTo: string,
  noteZh?: string,
  noteEn?: string,
  ownerZh = PEARSON_ZH,
  ownerEn = PEARSON_EN,
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
  url: string,
  format: SyllabusSourceRecord["format"],
  versionZh?: string,
  versionEn?: string,
  noteZh?: string,
  noteEn?: string,
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(PEARSON_ZH, PEARSON_EN),
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
  provider: t(PEARSON_ZH, PEARSON_EN),
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
  url: string,
  kind: PastPaperLinkRecord["kind"],
  access: PastPaperLinkRecord["access"],
  noteZh: string,
  noteEn: string,
): PastPaperLinkRecord => ({
  title: t(titleZh, titleEn),
  provider: t(PEARSON_ZH, PEARSON_EN),
  url,
  authority: "official",
  kind,
  access,
  note: t(noteZh, noteEn),
});

export const edexcelCourseSources: SourceRecord[] = [
  source("edexcel-igcse-math-a-linear-overview", "International GCSE Mathematics A（线性）课程主页", "International GCSE Mathematics A (linear) qualification page", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-a-2016.html", "official", "4MA1"),
  source("edexcel-igcse-math-a-linear-spec", "International GCSE Mathematics A（线性）官方规范", "International GCSE Mathematics A (linear) specification", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-spec-a.pdf", "official", "4MA1; Issue 2, November 2017"),
  source("edexcel-igcse-math-a-linear-sam", "Mathematics A（线性）官方样题与评分标准", "Mathematics A (linear) sample assessment materials", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-samsa.pdf", "official-archive", "4MA1 specimen papers and mark schemes"),
  source("edexcel-igcse-math-a-linear-materials", "Mathematics A（线性）官方课程材料", "Mathematics A (linear) course materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-a-2016.coursematerials.html", "official-archive", "4MA1 teaching, assessment and past-exam materials", "最新试卷可能显示锁形图标并仅限注册中心访问。", "The newest papers may be padlocked and restricted to registered centres."),
  source("edexcel-igcse-math-a-modular-overview", "International GCSE Mathematics A（模块制）课程主页", "International GCSE Mathematics A (modular) qualification page", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/mathematics-a-2024-modular.html", "official", "4XMAF, 4XMAH, 4WM1F/H, 4WM2F/H"),
  source("edexcel-igcse-math-a-modular-spec", "International GCSE Mathematics A（模块制）官方规范", "International GCSE Mathematics A (modular) specification", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2024/specification-and-sample-assessments/int-gcse-mathematics-spec-a-modular.pdf", "official", "4XMAF/4XMAH; Issue 2, March 2024"),
  source("edexcel-igcse-math-a-modular-sam", "Mathematics A（模块制）官方样题与评分标准", "Mathematics A (modular) sample assessment materials", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2024/specification-and-sample-assessments/int-gcse-mathematics-sams-a-modular.pdf", "official-archive", "4WM1 and 4WM2 specimen papers and mark schemes"),
  source("edexcel-igcse-math-a-modular-materials", "Mathematics A（模块制）官方课程材料", "Mathematics A (modular) course materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/mathematics-a-2024-modular.coursematerials.html", "official-archive", "4XMAF/4XMAH teaching and assessment materials", "部分教师模拟卷可能受锁定访问限制。", "Some teacher mock materials may be access-restricted."),
  source("edexcel-igcse-math-b-overview", "International GCSE Mathematics B 课程主页", "International GCSE Mathematics B qualification page", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-b-2016.html", "official", "4MB1"),
  source("edexcel-igcse-math-b-spec", "International GCSE Mathematics B 官方规范", "International GCSE Mathematics B specification", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20B/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-spec-b.pdf", "official", "4MB1; Issue 1, January 2016"),
  source("edexcel-igcse-math-b-sam", "Mathematics B 官方样题与评分标准", "Mathematics B sample assessment materials", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20B/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-samsb.pdf", "official-archive", "4MB1 specimen papers and mark schemes"),
  source("edexcel-igcse-math-b-materials", "Mathematics B 官方课程材料", "Mathematics B course materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-b-2016.coursematerials.html", "official-archive", "4MB1 teaching, assessment and past-exam materials", "最新试卷可能仅限注册中心访问。", "The newest papers may be restricted to registered centres."),
  source("edexcel-igcse-fpm-overview", "International GCSE Further Pure Mathematics 课程主页", "International GCSE Further Pure Mathematics qualification page", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-further-pure-mathematics-2017.html", "official", "4PM1"),
  source("edexcel-igcse-fpm-spec", "International GCSE Further Pure Mathematics 官方规范", "International GCSE Further Pure Mathematics specification", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Further%20Pure%20Mathematics/2016/Specification%20and%20sample%20assessments/international-gcse-in-further-pure-mathematics-spec.pdf", "official", "4PM1; Issue 1, January 2016"),
  source("edexcel-igcse-fpm-sam", "Further Pure Mathematics 官方样题与评分标准", "Further Pure Mathematics sample assessment materials", "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Further%20Pure%20Mathematics/2016/Specification%20and%20sample%20assessments/international-gcse-in-further-pure-mathematics-sams.pdf", "official-archive", "4PM1 specimen papers and mark schemes"),
  source("edexcel-igcse-fpm-materials", "Further Pure Mathematics 官方课程材料", "Further Pure Mathematics course materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-further-pure-mathematics-2017.coursematerials.html", "official-archive", "4PM1 teaching, assessment and past-exam materials", "最新试卷可能仅限注册中心访问。", "The newest papers may be restricted to registered centres."),
  source("edexcel-igcse-maths-books", "Pearson International GCSE Mathematics 官方教材", "Pearson International GCSE Mathematics official published resources", "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/mathematics.html", "official", "Mathematics A linear and modular, and Mathematics B"),
  source("edexcel-igcse-fpm-book", "Pearson International GCSE Further Pure Mathematics 官方教材", "Pearson International GCSE Further Pure Mathematics official published resource", "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/further-pure-mathematics.html", "official", "4PM1"),
  source("edexcel-textbook-answers", "Pearson International GCSE 教材答案", "Pearson International GCSE textbook answers", "https://www.pearson.com/international-schools/international-gcse-answers.html", "official", "Pearson-published International GCSE student books"),

  source("edexcel-ial-maths-overview", "International A Level Mathematics 系列课程主页", "International A Level Mathematics family qualification page", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.html", "official", "XMA01/YMA01, XPM01/YPM01 and XFM01/YFM01"),
  source("edexcel-ial-maths-spec", "IAL Mathematics、Pure Mathematics 与 Further Mathematics 官方规范", "IAL Mathematics, Pure Mathematics and Further Mathematics specification", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/international-a-level-maths-spec.pdf", "official", "Issue 3, April 2019"),
  source("edexcel-ial-maths-sam", "IAL 数学系列官方样题与评分标准", "IAL Mathematics family sample assessment materials", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/International-A-Level-Maths-SAMs1.pdf", "official-archive", "All 14 mathematics units"),
  source("edexcel-ial-maths-materials", "IAL 数学系列官方课程与考试材料", "IAL Mathematics family course and exam materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.coursematerials.html", "official-archive", "All IAL mathematics units", "最新试卷通常在考试后十二个月内仅向注册中心开放。", "The newest papers are normally restricted to registered centres for twelve months after an examination."),
  source("edexcel-ial-formula-book", "IAL Mathematics 公式与统计表", "IAL Mathematics formulae and statistical tables", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/IAL-Mathematics-Formula-Book.pdf", "official", "All IAL mathematics units"),
  source("edexcel-ial-eligibility-calculator", "IAL Mathematics 组合资格计算器", "IAL Mathematics eligibility calculator", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018/international-a-level-maths-eligibility-calculator.html", "official", "Mathematics, Pure Mathematics and Further Mathematics cash-ins"),
  source("edexcel-ial-onboarding", "IAL Mathematics 官方入门指南", "IAL Mathematics onboarding guide", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/international-advanced-level-maths-onboarding-guide.pdf", "official", "IAL Mathematics family"),
  source("edexcel-ial-maths-books", "Pearson IAL Mathematics 官方单元教材", "Pearson IAL Mathematics official unit student books", "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-A-Level/mathematics.html", "official", "P1-P4, FP1-FP3, M1-M3, S1-S3 and D1"),

  source("edexcel-igcse-info-manual-2026-27", "Pearson International GCSE 2026/27 信息手册", "Pearson International GCSE Information Manual 2026/27", "https://qualifications.pearson.com/content/dam/pdf/Support/Information-manual/6-international-gcse-2026-2027.pdf", "official", "2026/27 entries, availability and regional-paper rules", "中国是适用科目的强制 R 卷地区；R 卷在 6 月提供，11 月不提供。", "China is a mandatory R-paper country where applicable; R papers are offered in June, not November."),
  source("edexcel-igcse-nov-2026-timetable", "International GCSE 2026 年 11 月最终时间表", "International GCSE November 2026 final timetable", "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-Edexcel-International-GCSE/intgcse-nov-2026-final.pdf", "official", "November 2026 International GCSE"),
  source("edexcel-igcse-r-summer-2027-timetable", "International GCSE 2027 年夏季 R 卷最终时间表", "International GCSE R-paper Summer 2027 final timetable", "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-Edexcel-International-GCSE/int-gcse-r-paper-summer-2027-final.pdf", "official", "June 2027 R papers, including China"),
  source("edexcel-ial-oct-2026-timetable", "International A Level 2026 年 10 月最终时间表", "International A Level October 2026 final timetable", "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-International-Advanced-Levels/ial-october2026-final.pdf", "official", "October 2026 IAL"),
  source("edexcel-ial-jan-2027-timetable", "International A Level 2027 年 1 月最终时间表", "International A Level January 2027 final timetable", "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-International-Advanced-Levels/ial-january-2027-final.pdf", "official", "January 2027 IAL"),
  source("edexcel-ial-summer-2027-timetable", "International A Level 2027 年夏季最终时间表", "International A Level Summer 2027 final timetable", "https://qualifications.pearson.com/content/dam/pdf/Support/Examination-timetables-for-International-Advanced-Levels/ial-summer-2027-final.pdf", "official", "Summer 2027 IAL"),
  source("edexcel-grade-boundaries", "Pearson 等级分数线总档案", "Pearson grade-boundary archive", "https://qualifications.pearson.com/en/support/support-topics/results-certification/grade-boundaries.html", "official-archive", "All Pearson Edexcel qualifications"),
  source("edexcel-igcse-boundaries-2025-11", "International GCSE 2025 年 11 月资格分数线", "International GCSE November 2025 qualification grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-GCSE/2511-international-gcse-subject-grade-boundaries.pdf", "official-data", "4MA1, 4MB1 and 4PM1; November 2025 series"),
  source("edexcel-igcse-modular-boundaries-2025-11", "International GCSE Modular 2025 年 11 月分数线", "International GCSE Modular November 2025 grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-GCSE/2511-international-gcse-modular-subject-grade-boundaries.pdf", "official-data", "4WM1/4WM2 and 4XMAF/4XMAH"),
  source("edexcel-ial-boundaries-2026-01", "International A Level 2026 年 1 月分数线", "International A Level January 2026 grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-A-level/2601-ial-subject-grade-boundaries.pdf", "official-data", "All IAL mathematics units and cash-ins; January 2026 series"),
  { ...source("edexcel-igcse-boundaries-2026-06", "International GCSE 2026 年 6 月资格分数线", "International GCSE June 2026 qualification grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-GCSE/grade-boundaries-june-2026-international-gcse.pdf", "official-data", "4MA1, 4MB1 and 4PM1; standard and R papers"), verifiedAt: "2026-08-25" },
  { ...source("edexcel-igcse-modular-boundaries-2026-06", "International GCSE Modular 2026 年 6 月分数线", "International GCSE Modular June 2026 grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-GCSE/grade-boundaries-june-2026-international-gcse-modular.pdf", "official-data", "4WM1/4WM2 standard and R units; 4XMAF/4XMAH cash-ins"), verifiedAt: "2026-08-25" },
  { ...source("edexcel-ial-boundaries-2026-06", "International A Level 2026 年 6 月分数线", "International A Level June 2026 grade boundaries", "https://qualifications.pearson.com/content/dam/pdf/Support/Grade-boundaries/International-A-level/grade-boundaries-june-2026-international-advanced-level.pdf", "official-data", "All IAL Mathematics, Pure Mathematics and Further Mathematics units, Unit A variants and cash-ins"), verifiedAt: "2026-08-25" },
  source("edexcel-past-paper-search", "Pearson 官方真题搜索", "Pearson official past-paper search", "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html", "official-archive", "All Pearson Edexcel qualifications"),
  source("edexcel-assessment-publication-policy", "Pearson 试卷资料发布政策", "Pearson qualification and assessment publication policy", "https://qualifications.pearson.com/content/dam/pdf/Support/policies-for-centres-learners-and-employees/qualification-assessment-publication-policy.pdf", "official", "Assessment-material access and copyright; Version 2.2, 23 May 2025", "试卷、评分标准和 examiner reports 受版权保护；最新材料通常锁定十二个月。", "Question papers, mark schemes and examiner reports remain copyrighted; the newest materials are normally locked for twelve months."),
  source("edexcel-private-candidates", "Pearson 社会考生报名说明", "Pearson private-candidate guidance", "https://qualifications.pearson.com/en/support/support-for-you/students/private-candidates.html", "official", "Private-candidate entries"),
  source("edexcel-find-centre", "Pearson 考点查询", "Pearson centre finder", "https://qualifications.pearson.com/en/support/support-topics/understanding-our-qualifications/find-a-pearson-centre.html", "official", "Finding an approved centre"),
  source("british-council-china-pearson", "英国文化教育协会中国 Pearson 考试报名", "British Council China Pearson exam registration", "https://www.britishcouncil.cn/exams/school/pearson", "official", "Private candidates in mainland China; live series-specific information", "截至 2026-08-05，页面列出北京、上海、广州、重庆、深圳、武汉、杭州；武汉和杭州只提供 International AS/A Level。", "As of 2026-08-05 the page lists Beijing, Shanghai, Guangzhou, Chongqing, Shenzhen, Wuhan and Hangzhou; Wuhan and Hangzhou offer International AS/A Level only.", "英国文化教育协会", "British Council"),
];

type IGCSESpec = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  shortTitle: string;
  code: string;
  summaryZh: string;
  summaryEn: string;
  specId: string;
  specUrl: string;
  specVersionZh: string;
  specVersionEn: string;
  overviewId: string;
  samId: string;
  samUrl: string;
  materialsId: string;
  materialsUrl: string;
  textbookId: string;
  textbookUrl: string;
  assessmentRows: TableRow[];
  contentRows: TableRow[];
  gradeZh: string;
  gradeEn: string;
  formulaZh: string;
  formulaEn: string;
  novemberRows: TableRow[];
  juneRows: TableRow[];
  dates: DateRecord[];
};

const igcseDate = (
  id: string,
  labelZh: string,
  labelEn: string,
  date: string,
  sourceId: string,
  noteZh: string,
  noteEn: string,
): DateRecord => ({
  id,
  label: t(labelZh, labelEn),
  date,
  region: t("中国大陆", "Mainland China"),
  status: "confirmed",
  sourceIds: [sourceId],
  note: t(noteZh, noteEn),
});

const igcseSpecs: IGCSESpec[] = [
  {
    id: "edexcel-igcse-mathematics-a-linear",
    slug: "edexcel-igcse-mathematics-a-linear",
    titleZh: "Pearson Edexcel International GCSE Mathematics A（线性）",
    titleEn: "Pearson Edexcel International GCSE Mathematics A (Linear)",
    shortTitle: "Edexcel IGCSE Mathematics A (Linear)",
    code: "4MA1",
    summaryZh: "两张同等级、同考季完成的计算器试卷。Foundation 面向 5–1，Higher 面向 9–4，并可在最终资格中授予 3。",
    summaryEn: "Two calculator papers at one tier, both taken in the same series. Foundation targets grades 5–1; Higher targets 9–4 and may award grade 3 at qualification level.",
    specId: "edexcel-igcse-math-a-linear-spec",
    specUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-spec-a.pdf",
    specVersionZh: "Issue 2，2017 年 11 月；2018 年 6 月首次考试",
    specVersionEn: "Issue 2, November 2017; first assessment June 2018",
    overviewId: "edexcel-igcse-math-a-linear-overview",
    samId: "edexcel-igcse-math-a-linear-sam",
    samUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-samsa.pdf",
    materialsId: "edexcel-igcse-math-a-linear-materials",
    materialsUrl: "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-a-2016.coursematerials.html",
    textbookId: "edexcel-igcse-maths-books",
    textbookUrl: "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/mathematics.html",
    assessmentRows: [
      row([["Foundation Paper 1F", "Foundation Paper 1F"], ["4MA1/1F", "4MA1/1F"], ["2 小时；100 分；50%；可用计算器", "2 hours; 100 marks; 50%; calculator allowed"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["Foundation Paper 2F", "Foundation Paper 2F"], ["4MA1/2F", "4MA1/2F"], ["2 小时；100 分；50%；可用计算器", "2 hours; 100 marks; 50%; calculator allowed"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["Higher Paper 1H", "Higher Paper 1H"], ["4MA1/1H", "4MA1/1H"], ["2 小时；100 分；50%；可用计算器", "2 hours; 100 marks; 50%; calculator allowed"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["Higher Paper 2H", "Higher Paper 2H"], ["4MA1/2H", "4MA1/2H"], ["2 小时；100 分；50%；可用计算器", "2 hours; 100 marks; 50%; calculator allowed"]], ["edexcel-igcse-math-a-linear-spec"]),
    ],
    contentRows: [
      row([["数与数系", "Number and the number system"], ["整数、分数、百分数、比例、估算、标准形式及计算", "Integers, fractions, percentages, ratio, estimation, standard form and calculation"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["方程、公式与恒等式", "Equations, formulae and identities"], ["代数式、方程与不等式、数列、函数和代数图像", "Expressions, equations and inequalities, sequences, functions and algebraic graphs"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["形状、空间与度量", "Shape, space and measures"], ["几何、坐标、变换、三角、测量、向量", "Geometry, coordinates, transformations, trigonometry, mensuration and vectors"]], ["edexcel-igcse-math-a-linear-spec"]),
      row([["数据处理", "Handling data"], ["统计表示、统计量、概率", "Statistical representation, measures and probability"]], ["edexcel-igcse-math-a-linear-spec"]),
    ],
    gradeZh: "Foundation：5–1；Higher：9–4，资格总评可授予 3。两卷必须在同一考季完成。",
    gradeEn: "Foundation: 5–1; Higher: 9–4, with grade 3 available at qualification level. Both papers must be taken in one series.",
    formulaZh: "两个等级均随试卷提供对应公式表；两卷均允许使用符合规定的计算器。",
    formulaEn: "A tier-specific formula sheet is supplied and an approved calculator is permitted on both papers.",
    novemberRows: [
      row([["Paper 1F/1H", "Paper 1F/1H"], ["2026-11-04 上午", "4 November 2026 AM"], ["普通卷；中国 11 月不使用 R 卷", "Standard paper; China does not use an R paper in November"]], ["edexcel-igcse-nov-2026-timetable", "edexcel-igcse-info-manual-2026-27"]),
      row([["Paper 2F/2H", "Paper 2F/2H"], ["2026-11-06 上午", "6 November 2026 AM"], ["普通卷", "Standard paper"]], ["edexcel-igcse-nov-2026-timetable"]),
    ],
    juneRows: [
      row([["Paper 1FR/1HR", "Paper 1FR/1HR"], ["2027-05-14 上午", "14 May 2027 AM"], ["中国使用 R 卷", "R paper used in China"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
      row([["Paper 2FR/2HR", "Paper 2FR/2HR"], ["2027-05-27 上午", "27 May 2027 AM"], ["中国使用 R 卷", "R paper used in China"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
    ],
    dates: [
      igcseDate("edexcel-4ma1-2026-nov-paper-1", "4MA1 2026 年 11 月 Paper 1", "4MA1 November 2026 Paper 1", "2026-11-04", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4ma1-2026-nov-paper-2", "4MA1 2026 年 11 月 Paper 2", "4MA1 November 2026 Paper 2", "2026-11-06", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4ma1-2027-june-paper-1r", "4MA1 2027 年夏季 Paper 1R", "4MA1 Summer 2027 Paper 1R", "2027-05-14", "edexcel-igcse-r-summer-2027-timetable", "上午；中国 R 卷；2 小时", "AM; China R paper; 2 hours"),
      igcseDate("edexcel-4ma1-2027-june-paper-2r", "4MA1 2027 年夏季 Paper 2R", "4MA1 Summer 2027 Paper 2R", "2027-05-27", "edexcel-igcse-r-summer-2027-timetable", "上午；中国 R 卷；2 小时", "AM; China R paper; 2 hours"),
    ],
  },
  {
    id: "edexcel-igcse-mathematics-a-modular",
    slug: "edexcel-igcse-mathematics-a-modular",
    titleZh: "Pearson Edexcel International GCSE Mathematics A（模块制）",
    titleEn: "Pearson Edexcel International GCSE Mathematics A (Modular)",
    shortTitle: "Edexcel IGCSE Mathematics A (Modular)",
    code: "4XMAF / 4XMAH",
    summaryZh: "与 Mathematics A 线性课程共享数学内容，但拆为两个可分考季完成、可保留成绩和重考的单元；取得资格必须提交 cash-in。",
    summaryEn: "Uses the Mathematics A content but divides assessment into two bankable and resittable units. A cash-in entry is required for the qualification grade.",
    specId: "edexcel-igcse-math-a-modular-spec",
    specUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2024/specification-and-sample-assessments/int-gcse-mathematics-spec-a-modular.pdf",
    specVersionZh: "Issue 2，2024 年 3 月；2025 年 6 月首次单元考试及认证",
    specVersionEn: "Issue 2, March 2024; first unit assessment and certification June 2025",
    overviewId: "edexcel-igcse-math-a-modular-overview",
    samId: "edexcel-igcse-math-a-modular-sam",
    samUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20A/2024/specification-and-sample-assessments/int-gcse-mathematics-sams-a-modular.pdf",
    materialsId: "edexcel-igcse-math-a-modular-materials",
    materialsUrl: "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/mathematics-a-2024-modular.coursematerials.html",
    textbookId: "edexcel-igcse-maths-books",
    textbookUrl: "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/mathematics.html",
    assessmentRows: [
      row([["Foundation Unit 1", "Foundation Unit 1"], ["4WM1F/01", "4WM1F/01"], ["2 小时；100 原始分；120 UMS；50%", "2 hours; 100 raw marks; 120 UMS; 50%"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["Foundation Unit 2", "Foundation Unit 2"], ["4WM2F/01", "4WM2F/01"], ["2 小时；100 原始分；120 UMS；50%", "2 hours; 100 raw marks; 120 UMS; 50%"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["Higher Unit 1", "Higher Unit 1"], ["4WM1H/01", "4WM1H/01"], ["2 小时；100 原始分；120 UMS；50%", "2 hours; 100 raw marks; 120 UMS; 50%"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["Higher Unit 2", "Higher Unit 2"], ["4WM2H/01", "4WM2H/01"], ["2 小时；100 原始分；120 UMS；50%", "2 hours; 100 raw marks; 120 UMS; 50%"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["资格代码", "Qualification cash-in"], ["Foundation 4XMAF；Higher 4XMAH", "Foundation 4XMAF; Higher 4XMAH"], ["两个单元成绩不会自动生成资格等级，必须申请 cash-in", "Unit results do not create a qualification grade automatically; cash-in is required"]], ["edexcel-igcse-math-a-modular-spec"]),
    ],
    contentRows: [
      row([["Module 1", "Module 1"], ["规范指定的第一阶段数、代数、几何和数据处理内容", "The specification's first-stage number, algebra, geometry and handling-data content"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["Module 2", "Module 2"], ["在 Module 1 基础上完成剩余内容；Unit 2 可考查 Module 1 的先备知识", "Completes the remaining content; Unit 2 may draw on knowledge established in Module 1"]], ["edexcel-igcse-math-a-modular-spec"]),
      row([["成绩保留", "Banking and resits"], ["单元可分考季完成并保留 UMS；可重考，认证时按 Pearson 现行规则选用结果", "Units may be taken in different series and banked in UMS; resits are permitted and current Pearson rules determine the result used at cash-in"]], ["edexcel-igcse-math-a-modular-spec"]),
    ],
    gradeZh: "每单元满分 120 UMS，资格满分 240 UMS。原始分线每考季变化；cash-in 等级线按固定 UMS 标尺计算。",
    gradeEn: "Each unit is worth 120 UMS and the qualification 240 UMS. Raw boundaries vary by series; cash-in grades use the fixed UMS scale.",
    formulaZh: "四张单元卷均允许计算器，并提供对应等级的公式表。",
    formulaEn: "A calculator and the relevant tier formula sheet are provided for each unit paper.",
    novemberRows: [
      row([["Unit 1F/1H", "Unit 1F/1H"], ["2026-11-04 上午", "4 November 2026 AM"], ["普通卷", "Standard paper"]], ["edexcel-igcse-nov-2026-timetable"]),
      row([["Unit 2F/2H", "Unit 2F/2H"], ["2026-11-06 上午", "6 November 2026 AM"], ["普通卷", "Standard paper"]], ["edexcel-igcse-nov-2026-timetable"]),
    ],
    juneRows: [
      row([["Unit 1FR/1HR", "Unit 1FR/1HR"], ["2027-05-14 上午", "14 May 2027 AM"], ["中国使用 R 卷", "R paper used in China"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
      row([["Unit 2FR/2HR", "Unit 2FR/2HR"], ["2027-05-27 上午", "27 May 2027 AM"], ["中国使用 R 卷", "R paper used in China"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
    ],
    dates: [
      igcseDate("edexcel-4wma-2026-nov-unit-1", "模块制 Math A 2026 年 11 月 Unit 1", "Modular Math A November 2026 Unit 1", "2026-11-04", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4wma-2026-nov-unit-2", "模块制 Math A 2026 年 11 月 Unit 2", "Modular Math A November 2026 Unit 2", "2026-11-06", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4wma-2027-june-unit-1r", "模块制 Math A 2027 年夏季 Unit 1R", "Modular Math A Summer 2027 Unit 1R", "2027-05-14", "edexcel-igcse-r-summer-2027-timetable", "上午；中国 R 卷；2 小时", "AM; China R paper; 2 hours"),
      igcseDate("edexcel-4wma-2027-june-unit-2r", "模块制 Math A 2027 年夏季 Unit 2R", "Modular Math A Summer 2027 Unit 2R", "2027-05-27", "edexcel-igcse-r-summer-2027-timetable", "上午；中国 R 卷；2 小时", "AM; China R paper; 2 hours"),
    ],
  },
  {
    id: "edexcel-igcse-mathematics-b",
    slug: "edexcel-igcse-mathematics-b",
    titleZh: "Pearson Edexcel International GCSE Mathematics B",
    titleEn: "Pearson Edexcel International GCSE Mathematics B",
    shortTitle: "Edexcel IGCSE Mathematics B",
    code: "4MB1",
    summaryZh: "单一难度的线性资格，两张计算器试卷权重不同；课程含集合、函数、矩阵和向量等内容。",
    summaryEn: "A single-tier linear qualification with two differently weighted calculator papers; content includes sets, functions, matrices and vectors.",
    specId: "edexcel-igcse-math-b-spec",
    specUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20B/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-spec-b.pdf",
    specVersionZh: "Issue 1，2016 年 1 月；2018 年 6 月首次考试",
    specVersionEn: "Issue 1, January 2016; first assessment June 2018",
    overviewId: "edexcel-igcse-math-b-overview",
    samId: "edexcel-igcse-math-b-sam",
    samUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Mathematics%20B/2016/Specification%20and%20sample%20assessments/international-gcse-in-mathematics-samsb.pdf",
    materialsId: "edexcel-igcse-math-b-materials",
    materialsUrl: "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-mathematics-b-2016.coursematerials.html",
    textbookId: "edexcel-igcse-maths-books",
    textbookUrl: "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/mathematics.html",
    assessmentRows: [
      row([["Paper 1", "Paper 1"], ["4MB1/01", "4MB1/01"], ["1 小时 30 分；100 原始分；33⅓%；约 26–30 题；可用计算器", "1 hour 30 minutes; 100 raw marks; 33⅓%; approximately 26–30 questions; calculator allowed"]], ["edexcel-igcse-math-b-spec"]),
      row([["Paper 2", "Paper 2"], ["4MB1/02", "4MB1/02"], ["2 小时 30 分；100 原始分；66⅔%；约 11–12 题；可用计算器", "2 hours 30 minutes; 100 raw marks; 66⅔%; approximately 11–12 questions; calculator allowed"]], ["edexcel-igcse-math-b-spec"]),
    ],
    contentRows: [
      row([["数与代数", "Number and algebra"], ["数系、集合、代数式、方程、不等式、函数、矩阵和数列", "Number systems, sets, expressions, equations, inequalities, functions, matrices and sequences"]], ["edexcel-igcse-math-b-spec"]),
      row([["几何与三角", "Geometry and trigonometry"], ["坐标、图形、度量、三角、变换和向量", "Coordinates, shape, mensuration, trigonometry, transformations and vectors"]], ["edexcel-igcse-math-b-spec"]),
      row([["统计与概率", "Statistics and probability"], ["数据展示与分析、概率规则及分布", "Data representation and analysis, probability rules and distributions"]], ["edexcel-igcse-math-b-spec"]),
    ],
    gradeZh: "单一难度，目标等级 9–4；资格总评可授予 3。资格分数线按试卷权重缩放，不能把两张 100 原始分试卷直接按 200 分相加。",
    gradeEn: "Single tier targeting grades 9–4, with grade 3 available at qualification level. Qualification boundaries use weighted scaling; the two 100-raw-mark papers must not simply be totalled as 200.",
    formulaZh: "两卷均可使用计算器。规范没有单独发放的公式表；Paper 2 若需使用附录列出的公式，公式印在对应题目末尾。",
    formulaEn: "Calculators are allowed on both papers. No separate formula sheet is supplied; when a formula from the specification appendix is required in Paper 2, it is printed at the end of that question.",
    novemberRows: [
      row([["Paper 1", "Paper 1"], ["2026-10-29 上午", "29 October 2026 AM"], ["普通卷；1 小时 30 分", "Standard paper; 1 hour 30 minutes"]], ["edexcel-igcse-nov-2026-timetable"]),
      row([["Paper 2", "Paper 2"], ["2026-11-09 上午", "9 November 2026 AM"], ["普通卷；2 小时 30 分", "Standard paper; 2 hours 30 minutes"]], ["edexcel-igcse-nov-2026-timetable"]),
    ],
    juneRows: [
      row([["Paper 1R", "Paper 1R"], ["2027-06-07 下午", "7 June 2027 PM"], ["中国 R 卷；1 小时 30 分", "China R paper; 1 hour 30 minutes"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
      row([["Paper 2R", "Paper 2R"], ["2027-06-14 上午", "14 June 2027 AM"], ["中国 R 卷；2 小时 30 分", "China R paper; 2 hours 30 minutes"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
    ],
    dates: [
      igcseDate("edexcel-4mb1-2026-nov-paper-1", "4MB1 2026 年 11 月 Paper 1", "4MB1 November 2026 Paper 1", "2026-10-29", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；1 小时 30 分", "AM; standard paper; 1 hour 30 minutes"),
      igcseDate("edexcel-4mb1-2026-nov-paper-2", "4MB1 2026 年 11 月 Paper 2", "4MB1 November 2026 Paper 2", "2026-11-09", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时 30 分", "AM; standard paper; 2 hours 30 minutes"),
      igcseDate("edexcel-4mb1-2027-june-paper-1r", "4MB1 2027 年夏季 Paper 1R", "4MB1 Summer 2027 Paper 1R", "2027-06-07", "edexcel-igcse-r-summer-2027-timetable", "下午；中国 R 卷；1 小时 30 分", "PM; China R paper; 1 hour 30 minutes"),
      igcseDate("edexcel-4mb1-2027-june-paper-2r", "4MB1 2027 年夏季 Paper 2R", "4MB1 Summer 2027 Paper 2R", "2027-06-14", "edexcel-igcse-r-summer-2027-timetable", "上午；中国 R 卷；2 小时 30 分", "AM; China R paper; 2 hours 30 minutes"),
    ],
  },
  {
    id: "edexcel-igcse-further-pure-mathematics",
    slug: "edexcel-igcse-further-pure-mathematics",
    titleZh: "Pearson Edexcel International GCSE Further Pure Mathematics",
    titleEn: "Pearson Edexcel International GCSE Further Pure Mathematics",
    shortTitle: "Edexcel IGCSE Further Pure Mathematics",
    code: "4PM1",
    summaryZh: "面向已扎实掌握 Mathematics A Higher 或 Mathematics B 的学生，覆盖代数、三角、向量、级数和微积分。",
    summaryEn: "For students with secure Mathematics A Higher or Mathematics B knowledge, extending into algebra, trigonometry, vectors, series and calculus.",
    specId: "edexcel-igcse-fpm-spec",
    specUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Further%20Pure%20Mathematics/2016/Specification%20and%20sample%20assessments/international-gcse-in-further-pure-mathematics-spec.pdf",
    specVersionZh: "Issue 1，2016 年 1 月；2019 年 6 月首次考试",
    specVersionEn: "Issue 1, January 2016; first assessment June 2019",
    overviewId: "edexcel-igcse-fpm-overview",
    samId: "edexcel-igcse-fpm-sam",
    samUrl: "https://qualifications.pearson.com/content/dam/pdf/International%20GCSE/Further%20Pure%20Mathematics/2016/Specification%20and%20sample%20assessments/international-gcse-in-further-pure-mathematics-sams.pdf",
    materialsId: "edexcel-igcse-fpm-materials",
    materialsUrl: "https://qualifications.pearson.com/en/qualifications/edexcel-international-gcses/international-gcse-further-pure-mathematics-2017.coursematerials.html",
    textbookId: "edexcel-igcse-fpm-book",
    textbookUrl: "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-GCSE/further-pure-mathematics.html",
    assessmentRows: [
      row([["Paper 1", "Paper 1"], ["4PM1/01", "4PM1/01"], ["2 小时；100 分；50%；约 11 题；可用计算器", "2 hours; 100 marks; 50%; approximately 11 questions; calculator allowed"]], ["edexcel-igcse-fpm-spec"]),
      row([["Paper 2", "Paper 2"], ["4PM1/02", "4PM1/02"], ["2 小时；100 分；50%；约 11 题；可用计算器", "2 hours; 100 marks; 50%; approximately 11 questions; calculator allowed"]], ["edexcel-igcse-fpm-spec"]),
    ],
    contentRows: [
      row([["代数与函数", "Algebra and functions"], ["对数与指数、二次函数、恒等式与不等式、图像", "Logarithms and indices, quadratics, identities and inequalities, graphs"]], ["edexcel-igcse-fpm-spec"]),
      row([["级数", "Series"], ["等差与等比级数、二项式级数", "Arithmetic and geometric series, binomial series"]], ["edexcel-igcse-fpm-spec"]),
      row([["几何与向量", "Geometry and vectors"], ["直角坐标、向量和三角", "Cartesian coordinates, vectors and trigonometry"]], ["edexcel-igcse-fpm-spec"]),
      row([["微积分", "Calculus"], ["微分、积分及其应用", "Differentiation, integration and applications"]], ["edexcel-igcse-fpm-spec"]),
    ],
    gradeZh: "单一难度，目标等级 9–4；资格总评可授予 3。两张试卷必须在同一考季完成。",
    gradeEn: "Single tier targeting grades 9–4, with grade 3 available at qualification level. Both papers must be taken in one series.",
    formulaZh: "两卷均允许计算器，并提供官方公式表。",
    formulaEn: "Calculators are permitted on both papers and the official formula sheet is supplied.",
    novemberRows: [
      row([["Paper 1", "Paper 1"], ["2026-10-30 上午", "30 October 2026 AM"], ["普通卷；2 小时", "Standard paper; 2 hours"]], ["edexcel-igcse-nov-2026-timetable"]),
      row([["Paper 2", "Paper 2"], ["2026-11-10 上午", "10 November 2026 AM"], ["普通卷；2 小时", "Standard paper; 2 hours"]], ["edexcel-igcse-nov-2026-timetable"]),
    ],
    juneRows: [
      row([["Paper 1R", "Paper 1R"], ["2027-05-19 下午", "19 May 2027 PM"], ["中国 R 卷；2 小时", "China R paper; 2 hours"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
      row([["Paper 2R", "Paper 2R"], ["2027-06-09 下午", "9 June 2027 PM"], ["中国 R 卷；2 小时", "China R paper; 2 hours"]], ["edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-info-manual-2026-27"]),
    ],
    dates: [
      igcseDate("edexcel-4pm1-2026-nov-paper-1", "4PM1 2026 年 11 月 Paper 1", "4PM1 November 2026 Paper 1", "2026-10-30", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4pm1-2026-nov-paper-2", "4PM1 2026 年 11 月 Paper 2", "4PM1 November 2026 Paper 2", "2026-11-10", "edexcel-igcse-nov-2026-timetable", "上午；普通卷；2 小时", "AM; standard paper; 2 hours"),
      igcseDate("edexcel-4pm1-2027-june-paper-1r", "4PM1 2027 年夏季 Paper 1R", "4PM1 Summer 2027 Paper 1R", "2027-05-19", "edexcel-igcse-r-summer-2027-timetable", "下午；中国 R 卷；2 小时", "PM; China R paper; 2 hours"),
      igcseDate("edexcel-4pm1-2027-june-paper-2r", "4PM1 2027 年夏季 Paper 2R", "4PM1 Summer 2027 Paper 2R", "2027-06-09", "edexcel-igcse-r-summer-2027-timetable", "下午；中国 R 卷；2 小时", "PM; China R paper; 2 hours"),
    ],
  },
];

const chinaRegistrationSection = (level: "igcse" | "ial", specificationId: string): ContentSection => ({
  id: "china-registration",
  title: t("中国学生报名", "Registration for students in China"),
  tables: [
    {
      columns: [t("情况", "Situation"), t("报名与核对事项", "Entry route and checks")],
      rows: [
        row(
          [
            ["Pearson 注册学校在读生", "Student at a Pearson-approved school"],
            ["由本校 exams officer 报名。确认资格代码、等级或单元、考季以及是否需要 cash-in；考生不能直接向 Pearson 个人订卷。", "Entry is made by the school's exams officer. Confirm the qualification code, tier or units, series and any cash-in requirement; an individual cannot order a paper directly from Pearson."],
          ],
          [specificationId, "edexcel-private-candidates"],
        ),
        row(
          [
            ["社会考生", "Private candidate"],
            ["先联系愿意接收社会考生的 Pearson 获批中心，或使用英国文化教育协会中国的当届报名服务。考点自行决定是否接收、费用、证件要求和内部截止日。", "Contact a Pearson-approved centre willing to accept private candidates, or use the current British Council China entry service. The centre decides acceptance, fees, ID requirements and internal deadlines."],
          ],
          ["edexcel-private-candidates", "edexcel-find-centre", "british-council-china-pearson"],
        ),
        ...(level === "igcse"
          ? [
              row(
                [
                  ["中国 R 卷", "R papers in China"],
                  ["中国是适用科目的强制 R 卷地区。6 月使用 R 卷代码；11 月不提供 R 卷，因此使用普通卷。历年真题和分数线必须按同一卷型比较。", "China is a mandatory R-paper country where applicable. June entries use R-paper codes; no R paper is offered in November, so the standard paper is used. Past papers and boundaries must be compared within the same paper type."],
                ],
                ["edexcel-igcse-info-manual-2026-27", "edexcel-igcse-r-summer-2027-timetable", "edexcel-igcse-nov-2026-timetable"],
              ),
              row(
                [
                  ["英国文化教育协会中国考点", "British Council China locations"],
                  ["截至 2026-08-05，公开页列出北京、上海、广州、重庆、深圳、武汉和杭州；武汉、杭州当前不提供 International GCSE。实际城市和科目以当届报名页为准。", "As of 2026-08-05 the public page lists Beijing, Shanghai, Guangzhou, Chongqing, Shenzhen, Wuhan and Hangzhou; Wuhan and Hangzhou do not currently offer International GCSE. Use the live series page for actual cities and subjects."],
                ],
                ["british-council-china-pearson"],
              ),
            ]
          : [
              row(
                [
                  ["英国文化教育协会中国考点", "British Council China locations"],
                  ["截至 2026-08-05，公开页列出北京、上海、广州、重庆、深圳、武汉和杭州，七地均提供 International AS/A Level。实际城市、科目和名额以当届报名页为准。", "As of 2026-08-05 the public page lists Beijing, Shanghai, Guangzhou, Chongqing, Shenzhen, Wuhan and Hangzhou, all offering International AS/A Level. Use the live series page for actual cities, subjects and capacity."],
                ],
                ["british-council-china-pearson"],
              ),
              row(
                [
                  ["2026 年 10 月考季报名", "October 2026 registration"],
                  ["英国文化教育协会中国公开的标准报名截止为 2026-08-21 17:00，晚报名截止为 2026-09-15 17:00（中国时间）。该日期只适用于此考季，学校内部截止日可能更早。", "British Council China lists 21 August 2026 at 17:00 as the standard deadline and 15 September 2026 at 17:00 China time as the late deadline. These dates apply only to this series; school deadlines may be earlier."],
                ],
                ["british-council-china-pearson"],
              ),
            ]),
      ],
    },
  ],
});

const accessSection = (
  spec: Pick<IGCSESpec, "specId" | "samId" | "materialsId" | "textbookId">,
): ContentSection => ({
  id: "official-materials",
  title: t("官方规范、样题、真题与教材", "Official specification, specimens, past papers and textbooks"),
  tables: [
    {
      columns: [t("资料", "Material"), t("访问与使用", "Access and use")],
      rows: [
        row([["Specification", "Specification"], ["免费公开；课程内容、考试结构和规则的首要依据", "Public and free; the primary source for content, assessment structure and rules"]], [spec.specId]),
        row([["Sample Assessment Materials（SAM）", "Sample Assessment Materials (SAM)"], ["免费公开；包含 specimen papers 和 mark schemes", "Public and free; includes specimen papers and mark schemes"]], [spec.samId]),
        row([["Course materials / past exam materials", "Course materials / past exam materials"], ["公开页可检索材料；最新试卷可能显示锁形图标并仅向注册中心开放", "Materials can be searched on the public page; the newest papers may be padlocked for registered centres"]], [spec.materialsId, "edexcel-past-paper-search", "edexcel-assessment-publication-policy"]),
        row([["Pearson 官方教材", "Pearson official textbooks"], ["目录和样章可公开查看；完整教材通常付费购买，答案以官方答案页的可用范围为准", "The catalogue and samples are public; full books are normally paid, with answers available only where Pearson publishes them"]], [spec.textbookId, "edexcel-textbook-answers"]),
      ],
      note: t("本站只链接网络公开或获授权访问的材料，不重新托管 Pearson 版权试卷、评分标准或教材。", "This site links to public or authorised material and does not re-host copyrighted Pearson papers, mark schemes or textbooks."),
    },
  ],
});

const igcseSections = (spec: IGCSESpec): ContentSection[] => [
  {
    id: "assessment-structure",
    title: t("考试结构", "Assessment structure"),
    paragraphs: [t(spec.formulaZh, spec.formulaEn)],
    tables: [{ columns: [t("试卷／单元", "Paper / unit"), t("代码", "Code"), t("时间、分数与权重", "Time, marks and weighting")], rows: spec.assessmentRows }],
  },
  {
    id: "syllabus-content",
    title: t("课程内容", "Syllabus content"),
    tables: [{ columns: [t("领域", "Area"), t("范围", "Scope")], rows: spec.contentRows }],
  },
  {
    id: "latest-exam-dates",
    title: t("最新已公布考期", "Latest published exam series"),
    tables: [
      { title: t("2026 年 11 月", "November 2026"), columns: [t("试卷", "Paper"), t("日期与时段", "Date and session"), t("中国考生", "Candidates in China")], rows: spec.novemberRows },
      { title: t("2027 年夏季", "Summer 2027"), columns: [t("试卷", "Paper"), t("日期与时段", "Date and session"), t("中国考生", "Candidates in China")], rows: spec.juneRows },
    ],
  },
  chinaRegistrationSection("igcse", spec.specId),
  {
    id: "grades-and-boundaries",
    title: t("成绩与分数线", "Grades and boundaries"),
    paragraphs: [
      t(spec.gradeZh, spec.gradeEn),
      t("Pearson 每个考季公布资格总分线；paper-level notional boundary 只用于理解单卷表现，不是证书等级线。不同考季、普通卷与 R 卷、Foundation 与 Higher 的边界不得合并为固定分数线。", "Pearson publishes qualification boundaries after each series. Paper-level notional boundaries describe performance on an individual paper but do not determine the certificate grade. Boundaries from different series, standard and R papers, and Foundation and Higher must not be merged into one fixed cutoff."),
      t("Pearson 已发布 2026 年 6 月官方分数线。本页分别保留普通卷与 R 卷、Foundation 与 Higher、模块单元原始分与固定 UMS；这些边界不得跨卷型或考季混用。", "Pearson has published the official June 2026 boundaries. This page keeps standard and R papers, Foundation and Higher tiers, unit raw marks and fixed UMS separate; boundaries must not be reused across forms or series."),
    ],
  },
  accessSection(spec),
];

const igcseProjects: ProjectRecord[] = igcseSpecs.map((spec) => ({
  id: spec.id,
  slug: spec.slug,
  track: "curriculum",
  title: t(spec.titleZh, spec.titleEn),
  shortTitle: spec.shortTitle,
  organizer: t(PEARSON_ZH, PEARSON_EN),
  summary: t(spec.summaryZh, spec.summaryEn),
  regions: ["global", "china", "uk-curriculum"],
  gradeBands: ["middle-school", "high-school"],
  eligibilityTags: ["school-entry", "private-candidate-centre-entry", "china-r-paper-in-june"],
  formatTags: ["course-and-exam", spec.id.includes("modular") ? "modular" : "linear", "calculator"],
  costBand: "varies",
  status: "confirmed",
  cycle: "November 2026 / Summer 2027",
  lastVerified: "2026-08-25",
  facts: [
    fact("资格代码", "Qualification code", spec.code, spec.code, [spec.specId]),
    fact("规范版本", "Specification version", spec.specVersionZh, spec.specVersionEn, [spec.specId]),
    fact("考试结构", "Assessment structure", spec.assessmentRows.map((item) => item.cells[0].zh).join("；"), spec.assessmentRows.map((item) => item.cells[0].en).join("; "), [spec.specId]),
    fact("计算器与公式", "Calculator and formulae", spec.formulaZh, spec.formulaEn, [spec.specId]),
    fact("成绩等级", "Grades", spec.gradeZh, spec.gradeEn, [spec.specId, "edexcel-grade-boundaries"]),
    fact("中国卷型", "Paper type in China", "11 月使用普通卷；6 月使用适用科目的 R 卷", "Standard papers in November; R papers where applicable in June", ["edexcel-igcse-info-manual-2026-27"]),
    fact("中国报名", "Registration in China", "由学校 exams officer、接收社会考生的获批中心或当届英国文化教育协会中国服务报名", "Through a school exams officer, an approved centre accepting private candidates, or the current British Council China service", ["edexcel-private-candidates", "british-council-china-pearson"]),
  ],
  dates: spec.dates,
  sections: igcseSections(spec),
  sourceIds: [
    spec.overviewId,
    spec.specId,
    spec.samId,
    spec.materialsId,
    spec.textbookId,
    "edexcel-textbook-answers",
    "edexcel-igcse-info-manual-2026-27",
    "edexcel-igcse-nov-2026-timetable",
    "edexcel-igcse-r-summer-2027-timetable",
    "edexcel-grade-boundaries",
    spec.id.includes("modular") ? "edexcel-igcse-modular-boundaries-2025-11" : "edexcel-igcse-boundaries-2025-11",
    spec.id.includes("modular") ? "edexcel-igcse-modular-boundaries-2026-06" : "edexcel-igcse-boundaries-2026-06",
    "edexcel-past-paper-search",
    "edexcel-assessment-publication-policy",
    "edexcel-private-candidates",
    "edexcel-find-centre",
    "british-council-china-pearson",
  ],
  relatedIds: igcseSpecs.filter((item) => item.id !== spec.id).map((item) => item.id),
  searchTerms: [spec.code, spec.shortTitle, spec.titleZh, spec.titleEn, "Pearson Edexcel 数学", "R paper", "中国报名"],
}));

type IALUnitKey =
  | "P1" | "P2" | "P3" | "P4"
  | "FP1" | "FP2" | "FP3"
  | "M1" | "M2" | "M3"
  | "S1" | "S2" | "S3"
  | "D1";

type IALUnit = {
  key: IALUnitKey;
  code: string;
  titleZh: string;
  titleEn: string;
  availabilityZh: string;
  availabilityEn: string;
  scopeZh: string;
  scopeEn: string;
};

const ialUnits: IALUnit[] = [
  { key: "P1", code: "WMA11/01", titleZh: "Pure Mathematics 1", titleEn: "Pure Mathematics 1", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "代数与函数、坐标几何、三角、微分与积分基础", scopeEn: "Algebra and functions, coordinate geometry, trigonometry, introductory differentiation and integration" },
  { key: "P2", code: "WMA12/01", titleZh: "Pure Mathematics 2", titleEn: "Pure Mathematics 2", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "证明、数列、指数与对数、三角及进一步微积分", scopeEn: "Proof, sequences, exponentials and logarithms, trigonometry and further calculus" },
  { key: "P3", code: "WMA13/01", titleZh: "Pure Mathematics 3", titleEn: "Pure Mathematics 3", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "函数、三角、指数对数、微积分和数值方法", scopeEn: "Functions, trigonometry, exponentials and logarithms, calculus and numerical methods" },
  { key: "P4", code: "WMA14/01", titleZh: "Pure Mathematics 4", titleEn: "Pure Mathematics 4", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "证明、代数、二项式展开、微积分和向量", scopeEn: "Proof, algebra, binomial expansion, calculus and vectors" },
  { key: "FP1", code: "WFM01/01", titleZh: "Further Pure Mathematics 1", titleEn: "Further Pure Mathematics 1", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "复数、矩阵、级数、证明及进阶代数", scopeEn: "Complex numbers, matrices, series, proof and advanced algebra" },
  { key: "FP2", code: "WFM02/01", titleZh: "Further Pure Mathematics 2", titleEn: "Further Pure Mathematics 2", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "进一步复数、微积分、微分方程和坐标方法", scopeEn: "Further complex numbers, calculus, differential equations and coordinate methods" },
  { key: "FP3", code: "WFM03/01", titleZh: "Further Pure Mathematics 3", titleEn: "Further Pure Mathematics 3", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "双曲函数、进一步矩阵、微积分及微分方程", scopeEn: "Hyperbolic functions, further matrices, calculus and differential equations" },
  { key: "M1", code: "WME01/01", titleZh: "Mechanics 1", titleEn: "Mechanics 1", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "运动学、动力学、静力学、力矩和向量", scopeEn: "Kinematics, dynamics, statics, moments and vectors" },
  { key: "M2", code: "WME02/01", titleZh: "Mechanics 2", titleEn: "Mechanics 2", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "进一步运动学、质心、功与能、碰撞", scopeEn: "Further kinematics, centres of mass, work and energy, collisions" },
  { key: "M3", code: "WME03/01", titleZh: "Mechanics 3", titleEn: "Mechanics 3", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "进一步刚体、圆周运动、变力和简谐运动", scopeEn: "Further rigid bodies, circular motion, variable forces and simple harmonic motion" },
  { key: "S1", code: "WST01/01", titleZh: "Statistics 1", titleEn: "Statistics 1", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "数据表示、概率、相关与回归、离散分布和正态分布", scopeEn: "Data representation, probability, correlation and regression, discrete and normal distributions" },
  { key: "S2", code: "WST02/01", titleZh: "Statistics 2", titleEn: "Statistics 2", availabilityZh: "10 月、1 月、6 月", availabilityEn: "October, January and June", scopeZh: "二项与泊松分布、连续分布、抽样和假设检验", scopeEn: "Binomial and Poisson distributions, continuous distributions, sampling and hypothesis tests" },
  { key: "S3", code: "WST03/01", titleZh: "Statistics 3", titleEn: "Statistics 3", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "组合分布、估计、拟合优度和进一步检验", scopeEn: "Combined distributions, estimation, goodness of fit and further testing" },
  { key: "D1", code: "WDM11/01", titleZh: "Decision Mathematics 1", titleEn: "Decision Mathematics 1", availabilityZh: "1 月、6 月", availabilityEn: "January and June", scopeZh: "算法、图论、网络、线性规划和关键路径分析", scopeEn: "Algorithms, graph theory, networks, linear programming and critical-path analysis" },
];

type IALExamDate = {
  unit: IALUnitKey;
  date: string;
  sessionZh: string;
  sessionEn: string;
};

const ialOctober2026: IALExamDate[] = [
  { unit: "P1", date: "2026-10-09", sessionZh: "上午", sessionEn: "AM" },
  { unit: "M1", date: "2026-10-13", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P2", date: "2026-10-15", sessionZh: "上午", sessionEn: "AM" },
  { unit: "S1", date: "2026-10-19", sessionZh: "上午", sessionEn: "AM" },
  { unit: "P3", date: "2026-10-21", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M2", date: "2026-10-22", sessionZh: "上午", sessionEn: "AM" },
  { unit: "S2", date: "2026-10-26", sessionZh: "上午", sessionEn: "AM" },
  { unit: "P4", date: "2026-10-28", sessionZh: "下午", sessionEn: "PM" },
];

const ialJanuary2027: IALExamDate[] = [
  { unit: "P1", date: "2027-01-08", sessionZh: "上午", sessionEn: "AM" },
  { unit: "S1", date: "2027-01-12", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P2", date: "2027-01-13", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M1", date: "2027-01-14", sessionZh: "上午", sessionEn: "AM" },
  { unit: "FP1", date: "2027-01-14", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P3", date: "2027-01-15", sessionZh: "下午", sessionEn: "PM" },
  { unit: "S2", date: "2027-01-18", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P4", date: "2027-01-19", sessionZh: "上午", sessionEn: "AM" },
  { unit: "D1", date: "2027-01-19", sessionZh: "下午", sessionEn: "PM" },
  { unit: "FP2", date: "2027-01-20", sessionZh: "上午", sessionEn: "AM" },
  { unit: "M2", date: "2027-01-20", sessionZh: "下午", sessionEn: "PM" },
  { unit: "FP3", date: "2027-01-21", sessionZh: "下午", sessionEn: "PM" },
  { unit: "S3", date: "2027-01-22", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M3", date: "2027-01-25", sessionZh: "下午", sessionEn: "PM" },
];

const ialSummer2027: IALExamDate[] = [
  { unit: "P1", date: "2027-05-06", sessionZh: "下午", sessionEn: "PM" },
  { unit: "S1", date: "2027-05-07", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P2", date: "2027-05-11", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M1", date: "2027-05-13", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P3", date: "2027-05-25", sessionZh: "下午", sessionEn: "PM" },
  { unit: "FP1", date: "2027-05-27", sessionZh: "下午", sessionEn: "PM" },
  { unit: "D1", date: "2027-06-01", sessionZh: "下午", sessionEn: "PM" },
  { unit: "S2", date: "2027-06-02", sessionZh: "下午", sessionEn: "PM" },
  { unit: "FP2", date: "2027-06-03", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M2", date: "2027-06-04", sessionZh: "下午", sessionEn: "PM" },
  { unit: "P4", date: "2027-06-07", sessionZh: "下午", sessionEn: "PM" },
  { unit: "FP3", date: "2027-06-08", sessionZh: "下午", sessionEn: "PM" },
  { unit: "S3", date: "2027-06-09", sessionZh: "下午", sessionEn: "PM" },
  { unit: "M3", date: "2027-06-10", sessionZh: "下午", sessionEn: "PM" },
];

type IALSpec = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  shortTitle: string;
  iasCode: string;
  ialCode: string;
  summaryZh: string;
  summaryEn: string;
  units: IALUnitKey[];
  combinationRows: TableRow[];
  restrictions: Array<[string, string]>;
  aStarZh: string;
  aStarEn: string;
};

const ialSpecs: IALSpec[] = [
  {
    id: "edexcel-ial-mathematics",
    slug: "edexcel-ial-mathematics",
    titleZh: "Pearson Edexcel International AS/A Level Mathematics",
    titleEn: "Pearson Edexcel International AS/A Level Mathematics",
    shortTitle: "Edexcel IAL Mathematics",
    iasCode: "XMA01",
    ialCode: "YMA01",
    summaryZh: "纯数学 P1–P4 与指定的力学、统计或决策单元组合成 IAS 或完整 IAL；单元成绩以 UMS 保留，必须申请 cash-in。",
    summaryEn: "Combines Pure Mathematics P1–P4 with prescribed mechanics, statistics or decision units. Unit results are banked in UMS and a cash-in is required.",
    units: ["P1", "P2", "P3", "P4", "M1", "M2", "S1", "S2", "D1"],
    combinationRows: [
      row([["IAS Mathematics", "IAS Mathematics"], ["XMA01", "XMA01"], ["P1 + P2 + M1／S1／D1 中任一单元", "P1 + P2 + any one of M1, S1 or D1"]], ["edexcel-ial-maths-spec"]),
      row([["IAL Mathematics", "IAL Mathematics"], ["YMA01", "YMA01"], ["P1 + P2 + P3 + P4，再选 M1+S1、M1+D1、M1+M2、S1+D1 或 S1+S2", "P1 + P2 + P3 + P4, plus one pair: M1+S1, M1+D1, M1+M2, S1+D1 or S1+S2"]], ["edexcel-ial-maths-spec"]),
    ],
    restrictions: [
      ["单元可分考季完成和重考；取得资格等级必须提交 XMA01 或 YMA01 cash-in。", "Units may be taken and resat across series; XMA01 or YMA01 cash-in is required for a qualification grade."],
      ["若同时申请 Further Mathematics，两个资格使用的单元必须互不重复。", "When Further Mathematics is also claimed, units used in the two qualifications must be distinct."],
    ],
    aStarZh: "IAL 总分至少 480/600 UMS，且 P3+P4 至少 180/200 UMS。",
    aStarEn: "At least 480/600 UMS overall and at least 180/200 UMS from P3 and P4.",
  },
  {
    id: "edexcel-ial-pure-mathematics",
    slug: "edexcel-ial-pure-mathematics",
    titleZh: "Pearson Edexcel International AS/A Level Pure Mathematics",
    titleEn: "Pearson Edexcel International AS/A Level Pure Mathematics",
    shortTitle: "Edexcel IAL Pure Mathematics",
    iasCode: "XPM01",
    ialCode: "YPM01",
    summaryZh: "只用纯数学与进一步纯数学单元组成的资格；它与 IAL Mathematics 共享 P1–P4，但有不同 cash-in 组合。",
    summaryEn: "A qualification made only from pure and further-pure units. It shares P1–P4 with IAL Mathematics but uses different cash-in combinations.",
    units: ["P1", "P2", "P3", "P4", "FP1", "FP2", "FP3"],
    combinationRows: [
      row([["IAS Pure Mathematics", "IAS Pure Mathematics"], ["XPM01", "XPM01"], ["P1 + P2 + FP1", "P1 + P2 + FP1"]], ["edexcel-ial-maths-spec"]),
      row([["IAL Pure Mathematics", "IAL Pure Mathematics"], ["YPM01", "YPM01"], ["P1 + P2 + P3 + P4 + FP1，再选 FP2 或 FP3", "P1 + P2 + P3 + P4 + FP1, plus either FP2 or FP3"]], ["edexcel-ial-maths-spec"]),
    ],
    restrictions: [
      ["同一考季不能同时取得 XMA01 与 XPM01，或同时取得 YMA01 与 YPM01并重复使用相同单元。", "XMA01 and XPM01, or YMA01 and YPM01, cannot be awarded in the same series using the same units."],
      ["认证会锁定已使用单元；计划后续 Mathematics 或 Further Mathematics 时，应先用官方 eligibility calculator 核对。", "Certification locks the units used; use the official eligibility calculator before planning a later Mathematics or Further Mathematics claim."],
    ],
    aStarZh: "IAL 总分至少 480/600 UMS，且资格中的三个 IA2 单元合计至少 270/300 UMS。",
    aStarEn: "At least 480/600 UMS overall and at least 270/300 UMS from the qualification's three IA2 units.",
  },
  {
    id: "edexcel-ial-further-mathematics",
    slug: "edexcel-ial-further-mathematics",
    titleZh: "Pearson Edexcel International AS/A Level Further Mathematics",
    titleEn: "Pearson Edexcel International AS/A Level Further Mathematics",
    shortTitle: "Edexcel IAL Further Mathematics",
    iasCode: "XFM01",
    ialCode: "YFM01",
    summaryZh: "以 FP1 为核心，并从进一步纯数学、力学、统计和决策单元中按规则组合；通常与 Mathematics 一并规划。",
    summaryEn: "Built around FP1 with prescribed combinations of further-pure, mechanics, statistics and decision units, normally planned alongside Mathematics.",
    units: ["FP1", "FP2", "FP3", "M1", "M2", "M3", "S1", "S2", "S3", "D1"],
    combinationRows: [
      row([["IAS Further Mathematics", "IAS Further Mathematics"], ["XFM01", "XFM01"], ["FP1 + 下列任意两个不同单元：FP2、FP3、M1、M2、M3、S1、S2、S3、D1", "FP1 plus any two distinct units from FP2, FP3, M1, M2, M3, S1, S2, S3 and D1"]], ["edexcel-ial-maths-spec"]),
      row([["IAL Further Mathematics 路线 A", "IAL Further Mathematics route A"], ["YFM01", "YFM01"], ["FP1 + FP2／FP3 中一个 + 四个应用单元", "FP1 + one of FP2 or FP3 + four application units"]], ["edexcel-ial-maths-spec"]),
      row([["IAL Further Mathematics 路线 B", "IAL Further Mathematics route B"], ["YFM01", "YFM01"], ["FP1 + FP2 + FP3 + 三个应用单元", "FP1 + FP2 + FP3 + three application units"]], ["edexcel-ial-maths-spec"]),
    ],
    restrictions: [
      ["取得 IAL Further Mathematics 前，必须已取得或同一考季同时取得 IAL Mathematics。", "IAL Further Mathematics cannot be awarded until IAL Mathematics has been awarded previously or concurrently."],
      ["Mathematics 与 Further Mathematics 同时认证需要 12 个不同单元；同一单元不能同时用于两个资格。", "Concurrent Mathematics and Further Mathematics certification requires 12 distinct units; a unit cannot be used in both qualifications."],
      ["组合较多，最终报名和 cash-in 前必须使用官方 eligibility calculator。", "Because many combinations are possible, use the official eligibility calculator before final unit entry and cash-in."],
    ],
    aStarZh: "IAL 总分至少 480/600 UMS，且成绩最高的三个 IA2 单元合计至少 270/300 UMS。",
    aStarEn: "At least 480/600 UMS overall and at least 270/300 UMS from the best three IA2 units.",
  },
];

const ialExamRows = (dates: IALExamDate[], allowed: IALUnitKey[], sourceId: string): TableRow[] =>
  dates
    .filter((item) => allowed.includes(item.unit))
    .map((item) => {
      const unit = ialUnits.find((entry) => entry.key === item.unit)!;
      return row(
        [[`${item.unit} · ${unit.code}`, `${item.unit} · ${unit.code}`], [item.date, item.date], [item.sessionZh, item.sessionEn]],
        [sourceId],
      );
    });

const ialSeriesDate = (
  projectId: string,
  suffix: string,
  labelZh: string,
  labelEn: string,
  date: string,
  endDate: string,
  sourceId: string,
): DateRecord => ({
  id: `${projectId}-${suffix}`,
  label: t(labelZh, labelEn),
  date,
  endDate,
  region: t("中国大陆；以考点通知的当地开考时间为准", "Mainland China; local start times are confirmed by the centre"),
  status: "confirmed",
  sourceIds: [sourceId],
  note: t("资格由多个单元组成；具体单元日期见项目页时间表。", "The qualification comprises multiple units; see the project timetable for component dates."),
});

const ialRegistrationDate = (
  projectId: string,
  suffix: string,
  labelZh: string,
  labelEn: string,
  date: string,
  noteZh: string,
  noteEn: string,
  status: DateRecord["status"] = "confirmed",
): DateRecord => ({
  id: `${projectId}-${suffix}`,
  label: t(labelZh, labelEn),
  date,
  time: "17:00",
  timezone: "Asia/Shanghai",
  region: t("英国文化教育协会中国", "British Council China"),
  status,
  sourceIds: ["british-council-china-pearson"],
  note: t(noteZh, noteEn),
});

const ialAccessSection: ContentSection = {
  id: "official-materials",
  title: t("官方规范、样题、真题与教材", "Official specification, specimens, past papers and textbooks"),
  tables: [
    {
      columns: [t("资料", "Material"), t("访问与用途", "Access and use")],
      rows: [
        row([["Specification", "Specification"], ["免费公开；三项资格、14 个单元及所有组合规则的首要依据", "Public and free; the primary source for all three qualifications, 14 units and combination rules"]], ["edexcel-ial-maths-spec"]),
        row([["Sample Assessment Materials", "Sample Assessment Materials"], ["免费公开；包含各单元 specimen papers 和 mark schemes", "Public and free; includes unit specimen papers and mark schemes"]], ["edexcel-ial-maths-sam"]),
        row([["Formulae and Statistical Tables", "Formulae and Statistical Tables"], ["考试时提供的官方公式与统计表；备考应使用现行版本", "The official formula and statistical tables supplied in examinations; preparation should use the current version"]], ["edexcel-ial-formula-book"]),
        row([["Course materials / past exam materials", "Course materials / past exam materials"], ["公开页可检索；最新试卷通常锁定十二个月，注册中心可按权限访问", "Searchable on the public page; the newest papers are normally locked for twelve months and accessible to registered centres according to permissions"]], ["edexcel-ial-maths-materials", "edexcel-assessment-publication-policy"]),
        row([["Pearson 官方单元教材", "Pearson official unit student books"], ["P1–P4、FP1–FP3、M1–M3、S1–S3、D1 各有官方 Student Book；目录和样章公开，完整教材付费", "Official Student Books cover P1–P4, FP1–FP3, M1–M3, S1–S3 and D1; catalogue and samples are public, while full books are paid"]], ["edexcel-ial-maths-books"]),
      ],
      note: t("本站不重新托管 Pearson 版权试卷、评分标准或教材；学校账号中的受限材料不得转发。", "This site does not re-host copyrighted Pearson papers, mark schemes or textbooks; restricted centre material must not be redistributed."),
    },
  ],
};

const ialSections = (spec: IALSpec): ContentSection[] => [
  {
    id: "qualification-structure",
    title: t("资格结构与 cash-in", "Qualification structure and cash-in"),
    intro: t("Mathematics、Pure Mathematics 与 Further Mathematics 共用一套单元体系，但有不同的资格代码和有效组合。", "Mathematics, Pure Mathematics and Further Mathematics share one unit system but have different qualification codes and valid combinations."),
    tables: [{ columns: [t("资格", "Qualification"), t("Cash-in 代码", "Cash-in code"), t("必需组合", "Required combination")], rows: spec.combinationRows }],
    bullets: spec.restrictions.map(([zh, en]) => t(zh, en)),
  },
  {
    id: "units-and-content",
    title: t("可用于本资格的单元", "Units available for this qualification"),
    paragraphs: [t("每个单元均为 1 小时 30 分、75 原始分、外部评卷；允许使用符合规定的计算器，考试提供公式与统计表。", "Every unit is externally assessed in 1 hour 30 minutes for 75 raw marks. An approved calculator is permitted and the formulae and statistical tables booklet is supplied.")],
    tables: [{
      columns: [t("单元与代码", "Unit and code"), t("主要内容", "Principal content"), t("开考月份", "Availability")],
      rows: ialUnits.filter((unit) => spec.units.includes(unit.key)).map((unit) => row(
        [[`${unit.key} · ${unit.code}`, `${unit.key} · ${unit.code}`], [unit.scopeZh, unit.scopeEn], [unit.availabilityZh, unit.availabilityEn]],
        ["edexcel-ial-maths-spec"],
      )),
    }],
  },
  {
    id: "latest-exam-dates",
    title: t("最新已公布考期", "Latest published exam series"),
    tables: [
      { title: t("2026 年 10 月", "October 2026"), columns: [t("单元", "Unit"), t("日期", "Date"), t("时段", "Session")], rows: ialExamRows(ialOctober2026, spec.units, "edexcel-ial-oct-2026-timetable"), note: t("10 月只开 P1–P4、M1–M2、S1–S2；本资格其他单元不在该考季提供。", "October offers only P1–P4, M1–M2 and S1–S2; other units in this qualification are unavailable in this series.") },
      { title: t("2027 年 1 月", "January 2027"), columns: [t("单元", "Unit"), t("日期", "Date"), t("时段", "Session")], rows: ialExamRows(ialJanuary2027, spec.units, "edexcel-ial-jan-2027-timetable") },
      { title: t("2027 年夏季", "Summer 2027"), columns: [t("单元", "Unit"), t("日期", "Date"), t("时段", "Session")], rows: ialExamRows(ialSummer2027, spec.units, "edexcel-ial-summer-2027-timetable") },
    ],
  },
  chinaRegistrationSection("ial", "edexcel-ial-maths-spec"),
  {
    id: "grades-and-boundaries",
    title: t("UMS、资格等级与分数线", "UMS, qualification grades and boundaries"),
    paragraphs: [
      t("每个单元满分 100 UMS；A、B、C、D、E 的固定 UMS 线为 80、70、60、50、40。单元原始分线随考季和试卷难度变化，不能用固定原始分预测等级。", "Each unit is worth 100 UMS. Fixed UMS boundaries for A, B, C, D and E are 80, 70, 60, 50 and 40. Unit raw boundaries vary by series and paper difficulty and cannot be treated as fixed predictions."),
      t("IAS 满分 300 UMS，A–E 为 240、210、180、150、120；IAL 满分 600 UMS，A–E 为 480、420、360、300、240。", "IAS is worth 300 UMS with A–E at 240, 210, 180, 150 and 120. IAL is worth 600 UMS with A–E at 480, 420, 360, 300 and 240."),
      t(`A* 条件：${spec.aStarZh}`, `A* rule: ${spec.aStarEn}`),
      t("官方分数线文件有时列出 IA2 单元的 theoretical a* 原始分线；单元成绩仍报告 A–E，最终 A* 由 cash-in 规则决定。", "Official boundary files may show a theoretical a* raw boundary for IA2 units. Unit results are still reported A–E; the final A* is determined by the cash-in rule."),
    ],
  },
  ialAccessSection,
];

const ialProjects: ProjectRecord[] = ialSpecs.map((spec) => ({
  id: spec.id,
  slug: spec.slug,
  track: "curriculum",
  title: t(spec.titleZh, spec.titleEn),
  shortTitle: spec.shortTitle,
  organizer: t(PEARSON_ZH, PEARSON_EN),
  summary: t(spec.summaryZh, spec.summaryEn),
  regions: ["global", "china", "uk-curriculum"],
  gradeBands: ["high-school"],
  eligibilityTags: ["school-entry", "private-candidate-centre-entry", "unit-banking", "cash-in-required"],
  formatTags: ["course-and-exam", "modular", "calculator", "ums"],
  costBand: "varies",
  status: "confirmed",
  cycle: "October 2026 / January 2027 / Summer 2027",
  lastVerified: "2026-08-25",
  facts: [
    fact("IAS / IAL 资格代码", "IAS / IAL qualification codes", `${spec.iasCode} / ${spec.ialCode}`, `${spec.iasCode} / ${spec.ialCode}`, ["edexcel-ial-maths-spec"]),
    fact("规范版本", "Specification version", "Issue 3，2019 年 4 月", "Issue 3, April 2019", ["edexcel-ial-maths-spec"]),
    fact("单元结构", "Unit structure", "每单元 1 小时 30 分、75 原始分、100 UMS", "Each unit: 1 hour 30 minutes, 75 raw marks and 100 UMS", ["edexcel-ial-maths-spec"]),
    fact("计算器与公式", "Calculator and formulae", "所有单元允许规定计算器，并提供公式与统计表", "Approved calculators are allowed in every unit and the formulae and statistical tables booklet is supplied", ["edexcel-ial-maths-spec", "edexcel-ial-formula-book"]),
    fact("认证", "Certification", "单元成绩可保留；必须申请 cash-in 才产生 IAS 或 IAL 资格等级", "Unit results may be banked; a cash-in entry is required for an IAS or IAL qualification grade", ["edexcel-ial-maths-spec", "edexcel-ial-eligibility-calculator"]),
    fact("A*", "A*", spec.aStarZh, spec.aStarEn, ["edexcel-ial-maths-spec"]),
    fact("中国报名", "Registration in China", "由学校 exams officer、接收社会考生的获批中心或当届英国文化教育协会中国服务报名", "Through a school exams officer, an approved centre accepting private candidates, or the current British Council China service", ["edexcel-private-candidates", "british-council-china-pearson"]),
  ],
  dates: [
    ialRegistrationDate(spec.id, "oct-2026-standard-entry", "2026 年 10 月 IAL 标准报名截止", "October 2026 IAL standard-entry deadline", "2026-08-21", "英国文化教育协会中国公开截止；学校内部日期可能更早。", "Published British Council China deadline; a school's internal date may be earlier.", "historical"),
    ialRegistrationDate(spec.id, "oct-2026-late-entry", "2026 年 10 月 IAL 晚报名截止", "October 2026 IAL late-entry deadline", "2026-09-15", "晚报名通常产生附加费用；以实时报名页为准。", "Late entry normally incurs additional fees; use the live registration page."),
    ialSeriesDate(spec.id, "october-2026-series", `${spec.shortTitle} 2026 年 10 月考季`, `${spec.shortTitle} October 2026 series`, "2026-10-09", "2026-10-28", "edexcel-ial-oct-2026-timetable"),
    ialSeriesDate(spec.id, "january-2027-series", `${spec.shortTitle} 2027 年 1 月考季`, `${spec.shortTitle} January 2027 series`, "2027-01-08", "2027-01-25", "edexcel-ial-jan-2027-timetable"),
    ialSeriesDate(spec.id, "summer-2027-series", `${spec.shortTitle} 2027 年夏季考季`, `${spec.shortTitle} Summer 2027 series`, "2027-05-06", "2027-06-10", "edexcel-ial-summer-2027-timetable"),
  ],
  sections: ialSections(spec),
  sourceIds: [
    "edexcel-ial-maths-overview",
    "edexcel-ial-maths-spec",
    "edexcel-ial-maths-sam",
    "edexcel-ial-maths-materials",
    "edexcel-ial-formula-book",
    "edexcel-ial-eligibility-calculator",
    "edexcel-ial-onboarding",
    "edexcel-ial-maths-books",
    "edexcel-ial-oct-2026-timetable",
    "edexcel-ial-jan-2027-timetable",
    "edexcel-ial-summer-2027-timetable",
    "edexcel-grade-boundaries",
    "edexcel-ial-boundaries-2026-01",
    "edexcel-ial-boundaries-2026-06",
    "edexcel-past-paper-search",
    "edexcel-assessment-publication-policy",
    "edexcel-private-candidates",
    "edexcel-find-centre",
    "british-council-china-pearson",
  ],
  relatedIds: ialSpecs.filter((item) => item.id !== spec.id).map((item) => item.id),
  searchTerms: [spec.iasCode, spec.ialCode, spec.shortTitle, spec.titleZh, spec.titleEn, ...spec.units, "UMS", "cash-in", "中国报名"],
}));

export const edexcelCourseProjects: ProjectRecord[] = [...igcseProjects, ...ialProjects];

const threshold = (
  id: string,
  projectId: string,
  year: string,
  sitting: string,
  metricZh: string,
  metricEn: string,
  value: string,
  maxScore: string,
  sourceIds: string[],
  noteZh: string,
  noteEn: string,
): ThresholdRecord => ({
  id,
  projectId,
  year,
  sitting,
  metric: t(metricZh, metricEn),
  value,
  maxScore,
  status: "confirmed",
  sourceIds,
  note: t(noteZh, noteEn),
});

const igcseLinearThresholds: ThresholdRecord[] = [
  threshold("edexcel-4ma1-2025-11-foundation", "edexcel-igcse-mathematics-a-linear", "2025", "November · Foundation · 1F+2F", "资格原始分等级线", "Qualification raw-mark grade boundaries", "5:151; 4:127; 3:95; 2:63; 1:31", "200", ["edexcel-igcse-boundaries-2025-11"], "普通卷资格总分线；2026 年 6 月 R 卷不得套用此线。", "Standard-paper qualification boundaries; do not apply them to the June 2026 R papers."),
  threshold("edexcel-4ma1-2025-11-higher", "edexcel-igcse-mathematics-a-linear", "2025", "November · Higher · 1H+2H", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:166; 8:136; 7:107; 6:86; 5:65; 4:45; 3:35", "200", ["edexcel-igcse-boundaries-2025-11"], "普通卷资格总分线；等级 3 是 Higher 资格可授予的低等级。", "Standard-paper qualification boundaries; grade 3 is the lower grade available for the Higher qualification."),
  threshold("edexcel-4mb1-2025-11", "edexcel-igcse-mathematics-b", "2025", "November · Paper 01+02", "资格缩放分等级线", "Qualification scaled-mark grade boundaries", "9:247; 8:211; 7:176; 6:145; 5:114; 4:84; 3:69", "300", ["edexcel-igcse-boundaries-2025-11"], "两卷各为 100 原始分但权重为 33⅓% 与 66⅔%；官方资格边界按 300 分缩放。", "Each paper has 100 raw marks but weightings are 33⅓% and 66⅔%; Pearson reports qualification boundaries on a 300-mark scaled total."),
  threshold("edexcel-4pm1-2025-11", "edexcel-igcse-further-pure-mathematics", "2025", "November · Paper 01+02", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:166; 8:141; 7:117; 6:93; 5:70; 4:47; 3:35", "200", ["edexcel-igcse-boundaries-2025-11"], "普通卷资格总分线；不同考季及 R 卷须另查。", "Standard-paper qualification boundaries; consult the separate file for another series or R paper."),
];

const igcseJune2026Thresholds: ThresholdRecord[] = [
  threshold("edexcel-4ma1-2026-06-foundation", "edexcel-igcse-mathematics-a-linear", "2026", "June · Foundation · 1F+2F", "资格原始分等级线", "Qualification raw-mark grade boundaries", "5:148; 4:125; 3:90; 2:56; 1:22", "200", ["edexcel-igcse-boundaries-2026-06"], "普通卷资格总分线；中国 6 月适用 R 卷时不得使用此行。", "Standard-paper qualification boundaries; do not use this row where the June R paper applies."),
  threshold("edexcel-4ma1-2026-06-higher", "edexcel-igcse-mathematics-a-linear", "2026", "June · Higher · 1H+2H", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:165; 8:138; 7:111; 6:87; 5:64; 4:41; 3:29", "200", ["edexcel-igcse-boundaries-2026-06"], "普通卷资格总分线；中国 6 月适用 R 卷时不得使用此行。", "Standard-paper qualification boundaries; do not use this row where the June R paper applies."),
  threshold("edexcel-4ma1-2026-06-foundation-r", "edexcel-igcse-mathematics-a-linear", "2026", "June · Foundation R · 1FR+2FR", "资格原始分等级线", "Qualification raw-mark grade boundaries", "5:147; 4:125; 3:90; 2:55; 1:21", "200", ["edexcel-igcse-boundaries-2026-06"], "R 卷资格总分线；中国属于适用科目的强制 R 卷地区。", "R-paper qualification boundaries; China is a mandatory R-paper region where applicable."),
  threshold("edexcel-4ma1-2026-06-higher-r", "edexcel-igcse-mathematics-a-linear", "2026", "June · Higher R · 1HR+2HR", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:171; 8:145; 7:119; 6:94; 5:69; 4:45; 3:33", "200", ["edexcel-igcse-boundaries-2026-06"], "R 卷资格总分线；中国属于适用科目的强制 R 卷地区。", "R-paper qualification boundaries; China is a mandatory R-paper region where applicable."),
  threshold("edexcel-4mb1-2026-06", "edexcel-igcse-mathematics-b", "2026", "June · Paper 01+02", "资格缩放分等级线", "Qualification scaled-mark grade boundaries", "9:246; 8:209; 7:173; 6:142; 5:112; 4:82; 3:67", "300", ["edexcel-igcse-boundaries-2026-06"], "普通卷资格缩放分总分线；两卷权重为 33⅓% 与 66⅔%。", "Standard-paper qualification scaled-mark boundaries; the two papers are weighted 33⅓% and 66⅔%."),
  threshold("edexcel-4mb1-2026-06-r", "edexcel-igcse-mathematics-b", "2026", "June · Paper 01R+02R", "资格缩放分等级线", "Qualification scaled-mark grade boundaries", "9:262; 8:223; 7:185; 6:154; 5:124; 4:94; 3:79", "300", ["edexcel-igcse-boundaries-2026-06"], "R 卷资格缩放分总分线；中国 6 月应查此行。", "R-paper qualification scaled-mark boundaries; use this row for China in June."),
  threshold("edexcel-4pm1-2026-06", "edexcel-igcse-further-pure-mathematics", "2026", "June · Paper 01+02", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:180; 8:166; 7:152; 6:122; 5:92; 4:62; 3:47", "200", ["edexcel-igcse-boundaries-2026-06"], "普通卷资格原始分总分线。", "Standard-paper qualification raw-mark boundaries."),
  threshold("edexcel-4pm1-2026-06-r", "edexcel-igcse-further-pure-mathematics", "2026", "June · Paper 01R+02R", "资格原始分等级线", "Qualification raw-mark grade boundaries", "9:175; 8:154; 7:134; 6:108; 5:82; 4:56; 3:43", "200", ["edexcel-igcse-boundaries-2026-06"], "R 卷资格原始分总分线；中国 6 月应查此行。", "R-paper qualification raw-mark boundaries; use this row for China in June."),
];

const igcseModularThresholds: ThresholdRecord[] = [
  threshold("edexcel-4wm1f-2025-11-raw", "edexcel-igcse-mathematics-a-modular", "2025", "November · Unit 1F", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:75; 4:63; 3:47; 2:31; 1:15", "100", ["edexcel-igcse-modular-boundaries-2025-11"], "原始分会按当届边界换算为 UMS。", "Raw marks are converted to UMS using the boundary for that series."),
  threshold("edexcel-4wm2f-2025-11-raw", "edexcel-igcse-mathematics-a-modular", "2025", "November · Unit 2F", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:76; 4:64; 3:47; 2:30; 1:14", "100", ["edexcel-igcse-modular-boundaries-2025-11"], "原始分会按当届边界换算为 UMS。", "Raw marks are converted to UMS using the boundary for that series."),
  threshold("edexcel-4wm1h-2025-11-raw", "edexcel-igcse-mathematics-a-modular", "2025", "November · Unit 1H", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:82; 8:67; 7:53; 6:42; 5:32; 4:22; 3:17", "100", ["edexcel-igcse-modular-boundaries-2025-11"], "原始分会按当届边界换算为 UMS。", "Raw marks are converted to UMS using the boundary for that series."),
  threshold("edexcel-4wm2h-2025-11-raw", "edexcel-igcse-mathematics-a-modular", "2025", "November · Unit 2H", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:84; 8:69; 7:54; 6:43; 5:33; 4:23; 3:18", "100", ["edexcel-igcse-modular-boundaries-2025-11"], "原始分会按当届边界换算为 UMS。", "Raw marks are converted to UMS using the boundary for that series."),
  threshold("edexcel-4xmaf-current-ums", "edexcel-igcse-mathematics-a-modular", "Current UMS scale", "Foundation cash-in · 4XMAF", "固定资格 UMS 等级线", "Fixed qualification UMS grade boundaries", "5:120; 4:96; 3:72; 2:48; 1:24", "240", ["edexcel-igcse-math-a-modular-spec", "edexcel-igcse-modular-boundaries-2025-11"], "cash-in 只报告 UMS；两个单元成绩合并后必须申请 4XMAF。", "Cash-in is reported only in UMS; the two units must be claimed under 4XMAF."),
  threshold("edexcel-4xmah-current-ums", "edexcel-igcse-mathematics-a-modular", "Current UMS scale", "Higher cash-in · 4XMAH", "固定资格 UMS 等级线", "Fixed qualification UMS grade boundaries", "9:216; 8:192; 7:168; 6:144; 5:120; 4:96; 3:84", "240", ["edexcel-igcse-math-a-modular-spec", "edexcel-igcse-modular-boundaries-2025-11"], "cash-in 只报告 UMS；两个单元成绩合并后必须申请 4XMAH。", "Cash-in is reported only in UMS; the two units must be claimed under 4XMAH."),
];

const igcseModularJune2026Thresholds: ThresholdRecord[] = [
  threshold("edexcel-4wm1f-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 1F", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:72; 4:62; 3:45; 2:28; 1:11", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "普通卷单元原始分线；原始分按本考季边界换算为 UMS。", "Standard unit raw boundaries; raw marks are converted to UMS using this series."),
  threshold("edexcel-4wm1h-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 1H", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:80; 8:67; 7:55; 6:45; 5:35; 4:25; 3:20", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "普通卷单元原始分线；原始分按本考季边界换算为 UMS。", "Standard unit raw boundaries; raw marks are converted to UMS using this series."),
  threshold("edexcel-4wm1fr-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 1FR", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:73; 4:62; 3:45; 2:28; 1:12", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "R 卷单元原始分线；中国 6 月应查 R 卷行。", "R-paper unit raw boundaries; use the R-paper row for China in June."),
  threshold("edexcel-4wm1hr-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 1HR", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:86; 8:71; 7:56; 6:44; 5:32; 4:20; 3:14", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "R 卷单元原始分线；中国 6 月应查 R 卷行。", "R-paper unit raw boundaries; use the R-paper row for China in June."),
  threshold("edexcel-4wm2f-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 2F", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:74; 4:62; 3:44; 2:27; 1:10", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "普通卷单元原始分线；原始分按本考季边界换算为 UMS。", "Standard unit raw boundaries; raw marks are converted to UMS using this series."),
  threshold("edexcel-4wm2h-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 2H", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:77; 8:66; 7:55; 6:44; 5:34; 4:24; 3:19", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "普通卷单元原始分线；原始分按本考季边界换算为 UMS。", "Standard unit raw boundaries; raw marks are converted to UMS using this series."),
  threshold("edexcel-4wm2fr-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 2FR", "单元原始分等级线", "Unit raw-mark grade boundaries", "5:74; 4:63; 3:45; 2:27; 1:9", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "R 卷单元原始分线；中国 6 月应查 R 卷行。", "R-paper unit raw boundaries; use the R-paper row for China in June."),
  threshold("edexcel-4wm2hr-2026-06-raw", "edexcel-igcse-mathematics-a-modular", "2026", "June · Unit 2HR", "单元原始分等级线", "Unit raw-mark grade boundaries", "9:81; 8:68; 7:56; 6:43; 5:31; 4:19; 3:13", "100", ["edexcel-igcse-modular-boundaries-2026-06"], "R 卷单元原始分线；中国 6 月应查 R 卷行。", "R-paper unit raw boundaries; use the R-paper row for China in June."),
];

type IALRawBoundary = {
  unit: IALUnitKey;
  value: string;
};

const ialJanuary2026RawBoundaries: IALRawBoundary[] = [
  { unit: "P1", value: "A:56; B:49; C:42; D:35; E:29" },
  { unit: "P2", value: "A:51; B:45; C:39; D:33; E:28" },
  { unit: "P3", value: "a*:66; A:59; B:52; C:46; D:40; E:34" },
  { unit: "P4", value: "a*:65; A:57; B:49; C:41; D:34; E:27" },
  { unit: "FP1", value: "A:63; B:56; C:49; D:43; E:37" },
  { unit: "FP2", value: "a*:70; A:66; B:58; C:50; D:43; E:36" },
  { unit: "FP3", value: "a*:69; A:63; B:56; C:49; D:42; E:36" },
  { unit: "M1", value: "A:60; B:51; C:43; D:35; E:27" },
  { unit: "M2", value: "a*:67; A:59; B:51; C:43; D:36; E:29" },
  { unit: "M3", value: "a*:68; A:62; B:53; C:45; D:37; E:29" },
  { unit: "S1", value: "A:66; B:56; C:46; D:36; E:27" },
  { unit: "S2", value: "a*:67; A:60; B:51; C:42; D:33; E:25" },
  { unit: "S3", value: "a*:70; A:65; B:55; C:46; D:37; E:28" },
  { unit: "D1", value: "A:58; B:51; C:45; D:39; E:33" },
];

const ialRawThresholds: ThresholdRecord[] = ialSpecs.flatMap((spec) =>
  ialJanuary2026RawBoundaries
    .filter((boundary) => spec.units.includes(boundary.unit))
    .map((boundary) => {
      const unit = ialUnits.find((entry) => entry.key === boundary.unit)!;
      return threshold(
        `${spec.id}-2026-01-${boundary.unit.toLowerCase()}-raw`,
        spec.id,
        "2026",
        `January · ${boundary.unit} · ${unit.code}`,
        `${unit.titleZh} 原始分等级线`,
        `${unit.titleEn} raw-mark grade boundaries`,
        boundary.value,
        "75",
        ["edexcel-ial-boundaries-2026-01"],
        "采用官方文件中的普通单元行，不是 Unit 1A 等替代卷行；小写 a* 是 IA2 理论线，单元结果仍报告 A–E。",
        "Uses the standard unit row, not an alternative Unit 1A row. Lower-case a* is the theoretical IA2 boundary; unit results remain A–E.",
      );
    }),
);

type IALJune2026Boundary = {
  unit: IALUnitKey;
  slug: string;
  paper: string;
  value: string;
  alternative?: boolean;
};

const ialJune2026RawBoundaries: IALJune2026Boundary[] = [
  { unit: "P1", slug: "p1", paper: "WMA11 · Unit 1", value: "A:54; B:47; C:40; D:33; E:26" },
  { unit: "P1", slug: "p1a", paper: "WMA11 · Unit 1A", value: "A:46; B:40; C:34; D:28; E:22", alternative: true },
  { unit: "P2", slug: "p2", paper: "WMA12 · Unit 2", value: "A:48; B:42; C:36; D:31; E:26" },
  { unit: "P2", slug: "p2a", paper: "WMA12 · Unit 2A", value: "A:56; B:49; C:43; D:37; E:31", alternative: true },
  { unit: "P3", slug: "p3", paper: "WMA13 · Unit 3", value: "a*:63; A:57; B:51; C:45; D:39; E:33" },
  { unit: "P3", slug: "p3a", paper: "WMA13 · Unit 3A", value: "a*:61; A:55; B:49; C:43; D:37; E:32", alternative: true },
  { unit: "P4", slug: "p4", paper: "WMA14 · Unit 4", value: "a*:65; A:58; B:51; C:44; D:37; E:31" },
  { unit: "P4", slug: "p4a", paper: "WMA14 · Unit 4A", value: "a*:66; A:58; B:50; C:42; D:34; E:27", alternative: true },
  { unit: "FP1", slug: "fp1", paper: "WFM01 · Unit 1", value: "A:63; B:57; C:51; D:45; E:40" },
  { unit: "FP1", slug: "fp1a", paper: "WFM01 · Unit 1A", value: "A:61; B:54; C:47; D:41; E:35", alternative: true },
  { unit: "FP2", slug: "fp2", paper: "WFM02 · Unit 2", value: "a*:68; A:62; B:55; C:48; D:41; E:35" },
  { unit: "FP2", slug: "fp2a", paper: "WFM02 · Unit 2A", value: "a*:64; A:57; B:50; C:44; D:38; E:32", alternative: true },
  { unit: "FP3", slug: "fp3", paper: "WFM03 · Unit 3", value: "a*:62; A:57; B:52; C:47; D:43; E:39" },
  { unit: "FP3", slug: "fp3a", paper: "WFM03 · Unit 3A", value: "a*:62; A:56; B:50; C:44; D:38; E:33", alternative: true },
  { unit: "M1", slug: "m1", paper: "WME01 · Unit 1", value: "A:57; B:50; C:43; D:36; E:29" },
  { unit: "M1", slug: "m1a", paper: "WME01 · Unit 1A", value: "A:57; B:49; C:41; D:33; E:25", alternative: true },
  { unit: "M2", slug: "m2", paper: "WME02 · Unit 2", value: "a*:58; A:52; B:46; C:40; D:34; E:28" },
  { unit: "M2", slug: "m2a", paper: "WME02 · Unit 2A", value: "a*:55; A:49; B:43; C:37; D:32; E:27", alternative: true },
  { unit: "M3", slug: "m3", paper: "WME03 · Unit 3", value: "a*:70; A:66; B:58; C:50; D:43; E:36" },
  { unit: "M3", slug: "m3a", paper: "WME03 · Unit 3A", value: "a*:58; A:51; B:44; C:37; D:30; E:23", alternative: true },
  { unit: "S1", slug: "s1", paper: "WST01 · Unit 1", value: "A:65; B:56; C:47; D:39; E:31" },
  { unit: "S1", slug: "s1a", paper: "WST01 · Unit 1A", value: "A:55; B:46; C:37; D:28; E:20", alternative: true },
  { unit: "S2", slug: "s2", paper: "WST02 · Unit 2", value: "a*:68; A:61; B:53; C:46; D:39; E:32" },
  { unit: "S2", slug: "s2a", paper: "WST02 · Unit 2A", value: "a*:67; A:59; B:50; C:41; D:33; E:25", alternative: true },
  { unit: "S3", slug: "s3", paper: "WST03 · Unit 3", value: "a*:70; A:66; B:57; C:49; D:41; E:33" },
  { unit: "S3", slug: "s3a", paper: "WST03 · Unit 3A", value: "a*:70; A:66; B:57; C:48; D:40; E:32", alternative: true },
  { unit: "D1", slug: "d1", paper: "WDM11 · Unit 1", value: "A:58; B:51; C:44; D:38; E:32" },
  { unit: "D1", slug: "d1a", paper: "WDM11 · Unit 1A", value: "A:49; B:43; C:37; D:31; E:25", alternative: true },
];

const ialJune2026RawThresholds: ThresholdRecord[] = ialSpecs.flatMap((spec) =>
  ialJune2026RawBoundaries
    .filter((boundary) => spec.units.includes(boundary.unit))
    .map((boundary) => {
      const unit = ialUnits.find((entry) => entry.key === boundary.unit)!;
      return threshold(
        `${spec.id}-2026-06-${boundary.slug}-raw`,
        spec.id,
        "2026",
        `June · ${boundary.paper}`,
        `${unit.titleZh}${boundary.alternative ? " A 卷" : ""}原始分等级线`,
        `${unit.titleEn}${boundary.alternative ? " alternative form" : ""} raw-mark grade boundaries`,
        boundary.value,
        "75",
        ["edexcel-ial-boundaries-2026-06"],
        boundary.alternative
          ? "官方 Unit A 替代卷行；不得与同考季标准卷边界混用。小写 a* 只表示 IA2 理论线，单元成绩仍报告 A–E。"
          : "官方标准单元行；不得与 Unit A 替代卷边界混用。小写 a* 只表示 IA2 理论线，单元成绩仍报告 A–E。",
        boundary.alternative
          ? "Official Unit A alternative-form row; do not mix it with the standard form. Lower-case a* is the theoretical IA2 boundary; unit results remain A–E."
          : "Official standard-unit row; do not mix it with the Unit A alternative form. Lower-case a* is the theoretical IA2 boundary; unit results remain A–E.",
      );
    }),
);

const ialFixedThresholds: ThresholdRecord[] = ialSpecs.flatMap((spec) => [
  threshold(`${spec.id}-unit-current-ums`, spec.id, "Current UMS scale", "Each unit", "固定单元 UMS 等级线", "Fixed unit UMS grade boundaries", "A:80; B:70; C:60; D:50; E:40", "100", ["edexcel-ial-maths-spec", "edexcel-ial-boundaries-2026-01"], "原始分线每考季变化；此处是固定 UMS 标尺。", "Raw boundaries vary by series; these are the fixed UMS points."),
  threshold(`${spec.id}-ias-current-ums`, spec.id, "Current UMS scale", `IAS cash-in · ${spec.iasCode}`, "IAS 固定 UMS 等级线", "IAS fixed UMS grade boundaries", "A:240; B:210; C:180; D:150; E:120", "300", ["edexcel-ial-maths-spec", "edexcel-ial-boundaries-2026-01"], "必须提交相应 IAS cash-in 才生成资格等级。", "The relevant IAS cash-in must be entered for a qualification grade."),
  threshold(`${spec.id}-ial-current-ums`, spec.id, "Current UMS scale", `IAL cash-in · ${spec.ialCode}`, "IAL 固定 UMS 等级线", "IAL fixed UMS grade boundaries", "A:480; B:420; C:360; D:300; E:240", "600", ["edexcel-ial-maths-spec", "edexcel-ial-boundaries-2026-01"], "A* 还须满足额外 IA2 条件，不能只看总 UMS。", "A* also requires the additional IA2 condition and cannot be determined from total UMS alone."),
  threshold(`${spec.id}-ial-current-a-star`, spec.id, "Current UMS scale", `IAL cash-in · ${spec.ialCode}`, "A* 附加条件", "Additional A* condition", spec.aStarZh, "600", ["edexcel-ial-maths-spec"], "与总分至少 480/600 UMS 同时满足。", "Must be met together with at least 480/600 total UMS."),
]);

export const edexcelCourseThresholds: ThresholdRecord[] = [
  ...igcseLinearThresholds,
  ...igcseJune2026Thresholds,
  ...igcseModularThresholds,
  ...igcseModularJune2026Thresholds,
  ...ialFixedThresholds,
  ...ialRawThresholds,
  ...ialJune2026RawThresholds,
];

const igcseSyllabi: AssessmentSyllabusRecord[] = igcseSpecs.map((spec) => ({
  id: `syllabus-${spec.id}`,
  slug: `${spec.slug}-specification`,
  projectId: spec.id,
  classification: "formal-specification",
  title: t(`${spec.titleZh} 官方课程规范`, `${spec.titleEn} Official Specification`),
  officialName: t(spec.titleZh, spec.titleEn),
  applicableCycle: t("现行资格；最新已公布考试为 2026 年 11 月与 2027 年夏季", "Current qualification; latest published examinations are November 2026 and Summer 2027"),
  status: "confirmed",
  summary: t(`${spec.specVersionZh}。本页按官方规范保留课程内容、等级、试卷代码、时间与公式规则。`, `${spec.specVersionEn}. This page retains the official content, tiers, paper codes, timing and formula rules.`),
  facts: [
    fact("资格代码", "Qualification code", spec.code, spec.code, [spec.specId]),
    fact("版本", "Version", spec.specVersionZh, spec.specVersionEn, [spec.specId]),
    fact("成绩", "Grades", spec.gradeZh, spec.gradeEn, [spec.specId]),
    fact("计算器与公式", "Calculator and formulae", spec.formulaZh, spec.formulaEn, [spec.specId]),
  ],
  sections: igcseSections(spec).slice(0, 2),
  sources: [
    syllabusSource(`${spec.titleZh} Specification`, `${spec.titleEn} Specification`, spec.specUrl, "pdf", spec.specVersionZh, spec.specVersionEn),
    syllabusSource(`${spec.titleZh} SAM`, `${spec.titleEn} SAM`, spec.samUrl, "pdf", "官方 specimen papers 与 mark schemes", "Official specimen papers and mark schemes"),
    syllabusSource(`${spec.titleZh} Course materials`, `${spec.titleEn} Course materials`, spec.materialsUrl, "webpage", "持续更新", "Continuously updated", "最新材料可能需要注册中心账号。", "The newest material may require a registered-centre account."),
  ],
  translationNote: t("中文用于检索与理解；资格名称、等级、Paper／Unit、Foundation／Higher、cash-in、R paper 和代码保留官方写法。冲突时以英文规范及当届信息手册为准。", "Chinese is supplied for navigation and explanation. Qualification names, grades, Paper/Unit, Foundation/Higher, cash-in, R paper and official codes are retained. The English specification and current information manual prevail if wording conflicts."),
  lastVerified: VERIFIED_AT,
}));

const ialSyllabi: AssessmentSyllabusRecord[] = ialSpecs.map((spec) => ({
  id: `syllabus-${spec.id}`,
  slug: `${spec.slug}-specification`,
  projectId: spec.id,
  classification: "formal-specification",
  title: t(`${spec.titleZh} 官方课程规范`, `${spec.titleEn} Official Specification`),
  officialName: t(spec.titleZh, spec.titleEn),
  applicableCycle: t("现行 Issue 3；最新已公布考期为 2026 年 10 月、2027 年 1 月和 2027 年夏季", "Current Issue 3; latest published series are October 2026, January 2027 and Summer 2027"),
  effectiveFrom: "2019-04",
  status: "confirmed",
  summary: t(`依据同一份 IAL 数学规范整理 ${spec.iasCode} 与 ${spec.ialCode} 的有效单元、组合、UMS 和 A* 规则。`, `Valid units, combinations, UMS and A* rules for ${spec.iasCode} and ${spec.ialCode}, taken from the common IAL Mathematics specification.`),
  facts: [
    fact("IAS / IAL 代码", "IAS / IAL codes", `${spec.iasCode} / ${spec.ialCode}`, `${spec.iasCode} / ${spec.ialCode}`, ["edexcel-ial-maths-spec"]),
    fact("规范版本", "Specification version", "Issue 3，2019 年 4 月", "Issue 3, April 2019", ["edexcel-ial-maths-spec"]),
    fact("单元", "Units", spec.units.join("、"), spec.units.join(", "), ["edexcel-ial-maths-spec"]),
    fact("考试", "Assessment", "每单元 1 小时 30 分、75 原始分、100 UMS；允许计算器", "Each unit is 1 hour 30 minutes, 75 raw marks and 100 UMS; calculator allowed", ["edexcel-ial-maths-spec"]),
    fact("A*", "A*", spec.aStarZh, spec.aStarEn, ["edexcel-ial-maths-spec"]),
  ],
  sections: ialSections(spec).slice(0, 2),
  sources: [
    syllabusSource("IAL Mathematics、Pure Mathematics 与 Further Mathematics Specification", "IAL Mathematics, Pure Mathematics and Further Mathematics Specification", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/international-a-level-maths-spec.pdf", "pdf", "Issue 3，2019 年 4 月", "Issue 3, April 2019"),
    syllabusSource("IAL Mathematics Sample Assessment Materials", "IAL Mathematics Sample Assessment Materials", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/International-A-Level-Maths-SAMs1.pdf", "pdf", "14 个单元", "All 14 units"),
    syllabusSource("IAL Mathematics Eligibility Calculator", "IAL Mathematics Eligibility Calculator", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018/international-a-level-maths-eligibility-calculator.html", "platform", "现行在线工具", "Current online tool", "用于核对单元能否组成拟申请资格；最终报名仍由 exams officer 完成。", "Checks whether units can form a planned qualification; final entries remain the exams officer's responsibility."),
  ],
  translationNote: t("中文为官方结构的辅助翻译；Unit、cash-in、UMS、IAS、IAL、A* 及代码保留官方术语。组合判断以英文规范和 eligibility calculator 为准。", "Chinese is an aid to the official structure. Unit, cash-in, UMS, IAS, IAL, A* and codes retain Pearson terminology. Combination eligibility is governed by the English specification and eligibility calculator."),
  lastVerified: VERIFIED_AT,
}));

export const edexcelCourseSyllabi: AssessmentSyllabusRecord[] = [...igcseSyllabi, ...ialSyllabi];

const igcseBookDescription = (projectId: string): [string, string, string, string] => {
  if (projectId === "edexcel-igcse-mathematics-a-linear" || projectId === "edexcel-igcse-mathematics-a-modular") {
    return [
      "Mathematics A 第二版 Book 1 与 Book 2",
      "Mathematics A Second Edition Books 1 and 2",
      "Book 1 ISBN 9781292486178；Book 2 ISBN 9781292753997。支持 2026 年 9 月起教学的线性与模块制路线。",
      "Book 1 ISBN 9781292486178; Book 2 ISBN 9781292753997. Supports linear and modular routes for first teaching from September 2026.",
    ];
  }
  if (projectId === "edexcel-igcse-mathematics-b") {
    return [
      "Mathematics B Student Book",
      "Mathematics B Student Book",
      "Pearson 官方 Student Book，ISBN 9780435044107。",
      "Pearson official Student Book, ISBN 9780435044107.",
    ];
  }
  return [
    "Further Pure Mathematics Student Book",
    "Further Pure Mathematics Student Book",
    "Pearson 官方 Student Book，ISBN 9780435188542。",
    "Pearson official Student Book, ISBN 9780435188542.",
  ];
};

const igcseLearningResources: LearningResourceRecord[] = igcseSpecs.flatMap((spec) => {
  const [bookTitleZh, bookTitleEn, bookDescriptionZh, bookDescriptionEn] = igcseBookDescription(spec.id);
  return [
    learningResource(`lr-${spec.id}-specification`, [spec.id], `${spec.titleZh} 官方规范`, `${spec.titleEn} Official Specification`, spec.specUrl, "official-guide", "free", "课程内容、试卷结构、等级、计算器和公式规则。", "Content, paper structure, grades, calculator and formula rules."),
    learningResource(`lr-${spec.id}-sam`, [spec.id], `${spec.titleZh} 官方样题`, `${spec.titleEn} Sample Assessment Materials`, spec.samUrl, "sample-questions", "free", "官方 specimen papers、mark schemes 及适用的评分说明。", "Official specimen papers, mark schemes and applicable assessment guidance."),
    learningResource(`lr-${spec.id}-course-materials`, [spec.id], `${spec.titleZh} 真题与课程材料`, `${spec.titleEn} Past Exam and Course Materials`, spec.materialsUrl, "past-papers", "mixed", "Pearson 官方课程材料页，集中提供可公开或经中心账号访问的试卷、评分标准、examiner reports、样卷和教学材料。", "Pearson's official course-materials page for public or centre-authorised papers, mark schemes, examiner reports, exemplars and teaching materials.", "最新材料通常受锁定访问限制；不得复制或转发中心账号材料。", "The newest material is normally access-restricted and must not be copied or redistributed from a centre account."),
    learningResource(`lr-${spec.id}-textbook`, [spec.id], bookTitleZh, bookTitleEn, spec.textbookUrl, "official-textbook", "paid", bookDescriptionZh, bookDescriptionEn, "目录与样章可免费查看，完整教材须购买；价格可能调整。", "Catalogue and samples are public, while the full book is paid; pricing may change."),
    learningResource(`lr-${spec.id}-answers`, [spec.id], "Pearson 官方教材答案", "Pearson Official Textbook Answers", "https://www.pearson.com/international-schools/international-gcse-answers.html", "courseware", "free", "Pearson 按书目公开的答案下载入口；并非所有书目或全部练习均提供答案。", "Pearson's book-specific answer-download hub; answers are not necessarily available for every title or exercise."),
  ];
});

const IAL_BOOK_ISBNS_ZH = "P1 9781292244792；P2 9781292244853；P3 9781292244921；P4 9781292245126；FP1 9781292244648；FP2 9781292244655；FP3 9781292244662；M1 9781292244679；M2 9781292244761；M3 9781292244815；S1 9781292245140；S2 9781292245171；S3 9781292245188；D1 9781292244563。";
const IAL_BOOK_ISBNS_EN = "P1 9781292244792; P2 9781292244853; P3 9781292244921; P4 9781292245126; FP1 9781292244648; FP2 9781292244655; FP3 9781292244662; M1 9781292244679; M2 9781292244761; M3 9781292244815; S1 9781292245140; S2 9781292245171; S3 9781292245188; D1 9781292244563.";

const ialLearningResources: LearningResourceRecord[] = ialSpecs.flatMap((spec) => [
  learningResource(`lr-${spec.id}-specification`, [spec.id], `${spec.titleZh} 官方规范`, `${spec.titleEn} Official Specification`, "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/international-a-level-maths-spec.pdf", "official-guide", "free", `同一规范内列出 ${spec.iasCode}、${spec.ialCode}、14 个单元、组合、UMS 和 A* 规则。`, `The common specification defines ${spec.iasCode}, ${spec.ialCode}, all 14 units, combinations, UMS and A* rules.`),
  learningResource(`lr-${spec.id}-sam`, [spec.id], "IAL 数学系列官方样题", "IAL Mathematics Family Sample Assessment Materials", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/International-A-Level-Maths-SAMs1.pdf", "sample-questions", "free", "14 个数学单元的 specimen papers 和 mark schemes。", "Specimen papers and mark schemes for all 14 mathematics units."),
  learningResource(`lr-${spec.id}-formula-book`, [spec.id], "IAL Mathematics 公式与统计表", "IAL Mathematics Formulae and Statistical Tables", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/IAL-Mathematics-Formula-Book.pdf", "official-guide", "free", "考试提供的官方公式和统计表；练习时应使用同一版本。", "The official formulae and statistical tables supplied in the exam; preparation should use the same version."),
  learningResource(`lr-${spec.id}-course-materials`, [spec.id], "IAL Mathematics 真题与课程材料", "IAL Mathematics Past Exam and Course Materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.coursematerials.html", "past-papers", "mixed", "按单元检索真题、mark schemes、examiner reports、样卷和教学材料。", "Unit-level past papers, mark schemes, examiner reports, exemplars and teaching materials.", "最新试卷通常锁定十二个月；受限材料仅限获授权中心使用。", "The newest papers are normally locked for twelve months; restricted material is for authorised centre use only."),
  learningResource(`lr-${spec.id}-eligibility`, [spec.id], "IAL Mathematics 组合资格计算器", "IAL Mathematics Eligibility Calculator", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018/international-a-level-maths-eligibility-calculator.html", "practice-platform", "free", `核对拟使用单元能否组成 ${spec.iasCode} 或 ${spec.ialCode}，尤其适合同时规划 Mathematics 与 Further Mathematics。`, `Checks whether planned units can form ${spec.iasCode} or ${spec.ialCode}, especially when Mathematics and Further Mathematics are planned together.`),
  learningResource(`lr-${spec.id}-textbooks`, [spec.id], "Pearson IAL Mathematics 官方单元教材", "Pearson IAL Mathematics Official Unit Student Books", "https://www.pearson.com/international-schools/british-curriculum/secondary-curriculum/International-A-Level/mathematics.html", "official-textbook", "paid", `按 P、FP、M、S、D 单元出版的官方 Student Books。${IAL_BOOK_ISBNS_ZH}`, `Official Student Books organised by P, FP, M, S and D units. ${IAL_BOOK_ISBNS_EN}`, "官方页提供目录、样章及可用的答案入口；完整教材付费。", "The official page provides catalogues, samples and available answer links; full books are paid."),
  learningResource(`lr-${spec.id}-onboarding`, [spec.id], "IAL Mathematics 官方入门指南", "IAL Mathematics Onboarding Guide", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Teaching-and-Learning-Materials/international-advanced-level-maths-onboarding-guide.pdf", "official-guide", "free", "面向学校和教师的资格结构、教学支持与实施入口。", "An implementation guide to qualification structure, teaching support and delivery."),
]);

export const edexcelCourseLearningResources: LearningResourceRecord[] = [
  ...igcseLearningResources,
  ...ialLearningResources,
];

const igcsePastPaperArchives: PastPaperArchiveRecord[] = igcseSpecs.map((spec) => ({
  id: `past-papers-${spec.id}`,
  projectId: spec.id,
  availability: "official",
  summary: t("Pearson 的 Course materials 页面是该资格的首要真题入口；SAM 免费公开。最新试卷、mark scheme 和 examiner report 通常在考试后十二个月内仅向注册中心开放，之后才按发布政策转为公开。本站只提供链接，不托管或转发版权文件。", "Pearson's Course materials page is the primary past-paper route and the SAM is public. The newest papers, mark schemes and examiner reports are normally restricted to registered centres for twelve months after an examination before release under Pearson's publication policy. This site links only and does not host or redistribute copyrighted files."),
  links: [
    paperLink(`${spec.titleZh} Course materials`, `${spec.titleEn} Course materials`, spec.materialsUrl, "archive", "mixed", "按 Pearson 当前权限显示公开或锁定材料。", "Shows public or padlocked material according to current Pearson permissions."),
    paperLink(`${spec.titleZh} SAM`, `${spec.titleEn} SAM`, spec.samUrl, "specimen", "free", "官方 specimen papers 与 mark schemes，可直接用于熟悉现行结构。", "Official specimen papers and mark schemes for the current structure."),
    paperLink("Pearson 官方真题搜索", "Pearson Official Past-Paper Search", "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html", "index", "mixed", `使用资格代码 ${spec.code} 和考季筛选；锁形图标表示受限。`, `Filter by qualification code ${spec.code} and series; a padlock indicates restricted access.`),
    paperLink("Pearson 试卷发布政策", "Pearson Assessment Publication Policy", "https://qualifications.pearson.com/content/dam/pdf/Support/policies-for-centres-learners-and-employees/qualification-assessment-publication-policy.pdf", "index", "free", "说明十二个月限制期、公开范围及版权边界。", "Explains the twelve-month restriction period, publication coverage and copyright boundary."),
  ],
  lastVerified: VERIFIED_AT,
}));

const ialPastPaperArchives: PastPaperArchiveRecord[] = ialSpecs.map((spec) => ({
  id: `past-papers-${spec.id}`,
  projectId: spec.id,
  availability: "official",
  summary: t("三项 IAL 数学资格共享按单元整理的官方 Course materials 档案。SAM 免费；最新真题通常锁定十二个月。查询时应使用具体单元代码而非只搜索 cash-in 代码，且不得把受限中心材料重新上传。", "All three IAL mathematics qualifications share the official unit-based Course materials archive. The SAM is public and the newest papers are normally locked for twelve months. Search by unit code rather than only the cash-in code, and do not re-upload restricted centre material."),
  links: [
    paperLink("IAL Mathematics 官方 Course materials", "IAL Mathematics Official Course Materials", "https://qualifications.pearson.com/en/qualifications/edexcel-international-advanced-levels/mathematics-2018.coursematerials.html", "archive", "mixed", `本资格可能使用的单元：${spec.units.join("、")}。`, `Units potentially used by this qualification: ${spec.units.join(", ")}.`),
    paperLink("IAL Mathematics 官方 SAM", "IAL Mathematics Official SAM", "https://qualifications.pearson.com/content/dam/pdf/International%20Advanced%20Level/Mathematics/2018/Specification-and-Sample-Assessment/International-A-Level-Maths-SAMs1.pdf", "specimen", "free", "包含全部 14 个单元的 specimen papers 和 mark schemes。", "Contains specimen papers and mark schemes for all 14 units."),
    paperLink("Pearson 官方真题搜索", "Pearson Official Past-Paper Search", "https://qualifications.pearson.com/en/support/support-topics/exams/past-papers.html", "index", "mixed", "按 WMA、WFM、WME、WST 或 WDM 单元代码及考季筛选。", "Filter by WMA, WFM, WME, WST or WDM unit code and series."),
    paperLink("Pearson 试卷发布政策", "Pearson Assessment Publication Policy", "https://qualifications.pearson.com/content/dam/pdf/Support/policies-for-centres-learners-and-employees/qualification-assessment-publication-policy.pdf", "index", "free", "说明公开时间、锁定材料和版权使用边界。", "Explains release timing, locked material and copyright-use boundaries."),
  ],
  lastVerified: VERIFIED_AT,
}));

export const edexcelCoursePastPaperArchives: PastPaperArchiveRecord[] = [
  ...igcsePastPaperArchives,
  ...ialPastPaperArchives,
];
