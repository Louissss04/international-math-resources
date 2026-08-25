import { assessmentThresholds } from "./assessments";
import {
  t,
  type AssessmentSyllabusRecord,
  type ContentSection,
  type DateRecord,
  type LearningResourceRecord,
  type PastPaperArchiveRecord,
  type ProjectRecord,
  type SourceRecord,
  type ThresholdRecord,
} from "../lib/types";

const VERIFIED_AT = "2026-08-05";

const source = (
  id: string,
  zh: string,
  en: string,
  url: string,
  kind: SourceRecord["kind"] = "official",
  appliesTo?: string,
): SourceRecord => ({
  id,
  label: t(zh, en),
  owner: t("College Board", "College Board"),
  url,
  kind,
  verifiedAt: VERIFIED_AT,
  ...(appliesTo ? { appliesTo } : {}),
});

export const apCourseSources: SourceRecord[] = [
  source("ap-2027-exam-dates", "2027 AP 考试日期", "2027 AP Exam Dates", "https://apstudents.collegeboard.org/exam-dates", "official", "May 2027 AP examinations"),
  source("ap-calculus-ced-2026", "AP Calculus AB/BC 课程与考试说明", "AP Calculus AB/BC Course and Exam Description", "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf", "official", "AP Calculus AB and BC, effective fall 2026"),
  source("ap-calculus-sample-2027", "AP Calculus AB/BC 现行样题", "AP Calculus AB/BC Current Sample Questions", "https://apcentral.collegeboard.org/media/pdf/sample-questions-ap-calculus-ab-and-bc-exams.pdf", "official-archive", "May 2027 format"),
  source("ap-bc-subscore", "AP Calculus BC 的 AB 分项成绩", "AP Calculus BC AB Subscore", "https://apstudents.collegeboard.org/about-ap-scores/special-score-structure-calculus-bc", "official", "AP Calculus BC"),
  source("ap-precalculus-course", "AP Precalculus 课程主页", "AP Precalculus Course", "https://apcentral.collegeboard.org/courses/ap-precalculus", "official", "AP Precalculus"),
  source("ap-precalculus-exam", "AP Precalculus 考试说明", "AP Precalculus Exam", "https://apcentral.collegeboard.org/courses/ap-precalculus/exam", "official", "May 2027 exam"),
  source("ap-precalculus-ced-2026", "AP Precalculus 课程与考试说明", "AP Precalculus Course and Exam Description", "https://apcentral.collegeboard.org/media/pdf/ap-precalculus-course-and-exam-description.pdf", "official", "Effective fall 2026"),
  source("ap-precalculus-frq", "AP Precalculus 历年自由作答题", "AP Precalculus Released Free-Response Questions", "https://apcentral.collegeboard.org/courses/ap-precalculus/exam/past-exam-questions", "official-archive", "Released AP Precalculus material"),
  source("ap-precalculus-score-distributions", "AP Precalculus 历年成绩分布", "Past AP Precalculus Score Distributions", "https://apstudents.collegeboard.org/about-ap-scores/score-distributions/ap-precalculus", "official-data", "2024-2026"),
  source("ap-statistics-course-2026", "AP Statistics 课程主页", "AP Statistics Course", "https://apcentral.collegeboard.org/courses/ap-statistics", "official", "Revised course effective fall 2026"),
  source("ap-statistics-exam-2027", "AP Statistics 考试说明", "AP Statistics Exam", "https://apcentral.collegeboard.org/courses/ap-statistics/exam", "official", "May 2027 exam"),
  source("ap-statistics-ced-2026", "AP Statistics 课程与考试说明", "AP Statistics Course and Exam Description", "https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description-effective-fall-2026.pdf", "official", "Effective fall 2026"),
  source("ap-statistics-frq", "AP Statistics 历年自由作答题", "AP Statistics Released Free-Response Questions", "https://apcentral.collegeboard.org/courses/ap-statistics/exam/past-exam-questions", "official-archive", "Released AP Statistics material"),
  source("ap-statistics-score-distributions", "AP Statistics 历年成绩分布", "Past AP Statistics Score Distributions", "https://apstudents.collegeboard.org/about-ap-scores/score-distributions/ap-statistics", "official-data", "2002-2026"),
];

type TopicRow = [string, string, string];
type ExamRow = [string, string, string, string, string];

