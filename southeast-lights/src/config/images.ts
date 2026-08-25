import manifest from "./image-manifest.json";

/**
 * Every image on the site, in one place.
 *
 * TEMPORARY DEVELOPMENT IMAGERY. Everything here is AI-generated placeholder
 * photography chosen to match its page subject so the site reads as finished
 * during development. It is NOT Southeast Lights work and must never be
 * presented as such.
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

function img(name: string, alt: string): SiteImage {
  const entry = meta[name];
  if (!entry) throw new Error(`Missing image in manifest: ${name}`);
  return {
    src: `/img/${name}.webp`,
    alt,
    width: entry.width,
    height: entry.height,
    blurDataURL: entry.blurDataURL,
    isPlaceholder: true,
  };
}

export const IMAGES = {
  holidayHero: img(
    "holiday-hero-estate",
    "Large brick and stone estate home at dusk with every roofline outlined in warm white C9 Christmas lights and mature oak trees wrapped in lights",
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
    "Neighborhood entrance monument and boulevard trees outlined and wrapped in warm white holiday lighting",
  ),
  retailCenter: img(
    "retail-center",
    "Upscale open-air shopping center with warm white commercial Christmas lighting along every parapet and wrapped parking-island trees",
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
    "Installer in roofing traction boots clipping C9 lights along the edge of a steep shingle roof with a properly secured ladder",
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
    "Southern colonial home with spiral-wrapped porch columns, lit garland and warm white pathway stake lights",
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
