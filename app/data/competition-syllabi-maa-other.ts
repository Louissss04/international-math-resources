import {
  t,
  type AssessmentSyllabusRecord,
  type FactRecord,
  type SyllabusSourceRecord,
} from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";
const AIME_VERIFIED_AT = "2026-08-29";
const HMMT_VERIFIED_AT = "2026-08-11";

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
  format: SyllabusSourceRecord["format"] = "webpage",
  versionZh?: string,
  versionEn?: string,
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  format,
  ...(versionZh && versionEn ? { version: t(versionZh, versionEn) } : {}),
});

const maaAmcOverview = syllabusSource(
  "MAA 美国数学竞赛项目说明",
  "MAA American Mathematics Competitions Overview",
  "美国数学协会（MAA）",
  "Mathematical Association of America (MAA)",
  "https://maa.org/student-programs/amc/",
  "webpage",
  "2026–27 赛季现行页面",
  "Current 2026–27 cycle page",
);

const maaAmcPolicies = syllabusSource(
  "MAA 美国数学竞赛政策",
  "MAA American Mathematics Competitions Policies",
  "美国数学协会（MAA）",
  "Mathematical Association of America (MAA)",
  "https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/",
  "webpage",
  "截至 2026 年 8 月现行政策",
  "Current policies as of August 2026",
);

