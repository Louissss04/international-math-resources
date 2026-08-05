import { assessmentProjects } from "./assessments";
import { t, type ContentSection, type FactRecord, type ProjectRecord, type TableRow } from "../lib/types";

function project(id: string): ProjectRecord {
  const found = assessmentProjects.find((item) => item.id === id);
  if (!found) throw new Error(`Missing assessment project ${id}`);
  return found;
}

function section(item: ProjectRecord, id: string): ContentSection {
  const found = item.sections.find((entry) => entry.id === id);
  if (!found) throw new Error(`Missing section ${id} for ${item.id}`);
  return found;
}

function fact(item: ProjectRecord, labelEn: string): FactRecord {
  const found = item.facts.find((entry) => entry.label.en === labelEn);
  if (!found) throw new Error(`Missing fact ${labelEn} for ${item.id}`);
  return found;
}

function revisedFact(item: ProjectRecord, labelEn: string, labelZh: string, nextLabelEn: string, valueZh: string, valueEn: string): FactRecord {
  return { ...fact(item, labelEn), label: t(labelZh, nextLabelEn), value: t(valueZh, valueEn) };
}

function rowLike(row: TableRow, cells: TableRow["cells"]): TableRow {
  return { ...row, cells };
}

function mathOnlySat(): ProjectRecord {
  const base = project("sat");
  const format = section(base, "sat-format");
  const score = section(base, "sat-score-use");
  const prep = section(base, "sat-official-preparation");
  return {
    ...base,
    title: t("SAT 数字化考试：数学部分", "Digital SAT: Math Section"),
    summary: t(
      "数字 SAT 数学部分采用两阶段自适应形式，共 44 题、70 分钟，分数范围为 200–800；本页同时保留中国学生需要的国际报名、设备、日期与送分信息。",
      "Digital SAT Math uses two-stage adaptive testing with 44 questions in 70 minutes and a 200–800 score scale; this page also retains international registration, device, date and score-reporting information relevant to students in China.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "大学申请中的 SAT 数学成绩；学校分别决定是否要求、接受或审阅 SAT。", "SAT Math evidence for university applications; each institution decides whether SAT is required, accepted or reviewed."),
      fact(base, "Registration"),
      revisedFact(base, "Format", "数学形式", "Math format", "两组各 35 分钟，共 44 题；第二组难度取决于第一组表现。", "Two 35-minute modules with 44 questions in total; Module 2 difficulty depends on Module 1 performance."),
      revisedFact(base, "Scoring", "数学评分", "Math scoring", "数学单项 200–800；没有适用于所有大学的统一及格线。", "Math is reported on a 200–800 scale; there is no universal university pass mark."),
      fact(base, "International fees through December 2026"),
      fact(base, "Spring 2027 fees"),
      fact(base, "Device"),
      fact(base, "Score release"),
      fact(base, "Institutional policy"),
    ],
    sections: [
      section(base, "sat-registration-route"),
      {
        ...format,
        title: t("数学部分结构", "Math section structure"),
        tables: format.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Math") })),
      },
      {
        ...score,
        title: t("数学评分与使用", "Math scoring and use"),
        bullets: [
          t("数学量尺分考虑自适应路径和题目特征，答对题数相同不一定得到相同量尺分。", "Math scale scores account for adaptive routing and item characteristics; the same correct-answer count need not produce the same scale score."),
          t("College Board 的 SAT Math college-and-career readiness benchmark 为 530；它不是大学录取线。", "College Board's SAT Math college-and-career readiness benchmark is 530; it is not a university admission cutoff."),
          t("申请时以大学当届政策、专业要求和已录取学生数学成绩范围为准。", "Use the university's current policy, programme requirements and admitted-student Math score range when planning applications."),
        ],
      },
      {
        ...prep,
        title: t("官方数学练习", "Official Math practice"),
        tables: prep.tables?.map((table) => ({
          ...table,
          rows: table.rows.map((row) => row.cells[0]?.en === "Bluebook practice"
            ? rowLike(row, [row.cells[0], t("Bluebook 提供界面预览和全长自适应模考；数学部分可练习内置计算器、公式表和两模块计时。", "Bluebook provides interface previews and full-length adaptive practice; use the Math section for the built-in calculator, formula sheet and two-module timing.")])
            : rowLike(row, [row.cells[0], t("SAT Student Question Bank 可筛选 Math、知识域、技能和难度，形成官方数学题单。", "The SAT Student Question Bank can be filtered by Math, domain, skill and difficulty to build an official mathematics set.")])),
        })),
      },
    ],
    relatedIds: (base.relatedIds ?? []).flatMap((id) => id === "ap-calculus" ? ["ap-calculus-ab", "ap-calculus-bc"] : [id]),
    searchTerms: [...base.searchTerms, "SAT Math", "SAT 数学"],
  };
}

