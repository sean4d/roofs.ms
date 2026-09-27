import { readFileSync } from "node:fs";

/**
 * A quote the website made has to stay visible.
 *
 * WHY THIS EXISTS. A homeowner in Petal ran the instant estimator, got the
 * email, tapped the link she was sent, and the site answered 404. The link was
 * fine. The row was there. The query could not see it.
 *
 * savePublicQuote writes created_by NULL on purpose: nobody on the team made
 * that quote, the estimator did, and NULL is what makes the office scoping
 * rule show it to admins and hide it from reps. But two read paths joined the
 * users table with a plain JOIN:
 *
 *   FROM quotes q JOIN users u ON u.id = q.created_by
 *
 * An inner join on a NULL foreign key matches nothing, so every website quote
 * ever written was invisible to both of them. getProposalByToken returned
 * null and the homeowner's own link 404'd. searchQuotes returned nothing and
 * the estimates screen looked empty, while quoteStats, which never joined
 * users, still counted the same rows in its headline number.
 *
 * Nothing about this trips a type error or shows up in a screenshot: the page
 * renders a normal 404 and the list renders a normal empty state. Both look
 * like the absence of data rather than a defect. So it is asserted here.
 *
 * Run: npm run check:website-quotes
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
  readFileSync(new URL(`../src/${rel}`, import.meta.url), "utf8");

const save = read("lib/quotes/save.ts");
const list = read("lib/quotes/list.ts");
const publicQuote = read("lib/quotes/public-quote.ts");

/* ------------------------------------------------------------------ */
/* 1. The premise: website quotes really do carry a NULL rep           */
/* ------------------------------------------------------------------ */
console.log("\nA website quote has no rep");

check(
  /INSERT INTO quotes[\s\S]*?created_by[\s\S]*?VALUES[\s\S]*?::uuid,\s*NULL/.test(
    publicQuote,
  ),
  "savePublicQuote still inserts created_by NULL",
  "If this ever changes, the joins below can go back to being inner joins.",
);

/* ------------------------------------------------------------------ */
/* 2. Every read path that joins users must tolerate that NULL         */
/* ------------------------------------------------------------------ */
console.log("\nNo read path inner-joins users on created_by");

// Any JOIN on created_by that is not preceded by LEFT drops website rows.
const innerJoin =
  /(?<!LEFT\s)JOIN\s+users\s+\w+\s+ON\s+\w+\.id\s*=\s*q\.created_by/g;

for (const [name, src] of [
  ["save.ts", save],
  ["list.ts", list],
] as const) {
  const hits = src.match(innerJoin) ?? [];
  check(
    hits.length === 0,
    `${name} joins users LEFT, not INNER`,
    hits.length ? `found: ${hits.join(" | ")}` : undefined,
  );
  check(
    /LEFT JOIN\s+users\s+\w+\s+ON\s+\w+\.id\s*=\s*q\.created_by/.test(src),
    `${name} still joins users at all, and does it LEFT`,
  );
}

/* ------------------------------------------------------------------ */
/* 3. A NULL rep email must render as the company, not crash or blank  */
/* ------------------------------------------------------------------ */
console.log("\nA missing rep name falls back to the company");

check(
  /repDisplayName\(\s*email:\s*string\s*\|\s*null\s*\)/.test(save),
  "save.ts repDisplayName accepts null",
);
check(
  /rep_email:\s*string\s*\|\s*null/.test(save),
  "save.ts Row types rep_email as nullable",
);
check(
  /repName\s*=\s*\(\s*email:\s*string\s*\|\s*null\s*\)/.test(list),
  "list.ts repName accepts null",
);
check(
  /rep_email:\s*string\s*\|\s*null/.test(list),
  "list.ts Raw types rep_email as nullable",
);

// Both helpers have to produce a printable name rather than an empty string,
// because it goes in the footer of a document a customer reads.
check(
  /if\s*\(!local\)\s*return\s*"Southeast Roofing"/.test(save),
  'save.ts falls back to "Southeast Roofing"',
);
check(
  /\|\|\s*"Southeast Roofing"/.test(list),
  'list.ts falls back to "Southeast Roofing"',
);

/* ------------------------------------------------------------------ */
/* 4. The token route still exists and is reachable                    */
/* ------------------------------------------------------------------ */
console.log("\nThe homeowner's link resolves");

const page = readFileSync(
  new URL("../src/app/estimate/[token]/page.tsx", import.meta.url),
  "utf8",
);
check(
  page.includes("getProposalByToken"),
  "/estimate/[token] still loads by token",
);
check(
  /token\.length\s*<\s*(\d+)/.test(save) &&
    Number(/token\.length\s*<\s*(\d+)/.exec(save)![1]) <= 32,
  "the token length floor does not reject a real 32 character token",
  "randomBytes(24).toString('base64url') is 32 characters.",
);

console.log(
  failures === 0
    ? "\nAll website quote checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
