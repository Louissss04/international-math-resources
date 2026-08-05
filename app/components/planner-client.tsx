"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { ProjectRecord } from "../lib/types";
import { projectHref } from "../lib/paths";
import { trackLabel, trackOrder } from "../lib/display-labels";
import { Localized } from "./localized";

const storageKey = "mathpath-planner-v2";

type Profile = { id: string; name: string; grade: string };
type ItemStatus = "researching" | "preparing" | "submitted" | "complete";
type PlannerItem = { profileId: string; projectId: string; titleZh: string; titleEn: string; track: string; deadline?: string; status: ItemStatus; note?: string; updatedAt: string };
type PlannerState = { schemaVersion: 2; profiles: Profile[]; activeProfileId: string; items: PlannerItem[] };

const defaultState: PlannerState = { schemaVersion: 2, profiles: [{ id: "default", name: "Student 1", grade: "" }], activeProfileId: "default", items: [] };

function normalise(value: unknown): PlannerState {
  if (!value || typeof value !== "object") return defaultState;
  const input = value as Partial<PlannerState>;
  const profiles = Array.isArray(input.profiles) && input.profiles.length ? input.profiles : defaultState.profiles;
  const activeProfileId = profiles.some((profile) => profile.id === input.activeProfileId) ? input.activeProfileId! : profiles[0].id;
  const items = Array.isArray(input.items) ? input.items.map((item) => ({ ...item, profileId: item.profileId || activeProfileId })) : [];
  return { schemaVersion: 2, profiles, activeProfileId, items };
}

function download(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}

function csvCell(value: unknown) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

function readPlannerState(): PlannerState {
  if (typeof window === "undefined") return defaultState;
  try {
    return normalise(JSON.parse(window.localStorage.getItem(storageKey) || "null"));
  } catch {
    return defaultState;
  }
}

function subscribeToHydration() {
  return () => undefined;
}

