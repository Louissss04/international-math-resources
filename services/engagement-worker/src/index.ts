export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  CORS_ALLOWED_ORIGINS: string;
  HASH_SECRET: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_SESSION_TTL_SECONDS?: string;
  ADMIN_LOGIN_NETWORK_LIMIT?: string;
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
type FeedbackStatus = "new" | "reviewing" | "resolved" | "archived";
type DashboardRange = "today" | "7d" | "30d";
type FeedbackCategory =
  | "content_error"
  | "broken_link"
  | "date_update"
  | "suggestion"
  | "question"
  | "other";
type Language = "zh-CN" | "en";

interface PublicStats {
  likes: number;
  liked: boolean;
}

interface StatsRow {
  likes: number;
  liked: number;
}

interface RuntimeConfig {
  allowedOrigins: ReadonlySet<string>;
  pathPrefixes: readonly string[];
  dayTimeZone: string;
  limits: Record<Action, { browser: number; network: number }>;
}

interface AdminConfig {
  passwordHash: PasswordHashConfig;
  sessionSecret: string;
  sessionTtlSeconds: number;
  loginNetworkLimit: number;
}

interface PasswordHashConfig {
  iterations: number;
  salt: Uint8Array;
  expected: Uint8Array;
}

interface AdminSessionRow {
  expires_at: string;
}

interface AdminSession {
  sessionHash: string;
  token: string;
  expiresAt: string;
}

