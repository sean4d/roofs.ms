# /pin + Instant Estimator — Technical Brief

Context handoff document. Written for an AI assistant that has not seen the
codebase, as background for designing a commercial product aimed at roofing
contractors (instant estimates + direct mail for door-knocking sales teams).

Everything below describes software that is **live in production today** at
southeastroofing.llc, in daily use by one roofing company in Hattiesburg,
Mississippi. It is not a spec or a plan. Where something is a known weakness or
an untested assumption, it says so explicitly — those are the parts that matter
most when deciding what a multi-tenant product would need.

---

## 1. What exists, in one paragraph

A Next.js 16 application with two roofing-estimate surfaces sharing one
measurement and pricing engine:

- **`/pin`** — a private, mobile-first field tool for sales reps. Tap a house on
  a satellite map, get a roof measurement and a price in about five seconds,
  adjust it, save it to a customer record, and either email a PDF estimate,
  print one, or queue a physical mailer for the office to post.
- **`/instant-estimate`** — a public lead-capture tool on the marketing site.
  Homeowner enters contact details and an address, gets a measured price,
  company gets a lead.

Both are backed by Google's Solar API for roof geometry, a calibrated pricing
engine derived from five real signed contracts, and a Postgres database.

---

## 2. The measurement engine (the core IP)

**File: `src/lib/quotes/measure.ts` (~600 lines, heavily commented)**

### How it works

1. **Geocode** the address (Google Geocoding API), capturing `location_type`
   precision. `ROOFTOP` is the only precision that reliably pins one house.
   `RANGE_INTERPOLATED` means Google *divided a road's address range and
   guessed* — the pin can be on the right roof while the house number belongs to
   no real mailing address. That distinction is surfaced to the rep because the
   required action differs (check the photo vs. check the address before
   mailing).

2. **Call Google Solar API** `buildingInsights:findClosest`, trying
   `requiredQuality` HIGH → MEDIUM → LOW in sequence. Rural Mississippi is
   mostly MEDIUM; MEDIUM measured one calibration house to within 1%.

3. **Take the midpoint of two area readings.** The API returns both:
   - `wholeRoofStats.areaMeters2` — sum of individually detected roof planes
   - `buildingStats.areaMeters2` — outline of the whole detected building

   Measured against jobs with known takeoffs:

   | Method | Mean absolute error |
   |---|---|
   | Detected planes only | 12.3% |
   | Building outline only | 12.7% |
   | **Midpoint of the two** | **3.1%** |

   The planes miss porches and dormers the segmenter could not resolve; the
   outline includes overhang the shingles never cover. Neither edge is right and
   the midpoint is, by a wide margin. **This is the single most valuable finding
   in the codebase.**

4. **Dominant-bin pitch, not a mean.** Pitch is computed by binning roof planes
   into half-inch rise-over-12 buckets, summing area per bin, and reporting the
   largest bin's area-weighted mean. An area-weighted mean across all planes is
   dragged down by every low-slope attachment (porch, carport, patio cover) — a
   2,000 sq ft roof at 6:12 with a 400 sq ft porch at 2:12 averages to 5.3:12,
   and the roofer standing in the driveway would call it a 6:12. The error only
   ever ran one direction (too shallow), which is exactly how the owner
   described the complaint.

### Rejection rules (knowing when NOT to answer)

This is as important as the measurement. Four distinct failure modes were found
by calibrating against five completed jobs with known takeoffs:

| Address | Failure | Error |
|---|---|---|
| 546 Slade Rd, Purvis | measured a building 353 ft away | −82% |
| 701 E Holly, Ellisville | measured a building 149 ft away | −90% |
| 2112 Lackey, Leakesville | tree canopy broke up detection | −24% / +19% |
| 109 Green Timber, Purvis | 2013 imagery, house has since grown | −33% |
| 14580 Indian Trails, Biloxi | clean, recent | +0.8% |

Rules implemented:

- **Wrong building** — reject if the measured building's centre is further from
  the tapped point than `max(100 ft, buildingRadius + 60 ft)`. The allowance
  scales with building size because measurement is to the *centre*: a 2,000 sq ft
  footprint is ~25 ft centre-to-edge, an 8,000 sq ft one is ~50 ft. A flat limit
  punishes exactly the large houses worth the most. Quoting from either Slade or
  Holly would have put a $51,000 roof on the page at $8,700.
