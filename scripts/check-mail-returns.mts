import { readFileSync } from "node:fs";

import { checkAddress, splitAddress } from "@/lib/quotes/address-check";

/**
 * Undeliverable addresses must not reach the print queue, and an outage must
 * not stop the office working.
 *
 * WHY THIS EXISTS. Five envelopes came back from USPS in September 2026:
 *
 *   526 Mary Grove Church Rd, Mendenhall    NO SUCH NUMBER
 *   100 Janesville Rd, Mt. Olive            NO SUCH NUMBER
 *   524 W Border Ave, Wiggins               NOT DELIVERABLE AS ADDRESSED
 *   1023 Clubhouse Dr, Wiggins              INSUFFICIENT ADDRESS
 *   68 Peps Point Rd, Hattiesburg           UNCLAIMED
 *
 * Four of the five were knowable before the stamp went on. The board also had
 * nowhere to record any of them, so "Posted" was counting envelopes that left
 * the building rather than envelopes that arrived.
 *
 * TWO INVARIANTS PULL AGAINST EACH OTHER and both are asserted here.
 *
 * The first is the block: if USPS says the address is not a delivery point,
 * the mailer is refused. The second is that it FAILS OPEN. An unreachable
 * Google must never stop the office posting anything, because trading a $0.78
 * problem for a business-stopping one is not a safety feature. Getting the
 * first without the second would be worse than shipping neither.
 *
 * The consequence of failing open is that "never enabled" looks exactly like
 * "working", so the health endpoint probes it live and the deploy check
 * asserts the probe. That is the only thing standing between a switched-off
 * API and a board that quietly protects nothing.
 *
 * Run: npm run check:mail-returns
 */

