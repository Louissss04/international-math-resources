import assert from "node:assert/strict";
import test from "node:test";

import {
  dayKey,
  handleRequest,
  hashIdentifier,
  normalizePath,
  type Env,
} from "../src/index.js";

const ORIGIN = "https://louissss04.github.io";
const PREFIX = "/";
const PATH_A = "/competitions/amc-12";
const PATH_B = "/modeling/himcm";
const VISITOR_A = "550e8400-e29b-41d4-a716-446655440000";
const VISITOR_B = "9f1c2a30-672d-4e9f-8f2d-2f883810be44";
const SUBMISSION_A = "1c23d456-789a-4bcd-8efa-1234567890ab";
const NOW = new Date("2026-08-06T03:00:00.000Z");
const ADMIN_ORIGIN = "https://engagement.example";
const ADMIN_PASSWORD = "Correct Horse Battery Staple 2026!";
const ADMIN_PASSWORD_HASH = "pbkdf2-sha256$600000$MDEyMzQ1Njc4OWFiY2RlZg$H_2f0OonkYqWfnleKNEHb75FwiBcPMaTYMfa_TPjAmk";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type FeedbackRow = {
  receiptId: string;
  submissionId: string;
  path: string;
  visitorHash: string;
  category: string;
  message: string;
  contact: string | null;
  language: string;
  status: "new" | "reviewing" | "resolved" | "archived";
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  internalNote: string | null;
};

type DailyMetric = {
  siteVisits: number;
  pageViews: number;
  feedbackSubmissions: number;
  likesAdded: number;
  likesRemoved: number;
};

class FakeStatement {
  readonly db: FakeD1;
  readonly sql: string;
  params: unknown[] = [];

  constructor(db: FakeD1, sql: string) {
    this.db = db;
    this.sql = sql;
  }

  bind(...params: unknown[]): FakeStatement {
    const statement = new FakeStatement(this.db, this.sql);
    statement.params = params;
    return statement;
  }

  first<T>(): Promise<T | null> {
    return Promise.resolve(this.db.first(this.sql, this.params) as T | null);
  }

  run<T>(): Promise<{ success: true; results: T[]; meta: { changes: number } }> {
    const changes = this.db.run(this.sql, this.params);
    return Promise.resolve({ success: true, results: [], meta: { changes } });
  }

  all<T>(): Promise<{ success: true; results: T[]; meta: Record<string, never> }> {
    return Promise.resolve({
      success: true,
      results: this.db.all(this.sql, this.params) as T[],
      meta: {},
    });
  }
}

class FakeD1 {
  prepareCalls: string[] = [];
  siteVisits = 0;
  siteVisitorKeys = new Set<string>();
  pageViewKeys = new Set<string>();
  pageViews = new Map<string, number>();
  pageLikes = new Map<string, Set<string>>();
  pendingLikeRemovalDays = new Map<string, string>();
  limits = new Map<string, number>();
  feedback: FeedbackRow[] = [];
  sessions = new Map<string, string>();
  dailyMetrics = new Map<string, DailyMetric>();
  feedbackAuditCount = 0;

  prepare(sql: string): FakeStatement {
    this.prepareCalls.push(sql);
    return new FakeStatement(this, sql);
  }

  async batch(statements: FakeStatement[]): Promise<unknown[]> {
    return statements.map((statement) => ({
      success: true,
      results: [],
      meta: { changes: this.run(statement.sql, statement.params) },
    }));
  }

  metric(day: string): DailyMetric {
    const existing = this.dailyMetrics.get(day);
    if (existing) return existing;
    const created = { siteVisits: 0, pageViews: 0, feedbackSubmissions: 0, likesAdded: 0, likesRemoved: 0 };
    this.dailyMetrics.set(day, created);
    return created;
  }

  feedbackDbRow(row: FeedbackRow): Record<string, unknown> {
    return {
      receipt_id: row.receiptId,
      path: row.path,
      category: row.category,
      message: row.message,
      contact: row.contact,
      language: row.language,
      status: row.status,
      created_at: row.createdAt,
      updated_at: row.updatedAt,
      resolved_at: row.resolvedAt,
      internal_note: row.internalNote,
    };
  }

