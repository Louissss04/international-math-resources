import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CalendarClient } from "../components/calendar-client";
import { allProjects, allSources } from "../data";
import { t } from "../lib/types";
import { calendarDateCount } from "../lib/calendar";

export const metadata: Metadata = {
  title: "日期与报名日历",
  description: "查询 2026 年起的数学竞赛、建模、科研、夏校、课程统考与入学测评日期；已过去节点归入历史记录。",
};

export default function Page() {
  const count = calendarDateCount(allProjects);

  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("日期与报名日历", "Dates and registration calendar") }]} />
        <div className="page-title-row">
          <div>
            <h1>
              <span className="lang-zh">日期与报名日历</span>
              <span className="lang-en">Dates and registration calendar</span>
            </h1>
            <p>
              <span className="lang-zh">收录 2026 年 1 月 1 日起的报名、申请、比赛、考试、提交和结果日期；已过去节点进入历史记录。</span>
              <span className="lang-en">Registration, application, contest, examination, submission and result dates from 1 January 2026; past milestones are filed under History.</span>
            </p>
          </div>
          <b>{count}</b>
        </div>
      </header>
      <section className="page-container directory-section">
        <CalendarClient projects={allProjects} sources={allSources} />
      </section>
    </main>
  );
}