function mathOnlyAct(): ProjectRecord {
  const base = project("act");
  const format = section(base, "act-format-table");
  const prep = section(base, "act-official-preparation");
  return {
    ...base,
    title: t("ACT 本科入学考试：数学部分", "ACT: Mathematics Section"),
    summary: t(
      "Enhanced ACT 数学部分共 45 题、50 分钟，其中 41 题计分，数学单项按 1–36 报告；本页另列中国学生使用 MyACT 的国际报名信息。",
      "Enhanced ACT Mathematics has 45 questions in 50 minutes, including 41 scored items, and reports a 1–36 Math score; this page also covers international MyACT registration for students in China.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "大学申请中的 ACT 数学成绩；院校分别制定考试政策和参考范围。", "ACT Mathematics evidence for university applications; institutions set their own testing policies and reference ranges."),
      fact(base, "International delivery"),
      revisedFact(base, "Current structure", "数学结构", "Math structure", "45 题、50 分钟；41 题计分、4 题试测。", "45 questions in 50 minutes; 41 scored and 4 field-test items."),
      revisedFact(base, "Scoring", "数学评分", "Math scoring", "数学单项按 1–36 报告；ACT 不设通用录取线。", "Math is reported on the 1–36 scale; ACT sets no universal admission cutoff."),
      fact(base, "Fees"),
      revisedFact(base, "Score retention and institutional use", "数学成绩寄送", "Math score reporting", "MyACT 可寄送既有考试日期的成绩，较旧记录可能收取 archive fee；院校自行决定是否接受旧成绩及如何审阅数学分。", "MyACT can report results from prior test dates, with an archive fee possible for older records; institutions decide whether to accept older results and how to review the Math score."),
    ],
    sections: [
      section(base, "act-china-registration"),
      {
        ...format,
        title: t("数学部分结构", "Mathematics section structure"),
        tables: format.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Mathematics") })),
      },
      {
        ...section(base, "act-score-use"),
        title: t("数学成绩与申请", "Math score and applications"),
        bullets: [
          t("1–36 是量尺分，不是百分制；不同试卷的原始答对数会经过等值处理。", "The 1–36 result is a scale score, not a percentage; raw correct counts are equated across forms."),
          t("ACT 不设统一大学录取线；目标数学分应来自院校当届政策、专业要求和已录取学生数据。", "ACT sets no universal university cutoff; target Math scores should come from the institution's current policy, programme requirements and admitted-student data."),
        ],
      },
      {
        ...prep,
        title: t("官方数学练习", "Official Mathematics practice"),
        tables: prep.tables?.map((table) => ({ ...table, rows: table.rows.map((row) => rowLike(row, [row.cells[0], t("使用标明 Enhanced ACT 的 Mathematics 说明、在线样题和全长练习卷中的数学部分。", "Use Mathematics guidance, online samples and the Math sections of full-length tests labelled for the Enhanced ACT.")])) })),
      },
    ],
    relatedIds: (base.relatedIds ?? []).filter((id) => id !== "toefl-ibt" && id !== "ielts-academic"),
    searchTerms: ["ACT", "ACT Math", "ACT Mathematics", "ACT 数学", "美国大学入学考试", "ACT international", "enhanced ACT", "MyACT"],
  };
}

