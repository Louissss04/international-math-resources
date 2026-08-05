"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { t, type CostBand, type ProjectRecord, type Track } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";
import { StatusBadge } from "./status-badge";
import { gradeList, regionList } from "../lib/display-labels";

export function CompareClient({ projects, fixedTrack }: { projects: ProjectRecord[]; fixedTrack: Extract<Track, "competition" | "curriculum" | "assessment"> }) {
  const [selected, setSelected] = useState<string[]>(projects.slice(0, 2).map((item) => item.id));
  const records = useMemo(() => selected.map((id) => projects.find((item) => item.id === id)).filter((item): item is ProjectRecord => Boolean(item)), [selected, projects]);
  const factLabels = useMemo(() => Array.from(new Set(records.flatMap((record) => record.facts.map((fact) => fact.label.en)))), [records]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  const costLabels: Record<CostBand, ReturnType<typeof t>> = {
    free: t("免费", "Free"),
    low: t("较低", "Low"),
    medium: t("中等", "Medium"),
    high: t("较高", "High"),
    varies: t("因情况而异", "Varies"),
  };

  return (
    <div data-static-component="compare" data-fixed-track={fixedTrack}>
      <fieldset className="compare-picker"><legend><span className="lang-zh">{fixedTrack === "competition" ? "选择 2—4 项数学竞赛" : fixedTrack === "curriculum" ? "选择 2—4 项数学课程或统考" : "选择 2—4 项入学考试或测评"}</span><span className="lang-en">{fixedTrack === "competition" ? "Select 2–4 mathematics competitions" : fixedTrack === "curriculum" ? "Select 2–4 mathematics curricula or subject exams" : "Select 2–4 admissions tests or assessments"}</span></legend>{projects.map((project) => <label key={project.id}><input type="checkbox" value={project.id} checked={selected.includes(project.id)} disabled={!selected.includes(project.id) && selected.length >= 4} onChange={() => toggle(project.id)} />{project.shortTitle}</label>)}</fieldset>
      <div className="compare-table table-scroll"><table>
        <thead><tr><th><span className="lang-zh">字段</span><span className="lang-en">Field</span></th>{records.map((record) => <th key={record.id}><Link href={projectHref(record)}>{record.shortTitle}</Link><StatusBadge status={record.status} /></th>)}</tr></thead>
        <tbody>
          <tr><th><span className="lang-zh">主办方</span><span className="lang-en">Organizer</span></th>{records.map((record) => <td key={record.id}><Localized text={record.organizer} /></td>)}</tr>
          <tr><th><span className="lang-zh">适用年级</span><span className="lang-en">Grade</span></th>{records.map((record) => <td key={record.id}><Localized text={gradeList(record.gradeBands)} /></td>)}</tr>
          <tr><th><span className="lang-zh">地区</span><span className="lang-en">Region</span></th>{records.map((record) => <td key={record.id}><Localized text={regionList(record.regions)} /></td>)}</tr>
          <tr><th><span className="lang-zh">费用</span><span className="lang-en">Cost</span></th>{records.map((record) => <td key={record.id}><Localized text={costLabels[record.costBand]} /></td>)}</tr>
          <tr><th><span className="lang-zh">适用周期</span><span className="lang-en">Cycle</span></th>{records.map((record) => <td key={record.id}>{record.cycle}</td>)}</tr>
          <tr><th><span className="lang-zh">{fixedTrack === "competition" ? "下一比赛日期" : fixedTrack === "curriculum" ? "下一统考日期" : "下一考试日期"}</span><span className="lang-en">{fixedTrack === "competition" ? "Next contest date" : fixedTrack === "curriculum" ? "Next subject-exam date" : "Next test date"}</span></th>{records.map((record) => <td key={record.id}>{record.dates.filter((date) => date.status === "confirmed" && date.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? "—"}</td>)}</tr>
          {factLabels.map((label) => { const sample = records.flatMap((record) => record.facts).find((fact) => fact.label.en === label); return <tr key={label}><th>{sample ? <Localized text={sample.label} /> : label}</th>{records.map((record) => { const fact = record.facts.find((item) => item.label.en === label); return <td key={record.id}>{fact ? <Localized text={fact.value} /> : "—"}</td>; })}</tr>; })}
        </tbody>
      </table></div>
    </div>
  );
}
