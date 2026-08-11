"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  chinaAccessLabels,
  formatTagLabels,
  organizerTypeLabels,
  regionLabels,
  universityCompetitions,
  universityCompetitionCountryLabel,
  universityCompetitionStatusLabels,
} from "../data/university-competitions";
import type { LocalizedText } from "../lib/types";
import { Localized } from "./localized";

const all = "all" as const;

type Competition = (typeof universityCompetitions)[number];
type OrganizerType = keyof typeof organizerTypeLabels;
type Region = keyof typeof regionLabels;
type CompetitionStatus = keyof typeof universityCompetitionStatusLabels;
type ChinaAccess = keyof typeof chinaAccessLabels;

function text(value: LocalizedText) {
  return `${value.zh} ${value.en}`;
}

function searchText(record: Competition) {
  return [
    record.id,
    record.shortTitle,
    text(record.title),
    text(record.institutions),
    text(record.organizer),
    record.country,
    record.cycle,
    text(record.eligibility),
    text(record.format),
    text(record.chinaPath),
    text(record.fee),
    record.note ? text(record.note) : "",
    ...record.officialLinks.flatMap((link) => [text(link.label), link.url]),
  ].join(" ").toLowerCase();
}

function uniqueValues<Key extends string>(values: Key[]) {
  return Array.from(new Set(values));
}

