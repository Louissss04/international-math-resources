"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type {
  AdmissionRequirementRecord,
  AdmissionRequirementStage,
  AdmissionRequirementType,
  ProjectRecord,
  SourceRecord,
} from "../lib/types";
import { projectHref } from "../lib/paths";
import { Localized } from "./localized";
import { SourceCitations } from "./source-citations";

const all = "all";

const typeLabels: Record<AdmissionRequirementType, { zh: string; en: string }> = {
  required: { zh: "明确要求", en: "Required" },
  "required-alternative": { zh: "必选其一", en: "Required alternative" },
  "offer-condition": { zh: "录取条件", en: "Offer condition" },
  recommended: { zh: "官方建议", en: "Recommended" },
  considered: { zh: "招生参考", en: "Considered" },
};

const stageLabels: Record<AdmissionRequirementStage, { zh: string; en: string }> = {
  application: { zh: "申请时", en: "At application" },
  shortlisting: { zh: "筛选阶段", en: "Shortlisting" },
  offer: { zh: "录取后", en: "After an offer" },
  qualification: { zh: "学历条件", en: "Qualification condition" },
};

function searchText(record: AdmissionRequirementRecord, projects: ProjectRecord[]) {
  const linkedProjects = record.projectIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is ProjectRecord => project !== undefined);

  return [
    record.institution.zh,
    record.institution.en,
    record.country.zh,
    record.country.en,
    ...record.programs.flatMap((program) => [program.name.zh, program.name.en, program.code ?? "", program.note?.zh ?? "", program.note?.en ?? ""]),
    ...linkedProjects.flatMap((project) => [project.shortTitle, project.title.zh, project.title.en]),
    ...(record.examLabels ?? []).flatMap((label) => [label.zh, label.en]),
    record.requirement.zh,
    record.requirement.en,
    record.scoreCondition?.zh ?? "",
    record.scoreCondition?.en ?? "",
    record.exception?.zh ?? "",
    record.exception?.en ?? "",
    ...(record.searchTerms ?? []),
  ].join(" ").toLowerCase();
}

interface AdmissionRequirementsClientProps {
  requirements: AdmissionRequirementRecord[];
  projects: ProjectRecord[];
  sources: SourceRecord[];
  initialQuery?: string;
  initialCountry?: string;
  initialProject?: string;
  initialType?: string;
}

