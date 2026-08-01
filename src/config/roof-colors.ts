/**
 * Data-driven config for the Roof Color Visualizer. EDIT HERE to add products
 * or colors. Hexes are close approximations for the swatches.
 *
 * Photo priority (see visualizer.tsx). The visualizer shows, in order:
 *   1. a REAL Southeast Roofing job photo of that product + color (matched
 *      from content/photos.ts, or a live Sanity upload), badged "Real job";
 *   2. otherwise a manufacturer product `sample` photo, if one is set below,
 *      badged "Product sample" (an honest placeholder);
 *   3. otherwise the flat hex swatch.
 *
 * This makes the placeholders self-retiring: the moment we install and log a
 * roof in that color (static file or form/Sanity upload), the real roof
 * automatically replaces the product sample, no code change needed. Color
 * names here must match the color names in content/photos.ts exactly.
 */

export interface ColorSample {
  src: string;
  alt: string;
  /** Short caption / browser title for the placeholder image. */
  title: string;
}

export interface RoofColor {
  name: string;
  hex: string;
  /** Temporary manufacturer product photo shown until a real job photo exists. */
  sample?: ColorSample;
}

export interface RoofProduct {
  key: string;
  label: string;
  material: "shingle" | "metal";
  /** For cross-referencing real project photos (shingles). */
  manufacturer?: "GAF" | "Owens Corning";
  line?: string;
  colors: RoofColor[];
}

const VS = "/images/visualizer-samples";

/** Placeholder sample for a shingle product + color. */
function shingleSample(product: string, color: string, file: string): ColorSample {
  return {
    src: `${VS}/${file}`,
    alt: `${product} architectural shingles in ${color}, manufacturer color sample shown until Southeast Roofing installs this color locally.`,
    title: `${product}: ${color} (sample)`,
  };
}

export const ROOF_PRODUCTS: RoofProduct[] = [
  {
    key: "gaf-hdz",
    label: "GAF Timberline HDZ",
    material: "shingle",
    manufacturer: "GAF",
    line: "Timberline HDZ",
    colors: [
      { name: "Pewter Gray", hex: "#71767b" },
      { name: "Oyster Gray", hex: "#a1a4a0" },
      { name: "Charcoal", hex: "#35383b" },
      { name: "Slate", hex: "#565c62" },
      { name: "Barkwood", hex: "#574636" },
      { name: "Hickory", hex: "#7c6a51" },
      { name: "Birchwood", hex: "#9f8e76" },
      { name: "Shakewood", hex: "#8f7a5e" },
      { name: "Weathered Wood", hex: "#6c665b" },
    ],
  },
  {
    key: "gaf-ns",
    label: "GAF Timberline Natural Shadow",
    material: "shingle",
    manufacturer: "GAF",
    line: "Timberline Natural Shadow",
    colors: [
      { name: "Slate", hex: "#565c62" },
      { name: "Shakewood", hex: "#8f7a5e" },
      { name: "Hickory", hex: "#7c6a51" },
    ],
  },
  {
    key: "oc-duration",
    label: "Owens Corning Duration",
    material: "shingle",
    manufacturer: "Owens Corning",
    line: "Duration",
    colors: [
      { name: "Driftwood", hex: "#8a7d6b" },
      {
        name: "Onyx Black",
        hex: "#1c1c1e",
        sample: shingleSample("Owens Corning Duration", "Onyx Black", "owens-corning-duration-onyx-black-shingle-sample.webp"),
      },
      {
        name: "Estate Gray",
        hex: "#595d61",
        sample: shingleSample("Owens Corning Duration", "Estate Gray", "owens-corning-duration-estate-gray-shingle-sample.webp"),
      },
    ],
  },
  {
    key: "oc-oakridge",
    label: "Owens Corning Oakridge",
    material: "shingle",
    manufacturer: "Owens Corning",
    line: "Oakridge",
    colors: [
      { name: "Driftwood", hex: "#8a7d6b" },
      {
        name: "Onyx Black",
        hex: "#1c1c1e",
        sample: shingleSample("Owens Corning Oakridge", "Onyx Black", "owens-corning-oakridge-onyx-black-shingle-sample.webp"),
      },
      {
        name: "Estate Gray",
        hex: "#595d61",
        sample: shingleSample("Owens Corning Oakridge", "Estate Gray", "owens-corning-oakridge-estate-gray-shingle-sample.webp"),
      },
    ],
  },
  {
    key: "oc-supreme",
    label: "Owens Corning Supreme",
    material: "shingle",
    manufacturer: "Owens Corning",
    line: "Supreme",
    colors: [
      { name: "Onyx Black", hex: "#1c1c1e" },
      { name: "Driftwood", hex: "#8a7d6b" },
      {
        name: "Estate Gray",
        hex: "#595d61",
        sample: shingleSample("Owens Corning Supreme", "Estate Gray", "owens-corning-supreme-estate-gray-shingle-sample.webp"),
      },
    ],
  },
  {
    key: "metal",
    label: "Metal Roofing",
    material: "metal",
    colors: [
      { name: "Galvalume", hex: "#c2c6ca" },
      {
        name: "Black",
        hex: "#2b2d30",
        sample: {
          src: `${VS}/metal-roof-black-panel-sample.webp`,
          alt: "Black metal roofing panel, manufacturer color sample shown until Southeast Roofing installs this finish locally.",
          title: "Metal Roofing: Black (sample)",
        },
      },
      { name: "Burgundy", hex: "#6b2a35" },
      {
        name: "Gray",
        hex: "#8b9095",
        sample: {
          src: `${VS}/metal-roof-gray-panel-sample.webp`,
          alt: "Gray metal roofing panel, manufacturer color sample shown until Southeast Roofing installs this finish locally.",
          title: "Metal Roofing: Gray (sample)",
        },
      },
    ],
  },
];
