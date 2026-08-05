import { t, type PastPaperArchiveRecord } from "../lib/types";

const VERIFIED_AT = "2026-08-05";

export const modelingPastPaperArchives: PastPaperArchiveRecord[] = [
  {
    id: "past-papers-himcm",
    projectId: "himcm",
    availability: "official",
    summary: t(
      "COMAP 在同一官方档案页按年份公开 HiMCM 题目，并同时列出结果与获奖论文入口。",
      "COMAP publishes HiMCM problems by year in one official archive, together with results and links to selected papers.",
    ),
    links: [
      {
        title: t("HiMCM 历届题目与结果", "HiMCM previous problems and results"),
        provider: t("美国数学及其应用联合会（COMAP）", "Consortium for Mathematics and Its Applications (COMAP)"),
        url: "https://www.contest.comap.com/highschool/contests/himcm/previous%20problems.html",
        authority: "official",
        kind: "archive",
        access: "free",
        note: t("官方页面按年份列出题目、结果及部分优秀论文。", "The official page lists problems, results and selected papers by year."),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
  {
    id: "past-papers-immc",
    projectId: "immc",
    availability: "official",
    summary: t(
      "国际组委会公开已结束届次的正式题目文件；目前未找到一个覆盖全部年份的官方题目总目录。",
      "The international committee publishes official problem files from completed cycles; no single official all-years problem directory was found.",
    ),
    links: [
      {
        title: t("IM²C 2026 正式题目", "IM²C 2026 official problem"),
        provider: t("国际数学建模挑战（IM²C）", "International Mathematical Modeling Challenge (IM²C)"),
        url: "https://immchallenge.org/wp-content/uploads/2026/06/2026_IMMC_Problem.pdf",
        authority: "official",
        kind: "download-page",
        access: "free",
        note: t("国际轮题目 PDF，含当届论文组成和提交要求。", "International-round problem PDF including that cycle's paper structure and submission requirements."),
      },
    ],
    lastVerified: VERIFIED_AT,
  },
];
