import "server-only";

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
 *   carrierRoute     a leading B means a PO Box section rather than a route
 *                       somebody drives.
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

export interface AddressCheck {
  verdict: MailVerdict;
  /** Did USPS answer at all? Separate from what the answer was. */
  reachable: boolean;
  /** Shown to the rep, so it has to name the fix, not the error. */
  reason: string | null;
  /** USPS's own spelling of the address, when it gave one. */
  standardized: string | null;
  dpv: string | null;
  vacant: boolean;
  noStat: boolean;
  carrierRoute: string | null;
}

const UNKNOWN = (reason: string, reachable = false): AddressCheck => ({
  verdict: "unknown",
  reachable,
  reason,
  standardized: null,
  dpv: null,
  vacant: false,
  noStat: false,
  carrierRoute: null,
});

interface UspsData {
  dpvConfirmation?: string;
  dpvVacant?: string;
  dpvNoStat?: string;
  dpvCmra?: string;
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
export async function checkAddress(address: string): Promise<AddressCheck> {
  const key = process.env.GOOGLE_MAPS_SERVER_KEY;
  if (!key) return UNKNOWN("Address checking is not configured.");
  if (!address || address.trim().length < 5) {
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
      body: JSON.stringify({
        address: { regionCode: "US", addressLines: [address] },
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
  const carrierRoute = usps.carrierRoute ?? null;
  const standardized = formatStandardized(usps);
  const base = {
    reachable: true,
    standardized,
    dpv: dpv || null,
    vacant,
    noStat,
    carrierRoute,
  };

  const block = (reason: string): AddressCheck => ({
    verdict: "blocked",
    reason,
    ...base,
  });

  /*
   * AN EMPTY dpvConfirmation IS NOT A REFUSAL, and treating it as one was a
   * live bug that refused real mailers.
   *
   * This first blocked on `dpv === "N" || dpv === ""`, on the reasoning that
   * treating a missing answer as a pass is how a validator quietly stops
   * validating. That reasoning is right about "Y" and wrong about "N". Google
   * documents an empty value as "the address was not submitted for
   * verification", which is an INCONCLUSIVE result, not a negative one: USPS
   * did not say no, it did not run.
   *
   * Our own office proved it. 6668 U.S. 98 comes back with USPS data attached
   * and no dpvConfirmation at all, so the office address of the company
   * sending the mail was refused. Any address Google standardises oddly, and a
   * numbered highway is only the obvious case, would have been refused the
   * same way, in front of a rep standing in the driveway.
   *
   * So empty degrades to unknown, on the same principle as an unreachable API:
   * block on evidence, never on the absence of it. The mailer goes out
   * recorded as unverified, which is exactly what it is.
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
