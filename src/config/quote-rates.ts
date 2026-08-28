/**
 * The rate card the /quote tool prices against.
 *
 * DERIVED FROM REAL CONTRACTS, not from a guess. Five completed jobs supplied
 * by the owner on 2026-08-28, insurance and retail mixed:
 *
 *   701 E Holly, Ellisville      51.00 sq   $23,317   $457/sq
 *   2112 Lackey, Leakesville     25.00 sq   $11,657   $466/sq  (insurance)
 *   109 Green Timber, Purvis     94.36 sq   $44,000   $466/sq  (house + shed)
 *   14580 Indian Trails, Biloxi  18.11 sq    $9,120   $504/sq
 *   546 Slade, Purvis            92.00 sq   $51,000   $554/sq
 *   ---------------------------------------------------------
 *   weighted                    280.47 sq  $139,094   $496/sq
 *
 * Two things that book tells us and that the code depends on:
 *
 * 1. TAKEOFF, NOT INSTALL. The owner's squares are takeoff figures. Leakesville
 *    was 25 takeoff and 27 installed, so waste ran about 8% and it is already
 *    inside the dollars-per-square above. The tool measures actual roof surface
 *    (a takeoff number) and prices it directly. Do NOT add a waste multiplier
 *    on top, it would double-count and put every quote 8% over.
 *
 * 2. INSURANCE AND RETAIL LAND IN THE SAME BAND. $457 to $554 across both,
 *    everything within about 10% of the middle. That is unusual and it is what
 *    lets one rate serve the whole tool instead of two.
 */

export interface RateCard {
  /** Installed dollars per roofing square, takeoff basis. */
  perSquare: number;
  /** The observed spread, for range quotes on lower-confidence measurements. */
  perSquareLow: number;
  perSquareHigh: number;
  /** Waste actually observed between takeoff and install, for ordering only.
   *  Never applied to price: it is already inside perSquare. */
  observedWaste: number;
  /** Illustrative monthly payment. See FINANCING below. */
  financing: { months: number; apr: number };
}

export const rateCard: RateCard = {
  perSquare: 496,
  perSquareLow: 457,
  perSquareHigh: 554,
  observedWaste: 0.08,
  financing: { months: 120, apr: 0.1299 },
};

/**
 * Financing, and why the rate is printed rather than hidden.
 *
 * GoodLeap is at 12.99% as of 2026-08-28 (owner-supplied). It was 9.99% here,
 * which meant live estimates were quoting payments about 15% under what a
 * homeowner would actually be offered. Update this the day the rate moves.
 *
 * THE APR HAS TO APPEAR ALONGSIDE THE PAYMENT. The owner asked whether it
 * could be left off and only the monthly figures shown. It cannot, and the
 * reason is the opposite of intuition: under Regulation Z, stating the amount
 * of any payment is a "triggering term", and once one appears the advertisement
 * must also disclose the terms of repayment and the annual percentage rate.
 * Showing payments WITHOUT the rate is the exposed position, not the safe one.
 *
 * So there are exactly two compliant shapes, and this file implements the
 * first: show the payments with the rate and the terms in the fine print, or
 * show no payment figures at all and say only that financing is available.
 * A middle version that quotes payments quietly is the one to avoid.
 */
export const FINANCING = {
  partner: "GoodLeap",
  apr: 0.1299,
  /** The terms a homeowner is actually offered, shown as a small table. */
  termsMonths: [60, 120, 180] as const,
};

/** Monthly payment on a simple amortising loan. */
export function paymentFor(
  principal: number,
  months: number,
  apr = FINANCING.apr,
): number {
  const r = apr / 12;
  if (r === 0) return Math.round(principal / months);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
}

/**
 * Material choices, as multipliers on the base rate.
 *
 * The base rate came out of five architectural shingle contracts, so
 * architectural is 1.0 by definition and everything else is expressed against
 * it, using the ratios already in src/config/pricing.ts for the public
 * calculator. Keeping one source of truth for the base means a rate change
 * does not have to be made in six places.
 */
export const MATERIALS = {
  architectural: { label: "Architectural shingle", factor: 1.0 },
  premium: { label: "Premium / designer shingle", factor: 1.4 },
  "metal-29": { label: "29-gauge metal", factor: 2.15 },
  "metal-26": { label: "26-gauge metal", factor: 2.6 },
} as const;

export type MaterialKey = keyof typeof MATERIALS;

/**
 * Second-storey surcharge.
 *
 * Owner-flagged 2026-08-28: the tool priced a two storey building the same as
 * a ranch, which it never should. Higher work is slower, needs more staging
 * and taller ladders, and carries more risk. The 8% figure matches the
 * existing public calculator so a homeowner comparing the two does not see
 * them disagree.
 *
 * It can only ever ADD. That is a deliberate rule carried over from
 * pricing.ts: a two storey selection must never reduce a price.
 */
export const STORIES = {
  1: { label: "1 story", factor: 1.0 },
  2: { label: "2 story", factor: 1.08 },
} as const;

export type StoriesKey = keyof typeof STORIES;

export interface QuoteOptions {
  material: MaterialKey;
  stories: StoriesKey;
}

export const DEFAULT_OPTIONS: QuoteOptions = {
  material: "architectural",
  stories: 1,
};

/** The rate for a given material and storey count. */
export function rateFor(options: QuoteOptions): number {
  return (
    rateCard.perSquare *
    MATERIALS[options.material].factor *
    STORIES[options.stories].factor
  );
}

/**
 * What a quote says, given squares and the options the rep chose.
 *
 * ALWAYS A SINGLE NUMBER NOW. It used to return a range whenever the automatic
 * measurement was less than confident, and that was the wrong answer to the
 * right worry. The owner's complaint is exact: a rep cannot stand on a porch
 * and say "somewhere between nine and nineteen thousand". A range does not
 * read as honesty to a homeowner, it reads as not knowing.
 *
 * What made the range feel necessary was that the measurement could be wrong
 * and nobody could correct it. That is fixed at the source instead: the rep
 * can now adjust the squares, the pitch, the storeys and the material, and the
 * price follows. So there is always one number, and a human is accountable for
 * it, which is a better guarantee than a wide band ever was.
 */
export function priceFor(
  squares: number,
  options: QuoteOptions = DEFAULT_OPTIONS,
): { low: number; high: number; shown: number } {
  const shown = Math.round((squares * rateFor(options)) / 50) * 50;
  return { low: shown, high: shown, shown };
}

/** Illustrative monthly payment on a financed roof. */
export function monthlyPayment(principal: number): number {
  const r = rateCard.financing.apr / 12;
  const n = rateCard.financing.months;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}