  filteredFeedback(sql: string, params: unknown[], trailing: number): FeedbackRow[] {
    let index = 0;
    let rows = [...this.feedback];
    if (sql.includes("status = ?")) {
      const status = String(params[index++]);
      rows = rows.filter((row) => row.status === status);
    }
    if (sql.includes("category = ?")) {
      const category = String(params[index++]);
      rows = rows.filter((row) => row.category === category);
    }
    if (sql.includes("path = ?")) {
      const path = String(params[index++]);
      rows = rows.filter((row) => row.path === path);
    }
    if (sql.includes("created_at >= ?")) {
      const from = String(params[index++]);
      rows = rows.filter((row) => row.createdAt >= from);
    }
    if (sql.includes("created_at < ?")) {
      const to = String(params[index++]);
      rows = rows.filter((row) => row.createdAt < to);
    }
    if (sql.includes("message LIKE ?")) {
      const query = String(params[index++]).slice(1, -1).replace(/\\([\\%_])/g, "$1").toLowerCase();
      index += 2;
      rows = rows.filter((row) => `${row.message} ${row.contact ?? ""} ${row.path}`.toLowerCase().includes(query));
    }
    rows.sort((left, right) => right.createdAt.localeCompare(left.createdAt) || right.receiptId.localeCompare(left.receiptId));
    if (trailing === 2) {
      const limit = Number(params[index]);
      const offset = Number(params[index + 1]);
      return rows.slice(offset, offset + limit);
    }
    if (trailing === 1) return rows.slice(0, Number(params[index]));
    return rows;
  }

