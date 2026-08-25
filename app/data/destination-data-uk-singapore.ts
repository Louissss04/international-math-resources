import {
  t,
  type DestinationGuideRecord,
  type FactRecord,
  type InformationStatus,
  type SourceRecord,
  type TableRow,
} from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";

const source = (
  id: string,
  labelZh: string,
  labelEn: string,
  ownerZh: string,
  ownerEn: string,
  url: string,
  kind: SourceRecord["kind"],
  appliesTo: string,
  noteZh?: string,
  noteEn?: string,
): SourceRecord => ({
  id,
  label: t(labelZh, labelEn),
  owner: t(ownerZh, ownerEn),
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
  status,
  sourceIds,
});

const row = (
  cells: Array<[string, string]>,
  sourceIds: string[],
  status: InformationStatus = "confirmed",
): TableRow => ({
  cells: cells.map(([zh, en]) => t(zh, en)),
  sourceIds,
  status,
});

export const ukSingaporeDestinationSources: SourceRecord[] = [
  source(
    "uk-ucas-2027-dates",
    "UCAS 2027 入学申请日期",
    "UCAS 2027 entry application dates",
    "英国大学和学院招生服务中心",
    "UCAS",
    "https://www.ucas.com/applying/applying-to-university/dates-and-deadlines-for-uni-applications",
    "official",
    "英国本科申请；2027 入学",
  ),
  source(
    "uk-ucas-how-to-apply",
    "UCAS 本科申请说明",
    "UCAS undergraduate application instructions",
    "英国大学和学院招生服务中心",
    "UCAS",
    "https://www.ucas.com/faqs/how-do-i-apply",
    "official",
    "英国本科申请账户、材料与提交",
  ),
  source(
    "uk-ucas-admissions-tests",
    "UCAS 入学考试索引",
    "UCAS admissions-test index",
    "英国大学和学院招生服务中心",
    "UCAS",
    "https://www.ucas.com/applying/before-you-apply/what-and-where-to-study/entry-requirements/admissions-tests",
    "official",
    "英国本科入学考试与使用院校概览",
  ),
  source(
    "uk-uat-tmua-2027",
    "TMUA 官方说明与考试形式",
    "Official TMUA overview and format",
    "英国大学入学考试机构",
    "University Admissions Tests UK",
    "https://esat-tmua.ac.uk/about-the-tests/tmua-test/",
    "official",
    "2027 入学 TMUA",
  ),
  source(
    "uk-uat-esat-2027",
    "ESAT 官方说明与数学模块",
    "Official ESAT overview and mathematics modules",
    "英国大学入学考试机构",
    "University Admissions Tests UK",
    "https://esat-tmua.ac.uk/about-the-tests/esat-test/",
    "official",
    "2027 入学 ESAT；仅数学相关模块",
  ),
  source(
    "uk-uat-deadlines-2027",
    "UAT-UK 2027 入学关键日期",
    "UAT-UK key dates for 2027 entry",
    "英国大学入学考试机构",
    "University Admissions Tests UK",
    "https://esat-tmua.ac.uk/deadlines/",
    "official",
    "TMUA、ESAT；含中国大陆、香港和澳门专用考试日",
  ),
  source(
    "uk-uat-registration",
    "UAT-UK 注册与 Pearson VUE 预约",
    "UAT-UK registration and Pearson VUE booking",
    "英国大学入学考试机构",
    "University Admissions Tests UK",
    "https://esat-tmua.ac.uk/register/",
    "official",
    "TMUA、ESAT 的账户、预约和缴费流程",
  ),
  source(
    "uk-ocr-step-overview",
    "STEP Mathematics 官方说明",
    "Official STEP Mathematics overview",
    "OCR",
    "OCR",
    "https://www.ocr.org.uk/students/step-mathematics/",
    "official",
    "STEP 2、STEP 3 的用途与形式",
  ),
  source(
    "uk-ocr-step-key-dates-2026",
    "STEP 2026 日期与费用",
    "STEP 2026 dates and fees",
    "OCR",
    "OCR",
    "https://www.ocr.org.uk/administration/step-mathematics/key-dates-and-fees/",
    "official-archive",
    "最近完整公布的 STEP 行政周期；2027 日期待发布",
  ),
  source(
    "uk-ocr-step-registration-china",
    "STEP 注册与中国考点说明",
    "STEP registration and China test-centre instructions",
    "OCR",
    "OCR",
    "https://www.ocr.org.uk/students/step-mathematics/how-to-register/find-a-centre/",
    "official",
    "国际考生注册；中国考生须通过英国文化教育协会考点",
  ),
  source(
    "uk-ocr-step-results",
    "STEP 评分与成绩发送",
    "STEP scoring and result delivery",
    "OCR",
    "OCR",
    "https://www.ocr.org.uk/students/step-mathematics/scoring-and-results/",
    "official",
    "STEP 成绩查询及经 UCAS 向院校发送",
  ),
  source(
    "uk-cambridge-mathematics-2027",
    "剑桥大学数学本科申请要求",
    "University of Cambridge Mathematics application requirements",
    "剑桥大学数学学院",
    "University of Cambridge Faculty of Mathematics",
    "https://www.maths.cam.ac.uk/undergrad/admissions/how-to-apply",
    "official",
    "2027 入学数学；TMUA、STEP、A Level 与 IB 个案",
  ),
  source(
    "uk-cambridge-international-entry-2027",
    "剑桥大学国际资格与中国高考说明",
    "Cambridge international qualifications and China Gaokao guidance",
    "剑桥大学本科招生",
    "University of Cambridge Undergraduate Study",
    "https://www.undergraduate.study.cam.ac.uk/international-students/international-entry-requirements",
    "official",
    "2027 入学；中国及美国课程资格",
  ),
  source(
    "uk-cambridge-accepted-qualifications-2027",
    "剑桥大学认可资格说明",
    "Cambridge accepted qualifications guidance",
    "剑桥大学本科招生",
    "University of Cambridge Undergraduate Study",
    "https://www.undergraduate.study.cam.ac.uk/apply/before/accepted-qualifications",
    "official",
    "A Level、International A Level、IB 等资格",
  ),
  source(
    "uk-oxford-mathematics-course",
    "牛津大学数学本科课程要求",
    "University of Oxford Mathematics course requirements",
    "牛津大学",
    "University of Oxford",
    "https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/mathematics",
    "official",
    "数学本科的 A Level 与 IB 科目、分数要求",
  ),
  source(
    "uk-oxford-mathematics-2027",
    "牛津数学学院 2027 入学说明",
    "Oxford Mathematical Institute 2027 admissions prospectus",
    "牛津大学数学学院",
    "University of Oxford Mathematical Institute",
    "https://www.maths.ox.ac.uk/study-here/undergraduate-study/prospectus",
    "official",
    "2027 入学数学；UCAS 与 TMUA",
  ),
  source(
    "uk-oxford-admissions-tests-2027",
    "牛津大学 2027 入学考试说明",
    "University of Oxford admissions tests for 2027 entry",
    "牛津大学",
    "University of Oxford",
    "https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants/admissions-tests",
    "official",
    "2027 入学；TMUA 与 ESAT 的课程对应和日期",
  ),
  source(
    "uk-oxford-international-qualifications",
    "牛津大学国际资格清单",
    "University of Oxford international qualifications list",
    "牛津大学",
    "University of Oxford",
    "https://www.ox.ac.uk/admissions/undergraduate/courses/admissions-requirements/international-qualifications",
    "official",
    "中国高考、AP 等资格的认可状态",
  ),
  source(
    "uk-imperial-mathematics-2027",
    "帝国理工数学本科要求",
    "Imperial College London Mathematics BSc requirements",
    "帝国理工学院",
    "Imperial College London",
    "https://www.imperial.ac.uk/study/courses/undergraduate/mathematics-bsc/",
    "official",
    "2027 入学数学；A Level、IB、AP 与 TMUA",
  ),
  source(
    "uk-warwick-mathematics-offer-2027",
    "华威大学数学 2027 录取条件",
    "University of Warwick Mathematics 2027 offer conditions",
    "华威大学数学学院",
    "University of Warwick Mathematics Institute",
    "https://warwick.ac.uk/fac/sci/maths/studywithus/ug/our-offer/",
    "official",
    "2027 入学数学；TMUA 或 STEP 路径",
  ),
  source(
    "uk-warwick-admissions-tests-2027",
    "华威大学 TMUA 与 STEP 使用说明",
    "University of Warwick use of TMUA and STEP",
    "华威大学",
    "University of Warwick",
    "https://warwick.ac.uk/study/undergraduate/applying/admissions-tests/",
    "official-data",
    "数学、统计等课程的考试使用方式及历史 TMUA 参考",
  ),
  source(
    "sg-moe-autonomous-universities",
    "新加坡自治大学入口",
    "Singapore autonomous universities overview",
    "新加坡教育部",
    "Singapore Ministry of Education",
    "https://www.moe.gov.sg/post-secondary/overview/autonomous-universities",
    "official",
    "本科院校与各校招生入口",
  ),
  source(
    "sg-nus-international-qualifications-2026",
    "NUS 国际资格申请总览",
    "NUS international qualifications admissions overview",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners",
    "official",
    "AY2026/2027 国际申请资格、周期与材料核验",
  ),
  source(
    "sg-nus-gaokao-2026",
    "NUS 中国高考资格要求",
    "NUS PRC Gaokao qualification requirements",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/international-qualifications/gaokao-or-prc-national-college-entrance-examination",
    "official",
    "AY2026/2027 高考申请与成绩提交",
  ),
  source(
    "sg-nus-international-a-level-2026",
    "NUS International A Level 要求",
    "NUS International A Level requirements",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/admissions/international-qualifications-for-foreigners/international-qualifications/international-a-level",
    "official",
    "AY2026/2027 AQA、Cambridge、Edexcel 等 A Level 路径",
  ),
  source(
    "sg-nus-standardised-tests-2026",
    "NUS 国际申请标准化考试要求",
    "NUS standardised-test requirements for international applicants",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/docs/default-source/default-document-library/standardised_test.pdf?sfvrsn=7cbaf22d_8",
    "official",
    "2025 年 12 月更新；AP Calculus BC、SAT Mathematics 及成绩寄送",
  ),
  source(
    "sg-nus-mathematics-major",
    "NUS CHS 数学专业先修要求",
    "NUS CHS Mathematics subject prerequisites",
    "新加坡国立大学人文与理学院",
    "NUS College of Humanities and Sciences",
    "https://chs.nus.edu.sg/prospective-students/",
    "official",
    "现行 Mathematics 主修 H2 数学先修要求与 MA1301／MA1301X 衔接课程",
  ),
  source(
    "sg-nus-igp-ay2025",
    "NUS AY2025/2026 录取成绩区间",
    "NUS AY2025/2026 indicative grade profiles",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/admissions/indicative-grade-profile",
    "official-data",
    "仅为新加坡剑桥 GCE A Level／本地理工学院历史参考，不是国际申请分数线",
  ),
  source(
    "sg-nus-application-guide-2026",
    "NUS 国际资格申请指南",
    "NUS international qualifications application guide",
    "新加坡国立大学招生办公室",
    "NUS Office of Admissions",
    "https://www.nus.edu.sg/oam/docs/default-source/application-guide/international-qualifications-application-guide.pdf?sfvrsn=5baed25f_12",
    "official",
    "2025 年 12 月更新；专业选择与文件上传",
  ),
  {
    ...source(
      "sg-ntu-admission-guide-current",
      "NTU 本科申请总览（AY2027/28）",
      "NTU undergraduate admission guide (AY2027/28)",
      "南洋理工大学招生办公室",
      "NTU Office of Admissions",
      "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide",
      "official",
      "AY2027/2028 application groups and broad application windows",
    ),
    verifiedAt: "2026-08-25",
  },
  {
    ...source(
      "sg-ntu-international-qualifications-2026",
      "NTU 国际资格与申请周期",
      "NTU international qualifications and application periods",
      "南洋理工大学招生办公室",
      "NTU Office of Admissions",
      "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-qualifications",
      "official",
      "AY2026/2027 detailed qualification-specific dates and document rules",
      "该详细页仍显示 AY2026/27，与已切换至 AY2027/28 的本科申请总览尚未同步。",
      "This detailed page still shows AY2026/27 and has not yet caught up with the AY2027/28 undergraduate admission guide.",
    ),
    verifiedAt: "2026-08-25",
  },
  source(
    "sg-ntu-gaokao-2027",
    "NTU 中国高考申请要求",
    "NTU PRC Gaokao application requirements",
    "南洋理工大学招生办公室",
    "NTU Office of Admissions",
    "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-qualifications/prc-gaokao",
    "official",
    "含 AY2027 起高考实分和面试安排变化",
  ),
  source(
    "sg-ntu-mathematical-sciences",
    "NTU Mathematical Sciences 科目要求",
    "NTU Mathematical Sciences subject requirements",
    "南洋理工大学数理科学学院",
    "NTU School of Physical and Mathematical Sciences",
    "https://www.ntu.edu.sg/spms/about-us/mathematics/undergrad/admissions",
    "official",
    "A Level、IB、NUS High School 与其他国际资格的数学先修要求",
  ),
  source(
    "sg-ntu-ib-2026",
    "NTU IB Diploma 申请要求",
    "NTU IB Diploma admissions requirements",
    "南洋理工大学招生办公室",
    "NTU Office of Admissions",
    "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-baccalaureate-diploma",
    "official",
    "IB 成绩、数学课程认可与官方成绩发送",
  ),
  source(
    "sg-ntu-igp-ay2025",
    "NTU AY2025/2026 录取成绩区间",
    "NTU AY2025/2026 indicative grade profiles",
    "南洋理工大学招生办公室",
    "NTU Office of Admissions",
    "https://www.ntu.edu.sg/docs/default-source/undergraduate-admissions/igp/ntu_igp.pdf",
    "official-data",
    "仅为新加坡剑桥 GCE A Level 与本地理工学院历史参考，不是国际申请分数线",
  ),
  source(
    "sg-ntu-a-level-timing",
    "NTU International A Level 成绩时间说明",
    "NTU International A Level results-timing notice",
    "南洋理工大学招生办公室",
    "NTU Office of Admissions",
    "https://www.ntu.edu.sg/admissions/undergraduate/admission-guide/international-qualifications/announcements",
    "official",
    "五月／六月场 A Level、IAL 实分发布时间与申请资格",
  ),
];

