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

const SHINGLE_BRANDS = [
  "GAF",
  "Owens Corning",
  "CertainTeed",
  "Atlas",
  "Malarkey",
  "TAMKO",
  "IKO",
  "Other",
];

const METAL_BRANDS = [
  "McElroy Metal",
  "Central States",
  "ABC (American Building Components)",
  "Union Corrugating",
  "Fabral",
  "MBCI",
  "Other",
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
      { key: "brand", label: "Shingle brand", kind: "select", options: SHINGLE_BRANDS, filterable: true },
      {
        key: "productType",
        label: "Shingle type",
        kind: "select",
        options: ["Architectural / Dimensional", "3-Tab", "Designer / Luxury", "Impact-Resistant (Class 4)"],
        filterable: true,
      },
      { key: "color", label: "Shingle color", kind: "text", filterable: true, placeholder: "e.g. Pewter Gray" },
    ],
  },
  {
    value: "metal",
    label: "Metal Roof",
    noun: "metal roof",
    fields: [
      { key: "brand", label: "Metal brand", kind: "select", options: METAL_BRANDS, filterable: true },
      {
        key: "productType",
        label: "Metal type",
        kind: "select",
        options: ["Standing Seam", "Exposed Fastener (R-Panel)", "Metal Shingle", "Corrugated"],
        filterable: true,
      },
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
      { key: "productType", label: "Gutter style", kind: "select", options: ['Seamless 5" K-style', 'Seamless 6" K-style', "Half-round"], filterable: true },
      { key: "material", label: "Material", kind: "select", options: ["Aluminum", "Copper", "Steel"], filterable: true },
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

/** Residential vs commercial — matches the existing `project.channel` field. */
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