type ApSpec = {
  id: string;
  slug: string;
  title: ReturnType<typeof t>;
  shortTitle: string;
  summary: ReturnType<typeof t>;
  cycle: string;
  assessedScope: ReturnType<typeof t>;
  prerequisite: ReturnType<typeof t>;
  delivery: ReturnType<typeof t>;
  calculator: ReturnType<typeof t>;
  examDate: string;
  examSession: ReturnType<typeof t>;
  topicRows: TopicRow[];
  examRows: ExamRow[];
  sourceIds: string[];
  cedSourceId: string;
  cedUrl: string;
  examSourceId: string;
  examUrl: string;
  archiveSourceId: string;
  archiveUrl: string;
  scoreSourceId: string;
  specialBullets?: ReturnType<typeof t>[];
};

const calculusExamRows: ExamRow[] = [
  ["选择题 A", "Multiple choice Part A", "29", "62 分钟；不得使用计算器", "62 minutes; no calculator"],
  ["选择题 B", "Multiple choice Part B", "13", "38 分钟；部分题要求图形计算器", "38 minutes; graphing calculator required for some questions"],
  ["自由作答 A", "Free response Part A", "2", "30 分钟；要求图形计算器", "30 minutes; graphing calculator required"],
  ["自由作答 B", "Free response Part B", "4", "60 分钟；不得使用计算器", "60 minutes; no calculator"],
];