export const maaOtherCompetitionSyllabi: AssessmentSyllabusRecord[] = [
  {
    id: "syllabus-amc8-current",
    slug: "amc-8-current-scope",
    projectId: "amc8",
    classification: "content-framework",
    title: t("AMC 8 官方内容范围", "Official AMC 8 Content Framework"),
    officialName: t("MAA AMC 8", "MAA AMC 8"),
    applicableCycle: t("2026–27 MAA AMC 赛季", "2026–27 MAA AMC cycle"),
    status: "confirmed",
    summary: t(
      "MAA 公布了 AMC 8 的年级层级、题量、时长和一组概括性内容主题，但没有发布逐知识点、按题量或按权重展开的正式考纲。本记录只整理官方明示范围；不根据历年试题补写主题分布。",
      "MAA publishes the AMC 8 grade level, item count, duration and a broad set of content topics, but no formal topic-by-topic specification or weighting blueprint. This record includes only the stated official scope and does not infer topic distributions from past papers.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方概括性内容框架；不是逐项正式考纲", "Official broad content framework, not a formal itemized specification"),
      fact("题型与题量", "Format", "25 道选择题", "25 multiple-choice questions"),
      fact("时长", "Duration", "40 分钟", "40 minutes"),
      fact("参赛层级", "Student level", "8 年级及以下；比赛日未满 15.5 岁", "Grade 8 and below; under 15.5 years old on competition day"),
      fact("内容基准", "Content basis", "初中数学主题与超出常规课堂的数学问题解决", "Middle-school mathematics topics and mathematical problem solving beyond the standard curriculum"),
      fact("计算器", "Calculator", "不得使用；MAA 说明试题不需要计算器", "Not permitted; MAA states that no problem requires a calculator"),
    ],
    sections: [
      {
        id: "amc8-publication-status",
        title: t("官方文件状态", "Status of the official framework"),
        paragraphs: [
          t(
            "MAA 当前项目页以说明文字列出“focuses on”与“may touch on”的主题，没有单独发布包含学习目标、子主题、题量权重或难度比例的 AMC 8 syllabus。",
            "The current MAA program page lists topics under “focuses on” and “may touch on.” It does not publish a separate AMC 8 syllabus with learning objectives, subtopics, item weights or difficulty proportions.",
          ),
        ],
      },
      {
        id: "amc8-stated-scope",
        title: t("官方明示内容", "Officially stated content"),
        tables: [
          {
            columns: [t("内容／能力", "Content or skill"), t("官方边界", "Official boundary")],
            rows: [
              row(["计数与概率", "Counting and probability"], ["列为主要初中数学主题", "Listed as a principal middle-school topic"]),
              row(["估算", "Estimation"], ["列为主要主题", "Listed as a principal topic"]),
              row(["比例推理", "Proportional reasoning"], ["列为主要主题", "Listed as a principal topic"]),
              row(["初等几何", "Elementary geometry"], ["包括勾股定理", "Includes the Pythagorean Theorem"]),
              row(["空间想象", "Spatial visualization"], ["列为主要能力", "Listed as a principal skill"]),
              row(["图表解读", "Interpreting graphs and tables"], ["列为主要能力", "Listed as a principal skill"]),
            ],
            note: t(
              "MAA 未给出上述主题的题量或百分比。",
              "MAA does not assign item counts or percentages to these topics.",
            ),
          },
        ],
      },
      {
        id: "amc8-later-items",
        title: t("后段题目与范围边界", "Later items and scope boundary"),
        tables: [
          {
            columns: [t("项目", "Element"), t("官方表述", "Official statement")],
            rows: [
              row(["初步代数", "Beginning algebra"], ["部分后段题目可能涉及", "Some later questions may touch on it"]),
              row(["线性或二次函数", "Linear or quadratic functions"], ["作为初步代数的官方例子", "Official examples of beginning-algebra content"]),
              row(["坐标几何", "Coordinate geometry"], ["作为可能出现的后段内容例子", "An example of content that may appear in later questions"]),
              row(["排除清单", "Exclusion list"], ["MAA 未公布单独的排除主题清单", "MAA publishes no separate list of excluded topics"]),
            ],
          },
        ],
      },
      {
        id: "amc8-format-boundary",
        title: t("考试结构与可用材料", "Test structure and permitted materials"),
        tables: [
          {
            columns: [t("项目", "Element"), t("规定", "Rule")],
            rows: [
              row(["题量／时长", "Items / time"], ["25 道选择题／40 分钟", "25 multiple-choice questions / 40 minutes"]),
              row(["参赛次数", "Attempts"], ["每年仅可参加一次 AMC 8", "One AMC 8 administration per student each year"]),
              row(["计算器与电子设备", "Calculators and electronics"], ["禁止使用计算器、手机及同类电子设备", "Calculators, phones and similar electronic devices are prohibited"]),
              row(["非电子材料", "Non-electronic materials"], ["书写工具、由考点提供的空白草稿纸、直尺与橡皮", "Writing utensils, blank scratch paper supplied by the site, rulers and erasers"]),
            ],
          },
        ],
      },
    ],
    sources: [maaAmcOverview, maaAmcPolicies],
    translationNote: t(
      "本页把 MAA 的 focuses on 译为“主要内容”，may touch on 译为“可能涉及”，保留两者确定程度的差别；不把官方举例扩展成完整知识清单。",
      "This page renders “focuses on” as 主要内容 and “may touch on” as 可能涉及, preserving the different degrees of certainty. Official examples are not expanded into a complete topic list.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-china-league-official-scope",
    slug: "china-high-school-league-official-scope",
    projectId: "china-league",
    classification: "content-framework",
    title: t("全国高中数学联赛官方范围说明", "Official National High School Mathematics League Scope"),
    officialName: t("全国高中数学联赛", "National High School Mathematics League"),
    applicableCycle: t(
      "截至 2026 年 8 月中国数学会官网仍公开使用的范围页；原页发布于 2017 年",
      "Official scope page still published by the Chinese Mathematical Society as of August 2026; originally posted in 2017",
    ),
    status: "confirmed",
    summary: t(
      "中国数学会官网给出一试的课程边界、二试的扩展原则与四个专题，并列明题型、时长和分值；但页面不是逐知识点正式大纲，而且一试仍引用教育部 2000 年高中数学教学大纲。官网截至核验日未见更新版专题细目，因此本记录标为“官方内容框架”，并保留文件年代说明。",
      "The Chinese Mathematical Society states the Round 1 curriculum boundary, the extension principle and four areas for Round 2, plus formats, timing and marks. The page is not a topic-by-topic formal syllabus and still refers to the Ministry of Education's 2000 senior-high mathematics teaching syllabus. No newer official topic catalogue was found as of verification, so this record is classified as an official content framework with its publication date retained.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方范围与结构说明；非逐知识点正式考纲", "Official scope and structure statement, not a topic-by-topic formal syllabus"),
      fact("一试范围", "Round 1 boundary", "不超出教育部 2000 年高中数学教学大纲的教学要求与内容，但方法要求提高", "Does not exceed the requirements and content of the Ministry's 2000 senior-high mathematics syllabus, with higher demands on methods"),
      fact("二试范围", "Round 2 boundary", "与 IMO 接轨，并适当增加教学大纲外内容", "Aligned with the IMO and includes some content beyond the school syllabus"),
      fact("二试专题", "Round 2 areas", "平面几何、代数、数论、组合", "Plane geometry, algebra, number theory and combinatorics"),
      fact("一试", "Round 1", "80 分钟，8 道填空题与 3 道解答题，满分 120", "80 minutes, eight fill-in questions and three solution questions, 120 marks"),
      fact("二试", "Round 2", "150 分钟，4 道解答题，满分 180", "150 minutes, four solution questions, 180 marks"),
    ],
    sections: [
      {
        id: "china-league-source-status",
        title: t("官方文件状态", "Status of the official document"),
        paragraphs: [
          t(
            "中国数学会现行可访问页面发布于 2017 年，采用“知识范围”和“试卷结构”说明，而非按章节列出学习目标的正式 syllabus。",
            "The currently accessible Chinese Mathematical Society page was published in 2017. It states a knowledge boundary and paper structure rather than a formal syllabus organized by learning objectives.",
          ),
          t(
            "一试所引用的基准是教育部 2000 年《全日制普通高级中学数学教学大纲》；本页不把后来的课程标准自动替换进去。",
            "Round 1 refers specifically to the Ministry of Education's 2000 Full-time General Senior High School Mathematics Teaching Syllabus. This record does not silently replace that reference with later curriculum standards.",
          ),
        ],
      },
      {
        id: "china-league-round-one",
        title: t("一试范围", "Round 1 scope"),
        tables: [
          {
            columns: [t("项目", "Element"), t("官方边界", "Official boundary")],
            rows: [
              row(["知识内容", "Knowledge content"], ["不超出教育部 2000 年高中数学教学大纲规定的要求与内容", "Does not exceed the requirements and content in the Ministry's 2000 senior-high mathematics syllabus"]),
              row(["方法要求", "Methodological demand"], ["在学校教学大纲基础上有所提高", "Raised beyond the ordinary methodological demand of the school syllabus"]),
              row(["专题权重", "Topic weighting"], ["中国数学会页面未公布", "Not published on the Chinese Mathematical Society page"]),
              row(["子主题清单", "Subtopic list"], ["中国数学会页面未逐项列出", "Not itemized on the Chinese Mathematical Society page"]),
            ],
          },
        ],
      },
      {
        id: "china-league-round-two",
        title: t("二试范围", "Round 2 scope"),
        tables: [
          {
            columns: [t("专题", "Area"), t("官方定位", "Official positioning")],
            rows: [
              row(["平面几何", "Plane geometry"], ["二试四个方面之一", "One of the four Round 2 areas"]),
              row(["代数", "Algebra"], ["二试四个方面之一", "One of the four Round 2 areas"]),
              row(["数论", "Number theory"], ["二试四个方面之一", "One of the four Round 2 areas"]),
              row(["组合", "Combinatorics"], ["二试四个方面之一", "One of the four Round 2 areas"]),
            ],
            note: t(
              "官方仅列专题名称，并说明与国际数学奥林匹克接轨、适当增加教学大纲外内容；未公布各专题固定题序或权重。",
              "The official page names the four areas and states that Round 2 aligns with the IMO and adds some out-of-syllabus content; it gives no fixed order or weighting by area.",
            ),
          },
        ],
      },
      {
        id: "china-league-format",
        title: t("试卷结构与分值", "Paper structure and marks"),
        tables: [
          {
            columns: [t("场次", "Round"), t("时长", "Duration"), t("题型", "Questions"), t("分值", "Marks")],
            rows: [
              row(["一试", "Round 1"], ["80 分钟", "80 minutes"], ["8 道填空题；3 道解答题", "Eight fill-in questions; three solution questions"], ["填空每题 8 分；解答题 16、20、20 分；满分 120", "Eight marks per fill-in; solution questions worth 16, 20 and 20; total 120"]),
              row(["二试", "Round 2"], ["150 分钟", "150 minutes"], ["4 道解答题", "Four solution questions"], ["前两题各 40 分；后两题各 50 分；满分 180", "First two worth 40 each; last two worth 50 each; total 180"]),
            ],
          },
        ],
      },
      {
        id: "china-league-boundary",
        title: t("公开信息边界", "Boundary of published information"),
        bullets: [
          t("官网没有为一试公布按代数、几何、概率等划分的固定题量。", "The official page gives no fixed Round 1 item counts by algebra, geometry, probability or other domains."),
          t("官网没有为二试四个专题公布固定权重或必然各出一题的规则。", "The official page gives no fixed weighting for the four Round 2 areas and does not state that each must appear exactly once."),
          t("历年命题分布不在本记录中被当作正式大纲。", "Past-paper distributions are not treated here as a formal syllabus."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "全国高中数学联赛",
        "National High School Mathematics League",
        "中国数学会",
        "Chinese Mathematical Society",
        "https://www.cms.org.cn/Home/comp/comp_details/id/79.html",
        "webpage",
        "2017 年发布；截至 2026 年 8 月仍为官网公开范围页",
        "Published in 2017; still the official public scope page as of August 2026",
      ),
    ],
    translationNote: t(
      "一试、二试分别译为 Round 1、Round 2；“教学大纲之外”按原文保留，不扩写为自行整理的奥数知识树。原文所指 2000 年教学大纲的年份不可省略。",
      "一试 and 二试 are rendered as Round 1 and Round 2. “Beyond the teaching syllabus” is preserved without expanding it into a self-created Olympiad topic tree. The 2000 date of the referenced syllabus is retained.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-cmo-public-status",
    slug: "cmo-public-content-status",
    projectId: "cmo",
    classification: "structure-only",
    title: t("中国数学奥林匹克公开范围与资料说明", "Published Scope and Materials for the Chinese Mathematical Olympiad"),
    officialName: t("全国中学生数学奥林匹克竞赛（决赛）暨全国中学生数学冬令营", "Chinese Mathematical Olympiad Final and National High School Mathematics Winter Camp"),
    applicableCycle: t("截至 2026 年 8 月的中国数学会公开资料", "Chinese Mathematical Society public materials as of August 2026"),
    status: "confirmed",
    summary: t(
      "中国数学会和 CMO 官方站当前公开的是赛事通知、营员名单、获奖名单与国家集训队信息，没有可直接访问的 CMO 正式考纲、主题范围、题型分值表、试题或标准解答库。本记录只呈现官方公开的选拔与资料结构，不用通行说法或历年试题反推考纲。",
      "The Chinese Mathematical Society and official CMO portal currently publish notices, participant rosters, award lists and national training-team information. They do not provide a directly accessible formal CMO syllabus, topic scope, item-and-mark blueprint, or official paper-and-solution archive. This record therefore presents only the published selection and information structure and does not infer a syllabus from conventional descriptions or past papers.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "仅有公开组织与选拔结构；未公开内容考纲", "Public organizational and selection structure only; no public content syllabus"),
      fact("赛事层级", "Competition level", "全国中学生数学奥林匹克竞赛决赛，与全国中学生数学冬令营合并举行", "National final of the Chinese Mathematical Olympiad, held with the National High School Mathematics Winter Camp"),
      fact("选拔关系", "Selection relationship", "营员在全国高中数学联赛复评后确定", "Participants are determined after national review of the High School Mathematics League"),
      fact("公开内容", "Public materials", "营员公示、获奖名单、国家集训队及集训通知", "Participant notices, award lists, national training-team rosters and training notices"),
      fact("主题范围", "Topic scope", "未在现行公开页面列出", "Not stated on the current public pages"),
      fact("试卷结构", "Paper structure", "未在现行公开页面列出", "Not stated on the current public pages"),
    ],
    sections: [
      {
        id: "cmo-official-publication-status",
        title: t("官网公开资料", "Materials published on official sites"),
        paragraphs: [
          t(
            "中国数学会的 CMO 分类页按届发布营员与获奖信息；CMO 官方门户主要发布赛事资讯和国家集训队通知。两个入口均未提供可称为现行正式考纲的文件。",
            "The Chinese Mathematical Society CMO archive publishes participant and award information by year, while the official CMO portal primarily carries event news and national training-team notices. Neither entry point provides a document that can be identified as a current formal syllabus.",
          ),
        ],
      },
      {
        id: "cmo-selection-structure",
        title: t("公开选拔结构", "Published selection structure"),
        tables: [
          {
            columns: [t("阶段", "Stage"), t("官方公开关系", "Published relationship")],
            rows: [
              row(["全国高中数学联赛", "National High School Mathematics League"], ["赛区试卷报送并进行全国复评", "Regional papers are submitted for national review"]),
              row(["CMO 决赛／冬令营", "CMO Final / Winter Camp"], ["复评后确定营员并公示名单", "Participants are determined after review and the roster is published"]),
              row(["国家集训队", "National training team"], ["中国数学会公开名单及后续集训通知", "The Chinese Mathematical Society publishes the roster and subsequent training notices"]),
            ],
          },
        ],
      },
      {
        id: "cmo-published-materials",
        title: t("官网实际公开的材料", "Materials actually published on official sites"),
        tables: [
          {
            columns: [t("材料类别", "Material category"), t("公开状态", "Public status")],
            rows: [
              row(["营员名单", "Participant rosters"], ["公开", "Published"]),
              row(["获奖名单", "Award lists"], ["公开", "Published"]),
              row(["国家集训队与集训通知", "Training-team rosters and notices"], ["公开", "Published"]),
              row(["正式考纲／命题范围", "Formal syllabus / test scope"], ["未见公开", "Not publicly available"]),
              row(["官方试题与标准解答库", "Official paper-and-solution archive"], ["未见可直接访问的系统档案", "No directly accessible systematic archive found"]),
            ],
          },
        ],
      },
      {
        id: "cmo-omitted-claims",
        title: t("本记录不采用的推断", "Claims not inferred in this record"),
        bullets: [
          t("不以历年试题出现的代数、几何、数论、组合比例代替官方考纲。", "Past-paper proportions in algebra, geometry, number theory or combinatorics are not substituted for an official syllabus."),
          t("不把非官方备赛书的目录标为 CMO 命题范围。", "The contents of unofficial preparation books are not labelled as the CMO test scope."),
          t("未获官方公开页面支持的题量、时长与分值不写入本考纲记录。", "Item count, timing and marks unsupported by the cited official public pages are omitted."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "中国数学会 CMO 公告档案",
        "Chinese Mathematical Society CMO Notice Archive",
        "中国数学会",
        "Chinese Mathematical Society",
        "https://www.cms.org.cn/Home/comp/comp/cid/13.html",
        "webpage",
        "截至 2026 年 8 月的公开档案",
        "Public archive as of August 2026",
      ),
      syllabusSource(
        "2025 年 CMO 营员名单公示",
        "2025 CMO Participant Roster Notice",
        "中国数学会中学数学竞赛委员会",
        "Chinese Mathematical Society High School Mathematics Competition Committee",
        "https://www.cms.org.cn/Home/comp/comp_details/id/1357.html",
        "webpage",
        "2025 届选拔关系",
        "2025 selection relationship",
      ),
      syllabusSource(
        "中国数学奥林匹克官网",
        "Official Chinese Mathematical Olympiad Portal",
        "中国数学会中学数学竞赛委员会",
        "Chinese Mathematical Society High School Mathematics Competition Committee",
        "https://www.cmo-official.cn/",
        "webpage",
        "截至 2026 年 8 月的公开入口",
        "Public portal as of August 2026",
      ),
    ],
    translationNote: t(
      "本记录中的 CMO 指中国数学奥林匹克，不是加拿大数学奥林匹克；“决赛暨冬令营”按中国数学会正式名称合并翻译。classification 的 structure-only 仅表示可核验的是组织与选拔结构，不表示官网已公布试卷结构。",
      "CMO here means the Chinese Mathematical Olympiad, not the Canadian Mathematical Olympiad. The combined Final and Winter Camp title follows the Chinese Mathematical Society's official name. The structure-only classification means that only organizational and selection structure can be verified; it does not imply that an official paper structure is published.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-australian-amc-2026",
    slug: "australian-amc-2026-scope",
    projectId: "australian-amc",
    classification: "content-framework",
    title: t("Australian Mathematics Competition 2026 官方内容框架", "Australian Mathematics Competition 2026 Official Content Framework"),
    officialName: t("澳大利亚数学竞赛（Australian Mathematics Competition）", "Australian Mathematics Competition (AMC)"),
    applicableCycle: t("2026 Australian Mathematics Competition", "2026 Australian Mathematics Competition"),
    status: "confirmed",
    summary: t(
      "AMT 官方页给出五个组别、七类“可能包括”的主题、题型、时长和计分方式，但没有逐年级知识点清单、固定主题权重或排除项。该文件属于官方内容框架，不是完整正式考纲。",
      "AMT's official page gives five divisions, seven topics that “may include,” the item format, timing and scoring, but no year-by-year subtopic list, fixed topic weights or exclusions. It is an official content framework rather than a complete formal syllabus.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方概括性内容框架；主题为“可能包括”", "Official broad content framework; topics are stated as “may include”"),
      fact("组别", "Divisions", "Middle Primary、Upper Primary、Junior、Intermediate、Senior", "Middle Primary, Upper Primary, Junior, Intermediate and Senior"),
      fact("题型", "Question format", "30 题：25 道选择题、5 道整数答案题", "30 questions: 25 multiple-choice and five integer-answer questions"),
      fact("时长", "Duration", "小学组 60 分钟；中学组 75 分钟", "60 minutes for primary divisions; 75 minutes for secondary divisions"),
      fact("满分", "Maximum score", "135 分", "135 marks"),
      fact("错答", "Incorrect answers", "不倒扣分", "No penalty for incorrect responses"),
    ],
    sections: [
      {
        id: "australian-amc-status",
        title: t("官方框架状态", "Status of the official framework"),
        paragraphs: [
          t(
            "AMT 使用“Topics may include”列出主题，表示可能出现而非每年必考。官方页没有列出各主题的题量、百分比或按年级细分的知识边界。",
            "AMT introduces the list with “Topics may include,” indicating possible rather than mandatory annual content. The page gives no item count, percentage or year-level knowledge boundary for each topic.",
          ),
        ],
      },
      {
        id: "australian-amc-divisions",
        title: t("组别与年级", "Divisions and year levels"),
        tables: [
          {
            columns: [t("组别", "Division"), t("澳大利亚年级", "Australian years"), t("时长", "Duration")],
            rows: [
              row(["Middle Primary", "Middle Primary"], ["3–4 年级", "Years 3–4"], ["60 分钟", "60 minutes"]),
              row(["Upper Primary", "Upper Primary"], ["5–6 年级", "Years 5–6"], ["60 分钟", "60 minutes"]),
              row(["Junior", "Junior"], ["7–8 年级", "Years 7–8"], ["75 分钟", "75 minutes"]),
              row(["Intermediate", "Intermediate"], ["9–10 年级", "Years 9–10"], ["75 分钟", "75 minutes"]),
              row(["Senior", "Senior"], ["11–12 年级", "Years 11–12"], ["75 分钟", "75 minutes"]),
            ],
          },
        ],
      },
      {
        id: "australian-amc-topics",
        title: t("官方列出的可能主题", "Officially listed possible topics"),
        tables: [
          {
            columns: [t("主题", "Topic"), t("范围性质", "Status")],
            rows: [
              row(["基础算术", "Basic arithmetic"], ["可能包括", "May be included"]),
              row(["分数与比", "Fractions and ratios"], ["可能包括", "May be included"]),
              row(["代数与预代数", "Algebra and pre-algebra"], ["可能包括", "May be included"]),
              row(["几何", "Geometry"], ["可能包括", "May be included"]),
              row(["测量", "Measurement"], ["可能包括", "May be included"]),
              row(["统计与概率", "Statistics and probability"], ["可能包括", "May be included"]),
              row(["问题解决（含枚举）", "Problem solving, including enumeration"], ["可能包括", "May be included"]),
            ],
            note: t("官方没有给出固定权重，也没有将此列表称为完整考纲。", "AMT gives no fixed weighting and does not call this list a complete syllabus."),
          },
        ],
      },
      {
        id: "australian-amc-format-scoring",
        title: t("题型与计分", "Question format and scoring"),
        tables: [
          {
            columns: [t("题号", "Questions"), t("题型", "Format"), t("每题分值", "Marks each")],
            rows: [
              row(["1–10", "1–10"], ["选择题", "Multiple choice"], ["3 分", "3"]),
              row(["11–20", "11–20"], ["选择题", "Multiple choice"], ["4 分", "4"]),
              row(["21–25", "21–25"], ["选择题", "Multiple choice"], ["5 分", "5"]),
              row(["26–30", "26–30"], ["整数答案题", "Integer answer"], ["依次 6、7、8、9、10 分", "6, 7, 8, 9 and 10 respectively"]),
            ],
            note: t("满分 135；错答不扣分。", "Maximum 135; no penalty for incorrect responses."),
          },
        ],
      },
      {
        id: "australian-amc-boundaries",
        title: t("未公布的考纲要素", "Elements not published as a syllabus"),
        bullets: [
          t("没有按组别公布逐知识点清单。", "No division-specific itemized topic list is published."),
          t("没有公布主题固定题量或百分比。", "No fixed topic item counts or percentages are published."),
          t("没有公布完整排除主题清单。", "No complete exclusion list is published."),
          t("官方样题用于展示题型，不能据此推断每年主题分布。", "Official samples illustrate question style and do not establish annual topic distributions."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "Australian Mathematics Competition",
        "Australian Mathematics Competition",
        "澳大利亚数学信托（AMT）",
        "Australian Maths Trust (AMT)",
        "https://amt.edu.au/amc",
        "webpage",
        "2026 竞赛页",
        "2026 competition page",
      ),
    ],
    translationNote: t(
      "“Topics may include”严格译为“主题可能包括”，不改写为必考目录；enumeration 译为“枚举”。五个组别名称保留英文，以避免与中国学制年级直接错配。",
      "“Topics may include” is preserved as 主题可能包括 rather than rewritten as mandatory content. “Enumeration” is rendered as 枚举. Division names remain in English to avoid a false one-to-one mapping to Chinese school grades.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-math-kangaroo-current",
    slug: "math-kangaroo-current-framework",
    projectId: "math-kangaroo",
    classification: "content-framework",
    title: t("Math Kangaroo 官方课程指南与中国赛区结构", "Official Math Kangaroo Curriculum Guidelines and China Format"),
    officialName: t("袋鼠数学 Math Kangaroo", "Math Kangaroo"),
    applicableCycle: t(
      "AKSF 成员编制的六级通用课程指南；中国赛区结构按 2026 个人赛",
      "Six-band general curriculum guidelines prepared by AKSF members; China format based on the 2026 individual competition",
    ),
    status: "confirmed",
    summary: t(
      "Math Kangaroo USA 公开六份由 AKSF 成员与各国组织者编制的 Curriculum，并明确称其为“比赛中可能出现内容的一般指南”，不是各国统一的强制正式考纲。中国赛区另行规定 A—F 六级、题量、时长和计分；本记录将通用内容指南与中国本地实施分开。",
      "Math Kangaroo USA publishes six curricula prepared by AKSF members and national organizers, explicitly describing them as general guidelines to what may be expected on the competition. They are not a binding worldwide formal syllabus. The China organizer separately specifies Levels A–F, item counts, timing and scoring; this record keeps the general content guidance distinct from local delivery.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方一般课程指南；不是全球统一的强制正式考纲", "Official general curriculum guidelines, not a binding worldwide formal syllabus"),
      fact("课程分带", "Curriculum bands", "1–2、3–4、5–6、7–8、9–10、11–12 年级六档", "Six bands: Grades 1–2, 3–4, 5–6, 7–8, 9–10 and 11–12"),
      fact("中国分级", "China levels", "A：1–2；B：3–4；C：5–6；D：7–8；E：9–10；F：11–12 年级", "A: Grades 1–2; B: 3–4; C: 5–6; D: 7–8; E: 9–10; F: 11–12"),
      fact("中国 A/B 卷", "China Levels A/B", "24 道选择题，75 分钟，满分 120", "24 multiple-choice questions, 75 minutes, maximum 120"),
      fact("中国 C–F 卷", "China Levels C–F", "30 道选择题，75 分钟，满分 150", "30 multiple-choice questions, 75 minutes, maximum 150"),
      fact("中国计分", "China scoring", "起始分等于题量；答错扣 1 分，留空不扣", "Starting score equals the item count; one point deducted for a wrong answer and none for a blank"),
    ],
    sections: [
      {
        id: "math-kangaroo-framework-status",
        title: t("官方课程指南的性质", "Nature of the official curricula"),
        paragraphs: [
          t(
            "官方原文称 curricula 为“general guideline on what may be expected”。这表示可用于理解年级层级与可能内容，但不能据此断言某个知识点每年必考。",
            "The official page calls the curricula a “general guideline on what may be expected.” They can define broad grade-level expectations, but they do not make every listed topic mandatory each year.",
          ),
          t(
            "六份指南由 AKSF 成员和来自多个举办国的 Math Kangaroo 组织者编制。各国成员机构仍负责本地语言、时间、计分和实施。",
            "The six guidelines were prepared by AKSF members and Math Kangaroo organizers from several participating countries. National member organizations remain responsible for local language, timing, scoring and delivery.",
          ),
        ],
      },
      {
        id: "math-kangaroo-grade-bands",
        title: t("课程分带与中国级别", "Curriculum bands and China levels"),
        tables: [
          {
            columns: [t("通用课程指南", "General curriculum band"), t("中国赛区级别", "China level")],
            rows: [
              row(["1–2 年级", "Grades 1–2"], ["A", "A"]),
              row(["3–4 年级", "Grades 3–4"], ["B", "B"]),
              row(["5–6 年级", "Grades 5–6"], ["C", "C"]),
              row(["7–8 年级", "Grades 7–8"], ["D", "D"]),
              row(["9–10 年级", "Grades 9–10"], ["E", "E"]),
              row(["11–12 年级", "Grades 11–12"], ["F", "F"]),
            ],
            note: t("中国赛区允许报高一级，但不允许报低于本人年级的级别。", "The China organizer permits entry at a higher level but not below the student's current grade band."),
          },
        ],
      },
      {
        id: "math-kangaroo-capabilities",
        title: t("中国赛区公布的命题与能力特征", "Published problem and skill characteristics in China"),
        tables: [
          {
            columns: [t("特征", "Characteristic"), t("官方说明", "Official description")],
            rows: [
              row(["生活化情境", "Real-life contexts"], ["购物、游戏、迷宫等熟悉情境中的数学应用", "Mathematics in familiar contexts such as shopping, games and mazes"]),
              row(["图形与空间", "Visual and spatial reasoning"], ["折纸、拼图和图形挑战，用于空间想象", "Paper folding, puzzles and graphical challenges supporting spatial imagination"]),
              row(["策略思考", "Strategic thinking"], ["逻辑推理、模式识别及非公式化解法", "Logical reasoning, pattern recognition and approaches beyond routine formulas"]),
              row(["难度递进", "Progressive difficulty"], ["题目在一套试卷中按三个分值层级递进", "Questions progress through three point-value bands within a paper"]),
            ],
            note: t("官网没有公布这些能力维度的固定题量或百分比。", "The official page gives no fixed item count or percentage for these characteristics."),
          },
        ],
      },
      {
        id: "math-kangaroo-china-format",
        title: t("中国赛区 2026 个人赛结构", "2026 China individual format"),
        tables: [
          {
            columns: [t("级别", "Levels"), t("题量／时长", "Items / time"), t("分值层级", "Point bands"), t("总分", "Maximum")],
            rows: [
              row(["A、B", "A and B"], ["24 道选择题／75 分钟", "24 multiple-choice questions / 75 minutes"], ["1–8 题 3 分；9–16 题 4 分；17–24 题 5 分", "Questions 1–8: 3; 9–16: 4; 17–24: 5"] , ["起始 24 分，满分 120", "Starts at 24, maximum 120"]),
              row(["C、D、E、F", "C, D, E and F"], ["30 道选择题／75 分钟", "30 multiple-choice questions / 75 minutes"], ["1–10 题 3 分；11–20 题 4 分；21–30 题 5 分", "Questions 1–10: 3; 11–20: 4; 21–30: 5"], ["起始 30 分，满分 150", "Starts at 30, maximum 150"]),
            ],
            note: t("答错扣 1 分；留空不扣。A 级提供读题功能。", "One point is deducted for an incorrect answer; blanks have no deduction. Level A provides question reading."),
          },
        ],
      },
      {
        id: "math-kangaroo-local-boundary",
        title: t("国际指南与本地规则的边界", "Boundary between international guidance and local rules"),
        bullets: [
          t("六份 Curriculum 是通用内容指南；中国 A—F 分级与计分只适用于所引中国赛区个人赛。", "The six curricula are general content guidelines; China Levels A–F and scoring apply only to the cited China individual competition."),
          t("其他国家可能使用不同级别名称、题量、时长、语言或计分。", "Other countries may use different level names, item counts, timing, languages or scoring."),
          t("中国赛区官网未在公开正文中给出各知识点固定权重。", "The China organizer does not publish fixed weights for individual topics in the public page text."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "Math Kangaroo Curricula",
        "Math Kangaroo Curricula",
        "Math Kangaroo USA／AKSF 成员",
        "Math Kangaroo USA / AKSF members",
        "https://mathkangaroo.org/mks/resources/math-kangaroo-curricula/",
        "webpage",
        "六个年级分带的一般指南",
        "General guidelines in six grade bands",
      ),
      syllabusSource(
        "袋鼠数学中国赛区",
        "Math Kangaroo China",
        "袋鼠数学中国赛区／ASEEDER",
        "Math Kangaroo China / ASEEDER",
        "https://www.seedasdan.asia/mkchina/",
        "webpage",
        "2026 个人赛结构与本地说明",
        "2026 individual format and local information",
      ),
    ],
    translationNote: t(
      "Curriculum 在官方页面中明确是 general guideline，故译为“课程指南”而非“强制考纲”；may be expected 译为“可能出现”。中国赛区 Level A—F 保留字母名称。",
      "Because the official page explicitly calls each Curriculum a general guideline, it is rendered as 课程指南 rather than 强制考纲; “may be expected” is translated as 可能出现. China Level names A–F are retained.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-comc-2026",
    slug: "comc-2026-content-framework",
    projectId: "comc",
    classification: "content-framework",
    title: t("COMC 2026 官方内容框架", "COMC 2026 Official Content Framework"),
    officialName: t("加拿大数学公开挑战赛（COMC）", "Canadian Open Mathematics Challenge (COMC)"),
    applicableCycle: t("2026 COMC", "2026 COMC"),
    status: "confirmed",
    summary: t(
      "加拿大数学学会 2026 Getting Ready 页面说明大多数题目基于加拿大中学和 CÉGEP 数学课程，部分题目要求超出课程的理解，并列出“可能主题”。这不是穷尽式正式考纲，也没有主题权重；官方另公布 12 题、A/B/C 三部分的结构和作答要求。",
      "The Canadian Mathematical Society's 2026 Getting Ready page states that most problems are based on secondary-school and CÉGEP mathematics, with some requiring understanding beyond the curriculum, and lists potential topics. This is not an exhaustive formal syllabus and gives no topic weights. CMS separately publishes the 12-question Parts A/B/C structure and response requirements.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方“可能主题”内容框架；非穷尽式正式考纲", "Official potential-topic framework, not an exhaustive formal syllabus"),
      fact("课程基准", "Curriculum basis", "大多数题目基于中学与 CÉGEP 数学课程；部分题超出课程理解", "Most problems use secondary-school and CÉGEP mathematics; some require understanding beyond the curriculum"),
      fact("时长", "Duration", "2.5 小时", "2.5 hours"),
      fact("题量", "Items", "12 题，A/B/C 各 4 题", "12 questions, four each in Parts A, B and C"),
      fact("满分", "Maximum score", "80 分", "80 marks"),
      fact("计算器", "Calculator", "禁止使用计算器、手机及其他电子设备", "Calculators, phones and other electronic devices are prohibited"),
    ],
    sections: [
      {
        id: "comc-framework-status",
        title: t("官方框架状态", "Status of the official framework"),
        paragraphs: [
          t(
            "CMS 使用“Potential topics include”列出主题，表示可能出现而不是每项必考。官网没有为主题设固定题量、百分比或难度权重。",
            "CMS introduces the list with “Potential topics include,” meaning possible rather than mandatory content. It publishes no fixed item count, percentage or difficulty weight by topic.",
          ),
          t(
            "同一套 COMC 试卷供所有年级使用；内容难度以加拿大高中高年级和 CÉGEP 课程为基准，但部分题目可以超出该课程的常规理解。",
            "The same COMC paper is used across grade levels. Its difficulty is based on Canadian senior-secondary and CÉGEP mathematics, while some questions may require understanding beyond that curriculum.",
          ),
        ],
      },
      {
        id: "comc-potential-topics",
        title: t("官方列出的可能主题", "Officially listed potential topics"),
        tables: [
          {
            columns: [t("领域", "Area"), t("官方列举内容", "Officially listed content")],
            rows: [
              row(["概率", "Probability"], ["概率", "Probability"]),
              row(["几何与三角学", "Geometry and trigonometry"], ["欧氏几何、解析几何；三角函数、图像与恒等式", "Euclidean and analytic geometry; trigonometric functions, graphs and identities"]),
              row(["函数与代数", "Functions and algebra"], ["指数与对数函数；函数记号；方程组", "Exponential and logarithmic functions; functional notation; systems of equations"]),
              row(["多项式", "Polynomials"], ["二次与三次方程根的关系；余式定理", "Relationships involving roots of quadratic and cubic equations; the remainder theorem"]),
              row(["数列与展开", "Sequences and expansions"], ["数列与级数；二项式定理", "Sequences and series; the binomial theorem"]),
              row(["组合", "Combinatorics"], ["简单计数问题", "Simple counting problems"]),
              row(["初等数论", "Elementary number theory"], ["整除判定、约数个数、简单丢番图方程", "Divisibility tests, number of divisors and simple Diophantine equations"]),
            ],
            note: t("该表合并展示官方项目，不代表 CMS 公布了领域权重。", "This table groups the official list for readability and does not imply CMS domain weights."),
          },
        ],
      },
      {
        id: "comc-structure",
        title: t("试卷结构", "Paper structure"),
        tables: [
          {
            columns: [t("部分", "Part"), t("题量", "Items"), t("每题分值", "Marks each"), t("定位", "Positioning")],
            rows: [
              row(["A", "A"], ["4", "4"], ["4 分", "4"], ["入门题", "Introductory"]),
              row(["B", "B"], ["4", "4"], ["6 分", "6"], ["进阶题", "Intermediate"]),
              row(["C", "C"], ["4", "4"], ["10 分", "10"], ["高阶长解答题", "Advanced long-form"]),
            ],
            note: t("共 12 题，满分 80，考试时长 2.5 小时。", "Twelve questions, 80 marks, 2.5 hours."),
          },
        ],
      },
      {
        id: "comc-response-requirements",
        title: t("作答与评分要求", "Response and marking requirements"),
        tables: [
          {
            columns: [t("部分", "Part"), t("作答要求", "Response requirement"), t("部分分", "Partial credit")],
            rows: [
              row(["A、B", "A and B"], ["正确答案可获满分；并非必须展示过程", "A correct answer earns full marks; work is not mandatory"], ["答案错误但过程有正确内容时可给部分分；不写过程则小错误也可能得 0", "Correct work may earn partial credit after an incorrect final answer; without work, a small error may receive no credit"]),
              row(["C", "C"], ["必须提交完整展开的解答并展示全部过程", "A fully developed solution with all work shown is required"], ["按完整论证与过程评分", "Marked on the complete argument and work"]),
            ],
          },
        ],
      },
      {
        id: "comc-boundaries",
        title: t("内容边界", "Content boundaries"),
        bullets: [
          t("“可能主题”不是穷尽清单；未列出的内容不能据此一概视为排除。", "The potential-topic list is not exhaustive; unlisted content cannot automatically be treated as excluded."),
          t("官方没有公布各主题固定题量、权重或固定分布在 A/B/C 的规则。", "CMS publishes no fixed item count, weighting or A/B/C placement by topic."),
          t("部分题目可以要求超出常规中学／CÉGEP 课程的理解。", "Some questions may require understanding beyond the ordinary secondary/CÉGEP curriculum."),
          t("历年试题的主题频率不在本记录中被改写为考纲权重。", "Past-paper topic frequencies are not rewritten here as syllabus weights."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "COMC 2026 Getting Ready",
        "COMC 2026 Getting Ready",
        "加拿大数学学会（CMS）",
        "Canadian Mathematical Society (CMS)",
        "https://cms.math.ca/competitions/comc/comc2026/getting-ready/",
        "webpage",
        "2026 可能主题与课程边界",
        "2026 potential topics and curriculum boundary",
      ),
      syllabusSource(
        "COMC 2026 教师／组织者问答",
        "COMC 2026 FAQ for Teachers and Organizers",
        "加拿大数学学会（CMS）",
        "Canadian Mathematical Society (CMS)",
        "https://cms.math.ca/competitions/comc/comc2026/faq/teachers/",
        "webpage",
        "2026 结构、评分与器材规则",
        "2026 structure, marking and equipment rules",
      ),
      syllabusSource(
        "COMC 2026",
        "COMC 2026",
        "加拿大数学学会（CMS）",
        "Canadian Mathematical Society (CMS)",
        "https://cms.math.ca/competitions/comc/comc2026/",
        "webpage",
        "2026 赛事主页",
        "2026 competition home",
      ),
    ],
    translationNote: t(
      "Potential topics include 译为“可能主题包括”，不处理为必考目录；CÉGEP 保留加拿大教育阶段名称。Part A/B/C 译为 A/B/C 部分，introductory、intermediate、advanced 分别译为入门、进阶、高阶。",
      "“Potential topics include” is rendered as 可能主题包括 rather than a mandatory syllabus. CÉGEP is retained as the Canadian educational stage. Parts A/B/C and the introductory, intermediate and advanced labels are preserved in translation.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-amc10-current",
    slug: "amc-10-current-scope",
    projectId: "amc10",
    classification: "content-framework",
    title: t("AMC 10 官方内容范围", "Official AMC 10 Content Framework"),
    officialName: t("MAA AMC 10", "MAA AMC 10"),
    applicableCycle: t("2026–27 MAA AMC 赛季", "2026–27 MAA AMC cycle"),
    status: "confirmed",
    summary: t(
      "MAA 只公布 AMC 10 的概括性可考主题与明确排除项，没有逐知识点或按权重编排的正式考纲。AMC 10 以初等代数、基础几何、初等数论和初等概率为核心，明确排除三角学、高等代数和高等几何。",
      "MAA publishes only broad included topics and explicit exclusions for AMC 10, not a formal topic-by-topic or weighted specification. The stated scope centers on elementary algebra, basic geometry, elementary number theory and elementary probability, while excluding trigonometry, advanced algebra and advanced geometry.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方概括性内容框架；无主题权重", "Official broad content framework with no topic weighting"),
      fact("题型与题量", "Format", "25 道选择题", "25 multiple-choice questions"),
      fact("时长", "Duration", "75 分钟", "75 minutes"),
      fact("参赛层级", "Student level", "10 年级及以下；比赛日未满 17.5 岁", "Grade 10 and below; under 17.5 years old on competition day"),
      fact("版本", "Versions", "A 卷与 B 卷；符合资格者可参加两场，但同一天不能同时参加 AMC 10 与 AMC 12", "A and B versions; eligible students may take both dates, but not AMC 10 and AMC 12 on the same date"),
      fact("计算器", "Calculator", "不得使用", "Not permitted"),
    ],
    sections: [
      {
        id: "amc10-publication-status",
        title: t("官方文件状态", "Status of the official framework"),
        paragraphs: [
          t(
            "MAA 当前项目页列出若干代表性主题和三项排除内容，但没有公布子主题、学习目标、题量比例或难度分布。因此本页采用“内容框架”分类。",
            "The current MAA page lists representative topics and three exclusions, but no subtopics, learning objectives, item proportions or difficulty distribution. This record is therefore classified as a content framework.",
          ),
        ],
      },
      {
        id: "amc10-included-content",
        title: t("官方明示可考内容", "Officially stated included content"),
        tables: [
          {
            columns: [t("主题", "Topic"), t("官方范围", "Official scope")],
            rows: [
              row(["初等代数", "Elementary algebra"], ["列为可考主题", "Listed as included content"]),
              row(["基础几何", "Basic geometry"], ["列为可考主题", "Listed as included content"]),
              row(["面积与体积公式", "Area and volume formulas"], ["在几何范围中明确列出", "Explicitly listed within the geometry scope"]),
              row(["初等数论", "Elementary number theory"], ["列为可考主题", "Listed as included content"]),
              row(["初等概率", "Elementary probability"], ["列为可考主题", "Listed as included content"]),
            ],
            note: t("这些是官方举例，不构成带权重的完整目录。", "These are official examples, not a complete weighted catalogue."),
          },
        ],
      },
      {
        id: "amc10-exclusions",
        title: t("明确排除内容", "Explicit exclusions"),
        tables: [
          {
            columns: [t("排除主题", "Excluded topic"), t("边界", "Boundary")],
            rows: [
              row(["三角学", "Trigonometry"], ["MAA 明确列为不属于 AMC 10 范围", "Explicitly excluded by MAA from AMC 10"]),
              row(["高等代数", "Advanced algebra"], ["MAA 明确列为不属于 AMC 10 范围", "Explicitly excluded by MAA from AMC 10"]),
              row(["高等几何", "Advanced geometry"], ["MAA 明确列为不属于 AMC 10 范围", "Explicitly excluded by MAA from AMC 10"]),
              row(["微积分", "Calculus"], ["官方 AMC 10 说明未单列此项；不得据此替换前三项明确排除边界", "Not separately named on the AMC 10 page; this does not replace the three explicit exclusions above"]),
            ],
          },
        ],
      },
      {
        id: "amc10-format",
        title: t("结构与考试材料", "Structure and materials"),
        tables: [
          {
            columns: [t("项目", "Element"), t("规定", "Rule")],
            rows: [
              row(["题量／时长", "Items / time"], ["25 道选择题／75 分钟", "25 multiple-choice questions / 75 minutes"]),
              row(["A／B 卷", "A / B versions"], ["两场日期不同；同一学生符合资格时可分别参加", "Separate dates; an eligible student may take both"]),
              row(["同日限制", "Same-day restriction"], ["同一日期不得同时参加 AMC 10 与 AMC 12", "AMC 10 and AMC 12 may not both be taken on the same date"]),
              row(["计算器与电子设备", "Calculators and electronics"], ["禁止使用计算器、手机及同类电子设备", "Calculators, phones and similar electronic devices are prohibited"]),
            ],
          },
        ],
      },
    ],
    sources: [maaAmcOverview, maaAmcPolicies],
    translationNote: t(
      "elementary 译为“初等／基础”，advanced 译为“高等”，仅反映 MAA 的范围层级，不等同于中国教材中的固定章节名称。",
      "“Elementary” is rendered as 初等／基础 and “advanced” as 高等 to preserve MAA's scope distinction; these are not treated as fixed chapter names in a Chinese textbook system.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-amc12-current",
    slug: "amc-12-current-scope",
    projectId: "amc12",
    classification: "content-framework",
    title: t("AMC 12 官方内容范围", "Official AMC 12 Content Framework"),
    officialName: t("MAA AMC 12", "MAA AMC 12"),
    applicableCycle: t("2026–27 MAA AMC 赛季", "2026–27 MAA AMC cycle"),
    status: "confirmed",
    summary: t(
      "MAA 将 AMC 12 的范围概括为完整高中数学课程，并明确包括三角学、高等代数和高等几何、排除微积分。官方没有发布逐主题权重、题量比例或完整子主题清单。",
      "MAA describes AMC 12 as covering the full high-school mathematics curriculum, explicitly including trigonometry, advanced algebra and advanced geometry while excluding calculus. It does not publish topic weights, item proportions or a complete subtopic list.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "官方概括性内容框架；无逐项正式考纲", "Official broad content framework, not a formal itemized specification"),
      fact("题型与题量", "Format", "25 道选择题", "25 multiple-choice questions"),
      fact("时长", "Duration", "75 分钟", "75 minutes"),
      fact("参赛层级", "Student level", "12 年级及以下；比赛日未满 19.5 岁", "Grade 12 and below; under 19.5 years old on competition day"),
      fact("范围上限", "Upper boundary", "不考微积分", "Calculus is excluded"),
      fact("计算器", "Calculator", "不得使用", "Not permitted"),
    ],
    sections: [
      {
        id: "amc12-publication-status",
        title: t("官方文件状态", "Status of the official framework"),
        paragraphs: [
          t(
            "“完整高中数学课程”是 MAA 的概括性范围描述。MAA 没有在现行页面上提供课程标准编号、主题权重、题量或难度蓝图，因此不能据历年题频率补成正式考纲。",
            "“Full high-school mathematics curriculum” is MAA's broad scope statement. The current page gives no curriculum-standard identifier, topic weights, item counts or difficulty blueprint, so past-paper frequencies are not converted into a formal syllabus.",
          ),
        ],
      },
      {
        id: "amc12-included-content",
        title: t("官方范围", "Official scope"),
        tables: [
          {
            columns: [t("范围层级", "Scope level"), t("官方说明", "Official statement")],
            rows: [
              row(["总体范围", "Overall scope"], ["完整高中数学课程", "The full high-school mathematics curriculum"]),
              row(["三角学", "Trigonometry"], ["明确包括", "Explicitly included"]),
              row(["高等代数", "Advanced algebra"], ["明确包括", "Explicitly included"]),
              row(["高等几何", "Advanced geometry"], ["明确包括", "Explicitly included"]),
            ],
            note: t("MAA 未为这些领域公布百分比或最低／最高题量。", "MAA publishes no percentage or minimum/maximum item count for these areas."),
          },
        ],
      },
      {
        id: "amc12-exclusion",
        title: t("明确排除内容", "Explicit exclusion"),
        tables: [
          {
            columns: [t("主题", "Topic"), t("边界", "Boundary")],
            rows: [
              row(["微积分", "Calculus"], ["MAA 明确排除", "Explicitly excluded by MAA"]),
              row(["其他排除项", "Other exclusions"], ["现行官方页面未提供额外排除清单", "The current official page provides no additional exclusion list"]),
            ],
          },
        ],
      },
      {
        id: "amc12-format",
        title: t("结构与考试材料", "Structure and materials"),
        tables: [
          {
            columns: [t("项目", "Element"), t("规定", "Rule")],
            rows: [
              row(["题量／时长", "Items / time"], ["25 道选择题／75 分钟", "25 multiple-choice questions / 75 minutes"]),
              row(["A／B 卷", "A / B versions"], ["两场日期不同；符合资格者可分别参加", "Separate dates; an eligible student may take both"]),
              row(["同日限制", "Same-day restriction"], ["同一日期不得同时参加 AMC 10 与 AMC 12", "AMC 10 and AMC 12 may not both be taken on the same date"]),
              row(["计算器与电子设备", "Calculators and electronics"], ["禁止使用计算器、手机及同类电子设备", "Calculators, phones and similar electronic devices are prohibited"]),
            ],
          },
        ],
      },
    ],
    sources: [maaAmcOverview, maaAmcPolicies],
    translationNote: t(
      "full high school mathematics curriculum 译为“完整高中数学课程”，不另行映射到某一国家或地区的单套教材；calculus 统一译为“微积分”。",
      "“Full high-school mathematics curriculum” is rendered as 完整高中数学课程 without mapping it to one national textbook sequence. “Calculus” is consistently rendered as 微积分.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-aime-current",
    slug: "aime-current-structure",
    projectId: "aime",
    classification: "structure-only",
    title: t("AIME 官方考试结构与范围说明", "Official AIME Format and Scope Statement"),
    officialName: t("美国数学邀请赛（AIME）", "American Invitational Mathematics Examination (AIME)"),
    applicableCycle: t("2026–27 MAA AMC 邀请赛周期", "2026–27 MAA AMC invitational cycle"),
    status: "confirmed",
    summary: t(
      "MAA 已公布 2027 年美国、加拿大 AIME 的资格、机考结构和考务规则，但仍没有正式内容考纲、主题清单或权重。本页因此只整理官方结构；中国等国际赛区的实际考务须等待所在地 IGL 通知。",
      "MAA has published the qualification, computer-based format and administration rules for the 2027 AIME in the US and Canada, but still provides no formal content specification, topic list or weighting. This page therefore records official structure only; delivery in China and other international regions awaits the local IGL notice.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "仅有官方结构；未公开内容考纲", "Official structure only; no public content syllabus"),
      fact("题量", "Items", "15 题", "15 questions"),
      fact("美加时长", "US/Canada timing", "两段各 90 分钟，中间可休息 10 分钟", "Two 90-minute parts with an optional 10-minute break"),
      fact("答案形式", "Answer format", "每题答案为 000 至 999 的整数", "Each answer is an integer from 000 to 999"),
      fact("难度关系", "Difficulty relationship", "官方说明题目显著难于 AMC 10 与 AMC 12", "MAA states that the questions are much more difficult than AMC 10 and AMC 12"),
      fact("2027 美加场次", "2027 US/Canada administration", "2 月 5—6 日单一窗口；取消 AIME I／II，每名学生只能参加一次", "One 5–6 February window; AIME I/II retired and one attempt per student"),
      fact("适用范围", "Scope of administration rules", "Pearson、费用、年龄和固定资格线目前明确适用于美国／加拿大；国际赛区按 IGL", "Pearson delivery, fee, age and fixed qualification scores currently govern the US/Canada; international regions follow their IGL"),
    ],
    sections: [
      {
        id: "aime-publication-status",
        title: t("官方范围公开情况", "Published official scope"),
        paragraphs: [
          t(
            "截至核验日，MAA 的现行邀请赛页面和竞赛政策没有列出 AIME 的学科领域、子主题、题量比例、难度梯度或排除主题。",
            "As of verification, the current MAA invitational page and competition policies do not list AIME domains, subtopics, item proportions, difficulty bands or excluded topics.",
          ),
          t(
            "历年试题及 MAA Press 题书可以呈现曾经出现的内容，但不应被标为官方命题范围。",
            "Past papers and the MAA Press problem book can show content that has appeared, but they should not be labelled as an official test scope.",
          ),
        ],
      },
      {
        id: "aime-format",
        title: t("考试结构", "Test structure"),
        tables: [
          {
            columns: [t("项目", "Element"), t("官方规定", "Official rule")],
            rows: [
              row(["题量", "Item count"], ["15 题", "15 questions"]),
              row(["第一段", "Part 1"], ["8 题／90 分钟", "8 questions / 90 minutes"]),
              row(["第二段", "Part 2"], ["7 题／90 分钟；开始后不能返回第一段", "7 questions / 90 minutes; Part 1 cannot be reopened once Part 2 begins"]),
              row(["休息", "Break"], ["两段之间最多 10 分钟", "Up to 10 minutes between the two parts"]),
              row(["作答", "Response"], ["每题填写 000—999 的整数答案", "Enter an integer answer from 000 to 999 for each question"]),
              row(["证明要求", "Proof requirement"], ["官方现行结构说明只规定整数答案，不要求提交证明", "The current official format requires integer answers and does not require submitted proofs"]),
              row(["美加考务", "US/Canada delivery"], ["Pearson Professional Centers 英文机考；不得自带纸笔、计算器、尺规、公式表或翻译词典", "English computer-based testing at Pearson Professional Centers; no personal paper, writing tools, calculator, ruler, compass, formula sheet or translation dictionary"]),
            ],
          },
        ],
      },
      {
        id: "aime-qualification",
        title: t("与 AMC 10/12 的关系", "Relationship to AMC 10/12"),
        tables: [
          {
            columns: [t("来源", "Qualifying route"), t("官方参数", "Official parameter")],
            rows: [
              row(["AMC 10（美加）", "AMC 10 (US/Canada)"], ["2027 AIME：AMC 10A 或 10B 至少 100 分", "2027 AIME: at least 100 on AMC 10A or 10B"]),
              row(["AMC 12（美加）", "AMC 12 (US/Canada)"], ["2027 AIME：AMC 12A 或 12B 至少 85 分", "2027 AIME: at least 85 on AMC 12A or 12B"]),
              row(["其他资格", "Other conditions"], ["AIME 当日十二年级及以下且年满 13 岁，晋级 AMC 当日不超过 19.5 岁，并满足美加学籍和实际就读条件", "Grade 12 or below and at least age 13 on AIME day, no older than 19.5 on the qualifying AMC day, and meeting US/Canada enrolment and physical-attendance conditions"]),
              row(["国际赛区", "International regions"], ["固定分数及 Pearson 考务不能直接外推；按居住地 IGL 当届政策", "The fixed scores and Pearson administration cannot be extrapolated; follow the current policy of the IGL for the place of residence"]),
              row(["难度关系", "Difficulty relationship"], ["AIME 题目显著难于 AMC 10/12", "AIME questions are much more difficult than AMC 10/12 questions"]),
            ],
          },
        ],
      },
      {
        id: "aime-administration-boundary",
        title: t("2027 场次与地区边界", "2027 administration and regional boundary"),
        bullets: [
          t("美国、加拿大 2027 AIME 在 2 月 5—6 日窗口举行，不再设 AIME I 与 AIME II；考生预约一个时段且只能参加一次，没有补考。", "The 2027 AIME in the US and Canada uses a 5–6 February window rather than AIME I and AIME II. A candidate books one appointment, has one attempt and has no makeup."),
          t("中国国籍但从报名至 AIME 均全日制并实际在美国或加拿大合规学校就读者，按美加规则；在中国境内就读者按所在地 IGL。", "A Chinese national enrolled full-time and physically attending an eligible US or Canadian school from registration through AIME follows the US/Canada rules; a student studying in China follows the local IGL."),
          t("截至 2026 年 8 月 29 日，中国承办页尚未发布 2027 AIME 的日期、形式、费用或资格实施细则。", "As of 29 August 2026, the China organiser pages had not published the 2027 AIME date, delivery, fee or qualification arrangements."),
          t("AIME 是邀请赛，不接受学生个人直接报名。", "AIME is invitational and does not accept direct student registration."),
        ],
      },
    ],
    sources: [
      syllabusSource(
        "MAA 邀请赛说明",
        "MAA Invitational Competitions",
        "美国数学协会（MAA）",
        "Mathematical Association of America (MAA)",
        "https://maa.org/maa-invitational-competitions/",
        "webpage",
        "2027 AIME 现行页面（2026 年 8 月 29 日核验）",
        "Current 2027 AIME page verified 29 August 2026",
      ),
      syllabusSource(
        "2026–27 AIME 官方规则",
        "Official 2026–27 AIME Rules",
        "美国数学协会（MAA）",
        "Mathematical Association of America (MAA)",
        "https://maa.org/wp-content/uploads/2026/08/2026-27-AIME-Policies.pdf",
        "pdf",
        "2026 年 8 月 26 日更新；适用于美国／加拿大考务",
        "Updated 26 August 2026; US/Canada administration",
      ),
      maaAmcPolicies,
    ],
    translationNote: t(
      "AIME 的 examination 译为“考试”，但其在 MAA 体系中属于邀请赛；integer between 0 and 999 按答题卡习惯表述为“000—999 的整数答案”。本页不把官方出版题书的章节目录改写成命题考纲。",
      "AIME is rendered as an examination while retaining its invitational status in the MAA sequence. “Integer between 0 and 999” is expressed as an integer answer from 000–999 to match answer-entry convention. The chapter list of an official problem book is not recast as a test syllabus.",
    ),
    lastVerified: AIME_VERIFIED_AT,
  },
  {
    id: "syllabus-hmmt-published-format",
    slug: "hmmt-published-format",
    projectId: "hmmt",
    classification: "structure-only",
    title: t("HMMT 官方公开赛制与范围说明", "HMMT Official Published Format and Scope"),
    officialName: t("哈佛—MIT 数学竞赛（HMMT）", "Harvard–MIT Mathematics Tournament (HMMT)"),
    applicableCycle: t("Season 30：2026 年 November 与 2027 年 February", "Season 30: November 2026 and February 2027"),
    status: "confirmed",
    summary: t(
      "HMMT 官网公布两场比赛的轮次、时长、作答规则、相对难度和计分方法，但没有发布按知识点、题量或权重划分的封闭考纲。November 个人轮覆盖高中数学与当届 Theme；February 只给出代数与数论、欧氏几何、组合三个宽泛领域。以下内容只整理官方明示的赛制和范围，不根据历年题补写主题清单。",
      "HMMT publishes the rounds, timing, answer rules, relative difficulty and scoring methods for both tournaments, but no closed specification divided into topics, item counts or content weights. November individual rounds draw broadly from high-school mathematics and the current Theme, while February states only the broad areas of algebra and number theory, Euclidean geometry, and combinatorics. This record reports the published format and scope without deriving an expanded topic list from past papers.",
    ),
    facts: [
      fact("考纲性质", "Specification type", "仅有官方赛制与宽泛范围；没有正式封闭考纲", "Official format and broad scope only; no formal closed syllabus"),
      fact("November 个人轮", "November individual rounds", "General、Theme；各 10 道短答题、50 分钟", "General and Theme; 10 short-answer problems and 50 minutes each"),
      fact("February 个人轮", "February individual rounds", "Algebra & Number Theory、Geometry、Combinatorics；各 10 道短答题、50 分钟", "Algebra & Number Theory, Geometry, and Combinatorics; 10 short-answer problems and 50 minutes each"),
      fact("Team Round", "Team Round", "10 题、60 分钟；November 为短答，February 为证明题", "10 problems in 60 minutes; short answer in November and proof-based in February"),
      fact("Guts Round", "Guts Round", "36 道短答题、80 分钟；November 每组 3 题，February 每组 4 题", "36 short-answer problems in 80 minutes; sets of three in November and four in February"),
      fact("禁用工具", "Prohibited aids", "书籍、笔记、计算器、计算设备、绘图工具与通信设备均不得使用", "Books, notes, calculators, computational aids, drawing tools and communication devices are prohibited"),
      fact("个人题动态计分", "Dynamic individual scoring", "已解题目的分值约为 3—10 分，并随题号及当场解出人数变化", "A solved problem is worth approximately 3–10 points, varying with problem number and the number of contestants who solve it"),
    ],
    sections: [
      {
        id: "hmmt-publication-boundary",
        title: t("官方范围的边界", "Boundary of the published scope"),
        paragraphs: [
          t(
            "HMMT 的 November 与 February 对比页和 Testing Information 页描述了比赛结构及大致难度，没有公布一份可约束命题的逐项 syllabus，也没有给出各知识领域的固定题量或比例。Theme Round 的主题随当届试卷变化，不能预先写成固定知识点。",
            "HMMT's November-versus-February and Testing Information pages describe the tournament structure and approximate difficulty. They do not publish an itemized syllabus binding future papers or fixed item proportions by topic. The Theme Round changes with the paper and cannot be presented as a permanent topic list.",
          ),
          t(
            "官网将 November 难度概括为 AMC 中段至 AIME 较难题，将 February 概括为 AIME 中段至国家奥赛级别。这是选场参照，不是晋级线、分数线或封闭命题范围。",
            "The official comparison places November approximately from mid-AMC to upper-AIME and February from mid-AIME to national-olympiad level. These are tournament-selection guides, not qualification thresholds, score cutoffs or a closed content specification.",
          ),
        ],
      },
      {
        id: "hmmt-round-comparison",
        title: t("November 与 February 赛制", "November and February formats"),
        tables: [
          {
            columns: [t("轮次", "Round"), t("November", "November"), t("February", "February")],
            rows: [
              row(["个人轮", "Individual rounds"], ["General、Theme；各 10 题／50 分钟", "General and Theme; 10 problems / 50 minutes each"], ["Algebra & Number Theory、Geometry、Combinatorics；各 10 题／50 分钟", "Algebra & Number Theory, Geometry, and Combinatorics; 10 problems / 50 minutes each"]),
              row(["个人轮内容", "Individual-round scope"], ["General 取材于高中数学各领域；Theme 围绕共同主题", "General draws from high-school mathematics; Theme is organized around a common theme"], ["高中代数与数论、欧氏几何、高中组合", "High-school algebra and number theory, Euclidean geometry, and high-school combinatorics"]),
              row(["Team Round", "Team Round"], ["10 道短答题／60 分钟", "10 short-answer problems / 60 minutes"], ["10 道证明题／60 分钟；可按过程给分", "10 proof problems / 60 minutes; partial credit is available"]),
              row(["Guts Round", "Guts Round"], ["36 道短答题／80 分钟；每组 3 题", "36 short-answer problems / 80 minutes; sets of three"], ["36 道短答题／80 分钟；每组 4 题", "36 short-answer problems / 80 minutes; sets of four"]),
              row(["官方难度参照", "Official difficulty guide"], ["约 AMC 中段至 AIME 较难题", "Approximately mid-AMC to upper-AIME"], ["约 AIME 中段至国家奥赛题", "Approximately mid-AIME to national-olympiad level"]),
            ],
          },
        ],
      },
      {
        id: "hmmt-answer-and-equipment-rules",
        title: t("作答形式与工具规则", "Answer format and permitted materials"),
        bullets: [
          t("除 February Team Round 外，官网所述个人轮、November Team Round 与 Guts Round 均为单值短答；一般不按过程给分。", "Except for the February Team Round, the published individual rounds, November Team Round and Guts Round use single-value short answers and generally do not award partial credit."),
          t("短答应写成能够明确判定且尽可能化简的精确形式。官方允许基本算术、括号、指数、阶乘、三角与反三角函数、二项式系数及题目另行允许的记号；通常不接受求和号或连乘号作为最终答案。", "Short answers should be unambiguous, exact and as simplified as reasonably possible. The official answer guide permits basic arithmetic, parentheses, exponents, factorials, trigonometric and inverse-trigonometric functions, binomial coefficients, and notation explicitly allowed by a problem; summation and product notation are generally not accepted as final answers."),
          t("不得使用书籍、笔记、计算器、计算设备、方格纸、直尺、量角器、圆规等绘图工具，也不得使用手机、电脑或其他通信设备。", "Books, notes, calculators, computational aids, graph paper, rulers, protractors, compasses and other drawing tools are prohibited, as are phones, computers and other communication devices."),
        ],
      },
      {
        id: "hmmt-scoring",
        title: t("动态计分与团队总分", "Dynamic scoring and team aggregate"),
        paragraphs: [
          t(
            "个人题不是预先固定同一分值。官方算法对第 n 题、当场有 N 人解出的情况使用 w(n,N)=exp(n/20)+max(8−⌊ln N⌋,2)，因此权重约在 3—10 分之间；个人单科成绩及个人总分均为已解题目权重之和。",
            "Individual problems do not carry one fixed value in advance. For problem n solved by N contestants, the official algorithm uses w(n,N)=exp(n/20)+max(8−⌊ln N⌋,2), giving weights of roughly 3–10 points. A test score and individual total are the sums of the weights of solved problems.",
          ),
          t(
            "Team Round 与 Guts Round 的题目分值直接标在试卷上。Guts 按题组领取和提交，交卷后立即评分并实时显示成绩。",
            "Problem weights for the Team and Guts rounds are printed on the paper. Guts sets are collected and submitted sequentially, graded immediately, and displayed in real time.",
          ),
        ],
        tables: [
          {
            title: t("Sweepstakes 总分构成", "Sweepstakes score components"),
            columns: [t("部分", "Component"), t("折算上限", "Scaled maximum"), t("计算方式", "Method")],
            rows: [
              row(["Individual Total", "Individual Total"], ["800", "800"], ["队员个人原始总分相加，再按当场该部分最高原始分折算", "Team members' individual raw totals are summed, then scaled so the highest component raw score receives the maximum"]),
              row(["Team Round", "Team Round"], ["400", "400"], ["题目权重相加，再按当场最高原始分折算", "Problem weights are summed, then scaled against the highest raw score in that component"]),
              row(["Guts Round", "Guts Round"], ["400", "400"], ["题目权重相加，再按当场最高原始分折算", "Problem weights are summed, then scaled against the highest raw score in that component"]),
              row(["理论总分", "Theoretical total"], ["1600", "1600"], ["只有同一队在三个部分均取得最高原始分时达到", "Reached only when the same team has the highest raw score in all three components"]),
            ],
            note: t(
              "动态个人权重及按当场最高分折算意味着不同届的原始分和 Sweepstakes 分不宜直接横向比较。",
              "Dynamic individual weights and scaling against the current field mean that raw and Sweepstakes scores should not be compared directly across editions.",
            ),
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "HMMT November 与 February 赛制对比",
        "HMMT November vs. February",
        "HMMT 组委会",
        "HMMT",
        "https://www.hmmt.org/www/tournaments/novfeb",
        "webpage",
        "Season 30 核验于 2026 年 8 月",
        "Season 30, verified August 2026",
      ),
      syllabusSource(
        "HMMT Testing Information",
        "HMMT Testing Information",
        "HMMT 组委会",
        "HMMT",
        "https://www.hmmt.org/www/tournaments/testing",
        "webpage",
        "核验于 2026 年 8 月",
        "Verified August 2026",
      ),
      syllabusSource(
        "HMMT 可接受答案形式",
        "HMMT Acceptable Answer Forms",
        "HMMT Head Graders",
        "HMMT Head Graders",
        "https://hmmt-prod.s3.amazonaws.com/static/acceptable_answers.pdf",
        "pdf",
        "官网 Testing Information 所链接文件；HMMT 2012",
        "Linked from the official Testing Information page; HMMT 2012",
      ),
      syllabusSource(
        "HMMT 个人题动态计分算法",
        "HMMT Individual Test Weight Function",
        "HMMT 组委会",
        "HMMT",
        "https://hmmt-prod.s3.amazonaws.com/static/scoring_algorithm.pdf",
        "pdf",
        "2018 年 2 月 13 日更新；官网现行 Testing Information 所链接",
        "Updated 13 February 2018; linked from the current official Testing Information page",
      ),
    ],
    translationNote: t(
      "保留 General、Theme、Team Round、Guts Round、Sweepstakes 等官方轮次名称；Theme 不译写成固定知识主题。Algebra test 按官网说明表述为“Algebra & Number Theory”。动态权重公式按官方 PDF 原式保留，不据历届成绩反推固定分数线。",
      "Official round names such as General, Theme, Team Round, Guts Round and Sweepstakes are retained; Theme is not recast as a fixed content topic. Algebra test is presented as Algebra & Number Theory following the official description. The dynamic weight formula is preserved from the official PDF, and no fixed cutoff is inferred from historical results.",
    ),
    lastVerified: HMMT_VERIFIED_AT,
  },
];