const ukMathematicsAdmissionsGuide: DestinationGuideRecord = {
  id: "destination-uk-undergraduate-mathematics",
  slug: "uk-undergraduate-mathematics-admissions",
  title: t("英国本科数学及高数学含量专业申请", "UK Undergraduate Mathematics and Mathematics-Intensive Admissions"),
  shortTitle: t("英国数学本科", "UK Mathematics"),
  summary: t(
    "英国没有全国统一的本科数学分数线或统一数学入学考试。申请通常经 UCAS 提交，但资格认可、数学科目要求和 TMUA、ESAT、STEP 的使用均由具体大学及专业决定。",
    "The UK has no national undergraduate mathematics cutoff or universal mathematics admissions test. Applications are usually submitted through UCAS, while qualification recognition, mathematics subject requirements and use of TMUA, ESAT or STEP are set by each university and course.",
  ),
  facts: [
    fact(
      "主要申请系统",
      "Primary application system",
      "全日制本科通常通过 UCAS；一份申请最多填报五个专业选择。入学考试须另行注册。",
      "Full-time undergraduate applications normally go through UCAS, with up to five course choices; admissions tests require separate registration.",
      ["uk-ucas-how-to-apply", "uk-ucas-2027-dates", "uk-uat-registration"],
    ),
    fact(
      "当前参考周期",
      "Current reference cycle",
      "2027 入学；UCAS 从 2026 年 9 月 1 日接受提交。",
      "2027 entry; UCAS accepts completed applications from 1 September 2026.",
      ["uk-ucas-2027-dates"],
    ),
    fact(
      "数学资格口径",
      "Mathematics qualification rule",
      "没有全国统一换算表。A Level、IB、AP 和高考是否可用，以及需要哪一级数学，必须按大学和专业核对。",
      "There is no national conversion table. Whether A Levels, IB, AP or Gaokao are accepted, and which level of mathematics is required, must be checked course by course.",
      ["uk-cambridge-international-entry-2027", "uk-oxford-international-qualifications", "uk-imperial-mathematics-2027"],
    ),
    fact(
      "额外数学考试",
      "Additional mathematics tests",
      "TMUA、ESAT、STEP 均为专业或录取条件个案，不是所有英国数学相关专业的统一要求。",
      "TMUA, ESAT and STEP are course- or offer-specific, not universal requirements for all UK mathematics-related degrees.",
      ["uk-ucas-admissions-tests", "uk-uat-tmua-2027", "uk-uat-esat-2027", "uk-ocr-step-overview"],
    ),
    fact(
      "中国高考认可",
      "Recognition of China Gaokao",
      "院校差异明显：剑桥多数学院可考虑高考；牛津明确不接受高考和中国普通高中毕业证。",
      "Institutional policy differs sharply: most Cambridge Colleges may consider Gaokao, while Oxford explicitly does not accept Gaokao or the Chinese Senior High School Diploma.",
      ["uk-cambridge-international-entry-2027", "uk-oxford-international-qualifications"],
    ),
  ],
  sections: [
    {
      id: "uk-system-boundary",
      title: t("统一申请与院校要求", "Central Application and Course-Level Requirements"),
      paragraphs: [
        t(
          "UCAS 负责接收和转交申请，不为数学专业设统一录取线。大学在专业页面公布成绩、必修数学科目和入学考试；同一所大学的数学、统计、计算机、经济或工程专业也可能采用不同考试。",
          "UCAS receives and forwards applications but does not set a mathematics admissions cutoff. Universities publish grades, required mathematics subjects and tests on each course page; Mathematics, Statistics, Computer Science, Economics and Engineering at the same institution may use different tests.",
        ),
      ],
      tables: [
        {
          title: t("信息层级", "Levels of Authority"),
          columns: [
            t("层级", "Level"),
            t("负责内容", "What it governs"),
            t("核对入口", "Where to verify"),
          ],
          rows: [
            row(
              [
                ["UCAS", "UCAS"],
                ["申请账户、专业选择、材料提交和统一截止时间", "Application account, course choices, submission and common deadlines"],
                ["UCAS 日期页和申请说明", "UCAS dates and application instructions"],
              ],
              ["uk-ucas-2027-dates", "uk-ucas-how-to-apply"],
            ),
            row(
              [
                ["大学／专业", "University / course"],
                ["资格认可、数学科目、典型成绩、是否要求考试", "Accepted qualifications, mathematics subjects, typical grades and whether a test is required"],
                ["当年专业页及国际资格页", "Current course page and international-qualification page"],
              ],
              ["uk-cambridge-mathematics-2027", "uk-oxford-mathematics-2027", "uk-imperial-mathematics-2027", "uk-warwick-mathematics-offer-2027"],
            ),
            row(
              [
                ["考试机构", "Test provider"],
                ["考试形式、注册、考点、费用、日期和成绩发送", "Format, registration, centres, fees, dates and score delivery"],
                ["UAT-UK（TMUA／ESAT）或 OCR（STEP）", "UAT-UK for TMUA/ESAT or OCR for STEP"],
              ],
              ["uk-uat-registration", "uk-uat-deadlines-2027", "uk-ocr-step-overview"],
            ),
          ],
        },
      ],
    },
    {
      id: "uk-qualification-routes",
      title: t("高中数学资格与典型要求", "School Mathematics Qualifications and Typical Requirements"),
      intro: t(
        "下表用于识别申请路径，不表示资格之间存在固定等值关系。最终条件以申请年度的专业页面和录取通知为准。",
        "This table identifies application routes; it does not assert a fixed equivalence between qualifications. The current course page and individual offer remain authoritative.",
      ),
      tables: [
        {
          columns: [
            t("资格", "Qualification"),
            t("数学科目判断", "Mathematics subject treatment"),
            t("代表性分数要求", "Representative grade requirements"),
            t("适用说明", "Application note"),
          ],
          rows: [
            row(
              [
                ["A Level／International A Level", "A Level / International A Level"],
                ["数学专业通常要求 Mathematics；选择性较强的课程常要求或高度推荐 Further Mathematics。剑桥认可 Cambridge International、Oxford AQA、Pearson Edexcel IAL。", "Mathematics is normally required; highly selective courses commonly require or strongly recommend Further Mathematics. Cambridge accepts Cambridge International, Oxford AQA and Pearson Edexcel IAL."],
                ["剑桥数学 A*A*A；牛津数学 A*A*A；帝国理工数学最低 A*A*A 至 A*A*AA；华威数学 2027 典型为 A*A*A。", "Cambridge Mathematics A*A*A; Oxford Mathematics A*A*A; Imperial Mathematics minimum A*A*A to A*A*AA; Warwick Mathematics 2027 typically A*A*A."],
                ["Further Mathematics 不开设时的处理由院校决定；应由学校在申请中说明课程供给。", "Treatment where Further Mathematics is unavailable is institution-specific; the school should explain curriculum availability in the application."],
              ],
              ["uk-cambridge-accepted-qualifications-2027", "uk-cambridge-mathematics-2027", "uk-oxford-mathematics-course", "uk-imperial-mathematics-2027", "uk-warwick-mathematics-offer-2027"],
            ),
            row(
              [
                ["IB Diploma", "IB Diploma"],
                ["纯数学课程常指定 HL Mathematics；部分院校明确要求 Analysis and Approaches。", "Pure mathematics courses commonly specify HL Mathematics; some explicitly require Analysis and Approaches."],
                ["剑桥数学 40–42、HL 776，AA HL 7；牛津数学 39、HL 766，HL 数学 7；帝国理工数学 39、HL 数学 7；华威数学 39、HL 666，含 AA。", "Cambridge Mathematics 40–42 with HL 776 and 7 in AA HL; Oxford Mathematics 39 with HL 766 and 7 in HL Mathematics; Imperial Mathematics 39 with 7 in HL Mathematics; Warwick Mathematics 39 with HL 666 including AA."],
                ["IB AA／AI 的接受范围按专业核对，不能用一所大学的口径推定另一所。", "Acceptance of IB AA or AI must be checked by course and cannot be inferred across universities."],
              ],
              ["uk-cambridge-mathematics-2027", "uk-oxford-mathematics-course", "uk-imperial-mathematics-2027", "uk-warwick-mathematics-offer-2027"],
            ),
            row(
              [
                ["AP／美国课程", "AP / US curriculum"],
                ["高数学含量专业通常需要 AP Calculus BC；仅有美国高中毕业证通常不足以满足选择性大学要求。", "Mathematics-intensive courses normally require AP Calculus BC; a US High School Diploma alone is generally insufficient at selective universities."],
                ["剑桥通常要求至少 5 门 AP 5 分，并对数学专业优先 Calculus BC；配合 SAT 时，数学等理工课程最低总分 1500、Math 750。牛津 A*A*A 课程可用 4 门 AP 5 分，或 3 门 AP 5 分加 SAT 1480／ACT 33。", "Cambridge typically requires at least five AP scores of 5, preferring Calculus BC for Mathematics; with SAT, mathematics and other science courses require at least 1500 overall and 750 Math. Oxford A*A*A courses accept four AP scores of 5, or three AP scores of 5 plus SAT 1480 / ACT 33."],
                ["AP 科目须满足专业先修要求；牛津建议数学必修专业尽可能选 Calculus BC。", "AP subjects must satisfy course prerequisites; Oxford advises applicants to mathematics-required courses to take Calculus BC where available."],
              ],
              ["uk-cambridge-international-entry-2027", "uk-oxford-international-qualifications"],
            ),
            row(
              [
                ["中国高考／普通高中", "China Gaokao / Senior High School"],
                ["没有英国统一认可规则。", "There is no UK-wide recognition rule."],
                ["剑桥多数学院可考虑高考；部分组合情形通常还要求省内高考前 0.1%。牛津不接受高考或普通高中毕业证。", "Most Cambridge Colleges may consider Gaokao; certain qualification combinations normally also require a provincial top 0.1% Gaokao rank. Oxford does not accept Gaokao or the Senior High School Diploma."],
                ["申请前逐校确认；不可把 Cambridge 的认可结论外推到其他大学。", "Confirm with every institution before applying; Cambridge policy cannot be generalised to other universities."],
              ],
              ["uk-cambridge-international-entry-2027", "uk-oxford-international-qualifications"],
            ),
          ],
          note: t(
            "“典型”或“最低”要求只说明具备申请资格，不保证录取；实际 offer 可加入 STEP 或更高成绩条件。",
            "A typical or minimum requirement establishes eligibility, not admission; an offer may include STEP or higher grade conditions.",
          ),
        },
      ],
    },
    {
      id: "uk-mathematics-tests",
      title: t("数学入学考试", "Mathematics Admissions Tests"),
      tables: [
        {
          columns: [
            t("考试", "Test"),
            t("数学内容与形式", "Mathematics content and format"),
            t("成绩与用途", "Scoring and use"),
            t("注册方式", "Registration"),
          ],
          rows: [
            row(
              [
                ["TMUA", "TMUA"],
                ["2 小时 30 分；Paper 1 数学知识应用、Paper 2 数学推理；每卷 20 道选择题、75 分钟；不可使用计算器。", "2 hours 30 minutes; Paper 1 Applications of Mathematical Knowledge and Paper 2 Mathematical Reasoning; 20 multiple-choice questions and 75 minutes per paper; no calculator."],
                ["1–9 分并保留一位小数；无及格线。用于部分数学、计算机、经济等专业，具体为必考或选考由专业决定。", "Reported on a 1–9 scale to one decimal place, with no pass mark. Used by selected Mathematics, Computer Science, Economics and related courses; compulsory or optional status is course-specific."],
                ["自行创建 UAT-UK 账户，再经 Pearson 系统选择考点、日期并缴费；境外考点费用为 £133。", "Create a UAT-UK account, then select a Pearson centre and appointment and pay through the Pearson system; the overseas fee is £133."],
              ],
              ["uk-uat-tmua-2027", "uk-uat-registration", "uk-uat-deadlines-2027"],
            ),
            row(
              [
                ["ESAT（数学部分）", "ESAT mathematics modules"],
                ["Mathematics 1 为所有 ESAT 考生必考；Mathematics 2 是否参加由专业决定。每个模块 40 分钟、27 道选择题；不可使用计算器。", "Mathematics 1 is compulsory for all ESAT candidates; Mathematics 2 is course-dependent. Each module has 27 multiple-choice questions in 40 minutes; no calculator."],
                ["每模块 1–9 分并保留一位小数，无及格线。主要用于工程和科学专业，不等同于纯数学专业统一考试。", "Each module is reported on a 1–9 scale to one decimal place, with no pass mark. It is mainly used for Engineering and Science courses, not as a universal pure Mathematics test."],
                ["与 TMUA 相同，经 UAT-UK 账户和 Pearson 系统预约；选错模块通常需取消后重新预约。", "As with TMUA, book through a UAT-UK account and the Pearson system; changing modules normally requires cancellation and rebooking."],
              ],
              ["uk-uat-esat-2027", "uk-uat-registration"],
            ),
            row(
              [
                ["STEP Mathematics", "STEP Mathematics"],
                ["STEP 2 和 STEP 3 各 3 小时、12 题；STEP 2 基于 A Level Mathematics 与 AS Further Mathematics，STEP 3 基于 A Level Mathematics 与 A Level Further Mathematics。", "STEP 2 and STEP 3 are each three hours with 12 questions; STEP 2 draws on A Level Mathematics and AS Further Mathematics, while STEP 3 draws on A Level Mathematics and A Level Further Mathematics."],
                ["通常作为 Cambridge、Warwick 或 Imperial 个别课程的 offer 条件；由大学指定试卷和所需等级。", "Usually used as an offer condition for selected courses at Cambridge, Warwick or Imperial; the university specifies the paper and required grade."],
                ["考生不能自行报名，须由获准考试中心代报；中国考生只能在英国文化教育协会考点参加。", "Candidates cannot self-register and must be entered by an approved centre; candidates in China may sit only at a British Council centre."],
              ],
              ["uk-ocr-step-overview", "uk-ocr-step-registration-china"],
            ),
          ],
        },
      ],
    },
    {
      id: "uk-2027-timeline",
      title: t("2027 入学关键日期", "Key Dates for 2027 Entry"),
      tables: [
        {
          columns: [
            t("事项", "Event"),
            t("日期／时间", "Date / time"),
            t("中国学生说明", "China applicant note"),
          ],
          rows: [
            row(
              [
                ["UAT-UK 建立账户", "UAT-UK account creation"],
                ["2026-06-01 15:00 BST 起", "From 1 June 2026, 15:00 BST"],
                ["姓名须与考试日证件完全一致；UCAS ID 可稍后补录。", "The name must exactly match test-day ID; a UCAS ID may be added later."],
              ],
              ["uk-uat-registration", "uk-uat-deadlines-2027"],
            ),
            row(
              [
                ["10 月场预约", "October booking window"],
                ["2026-07-20 15:00 BST 至 2026-09-28 18:00 BST", "20 July 2026, 15:00 BST to 28 September 2026, 18:00 BST"],
                ["考位按 Pearson 考点库存开放，宜尽早预约。", "Appointments depend on Pearson centre capacity; early booking is advisable."],
              ],
              ["uk-uat-deadlines-2027", "uk-uat-registration"],
            ),
            row(
              [
                ["中国大陆／香港／澳门 ESAT", "ESAT in mainland China / Hong Kong / Macau"],
                ["2026-10-12 或 2026-10-13", "12 or 13 October 2026"],
                ["该地区只能选择这两天；不得要求例外。", "Candidates in these locations may use only these two dates; no exceptions are offered."],
              ],
              ["uk-uat-deadlines-2027"],
            ),
            row(
              [
                ["中国大陆／香港／澳门 TMUA", "TMUA in mainland China / Hong Kong / Macau"],
                ["2026-10-15 或 2026-10-16", "15 or 16 October 2026"],
                ["申请 Oxford／Cambridge 的考生原则上必须参加 10 月场。", "Oxford and Cambridge applicants must normally use the October sitting."],
              ],
              ["uk-uat-deadlines-2027"],
            ),
            row(
              [
                ["Oxford／Cambridge UCAS 截止", "Oxford / Cambridge UCAS deadline"],
                ["2026-10-15 18:00（英国时间）", "15 October 2026, 18:00 UK time"],
                ["考试预约和 UCAS 提交是两个独立动作，均须按时完成。", "Test booking and UCAS submission are separate actions and both deadlines must be met."],
              ],
              ["uk-ucas-2027-dates", "uk-uat-registration"],
            ),
            row(
              [
                ["其他本科专业平等审理截止", "Equal-consideration deadline for most other courses"],
                ["2027-01-13 18:00（英国时间）", "13 January 2027, 18:00 UK time"],
                ["专业页若另有更早截止，以专业页为准。", "A course-specific earlier deadline takes precedence."],
              ],
              ["uk-ucas-2027-dates"],
            ),
            row(
              [
                ["中国大陆／香港／澳门 1 月场", "January sitting in mainland China / Hong Kong / Macau"],
                ["ESAT：2027-01-06；TMUA：2027-01-08", "ESAT: 6 January 2027; TMUA: 8 January 2027"],
                ["通常不适用于 Oxford／Cambridge 标准申请；其他 UAT-UK 院校可按专业规则选择。", "Normally unavailable for standard Oxford/Cambridge applications; applicants to other UAT-UK institutions may use it subject to course rules."],
              ],
              ["uk-uat-deadlines-2027"],
            ),
            row(
              [
                ["STEP 2027", "STEP 2027"],
                ["截至核验日尚未发布完整日期", "Full dates not yet published at verification date"],
                ["最近完整周期为 2026：3 月 1 日开放、5 月 4 日截止；STEP 2 于 6 月 4 日、STEP 3 于 6 月 10 日。只可用来安排准备节奏，不可当作 2027 日期。", "The latest complete cycle is 2026: entry opened 1 March and closed 4 May; STEP 2 was 4 June and STEP 3 was 10 June. These dates may guide planning but must not be treated as the 2027 schedule."],
              ],
              ["uk-ocr-step-key-dates-2026"],
              "pending",
            ),
          ],
        },
      ],
    },
    {
      id: "uk-china-submission",
      title: t("中国学生申请与成绩提交", "Application and Score Submission for Students in China"),
      bullets: [
        t(
          "按所读课程体系填写 UCAS，而不是按国籍替换资格名称。已取得和正在修读的正式资格均应列出；未出分科目标为 pending，由学校／推荐人在 UCAS 中提供预测成绩。",
          "Enter the curriculum actually studied in UCAS rather than substituting a qualification based on nationality. Declare achieved and pending formal qualifications; the school/referee supplies predicted grades for pending qualifications.",
        ),
        t(
          "TMUA／ESAT 需另建 UAT-UK 账户并经 Pearson 预约。账户姓名必须与护照等考试日证件一致，个人资料应与 UCAS 一致。",
          "TMUA/ESAT require a separate UAT-UK account and Pearson booking. The account name must match the test-day passport or other accepted ID, and personal details should match UCAS.",
        ),
        t(
          "TMUA 成绩会自动发送给 UCAS 申请中使用 TMUA 的院校；应在 UAT-UK 账户正确填写 UCAS ID。STEP 成绩由 OCR 经 UCAS 提供给相关院校。",
          "TMUA results are automatically sent to TMUA institutions listed in the UCAS application, so the UCAS ID should be recorded correctly in the UAT-UK account. OCR passes STEP results to relevant institutions through UCAS.",
        ),
        t(
          "STEP 不能个人直接报名。中国考生应尽早联系英国文化教育协会确认考点是否接收社会考生、收费和内部截止时间。",
          "STEP cannot be self-entered. Candidates in China should contact the British Council early to confirm centre acceptance, fees and any internal deadline.",
        ),
        t(
          "使用高考申请时逐校核对。Cambridge 的认可不代表其他英国大学认可；Oxford 当前明确不接受高考。",
          "Check every institution when applying with Gaokao. Cambridge recognition does not imply recognition elsewhere; Oxford currently states that Gaokao is not accepted.",
        ),
      ],
      tables: [
        {
          title: t("剑桥大学中国高考口径", "Cambridge China Gaokao Treatment"),
          columns: [
            t("申请组合", "Qualification combination"),
            t("剑桥官方说明", "Cambridge guidance"),
          ],
          rows: [
            row(
              [
                ["3 门或以上 A Level／完整 IB Diploma／AP 加 SAT 或 ACT", "Three or more A Levels / full IB Diploma / AP plus SAT or ACT"],
                ["按这些国际资格审理。", "Assessed on those international qualifications."],
              ],
              ["uk-cambridge-international-entry-2027"],
            ),
            row(
              [
                ["少于 3 门 A Level／非完整 IB／AP 不带 SAT 或 ACT", "Fewer than three A Levels / non-full IB / AP without SAT or ACT"],
                ["除相关资格外，通常还期望高考省内排名前 0.1%；并应向拟申请学院确认。", "In addition to the relevant qualifications, a provincial top 0.1% Gaokao rank is normally expected; applicants should confirm with the intended College."],
              ],
              ["uk-cambridge-international-entry-2027"],
            ),
          ],
        },
      ],
    },
    {
      id: "uk-university-cases",
      title: t("代表性大学数学专业个案", "Representative University Mathematics Cases"),
      intro: t(
        "以下仅为具体专业的官方个案，不是英国统一标准。",
        "These are official course-specific examples, not UK-wide standards.",
      ),
      tables: [
        {
          columns: [
            t("大学／专业", "University / course"),
            t("高中资格示例", "School qualification examples"),
            t("额外数学考试", "Additional mathematics test"),
            t("口径", "Interpretation"),
          ],
          rows: [
            row(
              [
                ["Cambridge Mathematics", "Cambridge Mathematics"],
                ["A*A*A：Mathematics、Further Mathematics 加一门；或 IB 40–42、HL 776，AA HL 7。", "A*A*A in Mathematics, Further Mathematics and one other subject; or IB 40–42 with HL 776 including 7 in AA HL."],
                ["所有申请人 10 月参加 TMUA；典型 offer 另含 STEP 2、3 均为 Grade 1。", "All applicants sit TMUA in October; a typical offer additionally requires Grade 1 in both STEP 2 and STEP 3."],
                ["TMUA 用于申请阶段，STEP 是录取条件；二者不可互相替代。", "TMUA is used during selection and STEP is an offer condition; they are not interchangeable."],
              ],
              ["uk-cambridge-mathematics-2027", "uk-uat-tmua-2027"],
            ),
            row(
              [
                ["Oxford Mathematics", "Oxford Mathematics"],
                ["A*A*A，若学校开设 Further Mathematics，则两个 A* 应为 Mathematics 和 Further Mathematics；或 IB 39、HL 766，HL Mathematics 7。", "A*A*A, with the two A*s in Mathematics and Further Mathematics where available; or IB 39 with HL 766 including 7 in HL Mathematics."],
                ["2027 入学改用 TMUA，并须参加 10 月场。", "TMUA is used for 2027 entry and must be taken in the October sitting."],
                ["考试要求以 2027 招生测试页和数学学院当年说明为准。", "Use the 2027 admissions-test page and current Mathematical Institute prospectus for the applicable test requirement."],
              ],
              ["uk-oxford-mathematics-course", "uk-oxford-mathematics-2027", "uk-oxford-admissions-tests-2027"],
            ),
            row(
              [
                ["Imperial Mathematics BSc", "Imperial Mathematics BSc"],
                ["A*A*A 至 A*A*AA，含 Mathematics A*、Further Mathematics A*；或 IB 39，HL Mathematics 7。", "A*A*A to A*A*AA including A* in Mathematics and Further Mathematics; or IB 39 with 7 in HL Mathematics."],
                ["申请人应参加 TMUA；在最后预约截止后申请且未能参加 TMUA 者，offer 通常会要求至少一张 STEP。", "Applicants should take TMUA; those applying after the final booking deadline who cannot sit TMUA will typically receive an offer requiring at least one STEP paper."],
                ["Further Mathematics 未开设可个案处理，学校须在 UCAS 中说明。", "Where Further Mathematics is unavailable, cases may be considered individually and the school should explain this in UCAS."],
              ],
              ["uk-imperial-mathematics-2027"],
            ),
            row(
              [
                ["Warwick Mathematics BSc／MMath", "Warwick Mathematics BSc / MMath"],
                ["2027 典型为 A*A*A，Maths A*、Further Maths A*；或 IB 39、HL 666，含 AA。", "For 2027, typically A*A*A with A* in Maths and Further Maths; or IB 39 with HL 666 including AA."],
                ["采用 TMUA 或 STEP。未参加 TMUA 而申报 STEP 路径时，offer 要求任一 STEP Grade 2。", "Uses TMUA or STEP. Applicants declaring the STEP route without TMUA receive an offer requiring Grade 2 in any STEP paper."],
                ["2025 入学多数 offer 的 TMUA 为 5.0 及以上，但也有低于 5.0 的整体审理录取；该历史数据不是 2027 固定线。", "For 2025 entry most offers went to applicants scoring 5.0 or above in TMUA, but some lower scores received offers after holistic review; this historical figure is not a fixed 2027 cutoff."],
              ],
              ["uk-warwick-mathematics-offer-2027", "uk-warwick-admissions-tests-2027"],
            ),
          ],
        },
      ],
    },
  ],
  sourceIds: ukSingaporeDestinationSources
    .filter((item) => item.id.startsWith("uk-"))
    .map((item) => item.id),
  relatedProjectIds: [
    "tmua",
    "esat",
    "step",
    "cie-as-a-level-mathematics-9709",
    "cie-as-a-level-further-mathematics-9231",
    "edexcel-ial-mathematics",
    "edexcel-ial-further-mathematics",
    "ib-dp-math-aa-hl",
    "ap-calculus-bc",
  ],
  lastVerified: VERIFIED_AT,
};

