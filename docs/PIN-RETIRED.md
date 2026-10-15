# /pin is retired (SE8, 2026-10-15)

Southeast Roofing's estimator moved to RoofGo (app.roofgo.com). On this site:

- **/pin** pages forward (308) to RoofGo; **/api/pin/*** answers 410 Gone, so
  nothing writes the /pin tables any more (`src/proxy.ts`). The estimate-open
  beacon (`/api/estimate/[token]/event`) no longer writes either.
- **The /pin database is kept untouched for 90 days: do not delete before
  2027-01-13**, and only on the owner's say-so. No tables were dropped.
- **Homeowner links** `/estimate/TOKEN` keep working: estimates made before
  2026-10-11 forward to RoofGo (SE7), /pin estimates made after that still
  render here read-only, and new website estimates forward to RoofGo.
- **The instant estimate** saves to RoofGo, not /pin (`src/lib/roofgo-lead.ts`,
  `src/lib/instant-estimate-save.ts`). The homeowner's email, the website-lead
  email and the Zapier webhook (`src/lib/leads.ts`) are unchanged and do not
  depend on RoofGo. A lead RoofGo does not acknowledge waits in the
  `roofgo_lead_outbox` table and is retried (after later estimates, when its
  link is opened, and daily by `/api/cron/roofgo-leads`); one still missing
  after an hour is emailed to the office (`ROOFGO_LEAD_ALERT_EMAIL`, default
  the office address).
- Settings (Vercel, Production): `ROOFGO_LEAD_ENDPOINT` (RoofGo's
  `links.roofsMsLeadEndpoint()`), `ROOFGO_LEAD_SECRET` (Sensitive; the same
  value as RoofGo's `ROOFS_MS_LEAD_SECRET`). To rotate, set a new value on both
  projects and redeploy both.
- The /pin code under `src/app/pin` and `src/app/api/pin` is left in place,
  unreachable, so the change can be undone by removing the /pin block in
  `src/proxy.ts`.
