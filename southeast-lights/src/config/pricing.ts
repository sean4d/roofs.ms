/**
 * Holiday and permanent lighting pricing. Owner-supplied 2026-08-24.
 *
 * Single source of truth for the estimator, the pricing tables on service
 * pages, and any quoted figure in copy. If a number changes, it changes HERE
 * and nowhere else.
 *
 * The defining fact about the holiday product: it is a RENTAL. The lights
 * remain Southeast Lights' property. The customer buys nothing, stores
 * nothing, and repairs nothing, and the price repeats every season. That is
 * the pitch, not a footnote.
 */

/** Holiday C9 rental rates, in dollars. */
export const HOLIDAY = {
  /** Per linear foot of roofline. All-in: see INCLUDED below. */
  roofPerFt: 10,
  /** Per foot of column wrap, priced by height. */
  columnPerFt: 10,
  /**
   * Per foot of pathway. SPT-2 wire with sockets every 12 inches means one
   * stake and one bulb per foot, which is what justifies a per-foot rate.
   */
  pathwayPerFt: 8,
  /** Access surcharges, added to the ROOFLINE rate only. They stack. */
  surcharge: {
    twoStory: 2,
    /** Anything over a 9/12 pitch counts as steep. */
    steep: 2,
  },
  /** Below this we do not take the job. */
  minimum: 1000,
} as const;

/** Window outlines, by size. */
export const WINDOW_TIERS = [
  { key: "small", label: "Small", price: 100 },
  { key: "medium", label: "Medium", price: 250 },
  { key: "large", label: "Large", price: 400 },
] as const;

/**
 * Wrapped trees (mini lights). Big live oaks can be extraordinarily
 * expensive, so the largest option deliberately produces NO automatic price
 * and routes to a site visit instead. A wrong auto-quote on a specimen tree
 * either loses money or scares off a job worth having.
 */
export const TREE_TIERS = [
  { key: "small", label: "Small", price: 1000 },
  { key: "medium", label: "Medium", price: 2500 },
  { key: "large", label: "Large", price: 4000 },
  { key: "specimen", label: "Live oak / specimen", price: null },
] as const;

/**
 * Permanent architectural lighting. One-time, and the customer owns the
 * system outright. Difficult rooflines, two-story sections, steep access and
 * peak-season installs push toward the top of each range.
 *
 * DELIBERATELY UNBRANDED. Southeast Lights is not an authorised dealer for
 * any permanent-lighting manufacturer, so no manufacturer name, logo or
 * warranty language may appear anywhere on this site. Putting a protected
 * trademark on a commercial page you are not licensed to represent is a
 * legal exposure, not a marketing risk.
 *
 * The page sells what we can actually stand behind: the installation, the
 * workmanship warranty, and the fact that the roofing company doing it is
 * the one who would have to fix the roof. If a dealership is secured later,
 * add the brand HERE first and let it flow outward.
 */
export const PERMANENT = {
  perFt: { low: 25, high: 35 },
  controller: { low: 650, high: 850 },
} as const;

/** What the holiday per-foot rate actually covers. Used verbatim in copy. */
export const INCLUDED = [
  "Custom cut to your rooflines",
  "Design and planning",
  "Professional installation",
  "In-season maintenance and bulb replacement",
  "Takedown after the season",
  "Labeling and storage of your display",
  "Priority scheduling for next year",
] as const;

export interface HolidayInput {
  roofFt: number;
  twoStory: boolean;
  steep: boolean;
  columnCount: number;
  columnHeightFt: number;
  windowCount: number;
  windowPrice: number;
  treeCount: number;
  /** null means a specimen tree: no auto-price, route to a site visit. */
  treePrice: number | null;
  pathwayFt: number;
}

export interface HolidayQuote {
  roofRatePerFt: number;
  lines: { label: string; amount: number }[];
  subtotal: number;
  /** Subtotal after the minimum is applied. */
  total: number;
  minimumApplied: boolean;
  /** True when a specimen tree means this cannot be a complete quote. */
  needsSiteVisit: boolean;
}

/** The one place holiday pricing is computed. */
export function quoteHoliday(input: HolidayInput): HolidayQuote {
  const roofRatePerFt =
    HOLIDAY.roofPerFt +
    (input.twoStory ? HOLIDAY.surcharge.twoStory : 0) +
    (input.steep ? HOLIDAY.surcharge.steep : 0);

  const needsSiteVisit = input.treeCount > 0 && input.treePrice === null;

  const lines = [
    { label: "Roofline", amount: input.roofFt * roofRatePerFt },
    {
      label: "Columns",
      amount: input.columnCount * input.columnHeightFt * HOLIDAY.columnPerFt,
    },
    { label: "Windows", amount: input.windowCount * input.windowPrice },
    {
      label: "Wrapped trees",
      amount: needsSiteVisit ? 0 : input.treeCount * (input.treePrice ?? 0),
    },
    { label: "Pathway", amount: input.pathwayFt * HOLIDAY.pathwayPerFt },
  ];

  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const minimumApplied = subtotal > 0 && subtotal < HOLIDAY.minimum;

  return {
    roofRatePerFt,
    lines,
    subtotal,
    total: subtotal > 0 ? Math.max(subtotal, HOLIDAY.minimum) : 0,
    minimumApplied,
    needsSiteVisit,
  };
}

/** Permanent lighting installed range for a given roofline length. */
export function quotePermanent(linearFt: number): { low: number; high: number } {
  if (linearFt <= 0) return { low: 0, high: 0 };
  return {
    low: linearFt * PERMANENT.perFt.low + PERMANENT.controller.low,
    high: linearFt * PERMANENT.perFt.high + PERMANENT.controller.high,
  };
}

/**
 * Seasons of holiday rental before permanent lighting pays for itself. This is the
 * strongest conversion tool on the site: the holiday product bills the same
 * amount forever, so every loyal renter is accumulating a reason to buy.
 * Better they hit that math here than on a competitor's page.
 */
export function seasonsToBreakEven(
  annualHolidayCost: number,
  linearFt: number,
): number | null {
  if (annualHolidayCost <= 0 || linearFt <= 0) return null;
  const { low, high } = quotePermanent(linearFt);
  return (low + high) / 2 / annualHolidayCost;
}
