import type { Metadata } from "next";
import { Breadcrumbs } from "../components/breadcrumbs";
import {
  OfficialSitesClient,
  type OfficialSiteDirectoryEntry,
  type OfficialSiteDirectoryGroup,
  type OfficialSiteDirectoryLink,
} from "../components/official-sites-client";
import { admissionRequirements, allProjects, allSources, universityPolicies } from "../data";
import { destinationOfficialSiteGroups, projectTrackGroups } from "../data/official-site-groups";
import { projectHref } from "../lib/paths";
import { t, type ProjectRecord, type SourceRecord, type Track } from "../lib/types";

export const metadata: Metadata = {
  title: "官网导航",
  description: "数学竞赛、建模、科研项目、夏校、国际数学课程、数学考试和大学本科申请的官方入口。",
};

const LAST_UPDATED = "2026-08-06";
const sourceById = new Map(allSources.map((source) => [source.id, source]));

const primarySourceOverrides: Record<string, string[]> = {
  "ap-calculus-ab": ["ap-ab-exam"],
  "ap-calculus-bc": ["ap-bc-exam"],
  tmua: ["uat-tmua"],
  esat: ["uat-esat"],
  cmo: ["cms-cmo"],
  "china-league": ["cms-league"],
  "math-kangaroo": ["aksf-home"],
  himcm: ["himcm-home"],
  sat: ["sat-home"],
  act: ["act-home"],
  "cisia-tolc-i-cent-s": ["eu-cisia-tolci", "eu-cisia-cent-overview"],
  mathily: ["mathily-facts-2026"],
  ssp: ["ssp-home"],
};

const rolePatterns = [
  /中国|中华|china|mainland|aseeder|seed|赛区|international group leader/i,
  /报名|注册|申请|预约|订购|考点|registration|register|application|apply|booking|order|find.?centre|find.?center|purchase/i,
  /规则|规范|考纲|结构|手册|资格|赛制|说明|rules?|regulation|policy|handbook|specification|syllabus|structure|instructions?|eligibility|administration/i,
  /真题|样卷|样题|练习|备考|题目|教材|past.?papers?|sample|specimen|practice|prepare|materials?|problems?|questions?|textbook/i,
  /结果|奖项|成绩|分数线|分布|results?|awards?|scores?|dashboard|boundar|threshold|distribution/i,
] as const;

