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
  noteZh?: string,
  noteEn?: string,
): SyllabusSourceRecord => ({
  title: t(titleZh, titleEn),
  provider: t(providerZh, providerEn),
  url,
  format,
  ...(versionZh && versionEn ? { version: t(versionZh, versionEn) } : {}),
  ...(noteZh && noteEn ? { note: t(noteZh, noteEn) } : {}),
});

export const ukAssessmentSyllabi: AssessmentSyllabusRecord[] = [
  {
    id: "syllabus-tmua-2027-entry",
    slug: "tmua-2027-entry",
    projectId: "tmua",
    classification: "formal-specification",
    title: t("TMUA 2027 入学周期考纲", "TMUA Specification for 2027 Entry"),
    officialName: t(
      "大学数学入学考试（TMUA）",
      "Test of Mathematics for University Admission (TMUA)",
    ),
    applicableCycle: t(
      "2027 入学；2026 年 10 月与 2027 年 1 月场次",
      "2027 entry; October 2026 and January 2027 sittings",
    ),
    effectiveFrom: "2026-10",
    status: "confirmed",
    summary: t(
      "现行 TMUA 由两张各 75 分钟的选择题试卷组成。两卷共用 Section 1 数学知识；Paper 2 另考 Section 2 的逻辑、证明与错误识别。Section 1 分为接近 AS Pure Mathematics 的 Part 1，以及接近 Higher Tier GCSE Mathematics 的 Part 2。",
      "The current TMUA consists of two 75-minute multiple-choice papers. Both papers draw on Section 1 mathematical knowledge; Paper 2 additionally assesses the logic, proof and error-identification content in Section 2. Section 1 is divided into Part 1, broadly aligned with AS Pure Mathematics, and Part 2, broadly aligned with Higher Tier GCSE Mathematics.",
    ),
    facts: [
      fact("适用场次", "Applicable sittings", "2026 年 10 月、2027 年 1 月", "October 2026 and January 2027"),
      fact("Paper 1", "Paper 1", "数学知识应用；20 道选择题；75 分钟", "Applications of Mathematical Knowledge; 20 multiple-choice questions; 75 minutes"),
      fact("Paper 2", "Paper 2", "数学推理；20 道选择题；75 分钟", "Mathematical Reasoning; 20 multiple-choice questions; 75 minutes"),
      fact("计分", "Marking", "两卷等权；答错不倒扣", "Papers are equally weighted; no negative marking"),
      fact("允许工具", "Permitted aids", "不得使用计算器、词典或公式表", "No calculator, dictionary or formula booklet"),
      fact("知识关系", "Content relationship", "Paper 1 考 Section 1；Paper 2 考 Section 1 与 Section 2", "Paper 1 assesses Section 1; Paper 2 assesses Sections 1 and 2"),
    ],
    sections: [
      {
        id: "tmua-paper-structure",
        title: t("试卷结构与考查关系", "Paper structure and assessment relationship"),
        tables: [
          {
            columns: [
              t("试卷", "Paper"),
              t("题量／时间", "Items / time"),
              t("直接考查", "Directly assessed content"),
              t("考查方式", "Assessment focus"),
            ],
            rows: [
              row(
                ["Paper 1：数学知识应用", "Paper 1: Applications of Mathematical Knowledge"],
                ["20 题／75 分钟", "20 items / 75 minutes"],
                ["Section 1：Part 1 与 Part 2", "Section 1: Parts 1 and 2"],
                ["在新情境中选择、组合并应用规定的数学知识", "Selecting, combining and applying specified mathematics in unfamiliar contexts"],
              ),
              row(
                ["Paper 2：数学推理", "Paper 2: Mathematical Reasoning"],
                ["20 题／75 分钟", "20 items / 75 minutes"],
                ["Section 1 全部内容，加 Section 2", "All of Section 1, plus Section 2"],
                ["理解和构造数学论证，运用初等逻辑，辨认论证错误", "Understanding and constructing arguments, using elementary logic and identifying errors"],
              ),
            ],
            note: t(
              "两卷连续进行、等权计分；官方 specification 未提供可在考试中使用的公式表。",
              "The two papers are taken consecutively and carry equal weight; the official specification provides no formula booklet for use in the test.",
            ),
          },
        ],
      },
      {
        id: "tmua-section-one-part-one",
        title: t("Section 1 · Part 1：进阶数学范围", "Section 1 · Part 1: advanced mathematics"),
        intro: t(
          "官方将这一部分描述为覆盖 AS Pure Mathematics 的绝大部分内容。下表保留 specification 的 MM1–MM8 编码。",
          "UAT-UK describes this part as covering almost all AS Pure Mathematics. The MM1–MM8 specification codes are retained below.",
        ),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(
                ["MM1 代数与函数", "MM1 Algebra and functions"],
                ["有理指数律；根式化简与分母有理化；二次函数、判别式、配方与方程；一次—二次联立方程；一次及二次不等式；多项式展开、因式分解、除法、因式定理与余式定理；函数作为映射及常见函数性质。", "Laws of indices for rational exponents; surd manipulation and rationalisation; quadratic functions, discriminant, completing the square and equations; simultaneous linear–quadratic equations; linear and quadratic inequalities; polynomial expansion, factorisation and division, the Factor and Remainder Theorems; functions as mappings and properties of common functions."],
              ),
              row(
                ["MM2 数列与级数", "MM2 Sequences and series"],
                ["显式第 n 项与简单递推数列；等差级数；有限等比级数与收敛等比级数的无穷和；正整数指数二项式展开；n! 与二项式系数记号。", "Sequences defined by an nth term or simple recurrence; arithmetic series; finite geometric series and sums to infinity for convergent geometric series; binomial expansion for positive integer powers; notation for n! and binomial coefficients."],
              ),
              row(
                ["MM3 平面解析几何", "MM3 Coordinate geometry"],
                ["直线方程、平行与垂直条件；圆的标准式和一般式；弦、半径、切线、圆周角、半圆、同弧角、圆内接四边形和弦切角等规定圆性质。", "Equations of straight lines and conditions for parallel or perpendicular lines; standard and general equations of a circle; specified circle properties involving chords, radii, tangents, central and inscribed angles, semicircles, cyclic quadrilaterals and the alternate segment theorem."],
              ),
              row(
                ["MM4 三角学", "MM4 Trigonometry"],
                ["正弦定理、余弦定理与三角形面积，包括正弦定理歧义情形和二维／三维问题；弧度、弧长、扇形和弓形面积；常用角精确值；三角函数图像、对称性和周期性；tanθ=sinθ/cosθ、sin²θ+cos²θ=1；给定区间内的简单三角方程。", "Sine and cosine rules and triangle area, including the ambiguous case and 2-D/3-D problems; radians, arc length and sector/segment area; exact values at standard angles; trigonometric graphs, symmetry and periodicity; tanθ = sinθ/cosθ and sin²θ + cos²θ = 1; simple trigonometric equations on a stated interval."],
              ),
              row(
                ["MM5 指数与对数", "MM5 Exponentials and logarithms"],
                ["y=aˣ 及其图像；对数定义与运算律；可化为 aˣ=b 的方程。不会设置必须使用换底公式的题目。", "The function y = aˣ and its graph; definition and laws of logarithms; equations reducible to aˣ = b. Questions requiring the change-of-base formula are excluded."],
              ),
              row(
                ["MM6 微分", "MM6 Differentiation"],
                ["导数作为切线斜率和变化率；二阶导数与记号；有理指数幂函数及其和差的求导；切线、法线、驻点、极大／极小、单调性。排除第一性原理；不考拐点，但要求理解简单多项式曲线中的拐点。", "Derivative as tangent gradient and rate of change; second derivatives and notation; differentiation of rational powers and related sums/differences; tangents, normals, stationary points, maxima/minima and monotonicity. First principles are excluded; points of inflexion are not examined, although qualitative understanding is expected."],
              ),
              row(
                ["MM7 积分", "MM7 Integration"],
                ["定积分与曲线—坐标轴面积的区别；有理指数 n≠−1 的幂函数积分；微积分基本定理；同区间或相邻区间积分的组合；梯形法及高估／低估判断；dy/dx=f(x) 型微分方程。", "Definite integration and the distinction between an integral and geometric area; integration of rational powers with n ≠ −1; the Fundamental Theorem of Calculus; combining integrals over equal or contiguous ranges; the trapezium rule and over-/underestimation; differential equations of the form dy/dx = f(x)."],
              ),
              row(
                ["MM8 函数图像", "MM8 Graphs of functions"],
                ["直线、二次、三次、三角、对数、指数、平方根和绝对值函数的识别与草图；af(x)、f(x)+a、f(x+a)、f(ax) 及复合变换；参数变化；用微分判断曲线形状；交轴点、实根数量与联立方程的几何解释。", "Recognition and sketching of linear, quadratic, cubic, trigonometric, logarithmic, exponential, square-root and modulus graphs; transformations af(x), f(x)+a, f(x+a), f(ax) and compositions; parameter effects; using differentiation to determine shape; intercepts, possible real roots and graphical interpretation of simultaneous equations."],
              ),
            ],
          },
        ],
      },
      {
        id: "tmua-section-one-part-two",
        title: t("Section 1 · Part 2：基础数学范围", "Section 1 · Part 2: foundation mathematics"),
        intro: t(
          "官方将这一部分描述为覆盖 Higher Tier GCSE Mathematics 的绝大部分内容。下表保留 M1–M7 编码。",
          "UAT-UK describes this part as covering almost all Higher Tier GCSE Mathematics. The M1–M7 codes are retained below.",
        ),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["M1 单位", "M1 Units"], ["质量、长度、时间、货币等标准单位；速度、工资率、单价、密度、压强等复合单位；数值与代数情境中的单位换算。", "Standard units of mass, length, time, money and other measures; compound units such as speed, rates of pay, unit pricing, density and pressure; conversions in numerical and algebraic contexts."]),
              row(["M2 数", "M2 Number"], ["正负整数、小数与分数的次序和四则运算；质数、因数、倍数、HCF、LCM、唯一分解；运算顺序；系统枚举与乘法原理；平方、立方和根；整数／分数／负指数；标准式；循环小数与分数；百分数；根式、π 与精确值；上下界、误差区间、舍入和估算。", "Ordering and arithmetic with signed integers, decimals and fractions; primes, factors, multiples, HCF, LCM and unique factorisation; order of operations; systematic listing and the product rule; powers and roots; integer, fractional and negative indices; standard form; recurring decimals and fractions; percentages; exact values involving surds and π; bounds, error intervals, rounding and estimation."]),
              row(["M3 比与比例", "M3 Ratio and proportion"], ["比例尺与地图；比、分数和按比分配；换算、比较、缩放、混合、浓度；百分比与变化率；直接／反比例及其图像；相似图形的长度、面积和体积比；增长、衰减、复利和迭代。", "Scale factors and maps; ratios, fractions and division in a ratio; conversion, comparison, scaling, mixtures and concentration; percentages and percentage change; direct/inverse proportion and graphs; similarity ratios for length, area and volume; growth, decay, compound interest and iteration."]),
              row(["M4 代数", "M4 Algebra"], ["代数记号与代入；指数律；展开、因式分解和代数分式；变形公式；恒等式；坐标与直线；二次根与转折点；规定函数图像和情境图；一次／二次方程与联立方程；不等式；数列和第 n 项。", "Algebraic notation and substitution; laws of indices; expansion, factorisation and algebraic fractions; rearranging formulae; identities; coordinates and straight lines; quadratic roots and turning points; specified graphs and contextual graphs; linear/quadratic equations and simultaneous equations; inequalities; sequences and nth terms."]),
              row(["M5 几何", "M5 Geometry"], ["角、平行线、多边形和常见平面图形；SSS、SAS、ASA、RHS 全等与相似；变换；勾股定理；圆术语与圆定理；坐标几何；三维图形、平面图和立视图；周长、面积、体积和表面积；弧与扇形；相似图形面积／体积；直角三角形三角比；向量。", "Angles, parallel lines, polygons and standard plane figures; SSS, SAS, ASA and RHS congruence and similarity; transformations; Pythagoras; circle terminology and theorems; coordinate geometry; 3-D shapes, plans and elevations; perimeter, area, volume and surface area; arcs and sectors; similarity area/volume; right-triangle trigonometry; vectors."]),
              row(["M6 统计", "M6 Statistics"], ["频数表、条形图、饼图、象形图与竖线图；分组／连续数据；直方图、频数多边形、累积频数和箱线图；均值、众数、中位数和极差；散点图、相关与最佳拟合线。", "Frequency tables, bar charts, pie charts, pictograms and vertical line charts; grouped and continuous data; histograms, frequency polygons, cumulative frequency and box plots; mean, mode, median and range; scatter graphs, correlation and lines of best fit."]),
              row(["M7 概率", "M7 Probability"], ["实验频率、样本量、随机性与公平性；相对频率和理论概率；完备事件组；表格、网格、Venn 图和树状图；组合实验样本空间；加法法则、乘法法则与条件概率。", "Experimental frequency, sample size, randomness and fairness; relative frequency and theoretical probability; exhaustive outcomes; tables, grids, Venn and tree diagrams; sample spaces for combined experiments; addition and multiplication rules and conditional probability."]),
            ],
          },
        ],
      },
      {
        id: "tmua-section-two",
        title: t("Section 2：数学思维、逻辑与证明", "Section 2: mathematical reasoning, logic and proof"),
        intro: t(
          "Section 2 只在 Paper 2 中直接考查，但论证所用数学知识来自 Section 1。",
          "Section 2 is directly assessed only in Paper 2, while the mathematical content used in arguments is drawn from Section 1.",
        ),
        tables: [
          {
            columns: [t("官方编码", "Official codes"), t("范围", "Scope"), t("明确边界", "Explicit boundary")],
            rows: [
              row(
                ["Arg1–Arg4：论证逻辑", "Arg1–Arg4: logic of arguments"],
                ["真／假；and、inclusive or、not；“if A then B”“A if B”“A only if B”“A iff B”；逆命题与逆否命题；必要与充分；for all、for some、there exists；含上述词语命题的否定。", "True/false; and, inclusive or and not; ‘if A then B’, ‘A if B’, ‘A only if B’, ‘A iff B’; converse and contrapositive; necessary and sufficient conditions; for all, for some and there exists; negation of statements using these forms."],
                ["不要求使用符号逻辑记号，也不要求完成形式真值表。", "Symbolic logical notation and formal truth tables are not required."],
              ),
              row(
                ["Prf1–Prf5：数学证明", "Prf1–Prf5: mathematical proof"],
                ["理解并在简单情形构造直接演绎证明、分类讨论、反证法和反例证伪；由已知陈述推出结论；从小规模情形提出并论证猜想；重排证明步骤；完成需要较长推理链的问题。", "Follow and, in simple cases, construct direct deductive proofs, proofs by cases, proofs by contradiction and disproof by counterexample; deduce implications; formulate and justify conjectures from small cases; order statements into a proof; solve problems requiring a sophisticated chain of reasoning."],
                ["证明必须依赖 Section 1 规定的数学知识，不另列新的学科知识章节。", "Proofs draw on the mathematical knowledge in Section 1 rather than a separate body of subject content."],
              ),
              row(
                ["Err1–Err2：证明错误识别", "Err1–Err2: identifying errors in proofs"],
                ["判断所谓证明中的无效步骤，并识别常见错误，例如未经条件检查进行约分，或从 sin A = sin B 直接推出 A = B。", "Identify invalid steps in purported proofs and common errors, such as cancelling without checking conditions or concluding A = B directly from sin A = sin B."],
                ["考查的是推理有效性，而不只是最终结论是否正确。", "The validity of the reasoning, not merely the truth of the final conclusion, is assessed."],
              ),
            ],
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "TMUA 内容规范",
        "TMUA Content Specification",
        "UAT-UK",
        "UAT-UK",
        "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165619/TMUA_Content_Specification.pdf",
        "pdf",
        "适用于 2026 年 10 月与 2027 年 1 月",
        "For assessment in October 2026 and January 2027",
      ),
      syllabusSource(
        "TMUA 考试介绍与结构",
        "TMUA overview and test format",
        "UAT-UK",
        "UAT-UK",
        "https://esat-tmua.ac.uk/about-the-tests/tmua-test/",
        "webpage",
        "2027 入学周期",
        "2027 entry cycle",
      ),
      syllabusSource(
        "TMUA 与 ESAT Mathematics 2 数学说明",
        "Notes on Mathematics for TMUA and ESAT Mathematics 2",
        "UAT-UK",
        "UAT-UK",
        "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/06/30103537/Notes_on_Mathematics_-for_TMUA_and_ESAT_M2.pdf",
        "pdf",
        "2026 年 6 月",
        "June 2026",
      ),
      syllabusSource(
        "TMUA Paper 2 逻辑与证明说明",
        "Notes on Logic and Proof for TMUA Paper 2",
        "UAT-UK",
        "UAT-UK",
        "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2025/06/25160507/Notes_on_Logic_and_Proof_June2025.pdf",
        "pdf",
        "2025 年 6 月现行说明",
        "Current notes dated June 2025",
      ),
    ],
    translationNote: t(
      "中文内容按 UAT-UK 现行英文 specification 逐项翻译并压缩为检索表。MM、M、Arg、Prf、Err 编码与关键英文逻辑表达保留；中文不是 UAT-UK 发布的官方译本。如中英文可能产生范围差异，以所链接英文原文为准。",
      "The Chinese text is an item-by-item editorial translation of the current UAT-UK specification, condensed into lookup tables. MM, M, Arg, Prf and Err codes and key English logical forms are retained. It is not an official UAT-UK translation; where scope could differ, the linked English specification controls.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-esat-2027-entry",
    slug: "esat-2027-entry",
    projectId: "esat",
    classification: "formal-specification",
    title: t("ESAT 2027 入学周期考纲", "ESAT Specification for 2027 Entry"),
    officialName: t(
      "工程与科学入学考试（ESAT）",
      "Engineering and Science Admissions Test (ESAT)",
    ),
    applicableCycle: t(
      "2027 入学；2026 年 10 月与 2027 年 1 月场次",
      "2027 entry; October 2026 and January 2027 sittings",
    ),
    effectiveFrom: "2026-10",
    status: "confirmed",
    summary: t(
      "ESAT 设 Mathematics 1、Biology、Chemistry、Physics、Mathematics 2 五个模块。所有考生都考 Mathematics 1，多数课程再要求两个模块；每模块 27 道选择题、40 分钟，单独计时和报告成绩。各科学模块同时假定 Mathematics 1 知识，Mathematics 2 则由 Mathematics 1 的 M 内容与额外 MM 内容共同构成。",
      "ESAT has five modules: Mathematics 1, Biology, Chemistry, Physics and Mathematics 2. All candidates take Mathematics 1 and most courses require two additional modules. Each module has 27 multiple-choice questions in 40 separately timed minutes and receives a separate score. Every science module assumes Mathematics 1, while Mathematics 2 comprises the Mathematics 1 M content plus additional MM content.",
    ),
    facts: [
      fact("适用场次", "Applicable sittings", "2026 年 10 月、2027 年 1 月", "October 2026 and January 2027"),
      fact("模块", "Modules", "Mathematics 1、Biology、Chemistry、Physics、Mathematics 2", "Mathematics 1, Biology, Chemistry, Physics and Mathematics 2"),
      fact("每模块", "Per module", "27 道选择题；40 分钟；单独计时", "27 multiple-choice questions; 40 minutes; separately timed"),
      fact("典型组合", "Typical combination", "Mathematics 1 加两个其他模块；以课程规定为准", "Mathematics 1 plus two other modules, subject to course requirements"),
      fact("计分", "Marking", "每题答对得 1 分；答错不倒扣；模块成绩分别报告", "One mark per correct answer; no negative marking; module scores reported separately"),
      fact("允许工具", "Permitted aids", "不得使用计算器或词典", "No calculator or dictionary"),
    ],
    sections: [
      {
        id: "esat-structure-combinations",
        title: t("模块结构与 2027 课程组合", "Module structure and 2027 course combinations"),
        tables: [
          {
            columns: [t("模块", "Module"), t("知识构成", "Knowledge composition"), t("选考关系", "Selection rule")],
            rows: [
              row(["Mathematics 1", "Mathematics 1"], ["Appendix 1 中全部 M 编码内容", "All M-coded content in Appendix 1"], ["所有 ESAT 考生必考", "Compulsory for every ESAT candidate"]),
              row(["Biology", "Biology"], ["全部 B 编码内容，并假定全部 M 内容", "All B-coded content, with all M content assumed"], ["按申请课程要求，与另一个选考模块组合", "Taken according to course requirements, normally with one other optional module"]),
              row(["Chemistry", "Chemistry"], ["全部 C 编码内容，并假定全部 M 内容", "All C-coded content, with all M content assumed"], ["按申请课程要求，与另一个选考模块组合", "Taken according to course requirements, normally with one other optional module"]),
              row(["Physics", "Physics"], ["全部 P 编码内容，并假定全部 M 内容", "All P-coded content, with all M content assumed"], ["按申请课程要求，与另一个选考模块组合", "Taken according to course requirements, normally with one other optional module"]),
              row(["Mathematics 2", "Mathematics 2"], ["全部 M 编码内容，加全部 MM 编码内容", "All M-coded content plus all MM-coded content"], ["按申请课程要求，与另一个选考模块组合", "Taken according to course requirements, normally with one other optional module"]),
            ],
            note: t(
              "各模块 40 分钟；提前完成某模块后，剩余时间不会转入下一模块。",
              "Each module is separately timed at 40 minutes; unused time cannot be carried into the next module.",
            ),
          },
          {
            title: t("UAT-UK 2027 入学课程表中的主要组合", "Principal combinations in the UAT-UK 2027 entry course list"),
            columns: [t("组合", "Combination"), t("官方课程表中的用途", "Use in the official course list")],
            rows: [
              row(["Mathematics 1 + Mathematics 2 + Physics", "Mathematics 1 + Mathematics 2 + Physics"], ["Cambridge Engineering；Oxford 多数工程与 Physics；Imperial 多数工程与 Physics。", "Cambridge Engineering; most Oxford engineering and Physics courses; most Imperial engineering and Physics courses."]),
              row(["Mathematics 1 + Chemistry + Biology", "Mathematics 1 + Chemistry + Biology"], ["Imperial 的 Biochemistry、Biological Sciences、Biotechnology、Ecology and Environmental Biology、Microbiology 等。", "Imperial courses including Biochemistry, Biological Sciences, Biotechnology, Ecology and Environmental Biology, and Microbiology."]),
              row(["Mathematics 1 + Mathematics 2 + Chemistry", "Mathematics 1 + Mathematics 2 + Chemistry"], ["Imperial Chemical Engineering。", "Imperial Chemical Engineering."]),
              row(["Mathematics 1 + 任意两个其他模块", "Mathematics 1 + any two other modules"], ["Cambridge Chemical Engineering and Biotechnology、Natural Sciences、Veterinary Medicine；Oxford Biomedical Sciences；UCL Electronic and Electrical Engineering。", "Cambridge Chemical Engineering and Biotechnology, Natural Sciences and Veterinary Medicine; Oxford Biomedical Sciences; UCL Electronic and Electrical Engineering."]),
              row(["Mathematics 1 + Mathematics 2（仅两模块）", "Mathematics 1 + Mathematics 2 (two modules only)"], ["Imperial Design Engineering。", "Imperial Design Engineering."]),
            ],
            note: t(
              "若同时申请多个 ESAT 课程，必须满足其中所有强制模块；订位后不能直接增改模块，需取消后重新预约。课程要求以大学课程页和最新版 UAT-UK Course List 为准。",
              "Applicants to more than one ESAT course must satisfy every compulsory module requirement. Modules cannot simply be added or changed after booking; the appointment must be cancelled and rebooked. Course pages and the latest UAT-UK Course List control.",
            ),
          },
        ],
      },
      {
        id: "esat-mathematics-one",
        title: t("Mathematics 1：M1–M7", "Mathematics 1: M1–M7"),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["M1 单位", "M1 Units"], ["标准与复合单位；质量、长度、时间、面积、体积／容量、货币、速度、单价、密度、压强等在数值和代数情境中的换算。", "Standard and compound units; numerical and algebraic conversions involving mass, length, time, area, volume/capacity, money, speed, unit pricing, density and pressure."]),
              row(["M2 数", "M2 Number"], ["正负数、分数、小数与四则运算；质数、因数、倍数、HCF、LCM 与唯一分解；运算顺序和系统枚举；平方、立方、根与各类指数；标准式；循环小数、分数与百分比；根式、π 和精确计算；界、误差区间、舍入和估算。", "Signed numbers, fractions, decimals and arithmetic; primes, factors, multiples, HCF, LCM and unique factorisation; order of operations and systematic listing; powers, roots and indices; standard form; recurring decimals, fractions and percentages; exact work with surds and π; bounds, error intervals, rounding and estimation."]),
              row(["M3 比与比例", "M3 Ratio and proportion"], ["比例尺、地图、比与按比分配；换算、比较、缩放、混合与浓度；百分数和百分比变化；直接／反比例及其图像；相似图形的长度、面积和体积关系；增长、衰减、复利和迭代。", "Scale factors, maps, ratios and division in a ratio; conversion, comparison, scaling, mixtures and concentration; percentages and percentage change; direct/inverse proportion and their graphs; similarity relationships in length, area and volume; growth, decay, compound interest and iteration."]),
              row(["M4 代数", "M4 Algebra"], ["代数记号、代入、指数律；展开、因式分解、代数分式和公式变形；等式、恒等式与函数；直线、二次、三次、倒数、指数和三角函数图像；梯度与图下面积的情境解释；一次／二次方程、联立方程、不等式；数列与第 n 项。", "Algebraic notation, substitution and laws of indices; expansion, factorisation, algebraic fractions and rearranging formulae; equations, identities and functions; graphs of linear, quadratic, cubic, reciprocal, exponential and trigonometric functions; contextual gradients and areas; linear/quadratic and simultaneous equations, inequalities; sequences and nth terms."]),
              row(["M5 几何", "M5 Geometry"], ["角、多边形、四边形和三角形；全等与相似；变换；勾股定理；圆术语与圆定理；坐标几何；三维图形和视图；周长、面积、体积、表面积；弧和扇形；相似图形的面积／体积；直角三角形三角比；向量。", "Angles, polygons, quadrilaterals and triangles; congruence and similarity; transformations; Pythagoras; circle terminology and theorems; coordinate geometry; 3-D shapes and views; perimeter, area, volume and surface area; arcs and sectors; similarity in area/volume; right-triangle trigonometry; vectors."]),
              row(["M6 统计", "M6 Statistics"], ["表格、频数表、条形图、饼图、象形图、竖线图；分组与连续数据、直方图、频数多边形、累积频数、箱线图；均值、众数、中位数、极差；散点图、相关和最佳拟合线。", "Tables, frequency tables, bar charts, pie charts, pictograms and vertical line charts; grouped/continuous data, histograms, frequency polygons, cumulative frequency and box plots; mean, mode, median and range; scatter graphs, correlation and lines of best fit."]),
              row(["M7 概率", "M7 Probability"], ["实验与理论概率、样本量、随机性和公平性；完备事件组；表格、网格、Venn 图与树状图；组合试验样本空间；加法与乘法规则、独立性和条件概率。", "Experimental and theoretical probability, sample size, randomness and fairness; exhaustive events; tables, grids, Venn and tree diagrams; sample spaces for combined experiments; addition and multiplication rules, independence and conditional probability."]),
            ],
          },
        ],
      },
      {
        id: "esat-mathematics-two",
        title: t("Mathematics 2：MM1–MM8", "Mathematics 2: MM1–MM8"),
        intro: t(
          "Mathematics 2 同时假定 Mathematics 1 的全部 M1–M7 内容。",
          "Mathematics 2 also assumes all Mathematics 1 content in M1–M7.",
        ),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["MM1 代数与函数", "MM1 Algebra and functions"], ["有理指数律、根式与分母有理化；二次函数、判别式、配方和方程；一次—二次联立；一次／二次不等式；多项式运算、代数除法、因式与余式定理；函数作为一对一或多对一映射。", "Rational indices, surds and rationalisation; quadratics, discriminant, completing the square and equations; simultaneous linear–quadratic equations; linear/quadratic inequalities; polynomial operations, division, Factor and Remainder Theorems; functions as one-to-one or many-to-one mappings."]),
              row(["MM2 数列与级数", "MM2 Sequences and series"], ["显式第 n 项与简单递推；等差级数；有限等比级数和收敛无穷等比级数；正整数二项式展开、n! 与二项式系数。", "Nth-term and simple recurrence sequences; arithmetic series; finite and convergent infinite geometric series; positive-integer binomial expansion, n! and binomial coefficients."]),
              row(["MM3 平面解析几何", "MM3 Coordinate geometry"], ["直线方程、平行与垂直；圆的标准式和一般式；规定的弦、半径、切线、圆心角／圆周角、半圆、同弧角、圆内接四边形与弦切角性质。", "Straight-line equations, parallelism and perpendicularity; standard and general circle equations; specified properties of chords, radii, tangents, central/inscribed angles, semicircles, equal angles in a segment, cyclic quadrilaterals and alternate segments."]),
              row(["MM4 三角学", "MM4 Trigonometry"], ["正弦／余弦定理、三角形面积与歧义情形；二维／三维问题；弧度、弧长、扇形／弓形面积；标准角精确值；三角函数图像、对称与周期；两条基本恒等式；给定区间内方程。", "Sine/cosine rules, triangle area and the ambiguous case; 2-D/3-D problems; radians, arc length and sector/segment area; exact standard-angle values; trigonometric graphs, symmetry and periodicity; two basic identities; equations on stated intervals."]),
              row(["MM5 指数与对数", "MM5 Exponentials and logarithms"], ["y=aˣ 及图像；对数定义与运算律；可化为 aˣ=b 的方程；不要求换底公式。", "The function y = aˣ and its graph; logarithm definition and laws; equations reducible to aˣ = b; no change-of-base formula required."]),
              row(["MM6 微分", "MM6 Differentiation"], ["导数作为斜率／变化率；二阶导数；有理指数幂函数求导；切线、法线、极大／极小驻点和单调性；不考第一性原理或拐点。", "Derivative as gradient/rate of change; second derivatives; differentiation of rational powers; tangents, normals, maxima/minima and monotonicity; first principles and points of inflexion excluded."]),
              row(["MM7 积分", "MM7 Integration"], ["定积分与几何面积；有理指数 n≠−1 幂函数积分；微积分基本定理；区间积分组合；梯形法及高估／低估；dy/dx=f(x) 型微分方程。", "Definite integrals and geometric area; integration of rational powers n ≠ −1; Fundamental Theorem of Calculus; combining intervals; trapezium rule and over-/underestimation; differential equations dy/dx = f(x)."]),
              row(["MM8 函数图像", "MM8 Graphs of functions"], ["常见函数草图；af(x)、f(x)+a、f(x+a)、f(ax) 及复合；直线和二次参数；用微分判断形状；交轴点、实根和联立方程的图像解释。", "Sketching common functions; transformations af(x), f(x)+a, f(x+a), f(ax) and compositions; line and quadratic parameters; using differentiation for shape; intercepts, real roots and graphical interpretation of simultaneous equations."]),
            ],
          },
        ],
      },
      {
        id: "esat-biology",
        title: t("Biology：B1–B11", "Biology: B1–B11"),
        intro: t("本模块同时假定 Mathematics 1 全部内容。", "This module also assumes all Mathematics 1 content."),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["B1 细胞", "B1 Cells"], ["动植物真核细胞主要亚细胞结构与功能；原核细胞结构；细胞—组织—器官—器官系统的层级。", "Main sub-cellular structures and functions in animal and plant eukaryotic cells; prokaryotic cell structure; levels from cells to tissues, organs and organ systems."]),
              row(["B2 跨膜运输", "B2 Movement across membranes"], ["扩散、以水势表述的渗透、主动运输，以及生命与非生命系统中的实例。", "Diffusion, osmosis in terms of water potential, active transport, and examples in living and non-living systems."]),
              row(["B3 细胞分裂与性别决定", "B3 Cell division and sex determination"], ["有丝分裂、细胞周期及生长／修复／替换／无性生殖；癌症与失控分裂；减数分裂、单倍体配子和受精；有性／无性生殖；哺乳动物 XX／XY 与遗传图解。", "Mitosis, the cell cycle and roles in growth/repair/replacement/asexual reproduction; cancer and uncontrolled division; meiosis, haploid gametes and fertilisation; sexual/asexual reproduction; mammalian XX/XY determination and genetic diagrams."]),
              row(["B4 遗传", "B4 Inheritance"], ["基因、等位基因、显／隐性、杂合／纯合、表型／基因型、染色体和常染色体；单基因杂交、家系图、遗传病；多数表型受多基因影响。", "Genes, alleles, dominance/recessiveness, heterozygosity/homozygosity, phenotype/genotype, chromosomes and autosomes; monohybrid crosses, pedigrees and inherited conditions; recognition that most phenotypes are polygenic."]),
              row(["B5 DNA", "B5 DNA"], ["基因组与染色体；单链／双链 DNA、核苷酸和互补碱基；三联体遗传密码；氨基酸、多肽、蛋白质结构与合成；基因突变及表型效应。", "Genome and chromosomes; single-/double-stranded DNA, nucleotides and complementary bases; triplet genetic code; amino acids, polypeptides, protein structure and synthesis; gene mutations and phenotypic effects."]),
              row(["B6 基因技术", "B6 Gene technologies"], ["基因工程、限制酶和连接酶、医学应用风险／收益；全能、 pluripotent 与 multipotent 干细胞及医学应用；自然选择与选择育种的比较及种群影响。", "Genetic engineering, restriction enzymes and ligases, and medical risks/benefits; totipotent, pluripotent and multipotent stem cells and medical applications; comparison of natural selection and selective breeding and population effects."]),
              row(["B7 变异", "B7 Variation"], ["遗传变异；自然选择与进化、物种形成和抗生素耐药；遗传与环境变异来源。", "Genetic variation; natural selection and evolution, speciation and antibiotic resistance; genetic and environmental sources of variation."]),
              row(["B8 酶", "B8 Enzymes"], ["酶作为生物催化剂；活性位点和专一性；温度与 pH 的影响；淀粉酶、蛋白酶和脂肪酶在消化中的作用。", "Enzymes as biological catalysts; active sites and specificity; effects of temperature and pH; digestive roles of amylases, proteases and lipases."]),
              row(["B9 动物生理", "B9 Animal physiology"], ["有氧／无氧细胞呼吸；神经、呼吸、循环、消化、排泄系统；内稳态与负反馈、血糖、水分和体温；激素与生殖；传染病、非传染病、免疫、药物／疫苗研发和治疗。", "Aerobic/anaerobic cellular respiration; nervous, respiratory, circulatory, digestive and excretory systems; homeostasis and negative feedback, blood glucose, water and temperature; hormones and reproduction; communicable/non-communicable disease, immunity, drug/vaccine development and treatment."]),
              row(["B10 生态系统", "B10 Ecosystems"], ["个体—种群—群落—生态系统；生物／非生物因素、种群变化、相互依存和竞争；碳循环和水循环；样方／样带；人类活动与生物多样性。", "Organisation from individual to population, community and ecosystem; biotic/abiotic factors, population change, interdependence and competition; carbon and water cycles; quadrats/transects; human impacts and biodiversity."]),
              row(["B11 植物生理", "B11 Plant physiology"], ["光合作用及温度、光强、二氧化碳限制因素；木质部、韧皮部、根毛细胞、蒸腾、转运和气孔；环境因素对吸水速率的影响及蒸腾速率计算。", "Photosynthesis and limiting effects of temperature, light and carbon dioxide; xylem, phloem, root hair cells, transpiration, translocation and stomata; environmental effects on water uptake and calculation of transpiration rate."]),
            ],
          },
        ],
      },
      {
        id: "esat-chemistry",
        title: t("Chemistry：C1–C17", "Chemistry: C1–C17"),
        intro: t("本模块同时假定 Mathematics 1 全部内容。", "This module also assumes all Mathematics 1 content."),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["C1 原子结构", "C1 Atomic structure"], ["质子、中子、电子、核外电子层；相对质量／电荷；原子序数、质量数与核素记号；前 20 号元素电子排布；同位素、质谱数据和相对原子质量。", "Protons, neutrons, electrons and shells; relative masses/charges; atomic and mass numbers and nuclide notation; electron configurations of the first 20 elements; isotopes, mass-spectrometry data and relative atomic mass."]),
              row(["C2 周期表", "C2 The Periodic Table"], ["IUPAC 1–18 族；周期与族；金属／非金属位置；原子序数排列；位置、电子排布、同族性质和反应性趋势。", "IUPAC Groups 1–18; periods and groups; positions of metals/non-metals; ordering by atomic number; position, electron configuration, group properties and reactivity trends."]),
              row(["C3 化学反应、化学式与方程", "C3 Reactions, formulae and equations"], ["原子／电子重排；常见离子和共价化合物化学式；状态符号；配平分子、离子与半反应方程；可逆反应、封闭体系平衡及浓度、温度、总压强的影响。", "Atomic/electronic rearrangement; formulae of common ionic and covalent compounds; state symbols; balancing molecular, ionic and half equations; reversible reactions, closed-system equilibrium and effects of concentration, temperature and total pressure."]),
              row(["C4 定量化学", "C4 Quantitative chemistry"], ["Ar、Mr、阿伏伽德罗常数和物质的量；质量百分组成；经验式／分子式；化学计量、限量试剂、气体体积；溶液浓度与溶解度；滴定；百分产率。", "Ar, Mr, Avogadro's number and amount of substance; percentage composition; empirical/molecular formulae; stoichiometry, limiting reagents and gas volumes; solution concentration and solubility; titration; percentage yield."]),
              row(["C5 氧化还原", "C5 Oxidation, reduction and redox"], ["得失氧与得失电子；氧化态；氧化、还原、氧化还原和非氧化还原反应辨认；歧化；氧化剂／还原剂。", "Gain/loss of oxygen and electrons; oxidation states; identification of oxidation, reduction, redox and non-redox reactions; disproportionation; oxidising/reducing agents."]),
              row(["C6 化学键、结构与性质", "C6 Bonding, structure and properties"], ["元素、化合物和混合物；离子键、共价键、金属键；离子电荷和化学式；小分子与巨型共价结构；分子间作用力；由结构和键解释熔点、导电性等性质。", "Elements, compounds and mixtures; ionic, covalent and metallic bonding; ionic charges and formulae; small molecules and giant covalent structures; intermolecular forces; explaining melting point, conductivity and other properties from structure and bonding."]),
              row(["C7 族化学", "C7 Group chemistry"], ["碱金属、卤素、稀有气体的物理／化学性质；第 1 族和第 17 族趋势与预测；卤素—卤离子置换。", "Physical/chemical properties of alkali metals, halogens and noble gases; trends and predictions in Groups 1 and 17; halogen–halide displacement."]),
              row(["C8 分离技术", "C8 Separation techniques"], ["混合物的物理分离；简单／分馏蒸馏、纸色谱和 Rf、分液漏斗、离心、溶解、过滤、蒸发、结晶；色谱判断纯度。", "Physical separation of mixtures; simple/fractional distillation, paper chromatography and Rf, separating funnels, centrifugation, dissolving, filtration, evaporation and crystallisation; purity from chromatography."]),
              row(["C9 酸、碱与盐", "C9 Acids, bases and salts"], ["酸作为形成 H⁺ 或给出 H⁺ 的物质；与金属、碳酸盐、氢氧化物和氧化物的反应；强弱与浓稀；pH 与 H⁺ 浓度；多元酸；碱作为形成 OH⁻ 或接受 H⁺ 的物质；中和。", "Acids as H⁺ producers/donors and their reactions with metals, carbonates, hydroxides and oxides; strength versus concentration; pH and H⁺ concentration; polyprotic acids; bases as OH⁻ producers/H⁺ acceptors; neutralisation."]),
              row(["C10 反应速率", "C10 Rates of reaction"], ["浓度、温度、粒径、催化剂和气体压强；速率测量与图像；碰撞理论、活化能；催化剂的能量路径及其不改变平衡位置。", "Effects of concentration, temperature, particle size, catalysts and gas pressure; rate measurements and graphs; collision theory and activation energy; catalytic pathways and the fact that catalysts do not change equilibrium position."]),
              row(["C11 能量学", "C11 Energetics"], ["放热／吸热与 ΔH 符号；可逆反应方向；能级图；量热与比热容；键断裂／形成和键能计算。", "Exothermic/endothermic reactions and the sign of ΔH; reverse directions; energy-level diagrams; calorimetry and specific heat capacity; bond breaking/formation and bond-energy calculations."]),
              row(["C12 电解", "C12 Electrolysis"], ["电极、阴极、阳极、电解质和直流电；阴极还原与阳极氧化；水溶液与熔融二元化合物的产物；半反应方程；电镀。", "Electrodes, cathode, anode, electrolyte and direct current; cathodic reduction and anodic oxidation; products from aqueous solutions and molten binary compounds; half equations; electroplating."]),
              row(["C13 碳／有机化学", "C13 Carbon/Organic chemistry"], ["原油分馏、链长与性质、裂化、结构异构、分子式／结构式、燃烧、IUPAC 命名、同系物与官能团；烷烃、烯烃及加成；加聚／缩聚；醇；羧酸与酯化。", "Crude-oil fractionation, chain length and properties, cracking, structural isomerism, molecular/structural formulae, combustion, IUPAC naming, homologous series and functional groups; alkanes, alkenes and addition; addition/condensation polymers; alcohols; carboxylic acids and esterification."]),
              row(["C14 金属", "C14 Metals"], ["反应性与正离子形成、提取难易；置换与活动性次序；金属用途与性质、合金；金属氧化物矿和还原提取；过渡金属的多氧化态、有色化合物和催化。", "Reactivity and positive-ion formation, extraction difficulty; displacement and reactivity order; uses and properties of metals and alloys; oxide ores and reduction; transition-metal variable oxidation states, coloured compounds and catalysis."]),
              row(["C15 动力学／粒子理论", "C15 Kinetic/Particle theory"], ["固、液、气粒子的排列与运动；熔化、凝固、沸腾／蒸发、凝结时的变化；过程能量与键、结构和分子间作用力。", "Particle arrangement and movement in solids, liquids and gases; melting, freezing, boiling/evaporation and condensation; energy changes in relation to bonding, structure and intermolecular forces."]),
              row(["C16 化学检验", "C16 Chemical tests"], ["氢、氧、二氧化碳、氯气；碳酸根、卤离子、硫酸根；Al³⁺、Ca²⁺、Mg²⁺、Cu²⁺、Fe²⁺、Fe³⁺；Li、Na、K、Ca、Cu 火焰反应；无水硫酸铜检水。", "Tests for hydrogen, oxygen, carbon dioxide and chlorine; carbonate, halide and sulfate ions; Al³⁺, Ca²⁺, Mg²⁺, Cu²⁺, Fe²⁺ and Fe³⁺; flame tests for Li, Na, K, Ca and Cu; anhydrous copper(II) sulfate test for water."]),
              row(["C17 空气与水", "C17 Air and water"], ["干燥空气组成及分馏；CO₂、CH₄ 等温室气体来源／影响；CO、CO₂、SO₂、NOx 等污染物；饮用水处理中氯和氟离子的作用。", "Composition and fractional distillation of dry air; origins/effects of greenhouse gases including CO₂ and CH₄; pollutants including CO, CO₂, SO₂ and NOx; purposes of chlorine and fluoride ions in drinking-water treatment."]),
            ],
          },
        ],
      },
      {
        id: "esat-physics",
        title: t("Physics：P1–P7", "Physics: P1–P7"),
        intro: t("本模块同时假定 Mathematics 1 全部内容。", "This module also assumes all Mathematics 1 content."),
        tables: [
          {
            columns: [t("编码与章节", "Code and topic"), t("具体范围", "Specified scope")],
            rows: [
              row(["P1 电学", "P1 Electricity"], ["摩擦起电、电子转移、静电吸斥、接地及应用／危害；电路符号、交／直流、导体／绝缘体、电流、电压、电阻、V–I 图；热敏电阻、LDR、理想二极管；串并联规则；功率和电能。", "Charging by friction, electron transfer, electrostatic attraction/repulsion, earthing and applications/hazards; circuit symbols, AC/DC, conductors/insulators, current, voltage, resistance and V–I graphs; thermistors, LDRs and ideal diodes; series/parallel rules; power and electrical energy."]),
              row(["P2 磁学", "P2 Magnetism"], ["磁极、磁场、软／硬磁材料和感应磁化；电流磁效应、直导线与线圈／螺线管；电动机效应、左手定则、F=BIL 与直流电机；电磁感应和交流发电机；变压器、电压／匝数比、功率传输与损耗。", "Poles, fields, soft/hard magnetic materials and induced magnetism; magnetic effect of current around wires and coils/solenoids; motor effect, left-hand rule, F = BIL and DC motors; electromagnetic induction and AC generators; transformers, voltage/turns ratios, power transmission and losses."]),
              row(["P3 力学", "P3 Mechanics"], ["标量／矢量、位移／路程、速度／速率、加速度与运动图像；v²−u²=2as；力和受力图、合力；弹性、胡克定律和弹性势能；牛顿三定律；质量、重量、自由落体和终端速度；动量与守恒；功、能、功率和效率。", "Scalars/vectors, displacement/distance, velocity/speed, acceleration and motion graphs; v² − u² = 2as; forces, diagrams and resultants; elasticity, Hooke's law and elastic energy; Newton's laws; mass, weight, free fall and terminal velocity; momentum and conservation; work, energy, power and efficiency."]),
              row(["P4 热学", "P4 Thermal physics"], ["传导及其影响因素；流体密度变化与对流；红外热辐射的吸收／发射；热量、温度变化和比热容。", "Conduction and factors affecting it; density changes and convection in fluids; absorption/emission of infrared thermal radiation; energy transfer, temperature change and specific heat capacity."]),
              row(["P5 物质", "P5 Matter"], ["固、液、气性质及粒子模型；理想气体的压强、温度和 PV=常量；熔点、沸点、熔化／汽化潜热；密度及实验测定；压强和液体静压 hρg。", "Properties and particle models of solids, liquids and gases; ideal-gas pressure, temperature and PV = constant; melting/boiling points and latent heats; density and its experimental determination; pressure and hydrostatic pressure hρg."]),
              row(["P6 波", "P6 Waves"], ["能量传播、横波／纵波、振幅、波长、频率、周期和波速；反射、折射和多普勒效应；平面镜和折射光线图；声波、人耳范围与超声；电磁谱的性质、次序、用途和危害。", "Energy transfer, transverse/longitudinal waves, amplitude, wavelength, frequency, period and wave speed; reflection, refraction and the Doppler effect; plane-mirror and refraction ray diagrams; sound, hearing range and ultrasound; properties, order, applications and hazards of the electromagnetic spectrum."]),
              row(["P7 放射性", "P7 Radioactivity"], ["原子／核模型、原子序数、质量数、同位素、核素记号和电离；α、β、γ 衰变的随机性、性质与核方程；穿透／电离能力、场中偏转、背景辐射、用途与危害；半衰期图像和计算。", "Atomic/nuclear models, atomic and mass numbers, isotopes, nuclide notation and ionisation; random alpha, beta and gamma decay, properties and nuclear equations; penetration/ionisation, deflection in fields, background radiation, applications and hazards; half-life graphs and calculations."]),
            ],
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "ESAT 内容规范",
        "ESAT Content Specification",
        "UAT-UK",
        "UAT-UK",
        "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/03165424/ESAT_Content_Specification.pdf",
        "pdf",
        "适用于 2026 年 10 月与 2027 年 1 月",
        "For assessment in October 2026 and January 2027",
      ),
      syllabusSource(
        "ESAT 考试介绍、结构与模块规则",
        "ESAT overview, test format and module rules",
        "UAT-UK",
        "UAT-UK",
        "https://esat-tmua.ac.uk/about-the-tests/esat-test/",
        "webpage",
        "2027 入学周期",
        "2027 entry cycle",
      ),
      syllabusSource(
        "UAT-UK 2027 入学课程与模块清单",
        "UAT-UK Course List for 2027 Entry",
        "UAT-UK",
        "UAT-UK",
        "https://uat-wp.s3.eu-west-2.amazonaws.com/wp-content/uploads/2026/04/01172717/Course_List_2027_Entry_Final.pdf",
        "pdf",
        "2026 年 4 月更新",
        "Last updated April 2026",
        "组合表仅概括官方清单中的主要模式；逐课程要求见原表及大学课程页。",
        "The combination table summarises principal patterns only; consult the source and university course pages for course-level requirements.",
      ),
      syllabusSource(
        "UAT-UK 备考材料入口",
        "UAT-UK preparation materials",
        "UAT-UK",
        "UAT-UK",
        "https://esat-tmua.ac.uk/prepare/",
        "webpage",
        "2026–27 现行页面",
        "Current 2026–27 page",
      ),
    ],
    translationNote: t(
      "中文范围按 UAT-UK 现行英文 specification 的 M、MM、B、C、P 编码翻译并压缩。化学式、物理量和官方英文模块名保留；中文不是 UAT-UK 发布的官方译本。模块选择属于课程要求，发生差异时以最新版 UAT-UK Course List 和大学课程页为准；内容范围以英文 specification 为准。",
      "The Chinese scope is an editorial translation and condensation of the current UAT-UK M, MM, B, C and P specification codes. Formulae, quantities and official English module names are retained; this is not an official UAT-UK translation. Module selection is course-specific, so the latest UAT-UK Course List and university course pages control; the English specification controls content scope.",
    ),
    lastVerified: VERIFIED_AT,
  },
  {
    id: "syllabus-step-2026-onwards",
    slug: "step-2026-onwards",
    projectId: "step",
    classification: "formal-specification",
    title: t("STEP 2／3 现行考纲（2026 起）", "Current STEP 2/3 Specification (2026 onwards)"),
    officialName: t(
      "第六学期考试试卷数学（STEP Mathematics）",
      "Sixth Term Examination Paper Mathematics (STEP Mathematics)",
    ),
    applicableCycle: t(
      "自 2026 年 6 月起的 STEP 2 与 STEP 3；截至 2026 年 8 月为 2027 入学周期现行考纲",
      "STEP 2 and STEP 3 examinations from June 2026 onwards; current for the 2027 entry cycle as of August 2026",
    ),
    effectiveFrom: "2026-06",
    status: "confirmed",
    summary: t(
      "现行 STEP specification 采用累积结构：STEP 2 假定完整 Mathematics 1 内容，再增加 STEP Mathematics 2 内容；STEP 3 又假定 Mathematics 1 与 STEP 2 全部内容，再增加 STEP Mathematics 3 内容。两卷均为 3 小时、12 题，分纯数学、力学、概率／统计三部分，最终取六道得分最高的答案。",
      "The current STEP specification is cumulative. STEP 2 assumes all Mathematics 1 content and adds the STEP Mathematics 2 specification; STEP 3 assumes all Mathematics 1 and STEP 2 content and adds the STEP Mathematics 3 specification. Each three-hour paper has 12 questions across Pure Mathematics, Mechanics and Probability/Statistics, with the best six answers determining the final mark.",
    ),
    facts: [
      fact("现行版本", "Current version", "OCR Version 1.3；自 2026 年 6 月起", "OCR Version 1.3; examinations from June 2026 onwards"),
      fact("STEP 2 内容依据", "STEP 2 content basis", "Mathematics 1 全部内容 + STEP Mathematics 2 specification", "All Mathematics 1 content plus the STEP Mathematics 2 specification"),
      fact("STEP 3 内容依据", "STEP 3 content basis", "Mathematics 1 + STEP Mathematics 2 + STEP Mathematics 3 全部内容", "All Mathematics 1, STEP Mathematics 2 and STEP Mathematics 3 content"),
      fact("每卷结构", "Paper structure", "3 小时；纯数学 8 题、力学 2 题、概率／统计 2 题", "Three hours; eight Pure, two Mechanics and two Probability/Statistics questions"),
      fact("计分", "Marking", "每题 20 分；取六道最高得分答案；选题部分不限", "20 marks per question; best six answers count; no sectional restriction on choice"),
      fact("允许工具", "Permitted aids", "无公式表；不得使用双语词典", "No formula booklet; bilingual dictionaries are prohibited"),
    ],
    sections: [
      {
        id: "step-structure-hierarchy",
        title: t("试卷结构与累积考纲", "Paper structure and cumulative specification"),
        tables: [
          {
            columns: [t("试卷", "Paper"), t("Section A", "Section A"), t("Section B", "Section B"), t("Section C", "Section C"), t("计分方式", "Scoring basis")],
            rows: [
              row(["STEP 2", "STEP 2"], ["纯数学 8 题", "8 Pure Mathematics questions"], ["力学 2 题", "2 Mechanics questions"], ["概率／统计 2 题", "2 Probability/Statistics questions"], ["每题 20 分；六道最高答案计入", "20 marks each; best six answers count"]),
              row(["STEP 3", "STEP 3"], ["纯数学 8 题", "8 Pure Mathematics questions"], ["力学 2 题", "2 Mechanics questions"], ["概率／统计 2 题", "2 Probability/Statistics questions"], ["每题 20 分；六道最高答案计入", "20 marks each; best six answers count"]),
            ],
            note: t(
              "考生可以尝试任意题目，六道计分答案不受分区数量限制。",
              "Candidates may attempt any questions; no restriction is placed on the sectional composition of the six counting answers.",
            ),
          },
          {
            title: t("知识层级", "Knowledge hierarchy"),
            columns: [t("层级", "Level"), t("纯数学依据", "Pure basis"), t("力学／概率统计依据", "Mechanics / Probability-Statistics basis")],
            rows: [
              row(["Mathematics 1（两卷共同假定）", "Mathematics 1 (assumed by both papers)"], ["A Level Mathematics 纯数学内容，经 specification 删改并增加指定主题。", "A Level Mathematics pure content, with specified removals, modifications and additions."], ["A Level Mathematics 的相应内容，经删改并增加指定主题；同时假定 Mathematics 1 纯数学。", "Corresponding A Level Mathematics content, with modifications and additions; Mathematics 1 Pure is also assumed."]),
              row(["STEP Mathematics 2", "STEP Mathematics 2"], ["规定的 AS Further Mathematics 纯数学内容，经删改并增加主题；假定 Mathematics 1 Pure。", "Prescribed AS Further Mathematics pure content, with modifications and additions; Mathematics 1 Pure assumed."], ["specification 列出的额外力学／概率统计主题；同时假定 Mathematics 1 相应应用内容及 STEP 2 Pure。", "Additional Mechanics/Probability-Statistics topics listed in the specification; corresponding Mathematics 1 applied content and STEP 2 Pure assumed."]),
              row(["STEP Mathematics 3", "STEP Mathematics 3"], ["规定的 A Level Further Mathematics 纯数学内容，经删改并增加主题；假定 Mathematics 1 与 STEP 2 Pure。", "Prescribed A Level Further Mathematics pure content, with modifications and additions; Mathematics 1 and STEP 2 Pure assumed."], ["specification 列出的额外主题；假定 Mathematics 1、STEP 2 的相应应用内容及全部前置纯数学。", "Additional listed topics; corresponding applied content from Mathematics 1 and STEP 2 and all preceding Pure content assumed."]),
            ],
          },
        ],
      },
      {
        id: "step-pure-mathematics",
        title: t("Section A：纯数学范围", "Section A: Pure Mathematics scope"),
        tables: [
          {
            title: t("Mathematics 1：STEP 2／3 共同基础", "Mathematics 1: common foundation for STEP 2 and STEP 3"),
            columns: [t("章节", "Topic"), t("规定范围", "Specified scope")],
            rows: [
              row(["证明", "Proof"], ["演绎、穷举、数学归纳、反例和反证；必要／充分与当且仅当。", "Deduction, exhaustion, induction, counterexample and contradiction; necessary/sufficient conditions and if and only if."]),
              row(["代数与函数", "Algebra and functions"], ["有理指数、根式、二次与联立方程、不等式、多项式、根与系数、代数分式、函数与图像、反函数／复合函数、图像变换、部分分式、简单极限和建模。", "Rational indices, surds, quadratics and simultaneous equations, inequalities, polynomials, roots and coefficients, rational expressions, functions and graphs, inverse/composite functions, transformations, partial fractions, simple limits and modelling."]),
              row(["平面解析几何", "Coordinate geometry"], ["直线、圆及规定圆定理；参数方程与直角坐标—参数形式转换；参数模型。", "Lines, circles and specified circle theorems; parametric equations and conversion between Cartesian and parametric forms; parametric modelling."]),
              row(["数列与级数", "Sequences and series"], ["正整数及任意有理指数的二项式展开与收敛范围；排列组合；显式／递推数列、单调与周期；Σ 记号；等差／等比级数；数列极限与建模。", "Positive-integer and general rational binomial expansions and convergence; permutations and combinations; explicit/recursive, monotone and periodic sequences; sigma notation; arithmetic/geometric series; limits and modelling."]),
              row(["三角学", "Trigonometry"], ["任意角三角函数、弧度、正弦／余弦定理；小角近似；反三角与 sec/cosec/cot；和差、倍角及 R 形式；一般解、恒等式证明与建模。", "Trigonometric functions for all arguments, radians, sine/cosine rules; small-angle approximations; inverse functions and sec/cosec/cot; compound/double-angle and R forms; general solutions, identity proofs and modelling."]),
              row(["指数与对数", "Exponentials and logarithms"], ["aˣ、eˣ、log 与 ln；对数律和换底；指数方程；对数图估参；增长／衰减模型及局限。", "aˣ, eˣ, logarithms and ln; laws and change of base; exponential equations; parameter estimation with logarithmic graphs; growth/decay models and limitations."]),
              row(["微分", "Differentiation"], ["连续／可微的非形式理解；第一性原理；高阶导数；幂、指数、对数、三角函数；乘积／商／链式法则；隐式／参数求导；极值、拐点、曲线草图、相关变化率和建模。", "Informal continuity/differentiability; first principles; higher derivatives; powers, exponentials, logarithms and trigonometric functions; product/quotient/chain rules; implicit/parametric differentiation; extrema, inflexions, sketching, related rates and modelling."]),
              row(["积分", "Integration"], ["微积分基本定理；包括 n=−1 的幂、指数和三角积分；定积分与面积；作为和的极限；换元、分部和部分分式；可分离变量一阶微分方程及情境解释。", "Fundamental Theorem; powers including n = −1, exponential and trigonometric integrals; definite integrals and areas; integration as a limit of sums; substitution, parts and partial fractions; separable first-order differential equations and contextual interpretation."]),
              row(["数值方法", "Numerical methods"], ["变号定位根及失败；迭代与蛛网／阶梯图；Newton–Raphson；梯形法、面积界与情境问题。", "Sign-change root location and failure; iteration with cobweb/staircase diagrams; Newton–Raphson; trapezium rule, area bounds and contextual problems."]),
              row(["向量", "Vectors"], ["二维／三维向量、模和方向、分量、位置向量、内分点；纯数学、力和运动学应用。", "2-D/3-D vectors, magnitude and direction, components, position vectors and section formulae; applications in pure mathematics, forces and kinematics."]),
            ],
          },
          {
            title: t("STEP 2：新增纯数学", "STEP 2: additional Pure Mathematics"),
            columns: [t("章节", "Topic"), t("规定范围", "Specified scope")],
            rows: [
              row(["复数", "Complex numbers"], ["实／复系数二次方程及在给定根信息下的三次／四次方程；x+iy 运算、共轭根；Argand 图；直角式与模辐角式转换、乘除和简单轨迹。", "Quadratics with real/complex coefficients and cubics/quartics given sufficient root information; x + iy arithmetic and conjugate roots; Argand diagrams; Cartesian/modulus-argument conversion, multiplication/division and simple loci."]),
              row(["矩阵", "Matrices"], ["矩阵运算、零矩阵／单位矩阵；二维线性变换与连续变换、限定的三维变换；不变点／线；2×2 行列式、方向与面积比例；奇异性和逆矩阵。", "Matrix operations, zero/identity matrices; 2-D linear and successive transformations and limited 3-D transformations; invariant points/lines; 2×2 determinants, orientation and scale factors; singularity and inverses."]),
              row(["进一步代数与函数", "Further algebra and functions"], ["最高四次及更高次多项式根与系数；根的线性变换；含 ax²+c 因子的部分分式及分子次数不低于分母；差分求和；eˣ 级数；椭圆／双曲线型曲线与渐近线。", "Roots and coefficients up to quartics and higher-degree polynomials; linear transformations of roots; partial fractions with ax²+c factors and improper rational functions; summation by differences; the eˣ series; ellipse/hyperbola forms and asymptotes."]),
              row(["进一步微积分", "Further calculus"], ["反三角函数求导；无穷区间或瑕点广义积分；(1+x²)⁻¹、(1−x²)⁻¹ᐟ² 及相关三角换元积分；含二次因子的部分分式积分；递推积分。", "Differentiation of inverse trigonometric functions; improper integrals over infinite ranges or singularities; integrals involving (1+x²)⁻¹ and (1−x²)⁻¹ᐟ² and related trigonometric substitutions; partial fractions with quadratics; reduction formulae."]),
              row(["进一步向量", "Further vectors"], ["三维直线的向量式和直角坐标式；数量积的几何意义和代数运算。", "Vector and Cartesian equations of lines in 3-D; geometric interpretation and algebra of the scalar product."]),
            ],
          },
          {
            title: t("STEP 3：在全部前置内容上新增的纯数学", "STEP 3: additional Pure Mathematics beyond all prerequisites"),
            columns: [t("章节", "Topic"), t("规定范围", "Specified scope")],
            rows: [
              row(["进一步复数", "Further complex numbers"], ["De Moivre 定理、倍角与级数；eⁱᶿ 定义；n 次根及 Argand 图正 n 边形；单位根和复数几何应用。", "de Moivre's theorem, multiple-angle formulae and series; definition of eⁱᶿ; nth roots and regular polygons in the Argand diagram; roots of unity and geometric applications."]),
              row(["进一步矩阵", "Further matrices"], ["3×3 行列式、方向与体积比例；3×3 逆矩阵；用逆矩阵解三元一次方程组及解／无解的几何解释。", "3×3 determinants, orientation and scale factors; 3×3 inverses; solving three simultaneous linear equations and geometric interpretation of solutions/failure."]),
              row(["进一步代数与函数", "Further algebra and functions"], ["求函数 Maclaurin 级数及一般项；eˣ、ln(1+x)、sin x、cos x、(1+x)ⁿ 的 Maclaurin 级数和有效范围。", "Deriving Maclaurin series and general terms; standard series for eˣ, ln(1+x), sin x, cos x and (1+x)ⁿ and their ranges of validity."]),
              row(["进一步微积分", "Further calculus"], ["直角坐标或参数曲线弧长；旋转体体积公式与计算；函数平均值。", "Arc length in Cartesian or parametric form; derivation and calculation of volumes of revolution; mean value of a function."]),
              row(["进一步向量", "Further vectors"], ["平面的向量式／直角坐标式；线面、面面夹角及交点；点、线、面之间的垂距；向量积、面积和平行性；(r−a)×b=0 直线形式。", "Vector/Cartesian plane equations; line-plane and plane-plane angles and intersections; perpendicular distances involving points, lines and planes; vector products, area and parallelism; line equation (r−a)×b = 0."]),
              row(["极坐标", "Polar coordinates"], ["极坐标与直角坐标转换；r=f(θ) 曲线草图；极坐标曲线围成面积。", "Conversion between polar and Cartesian coordinates; sketching r = f(θ); areas enclosed by polar curves."]),
              row(["双曲函数", "Hyperbolic functions"], ["六种双曲函数及图像、恒等式；微分与积分；反双曲函数、定义域／值域与对数形式；相关换元积分。", "Six hyperbolic functions and graphs/identities; differentiation and integration; inverse hyperbolic functions, domains/ranges and logarithmic forms; related substitution integrals."]),
              row(["微分方程", "Differential equations"], ["一阶线性方程积分因子；通解／特解；二阶常系数齐次与非齐次方程；简谐运动、阻尼振动；两个一阶联立系统和捕食—被捕食模型；给定换元。", "Integrating factors for first-order linear equations; general/particular solutions; second-order constant-coefficient homogeneous and non-homogeneous equations; SHM and damped oscillations; coupled first-order systems and predator–prey models; given substitutions."]),
            ],
          },
        ],
      },
      {
        id: "step-mechanics",
        title: t("Section B：力学范围", "Section B: Mechanics scope"),
        tables: [
          {
            columns: [t("层级", "Level"), t("章节", "Topics"), t("规定范围", "Specified scope")],
            rows: [
              row(["Mathematics 1 基础", "Mathematics 1 foundation"], ["量与单位；运动学；力与牛顿定律；力矩", "Quantities and units; kinematics; forces and Newton's laws; moments"], ["SI 基本／导出量；直线和二维运动、图像、微积分、匀加速和抛体；牛顿三定律、分解力、滑轮／连体、平衡、摩擦；刚体静力、接触、倾覆／滑动与对称可得的质心。", "SI base/derived quantities; linear and 2-D motion, graphs, calculus, constant acceleration and projectiles; Newton's laws, resolving forces, pulleys/connected particles, equilibrium and friction; rigid-body statics, contact, toppling/slipping and centres of mass deducible by symmetry."]),
              row(["STEP 2 新增", "STEP 2 additions"], ["能量、功与功率；碰撞；胡克定律", "Energy, work and power; collisions; Hooke's law"], ["动能／势能、功、功率和能量守恒；一维简单碰撞、动量守恒、适用时的能量守恒、恢复系数及连续碰撞（不要求斜碰）；弦／弹簧 T=kx=λx/l 与弹性势能。", "Kinetic/potential energy, work, power and conservation; simple one-dimensional collisions, momentum and where appropriate energy conservation, coefficient of restitution and successive impacts (no oblique impacts); strings/springs with T = kx = λx/l and elastic potential energy."]),
              row(["STEP 3 新增", "STEP 3 additions"], ["进一步碰撞；质心；圆周运动；微分方程", "Further collisions; centre of mass; circular motion; differential equations"], ["冲量、斜碰、恢复系数和连续碰撞；粒子系／复合刚体及用积分求均匀薄片或旋转体质心；匀速与变速圆周运动、竖直圆周（不考转动惯量）；变力运动模型、a=v·dv/dx、简谐运动和单摆近似。", "Impulse, oblique impacts, restitution and successive impacts; centres of mass of particle systems/composite bodies and integration for uniform laminas or solids of revolution; constant-/variable-speed circular motion and vertical circles (no moments of inertia); variable-force models, a = v·dv/dx, SHM and approximate pendulum motion."]),
            ],
          },
        ],
      },
      {
        id: "step-probability-statistics",
        title: t("Section C：概率与统计范围", "Section C: Probability and Statistics scope"),
        tables: [
          {
            columns: [t("层级", "Level"), t("章节", "Topics"), t("规定范围", "Specified scope")],
            rows: [
              row(["Mathematics 1 基础", "Mathematics 1 foundation"], ["抽样；数据呈现；概率；分布；假设检验", "Sampling; data presentation; probability; distributions; hypothesis testing"], ["总体、样本和随机样本；单变量图表、直方图、集中趋势、标准差；互斥／独立／互补事件、条件概率、Venn／树状图／列联表、组合计数；离散随机变量、二项／离散均匀／正态分布；二项比例及已知／给定／假定方差的正态总体均值检验。", "Populations, samples and random samples; univariate displays, histograms, central tendency and standard deviation; mutually exclusive/independent/complementary events, conditional probability, Venn/tree/two-way tables and combinatorics; discrete random variables, Binomial, discrete uniform and Normal distributions; tests for a Binomial proportion and for a Normal mean with known/given/assumed variance."]),
              row(["STEP 2 新增", "STEP 2 additions"], ["概率分布", "Probability distributions"], ["Poisson 分布、均值／方差；选择模型；Poisson 近似 Binomial，Normal 近似 Binomial／Poisson 及适用条件；连续均匀分布；连续密度函数与累积分布函数；用显式积分求概率、均值、方差、中位数、众数和期望。", "Poisson distribution and its mean/variance; model selection; Poisson approximation to Binomial and Normal approximations to Binomial/Poisson with conditions; continuous uniform distribution; continuous PDFs and CDFs; explicit integration for probabilities, mean, variance, median, mode and expectation."]),
              row(["STEP 3 新增", "STEP 3 additions"], ["独立随机变量；期望代数", "Independent random variables; algebra of expectation"], ["独立随机变量；E(aX+bY+c)、Var(X)=E(X²)−E(X)²、Var(aX+b) 及独立变量线性组合方差；由 CDF 求变换后随机变量密度；用 E[g(X)]=∫g(x)f(x)dx。明确不要求生成函数。", "Independent random variables; E(aX+bY+c), Var(X)=E(X²)−E(X)², Var(aX+b) and variances of linear combinations of independent variables; obtaining transformed densities from CDFs; E[g(X)] = ∫g(x)f(x)dx. Generating functions are explicitly excluded."]),
            ],
          },
        ],
      },
      {
        id: "step-specification-boundaries",
        title: t("考纲边界、公式与命题说明", "Specification boundaries, formulae and setting rules"),
        tables: [
          {
            columns: [t("项目", "Item"), t("OCR 规定", "OCR requirement")],
            rows: [
              row(["跨章节命题", "Cross-topic questions"], ["一道题常同时要求多个 specification 主题；也可在陌生方式下应用知识。", "A question will often draw on several specification topics and may require knowledge to be applied in unfamiliar ways."]),
              row(["未显式列出的内容", "Content not explicitly listed"], ["多数题来自所列主题；如题目延伸或使用未明列领域，会在题目中提供适当引导。", "Most questions use listed topics; where a question extends them or uses an unlisted area, appropriate guidance will be provided in the question."]),
              row(["GCSE 前置知识", "GCSE prerequisite knowledge"], ["可能要求 Higher Tier GCSE Mathematics 知识。", "Higher Tier GCSE Mathematics knowledge may be required."]),
              row(["公式", "Formulae"], ["考试不提供公式表；必须记忆 specification 的 Required Formulae。若某题需要其他公式，题目会给出或要求推导。", "No formula booklet is provided. Required Formulae in the specification must be known; other needed formulae will be supplied or candidates will be asked to derive them."]),
              row(["作答表达", "Presentation of solutions"], ["解答须清楚、合乎逻辑、字迹可辨并完整写出过程；使用标准记号并化简最终答案。", "Solutions must be clear, logical, legible and fully set out, using standard notation and simplified final answers."]),
              row(["覆盖频率", "Coverage frequency"], ["命题会覆盖较广主题，但不保证每年考到每一项。", "Papers aim for broad coverage, but every topic is not guaranteed to appear each year."]),
            ],
          },
        ],
      },
    ],
    sources: [
      syllabusSource(
        "STEP Mathematics Specification 2026 onwards",
        "STEP Mathematics Specification 2026 onwards",
        "OCR（Cambridge University Press & Assessment）",
        "OCR (Cambridge University Press & Assessment)",
        "https://www.ocr.org.uk/Images/696329-step-specification-2026.pdf",
        "pdf",
        "Version 1.3；2026 年 6 月起",
        "Version 1.3; examinations from June 2026 onwards",
      ),
      syllabusSource(
        "STEP 考试介绍",
        "STEP Mathematics overview",
        "OCR",
        "OCR",
        "https://www.ocr.org.uk/students/step-mathematics/",
        "webpage",
        "2026 起现行页面",
        "Current page for the June 2026 series onwards",
      ),
      syllabusSource(
        "STEP 计分与成绩",
        "STEP scoring and results",
        "OCR",
        "OCR",
        "https://www.ocr.org.uk/students/step-mathematics/scoring-and-results/",
        "webpage",
        "现行 STEP 2／3 结构",
        "Current STEP 2/3 structure",
      ),
      syllabusSource(
        "STEP Specification Support",
        "STEP Specification Support",
        "University of Cambridge Faculty of Mathematics",
        "University of Cambridge Faculty of Mathematics",
        "https://step.maths.org/specifications-and-specification-support",
        "webpage",
        "现行 specification 支持材料",
        "Support materials for the current specification",
        "该页说明 Mathematics 1 为两卷共同假定内容，STEP 3 再假定 STEP 2 内容。",
        "This page confirms that Mathematics 1 is assumed for both papers and that STEP 3 also assumes STEP 2 content.",
      ),
    ],
    translationNote: t(
      "中文按 OCR Version 1.3 的累积层级翻译：Mathematics 1、STEP Mathematics 2、STEP Mathematics 3 是 specification 内的内容层，而不等同于现行可报考的三张试卷；目前只开设 STEP 2 与 STEP 3。加粗斜体在官方 PDF 中表示超出相应 DfE 必修内容的增补，本页以层级表归纳呈现。中文不是 OCR 或 Cambridge 发布的官方译本；公式、排除项和范围以英文 PDF 为准。",
      "The Chinese text follows the cumulative hierarchy in OCR Version 1.3. Mathematics 1, STEP Mathematics 2 and STEP Mathematics 3 are specification layers, not three currently available papers; only STEP 2 and STEP 3 are offered. Bold italics in the source PDF mark additions beyond the relevant compulsory DfE content; this page represents them through the hierarchy tables. This is not an official OCR or Cambridge translation; the English PDF controls formulae, exclusions and scope.",
    ),
    lastVerified: VERIFIED_AT,
  },
];
