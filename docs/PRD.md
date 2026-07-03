# Southeast Roofing — Website Blueprint / PRD

**Project:** Southeast Roofing flagship website & long-term digital platform
**Primary live domain:** southeastroofing.llc
**Secondary domain:** roofs.ms (currently 301 redirects → southeastroofing.llc)
**Company base:** Hattiesburg, Mississippi — residential & commercial roofing within ~2 hours of Hattiesburg
**Status:** v3.1 — approved. Incorporates the 2026-07-03 owner directives: (a) full visual refresh to a light, premium navy palette (§6 supersedes any dark/charcoal/burgundy visual descriptors elsewhere in this document), (b) IA correction — Metal Roofing is a material/system within the Residential and Commercial divisions, not a third division (§2, §4.3), (c) service area is a full 2-hour radius of Hattiesburg including Jackson, Meridian, and towns between, (d) **standing brand directive — see §0.0**: residential asphalt shingle roof replacement is the primary business; credentials are GAF Certified Contractor (greatest emphasis), BBB accredited, MSBOC licensed. **Southeast Roofing is NOT an Owens Corning certified/preferred contractor** — OC is a product line only (a prior version of this document stated otherwise; corrected 2026-07-03).

---

## 0. Vision & Goals

### 0.0 Standing brand directive (2026-07-03 — supersedes conflicting statements)

1. **Positioning:** Southeast Roofing is first and foremost a **residential asphalt shingle roofing company**; residential roof replacement is the primary business. The 10-second rule: a homepage visitor must immediately understand *"we specialize in residential roof replacement."* Every major design decision reinforces this.
2. **Service hierarchy:** PRIMARY — residential roofing (asphalt shingle replacement, repairs, storm restoration, insurance claims, GAF & Owens Corning systems). SECONDARY — residential metal, commercial roofing, gutters, roof revive/cleaning, emergency services. Secondary services never visually outweigh residential asphalt shingle roofing (commercial "equal emphasis" language elsewhere in this document is superseded — commercial remains a full, credible funnel but visually subordinate).
3. **Manufacturer relationships:** **GAF Certified Contractor — the credential with the greatest emphasis.** Southeast Roofing is NOT an Owens Corning certified/preferred/platinum contractor and no wording may imply it. OC is a **product line we sell**: product imagery, logos, comparisons, and education are appropriate; certification claims are not.
4. **Asset policy:** official, current, high-res manufacturer assets (GAF, Owens Corning, Gibraltar, Spectra, Roofr, QXO, BBB, MSBOC, Google) may be sourced from official manufacturer sites; prefer SVG; never redraw/modify/recolor logos; red only inside third-party logos. Manufacturer product photography may support product/service/education pages and premium homepage sections, but is never presented as Southeast Roofing project work.
5. **Photo policy (tightened 2026-07-04):** supplied project photos NEVER appear on the homepage — they live exclusively in gallery/project/case-study contexts. Homepage visuals use super-high-quality licensed imagery (stock or official manufacturer photography) of premium homes and roofing work, registered in `src/content/stock-photos.ts` with provenance and generic alt text — stock is never presented as Southeast Roofing project work. The homepage "Recent work" section sells authenticity and links to the gallery rather than embedding photos. Video is an approved option for future hero treatments if it can meet the performance budget.
6. **Future product pages** (reusable CMS-driven template, added with minimal refactoring): GAF Timberline HDZ, Timberline UHDZ (if offered); OC Oakridge, Duration, Duration Designer/Flex/Storm/Max, Natural Shadow; Gibraltar metal systems; Spectra gutter systems. Adds ~12 pages to the §10.2 roadmap.

### 0.1 Immediate goals (in priority order)

1. **Generate roofing leads** — residential and commercial; every page drives toward a call, inspection request, or commercial consultation.
2. **Look more premium and trustworthy than local competitors** — cinematic, high-end contractor brand, not a template.
3. **Rank heavily in Google for local roofing searches** — service pages × location pages, schema, Core Web Vitals, long-term topical authority.
4. **Equal emphasis on commercial and residential** — a dedicated commercial experience, not a single commercial page.
5. **Flashy, modern, animated — without sacrificing speed or SEO.** Motion is a brand asset, never a performance tax.

### 0.2 Long-term vision (5+ years): the digital platform

This project is the foundation of Southeast Roofing's digital platform, not a disposable brochure site. The architecture must accommodate — without rewrites — the later addition of:

| Future capability | Architectural implication now |
|---|---|
| Customer portal (project status, documents, warranty records) | Reserved route group, auth-ready layout shell, DB introduced when needed |
| Employee portal (crew schedules, job docs) | Same auth foundation, role-based access pattern |
| Online scheduling | Booking flow slots into the existing lead-intake API layer |
| Financing tools (calculator → application) | Calculator ships as interactive feature; application flow integrates partner APIs later |
| AI customer assistant | Content modeled as structured data (CMS) so an assistant can ground on it; chat UI slots into layout |
| Commercial project portfolio & case studies | Case-study content type modeled in CMS from day one |
| Project-management integrations (JobNimbus, AccuLynx, etc.) | Lead intake built as a service layer with webhook/adapter pattern, not a hardcoded email |
| Blog & learning center | CMS-driven from launch; topical authority plan (§10) |
| Careers page | Simple at first; job-posting content type + `JobPosting` schema ready |
| CRM integrations | Same adapter pattern as PM integrations; leads stored, not just emailed |

**Guiding principle:** build the marketing site now, but make every hard-to-reverse choice (content model, route structure, lead pipeline, auth readiness) as if the platform features are coming — because they are.

**Integrity rule (non-negotiable):** No fake reviews, fake license numbers, fake awards, fake certifications, or fake guarantees anywhere on the site. Wherever real proof is required, the spec marks it `[NEEDS: …]` and the build uses clearly-labeled placeholders until the owner supplies the real asset.

---

## 1. Domain Strategy

**Current production setup — do not change without explicit owner decision:**