const apSpecs: ApSpec[] = [
  {
    id: "ap-precalculus",
    slug: "ap-precalculus",
    title: t("AP Precalculus", "AP Precalculus"),
    shortTitle: "AP Precalculus",
    summary: t("以函数、建模和多种表示为核心的大学预备数学课程。2027 年考试为混合数字化，考查 Units 1–3；Unit 4 可教学但不参加统考。", "A college-preparatory mathematics course centred on functions, modelling and multiple representations. The 2027 hybrid-digital exam assesses Units 1–3; Unit 4 may be taught but is not examined."),
    cycle: "2026-27 course / May 2027 exam",
    assessedScope: t("Units 1–3；Unit 4 不纳入 AP 考试", "Units 1–3; Unit 4 is not assessed on the AP Exam"),
    prerequisite: t("官方建议已完成 Geometry 与 Algebra 2，或 Integrated Math 3", "College Board recommends prior completion of Geometry and Algebra 2, or Integrated Math 3"),
    delivery: t("混合数字化：Bluebook 完成选择题并查看自由作答题，FRQ 写在纸质答题册", "Hybrid digital: MCQs and FRQ prompts in Bluebook, with FRQ responses handwritten in a paper booklet"),
    calculator: t("部分试卷要求符合规定的图形计算器；指定部分禁止使用", "An approved graphing calculator is required for designated parts and prohibited for the remaining parts"),
    examDate: "2027-05-11",
    examSession: t("Session 1；具体时间由 AP coordinator 通知", "Session 1; the AP coordinator confirms the local time"),
    topicRows: [
      ["多项式与有理函数", "Polynomial and Rational Functions", "30–40%"],
      ["指数与对数函数", "Exponential and Logarithmic Functions", "25–40%"],
      ["三角与极坐标函数", "Trigonometric and Polar Functions", "30–35%"],
      ["含参数、向量与矩阵的函数", "Functions Involving Parameters, Vectors, and Matrices", "不考 / Not assessed"],
    ],
    examRows: [
      ["选择题 A", "Multiple choice Part A", "29", "65 分钟；不得使用计算器", "65 minutes; no calculator"],
      ["选择题 B", "Multiple choice Part B", "13", "40 分钟；要求图形计算器", "40 minutes; graphing calculator required"],
      ["自由作答 A", "Free response Part A", "2", "35 分钟；要求图形计算器", "35 minutes; graphing calculator required"],
      ["自由作答 B", "Free response Part B", "2", "35 分钟；不得使用计算器", "35 minutes; no calculator"],
    ],
    sourceIds: ["ap-precalculus-course", "ap-precalculus-exam", "ap-precalculus-ced-2026", "ap-precalculus-frq", "ap-precalculus-score-distributions", "ap-2027-exam-dates", "ap-registration", "ap-china", "ap-china-registration-2027", "ap-china-timeline-2027"],
    cedSourceId: "ap-precalculus-ced-2026",
    cedUrl: "https://apcentral.collegeboard.org/media/pdf/ap-precalculus-course-and-exam-description.pdf",
    examSourceId: "ap-precalculus-exam",
    examUrl: "https://apcentral.collegeboard.org/courses/ap-precalculus/exam",
    archiveSourceId: "ap-precalculus-frq",
    archiveUrl: "https://apcentral.collegeboard.org/courses/ap-precalculus/exam/past-exam-questions",
    scoreSourceId: "ap-precalculus-score-distributions",
    specialBullets: [t("课程框架含 4 个单元，但只有前 3 个单元进入 AP 考试；查看教材目录时不要把 Unit 4 当作必考范围。", "The framework contains four units, but only Units 1–3 are assessed; Unit 4 should not be treated as mandatory exam content.")],
  },
  {
    id: "ap-calculus-ab",
    slug: "ap-calculus-ab",
    title: t("AP Calculus AB", "AP Calculus AB"),
    shortTitle: "AP Calculus AB",
    summary: t("大学第一学期单变量微积分课程，覆盖极限、导数、积分、微分方程及其应用。2027 年采用 42 道数字化选择题和 6 道纸笔自由作答题。", "A first-semester college single-variable calculus course covering limits, derivatives, integrals, differential equations and applications. The 2027 exam uses 42 digital MCQs and six handwritten FRQs."),
    cycle: "2026-27 course / May 2027 exam",
    assessedScope: t("官方 Units 1–8", "Official Units 1–8"),
    prerequisite: t("熟练掌握代数、几何、三角、解析几何及初等函数", "Fluency in algebra, geometry, trigonometry, analytic geometry and elementary functions"),
    delivery: t("混合数字化：Bluebook 完成选择题并查看自由作答题，FRQ 写在纸质答题册", "Hybrid digital: MCQs and FRQ prompts in Bluebook, with FRQ responses handwritten in a paper booklet"),
    calculator: t("MCQ Part B 与 FRQ Part A 要求图形计算器；其余部分禁止使用", "A graphing calculator is required for MCQ Part B and FRQ Part A and prohibited elsewhere"),
    examDate: "2027-05-10",
    examSession: t("Session 1；与 AP Calculus BC 同时举行", "Session 1; administered at the same time as AP Calculus BC"),
    topicRows: [
      ["极限与连续性", "Limits and Continuity", "10–15%"], ["微分：定义与基本法则", "Differentiation: Definition and Basic Rules", "10–15%"], ["复合、隐函数与反函数微分", "Composite, Implicit and Inverse Differentiation", "5–10%"], ["微分的情境应用", "Contextual Applications of Differentiation", "10–15%"], ["用导数分析函数", "Analytical Applications of Differentiation", "15–20%"], ["积分与变化累积", "Integration and Accumulation of Change", "15–20%"], ["微分方程", "Differential Equations", "5–10%"], ["积分的应用", "Applications of Integration", "10–15%"],
    ],
    examRows: calculusExamRows,
    sourceIds: ["ap-calculus-ced-2026", "ap-clarifications-2027", "ap-ab-exam", "ap-ab-past-questions", "ap-ab-score-distributions", "ap-calculus-sample-2027", "ap-2027-exam-dates", "ap-registration", "ap-china", "ap-china-registration-2027", "ap-china-timeline-2027"],
    cedSourceId: "ap-calculus-ced-2026",
    cedUrl: "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf",
    examSourceId: "ap-ab-exam",
    examUrl: "https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam",
    archiveSourceId: "ap-ab-past-questions",
    archiveUrl: "https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam/past-exam-questions",
    scoreSourceId: "ap-ab-score-distributions",
    specialBullets: [t("同一考试年度不得同时参加 AP Calculus AB 与 AP Calculus BC。", "A candidate may not take AP Calculus AB and AP Calculus BC in the same exam year.")],
  },
  {
    id: "ap-calculus-bc",
    slug: "ap-calculus-bc",
    title: t("AP Calculus BC", "AP Calculus BC"),
    shortTitle: "AP Calculus BC",
    summary: t("在 AB 核心内容上增加参数方程、极坐标、向量值函数及无穷数列与级数，通常对应连续两个学期的大学单变量微积分。", "A two-semester college single-variable calculus course that includes the AB core plus parametric equations, polar coordinates, vector-valued functions, and infinite sequences and series."),
    cycle: "2026-27 course / May 2027 exam",
    assessedScope: t("官方 Units 1–10；共同单元含 BC 扩展内容", "Official Units 1–10, including BC extensions within shared units"),
    prerequisite: t("具备 AB 所需全部先修，并能承担更快进度和额外级数内容", "All AB prerequisites plus readiness for a faster pace and additional series content"),
    delivery: t("混合数字化：Bluebook 完成选择题并查看自由作答题，FRQ 写在纸质答题册", "Hybrid digital: MCQs and FRQ prompts in Bluebook, with FRQ responses handwritten in a paper booklet"),
    calculator: t("MCQ Part B 与 FRQ Part A 要求图形计算器；其余部分禁止使用", "A graphing calculator is required for MCQ Part B and FRQ Part A and prohibited elsewhere"),
    examDate: "2027-05-10",
    examSession: t("Session 1；与 AP Calculus AB 同时举行", "Session 1; administered at the same time as AP Calculus AB"),
    topicRows: [
      ["极限与连续性", "Limits and Continuity", "5–10%"], ["微分：定义与基本法则", "Differentiation: Definition and Basic Rules", "5–10%"], ["复合、隐函数与反函数微分", "Composite, Implicit and Inverse Differentiation", "5–10%"], ["微分的情境应用", "Contextual Applications of Differentiation", "5–10%"], ["用导数分析函数", "Analytical Applications of Differentiation", "10–15%"], ["积分与变化累积", "Integration and Accumulation of Change", "15–20%"], ["微分方程", "Differential Equations", "5–10%"], ["积分的应用", "Applications of Integration", "5–10%"], ["参数方程、极坐标与向量值函数", "Parametric Equations, Polar Coordinates and Vector-Valued Functions", "10–15%"], ["无穷数列与级数", "Infinite Sequences and Series", "15–20%"],
    ],
    examRows: calculusExamRows,
    sourceIds: ["ap-calculus-ced-2026", "ap-clarifications-2027", "ap-bc-exam", "ap-bc-past-questions", "ap-bc-score-distributions", "ap-calculus-sample-2027", "ap-bc-subscore", "ap-2027-exam-dates", "ap-registration", "ap-china", "ap-china-registration-2027", "ap-china-timeline-2027"],
    cedSourceId: "ap-calculus-ced-2026",
    cedUrl: "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf",
    examSourceId: "ap-bc-exam",
    examUrl: "https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam",
    archiveSourceId: "ap-bc-past-questions",
    archiveUrl: "https://apcentral.collegeboard.org/courses/ap-calculus-bc/exam/past-exam-questions",
    scoreSourceId: "ap-bc-score-distributions",
    specialBullets: [t("BC 成绩单另报 AB subscore；该分项约基于试卷中 60% 的 AB 内容，大学自行决定是否承认。", "The BC score report includes an AB subscore based on roughly 60% AB content; each institution decides whether to recognise it."), t("同一考试年度不得同时参加 AB 与 BC。", "AB and BC may not both be taken in the same exam year.")],
  },
  {
    id: "ap-statistics",
    slug: "ap-statistics",
    title: t("AP Statistics", "AP Statistics"),
    shortTitle: "AP Statistics",
    summary: t("大学入门统计课程，2026–27 学年重组为五个单元。2027 年考试改为完全数字化，含 42 道选择题和 4 道自由作答题。", "An introductory college statistics course reorganised into five units for 2026–27. The 2027 exam is fully digital with 42 MCQs and four FRQs."),
    cycle: "2026-27 revised course / May 2027 exam",
    assessedScope: t("五个单元：数据与收集、概率、比例推断、均值推断、回归", "Five units: data and collection, probability, inference for proportions, inference for means, and regression"),
    prerequisite: t("修完一年代数课程；2026–27 版本取消第二年代数先修", "Completion of a first-year algebra course; the revised course removes the second-year algebra prerequisite"),
    delivery: t("完全数字化：选择题和自由作答题均在 Bluebook 完成并提交", "Fully digital: both MCQs and FRQs are completed and submitted in Bluebook"),
    calculator: t("两部分均使用具统计功能的图形计算器；Bluebook 同时提供内置 Desmos", "A graphing calculator with statistical capabilities is used in both sections; Bluebook also provides built-in Desmos"),
    examDate: "2027-05-11",
    examSession: t("Session 2；具体时间由 AP coordinator 通知", "Session 2; the AP coordinator confirms the local time"),
    topicRows: [
      ["单变量数据与数据收集", "Exploring One-Variable Data and Collecting Data", "20–30%"], ["概率、随机变量与概率分布", "Probability, Random Variables and Probability Distributions", "15–25%"], ["分类数据推断：比例", "Inference for Categorical Data: Proportions", "15–25%"], ["定量数据推断：均值", "Inference for Quantitative Data: Means", "10–20%"], ["回归分析", "Regression Analysis", "10–20%"],
    ],
    examRows: [
      ["选择题", "Multiple choice", "42", "90 分钟；占 50%", "90 minutes; 50%"], ["自由作答", "Free response", "4", "90 分钟；每题 10 分、各占 12.5%", "90 minutes; four 10-point questions worth 12.5% each"],
    ],
    sourceIds: ["ap-statistics-course-2026", "ap-statistics-exam-2027", "ap-statistics-ced-2026", "ap-statistics-frq", "ap-statistics-score-distributions", "ap-2027-exam-dates", "ap-registration", "ap-china", "ap-china-registration-2027", "ap-china-timeline-2027"],
    cedSourceId: "ap-statistics-ced-2026",
    cedUrl: "https://apcentral.collegeboard.org/media/pdf/ap-statistics-course-and-exam-description-effective-fall-2026.pdf",
    examSourceId: "ap-statistics-exam-2027",
    examUrl: "https://apcentral.collegeboard.org/courses/ap-statistics/exam",
    archiveSourceId: "ap-statistics-frq",
    archiveUrl: "https://apcentral.collegeboard.org/courses/ap-statistics/exam/past-exam-questions",
    scoreSourceId: "ap-statistics-score-distributions",
    specialBullets: [t("2027 是重组后课程和完全数字化试卷的首次考试；旧版六道 FRQ 结构不可直接套用。", "May 2027 is the first exam for the reorganised course and fully digital four-FRQ format; the former six-FRQ structure no longer applies.")],
  },
];

