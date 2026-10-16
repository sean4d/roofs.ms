# Deployment & Service Setup

Two one-time steps need the owner's accounts (Claude can't create these).
Everything else is prepared — each is roughly a 5-minute task.

## 1. Vercel (hosting)

1. Go to [vercel.com](https://vercel.com) → sign up / log in **with your GitHub account (sean4d)**.
2. **Add New → Project** → import `sean4d/southeast-roofing-website`.
   Vercel auto-detects Next.js — no build settings to change.
3. Under **Environment Variables**, add (values from `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` = `https://southeastroofing.llc`
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = (from step 2 below)
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
4. Click **Deploy**. You'll get a `*.vercel.app` preview URL immediately.

### Domains — ⚠️ do NOT cut over yet

The live site at southeastroofing.llc stays on its current host until the
new site is approved for launch. When that day comes:

1. Vercel project → **Settings → Domains** → add `southeastroofing.llc`
   (primary) and `roofs.ms`.
2. Set `roofs.ms` to **Redirect (308) → southeastroofing.llc** — this
   preserves the current redirect direction (PRD §1).
3. Update DNS at your registrar as Vercel instructs (A/CNAME records).
4. Verify both domains in Google Search Console; submit the sitemap for
   southeastroofing.llc only.

## 2. Sanity (CMS)

1. Go to [sanity.io](https://www.sanity.io) → sign up (GitHub login is fine).
2. Create a new project (name: "Southeast Roofing"; dataset: `production`,
   visibility: public is fine for published content).
3. Copy the **Project ID** from the project dashboard.
4. Locally: copy `.env.example` to `.env.local` and paste the project ID.
   On Vercel: add it as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
5. In the Sanity dashboard → **API → CORS origins**, add:
   - `http://localhost:3000`
   - your `*.vercel.app` URL
   - `https://southeastroofing.llc` (at cutover)
6. The Studio then works at `/studio` — log in with the same account.

## 3. Lead pipeline (forms → your CRM)

The /free-inspection and /contact forms deliver every lead through two
channels — configure at least one in Vercel → Settings → Environment
Variables (until then, the form tells visitors to call instead):

**a) Webhook → Roofr CRM** (`LEAD_WEBHOOK_URL`): REMOVED 2026-10-16. The
webhook answered 404 and has been taken out of the code; Roofr jobs come from
the Zapier Email Parser address (`LEAD_ROOFR_EMAIL`) on the lead email. The
original steps follow for history only.

1. Recommended free route: [make.com](https://www.make.com) (free tier,
   1,000 ops/month). Create a scenario: **Webhooks → Custom webhook** →
   copy its URL → add a **Roofr** (or email/Google Sheets) module after it.
   Zapier works identically but requires its paid plan for webhooks.
2. Before wiring Make/Zapier, check Roofr's own settings for a direct
   lead-intake webhook or email — if it has one, use that URL and skip the
   middleman entirely.
3. Paste the URL as `LEAD_WEBHOOK_URL` and redeploy. Leads arrive as flat
   JSON: name, phone, email, city, address, service, storm, message,
   source, page, submittedAt.

**b) Email notification** (`RESEND_API_KEY`, optional `LEAD_NOTIFY_EMAIL`)

1. Create a free [resend.com](https://resend.com) account (100 emails/day
   free), verify the southeastroofing.llc domain, create an API key.
2. Add `RESEND_API_KEY`; leads email to `LEAD_NOTIFY_EMAIL` (defaults to
   the office address).

**c) "Pick a time" booking button** (`NEXT_PUBLIC_BOOKING_URL`)

1. Google Calendar → Create → **Appointment schedule** (free) → set your
   inspection availability → copy the booking-page link.
2. Add it as `NEXT_PUBLIC_BOOKING_URL`. The button appears on the form
   thank-you screen automatically. (A Cal.com link works the same way.)

## Local development

```bash
npm install
copy .env.example .env.local   # then fill in the Sanity project ID
npm run dev                    # http://localhost:3000
```

Checks: `npm run lint` · `npm run typecheck` · `npm run format:check` · `npm run build`
