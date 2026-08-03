import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "数学竞赛", description: "数学竞赛资格、赛制、日期、奖项和历年分数线。" };
export default function Page() { return <TrackDirectory title={t("数学竞赛", "Mathematics competitions")} description={t("资格、报名、赛制、日期、奖项、晋级规则和历年分数线。", "Eligibility, registration, format, dates, awards, qualification rules and historical thresholds.")} track="competition" projects={allProjects.filter((item) => item.track === "competition")} />; }

