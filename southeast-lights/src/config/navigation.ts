/**
 * Header and footer navigation.
 *
 * Information architecture: Southeast Lights is a year-round lighting company
 * with four divisions, not a Christmas company. Holiday Lighting and
 * Permanent Lighting are LIVE. Landscape and Event are built but flagged off
 * until crews and equipment are genuinely ready, because we do not publish
 * pages promising work we cannot perform today.
 */

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
  /** When false the link is hidden everywhere. Used for unbuilt divisions. */
  enabled?: boolean;
}

/** Flip to true only when the division can actually be delivered. */
export const DIVISION_FLAGS = {
  holiday: true,
  permanent: true,
  landscape: false,
  event: false,
} as const;

export const divisionsNav: NavLink[] = [
  {
    label: "Holiday Lighting",
    href: "/holiday-lighting",
    enabled: DIVISION_FLAGS.holiday,
    children: [
      { label: "Residential", href: "/holiday-lighting/residential" },
      { label: "Commercial", href: "/holiday-lighting/commercial" },
      { label: "Add-Ons", href: "/holiday-lighting/additions" },
      {
        label: "Takedown & Storage",
        href: "/holiday-lighting/takedown-and-storage",
      },
    ],
  },
  {
    label: "Permanent Lighting",
    href: "/permanent-lighting",
    enabled: DIVISION_FLAGS.permanent,
    children: [
      { label: "How It Works", href: "/permanent-lighting/how-it-works" },
      { label: "Residential", href: "/permanent-lighting/residential" },
      { label: "Commercial", href: "/permanent-lighting/commercial" },
    ],
  },
  {
    label: "Landscape Lighting",
    href: "/landscape-lighting",
    enabled: DIVISION_FLAGS.landscape,
  },
  {
    label: "Event Lighting",
    href: "/event-lighting",
    enabled: DIVISION_FLAGS.event,
  },
];

/**
 * The commercial side is its own hub, not a tab inside a service page: the
 * buyer, the sales cycle and the paperwork are all different.
 */
export const commercialNav: NavLink[] = [
  { label: "Churches", href: "/commercial/churches" },
  { label: "Schools & Universities", href: "/commercial/schools-and-universities" },
  { label: "Municipal & Government", href: "/commercial/municipal-and-government" },
  { label: "Parks & Public Spaces", href: "/commercial/parks-and-public-spaces" },
  { label: "Retail & Shopping Centers", href: "/commercial/retail-and-shopping-centers" },
  { label: "HOAs & Neighborhoods", href: "/commercial/hoa-and-neighborhoods" },
  { label: "Hotels & Hospitality", href: "/commercial/hotels-and-hospitality" },
  { label: "Large Tree Installations", href: "/commercial/large-tree-installations" },
];

export const mainNav: NavLink[] = [
  ...divisionsNav,
  { label: "Commercial", href: "/commercial", children: commercialNav },
  { label: "Estimator", href: "/estimator" },
  { label: "Projects", href: "/projects" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta: NavLink = {
  label: "Free Estimate",
  href: "/free-estimate",
};

export const commercialCta: NavLink = {
  label: "Request a Proposal",
  href: "/commercial/request-proposal",
};

/** Strip flagged-off entries. Always render nav through this. */
export function visibleNav(links: NavLink[]): NavLink[] {
  return links
    .filter((link) => link.enabled !== false)
    .map((link) => ({
      ...link,
      children: link.children ? visibleNav(link.children) : undefined,
    }));
}
