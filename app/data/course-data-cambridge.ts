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
const CAMBRIDGE_ZH = "剑桥国际教育";
const CAMBRIDGE_EN = "Cambridge International Education";

const source = (
  id: string,
  labelZh: string,
  labelEn: string,
  url: string,
  kind: SourceRecord["kind"],
  appliesTo: string,
  noteZh?: string,
  noteEn?: string,
): SourceRecord => ({
  id,
  label: t(labelZh, labelEn),
  owner: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
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

const date = (
  id: string,
  labelZh: string,
  labelEn: string,
  value: string,
  sourceIds: string[],
  noteZh: string,
  noteEn: string,
): DateRecord => ({
  id,
  label: t(labelZh, labelEn),
  date: value,
  region: t("中国大陆（行政区 5）", "Mainland China (administrative zone 5)"),
  status: "confirmed",
  sourceIds,
  note: t(noteZh, noteEn),
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
  provider: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  url,
  format,
  ...(versionZh && versionEn ? { version: t(versionZh, versionEn) } : {}),
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
});

const learningResource = (
  id: string,
  projectId: string,
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
  projectIds: [projectId],
  title: t(titleZh, titleEn),
  provider: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
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
  provider: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  url,
  authority: "official",
  kind,
  access,
  note: t(noteZh, noteEn),
});

const chinaEntrySection = (code: string, syllabusSourceId: string): ContentSection => ({
  id: "china-registration",
  title: t("中国学生报名", "Entry for students in China"),
  tables: [
    {
      columns: [t("考生类型", "Candidate type"), t("报名方式", "Entry route")],
      rows: [
        row(
          [
            ["注册学校在读生", "Student at a registered Cambridge school"],
            [
              `由学校考务负责人按 ${code} 及正确的 component option 提交报名。考生应向学校确认本校开设的考季、层级或组合。`,
              `The school's exams officer enters the candidate under ${code} and the correct component option. Candidates should confirm the series, tier or route offered by their school.`,
            ],
          ],
          [syllabusSourceId, "cambridge-zone5-entry-guide-2026"],
        ),
        row(
          [
            ["社会考生", "Private candidate"],
            [
              "现行考纲允许社会考生报考。考生必须自行找到愿意接收社会考生的 Cambridge 中心或获批考试服务机构，并直接向该中心报名、缴费及申请考试安排；不能直接向 Cambridge 报名。",
              "The current syllabus permits private candidates. A candidate must find a Cambridge centre or approved exam provider that accepts private candidates and arrange entry, payment and exam administration directly with that centre; direct entry with Cambridge is not available.",
            ],
          ],
          [syllabusSourceId, "cambridge-private-candidates", "cambridge-private-registration"],
        ),
        row(
          [
            ["中国行政区", "China administrative zone"],
            [
              "Cambridge 2026 年报名指南将 China 列为行政区 5。港澳及其他地区须使用官方行政区查询工具重新核对；具体开考时间由考点通知。",
              "Cambridge's 2026 entry guide lists China in administrative zone 5. Hong Kong, Macao and other locations must be checked separately with the official zone tool; the centre confirms exact start times.",
            ],
          ],
          ["cambridge-zone5-entry-guide-2026", "cambridge-exam-timetables"],
        ),
        row(
          [
            ["费用与截止日", "Fees and deadlines"],
            [
              "Cambridge 未在公开页面公布统一的中国社会考生价格或各中心内部截止日，须向接收报名的中心确认。",
              "Cambridge does not publish a single public fee or internal centre deadline for private candidates in China; the accepting centre must confirm both.",
            ],
          ],
          ["cambridge-private-registration"],
        ),
      ],
    },
  ],
});

const thresholdSection = (
  sourceId: string,
  archiveSourceId: string,
  systemZh: string,
  systemEn: string,
  changeNoteZh?: string,
  changeNoteEn?: string,
): ContentSection => ({
  id: "grading-thresholds",
  title: t("成绩与分数线", "Grades and thresholds"),
  paragraphs: [
    t(systemZh, systemEn),
    t(
      "Cambridge 在每个考季结束后公布 grade threshold table，分别列出单个 component 以及可用 component combination／entry option 的最低分。不同考季、variant 和组合的分数线不能合并为一条固定线。",
      "After each series, Cambridge publishes grade threshold tables with minimum marks for individual components and valid component combinations or entry options. Thresholds from different series, variants and combinations must not be merged into a single fixed cutoff.",
    ),
    ...(changeNoteZh && changeNoteEn ? [t(changeNoteZh, changeNoteEn)] : []),
  ],
  tables: [
    {
      columns: [t("资料", "Record"), t("状态", "Status")],
      rows: [
        row(
          [
            ["现行成绩等级", "Current grade range"],
            [systemZh, systemEn],
          ],
          [sourceId],
        ),
        row(
          [
            ["官方分数线档案", "Official threshold archive"],
            [
              "公开总目录当前可见 2022 年 3 月至 2026 年 3 月各考季；2026 年 6 月分数线截至核查日尚未出现在总目录。",
              "The public index currently exposes series from March 2022 through March 2026; June 2026 thresholds were not yet listed on the verification date.",
            ],
          ],
          [archiveSourceId],
        ),
      ],
    },
  ],
});

export const cambridgeCourseSources: SourceRecord[] = [
  source(
    "cie-0580-overview",
    "Cambridge IGCSE Mathematics (0580) 课程主页",
    "Cambridge IGCSE Mathematics (0580) overview",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/",
    "official",
    "Cambridge IGCSE Mathematics 0580",
  ),
  source(
    "cie-0580-syllabus",
    "0580 2025–2027 官方考纲",
    "0580 official syllabus for 2025–2027",
    "https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf",
    "official",
    "Cambridge IGCSE Mathematics 0580; Version 3",
  ),
  source(
    "cie-0580-papers",
    "0580 官方真题与样题",
    "0580 official past papers and specimen materials",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/past-papers/",
    "official-archive",
    "Cambridge IGCSE Mathematics 0580",
    "公开页只提供部分材料；更多资源需 School Support Hub 学校账号。",
    "The public page provides a selection only; further materials require a School Support Hub school account.",
  ),
  source(
    "cie-0580-resources",
    "0580 官方认可教材目录",
    "0580 endorsed resources",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/published-resources/",
    "official",
    "Cambridge IGCSE Mathematics 0580",
  ),

  source(
    "cie-0607-overview",
    "Cambridge IGCSE International Mathematics (0607) 课程主页",
    "Cambridge IGCSE International Mathematics (0607) overview",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/",
    "official",
    "Cambridge IGCSE International Mathematics 0607",
  ),
  source(
    "cie-0607-syllabus",
    "0607 2025–2027 官方考纲",
    "0607 official syllabus for 2025–2027",
    "https://www.cambridgeinternational.org/Images/662472-2025-2027-syllabus.pdf",
    "official",
    "Cambridge IGCSE International Mathematics 0607; Version 3",
  ),
  source(
    "cie-0607-papers",
    "0607 官方真题与样题",
    "0607 official past papers and specimen materials",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/past-papers/",
    "official-archive",
    "Cambridge IGCSE International Mathematics 0607",
    "公开页只提供部分材料；更多资源需 School Support Hub 学校账号。",
    "The public page provides a selection only; further materials require a School Support Hub school account.",
  ),
  source(
    "cie-0607-resources",
    "0607 官方认可教材目录",
    "0607 endorsed resources",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/published-resources/",
    "official",
    "Cambridge IGCSE International Mathematics 0607",
  ),

  source(
    "cie-0606-overview",
    "Cambridge IGCSE Additional Mathematics (0606) 课程主页",
    "Cambridge IGCSE Additional Mathematics (0606) overview",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/",
    "official",
    "Cambridge IGCSE Additional Mathematics 0606",
  ),
  source(
    "cie-0606-syllabus",
    "0606 2025–2027 官方考纲",
    "0606 official syllabus for 2025–2027",
    "https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf",
    "official",
    "Cambridge IGCSE Additional Mathematics 0606; Version 1",
  ),
  source(
    "cie-0606-papers",
    "0606 官方真题与样题",
    "0606 official past papers and specimen materials",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/past-papers/",
    "official-archive",
    "Cambridge IGCSE Additional Mathematics 0606",
    "公开页只提供部分材料；更多资源需 School Support Hub 学校账号。",
    "The public page provides a selection only; further materials require a School Support Hub school account.",
  ),
  source(
    "cie-0606-resources",
    "0606 官方认可教材目录",
    "0606 endorsed resources",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/published-resources/",
    "official",
    "Cambridge IGCSE Additional Mathematics 0606",
  ),
  source(
    "cie-0606-factsheet",
    "0606 课程变化说明",
    "Getting ready to teach 0606",
    "https://www.cambridgeinternational.org/Images/665419-getting-ready-factsheet-for-igcse-maths-additional.pdf",
    "official",
    "Cambridge IGCSE Additional Mathematics 0606 from 2025",
  ),

  source(
    "cie-9709-overview",
    "Cambridge International AS & A Level Mathematics (9709) 课程主页",
    "Cambridge International AS & A Level Mathematics (9709) overview",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/",
    "official",
    "Cambridge International AS & A Level Mathematics 9709",
  ),
  source(
    "cie-9709-syllabus",
    "9709 2026–2027 官方考纲",
    "9709 official syllabus for 2026–2027",
    "https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf",
    "official",
    "Cambridge International AS & A Level Mathematics 9709; Version 4",
  ),
  source(
    "cie-9709-papers",
    "9709 官方真题与样题",
    "9709 official past papers and specimen materials",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/",
    "official-archive",
    "Cambridge International AS & A Level Mathematics 9709",
    "公开页只提供部分材料；更多资源需 School Support Hub 学校账号。",
    "The public page provides a selection only; further materials require a School Support Hub school account.",
  ),
  source(
    "cie-9709-resources",
    "9709 官方认可教材目录",
    "9709 endorsed resources",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/published-resources/",
    "official",
    "Cambridge International AS & A Level Mathematics 9709",
  ),
  source(
    "cie-9709-support",
    "9709 官方教学支持说明",
    "Official support for 9709 Mathematics",
    "https://www.cambridgeinternational.org/Images/641183-support-for-mathematics.pdf",
    "official",
    "Cambridge International AS & A Level Mathematics 9709",
  ),

  source(
    "cie-9231-overview",
    "Cambridge International AS & A Level Further Mathematics (9231) 课程主页",
    "Cambridge International AS & A Level Further Mathematics (9231) overview",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/",
    "official",
    "Cambridge International AS & A Level Further Mathematics 9231",
  ),
  source(
    "cie-9231-syllabus",
    "9231 2026–2027 官方考纲",
    "9231 official syllabus for 2026–2027",
    "https://www.cambridgeinternational.org/Images/697357-2026-2027-syllabus.pdf",
    "official",
    "Cambridge International AS & A Level Further Mathematics 9231; Version 3",
    "PDF 前部写 Version 3 发布于 2025 年 7 月，末尾变更记录写 2025 年 8 月；版本号一致，月份存在内部差异。",
    "The PDF front matter dates Version 3 to July 2025, while the change log says August 2025; the version number is consistent but the month differs internally.",
  ),
  source(
    "cie-9231-papers",
    "9231 官方真题与样题",
    "9231 official past papers and specimen materials",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/past-papers/",
    "official-archive",
    "Cambridge International AS & A Level Further Mathematics 9231",
    "公开页只提供部分材料；更多资源需 School Support Hub 学校账号。",
    "The public page provides a selection only; further materials require a School Support Hub school account.",
  ),
  source(
    "cie-9231-resources",
    "9231 官方认可教材目录",
    "9231 endorsed resources",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/published-resources/",
    "official",
    "Cambridge International AS & A Level Further Mathematics 9231",
  ),

  source(
    "cambridge-igcse-thresholds",
    "Cambridge IGCSE 官方分数线档案",
    "Cambridge IGCSE official grade-threshold archive",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/grade-threshold-tables/",
    "official-archive",
    "Cambridge IGCSE grade thresholds by series",
  ),
  source(
    "cambridge-alevel-thresholds",
    "Cambridge AS & A Level 官方分数线档案",
    "Cambridge AS & A Level official grade-threshold archive",
    "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/grade-threshold-tables/",
    "official-archive",
    "Cambridge International AS & A Level grade thresholds by series",
  ),
  source(
    "cambridge-private-candidates",
    "Cambridge 社会考生说明",
    "Cambridge private-candidate guidance",
    "https://www.cambridgeinternational.org/exam-administration/private-candidates/",
    "official",
    "Private candidates",
  ),
  source(
    "cambridge-private-registration",
    "Cambridge 社会考生报名办法",
    "How to register as a private candidate",
    "https://www.cambridgeinternational.org/exam-administration/private-candidates/register-as-a-private-candidate/",
    "official",
    "Private-candidate entry through an accepting centre",
  ),
  source(
    "cambridge-zone5-entry-guide-2026",
    "Cambridge 2026 年报名指南：中国行政区 5",
    "Cambridge Guide to Making Entries 2026: China in zone 5",
    "https://www.cambridgeinternational.org/Images/724211-guide-to-making-entries.pdf",
    "official",
    "June 2026 entry codes and China administrative zone 5",
  ),
  source(
    "cambridge-exam-timetables",
    "Cambridge 官方考试时间表",
    "Cambridge official exam timetables",
    "https://www.cambridgeinternational.org/exam-administration/cambridge-exams-officers-guide/phase-1-preparation/timetabling-exams/exam-timetables/",
    "official",
    "Final timetables by administrative zone",
  ),
  source(
    "cambridge-zone5-nov-2026-timetable",
    "2026 年 11 月行政区 5 最终时间表",
    "November 2026 final timetable for administrative zone 5",
    "https://www.cambridgeinternational.org/Images/757650-november-2026-zone-5-timetable.pdf",
    "official",
    "November 2026; administrative zone 5; Version 1, April 2026",
  ),
  source(
    "cambridge-school-support-hub",
    "Cambridge School Support Hub",
    "Cambridge School Support Hub",
    "https://schoolsupporthub.cambridgeinternational.org/",
    "official",
    "Restricted teaching and assessment resources for registered Cambridge schools",
  ),
];

const project0580: ProjectRecord = {
  id: "cie-igcse-mathematics-0580",
  slug: "cie-igcse-mathematics-0580",
  track: "curriculum",
  title: t("Cambridge IGCSE Mathematics（0580）", "Cambridge IGCSE Mathematics (0580)"),
  shortTitle: "IGCSE Mathematics 0580",
  organizer: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  summary: t(
    "分为 Core 与 Extended 两条路径的 IGCSE 数学课程。2025 年起每个层级均由一张无计算器卷和一张科学计算器卷组成。",
    "A tiered IGCSE mathematics course with Core and Extended routes. From 2025, each tier consists of one non-calculator paper and one scientific-calculator paper.",
  ),
  regions: ["global", "china"],
  gradeBands: ["middle-school", "high-school"],
  eligibilityTags: ["registered-school-entry", "private-candidates-allowed", "core-or-extended"],
  formatTags: ["paper-based", "written-exam", "calculator-and-non-calculator"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2025-2027",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("官方名称", "Official name", "Cambridge IGCSE Mathematics 0580", "Cambridge IGCSE Mathematics 0580", ["cie-0580-syllabus"]),
    fact("现行考纲", "Current syllabus", "2025–2027，Version 3，2024 年 5 月发布", "2025–2027, Version 3, published May 2024", ["cie-0580-syllabus"]),
    fact("层级", "Level", "Core 或 Extended；考生只参加其中一个层级的两张卷", "Core or Extended; a candidate takes the two papers for one tier", ["cie-0580-syllabus"]),
    fact("考试系列", "Exam series", "June、November；March 仅印度", "June and November; March in India only", ["cie-0580-syllabus"]),
    fact("成绩等级", "Grade range", "Core：C–G；Extended：A*–E", "Core: C–G; Extended: A*–E", ["cie-0580-syllabus"]),
    fact("社会考生", "Private candidates", "现行考纲允许；必须通过接收社会考生的中心报名", "Permitted by the current syllabus; entry must be made through an accepting centre", ["cie-0580-syllabus", "cambridge-private-registration"]),
    fact("后续考纲", "Next syllabus", "2028–2030 考纲已公布；2026 年考试仍使用 2025–2027 版", "The 2028–2030 syllabus is available; 2026 exams still use the 2025–2027 version", ["cie-0580-overview"]),
  ],
  dates: [
    date("cie-0580-nov-2026-paper-1-2", "0580 Paper 1／2（PM）", "0580 Paper 1/2 (PM)", "2026-10-08", ["cambridge-zone5-nov-2026-timetable"], "Core 考生参加 P1，Extended 考生参加 P2；确切开考时间由中心通知。", "Core candidates take P1 and Extended candidates take P2; the centre confirms the exact start time."),
    date("cie-0580-nov-2026-paper-3-4", "0580 Paper 3／4（PM）", "0580 Paper 3/4 (PM)", "2026-10-14", ["cambridge-zone5-nov-2026-timetable"], "Core 考生参加 P3，Extended 考生参加 P4；确切开考时间由中心通知。", "Core candidates take P3 and Extended candidates take P4; the centre confirms the exact start time."),
  ],
  sections: [
    {
      id: "assessment-structure",
      title: t("考试结构", "Assessment structure"),
      tables: [
        {
          columns: [t("路径／试卷", "Route / paper"), t("时间", "Duration"), t("分值", "Marks"), t("权重", "Weight"), t("计算器", "Calculator"), t("题型", "Question style")],
          rows: [
            row([["Core P1", "Core P1"], ["1小时30分", "1 hour 30 minutes"], ["80", "80"], ["50%", "50%"], ["不允许", "Not permitted"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0580-syllabus"]),
            row([["Core P3", "Core P3"], ["1小时30分", "1 hour 30 minutes"], ["80", "80"], ["50%", "50%"], ["须用科学计算器", "Scientific calculator required"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0580-syllabus"]),
            row([["Extended P2", "Extended P2"], ["2小时", "2 hours"], ["100", "100"], ["50%", "50%"], ["不允许", "Not permitted"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0580-syllabus"]),
            row([["Extended P4", "Extended P4"], ["2小时", "2 hours"], ["100", "100"], ["50%", "50%"], ["须用科学计算器", "Scientific calculator required"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0580-syllabus"]),
          ],
        },
      ],
    },
    {
      id: "route-choice",
      title: t("Core 与 Extended", "Core and Extended"),
      bullets: [
        t("Core 学习 Core 内容并参加 P1、P3，最高可获 C。", "Core candidates study Core content and take P1 and P3; the highest available grade is C."),
        t("Extended 包含 Core 内容及额外内容，参加 P2、P4，可获 A*–E。", "Extended includes Core and additional content; candidates take P2 and P4 and may receive A*–E."),
        t("2025 年起两个层级都设置专门的无计算器卷，旧结构分数线不应直接与 2025 年后合并比较。", "From 2025, both tiers have a dedicated non-calculator paper; thresholds under the old structure should not be merged directly with post-2025 results."),
      ],
    },
    chinaEntrySection("0580", "cie-0580-syllabus"),
    thresholdSection("cie-0580-syllabus", "cambridge-igcse-thresholds", "Core：C–G；Extended：A*–E。", "Core: C–G; Extended: A*–E.", "2025 年考试结构调整，历史档案应在 2024／2025 之间标记结构断点。", "The assessment structure changed in 2025; historical tables should mark a structural break between 2024 and 2025."),
  ],
  sourceIds: ["cie-0580-overview", "cie-0580-syllabus", "cie-0580-papers", "cie-0580-resources", "cambridge-igcse-thresholds", "cambridge-private-candidates", "cambridge-private-registration", "cambridge-zone5-entry-guide-2026", "cambridge-zone5-nov-2026-timetable"],
  relatedIds: ["cie-igcse-additional-mathematics-0606", "cie-igcse-international-mathematics-0607", "cie-as-a-level-mathematics-9709"],
  searchTerms: ["Cambridge", "IGCSE", "0580", "Core", "Extended", "剑桥数学", "CIE Mathematics"],
};

const project0607: ProjectRecord = {
  id: "cie-igcse-international-mathematics-0607",
  slug: "cie-igcse-international-mathematics-0607",
  track: "curriculum",
  title: t("Cambridge IGCSE International Mathematics（0607）", "Cambridge IGCSE International Mathematics (0607)"),
  shortTitle: "IGCSE International Mathematics 0607",
  organizer: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  summary: t(
    "包含 Core 与 Extended 路径，使用图形显示计算器，并以独立试卷考查数学探究以及 Extended 路径的建模。",
    "A Core/Extended IGCSE route using a graphic display calculator, with separate assessment of investigation and, at Extended, modelling.",
  ),
  regions: ["global", "china"],
  gradeBands: ["middle-school", "high-school"],
  eligibilityTags: ["registered-school-entry", "private-candidates-allowed", "core-or-extended"],
  formatTags: ["paper-based", "written-exam", "graphic-display-calculator", "investigation", "modeling"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2025-2027",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("官方名称", "Official name", "Cambridge IGCSE International Mathematics 0607", "Cambridge IGCSE International Mathematics 0607", ["cie-0607-syllabus"]),
    fact("现行考纲", "Current syllabus", "2025–2027，Version 3，2023 年 10 月发布", "2025–2027, Version 3, published October 2023", ["cie-0607-syllabus"]),
    fact("考试构成", "Assessment", "每名考生参加三张卷：无计算器、图形计算器及探究／建模卷", "Each candidate takes three papers: non-calculator, graphic-calculator and investigation/modelling", ["cie-0607-syllabus"]),
    fact("考试系列", "Exam series", "June、November；March 仅印度", "June and November; March in India only", ["cie-0607-syllabus"]),
    fact("成绩等级", "Grade range", "Core：C–G；Extended：A*–E", "Core: C–G; Extended: A*–E", ["cie-0607-syllabus"]),
    fact("社会考生", "Private candidates", "现行考纲允许；报名前应确认接收中心可提供正确的计算器及 component option 安排", "Permitted; candidates should confirm that the accepting centre can administer the correct calculator and component option", ["cie-0607-syllabus", "cambridge-private-registration"]),
    fact("后续考纲", "Next syllabus", "2028–2030 考纲已公布；2026 年考试仍使用 2025–2027 版", "The 2028–2030 syllabus is available; 2026 exams still use the 2025–2027 version", ["cie-0607-overview"]),
  ],
  dates: [
    date("cie-0607-nov-2026-paper-1-2", "0607 Paper 1／2（PM）", "0607 Paper 1/2 (PM)", "2026-09-29", ["cambridge-zone5-nov-2026-timetable"], "Core 参加 P1，Extended 参加 P2。", "Core takes P1 and Extended takes P2."),
    date("cie-0607-nov-2026-paper-3-4", "0607 Paper 3／4（PM）", "0607 Paper 3/4 (PM)", "2026-10-08", ["cambridge-zone5-nov-2026-timetable"], "Core 参加 P3，Extended 参加 P4。", "Core takes P3 and Extended takes P4."),
    date("cie-0607-nov-2026-paper-5-6", "0607 Paper 5／6（PM）", "0607 Paper 5/6 (PM)", "2026-10-14", ["cambridge-zone5-nov-2026-timetable"], "Core 参加 P5，Extended 参加 P6。", "Core takes P5 and Extended takes P6."),
  ],
  sections: [
    {
      id: "assessment-structure",
      title: t("考试结构", "Assessment structure"),
      tables: [
        {
          columns: [t("路径／试卷", "Route / paper"), t("时间", "Duration"), t("分值", "Marks"), t("权重", "Weight"), t("计算器", "Calculator"), t("内容", "Content")],
          rows: [
            row([["Core P1", "Core P1"], ["1小时15分", "1 hour 15 minutes"], ["60", "60"], ["40%", "40%"], ["不允许", "Not permitted"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0607-syllabus"]),
            row([["Core P3", "Core P3"], ["1小时15分", "1 hour 15 minutes"], ["60", "60"], ["40%", "40%"], ["须用图形显示计算器", "Graphic display calculator required"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0607-syllabus"]),
            row([["Core P5", "Core P5"], ["1小时15分", "1 hour 15 minutes"], ["40", "40"], ["20%", "20%"], ["须用图形显示计算器", "Graphic display calculator required"], ["一项数学探究", "One investigation"]], ["cie-0607-syllabus"]),
            row([["Extended P2", "Extended P2"], ["1小时30分", "1 hour 30 minutes"], ["75", "75"], ["40%", "40%"], ["不允许", "Not permitted"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0607-syllabus"]),
            row([["Extended P4", "Extended P4"], ["1小时30分", "1 hour 30 minutes"], ["75", "75"], ["40%", "40%"], ["须用图形显示计算器", "Graphic display calculator required"], ["结构化与非结构化题", "Structured and unstructured questions"]], ["cie-0607-syllabus"]),
            row([["Extended P6", "Extended P6"], ["1小时30分", "1 hour 30 minutes"], ["50", "50"], ["20%", "20%"], ["须用图形显示计算器", "Graphic display calculator required"], ["一项探究与一项建模", "One investigation section and one modelling section"]], ["cie-0607-syllabus"]),
          ],
        },
      ],
    },
    {
      id: "route-choice",
      title: t("Core 与 Extended", "Core and Extended"),
      bullets: [
        t("Core 参加 P1、P3、P5，成绩范围 C–G。", "Core candidates take P1, P3 and P5, with grades C–G."),
        t("Extended 参加 P2、P4、P6，成绩范围 A*–E。", "Extended candidates take P2, P4 and P6, with grades A*–E."),
        t("图形显示计算器用于 P3–P6；P1、P2 明确禁止计算器。", "A graphic display calculator is required for P3–P6; calculators are expressly prohibited in P1 and P2."),
      ],
    },
    chinaEntrySection("0607", "cie-0607-syllabus"),
    thresholdSection("cie-0607-syllabus", "cambridge-igcse-thresholds", "Core：C–G；Extended：A*–E。", "Core: C–G; Extended: A*–E.", "2025 年评估结构重新平衡，跨 2024／2025 比较时应标记版本变化。", "The assessment was rebalanced for 2025; comparisons across 2024 and 2025 should mark the specification change."),
  ],
  sourceIds: ["cie-0607-overview", "cie-0607-syllabus", "cie-0607-papers", "cie-0607-resources", "cambridge-igcse-thresholds", "cambridge-private-candidates", "cambridge-private-registration", "cambridge-zone5-entry-guide-2026", "cambridge-zone5-nov-2026-timetable"],
  relatedIds: ["cie-igcse-mathematics-0580", "cie-igcse-additional-mathematics-0606", "cie-as-a-level-mathematics-9709"],
  searchTerms: ["Cambridge", "IGCSE", "0607", "International Mathematics", "GDC", "investigation", "modelling", "国际数学"],
};

const project0606: ProjectRecord = {
  id: "cie-igcse-additional-mathematics-0606",
  slug: "cie-igcse-additional-mathematics-0606",
  track: "curriculum",
  title: t("Cambridge IGCSE Additional Mathematics（0606）", "Cambridge IGCSE Additional Mathematics (0606)"),
  shortTitle: "IGCSE Additional Mathematics 0606",
  organizer: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  summary: t(
    "面向数学基础较强学生的 IGCSE 附加数学课程，覆盖函数、三角、数列、向量与微积分，并衔接 AS & A Level Mathematics。",
    "An additional IGCSE mathematics course for stronger students, covering functions, trigonometry, series, vectors and calculus and supporting progression to AS & A Level Mathematics.",
  ),
  regions: ["global", "china"],
  gradeBands: ["middle-school", "high-school"],
  eligibilityTags: ["registered-school-entry", "private-candidates-allowed", "strong-igcse-mathematics-foundation"],
  formatTags: ["paper-based", "written-exam", "calculator-and-non-calculator"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2025-2027",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("官方名称", "Official name", "Cambridge IGCSE Additional Mathematics 0606", "Cambridge IGCSE Additional Mathematics 0606", ["cie-0606-syllabus"]),
    fact("现行考纲", "Current syllabus", "2025–2027，Version 1；文件版权日期为 2022 年 9 月", "2025–2027, Version 1; document copyright dated September 2022", ["cie-0606-syllabus"]),
    fact("先修基础", "Prior knowledge", "假定已掌握 Cambridge IGCSE Mathematics（0580）或同等课程内容", "Assumes knowledge of Cambridge IGCSE Mathematics (0580) or an equivalent syllabus", ["cie-0606-syllabus"]),
    fact("考试系列", "Exam series", "June、November；March 仅印度", "June and November; March in India only", ["cie-0606-syllabus"]),
    fact("成绩等级", "Grade range", "A*–E；低于 E 为 unclassified", "A*–E; performance below E is unclassified", ["cie-0606-syllabus"]),
    fact("社会考生", "Private candidates", "现行考纲允许；通过接收社会考生的中心报名", "Permitted; entry is made through an accepting centre", ["cie-0606-syllabus", "cambridge-private-registration"]),
    fact("后续考纲", "Next syllabus", "2028–2030 考纲已公布；2026 年考试仍使用 2025–2027 版", "The 2028–2030 syllabus is available; 2026 exams still use the 2025–2027 version", ["cie-0606-overview"]),
  ],
  dates: [
    date("cie-0606-nov-2026-paper-1", "0606 Paper 1（AM）", "0606 Paper 1 (AM)", "2026-09-30", ["cambridge-zone5-nov-2026-timetable"], "无计算器卷；确切开考时间由中心通知。", "Non-calculator paper; the centre confirms the exact start time."),
    date("cie-0606-nov-2026-paper-2", "0606 Paper 2（AM）", "0606 Paper 2 (AM)", "2026-10-06", ["cambridge-zone5-nov-2026-timetable"], "科学计算器卷；确切开考时间由中心通知。", "Scientific-calculator paper; the centre confirms the exact start time."),
  ],
  sections: [
    {
      id: "assessment-structure",
      title: t("考试结构", "Assessment structure"),
      tables: [
        {
          columns: [t("试卷", "Paper"), t("时间", "Duration"), t("分值", "Marks"), t("权重", "Weight"), t("计算器", "Calculator"), t("题型", "Question style")],
          rows: [
            row([["Paper 1", "Paper 1"], ["2小时", "2 hours"], ["80", "80"], ["50%", "50%"], ["不允许", "Not permitted"], ["结构化与非结构化题；全部必答", "Structured and unstructured questions; all compulsory"]], ["cie-0606-syllabus"]),
            row([["Paper 2", "Paper 2"], ["2小时", "2 hours"], ["80", "80"], ["50%", "50%"], ["须用科学计算器", "Scientific calculator required"], ["结构化与非结构化题；全部必答", "Structured and unstructured questions; all compulsory"]], ["cie-0606-syllabus"]),
          ],
        },
      ],
    },
    {
      id: "course-position",
      title: t("课程定位", "Course position"),
      bullets: [
        t("0606 不是 0580 的替代课程；官方假定学生已经具备 IGCSE Mathematics 的基础。", "0606 is not a replacement for 0580; the syllabus assumes an IGCSE Mathematics foundation."),
        t("课程引入对数与指数、圆的坐标几何、排列组合、数列、二维向量和微积分。", "The course introduces logarithmic and exponential functions, coordinate geometry of the circle, permutations and combinations, series, two-dimensional vectors and calculus."),
        t("2025 年起 Paper 1 为专门的无计算器卷。", "From 2025, Paper 1 is a dedicated non-calculator paper."),
      ],
    },
    chinaEntrySection("0606", "cie-0606-syllabus"),
    thresholdSection("cie-0606-syllabus", "cambridge-igcse-thresholds", "全课程成绩范围 A*–E。", "The qualification grade range is A*–E.", "2025 年 P1 改为无计算器卷，历史档案应在 2024／2025 之间标记结构断点。", "P1 became a non-calculator paper in 2025; historical tables should mark a structural break between 2024 and 2025."),
  ],
  sourceIds: ["cie-0606-overview", "cie-0606-syllabus", "cie-0606-papers", "cie-0606-resources", "cie-0606-factsheet", "cambridge-igcse-thresholds", "cambridge-private-candidates", "cambridge-private-registration", "cambridge-zone5-entry-guide-2026", "cambridge-zone5-nov-2026-timetable"],
  relatedIds: ["cie-igcse-mathematics-0580", "cie-as-a-level-mathematics-9709"],
  searchTerms: ["Cambridge", "IGCSE", "0606", "Additional Mathematics", "附加数学", "微积分"],
};

const project9709: ProjectRecord = {
  id: "cie-as-a-level-mathematics-9709",
  slug: "cie-as-a-level-mathematics-9709",
  track: "curriculum",
  title: t("Cambridge International AS & A Level Mathematics（9709）", "Cambridge International AS & A Level Mathematics (9709)"),
  shortTitle: "AS & A Level Mathematics 9709",
  organizer: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  summary: t(
    "由纯数学、力学和概率统计组件组成的 AS／A Level 数学课程。AS 有三种组合；A Level 有力学或进阶统计两条完整路线。",
    "An AS/A Level mathematics course built from pure mathematics, mechanics and probability-statistics components. AS has three combinations and A Level has mechanics or advanced-statistics routes.",
  ),
  regions: ["global", "china"],
  gradeBands: ["high-school"],
  eligibilityTags: ["registered-school-entry", "private-candidates-allowed", "component-route-required"],
  formatTags: ["paper-based", "written-exam", "scientific-calculator", "staged-or-linear"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2026-2027",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("官方名称", "Official name", "Cambridge International AS & A Level Mathematics 9709", "Cambridge International AS & A Level Mathematics 9709", ["cie-9709-syllabus"]),
    fact("现行考纲", "Current syllabus", "2026–2027，Version 4，2025 年 12 月发布", "2026–2027, Version 4, published December 2025", ["cie-9709-syllabus"]),
    fact("考试系列", "Exam series", "June、November；March 仅印度", "June and November; March in India only", ["cie-9709-syllabus"]),
    fact("成绩等级", "Grade range", "AS Level：a–e；A Level：A*–E", "AS Level: a–e; A Level: A*–E", ["cie-9709-syllabus"]),
    fact("计算器", "Calculator", "所有组件可使用标准科学计算器；禁止图形计算器及 CAS；提供 MF19", "A standard scientific calculator is used in all components; graphical calculators and CAS are prohibited; MF19 is supplied", ["cie-9709-syllabus"]),
    fact("社会考生", "Private candidates", "现行考纲允许；报名时必须选择有效的 component route／entry option", "Permitted; entry must use a valid component route and entry option", ["cie-9709-syllabus", "cambridge-private-registration"]),
    fact("后续考纲", "Next syllabus", "2028–2030 考纲已公布；2026、2027 年考试使用当前版", "The 2028–2030 syllabus is available; exams in 2026 and 2027 use the current version", ["cie-9709-overview"]),
  ],
  dates: [
    date("cie-9709-nov-2026-paper-1", "9709 Paper 1（AM）", "9709 Paper 1 (AM)", "2026-10-13", ["cambridge-zone5-nov-2026-timetable"], "Pure Mathematics 1；确切开考时间由中心通知。", "Pure Mathematics 1; the centre confirms the exact start time."),
    date("cie-9709-nov-2026-paper-5", "9709 Paper 5（AM）", "9709 Paper 5 (AM)", "2026-10-15", ["cambridge-zone5-nov-2026-timetable"], "Probability & Statistics 1。", "Probability & Statistics 1."),
    date("cie-9709-nov-2026-paper-2-4-6", "9709 Paper 2／4／6（AM）", "9709 Paper 2/4/6 (AM)", "2026-10-19", ["cambridge-zone5-nov-2026-timetable"], "同一日期分别安排 Pure Mathematics 2、Mechanics、Probability & Statistics 2；考生按路线参加相应组件。", "Pure Mathematics 2, Mechanics and Probability & Statistics 2 are scheduled on the same date; candidates take the components required by their route."),
    date("cie-9709-nov-2026-paper-3", "9709 Paper 3（AM）", "9709 Paper 3 (AM)", "2026-10-21", ["cambridge-zone5-nov-2026-timetable"], "Pure Mathematics 3。", "Pure Mathematics 3."),
  ],
  sections: [
    {
      id: "assessment-components",
      title: t("考试组件", "Assessment components"),
      tables: [
        {
          columns: [t("组件", "Component"), t("时间", "Duration"), t("分值", "Marks"), t("题量", "Questions"), t("适用层级与权重", "Level and weighting")],
          rows: [
            row([["P1 Pure Mathematics 1", "P1 Pure Mathematics 1"], ["1小时50分", "1 hour 50 minutes"], ["75", "75"], ["10–12 道结构化题", "10–12 structured questions"], ["AS 60%；A Level 30%；两者必考", "AS 60%; A Level 30%; compulsory for both"]], ["cie-9709-syllabus"]),
            row([["P2 Pure Mathematics 2", "P2 Pure Mathematics 2"], ["1小时15分", "1 hour 15 minutes"], ["50", "50"], ["6–8 道结构化题", "6–8 structured questions"], ["AS 40%；仅用于 AS", "AS 40%; AS only"]], ["cie-9709-syllabus"]),
            row([["P3 Pure Mathematics 3", "P3 Pure Mathematics 3"], ["1小时50分", "1 hour 50 minutes"], ["75", "75"], ["9–11 道结构化题", "9–11 structured questions"], ["A Level 30%；A Level 必考", "A Level 30%; compulsory for A Level"]], ["cie-9709-syllabus"]),
            row([["P4 Mechanics", "P4 Mechanics"], ["1小时15分", "1 hour 15 minutes"], ["50", "50"], ["6–8 道结构化题", "6–8 structured questions"], ["AS 40% 或 A Level 20%", "AS 40% or A Level 20%"]], ["cie-9709-syllabus"]),
            row([["P5 Probability & Statistics 1", "P5 Probability & Statistics 1"], ["1小时15分", "1 hour 15 minutes"], ["50", "50"], ["6–8 道结构化题", "6–8 structured questions"], ["AS 40%；A Level 20%；A Level 必考", "AS 40%; A Level 20%; compulsory for A Level"]], ["cie-9709-syllabus"]),
            row([["P6 Probability & Statistics 2", "P6 Probability & Statistics 2"], ["1小时15分", "1 hour 15 minutes"], ["50", "50"], ["6–8 道结构化题", "6–8 structured questions"], ["A Level 20%；仅用于 A Level", "A Level 20%; A Level only"]], ["cie-9709-syllabus"]),
          ],
        },
      ],
    },
    {
      id: "component-routes",
      title: t("有效组合", "Valid routes"),
      tables: [
        {
          columns: [t("层级／路线", "Level / route"), t("组件", "Components"), t("说明", "Note")],
          rows: [
            row([["AS：纯数 + 统计", "AS: pure + statistics"], ["P1 + P5", "P1 + P5"], ["可按规则 carry forward 至 A Level", "May be carried forward to A Level under the regulations"]], ["cie-9709-syllabus"]),
            row([["AS：纯数 + 力学", "AS: pure + mechanics"], ["P1 + P4", "P1 + P4"], ["可按规则 carry forward 至 A Level", "May be carried forward to A Level under the regulations"]], ["cie-9709-syllabus"]),
            row([["AS：纯数学", "AS: pure mathematics"], ["P1 + P2", "P1 + P2"], ["官方明确该组合不能计入后续 A Level", "This combination cannot contribute to a later A Level"]], ["cie-9709-syllabus"]),
            row([["A Level：力学路线", "A Level: mechanics route"], ["P1 + P3 + P4 + P5", "P1 + P3 + P4 + P5"], ["可分阶段或同一考季完成", "May be staged or completed in one series"]], ["cie-9709-syllabus"]),
            row([["A Level：统计路线", "A Level: statistics route"], ["P1 + P3 + P5 + P6", "P1 + P3 + P5 + P6"], ["可分阶段或同一考季完成", "May be staged or completed in one series"]], ["cie-9709-syllabus"]),
          ],
        },
      ],
    },
    chinaEntrySection("9709", "cie-9709-syllabus"),
    thresholdSection("cie-9709-syllabus", "cambridge-alevel-thresholds", "AS Level：a–e；A Level：A*–E。", "AS Level: a–e; A Level: A*–E."),
  ],
  sourceIds: ["cie-9709-overview", "cie-9709-syllabus", "cie-9709-papers", "cie-9709-resources", "cie-9709-support", "cambridge-alevel-thresholds", "cambridge-private-candidates", "cambridge-private-registration", "cambridge-zone5-entry-guide-2026", "cambridge-zone5-nov-2026-timetable"],
  relatedIds: ["cie-igcse-additional-mathematics-0606", "cie-as-a-level-further-mathematics-9231"],
  searchTerms: ["Cambridge", "A Level", "AS Level", "9709", "Pure Mathematics", "Mechanics", "Statistics", "剑桥Alevel数学"],
};

const project9231: ProjectRecord = {
  id: "cie-as-a-level-further-mathematics-9231",
  slug: "cie-as-a-level-further-mathematics-9231",
  track: "curriculum",
  title: t("Cambridge International AS & A Level Further Mathematics（9231）", "Cambridge International AS & A Level Further Mathematics (9231)"),
  shortTitle: "AS & A Level Further Mathematics 9231",
  organizer: t(CAMBRIDGE_ZH, CAMBRIDGE_EN),
  summary: t(
    "以完整 9709 A Level Mathematics 为先修基础的进阶数学课程。AS 在高等力学与高等概率统计中二选一；完整 A Level 参加四张卷。",
    "An advanced mathematics course assuming the full 9709 A Level Mathematics content. AS chooses between Further Mechanics and Further Probability & Statistics; the full A Level takes all four papers.",
  ),
  regions: ["global", "china"],
  gradeBands: ["high-school"],
  eligibilityTags: ["registered-school-entry", "private-candidates-allowed", "full-a-level-mathematics-prior-knowledge"],
  formatTags: ["paper-based", "written-exam", "scientific-calculator", "staged-or-linear"],
  costBand: "varies",
  status: "confirmed",
  cycle: "2026-2027",
  lastVerified: VERIFIED_AT,
  facts: [
    fact("官方名称", "Official name", "Cambridge International AS & A Level Further Mathematics 9231", "Cambridge International AS & A Level Further Mathematics 9231", ["cie-9231-syllabus"]),
    fact("现行考纲", "Current syllabus", "2026–2027，Version 3；官方 PDF 对发布日期月份存在 2025 年 7 月／8 月两种写法", "2026–2027, Version 3; the official PDF gives July and August 2025 in different places", ["cie-9231-syllabus"], "conflict"),
    fact("先修基础", "Prior knowledge", "假定掌握 9709 A Level Mathematics 全部内容；AS Mathematics 与 AS Further Mathematics 同年并行须谨慎排课", "Assumes the complete 9709 A Level Mathematics content; parallel one-year AS Mathematics and AS Further Mathematics requires careful sequencing", ["cie-9231-syllabus"]),
    fact("考试系列", "Exam series", "June、November；没有 March 系列", "June and November; no March series", ["cie-9231-syllabus"]),
    fact("成绩等级", "Grade range", "AS Level：a–e；A Level：A*–E", "AS Level: a–e; A Level: A*–E", ["cie-9231-syllabus"]),
    fact("计算器", "Calculator", "所有组件可使用标准科学计算器；禁止图形计算器及 CAS；提供 MF19", "A standard scientific calculator is used in all components; graphical calculators and CAS are prohibited; MF19 is supplied", ["cie-9231-syllabus"]),
    fact("社会考生", "Private candidates", "现行考纲允许；报名时必须选择有效的组件组合", "Permitted; entry must use a valid component combination", ["cie-9231-syllabus", "cambridge-private-registration"]),
    fact("后续考纲", "Next syllabus", "2028–2030 考纲已公布；2026、2027 年考试使用当前版", "The 2028–2030 syllabus is available; exams in 2026 and 2027 use the current version", ["cie-9231-overview"]),
  ],
  dates: [
    date("cie-9231-nov-2026-paper-1", "9231 Paper 1（PM）", "9231 Paper 1 (PM)", "2026-10-07", ["cambridge-zone5-nov-2026-timetable"], "Further Pure Mathematics 1。", "Further Pure Mathematics 1."),
    date("cie-9231-nov-2026-paper-3", "9231 Paper 3（PM）", "9231 Paper 3 (PM)", "2026-10-09", ["cambridge-zone5-nov-2026-timetable"], "Further Mechanics。", "Further Mechanics."),
    date("cie-9231-nov-2026-paper-2", "9231 Paper 2（PM）", "9231 Paper 2 (PM)", "2026-10-23", ["cambridge-zone5-nov-2026-timetable"], "Further Pure Mathematics 2。", "Further Pure Mathematics 2."),
    date("cie-9231-nov-2026-paper-4", "9231 Paper 4（PM）", "9231 Paper 4 (PM)", "2026-10-30", ["cambridge-zone5-nov-2026-timetable"], "Further Probability & Statistics。", "Further Probability & Statistics."),
  ],
  sections: [
    {
      id: "assessment-components",
      title: t("考试组件", "Assessment components"),
      tables: [
        {
          columns: [t("组件", "Component"), t("时间", "Duration"), t("分值", "Marks"), t("题量", "Questions"), t("适用层级与权重", "Level and weighting")],
          rows: [
            row([["P1 Further Pure Mathematics 1", "P1 Further Pure Mathematics 1"], ["2小时", "2 hours"], ["75", "75"], ["6–8 道结构化题", "6–8 structured questions"], ["AS 60%；A Level 30%；两者必考", "AS 60%; A Level 30%; compulsory for both"]], ["cie-9231-syllabus"]),
            row([["P2 Further Pure Mathematics 2", "P2 Further Pure Mathematics 2"], ["2小时", "2 hours"], ["75", "75"], ["7–9 道结构化题", "7–9 structured questions"], ["A Level 30%；A Level 必考", "A Level 30%; compulsory for A Level"]], ["cie-9231-syllabus"]),
            row([["P3 Further Mechanics", "P3 Further Mechanics"], ["1小时30分", "1 hour 30 minutes"], ["50", "50"], ["5–7 道结构化题", "5–7 structured questions"], ["AS 40% 或 A Level 20%", "AS 40% or A Level 20%"]], ["cie-9231-syllabus"]),
            row([["P4 Further Probability & Statistics", "P4 Further Probability & Statistics"], ["1小时30分", "1 hour 30 minutes"], ["50", "50"], ["5–7 道结构化题", "5–7 structured questions"], ["AS 40% 或 A Level 20%", "AS 40% or A Level 20%"]], ["cie-9231-syllabus"]),
          ],
        },
      ],
    },
    {
      id: "component-routes",
      title: t("有效组合与先修关系", "Valid routes and prior knowledge"),
      tables: [
        {
          columns: [t("层级／路线", "Level / route"), t("组件", "Components"), t("说明", "Note")],
          rows: [
            row([["AS：高等力学", "AS: Further Mechanics"], ["P1 + P3", "P1 + P3"], ["P1 60%，P3 40%", "P1 60%, P3 40%"]], ["cie-9231-syllabus"]),
            row([["AS：高等概率统计", "AS: Further Probability & Statistics"], ["P1 + P4", "P1 + P4"], ["P1 60%，P4 40%", "P1 60%, P4 40%"]], ["cie-9231-syllabus"]),
            row([["完整 A Level", "Full A Level"], ["P1 + P2 + P3 + P4", "P1 + P2 + P3 + P4"], ["P1、P2 各30%；P3、P4 各20%；可 staged 或同季完成", "P1 and P2 are 30% each; P3 and P4 are 20% each; staged or linear entry"]], ["cie-9231-syllabus"]),
            row([["先修要求", "Prior knowledge"], ["9709 A Level Mathematics 全部内容", "Complete 9709 A Level Mathematics content"], ["部分 9231 内容依赖 9709 P3；一年并行安排不能只按 AS 组件先后理解", "Some 9231 content depends on 9709 P3; a one-year parallel plan cannot be based only on AS component order"]], ["cie-9231-syllabus"]),
          ],
        },
      ],
    },
    chinaEntrySection("9231", "cie-9231-syllabus"),
    thresholdSection("cie-9231-syllabus", "cambridge-alevel-thresholds", "AS Level：a–e；A Level：A*–E。", "AS Level: a–e; A Level: A*–E."),
  ],
  sourceIds: ["cie-9231-overview", "cie-9231-syllabus", "cie-9231-papers", "cie-9231-resources", "cambridge-alevel-thresholds", "cambridge-private-candidates", "cambridge-private-registration", "cambridge-zone5-entry-guide-2026", "cambridge-zone5-nov-2026-timetable"],
  relatedIds: ["cie-as-a-level-mathematics-9709"],
  searchTerms: ["Cambridge", "A Level", "Further Mathematics", "9231", "Further Pure", "Further Mechanics", "Further Statistics", "进阶数学"],
};

export const cambridgeCourseProjects: ProjectRecord[] = [
  project0580,
  project0607,
  project0606,
  project9709,
  project9231,
];

export const cambridgeCourseThresholds: ThresholdRecord[] = [
  {
    id: "cie-0580-current-core-grade-range",
    projectId: "cie-igcse-mathematics-0580",
    year: "2025-2027 syllabus",
    sitting: "Core",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "C–G",
    status: "confirmed",
    sourceIds: ["cie-0580-syllabus", "cambridge-igcse-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；每个考季和 option 的分数线见官方档案。", "This is a grade range, not a raw-mark cutoff; consult the official archive for each series and option."),
  },
  {
    id: "cie-0580-current-extended-grade-range",
    projectId: "cie-igcse-mathematics-0580",
    year: "2025-2027 syllabus",
    sitting: "Extended",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "A*–E",
    status: "confirmed",
    sourceIds: ["cie-0580-syllabus", "cambridge-igcse-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；每个考季和 option 的分数线见官方档案。", "This is a grade range, not a raw-mark cutoff; consult the official archive for each series and option."),
  },
  {
    id: "cie-0607-current-core-grade-range",
    projectId: "cie-igcse-international-mathematics-0607",
    year: "2025-2027 syllabus",
    sitting: "Core",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "C–G",
    status: "confirmed",
    sourceIds: ["cie-0607-syllabus", "cambridge-igcse-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；每个考季和 option 的分数线见官方档案。", "This is a grade range, not a raw-mark cutoff; consult the official archive for each series and option."),
  },
  {
    id: "cie-0607-current-extended-grade-range",
    projectId: "cie-igcse-international-mathematics-0607",
    year: "2025-2027 syllabus",
    sitting: "Extended",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "A*–E",
    status: "confirmed",
    sourceIds: ["cie-0607-syllabus", "cambridge-igcse-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；每个考季和 option 的分数线见官方档案。", "This is a grade range, not a raw-mark cutoff; consult the official archive for each series and option."),
  },
  {
    id: "cie-0606-current-grade-range",
    projectId: "cie-igcse-additional-mathematics-0606",
    year: "2025-2027 syllabus",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "A*–E",
    status: "confirmed",
    sourceIds: ["cie-0606-syllabus", "cambridge-igcse-thresholds"],
    note: t("低于 E 为 unclassified；每个考季的原始分线见官方档案。", "Performance below E is unclassified; raw-mark thresholds are published by series in the official archive."),
  },
  {
    id: "cie-9709-current-as-grade-range",
    projectId: "cie-as-a-level-mathematics-9709",
    year: "2026-2027 syllabus",
    sitting: "AS Level",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "a–e",
    status: "confirmed",
    sourceIds: ["cie-9709-syllabus", "cambridge-alevel-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；不同路线使用不同 component combination。", "This is a grade range, not a raw-mark cutoff; different routes use different component combinations."),
  },
  {
    id: "cie-9709-current-a-level-grade-range",
    projectId: "cie-as-a-level-mathematics-9709",
    year: "2026-2027 syllabus",
    sitting: "A Level",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "A*–E",
    status: "confirmed",
    sourceIds: ["cie-9709-syllabus", "cambridge-alevel-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；不同路线使用不同 component combination。", "This is a grade range, not a raw-mark cutoff; different routes use different component combinations."),
  },
  {
    id: "cie-9231-current-as-grade-range",
    projectId: "cie-as-a-level-further-mathematics-9231",
    year: "2026-2027 syllabus",
    sitting: "AS Level",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "a–e",
    status: "confirmed",
    sourceIds: ["cie-9231-syllabus", "cambridge-alevel-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；AS 的应用组件可选 P3 或 P4。", "This is a grade range, not a raw-mark cutoff; AS uses either P3 or P4 as the applied component."),
  },
  {
    id: "cie-9231-current-a-level-grade-range",
    projectId: "cie-as-a-level-further-mathematics-9231",
    year: "2026-2027 syllabus",
    sitting: "A Level",
    metric: t("官方可用成绩等级", "Official available grade range"),
    value: "A*–E",
    status: "confirmed",
    sourceIds: ["cie-9231-syllabus", "cambridge-alevel-thresholds"],
    note: t("这是成绩等级范围，不是原始分线；完整 A Level 使用四个组件。", "This is a grade range, not a raw-mark cutoff; the full A Level uses all four components."),
  },
];

const syllabusTranslationNote = t(
  "中文内容为便于中国学生检索和理解而作的结构化翻译，不替代 Cambridge 官方英文考纲。课程规划、报名和考试准备应以对应考试年份的官方英文 PDF、后续 syllabus update 及考点通知为准。",
  "The Chinese content is a structured translation for reference by students in China and does not replace the official Cambridge English syllabus. Course planning, entry and preparation must follow the official English PDF for the examination year, subsequent syllabus updates and centre instructions.",
);

const syllabus0580: AssessmentSyllabusRecord = {
  id: "syllabus-cie-0580-2025-2027",
  slug: "cie-0580-2025-2027",
  projectId: "cie-igcse-mathematics-0580",
  classification: "formal-specification",
  title: t("0580 2025–2027 官方考纲中文索引", "0580 Official Syllabus Index, 2025–2027"),
  officialName: t("Cambridge IGCSE Mathematics 0580", "Cambridge IGCSE Mathematics 0580"),
  applicableCycle: t("2025、2026、2027 年考试；Version 3", "Examinations in 2025, 2026 and 2027; Version 3"),
  effectiveFrom: "2025-01-01",
  status: "confirmed",
  summary: t("课程分 Core 与 Extended 两层，内容覆盖数、代数、几何、三角、概率和统计。Extended 包含 Core 及附加内容。", "The syllabus is tiered into Core and Extended and covers number, algebra, geometry, trigonometry, probability and statistics. Extended includes Core plus additional content."),
  facts: [
    fact("版本", "Version", "Version 3，2024 年 5 月发布", "Version 3, published May 2024", ["cie-0580-syllabus"]),
    fact("有效期", "Validity", "2025–2027 年考试", "Examinations in 2025–2027", ["cie-0580-syllabus"]),
    fact("分层", "Tiering", "Core：P1+P3；Extended：P2+P4", "Core: P1+P3; Extended: P2+P4", ["cie-0580-syllabus"]),
    fact("公式", "Formulae", "各卷第 2 页提供相应 Core 或 Extended 公式表", "Each paper provides the relevant Core or Extended formula list on page 2", ["cie-0580-syllabus"]),
  ],
  sections: [
    {
      id: "content-domains",
      title: t("内容领域", "Content domains"),
      intro: t("下列为官方一级主题翻译；详细学习成果及例题边界以原 PDF 为准。", "These are translations of the official top-level topics; consult the PDF for detailed learning outcomes and examples."),
      tables: [
        {
          columns: [t("编号", "No."), t("官方主题", "Official topic"), t("中文", "Chinese")],
          rows: [
            row([["1", "1"], ["Number", "Number"], ["数", "数"]]),
            row([["2", "2"], ["Algebra and graphs", "Algebra and graphs"], ["代数与图像", "代数与图像"]]),
            row([["3", "3"], ["Coordinate geometry", "Coordinate geometry"], ["坐标几何", "坐标几何"]]),
            row([["4", "4"], ["Geometry", "Geometry"], ["几何", "几何"]]),
            row([["5", "5"], ["Mensuration", "Mensuration"], ["度量", "度量"]]),
            row([["6", "6"], ["Trigonometry", "Trigonometry"], ["三角学", "三角学"]]),
            row([["7", "7"], ["Transformations and vectors", "Transformations and vectors"], ["变换与向量", "变换与向量"]]),
            row([["8", "8"], ["Probability", "Probability"], ["概率", "概率"]]),
            row([["9", "9"], ["Statistics", "Statistics"], ["统计", "统计"]]),
          ],
          note: t("Extended 内容含全部 Core 内容及考纲中以 E 标注的扩展学习成果。", "Extended contains all Core material plus the additional outcomes marked E in the syllabus."),
        },
      ],
    },
    project0580.sections[0],
    project0580.sections[1],
  ],
  sources: [
    syllabusSource("0580 2025–2027 官方考纲", "0580 official syllabus, 2025–2027", "https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf", "pdf", "Version 3，2024 年 5 月", "Version 3, May 2024"),
    syllabusSource("0580 课程主页", "0580 qualification page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/", "webpage", undefined, undefined, "页面同时列出 syllabus update 与 2028–2030 考纲。", "The page also lists syllabus updates and the 2028–2030 syllabus."),
  ],
  translationNote: syllabusTranslationNote,
  lastVerified: VERIFIED_AT,
};

const syllabus0607: AssessmentSyllabusRecord = {
  id: "syllabus-cie-0607-2025-2027",
  slug: "cie-0607-2025-2027",
  projectId: "cie-igcse-international-mathematics-0607",
  classification: "formal-specification",
  title: t("0607 2025–2027 官方考纲中文索引", "0607 Official Syllabus Index, 2025–2027"),
  officialName: t("Cambridge IGCSE International Mathematics 0607", "Cambridge IGCSE International Mathematics 0607"),
  applicableCycle: t("2025、2026、2027 年考试；Version 3", "Examinations in 2025, 2026 and 2027; Version 3"),
  effectiveFrom: "2025-01-01",
  status: "confirmed",
  summary: t("课程将函数单列为一级主题，并要求在图形显示计算器环境中完成部分计算、探究和建模任务。", "The syllabus treats functions as a top-level domain and requires some calculations, investigation and modelling in a graphic-display-calculator environment."),
  facts: [
    fact("版本", "Version", "Version 3，2023 年 10 月发布", "Version 3, published October 2023", ["cie-0607-syllabus"]),
    fact("有效期", "Validity", "2025–2027 年考试", "Examinations in 2025–2027", ["cie-0607-syllabus"]),
    fact("分层", "Tiering", "Core：P1+P3+P5；Extended：P2+P4+P6", "Core: P1+P3+P5; Extended: P2+P4+P6", ["cie-0607-syllabus"]),
    fact("技术工具", "Technology", "P3–P6 要求图形显示计算器；P1、P2 禁止计算器", "A graphic display calculator is required for P3–P6; calculators are prohibited in P1 and P2", ["cie-0607-syllabus"]),
  ],
  sections: [
    {
      id: "content-domains",
      title: t("内容领域", "Content domains"),
      tables: [
        {
          columns: [t("编号", "No."), t("官方主题", "Official topic"), t("中文", "Chinese")],
          rows: [
            row([["1", "1"], ["Number", "Number"], ["数", "数"]]),
            row([["2", "2"], ["Algebra", "Algebra"], ["代数", "代数"]]),
            row([["3", "3"], ["Functions", "Functions"], ["函数", "函数"]]),
            row([["4", "4"], ["Coordinate geometry", "Coordinate geometry"], ["坐标几何", "坐标几何"]]),
            row([["5", "5"], ["Geometry", "Geometry"], ["几何", "几何"]]),
            row([["6", "6"], ["Mensuration", "Mensuration"], ["度量", "度量"]]),
            row([["7", "7"], ["Trigonometry", "Trigonometry"], ["三角学", "三角学"]]),
            row([["8", "8"], ["Transformations and vectors", "Transformations and vectors"], ["变换与向量", "变换与向量"]]),
            row([["9", "9"], ["Probability", "Probability"], ["概率", "概率"]]),
            row([["10", "10"], ["Statistics", "Statistics"], ["统计", "统计"]]),
          ],
          note: t("Extended 含全部 Core 内容及附加内容；主题顺序不代表教学顺序。", "Extended contains Core plus additional content; topic order is not a prescribed teaching sequence."),
        },
      ],
    },
    project0607.sections[0],
    project0607.sections[1],
  ],
  sources: [
    syllabusSource("0607 2025–2027 官方考纲", "0607 official syllabus, 2025–2027", "https://www.cambridgeinternational.org/Images/662472-2025-2027-syllabus.pdf", "pdf", "Version 3，2023 年 10 月", "Version 3, October 2023"),
    syllabusSource("0607 课程主页", "0607 qualification page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/", "webpage", undefined, undefined, "页面同时列出 syllabus update 与 2028–2030 考纲。", "The page also lists syllabus updates and the 2028–2030 syllabus."),
  ],
  translationNote: syllabusTranslationNote,
  lastVerified: VERIFIED_AT,
};

const syllabus0606: AssessmentSyllabusRecord = {
  id: "syllabus-cie-0606-2025-2027",
  slug: "cie-0606-2025-2027",
  projectId: "cie-igcse-additional-mathematics-0606",
  classification: "formal-specification",
  title: t("0606 2025–2027 官方考纲中文索引", "0606 Official Syllabus Index, 2025–2027"),
  officialName: t("Cambridge IGCSE Additional Mathematics 0606", "Cambridge IGCSE Additional Mathematics 0606"),
  applicableCycle: t("2025、2026、2027 年考试；Version 1", "Examinations in 2025, 2026 and 2027; Version 1"),
  effectiveFrom: "2025-01-01",
  status: "confirmed",
  summary: t("考纲以 IGCSE Mathematics 为先修，进一步覆盖高阶代数、圆的坐标几何、排列组合、数列、向量和微积分。", "The syllabus assumes IGCSE Mathematics and extends into advanced algebra, coordinate geometry of the circle, permutations and combinations, series, vectors and calculus."),
  facts: [
    fact("版本", "Version", "Version 1；文件版权日期为 2022 年 9 月", "Version 1; document copyright dated September 2022", ["cie-0606-syllabus"]),
    fact("有效期", "Validity", "2025–2027 年考试", "Examinations in 2025–2027", ["cie-0606-syllabus"]),
    fact("先修", "Prior knowledge", "假定掌握 0580 或同等 IGCSE Mathematics 内容", "Assumes 0580 or equivalent IGCSE Mathematics content", ["cie-0606-syllabus"]),
    fact("组件", "Components", "P1 无计算器 + P2 科学计算器；各占50%", "P1 non-calculator plus P2 scientific-calculator; 50% each", ["cie-0606-syllabus"]),
  ],
  sections: [
    {
      id: "content-domains",
      title: t("内容领域", "Content domains"),
      tables: [
        {
          columns: [t("编号", "No."), t("官方主题", "Official topic"), t("中文", "Chinese")],
          rows: [
            row([["1", "1"], ["Functions", "Functions"], ["函数", "函数"]]),
            row([["2", "2"], ["Quadratic functions", "Quadratic functions"], ["二次函数", "二次函数"]]),
            row([["3", "3"], ["Factors of polynomials", "Factors of polynomials"], ["多项式因式", "多项式因式"]]),
            row([["4", "4"], ["Equations, inequalities and graphs", "Equations, inequalities and graphs"], ["方程、不等式与图像", "方程、不等式与图像"]]),
            row([["5", "5"], ["Simultaneous equations", "Simultaneous equations"], ["联立方程", "联立方程"]]),
            row([["6", "6"], ["Logarithmic and exponential functions", "Logarithmic and exponential functions"], ["对数与指数函数", "对数与指数函数"]]),
            row([["7", "7"], ["Straight-line graphs", "Straight-line graphs"], ["直线图像", "直线图像"]]),
            row([["8", "8"], ["Coordinate geometry of the circle", "Coordinate geometry of the circle"], ["圆的坐标几何", "圆的坐标几何"]]),
            row([["9", "9"], ["Circular measure", "Circular measure"], ["弧度制", "弧度制"]]),
            row([["10", "10"], ["Trigonometry", "Trigonometry"], ["三角学", "三角学"]]),
            row([["11", "11"], ["Permutations and combinations", "Permutations and combinations"], ["排列与组合", "排列与组合"]]),
            row([["12", "12"], ["Series", "Series"], ["数列与级数", "数列与级数"]]),
            row([["13", "13"], ["Vectors in two dimensions", "Vectors in two dimensions"], ["二维向量", "二维向量"]]),
            row([["14", "14"], ["Calculus", "Calculus"], ["微积分", "微积分"]]),
          ],
        },
      ],
    },
    project0606.sections[0],
    project0606.sections[1],
  ],
  sources: [
    syllabusSource("0606 2025–2027 官方考纲", "0606 official syllabus, 2025–2027", "https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf", "pdf", "Version 1", "Version 1"),
    syllabusSource("0606 课程主页", "0606 qualification page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/", "webpage", undefined, undefined, "页面同时列出 syllabus update、Notation List 与 2028–2030 考纲。", "The page also lists the syllabus update, Notation List and 2028–2030 syllabus."),
  ],
  translationNote: syllabusTranslationNote,
  lastVerified: VERIFIED_AT,
};

const syllabus9709: AssessmentSyllabusRecord = {
  id: "syllabus-cie-9709-2026-2027",
  slug: "cie-9709-2026-2027",
  projectId: "cie-as-a-level-mathematics-9709",
  classification: "formal-specification",
  title: t("9709 2026–2027 官方考纲中文索引", "9709 Official Syllabus Index, 2026–2027"),
  officialName: t("Cambridge International AS & A Level Mathematics 9709", "Cambridge International AS & A Level Mathematics 9709"),
  applicableCycle: t("2026、2027 年考试；Version 4", "Examinations in 2026 and 2027; Version 4"),
  effectiveFrom: "2026-01-01",
  status: "confirmed",
  summary: t("六个组件覆盖 Pure Mathematics 1–3、Mechanics、Probability & Statistics 1–2，并按官方规定组合为 AS 或 A Level。", "Six components cover Pure Mathematics 1–3, Mechanics and Probability & Statistics 1–2 and combine into AS or A Level under prescribed routes."),
  facts: [
    fact("版本", "Version", "Version 4，2025 年 12 月发布", "Version 4, published December 2025", ["cie-9709-syllabus"]),
    fact("有效期", "Validity", "2026–2027 年考试", "Examinations in 2026–2027", ["cie-9709-syllabus"]),
    fact("AS 路线", "AS routes", "P1+P5、P1+P4 或 P1+P2", "P1+P5, P1+P4 or P1+P2", ["cie-9709-syllabus"]),
    fact("A Level 路线", "A Level routes", "P1+P3+P4+P5 或 P1+P3+P5+P6", "P1+P3+P4+P5 or P1+P3+P5+P6", ["cie-9709-syllabus"]),
  ],
  sections: [
    {
      id: "content-components",
      title: t("组件与内容", "Components and content"),
      tables: [
        {
          columns: [t("组件", "Component"), t("官方内容中文索引", "Translated official content index")],
          rows: [
            row([["P1 Pure Mathematics 1", "P1 Pure Mathematics 1"], ["二次式；函数；坐标几何；弧度制；三角；数列；微分；积分", "Quadratics; functions; coordinate geometry; circular measure; trigonometry; series; differentiation; integration"]], ["cie-9709-syllabus"]),
            row([["P2 Pure Mathematics 2", "P2 Pure Mathematics 2"], ["代数；对数与指数函数；三角；微分；积分；方程数值解", "Algebra; logarithmic and exponential functions; trigonometry; differentiation; integration; numerical solution of equations"]], ["cie-9709-syllabus"]),
            row([["P3 Pure Mathematics 3", "P3 Pure Mathematics 3"], ["代数；对数与指数；三角；微分；积分；数值解；向量；微分方程；复数", "Algebra; logarithmic and exponential functions; trigonometry; differentiation; integration; numerical solutions; vectors; differential equations; complex numbers"]], ["cie-9709-syllabus"]),
            row([["P4 Mechanics", "P4 Mechanics"], ["力与平衡；直线运动学；动量；牛顿运动定律；能量、功与功率", "Forces and equilibrium; straight-line kinematics; momentum; Newton's laws; energy, work and power"]], ["cie-9709-syllabus"]),
            row([["P5 Probability & Statistics 1", "P5 Probability & Statistics 1"], ["数据表示；排列组合；概率；离散随机变量；正态分布", "Representation of data; permutations and combinations; probability; discrete random variables; normal distribution"]], ["cie-9709-syllabus"]),
            row([["P6 Probability & Statistics 2", "P6 Probability & Statistics 2"], ["泊松分布；随机变量线性组合；连续随机变量；抽样与估计；假设检验", "Poisson distribution; linear combinations of random variables; continuous random variables; sampling and estimation; hypothesis tests"]], ["cie-9709-syllabus"]),
          ],
        },
      ],
    },
    project9709.sections[0],
    project9709.sections[1],
  ],
  sources: [
    syllabusSource("9709 2026–2027 官方考纲", "9709 official syllabus, 2026–2027", "https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf", "pdf", "Version 4，2025 年 12 月", "Version 4, December 2025"),
    syllabusSource("9709 课程主页", "9709 qualification page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/", "webpage", undefined, undefined, "页面同时列出 syllabus update、Prior Learning Guidance、Notation List 与 2028–2030 考纲。", "The page also lists syllabus updates, Prior Learning Guidance, the Notation List and the 2028–2030 syllabus."),
  ],
  translationNote: syllabusTranslationNote,
  lastVerified: VERIFIED_AT,
};

const syllabus9231: AssessmentSyllabusRecord = {
  id: "syllabus-cie-9231-2026-2027",
  slug: "cie-9231-2026-2027",
  projectId: "cie-as-a-level-further-mathematics-9231",
  classification: "formal-specification",
  title: t("9231 2026–2027 官方考纲中文索引", "9231 Official Syllabus Index, 2026–2027"),
  officialName: t("Cambridge International AS & A Level Further Mathematics 9231", "Cambridge International AS & A Level Further Mathematics 9231"),
  applicableCycle: t("2026、2027 年考试；Version 3", "Examinations in 2026 and 2027; Version 3"),
  effectiveFrom: "2026-01-01",
  status: "confirmed",
  summary: t("四个组件覆盖 Further Pure Mathematics 1–2、Further Mechanics 和 Further Probability & Statistics；完整 9709 A Level Mathematics 内容为假定先修。", "Four components cover Further Pure Mathematics 1–2, Further Mechanics and Further Probability & Statistics; complete 9709 A Level Mathematics is assumed prior knowledge."),
  facts: [
    fact("版本", "Version", "Version 3；官方 PDF 内发布日期写为 2025 年 7 月及 8 月", "Version 3; the official PDF gives both July and August 2025 as publication dates", ["cie-9231-syllabus"], "conflict"),
    fact("有效期", "Validity", "2026–2027 年考试", "Examinations in 2026–2027", ["cie-9231-syllabus"]),
    fact("AS 路线", "AS routes", "P1+P3 或 P1+P4", "P1+P3 or P1+P4", ["cie-9231-syllabus"]),
    fact("A Level 路线", "A Level route", "P1+P2+P3+P4", "P1+P2+P3+P4", ["cie-9231-syllabus"]),
  ],
  sections: [
    {
      id: "content-components",
      title: t("组件与内容", "Components and content"),
      tables: [
        {
          columns: [t("组件", "Component"), t("官方内容中文索引", "Translated official content index")],
          rows: [
            row([["P1 Further Pure Mathematics 1", "P1 Further Pure Mathematics 1"], ["多项式方程的根；有理函数与图像；级数求和；矩阵；极坐标；向量；数学归纳法证明", "Roots of polynomial equations; rational functions and graphs; summation of series; matrices; polar coordinates; vectors; proof by induction"]], ["cie-9231-syllabus"]),
            row([["P2 Further Pure Mathematics 2", "P2 Further Pure Mathematics 2"], ["双曲函数；矩阵；微分；积分；复数；微分方程", "Hyperbolic functions; matrices; differentiation; integration; complex numbers; differential equations"]], ["cie-9231-syllabus"]),
            row([["P3 Further Mechanics", "P3 Further Mechanics"], ["抛体运动；刚体平衡；圆周运动；胡克定律；变力下的直线运动；动量", "Projectile motion; equilibrium of a rigid body; circular motion; Hooke's law; linear motion under a variable force; momentum"]], ["cie-9231-syllabus"]),
            row([["P4 Further Probability & Statistics", "P4 Further Probability & Statistics"], ["连续随机变量；正态与 t 分布推断；卡方检验；非参数检验；概率母函数", "Continuous random variables; inference using normal and t-distributions; chi-squared tests; non-parametric tests; probability generating functions"]], ["cie-9231-syllabus"]),
          ],
        },
      ],
    },
    project9231.sections[0],
    project9231.sections[1],
  ],
  sources: [
    syllabusSource("9231 2026–2027 官方考纲", "9231 official syllabus, 2026–2027", "https://www.cambridgeinternational.org/Images/697357-2026-2027-syllabus.pdf", "pdf", "Version 3", "Version 3", "前部与末尾对发布日期月份的记载不一致。", "The front matter and change log differ on the publication month."),
    syllabusSource("9231 课程主页", "9231 qualification page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/", "webpage", undefined, undefined, "页面同时列出 syllabus update、Prior Learning Guidance、Notation List 与 2028–2030 考纲。", "The page also lists syllabus updates, Prior Learning Guidance, the Notation List and the 2028–2030 syllabus."),
  ],
  translationNote: syllabusTranslationNote,
  lastVerified: VERIFIED_AT,
};

export const cambridgeCourseSyllabi: AssessmentSyllabusRecord[] = [
  syllabus0580,
  syllabus0607,
  syllabus0606,
  syllabus9709,
  syllabus9231,
];

export const cambridgeCourseLearningResources: LearningResourceRecord[] = [
  learningResource("cie-0580-official-syllabus", project0580.id, "0580 官方考纲", "0580 Official Syllabus", "https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf", "official-guide", "free", "2025–2027 年课程内容、评估结构、公式表和考试规则。", "Content, assessment structure, formula lists and regulations for examinations in 2025–2027."),
  learningResource("cie-0580-official-papers", project0580.id, "0580 官方真题与样题入口", "0580 Official Past Papers and Specimen Materials", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/past-papers/", "past-papers", "mixed", "公开部分真题、mark schemes、examiner reports 和 specimen materials。", "A public selection of past papers, mark schemes, examiner reports and specimen materials.", "完整资源库需注册学校的 School Support Hub 账号。", "The fuller archive requires a registered-school School Support Hub account."),
  learningResource("cie-0580-endorsed-resources", project0580.id, "0580 官方认可教材目录", "0580 Endorsed Resources", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/published-resources/", "official-textbook", "mixed", "Cambridge 列出的认可教材、练习册与数字资源。", "Cambridge's directory of endorsed textbooks, workbooks and digital resources.", "目录免费浏览；教材通常由出版社付费销售。", "The directory is public; the listed publications are generally paid."),
  learningResource("cie-0580-school-support", project0580.id, "0580 School Support Hub 材料", "0580 School Support Hub Materials", "https://schoolsupporthub.cambridgeinternational.org/", "courseware", "school", "教学计划、example candidate responses、更多真题及 specimen answers。", "Schemes of work, example candidate responses, further past papers and specimen answers.", "仅注册 Cambridge 学校的获授权人员可访问。", "Restricted to authorised users at registered Cambridge schools."),

  learningResource("cie-0607-official-syllabus", project0607.id, "0607 官方考纲", "0607 Official Syllabus", "https://www.cambridgeinternational.org/Images/662472-2025-2027-syllabus.pdf", "official-guide", "free", "2025–2027 年课程内容、图形显示计算器要求、探究与建模评估结构。", "Content, graphic-display-calculator requirements and investigation/modelling assessment structure for 2025–2027."),
  learningResource("cie-0607-official-papers", project0607.id, "0607 官方真题与样题入口", "0607 Official Past Papers and Specimen Materials", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/past-papers/", "past-papers", "mixed", "公开部分真题、mark schemes、examiner reports 和 specimen materials。", "A public selection of past papers, mark schemes, examiner reports and specimen materials.", "完整资源库需注册学校的 School Support Hub 账号。", "The fuller archive requires a registered-school School Support Hub account."),
  learningResource("cie-0607-endorsed-resources", project0607.id, "0607 官方认可教材目录", "0607 Endorsed Resources", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/published-resources/", "official-textbook", "mixed", "列出支持 2025 年起考纲的 CUP、Hachette、Haese、Kognity 等认可资源。", "Lists endorsed CUP, Hachette, Haese and Kognity resources supporting the syllabus from 2025.", "目录免费浏览；教材与平台通常收费。", "The directory is public; textbooks and platforms are generally paid."),
  learningResource("cie-0607-school-support", project0607.id, "0607 School Support Hub 材料", "0607 School Support Hub Materials", "https://schoolsupporthub.cambridgeinternational.org/", "courseware", "school", "教学计划、考生样例、更多真题及 specimen answers。", "Schemes of work, candidate examples, further past papers and specimen answers.", "仅注册 Cambridge 学校的获授权人员可访问。", "Restricted to authorised users at registered Cambridge schools."),

  learningResource("cie-0606-official-syllabus", project0606.id, "0606 官方考纲", "0606 Official Syllabus", "https://www.cambridgeinternational.org/Images/662470-2025-2027-syllabus.pdf", "official-guide", "free", "2025–2027 年完整内容、公式表及两张试卷要求。", "Complete content, formula list and requirements for both papers in 2025–2027."),
  learningResource("cie-0606-getting-ready", project0606.id, "0606 课程变化说明", "Getting Ready to Teach 0606", "https://www.cambridgeinternational.org/Images/665419-getting-ready-factsheet-for-igcse-maths-additional.pdf", "official-guide", "free", "概述 2025 年起内容与评估变化。", "Summarises content and assessment changes from 2025."),
  learningResource("cie-0606-official-papers", project0606.id, "0606 官方真题与样题入口", "0606 Official Past Papers and Specimen Materials", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/past-papers/", "past-papers", "mixed", "公开部分真题、mark schemes、examiner reports 和 specimen materials。", "A public selection of past papers, mark schemes, examiner reports and specimen materials.", "完整资源库需注册学校的 School Support Hub 账号。", "The fuller archive requires a registered-school School Support Hub account."),
  learningResource("cie-0606-endorsed-resources", project0606.id, "0606 官方认可教材目录", "0606 Endorsed Resources", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/published-resources/", "official-textbook", "mixed", "列出 Collins、CUP、Hachette、Marshall Cavendish 等认可教材。", "Lists endorsed Collins, CUP, Hachette and Marshall Cavendish publications.", "目录免费浏览；教材通常收费。", "The directory is public; publications are generally paid."),
  learningResource("cie-0606-school-support", project0606.id, "0606 School Support Hub 材料", "0606 School Support Hub Materials", "https://schoolsupporthub.cambridgeinternational.org/", "courseware", "school", "教学计划、考生样例、更多真题及 specimen answers。", "Schemes of work, candidate examples, further past papers and specimen answers.", "仅注册 Cambridge 学校的获授权人员可访问。", "Restricted to authorised users at registered Cambridge schools."),

  learningResource("cie-9709-official-syllabus", project9709.id, "9709 官方考纲", "9709 Official Syllabus", "https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf", "official-guide", "free", "2026–2027 年六个组件、有效组合、MF19 及考试规则。", "The six components, valid routes, MF19 and exam regulations for 2026–2027."),
  learningResource("cie-9709-support-guide", project9709.id, "9709 官方教学支持说明", "Official Support for 9709 Mathematics", "https://www.cambridgeinternational.org/Images/641183-support-for-mathematics.pdf", "official-guide", "free", "Cambridge 对 9709 教学与学习支持资源的说明。", "Cambridge's overview of teaching and learning support for 9709."),
  learningResource("cie-9709-official-papers", project9709.id, "9709 官方真题与样题入口", "9709 Official Past Papers and Specimen Materials", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/", "past-papers", "mixed", "公开部分真题、mark schemes、examiner reports 和 specimen materials。", "A public selection of past papers, mark schemes, examiner reports and specimen materials.", "完整资源库需注册学校的 School Support Hub 账号。", "The fuller archive requires a registered-school School Support Hub account."),
  learningResource("cie-9709-endorsed-resources", project9709.id, "9709 官方认可教材目录", "9709 Endorsed Resources", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/published-resources/", "official-textbook", "mixed", "按 Pure Mathematics、Mechanics 与 Probability & Statistics 模块列出的认可教材。", "Endorsed resources organised around Pure Mathematics, Mechanics and Probability & Statistics modules.", "目录免费浏览；教材通常收费。", "The directory is public; publications are generally paid."),
  learningResource("cie-9709-school-support", project9709.id, "9709 School Support Hub 材料", "9709 School Support Hub Materials", "https://schoolsupporthub.cambridgeinternational.org/", "courseware", "school", "教学计划、考生样例、更多真题及 specimen answers。", "Schemes of work, candidate examples, further past papers and specimen answers.", "仅注册 Cambridge 学校的获授权人员可访问。", "Restricted to authorised users at registered Cambridge schools."),

  learningResource("cie-9231-official-syllabus", project9231.id, "9231 官方考纲", "9231 Official Syllabus", "https://www.cambridgeinternational.org/Images/697357-2026-2027-syllabus.pdf", "official-guide", "free", "2026–2027 年四个组件、先修关系、有效组合及 MF19。", "The four components, prior-learning relationships, valid routes and MF19 for 2026–2027."),
  learningResource("cie-9231-official-papers", project9231.id, "9231 官方真题与样题入口", "9231 Official Past Papers and Specimen Materials", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/past-papers/", "past-papers", "mixed", "公开部分真题、mark schemes、examiner reports 和 specimen materials。", "A public selection of past papers, mark schemes, examiner reports and specimen materials.", "完整资源库需注册学校的 School Support Hub 账号。", "The fuller archive requires a registered-school School Support Hub account."),
  learningResource("cie-9231-endorsed-resources", project9231.id, "9231 官方认可教材目录", "9231 Endorsed Resources", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/published-resources/", "official-textbook", "mixed", "列出 CUP 全课程教材、Hodder 分模块教材与 Collins Further Pure Mathematics 资源。", "Lists the CUP full-course book, Hodder component books and Collins Further Pure Mathematics resources.", "目录免费浏览；教材通常收费。", "The directory is public; publications are generally paid."),
  learningResource("cie-9231-school-support", project9231.id, "9231 School Support Hub 材料", "9231 School Support Hub Materials", "https://schoolsupporthub.cambridgeinternational.org/", "courseware", "school", "教学计划、考生样例、更多真题及 specimen answers。", "Schemes of work, candidate examples, further past papers and specimen answers.", "仅注册 Cambridge 学校的获授权人员可访问。", "Restricted to authorised users at registered Cambridge schools."),
];

export const cambridgeCoursePastPaperArchives: PastPaperArchiveRecord[] = [
  {
    id: "past-papers-cie-0580",
    projectId: project0580.id,
    availability: "official",
    summary: t("Cambridge 公开部分 0580 真题、mark schemes、examiner reports 与 specimen materials；完整档案保留在 School Support Hub。", "Cambridge publishes a selection of 0580 past papers, mark schemes, examiner reports and specimen materials; the fuller archive remains in the School Support Hub."),
    links: [
      paperLink("0580 官方公开真题页", "0580 Official Public Past-Paper Page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-0580/past-papers/", "archive", "mixed", "公开页面可直接下载所列材料；页面明确说明这只是部分试卷。", "Listed materials are publicly downloadable; the page states that this is only a selection."),
      paperLink("School Support Hub 完整资源", "Fuller Resources in School Support Hub", "https://schoolsupporthub.cambridgeinternational.org/", "archive", "school", "含更多真题、考生样例和 specimen answers；仅注册学校账号可访问。", "Includes further papers, candidate examples and specimen answers; restricted to registered-school accounts."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-cie-0607",
    projectId: project0607.id,
    availability: "official",
    summary: t("Cambridge 公开部分 0607 真题、mark schemes、examiner reports 与 specimen materials；完整档案保留在 School Support Hub。", "Cambridge publishes a selection of 0607 past papers, mark schemes, examiner reports and specimen materials; the fuller archive remains in the School Support Hub."),
    links: [
      paperLink("0607 官方公开真题页", "0607 Official Public Past-Paper Page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-international-mathematics-0607/past-papers/", "archive", "mixed", "公开页面可直接下载所列材料；页面明确说明这只是部分试卷。", "Listed materials are publicly downloadable; the page states that this is only a selection."),
      paperLink("School Support Hub 完整资源", "Fuller Resources in School Support Hub", "https://schoolsupporthub.cambridgeinternational.org/", "archive", "school", "含更多真题、考生样例和 specimen answers；仅注册学校账号可访问。", "Includes further papers, candidate examples and specimen answers; restricted to registered-school accounts."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-cie-0606",
    projectId: project0606.id,
    availability: "official",
    summary: t("Cambridge 公开部分 0606 真题、mark schemes、examiner reports 与 specimen materials；完整档案保留在 School Support Hub。", "Cambridge publishes a selection of 0606 past papers, mark schemes, examiner reports and specimen materials; the fuller archive remains in the School Support Hub."),
    links: [
      paperLink("0606 官方公开真题页", "0606 Official Public Past-Paper Page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-igcse-mathematics-additional-0606/past-papers/", "archive", "mixed", "公开页面可直接下载所列材料；页面明确说明这只是部分试卷。", "Listed materials are publicly downloadable; the page states that this is only a selection."),
      paperLink("School Support Hub 完整资源", "Fuller Resources in School Support Hub", "https://schoolsupporthub.cambridgeinternational.org/", "archive", "school", "含更多真题、考生样例和 specimen answers；仅注册学校账号可访问。", "Includes further papers, candidate examples and specimen answers; restricted to registered-school accounts."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-cie-9709",
    projectId: project9709.id,
    availability: "official",
    summary: t("Cambridge 公开部分 9709 真题、mark schemes、examiner reports 与 specimen materials；完整档案保留在 School Support Hub。", "Cambridge publishes a selection of 9709 past papers, mark schemes, examiner reports and specimen materials; the fuller archive remains in the School Support Hub."),
    links: [
      paperLink("9709 官方公开真题页", "9709 Official Public Past-Paper Page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-9709/past-papers/", "archive", "mixed", "公开页面可直接下载所列材料；页面明确说明旧卷可能不完全反映现行考纲。", "Listed materials are publicly downloadable; the page warns that older papers may not fully reflect the current syllabus."),
      paperLink("School Support Hub 完整资源", "Fuller Resources in School Support Hub", "https://schoolsupporthub.cambridgeinternational.org/", "archive", "school", "含更多真题、考生样例和 specimen answers；仅注册学校账号可访问。", "Includes further papers, candidate examples and specimen answers; restricted to registered-school accounts."),
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-cie-9231",
    projectId: project9231.id,
    availability: "official",
    summary: t("Cambridge 公开部分 9231 真题、mark schemes、examiner reports 与 specimen materials；完整档案保留在 School Support Hub。", "Cambridge publishes a selection of 9231 past papers, mark schemes, examiner reports and specimen materials; the fuller archive remains in the School Support Hub."),
    links: [
      paperLink("9231 官方公开真题页", "9231 Official Public Past-Paper Page", "https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-international-as-and-a-level-mathematics-further-9231/past-papers/", "archive", "mixed", "公开页面可直接下载所列材料；页面明确说明旧卷可能不完全反映现行考纲。", "Listed materials are publicly downloadable; the page warns that older papers may not fully reflect the current syllabus."),
      paperLink("School Support Hub 完整资源", "Fuller Resources in School Support Hub", "https://schoolsupporthub.cambridgeinternational.org/", "archive", "school", "含更多真题、考生样例和 specimen answers；仅注册学校账号可访问。", "Includes further papers, candidate examples and specimen answers; restricted to registered-school accounts."),
    ],
    lastVerified: VERIFIED_AT,
  },
];
