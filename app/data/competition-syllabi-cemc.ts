import { t, type AssessmentSyllabusRecord } from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";

const seniorTopicSection = () => ({
  id: "official-topic-framework",
  title: t("官方八大备赛专题", "Eight official preparation topics"),
  intro: t(
    "CEMC 为 CSMC 与 Euclid 共用的备赛材料列出以下八个专题。官方同时说明：专题没有先后次序，竞赛题可能跨专题，工具包只是部分常用结论的简要汇总，并不穷尽可能用到的知识。",
    "CEMC lists the following eight topics in preparation material shared by CSMC and Euclid. It also states that the topics are unordered, problems may combine topics, and the toolkits are brief summaries rather than complete coverage of everything that may be useful.",
  ),
  tables: [
    {
      columns: [t("官方英文专题", "Official topic"), t("中文译名", "Chinese translation"), t("工具包定位", "Toolkit role")],
      rows: [
        { cells: [t("Exponents and Logarithms", "Exponents and Logarithms"), t("指数与对数", "Exponents and logarithms"), t("常用性质、例题、练习题与解答", "Useful results, worked examples, practice, and solutions")] },
        { cells: [t("Trigonometry", "Trigonometry"), t("三角学", "Trigonometry"), t("常用公式与竞赛问题", "Core formulas and contest problems")] },
        { cells: [t("Functions, Equations and Polynomials", "Functions, Equations and Polynomials"), t("函数、方程与多项式", "Functions, equations, and polynomials"), t("函数关系、方程组、多项式等", "Functions, equations and systems, and polynomials")] },
        { cells: [t("Analytic Geometry", "Analytic Geometry"), t("解析几何", "Analytic geometry"), t("直线、距离、圆及坐标方法", "Lines, distances, circles, and coordinate methods")] },
        { cells: [t("Sequences and Series", "Sequences and Series"), t("数列与级数", "Sequences and series"), t("等差、等比、求和与常见拓展", "Arithmetic and geometric sequences, sums, and common extensions")] },
        { cells: [t("Euclidean Geometry", "Euclidean Geometry"), t("欧几里得几何", "Euclidean geometry"), t("平面几何性质与证明工具", "Plane-geometry results and proof tools")] },
        { cells: [t("Counting and Probability", "Counting and Probability"), t("计数与概率", "Counting and probability"), t("系统计数、排列组合与概率", "Systematic counting, combinatorics, and probability")] },
        { cells: [t("Properties of Numbers", "Properties of Numbers"), t("数的性质", "Properties of numbers"), t("整除、素数、余数及整数性质", "Divisibility, primes, remainders, and integer properties")] },
      ],
    },
  ],
});

