import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputDirectory = path.resolve(testDirectory, "../outputs/mathpath-static");

const requiredAssets = [
  "assets/site.css",
  "assets/data.js",
  "assets/static-site.js",
  "assets/engagement.js",
];

const trackRoutes = {
  competition: "competitions",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  curriculum: "courses",
  assessment: "assessments",
};

const trackPrefixes = {
  competition: "competition",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  curriculum: "course",
  assessment: "assessment",
};

const requiredCoreRoutes = [
  "/",
  "/catalog",
  "/programs",
  "/courses-tests",
  "/competitions",
  "/university-competitions",
  "/modeling",
  "/research",
  "/journals",
  "/summer",
  "/courses",
  "/assessments",
  "/destinations",
  "/universities",
  "/official-sites",
  "/syllabi",
  "/past-papers",
  "/competition-results",
  "/course-scores",
  "/assessment-scores",
  "/competition-calendar",
  "/course-calendar",
  "/assessment-calendar",
  "/competition-compare",
  "/course-compare",
  "/assessment-compare",
  "/planner",
  "/sources",
  "/resources",
];

function decodeEntities(value) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function visibleText(html) {
  return decodeEntities(
    html
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function attributeValues(html, element, attribute) {
  const values = [];
  const elementPattern = new RegExp(`<${element}\\b[^>]*>`, "gi");
  const attributePattern = new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i");
  for (const match of html.matchAll(elementPattern)) {
    const attributeMatch = match[0].match(attributePattern);
    if (attributeMatch) values.push(decodeEntities(attributeMatch[2].trim()));
  }
  return values;
}

function tagAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? decodeEntities(match[2].trim()) : undefined;
}

function calendarEntries(html) {
  return [...html.matchAll(/<article\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => tagAttribute(tag, "data-event-id"))
    .map((tag) => ({
      eventId: tagAttribute(tag, "data-event-id"),
      projectId: tagAttribute(tag, "data-project-id"),
      track: tagAttribute(tag, "data-track"),
      status: tagAttribute(tag, "data-status"),
      date: tagAttribute(tag, "data-date"),
      endDate: tagAttribute(tag, "data-end-date"),
      period: tagAttribute(tag, "data-calendar-period"),
    }));
}

function localDateString(value = new Date()) {
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function isExternalReference(reference) {
  return /^[a-z][a-z\d+.-]*:/i.test(reference) || reference.startsWith("//");
}

function referencePath(reference) {
  const withoutFragment = reference.split("#", 1)[0];
  return withoutFragment.split("?", 1)[0];
}

function resolveLocalReference(sourceFile, reference) {
  const pathname = referencePath(reference);
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    assert.fail(`${path.basename(sourceFile)} contains an invalid encoded path: ${reference}`);
  }

  const target = path.resolve(path.dirname(sourceFile), decoded.replaceAll("/", path.sep));
  const relativeToOutput = path.relative(outputDirectory, target);
  assert.ok(
    relativeToOutput === "" || (!relativeToOutput.startsWith("..") && !path.isAbsolute(relativeToOutput)),
    `${path.basename(sourceFile)} links outside the static export: ${reference}`,
  );
  return target;
}

function projectRoute(project) {
  const base = trackRoutes[project.track];
  assert.ok(base, `unknown project track '${project.track}' for ${project.id}`);
  return `/${base}/${project.slug}`;
}

function projectFile(project) {
  const prefix = trackPrefixes[project.track];
  assert.ok(prefix, `unknown project track '${project.track}' for ${project.id}`);
  return `${prefix}-${project.slug}.html`;
}

function journalRoute(journal) {
  return `/journals/${journal.slug}`;
}

function journalFile(journal) {
  return `journal-${journal.slug}.html`;
}

function assertUniqueIds(records, label) {
  const ids = records.map((record) => record.id);
  assert.equal(new Set(ids).size, ids.length, `${label} contains duplicate IDs`);
}

async function htmlInventory() {
  const entries = await readdir(outputDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => path.join(outputDirectory, entry.name))
    .sort();
}

let staticDataPromise;
async function loadStaticData() {
  staticDataPromise ??= (async () => {
    const file = path.join(outputDirectory, "assets/data.js");
    const source = (await readFile(file, "utf8")).trim();
    const match = source.match(/^window\.MATHPATH_DATA\s*=\s*([\s\S]*?)\s*;?$/);
    assert.ok(match, "assets/data.js is not a window.MATHPATH_DATA assignment");

    let data;
    try {
      data = JSON.parse(match[1]);
    } catch (error) {
      assert.fail(`assets/data.js does not contain valid JSON: ${error.message}`);
    }

    for (const key of ["projects", "journals", "sources", "thresholds", "syllabi", "destinationGuides", "admissionRequirements", "universityCompetitions"]) {
      assert.ok(Array.isArray(data[key]), `static payload is missing the ${key} array`);
    }
    assert.ok(data.routeMap && typeof data.routeMap === "object" && !Array.isArray(data.routeMap), "static payload is missing routeMap");
    return data;
  })();
  return staticDataPromise;
}

async function readRoute(route, data) {
  const file = data.routeMap[route];
  assert.ok(file, `routeMap is missing ${route}`);
  return readFile(path.join(outputDirectory, file), "utf8");
}

test("static payload has valid IDs, references and route records", async () => {
  const data = await loadStaticData();
  const projectIds = new Set(data.projects.map((project) => project.id));
  const sourceIds = new Set(data.sources.map((source) => source.id));

  assert.ok(data.projects.length > 0, "static payload has no project records");
  assert.ok(data.journals.length > 0, "static payload has no journal records");
  assert.ok(data.destinationGuides.length > 0, "static payload has no destination guides");
  assert.ok(data.admissionRequirements.length > 0, "static payload has no admission requirement records");
  assert.ok(data.universityCompetitions.length >= 39, "static payload must retain the current 39-record university-competition baseline");
  assertUniqueIds(data.projects, "projects");
  assertUniqueIds(data.journals, "journals");
  assertUniqueIds(data.sources, "sources");
  assertUniqueIds(data.thresholds, "thresholds");
  assertUniqueIds(data.syllabi, "syllabi");
  assertUniqueIds(data.destinationGuides, "destination guides");
  assertUniqueIds(data.admissionRequirements, "admission requirements");
  assertUniqueIds(data.universityCompetitions, "university competitions");
  assert.equal(new Set(data.projects.map((project) => project.slug)).size, data.projects.length, "project slugs must be unique");
  assert.equal(new Set(data.journals.map((journal) => journal.slug)).size, data.journals.length, "journal slugs must be unique");
  assert.equal(new Set([...data.projects.map((record) => record.id), ...data.journals.map((record) => record.id)]).size, data.projects.length + data.journals.length, "projects and journals must not share IDs");
  assert.equal(new Set(data.syllabi.map((syllabus) => syllabus.slug)).size, data.syllabi.length, "syllabus slugs must be unique");
  assert.equal(new Set(data.destinationGuides.map((guide) => guide.slug)).size, data.destinationGuides.length, "destination slugs must be unique");

  for (const project of data.projects) {
    assert.ok(trackRoutes[project.track], `${project.id} has unknown track ${project.track}`);
    for (const sourceId of project.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${project.id} refers to missing source ${sourceId}`);
    }
    for (const relatedId of project.relatedIds ?? []) {
      assert.ok(projectIds.has(relatedId), `${project.id} refers to missing related project ${relatedId}`);
    }
  }

  for (const journal of data.journals) {
    assert.ok(journal.topicTags.length > 0, `${journal.id} has no mathematics topic`);
    assert.ok(journal.articleTypes.length > 0, `${journal.id} has no article type`);
    assert.ok(journal.facts.length > 0 && journal.sections.length > 0, `${journal.id} has no detailed content`);
    assert.ok(journal.sourceIds.length > 0 && journal.links.length > 0, `${journal.id} has no official submission source`);
    for (const sourceId of journal.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${journal.id} refers to missing source ${sourceId}`);
    }
    for (const projectId of journal.relatedProjectIds ?? []) {
      assert.ok(projectIds.has(projectId), `${journal.id} refers to missing related project ${projectId}`);
    }
    for (const link of journal.links) {
      assert.match(link.url, /^https:\/\//i, `${journal.id} contains a non-HTTPS official link: ${link.url}`);
    }
  }

  for (const threshold of data.thresholds) {
    assert.ok(projectIds.has(threshold.projectId), `${threshold.id} refers to missing project ${threshold.projectId}`);
    for (const sourceId of threshold.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${threshold.id} refers to missing source ${sourceId}`);
    }
  }

  for (const syllabus of data.syllabi) {
    assert.ok(projectIds.has(syllabus.projectId), `${syllabus.id} refers to missing project ${syllabus.projectId}`);
    assert.ok(syllabus.sources.length > 0, `${syllabus.id} has no official source`);
    for (const source of syllabus.sources) {
      assert.match(source.url, /^https:\/\//i, `${syllabus.id} contains a non-HTTPS source: ${source.url}`);
    }
  }

  for (const guide of data.destinationGuides) {
    for (const sourceId of guide.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${guide.id} refers to missing source ${sourceId}`);
    }
    for (const projectId of guide.relatedProjectIds) {
      assert.ok(projectIds.has(projectId), `${guide.id} refers to missing related project ${projectId}`);
    }
  }

  for (const requirement of data.admissionRequirements) {
    assert.ok(requirement.institution?.zh && requirement.institution?.en, `${requirement.id} has no bilingual institution name`);
    assert.ok(requirement.countryCode, `${requirement.id} has no country code`);
    assert.ok(Array.isArray(requirement.programs) && requirement.programs.length > 0, `${requirement.id} has no programme`);
    assert.ok(requirement.applicableCycle?.zh && requirement.applicableCycle?.en, `${requirement.id} has no bilingual applicable cycle`);
    assert.ok(requirement.sourceIds.length > 0, `${requirement.id} has no source`);
    assert.ok(requirement.projectIds.length > 0 || requirement.examLabels?.length > 0, `${requirement.id} identifies neither a project nor an examination`);
    for (const projectId of requirement.projectIds) {
      assert.ok(projectIds.has(projectId), `${requirement.id} refers to missing project ${projectId}`);
    }
    for (const sourceId of requirement.sourceIds) {
      assert.ok(sourceIds.has(sourceId), `${requirement.id} refers to missing source ${sourceId}`);
      const source = data.sources.find((record) => record.id === sourceId);
      assert.notEqual(source?.kind, "secondary-archive", `${requirement.id} relies on a secondary archive instead of an official source`);
    }
  }

  for (const source of data.sources) {
    assert.match(source.url, /^https:\/\//i, `${source.id} contains a non-HTTPS URL: ${source.url}`);
  }

  assert.deepEqual(data.routeFiles, data.routeMap, "routeFiles and routeMap must describe the same export");
  const routeEntries = Object.entries(data.routeMap);
  assert.equal(new Set(routeEntries.map(([route]) => route)).size, routeEntries.length, "routeMap contains duplicate routes");
  assert.equal(new Set(routeEntries.map(([, file]) => file)).size, routeEntries.length, "routeMap maps multiple routes to the same HTML file");
  for (const [route, file] of routeEntries) {
    assert.match(route, /^\//, `routeMap contains a non-rooted route: ${route}`);
    assert.match(file, /^[^/\\]+\.html$/i, `routeMap target must be a flat HTML filename: ${file}`);
  }
});

test("routeMap exactly matches the flat HTML export", async () => {
  const output = await stat(outputDirectory);
  assert.ok(output.isDirectory(), `missing static export directory: ${outputDirectory}`);
  const data = await loadStaticData();

  for (const route of requiredCoreRoutes) {
    assert.ok(data.routeMap[route], `routeMap is missing required route ${route}`);
  }

  for (const asset of requiredAssets) {
    const assetStats = await stat(path.join(outputDirectory, asset));
    assert.ok(assetStats.isFile(), `missing static asset: ${asset}`);
    assert.ok(assetStats.size > 0, `static asset is empty: ${asset}`);
  }

  const actualFiles = (await htmlInventory()).map((file) => path.basename(file)).sort();
  const expectedFiles = Object.values(data.routeMap).sort();
  assert.deepEqual(actualFiles, expectedFiles, "flat HTML inventory does not exactly match routeMap");

  const nestedHtml = [];
  async function inspectDirectory(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await inspectDirectory(fullPath);
      if (entry.isFile() && entry.name.endsWith(".html") && directory !== outputDirectory) {
        nestedHtml.push(path.relative(outputDirectory, fullPath));
      }
    }
  }
  await inspectDirectory(outputDirectory);
  assert.deepEqual(nestedHtml, [], `HTML pages must be flat; nested pages found: ${nestedHtml.join(", ")}`);
});

test("does not publish internal maintenance material", async () => {
  const data = await loadStaticData();
  assert.equal(data.routeMap["/maintenance"], undefined, "maintenance route is public");
  const gitignore = await readFile(path.resolve(testDirectory, "../.gitignore"), "utf8");
  assert.match(gitignore, /^\/private\/$/m, "private maintenance files are no longer ignored");
  for (const name of ["maintenance.html", "mathpath-update-maintenance-prompt.md"]) {
    const exposed = await stat(path.join(outputDirectory, name)).catch(() => null);
    assert.equal(exposed, null, `${name} is present in the public export`);
  }
  for (const file of await htmlInventory()) {
    const html = await readFile(file, "utf8");
    assert.doesNotMatch(html, /href=["'][^"']*maintenance(?:\.html)?["']/i, `${path.basename(file)} links to internal maintenance material`);
    assert.doesNotMatch(visibleText(html), /维护说明|Annual Maintenance Sources|maintenance entry points/i, `${path.basename(file)} exposes maintenance instructions`);
  }
  for (const asset of requiredAssets) {
    const contents = await readFile(path.join(outputDirectory, asset), "utf8");
    assert.doesNotMatch(contents, /mathpath-update-maintenance-prompt|内部资料：国际升学数学资料库全站更新维护 Prompt|private[\\/]mathpath/i, `${asset} exposes internal maintenance material`);
  }
  for (const route of ["/", "/calendar", "/sources", "/official-sites"]) {
    assert.doesNotMatch(await readRoute(route, data), /data-academic-integrity=/, `${route} has an out-of-context integrity notice`);
  }
});

test("exports private feedback controls and the engagement runtime", async () => {
  for (const file of await htmlInventory()) {
    const html = await readFile(file, "utf8");
    const turnstileConfigured = /data-turnstile-site-key=/.test(html);
    assert.equal((html.match(/data-static-component=["']engagement["']/g) ?? []).length, 1, `${path.basename(file)} has the wrong engagement module count`);
    assert.match(html, /data-engagement-helpful/, `${path.basename(file)} has no helpful control`);
    assert.doesNotMatch(html, /data-engagement-(?:site-visits|page-views)/, `${path.basename(file)} exposes private traffic totals`);
    assert.match(html, /data-feedback-dialog/, `${path.basename(file)} has no feedback dialog`);
    assert.match(html, /src=["']assets\/engagement\.js["']/, `${path.basename(file)} does not load engagement.js`);
    assert.doesNotMatch(html, /data-feedback-list|\/(?:v1\/admin|admin\/api)|管理后台登录/, `${path.basename(file)} exposes an administrator control`);
    if (turnstileConfigured) {
      assert.match(html, /data-turnstile-like/, `${path.basename(file)} has no like challenge container`);
      assert.match(html, /data-turnstile-feedback/, `${path.basename(file)} has no feedback challenge container`);
      const turnstileScripts = attributeValues(html, "script", "src").filter((src) => src.includes("challenges.cloudflare.com/turnstile/"));
      assert.ok(turnstileScripts.length <= 1, `${path.basename(file)} repeats the Turnstile script`);
      if (turnstileScripts.length) {
        assert.equal(turnstileScripts[0], "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", `${path.basename(file)} uses the wrong Turnstile script`);
      }
    } else {
      assert.doesNotMatch(html, /data-turnstile-(?:like|feedback)|challenges\.cloudflare\.com\/turnstile/, `${path.basename(file)} loads Turnstile without a site key`);
    }
  }
  const runtime = await readFile(path.join(outputDirectory, "assets/engagement.js"), "utf8");
  assert.match(runtime, /\/v1\/view/);
  assert.match(runtime, /\/v1\/like/);
  assert.match(runtime, /\/v1\/feedback/);
  assert.match(runtime, /freshTurnstileToken\("like", likeTurnstileContainer\)/, "likes do not request a fresh Turnstile token");
  assert.match(runtime, /freshTurnstileToken\("feedback", feedbackTurnstileContainer\)/, "feedback does not request a fresh Turnstile token");
  assert.match(runtime, /turnstileToken/, "Turnstile tokens are not sent to the Worker");
  assert.match(runtime, /appearance: "interaction-only"/, "Turnstile challenges are not interaction-only");
  assert.match(runtime, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit/, "the static runtime cannot load the official Turnstile API");
  assert.match(runtime, /if \(!turnstileSiteKey\) return null;/, "the static runtime does not keep Turnstile optional");
  assert.doesNotMatch(runtime, /\/(?:v1\/(?:admin|feedbacks|messages)|admin\/api)/, "browser runtime contains an administrator endpoint");
});

test("every project, syllabus and destination has its own complete detail page", async () => {
  const data = await loadStaticData();
  const projectById = new Map(data.projects.map((project) => [project.id, project]));

  for (const project of data.projects) {
    const route = projectRoute(project);
    assert.equal(data.routeMap[route], projectFile(project), `${project.id} has the wrong static filename`);
    const html = await readRoute(route, data);
    const text = visibleText(html);
    assert.match(html, new RegExp(`data-static-route=["']${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`), `${project.id} has the wrong route marker`);
    assert.ok(text.includes(project.title.zh), `${projectFile(project)} is missing its Chinese title`);
    assert.ok(text.includes(project.title.en), `${projectFile(project)} is missing its English title`);
    assert.ok(text.includes("来源") && text.includes("Sources"), `${projectFile(project)} is missing bilingual source labeling`);
    assert.ok(text.includes("最后更新") && text.includes("Last updated"), `${projectFile(project)} is missing its page-level update stamp`);
    const integrityContext = project.track === "competition"
      ? "competition"
      : project.track === "modeling" || project.track === "research"
        ? "research"
        : project.track === "summer"
          ? "application"
          : "exam";
    assert.equal((html.match(/data-academic-integrity=/g) ?? []).length, 1, `${projectFile(project)} has the wrong integrity-notice count`);
    assert.match(html, new RegExp(`data-academic-integrity=["']${integrityContext}["']`), `${projectFile(project)} has the wrong integrity context`);
  }

  for (const syllabus of data.syllabi) {
    const project = projectById.get(syllabus.projectId);
    assert.ok(project, `${syllabus.id} has no project`);
    const route = `/syllabi/${syllabus.slug}`;
    const expectedFile = `${trackPrefixes[project.track]}-${syllabus.slug}-syllabus.html`;
    assert.equal(data.routeMap[route], expectedFile, `${syllabus.id} has the wrong static filename`);
    const html = await readRoute(route, data);
    const text = visibleText(html);
    assert.ok(text.includes(syllabus.title.zh), `${expectedFile} is missing its Chinese title`);
    assert.ok(text.includes(syllabus.title.en), `${expectedFile} is missing its English title`);
    assert.ok(text.includes("中文译文说明") && text.includes("Chinese translation"), `${expectedFile} is missing its translation note`);
    assert.ok(text.includes("官方原文与版本") && text.includes("Official sources and versions"), `${expectedFile} is missing official versioned sources`);
    assert.match(html, /href=["']https:\/\//i, `${expectedFile} has no direct HTTPS official source`);
    assert.doesNotMatch(html, /data-academic-integrity=/, `${expectedFile} duplicates the parent project integrity notice`);
  }

  for (const guide of data.destinationGuides) {
    const route = `/destinations/${guide.slug}`;
    const expectedFile = `destination-${guide.slug}.html`;
    assert.equal(data.routeMap[route], expectedFile, `${guide.id} has the wrong static filename`);
    const html = await readRoute(route, data);
    const text = visibleText(html);
    assert.ok(text.includes(guide.title.zh), `${expectedFile} is missing its Chinese title`);
    assert.ok(text.includes(guide.title.en), `${expectedFile} is missing its English title`);
    assert.ok(text.includes("仅数学相关要求") && text.includes("Mathematics only"), `${expectedFile} does not declare its mathematics-only scope`);
    assert.ok(text.includes("官方来源") && text.includes("Official sources"), `${expectedFile} is missing official sources`);
    assert.ok(text.includes("最后更新") && text.includes("Last updated"), `${expectedFile} is missing its page-level update stamp`);
  }
});

test("exports a separate journal directory and one complete page per publication", async () => {
  const data = await loadStaticData();
  assert.equal(data.journals.length, 16);
  assert.equal(data.routeMap["/journals"], "journals.html");

  const directoryHtml = await readRoute("/journals", data);
  assert.match(directoryHtml, /data-static-component=["']journal-directory["']/);
  assert.match(directoryHtml, /data-journal-filter=["']topic["']/);
  assert.match(directoryHtml, /data-journal-filter=["']review["']/);
  assert.match(directoryHtml, /data-journal-filter=["']fee["']/);
  assert.equal((directoryHtml.match(/data-academic-integrity=/g) ?? []).length, 1, "journals.html has the wrong integrity-notice count");
  assert.match(directoryHtml, /data-academic-integrity=["']publication["']/);
  assert.match(directoryHtml, /href=["']research-integrity\.html["']/);
  const declaredJournalIds = directoryHtml.match(/data-journal-ids=["']([^"']*)["']/)?.[1].split("|").filter(Boolean) ?? [];
  assert.deepEqual(new Set(declaredJournalIds), new Set(data.journals.map((journal) => journal.id)));

  for (const journal of data.journals) {
    const route = journalRoute(journal);
    const file = journalFile(journal);
    assert.equal(data.routeMap[route], file, `${journal.id} has the wrong journal filename`);
    assert.match(directoryHtml, new RegExp(`href=["']${file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`), `${file} is not linked from journals.html`);
    const html = await readRoute(route, data);
    const text = visibleText(html);
    assert.ok(text.includes(journal.title.zh) && text.includes(journal.title.en), `${file} is missing its bilingual title`);
    for (const label of ["主要主题与稿件类型", "投稿要点", "学生资格", "评审方式", "费用", "版权与许可", "官方投稿入口与材料", "最后更新"]) {
      assert.ok(text.includes(label), `${file} is missing ${label}`);
    }
    assert.match(html, /href=["']https:\/\//i, `${file} has no direct official HTTPS link`);
    assert.doesNotMatch(text, /加入规划器|Add to planner|研究节点|Research milestones/, `${file} is incorrectly treated as a project`);
    assert.equal((html.match(/data-academic-integrity=/g) ?? []).length, 1, `${file} has the wrong integrity-notice count`);
    assert.match(html, /data-academic-integrity=["']publication["']/, `${file} has the wrong integrity context`);
    assert.match(html, /href=["']research-integrity\.html["']/, `${file} does not link to the integrity guide`);
  }

  const mathematicalReflectionsHtml = await readRoute("/journals/mathematical-reflections", data);
  assert.match(mathematicalReflectionsHtml, /2026 年第 3 期题解/);
  assert.match(mathematicalReflectionsHtml, /mr_3_2026_solutions\.pdf/);

  const projectIds = new Set(data.projects.map((project) => project.id));
  for (const journal of data.journals) assert.ok(!projectIds.has(journal.id), `${journal.id} leaked into projects`);
  const runtime = await readFile(path.join(outputDirectory, "assets/static-site.js"), "utf8");
  assert.match(runtime, /data-static-component="journal-directory"/, "static journal filters are not initialized");
});

test("exports the mathematical research skills guide and its official materials", async () => {
  const data = await loadStaticData();
  assert.equal(data.routeMap["/research/skills"], "research-skills.html");
  const directoryHtml = await readRoute("/research", data);
  assert.match(directoryHtml, /href=["']research-skills\.html["']/);
  assert.equal((directoryHtml.match(/data-academic-integrity=/g) ?? []).length, 1, "research.html has the wrong integrity-notice count");
  assert.match(directoryHtml, /data-academic-integrity=["']research["']/);
  assert.match(directoryHtml, /href=["']research-integrity\.html["']/);

  const html = await readRoute("/research/skills", data);
  const text = visibleText(html);
  for (const label of ["掌握程度怎么判断", "项目可用", "从基础到独立项目的学习路径", "Python", "MATLAB", "LaTeX", "Git", "Zotero"]) {
    assert.ok(text.includes(label), `research-skills.html is missing ${label}`);
  }
  for (const host of ["docs.python.org", "matlabacademy.mathworks.com", "www.overleaf.com", "git-scm.com", "www.zotero.org"]) {
    assert.match(html, new RegExp(`href=["']https:\\/\\/${host.replaceAll(".", "\\.")}`), `missing official material from ${host}`);
  }
});

test("curricula, admissions tests and competitions remain separate", async () => {
  const data = await loadStaticData();
  const projectById = new Map(data.projects.map((project) => [project.id, project]));

  for (const track of ["competition", "curriculum", "assessment"]) {
    assert.ok(data.projects.some((project) => project.track === track), `no ${track} records were exported`);
  }

  for (const [route, track] of [
    ["/competitions", "competition"],
    ["/courses", "curriculum"],
    ["/assessments", "assessment"],
  ]) {
    const html = await readRoute(route, data);
    assert.match(html, new RegExp(`data-static-component=["']catalog["'][^>]*data-fixed-track=["']${track}["']`), `${route} is not fixed to ${track}`);
    const cardTracks = attributeValues(html, "article", "data-track");
    assert.ok(cardTracks.length > 0, `${route} has no project cards`);
    assert.ok(cardTracks.every((value) => value === track), `${route} contains a project card from another category`);
  }

  for (const [route, track] of [
    ["/competition-results", "competition"],
    ["/course-scores", "curriculum"],
    ["/assessment-scores", "assessment"],
    ["/competition-calendar", "competition"],
    ["/course-calendar", "curriculum"],
    ["/assessment-calendar", "assessment"],
    ["/competition-compare", "competition"],
    ["/course-compare", "curriculum"],
    ["/assessment-compare", "assessment"],
  ]) {
    const html = await readRoute(route, data);
    assert.match(html, new RegExp(`data-fixed-track=["']${track}["']`), `${route} is not fixed to ${track}`);
    for (const projectId of attributeValues(html, "tr", "data-project-id")) {
      assert.equal(projectById.get(projectId)?.track, track, `${route} contains ${projectId} from another category`);
    }
    for (const projectId of attributeValues(html, "article", "data-project-id")) {
      assert.equal(projectById.get(projectId)?.track, track, `${route} contains ${projectId} from another category`);
    }
  }

  const coursesText = visibleText(await readRoute("/courses", data));
  for (const label of ["College Board AP", "Cambridge International", "Pearson Edexcel International", "IB Mathematics"]) {
    assert.ok(coursesText.includes(label), `courses.html is missing curriculum system ${label}`);
  }

  for (const [id, file] of [
    ["ap-calculus-ab", "course-ap-calculus-ab.html"],
    ["ap-calculus-bc", "course-ap-calculus-bc.html"],
  ]) {
    const project = projectById.get(id);
    assert.ok(project, `missing ${id} curriculum record`);
    assert.equal(project.track, "curriculum", `${id} must be classified as a curriculum, not an admissions test`);
    assert.equal(data.routeMap[projectRoute(project)], file, `${id} must export as ${file}`);
    const pageText = visibleText(await readFile(path.join(outputDirectory, file), "utf8"));
    assert.ok(pageText.includes(project.title.zh) && pageText.includes(project.title.en), `${file} is missing its bilingual title`);
  }

  assert.ok(!Object.values(data.routeMap).includes("assessment-ap-calculus.html"), "obsolete combined AP assessment page is still exported");
});

test("keeps the static modeling catalog scoped to formal competitions", async () => {
  const data = await loadStaticData();
  const html = await readFile(path.join(outputDirectory, "modeling.html"), "utf8");
  const catalogTag = html.match(/<div\b[^>]*data-static-component=["']catalog["'][^>]*>/i)?.[0] ?? "";
  const scopedIds = catalogTag.match(/data-project-ids=["']([^"']*)["']/i)?.[1].split("|").filter(Boolean) ?? [];
  const expectedIds = data.projects
    .filter((project) => project.track === "modeling" && project.eligibilityTags.includes("modeling-competition"))
    .map((project) => project.id);
  assert.deepEqual(new Set(scopedIds), new Set(expectedIds));
  for (const project of data.projects.filter((item) => item.track === "modeling" && item.eligibilityTags.includes("modeling-open-project"))) {
    assert.ok(!scopedIds.includes(project.id), `${project.id} is inside the formal competition catalog scope`);
  }
  const runtime = await readFile(path.join(outputDirectory, "assets/static-site.js"), "utf8");
  assert.match(runtime, /root\.dataset\.projectIds/, "static catalog runtime ignores its declared project scope");
});

test("exports the IMMC 2026 final results and official Outstanding work", async () => {
  const data = await loadStaticData();
  const html = await readRoute("/modeling/immc", data);
  const text = visibleText(html);
  for (const value of [
    "2026 最终：68 队",
    "2026 final: 68 teams",
    "Team 2026033",
    "Shanghai High School International Division",
    "9（13.2%）",
    "9 (13.2%)",
  ]) assert.ok(text.includes(value), `modeling-immc.html is missing ${value}`);
  for (const href of [
    "https://immchallenge.org/wp-content/uploads/2026/08/2026_IMMC_Results.pdf",
    "https://immchallenge.org/wp-content/uploads/2026/08/2026033_Paper.pdf",
    "https://immchallenge.org/wp-content/uploads/2026/08/2026033_Presentation.pdf",
  ]) assert.ok(attributeValues(html, "a", "href").includes(href), `modeling-immc.html is missing ${href}`);
  assert.doesNotMatch(text, /待峰会公布|Pending summit/, "modeling-immc.html still presents the 2026 result as pending");
});

test("calendar exports begin in 2026 and archive elapsed milestones by end date", async () => {
  const data = await loadStaticData();
  const calendarStart = "2026-01-01";
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  const today = localDateString();
  const routeTracks = new Map([
    ["/calendar", null],
    ["/competition-calendar", "competition"],
    ["/course-calendar", "curriculum"],
    ["/assessment-calendar", "assessment"],
  ]);
  const entriesByRoute = new Map();
  let confirmedHistoryCount = 0;

  for (const [route, fixedTrack] of routeTracks) {
    const html = await readRoute(route, data);
    const rootTag = html.match(/<div\b[^>]*data-static-component=(["'])calendar\1[^>]*>/i)?.[0];
    assert.ok(rootTag, `${route} has no calendar root`);
    assert.equal(tagAttribute(rootTag, "data-calendar-start"), calendarStart, `${route} has the wrong calendar start`);
    assert.equal(tagAttribute(rootTag, "data-fixed-track") ?? "", fixedTrack ?? "", `${route} has the wrong fixed track`);
    assert.match(html, /data-calendar-group=["']current["']/, `${route} has no current calendar group`);
    assert.match(html, /data-calendar-group=["']history["']/, `${route} has no history calendar group`);
    for (const period of ["current", "history", "all"]) {
      assert.match(html, new RegExp(`data-calendar-period-link=["']${period}["']`), `${route} has no ${period} period link`);
    }
    assert.match(html, /href=["'][^"']*\?period=history#calendar-results["']/, `${route} has no direct history link`);

    const entries = calendarEntries(html);
    assert.ok(entries.length > 0, `${route} has no calendar entries`);
    const actualKeys = entries.map((entry) => `${entry.projectId}:${entry.eventId}`).sort();
    assert.equal(new Set(actualKeys).size, actualKeys.length, `${route} repeats a calendar event`);

    const expected = data.projects
      .filter((project) => !fixedTrack || project.track === fixedTrack)
      .flatMap((project) => project.dates
        .filter((record) => record.date >= calendarStart)
        .map((record) => ({ project, record })));
    const expectedKeys = expected.map(({ project, record }) => `${project.id}:${record.id}`).sort();
    assert.deepEqual(actualKeys, expectedKeys, `${route} does not contain exactly the calendar records from 2026 onward`);

    for (const entry of entries) {
      assert.ok(entry.eventId && entry.projectId && entry.track && entry.status && entry.date && entry.endDate, `${route} has an incomplete calendar entry`);
      if (fixedTrack) assert.equal(entry.track, fixedTrack, `${route} contains ${entry.track}`);
      if (isoDate.test(entry.date)) {
        assert.ok(entry.date >= calendarStart, `${route} shows a pre-2026 date: ${entry.date}`);
        assert.match(entry.endDate, isoDate, `${route} has an invalid end date for ${entry.eventId}`);
        assert.equal(entry.period, entry.endDate < today ? "history" : "current", `${route} files ${entry.projectId}:${entry.eventId} under the wrong period`);
      } else {
        assert.equal(entry.period, "current", `${route} archives undated milestone ${entry.projectId}:${entry.eventId}`);
      }
      if (entry.period === "history" && entry.status === "confirmed") confirmedHistoryCount += 1;
    }
    entriesByRoute.set(route, entries);
  }

  const mainEntries = entriesByRoute.get("/calendar");
  for (const [route, track] of [...routeTracks].slice(1)) {
    const expected = mainEntries.filter((entry) => entry.track === track).map((entry) => `${entry.projectId}:${entry.eventId}:${entry.period}`).sort();
    const actual = entriesByRoute.get(route).map((entry) => `${entry.projectId}:${entry.eventId}:${entry.period}`).sort();
    assert.deepEqual(actual, expected, `${route} differs from the ${track} subset of /calendar`);
  }
  assert.ok(confirmedHistoryCount > 0, "past confirmed milestones are not archived under History");
});

test("destination directory covers the requested study systems and links every guide", async () => {
  const data = await loadStaticData();
  const requiredDestinationIds = [
    "destination-us-undergraduate-mathematics",
    "destination-uk-undergraduate-mathematics",
    "destination-singapore-undergraduate-mathematics",
    "destination-australia",
    "destination-canada-undergraduate-mathematics",
    "destination-europe-other",
  ];
  const guideIds = new Set(data.destinationGuides.map((guide) => guide.id));
  for (const id of requiredDestinationIds) {
    assert.ok(guideIds.has(id), `destination data is missing ${id}`);
  }

  const directoryHtml = await readRoute("/destinations", data);
  const directoryText = visibleText(directoryHtml);
  for (const guide of data.destinationGuides) {
    assert.ok(directoryText.includes(guide.shortTitle.zh), `destinations.html is missing ${guide.shortTitle.zh}`);
    assert.ok(directoryText.includes(guide.shortTitle.en), `destinations.html is missing ${guide.shortTitle.en}`);
    const file = `destination-${guide.slug}.html`;
    assert.ok(attributeValues(directoryHtml, "a", "href").some((href) => referencePath(href) === file), `destinations.html does not link to ${file}`);
  }
});

test("exports the school and programme requirement directory and reverse links", async () => {
  const data = await loadStaticData();
  const html = await readRoute("/universities", data);
  const text = visibleText(html);

  assert.ok(text.includes("学校与专业考试要求") && text.includes("School and programme test requirements"), "universities.html is not bilingual");
  assert.match(html, /data-static-component=["']admission-requirements["']/, "universities.html has no static requirement directory marker");
  for (const filter of ["q", "country", "project", "type"]) {
    assert.match(html, new RegExp(`data-filter=["']${filter}["']`), `universities.html is missing the ${filter} filter`);
  }

  const requirementIds = attributeValues(html, "article", "data-requirement-id");
  assert.deepEqual(new Set(requirementIds), new Set(data.admissionRequirements.map((record) => record.id)), "universities.html does not render every requirement exactly once");
  assert.equal(requirementIds.length, data.admissionRequirements.length, "universities.html repeats a requirement record");
  for (const pattern of [/University of Cambridge/, /G100/, /TMUA/, /STEP/, /London School of Economics and Political Science/, /L101/, /Massachusetts Institute of Technology/, /SAT/, /ACT/, /University of Waterloo/, /Euclid/, /CSMC/]) {
    assert.match(html, pattern, `universities.html is missing ${pattern}`);
  }

  for (const [projectId, expectedFile] of [
    ["tmua", "assessment-tmua.html"],
    ["step", "assessment-step.html"],
    ["sat", "assessment-sat.html"],
    ["act", "assessment-act.html"],
    ["euclid", "competition-euclid.html"],
    ["csmc", "competition-csmc.html"],
  ]) {
    const projectHtml = await readFile(path.join(outputDirectory, expectedFile), "utf8");
    assert.match(projectHtml, /id=["']admission-requirements["']/, `${expectedFile} is missing its school-requirement section`);
    assert.ok(
      attributeValues(projectHtml, "a", "href").includes(`universities.html?project=${projectId}`),
      `${expectedFile} does not link to universities.html?project=${projectId}`,
    );
  }
});

test("uses only portable relative assets and contains no framework payload", async () => {
  for (const file of await htmlInventory()) {
    const html = await readFile(file, "utf8");
    const label = path.basename(file);

    assert.doesNotMatch(html, /\b(?:href|src)\s*=\s*["']\/assets(?:\/|["'])/i, `${label} uses an absolute /assets path`);
    assert.doesNotMatch(html, /\bmodulepreload\b/i, `${label} contains modulepreload`);
    assert.doesNotMatch(html, /\/_next\//i, `${label} contains a Next.js asset path`);
    assert.doesNotMatch(html, /(?:self\.)?__next_f|text\/x-component|next-router-state-tree|data-flight|\/_rsc(?:[/?"'])/i, `${label} contains an RSC marker`);

    for (const asset of requiredAssets) {
      assert.ok(
        html.includes(`"${asset}"`) || html.includes(`'${asset}'`),
        `${label} does not reference ${asset} with a relative path`,
      );
    }

    const resourceReferences = [
      ...attributeValues(html, "link", "href"),
      ...attributeValues(html, "script", "src"),
    ].filter((reference) => /\.(?:css|js)(?:[?#].*)?$/i.test(reference));

    assert.ok(resourceReferences.length >= requiredAssets.length, `${label} does not reference its CSS and JavaScript assets`);
    for (const reference of resourceReferences) {
      if (isExternalReference(reference)) {
        assert.equal(reference, "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", `${label} uses an unapproved external runtime asset: ${reference}`);
        assert.match(html, /data-turnstile-site-key=/, `${label} loads Turnstile without a site key`);
        continue;
      }
      assert.ok(!reference.startsWith("/"), `${label} uses a root-absolute runtime asset: ${reference}`);
      const target = resolveLocalReference(file, reference);
      const targetStats = await stat(target).catch(() => null);
      assert.ok(targetStats?.isFile(), `${label} references a missing asset: ${reference}`);
    }
  }

  for (const asset of requiredAssets.filter((name) => /\.(?:css|js)$/i.test(name))) {
    const contents = await readFile(path.join(outputDirectory, asset), "utf8");
    assert.doesNotMatch(contents, /url\(\s*["']?\/assets\//i, `${asset} contains an absolute CSS asset URL`);
    assert.doesNotMatch(contents, /(?:fetch|import)\s*\(\s*["']\/assets\//i, `${asset} contains an absolute JavaScript asset URL`);
  }
});

test("every internal link resolves inside the export", async () => {
  let checkedLinks = 0;

  for (const file of await htmlInventory()) {
    const html = await readFile(file, "utf8");
    for (const reference of attributeValues(html, "a", "href")) {
      if (!reference || reference.startsWith("#") || isExternalReference(reference)) continue;

      assert.ok(!reference.startsWith("/"), `${path.basename(file)} uses a root-absolute site link: ${reference}`);
      const target = resolveLocalReference(file, reference);
      const targetStats = await stat(target).catch(() => null);
      assert.ok(targetStats?.isFile(), `${path.basename(file)} links to a missing page or asset: ${reference}`);
      checkedLinks += 1;
    }
  }

  const data = await loadStaticData();
  assert.ok(checkedLinks >= Object.keys(data.routeMap).length, `site navigation is unexpectedly sparse: checked ${checkedLinks} internal links`);
});

test("keeps bilingual content without a redundant bilingual label and includes official learning-material links", async () => {
  const data = await loadStaticData();
  const homeText = visibleText(await readRoute("/", data));
  assert.ok(homeText.includes("数学竞赛") && homeText.includes("国际课程"), "home page is missing the Chinese database scope");
  assert.match(homeText, /Mathematics competitions/i, "home page is missing its English mathematics scope");
  assert.match(homeText, /international curricula/i, "home page is missing its English curriculum scope");
  assert.doesNotMatch(homeText, /中英双语|Bilingual/, "home page shows a redundant bilingual label");

  for (const project of data.projects) {
    const file = path.join(outputDirectory, projectFile(project));
    const html = await readFile(file, "utf8");
    const text = visibleText(html);
    const resourceIds = attributeValues(html, "article", "data-resource-id");
    assert.match(html, /id=["']official-learning-resources["']/, `${projectFile(project)} is missing its official-resource section`);
    assert.ok(resourceIds.length > 0, `${projectFile(project)} has no official learning-resource entry`);
    assert.equal(new Set(resourceIds).size, resourceIds.length, `${projectFile(project)} repeats an official learning-resource entry`);
    assert.ok(text.includes("打开官方资料") && text.includes("Open official resource"), `${projectFile(project)} is missing the bilingual official-resource link label`);
    assert.match(html, /href=["']https:\/\//i, `${projectFile(project)} has no direct HTTPS resource link`);
  }

  const resourcesHtml = await readRoute("/resources", data);
  const resourceIds = attributeValues(resourcesHtml, "article", "data-resource-id");
  assert.ok(resourceIds.length > 0, "resources.html has no official resource records");
  assert.equal(new Set(resourceIds).size, resourceIds.length, "resources.html contains duplicate resource records");
});

test("adds clearly sourced public video resources to relevant project pages", async () => {
  const data = await loadStaticData();
  const uniqueVideoIds = new Set();
  let coveredProjects = 0;

  for (const project of data.projects) {
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    const videoIds = attributeValues(html, "article", "data-video-resource-id");
    if (videoIds.length === 0) continue;

    coveredProjects += 1;
    const text = visibleText(html);
    assert.match(html, /id=["']video-resources["']/, `${projectFile(project)} has video cards without a section`);
    assert.ok(text.includes("公开视频课程与讲解") && text.includes("Public video courses and walkthroughs"), `${projectFile(project)} is missing the bilingual video heading`);
    assert.ok(text.includes("打开视频资源") && text.includes("Open video resource"), `${projectFile(project)} is missing the bilingual video link label`);
    assert.equal(new Set(videoIds).size, videoIds.length, `${projectFile(project)} repeats a video resource`);
    for (const id of videoIds) uniqueVideoIds.add(id);

    const cards = html.match(/<article\b[^>]*data-video-resource-id=["'][^"']+["'][^>]*>[\s\S]*?<\/article>/gi) ?? [];
    assert.equal(cards.length, videoIds.length, `${projectFile(project)} has malformed video cards`);
    for (const card of cards) {
      assert.match(card, /video-authority-(?:official|official-partner|third-party)/, `${projectFile(project)} has an unlabelled video source`);
      assert.match(card, /href=["']https:\/\//i, `${projectFile(project)} has a non-HTTPS video link`);
    }
  }

  assert.ok(coveredProjects >= 20, `video resources cover too few projects: ${coveredProjects}`);
  assert.ok(uniqueVideoIds.size >= 10, `too few distinct video resources: ${uniqueVideoIds.size}`);
});

test("adds sourced books and references without unauthorised downloads", async () => {
  const data = await loadStaticData();
  const uniqueBookIds = new Set();
  let coveredProjects = 0;

  for (const project of data.projects) {
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    const bookIds = attributeValues(html, "article", "data-book-resource-id");
    if (bookIds.length === 0) continue;

    coveredProjects += 1;
    const text = visibleText(html);
    assert.match(html, /id=["']books["']/, `${projectFile(project)} has book cards without a section`);
    assert.ok(text.includes("教材、习题集与参考书") && text.includes("Textbooks, problem books and references"), `${projectFile(project)} is missing the bilingual books heading`);
    assert.ok(text.includes("查看图书信息") && text.includes("View book details"), `${projectFile(project)} is missing the bilingual book link label`);
    assert.ok(text.includes("出版社／提供方") && text.includes("Publisher / provider"), `${projectFile(project)} is missing publisher information`);
    assert.equal(new Set(bookIds).size, bookIds.length, `${projectFile(project)} repeats a book resource`);
    for (const id of bookIds) uniqueBookIds.add(id);

    const cards = html.match(/<article\b[^>]*data-book-resource-id=["'][^"']+["'][^>]*>[\s\S]*?<\/article>/gi) ?? [];
    assert.equal(cards.length, bookIds.length, `${projectFile(project)} has malformed book cards`);
    for (const card of cards) {
      assert.match(card, /book-authority-(?:official|official-endorsed|third-party)/, `${projectFile(project)} has an unlabelled book source`);
      assert.match(card, /href=["']https:\/\//i, `${projectFile(project)} has a non-HTTPS book link`);
      assert.doesNotMatch(card, /(?:drive\.google|dropbox|pan\.baidu|mega\.nz)/i, `${projectFile(project)} contains an unapproved book download`);
    }
  }

  assert.ok(coveredProjects >= 20, `book resources cover too few projects: ${coveredProjects}`);
  assert.ok(uniqueBookIds.size >= 20, `too few distinct book resources: ${uniqueBookIds.size}`);
});

test("exports the official-site directory with only HTTPS official sources", async () => {
  const data = await loadStaticData();
  assert.equal(data.routeMap["/official-sites"], "official-sites.html");
  const html = await readRoute("/official-sites", data);
  const text = visibleText(html);
  assert.ok(text.includes("官网导航") && text.includes("Official website directory"), "official-sites.html is not bilingual");
  assert.match(html, /data-static-route=["']\/official-sites["']/, "official-sites.html has the wrong static route marker");
  assert.doesNotMatch(html, /data-source-kind=["']secondary-archive["']/, "official-sites.html includes a third-party source");
  const entryIds = attributeValues(html, "article", "data-entry-id");
  assert.ok(entryIds.length > 70, "official-sites.html contains too few project or university entries");
  assert.equal(new Set(entryIds).size, entryIds.length, "official-sites.html contains duplicate entry IDs");
  const sourceTags = [...html.matchAll(/<a\b[^>]*data-source-kind=["'][^"']+["'][^>]*>/gi)].map((match) => match[0]);
  assert.ok(sourceTags.length > 100, "official-sites.html contains too few official links");
  for (const tag of sourceTags) {
    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? "";
    assert.match(href, /^https:\/\//i, `official-sites.html contains a non-HTTPS official link: ${href}`);
  }
  for (const sourceId of ["sat-home", "act-home", "himcm-home", "aksf-home", "uk-ucas-how-to-apply", "sg-nus-gaokao-2026"]) {
    assert.match(html, new RegExp(`data-source-id=["']${sourceId}["']`), `official-sites.html is missing ${sourceId}`);
  }
});

test("exports the university-competition directory, its official links and static filters", async () => {
  const data = await loadStaticData();
  assert.equal(data.routeMap["/university-competitions"], "university-competitions.html");
  const html = await readRoute("/university-competitions", data);
  const text = visibleText(html);
  assert.match(html, /data-static-route=["']\/university-competitions["']/);
  assert.match(html, /data-static-component=["']university-competition-directory["']/);
  assert.match(text, /大学.*数学竞赛/);
  assert.match(text, /University-organized mathematics competitions/i);
  for (const filter of ["query", "region", "organizer", "status", "china"]) {
    assert.match(html, new RegExp(`data-university-competition-filter=["']${filter}["']`), `university-competitions.html is missing the ${filter} filter`);
  }
  for (const attribute of ["data-search", "data-region", "data-organizer-type", "data-status", "data-china-access"]) {
    assert.match(html, new RegExp(`${attribute}=["'][^"']+["']`), `university-competitions.html has no row with ${attribute}`);
  }
  for (const pattern of [
    /HMMT/,
    /student[- ]run|student organi[sz]ation|学生(?:组织|运营|主办)/i,
    /CEMC/,
    /University of Waterloo|滑铁卢大学/i,
    /MPFG/,
    /Advantage Testing Foundation/i,
    /举办地|场地|host(?:ed)? (?:at|on)|venue|not (?:organized|run) by MIT/i,
    /最后更新/,
    /Last updated/i,
  ]) assert.match(text, pattern, `university-competitions.html is missing ${pattern}`);
  for (const href of [
    "https://www.hmmt.org/",
    "https://cemc.uwaterloo.ca/",
  ]) {
    assert.ok(attributeValues(html, "a", "href").some((value) => value.startsWith(href)), `university-competitions.html is missing official link ${href}`);
  }

  const competitionDirectory = await readRoute("/competitions", data);
  assert.match(
    competitionDirectory,
    /<a\b(?=[^>]*data-competition-category=["']university-organized["'])(?=[^>]*href=["']university-competitions\.html["'])[^>]*>/,
    "competitions.html has no university-organized category card linking to the university-competition directory",
  );
  const home = await readRoute("/", data);
  const homeEntryList = home.match(/<nav\b[^>]*class=["'][^"']*home-entry-list[^"']*["'][^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(homeEntryList, "index.html has no primary-entry list");
  assert.doesNotMatch(homeEntryList, /href=["']university-competitions\.html["']/, "the university-competition directory must not be a top-level home entry");
  const runtime = await readFile(path.join(outputDirectory, "assets/static-site.js"), "utf8");
  assert.match(runtime, /function initUniversityCompetitionDirectory\(\)/);
  assert.match(runtime, /data-university-competition-filter/);
  assert.match(runtime, /data-university-competition-empty/);
  assert.match(runtime, /data-university-competition-reset/);
});

test("exports a complete, resolvable static detail page for every university competition", async () => {
  const data = await loadStaticData();
  const directory = await readRoute("/university-competitions", data);
  const directoryLinks = new Set(attributeValues(directory, "a", "href").map(referencePath));

  for (const record of data.universityCompetitions) {
    assert.match(record.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `unsafe university-competition ID: ${record.id}`);
    assert.ok(record.title?.zh && record.title?.en, `${record.id} has no bilingual project-specific title`);
    assert.ok(record.organizer?.zh && record.organizer?.en, `${record.id} has no bilingual organizer relationship`);
    assert.ok(record.chinaPath?.zh && record.chinaPath?.en, `${record.id} has no bilingual China access path`);
    assert.match(record.lastVerified ?? "", /^\d{4}-\d{2}-\d{2}$/, `${record.id} has an invalid last-verification date`);
    assert.ok(record.officialLinks?.length > 0, `${record.id} has no official links`);
    for (const link of record.officialLinks) assert.match(link.url, /^https:\/\//i, `${record.id} has a non-HTTPS official link: ${link.url}`);

    const route = `/university-competitions/${record.id}`;
    const file = `university-competition-${record.id}.html`;
    assert.equal(data.routeMap[route], file, `${route} has the wrong static filename`);
    assert.ok(directoryLinks.has(file), `university-competitions.html does not link to ${file}`);

    const html = await readRoute(route, data);
    const text = visibleText(html);
    const hrefs = new Set(attributeValues(html, "a", "href"));
    assert.match(html, new RegExp(`data-static-route=["']${route}["']`), `${file} has the wrong route marker`);
    assert.match(html, /data-university-competition-detail/, `${file} has no detail marker`);
    assert.match(html, new RegExp(`data-university-competition-id=["']${record.id}["']`), `${file} identifies the wrong record`);
    assert.match(html, new RegExp(`data-last-verified=["']${record.lastVerified}["']`), `${file} has the wrong verification date`);
    assert.ok(text.includes(record.title.zh) && text.includes(record.title.en), `${file} is missing its bilingual project-specific title`);
    assert.ok(text.includes(record.organizer.zh) && text.includes(record.organizer.en), `${file} is missing its organizer relationship`);
    assert.ok(text.includes(record.chinaPath.zh) && text.includes(record.chinaPath.en), `${file} is missing its China access path`);
    assert.match(text, /主办关系/, `${file} is missing the Chinese organizer label`);
    assert.match(text, /Organizer relationship/i, `${file} is missing the English organizer label`);
    assert.match(text, /中国学生路径/, `${file} is missing the Chinese China-access label`);
    assert.match(text, /Access from China/i, `${file} is missing the English China-access label`);
    assert.match(text, /最后核验/, `${file} is missing the Chinese verification label`);
    assert.match(text, /Last verified/i, `${file} is missing the English verification label`);
    assert.ok(record.officialLinks.some((link) => hrefs.has(link.url)), `${file} has no direct HTTPS official link`);
  }
});

test("indexes translated syllabi and mathematics past-paper sources without rehosting files", async () => {
  const data = await loadStaticData();
  const syllabiHtml = await readRoute("/syllabi", data);
  const syllabusIds = attributeValues(syllabiHtml, "article", "data-syllabus-id");
  assert.deepEqual(new Set(syllabusIds), new Set(data.syllabi.map((syllabus) => syllabus.id)), "syllabi.html does not index every syllabus exactly once");

  const formalTracks = new Set(["competition", "curriculum", "assessment"]);
  const syllabusProjectIds = new Set(data.syllabi.map((syllabus) => syllabus.projectId));
  for (const project of data.projects.filter((project) => formalTracks.has(project.track))) {
    assert.ok(syllabusProjectIds.has(project.id), `${project.id} has no syllabus or published-scope record`);
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    assert.match(html, /id=["']official-syllabus["']/, `${projectFile(project)} is missing its official-syllabus section`);
    assert.match(html, /href=["'](?:competition|course|assessment)-[^"']+-syllabus\.html["']/, `${projectFile(project)} does not link to its syllabus page`);
  }

  const papersHtml = await readRoute("/past-papers", data);
  const papersText = visibleText(papersHtml);
  const archiveIds = attributeValues(papersHtml, "article", "data-past-paper-id");
  assert.ok(archiveIds.length > 0, "past-papers.html has no paper or sample records");
  assert.equal(new Set(archiveIds).size, archiveIds.length, "past-papers.html contains duplicate records");
  assert.ok(papersText.includes("官方来源") && papersText.includes("Official source"), "past-papers.html is missing official-source labels");
  assert.ok(papersText.includes("第三方整理") && papersText.includes("Third-party index"), "past-papers.html is missing secondary-source labels");
  assert.match(papersText, /本站只链接公开来源|does not copy or host test files/i, "past-papers.html is missing the copyright and linking notice");

  for (const project of data.projects.filter((project) => (
    ["competition", "curriculum", "assessment"].includes(project.track)
    || (project.track === "modeling" && project.eligibilityTags.includes("modeling-competition"))
  ))) {
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    const text = visibleText(html);
    assert.match(html, /id=["']past-papers["']/, `${projectFile(project)} is missing its past-paper section`);
    assert.match(text, /版权与链接说明|Copyright and linking notice/i, `${projectFile(project)} is missing its copyright notice`);
  }

  for (const project of data.projects.filter((project) => project.track === "modeling" && project.eligibilityTags.includes("modeling-open-project"))) {
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    assert.doesNotMatch(html, /id=["']past-papers["']/, `${projectFile(project)} incorrectly presents an open project as a past-paper competition`);
  }

  for (const link of attributeValues(papersHtml, "a", "href").filter(isExternalReference)) {
    assert.match(link, /^https:\/\//i, `past-papers.html contains a non-HTTPS source: ${link}`);
    assert.doesNotMatch(link, /(?:drive\.google|dropbox|pan\.baidu|mega\.nz)/i, `past-papers.html contains an unapproved file-share link: ${link}`);
  }
});

test("assessment directory is mathematics-only and pages contain no meaningless filler", async () => {
  const data = await loadStaticData();
  const assessmentText = visibleText(await readRoute("/assessments", data));
  assert.ok(assessmentText.includes("数学入学考试与定量测评") && assessmentText.includes("Mathematics admissions tests and quantitative assessments"), "assessments.html is missing its mathematics-only scope");
  assert.doesNotMatch(assessmentText, /TOEFL|IELTS|语言考试|language tests/i, "assessments.html mixes language tests into mathematics assessments");

  const forbidden = /这是一个演示型规则引擎|正式版本可接入|Your site is taking shape|codex-preview|Lorem ipsum|仅供演示|演示数据|占位内容|待补充|敬请期待|Coming soon/i;
  for (const file of await htmlInventory()) {
    const text = visibleText(await readFile(file, "utf8"));
    assert.doesNotMatch(text, forbidden, `${path.basename(file)} contains demo, placeholder or launch-soon filler`);
  }
});