function mathOnlySsat(): ProjectRecord {
  const base = project("ssat");
  const levels = section(base, "ssat-levels-format");
  const prep = section(base, "ssat-official-preparation");
  return {
    ...base,
    title: t("SSAT 私立中学入学考试：数学部分", "SSAT: Quantitative Sections"),
    summary: t(
      "SSAT 数学部分按 Elementary、Middle、Upper 三个等级设置。中国大陆考生通过 SSAT China 报名；Middle 与 Upper 各有两组 25 题、30 分钟的 Quantitative，均不得使用计算器。",
      "SSAT mathematics is offered at Elementary, Middle and Upper levels. Mainland-China candidates register through SSAT China; Middle and Upper each contain two 25-question, 30-minute Quantitative sections without a calculator.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "私立中学申请中的数学能力证据；各校自行决定是否要求及如何使用。", "Mathematics evidence in independent-school admission; each school decides whether and how to use it."),
      fact(base, "Levels"),
      fact(base, "International options"),
      fact(base, "Published international price—not China checkout price"),
      revisedFact(base, "Scoring", "数学评分", "Mathematics scoring", "Elementary 数学按答对数计分且答错不扣分；Middle／Upper 的 Quantitative 量尺分和同年级百分位分别报告。", "Elementary Math uses correct-answer scoring without a wrong-answer penalty; Middle/Upper Quantitative scale scores and same-grade percentiles are reported."),
      fact(base, "Score availability"),
    ],
    sections: [
      section(base, "ssat-china-registration"),
      section(base, "ssat-china-2026-27-calendar"),
      {
        ...levels,
        title: t("等级与数学部分", "Levels and mathematics sections"),
        tables: levels.tables?.map((table) => ({
          ...table,
          columns: [table.columns[0], table.columns[1], table.columns[2], t("数学部分", "Mathematics section")],
          rows: table.rows.map((row) => rowLike(row, [
            row.cells[0],
            row.cells[1],
            row.cells[2],
            row.cells[0]?.en === "Elementary"
              ? t("Quantitative：30 题、30 分钟；不得使用计算器", "Quantitative: 30 questions in 30 minutes; no calculator")
              : t("Quantitative 1 与 2：每组 25 题、30 分钟；不得使用计算器", "Quantitative 1 and 2: 25 questions in 30 minutes each; no calculator"),
          ])),
        })),
      },
      {
        ...section(base, "ssat-score-use"),
        title: t("数学成绩使用", "Use of mathematics results"),
        bullets: [
          t("EMA 不设统一私校录取数学线；同一分数在不同学校、申请年级和轮次中的含义不同。", "EMA sets no universal independent-school mathematics cutoff; interpretation varies by school, entry grade and application round."),
          t("申请时同时查看 Quantitative 量尺分和同年级 SSAT 百分位，并向学校确认数学成绩权重。", "Review the Quantitative scale score and same-grade SSAT percentile together, and confirm the weight of mathematics with the school."),
        ],
      },
      {
        ...prep,
        title: t("官方数学练习", "Official mathematics practice"),
        tables: prep.tables?.map((table) => ({ ...table, rows: table.rows.map((row) => rowLike(row, [row.cells[0], row.cells[1]?.en.startsWith("Thirty") ? t("30 道官方样题含数学题，可用于熟悉题型并查看诊断结果。", "Thirty official sample questions include mathematics items for format familiarisation and diagnostic feedback.") : t("Middle／Upper 订阅包含全长模考、分项测试、专题练习和解析；只使用 Quantitative 内容。", "Middle/Upper subscriptions include full tests, section tests, topic practice and explanations; use the Quantitative content only.")])) })),
      },
    ],
    searchTerms: [...base.searchTerms, "SSAT Math", "SSAT Quantitative", "SSAT 数学"],
  };
}

