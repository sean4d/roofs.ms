/**
 * Licensed stock photography for premium homepage placements (owner
 * directive 2026-07-04: supplied project photos never appear on the
 * homepage — they live in gallery/project contexts only).
 *
 * Source: Unsplash (Unsplash License — free commercial use, no attribution
 * required). Source page recorded per photo for provenance.
 *
 * INTEGRITY RULE: these are NOT Southeast Roofing projects. Alt text stays
 * generic/descriptive; never attach a city, customer, or "our work" claim.
 */

export interface StockPhoto {
  src: string;
  alt: string;
  /** Unsplash photo page for provenance */
  source: string;
  license: "Unsplash License";
}

export const stockPhotos = {
  /** Homepage hero — premium home, prominent architectural shingle roof */
  heroHome: {
    src: "/images/stock/premium-home-architectural-shingle-roof.jpg",
    alt: "Home with a gray architectural asphalt shingle roof and wraparound porch",
    source: "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
    license: "Unsplash License",
  },
  /** Residential division panel */
  residentialHome: {
    src: "/images/stock/home-asphalt-shingle-roof-golden-hour.jpg",
    alt: "Home with a brown asphalt shingle roof at golden hour",
    source:
      "https://unsplash.com/photos/brown-wooden-house-with-green-grass-field-Bkp3gLygyeA",
    license: "Unsplash License",
  },
  /** Why-us — craftsmanship and safety */
  rooferInstalling: {
    src: "/images/stock/roofer-installing-asphalt-shingle-roof.jpg",
    alt: "Roofer in a safety harness installing asphalt shingles on a residential roof",
    source:
      "https://unsplash.com/photos/a-man-working-on-a-roof-with-a-power-drill-Scaj0T40nFI",
    license: "Unsplash License",
  },
  /** Storm/restoration — shingle tear-off in progress */
  roofTearOff: {
    src: "/images/stock/asphalt-shingle-roof-replacement-tear-off.jpg",
    alt: "Asphalt shingle tear-off in progress during a residential roof replacement",
    source:
      "https://unsplash.com/photos/a-man-standing-on-the-roof-of-a-house--1l0iZaM8ms",
    license: "Unsplash License",
  },
} satisfies Record<string, StockPhoto>;