interface AdminFeedbackRow {
  receipt_id: string;
  path: string;
  category: FeedbackCategory;
  message: string;
  contact: string | null;
  language: Language;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  internal_note: string | null;
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
const FEEDBACK_STATUSES = ["new", "reviewing", "resolved", "archived"] as const;
const DASHBOARD_RANGES = ["today", "7d", "30d"] as const;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_PATH = /^\/[A-Za-z0-9/_\-.~%]*$/;
const MAX_BODY_BYTES = 12_000;
const ADMIN_COOKIE = "__Host-math_admin";
const ADMIN_PATH_PREFIX = "/admin/api/";
const ADMIN_ASSET_PATHS = new Map([
  ["/admin", "/index.html"],
  ["/admin/", "/index.html"],
  ["/admin/index.html", "/index.html"],
  ["/admin/app.js", "/app.js"],
  ["/admin/styles.css", "/styles.css"],
]);
const ADMIN_SESSION_MIN_SECONDS = 900;
const ADMIN_SESSION_MAX_SECONDS = 43_200;
const MIN_PBKDF2_ITERATIONS = 600_000;
const MAX_PBKDF2_ITERATIONS = 2_000_000;
const ADMIN_FEEDBACK_PAGE_MAX = 100;
const ADMIN_CSV_ROW_LIMIT = 10_000;
const KNOWN_PATHS = new Set(["/v1/stats", "/v1/view", "/v1/like", "/v1/feedback"]);

const SQL = {
  stats: `/* stats */
    SELECT
      COALESCE((SELECT likes FROM page_stats WHERE path = ?1), 0) AS likes,
      EXISTS(
        SELECT 1 FROM page_likes WHERE path = ?1 AND visitor_hash = ?2
      ) AS liked`,
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
    INSERT OR IGNORE INTO page_likes (path, visitor_hash, created_day) VALUES (?1, ?2, ?3)`,
  markLikeRemoval: `/* mark_like_removal */
    UPDATE page_likes SET removal_day = ?1 WHERE path = ?2 AND visitor_hash = ?3`,
  deleteLike: `/* delete_like */
    DELETE FROM page_likes WHERE path = ?1 AND visitor_hash = ?2`,
  selectFeedbackReceipt: `/* select_feedback_receipt */
    SELECT receipt_id FROM feedback WHERE visitor_hash = ?1 AND submission_id = ?2`,
  insertFeedback: `/* insert_feedback */
    INSERT OR IGNORE INTO feedback (
      receipt_id, submission_id, path, visitor_hash, category, message, contact, language, submitted_day
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
  consumeAdminLogin: `/* consume_admin_login */
    INSERT INTO admin_login_limits (window_key, subject_hash, request_count, updated_at)
    VALUES (?1, ?2, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(window_key, subject_hash) DO UPDATE SET
      request_count = request_count + 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE admin_login_limits.request_count < ?3
    RETURNING request_count`,
  deleteExpiredAdminSessions: `/* delete_expired_admin_sessions */
    DELETE FROM admin_sessions WHERE expires_at <= ?1`,
  insertAdminSession: `/* insert_admin_session */
    INSERT INTO admin_sessions (session_hash, expires_at)
    VALUES (?1, ?2)`,
  selectAdminSession: `/* select_admin_session */
    SELECT expires_at FROM admin_sessions WHERE session_hash = ?1`,
  deleteAdminSession: `/* delete_admin_session */
    DELETE FROM admin_sessions WHERE session_hash = ?1`,
  adminGlobalStats: `/* admin_global_stats */
    SELECT site_visits FROM global_stats WHERE id = 1`,
  adminPageTotals: `/* admin_page_totals */
    SELECT COALESCE(SUM(page_views), 0) AS page_views,
           COALESCE(SUM(likes), 0) AS likes
    FROM page_stats`,
  adminDailyVisits: `/* admin_daily_visits */
    SELECT day, site_visits, page_views, feedback_submissions, likes_added, likes_removed
    FROM daily_metrics
    WHERE day >= ?1 AND day <= ?2
    ORDER BY day`,
  adminPageRanking: `/* admin_page_ranking */
    SELECT path, page_views, likes
    FROM page_stats
    ORDER BY path ASC
    LIMIT ?1`,
  adminFeedbackStatusCounts: `/* admin_feedback_status_counts */
    SELECT status, COUNT(*) AS count
    FROM feedback
    GROUP BY status`,
  adminFeedbackDetail: `/* admin_feedback_detail */
    SELECT receipt_id, path, category, message, contact, language, status,
           created_at, updated_at, resolved_at, internal_note
    FROM feedback
    WHERE receipt_id = ?1`,
  adminUpdateFeedbackStatus: `/* admin_update_feedback_status */
    UPDATE feedback
    SET status = ?1,
        internal_note = ?2,
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = CASE WHEN ?1 = 'resolved' THEN COALESCE(resolved_at, CURRENT_TIMESTAMP) ELSE NULL END
    WHERE receipt_id = ?3`,
  adminInsertFeedbackAudit: `/* admin_insert_feedback_audit */
    INSERT INTO feedback_audit (
      receipt_id, admin_session_hash, old_status, new_status, note_changed
    ) VALUES (?1, ?2, ?3, ?4, ?5)`,
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

function parseIntegerSetting(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
  name: string,
): number {
  if (value === undefined || value === "") return fallback;
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be an integer.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${name} must be between ${minimum} and ${maximum}.`);
  }
  return parsed;
}

function decodeBase64Url(value: string, field: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error(`${field} must use unpadded base64url.`);
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  let binary: string;
  try {
    binary = atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding);
  } catch {
    throw new Error(`${field} is not valid base64url.`);
  }
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function parsePasswordHash(value: string | undefined): PasswordHashConfig {
  if (!value) throw new Error("ADMIN_PASSWORD_HASH is required for administrator routes.");
  const parts = value.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256" || !/^\d+$/.test(parts[1] ?? "")) {
    throw new Error(
      "ADMIN_PASSWORD_HASH must use pbkdf2-sha256$iterations$salt-base64url$derived-key-base64url.",
    );
  }
  const iterations = Number(parts[1]);
  if (
    !Number.isSafeInteger(iterations) ||
    iterations < MIN_PBKDF2_ITERATIONS ||
    iterations > MAX_PBKDF2_ITERATIONS
  ) {
    throw new Error(
      `ADMIN_PASSWORD_HASH iterations must be between ${MIN_PBKDF2_ITERATIONS} and ${MAX_PBKDF2_ITERATIONS}.`,
    );
  }
  const salt = decodeBase64Url(parts[2] ?? "", "ADMIN_PASSWORD_HASH salt");
  const expected = decodeBase64Url(parts[3] ?? "", "ADMIN_PASSWORD_HASH derived key");
  if (salt.byteLength < 16 || expected.byteLength !== 32) {
    throw new Error("ADMIN_PASSWORD_HASH requires a salt of at least 16 bytes and a 32-byte derived key.");
  }
  return { iterations, salt, expected };
}

function adminConfig(env: Env): AdminConfig {
  if (!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  }
  if (env.ADMIN_SESSION_SECRET === env.HASH_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET must be different from HASH_SECRET.");
  }
  return {
    passwordHash: parsePasswordHash(env.ADMIN_PASSWORD_HASH),
    sessionSecret: env.ADMIN_SESSION_SECRET,
    sessionTtlSeconds: parseIntegerSetting(
      env.ADMIN_SESSION_TTL_SECONDS,
      14_400,
      ADMIN_SESSION_MIN_SECONDS,
      ADMIN_SESSION_MAX_SECONDS,
      "ADMIN_SESSION_TTL_SECONDS",
    ),
    loginNetworkLimit: parseIntegerSetting(
      env.ADMIN_LOGIN_NETWORK_LIMIT,
      8,
      1,
      100,
      "ADMIN_LOGIN_NETWORK_LIMIT",
    ),
  };
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) return false;
  let difference = 0;
  for (let index = 0; index < left.byteLength; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }
  return difference === 0;
}

async function verifyPassword(password: string, config: PasswordHashConfig): Promise<boolean> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: new Uint8Array(config.salt).buffer,
      iterations: config.iterations,
    },
    passwordKey,
    config.expected.byteLength * 8,
  );
  return constantTimeEqual(new Uint8Array(derived), config.expected);
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

function adminHeaders(contentType = "application/json; charset=utf-8"): Headers {
  return new Headers({
    "Cache-Control": "no-store, private",
    "Content-Type": contentType,
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  });
}

function adminAssetHeaders(source?: HeadersInit): Headers {
  const headers = new Headers(source);
  headers.set("Cache-Control", "no-store, private");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.delete("Access-Control-Allow-Credentials");
  headers.delete("Access-Control-Allow-Headers");
  headers.delete("Access-Control-Allow-Methods");
  headers.delete("Access-Control-Allow-Origin");
  headers.delete("Access-Control-Expose-Headers");
  return headers;
}

async function handleAdminAssetRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const assetPath = ADMIN_ASSET_PATHS.get(url.pathname);
  if (!assetPath) {
    return new Response("Not Found", { status: 404, headers: adminAssetHeaders({ "Content-Type": "text/plain; charset=utf-8" }) });
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    const headers = adminAssetHeaders({ "Content-Type": "text/plain; charset=utf-8", Allow: "GET, HEAD" });
    return new Response("Method Not Allowed", { status: 405, headers });
  }
  if (url.pathname === "/admin") {
    const headers = adminAssetHeaders({ Location: `/admin/${url.search}` });
    return new Response(null, { status: 308, headers });
  }
  if (!env.ASSETS) {
    return new Response("Administrator interface unavailable", {
      status: 503,
      headers: adminAssetHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  const assetUrl = new URL(request.url);
  assetUrl.pathname = assetPath;
  assetUrl.search = "";
  assetUrl.hash = "";
  const assetRequest = new Request(assetUrl.toString(), {
    method: request.method,
    headers: request.headers,
  });
  const assetResponse = await env.ASSETS.fetch(assetRequest);
  return new Response(request.method === "HEAD" ? null : assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers: adminAssetHeaders(assetResponse.headers),
  });
}

function adminJsonResponse(value: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  const headers = adminHeaders();
  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.append(key, value));
  }
  return new Response(JSON.stringify(value), { status, headers });
}

function adminErrorResponse(error: HttpError): Response {
  const headers = new Headers();
  if (error.status === 401) headers.set("WWW-Authenticate", 'Session realm="administrator"');
  if (error.status === 429) headers.set("Retry-After", "900");
  return adminJsonResponse({ error: { code: error.code, message: error.message } }, error.status, headers);
}

function requireSameOrigin(request: Request): void {
  const requestOrigin = new URL(request.url).origin;
  const origin = request.headers.get("Origin");
  if (origin !== requestOrigin) {
    throw new HttpError(403, "cross_site_request", "A same-origin request is required.");
  }
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite && fetchSite !== "same-origin") {
    throw new HttpError(403, "cross_site_request", "A same-origin request is required.");
  }
}

function sqlTimestamp(date: Date): string {
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "");
}

function parseSqlTimestamp(value: string): number {
  const parsed = Date.parse(`${value.replace(" ", "T")}Z`);
  return Number.isFinite(parsed) ? parsed : 0;
}

function adminCookie(token: string, maxAge: number): string {
  return `${ADMIN_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`;
}

function clearAdminCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function readCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie || cookie.length > 4096) return null;
  for (const part of cookie.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    if (part.slice(0, separator).trim() !== name) continue;
    const value = part.slice(separator + 1).trim();
    return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
  }
  return null;
}

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64Url(bytes);
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
  const day = dayKey(now, config.dayTimeZone);
  if (body.active && !current) {
    await env.DB.prepare(SQL.insertLike).bind(path, actor.visitorHash, day).run();
  } else if (!body.active && current) {
    await env.DB.batch([
      env.DB.prepare(SQL.markLikeRemoval).bind(day, path, actor.visitorHash),
      env.DB.prepare(SQL.deleteLike).bind(path, actor.visitorHash),
    ]);
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
      dayKey(now, config.dayTimeZone),
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

async function queryAll<T>(statement: D1PreparedStatement): Promise<T[]> {
  const result = await statement.all<T>();
  return result.results ?? [];
}

function assertSearchKeys(url: URL, allowed: readonly string[]): void {
  const allowedSet = new Set(allowed);
  let unsupported = "";
  url.searchParams.forEach((_value, key) => {
    if (!allowedSet.has(key)) {
      unsupported ||= key;
    }
  });
  if (unsupported) {
    throw new HttpError(400, "unknown_parameter", `Unsupported query parameter: ${unsupported}.`);
  }
}

function loginWindowKey(now: Date): string {
  return String(Math.floor(now.getTime() / (15 * 60 * 1000)));
}

async function consumeAdminLoginLimit(
  request: Request,
  env: Env,
  config: AdminConfig,
  now: Date,
): Promise<void> {
  const address = request.headers.get("CF-Connecting-IP") ?? "missing";
  const subjectHash = await hashIdentifier(env.HASH_SECRET, "admin-login-network-v1", address);
  const row = await env.DB
    .prepare(SQL.consumeAdminLogin)
    .bind(loginWindowKey(now), subjectHash, config.loginNetworkLimit)
    .first<{ request_count: number }>();
  if (!row) throw new HttpError(429, "login_rate_limited", "Too many login attempts. Try again later.");
}

async function loadAdminSession(
  request: Request,
  env: Env,
  config: AdminConfig,
  now: Date,
): Promise<AdminSession | null> {
  const token = readCookie(request, ADMIN_COOKIE);
  if (!token) return null;
  const sessionHash = await hashIdentifier(config.sessionSecret, "admin-session-v1", token);
  const row = await env.DB
    .prepare(SQL.selectAdminSession)
    .bind(sessionHash)
    .first<AdminSessionRow>();
  if (!row || parseSqlTimestamp(row.expires_at) <= now.getTime()) {
    if (row) await env.DB.prepare(SQL.deleteAdminSession).bind(sessionHash).run();
    return null;
  }
  return {
    sessionHash,
    token,
    expiresAt: new Date(parseSqlTimestamp(row.expires_at)).toISOString(),
  };
}

async function requireAdminSession(
  request: Request,
  env: Env,
  config: AdminConfig,
  now: Date,
): Promise<AdminSession> {
  const session = await loadAdminSession(request, env, config, now);
  if (!session) throw new HttpError(401, "authentication_required", "Administrator authentication is required.");
  return session;
}

async function csrfToken(config: AdminConfig, sessionToken: string): Promise<string> {
  return hashIdentifier(config.sessionSecret, "admin-csrf-v1", sessionToken);
}

async function requireAdminCsrf(
  request: Request,
  config: AdminConfig,
  session: AdminSession,
): Promise<void> {
  requireSameOrigin(request);
  const supplied = request.headers.get("X-CSRF-Token") ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(supplied)) {
    throw new HttpError(403, "csrf_failed", "The CSRF token is missing or invalid.");
  }
  const expected = await csrfToken(config, session.token);
  const valid = constantTimeEqual(
    decodeBase64Url(supplied, "X-CSRF-Token"),
    decodeBase64Url(expected, "expected CSRF token"),
  );
  if (!valid) throw new HttpError(403, "csrf_failed", "The CSRF token is missing or invalid.");
}

async function handleAdminLogin(request: Request, env: Env, now: Date): Promise<Response> {
  requireSameOrigin(request);
  const config = adminConfig(env);
  await consumeAdminLoginLimit(request, env, config, now);
  const body = await readJson(request);
  assertKeys(body, ["password"]);
  if (typeof body.password !== "string" || body.password.length < 14 || body.password.length > 256) {
    throw new HttpError(401, "invalid_credentials", "The administrator credentials are invalid.");
  }
  if (!(await verifyPassword(body.password, config.passwordHash))) {
    throw new HttpError(401, "invalid_credentials", "The administrator credentials are invalid.");
  }

  const token = randomToken();
  const sessionHash = await hashIdentifier(config.sessionSecret, "admin-session-v1", token);
  const expires = new Date(now.getTime() + config.sessionTtlSeconds * 1000);
  await env.DB.batch([
    env.DB.prepare(SQL.deleteExpiredAdminSessions).bind(sqlTimestamp(now)),
    env.DB.prepare(SQL.insertAdminSession).bind(sessionHash, sqlTimestamp(expires)),
  ]);
  return adminJsonResponse(
    {
      authenticated: true,
      expiresAt: expires.toISOString(),
      csrfToken: await csrfToken(config, token),
    },
    200,
    { "Set-Cookie": adminCookie(token, config.sessionTtlSeconds) },
  );
}

async function handleAdminSession(request: Request, env: Env, now: Date): Promise<Response> {
  const config = adminConfig(env);
  const session = await loadAdminSession(request, env, config, now);
  if (!session) {
    return adminJsonResponse(
      { authenticated: false },
      200,
      { "Set-Cookie": clearAdminCookie() },
    );
  }
  return adminJsonResponse({
    authenticated: true,
    expiresAt: session.expiresAt,
    csrfToken: await csrfToken(config, session.token),
  });
}

async function handleAdminLogout(request: Request, env: Env, now: Date): Promise<Response> {
  const config = adminConfig(env);
  const session = await requireAdminSession(request, env, config, now);
  await requireAdminCsrf(request, config, session);
  await env.DB.prepare(SQL.deleteAdminSession).bind(session.sessionHash).run();
  return adminJsonResponse(
    { authenticated: false },
    200,
    { "Set-Cookie": clearAdminCookie() },
  );
}

function addUtcDays(day: string, offset: number): string {
  const [year, month, date] = day.split("-").map(Number);
  const value = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, date ?? 1));
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

function dashboardDays(range: DashboardRange): number {
  if (range === "today") return 1;
  return range === "7d" ? 7 : 30;
}

async function handleAdminDashboard(
  request: Request,
  env: Env,
  runtime: RuntimeConfig,
  now: Date,
): Promise<Response> {
  const config = adminConfig(env);
  await requireAdminSession(request, env, config, now);
  const url = new URL(request.url);
  assertSearchKeys(url, ["range"]);
  const rangeValue = url.searchParams.get("range") ?? "7d";
  if (!DASHBOARD_RANGES.includes(rangeValue as DashboardRange)) {
    throw new HttpError(400, "invalid_range", "range must be today, 7d or 30d.");
  }
  const range = rangeValue as DashboardRange;
  const to = dayKey(now, runtime.dayTimeZone);
  const from = addUtcDays(to, -(dashboardDays(range) - 1));

  const global = await env.DB.prepare(SQL.adminGlobalStats).first<{ site_visits: number }>();
  const pageTotals = await env.DB
    .prepare(SQL.adminPageTotals)
    .first<{ page_views: number; likes: number }>();
  const metricRows = await queryAll<{
    day: string;
    site_visits: number;
    page_views: number;
    feedback_submissions: number;
    likes_added: number;
    likes_removed: number;
  }>(env.DB.prepare(SQL.adminDailyVisits).bind(from, to));
  const pageRows = await queryAll<{ path: string; page_views: number; likes: number }>(
    env.DB.prepare(SQL.adminPageRanking).bind(1000),
  );
  const statusRows = await queryAll<{ status: FeedbackStatus; count: number }>(
    env.DB.prepare(SQL.adminFeedbackStatusCounts),
  );

  const metricByDay = new Map(metricRows.map((row) => [row.day, row]));
  const trend = Array.from({ length: dashboardDays(range) }, (_, index) => {
    const date = addUtcDays(from, index);
    const row = metricByDay.get(date);
    return {
      date,
      siteVisits: Number(row?.site_visits ?? 0),
      pageViews: Number(row?.page_views ?? 0),
      feedbackSubmissions: Number(row?.feedback_submissions ?? 0),
      likesAdded: Number(row?.likes_added ?? 0),
      likesRemoved: Number(row?.likes_removed ?? 0),
    };
  });
  const feedbackByStatus: Record<FeedbackStatus, number> = {
    new: 0,
    reviewing: 0,
    resolved: 0,
    archived: 0,
  };
  for (const row of statusRows) {
    if (FEEDBACK_STATUSES.includes(row.status)) feedbackByStatus[row.status] = Number(row.count);
  }

  return adminJsonResponse({
    range,
    from,
    to,
    totals: {
      siteVisits: Number(global?.site_visits ?? 0),
      pageViews: Number(pageTotals?.page_views ?? 0),
      likes: Number(pageTotals?.likes ?? 0),
      feedback: Object.values(feedbackByStatus).reduce((sum, count) => sum + count, 0),
    },
    feedbackByStatus,
    trend,
    pages: pageRows.map((row) => ({
      path: row.path,
      pageViews: Number(row.page_views),
      likes: Number(row.likes),
    })),
  });
}

interface FeedbackFilters {
  where: string;
  values: unknown[];
}

function parseAdminDay(value: string, field: string): string {
  if (!ISO_DAY.test(value) || addUtcDays(value, 0) !== value) {
    throw new HttpError(400, `invalid_${field}`, `${field} must use YYYY-MM-DD.`);
  }
  return value;
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`);
}

function feedbackFilters(url: URL, runtime: RuntimeConfig): FeedbackFilters {
  const conditions: string[] = [];
  const values: unknown[] = [];
  const status = url.searchParams.get("status");
  if (status) {
    if (!FEEDBACK_STATUSES.includes(status as FeedbackStatus)) {
      throw new HttpError(400, "invalid_status", "status is not supported.");
    }
    conditions.push("status = ?");
    values.push(status);
  }
  const category = url.searchParams.get("category");
  if (category) {
    if (!FEEDBACK_CATEGORIES.includes(category as FeedbackCategory)) {
      throw new HttpError(400, "invalid_category", "category is not supported.");
    }
    conditions.push("category = ?");
    values.push(category);
  }
  const path = url.searchParams.get("path");
  if (path) {
    conditions.push("path = ?");
    values.push(normalizePath(path, runtime.pathPrefixes));
  }
  const from = url.searchParams.get("from");
  if (from) {
    const day = parseAdminDay(from, "from");
    conditions.push("submitted_day >= ?");
    values.push(day);
  }
  const to = url.searchParams.get("to");
  if (to) {
    const day = parseAdminDay(to, "to");
    conditions.push("submitted_day <= ?");
    values.push(day);
  }
  if (from && to && from > to) {
    throw new HttpError(400, "invalid_date_range", "from must not be later than to.");
  }
  const query = url.searchParams.get("q");
  if (query) {
    const clean = cleanText(query, "q", 1, 100);
    const pattern = `%${escapeLike(clean)}%`;
    conditions.push("(message LIKE ? ESCAPE '\\' OR contact LIKE ? ESCAPE '\\' OR path LIKE ? ESCAPE '\\')");
    values.push(pattern, pattern, pattern);
  }
  return { where: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "", values };
}

function adminFeedbackJson(row: AdminFeedbackRow): Record<string, unknown> {
  return {
    receiptId: row.receipt_id,
    path: row.path,
    category: row.category,
    message: row.message,
    contact: row.contact,
    language: row.language,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
    internalNote: row.internal_note,
  };
}

async function handleAdminFeedbackList(
  request: Request,
  env: Env,
  runtime: RuntimeConfig,
  now: Date,
): Promise<Response> {
  const config = adminConfig(env);
  await requireAdminSession(request, env, config, now);
  const url = new URL(request.url);
  assertSearchKeys(url, ["status", "category", "path", "from", "to", "q", "page", "pageSize"]);
  const page = parseIntegerSetting(url.searchParams.get("page") ?? undefined, 1, 1, 1_000_000, "page");
  const pageSize = parseIntegerSetting(
    url.searchParams.get("pageSize") ?? undefined,
    25,
    1,
    ADMIN_FEEDBACK_PAGE_MAX,
    "pageSize",
  );
  const filters = feedbackFilters(url, runtime);
  const projection = `receipt_id, path, category, message, contact, language, status,
    created_at, updated_at, resolved_at, internal_note`;
  const listSql = `/* admin_feedback_list */ SELECT ${projection}
    FROM feedback ${filters.where}
    ORDER BY created_at DESC, receipt_id DESC LIMIT ? OFFSET ?`;
  const countSql = `/* admin_feedback_count */ SELECT COUNT(*) AS count FROM feedback ${filters.where}`;
  const rows = await queryAll<AdminFeedbackRow>(
    env.DB.prepare(listSql).bind(...filters.values, pageSize, (page - 1) * pageSize),
  );
  const count = await env.DB
    .prepare(countSql)
    .bind(...filters.values)
    .first<{ count: number }>();
  const total = Number(count?.count ?? 0);
  return adminJsonResponse({
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    items: rows.map(adminFeedbackJson),
  });
}

function requireReceiptId(value: string): string {
  if (!UUID_V4.test(value)) {
    throw new HttpError(400, "invalid_receipt_id", "The feedback receipt ID is invalid.");
  }
  return value.toLowerCase();
}

async function loadAdminFeedback(db: D1Database, receiptId: string): Promise<AdminFeedbackRow | null> {
  return db.prepare(SQL.adminFeedbackDetail).bind(receiptId).first<AdminFeedbackRow>();
}

async function handleAdminFeedbackDetail(
  request: Request,
  env: Env,
  receiptIdInput: string,
  now: Date,
): Promise<Response> {
  const config = adminConfig(env);
  await requireAdminSession(request, env, config, now);
  const receiptId = requireReceiptId(receiptIdInput);
  const row = await loadAdminFeedback(env.DB, receiptId);
  if (!row) throw new HttpError(404, "feedback_not_found", "The feedback item does not exist.");
  return adminJsonResponse({ item: adminFeedbackJson(row) });
}

async function handleAdminFeedbackUpdate(
  request: Request,
  env: Env,
  receiptIdInput: string,
  now: Date,
): Promise<Response> {
  const config = adminConfig(env);
  const session = await requireAdminSession(request, env, config, now);
  await requireAdminCsrf(request, config, session);
  const receiptId = requireReceiptId(receiptIdInput);
  const current = await loadAdminFeedback(env.DB, receiptId);
  if (!current) throw new HttpError(404, "feedback_not_found", "The feedback item does not exist.");
  const body = await readJson(request);
  assertKeys(body, ["status", "internalNote"]);
  if (!("status" in body) && !("internalNote" in body)) {
    throw new HttpError(400, "empty_update", "Provide status or internalNote.");
  }
  let status = current.status;
  if ("status" in body) {
    if (typeof body.status !== "string" || !FEEDBACK_STATUSES.includes(body.status as FeedbackStatus)) {
      throw new HttpError(400, "invalid_status", "status is not supported.");
    }
    status = body.status as FeedbackStatus;
  }
  let internalNote = current.internal_note;
  if ("internalNote" in body) {
    internalNote = body.internalNote === null || body.internalNote === ""
      ? null
      : cleanText(body.internalNote, "internalNote", 1, 4000);
  }
  if (status !== current.status || internalNote !== current.internal_note) {
    await env.DB.batch([
      env.DB.prepare(SQL.adminUpdateFeedbackStatus).bind(status, internalNote, receiptId),
      env.DB
        .prepare(SQL.adminInsertFeedbackAudit)
        .bind(receiptId, session.sessionHash, current.status, status, internalNote !== current.internal_note ? 1 : 0),
    ]);
  }
  const updated = await loadAdminFeedback(env.DB, receiptId);
  if (!updated) throw new HttpError(503, "feedback_unavailable", "The feedback item could not be loaded.");
  return adminJsonResponse({ item: adminFeedbackJson(updated) });
}

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@]/.test(text.trimStart())) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

async function handleAdminFeedbackCsv(
  request: Request,
  env: Env,
  runtime: RuntimeConfig,
  now: Date,
): Promise<Response> {
  const config = adminConfig(env);
  const session = await requireAdminSession(request, env, config, now);
  await requireAdminCsrf(request, config, session);
  const url = new URL(request.url);
  assertSearchKeys(url, ["status", "category", "path", "from", "to", "q"]);
  const filters = feedbackFilters(url, runtime);
  const exportSql = `/* admin_feedback_export */ SELECT
    receipt_id, path, category, message, contact, language, status,
    created_at, updated_at, resolved_at, internal_note
    FROM feedback ${filters.where}
    ORDER BY created_at DESC, receipt_id DESC LIMIT ?`;
  const rows = await queryAll<AdminFeedbackRow>(
    env.DB.prepare(exportSql).bind(...filters.values, ADMIN_CSV_ROW_LIMIT + 1),
  );
  if (rows.length > ADMIN_CSV_ROW_LIMIT) {
    throw new HttpError(413, "export_too_large", "Narrow the filters before exporting more than 10000 rows.");
  }
  const header = [
    "receipt_id",
    "created_at",
    "updated_at",
    "resolved_at",
    "status",
    "category",
    "path",
    "language",
    "message",
    "contact",
    "internal_note",
  ];
  const lines = [
    header.map(csvCell).join(","),
    ...rows.map((row) => [
      row.receipt_id,
      row.created_at,
      row.updated_at,
      row.resolved_at,
      row.status,
      row.category,
      row.path,
      row.language,
      row.message,
      row.contact,
      row.internal_note,
    ].map(csvCell).join(",")),
  ];
  const headers = adminHeaders("text/csv; charset=utf-8");
  headers.set("Content-Disposition", `attachment; filename="feedback-${dayKey(now, runtime.dayTimeZone)}.csv"`);
  return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, { status: 200, headers });
}

