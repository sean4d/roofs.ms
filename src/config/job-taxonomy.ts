/**
 * Single source of truth for the /upload job-intake form. The form UI, the
 * save API, the SEO/caption generator, and the Sanity schema all read from
 * here so a new job type or sub-field is added in ONE place and flows
 * everywhere (form → gallery filters → per-photo SEO → social captions).
 *
 * "Max it out for every scenario" (owner directive 2026-07-07): every roofing
 * service Southeast Roofing offers has its own detail sub-section here.
 */

import { siteConfig } from "@/config/site";

/** A single conditional detail field shown once its parent job type is picked. */
export interface DetailField {
  /** Stable machine key (used in tags, SEO, storage). */
  key: string;
  label: string;
  /** select = one choice; multi = many; text = free entry. */
  kind: "select" | "multi" | "text";
  options?: string[];
  /** Whether this field also becomes a gallery filter tag. */
  filterable?: boolean;
  placeholder?: string;
}

export interface JobType {
  /** Slug used in tags/URLs, e.g. "shingle". */
  value: string;
  label: string;
  /** One-word noun for captions, e.g. "roof", "gutters". */
  noun: string;
  fields: DetailField[];
}

/** Photo groups every job collects. Order = install timeline. */
export const PHASES = [
  { key: "before", label: "Before install", blurb: "The starting condition" },
  { key: "progress", label: "Install in progress", blurb: "Crew mid-job" },
  { key: "after", label: "After install", blurb: "The finished result" },
] as const;

export type PhaseKey = (typeof PHASES)[number]["key"];

// Specific product LINES. These become the gallery's "product" filter chips.
const SHINGLE_LINES = [
  "GAF Timberline HDZ",
  "GAF Timberline Natural Shadow",
  "GAF Timberline UHDZ",
  "GAF Grand Sequoia",
  "Owens Corning Duration",
  "Owens Corning Oakridge",
  "Owens Corning Supreme",
  "Owens Corning TruDefinition Duration",
  "CertainTeed Landmark",
  "Atlas Pinnacle",
  "Other",
];

const METAL_PRODUCTS = [
  '29ga Gibraltar Rib',
  '26ga Gibraltar Rib',
  "Standing Seam",
  "5V Crimp",
  "Metal Shingle",
  "Corrugated",
  "Other",
];

const GUTTER_PRODUCTS = [
  'Seamless 6" Gutters',
  'Seamless 5" Gutters',
  "Half-round",
  "Box gutters",
];

/**
 * Every job type Southeast Roofing runs, each with its own detail fields.
 * `filterable: true` fields feed the project-gallery filter chips.
 */
export const JOB_TYPES: JobType[] = [
  {
    value: "shingle",
    label: "Shingle Roof",
    noun: "shingle roof",
    fields: [
      { key: "product", label: "Shingle line", kind: "select", options: SHINGLE_LINES, filterable: true },
      { key: "color", label: "Shingle color", kind: "text", filterable: true, placeholder: "e.g. Pewter Gray" },
    ],
  },
  {
    value: "metal",
    label: "Metal Roof",
    noun: "metal roof",
    fields: [
      { key: "product", label: "Metal product", kind: "select", options: METAL_PRODUCTS, filterable: true },
      { key: "color", label: "Metal color", kind: "text", filterable: true, placeholder: "e.g. Galvalume, Burnished Slate" },
    ],
  },
  {
    value: "storm-damage",
    label: "Storm Damage",
    noun: "storm-damaged roof",
    fields: [
      {
        key: "damage",
        label: "Type of storm damage",
        kind: "multi",
        options: ["Hail", "Wind", "Missing shingles", "Heat blister", "Nail pops", "Granular loss", "Tree / impact", "Flashing damage"],
        filterable: true,
      },
    ],
  },
  {
    value: "gutters",
    label: "Gutters",
    noun: "gutters",
    fields: [
      { key: "product", label: "Gutter type", kind: "select", options: GUTTER_PRODUCTS, filterable: true },
      { key: "material", label: "Material", kind: "select", options: ["Aluminum", "Copper", "Steel"] },
      { key: "color", label: "Color", kind: "text", filterable: true, placeholder: "e.g. White, Musket Brown" },
    ],
  },
  {
    value: "leaf-guard",
    label: "Leaf Guard",
    noun: "gutter guards",
    fields: [
      { key: "productType", label: "Guard type", kind: "select", options: ["Micro-mesh", "Mesh screen", "Reverse-curve", "Foam insert"], filterable: true },
      { key: "brand", label: "Brand (optional)", kind: "text", placeholder: "e.g. LeafGuard, Gutterglove" },
    ],
  },
  {
    value: "siding",
    label: "Siding",
    noun: "siding",
    fields: [
      { key: "productType", label: "Siding type", kind: "select", options: ["Vinyl", "Fiber Cement (Hardie)", "Metal", "Wood", "Board & Batten"], filterable: true },
      { key: "color", label: "Color", kind: "text", filterable: true },
    ],
  },
  {
    value: "tpo",
    label: "TPO (Flat/Commercial)",
    noun: "TPO roof",
    fields: [
      { key: "thickness", label: "Membrane thickness", kind: "select", options: ["45 mil", "60 mil", "80 mil"], filterable: true },
      { key: "color", label: "Membrane color", kind: "select", options: ["White", "Gray", "Tan"], filterable: true },
      { key: "attachment", label: "Attachment", kind: "select", options: ["Mechanically attached", "Fully adhered", "Ballasted"] },
    ],
  },
  {
    value: "rolled-roofing",
    label: "Rolled Roofing",
    noun: "rolled roof",
    fields: [
      { key: "productType", label: "Type", kind: "select", options: ["Mineral-surfaced (MSR)", "Modified bitumen", "Peel-and-stick"], filterable: true },
    ],
  },
  {
    value: "epdm",
    label: "EPDM (Rubber)",
    noun: "EPDM roof",
    fields: [
      { key: "thickness", label: "Membrane thickness", kind: "select", options: ["45 mil", "60 mil", "90 mil"], filterable: true },
      { key: "color", label: "Color", kind: "select", options: ["Black", "White"], filterable: true },
      { key: "attachment", label: "Attachment", kind: "select", options: ["Mechanically attached", "Fully adhered", "Ballasted"] },
    ],
  },
  {
    value: "pvc",
    label: "PVC (Flat/Commercial)",
    noun: "PVC roof",
    fields: [
      { key: "thickness", label: "Membrane thickness", kind: "select", options: ["50 mil", "60 mil", "80 mil"], filterable: true },
      { key: "color", label: "Membrane color", kind: "select", options: ["White", "Gray", "Tan"], filterable: true },
      { key: "attachment", label: "Attachment", kind: "select", options: ["Mechanically attached", "Fully adhered"] },
    ],
  },
];

/** Residential vs commercial, matches the existing `project.channel` field. */
export const CHANNELS = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
] as const;

/** Cities come from the launch service area so the form + city pages agree. */
export const CITY_OPTIONS: string[] = [
  ...siteConfig.serviceArea.map((c) => c.city),
  "Other (type below)",
];

export const JOB_TYPE_VALUES = JOB_TYPES.map((j) => j.value);

export function getJobType(value: string): JobType | undefined {
  return JOB_TYPES.find((j) => j.value === value);
}
