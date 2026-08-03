import type { Metadata } from "next";
import { TrackDirectory } from "../components/track-directory";
import { allProjects } from "../data";
import { t } from "../lib/types";
export const metadata: Metadata = { title: "数学科研", description: "中学生数学研究的方法、项目记录和研究诚信。" };
export default function Page() { return <TrackDirectory title={t("数学科研", "Mathematical research")} description={t("选题、检索、项目记录、版本、作者贡献、引用和研究诚信。", "Questions, literature search, project records, versions, authorship, citation and research integrity.")} track="research" projects={allProjects.filter((item) => item.track === "research")} />; }