export function AdmissionRequirementsClient({
  requirements,
  projects,
  sources,
  initialQuery = "",
  initialCountry = all,
  initialProject = all,
  initialType = all,
}: AdmissionRequirementsClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState(initialCountry);
  const [project, setProject] = useState(initialProject);
  const [type, setType] = useState(initialType);

  const countries = useMemo(() => {
    const records = new Map(requirements.map((record) => [record.countryCode, record.country]));
    return Array.from(records, ([value, label]) => ({ value, label })).sort((a, b) => a.label.en.localeCompare(b.label.en));
  }, [requirements]);

  const projectOptions = useMemo(() => {
    const used = new Set(requirements.flatMap((record) => record.projectIds));
    return projects.filter((record) => used.has(record.id)).sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, undefined, { numeric: true }));
  }, [projects, requirements]);

  const visibleIds = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return new Set(requirements.filter((record) => {
      return (!needle || searchText(record, projects).includes(needle))
        && (country === all || record.countryCode === country)
        && (project === all || record.projectIds.includes(project))
        && (type === all || record.requirementType === type);
    }).map((record) => record.id));
  }, [country, project, projects, query, requirements, type]);

  const groups = useMemo(() => {
    const grouped = new Map<string, { country: AdmissionRequirementRecord["country"]; records: AdmissionRequirementRecord[] }>();
    requirements.forEach((record) => {
      const current = grouped.get(record.countryCode) ?? { country: record.country, records: [] };
      current.records.push(record);
      grouped.set(record.countryCode, current);
    });
    return Array.from(grouped, ([countryCode, group]) => ({ countryCode, ...group }))
      .sort((a, b) => a.country.en.localeCompare(b.country.en));
  }, [requirements]);

  function reset() {
    setQuery("");
    setCountry(all);
    setProject(all);
    setType(all);
  }

  return (
    <div data-static-component="admission-requirements">
      <div className="admission-requirement-filters">
        <label className="filter-search">
          <span className="lang-zh">学校、专业或考试</span>
          <span className="lang-en">Institution, programme or test</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cambridge / Mathematics / TMUA"
            data-filter="q"
          />
        </label>
        <label>
          <span className="lang-zh">国家或地区</span>
          <span className="lang-en">Country or region</span>
          <select value={country} onChange={(event) => setCountry(event.target.value)} data-filter="country">
            <option value={all}>全部 / All</option>
            {countries.map((item) => <option key={item.value} value={item.value}>{item.label.zh} / {item.label.en}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">考试或竞赛</span>
          <span className="lang-en">Test or competition</span>
          <select value={project} onChange={(event) => setProject(event.target.value)} data-filter="project">
            <option value={all}>全部 / All</option>
            {projectOptions.map((item) => <option key={item.id} value={item.id}>{item.shortTitle}</option>)}
          </select>
        </label>
        <label>
          <span className="lang-zh">政策类型</span>
          <span className="lang-en">Policy type</span>
          <select value={type} onChange={(event) => setType(event.target.value)} data-filter="type">
            <option value={all}>全部 / All</option>
            {(Object.keys(typeLabels) as AdmissionRequirementType[]).map((value) => (
              <option key={value} value={value}>{typeLabels[value].zh} / {typeLabels[value].en}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="result-toolbar" aria-live="polite">
        <p><b>{visibleIds.size}</b> <span className="lang-zh">组要求</span><span className="lang-en">requirement groups</span></p>
        <button type="button" onClick={reset}><span className="lang-zh">重置</span><span className="lang-en">Reset</span></button>
      </div>

      <div className="admission-requirement-groups" hidden={!visibleIds.size}>
        {groups.map((group) => {
          const visibleCount = group.records.filter((record) => visibleIds.has(record.id)).length;
          return (
            <section key={group.countryCode} className="admission-requirement-group" data-requirement-group={group.countryCode} hidden={!visibleCount}>
              <div className="section-title-row">
                <h2><Localized text={group.country} /></h2>
                <b>{visibleCount}</b>
              </div>
              <div className="admission-requirement-list">
                {group.records.map((record) => {
                  const linkedProjects = record.projectIds
                    .map((id) => projects.find((item) => item.id === id))
                    .filter((item): item is ProjectRecord => item !== undefined);
                  const labels = record.examLabels ?? [];
                  return (
                    <article
                      key={record.id}
                      className={`admission-requirement-card requirement-${record.requirementType}`}
                      data-requirement-id={record.id}
                      data-country={record.countryCode}
                      data-projects={record.projectIds.join(" ")}
                      data-type={record.requirementType}
                      data-search={searchText(record, projects)}
                      hidden={!visibleIds.has(record.id)}
                    >
                      <header>
                        <div>
                          <h3><Localized text={record.institution} /></h3>
                          <p><Localized text={record.applicableCycle} /></p>
                        </div>
                        <span className="requirement-type"><span className="lang-zh">{typeLabels[record.requirementType].zh}</span><span className="lang-en">{typeLabels[record.requirementType].en}</span></span>
                      </header>

                      <div className="requirement-tests" aria-label="Tests or competitions">
                        {linkedProjects.map((item) => <Link href={projectHref(item)} key={item.id}>{item.shortTitle}</Link>)}
                        {labels.map((label) => <span key={`${label.zh}-${label.en}`}><Localized text={label} /></span>)}
                      </div>

                      <div className="requirement-programs">
                        <strong><span className="lang-zh">适用专业</span><span className="lang-en">Programmes</span></strong>
                        <ul>{record.programs.map((program, index) => (
                          <li key={`${program.code ?? "programme"}-${index}`}>
                            <Localized text={program.name} />
                            {program.code && <code>{program.code}</code>}
                            {program.note && <small><Localized text={program.note} /></small>}
                          </li>
                        ))}</ul>
                      </div>

                      <dl className="requirement-details">
                        <div><dt><span className="lang-zh">使用阶段</span><span className="lang-en">Stage</span></dt><dd><span className="lang-zh">{stageLabels[record.stage].zh}</span><span className="lang-en">{stageLabels[record.stage].en}</span></dd></div>
                        <div><dt><span className="lang-zh">官网规定</span><span className="lang-en">Published rule</span></dt><dd><Localized text={record.requirement} /></dd></div>
                        {record.scoreCondition && <div><dt><span className="lang-zh">成绩条件</span><span className="lang-en">Score condition</span></dt><dd><Localized text={record.scoreCondition} /></dd></div>}
                        {record.exception && <div><dt><span className="lang-zh">例外</span><span className="lang-en">Exception</span></dt><dd><Localized text={record.exception} /></dd></div>}
                      </dl>

                      <footer>
                        <span><span className="lang-zh">更新：</span><span className="lang-en">Updated: </span>{record.lastVerified}</span>
                        <SourceCitations ids={record.sourceIds} sources={sources} />
                      </footer>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {!visibleIds.size && <p className="empty-state" data-static-empty="admission-requirements"><span className="lang-zh">没有匹配记录。</span><span className="lang-en">No matching records.</span></p>}
    </div>
  );
}
