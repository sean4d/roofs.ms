# Southeast Roofing — Website Blueprint / PRD

**Project:** Southeast Roofing flagship website
**Primary domain:** roofs.ms
**Secondary domain:** southeastroofing.llc (301 redirect → roofs.ms)
**Company base:** Hattiesburg, Mississippi — serving residential & commercial customers within ~2 hours of Hattiesburg
**Status:** Draft v1 — awaiting owner approval before development begins

---

## 0. Project Goals (in priority order)

1. **Generate roofing leads** — every page drives toward a call or a free-inspection request.
2. **Look more premium and trustworthy than local competitors** — cinematic, high-end contractor brand, not a template.
3. **Rank heavily in Google for local roofing searches** — service pages × location pages, schema, Core Web Vitals.
4. **Support future growth** — commercial, metal, emergency, insurance claims, financing, expanding service-area SEO.
5. **Flashy, modern, animated — without sacrificing speed or SEO.** Motion is a brand asset, never a performance tax.

**Integrity rule (non-negotiable):** No fake reviews, fake license numbers, fake awards, fake certifications, or fake guarantees anywhere on the site. Wherever real proof is required, the spec marks it `[NEEDS: …]` and the build uses clearly-labeled placeholders until the owner supplies the real asset.

---

## 1. Complete Sitemap

```
roofs.ms
│
├── /                                   Homepage
│
├── /services                           Services hub (all services grid)
│   ├── /services/residential-roofing
│   ├── /services/commercial-roofing
│   ├── /services/roof-replacement
│   ├── /services/roof-repair
│   ├── /services/storm-damage
│   ├── /services/insurance-claims
│   ├── /services/emergency-roofing
│   ├── /services/metal-roofing
│   ├── /services/shingle-roofing
│   ├── /services/flat-roofing
│   ├── /services/roof-inspections
│   ├── /services/gutters
│   └── /services/roof-cleaning        ("Roof Revive" soft-wash — confirm offering)
│
├── /service-areas                      Service-area hub (map + all cities)
│   ├── /service-areas/hattiesburg     Tier 1 (home city — deepest content)
│   ├── /service-areas/petal           Tier 1
│   ├── /service-areas/laurel          Tier 1
│   ├── /service-areas/gulfport        Tier 1
│   ├── /service-areas/biloxi          Tier 1
│   ├── /service-areas/purvis          Tier 2
│   ├── /service-areas/sumrall         Tier 2
│   ├── /service-areas/columbia        Tier 2
│   ├── /service-areas/ellisville      Tier 2
│   ├── /service-areas/richton         Tier 2
│   ├── /service-areas/seminary        Tier 2
│   ├── /service-areas/poplarville     Tier 2
│   ├── /service-areas/picayune        Tier 2
│   └── /service-areas/diamondhead     Tier 2
│       (system is data-driven — adding a city = adding one data entry)
│
├── /projects                           Project gallery (filterable by service/city)
│   └── /projects/[slug]               Individual project case studies (phase 2+)
│
├── /about                              Company story, team, values, credentials
├── /reviews                            Reviews page (real reviews only — placeholder until supplied)
├── /financing                          Financing options + CTA
├── /free-inspection                    Dedicated conversion landing page (primary form)
├── /contact                            Contact page (form, phone, map, hours)
│
├── /blog                               Blog hub (structure built now, content later)
│   └── /blog/[slug]
│
├── /privacy-policy
├── /terms-of-service
│
├── sitemap.xml                         Auto-generated
└── robots.txt
```

**Redirects:** `southeastroofing.llc/*` → 301 → `roofs.ms/*` (configured at Vercel domain level).

**URL conventions:** lowercase, hyphenated, no trailing slashes, no dates in blog URLs. Every page has exactly one canonical URL.

---

## 2. Homepage — Section-by-Section Plan

The homepage is the cinematic flagship. Every section has a job; every section ends within reach of a CTA.

