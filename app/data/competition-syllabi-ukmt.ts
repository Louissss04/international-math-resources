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

const source = (
  titleZh: string,
  titleEn: string,
  providerZh: string,
  providerEn: string,
  url: string,
  format: SyllabusSourceRecord["format"] = "webpage",
  noteZh?: string,
  noteEn?: string,
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  format,
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
});

const ukmtProvider = t("英国数学信托（UKMT）", "United Kingdom Mathematics Trust (UKMT)");

export const ukmtCompetitionSyllabi: AssessmentSyllabusRecord[] = [
  {
    id: "syllabus-ukmt-jmc-2026-27",
    slug: "ukmt-jmc",
    projectId: "jmc",
    classification: "structure-only",
    title: t("UKMT JMC 官方范围与结构", "UKMT JMC Official Scope and Structure"),
    officialName: t("初级数学挑战赛", "Junior Mathematical Challenge"),
    applicableCycle: t("2026–27 赛季；2027 年 5 月 5 日主赛", "2026–27 season; main challenge on 5 May 2027"),
    status: "confirmed",
    summary: t(
      "UKMT 当前没有为 JMC 发布按代数、几何、数论等逐项封闭的知识点考纲。官方界定由年龄组、60 分钟 25 道选择题的赛制，以及“数学推理、思维精确性和流畅性”的问题解决目标构成；官方历年试题、解答与 investigations 是公布的内容实例。",
      "UKMT does not currently publish a closed, topic-by-topic syllabus for JMC in areas such as algebra, geometry or number theory. Its official framework consists of the age group, the 60-minute 25-item multiple-choice format, and the stated focus on mathematical reasoning, precision of thought and fluency. Official papers, solutions and investigations provide the published examples of content.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方范围与结构；无封闭知识点清单", "Official scope and structure; no closed topic list"),
      fact("官方能力表述", "Official skills statement", "数学推理、思维精确性与流畅性", "Mathematical reasoning, precision of thought and fluency"),
      fact("试卷", "Paper", "60 分钟；25 道选择题", "60 minutes; 25 multiple-choice questions"),
      fact("年龄上限", "Age group", "英格兰、威尔士及海外 Year 8 及以下；苏格兰 S2；北爱尔兰 Year 9", "Year 8 and below in England, Wales and overseas; S2 in Scotland; Year 9 in Northern Ireland"),
      fact("工具", "Equipment", "可用空白草稿纸；禁用方格纸、计算器和测量工具", "Blank rough paper permitted; squared paper, calculators and measuring instruments prohibited"),
      fact("题目次序", "Question order", "按大致难度排列，较难题靠后", "Arranged in approximate order of difficulty, with harder questions later"),
    ],
    sections: [
      {
        id: "jmc-official-boundary",
        title: t("官方公布的范围边界", "Published official boundary"),
        tables: [
          {
            columns: [t("项目", "Item"), t("UKMT 当前公布内容", "Current UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前项目页、竞赛手册入口及 Competition Papers 页面均未列出封闭知识点表。", "The current competition page, handbook entry and Competition Papers page do not publish a closed topic list."]),
              row(["内容定位", "Content positioning"], ["题目面向 Year 8 及以下，官方称多数题可接近，同时仍能挑战更有经验的学生。", "Problems are aimed at Year 8 and below; UKMT describes them as accessible while still challenging more experienced students."]),
              row(["考查对象", "Assessment focus"], ["数学推理、思维精确性、流畅性和解决有趣问题；不是完成指定教材章节的课程考试。", "Mathematical reasoning, precision, fluency and solving interesting problems, rather than examination of a prescribed sequence of textbook chapters."]),
            ],
          },
        ],
      },
      {
        id: "jmc-paper-design",
        title: t("题目与作答设计", "Question and response design"),
        tables: [
          {
            columns: [t("要素", "Element"), t("规定", "Requirement")],
            rows: [
              row(["题量与时间", "Items and time"], ["25 道题，60 分钟。", "25 questions in 60 minutes."]),
              row(["作答形式", "Response format"], ["每题五个选项，选择唯一正确答案。", "Five options per item, with one correct answer."]),
              row(["难度编排", "Difficulty progression"], ["题目按大致难度递增；官方明确不要求在限时内完成全部题目。", "Questions increase in approximate difficulty; UKMT explicitly states that candidates are not expected to finish the whole paper."]),
              row(["推理与猜测", "Reasoning and guessing"], ["官方说明题目旨在促使思考，而非靠猜测完成。", "UKMT states that the questions are designed to make candidates think rather than guess."]),
            ],
          },
        ],
      },
      {
        id: "jmc-official-corpus",
        title: t("官方内容实例与资料", "Official content examples and materials"),
        tables: [
          {
            columns: [t("资料", "Material"), t("包含内容", "Contents"), t("用途边界", "Interpretive boundary")],
            rows: [
              row(["Competition Papers", "Competition Papers"], ["历年 Questions、Solutions，以及多年份的 Extended Solutions／Solutions and Investigations、Problem Group Comments 和视频解答。", "Past Questions and Solutions, with Extended Solutions or Solutions and Investigations, Problem Group Comments and video solutions for many years."], ["是官方公布的题目实例，不构成下一届题型或知识点比例承诺。", "Official examples of problems, not a promise of topic mix or proportions in a future paper."]),
              row(["UKMT 出版物", "UKMT publications"], ["项目页列 Junior Problems、Junior Bundle 等官方书目。", "The competition page lists publications including Junior Problems and the Junior Bundle."], ["书目用于问题解决拓展，不是 JMC 法定或封闭考纲。", "The books support problem-solving development; they are not a statutory or closed JMC syllabus."]),
            ],
          },
        ],
      },
    ],
    sources: [
      source("JMC 当前项目页", "Current JMC competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/junior-challenges/junior-mathematical-challenge"),
      source("UKMT Junior Competitions 总览", "UKMT Junior Competitions overview", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/junior-challenges"),
      source("UKMT 官方试题、解答与探究库", "UKMT official papers, solutions and investigations", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("UKMT 数学书目", "UKMT mathematics books", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/maths-books"),
    ],
    translationNote: t(
      "本页只整理 UKMT 实际公布的年龄定位、能力目标、题目设计和官方材料。未把历年题按主题统计，也未从书目章节反推出 JMC 考纲；因此不列未经 UKMT 发布的代数、几何、数论或组合占比。中文不是 UKMT 官方译本。",
      "This page records only the age positioning, skills statement, question design and official materials published by UKMT. It does not classify past papers by topic or infer a JMC syllabus from book chapters, so it gives no unofficial algebra, geometry, number theory or combinatorics proportions. The Chinese text is not an official UKMT translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-ukmt-imc-2026-27",
    slug: "ukmt-imc",
    projectId: "imc",
    classification: "structure-only",
    title: t("UKMT IMC 官方范围与结构", "UKMT IMC Official Scope and Structure"),
    officialName: t("中级数学挑战赛", "Intermediate Mathematical Challenge"),
    applicableCycle: t("2026–27 赛季；2027 年 1 月 27 日主赛", "2026–27 season; main challenge on 27 January 2027"),
    status: "confirmed",
    summary: t(
      "UKMT 当前没有为 IMC 发布逐知识点封闭考纲。官方以 Year 11 及以下的年龄定位、60 分钟 25 道选择题的结构，以及数学推理、思维精确性、流畅性和问题解决目标界定内容；历年 Questions、Solutions 与 Solutions and Investigations 是官方内容实例。",
      "UKMT does not currently publish a closed topic-by-topic syllabus for IMC. The official content is framed by the Year 11-and-below age group, a 60-minute 25-item multiple-choice paper, and the focus on mathematical reasoning, precision, fluency and problem solving. Past Questions, Solutions and Solutions and Investigations are the official examples of content.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方范围与结构；无封闭知识点清单", "Official scope and structure; no closed topic list"),
      fact("官方能力表述", "Official skills statement", "数学推理、思维精确性、流畅性与审慎的问题解决", "Mathematical reasoning, precision of thought, fluency and careful problem solving"),
      fact("试卷", "Paper", "60 分钟；25 道选择题", "60 minutes; 25 multiple-choice questions"),
      fact("年龄上限", "Age group", "英格兰、威尔士及海外 Year 11 及以下；苏格兰 S4；北爱尔兰 Year 12", "Year 11 and below in England, Wales and overseas; S4 in Scotland; Year 12 in Northern Ireland"),
      fact("工具", "Equipment", "可用空白草稿纸；禁用方格纸、计算器和测量工具", "Blank rough paper permitted; squared paper, calculators and measuring instruments prohibited"),
      fact("题目次序", "Question order", "按大致难度排列，较难题靠后", "Arranged in approximate order of difficulty, with harder questions later"),
    ],
    sections: [
      {
        id: "imc-official-boundary",
        title: t("官方公布的范围边界", "Published official boundary"),
        tables: [
          {
            columns: [t("项目", "Item"), t("UKMT 当前公布内容", "Current UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前 IMC 项目页与官方材料入口未公布封闭知识点清单或固定主题比例。", "The current IMC page and official materials do not publish a closed topic list or fixed subject proportions."]),
              row(["内容定位", "Content positioning"], ["面向 Year 11 及以下；官方称题目多数可接近，同时为更有经验的学生提供挑战。", "Aimed at Year 11 and below; UKMT describes most problems as accessible while still challenging experienced students."]),
              row(["考查对象", "Assessment focus"], ["数学推理、精确思考、流畅性与审慎解决问题。", "Mathematical reasoning, precision of thought, fluency and careful problem solving."]),
            ],
          },
        ],
      },
      {
        id: "imc-paper-design",
        title: t("题目与作答设计", "Question and response design"),
        tables: [
          {
            columns: [t("要素", "Element"), t("规定", "Requirement")],
            rows: [
              row(["题量与时间", "Items and time"], ["25 道题，60 分钟。", "25 questions in 60 minutes."]),
              row(["作答形式", "Response format"], ["每题五个选项，选择唯一正确答案。", "Five options per item, with one correct answer."]),
              row(["难度编排", "Difficulty progression"], ["题目按大致难度递增；官方明确不要求在限时内做完全部题目。", "Questions increase in approximate difficulty; candidates are explicitly not expected to finish the whole paper."]),
              row(["后续轮次关系", "Follow-on relationship"], ["IMC 成绩可用于邀请相应年级的 Cayley、Hamilton、Maclaurin Olympiad 或 Grey／Pink Kangaroo；后续轮次并不反向构成 IMC 知识点考纲。", "IMC scores may lead to age-appropriate Cayley, Hamilton or Maclaurin Olympiad or Grey/Pink Kangaroo invitations; those rounds do not retrospectively define an IMC topic syllabus."]),
            ],
          },
        ],
      },
      {
        id: "imc-official-corpus",
        title: t("官方内容实例与资料", "Official content examples and materials"),
        tables: [
          {
            columns: [t("资料", "Material"), t("包含内容", "Contents"), t("用途边界", "Interpretive boundary")],
            rows: [
              row(["Competition Papers", "Competition Papers"], ["历年 Questions、Solutions、Solutions and Investigations 与部分视频解答。", "Past Questions, Solutions, Solutions and Investigations and selected video solutions."], ["呈现官方问题风格和解法，不承诺下一届知识点分布。", "Shows official problem style and solutions without promising a future topic distribution."]),
              row(["UKMT 出版物", "UKMT publications"], ["项目页列 Intermediate Problems、Intermediate Bundle、Introduction to Inequalities 等。", "The competition page lists Intermediate Problems, the Intermediate Bundle and Introduction to Inequalities, among other titles."], ["这些书是拓展资料；单本专题名称不代表该专题必考或占固定比例。", "These are enrichment resources; a book's subject title does not make that topic compulsory or fix its weighting."]),
            ],
          },
        ],
      },
    ],
    sources: [
      source("IMC 当前项目页", "Current IMC competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/intermediate-challenges/intermediate-mathematical-challenge"),
      source("UKMT Intermediate Competitions 总览", "UKMT Intermediate Competitions overview", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/intermediate-challenges"),
      source("UKMT 官方试题、解答与探究库", "UKMT official papers, solutions and investigations", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("UKMT 数学书目", "UKMT mathematics books", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/maths-books"),
    ],
    translationNote: t(
      "本页仅整理 UKMT 公布的年龄定位、能力目标、题目结构和官方材料。历年题没有被用于反推封闭考纲，UKMT 出版物按 topic 分组也不等同于当届命题比例。中文不是 UKMT 官方译本。",
      "This page records only the age positioning, skills statement, paper structure and materials published by UKMT. Past papers are not used to infer a closed syllabus, and topic groupings in UKMT publications do not define the subject proportions of a live paper. The Chinese text is not an official UKMT translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-ukmt-smc-2026-27",
    slug: "smc",
    projectId: "smc",
    classification: "structure-only",
    title: t("UKMT SMC 官方范围与结构", "UKMT SMC Official Scope and Structure"),
    officialName: t("高级数学挑战赛", "Senior Mathematical Challenge"),
    applicableCycle: t("2026–27 赛季；2026 年 10 月 7 日主赛", "2026–27 season; main challenge on 7 October 2026"),
    status: "confirmed",
    summary: t(
      "SMC 当前没有 UKMT 发布的逐知识点封闭考纲。官方将其定义为面向 Year 13 及以下的第一轮问题解决挑战，强调思考，并同时服务初学者和有经验的问题解决者。2026 赛季试行 22 道选择题加最后 3 道 000–999 三位数字题，合计 90 分钟。",
      "UKMT does not currently publish a closed topic-by-topic syllabus for SMC. It defines SMC as a first-round problem-solving challenge for Year 13 and below, designed to make students think and to offer stimulating problems for beginners and experienced problem solvers. For 2026, UKMT is trialling 22 multiple-choice items followed by three 000–999 three-digit-response items in 90 minutes.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方范围与结构；无封闭知识点清单", "Official scope and structure; no closed topic list"),
      fact("官方内容定位", "Official content positioning", "促进思考；面向初学者和有经验的问题解决者的启发性问题", "Designed to make students think; stimulating problems for beginners and experienced problem solvers"),
      fact("2026 试卷", "2026 paper", "90 分钟；22 道选择题 + 3 道 000–999 三位数字题", "90 minutes; 22 multiple-choice questions plus three 000–999 three-digit-response questions"),
      fact("年龄上限", "Age group", "英格兰、威尔士及海外 Year 13 及以下；苏格兰 S6；北爱尔兰 Year 14", "Year 13 and below in England, Wales and overseas; S6 in Scotland; Year 14 in Northern Ireland"),
      fact("工具", "Equipment", "可用空白草稿纸；禁用方格纸、计算器和测量工具", "Blank rough paper permitted; squared paper, calculators and measuring instruments prohibited"),
      fact("后续轮次", "Follow-on rounds", "成绩用于 Senior Kangaroo 与 BMO1 邀请；两条路径的分数线另行公布", "Scores feed invitations to Senior Kangaroo and BMO1; the two qualification thresholds are published separately"),
    ],
    sections: [
      {
        id: "smc-official-boundary",
        title: t("官方公布的范围边界", "Published official boundary"),
        tables: [
          {
            columns: [t("项目", "Item"), t("UKMT 当前公布内容", "Current UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前 SMC 页面、Competition Papers 和官方书目没有发布封闭知识点清单或固定主题权重。", "The current SMC page, Competition Papers archive and official book list publish no closed topic list or fixed topic weightings."]),
              row(["内容定位", "Content positioning"], ["第一轮 Challenge；题目旨在促使思考，并为不同问题解决经验的学生提供刺激性问题。", "A first-round Challenge whose problems are designed to make students think and to engage students with differing levels of problem-solving experience."]),
              row(["内容证据", "Content evidence"], ["当届格式由项目页规定；问题风格由官方历年试题、解答、investigations 和视频解答展示。", "The current page governs the live format; official past papers, solutions, investigations and video solutions demonstrate problem style."]),
            ],
          },
        ],
      },
      {
        id: "smc-paper-design",
        title: t("2026 试卷设计", "2026 paper design"),
        tables: [
          {
            columns: [t("部分", "Part"), t("题数", "Items"), t("作答方式", "Response mode"), t("官方状态", "Official status")],
            rows: [
              row(["前 22 题", "First 22 items"], ["22", "22"], ["选择题", "Multiple choice"], ["2026 项目页规定", "Specified on the 2026 competition page"]),
              row(["最后 3 题", "Final three items"], ["3", "3"], ["填写 000–999 的三位数字答案", "Enter a three-digit answer from 000 to 999"], ["2026 新试行格式；不是对未来赛季永久格式的推断", "New 2026 trial; not inferred to be permanent for future seasons"]),
            ],
            note: t("总时长 90 分钟。题目按大致难度排列，较难题靠后。", "Total time is 90 minutes. Questions are arranged in approximate order of difficulty, with harder questions later."),
          },
        ],
      },
      {
        id: "smc-official-corpus",
        title: t("官方内容实例与资料", "Official content examples and materials"),
        tables: [
          {
            columns: [t("资料", "Material"), t("官方提供内容", "Official contents"), t("解释限制", "Interpretive limit")],
            rows: [
              row(["Competition Papers", "Competition Papers"], ["历年 SMC Questions、Solutions、部分 investigations、marker／problem group comments 和视频解答。", "Past SMC Questions, Solutions, selected investigations, marker/problem-group comments and video solutions."], ["不能据往年主题频率声明当届必考范围。", "Past topic frequencies do not establish compulsory content for a live paper."]),
              row(["Senior Problems 与 Senior Bundle", "Senior Problems and Senior Bundle"], ["UKMT 项目页列出的官方出版物；Senior Problems 收录 1997–2016 年 500 题并按难度和主题整理。", "Official publications listed by UKMT; Senior Problems collects 500 questions from 1997–2016 and organises them by difficulty and topic."], ["书中主题分类是出版物结构，不是 UKMT 发布的 SMC 考纲表。", "The book's topic grouping is a publication structure, not an SMC syllabus published by UKMT."]),
            ],
          },
        ],
      },
    ],
    sources: [
      source("SMC 当前项目页", "Current SMC competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges/senior-mathematical-challenge", "webpage", "含 2026 年 22+3 试行格式。", "Includes the 2026 trial 22+3 format."),
      source("UKMT Senior Competitions 总览", "UKMT Senior Competitions overview", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges"),
      source("UKMT 官方试题、解答与探究库", "UKMT official papers, solutions and investigations", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("UKMT Senior Problems", "UKMT Senior Problems", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/product/senior-problems"),
    ],
    translationNote: t(
      "本页没有依据历年题自行列代数、几何、数论或组合知识点。2026 年最后三题的三位数字作答被标明为 UKMT 试行格式，后续赛季须重新核对。中文不是 UKMT 官方译本。",
      "This page does not derive algebra, geometry, number theory or combinatorics topics from past papers. The three-digit response format for the final three 2026 questions is identified as a UKMT trial and must be rechecked for later seasons. The Chinese text is not an official UKMT translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-senior-kangaroo-2026-27",
    slug: "senior-kangaroo",
    projectId: "senior-kangaroo",
    classification: "structure-only",
    title: t("Andrew Jobbings Senior Kangaroo 官方范围与结构", "Andrew Jobbings Senior Kangaroo Official Scope and Structure"),
    officialName: t("Andrew Jobbings 高级袋鼠赛", "Andrew Jobbings Senior Kangaroo"),
    applicableCycle: t("2026–27 赛季；2026 年 11 月 18 日", "2026–27 season; 18 November 2026"),
    status: "confirmed",
    summary: t(
      "Senior Kangaroo 是 SMC 后续轮次，当前为 60 分钟 20 道整数答案题。UKMT 没有公布逐知识点封闭考纲；官方范围由 Year 13 及以下定位、SMC 后续轮次关系、整数作答规则和问题解决目标构成。该轮只向英国学校开放。",
      "Senior Kangaroo is a follow-on round to SMC and currently consists of 20 integer-answer questions in 60 minutes. UKMT publishes no closed topic-by-topic syllabus; the official framework is defined by the Year 13-and-below age group, its relationship to SMC, the integer-response rules and the problem-solving focus. The round is open to UK schools only.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方范围与结构；无封闭知识点清单", "Official scope and structure; no closed topic list"),
      fact("试卷", "Paper", "60 分钟；20 道整数答案题", "60 minutes; 20 integer-answer questions"),
      fact("答案格式", "Answer format", "每题以 000–999 的三位数字记录", "Each answer is recorded as a three-digit number from 000 to 999"),
      fact("年龄上限", "Age group", "英格兰与威尔士 Year 13；苏格兰 S6；北爱尔兰 Year 14 及以下", "Year 13 and below in England and Wales; S6 in Scotland; Year 14 in Northern Ireland"),
      fact("进入方式", "Entry route", "依据 SMC 当届资格线邀请，或由学校 discretionary entry", "Invitation through the current SMC qualifying score or discretionary school entry"),
      fact("地域", "Availability", "仅英国学校", "UK schools only"),
    ],
    sections: [
      {
        id: "senior-kangaroo-official-boundary",
        title: t("官方公布的范围边界", "Published official boundary"),
        tables: [
          {
            columns: [t("项目", "Item"), t("UKMT 当前公布内容", "Current UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前 Senior Kangaroo 项目页及官方试题库未发布封闭知识点清单或固定主题权重。", "The current Senior Kangaroo page and official paper archive publish no closed topic list or fixed topic weightings."]),
              row(["内容定位", "Content positioning"], ["SMC 的后续挑战轮次；官方说明问题重在思考而非猜测。", "A follow-on challenge to SMC; UKMT states that the problems are designed for thinking rather than guessing."]),
              row(["难度次序", "Difficulty order"], ["题目按大致难度排列，较难题靠后；官方不预期考生在限时内做完全部题目。", "Problems are arranged in approximate order of difficulty with harder questions later; candidates are not expected to finish the whole paper."]),
            ],
          },
        ],
      },
      {
        id: "senior-kangaroo-paper-design",
        title: t("整数答案试卷设计", "Integer-answer paper design"),
        tables: [
          {
            columns: [t("要素", "Element"), t("规定", "Requirement")],
            rows: [
              row(["题量与时间", "Items and time"], ["20 道题，60 分钟。", "20 questions in 60 minutes."]),
              row(["答案编码", "Answer coding"], ["用 B 或 HB 非自动铅笔把每题答案编码为 000–999 的三位数字。", "Use a B or HB non-propelling pencil to code each answer as a three-digit number from 000 to 999."]),
              row(["工具", "Equipment"], ["允许空白草稿纸；方格纸、计算器和测量工具禁止。", "Blank rough paper is permitted; squared paper, calculators and measuring instruments are prohibited."]),
              row(["与选择题区别", "Difference from multiple choice"], ["没有五选一选项；须自行得到并编码整数答案。", "There are no five-option choices; candidates derive and code an integer answer."]),
            ],
          },
        ],
      },
      {
        id: "senior-kangaroo-official-corpus",
        title: t("官方内容实例与资料", "Official content examples and materials"),
        tables: [
          {
            columns: [t("资料", "Material"), t("官方提供内容", "Official contents"), t("解释限制", "Interpretive limit")],
            rows: [
              row(["Competition Papers", "Competition Papers"], ["历年 Senior Kangaroo 试题与解答。", "Past Senior Kangaroo papers and solutions."], ["用于确认官方问题和整数作答风格，不构成未来主题清单。", "Confirms official problem and integer-response style, not a future topic list."]),
              row(["Senior Problems／Senior Bundle", "Senior Problems / Senior Bundle"], ["UKMT 项目页列出的高级组出版物，提供 SMC 问题集及进一步几何材料。", "Senior-level UKMT publications listed on the competition page, providing SMC problem collections and further geometry material."], ["这些资料跨 SMC、Kangaroo 和 Olympiad 层次，不是 Senior Kangaroo 的封闭考纲。", "These resources span SMC, Kangaroo and Olympiad levels and do not constitute a closed Senior Kangaroo syllabus."]),
            ],
          },
        ],
      },
    ],
    sources: [
      source("Senior Kangaroo 当前项目页", "Current Senior Kangaroo competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges/andrew-jobbings-senior-kangaroo"),
      source("UKMT Senior Competitions 总览", "UKMT Senior Competitions overview", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges"),
      source("UKMT 官方试题与解答库", "UKMT official papers and solutions", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("UKMT Senior Problems", "UKMT Senior Problems", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/product/senior-problems"),
    ],
    translationNote: t(
      "本页不从历年题提炼非官方知识点范围。Senior Kangaroo 当前题数为 20，道题答案采用 000–999 三位数字；这与 SMC 2026 试行的最后三题格式是两个不同规定。中文不是 UKMT 官方译本。",
      "This page does not derive an unofficial topic syllabus from past papers. Senior Kangaroo currently has 20 questions with 000–999 three-digit answers; this is a separate rule from the trial format for the final three SMC questions in 2026. The Chinese text is not an official UKMT translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-bmo-1-2026-27",
    slug: "bmo-1",
    projectId: "bmo1",
    classification: "structure-only",
    title: t("BMO Round 1 官方范围与书面证明标准", "BMO Round 1 Official Scope and Written-Proof Standard"),
    officialName: t("英国数学奥林匹克第一轮", "British Mathematical Olympiad Round 1"),
    applicableCycle: t("2026–27 赛季；2026 年 11 月 18 日", "2026–27 season; 18 November 2026"),
    status: "confirmed",
    summary: t(
      "BMO1 当前没有 BMOS／UKMT 发布的封闭知识点考纲。官方定义集中在奥林匹克问题解决与完整书面证明：3.5 小时完成 6 道题，每题 10 分；只写答案几乎不得分，所有关键断言须证明，论证的清楚与完整直接影响得分。官方历年题、解答、阅卷报告、marking notes 和指定出版物用于展示标准，但不能反推下一届题目范围。",
      "BMOS and UKMT do not currently publish a closed topic syllabus for BMO1. The official definition centres on olympiad problem solving and complete written proof: six questions in 3.5 hours, each worth 10 marks. Answers alone receive little or no credit; material assertions must be proved, and clarity and completeness directly affect marks. Official papers, solutions, marker reports, marking notes and named publications demonstrate the standard but do not define the content of the next paper.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "赛制与证明标准；无官方封闭知识点清单", "Structure and proof standard; no official closed topic list"),
      fact("试卷", "Paper", "3.5 小时；6 道完整解答题；每题 10 分", "3.5 hours; six full-solution problems; 10 marks each"),
      fact("作答要求", "Response requirement", "完整书面解答；所有断言须给出完整证明", "Full written solutions with complete proofs of all assertions"),
      fact("题目次序", "Problem order", "第一题拟设计得比其余题更易接近", "The first problem is intended to be more accessible than the rest"),
      fact("工具", "Equipment", "可用直尺、三角板和圆规；禁用计算器和量角器", "Rulers, set squares and compasses permitted; calculators and protractors prohibited"),
      fact("竞赛关系", "Competition relationship", "SMC 后续轮次，也是英国国际竞赛训练与选拔体系入口", "A follow-on round to SMC and an entry point to the UK's international-competition training and selection programme"),
    ],
    sections: [
      {
        id: "bmo1-scope-status",
        title: t("官方范围状态", "Official scope status"),
        tables: [
          {
            columns: [t("项目", "Item"), t("BMOS／UKMT 当前公布内容", "Current BMOS/UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前 BMO1 项目页、BMOS BMO 页面和 marking notes 没有公布封闭知识点清单或主题权重。", "The current BMO1 page, BMOS BMO page and marking notes publish no closed topic list or topic weightings."]),
              row(["内容定位", "Content positioning"], ["SMC 高分学生的奥林匹克后续轮次，也是进一步国际竞赛训练和选拔的入口。", "An olympiad follow-on round for high SMC performers and an entry point to further international-competition training and selection."]),
              row(["官方内容证据", "Official content evidence"], ["历年 papers、solutions、marker reports、视频解答和出版物展示题目与证明标准。", "Past papers, solutions, marker reports, video solutions and publications demonstrate the problems and proof standard."]),
              row(["解释限制", "Interpretive limit"], ["不得把历年题主题统计或 Primer 中的 algebra／combinatorics／geometry 章节转写为当届考纲。", "Past-paper topic counts and the algebra/combinatorics/geometry chapters in the Primer must not be restated as a live syllabus."]),
            ],
          },
        ],
      },
      {
        id: "bmo1-written-proof",
        title: t("完整书面证明要求", "Full written-proof requirement"),
        tables: [
          {
            columns: [t("要求", "Requirement"), t("官方说明", "Official statement")],
            rows: [
              row(["完整解答", "Complete solution"], ["不仅给答案；所有断言须完整证明。", "Not merely an answer; every assertion must be fully proved."]),
              row(["书写过程", "Write-up process"], ["先在草稿中工作，再仔细组织最终版本并提交最佳完整尝试。", "Work in rough first, then carefully draft the final version and submit the best complete attempt."]),
              row(["选题取舍", "Attempt selection"], ["一份完整解答获得的分数远高于六题都只写部分进展。", "One complete solution earns substantially more credit than partial attempts at all six problems."]),
              row(["表达", "Presentation"], ["蓝或黑墨水书写正文；图可用铅笔和其他颜色；清楚、可核验的推理是计分对象。", "Main work is written in blue or black ink; diagrams may use pencil or other colours; clear, checkable reasoning is assessed."]),
            ],
          },
        ],
      },
      {
        id: "bmo1-marking-standard",
        title: t("BMOS 阅卷说明", "BMOS marking standard"),
        tables: [
          {
            columns: [t("原则", "Principle"), t("含义", "Meaning")],
            rows: [
              row(["答案本身", "Answer alone"], ["只写正确答案通常得分很少；官方示例中，无论答案正确，完全无论证可得 0 分。", "A correct answer alone generally earns very little; in the official example, an unsupported correct answer earns zero."]),
              row(["完整性", "Completeness"], ["满分要求全部推理得到认真说明；遗漏双向命题的一边等逻辑缺口会扣分。", "Full marks require all reasoning to be carefully explained; logical gaps such as omitting one direction of an equivalence lose marks."]),
              row(["方法", "Method"], ["正确且完整的方法均可得满分；简洁或优雅值得肯定，但不额外加分。", "Any correct and fully explained method can receive full marks; elegance and brevity earn no extra marks."]),
              row(["部分进展", "Partial progress"], ["非平凡进展会获分，但高分依赖少量完整解答，而非大量未完成尝试。", "Non-trivial progress is rewarded, but high scores depend on a small number of complete solutions rather than many unfinished attempts."]),
              row(["算术失误", "Arithmetic slips"], ["单个轻微算术失误通常不重罚，后续正确方法可按 follow-through 获得相应分数。", "A single minor arithmetic slip is not heavily penalised, and correct subsequent reasoning can receive follow-through credit."]),
            ],
          },
        ],
      },
      {
        id: "bmo1-official-materials",
        title: t("官方材料及其范围", "Official materials and their scope"),
        tables: [
          {
            columns: [t("资料", "Material"), t("官方说明", "Official description")],
            rows: [
              row(["BMOS BMO 档案", "BMOS BMO archive"], ["保存 BMO1／BMO2 历年试题、解答、报告与赛事历史；BMOS 同时提供 1993 年以来题目合订 PDF。", "Holds historical BMO1/BMO2 papers, solutions, reports and history; BMOS also provides a combined PDF of problems from 1993 onwards."]),
              row(["A Mathematical Olympiad Primer", "A Mathematical Olympiad Primer"], ["UKMT／BMOS 明确用于 BMO1：含 algebra、combinatorics、geometry 理论及 1996–2010 BMO1 题解。", "Explicitly identified by UKMT/BMOS for BMO1; contains theory in algebra, combinatorics and geometry and BMO1 problems and solutions from 1996–2010."]),
              row(["A Mathematical Olympiad Primer II", "A Mathematical Olympiad Primer II"], ["分析 2011–2022 年 BMO1 全部问题，是前一册续编。", "Analyses all BMO1 problems from 2011–2022 as a sequel to the first Primer."]),
              row(["几何书", "Geometry books"], ["BMOS 明确列 Plane Euclidean Geometry（尤其第 3–7 章）、Crossing the Bridge；并把 New Problems in Euclidean Geometry 列为更进阶选择。", "BMOS explicitly names Plane Euclidean Geometry (especially chapters 3–7) and Crossing the Bridge, and identifies New Problems in Euclidean Geometry for more serious geometers."]),
            ],
            note: t("这些材料展示知识与证明层次，不构成下一届 BMO1 的封闭知识点清单。", "These materials demonstrate content and proof level but do not constitute a closed syllabus for the next BMO1 paper."),
          },
        ],
      },
    ],
    sources: [
      source("BMO1 当前项目页", "Current BMO1 competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges/british-maths-olympiad-round-1"),
      source("BMOS British Mathematical Olympiads 档案", "BMOS British Mathematical Olympiads archive", "英国数学奥林匹克委员会（BMOS）", "British Mathematical Olympiad Subtrust (BMOS)", "https://bmos.ukmt.org.uk/home/bmo"),
      source("BMO Marking 阅卷说明", "BMO Marking notes", "英国数学奥林匹克委员会（BMOS）", "British Mathematical Olympiad Subtrust (BMOS)", "https://bmos.ukmt.org.uk/home/bmomarking.pdf", "pdf"),
      source("UKMT 官方试题与解答库", "UKMT official papers and solutions", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("A Mathematical Olympiad Primer（第二版）", "A Mathematical Olympiad Primer (2nd Edition)", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/product/a-mathematical-olympiad-primer-2nd-edition"),
    ],
    translationNote: t(
      "BMO1 没有被改写为按历年题统计出的“代数／几何／数论／组合考纲”。Primer 的主题只作为官方书目内容说明；比赛本身以完整书面证明、清晰论证和当届试题为准。中文不是 UKMT／BMOS 官方译本。",
      "BMO1 is not recast here as an algebra/geometry/number theory/combinatorics syllabus inferred from past papers. Topics in the Primer are reported only as the contents of an official publication; the competition itself is governed by the full-written-proof standard and the live paper. The Chinese text is not an official UKMT/BMOS translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-bmo-2-2026-27",
    slug: "bmo-2",
    projectId: "bmo2",
    classification: "structure-only",
    title: t("BMO Round 2 官方范围与书面证明标准", "BMO Round 2 Official Scope and Written-Proof Standard"),
    officialName: t("英国数学奥林匹克第二轮", "British Mathematical Olympiad Round 2"),
    applicableCycle: t("2026–27 赛季；2027 年 1 月 20 日", "2026–27 season; 20 January 2027"),
    status: "confirmed",
    summary: t(
      "BMO2 当前没有 BMOS／UKMT 发布的封闭知识点考纲。官方将其定位为英国难度最高的全国数学竞赛、面向已在 BMO1 取得成功的学生；试卷为 3.5 小时 4 道题，每题 10 分，必须提交完整书面证明。官方档案、解答、报告、marking notes 和 A Mathematical Olympiad Companion 等资料展示标准，但不能用于宣称下一届固定知识范围。",
      "BMOS and UKMT do not currently publish a closed topic syllabus for BMO2. UKMT identifies it as the UK's hardest national mathematics competition, intended to stretch students who have succeeded at BMO1. The paper has four problems in 3.5 hours, each worth 10 marks, and requires complete written proofs. Official archives, solutions, reports, marking notes and resources such as A Mathematical Olympiad Companion demonstrate the standard but do not establish a fixed syllabus for the next paper.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "赛制与证明标准；无官方封闭知识点清单", "Structure and proof standard; no official closed topic list"),
      fact("官方定位", "Official positioning", "英国难度最高的全国数学竞赛；面向 BMO1 成功者", "The UK's hardest national mathematics competition; intended for students successful at BMO1"),
      fact("试卷", "Paper", "3.5 小时；4 道完整解答题；每题 10 分", "3.5 hours; four full-solution problems; 10 marks each"),
      fact("作答要求", "Response requirement", "完整书面解答；所有断言须给出完整证明", "Full written solutions with complete proofs of all assertions"),
      fact("工具", "Equipment", "可用直尺和圆规；禁用计算器和量角器", "Rulers and compasses permitted; calculators and protractors prohibited"),
      fact("进入方式", "Entry route", "依据 BMO1 表现、年龄与英国代表资格邀请约 100 人；另可由学校 discretionary entry", "Around 100 invited based on BMO1 performance, age and UK eligibility; discretionary school entry also available"),
    ],
    sections: [
      {
        id: "bmo2-scope-status",
        title: t("官方范围状态", "Official scope status"),
        tables: [
          {
            columns: [t("项目", "Item"), t("BMOS／UKMT 当前公布内容", "Current BMOS/UKMT publication")],
            rows: [
              row(["逐知识点考纲", "Topic-by-topic syllabus"], ["当前 BMO2 项目页、BMOS BMO 页面和 marking notes 未发布封闭知识点清单或固定主题权重。", "The current BMO2 page, BMOS BMO page and marking notes publish no closed topic list or fixed topic weightings."]),
              row(["内容定位", "Content positioning"], ["BMO1 的更高阶后续轮次；官方称其为英国最难的全国数学竞赛。", "A higher-level follow-on to BMO1, described by UKMT as the UK's hardest national mathematics competition."]),
              row(["官方内容证据", "Official content evidence"], ["历年 BMO2 试题、官方解答、markers' reports、视频解答和 Companion 等出版物展示难度与证明要求。", "Past BMO2 papers, official solutions, marker reports, video solutions and publications such as the Companion demonstrate difficulty and proof requirements."]),
              row(["解释限制", "Interpretive limit"], ["历史题型、专题书或前一轮内容均不构成当届 BMO2 的封闭范围承诺。", "Historical topics, specialist books and earlier-round content do not constitute a closed promise of live BMO2 content."]),
            ],
          },
        ],
      },
      {
        id: "bmo2-written-proof",
        title: t("完整书面证明要求", "Full written-proof requirement"),
        tables: [
          {
            columns: [t("要求", "Requirement"), t("官方说明", "Official statement")],
            rows: [
              row(["完整解答", "Complete solution"], ["不仅给答案；每个关键断言需要完整证明。", "Not merely an answer; every material assertion requires a complete proof."]),
              row(["书写过程", "Write-up process"], ["先用草稿推演，再仔细组织最终版本。", "Work through ideas in rough and then prepare a carefully organised final version."]),
              row(["选题取舍", "Attempt selection"], ["一至两份完整解答远比四题都只写部分尝试得分高。", "One or two complete solutions earn substantially more credit than partial attempts at all four problems."]),
              row(["表达", "Presentation"], ["正文用蓝或黑墨水；图可用铅笔和其他颜色；清楚、完整和逻辑正确的证明是计分核心。", "Main work is in blue or black ink; diagrams may use pencil or other colours; clear, complete and logically valid proof is central to marking."]),
            ],
          },
        ],
      },
      {
        id: "bmo2-marking-standard",
        title: t("BMOS 阅卷标准的适用原则", "Applicable BMOS marking principles"),
        tables: [
          {
            columns: [t("原则", "Principle"), t("含义", "Meaning")],
            rows: [
              row(["每题 10 分", "Ten marks per problem"], ["BMO marking notes 以每题 10 分解释完整解答、缺口和非平凡进展的计分。", "The BMO marking notes use a ten-mark scale to explain complete solutions, gaps and non-trivial progress."]),
              row(["完整推理", "Complete reasoning"], ["满分要求所有推理得到认真说明，正确答案本身不等于完整解答。", "Full marks require all reasoning to be carefully explained; a correct answer alone is not a complete solution."]),
              row(["方法中立", "Method neutrality"], ["正确且完整的方法均可得满分；优雅和简洁不额外加分。", "Any correct, complete method may receive full marks; elegance and brevity receive no bonus."]),
              row(["部分进展", "Partial progress"], ["实质性进展会获分，但高分主要来自完整解决少数题。", "Substantial progress is rewarded, but high marks primarily come from fully solving a small number of problems."]),
            ],
          },
        ],
      },
      {
        id: "bmo2-official-materials",
        title: t("官方材料及其范围", "Official materials and their scope"),
        tables: [
          {
            columns: [t("资料", "Material"), t("官方说明", "Official description")],
            rows: [
              row(["BMOS BMO 档案", "BMOS BMO archive"], ["保存 BMO2 历年试题、解答和赛事历史；旧称 Further International Selection Test 的历史也在同页说明。", "Holds historical BMO2 papers, solutions and competition history, including the period when the paper was called the Further International Selection Test."]),
              row(["A Mathematical Olympiad Companion", "A Mathematical Olympiad Companion"], ["UKMT 将其定位为 Primer 的更高阶续编；Olympiad Bundle 说明该书覆盖 2002–2016 BMO2 问题。", "UKMT positions it as a harder sequel to the Primer; the Olympiad Bundle states that it covers BMO2 problems from 2002–2016."]),
              row(["几何书", "Geometry books"], ["BMOS 明确推荐 Plane Euclidean Geometry、Crossing the Bridge，并把 New Problems in Euclidean Geometry 列为更进阶几何资料。", "BMOS explicitly recommends Plane Euclidean Geometry and Crossing the Bridge, and lists New Problems in Euclidean Geometry as a more advanced geometry resource."]),
              row(["UKMT／BMOS 解答与报告", "UKMT/BMOS solutions and reports"], ["Competition Papers 与 BMOS 档案提供官方解答、视频及部分 markers' reports。", "Competition Papers and the BMOS archive provide official solutions, videos and selected marker reports."]),
            ],
            note: t("这些材料展示证明难度与书写标准，不是固定命题范围。", "These materials demonstrate proof difficulty and writing standards; they are not a fixed content specification."),
          },
        ],
      },
    ],
    sources: [
      source("BMO2 当前项目页", "Current BMO2 competition page", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/senior-challenges/british-maths-olympiad-round-2"),
      source("BMOS British Mathematical Olympiads 档案", "BMOS British Mathematical Olympiads archive", "英国数学奥林匹克委员会（BMOS）", "British Mathematical Olympiad Subtrust (BMOS)", "https://bmos.ukmt.org.uk/home/bmo"),
      source("BMO Marking 阅卷说明", "BMO Marking notes", "英国数学奥林匹克委员会（BMOS）", "British Mathematical Olympiad Subtrust (BMOS)", "https://bmos.ukmt.org.uk/home/bmomarking.pdf", "pdf"),
      source("UKMT 官方试题与解答库", "UKMT official papers and solutions", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/competition-papers"),
      source("A Mathematical Olympiad Companion", "A Mathematical Olympiad Companion", ukmtProvider.zh, ukmtProvider.en, "https://ukmt.org.uk/product/a-mathematical-olympiad-companion"),
    ],
    translationNote: t(
      "BMO2 没有被改写为根据历史题统计出的专题考纲。官方书目只说明可用资料及其难度，不能据此声明下一届会考某类题。中文不是 UKMT／BMOS 官方译本；full written solutions 与 complete proofs 的英文要求保留在页面中。",
      "BMO2 is not recast as a subject syllabus inferred from historical questions. Official publications identify resources and level but cannot be used to claim that a particular topic will appear next year. The Chinese text is not an official UKMT/BMOS translation; the English requirements for full written solutions and complete proofs are retained.",
    ),
    lastVerified: VERIFIED_AT,
  },
];