function mathOnlyIsee(): ProjectRecord {
  const base = project("isee");
  const levels = section(base, "isee-level-format");
  const mathRows = levels.tables?.[0]?.rows ?? [];
  const mathDescription = (row: TableRow) => {
    const level = row.cells[0]?.en;
    if (level === "Primary 2") return t("Mathematics：24 题", "Mathematics: 24 items");
    if (level === "Primary 3") return t("Mathematics：24 题", "Mathematics: 24 items");
    if (level === "Primary 4") return t("Mathematics：28 题", "Mathematics: 28 items");
    if (level === "Lower") return t("Quantitative Reasoning：38 题／35 分钟；Mathematics Achievement：30 题／30 分钟", "Quantitative Reasoning: 38 items/35 minutes; Mathematics Achievement: 30 items/30 minutes");
    return t("Quantitative Reasoning：37 题／35 分钟；Mathematics Achievement：47 题／40 分钟", "Quantitative Reasoning: 37 items/35 minutes; Mathematics Achievement: 47 items/40 minutes");
  };
  return {
    ...base,
    title: t("ISEE 独立学校入学考试：数学部分", "ISEE: Mathematics Sections"),
    summary: t(
      "ISEE 数学包括 Quantitative Reasoning 与 Mathematics Achievement，等级按申请入读年级确定。中国学生使用 ERB 实时报名系统查询可用形式、地点和日期。",
      "ISEE mathematics comprises Quantitative Reasoning and Mathematics Achievement, with the level determined by the grade applied for. Students in China use ERB's live registration system to check available formats, locations and dates.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "独立学校申请中的数学推理与数学成就证据；学校自行设定要求。", "Evidence of quantitative reasoning and mathematics achievement in independent-school admission; schools set their own requirements."),
      fact(base, "Levels"),
      fact(base, "Retesting"),
      fact(base, "Prometric fee"),
      revisedFact(base, "Scoring", "数学评分", "Mathematics scoring", "Quantitative Reasoning 与 Mathematics Achievement 分别报告 760–940 量尺分、百分位和 stanine；不合成为官方总分。", "Quantitative Reasoning and Mathematics Achievement separately report 760–940 scale scores, percentiles and stanines; they are not combined into an official total."),
      fact(base, "Score release"),
    ],
    sections: [
      section(base, "isee-china-registration"),
      {
        ...levels,
        title: t("等级与数学题量", "Levels and mathematics item counts"),
        tables: levels.tables?.map((table) => ({
          ...table,
          columns: [table.columns[0], table.columns[1], t("数学部分", "Mathematics sections")],
          rows: mathRows.map((row) => rowLike(row, [row.cells[0], row.cells[1], mathDescription(row)])),
        })),
      },
      {
        ...section(base, "isee-score-interpretation"),
        title: t("数学成绩解释", "Mathematics score interpretation"),
        bullets: section(base, "isee-score-interpretation").bullets?.slice(0, 3),
      },
      section(base, "isee-official-preparation"),
    ],
    searchTerms: [...base.searchTerms, "ISEE Math", "ISEE 数学"],
  };
}