let failures = 0;
function check(ok: boolean, label: string, detail?: string) {
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}`);
  if (!ok) {
    failures++;
    if (detail) console.log(`        ${detail}`);
  }
}

const read = (rel: string) =>
  readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");

/* ------------------------------------------------------------------ */
/* 1. The validator's verdicts, exercised for real                     */
/* ------------------------------------------------------------------ */
// checkAddress reads the key when it is called, not when it is imported, so
// setting it here is enough. The stubbed fetch below means it never leaves.
process.env.GOOGLE_MAPS_SERVER_KEY ??= "test-key";

const realFetch = globalThis.fetch;
/**
 * The last request body checkAddress sent, so the SHAPE can be asserted.
 *
 * Held on an object rather than in a bare `let` because the only assignment
 * happens inside the stubbed fetch. Control flow analysis cannot see across
 * that boundary, so a bare variable stays narrowed to `null` at every read
 * here and every property access below becomes an error on type `never`.
 */
interface SentBody {
  address?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
  };
  enableUspsCass?: boolean;
}
const sent: { body: SentBody | null } = { body: null };

function stubUsps(uspsData: Record<string, string> | null, status = 200) {
  globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
    sent.body = init?.body ? JSON.parse(init.body as string) : null;
    return new Response(
      JSON.stringify(uspsData ? { result: { uspsData } } : {}),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }) as typeof fetch;
}

const ADDRESS = "100 Janesville Rd, Mt. Olive, MS 39119";

/* ------------------------------------------------------------------ */
/* 0. THE REQUEST SHAPE. This is the bug that made all of section 1    */
/*    unreachable for five days in production.                         */
/* ------------------------------------------------------------------ */
console.log("\nThe question is asked in the form USPS answers");

/*
 * WHY THIS IS THE FIRST THING CHECKED NOW.
 *
 * Every verdict below is downstream of one property of the request body: the
 * city, state and ZIP have to travel as their OWN fields. Flattened into a
 * single addressLines entry, the API still returns 200, still sets
 * cassProcessed: true, still hands back a standardised address and a carrier
 * route, and omits every dpv* field. checkAddress then sees an empty
 * dpvConfirmation, correctly calls that inconclusive, and passes the address.
 *
 * Every address. Forever. Thirteen envelopes came back across September and
 * early October while the deploy check reported addressCheck: true, because
 * nothing anywhere asserted that USPS had actually been asked anything.
 *
 * Measured on those thirteen: one line caught 0, split caught 9.
 */
stubUsps({ dpvConfirmation: "Y" });
await checkAddress(ADDRESS);
const asked = sent.body?.address;
const lines = asked?.addressLines ?? [];
check(
  lines.length === 1 && !lines[0].includes(","),
  "the street line travels alone, with no city or state glued to it",
  `sent ${JSON.stringify(lines)}`,
);
check(
  asked?.locality === "Mt. Olive" &&
    asked?.administrativeArea === "MS" &&
    asked?.postalCode === "39119",
  "city, state and ZIP travel as their own fields, which is what runs DPV",
  `sent ${JSON.stringify(asked)}`,
);
check(
  sent.body?.enableUspsCass === true,
  "CASS is requested, which is what makes uspsData come back at all",
);

// The splitter is the thing standing between a stored address string and that
// request, so its failure modes matter as much as its successes.
check(
  splitAddress("505 E Bond Ave, Wiggins, MS 39577")?.street === "505 E Bond Ave",
  "a plain address splits into street, city, state and ZIP",
);
check(
  splitAddress("6668 US 98, Suite F, Hattiesburg, MS 39402")?.street ===
    "6668 US 98, Suite F",
  "a secondary line stays with the street rather than being read as the city",
  "splitting on the last two commas would have sent USPS 'Suite F' as the city",
);
check(
  splitAddress("505 E Bond Ave, Wiggins, MS 39577-3416")?.zip === "39577",
  "a ZIP+4 is accepted and the five-digit ZIP is sent",
);
check(
  splitAddress("1 Main St, Springfield, XX 12345") === null,
  "a two-letter tail that is not a real state refuses to parse",
  "without the guard 'London, UK' parses as state UK and USPS is asked about the wrong place",
);
check(
  splitAddress("just a street line") === null,
  "an unsplittable address returns null rather than a guess",
);
// And an unsplittable address must still be SENT, degrading honestly.
stubUsps({ carrierRoute: "R001" });
const unsplittable = await checkAddress("PO Box 12 Rural Route 3");
check(
  unsplittable.verdict === "unknown" && !unsplittable.dpvRan,
  "an address that cannot be split reports that DPV did not run",
  "silently passing it is exactly how the original bug stayed invisible",
);

/* ------------------------------------------------------------------ */
/* 1. The validator's verdicts, exercised for real                     */
/* ------------------------------------------------------------------ */
console.log("\nWhat the validator does with each USPS answer");

stubUsps({ dpvConfirmation: "Y", dpvVacant: "N", dpvNoStat: "N" });
check(
  (await checkAddress(ADDRESS)).verdict === "mailable",
  "a confirmed, occupied, active address is mailable",
);

/*
 * THROWBACK: the one that no other rule catches.
 *
 * USPS carries this street address's mail to a PO Box. The house is confirmed,
 * occupied and on an active route, so dpvConfirmation is Y, dpvNoStat is N,
 * dpvVacant is N and every other test here passes. Nothing reaches the door.
 *
 * 431 Iowa St in Wiggins came back NO SUCH NUMBER with exactly that profile.
 */
stubUsps({
  dpvConfirmation: "Y",
  dpvVacant: "N",
  dpvNoStat: "N",
  dpvThrowback: "Y",
});
const thrown = await checkAddress(ADDRESS);
check(
  thrown.verdict === "blocked",
  "a throwback address is blocked, though every other flag is clean",
  `got ${thrown.verdict}`,
);
check(
  Boolean(thrown.reason?.toLowerCase().includes("po box")),
  "the throwback reason tells the rep to ask for the box number",
);

// NO SUCH NUMBER: two of the five envelopes.
stubUsps({ dpvConfirmation: "N" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "dpvConfirmation N is blocked (NO SUCH NUMBER)",
);

/*
 * An empty dpvConfirmation is INCONCLUSIVE, not negative.
 *
 * This first asserted that empty must block, on the reasoning that treating a
 * missing answer as a pass is how a validator stops validating. Google
 * documents empty as "not submitted for verification": USPS did not say no,
 * it did not run. Blocking on it refused our own office address, because
 * Google standardises 6668 U.S. 98 into a form DPV never ran against, and it
 * would have refused any rep standing at a similar address.
 *
 * Unknown lets the mailer through and records it as unverified, which is the
 * same fail-open rule the outage path uses: block on evidence, never on the
 * absence of it.
 */
stubUsps({ dpvVacant: "N" });
const noDpv = await checkAddress(ADDRESS);
check(
  noDpv.verdict === "unknown",
  "a missing dpvConfirmation is inconclusive, not a refusal",
  `got ${noDpv.verdict}`,
);
check(
  noDpv.reachable,
  "an inconclusive answer still counts as USPS having been reached",
);

stubUsps({ dpvConfirmation: "D" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "dpvConfirmation D is blocked (unit number missing)",
);

stubUsps({ dpvConfirmation: "S" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "dpvConfirmation S is blocked (unit number not recognised)",
);

// NOT DELIVERABLE AS ADDRESSED: the PO Box town case.
stubUsps({ dpvConfirmation: "Y", dpvNoStat: "Y" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "a confirmed but inactive delivery point is blocked (NO STAT)",
);

stubUsps({ dpvConfirmation: "Y", dpvVacant: "Y" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "a vacant address is blocked",
);

stubUsps({ dpvConfirmation: "Y", carrierRoute: "B012" });
check(
  (await checkAddress(ADDRESS)).verdict === "blocked",
  "a PO Box section carrier route is blocked",
);

stubUsps({ dpvConfirmation: "Y", carrierRoute: "R001" });
check(
  (await checkAddress(ADDRESS)).verdict === "mailable",
  "a rural route is mailable, because rural is not the problem",
);

// Every block has to tell the rep something they can act on.
stubUsps({ dpvConfirmation: "N" });
const blocked = await checkAddress(ADDRESS);
check(
  Boolean(blocked.reason && blocked.reason.length > 20),
  "a block comes with a reason the rep can act on",
  blocked.reason ?? "(no reason given)",
);

/* ------------------------------------------------------------------ */
/* 2. It fails OPEN. This is the invariant that protects the business  */
/* ------------------------------------------------------------------ */
console.log("\nAn outage does not become a work stoppage");

stubUsps(null, 403); // the API not enabled on the project
check(
  (await checkAddress(ADDRESS)).verdict === "unknown",
  "a 403 degrades to unknown, not blocked",
);

stubUsps(null, 500);
check(
  (await checkAddress(ADDRESS)).verdict === "unknown",
  "a 500 degrades to unknown, not blocked",
);

globalThis.fetch = (async () => {
  throw new Error("network down");
}) as typeof fetch;
check(
  (await checkAddress(ADDRESS)).verdict === "unknown",
  "an unreachable network degrades to unknown, not blocked",
);

stubUsps({}); // answered, but said nothing about DPV
const bare = await checkAddress(ADDRESS);
check(bare.verdict === "unknown", "an answer with no DPV at all is inconclusive");
check(bare.reachable, "but it still counts as the API working");

// The distinction the health probe depends on: unreachable is false,
// answered-but-inconclusive is true. Confusing the two reported a correctly
// enabled API as broken for a week.
globalThis.fetch = (async () => {
  throw new Error("down");
}) as typeof fetch;
check(
  (await checkAddress(ADDRESS)).reachable === false,
  "an unreachable API is not reachable",
);
stubUsps({ dpvConfirmation: "Y" });
check(
  (await checkAddress(ADDRESS)).reachable === true,
  "a working API is reachable",
);

globalThis.fetch = realFetch;

/* ------------------------------------------------------------------ */
/* 3. The block is wired to the only door into the queue               */
/* ------------------------------------------------------------------ */
console.log("\nThe request door enforces it");

const route = read("src/app/api/pin/mail/route.ts");
check(
  route.includes("checkAddress"),
  "the mail route checks the address on a request",
);
check(
  /verdict === "blocked"[\s\S]{0,400}status: 422/.test(route),
  "a blocked address refuses the request with 422",
);
check(
  route.indexOf("checkAddress") < route.indexOf("await requestMail"),
  "the check runs BEFORE the mailer is queued, not after",
);

/* ------------------------------------------------------------------ */
/* 4. Returned mail is recordable, and recording it keeps history      */
/* ------------------------------------------------------------------ */
console.log("\nReturned mail has somewhere to go");

const delivery = read("src/lib/quotes/delivery.ts");
const schema = read("src/lib/quotes/schema.sql");

check(
  /MailStatus =[^;]*"returned"/.test(delivery),
  "returned is a real mail status",
);
check(
  /CHECK \(mail_status IN \('requested','mailed','rejected','returned'\)\)/.test(
    schema,
  ),
  "the schema admits the returned state",
);

// The September lesson: a state change must not destroy the record of the
// state it came from. Re-requesting a mailer used to wipe the handling
// columns, and the owner watched his counts fall overnight.
const markReturned = delivery.slice(
  delivery.indexOf("export async function markReturned"),
  delivery.indexOf("export async function recordAddressCheck"),
);
check(
  markReturned.length > 0 && !/mail_handled_at\s*=\s*(NULL|null)/i.test(markReturned),
  "marking returned does not erase when it was posted",
);
check(
  /COALESCE\(mail_handled_by/.test(markReturned),
  "marking returned does not erase who posted it",
);
check(
  !/sent_at\s*=/.test(markReturned) && !/sent_via\s*=/.test(markReturned),
  "marking returned leaves sent_via and sent_at alone, because it was sent",
);

const counts = delivery.slice(delivery.indexOf("export async function mailCounts"));
check(
  /returned: seen\.returned\.size/.test(counts),
  "the tab counts include returned, so Posted stops overstating",
);

/* ------------------------------------------------------------------ */
/* 5. A switched-off API cannot hide                                   */
/* ------------------------------------------------------------------ */
console.log("\nA validator that is not running says so");

const health = read("src/app/api/pin/health/route.ts");
check(
  health.includes("addressCheck"),
  "the health endpoint publishes whether address checking works",
);
check(
  health.includes("checkAddress"),
  "it probes live rather than just looking at configuration",
);
/*
 * WHAT THE PROBE GRADES, which has now been wrong twice in opposite
 * directions, so both failures are pinned here.
 *
 * Grading verdict === "mailable" reported a working API as broken for a week,
 * because the probe address was a government building USPS will not take mail
 * at. Grading probe.reachable then reported a BROKEN validator as healthy for
 * five days, because a malformed request returns a perfectly good 200.
 *
 * reachable AND dpvRan is the pair that separates the three states that
 * matter: cannot reach USPS, reached USPS but asked it nothing, asked properly
 * and got an answer. Only the third is working.
 */
check(
  /ok: probe\.reachable && probe\.dpvRan/.test(health),
  "the probe grades that USPS actually ran a delivery point check",
  "a 200 proves the request succeeded, not that anything was validated",
);
check(
  !/siteConfig\.address/.test(health.slice(0, health.indexOf("autocompleteProbe"))),
  "the probe does not use our own office, whose DPV is legitimately empty",
  "an address that never returns DPV cannot detect a request that never asks for it",
);
const deployCheck = read("scripts/post-deploy-check.mjs");
check(
  deployCheck.includes('"addressCheck":true'),
  "the deploy check fails when addresses are going out unverified",
);
// The probes are billed, so they are opt in. The deploy check has to actually
// ask for them or it asserts a field that is never present.
check(
  deployCheck.includes("probe=1"),
  "the deploy check asks for the paid probes explicitly",
);

console.log(
  failures === 0
    ? "\nAll mail return checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
