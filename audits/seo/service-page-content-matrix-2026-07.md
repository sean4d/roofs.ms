# Service-page content & technical-SEO matrix — 2026-07 expansion

Working audit for the 35-route service-page expansion (owner directive
2026-07-30). Baseline word counts measured from the LIVE `<main>` element on
2026-07-30 (includes the shared service-area block and CTA bands, so treat
them as relative, not absolute). "After" counts filled at QC.

Owner pricing directive: **no dollar amounts anywhere on service pages** —
every page gets a cost-FACTORS section with an inspection/estimate CTA
instead. Comparison tables use relative wording only.

## Global technical findings (verified 2026-07-30)

- **Canonical domain**: `southeastroofing.llc` (apex). `www.` and `roofs.ms`
  308-redirect one-to-one; HTTP→HTTPS enforced; no trailing-slash
  alternation. Self-referencing canonicals via `buildMetadata` on every page;
  no child canonicalizes to a parent.
- **Known Google-side issue**: legacy `www` host signals from the old Wix
  site ("Duplicate, Google chose different canonical than user" on
  /financing). Site-side config is correct; owner is requesting indexing on
  `www` URLs so Google recrawls the redirects.
- **Sitemap**: all 35 routes present (hubs in `launchedStaticRoutes`,
  services from `allServices`). No redirecting/noindex/query URLs emitted.
  `lastmod` intentionally not emitted (no artificial freshness).
- **Rendering**: all main copy is server-rendered (static generation).
  FAQ answers exist in HTML (accordion is progressive). No client-only
  content, no doorway patterns.
- **Schema**: Organization/RoofingContractor site-wide; per-page Service +
  BreadcrumbList + FAQPage (FAQ text visible on page — schema mirrors it).
  No ratings/offers/reviews in service schema; planning prices never in
  Offer schema (moot — no prices published at all).
- **Business claims verified 2026-07-30**: GAF Certified Contractor (tier:
  "Certified" only — never Master Elite); BBB Accredited, **A+** (read from
  live bbb.org profile); MSBOC license #R22245 (classification not asserted
  anywhere); insured & bonded (owner-confirmed); GoodLeap $0-down financing
  (owner-confirmed); 24/7 emergency line (owner-confirmed); ~2-hour service
  radius (owner-confirmed); warranty wording = manufacturer limited-lifetime
  options on qualifying systems, never a Southeast Roofing guarantee; NOT an
  Owens Corning certified/preferred contractor (installs OC products only);
  no school/municipal project history claimed; combined team experience
  "10+ years combined" (owner-supplied 2026-07-30).

## Page matrix

Legend: WC = live word count before (2026-07-30). Status: R = rewritten this
pass, H = hub (summary + routing role). All rows get: unique metadata ✓,
self-canonical ✓, in sitemap ✓, FAQPage schema where FAQs render ✓.

