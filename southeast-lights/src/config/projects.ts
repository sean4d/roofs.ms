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
    | "School"
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
    slug: "hattiesburg-clean-line",
    title: "One Clean Line Across the Front",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white on the front eave and the entry gable. Nothing else, and nothing missing.",
    scope:
      "This is the display most people picture when they call: one line of warm white along the front eave, carried up over the entry gable and back down, and that is the job. It is also the least forgiving one to install. There is nothing else on the house to pull the eye away from a line that sags between clips, a gap where the spacing drifted, or a run that stops a foot short of the corner. Cut on site so the spacing holds from one end of the roof to the other and the line finishes where the roof does.",
    highlights: [
      "Front eave and the entry gable, cut to length on site",
      "Even spacing corner to corner, with the run finishing at the edge",
      "The simplest display, and the one with nowhere to hide",
    ],
    hero: IMAGES.projectHattiesburgCleanLine,
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-continuous-run",
    title: "One Continuous Run, House to Garage",
    city: "Poplarville",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white carried in one unbroken line from the far corner of the house, over the porch gable and out onto the detached garage.",
    scope:
      "The run starts at the far corner of the house and does not stop until it reaches the end of the detached garage: along the main eave, up and over the porch gable, back down, and straight on to the outbuilding. Holding the line unbroken is the whole idea on a frontage like this. Break it at each structure and you get three small displays sitting near each other. Keep it continuous and the property reads as one place from the road.",
    highlights: [
      "One unbroken run from the house through to the detached garage",
      "Porch gable rake carried to the peak rather than skipped",
      "Warm white throughout, cut to each run",
    ],
    hero: IMAGES.projectPoplarvilleContinuousRun,
    gallery: [],
    isDemo: false,
  },
  {
    slug: "poplarville-pearsons-barber-shop",
    title: "Pearson's Barber Shop",
    city: "Poplarville",
    propertyType: "Commercial",
    serviceSlugs: [
      "commercial-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Red, green and white on all three roof planes of a two-story Main Street building, so the whole frontage reads as one property.",
    scope:
      "Buildings on a street like this one grew in pieces: a two-story front, a porch awning run across it, and a one-story wing added on the end. Light only the top and the additions drop into the dark. Light only the awning and the building loses its height. All three planes are lit here in the same repeating red, green and white, so the frontage reads as one property from the street instead of three buildings that happen to touch. The upper run sits two stories up and directly over a public sidewalk.",
    highlights: [
      "All three roof planes lit, upper gable to the wing",
      "One repeating pattern so the frontage reads as a single building",
      "Two-story work directly above a public sidewalk",
    ],
    hero: IMAGES.projectPearsonsFront,
    gallery: [
      {
        image: IMAGES.projectPearsonsBlock,
        caption: "From across the street, where the customers see it",
      },
    ],
    isDemo: false,
  },
  {
    slug: "hattiesburg-low-wide-roof",
    title: "Ridges on a Low, Wide Roof",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white on the eaves and on every ridge of a hip roof, so a single-story house keeps its dimension from across a deep lawn.",
    scope:
      "A house like this is seen from a long way back, across an open lawn, and it has no height to give it presence. Light only the eaves and you get one flat horizontal line at that distance, which is the most common way a wide single-story house ends up looking smaller lit than it does dark. Every ridge of the hip roof is lit here as well as the eave line, so the roof steps back in layers and the house keeps its depth from the road. Warm white throughout.",
    highlights: [
      "Eave line plus every ridge of the hip roof",
      "Designed to hold up from across a deep front lawn",
      "Warm white throughout, cut to each run",
    ],
    hero: IMAGES.projectHattiesburgLowWide,
    gallery: [
      {
        image: IMAGES.projectHattiesburgLowWideAngle,
        caption: "From the drive, where the ridges step back",
      },
    ],
    isDemo: false,
  },
  {
    slug: "grace-community-school",
    title: "Grace Community School",
    city: "Hattiesburg",
    propertyType: "School",
    serviceSlugs: [
      "commercial-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "color"],
    summary:
      "Red, green and warm white on three gables and the full length of the covered entry walkway.",
    scope:
      "Every gable rake outlined and the covered walkway run end to end, so the campus reads as one building from the road instead of three roofs with a gap between them. Red, green and warm white in a repeating sequence, custom cut to each run. The walkway is the piece that matters most here: it is the height families actually see at drop-off and pickup, close enough to look at rather than glance at, and it is the part of the campus a car passes under twice a day.",
    highlights: [
      "All three gable rakes plus the full covered walkway",
      "Read from the road and from the drop-off line, not just the parking lot",
      "One fixed seasonal price, installed and removed by insured crews",
    ],
    hero: IMAGES.projectGcsFront,
    gallery: [
      {
        image: IMAGES.projectGcsWalkway,
        caption: "The covered walkway run, seen from the lot",
      },
      {
        image: IMAGES.projectGcsMural,
        caption: "The gable above the school mural",
      },
    ],
    isDemo: false,
  },
  {
    slug: "hattiesburg-wooded-lot",
    title: "A Complete Outline on a Wooded Lot",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: [
      "christmas-light-installation",
      "residential-holiday-lighting",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white on every eave, hip and ridge, so the roof keeps its shape under heavy tree cover.",
    scope:
      "On an open lot, one line across the front will read from the road. Under this much canopy it will not. The trees break the sightline, and a partial outline arrives as a handful of disconnected bright spots rather than a house. So every edge is lit here: eaves, both hip runs and the ridge. The roof holds its shape from whatever angle the drive gives you, which on a lot like this is the only angle anyone gets.",
    highlights: [
      "Every eave, hip and ridge lit, not a front line",
      "Designed for a lot where the tree line breaks up sightlines",
      "Warm white throughout, cut to each run",
    ],
    hero: IMAGES.projectHattiesburgCanopy,
    gallery: [],
    isDemo: false,
  },
  {
    slug: "hattiesburg-two-story-gallery",
    title: "A Roofline Twenty Feet Up",
    city: "Hattiesburg",
    propertyType: "Residential",
    serviceSlugs: [
      "residential-holiday-lighting",
      "christmas-light-installation",
    ],
    tags: ["holiday", "rooflines", "warm-white"],
    summary:
      "Warm white along a front roofline twenty feet up, above a second-story gallery, carried down onto the lower wing.",
    scope:
      "The front roofline here sits twenty feet up, above a second-story gallery, and the work happens over a porch roof rather than over lawn. That is the height where hanging your own lights stops being a Saturday and starts being the reason people call a roofing company. Warm white C9 cut to the front run and carried onto the lower wing so the two planes read as one line stepping down, and nothing else lit. A house with this much architecture does not need the display to compete with it.",
    highlights: [
      "Front roofline at twenty feet, above a second-story gallery",
      "Carried onto the lower wing so the two planes read as one",
      "Roofline only, on a house that does not need more",
    ],
    hero: IMAGES.projectHattiesburgTwoStory,
    heroFocus: "center 50%",
    gallery: [],
    isDemo: false,
  },
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
  { key: "School", label: "Schools" },
  { key: "HOA", label: "HOA" },
  { key: "Church", label: "Churches" },
  { key: "Municipal", label: "Municipal" },
  { key: "Hospitality", label: "Hospitality" },
] as const;
