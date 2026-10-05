/**
 * Real USPS state and territory codes.
 *
 * Shared because two places now need it and a second copy is a second thing to
 * drift. The address box uses it to decide whether a parse is trustworthy
 * enough to overwrite fields the customer typed; the mail validator uses it to
 * decide whether it can split a stored address into the components USPS needs.
 *
 * Both of them previously accepted any two capital letters, which parsed
 * "London, UK" as the state "UK". Neither path can receive that today, but
 * both overwrite or gate on the result, and a bad parse is worse than no
 * parse. The guard costs one lookup.
 *
 * No "server-only" here on purpose: this is a plain constant and the address
 * box is a client component.
 */
export const US_STATES = new Set(
  ("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS " +
    "MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV " +
    "WI WY DC AS GU MP PR VI AA AE AP").split(" "),
);