| # | Section | Purpose | Content & Motion |
|---|---------|---------|------------------|
| 1 | **Hero** | Instant premium impression + immediate conversion path | Full-viewport dark cinematic hero. Background: high-quality roofing footage or Ken-Burns hero photo `[NEEDS: hero media]`. Headline emphasizing South Mississippi + premium roofing. Sub-line with service area. Dual CTAs: **Call Now** (tel: link) + **Schedule Free Inspection**. Subtle parallax on background, staggered text reveal on load. Trust chips under CTAs (licensed & insured `[NEEDS: license #]`, local, year founded `[NEEDS: year]`). |
| 2 | **Trust bar** | Social proof at first scroll | Horizontal strip: rating placeholder `[NEEDS: real review source + rating]`, roofs completed `[NEEDS: real count]`, years in business, certifications `[NEEDS: e.g. GAF/Owens Corning if held]`. Animated count-up on scroll into view. |
| 3 | **Services grid** | Route visitors to their need | 6–8 primary service cards (residential, commercial, replacement, repair, storm damage, metal, emergency, inspections). Card hover: lift + metallic border glow + icon micro-animation. Staggered scroll-in. Each links to its service page. "View all services" link. |
| 4 | **Emergency strip** | Capture urgent, high-intent visitors | Burgundy accent band: "Storm damage? Leaking now?" + **24/7 Emergency Call** CTA `[NEEDS: confirm emergency availability]`. Subtle animated pulse on the call button. |
| 5 | **Why Southeast Roofing** | Differentiation vs. competitors | Split layout: premium photography + 4–5 differentiators (local & owner-operated, quality materials, clean job sites, communication, warranty `[NEEDS: real warranty terms]`). Parallax image, sequential reveal of points. |
| 6 | **Before / After showcase** | Visual proof of quality | Interactive before/after slider (2–3 projects) `[NEEDS: before/after photo pairs]`. Draggable divider, GPU-accelerated. |
| 7 | **Process timeline** | Reduce anxiety, set expectations | 4–5 steps: Inspection → Estimate → (Insurance help if applicable) → Build day → Final walkthrough & warranty. Animated horizontal (desktop) / vertical (mobile) timeline that draws in as you scroll. |
| 8 | **Insurance & financing strip** | Remove the two biggest objections (cost + claims confusion) | Two side-by-side panels: "We help with insurance claims" and "Financing available" `[NEEDS: financing partner/terms]`. Each with its own CTA. |
| 9 | **Featured projects** | Portfolio depth | 3–6 project cards from the gallery (photo, city, service type). Hover zoom + caption slide. Links to /projects. |
| 10 | **Reviews** | Third-party trust | Carousel of real reviews `[NEEDS: real reviews + permission]`. Until supplied: a "See what neighbors say" panel linking to the live Google profile `[NEEDS: Google Business Profile URL]` — never fabricated quotes. |
| 11 | **Service-area map** | Local SEO + relevance signal | Stylized dark map of South Mississippi with animated location pins for each city. City names link to their service-area pages. |
| 12 | **FAQ** | Objection handling + FAQ schema | 5–7 questions (cost, timeline, insurance, materials, warranty). Smooth accordion. FAQPage JSON-LD. |
| 13 | **Final CTA band** | Last conversion push | Full-width cinematic band: "Ready for a roof you're proud of?" + inline short quote form (name, phone, zip) + call button. |
| 14 | **Footer** | Navigation + SEO internal linking | 4 columns: Services (all), Service Areas (all cities), Company (about/reviews/financing/contact), Contact info + hours + license line `[NEEDS: license #]`. Social links `[NEEDS: profiles]`. |

**Persistent elements (all pages):** sticky header that condenses on scroll (logo, nav, phone number, "Free Inspection" button); sticky mobile bottom bar with **Call** + **Free Inspection**; emergency banner slot (toggleable during storm events).

---

## 3. Service Page Structure (template — all 13 services)

Every service page is generated from one template + one data entry, keeping quality consistent and additions cheap.

1. **Service hero** — dark hero with service-specific headline, breadcrumb, dual CTA (Call / Free Inspection), service-relevant background image `[NEEDS: per-service photos]`.
2. **Intro block** — 2–3 paragraphs: what the service is, who it's for, why it matters in South Mississippi (heat, humidity, hurricane-season storms). Written per-service, never spun/duplicated.
3. **Signs you need this** — icon list ("You may need roof repair if…"). Scroll-staggered.
4. **What's included / our approach** — process or scope specific to this service.
5. **Materials / options** (where relevant) — e.g., shingle brands & styles, metal panel types, flat-roof membranes. `[NEEDS: actual brands/products used]`
6. **Before/After or gallery strip** — filtered to this service when photos exist.
7. **Insurance & financing panel** — contextual: heavy emphasis on storm-damage/insurance pages, lighter elsewhere.
8. **Service-specific FAQ** — 4–6 questions with FAQPage schema.
9. **Related services** — 3 cards (internal linking).
10. **Service-area links** — "We provide {service} in:" city link list (internal linking to location pages).
11. **Final CTA band** — quote form + call button.

