"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectRecord } from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";
import { StatusBadge } from "./status-badge";

export function CompareClient({ projects }: { projects: ProjectRecord[] }) {
  const [selected, setSelected] = useState<string[]>(projects.slice(0, 2).map((item) => item.id));
  const records = useMemo(() => selected.map((id) => projects.find((item) => item.id === id)).filter((item): item is ProjectRecord => Boolean(item)), [selected, projects]);
  const factLabels = useMemo(() => Array.from(new Set(records.flatMap((record) => record.facts.map((fact) => fact.label.en)))), [records]);

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  return (
    <div>
      <fieldset className="compare-picker"><legend><span className="lang-zh">选择 2—4 项</span><span className="lang-en">Select 2–4 records</span></legend>{projects.map((project) => <label key={project.id}><input type="checkbox" checked={selected.includes(project.id)} disabled={!selected.includes(project.id) && selected.length >= 4} onChange={() => toggle(project.id)} />{project.shortTitle}</label>)}</fieldset>
      <div className="compare-table table-scroll"><table>
        <thead><tr><th><span className="lang-zh">字段</span><span className="lang-en">Field</span></th>{records.map((record) => <th key={record.id}><Link href={projectHref(record)}>{record.shortTitle}</Link><StatusBadge status={record.status} /></th>)}</tr></thead>
        <tbody>
          <tr><th><span className="lang-zh">主办方</span><span className="lang-en">Organizer</span></th>{records.map((record) => <td key={record.id}><Localized text={record.organizer} /></td>)}</tr>
          <tr><th><span className="lang-zh">适用年级</span><span className="lang-en">Grade</span></th>{records.map((record) => <td key={record.id}>{record.gradeBands.join(", ")}</td>)}</tr>
          <tr><th><span className="lang-zh">地区</span><span className="lang-en">Region</span></th>{records.map((record) => <td key={record.id}>{record.regions.join(", ")}</td>)}</tr>
          <tr><th><span className="lang-zh">费用级别</span><span className="lang-en">Cost band</span></th>{records.map((record) => <td key={record.id}>{record.costBand}</td>)}</tr>
          <tr><th><span className="lang-zh">适用周期</span><span className="lang-en">Cycle</span></th>{records.map((record) => <td key={record.id}>{record.cycle}</td>)}</tr>
          <tr><th><span className="lang-zh">下一已确认日期</span><span className="lang-en">Next confirmed date</span></th>{records.map((record) => <td key={record.id}>{record.dates.filter((date) => date.status === "confirmed" && date.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date))[0]?.date ?? "—"}</td>)}</tr>
          {factLabels.map((label) => <tr key={label}><th>{label}</th>{records.map((record) => { const fact = record.facts.find((item) => item.label.en === label); return <td key={record.id}>{fact ? <Localized text={fact.value} /> : "—"}</td>; })}</tr>)}
        </tbody>
      </table></div>
    </div>
  );
}