function apChinaRegistrationDates(projectId: string): DateRecord[] {
  const sourceIds = ["ap-china-timeline-2027"];
  const region = t("中国大陆 Prometric 路径", "Prometric route in mainland China");
  return [
    { id: `${projectId}-china-coordinator-open`, label: t("AP 管理员系统开放", "AP coordinator system opens"), date: "2026-09-15", region, status: "confirmed", sourceIds, note: t("中午 12:00 开放，管理员开始提交学生和科目花名册。", "Opens at 12:00 noon for coordinators to submit student and subject rosters.") },
    { id: `${projectId}-china-student-open`, label: t("AP 学生开始报名", "AP student registration opens"), date: "2026-09-16", region, status: "confirmed", sourceIds },
    { id: `${projectId}-china-roster-deadline`, label: t("AP 学校花名册截止", "AP school roster deadline"), date: "2026-10-16", region, status: "confirmed", sourceIds, note: t("中午 12:00 截止。", "Deadline is 12:00 noon.") },
    { id: `${projectId}-china-payment-deadline`, label: t("AP 报名缴费截止", "AP registration and payment deadline"), date: "2026-11-09", region, status: "confirmed", sourceIds, note: t("中午 12:00 截止。", "Deadline is 12:00 noon.") },
    { id: `${projectId}-china-myap-check`, label: t("核对 My AP 科目与资料", "Verify My AP subjects and details"), date: "2026-12-01", region, status: "confirmed", sourceIds },
    { id: `${projectId}-china-correction-deadline`, label: t("资料及科目更正截止", "Details and subject correction deadline"), date: "2027-03-12", region, status: "confirmed", sourceIds },
    { id: `${projectId}-china-admission-letter`, label: t("准考信开放下载", "Admission letter available"), date: "2027-04-03", region, status: "confirmed", sourceIds },
  ];
}