- **Not house-shaped** — reject below 800 sq ft (a shed the detector settled for)
  or above 20,000 sq ft (commercial; needs a real takeoff).
- **Mostly hidden** — reject if >50% of the outline is undetected.
- **Partially hidden** — `high` confidence under a 35% detection gap, `medium`
  above it.

### The threshold mistake worth learning from

The detection-gap threshold was originally **10%**, reasoned from five houses.
In the field the owner tapped 30 houses and got a price on 3. Sampling 72 real
buildings across six towns produced the actual distribution:

```
p10 6.4%   p25 9.7%   p50 13.3%   p75 21.5%   p90 25.3%
```

**The median house has a 13% gap.** A 10% threshold rejects ~89% of everything.
The gap is mostly ordinary segmenter incompleteness — porches, dormers,
attached garages — present on roofs in full view, not a tree-occlusion signal.
Worse, the one bad case that drove the tight threshold (Green Timber, −33%) was
a *stale photograph* problem wearing a gap-shaped disguise.

**Generalisable lesson for a product: do not set statistical thresholds from a
handful of examples, and do not let one misattributed failure tighten a rule
that punishes every other case.**

### The limit no algorithm fixes

Green Timber sat 0 ft off target with only a 15% detection gap, passed every
automatic check, and was still a third light — because the house had been added
to after the 2013 photograph. **Nothing in the data can detect this.** The
mitigation is a human one: every measurement carries its imagery date and an
aerial thumbnail, and the rep confirms the shape matches what they are looking
at before anything is sent. Five seconds at a door.

Stale imagery raises a *warning*, not a downgrade. An earlier version downgraded
firm prices to ranges on imagery older than 5 years; every one of the 72 sampled
buildings was shot in 2013 or 2019, so that rule would have turned every quote
in the territory into a range and deleted the product's main promise.

### Manual fallback

When the automatic read is rejected, the rep traces the roof footprint on the
map and picks the pitch off the elevation they can see from the street.
`measureTracedPolygon()` projects the polygon flat (spherical excess is
irrelevant over a house), applies the shoelace formula, and multiplies by the
slope factor. **Critically, the code never falls back to a rejected number —
the two worst misses both looked like perfectly ordinary responses.**

### Multiple structures

A property is not always one roof. `findClosest` returns ONE building. 109 Green
Timber is a house plus a detached shed: the tool returned 38.9 squares against a
real 94.36 and looked like a measurement failure when it was a *modelling*
failure. An estimate is now a list of structures — the rep taps the house, then
taps the shed, and both land on one quote and one piece of paper.

---

## 3. The pricing engine

**File: `src/config/quote-rates.ts`**

Derived from five real signed contracts, insurance and retail mixed:

```
701 E Holly, Ellisville      51.00 sq   $23,317   $457/sq
2112 Lackey, Leakesville     25.00 sq   $11,657   $466/sq  (insurance)
109 Green Timber, Purvis     94.36 sq   $44,000   $466/sq
14580 Indian Trails, Biloxi  18.11 sq    $9,120   $504/sq
546 Slade, Purvis            92.00 sq   $51,000   $554/sq
-----------------------------------------------------------
weighted                    280.47 sq  $139,094   $496/sq
```

Two load-bearing facts:

1. **Takeoff basis, not install.** The owner's squares are takeoff figures;
   Leakesville was 25 takeoff / 27 installed, so ~8% waste is *already inside*
   the dollars-per-square. The tool measures actual roof surface and prices it
   directly. Adding a waste multiplier would double-count and put every quote 8%
   over.
2. **Insurance and retail land in the same band** ($457–$554, all within ~10% of
   the middle). Unusual, and it is what lets one rate serve the whole tool.

### Modifiers

| Modifier | Values |
|---|---|
| Material | architectural 1.0 (base), premium 1.4, 29ga metal 2.15, 26ga metal 2.6, TPO 1.45, EPDM 1.5, mod-bit 1.55, PVC 1.7 |
| Stories | 1 story 1.0, 2 story 1.08 (can only ever ADD) |
| Complexity | by plane count: ≤4 Simple 1.0, ≤8 Moderate 1.04, ≤14 Complex 1.08, >14 Very cut up 1.12 |

