import { t, type AssessmentSyllabusRecord } from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";

export const otherAssessmentSyllabi: AssessmentSyllabusRecord[] = [
  {
    id: "syllabus-ssat",
    slug: "ssat-content-scope",
    projectId: "ssat",
    classification: "content-framework",
    title: t("SSAT 考试内容范围", "SSAT Test Content"),
    officialName: t("中学入学考试（SSAT）", "Secondary School Admission Test (SSAT)"),
    applicableCycle: t("2026–27 考试年度（现行手册自 2026 年 8 月 3 日起适用）", "2026–27 testing year (current handbook effective from August 3, 2026)"),
    effectiveFrom: "2026-08-03",
    status: "confirmed",
    summary: t(
      "EMA 已公开 SSAT 各等级、分项顺序、题量、用时和主要能力范围。面向中学生的 Middle 与 Upper Level 结构基本相同，写作题提示略有区别。",
      "EMA publishes the SSAT levels, section order, item counts, timings, and principal skill domains. The Middle and Upper Level structures are substantially the same, with a small difference in writing-prompt choices.",
    ),
    facts: [
      { label: t("等级", "Levels"), value: t("Elementary：在读 3–4 年级；Middle：5–7 年级；Upper：8–11 年级", "Elementary: current grades 3–4; Middle: grades 5–7; Upper: grades 8–11") },
      { label: t("Middle / Upper 总用时", "Middle / Upper total duration"), value: t("3 小时 10 分钟，含两次各 10 分钟休息", "3 hours 10 minutes, including two 10-minute breaks") },
      { label: t("计分分项", "Scored sections"), value: t("数学、阅读、词汇推理", "Quantitative, Reading, and Verbal") },
      { label: t("计算器", "Calculator"), value: t("数学部分不得使用", "Not permitted in the Quantitative sections") },
    ],
    sections: [
      {
        id: "ssat-levels",
        title: t("等级与适用年级", "Levels and grade placement"),
        intro: t("SSAT 等级按考生当前就读年级确定。下表中的详细结构适用于国际学校申请中最常见的 Middle 与 Upper Level。", "The SSAT level is based on the student's current grade. The detailed structure below covers the Middle and Upper Levels most commonly used in secondary-school applications."),
        tables: [
          {
            columns: [t("等级", "Level"), t("当前年级", "Current grade"), t("官方定位", "Official placement")],
            rows: [
              { cells: [t("Elementary", "Elementary"), t("3–4 年级", "Grades 3–4"), t("小学阶段入学评估", "Elementary-school admission assessment")] },
              { cells: [t("Middle", "Middle"), t("5–7 年级", "Grades 5–7"), t("中学低年级申请", "Middle-school admission")] },
              { cells: [t("Upper", "Upper"), t("8–11 年级", "Grades 8–11"), t("高中阶段申请", "Upper-school admission")] },
            ],
          },
        ],
      },
      {
        id: "ssat-structure",
        title: t("Middle / Upper Level 结构", "Middle / Upper Level structure"),
        tables: [
          {
            columns: [t("顺序", "Order"), t("分项", "Section"), t("题量", "Items"), t("用时", "Time"), t("是否计分", "Scored")],
            rows: [
              { cells: [t("1", "1"), t("写作样本", "Writing Sample"), t("1 篇", "1 response"), t("25 分钟", "25 minutes"), t("否；随成绩报告送交学校", "No; sent to score recipients")] },
              { cells: [t("2", "2"), t("休息", "Break"), t("—", "—"), t("10 分钟", "10 minutes"), t("—", "—")] },
              { cells: [t("3", "3"), t("数学一", "Quantitative 1"), t("25 题", "25 items"), t("30 分钟", "30 minutes"), t("是", "Yes")] },
              { cells: [t("4", "4"), t("阅读", "Reading"), t("40 题", "40 items"), t("40 分钟", "40 minutes"), t("是", "Yes")] },
              { cells: [t("5", "5"), t("休息", "Break"), t("—", "—"), t("10 分钟", "10 minutes"), t("—", "—")] },
              { cells: [t("6", "6"), t("词汇推理", "Verbal"), t("60 题", "60 items"), t("30 分钟", "30 minutes"), t("是", "Yes")] },
              { cells: [t("7", "7"), t("数学二", "Quantitative 2"), t("25 题", "25 items"), t("30 分钟", "30 minutes"), t("是", "Yes")] },
              { cells: [t("8", "8"), t("实验题", "Experimental"), t("16 题", "16 items"), t("15 分钟", "15 minutes"), t("否", "No")] },
            ],
          },
        ],
      },
      {
        id: "ssat-domains",
        title: t("题型与能力范围", "Item types and skill domains"),
        tables: [
          {
            columns: [t("分项", "Section"), t("官方公开范围", "Published scope")],
            rows: [
              { cells: [t("数学", "Quantitative"), t("算术、初等代数、几何及其他数量概念；两部分各 25 题，不使用计算器", "Arithmetic, elementary algebra, geometry, and other quantitative concepts; two 25-item sections without a calculator")] },
              { cells: [t("阅读", "Reading"), t("250–350 词的叙事或议论文本；文学、人文、科学、社会研究；考查主旨、细节、推断、语境词义、作者目的、态度与语气、观点与论证、预测", "Narrative or argumentative passages of 250–350 words from literary fiction, humanities, science, and social studies; main idea, details, inference, vocabulary in context, purpose, attitude and tone, opinions and arguments, and prediction")] },
              { cells: [t("词汇推理", "Verbal"), t("30 道同义词题与 30 道类比题；考查词汇、逻辑关系和概念关联", "30 synonym and 30 analogy items assessing vocabulary, logical relationships, and connections between ideas")] },
              { cells: [t("写作样本", "Writing Sample"), t("Middle：故事开头或个人问题二选一；Upper：个人问题或一般性问题二选一", "Middle: choose a creative story starter or personal question; Upper: choose a personal or general question")] },
            ],
          },
        ],
      },
      {
        id: "ssat-unscored",
        title: t("不计分内容与公开范围边界", "Unscored content and publication boundary"),
        bullets: [
          t("写作样本不计入分数，但会原样提供给考生指定的学校，用于观察写作表达。", "The writing sample is unscored but is provided to designated schools for their review of the student's writing."),
          t("实验部分含 6 道词汇、5 道阅读和 5 道数学题，用于检验未来试题，不计分也不报告。", "The experimental section contains 6 verbal, 5 reading, and 5 quantitative items for future test development; it is neither scored nor reported."),
          t("官方公开的是能力领域和题型，不是逐知识点的学校课程清单。", "The official publication defines skill domains and item types, not a school-curriculum checklist of every possible topic."),
        ],
      },
    ],
    sources: [
      {
        title: t("SSAT 官方说明", "About the SSAT"),
        provider: t("Enrollment Management Association", "Enrollment Management Association"),
        url: "https://www.admission.org/assessments/ssat/about-the-ssat",
        format: "webpage",
        version: t("2026–27 现行页面", "Current 2026–27 page"),
        note: t("等级、考试年度及现行手册入口。", "Levels, testing year, and current handbook link."),
      },
      {
        title: t("Middle Level SSAT 考试内容", "What's on the Middle Level SSAT?"),
        provider: t("Enrollment Management Association", "Enrollment Management Association"),
        url: "https://www.admission.org/help/whats-on-the-middle-level-ssat",
        format: "webpage",
        version: t("2026 年 7 月 24 日更新", "Updated July 24, 2026"),
      },
      {
        title: t("Upper Level SSAT 考试内容", "What's on the Upper Level SSAT?"),
        provider: t("Enrollment Management Association", "Enrollment Management Association"),
        url: "https://www.admission.org/help/whats-on-the-upper-level-ssat",
        format: "webpage",
        version: t("2026 年 7 月 24 日更新", "Updated July 24, 2026"),
      },
      {
        title: t("SSAT 考生手册", "SSAT Candidate Handbook"),
        provider: t("Enrollment Management Association", "Enrollment Management Association"),
        url: "https://5232910.fs1.hubspotusercontent-na1.net/hubfs/5232910/website_files/ssat/SSAT%20Candidate%20Handbook.pdf",
        format: "pdf",
        version: t("2026–2027 V1；自 2026 年 8 月 3 日起适用", "2026–2027 V1; effective August 3, 2026"),
      },
    ],
    translationNote: t(
      "Quantitative 译为“数学（数量推理）”，Verbal 译为“词汇推理”。官方所称 virtually unspeeded 表示多数学生有足够作答时间，并非不限时。内容范围按 EMA 原文归纳，未加入培训机构的知识点清单。",
      "Quantitative is rendered as Mathematics (Quantitative Reasoning), and Verbal as Verbal Reasoning. EMA's phrase ‘virtually unspeeded’ means most students have adequate time, not that the test is untimed. No third-party curriculum list has been added.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-isee",
    slug: "isee-content-scope",
    projectId: "isee",
    classification: "content-framework",
    title: t("ISEE 考试内容范围", "ISEE Test Content"),
    officialName: t("独立学校入学考试（ISEE）", "Independent School Entrance Exam (ISEE)"),
    applicableCycle: t("现行 ISEE 考试结构；2026 年 8 月核验", "Current ISEE structure; verified August 2026"),
    status: "confirmed",
    summary: t(
      "ERB 公开了各等级的分项、题量、用时和能力范围。申请 5–12 年级的 Lower、Middle、Upper Level 均含词汇推理、数量推理、阅读理解、数学成就和一篇不计分作文。",
      "ERB publishes section names, item counts, timings, and skill domains for each level. Lower, Middle, and Upper Levels for entry to grades 5–12 contain Verbal Reasoning, Quantitative Reasoning, Reading Comprehension, Mathematics Achievement, and an unscored essay.",
    ),
    facts: [
      { label: t("等级依据", "Level rule"), value: t("按申请入读的年级，而非当前年级", "Based on the grade applied to, not the student's current grade") },
      { label: t("考试形式", "Delivery"), value: t("线上与纸笔；题量和用时相同", "Online and paper; identical item counts and timing") },
      { label: t("答错扣分", "Wrong-answer penalty"), value: t("无", "None") },
      { label: t("作文", "Essay"), value: t("30 分钟，不计分，送交指定学校", "30 minutes, unscored, sent to designated schools") },
    ],
    sections: [
      {
        id: "isee-levels-structure",
        title: t("等级、题量与用时", "Levels, item counts, and timing"),
        intro: t("下表为面向申请 5–12 年级学生的三个等级；休息时间另计。", "The table covers the three levels used for entry to grades 5–12; breaks are additional."),
        tables: [
          {
            columns: [t("等级", "Level"), t("申请年级", "Applying to"), t("词汇推理", "Verbal Reasoning"), t("数量推理", "Quantitative Reasoning"), t("阅读理解", "Reading Comprehension"), t("数学成就", "Mathematics Achievement"), t("作文", "Essay"), t("总用时", "Total time")],
            rows: [
              { cells: [t("Lower", "Lower"), t("5–6 年级", "Grades 5–6"), t("34 题 / 20 分钟", "34 / 20 min"), t("38 题 / 35 分钟", "38 / 35 min"), t("25 题 / 25 分钟", "25 / 25 min"), t("30 题 / 30 分钟", "30 / 30 min"), t("1 题 / 30 分钟", "1 / 30 min"), t("2 小时 20 分钟，另加两次 5–10 分钟休息", "2 hr 20 min, plus two 5–10 min breaks")] },
              { cells: [t("Middle", "Middle"), t("7–8 年级", "Grades 7–8"), t("40 题 / 20 分钟", "40 / 20 min"), t("37 题 / 35 分钟", "37 / 35 min"), t("36 题 / 35 分钟", "36 / 35 min"), t("47 题 / 40 分钟", "47 / 40 min"), t("1 题 / 30 分钟", "1 / 30 min"), t("2 小时 40 分钟，另加两次 5–10 分钟休息", "2 hr 40 min, plus two 5–10 min breaks")] },
              { cells: [t("Upper", "Upper"), t("9–12 年级", "Grades 9–12"), t("40 题 / 20 分钟", "40 / 20 min"), t("37 题 / 35 分钟", "37 / 35 min"), t("36 题 / 35 分钟", "36 / 35 min"), t("47 题 / 40 分钟", "47 / 40 min"), t("1 题 / 30 分钟", "1 / 30 min"), t("2 小时 40 分钟，另加两次 5–10 分钟休息", "2 hr 40 min, plus two 5–10 min breaks")] },
            ],
          },
        ],
      },
      {
        id: "isee-language",
        title: t("词汇与阅读", "Verbal and reading"),
        tables: [
          {
            columns: [t("分项", "Section"), t("题型", "Item types"), t("能力范围", "Skills assessed")],
            rows: [
              { cells: [t("词汇推理", "Verbal Reasoning"), t("同义词、句子填空", "Synonyms and sentence completions"), t("词汇知识与语言推理", "Vocabulary knowledge and verbal reasoning")] },
              { cells: [t("阅读理解", "Reading Comprehension"), t("文章及配套选择题", "Passages with selected-response items"), t("主旨、支撑信息、推断、语境词义、篇章组织与逻辑、语气、风格、视角和修辞语言", "Main and supporting ideas, inference, vocabulary in context, organization and logic, tone, style, point of view, and figurative language")] },
            ],
          },
        ],
      },
      {
        id: "isee-mathematics",
        title: t("数量推理与数学成就", "Quantitative Reasoning and Mathematics Achievement"),
        paragraphs: [
          t("数量推理考查如何运用数学理解解决问题，可能涉及估算、逻辑、数量比较、数据分析、图表解释、测量和统计；官方说明这部分通常只需少量或无需计算。", "Quantitative Reasoning assesses how students use mathematical understanding to approach problems, including estimation, logic, quantitative comparison, data analysis, graphical information, measurement, and statistics; ERB says little or no calculation is generally required."),
          t("数学成就考查识别并解决与 NCTM 领域相关的问题：数与运算、代数、几何、测量、数据分析与概率、问题解决。该部分可能需要计算，并可能使用相应数学术语。", "Mathematics Achievement assesses problems linked to NCTM strands: numbers and operations, algebra, geometry, measurement, data analysis and probability, and problem solving. Calculations and knowledge of relevant mathematical terminology may be required."),
        ],
      },
      {
        id: "isee-essay-boundary",
        title: t("作文、计分与规范边界", "Essay, scoring, and specification boundary"),
        bullets: [
          t("作文题按考试日期随机抽取，题目与相应年级相关，主要让学校了解考生如何组织思想并进行书面表达。", "The essay prompt is randomly selected for a test date, is age-appropriate, and lets schools review how the student organizes and expresses ideas."),
          t("作文不计入四个选择题分项的成绩；家庭不获得作文副本，仅指定学校收到。", "The essay is not included in the four selected-response section scores; families do not receive a copy, while designated schools do."),
          t("每个选择题分项含少量不计分的试测题；具体位置不会标明。", "Each selected-response section contains several unscored field-test items whose locations are not identified."),
          t("ERB 每年推出新试卷，但按统一的内容和难度规范组卷；官方公开范围不是逐题知识点清单。", "ERB introduces new forms each year but assembles them to common content and difficulty specifications; the public scope is not an exhaustive item-by-item curriculum list."),
        ],
      },
    ],
    sources: [
      {
        title: t("ISEE 官方说明与考试结构", "ISEE by ERB Overview and Structure"),
        provider: t("ERB", "ERB"),
        url: "https://www.erblearn.org/families/isee-by-erb/",
        format: "webpage",
        version: t("2026 年 8 月现行页面", "Current page, August 2026"),
        note: t("等级、题量、用时、形式及重考季节。", "Levels, item counts, timing, delivery, and testing seasons."),
      },
      {
        title: t("ISEE 成绩报告与能力说明", "ISEE Score Reports and Skills Assessed"),
        provider: t("ERB", "ERB"),
        url: "https://www.erblearn.org/families/isee-by-erb/score-reports/",
        format: "webpage",
        note: t("各分项题型、NCTM 数学领域、作文用途及试卷等值说明。", "Section item types, NCTM mathematics strands, essay use, and form-equating information."),
      },
      {
        title: t("ISEE 官方备考与 What to Expect 指南入口", "ISEE Preparation and What to Expect Guides"),
        provider: t("ERB", "ERB"),
        url: "https://www.erblearn.org/families/isee-preparation/",
        format: "webpage",
        note: t("官方样题和各等级指南入口；本页未把商业练习课程写入考试范围。", "Official sample and level-guide entry point; commercial practice content is not treated here as test specification."),
      },
    ],
    translationNote: t(
      "Quantitative Reasoning 译为“数量推理”，Mathematics Achievement 译为“数学成就”，两者不得合并：前者侧重数学思维，后者侧重已学数学知识和运算。NCTM 领域按 ERB 官方页面译出。",
      "Quantitative Reasoning and Mathematics Achievement are kept distinct: the former emphasizes mathematical thinking, while the latter emphasizes learned mathematical knowledge and computation. NCTM strands are translated from ERB's official page.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-ukiset",
    slug: "ukiset-content-scope",
    projectId: "ukiset",
    classification: "structure-only",
    title: t("UKiset 公开考试范围", "Published UKiset Test Scope"),
    officialName: t("英国独立学校入学测试（UKiset）", "UK Independent Schools' Entry Test (UKiset)"),
    applicableCycle: t("现行线上考试结构；2026 年 8 月核验", "Current online test structure; verified August 2026"),
    status: "confirmed",
    summary: t(
      "UKiset 官网公开了三部分结构、用时和宽泛能力领域，但没有公开固定题量、逐知识点课程范围或完整官方样卷。因此本条按“仅结构”收录。",
      "UKiset publishes the three-part structure, timings, and broad skill domains, but not fixed item counts, an exhaustive curriculum specification, or a full official practice paper. It is therefore classified as structure-only.",
    ),
    facts: [
      { label: t("适用年龄", "Age range"), value: t("9.5–18 岁", "9.5–18 years") },
      { label: t("形式", "Delivery"), value: t("自适应线上入学测试；通常在线监考", "Adaptive online admissions assessment, usually remotely invigilated") },
      { label: t("分项用时", "Published section time"), value: t("推理 40–45 分钟；英语 60–90 分钟；作文 30 分钟", "Reasoning 40–45 minutes; English 60–90 minutes; essay 30 minutes") },
      { label: t("公开题量", "Published item count"), value: t("未公布固定题量", "No fixed item count published") },
    ],
    sections: [
      {
        id: "ukiset-public-boundary",
        title: t("公开资料能确认什么", "What the public material establishes"),
        bullets: [
          t("UKiset 是面向国际学生申请英国独立学校的英语在线评估，比较同龄英国学生的表现。", "UKiset is an English-language online assessment for international applicants to UK independent schools and compares performance with same-age British students."),
          t("官网公开推理、英语阅读与听力、英语写作三部分，但未公开完整题库蓝图或固定题量。", "The website publishes Reasoning, English Reading and Listening, and English Writing sections, but no full item-pool blueprint or fixed item count."),
          t("官网说明没有公开的官方试卷或模拟卷；官方个性化辅导内容不能视为考试考纲。", "The official site states that no public official papers or mock tests are available; the scope of personalized tutoring is not an examination syllabus."),
        ],
      },
      {
        id: "ukiset-structure",
        title: t("考试结构", "Test structure"),
        tables: [
          {
            columns: [t("部分", "Part"), t("用时", "Time"), t("公开内容", "Published content"), t("形式与要求", "Delivery and requirements")],
            rows: [
              { cells: [t("1. 推理测试", "1. Reasoning Test"), t("40–45 分钟", "40–45 minutes"), t("词汇、数学、非语言图形推理", "Verbal, mathematical, and non-verbal processing"), t("在线；可用白纸和笔演算", "Online; blank paper and a pen may be used for working")] },
              { cells: [t("2. 英语测试", "2. English Test"), t("60–90 分钟；官网提示约 80 分钟", "60–90 minutes; candidate guidance says about 80 minutes"), t("英语阅读与听力", "English reading and listening"), t("在线；需要耳机", "Online; headphones required")] },
              { cells: [t("3. 英语作文", "3. English Essay"), t("30 分钟", "30 minutes"), t("说明性作文；表达、结构、拼写、标点与语法", "Expository essay; expression, structure, spelling, punctuation, and grammar"), t("手写，使用有横线纸和黑色或蓝色笔", "Handwritten on lined paper in black or blue ink")] },
            ],
            note: t("三部分公开用时相加为 130–165 分钟；官方 Welcome Guide 建议为含身份核验和监考设置在内的完整流程预留约 3 小时。", "Published section timings sum to 130–165 minutes; the official Welcome Guide advises allowing about three hours for the full process including checks and invigilation setup."),
          },
        ],
      },
      {
        id: "ukiset-domains",
        title: t("官网公开的能力领域", "Published skill domains"),
        tables: [
          {
            columns: [t("领域", "Domain"), t("官方描述", "Official description")],
            rows: [
              { cells: [t("词汇", "Vocabulary"), t("识别单词及其含义", "Recognizing words and their meanings")] },
              { cells: [t("数学", "Mathematics"), t("数字、数值与数列关系", "Working with numbers, value, and sequences")] },
              { cells: [t("非语言推理", "Non-verbal reasoning"), t("使用图片、图表和图形规律解决问题", "Solving problems using pictures, diagrams, and patterns")] },
              { cells: [t("英语阅读与听力", "English reading and listening"), t("在线英语理解测试；报告给出 CEFR 等级", "Online English-comprehension assessment reported with a CEFR level")] },
              { cells: [t("英语写作", "English writing"), t("说明性手写作文；关注表达、结构、拼写、标点和语法", "Handwritten expository essay focusing on expression, organization, spelling, punctuation, and grammar")] },
            ],
          },
        ],
      },
      {
        id: "ukiset-report-rules",
        title: t("成绩呈现与考试限制", "Reporting and test restrictions"),
        bullets: [
          t("推理报告分别给出词汇、非语言和数学的标准分、全国百分位与九分位，并同时给出包含和不包含词汇分的平均值。", "The reasoning report gives standardized scores, national percentiles, and stanines for verbal, non-verbal, and mathematics, plus averages with and without the verbal result."),
          t("英语部分报告 CEFR 等级和原始分；手写作文仅在学校版报告中提供。", "The English component reports a CEFR level and raw score; the handwritten essay appears in the school report."),
          t("考试全程禁止使用手机、计算器、词典和翻译工具。", "Mobile phones, calculators, dictionaries, and translation tools are prohibited throughout the assessment."),
          t("推理测试没有统一的及格线；学校可将报告用于筛选，也可另行安排校内考试或面试。", "The reasoning test has no universal pass mark; schools may use the report for screening and may add their own tests or interviews."),
        ],
      },
    ],
    sources: [
      {
        title: t("UKiset 官方说明", "About UKiset"),
        provider: t("UKiset", "UKiset"),
        url: "https://ukiset.com/about-ukiset/",
        format: "webpage",
        note: t("适用年龄、四类宽泛技能和当前英语报告说明。", "Age range, four broad skills, and current English reporting description."),
      },
      {
        title: t("UKiset 考试实施与分项结构", "UKiset Test Administration"),
        provider: t("UKiset", "UKiset"),
        url: "https://ukiset.com/test-administration/",
        format: "webpage",
        note: t("三部分用时、形式、设备和作文要求。", "Three-part timings, delivery, equipment, and essay requirements."),
      },
      {
        title: t("UKiset 学校与家长报告", "UKiset School and Parent Report"),
        provider: t("UKiset", "UKiset"),
        url: "https://ukiset.com/school-parent-report/",
        format: "webpage",
        note: t("标准分、百分位、九分位、CEFR 与作文的报告方式。", "Standard scores, percentiles, stanines, CEFR, and essay reporting."),
      },
      {
        title: t("UKiset 2025 考生指南", "UKiset Welcome Guide 2025"),
        provider: t("UKiset", "UKiset"),
        url: "https://ukiset.com/wp-content/uploads/2025/09/UKiset-Welcome-Guide-2025.pdf",
        format: "pdf",
        version: t("2025 版", "2025 edition"),
      },
      {
        title: t("UKiset 考试流程与考场用品限制", "UKiset Process and Test-day Restrictions"),
        provider: t("UKiset", "UKiset"),
        url: "https://ukiset.com/the-process/",
        format: "webpage",
        note: t("证件、文具及手机、计算器、词典禁用规则。", "Identification, stationery, and restrictions on phones, calculators, and dictionaries."),
      },
    ],
    translationNote: t(
      "UKiset 当前官网在不同页面分别使用 CEST 和 Cambridge English Linguaskill 称呼英语阅读与听力模块；为避免把平台名称差异误写成考试范围变化，正文统一称“Cambridge English 英语阅读与听力模块”。Mathematics 在此是数字关系推理，并非公开的学校数学课程考纲。",
      "Current UKiset pages use both CEST and Cambridge English Linguaskill for the English reading/listening component. To avoid treating a platform-label difference as a content change, the record uses the generic label ‘Cambridge English reading and listening module.’ Mathematics here is numerical-relation reasoning, not a published school-mathematics syllabus.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-toefl-ibt",
    slug: "toefl-ibt-2026-content-scope",
    projectId: "toefl-ibt",
    classification: "formal-specification",
    title: t("TOEFL iBT 2026 新版考试内容", "TOEFL iBT 2026 Test Content"),
    officialName: t("托福网考（TOEFL iBT）", "TOEFL iBT Test"),
    applicableCycle: t("2026 年 1 月 21 日起的现行版本", "Current version from January 21, 2026"),
    effectiveFrom: "2026-01-21",
    status: "confirmed",
    summary: t(
      "2026 新版 TOEFL iBT 保留听、说、读、写四项，但题型已全面调整。阅读和听力采用两阶段自适应，写作和口语为线性测试；成绩采用 1–6 分制，每 0.5 分一档。",
      "The 2026 TOEFL iBT retains Reading, Listening, Writing, and Speaking but uses a substantially revised task set. Reading and Listening are two-stage adaptive; Writing and Speaking are linear. Scores use a 1–6 scale in half-point increments.",
    ),
    facts: [
      { label: t("生效日期", "Effective date"), value: t("2026 年 1 月 21 日", "January 21, 2026") },
      { label: t("四项题量", "Section item counts"), value: t("阅读 50；听力 47；写作 12；口语 11", "Reading 50; Listening 47; Writing 12; Speaking 11") },
      { label: t("预计分项用时", "Estimated section time"), value: t("阅读 30 分钟；听力 29 分钟；写作 23 分钟；口语 8 分钟", "Reading 30 min; Listening 29 min; Writing 23 min; Speaking 8 min") },
      { label: t("完整流程", "Full appointment"), value: t("官方建议预留约 2 小时；自适应模块使题量和用时可能略有变化", "Allow about 2 hours; adaptive routing may cause small variation in item count and time") },
    ],
    sections: [
      {
        id: "toefl-overview",
        title: t("四项结构", "Four-section structure"),
        tables: [
          {
            columns: [t("分项", "Section"), t("题量", "Items"), t("预计用时", "Estimated time"), t("主要任务", "Task families")],
            rows: [
              { cells: [t("阅读", "Reading"), t("50", "50"), t("约 30 分钟", "About 30 minutes"), t("补全单词、日常文本阅读、学术文章阅读", "Complete the Words, Read in Daily Life, Read an Academic Passage")] },
              { cells: [t("听力", "Listening"), t("47", "47"), t("约 29 分钟", "About 29 minutes"), t("听并选择回应、对话、公告、学术讲座", "Listen and Choose a Response, Conversation, Announcement, Academic Talk")] },
              { cells: [t("写作", "Writing"), t("12", "12"), t("约 23 分钟", "About 23 minutes"), t("完成句子、邮件、学术讨论", "Build a Sentence, Email, Academic Discussion")] },
              { cells: [t("口语", "Speaking"), t("11", "11"), t("约 8 分钟", "About 8 minutes"), t("听后复述、面试回答", "Listen and Repeat, Interview")] },
            ],
            note: t("表内用时不含模块说明。ETS 中文官网建议为完整测试预留约 2 小时。", "Times exclude section directions. ETS advises allowing about two hours for the full test experience."),
          },
        ],
      },
      {
        id: "toefl-receptive",
        title: t("阅读与听力", "Reading and Listening"),
        tables: [
          {
            columns: [t("分项", "Section"), t("任务", "Task"), t("目标题量", "Target items"), t("能力范围", "Skills")],
            rows: [
              { cells: [t("阅读", "Reading"), t("补全单词", "Complete the Words"), t("30", "30"), t("词序、词汇、词形和语法线索，补全有意义的学术文本", "Word order, vocabulary, morphology, and syntax used to reconstruct meaningful academic text")] },
              { cells: [t("阅读", "Reading"), t("日常文本阅读", "Read in Daily Life"), t("5–15", "5–15"), t("标识、菜单、邮件、社交媒体等简短非学术文本", "Short non-academic formats such as signs, menus, email, and social posts")] },
              { cells: [t("阅读", "Reading"), t("学术文章阅读", "Read an Academic Passage"), t("5–15", "5–15"), t("主旨、关键细节、推断、观点关系和篇章修辞结构", "Main ideas, key details, inference, relationships among ideas, and rhetorical structure")] },
              { cells: [t("听力", "Listening"), t("听并选择适当回应", "Listen and Choose a Response"), t("15–19", "15–19"), t("理解单轮日常对话并选出恰当回应", "Understanding a single conversational exchange and choosing an appropriate response")] },
              { cells: [t("听力", "Listening"), t("听对话", "Listen to a Conversation"), t("10", "10"), t("理解两人短对话", "Understanding short two-person conversations")] },
              { cells: [t("听力", "Listening"), t("听公告", "Listen to an Announcement"), t("6–10", "6–10"), t("理解课堂或校园事务公告", "Understanding classroom or campus-related announcements")] },
              { cells: [t("听力", "Listening"), t("听学术讲座", "Listen to an Academic Talk"), t("8–16", "8–16"), t("主旨、支撑信息、推断、语用目的、较少见或习语词汇", "Main and supporting ideas, inference, speaker purpose, and less common or idiomatic vocabulary")] },
            ],
            note: t("阅读和听力均为两阶段自适应；各任务题量可随分流模块变化，但分项总题量以当前官网为准。", "Reading and Listening are two-stage adaptive; task-level counts vary by route while current public section totals remain the controlling reference."),
          },
        ],
      },
      {
        id: "toefl-productive",
        title: t("写作与口语", "Writing and Speaking"),
        tables: [
          {
            columns: [t("分项", "Section"), t("任务", "Task"), t("题量", "Items"), t("官方能力描述", "Official construct")],
            rows: [
              { cells: [t("写作", "Writing"), t("完成句子", "Build a Sentence"), t("10", "10"), t("重组不同句型，形成语法正确的句子", "Reconstructing a range of sentence structures with appropriate grammar")] },
              { cells: [t("写作", "Writing"), t("邮件写作", "Write an Email"), t("1", "1"), t("在常见学术事务情境中写出得体的多句文本", "Producing an appropriate multi-sentence response to a common academic situation")] },
              { cells: [t("写作", "Writing"), t("学术讨论写作", "Write for an Academic Discussion"), t("1", "1"), t("提出清晰、有支持的论点，并使用多样语法和词汇", "Presenting a clear, supported argument with varied grammar and vocabulary")] },
              { cells: [t("口语", "Speaking"), t("听后复述", "Listen and Repeat"), t("7", "7"), t("准确、清晰地复述所听句子", "Repeating spoken sentences accurately and intelligibly")] },
              { cells: [t("口语", "Speaking"), t("面试回答", "Take an Interview"), t("4", "4"), t("即兴回答问题，做到清楚连贯、适当展开，并体现语法、词汇和语音可懂度", "Responding spontaneously with clear, coherent elaboration, accurate grammar, varied vocabulary, and intelligible prosody")] },
            ],
          },
        ],
      },
      {
        id: "toefl-adaptive-scoring",
        title: t("自适应与新版成绩", "Adaptive routing and current score scale"),
        bullets: [
          t("阅读和听力采用两阶段自适应：先完成分流模块，再进入与表现相匹配的较低或较高难度模块。", "Reading and Listening use two-stage adaptive routing: a router module is followed by a lower- or upper-difficulty module matched to performance."),
          t("写作和口语为线性测试，同一试卷版本的考生完成相同任务组合。", "Writing and Speaking are linear; test takers on a given form receive the same task set."),
          t("四个单项和总分均采用 1–6 分制，每 0.5 分一档；总分为四项平均后按规则取至最近的 0.5。", "All four sections and the overall score use a 1–6 scale in half-point increments; the overall score is the average of the four sections rounded to the nearest half band."),
          t("自 2026 年 1 月起的两年过渡期内，成绩单还显示可比较的 0–120 总分。", "For a two-year transition after January 2026, score reports also show a comparable 0–120 overall score."),
        ],
      },
    ],
    sources: [
      {
        title: t("托福中文官网：考试内容与结构", "TOEFL China: Test Content and Structure"),
        provider: t("ETS 中国", "ETS China"),
        url: "https://www.toefl.cn/test-takers/ibt/about/content.html",
        format: "webpage",
        version: t("2026 年 1 月 21 日起", "From January 21, 2026"),
        note: t("当前四项任务、题量、预计用时和新版分数。", "Current task families, item counts, estimated timing, and score scale."),
      },
      {
        title: t("TOEFL iBT 2026 试卷蓝图与规范", "TOEFL iBT 2026 Test Blueprint and Specifications"),
        provider: t("ETS", "ETS"),
        url: "https://www.ets.org/content/dam/ets-india/pdfs/toefl/toefl-ibt-test-specifications-2026.pdf",
        format: "pdf",
        version: t("2026 Update", "2026 Update"),
        note: t("分项任务题量、能力声明、CEFR 覆盖及自适应方式；顶层题量和用时以已上线的当前官网为准。", "Task-level counts, claims, CEFR coverage, and adaptive design; live public section totals and timing take precedence."),
      },
      {
        title: t("TOEFL iBT 新版成绩解释", "Understanding TOEFL iBT Scores"),
        provider: t("ETS", "ETS"),
        url: "https://www.ets.org/toefl/test-takers/ibt/scores/understand-scores.html",
        format: "webpage",
        version: t("2026 新分制", "2026 score scale"),
      },
    ],
    translationNote: t(
      "题型中文名称以 ETS 中国现行页面为主，并在必要处补充直译说明。2026 年前常见的旧版综合写作、综合口语等结构不得套用于本版本。ETS 规范文件的任务级题量允许因自适应分流而变化。",
      "Chinese task labels follow the current ETS China page, with literal clarification where useful. Pre-2026 integrated Writing and Speaking structures must not be carried into this version. Task-level item counts in the specification vary with adaptive routing.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-ielts-academic",
    slug: "ielts-academic-content-scope",
    projectId: "ielts-academic",
    classification: "formal-specification",
    title: t("IELTS Academic 考试内容", "IELTS Academic Test Content"),
    officialName: t("雅思学术类考试（IELTS Academic）", "IELTS Academic"),
    applicableCycle: t("2026 年现行考试结构；年中起各市场逐步转为机考，考试内容不变", "Current 2026 structure; delivery transitions by market from mid-2026 without changing test content"),
    status: "confirmed",
    summary: t(
      "IELTS Academic 现行考试仍由听力、阅读、写作和口语组成，总用时约 2 小时 45 分钟。2026 年年中起纸笔交付按市场逐步停止，但官方明确说明所考技能、考试构念和成绩解释不变。",
      "The current IELTS Academic test comprises Listening, Reading, Writing, and Speaking and takes about 2 hours 45 minutes. Paper delivery is being phased out by market from mid-2026, but IELTS states that the skills assessed, test construct, and score interpretation do not change.",
    ),
    facts: [
      { label: t("总用时", "Total duration"), value: t("约 2 小时 45 分钟", "About 2 hours 45 minutes") },
      { label: t("听力", "Listening"), value: t("4 部分、40 题、约 30 分钟", "4 parts, 40 questions, about 30 minutes") },
      { label: t("阅读", "Reading"), value: t("3 部分、40 题、60 分钟", "3 sections, 40 questions, 60 minutes") },
      { label: t("写作与口语", "Writing and Speaking"), value: t("写作 2 题 / 60 分钟；口语 3 部分 / 11–14 分钟", "Writing: 2 tasks / 60 minutes; Speaking: 3 parts / 11–14 minutes") },
    ],
    sections: [
      {
        id: "ielts-current-delivery",
        title: t("现行结构与 2026 交付变化", "Current structure and 2026 delivery change"),
        tables: [
          {
            columns: [t("分项", "Section"), t("用时", "Time"), t("数量", "Quantity"), t("说明", "Notes")],
            rows: [
              { cells: [t("听力", "Listening"), t("约 30 分钟", "About 30 minutes"), t("4 部分 / 40 题", "4 parts / 40 questions"), t("学术类与培训类相同", "Same for Academic and General Training")] },
              { cells: [t("阅读", "Reading"), t("60 分钟", "60 minutes"), t("3 部分 / 40 题", "3 sections / 40 questions"), t("学术类专用文本", "Academic-specific texts")] },
              { cells: [t("写作", "Writing"), t("60 分钟", "60 minutes"), t("2 题", "2 tasks"), t("Task 2 权重为 Task 1 的两倍", "Task 2 carries twice the weight of Task 1")] },
              { cells: [t("口语", "Speaking"), t("11–14 分钟", "11–14 minutes"), t("3 部分", "3 parts"), t("与考官面试并录音；学术类与培训类相同", "Recorded examiner interview; same for Academic and General Training")] },
            ],
          },
        ],
        paragraphs: [
          t("IELTS 官方于 2026 年 3 月宣布：从 2026 年年中起，各市场按各自时间表停止传统纸笔考试，转为机考；部分市场可选择在纸上完成写作。该变化不改变考试内容、评分或成绩解释。", "IELTS announced in March 2026 that traditional paper delivery would be phased out by market from mid-2026 in favor of computer delivery, with Writing on Paper available in selected markets. This does not alter content, scoring, or score interpretation."),
        ],
      },
      {
        id: "ielts-listening",
        title: t("听力", "Listening"),
        bullets: [
          t("Part 1：两人在日常社会情境中的对话；Part 2：一人在日常社会情境中的独白。", "Part 1 is a two-person conversation in an everyday social context; Part 2 is a monologue in an everyday social context."),
          t("Part 3：最多四人在教育或培训情境中的对话；Part 4：一段学术主题独白。", "Part 3 is a conversation with up to four people in an educational or training context; Part 4 is an academic monologue."),
          t("录音只播放一次，可能出现英国、澳大利亚、新西兰、美国和加拿大等口音。", "Recordings are played once and may use British, Australian, New Zealand, American, and Canadian accents."),
          t("题型包括选择、匹配、平面图／地图／图示标注、表格或笔记等信息补全、句子填空和简答。", "Question types include multiple choice, matching, plan/map/diagram labelling, information completion, sentence completion, and short answer."),
        ],
      },
      {
        id: "ielts-reading",
        title: t("学术阅读", "Academic Reading"),
        intro: t("三篇／三组文本总长约 2,150–2,750 词，选自书籍、期刊、杂志、报纸和网络资料，面向非专业读者，至少一篇含较完整的逻辑论证。", "Three texts or text sets total approximately 2,150–2,750 words, drawn from books, journals, magazines, newspapers, and online sources for a non-specialist audience; at least one contains a detailed logical argument."),
        bullets: [
          t("选择题；判断信息 True / False / Not Given；判断作者观点 Yes / No / Not Given。", "Multiple choice; True / False / Not Given; Yes / No / Not Given."),
          t("匹配信息、标题、特征或句尾。", "Matching information, headings, features, or sentence endings."),
          t("句子填空；摘要、笔记、表格或流程图填空；图示标注；简答。", "Sentence completion; summary, note, table, or flow-chart completion; diagram labelling; short answer."),
        ],
      },
      {
        id: "ielts-writing",
        title: t("学术写作", "Academic Writing"),
        tables: [
          {
            columns: [t("任务", "Task"), t("建议用时", "Suggested time"), t("最低字数", "Minimum length"), t("要求", "Requirement")],
            rows: [
              { cells: [t("Task 1", "Task 1"), t("约 20 分钟", "About 20 minutes"), t("150 词", "150 words"), t("用自己的语言描述图表、表格、流程或示意图中的主要信息", "Describe the principal information in a graph, table, chart, process, or diagram in one's own words")] },
              { cells: [t("Task 2", "Task 2"), t("约 40 分钟", "About 40 minutes"), t("250 词", "250 words"), t("讨论一个观点、论证或问题，并展开有依据的回应", "Discuss a point of view, argument, or problem and develop a supported response")] },
            ],
            note: t("两题都必须完成，Task 2 对写作分数的权重是 Task 1 的两倍。", "Both tasks must be completed; Task 2 contributes twice as much as Task 1 to the Writing score."),
          },
        ],
        bullets: [
          t("评分维度：任务完成／任务回应、连贯与衔接、词汇资源、语法范围与准确性。", "Assessment criteria: task achievement/response, coherence and cohesion, lexical resource, and grammatical range and accuracy."),
        ],
      },
      {
        id: "ielts-speaking",
        title: t("口语", "Speaking"),
        tables: [
          {
            columns: [t("部分", "Part"), t("用时", "Time"), t("形式", "Format")],
            rows: [
              { cells: [t("Part 1", "Part 1"), t("4–5 分钟", "4–5 minutes"), t("身份确认及家庭、学习、兴趣等熟悉话题问答", "Identity check and questions on familiar topics such as home, studies, and interests")] },
              { cells: [t("Part 2", "Part 2"), t("3–4 分钟", "3–4 minutes"), t("抽到题卡后准备 1 分钟，连续陈述最长 2 分钟，并回答一两个追问", "One minute to prepare from a task card, a long turn of up to two minutes, and one or two follow-up questions")] },
              { cells: [t("Part 3", "Part 3"), t("4–5 分钟", "4–5 minutes"), t("围绕 Part 2 主题进行更抽象、深入的双向讨论", "A more abstract and in-depth two-way discussion related to the Part 2 topic")] },
            ],
          },
        ],
        bullets: [
          t("评分维度：流利与连贯、词汇资源、语法范围与准确性、发音。", "Assessment criteria: fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation."),
        ],
      },
    ],
    sources: [
      {
        title: t("IELTS Academic 考试结构", "IELTS Academic Test Format"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/take-a-test/test-types/ielts-academic-test",
        format: "webpage",
        note: t("总体用途、四项结构和总用时。", "Purpose, four-section structure, and total duration."),
      },
      {
        title: t("IELTS Academic 听力格式", "IELTS Listening Test Format"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-listening",
        format: "webpage",
      },
      {
        title: t("IELTS Academic 阅读格式", "IELTS Academic Reading Test Format"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-reading",
        format: "webpage",
      },
      {
        title: t("IELTS Academic 写作格式", "IELTS Academic Writing Test Format"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-writing",
        format: "webpage",
      },
      {
        title: t("IELTS Academic 口语格式", "IELTS Academic Speaking Test Format"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking",
        format: "webpage",
      },
      {
        title: t("2026 IELTS 交付方式更新", "Updates to IELTS Test Delivery"),
        provider: t("IELTS", "IELTS"),
        url: "https://ielts.org/news-and-insights/updates-to-ielts-test-delivery",
        format: "webpage",
        version: t("2026 年 3 月 5 日", "March 5, 2026"),
        note: t("各市场转为机考的时间不同；考试技能和构念不变。", "Market timelines vary; assessed skills and test construct do not change."),
      },
    ],
    translationNote: t(
      "True / False / Not Given 与 Yes / No / Not Given 保留英文：前者判断文本事实信息，后者判断作者观点或主张。2026 年机考交付变化不应误写为考试内容改版；中国大陆具体场次形式以报名门户为准。",
      "True / False / Not Given and Yes / No / Not Given are retained in English because the former concerns factual information and the latter the writer's views or claims. The 2026 delivery change must not be presented as a content redesign; candidates should check the booking portal for the format of a specific sitting.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-cat4",
    slug: "cat4-public-content-scope",
    projectId: "cat4",
    classification: "structure-only",
    title: t("CAT4 公开测评范围", "Published CAT4 Assessment Scope"),
    officialName: t("认知能力测试第四版（CAT4）", "Cognitive Abilities Test: Fourth Edition (CAT4)"),
    applicableCycle: t("现行 CAT4 产品与支持资料；2026 年 8 月核验", "Current CAT4 product and support materials; verified August 2026"),
    status: "confirmed",
    summary: t(
      "CAT4 是推理能力画像，不是按学校课程出题的学科考试。GL Assessment 公开了四个能力组、八类题型及实施时长，但没有面向个人考生发布可逐项复习的课程考纲，并明确不建议提前刷题。",
      "CAT4 is a reasoning-ability profile rather than a curriculum attainment test. GL Assessment publishes four batteries, eight task types, and administration time, but no personal-study curriculum syllabus and explicitly advises against advance practice.",
    ),
    facts: [
      { label: t("年龄", "Age range"), value: t("6–17+ 岁", "6–17+ years") },
      { label: t("8–17+ 岁用时", "Duration, ages 8–17+"), value: t("3 个部分，每部分 45 分钟，共 2 小时 15 分钟", "Three 45-minute parts, 2 hours 15 minutes total") },
      { label: t("6–8 岁版本", "Ages 6–8 version"), value: t("2 个部分，每部分 30 分钟", "Two 30-minute parts") },
      { label: t("性质", "Construct"), value: t("词语、数量、非语言和空间推理；非课程成就考试", "Verbal, quantitative, non-verbal, and spatial reasoning; not a curriculum attainment test") },
    ],
    sections: [
      {
        id: "cat4-boundary",
        title: t("测什么，以及不是什么", "What CAT4 measures—and what it does not"),
        bullets: [
          t("CAT4 用四组推理任务描述学生在词语、数字、图形和空间材料上的已发展能力。", "CAT4 profiles developed reasoning abilities using verbal, numerical, figural, and spatial material."),
          t("它用于学校基线测评和学习支持，不是以某一国家课程知识点为范围的学科考试。", "It is used for school baseline assessment and learning support, not as a subject test defined by a national curriculum checklist."),
          t("GL Assessment 明确不建议任何考前刷题，也不认可第三方 CAT4 练习材料；每个部分自带不计时的示例用于熟悉操作。", "GL Assessment strongly advises against advance practice and does not endorse third-party CAT4 practice materials; each section contains untimed examples for interface familiarization."),
        ],
      },
      {
        id: "cat4-structure",
        title: t("形式、用时与顺序", "Delivery, timing, and order"),
        tables: [
          {
            columns: [t("版本", "Version"), t("年龄", "Age"), t("形式", "Delivery"), t("官方用时", "Official time")],
            rows: [
              { cells: [t("CAT4 Young Learners", "CAT4 Young Learners"), t("6–8 岁", "6–8 years"), t("纸笔", "Paper"), t("2 × 30 分钟", "2 × 30 minutes")] },
              { cells: [t("CAT4", "CAT4"), t("8–17+ 岁", "8–17+ years"), t("数字版（电脑／平板）或纸笔", "Digital (PC/tablet) or paper"), t("3 × 45 分钟", "3 × 45 minutes")] },
            ],
          },
        ],
        bullets: [
          t("标准能力组顺序为：非语言推理、词语推理、数量推理、空间能力。", "The standardized battery order is Non-verbal, Verbal, Quantitative, then Spatial."),
          t("数字版分三部分：Part 1 非语言；Part 2 词语与第一组数量任务；Part 3 第二组数量任务与空间能力。", "The digital edition is delivered in three parts: Part 1 Non-verbal; Part 2 Verbal plus the first Quantitative test; Part 3 the second Quantitative test plus Spatial."),
        ],
      },
      {
        id: "cat4-batteries",
        title: t("四个能力组与八类题型", "Four batteries and eight task types"),
        tables: [
          {
            columns: [t("能力组", "Battery"), t("题型", "Tests"), t("公开能力描述", "Published construct")],
            rows: [
              { cells: [t("词语推理", "Verbal Reasoning"), t("词语分类；词语类比", "Verbal Classification; Verbal Analogies"), t("识别词语概念的共同点与关系，并把关系迁移到新词对", "Identify common conceptual properties and relationships among words and transfer a relationship to a new word pair")] },
              { cells: [t("数量推理", "Quantitative Reasoning"), t("数字类比；数字序列", "Number Analogies; Number Series"), t("识别数对或数列的关系和规则，需要基础算术准确性与灵活性", "Identify relationships and rules in number pairs or sequences, drawing on basic arithmetic accuracy and flexibility")] },
              { cells: [t("非语言推理", "Non-verbal Reasoning"), t("图形分类；图形矩阵", "Figure Classification; Figure Matrices"), t("发现图形之间的共同特征、差异和变换关系", "Discover common properties, differences, and transformations among figures")] },
              { cells: [t("空间能力", "Spatial Ability"), t("图形分析；图形识别", "Figure Analysis; Figure Recognition"), t("在头脑中折叠、打孔并展开图形，或在复杂图案中识别同尺寸目标轮廓", "Mentally fold, punch, and unfold figures, or locate an exact-size target outline within a complex design")] },
            ],
          },
        ],
      },
      {
        id: "cat4-reporting",
        title: t("结果与解读边界", "Results and interpretation boundary"),
        bullets: [
          t("学校报告通常给出每个能力组的标准年龄分（SAS）、全国百分位（NPR）、九分位和综合平均分。", "School reports typically provide a Standard Age Score (SAS), National Percentile Rank (NPR), stanine, and overall mean for the batteries."),
          t("CAT4 结果描述的是相对于同龄常模的推理画像，不等同于某门课程掌握程度，也不应单独用于高风险决定。", "CAT4 results are a norm-referenced reasoning profile, not proof of mastery of a school subject and should not stand alone in high-stakes decisions."),
          t("题目数量、完整题库和逐知识点蓝图未在面向家庭的公开页面发布。", "Item counts, the secure item bank, and an exhaustive topic-by-topic blueprint are not published on family-facing public pages."),
        ],
      },
    ],
    sources: [
      {
        title: t("CAT4 官方产品说明", "CAT4 Product Overview"),
        provider: t("GL Assessment", "GL Assessment"),
        url: "https://www.gl-assessment.co.uk/products/cat4/",
        format: "webpage",
        note: t("年龄、形式、用时、四个能力组和不建议练习的官方说明。", "Age, delivery, timing, four batteries, and official no-practice guidance."),
      },
      {
        title: t("CAT4 各能力组内容", "What Is in Each CAT4 Battery?"),
        provider: t("GL Assessment Support", "GL Assessment Support"),
        url: "https://support.gl-assessment.co.uk/knowledge-base/assessments/cat4-support/general-information/what-is-in-each-battery",
        format: "webpage",
        note: t("八类题型的任务机制与能力解释。", "Task mechanics and construct descriptions for the eight tests."),
      },
      {
        title: t("CAT4 常见问题", "CAT4 Frequently Asked Questions"),
        provider: t("GL Assessment Support", "GL Assessment Support"),
        url: "https://support.gl-assessment.co.uk/knowledge-base/assessments/cat4-support/frequently-asked-questions/frequently-asked-questions",
        format: "webpage",
        note: t("能力组顺序、数字版三部分安排和练习示例规则。", "Battery order, digital three-part delivery, and familiarization-example rules."),
      },
      {
        title: t("CAT4 数据解释", "Understanding CAT4 Data"),
        provider: t("GL Assessment Support", "GL Assessment Support"),
        url: "https://support.gl-assessment.co.uk/knowledge-base/assessments/cat4-support/after-the-test/understanding-your-data",
        format: "webpage",
        note: t("SAS、百分位、九分位和能力画像。", "SAS, percentile rank, stanine, and ability profile."),
      },
    ],
    translationNote: t(
      "Battery 译为“能力组”，而非学科卷；Quantitative Reasoning 译为“数量推理”，不能扩写成代数、几何等固定课程考纲。题型名称按 GL Assessment 术语直译。第三方练习网站列出的知识点未纳入。",
      "Battery is rendered as an ability battery, not a subject paper. Quantitative Reasoning must not be expanded into a fixed algebra/geometry curriculum syllabus. Test names are translated directly from GL Assessment terminology; third-party practice-topic lists are excluded.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-map-growth",
    slug: "map-growth-content-framework",
    projectId: "map-growth",
    classification: "content-framework",
    title: t("MAP Growth 内容框架", "MAP Growth Content Framework"),
    officialName: t("MAP Growth 学业成长测评", "MAP Growth"),
    applicableCycle: t("现行 MAP Growth 产品；内容证据采用 2024–25 技术报告，2026 年 8 月核验", "Current MAP Growth product; content evidence from the 2024–25 technical report, verified August 2026"),
    status: "confirmed",
    summary: t(
      "MAP Growth 是学校在学年内多次实施的自适应阶段性测评，不是个人统一报名的入学考试。NWEA 公开了学科覆盖、题量、用时和内容框架，但不同学校所选标准版本与年级题池不同，因此不存在一份适用于所有考生的固定公开考纲。",
      "MAP Growth is a school-administered adaptive interim assessment given multiple times during a year, not an individually booked admissions test. NWEA publishes subject coverage, test length, timing, and content frameworks, but the standards alignment and grade-banded pool vary by school, so there is no single fixed public syllabus for every student.",
    ),
    facts: [
      { label: t("形式", "Delivery"), value: t("按单科实施的计算机自适应测评", "Single-subject computer-adaptive assessment") },
      { label: t("题量", "Item count"), value: t("每科约 43 题", "About 43 items per subject") },
      { label: t("用时", "Time"), value: t("不限时；多数学生每科约 45–55 分钟", "Untimed; most students take about 45–55 minutes per subject") },
      { label: t("成绩", "Score"), value: t("RIT 等距纵向量尺，用于比较学期与年级间成长", "RIT equal-interval vertical scale for growth across terms and grades") },
    ],
    sections: [
      {
        id: "map-nature-coverage",
        title: t("测评性质与学科覆盖", "Assessment purpose and subject coverage"),
        tables: [
          {
            columns: [t("语言版本", "Language"), t("学科", "Subjects"), t("年级范围", "Grade coverage")],
            rows: [
              { cells: [t("英语", "English"), t("数学、阅读", "Mathematics, Reading"), t("K–12", "K–12")] },
              { cells: [t("英语", "English"), t("语言运用、科学", "Language Usage, Science"), t("2–12", "Grades 2–12")] },
              { cells: [t("西班牙语", "Spanish"), t("数学", "Mathematics"), t("K–12", "K–12")] },
              { cells: [t("西班牙语", "Spanish"), t("阅读", "Reading"), t("K–8", "K–8")] },
            ],
          },
        ],
        bullets: [
          t("每次测试只完成一个学科，题目根据前一题表现动态调整难度，目标是找到学生当前最合适的难度位置。", "Each session covers one subject. Item difficulty adapts to prior responses to locate the student's current achievement level."),
          t("K–2 数学与阅读版本为低龄学生提供音频支持；具体采用哪一份测试由学校设置。", "K–2 Mathematics and Reading provide audio support for young learners; the school determines the test assignment."),
        ],
      },
      {
        id: "map-test-shape",
        title: t("题量、用时与题目形式", "Test length, time, and item formats"),
        bullets: [
          t("现行 MAP Growth 每科约 43 题；多数学生在 40–55 分钟内完成，产品页给出的常规计划时长为 45–55 分钟。", "Current MAP Growth tests contain about 43 items; most students finish in 40–55 minutes, and the product page lists 45–55 minutes for planning."),
          t("考试不限时。过快或过慢都可能影响数据解释，监考人员应按学校的标准化流程实施。", "The assessment is untimed. Unusually short or long sessions can affect interpretation, so proctors follow the school's standardized administration process."),
          t("官方技术报告列出的互动形式包括选择、作答构建、生成式作答、题组和复合题；低龄题目还可带音频。", "The technical report lists selection, constructed, generated, item-set, and composite interaction types; early-grade items may also include audio."),
        ],
      },
      {
        id: "map-framework-examples",
        title: t("官方内容框架示例", "Official content-framework examples"),
        intro: t("下表来自 NWEA 2024–25 技术报告中的示例蓝图，用于说明内容如何组织；它不是所有州、所有年级都完全相同的固定试卷。", "The table draws on example blueprints in NWEA's 2024–25 technical report. It illustrates content organization and is not a universal fixed form for every state and grade."),
        tables: [
          {
            columns: [t("示例测试", "Example test"), t("教学领域", "Instructional areas"), t("示例蓝图", "Illustrative blueprint")],
            rows: [
              { cells: [t("Math 2–5", "Math 2–5"), t("几何；测量与数据；数与运算；运算与代数思维", "Geometry; Measurement and Data; Number and Operations; Operations and Algebraic Thinking"), t("6、11、13、10 题；数学内容还平衡程序、概念和应用三类严谨度", "6, 11, 13, and 10 items; mathematics also balances procedural, conceptual, and application aspects of rigor")] },
              { cells: [t("Reading 2–5", "Reading 2–5"), t("信息类文本；文学类文本；词汇", "Informational Text; Literary Text; Vocabulary"), t("各 13 题；最多 2 个阅读文章题组", "13 items each; up to two passage-based item sets")] },
              { cells: [t("Language Usage 2+", "Language Usage 2+"), t("语法理解与编辑；书写规范理解与编辑；按目的与读者写作和修改", "Understand/Edit for Grammar; Understand/Edit for Mechanics; Write/Revise for Purpose and Audience"), t("各 13 题", "13 items each")] },
              { cells: [t("Science 2–12", "Science 2–12"), t("生命科学；地球与空间科学；物质科学", "Life Sciences; Earth and Space Sciences; Physical Sciences"), t("产品页公开三大领域；具体蓝图随测试版本而定", "Three broad domains are public; the detailed blueprint depends on the assigned version")] },
            ],
            note: t("示例蓝图题量不含全部试测题。技术报告说明，数学、科学和语言运用最多含 3 道试测题，阅读最多含 4 道。", "Illustrative blueprint counts exclude all field-test items. The technical report allows up to three field-test items in Math, Science, and Language Usage and up to four in Reading."),
          },
        ],
      },
      {
        id: "map-variation-boundary",
        title: t("为什么没有一份统一固定考纲", "Why there is no single fixed syllabus"),
        bullets: [
          t("MAP Growth 题池可对齐州标准、Common Core 或 NWEA 内容框架；学校购买并分配的测试版本决定具体标准。", "MAP Growth pools may align to state standards, the Common Core, or NWEA content frameworks; the version purchased and assigned by the school determines the operative standards."),
          t("年级段题池覆盖所测年级上下的内容，以便自适应测试向学生实际水平延伸；考生可能看到高于或低于当前年级的题。", "Grade-banded pools include content above and below the nominal grade so the adaptive test can extend to the student's achievement level."),
          t("教学领域名称和权重可因标准版本而异。技术报告中的题量只能标为示例，不能当作国际学校统一试卷。", "Instructional-area labels and weights can vary by standards alignment. Counts in the technical report are illustrative and must not be presented as one universal international-school form."),
          t("RIT 是沿同一量尺报告的成绩，不是答对百分比，也没有适用于所有学校的统一“录取线”。", "RIT is a vertically scaled score, not percent correct, and there is no universal admissions cut score across schools."),
        ],
      },
    ],
    sources: [
      {
        title: t("MAP Growth 官方说明", "MAP Growth Overview"),
        provider: t("NWEA", "NWEA"),
        url: "https://www.nwea.org/map-growth/",
        format: "webpage",
        note: t("测评性质、学科覆盖和学校使用场景。", "Assessment purpose, subject coverage, and school use."),
      },
      {
        title: t("MAP Growth 功能与结构", "MAP Growth Features"),
        provider: t("NWEA", "NWEA"),
        url: "https://www.nwea.org/map-growth/features/",
        format: "webpage",
        note: t("年级、学科、45–55 分钟用时、标准对齐和科学领域。", "Grades, subjects, 45–55 minute timing, standards alignment, and science domains."),
      },
      {
        title: t("MAP Growth 家庭常见问题", "MAP Growth Common Questions for Families"),
        provider: t("NWEA", "NWEA"),
        url: "https://www.nwea.org/the-map-suite/common-questions-families/",
        format: "webpage",
        note: t("约 43 题、单科测试、自适应机制及语言版本。", "About 43 items, single-subject sessions, adaptive mechanism, and language versions."),
      },
      {
        title: t("MAP Growth 2024–25 技术报告", "MAP Growth Technical Report 2024–2025"),
        provider: t("NWEA", "NWEA"),
        url: "https://www.nwea.org/uploads/MAP-Growth-Technical-Report-2025.pdf",
        format: "pdf",
        version: t("2024–25 学年数据；2026 年发布", "2024–25 administration data; published 2026"),
        note: t("目标领域、标准映射、示例蓝图、题型和自适应组卷方法。", "Target domains, standards mapping, example blueprints, item interactions, and adaptive assembly."),
      },
    ],
    translationNote: t(
      "Language Usage 译为“语言运用”，Instructional Area 译为“教学领域”，RIT 保留原缩写。示例蓝图的中文领域名按 NWEA 技术报告直译，并明确标注为示例；培训网站或某所学校自制的复习范围未纳入。",
      "Language Usage is rendered literally; Instructional Area is translated as instructional domain; RIT remains untranslated. Chinese domain labels are direct translations from NWEA's technical report and are explicitly marked illustrative. Third-party or school-created study lists are excluded.",
    ),
    lastVerified: VERIFIED_AT,
  },
];