| # | Route | WC before | Primary intent | Duplication concern before | Added this pass |
|---|-------|-----------|----------------|----------------------------|-----------------|
| 1 | /metal-roofing | 536 | Cross-division metal decision hub | Overlapped child pages | H: fastener/gauge/slope forks, 6-row system selector table, links to all 8 metal pages |
| 2 | /storm-damage | 605 | Post-storm first steps | Generic storm copy | H: first-hour checklist, damage-vs-wear, storm-chaser signs, res-vs-com response |
| 3 | /storm-damage/insurance-claims | 1094 | Contractor's role in a claim | — | R: 10-step sequence, ACV/RCV/deductible/... definitions table, legal-info disclaimer |
| 4 | /residential | 648 | Homeowner services hub | — | H: situation→service decision table, one-system prose |
| 5 | /residential/asphalt-shingle-roofing | 1287 | Architectural shingle guide | — | R: slope/nailing/system-layers facts, GAF-vs-OC, tables, costFactors |
| 6 | /residential/metal-roofing | 1112 | Res metal decision hub | Overlapped children | R: 3-way comparison table, routing focus |
| 7 | /residential/metal-roofing/standing-seam | 928 | Res standing-seam detail | Sibling overlap | R: spec table, snap-lock vs seamed, oil canning |
| 8 | /residential/metal-roofing/exposed-fastener | 961 | Screw-down metal detail | Sibling overlap | R: two profile families, fastener/washer facts |
| 9 | /residential/roof-replacement | 1211 | Replacement process | — | R: full sequence, system table, homeowner prep |
| 10 | /residential/roof-repair | 1018 | Leak diagnosis | — | R: leak-source catalog, repair-vs-replace table |
| 11 | /residential/gutters | 1026 | Seamless gutter sizing | — | R: 5"/6" + downspout sizing, geometry→volume |
| 12 | /residential/leaf-guard | 761 | Guard selection for pine straw | — | R: guard-type comparison table |
| 13 | /residential/fascia | 727 | Fascia/soffit rot repair | — | R: edge anatomy, wrap-vs-replace |
| 14 | /residential/ventilation | 1092 | Balanced attic ventilation | — | R: NFA worked example, balance rules |
| 15 | /commercial | 463 | Commercial system/planning hub | Thin | H: 8-row system selector table, project-reality prose |
| 16 | /commercial/tpo | 699 | TPO detail | Membrane-page sameness | R: mil/weld/attachment facts, TPO-vs-EPDM/PVC |
| 17 | /commercial/epdm | 682 | EPDM detail | Membrane-page sameness | R: tape seams, ballast caveats, black-vs-white |
| 18 | /commercial/pvc | 665 | PVC / chemical exposure | Membrane-page sameness | R: kitchen exposure, weld-compat warnings |
| 19 | /commercial/modified-bitumen | 640 | Mod-bit multi-ply detail | Membrane-page sameness | R: SBS/APP, install-method table |
| 20 | /commercial/roof-coatings | 738 | Restoration qualification | — | R: coat-ability, moisture testing, WFT/DFT |
| 21 | /commercial/metal-roofing | 695 | Commercial metal selector | Overlapped children | R: selector table, links to 4 children |
| 22 | /commercial/metal-roofing/standing-seam | 539 | Com standing-seam spec | 24–30% shared sentences w/ siblings (Google-rejected) | R: full spec table, arch-vs-structural, clip facts |
| 23 | /commercial/metal-roofing/r-panel | 551 | R-panel spec | same | R: terminology, roof-vs-wall, spec table |
| 24 | /commercial/metal-roofing/pbr-panel | 570 | PBR / open purlins | same | R: bearing leg, fastener patterns, spans |
| 25 | /commercial/metal-roofing/structural-metal | 551 | Engineered category | same | R: load path, category framing, spec table |
| 26 | /commercial/roof-repair | 673 | Commercial leak diagnosis | vs residential repair | R: membrane-ID-first, symptom table |
| 27 | /commercial/roof-replacement | 712 | Capital project planning | vs residential replacement | R: assessment→closeout, 8-system table |
| 28 | /commercial/roof-maintenance | 680 | Planned maintenance | — | R: maintenance matrix table, pricing models (no $) |
| 29 | /commercial/industries | 211 | Industry routing hub | Very thin | H: why-industry-matters prose + 6-row routing table |
| 30 | /commercial/industries/schools | 649 | K-12 campus roofing | Industry-template sameness | R: campus inventory, calendar phasing, hazmat testing |
| 31 | /commercial/industries/churches | 642 | Church campus roofing | same | R: many-systems-one-campus, steeple/valley details |
| 32 | /commercial/industries/apartments | 621 | Multifamily portfolios | same | R: tenant logistics, phasing, reserve planning |
| 33 | /commercial/industries/industrial | 596 | Plants/processing | same | R: exposure-driven selection, hot-work |
| 34 | /commercial/industries/warehouses | 623 | Large-area logistics roofs | same | R: span/drainage/skylights, inventory protection |
| 35 | /commercial/industries/municipal | 592 | Public procurement | same | R: bid documentation, continuity, no-history-claimed |

## Rewrite tracking

- Template: `sections` (prose + tables + links) / `costFactors` / section
  `links` added to ServiceContent + hub objects — commit(s) this branch.