Complexity uses plane count because it is the one complexity signal the aerial
measurement returns. These are the *additional* cost of complexity on top of the
~8% already in the base rate.

Flat systems skip both stories and complexity (a flat roof has no hips or
valleys). **The flat/commercial multipliers are explicitly placeholder pricing,
set deliberately high** — commercial pricing turns on insulation thickness,
attachment method, tear-off vs. recover and roof access, none of which aerial
measurement can see.

Final price is rounded to the nearest $50.

### Always one number, never a range

An earlier version returned a price range when measurement confidence was low.
The owner's objection is exact: *a rep cannot stand on a porch and say "somewhere
between nine and nineteen thousand."* A range does not read as honesty, it reads
as not knowing. The fix was at the source — the rep can adjust squares, pitch,
stories and material, and the price follows. One number, with a human
accountable for it.

### Financing disclosure (regulatory)

Payments are shown with the APR (GoodLeap, 12.99%) and terms in the fine print.
Under **Regulation Z**, stating the amount of any payment is a "triggering term",
and once one appears the advertisement must disclose repayment terms and the
APR. Showing payments *without* the rate is the exposed position, not the safe
one. Two compliant shapes exist: payments + rate + terms, or no payment figures
at all. **Any product doing this in the US needs this handled per-tenant.**

---

## 4. `/pin` — the field tool

Mobile-first, used one-handed in sunlight. Tabs: **Map · Estimates · Mailers ·
Accuracy** (plus Team and Settings for admins).

| Surface | Purpose |
|---|---|
| `/pin/map` | Google Maps JS satellite view. Tap a roof or type an address → measure → price → save |
| `/pin/estimates` | Every saved quote, scoped by role |
| `/pin/mail` | The mailer queue the office works |
| `/pin/mailer/[id]` | A single mailer's print view |
| `/pin/proposal/[id]` | Printable estimate / proposal |
| `/pin/accuracy` | Measured vs. real takeoff, per job |
| `/pin/team` | Add, deactivate reps (admin) |
| `/pin/settings` | Company profile, rate card, migrations (admin) |

### Auth model

Deliberately **not** a shared passphrase. Reps come and go, and a memorable
shared passphrase is one they keep using from their next job at another company,
quoting off this rate card.

- One account per person, keyed to company email
- Anyone with `@southeastroofing.llc` can self-register; the domain is checked
  server-side
- **No passwords.** Sign-in is a one-time emailed link — possession of the
  company mailbox *is* the credential. Disable the mailbox, the rep is out.
- Session cookie is signed and carries the user id, but is **never trusted
  alone**: every authenticated request re-loads the user row and re-checks
  `active`. That extra query per request is what makes "remove a rep who quit"
  take effect immediately rather than at cookie expiry.
- Seeded admin list lives in code so a fresh deploy against an empty database
  still has an administrator.
- Session length: six months ("trust this device").

### Duplicate-contact prevention

Two reps working the same street a fortnight apart both posting the same
homeowner an estimate reads, to that homeowner, as a company that does not know
what its own people are doing. Every delivery channel is recorded separately
(emailed / printed / mailed / hand-delivered) and **the map warns before the rep
does anything, at the moment they tap the house.**

### Accuracy feedback loop

The estimator was calibrated on four houses — nowhere near enough for a tool
pricing every door a rep knocks on. Meanwhile the company closes jobs weekly,
each producing a real takeoff, none of it recorded anywhere the tool could see.
`/pin/accuracy` captures three numbers per job: **measured** (what imagery
produced, frozen at save time), **quoted** (what went on the paper after human
adjustment), **actual** (the real takeoff). This is the mechanism for improving
the model over time and, in a multi-tenant product, would be the most valuable
dataset in the business.

---

## 5. The mailer system

The differentiator for door-knocking teams, and the part with the most
operational hard-won detail.

### Flow

`requested` → `mailed` → (`returned`) , with `rejected` as an alternative exit.
A human sits in the middle, so it is a queue, not an automation.

### The PDF

**File: `src/lib/quotes/mailer-pdf.ts`** — four pages, generated server-side with
`pdf-lib` + `qrcode`, set in **points**.

