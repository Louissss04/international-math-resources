import { t, type PastPaperArchiveRecord } from "@/app/lib/types";

const VERIFIED_AT = "2026-08-05";
const CEMC = t("滑铁卢大学 CEMC", "University of Waterloo CEMC");
const UKMT = t("英国数学信托（UKMT）", "United Kingdom Mathematics Trust (UKMT)");
const BMOS = t("英国数学奥林匹克（BMOS）", "British Mathematical Olympiad Subtrust (BMOS)");

const CEMC_ARCHIVE_URL = "https://cemc.uwaterloo.ca/resources/past-contests";
const UKMT_FREE_ARCHIVE_URL = "https://ukmt.org.uk/competition-papers";
const UKMT_OLDER_PAPERS_URL = "https://ukmt.org.uk/product-category/past-paper";
const BMO_ARCHIVE_URL = "https://bmos.ukmt.org.uk/home/bmo";
const BMO_SOLUTIONS_URL = "https://bmos.ukmt.org.uk/solutions/";

function cemcArchive(
  projectId: string,
  contestName: string,
): PastPaperArchiveRecord {
  return {
    id: `past-papers-cemc-${projectId}`,
    projectId,
    availability: "official",
    summary: t(
      `CEMC 官方档案收录 ${contestName} 最近 10 年的试题、官方解答和成绩文件，可按竞赛、年份和年级筛选并下载 PDF。`,
      `The official CEMC archive provides the most recent 10 years of ${contestName} papers, official solutions, and results, with filters by contest, year, and grade and downloadable PDFs.`,
    ),
    links: [
      {
        title: t(`${contestName} 历年试题、解答与成绩`, `${contestName} past papers, solutions, and results`),
        provider: CEMC,
        url: CEMC_ARCHIVE_URL,
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          `进入后在 Title 中选择 ${contestName}。当前公开表覆盖最近 10 年，不应据此推断更早试卷不存在。`,
          `Select ${contestName} under Title. The current public table covers the most recent 10 years; this does not establish that earlier papers never existed.`,
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  };
}

function ukmtChallengeArchive(
  projectId: string,
  contestName: string,
): PastPaperArchiveRecord {
  return {
    id: `past-papers-ukmt-${projectId}`,
    projectId,
    availability: "official",
    summary: t(
      `UKMT 在统一资料页免费提供 ${contestName} 的近年试题及解答；较早年份由 UKMT 商店按年份分册出售。`,
      `UKMT provides recent ${contestName} papers and solutions free through its central resource page; older years are sold by UKMT in year-grouped collections.`,
    ),
    links: [
      {
        title: t(`${contestName} 近年免费试题与解答`, `Recent free ${contestName} papers and solutions`),
        provider: UKMT,
        url: UKMT_FREE_ARCHIVE_URL,
        authority: "official",
        kind: "archive",
        access: "free",
        note: t(
          `在 Select Challenge Type 中选择 ${contestName}；页面按年份分别列出试题、解答及部分拓展探究材料。`,
          `Choose ${contestName} under Select Challenge Type; papers, solutions, and some investigation materials are listed by year.`,
        ),
      },
      {
        title: t(`${contestName} 较早年份官方合订下载`, `Official older ${contestName} paper collections`),
        provider: UKMT,
        url: UKMT_OLDER_PAPERS_URL,
        authority: "official",
        kind: "download-page",
        access: "paid",
        note: t(
          "UKMT 明确说明近年卷免费、较早卷付费；具体年份、价格和库存以商店页面为准。",
          "UKMT states that recent papers are free and older papers are paid; check the shop for current year coverage, price, and availability.",
        ),
      },
    ],
    lastVerified: VERIFIED_AT,
  };
}

const smcArchive: PastPaperArchiveRecord = {
  ...ukmtChallengeArchive("smc", "Senior Mathematical Challenge"),
  summary: t(
    "UKMT 官方索引已列出 2026 SMC 试卷、解答、题目与解答合订版及拓展探究材料；近年资料免费，更早年份合订资料由官方商店出售。",
    "UKMT's official index lists the 2026 SMC paper, solutions, combined questions and solutions, and investigation materials. Recent resources are free; older collections are sold by the official shop.",
  ),
  links: [
    {
      title: t("2026 SMC 官方试卷", "Official 2026 SMC paper"),
      provider: UKMT,
      url: "https://ukmt.org.uk/wp-content/uploads/2026/07/SMC_2026_Paper-2.pdf",
      authority: "official",
      kind: "download-page",
      access: "free",
      note: t("由 UKMT 官方资料索引列出；版权归 UKMT，本站不托管副本。", "Listed in UKMT's official resource index. Copyright belongs to UKMT; no copy is hosted here."),
    },
    {
      title: t("2026 SMC 官方解答", "Official 2026 SMC solutions"),
      provider: UKMT,
      url: "https://ukmt.org.uk/wp-content/uploads/2026/07/SMC_2026_Solutions.pdf",
      authority: "official",
      kind: "solutions",
      access: "free",
    },
    {
      title: t("2026 SMC 题目与解答合订版", "2026 SMC questions and solutions"),
      provider: UKMT,
      url: "https://ukmt.org.uk/wp-content/uploads/2026/07/SMC_2026_questions_and_solutions.pdf",
      authority: "official",
      kind: "solutions",
      access: "free",
    },
    {
      title: t("2026 SMC 解答与拓展探究", "2026 SMC Solutions and Investigations"),
      provider: UKMT,
      url: "https://ukmt.org.uk/wp-content/uploads/2026/07/SMC__2026_Solutions_and_Investigations_web_version__final_.pdf",
      authority: "official",
      kind: "solutions",
      access: "free",
    },
    ...ukmtChallengeArchive("smc", "Senior Mathematical Challenge").links,
  ],
  lastVerified: "2026-10-26",
};

const bmo1Archive: PastPaperArchiveRecord = {
  id: "past-papers-bmos-bmo1",
  projectId: "bmo1",
  availability: "official",
  summary: t(
    "BMOS 官方页面逐年列出 BMO／BMO1 试卷，并提供 1993 年以来 BMO1、BMO2 全部题目的汇编 PDF。1965—1972 年原卷目前未在官网提供；BMOS 仅指向含这些题目的正式出版物。",
    "The official BMOS page lists BMO/BMO1 papers by year and provides a compiled PDF of all BMO1 and BMO2 problems from 1993 onward. Original papers from 1965–1972 are not currently available online; BMOS instead points to a published book containing those problem statements.",
  ),
  links: [
    {
      title: t("BMO1 官方历年试卷档案", "Official BMO1 past-paper archive"),
      provider: BMOS,
      url: BMO_ARCHIVE_URL,
      authority: "official",
      kind: "archive",
      access: "free",
      note: t(
        "同页包含逐年原卷、部分阅卷报告以及 1993 年以来题目汇编；早期卷的题型与现行六题制不同。",
        "The page includes individual papers, some markers’ reports, and the compiled problems from 1993 onward; early papers differ from the current six-question format.",
      ),
    },
    {
      title: t("BMO1 官方视频解答档案", "Official BMO1 video-solution archive"),
      provider: BMOS,
      url: BMO_SOLUTIONS_URL,
      authority: "official",
      kind: "solutions",
      access: "free",
      note: t(
        "目前覆盖 2005/06—2025/26。视频受 UKMT 版权与使用政策约束，不得擅自转载或用于商业用途。",
        "Currently covers 2005/06–2025/26. The videos remain subject to UKMT copyright and use policy and may not be reposted or used commercially without permission.",
      ),
    },
  ],
  lastVerified: VERIFIED_AT,
};

const bmo2Archive: PastPaperArchiveRecord = {
  id: "past-papers-bmos-bmo2",
  projectId: "bmo2",
  availability: "official",
  summary: t(
    "BMOS 官方页面列出 BMO2 及其前身 FIST 的历年试卷，并提供 1993 年以来 BMO1、BMO2 全部题目的汇编 PDF。1973 年试卷目前缺失，1987 年未举行 FIST；在线视频解答只覆盖最近三个赛季。",
    "The official BMOS page lists BMO2 and its predecessor FIST papers and provides a compiled PDF of all BMO1 and BMO2 problems from 1993 onward. The 1973 paper is currently missing, no FIST paper was held in 1987, and online video solutions cover only the three most recent seasons.",
  ),
  links: [
    {
      title: t("BMO2／FIST 官方历年试卷档案", "Official BMO2/FIST past-paper archive"),
      provider: BMOS,
      url: BMO_ARCHIVE_URL,
      authority: "official",
      kind: "archive",
      access: "free",
      note: t(
        "同页的 BMO2 部分从 1972 年 FIST 开始逐年列卷；1973 年缺卷，1987 年没有该项试卷。",
        "The BMO2 section begins with the 1972 FIST paper; the 1973 paper is missing and no corresponding paper was held in 1987.",
      ),
    },
    {
      title: t("BMO2 官方视频解答档案", "Official BMO2 video-solution archive"),
      provider: BMOS,
      url: BMO_SOLUTIONS_URL,
      authority: "official",
      kind: "solutions",
      access: "free",
      note: t(
        "目前只覆盖 2023/24—2025/26。视频受 UKMT 版权与使用政策约束，不得擅自转载或用于商业用途。",
        "Currently covers only 2023/24–2025/26. The videos remain subject to UKMT copyright and use policy and may not be reposted or used commercially without permission.",
      ),
    },
  ],
  lastVerified: VERIFIED_AT,
};

export const cemcUkmtPastPaperArchives: PastPaperArchiveRecord[] = [
  cemcArchive("euclid", "Euclid"),
  cemcArchive("pascal", "Pascal"),
  cemcArchive("cayley", "Cayley"),
  cemcArchive("fermat", "Fermat"),
  cemcArchive("gauss", "Gauss"),
  cemcArchive("csmc", "CSMC"),
  cemcArchive("cimc", "CIMC"),
  cemcArchive("fryer", "Fryer"),
  cemcArchive("galois", "Galois"),
  cemcArchive("hypatia", "Hypatia"),
  ukmtChallengeArchive("jmc", "Junior Mathematical Challenge"),
  ukmtChallengeArchive("imc", "Intermediate Mathematical Challenge"),
  smcArchive,
  ukmtChallengeArchive("senior-kangaroo", "Andrew Jobbings Senior Kangaroo"),
  bmo1Archive,
  bmo2Archive,
];
