"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LocalizedText, SourceKind, Track } from "../lib/types";
import { Localized } from "./localized";

export type OfficialSiteCategory = Track | "journal" | "university";

export interface OfficialSiteDirectoryLink {
  id: string;
  label: LocalizedText;
  url: string;
  kind: Exclude<SourceKind, "secondary-archive">;
}

export interface OfficialSiteDirectoryEntry {
  id: string;
  title: LocalizedText;
  owner?: LocalizedText;
  detailHref?: string;
  detailLabel?: LocalizedText;
  links: OfficialSiteDirectoryLink[];
}

export interface OfficialSiteDirectoryGroup {
  id: string;
  title: LocalizedText;
  category: OfficialSiteCategory;
  entries: OfficialSiteDirectoryEntry[];
}

const categoryLabels: Array<{ value: "all" | OfficialSiteCategory; label: LocalizedText }> = [
  { value: "all", label: { zh: "全部", en: "All" } },
  { value: "competition", label: { zh: "数学竞赛", en: "Competitions" } },
  { value: "modeling", label: { zh: "数学建模", en: "Modeling" } },
  { value: "research", label: { zh: "科研资源", en: "Research resources" } },
  { value: "journal", label: { zh: "数学期刊与投稿", en: "Journals and submission" } },
  { value: "summer", label: { zh: "夏校与夏令营", en: "Summer programs" } },
  { value: "curriculum", label: { zh: "课程与统考", en: "Curricula" } },
  { value: "assessment", label: { zh: "入学考试与测评", en: "Admissions tests" } },
  { value: "university", label: { zh: "大学申请", en: "University admissions" } },
];

const kindLabels: Record<OfficialSiteDirectoryLink["kind"], LocalizedText> = {
  official: { zh: "官方页面", en: "Official page" },
  "official-data": { zh: "官方数据", en: "Official data" },
  "official-archive": { zh: "官方档案", en: "Official archive" },
};

function searchText(group: OfficialSiteDirectoryGroup, entry: OfficialSiteDirectoryEntry) {
  return [
    group.title.zh,
    group.title.en,
    entry.title.zh,
    entry.title.en,
    entry.owner?.zh ?? "",
    entry.owner?.en ?? "",
    ...entry.links.flatMap((link) => [link.label.zh, link.label.en]),
  ].join(" ").toLowerCase();
}

export function OfficialSitesClient({ groups }: { groups: OfficialSiteDirectoryGroup[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | OfficialSiteCategory>("all");

  const visibleGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return groups
      .filter((group) => category === "all" || group.category === category)
      .map((group) => ({
        ...group,
        entries: group.entries.filter((entry) => !needle || searchText(group, entry).includes(needle)),
      }))
      .filter((group) => group.entries.length > 0);
  }, [category, groups, query]);

  const visibleCount = visibleGroups.reduce((total, group) => total + group.entries.length, 0);

  function reset() {
    setQuery("");
    setCategory("all");
  }

  return (
    <div data-static-component="official-sites">
      <div className="official-site-filters">
        <label className="filter-search">
          <span className="lang-zh">搜索官网、项目或学校</span>
          <span className="lang-en">Search websites, projects or institutions</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="AMC / SAT / Cambridge / NUS"
          />
        </label>
        <label>
          <span className="lang-zh">分类</span>
          <span className="lang-en">Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as "all" | OfficialSiteCategory)}>
            {categoryLabels.map((item) => <option key={item.value} value={item.value}>{item.label.zh} / {item.label.en}</option>)}
          </select>
        </label>
      </div>

      <div className="result-toolbar" aria-live="polite">
        <p><b>{visibleCount}</b> <span className="lang-zh">个官网条目</span><span className="lang-en">official-site entries</span></p>
        <button type="button" onClick={reset}><span className="lang-zh">重置</span><span className="lang-en">Reset</span></button>
      </div>

      <div className="official-site-groups" hidden={!visibleCount}>
        {visibleGroups.map((group) => (
          <section
            className="official-site-group"
            id={group.id}
            key={group.id}
            data-official-site-group={group.id}
            data-category={group.category}
          >
            <div className="section-title-row">
              <h2><Localized text={group.title} /></h2>
              <b>{group.entries.length}</b>
            </div>
            <div className="official-site-list">
              {group.entries.map((entry) => {
                const searchable = searchText(group, entry);
                return (
                  <article
                    className="official-site-card"
                    key={entry.id}
                    data-official-site-card
                    data-entry-id={entry.id}
                    data-category={group.category}
                    data-search={searchable}
                  >
                    <header>
                      <h3>{entry.detailHref ? <Link href={entry.detailHref}><Localized text={entry.title} /></Link> : <Localized text={entry.title} />}</h3>
                      {entry.owner && <p><Localized text={entry.owner} /></p>}
                    </header>
                    <ul>
                      {entry.links.map((link) => (
                        <li key={link.id}>
                          <a href={link.url} target="_blank" rel="noreferrer" data-source-id={link.id} data-source-kind={link.kind}>
                            <Localized text={link.label} />
                            <small><Localized text={kindLabels[link.kind]} /></small>
                          </a>
                        </li>
                      ))}
                    </ul>
                    {entry.detailHref && entry.detailLabel && (
                      <footer><Link href={entry.detailHref}><Localized text={entry.detailLabel} /> →</Link></footer>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {!visibleCount && <p className="empty-state" data-static-empty="official-sites"><span className="lang-zh">没有匹配的官网。</span><span className="lang-en">No matching official sites.</span></p>}
    </div>
  );
}