- Content clusters: A residential (7 pages), B commercial membranes+ops (8),
  C metal (7), D storm+industries (7), hubs (5, incl. this file's author).
- Deployment/verification status: recorded in the final report at merge.

## Final measured results (rendered `<main>`, local production build 2026-07-30)

Counts include the shared service-area block, help panel, tool strip, and CTA
band, so they run higher than page-specific body copy. "Cost factors" replaces
the pricing column per the owner directive — **no page publishes a dollar
figure**; the only `$` on any service page is the allowed "$0 down financing
through GoodLeap" claim.

| Route | Words before | Words after | Tables | FAQ schema | Internal links | Dollar pricing | Cost factors + estimate CTA |
|---|---|---|---|---|---|---|---|
| `/metal-roofing` | 536 | 961 | 1 | yes | 11 | none | yes |
| `/storm-damage` | 605 | 1251 | 0 | yes | 12 | none | yes |
| `/storm-damage/insurance-claims` | 1094 | 2554 | 1 | yes | 48 | none | yes |
| `/residential` | 648 | 1061 | 1 | yes | 49 | none | yes |
| `/residential/asphalt-shingle-roofing` | 1287 | 2569 | 1 | yes | 47 | none | yes |
| `/residential/metal-roofing` | 1112 | 1956 | 1 | yes | 45 | none | yes |
| `/residential/metal-roofing/standing-seam` | 928 | 1850 | 1 | yes | 47 | none | yes |
| `/residential/metal-roofing/exposed-fastener` | 961 | 1926 | 1 | yes | 47 | none | yes |
| `/residential/roof-replacement` | 1211 | 2095 | 1 | yes | 47 | none | yes |
| `/residential/roof-repair` | 1018 | 1937 | 1 | yes | 47 | none | yes |
| `/residential/gutters` | 1026 | 1893 | 1 | yes | 44 | none | yes |
| `/residential/leaf-guard` | 761 | 1733 | 1 | yes | 44 | none | yes |
| `/residential/fascia` | 727 | 1655 | 0 | yes | 45 | none | yes |
| `/residential/ventilation` | 1092 | 2136 | 1 | yes | 47 | none | yes |
| `/commercial` | 463 | 1000 | 1 | yes | 18 | none | yes |
| `/commercial/tpo` | 699 | 1992 | 1 | yes | 49 | none | yes |
| `/commercial/epdm` | 682 | 1827 | 1 | yes | 49 | none | yes |
| `/commercial/pvc` | 665 | 1691 | 1 | yes | 47 | none | yes |
| `/commercial/modified-bitumen` | 640 | 1690 | 1 | yes | 47 | none | yes |
| `/commercial/roof-coatings` | 738 | 1826 | 1 | yes | 49 | none | yes |
| `/commercial/metal-roofing` | 695 | 1417 | 1 | yes | 48 | none | yes |
| `/commercial/metal-roofing/standing-seam` | 539 | 1504 | 1 | yes | 48 | none | yes |
| `/commercial/metal-roofing/r-panel` | 551 | 1490 | 1 | yes | 48 | none | yes |
| `/commercial/metal-roofing/pbr-panel` | 570 | 1564 | 1 | yes | 48 | none | yes |
| `/commercial/metal-roofing/structural-metal` | 551 | 1544 | 2 | yes | 47 | none | yes |
| `/commercial/roof-repair` | 673 | 1808 | 1 | yes | 51 | none | yes |
| `/commercial/roof-replacement` | 712 | 1880 | 1 | yes | 48 | none | yes |
| `/commercial/roof-maintenance` | 680 | 1719 | 1 | yes | 46 | none | yes |
| `/commercial/industries` | 211 | 821 | 1 | hub (no FAQ block) | 9 | none | yes |
| `/commercial/industries/schools` | 649 | 1907 | 1 | yes | 43 | none | yes |
| `/commercial/industries/churches` | 642 | 1826 | 1 | yes | 43 | none | yes |
| `/commercial/industries/apartments` | 621 | 1825 | 1 | yes | 43 | none | yes |
| `/commercial/industries/industrial` | 596 | 1705 | 1 | yes | 43 | none | yes |
| `/commercial/industries/warehouses` | 623 | 1851 | 1 | yes | 44 | none | yes |
| `/commercial/industries/municipal` | 592 | 1813 | 1 | yes | 42 | none | yes |

### Duplication review (rendered text, not source)

Method: fetched all 35 rendered pages, stripped `<main>`, removed the 17
sentences appearing on 5+ pages (shared template: global CTA, service-area
list, help panel, tool strip), then compared every one of the 595 page pairs.

- **3 of 595 pairs share any sentence at all**, and all three are shared
  *components*, not body copy: the interactive diagram's own hotspot labels
  (shingles vs replacement), the tool-strip card text (storm pages), and one
  related-services card (r-panel vs structural-metal).
- **Zero shared body sentences** between the four commercial metal children —
  previously 24–30% shared, which is what Google rejected them for. They now
  carry 50–58 unique body sentences each.
- Titles: 35/35 unique. Meta descriptions: 35/35 unique. One H1 per page,
  self-referencing canonical on the apex domain, all indexable, no page
  canonicalized to a parent.