An HTML/CSS version existed first and could not hold its page count. Two sheets
printed double-sided and folded into a 6×9 envelope is a fixed budget; the
browser's answer to "how tall is a page" is not — about 980 CSS px in desktop
Chrome, about 700 on iOS Safari, which also stamps its own header and footer on
every printed page and will not be talked out of it. The same file measured four
sheets in the office and five on the owner's phone, repeatedly, whichever budget
it was tuned to. **There is no CSS that satisfies both, because the two page
boxes are different sizes.** A PDF page is a page: the print dialog scales it to
paper and does not re-flow it.

Contents include the aerial photo, the price, financing terms, a QR code to the
live estimate, and nearby completed work.

### Nearby work is city-level, and that is the honest limit

Project records carry a city and a slug, no coordinates. "1.4 miles away" is a
number the data cannot support, and printing it would be inventing a distance.
So: "roofs we have completed in Hattiesburg" when there are some, and the section
disappears entirely when there are not.

### Storm data

**File: `src/lib/quotes/storms.ts`** — NOAA NCEI Storm Events Database, filtered
to the service area, ~200 KB imported once per cold start. No API key, no network
call.

**The honesty rule:** a confirmed report is a report at a POINT, not a footprint.
The observer stood somewhere and wrote down what they saw. Everything carries a
distance and the caller must print it. *"1 inch hail confirmed 6 miles from this
address on April 22"* is true and checkable. *"Your roof was hit by hail"* is
neither, and the first homeowner who checks is the last one who believes the rest
of the page.

### USPS address validation (learned the hard way)

Thirteen envelopes came back across September and early October 2026. Causes:
NO SUCH NUMBER, NOT DELIVERABLE AS ADDRESSED, NO MAIL RECEPTACLE, VACANT,
UNCLAIMED.

Google **Address Validation API** with `enableUspsCass: true` is called before a
mailer can be queued. Codes that matter:

| Field | Meaning |
|---|---|
| `dpvConfirmation` Y | in the USPS file, confirmed |
| `dpvConfirmation` D | primary confirmed, unit number MISSING |
| `dpvConfirmation` S | unit number given is not real |
| `dpvConfirmation` N | not confirmed — this is NO SUCH NUMBER |
| `dpvConfirmation` *empty* | **not submitted for verification — inconclusive, NOT a refusal** |
| `dpvVacant` Y | real address, nobody there 90+ days |
| `dpvNoStat` Y | real, in the file, not an active delivery point (mail goes to a PO Box) |
| `dpvThrowback` Y | street address real, mail carried to a PO Box instead |
| `carrierRoute` starts `B` | PO Box section, not a driven route |

**Two critical implementation findings:**

1. **The request shape decides whether USPS answers at all.** Sending the whole
   address on one `addressLines` entry returns HTTP 200, `cassProcessed: true`, a
   standardised address and a carrier route — and **omits every `dpv*` field**.
   Split into street / city / state / ZIP as separate fields, the same key and
   address return the full delivery-point record. Measured against the thirteen
   returned envelopes: **one line caught 0 of 13; the split caught 9.** This bug
   made the entire validator a no-op in production for five days while a health
   check reported it green, because a malformed request returns a perfectly
   healthy 200.

2. **It must fail OPEN.** An unreachable API returns `unknown` and the mailer
   goes out recorded as unverified. Blocking on an outage trades a $0.78 problem
   for a business-stopping one. Block on evidence, never on the absence of it.

Four of thirteen are still not catchable: three where USPS reports the address
fully deliverable (NO MAIL RECEPTACLE is a carrier observation the delivery-point
file does not always carry) and one it cannot match at all.

---

## 6. The public instant estimator

**File: `src/app/api/instant-estimate/route.ts`**

### Contact details come first, price is the reward

The first version showed the number before asking for anything. The owner
overruled it: every measurement costs real money at Google, and a tool anybody
can run anonymously is a free service for competitors and the merely curious.
Name, email and phone arrive *with* the request; nothing is measured until they
do. This also collapses two round trips into one, which matters on a phone.

### A lead is created even when the roof cannot be measured

