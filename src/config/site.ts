/**
 * Single source of truth for the canonical host, company data (NAP), and
 * site-wide feature flags. Consumed by metadata, JSON-LD schema, the footer,
 * and contact surfaces so name/address/phone never drift (PRD §1, §9.2).
 *
 * Values that are `null` are outstanding [NEEDS] items from docs/PRD.md §12.
 * Components must render honest placeholders when a value is null: never
 * invent phone numbers, license numbers, stats, or credentials.
 */

export const siteConfig = {
  name: "Southeast Roofing",
  /** [NEEDS: confirm exact legal entity name] */
  legalName: "Southeast Roofing LLC",

  /**
   * Names this business used to trade under.
   *
   * The Google profile carries reviews going back to the old name, and a few
   * reviewers wrote it into their text. Those reviews are real and they stay
   * on the Google profile, but a visitor reading "The Roofing Society did an
   * awesome job" on southeastroofing.llc has no way to know that is us, and
   * it reads either as a mistake or as someone else's review borrowed for
   * our site. So reviews that name a former identity are not displayed here
   * (owner, 2026-09-10). Nothing is edited, quoted out of context, or
   * reattributed; the review is simply left where it already lives.
   *
   * Matched case-insensitively against review text and the owner's reply.
   */
  formerNames: ["Roofing Society"] as string[],

  /**
   * Canonical host. southeastroofing.llc is the primary production domain;
   * roofs.ms 301-redirects to it (PRD §1). Never hardcode a domain anywhere
   * else: flip NEXT_PUBLIC_SITE_URL if the owner ever changes strategy.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://southeastroofing.llc",

  tagline: "Premium residential & commercial roofing in South Mississippi",
  description:
    "Southeast Roofing LLC is a Mississippi licensed residential and commercial roofing contractor based in Hattiesburg, serving South Mississippi and the Pine Belt: roof replacement, roof repair, metal roofing, TPO and flat roofing, roof coatings, storm damage and insurance claim assistance.",

  /**
   * How the business describes itself in one line, everywhere a descriptor is
   * needed. One string so the footer, the licence page, llms.txt and the
   * schema cannot drift into three different versions of what this company is.
   */
  descriptor:
    "Mississippi Licensed Residential & Commercial Roofing Contractor",

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
    /**
     * Google Business Profile, as the Maps listing (owner-supplied
     * 2026-09-25, verified the same day).
     *
     * REPLACED https://share.google/8jfoy7nN9HyddPKDb, which was a dead end.
     * Followed, that one 302s to https://www.google.com/share.google?q=...,
     * a generic Google endpoint rather than this business. It was the target
     * of six customer-facing links, so "View our profile" sent people
     * nowhere useful, and it was the reason there was no Google entry in
     * sameAs.
     *
     * This URL resolves to /maps/place/Southeast+Roofing/ at
     * 31.3156712,-89.4293482, which matches siteConfig.geo to five decimal
     * places. Same business, confirmed rather than assumed.
     *
     * The derived canonical form is https://maps.google.com/?cid=
     * 10166653963144485022 (CID 0x8d1735ea0b8b589e from the resolved place
     * data; it returns 200). The owner-supplied share link is what ships,
     * since it is the one they gave us and it demonstrably resolves to the
     * named listing. The CID is recorded here so nobody has to re-derive it.
     */
    googleBusiness: "https://maps.app.goo.gl/yHn4p2F5yeVSs35EA",
    /**
     * Direct "write a review" deep link (owner-supplied 2026-07-05), opens
     * the Google review dialog straight away, no extra taps.
     *
     * Kept separate from googleBusiness on purpose: this one is an action
     * (leave a review), that one is the listing. Do not collapse them.
     */
    googleReview: "https://g.page/r/CZ5YiwvqNReNEBM/review",
    /** Google Calendar appointment-schedule booking page (owner-supplied 2026-07-06) */
    booking: "https://calendar.app.google/NmeXnyWoE8hmU27Z9",
    bbbProfile:
      "https://www.bbb.org/us/ms/hattiesburg/profile/roofing-contractors/southeast-roofing-llc-0523-235902892",
    /**
     * Public MSBOC record for RESIDENTIAL licence R22245 (owner-supplied
     * 2026-07-30).
     *
     * THIS COMMENT USED TO SAY THE OPPOSITE and was right at the time. It
     * warned never to call this a "residential license", because MSBOC had
     * only published a residential index and describing the link narrowly
     * would have told search engines the company was residential-only.
     *
     * That is no longer the situation. As of 2026-09-09 there are two real
     * records, this one and `msbocCommercialLicense` below, and naming each
     * for what it is has become the accurate thing to do rather than the
     * limiting one. The rule the old comment was protecting still stands: no
     * page may show one licence without the other.
     */
    msbocLicense:
      "https://search.msboc.us/Detail.cfm?ContractorID=53298&ContractorType=Residential&varDataSource=BOCRes&Advanced=1",
    /**
     * Public MSBOC record for the COMMERCIAL Certificate of Responsibility
     * 27720-SC (owner-supplied 2026-09-09).
     *
     * A different index from the residential one above, which is why the same
     * company carries a different ContractorID in each: BOC is the commercial
     * register, BOCRes the residential one. Being a government record for this
     * exact business makes it a legitimate `sameAs` for the organisation as
     * well as the link a building owner clicks to check us.
     */
    msbocCommercialLicense:
      "https://search.msboc.us/Detail.cfm?ContractorID=36955&ContractorType=Commercial&varDataSource=BOC",
    /** MSBOC's own FAQ, the source for every licensing threshold we state. */
    msbocFaq: "https://www.msboc.us/general-info/frequently-asked-questions/",
    /** The board's public contractor search, for "check any roofer" advice. */
    msbocSearch: "https://search.msboc.us/",
    gafProfile:
      "https://www.gaf.com/en-us/roofing-contractors/residential/usa/ms/hattiesburg/southeast-roofing-1147340",
    /**
     * CertainTeed ShingleMaster public profile (credential obtained 2026-09).
     *
     * ======================================================================
     * THIS IS THE ONE PLACE THE CERTAINTEED URL IS DEFINED. Change it here
     * and every badge, credential card, footer link and sameAs entry follows.
     * ======================================================================
     *
     * The owner supplied https://www.certainteed.com/node/407251 and said the
     * SoutheastRoofingLLC alias was still being processed. Verified
     * 2026-09-24: the node URL now 301-redirects to the alias below, and the
     * page title reads "Southeast Roofing LLC | CertainTeed". The alias is
     * live, so we point at it directly rather than through a redirect.
     *
     * Note the path shape: /profiles/SoutheastRoofingLLC. A bare
     * /SoutheastRoofingLLC returns 404, so do not "simplify" this URL.
     */
    certainteedProfile:
      "https://www.certainteed.com/profiles/SoutheastRoofingLLC",
    /**
     * Area Development Partnership member profile, Greater Hattiesburg's
     * chamber of commerce (owner-supplied 2026-09-24, verified 200).
     *
     * The branded members.theadp.com host is preferred over the raw
     * ChamberMaster mirror at
     * area-development-partnership.chambermaster.com/list/member/southeast-roofing-llc-9201
     * (member ID 9201). Both resolve to the same listing; only one belongs in
     * sameAs, because declaring two URLs for one profile adds noise rather
     * than authority.
     */
    adpMember:
      "https://members.theadp.com/list/member/southeast-roofing-llc-9201",
    /** GoodLeap financing application */
    financing:
      "https://www.goodleap.dev/southeastroofingllc/1b96fc28-5e63-477c-8074-0bec137f3154",
    /**
     * OUR instant estimator, not Roofr's.
     *
     * This used to point at app.roofr.com, which meant every "Instant
     * Estimate" button on the site handed the highest-intent visitor we get to
     * another company's domain, branding and data. It is now our own page,
     * running our own measurement engine, and the lead lands in our pipeline
     * before it is forwarded to Roofr as a job.
     *
     * Every button follows this one constant, so there is nothing else to
     * change if it ever moves again.
     */
    instantEstimate: "/instant-estimate",
  },
  /**
   * Trade partners who perform work under Southeast Roofing as
   * subcontractors. The customer always contracts, schedules, and
   * communicates with Southeast Roofing; we stay responsible for the
   * customer relationship, the roof evaluation, coordination, and scope.
   */
  partners: {
    /**
     * Exterior-cleaning subcontractor for roof washing (owner-confirmed
     * 2026-07-30; URL owner-supplied 2026-07-31).
     *
     * PLACEMENT RULE (owner directive 2026-07-31): this partner is credited
     * in the roof-washing BLOG POST ONLY. Service pages are for services,
     * FAQs, and knowledge. They do not name or promote this company. Do
     * not reintroduce a "who does the work" section on any service page.
     */
    exteriorCleaning: {
      name: "South Mississippi Power Washing",
      url: "https://southmspowerwashing.com",
    },
  },

  /**
   * Social profiles (owner-supplied 2026-07-04), shown in the header top
   * bar and included in schema sameAs. Nextdoor URL stripped of share
   * tracking params.
   */
  socials: {
    facebook: "https://www.facebook.com/southeastroofing.llc",
    instagram: "https://www.instagram.com/southeastroofing.llc",
    tiktok: "https://www.tiktok.com/@southeastroofing.llc",
    /**
     * LinkedIn (owner-supplied 2026-09-24).
     *
     * This is an /in/ profile URL rather than /company/, which is how the
     * account was created. It is the account the owner gave us and it is the
     * one that goes in sameAs; if a /company/ page is created later, change
     * it here and every icon row plus the identity graph follows.
     */
    linkedin: "https://www.linkedin.com/in/southeast-roofing-1b84b3367",
    nextdoor: "https://nextdoor.com/pages/southeast-roofing-hattiesburg-ms/",
  },

  /** Exact office location, 6668 US-98 Suite F (owner-supplied 2026-07-07). */
  geo: { latitude: 31.315671890677386, longitude: -89.42934598516973 },

  /**
   * Business hours (owner-confirmed 2026-07-07): office staffed Monday–Friday
   * 8 AM–5 PM, closed weekends, matching the storefront door and every
   * directory listing (Yelp, Angi, etc.). After-hours storm/emergency calls
   * are still taken via the emergency line, so `note` keeps that promise
   * without claiming the office is staffed round the clock. `spec` feeds
   * schema.org openingHoursSpecification (weekend days omitted = closed).
   */
  hours: {
    display: "Monday–Friday, 8 AM – 5 PM",
    note: "Storm or leak after hours? Our emergency line is open 24/7.",
    spec: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
        opens: "08:00",
        closes: "17:00",
      },
    ],
  },
  /**
   * MSBOC residential licence (owner-supplied 2026-07-04).
   *
   * `license` stays the RESIDENTIAL number because it is the one that has been
   * on this site since launch, is indexed against it, and is what every
   * existing reference resolves to. Renaming the field would have been tidier
   * and would have quietly repointed a dozen call sites at a different number.
   */
  license: "R22245" as string | null,

  /**
   * MSBOC commercial Certificate of Responsibility (owner-supplied
   * 2026-09-09, after passing the Roofing/Sheet Metal/Siding trade exam).
   *
   * A SEPARATE CREDENTIAL, NOT A REPLACEMENT. Mississippi issues residential
   * licensure and a commercial Certificate of Responsibility through two
   * different indexes with two different record IDs, and Southeast Roofing now
   * holds both. Anywhere one of these appears without the other, the site is
   * telling half the truth about what the company is allowed to build.
   */
  licenseCommercial: "27720-SC" as string | null,
  /** Founding year (BBB: business started & incorporated 9/25/2023) */
  foundingYear: 2023 as number | null,

  /**
   * Trust facts (owner-confirmed 2026-07-04, Phase 4 directive). These are
   * the owner's stated, factual credentials, keep wording exact and update
   * here first if any changes.
   */
  trustFacts: {
    googleRating: "5-star Google rating",
    /**
     * GOOGLE VERIFIED, NOT GOOGLE GUARANTEED (owner-confirmed 2026-09-25).
     *
     * These are two different Google Local Services statuses and the site was
     * claiming the wrong one. Google Guaranteed carries a money-back
     * reimbursement backed by Google; Google Verified is a background and
     * licence check with no reimbursement attached. Advertising the former
     * while holding the latter promises a customer a refund from Google that
     * Google will not pay.
     *
     * The key name stays `googleGuaranteed` deliberately: renaming it would
     * touch a dozen call sites for no benefit and risk missing one, which is
     * exactly how half a rename ends up shipping. The VALUE is what renders.
     */
    googleGuaranteed: "Google Verified",
    /** Context line, for anywhere the status needs explaining rather than listing. */
    googleVerifiedDetail: "Google Verified through Google Local Services",
    bbbRating: "BBB Accredited: A+ rating",
    /**
     * Manufacturer credentials. TWO of them now, and the distinction between
     * them and Owens Corning matters (owner directive 2026-09-24):
     *
     *   GAF Certified Contractor    - a credential GAF issued to us
     *   CertainTeed ShingleMaster   - a credential CertainTeed issued to us
     *   Owens Corning               - shingles we install, NOT a credential
     *
     * Never write "Owens Corning Certified" or put Owens Corning in a
     * credential row. Installing a manufacturer's product is not the same as
     * being certified by them, and claiming otherwise is the kind of thing a
     * competitor reports.
     */
    gaf: "GAF Certified Contractor",
    certainteed: "CertainTeed ShingleMaster",
    /** Chamber of commerce membership, Greater Hattiesburg. */
    adp: "Area Development Partnership Member",
    /**
     * Owner update 2026-09-09: both licences held, so the badge says so.
     * "Mississippi licensed" alone was true and undersold it, and a building
     * owner scanning credentials needs the word commercial to appear.
     */
    licensed: "Licensed residential & commercial",
    insured: "Fully insured & bonded",
    financing: "$0 down financing available",
    /**
     * Owner correction 2026-07-04: manufacturer warranty, NOT workmanship.
     * Always word as just "lifetime warranty", intentionally unspecific.
     */
    warranty: "Lifetime warranty",
    /**
     * Owner-supplied 2026-07-30. COMBINED across the team: deliberately not
     * "in business 10 years" (the company was founded 2023). Keep the word
     * "combined" in every rendering so the claim stays accurate.
     */
    experience: "10+ years of combined roofing experience",
  },
  /**
   * Schema sameAs, every verified profile for THIS business, so search
   * engines can consolidate them into one entity ("all of these are us").
   * Only listings confirmed to be the Hattiesburg roofing company belong
   * here, never Southeast Lights, never a same-named company in another
   * state. URLs are kept canonical (tracking/query junk stripped) so they
   * stay stable. Verified inventory as of 2026-07-26.
   */
  socialProfiles: [
    /*
     * Google Business Profile. The gap flagged on 2026-09-25 is now closed:
     * the old share.google shortlink resolved to a generic Google endpoint
     * and was removed from this list, and the owner supplied the real Maps
     * listing the same day. Verified to resolve to
     * /maps/place/Southeast+Roofing/ at this company's own coordinates.
     */
    "https://maps.app.goo.gl/yHn4p2F5yeVSs35EA",
    // Core credentials
    "https://www.bbb.org/us/ms/hattiesburg/profile/roofing-contractors/southeast-roofing-llc-0523-235902892",
    "https://www.gaf.com/en-us/roofing-contractors/residential/usa/ms/hattiesburg/southeast-roofing-1147340",
    // CertainTeed ShingleMaster profile: a manufacturer-hosted record of a
    // credential we hold, which is exactly what sameAs is for. Defined once
    // in links.certainteedProfile, referenced here so the two cannot drift.
    "https://www.certainteed.com/profiles/SoutheastRoofingLLC",
    // Area Development Partnership (Greater Hattiesburg chamber) member
    // profile. A local-authority listing that corroborates the address.
    "https://members.theadp.com/list/member/southeast-roofing-llc-9201",
    // State licensing authority record for #R22245, the strongest
    // third-party credential we can point at. Declared as a bare URL with
    // no "residential" framing anywhere (see links.msbocLicense).
    "https://search.msboc.us/Detail.cfm?ContractorID=53298&ContractorType=Residential&varDataSource=BOCRes&Advanced=1",
    // Owned social
    "https://www.facebook.com/southeastroofing.llc",
    "https://www.instagram.com/southeastroofing.llc",
    "https://www.tiktok.com/@southeastroofing.llc",
    "https://www.linkedin.com/in/southeast-roofing-1b84b3367",
    "https://nextdoor.com/pages/southeast-roofing-hattiesburg-ms/",
    // Maps + major directories
    "https://maps.apple.com/place?place-id=IFA6389F87BE4B40A",
    "https://www.bing.com/maps?ss=ypid%3AYNF5FB5973B62E00B9",
    "https://www.mapquest.com/us/mississippi/southeast-roofing-778746474",
    // Waze resolves by our Google Place ID, so it corroborates the same entity.
    "https://www.waze.com/live-map/directions/us/ms/hattiesburg/southeast-roofing?to=place.ChIJxf_jHarfnIgRnliLC-o1F40",
    "https://www.yelp.com/biz/southeast-roofing-hattiesburg",
    "https://www.yellowpages.com/hattiesburg-ms/mip/southeast-roofing-578982581",
    "https://www.manta.com/c/m1hb56p/southeast-roofing",
    "https://www.hotfrog.com/company/78d347f4542871ef2a641a2303ca484c/southeast-roofing/hattiesburg/roofs-ceilings",
    // Home-services marketplaces
    "https://www.thumbtack.com/ms/hattiesburg/roofing/southeast-roofing/service/548708522880925705",
    "https://www.houzz.com/hznb/professionals/roofing-and-gutters/southeast-roofing-pfvwus-pf~1481771383",
    // Reviews
    "https://www.trustpilot.com/review/southeastroofing.llc",
    // NOTE: auto-generated scraper directories (roofingquotes, usaroofers,
    // smallbiztrackers, nears.me, tydl.io, roofs.fyi, prosgrade, findglocal,
    // whosmypro, realreviews, etc.) are deliberately EXCLUDED. sameAs should
    // declare authoritative profiles we actually own or were verified on,
    // padding it with scraped listings adds noise, not authority. Those links
    // are harmless where they are and need no disavow; they just don't belong
    // in our identity graph.
  ] as string[],

  /**
   * Launch service area (PRD §5), Mississippi only, within roughly a
   * 2-hour radius of Hattiesburg (owner-confirmed 2026-07-03).
   *
   * Ordering + hub flags follow the owner's 2026-07-04 refinement
   * directive: regional hubs first in this exact order, then smaller
   * communities in geographic order (Pine Belt outward to the Coast, then
   * the larger metros at the radius edge). `tier` still drives city-page
   * content depth (PRD §5); `hub` drives display prominence.
   */
  serviceArea: [
    { city: "Hattiesburg", slug: "hattiesburg", tier: 1, hub: true },
    { city: "Gulfport", slug: "gulfport", tier: 1, hub: true },
    { city: "Biloxi", slug: "biloxi", tier: 1, hub: true },
    { city: "Laurel", slug: "laurel", tier: 1, hub: true },
    { city: "Petal", slug: "petal", tier: 1, hub: true },
    { city: "Picayune", slug: "picayune", tier: 2, hub: true },
    { city: "Brookhaven", slug: "brookhaven", tier: 2, hub: true },
    { city: "McComb", slug: "mccomb", tier: 2, hub: true },
    // Pine Belt communities around Hattiesburg
    { city: "Purvis", slug: "purvis", tier: 2, hub: false },
    { city: "Sumrall", slug: "sumrall", tier: 2, hub: false },
    { city: "Seminary", slug: "seminary", tier: 2, hub: false },
    { city: "Collins", slug: "collins", tier: 2, hub: false },
    { city: "Ellisville", slug: "ellisville", tier: 2, hub: false },
    { city: "Richton", slug: "richton", tier: 2, hub: false },
    { city: "Waynesboro", slug: "waynesboro", tier: 2, hub: false },
    { city: "Leakesville", slug: "leakesville", tier: 2, hub: false },
    { city: "Columbia", slug: "columbia", tier: 2, hub: false },
    // South toward the Coast
    { city: "Poplarville", slug: "poplarville", tier: 2, hub: false },
    { city: "Wiggins", slug: "wiggins", tier: 2, hub: false },
    { city: "Perkinston", slug: "perkinston", tier: 2, hub: false },
    { city: "Lucedale", slug: "lucedale", tier: 2, hub: false },
    { city: "Kiln", slug: "kiln", tier: 2, hub: false },
    { city: "McHenry", slug: "mchenry", tier: 2, hub: false },
    { city: "Saucier", slug: "saucier", tier: 2, hub: false },
    { city: "Diamondhead", slug: "diamondhead", tier: 2, hub: false },
    // Gulf Coast
    { city: "Bay St. Louis", slug: "bay-st-louis", tier: 2, hub: false },
    { city: "Pass Christian", slug: "pass-christian", tier: 2, hub: false },
    { city: "Long Beach", slug: "long-beach", tier: 2, hub: false },
    { city: "D'Iberville", slug: "d-iberville", tier: 2, hub: false },
    { city: "Ocean Springs", slug: "ocean-springs", tier: 2, hub: false },
    { city: "Moss Point", slug: "moss-point", tier: 2, hub: false },
    { city: "Pascagoula", slug: "pascagoula", tier: 2, hub: false },
    // I-55 corridor + larger metros at the edge of the radius
    { city: "Crystal Springs", slug: "crystal-springs", tier: 2, hub: false },
    { city: "Jackson", slug: "jackson", tier: 2, hub: false },
    { city: "Meridian", slug: "meridian", tier: 2, hub: false },
  ],

  /** Site-wide feature flags (storm banner etc., later mirrored in Sanity siteFlags) */
  flags: {
    emergencyBanner: false,
    emergencyBannerMessage:
      "Storm damage? We're responding to emergency calls now.",
  },
} as const;

export type SiteConfig = typeof siteConfig;
