/**
 * Typed manifest of real Southeast Roofing photography. Labels, cities,
 * manufacturers, product lines, and colors were corrected line-by-line by
 * the owner (2026-07-05 review — see docs/OWNER-FEEDBACK-2026-07-05.md).
 * Filenames carry the SEO-relevant facts; alt text states only what the
 * owner confirmed. Photos the owner disowned or rejected were deleted.
 *
 * ON HOLD (kept on disk, excluded here pending an owner label):
 *   /images/projects/residential-roof-replacement-ocean-springs-ms-001.webp
 *   — "same roof as deleted #13, different angle"; needs product/city.
 *   A GAF HDZ Birchwood roof (shingle + rolled patio) was supplied in the
 *   2026-07-06 batch with no city; excluded until the owner names the town.
 */

export type PhotoKind = "completed" | "in-progress";

export interface ProjectPhoto {
  src: string;
  city: string;
  citySlug: string;
  alt: string;
  kind: PhotoKind;
  /** Roof system — shingle roofs omit this (treated as "shingle"). */
  material?: "shingle" | "metal";
  /** Shingle facts (completed roofs; owner-confirmed) */
  manufacturer?: "GAF" | "Owens Corning";
  line?: string;
  color?: string;
  /** Install stage (in-progress photos) */
  stage?: string;
}

export type StormCategory =
  | "hail-damage"
  | "wind-damage"
  | "granular-loss"
  | "rotted-decking"
  | "aged-components"
  | "heat-blister"
  | "nail-pop";

export interface StormPhoto {
  src: string;
  category: StormCategory;
  city: string;
  citySlug: string;
  alt: string;
}

const gafNS = { manufacturer: "GAF" as const, line: "Timberline Natural Shadow" };
const gafHDZ = { manufacturer: "GAF" as const, line: "Timberline HDZ" };
const oc = (line: string) => ({ manufacturer: "Owens Corning" as const, line });

function completed(
  src: string,
  city: string,
  citySlug: string,
  brand: { manufacturer: "GAF" | "Owens Corning"; line: string },
  color: string,
): ProjectPhoto {
  return {
    src: `/images/projects/${src}`,
    city,
    citySlug,
    kind: "completed",
    ...brand,
    color,
    alt: `${brand.manufacturer} ${brand.line} shingles in ${color} — roof completed by Southeast Roofing in ${city}, Mississippi.`,
  };
}

function inProgress(
  src: string,
  city: string,
  citySlug: string,
  stage: string,
): ProjectPhoto {
  return {
    src: `/images/projects/${src}`,
    city,
    citySlug,
    kind: "in-progress",
    stage,
    alt: `${stage} during a Southeast Roofing roof replacement in ${city}, Mississippi.`,
  };
}

/** Completed metal roof (no shingle manufacturer/line/color). */
function metalRoof(
  src: string,
  city: string,
  citySlug: string,
  alt: string,
): ProjectPhoto {
  return {
    src: `/images/projects/${src}`,
    city,
    citySlug,
    kind: "completed",
    material: "metal",
    alt,
  };
}

