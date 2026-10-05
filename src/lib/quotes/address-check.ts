import "server-only";

import { US_STATES } from "@/lib/us-states";

/**
 * Is this a real place the Postal Service will carry mail to?
 *
 * WHY THIS EXISTS. Five envelopes came back in September 2026:
 *
 *   526 Mary Grove Church Rd, Mendenhall    NO SUCH NUMBER
 *   100 Janesville Rd, Mt. Olive            NO SUCH NUMBER
 *   524 W Border Ave, Wiggins               NOT DELIVERABLE AS ADDRESSED
 *   1023 Clubhouse Dr, Wiggins              INSUFFICIENT ADDRESS
 *   68 Peps Point Rd, Hattiesburg           UNCLAIMED
 *
 * Four of those five are knowable before anything is printed. Only UNCLAIMED
 * is not: that one means the carrier turned up and nobody took it, which no
 * database can predict.
 *
 * Measuring a roof and printing an address are different questions and we were
 * only asking the first. Google's geocoder answers "where is this", generously,
 * and will invent a house number by interpolating along a rural road rather
 * than admit it does not know. The Address Validation API answers the question
 * that actually decides whether a stamp is wasted: does the USPS delivery point
 * file contain this address, is anybody living there, and is it active.
 *
 * WHAT THE CODES MEAN, because the names do not say it.
 *
 *   dpvConfirmation  Y  in the file, primary and any secondary confirmed
 *                    D  primary confirmed, a unit number is MISSING
 *                    S  primary confirmed, the unit number given is not real
 *                    N  not confirmed. This is NO SUCH NUMBER.
 *   dpvVacant        Y  a real address nobody has occupied for 90+ days
 *   dpvNoStat        Y  real, in the file, and NOT an active delivery point.
 *                       Rural Mississippi is full of these: the house exists,
 *                       the mail goes to a PO Box in town. This is the
 *                       NOT DELIVERABLE AS ADDRESSED case.
 *   dpvThrowback     Y  the street address is real, and USPS carries its mail
 *                       to a PO Box instead. Nothing is delivered to the
 *                       house. This is the other half of the Mississippi case
 *                       dpvNoStat covers, and it is a separate flag.
 *   carrierRoute     a leading B means a PO Box section rather than a route
 *                       somebody drives.
 *
 * HOW THE QUESTION IS ASKED DECIDES WHETHER IT IS ANSWERED AT ALL, and getting
 * that wrong made this entire file a no-op for its first five days in
 * production. See sendable() below. Short version: the whole address on one
 * addressLines entry returns a standardised string, a carrier route and NO DPV
 * FIELDS. Split into street / city / state / ZIP it returns the full delivery
 * point record. Same key, same endpoint, same address, same enableUspsCass.
 *
 * Because dpvConfirmation was therefore always empty, and because empty exits
 * early below, no mailer was ever blocked for any reason: not NO SUCH NUMBER,
 * not vacant, not NO STAT. Thirteen envelopes came home across September and
 * early October with the validator reporting healthy throughout.
 *
 * WHAT HAPPENS WHEN GOOGLE IS DOWN. It does not block. A hard block on an
 * outage would stop the office posting anything at all because a third party
 * had a bad afternoon, which trades a $0.78 problem for a business-stopping
 * one. An unreachable API returns "unknown", the mailer is allowed through,
 * and the quote records that it went out unverified so the board can say so.
 * Refusing to distinguish "USPS says no" from "we could not ask" is how a
 * safety feature turns into an outage.
 */

export type MailVerdict = "mailable" | "blocked" | "unknown";

/**
 * An address in the pieces USPS wants. Callers that already hold the parts
 * should pass them; a caller holding one string gets them split out by
 * splitAddress below.
 */