**Emergency-roofing page additions:** 24/7 phone CTA above the fold, "what to do right now while you wait" checklist, tarping/mitigation explanation.

**Insurance-claims page additions:** step-by-step claims walkthrough, "we meet your adjuster" positioning, documentation checklist. No promises of claim outcomes — factual assistance language only.

---

## 4. Service-Area SEO Strategy

**Model: hub-and-spoke, data-driven, uniqueness-enforced.**

- **Hub:** `/service-areas` — map, full city list, service-area overview copy.
- **Spokes:** one page per city, all generated from a typed data file (`locations.ts`), so adding city #16 is a data entry, not a new build.

**Tier system (controls content depth):**

| Tier | Cities | Content depth |
|------|--------|---------------|
| 1 | Hattiesburg, Petal, Laurel, Gulfport, Biloxi | ~800–1,200 words unique copy, local landmarks/neighborhoods, city-specific FAQ, local project photos when available |
| 2 | Purvis, Sumrall, Columbia, Ellisville, Richton, Seminary, Poplarville, Picayune, Diamondhead | ~500–700 words unique copy, county + distance-from-Hattiesburg context, shared-but-rotated FAQ pool |

**Anti-doorway-page rules (critical — Google penalizes thin location pages):**
- Every city page must contain genuinely local content: county, neighborhoods/landmarks, weather/storm patterns relevant to that area, distance/response time from Hattiesburg, and real local projects as they accumulate.
- No find-and-replace city-name templating for body copy. Structure is shared; copy is written per city.
- Launch with Tier 1 pages fully written; Tier 2 pages roll out in batches as unique copy is completed rather than shipping thin.

**City page template:**
1. Hero: "Roofing in {City}, MS" + CTAs
2. Local intro (unique copy — the tier determines depth)
3. Services offered in {city} (links to all service pages — the internal-linking mesh)
4. Why locals choose Southeast Roofing + response-time note
5. Local projects gallery slot (fills over time)
6. City-specific FAQ (FAQPage schema)
7. Nearby areas served (links to adjacent city pages)
8. Final CTA band

**Internal-linking mesh:** every service page links to all city pages; every city page links to all service pages; city pages cross-link to neighbors; footer carries both full lists. This concentrates local relevance without orphan pages.

**Future expansion path:** the data model reserves an optional `service × city` combination page type (e.g., `/service-areas/hattiesburg/roof-replacement`) — **not built at launch** to avoid thin content, activated later for proven high-value combinations backed by unique copy.

**Google Business Profile:** the site links to and is linked from GBP `[NEEDS: GBP access/URL]`; NAP (name, address, phone) rendered identically site-wide and matching GBP exactly.

---

## 5. Brand / Design System

### 5.1 Color palette

| Token | Value (proposed) | Usage |
|-------|------------------|-------|
| `charcoal-950` | `#0B0B0D` | Page background (primary dark) |
| `charcoal-900` | `#131316` | Section alternation, cards |
| `charcoal-800` | `#1C1C21` | Elevated surfaces, card hover |
| `charcoal-700` | `#26262C` | Borders, dividers (subtle) |
| `silver-400` | `#C7CBD1` | Metallic accent — borders, icons, gradients |
| `silver-200` | `#E6E8EB` | Secondary text on dark |
| `white` | `#FFFFFF` | Headlines, primary text on dark |
| `burgundy-600` | `#7A1F2B` | Primary accent — CTAs, emergency, highlights |
| `burgundy-500` | `#93293A` | CTA hover, gradients |
| `burgundy-700` | `#5E1620` | Pressed states, deep accents |

