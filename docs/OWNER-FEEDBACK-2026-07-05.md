# Owner review — 2026-07-05 (laptop session work order)

Working checklist from Sean's full-site review. Execute in batches; check off as PRs merge.

## Batch 1 — quick fixes + real reviews (in progress)
- [x] Homepage hero trust chips misaligned on desktop → even grid (4 per line)
- [x] Hero phone + email row not lined up → align
- [x] Replace "Real roofs, real addresses" → "Real roofs. Real Southeast Roofing projects." Never imply customer addresses are shared — purge all "real addresses" phrasing site-wide (homepage.ts, reviews page, city copy: Petal, Gulfport, Biloxi FAQ, Jackson, Meridian, Sumrall, Ocean Springs)
- [x] /reviews: add real Google review quotes (permission granted 2026-07-05). 11 usable: Lynne, Dan, Barbara Watts, Raqual Brewer, Melanie Rouzano, Jim Blake, Barbara Blount, Lashae Jones, Vicky, JC Grines, Matthew Martin, E Rankin. EXCLUDED: Nene Jackson (review names "Roofing Society" — flagged to owner)
- [x] Storm Center more findable: button on /storm-damage page

## Batch 2 — financing calculator (GoodLeap terms supplied 2026-07-05)
Real offers (screenshot from GoodLeap portal): 5yr / 10yr / 15yr, all **12.99% APR with Autopay — Standard installment**.
- [x] /financing calculator: amount input → monthly payment per term, standard amortization
- [x] Disclaimers: estimate only, subject to GoodLeap credit approval, terms may change, autopay pricing

## Batch 3 — image regeneration (Higgsfield/online ONLY — never project-gallery photos for service slots)
Residential:
- [x] asphalt-shingle-roofing: current blurry/unprofessional → crisp professional architectural shingle roof
- [x] residential metal-roofing: looks like white paint stains → clean replacement
- [x] roof-replacement: blurry → new
- [x] gutters: downspout looks like PVC tube → white PAINTED SEAMLESS METAL K-style gutter + metal downspout, looks like ours
- [x] leaf-guard: dirty guard + dirty shingles → clean new guard on clean shingles
- [ ] REMOVE SIDING ENTIRELY: we do NOT do siding (only fascia + soffit). Delete /residential/vinyl-siding + /residential/fiber-cement-siding pages, registry entries, footer links, images, copy mentions
- [x] fascia + soffit photos look like metal → we mainly do WOOD: clean painted wood fascia + wood soffit photos
- [x] ventilation: ridge vent (OC VentSure) + turbine/box/power gallery. ORIG: photo shows no ridge vent → proper black plastic ridge vent with ridge cap shingled over. ALSO add photos + copy for: turbines, box vents, power attic vents (gallery on ventilation page)
- [ ] While changing cards, add photos to each corresponding service PAGE too (visual learners, product knowledge)

Commercial:
- [x] TPO: weird grid lines → flat rolls look
- [x] EPDM: janky lines → cleaner
- [ ] PVC: way too many lines → large sheets
- [x] commercial metal-roofing: ugly/dirty → nicer color, black
- [ ] commercial roof-replacement: horrible → crew blow-torching/working (torch-down scene)
- [x] warehouse (industries): looks fake → more realistic, NO vehicles

## Batch 4 — /storm-damage page photo swaps (indices = current storm gallery order, 1-based)
- [x] Add link to storm response gallery (/projects storm tab — needs deep-linkable URL)
- [x] Main top photo → storm gallery #21
- [x] Tree/debris impact picture → #20
- [x] Missing shingles photo → #3
- [x] Wind damage photo → #24