function chinaRegistrationSection(): ContentSection {
  return {
    id: "ap-china-registration",
    title: t("中国学生报名", "Registration for students in China"),
    bullets: [
      t("AP 授权学校学生通过本校 AP coordinator 和 My AP class／exam-only section 报名；学校决定开考科目及是否接收外校考生。", "Students at AP-authorized schools register through their AP coordinator and a My AP class or exam-only section; each school decides which subjects it offers and whether it accepts external candidates."),
      t("中国大陆指定考务路线、公开考点、资格和证件要求按 Prometric 中国 2027 通知执行；AP 授权学校学生由本校 AP coordinator 先提交名单。", "Mainland-China administration routes, public centres, eligibility and ID requirements follow the 2027 Prometric China notice; students at AP-authorized schools must first be placed on the roster by their AP coordinator."),
      t("学生自 2026 年 9 月 16 日起办理，全部科目确认与缴费在 11 月 9 日中午 12:00 截止；每科 1475 元，其中 88 元手续费及税费不退。", "Student registration begins on 16 September 2026, with all subject confirmation and payment due by 12:00 noon on 9 November. The fee is CNY 1,475 per exam, including a non-refundable CNY 88 processing fee and tax."),
      t("社会考生须符合 Prometric 列明的高中在读、自主学习／网校或因大学录取需要指定 AP 成绩等条件；已由本校提供 AP 报名的学生必须通过本校报考。", "Unaffiliated candidates must meet Prometric's listed conditions, such as current high-school, home/independent/online study, or needing a specified AP score for university admission. Students whose AP school offers registration must register through that school."),
      t("同一科目不得在不同学校或考点重复报名。缴费完成后不得取消或退款，缺考没有补考或退款；只有主办方无法正常组织考试等规定情形可扣除手续费后退款。", "The same subject must not be registered at multiple schools or centres. After payment, cancellation and refunds are unavailable, and there is no make-up or refund for absence; only specified organizer-side disruptions may qualify for a refund less the processing charge."),
      t("Prometric 中国考点不支持 Chromebook；iPad 或 Windows 平板须配实体键盘，设备至少可续航 4 小时。", "Prometric China centres do not support Chromebooks. An iPad or Windows tablet requires a physical keyboard, and the device must have at least four hours of battery life."),
    ],
  };
}

