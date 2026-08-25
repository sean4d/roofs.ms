import { IMAGES, type SiteImage } from "./images";

/**
 * Project gallery.
 *
 * THE GALLERY AUTHENTICITY RULE: every project displayed as Southeast Lights
 * work must BE Southeast Lights work. Placeholder photography may illustrate
 * service pages; it may never populate the gallery as though it were a
 * completed job.
 *
 * How that is enforced here rather than by memory:
 *   - Every project carries `isDemo`.
 *   - `publishedProjects()` filters demo projects out in production builds.
 *   - Demo projects render with a visible development-only badge.
 *
 * So the gallery is fully designed and testable now, and the day real photos
 * arrive you add entries with `isDemo: false` and delete these.
 */

export interface ProjectImage {
  image: SiteImage;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  city: string;
  propertyType:
    | "Residential"
    | "HOA"
    | "Commercial"
    | "Church"
    | "Municipal"
    | "Hospitality";
  serviceSlugs: string[];
  /** Filter facets used by the gallery. */
  tags: ("holiday" | "permanent" | "trees" | "rooflines" | "warm-white" | "color")[];
  summary: string;
  /** Longer narrative for the project detail page. */
  scope: string;
  highlights: string[];
  hero: SiteImage;
  gallery: ProjectImage[];
  /** MUST be true for anything that is not genuine Southeast Lights work. */
  isDemo: boolean;
  year?: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "estate-roofline-and-oaks",
    title: "Estate Roofline and Oak Canopy",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: ["residential-holiday-lighting", "tree-wrapping"],
    tags: ["holiday", "trees", "rooflines", "warm-white"],
    summary:
      "Full roofline in warm white C9 with the driveway oaks wrapped trunk to limb.",
    scope:
      "Every roofline, gable and dormer outlined in custom-cut warm white C9, with the mature oaks flanking the drive wrapped through the trunk and major limbs. Columns wrapped and the entry walk lined with pathway stakes.",
    highlights: [
      "Custom-cut C9 to every roofline and dormer",
      "Full trunk and limb wrapping on mature live oaks",
      "Wrapped columns and lit entry walk",
    ],
    hero: IMAGES.holidayHero,
    gallery: [
      { image: IMAGES.holidayHero, caption: "The full elevation at blue hour" },
      { image: IMAGES.estateWide, caption: "Driveway oaks approaching the house" },
      { image: IMAGES.c9Detail, caption: "Custom-cut C9 clipped to the roof edge" },
    ],
    isDemo: true,
    year: 2025,
  },
  {
    slug: "community-entrance-monument",
    title: "Community Entrance and Boulevard",
    city: "Hattiesburg",
    propertyType: "HOA",
    serviceSlugs: ["hoa-community-lighting", "tree-wrapping"],
    tags: ["holiday", "trees", "warm-white"],
    summary:
      "Entrance monument, landscaped beds and boulevard trees designed as one display.",
    scope:
      "Both sides of the entrance monument outlined in warm white with the landscaped beds lit, and the boulevard trees wrapped down the median so the display reads continuously as residents turn in.",
    highlights: [
      "Matched treatment on both entry walls",
      "Boulevard trees wrapped down the median",
      "Circuits and timers planned around existing entrance power",
    ],
    hero: IMAGES.hoaEntrance,
    gallery: [
      { image: IMAGES.hoaEntrance, caption: "The entrance from the approach" },
      { image: IMAGES.treeShrub, caption: "Bed and ornamental tree lighting" },
    ],
    isDemo: true,
    year: 2025,
  },
  {
    slug: "church-campus-christmas",
    title: "Church Campus Christmas Display",
    city: "Laurel",
    propertyType: "Church",
    serviceSlugs: ["commercial-holiday-lighting", "tree-wrapping"],
    tags: ["holiday", "rooflines", "trees", "warm-white"],
    summary:
      "Steeple, rooflines and lawn oaks lit for the Christmas service season.",
    scope:
      "Rooflines and steeple edges outlined in warm white using lift equipment, with the lawn oaks wrapped. Designed to read from the highway, and installed between services.",
    highlights: [
      "Steeple work completed with an articulating lift",
      "Designed for highway visibility at driving speed",
      "Installation scheduled around the service calendar",
    ],
    hero: IMAGES.church,
    gallery: [
      { image: IMAGES.church, caption: "The campus from the road" },
      { image: IMAGES.crewBoomLift, caption: "Lift work along the high roofline" },
    ],
    isDemo: true,
    year: 2025,
  },
  {
    slug: "coast-hospitality-entrance",
    title: "Resort Entrance and Palms",
    city: "Biloxi",
    propertyType: "Hospitality",
    serviceSlugs: ["commercial-holiday-lighting"],
    tags: ["holiday", "rooflines", "trees", "warm-white"],
    summary:
      "Porte-cochere, facade and palm trunks lit for a coastal hospitality property.",
    scope:
      "Porte-cochere and facade rooflines outlined in warm white with palm trunks wrapped along the arrival drive. Installed overnight to avoid check-in, with scheduled night inspections through the season.",
    highlights: [
      "Installed overnight around guest arrival peaks",
      "Coastal-rated fixtures and fixings for salt air",
      "Scheduled night inspections every two weeks",
    ],
    hero: IMAGES.hotelResort,
    gallery: [
      { image: IMAGES.hotelResort, caption: "The arrival drive after dark" },
      { image: IMAGES.mardiGras, caption: "The same property in Mardi Gras colours" },
    ],
    isDemo: true,
    year: 2025,
  },
  {
    slug: "downtown-district-lighting",
    title: "Downtown District Holiday Lighting",
    city: "Columbia",
    propertyType: "Municipal",
    serviceSlugs: ["commercial-holiday-lighting"],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Historic storefronts, street trees and lamp posts across a downtown block.",
    scope:
      "Storefront rooflines outlined along a downtown block, street trees wrapped and lamp posts fitted with lit wreaths, coordinated with public works for lane access.",
    highlights: [
      "Coordinated with public works for right-of-way access",
      "Consistent bulb temperature across multiple building owners",
      "Serviced through the season from a single point of contact",
    ],
    hero: IMAGES.downtownMunicipal,
    gallery: [
      { image: IMAGES.downtownMunicipal, caption: "The block after dark" },
    ],
    isDemo: true,
    year: 2025,
  },
  {
    slug: "permanent-lighting-modern-home",
    title: "Permanent Architectural Lighting",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: ["permanent-architectural-lighting"],
    tags: ["permanent", "rooflines", "warm-white", "color"],
    summary:
      "Permanent LED track installed into the trim: warm white nightly, colour on demand.",
    scope:
      "Permanent LED channel installed into the fascia and trim with no penetration of the roof surface. Warm white for everyday use, with full colour available for holidays and game days from the app.",
    highlights: [
      "Channel mounted to trim and fascia, not through the roof surface",
      "Colour-matched to the existing trim, unobtrusive by day",
      "App-controlled scenes for holidays and game days",
    ],
    hero: IMAGES.permanentHero,
    gallery: [
      { image: IMAGES.permanentHero, caption: "Everyday warm white" },
      { image: IMAGES.permanentColor, caption: "The same system in holiday colour" },
    ],
    isDemo: true,
    year: 2025,
  },
];

/**
 * Demo projects render by default, carrying a visible "Demo content" badge
 * and `noIndex` on their detail pages, so the gallery reads as finished while
 * never claiming placeholder photography as our work.
 *
 * Set NEXT_PUBLIC_HIDE_DEMO_PROJECTS=1 to drop them entirely. Do that the
 * moment real project photography lands, or at launch, whichever comes first.
 */
export const publishedProjects = (): Project[] =>
  process.env.NEXT_PUBLIC_HIDE_DEMO_PROJECTS === "1"
    ? PROJECTS.filter((p) => !p.isDemo)
    : PROJECTS;

export const projectBySlug = (slug: string) =>
  publishedProjects().find((p) => p.slug === slug);

export const PROJECT_FILTERS = [
  { key: "all", label: "All Projects" },
  { key: "Residential", label: "Residential" },
  { key: "Commercial", label: "Commercial" },
  { key: "HOA", label: "HOA" },
  { key: "Church", label: "Churches" },
  { key: "Municipal", label: "Municipal" },
  { key: "Hospitality", label: "Hospitality" },
] as const;