- **Metallic effect:** silver gradients (`silver-400 → white → silver-400`) on key headline words, card borders, and dividers — used sparingly so it reads expensive, not chrome-plated.
- **Contrast rule:** all text/background combinations meet WCAG AA (4.5:1 body, 3:1 large text). Burgundy on charcoal is verified for buttons with white text.
- Light-surface sections (white/`silver-200`) may be used for occasional contrast breaks (e.g., process section) so the site doesn't fatigue — dark remains the dominant identity.

### 5.2 Typography

- **Headings:** a bold condensed-to-medium premium sans (e.g., *Archivo* or *Barlow Condensed* for display + tightened tracking) — strong, industrial, modern.
- **Body:** highly readable sans (e.g., *Inter*) at 16–18px base, relaxed line-height on dark backgrounds.
- Loaded via `next/font` (self-hosted, zero layout shift). Fluid type scale via `clamp()` — hero display ~clamp(2.5rem → 5rem).
- Hierarchy: one H1 per page; H2 per section; H3 within. Headline case: title case for display, sentence case elsewhere.

### 5.3 Imagery & texture

- Real project photography only — no obvious stock roofing photos on key pages. `[NEEDS: photo library]`
- Dark duotone/graded treatment on photos to sit in the palette; consistent grading across the site.
- Subtle texture allowed: fine grain/carbon texture on hero and CTA bands at very low opacity.
- All images: descriptive alt text (see SEO section), AVIF/WebP via `next/image`, dimensioned to prevent CLS.

### 5.4 UI style

- **Cards:** `charcoal-900` surface, 1px `charcoal-700` border, radius ~12–16px, hover lifts with silver border-glow.
- **Buttons:** primary = burgundy fill/white text; secondary = silver outline/ghost on dark; emergency = burgundy with subtle pulse. Generous padding, 44px+ touch targets.
- **Forms:** dark inputs with silver focus rings, inline validation, large touch-friendly fields.
- **Iconography:** Lucide, 1.5px stroke, silver default / burgundy for emphasis.
- Spacing: 4px base scale; sections breathe (96–160px vertical on desktop).

---

## 6. Animation / Motion System

**Philosophy: "expensive and controlled."** Motion confirms quality; it never blocks reading, delays interaction, or tanks Core Web Vitals.

### 6.1 Technology assignment

| Layer | Tool | Used for |
|-------|------|----------|
| Smooth scroll | **Lenis** | Site-wide inertial scroll (desktop; native on touch) |
| UI/component motion | **Framer Motion** | Section reveals, staggered cards, hover states, accordion, page transitions, sticky-header condensing |
| Scroll-driven set pieces | **GSAP + ScrollTrigger** | Hero parallax, process-timeline draw-in, stat count-ups synced to scroll, map pin choreography |
| Micro-interactions | CSS transitions | Links, buttons, focus states (cheapest path first) |

Rule: use the cheapest tool that achieves the effect. GSAP is reserved for the handful of scroll-driven set pieces; everything routine is Framer Motion or CSS.

### 6.2 Motion vocabulary (consistent site-wide)

- **Reveals:** fade + 24–32px rise, 0.5–0.7s, custom ease (`cubic-bezier(0.22, 1, 0.36, 1)`), staggered 60–90ms between siblings. Elements animate once (no re-trigger spam on scroll-up).
- **Parallax:** background layers max ~10–15% translate — depth, not seasickness.
- **Hover:** 150–250ms; lift ≤ 6px; border/glow transitions; image zoom ≤ 1.05.
- **Count-ups:** stats animate over ~1.2s when entering viewport, once.
- **Page transitions:** quick fade/slide via Framer Motion + App Router — ≤ 300ms, never gating LCP.
- **Before/After slider:** pointer/touch-driven, transform-only.

### 6.3 Performance & accessibility guardrails

- Animate **only** `transform` and `opacity` (compositor-friendly); no layout-property animation.
- All animation code loads client-side after content renders — pages are server-rendered and fully readable with JS disabled.
- `prefers-reduced-motion: reduce` → parallax off, reveals become simple fades or none, smooth scroll off, count-ups render final values.
- Nothing above the fold waits on an animation library to display (hero text visible immediately; motion enhances in).
- Motion budget: no page ships more than ~2 GSAP scroll-trigger set pieces.

---

## 7. Lead-Generation Strategy

