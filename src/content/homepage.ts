import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  CloudLightning,
  Droplets,
  Factory,
  Fan,
  FileCheck,
  Handshake,
  Home,
  Landmark,
  Layers,
  MapPin,
  PanelTop,
  School,
  ShieldCheck,
  Sun,
  Warehouse,
  Wrench,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { stockPhotos } from "@/content/stock-photos";

/**
 * All homepage copy, curated photos, and internal-link targets in one place
 * (integrity rule, PRD §0.2: no invented reviews, stats, license numbers,
 * warranties, or certifications — every claim here is owner-confirmed).
 * Section components under components/home/ render this data.
 */

/**
 * Homepage imagery policy (owner directive 2026-07-04): supplied project
 * photos NEVER appear on the homepage — premium licensed stock only
 * (stock-photos.ts), with honest generic alt text. Real project photos
 * live in /projects and gallery contexts.
 */

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  locationLine: "Hattiesburg, MS — serving a 2-hour radius across Mississippi",
  /**
   * Owner rebalance 2026-07-04: brand-neutral headline — residential and
   * commercial are presented evenly; never look residential-only.
   */
  headline: { lead: "Roofing done", accent: "right.", tail: "" },
  subhead:
    "Southeast Roofing protects South Mississippi homes and businesses alike — GAF-certified asphalt shingle replacement, commercial roofing systems, storm restoration, and insurance claim help, from first inspection to final walkthrough.",
  photo: stockPhotos.heroHome,
  /** Descriptive only — stock imagery is never presented as our project */
  photoBadge: "Architectural asphalt shingle roofing",
  credentialLine: "GAF Certified Contractor · BBB Accredited · MSBOC Licensed",
} as const;

/* ------------------------------------------------------------------ */
/* 2. Trust bar — confirmed credentials only, no invented stats        */
/* ------------------------------------------------------------------ */

export interface TrustItem {
  icon: LucideIcon;
  label: string;
  detail: string;
}

/**
 * Credential hierarchy (brand directive 2026-07-03): GAF certification gets
 * the greatest emphasis. We are NOT an Owens Corning certified/preferred
 * contractor — OC appears only as a product line we install.
 */
export const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    label: "GAF Certified Contractor",
    detail: "Our primary manufacturer certification",
  },
  {
    icon: Landmark,
    label: "MSBOC Licensed",
    detail: "Mississippi State Board of Contractors",
  },
  {
    icon: Handshake,
    label: "BBB Accredited",
    detail: "Accredited business standing",
  },
  {
    icon: FileCheck,
    label: "Fully Licensed & Insured",
    detail: "Your home and project are protected",
  },
];

/* ------------------------------------------------------------------ */
/* 3. Residential / Commercial split — the two divisions               */
/* ------------------------------------------------------------------ */

/**
 * Owner rebalance 2026-07-04: residential and commercial presented evenly —
 * equal panels, both photo-led.
 */
