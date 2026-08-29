/**
 * Pricing engine tests.
 *
 *   node --experimental-strip-types scripts/test-pricing.mjs
 *
 * Every number here was supplied by the owner. If one of these fails, the
 * quote a customer sees no longer matches what the business charges, which is
 * the most consequential kind of bug on this site.
 */
import {
  quoteHoliday,
  quotePermanent,
  seasonsToBreakEven,
  HOLIDAY,
  TREE_TIERS,
  PERMANENT,
} from "../src/config/pricing.ts";

const base = {
  roofFt: 0,
  twoStory: false,
  steep: false,
  columnCount: 0,
  columnHeightFt: 8,
  windowCount: 0,
  windowPrice: 100,
  treeCount: 0,
  treePrice: 1500,
  pathwayFt: 0,
};
const q = (o) => quoteHoliday({ ...base, ...o });
const tree = (key) => TREE_TIERS.find((t) => t.key === key);

const checks = [
  ["roofline $10/ft: 150ft = $1,500", q({ roofFt: 150 }).total, 1500],
  ["minimum applies below $1,000", q({ roofFt: 90 }).total, HOLIDAY.minimum],
  ["minimum is flagged", q({ roofFt: 90 }).minimumApplied, true],
  ["two-story adds $2/ft", q({ roofFt: 100, twoStory: true }).roofRatePerFt, 12],
  ["steep adds $2/ft", q({ roofFt: 100, steep: true }).roofRatePerFt, 12],
  ["both stack to $14/ft", q({ roofFt: 180, twoStory: true, steep: true }).roofRatePerFt, 14],
  ["steep two-story 180ft roofline", q({ roofFt: 180, twoStory: true, steep: true }).lines[0].amount, 2520],
  ["columns $10/ft x height", q({ roofFt: 150, columnCount: 4, columnHeightFt: 10 }).total, 1900],
  ["pathway $8/ft", q({ roofFt: 150, pathwayFt: 100 }).total, 2300],
  ["windows priced per unit", q({ roofFt: 150, windowCount: 4, windowPrice: 250 }).total, 2500],
  ["small tree $1,500", tree("small").price, 1500],
  ["medium tree $2,500", tree("medium").price, 2500],
  ["large tree $3,500", tree("large").price, 3500],
  ["estate tree has no auto price", tree("estate").price, null],
  ["estate tree routes to site visit", q({ roofFt: 150, treeCount: 1, treePrice: null }).needsSiteVisit, true],
  ["estate tree adds $0 to total", q({ roofFt: 150, treeCount: 1, treePrice: null }).total, 1500],
  ["empty input is $0", q({}).total, 0],
  ["permanent 100ft", `${quotePermanent(100).low}/${quotePermanent(100).high}`, "3150/4350"],
  ["permanent 150ft", `${quotePermanent(150).low}/${quotePermanent(150).high}`, "4400/6100"],
  ["permanent 200ft", `${quotePermanent(200).low}/${quotePermanent(200).high}`, "5650/7850"],
  ["permanent 250ft", `${quotePermanent(250).low}/${quotePermanent(250).high}`, "6900/9600"],
  ["permanent per-ft range", `${PERMANENT.perFt.low}-${PERMANENT.perFt.high}`, "25-35"],
  ["break-even 150ft @ $1,500/season", seasonsToBreakEven(1500, 150).toFixed(2), "3.50"],
];

let failed = 0;
for (const [name, got, want] of checks) {
  const ok = String(got) === String(want);
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "FAIL  "}${name}${ok ? "" : `  got=${got} want=${want}`}`);
}
console.log(failed ? `\n${failed} FAILED` : `\nall ${checks.length} pass`);
process.exit(failed ? 1 : 0);
