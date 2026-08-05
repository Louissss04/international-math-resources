import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import { CalendarClient } from "../components/calendar-client";
import { allProjects, allSources } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "日期与报名日历",
  description: "集中查询数学竞赛、建模、科研、夏校、课程统考与入学测评的日期。",
};

export default function Page() {
  const count = allProjects.reduce((sum, project) => sum + project.dates.length, 0);

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
              <span className="lang-zh">数学竞赛、建模、科研、夏校、课程统考与入学测评的报名、申请、比赛、考试、提交和结果日期。</span>
              <span className="lang-en">Registration, application, contest, examination, submission and result dates across all six categories.</span>
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
