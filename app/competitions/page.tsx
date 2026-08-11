import type { Metadata } from "next";
import Link from "next/link";
import { TrackDirectory } from "../components/track-directory";
import { allProjects, universityCompetitions } from "../data";
import { t } from "../lib/types";

export const metadata: Metadata = {
  title: "数学竞赛",
  description: "国际与地区数学竞赛的赛制、日期、报名、奖项、晋级与历年结果。",
};

export default function Page() {
  const competitionProjects = allProjects.filter((item) => item.track === "competition");
  return (
    <TrackDirectory
      title={t("数学竞赛", "Mathematics competitions")}
      description={t(
        "赛制、报名、赛程、奖项、晋级线与历年题。",
        "Formats, registration, schedules, awards, qualification thresholds and past papers.",
      )}
      track="competition"
      projects={competitionProjects}
    >
      <section className="page-container competition-category-section" aria-labelledby="competition-categories">
        <div className="section-title-row">
          <h2 id="competition-categories"><span className="lang-zh">竞赛分类</span><span className="lang-en">Competition categories</span></h2>
        </div>
        <div className="competition-category-grid">
          <a className="category-gateway-card category-gateway-competition" href="#competition-directory" data-competition-category="general">
            <b>{competitionProjects.length}</b>
            <h3><span className="lang-zh">国际与地区数学竞赛</span><span className="lang-en">International and regional competitions</span></h3>
            <p><span className="lang-zh">按项目查询赛制、日期、报名、奖项、考纲与历年题。</span><span className="lang-en">Browse formats, dates, registration, awards, scope and past papers by competition.</span></p>
          </a>
          <Link className="category-gateway-card category-gateway-competition" href="/university-competitions" data-competition-category="university-organized">
            <b>{universityCompetitions.length}</b>
            <h3><span className="lang-zh">大学组织竞赛</span><span className="lang-en">University-organized competitions</span></h3>
            <p><span className="lang-zh">单独查询大学院系、大学生组织及多校合作项目的主办关系和中国学生路径。</span><span className="lang-en">A separate directory for university units, student organizations and multi-university projects, including access from China.</span></p>
          </Link>
        </div>
      </section>
    </TrackDirectory>
  );
}
