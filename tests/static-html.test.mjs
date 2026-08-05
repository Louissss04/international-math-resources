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
  "/modeling",
  "/research",
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
  "/maintenance",
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

    for (const key of ["projects", "sources", "thresholds", "syllabi", "destinationGuides", "admissionRequirements"]) {
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
  assert.ok(data.destinationGuides.length > 0, "static payload has no destination guides");
  assert.ok(data.admissionRequirements.length > 0, "static payload has no admission requirement records");
  assertUniqueIds(data.projects, "projects");
  assertUniqueIds(data.sources, "sources");
  assertUniqueIds(data.thresholds, "thresholds");
  assertUniqueIds(data.syllabi, "syllabi");
  assertUniqueIds(data.destinationGuides, "destination guides");
  assertUniqueIds(data.admissionRequirements, "admission requirements");
  assert.equal(new Set(data.projects.map((project) => project.slug)).size, data.projects.length, "project slugs must be unique");
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
    assert.match(html, /data-calendar-filter=["']period["']/, `${route} has no period filter`);

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
      assert.ok(!isExternalReference(reference), `${label} uses an external runtime asset: ${reference}`);
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

  for (const project of data.projects.filter((project) => ["competition", "modeling", "curriculum", "assessment"].includes(project.track))) {
    const html = await readFile(path.join(outputDirectory, projectFile(project)), "utf8");
    const text = visibleText(html);
    assert.match(html, /id=["']past-papers["']/, `${projectFile(project)} is missing its past-paper section`);
    assert.match(text, /版权与链接说明|Copyright and linking notice/i, `${projectFile(project)} is missing its copyright notice`);
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
