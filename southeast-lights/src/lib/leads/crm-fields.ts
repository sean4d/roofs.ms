/**
 * The fields a CRM needs, derived from what the customer actually typed.
 *
 * Roofr's "Create Job and Customer" action requires first name, last name,
 * address, city, state, postal code and country as SEPARATE fields, and
 * rejects the job card when a required one is blank. This site asks for
 * "Property address" in a single box and "Name" in another, which is the
 * right thing to ask a homeowner and the wrong shape for the CRM.
 *
 * So the lead email carries both: the raw values as the customer wrote them,
 * and these split-out parts on their own labelled lines, so an email parser
 * has one clean chunk per CRM field and never has to guess where a city ends.
 *
 * The roofing site solves the same problem by geocoding, because its form asks
 * for "City or ZIP" and there is nothing to split. This form asks for a whole
 * address, so the parts are already present in the string and no network call
 * belongs in the path of a lead.
 *
 * NOTHING HERE IS EVER FATAL, and nothing is invented. A value that cannot be
 * read with confidence is left out rather than guessed at, because a blank
 * field in Roofr is a five second fix and a wrong city is a van in the wrong
 * town.
 */

/** USPS codes, including DC and the territories Roofr accepts. */
const STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
  "WV", "WI", "WY", "PR", "VI", "GU", "AS", "MP",
]);

export interface AddressParts {
  /** Street line, e.g. "3705 Mable St". */
  street?: string;
  city?: string;
  /** Two-letter USPS code, upper-cased. */
  state?: string;
  /** Five digit ZIP, or ZIP+4 as written. */
  postal?: string;
}

/**
 * Split a US address string into its parts.
 *
 * Reads from the end, because the end of a US address is the predictable
 * part: the ZIP is digits, the state is a known code, and whatever is left
 * is street and city. The city is only reported when a comma marks where it
 * begins, since "3705 Mable St Hattiesburg" has no reliable boundary between
 * a street name and a city name.
 */
export function splitAddress(input: string): AddressParts {
  let rest = input.replace(/\s+/g, " ").trim();
  if (!rest) return {};

  const parts: AddressParts = {};

  // Trailing country, which some browsers autofill and Roofr sets separately.
  rest = rest.replace(/,?\s*(united states(\s+of\s+america)?|usa|us)\.?$/i, "").trim();

  const zip = rest.match(/(\d{5}(?:-\d{4})?)\s*$/);
  if (zip) {
    parts.postal = zip[1];
    rest = rest.slice(0, zip.index).replace(/[,\s]+$/, "");
  }

  const state = rest.match(/(?:^|[,\s])([A-Za-z]{2})\s*$/);
  if (state && STATE_CODES.has(state[1].toUpperCase())) {
    parts.state = state[1].toUpperCase();
    rest = rest.slice(0, state.index).replace(/[,\s]+$/, "");
  }

  const segments = rest
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    parts.city = segments[segments.length - 1];
    parts.street = segments.slice(0, -1).join(", ");
  } else if (segments.length === 1) {
    // One segment and no comma. If a street number opens it, it is a street
    // and the city was never given. Otherwise it is a bare city or town.
    if (/^\d/.test(segments[0])) parts.street = segments[0];
    else parts.city = segments[0];
  }

  return parts;
}

export interface NameParts {
  first?: string;
  last?: string;
}

/**
 * Split a full name into the two fields a CRM asks for.
 *
 * First token is the given name, everything after it is the family name, so
 * "Mary Beth Van Horn" keeps "Van Horn" together rather than dropping it. A
 * single word goes in the family name, which is the field CRMs mark required.
 */
export function splitName(input: string): NameParts {
  const tokens = input.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!tokens.length) return {};
  if (tokens.length === 1) return { last: tokens[0] };
  return { first: tokens[0], last: tokens.slice(1).join(" ") };
}
