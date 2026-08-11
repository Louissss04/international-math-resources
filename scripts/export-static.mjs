import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const DIST_CLIENT = path.join(ROOT, "dist", "client");
const DIST_SERVER = path.join(ROOT, "dist", "server", "index.js");
const OUTPUT_PARENT = path.join(ROOT, "outputs");
const OUTPUT = path.join(OUTPUT_PARENT, "mathpath-static");
const ASSETS = path.join(OUTPUT, "assets");

const TOP_LEVEL_ROUTES = [
  "/",
  "/programs",
  "/courses-tests",
  "/catalog",
  "/competitions",
  "/university-competitions",
  "/modeling",
  "/research",
  "/journals",
  "/summer",
  "/courses",
  "/assessments",
  "/destinations",
  "/official-sites",
  "/syllabi",
  "/past-papers",
  "/archive",
  "/competition-results",
  "/course-scores",
  "/assessment-scores",
  "/calendar",
  "/competition-calendar",
  "/course-calendar",
  "/assessment-calendar",
  "/compare",
  "/competition-compare",
  "/course-compare",
  "/assessment-compare",
  "/planner",
  "/sources",
  "/resources",
  "/universities",
];

const TRACK_ROUTE = {
  competition: "competitions",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  curriculum: "courses",
  assessment: "assessments",
};

const TRACK_FILE_PREFIX = {
  competition: "competition",
  modeling: "modeling",
  research: "research",
  summer: "summer",
  curriculum: "course",
  assessment: "assessment",
};

function assertSafeOutputPath() {
  const expected = path.resolve(OUTPUT_PARENT, "mathpath-static");
  if (path.resolve(OUTPUT) !== expected || path.dirname(expected) !== path.resolve(OUTPUT_PARENT)) {
    throw new Error(`Refusing to replace unexpected output directory: ${OUTPUT}`);
  }
}

function plainData(value) {
  return JSON.parse(JSON.stringify(value));
}

async function loadSiteData() {
  const vite = await createViteServer({
    root: ROOT,
    configFile: false,
    appType: "custom",
    logLevel: "error",
    resolve: { alias: { "@": ROOT } },
    server: { middlewareMode: true },
  });

  try {
    const dataModule = await vite.ssrLoadModule("/app/data/index.ts");
    const data = {
      projects: plainData(dataModule.allProjects ?? []),
      journals: plainData(dataModule.allJournals ?? []),
      sources: plainData(dataModule.allSources ?? []),
      thresholds: plainData(dataModule.allThresholds ?? []),
      syllabi: plainData(dataModule.allOfficialSyllabi ?? []),
      destinationGuides: plainData(dataModule.destinationGuides ?? []),
      universityPolicies: plainData(dataModule.universityPolicies ?? []),
      admissionRequirements: plainData(dataModule.admissionRequirements ?? []),
    };
    if (!data.projects.length) throw new Error("app/data/index.ts returned no project records.");
    return data;
  } finally {
    await vite.close();
  }
}

function projectRoute(project) {
  const base = TRACK_ROUTE[project.track];
  if (!base) throw new Error(`Unknown track '${project.track}' for ${project.id}.`);
  return `/${base}/${project.slug}`;
}

function journalRoute(journal) {
  return `/journals/${journal.slug}`;
}

function syllabusRoute(syllabus) {
  return `/syllabi/${syllabus.slug}`;
}

function destinationRoute(guide) {
  return `/destinations/${guide.slug}`;
}

function routeFileName(route, projects, syllabi, destinationGuides, journals) {
  const clean = route === "/" ? "/" : route.replace(/\/+$/, "");
  if (clean === "/") return "index.html";

  const project = projects.find((item) => projectRoute(item) === clean);
  if (project) return `${TRACK_FILE_PREFIX[project.track]}-${project.slug}.html`;

  const journal = journals.find((item) => journalRoute(item) === clean);
  if (journal) return `journal-${journal.slug}.html`;

  const syllabus = syllabi.find((item) => syllabusRoute(item) === clean);
  if (syllabus) {
    const syllabusProject = projects.find((item) => item.id === syllabus.projectId);
    if (!syllabusProject) throw new Error(`Unknown project '${syllabus.projectId}' for syllabus '${syllabus.id}'.`);
    return `${TRACK_FILE_PREFIX[syllabusProject.track]}-${syllabus.slug}-syllabus.html`;
  }

  const destination = destinationGuides.find((item) => destinationRoute(item) === clean);
  if (destination) return `destination-${destination.slug}.html`;

  const top = clean.slice(1);
  if (TOP_LEVEL_ROUTES.includes(clean)) return `${top}.html`;
  throw new Error(`No static filename is defined for route '${route}'.`);
}

function buildRouteMap(projects, syllabi, destinationGuides, journals) {
  const routes = [...TOP_LEVEL_ROUTES, ...projects.map(projectRoute), ...syllabi.map(syllabusRoute), ...destinationGuides.map(destinationRoute), ...journals.map(journalRoute)];
  const entries = routes.map((route) => [route, routeFileName(route, projects, syllabi, destinationGuides, journals)]);
  return { routes, map: new Map(entries) };
}

function splitReference(reference) {
  const match = String(reference).match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  return {
    pathname: match?.[1] ?? reference,
    search: match?.[2] ?? "",
    hash: match?.[3] ?? "",
  };
}