### 7.1 Conversion inventory (every major page)

- **Call Now** — `tel:` link in header, hero, sticky mobile bar, final CTA `[NEEDS: primary phone number]`
- **Schedule Free Inspection** — primary button → `/free-inspection` or opens quote form
- **Quote form** — full version on `/free-inspection` and `/contact`; short version (name/phone/zip/service) embedded in final CTA bands
- **Emergency CTA** — homepage strip, storm/emergency pages, toggleable site-wide storm banner
- **Financing CTA** — homepage strip, service pages, `/financing`
- **Insurance-claim help CTA** — storm/insurance pages, homepage strip
- **Trust badges** — real credentials only `[NEEDS: license, insurance proof, any manufacturer certifications]`
- **Sticky mobile bottom bar** — Call + Free Inspection, always visible on mobile

### 7.2 Form design

- **Short form (embedded):** name, phone, city/zip, service needed → 10-second completion.
- **Full form (/free-inspection, /contact):** + address, preferred time, "is this storm/insurance related?", photo upload (phase 2), message. React Hook Form + Zod validation, inline errors, obvious success state with "what happens next" copy.
- Anti-spam: honeypot + optional Turnstile/reCAPTCHA (invisible-first).
- **Delivery:** server action → email notification to owner `[NEEDS: lead email address]` + storage. CRM/webhook integration (e.g., JobNimbus/AccuLynx/Zapier) reserved as phase 2 `[NEEDS: current lead workflow]`.

### 7.3 The offer ladder

Primary offer: **Free Roof Inspection** (low commitment, high intent). Secondary: free estimate on replacements; emergency response; insurance-claim review. Each page leads with the offer matching its intent (storm page → emergency/claims; metal page → design consultation/estimate).

### 7.4 Measurement

- GA4 + conversion events: form submit, tel: click, CTA clicks, scroll depth on money pages.
- Call tracking decision needed `[NEEDS: decision — dynamic call-tracking number vs. clean single NAP number; recommendation: single number at launch for NAP consistency, revisit later]`.
- UTM discipline for any future ads; `/free-inspection` doubles as the ads landing page.

---

## 8. Technical Architecture

### 8.1 Stack (confirmed)

- **Next.js (App Router) + React + TypeScript** — static generation (SSG) for all marketing pages
- **Tailwind CSS + shadcn/ui** — design-system tokens mapped to Tailwind theme
- **Framer Motion + GSAP (+ ScrollTrigger) + Lenis** — per motion system above
- **Lucide** icons; **React Hook Form + Zod** forms
- **Vercel** deployment (both domains; `.llc` domain 301s at the domain level)

### 8.2 Content model — data-driven pages

All repeatable page types are driven by typed data, not hand-built pages:

```
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                        Home
│   │   ├── services/page.tsx               Hub
│   │   ├── services/[slug]/page.tsx        Service template (generateStaticParams)
│   │   ├── service-areas/page.tsx          Hub
│   │   ├── service-areas/[slug]/page.tsx   City template (generateStaticParams)
│   │   ├── projects/…  about/…  reviews/…  financing/…
│   │   ├── free-inspection/…  contact/…  blog/…  (+ legal)
│   │   ├── layout.tsx                      Header/footer/sticky elements
│   │   └── sitemap.ts / robots.ts
│   └── api/lead/route.ts                   Lead intake (or server action)
├── components/                             (see §9)
├── content/
│   ├── services.ts                         Typed service entries (copy, FAQs, schema fields)
│   ├── locations.ts                        Typed city entries (tier, county, copy, FAQs, geo)
│   ├── faqs.ts  projects.ts  company.ts    NAP, hours, license, socials — single source of truth
├── lib/
│   ├── seo.ts                              Metadata builders (title/desc/OG/canonical)
│   ├── schema.ts                           JSON-LD builders (see §10)
│   └── motion.ts                           Shared variants/eases/viewport config
└── styles/
```

- Adding a service or city = one data entry; routes, sitemap, schema, and internal links all derive from the data files.
- `company.ts` is the single source of NAP truth — footer, contact page, and schema all read from it (consistency requirement for local SEO).
- Blog: MDX files at `content/blog/` (structure shipped at launch; posts later).

### 8.3 Rendering & performance strategy