function mathOnlyUkiset(): ProjectRecord {
  const base = project("ukiset");
  const registration = section(base, "ukiset-china-registration");
  const format = section(base, "ukiset-format");
  return {
    ...base,
    title: t("UKiset 英国私校入学测评：数学推理", "UKiset: Mathematical Reasoning"),
    summary: t(
      "UKiset 数学推理位于自适应 Reasoning Test，公开范围为数字、数值和数列；主办方没有发布数学分项固定题量、完整考纲或公开真题。",
      "UKiset mathematical reasoning sits within the adaptive Reasoning Test and publicly covers numbers, value and sequences; the organiser publishes no fixed mathematics item count, exhaustive syllabus or public live papers.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "英国私校申请中的数学推理参考；目标学校决定是否要求及如何使用。", "Mathematical-reasoning evidence for UK independent-school admission; the target school decides whether and how to use it."),
      fact(base, "Age range"),
      revisedFact(base, "Format", "数学形式", "Mathematics format", "数学位于 40–45 分钟的自适应 Reasoning Test；官方未单列固定题量或时间。", "Mathematics sits within the 40–45 minute adaptive Reasoning Test; no separate fixed item count or timing is published."),
      fact(base, "Fee"),
      fact(base, "Results and validity"),
      revisedFact(base, "Reporting", "数学报告", "Mathematics reporting", "数学推理提供标准分、英国同龄人百分位和 stanine。", "Mathematical reasoning is reported with a standardized score, UK national percentile and stanine."),
    ],
    sections: [
      {
        ...registration,
        tables: registration.tables?.map((table) => ({
          ...table,
          rows: table.rows.map((row) => {
            if (row.cells[0]?.en === "Before registering") return rowLike(row, [row.cells[0], t("先向目标学校确认是否要求或接受 UKiset、数学成绩使用方式和最晚报告日期；UKiset 没有适用于所有学校的数学及格线。", "Confirm whether the target school requires or accepts UKiset, how it uses the mathematics result and the reporting deadline; UKiset has no universal mathematics pass mark.")]);
            if (row.cells[0]?.en === "Test day") return rowLike(row, [row.cells[0], t("携带护照、电脑、白纸和笔；数学推理不得使用计算器。", "Bring the passport, computer, blank paper and pens; calculators are prohibited for mathematical reasoning.")]);
            return row;
          }),
        })),
      },
      {
        ...format,
        title: t("数学推理结构", "Mathematical-reasoning structure"),
        tables: format.tables?.map((table) => ({
          ...table,
          rows: table.rows.filter((row) => row.cells[0]?.en === "Reasoning").map((row) => rowLike(row, [row.cells[0], row.cells[1], t("Mathematics：数字、数值和数列；官方未单列固定题量", "Mathematics: numbers, value and sequences; no separate fixed item count is published"), t("数学标准分、英国同龄人百分位与 stanine", "Mathematics standardized score, UK national percentile and stanine")])),
        })),
      },
      {
        ...section(base, "ukiset-score-use"),
        title: t("数学结果使用", "Use of mathematics results"),
        bullets: [
          t("家长报告列出数学推理结果；学校版报告提供更完整的同龄人比较。", "The parent report lists mathematical-reasoning results; the school profile provides fuller peer comparisons."),
          t("目标学校决定是否进入下一轮、是否另考数学或安排面试；UKiset 本身不作录取决定。", "The target school decides progression, any further mathematics test and interviews; UKiset does not make admission decisions."),
        ],
      },
      {
        ...section(base, "ukiset-official-preparation"),
        title: t("数学材料公开状态", "Publication status of mathematics material"),
        bullets: [
          t("主办方不公开数学正式历年卷、完整免费模拟卷或固定题库。", "The organiser publishes no live mathematics past papers, complete free mock or fixed public item bank."),
          t("备考只能依据公开范围熟悉数字、数值和数列；不得把第三方题库标成 UKiset 官方真题。", "Preparation can use the published boundary of numbers, value and sequences; third-party banks must not be labelled as official UKiset papers."),
        ],
      },
    ],
    searchTerms: [...base.searchTerms, "UKiset Mathematics", "UKiset 数学"],
  };
}

function mathOnlyCat4(): ProjectRecord {
  const base = project("cat4");
  const batteries = section(base, "cat4-batteries");
  return {
    ...base,
    title: t("CAT4 认知能力测评：数量推理", "CAT4: Quantitative Reasoning"),
    summary: t(
      "CAT4 数量推理由 Number Analogies 与 Number Series 两类任务构成。CAT4 由学校采购和组织，个人没有官方报名入口，安全题库不公开。",
      "CAT4 Quantitative Reasoning comprises Number Analogies and Number Series. CAT4 is purchased and administered by schools, has no public individual-registration route, and does not release its secure item bank.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "学校用于了解数字关系与规律识别能力；不是按课程命题的数学成绩考试。", "Used by schools to understand numerical relationships and rule recognition; it is not a curriculum-based mathematics attainment test."),
      fact(base, "Access"),
      fact(base, "Ages and levels"),
      revisedFact(base, "Format and timing", "数量推理形式", "Quantitative format", "数字版数量推理包含 Number Analogies 与 Number Series；完整 CAT4 由学校按级别和模式安排。", "Digital Quantitative Reasoning includes Number Analogies and Number Series; the school schedules the full CAT4 by level and mode."),
      revisedFact(base, "Reporting", "数量推理报告", "Quantitative reporting", "通常报告数量推理的 Standard Age Score、百分位和 stanine。", "Reports normally include a Quantitative Reasoning Standard Age Score, percentile and stanine."),
      fact(base, "Fees and dates"),
    ],
    sections: [
      section(base, "cat4-china-route"),
      {
        ...batteries,
        title: t("数量推理任务", "Quantitative Reasoning tasks"),
        tables: batteries.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Quantitative") })),
      },
      {
        ...section(base, "cat4-score-interpretation"),
        title: t("数量推理成绩解释", "Quantitative result interpretation"),
        bullets: [
          t("数量推理的年龄常模 SAS 均值为 100、标准差约 15。", "The age-normed Quantitative SAS has a mean of 100 and standard deviation of about 15."),
          t("NPR 表示同年龄常模中分数不高于该生的比例；stanine 1–9 是宽分组，不是学校录取等级。", "NPR is the proportion of the age norm at or below the score; stanines 1–9 are broad bands, not school admission grades."),
          t("CAT4 没有全国或国际学校通用的数量推理录取线；校内参考范围须由申请学校说明。", "CAT4 has no national or international-school-wide Quantitative cutoff; any internal reference range must come from the applicant school."),
        ],
      },
      section(base, "cat4-preparation"),
    ],
    searchTerms: [...base.searchTerms, "CAT4 Quantitative", "CAT4 数量推理"],
  };
}

