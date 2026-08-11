(function () {
  "use strict";

  var DATA = window.MATHPATH_DATA || {};
  var projects = Array.isArray(DATA.projects) ? DATA.projects : [];
  var sources = Array.isArray(DATA.sources) ? DATA.sources : [];
  var thresholds = Array.isArray(DATA.thresholds) ? DATA.thresholds : [];
  var sourceById = Object.create(null);
  var projectById = Object.create(null);
  sources.forEach(function (source) { sourceById[source.id] = source; });
  projects.forEach(function (project) { projectById[project.id] = project; });

  var trackLabels = {
    competition: { zh: "数学竞赛", en: "Mathematics competitions" },
    modeling: { zh: "数学建模", en: "Mathematical modeling" },
    research: { zh: "数学科研", en: "Mathematics research" },
    summer: { zh: "数学夏校与夏令营", en: "Mathematics summer programs" },
    curriculum: { zh: "数学课程与统考", en: "Mathematics curricula and subject exams" },
    assessment: { zh: "入学考试与测评", en: "Admissions tests and assessments" }
  };
  var trackOrder = ["competition", "modeling", "research", "summer", "curriculum", "assessment"];
  var statusLabels = {
    confirmed: { zh: "已确认", en: "Confirmed" },
    historical: { zh: "历史", en: "Historical" },
    pending: { zh: "待公布", en: "Pending" },
    conflict: { zh: "冲突", en: "Conflict" }
  };
  var costLabels = {
    free: { zh: "免费", en: "Free" },
    low: { zh: "较低", en: "Low" },
    medium: { zh: "中等", en: "Medium" },
    high: { zh: "较高", en: "High" },
    varies: { zh: "因情况而异", en: "Varies" }
  };
  var gradeLabels = {
    "Grade 8 or below": { zh: "八年级及以下", en: "Grade 8 or below" }, "Grade 9 or below": { zh: "九年级及以下", en: "Grade 9 or below" },
    "Grade 10 or below": { zh: "十年级及以下", en: "Grade 10 or below" }, "Grade 11 or below": { zh: "十一年级及以下", en: "Grade 11 or below" },
    "Grade 12 or below": { zh: "十二年级及以下", en: "Grade 12 or below" }, "Final year of secondary school": { zh: "中学毕业年级", en: "Final year of secondary school" },
    "Year 13 or below": { zh: "Year 13 及以下", en: "Year 13 or below" }, "Northern Ireland Year 14 or below": { zh: "北爱尔兰 Year 14 及以下", en: "Northern Ireland Year 14 or below" },
    "S6 or below": { zh: "苏格兰 S6 及以下", en: "S6 or below" }, "Younger students permitted": { zh: "低年级也可参加", en: "Younger students permitted" },
    "High school": { zh: "高中", en: "High school" }, "Secondary school": { zh: "中学", en: "Secondary school" },
    "grade-9": { zh: "九年级", en: "Grade 9" }, "grade-10": { zh: "十年级", en: "Grade 10" }, "grade-11": { zh: "十一年级", en: "Grade 11" }, "grade-12": { zh: "十二年级", en: "Grade 12" },
    "middle-school": { zh: "初中", en: "Middle school" }, "high-school": { zh: "高中", en: "High school" }, "pre-college": { zh: "大学入学前", en: "Pre-college" },
    "recent-graduate": { zh: "应届高中毕业生", en: "Recent high-school graduate" }, "university-applicant": { zh: "大学申请者", en: "University applicant" },
    "university-offer-holder": { zh: "已获大学录取者", en: "University offer holder" }
  };
  var regionLabels = {
    "Approved overseas schools": { zh: "获准海外学校", en: "Approved overseas schools" }, Canada: { zh: "加拿大", en: "Canada" }, China: { zh: "中国", en: "China" },
    Global: { zh: "全球", en: "Global" }, "Mainland China": { zh: "中国大陆", en: "Mainland China" }, "United Kingdom": { zh: "英国", en: "United Kingdom" },
    "United States": { zh: "美国", en: "United States" }, canada: { zh: "加拿大", en: "Canada" }, china: { zh: "中国", en: "China" }, global: { zh: "全球", en: "Global" },
    "greater-china": { zh: "中国大陆及港澳台", en: "Greater China" }, online: { zh: "线上", en: "Online" }, uk: { zh: "英国", en: "United Kingdom" },
    "united-states": { zh: "美国", en: "United States" }, us: { zh: "美国", en: "United States" }
  };

  function text(value, fallback) {
    if (value === null || value === undefined) return fallback || "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return value.zh || value.en || fallback || "";
  }

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function localized(value) {
    if (!value || typeof value !== "object") return escapeHtml(value || "");
    return '<span class="lang-zh">' + escapeHtml(value.zh || value.en || "") + '</span>' +
      '<span class="lang-en">' + escapeHtml(value.en || value.zh || "") + '</span>';
  }

  function localizedList(values, labels) {
    var mapped = (values || []).map(function (value) { return labels[value] || { zh: value, en: value }; });
    return localized({ zh: mapped.map(function (item) { return item.zh; }).join("、"), en: mapped.map(function (item) { return item.en; }).join(", ") });
  }

  function canonicalGrade(value) {
    return value === "High school" ? "high-school" : value;
  }

  function canonicalRegion(value) {
    if (value === "Canada") return "canada";
    if (value === "China") return "china";
    if (value === "Global") return "global";
    if (value === "United Kingdom") return "uk";
    if (value === "United States" || value === "united-states") return "us";
    return value;
  }

  function badge(status) {
    var label = statusLabels[status] || { zh: status || "—", en: status || "—" };
    return '<span class="status-badge status-' + escapeHtml(status || "pending") + '">' + localized(label) + '</span>';
  }

  function sourceCitations(ids) {
    if (!Array.isArray(ids) || !ids.length) return "";
    var validSources = ids.map(function (id) { return sourceById[id]; }).filter(Boolean);
    var sourceKindLabels = {
      official: { zh: "官网", en: "Official" },
      "official-data": { zh: "数据", en: "Data" },
      "official-archive": { zh: "档案", en: "Archive" },
      "secondary-archive": { zh: "汇编", en: "Secondary" }
    };
    var links = validSources.map(function (source) {
      var kind = sourceKindLabels[source.kind] || { zh: "来源", en: "Source" };
      var label = '<span class="lang-zh">' + kind.zh + '</span><span class="lang-en">' + kind.en + '</span>';
      return '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noreferrer" title="' + escapeHtml(text(source.label, source.id)) + '">' + label + '</a>';
    }).filter(Boolean).join("");
    return links ? '<span class="source-citations">' + links + '</span>' : "";
  }

  function readStored(key, fallback) {
    try {
      var value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function writeStored(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* file storage may be disabled */ }
  }

  function routeValue(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") return value.href || value.file || value.path || "";
    return "";
  }

  function routeHref(route) {
    var map = DATA.routeMap || {};
    var clean = String(route || "/").split("?")[0].replace(/\/$/, "") || "/";
    var candidates = [clean, clean.replace(/^\//, ""), clean + "/", clean.replace(/^\//, "") + "/"];
    var mapped = "";
    for (var index = 0; index < candidates.length && !mapped; index += 1) mapped = routeValue(map[candidates[index]]);
    if (mapped) return mapped;
    if (clean === "/") return "index.html";
    return clean.replace(/^\//, "").replace(/\//g, "-") + ".html";
  }

  function projectHref(project) {
    if (!project) return "#";
    var paths = {
      competition: "competitions",
      modeling: "modeling",
      research: "research",
      summer: "summer",
      curriculum: "courses",
      assessment: "assessments"
    };
    var canonical = "/" + (paths[project.track] || project.track) + "/" + project.slug;
    var map = DATA.routeMap || {};
    return routeValue(map[canonical]) || routeValue(map[project.id]) || routeValue(map[project.slug]) || routeHref(canonical);
  }

  function withQuery(href, params) {
    try {
      var url = new URL(href, window.location.href);
      Object.keys(params).forEach(function (key) {
        if (params[key] !== "" && params[key] !== null && params[key] !== undefined) url.searchParams.set(key, params[key]);
      });
      return url.href;
    } catch {
      return href;
    }
  }

  function download(content, name, mime) {
    var url = URL.createObjectURL(new Blob([content], { type: mime }));
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function csvCell(value) {
    return '"' + String(value === null || value === undefined ? "" : value).replace(/"/g, '""') + '"';
  }

  function today() {
    var value = new Date();
    value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
    return value.toISOString().slice(0, 10);
  }

  function nextDay(date) {
    var value = new Date(date + "T00:00:00Z");
    value.setUTCDate(value.getUTCDate() + 1);
    return value.toISOString().slice(0, 10);
  }

  function icsEscape(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }

  function initLanguage() {
    var language = readStored("mathpath-language", "zh") === "en" ? "en" : "zh";
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".language-toggle button"));

    function apply(next) {
      language = next === "en" ? "en" : "zh";
      document.documentElement.dataset.language = language;
      document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
      writeStored("mathpath-language", language);
      buttons.forEach(function (button) {
        var isEnglish = /\bEN\b/i.test(button.textContent || "");
        var active = isEnglish ? language === "en" : language === "zh";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      window.dispatchEvent(new CustomEvent("mathpath-language-updated", { detail: language }));
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () { apply(/\bEN\b/i.test(button.textContent || "") ? "en" : "zh"); });
    });
    apply(language);
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var navigation = document.querySelector(".main-nav");
    if (!toggle || !navigation) return;
    toggle.addEventListener("click", function () {
      var open = !navigation.classList.contains("open");
      navigation.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navigation.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        navigation.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initHomeSearch() {
    var form = document.querySelector("form.home-search");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      window.location.href = withQuery(routeHref("/catalog"), { q: input ? input.value.trim() : "" });
    });
  }

  function detectFixedTrack(filters) {
    var root = filters.closest('[data-static-component="catalog"]');
    var declaredTrack = root && root.dataset.fixedTrack || "";
    if (trackLabels[declaredTrack]) return declaredTrack;
    var hasTrackSelect = Array.prototype.some.call(filters.querySelectorAll("select"), function (select) {
      return Array.prototype.some.call(select.options, function (option) { return option.value === "competition"; });
    });
    if (hasTrackSelect) return "";
    var heading = (document.querySelector("h1") || {}).textContent || "";
    if (/数学竞赛|Mathematics competitions/i.test(heading)) return "competition";
    if (/数学建模|Mathematical modeling/i.test(heading)) return "modeling";
    if (/数学科研|Mathematics research/i.test(heading)) return "research";
    if (/夏校|Summer programs/i.test(heading)) return "summer";
    if (/课程与统考|数学课程|Curricula|subject exams/i.test(heading)) return "curriculum";
    if (/考试与测评|课程与考试|Tests and assessments|Assessments/i.test(heading)) return "assessment";
    return "";
  }

  function projectCard(project) {
    var facts = (project.facts || []).slice(0, 3).map(function (fact) {
      return "<div><dt>" + localized(fact.label) + "</dt><dd>" + localized(fact.value) + "</dd></div>";
    }).join("");
    var track = trackLabels[project.track] || { zh: project.track, en: project.track };
    return '<article class="project-card" data-project-id="' + escapeHtml(project.id) + '" data-track="' + escapeHtml(project.track) + '">' +
      '<div class="card-meta"><div class="card-tags"><span class="track-badge track-' + escapeHtml(project.track) + '">' + localized(track) + '</span>' + badge(project.status) + '</div><span>' + escapeHtml(project.cycle || "—") + "</span></div>" +
      "<h3>" + localized(project.title) + "</h3>" +
      "<p>" + localized(project.summary) + "</p>" +
      "<dl>" + facts + "</dl>" +
      '<a class="card-link" href="' + escapeHtml(projectHref(project)) + '"><span class="lang-zh">查看详情</span><span class="lang-en">View details</span></a>' +
      "</article>";
  }

  function initCatalog() {
    var filters = document.querySelector(".catalog-filters");
    if (!filters) return;
    var root = filters.closest('[data-static-component="catalog"]');
    var results = root && root.querySelector(".catalog-results");
    var toolbar = root && root.querySelector(".result-toolbar");
    if (!root || !results || !toolbar) return;
    var input = filters.querySelector('input[type="search"]');
    var selects = Array.prototype.slice.call(filters.querySelectorAll("select"));
    var trackSelect = selects.find(function (select) { return Array.prototype.some.call(select.options, function (option) { return option.value === "competition"; }); });
    var gradeSelect = selects.find(function (select) { return /年级|Grade/i.test((select.closest("label") || {}).textContent || ""); });
    var statusSelect = selects.find(function (select) { return Array.prototype.some.call(select.options, function (option) { return option.value === "confirmed"; }); });
    var costSelect = selects.find(function (select) { return Array.prototype.some.call(select.options, function (option) { return option.value === "free"; }); });
    var regionSelect = selects.find(function (select) { return /地区|Region/i.test((select.closest("label") || {}).textContent || ""); }) || selects.find(function (select) { return select !== trackSelect && select !== gradeSelect && select !== statusSelect && select !== costSelect; });
    var fixedTrack = detectFixedTrack(filters);
    var declaredProjectIds = (root.dataset.projectIds || "").split("|").filter(Boolean);
    var subset = declaredProjectIds.length
      ? projects.filter(function (project) { return declaredProjectIds.indexOf(project.id) !== -1; })
      : fixedTrack
        ? projects.filter(function (project) { return project.track === fixedTrack; })
        : projects.slice();
    var queryValue = "";
    try { queryValue = new URL(window.location.href).searchParams.get("q") || ""; } catch { queryValue = ""; }
    if (input) input.value = queryValue;

    var sortLabel = document.createElement("label");
    sortLabel.setAttribute("data-static-sort", "catalog");
    sortLabel.innerHTML = '<span class="lang-zh">排序</span><span class="lang-en">Sort</span><select><option value="title">名称 / Title</option><option value="verified">最近更新 / Last updated</option><option value="cycle">周期 / Cycle</option></select>';
    filters.appendChild(sortLabel);
    var sortSelect = sortLabel.querySelector("select");
    filters.style.gridTemplateColumns = "repeat(auto-fit,minmax(145px,1fr))";

    function render() {
      var needle = input ? input.value.trim().toLowerCase() : "";
      var visible = subset.filter(function (project) {
        var haystack = [project.title && project.title.zh, project.title && project.title.en, project.shortTitle, project.organizer && project.organizer.zh, project.organizer && project.organizer.en]
          .concat(project.searchTerms || []).join(" ").toLowerCase();
        return (!needle || haystack.indexOf(needle) !== -1) &&
          (!trackSelect || trackSelect.value === "all" || project.track === trackSelect.value) &&
          (!gradeSelect || gradeSelect.value === "all" || (project.gradeBands || []).some(function (value) { return canonicalGrade(value) === gradeSelect.value; })) &&
          (!regionSelect || regionSelect.value === "all" || (project.regions || []).some(function (value) { return canonicalRegion(value) === regionSelect.value; })) &&
          (!statusSelect || statusSelect.value === "all" || project.status === statusSelect.value) &&
          (!costSelect || costSelect.value === "all" || project.costBand === costSelect.value);
      });
      visible.sort(function (a, b) {
        if (sortSelect.value === "verified") return String(b.lastVerified || "").localeCompare(String(a.lastVerified || "")) || a.shortTitle.localeCompare(b.shortTitle);
        if (sortSelect.value === "cycle") return String(a.cycle || "").localeCompare(String(b.cycle || "")) || a.shortTitle.localeCompare(b.shortTitle);
        return a.shortTitle.localeCompare(b.shortTitle, undefined, { numeric: true });
      });
      var activeTracks = fixedTrack ? [fixedTrack] : trackSelect && trackSelect.value !== "all" ? [trackSelect.value] : trackOrder;
      results.innerHTML = activeTracks.map(function (activeTrack) {
        var entries = visible.filter(function (project) { return project.track === activeTrack; });
        if (!entries.length) return "";
        var heading = fixedTrack ? "" : '<div class="catalog-group-heading"><h2>' + localized(trackLabels[activeTrack] || { zh: activeTrack, en: activeTrack }) + '</h2><b>' + entries.length + "</b></div>";
        return '<section class="catalog-group" data-track-group="' + escapeHtml(activeTrack) + '">' + heading + '<div class="project-grid">' + entries.map(projectCard).join("") + "</div></section>";
      }).join("");
      var count = toolbar.querySelector("p");
      if (count) count.innerHTML = "<b>" + visible.length + '</b> <span class="lang-zh">条记录</span><span class="lang-en">records</span>';
      var oldEmpty = root.querySelector(".empty-state[data-static-empty]");
      if (!visible.length && !oldEmpty) {
        oldEmpty = document.createElement("p");
        oldEmpty.className = "empty-state";
        oldEmpty.dataset.staticEmpty = "catalog";
        oldEmpty.innerHTML = '<span class="lang-zh">没有匹配记录。</span><span class="lang-en">No matching records.</span>';
        results.after(oldEmpty);
      }
      if (oldEmpty) oldEmpty.hidden = visible.length > 0;
      results.hidden = visible.length === 0;
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    var reset = toolbar.querySelector("button");
    if (reset) reset.addEventListener("click", function () {
      if (input) input.value = "";
      [trackSelect, gradeSelect, regionSelect, statusSelect, costSelect].forEach(function (select) { if (select) select.value = "all"; });
      sortSelect.value = "title";
      render();
    });
    if (projects.length) render();
  }

  function initJournalDirectory() {
    var root = document.querySelector('[data-static-component="journal-directory"]');
    if (!root) return;
    var filters = root.querySelector(".journal-filters");
    var results = root.querySelector("[data-journal-results]");
    var rows = Array.prototype.slice.call(root.querySelectorAll("[data-journal-row]"));
    var count = root.querySelector("[data-journal-result-count]");
    var empty = root.querySelector("[data-journal-empty]");
    var reset = root.querySelector("[data-journal-reset]");
    if (!filters || !results) return;

    function control(name) {
      return filters.querySelector('[data-journal-filter="' + name + '"]');
    }

    function filterValue(name) {
      var field = control(name);
      return field ? String(field.value || "all") : "all";
    }

    function exactMatch(row, name) {
      var selected = filterValue(name);
      return selected === "all" || row.dataset[name] === selected;
    }

    function render() {
      var query = control("query");
      var needle = query ? query.value.trim().toLowerCase() : "";
      var selectedTopic = filterValue("topic");
      var visibleCount = 0;

      rows.forEach(function (row) {
        var topics = String(row.dataset.topic || "").split("|").filter(Boolean);
        var visible = (!needle || String(row.dataset.search || "").toLowerCase().indexOf(needle) !== -1) &&
          (selectedTopic === "all" || topics.indexOf(selectedTopic) !== -1) &&
          exactMatch(row, "audience") &&
          exactMatch(row, "review") &&
          exactMatch(row, "submission") &&
          exactMatch(row, "outcome") &&
          exactMatch(row, "fee");
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (count) count.textContent = String(visibleCount);
      results.hidden = visibleCount === 0;
      if (empty) empty.hidden = visibleCount > 0;
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    if (reset) reset.addEventListener("click", function () {
      Array.prototype.forEach.call(filters.querySelectorAll("input, select"), function (field) {
        field.value = field.tagName === "SELECT" ? "all" : "";
      });
      render();
    });
    render();
  }

  function initArchive() {
    var filters = document.querySelector(".archive-filters");
    var groupsContainer = document.querySelector(".archive-year-groups");
    if (!filters || !groupsContainer || !thresholds.length) return;
    var root = filters.closest('[data-static-component="archive"]');
    var fixedTrack = root && root.dataset.fixedTrack || "";
    var archiveRecords = fixedTrack ? thresholds.filter(function (item) { return (projectById[item.projectId] || {}).track === fixedTrack; }) : thresholds.slice();
    if (!archiveRecords.length) return;
    var selects = Array.prototype.slice.call(filters.querySelectorAll("select"));
    var projectSelect = selects[0];
    var yearSelect = selects[1];
    var queryInput = filters.querySelector('input[type="search"]');
    var exportButton = filters.querySelector("button");
    var projectIds = Array.from(new Set(archiveRecords.map(function (item) { return item.projectId; }))).sort(function (a, b) {
      return String((projectById[a] || {}).shortTitle || a).localeCompare(String((projectById[b] || {}).shortTitle || b), undefined, { numeric: true });
    });
    var years = Array.from(new Set(archiveRecords.map(function (item) { return item.year; }))).sort().reverse();
    var sittings = Array.from(new Set(archiveRecords.map(function (item) { return item.sitting || ""; }).filter(Boolean))).sort();
    projectSelect.innerHTML = '<option value="all">全部 / All</option>' + projectIds.map(function (id) { return '<option value="' + escapeHtml(id) + '">' + escapeHtml((projectById[id] || {}).shortTitle || id) + "</option>"; }).join("");
    yearSelect.innerHTML = '<option value="all">全部 / All</option>' + years.map(function (year) { return '<option value="' + escapeHtml(year) + '">' + escapeHtml(year) + "</option>"; }).join("");

    var sittingLabel = document.createElement("label");
    sittingLabel.innerHTML = '<span class="lang-zh">场次</span><span class="lang-en">Sitting</span><select><option value="all">全部 / All</option>' + sittings.map(function (sitting) { return '<option value="' + escapeHtml(sitting) + '">' + escapeHtml(sitting) + "</option>"; }).join("") + "</select>";
    var statusLabel = document.createElement("label");
    statusLabel.innerHTML = '<span class="lang-zh">状态</span><span class="lang-en">Status</span><select><option value="all">全部 / All</option><option value="confirmed">已确认 / Confirmed</option><option value="historical">历史 / Historical</option><option value="pending">待公布 / Pending</option><option value="conflict">冲突 / Conflict</option></select>';
    filters.insertBefore(sittingLabel, exportButton);
    filters.insertBefore(statusLabel, exportButton);
    filters.style.gridTemplateColumns = "repeat(auto-fit,minmax(145px,1fr))";
    var sittingSelect = sittingLabel.querySelector("select");
    var statusSelect = statusLabel.querySelector("select");
    var visible = [];
    try {
      var requestedProject = new URL(window.location.href).searchParams.get("project");
      if (requestedProject && projectIds.indexOf(requestedProject) !== -1) projectSelect.value = requestedProject;
    } catch { /* no query */ }

    function render() {
      var needle = queryInput ? queryInput.value.trim().toLowerCase() : "";
      visible = archiveRecords.filter(function (item) {
        var projectName = (projectById[item.projectId] || {}).shortTitle || item.projectId;
        var haystack = [projectName, item.year, item.sitting || "", text(item.metric), item.metric && item.metric.en, item.value, item.note && item.note.zh, item.note && item.note.en].join(" ").toLowerCase();
        return (projectSelect.value === "all" || item.projectId === projectSelect.value) &&
          (yearSelect.value === "all" || item.year === yearSelect.value) &&
          (sittingSelect.value === "all" || (item.sitting || "") === sittingSelect.value) &&
          (statusSelect.value === "all" || item.status === statusSelect.value) &&
          (!needle || haystack.indexOf(needle) !== -1);
      }).sort(function (a, b) {
        return b.year.localeCompare(a.year) || String((projectById[a.projectId] || {}).shortTitle || a.projectId).localeCompare(String((projectById[b.projectId] || {}).shortTitle || b.projectId), undefined, { numeric: true }) || String(a.sitting || "").localeCompare(String(b.sitting || ""));
      });
      var grouped = {};
      visible.forEach(function (item) {
        if (!grouped[item.year]) grouped[item.year] = [];
        grouped[item.year].push(item);
      });
      groupsContainer.innerHTML = Object.keys(grouped).sort().reverse().map(function (groupYear, groupIndex) {
        var entries = grouped[groupYear];
        var rows = entries.map(function (item) {
          var project = projectById[item.projectId];
          return '<tr data-project-id="' + escapeHtml(item.projectId) + '" data-year="' + escapeHtml(item.year) + '"><td>' + (project ? '<a href="' + escapeHtml(projectHref(project)) + '">' + escapeHtml(project.shortTitle) + "</a>" : escapeHtml(item.projectId)) + "</td><td>" + escapeHtml(item.sitting || "—") + "</td><td>" + localized(item.metric) + (item.note ? "<small>" + localized(item.note) + "</small>" : "") + "</td><td>" + escapeHtml(item.value) + (item.maxScore ? " / " + escapeHtml(item.maxScore) : "") + "</td><td>" + badge(item.status) + sourceCitations(item.sourceIds) + "</td></tr>";
        }).join("");
        var firstHeading = fixedTrack === "competition" ? { zh: "竞赛", en: "Competition" } : fixedTrack === "curriculum" ? { zh: "课程／资格", en: "Course / qualification" } : { zh: "入学考试／测评", en: "Admissions test / assessment" };
        var sittingHeading = fixedTrack === "competition" ? { zh: "场次／组别", en: "Sitting / division" } : fixedTrack === "curriculum" ? { zh: "考试系列／课程", en: "Exam series / course" } : { zh: "考试场次", en: "Test sitting" };
        var metricHeading = fixedTrack === "competition" ? { zh: "奖项／晋级指标", en: "Award / qualification metric" } : fixedTrack === "curriculum" ? { zh: "成绩／等级指标", en: "Score / grade metric" } : { zh: "成绩指标", en: "Score metric" };
        var valueHeading = fixedTrack === "competition" ? { zh: "分数线／数值", en: "Threshold / value" } : fixedTrack === "curriculum" ? { zh: "分数／边界", en: "Score / boundary" } : { zh: "分数／等级", en: "Score / level" };
        return '<details class="threshold-year archive-year"' + (yearSelect.value !== "all" || groupIndex === 0 ? " open" : "") + '><summary><strong>' + escapeHtml(groupYear) + '</strong><span><span class="lang-zh">' + entries.length + ' 条</span><span class="lang-en">' + entries.length + (entries.length === 1 ? ' record' : ' records') + '</span></span></summary><div class="table-scroll archive-table"><table><thead><tr><th>' + localized(firstHeading) + '</th><th>' + localized(sittingHeading) + '</th><th>' + localized(metricHeading) + '</th><th>' + localized(valueHeading) + '</th><th><span class="lang-zh">状态／来源</span><span class="lang-en">Status / source</span></th></tr></thead><tbody>' + rows + "</tbody></table></div></details>";
      }).join("");
      var count = document.querySelector(".result-count");
      if (count) count.innerHTML = "<b>" + visible.length + '</b> <span class="lang-zh">条记录</span><span class="lang-en">records</span>';
      exportButton.disabled = !visible.length;
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    exportButton.addEventListener("click", function () {
      var rows = [["Project", "Year", "Sitting", "Metric ZH", "Metric EN", "Value", "Max score", "Status", "Sources"]].concat(visible.map(function (item) {
        return [(projectById[item.projectId] || {}).shortTitle || item.projectId, item.year, item.sitting || "", item.metric.zh, item.metric.en, item.value, item.maxScore || "", item.status, (item.sourceIds || []).join(" ")];
      }));
      var filename = fixedTrack === "competition" ? "mathpath-competition-thresholds.csv" : fixedTrack === "curriculum" ? "mathpath-course-grades.csv" : "mathpath-assessment-scores.csv";
      download("\uFEFF" + rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n"), filename, "text/csv;charset=utf-8");
    });
    render();
  }

  function calendarRows() {
    var rows = [];
    projects.forEach(function (project) {
      (project.dates || []).forEach(function (date) {
        rows.push({ dateRecord: date, project: project });
      });
    });
    return rows;
  }

  function initCalendar() {
    var filters = document.querySelector(".calendar-filters");
    var list = document.querySelector(".calendar-list");
    var root = filters && filters.closest('[data-static-component="calendar"]');
    var fixedTrack = root && root.dataset.fixedTrack || "";
    var calendarStart = root && root.dataset.calendarStart || "2026-01-01";
    var rows = calendarRows().filter(function (row) {
      return (!fixedTrack || row.project.track === fixedTrack) && row.dateRecord.date >= calendarStart;
    });
    if (!filters || !list || !rows.length) return;
    var input = filters.querySelector('[data-calendar-filter="query"]');
    var trackSelect = filters.querySelector('[data-calendar-filter="track"]');
    var statusSelect = filters.querySelector('[data-calendar-filter="status"]');
    var periodLinks = Array.prototype.slice.call(root.querySelectorAll("[data-calendar-period-link]"));
    var exportButton = filters.querySelector("button");
    var visible = [];
    var period = "current";
    try {
      var requestedPeriod = new URLSearchParams(window.location.search).get("period");
      if (["current", "history", "all"].indexOf(requestedPeriod) !== -1) period = requestedPeriod;
    } catch {}

    function isHistory(item) {
      return (item.endDate || item.date) < today();
    }

    function calendarRowHtml(row, period) {
      var item = row.dateRecord;
      var project = row.project;
      var haystack = [project.title && project.title.zh, project.title && project.title.en, project.shortTitle, item.label && item.label.zh, item.label && item.label.en, item.region && item.region.zh, item.region && item.region.en, item.note && item.note.zh, item.note && item.note.en].join(" ").toLowerCase();
      return '<article class="calendar-row" data-event-id="' + escapeHtml(item.id) + '" data-project-id="' + escapeHtml(project.id) + '" data-track="' + escapeHtml(project.track) + '" data-status="' + escapeHtml(item.status) + '" data-date="' + escapeHtml(item.date) + '" data-end-date="' + escapeHtml(item.endDate || item.date) + '" data-calendar-period="' + period + '" data-search="' + escapeHtml(haystack) + '">' +
        '<time datetime="' + escapeHtml(item.date) + '">' + escapeHtml(item.date) + (item.endDate ? " — " + escapeHtml(item.endDate) : "") + "<small>" + escapeHtml([item.time, item.timezone].filter(Boolean).join(" ")) + "</small></time>" +
        "<div>" + badge(item.status) + '<h2><a href="' + escapeHtml(projectHref(project)) + '">' + escapeHtml(project.shortTitle) + "</a></h2><p>" + localized(item.label) + "</p></div>" +
        "<div>" + (item.region ? "<p>" + localized(item.region) + "</p>" : "") + (item.note ? "<p>" + localized(item.note) + "</p>" : "") + sourceCitations(item.sourceIds) + "</div></article>";
    }

    function calendarGroupHtml(groupRows, period) {
      if (!groupRows.length) return "";
      var title = period === "history"
        ? { zh: "历史记录（2026 年起）", en: "History from 2026" }
        : { zh: "当前与未来节点", en: "Current and upcoming" };
      return '<section class="calendar-group' + (period === "history" ? " calendar-history" : "") + '" data-calendar-group="' + period + '">' +
        '<div class="calendar-group-heading"><h2>' + localized(title) + "</h2><b>" + groupRows.length + "</b></div><div>" +
        groupRows.map(function (row) { return calendarRowHtml(row, period); }).join("") +
        "</div></section>";
    }

    function render() {
      var needle = input ? input.value.trim().toLowerCase() : "";
      var matched = rows.filter(function (row) {
        var item = row.dateRecord;
        var project = row.project;
        var haystack = [project.title && project.title.zh, project.title && project.title.en, project.shortTitle, item.label && item.label.zh, item.label && item.label.en, item.region && item.region.zh, item.region && item.region.en, item.note && item.note.zh, item.note && item.note.en].join(" ").toLowerCase();
        return (!needle || haystack.indexOf(needle) !== -1) &&
          (!trackSelect || trackSelect.value === "all" || project.track === trackSelect.value) &&
          (!statusSelect || statusSelect.value === "all" || item.status === statusSelect.value);
      });
      var currentRows = matched.filter(function (row) { return !isHistory(row.dateRecord); }).sort(function (a, b) { return a.dateRecord.date.localeCompare(b.dateRecord.date) || a.project.shortTitle.localeCompare(b.project.shortTitle, undefined, { numeric: true }); });
      var historyRows = matched.filter(function (row) { return isHistory(row.dateRecord); }).sort(function (a, b) { return b.dateRecord.date.localeCompare(a.dateRecord.date) || a.project.shortTitle.localeCompare(b.project.shortTitle, undefined, { numeric: true }); });
      visible = period === "history" ? historyRows : period === "all" ? currentRows.concat(historyRows) : currentRows;
      list.innerHTML = (period !== "history" ? calendarGroupHtml(currentRows, "current") : "") +
        (period !== "current" ? calendarGroupHtml(historyRows, "history") : "") +
        (!visible.length ? '<p class="empty-state" data-calendar-empty><span class="lang-zh">没有符合条件的日期。</span><span class="lang-en">No matching dates.</span></p>' : "");
      var count = root.querySelector(".result-count");
      if (count) count.innerHTML = "<b>" + visible.length + '</b> <span class="lang-zh">个日期</span><span class="lang-en">dates</span>';
      periodLinks.forEach(function (link) {
        var linkPeriod = link.dataset.calendarPeriodLink;
        var linkCount = link.querySelector("b");
        var value = linkPeriod === "current" ? currentRows.length : linkPeriod === "history" ? historyRows.length : currentRows.length + historyRows.length;
        if (linkCount) linkCount.textContent = String(value);
        link.classList.toggle("active", linkPeriod === period);
        if (linkPeriod === period) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
      exportButton.disabled = !visible.length;
    }

    function exportIcs() {
      var timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
      var events = visible.filter(function (row) { return /^\d{4}-\d{2}-\d{2}$/.test(row.dateRecord.date); }).map(function (row) {
        var item = row.dateRecord;
        var project = row.project;
        var source = (item.sourceIds || []).map(function (id) { return sourceById[id]; }).filter(Boolean)[0];
        return ["BEGIN:VEVENT", "UID:" + project.id + "-" + item.id + "@international-math-library", "DTSTAMP:" + timestamp, "DTSTART;VALUE=DATE:" + item.date.replace(/-/g, ""), "DTEND;VALUE=DATE:" + nextDay(item.endDate || item.date).replace(/-/g, ""), "SUMMARY:" + icsEscape(project.shortTitle + " — " + text(item.label)), "DESCRIPTION:" + icsEscape((item.label && item.label.en || "") + (item.note ? " | " + text(item.note) : "")), source ? "URL:" + source.url : "", "END:VEVENT"].filter(Boolean).join("\r\n");
      });
      var filenames = {
        competition: "competition-calendar.ics",
        modeling: "mathematical-modeling-calendar.ics",
        research: "mathematics-research-calendar.ics",
        summer: "mathematics-summer-program-calendar.ics",
        curriculum: "mathematics-course-exam-calendar.ics",
        assessment: "admissions-test-calendar.ics"
      };
      var filename = fixedTrack && filenames[fixedTrack] || "international-mathematics-calendar.ics";
      download(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Mathematics Resource Library//Calendar//ZH-EN", "CALSCALE:GREGORIAN"].concat(events, ["END:VCALENDAR"]).join("\r\n"), filename, "text/calendar;charset=utf-8");
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    periodLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        var nextPeriod = link.dataset.calendarPeriodLink;
        if (["current", "history", "all"].indexOf(nextPeriod) === -1) return;
        event.preventDefault();
        period = nextPeriod;
        try {
          var url = new URL(window.location.href);
          url.searchParams.set("period", period);
          url.hash = "calendar-results";
          window.history.replaceState({}, "", url);
        } catch {}
        render();
      });
    });
    exportButton.addEventListener("click", exportIcs);
    render();
  }

  function initCompare() {
    var picker = document.querySelector(".compare-picker");
    var table = document.querySelector(".compare-table table");
    if (!picker || !table || !projects.length) return;
    var root = picker.closest('[data-static-component="compare"]');
    var fixedTrack = root && root.dataset.fixedTrack || "";
    var comparisonProjects = fixedTrack ? projects.filter(function (project) { return project.track === fixedTrack; }) : projects.slice();
    var comparisonIds = comparisonProjects.map(function (project) { return project.id; });
    var requested = [];
    try { requested = (new URL(window.location.href).searchParams.get("ids") || "").split(",").filter(function (id) { return comparisonIds.indexOf(id) !== -1; }).slice(0, 4); } catch { requested = []; }
    var selected = requested.length ? requested : comparisonProjects.slice(0, 2).map(function (project) { return project.id; });

    function renderPicker() {
      var legend = fixedTrack === "competition"
        ? '<span class="lang-zh">选择 2—4 项数学竞赛</span><span class="lang-en">Select 2–4 mathematics competitions</span>'
        : fixedTrack === "curriculum"
          ? '<span class="lang-zh">选择 2—4 门数学课程或资格</span><span class="lang-en">Select 2–4 mathematics curricula or qualifications</span>'
          : '<span class="lang-zh">选择 2—4 项入学考试或测评</span><span class="lang-en">Select 2–4 admissions tests or assessments</span>';
      picker.innerHTML = '<legend>' + legend + '</legend>' + comparisonProjects.map(function (project) {
        var checked = selected.indexOf(project.id) !== -1;
        var disabled = !checked && selected.length >= 4;
        return '<label><input type="checkbox" value="' + escapeHtml(project.id) + '"' + (checked ? " checked" : "") + (disabled ? " disabled" : "") + ">" + escapeHtml(project.shortTitle) + '<small style="color:var(--muted)">' + escapeHtml((trackLabels[project.track] || {}).zh || project.track) + "</small></label>";
      }).join("");
    }

    function renderTable() {
      var records = selected.map(function (id) { return projectById[id]; }).filter(Boolean);
      var factLabels = [];
      records.forEach(function (record) {
        (record.facts || []).forEach(function (fact) {
          var key = fact.label && fact.label.en || fact.label && fact.label.zh || "";
          if (key && factLabels.indexOf(key) === -1) factLabels.push(key);
        });
      });
      function cells(callback) { return records.map(function (record) { return "<td>" + callback(record) + "</td>"; }).join(""); }
      var head = '<thead><tr><th><span class="lang-zh">字段</span><span class="lang-en">Field</span></th>' + records.map(function (record) { return '<th><a href="' + escapeHtml(projectHref(record)) + '">' + escapeHtml(record.shortTitle) + "</a>" + badge(record.status) + "</th>"; }).join("") + "</tr></thead>";
      var body = [];
      body.push('<tr><th><span class="lang-zh">主办方</span><span class="lang-en">Organizer</span></th>' + cells(function (record) { return localized(record.organizer); }) + "</tr>");
      body.push('<tr><th><span class="lang-zh">适用年级</span><span class="lang-en">Grade</span></th>' + cells(function (record) { return localizedList(record.gradeBands, gradeLabels); }) + "</tr>");
      body.push('<tr><th><span class="lang-zh">地区</span><span class="lang-en">Region</span></th>' + cells(function (record) { return localizedList(record.regions, regionLabels); }) + "</tr>");
      body.push('<tr><th><span class="lang-zh">费用</span><span class="lang-en">Cost</span></th>' + cells(function (record) { return localized(costLabels[record.costBand] || { zh: record.costBand, en: record.costBand }); }) + "</tr>");
      body.push('<tr><th><span class="lang-zh">适用周期</span><span class="lang-en">Cycle</span></th>' + cells(function (record) { return escapeHtml(record.cycle || "—"); }) + "</tr>");
      var nextDateLabel = fixedTrack === "competition" ? '<span class="lang-zh">下一比赛日期</span><span class="lang-en">Next contest date</span>' : fixedTrack === "curriculum" ? '<span class="lang-zh">下一统考日期</span><span class="lang-en">Next subject-exam date</span>' : '<span class="lang-zh">下一考试日期</span><span class="lang-en">Next test date</span>';
      body.push('<tr><th>' + nextDateLabel + '</th>' + cells(function (record) {
        var dates = (record.dates || []).filter(function (date) { return date.status === "confirmed" && date.date >= today(); }).sort(function (a, b) { return a.date.localeCompare(b.date); });
        return escapeHtml(dates.length ? dates[0].date : "—");
      }) + "</tr>");
      factLabels.forEach(function (key) {
        var sample;
        records.some(function (record) { sample = (record.facts || []).find(function (fact) { return (fact.label.en || fact.label.zh) === key; }); return Boolean(sample); });
        body.push("<tr><th>" + localized(sample ? sample.label : { zh: key, en: key }) + "</th>" + cells(function (record) {
          var fact = (record.facts || []).find(function (item) { return (item.label.en || item.label.zh) === key; });
          return fact ? localized(fact.value) : "—";
        }) + "</tr>");
      });
      table.innerHTML = head + "<tbody>" + body.join("") + "</tbody>";
    }

    picker.addEventListener("change", function (event) {
      var input = event.target.closest('input[type="checkbox"]');
      if (!input) return;
      if (input.checked && selected.indexOf(input.value) === -1 && selected.length < 4) selected.push(input.value);
      if (!input.checked) selected = selected.filter(function (id) { return id !== input.value; });
      renderPicker();
      renderTable();
    });
    renderPicker();
    renderTable();
  }

  var plannerStorageKey = "mathpath-planner-v2";

  function defaultPlannerState() {
    return { schemaVersion: 2, profiles: [{ id: "default", name: "Student 1", grade: "" }], activeProfileId: "default", items: [] };
  }

  function normalisePlanner(value) {
    var fallback = defaultPlannerState();
    if (!value || typeof value !== "object") return fallback;
    var profiles = Array.isArray(value.profiles) ? value.profiles.filter(function (profile) { return profile && profile.id && profile.name; }).map(function (profile) { return { id: String(profile.id), name: String(profile.name), grade: String(profile.grade || "") }; }) : [];
    if (!profiles.length) profiles = fallback.profiles;
    var active = profiles.some(function (profile) { return profile.id === value.activeProfileId; }) ? value.activeProfileId : profiles[0].id;
    var items = Array.isArray(value.items) ? value.items.filter(function (item) { return item && item.projectId; }).map(function (item) {
      var project = projectById[item.projectId];
      return {
        profileId: item.profileId || active,
        projectId: String(item.projectId),
        titleZh: String(item.titleZh || project && project.title.zh || item.projectId),
        titleEn: String(item.titleEn || project && project.title.en || item.projectId),
        track: String(item.track || project && project.track || ""),
        deadline: item.deadline ? String(item.deadline) : "",
        status: ["researching", "preparing", "submitted", "complete"].indexOf(item.status) !== -1 ? item.status : "researching",
        note: String(item.note || ""),
        updatedAt: String(item.updatedAt || new Date().toISOString())
      };
    }) : [];
    return { schemaVersion: 2, profiles: profiles, activeProfileId: active, items: items };
  }

  function loadPlanner() {
    try { return normalisePlanner(JSON.parse(readStored(plannerStorageKey, "null"))); } catch { return defaultPlannerState(); }
  }

  function savePlanner(state) {
    writeStored(plannerStorageKey, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("mathpath-planner-updated"));
  }

  function currentProjectFromPage() {
    var heading = document.querySelector(".record-heading h1");
    var headingText = heading ? heading.textContent || "" : "";
    var path = decodeURIComponent(window.location.pathname).toLowerCase();
    return projects.find(function (project) {
      return path.indexOf(String(project.slug).toLowerCase()) !== -1 || headingText.indexOf(project.title.zh) !== -1 || headingText.indexOf(project.title.en) !== -1;
    });
  }

  function initAddToPlanner() {
    var button = document.querySelector(".record-actions .primary-button");
    var project = currentProjectFromPage();
    if (!button || !project) return;
    function update() {
      var state = loadPlanner();
      var saved = state.items.some(function (item) { return item.projectId === project.id && item.profileId === state.activeProfileId; });
      button.disabled = saved;
      button.innerHTML = saved ? '<span class="lang-zh">已加入规划器</span><span class="lang-en">Added to planner</span>' : '<span class="lang-zh">加入规划器</span><span class="lang-en">Add to planner</span>';
    }
    button.addEventListener("click", function () {
      var state = loadPlanner();
      if (state.items.some(function (item) { return item.projectId === project.id && item.profileId === state.activeProfileId; })) return;
      var deadline = (project.dates || []).filter(function (date) { return date.status === "confirmed" && date.date >= today(); }).sort(function (a, b) { return a.date.localeCompare(b.date); })[0];
      state.items.push({ profileId: state.activeProfileId, projectId: project.id, titleZh: project.title.zh, titleEn: project.title.en, track: project.track, deadline: deadline ? deadline.date : "", status: "researching", note: "", updatedAt: new Date().toISOString() });
      savePlanner(state);
      update();
    });
    window.addEventListener("mathpath-planner-updated", update);
    update();
  }

  function initPlanner() {
    var root = document.querySelector(".planner-workspace");
    if (!root || !projects.length) return;
    var state = loadPlanner();

    function activeProfile() {
      return state.profiles.find(function (profile) { return profile.id === state.activeProfileId; }) || state.profiles[0];
    }

    function activeItems() {
      var active = activeProfile();
      return state.items.filter(function (item) { return item.profileId === active.id; });
    }

    function persist(renderAfter) {
      savePlanner(state);
      if (renderAfter) render();
    }

    function render() {
      var active = activeProfile();
      var items = activeItems();
      var available = projects.filter(function (project) { return !items.some(function (item) { return item.projectId === project.id; }); });
      var profilesHtml = state.profiles.map(function (profile) { return '<option value="' + escapeHtml(profile.id) + '"' + (profile.id === active.id ? " selected" : "") + ">" + escapeHtml(profile.name + (profile.grade ? " · " + profile.grade : "")) + "</option>"; }).join("");
      var projectsHtml = trackOrder.map(function (track) {
        var entries = available.filter(function (project) { return project.track === track; });
        if (!entries.length) return "";
        var label = trackLabels[track] || { zh: track, en: track };
        return '<optgroup label="' + escapeHtml(label.zh + " / " + label.en) + '">' + entries.map(function (project) { return '<option value="' + escapeHtml(project.id) + '">' + escapeHtml(project.shortTitle + " — " + project.title.zh) + "</option>"; }).join("") + "</optgroup>";
      }).join("");
      function plannerItemHtml(item) {
        var project = projectById[item.projectId];
        var statuses = [["researching", "了解中 / Considering"], ["preparing", "准备中 / Preparing"], ["submitted", "已提交 / Submitted"], ["complete", "已完成 / Complete"]];
        return '<article data-project-id="' + escapeHtml(item.projectId) + '"><div><h2>' + escapeHtml(item.titleZh) + "<small>" + escapeHtml(item.titleEn) + "</small></h2>" + (project ? '<a href="' + escapeHtml(projectHref(project)) + '"><span class="lang-zh">查看详情</span><span class="lang-en">View details</span></a>' : "") + '</div><label><span class="lang-zh">状态</span><span class="lang-en">Status</span><select data-item-field="status">' + statuses.map(function (status) { return '<option value="' + status[0] + '"' + (item.status === status[0] ? " selected" : "") + ">" + status[1] + "</option>"; }).join("") + '</select></label><label><span class="lang-zh">截止日期</span><span class="lang-en">Deadline</span><input data-item-field="deadline" type="date" value="' + escapeHtml(item.deadline || "") + '"></label><label class="planner-note"><span class="lang-zh">备注</span><span class="lang-en">Note</span><textarea data-item-field="note">' + escapeHtml(item.note || "") + '</textarea></label><button class="remove-item" type="button" data-action="remove-item"><span class="lang-zh">移除</span><span class="lang-en">Remove</span></button></article>';
      }
      var itemsHtml = trackOrder.map(function (track) {
        var entries = items.filter(function (item) { var project = projectById[item.projectId]; return (project && project.track || item.track) === track; });
        if (!entries.length) return "";
        return '<section class="planner-track-group" data-track="' + escapeHtml(track) + '"><h2>' + localized(trackLabels[track] || { zh: track, en: track }) + "</h2>" + entries.map(plannerItemHtml).join("") + "</section>";
      }).join("");
      root.innerHTML = '<section class="planner-profiles"><div class="profile-current"><label><span class="lang-zh">学生档案</span><span class="lang-en">Student profile</span><select data-role="active-profile">' + profilesHtml + '</select></label><button type="button" data-action="remove-profile"' + (state.profiles.length === 1 ? " disabled" : "") + '><span class="lang-zh">删除档案</span><span class="lang-en">Delete profile</span></button></div><div class="profile-new"><label><span class="lang-zh">姓名或编号</span><span class="lang-en">Name or ID</span><input data-role="new-name"></label><label><span class="lang-zh">年级</span><span class="lang-en">Grade</span><input data-role="new-grade"></label><button class="secondary-button" type="button" data-action="add-profile"><span class="lang-zh">新增档案</span><span class="lang-en">Add profile</span></button></div></section>' +
        '<section class="planner-add"><label><span class="lang-zh">按类别加入项目</span><span class="lang-en">Add a project by category</span><select data-role="project-to-add"><option value="">选择 / Select</option>' + projectsHtml + '</select></label><button class="primary-button" type="button" data-action="add-project"><span class="lang-zh">加入</span><span class="lang-en">Add</span></button></section>' +
        '<section class="planner-export"><p><span class="lang-zh">数据仅保存在当前浏览器。</span><span class="lang-en">Data is stored only in this browser.</span></p><div><button type="button" data-action="export-csv"' + (!items.length ? " disabled" : "") + '>CSV</button><button type="button" data-action="export-ics"' + (!items.length ? " disabled" : "") + '>ICS</button><button type="button" data-action="export-json">JSON</button><button type="button" data-action="import-json"><span class="lang-zh">导入 JSON</span><span class="lang-en">Import JSON</span></button><input data-role="import-file" hidden type="file" accept="application/json,.json"></div></section>' +
        (items.length ? '<div class="planner-items">' + itemsHtml + "</div>" : '<p class="empty-state"><span class="lang-zh">尚未添加项目。</span><span class="lang-en">No projects added yet.</span></p>');
    }

    function exportPlannerJson() {
      download(JSON.stringify(state, null, 2), "math-study-planner-" + activeProfile().name.replace(/\s+/g, "-") + ".json", "application/json;charset=utf-8");
    }

    function exportPlannerCsv() {
      var active = activeProfile();
      var rows = [["Student", "Grade", "Project", "Track", "Deadline", "Status", "Note", "Updated"]].concat(activeItems().map(function (item) { return [active.name, active.grade, item.titleEn, item.track, item.deadline || "", item.status, item.note || "", item.updatedAt]; }));
      download("\uFEFF" + rows.map(function (row) { return row.map(csvCell).join(","); }).join("\r\n"), "math-study-planner-" + active.name.replace(/\s+/g, "-") + ".csv", "text/csv;charset=utf-8");
    }

    function exportPlannerIcs() {
      var active = activeProfile();
      var events = activeItems().filter(function (item) { return /^\d{4}-\d{2}-\d{2}$/.test(item.deadline || ""); }).map(function (item) {
        return ["BEGIN:VEVENT", "UID:" + active.id + "-" + item.projectId + "@mathpath", "DTSTART;VALUE=DATE:" + item.deadline.replace(/-/g, ""), "DTEND;VALUE=DATE:" + nextDay(item.deadline).replace(/-/g, ""), "SUMMARY:" + icsEscape(item.titleEn + " — deadline"), "DESCRIPTION:" + icsEscape(item.note), "END:VEVENT"].join("\r\n");
      });
      download(["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//International Math Library//Planner//ZH-EN"].concat(events, ["END:VCALENDAR"]).join("\r\n"), "math-study-planner-" + active.name.replace(/\s+/g, "-") + ".ics", "text/calendar;charset=utf-8");
    }

    root.addEventListener("click", function (event) {
      var button = event.target.closest("button[data-action]");
      if (!button) return;
      var action = button.dataset.action;
      if (action === "add-profile") {
        var nameInput = root.querySelector('[data-role="new-name"]');
        var gradeInput = root.querySelector('[data-role="new-grade"]');
        var name = nameInput.value.trim();
        if (!name) { nameInput.focus(); return; }
        var profile = { id: "profile-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7), name: name, grade: gradeInput.value.trim() };
        state.profiles.push(profile);
        state.activeProfileId = profile.id;
        persist(true);
      } else if (action === "remove-profile") {
        var active = activeProfile();
        if (state.profiles.length > 1 && window.confirm("Delete this student profile and its planner items?")) {
          state.profiles = state.profiles.filter(function (profile) { return profile.id !== active.id; });
          state.items = state.items.filter(function (item) { return item.profileId !== active.id; });
          state.activeProfileId = state.profiles[0].id;
          persist(true);
        }
      } else if (action === "add-project") {
        var select = root.querySelector('[data-role="project-to-add"]');
        var project = projectById[select.value];
        if (!project) return;
        var deadline = (project.dates || []).filter(function (date) { return date.status === "confirmed" && date.date >= today(); }).sort(function (a, b) { return a.date.localeCompare(b.date); })[0];
        state.items.push({ profileId: activeProfile().id, projectId: project.id, titleZh: project.title.zh, titleEn: project.title.en, track: project.track, deadline: deadline ? deadline.date : "", status: "researching", note: "", updatedAt: new Date().toISOString() });
        persist(true);
      } else if (action === "remove-item") {
        var article = button.closest("article[data-project-id]");
        var activeId = activeProfile().id;
        state.items = state.items.filter(function (item) { return !(item.profileId === activeId && item.projectId === article.dataset.projectId); });
        persist(true);
      } else if (action === "export-json") exportPlannerJson();
      else if (action === "export-csv") exportPlannerCsv();
      else if (action === "export-ics") exportPlannerIcs();
      else if (action === "import-json") root.querySelector('[data-role="import-file"]').click();
    });

    root.addEventListener("change", function (event) {
      var target = event.target;
      if (target.matches('[data-role="active-profile"]')) {
        state.activeProfileId = target.value;
        persist(true);
        return;
      }
      if (target.matches('[data-role="import-file"]')) {
        var file = target.files && target.files[0];
        if (!file) return;
        file.text().then(function (content) {
          try { state = normalisePlanner(JSON.parse(content)); persist(true); }
          catch { window.alert("Invalid planner backup."); }
        });
        return;
      }
      var field = target.dataset.itemField;
      var article = target.closest("article[data-project-id]");
      if (!field || !article) return;
      var activeId = activeProfile().id;
      state.items.forEach(function (item) {
        if (item.profileId === activeId && item.projectId === article.dataset.projectId) {
          item[field] = target.value;
          item.updatedAt = new Date().toISOString();
        }
      });
      persist(false);
    });

    root.addEventListener("input", function (event) {
      var target = event.target;
      if (target.dataset.itemField !== "note") return;
      var article = target.closest("article[data-project-id]");
      var activeId = activeProfile().id;
      state.items.forEach(function (item) {
        if (item.profileId === activeId && item.projectId === article.dataset.projectId) {
          item.note = target.value;
          item.updatedAt = new Date().toISOString();
        }
      });
      savePlanner(state);
    });

    render();
  }

  function initOfficialSites() {
    var root = document.querySelector('[data-static-component="official-sites"]');
    if (!root) return;
    var filters = root.querySelector(".official-site-filters");
    var groupsContainer = root.querySelector(".official-site-groups");
    var toolbar = root.querySelector(".result-toolbar");
    if (!filters || !groupsContainer || !toolbar) return;
    var input = filters.querySelector('input[type="search"]');
    var select = filters.querySelector("select");
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-official-site-card]"));
    var groups = Array.prototype.slice.call(root.querySelectorAll("[data-official-site-group]"));

    function render() {
      var needle = input ? input.value.trim().toLowerCase() : "";
      var category = select ? select.value : "all";
      var visibleCount = 0;
      cards.forEach(function (card) {
        var matchesCategory = category === "all" || card.dataset.category === category;
        var matchesQuery = !needle || String(card.dataset.search || card.textContent || "").toLowerCase().indexOf(needle) !== -1;
        card.hidden = !(matchesCategory && matchesQuery);
        if (!card.hidden) visibleCount += 1;
      });
      groups.forEach(function (group) {
        var visibleCards = Array.prototype.filter.call(group.querySelectorAll("[data-official-site-card]"), function (card) { return !card.hidden; });
        group.hidden = visibleCards.length === 0;
        var groupCount = group.querySelector(".section-title-row > b");
        if (groupCount) groupCount.textContent = String(visibleCards.length);
      });
      var count = toolbar.querySelector("p");
      if (count) count.innerHTML = "<b>" + visibleCount + '</b> <span class="lang-zh">个官网条目</span><span class="lang-en">official-site entries</span>';
      groupsContainer.hidden = visibleCount === 0;
      var empty = root.querySelector('[data-static-empty="official-sites"]');
      if (!visibleCount && !empty) {
        empty = document.createElement("p");
        empty.className = "empty-state";
        empty.dataset.staticEmpty = "official-sites";
        empty.innerHTML = '<span class="lang-zh">没有匹配的官网。</span><span class="lang-en">No matching official sites.</span>';
        groupsContainer.after(empty);
      }
      if (empty) empty.hidden = visibleCount > 0;
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    var reset = toolbar.querySelector("button");
    if (reset) reset.addEventListener("click", function () {
      if (input) input.value = "";
      if (select) select.value = "all";
      render();
    });
    render();
  }

  function initUniversityCompetitionDirectory() {
    var root = document.querySelector('[data-static-component="university-competition-directory"]');
    if (!root) return;
    var query = root.querySelector('[data-university-competition-filter="query"]');
    var region = root.querySelector('[data-university-competition-filter="region"]');
    var organizer = root.querySelector('[data-university-competition-filter="organizer"]');
    var status = root.querySelector('[data-university-competition-filter="status"]');
    var china = root.querySelector('[data-university-competition-filter="china"]');
    var rows = Array.prototype.slice.call(root.querySelectorAll(
      '[data-university-competition-row], tr[data-search][data-region][data-organizer-type][data-status][data-china-access]',
    ));
    var results = root.querySelector('[data-university-competition-results]') || root.querySelector("table");
    var count = root.querySelector('[data-university-competition-count]');
    var empty = root.querySelector('[data-university-competition-empty]');
    var reset = root.querySelector('[data-university-competition-reset]');

    function matchesValue(rawValue, selectedValue) {
      if (!selectedValue || selectedValue === "all") return true;
      return String(rawValue || "").split(/[\s|,]+/).indexOf(selectedValue) !== -1;
    }

    function render() {
      var needle = query ? query.value.trim().toLowerCase() : "";
      var visibleCount = 0;
      rows.forEach(function (row) {
        var matches = (!needle || String(row.dataset.search || row.textContent || "").toLowerCase().indexOf(needle) !== -1)
          && matchesValue(row.dataset.region, region && region.value)
          && matchesValue(row.dataset.organizerType, organizer && organizer.value)
          && matchesValue(row.dataset.status, status && status.value)
          && matchesValue(row.dataset.chinaAccess, china && china.value);
        row.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (count) {
        var countValue = count.matches("b") ? count : count.querySelector("b") || count;
        countValue.textContent = String(visibleCount);
      }
      if (results) results.hidden = visibleCount === 0;
      if (!empty) {
        empty = document.createElement("p");
        empty.className = "empty-state";
        empty.dataset.universityCompetitionEmpty = "";
        empty.innerHTML = '<span class="lang-zh">没有符合条件的竞赛。</span><span class="lang-en">No matching competitions.</span>';
        if (results) results.after(empty);
        else root.appendChild(empty);
      }
      empty.hidden = visibleCount > 0;
    }

    [query, region, organizer, status, china].filter(Boolean).forEach(function (control) {
      control.addEventListener(control.tagName === "SELECT" ? "change" : "input", render);
    });
    if (reset) reset.addEventListener("click", function () {
      if (query) query.value = "";
      [region, organizer, status, china].filter(Boolean).forEach(function (control) { control.value = "all"; });
      render();
    });
    render();
  }

  function initAdmissionRequirements() {
    var root = document.querySelector('[data-static-component="admission-requirements"]');
    if (!root) return;
    var filters = root.querySelector(".admission-requirement-filters");
    var groupsContainer = root.querySelector(".admission-requirement-groups");
    var toolbar = root.querySelector(".result-toolbar");
    if (!filters || !groupsContainer || !toolbar) return;
    var query = filters.querySelector('[data-filter="q"]');
    var country = filters.querySelector('[data-filter="country"]');
    var project = filters.querySelector('[data-filter="project"]');
    var type = filters.querySelector('[data-filter="type"]');
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-requirement-id]"));
    var groups = Array.prototype.slice.call(root.querySelectorAll("[data-requirement-group]"));

    function applyParam(control, value) {
      if (!control || !value) return;
      if (control.tagName === "SELECT" && !Array.prototype.some.call(control.options, function (option) { return option.value === value; })) return;
      control.value = value;
    }

    try {
      var params = new URLSearchParams(window.location.search);
      applyParam(query, params.get("q"));
      applyParam(country, params.get("country"));
      applyParam(project, params.get("project"));
      applyParam(type, params.get("type"));
    } catch {}

    function render() {
      var needle = query ? query.value.trim().toLowerCase() : "";
      var countryValue = country ? country.value : "all";
      var projectValue = project ? project.value : "all";
      var typeValue = type ? type.value : "all";
      var visibleCount = 0;

      cards.forEach(function (card) {
        var projects = String(card.dataset.projects || "").split(/\s+/);
        var matches = (!needle || String(card.dataset.search || card.textContent || "").toLowerCase().indexOf(needle) !== -1)
          && (countryValue === "all" || card.dataset.country === countryValue)
          && (projectValue === "all" || projects.indexOf(projectValue) !== -1)
          && (typeValue === "all" || card.dataset.type === typeValue);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      groups.forEach(function (group) {
        var visibleCards = Array.prototype.filter.call(group.querySelectorAll("[data-requirement-id]"), function (card) { return !card.hidden; });
        group.hidden = visibleCards.length === 0;
        var count = group.querySelector(".section-title-row > b");
        if (count) count.textContent = String(visibleCards.length);
      });

      var countText = toolbar.querySelector("p");
      if (countText) countText.innerHTML = "<b>" + visibleCount + '</b> <span class="lang-zh">组要求</span><span class="lang-en">requirement groups</span>';
      groupsContainer.hidden = visibleCount === 0;
      var empty = root.querySelector('[data-static-empty="admission-requirements"]');
      if (!visibleCount && !empty) {
        empty = document.createElement("p");
        empty.className = "empty-state";
        empty.dataset.staticEmpty = "admission-requirements";
        empty.innerHTML = '<span class="lang-zh">没有匹配记录。</span><span class="lang-en">No matching records.</span>';
        groupsContainer.after(empty);
      }
      if (empty) empty.hidden = visibleCount > 0;
    }

    filters.addEventListener("input", render);
    filters.addEventListener("change", render);
    var reset = toolbar.querySelector("button");
    if (reset) reset.addEventListener("click", function () {
      if (query) query.value = "";
      if (country) country.value = "all";
      if (project) project.value = "all";
      if (type) type.value = "all";
      render();
    });
    render();
  }

  function boot() {
    initLanguage();
    initMenu();
    initHomeSearch();
    initCatalog();
    initJournalDirectory();
    initArchive();
    initCalendar();
    initCompare();
    initPlanner();
    initAddToPlanner();
    initOfficialSites();
    initUniversityCompetitionDirectory();
    initAdmissionRequirements();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