- Every marketing page statically generated at build; content changes ship via commit → Vercel deploy.
- Server Components by default; client components only for interactive/animated islands (keeps JS payload small).
- `next/image` everywhere (AVIF/WebP, lazy below fold, priority hero); `next/font` self-hosted fonts.
- GSAP/Lenis dynamically imported; motion code excluded from server bundle.
- **Core Web Vitals budgets:** LCP < 2.0s, CLS < 0.05, INP < 200ms (mobile, throttled). Lighthouse ≥ 90 across the board on money pages, enforced before each phase ships.

### 8.4 Quality & operations

- ESLint + Prettier + TypeScript strict; CI on GitHub (build + lint must pass to merge).
- Vercel preview deployments per branch for owner review.
- 404 page with search-ish nav back to services/areas; error boundaries.
- Accessibility: semantic landmarks, skip-link, focus-visible styles, keyboard-operable sliders/accordions, WCAG AA contrast.

---

## 9. Component List

**Layout & navigation**
`SiteHeader` (sticky, condensing) · `MobileNav` (animated drawer) · `StickyMobileCTA` (call + inspection bar) · `EmergencyBanner` (toggleable) · `SiteFooter` · `Breadcrumbs` (with schema) · `PageTransition`

**Heroes & CTA**
`HomeHero` (cinematic/parallax) · `PageHero` (interior pages) · `CTAButton` (primary/secondary/emergency variants) · `FinalCTABand` (with embedded short form) · `EmergencyStrip` · `InsuranceFinancingPanels`

**Conversion & forms**
`QuoteFormShort` · `QuoteFormFull` · `FormField` primitives (shadcn/ui-based) · `FormSuccess` ("what happens next") · `PhoneLink` (tracked tel:) · `TrustBadgeRow`

**Content & proof**
`ServiceCard` · `ServicesGrid` · `ProcessTimeline` (animated) · `StatCounter` / `StatsRow` · `BeforeAfterSlider` · `ProjectCard` / `ProjectGrid` (filterable) · `ReviewCard` / `ReviewsCarousel` (real data only) · `FAQAccordion` (schema-emitting) · `WhyUsSplit` · `MaterialOptionCard`

**Local SEO**
`ServiceAreaMap` (stylized, animated pins) · `CityCard` / `CityLinkList` · `NearbyAreas` · `ServiceAreaLinksBlock` (for service pages) · `NAPBlock`

**Motion utilities**
`Reveal` (viewport-triggered wrapper) · `StaggerGroup` · `Parallax` · `CountUp` · `SmoothScrollProvider` (Lenis) · `ReducedMotionProvider`

**SEO utilities (non-visual)**
`JsonLd` renderer · metadata builder (`lib/seo.ts`) · OG-image template (dynamic per page)

---

## 10. SEO / Schema Plan

### 10.1 JSON-LD by page type

| Page | Schema |
|------|--------|
| All pages | `RoofingContractor` (subtype of LocalBusiness): name, URL, phone, address `[NEEDS: confirm public street address vs. service-area-only]`, geo, hours, areaServed (all cities), sameAs (GBP + socials), license # when supplied |
| Homepage | + `WebSite`, `Organization` (logo) |
| Service pages | + `Service` (name, description, provider, areaServed) + `FAQPage` + `BreadcrumbList` |
| City pages | + `Service`/areaServed scoped to city + `FAQPage` + `BreadcrumbList` |
| Projects | + `ImageObject` galleries (case-study schema phase 2) |
| Reviews page | + `AggregateRating`/`Review` **only when real, verifiable reviews exist** — never before |
| Blog posts | + `Article` + `BreadcrumbList` |

### 10.2 Metadata system

- Title pattern: `{Page Topic} | Southeast Roofing — {City/Region}` , ≤ 60 chars, service+geo keyword leading.
- Unique meta description per page (~150 chars, includes CTA language).
- Canonical on every page; OG + Twitter cards with branded dynamic OG images; `og:image` per page type.
- H1 = primary keyword phrase for the page (one per page); H2s map to section intents.
- Image alt strategy: descriptive + contextual ("Metal roof installation on a home in Petal, MS — Southeast Roofing") — factual, no keyword-stuffing, empty alt for decorative textures.