function projectSections(spec: ApSpec): ContentSection[] {
  return [
    {
      id: `${spec.id}-course-scope`,
      title: t("课程范围与考试权重", "Course scope and exam weighting"),
      tables: [{
        columns: [t("单元／内容", "Unit / content"), t("选择题权重", "Multiple-choice weighting")],
        rows: spec.topicRows.map(([zh, en, weight]) => ({ cells: [t(zh, en), t(weight, weight)] })),
        note: t("权重为官方预计范围，不表示每年固定题数。", "Official weightings are approximate ranges, not fixed annual question counts."),
      }],
    },
    {
      id: `${spec.id}-exam-format`,
      title: t("2027 年考试结构", "2027 exam structure"),
      tables: [{
        columns: [t("部分", "Section"), t("题数", "Questions"), t("时间、计算器与权重", "Timing, calculator and weighting")],
        rows: spec.examRows.map(([zh, en, questions, zhDetail, enDetail]) => ({ cells: [t(zh, en), t(questions, questions), t(zhDetail, enDetail)] })),
      }],
      ...(spec.specialBullets ? { bullets: spec.specialBullets } : {}),
    },
    chinaRegistrationSection(),
    {
      id: `${spec.id}-scores-credit`,
      title: t("成绩、学分与公开数据", "Scores, credit and public data"),
      bullets: [
        t("AP 成绩采用 1–5 分制；College Board 每年重新进行标准设定，未在考前公布固定的原始分换算线。", "AP reports scores on a 1–5 scale. College Board sets standards for each administration and does not publish a fixed pre-exam raw-score conversion."),
        t("页面中的历年数据是获得 5 分或 3 分及以上的考生比例，不是所谓‘5 分分数线’。", "Historical figures on this site are the shares earning a 5 or 3+, not raw-score cutoffs for a 5."),
        t("大学自行决定是否把 AP 成绩用于申请、学分、分班或先修课认定，应查目标大学当届政策。", "Each university decides how AP is used for admission, credit, placement or prerequisites; the current institutional policy must be checked."),
      ],
    },
  ];
}

export const apCourseProjects: ProjectRecord[] = apSpecs.map((spec) => ({
  id: spec.id,
  slug: spec.slug,
  track: "curriculum",
  title: spec.title,
  shortTitle: spec.shortTitle,
  organizer: t("College Board", "College Board"),
  summary: spec.summary,
  regions: ["global", "china", "us"],
  gradeBands: ["high-school"],
  eligibilityTags: ["school-or-authorized-center-registration", "exam-only-section-possible", "china-route-varies-by-cycle"],
  formatTags: ["course-and-exam", "multiple-choice", "free-response", spec.delivery.en.toLowerCase().includes("fully") ? "fully-digital" : "hybrid-digital"],
  costBand: "varies",
  status: "confirmed",
  cycle: spec.cycle,
  lastVerified: "2026-08-25",
  facts: [
    { label: t("课程层级", "Course level"), value: t("高中阶段的大学先修课程与统一考试", "College-level high-school course and standardized subject exam"), sourceIds: [spec.cedSourceId] },
    { label: t("考查范围", "Assessed scope"), value: spec.assessedScope, sourceIds: [spec.cedSourceId] },
    { label: t("建议先修", "Recommended prerequisite"), value: spec.prerequisite, sourceIds: [spec.cedSourceId] },
    { label: t("考试方式", "Delivery"), value: spec.delivery, sourceIds: [spec.examSourceId] },
    { label: t("计算器", "Calculator"), value: spec.calculator, sourceIds: [spec.cedSourceId, spec.examSourceId] },
    { label: t("考试日期", "Exam date"), value: t(`${spec.examDate}；${spec.examSession.zh}`, `${spec.examDate}; ${spec.examSession.en}`), sourceIds: ["ap-2027-exam-dates"] },
    { label: t("成绩", "Score"), value: t("1–5；原始分转换线不预先固定公布", "1–5; raw-score conversion points are not published as fixed advance cutoffs"), sourceIds: [spec.scoreSourceId] },
    { label: t("中国报名", "Registration in China"), value: t("授权学校学生先由 AP coordinator 提交名单；符合条件的社会考生通过 MyAPChina 申请。2026 年 11 月 9 日中午 12:00 截止缴费，每科 1475 元", "Authorized-school students must first be rostered by their AP coordinator; eligible unaffiliated candidates apply through MyAPChina. Payment is due by 12:00 noon on 9 November 2026 at CNY 1,475 per exam"), sourceIds: ["ap-registration", "ap-china", "ap-china-registration-2027", "ap-china-timeline-2027"] },
  ],
  dates: [...(spec.id === "ap-calculus-ab" ? apChinaRegistrationDates(spec.id) : []), {
    id: `${spec.id}-2027-exam`,
    label: t(`${spec.shortTitle} 2027 正式考试`, `${spec.shortTitle} 2027 regular exam`),
    date: spec.examDate,
    region: t("各考点当地安排", "Local administration at each centre"),
    status: "confirmed",
    sourceIds: ["ap-2027-exam-dates"],
    note: spec.examSession,
  } satisfies DateRecord],
  sections: projectSections(spec),
  sourceIds: spec.sourceIds,
  relatedIds: apSpecs.filter((item) => item.id !== spec.id).map((item) => item.id),
  searchTerms: [spec.shortTitle, spec.title.zh, spec.title.en, "AP math", "AP 数学", "College Board", "Bluebook", "中国 AP 报名"],
}));