  all(sql: string, params: unknown[]): unknown[] {
    if (sql.includes("/* admin_daily_visits */")) {
      const from = String(params[0]);
      const to = String(params[1]);
      return [...this.dailyMetrics.entries()]
        .filter(([day]) => day >= from && day <= to)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([day, row]) => ({
          day,
          site_visits: row.siteVisits,
          page_views: row.pageViews,
          feedback_submissions: row.feedbackSubmissions,
          likes_added: row.likesAdded,
          likes_removed: row.likesRemoved,
        }));
    }
    if (sql.includes("/* admin_page_ranking */")) {
      return [...this.pageViews.entries()]
        .map(([path, pageViews]) => ({ path, page_views: pageViews, likes: this.pageLikes.get(path)?.size ?? 0 }))
        .sort((left, right) => right.page_views - left.page_views || right.likes - left.likes || left.path.localeCompare(right.path))
        .slice(0, Number(params[0]));
    }
    if (sql.includes("/* admin_feedback_status_counts */")) {
      const counts = new Map<string, number>();
      for (const row of this.feedback) counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
      return [...counts].map(([status, count]) => ({ status, count }));
    }
    if (sql.includes("/* admin_feedback_list */")) {
      return this.filteredFeedback(sql, params, 2).map((row) => this.feedbackDbRow(row));
    }
    if (sql.includes("/* admin_feedback_export */")) {
      return this.filteredFeedback(sql, params, 1).map((row) => this.feedbackDbRow(row));
    }
    throw new Error(`Unexpected all() SQL: ${sql}`);
  }

  first(sql: string, params: unknown[]): unknown {
    if (sql.includes("/* stats */")) {
      const path = String(params[0]);
      const visitorHash = String(params[1]);
      const likes = this.pageLikes.get(path) ?? new Set<string>();
      return {
        likes: likes.size,
        liked: likes.has(visitorHash) ? 1 : 0,
      };
    }
    if (sql.includes("/* consume_limit */")) {
      const key = `${params[0]}|${params[1]}|${params[2]}`;
      const limit = Number(params[3]);
      const current = this.limits.get(key) ?? 0;
      if (current >= limit) return null;
      this.limits.set(key, current + 1);
      return { request_count: current + 1 };
    }
    if (sql.includes("/* consume_admin_login */")) {
      const key = `admin|${params[0]}|${params[1]}`;
      const limit = Number(params[2]);
      const current = this.limits.get(key) ?? 0;
      if (current >= limit) return null;
      this.limits.set(key, current + 1);
      return { request_count: current + 1 };
    }
    if (sql.includes("/* select_like */")) {
      const likes = this.pageLikes.get(String(params[0]));
      return likes?.has(String(params[1])) ? { present: 1 } : null;
    }
    if (sql.includes("/* select_feedback_receipt */")) {
      const row = this.feedback.find(
        (item) => item.visitorHash === params[0] && item.submissionId === params[1],
      );
      return row ? { receipt_id: row.receiptId } : null;
    }
    if (sql.includes("/* select_admin_session */")) {
      const expires = this.sessions.get(String(params[0]));
      return expires ? { expires_at: expires } : null;
    }
    if (sql.includes("/* admin_global_stats */")) return { site_visits: this.siteVisits };
    if (sql.includes("/* admin_page_totals */")) {
      return {
        page_views: [...this.pageViews.values()].reduce((sum, count) => sum + count, 0),
        likes: [...this.pageLikes.values()].reduce((sum, likes) => sum + likes.size, 0),
      };
    }
    if (sql.includes("/* admin_feedback_count */")) {
      return { count: this.filteredFeedback(sql, params, 0).length };
    }
    if (sql.includes("/* admin_feedback_detail */")) {
      const row = this.feedback.find((item) => item.receiptId === params[0]);
      return row ? this.feedbackDbRow(row) : null;
    }
    throw new Error(`Unexpected first() SQL: ${sql}`);
  }

  run(sql: string, params: unknown[]): number {
    if (sql.includes("/* insert_site_visit */")) {
      const key = `${params[0]}|${params[1]}`;
      if (this.siteVisitorKeys.has(key)) return 0;
      this.siteVisitorKeys.add(key);
      this.siteVisits += 1;
      this.metric(String(params[0])).siteVisits += 1;
      return 1;
    }
    if (sql.includes("/* insert_page_view */")) {
      const path = String(params[1]);
      const key = `${params[0]}|${path}|${params[2]}`;
      if (this.pageViewKeys.has(key)) return 0;
      this.pageViewKeys.add(key);
      this.pageViews.set(path, (this.pageViews.get(path) ?? 0) + 1);
      this.metric(String(params[0])).pageViews += 1;
      return 1;
    }
    if (sql.includes("/* insert_like */")) {
      const path = String(params[0]);
      const visitorHash = String(params[1]);
      const likes = this.pageLikes.get(path) ?? new Set<string>();
      if (likes.has(visitorHash)) return 0;
      likes.add(visitorHash);
      this.pageLikes.set(path, likes);
      this.metric(String(params[2])).likesAdded += 1;
      return 1;
    }
    if (sql.includes("/* mark_like_removal */")) {
      const key = `${params[1]}|${params[2]}`;
      const exists = this.pageLikes.get(String(params[1]))?.has(String(params[2])) ?? false;
      if (exists) this.pendingLikeRemovalDays.set(key, String(params[0]));
      return exists ? 1 : 0;
    }
    if (sql.includes("/* delete_like */")) {
      const path = String(params[0]);
      const visitorHash = String(params[1]);
      const likes = this.pageLikes.get(path);
      const deleted = likes?.delete(visitorHash) ?? false;
      if (deleted) {
        const key = `${path}|${visitorHash}`;
        const day = this.pendingLikeRemovalDays.get(key);
        if (day) this.metric(day).likesRemoved += 1;
        this.pendingLikeRemovalDays.delete(key);
      }
      return deleted ? 1 : 0;
    }
    if (sql.includes("/* insert_feedback */")) {
      const duplicate = this.feedback.some(
        (item) => item.visitorHash === params[3] && item.submissionId === params[1],
      );
      if (duplicate) return 0;
      this.feedback.push({
        receiptId: String(params[0]),
        submissionId: String(params[1]),
        path: String(params[2]),
        visitorHash: String(params[3]),
        category: String(params[4]),
        message: String(params[5]),
        contact: params[6] === null ? null : String(params[6]),
        language: String(params[7]),
        status: "new",
        createdAt: "2026-08-06 03:00:00",
        updatedAt: "2026-08-06 03:00:00",
        resolvedAt: null,
        internalNote: null,
      });
      this.metric(String(params[8])).feedbackSubmissions += 1;
      return 1;
    }
    if (sql.includes("/* delete_expired_admin_sessions */")) {
      let changes = 0;
      for (const [key, expires] of this.sessions) {
        if (expires <= String(params[0])) {
          this.sessions.delete(key);
          changes += 1;
        }
      }
      return changes;
    }
    if (sql.includes("/* insert_admin_session */")) {
      this.sessions.set(String(params[0]), String(params[1]));
      return 1;
    }
    if (sql.includes("/* delete_admin_session */")) {
      return this.sessions.delete(String(params[0])) ? 1 : 0;
    }
    if (sql.includes("/* admin_update_feedback_status */")) {
      const row = this.feedback.find((item) => item.receiptId === params[2]);
      if (!row) return 0;
      row.status = String(params[0]) as FeedbackRow["status"];
      row.internalNote = params[1] === null ? null : String(params[1]);
      row.updatedAt = "2026-08-06 03:01:00";
      row.resolvedAt = row.status === "resolved" ? (row.resolvedAt ?? row.updatedAt) : null;
      return 1;
    }
    if (sql.includes("/* admin_insert_feedback_audit */")) {
      this.feedbackAuditCount += 1;
      return 1;
    }
    throw new Error(`Unexpected run() SQL: ${sql}`);
  }
}

