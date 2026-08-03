import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the MathPath database home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /MathPath/);
  assert.match(html, /数学竞赛、建模、科研、夏校与考试数据库/);
  assert.match(html, /Mathematics competitions, modeling, research, summer programs and assessments/);
  assert.match(html, /href="\/catalog"/);
  assert.match(html, /href="\/archive"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|这是一个演示型规则引擎/i);
});

test("renders directory, archive and project routes", async () => {
  for (const [path, pattern] of [
    ["/catalog", /项目库/],
    ["/archive", /历年分数线与奖项档案/],
    ["/calendar", /日期与报名日历/],
    ["/competitions/amc-8", /AMC 8/],
    ["/summer/promys", /PROMYS/],
  ]) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), pattern, path);
  }
});

test("renders every project record", async () => {
  const records = [
    ["/competitions/amc-8", /AMC 8/],
    ["/competitions/amc-10", /AMC 10/],
    ["/competitions/amc-12", /AMC 12/],
    ["/competitions/aime", /AIME/],
    ["/competitions/euclid", /Euclid/],
    ["/competitions/pascal", /Pascal/],
    ["/competitions/cayley", /Cayley/],
    ["/competitions/fermat", /Fermat/],
    ["/competitions/smc", /Senior Mathematical Challenge/],
    ["/competitions/senior-kangaroo", /Senior Kangaroo/],
    ["/competitions/bmo-1", /British Mathematical Olympiad Round 1/],
    ["/competitions/bmo-2", /British Mathematical Olympiad Round 2/],
    ["/competitions/china-league", /全国高中数学联赛/],
    ["/competitions/cmo", /中国数学奥林匹克/],
    ["/modeling/himcm", /HiMCM/],
    ["/modeling/immc", /IMMC/],
    ["/research/start", /Starting Mathematical Research/],
    ["/research/records", /Research Records and Output Evidence/],
    ["/research/integrity", /研究诚信/],
    ["/summer/promys", /PROMYS/],
    ["/summer/sumac", /SUMaC/],
    ["/summer/mathcamp", /Mathcamp/],
    ["/summer/ross", /Ross/],
    ["/summer/mathily", /MathILy/],
    ["/summer/ssp", /Summer Science Program/],
    ["/assessments/sat", /SAT/],
    ["/assessments/ap-calculus", /AP Calculus/],
    ["/assessments/tmua", /TMUA/],
    ["/assessments/esat", /ESAT/],
    ["/assessments/step", /STEP/],
  ];

  for (const [path, pattern] of records) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, pattern, path);
    assert.match(html, /来源|Sources/, path);
    assert.doesNotMatch(html, /这是一个演示型规则引擎|正式版本可接入|Your site is taking shape/i, path);
  }
});
