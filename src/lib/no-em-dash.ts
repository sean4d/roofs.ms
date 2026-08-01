/**
 * Em dashes are not used anywhere on this site (owner directive 2026-08-01).
 * Copy we author is already clean, but some text is fetched at runtime and we
 * don't control how it was typed: Google review bodies and the owner's public
 * replies come back from the GBP API exactly as they were written.
 *
 * So the dash is removed at render time instead. Punctuation only, never
 * wording, a reviewer's words stay a reviewer's words.
 *
 * The dash is built from its code point rather than typed. A literal one in
 * this file would be a leftover in the very source tree it exists to keep
 * clean, and the site-wide sweep would rewrite these patterns out from under
 * it (which is exactly how the CMS cleanup broke the first time).
 */
const EM_DASH = String.fromCharCode(0x2014);

/** Openers that start a clause with their own subject. A comma after one of
 *  these is a splice, so the sentence gets broken in two instead. */
const CLAUSE_OPENER =
  /^(we|i|it|they|you|he|she|there|that|this|these|those)(['’]\w+)?\s/i;

/** A coordinating conjunction keeps the clause attached, so a comma stays
 *  correct even when a full subject follows ("and it means a lot"). */
const COORDINATOR = /^(and|but|or|so|yet|nor)\s/i;

/**
 * Replace every em dash with punctuation that leaves the sentence grammatical.
 *
 * A blind comma would manufacture splices wherever the dash joined two
 * standalone clauses, so what follows the dash decides. Examples, with [-] for
 * the dash itself (a literal one here would defeat the point of the file):
 *
 *   "...efficient [-] and it means a lot" -> "...efficient, and it means a lot"
 *   "Great crew [-] they showed up early" -> "Great crew. They showed up early"
 *   "...smooth, [-] professional"         -> "...smooth, professional"
 *
 * Only the dash itself is rewritten. Where a full stop goes in, the following
 * letter is capitalised because that stop is new; every other capital in the
 * string is left exactly as the writer typed it.
 */
export function stripEmDashes(input: string): string {
  if (!input.includes(EM_DASH)) return input;

  let out = "";
  let rest = input;

  for (;;) {
    const at = rest.indexOf(EM_DASH);
    if (at === -1) {
      out += rest;
      return out;
    }

    const before = (out + rest.slice(0, at)).replace(/\s+$/, "");
    let after = rest.slice(at + EM_DASH.length).replace(/^\s+/, "");

    let joint: string;
    if (/[,;:]$/.test(before)) {
      // Punctuation already carries the break; the dash is redundant.
      joint = " ";
    } else if (COORDINATOR.test(after)) {
      joint = ", ";
    } else if (CLAUSE_OPENER.test(after)) {
      joint = ". ";
      after = after.charAt(0).toUpperCase() + after.slice(1);
    } else {
      joint = ", ";
    }

    out = before + joint;
    rest = after;
  }
}

/** Convenience wrapper for optional fields. */
export function cleanCopy<T extends string | undefined>(input: T): T {
  return (input ? (stripEmDashes(input) as T) : input);
}