function officialSources(ids: readonly string[]): SourceRecord[] {
  const seen = new Set<string>();
  return ids
    .map((id) => sourceById.get(id))
    .filter((source): source is SourceRecord => Boolean(source) && source!.kind !== "secondary-archive")
    .filter((source) => {
      const key = source.url.replace(/\/$/, "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function sourceText(source: SourceRecord) {
  return `${source.id} ${source.label.zh} ${source.label.en} ${source.url}`.toLowerCase();
}

function primaryScore(source: SourceRecord, index: number) {
  const value = sourceText(source);
  let score = source.kind === "official" ? 30 : source.kind === "official-data" ? 8 : 4;
  if (/官方主页|官网|official home|overview|homepage|home\b|about\b|current.?season|course page|qualification page|program facts|programme overview|product overview/.test(value)) score += 45;
  if (/\.pdf(?:$|\?)/.test(source.url.toLowerCase())) score -= 45;
  if (/20\d{2}|dates?|deadlines?|results?|scores?|threshold|boundary|archive|handbook|specification|syllabus|instructions?|registration/.test(value)) score -= 14;
  return score - index / 100;
}

function asLink(source: SourceRecord): OfficialSiteDirectoryLink {
  return {
    id: source.id,
    label: source.label,
    url: source.url,
    kind: source.kind as OfficialSiteDirectoryLink["kind"],
  };
}

function selectProjectSources(project: ProjectRecord): SourceRecord[] {
  const candidates = officialSources(project.sourceIds);
  const selected: SourceRecord[] = [];
  const selectedUrls = new Set<string>();

  function add(source?: SourceRecord) {
    if (!source) return;
    const key = source.url.replace(/\/$/, "").toLowerCase();
    if (selectedUrls.has(key)) return;
    selected.push(source);
    selectedUrls.add(key);
  }

  for (const sourceId of primarySourceOverrides[project.id] ?? []) add(candidates.find((source) => source.id === sourceId));
  if (!selected.length) add(candidates.slice().sort((a, b) => primaryScore(b, candidates.indexOf(b)) - primaryScore(a, candidates.indexOf(a)))[0]);

  for (const pattern of rolePatterns) {
    if (selected.length >= 6) break;
    add(candidates.find((source) => pattern.test(sourceText(source))));
  }

  for (const source of candidates) {
    if (selected.length >= 6) break;
    add(source);
  }
  return selected;
}

function projectEntry(project: ProjectRecord): OfficialSiteDirectoryEntry {
  return {
    id: `project-${project.id}`,
    title: project.title,
    owner: project.organizer,
    detailHref: projectHref(project),
    detailLabel: t("查看项目资料", "View project record"),
    links: selectProjectSources(project).map(asLink),
  };
}

function ownerEntries(sources: SourceRecord[], idPrefix: string, detailHref?: string): OfficialSiteDirectoryEntry[] {
  const owners = new Map<string, SourceRecord[]>();
  for (const source of sources) {
    const key = source.owner.en.trim().toLowerCase();
    owners.set(key, [...(owners.get(key) ?? []), source]);
  }

  return [...owners.entries()]
    .map(([key, entries]) => ({
      id: `${idPrefix}-${key.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || entries[0].id}`,
      title: entries[0].owner,
      ...(detailHref ? { detailHref, detailLabel: t("查看地区数学要求", "View destination requirements") } : {}),
      links: officialSources(entries.map((entry) => entry.id)).map(asLink),
    }))
    .sort((a, b) => a.title.en.localeCompare(b.title.en));
}

const projectGroups: OfficialSiteDirectoryGroup[] = projectTrackGroups.map((group) => {
  const track = group.id as Track;
  if (track === "research") {
    const records = allProjects.filter((project) => project.track === track);
    const programs = records.filter((project) => project.eligibilityTags.includes("research-program"));
    const guideSources = officialSources(records.filter((project) => !project.eligibilityTags.includes("research-program")).flatMap((project) => project.sourceIds));
    return {
      id: group.id,
      title: group.title,
      category: track,
      entries: [
        ...programs.sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, undefined, { numeric: true })).map(projectEntry),
        ...ownerEntries(guideSources, "research-guide"),
      ],
    };
  }
  return {
    id: group.id,
    title: group.title,
    category: track,
    entries: allProjects.filter((project) => project.track === track).sort((a, b) => a.shortTitle.localeCompare(b.shortTitle, undefined, { numeric: true })).map(projectEntry),
  };
});

const destinationSlugs: Record<string, string> = {
  "united-states": "united-states-undergraduate-mathematics-requirements",
  "united-kingdom": "uk-undergraduate-mathematics-admissions",
  singapore: "singapore-undergraduate-mathematics-admissions",
  australia: "australia",
  canada: "canada-undergraduate-mathematics-requirements",
  "other-europe": "europe-other",
};

const policyRegions: Record<string, string> = { US: "united-states", UK: "united-kingdom", CA: "canada" };
const requirementRegions: Record<string, string> = {
  US: "united-states",
  GB: "united-kingdom",
  SG: "singapore",
  AU: "australia",
  CA: "canada",
};

const destinationGroups: OfficialSiteDirectoryGroup[] = destinationOfficialSiteGroups.map((group) => {
  const policySourceIds = universityPolicies
    .filter((policy) => policyRegions[policy.region] === group.id)
    .flatMap((policy) => policy.sourceIds);
  const requirementSourceIds = admissionRequirements
    .filter((record) => requirementRegions[record.countryCode] === group.id)
    .flatMap((record) => record.sourceIds);
  const sources = officialSources([...group.sourceIds, ...policySourceIds, ...requirementSourceIds]);
  return {
    id: `university-${group.id}`,
    title: group.title,
    category: "university",
    entries: ownerEntries(sources, `university-${group.id}`, `/destinations/${destinationSlugs[group.id]}`),
  };
});

const groups = [...projectGroups, ...destinationGroups];
const entryCount = groups.reduce((total, group) => total + group.entries.length, 0);
const linkCount = groups.reduce((total, group) => total + group.entries.reduce((sum, entry) => sum + entry.links.length, 0), 0);

export default function Page() {
  return (
    <main>
      <header className="page-header page-container">
        <Breadcrumbs items={[{ label: t("官网导航", "Official website directory") }]} />
        <div className="page-title-row">
          <div>
            <h1><span className="lang-zh">官网导航</span><span className="lang-en">Official website directory</span></h1>
            <p><span className="lang-zh">数学竞赛、课程、考试、项目与大学申请的官方入口。</span><span className="lang-en">Official sites for mathematics competitions, curricula, tests, programs and university applications.</span></p>
            <p className="page-updated"><span className="lang-zh">最后更新：</span><span className="lang-en">Last updated: </span>{LAST_UPDATED}</p>
          </div>
        </div>
      </header>

      <section className="page-container official-site-directory" aria-label="Official website directory">
        <nav className="official-site-jump" aria-label="Official website categories">
          {groups.map((group) => <a key={group.id} href={`#${group.id}`}><span className="lang-zh">{group.title.zh}</span><span className="lang-en">{group.title.en}</span><small>{group.entries.length}</small></a>)}
        </nav>
        <div className="official-site-summary"><b>{entryCount}</b><span className="lang-zh">个项目、机构或申请平台</span><span className="lang-en">projects, institutions or application platforms</span><b>{linkCount}</b><span className="lang-zh">个官方链接</span><span className="lang-en">official links</span></div>
        <OfficialSitesClient groups={groups} />
      </section>
    </main>
  );
}