### 10.3 Indexing & structure

- `sitemap.xml` auto-generated from the route/data model; `robots.txt` allowing all, referencing sitemap.
- Internal-linking mesh per §4; breadcrumbs on all interior pages.
- Blog architecture ready at launch (topical clusters planned around storm prep, insurance education, material comparisons — content phase later).
- Core Web Vitals as a ranking input: budgets in §8.3 are SEO requirements, not just UX.

---

## 11. Content Needed From You (the `[NEEDS]` list)

**Identity & legal**
1. Logo files (vector if possible) — or confirm a logo needs to be designed
2. Mississippi contractor license number (as it should appear publicly)
3. Proof-of-insurance language you're comfortable publishing
4. Legal entity name for footer/terms (Southeast Roofing LLC?)
5. Year founded / years of experience (real figure)

**Contact & operations**
6. Primary phone number (and whether a separate emergency line exists)
7. Lead notification email address(es)
8. Business address — and whether it's publishable or service-area-only (affects schema + GBP strategy)
9. Business hours + real 24/7 emergency availability (yes/no)
10. Google Business Profile URL/access
11. Social profiles (Facebook, Instagram, etc.)
12. Current lead workflow/CRM if any (JobNimbus, AccuLynx, spreadsheet…)

**Proof & credibility**
13. Real customer reviews (source + permission to display)
14. Manufacturer certifications if any (GAF, Owens Corning, CertainTeed…) — only what's genuinely held
15. Real warranty terms (workmanship years, manufacturer warranties offered)
16. Any real awards/associations (BBB, chamber memberships…)
17. Roofs-completed count or other real stats you can stand behind

**Media**
18. Project photo library (best 30–50 shots; before/after pairs are gold)
19. Team/owner photos, truck/crew/jobsite photos
20. Any drone footage or video (hero candidate)

**Business decisions**
21. Financing: do you offer it today? Through whom? Terms you can state?
22. Confirm "Roof Cleaning / Roof Revive" is a real current offering
23. Commercial roofing: current capability level (affects how aggressively we position it)
24. Call tracking preference (§7.4 — recommendation: single clean number at launch)

**Launch is not blocked on all 24** — development starts with labeled placeholders; items 6, 7, 1, and 18 are the highest-impact to supply early.

---

## 12. Development Phases

**Phase 0 — Foundation (approval → scaffold)**
Next.js + TypeScript + Tailwind + shadcn/ui scaffold; design tokens; fonts; repo CI; Vercel project + both domains + redirect; `company.ts` data model; layout shell (header/footer/sticky CTA); SEO + schema utility libraries.
*Exit: deployed skeleton on roofs.ms with premium header/footer and working CTAs.*

**Phase 1 — Core conversion pages**
Homepage (all 14 sections); `/free-inspection` + working lead form (email delivery); `/contact`; motion system foundation (Lenis, Reveal/Stagger, hero parallax); GA4 + conversion events.
*Exit: the site can generate leads. Lighthouse ≥ 90 mobile verified.*

**Phase 2 — Services buildout**
Services hub + all 13 service pages (template + per-service copy); FAQ system + schema; before/after slider; insurance & financing pages; emergency page with storm-mode banner.
*Exit: full service coverage indexed, each page conversion-complete.*

**Phase 3 — Local SEO buildout**
Service-areas hub + map; Tier 1 city pages (full unique copy); Tier 2 pages in batches as copy completes; internal-linking mesh; breadcrumbs; sitemap/robots finalization; GBP alignment.
*Exit: the hub-and-spoke local SEO system is live and indexed.*

**Phase 4 — Proof & polish**
Project gallery (filterable) + real photography integration; reviews page with real reviews; about page; remaining motion set pieces (timeline draw, map pins, count-ups); OG image templates; accessibility + CWV audit pass.
*Exit: site fully matches this PRD; placeholder audit — every remaining `[NEEDS]` is either filled or consciously deferred.*

**Phase 5 — Growth layer (post-launch)**
Blog engine + first content clusters; project case-study pages; CRM/webhook lead integration; photo-upload on forms; call-tracking revisit; A/B tests on hero/CTA copy; expansion cities; (optional) service×city combination pages where justified.

---

*End of PRD v1. No code will be written until this document is approved.*