Roughly one address in five is under tree cover. That person has just typed
their phone number into a roofing company's website. They are not a failure
case, they are a lead who needs a human — and the original version quietly
dropped them.

### Protection

Per-IP rate limits, same-origin check, server-side key only.

| Endpoint | Limit |
|---|---|
| `/api/instant-estimate` | 8 / hour / IP |
| `/api/places/autocomplete` | 40 / min / IP |
| `/api/places/resolve` | 20 / min / IP |

**Known weakness:** these counters are in-memory per serverless instance, so
several instances each allow their own quota, and the same-origin check is a
header anyone can forge. **For a commercial product these must move to a shared
store (Redis/Upstash) with per-tenant quotas.**

---

## 7. APIs, cost model, and what it actually costs

### Google APIs in use

| API | Used for | Key |
|---|---|---|
| Geocoding | address → lat/lon + precision + components | server |
| Solar (`buildingInsights:findClosest`) | roof area, planes, pitch, imagery date | server |
| Static Maps | aerial thumbnails on estimates and PDFs | server |
| Places Autocomplete (New) | address fields site-wide | server (via proxy) |
| Address Validation (`enableUspsCass`) | USPS deliverability before mailing | server |
| Maps JavaScript | the `/pin` map itself | browser (restricted) |
| Business Profile (`mybusiness*`) | reviews, GBP posting | separate OAuth |

Two keys: an unrestricted **server key** (never reaches the browser — all
browser-facing imagery goes through own proxy routes) and an API-restricted
**browser key** for Maps JS.

### Pricing (verify against Google's live page — these move)

Since March 2025 the $200 universal monthly credit is gone, replaced by
**per-SKU free allowances**.

| SKU | Free / month | Then per 1,000 |
|---|---|---|
| Geocoding | 10,000 | $5.00 |
| Autocomplete (New) | 10,000 | $2.83 |
| Solar Building Insights | 10,000 | $10.00 |
| Address Validation Pro | 5,000 | $17.00 |
| Address Validation Enterprise | 1,000 | $25.00 |
| Dynamic Maps (JS load) | 10,000 | ~$7.00 |
| Static Maps | 10,000 | ~$2.00 |
| Business Profile APIs | — | free |

### Cost per action

| Action | Billed calls |
|---|---|
| One instant estimate | 1 geocode + 1 Solar |
| One `/pin` measurement | 1 geocode (if typed) + 1 Solar |
| One address typed into a form | ~3–5 autocomplete + 1 geocode (resolve) |
| One mailer queued | 1 Address Validation |
| One `/pin/map` page open | 1 Dynamic Maps load |
| Viewing an estimate's aerial | 1 Static Maps |

### Modelled monthly spend (one company)

| Scenario | Cost |
|---|---|
| Normal month | **$0** — everything inside free tiers |
| Storm month, 10× volume | **~$28** (all autocomplete) |
| One abusive IP at the code's own rate limits, 30 days | **~$5,790** |

**The code has no spend ceiling.** Per-IP limits slow a single attacker; they do
not bound monthly spend. Google **budget alerts do not cap spending** — they only
email. The only real cap is per-API daily quotas in Cloud Console. With quotas
at roughly 5–20× real usage, the hard maximum lands near **$14/month**.

**For a multi-tenant product this is the central unit-economics question:** at
~$0.015 per measurement (geocode + Solar past free tier), a tenant doing 1,000
doors a month costs ~$15 in Google spend. Free tiers are **per Cloud project**,
so a single shared project's allowance is consumed by all tenants together.

---

## 8. Stack and integrations

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router (note: `middleware` renamed `proxy`) |
| Hosting | Vercel |
| Database | Neon serverless Postgres (HTTP driver) |
| CMS | Sanity (marketing content, project photos) |
| Email | Resend REST API |
| PDF | `pdf-lib` + `qrcode`, server-side |
| AI | Anthropic API (captions, content, roof assistant, damage analyzer) |
| Social | Meta Graph API, Metricool, Google Business Profile |
| CRM | Roofr, via email-parser + webhook adapter |
| Storm data | NOAA NCEI, local dataset |

### Lead delivery is an adapter, not a hardcoded destination

