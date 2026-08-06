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
}

class FakeD1 {
  prepareCalls: string[] = [];
  siteVisits = 0;
  siteVisitorKeys = new Set<string>();
  pageViewKeys = new Set<string>();
  pageViews = new Map<string, number>();
  pageLikes = new Map<string, Set<string>>();
  limits = new Map<string, number>();
  feedback: FeedbackRow[] = [];

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

  first(sql: string, params: unknown[]): unknown {
    if (sql.includes("/* stats */")) {
      const path = String(params[0]);
      const visitorHash = String(params[1]);
      const likes = this.pageLikes.get(path) ?? new Set<string>();
      return {
        site_visits: this.siteVisits,
        page_views: this.pageViews.get(path) ?? 0,
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
    throw new Error(`Unexpected first() SQL: ${sql}`);
  }

  run(sql: string, params: unknown[]): number {
    if (sql.includes("/* insert_site_visit */")) {
      const key = `${params[0]}|${params[1]}`;
      if (this.siteVisitorKeys.has(key)) return 0;
      this.siteVisitorKeys.add(key);
      this.siteVisits += 1;
      return 1;
    }
    if (sql.includes("/* insert_page_view */")) {
      const path = String(params[1]);
      const key = `${params[0]}|${path}|${params[2]}`;
      if (this.pageViewKeys.has(key)) return 0;
      this.pageViewKeys.add(key);
      this.pageViews.set(path, (this.pageViews.get(path) ?? 0) + 1);
      return 1;
    }
    if (sql.includes("/* insert_like */")) {
      const path = String(params[0]);
      const visitorHash = String(params[1]);
      const likes = this.pageLikes.get(path) ?? new Set<string>();
      if (likes.has(visitorHash)) return 0;
      likes.add(visitorHash);
      this.pageLikes.set(path, likes);
      return 1;
    }
    if (sql.includes("/* delete_like */")) {
      const likes = this.pageLikes.get(String(params[0]));
      return likes?.delete(String(params[1])) ? 1 : 0;
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
      });
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
    PAGE_PATH_PREFIXES: PREFIX,
    DAY_TIME_ZONE: "Asia/Shanghai",
    ...overrides,
  };
}

function request(
  pathname: string,
  options: { method?: string; body?: unknown; origin?: string; ip?: string } = {},
): Request {
  const headers = new Headers({
    Origin: options.origin ?? ORIGIN,
    "CF-Connecting-IP": options.ip ?? "203.0.113.9",
  });
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  return new Request(`https://engagement.example${pathname}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
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
  assert.deepEqual(await json(first), { siteVisits: 1, pageViews: 1, likes: 0, liked: false });

  const repeat = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_A, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(repeat), { siteVisits: 1, pageViews: 1, likes: 0, liked: false });

  const secondPage = await handleRequest(
    request("/v1/view", { method: "POST", body: { path: PATH_B, visitorId: VISITOR_A } }),
    env,
    NOW,
  );
  assert.deepEqual(await json(secondPage), { siteVisits: 1, pageViews: 1, likes: 0, liked: false });

  const secondVisitor = await handleRequest(
    request("/v1/view", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_B },
      ip: "203.0.113.10",
    }),
    env,
    NOW,
  );
  assert.deepEqual(await json(secondVisitor), { siteVisits: 2, pageViews: 2, likes: 0, liked: false });
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
  assert.deepEqual(await json(await add()), { siteVisits: 0, pageViews: 0, likes: 1, liked: true });
  assert.deepEqual(await json(await add()), { siteVisits: 0, pageViews: 0, likes: 1, liked: true });

  const remove = await handleRequest(
    request("/v1/like", {
      method: "POST",
      body: { path: PATH_A, visitorId: VISITOR_A, active: false },
    }),
    env,
    NOW,
  );
  assert.deepEqual(await json(remove), { siteVisits: 0, pageViews: 0, likes: 0, liked: false });
});

test("stats returns the same four fields including the visitor like state", async () => {
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
  assert.deepEqual(await json(response), { siteVisits: 0, pageViews: 0, likes: 1, liked: true });
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
    assert.deepEqual(await json(verified), { siteVisits: 0, pageViews: 0, likes: 1, liked: true });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