const pcfSyllabus = ({
  id,
  slug,
  projectId,
  nameZh,
  nameEn,
  grade,
}: {
  id: string;
  slug: string;
  projectId: "pascal" | "cayley" | "fermat";
  nameZh: string;
  nameEn: string;
  grade: string;
}): AssessmentSyllabusRecord => ({
  id,
  slug,
  projectId,
  classification: "content-framework",
  title: t(`${nameZh} 竞赛内容框架`, `${nameEn} Contest Content Framework`),
  officialName: t(`${nameZh} 竞赛`, `${nameEn} Contest`),
  applicableCycle: t("2026–27 CEMC 竞赛年度", "2026–27 CEMC contest year"),
  status: "confirmed",
  summary: t(
    `CEMC 将${nameZh}定位为 ${grade} 年级竞赛。题目以加拿大各省共同课程为基础，重点是逻辑思考与数学解题；官方没有发布逐知识点、封闭式考纲。`,
    `CEMC positions the ${nameEn} for Grade ${grade}. Problems are based on curriculum common to all Canadian provinces and emphasize logical thinking and mathematical problem solving; CEMC does not publish a closed topic-by-topic syllabus.`,
  ),
  facts: [
    { label: t("主要年级", "Primary grade"), value: t(`${grade} 年级；更低年级的有能力学生可参加`, `Grade ${grade}; motivated students in lower grades may participate`) },
    { label: t("题量与用时", "Items and time"), value: t("25 题，60 分钟", "25 questions, 60 minutes") },
    { label: t("题型", "Format"), value: t("三部分选择题；A、B 部分选五，C 部分从 0–99 中选整数", "Three multiple-choice parts; A and B use five options, while C selects an integer from 0–99") },
    { label: t("满分", "Maximum score"), value: t("150 分", "150 points") },
  ],
  sections: [
    {
      id: "curriculum-position",
      title: t("课程定位", "Curriculum position"),
      bullets: [
        t(`官方参赛年级为 ${grade} 年级；低年级学生可以越级参加，但同一学年只能参加 Pascal、Cayley、Fermat 中的一项。`, `The official grade is ${grade}. Younger students may write up, but a participant may write only one of Pascal, Cayley, and Fermat in a school year.`),
        t("题目依据加拿大各省共有的数学课程内容，而不是某一省单独的教材顺序。", "Problems are based on mathematics curriculum common to all Canadian provinces rather than the sequence of one provincial textbook."),
        t("CEMC 明确说多数题不以记忆知识为目的，而是考查逻辑思考和数学解题。", "CEMC explicitly states that most problems emphasize logical thinking and mathematical problem solving rather than content recall."),
      ],
    },
    {
      id: "contest-structure",
      title: t("试卷结构", "Contest structure"),
      tables: [
        {
          columns: [t("项目", "Feature"), t("官方说明", "Official specification")],
          rows: [
            { cells: [t("总题量", "Total questions"), t("25 题", "25 questions")] },
            { cells: [t("Parts A、B", "Parts A and B"), t("传统五选一，答案为 A、B、C、D 或 E", "Traditional five-option multiple choice: A, B, C, D, or E")] },
            { cells: [t("Part C", "Part C"), t("从 0 到 99 中选择一个整数", "Select a whole number from 0 through 99")] },
            { cells: [t("用时／满分", "Time / score"), t("60 分钟／150 分", "60 minutes / 150 points")] },
            { cells: [t("实施", "Delivery"), t("学校组织，个人作答；可纸笔或在线；允许符合规则的部分计算器", "School-administered, individual; paper or online; some compliant calculators permitted")] },
          ],
        },
      ],
    },
    {
      id: "scope-boundary",
      title: t("内容边界与资料使用", "Content boundary and use of resources"),
      bullets: [
        t("官方没有给出按代数、几何、数论等分配题量的固定蓝图，也没有承诺某一知识点必考或不考。", "CEMC publishes no fixed algebra/geometry/number-theory allocation and does not promise that a particular topic will or will not appear."),
        t("CEMC Courseware 可用于补齐相应年级课程；课程目录是学习资源，不等同于竞赛考纲。", "CEMC Courseware can support grade-level review, but its lesson list is a learning resource rather than the contest syllabus."),
        t("历年题和 Problem Set Generator 可用于熟悉难度与题型；不得从历年频率推断官方封闭范围。", "Past papers and the Problem Set Generator can familiarize students with difficulty and format; past frequencies must not be presented as an official closed scope."),
      ],
    },
  ],
  sources: [
    {
      title: t("Pascal、Cayley 与 Fermat 官方竞赛页", "Official Pascal, Cayley and Fermat Contest Page"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/contests/pcf",
      format: "webpage",
      version: t("2026–27 竞赛年度", "2026–27 contest year"),
      note: t("年级、结构、用时、形式及官方 Mathematical content 说明。", "Grade placement, structure, timing, delivery, and official Mathematical content statement."),
    },
    {
      title: t("CEMC 9/10/11 年级课程课时与目标表", "CEMC Grade 9/10/11 Courseware Lessons and Goals"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/sites/default/files/documents/2024/AllLessonsWithGoals.pdf",
      format: "pdf",
      note: t("用于定位课程补缺，不是竞赛官方考纲。", "For locating curriculum review only; not an official contest syllabus."),
    },
  ],
  translationNote: t(
    "“curriculum common to all Canadian provinces”译为“加拿大各省共同课程”。这是一项宽泛内容定位，不代表所附课程表中的每个知识点都会出题，也不允许从历年题反推固定比例。",
    "‘Curriculum common to all Canadian provinces’ is treated as a broad content anchor. It does not mean every lesson in the linked courseware will be tested, and no fixed weighting is inferred from past papers.",
  ),
  lastVerified: VERIFIED_AT,
});

const fghSyllabus = ({
  id,
  slug,
  projectId,
  nameZh,
  nameEn,
  grade,
}: {
  id: string;
  slug: string;
  projectId: "fryer" | "galois" | "hypatia";
  nameZh: string;
  nameEn: string;
  grade: string;
}): AssessmentSyllabusRecord => ({
  id,
  slug,
  projectId,
  classification: "content-framework",
  title: t(`${nameZh} 竞赛内容框架`, `${nameEn} Contest Content Framework`),
  officialName: t(`${nameZh} 竞赛`, `${nameEn} Contest`),
  applicableCycle: t("2026–27 CEMC 竞赛年度", "2026–27 CEMC contest year"),
  status: "confirmed",
  summary: t(
    `CEMC 将${nameZh}定位为 ${grade} 年级的书面解答竞赛。题目基于加拿大各省共同课程，重点是逻辑、解题和数学表达；官方没有发布逐知识点的封闭考纲。`,
    `CEMC positions the ${nameEn} as a Grade ${grade} written-solution contest. Problems draw on curriculum common to Canadian provinces and emphasize logic, problem solving, and mathematical communication; there is no closed topic-by-topic syllabus.`,
  ),
  facts: [
    { label: t("主要年级", "Primary grade"), value: t(`${grade} 年级；更低年级的有能力学生可参加`, `Grade ${grade}; motivated students in lower grades may participate`) },
    { label: t("题量与用时", "Questions and time"), value: t("4 题，75 分钟", "4 questions, 75 minutes") },
    { label: t("题型", "Format"), value: t("每题含若干小问，混合只写答案与完整解答", "Multi-part questions mixing final-answer and full-solution work") },
    { label: t("满分", "Maximum score"), value: t("40 分", "40 points") },
  ],
  sections: [
    {
      id: "curriculum-position",
      title: t("课程定位", "Curriculum position"),
      bullets: [
        t(`官方参赛年级为 ${grade} 年级；更低年级学生可以越级参加，但同一学年只能参加 Fryer、Galois、Hypatia 中的一项。`, `The official grade is ${grade}. Younger students may write up, but a participant may write only one of Fryer, Galois, and Hypatia in a school year.`),
        t("题目以加拿大各省共同课程为基础，不按某一省的课程章节顺序出题。", "Problems are based on curriculum common to Canadian provinces and do not follow the chapter order of one provincial course."),
        t("多数题侧重逻辑思考和数学解题，而不是知识回忆。", "Most problems emphasize logical thinking and mathematical problem solving rather than content recall."),
      ],
    },
    {
      id: "written-solution-format",
      title: t("书面解答结构与评分", "Written-solution format and marking"),
      tables: [
        {
          columns: [t("项目", "Feature"), t("官方说明", "Official specification")],
          rows: [
            { cells: [t("试题", "Paper"), t("4 道逐步展开的多小问题", "Four progressively developed multi-part questions")] },
            { cells: [t("作答", "Response types"), t("只写答案小问与完整解答小问混合", "A mix of final-answer-only and full-solution parts")] },
            { cells: [t("用时／满分", "Time / score"), t("75 分钟／40 分", "75 minutes / 40 points")] },
            { cells: [t("实施", "Delivery"), t("学校组织，个人纸笔作答；允许符合规则的部分计算器", "School-administered, individual paper sitting; some compliant calculators permitted")] },
            { cells: [t("评分", "Marking"), t("完整解答按正确性、完整性、清晰度和表达方式评分；答案正确但论证不清不能获得满分", "Full solutions are judged for correctness, completeness, clarity, and presentation; a poorly presented correct solution may not receive full credit")] },
          ],
        },
      ],
    },
    {
      id: "scope-boundary",
      title: t("内容边界", "Content boundary"),
      bullets: [
        t("CEMC 没有为本项目公布代数、几何、计数等逐项知识清单或题量比例。", "CEMC does not publish a topic-by-topic algebra, geometry, or counting list or fixed allocation for this contest."),
        t("CEMC Courseware 与历年题分别用于课程复习和熟悉解答要求，均不能改写成封闭考纲。", "CEMC Courseware and past papers support curriculum review and response-format familiarity, but neither should be rewritten as a closed syllabus."),
        t("书面表达本身属于被评价的能力：变量定义、推理步骤和结论需要让阅卷者能够跟随。", "Mathematical communication is itself assessed: variables, reasoning steps, and conclusions must be clear enough for a marker to follow."),
      ],
    },
  ],
  sources: [
    {
      title: t("Fryer、Galois 与 Hypatia 官方竞赛页", "Official Fryer, Galois and Hypatia Contest Page"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/contests/fgh",
      format: "webpage",
      version: t("2026–27 竞赛年度", "2026–27 contest year"),
      note: t("年级、书面解答结构、评分要求及官方 Mathematical content 说明。", "Grade placement, written-solution structure, marking requirements, and official Mathematical content statement."),
    },
    {
      title: t("CEMC 9/10/11 年级课程课时与目标表", "CEMC Grade 9/10/11 Courseware Lessons and Goals"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/sites/default/files/documents/2024/AllLessonsWithGoals.pdf",
      format: "pdf",
      note: t("用于按年级查找复习课程，不是本竞赛的正式考纲。", "For locating grade-level review only; not the contest's formal syllabus."),
    },
  ],
  translationNote: t(
    "full-solution 译为“完整解答”，不只是写出计算过程，而是要让论证完整、清楚且组织得当。“共同课程”只给出年级层面的背景范围，不能据此虚构逐知识点清单。",
    "Full-solution means a complete, clear, organized mathematical argument, not merely calculations. The common-curriculum statement is a grade-level content anchor and does not authorize an invented topic checklist.",
  ),
  lastVerified: VERIFIED_AT,
});

const csmcSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-cemc-csmc",
  slug: "csmc-content-framework",
  projectId: "csmc",
  classification: "content-framework",
  title: t("CSMC 内容框架", "CSMC Content Framework"),
  officialName: t("加拿大高级数学竞赛（CSMC）", "Canadian Senior Mathematics Contest (CSMC)"),
  applicableCycle: t("2026–27 CEMC 竞赛年度；专题材料为当前官方版本", "2026–27 CEMC contest year; current official preparation material"),
  status: "confirmed",
  summary: t(
    "CSMC 多数题以中学最后一年及以前的数学课程为基础。CEMC 的共用备赛材料列出八大专题，并明确排除微积分和向量；这些专题是非穷尽的内容框架，不是封闭考纲。",
    "Most CSMC problems draw on mathematics through the final year of secondary school. CEMC's shared preparation material lists eight topics and explicitly excludes calculus and vectors; these topics form a non-exhaustive framework, not a closed syllabus.",
  ),
  facts: [
    { label: t("主要年级", "Primary audience"), value: t("11–12 年级及 CÉGEP；更低年级的有能力学生可参加", "Grades 11–12 and CÉGEP; motivated younger students may participate") },
    { label: t("结构", "Structure"), value: t("9 题：6 题只写答案，3 题完整解答", "9 questions: 6 answer-only and 3 full-solution") },
    { label: t("用时／满分", "Time / score"), value: t("2 小时／60 分", "2 hours / 60 points") },
    { label: t("明确排除", "Explicit exclusions"), value: t("微积分、向量", "Calculus and vectors") },
  ],
  sections: [
    {
      id: "official-course-boundary",
      title: t("官方课程边界", "Official curriculum boundary"),
      bullets: [
        t("竞赛页说明：多数 CSMC 题目以中学最后一年及以前的数学课程为基础。", "The contest page states that most CSMC problems are based on mathematics through the final year of secondary school."),
        t("官方 General Preparation Advice 进一步说明：CSMC 与 Euclid 可使用高中数学各领域的思想，但不包括微积分和向量。", "The official General Preparation Advice adds that CSMC and Euclid may use ideas from all areas of high-school mathematics except calculus and vectors."),
        t("“多数题”与“备赛专题”都不是对每届试题的穷尽承诺。", "Neither ‘most problems’ nor the preparation topics is an exhaustive promise about every annual form."),
      ],
    },
    seniorTopicSection(),
    {
      id: "framework-boundary",
      title: t("八大专题的使用边界", "Limits of the eight-topic framework"),
      bullets: [
        t("工具包涵盖若干重要思想、完整例题、练习题和另附解答。", "Each toolkit provides selected useful ideas, fully worked examples, a practice set, and separate solutions."),
        t("CEMC 明确说明工具包只是简要总结，并不完整覆盖所有可能有用的结果。", "CEMC explicitly says the toolkits are brief summaries and do not completely cover everything that may be useful."),
        t("题目可能把多个专题结合在一起；不能按专题表推定固定题量或权重。", "Problems may combine several topics; the list does not imply fixed item counts or weights."),
        t("Grade 9/10/11 与 Advanced Functions and Pre-Calculus Courseware 是补充讲解资源，而不是新增必考范围。", "Grade 9/10/11 and Advanced Functions and Pre-Calculus Courseware provide supporting explanations, not additional mandatory scope."),
      ],
    },
    {
      id: "contest-format",
      title: t("题型与书面表达", "Question format and mathematical communication"),
      bullets: [
        t("全卷 9 题：Part A 为 6 道只写答案题，Part B 为 3 道完整解答题；难度在 Part A 内递进，进入 Part B 后重新由较直接到较难。", "The paper has 9 questions: Part A contains 6 answer-only questions and Part B contains 3 full-solution questions; difficulty rises through Part A, then resets and rises again through Part B."),
        t("只写答案题若最终答案不正确，相关且清楚的过程仍可能获得部分分。", "Answer-only questions may still receive partial credit for relevant, clear work when the final answer is incorrect."),
        t("完整解答按完整性、清晰度和表达方式评分；变量含义、关键步骤和理由需要写清楚。", "Full solutions are marked for completeness, clarity, and presentation; variables, key steps, and justifications must be clear."),
      ],
    },
  ],
  sources: [
    {
      title: t("CSMC / CIMC 官方竞赛页", "Official CSMC / CIMC Contest Page"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/contests/csimc",
      format: "webpage",
      version: t("2026–27 竞赛年度", "2026–27 contest year"),
      note: t("CSMC 年级、结构、评分与中学最后一年课程定位。", "CSMC audience, structure, marking, and final-year secondary curriculum anchor."),
    },
    {
      title: t("CSMC 与 Euclid 官方备赛材料", "CSMC and Euclid Preparation Material"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/resources/csmc-and-euclid-preparation-material",
      format: "webpage",
      version: t("当前八专题版", "Current eight-topic edition"),
      note: t("八大专题、工具包定位及非穷尽性声明。", "Eight topics, toolkit role, and explicit non-exhaustive statement."),
    },
    {
      title: t("CSMC / Euclid 通用备赛建议", "CSMC / Euclid General Preparation Advice"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/sites/default/files/documents/2024/Advice.pdf",
      format: "pdf",
      version: t("当前官方链接文件", "Current officially linked document"),
      note: t("明确说明使用高中数学各领域，但不包括微积分和向量。", "Explicitly includes high-school mathematics broadly while excluding calculus and vectors."),
    },
  ],
  translationNote: t(
    "八大专题按 CEMC 原题名翻译；Euclidean Geometry 译为“欧几里得几何”，Properties of Numbers 译为“数的性质”。“except for calculus and vectors”按原文明确列为排除项。专题工具包不是正式、穷尽考纲。",
    "The eight topics are translated directly from CEMC titles. The phrase ‘except for calculus and vectors’ is retained as an explicit exclusion. The topic toolkits are not a formal exhaustive syllabus.",
  ),
  lastVerified: VERIFIED_AT,
};

const euclidSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-cemc-euclid",
  slug: "euclid-content-framework",
  projectId: "euclid",
  classification: "content-framework",
  title: t("Euclid 竞赛内容框架", "Euclid Contest Content Framework"),
  officialName: t("Euclid 数学竞赛", "Euclid Contest"),
  applicableCycle: t("2026–27 CEMC 竞赛年度；专题材料为当前官方版本", "2026–27 CEMC contest year; current official preparation material"),
  status: "confirmed",
  summary: t(
    "Euclid 多数题以中学最后一年及以前的课程为基础，少数题可能需要校内课程以外的知识或方法。CEMC 共用备赛材料列出八大专题，并明确排除微积分和向量；该列表不是穷尽考纲。",
    "Most Euclid problems draw on curriculum through the final year of secondary school, while some may require knowledge beyond a student's school curriculum. CEMC lists eight shared preparation topics and explicitly excludes calculus and vectors; the list is not exhaustive.",
  ),
  facts: [
    { label: t("主要年级", "Primary audience"), value: t("中学最后一年或 CÉGEP；更低年级的有能力学生可参加", "Final-year secondary or CÉGEP; motivated younger students may participate") },
    { label: t("结构", "Structure"), value: t("10 题，混合只写答案与完整解答", "10 questions mixing final-answer and full-solution work") },
    { label: t("用时／满分", "Time / score"), value: t("2.5 小时／100 分", "2.5 hours / 100 points") },
    { label: t("明确排除", "Explicit exclusions"), value: t("微积分、向量", "Calculus and vectors") },
  ],
  sections: [
    {
      id: "official-course-boundary",
      title: t("官方课程边界", "Official curriculum boundary"),
      bullets: [
        t("竞赛页说明：多数题目以中学最后一年及以前的课程为基础。", "The contest page says most problems are based on curricula through the final year of secondary school."),
        t("同一页面提醒：个别题目可能要求使用本校课程以外的知识。", "The same page notes that some problems may require knowledge beyond the curriculum in a student's school."),
        t("官方 General Preparation Advice 明确排除微积分和向量，因此“超出本校课程”不能被解释为包含这两项。", "The official General Preparation Advice explicitly excludes calculus and vectors, so ‘beyond the school curriculum’ must not be read as including those two areas."),
      ],
    },
    seniorTopicSection(),
    {
      id: "framework-boundary",
      title: t("八大专题的使用边界", "Limits of the eight-topic framework"),
      bullets: [
        t("每个专题提供常用结果、完整例题、练习题及解答。", "Each topic provides selected useful results, fully worked examples, practice problems, and solutions."),
        t("CEMC 明确说明工具包只是简要总结，不会解释或证明所有结论，也不穷尽一切可能有用的知识。", "CEMC states that toolkits are brief summaries: they do not explain or prove every result and do not exhaust everything that may be useful."),
        t("专题之间可能交叉；八项不是固定分卷，也没有官方题量权重。", "Topics may overlap; they are not separate paper sections and carry no official fixed weights."),
        t("Courseware 用于补充概念解释，不能把课程目录整体改写成 Euclid 必考清单。", "Courseware supplies fuller explanations but its complete lesson list must not be rewritten as an Euclid must-test checklist."),
      ],
    },
    {
      id: "contest-format",
      title: t("题型与完整解答", "Question format and full solutions"),
      bullets: [
        t("全卷 10 题，混合只写答案小问和完整解答小问，题目整体趋向由易到难。", "The paper contains 10 questions mixing final-answer and full-solution parts and generally progresses in difficulty."),
        t("第 9、10 题的 (a) 小问常用于引导理解后续问题，不一定比第 8 题更难。", "Part (a) of Questions 9 and 10 often scaffolds later work and may be easier than Question 8."),
        t("完整解答按完整性、清晰度和表达方式评分；正确答案若缺少清楚论证，不能取得该部分满分。", "Full solutions are assessed for completeness, clarity, and presentation; a correct answer without clear justification cannot earn full credit for such a part."),
      ],
    },
  ],
  sources: [
    {
      title: t("Euclid 官方竞赛页", "Official Euclid Contest Page"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/contests/euclid",
      format: "webpage",
      version: t("2026–27 竞赛年度", "2026–27 contest year"),
      note: t("年级、结构、评分、课程定位及可能超出本校课程的说明。", "Audience, structure, marking, curriculum anchor, and possible beyond-school-curriculum content."),
    },
    {
      title: t("CSMC 与 Euclid 官方备赛材料", "CSMC and Euclid Preparation Material"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/resources/csmc-and-euclid-preparation-material",
      format: "webpage",
      version: t("当前八专题版", "Current eight-topic edition"),
      note: t("八大专题、工具包定位及非穷尽性声明。", "Eight topics, toolkit role, and explicit non-exhaustive statement."),
    },
    {
      title: t("CSMC / Euclid 通用备赛建议", "CSMC / Euclid General Preparation Advice"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/sites/default/files/documents/2024/Advice.pdf",
      format: "pdf",
      version: t("当前官方链接文件", "Current officially linked document"),
      note: t("明确说明使用高中数学各领域，但不包括微积分和向量。", "Explicitly includes high-school mathematics broadly while excluding calculus and vectors."),
    },
  ],
  translationNote: t(
    "“Some problems might require students to use knowledge beyond the curriculum in their school”译为“个别题可能超出本校课程”，但与 General Preparation Advice 合读后，仍明确不含微积分和向量。八大专题是官方备赛框架，不是穷尽考纲。",
    "The possible use of knowledge beyond a student's school curriculum is read together with the General Preparation Advice, which still explicitly excludes calculus and vectors. The eight topics are an official preparation framework, not an exhaustive syllabus.",
  ),
  lastVerified: VERIFIED_AT,
};

const gaussSyllabus: AssessmentSyllabusRecord = {
  id: "syllabus-cemc-gauss",
  slug: "gauss-content-framework",
  projectId: "gauss",
  classification: "content-framework",
  title: t("Gauss 竞赛内容框架", "Gauss Contests Content Framework"),
  officialName: t("Gauss 七、八年级数学竞赛", "Gauss Contests"),
  applicableCycle: t("2026–27 CEMC 竞赛年度", "2026–27 CEMC contest year"),
  status: "confirmed",
  summary: t(
    "Gauss 分七、八年级两份试卷，题目依据加拿大各省共同数学课程。后几题强调巧思和洞察，多数题重在逻辑与解题；CEMC 没有公布逐知识点封闭考纲。",
    "Gauss has separate Grade 7 and Grade 8 papers based on mathematics curriculum common to all Canadian provinces. The final questions emphasize ingenuity and insight, while most problems emphasize logic and problem solving; CEMC publishes no closed topic-by-topic syllabus.",
  ),
  facts: [
    { label: t("年级", "Grades"), value: t("7 年级与 8 年级两份试卷；更低年级学生可参加", "Separate Grade 7 and Grade 8 papers; younger students may participate") },
    { label: t("结构", "Structure"), value: t("25 道选择题", "25 multiple-choice questions") },
    { label: t("用时／满分", "Time / score"), value: t("60 分钟／150 分", "60 minutes / 150 points") },
    { label: t("形式", "Delivery"), value: t("学校组织，个人作答；纸笔或在线；允许符合规则的部分计算器", "School-administered, individual; paper or online; some compliant calculators permitted") },
  ],
  sections: [
    {
      id: "curriculum-position",
      title: t("课程定位", "Curriculum position"),
      bullets: [
        t("两份试卷分别面向 7 年级与 8 年级，低年级有能力学生也可参加。", "The two papers target Grades 7 and 8 respectively, and motivated younger students may participate."),
        t("题目依据加拿大各省共同数学课程，不绑定某一省教材。", "Problems are based on mathematics curriculum common to all Canadian provinces rather than one provincial textbook."),
        t("CEMC 明确指出后几题用于考查巧思和洞察，多数题主要考查逻辑思考与数学解题。", "CEMC explicitly states that the final questions test ingenuity and insight and that most problems emphasize logical thinking and mathematical problem solving."),
      ],
    },
    {
      id: "contest-structure",
      title: t("试卷结构", "Contest structure"),
      tables: [
        {
          columns: [t("项目", "Feature"), t("官方说明", "Official specification")],
          rows: [
            { cells: [t("试卷", "Papers"), t("Grade 7 与 Grade 8 各一份", "Separate Grade 7 and Grade 8 papers")] },
            { cells: [t("题量／题型", "Questions / format"), t("25 道选择题", "25 multiple-choice questions")] },
            { cells: [t("用时／满分", "Time / score"), t("60 分钟／150 分", "60 minutes / 150 points")] },
            { cells: [t("实施", "Delivery"), t("学校组织，纸笔或在线；个人作答", "School-administered, paper or online; individual work")] },
            { cells: [t("计算器", "Calculator"), t("允许符合 CEMC 规则的部分计算器", "Some calculators compliant with CEMC rules are permitted")] },
          ],
        },
      ],
    },
    {
      id: "scope-boundary",
      title: t("内容边界与复习资源", "Content boundary and review resources"),
      bullets: [
        t("官方未公布代数、几何、数据与概率等专题的固定题量或逐项清单。", "CEMC publishes no fixed allocation or exhaustive list for algebra, geometry, data, probability, or other topics."),
        t("CEMC Grade 7/8 Courseware 覆盖加拿大七、八年级常见课程并含拓展，可用于查漏补缺，但不是 Gauss 考纲。", "CEMC Grade 7/8 Courseware covers common Canadian Grade 7–8 curriculum with some extension and can support review, but it is not the Gauss syllabus."),
        t("Problem Set Generator 和历年题用于熟悉题型、难度及时间分配，不能据此断言未来必考范围。", "The Problem Set Generator and past papers support format, difficulty, and time-management practice but cannot establish future mandatory scope."),
      ],
    },
  ],
  sources: [
    {
      title: t("Gauss 官方竞赛页", "Official Gauss Contests Page"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://cemc.uwaterloo.ca/contests/gauss",
      format: "webpage",
      version: t("2026–27 竞赛年度", "2026–27 contest year"),
      note: t("年级、结构、形式、共同课程定位及巧思／解题说明。", "Grades, structure, delivery, common-curriculum anchor, and ingenuity/problem-solving emphasis."),
    },
    {
      title: t("CEMC 七、八年级数学课程", "CEMC Grades 7 & 8 Mathematics Courseware"),
      provider: t("滑铁卢大学 CEMC", "University of Waterloo CEMC"),
      url: "https://courseware.cemc.uwaterloo.ca/27",
      format: "platform",
      note: t("课程复习与拓展资源，不是竞赛考纲。", "Curriculum review and enrichment resource, not a contest syllabus."),
    },
  ],
  translationNote: t(
    "“ingenuity and insight”译为“巧思和洞察”。Grade 7/8 Courseware 的单元名称没有被当作 Gauss 的必考清单；本条只保留 CEMC 官方明确的共同课程定位。",
    "‘Ingenuity and insight’ is translated directly. Grade 7/8 Courseware units are not treated as a Gauss must-test list; this record retains only CEMC's explicit common-curriculum positioning.",
  ),
  lastVerified: VERIFIED_AT,
};

export const cemcCompetitionSyllabi: AssessmentSyllabusRecord[] = [
  euclidSyllabus,
  pcfSyllabus({ id: "syllabus-cemc-pascal", slug: "pascal-content-framework", projectId: "pascal", nameZh: "Pascal", nameEn: "Pascal", grade: "9" }),
  pcfSyllabus({ id: "syllabus-cemc-cayley", slug: "cayley-content-framework", projectId: "cayley", nameZh: "Cayley", nameEn: "Cayley", grade: "10" }),
  pcfSyllabus({ id: "syllabus-cemc-fermat", slug: "fermat-content-framework", projectId: "fermat", nameZh: "Fermat", nameEn: "Fermat", grade: "11" }),
  gaussSyllabus,
  csmcSyllabus,
  fghSyllabus({ id: "syllabus-cemc-fryer", slug: "fryer-content-framework", projectId: "fryer", nameZh: "Fryer", nameEn: "Fryer", grade: "9" }),
  fghSyllabus({ id: "syllabus-cemc-galois", slug: "galois-content-framework", projectId: "galois", nameZh: "Galois", nameEn: "Galois", grade: "10" }),
  fghSyllabus({ id: "syllabus-cemc-hypatia", slug: "hypatia-content-framework", projectId: "hypatia", nameZh: "Hypatia", nameEn: "Hypatia", grade: "11" }),
];
