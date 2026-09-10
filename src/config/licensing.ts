/**
 * What Mississippi actually requires, in one place.
 *
 * WRITTEN BECAUSE THE SITE OVERCLAIMED. When the commercial certificate
 * arrived, copy went out saying "commercial work in Mississippi requires that
 * certificate" and that a certificate "requires trade and business
 * examinations, a reviewed or audited financial statement". Both are close
 * enough to sound right and neither is what the board says. Mississippi
 * licensing turns on the size of the job, not on the existence of a job, and
 * the application requirements we happened to meet are not a general rule we
 * get to state on behalf of the state.
 *
 * Every threshold below is quoted from the Mississippi State Board of
 * Contractors' own FAQ, verified 2026-09-10. If MSBOC changes a number, change
 * it here and it changes everywhere: nothing on the site should restate a
 * dollar figure in its own words.
 *
 * THE RULE FOR WRITING ABOUT THIS: describe OUR credential as a fact, and the
 * LAW as the board states it, with a link. Never merge the two into "you must
 * hire someone like us". Below the state threshold there can still be city or
 * county requirements, and MSBOC's FAQ does not address those, so the site
 * says local requirements "may" apply and does not put that in the board's
 * mouth.
 */

export const MSBOC = {
  /** The board's legal name, spelled the way it spells itself. */
  name: "Mississippi State Board of Contractors",
  /** What Mississippi calls a commercial contractor licence. */
  commercialCredential: "Commercial Certificate of Responsibility",
  /** Verbatim from the MSBOC FAQ, 2026-09-10. */
  commercialThreshold:
    "All contractors and subcontractors performing work on commercial jobs over $50,000, including equipment installation, are required to have a commercial license issued by MSBOC.",
  /** Verbatim from the MSBOC FAQ, 2026-09-10. */
  residentialThreshold:
    "All contractors performing new residential construction over $50,000, residential remodeling or additions over $10,000, or residential roofing over $10,000, are required to have a license issued by MSBOC.",
  /** The figure that actually governs most of our residential work. */
  residentialRoofingThreshold: "$10,000",
  commercialJobThreshold: "$50,000",
} as const;

/**
 * One sentence for a commercial page, accurate and short.
 *
 * Says what the threshold is, does not imply every job of every size needs a
 * licence, and does not claim to be legal advice.
 */
export const COMMERCIAL_THRESHOLD_SENTENCE =
  "Mississippi requires a commercial license for commercial jobs over $50,000. Below that, local city or county requirements may still apply.";

/** The same idea for residential roofing, where the figure is much lower. */
export const RESIDENTIAL_THRESHOLD_SENTENCE =
  "Mississippi requires a residential license for residential roofing work over $10,000, which is most roof replacements.";
