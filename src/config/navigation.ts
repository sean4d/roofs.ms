/**
 * Navigation structure for header and footer, reflecting the corrected
 * information architecture (PRD §2, v3): Residential Roofing and Commercial
 * Roofing are the two primary service divisions; Metal Roofing is a
 * material/system within both (cross-hub at /metal-roofing, never presented
 * as a third division). Routes for later phases resolve to the branded
 * "on the roadmap" 404 until their phase ships.
 */

import { siteConfig } from "@/config/site";

export interface NavLink {
  label: string;
  href: string;
}

export const mainNav: NavLink[] = [
  { label: "Residential Roofing", href: "/residential" },
  { label: "Commercial Roofing", href: "/commercial" },
  { label: "Storm Damage", href: "/storm-damage" },
  { label: "Learning Center", href: "/learn" },
  { label: "About", href: "/about" },
  { label: "Financing", href: "/financing" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const primaryCta: NavLink = {
  label: "Free Inspection",
  href: "/free-inspection",
};

export const commercialCta: NavLink = {
  label: "Request Consultation",
  href: "/commercial/request-consultation",
};

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    heading: "Residential Roofing",
    links: [
      { label: "Residential Overview", href: "/residential" },
      {
        label: "Asphalt Shingle Roofing",
        href: "/residential/asphalt-shingle-roofing",
      },
      {
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
      },
      { label: "Roof Replacement", href: "/residential/roof-replacement" },
      { label: "Roof Repair", href: "/residential/roof-repair" },
      { label: "Seamless Gutters", href: "/residential/gutters" },
      { label: "Leaf Guard", href: "/residential/leaf-guard" },
      { label: "Fascia & Soffit", href: "/residential/fascia" },
      { label: "Ventilation", href: "/residential/ventilation" },
    ],
  },
  {
    heading: "Commercial Roofing",
    links: [
      { label: "Commercial Overview", href: "/commercial" },
      { label: "TPO Roofing", href: "/commercial/tpo" },
      { label: "EPDM Roofing", href: "/commercial/epdm" },
      { label: "Roof Coatings", href: "/commercial/roof-coatings" },
      { label: "Commercial Metal Roofing", href: "/commercial/metal-roofing" },
      { label: "Roof Maintenance", href: "/commercial/roof-maintenance" },
      { label: "Industries We Serve", href: "/commercial/industries" },
      {
        label: "Request Consultation",
        href: "/commercial/request-consultation",
      },
    ],
  },
  {
    heading: "Roofing Tools",
    links: [
      { label: "Roof Cost Calculator", href: "/roof-cost-calculator" },
      { label: "Roof Color Visualizer", href: "/roof-color-visualizer" },
      { label: "Instant Roof Estimate", href: siteConfig.links.instantEstimate },
      { label: "Roof Damage Analyzer", href: "/roof-damage-analyzer" },
      { label: "Insurance Claim Wizard", href: "/storm-damage/insurance-claims/wizard" },
      { label: "Roof AI Assistant", href: "/roof-assistant" },
      { label: "Project Map", href: "/project-map" },
      { label: "Anatomy of a Roof", href: "/anatomy-of-a-roof" },
    ],
  },
  {
    heading: "Service Areas",
    links: [
      { label: "Hattiesburg", href: "/service-areas/hattiesburg" },
      { label: "Petal", href: "/service-areas/petal" },
      { label: "Laurel", href: "/service-areas/laurel" },
      { label: "Gulfport", href: "/service-areas/gulfport" },
      { label: "Biloxi", href: "/service-areas/biloxi" },
      { label: "Jackson", href: "/service-areas/jackson" },
      { label: "Meridian", href: "/service-areas/meridian" },
      { label: "All Service Areas", href: "/service-areas" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Get a Quote", href: "/quote" },
      { label: "About Us", href: "/about" },
      { label: "Storm Damage", href: "/storm-damage" },
      { label: "Storm Center", href: "/storm-center" },
      { label: "Metal Roofing", href: "/metal-roofing" },
      { label: "Project Gallery", href: "/projects" },
      { label: "Reviews", href: "/reviews" },
      { label: "Financing", href: "/financing" },
      { label: "Learning Center", href: "/learn" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];
