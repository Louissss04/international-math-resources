"use client";

import { useMemo, useState } from "react";
import type { DateRecord, ProjectRecord, SourceRecord, Track } from "../lib/types";
import { Localized } from "./localized";
import { projectHref } from "../lib/paths";
import Link from "next/link";
import { SourceCitations } from "./source-citations";
import { StatusBadge } from "./status-badge";

type CalendarRow = DateRecord & { project: ProjectRecord };

function icsDate(date: string) { return date.replaceAll("-", ""); }
function nextDay(date: string) { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + 1); return value.toISOString().slice(0, 10); }
function icsEscape(value: string) { return value.replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n"); }

function saveFile(content: string, name: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
}

export function CalendarClient({ projects, sources, fixedTrack }: { projects: ProjectRecord[]; sources: SourceRecord[]; fixedTrack?: Track }) {
  const rows = useMemo<CalendarRow[]>(() => projects.flatMap((project) => project.dates.map((date) => ({ ...date, project }))), [projects]);
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "all">(fixedTrack ?? "all");
  const [status, setStatus] = useState("confirmed");
  const [futureOnly, setFutureOnly] = useState(true);
  const today = new Date().toISOString().slice(0, 10);
  const visible = useMemo(() => rows.filter((item) => {
    const text = `${item.project.title.zh} ${item.project.title.en} ${item.project.shortTitle} ${item.label.zh} ${item.label.en} ${item.region?.zh ?? ""}`.toLowerCase();
    return (!query.trim() || text.includes(query.trim().toLowerCase()))
      && (track === "all" || item.project.track === track)
      && (status === "all" || item.status === status)
      && (!futureOnly || item.date >= today);
  }).sort((a, b) => a.date.localeCompare(b.date)), [rows, query, track, status, futureOnly, today]);

  function exportIcs() {
    const events = visible.filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date)).map((item) => {
      const source = item.sourceIds.map((id) => sources.find((entry) => entry.id === id)).find(Boolean);
      return ["BEGIN:VEVENT", `UID:${item.project.id}-${item.id}@international-math-library`, `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`, `DTSTART;VALUE=DATE:${icsDate(item.date)}`, `DTEND;VALUE=DATE:${icsDate(nextDay(item.endDate ?? item.date))}`, `SUMMARY:${icsEscape(`${item.project.shortTitle} — ${item.label.zh}`)}`, `DESCRIPTION:${icsEscape(`${item.label.en}${item.note ? ` | ${item.note.zh}` : ""}`)}`, source ? `URL:${source.url}` : "", "END:VEVENT"].filter(Boolean).join("\r\n");
    });
    const fileNames: Partial<Record<Track, string>> = {
      competition: "competition-calendar.ics",
      modeling: "mathematical-modeling-calendar.ics",
      research: "mathematics-research-calendar.ics",
      summer: "mathematics-summer-program-calendar.ics",
      curriculum: "mathematics-course-exam-calendar.ics",
      assessment: "admissions-test-calendar.ics",
    };
    saveFile(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Mathematics Resource Library//Calendar//ZH-EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n"), fixedTrack ? fileNames[fixedTrack] ?? "international-mathematics-calendar.ics" : "international-mathematics-calendar.ics");
  }

  return (
    <div data-static-component="calendar" data-fixed-track={fixedTrack ?? ""}>
      <div className="calendar-filters">
        <label className="filter-search"><span className="lang-zh">{fixedTrack === "competition" ? "竞赛关键词" : fixedTrack === "curriculum" ? "课程关键词" : fixedTrack === "assessment" ? "考试关键词" : "关键词"}</span><span className="lang-en">{fixedTrack === "competition" ? "Competition keyword" : fixedTrack === "curriculum" ? "Course keyword" : fixedTrack === "assessment" ? "Test keyword" : "Keyword"}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={fixedTrack === "competition" ? "AMC / UKMT / 报名" : fixedTrack === "curriculum" ? "AP / IB / A Level" : fixedTrack === "assessment" ? "SSAT / TMUA / 报名" : "AMC / HiMCM / PROMYS / IB"} /></label>
        {!fixedTrack && <label><span className="lang-zh">类别</span><span className="lang-en">Category</span><select value={track} onChange={(event) => setTrack(event.target.value as Track | "all")}><option value="all">全部 / All</option><option value="competition">数学竞赛 / Competitions</option><option value="modeling">数学建模 / Modeling</option><option value="research">数学科研 / Research</option><option value="summer">数学夏校 / Summer programs</option><option value="curriculum">课程统考 / Subject exams</option><option value="assessment">入学测评 / Admissions tests</option></select></label>}
        <label><span className="lang-zh">状态</span><span className="lang-en">Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">全部 / All</option><option value="confirmed">已确认 / Confirmed</option><option value="historical">历史 / Historical</option><option value="pending">待公布 / Pending</option><option value="conflict">冲突 / Conflict</option></select></label>
        <label className="checkbox-field"><input type="checkbox" checked={futureOnly} onChange={(event) => setFutureOnly(event.target.checked)} /><span className="lang-zh">只看未来</span><span className="lang-en">Future only</span></label>
        <button className="secondary-button" type="button" onClick={exportIcs} disabled={!visible.length}><span className="lang-zh">导出日历</span><span className="lang-en">Export ICS</span></button>
      </div>
      <p className="result-count" aria-live="polite"><b>{visible.length}</b> <span className="lang-zh">个日期</span><span className="lang-en">dates</span></p>
      <div className="calendar-list">{visible.map((item) => <article key={`${item.project.id}-${item.id}`} className="calendar-row" data-project-id={item.project.id} data-track={item.project.track} data-status={item.status} data-date={item.date} data-search={`${item.project.title.zh} ${item.project.title.en} ${item.project.shortTitle} ${item.label.zh} ${item.label.en} ${item.region?.zh ?? ""}`.toLowerCase()}><time dateTime={item.date}>{item.date}{item.endDate ? ` — ${item.endDate}` : ""}<small>{item.time} {item.timezone}</small></time><div><StatusBadge status={item.status} /><h2><Link href={projectHref(item.project)}>{item.project.shortTitle}</Link></h2><p><Localized text={item.label} /></p></div><div>{item.region && <p><Localized text={item.region} /></p>}{item.note && <p><Localized text={item.note} /></p>}<SourceCitations ids={item.sourceIds} sources={sources} /></div></article>)}</div>
    </div>
  );
}
