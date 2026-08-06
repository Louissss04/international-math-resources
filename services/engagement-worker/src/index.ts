export interface Env {
  DB: D1Database;
  CORS_ALLOWED_ORIGINS: string;
  HASH_SECRET: string;
  PAGE_PATH_PREFIXES?: string;
  DAY_TIME_ZONE?: string;
  TURNSTILE_SECRET?: string;
  VIEW_BROWSER_DAILY_LIMIT?: string;
  VIEW_NETWORK_DAILY_LIMIT?: string;
  LIKE_BROWSER_DAILY_LIMIT?: string;
  LIKE_NETWORK_DAILY_LIMIT?: string;
  FEEDBACK_BROWSER_DAILY_LIMIT?: string;
  FEEDBACK_NETWORK_DAILY_LIMIT?: string;
}

type Action = "view" | "like" | "feedback";
type FeedbackCategory =
  | "content_error"
  | "broken_link"
  | "date_update"
  | "suggestion"
  | "question"
  | "other";
type Language = "zh-CN" | "en";

interface PublicStats {
  siteVisits: number;
  pageViews: number;
  likes: number;
  liked: boolean;
}

interface StatsRow {
  site_visits: number;
  page_views: number;
  likes: number;
  liked: number;
}

interface RuntimeConfig {
  allowedOrigins: ReadonlySet<string>;
  pathPrefixes: readonly string[];
  dayTimeZone: string;
  limits: Record<Action, { browser: number; network: number }>;
}

interface FeedbackInput {
  path: string;
  visitorId: string;
  category: FeedbackCategory;
  message: string;
  contact: string | null;
  website: string;
  submissionId: string;
  language: Language;
  turnstileToken?: string;
}

interface TurnstileResult {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}

class HttpError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
  }
}

export const FEEDBACK_CATEGORIES = [
  "content_error",
  "broken_link",
  "date_update",
  "suggestion",
  "question",
  "other",
] as const;

const LANGUAGES = ["zh-CN", "en"] as const;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SAFE_PATH = /^\/[A-Za-z0-9/_\-.~%]*$/;
const MAX_BODY_BYTES = 12_000;
const KNOWN_PATHS = new Set(["/v1/stats", "/v1/view", "/v1/like", "/v1/feedback"]);

