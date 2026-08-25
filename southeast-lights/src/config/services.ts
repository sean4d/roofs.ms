import { IMAGES, type SiteImage } from "./images";

/**
 * Every service the site sells, in one array.
 *
 * `division` groups them for navigation and for the seasonal homepage.
 * `enabled: false` removes a service from navigation, the sitemap and every
 * listing without deleting the page, so a capability can be published the day
 * it is genuinely deliverable.
 */

export type Division = "holiday" | "permanent" | "landscape" | "event";

export interface Service {
  slug: string;
  division: Division;
  /** Nav and card label. */
  label: string;
  /** H1 and <title> subject. Written for search intent. */
  title: string;
  metaDescription: string;
  /** One-sentence answer-first summary. Used in cards and by AI assistants. */
  summary: string;
  image: SiteImage;
  enabled: boolean;
  /** Audience weighting: commercial work gets more visual space. */
  audience: "residential" | "commercial" | "both";
}

export const SERVICES: Service[] = [
  {
    slug: "christmas-light-installation",
    division: "holiday",
    label: "Christmas Light Installation",
    title: "Professional Christmas Light Installation",
    metaDescription:
      "All-inclusive Christmas light installation in Hattiesburg and South Mississippi. Design, commercial-grade LEDs, installation, in-season maintenance, takedown and storage for one price.",
    summary:
      "One price covers design, commercial-grade lighting, installation, in-season maintenance, takedown and storage. You never handle a strand or climb a ladder.",
    image: IMAGES.holidayHero,
    enabled: true,
    audience: "both",
  },
  {
    slug: "residential-holiday-lighting",
    division: "holiday",
    label: "Residential Holiday Lighting",
    title: "Residential Christmas Lighting for Premium Homes",
    metaDescription:
      "Custom-designed residential Christmas lighting across the Pine Belt. Rooflines, columns, windows, wrapped trees and pathway lighting, professionally installed and maintained.",
    summary:
      "Custom-cut displays designed around your home's architecture, from rooflines and columns to wrapped trees and lit walkways.",
    image: IMAGES.colonialColumns,
    enabled: true,
    audience: "residential",
  },
  {
    slug: "commercial-holiday-lighting",
    division: "holiday",
    label: "Commercial Holiday Lighting",
    title: "Commercial Christmas Light Installation",
    metaDescription:
      "Commercial Christmas lighting for retail centers, offices, hotels and campuses across Mississippi. Insured crews, boom lifts, scheduled night inspections and full-season service.",
    summary:
      "Large-scale displays installed with proper lift equipment, insured crews and a maintenance schedule that keeps the property looking right all season.",
    image: IMAGES.retailCenter,
    enabled: true,
    audience: "commercial",
  },
  {
    slug: "hoa-community-lighting",
    division: "holiday",
    label: "HOA & Community Lighting",
    title: "HOA and Neighborhood Holiday Lighting",
    metaDescription:
      "Holiday lighting for HOAs, master-planned communities and neighborhood entrances in Mississippi. Board-ready proposals, consistent design year to year, full maintenance and storage.",
    summary:
      "Entrance monuments, boulevard trees and common areas designed as one coherent display, with board-ready proposals and the same look every year.",
    image: IMAGES.hoaEntrance,
    enabled: true,
    audience: "commercial",
  },
  {
    slug: "tree-wrapping",
    division: "holiday",
    label: "Tree Lighting & Wrapping",
    title: "Christmas Tree Wrapping and Tree Lighting",
    metaDescription:
      "Professional tree wrapping and tree lighting in South Mississippi, from ornamental trees to enormous live oaks. Trunk and limb wrapping, canopy lighting and uplighting.",
    summary:
      "Trunk and limb wrapping on everything from ornamental trees to century-old live oaks. The single most dramatic thing you can light on a property.",
    image: IMAGES.liveOakWrap,
    enabled: true,
    audience: "both",
  },
  {
    slug: "permanent-architectural-lighting",
    division: "permanent",
    label: "Permanent Architectural Lighting",
    title: "Permanent Architectural Lighting",
    metaDescription:
      "Permanent exterior LED lighting installed into your trim in Hattiesburg and South Mississippi. Warm white nightly, full color for every holiday, invisible by day.",
    summary:
      "Track LED installed once into your trim: warm white on an ordinary evening, any color for any holiday, and invisible from the street in daylight.",
    image: IMAGES.permanentHero,
    enabled: true,
    audience: "both",
  },
  {
    slug: "landscape-lighting",
    division: "landscape",
    label: "Landscape Lighting",
    title: "Landscape and Exterior Accent Lighting",
    metaDescription:
      "Landscape lighting design and installation in South Mississippi: path lighting, tree uplighting, hardscape washing and facade accent lighting.",
    summary:
      "Path lighting, tree uplighting and facade washing that make a property look considered after dark, all year.",
    image: IMAGES.landscapeLighting,
    enabled: true,
    audience: "both",
  },
  {
    slug: "bistro-patio-lighting",
    division: "landscape",
    label: "Bistro & Patio Lighting",
    title: "Bistro and Patio String Lighting",
    metaDescription:
      "Commercial bistro and patio string lighting for restaurants, courtyards and outdoor venues across South Mississippi. Properly tensioned, weather-rated installations.",
    summary:
      "Properly tensioned, weather-rated overhead string lighting for patios, courtyards and outdoor dining that stays up and stays straight.",
    image: IMAGES.bistroPatio,
    enabled: true,
    audience: "commercial",
  },
  {
    slug: "mardi-gras-lighting",
    division: "event",
    label: "Mardi Gras Lighting",
    title: "Mardi Gras Lighting on the Mississippi Gulf Coast",
    metaDescription:
      "Purple, green and gold Mardi Gras lighting for Gulf Coast businesses, hospitality properties and homes. Installed, maintained and removed on your schedule.",
    summary:
      "Purple, green and gold on rooflines, balconies and trees for Gulf Coast businesses and communities, installed and removed on your schedule.",
    image: IMAGES.mardiGras,
    enabled: true,
    audience: "both",
  },
  {
    slug: "halloween-lighting",
    division: "event",
    label: "Halloween Lighting",
    title: "Halloween Lighting in South Mississippi",
    metaDescription:
      "Professional Halloween lighting across South Mississippi. Orange and purple commercial-grade bulbs cut to your rooflines, ridges and gable rakes, installed and removed by roof-trained crews.",
    summary:
      "Orange and purple cut to your rooflines, ridges and gable rakes, installed and removed by the same roof-trained crews that handle the Christmas work.",
    image: IMAGES.projectPoplarvilleHalloween,
    enabled: true,
    audience: "both",
  },
  {
    slug: "wedding-event-lighting",
    division: "event",
    label: "Wedding & Event Lighting",
    title: "Wedding and Event Lighting",
    metaDescription:
      "Wedding and event lighting across South Mississippi: canopy string lighting, tree wrapping, venue accent lighting and market lights, installed and removed around your date.",
    summary:
      "Canopy string lighting, wrapped trees and venue accent lighting, installed before your date and removed after it.",
    image: IMAGES.weddingEvent,
    enabled: true,
    audience: "both",
  },
];

export const enabledServices = () => SERVICES.filter((s) => s.enabled);

export const servicesByDivision = (division: Division) =>
  enabledServices().filter((s) => s.division === division);

export const serviceBySlug = (slug: string) =>
  SERVICES.find((s) => s.slug === slug && s.enabled);

export const DIVISION_LABELS: Record<Division, string> = {
  holiday: "Holiday Lighting",
  permanent: "Permanent Lighting",
  landscape: "Landscape & Architectural",
  event: "Seasonal & Event",
};
