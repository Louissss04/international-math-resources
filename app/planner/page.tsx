import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { PlannerClient } from "../components/planner-client";
import { allProjects } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = { title: "学生规划器", description: "按学生档案管理项目、截止日期和申请状态。" };
export default function Page() { return <main><header className="page-header page-container"><Breadcrumbs items={[{ label: t("学生规划器", "Student planner") }]} /><div className="page-title-row"><div><h1><span className="lang-zh">学生规划器</span><span className="lang-en">Student planner</span></h1><p><span className="lang-zh">项目、截止日期、状态和备注保存在当前浏览器；支持 JSON 导入与导出、CSV 和 ICS。</span><span className="lang-en">Projects, deadlines, status and notes stay in this browser; JSON import/export, CSV and ICS are supported.</span></p></div></div></header><section className="page-container directory-section"><PlannerClient projects={allProjects} /></section></main>; }