const SQL = {
  stats: `/* stats */
    SELECT
      g.site_visits,
      COALESCE(p.page_views, 0) AS page_views,
      COALESCE(p.likes, 0) AS likes,
      CASE WHEN l.visitor_hash IS NULL THEN 0 ELSE 1 END AS liked
    FROM global_stats AS g
    LEFT JOIN page_stats AS p ON p.path = ?1
    LEFT JOIN page_likes AS l ON l.path = ?1 AND l.visitor_hash = ?2
    WHERE g.id = 1`,
  consumeLimit: `/* consume_limit */
    INSERT INTO daily_limits (day, action, subject_hash, request_count, updated_at)
    VALUES (?1, ?2, ?3, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(day, action, subject_hash) DO UPDATE SET
      request_count = request_count + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE daily_limits.request_count < ?4
    RETURNING request_count`,
  insertSiteVisit: `/* insert_site_visit */
    INSERT OR IGNORE INTO daily_site_visitors (day, visitor_hash)
    VALUES (?1, ?2)`,
  insertPageView: `/* insert_page_view */
    INSERT OR IGNORE INTO daily_page_views (day, path, visitor_hash)
    VALUES (?1, ?2, ?3)`,
  selectLike: `/* select_like */
    SELECT 1 AS present FROM page_likes WHERE path = ?1 AND visitor_hash = ?2`,
  insertLike: `/* insert_like */
    INSERT OR IGNORE INTO page_likes (path, visitor_hash) VALUES (?1, ?2)`,
  deleteLike: `/* delete_like */
    DELETE FROM page_likes WHERE path = ?1 AND visitor_hash = ?2`,
  selectFeedbackReceipt: `/* select_feedback_receipt */
    SELECT receipt_id FROM feedback WHERE visitor_hash = ?1 AND submission_id = ?2`,
  insertFeedback: `/* insert_feedback */
    INSERT OR IGNORE INTO feedback (
      receipt_id, submission_id, path, visitor_hash, category, message, contact, language
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
} as const;

function parseLimit(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(value)) throw new Error("Daily limits must be positive integers.");
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > 1_000_000) {
    throw new Error("Daily limits must be between 1 and 1000000.");
  }
  return parsed;
}

function parseOrigins(value: string): ReadonlySet<string> {
  const origins = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const url = new URL(item);
      if (url.origin !== item || url.pathname !== "/" || url.search || url.hash) {
        throw new Error(`CORS origin must be an exact origin without a path: ${item}`);
      }
      if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
        throw new Error(`CORS origin must use HTTPS: ${item}`);
      }
      return url.origin;
    });
  if (origins.length === 0) throw new Error("CORS_ALLOWED_ORIGINS must not be empty.");
  return new Set(origins);
}

function parsePathPrefixes(value: string | undefined): readonly string[] {
  const prefixes = (value ?? "/")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (prefixes.length === 0 || prefixes.some((prefix) => !prefix.startsWith("/") || prefix.includes(".."))) {
    throw new Error("PAGE_PATH_PREFIXES must contain safe absolute path prefixes.");
  }
  return prefixes;
}

function runtimeConfig(env: Env): RuntimeConfig {
  if (!env.HASH_SECRET || env.HASH_SECRET.length < 32) {
    throw new Error("HASH_SECRET must contain at least 32 characters.");
  }
  const dayTimeZone = env.DAY_TIME_ZONE ?? "Asia/Shanghai";
  // Validate once per request so a configuration typo fails closed.
  new Intl.DateTimeFormat("en-CA", { timeZone: dayTimeZone }).format(new Date(0));
  return {
    allowedOrigins: parseOrigins(env.CORS_ALLOWED_ORIGINS),
    pathPrefixes: parsePathPrefixes(env.PAGE_PATH_PREFIXES),
    dayTimeZone,
    limits: {
      view: {
        browser: parseLimit(env.VIEW_BROWSER_DAILY_LIMIT, 500),
        network: parseLimit(env.VIEW_NETWORK_DAILY_LIMIT, 5000),
      },
      like: {
        browser: parseLimit(env.LIKE_BROWSER_DAILY_LIMIT, 40),
        network: parseLimit(env.LIKE_NETWORK_DAILY_LIMIT, 1000),
      },
      feedback: {
        browser: parseLimit(env.FEEDBACK_BROWSER_DAILY_LIMIT, 3),
        network: parseLimit(env.FEEDBACK_NETWORK_DAILY_LIMIT, 20),
      },
    },
  };
}

export function dayKey(date: Date, timeZone = "Asia/Shanghai"): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function normalizePath(input: unknown, prefixes: readonly string[]): string {
  if (typeof input !== "string") throw new HttpError(400, "invalid_path", "path must be a string.");
  let path = input.trim();
  if (path.endsWith("/index.html")) path = `${path.slice(0, -"index.html".length)}`;
  if (
    path.length < 1 ||
    path.length > 240 ||
    !SAFE_PATH.test(path) ||
    path.includes("..") ||
    path.includes("//") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#")
  ) {
    throw new HttpError(400, "invalid_path", "path is not an accepted site path.");
  }
  if (!prefixes.some((prefix) => path.startsWith(prefix))) {
    throw new HttpError(400, "invalid_path", "path is outside the configured site prefixes.");
  }
  return path;
}

function requireUuid(value: unknown, field: string): string {
  if (typeof value !== "string" || !UUID_V4.test(value)) {
    throw new HttpError(400, `invalid_${field}`, `${field} must be a UUID generated by crypto.randomUUID().`);
  }
  return value.toLowerCase();
}

function cleanText(value: unknown, field: string, minimum: number, maximum: number): string {
  if (typeof value !== "string") throw new HttpError(400, `invalid_${field}`, `${field} must be a string.`);
  const normalized = value.trim().normalize("NFC");
  const length = [...normalized].length;
  if (length < minimum || length > maximum || /[\u0000\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(normalized)) {
    throw new HttpError(400, `invalid_${field}`, `${field} has an invalid length or characters.`);
  }
  return normalized;
}

function assertObject(value: unknown): asserts value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new HttpError(400, "invalid_json", "The JSON body must be an object.");
  }
}

function assertKeys(body: Record<string, unknown>, allowed: readonly string[]): void {
  const allowedSet = new Set(allowed);
  if (Object.keys(body).some((key) => !allowedSet.has(key))) {
    throw new HttpError(400, "unknown_field", "The request contains an unsupported field.");
  }
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "unsupported_media_type", "Content-Type must be application/json.");
  }
  const declaredLength = Number(request.headers.get("Content-Length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "body_too_large", "The request body is too large.");
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    throw new HttpError(413, "body_too_large", "The request body is too large.");
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new HttpError(400, "invalid_json", "The request body is not valid JSON.");
  }
  assertObject(parsed);
  return parsed;
}

export async function hashIdentifier(secret: string, namespace: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${namespace}:${value}`));
  const bytes = new Uint8Array(signature);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function corsHeaders(origin: string): Headers {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  });
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.append("Vary", "Origin");
  }
  return headers;
}