export const divisionSplit = {
  heading: "Two divisions. One standard of craftsmanship.",
  residential: {
    title: "Residential Roofing",
    description:
      "Asphalt shingle roof replacement done right — backed by repairs, storm restoration, insurance claim help, and metal options.",
    href: "/residential",
    cta: "Explore residential",
    photo: stockPhotos.residentialHome,
    highlights: [
      "Asphalt shingle roof replacement",
      "GAF & Owens Corning systems",
      "Repairs, storm restoration & claims",
    ],
  },
  commercial: {
    title: "Commercial Roofing",
    description:
      "Flat and low-slope systems for facilities across the region — TPO, EPDM, coatings, metal, and planned maintenance.",
    href: "/commercial",
    cta: "Explore commercial",
    photo: stockPhotos.commercialAerial,
    highlights: [
      "TPO, EPDM & modified bitumen",
      "Roof coatings & maintenance programs",
      "Schools, churches, industrial & municipal",
    ],
    industries: [
      { icon: School, label: "Schools" },
      { icon: Landmark, label: "Churches" },
      { icon: Building2, label: "Apartments" },
      { icon: Factory, label: "Industrial" },
      { icon: Warehouse, label: "Warehouses" },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/* 4. Services overview — division-grouped internal linking            */
/* ------------------------------------------------------------------ */

export interface ServiceLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const servicesOverview = {
  eyebrow: "What we do",
  title: "Every roof, every system, both divisions",
  description:
    "From architectural shingles on a family home to a fully maintained commercial membrane system — one local team covers it all.",
  residential: {
    heading: "Residential",
    href: "/residential",
    services: [
      {
        icon: Home,
        label: "Asphalt Shingle Roofing",
        href: "/residential/asphalt-shingle-roofing",
      },
      {
        icon: PanelTop,
        label: "Residential Metal Roofing",
        href: "/residential/metal-roofing",
      },
      {
        icon: Layers,
        label: "Roof Replacement",
        href: "/residential/roof-replacement",
      },
      { icon: Wrench, label: "Roof Repair", href: "/residential/roof-repair" },
      { icon: Droplets, label: "Gutters", href: "/residential/gutters" },
      { icon: Sun, label: "Skylights", href: "/residential/skylights" },
      { icon: Fan, label: "Ventilation", href: "/residential/ventilation" },
    ] satisfies ServiceLink[],
  },
  commercial: {
    heading: "Commercial",
    href: "/commercial",
    services: [
      { icon: Layers, label: "TPO Roofing", href: "/commercial/tpo" },
      { icon: Layers, label: "EPDM Roofing", href: "/commercial/epdm" },
      {
        icon: Droplets,
        label: "Roof Coatings",
        href: "/commercial/roof-coatings",
      },
      {
        icon: PanelTop,
        label: "Commercial Metal Roofing",
        href: "/commercial/metal-roofing",
      },
      {
        icon: ClipboardCheck,
        label: "Roof Maintenance",
        href: "/commercial/roof-maintenance",
      },
      {
        icon: Building2,
        label: "Commercial Replacement",
        href: "/commercial/roof-replacement",
      },
      {
        icon: Wrench,
        label: "Commercial Repair",
        href: "/commercial/roof-repair",
      },
    ] satisfies ServiceLink[],
  },
} as const;

/* ------------------------------------------------------------------ */
/* 5. Storm damage & insurance                                         */
/* ------------------------------------------------------------------ */

export const stormSection = {
  eyebrow: "Storm damage & insurance",
  title: "When the weather turns, we answer",
  description:
    "South Mississippi takes hail, straight-line winds, and hurricane-season storms every year. If your roof takes a hit, we document the damage, provide a thorough inspection, and help you navigate the insurance claim process.",
  photo: stockPhotos.roofTearOff,
  steps: [
    {
      icon: CalendarCheck,
      title: "Rapid inspection",
      text: "We assess and document every impact point with photos.",
    },
    {
      icon: FileCheck,
      title: "Claim support",
      text: "We provide the documentation your insurer needs and can meet your adjuster on site.",
    },
    {
      icon: Layers,
      title: "Full restoration",
      text: "From emergency tarping to complete replacement, one crew sees it through.",
    },
  ],
  primaryCta: { label: "Get storm damage help", href: "/storm-damage" },
  secondaryCta: {
    label: "Insurance claim assistance",
    href: "/storm-damage/insurance-claims",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 6. Metal systems — a material within BOTH divisions (PRD §4.3)      */
/* ------------------------------------------------------------------ */

export const metalSection = {
  eyebrow: "Metal roofing systems",
  title: "Metal, engineered for homes and businesses alike",
  description:
    "Metal isn't a separate trade for us — it's a roofing system we install across both divisions, matched to the structure it protects.",
  residential: {
    title: "Residential Metal Roofing",
    href: "/residential/metal-roofing",
    text: "Standing seam and exposed-fastener systems in 26 and 29 gauge — clean lines and long service life for your home.",
    systems: ["Standing seam", "Exposed fastener", "26 gauge", "29 gauge"],
  },
  commercial: {
    title: "Commercial Metal Roofing",
    href: "/commercial/metal-roofing",
    text: "Standing seam, R-panel, PBR panel, and structural metal for facilities, warehouses, and agricultural buildings.",
    systems: ["Standing seam", "R-panel", "PBR panel", "Structural metal"],
  },
  hubNote: {
    label: "Not sure which fits? Start with our metal roofing overview",
    href: "/metal-roofing",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 7. Featured projects — real photos, real cities                     */
/* ------------------------------------------------------------------ */

/**
 * Real project photography lives in /projects, not on the homepage
 * (owner directive 2026-07-04) — this section is the invitation to it.
 */
export const featuredProjects = {
  eyebrow: "Recent work",
  title: "Real roofs, real addresses",
  description:
    "Every photo in our project gallery is a genuine Southeast Roofing job — completed roofs from Hattiesburg to Jackson, Meridian, and the Gulf Coast. Real jobs, real addresses.",
  cta: { label: "Browse recent projects", href: "/projects" },
  cities: [
    "Hattiesburg",
    "Petal",
    "Laurel",
    "Jackson",
    "Meridian",
    "Gulfport",
    "Biloxi",
    "Picayune",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8. Why choose Southeast Roofing — honest differentiators            */
/* ------------------------------------------------------------------ */

export const whyUs = {
  eyebrow: "Why Southeast Roofing",
  title: "A local company you can hold accountable",
  description:
    "We're not a storm-chasing outfit that disappears after the check clears. We live here, we build here, and our name is on every roof.",
  photo: stockPhotos.rooferInstalling,
  points: [
    {
      icon: MapPin,
      title: "Locally owned & operated",
      text: "Based in Hattiesburg, serving a 2-hour radius across Mississippi.",
    },
    {
      icon: ShieldCheck,
      title: "GAF Certified Contractor",
      text: "Certified installation of GAF systems, plus Owens Corning shingle products — always to manufacturer specification.",
    },
    {
      icon: FileCheck,
      title: "Insurance claim experience",
      text: "Thorough documentation and adjuster coordination when storms hit.",
    },
    {
      icon: Handshake,
      title: "Clear communication",
      text: "Straight answers, clean job sites, and a walkthrough before we call it done.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 9. Financing — no invented rates or terms                           */
/* ------------------------------------------------------------------ */

export const financingSection = {
  eyebrow: "Financing",
  title: "A new roof, on a budget that works",
  description:
    "A roof is a major investment — and it rarely comes at a convenient time. Apply for financing through our partner GoodLeap, or ask us about options with your estimate.",
  icon: Banknote,
  /** GoodLeap application (owner-supplied 2026-07-04) — external */
  cta: {
    label: "Apply for financing",
    href: siteConfig.links.financing,
    external: true,
  },
  secondaryCta: {
    label: "Schedule a free inspection",
    href: "/free-inspection",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 10. Service area                                                    */
/* ------------------------------------------------------------------ */

export const serviceAreaSection = {
  eyebrow: "Service area",
  title: "Hattiesburg-based. Region-wide reach.",
  description:
    "We serve a full 2-hour radius around Hattiesburg — from Jackson to Meridian to the Gulf Coast, and every town in between.",
  hubCta: { label: "See all service areas", href: "/service-areas" },
} as const;

/* ------------------------------------------------------------------ */
/* 11. Reviews / trust badges — real marks, no fabricated quotes       */
/* ------------------------------------------------------------------ */

export const reviewsSection = {
  eyebrow: "Reputation",
  title: "Don't take our word for it",
  description:
    "Read what real customers say on Google, and verify our credentials for yourself — every badge below links to the official record.",
  /** Live Google Business Profile (owner-supplied 2026-07-04) — external */
  googleCta: {
    label: "Read our Google reviews",
    href: siteConfig.links.googleBusiness,
    external: true,
  },
} as const;

/* ------------------------------------------------------------------ */
/* 12. FAQ — general, factual answers; no invented stats or terms      */
/* ------------------------------------------------------------------ */

export interface HomeFaq {
  question: string;
  answer: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    question: "Do you handle both residential and commercial roofing?",
    answer:
      "Yes — they're our two core divisions. Residential covers shingle and metal roofing, replacement, repair, gutters, skylights, and ventilation. Commercial covers TPO, EPDM, modified bitumen, coatings, metal systems, and planned maintenance programs.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We're based in Hattiesburg and serve a roughly 2-hour radius across Mississippi — including Petal, Laurel, Columbia, Picayune, the Gulf Coast, Jackson, Meridian, and the communities in between.",
  },
  {
    question: "Do you help with insurance claims after storm damage?",
    answer:
      "Yes. We inspect and document the damage thoroughly, provide the reports and photos your insurance company needs, and can meet your adjuster on site. The claim decision always rests with your insurer, but you won't navigate the process alone.",
  },
  {
    question: "Should I choose metal or shingle roofing?",
    answer:
      "It depends on your structure, budget, and goals. Architectural shingles are the most cost-effective option up front; metal systems typically cost more initially but offer a longer service life and excellent wind performance. We install both, so our recommendation is based on your roof — not on what we happen to sell.",
  },
  {
    question: "How long does a roof replacement take?",
    answer:
      "Most residential replacements are completed in one to two days once materials arrive, depending on the size and complexity of the roof. Commercial projects vary with the system and square footage — we provide a schedule with every estimate.",
  },
  {
    question: "Is the inspection really free?",
    answer:
      "Yes. We inspect your roof, document what we find, and give you a straight answer — including when the right answer is a small repair instead of a replacement.",
  },
];

/* ------------------------------------------------------------------ */
/* 13. Final CTA                                                       */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Ready for a roof you don't have to think about?",
  description:
    "Schedule a free inspection, or get an instant estimate on your roof right now.",
  primary: { label: "Schedule Free Inspection", href: "/free-inspection" },
  /** Roofr instant estimator (owner-supplied 2026-07-04) — external */
  estimate: {
    label: "Get an Instant Estimate",
    href: siteConfig.links.instantEstimate,
    external: true,
  },
  commercial: {
    label: "Commercial? Request a consultation",
    href: "/commercial/request-consultation",
  },
  icon: CloudLightning,
} as const;
