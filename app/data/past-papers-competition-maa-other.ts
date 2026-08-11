import { t, type PastPaperArchiveRecord } from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";
const HMMT_VERIFIED_AT = "2026-08-11";
const MAA = t("美国数学协会（MAA）", "Mathematical Association of America (MAA)");
const HMMT = t(
  "哈佛—麻省理工数学竞赛（HMMT）",
  "Harvard-MIT Mathematics Tournament (HMMT)",
);
const AOPS = t("Art of Problem Solving Wiki", "Art of Problem Solving Wiki");
const AMT = t("澳大利亚数学信托（AMT）", "Australian Maths Trust (AMT)");
const MATH_KANGAROO = t("Math Kangaroo USA", "Math Kangaroo USA");
const MATH_KANGAROO_CHINA = t(
  "袋鼠数学中国赛区 / ASEEDER",
  "Math Kangaroo China / ASEEDER",
);
const CMS = t("加拿大数学学会（CMS）", "Canadian Mathematical Society (CMS)");

export const maaOtherPastPaperArchives: PastPaperArchiveRecord[] = [
  {
    id: "ppa-competition-amc8",
    projectId: "amc8",
    availability: "secondary",
    summary: t(
      "MAA 免费公开 2023 年 AMC 8 完整样卷与官方解答，但未提供可按年份浏览的免费官方档案；AoPS Wiki 的公开索引收录 AMC 8 及其前身 AJHSME 多个年份的题目与社区解答。",
      "MAA provides the complete 2023 AMC 8 sample paper and official solutions free of charge, but not a free year-by-year official archive. The public AoPS Wiki index covers many years of AMC 8 and its predecessor, AJHSME, with community solutions.",
    ),
    links: [
      {
        title: t("2023 AMC 8 官方样卷与解答", "Official 2023 AMC 8 sample paper and solutions"),
        provider: MAA,
        url: "https://maa.org/resource/sample-competition-2023-amc-8/",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "页面提供完整题目和官方解答；更多历年套题由 MAA 引导至其商店购买。",
          "The page contains the complete paper and official solutions; MAA directs readers to its store for further past-paper collections.",
        ),
      },
      {
        title: t("AMC 8 / AJHSME 历年题目与解答索引", "AMC 8 / AJHSME problems and solutions index"),
        provider: AOPS,
        url: "https://artofproblemsolving.com/wiki/index.php/AMC_8_Problems_and_Solutions",
        authority: "secondary",
        kind: "index",
        access: "free",
        note: t(
          "第三方社区索引，并非 MAA 官方档案；题目版权归原权利人，解答可能由社区成员编写，使用时应核对原题和官方答案。",
          "This is a third-party community index, not an MAA archive. Problem rights remain with their owners, and solutions may be community-authored; check wording and answers against official material where available.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-amc10",
    projectId: "amc10",
    availability: "secondary",
    summary: t(
      "MAA 免费公开 2022 年 AMC 10A 完整样卷与官方解答，但未建立免费官方历年下载库；AoPS Wiki 提供按 A、B 卷和年份整理的公开索引。",
      "MAA provides the complete 2022 AMC 10A sample paper and official solutions free of charge, but no free official download archive. AoPS Wiki supplies a public year-by-year index separated into A and B sittings.",
    ),
    links: [
      {
        title: t("2022 AMC 10A 官方样卷与解答", "Official 2022 AMC 10A sample paper and solutions"),
        provider: MAA,
        url: "https://maa.org/resource/sample-competition-2022-amc-10-a/",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "页面提供完整题目和官方解答；不等同于官方历年档案。",
          "The page contains the complete paper and official solutions; it is not a year-by-year official archive.",
        ),
      },
      {
        title: t("AMC 10 历年 A、B 卷题目与解答索引", "AMC 10 A/B problems and solutions index"),
        provider: AOPS,
        url: "https://artofproblemsolving.com/wiki/index.php/AMC_10_Problems_and_Solutions",
        authority: "secondary",
        kind: "index",
        access: "free",
        note: t(
          "第三方社区索引，并非 MAA 官方档案；题目版权归原权利人，社区解答不应替代官方材料。",
          "This is a third-party community index, not an MAA archive. Problem rights remain with their owners, and community solutions should not replace official material.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-amc12",
    projectId: "amc12",
    availability: "secondary",
    summary: t(
      "截至核验日，MAA 未提供可直接打开的免费 AMC 12 样卷或历年下载库，官方历年题集主要通过 MAA Press 出版物销售；此处仅收录 AoPS Wiki 的公开第三方索引。",
      "As of verification, MAA does not provide a directly accessible free AMC 12 sample paper or past-paper download archive; official historical collections are mainly sold as MAA Press publications. The only archive listed here is the public third-party AoPS Wiki index.",
    ),
    links: [
      {
        title: t("AMC 12 历年 A、B 卷题目与解答索引", "AMC 12 A/B problems and solutions index"),
        provider: AOPS,
        url: "https://artofproblemsolving.com/wiki/index.php/AMC_12_Problems_and_Solutions",
        authority: "secondary",
        kind: "index",
        access: "free",
        note: t(
          "第三方社区索引，并非 MAA 官方档案；题目版权归原权利人，文字录入和社区解答可能存在误差。",
          "This is a third-party community index, not an MAA archive. Problem rights remain with their owners, and transcriptions or community solutions may contain errors.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-aime",
    projectId: "aime",
    availability: "secondary",
    summary: t(
      "截至核验日，MAA 未提供可直接打开的免费 AIME 样卷、历年试题或官方解答库；AoPS Wiki 的公开索引按年份整理 AIME I、AIME II 题目与社区解答。",
      "As of verification, MAA does not provide a directly accessible free AIME sample, past-paper archive, or official solution archive. The public AoPS Wiki index organizes AIME I and AIME II problems and community solutions by year.",
    ),
    links: [
      {
        title: t("AIME I、II 历年题目与解答索引", "AIME I/II problems and solutions index"),
        provider: AOPS,
        url: "https://artofproblemsolving.com/wiki/index.php/AIME_Problems_and_Solutions",
        authority: "secondary",
        kind: "index",
        access: "free",
        note: t(
          "第三方社区索引，并非 MAA 官方档案；题目版权归原权利人，社区解答应与可信来源交叉核对。",
          "This is a third-party community index, not an MAA archive. Problem rights remain with their owners, and community solutions should be cross-checked against reliable sources.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-hmmt",
    projectId: "hmmt",
    availability: "official",
    summary: t(
      "HMMT 官方档案免费提供各轮试题、解答与结果。总档案目前收录 November 1998–2025、February 2008–2026，以及 HMIC 2013–2026；官网另指定 November 2009、2011 与 February 2010、2013 作为判断两场比赛目标难度的代表样卷。",
      "The official HMMT archive provides round-by-round problems, solutions, and results free of charge. It currently covers November 1998–2025, February 2008–2026, and HMIC 2013–2026. HMMT also identifies November 2009 and 2011 and February 2010 and 2013 as representative papers for judging the target difficulty of the two tournaments.",
    ),
    links: [
      {
        title: t("HMMT 官方历年试题、解答与结果总档案", "Official HMMT problems, solutions, and results archive"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/problems",
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          "按 November、February 和 Invitational 分类浏览；目前可追溯至 November 1998、February 2008 和 HMIC 2013。不同年份所保留的轮次与结果文件可能不同。",
          "Browse by November, February, and Invitational. The current archive reaches November 1998, February 2008, and HMIC 2013. The rounds and result files retained vary by year.",
        ),
      },
      {
        title: t("November 2025 官方完整档案", "Official November 2025 complete archive"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/291",
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          "提供 General、Theme、Team、Guts 各轮试题与解答，以及简版和完整版比赛结果。",
          "Provides problems and solutions for the General, Theme, Team, and Guts rounds, together with short and extended results.",
        ),
      },
      {
        title: t("February 2026 官方完整档案", "Official February 2026 complete archive"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/292",
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          "提供 Algebra and Number Theory、Combinatorics、Geometry、Team、Guts 各轮试题与解答，以及简版和完整版比赛结果。",
          "Provides problems and solutions for Algebra and Number Theory, Combinatorics, Geometry, Team, and Guts, together with short and extended results.",
        ),
      },
      {
        title: t(
          "November 与 February 官方对比及代表样卷说明",
          "Official November–February comparison and representative-paper guidance",
        ),
        provider: HMMT,
        url: "https://www.hmmt.org/www/tournaments/novfeb",
        authority: "official",
        kind: "index",
        access: "free",
        note: t(
          "官网在此列出两场比赛的现行轮次、难度与推荐代表年份，并说明 February 2010 的 Team B 和 Calculus 已取消。",
          "HMMT lists the current formats, difficulty ranges, and recommended representative years here and notes that Team B and Calculus from February 2010 have since been eliminated.",
        ),
      },
      {
        title: t("November 2009 官方代表样卷", "Official representative November 2009 papers"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/131",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "HMMT 在 November 与 February 对比页中指定的 November 目标难度代表年份；档案提供当届试题、解答与结果。",
          "A November year identified by HMMT as representative of its target difficulty; the archive supplies that tournament's problems, solutions, and results.",
        ),
      },
      {
        title: t("November 2011 官方代表样卷", "Official representative November 2011 papers"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/151",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "HMMT 在 November 与 February 对比页中指定的 November 目标难度代表年份；含 General、Theme、Team、Guts 试题与解答。",
          "A November year identified by HMMT as representative of its target difficulty, with General, Theme, Team, and Guts problems and solutions.",
        ),
      },
      {
        title: t("February 2010 官方代表样卷", "Official representative February 2010 papers"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/132",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "HMMT 指定的 February 目标难度代表年份。该届仍包含现行赛制已经取消的 Calculus 个人轮和 Team B，适合判断难度，不应直接当作现行完整模拟卷。",
          "A February year identified by HMMT as representative of its target difficulty. It still includes the Calculus individual test and Team B, both removed from the current format, so it is useful for judging difficulty but not as a direct simulation of the present tournament.",
        ),
      },
      {
        title: t("February 2013 官方代表样卷", "Official representative February 2013 papers"),
        provider: HMMT,
        url: "https://www.hmmt.org/www/archive/162",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "HMMT 在 November 与 February 对比页中指定的 February 目标难度代表年份；含 Algebra、Combinatorics、Geometry、Team、Guts 试题与解答。",
          "A February year identified by HMMT as representative of its target difficulty, with Algebra, Combinatorics, Geometry, Team, and Guts problems and solutions.",
        ),
      },
    ],
    lastVerified: HMMT_VERIFIED_AT,
  },
  {
    id: "ppa-competition-china-league",
    projectId: "china-league",
    availability: "not-found",
    summary: t(
      "截至核验日，中国数学会官网未提供全国高中数学联赛历年试题与官方解答下载库，也未找到同时满足来源清楚、可持续访问和版权风险可控条件的第三方系统索引；链接暂留空缺。",
      "As of verification, the Chinese Mathematical Society does not provide a past-paper and official-solution download archive for the National High School Mathematics League. No third-party systematic index was found that also met the standards for clear provenance, durable access, and manageable copyright risk; links are therefore left blank.",
    ),
    links: [],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-cmo",
    projectId: "cmo",
    availability: "secondary",
    summary: t(
      "截至核验日，中国数学会与 CMO 官方站没有公开的历年试题及标准解答库；AoPS Wiki 提供从 1986 年起按年份整理的公开第三方题目与社区解答索引。",
      "As of verification, neither the Chinese Mathematical Society nor the official CMO site maintains a public archive of past papers and standard solutions. AoPS Wiki provides a public third-party year index beginning with 1986, with problems and community solutions.",
    ),
    links: [
      {
        title: t("中国数学奥林匹克历年题目与解答索引", "Chinese Mathematical Olympiad problems and solutions index"),
        provider: AOPS,
        url: "https://artofproblemsolving.com/wiki/index.php/Chinese_MO_Problems_and_Solutions",
        authority: "secondary",
        kind: "index",
        access: "free",
        note: t(
          "第三方社区索引，并非中国数学会或 CMO 官方档案；部分年份的题面或解答可能由社区整理、翻译或补写。",
          "This is a third-party community index, not an archive maintained by the Chinese Mathematical Society or CMO. Some years may contain community transcriptions, translations, or solutions.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-australian-amc",
    projectId: "australian-amc",
    availability: "official",
    summary: t(
      "AMT 官方档案页提供分组练习题与解答，并链接官方商店中的历年 AMC 数字试卷；竞赛主页另有五个组别的免费样题。完整历年资料以付费数字下载或题集为主。",
      "AMT's official archive provides division-level practice problems and solutions and links to digital AMC past papers in the official shop. The competition page also supplies free samples for all five divisions. Complete historical material is mainly available as paid digital downloads or compilations.",
    ),
    links: [
      {
        title: t("AMT 官方历年试题与练习档案", "AMT official past-paper and practice archive"),
        provider: AMT,
        url: "https://amt.edu.au/department/past-papers",
        authority: "official",
        kind: "archive",
        access: "mixed",
        note: t(
          "页面中的分级练习及解答可免费打开；完整历年 AMC PDF 转至官方商店购买。",
          "Division-level practice and solutions are free to open; complete historical AMC PDFs are purchased through the official shop.",
        ),
      },
      {
        title: t("Australian AMC 官方数字试卷商店", "Official Australian AMC digital past-paper shop"),
        provider: AMT,
        url: "https://shop.amt.edu.au/collections/amc-past-papers",
        authority: "official",
        kind: "download-page",
        access: "paid",
        note: t(
          "按年份和组别购买数字试卷；付款后由官方商店交付下载链接，价格和可售年份以页面为准。",
          "Purchase digital papers by year and division; the official shop delivers a download link after payment. Prices and available years are shown on the live page.",
        ),
      },
      {
        title: t("Australian AMC 官方分组样题", "Official Australian AMC division samples"),
        provider: AMT,
        url: "https://amt.edu.au/amc",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "在“Sample AMC Problems”栏目按五个组别下载样题及详细解答。",
          "Use the “Sample AMC Problems” section to download sample sets and worked solutions for the five divisions.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-math-kangaroo",
    projectId: "math-kangaroo",
    availability: "official",
    summary: t(
      "Math Kangaroo USA 提供历年原卷 PDF、在线历年卷、免费样题和视频解答入口；部分年份免费，完整资料通常需要账户或购买。中国赛区在 A-Pass 平台提供近十年真题与官方解析，需按中国赛区页面指引开通。",
      "Math Kangaroo USA provides official previous-year PDF exams, online past exams, free samples, and video solutions. Some years are free, while fuller access normally requires an account or purchase. The China region provides ten years of past papers and official explanations through A-Pass, with access arranged as directed on its regional page.",
    ),
    links: [
      {
        title: t("Math Kangaroo 官方历年原卷 PDF", "Official Math Kangaroo previous-year PDF exams"),
        provider: MATH_KANGAROO,
        url: "https://mathkangaroo.org/mks/practice/pdf-exams/",
        authority: "official",
        kind: "download-page",
        access: "mixed",
        note: t(
          "按六个年级组和年份进入原卷；部分内容可免费使用，其他内容会转至官方学习平台并可能要求登录或购买。",
          "Browse original exams by six grade bands and year. Some material is free; other items open in the official learning platform and may require login or purchase.",
        ),
      },
      {
        title: t("Math Kangaroo 官方在线历年卷", "Official Math Kangaroo online past exams"),
        provider: MATH_KANGAROO,
        url: "https://mathkangaroo.org/mks/practice/online-practice/",
        authority: "official",
        kind: "archive",
        access: "mixed",
        note: t(
          "包含可重复作答的历年完整考试及按难度拆分的练习；免费年份会在页面标明，其余内容通常需要账户或购买。",
          "Includes resettable full past exams and difficulty-based practice. Free years are marked on the page; other material generally requires an account or purchase.",
        ),
      },
      {
        title: t("Math Kangaroo 官方免费样题库", "Official Math Kangaroo free sample bank"),
        provider: MATH_KANGAROO,
        url: "https://mathkangaroo.org/mks/practice/free-question-samples/",
        authority: "official",
        kind: "specimen",
        access: "free",
        note: t(
          "按年份查看样题，适合先核对题型与三级难度结构；并非每年完整原卷。",
          "Browse samples by year to check question style and the three difficulty bands; these are not complete papers for every year.",
        ),
      },
      {
        title: t("中国赛区近十年真题与官方解析入口", "China-region ten-year paper and official-solution access"),
        provider: MATH_KANGAROO_CHINA,
        url: "https://www.seedasdan.asia/mkchina/",
        authority: "official",
        kind: "index",
        access: "account",
        note: t(
          "中国赛区页面说明 A-Pass 平台提供近十年完整真题、官方解析和视频；页面没有开放无需账户的统一下载目录，需按赛区指引开通。",
          "The China-region page states that A-Pass provides ten years of complete papers, official explanations, and videos. It does not expose a single account-free download directory; follow the regional access instructions.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "ppa-competition-comc",
    projectId: "comc",
    availability: "official",
    summary: t(
      "加拿大数学学会的 Competition Archive 免费提供从 1996 年起的 COMC 试题及含解答版本，按年份直接进入 PDF；使用和转载须遵守 CMS 的个人学习与授权条款。",
      "The Canadian Mathematical Society's Competition Archive provides free COMC problem sets and solution editions from 1996 onward, linked to PDFs by year. Use and redistribution remain subject to the CMS terms for personal study and licensing.",
    ),
    links: [
      {
        title: t("COMC 官方历年试题与解答档案", "Official COMC past-paper and solution archive"),
        provider: CMS,
        url: "https://cms.math.ca/competitions/",
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          "在“Competition Archive”下选择 COMC；档案按年份列出 Problem Set 和 Problems with Solutions，当前可追溯至 1996 年。CMS 允许个人阅读者为个人使用复制，其他用途需另行取得许可。",
          "Choose COMC under “Competition Archive.” The archive lists a Problem Set and Problems with Solutions by year and currently reaches back to 1996. CMS permits copying by individual readers for personal use; other uses require separate permission.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
];