function jsonResponse(value: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(value), { status, headers: corsHeaders(origin) });
}

function errorResponse(error: HttpError, origin: string): Response {
  const response = jsonResponse({ error: { code: error.code, message: error.message } }, error.status, origin);
  if (error.status === 429) response.headers.set("Retry-After", "86400");
  return response;
}

function requireOrigin(request: Request, config: RuntimeConfig): string {
  const origin = request.headers.get("Origin") ?? "";
  if (!config.allowedOrigins.has(origin)) {
    throw new HttpError(403, "origin_not_allowed", "The request origin is not allowed.");
  }
  return origin;
}

async function actorContext(
  request: Request,
  env: Env,
  visitorId: unknown,
): Promise<{ visitorId: string; visitorHash: string; networkHash: string | null }> {
  const normalizedId = requireUuid(visitorId, "visitorId");
  const visitorHash = await hashIdentifier(env.HASH_SECRET, "browser-v1", normalizedId);
  const connectingIp = request.headers.get("CF-Connecting-IP");
  const networkHash = connectingIp
    ? await hashIdentifier(env.HASH_SECRET, "network-v1", connectingIp)
    : null;
  return { visitorId: normalizedId, visitorHash, networkHash };
}

async function consumeOneLimit(
  db: D1Database,
  day: string,
  action: Action,
  subjectHash: string,
  limit: number,
): Promise<boolean> {
  const row = await db.prepare(SQL.consumeLimit).bind(day, action, subjectHash, limit).first<{ request_count: number }>();
  return row !== null;
}

async function consumeLimits(
  env: Env,
  config: RuntimeConfig,
  action: Action,
  day: string,
  visitorHash: string,
  networkHash: string | null,
): Promise<void> {
  const limits = config.limits[action];
  const browserAllowed = await consumeOneLimit(env.DB, day, action, `browser:${visitorHash}`, limits.browser);
  if (!browserAllowed) throw new HttpError(429, "daily_limit_reached", "The daily request limit has been reached.");
  if (networkHash) {
    const networkAllowed = await consumeOneLimit(env.DB, day, action, `network:${networkHash}`, limits.network);
    if (!networkAllowed) throw new HttpError(429, "daily_limit_reached", "The daily request limit has been reached.");
  }
}

async function verifyTurnstile(
  request: Request,
  env: Env,
  token: unknown,
  expectedAction: "like" | "feedback",
  origin: string,
): Promise<void> {
  if (!env.TURNSTILE_SECRET) return;
  if (typeof token !== "string" || token.length < 10 || token.length > 2048) {
    throw new HttpError(403, "turnstile_required", "A valid Turnstile token is required.");
  }
  const form = new FormData();
  form.set("secret", env.TURNSTILE_SECRET);
  form.set("response", token);
  const connectingIp = request.headers.get("CF-Connecting-IP");
  if (connectingIp) form.set("remoteip", connectingIp);

  let response: Response;
  try {
    response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new HttpError(503, "turnstile_unavailable", "Turnstile verification is temporarily unavailable.");
  }
  if (!response.ok) {
    throw new HttpError(503, "turnstile_unavailable", "Turnstile verification is temporarily unavailable.");
  }
  const result = (await response.json()) as TurnstileResult;
  const expectedHostname = new URL(origin).hostname;
  if (!result.success || result.hostname !== expectedHostname || result.action !== expectedAction) {
    throw new HttpError(403, "turnstile_failed", "Turnstile verification failed.");
  }
}