function makeEnv(db = new FakeD1(), overrides: Partial<Env> = {}): Env {
  return {
    DB: db as unknown as D1Database,
    CORS_ALLOWED_ORIGINS: ORIGIN,
    HASH_SECRET: "test-secret-that-is-longer-than-thirty-two-characters",
    ADMIN_PASSWORD_HASH,
    ADMIN_SESSION_SECRET: "test-admin-session-secret-that-is-at-least-thirty-two-characters",
    PAGE_PATH_PREFIXES: PREFIX,
    DAY_TIME_ZONE: "Asia/Shanghai",
    ...overrides,
  };
}

function request(
  pathname: string,
  options: {
    method?: string;
    body?: unknown;
    origin?: string;
    ip?: string;
    cookie?: string;
    csrf?: string;
    fetchSite?: string;
  } = {},
): Request {
  const headers = new Headers({
    Origin: options.origin ?? ORIGIN,
    "CF-Connecting-IP": options.ip ?? "203.0.113.9",
  });
  if (options.cookie) headers.set("Cookie", options.cookie);
  if (options.csrf) headers.set("X-CSRF-Token", options.csrf);
  if (options.fetchSite) headers.set("Sec-Fetch-Site", options.fetchSite);
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  return new Request(`https://engagement.example${pathname}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

function adminRequest(
  pathname: string,
  options: Parameters<typeof request>[1] = {},
): Request {
  return request(pathname, {
    origin: ADMIN_ORIGIN,
    fetchSite: "same-origin",
    ...options,
  });
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

function feedbackBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    path: PATH_A,
    visitorId: VISITOR_A,
    category: "content_error",
    message: "页面中的一项日期可能需要复核。",
    contact: "reader@example.com",
    website: "",
    submissionId: SUBMISSION_A,
    language: "zh-CN",
    ...overrides,
  };
}

async function loginAdmin(env: Env, now = NOW): Promise<{ cookie: string; csrf: string; response: Response }> {
  const response = await handleRequest(
    adminRequest("/admin/api/login", { method: "POST", body: { password: ADMIN_PASSWORD } }),
    env,
    now,
  );
  const body = await json(response);
  const setCookie = response.headers.get("Set-Cookie") ?? "";
  assert.equal(response.status, 200);
  assert.equal(body.authenticated, true);
  assert.match(String(body.csrfToken), /^[A-Za-z0-9_-]{43}$/);
  assert.match(setCookie, /^__Host-math_admin=[A-Za-z0-9_-]{43};/);
  return {
    cookie: setCookie.split(";", 1)[0] ?? "",
    csrf: String(body.csrfToken),
    response,
  };
}

test("uses the configured China day and validates site paths", () => {
  assert.equal(dayKey(new Date("2026-08-05T16:01:00Z"), "Asia/Shanghai"), "2026-08-06");
  assert.equal(normalizePath("/", [PREFIX]), "/");
  assert.equal(normalizePath("/competitions/amc-12", [PREFIX]), "/competitions/amc-12");
  assert.throws(() => normalizePath("relative/path", [PREFIX]), /not an accepted site path/);
  assert.throws(() => normalizePath("/../secret", [PREFIX]), /not an accepted site path/);
});

test("HMAC pseudonyms are stable and do not expose the browser ID", async () => {
  const first = await hashIdentifier("a".repeat(32), "browser-v1", VISITOR_A);
  const again = await hashIdentifier("a".repeat(32), "browser-v1", VISITOR_A);
  const otherSecret = await hashIdentifier("b".repeat(32), "browser-v1", VISITOR_A);
  assert.equal(first, again);
  assert.notEqual(first, otherSecret);
  assert.equal(first.includes(VISITOR_A), false);
  assert.match(first, /^[A-Za-z0-9_-]{43}$/);
});

test("CORS accepts only an exact configured origin", async () => {
  const env = makeEnv();
  const preflight = await handleRequest(request("/v1/view", { method: "OPTIONS" }), env, NOW);
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), ORIGIN);

  const rejected = await handleRequest(
    request(`/v1/stats?path=${encodeURIComponent(PATH_A)}&visitorId=${VISITOR_A}`, {
      origin: `${ORIGIN}.evil.example`,
    }),
    env,
    NOW,
  );
  assert.equal(rejected.status, 403);
  assert.equal(rejected.headers.has("Access-Control-Allow-Origin"), false);
});

test("view counts are deduplicated per site/day and page/day", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const first = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_A, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(first), { likes: 0, liked: false });

  const repeat = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_A, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(repeat), { likes: 0, liked: false });

  const secondPage = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_B, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(secondPage), { likes: 0, liked: false });

  const secondVisitor = await handleRequest(
    request("/v1/view", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_B },
      ip: "203.0.113.10",
    }),
    env,
    NOW,
  );
  assert.deepEqual(await json(secondVisitor), { likes: 0, liked: false });
  assert.equal(db.siteVisits, 2, "visits remain available only to the private administrator API");
  assert.equal(db.pageViews.get(PATH_A), 2);
  assert.ok(db.prepareCalls.length > 0, "all D1 access should go through prepared statements");
});

test("like active state is idempotent and removable", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const add = () => handleRequest(
    request("/v1/like", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_A, active: true },
    }),
    env,
    NOW,
  );
  assert.deepEqual(await json(await add()), { likes: 1, liked: true });
  assert.deepEqual(await json(await add()), { likes: 1, liked: true });

  const remove = await handleRequest(
    request("/v1/like", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_A, active: false },
    }),
    env,
    NOW,
  );
  assert.deepEqual(await json(remove), { likes: 0, liked: false });
});

test("public stats returns only likes and the visitor like state", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  await handleRequest(
    request("/v1/like", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_A, active: true },
    }),
    env,
    NOW,
  );
  const response = await handleRequest(
    request(`/v1/stats?path=${encodeURIComponent(PATH_A)}&visitorId=${VISITOR_A}`),
    env,
    NOW,
  );
  assert.deepEqual(await json(response), { likes: 1, liked: true });
});

test("feedback is private, validated, idempotent and returns a receipt", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const submit = () => handleRequest(
    request("/v1/feedback", { method: "POST", body: feedbackBody() }),
    env,
    NOW,
  );
  const first = await submit();
  const firstBody = await json(first);
  assert.equal(first.status, 202);
  assert.equal(firstBody.status, "received");
  assert.match(String(firstBody.receiptId), UUID_PATTERN);
  assert.equal(db.feedback.length, 1);
  assert.notEqual(db.feedback[0]?.visitorHash, VISITOR_A);

  const retry = await submit();
  assert.deepEqual(await json(retry), firstBody);
  assert.equal(db.feedback.length, 1);

  const publicRead = await handleRequest(request("/v1/feedback"), env, NOW);
  assert.equal(publicRead.status, 404);

  const invalid = await handleRequest(
    request("/v1/feedback", {
      method: "POST",
      body: feedbackBody({ category: "anything", submissionId: crypto.randomUUID() }),
    }),
    env,
    NOW,
  );
  assert.equal(invalid.status, 400);

  const dateUpdate = await handleRequest(
    request("/v1/feedback", {
      method: "POST",
      body: feedbackBody({ category: "date_update", submissionId: crypto.randomUUID() }),
    }),
    env,
    NOW,
  );
  assert.equal(dateUpdate.status, 202);
});

test("honeypot submissions are acknowledged without storage", async () => {
  const db = new FakeD1();
  const response = await handleRequest(
    request("/v1/feedback", {
      method: "POST",
      body: { website: "https://spam.example", arbitrary: "bot payload" },
    }),
    makeEnv(db),
    NOW,
  );
  const body = await json(response);
  assert.equal(response.status, 202);
  assert.equal(body.status, "received");
  assert.equal(db.feedback.length, 0);
});

test("feedback daily browser limit is enforced", async () => {
  const db = new FakeD1();
  const env = makeEnv(db, { FEEDBACK_BROWSER_DAILY_LIMIT: "2" });
  for (let index = 0; index < 2; index += 1) {
    const response = await handleRequest(
      request("/v1/feedback", {
        method: "POST",
        body: feedbackBody({ submissionId: crypto.randomUUID() }),
      }),
      env,
      NOW,
    );
    assert.equal(response.status, 202);
  }
  const limited = await handleRequest(
    request("/v1/feedback", {
      method: "POST",
      body: feedbackBody({ submissionId: crypto.randomUUID() }),
    }),
    env,
    NOW,
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "86400");
  assert.equal(db.feedback.length, 2);
});

test("configured Turnstile fails closed and validates action and hostname", async () => {
  const db = new FakeD1();
  const env = makeEnv(db, { TURNSTILE_SECRET: "turnstile-secret" });
  const missing = await handleRequest(
    request("/v1/like", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_A, active: true },
    }),
    env,
    NOW,
  );
  assert.equal(missing.status, 403);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    success: true,
    hostname: "louissss04.github.io",
    action: "like",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
  try {
    const verified = await handleRequest(
      request("/v1/like", {
        method: "POST",
        body: {
          path: PATH_A,
          visitorId: VISITOR_A,
          active: true,
          turnstileToken: "valid-test-token",
        },
      }),
      env,
      NOW,
    );
    assert.deepEqual(await json(verified), { likes: 1, liked: true });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("administrator interface serves only allowlisted assets with restrictive headers", async () => {
  const requestedPaths: string[] = [];
  const assets = {
    async fetch(input: RequestInfo | URL): Promise<Response> {
      const assetRequest = input instanceof Request ? input : new Request(input);
      const pathname = new URL(assetRequest.url).pathname;
      requestedPaths.push(pathname);
      if (pathname === "/index.html") {
        return new Response("<!doctype html><title>Administrator</title>", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }
      if (pathname === "/app.js") {
        return new Response("export {};", {
          headers: { "Content-Type": "text/javascript; charset=utf-8" },
        });
      }
      return new Response("Not Found", { status: 404 });
    },
  } as unknown as Fetcher;
  const env = makeEnv(new FakeD1(), {
    ASSETS: assets,
    CORS_ALLOWED_ORIGINS: "",
    HASH_SECRET: "",
  });

  const redirect = await handleRequest(adminRequest("/admin?from=bookmark"), env, NOW);
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("Location"), "/admin/?from=bookmark");
  assert.deepEqual(requestedPaths, []);

  const page = await handleRequest(adminRequest("/admin/?ignored=1"), env, NOW);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Administrator/);
  assert.deepEqual(requestedPaths, ["/index.html"]);
  assert.equal(page.headers.get("Cache-Control"), "no-store, private");
  assert.equal(page.headers.get("X-Robots-Tag"), "noindex, nofollow, noarchive");
  assert.equal(page.headers.get("X-Frame-Options"), "DENY");
  assert.equal(page.headers.get("Access-Control-Allow-Origin"), null);
  assert.match(page.headers.get("Content-Security-Policy") ?? "", /script-src 'self'/);
  assert.equal((page.headers.get("Content-Security-Policy") ?? "").includes("unsafe-inline"), false);

  const script = await handleRequest(adminRequest("/admin/app.js"), env, NOW);
  assert.equal(script.status, 200);
  assert.equal(requestedPaths.at(-1), "/app.js");

  const unknown = await handleRequest(adminRequest("/admin/private.txt"), env, NOW);
  assert.equal(unknown.status, 404);
  assert.deepEqual(requestedPaths, ["/index.html", "/app.js"]);

  const rejectedMethod = await handleRequest(
    adminRequest("/admin/", { method: "POST" }),
    env,
    NOW,
  );
  assert.equal(rejectedMethod.status, 405);
  assert.equal(rejectedMethod.headers.get("Allow"), "GET, HEAD");
});

test("administrator login uses a server-side HttpOnly session and exposes no admin CORS", async () => {
  const env = makeEnv();
  const anonymousSession = await handleRequest(adminRequest("/admin/api/session"), env, NOW);
  assert.deepEqual(await json(anonymousSession), { authenticated: false });
  assert.equal(anonymousSession.headers.has("Access-Control-Allow-Origin"), false);

  const anonymousFeedback = await handleRequest(adminRequest("/admin/api/feedback"), env, NOW);
  assert.equal(anonymousFeedback.status, 401);
  assert.equal(anonymousFeedback.headers.has("Access-Control-Allow-Origin"), false);

  const crossSite = await handleRequest(
    adminRequest("/admin/api/login", {
      method: "POST",
      body: { password: ADMIN_PASSWORD },
      origin: "https://attacker.example",
      fetchSite: "cross-site",
    }),
    env,
    NOW,
  );
  assert.equal(crossSite.status, 403);

  const { cookie, csrf, response } = await loginAdmin(env);
  const setCookie = response.headers.get("Set-Cookie") ?? "";
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Strict/);
  assert.equal(setCookie.includes("Domain="), false);
  assert.equal(response.headers.get("Cache-Control"), "no-store, private");
  assert.equal(response.headers.has("Access-Control-Allow-Origin"), false);

  const session = await handleRequest(
    adminRequest("/admin/api/session", { cookie }),
    env,
    NOW,
  );
  const sessionBody = await json(session);
  assert.equal(sessionBody.authenticated, true);
  assert.equal(sessionBody.csrfToken, csrf);
  assert.equal(JSON.stringify(sessionBody).includes(cookie), false);
});

test("administrator dashboard reads durable trends while public responses hide visit totals", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const view = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_A, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(view), { likes: 0, liked: false });
  await handleRequest(
    request("/v1/like", { method: "POST", body: { path: PATH_A, visitorId: VISITOR_A, active: true } }),
    env,
    NOW,
  );
  await handleRequest(
    request("/v1/feedback", { method: "POST", body: feedbackBody() }),
    env,
    NOW,
  );

  const { cookie } = await loginAdmin(env);
  const response = await handleRequest(
    adminRequest("/admin/api/dashboard?range=7d", { cookie }),
    env,
    NOW,
  );
  const body = await json(response) as {
    totals: Record<string, number>;
    trend: Array<Record<string, number | string>>;
    pages: Array<Record<string, number | string>>;
    feedbackByStatus: Record<string, number>;
  };
  assert.equal(response.status, 200);
  assert.deepEqual(body.totals, { siteVisits: 1, pageViews: 1, likes: 1, feedback: 1 });
  assert.equal(body.trend.length, 7);
  assert.deepEqual(body.trend.at(-1), {
    date: "2026-08-06",
    siteVisits: 1,
    pageViews: 1,
    feedbackSubmissions: 1,
    likesAdded: 1,
    likesRemoved: 0,
  });
  assert.deepEqual(body.pages[0], { path: PATH_A, pageViews: 1, likes: 1 });
  assert.equal(body.feedbackByStatus.new, 1);
});

test("feedback management requires a session-bound CSRF token and records an audit", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  const submitted = await handleRequest(
    request("/v1/feedback", { method: "POST", body: feedbackBody() }),
    env,
    NOW,
  );
  const receiptId = String((await json(submitted)).receiptId);
  const { cookie, csrf } = await loginAdmin(env);

  const list = await handleRequest(
    adminRequest("/admin/api/feedback?status=new&page=1&pageSize=10", { cookie }),
    env,
    NOW,
  );
  const listBody = await json(list) as { total: number; totalPages: number; items: Array<Record<string, unknown>> };
  assert.equal(listBody.total, 1);
  assert.equal(listBody.totalPages, 1);
  assert.equal(listBody.items[0]?.contact, "reader@example.com");
  assert.equal("visitorHash" in (listBody.items[0] ?? {}), false);

  const detail = await handleRequest(
    adminRequest(`/admin/api/feedback/${receiptId}`, { cookie }),
    env,
    NOW,
  );
  assert.equal(detail.status, 200);

  const missingCsrf = await handleRequest(
    adminRequest(`/admin/api/feedback/${receiptId}`, {
      method: "PATCH",
      cookie,
      body: { status: "resolved" },
    }),
    env,
    NOW,
  );
  assert.equal(missingCsrf.status, 403);

  const updated = await handleRequest(
    adminRequest(`/admin/api/feedback/${receiptId}`, {
      method: "PATCH",
      cookie,
      csrf,
      body: { status: "resolved", internalNote: "已核对并修正页面。" },
    }),
    env,
    NOW,
  );
  const updatedBody = await json(updated) as { item: Record<string, unknown> };
  assert.equal(updatedBody.item.status, "resolved");
  assert.equal(updatedBody.item.internalNote, "已核对并修正页面。");
  assert.equal(typeof updatedBody.item.resolvedAt, "string");
  assert.equal(db.feedbackAuditCount, 1);

  const reusedWrongOrigin = await handleRequest(
    adminRequest(`/admin/api/feedback/${receiptId}`, {
      method: "PATCH",
      cookie,
      csrf,
      body: { status: "archived" },
      origin: "https://attacker.example",
      fetchSite: "cross-site",
    }),
    env,
    NOW,
  );
  assert.equal(reusedWrongOrigin.status, 403);
});

test("feedback CSV export is POST-only, CSRF-protected and neutralizes spreadsheet formulas", async () => {
  const db = new FakeD1();
  const env = makeEnv(db);
  await handleRequest(
    request("/v1/feedback", {
      method: "POST",
      body: feedbackBody({
        message: "=HYPERLINK(\"https://evil.example\",\"click\")",
        contact: "+1+1@example.invalid",
      }),
    }),
    env,
    NOW,
  );
  const { cookie, csrf } = await loginAdmin(env);

  const getExport = await handleRequest(
    adminRequest("/admin/api/feedback.csv", { cookie }),
    env,
    NOW,
  );
  assert.equal(getExport.status, 404);
  const missingCsrf = await handleRequest(
    adminRequest("/admin/api/feedback.csv", { method: "POST", cookie }),
    env,
    NOW,
  );
  assert.equal(missingCsrf.status, 403);

  const exported = await handleRequest(
    adminRequest("/admin/api/feedback.csv?status=new", { method: "POST", cookie, csrf }),
    env,
    NOW,
  );
  const bytes = new Uint8Array(await exported.arrayBuffer());
  const csv = new TextDecoder().decode(bytes);
  assert.equal(exported.status, 200);
  assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf]);
  assert.match(exported.headers.get("Content-Disposition") ?? "", /^attachment;/);
  assert.match(csv, /"'=HYPERLINK/);
  assert.match(csv, /"'\+1\+1@example\.invalid"/);
  assert.equal(exported.headers.has("Access-Control-Allow-Origin"), false);
});

test("logout requires CSRF and invalidates the D1 session", async () => {
  const env = makeEnv();
  const { cookie, csrf } = await loginAdmin(env);
  const missingCsrf = await handleRequest(
    adminRequest("/admin/api/logout", { method: "POST", cookie }),
    env,
    NOW,
  );
  assert.equal(missingCsrf.status, 403);

  const logout = await handleRequest(
    adminRequest("/admin/api/logout", { method: "POST", cookie, csrf }),
    env,
    NOW,
  );
  assert.deepEqual(await json(logout), { authenticated: false });
  assert.match(logout.headers.get("Set-Cookie") ?? "", /Max-Age=0/);

  const after = await handleRequest(adminRequest("/admin/api/session", { cookie }), env, NOW);
  assert.deepEqual(await json(after), { authenticated: false });
});

test("administrator credentials fail closed and login attempts are rate-limited", async () => {
  const badConfig = makeEnv(new FakeD1(), { ADMIN_PASSWORD_HASH: "plaintext-password" });
  const unavailable = await handleRequest(
    adminRequest("/admin/api/login", { method: "POST", body: { password: ADMIN_PASSWORD } }),
    badConfig,
    NOW,
  );
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.has("Set-Cookie"), false);

  const db = new FakeD1();
  const limitedEnv = makeEnv(db, { ADMIN_LOGIN_NETWORK_LIMIT: "2" });
  for (let index = 0; index < 2; index += 1) {
    const rejected = await handleRequest(
      adminRequest("/admin/api/login", { method: "POST", body: { password: "too-short" } }),
      limitedEnv,
      NOW,
    );
    assert.equal(rejected.status, 401);
  }
  const limited = await handleRequest(
    adminRequest("/admin/api/login", { method: "POST", body: { password: ADMIN_PASSWORD } }),
    limitedEnv,
    NOW,
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "900");
});
