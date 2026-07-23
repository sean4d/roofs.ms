# Google Business Profile API — Setup (Tier 1 SEO automation)

This wires the website's `/upload` form directly into the **official Google
Business Profile API** so every finished job automatically:

1. **Posts its photos to the Photos gallery** (fresh photos are a documented
   local-ranking signal), and
2. **Posts one "Update"** to the profile — photo + short caption + a
   **Learn more** button linking to that job's project page.

It replaces the uncertain Metricool photo path with Google's first-party API.
Once the five env vars below are set, **it just works on every upload** — no
manual step. Until they're set, uploads still fully post to the website + the
other socials; the GBP push is simply skipped.

> Nothing connects or stores a token until **you** complete the one-time
> "Sign in with Google and allow" consent (Step 3). The code never contains a
> secret — everything lives in Vercel env vars.

---

## What you get

| Surface | API | What lands |
| --- | --- | --- |
| **Photos gallery** | v4 `media` | Up to 3 finished-work photos per job (prefers "after" shots) |
| **Updates feed** | v4 `localPosts` | One post: lead photo + caption + **Learn more →** project page |

Quota note: a freshly-approved GBP project starts at a **low quota (~1
request/min)** until Google grants an increase. That's why each job posts one
Update + a small capped photo set. Everything degrades gracefully — a quota or
API error is logged and never blocks the website upload. Request a quota bump
in the Google Cloud console once you've confirmed it's working.

---

## One-time setup

Everything password-gated below runs through the `/upload` API with your upload
passphrase (HTTP Basic auth, username = the passphrase, blank password).

### Step 1 — Google Cloud project + OAuth client

1. In the **Google Cloud console** (the project that was approved for the
   Business Profile API), go to **APIs & Services → Enabled APIs** and confirm
   these are enabled:
   - *My Business Account Management API*
   - *My Business Business Information API*
   - *My Business API* (v4 — the one with media + local posts)
2. **APIs & Services → OAuth consent screen**: set it up (External is fine),
   add your Google account as a **Test user** so consent works before
   verification, and add the scope `https://www.googleapis.com/auth/business.manage`.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID →
   Web application**. Under **Authorized redirect URIs** add:
   `https://southeastroofing.llc/upload` (any HTTPS URL you control works — it
   only needs to receive the `?code=` on redirect).
4. Copy the **Client ID** and **Client secret**.

Set in Vercel (Project → Settings → Environment Variables, all environments):

```
GBP_CLIENT_ID     = <client id>
GBP_CLIENT_SECRET = <client secret>
```

Redeploy so the env vars take effect.

### Step 2 — Get the consent URL

```bash
curl -u 'YOUR_UPLOAD_PASSWORD:' -X POST \
  'https://southeastroofing.llc/api/upload?step=gbp-auth' \
  -H 'content-type: application/json' \
  -d '{"redirectUri":"https://southeastroofing.llc/upload"}'
```

Returns a `consentUrl`. `redirectUri` **must exactly match** one of the
Authorized redirect URIs from Step 1.

### Step 3 — Authorize (the one human step)

Open `consentUrl` in a browser, sign in as the Google account that manages the
Business Profile, and approve. Google redirects to your redirect URI with
`?code=...` in the address bar. Copy that **code** value.

### Step 4 — Exchange the code for a refresh token

```bash
curl -u 'YOUR_UPLOAD_PASSWORD:' -X POST \
  'https://southeastroofing.llc/api/upload?step=gbp-auth' \
  -H 'content-type: application/json' \
  -d '{"code":"PASTE_CODE_HERE","redirectUri":"https://southeastroofing.llc/upload"}'
```

Returns `refreshToken`. Set it in Vercel (secret) and redeploy:

```
GBP_REFRESH_TOKEN = <refresh token>
```

> The refresh token is long-lived — you do this once. The site never stores
> it; you paste it into Vercel yourself.

### Step 5 — Find your account + location ids

```bash
curl -u 'YOUR_UPLOAD_PASSWORD:' -X POST \
  'https://southeastroofing.llc/api/upload?step=gbp' \
  -H 'content-type: application/json' -d '{}'
```

First call lists your **accounts** (`accounts/NNN`). Set the account id and
redeploy:

```
GBP_ACCOUNT_ID = accounts/NNN     # or just NNN
```

Run the same call again — now it also lists that account's **locations**
(`locations/MMM`, with the business title + address so you can tell which is
Southeast Roofing). Set it and redeploy:

```
GBP_LOCATION_ID = locations/MMM   # or just MMM
```

### Step 6 — Confirm the connection

Check presence + readiness (no secrets are ever returned):

```bash
curl -u 'YOUR_UPLOAD_PASSWORD:' -X POST \
  'https://southeastroofing.llc/api/upload?step=check' | jq .gbp
```

`autoPost: true` means every upload now posts to GBP. Do one live end-to-end
test against an existing project (posts a real Update + a gallery photo):

```bash
curl -u 'YOUR_UPLOAD_PASSWORD:' -X POST \
  'https://southeastroofing.llc/api/upload?step=gbp' \
  -H 'content-type: application/json' \
  -d '{"test":true,"id":"EXISTING_PROJECT_ID"}'
```

Check the profile's Photos and Updates tabs. Done — new uploads now fan out to
GBP automatically.

---

## Env var reference

| Var | Secret | What |
| --- | --- | --- |
| `GBP_CLIENT_ID` | — | OAuth client id |
| `GBP_CLIENT_SECRET` | ✅ | OAuth client secret |
| `GBP_REFRESH_TOKEN` | ✅ | From the one-time consent (Step 4) |
| `GBP_ACCOUNT_ID` | — | `accounts/NNN` or `NNN` |
| `GBP_LOCATION_ID` | — | `locations/MMM` or `MMM` |

All are **server-only** — never prefix with `NEXT_PUBLIC_`.

## Endpoints (all password-gated on `/api/upload`)

| Step | Purpose |
| --- | --- |
| `step=gbp-auth` | Get the consent URL / exchange the code for a refresh token |
| `step=gbp` | Discover accounts+locations; `{"test":true,"id":...}` to post a live test |
| `step=check` | `.gbp` shows presence booleans + `autoPost` readiness |

Implementation: `src/lib/gbp.ts` (API client) and the `handleCreate` /
`handleGbp` / `handleGbpAuth` handlers in `src/app/api/upload/route.ts`.
