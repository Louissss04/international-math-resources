# Engagement Worker

This independent Cloudflare Worker stores privacy-conscious traffic totals, page likes and private feedback for the GitHub Pages site.

## Data semantics

- `siteVisits`: cumulative anonymous-browser visits, deduplicated once per browser per calendar day.
- `pageViews`: cumulative page views, deduplicated once per browser, page and calendar day.
- `likes`: current likes for the requested page. A browser can hold at most one active like per page.
- `liked`: whether the requesting anonymous browser currently likes the page.
- Visitor IDs are UUIDs generated and kept in the browser. The Worker stores only a secret-keyed HMAC, never the raw ID.
- Raw IP addresses and user-agent strings are not stored. A secret-keyed network hash is used only in the daily abuse-limit table.
- Feedback is private. There is deliberately no public feedback read endpoint.

These counts do not represent verified people. Clearing browser storage or changing browsers/devices creates a new anonymous browser ID.

## API

All requests require an exact allowed `Origin`. JSON writes require `Content-Type: application/json`.

### `GET /v1/stats?path=...&visitorId=...`

Returns:

```json
{"siteVisits": 1, "pageViews": 1, "likes": 0, "liked": false}
```

### `POST /v1/view`

```json
{"path":"/competitions/amc-12","visitorId":"UUID_V4"}
```

Returns the same four-field statistics object. Repeated calls on the same day do not increase the visit totals.

### `POST /v1/like`

```json
{
  "path":"/competitions/amc-12",
  "visitorId":"UUID_V4",
  "active":true,
  "turnstileToken":"OPTIONAL_UNLESS_CONFIGURED"
}
```

`active: true` adds the browser's like idempotently. `active: false` removes it idempotently. The response is the same four-field statistics object.

### `POST /v1/feedback`

```json
{
  "path":"/competitions/amc-12",
  "visitorId":"UUID_V4",
  "category":"content_error",
  "message":"The published date on this page may need review.",
  "contact":"optional@example.com",
  "website":"",
  "submissionId":"UUID_V4",
  "language":"en",
  "turnstileToken":"OPTIONAL_UNLESS_CONFIGURED"
}
```

Categories are `content_error`, `broken_link`, `date_update`, `suggestion`, `question`, and `other`. Languages are `zh-CN` and `en`. `message` is 10–2000 Unicode characters; `contact` is optional and at most 200 characters. `website` is a honeypot and must remain empty. `submissionId` makes retries idempotent.

Success returns HTTP 202:

```json
{"receiptId":"UUID_V4","status":"received"}
```

View private messages in the Cloudflare D1 dashboard or with authenticated Wrangler commands. Never expose D1 credentials, a secret key, or a feedback query in the static site.

## Abuse controls

The service fails closed when `HASH_SECRET`, the origin allowlist or another security setting is invalid. Without Turnstile it still applies:

- exact origin and page-prefix checks;
- HMAC pseudonyms for browser and network identifiers;
- UUID validation, small JSON bodies and strict field allowlists;
- idempotent view and like uniqueness constraints;
- per-browser and per-network daily write limits;
- feedback category, length and control-character validation;
- a silent honeypot.

Browser Origin/CORS checks alone do not stop direct HTTP clients. For production feedback and likes, configure Turnstile. Once `TURNSTILE_SECRET` exists, those two routes fail closed unless the Worker validates a token whose hostname matches the request origin and whose action is exactly `feedback` or `like`. The client widget must set the corresponding Turnstile action.

## Deploy

Run these commands from this directory. Replace example values before deployment.

```powershell
Copy-Item wrangler.toml.example wrangler.toml
npm install
npx wrangler login
npx wrangler d1 create international-math-engagement
```

Copy the returned database ID into `wrangler.toml`, then initialize local and remote databases:

```powershell
npx wrangler d1 execute international-math-engagement --local --file schema.sql
npx wrangler d1 execute international-math-engagement --remote --file schema.sql
```

Create a random secret of at least 32 characters and store it as a Worker secret. Do not commit it.

```powershell
npx wrangler secret put HASH_SECRET
```

Turnstile is optional for local development but recommended before enabling public writes:

```powershell
npx wrangler secret put TURNSTILE_SECRET
```

Configure the Turnstile widget for `louissss04.github.io`; use action `like` for likes and `feedback` for feedback. Deploy and copy the resulting Worker URL into the static site's frontend configuration:

```powershell
npm run check
npx wrangler deploy
```

For local development, copy `.dev.vars.example` to `.dev.vars`, set an exact local origin in the `[vars]` section of `wrangler.toml`, initialize the local D1 database, and run `npx wrangler dev`.

## Maintenance

- Check D1 row usage and daily-limit errors in Cloudflare.
- Export feedback before schema migrations and limit dashboard access to the site owner.
- Delete expired `daily_limits`, `daily_site_visitors`, and `daily_page_views` rows periodically after retaining the aggregate counts. Deleting those rows does not reduce `global_stats` or `page_stats`.
- Decide and publish a feedback retention period before launch; contacts may contain personal information.
- Rotate `HASH_SECRET` only with a migration plan. Rotation deliberately changes all anonymous pseudonyms.

## Verify

```powershell
npm install
npm run check
```
