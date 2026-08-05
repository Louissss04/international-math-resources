import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "数学竞赛",
  description: "国际与地区数学竞赛的赛制、日期、报名、奖项、晋级与历年结果。",
};

export default function Page() {
  return (
    <TrackDirectory
      title={t("数学竞赛", "Mathematics competitions")}
      description={t(
        "本页只收录以竞赛成绩、奖项或晋级为结果的数学赛事，可查询报名、赛程、规则、奖项和历年分数线；入学考试与学校测评另见考试目录。",
        "This directory contains mathematics competitions whose outcomes are rankings, awards or qualification. Registration, schedules, rules, awards and historical thresholds are included; admissions tests and school assessments are listed separately.",
      )}
      track="competition"
      projects={allProjects.filter((item) => item.track === "competition")}
    />
  );
}
