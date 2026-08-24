/**
 * Single source of truth for the canonical host, company data (NAP), and
 * site-wide facts. Consumed by metadata, JSON-LD schema, the header, the
 * footer, and every contact surface so name/address/phone never drift.
 *
 * Values that are `null` are outstanding [NEEDS] items. Components must
 * render honest placeholders when a value is null: never invent phone
 * numbers, license numbers, stats, or credentials. This rule is inherited
 * from the Southeast Roofing codebase and it is not optional.
 */

export const siteConfig = {
  name: "Southeast Lights",

  /**
   * IMPORTANT, and easy to get wrong: Southeast Lights is NOT a subsidiary.
   * It is a registered fictitious name (d/b/a), business ID 1412589, of
   * Southeast Roofing LLC. There is ONE legal entity here operating under
   * two names. Never describe the relationship as parent/subsidiary in copy
   * or in schema. The correct phrasings are "a division of Southeast Roofing
   * LLC" or "Southeast Roofing LLC d/b/a Southeast Lights".
   *
   * This matters commercially, not just legally: the licence, the insurance,
   * and the crews are literally the same ones. That is a stronger claim than
   * borrowed credibility, so say it plainly.
   */
  legalName: "Southeast Roofing LLC",
  dbaRegistrationId: "1412589",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://southeastlights.llc",

  tagline: "Year-round lighting for South Mississippi",
  description:
    "Southeast Lights is a Hattiesburg, Mississippi lighting company: custom-cut C9 holiday lighting on a full-service rental plan, and Jellyfish permanent architectural lighting. A division of Southeast Roofing LLC.",

  /** Owner-supplied 2026-08-24. Distinct from the roofing line by necessity. */
  phone: {
    display: "(601) 795-7973",
    tel: "+16017957973" as string | null,
  },
  email: "office@southeastlights.llc" as string | null,

  /**
   * Owner-confirmed 2026-08-24. Deliberately NOT the roofing office at
   * 6668 US-98: Google will not verify a second Business Profile at an
   * address that already has one, so this location is what makes the
   * Southeast Lights profile verifiable. Publish THIS address everywhere
   * (footer, contact, schema, directories) so the NAP matches the profile
   * Google has actually verified.
   */
  address: {
    streetAddress: "3705 Mable St" as string | null,
    addressLocality: "Hattiesburg",
    addressRegion: "MS",
    postalCode: "39401" as string | null,
    addressCountry: "US",
  },

  /**
   * [NEEDS: exact lat/lng for 3705 Mable St]. Left null on purpose rather
   * than guessed. A wrong pin on a local business is worse than no pin.
   */
  geo: null as { latitude: number; longitude: number } | null,

  /** Owner-supplied 2026-08-24, verified handles (no `.llc` suffix here,
   *  unlike the roofing accounts). */
  socials: {
    facebook: "https://www.facebook.com/southeastlights",
    instagram: "https://www.instagram.com/southeastlights",
    tiktok: "https://www.tiktok.com/@southeastlights",
  },

  /**
   * The Google Business Profile for Southeast Lights (its own listing,
   * separate from the roofing one).
   *
   * placeId was transcribed from an owner screenshot on 2026-08-24 and has
   * NOT yet been round-tripped against the Places API. Verify before trusting
   * it in production: I/l/1 and O/0 are exactly the characters that go wrong
   * when reading a photo of a screen.
   */
  google: {
    knowledgeGraphId: "/g/11y0033xkf",
    placeId: "ChIJI9TLaQ7mYOARsNCBDLhzt8E",
    placeIdVerified: false,
    /** Owner-reported 2026-08-24. */
    reviewCount: 12,
    rating: 5.0,
  },

  /**
   * Credentials belong to Southeast Roofing LLC. Because that is the same
   * legal entity, they genuinely cover this work, but they must always be
   * ATTRIBUTED to the roofing name rather than implied as Southeast Lights'
   * own. Two hard rules, both owner-relevant:
   *
   *   1. NO GAF anywhere on this site. GAF certifies shingle installation.
   *      On a lighting site it reads as a credential for work it does not
   *      cover.
   *   2. The BBB accreditation is filed under "Southeast Roofing LLC" and
   *      does not list the d/b/a, so it renders with that attribution or
   *      not at all.
   */
  parent: {
    name: "Southeast Roofing LLC",
    url: "https://southeastroofing.llc",
    /** MS State Board of Contractors licence, held by the parent name. */
    license: "R22245" as string | null,
    bbb: {
      rating: "A+",
      attributedTo: "Southeast Roofing LLC",
      profile:
        "https://www.bbb.org/us/ms/hattiesburg/profile/roofing-contractors/southeast-roofing-llc-0523-235902892",
    },
  },

  /**
   * [NEEDS] from the owner, tracked here so nothing ships as an invention:
   *   - jellyfishAuthorizedDealer: gates the dealer badge and their assets
   *   - workmanshipWarranty: our install warranty, distinct from Jellyfish's
   *     product warranty
   *   - season dates: install window, booking cutoff, takedown window
   *   - foundingYear for Southeast Lights specifically
   */
  jellyfishAuthorizedDealer: null as boolean | null,
  workmanshipWarranty: null as string | null,
  foundingYear: null as number | null,
} as const;

export type SiteConfig = typeof siteConfig;
