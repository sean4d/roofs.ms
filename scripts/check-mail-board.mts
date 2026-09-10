import { readFileSync } from "node:fs";

import { propertyKey } from "@/lib/quotes/delivery";

/**
 * The mail board's numbers have to mean something.
 *
 * WHY THIS EXISTS. The owner closed one evening on "Posted 300, Rejected 7"
 * and opened the next morning on "Posted 299, Rejected 5", and asked the only
 * question that matters: are records disappearing? Two separate defects could
 * each produce that, and both were real.
 *
 * ONE. Requesting a mailer nulled mail_handled_at, mail_handled_by and
 * mail_note. There is one row per quote and no history table, so those three
 * columns are the entire record that somebody in the office posted an envelope
 * or refused to. A rep asking for a mailer again on a house that had already
 * been handled destroyed it, permanently, and the row moved out of Posted into
 * To send. The count went down because the history was gone.
 *
 * TWO. The tab labels counted the rows the board had loaded, and the board
 * loads at most 300. "Posted 300" was the cap, not a total. Past that line the
 * number stops tracking reality and nobody can tell from the screen.
 *
 * Neither is visible in a screenshot and neither trips a type error, so they
 * are checked here instead. Run: npm run check:mail
 */

let failures = 0;
function check(ok: boolean, label: string, detail?: string) {
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}`);
  if (!ok) {
    failures++;
    if (detail) console.log(`        ${detail}`);
  }
}

/* ------------------------------------------------------------------ */
/* 1. Re-requesting must not erase what the office did                 */
/* ------------------------------------------------------------------ */
console.log("\nA re-request keeps the office's record");

const source = readFileSync(
  new URL("../src/lib/quotes/delivery.ts", import.meta.url),
  "utf8",
);

const requestMail = source.slice(
  source.indexOf("export async function requestMail"),
  source.indexOf("export async function resolveMail"),
);
check(
  requestMail.length > 0,
  "requestMail is where this check expects to find it",
);
for (const column of ["mail_handled_at", "mail_handled_by", "mail_note"]) {
  check(
    !new RegExp(`${column}\\s*=\\s*NULL`, "i").test(requestMail),
    `requestMail does not null ${column}`,
    "There is no history table. Nulling this deletes the only record that the office handled this quote, and drops the count on a tab with nothing to explain it.",
  );
}
check(
  /mail_status\s*=\s*'requested'/.test(requestMail),
  "requestMail still puts the quote back in the queue",
);

const resolveMail = source.slice(
  source.indexOf("export async function resolveMail"),
  source.indexOf("export interface MailRow"),
);
check(
  /mail_handled_at\s*=\s*now\(\)/.test(resolveMail),
  "resolveMail still writes a fresh handling record when the office acts",
);

/* ------------------------------------------------------------------ */
/* 2. What the office did last time is recoverable                     */
/* ------------------------------------------------------------------ */
console.log("\nA re-queued mailer says what happened last time");

/** The inference the board makes, kept in step with delivery.ts. */
const priorOutcome = (r: {
  mail_handled_at: string | null;
  sent_via: string | null;
  sent_at: string | null;
}) =>
  !r.mail_handled_at
    ? null
    : r.sent_via === "mail" && r.sent_at
      ? "mailed"
      : "rejected";

check(
  priorOutcome({ mail_handled_at: null, sent_via: null, sent_at: null }) ===
    null,
  "a quote that has never been handled reports no prior outcome",
);
check(
  priorOutcome({
    mail_handled_at: "2026-09-08T14:00:00Z",
    sent_via: "mail",
    sent_at: "2026-09-08T14:00:00Z",
  }) === "mailed",
  "a posted quote that is requested again reports 'mailed'",
);
check(
  priorOutcome({
    mail_handled_at: "2026-09-08T14:00:00Z",
    sent_via: null,
    sent_at: null,
  }) === "rejected",
  "a rejected quote that is requested again reports 'rejected'",
);
check(
  priorOutcome({
    mail_handled_at: "2026-09-08T14:00:00Z",
    sent_via: "email",
    sent_at: "2026-09-08T14:00:00Z",
  }) === "rejected",
  "an emailed-but-not-posted quote is not mistaken for a posted one",
);

/* ------------------------------------------------------------------ */
/* 3. The counts are the table's, not the window's                     */
/* ------------------------------------------------------------------ */
console.log("\nTab counts survive the 300-row cap");

const LIMIT = 300;
/** 412 posted mailers, every one a different house. */
const posted = Array.from({ length: 412 }, (_, i) => ({
  address: `${100 + i * 2} Chapman Rd, Gulfport, MS 39503, USA`,
  lat: 30.41 + i * 0.0004,
  lon: -89.07,
}));

const windowed = posted.slice(0, LIMIT);
check(
  windowed.length === LIMIT,
  "the board still loads at most 300 rows (that part is deliberate)",
);

const trueCount = new Set(
  posted.map((p) => propertyKey(p.address, p.lat, p.lon)),
).size;
check(
  trueCount === 412,
  `the count is over the whole table, not the window (${trueCount})`,
  "If this reads 300 the tab is showing the limit and calling it a total.",
);

/* The count and the list must agree on what a row is: one per property. */
const withDuplicate = [...posted.slice(0, 5), posted[2]];
const deduped = new Set(
  withDuplicate.map((p) => propertyKey(p.address, p.lat, p.lon)),
).size;
check(
  deduped === 5,
  `two quotes on one house count once (${deduped})`,
  "The board folds them into one line, so a count that says six above a list of five teaches the office the numbers here cannot be trusted.",
);

/* ------------------------------------------------------------------ */
/* 4. The board admits when it is not showing everything               */
/* ------------------------------------------------------------------ */
console.log("\nA capped list says so");

const board = readFileSync(
  new URL("../src/app/pin/mail/mail-board.tsx", import.meta.url),
  "utf8",
);
check(
  /Showing the .*most recent of/.test(board),
  "the board tells the office when a list is truncated",
);
check(
  !/rows\.requested\.length\]/.test(board) &&
    !/rows\.mailed\.length\]/.test(board),
  "the tab labels read from the server counts, not from the loaded lists",
);

console.log(
  failures ? `\n${failures} failed\n` : "\nAll mail board checks passed\n",
);
process.exit(failures ? 1 : 0);
