import manifest from "./image-manifest.json";

/**
 * Every image on the site, in one place.
 *
 * MIXED SOURCES. Read this before using any file here in marketing claims.
 *
 * Slots listed in OWNER_SUPPLIED below are photographs the owner sent us.
 * Everything else is AI-generated placeholder photography chosen to match its
 * page subject so the site reads as finished during development. Placeholders
 * are NOT Southeast Lights work and must never be presented as such.
 *
 * To swap in real photography: drop a file into public/img with the SAME
 * base name, run `node scripts/optimize-images.mjs`, and set
 * `isPlaceholder: false`. Nothing else changes. Layouts, aspect ratios,
 * crops and scrims are already built around these dimensions.
 *
 * The gallery is stricter still: see config/projects.ts. Placeholder projects
 * are flagged as demo content and are excluded from production builds.
 */

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL: string;
  /** False once genuine Southeast Lights photography replaces the file. */
  isPlaceholder: boolean;
}

type ManifestEntry = { width: number; height: number; blurDataURL: string };
const meta = manifest as Record<string, ManifestEntry>;

/** Slots filled with owner-supplied photography rather than AI placeholders. */
const OWNER_SUPPLIED = new Set([
  "holiday-hero-estate",
  "hoa-entrance",
  "retail-center",
  "colonial-columns",
  "installer-roof",
  "project-poplarville-colonial",
  "project-hattiesburg-ridges-hips",
  "project-hattiesburg-palms",
  "project-poplarville-blue-white",
  "project-poplarville-red-green-white",
  "project-poplarville-outbuildings",
  "project-poplarville-apples",
  "project-poplarville-halloween",
]);

/**
 * Photography the owner confirmed is a Southeast Lights job, with the property
 * and the scope named. Only these may appear in the gallery: see the
 * authenticity rule in config/projects.ts.
 */
const CONFIRMED_OWN_WORK = new Set([
  "project-poplarville-colonial",
  "project-hattiesburg-ridges-hips",
  "project-hattiesburg-palms",
  "project-poplarville-blue-white",
  "project-poplarville-red-green-white",
  "project-poplarville-outbuildings",
  "project-poplarville-apples",
  "project-poplarville-halloween",
  "colonial-columns",
]);

export const isConfirmedOwnWork = (name: string) =>
  CONFIRMED_OWN_WORK.has(name);

function img(name: string, alt: string): SiteImage {
  const entry = meta[name];
  if (!entry) throw new Error(`Missing image in manifest: ${name}`);
  return {
    src: `/img/${name}.webp`,
    alt,
    width: entry.width,
    height: entry.height,
    blurDataURL: entry.blurDataURL,
    /*
     * NOTE: false here means "no longer an AI placeholder", not "verified
     * Southeast Lights work". Several owner-supplied files carry filenames
     * from third-party sources, so they remain temporary imagery on service
     * and segment surfaces. CONFIRMED_OWN_WORK above is the narrower set that
     * may populate the gallery.
     */
    isPlaceholder: !OWNER_SUPPLIED.has(name),
  };
}

/**
 * A slot that may not be filled yet. Returns null until the photo is
 * ingested, so a section can be written now and light up the moment the file
 * lands, with no code change and no broken build in between.
 */
export function optionalImage(name: string, alt: string): SiteImage | null {
  const entry = meta[name];
  if (!entry) return null;
  return {
    src: `/img/${name}.webp`,
    alt,
    width: entry.width,
    height: entry.height,
    blurDataURL: entry.blurDataURL,
    isPlaceholder: false,
  };
}

/** Photo of the actual hardware that goes into a display. Owner-supplied. */
export const COMPONENTS_FLATLAY = optionalImage(
  "components-flatlay",
  "Christmas light installation components laid out on pavers: roof and gutter clips, vampire plugs, sockets, adapters, zip ties, snips and a light-hanging pole",
);