export const projectPhotos: ProjectPhoto[] = [
  // Hattiesburg
  completed("gaf-timberline-natural-shadow-slate-hattiesburg-ms-001.webp", "Hattiesburg", "hattiesburg", gafNS, "Slate"),
  completed("gaf-timberline-natural-shadow-slate-hattiesburg-ms-002.webp", "Hattiesburg", "hattiesburg", gafNS, "Slate"),
  completed("gaf-timberline-natural-shadow-slate-hattiesburg-ms-003.webp", "Hattiesburg", "hattiesburg", gafNS, "Slate"),
  completed("owens-corning-duration-driftwood-hattiesburg-ms.webp", "Hattiesburg", "hattiesburg", oc("Duration"), "Driftwood"),
  // Purvis
  completed("gaf-timberline-natural-shadow-slate-purvis-ms.webp", "Purvis", "purvis", gafNS, "Slate"),
  completed("gaf-timberline-natural-shadow-shakewood-purvis-ms-001.webp", "Purvis", "purvis", gafNS, "Shakewood"),
  completed("gaf-timberline-natural-shadow-shakewood-purvis-ms-002.webp", "Purvis", "purvis", gafNS, "Shakewood"),
  // Poplarville
  completed("gaf-timberline-hdz-hickory-poplarville-ms.webp", "Poplarville", "poplarville", gafHDZ, "Hickory"),
  completed("gaf-timberline-hdz-slate-poplarville-ms.webp", "Poplarville", "poplarville", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-pewter-gray-poplarville-ms.webp", "Poplarville", "poplarville", gafHDZ, "Pewter Gray"),
  // Gulfport
  completed("gaf-timberline-hdz-pewter-gray-gulfport-ms.webp", "Gulfport", "gulfport", gafHDZ, "Pewter Gray"),
  // Biloxi
  completed("gaf-timberline-natural-shadow-shakewood-biloxi-ms.jpg", "Biloxi", "biloxi", gafNS, "Shakewood"),
  completed("gaf-timberline-hdz-pewter-gray-biloxi-ms-001.jpg", "Biloxi", "biloxi", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-pewter-gray-biloxi-ms-002.jpg", "Biloxi", "biloxi", gafHDZ, "Pewter Gray"),
  // Ellisville
  completed("gaf-timberline-hdz-charcoal-ellisville-ms-001.webp", "Ellisville", "ellisville", gafHDZ, "Charcoal"),
  completed("gaf-timberline-hdz-charcoal-ellisville-ms-002.webp", "Ellisville", "ellisville", gafHDZ, "Charcoal"),
  completed("gaf-timberline-hdz-charcoal-ellisville-ms-003.webp", "Ellisville", "ellisville", gafHDZ, "Charcoal"),
  // Richton
  completed("gaf-timberline-hdz-barkwood-richton-ms.webp", "Richton", "richton", gafHDZ, "Barkwood"),
  // Saucier
  completed("gaf-timberline-hdz-birchwood-saucier-ms-001.jpg", "Saucier", "saucier", gafHDZ, "Birchwood"),
  completed("gaf-timberline-hdz-birchwood-saucier-ms-002.jpg", "Saucier", "saucier", gafHDZ, "Birchwood"),
  // Petal
  completed("gaf-timberline-hdz-slate-petal-ms.jpg", "Petal", "petal", gafHDZ, "Slate"),
  // Picayune
  completed("gaf-timberline-hdz-shakewood-picayune-ms.jpg", "Picayune", "picayune", gafHDZ, "Shakewood"),
  // Brooklyn
  completed("gaf-timberline-natural-shadow-hickory-brooklyn-ms.webp", "Brooklyn", "brooklyn", gafNS, "Hickory"),
  // Prentiss
  completed("owens-corning-supreme-onyx-black-prentiss-ms.webp", "Prentiss", "prentiss", oc("Supreme"), "Onyx Black"),
  // Lucedale
  completed("owens-corning-supreme-driftwood-lucedale-ms.webp", "Lucedale", "lucedale", oc("Supreme"), "Driftwood"),
  // Wiggins
  completed("owens-corning-oakridge-driftwood-wiggins-ms.webp", "Wiggins", "wiggins", oc("Oakridge"), "Driftwood"),

  // ===== 2026-07-06 import: owner FB/Roofr job photos =====
  // Biloxi
  completed("gaf-timberline-hdz-barkwood-biloxi-ms.webp", "Biloxi", "biloxi", gafHDZ, "Barkwood"),
  completed("gaf-timberline-hdz-charcoal-biloxi-ms.webp", "Biloxi", "biloxi", gafHDZ, "Charcoal"),
  completed("gaf-timberline-hdz-shakewood-biloxi-ms-001.webp", "Biloxi", "biloxi", gafHDZ, "Shakewood"),
  completed("gaf-timberline-hdz-shakewood-biloxi-ms-002.webp", "Biloxi", "biloxi", gafHDZ, "Shakewood"),
  // Petal
  completed("gaf-timberline-hdz-slate-petal-ms-002.webp", "Petal", "petal", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-pewter-gray-petal-ms-001.webp", "Petal", "petal", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-pewter-gray-petal-ms-002.webp", "Petal", "petal", gafHDZ, "Pewter Gray"),
  // Laurel
  completed("gaf-timberline-hdz-slate-laurel-ms-001.webp", "Laurel", "laurel", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-slate-laurel-ms-002.webp", "Laurel", "laurel", gafHDZ, "Slate"),
  // Foxworth
  completed("gaf-timberline-hdz-hickory-foxworth-ms.webp", "Foxworth", "foxworth", gafHDZ, "Hickory"),
  // Lucedale
  completed("gaf-timberline-hdz-slate-lucedale-ms-001.webp", "Lucedale", "lucedale", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-slate-lucedale-ms-002.webp", "Lucedale", "lucedale", gafHDZ, "Slate"),
  // Meridian
  completed("gaf-timberline-hdz-pewter-gray-meridian-ms-001.webp", "Meridian", "meridian", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-pewter-gray-meridian-ms-002.webp", "Meridian", "meridian", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-slate-meridian-ms-001.webp", "Meridian", "meridian", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-slate-meridian-ms-002.webp", "Meridian", "meridian", gafHDZ, "Slate"),
  // Hattiesburg
  completed("gaf-timberline-hdz-pewter-gray-hattiesburg-ms-001.webp", "Hattiesburg", "hattiesburg", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-pewter-gray-hattiesburg-ms-002.webp", "Hattiesburg", "hattiesburg", gafHDZ, "Pewter Gray"),
  completed("gaf-timberline-hdz-slate-hattiesburg-ms-001.webp", "Hattiesburg", "hattiesburg", gafHDZ, "Slate"),
  completed("gaf-timberline-hdz-slate-hattiesburg-ms-002.webp", "Hattiesburg", "hattiesburg", gafHDZ, "Slate"),
  // Poplarville
  completed("gaf-timberline-hdz-weathered-wood-poplarville-ms-001.webp", "Poplarville", "poplarville", gafHDZ, "Weathered Wood"),
  completed("gaf-timberline-hdz-weathered-wood-poplarville-ms-002.webp", "Poplarville", "poplarville", gafHDZ, "Weathered Wood"),
  // Monticello
  completed("gaf-timberline-hdz-hickory-monticello-ms-001.webp", "Monticello", "monticello", gafHDZ, "Hickory"),
  completed("gaf-timberline-hdz-hickory-monticello-ms-002.webp", "Monticello", "monticello", gafHDZ, "Hickory"),
  // Waynesboro
  completed("owens-corning-duration-driftwood-waynesboro-ms-001.webp", "Waynesboro", "waynesboro", oc("Duration"), "Driftwood"),
  completed("owens-corning-duration-driftwood-waynesboro-ms-002.webp", "Waynesboro", "waynesboro", oc("Duration"), "Driftwood"),
  // Brookhaven
  completed("gaf-timberline-hdz-hickory-brookhaven-ms-001.webp", "Brookhaven", "brookhaven", gafHDZ, "Hickory"),
  completed("gaf-timberline-hdz-hickory-brookhaven-ms-002.webp", "Brookhaven", "brookhaven", gafHDZ, "Hickory"),
  // Gulfport
  completed("gaf-timberline-hdz-charcoal-gulfport-ms.webp", "Gulfport", "gulfport", gafHDZ, "Charcoal"),
  // Wiggins
  completed("gaf-timberline-hdz-hickory-wiggins-ms-001.webp", "Wiggins", "wiggins", gafHDZ, "Hickory"),
  completed("gaf-timberline-hdz-hickory-wiggins-ms-002.webp", "Wiggins", "wiggins", gafHDZ, "Hickory"),
  // Columbia
  completed("gaf-timberline-hdz-charcoal-columbia-ms.webp", "Columbia", "columbia", gafHDZ, "Charcoal"),
  // McComb — 29-gauge Galvalume exposed-fastener metal
  metalRoof("29-gauge-galvalume-metal-roof-mccomb-ms-001.webp", "McComb", "mccomb", "29-gauge Galvalume exposed-fastener metal roof installed by Southeast Roofing in McComb, Mississippi."),
  metalRoof("29-gauge-galvalume-metal-roof-mccomb-ms-002.webp", "McComb", "mccomb", "29-gauge Galvalume exposed-fastener metal roof installed by Southeast Roofing in McComb, Mississippi."),

  // During install
  inProgress("roof-tear-off-decking-brooklyn-ms.webp", "Brooklyn", "brooklyn", "Tear-off down to the decking"),
  inProgress("roof-felted-underlayment-poplarville-ms.webp", "Poplarville", "poplarville", "Deck felted and ready for shingles"),
  inProgress("roof-tear-off-decking-hattiesburg-ms.webp", "Hattiesburg", "hattiesburg", "Tear-off down to the decking"),
  inProgress("roof-felt-ice-water-shield-waynesboro-ms.webp", "Waynesboro", "waynesboro", "Felt down with ice & water shield at the perimeter"),
  inProgress("roof-tear-off-decking-poplarville-ms.webp", "Poplarville", "poplarville", "Tear-off down to the decking"),
  // 2026-07-06 import
  inProgress("roof-tear-off-decking-gulfport-ms.webp", "Gulfport", "gulfport", "Tear-off down to the decking"),
  inProgress("roof-synthetic-felt-gulfport-ms.webp", "Gulfport", "gulfport", "Synthetic felt going down over the deck"),
  inProgress("roof-shingle-install-hattiesburg-ms.webp", "Hattiesburg", "hattiesburg", "Nailing new shingles into place"),
  inProgress("roof-tear-off-decking-columbia-ms.webp", "Columbia", "columbia", "Tear-off down to the decking"),
  inProgress("roof-synthetic-underlayment-lucedale-ms.webp", "Lucedale", "lucedale", "Synthetic underlayment down over the deck"),
];

function storm(
  src: string,
  category: StormCategory,
  city: string,
  citySlug: string,
  detail: string,
): StormPhoto {
  return {
    src: `/images/storm/${src}`,
    category,
    city,
    citySlug,
    alt: `${detail} documented during a Southeast Roofing inspection in ${city}, Mississippi.`,
  };
}

export const stormPhotos: StormPhoto[] = [
  storm("granular-loss-shingles-hattiesburg-ms.webp", "granular-loss", "Hattiesburg", "hattiesburg", "Granular loss on aging shingles"),
  storm("wind-damage-missing-shingles-petal-ms.webp", "wind-damage", "Petal", "petal", "Missing shingles from wind damage"),
  storm("hail-damage-roof-purvis-ms.jpg", "hail-damage", "Purvis", "purvis", "Hail damage on a shingle roof"),
  storm("hail-damage-roof-biloxi-ms.webp", "hail-damage", "Biloxi", "biloxi", "Hail damage on a shingle roof"),
  storm("dry-rotted-pipe-boot-hattiesburg-ms.webp", "aged-components", "Hattiesburg", "hattiesburg", "Dry-rotted pipe boot"),
  storm("hail-damage-roof-tylertown-ms.webp", "hail-damage", "Tylertown", "tylertown", "Hail damage on a shingle roof"),
  storm("hail-damage-ridge-cap-purvis-ms.webp", "hail-damage", "Purvis", "purvis", "Hail damage on a ridge cap"),
  storm("hail-damage-roof-gulfport-ms.webp", "hail-damage", "Gulfport", "gulfport", "Hail damage on a shingle roof"),
  storm("hail-damage-ridge-cap-gulfport-ms.webp", "hail-damage", "Gulfport", "gulfport", "Hail damage on a ridge cap"),
  storm("rotted-decking-tear-off-hattiesburg-ms-001.webp", "rotted-decking", "Hattiesburg", "hattiesburg", "Rotted decking discovered after tear-off"),
  storm("rotted-decking-tear-off-hattiesburg-ms-002.jpeg", "rotted-decking", "Hattiesburg", "hattiesburg", "Rotted decking discovered after tear-off"),
  storm("rotted-decking-tear-off-hattiesburg-ms-003.jpeg", "rotted-decking", "Hattiesburg", "hattiesburg", "Rotted decking discovered after tear-off"),
  storm("hail-damage-box-vent-meridian-ms.webp", "hail-damage", "Meridian", "meridian", "Hail damage on a box vent"),
  storm("rotted-soffit-hattiesburg-ms.webp", "aged-components", "Hattiesburg", "hattiesburg", "Rotted-out soffit"),
  storm("wind-damage-missing-shingles-purvis-ms.webp", "wind-damage", "Purvis", "purvis", "Missing shingles from wind damage"),
  storm("wind-damage-missing-shingles-jackson-ms.png", "wind-damage", "Jackson", "jackson", "Missing shingles from wind damage"),
  storm("wind-damage-missing-shingles-poplarville-ms.webp", "wind-damage", "Poplarville", "poplarville", "Missing shingles from wind damage"),
  storm("wind-damage-missing-shingles-ellisville-ms.webp", "wind-damage", "Ellisville", "ellisville", "Missing shingles from wind damage"),
  storm("wind-damage-missing-shingles-hattiesburg-ms.webp", "wind-damage", "Hattiesburg", "hattiesburg", "Missing shingles from wind damage"),
  storm("wind-damage-missing-shingles-ocean-springs-ms.webp", "wind-damage", "Ocean Springs", "ocean-springs", "Missing shingles from wind damage"),
  storm("hail-damage-roof-richton-ms.webp", "hail-damage", "Richton", "richton", "Hail damage on a shingle roof"),
  storm("wind-damage-roof-columbia-ms.webp", "wind-damage", "Columbia", "columbia", "Wind damage on a shingle roof"),
  // ===== 2026-07-06 import =====
  storm("wind-damage-missing-shingles-picayune-ms.webp", "wind-damage", "Picayune", "picayune", "Missing shingles from wind damage"),
  storm("heat-blister-damage-shingles-sumrall-ms.webp", "heat-blister", "Sumrall", "sumrall", "Heat blistering across the shingle surface"),
  storm("wind-damage-exposed-decking-collins-ms.webp", "wind-damage", "Collins", "collins", "Wind damage exposing the roof decking"),
  storm("hail-damage-roof-hattiesburg-ms.webp", "hail-damage", "Hattiesburg", "hattiesburg", "Hail and wind damage on a shingle roof"),
  storm("wind-damage-missing-shingles-pascagoula-ms.webp", "wind-damage", "Pascagoula", "pascagoula", "Missing shingles from wind damage"),
  storm("wind-damage-shingles-diamondhead-ms.webp", "wind-damage", "Diamondhead", "diamondhead", "Wind-lifted shingles"),
  storm("nail-pop-damage-shingles-magee-ms.webp", "nail-pop", "Magee", "magee", "Nail pops backing out through the shingles"),
  storm("wind-damage-missing-shingles-meridian-ms.webp", "wind-damage", "Meridian", "meridian", "Missing shingles from wind damage"),
];

export const STORM_CATEGORY_LABELS: Record<StormCategory, string> = {
  "hail-damage": "Hail damage",
  "wind-damage": "Wind & missing shingles",
  "granular-loss": "Granular loss",
  "rotted-decking": "Rotted decking",
  "aged-components": "Aged components",
  "heat-blister": "Heat blistering",
  "nail-pop": "Nail pops",
};

/** Completed roofs only — what city pages may show as local proof. */
export function completedPhotosFor(citySlug: string): ProjectPhoto[] {
  return projectPhotos.filter(
    (photo) => photo.kind === "completed" && photo.citySlug === citySlug,
  );
}
