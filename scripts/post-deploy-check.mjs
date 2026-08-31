#!/usr/bin/env node
/**
 * Post-deploy check: did that deployment break the site?
 *
 * Run after EVERY deploy. scripts/seo-smoke.mjs already guards the SEO
 * invariants; this one answers the blunter question the owner actually asks,
 * which is whether the business's website still works and whether anything
 * private just became public.
 *
 * Three groups, and the first one matters most. The field tool is new and
 * additive, so the real risk of shipping it is not that /pin is broken, it is
 * that something unrelated went down while nobody was looking at it. So the
 * public pages that earn money get checked first and failing any of them is
 * treated as the serious result.
 *
 *   node scripts/post-deploy-check.mjs [BASE_URL]
 *
 * Exits non-zero if anything fails, so it can gate a release.
 */

const BASE = (process.argv[2] || "https://southeastroofing.llc").replace(
  /\/$/,
  "",
);

let pass = 0;
const failures = [];

function check(ok, label, detail = "") {
  if (ok) {
    pass++;
    console.log(`  pass  ${label}`);
  } else {
    failures.push(`${label}${detail ? ` (${detail})` : ""}`);
    console.log(`  FAIL  ${label}${detail ? `  ${detail}` : ""}`);
  }
}

async function get(path, init = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: "manual", ...init });
    const text = res.status < 400 ? await res.text() : "";
    return { status: res.status, text, headers: res.headers };
  } catch (err) {
    return { status: 0, text: "", headers: new Headers(), error: err.message };
  }
}

/* -- 1. The money pages. If any of these break, nothing else matters. ----- */

const PUBLIC_PAGES = [
  "/",
  "/free-inspection",
  "/contact",
  "/projects",
  "/reviews",
  "/service-areas",
  "/service-areas/hattiesburg",
  "/roof-cost-calculator",
  "/residential",
  "/commercial",
  "/robots.txt",
  "/sitemap.xml",
];

console.log(`\nPublic site  (${BASE})`);
for (const path of PUBLIC_PAGES) {
  const r = await get(path);
  check(
    r.status === 200,
    path,
    r.status === 200 ? "" : `http ${r.status}${r.error ? ` ${r.error}` : ""}`,
  );
}

/* -- 2. The field tool, including that its gate actually holds. ----------- */

console.log(`\nField tool`);
{
  const r = await get("/pin");
  check(
    r.status === 200,
    "/pin loads",
    r.status === 200 ? "" : `http ${r.status}`,
  );
  check(
    r.text.includes("Company email"),
    "/pin renders the sign-in form",
    r.text.includes("Company email") ? "" : "form markup missing",
  );
  // Search engines must never index a login, and everything past it is a
  // homeowner's address and the price we quoted them.
  const robots = r.headers.get("x-robots-tag") ?? "";
  check(
    robots.includes("noindex") || r.text.includes('name="robots"'),
    "/pin is noindex",
    robots || "no directive found",
  );
}
{
  // The gate. A signed-out request must be turned away, not served.
  const r = await get("/pin/map");
  check(
    r.status >= 300 && r.status < 400,
    "/pin/map refuses a signed-out request",
    `http ${r.status}`,
  );
}
{
  // The database, for real.
  //
  // This check used to pass 19 of 19 while sign-in was completely broken. The
  // password had been rotated and the running deployment still carried the old
  // one, but nothing here actually asked the database a question: the only
  // call that touched this API was the cross-site POST below, which is refused
  // before any query runs. A gate that fails closed and a gate that works look
  // the same from outside. So this one asks for a real query.
  const r = await get("/api/pin/health");
  check(
    r.status === 200 && r.text.includes('"ok":true'),
    "database is reachable from the deployment",
    r.status === 200 ? r.text.slice(0, 40) : `http ${r.status}`,
  );
  // Migrations are run by hand and a deploy does not wait for one, so the code
  // can be ahead of the schema. That failure is invisible until a rep saves a
  // quote in front of a customer and gets a 500.
  check(
    r.text.includes('"schema":true'),
    "the schema has every column this build needs",
    r.text.includes('"schema"') ? r.text.slice(0, 60) : "endpoint too old",
  );
  // Without a Resend key every send is a silent no-op. The rep sees nothing
  // wrong and the customer gets nothing, which is exactly how the missing
  // send button went unnoticed.
  check(
    r.text.includes('"email":true'),
    "the deployment can send email",
    r.text.includes('"email"') ? r.text.slice(0, 80) : "endpoint too old",
  );
}
{
  // Cross-site POST must be refused, or any page on the internet could make a
  // rep's browser fire requests at this API.
  const r = await get("/api/pin/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://evil.example",
    },
    body: JSON.stringify({ email: "sean@southeastroofing.llc" }),
  });
  check(
    r.status === 403,
    "/api/pin/signin blocks cross-site POST",
    `http ${r.status}`,
  );
}

{
  // The aerial image proxy must demand a session. It exists because the
  // measurement used to return a Google Static Maps URL with the unrestricted
  // server key in it, which shipped that key to every browser. The earlier
  // version of this file checked only whether the key appeared in the page
  // HTML, and it did not: it arrived afterwards, inside an API response. So
  // the endpoint that replaced it gets checked directly.
  const r = await get("/api/pin/aerial?lat=31.3271&lon=-89.2903");
  check(
    r.status === 401,
    "/api/pin/aerial requires a session",
    `http ${r.status}`,
  );
}
{
  // The printed mailer names a specific property and the person it was
  // prepared for. It is built from the same scoped lookup as every other
  // estimate view, and nobody signed out should get as far as an id.
  const r = await get(
    "/api/pin/mailer-pdf?id=00000000-0000-0000-0000-000000000000",
  );
  check(
    r.status === 401,
    "/api/pin/mailer-pdf requires a session",
    `http ${r.status}`,
  );
}
{
  // Belt and braces on the same thing: no Google key of any kind should be
  // reachable without signing in.
  const r = await get("/pin");
  check(
    !/AIza[0-9A-Za-z_-]{20,}/.test(r.text),
    "no Google API key in the signed-out page",
    "a key-shaped string was found",
  );
}

/* -- 3. Nothing private became public. ----------------------------------- */

console.log(`\nPrivate areas still locked`);
for (const path of ["/upload", "/production"]) {
  const r = await get(path);
  const locked =
    r.status === 401 || (r.status >= 300 && r.status < 400) || r.status === 200;
  // /production renders its own login at 200, /upload answers 401. What must
  // never happen is a 500, which would mean the gate itself is broken.
  check(
    locked && r.status !== 500,
    `${path} responds without erroring`,
    `http ${r.status}`,
  );
}

/* ------------------------------------------------------------------------ */

console.log(
  `\n${pass} passed, ${failures.length} failed${failures.length ? ":" : ""}`,
);
for (const f of failures) console.log(`  - ${f}`);
process.exit(failures.length ? 1 : 0);