export function UniversityCompetitionDirectory() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | typeof all>(all);
  const [organizerType, setOrganizerType] = useState<OrganizerType | typeof all>(all);
  const [status, setStatus] = useState<CompetitionStatus | typeof all>(all);
  const [chinaAccess, setChinaAccess] = useState<ChinaAccess | typeof all>(all);

  const regionOptions = useMemo(() => uniqueValues(universityCompetitions.map((record) => record.region)), []);
  const organizerOptions = useMemo(() => uniqueValues(universityCompetitions.map((record) => record.organizerType)), []);
  const statusOptions = useMemo(() => uniqueValues(universityCompetitions.map((record) => record.status)), []);
  const chinaAccessOptions = useMemo(() => uniqueValues(universityCompetitions.map((record) => record.chinaAccess)), []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return universityCompetitions.filter((record) => (
      (!needle || searchText(record).includes(needle))
      && (region === all || record.region === region)
      && (organizerType === all || record.organizerType === organizerType)
      && (status === all || record.status === status)
      && (chinaAccess === all || record.chinaAccess === chinaAccess)
    ));
  }, [chinaAccess, organizerType, query, region, status]);

  function reset() {
    setQuery("");
    setRegion(all);
    setOrganizerType(all);
    setStatus(all);
    setChinaAccess(all);
  }

  return (
    <div
      data-static-component="university-competition-directory"
      data-record-ids={universityCompetitions.map((record) => record.id).join("|")}
    >
      <div className="catalog-filters">
        <label className="filter-search">
          <span className="lang-zh">关键词</span><span className="lang-en">Keyword</span>
          <input
            type="search"
            data-university-competition-filter="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="HMMT / Waterloo / team / 中国"
          />
        </label>
        <label>
          <span className="lang-zh">地区</span><span className="lang-en">Region</span>
          <select data-university-competition-filter="region" value={region} onChange={(event) => setRegion(event.target.value as Region | typeof all)}>
            <option value={all}>全部 / All</option>
            {regionOptions.map((value) => <option value={value} key={value}>{regionLabels[value].zh} / {regionLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">主办关系</span><span className="lang-en">Organizer relationship</span>
          <select data-university-competition-filter="organizer" value={organizerType} onChange={(event) => setOrganizerType(event.target.value as OrganizerType | typeof all)}>
            <option value={all}>全部 / All</option>
            {organizerOptions.map((value) => <option value={value} key={value}>{organizerTypeLabels[value].zh} / {organizerTypeLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">当前状态</span><span className="lang-en">Current status</span>
          <select data-university-competition-filter="status" value={status} onChange={(event) => setStatus(event.target.value as CompetitionStatus | typeof all)}>
            <option value={all}>全部 / All</option>
            {statusOptions.map((value) => <option value={value} key={value}>{universityCompetitionStatusLabels[value].zh} / {universityCompetitionStatusLabels[value].en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">中国学生路径</span><span className="lang-en">Access from China</span>
          <select data-university-competition-filter="china" value={chinaAccess} onChange={(event) => setChinaAccess(event.target.value as ChinaAccess | typeof all)}>
            <option value={all}>全部 / All</option>
            {chinaAccessOptions.map((value) => <option value={value} key={value}>{chinaAccessLabels[value].zh} / {chinaAccessLabels[value].en}</option>)}
          </select>
        </label>
      </div>

      <div className="result-toolbar" aria-live="polite">
        <p data-university-competition-count><b>{visible.length}</b> <span className="lang-zh">条记录</span><span className="lang-en">records</span></p>
        <button type="button" data-university-competition-reset onClick={reset}><span className="lang-zh">重置</span><span className="lang-en">Reset</span></button>
      </div>

      <div className="table-scroll university-competition-table" data-university-competition-results hidden={!visible.length}>
        <table>
          <thead>
            <tr>
              <th><span className="lang-zh">项目</span><span className="lang-en">Competition</span></th>
              <th><span className="lang-zh">主办关系</span><span className="lang-en">Organizer relationship</span></th>
              <th><span className="lang-zh">当前周期</span><span className="lang-en">Current cycle</span></th>
              <th><span className="lang-zh">对象与赛制</span><span className="lang-en">Eligibility and format</span></th>
              <th><span className="lang-zh">中国学生路径</span><span className="lang-en">Access from China</span></th>
              <th><span className="lang-zh">费用</span><span className="lang-en">Fee</span></th>
              <th><span className="lang-zh">官网资料</span><span className="lang-en">Official information</span></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((record) => (
              <tr
                key={record.id}
                data-university-competition-row
                data-university-competition-id={record.id}
                data-region={record.region}
                data-organizer-type={record.organizerType}
                data-status={record.status}
                data-china-access={record.chinaAccess}
                data-format-tag={record.formatTag}
                data-search={searchText(record)}
              >
                <td>
                  <strong><Link href={`/university-competitions/${record.id}`}><Localized text={record.title} /></Link></strong>
                  <small>{record.shortTitle} · <Localized text={universityCompetitionCountryLabel(record.country)} /></small>
                  {record.note && <small><Localized text={record.note} /></small>}
                </td>
                <td>
                  <span className="track-badge"><Localized text={organizerTypeLabels[record.organizerType]} /></span>
                  <small><Localized text={record.institutions} /></small>
                  <small><Localized text={record.organizer} /></small>
                </td>
                <td>
                  <strong>{record.cycle}</strong>
                  <small><Localized text={universityCompetitionStatusLabels[record.status]} /></small>
                </td>
                <td>
                  <Localized text={record.eligibility} />
                  <small><Localized text={record.format} /></small>
                  <small><Localized text={formatTagLabels[record.formatTag]} /></small>
                </td>
                <td>
                  <span className="track-badge"><Localized text={chinaAccessLabels[record.chinaAccess]} /></span>
                  <small><Localized text={record.chinaPath} /></small>
                </td>
                <td><Localized text={record.fee} /></td>
                <td>
                  <div className="requirement-tests">
                    {record.officialLinks.map((link) => (
                      <a href={link.url} target="_blank" rel="noreferrer" key={link.url}><Localized text={link.label} /></a>
                    ))}
                  </div>
                  {record.internalHref && <small><Link href={record.internalHref}><span className="lang-zh">本站专项档案</span><span className="lang-en">Full specialist record</span></Link></small>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!visible.length && <p className="empty-state" data-static-empty="university-competition-directory" data-university-competition-empty><span className="lang-zh">没有匹配记录。</span><span className="lang-en">No matching records.</span></p>}
    </div>
  );
}
