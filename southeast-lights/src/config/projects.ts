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
  tags: (
    "holiday" | "permanent" | "trees" | "rooflines" | "warm-white" | "color"
  )[];
  summary: string;
  /** Longer narrative for the project detail page. */
  scope: string;
  highlights: string[];
  hero: SiteImage;
  /**
   * object-position for the detail hero, when the default is wrong.
   *
   * The hero is a wide band and most of these photographs are 4:3, so a lot
   * of the frame is cropped away. The default sits high because a straight-on
   * elevation puts the roofline in the upper half and lawn in the lower. A
   * photograph taken at an angle, or from further back, puts its subject
   * somewhere else and needs to say so.
   */
  heroFocus?: string;
  gallery: ProjectImage[];
  /** MUST be true for anything that is not genuine Southeast Lights work. */
  isDemo: boolean;
  year?: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "poplarville-halloween-roofline",
    title: "Halloween in Purple and Orange",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: ["halloween-lighting", "residential-holiday-lighting"],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Orange and purple across the roofline, ridges and gable rakes, weeks before the Christmas display went up.",
    scope:
      "Orange and purple cut to the roofline, then carried up the ridges and both gable rakes so the whole roof holds its shape rather than reading as one line across the front. Same commercial-grade bulbs and the same roof-trained crew as a Christmas install. What changes is the color and the month.",
    highlights: [
      "Orange and purple across the full roofline",
      "Ridges and gable rakes lit, not only the eaves",
      "Same crews and equipment as the Christmas work",
    ],
    hero: IMAGES.projectPoplarvilleHalloween,
    heroFocus: "center 45%",
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-apples-storefront",
    title: "Apples Ltd. Storefront",
    city: "Poplarville",
    propertyType: "Commercial",
    serviceSlugs: [
      "commercial-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Two colors on two roof planes: purple along the upper roofline, warm white down the porch fascia at window height.",
    scope:
      "A storefront has a different job than a house. It has to separate itself from the buildings either side of it and read from a car moving down the street, not from a driveway. Two colors on two planes does that: purple along the upper roofline lifts the whole building off a dark block, and warm white along the porch fascia holds the eye at the height where the windows and the door are. Custom cut to both runs, maintained through the season, then removed and stored.",
    highlights: [
      "Two colors on two roof planes, so the building separates from the block",
      "Warm white held at window height, where the merchandise is",
      "Cut, installed, maintained and removed as one seasonal service",
    ],
    hero: IMAGES.projectPoplarvilleApples,
    // The building sits in the middle band, street below and night sky above.
    heroFocus: "center 50%",
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-outbuildings",
    title: "Roofline, Ridges and Every Outbuilding",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Red, green and white carried around the house, up the ridges and gable rakes, and onto the carport and the side building.",
    scope:
      "Red, green and white run around the roofline rather than across the front of it, so the display holds together from the driveway as well as from the road. Ridges and gable rakes are lit along with the eaves, which is what gives a roof its shape after dark instead of a flat outline. The carport and the small building beside the house carry the same pattern. A property reads as finished when the smaller structures are lit too, and half done when the house is lit and everything around it stays dark.",
    highlights: [
      "Roofline carried around the house, not only across the front",
      "Ridges and gable rakes lit along with the eaves",
      "Carport and side building in the same pattern",
    ],
    hero: IMAGES.projectPoplarvilleOutbuildings,
    // Shot from the driveway rather than the street, so the house sits low in
    // the frame with treeline above it.
    heroFocus: "center 62%",
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-red-green-white",
    title: "Red, Green and White with Wrapped Columns",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "The traditional three colors run as a repeating pattern across the roofline and gable rakes, with every porch column wrapped to match.",
    scope:
      "Red, green and white in a repeating sequence, carried across the porch roof, both wing rooflines and up the gable rakes to the peak, so the pattern reads as one continuous run rather than restarting at every break. Every porch column is wrapped in the same sequence. That is what makes a deep front porch work after dark: leave the verticals unlit and the porch roof becomes a dark band across the middle of the house.",
    highlights: [
      "Repeating red, green and white through every run",
      "Gable rakes carried to the peak",
      "Every porch column wrapped in the same sequence",
    ],
    hero: IMAGES.projectPoplarvilleRedGreenWhite,
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-blue-and-white",
    title: "Blue and Bright White Roofline",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Alternating blue and bright white C9 across the roofline, hips and ridges, with the porch columns wrapped to match.",
    scope:
      "Alternating blue and bright white C9, run across the roofline and carried down every hip and ridge rather than stopping at the front edge. The porch columns are wrapped in the same alternating pattern so the entry reads as part of the roof instead of a separate idea. Cool colors do something warm white cannot on a white house: they hold their edge against the siding at night instead of washing into it.",
    highlights: [
      "Alternating blue and bright white through the entire run",
      "Roofline carried across the hips and ridges",
      "Porch columns wrapped in the same alternating pattern",
    ],
    hero: IMAGES.projectPoplarvilleBlueWhite,
    gallery: [],
    isDemo: false,
  },
  {
    slug: "hattiesburg-ridges-and-hips",
    title: "Full Roofline, Ridges and Hips",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
      "tree-wrapping",
    ],
    tags: ["holiday", "rooflines", "color", "trees"],
    summary:
      "Alternating red and white C9 taken past the roof edge and up every ridge and hip, with the palm trunks wrapped to match.",
    scope:
      "Most roofline work stops at the front edge. Here the C9 continues up every ridge and every hip, so the roof reads as a complete outline from the street rather than one line across the front. Alternating red and white through the entire run, with the palm trunks on the property wrapped in the same two colors so the yard and the house read as one display instead of two.",
    highlights: [
      "Every ridge and hip lit, not only the roof edge",
      "Alternating red and white C9 across the full run",
      "Palm trunks wrapped to match the roofline",
    ],
    hero: IMAGES.projectHattiesburgRidgesHips,
    gallery: [
      {
        image: IMAGES.projectHattiesburgPalms,
        caption: "Palm trunks wrapped in the same red and white",
      },
    ],
    isDemo: false,
  },
  {
    slug: "poplarville-colonial-columns",
    title: "Colonial Roofline and Twenty-Foot Columns",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white C9 across the full front elevation, with both twenty-foot entry columns wrapped base to capital.",
    scope:
      "Warm white C9 custom cut on site to the full front elevation: the main roofline, both lower wings and the center gable over the entry. The portico columns stand twenty feet, wrapped continuously from base to capital so the entry carries the display at the center rather than the roofline doing all the work.",
    highlights: [
      "Full front elevation in warm white C9, cut to length on site",
      "Both twenty-foot entry columns wrapped base to capital",
      "Continuous roof edge across the main span and both wings",
    ],
    hero: IMAGES.projectPoplarvilleColonial,
    // One photo so far. The detail page hides the gallery band rather than
    // repeating the hero under a heading that promises more.
    gallery: [],
    isDemo: false,
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
      {
        image: IMAGES.crewBoomLift,
        caption: "Lift work along the high roofline",
      },
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
      {
        image: IMAGES.mardiGras,
        caption: "The same property in Mardi Gras colors",
      },
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
      "Permanent LED track installed into the trim: warm white nightly, color on demand.",
    scope:
      "Permanent LED channel installed into the fascia and trim with no penetration of the roof surface. Warm white for everyday use, with full color available for holidays and game days from the app.",
    highlights: [
      "Channel mounted to trim and fascia, not through the roof surface",
      "Color-matched to the existing trim, unobtrusive by day",
      "App-controlled scenes for holidays and game days",
    ],
    hero: IMAGES.permanentHero,
    gallery: [
      { image: IMAGES.permanentHero, caption: "Everyday warm white" },
      {
        image: IMAGES.permanentColor,
        caption: "The same system in holiday color",
      },
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
