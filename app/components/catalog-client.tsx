"use client";

import { useMemo, useState } from "react";
import type { CostBand, InformationStatus, ProjectRecord, Track } from "../lib/types";
import { ProjectCard } from "./project-card";

const all = "all";

export function CatalogClient({ projects, fixedTrack, initialQuery = "" }: { projects: ProjectRecord[]; fixedTrack?: Track; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [track, setTrack] = useState<Track | typeof all>(fixedTrack ?? all);
  const [grade, setGrade] = useState(all);
  const [region, setRegion] = useState(all);
  const [status, setStatus] = useState<InformationStatus | typeof all>(all);
  const [cost, setCost] = useState<CostBand | typeof all>(all);

  const grades = useMemo(() => Array.from(new Set(projects.flatMap((item) => item.gradeBands))).sort(), [projects]);
  const regions = useMemo(() => Array.from(new Set(projects.flatMap((item) => item.regions))).sort(), [projects]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((item) => {
      const haystack = [item.title.zh, item.title.en, item.shortTitle, item.organizer.zh, item.organizer.en, ...item.searchTerms].join(" ").toLowerCase();
      return (!needle || haystack.includes(needle))
        && (fixedTrack ? item.track === fixedTrack : track === all || item.track === track)
        && (grade === all || item.gradeBands.includes(grade))
        && (region === all || item.regions.includes(region))
        && (status === all || item.status === status)
        && (cost === all || item.costBand === cost);
    });
  }, [projects, query, track, grade, region, status, cost, fixedTrack]);

  function reset() {
    setQuery("");
    if (!fixedTrack) setTrack(all);
    setGrade(all);
    setRegion(all);
    setStatus(all);
    setCost(all);
  }

  return (
    <div>
      <div className="catalog-filters">
        <label className="filter-search">
          <span className="lang-zh">关键词</span><span className="lang-en">Keyword</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="AMC / PROMYS / 中国 / proof" />
        </label>
        {!fixedTrack && <label>
          <span className="lang-zh">类型</span><span className="lang-en">Type</span>
          <select value={track} onChange={(event) => setTrack(event.target.value as Track | typeof all)}>
            <option value={all}>全部 / All</option><option value="competition">竞赛 / Competition</option><option value="modeling">建模 / Modeling</option><option value="research">科研 / Research</option><option value="summer">夏校 / Summer</option><option value="assessment">考试 / Assessment</option>
          </select>
        </label>}
        <label>
          <span className="lang-zh">年级</span><span className="lang-en">Grade</span>
          <select value={grade} onChange={(event) => setGrade(event.target.value)}><option value={all}>全部 / All</option>{grades.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label>
          <span className="lang-zh">地区</span><span className="lang-en">Region</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)}><option value={all}>全部 / All</option>{regions.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label>
          <span className="lang-zh">信息状态</span><span className="lang-en">Data status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as InformationStatus | typeof all)}>
            <option value={all}>全部 / All</option><option value="confirmed">已确认 / Confirmed</option><option value="historical">历史 / Historical</option><option value="pending">待公布 / Pending</option><option value="conflict">冲突 / Conflict</option>
          </select>
        </label>
        <label>
          <span className="lang-zh">费用</span><span className="lang-en">Cost</span>
          <select value={cost} onChange={(event) => setCost(event.target.value as CostBand | typeof all)}>
            <option value={all}>全部 / All</option><option value="free">免费 / Free</option><option value="low">低 / Low</option><option value="medium">中 / Medium</option><option value="high">高 / High</option><option value="varies">不定 / Varies</option>
          </select>
        </label>
      </div>
      <div className="result-toolbar" aria-live="polite">
        <p><b>{visible.length}</b> <span className="lang-zh">条记录</span><span className="lang-en">records</span></p>
        <button type="button" onClick={reset}><span className="lang-zh">重置</span><span className="lang-en">Reset</span></button>
      </div>
      {visible.length ? <div className="project-grid">{visible.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <p className="empty-state"><span className="lang-zh">没有匹配记录。</span><span className="lang-en">No matching records.</span></p>}
    </div>
  );
}
