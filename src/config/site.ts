/**
 * Single source of truth for the canonical host, company data (NAP), and
 * site-wide feature flags. Consumed by metadata, JSON-LD schema, the footer,
 * and contact surfaces so name/address/phone never drift (PRD §1, §9.2).
 *
 * Values that are `null` are outstanding [NEEDS] items from docs/PRD.md §12.
 * Components must render honest placeholders when a value is null — never
 * invent phone numbers, license numbers, stats, or credentials.
 */

export const siteConfig = {
  name: "Southeast Roofing",
  /** [NEEDS: confirm exact legal entity name] */
  legalName: "Southeast Roofing LLC",

  /**
   * Canonical host. southeastroofing.llc is the primary production domain;
   * roofs.ms 301-redirects to it (PRD §1). Never hardcode a domain anywhere
   * else — flip NEXT_PUBLIC_SITE_URL if the owner ever changes strategy.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://southeastroofing.llc",

  tagline: "Premium residential & commercial roofing in South Mississippi",
  description:
    "Southeast Roofing is a Hattiesburg, Mississippi roofing contractor serving residential and commercial customers across South Mississippi — roof replacement, repair, metal roofing, storm damage, and insurance claim assistance.",

  phone: {
    /** Office number (owner-supplied 2026-07-04) */
    display: "(601) 549-3783",
    tel: "+16015493783" as string | null,
  },
  /** Office email (owner-supplied 2026-07-04) */
  email: "office@southeastroofing.llc" as string | null,

  address: {
    /** Office address (owner-supplied 2026-07-04) */
    streetAddress: "6668 US-98, Suite F" as string | null,
    addressLocality: "Hattiesburg",
    addressRegion: "MS",
    postalCode: "39402" as string | null,
    addressCountry: "US",
  },

  /**
   * Official external profiles & tools (owner-supplied 2026-07-04).
   * GAF and BBB URLs are verifiable proof of the certifications we claim.
   */
  links: {
    googleBusiness: "https://share.google/8jfoy7nN9HyddPKDb",
    bbbProfile:
      "https://www.bbb.org/us/ms/hattiesburg/profile/roofing-contractors/southeast-roofing-llc-0523-235902892",
    gafProfile:
      "https://www.gaf.com/en-us/roofing-contractors/residential/usa/ms/hattiesburg/southeast-roofing-1147340",
    /** GoodLeap financing application */
    financing:
      "https://www.goodleap.dev/southeastroofingllc/1b96fc28-5e63-477c-8074-0bec137f3154",
    /** Roofr instant estimator */
    instantEstimate:
      "https://app.roofr.com/instant-estimator/70b6fe06-8fb3-43ee-83d5-c27f43145413/SoutheastRoofing",
  },
  /** Hattiesburg, MS city center — refine when street address is confirmed */
  geo: { latitude: 31.3271, longitude: -89.2903 },

  /** [NEEDS: business hours + real 24/7 emergency availability] */
  hours: null as string | null,
  /** [NEEDS: MS contractor license number in its public form] */
  license: null as string | null,
  /** [NEEDS: real founding year] */
  foundingYear: null as number | null,
  /** Schema sameAs — official profiles (GBP, BBB, GAF). [NEEDS: social media URLs] */
  socialProfiles: [
    "https://share.google/8jfoy7nN9HyddPKDb",
    "https://www.bbb.org/us/ms/hattiesburg/profile/roofing-contractors/southeast-roofing-llc-0523-235902892",
    "https://www.gaf.com/en-us/roofing-contractors/residential/usa/ms/hattiesburg/southeast-roofing-1147340",
  ] as string[],

  /**
   * Launch service area (PRD §5). Tiers drive content depth on city pages.
   * Coverage is a full 2-hour radius around Hattiesburg (owner-confirmed
   * 2026-07-03) — Jackson, Meridian, the Gulf Coast, and towns between.
   */
  serviceArea: [
    { city: "Hattiesburg", tier: 1 },
    { city: "Petal", tier: 1 },
    { city: "Laurel", tier: 1 },
    { city: "Gulfport", tier: 1 },
    { city: "Biloxi", tier: 1 },
    { city: "Purvis", tier: 2 },
    { city: "Sumrall", tier: 2 },
    { city: "Columbia", tier: 2 },
    { city: "Ellisville", tier: 2 },
    { city: "Richton", tier: 2 },
    { city: "Seminary", tier: 2 },
    { city: "Poplarville", tier: 2 },
    { city: "Picayune", tier: 2 },
    { city: "Diamondhead", tier: 2 },
    { city: "Jackson", tier: 2 },
    { city: "Meridian", tier: 2 },
  ],

  /** Site-wide feature flags (storm banner etc. — later mirrored in Sanity siteFlags) */
  flags: {
    emergencyBanner: false,
    emergencyBannerMessage:
      "Storm damage? We're responding to emergency calls now.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
