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
        body: "Entrance monuments, boulevard trees, common areas, the clubhouse and the amenity center handled as one coherent design instead of four contractors with four different bulb colours.",
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
    slug: "municipal-and-government",
    label: "Municipal & Government",
    title: "Municipal and City Holiday Lighting",
    metaDescription:
      "Holiday lighting for Mississippi cities, downtown districts, parks and municipal buildings. Insured, properly equipped crews with documentation for public procurement.",
    summary:
      "We light downtown districts, city buildings, parks and public spaces for the holidays and for Mardi Gras, with the insurance documentation public procurement requires.",
    image: IMAGES.downtownMunicipal,
    priority: 4,
    concerns: [
      {
        heading: "Procurement-ready paperwork",
        body: "Certificates of insurance, W-9 and references available on request so a clerk can process the file without chasing us for documents.",
      },
      {
        heading: "Work over public right-of-way",
        body: "Downtown work means lane closures, pedestrian traffic and coordination with public works. Our crews plan for it rather than improvising on the day.",
      },
      {
        heading: "Displays that survive a season of weather",
        body: "Public installations get inspected and serviced through the season. A dark block on Main Street in mid-December is a phone call to city hall, so we would rather find it first.",
      },
      {
        heading: "Two seasons, one vendor",
        body: "Christmas and Mardi Gras are the same crews, the same equipment and the same coordination. Many Gulf Coast municipalities book both together.",
      },
    ],
  },
  {
    slug: "hotels-and-resorts",
    label: "Hotels & Resorts",
    title: "Hotel and Resort Holiday Lighting",
    metaDescription:
      "Holiday and architectural lighting for hotels, resorts and hospitality properties on the Mississippi Gulf Coast and across South Mississippi.",
    summary:
      "We light hospitality properties where the entrance is the first thing a guest photographs: porte-cocheres, facades, palms and grounds, installed without disrupting guests.",
    image: IMAGES.hotelResort,
    priority: 5,
    concerns: [
      {
        heading: "Installed without disrupting guests",
        body: "Work is staged around arrival and departure peaks and around events on the property. Lifts do not sit in the porte-cochere at check-in.",
      },
      {
        heading: "The entrance is the photograph",
        body: "Guests photograph the drive-up. We design the porte-cochere, facade and palms as the composition people actually post, not as an afterthought.",
      },
      {
        heading: "Kept perfect all season",
        body: "A hospitality property cannot have a dark section. Scheduled night inspections catch failures before a guest or a manager does.",
      },
      {
        heading: "Mardi Gras too",
        body: "On the Coast the season does not end in December. Many properties run a Christmas display and a Mardi Gras display back to back.",
      },
    ],
  },
  {
    slug: "country-clubs",
    label: "Country Clubs",
    title: "Country Club and Golf Club Holiday Lighting",
    metaDescription:
      "Holiday lighting for country clubs, golf clubs and private clubs in Mississippi. Clubhouse facades, entrances, specimen trees and event lighting.",
    summary:
      "We light clubhouses, entry drives and specimen trees for private clubs, and handle the event lighting for the season's calendar of member functions.",
    image: IMAGES.countryClub,
    priority: 6,
    concerns: [
      {
        heading: "Members notice the details",
        body: "Sagging runs, mismatched bulb temperatures and dark sections get mentioned at the bar. Custom-cut strands and consistent warm white keep it looking deliberate.",
      },
      {
        heading: "Built around the event calendar",
        body: "Member Christmas parties, tournaments and receptions each have a date. The display is finished before the first one, not during it.",
      },
      {
        heading: "Specimen trees done right",
        body: "The oaks on a club property are usually its best asset after dark. Full trunk and limb wrapping on mature trees needs lifts and crews who have done it before.",
      },
    ],
  },
  {
    slug: "retail-and-shopping-centers",
    label: "Retail & Shopping Centers",
    title: "Retail and Shopping Center Christmas Lighting",
    metaDescription:
      "Commercial Christmas lighting for shopping centers, retail plazas and mixed-use developments across Mississippi. Insured crews, lift equipment, full-season maintenance.",
    summary:
      "We light retail centers and mixed-use properties for the season that actually pays their rent, with crews and equipment sized for long parapets and parking-island trees.",
    image: IMAGES.retailCenter,
    priority: 7,
    concerns: [
      {
        heading: "This is your quarter",
        body: "Holiday lighting on a retail property is a trade-driving expense, not decoration. Design should pull traffic off the road and hold it after dark.",
      },
      {
        heading: "Installed before traffic arrives",
        body: "Lifts and crews work early or overnight where the property requires it, so shoppers and tenants are not routed around a work zone in November.",
      },
      {
        heading: "One property manager, one call",
        body: "Multiple buildings, multiple tenants, one scope and one invoice. Tenants do not each hire a different guy with a ladder.",
      },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurants",
    title: "Restaurant and Bar Lighting",
    metaDescription:
      "Holiday, bistro and patio lighting for restaurants and bars in South Mississippi and the Gulf Coast. Year-round patio string lighting and seasonal displays.",
    summary:
      "We handle both sides of restaurant lighting: year-round bistro and patio string lighting that stays tight, and seasonal displays for Christmas and Mardi Gras.",
    image: IMAGES.bistroPatio,
    priority: 8,
    concerns: [
      {
        heading: "Patio lighting that stays tight",
        body: "Most sagging bistro lighting was installed without proper cable tensioning. Done correctly it stays straight through wind and weather instead of drooping by February.",
      },
      {
        heading: "Installed around service",
        body: "Work happens before open or between services. We are not running a lift through your patio during a Friday dinner rush.",
      },
      {
        heading: "The patio is the photograph",
        body: "Outdoor dining lives on social media. Good overhead lighting is the single cheapest thing that makes a patio look worth posting.",
      },
    ],
  },
  {
    slug: "apartments-and-multifamily",
    label: "Apartments & Multifamily",
    title: "Apartment and Multifamily Holiday Lighting",
    metaDescription:
      "Holiday lighting for apartment communities, multifamily developments and property managers across Mississippi. Entrances, clubhouses and amenity areas.",
    summary:
      "We light apartment community entrances, clubhouses and amenity areas so a property looks leased-up and cared for through leasing season.",
    image: IMAGES.apartments,
    priority: 9,
    concerns: [
      {
        heading: "Curb appeal during leasing season",
        body: "Prospects tour in the dark from November onward. A lit entrance and clubhouse is the cheapest curb-appeal spend a property has.",
      },
      {
        heading: "Insured work on your property",
        body: "Certificates of insurance provided before we mobilise, naming the ownership entity as required by your management agreement.",
      },
      {
        heading: "One scope across a portfolio",
        body: "Managing several communities is easier with one design standard, one schedule and one invoice per property.",
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
      "We light office buildings and corporate properties where the brief is restraint: clean lines, one colour temperature and nothing that reads as novelty.",
    image: IMAGES.officeBuilding,
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
