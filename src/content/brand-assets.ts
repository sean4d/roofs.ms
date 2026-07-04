/**
 * Official Southeast Roofing brand assets (owner-supplied and confirmed
 * for site-wide use, 2026-07-03).
 *
 * Usage constraints (integrity rule, PRD §0.2):
 * - The Google reviews logo is a trust mark, not a substitute for real
 *   reviews — display it only alongside a link to the live Google profile.
 * - The white knockout logo is derived from the official black artwork
 *   (inverted, transparency preserved) for use on the dark theme.
 */

export const brandAssets = {
  logo: {
    /** Official black artwork — light backgrounds */
    dark: "/images/brand/southeast-roofing-logo-01.png",
    /** Official navy artwork — light backgrounds */
    navy: "/images/brand/southeast-roofing-logo-02.png",
    /** Navy artwork, trimmed of padding */
    navyTrimmed: "/images/brand/southeast-roofing-logo-navy-trimmed.png",
    /**
     * Roof mark only (cropped from the official navy artwork) — paired
     * with an HTML wordmark in the header so the name stays readable at
     * small sizes.
     */
    mark: "/images/brand/southeast-roofing-mark.png",
    markAspect: { width: 479, height: 208 },
    /** White knockout derived from official artwork — dark backgrounds */
    light: "/images/brand/southeast-roofing-logo-white.png",
    /** Intrinsic aspect ratio of the trimmed marks (479x278) */
    aspect: { width: 479, height: 278 },
  },
  /**
   * Held credentials (brand directive 2026-07-03 §4): GAF certification
   * receives the greatest emphasis of all manufacturer relationships.
   * Southeast Roofing is NOT an Owens Corning certified/preferred
   * contractor — never state or imply OC certification (see productLines).
   * Third-party logos always keep their original colors, never redrawn
   * or recolored; source official SVGs from manufacturer sites (§5).
   */
  certifications: {
    gaf: {
      label: "GAF Certified Contractor",
      /** [NEEDS: official GAF badge — permission granted to source from gaf.com] */
      images: [] as string[],
      confirmed: true,
      emphasis: "primary",
    },
    bbb: {
      label: "BBB Accredited",
      /** [NEEDS: official BBB seal — permission granted to source from bbb.org] */
      images: [] as string[],
      confirmed: true,
    },
    msboc: {
      label: "Licensed by the Mississippi State Board of Contractors",
      images: [] as string[],
      confirmed: true,
      /** [NEEDS: license number in its public form] — lives in siteConfig.license */
    },
  },
  /**
   * Manufacturer product lines we sell/install — product references,
   * imagery, and education are appropriate; certification wording is NOT
   * (directive §4). Official product photography may be sourced from
   * manufacturer sites for product/service/education pages (§5–6), never
   * presented as completed Southeast Roofing projects.
   */
  productLines: {
    gaf: { label: "GAF roofing systems" },
    owensCorning: {
      label: "Owens Corning roofing products",
      /**
       * DO NOT DISPLAY — supplied files are "Preferred Contractor" badge
       * artwork implying a certification we do not hold. Retained only for
       * reference; replace with official OC *product* logos when product
       * pages are built.
       */
      doNotDisplay: [
        "/images/brand/owens-corning-preferred-contractor-logo-01.png",
        "/images/brand/owens-corning-preferred-contractor-logo-02.png",
        "/images/brand/owens-corning-preferred-contractor-badge.png",
      ],
    },
    gibraltar: { label: "Gibraltar metal roofing systems" },
    spectra: { label: "Spectra gutter systems" },
  },
  trust: {
    /**
     * DO NOT DISPLAY without owner verification (integrity rule):
     * - logo-01 shows a 5-star graphic → implies an unverified rating.
     * - logo-02 is the "Google Guaranteed" program badge → implies enrollment
     *   in Google Local Services, which is unconfirmed.
     * [NEEDS: owner confirmation of Google Guaranteed status + actual rating,
     * plus the live Google Business Profile URL]
     */
    googleReviews: {
      images: [
        "/images/brand/google-reviews-logo-01.png",
        "/images/brand/google-reviews-logo-02.png",
      ],
      confirmed: false,
    },
  },
  partners: {
    roofr: "/images/brand/roofr-logo-01.webp",
  },
} as const;
