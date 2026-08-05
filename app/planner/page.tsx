import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { PlannerClient } from "../components/planner-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "学生规划器", description: "按学生档案管理项目、截止日期和申请状态。" };
export default function Page() { return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("学生规划器", "Student planner") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">学生规划器</span><span className="lang-en">Student planner</span></h1><p><span className="lang-zh">记录准备中的项目、截止日期和备注。数据只保存在当前浏览器，可导出备份。</span><span className="lang-en">Track projects, deadlines and notes. Data stays in this browser and can be exported for backup.</span></p></div></div></header><section className="page-container directory-section"><PlannerClient projects={allProjects} /></section></main>; }
