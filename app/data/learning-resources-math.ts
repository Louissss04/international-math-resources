import { t, type LearningResourceRecord } from "../lib/types";

type ResourceCopy = Partial<Pick<LearningResourceRecord, "title" | "description" | "note">>;

const excludedIds = new Set([
  "uat-esat-guide-biology-2025",
  "uat-esat-guide-chemistry-2025",
  "uat-esat-guide-physics-2026",
]);

const overrides: Record<string, ResourceCopy> = {
  "lr-sat-practice-hub": {
    title: t("SAT 数学官方练习中心", "Official SAT Math Practice Hub"),
    description: t("进入 Bluebook 数学模考、SAT 数学学生题库和 My Practice 解析。", "Access Bluebook Math practice, the SAT Math Student Question Bank and My Practice explanations."),
  },
  "lr-sat-bluebook-tests": {
    title: t("Bluebook SAT 数学官方模考", "Official SAT Math Practice in Bluebook"),
    description: t("在正式考试软件中完成全长模考，并只使用其中的数学模块练习自适应分流、内置计算器和计时。", "Take full-length tests in the official app and use the Math modules for adaptive routing, the built-in calculator and timing."),
  },
  "lr-sat-question-bank": {
    title: t("SAT 数学学生题库", "SAT Math Student Question Bank"),
    description: t("筛选命题方提供的数学题，可按知识域、技能和难度生成题单。", "Filter official Math questions by domain, skill and difficulty to build practice sets."),
  },
  "college-board-sat-paper-practice-tests": {
    title: t("SAT 官方练习卷：数学部分", "Official SAT Practice Tests: Math Sections"),
    description: t("多套可打印的非自适应练习卷，数学部分配有答案、计分指南和逐题解析。", "Printable nonadaptive practice tests whose Math sections include answer keys, scoring guides and question-by-question explanations."),
    note: t("纸质卷不模拟自适应分流；还应完成至少一套 Bluebook 数学模考。", "Paper tests do not reproduce adaptive routing; also complete at least one Bluebook Math practice test."),
  },
  "college-board-official-digital-sat-study-guide": {
    title: t("《The Official Digital SAT Study Guide》：数学部分", "The Official Digital SAT Study Guide: Math"),
    description: t("College Board 纸质指南中的数学结构、题型练习、作答建议、答案解析和四套官方练习卷。", "The College Board print guide's Math structure, drills, guidance, explanations and four official practice tests."),
    note: t("练习卷也可在 Bluebook 免费完成；使用本书时只整理数学内容。", "The tests are also free in Bluebook; only the Math content is indexed here."),
  },
  "lr-act-free-practice": {
    title: t("ACT 数学官方免费练习", "Official Free ACT Math Practice"),
    description: t("从当前全长练习卷和在线练习中使用 Mathematics 部分、答案和计分键。", "Use the Mathematics sections, answer keys and scoring keys from current full-length and online practice."),
  },
  "lr-act-online-samples": {
    title: t("ACT Mathematics 官方在线样题", "Official ACT Mathematics Online Samples"),
    description: t("在线完成 Mathematics 样题，并使用官方答案与计分说明核对。", "Complete Mathematics samples online and check them against the official answers and scoring guidance."),
  },
  "act-2026-27-full-practice-test-1": {
    title: t("2026—27 ACT 官方练习卷 1：数学部分", "Official 2026–27 ACT Practice Test 1: Mathematics"),
    description: t("使用整卷中的 Mathematics 部分、答题纸、答案和换分说明。", "Use the Mathematics section, answer document, key and score-conversion guidance from the full practice test."),
    note: t("数学题来自 ACT 已退役的正式试题。", "The mathematics questions are retired items from official ACT administrations."),
  },
  "act-full-practice-test-2": {
    title: t("ACT 官方练习卷 2：数学部分", "Official ACT Practice Test 2: Mathematics"),
    description: t("第二套整卷中的 Mathematics 部分，附答题纸、答案和自评分说明。", "The Mathematics section from a second full test, with answer document, key and self-scoring guidance."),
    note: t("数学题来自 ACT 已退役的正式试题。", "The mathematics questions are retired items from official ACT administrations."),
  },
  "act-official-prep-guide-2026-2027": {
    title: t("《The Official ACT Prep Guide 2026–2027》：数学部分", "The Official ACT Prep Guide 2026–2027: Mathematics"),
    description: t("使用书中 Mathematics 策略、四套现行形式练习卷的数学部分及全部数学答案解析。", "Use its Mathematics strategy, the Math sections from four current-format tests and all corresponding explanations."),
  },
  "act-official-subject-guides-third-edition": {
    title: t("ACT 官方 Mathematics 分科指南（第三版）", "ACT Official Mathematics Guide, Third Edition"),
    description: t("按数学概念和题型组织官方试题、详细解析和作答策略。", "Organises official questions, detailed explanations and strategies by mathematics concept and item type."),
    note: t("随书代码提供一年在线数学题库访问；二手书代码可能已使用。", "The book code provides one year of online Math question-bank access; a used code may already be redeemed."),
  },
  "lr-ssat-official-practice": {
    title: t("SSAT 数学官方练习", "Official SSAT Mathematics Practice"),
    description: t("免费 Mini-Test 含数学样题；Middle／Upper 完整练习和纸质指南可用于 Quantitative 分项。", "The free Mini-Test includes mathematics samples; Middle/Upper online practice and guide books can be used for the Quantitative sections."),
  },
  "ssat-free-mini-practice-test": {
    title: t("SSAT 官方 Mini-Test：数学题", "Official SSAT Mini-Test: Mathematics Items"),
    description: t("30 道在线诊断样题中包含数学题，完成后生成主题诊断。", "The 30-question online diagnostic includes mathematics items and produces topic feedback."),
  },
  "ema-official-ssat-study-guide-books": {
    title: t("SSAT 官方 Middle／Upper 数学练习指南", "Official SSAT Middle/Upper Mathematics Practice Guides"),
    description: t("使用各等级指南中的 Quantitative 题型练习、评分说明和四套全长练习卷的数学部分。", "Use the Quantitative drills, scoring guidance and Math sections of four full-length tests in each level's guide."),
  },
  "lr-isee-preparation": {
    title: t("ISEE 官方数学样题与练习卷", "Official ISEE Mathematics Samples and Practice Tests"),
    description: t("按等级进入在线样题和 What to Expect 指南，只使用 Quantitative Reasoning 与 Mathematics Achievement。", "Choose the level-specific online samples and What to Expect guide, using Quantitative Reasoning and Mathematics Achievement only."),
  },
  "erb-isee-lower-level-practice-test": {
    title: t("ISEE Lower Level 官方数学练习", "Official ISEE Lower Level Mathematics Practice"),
    description: t("What to Expect 指南中的 Quantitative Reasoning、Mathematics Achievement、答案和自评分说明。", "Quantitative Reasoning and Mathematics Achievement from the What to Expect guide, with answers and self-scoring guidance."),
  },
  "erb-isee-middle-level-practice-test": {
    title: t("ISEE Middle Level 官方数学练习", "Official ISEE Middle Level Mathematics Practice"),
    description: t("What to Expect 指南中的 Quantitative Reasoning、Mathematics Achievement、答案和自评分说明。", "Quantitative Reasoning and Mathematics Achievement from the What to Expect guide, with answers and self-scoring guidance."),
  },
  "erb-isee-upper-level-practice-test": {
    title: t("ISEE Upper Level 官方数学练习", "Official ISEE Upper Level Mathematics Practice"),
    description: t("What to Expect 指南中的 Quantitative Reasoning、Mathematics Achievement、答案和自评分说明。", "Quantitative Reasoning and Mathematics Achievement from the What to Expect guide, with answers and self-scoring guidance."),
  },
  "lr-ukiset-preparation": {
    title: t("UKiset 数学推理官方准备说明", "Official UKiset Mathematical-Reasoning Guidance"),
    description: t("主办方对数字、数值和数列的公开准备边界，以及官方辅导入口。", "The organiser's published preparation boundary for numbers, value and sequences, together with its tutoring entry point."),
    note: t("官方没有公开数学完整真题或免费题库；一般说明免费，辅导收费。", "No complete mathematics past paper or free item bank is published; general guidance is free and tutoring is paid."),
  },
  "lr-ukiset-welcome-guide": {
    title: t("UKiset 官方指南：数学推理说明", "Official UKiset Guide: Mathematical Reasoning"),
    description: t("查看数学推理所在部分、考试限制、成绩报告和学校使用方式。", "Review where mathematical reasoning appears, test restrictions, score reporting and school use."),
  },
  "lr-cat4-parent-information": {
    title: t("CAT4 数量推理家长说明", "CAT4 Quantitative Reasoning for Parents"),
    description: t("解释数量推理测量什么、学校如何使用结果，以及为什么官方不建议提前刷题。", "Explains what Quantitative Reasoning measures, how schools use it and why advance practice is not advised."),
  },
  "lr-cat4-product-guide": {
    title: t("CAT4 数量推理结构与结果说明", "CAT4 Quantitative Format and Results"),
    description: t("查看 Number Analogies、Number Series、适用年龄、数量推理报告和官方常见问题。", "Review Number Analogies, Number Series, age range, Quantitative reports and official FAQs."),
  },
  "lr-map-growth-warmup": {
    title: t("MAP Growth Mathematics 官方界面练习", "Official MAP Growth Mathematics Warm-up"),
    description: t("进入后选择 Mathematics，熟悉选择、拖拽、工具和自适应测评界面。", "Select Mathematics after entering to learn selection, drag-and-drop, tools and the adaptive interface."),
  },
  "lr-map-growth-family-guide": {
    title: t("MAP Growth Mathematics 家庭指南", "MAP Growth Mathematics Family Guide"),
    description: t("说明数学测评用途、自适应机制、RIT 分数和家庭如何阅读数学结果。", "Explains the purpose of the mathematics assessment, adaptive design, RIT scores and family interpretation."),
  },
  "lr-map-growth-family-faq": {
    title: t("MAP Growth Mathematics 家庭问答", "MAP Growth Mathematics Family FAQ"),
    description: t("说明数学题型、用时、RIT、学校出分方式，并链接官方数学熟悉材料。", "Explains mathematics item formats, timing, RIT and school reporting, with official Math familiarisation links."),
  },
  "lr-uat-pearson-samples": {
    title: t("UAT-UK 官方数学机考样题", "UAT-UK Official Mathematics Computer-Based Samples"),
    description: t("在 Pearson 考试界面完成 TMUA 或 ESAT Mathematics 1／2 的 specimen 与 sample tests。", "Use the Pearson player for TMUA or ESAT Mathematics 1/2 specimen and sample tests."),
  },
  "lr-esat-specification": {
    title: t("ESAT Mathematics 1／2 内容规范（2027 入学）", "ESAT Mathematics 1/2 Specification for 2027 Entry"),
    description: t("使用官方规范中的 Mathematics 1 与 Mathematics 2 编码条目。", "Use the Mathematics 1 and Mathematics 2 coded entries in the official specification."),
  },
  "lr-esat-past-papers": {
    title: t("ESAT Mathematics 1／2 指南与历史数学题", "ESAT Mathematics 1/2 Guides and Historic Mathematics Questions"),
    description: t("进入两份数学指南，以及已标出现行范围差异的前身测评历史数学题和答案。", "Access both mathematics guides and historic predecessor-assessment mathematics questions with current-scope differences identified."),
  },
};

export function applyMathematicsResourceScope(resources: LearningResourceRecord[]): LearningResourceRecord[] {
  return resources
    .filter((resource) => !excludedIds.has(resource.id))
    .map((resource) => ({ ...resource, ...(overrides[resource.id] ?? {}) }));
}