export function PlannerClient({ projects }: { projects: ProjectRecord[] }) {
  const [state, setState] = useState<PlannerState>(readPlannerState);
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [projectToAdd, setProjectToAdd] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (ready) window.localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, ready]);

  const active = state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0];
  const items = useMemo(() => state.items.filter((item) => item.profileId === active.id), [state.items, active.id]);
  const available = projects.filter((project) => !items.some((item) => item.projectId === project.id));
  const availableGroups = trackOrder.map((track) => ({ track, projects: available.filter((project) => project.track === track) })).filter((group) => group.projects.length > 0);
  const itemGroups = trackOrder.map((track) => ({ track, items: items.filter((item) => (projects.find((project) => project.id === item.projectId)?.track ?? item.track) === track) })).filter((group) => group.items.length > 0);

  function addProfile() {
    const name = newName.trim(); if (!name) return;
    const profile: Profile = { id: `profile-${Date.now()}`, name, grade: newGrade.trim() };
    setState((current) => ({ ...current, profiles: [...current.profiles, profile], activeProfileId: profile.id }));
    setNewName(""); setNewGrade("");
  }

  function removeProfile() {
    if (state.profiles.length === 1 || !window.confirm("Delete this student profile and its planner items?")) return;
    const profiles = state.profiles.filter((profile) => profile.id !== active.id);
    setState((current) => ({ ...current, profiles, activeProfileId: profiles[0].id, items: current.items.filter((item) => item.profileId !== active.id) }));
  }

  function addProject() {
    const project = projects.find((item) => item.id === projectToAdd); if (!project) return;
    const deadline = project.dates.filter((item) => item.status === "confirmed" && item.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => a.date.localeCompare(b.date))[0]?.date;
    const item: PlannerItem = { profileId: active.id, projectId: project.id, titleZh: project.title.zh, titleEn: project.title.en, track: project.track, deadline, status: "researching", note: "", updatedAt: new Date().toISOString() };
    setState((current) => ({ ...current, items: [...current.items, item] })); setProjectToAdd("");
  }

  function patchItem(projectId: string, patch: Partial<PlannerItem>) {
    setState((current) => ({ ...current, items: current.items.map((item) => item.profileId === active.id && item.projectId === projectId ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item) }));
  }

  function removeItem(projectId: string) {
    setState((current) => ({ ...current, items: current.items.filter((item) => !(item.profileId === active.id && item.projectId === projectId)) }));
  }

  function exportJson() { download(JSON.stringify(state, null, 2), `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.json`, "application/json;charset=utf-8"); }
  function exportCsv() {
    const rows = [["Student", "Grade", "Project", "Track", "Deadline", "Status", "Note", "Updated"], ...items.map((item) => [active.name, active.grade, item.titleEn, item.track, item.deadline ?? "", item.status, item.note ?? "", item.updatedAt])];
    download(`\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`, `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.csv`, "text/csv;charset=utf-8");
  }
  function exportIcs() {
    const events = items.filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.deadline ?? "")).map((item) => { const date = item.deadline!.replaceAll("-", ""); const next = new Date(`${item.deadline}T00:00:00Z`); next.setUTCDate(next.getUTCDate() + 1); return ["BEGIN:VEVENT", `UID:${active.id}-${item.projectId}@mathpath`, `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replaceAll("-", "")}`, `SUMMARY:${item.titleEn} — deadline`, `DESCRIPTION:${(item.note ?? "").replaceAll("\n", "\\n")}`, "END:VEVENT"].join("\r\n"); });
    download(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Math Library//Planner//ZH-EN", ...events, "END:VCALENDAR"].join("\r\n"), `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.ics`, "text/calendar;charset=utf-8");
  }

  async function importJson(file: File) {
    try { setState(normalise(JSON.parse(await file.text()))); } catch { window.alert("Invalid planner backup."); }
    if (importRef.current) importRef.current.value = "";
  }

  if (!ready) return <div className="planner-workspace" data-static-component="planner"><p className="empty-state"><span className="lang-zh">正在读取本地规划数据…</span><span className="lang-en">Loading local planner data…</span></p></div>;

  return (
    <div className="planner-workspace" data-static-component="planner">
      <section className="planner-profiles">
        <div className="profile-current"><label><span className="lang-zh">学生档案</span><span className="lang-en">Student profile</span><select value={active.id} onChange={(event) => setState((current) => ({ ...current, activeProfileId: event.target.value }))}>{state.profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name}{profile.grade ? ` · ${profile.grade}` : ""}</option>)}</select></label><button type="button" onClick={removeProfile} disabled={state.profiles.length === 1}><span className="lang-zh">删除档案</span><span className="lang-en">Delete profile</span></button></div>
        <div className="profile-new"><label><span className="lang-zh">姓名或编号</span><span className="lang-en">Name or ID</span><input value={newName} onChange={(event) => setNewName(event.target.value)} /></label><label><span className="lang-zh">年级</span><span className="lang-en">Grade</span><input value={newGrade} onChange={(event) => setNewGrade(event.target.value)} /></label><button className="secondary-button" type="button" onClick={addProfile} disabled={!newName.trim()}><span className="lang-zh">新增档案</span><span className="lang-en">Add profile</span></button></div>
      </section>

      <section className="planner-add"><label><span className="lang-zh">按类别加入项目</span><span className="lang-en">Add a project by category</span><select value={projectToAdd} onChange={(event) => setProjectToAdd(event.target.value)}><option value="">选择 / Select</option>{availableGroups.map((group) => { const label = trackLabel(group.track); return <optgroup key={group.track} label={`${label.zh} / ${label.en}`}>{group.projects.map((project) => <option key={project.id} value={project.id}>{project.shortTitle} — {project.title.zh}</option>)}</optgroup>; })}</select></label><button className="primary-button" type="button" onClick={addProject} disabled={!projectToAdd}><span className="lang-zh">加入</span><span className="lang-en">Add</span></button></section>

      <section className="planner-export"><p><span className="lang-zh">数据仅保存在当前浏览器。</span><span className="lang-en">Data is stored only in this browser.</span></p><div><button type="button" onClick={exportCsv} disabled={!items.length}>CSV</button><button type="button" onClick={exportIcs} disabled={!items.length}>ICS</button><button type="button" onClick={exportJson}>JSON</button><button type="button" onClick={() => importRef.current?.click()}><span className="lang-zh">导入 JSON</span><span className="lang-en">Import JSON</span></button><input ref={importRef} hidden type="file" accept="application/json,.json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importJson(file); }} /></div></section>

      {items.length ? <div className="planner-items">{itemGroups.map((group) => <section className="planner-track-group" data-track={group.track} key={group.track}><h2><Localized text={trackLabel(group.track)} /></h2>{group.items.map((item) => { const project = projects.find((entry) => entry.id === item.projectId); return <article key={item.projectId}><div><h2>{item.titleZh}<small>{item.titleEn}</small></h2>{project && <Link href={projectHref(project)}><span className="lang-zh">查看详情</span><span className="lang-en">View details</span></Link>}</div><label><span className="lang-zh">状态</span><span className="lang-en">Status</span><select value={item.status} onChange={(event) => patchItem(item.projectId, { status: event.target.value as ItemStatus })}><option value="researching">了解中 / Considering</option><option value="preparing">准备中 / Preparing</option><option value="submitted">已提交 / Submitted</option><option value="complete">已完成 / Complete</option></select></label><label><span className="lang-zh">截止日期</span><span className="lang-en">Deadline</span><input type="date" value={item.deadline ?? ""} onChange={(event) => patchItem(item.projectId, { deadline: event.target.value })} /></label><label className="planner-note"><span className="lang-zh">备注</span><span className="lang-en">Note</span><textarea value={item.note ?? ""} onChange={(event) => patchItem(item.projectId, { note: event.target.value })} /></label><button className="remove-item" type="button" onClick={() => removeItem(item.projectId)}><span className="lang-zh">移除</span><span className="lang-en">Remove</span></button></article>; })}</section>)}</div> : <p className="empty-state"><span className="lang-zh">尚未添加项目。</span><span className="lang-en">No projects added yet.</span></p>}
    </div>
  );
}
