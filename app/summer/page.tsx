import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "数学夏校与夏令营", description: "数学夏校资格、日期、课程、费用资助和申请材料。" };
export default function Page() { return <TrackDirectory title={t("数学夏校与夏令营", "Mathematics summer programs")} description={t("资格、国际生规则、日期、课程形式、费用资助和申请材料。", "Eligibility, international-student rules, dates, format, cost, aid and application materials.")} track="summer" projects={allProjects.filter((item) => item.track === "summer")} />; }

