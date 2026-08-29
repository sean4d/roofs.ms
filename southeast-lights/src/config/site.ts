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
   * This matters commercially, not just legally: the license, the insurance,
   * and the crews are literally the same ones. That is a stronger claim than
   * borrowed credibility, so say it plainly.
   */
  legalName: "Southeast Roofing LLC",
  dbaRegistrationId: "1412589",

  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://southeastlights.llc",

  tagline: "Year-round lighting for South Mississippi",
  description:
    "Southeast Lights is a Hattiesburg, Mississippi lighting company: custom-cut C9 holiday lighting on a full-service rental plan, and permanent architectural lighting installed year-round. A division of Southeast Roofing LLC.",

  /**
   * Owner-supplied 2026-08-24. Distinct from the roofing line by necessity:
   * Google will not verify a second Business Profile on an existing number.
   * This line accepts SMS, which is why Text is a first-class action in the
   * mobile bar alongside Quote and Call.
   */
  phone: {
    display: "(601) 795-7973",
    tel: "+16017957973" as string | null,
    sms: "+16017957973" as string | null,
    acceptsText: true,
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
   * Deliberately NOT copied from the roofing config: that pin is the roofing
   * office on a different street, and this profile is verified at Mable St.
   */
  /**
   * Owner-supplied 2026-08-29, pin dropped on the building itself. Six
   * decimals is roughly ten centimetres; the extra digits Google Maps hands
   * you are noise and make the schema look machine-generated.
   */
  geo: { latitude: 31.330668, longitude: -89.345288 } as {
    latitude: number;
    longitude: number;
  } | null,

  /**
   * Business hours. Owner-confirmed 2026-08-26 as identical to Southeast
   * Roofing: office staffed Monday to Friday, 8 to 5, closed weekends. One
   * legal entity, one office, one set of hours.
   *
   * No after-hours emergency claim here, unlike the roofing config. Roofing
   * takes storm calls at 2am; a light that has gone out is a next-morning
   * problem and promising otherwise would be a promise to keep in December.
   *
   * `spec` feeds schema.org openingHoursSpecification. Weekend days omitted
   * means closed, which is what Google reads.
   */
  hours: {
    display: "Monday to Friday, 8 AM to 5 PM",
    note: "In-season, crews are out past dark. Messages left overnight are answered the next morning.",
    spec: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
        opens: "08:00",
        closes: "17:00",
      },
    ],
  },

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
    profileUrl: "https://share.google/ZwdOsO2HSmt8I2ugc",
    /**
     * Rating and review COUNT deliberately do not live here. They are owned
     * by config/reviews.ts (GOOGLE_AGGREGATE) so there is exactly one place
     * to update them and exactly one source for rating schema.
     */
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
    /** MS State Board of Contractors license, held by the parent name. */
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
   *   - permanentLightingBrand: null until a dealership is actually secured.
   *     Owner confirmed 2026-08-24 they are NOT an authorized dealer for any
   *     permanent-lighting manufacturer, so the permanent pages stay
   *     unbranded. See the note in config/pricing.ts.
   *   - season dates: install window, booking cutoff, takedown window
   *   - foundingYear for Southeast Lights specifically
   */
  permanentLightingBrand: null as string | null,

  /**
   * Response expectation shown on forms and thank-you screens. Deliberately
   * "next business day" rather than a same-day promise we cannot always keep.
   */
  responseTime: "We typically respond by the next business day.",

  /** Payment terms, shown on commercial pages. Online payment is not live. */
  payment: {
    accepted: ["Credit card", "ACH", "Check"],
    deposit: "50% deposit to reserve your installation date",
    balance: "Balance due on completion of installation",
    /** No provider connected. Do not enable without owner approval. */
    onlinePaymentsEnabled: false,
  },
  /**
   * Warranty. Owner-confirmed 2026-08-26, and the two halves of the business
   * are genuinely different promises rather than one policy worded twice.
   *
   * Seasonal work carries no workmanship warranty because the concept does
   * not apply: the lights are ours, they come down in January, and we
   * maintain them the whole time they are up. That is a stronger promise than
   * a warranty, not a weaker one, so it is stated as coverage rather than
   * apologised for.
   *
   * Permanent lighting is the customer's property and stays on the building
   * for years, so it needs a real term. Five years on our workmanship. There
   * is no manufacturer warranty behind it (see the dealer note in
   * config/pricing.ts), which makes this the entire guarantee.
   */
  warranty: {
    seasonal: {
      headline: "Covered for the whole season, not warrantied afterwards",
      body: "Seasonal displays do not carry a workmanship warranty, because they do not need one. The lights are ours. We maintain them from the day they go up until the day we take them down, replace failed bulbs at no charge, and there is no service-call fee. Nothing is left on your building for a warranty to cover.",
    },
    permanent: {
      years: 5,
      headline: "Five-year workmanship warranty",
      body: "Permanent lighting is yours and it stays on the building, so our installation is warrantied for five years. That covers the work: mounting, channel, terminations and the way the run is fixed to the structure.",
    },
  },
  /** Kept for compatibility. Use `warranty` above. */
  workmanshipWarranty: null as string | null,
  /** Owner-supplied 2026-08-29. */
  foundingYear: 2023 as number | null,
} as const;

export type SiteConfig = typeof siteConfig;
