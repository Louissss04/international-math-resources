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
        "赛制、报名、赛程、奖项、晋级线与历年题。",
        "Formats, registration, schedules, awards, qualification thresholds and past papers.",
      )}
      track="competition"
      projects={allProjects.filter((item) => item.track === "competition")}
    />
  );
}
