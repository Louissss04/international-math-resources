import assert from "node:assert/strict";
import test from "node:test";

const staleDemoCopy = /codex-preview|Your site is taking shape|这是一个演示型规则引擎|正式版本可接入/i;

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

async function renderHtml(path = "/") {
  const response = await render(path);
  assert.equal(response.status, 200, path);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
  return response.text();
}

function childRoutes(html, directoryPath) {
  const prefix = `${directoryPath}/`;
  return [...new Set(
    [...html.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1].replaceAll("&amp;", "&"))
      .filter((href) => href.startsWith(prefix))
      .map((href) => new URL(href, "http://localhost").pathname)
      .filter((pathname) => !pathname.slice(prefix.length).includes("/")),
  )].sort();
}

function requirementCard(html, id) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const card = html.match(new RegExp(`<article\\b[^>]*data-requirement-id="${escapedId}"[^>]*>[\\s\\S]*?<\\/article>`))?.[0];
  assert.ok(card, `missing admission requirement ${id}`);
  return card;
}

function tagAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
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

test("renders the current international mathematics resource library home", async () => {
  const html = await renderHtml();
  assert.match(html, /国际升学数学资料库/);
  assert.match(html, /面向中国中学生的数学竞赛、建模、科研、夏校、国际课程与入学考试资料/);
  assert.match(html, /Mathematics competitions, modeling, research, summer programs, international curricula and admissions tests/);
  for (const href of ["/programs", "/courses-tests", "/destinations", "/calendar", "/resources"]) {
    assert.match(html, new RegExp(`href="${href}"`), href);
  }
  assert.doesNotMatch(html, staleDemoCopy);
});

