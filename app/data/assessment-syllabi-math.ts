import { otherAssessmentSyllabi } from "./assessment-syllabi-other";
import { ukAssessmentSyllabi } from "./assessment-syllabi-uk";
import { usAssessmentSyllabi } from "./assessment-syllabi-us";
import { t, type AssessmentSyllabusRecord, type ContentSection, type FactRecord } from "../lib/types";

const sourceRecords = [
  ...usAssessmentSyllabi,
  ...otherAssessmentSyllabi,
  ...ukAssessmentSyllabi,
];

function record(projectId: string): AssessmentSyllabusRecord {
  const found = sourceRecords.find((item) => item.projectId === projectId);
  if (!found) throw new Error(`Missing assessment syllabus for ${projectId}`);
  return found;
}

function section(item: AssessmentSyllabusRecord, id: string): ContentSection {
  const found = item.sections.find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing section ${id} for ${item.projectId}`);
  return found;
}

const fact = (labelZh: string, labelEn: string, valueZh: string, valueEn: string): FactRecord => ({
  label: t(labelZh, labelEn),
  value: t(valueZh, valueEn),
});

function mathOnlySat(): AssessmentSyllabusRecord {
  const base = record("sat");
  const structure = section(base, "sat-structure");
  const structureTables = structure.tables ?? [];
  return {
    ...base,
    title: t("SAT 数学部分现行考纲", "Current Digital SAT Math Specification"),
    officialName: t("数字 SAT 数学部分", "Digital SAT Math Section"),
    summary: t(
      "本页整理数字 SAT 数学部分：两组自适应模块共 70 分钟、44 题，覆盖代数、进阶数学、问题解决与数据分析、几何与三角。",
      "This record covers only Digital SAT Math: two adaptive modules, 70 minutes and 44 questions across Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry and Trigonometry.",
    ),
    facts: [
      fact("考试形式", "Delivery", "Bluebook 数字化多阶段自适应考试", "Digital multistage-adaptive testing in Bluebook"),
      fact("数学部分", "Math section", "70 分钟；44 题；两组各 35 分钟", "70 minutes; 44 questions; two 35-minute modules"),
      fact("计分题与试测题", "Operational and pretest items", "40 道计分题、4 道不计分试测题", "40 operational and 4 unscored pretest items"),
      fact("考纲性质", "Nature of specification", "官方公布知识域、技能、题型比例和试卷结构", "Official blueprint covering domains, skills, item composition and structure"),
    ],
    sections: [
      {
        ...structure,
        title: t("数学部分结构", "Math section structure"),
        intro: t(
          "先完成第一模块，再根据第一模块表现进入难度较高或较低的第二模块；两个模块都计入数学分数。",
          "Candidates complete Module 1 before being routed to a higher- or lower-difficulty Module 2; both modules contribute to the Math score.",
        ),
        tables: [
          structureTables[0] ? { ...structureTables[0], rows: structureTables[0].rows.filter((row) => row.cells[0]?.en === "Math") } : undefined,
          structureTables[1],
        ].filter((table): table is NonNullable<typeof table> => Boolean(table)),
      },
      section(base, "sat-math-domains"),
      {
        ...section(base, "sat-math-item-composition"),
        tables: section(base, "sat-math-item-composition").tables?.map((table) => ({
          ...table,
          rows: table.rows.map((row) => row.cells[0]?.en === "Questions in context"
            ? { cells: [row.cells[0], t("约占数学题的 30%，使用现实情境", "Approximately 30% of Math items use real-world contexts")] }
            : row),
        })),
      },
    ],
    sources: base.sources.filter((source) => source.title.en !== "Reading and Writing Content Alignment"),
    translationNote: t(
      "只翻译 College Board 对 Math section 的现行内容框架；百分比和题量范围均以计分数学题为基数。",
      "Only the current College Board Math framework is translated. Percentages and item ranges use scored Math questions as their base.",
    ),
  };
}

function mathOnlyAct(): AssessmentSyllabusRecord {
  const base = record("act");
  const structure = section(base, "act-structure");
  return {
    ...base,
    title: t("ACT 数学部分现行考纲", "Current ACT Math Specification"),
    officialName: t("Enhanced ACT 数学部分", "Enhanced ACT Math Section"),
    summary: t(
      "本页只整理 2026 年起国际考生使用的 Enhanced ACT 数学部分：50 分钟、45 题，其中 41 题计分，范围包括数与量、代数、函数、几何、统计与概率及综合技能。",
      "This record covers only Enhanced ACT Math for international testing from 2026: 45 questions in 50 minutes, including 41 scored items across number and quantity, algebra, functions, geometry, statistics and probability, and essential skills.",
    ),
    facts: [
      fact("现行版本", "Current version", "Enhanced ACT；国际考生自 2026 年 2 月起使用", "Enhanced ACT; used internationally from February 2026"),
      fact("数学部分", "Math section", "50 分钟；45 题；41 题计分、4 题试测", "50 minutes; 45 items; 41 scored and 4 field-test items"),
      fact("答案选项", "Answer choices", "每题 4 个选项", "Four answer choices per item"),
      fact("分数", "Score", "数学单项按 1–36 报告", "Math is reported on the 1–36 scale"),
    ],
    sections: [
      {
        ...structure,
        title: t("数学部分结构", "Math section structure"),
        tables: structure.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Math") })),
      },
      section(base, "act-math"),
    ],
    translationNote: t(
      "只保留 ACT 官方 Design Framework 中的 Mathematics blueprint；Modeling 是跨数学类别标签，不能与其他类别百分比相加。",
      "Only the Mathematics blueprint in ACT's official Design Framework is retained. Modeling is a cross-category designation and is not additive to the other percentages.",
    ),
  };
}

function mathOnlySsat(): AssessmentSyllabusRecord {
  const base = record("ssat");
  const structure = section(base, "ssat-structure");
  const domains = section(base, "ssat-domains");
  return {
    ...base,
    title: t("SSAT 数学部分内容范围", "SSAT Quantitative Content Scope"),
    officialName: t("SSAT 数学（Quantitative）部分", "SSAT Quantitative Sections"),
    summary: t(
      "本页只整理 SSAT 数学部分。Middle 与 Upper Level 各有两组 Quantitative，每组 25 题、30 分钟，不得使用计算器；官方公布的是宽泛能力领域而非封闭知识点考纲。",
      "This record covers only SSAT Quantitative. Middle and Upper Levels each contain two 25-item, 30-minute Quantitative sections without a calculator; the published scope is broad rather than a closed topic list.",
    ),
    facts: [
      base.facts.find((item) => item.label.en === "Levels")!,
      fact("数学结构", "Quantitative structure", "两组各 25 题、30 分钟", "Two sections of 25 items and 30 minutes each"),
      fact("计算器", "Calculator", "不得使用", "Not permitted"),
      fact("公开范围", "Published scope", "算术、初等代数、几何及其他数量概念", "Arithmetic, elementary algebra, geometry and other quantitative concepts"),
    ],
    sections: [
      section(base, "ssat-levels"),
      {
        ...structure,
        title: t("Middle／Upper Level 数学结构", "Middle / Upper Level Quantitative structure"),
        tables: structure.tables?.map((table) => ({
          ...table,
          rows: table.rows.filter((row) => row.cells[1]?.en.startsWith("Quantitative")),
        })),
      },
      {
        ...domains,
        title: t("数学能力范围", "Quantitative skill scope"),
        tables: domains.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Quantitative") })),
      },
    ],
    translationNote: t(
      "Quantitative 译为“数学（数量推理）”。EMA 未公布逐知识点课程清单，因此不加入培训机构整理的扩展范围。",
      "Quantitative is rendered as Mathematics (Quantitative Reasoning). EMA does not publish a topic-by-topic curriculum, so no third-party expanded syllabus is added.",
    ),
  };
}

function mathOnlyIsee(): AssessmentSyllabusRecord {
  const base = record("isee");
  const levels = section(base, "isee-levels-structure");
  return {
    ...base,
    title: t("ISEE 数学部分内容范围", "ISEE Mathematics Content Scope"),
    officialName: t("ISEE 数量推理与数学成就部分", "ISEE Quantitative Reasoning and Mathematics Achievement"),
    summary: t(
      "本页只整理 ISEE 的 Quantitative Reasoning 与 Mathematics Achievement。不同等级题量不同；前者侧重数学推理，后者依据数与运算、代数、几何、测量、数据分析和概率等领域。",
      "This record covers only ISEE Quantitative Reasoning and Mathematics Achievement. Item counts vary by level; the former emphasizes reasoning, while the latter draws on number and operations, algebra, geometry, measurement, data analysis and probability.",
    ),
    facts: [
      base.facts.find((item) => item.label.en === "Level rule")!,
      base.facts.find((item) => item.label.en === "Delivery")!,
      base.facts.find((item) => item.label.en === "Wrong-answer penalty")!,
      fact("数学分项", "Mathematics sections", "Quantitative Reasoning 与 Mathematics Achievement 分别计分", "Quantitative Reasoning and Mathematics Achievement are scored separately"),
    ],
    sections: [
      {
        ...levels,
        title: t("等级、数学题量与用时", "Levels, mathematics item counts and timing"),
        intro: t("等级按申请入读年级确定；下表只保留两个数学分项。", "The level is based on the grade applied to; the table retains only the two mathematics sections."),
        tables: levels.tables?.map((table) => ({
          ...table,
          columns: [table.columns[0], table.columns[1], table.columns[3], table.columns[5]],
          rows: table.rows.map((row) => ({ cells: [row.cells[0], row.cells[1], row.cells[3], row.cells[5]] })),
        })),
      },
      section(base, "isee-mathematics"),
    ],
    translationNote: t(
      "Quantitative Reasoning 与 Mathematics Achievement 保留官方英文名称，并分别译为“数量推理”和“数学成就”。公开范围不是逐知识点封闭考纲。",
      "The official labels Quantitative Reasoning and Mathematics Achievement are retained. The public scope is not a closed topic-by-topic syllabus.",
    ),
  };
}

function mathOnlyUkiset(): AssessmentSyllabusRecord {
  const base = record("ukiset");
  const domains = section(base, "ukiset-domains");
  return {
    ...base,
    title: t("UKiset 数学推理公开范围", "Published UKiset Mathematical Reasoning Scope"),
    officialName: t("UKiset Reasoning Test：Mathematics", "UKiset Reasoning Test: Mathematics"),
    summary: t(
      "UKiset 只公开数学推理涉及数字、数值和数列，没有发布固定题量、逐知识点考纲或公开真题。本页不收录英语及其他推理分项。",
      "UKiset publicly describes mathematical reasoning as work with numbers, value and sequences, but publishes no fixed item count, topic-level syllabus or public live papers. Other assessment components are outside this record.",
    ),
    facts: [
      base.facts.find((item) => item.label.en === "Age range")!,
      fact("所属部分", "Test part", "Reasoning Test；整部分约 40–45 分钟", "Reasoning Test; approximately 40–45 minutes for the full reasoning component"),
      fact("数学范围", "Published mathematics scope", "数字、数值与数列", "Numbers, value and sequences"),
      fact("计算器", "Calculator", "不得使用", "Not permitted"),
      fact("题量", "Item count", "官方未公布数学分项固定题量", "No fixed mathematics item count is published"),
    ],
    sections: [
      {
        id: "ukiset-mathematics-boundary",
        title: t("数学推理公开边界", "Published mathematical-reasoning boundary"),
        bullets: [
          t("数学是自适应 Reasoning Test 中单独报告的一个分项。", "Mathematics is separately reported within the adaptive Reasoning Test."),
          t("官网只说明 working with numbers, value and sequences，没有公布完整知识点表。", "The site states only ‘working with numbers, value and sequences’ and gives no exhaustive topic list."),
          t("官方不公开正式真题或完整模拟卷。", "No official live papers or full mock tests are publicly released."),
        ],
      },
      {
        ...domains,
        title: t("数学能力说明", "Published mathematics description"),
        tables: domains.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Mathematics") })),
      },
      {
        id: "ukiset-mathematics-report",
        title: t("成绩与考试限制", "Reporting and test restrictions"),
        bullets: [
          t("数学推理报告包括标准分、英国同龄人百分位和 stanine，并计入不含 verbal 的推理平均分。", "The mathematics report includes a standardized score, UK national percentile and stanine, and contributes to the non-verbal reasoning average."),
          t("手机、计算器、词典和翻译工具均不得使用。", "Mobile phones, calculators, dictionaries and translation tools are prohibited."),
          t("数学推理没有适用于所有学校的统一及格线。", "There is no universal mathematical-reasoning pass mark for all schools."),
        ],
      },
    ],
    translationNote: t(
      "只翻译官网对 Mathematics 分项的公开说明；不把官方辅导课程内容或第三方练习册当作考纲。",
      "Only the public description of the Mathematics component is translated. Official tutoring content and third-party workbooks are not treated as a syllabus.",
    ),
  };
}

function mathOnlyCat4(): AssessmentSyllabusRecord {
  const base = record("cat4");
  const batteries = section(base, "cat4-batteries");
  return {
    ...base,
    title: t("CAT4 数量推理公开范围", "Published CAT4 Quantitative Reasoning Scope"),
    officialName: t("CAT4 Quantitative Reasoning Battery", "CAT4 Quantitative Reasoning Battery"),
    summary: t(
      "本页只整理 CAT4 数量推理：Number Analogies 与 Number Series 两类任务。CAT4 是安全的认知能力测评，官方不发布学生题库或逐知识点考纲，并明确不认可考前刷题材料。",
      "This record covers only CAT4 Quantitative Reasoning: Number Analogies and Number Series. CAT4 is a secure cognitive assessment; no live item bank or topic-level syllabus is published, and GL Assessment does not endorse advance practice material.",
    ),
    facts: [
      base.facts.find((item) => item.label.en === "Age range")!,
      fact("数量推理任务", "Quantitative tasks", "Number Analogies；Number Series", "Number Analogies and Number Series"),
      fact("测量对象", "Construct", "数字关系、规律识别及基础算术的准确性与灵活性", "Numerical relationships, rule recognition, and arithmetic accuracy and flexibility"),
      fact("公开题量", "Published item count", "未公布", "Not published"),
    ],
    sections: [
      {
        id: "cat4-quantitative-boundary",
        title: t("数量推理的公开边界", "Published boundary of Quantitative Reasoning"),
        bullets: [
          t("数量推理测量数字材料中的关系识别和规则发现，不是按国家课程命题的数学成绩考试。", "Quantitative Reasoning measures relationships and rule discovery in numerical material; it is not a mathematics attainment test tied to a national curriculum."),
          t("正式测评中每个部分自带非计时示例；GL Assessment 不建议额外考前训练。", "Each live section contains untimed examples; GL Assessment does not recommend additional advance training."),
          t("安全题库、正式题量和完整知识点蓝图均不公开。", "The secure item bank, live item count and exhaustive topic blueprint are not public."),
        ],
      },
      {
        ...batteries,
        title: t("数量推理任务", "Quantitative Reasoning tasks"),
        tables: batteries.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Quantitative Reasoning") })),
      },
      {
        id: "cat4-quantitative-reporting",
        title: t("成绩解释", "Result interpretation"),
        bullets: [
          t("学校报告通常提供数量推理的 Standard Age Score、百分位和 stanine。", "School reports normally provide a Quantitative Reasoning Standard Age Score, percentile and stanine."),
          t("结果反映常模参照的推理表现，不等同于数学课程掌握程度。", "The result is a norm-referenced reasoning measure, not proof of mathematics-curriculum mastery."),
        ],
      },
    ],
    translationNote: t(
      "Quantitative Reasoning 译为“数量推理”。本页只依据 GL Assessment 公开范围，不采用第三方 CAT4 题库。",
      "Quantitative Reasoning is translated directly. This record uses only the scope published by GL Assessment and no third-party CAT4 bank.",
    ),
  };
}

function mathOnlyMapGrowth(): AssessmentSyllabusRecord {
  const base = record("map-growth");
  const nature = section(base, "map-nature-coverage");
  const examples = section(base, "map-framework-examples");
  return {
    ...base,
    title: t("MAP Growth 数学内容框架", "MAP Growth Mathematics Content Framework"),
    officialName: t("NWEA MAP Growth Mathematics", "NWEA MAP Growth Mathematics"),
    summary: t(
      "本页只整理 MAP Growth Mathematics。测评约 43 题、通常 45–55 分钟，题目自适应；具体内容由学校分配的年级、语言和 standards alignment 决定，因此不存在一套全球统一固定考纲。",
      "This record covers only MAP Growth Mathematics. The adaptive test contains about 43 items and usually takes 45–55 minutes; content depends on the grade, language and standards alignment assigned by the school, so there is no single universal fixed syllabus.",
    ),
    facts: [
      fact("形式", "Delivery", "按单科实施的计算机自适应数学测评", "Single-subject computer-adaptive mathematics assessment"),
      fact("题量", "Item count", "数学约 43 题", "About 43 Mathematics items"),
      fact("用时", "Time", "不限时；多数学生约 45–55 分钟", "Untimed; most students take about 45–55 minutes"),
      fact("成绩", "Score", "数学 RIT 等距纵向量尺，用于比较学期与年级间成长", "Mathematics RIT equal-interval vertical scale for growth across terms and grades"),
    ],
    sections: [
      {
        ...nature,
        title: t("数学测评的适用范围", "Mathematics assessment coverage"),
        bullets: nature.bullets?.filter((_, index) => index === 0),
        tables: nature.tables?.map((table) => ({
          ...table,
          columns: [table.columns[0], t("数学版本", "Mathematics version"), table.columns[2]],
          rows: table.rows.filter((row) => row.cells[1]?.en.includes("Mathematics")).map((row) => ({ ...row, cells: [row.cells[0], t("数学", "Mathematics"), row.cells[2]] })),
        })),
      },
      section(base, "map-test-shape"),
      {
        ...examples,
        title: t("官方数学框架示例", "Official mathematics-framework example"),
        tables: examples.tables?.map((table) => ({
          ...table,
          rows: table.rows.filter((row) => row.cells[0]?.en === "Math 2–5"),
          note: t("示例蓝图题量不含最多 3 道数学试测题。", "The illustrative blueprint counts exclude up to three Mathematics field-test items."),
        })),
      },
      section(base, "map-variation-boundary"),
    ],
    sources: base.sources.map((source) => source.title.en === "MAP Growth Features" ? {
      ...source,
      note: t("数学适用年级、45–55 分钟用时、标准对齐和自适应结构。", "Mathematics grades, 45–55 minute timing, standards alignment and adaptive structure."),
    } : source),
    translationNote: t(
      "只保留技术报告中的 Mathematics 示例。示例题量用于说明框架组织方式，不代表所有学校、年级或 standards alignment 的固定试卷。",
      "Only the Mathematics example in the technical report is retained. Its counts illustrate framework organization and do not define every school's grade or standards-aligned form.",
    ),
  };
}

function mathOnlyEsat(): AssessmentSyllabusRecord {
  const base = record("esat");
  const structure = section(base, "esat-structure-combinations");
  const firstTable = structure.tables?.[0];
  return {
    ...base,
    title: t("ESAT Mathematics 1／2 现行考纲", "Current ESAT Mathematics 1 and 2 Specification"),
    officialName: t("ESAT Mathematics 1 与 Mathematics 2", "ESAT Mathematics 1 and Mathematics 2"),
    summary: t(
      "本页只整理 ESAT Mathematics 1 与 Mathematics 2。每个模块 27 道选择题、40 分钟、独立计分；Mathematics 2 在 Mathematics 1 的基础上增加代数与函数、数列与级数、坐标几何、三角、指数对数、微积分和函数图像。",
      "This record covers only ESAT Mathematics 1 and Mathematics 2. Each module has 27 multiple-choice questions in 40 minutes and is scored separately; Mathematics 2 adds advanced algebra and functions, sequences and series, coordinate geometry, trigonometry, exponentials and logarithms, calculus, and graphs.",
    ),
    facts: [
      base.facts.find((item) => item.label.en === "Applicable sittings")!,
      fact("数学模块", "Mathematics modules", "Mathematics 1；Mathematics 2", "Mathematics 1 and Mathematics 2"),
      base.facts.find((item) => item.label.en === "Per module")!,
      base.facts.find((item) => item.label.en === "Marking")!,
      base.facts.find((item) => item.label.en === "Permitted aids")!,
    ],
    sections: [
      {
        id: "esat-mathematics-structure",
        title: t("数学模块结构", "Mathematics module structure"),
        intro: t("Mathematics 1 是所有 ESAT 考生的基础数学模块；是否选 Mathematics 2 由申请课程的正式要求决定。", "Mathematics 1 is the foundation mathematics module for ESAT; Mathematics 2 is selected where required by the applicant's course."),
        tables: firstTable ? [{
          ...firstTable,
          rows: firstTable.rows.filter((row) => row.cells[0]?.en === "Mathematics 1" || row.cells[0]?.en === "Mathematics 2"),
        }] : [],
      },
      section(base, "esat-mathematics-one"),
      section(base, "esat-mathematics-two"),
    ],
    sources: base.sources.filter((source) => source.title.en !== "UAT-UK Course List for 2027 Entry"),
    translationNote: t(
      "本页只翻译 ESAT specification 中的 M 与 MM 编码条目。其他模块不属于本数学考纲页。",
      "Only the M- and MM-coded entries in the ESAT specification are translated. Other modules are outside this mathematics record.",
    ),
  };
}

export const mathAssessmentSyllabi: AssessmentSyllabusRecord[] = [
  mathOnlySat(),
  mathOnlyAct(),
  mathOnlySsat(),
  mathOnlyIsee(),
  mathOnlyUkiset(),
  mathOnlyCat4(),
  mathOnlyMapGrowth(),
  record("tmua"),
  mathOnlyEsat(),
  record("step"),
];
