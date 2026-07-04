import { projectPhotos, stormPhotos } from "@/content/photos";
import { stockPhotos } from "@/content/stock-photos";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  SERVICE IMAGE REGISTRY — the photo drop zone (owner directive:
 *  visual-first site, modular images, effortless replacement)
 * ═══════════════════════════════════════════════════════════════════
 *
 * Every service/industry card on the site looks up its background image
 * here by route path. To add or swap a photo:
 *
 *   1. Drop the file in  public/images/services/  (any web format;
 *      ~1200px+ wide recommended)
 *   2. Fill the slot below:  { src: "/images/services/tpo.jpg",
 *      alt: "honest description" }
 *
 * That's it — the card flips from the icon fallback to a photo card
 * everywhere it appears. No component edits, no redesign.
 *
 * `null` = no honest imagery exists yet; the card renders the clean icon
 * treatment. INTEGRITY RULE: never present sourced/stock photography as
 * Southeast Roofing project work — keep alt text descriptive and generic
 * unless the photo is genuinely ours.
 */

export interface ServiceImage {
  src: string;
  alt: string;
}

/** Pick a real project photo by filename fragment (stable across reorders). */
const project = (fileFragment: string): ServiceImage => {
  const photo = projectPhotos.find((p) => p.src.includes(fileFragment))!;
  return { src: photo.src, alt: photo.alt };
};

export const serviceImages: Record<string, ServiceImage | null> = {
  /* ── Residential ─────────────────────────────────────────────── */
  "/residential": {
    src: stockPhotos.residentialHome.src,
    alt: stockPhotos.residentialHome.alt,
  },
  "/residential/asphalt-shingle-roofing": project("hattiesburg-ms-004"),
  "/residential/roof-replacement": project("petal-ms-001"),
  "/residential/roof-repair": {
    src: stockPhotos.rooferInstalling.src,
    alt: stockPhotos.rooferInstalling.alt,
  },
  "/residential/metal-roofing": null, // [NEEDS: residential metal photo]
  "/residential/metal-roofing/standing-seam": null, // [NEEDS: standing seam photo]
  "/residential/metal-roofing/exposed-fastener": null, // [NEEDS: exposed fastener photo]
  "/residential/gutters": null, // [NEEDS: seamless gutter installation photo]
  "/residential/leaf-guard": null, // [NEEDS: leaf guard close-up photo]
  "/residential/vinyl-siding": null, // [NEEDS: vinyl siding photo]
  "/residential/fiber-cement-siding": null, // [NEEDS: fiber cement siding photo]
  "/residential/fascia": null, // [NEEDS: fascia installation photo]
  "/residential/soffit": null, // [NEEDS: soffit installation photo]
  "/residential/ventilation": null, // [NEEDS: ridge vent close-up photo]

  /* ── Storm ───────────────────────────────────────────────────── */
  "/storm-damage": {
    src: stormPhotos.find((p) => p.category === "storm-damage")!.src,
    alt: stormPhotos.find((p) => p.category === "storm-damage")!.alt,
  },
  "/storm-damage/emergency-roofing": {
    src: stormPhotos.find((p) => p.category === "emergency-tarp")!.src,
    alt: stormPhotos.find((p) => p.category === "emergency-tarp")!.alt,
  },
  "/storm-damage/insurance-claims": {
    src: stormPhotos.find((p) => p.category === "hail-damage")!.src,
    alt: stormPhotos.find((p) => p.category === "hail-damage")!.alt,
  },

  /* ── Commercial ──────────────────────────────────────────────── */
  "/commercial": {
    src: stockPhotos.commercialAerial.src,
    alt: stockPhotos.commercialAerial.alt,
  },
  // Aerial of white membrane roofs — honest generic for TPO until a
  // dedicated membrane close-up is supplied
  "/commercial/tpo": {
    src: stockPhotos.commercialAerial.src,
    alt: stockPhotos.commercialAerial.alt,
  },
  "/commercial/epdm": null, // [NEEDS: black EPDM roof photo]
  "/commercial/pvc": null, // [NEEDS: white PVC roof photo]
  "/commercial/modified-bitumen": null, // [NEEDS: mod-bit roof photo]
  "/commercial/roof-coatings": null, // [NEEDS: coating application photo]
  "/commercial/roof-maintenance": null, // [NEEDS: rooftop inspection photo]
  "/commercial/roof-replacement": null, // [NEEDS: commercial reroof photo]
  "/commercial/roof-repair": null, // [NEEDS: commercial repair photo]
  "/commercial/metal-roofing": null, // [NEEDS: commercial metal photo]
  "/commercial/metal-roofing/standing-seam": null,
  "/commercial/metal-roofing/r-panel": null,
  "/commercial/metal-roofing/pbr-panel": null,
  "/commercial/metal-roofing/structural-metal": null,

  /* ── Industries — photos should match the building type ─────── */
  "/commercial/industries/schools": null, // [NEEDS: school building photo]
  "/commercial/industries/churches": null, // [NEEDS: church photo]
  "/commercial/industries/apartments": null, // [NEEDS: apartment complex photo]
  "/commercial/industries/industrial": null, // [NEEDS: industrial facility photo]
  "/commercial/industries/warehouses": null, // [NEEDS: warehouse photo]
  "/commercial/industries/municipal": null, // [NEEDS: civic building photo]
};

/** Look up a card image by route path (null when awaiting photography). */
export function serviceImageFor(href: string): ServiceImage | null {
  return serviceImages[href] ?? null;
}
