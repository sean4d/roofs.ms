# Photo Playbook — filling the visual showroom

The site's image system is fully built and waiting on photography. Every
service card and page hero looks up its photo in ONE file:

    src/content/service-images.ts

## How to add a photo (anyone can do this)

1. Put the image file in `public/images/services/` (JPG/WebP, ideally
   1600px+ wide, landscape).
2. Open `src/content/service-images.ts` and replace the route's `null`
   with:

   ```ts
   "/commercial/tpo": {
     src: "/images/services/tpo-membrane.jpg",
     alt: "White TPO membrane roof on a commercial building",
   },
   ```

3. Commit. The service CARD becomes a photo card and the PAGE HERO picks
   up the image automatically — no design work.

**Integrity rule:** sourced/manufacturer photos keep generic descriptive
alt text. Only real Southeast Roofing jobs may be described as our work.

## Why the photos aren't in yet

The cloud build environment's network policy blocks downloads from every
image source (GAF, Owens Corning, stock libraries — verified). Two ways to
fill the slots:

- **Owner-supplied:** download from the GAF/Owens Corning contractor
  portals (we're authorized) or shoot our own, then send/commit the files.
- **Local Claude Code session:** run Claude Code on a machine without the
  network restriction and point it at this file — the shopping list below
  is the work order.

## The shopping list (one image each)

### Commercial systems
- [ ] `/commercial/epdm` — black EPDM rubber roof
- [ ] `/commercial/pvc` — white PVC membrane (restaurant/kitchen roof ideal)
- [ ] `/commercial/modified-bitumen` — granulated mod-bit roof
- [ ] `/commercial/roof-coatings` — crew applying silicone coating
- [ ] `/commercial/roof-maintenance` — technician inspecting a flat roof
- [ ] `/commercial/roof-replacement` — commercial reroof in progress
- [ ] `/commercial/roof-repair` — membrane repair work
- [ ] `/commercial/tpo` — TPO close-up (currently uses the aerial stock; a
      membrane-level shot is better)

### Metal systems
- [ ] `/residential/metal-roofing` — standing seam on a home
- [ ] `/residential/metal-roofing/standing-seam` — seam close-up
- [ ] `/residential/metal-roofing/exposed-fastener` — ribbed panel roof
- [ ] `/commercial/metal-roofing` — commercial metal building
- [ ] `/commercial/metal-roofing/standing-seam` — architectural standing seam
- [ ] `/commercial/metal-roofing/r-panel` — R-panel roof
- [ ] `/commercial/metal-roofing/pbr-panel` — PBR on a metal building
- [ ] `/commercial/metal-roofing/structural-metal` — pre-engineered building

### Residential exterior
- [ ] `/residential/gutters` — seamless gutter installation
- [ ] `/residential/leaf-guard` — guard installed on a gutter (close-up)
- [ ] `/residential/vinyl-siding` — vinyl siding install or finished wall
- [ ] `/residential/fiber-cement-siding` — fiber cement lap siding
- [ ] `/residential/fascia` — fascia board/capping install close-up
- [ ] `/residential/soffit` — vented soffit panels under an eave
- [ ] `/residential/ventilation` — ridge vent close-up

### Industries (photo of the building type)
- [ ] `/commercial/industries/schools` — school building
- [ ] `/commercial/industries/churches` — church with steep sanctuary roof
- [ ] `/commercial/industries/apartments` — apartment complex
- [ ] `/commercial/industries/industrial` — manufacturing facility
- [ ] `/commercial/industries/warehouses` — warehouse/distribution center
- [ ] `/commercial/industries/municipal` — city hall / civic building

### Already covered by real or licensed photos
`/residential`, shingle roofing, roof replacement, roof repair,
storm damage, emergency (tarping), insurance claims (hail),
`/commercial` (aerial).

## Service-page galleries

Once system photos exist in quantity (3–4 per system), add a `gallery`
block to the service's entry in `src/content/services/*.ts` — the page
renders the photo strip automatically, same as the shingle pages do today.
