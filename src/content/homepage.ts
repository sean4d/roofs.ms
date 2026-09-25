import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
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
  Medal,
  PanelTop,
  School,
  ShieldCheck,
  Star,
  Warehouse,
  Wrench,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { stockPhotos } from "@/content/stock-photos";

/**
 * All homepage copy, curated photos, and internal-link targets in one place
 * (integrity rule, PRD §0.2: no invented reviews, stats, license numbers,
 * warranties, or certifications. Every claim here is owner-confirmed).
 * Section components under components/home/ render this data.
 */

/**
 * Homepage imagery policy (owner directive 2026-07-04): supplied project
 * photos NEVER appear on the homepage, premium licensed stock only
 * (stock-photos.ts), with honest generic alt text. Real project photos
 * live in /projects and gallery contexts.
 */

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  locationLine: "Hattiesburg, MS · serving all of South Mississippi",
  /** Owner-confirmed headline (2026-07-04): "Roofing done right." */
  headline: { lead: "Roofing done", accent: "right.", tail: "" },
  /**
   * Mobile-first copy: short sentences, no long dashes that wrap awkwardly
   * on phones. Positioning (owner 2026-07-04): experts in EVERY roof type:
   * never imply one system is the specialty and the rest are new to us.
   */
  subhead:
    "Residential or commercial. Shingle, metal, or flat. Whatever roof your home or business needs, we're the local experts who install it right: from first inspection to final walkthrough. Mississippi licensed on both sides of the trade, and based here in Hattiesburg.",
  /** Full-bleed hero background (2400px licensed stock, dark overlay) */
  photo: stockPhotos.heroHome,
  /** Descriptive only, stock imagery is never presented as our project */
  photoBadge: "Architectural asphalt shingle roofing",
} as const;

/**
 * Above-the-fold hero trust bar (Phase 4 §1). Every item is an
 * owner-confirmed fact (siteConfig.trustFacts, 2026-07-04), wording stays
 * in sync with that single source.
 */
export const heroTrustBar = [
  { icon: Star, label: "5-Star Google Rating" },
  { icon: BadgeCheck, label: "Google Verified" },
  { icon: ShieldCheck, label: "GAF Certified Contractor" },
  // Both manufacturer certifications sit together, because a homeowner
  // scanning this list reads them as a pair and one without the other looks
  // like the list is out of date (owner, 2026-09-24).
  { icon: ShieldCheck, label: "CertainTeed ShingleMaster" },
  { icon: Handshake, label: "BBB Accredited · A+ Rating" },
  // Both licences named, because "Mississippi Licensed" is true of a company
  // that can only touch houses and a property manager cannot tell which we are.
  { icon: Landmark, label: "MSBOC Licensed · Residential & Commercial" },
  { icon: FileCheck, label: "Fully Insured & Bonded" },
  { icon: Banknote, label: "$0 Down Financing" },
  { icon: Medal, label: "Lifetime Warranty" },
  // Chamber membership, last because it is the local-standing item rather
  // than a roofing credential. Ten items keeps the grid square: five rows of
  // two on a phone, two and a half rows of four on desktop.
  { icon: Building2, label: "Area Development Partnership Member" },
] as const;

/* ------------------------------------------------------------------ */
/* 2. Trust bar, confirmed credentials only, no invented stats        */
/* ------------------------------------------------------------------ */

export interface TrustItem {
  icon: LucideIcon;
  label: string;
  detail: string;
}

/**
 * Credentials shown on the residential page.
 *
 * TWO MANUFACTURER CERTIFICATIONS NOW (2026-09-24). GAF used to be described
 * here as "our primary manufacturer certification", which was accurate while
 * it was the only one and became misleading the day CertainTeed arrived. We
 * are still NOT an Owens Corning certified or preferred contractor: OC
 * appears across the site only as a product line we install.
 */