const singaporeMathematicsAdmissionsGuide: DestinationGuideRecord = {
  id: "destination-singapore-undergraduate-mathematics",
  slug: "singapore-undergraduate-mathematics-admissions",
  title: t("新加坡本科数学及高数学含量专业申请", "Singapore Undergraduate Mathematics and Mathematics-Intensive Admissions"),
  shortTitle: t("新加坡数学本科", "Singapore Mathematics"),
  summary: t(
    "新加坡自治大学没有面向所有国际本科申请人的统一数学入学考试，也没有类似 UCAS 的统一申请入口。申请人按所持高中资格分别向大学提交申请，再满足具体专业的数学先修要求。",
    "Singapore's autonomous universities do not use a universal mathematics admissions test for all international undergraduate applicants, nor a central application service equivalent to UCAS. Applicants apply directly to each university under the correct school-qualification category and must then meet programme-specific mathematics prerequisites.",
  ),
  facts: [
    fact(
      "申请系统",
      "Application system",
      "NUS、NTU 等大学分别开设申请门户；须逐校申请和上传材料。",
      "NUS, NTU and other universities operate separate application portals; applications and documents are submitted to each institution.",
      ["sg-moe-autonomous-universities", "sg-nus-international-qualifications-2026", "sg-ntu-admission-guide-current"],
    ),
    fact(
      "申请组别",
      "Applicant category",
      "申请表按高中资格而非单按国籍选择。International A Level、IB、美国高中课程和高考使用不同入口与材料清单。",
      "The application category follows the school qualification rather than nationality alone. International A Level, IB, US High School and Gaokao routes use different forms and document lists.",
      ["sg-nus-international-qualifications-2026", "sg-ntu-admission-guide-current"],
    ),
    fact(
      "统一数学考试",
      "Universal mathematics test",
      "无。NUS 已停办 University Entrance Examination；NTU 高考申请不要求 NTU Entrance Examination。个别院系对特定资格的测试不构成全国统一要求。",
      "None. NUS has discontinued its University Entrance Examination, and NTU does not require its Entrance Examination for Gaokao applicants. Any faculty test for a specific qualification is not a nationwide requirement.",
      ["sg-nus-international-qualifications-2026", "sg-ntu-gaokao-2027", "sg-ntu-mathematical-sciences"],
    ),
    fact(
      "国际申请分数线",
      "International-admissions cutoff",
      "NUS、NTU 不公布数学专业国际申请人的固定录取线；最低资格不等于实际竞争分数。",
      "NUS and NTU do not publish a fixed cutoff for international applicants to Mathematics; minimum eligibility is not the same as the competitive admission level.",
      ["sg-nus-international-qualifications-2026", "sg-ntu-international-qualifications-2026", "sg-ntu-gaokao-2027"],
    ),
    fact(
      "中国高考路径",
      "China Gaokao route",
      "NUS 采用“高考良好成绩”表述但未公布统一百分比；NTU 的最低申请条件为高考总分平均达到满分的 80%。",
      "NUS states a 'good pass' in Gaokao without publishing a uniform percentage; NTU sets a minimum application threshold of 80% of the total Gaokao score.",
      ["sg-nus-gaokao-2026", "sg-ntu-gaokao-2027"],
    ),
    fact(
      "NTU AY2027/28 申请周期",
      "NTU AY2027/28 application cycle",
      "NTU 总览已发布 AY2027/28，国际资格申请组的总窗口为 2026-10-15 至 2027-03-19；具体资格可能采用不同截止日。",
      "NTU has published its AY2027/28 overview, with a broad international-qualifications window from 15 October 2026 to 19 March 2027; qualification-specific closing dates may differ.",
      ["sg-ntu-admission-guide-current"],
      "confirmed",
    ),
  ],
  sections: [
    {
      id: "sg-application-system",
      title: t("申请体系与信息层级", "Application System and Levels of Authority"),
      paragraphs: [
        t(
          "大学招生办公室规定资格、申请期和材料；学院或专业页面规定数学先修科目。历史 Indicative Grade Profile 只反映指定本地资格的已录取者区间，不能直接换算为国际 A Level、IB 或高考分数线。",
          "The university admissions office defines qualification routes, application periods and documents; the school or programme defines mathematics prerequisites. Historical Indicative Grade Profiles cover specified local qualifications and cannot be converted directly into International A Level, IB or Gaokao cutoffs.",
        ),
      ],
      tables: [
        {
          columns: [
            t("层级", "Level"),
            t("负责内容", "What it governs"),
            t("使用原则", "How to use it"),
          ],
          rows: [
            row(
              [
                ["大学招生办公室", "University admissions office"],
                ["申请组别、开放期、最低资格、成绩核验与文件上传", "Applicant category, application window, minimum qualification, score verification and document upload"],
                ["先按所持高中资格找到对应页面。", "First locate the page matching the school qualification held."],
              ],
              ["sg-nus-international-qualifications-2026", "sg-ntu-admission-guide-current", "sg-ntu-international-qualifications-2026"],
            ),
            row(
              [
                ["学院／专业", "School / programme"],
                ["数学科目层级、是否允许衔接课程、个别测试", "Required mathematics level, bridging options and any specific test"],
                ["以所申请专业当年页面为准。", "Use the current page for the intended programme."],
              ],
              ["sg-nus-mathematics-major", "sg-ntu-mathematical-sciences"],
            ),
            row(
              [
                ["Indicative Grade Profile", "Indicative Grade Profile"],
                ["上一年度部分本地资格录取者的第 10 与第 90 百分位", "Previous-year 10th and 90th percentiles for selected local qualifications"],
                ["仅作历史竞争度参考；不是最低线，也不是国际资格换算表。", "Use only as historical competitiveness context; it is neither a cutoff nor an international-qualification conversion table."],
              ],
              ["sg-nus-igp-ay2025", "sg-ntu-igp-ay2025"],
            ),
          ],
        },
      ],
    },
    {
      id: "sg-qualification-routes",
      title: t("高中资格路径", "School Qualification Routes"),
      tables: [
        {
          columns: [
            t("资格", "Qualification"),
            t("NUS 口径", "NUS treatment"),
            t("NTU 口径", "NTU treatment"),
            t("数学材料重点", "Mathematics evidence to prioritise"),
          ],
          rows: [
            row(
              [
                ["Singapore-Cambridge GCE A Level", "Singapore-Cambridge GCE A Level"],
                ["使用本地 A Level 申请组别；NUS IGP 可用于历史参考。", "Uses the local A Level applicant category; NUS IGP may provide historical context."],
                ["使用本地 A Level 申请组别；NTU IGP 可用于历史参考。", "Uses the local A Level applicant category; NTU IGP may provide historical context."],
                ["数学专业通常看 H2 Mathematics；本地 A Level 与 International A Level 是不同申请类别。", "Mathematics programmes normally look for H2 Mathematics; local and International A Levels are distinct applicant categories."],
              ],
              ["sg-nus-igp-ay2025", "sg-ntu-igp-ay2025", "sg-ntu-mathematical-sciences"],
            ),
            row(
              [
                ["International A Level", "International A Level"],
                ["至少 3 门 A Level 取得良好成绩方可申请；官方说明许多申请人提交 4 门或以上。最多可跨两个考季、两个考试局，但考季须在 12 个月内。", "At least three good A Level passes are required to apply; NUS notes that many applicants present four or more. Results may span up to two sessions and two boards, within 12 months."],
                ["通常要求同一考季至少 4 门 A2／Cambridge Pre-U；3 门可个案审理，但该例外不适用于申请政府补贴学费名额的国际学生。五月／六月考试若实分到八月才公布，不能用于当年入学申请。", "Normally at least four A2 / Cambridge Pre-U subjects in one sitting; three may be considered case by case, but this exception does not apply to international applicants seeking subsidised-fee admission. May/June examinations whose final results arrive in August cannot be used for admission in that same year."],
                ["应有相当于 H2／HL 的高阶数学；最终仍按专业先修页判断。", "Present advanced mathematics comparable to H2/HL; the programme prerequisite page remains decisive."],
              ],
              ["sg-nus-international-a-level-2026", "sg-ntu-international-qualifications-2026", "sg-ntu-a-level-timing", "sg-ntu-mathematical-sciences"],
            ),
            row(
              [
                ["IB Diploma", "IB Diploma"],
                ["NUS 接受完整 IB Diploma；数学主修按 H2 Mathematics／Further Mathematics 的等效先修判断。", "NUS accepts the full IB Diploma; the Mathematics major applies a prerequisite equivalent to H2 Mathematics / Further Mathematics."],
                ["最低申请层面要求 3 门 HL、3 门 SL 与核心部分形成较强的 5、6、7 组合；Mathematical Sciences 要求 HL Mathematics 及格。AA HL 与 AI HL 均可满足 NTU 的数学先修，二者无偏好。", "At minimum, NTU expects a strong combination of 5s, 6s and 7s across three HL and three SL subjects plus the core; Mathematical Sciences requires a pass in HL Mathematics. Both AA HL and AI HL satisfy NTU's mathematics prerequisite, with no stated preference."],
                ["将 Math AA／AI 及 HL／SL 准确填写；NTU 须授权 IBO 直接发送成绩。", "Report Math AA/AI and HL/SL accurately; NTU requires applicants to authorise direct IBO result release."],
              ],
              ["sg-nus-international-qualifications-2026", "sg-nus-mathematics-major", "sg-ntu-ib-2026", "sg-ntu-mathematical-sciences"],
            ),
            row(
              [
                ["美国高中／AP", "US High School / AP"],
                ["美国高中毕业证路径须配标准化考试。可用至少 5 门 AP，或 SAT 加至少 3 门 AP，或 ACT Writing 加至少 3 门 AP；AP 每门最低 3 分，除法律外 AP Calculus BC 为必选；SAT 路径 Math 最低 650。", "The US High School route requires standardised tests: at least five APs, or SAT plus at least three APs, or ACT with Writing plus at least three APs. Each AP requires at least 3; AP Calculus BC is compulsory except for Law, and the SAT route requires at least 650 in Math."],
                ["按 NTU 的 American High School／AP 资格页申请；不得将自行参加的 AP 自动当作另一申请组别。", "Apply through NTU's American High School / AP qualification page; self-taken APs do not automatically change the applicant category."],
                ["Calculus BC 成绩和官方 College Board 送分是 NUS 数学证据的核心。", "Calculus BC and official College Board score delivery are central mathematics evidence for NUS."],
              ],
              ["sg-nus-standardised-tests-2026", "sg-ntu-admission-guide-current", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["中国高考", "China Gaokao"],
                ["已参加者提交高考良好成绩；应届生可先用高二下学期成绩申请，再按截止时间补交高考实分。当前页面未给统一百分比线。", "Applicants with results submit a good Gaokao pass; current students may apply using Senior Middle 2 Semester 2 results and later submit actual Gaokao results by the stated deadline. The current page gives no uniform percentage cutoff."],
                ["最低为高考总分平均达到满分 80%，并提交学信网 CSSD 验证报告；达到最低条件不保证录取。", "The minimum is 80% of the total Gaokao score, with a CSSD verification report; meeting the minimum does not guarantee admission."],
                ["数学专业仍需显示高中阶段数学达到相当于 H2／IB HL 的良好水平。", "Mathematics programmes still require strong senior-high mathematics comparable to H2 / IB HL."],
              ],
              ["sg-nus-gaokao-2026", "sg-ntu-gaokao-2027", "sg-ntu-mathematical-sciences"],
            ),
          ],
          note: t(
            "不同资格的最低申请条件不可直接换算；学校不会以本地 IGP 替代国际申请的整体审理。",
            "Minimum conditions across qualifications are not directly convertible; local IGPs do not replace holistic review of international applications.",
          ),
        },
      ],
    },
    {
      id: "sg-mathematics-prerequisites",
      title: t("代表性数学专业要求", "Representative Mathematics Programme Requirements"),
      tables: [
        {
          columns: [
            t("大学／专业", "University / programme"),
            t("数学先修", "Mathematics prerequisite"),
            t("历史成绩参考", "Historical grade context"),
            t("解释", "Interpretation"),
          ],
          rows: [
            row(
              [
                ["NUS College of Humanities and Sciences — Mathematics", "NUS College of Humanities and Sciences — Mathematics"],
                ["良好的 H2 Mathematics／Further Mathematics 或等效成绩；未达到者须在一年级修读相应数学衔接课程。", "A good H2 Mathematics / Further Mathematics pass or equivalent; applicants without it must take the corresponding first-year mathematics bridging course."],
                ["AY2025/2026 本地 Singapore-Cambridge A Level 的 Humanities and Sciences 录取区间为 ABB/C 至 AAA/A。", "For AY2025/2026, the local Singapore-Cambridge A Level range for Humanities and Sciences was ABB/C to AAA/A."],
                ["IGP 对应 CHS 大类且只适用于本地资格，不是 Mathematics 主修或国际申请人的固定线。", "The IGP covers the broader CHS intake and local qualifications only; it is not a fixed cutoff for the Mathematics major or international applicants."],
              ],
              ["sg-nus-mathematics-major", "sg-nus-igp-ay2025"],
            ),
            row(
              [
                ["NTU BSc (Hons) Mathematical Sciences", "NTU BSc (Hons) Mathematical Sciences"],
                ["Singapore-Cambridge A Level：H2 Mathematics 及格；IB：HL Mathematics 及格；NUS High School：Mathematics Major CAP 2.0；其他国际资格：高中高阶数学取得良好成绩。", "Singapore-Cambridge A Level: pass in H2 Mathematics; IB: pass in HL Mathematics; NUS High School: Mathematics Major CAP 2.0; other international qualifications: a good senior-high advanced Mathematics grade."],
                ["AY2025/2026 本地 Singapore-Cambridge A Level 的 Mathematical Sciences 录取区间为 BCC/B 至 AAA/A。", "For AY2025/2026, the local Singapore-Cambridge A Level range for Mathematical Sciences was BCC/B to AAA/A."],
                ["最低科目要求与历史 IGP 均不保证录取；国际申请竞争度另行审理。", "Neither the minimum subject requirement nor the historical IGP guarantees admission; international applications are assessed separately."],
              ],
              ["sg-ntu-mathematical-sciences", "sg-ntu-igp-ay2025"],
            ),
          ],
        },
      ],
    },
    {
      id: "sg-admissions-tests",
      title: t("数学考试与院系测试边界", "Boundary Between Mathematics Tests and Faculty Assessments"),
      tables: [
        {
          columns: [
            t("项目", "Item"),
            t("是否统一要求", "Universal requirement?"),
            t("适用范围", "Scope"),
          ],
          rows: [
            row(
              [
                ["NUS University Entrance Examination", "NUS University Entrance Examination"],
                ["否；已停办", "No; discontinued"],
                ["国际资格申请人按各资格页提交现有高中资格和规定成绩，不另参加统一 NUS 数学入学考试。", "International applicants submit their existing school qualifications and required scores under the relevant route; there is no separate universal NUS Mathematics entrance examination."],
              ],
              ["sg-nus-international-qualifications-2026"],
            ),
            row(
              [
                ["NTU Entrance Examination（高考路径）", "NTU Entrance Examination for the Gaokao route"],
                ["不要求", "Not required"],
                ["高考申请按高考、验证报告、专业数学先修及可能的面试审理。", "Gaokao applicants are assessed through Gaokao results, verification, programme mathematics prerequisites and any interview."],
              ],
              ["sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["NTU SPMS 院系测试", "NTU SPMS faculty test"],
                ["不是国际申请统一要求", "Not a universal international-applicant requirement"],
                ["当前 Mathematical Sciences 页面将该测试列于相关 Polytechnic Diploma 申请人条件；A Level、IB 和其他国际资格行未列为统一必考。", "The current Mathematical Sciences page lists this test for relevant Polytechnic Diploma applicants; it is not listed as a universal requirement in the A Level, IB or other-international-qualification rows."],
              ],
              ["sg-ntu-mathematical-sciences"],
            ),
          ],
        },
      ],
    },
    {
      id: "sg-china-application",
      title: t("中国学生报名与成绩提交", "Application and Score Submission for Students in China"),
      tables: [
        {
          columns: [
            t("事项", "Item"),
            t("NUS", "NUS"),
            t("NTU", "NTU"),
          ],
          rows: [
            row(
              [
                ["申请入口", "Application route"],
                ["通过 NUS 国际资格申请入口，选择实际高中资格。", "Use NUS International Qualifications and select the actual school qualification."],
                ["通过 NTU 对应资格表格申请。就读高考课程但不参加高考、或自行参加 AP／SAT 的学生，NTU 仍要求使用高考类别。", "Use the NTU form for the relevant qualification. Students enrolled in the Gaokao curriculum who do not sit Gaokao or independently take AP/SAT must still use NTU's Gaokao category."],
              ],
              ["sg-nus-international-qualifications-2026", "sg-ntu-admission-guide-current", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["高考最低口径", "Gaokao minimum"],
                ["“良好成绩”，未公布统一百分比。", "A 'good pass'; no uniform percentage is published."],
                ["高考总分平均达到满分 80%。", "At least 80% of the total Gaokao score."],
              ],
              ["sg-nus-gaokao-2026", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["中国普高但不参加高考", "Chinese senior high school without Gaokao"],
                ["按 Other High School Qualifications 申请，提交最新高中成绩和规定的 AP／ACT／SAT 标准化考试成绩；不能继续使用高考类别。", "Apply under Other High School Qualifications with the latest school results and the prescribed AP/ACT/SAT standardised-test results; do not remain in the Gaokao category."],
                ["仍按 PRC Gaokao 类别申请；自行参加 AP／SAT 不会改变申请类别。AY2027 起，应届申请人仍须在高考出分后 3 日内提交实分。", "Continue to apply under the PRC Gaokao category; independently taken AP/SAT does not change the application category. From AY2027, current-year applicants must still submit actual Gaokao results within three days of release."],
              ],
              ["sg-nus-gaokao-2026", "sg-nus-standardised-tests-2026", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["实分与核验", "Actual results and verification"],
                ["AY2026/2027 应届生须在 2026-06-29 12:00（新加坡时间）前通过 Applicant Portal 更新高考实分；互联网成绩单可暂收，须显示全名。", "For AY2026/2027, current-year applicants had to update actual Gaokao results through the Applicant Portal by 29 June 2026, 12:00 Singapore time; an internet result printout was provisionally accepted if it showed the full name."],
                ["须提交学信网 CSSD 验证报告；AY2027 起，应届生须在高考出分后 3 日内提交实分，入围者于 7 月面试。", "A CSSD verification report is compulsory; from AY2027, current-year applicants must submit actual Gaokao results within three days of release, with shortlisted interviews in July."],
              ],
              ["sg-nus-gaokao-2026", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["AP／SAT 官方送分", "Official AP / SAT score delivery"],
                ["使用相应标准化考试路径时，College Board 必须向 NUS 送分，申请人同时在 Applicant Portal 上传成绩单；NUS code 3720。", "When using the relevant standardised-test route, College Board must send scores to NUS and the applicant must also upload the report in the Applicant Portal; NUS code 3720."],
                ["按所用资格页面和申请 Checklist 提交；不要以自行参加 AP 改变高中资格类别。", "Follow the qualification page and application checklist; independently taken APs do not change the underlying school-qualification category."],
              ],
              ["sg-nus-standardised-tests-2026", "sg-ntu-gaokao-2027"],
            ),
            row(
              [
                ["IB 官方送分", "Official IB result delivery"],
                ["按 NUS Applicant Portal 与当年资格页要求办理。", "Follow the NUS Applicant Portal and current qualification-page instructions."],
                ["必须授权 IBO 直接向 NTU 开放正式成绩；五月场实分发布后 3 日内在 Check Status 更新。", "Applicants must authorise IBO to release official results directly to NTU and update results through Check Status within three days of May-session release."],
              ],
              ["sg-nus-international-qualifications-2026", "sg-ntu-ib-2026"],
            ),
          ],
          note: t(
            "表内 AY2026/2027 截止时间为已结束周期记录；申请下一学年时必须重新核对。",
            "AY2026/2027 deadlines in this table are records of a completed cycle and must be rechecked for the next intake.",
          ),
        },
      ],
    },
    {
      id: "sg-current-cycle",
      title: t("已公布申请周期", "Published Application Cycles"),
      tables: [
        {
          columns: [
            t("大学／资格", "University / qualification"),
            t("最近公布周期", "Latest published cycle"),
            t("日期", "Dates"),
            t("下一周期处理", "Next-cycle action"),
          ],
          rows: [
            row(
              [
                ["NUS 国际资格", "NUS International Qualifications"],
                ["AY2026/2027", "AY2026/2027"],
                ["2025-12-03 至 2026-02-23", "3 December 2025 to 23 February 2026"],
                ["AY2027/2028 开放期发布后替换，不按上一年日期推算。", "Replace when the AY2027/2028 window is published; do not extrapolate from the prior year."],
              ],
              ["sg-nus-international-qualifications-2026"],
              "historical",
            ),
            row(
              [
                ["NTU 国际资格总览", "NTU International Qualifications overview"],
                ["AY2027/2028", "AY2027/2028"],
                ["国际资格申请组总窗口为 2026-10-15 至 2027-03-19；具体截止日因资格而异。", "The broad international-qualifications window is 15 October 2026 to 19 March 2027; the closing date varies by qualification."],
                ["详细国际资格页仍显示 AY2026/2027，不能据总窗口推定高考申请人的最终截止日。", "The detailed international-qualifications page still shows AY2026/2027, so the final Gaokao deadline must not be inferred from the broad window."],
              ],
              ["sg-ntu-international-qualifications-2026", "sg-ntu-admission-guide-current"],
              "confirmed",
            ),
            row(
              [
                ["NTU 2027 高考申请人", "NTU applicants sitting Gaokao in 2027"],
                ["AY2027 起规则已预告", "Rule announced from AY2027"],
                ["高考出分后 3 日内提交；面试在 7 月。具体申请开放与截止时间待当年入口。", "Submit results within three days of release; interviews take place in July. The application opening and closing dates await the current-cycle page."],
                ["总览已公布国际资格组总窗口；高考资格的确切开放与截止日仍待详细页同步。", "The overview now gives the broad international-qualifications window; the exact opening and closing dates for Gaokao applicants still await the detailed-page update."],
              ],
              ["sg-ntu-gaokao-2027", "sg-ntu-admission-guide-current", "sg-ntu-international-qualifications-2026"],
              "pending",
            ),
          ],
        },
      ],
    },
    {
      id: "uk-singapore-system-crosswalk",
      title: t("英国与新加坡申请流程对应", "UK–Singapore Application Workflow Crosswalk"),
      tables: [
        {
          columns: [
            t("环节", "Stage"),
            t("英国", "United Kingdom"),
            t("新加坡", "Singapore"),
          ],
          rows: [
            row(
              [
                ["主申请", "Main application"],
                ["一份 UCAS 申请，可列最多五个专业选择。", "One UCAS application with up to five course choices."],
                ["分别进入 NUS、NTU 等大学门户，各校独立提交。", "Submit separately through each university portal, including NUS and NTU."],
              ],
              ["uk-ucas-how-to-apply", "sg-nus-international-qualifications-2026", "sg-ntu-admission-guide-current"],
            ),
            row(
              [
                ["资格申报", "Qualification reporting"],
                ["UCAS 列出已取得和 pending 资格，由学校提供预测成绩。", "UCAS lists achieved and pending qualifications, with predicted grades supplied by the school."],
                ["按高中资格选择大学专用表格，并按 Checklist 上传成绩和核验文件。", "Choose the university form matching the school qualification and upload results and verification documents according to its checklist."],
              ],
              ["uk-ucas-how-to-apply", "sg-nus-application-guide-2026", "sg-ntu-international-qualifications-2026"],
            ),
            row(
              [
                ["数学入学考试", "Mathematics admissions test"],
                ["部分专业另行要求 TMUA、ESAT 或 STEP；须独立注册。", "Some courses separately require TMUA, ESAT or STEP, each with separate registration."],
                ["没有统一考试；个别院系测试只适用于指定申请类别。", "No universal test; any faculty assessment applies only to specified applicant categories."],
              ],
              ["uk-ucas-admissions-tests", "uk-uat-registration", "uk-ocr-step-registration-china", "sg-nus-international-qualifications-2026", "sg-ntu-mathematical-sciences"],
            ),
            row(
              [
                ["中国高考", "China Gaokao"],
                ["认可由大学决定；Cambridge 与 Oxford 政策相反。", "Recognition is institution-specific; Cambridge and Oxford have contrasting policies."],
                ["NUS、NTU 均设高考路径，但最低口径、验证和补分时间不同。", "NUS and NTU both offer Gaokao routes, but use different minimum standards, verification and result-update deadlines."],
              ],
              ["uk-cambridge-international-entry-2027", "uk-oxford-international-qualifications", "sg-nus-gaokao-2026", "sg-ntu-gaokao-2027"],
            ),
          ],
        },
      ],
    },
  ],
  sourceIds: ukSingaporeDestinationSources
    .filter((item) => item.id.startsWith("sg-"))
    .map((item) => item.id),
  relatedProjectIds: [
    "cie-as-a-level-mathematics-9709",
    "cie-as-a-level-further-mathematics-9231",
    "edexcel-ial-mathematics",
    "edexcel-ial-further-mathematics",
    "ib-dp-math-aa-hl",
    "ib-dp-math-ai-hl",
    "ap-calculus-bc",
  ],
  lastVerified: "2026-08-25",
};

export const ukSingaporeDestinationGuides: DestinationGuideRecord[] = [
  ukMathematicsAdmissionsGuide,
  singaporeMathematicsAdmissionsGuide,
];
