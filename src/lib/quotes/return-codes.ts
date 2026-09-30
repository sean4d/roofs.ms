/**
 * Why USPS sent it back, in their words off the yellow label.
 *
 * ITS OWN MODULE BECAUSE THE MAIL BOARD IS A CLIENT COMPONENT. These lived in
 * delivery.ts, which imports the database and is marked server-only, so the
 * moment the board imported the list as a value rather than a type the whole
 * build refused. A list of nine strings has no business dragging a Postgres
 * client into the browser bundle.
 *
 * The codes are not interchangeable and the office should not have to free-type
 * them. NO SUCH NUMBER is a bad house number, and it usually means the
 * measurement was of the wrong building too. NOT DELIVERABLE and NO MAIL
 * RECEPTACLE usually mean a PO Box town, where the house is real and the mail
 * simply does not go there. VACANT and UNCLAIMED are about the people rather
 * than the address, so the address stays good for whoever moves in next.
 *
 * Free text loses all of that inside a week.
 */
export const RETURN_CODES = {
  "no-such-number": "No such number",
  "not-deliverable": "Not deliverable as addressed",
  insufficient: "Insufficient address",
  vacant: "Vacant",
  unclaimed: "Unclaimed",
  refused: "Refused",
  "no-receptacle": "No mail receptacle",
  moved: "Moved, left no address",
  other: "Other",
} as const;

export type ReturnCode = keyof typeof RETURN_CODES;

/**
 * Does this return mean the address itself is bad?
 *
 * The distinction that matters for anything built on top of this later. A
 * house that came back UNCLAIMED is still a house worth mailing; one that came
 * back NO SUCH NUMBER never was.
 */
export const ADDRESS_FAULT: ReadonlySet<ReturnCode> = new Set([
  "no-such-number",
  "not-deliverable",
  "insufficient",
  "no-receptacle",
]);