function mathOnlyMapGrowth(): ProjectRecord {
  const base = project("map-growth");
  const coverage = section(base, "map-growth-subjects");
  return {
    ...base,
    title: t("NWEA MAP Growth 数学测评", "NWEA MAP Growth Mathematics"),
    summary: t(
      "MAP Growth Mathematics 是学校组织的计算机自适应测评，通常约 43 题、45–55 分钟，以 RIT 量尺报告数学水平与成长；没有面向个人的统一报名入口。",
      "MAP Growth Mathematics is a school-administered computer-adaptive assessment, usually about 43 items in 45–55 minutes, reporting mathematics achievement and growth on the RIT scale; there is no public individual-registration route.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "监测数学水平与学期、学年间成长；部分学校也将其作为校内分班或申请材料之一。", "Measures mathematics achievement and growth across terms and years; some schools also use it for internal placement or as one admission input."),
      fact(base, "Access"),
      revisedFact(base, "Subjects and grades", "数学版本", "Mathematics versions", "K–12 Mathematics，以及学校购买的 Algebra、Geometry 等课程版本。", "K–12 Mathematics plus course-specific Algebra, Geometry and related versions purchased by the school."),
      revisedFact(base, "Format and timing", "数学形式与用时", "Math format and timing", "计算机自适应，约 43 题；不限时，多数学生约 45–55 分钟。", "Computer-adaptive with about 43 items; untimed, with most students taking about 45–55 minutes."),
      revisedFact(base, "Scoring", "数学评分", "Math scoring", "数学 RIT、成绩百分位和成长百分位；常模版本会影响百分位解释。", "Mathematics RIT, achievement percentile and growth percentile; the norm edition affects percentile interpretation."),
      fact(base, "Fees and dates"),
    ],
    sections: [
      section(base, "map-growth-china-route"),
      {
        ...coverage,
        title: t("数学测评覆盖", "Mathematics assessment coverage"),
        tables: coverage.tables?.map((table) => ({ ...table, rows: table.rows.filter((row) => row.cells[0]?.en === "Mathematics") })),
      },
      {
        ...section(base, "map-growth-score-interpretation"),
        title: t("数学 RIT 与百分位", "Mathematics RIT and percentiles"),
        bullets: [
          t("数学 RIT 在年级和季节之间保持同一量尺含义，可用于观察纵向成长；它不是答对百分比。", "Mathematics RIT retains scale meaning across grades and seasons for longitudinal growth; it is not percent correct."),
          t("成绩百分位按同年级、同季节的美国数学常模解释，国际学校应标明该常模背景。", "Achievement percentiles use U.S. mathematics norms for the same grade and season; international schools should identify that norm context."),
          t("2025 常模取代旧常模后，同一 RIT 对应的百分位可能变化；历史报告应保留当时使用的常模版本。", "When 2025 norms replaced older norms, the percentile attached to the same RIT could change; historical reports should retain the norm edition used."),
          t("MAP Growth Mathematics 没有适用于所有国际学校的统一录取线。", "MAP Growth Mathematics has no universal international-school admission cutoff."),
        ],
      },
      section(base, "map-growth-familiarisation"),
    ],
    searchTerms: [...base.searchTerms, "MAP Mathematics", "MAP 数学"],
  };
}

