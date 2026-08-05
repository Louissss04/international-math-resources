import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "数学夏校与夏令营", description: "数学夏校资格、日期、课程、费用资助和申请材料。" };
export default function Page() { return <TrackDirectory title={t("数学夏校与夏令营", "Mathematics summer programs")} description={t("PROMYS、SUMaC、Ross、Mathcamp、MathILy 和 SSP 的申请资格、课程、费用与资助。", "Eligibility, academics, cost and financial aid for PROMYS, SUMaC, Ross, Mathcamp, MathILy and SSP.")} track="summer" projects={allProjects.filter((item) => item.track === "summer")} />; }