export interface AddressParts {
  street: string;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface AddressCheck {
  verdict: MailVerdict;
  /** Did USPS answer at all? Separate from what the answer was. */
  reachable: boolean;
  /**
   * Did the DELIVERY POINT check actually run, as opposed to the request
   * merely succeeding? This is the field that distinguishes a validator doing
   * its job from one that has been answering "unknown" to everything since the
   * day it shipped, which is why the health probe grades it.
   */
  dpvRan: boolean;
  /** Shown to the rep, so it has to name the fix, not the error. */
  reason: string | null;
  /** USPS's own spelling of the address, when it gave one. */
  standardized: string | null;
  dpv: string | null;
  vacant: boolean;
  noStat: boolean;
  /** USPS carries this street address's mail to a PO Box, not to the door. */
  throwback: boolean;
  carrierRoute: string | null;
}

const UNKNOWN = (reason: string, reachable = false): AddressCheck => ({
  verdict: "unknown",
  reachable,
  dpvRan: false,
  reason,
  standardized: null,
  dpv: null,
  vacant: false,
  noStat: false,
  throwback: false,
  carrierRoute: null,
});

/**
 * Split "505 E Bond Ave, Wiggins, MS 39577" into the pieces USPS answers for.
 *
 * THIS IS THE FIX. Everything else in this file was already right and did
 * nothing, because the request never carried these pieces separately and so
 * DPV never ran. See the header.
 *
 * It returns null rather than guessing when it cannot find a real state code
 * at the end, and the caller then sends the single line it was given. That
 * path yields no DPV, which now reports honestly as "did not run" instead of
 * passing silently for a delivery check that never happened.
 *
 * The state guard is the same one the address box uses, and for the same
 * reason: without it any two capital letters parse as a state, so "London, UK"
 * becomes state "UK". A wrong split sends USPS a different address from the
 * one on the envelope, which is a worse failure than not splitting.
 */
export function splitAddress(input: string): AddressParts | null {
  const bits = input
    .split(",")
    .map((b) => b.trim())
    .filter((b) => b && b.toUpperCase() !== "USA" && b.toUpperCase() !== "US");
  // Street, city, and a state/ZIP tail: three pieces at the very least.
  if (bits.length < 3) return null;

  const tail = bits[bits.length - 1];
  const m = /^([A-Za-z]{2})(?:\s+(\d{5})(?:-\d{4})?)?$/.exec(tail);
  if (!m) return null;
  const state = m[1].toUpperCase();
  if (!US_STATES.has(state)) return null;

  return {
    // Everything before the city is the street, so a secondary line like
    // "Suite F" stays attached to it rather than being mistaken for the city.
    street: bits.slice(0, -2).join(", "),
    city: bits[bits.length - 2],
    state,
    zip: m[2] ?? null,
  };
}

interface UspsData {
  dpvConfirmation?: string;
  dpvVacant?: string;
  dpvNoStat?: string;
  dpvCmra?: string;
  dpvThrowback?: string;
  carrierRoute?: string;
  standardizedAddress?: {
    firstAddressLine?: string;
    cityName?: string;
    state?: string;
    zipCode?: string;
    zipCodeExtension?: string;
  };
}

function formatStandardized(u: UspsData): string | null {
  const s = u.standardizedAddress;
  if (!s?.firstAddressLine) return null;
  const zip = [s.zipCode, s.zipCodeExtension].filter(Boolean).join("-");
  return [s.firstAddressLine, s.cityName, [s.state, zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
}

/**
 * Ask Google's Address Validation API, with USPS CASS data switched on.
 *
 * enableUspsCass is what makes uspsData come back at all. Without it the
 * response is Google's own opinion of the address, which is the opinion that
 * produced the returned envelopes in the first place.
 */
export async function checkAddress(
  address: string | AddressParts,
): Promise<AddressCheck> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return UNKNOWN("Address checking is not configured.");

  const parts =
    typeof address === "string"
      ? (splitAddress(address) ?? { street: address })
      : address;
  if (!parts.street || parts.street.trim().length < 5) {
    return UNKNOWN("There is no address on this estimate to check.");
  }

  let usps: UspsData;
  try {
    const url = new URL(
      "https://addressvalidation.googleapis.com/v1:validateAddress",
    );
    url.searchParams.set("key", key);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      /*
        THE SHAPE OF THIS BODY IS THE WHOLE FEATURE.

        locality, administrativeArea and postalCode are what make USPS run the
        delivery point check. With the same address flattened into one
        addressLines entry the API returns 200, sets cassProcessed: true, hands
        back a standardised address and a carrier route, and omits every dpv*
        field. Nothing in the response says it did not run. It just quietly
        answers a different, easier question, and every verdict below becomes
        unreachable.

        Verified against the thirteen envelopes that actually came back: one
        line caught 0 of 13, the split caught 9.
      */
      body: JSON.stringify({
        address: {
          regionCode: "US",
          addressLines: [parts.street],
          ...(parts.city ? { locality: parts.city } : {}),
          ...(parts.state ? { administrativeArea: parts.state } : {}),
          ...(parts.zip ? { postalCode: parts.zip } : {}),
        },
        enableUspsCass: true,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      // A 403 here is nearly always the API not being enabled on the project,
      // which is a setup problem and not this address's fault.
      return UNKNOWN(`Address check unavailable (${res.status}).`);
    }
    const data = (await res.json()) as { result?: { uspsData?: UspsData } };
    if (!data.result?.uspsData) {
      // The API answered, it just had nothing on this address.
      return UNKNOWN("USPS had no record either way for this address.", true);
    }
    usps = data.result.uspsData;
  } catch {
    return UNKNOWN("Address check could not be reached.");
  }

  const dpv = usps.dpvConfirmation ?? "";
  const vacant = usps.dpvVacant === "Y";
  const noStat = usps.dpvNoStat === "Y";
  const throwback = usps.dpvThrowback === "Y";
  const carrierRoute = usps.carrierRoute ?? null;
  const standardized = formatStandardized(usps);
  const base = {
    reachable: true,
    dpvRan: dpv !== "",
    standardized,
    dpv: dpv || null,
    vacant,
    noStat,
    throwback,
    carrierRoute,
  };

  const block = (reason: string): AddressCheck => ({
    verdict: "blocked",
    reason,
    ...base,
  });

  /*
   * AN EMPTY dpvConfirmation IS NOT A REFUSAL. That is still true, and it is
   * now true for a much narrower set of addresses than when it was written.
   *
   * The history is worth keeping straight, because the first two versions of
   * this comment were both wrong in instructive ways.
   *
   * V1 blocked on `dpv === "N" || dpv === ""`, reasoning that treating a
   * missing answer as a pass is how a validator quietly stops validating.
   * V2 changed empty to unknown, because V1 refused our own office at
   * 6668 U.S. 98, and concluded that Google standardises some addresses into a
   * form DPV never runs against.
   *
   * V2's FIX WAS RIGHT AND ITS DIAGNOSIS WAS WRONG, which is the dangerous
   * combination. DPV was empty for our office, and for every other address,
   * because the request was malformed (see sendable note on the body above).
   * V2 read a universal symptom as a quirk of one address, and the repair was
   * to stop acting on the only field that mattered. That is how this file came
   * to pass thirteen undeliverable envelopes while reporting healthy.
   *
   * With the request fixed, empty is rare and genuinely inconclusive: our
   * office still returns it, on a real rural route, and still receives mail.
   *
   * A TEMPTING RULE THAT IS NOT HERE. Empty plus no carrier route looked like
   * a clean signal for "USPS has never heard of this", and on the thirteen
   * returned envelopes it caught one more. It also blocked a real address in
   * the control set. One extra catch is not worth refusing somebody's house,
   * so the rule stays out: block on evidence, never on the absence of it.
   *
   * The mailer goes out recorded as unverified, which is what it is.
   */
  if (dpv === "") {
    return {
      ...UNKNOWN("USPS did not run a delivery-point check on this address.", true),
      ...base,
      verdict: "unknown",
    };
  }

  // Order matters: report the most specific fixable thing first, because the
  // reason is what the rep reads and acts on.
  if (dpv === "N") {
    return block(
      "USPS does not have this address as a delivery point. This is the one that comes back stamped NO SUCH NUMBER. Check the house number against the mailbox.",
    );
  }
  if (dpv === "D") {
    return block(
      "USPS needs a unit or apartment number for this address before it can be delivered.",
    );
  }
  if (dpv === "S") {
    return block(
      "USPS does not recognise the unit number on this address. Check it against the door.",
    );
  }
  if (noStat) {
    return block(
      "The house is real but it is not an active delivery point, which usually means the mail goes to a PO Box. An envelope sent here comes back.",
    );
  }
  /*
   * THROWBACK is NoStat's quieter twin and it has to be checked separately.
   *
   * It means USPS carries this street address's mail to a PO Box: the house is
   * confirmed, occupied and on an active route, so dpvConfirmation is Y and
   * dpvNoStat is N, and every other test here passes. Nothing is delivered to
   * the door.
   *
   * 431 Iowa St in Wiggins came back NO SUCH NUMBER with Y / N / N across the
   * board and throwback Y. It is the only one of the thirteen that no other
   * rule catches.
   */
  if (throwback) {
    return block(
      "USPS delivers this street address's mail to a PO Box, not to the house. The address is real; an envelope addressed to the street still comes back. Ask the customer for their box number.",
    );
  }
  if (vacant) {
    return block(
      "USPS has had this address down as vacant for 90 days or more. There is nobody there to read it.",
    );
  }
  if (carrierRoute?.startsWith("B")) {
    return block(
      "This address sits on a PO Box section rather than a delivery route, so a street-addressed envelope will not reach anyone.",
    );
  }

  return { verdict: "mailable", reason: null, ...base };
}