async function handleAdminRequest(
  request: Request,
  env: Env,
  runtime: RuntimeConfig,
  now: Date,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/admin/api/session" && request.method === "GET") {
    return handleAdminSession(request, env, now);
  }
  if (url.pathname === "/admin/api/login" && request.method === "POST") {
    return handleAdminLogin(request, env, now);
  }
  if (url.pathname === "/admin/api/logout" && request.method === "POST") {
    return handleAdminLogout(request, env, now);
  }
  if (url.pathname === "/admin/api/dashboard" && request.method === "GET") {
    return handleAdminDashboard(request, env, runtime, now);
  }
  if (url.pathname === "/admin/api/feedback" && request.method === "GET") {
    return handleAdminFeedbackList(request, env, runtime, now);
  }
  if (url.pathname === "/admin/api/feedback.csv" && request.method === "POST") {
    return handleAdminFeedbackCsv(request, env, runtime, now);
  }
  const detail = url.pathname.match(/^\/admin\/api\/feedback\/([^/]+)$/);
  if (detail && request.method === "GET") {
    return handleAdminFeedbackDetail(request, env, detail[1] ?? "", now);
  }
  if (detail && request.method === "PATCH") {
    return handleAdminFeedbackUpdate(request, env, detail[1] ?? "", now);
  }
  throw new HttpError(404, "not_found", "The endpoint does not exist.");
}

export async function handleRequest(request: Request, env: Env, now = new Date()): Promise<Response> {
  let origin = "";
  let adminRequest = false;
  const url = new URL(request.url);
  const adminAssetRequest =
    url.pathname === "/admin" ||
    (url.pathname.startsWith("/admin/") && !url.pathname.startsWith(ADMIN_PATH_PREFIX));
  if (adminAssetRequest) {
    try {
      return await handleAdminAssetRequest(request, env);
    } catch (error) {
      console.error("Administrator interface request failed:", error instanceof Error ? error.message : "unknown error");
      return new Response("Administrator interface unavailable", {
        status: 503,
        headers: adminAssetHeaders({ "Content-Type": "text/plain; charset=utf-8" }),
      });
    }
  }
  try {
    const config = runtimeConfig(env);
    adminRequest = url.pathname.startsWith(ADMIN_PATH_PREFIX);
    if (adminRequest) return await handleAdminRequest(request, env, config, now);
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
    if (adminRequest) {
      if (error instanceof HttpError) return adminErrorResponse(error);
      console.error("Administrator API request failed:", error instanceof Error ? error.message : "unknown error");
      return adminErrorResponse(new HttpError(503, "admin_unavailable", "The administrator service is unavailable."));
    }
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
