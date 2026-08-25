import { SERVICES, enabledServices } from "./services";
import { verticalsByPriority } from "./verticals";

/**
 * Navigation.
 *
 * Kept deliberately shallow. The site has a lot of pages but a bloated
 * mega-menu would hurt both mobile usability and the conversion path, so the
 * header carries the shortest set that still reaches everything, and the
 * footer does the deep linking.
 *
 * Get a Quote is always the visually dominant action, above Call.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  children?: NavLink[];
}

const serviceLink = (slug: string): NavLink | null => {
  const service = SERVICES.find((s) => s.slug === slug && s.enabled);
  return service
    ? {
        label: service.label,
        href: `/services/${service.slug}`,
        description: service.summary,
      }
    : null;
};

const compact = (links: (NavLink | null)[]): NavLink[] =>
  links.filter((link): link is NavLink => link !== null);

export const holidayNav = compact([
  serviceLink("christmas-light-installation"),
  serviceLink("residential-holiday-lighting"),
  serviceLink("commercial-holiday-lighting"),
  serviceLink("hoa-community-lighting"),
  serviceLink("tree-wrapping"),
]);

export const otherServicesNav = compact([
  serviceLink("landscape-lighting"),
  serviceLink("bistro-patio-lighting"),
  serviceLink("halloween-lighting"),
  serviceLink("mardi-gras-lighting"),
  serviceLink("wedding-event-lighting"),
]);

export const commercialNav: NavLink[] = verticalsByPriority().map((v) => ({
  label: v.label,
  href: `/commercial/${v.slug}`,
  description: v.summary,
}));

export const mainNav: NavLink[] = [
  {
    label: "Holiday Lighting",
    href: "/holiday-lighting",
    children: holidayNav,
  },
  {
    label: "Permanent Lighting",
    href: "/services/permanent-architectural-lighting",
  },
  { label: "Commercial", href: "/commercial", children: commercialNav },
  { label: "HOA & Communities", href: "/commercial/hoa-communities" },
  { label: "Other Services", href: "/services", children: otherServicesNav },
  { label: "Projects", href: "/projects" },
  { label: "Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
];

/** The dominant action. Never demoted below Call. */
export const primaryCta: NavLink = { label: "Get a Quote", href: "/quote" };
export const commercialCta: NavLink = {
  label: "Request a Commercial Proposal",
  href: "/commercial/request-proposal",
};

export const footerNav = {
  services: enabledServices().map((s) => ({
    label: s.label,
    href: `/services/${s.slug}`,
  })),
  commercial: commercialNav,
  company: [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Design Inspiration", href: "/inspiration" },
    { label: "Reviews", href: "/reviews" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
  ],
} as const;