function mathOnlyEsat(): ProjectRecord {
  const base = project("esat");
  const moduleChoice = section(base, "esat-module-choice");
  const prep = section(base, "esat-official-preparation");
  return {
    ...base,
    title: t("ESAT：Mathematics 1／2", "ESAT: Mathematics 1 and 2"),
    summary: t(
      "ESAT 的 Mathematics 1 与 Mathematics 2 均为 27 道选择题、40 分钟并独立计分。所有考生需要 Mathematics 1；是否需要 Mathematics 2 由申请课程的正式要求决定。",
      "ESAT Mathematics 1 and Mathematics 2 each contain 27 multiple-choice questions in 40 minutes and are scored separately. All candidates need Mathematics 1; the applicant's course determines whether Mathematics 2 is also required.",
    ),
    facts: [
      revisedFact(base, "Purpose", "用途", "Purpose", "英国大学相关课程申请中的数学入学测评；各课程规定所需模块。", "Mathematics admissions assessment for relevant UK university courses; each course specifies the required modules."),
      revisedFact(base, "Modules", "数学模块", "Mathematics modules", "Mathematics 1；Mathematics 2（按课程要求）", "Mathematics 1 and, where required by the course, Mathematics 2"),
      fact(base, "Format"),
      fact(base, "Booking"),
      fact(base, "Fee"),
      fact(base, "Scoring"),
      fact(base, "Attempts"),
      fact(base, "China test dates"),
    ],
    sections: [
      section(base, "esat-china-registration"),
      {
        ...moduleChoice,
        title: t("Mathematics 1／2 选择", "Selecting Mathematics 1 and 2"),
        tables: moduleChoice.tables?.map((table) => {
          const mathematicsOne = table.rows.find((row) => row.cells[0]?.en === "Mathematics 1");
          const optional = table.rows.find((row) => row.cells[0]?.en.startsWith("Biology"));
          const rows = [
            mathematicsOne,
            optional ? rowLike(optional, [t("Mathematics 2", "Mathematics 2"), optional.cells[1], optional.cells[2], t("按申请课程的正式要求选择", "Selected where required by the applicant's course")]) : undefined,
          ].filter((row): row is TableRow => Boolean(row));
          return { ...table, rows };
        }),
        bullets: [
          t("大学课程页和 UAT-UK Course List 按课程与 UCAS code 规定是否需要 Mathematics 2。", "University course pages and the UAT-UK Course List specify by course and UCAS code whether Mathematics 2 is required."),
          t("确认 test card 后再进入 Pearson VUE 预约；改动模块通常需要取消并重新预约。", "Confirm the test card before booking through Pearson VUE; changing modules normally requires cancellation and rebooking."),
        ],
      },
      section(base, "esat-test-day"),
      section(base, "esat-score-boundary"),
      {
        ...prep,
        title: t("Mathematics 1／2 官方材料", "Official Mathematics 1 and 2 material"),
        tables: prep.tables?.map((table) => ({
          ...table,
          rows: table.rows.map((row) => row.cells[0]?.en === "UAT-UK Prepare"
            ? rowLike(row, [row.cells[0], t("官方 specification、Pearson Mathematics 1／2 specimen 与 sample tests，以及数学指南；样卷含讲解答案，练习卷应按时完成。", "Official specification, Pearson Mathematics 1/2 specimen and sample tests, and mathematics guides; specimens include explained answers and practice tests should be timed.")])
            : rowLike(row, [t("数学指南与历史材料", "Mathematics guides and historic material"), t("分别提供 Mathematics 1／2 指南，以及标出超出现行范围题目的前身测评历史卷和答案。", "Provides separate Mathematics 1/2 guides and predecessor-assessment papers with out-of-scope questions identified.")])),
        })),
      },
    ],
    searchTerms: ["ESAT", "UAT-UK", "Mathematics 1", "Mathematics 2", "ESAT Mathematics", "ESAT 数学", "Cambridge", "Oxford", "Imperial", "UCL"],
  };
}

export const mathAssessmentProjects: ProjectRecord[] = [
  mathOnlySat(),
  project("tmua"),
  mathOnlyEsat(),
  project("step"),
  mathOnlyAct(),
  mathOnlySsat(),
  mathOnlyIsee(),
  mathOnlyUkiset(),
  mathOnlyCat4(),
  mathOnlyMapGrowth(),
];
