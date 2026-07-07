/**
 * Centralized, owner-editable pricing for the Roof Replacement Cost Calculator.
 * EDIT THE NUMBERS HERE — nothing is hardcoded in the UI. All outputs are
 * ranges and clearly labeled estimates; the tool never promises an exact price
 * (a real quote requires an inspection). Figures are typical installed ranges
 * per roofing "square" (100 sq ft of roof), owner-tunable.
 */

export interface MaterialPrice {
  label: string;
  /** Installed cost per roofing square (100 sq ft). */
  low: number;
  high: number;
}

export const pricingConfig = {
  materials: {
    "architectural-shingles": { label: "Architectural shingles", low: 400, high: 575 },
    "premium-shingles": { label: "Premium / designer shingles", low: 575, high: 800 },
    "metal-29": { label: "29-gauge metal", low: 900, high: 1250 },
    "metal-26": { label: "26-gauge metal", low: 1100, high: 1550 },
    "commercial-tpo": { label: "Commercial TPO (flat)", low: 600, high: 950 },
  } as Record<string, MaterialPrice>,

  /** Roof pitch multiplies the footprint into actual roof area. */
  pitch: {
    low: { label: "Low / walkable", factor: 1.08 },
    average: { label: "Average", factor: 1.25 },
    steep: { label: "Steep", factor: 1.45 },
  } as Record<string, { label: string; factor: number }>,

  /** Added per square when the old roof must be torn off. */
  tearOffPerSquare: { low: 75, high: 125 },
  /** Extra added to the high end when decking may need replacing. */
  deckingContingency: 0.08,
  /** Flat add-on range when gutters are included. */
  gutters: { low: 900, high: 2200 },
  /** Two-story access surcharge. */
  storiesSurcharge: { one: 1.0, two: 1.08 },
  /** Waste/overlap factor applied to roof area. */
  wasteFactor: 1.1,
  /** For the illustrative monthly-payment estimate only. */
  financing: { months: 120, apr: 0.0999 },
} as const;

export interface CalcInput {
  material: string;
  /** Approximate home size in square feet (living space footprint proxy). */
  homeSize: number;
  stories: "one" | "two";
  pitch: "low" | "average" | "steep";
  tearOff: boolean;
  decking: boolean;
  gutters: boolean;
}

export interface CalcResult {
  low: number;
  high: number;
  monthlyLow: number;
  monthlyHigh: number;
  squares: number;
}

const roundTo100 = (n: number) => Math.round(n / 100) * 100;

function monthly(principal: number): number {
  const r = pricingConfig.financing.apr / 12;
  const n = pricingConfig.financing.months;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}

/** Pure estimate — returns null if inputs are incomplete. */
export function estimateCost(input: CalcInput): CalcResult | null {
  const mat = pricingConfig.materials[input.material];
  if (!mat || !input.homeSize || input.homeSize <= 0) return null;

  // Home size is treated as the roof-footprint basis. We deliberately do NOT
  // shrink it for two-story homes: a two-story job is harder and costlier to
  // access, so the two-story surcharge below must only ever ADD to the price
  // (owner rule — a two-story selection can never lower the estimate).
  const footprint = input.homeSize;
  const roofArea =
    footprint * pricingConfig.pitch[input.pitch].factor * pricingConfig.wasteFactor;
  const squares = roofArea / 100;

  let low = squares * mat.low;
  let high = squares * mat.high;

  if (input.tearOff) {
    low += squares * pricingConfig.tearOffPerSquare.low;
    high += squares * pricingConfig.tearOffPerSquare.high;
  }

  const storyMult =
    input.stories === "two"
      ? pricingConfig.storiesSurcharge.two
      : pricingConfig.storiesSurcharge.one;
  low *= storyMult;
  high *= storyMult;

  if (input.decking) high *= 1 + pricingConfig.deckingContingency;
  if (input.gutters) {
    low += pricingConfig.gutters.low;
    high += pricingConfig.gutters.high;
  }

  low = roundTo100(low);
  high = roundTo100(high);

  return {
    low,
    high,
    monthlyLow: monthly(low),
    monthlyHigh: monthly(high),
    squares: Math.round(squares * 10) / 10,
  };
}
