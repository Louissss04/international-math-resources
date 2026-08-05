import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "数学建模", description: "中学生数学建模项目资格、赛期、论文、提交和奖项。" };
export default function Page() { return <TrackDirectory title={t("数学建模", "Mathematical modeling")} description={t("HiMCM 与 IMMC 的参赛资格、比赛时间、论文要求、AI 使用规定和奖项。", "Eligibility, contest dates, paper requirements, AI rules and awards for HiMCM and IMMC.")} track="modeling" projects={allProjects.filter((item) => item.track === "modeling")} />; }
