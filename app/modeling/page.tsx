import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "数学建模", description: "中学生数学建模项目资格、赛期、论文、提交和奖项。" };
export default function Page() { return <TrackDirectory title={t("数学建模", "Mathematical modeling")} description={t("团队资格、比赛窗口、题目、论文格式、AI 政策、提交和奖项。", "Team eligibility, contest windows, problems, paper format, AI policy, submission and awards.")} track="modeling" projects={allProjects.filter((item) => item.track === "modeling")} />; }