export const trustItems: TrustItem[] = [
  {
    icon: ShieldCheck,
    label: "GAF Certified Contractor",
    detail: "Certified to install GAF shingle systems",
  },
  {
    icon: ShieldCheck,
    label: "CertainTeed ShingleMaster",
    detail: "CertainTeed's credential for shingle installers",
  },
  {
    icon: Medal,
    label: "Lifetime Warranty",
    // Hedged on purpose: the coverage is a manufacturer limited-lifetime
    // warranty on qualifying systems, not a Southeast Roofing guarantee.
    detail: "Manufacturer options on qualifying systems",
  },
  {
    icon: Handshake,
    label: "BBB Accredited · A+ Rating",
    detail: "Verified Better Business Bureau standing",
  },
  {
    icon: FileCheck,
    label: "Fully Insured & Bonded",
    detail: "Your home and project are protected",
  },
  {
    icon: Building2,
    label: "Area Development Partnership",
    detail: "Member of Greater Hattiesburg's chamber of commerce",
  },
];

/* ------------------------------------------------------------------ */
/* 3. Residential / Commercial split: the two divisions               */
/* ------------------------------------------------------------------ */

/**
 * Owner rebalance 2026-07-04: residential and commercial presented evenly,
 * equal panels, both photo-led.
 */