export const apCourseSyllabi: AssessmentSyllabusRecord[] = apSpecs.map((spec) => ({
  id: `syllabus-${spec.id}-2026-27`,
  slug: `${spec.slug}-2026-27`,
  projectId: spec.id,
  classification: "formal-specification",
  title: t(`${spec.title.zh} 2026–27 课程与考试框架`, `${spec.title.en} 2026–27 Course and Exam Framework`),
  officialName: spec.title,
  applicableCycle: t("2026–27 学年；2027 年 5 月考试", "2026–27 school year; May 2027 exam"),
  effectiveFrom: "2026-08",
  status: "confirmed",
  summary: t(`依据 College Board 当前 CED 整理 ${spec.title.zh} 的必学单元、考试权重、试卷结构和计算器规则。`, `Current College Board CED requirements for ${spec.title.en}, including units, exam weighting, paper structure and calculator rules.`),
  facts: [
    { label: t("课程文件", "Course document"), value: t("Course and Exam Description（CED）", "Course and Exam Description (CED)") },
    { label: t("适用考试", "Applicable exam"), value: t("2027 年 5 月", "May 2027") },
    { label: t("考查范围", "Assessed scope"), value: spec.assessedScope },
    { label: t("考试方式", "Delivery"), value: spec.delivery },
    { label: t("计算器", "Calculator"), value: spec.calculator },
  ],
  sections: projectSections(spec).slice(0, 2),
  sources: [
    { title: t(`${spec.title.zh} CED`, `${spec.title.en} CED`), provider: t("College Board", "College Board"), url: spec.cedUrl, format: "pdf", version: t("2026–27 适用版本", "Version applicable to 2026–27") },
    { title: t(`${spec.title.zh} 考试说明`, `${spec.title.en} exam information`), provider: t("College Board", "College Board"), url: spec.examUrl, format: "webpage", version: t("2027 年考试结构", "2027 exam structure") },
  ],
  translationNote: t("保留 College Board 的 Unit、Part、MCQ、FRQ 和 CED 层级；百分比为官方预计权重，不换算为固定题数。", "College Board's Unit, Part, MCQ, FRQ and CED hierarchy is retained. Percentage ranges are official approximate weightings and are not converted into fixed question counts."),
  lastVerified: VERIFIED_AT,
}));

function resource(
  id: string,
  projectId: string,
  titleZh: string,
  titleEn: string,
  url: string,
  kind: LearningResourceRecord["kind"],
  descriptionZh: string,
  descriptionEn: string,
  access: LearningResourceRecord["access"] = "free",
): LearningResourceRecord {
  return { id, projectIds: [projectId], title: t(titleZh, titleEn), provider: t("College Board", "College Board"), url, kind, description: t(descriptionZh, descriptionEn), access, verifiedAt: VERIFIED_AT };
}

export const apCourseLearningResources: LearningResourceRecord[] = apSpecs.flatMap((spec) => [
  resource(`lr-${spec.id}-ced`, spec.id, `${spec.title.zh} 课程与考试说明`, `${spec.title.en} Course and Exam Description`, spec.cedUrl, "official-guide", "现行官方课程框架、考试蓝图、样题和评分说明。", "Current official course framework, exam blueprint, sample questions and scoring guidance."),
  resource(`lr-${spec.id}-released-frq`, spec.id, `${spec.title.zh} 已发布自由作答题`, `${spec.title.en} Released Free-Response Questions`, spec.archiveUrl, "past-papers", "官方公开的近年 FRQ、评分标准、考生样卷、评语和统计；公开内容随年度更新。", "Official recent FRQs, scoring guidelines, sample responses, commentary and statistics; public coverage changes as new years are added."),
  resource(`lr-${spec.id}-exam-page`, spec.id, `${spec.title.zh} 考试与 Bluebook 练习入口`, `${spec.title.en} Exam and Bluebook Practice`, spec.examUrl, "practice-platform", "考试结构、计算器政策、Bluebook test preview 和考试资源入口。", "Exam format, calculator policy, Bluebook test preview and exam-resource links."),
]);

