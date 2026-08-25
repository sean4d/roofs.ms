/**
 * Service areas.
 *
 * Deliberately a short list of markets we can genuinely serve, each with real
 * differentiated content. Twenty near-identical city pages for towns we do not
 * work in is the doorway-page pattern; it dilutes the pages that earn.
 *
 * Coverage logic, stated honestly:
 *   residential  roughly a one-hour radius of Hattiesburg
 *   commercial   roughly two hours, and statewide for larger projects
 */

export interface ServiceArea {
  slug: string;
  city: string;
  county: string;
  /** Drives copy and internal linking, not a hard rule. */
  tier: "home" | "core" | "coast" | "regional";
  /** Unique opening paragraph. Never templated. */
  intro: string;
  /** What actually distinguishes lighting work in this market. */
  localContext: string;
  /** Services worth emphasising here. Slugs from services.ts. */
  emphasis: string[];
  /** Neighbouring slugs for internal linking. */
  nearby: string[];
}

export const SERVICE_AREAS: ServiceArea[] = [
  {
    slug: "hattiesburg",
    city: "Hattiesburg",
    county: "Forrest & Lamar County",
    tier: "home",
    intro:
      "Hattiesburg is home. Our office, our warehouse and our storage are here, which means Hattiesburg displays get the earliest install dates, the fastest maintenance response and the shortest drive when something needs fixing on a cold night in December.",
    localContext:
      "The historic neighborhoods off Hardy Street and the older parts of town are full of two-story homes with steep pitches, deep eaves and enormous live oaks, which is exactly the combination that makes DIY installation dangerous and professional installation worth paying for. Newer developments toward Oak Grove and Lamar County trend toward long single-story rooflines and brick columns that light beautifully and price efficiently. On the commercial side we cover the Highway 98 corridor, downtown, the university area and the medical district.",
    emphasis: [
      "christmas-light-installation",
      "residential-holiday-lighting",
      "permanent-architectural-lighting",
      "tree-wrapping",
    ],
    nearby: ["petal", "purvis", "sumrall", "laurel"],
  },
  {
    slug: "petal",
    city: "Petal",
    county: "Forrest County",
    tier: "core",
    intro:
      "Petal is ten minutes from our warehouse, which makes it one of the easiest markets we serve and one where whole streets tend to book together once a few neighbors see a display go up.",
    localContext:
      "Petal is largely newer residential construction with straightforward rooflines, which keeps installation efficient and pricing sensible. It is also the market where our neighborhood coordination works best: when several homes on the same street schedule together, crews stay put instead of driving, and the whole street reads as one display from the road.",
    emphasis: [
      "residential-holiday-lighting",
      "christmas-light-installation",
      "tree-wrapping",
    ],
    nearby: ["hattiesburg", "purvis", "laurel"],
  },
  {
    slug: "purvis",
    city: "Purvis",
    county: "Lamar County",
    tier: "core",
    intro:
      "Purvis and the surrounding Lamar County communities sit well inside our residential service radius, including the larger properties and acreage homes south and west of town.",
    localContext:
      "Lamar County properties often sit on more land, which changes the design: driveways get longer, trees matter more than rooflines, and entrance features start to carry the display. Tree wrapping and pathway lighting frequently do more here than adding another run of roofline.",
    emphasis: ["tree-wrapping", "residential-holiday-lighting", "landscape-lighting"],
    nearby: ["hattiesburg", "petal", "sumrall", "columbia"],
  },
  {
    slug: "sumrall",
    city: "Sumrall",
    county: "Lamar County",
    tier: "core",
    intro:
      "Sumrall is comfortably within our normal residential radius, and the rural properties around it are some of the most rewarding to light because there is nothing competing with the display after dark.",
    localContext:
      "Properties around Sumrall tend to be set back from the road on larger lots with mature hardwoods. A wrapped oak at the head of a long driveway does more for these homes than any amount of roofline, and pathway and driveway lighting carries visitors in from the road.",
    emphasis: ["tree-wrapping", "landscape-lighting", "residential-holiday-lighting"],
    nearby: ["hattiesburg", "purvis", "columbia"],
  },
  {
    slug: "laurel",
    city: "Laurel",
    county: "Jones County",
    tier: "core",
    intro:
      "Laurel is a short drive up the interstate and a market that takes its historic architecture seriously, which makes it one of our favourite places to design a display.",
    localContext:
      "The historic district is full of early-century homes with detailed trim, deep porches, dormers and columns. These are homes where custom-cut strands genuinely matter: a stock strand from a big-box store cannot follow that trim without gapping at every corner. Downtown Laurel's commercial buildings and the churches around the district are strong candidates for road-facing displays.",
    emphasis: [
      "residential-holiday-lighting",
      "christmas-light-installation",
      "commercial-holiday-lighting",
    ],
    nearby: ["hattiesburg", "petal", "ellisville"],
  },
  {
    slug: "ellisville",
    city: "Ellisville",
    county: "Jones County",
    tier: "core",
    intro:
      "Ellisville sits between Hattiesburg and Laurel, well inside our service radius for both residential displays and commercial work.",
    localContext:
      "Ellisville combines established in-town neighborhoods with newer construction and a college campus, so we see everything from single-story rooflines to institutional buildings. Its position between our two strongest Pine Belt markets means crews are frequently nearby, which helps with in-season maintenance response.",
    emphasis: ["residential-holiday-lighting", "commercial-holiday-lighting"],
    nearby: ["laurel", "hattiesburg", "petal"],
  },
  {
    slug: "columbia",
    city: "Columbia",
    county: "Marion County",
    tier: "core",
    intro:
      "Columbia is within our normal service area for residential displays and a market where downtown commercial and civic lighting has real visibility.",
    localContext:
      "Columbia's downtown and the properties along the main corridors are highly road-facing, which rewards displays designed to read at driving speed rather than up close. Residential work here is a mix of established in-town homes and larger properties on the outskirts where tree lighting dominates.",
    emphasis: [
      "residential-holiday-lighting",
      "commercial-holiday-lighting",
      "tree-wrapping",
    ],
    nearby: ["purvis", "sumrall", "hattiesburg"],
  },
  {
    slug: "wiggins",
    city: "Wiggins",
    county: "Stone County",
    tier: "regional",
    intro:
      "Wiggins sits between the Pine Belt and the Coast, and we serve it for both residential displays and commercial work on the way to and from Gulf Coast projects.",
    localContext:
      "Stone County properties often have significant pine and hardwood cover, which affects design more than people expect: a display has to be positioned where it is actually visible from the road rather than absorbed by the tree line. Commercial work along the highway corridor is straightforward and highly visible.",
    emphasis: ["residential-holiday-lighting", "tree-wrapping", "commercial-holiday-lighting"],
    nearby: ["hattiesburg", "gulfport", "purvis"],
  },
  {
    slug: "gulfport",
    city: "Gulfport",
    county: "Harrison County",
    tier: "coast",
    intro:
      "Gulfport is our strongest Gulf Coast market, and it is primarily a commercial one: hospitality properties, retail centers and businesses along the beach corridor where lighting is a revenue decision rather than a decoration.",
    localContext:
      "Coastal installations have to be built for salt air and wind, which changes fixture selection and how everything is secured. The Coast also runs two seasons rather than one: many Gulfport properties book a Christmas display and a Mardi Gras display back to back, and it is materially cheaper to plan both at once. Palms wrap differently from hardwoods and are a signature look here.",
    emphasis: [
      "commercial-holiday-lighting",
      "mardi-gras-lighting",
      "bistro-patio-lighting",
      "permanent-architectural-lighting",
    ],
    nearby: ["biloxi", "ocean-springs", "wiggins"],
  },
  {
    slug: "biloxi",
    city: "Biloxi",
    county: "Harrison County",
    tier: "coast",
    intro:
      "Biloxi is a hospitality market first. We light hotels, resorts, restaurants and commercial properties where the entrance is the first thing a guest photographs.",
    localContext:
      "Biloxi properties are lit for guests, not neighbors, which raises the standard: a dark section on a resort facade is a guest complaint. That is why commercial installations here get scheduled night inspections through the season. Mardi Gras is a genuine second season on this stretch of coast, and purple, green and gold work is booked well in advance.",
    emphasis: [
      "commercial-holiday-lighting",
      "mardi-gras-lighting",
      "bistro-patio-lighting",
      "wedding-event-lighting",
    ],
    nearby: ["gulfport", "ocean-springs"],
  },
  {
    slug: "ocean-springs",
    city: "Ocean Springs",
    county: "Jackson County",
    tier: "coast",
    intro:
      "Ocean Springs has the best-preserved live oaks on the Coast and a downtown that takes its appearance seriously, which makes it a natural market for tree lighting and district-scale commercial work.",
    localContext:
      "The live oaks through downtown and the older neighborhoods are the defining feature here and the single most dramatic thing to light in the entire market. Full trunk and limb wrapping on a mature coastal oak is a lift job, not a ladder job. The downtown business district and the Mardi Gras calendar both drive commercial demand.",
    emphasis: [
      "tree-wrapping",
      "mardi-gras-lighting",
      "commercial-holiday-lighting",
      "wedding-event-lighting",
    ],
    nearby: ["biloxi", "gulfport"],
  },
  {
    slug: "jackson",
    city: "Jackson",
    county: "Hinds County",
    tier: "regional",
    intro:
      "Jackson is outside our normal residential radius, but it is well inside the range we will travel for larger commercial, HOA and municipal projects.",
    localContext:
      "Metro Jackson has the state's largest concentration of master-planned communities, corporate campuses and commercial properties, which is exactly the work worth a two-hour drive. For projects at this scale, crews mobilise and stay rather than commuting daily, so distance affects scheduling far less than people assume. Residential enquiries here are generally best served by a local installer unless the property is substantial.",
    emphasis: [
      "hoa-community-lighting",
      "commercial-holiday-lighting",
      "permanent-architectural-lighting",
    ],
    nearby: ["hattiesburg", "laurel"],
  },
  {
    slug: "meridian",
    city: "Meridian",
    county: "Lauderdale County",
    tier: "regional",
    intro:
      "Meridian is a commercial and civic market for us. We travel there for downtown districts, churches, campuses and larger community projects.",
    localContext:
      "Meridian's downtown architecture and its churches are strong road-facing lighting candidates, and civic and institutional projects here tend to be planned far enough ahead that travel is a scheduling detail rather than an obstacle. As with Jackson, smaller residential work is usually better served locally.",
    emphasis: [
      "commercial-holiday-lighting",
      "hoa-community-lighting",
      "christmas-light-installation",
    ],
    nearby: ["laurel", "hattiesburg"],
  },
];

export const areaBySlug = (slug: string) =>
  SERVICE_AREAS.find((a) => a.slug === slug);

export const areasByTier = (tier: ServiceArea["tier"]) =>
  SERVICE_AREAS.filter((a) => a.tier === tier);

/** Public-facing coverage statements. Kept honest and non-committal on edges. */
export const COVERAGE = {
  residential:
    "Residential displays across Hattiesburg, the Pine Belt and roughly a one-hour radius.",
  commercial:
    "Commercial and HOA work across South Mississippi and the Gulf Coast, roughly a two-hour radius.",
  large:
    "For larger commercial projects we travel statewide. If the project is worth doing, distance is a scheduling question, not a no.",
} as const;