async function loadStats(db: D1Database, path: string, visitorHash: string): Promise<PublicStats> {
  const row = await db.prepare(SQL.stats).bind(path, visitorHash).first<StatsRow>();
  return {
    siteVisits: Number(row?.site_visits ?? 0),
    pageViews: Number(row?.page_views ?? 0),
    likes: Number(row?.likes ?? 0),
    liked: Boolean(row?.liked),
  };
}

async function handleStats(request: Request, env: Env, config: RuntimeConfig, origin: string): Promise<Response> {
  const url = new URL(request.url);
  const path = normalizePath(url.searchParams.get("path"), config.pathPrefixes);
  const actor = await actorContext(request, env, url.searchParams.get("visitorId"));
  return jsonResponse(await loadStats(env.DB, path, actor.visitorHash), 200, origin);
}

async function handleView(
  request: Request,
  env: Env,
  config: RuntimeConfig,
  origin: string,
  now: Date,
): Promise<Response> {
  const body = await readJson(request);
  assertKeys(body, ["path", "visitorId"]);
  const path = normalizePath(body.path, config.pathPrefixes);
  const actor = await actorContext(request, env, body.visitorId);
  const day = dayKey(now, config.dayTimeZone);
  await consumeLimits(env, config, "view", day, actor.visitorHash, actor.networkHash);
  await env.DB.batch([
    env.DB.prepare(SQL.insertSiteVisit).bind(day, actor.visitorHash),
    env.DB.prepare(SQL.insertPageView).bind(day, path, actor.visitorHash),
  ]);
  return jsonResponse(await loadStats(env.DB, path, actor.visitorHash), 200, origin);
}

async function handleLike(
  request: Request,
  env: Env,
  config: RuntimeConfig,
  origin: string,
  now: Date,
): Promise<Response> {
  const body = await readJson(request);
  assertKeys(body, ["path", "visitorId", "active", "turnstileToken"]);
  if (typeof body.active !== "boolean") {
    throw new HttpError(400, "invalid_active", "active must be a boolean.");
  }
  const path = normalizePath(body.path, config.pathPrefixes);
  const actor = await actorContext(request, env, body.visitorId);
  await verifyTurnstile(request, env, body.turnstileToken, "like", origin);
  await consumeLimits(
    env,
    config,
    "like",
    dayKey(now, config.dayTimeZone),
    actor.visitorHash,
    actor.networkHash,
  );
  const current = await env.DB.prepare(SQL.selectLike).bind(path, actor.visitorHash).first<{ present: number }>();
  if (body.active && !current) {
    await env.DB.prepare(SQL.insertLike).bind(path, actor.visitorHash).run();
  } else if (!body.active && current) {
    await env.DB.prepare(SQL.deleteLike).bind(path, actor.visitorHash).run();
  }
  return jsonResponse(await loadStats(env.DB, path, actor.visitorHash), 200, origin);
}

function parseFeedback(body: Record<string, unknown>, config: RuntimeConfig): FeedbackInput {
  assertKeys(body, [
    "path",
    "visitorId",
    "category",
    "message",
    "contact",
    "website",
    "submissionId",
    "language",
    "turnstileToken",
  ]);
  const category = body.category;
  if (typeof category !== "string" || !FEEDBACK_CATEGORIES.includes(category as FeedbackCategory)) {
    throw new HttpError(400, "invalid_category", "category is not supported.");
  }
  const language = body.language;
  if (typeof language !== "string" || !LANGUAGES.includes(language as Language)) {
    throw new HttpError(400, "invalid_language", "language must be zh-CN or en.");
  }
  const website = typeof body.website === "string" ? body.website : "";
  const contact = body.contact === null || body.contact === undefined || body.contact === ""
    ? null
    : cleanText(body.contact, "contact", 1, 200);
  return {
    path: normalizePath(body.path, config.pathPrefixes),
    visitorId: requireUuid(body.visitorId, "visitorId"),
    category: category as FeedbackCategory,
    message: cleanText(body.message, "message", 10, 2000),
    contact,
    website,
    submissionId: requireUuid(body.submissionId, "submissionId"),
    language: language as Language,
    turnstileToken: typeof body.turnstileToken === "string" ? body.turnstileToken : undefined,
  };
}