export const apCoursePastPaperArchives: PastPaperArchiveRecord[] = apSpecs.map((spec) => ({
  id: `past-papers-${spec.id}`,
  projectId: spec.id,
  availability: "official",
  summary: t("College Board 公开近年的自由作答题及配套评分材料，CED 另含现行样题。未发布的选择题属于安全材料，因此这里不是完整历年整卷库。", "College Board publishes recent free-response questions and related scoring material, while the CED includes current sample questions. Unreleased multiple-choice questions remain secure, so this is not a complete full-paper archive."),
  links: [
    { title: t(`${spec.title.zh} 已发布 FRQ`, `${spec.title.en} released FRQs`), provider: t("College Board", "College Board"), url: spec.archiveUrl, authority: "official", kind: "archive", access: "free", note: t("公开年度与配套评分材料以页面当前显示为准。", "Available years and scoring material are those currently shown on the source page.") },
    { title: t(`${spec.title.zh} CED 样题`, `${spec.title.en} CED sample questions`), provider: t("College Board", "College Board"), url: spec.cedUrl, authority: "official", kind: "specimen", access: "free", note: t("CED 末部含样题和评分说明。", "The CED includes sample questions and scoring guidance near the end.") },
  ],
  lastVerified: VERIFIED_AT,
}));

const calculusThresholds: ThresholdRecord[] = assessmentThresholds
  .filter((record) => record.projectId === "ap-calculus" && (record.sitting === "AB" || record.sitting === "BC"))
  .map((record) => ({
    ...record,
    id: record.id.replace(/^ap-/, "course-ap-"),
    projectId: record.sitting === "AB" ? "ap-calculus-ab" : "ap-calculus-bc",
  }));

const precalculusDistributionRows = [
  ["2026", "29%", "82%"], ["2025", "28.1%", "80.8%"], ["2024", "25.9%", "75.6%"],
] as const;

const statisticsDistributionRows = [
  ["2026", "17%", "62%"], ["2025", "17.0%", "60.3%"], ["2024", "17.5%", "61.8%"], ["2023", "15.1%", "60.0%"], ["2022", "14.8%", "60.4%"], ["2021", "16.2%", "57.9%"], ["2020", "16.2%", "60.0%"], ["2019", "14.7%", "59.7%"], ["2018", "14.6%", "60.7%"], ["2017", "13.6%", "54.3%"], ["2016", "14.3%", "60.9%"], ["2015", "13.4%", "57.8%"], ["2014", "14.3%", "59.6%"], ["2013", "12.8%", "57.9%"], ["2012", "12.5%", "59.2%"], ["2011", "12.4%", "58.8%"], ["2010", "12.8%", "58.7%"], ["2009", "12.3%", "58.8%"], ["2008", "12.9%", "59.3%"], ["2007", "11.9%", "54.3%"], ["2006", "12.6%", "60.2%"], ["2005", "12.6%", "60.7%"], ["2004", "12.6%", "59.9%"], ["2003", "13.2%", "61.9%"], ["2002", "11.2%", "56.9%"],
] as const;

function distributionThresholds(
  projectId: string,
  rows: ReadonlyArray<readonly [string, string, string]>,
  sourceId: string,
): ThresholdRecord[] {
  return rows.flatMap(([year, score5, score3Plus]) => [
    { id: `${projectId}-${year}-score-5-share`, projectId, year, sitting: "Global", metric: t("获得 5 分的考生比例", "Share of candidates scoring 5"), value: score5, status: "confirmed", sourceIds: [sourceId], note: t("官方全球成绩分布，不是取得 5 分的原始分线。", "Official global score distribution, not the raw-score cutoff for a 5.") },
    { id: `${projectId}-${year}-score-3-plus-share`, projectId, year, sitting: "Global", metric: t("获得 3 分及以上的考生比例", "Share of candidates scoring 3 or higher"), value: score3Plus, status: "confirmed", sourceIds: [sourceId], note: t("官方全球成绩分布。", "Official global score distribution.") },
  ]);
}

export const apCourseThresholds: ThresholdRecord[] = [
  ...calculusThresholds,
  ...distributionThresholds("ap-precalculus", precalculusDistributionRows, "ap-precalculus-score-distributions"),
  ...distributionThresholds("ap-statistics", statisticsDistributionRows, "ap-statistics-score-distributions"),
];