- **Primary:** `https://southeastroofing.llc` — the live, canonical domain. All canonical URLs, schema, sitemaps, and GBP references point here.
- **Secondary:** `https://roofs.ms` — 301 redirects to southeastroofing.llc.

**Implementation requirements:**

- Both domains attach to the Vercel project; the redirect is configured at the platform/domain level (not in-app), preserving paths (`roofs.ms/services/x` → `southeastroofing.llc/services/x`).
- The codebase must be **domain-agnostic**: the canonical host lives in a single environment variable / config value (`SITE_URL`) consumed by metadata, canonical tags, sitemap, robots, OG URLs, and JSON-LD. If the owner later decides to flip primary domains, the change is: one config value + swap the redirect direction + re-verify in Search Console. No content or code edits.
- No hardcoded domain strings anywhere in components or content.
- Search Console: both domains verified; sitemap submitted for the primary only.

---

## 2. Complete Sitemap

```
southeastroofing.llc
│
├── /                                     Homepage (residential + commercial dual emphasis)
│
├── RESIDENTIAL ROOFING (primary division 1)
├── /residential                          Residential hub
│   ├── /residential/asphalt-shingle-roofing
│   ├── /residential/metal-roofing        Residential metal hub
│   │   ├── /residential/metal-roofing/standing-seam
│   │   ├── /residential/metal-roofing/exposed-fastener
│   │   ├── /residential/metal-roofing/26-gauge
│   │   └── /residential/metal-roofing/29-gauge
│   ├── /residential/roof-replacement
│   ├── /residential/roof-repair
│   ├── /residential/gutters
│   ├── /residential/skylights
│   └── /residential/ventilation
│
├── COMMERCIAL ROOFING (primary division 2)
├── /commercial                           Commercial hub / commercial homepage
│   ├── /commercial/tpo
│   ├── /commercial/epdm
│   ├── /commercial/pvc
│   ├── /commercial/modified-bitumen
│   ├── /commercial/roof-coatings
│   ├── /commercial/metal-roofing         Commercial metal hub
│   │   ├── /commercial/metal-roofing/standing-seam
│   │   ├── /commercial/metal-roofing/r-panel
│   │   ├── /commercial/metal-roofing/pbr-panel
│   │   └── /commercial/metal-roofing/structural-metal
│   ├── /commercial/roof-maintenance
│   ├── /commercial/roof-replacement
│   ├── /commercial/roof-repair
│   ├── /commercial/industries            Industry hub
│   │   ├── /commercial/industries/schools
│   │   ├── /commercial/industries/churches
│   │   ├── /commercial/industries/apartments
│   │   ├── /commercial/industries/industrial
│   │   ├── /commercial/industries/warehouses
│   │   └── /commercial/industries/municipal
│   ├── /commercial/projects              Commercial portfolio
│   │   └── /commercial/projects/[slug]   Case studies
│   └── /commercial/request-consultation  Commercial lead flow (distinct from residential form)
│
├── METAL ROOFING — cross-category SEO hub (NOT a third division)
├── /metal-roofing                        Landing page that captures metal-intent searches and
│                                         routes visitors to /residential/metal-roofing or
│                                         /commercial/metal-roofing. Breadcrumbs, internal links,
│                                         and page hierarchy always present metal as a
│                                         material/system within the two divisions.
│
├── STORM DAMAGE (primary nav item)
├── /storm-damage                         Storm hub: damage types, response process
│   ├── /storm-damage/insurance-claims
│   └── /storm-damage/emergency-roofing
│
├── LOCAL SEO
├── /service-areas                        Hub (interactive map + all cities)
│   ├── /service-areas/hattiesburg        Tier 1
│   ├── /service-areas/petal              Tier 1
│   ├── /service-areas/laurel             Tier 1
│   ├── /service-areas/gulfport           Tier 1
│   ├── /service-areas/biloxi             Tier 1
│   ├── /service-areas/purvis …           Tier 2: purvis, sumrall, columbia, ellisville,
│   │                                     richton, seminary, poplarville, picayune, diamondhead
│   └── (data-driven — adding a city = one CMS entry; expansion list in §10)
│
├── PROOF
├── /projects                             Residential gallery (filterable: service, city, material)
│   └── /projects/[slug]                  Project case studies
├── /reviews                              Real reviews only
├── /about                                Story, team, values, credentials
│
├── CONVERSION
├── /free-inspection                      Residential conversion landing page
├── /quote                                Interactive quote wizard (Phase 8; route reserved)
├── /financing                            Financing info + calculator (calculator Phase 8)
├── /contact
│
├── CONTENT ENGINE
├── /learn                                Learning Center hub (evergreen guides, pillar pages)
│   ├── /learn/[category]/[slug]          e.g. /learn/metal-roofing/26-vs-29-gauge
│   └── (categories: metal-roofing, insurance-claims, storm-prep,
│        materials, maintenance, commercial, cost-guides)
├── /blog                                 Blog hub (timely posts, company news, storm updates)
│   └── /blog/[slug]
├── /storm-center                         Storm Center (Phase 8; route reserved — live storm
│                                         resources, emergency checklist, claims help)
│
├── COMPANY / PLATFORM
├── /careers                              Careers page (+ JobPosting schema when listings exist)
├── /portal                               RESERVED — customer portal (future)
├── /team                                 RESERVED — employee portal (future)
├── /schedule                             RESERVED — online scheduling (future)
│
├── /privacy-policy
├── /terms-of-service
├── sitemap.xml                           Auto-generated
└── robots.txt                            (reserved routes noindexed until launched)
```

**URL conventions:** lowercase, hyphenated, no trailing slashes, one canonical URL per page. Reserved routes return 404/noindex until their phase ships — they exist in the plan so nothing squats on the URL later.

---

## 3. Homepage — Section-by-Section Plan

The homepage now serves **two audiences**: homeowners and commercial decision-makers. It leads residential (higher volume) but gives commercial a first-class, above-the-fold-adjacent path.

