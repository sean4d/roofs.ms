import "server-only";

import { db } from "./db";
import type { User } from "./auth";

/**
 * How good the measurement actually is.
 *
 * The estimator was calibrated on FOUR houses. That is the honest number, and
 * it is nowhere near enough for a tool that now prices every door a rep knocks
 * on. Meanwhile the company closes jobs every week, each one producing a real
 * takeoff, and none of it was being written down anywhere the tool could see.
 *
 * So the office types the real figure in when a job is measured properly, and
 * this compares it against what the imagery said. Three numbers per row and
 * they mean three different things:
 *
 *   measured  what Google's imagery produced, frozen at save time
 *   quoted    what went on the paper, after the rep and the office adjusted it
 *   actual    what the roof turned out to be
 *
 * Keeping all three separates two questions that look like one: how good is
 * the machine, and how good are the humans correcting it. If the reps' edits
 * make things worse, that is worth knowing and is invisible if you only store
 * the final number.
 *
 * BIAS IS THE USEFUL STATISTIC, not the average error. A tool that is 8% light
 * on every roof is trivially fixable with one multiplier. A tool that is 8%
 * out at random is not fixable at all and has to be presented as a range. The
 * spread tells you which one you have.
 */

export interface AccuracyRow {
  quoteId: string;
  address: string;
  createdAt: string;
  measured: number | null;
  quoted: number;
  actual: number;
  /** Signed, as a fraction. Positive means the imagery read HIGH. */
  errorFraction: number | null;
}

export interface Accuracy {
  rows: AccuracyRow[];
  n: number;
  /** Mean signed error. The one a multiplier can cancel out. */
  bias: number | null;
  /** Mean absolute error. How wrong a typical house is, in either direction. */
  meanAbsolute: number | null;
  /** Middle of the pack, which a couple of disasters cannot drag around. */
  median: number | null;
  /** Within a tenth of the truth, as a share of the set. */
  within10: number | null;
}

interface Row {
  id: string;
  address: string;
  created_at: string | Date;
  measured_squares: string | number | null;
  squares: string | number | null;
  actual_squares: string | number;
}

const iso = (v: string | Date): string =>
  v instanceof Date ? v.toISOString() : String(v);

/**
 * Every quote where somebody has recorded what the roof really was.
 *
 * Degrades to an empty set rather than throwing, like everything else that
 * reads a hand-migrated column. See queryOrNull in delivery.ts for why.
 */
export async function accuracy(): Promise<Accuracy> {
  let rows: Row[] = [];
  try {
    rows = (await db()`
      SELECT q.id, q.created_at, q.measured_squares, q.squares, q.actual_squares,
             c.address
        FROM quotes q
        JOIN customers c ON c.id = q.customer_id
       WHERE q.actual_squares IS NOT NULL
       ORDER BY q.actual_at DESC NULLS LAST
       LIMIT 500
    `) as Row[];
  } catch (error) {
    console.error("[accuracy] query failed, degrading", error);
  }

  const out: AccuracyRow[] = rows.map((r) => {
    const measured =
      r.measured_squares === null ? null : Number(r.measured_squares);
    const actual = Number(r.actual_squares);
    return {
      quoteId: r.id,
      address: r.address,
      createdAt: iso(r.created_at),
      measured,
      quoted: Number(r.squares ?? 0),
      actual,
      // Against the MACHINE's figure, not the quoted one. The question this
      // answers is whether the imagery can be trusted, and a human correction
      // already applied would hide the answer.
      errorFraction:
        measured !== null && actual > 0 ? (measured - actual) / actual : null,
    };
  });

  const errors = out
    .map((r) => r.errorFraction)
    .filter((e): e is number => e !== null);

  if (!errors.length) {
    return {
      rows: out,
      n: 0,
      bias: null,
      meanAbsolute: null,
      median: null,
      within10: null,
    };
  }

  const sorted = [...errors].map(Math.abs).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return {
    rows: out,
    n: errors.length,
    bias: errors.reduce((a, b) => a + b, 0) / errors.length,
    meanAbsolute: sorted.reduce((a, b) => a + b, 0) / sorted.length,
    median:
      sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    within10: sorted.filter((e) => e <= 0.1).length / sorted.length,
  };
}

/** Record what the roof really was. */
export async function recordActual(
  quoteId: string,
  squares: number | null,
  user: User,
): Promise<void> {
  await db()`
    UPDATE quotes
       SET actual_squares = ${squares},
           actual_at = ${squares === null ? null : new Date().toISOString()},
           actual_by = ${squares === null ? null : user.id}::uuid
     WHERE id = ${quoteId}::uuid
  `;
}
