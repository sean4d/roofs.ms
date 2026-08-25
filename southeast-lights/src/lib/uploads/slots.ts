/**
 * Image slots, shared by the upload studio and the ingest script.
 *
 * One list so the picker in the browser can never offer a slot the ingest
 * script does not know about.
 */

export interface Slot {
  key: string;
  label: string;
  where: string;
  group: "Hero" | "Segments" | "Commercial" | "Services" | "Projects" | "Proof";
}

export const SLOTS: Slot[] = [
  {
    key: "holiday-hero-estate",
    label: "Holiday hero",
    where: "Homepage hero, Aug to Dec",
    group: "Hero",
  },
  {
    key: "permanent-hero",
    label: "Off-season hero",
    where: "Homepage hero, Jan to Jul",
    group: "Hero",
  },
  {
    key: "estate-wide",
    label: "Closing band",
    where: "Final CTA, services hub hero",
    group: "Hero",
  },

  {
    key: "hoa-entrance",
    label: "HOA tile",
    where: "HOA segment tile and vertical hero",
    group: "Segments",
  },
  {
    key: "retail-center",
    label: "Commercial tile",
    where: "Commercial segment tile and vertical",
    group: "Segments",
  },
  {
    key: "colonial-columns",
    label: "Residential tile",
    where: "Residential segment tile",
    group: "Segments",
  },

  {
    key: "church",
    label: "Churches",
    where: "Churches vertical",
    group: "Commercial",
  },
  {
    key: "country-club",
    label: "Country clubs",
    where: "Country clubs vertical",
    group: "Commercial",
  },
  {
    key: "golf-club",
    label: "Golf clubs",
    where: "Golf club content",
    group: "Commercial",
  },
  {
    key: "hotel-resort",
    label: "Hotels & resorts",
    where: "Hospitality vertical",
    group: "Commercial",
  },
  {
    key: "downtown-municipal",
    label: "Municipal",
    where: "Municipal vertical",
    group: "Commercial",
  },
  {
    key: "apartments",
    label: "Multifamily",
    where: "Apartments vertical",
    group: "Commercial",
  },
  {
    key: "office-building",
    label: "Office buildings",
    where: "Commercial buildings vertical",
    group: "Commercial",
  },

  {
    key: "live-oak-wrap",
    label: "Tree wrapping",
    where: "Tree wrapping service",
    group: "Services",
  },
  {
    key: "tree-shrub",
    label: "Trees & shrubs",
    where: "Landscape and shrub lighting",
    group: "Services",
  },
  {
    key: "landscape-lighting",
    label: "Landscape",
    where: "Landscape lighting service",
    group: "Services",
  },
  {
    key: "bistro-patio",
    label: "Bistro & patio",
    where: "Patio string lighting",
    group: "Services",
  },
  {
    key: "mardi-gras",
    label: "Mardi Gras",
    where: "Mardi Gras service",
    group: "Services",
  },
  {
    key: "wedding-event",
    label: "Weddings & events",
    where: "Event lighting service",
    group: "Services",
  },
  {
    key: "permanent-color",
    label: "Permanent in color",
    where: "Permanent lighting, color scene",
    group: "Services",
  },

  // Gallery work. Named project-<project slug> so the file says which job it
  // belongs to, and so the authenticity rule in config/projects.ts stays easy
  // to hold: anything in this group is a real completed display.
  {
    key: "project-poplarville-colonial",
    label: "Poplarville colonial",
    where: "Gallery project, Poplarville",
    group: "Projects",
  },
  {
    key: "project-hattiesburg-ridges-hips",
    label: "Hattiesburg ridges and hips",
    where: "Gallery project, Hattiesburg",
    group: "Projects",
  },
  {
    key: "project-hattiesburg-palms",
    label: "Hattiesburg wrapped palms",
    where: "Gallery project, Hattiesburg",
    group: "Projects",
  },
  {
    key: "project-poplarville-blue-white",
    label: "Poplarville blue and white",
    where: "Gallery project, Poplarville",
    group: "Projects",
  },

  {
    key: "installer-roof",
    label: "Installer on roof",
    where: "Why a roofing company section",
    group: "Proof",
  },
  {
    key: "crew-boom-lift",
    label: "Crew on a lift",
    where: "About hero, commercial proof",
    group: "Proof",
  },
  {
    key: "components-flatlay",
    label: "Components flat-lay",
    where: "What's included, holiday page",
    group: "Proof",
  },
  {
    key: "storage-warehouse",
    label: "Labeled storage",
    where: "Storage and organization",
    group: "Proof",
  },
  { key: "c9-detail", label: "C9 close-up", where: "FAQ hero", group: "Proof" },
];

export const SLOT_KEYS = SLOTS.map((s) => s.key);

export const GROUPS = [
  "Hero",
  "Segments",
  "Commercial",
  "Services",
  "Projects",
  "Proof",
] as const;
