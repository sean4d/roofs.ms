import { readFileSync } from "node:fs";

import { checkAddress } from "@/lib/quotes/address-check";

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
console.log("\nWhat the validator does with each USPS answer");

// checkAddress reads the key when it is called, not when it is imported, so
// setting it here is enough. The stubbed fetch below means it never leaves.
process.env.GOOGLE_MAPS_SERVER_KEY ??= "test-key";

const realFetch = globalThis.fetch;
function stubUsps(uspsData: Record<string, string> | null, status = 200) {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify(uspsData ? { result: { uspsData } } : {}), {
      status,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;
}

const ADDRESS = "100 Janesville Rd, Mt. Olive, MS 39119";

stubUsps({ dpvConfirmation: "Y", dpvVacant: "N", dpvNoStat: "N" });
check(
  (await checkAddress(ADDRESS)).verdict === "mailable",
  "a confirmed, occupied, active address is mailable",
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
check(
  /ok: probe\.reachable/.test(health),
  "the probe grades reachability, not whether one address is mailable",
  "grading on mailable reported a working API as broken for a week",
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
