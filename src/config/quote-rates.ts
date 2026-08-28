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
  /** Illustrative monthly payment, matching the public calculator. */
  financing: { months: number; apr: number };
}

export const rateCard: RateCard = {
  perSquare: 496,
  perSquareLow: 457,
  perSquareHigh: 554,
  observedWaste: 0.08,
  financing: { months: 120, apr: 0.0999 },
};

/**
 * What a quote should say, given squares and how much we trust the measurement.
 *
 * A confident measurement gets a single number, because a single number is what
 * makes somebody pick up the phone. A shakier one gets a range, because a
 * number we cannot stand behind is worse than no number: the homeowner either
 * feels lied to later or we eat the difference.
 */
export function priceFor(
  squares: number,
  confidence: "high" | "medium",
): { low: number; high: number; shown: number | null } {
  const round = (n: number) => Math.round(n / 50) * 50;
  if (confidence === "high") {
    const shown = round(squares * rateCard.perSquare);
    return { low: shown, high: shown, shown };
  }
  return {
    low: round(squares * rateCard.perSquareLow),
    high: round(squares * rateCard.perSquareHigh),
    shown: null,
  };
}

/** Illustrative monthly payment on a financed roof. */
export function monthlyPayment(principal: number): number {
  const r = rateCard.financing.apr / 12;
  const n = rateCard.financing.months;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}
