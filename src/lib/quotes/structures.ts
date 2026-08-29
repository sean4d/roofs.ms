/**
 * A property is not always one roof.
 *
 * 109 Green Timber is the case that forced this: a house and a detached shed,
 * both plainly visible in the same yard, and the tool measured only the
 * building nearest the tap. It returned 38.9 squares against a real 94.36 and
 * looked like a measurement failure when it was a modelling failure. Google's
 * findClosest returns ONE building, and a property can have several.
 *
 * So an estimate is a list of structures. The rep taps the house, then taps
 * the shed, and both land on the same quote and the same piece of paper. The
 * alternative, which is what the owner was doing, is sending a customer two
 * estimates for one job.
 *
 * Each structure carries its own material, because a house with shingles and a
 * shop with a metal roof is completely normal here and pricing them at one
 * rate would be wrong in both directions.
 */

import {
  MATERIALS,
  STORIES,
  complexityFor,
  rateFor,
  type MaterialKey,
  type StoriesKey,
} from "@/config/quote-rates";

export interface Structure {
  /** What the customer will see this called. */
  label: string;
  squares: number;
  pitchOver12: number | null;
  planes: number;
  material: MaterialKey;
  stories: StoriesKey;
  lat: number;
  lon: number;
}

export interface PricedStructure extends Structure {
  materialLabel: string;
  complexityLabel: string;
  /** Dollars for this structure alone, rounded the same way as a whole quote. */
  price: number;
}

export interface StructureTotals {
  structures: PricedStructure[];
  totalSquares: number;
  totalPrice: number;
}

/**
 * Default names, in the order a rep taps them.
 *
 * "Main roof" first because that is what they came for. After that the names
 * are deliberately generic, since the tool cannot tell a detached garage from
 * a workshop and a wrong specific name on a customer's estimate is worse than
 * a vague right one. The rep can rename any of them.
 */
export function defaultLabel(index: number): string {
  if (index === 0) return "Main roof";
  return `Structure ${index + 1}`;
}

/** Price each structure on its own terms, then total them. */
export function priceStructures(structures: Structure[]): StructureTotals {
  const priced = structures.map((s) => {
    const rate = rateFor({
      material: s.material,
      stories: s.stories,
      planes: s.planes,
    });
    return {
      ...s,
      materialLabel: MATERIALS[s.material].label,
      complexityLabel: complexityFor(s.planes).label,
      // Rounded per structure so the line items on the proposal add up to the
      // total exactly. Rounding only the total would leave the arithmetic on
      // the page visibly wrong, which a customer will notice before anything
      // else on it.
      price: Math.round((s.squares * rate) / 50) * 50,
    };
  });

  return {
    structures: priced,
    totalSquares:
      Math.round(priced.reduce((a, s) => a + s.squares, 0) * 10) / 10,
    totalPrice: priced.reduce((a, s) => a + s.price, 0),
  };
}

/** The storeys label, for display. */
export function storiesLabel(stories: StoriesKey): string {
  return STORIES[stories].label;
}
