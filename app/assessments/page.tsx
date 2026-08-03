import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "课程与入学考试", description: "数学相关标准考试和英国入学测试的日期、报名、形式与评分。" };
export default function Page() { return <TrackDirectory title={t("课程与入学考试", "Courses and admissions tests")} description={t("用途、报名、日期、考试形式、评分、成绩和院校使用规则。", "Purpose, registration, dates, format, scoring, results and institutional use.")} track="assessment" projects={allProjects.filter((item) => item.track === "assessment")} />; }

