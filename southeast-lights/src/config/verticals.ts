import { IMAGES, type SiteImage } from "./images";

/**
 * Commercial verticals. These carry the site's highest-value traffic, so each
 * one gets real content written to that buyer's actual concerns rather than a
 * city name swapped into a template.
 *
 * `priority` controls prominence: HOAs are the single most important market,
 * so they lead everywhere.
 */

export interface Vertical {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  /** Answer-first summary. Quotable by an AI assistant verbatim. */
  summary: string;
  image: SiteImage;
  priority: number;
  /** What this buyer actually worries about, in their own terms. */
  concerns: { heading: string; body: string }[];
}

export const VERTICALS: Vertical[] = [
  {
    slug: "hoa-communities",
    label: "HOAs & Communities",
    title: "HOA and Community Holiday Lighting",
    metaDescription:
      "Holiday lighting for HOAs, master-planned communities and neighborhood entrances across Mississippi. Board-ready proposals, insured crews, consistent design year over year.",
    summary:
      "We light neighborhood entrances, boulevards and common areas for HOAs and master-planned communities, with proposals a board can actually vote on and a display that looks identical next year.",
    image: IMAGES.hoaEntrance,
    priority: 1,
    concerns: [
      {
        heading: "Proposals a board can vote on",
        body: "You get a written scope, a fixed seasonal price, a design concept and proof of insurance in one document. Not a number scribbled on the back of a business card that changes in November.",
      },
      {
        heading: "The same display every year",
        body: "Your community's lighting is measured, custom cut, labeled and stored under your name. Next season it goes back up exactly as it was, without redesigning it from scratch or renegotiating the look.",
      },
      {
        heading: "One vendor for the whole community",
        body: "Entrance monuments, boulevard trees, common areas, the clubhouse and the amenity center handled as one coherent design instead of four contractors with four different bulb colors.",
      },
      {
        heading: "Nobody on your board climbing anything",
        body: "Volunteer boards should not be on ladders over a monument sign. Our crews are insured, roof-trained and equipped with proper lifts for entrance features and mature trees.",
      },
      {
        heading: "Electrical planned, not improvised",
        body: "Entrances and medians rarely have convenient power. We plan circuits, timers and runs during design so the display is not tripping a breaker every cold night.",
      },
      {
        heading: "Maintained through the season",
        body: "For community-scale installations we run periodic night inspections roughly every couple of weeks and correct failures as we find them, usually before a resident calls the board about it.",
      },
    ],
  },
  {
    slug: "schools",
    label: "Schools",
    title: "School Christmas Lighting",
    metaDescription:
      "Christmas lighting for schools across South Mississippi: gable rooflines, covered walkways, drop-off loops and campus entrances. Insured crews, one fixed seasonal price, scheduled around your calendar.",
    summary:
      "We light school campuses for the Christmas season, from gable rooflines and covered walkways to the drop-off loop and the campus entrance, on one fixed seasonal price scheduled around your calendar.",
    image: IMAGES.projectGcsFront,
    // Second only to HOAs, and the one vertical on this site with a finished
    // campus behind it rather than illustrative photography.
    priority: 2,
    concerns: [
      {
        heading: "Designed for the car line",
        body: "Most of a school display is seen twice a day from a slow-moving car in the drop-off loop. Covered walkways and entry canopies read better at that distance than a roofline three stories up, so that is where the design starts.",
      },
      {
        heading: "Scheduled around your calendar",
        body: "Installation is planned around the school calendar, including outside school hours where a campus prefers it, and around the dates that matter: the Christmas program, the tree lighting, anything the community is invited to.",
      },
      {
        heading: "Licensed and insured crews",
        body: "The work runs under Southeast Roofing LLC, a licensed Mississippi contractor, with the insurance and the lift equipment that comes with it. No volunteers on extension ladders.",
      },
      {
        heading: "A number you can take to the board",
        body: "One fixed seasonal price with a written scope covering design, installation, in-season maintenance, takedown and storage, so an administrator or a board sees the whole cost before approving anything.",
      },
    ],
  },
  {
    slug: "churches",
    label: "Churches",
    title: "Church Christmas Lighting",
    metaDescription:
      "Christmas lighting for churches across South Mississippi: sanctuaries, campus entrances, steeples and large trees. Insured crews, lift equipment and scheduling around your services.",
    summary:
      "We light church campuses for the Christmas season, from steeples and rooflines to the large trees on the lawn, and we schedule around your services rather than through them.",
    image: IMAGES.church,
    priority: 3,
    concerns: [
      {
        heading: "Scheduled around your calendar",
        body: "Installation happens between services and around rehearsals, and we plan for the nights that matter most: Christmas Eve services, community events and anything road-facing.",
      },
      {
        heading: "Height handled properly",
        body: "Steeples, tall gables and mature oaks need lift equipment and trained crews, not volunteers on extension ladders after Sunday service.",
      },
      {
        heading: "Built for the road",
        body: "Most church displays are seen from a passing car. We design for how the campus reads from the highway, not just from the parking lot.",
      },
      {
        heading: "Budget you can take to a committee",
        body: "One fixed seasonal price with a written scope, so a finance committee sees exactly what is included before approving anything.",
      },
    ],
  },
  {
    slug: "commercial-buildings",
    label: "Commercial Buildings",
    title: "Commercial Building Lighting",
    metaDescription:
      "Christmas and architectural lighting for office buildings, corporate campuses and commercial properties in Mississippi. Insured, lift-equipped crews.",
    summary:
      "We light office buildings and corporate properties where the brief is restraint: clean lines, one color temperature and nothing that reads as novelty.",
    image: IMAGES.projectPearsonsBlock,
    priority: 10,
    concerns: [
      {
        heading: "Restraint, not novelty",
        body: "Corporate properties usually want a single clean line of warm white and nothing else. Doing less, precisely, is harder than doing more.",
      },
      {
        heading: "Height and access planned",
        body: "Multi-story parapets need lift equipment and a site plan. We survey access before quoting, not on install day.",
      },
      {
        heading: "Architectural lighting year-round",
        body: "Many corporate properties start with a Christmas display and move to permanent architectural lighting once they see the building lit.",
      },
    ],
  },
];

export const verticalsByPriority = () =>
  [...VERTICALS].sort((a, b) => a.priority - b.priority);

export const verticalBySlug = (slug: string) =>
  VERTICALS.find((v) => v.slug === slug);
