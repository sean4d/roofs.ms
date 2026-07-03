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
    /** White knockout derived from official artwork — dark backgrounds */
    light: "/images/brand/southeast-roofing-logo-white.png",
    /** Intrinsic aspect ratio of the trimmed marks (479x278) */
    aspect: { width: 479, height: 278 },
  },
  certifications: {
    /** Owner confirmed for site-wide display, 2026-07-03 */
    owensCorningPreferred: {
      images: [
        "/images/brand/owens-corning-preferred-contractor-logo-01.png",
        "/images/brand/owens-corning-preferred-contractor-logo-02.png",
      ],
      confirmed: true,
    },
  },
  trust: {
    googleReviews: [
      "/images/brand/google-reviews-logo-01.png",
      "/images/brand/google-reviews-logo-02.png",
    ],
  },
  partners: {
    roofr: "/images/brand/roofr-logo-01.webp",
  },
} as const;