test("keeps the maintenance guide internal", async () => {
  const home = await renderHtml();
  assert.doesNotMatch(home, /href=["']\/maintenance["']/);
  assert.doesNotMatch(home, /维护说明|>Maintenance</);
  const response = await render("/maintenance");
  assert.equal(response.status, 404);
});

test("shows one context-specific academic-integrity notice on relevant pages", async () => {
  for (const [path, context, pattern] of [
    ["/competitions/amc-12", "competition", /仅在规定队伍范围内协作/],
    ["/courses/ap-calculus-ab", "exam", /考试须由考生本人/],
    ["/assessments/tmua", "exam", /不得代考、场外求助/],
    ["/modeling/himcm", "research", /数据、代码及 AI 协助/],
    ["/research", "research", /不得代写、抄袭/],
    ["/research/integrity", "research", /伪造证明、数据、图像与引用/],
    ["/summer/promys", "application", /申请题、作品和申请材料/],
    ["/journals", "publication", /重复投稿、预印本和 AI 使用/],
    ["/journals/rose-hulman-undergraduate-mathematics-journal", "publication", /目标刊物现行政策/],
  ]) {
    const html = await renderHtml(path);
    assert.equal((html.match(/data-academic-integrity=/g) ?? []).length, 1, path);
    assert.match(html, new RegExp(`data-academic-integrity=["']${context}["']`), path);
    assert.match(html, /诚信提醒/);
    assert.match(html, pattern, path);
  }

  for (const path of ["/research", "/journals", "/journals/rose-hulman-undergraduate-mathematics-journal"]) {
    assert.match(await renderHtml(path), /href=["']\/research\/integrity["']/, path);
  }
  assert.doesNotMatch(await renderHtml("/research/integrity"), /href=["']\/research\/integrity["']/);

  for (const path of ["/", "/calendar", "/sources", "/official-sites"]) {
    assert.doesNotMatch(await renderHtml(path), /data-academic-integrity=/, path);
  }
});

test("renders one private engagement and feedback module on every page", async () => {
  const turnstileConfigured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());
  for (const path of ["/", "/calendar", "/competitions/amc-12"]) {
    const html = await renderHtml(path);
    assert.equal((html.match(/data-static-component=["']engagement["']/g) ?? []).length, 1, path);
    assert.match(html, /data-engagement-helpful/);
    assert.match(html, /aria-pressed=["']false["']/);
    assert.doesNotMatch(html, /data-engagement-(?:site-visits|page-views)/, `${path} exposes private traffic totals`);
    assert.match(html, /data-feedback-dialog/);
    for (const field of ["category", "message", "contact", "website"]) {
      assert.match(html, new RegExp(`name=["']${field}["']`), `${path} is missing ${field}`);
    }
    assert.match(html, /留言不会公开/);
    assert.doesNotMatch(html, /data-feedback-list|\/(?:v1\/admin|admin\/api)|管理后台登录/);
    if (turnstileConfigured) {
      assert.match(html, /<section\b[^>]*data-turnstile-site-key=/, `${path} has no Turnstile site key`);
      assert.match(html, /<div\b[^>]*data-turnstile-like/, `${path} has no like challenge container`);
      assert.match(html, /<div\b[^>]*data-turnstile-feedback/, `${path} has no feedback challenge container`);
      assert.match(html, /src=["']https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit["']/, `${path} has no Turnstile API script`);
    } else {
      assert.doesNotMatch(html, /<(?:section|div)\b[^>]*data-turnstile-(?:site-key|like|feedback)|src=["']https:\/\/challenges\.cloudflare\.com\/turnstile\//, `${path} loads Turnstile without a site key`);
    }
  }
});

test("renders track directories and category-specific archives, calendars and comparisons", async () => {
  for (const [path, pattern] of [
    ["/catalog", /全部条目/],
    ["/programs", /竞赛与项目/],
    ["/courses-tests", /课程与考试/],
    ["/archive", /分类数据档案/],
    ["/competitions", /数学竞赛/],
    ["/modeling", /数学建模/],
    ["/research", /数学科研/],
    ["/journals", /中学生数学论文期刊与投稿/],
    ["/summer", /夏校与夏令营/],
    ["/courses", /数学课程与统考/],
    ["/assessments", /数学入学考试与定量测评/],
    ["/competition-results", /竞赛奖项与分数线/],
    ["/course-scores", /数学课程成绩与等级档案/],
    ["/assessment-scores", /数学入学考试与定量测评成绩档案/],
    ["/calendar", /日期与报名日历/],
    ["/competition-calendar", /竞赛日历/],
    ["/course-calendar", /数学课程统考日历/],
    ["/assessment-calendar", /数学入学考试与定量测评日历/],
    ["/compare", /分类比较/],
    ["/competition-compare", /竞赛比较/],
    ["/course-compare", /数学课程体系比较/],
    ["/assessment-compare", /数学入学考试与定量测评比较/],
    ["/past-papers", /数学真题、样卷与答案入口/],
    ["/resources", /资料中心/],
    ["/syllabi", /官方考纲、范围、样卷与教材/],
    ["/destinations", /按留学地区查询数学要求/],
    ["/universities", /学校与专业考试要求/],
    ["/official-sites", /官网导航/],
  ]) {
    assert.match(await renderHtml(path), pattern, path);
  }
});

test("renders calendars from 2026 with past milestones archived consistently", async () => {
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

  for (const [path, fixedTrack] of routeTracks) {
    const html = await renderHtml(path);
    const rootTag = html.match(/<div\b[^>]*data-static-component=(['"])calendar\1[^>]*>/i)?.[0];
    assert.ok(rootTag, `${path} has no calendar root`);
    assert.equal(tagAttribute(rootTag, "data-calendar-start"), calendarStart, `${path} has the wrong calendar start`);
    assert.equal(tagAttribute(rootTag, "data-fixed-track") ?? "", fixedTrack ?? "", `${path} has the wrong fixed track`);
    assert.match(html, /data-calendar-group=["']current["']/, `${path} has no current calendar group`);
    assert.match(html, /data-calendar-group=["']history["']/, `${path} has no history calendar group`);
    assert.match(html, /data-calendar-period-link=["']history["']/, `${path} has no direct history control`);
    assert.match(html, /href=["'][^"']*\?period=history#calendar-results["']/, `${path} has no shareable history link`);

    const entries = calendarEntries(html);
    assert.ok(entries.length > 0, `${path} has no calendar entries`);
    const keys = entries.map((entry) => `${entry.projectId}:${entry.eventId}`);
    assert.equal(new Set(keys).size, keys.length, `${path} repeats a calendar event`);

    for (const entry of entries) {
      assert.ok(entry.eventId && entry.projectId && entry.track && entry.status && entry.date && entry.endDate, `${path} has an incomplete calendar entry`);
      if (fixedTrack) assert.equal(entry.track, fixedTrack, `${path} contains ${entry.track}`);
      if (isoDate.test(entry.date)) {
        assert.ok(entry.date >= calendarStart, `${path} shows a pre-2026 date: ${entry.date}`);
        assert.match(entry.endDate, isoDate, `${path} has an invalid end date for ${entry.eventId}`);
        const expectedPeriod = entry.endDate < today ? "history" : "current";
        assert.equal(entry.period, expectedPeriod, `${path} files ${entry.projectId}:${entry.eventId} under the wrong period`);
      } else {
        assert.equal(entry.period, "current", `${path} archives undated milestone ${entry.projectId}:${entry.eventId}`);
      }
      if (entry.period === "history" && entry.status === "confirmed") confirmedHistoryCount += 1;
    }
    entriesByRoute.set(path, entries);
  }

  const mainEntries = entriesByRoute.get("/calendar");
  for (const [path, track] of [...routeTracks].slice(1)) {
    const expected = mainEntries.filter((entry) => entry.track === track).map((entry) => `${entry.projectId}:${entry.eventId}:${entry.period}`).sort();
    const actual = entriesByRoute.get(path).map((entry) => `${entry.projectId}:${entry.eventId}:${entry.period}`).sort();
    assert.deepEqual(actual, expected, `${path} differs from the ${track} subset of /calendar`);
  }
  assert.ok(confirmedHistoryCount > 0, "past confirmed milestones are not archived under History");
});

test("keeps subject curricula separate from admissions assessments", async () => {
  const courseHtml = await renderHtml("/courses");
  assert.match(courseHtml, /Mathematics curricula and subject exams/);
  assert.match(courseHtml, /AP、Cambridge International、Pearson Edexcel International 与 IB 数学考纲、考试形式、成绩和官方资料/);
  assert.match(courseHtml, /href="\/courses\/ap-calculus-ab"/);
  assert.match(courseHtml, /href="\/courses\/ap-calculus-bc"/);

  const assessmentHtml = await renderHtml("/assessments");
  assert.match(assessmentHtml, /Mathematics admissions tests and quantitative assessments/);
  assert.match(assessmentHtml, /大学和中学入学考试的数学部分，以及学校组织的数学与定量测评/);
  assert.match(assessmentHtml, /href="\/assessments\/tmua"/);

  for (const [path, pattern] of [
    ["/courses/ap-calculus-ab", /AP Calculus AB/],
    ["/courses/ap-calculus-bc", /AP Calculus BC/],
    ["/assessments/tmua", /TMUA/],
  ]) {
    const html = await renderHtml(path);
    assert.match(html, pattern, path);
    assert.match(html, /来源|Sources/, path);
  }
});

test("renders destination guides with mathematics-only scope and official sources", async () => {
  const directoryHtml = await renderHtml("/destinations");
  assert.match(directoryHtml, /高中数学资格、专业先修要求、额外数学入学考试和中国学生报名方式/);

  const requiredGuides = new Map([
    ["/destinations/united-states-undergraduate-mathematics-requirements", /美国本科申请：数学课程与考试要求/],
    ["/destinations/uk-undergraduate-mathematics-admissions", /英国本科数学及高数学含量专业申请/],
    ["/destinations/singapore-undergraduate-mathematics-admissions", /新加坡本科数学及高数学含量专业申请/],
    ["/destinations/australia", /澳大利亚本科申请：数学课程与考试体系/],
    ["/destinations/canada-undergraduate-mathematics-requirements", /加拿大本科申请：数学课程与考试要求/],
    ["/destinations/europe-other", /欧洲其他国家本科申请：数学课程与考试体系/],
  ]);
  const routes = childRoutes(directoryHtml, "/destinations");
  assert.ok(routes.length > 0, "/destinations should expose destination guides");
  for (const path of requiredGuides.keys()) {
    assert.ok(routes.includes(path), `${path} should be linked from /destinations`);
  }

  for (const path of routes) {
    const html = await renderHtml(path);
    const title = requiredGuides.get(path);
    if (title) assert.match(html, title, path);
    assert.match(html, /仅数学相关要求/);
    assert.match(html, /最后更新/);
    assert.match(html, /id="sources"/);
    assert.match(html, /Official sources/);
  }
});

test("renders searchable school and programme test requirements with official evidence", async () => {
  const html = await renderHtml("/universities");

  assert.match(html, /学校与专业考试要求/);
  assert.match(html, /School and programme test requirements/);
  assert.match(html, /data-static-component="admission-requirements"/);
  for (const filter of ["q", "country", "project", "type"]) {
    assert.match(html, new RegExp(`data-filter="${filter}"`), `missing ${filter} requirement filter`);
  }

  for (const [id, patterns] of [
    ["cambridge-tmua-2027", [/University of Cambridge/, /G100/, /TMUA/]],
    ["cambridge-mathematics-step-2027", [/University of Cambridge/, /G100/, /STEP/]],
    ["lse-tmua-required-2027", [/London School of Economics and Political Science/, /L101/, /TMUA/]],
    ["us-mit-sat-act-required", [/Massachusetts Institute of Technology/, /SAT/, /ACT/]],
    ["ca-waterloo-euclid-csmc-considered", [/University of Waterloo/, /Euclid/, /CSMC/]],
  ]) {
    const card = requirementCard(html, id);
    for (const pattern of patterns) assert.match(card, pattern, `${id} is missing ${pattern}`);
  }

  const requirementIds = [...html.matchAll(/data-requirement-id="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(requirementIds.length > 0, "the university requirement directory has no records");
  assert.equal(new Set(requirementIds).size, requirementIds.length, "the university requirement directory repeats a record");
  assert.match(html, /href="https:\/\//i, "the university requirement directory has no direct official source");
});

test("links test and competition detail pages back to matching school requirements", async () => {
  for (const [path, projectId] of [
    ["/assessments/tmua", "tmua"],
    ["/assessments/step", "step"],
    ["/assessments/sat", "sat"],
    ["/assessments/act", "act"],
    ["/competitions/euclid", "euclid"],
    ["/competitions/csmc", "csmc"],
  ]) {
    const html = await renderHtml(path);
    assert.match(html, /id="admission-requirements"/, `${path} is missing its school-requirement section`);
    assert.match(html, new RegExp(`href="/universities\\?project=${projectId}"`), `${path} does not link to its filtered school requirements`);
  }
});

test("renders official learning-resource directories and project sections", async () => {
  const directoryHtml = await renderHtml("/resources");
  assert.match(directoryHtml, /data-resource-id=/);
  assert.match(directoryHtml, /打开官方资料/);
  assert.match(directoryHtml, /Official learning resources/);

  for (const path of [
    "/competitions/amc-8",
    "/modeling/himcm",
    "/research/start",
    "/summer/promys",
    "/courses/ap-calculus-ab",
    "/assessments/sat",
  ]) {
    const html = await renderHtml(path);
    assert.match(html, /id="official-learning-resources"/, path);
    assert.match(html, /data-resource-id=/, path);
    assert.match(html, /Open official resource/, path);
  }
});

test("separates formal modeling competitions from open modeling projects", async () => {
  const directoryHtml = await renderHtml("/modeling");
  for (const pattern of [/数学建模竞赛/, /开放建模项目与训练/, /地区受限项目/, /MidMCM/, /SCUDEM/, /MCM\/ICM/, /M3 Open Mathematical Modeling Project Library/, /SIMIODE Differential-Equations Modeling Scenarios/, /COMAP Mathematical Modeling Modules/]) {
    assert.match(directoryHtml, pattern);
  }
  const scopedProjectIds = directoryHtml.match(/data-project-ids="([^"]+)"/)?.[1].split("|") ?? [];
  assert.deepEqual(new Set(scopedProjectIds), new Set(["himcm", "immc", "midmcm", "scudem", "mcm-icm", "m3-challenge", "modeling-the-future-challenge", "mmcss-hsmmc"]));
  for (const openProjectId of ["comap-modeling-modules-project", "m3-open-modeling-projects", "simiode-modeling-scenarios", "gaimme-school-modeling-project"]) {
    assert.ok(!scopedProjectIds.includes(openProjectId), `open project is inside the formal competition catalog: ${openProjectId}`);
  }
  const filterOptionText = [...directoryHtml.matchAll(/<option\b[^>]*>([\s\S]*?)<\/option>/g)]
    .map((match) => match[1].replace(/<!--.*?-->/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  for (const internalCode of ["undergraduate", "hong-kong", "shanghai", "united-kingdom"]) {
    assert.ok(!filterOptionText.some((text) => text === internalCode || text.startsWith(`${internalCode} /`)), `raw filter code is visible: ${internalCode}`);
  }

  for (const [path, pattern] of [
    ["/modeling/midmcm", /中国学生报名/],
    ["/modeling/scudem", /中国大陆参赛的提交事项/],
    ["/modeling/mcm-icm", /中国学校可通过 COMAP 全球报名系统参赛/],
    ["/modeling/m3-challenge", /仅在中国就读不能直接报名/],
    ["/modeling/m3-open-modeling-projects", /不是正式参赛/],
    ["/modeling/comap-modeling-modules", /教师须先填写身份表/],
  ]) {
    const html = await renderHtml(path);
    assert.match(html, pattern, path);
    assert.match(html, /id="official-learning-resources"/, path);
  }

  assert.doesNotMatch(await renderHtml("/modeling/m3-open-modeling-projects"), /id="past-papers"/);
  assert.doesNotMatch(await renderHtml("/modeling/comap-modeling-modules"), /id="past-papers"/);

  for (const [path, duplicateResourceId] of [
    ["/modeling/midmcm", "midmcm-problems-results"],
    ["/modeling/scudem", "scudem-past-problems-results"],
    ["/modeling/mcm-icm", "mcm-icm-problems-results-resource"],
    ["/modeling/m3-challenge", "m3-past-problems-winning-papers"],
    ["/modeling/modeling-the-future-challenge", "mtfc-example-projects-resource"],
  ]) {
    assert.doesNotMatch(await renderHtml(path), new RegExp(`data-resource-id="${duplicateResourceId}"`), `${path} repeats its past-problem link in the learning-resource section`);
  }
});

test("separates research programs by access and organizer type", async () => {
  const directoryHtml = await renderHtml("/research");
  for (const label of ["CrowdMath", "MIT PRIMES", "Pioneer Research", "丘成桐数学奖"]) {
    assert.match(directoryHtml, new RegExp(label), label);
  }
  assert.match(directoryHtml, /商业导师项目/);
  assert.match(directoryHtml, /中国学生路径/);

  for (const [path, pattern] of [
    ["/research/crowdmath", /可直接注册 AoPS 账户/],
    ["/research/mit-primes", /仅限实际居住并在美国就读的学生/],
    ["/research/pioneer-research-institute", /收费在线项目/],
    ["/research/yau-high-school-mathematics-award", /研究成果竞赛|科研竞赛/],
  ]) {
    const html = await renderHtml(path);
    assert.match(html, pattern, path);
    assert.match(html, /id="official-learning-resources"/, path);
  }
});

test("renders a separate mathematics journal directory with detailed submission records", async () => {
  const researchHtml = await renderHtml("/research");
  assert.match(researchHtml, /href="\/journals"/);
  assert.match(researchHtml, /期刊与刊物目录/);

  const directoryHtml = await renderHtml("/journals");
  assert.match(directoryHtml, /data-static-component="journal-directory"/);
  for (const pattern of [
    /按论文内容选择/,
    /纯数学、定理与证明/,
    /建模、统计、计算与数据/,
    /原创问题与题解/,
    /题解署名不等同于研究论文发表/,
    /Journal of Emerging Investigators 当前官网明确不收 Mathematics/,
  ]) assert.match(directoryHtml, pattern);
  for (const label of ["R-HUMJ", "JHSS", "NHSJS", "Parabola", "Crux", "Mathematical Reflections", "JIS", "INTEGERS", "EJC"]) {
    assert.match(directoryHtml, new RegExp(label), label);
  }
  assert.equal(childRoutes(directoryHtml, "/journals").length, 16);

  for (const [path, patterns] of [
    ["/journals/journal-of-high-school-science", [/主要 Topic/, /85 美元投稿费/, /两名独立评审/, /许可证简称与所链接法律文本存在不一致/]],
    ["/journals/national-high-school-journal-of-science", [/Mathematics (?:&|&amp;) Statistics/, /280 美元/, /1—2 名专家评审/, /最多 20 页/]],
    ["/journals/columbia-junior-science-journal", [/2026-09-30/, /纯数学适配/, /官网未把它描述为双盲专业同行评审/]],
    ["/journals/rose-hulman-undergraduate-mathematics-journal", [/高中生/, /Sponsor/, /教师不得共同署名/, /转让全部版权/]],
    ["/journals/mathematical-reflections", [/编辑遴选型出版物/, /LaTeX 源码/, /题解署名/, /不等于同行评审论文/]],
    ["/journals/journal-of-integer-sequences", [/OEIS A-number/, /完全免费/, /中国邮箱/, /正文不得由 LLM 撰写/]],
  ]) {
    const html = await renderHtml(path);
    for (const pattern of patterns) assert.match(html, pattern, `${path}: ${pattern}`);
    assert.match(html, /官方投稿入口与材料/, path);
    assert.match(html, /最后更新/, path);
    assert.doesNotMatch(html, /加入规划器|Add to planner|研究节点|Research milestones/, path);
  }
});

test("renders a research skills matrix, proficiency standards and learning path", async () => {
  const directoryHtml = await renderHtml("/research");
  assert.match(directoryHtml, /href="\/research\/skills"/);
  assert.match(directoryHtml, /数学科研技能与工具/);

  const html = await renderHtml("/research/skills");
  for (const pattern of [
    /掌握程度怎么判断/,
    /所有数学研究都要具备的能力/,
    /软件与工具应掌握到什么程度/,
    /按研究类型选择技能组合/,
    /从基础到独立项目的学习路径/,
    /项目文件与研究记录/,
    /提交前的技术与诚信检查/,
  ]) {
    assert.match(html, pattern);
  }
  for (const tool of ["Python", "MATLAB", "LaTeX", "Jupyter", "Git", "Zotero", "SageMath", "SymPy"]) {
    assert.match(html, new RegExp(tool), tool);
  }
  for (const resourceId of [
    "research-skills-resource-mit-proof",
    "research-skills-resource-python",
    "research-skills-resource-matlab",
    "research-skills-resource-overleaf",
    "research-skills-resource-git",
    "research-skills-resource-zotero",
  ]) {
    assert.match(html, new RegExp(`data-resource-id="${resourceId}"`), resourceId);
  }
});

test("renders a mathematics social-practice guide with official resources", async () => {
  const directoryHtml = await renderHtml("/research");
  assert.match(directoryHtml, /数学相关社会实践与社区项目/);
  assert.match(directoryHtml, /Methods and practical guidance/);

  const html = await renderHtml("/research/math-social-practice");
  for (const pattern of [/数学公益课堂/, /公益数据分析/, /社区运筹优化/, /申请材料可使用的证据/, /隐私、版权与伦理/]) {
    assert.match(html, pattern);
  }
  for (const sourceLabel of ["Julia Robinson Mathematics Festival", "Math Circle Network", "Zooniverse", "国家统计局", "世界银行", "联合国儿童基金会"]) {
    assert.match(html, new RegExp(sourceLabel), sourceLabel);
  }
  assert.match(html, /id="official-learning-resources"/);
});

test("renders a searchable official-site directory without third-party sources", async () => {
  const html = await renderHtml("/official-sites");
  assert.match(html, /Official website directory/);
  assert.match(html, /data-static-component="official-sites"/);
  for (const groupId of ["competition", "modeling", "research", "journal", "summer", "curriculum", "assessment", "university-united-states", "university-united-kingdom", "university-singapore", "university-australia", "university-canada", "university-other-europe"]) {
    assert.match(html, new RegExp(`data-official-site-group="${groupId}"`), groupId);
  }
  for (const sourceId of ["sat-home", "act-home", "himcm-home", "aksf-home", "uk-ucas-how-to-apply", "sg-nus-gaokao-2026"]) {
    assert.match(html, new RegExp(`data-source-id="${sourceId}"`), sourceId);
  }
  assert.doesNotMatch(html, /data-source-kind="secondary-archive"/);
  const entryIds = [...html.matchAll(/data-entry-id="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(entryIds.length > 70, "official-site directory should contain project and university entries");
  assert.equal(new Set(entryIds).size, entryIds.length, "official-site directory contains duplicate entry IDs");
  for (const tag of html.match(/<a\b[^>]*data-source-kind="[^"]+"[^>]*>/g) ?? []) {
    assert.match(tag, /href="https:\/\//i, `official-site link is not HTTPS: ${tag}`);
  }
});

test("renders translated mathematics syllabus records and official materials", async () => {
  for (const [path, title] of [
    ["/syllabi/amc-8-current-scope", /AMC 8/],
    ["/syllabi/ap-calculus-ab-2026-27", /AP Calculus AB/],
    ["/syllabi/esat-2027-entry", /ESAT/],
  ]) {
    const html = await renderHtml(path);
    assert.match(html, title, path);
    assert.match(html, /中文译文说明/, path);
    assert.match(html, /Official sources and versions/, path);
    assert.match(html, /id="official-syllabus-materials"/, path);
    assert.match(html, /data-resource-id=/, path);
  }
});

test("renders past-paper sources, empty states and copyright notices", async () => {
  const directoryHtml = await renderHtml("/past-papers");
  assert.match(directoryHtml, /data-past-paper-id=/);
  assert.match(directoryHtml, /官方来源/);
  assert.match(directoryHtml, /第三方整理/);
  assert.match(directoryHtml, /暂未找到可核验的公开入口/);
  assert.match(directoryHtml, /does not copy or host test files/);

  for (const path of [
    "/competitions/amc-12",
    "/competitions/euclid",
    "/modeling/himcm",
    "/courses/ap-calculus-bc",
    "/assessments/sat",
    "/assessments/ukiset",
  ]) {
    const html = await renderHtml(path);
    assert.match(html, /id="past-papers"/, path);
    assert.match(html, /版权与链接说明/, path);
    assert.match(html, /does not copy or host test files/, path);
  }
});

test("limits mixed assessments and translated syllabi to mathematics", async () => {
  const forbidden = /Biology|Chemistry|Physics|English Test|English Essay|Reading and Writing|Verbal Reasoning|Non-verbal Reasoning|Spatial Ability/;
  for (const path of [
    "/assessments/sat",
    "/assessments/act",
    "/assessments/ssat",
    "/assessments/isee",
    "/assessments/ukiset",
    "/assessments/cat4",
    "/assessments/map-growth",
    "/assessments/esat",
    "/syllabi/sat-digital-current",
    "/syllabi/act-enhanced-current",
    "/syllabi/ssat-content-scope",
    "/syllabi/isee-content-scope",
    "/syllabi/ukiset-content-scope",
    "/syllabi/cat4-public-content-scope",
    "/syllabi/map-growth-content-framework",
    "/syllabi/esat-2027-entry",
  ]) {
    assert.doesNotMatch(await renderHtml(path), forbidden, path);
  }

  for (const path of [
    "/assessments/toefl-ibt",
    "/assessments/ielts-academic",
    "/syllabi/toefl-ibt-2026-content-scope",
    "/syllabi/ielts-academic-content-scope",
  ]) {
    const response = await render(path);
    assert.equal(response.status, 404, path);
  }
});

test("renders every project linked by a track directory", async () => {
  // Directory discovery also covers future mathematics admissions tests without reserving a slug for them.
  for (const directoryPath of ["/competitions", "/modeling", "/research", "/summer", "/courses", "/assessments"]) {
    const routes = childRoutes(await renderHtml(directoryPath), directoryPath);
    assert.ok(routes.length > 0, `${directoryPath} should expose at least one project route`);

    for (const path of routes) {
      const html = await renderHtml(path);
      assert.match(html, /来源|Sources/, path);
      assert.doesNotMatch(html, staleDemoCopy, path);
    }
  }
});
