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

export function CalendarClient({ projects, sources }: { projects: ProjectRecord[]; sources: SourceRecord[] }) {
  const rows = useMemo<CalendarRow[]>(() => projects.flatMap((project) => project.dates.map((date) => ({ ...date, project }))), [projects]);
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState<Track | "all">("all");
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
      return ["BEGIN:VEVENT", `UID:${item.project.id}-${item.id}@mathpath`, `DTSTAMP:${new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`, `DTSTART;VALUE=DATE:${icsDate(item.date)}`, `DTEND;VALUE=DATE:${icsDate(nextDay(item.endDate ?? item.date))}`, `SUMMARY:${icsEscape(`${item.project.shortTitle} — ${item.label.zh}`)}`, `DESCRIPTION:${icsEscape(`${item.label.en}${item.note ? ` | ${item.note.zh}` : ""}`)}`, source ? `URL:${source.url}` : "", "END:VEVENT"].filter(Boolean).join("\r\n");
    });
    saveFile(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MathPath//Calendar//ZH-EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n"), "mathpath-calendar.ics");
  }

  return (
    <div>
      <div className="calendar-filters">
        <label className="filter-search"><span className="lang-zh">关键词</span><span className="lang-en">Keyword</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="AMC / application / 报名" /></label>
        <label><span className="lang-zh">类型</span><span className="lang-en">Type</span><select value={track} onChange={(event) => setTrack(event.target.value as Track | "all")}><option value="all">全部 / All</option><option value="competition">竞赛</option><option value="modeling">建模</option><option value="summer">夏校</option><option value="assessment">考试</option><option value="research">科研</option></select></label>
        <label><span className="lang-zh">状态</span><span className="lang-en">Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">全部 / All</option><option value="confirmed">已确认 / Confirmed</option><option value="historical">历史 / Historical</option><option value="pending">待公布 / Pending</option><option value="conflict">冲突 / Conflict</option></select></label>
        <label className="checkbox-field"><input type="checkbox" checked={futureOnly} onChange={(event) => setFutureOnly(event.target.checked)} /><span className="lang-zh">只看未来</span><span className="lang-en">Future only</span></label>
        <button className="secondary-button" type="button" onClick={exportIcs} disabled={!visible.length}><span className="lang-zh">导出日历</span><span className="lang-en">Export ICS</span></button>
      </div>
      <p className="result-count" aria-live="polite"><b>{visible.length}</b> <span className="lang-zh">个日期节点</span><span className="lang-en">date records</span></p>
      <div className="calendar-list">{visible.map((item) => <article key={`${item.project.id}-${item.id}`} className="calendar-row"><time dateTime={item.date}>{item.date}{item.endDate ? ` — ${item.endDate}` : ""}<small>{item.time} {item.timezone}</small></time><div><StatusBadge status={item.status} /><h2><Link href={projectHref(item.project)}>{item.project.shortTitle}</Link></h2><p><Localized text={item.label} /></p></div><div>{item.region && <p><Localized text={item.region} /></p>}{item.note && <p><Localized text={item.note} /></p>}<SourceCitations ids={item.sourceIds} sources={sources} /></div></article>)}</div>
    </div>
  );
}

