import { stormPhotos } from "@/content/photos";
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
 * unless the photo is genuinely ours. The /images/services/ assets are
 * AI-generated illustrative images (owner's Higgsfield account, 2026-07-05
 * — see docs/higgsfield-manifest.json); they are never captioned as
 * completed Southeast Roofing work.
 */

export interface ServiceImage {
  src: string;
  alt: string;
}

export const serviceImages: Record<string, ServiceImage | null> = {
  /* ── Residential ─────────────────────────────────────────────── */
  "/residential": {
    src: stockPhotos.residentialHome.src,
    alt: stockPhotos.residentialHome.alt,
  },
  // Interim licensed stock (owner 2026-07-05: service cards never use
  // gallery photos; Higgsfield replacements queued in OWNER-FEEDBACK doc)
  "/residential/asphalt-shingle-roofing": {
    src: "/images/services/asphalt-shingle-roof.webp",
    alt: "Architectural asphalt shingle roof on an upscale home",
  },
  "/residential/roof-replacement": {
    src: "/images/services/roof-replacement-home.webp",
    alt: "Newly completed architectural shingle roof replacement on a home",
  },
  "/residential/roof-repair": {
    src: stockPhotos.rooferInstalling.src,
    alt: stockPhotos.rooferInstalling.alt,
  },
  "/residential/metal-roofing": {
    src: "/images/services/residential-standing-seam-home.webp",
    alt: "Homes with dark standing seam metal roofs",
  },
  "/residential/metal-roofing/standing-seam": {
    src: "/images/services/standing-seam-closeup.webp",
    alt: "Close-up of standing seam metal roof panels with concealed fasteners",
  },
  "/residential/metal-roofing/exposed-fastener": {
    src: "/images/services/exposed-fastener-panel-roof.webp",
    alt: "Red exposed-fastener ribbed metal panel roof on a country home",
  },
  "/residential/gutters": {
    src: "/images/services/seamless-gutter-installation.webp",
    alt: "New white painted seamless metal gutter and downspout on a home",
  },
  "/residential/leaf-guard": {
    src: "/images/services/leaf-guard-mesh.webp",
    alt: "New micro-mesh gutter guard installed on a clean gutter and shingle roof",
  },
  "/residential/fascia": {
    src: "/images/services/wood-fascia.webp",
    alt: "Clean white painted wood fascia along a home's roofline",
  },
  "/residential/soffit": {
    src: "/images/services/wood-soffit.webp",
    alt: "Clean painted wood soffit under a home's eave",
  },
  "/residential/ventilation": {
    src: "/images/services/ridge-vent.webp",
    alt: "Black shingle-over ridge vent installed at the peak of an architectural shingle roof",
  },

  /* ── Storm ───────────────────────────────────────────────────── */
  "/storm-damage": {
    src: stormPhotos.find((p) => p.category === "wind-damage")!.src,
    alt: stormPhotos.find((p) => p.category === "wind-damage")!.alt,
  },
  "/storm-damage/emergency-roofing": {
    src: stormPhotos.find((p) => p.category === "rotted-decking")!.src,
    alt: stormPhotos.find((p) => p.category === "rotted-decking")!.alt,
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
  "/commercial/tpo": {
    src: "/images/services/tpo-membrane.webp",
    alt: "White TPO single-ply membrane roof on a commercial building",
  },
  "/commercial/epdm": {
    src: "/images/services/epdm-roof.webp",
    alt: "Roofer applying adhesive to a black EPDM membrane roof",
  },
  "/commercial/pvc": {
    src: "/images/services/pvc-membrane.webp",
    alt: "White PVC membrane roof on a commercial building",
  },
  "/commercial/modified-bitumen": {
    src: "/images/services/modified-bitumen.webp",
    alt: "Granulated modified bitumen roofing on a commercial flat roof",
  },
  "/commercial/roof-coatings": {
    src: "/images/services/roof-coating-application.webp",
    alt: "Roller applying bright white silicone coating on a commercial roof",
  },
  "/commercial/roof-maintenance": {
    src: "/images/services/roof-maintenance-inspection.webp",
    alt: "Technician inspecting a white commercial flat roof",
  },
  "/commercial/roof-replacement": {
    src: "/images/services/commercial-roof-replacement.webp",
    alt: "Commercial flat roof mid-replacement, old dark membrane beside new white membrane",
  },
  "/commercial/roof-repair": {
    src: "/images/services/membrane-repair-welding.webp",
    alt: "Heat-welding a repair patch on a white membrane roof",
  },
  "/commercial/metal-roofing": {
    src: "/images/services/commercial-metal-building.webp",
    alt: "Commercial metal building with a standing seam roof",
  },
  "/commercial/metal-roofing/standing-seam": {
    src: "/images/services/architectural-standing-seam.webp",
    alt: "Curved architectural standing seam metal roof on a modern commercial building",
  },
  "/commercial/metal-roofing/r-panel": {
    src: "/images/services/r-panel-roof.webp",
    alt: "Ribbed R-panel metal roof on a workshop building",
  },
  "/commercial/metal-roofing/pbr-panel": {
    src: "/images/services/pbr-panel-building.webp",
    alt: "Metal building with tan PBR panel roof and walls",
  },
  "/commercial/metal-roofing/structural-metal": {
    src: "/images/services/pre-engineered-steel-building.webp",
    alt: "Pre-engineered steel building with a full metal roof and wall system",
  },

  /* ── Industries — photos should match the building type ─────── */
  "/commercial/industries/schools": {
    src: "/images/services/school-building.webp",
    alt: "Single-story brick school building with covered walkways",
  },
  "/commercial/industries/churches": {
    src: "/images/services/church-building.webp",
    alt: "Brick church with a steep sanctuary roof and white steeple",
  },
  "/commercial/industries/apartments": {
    src: "/images/services/apartment-complex.webp",
    alt: "Garden-style apartment buildings with architectural shingle roofs",
  },
  "/commercial/industries/industrial": {
    src: "/images/services/manufacturing-facility.webp",
    alt: "Manufacturing facility with a metal roof and tall bay doors",
  },
  "/commercial/industries/warehouses": {
    src: "/images/services/distribution-warehouse.webp",
    alt: "Distribution warehouse exterior with loading docks",
  },
  "/commercial/industries/municipal": {
    src: "/images/services/municipal-building.webp",
    alt: "Brick civic building with columns and a flagpole",
  },
};

/** Look up a card image by route path (null when awaiting photography). */
export function serviceImageFor(href: string): ServiceImage | null {
  return serviceImages[href] ?? null;
}