## Batch 5 — storm gallery relabel ✅ DONE (PR pending)
### was: (stormPhotos array, 1-based current order)
Rename files for SEO; add city; new categories. DELETE #2 (not our work) and #17.
1. Granular loss — Hattiesburg
2. DELETE ENTIRELY
3. Missing shingles / wind damage — Petal
4. Hail damage — Purvis
5. Hail damage — Biloxi
6. Dry-rotted pipe boot — Hattiesburg
7. Hail damage — Tylertown
8. Hail damage on ridge cap — Purvis
9. Hail damage — Gulfport
10. Hail damage on ridge cap — Gulfport
11. Rotted decking after tear-off — Hattiesburg
12. Rotted decking after tear-off — Hattiesburg
13. Hail damage to box vent — Meridian
14. Rotted-out soffit — Hattiesburg
15. Missing shingles / wind — Purvis
16. Wind / missing shingles — Jackson
17. DELETE ENTIRELY
18. Wind / missing shingles — Poplarville
19. Missing shingles / wind — Ellisville
20. Rotted decking after tear-off — Hattiesburg
21. Missing shingles / wind — Hattiesburg
22. Wind / missing shingles — Ocean Springs
23. Hail damage — Richton
24. Wind damage — Columbia

## Batch 6 — completed-roofs relabel + filters ✅ DONE except #27 (held, awaiting owner label)
### was: (projectPhotos, 1-based current order)
Build filters: manufacturer, product, color, material. Separate "during install" gallery. Rename files for SEO; update alt/schema/meta.
1. GAF Natural Shadow, Slate — Hattiesburg
2. DELETE ENTIRELY (site-wide)
3. GAF Natural Shadow, Slate — Purvis
4. During install: tear-off to decking — Brooklyn, MS
5. Owens Corning Duration, Driftwood — Hattiesburg
6. GAF Natural Shadow, Hickory — Brooklyn
7. During install: felted — Poplarville
8. GAF HDZ, Hickory — Poplarville
9. During install: tear-off to decking — Hattiesburg
10. GAF HDZ, Pewter Gray — Gulfport
11. Same roof as #1 (another angle) — Hattiesburg
12. DELETE ENTIRELY
13. DELETE (but see #27)
14. GAF HDZ, Barkwood — Richton
15. Same roof as #1 (another angle) — Hattiesburg
16. DELETE ENTIRELY
17. GAF Natural Shadow, Shakewood — Purvis
18. GAF Natural Shadow, Shakewood — Purvis
19. GAF HDZ, Slate — Poplarville
20. GAF HDZ, Charcoal — Ellisville
21. GAF Natural Shadow, Shakewood — Biloxi
22. DELETE ENTIRELY
23. GAF HDZ, Birchwood — Saucier
24. Same roof as #23 (another angle) — Saucier
25. Owens Corning Supreme, Onyx Black — Prentiss
26. Owens Corning Supreme, Driftwood — Lucedale
27. Same roof as #13, different angle — AMBIGUOUS: #13 deleted with no label; ASK OWNER for manufacturer/product/color/city or delete too
28. DELETE ENTIRELY
29. DELETE ENTIRELY
30. Same as #1 but has license plate visible → DELETE from website
31. GAF HDZ, Charcoal — Ellisville
32. Same roof as #31 — Ellisville
33. During install: felt + ice/water shield perimeter — Waynesboro
34. GAF HDZ, Slate — Petal
35. GAF HDZ, Shakewood — Picayune
36. GAF HDZ, Pewter Gray — Biloxi
37. Same roof as #36 — Biloxi
38. GAF HDZ, Pewter Gray — Poplarville
39. DELETE
40. During install: down to decking — Poplarville
41. Owens Corning Oakridge, Driftwood — Wiggins
42. DELETE

CASCADE: city pages gain/lose local photos (Columbia, Jackson, Meridian, Laurel, Ocean Springs lose all → their "completed local work" copy + FAQ claims MUST be updated; Brooklyn/Prentiss/Waynesboro/Tylertown/Saucier/Wiggins/Lucedale gain). New cities appear that have pages (Saucier, Wiggins, Lucedale get photo heroes automatically) — verify.

## Batch 7 — Facebook photo sourcing (permission granted)
Source additional job photos/brands/colors/locations from https://www.facebook.com/southeastroofing.llc — where data is missing, ASK OWNER to label. Expand gallery.

## Standing notes
- Owner will keep reviewing photos; expect more swaps
- GAF widgets on live /learn pages still need owner eyeball