Every submission fans out to all configured transports: a webhook
(`LEAD_WEBHOOK_URL`, pointed at Make/Zapier/Roofr, flat JSON so no-code tools map
fields easily) and email (office inbox + a Zapier Email Parser mailbox that
creates the Roofr job). **If no transport is configured the submission fails
loudly** — a lead must never silently vanish. Notably, `/pin` rep estimates
deliberately stay *out* of the CRM by never calling the lead delivery path.

### Migrations are hand-applied and idempotent

Every statement is `IF NOT EXISTS` or otherwise safe to re-run. A deploy does not
wait for a migration; the health endpoint reports whether the schema is as new as
the code. **This is a weakness for a product** — it needs real migration
tooling.

---

## 9. Known limitations (read this section twice)

### Measurement
- **Stale imagery is undetectable.** A house added to after the photo date
  measures short and passes every check. Only the rep's eyes catch it.
- Solar API coverage is good in the US but **not universal** — no data means no
  measurement.
- Commercial buildings over 20,000 sq ft are rejected outright.
- Flat/low-slope pricing is placeholder, deliberately high.
- Calibration is **five jobs plus 72 sampled buildings in one Mississippi
  market.** The $496/square base and every multiplier are local to one company's
  cost structure and one region's labour market. Nothing here transfers to
  another market unvalidated.

### Architecture
- **Single-tenant throughout.** One rate card, one company profile, one Google
  project, one database. No tenant isolation anywhere.
- Rate limits are per-instance in-memory, not shared.
- Email-domain auth assumes one company domain.
- Admin list is in code.
- No audit log, no usage metering, no billing.
- Migrations are manual.

### Operational
- Mailers need a human to print and post.
- NO MAIL RECEPTACLE and UNCLAIMED returns are not preventable from any data
  source.
- Accuracy data is entered by hand by the office.

---

## 10. What a commercial product would need

Roughly in dependency order.

**Tenancy and isolation**
- Tenant table; every row scoped to it; per-tenant rate card, profile, branding
- Per-tenant Google quota accounting, or per-tenant Cloud projects (free tiers
  are per project — this materially changes unit economics)
- Shared-store rate limiting with per-tenant ceilings

**Billing and metering**
- Meter measurements, mailers, seats
- Google spend is the main variable cost: ~$0.015/measurement past free tier

**Onboarding (the hard commercial problem)**
- Every tenant needs their own calibrated rate card. The $496/square figure came
  from five signed contracts. A new contractor has that data but it is in a
  filing cabinet. **An onboarding flow that extracts a defensible rate card from
  a contractor's own recent jobs is the single highest-value thing to build**,
  and the accuracy loop already sketches the mechanism.
- Per-tenant Reg Z financing config

**Mailer fulfilment**
- Integrate a print-and-mail API (Lob, PostGrid, Click2Mail) to remove the human
  step. This is likely the strongest commercial differentiator — nobody wants to
  run a print queue.

**Product surface**
- Native app or PWA (reps are outdoors, offline matters)
- Territory assignment and door-knocking routes
- Per-rep leaderboards from the accuracy data
- Team management beyond one email domain (SSO, invites)

**Technical hardening**
- Real migrations
- Audit log
- Per-tenant API key storage, encrypted
- The health-probe pattern generalised: **the address validator was a silent
  no-op for five days while reporting green.** Any probe must verify the thing
  actually happened, not that a request succeeded.

---

## 11. Transferable lessons

1. **Midpoint of two imperfect readings beat both edges** — 3.1% vs 12.3%/12.7%.
2. **Knowing when not to answer is worth more than the answer.** The two worst
   misses looked like perfectly ordinary API responses.
3. **Don't set thresholds from five examples.** A 10% gap limit rejected 89% of
   houses; the median house has a 13% gap.
4. **A 200 OK is not proof of success.** A malformed Address Validation request
   returns 200, `cassProcessed: true`, and no delivery-point data at all.
5. **Fail open on third-party outages** for anything that would otherwise stop
   the business working.
6. **One number, not a range.** A range reads as not knowing. Let a human adjust
   the inputs instead.
7. **Honesty constraints are product features.** "Hail confirmed 6 miles from
   this address on April 22" survives a homeowner checking; "your roof was hit by
   hail" does not.
8. **PDF, not HTML, for anything with a fixed page budget.**
