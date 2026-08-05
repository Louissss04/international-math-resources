import {
  t,
  type AssessmentSyllabusRecord,
  type FactRecord,
  type SyllabusSourceRecord,
} from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";

const fact = (
  labelZh: string,
  labelEn: string,
  valueZh: string,
  valueEn: string,
): FactRecord => ({
  label: t(labelZh, labelEn),
  value: t(valueZh, valueEn),
  status: "confirmed",
});

const row = (...cells: Array<[string, string]>) => ({
  cells: cells.map(([zh, en]) => t(zh, en)),
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
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  format,
  ...(versionZh && versionEn ? { version: t(versionZh, versionEn) } : {}),
});

export const usAssessmentSyllabi: AssessmentSyllabusRecord[] = [
  {
    id: "syllabus-sat-digital-current",
    slug: "sat-digital-current",
    projectId: "sat",
    classification: "formal-specification",
    title: t("SAT 现行数字化考试考纲", "Current Digital SAT Specification"),
    officialName: t("SAT", "SAT"),
    applicableCycle: t(
      "现行数字化 SAT；截至 2026 年 8 月适用于 2026–27 考试周期",
      "Current digital SAT; applicable to the 2026–27 testing cycle as of August 2026",
    ),
    status: "confirmed",
    summary: t(
      "数字化 SAT 由阅读与写作、数学两部分组成。每部分分为两个模块，第二模块的难度路线由考生在第一模块的表现决定。官方内容规范按领域列出考查比例与技能，而不是按教材章节规定授课顺序。",
      "The digital SAT consists of Reading and Writing and Math. Each section has two modules, and performance on the first module determines the difficulty route of the second. The official specification defines domains, testing proportions and skills rather than a required teaching sequence.",
    ),
    facts: [
      fact("考试形式", "Delivery", "Bluebook 数字化机考；分模块自适应", "Digital testing in Bluebook with multistage adaptivity"),
      fact("总作答时间", "Testing time", "134 分钟，另设 10 分钟休息", "134 minutes, plus a 10-minute break"),
      fact("阅读与写作", "Reading and Writing", "64 分钟；54 题；2 个 32 分钟模块", "64 minutes; 54 questions; two 32-minute modules"),
      fact("数学", "Math", "70 分钟；44 题；2 个 35 分钟模块", "70 minutes; 44 questions; two 35-minute modules"),
      fact("计分与试测题", "Operational and pretest items", "阅读与写作 50 道计分题、4 道试测题；数学 40 道计分题、4 道试测题", "Reading and Writing has 50 operational and 4 pretest items; Math has 40 operational and 4 pretest items"),
      fact("内容规范性质", "Nature of specification", "官方考试蓝图：规定内容领域、技能、题量构成与考试结构", "Official test blueprint defining domains, skills, item composition and structure"),
    ],
    sections: [
      {
        id: "sat-structure",
        title: t("考试结构", "Test structure"),
        intro: t(
          "两个部分都先完成第一模块，再进入根据第一模块表现分配的第二模块；两个模块的作答都会计入成绩。",
          "In each section, students complete the first module before entering a second module routed by first-module performance; responses from both modules contribute to the score.",
        ),
        tables: [
          {
            columns: [
              t("部分", "Section"),
              t("时间", "Time"),
              t("模块", "Modules"),
              t("总题量", "Total items"),
              t("计分题／试测题", "Operational / pretest"),
              t("主要作答形式", "Primary response formats"),
            ],
            rows: [
              row(
                ["阅读与写作", "Reading and Writing"],
                ["64 分钟", "64 minutes"],
                ["2 × 32 分钟", "2 × 32 minutes"],
                ["54", "54"],
                ["50／4", "50 / 4"],
                ["四选一选择题；每题对应一段较短文本或文本对", "Four-option multiple choice; each item is tied to a short passage or passage pair"],
              ),
              row(
                ["数学", "Math"],
                ["70 分钟", "70 minutes"],
                ["2 × 35 分钟", "2 × 35 minutes"],
                ["44", "44"],
                ["40／4", "40 / 4"],
                ["选择题与学生填答题", "Multiple-choice and student-produced response items"],
              ),
            ],
            note: t(
              "试测题嵌入正式模块，不单独标记且不计分。",
              "Pretest items are embedded, are not identified to students and do not count toward scores.",
            ),
          },
          {
            title: t("分模块自适应", "Multistage adaptivity"),
            columns: [t("阶段", "Stage"), t("官方设计", "Official design")],
            rows: [
              row(
                ["第一模块", "Module 1"],
                ["包含从易到难的较广题目组合", "Contains a broad mix of questions ranging in difficulty"],
              ),
              row(
                ["第二模块", "Module 2"],
                ["根据第一模块表现进入较高或较低难度路线；两条路线均覆盖规定内容领域", "Routes to a higher- or lower-difficulty form based on Module 1 performance; both routes cover the specified domains"],
              ),
            ],
          },
        ],
      },
      {
        id: "sat-reading-writing-domains",
        title: t("阅读与写作：内容领域与技能", "Reading and Writing: domains and skills"),
        intro: t(
          "下列百分比是阅读与写作计分题的近似分布。",
          "The percentages below are approximate distributions of scored Reading and Writing items.",
        ),
        tables: [
          {
            columns: [t("内容领域", "Domain"), t("约占比", "Approx. share"), t("官方技能", "Official skills")],
            rows: [
              row(
                ["信息与观点", "Information and Ideas"],
                ["约 26%", "Approx. 26%"],
                ["中心思想与细节；证据运用（文本证据、定量证据）；推断", "Central Ideas and Details; Command of Evidence (Textual, Quantitative); Inferences"],
              ),
              row(
                ["修辞与结构", "Craft and Structure"],
                ["约 28%", "Approx. 28%"],
                ["语境中的词义；文本结构与目的；跨文本联系", "Words in Context; Text Structure and Purpose; Cross-Text Connections"],
              ),
              row(
                ["观点表达", "Expression of Ideas"],
                ["约 20%", "Approx. 20%"],
                ["修辞综合；衔接", "Rhetorical Synthesis; Transitions"],
              ),
              row(
                ["标准英语规范", "Standard English Conventions"],
                ["约 26%", "Approx. 26%"],
                ["句界；形式、结构与语义", "Boundaries; Form, Structure, and Sense"],
              ),
            ],
          },
        ],
      },
      {
        id: "sat-reading-writing-design",
        title: t("阅读与写作：命题单位", "Reading and Writing: item design"),
        tables: [
          {
            columns: [t("要素", "Element"), t("规定", "Specification")],
            rows: [
              row(
                ["文本单位", "Text unit"],
                ["一段短文本或一组相关短文本配一道题", "One short passage, or a pair of related short passages, per question"],
              ),
              row(
                ["学科语境", "Disciplinary contexts"],
                ["文学、历史／社会研究、人文与科学", "Literature, history/social studies, the humanities and science"],
              ),
              row(
                ["定量信息", "Quantitative information"],
                ["部分题目将文本与表格、条形图或折线图等信息图结合", "Some items combine text with informational graphics such as tables, bar graphs or line graphs"],
              ),
              row(
                ["答题方式", "Response mode"],
                ["所有题目均为四选一选择题", "All items are four-option multiple-choice questions"],
              ),
            ],
          },
        ],
      },
      {
        id: "sat-math-domains",
        title: t("数学：内容领域与技能", "Math: domains and skills"),
        intro: t(
          "题量范围按 40 道数学计分题计算；百分比为近似值。",
          "Item ranges refer to the 40 scored Math items; percentages are approximate.",
        ),
        tables: [
          {
            columns: [
              t("内容领域", "Domain"),
              t("约占比", "Approx. share"),
              t("计分题量", "Scored items"),
              t("主要技能", "Principal skills"),
            ],
            rows: [
              row(
                ["代数", "Algebra"],
                ["约 35%", "Approx. 35%"],
                ["13–15", "13–15"],
                ["一元线性方程；二元线性方程；线性函数；二元一次方程组；一元或二元线性不等式", "Linear equations in one variable; linear equations in two variables; linear functions; systems of two linear equations in two variables; linear inequalities in one or two variables"],
              ),
              row(
                ["高阶数学", "Advanced Math"],
                ["约 35%", "Approx. 35%"],
                ["13–15", "13–15"],
                ["等价表达式；一元非线性方程与二元非线性方程组；非线性函数", "Equivalent expressions; nonlinear equations in one variable and systems in two variables; nonlinear functions"],
              ),
              row(
                ["问题解决与数据分析", "Problem-Solving and Data Analysis"],
                ["约 15%", "Approx. 15%"],
                ["5–7", "5–7"],
                ["比、率、比例与单位；百分数；一元和二元数据；概率与条件概率；抽样推断、误差范围；观察研究与实验中的统计主张", "Ratios, rates, proportional relationships and units; percentages; one- and two-variable data; probability and conditional probability; sampling inference and margin of error; statistical claims from observational studies and experiments"],
              ),
              row(
                ["几何与三角学", "Geometry and Trigonometry"],
                ["约 15%", "Approx. 15%"],
                ["5–7", "5–7"],
                ["面积与体积；直线、角与三角形；直角三角形与三角学；圆", "Area and volume; lines, angles and triangles; right triangles and trigonometry; circles"],
              ),
            ],
          },
        ],
      },
      {
        id: "sat-math-item-composition",
        title: t("数学：题型与跨领域设计", "Math: item formats and cross-domain design"),
        tables: [
          {
            columns: [t("项目", "Element"), t("官方构成", "Official composition")],
            rows: [
              row(
                ["选择题", "Multiple-choice"],
                ["约占数学题的 75%", "Approximately 75% of Math items"],
              ),
              row(
                ["学生填答题", "Student-produced response"],
                ["约占数学题的 25%；考生自行输入答案", "Approximately 25% of Math items; students enter their own answers"],
              ),
              row(
                ["情境题", "Questions in context"],
                ["约占数学题的 30%，情境涉及科学、社会研究与现实生活", "Approximately 30% of Math items, using science, social studies and real-world contexts"],
              ),
              row(
                ["计算器", "Calculator use"],
                ["数学全程可用 Bluebook 内置计算器或符合规定的自带计算器", "An embedded Bluebook calculator or an approved personal calculator may be used throughout Math"],
              ),
            ],
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "SAT 考试结构",
        "How the SAT Is Structured",
        "College Board",
        "College Board",
        "https://satsuite.collegeboard.org/sat/whats-on-the-test/structure",
        "webpage",
        "2026 年 8 月现行页面",
        "Current page as of August 2026",
      ),
      syllabusSource(
        "SAT 阅读与写作内容规范",
        "Reading and Writing Content Alignment",
        "College Board",
        "College Board",
        "https://satsuite.collegeboard.org/k12-educators/about/alignment/reading",
        "webpage",
        "现行数字化 SAT",
        "Current digital SAT",
      ),
      syllabusSource(
        "SAT 数学内容规范",
        "Math Content Alignment",
        "College Board",
        "College Board",
        "https://satsuite.collegeboard.org/k12-educators/about/alignment/math",
        "webpage",
        "现行数字化 SAT",
        "Current digital SAT",
      ),
    ],
    translationNote: t(
      "本页将 College Board 的 domain 译为“内容领域”，skill/knowledge testing point 按语境译为“技能”或“知识点”；Information and Ideas、Craft and Structure 等官方英文名称同时保留，便于与官方题库筛选项对应。",
      "This page translates domain as 内容领域 and renders skill/knowledge testing point as 技能 or 知识点 according to context. Official English labels such as Information and Ideas and Craft and Structure are retained for direct matching with College Board question-bank filters.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-ap-calculus-2026-27",
    slug: "ap-calculus-2026-27",
    projectId: "ap-calculus",
    classification: "formal-specification",
    title: t("AP Calculus AB/BC 2026–27 课程与考试框架", "AP Calculus AB/BC 2026–27 Course and Exam Framework"),
    officialName: t("AP Calculus AB 与 AP Calculus BC", "AP Calculus AB and AP Calculus BC"),
    applicableCycle: t(
      "2026 年秋季起实施的课程说明；对应 2027 年 5 月考试",
      "Course description effective from fall 2026; applies to the May 2027 exams",
    ),
    status: "confirmed",
    summary: t(
      "AB 与 BC 共用三项核心概念和四项数学实践；AB 包含 8 个单元，BC 在此基础上增加参数方程、极坐标、向量值函数以及无穷数列与级数。2026–27 更新不改变课程内容，但澄清两个知识点，并从 2027 年考试起调整选择题题量和时间。",
      "AB and BC share three Big Ideas and four Mathematical Practices. AB contains eight units; BC adds parametric equations, polar coordinates, vector-valued functions, and infinite sequences and series. The 2026–27 update does not change course content, but clarifies two essential knowledge statements and changes multiple-choice counts and timing beginning with the 2027 exams.",
    ),
    facts: [
      fact("课程范围", "Course scope", "AB 8 个单元；BC 10 个单元", "Eight units in AB; ten units in BC"),
      fact("核心概念", "Big Ideas", "变化、极限、函数分析", "Change, Limits, Analysis of Functions"),
      fact("考试时长", "Exam duration", "3 小时 10 分钟", "3 hours 10 minutes"),
      fact("考试构成", "Exam composition", "42 道选择题占 50%；6 道自由作答题占 50%", "42 multiple-choice questions worth 50%; six free-response questions worth 50%"),
      fact("考试方式", "Delivery", "混合数字化：Bluebook 完成选择题并查看自由作答题；自由作答写在纸质答题册", "Hybrid digital: multiple-choice answers and free-response prompts in Bluebook; free-response answers handwritten in paper booklets"),
      fact("2026–27 变化范围", "Scope of 2026–27 changes", "课程内容未改变；修订两处知识表述并调整 2027 年选择题结构", "No course-content change; two knowledge statements clarified and the 2027 multiple-choice structure revised"),
    ],
    sections: [
      {
        id: "ap-calculus-big-ideas-practices",
        title: t("核心概念与数学实践", "Big Ideas and Mathematical Practices"),
        tables: [
          {
            title: t("核心概念", "Big Ideas"),
            columns: [t("核心概念", "Big Idea"), t("范围", "Scope")],
            rows: [
              row(
                ["变化", "Change"],
                ["用导数、积分及相关表示描述量如何变化以及变化如何累积", "Using derivatives, integrals and related representations to describe how quantities change and how change accumulates"],
              ),
              row(
                ["极限", "Limits"],
                ["用极限处理瞬时变化率、连续性、积分与无穷过程", "Using limits to treat instantaneous rates, continuity, integration and infinite processes"],
              ),
              row(
                ["函数分析", "Analysis of Functions"],
                ["利用函数的表示、导数与积分说明性质、行为和关系", "Using representations, derivatives and integrals to establish properties, behavior and relationships of functions"],
              ),
            ],
          },
          {
            title: t("数学实践", "Mathematical Practices"),
            columns: [t("实践", "Practice"), t("官方含义", "Official meaning")],
            rows: [
              row(["实践 1：实施数学过程", "Practice 1: Implementing Mathematical Processes"], ["选择并执行适当的数学程序", "Selecting and carrying out appropriate mathematical procedures"]),
              row(["实践 2：连接不同表示", "Practice 2: Connecting Representations"], ["在分析式、图像、数表与文字表示之间建立联系", "Connecting analytical, graphical, tabular and verbal representations"]),
              row(["实践 3：论证", "Practice 3: Justification"], ["用定义、定理与数学推理支持结论", "Supporting conclusions with definitions, theorems and mathematical reasoning"]),
              row(["实践 4：表达与符号", "Practice 4: Communication and Notation"], ["正确使用数学语言、符号、单位与书面表达", "Using mathematical language, notation, units and written communication correctly"]),
            ],
          },
        ],
      },
      {
        id: "ap-calculus-units",
        title: t("单元与选择题权重", "Units and multiple-choice weighting"),
        intro: t(
          "权重是各单元在选择题部分的预计占比；“不适用”表示该单元不属于 AB 课程范围。",
          "Weights are the estimated share of the multiple-choice section. “Not applicable” means the unit is outside the AB course scope.",
        ),
        tables: [
          {
            columns: [t("单元", "Unit"), t("AP Calculus AB", "AP Calculus AB"), t("AP Calculus BC", "AP Calculus BC")],
            rows: [
              row(["1 极限与连续性", "1 Limits and Continuity"], ["10–15%", "10–15%"], ["5–10%", "5–10%"]),
              row(["2 微分：定义与基本求导法则", "2 Differentiation: Definition and Basic Derivative Rules"], ["10–15%", "10–15%"], ["5–10%", "5–10%"]),
              row(["3 微分：复合函数、隐函数与反函数", "3 Differentiation: Composite, Implicit, and Inverse Functions"], ["5–10%", "5–10%"], ["5–10%", "5–10%"]),
              row(["4 微分的情境应用", "4 Contextual Applications of Differentiation"], ["10–15%", "10–15%"], ["5–10%", "5–10%"]),
              row(["5 用导数分析函数", "5 Analytical Applications of Differentiation"], ["15–20%", "15–20%"], ["10–15%", "10–15%"]),
              row(["6 积分与变化的累积", "6 Integration and Accumulation of Change"], ["15–20%", "15–20%"], ["15–20%", "15–20%"]),
              row(["7 微分方程", "7 Differential Equations"], ["5–10%", "5–10%"], ["5–10%", "5–10%"]),
              row(["8 积分的应用", "8 Applications of Integration"], ["10–15%", "10–15%"], ["5–10%", "5–10%"]),
              row(["9 参数方程、极坐标与向量值函数", "9 Parametric Equations, Polar Coordinates, and Vector-Valued Functions"], ["不适用", "Not applicable"], ["10–15%", "10–15%"]),
              row(["10 无穷数列与级数", "10 Infinite Sequences and Series"], ["不适用", "Not applicable"], ["15–20%", "15–20%"]),
            ],
          },
        ],
      },
      {
        id: "ap-calculus-practice-weighting",
        title: t("数学实践在考试中的权重", "Weighting of Mathematical Practices"),
        tables: [
          {
            columns: [t("数学实践", "Mathematical Practice"), t("选择题", "Multiple choice"), t("自由作答题", "Free response")],
            rows: [
              row(["1 实施数学过程", "1 Implementing Mathematical Processes"], ["50–70%", "50–70%"], ["35–60%", "35–60%"]),
              row(["2 连接不同表示", "2 Connecting Representations"], ["15–30%", "15–30%"], ["10–20%", "10–20%"]),
              row(["3 论证", "3 Justification"], ["10–20%", "10–20%"], ["35–60%", "35–60%"]),
              row(["4 表达与符号", "4 Communication and Notation"], ["不单独考查", "Not separately assessed"], ["10–25%", "10–25%"]),
            ],
            note: t(
              "各范围反映整份考试中相关实践的预计权重；一道题可以同时涉及多项实践。",
              "Ranges indicate the estimated weighting across the exam; a question may involve more than one practice.",
            ),
          },
        ],
      },
      {
        id: "ap-calculus-2027-exam",
        title: t("2027 年考试结构", "2027 exam structure"),
        intro: t(
          "AB 与 BC 使用相同的分区、时间与题量结构。",
          "AB and BC use the same section, timing and item-count structure.",
        ),
        tables: [
          {
            columns: [t("部分", "Part"), t("题量", "Items"), t("时间", "Time"), t("成绩权重", "Score weight"), t("计算器", "Calculator")],
            rows: [
              row(["选择题 A", "Multiple Choice Part A"], ["29", "29"], ["62 分钟", "62 minutes"], ["35%", "35%"], ["不可使用", "Not permitted"]),
              row(["选择题 B", "Multiple Choice Part B"], ["13", "13"], ["38 分钟", "38 minutes"], ["15%", "15%"], ["必须／允许使用", "Required/permitted"]),
              row(["自由作答 A", "Free Response Part A"], ["2", "2"], ["30 分钟", "30 minutes"], ["16.7%", "16.7%"], ["必须／允许使用", "Required/permitted"]),
              row(["自由作答 B", "Free Response Part B"], ["4", "4"], ["60 分钟", "60 minutes"], ["33.3%", "33.3%"], ["不可使用", "Not permitted"]),
            ],
          },
          {
            title: t("自由作答题命题范围", "Free-response design"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["函数类型", "Function types"], ["代数、指数、对数、三角函数及一般函数", "Algebraic, exponential, logarithmic, trigonometric and general functions"]),
              row(["表示方式", "Representations"], ["分析式、图像、数表与文字", "Analytical, graphical, tabular and verbal"]),
              row(["真实情境", "Real-world contexts"], ["至少两道自由作答题置于真实情境", "At least two free-response questions are set in real-world contexts"]),
              row(["AB/BC 共用题", "Shared AB/BC questions"], ["两科有三道共同的自由作答题", "The two exams share three free-response questions"]),
            ],
          },
        ],
      },
      {
        id: "ap-calculus-2026-clarifications",
        title: t("2026–27 澄清与调整", "2026–27 clarifications and adjustments"),
        tables: [
          {
            columns: [t("位置", "Location"), t("变更", "Change"), t("影响", "Effect")],
            rows: [
              row(
                ["单元 5，FUN-1.C.1", "Unit 5, FUN-1.C.1"],
                ["更新极值定理的表述", "Wording of the Extreme Value Theorem updated"],
                ["澄清知识表述；不增加或删除课程内容", "Clarifies the essential knowledge statement; no content added or removed"],
              ),
              row(
                ["单元 7，FUN-7.B.2", "Unit 7, FUN-7.B.2"],
                ["明确一个微分方程可能有无穷多个解", "Clarifies that infinitely many solutions to a differential equation may exist"],
                ["澄清知识表述；不增加或删除课程内容", "Clarifies the essential knowledge statement; no content added or removed"],
              ),
              row(
                ["选择题 A", "Multiple Choice Part A"],
                ["30 题／60 分钟改为 29 题／62 分钟", "Changed from 30 questions in 60 minutes to 29 questions in 62 minutes"],
                ["自 2027 年 5 月考试起实施", "Effective with the May 2027 exams"],
              ),
              row(
                ["选择题 B", "Multiple Choice Part B"],
                ["15 题／45 分钟改为 13 题／38 分钟", "Changed from 15 questions in 45 minutes to 13 questions in 38 minutes"],
                ["自 2027 年 5 月考试起实施", "Effective with the May 2027 exams"],
              ),
            ],
            note: t(
              "官方澄清文件明确说明课程框架和可考内容没有变化。",
              "The official clarification document states explicitly that the course framework and assessable content are unchanged.",
            ),
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "AP Calculus AB/BC 课程与考试说明",
        "AP Calculus AB and BC Course and Exam Description",
        "College Board",
        "College Board",
        "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-and-bc-course-and-exam-description.pdf?course=ap-calculus-ab",
        "pdf",
        "2026–27 课程与 2027 年考试版本",
        "2026–27 course and 2027 exam version",
      ),
      syllabusSource(
        "AP Calculus AB/BC 课程与考试说明澄清",
        "AP Calculus AB and BC Course and Exam Description Clarifications",
        "College Board",
        "College Board",
        "https://apcentral.collegeboard.org/media/pdf/ap-calculus-ab-bc-course-and-exam-description-clarifications-effective-fall-2026.pdf",
        "pdf",
        "2026 年秋季起生效",
        "Effective fall 2026",
      ),
      syllabusSource(
        "AP Calculus AB 考试说明",
        "AP Calculus AB Exam",
        "College Board",
        "College Board",
        "https://apcentral.collegeboard.org/courses/ap-calculus-ab/exam",
        "webpage",
        "2027 年 5 月考试结构",
        "May 2027 exam structure",
      ),
    ],
    translationNote: t(
      "本页沿用 College Board 的层级：Big Idea 译为“核心概念”，Mathematical Practice 译为“数学实践”，unit 译为“单元”。课程代码 FUN 与英文主题名保留，以便在官方 CED 中定位原文。",
      "This page follows the College Board hierarchy: Big Idea is rendered as 核心概念, Mathematical Practice as 数学实践, and unit as 单元. Course code FUN and English topic names are retained so entries can be located in the official CED.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-act-enhanced-current",
    slug: "act-enhanced-current",
    projectId: "act",
    classification: "formal-specification",
    title: t("Enhanced ACT 现行考试考纲", "Current Enhanced ACT Test Specification"),
    officialName: t("ACT", "ACT"),
    applicableCycle: t(
      "Enhanced ACT；国际考场自 2026 年 2 月起使用，截至 2026 年 8 月为现行结构",
      "Enhanced ACT; used internationally from February 2026 and current as of August 2026",
    ),
    status: "confirmed",
    summary: t(
      "现行 ACT 核心考试包括 English、Math 和 Reading；Science 与 Writing 为选考。Composite Score 由 English、Math、Reading 三科成绩平均得到。各科均可能包含嵌入式试测题，试测题不计分。",
      "The current ACT core test comprises English, Math and Reading; Science and Writing are optional. The Composite Score is the average of the English, Math and Reading scores. Sections may contain embedded field-test items that are not scored.",
    ),
    facts: [
      fact("现行版本", "Current version", "Enhanced ACT；国际考场自 2026 年 2 月起实施", "Enhanced ACT; implemented internationally from February 2026"),
      fact("核心科目", "Core sections", "English、Math、Reading", "English, Math and Reading"),
      fact("选考科目", "Optional sections", "Science、Writing", "Science and Writing"),
      fact("综合分", "Composite Score", "English、Math、Reading 三科 1–36 分成绩的平均值", "Average of the 1–36 scores for English, Math and Reading"),
      fact("核心考试总量", "Core-test total", "131 题，其中 108 道计分题、23 道试测题；125 分钟", "131 items: 108 scored and 23 field-test items; 125 minutes"),
      fact("含 Science", "With Science", "171 题，其中 142 道计分题、29 道试测题；165 分钟", "171 items: 142 scored and 29 field-test items; 165 minutes"),
    ],
    sections: [
      {
        id: "act-scope-scoring",
        title: t("实施范围与计分", "Implementation and scoring"),
        tables: [
          {
            columns: [t("项目", "Element"), t("现行规则", "Current rule")],
            rows: [
              row(["国际考试启用时间", "International implementation"], ["2026 年 2 月起", "From February 2026"]),
              row(["Composite Score", "Composite Score"], ["English、Math、Reading 三科量表分的平均值，范围 1–36", "Average of the English, Math and Reading scale scores, reported from 1–36"]),
              row(["Science", "Science"], ["选考；单独报告 Science 成绩，不计入 Composite Score", "Optional; reported as a separate Science score and excluded from the Composite Score"]),
              row(["STEM Score", "STEM Score"], ["选考 Science 时，根据 Math 与 Science 成绩计算", "Calculated from Math and Science when Science is taken"]),
              row(["Writing", "Writing"], ["选考；单独报告写作成绩，不计入 Composite Score", "Optional; reported separately and excluded from the Composite Score"]),
              row(["试测题", "Field-test items"], ["嵌入各科、不标记且不计分，用于后续命题与研究", "Embedded within sections, unidentified and unscored, for future test development and research"]),
            ],
          },
        ],
      },
      {
        id: "act-structure",
        title: t("考试结构", "Test structure"),
        tables: [
          {
            columns: [t("科目", "Section"), t("时间", "Time"), t("总题量", "Total items"), t("计分题", "Scored items"), t("试测题", "Field-test items"), t("是否必考", "Required?")],
            rows: [
              row(["English", "English"], ["35 分钟", "35 minutes"], ["50", "50"], ["40", "40"], ["10", "10"], ["是", "Yes"]),
              row(["Math", "Math"], ["50 分钟", "50 minutes"], ["45", "45"], ["41", "41"], ["4", "4"], ["是", "Yes"]),
              row(["Reading", "Reading"], ["40 分钟", "40 minutes"], ["36", "36"], ["27", "27"], ["9", "9"], ["是", "Yes"]),
              row(["Science", "Science"], ["40 分钟", "40 minutes"], ["40", "40"], ["34", "34"], ["6", "6"], ["选考", "Optional"]),
              row(["Writing", "Writing"], ["40 分钟", "40 minutes"], ["1 篇作文", "One essay"], ["1 篇作文", "One essay"], ["无", "None"], ["选考", "Optional"]),
            ],
            note: t(
              "表中时间不含报到、说明、休息和行政流程。",
              "Times exclude check-in, instructions, breaks and administrative procedures.",
            ),
          },
        ],
      },
      {
        id: "act-english",
        title: t("English：成绩报告类别与文本构成", "English: reporting categories and passage design"),
        tables: [
          {
            columns: [t("成绩报告类别", "Reporting category"), t("计分题量", "Scored items"), t("占比", "Share"), t("主要内容", "Principal content")],
            rows: [
              row(["写作表达", "Production of Writing"], ["15–17", "15–17"], ["38–43%", "38–43%"], ["主题展开、目的与重点；组织、统一与连贯", "Topic development, purpose and focus; organization, unity and cohesion"]),
              row(["语言知识", "Knowledge of Language"], ["7–9", "7–9"], ["18–23%", "18–23%"], ["清晰、准确地表达观点；文体与语气选择", "Expressing ideas clearly and precisely; style and tone choices"]),
              row(["标准英语规范", "Conventions of Standard English"], ["15–17", "15–17"], ["38–43%", "38–43%"], ["句子结构与构成；用法；标点", "Sentence structure and formation; usage; punctuation"]),
            ],
          },
          {
            title: t("计分文本蓝图", "Scored-passage blueprint"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["文本数量", "Number of passages"], ["5 篇计分文本", "Five scored passages"]),
              row(["长度", "Length"], ["3 篇约 340 词、每篇 10 题；2 篇约 185 词、每篇 5 题", "Three passages of about 340 words with ten items each; two passages of about 185 words with five items each"]),
              row(["文体分布", "Passage types"], ["信息类 2–3 篇、议论类 1–2 篇、叙事类 1 篇", "Two to three informational, one to two argumentative and one narrative passage"]),
              row(["题干", "Item stems"], ["所有题目均使用明确题干", "All items use explicit question stems"]),
            ],
          },
        ],
      },
      {
        id: "act-math",
        title: t("Math：内容类别、题量与范围", "Math: categories, item counts and scope"),
        intro: t(
          "百分比与题量均以 41 道数学计分题为基数。Modeling 是跨类别标记，不能与其他类别相加。",
          "Percentages and counts use the 41 scored Math items as the base. Modeling is a cross-category designation and is not additive to the other categories.",
        ),
        tables: [
          {
            columns: [t("类别", "Category"), t("计分题量", "Scored items"), t("占比", "Share"), t("主要范围", "Principal scope")],
            rows: [
              row(["高等数学准备：数与量", "Preparing for Higher Math: Number & Quantity"], ["4–5", "4–5"], ["10–12%", "10–12%"], ["有理数与无理数、指数与根式、向量与矩阵、复数、量与单位", "Rational and irrational numbers, exponents and radicals, vectors and matrices, complex numbers, quantities and units"]),
              row(["高等数学准备：代数", "Preparing for Higher Math: Algebra"], ["8", "8"], ["20%", "20%"], ["线性、二次、有理式、根式与多项式关系；方程组；等价形式", "Linear, quadratic, rational, radical and polynomial relationships; systems; equivalent forms"]),
              row(["高等数学准备：函数", "Preparing for Higher Math: Functions"], ["8", "8"], ["20%", "20%"], ["函数性质与表示；复合、变换和反函数；数列与级数；三角、指数与对数函数", "Properties and representations; composition, transformations and inverses; sequences and series; trigonometric, exponential and logarithmic functions"]),
              row(["高等数学准备：几何", "Preparing for Higher Math: Geometry"], ["8", "8"], ["20%", "20%"], ["变换、证明与作图；相似、直角三角形与三角学；坐标几何、圆锥曲线、圆及测量", "Transformations, proof and constructions; similarity, right triangles and trigonometry; coordinate geometry, conics, circles and measurement"]),
              row(["高等数学准备：统计与概率", "Preparing for Higher Math: Statistics & Probability"], ["4–5", "4–5"], ["10–12%", "10–12%"], ["单变量与双变量数据、统计推断、概率规则、计数、排列与组合", "Univariate and bivariate data, statistical inference, probability rules, counting, permutations and combinations"]),
              row(["基础技能综合", "Integrating Essential Skills"], ["8", "8"], ["20%", "20%"], ["计算、比例与百分数、简单方程、测量与换算、基础几何、坐标平面及数据概括", "Computation, ratios and percentages, simple equations, measurement and conversion, basic geometry, the coordinate plane and data summaries"]),
              row(["数学建模（跨类别）", "Modeling (cross-category)"], ["至少 8", "At least 8"], ["至少 20%", "At least 20%"], ["建立、解释、比较、评价或改进模型", "Creating, interpreting, comparing, evaluating or improving models"]),
            ],
            note: t(
              "高等数学准备合计 33 题、约 80%；基础技能综合 8 题、约 20%。",
              "Preparing for Higher Math totals 33 items, approximately 80%; Integrating Essential Skills has eight items, approximately 20%.",
            ),
          },
          {
            title: t("现行题型特征", "Current item-design features"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["选项数量", "Answer choices"], ["每题 4 个选项", "Four answer choices per item"]),
              row(["情境题", "Items in context"], ["约占 24–29%", "Approximately 24–29%"]),
              row(["高阶主题", "Advanced topics"], ["约 3 道计分题，约占 7%", "Approximately three scored items, about 7%"]),
            ],
          },
        ],
      },
      {
        id: "act-reading",
        title: t("Reading：成绩报告类别与文本构成", "Reading: reporting categories and passage design"),
        tables: [
          {
            columns: [t("成绩报告类别", "Reporting category"), t("计分题量", "Scored items"), t("占比", "Share"), t("主要内容", "Principal content")],
            rows: [
              row(["核心观点与细节", "Key Ideas and Details"], ["12–14", "12–14"], ["44–52%", "44–52%"], ["中心思想与主题、重要细节、关系、推断与结论", "Central ideas and themes, important details, relationships, inferences and conclusions"]),
              row(["修辞与结构", "Craft and Structure"], ["7–9", "7–9"], ["26–33%", "26–33%"], ["语境词义、文本结构、作者目的与视角", "Word meaning in context, text structure, authorial purpose and perspective"]),
              row(["知识与观点整合", "Integration of Knowledge and Ideas"], ["5–7", "5–7"], ["19–26%", "19–26%"], ["主张与证据、跨文本综合、视觉与定量信息", "Claims and evidence, synthesis across texts, visual and quantitative information"]),
            ],
          },
          {
            title: t("计分文本蓝图", "Scored-passage blueprint"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["文本数量", "Number of passages"], ["3 篇计分文本，每篇 9 题；另嵌入 1 篇试测文本", "Three scored passages with nine items each, plus one embedded field-test passage"]),
              row(["文体", "Passage types"], ["1 篇文学叙事文本、2 篇信息类文本", "One literary narrative and two informational passages"]),
              row(["长度", "Length"], ["2 篇约 750 词、1 篇约 650 词", "Two passages of about 750 words and one of about 650 words"]),
              row(["组合形式", "Configuration"], ["2 篇单篇文本；另有 0–1 组配对文本及 0–1 篇含视觉／定量信息的文本", "Two single passages, with zero to one paired set and zero to one passage containing visual or quantitative information"]),
            ],
          },
        ],
      },
      {
        id: "act-science-writing",
        title: t("选考 Science 与 Writing", "Optional Science and Writing"),
        tables: [
          {
            title: t("Science 成绩报告类别", "Science reporting categories"),
            columns: [t("类别", "Category"), t("计分题量", "Scored items"), t("占比", "Share"), t("主要内容", "Principal content")],
            rows: [
              row(["数据解读", "Interpretation of Data"], ["13–17", "13–17"], ["38–50%", "38–50%"], ["读取图表、识别趋势、插值与外推、比较数据", "Reading graphs and tables, identifying trends, interpolation and extrapolation, comparing data"]),
              row(["科学探究", "Scientific Investigation"], ["6–11", "6–11"], ["18–32%", "18–32%"], ["实验设计、变量与控制、程序比较、预测实验变化", "Experimental design, variables and controls, comparing procedures, predicting effects of experimental changes"]),
              row(["用证据评价科学论证与模型", "Evaluating Scientific Arguments and Models with Evidence"], ["8–13", "8–13"], ["24–38%", "24–38%"], ["评价假设、解释与模型；判断证据是否支持结论；比较不同观点", "Evaluating hypotheses, explanations and models; judging evidential support; comparing competing viewpoints"]),
            ],
          },
          {
            title: t("Science 文本组蓝图", "Science passage-set blueprint"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["计分文本组", "Scored passage sets"], ["6 组，另有 1 组嵌入式试测文本", "Six scored sets plus one embedded field-test set"]),
              row(["形式", "Formats"], ["数据呈现 2 组、研究概述 3 组、观点冲突 1 组", "Two Data Representation, three Research Summaries and one Conflicting Viewpoints set"]),
              row(["主要学科", "Primary disciplines"], ["生物 2 组；地球／空间科学、物理、化学各 1–2 组", "Two biology sets; one to two each in Earth/space science, physics and chemistry"]),
              row(["工程与设计", "Engineering and design"], ["可作为 1–3 组文本的次级学科编码", "May appear as a secondary discipline code in one to three sets"]),
            ],
          },
          {
            title: t("Writing", "Writing"),
            columns: [t("项目", "Element"), t("规定", "Specification")],
            rows: [
              row(["任务", "Task"], ["针对一个复杂议题及三种观点写一篇论证文", "Write an argumentative essay on a complex issue presented with three perspectives"]),
              row(["时间与题量", "Time and task count"], ["40 分钟，1 篇作文", "40 minutes, one essay"]),
              row(["评分维度", "Scoring domains"], ["观点与分析、展开与支持、组织、语言使用与规范", "Ideas and Analysis, Development and Support, Organization, and Language Use and Conventions"]),
              row(["成绩范围", "Score range"], ["2–12 分", "2–12"]),
              row(["计分关系", "Scoring relationship"], ["单独报告，不计入 Composite Score", "Reported separately and excluded from the Composite Score"]),
              row(["Enhanced ACT 调整", "Enhanced ACT change"], ["Writing 任务与时长未因本次改版改变", "The Writing task and timing were unchanged by the enhancement"]),
            ],
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "ACT 考试科目与结构",
        "ACT Exam Sections and Structure",
        "ACT",
        "ACT",
        "https://www.act.org/content/act/en/products-and-services/the-act/test-preparation/act-exam-sections-and-structure.html",
        "webpage",
        "2026 年 8 月现行页面",
        "Current page as of August 2026",
      ),
      syllabusSource(
        "国际 ACT 改版说明",
        "International ACT Enhancements",
        "ACT Global",
        "ACT Global",
        "https://global.act.org/content/global/en/products-and-services/the-act-non-us/test-preparation/test-enhancements.html",
        "webpage",
        "国际考场自 2026 年 2 月起",
        "International administrations from February 2026",
      ),
      syllabusSource(
        "ACT 改版设计框架",
        "Design Framework for the ACT Enhancements",
        "ACT",
        "ACT",
        "https://www.act.org/content/dam/act/unsecured/documents/R2519-Design-Framework-for-the-ACT-Enhancements-2026-02.pdf",
        "pdf",
        "2026 年 2 月",
        "February 2026",
      ),
    ],
    translationNote: t(
      "本页将 reporting category 译为“成绩报告类别”，embedded field-test items 译为“嵌入式试测题”。各占比只按计分题计算；Math 的 Modeling 是跨类别标记，因此不与其他内容类别相加。ACT 官方类别英文名称同时保留。",
      "This page renders reporting category as 成绩报告类别 and embedded field-test items as 嵌入式试测题. Percentages use scored items only. Math Modeling is a cross-category designation and therefore is not added to the other content categories. Official ACT English labels are retained.",
    ),
    lastVerified: VERIFIED_AT,
  },
];