async function findFeedbackReceipt(
  db: D1Database,
  visitorHash: string,
  submissionId: string,
): Promise<string | null> {
  const row = await db
    .prepare(SQL.selectFeedbackReceipt)
    .bind(visitorHash, submissionId)
    .first<{ receipt_id: string }>();
  return row?.receipt_id ?? null;
}

async function handleFeedback(
  request: Request,
  env: Env,
  config: RuntimeConfig,
  origin: string,
  now: Date,
): Promise<Response> {
  const body = await readJson(request);

  // Silently accept a filled honeypot without storing its contents.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return jsonResponse({ receiptId: crypto.randomUUID(), status: "received" }, 202, origin);
  }

  const feedback = parseFeedback(body, config);
  const actor = await actorContext(request, env, feedback.visitorId);
  const existingReceipt = await findFeedbackReceipt(env.DB, actor.visitorHash, feedback.submissionId);
  if (existingReceipt) {
    return jsonResponse({ receiptId: existingReceipt, status: "received" }, 202, origin);
  }

  await verifyTurnstile(request, env, feedback.turnstileToken, "feedback", origin);
  await consumeLimits(
    env,
    config,
    "feedback",
    dayKey(now, config.dayTimeZone),
    actor.visitorHash,
    actor.networkHash,
  );

  const receiptId = crypto.randomUUID();
  const result = await env.DB
    .prepare(SQL.insertFeedback)
    .bind(
      receiptId,
      feedback.submissionId,
      feedback.path,
      actor.visitorHash,
      feedback.category,
      feedback.message,
      feedback.contact,
      feedback.language,
    )
    .run();

  if ((result.meta.changes ?? 0) === 0) {
    const racedReceipt = await findFeedbackReceipt(env.DB, actor.visitorHash, feedback.submissionId);
    if (racedReceipt) {
      return jsonResponse({ receiptId: racedReceipt, status: "received" }, 202, origin);
    }
    throw new HttpError(503, "feedback_unavailable", "The feedback could not be saved.");
  }
  return jsonResponse({ receiptId, status: "received" }, 202, origin);
}

export async function handleRequest(request: Request, env: Env, now = new Date()): Promise<Response> {
  let origin = "";
  try {
    const config = runtimeConfig(env);
    const url = new URL(request.url);
    if (!KNOWN_PATHS.has(url.pathname)) {
      return new Response("Not Found", { status: 404 });
    }
    origin = requireOrigin(request, config);
    if (request.method === "OPTIONS") {
      const headers = corsHeaders(origin);
      headers.delete("Content-Type");
      return new Response(null, { status: 204, headers });
    }
    if (url.pathname === "/v1/stats" && request.method === "GET") {
      return await handleStats(request, env, config, origin);
    }
    if (url.pathname === "/v1/view" && request.method === "POST") {
      return await handleView(request, env, config, origin, now);
    }
    if (url.pathname === "/v1/like" && request.method === "POST") {
      return await handleLike(request, env, config, origin, now);
    }
    if (url.pathname === "/v1/feedback" && request.method === "POST") {
      return await handleFeedback(request, env, config, origin, now);
    }
    // In particular, no GET endpoint exists for feedback.
    return errorResponse(new HttpError(404, "not_found", "The endpoint does not exist."), origin);
  } catch (error) {
    if (error instanceof HttpError) return errorResponse(error, origin);
    console.error("Engagement Worker request failed:", error instanceof Error ? error.message : "unknown error");
    if (origin) {
      return errorResponse(new HttpError(500, "internal_error", "The service is temporarily unavailable."), origin);
    }
    return new Response("Service unavailable", { status: 503 });
  }
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
} satisfies ExportedHandler<Env>;