export const IMAGES = {
  holidayHero: img(
    "holiday-hero-estate",
    "A large evergreen wrapped in multicolor Christmas lights at the center of a lit campus courtyard, with warm white bistro strings overhead and surrounding trees wrapped in white lights",
  ),
  estateWide: img(
    "estate-wide",
    "Luxury estate at night with the full roofline, dormers and a row of live oaks along the driveway wrapped in warm white lights",
  ),
  permanentHero: img(
    "permanent-hero",
    "Contemporary luxury home at night lit by permanent architectural LED lighting concealed beneath the roof eaves",
  ),
  hoaEntrance: img(
    "hoa-entrance",
    "Two mature trees with trunks and limbs fully wrapped in warm white lights beside a lit modern home at dusk",
  ),
  retailCenter: img(
    "retail-center",
    "A historic stone building covered in a curtain of warm white lights with an illuminated pink bow on the balcony",
  ),
  church: img(
    "church",
    "Red brick church with a white steeple outlined in warm white Christmas lights, oak trees on the lawn wrapped in lights",
  ),
  liveOakWrap: img(
    "live-oak-wrap",
    "Enormous Southern live oak with every major limb wrapped in warm white lights glowing against a night sky",
  ),
  crewBoomLift: img(
    "crew-boom-lift",
    "Installation crew using an articulating boom lift to hang commercial Christmas lighting along a high building parapet at dusk",
  ),
  installerRoof: img(
    "installer-roof",
    "An installer on a steep roof using yellow roof pads and a ladder hook to run a line of C9 bulbs along the gable",
  ),
  landscapeLighting: img(
    "landscape-lighting",
    "Warm white path lights along a flagstone walkway with dramatic uplighting on mature oak trunks",
  ),
  bistroPatio: img(
    "bistro-patio",
    "Restaurant courtyard patio strung overhead with warm filament bistro cafe lights",
  ),
  mardiGras: img(
    "mardi-gras",
    "Historic Gulf Coast building with wrought-iron balconies lit in purple, green and gold for Mardi Gras",
  ),
  weddingEvent: img(
    "wedding-event",
    "Outdoor wedding reception beneath a canopy of warm white string lights and hanging filament bulbs",
  ),
  countryClub: img(
    "country-club",
    "Country club clubhouse with white columns and porte-cochere outlined in warm white Christmas lights",
  ),
  golfClub: img(
    "golf-club",
    "Golf club stone entry monument and landscaped beds lit in warm white with uplit pines at twilight",
  ),
  hotelResort: img(
    "hotel-resort",
    "Luxury resort porte-cochere outlined in warm white Christmas lights with palm trunks wrapped in lights",
  ),
  downtownMunicipal: img(
    "downtown-municipal",
    "Historic downtown main street decorated for Christmas with lit storefronts, wrapped street trees and lamp post wreaths",
  ),
  apartments: img(
    "apartments",
    "Modern apartment community clubhouse and entrance with rooflines outlined in warm white lights",
  ),
  officeBuilding: img(
    "office-building",
    "Modern commercial office building with roofline and entry canopy outlined in crisp warm white lighting",
  ),
  colonialColumns: img(
    "colonial-columns",
    "Two-story colonial home at dusk with warm white C9 bulbs along every roof edge and both entry columns wrapped base to capital",
  ),
  projectPoplarvilleHalloween: img(
    "project-poplarville-halloween",
    "Southeast Lights Halloween display in Poplarville: a bungalow at night with orange and purple C9 bulbs along the roofline, ridges and gable rakes, above a porch decorated for Halloween",
  ),
  projectPoplarvilleApples: img(
    "project-poplarville-apples",
    "Southeast Lights display in Poplarville: the Apples Ltd. storefront at night with purple C9 bulbs along the upper roofline and warm white C9 along the porch fascia below, lit shop windows between them",
  ),
  projectPoplarvilleOutbuildings: img(
    "project-poplarville-outbuildings",
    "Southeast Lights display in Poplarville: a cottage at night with red, green and white C9 carried around the roofline, up the gable rakes and along the ridges, with the attached carport and a small side building lit in the same pattern",
  ),
  projectPoplarvilleRedGreenWhite: img(
    "project-poplarville-red-green-white",
    "Southeast Lights display in Poplarville: a brick farmhouse at night with a repeating red, green and white C9 pattern across the porch roof, both wing rooflines and the gable rakes, and every porch column wrapped in the same sequence",
  ),
  projectPoplarvilleBlueWhite: img(
    "project-poplarville-blue-white",
    "Southeast Lights display in Poplarville: a white craftsman home at night with alternating blue and bright white C9 bulbs along the roofline, gables and hips, and the porch columns wrapped in the same pattern",
  ),
  projectHattiesburgRidgesHips: img(
    "project-hattiesburg-ridges-hips",
    "Southeast Lights display in Hattiesburg: a brick home at night with alternating red and warm white C9 bulbs running the full roofline and continuing up every ridge and hip, and a lit Christmas tree visible through the front window",
  ),
  projectHattiesburgPalms: img(
    "project-hattiesburg-palms",
    "Four palm trunks wrapped in alternating bands of red and white lights against a clipped hedge at night",
  ),
  projectPoplarvilleColonial: img(
    "project-poplarville-colonial",
    "Southeast Lights display in Poplarville: a two-story colonial at dusk with warm white C9 along the main roofline, both wings and the center gable, and twenty-foot entry columns wrapped from base to capital",
  ),
  c9Detail: img(
    "c9-detail",
    "Close-up of commercial-grade C9 bulbs clipped along a roof edge, warm filaments glowing",
  ),
  permanentColor: img(
    "permanent-color",
    "Modern home facade showing permanent LED lighting displaying festive red and green along the roof eaves",
  ),
  storageWarehouse: img(
    "storage-warehouse",
    "Organized warehouse shelving with labeled bins and neatly coiled light strands ready for next season",
  ),
  treeShrub: img(
    "tree-shrub",
    "Ornamental trees and shrub beds wrapped and net-lit in warm white with a pathway lined by stake lights",
  ),
} as const;

export type ImageKey = keyof typeof IMAGES;