function rewriteReference(reference, routeMap) {
  if (!reference || reference.startsWith("#")) return reference;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) {
    try {
      const url = new URL(reference);
      if (!/^(?:localhost|127\.0\.0\.1|static\.mathpath\.local)$/i.test(url.hostname)) return reference;
      const file = routeMap.get(url.pathname.replace(/\/+$/, "") || "/");
      if (file) return `${file}${url.search}${url.hash}`;
      return `assets/${url.pathname.replace(/^\/+/, "")}${url.search}${url.hash}`;
    } catch {
      return reference;
    }
  }

  if (!reference.startsWith("/")) return reference;
  const { pathname, search, hash } = splitReference(reference);
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const file = routeMap.get(normalized);
  if (file) return `${file}${search}${hash}`;

  if (/^\/assets\/[^/]+\.css$/i.test(pathname)) return `assets/site.css${search}${hash}`;
  return `assets/${pathname.replace(/^\/+/, "")}${search}${hash}`;
}

function rewriteSrcset(srcset, routeMap) {
  return srcset.split(",").map((candidate) => {
    const match = candidate.trim().match(/^(\S+)(\s+.+)?$/);
    if (!match) return candidate.trim();
    return `${rewriteReference(match[1], routeMap)}${match[2] ?? ""}`;
  }).join(", ");
}

function transformHtml(html, route, routeMap) {
  let output = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*\/>/gi, "")
    .replace(/<link\b(?=[^>]*\brel=(?:"modulepreload"|'modulepreload'))[^>]*>/gi, "")
    .replace(/\sdata-rsc-css-href=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/\sdata-precedence=(?:"[^"]*"|'[^']*')/gi, "");

  output = output.replace(/\b(href|src|action)=("([^"]*)"|'([^']*)')/gi, (whole, name, quoted, doubleValue, singleValue) => {
    const value = doubleValue ?? singleValue ?? "";
    const rewritten = rewriteReference(value.replaceAll("&amp;", "&"), routeMap).replaceAll("&", "&amp;");
    const quote = quoted[0];
    return `${name}=${quote}${rewritten}${quote}`;
  });

  output = output.replace(/\bsrcset=("([^"]*)"|'([^']*)')/gi, (whole, quoted, doubleValue, singleValue) => {
    const value = doubleValue ?? singleValue ?? "";
    const rewritten = rewriteSrcset(value.replaceAll("&amp;", "&"), routeMap).replaceAll("&", "&amp;");
    const quote = quoted[0];
    return `srcset=${quote}${rewritten}${quote}`;
  });

  output = output.replace(/\bcontent=("([^"]*)"|'([^']*)')/gi, (whole, quoted, doubleValue, singleValue) => {
    const value = doubleValue ?? singleValue ?? "";
    if (!/^https?:\/\/(?:localhost|127\.0\.0\.1|static\.mathpath\.local)(?::\d+)?\//i.test(value)) return whole;
    const rewritten = rewriteReference(value, routeMap).replaceAll("&", "&amp;");
    const quote = quoted[0];
    return `content=${quote}${rewritten}${quote}`;
  });

  output = output.replace(/<html\b([^>]*)>/i, (_whole, attributes) => {
    const withoutOldRoute = attributes.replace(/\sdata-static-route=(?:"[^"]*"|'[^']*')/i, "");
    return `<html${withoutOldRoute} data-static-route="${route}">`;
  });

  const runtime = '<script src="assets/data.js" defer></script><script src="assets/static-site.js" defer></script><script src="assets/engagement.js" defer></script>';
  if (/<\/body\s*>/i.test(output)) return output.replace(/<\/body\s*>/i, `${runtime}</body>`);
  return `${output}${runtime}`;
}