export const divisionSplit = {
  heading: "Two divisions. One standard of craftsmanship.",
  residential: {
    title: "Residential Roofing",
    description:
      "Asphalt shingle roof replacement done right, backed by repairs, storm restoration, insurance claim help, and metal options.",
    href: "/residential",
    cta: "Explore residential",
    photo: stockPhotos.residentialHome,
    highlights: [
      "Asphalt shingle roof replacement",
      "GAF, CertainTeed & Owens Corning systems",
      "Repairs, storm restoration & claims",
    ],
  },
  commercial: {
    title: "Commercial Roofing",
    description:
      "Flat and low-slope systems for facilities across the region: TPO, EPDM, coatings, metal, and planned maintenance.",
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
/* 4. Services overview, division-grouped internal linking            */
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
    "From architectural shingles on a family home to a fully maintained commercial membrane system, one local team covers it all.",
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
/* 6. Metal systems, a material within BOTH divisions (PRD §4.3)      */
/* ------------------------------------------------------------------ */

/**
 * Owner positioning (2026-07-04): we're experts in EVERY roofing system:
 * shingle, metal, AND commercial flat/low-slope. No system is presented as
 * the specialty with the others as afterthoughts.
 */
export const systemsSection = {
  eyebrow: "Roofing systems",
  title: "Every system. One standard of installation.",
  description:
    "Shingle, metal, or flat. We install and service them all, for homes and businesses alike. The right system for your structure and budget, never whatever we happen to sell.",
  systems: [
    {
      icon: Home,
      title: "Asphalt Shingle Roofing",
      text: "The region's most popular roof, and for good reason. Affordable, storm-capable, and beautiful when installed to spec by a certified crew.",
      chips: [
        "GAF certified installs",
        "CertainTeed ShingleMaster",
        "Owens Corning products",
        "Architectural shingles",
        "Full-system replacement",
      ],
      links: [
        {
          label: "Shingle roofing",
          href: "/residential/asphalt-shingle-roofing",
        },
        { label: "Roof replacement", href: "/residential/roof-replacement" },
      ],
    },
    {
      icon: PanelTop,
      title: "Metal Roofing",
      text: "Decades of service life, serious wind performance, and clean modern lines. Standing seam and panel systems for homes, businesses, and everything between.",
      chips: [
        "Standing seam",
        "Exposed fastener & R-panel",
        "26 & 29 gauge steel",
        "Residential & commercial",
      ],
      links: [
        { label: "Metal for homes", href: "/residential/metal-roofing" },
        { label: "Commercial metal", href: "/commercial/metal-roofing" },
      ],
    },
    {
      icon: Building2,
      title: "Flat & Low-Slope Roofing",
      text: "Commercial membrane and coating systems for facilities across the region: installed, restored, and maintained around your operations.",
      chips: [
        "TPO & EPDM",
        "Modified bitumen",
        "Roof coatings",
        "Maintenance programs",
      ],
      links: [
        { label: "Commercial roofing", href: "/commercial" },
        { label: "Roof coatings", href: "/commercial/roof-coatings" },
      ],
    },
  ],
  hubNote: {
    label: "Comparing shingle and metal? Read our honest breakdown",
    href: "/metal-roofing",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 7. Featured projects: real photos, real cities                     */
/* ------------------------------------------------------------------ */

/**
 * Real project photography lives in /projects, not on the homepage
 * (owner directive 2026-07-04). This section is the invitation to it.
 */
export const featuredProjects = {
  eyebrow: "Recent work",
  title: "Real roofs. Real Southeast Roofing projects.",
  description:
    "Every photo in our project gallery is a genuine Southeast Roofing job: completed roofs from Hattiesburg to Jackson, Meridian, and the Gulf Coast. Real jobs, really ours.",
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
/* 8. Why choose Southeast Roofing: honest differentiators            */
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
      title: "Certified by GAF and CertainTeed",
      text: "A GAF Certified Contractor and a CertainTeed ShingleMaster. We also install Owens Corning shingle products: always to manufacturer specification.",
    },
    {
      icon: Medal,
      title: "Lifetime warranty",
      text: "Manufacturer limited-lifetime warranty options are available on qualifying roofing systems, coverage depends on the products and system components selected.",
    },
    {
      icon: ClipboardCheck,
      title: "Transparent, itemized pricing",
      text: "Digital proposals priced line by line, with upgrades you toggle yourself. No hidden fees.",
    },
    {
      icon: FileCheck,
      title: "Insurance claim experience",
      text: "When storms hit, we assist through the entire claims process, start to finish.",
    },
    {
      icon: Handshake,
      title: "Clear communication",
      text: "Straight answers, clean job sites, and a final review before we call it done.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8b. Roofing process, from first call to final walkthrough          */
/* ------------------------------------------------------------------ */

export const processSection = {
  eyebrow: "How it works",
  title: "A process you can see coming",
  description:
    "No mystery, no pressure. Every project follows the same five clear steps.",
  steps: [
    {
      icon: CalendarCheck,
      title: "Free inspection",
      text: "We look at the whole roof system and document what we find with photos.",
    },
    {
      icon: FileCheck,
      title: "Itemized digital proposal",
      text: "A proposal in your inbox, priced line by line, with upgrades you can toggle. No hidden fees.",
    },
    {
      icon: ClipboardCheck,
      title: "Insurance help, if it applies",
      text: "Storm claim? We assist through the entire claims process, start to finish.",
    },
    {
      icon: Wrench,
      title: "Build day",
      text: "Most residential roofs are completed in one to two days, site left clean.",
    },
    {
      icon: Medal,
      title: "Final review & warranty",
      text: "We review the completed project with you, photos included, and register the manufacturer warranty your system qualifies for.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8b². Digital proposal, the retail experience (owner 2026-07-04)    */
/* ------------------------------------------------------------------ */

/**
 * Retail/insurance rebalance (owner directive 2026-07-04): the business is
 * 50/50 insurance/retail. This section sells the retail experience:
 * transparent, itemized digital proposals: written for a discerning,
 * high-net-worth buyer: control, clarity, zero pressure.
 */
export const proposalSection = {
  eyebrow: "Transparent pricing",
  title: "Know exactly what you're paying for",
  description:
    "Every estimate arrives as a digital proposal in your email, itemized down to each product and component of your roof. No hidden fees. No surprises.",
  points: [
    {
      title: "Priced line by line",
      text: "Each component of the roof system is priced individually. You see where every dollar goes before you commit to anything.",
    },
    {
      title: "Upgrades you control",
      text: "Options like ridge vent or drip edge are toggles, not sales pressure. Turn them on or off and the total updates for you.",
    },
    {
      title: "Reviewed on your time",
      text: "It's in your inbox: study it, share it with whoever you trust, and approve it whenever you're ready.",
    },
  ],
  /**
   * Interactive EXAMPLE proposal. Line structure and unit economics mirror
   * the owner's real Roofr proposals (owner-supplied screenshot,
   * 2026-07-04), scaled to a smaller typical roof so the base lands just
   * over $8k. EVERY line carries a price, no "included" (owner: hidden-
   * cost smell). Clearly labeled example; real proposals are priced from
   * the actual roof.
   */
  example: {
    heading: "Example roofing proposal",
    subheading: "Itemized · sent to your email",
    /** Wording mirrors the company's real Roofr proposals exactly,
     *  no quantities/measurements shown, line cost only. */
    lineItems: [
      { label: "Remove existing roof system down to the decking", price: 1360 },
      {
        label: "Install GAF Timberline® HDZ (50 Year Architectural)",
        price: 5400,
      },
      { label: "Install Synthetic Felt", price: 180 },
      { label: "Install Ice & Water Shield", price: 255 },
      { label: "Install Starter Strip", price: 315 },
      { label: "Install Hip/Ridge Cap", price: 370 },
      { label: "Dump Charge", price: 550 },
    ] as { label: string; price: number | null }[],
    /** Sum of line items: $8,430.00 */
    baseTotal: 8430,
    /** All off by default: customers start at the real base and watch the
     *  total climb as they flip upgrades themselves, that's the lesson. */
    upgrades: [
      { label: "Install Drip Edge", price: 180, defaultOn: false },
      { label: "Install Ridge Vent", price: 420, defaultOn: false },
      { label: "Gutter Replacement", price: 1850, defaultOn: false },
      { label: "Leaf Guard", price: 850, defaultOn: false },
    ],
    totalLabel: "Your total: no hidden fees",
    disclaimer:
      "Example pricing for a typical project. Your proposal is priced line by line from your actual roof.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 8c. Manufacturer partnerships, factual wording only (Phase 4 §12)  */
/* ------------------------------------------------------------------ */

/**
 * Manufacturer credentials, and the line between a credential and a product.
 *
 * THE TITLE CHANGED WHEN CERTAINTEED ARRIVED (2026-09-24). It read "Certified
 * on GAF. Experienced across brands." That was accurate when GAF was the only
 * certification. It is now two certifications from two manufacturers, and a
 * heading naming one of them undersells the other.
 *
 * The three-way distinction is the point of this section and must survive any
 * future edit:
 *   GAF         - certified us       -> "Certified Contractor", linked record
 *   CertainTeed - certified us       -> "ShingleMaster", linked record
 *   Owens Corning - we install it    -> "Product installer", NO link, because
 *                                       there is no credential to verify
 */
export const manufacturerSection = {
  eyebrow: "Manufacturer credentials",
  title: "Certified by GAF and CertainTeed.",
  items: [
    {
      name: "GAF",
      claim: "Certified Contractor",
      text: "North America's largest shingle manufacturer, and the system we install most. Our certification is on GAF's own contractor record, not just on this page.",
      href: siteConfig.links.gafProfile,
      cta: "Verify on gaf.com",
    },
    {
      name: "CertainTeed",
      claim: "ShingleMaster",
      text: "CertainTeed's credential for shingle installers, earned on their training and installation standards. Their public profile carries the same record.",
      href: siteConfig.links.certainteedProfile,
      cta: "Verify on certainteed.com",
    },
    {
      name: "Owens Corning",
      /** Product installer ONLY: never "Preferred/Platinum Contractor" */
      claim: "Product installer",
      text: "We install Owens Corning shingle products when their style, color, or availability fits your project best. This is a product line we install, not a certification we hold.",
      href: null,
      cta: null,
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 9. Financing, no invented rates or terms                           */
/* ------------------------------------------------------------------ */

export const financingSection = {
  eyebrow: "Financing",
  title: "A new roof, on a budget that works",
  description:
    "A roof rarely fails at a convenient time. Financing through our partner GoodLeap keeps the project moving, with $0 down options available.",
  icon: Banknote,
  /** Simple, trustworthy framing, no invented rates or terms */
  points: [
    {
      title: "Apply online in minutes",
      text: "A short application, right from your phone.",
    },
    {
      title: "See your real terms",
      text: "GoodLeap shows you the plans you qualify for, directly.",
    },
    {
      title: "No obligation",
      text: "Get the numbers first. Decide when you're ready.",
    },
  ],
  /** GoodLeap application (owner-supplied 2026-07-04), external */
  cta: {
    label: "Apply for financing",
    href: siteConfig.links.financing,
    external: true,
  },
  secondaryCta: {
    label: "Learn how it works",
    href: "/financing",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 10. Service area                                                    */
/* ------------------------------------------------------------------ */

export const serviceAreaSection = {
  eyebrow: "Service area",
  title: "Hattiesburg-based. Region-wide reach.",
  description:
    "Proudly serving Mississippi within about two hours of Hattiesburg, from the Pine Belt to the Gulf Coast.",
  hubsLabel: "Regional hubs",
  communitiesLabel: "And the communities around them",
  hubCta: { label: "See all service areas", href: "/service-areas" },
} as const;

/* ------------------------------------------------------------------ */
/* 11. Reviews / trust badges: real marks, no fabricated quotes       */
/* ------------------------------------------------------------------ */

export const reviewsSection = {
  eyebrow: "Reputation",
  title: "Don't take our word for it",
  /*
   * The sentence has to describe what is actually in the row below it. It
   * listed three things when there were four badges, and the row is now seven
   * and no longer all of one kind: two manufacturer certifications, an
   * accreditation, two state licences, a chamber membership and a social
   * profile. "Every badge links to the official record" was the claim that
   * broke first, since LinkedIn is a profile we publish, not a record
   * somebody else keeps about us.
   */
  description:
    "Check us yourself. Every card below links straight to the source: our Google reviews, our GAF and CertainTeed certifications, our BBB accreditation, both Mississippi State Board of Contractors licenses, our chamber membership, and our company LinkedIn page.",
  /** Live Google Business Profile (owner-supplied 2026-07-04), external */
  googleCta: {
    label: "Read our Google reviews",
    href: siteConfig.links.googleBusiness,
    external: true,
  },
  /**
   * Verification badges, each links to its official record. No unverified
   * rating graphics (brandAssets.trust rules); the Google G is rendered as
   * an inline SVG, not the do-not-display star artwork.
   */
  badges: [
    {
      /*
       * Google Verified lives on this card rather than getting its own,
       * because it and the reviews are the same profile. The status is
       * Verified, NOT Guaranteed: Verified is a background and licence check,
       * Guaranteed adds a Google-backed money-back promise we do not carry,
       * and the subtitle must never drift back into implying one.
       */
      key: "google",
      title: "Google Verified",
      subtitle: "Verified through Google Local Services, 5-star rated",
      href: siteConfig.links.googleBusiness,
      cta: "Read our reviews",
    },
    {
      key: "gaf",
      title: "GAF Certified",
      subtitle: "Certified contractor for GAF systems",
      href: siteConfig.links.gafProfile,
      cta: "Verify on gaf.com",
    },
    {
      // Added 2026-09-24. Two manufacturer certifications now, from two
      // different manufacturers, each with a public record on that
      // manufacturer's own site. "Our primary manufacturer certification" on
      // the GAF badge above was retired at the same time: it stopped being
      // true the moment a second one existed.
      key: "certainteed",
      title: "CertainTeed ShingleMaster",
      subtitle: "ShingleMaster certified by CertainTeed",
      href: siteConfig.links.certainteedProfile,
      cta: "Verify on certainteed.com",
    },
    {
      key: "bbb",
      title: "BBB Accredited",
      subtitle: "A+ rating with the Better Business Bureau",
      href: siteConfig.links.bbbProfile,
      cta: "Verify on bbb.org",
    },
    {
      // Sixth card, added 2026-09-24. Five badges left a hole in the
      // two-column phone grid; six fill it, and the membership belongs in a
      // row of checkable records anyway: theadp.com publishes it, we don't.
      key: "adp",
      title: "ADP Member",
      subtitle: "Area Development Partnership, Greater Hattiesburg",
      href: siteConfig.links.adpMember,
      cta: "Verify on theadp.com",
    },
    {
      /*
       * Two cards that are NOT credentials, and the copy has to keep them
       * apart from the ones that are. ADP is a business membership; nobody
       * inspected a roof to grant it. LinkedIn is our own page. Neither says
       * anything about workmanship and neither is written as though it does.
       */
      key: "linkedin",
      title: "Company LinkedIn",
      subtitle: "Our official company profile on LinkedIn",
      href: siteConfig.socials.linkedin,
      cta: "View our profile",
    },
    {
      key: "msboc",
      title: "MSBOC Licensed",
      // Both numbers, because both exist and a building owner scanning this
      // strip is looking for the commercial one. The badge links to the
      // residential record; /licenses carries both with a verification link
      // each, which is why the call to action points there rather than at one
      // of the two registers.
      subtitle: `Residential #${siteConfig.license} · Commercial #${siteConfig.licenseCommercial} · Mississippi State Board of Contractors`,
      href: "/licenses",
      cta: "See both licenses",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 12. FAQ: general, factual answers; no invented stats or terms      */
/* ------------------------------------------------------------------ */

export interface HomeFaq {
  question: string;
  answer: string;
}

export const homeFaqs: HomeFaq[] = [
  {
    question: "Do you handle both residential and commercial roofing?",
    answer:
      "Yes. They're our two core divisions. Residential covers shingle and metal roofing, replacement, repair, gutters, and ventilation. Commercial covers TPO, EPDM, modified bitumen, coatings, metal systems, and planned maintenance programs.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We're based in Hattiesburg and serve a roughly 2-hour radius across Mississippi: including Petal, Laurel, Columbia, Picayune, the Gulf Coast, Jackson, Meridian, and the communities in between.",
  },
  {
    question: "Do you help with insurance claims after storm damage?",
    answer:
      "Yes. We inspect and document the damage thoroughly, provide the reports and photos your insurance company needs, and can meet your adjuster on site. The claim decision always rests with your insurer, but you won't navigate the process alone.",
  },
  {
    question: "Should I choose metal or shingle roofing?",
    answer:
      "It depends on your structure, budget, and goals. Architectural shingles are the most cost-effective option up front; metal systems typically cost more initially but offer a longer service life and excellent wind performance. We install both, so our recommendation is based on your roof, not on what we happen to sell.",
  },
  {
    question: "How long does a roof replacement take?",
    answer:
      "Most residential replacements are completed in one to two days once materials arrive, depending on the size and complexity of the roof. Commercial projects vary with the system and square footage. We provide a schedule with every estimate.",
  },
  {
    question: "Is the inspection really free?",
    answer:
      "Yes. We inspect your roof, document what we find, and give you a straight answer, including when the right answer is a small repair instead of a replacement.",
  },
  /*
   * THE CREDENTIALS QUESTION, IN ONE ANSWER (added 2026-09-24).
   *
   * "Is this roofer licensed, insured and certified" is the single most asked
   * question about a contractor and the one an answer engine is most likely
   * to be asked on our behalf. It was answerable from four different pages
   * and stated in full on none of them, which is how an AI ends up quoting
   * half of it. One visible answer, on the homepage, carrying every
   * credential with the two licence numbers spelled out.
   */
  {
    question: "Is Southeast Roofing licensed, insured and certified?",
    answer: `Yes to all three, and every part of it is checkable. We hold Mississippi State Board of Contractors residential license #${siteConfig.license} and commercial Certificate of Responsibility #${siteConfig.licenseCommercial}, we are fully insured and bonded, and we are certified by two shingle manufacturers: GAF Certified Contractor and CertainTeed ShingleMaster. We are also BBB Accredited with an A+ rating and a member of the Area Development Partnership. Our licenses page links to the public record behind each one.`,
  },
  {
    question: "Does Southeast Roofing offer financing?",
    answer:
      "Yes. We offer financing through GoodLeap, including $0 down plans. You apply online in a few minutes and see the real terms you qualify for before you commit to anything.",
  },
];

/* ------------------------------------------------------------------ */
/* 13. Final CTA                                                       */
/* ------------------------------------------------------------------ */

export const finalCta = {
  title: "Ready for a roof you don't have to think about?",
  description:
    "Schedule a free inspection or get an instant estimate right now. $0 down financing available through GoodLeap.",
  primary: { label: "Schedule Free Inspection", href: "/free-inspection" },
  /**
   * OUR instant estimator, and no longer external.
   *
   * The flag said `external: true` from when this pointed at Roofr. Bringing
   * the estimator in house changed the href and left the flag behind, so the
   * homepage's main secondary CTA sent visitors to our own page in a new tab.
   */
  estimate: {
    label: "Get an Instant Estimate",
    href: siteConfig.links.instantEstimate,
    external: false,
  },
  /** GoodLeap financing application, external */
  financing: {
    label: "Apply for Financing",
    href: siteConfig.links.financing,
    external: true,
  },
  commercial: {
    label: "Commercial? Request a consultation",
    href: "/commercial/request-consultation",
  },
  icon: CloudLightning,
} as const;