| # | Section | Purpose & Motion |
|---|---------|------------------|
| 1 | **Hero** | Full-viewport dark cinematic hero `[NEEDS: hero media]`. Headline: premium South Mississippi roofing. Dual CTAs: **Call Now** + **Schedule Free Inspection**. Third quiet link: "Commercial project? Start here →" routing to /commercial. Parallax background, staggered text reveal, trust chips (licensed & insured `[NEEDS: license #]`, local, year founded `[NEEDS: year]`). |
| 2 | **Trust bar** | Animated count-up stats: rating `[NEEDS: source]`, roofs completed `[NEEDS: count]`, years in business, certifications `[NEEDS: real certs]`. |
| 3 | **Residential / Commercial split** | Two large cinematic panels side by side — "Residential Roofing" / "Commercial Roofing" — equal visual weight, hover-expand effect, each routing to its experience. This is the structural statement that we do both, seriously. |
| 4 | **Services grid** | 6–8 primary service cards (replacement, repair, storm, metal, emergency, inspections, gutters, insurance help). Hover lift + metallic border glow, staggered scroll-in. |
| 5 | **Emergency strip** | Burgundy band: "Storm damage? Leaking now?" + **24/7 Emergency Call** `[NEEDS: confirm availability]`. Subtle pulse. |
| 6 | **Metal roofing feature** | Dedicated showcase band for the metal category: standing-seam imagery, style chips (standing seam, R-panel, barndominium…), "Explore Metal Roofing" → /metal-roofing. Metal is a growth flagship and gets homepage real estate. |
| 7 | **Why Southeast Roofing** | Split layout, parallax image, 4–5 real differentiators (local & owner-operated, materials, clean sites, communication, warranty `[NEEDS: terms]`). |
| 8 | **Before / After showcase** | Interactive draggable sliders (2–3 projects) `[NEEDS: photo pairs]`. |
| 9 | **Process timeline** | Inspection → Estimate → (Insurance help) → Build day → Walkthrough & warranty. Scroll-drawn timeline. |
| 10 | **Commercial spotlight** | Building-owner-focused band: industries served (schools, churches, apartments, industrial, warehouses, municipal) as icon chips, featured commercial project `[NEEDS: commercial photos]`, CTA → /commercial/request-consultation. |
| 11 | **Insurance & financing strip** | Two panels: claims help + financing `[NEEDS: financing partner/terms]`, each with CTA. |
| 12 | **Featured projects** | 3–6 gallery cards (mix residential + commercial), hover zoom, → /projects. |
| 13 | **Reviews** | Real reviews only `[NEEDS: reviews + permission]`; until supplied, link-out panel to live Google profile `[NEEDS: GBP URL]`. |
| 14 | **Service-area map** | Stylized dark interactive map, animated pins, 2-hour radius ring (see §7 Interactive Features), city links. |
| 15 | **FAQ** | 5–7 questions, smooth accordion, FAQPage schema. |
| 16 | **Final CTA band** | Cinematic band + short quote form (name, phone, zip, residential/commercial toggle) + call button. |
| 17 | **Footer** | 5 columns: Residential Services, Commercial, Service Areas, Company (about/reviews/financing/careers/learn), Contact + hours + license `[NEEDS: #]` + socials `[NEEDS: profiles]`. |

**Persistent elements (all pages):** sticky condensing header (logo; primary nav: Residential Roofing · Commercial Roofing · Storm Damage · About · Financing · Projects · Learning Center · Contact; phone; "Free Inspection" button); sticky mobile bottom bar (**Call** + **Free Inspection**; on /commercial routes it swaps to **Call** + **Request Consultation**); toggleable storm-event banner slot.

---

## 4. Service Page Structure

### 4.1 Residential/core service template (unchanged from v1, 11 sections)

1. Service hero (breadcrumb, dual CTA, service imagery `[NEEDS: per-service photos]`)
2. Intro — what/who/why it matters in South Mississippi (heat, humidity, hurricane season); unique copy per service
3. "Signs you need this" icon list
4. What's included / our approach
5. Materials & options where relevant `[NEEDS: brands/products used]`
6. Before/After or gallery strip (filtered to service)
7. Insurance & financing panel (contextual weight)
8. Service-specific FAQ (FAQPage schema)
9. Related services (3 cards)
10. Service-area links ("We provide {service} in: …")
11. Final CTA band

**Emergency page additions:** 24/7 CTA above fold, "what to do right now" checklist, tarping/mitigation explainer.
**Insurance page additions:** step-by-step claims walkthrough, "we meet your adjuster," documentation checklist — factual assistance language, no outcome promises.

### 4.2 Commercial experience (new — equal emphasis)

Commercial buyers are not homeowners: they're property managers, facility directors, school boards, church committees, and owners' reps. Longer sales cycles, budget approvals, bid processes, maintenance contracts. The commercial experience is therefore **its own funnel**, not a re-skinned residential page.

**Commercial hub (/commercial) — the "commercial homepage":**
1. Commercial hero — building-owner messaging ("Protect your property, your tenants, and your budget"), CTA: **Request a Commercial Consultation** + direct line
2. Trust/credibility strip — commercial-relevant proof: bonding/insurance limits `[NEEDS: what's publishable]`, safety record `[NEEDS: real data]`, manufacturer commercial certifications `[NEEDS: real certs]`
3. Commercial services grid (replacement, repair, flat systems, metal, coatings, maintenance, inspections)
4. Industries served — six industry cards (schools, churches, apartments, industrial, warehouses, municipal)
5. Featured commercial projects / case-study cards `[NEEDS: commercial project history]`
6. Process for commercial clients — assessment → detailed proposal/spec → scheduling around operations → execution → maintenance plan
7. Why choose us for commercial — minimal disruption, documentation, communication with stakeholders
8. Commercial FAQ + final consultation CTA

**Commercial service pages** follow the core template but with commercial copy, flat/low-slope system detail, and the consultation CTA replacing "free inspection."