async function renderRoutes(routes, routeMap, projects, syllabi, destinationGuides, journals) {
  const workerUrl = pathToFileURL(DIST_SERVER);
  workerUrl.searchParams.set("static-export", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  for (const route of routes) {
    const response = await worker.fetch(
      new Request(`http://static.mathpath.local${route}`, { headers: { accept: "text/html" } }),
      { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
      { waitUntil() {}, passThroughOnException() {} },
    );
    if (!response.ok) throw new Error(`Rendering ${route} failed with HTTP ${response.status}.`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("text/html")) throw new Error(`Rendering ${route} did not return HTML.`);
    const html = transformHtml(await response.text(), route, routeMap);
    await writeFile(path.join(OUTPUT, routeFileName(route, projects, syllabi, destinationGuides, journals)), html, "utf8");
  }
}

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

async function copyClientAssets() {
  const files = await listFiles(DIST_CLIENT);
  const cssFiles = files.filter((file) => /^assets[\\/].+\.css$/i.test(file)).sort();
  if (!cssFiles.length) throw new Error("No built CSS was found in dist/client/assets.");

  const css = (await Promise.all(cssFiles.map((file) => readFile(path.join(DIST_CLIENT, file), "utf8")))).join("\n");
  await writeFile(path.join(ASSETS, "site.css"), css, "utf8");

  for (const relative of files) {
    if (/^(?:\.vite|assets[\\/].+\.(?:css|js|map)$)/i.test(relative)) continue;
    if (/^(?:_headers|\.assetsignore)$/i.test(relative)) continue;
    const source = path.join(DIST_CLIENT, relative);
    const targetRelative = relative.replace(/^assets[\\/]/i, "");
    const target = path.join(ASSETS, targetRelative);
    await mkdir(path.dirname(target), { recursive: true });
    await cp(source, target);
  }
}

// Kept only as a readable fallback; the maintained browser runtime is copied from public/static-site.js.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function browserRuntime() {
  "use strict";

  const DATA = window.MATHPATH_DATA || { projects: [], sources: [], thresholds: [], universityPolicies: [], admissionRequirements: [] };
  const LANGUAGE_KEY = "mathpath-language";
  const PLANNER_KEY = "mathpath-planner-v2";
  const TRACK_PREFIX = { competition: "competition", modeling: "modeling", research: "research", summer: "summer", curriculum: "course", assessment: "assessment" };
  const STATUS_LABELS = {
    confirmed: ["已确认", "Confirmed"],
    historical: ["历史", "Historical"],
    pending: ["待公布", "Pending"],
    conflict: ["冲突", "Conflict"],
  };
  const COST_LABELS = {
    free: { zh: "免费", en: "Free" },
    low: { zh: "较低", en: "Low" },
    medium: { zh: "中等", en: "Medium" },
    high: { zh: "较高", en: "High" },
    varies: { zh: "因情况而异", en: "Varies" },
  };
  const GRADE_LABELS = {
    "Grade 8 or below": { zh: "八年级及以下", en: "Grade 8 or below" }, "Grade 9 or below": { zh: "九年级及以下", en: "Grade 9 or below" },
    "Grade 10 or below": { zh: "十年级及以下", en: "Grade 10 or below" }, "Grade 11 or below": { zh: "十一年级及以下", en: "Grade 11 or below" },
    "Grade 12 or below": { zh: "十二年级及以下", en: "Grade 12 or below" }, "Final year of secondary school": { zh: "中学毕业年级", en: "Final year of secondary school" },
    "Year 13 or below": { zh: "Year 13 及以下", en: "Year 13 or below" }, "Northern Ireland Year 14 or below": { zh: "北爱尔兰 Year 14 及以下", en: "Northern Ireland Year 14 or below" },
    "S6 or below": { zh: "苏格兰 S6 及以下", en: "S6 or below" }, "Younger students permitted": { zh: "低年级也可参加", en: "Younger students permitted" },
    "High school": { zh: "高中", en: "High school" }, "Secondary school": { zh: "中学", en: "Secondary school" },
    "grade-9": { zh: "九年级", en: "Grade 9" }, "grade-10": { zh: "十年级", en: "Grade 10" }, "grade-11": { zh: "十一年级", en: "Grade 11" }, "grade-12": { zh: "十二年级", en: "Grade 12" },
    "middle-school": { zh: "初中", en: "Middle school" }, "high-school": { zh: "高中", en: "High school" }, "pre-college": { zh: "大学入学前", en: "Pre-college" },
    "recent-graduate": { zh: "应届高中毕业生", en: "Recent high-school graduate" }, "university-applicant": { zh: "大学申请者", en: "University applicant" },
    "university-offer-holder": { zh: "已获大学录取者", en: "University offer holder" },
  };
  const REGION_LABELS = {
    "Approved overseas schools": { zh: "获准海外学校", en: "Approved overseas schools" }, Canada: { zh: "加拿大", en: "Canada" }, China: { zh: "中国", en: "China" },
    Global: { zh: "全球", en: "Global" }, "Mainland China": { zh: "中国大陆", en: "Mainland China" }, "United Kingdom": { zh: "英国", en: "United Kingdom" },
    "United States": { zh: "美国", en: "United States" }, canada: { zh: "加拿大", en: "Canada" }, china: { zh: "中国", en: "China" }, global: { zh: "全球", en: "Global" },
    "greater-china": { zh: "中国大陆及港澳台", en: "Greater China" }, online: { zh: "线上", en: "Online" }, uk: { zh: "英国", en: "United Kingdom" },
    "united-states": { zh: "美国", en: "United States" }, us: { zh: "美国", en: "United States" },
  };
  const memoryStorage = {};

  function select(selector, root) { return (root || document).querySelector(selector); }
  function selectAll(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
  function localised(value) {
    const text = value || { zh: "", en: "" };
    return `<span class="lang-zh">${escapeHtml(text.zh)}</span><span class="lang-en">${escapeHtml(text.en)}</span>`;
  }
  function localisedList(values, labels) {
    const mapped = (values || []).map((value) => labels[value] || { zh: value, en: value });
    return localised({ zh: mapped.map((item) => item.zh).join("、"), en: mapped.map((item) => item.en).join(", ") });
  }
  function statusBadge(status) {
    const labels = STATUS_LABELS[status] || [status, status];
    return `<span class="status-badge status-${escapeHtml(status)}"><span class="lang-zh">${escapeHtml(labels[0])}</span><span class="lang-en">${escapeHtml(labels[1])}</span></span>`;
  }
  function staticProjectHref(project) {
    return `${TRACK_PREFIX[project.track] || project.track}-${project.slug}.html`;
  }
  function projectById(id) { return DATA.projects.find((project) => project.id === id); }
  function sourceById(id) { return DATA.sources.find((source) => source.id === id); }
  function sourceLinks(ids) {
    if (!Array.isArray(ids) || !ids.length) return "";
    const sourceRecords = ids.map(sourceById).filter(Boolean);
    const sourceKindLabels = {
      official: { zh: "官网", en: "Official" },
      "official-data": { zh: "数据", en: "Data" },
      "official-archive": { zh: "档案", en: "Archive" },
      "secondary-archive": { zh: "汇编", en: "Secondary" },
    };
    return `<span class="source-citations">${sourceRecords.map((source) => {
      const label = localised(sourceKindLabels[source.kind] || { zh: "来源", en: "Source" });
      return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer" title="${escapeHtml(source.label && (source.label.zh || source.label.en))}">${label}</a>`;
    }).join("")}</span>`;
  }
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch { return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch { memoryStorage[key] = value; }
  }
  function saveFile(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  function csvCell(value) { return `"${String(value == null ? "" : value).replaceAll('"', '""')}"`; }
  function today() {
    const value = new Date();
    value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
    return value.toISOString().slice(0, 10);
  }
  function nextDay(date) {
    const value = new Date(`${date}T00:00:00Z`);
    value.setUTCDate(value.getUTCDate() + 1);
    return value.toISOString().slice(0, 10);
  }
  function icsEscape(value) {
    return String(value == null ? "" : value).replaceAll("\\", "\\\\").replaceAll(";", "\\;").replaceAll(",", "\\,").replaceAll("\n", "\\n");
  }

  function initialiseLanguage() {
    const readLanguage = () => storageGet(LANGUAGE_KEY) === "en" ? "en" : "zh";
    const apply = (language) => {
      document.documentElement.dataset.language = language;
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
      selectAll(".language-toggle button").forEach((button) => {
        const active = language === "en" ? button.textContent.trim() === "EN" : button.textContent.trim() !== "EN";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };
    apply(readLanguage());
    selectAll(".language-toggle button").forEach((button) => button.addEventListener("click", () => {
      const language = button.textContent.trim() === "EN" ? "en" : "zh";
      storageSet(LANGUAGE_KEY, language);
      apply(language);
    }));
  }

  function initialiseMenu() {
    const button = select(".menu-toggle");
    const navigation = select("#main-navigation");
    if (!button || !navigation) return;
    button.addEventListener("click", () => {
      const open = !navigation.classList.contains("open");
      navigation.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    });
    selectAll("a", navigation).forEach((link) => link.addEventListener("click", () => {
      navigation.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    }));
  }

  function fieldByEnglishLabel(container, text) {
    return selectAll("label", container).find((label) => {
      const labelText = select(":scope > .lang-en", label);
      return labelText && labelText.textContent.trim() === text;
    });
  }

  function initialiseCatalog() {
    const filters = select(".catalog-filters");
    const grid = select(".project-grid");
    if (!filters || !grid) return;
    const cards = selectAll(".project-card", grid);
    const queryInput = select('input[type="search"]', filters);
    const trackSelect = select("select", fieldByEnglishLabel(filters, "Type"));
    const gradeSelect = select("select", fieldByEnglishLabel(filters, "Grade"));
    const regionSelect = select("select", fieldByEnglishLabel(filters, "Region"));
    const statusSelect = select("select", fieldByEnglishLabel(filters, "Data status"));
    const costSelect = select("select", fieldByEnglishLabel(filters, "Cost"));
    const toolbar = select(".result-toolbar");
    const count = select("p b", toolbar);
    const reset = select("button", toolbar);
    let empty = select(".empty-state", filters.parentElement);
    if (!empty) {
      empty = document.createElement("p");
      empty.className = "empty-state";
      empty.innerHTML = '<span class="lang-zh">没有匹配记录。</span><span class="lang-en">No matching records.</span>';
      empty.hidden = true;
      grid.after(empty);
    }

    const params = new URLSearchParams(window.location.search);
    if (queryInput && params.get("q")) queryInput.value = params.get("q");

    const apply = () => {
      const needle = (queryInput && queryInput.value || "").trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const matches = (!needle || (card.dataset.search || "").includes(needle))
          && (!trackSelect || trackSelect.value === "all" || card.dataset.track === trackSelect.value)
          && (!gradeSelect || gradeSelect.value === "all" || (card.dataset.grades || "").split("|").includes(gradeSelect.value))
          && (!regionSelect || regionSelect.value === "all" || (card.dataset.regions || "").split("|").includes(regionSelect.value))
          && (!statusSelect || statusSelect.value === "all" || card.dataset.status === statusSelect.value)
          && (!costSelect || costSelect.value === "all" || card.dataset.cost === costSelect.value);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (count) count.textContent = String(visible);
      empty.hidden = visible !== 0;
    };

    [queryInput, trackSelect, gradeSelect, regionSelect, statusSelect, costSelect].filter(Boolean).forEach((control) => {
      control.addEventListener(control.tagName === "INPUT" ? "input" : "change", apply);
    });
    if (reset) reset.addEventListener("click", () => {
      if (queryInput) queryInput.value = "";
      [trackSelect, gradeSelect, regionSelect, statusSelect, costSelect].filter(Boolean).forEach((control) => { control.value = "all"; });
      apply();
    });
    apply();
  }

  function initialiseArchive() {
    const filters = select(".archive-filters");
    const tbody = select(".archive-table tbody");
    if (!filters || !tbody) return;
    const labels = selectAll("label", filters);
    const projectSelect = select("select", labels[0]);
    const yearSelect = select("select", labels[1]);
    const queryInput = select('input[type="search"]', filters);
    const exportButton = select("button", filters);
    const count = select(".result-count b");
    const params = new URLSearchParams(window.location.search);
    if (projectSelect && params.get("project") && select(`option[value="${CSS.escape(params.get("project"))}"]`, projectSelect)) {
      projectSelect.value = params.get("project");
    }

    const visibleRecords = () => {
      const query = (queryInput && queryInput.value || "").trim().toLowerCase();
      return DATA.thresholds.filter((record) => {
        const project = projectById(record.projectId);
        const haystack = `${project ? project.shortTitle : record.projectId} ${record.year} ${record.sitting || ""} ${record.metric.zh} ${record.metric.en} ${record.value}`.toLowerCase();
        return (!projectSelect || projectSelect.value === "all" || record.projectId === projectSelect.value)
          && (!yearSelect || yearSelect.value === "all" || record.year === yearSelect.value)
          && (!query || haystack.includes(query));
      }).sort((a, b) => String(b.year).localeCompare(String(a.year)) || String(a.projectId).localeCompare(String(b.projectId)));
    };

    const render = () => {
      const records = visibleRecords();
      tbody.innerHTML = records.map((record) => {
        const project = projectById(record.projectId);
        return `<tr><td>${escapeHtml(project ? project.shortTitle : record.projectId)}</td><td>${escapeHtml(record.year)}</td><td>${escapeHtml(record.sitting || "—")}</td><td>${localised(record.metric)}${record.note ? `<small>${localised(record.note)}</small>` : ""}</td><td>${escapeHtml(record.value)}${record.maxScore ? ` / ${escapeHtml(record.maxScore)}` : ""}</td><td>${statusBadge(record.status)}${sourceLinks(record.sourceIds)}</td></tr>`;
      }).join("");
      if (count) count.textContent = String(records.length);
      if (exportButton) exportButton.disabled = records.length === 0;
    };

    [projectSelect, yearSelect].filter(Boolean).forEach((control) => control.addEventListener("change", render));
    if (queryInput) queryInput.addEventListener("input", render);
    if (exportButton) exportButton.addEventListener("click", () => {
      const rows = [["Project", "Year", "Sitting", "Metric ZH", "Metric EN", "Value", "Max score", "Status", "Sources"], ...visibleRecords().map((record) => {
        const project = projectById(record.projectId);
        return [project ? project.shortTitle : record.projectId, record.year, record.sitting || "", record.metric.zh, record.metric.en, record.value, record.maxScore || "", record.status, (record.sourceIds || []).join(" ")];
      })];
      saveFile(`\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`, "mathpath-thresholds.csv", "text/csv;charset=utf-8");
    });
    render();
  }

  function allCalendarRows() {
    return DATA.projects.flatMap((project) => (project.dates || []).map((date) => ({ ...date, project })));
  }

  function initialiseCalendar() {
    const filters = select(".calendar-filters");
    const list = select(".calendar-list");
    if (!filters || !list) return;
    const root = filters.closest('[data-static-component="calendar"]');
    const fixedTrack = root && root.dataset.fixedTrack || "";
    const calendarStart = root && root.dataset.calendarStart || "2026-01-01";
    const queryInput = select('[data-calendar-filter="query"]', filters);
    const trackSelect = select('[data-calendar-filter="track"]', filters);
    const statusSelect = select('[data-calendar-filter="status"]', filters);
    const periodLinks = selectAll("[data-calendar-period-link]", root);
    const exportButton = select("button", filters);
    const count = select(".result-count b");
    let exportRows = [];
    let period = "current";
    try {
      const requestedPeriod = new URLSearchParams(window.location.search).get("period");
      if (["current", "history", "all"].includes(requestedPeriod)) period = requestedPeriod;
    } catch {}

    const matchedRows = () => {
      const query = (queryInput && queryInput.value || "").trim().toLowerCase();
      return allCalendarRows().filter((item) => {
        const haystack = `${item.project.title.zh} ${item.project.title.en} ${item.project.shortTitle} ${item.label.zh} ${item.label.en} ${item.region ? item.region.zh : ""}`.toLowerCase();
        return item.date >= calendarStart
          && (!query || haystack.includes(query))
          && (!fixedTrack || item.project.track === fixedTrack)
          && (!trackSelect || trackSelect.value === "all" || item.project.track === trackSelect.value)
          && (!statusSelect || statusSelect.value === "all" || item.status === statusSelect.value);
      });
    };

    const rowHtml = (item, period) => {
      const haystack = `${item.project.title.zh} ${item.project.title.en} ${item.project.shortTitle} ${item.label.zh} ${item.label.en} ${item.region ? `${item.region.zh} ${item.region.en}` : ""}`.toLowerCase();
      return `<article class="calendar-row" data-event-id="${escapeHtml(item.id)}" data-project-id="${escapeHtml(item.project.id)}" data-track="${escapeHtml(item.project.track)}" data-status="${escapeHtml(item.status)}" data-date="${escapeHtml(item.date)}" data-end-date="${escapeHtml(item.endDate || item.date)}" data-calendar-period="${period}" data-search="${escapeHtml(haystack)}"><time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}${item.endDate ? ` — ${escapeHtml(item.endDate)}` : ""}<small>${escapeHtml(item.time || "")} ${escapeHtml(item.timezone || "")}</small></time><div>${statusBadge(item.status)}<h2><a href="${staticProjectHref(item.project)}">${escapeHtml(item.project.shortTitle)}</a></h2><p>${localised(item.label)}</p></div><div>${item.region ? `<p>${localised(item.region)}</p>` : ""}${item.note ? `<p>${localised(item.note)}</p>` : ""}${sourceLinks(item.sourceIds)}</div></article>`;
    };

    const groupHtml = (rows, period) => {
      if (!rows.length) return "";
      const title = period === "history" ? { zh: "历史记录（2026 年起）", en: "History from 2026" } : { zh: "当前与未来节点", en: "Current and upcoming" };
      return `<section class="calendar-group${period === "history" ? " calendar-history" : ""}" data-calendar-group="${period}"><div class="calendar-group-heading"><h2>${localised(title)}</h2><b>${rows.length}</b></div><div>${rows.map((item) => rowHtml(item, period)).join("")}</div></section>`;
    };

    const render = () => {
      const matched = matchedRows();
      const currentRows = matched.filter((item) => (item.endDate || item.date) >= today()).sort((a, b) => String(a.date).localeCompare(String(b.date)) || a.project.shortTitle.localeCompare(b.project.shortTitle, undefined, { numeric: true }));
      const historyRows = matched.filter((item) => (item.endDate || item.date) < today()).sort((a, b) => String(b.date).localeCompare(String(a.date)) || a.project.shortTitle.localeCompare(b.project.shortTitle, undefined, { numeric: true }));
      exportRows = period === "history" ? historyRows : period === "all" ? [...currentRows, ...historyRows] : currentRows;
      list.innerHTML = (period !== "history" ? groupHtml(currentRows, "current") : "")
        + (period !== "current" ? groupHtml(historyRows, "history") : "")
        + (!exportRows.length ? `<p class="empty-state" data-calendar-empty>${localised({ zh: "没有符合条件的日期。", en: "No matching dates." })}</p>` : "");
      if (count) count.textContent = String(exportRows.length);
      periodLinks.forEach((link) => {
        const linkPeriod = link.dataset.calendarPeriodLink;
        const linkCount = select("b", link);
        const value = linkPeriod === "current" ? currentRows.length : linkPeriod === "history" ? historyRows.length : currentRows.length + historyRows.length;
        if (linkCount) linkCount.textContent = String(value);
        link.classList.toggle("active", linkPeriod === period);
        if (linkPeriod === period) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      if (exportButton) exportButton.disabled = exportRows.length === 0;
    };

    [trackSelect, statusSelect].filter(Boolean).forEach((control) => control.addEventListener("change", render));
    if (queryInput) queryInput.addEventListener("input", render);
    periodLinks.forEach((link) => link.addEventListener("click", (event) => {
      const nextPeriod = link.dataset.calendarPeriodLink;
      if (!["current", "history", "all"].includes(nextPeriod)) return;
      event.preventDefault();
      period = nextPeriod;
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("period", period);
        url.hash = "calendar-results";
        window.history.replaceState({}, "", url);
      } catch {}
      render();
    }));
    if (exportButton) exportButton.addEventListener("click", () => {
      const stamp = new Date().toISOString().replaceAll(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      const events = exportRows.filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date)).map((item) => {
        const source = (item.sourceIds || []).map(sourceById).find(Boolean);
        return ["BEGIN:VEVENT", `UID:${item.project.id}-${item.id}@international-math-library`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${item.date.replaceAll("-", "")}`, `DTEND;VALUE=DATE:${nextDay(item.endDate || item.date).replaceAll("-", "")}`, `SUMMARY:${icsEscape(`${item.project.shortTitle} — ${item.label.zh}`)}`, `DESCRIPTION:${icsEscape(`${item.label.en}${item.note ? ` | ${item.note.zh}` : ""}`)}`, source ? `URL:${source.url}` : "", "END:VEVENT"].filter(Boolean).join("\r\n");
      });
      const filenames = {
        competition: "competition-calendar.ics",
        modeling: "mathematical-modeling-calendar.ics",
        research: "mathematics-research-calendar.ics",
        summer: "mathematics-summer-program-calendar.ics",
        curriculum: "mathematics-course-exam-calendar.ics",
        assessment: "admissions-test-calendar.ics",
      };
      saveFile(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Mathematics Resource Library//Calendar//ZH-EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n"), fixedTrack ? filenames[fixedTrack] || "international-mathematics-calendar.ics" : "international-mathematics-calendar.ics", "text/calendar;charset=utf-8");
    });
    render();
  }

  function initialiseCompare() {
    const picker = select(".compare-picker");
    const table = select(".compare-table table");
    if (!picker || !table) return;
    let selected = DATA.projects.slice(0, 2).map((project) => project.id);

    const renderPicker = () => {
      const legend = select("legend", picker);
      const legendHtml = legend ? legend.outerHTML : '<legend><span class="lang-zh">选择 2—4 个项目</span><span class="lang-en">Select 2–4 projects</span></legend>';
      picker.innerHTML = legendHtml + DATA.projects.map((project) => `<label><input type="checkbox" value="${escapeHtml(project.id)}" ${selected.includes(project.id) ? "checked" : ""} ${!selected.includes(project.id) && selected.length >= 4 ? "disabled" : ""}>${escapeHtml(project.shortTitle)}</label>`).join("");
      selectAll('input[type="checkbox"]', picker).forEach((input) => input.addEventListener("change", () => {
        if (input.checked && selected.length < 4) selected = [...selected, input.value];
        else if (!input.checked) selected = selected.filter((id) => id !== input.value);
        renderPicker();
        renderTable();
      }));
    };

    const renderTable = () => {
      const records = selected.map(projectById).filter(Boolean);
      const factLabels = Array.from(new Set(records.flatMap((record) => (record.facts || []).map((fact) => fact.label.en))));
      const cells = (renderer) => records.map((record) => `<td>${renderer(record)}</td>`).join("");
      table.innerHTML = `<thead><tr><th>${localised({ zh: "字段", en: "Field" })}</th>${records.map((record) => `<th><a href="${staticProjectHref(record)}">${escapeHtml(record.shortTitle)}</a>${statusBadge(record.status)}</th>`).join("")}</tr></thead><tbody>`
        + `<tr><th>${localised({ zh: "主办方", en: "Organizer" })}</th>${cells((record) => localised(record.organizer))}</tr>`
        + `<tr><th>${localised({ zh: "适用年级", en: "Grade" })}</th>${cells((record) => localisedList(record.gradeBands, GRADE_LABELS))}</tr>`
        + `<tr><th>${localised({ zh: "地区", en: "Region" })}</th>${cells((record) => localisedList(record.regions, REGION_LABELS))}</tr>`
        + `<tr><th>${localised({ zh: "费用", en: "Cost" })}</th>${cells((record) => localised(COST_LABELS[record.costBand] || { zh: record.costBand, en: record.costBand }))}</tr>`
        + `<tr><th>${localised({ zh: "适用周期", en: "Cycle" })}</th>${cells((record) => escapeHtml(record.cycle))}</tr>`
        + `<tr><th>${localised({ zh: "下一日期", en: "Next confirmed date" })}</th>${cells((record) => escapeHtml((record.dates || []).filter((date) => date.status === "confirmed" && date.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0]?.date || "—"))}</tr>`
        + factLabels.map((label) => `<tr><th>${escapeHtml(label)}</th>${cells((record) => { const fact = (record.facts || []).find((item) => item.label.en === label); return fact ? localised(fact.value) : "—"; })}</tr>`).join("")
        + "</tbody>";
    };

    renderPicker();
    renderTable();
  }

  function defaultPlannerState() {
    return { schemaVersion: 2, profiles: [{ id: "default", name: "Student 1", grade: "" }], activeProfileId: "default", items: [] };
  }
  function normalisePlanner(value) {
    const fallback = defaultPlannerState();
    if (!value || typeof value !== "object") return fallback;
    const profiles = Array.isArray(value.profiles) && value.profiles.length ? value.profiles.filter((profile) => profile && profile.id && profile.name) : fallback.profiles;
    const activeProfileId = profiles.some((profile) => profile.id === value.activeProfileId) ? value.activeProfileId : profiles[0].id;
    const items = Array.isArray(value.items) ? value.items.filter((item) => item && item.projectId).map((item) => ({ ...item, profileId: item.profileId || activeProfileId })) : [];
    return { schemaVersion: 2, profiles, activeProfileId, items };
  }
  function readPlanner() {
    try { return normalisePlanner(JSON.parse(storageGet(PLANNER_KEY) || "null")); } catch { return defaultPlannerState(); }
  }
  function writePlanner(state) {
    storageSet(PLANNER_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("mathpath-planner-updated"));
  }
  function nextConfirmedDate(project) {
    return (project.dates || []).filter((item) => item.status === "confirmed" && item.date >= today()).sort((a, b) => a.date.localeCompare(b.date))[0]?.date;
  }

  function initialiseAddToPlan() {
    const route = document.documentElement.dataset.staticRoute || "";
    const project = DATA.projects.find((item) => `/${({ competition: "competitions", modeling: "modeling", research: "research", summer: "summer", curriculum: "courses", assessment: "assessments" })[item.track]}/${item.slug}` === route);
    const button = select(".record-actions .primary-button");
    if (!project || !button) return;
    const refresh = () => {
      const saved = readPlanner().items.some((item) => item.projectId === project.id);
      button.disabled = saved;
      button.innerHTML = saved ? '<span class="lang-zh">已加入规划器</span><span class="lang-en">Added to planner</span>' : '<span class="lang-zh">加入规划器</span><span class="lang-en">Add to planner</span>';
    };
    button.addEventListener("click", () => {
      const state = readPlanner();
      if (!state.items.some((item) => item.projectId === project.id)) {
        state.items.push({ profileId: state.activeProfileId, projectId: project.id, titleZh: project.title.zh, titleEn: project.title.en, track: project.track, deadline: nextConfirmedDate(project), status: "researching", note: "", updatedAt: new Date().toISOString() });
        writePlanner(state);
      }
      refresh();
    });
    window.addEventListener("mathpath-planner-updated", refresh);
    refresh();
  }

  function initialisePlanner() {
    const workspace = select(".planner-workspace");
    if (!workspace) return;
    let state = readPlanner();
    const persist = () => { writePlanner(state); render(); };

    const render = () => {
      state = normalisePlanner(state);
      const active = state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0];
      const items = state.items.filter((item) => item.profileId === active.id);
      const available = DATA.projects.filter((project) => !items.some((item) => item.projectId === project.id));
      workspace.innerHTML = `<section class="planner-profiles"><div class="profile-current"><label>${localised({ zh: "学生档案", en: "Student profile" })}<select data-action="select-profile">${state.profiles.map((profile) => `<option value="${escapeHtml(profile.id)}" ${profile.id === active.id ? "selected" : ""}>${escapeHtml(profile.name)}${profile.grade ? ` · ${escapeHtml(profile.grade)}` : ""}</option>`).join("")}</select></label><button type="button" data-action="remove-profile" ${state.profiles.length === 1 ? "disabled" : ""}>${localised({ zh: "删除档案", en: "Delete profile" })}</button></div><div class="profile-new"><label>${localised({ zh: "姓名或编号", en: "Name or ID" })}<input data-field="new-name"></label><label>${localised({ zh: "年级", en: "Grade" })}<input data-field="new-grade"></label><button class="secondary-button" type="button" data-action="add-profile">${localised({ zh: "新增档案", en: "Add profile" })}</button></div></section>`
        + `<section class="planner-add"><label>${localised({ zh: "加入项目", en: "Add project" })}<select data-field="project"><option value="">选择 / Select</option>${available.map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.shortTitle)} — ${escapeHtml(project.title.zh)}</option>`).join("")}</select></label><button class="primary-button" type="button" data-action="add-project">${localised({ zh: "加入", en: "Add" })}</button></section>`
        + `<section class="planner-export"><p>${localised({ zh: "数据仅保存在当前浏览器。", en: "Data is stored only in this browser." })}</p><div><button type="button" data-action="export-csv" ${items.length ? "" : "disabled"}>CSV</button><button type="button" data-action="export-ics" ${items.length ? "" : "disabled"}>ICS</button><button type="button" data-action="export-json">JSON</button><button type="button" data-action="import-json">${localised({ zh: "导入 JSON", en: "Import JSON" })}</button><input data-field="import-file" hidden type="file" accept="application/json,.json"></div></section>`
        + (items.length ? `<div class="planner-items">${items.map((item) => {
          const project = projectById(item.projectId);
          return `<article data-project-id="${escapeHtml(item.projectId)}"><div><h2>${escapeHtml(item.titleZh)}<small>${escapeHtml(item.titleEn)}</small></h2>${project ? `<a href="${staticProjectHref(project)}">${localised({ zh: "查看详情", en: "View details" })}</a>` : ""}</div><label>${localised({ zh: "状态", en: "Status" })}<select data-field="status"><option value="researching" ${item.status === "researching" ? "selected" : ""}>了解中 / Considering</option><option value="preparing" ${item.status === "preparing" ? "selected" : ""}>准备中 / Preparing</option><option value="submitted" ${item.status === "submitted" ? "selected" : ""}>已提交 / Submitted</option><option value="complete" ${item.status === "complete" ? "selected" : ""}>已完成 / Complete</option></select></label><label>${localised({ zh: "截止日期", en: "Deadline" })}<input data-field="deadline" type="date" value="${escapeHtml(item.deadline || "")}"></label><label class="planner-note">${localised({ zh: "备注", en: "Note" })}<textarea data-field="note">${escapeHtml(item.note || "")}</textarea></label><button class="remove-item" type="button" data-action="remove-item">${localised({ zh: "移除", en: "Remove" })}</button></article>`;
        }).join("")}</div>` : `<p class="empty-state">${localised({ zh: "尚未添加项目。", en: "No projects added yet." })}</p>`);

      const profileSelect = select('[data-action="select-profile"]', workspace);
      profileSelect.addEventListener("change", () => { state.activeProfileId = profileSelect.value; persist(); });
      select('[data-action="add-profile"]', workspace).addEventListener("click", () => {
        const name = select('[data-field="new-name"]', workspace).value.trim();
        const grade = select('[data-field="new-grade"]', workspace).value.trim();
        if (!name) return;
        const profile = { id: `profile-${Date.now()}`, name, grade };
        state.profiles.push(profile); state.activeProfileId = profile.id; persist();
      });
      select('[data-action="remove-profile"]', workspace).addEventListener("click", () => {
        if (state.profiles.length === 1 || !window.confirm("Delete this student profile and its planner items?")) return;
        state.profiles = state.profiles.filter((profile) => profile.id !== active.id);
        state.items = state.items.filter((item) => item.profileId !== active.id);
        state.activeProfileId = state.profiles[0].id; persist();
      });
      select('[data-action="add-project"]', workspace).addEventListener("click", () => {
        const id = select('[data-field="project"]', workspace).value;
        const project = projectById(id); if (!project) return;
        state.items.push({ profileId: active.id, projectId: project.id, titleZh: project.title.zh, titleEn: project.title.en, track: project.track, deadline: nextConfirmedDate(project), status: "researching", note: "", updatedAt: new Date().toISOString() });
        persist();
      });
      selectAll(".planner-items article", workspace).forEach((article) => {
        const id = article.dataset.projectId;
        const item = state.items.find((entry) => entry.profileId === active.id && entry.projectId === id);
        if (!item) return;
        ["status", "deadline", "note"].forEach((field) => {
          const control = select(`[data-field="${field}"]`, article);
          control.addEventListener(field === "note" ? "input" : "change", () => {
            item[field] = control.value; item.updatedAt = new Date().toISOString(); writePlanner(state);
          });
        });
        select('[data-action="remove-item"]', article).addEventListener("click", () => { state.items = state.items.filter((entry) => !(entry.profileId === active.id && entry.projectId === id)); persist(); });
      });
      select('[data-action="export-json"]', workspace).addEventListener("click", () => saveFile(JSON.stringify(state, null, 2), `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.json`, "application/json;charset=utf-8"));
      select('[data-action="export-csv"]', workspace).addEventListener("click", () => {
        const rows = [["Student", "Grade", "Project", "Track", "Deadline", "Status", "Note", "Updated"], ...items.map((item) => [active.name, active.grade, item.titleEn, item.track, item.deadline || "", item.status, item.note || "", item.updatedAt])];
        saveFile(`\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}`, `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.csv`, "text/csv;charset=utf-8");
      });
      select('[data-action="export-ics"]', workspace).addEventListener("click", () => {
        const events = items.filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.deadline || "")).map((item) => ["BEGIN:VEVENT", `UID:${active.id}-${item.projectId}@mathpath`, `DTSTART;VALUE=DATE:${item.deadline.replaceAll("-", "")}`, `DTEND;VALUE=DATE:${nextDay(item.deadline).replaceAll("-", "")}`, `SUMMARY:${icsEscape(`${item.titleEn} — deadline`)}`, `DESCRIPTION:${icsEscape(item.note || "")}`, "END:VEVENT"].join("\r\n"));
        saveFile(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Math Library//Planner//ZH-EN", ...events, "END:VCALENDAR"].join("\r\n"), `math-study-planner-${active.name.replaceAll(/\s+/g, "-")}.ics`, "text/calendar;charset=utf-8");
      });
      const importInput = select('[data-field="import-file"]', workspace);
      select('[data-action="import-json"]', workspace).addEventListener("click", () => importInput.click());
      importInput.addEventListener("change", async () => {
        const file = importInput.files && importInput.files[0]; if (!file) return;
        try { state = normalisePlanner(JSON.parse(await file.text())); persist(); } catch { window.alert("Invalid planner backup."); }
      });
    };

    render();
  }

  initialiseLanguage();
  initialiseMenu();
  initialiseCatalog();
  initialiseArchive();
  initialiseCalendar();
  initialiseCompare();
  initialiseAddToPlan();
  initialisePlanner();
}

async function writeRuntimeAssets(data, routeMap) {
  const serializedRouteMap = Object.fromEntries(routeMap);
  const payload = {
    ...data,
    routeMap: serializedRouteMap,
    routeFiles: serializedRouteMap,
  };
  const json = JSON.stringify(payload).replaceAll("\u2028", "\\u2028").replaceAll("\u2029", "\\u2029");
  await writeFile(path.join(ASSETS, "data.js"), `window.MATHPATH_DATA=${json};\n`, "utf8");

  const runtimeSource = path.join(ROOT, "public", "static-site.js");
  await stat(runtimeSource);
  await cp(runtimeSource, path.join(ASSETS, "static-site.js"));
  const engagementSource = path.join(ROOT, "public", "engagement.js");
  await stat(engagementSource);
  await cp(engagementSource, path.join(ASSETS, "engagement.js"));
}

async function main() {
  assertSafeOutputPath();
  await stat(DIST_SERVER);
  await stat(DIST_CLIENT);
  const data = await loadSiteData();
  const { routes, map } = buildRouteMap(data.projects, data.syllabi, data.destinationGuides, data.journals);

  await rm(OUTPUT, { recursive: true, force: true });
  await mkdir(ASSETS, { recursive: true });
  await copyClientAssets();
  await writeRuntimeAssets(data, map);
  await renderRoutes(routes, map, data.projects, data.syllabi, data.destinationGuides, data.journals);

  console.log(`International Mathematics Resource Library static export complete: ${routes.length} HTML files`);
  console.log(path.join(OUTPUT, "index.html"));
}

await main();
