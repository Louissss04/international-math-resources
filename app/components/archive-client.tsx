"use client";

import { useMemo, useState } from "react";
import type { ProjectRecord, SourceRecord, ThresholdRecord, Track } from "../lib/types";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";
import { StatusBadge } from "./status-badge";

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export function ArchiveClient({ records, projects, sources, fixedTrack }: { records: ThresholdRecord[]; projects: ProjectRecord[]; sources: SourceRecord[]; fixedTrack: Extract<Track, "competition" | "curriculum" | "assessment"> }) {
  const [projectId, setProjectId] = useState("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const years = useMemo(() => Array.from(new Set(records.map((item) => item.year))).sort().reverse(), [records]);
  const visible = useMemo(() => records.filter((item) => {
    const name = projects.find((project) => project.id === item.projectId)?.shortTitle ?? item.projectId;
    const haystack = `${name} ${item.year} ${item.sitting ?? ""} ${item.metric.zh} ${item.metric.en} ${item.value}`.toLowerCase();
    return (projectId === "all" || item.projectId === projectId)
      && (year === "all" || item.year === year)
      && (!query.trim() || haystack.includes(query.trim().toLowerCase()));
  }).sort((a, b) => b.year.localeCompare(a.year) || a.projectId.localeCompare(b.projectId)), [records, projects, projectId, year, query]);
  const visibleByYear = useMemo(() => Array.from(visible.reduce((groups, item) => {
    const entries = groups.get(item.year) ?? [];
    entries.push(item);
    groups.set(item.year, entries);
    return groups;
  }, new Map<string, ThresholdRecord[]>())), [visible]);

  function exportCsv() {
    const rows = [["Project", "Year", "Sitting", "Metric ZH", "Metric EN", "Value", "Max score", "Status", "Sources"], ...visible.map((item) => [
      projects.find((project) => project.id === item.projectId)?.shortTitle ?? item.projectId,
      item.year, item.sitting ?? "", item.metric.zh, item.metric.en, item.value, item.maxScore ?? "", item.status, item.sourceIds.join(" "),
    ])];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const fileName = fixedTrack === "competition" ? "mathpath-competition-thresholds.csv" : fixedTrack === "curriculum" ? "mathpath-course-grades.csv" : "mathpath-assessment-scores.csv";
    download(`\uFEFF${csv}`, fileName, "text/csv;charset=utf-8");
  }

  return (
    <div data-static-component="archive" data-fixed-track={fixedTrack}>
      <div className="archive-filters">
        <label><span className="lang-zh">项目</span><span className="lang-en">Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="all">全部 / All</option>{projects.filter((project) => records.some((record) => record.projectId === project.id)).map((project) => <option key={project.id} value={project.id}>{project.shortTitle}</option>)}</select></label>
        <label><span className="lang-zh">年份</span><span className="lang-en">Year</span><select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">全部 / All</option>{years.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="filter-search"><span className="lang-zh">{fixedTrack === "competition" ? "奖项、晋级线或指标" : fixedTrack === "curriculum" ? "成绩、等级或边界" : "成绩或指标"}</span><span className="lang-en">{fixedTrack === "competition" ? "Award, qualification or metric" : fixedTrack === "curriculum" ? "Score, grade or boundary" : "Score or metric"}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={fixedTrack === "competition" ? "AIME / Gold / Top 1%" : fixedTrack === "curriculum" ? "AP / A* / grade boundary" : "SAT / percentile / score"} /></label>
        <button className="secondary-button" type="button" onClick={exportCsv} disabled={!visible.length}><span className="lang-zh">导出 CSV</span><span className="lang-en">Export CSV</span></button>
      </div>
      <p className="result-count" aria-live="polite"><b>{visible.length}</b> <span className="lang-zh">条记录</span><span className="lang-en">records</span></p>
      <div className="archive-year-groups">
        {visibleByYear.map(([groupYear, entries], index) => (
          <details className="threshold-year archive-year" key={groupYear} open={year !== "all" || index === 0}>
            <summary><strong>{groupYear}</strong><span><span className="lang-zh">{entries.length} 条</span><span className="lang-en">{entries.length} {entries.length === 1 ? "record" : "records"}</span></span></summary>
            <div className="table-scroll archive-table"><table>
              <thead><tr><th><span className="lang-zh">{fixedTrack === "competition" ? "竞赛" : fixedTrack === "curriculum" ? "课程／统考" : "入学考试／测评"}</span><span className="lang-en">{fixedTrack === "competition" ? "Competition" : fixedTrack === "curriculum" ? "Course / qualification" : "Admissions test / assessment"}</span></th><th><span className="lang-zh">{fixedTrack === "competition" ? "场次／组别" : fixedTrack === "curriculum" ? "考试系列／课程" : "考试场次"}</span><span className="lang-en">{fixedTrack === "competition" ? "Sitting / division" : fixedTrack === "curriculum" ? "Exam series / course" : "Test sitting"}</span></th><th><span className="lang-zh">{fixedTrack === "competition" ? "奖项／晋级指标" : fixedTrack === "curriculum" ? "成绩／等级指标" : "成绩指标"}</span><span className="lang-en">{fixedTrack === "competition" ? "Award / qualification metric" : fixedTrack === "curriculum" ? "Score / grade metric" : "Score metric"}</span></th><th><span className="lang-zh">{fixedTrack === "competition" ? "分数线／数值" : fixedTrack === "curriculum" ? "成绩／边界" : "分数／等级"}</span><span className="lang-en">{fixedTrack === "competition" ? "Threshold / value" : fixedTrack === "curriculum" ? "Score / boundary" : "Score / level"}</span></th><th><span className="lang-zh">状态／来源</span><span className="lang-en">Status / source</span></th></tr></thead>
              <tbody>{entries.map((item) => <tr key={item.id} data-project-id={item.projectId} data-year={item.year} data-search={`${projects.find((project) => project.id === item.projectId)?.shortTitle ?? item.projectId} ${item.year} ${item.sitting ?? ""} ${item.metric.zh} ${item.metric.en} ${item.value}`.toLowerCase()}><td>{projects.find((project) => project.id === item.projectId)?.shortTitle ?? item.projectId}</td><td>{item.sitting ?? "—"}</td><td><Localized text={item.metric} />{item.note && <small><Localized text={item.note} /></small>}</td><td>{item.value}{item.maxScore ? ` / ${item.maxScore}` : ""}</td><td><StatusBadge status={item.status} /><SourceCitations ids={item.sourceIds} sources={sources} /></td></tr>)}</tbody>
            </table></div>
          </details>
        ))}
      </div>
    </div>
  );
}