**Industry pages (/commercial/industries/*)** — the differentiator vs. local competitors:
1. Industry hero (e.g., "Roofing for Schools & Educational Facilities")
2. Industry-specific concerns (schools: summer scheduling, safety compliance, budget cycles; churches: steep-slope + architectural features, congregation fundraising timelines; apartments: tenant disruption, phased work; industrial/warehouse: large flat spans, downtime cost; municipal: bid/procurement processes `[NEEDS: confirm municipal bid experience]`)
3. Systems we recommend for this building type
4. Relevant case studies (as they accumulate)
5. Industry FAQ + consultation CTA

**Commercial lead flow (/commercial/request-consultation):** dedicated form — company, contact name/role, property type, property address, roof type (if known), approximate square footage, timeline, budget stage, description. Delivered with "commercial" tagging so the owner can triage. No instant-quote framing — commercial buyers expect a consultation.

**Case studies (/commercial/projects/[slug]):** challenge → solution → outcome format, system installed, timeline, photos; `[NEEDS: past commercial projects + client permission]`. Modeled as a CMS content type from day one.

### 4.3 Metal roofing — cross-category hub (IA-corrected 2026-07-03)

**Metal Roofing is NOT a separate business division.** It is a roofing system/material offered within BOTH primary divisions. Southeast Roofing has two primary service divisions — Residential Roofing and Commercial Roofing — and metal lives inside each (`/residential/metal-roofing/*`, `/commercial/metal-roofing/*`).

`/metal-roofing` exists purely as an SEO landing page: it captures metal-intent searches (still a massive topical-authority opportunity, §10) and immediately routes visitors to **Residential Metal Roofing** or **Commercial Metal Roofing**. Navigation, breadcrumbs, internal linking, URL structure, and page hierarchy must never present metal as equal to the two divisions.

**Cross-hub page (/metal-roofing):**
1. Premium metal hero (standing-seam imagery `[NEEDS: metal project photos]`)
2. **Two-path router** — equal cards for "Residential Metal Roofing" → `/residential/metal-roofing` and "Commercial Metal Roofing" → `/commercial/metal-roofing` (the page's primary job)
3. Materials & specs overview — 26 vs 29 gauge, Galvalume vs painted steel, panel profiles `[NEEDS: actual products/suppliers used]`
4. Metal vs shingle comparison block (honest, factual)
5. Metal gallery strip
6. Metal FAQ (lifespan, cost, noise myths, insurance benefits — factual only)
7. CTA: metal-specific estimate request

**Division metal pages** (rolling out Phases 3–4):

| Page | Focus |
|------|-------|
| /residential/metal-roofing | Homeowner metal hub: styles, colors, value, insurance considerations |
| /residential/metal-roofing/standing-seam | Concealed-fastener systems for homes |
| /residential/metal-roofing/exposed-fastener | Cost-effective exposed-fastener panels for homes |
| /residential/metal-roofing/26-gauge · /29-gauge | Gauge education/spec pages (buyer comparison intent) |
| /commercial/metal-roofing | Commercial metal hub: low-slope + architectural metal |
| /commercial/metal-roofing/standing-seam | Architectural standing seam for commercial buildings |
| /commercial/metal-roofing/r-panel · /pbr-panel | Panel systems for commercial/ag structures |
| /commercial/metal-roofing/structural-metal | Structural metal roof systems |

Deep-dive comparisons ("26 vs 29 gauge," "Galvalume vs painted") also live in the Learning Center and link into the division pages — division pages sell, learning pages rank and educate.

---

## 5. Service-Area SEO Strategy

**Model: hub-and-spoke, data-driven, uniqueness-enforced.** (Unchanged from v1 in structure; now CMS-driven and feeding the larger topical-authority plan in §10.)

- **Hub:** /service-areas — interactive map (§7), full city list, service-area overview.
- **Spokes:** one page per city from a CMS `location` document; adding city #15+ is a content entry, not a build.

**Tiers:**

| Tier | Cities | Depth |
|------|--------|------|
| 1 | Hattiesburg, Petal, Laurel, Gulfport, Biloxi | 800–1,200 words unique copy, neighborhoods/landmarks, city-specific FAQ, local projects |
| 2 | Purvis, Sumrall, Columbia, Ellisville, Richton, Seminary, Poplarville, Picayune, Diamondhead, **Jackson, Meridian** (added 2026-07-03 — real projects exist in both) | 500–700 words unique copy, county + response-time context, rotated FAQ pool |

**Coverage definition (owner-confirmed 2026-07-03):** the service area is a full **2-hour radius around Hattiesburg** — Jackson, Meridian, the Gulf Coast, and all towns and cities in between. The city-page system grows toward that radius; the interactive map's radius ring (§7.2) is the visual statement of it.

**Anti-doorway rules (critical):** genuinely local content on every page (county, landmarks, storm patterns, distance/response time, accumulating local projects); no find-and-replace body copy; Tier 2 ships in batches as unique copy completes — never thin.

**City page template:** hero + CTAs → unique local intro → services in {city} (linking mesh) → why locals choose us + response time → local projects slot → city FAQ (schema) → nearby areas → final CTA. Commercial note: Tier 1 city pages include a commercial section ("Commercial roofing in {city}") linking into the commercial funnel.

**Internal-linking mesh:** services ↔ cities, cities ↔ neighbors, footer carries both lists, Learning Center articles link down into service and city pages.

**Expansion path:** the CMS model reserves `service × city` combination pages — not built at launch; activated selectively later for proven high-value combos with unique copy (part of the 200+ page roadmap, §10).

**Google Business Profile:** site ↔ GBP linkage `[NEEDS: GBP access/URL]`; NAP identical site-wide, matching GBP exactly, sourced from one config record.

---

## 6. Brand / Design System (v3 — full refresh, 2026-07-03)

**This section supersedes every dark/charcoal/burgundy visual descriptor elsewhere in this document.** Target impression: a premium commercial + residential roofing company with a modern, high-end construction aesthetic — the visual company of elite commercial construction firms, high-end architecture studios, and premium home builders. "Apple meets Caterpillar meets Tesla meets a luxury architecture firm." Minimal. Premium. Confident. Purposeful.

### 6.1 Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary — Deep Navy | `#123B63` | Primary buttons, links, headings accent, footer background family |
| Navy hover | `#1B4A7A` | Primary button hover (slightly lighter navy) |
| Navy deep | `#0D2C4B` / `#0A2036` | Footer, dark accent surfaces |
| Secondary — Steel Blue | `#4F7EA8` | Secondary accents, focus rings, icons, data viz |
| Steel tint | `#E8EFF6` | Accent washes, subtle section tints |
| Background | `#FFFFFF` | Page background — light, airy |
| Surface | `#F5F7FA` | Alternating sections, muted surfaces, form fields |
| Text | `#2B2F33` (charcoal) | Body text |
| Slate gray | `#5C6670` | Secondary text |
| Borders | `#D8DEE6` (soft gray) | Card borders, dividers, inputs |
| Success | `#2E7D32` (forest green) | Success states only |
| Orange | `#C9702E` | **Very subtle, only when absolutely necessary** |

**Hard rules:** no heavy black backgrounds; **no red as a UI color** (red appears only inside official third-party logos — GAF etc., which always keep their original colors); no oversaturated colors; manufacturer logos never recolored.

### 6.2 Typography

Modern, clean, excellent readability — premium over flashy. Archivo (display, semibold/bold — not black-weight shouting) + Inter (body) via `next/font`, fluid `clamp()` scale, one H1 per page, generous line-height. Headings in charcoal or deep navy; steel-blue gradient accent on a single headline word at most.

### 6.3 Surfaces & components

- **Cards:** white background, `#D8DEE6` soft borders, large rounded corners (~16px), subtle shadows. Elevation whispers, never shouts.
- **Buttons:** primary = deep navy fill/white text, hover slightly lighter navy; secondary = white with navy border; destructive only if truly needed (never as a marketing accent).
- **Forms:** white/light-gray fields, soft borders, steel-blue focus rings, 44px+ touch targets.
- **Icons:** Lucide, 1.5px stroke, navy/steel.
- **Footer:** deep navy surface with the white knockout logo — the one intentionally dark region.

### 6.4 Spacing & atmosphere

Increase whitespace throughout — calm, premium feel; every section gets breathing room (roughly 112–176px vertical rhythm on desktop). Photography: real project photos, bright natural grading (no dark cinematic filter), large rounded corners, generous margins.

### 6.5 Motion tone

Elegant, smooth, professional — no gimmicks. Framer Motion used tastefully; every animation intentional (§7 mechanics stand; the *tone* is calm confidence, not spectacle).

### 6.6 Logo usage

Official artwork only, never recolored: navy version on light surfaces, white knockout (derived from official black artwork) on navy surfaces. Manufacturer/certification logos (GAF, Owens Corning, BBB) in original colors always.

- **Commercial sub-brand note:** the commercial experience shares this system with a slightly steelier, denser, more B2B tone. Same system, more boardroom.

---

## 7. Animation, Motion & Interactive Features

### 7.1 Motion system

*(Carried forward from v1 — unchanged.)* Lenis smooth scroll; Framer Motion for UI/reveals/transitions; GSAP + ScrollTrigger reserved for ≤2 scroll set pieces per page; CSS for micro-interactions. Motion vocabulary: 24–32px fade-rise reveals with 60–90ms stagger, ≤15% parallax, ≤6px hover lifts, ~1.2s count-ups, ≤300ms page transitions. Guardrails: transform/opacity only, server-rendered content never waits on animation JS, full `prefers-reduced-motion` support, hero text visible immediately.

### 7.2 Interactive feature roadmap (premium differentiators)

| Feature | Description | Phase |
|---------|-------------|-------|
| **Interactive service-area map** | Stylized dark SVG/vector map of South MS; hover/tap states per city; pins animate in on scroll; cities link to their pages | 5 |
| **Animated 2-hour radius** | On the map: a radius ring animating out from Hattiesburg communicating "if you're in this circle, we've got you" | 5 |
| **Before/after sliders** | Draggable, touch-friendly, transform-only comparison sliders | 2 |
| **Advanced project gallery** | Filterable by service / city / material / residential-commercial; animated filtering (FLIP), lightbox with keyboard nav | 6 |
| **Interactive quote wizard** (/quote) | Multi-step animated wizard: property type → service → roof details → photos (optional) → contact. Progress indicator, step transitions, saves partial state. Feeds the same lead pipeline with rich data | 8 |
| **Financing calculator** | Slider-driven monthly-payment estimator on /financing `[NEEDS: real financing terms — no invented rates; ships only when partner terms are known]` | 8 |
| **Storm Center** (/storm-center) | Activated during weather events: current storm info, "what to do now" checklist, emergency contact, insurance-claim starter, post-storm inspection scheduling. Toggleable site-wide banner drives to it | 8 |
| **Roofing Learning Center** (/learn) | Filterable, categorized educational library with pillar pages and reading-time UI — the topical-authority engine (§10) | 7 |
| **AI customer assistant** | Chat assistant grounded on CMS content (services, FAQs, learning articles) for instant answers + lead capture. Claude API; requires content maturity first | 8+ |

Every interactive feature obeys the motion guardrails and ships only when it can be fast, accessible, and honest (the calculator especially).

---

## 8. Lead-Generation Strategy

### 8.1 Two funnels

**Residential funnel** — high volume, fast decisions:
- Primary offer: **Free Roof Inspection**; secondary: free replacement estimate, emergency response, claims review
- CTAs on every page: Call Now (tel:) `[NEEDS: phone]`, Schedule Free Inspection, short embedded quote form, emergency CTA where relevant, financing + insurance CTAs, sticky mobile call bar
- Short form: name, phone, city/zip, service (10-second completion). Full form on /free-inspection and /contact: + address, preferred time, storm/insurance flag, message; photo upload phase 2

**Commercial funnel** — lower volume, higher value, longer cycle:
- Primary offer: **Commercial Roof Consultation** (assessment + written proposal)
- /commercial/request-consultation form per §4.2, tagged separately in delivery
- Secondary assets that nurture: case studies, industry pages, maintenance-program page
- Direct line prominently displayed — commercial buyers call

### 8.2 Lead pipeline (platform-ready)

- Forms: React Hook Form + Zod, inline validation, honeypot + invisible Turnstile, explicit success state with "what happens next"
- **Intake architecture:** form → server action / `/api/lead` → **lead service layer** that (a) stores the lead, (b) emails notification `[NEEDS: lead email]`, (c) fires optional webhooks. The webhook/adapter layer is how CRM and project-management integrations (JobNimbus, AccuLynx, Zapier…) attach later without touching forms `[NEEDS: current lead workflow]`
- Residential and commercial leads carry a `channel` tag end-to-end

### 8.3 Measurement

- GA4 + events: form submits (by channel), tel: clicks, CTA clicks, wizard step completion (later), scroll depth on money pages
- Call tracking `[NEEDS: decision — recommendation: single clean number at launch for NAP consistency; revisit dynamic tracking later]`
- /free-inspection and /commercial/request-consultation double as ad landing pages; UTM discipline

---

## 9. Technical Architecture

### 9.1 Stack

- **Next.js (App Router) + React + TypeScript**, SSG/ISR for all marketing pages
- **Tailwind CSS + shadcn/ui**, tokens mapped to the design system
- **Framer Motion + GSAP/ScrollTrigger + Lenis** per §7
- **Lucide, React Hook Form, Zod**
- **Sanity CMS** (recommendation §9.3) for structured content
- **Vercel** — both domains attached; roofs.ms → southeastroofing.llc 301 at domain level; `SITE_URL` env var is the single canonical-host source (§1)

### 9.2 Application structure (platform-ready)

```
src/
├── app/
│   ├── (marketing)/                     Public site — everything in §2
│   │   ├── page.tsx                     Home
│   │   ├── residential/…  commercial/…  metal-roofing/ (cross-hub)
│   │   ├── storm-damage/…  service-areas/…
│   │   ├── projects/…  learn/…  blog/…  storm-center/…
│   │   ├── free-inspection/…  quote/…  financing/…  contact/…  careers/…
│   │   ├── about/…  reviews/…  (+ legal)
│   │   └── layout.tsx                   Marketing shell (header/footer/sticky CTA)
│   ├── (platform)/                      RESERVED — future authenticated area
│   │   ├── portal/…                     Customer portal (future)
│   │   ├── team/…                       Employee portal (future)
│   │   └── layout.tsx                   Auth-gated shell (future)
│   ├── api/
│   │   ├── lead/route.ts                Lead intake → lead service layer
│   │   └── webhooks/…                   Integration endpoints (future CRM/PM)
│   ├── sitemap.ts / robots.ts
├── components/                          (§ component inventory)
├── lib/
│   ├── seo.ts / schema.ts / motion.ts
│   ├── leads/                           Lead service layer + adapter pattern
│   └── cms/                             Sanity client, typed queries (GROQ), image URLs
├── sanity/                              Studio config + schemas (services, locations,
│                                        projects, case studies, posts, guides, FAQs,
│                                        company/NAP singleton, jobs)
└── config/site.ts                       SITE_URL, NAP, feature flags (storm banner, etc.)
```

- **Route groups** separate marketing from the future platform area — the portal arrives later without disturbing the public site. Auth (Clerk or NextAuth) and a database (Vercel Postgres/Neon) are introduced **only when the first platform feature ships**; nothing pays that complexity cost now.
- **company/NAP singleton** in CMS + `config/site.ts` = single source of truth for name/address/phone/hours/license across footer, contact, schema.
- **Feature flags** (storm banner, storm center, wizard) let the owner toggle features from the CMS without deploys where appropriate.

### 9.3 CMS evaluation: Sanity vs Payload

| Criterion | Sanity | Payload |
|---|---|---|
| Hosting/ops | Fully managed (content lake + CDN); zero database to run | Self-hosted in the Next.js app; requires Postgres/Mongo you own (Neon/Supabase/Payload Cloud) |
| Editing experience | Sanity Studio — polished, real-time, customizable; excellent for a non-technical owner | Solid admin UI, TypeScript-native; slightly more "developer tool" feel |
| Structured content / SEO | First-class structured content, strong references/relations — ideal for service×city×material relationships that drive the 200+ page plan | Equally capable structurally; content lives in your DB |
| Images | Built-in image CDN with on-the-fly transforms (pairs well with next/image) | You manage storage (S3/UploadThing) + transforms |
| Cost at this scale | Generous free tier; small business likely free/cheap for years | Software free/open-source; you pay for DB + storage hosting |
| Ownership | Content lives in Sanity's cloud (exportable) | Full ownership, everything in your repo/DB |
| Platform future (portals, scheduling) | CMS stays content-only; app DB added separately later (clean separation) | Could double as app DB/backend later (one system) |
| Risk profile | Vendor dependency (mitigated by export) | You own uptime, backups, migrations |

**Recommendation: Sanity.**

Rationale for Southeast Roofing specifically:
1. **Ease of use wins** — the owner (non-developer) will add projects, reviews, city pages, and articles for years. Sanity Studio is the best non-technical editing experience of the two.
2. **Zero ops** — no database to babysit, back up, or migrate. For a roofing company, that's not a hobby worth having; managed infrastructure is worth the (currently ~zero) cost.
3. **Image pipeline** — a photo-heavy site gets Sanity's image CDN and transforms for free; with Payload we'd assemble storage + optimization ourselves.
4. **SEO content velocity** — the 200+ page topical-authority plan lives or dies on how easy it is to publish structured content. Sanity's references (a guide links a service, a material, and three cities) make the internal-linking mesh queryable and enforceable.
5. **Clean platform separation** — when the customer portal arrives, application data (users, projects, schedules) belongs in an app database anyway. Sanity for content + app DB for platform is a cleaner long-term architecture than stretching one CMS into both roles.

Payload would be the pick if full data ownership in-repo were a hard requirement or if we wanted the CMS to double as the platform backend. Neither outweighs ease-of-use + zero-ops for this business. **Decision point for owner: approve Sanity or request Payload.**

### 9.4 Rendering, performance, quality

*(Carried forward from v1.)* Static generation + ISR for CMS-driven pages (content publishes without full redeploys); Server Components by default, client islands only for interactivity; `next/image` + `next/font`; GSAP/Lenis dynamically imported. **Budgets: LCP < 2.0s, CLS < 0.05, INP < 200ms (throttled mobile); Lighthouse ≥ 90 on money pages — enforced per phase.** ESLint/Prettier/TS-strict, CI on GitHub, Vercel preview deploys, semantic landmarks + skip link + WCAG AA, custom 404, error boundaries.

---

## 10. SEO — Long-Term Topical Authority Plan (200+ pages)

### 10.1 Strategy

Local roofing SEO is won by being the **most complete, most local, most trustworthy answer** in the region. The plan builds four topical clusters, each anchored by pillar pages, interlinked down to service/city money pages:

1. **Residential roofing** (pillar: /services + roof-replacement cost guide)
2. **Commercial roofing** (pillar: /commercial — the biggest local content gap; competitors barely cover it)
3. **Metal roofing** (pillar: /metal-roofing — highest topical-authority upside; barndominium and gauge/material queries have real volume and weak local competition)
4. **Storm, insurance & maintenance** (pillar: storm-damage + insurance-claims pages, later Storm Center)

### 10.2 The 200+ page roadmap

| Content type | Pages (approx.) | Phase(s) |
|---|---|---|
| Core/residential service pages | 10 | 3 |
| Metal roofing hub + children | 7 | 3–4 |
| Commercial hub + services + industries + lead page | 15 | 4 |
| City pages (launch set) | 14 | 5 |
| City pages (expansion ring: e.g. Wiggins, Lucedale, Waynesboro, Collins, Mendenhall, Brookhaven, McComb, Bay St. Louis, Ocean Springs, Pascagoula, Mobile-line communities…) | +16 | 5→ongoing |
| Service × city combination pages (selective, high-value only — e.g. "metal roofing Hattiesburg," "commercial roofing Gulfport") | 30–40 | 7–8, data-justified |
| Learning Center — material & buying guides (gauge comparisons, Galvalume vs painted, shingle brand guides, TPO vs EPDM, metal vs shingle cost, roof lifespan in MS climate…) | 25–30 | 7→ongoing |
| Learning Center — insurance & storm education (claim walkthroughs, deductible law facts, hurricane prep, hail/wind damage identification…) | 20–25 | 7→ongoing |
| Learning Center — maintenance & homeowner education | 15–20 | 7→ongoing |
| Learning Center — commercial education (flat-roof systems, maintenance programs, budgeting/capital planning for facility managers…) | 15–20 | 7→ongoing |
| Blog (news, storm updates, completed-project stories) | 30+ | 7→ongoing |
| Project case studies (residential + commercial) | 20+ | 6→ongoing |
| **Total trajectory** | **215–250+** | ~24–36 months |

### 10.3 Editorial rules

- Every page earns its existence: unique intent, unique copy, a real query behind it. No page ships to hit a count.
- Pillar → cluster → money-page linking is mandatory and modeled in the CMS (every guide references its related service, material, and cities).
- E-E-A-T: articles carry real author attribution (owner/company), real photos, real local specifics; review/refresh cycle for top pages annually.
- Publishing cadence target after Phase 7: 4–8 quality pages/month `[NEEDS: decision — who writes: owner-supplied expertise + drafting support, or contracted]`.

### 10.4 Schema plan

| Page | JSON-LD |
|------|---------|
| All pages | `RoofingContractor` (name, URL, phone, address `[NEEDS: publishable?]`, geo, hours, areaServed, sameAs, license when supplied) |
| Homepage | + `WebSite`, `Organization` |
| Service/metal/commercial-service pages | + `Service` + `FAQPage` + `BreadcrumbList` |
| Industry pages | + `Service` (audience-scoped) + `FAQPage` + `BreadcrumbList` |
| City pages | + `Service` areaServed-scoped + `FAQPage` + `BreadcrumbList` |
| Case studies / projects | + `ImageObject` galleries; case-study `Article` schema |
| Learning Center / blog | + `Article` (+ `HowTo` where genuinely procedural) + `BreadcrumbList` |
| Reviews | + `AggregateRating`/`Review` **only with real, verifiable reviews** |
| Careers | + `JobPosting` (when real listings exist) |

### 10.5 Metadata & indexing

*(Carried forward from v1.)* Title pattern `{Topic} | Southeast Roofing — {City/Region}` ≤ 60 chars; unique ~150-char descriptions; canonical everywhere (host from `SITE_URL`); branded dynamic OG images; one H1 per page; descriptive contextual alt text; auto-generated sitemap.xml + robots.txt (reserved routes noindexed); breadcrumbs on all interior pages; Search Console on both domains, sitemap submitted for primary.

---

## 11. Component Inventory

**Layout & navigation:** SiteHeader (sticky/condensing, dual-audience nav) · MobileNav · StickyMobileCTA (context-aware: residential vs commercial) · EmergencyBanner (flag-driven) · SiteFooter (5-column) · Breadcrumbs (+schema) · PageTransition

**Heroes & CTA:** HomeHero · PageHero · SplitAudiencePanels (residential/commercial) · CTAButton (primary/secondary/emergency) · FinalCTABand (+short form) · EmergencyStrip · InsuranceFinancingPanels · MetalShowcaseBand · CommercialSpotlight

**Conversion & forms:** QuoteFormShort · QuoteFormFull · CommercialConsultForm · QuoteWizard (Phase 8) · FinancingCalculator (Phase 8) · FormField primitives · FormSuccess · PhoneLink (tracked) · TrustBadgeRow

**Content & proof:** ServiceCard/Grid · IndustryCard · MetalStyleCard · MaterialSpecTable · ProcessTimeline · StatCounter/StatsRow · BeforeAfterSlider · ProjectCard/ProjectGrid (filterable, FLIP) · CaseStudyLayout · ReviewCard/Carousel (real data only) · FAQAccordion (schema-emitting) · WhyUsSplit · ComparisonBlock (metal vs shingle etc.)

**Local SEO:** ServiceAreaMap (interactive) · RadiusRing (2-hour animation) · CityCard/CityLinkList · NearbyAreas · ServiceAreaLinksBlock · NAPBlock

**Content engine:** ArticleCard · CategoryFilter · PillarPageLayout · ArticleLayout (+Article schema) · AuthorBlock · RelatedContent (CMS-reference-driven) · StormCenterDashboard (Phase 8)

**Motion utilities:** Reveal · StaggerGroup · Parallax · CountUp · SmoothScrollProvider · ReducedMotionProvider

**SEO utilities:** JsonLd renderer · metadata builders · dynamic OG-image templates

---

## 12. Content Needed From Owner (the `[NEEDS]` list)

**Identity & legal:** ~~logo~~ ✅ RECEIVED 2026-07-03 (black + navy PNG, white knockout derived; note: logo is navy — palette reconciliation with burgundy accent still open) · MS contractor license # (public form) · insurance/bonding language safe to publish · legal entity name · year founded

**Contact & operations:** primary phone (+ emergency line?) · lead email(s) · address publishable vs service-area-only · hours + real 24/7 availability · GBP URL/access · social profiles · current lead workflow/CRM

**Proof & credibility:** real reviews + permission · ~~manufacturer certifications~~ ✅ CORRECTED 2026-07-03 (§0.0): **GAF Certified Contractor (primary emphasis) · BBB accredited · MSBOC licensed** — Owens Corning is a product line only, NOT a held certification · official GAF/BBB badge artwork to be sourced from manufacturer sites (permission granted §0.0.4) · `[NEEDS: MSBOC license number in its public form]` · real warranty terms · real awards/memberships · defensible stats (roofs completed, etc.) · safety record/EMR if publishable (commercial)

**Media:** ~~30–50 best project photos~~ ✅ **RECEIVED 2026-07-03**: 42 residential roof-replacement photos across 14 cities (`public/images/projects/`, manifest in `src/content/photos.ts`) + 24 storm-damage photos (`public/images/storm/`) + logos & badges (`public/images/brand/`). Still needed: before/after **pairs**, commercial project photos, metal roofing photos (standing seam especially), team/crew/truck photos, drone/video footage, **white/knockout logo for dark backgrounds**

**Business decisions:**
1. Confirm commercial systems offered (TPO? EPDM? coatings? maintenance programs?)
2. Confirm metal capabilities (standing seam? ag/barndominium? which panel lines/suppliers?)
3. Confirm Roof Cleaning / "Roof Revive" offering
4. Financing: offered today? partner? terms safe to state?
5. Municipal/government bid experience (yes/no — affects municipal page claims)
6. Call-tracking decision (recommendation: single number at launch)
7. **CMS approval: Sanity (recommended) or Payload (§9.3)**
8. Content authorship model for the 200+ page plan (§10.3)

Development is not blocked on the full list — phone, lead email, logo, and photos unblock the most, earliest.

---

## 13. Development Phases

**Phase 1 — Foundation**
Next.js + TS + Tailwind + shadcn/ui scaffold; design tokens + fonts; `SITE_URL` config + domain-agnostic SEO utilities; Vercel project with both domains (existing redirect direction preserved: roofs.ms → southeastroofing.llc); Sanity Studio + core schemas (service, location, project, case study, guide, post, FAQ, company singleton, flags); lead service layer (store + email + webhook stub); layout shell (header/footer/sticky CTAs); CI.
*Exit: deployed skeleton on southeastroofing.llc; CMS editable; lead pipeline works end-to-end.*

**Phase 2 — Homepage**
All 17 homepage sections; motion foundation (Lenis, Reveal/Stagger, hero parallax, count-ups, before/after slider); /free-inspection + /contact with working forms; GA4 + conversion events.
*Exit: the site converts. Lighthouse ≥ 90 mobile on home + form pages.*

**Phase 3 — Core Service Pages**
Services hub + 10 core service pages (unique copy); metal-roofing hub page + first children (standing-seam, materials); FAQ system + schema; emergency page + storm-banner flag; insurance & financing pages.
*Exit: full residential service coverage indexed and conversion-complete.*

**Phase 4 — Commercial Roofing**
Commercial hub; commercial service pages; six industry pages; /commercial/request-consultation flow with tagged delivery; commercial case-study template (+ first case studies as content allows); remaining metal children (commercial, agricultural, exposed-fastener, residential).
*Exit: the dedicated commercial funnel is live — equal footing with residential.*

**Phase 5 — Local SEO**
Service-areas hub + interactive map + 2-hour radius animation; Tier 1 city pages (full unique copy); Tier 2 in batches; internal-linking mesh + breadcrumbs; sitemap/robots finalization; GBP alignment; Search Console on both domains.
*Exit: hub-and-spoke local SEO system live and indexed.*

**Phase 6 — Gallery & Reviews**
Advanced filterable project gallery (residential + commercial, FLIP animations, lightbox); project case-study pages; /reviews with real reviews; /about; /careers (basic); remaining motion set pieces; dynamic OG images; full CWV + accessibility audit.
*Exit: proof layer complete; every remaining `[NEEDS]` either filled or consciously deferred.*

**Phase 7 — Blog & Learning Center**
/learn hub with categories + pillar pages; /blog; Article/HowTo schema; RelatedContent linking mesh; author/E-E-A-T framework; editorial workflow in Sanity; first content wave (per §10 roadmap); publishing cadence begins.
*Exit: the topical-authority engine is running; owner can publish without developer help.*

**Phase 8 — Future Platform Features**
Sequenced by business value, each its own mini-project: interactive quote wizard (/quote) → financing calculator (real terms only) → Storm Center → selective service×city pages (data-justified) → CRM/PM webhook integrations → AI customer assistant (grounded on mature CMS content) → customer portal → employee portal → online scheduling (auth + app DB arrive here).
*Exit: rolling — this phase is the 5-year platform runway.*

---

*End of PRD v2. No code will be written until this document is approved.*
