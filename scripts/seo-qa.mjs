#!/usr/bin/env node
/**
 * PERMANENT SEO QA SUITE.
 *
 * seo-smoke.mjs checks the plumbing: redirects, canonical host, robots,
 * sitemap. This checks the pages themselves, and it exists because an
 * external audit found four things in one pass that nobody would ever notice
 * by looking at the site: an H1 that was a slogan, a marketing sentence that
 * counted nine of ten services, every review's text present twice in the DOM,
 * and a licensing claim broader than what the state actually requires. All
 * four are the same kind of defect: correct-looking output that is wrong in a
 * way only a machine reading the markup would catch.
 *
 * So a machine reads the markup. Every page is fetched, classified by route
 * shape, and held to the rules for its class plus the rules that apply to
 * everything. A regression fails the run with a non-zero exit.
 *
 * Usage:  node scripts/seo-qa.mjs [BASE_URL]
 *         node scripts/seo-qa.mjs http://localhost:3000
 *         BASE_URL defaults to https://southeastroofing.llc
 *
 * Add a page to PAGES and it gets the whole suite. Add a rule and it applies
 * to every page in its class from that moment on. That is the point: the
 * audit's findings become permanent tests rather than a list somebody read
 * once.
 */

const BASE = (process.argv[2] || "https://southeastroofing.llc").replace(
  /\/$/,
  "",
);

/** Where canonicals must point, whatever host the suite is aimed at. */
const CANONICAL_ORIGIN = "https://southeastroofing.llc";

const RESIDENTIAL_LICENSE = "R22245";
const COMMERCIAL_LICENSE = "27720-SC";

let pass = 0;
const failures = [];
function check(ok, label, detail) {
  if (ok) {
    pass++;
    return true;
  }
  failures.push(detail ? `${label}\n         ${detail}` : label);
  return false;
}

/* ------------------------------------------------------------------ */
/* The pages under test, and what each one is.                         */
/*                                                                     */
/* Classification is explicit rather than inferred from the path,      */
/* because the interesting rules do not follow the URL shape: /about   */
/* and / are both "company" pages, /commercial/tpo and                 */
/* /commercial/silicone-roof-coating are both commercial services, and */
/* a learn article about licensing is held to the licensing rules even */
/* though it lives under /learn.                                       */
/* ------------------------------------------------------------------ */
const PAGES = [
  ["/", "home"],
  ["/about", "company"],
  ["/contact", "company"],
  ["/faq", "company"],
  ["/licenses", "licensing"],
  ["/residential", "residential"],
  ["/residential/asphalt-shingle-roofing", "residential"],
  ["/residential/roof-replacement", "residential"],
  ["/residential/roof-repair", "residential"],
  ["/residential/metal-roofing", "residential"],
  ["/commercial", "commercial"],
  ["/commercial/tpo", "commercial"],
  ["/commercial/epdm", "commercial"],
  ["/commercial/roof-coatings", "commercial"],
  ["/commercial/silicone-roof-coating", "commercial"],
  ["/commercial/roof-maintenance", "commercial"],
  ["/commercial/roof-replacement", "commercial"],
  ["/commercial/metal-roofing", "commercial"],
  ["/commercial/metal-roofing/standing-seam", "commercial"],
  ["/commercial/roof-washing", "commercial"],
  ["/metal-roofing", "residential"],
  ["/residential/roof-washing", "residential"],
  ["/residential/leaf-guard", "residential"],
  ["/storm-damage/emergency-roofing", "residential"],
  ["/service-areas/hattiesburg", "city"],
  ["/service-areas/gulfport", "city"],
  ["/reviews", "company"],
  ["/learn/hiring/how-to-choose-a-roofing-contractor", "article"],
  [
    "/learn/hiring/verify-mississippi-commercial-roofing-license",
    "licensing-article",
  ],
];

/** Routes that must NOT exist. Doorway pages are the thing we refuse to ship. */
const MUST_404 = [
  "/commercial/hattiesburg",
  "/commercial/gulfport",
  "/commercial/roofing-hattiesburg-ms",
];

/* ------------------------------------------------------------------ */
/* Minimal HTML reading. No parser dependency on purpose: this script  */
/* has to keep working years from now with no install step.            */
/* ------------------------------------------------------------------ */
const decode = (s) =>
  s
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&amp;|&#38;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2F;/g, "/")
    .replace(/&mdash;/g, "—")
    .replace(/&ldquo;|&rdquo;/g, '"');

const one = (re, s) => {
  const m = s.match(re);
  return m ? decode(m[1]).trim() : null;
};

/** Visible text: scripts, styles and tags removed, whitespace collapsed. */
function visibleText(html) {
  const afterHead = html.includes("</head>") ? html.split("</head>")[1] : html;
  return decode(
    afterHead
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The page's own content, with the header, nav and footer stripped out.
 *
 * WHY THIS EXISTS. The footer carries "CertainTeed" on every page of the
 * site. A test that searched the whole document would therefore pass on a
 * shingle page whose own copy still said GAF and Owens Corning only, which is
 * exactly the gap the second-pass review found: the shared components were
 * right and the page-specific content was not. Asserting against <main> is
 * the difference between "the word appears somewhere on the page" and "this
 * page says it".
 */
function mainText(html) {
  const afterHead = html.includes("</head>") ? html.split("</head>")[1] : html;
  const main = afterHead.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const body = main ? main[1] : afterHead;
  return decode(
    body
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<header[\s\S]*?<\/header>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdNodes(html) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => m[1]);
  const nodes = [];
  let parseOk = true;
  for (const b of blocks) {
    try {
      nodes.push(...[].concat(JSON.parse(b)));
    } catch {
      parseOk = false;
    }
  }
  return { nodes, parseOk, count: blocks.length };
}

/* ------------------------------------------------------------------ */
/* Rules applied to every page, whatever it is.                        */
/* ------------------------------------------------------------------ */
function universalRules(page, doc) {
  const { path } = page;
  const { html, text, status, finalUrl } = doc;
  const at = (msg) => `[${path}] ${msg}`;

  if (!check(status === 200, at(`responds 200 (got ${status})`))) return;
  // The homepage's canonical form is the bare origin, with no trailing slash.
  const expected = path === "/" ? [BASE, BASE + "/"] : [BASE + path];
  check(expected.includes(finalUrl), at(`no redirect (landed on ${finalUrl})`));

  // --- Title, description, canonical -------------------------------
  const titles = [...html.matchAll(/<title>([^<]*)<\/title>/g)];
  check(
    titles.length === 1,
    at(`exactly one <title> (found ${titles.length})`),
  );
  const title = titles.length ? decode(titles[0][1]).trim() : "";
  check(title.length > 10, at(`title is non-trivial ("${title}")`));
  check(
    title.length <= 70,
    at(`title within 70 chars (${title.length}: "${title}")`),
  );
  doc.title = title;

  const desc =
    one(/<meta name="description" content="([^"]*)"/, html) ||
    one(/<meta content="([^"]*)" name="description"/, html);
  check(Boolean(desc), at("has a meta description"));
  if (desc) {
    check(
      desc.length >= 50 && desc.length <= 200,
      at(`description 50-200 chars (${desc.length})`),
    );
  }
  doc.desc = desc;

  /*
   * Canonicals are always absolute to the production origin, even when this
   * suite runs against localhost before a deploy, so the origin is checked
   * against CANONICAL_ORIGIN and only the path has to match the page.
   */
  const canonical = one(/<link rel="canonical" href="([^"]+)"/, html);
  const canonicalOk =
    canonical === CANONICAL_ORIGIN + path ||
    (path === "/" && canonical === CANONICAL_ORIGIN);
  check(canonicalOk, at(`self-referencing canonical (got ${canonical})`));
  check(
    !/<meta name="robots"[^>]*noindex/i.test(html),
    at("not accidentally noindexed"),
  );

  // --- Headings -----------------------------------------------------
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim(),
  );
  check(h1s.length === 1, at(`exactly one <h1> (found ${h1s.length})`));
  const h1 = h1s[0] || "";
  check(h1.length > 0, at("H1 has text"));
  doc.h1 = h1;

  /*
   * A run-on H1 is the specific defect the audit caught: two complete
   * sentences welded together with no punctuation, because two spans had
   * been stacked inside one heading. A lowercase-or-comma word followed by
   * a capitalised word with nothing between them is that shape.
   */
  check(
    !/[a-z,]\s[A-Z][a-z]+\s[a-z]+\.$/.test(h1),
    at(`H1 is one heading, not two sentences run together ("${h1}")`),
  );

  // --- House style --------------------------------------------------
  check(
    !text.includes("—"),
    at("no em dashes in visible copy"),
    (text.match(/.{0,60}—.{0,60}/) || [""])[0],
  );

  /*
   * WORDS RUN TOGETHER ACROSS AN INTERPOLATION.
   *
   * /licenses read "Southeast Roofing LLCis licensed by..." in production
   * because the JSX transform dropped the leading space of a text node that
   * wrapped across source lines. Nobody spots that reading the source; the
   * space is right there in the file. React marks the join with an empty
   * comment, so a letter on both sides of one is exactly the defect, and
   * it is invisible to every other check here because the visible text is
   * still a plausible-looking string.
   */
  const runOns = [
    ...html.matchAll(/([A-Za-z0-9]{2})<!-- -->([A-Za-z0-9]{2})/g),
  ];
  check(
    runOns.length === 0,
    at(`no words run together across an interpolation (${runOns.length})`),
    runOns
      .slice(0, 3)
      .map((m) => `"${m[1]}${m[2]}"`)
      .join(", "),
  );

  // --- Links --------------------------------------------------------
  check(
    !/target="_blank"/.test(html),
    at("no link opens in a new tab (owner directive)"),
  );

  /*
   * SOCIAL ICONS MUST BE REAL, NAMED ANCHORS.
   *
   * An icon-only link is invisible twice over: a screen reader announces
   * nothing, and a crawler reading the markup sees an <svg> with no text and
   * cannot tell which platform it points at. Every social link on this site
   * carries an accessible name, and every page that shows the icon row shows
   * the whole row, LinkedIn included, because the row renders from one
   * config object.
   */
  const socialRow = /aria-label="Visit [^"]*on Facebook"/.test(html);
  if (socialRow) {
    for (const p of ["Facebook", "Instagram", "TikTok", "LinkedIn"]) {
      check(
        new RegExp(`aria-label="Visit [^"]*on ${p}"`).test(html),
        at(`social row includes a named ${p} link`),
      );
    }
    check(
      html.includes(
        'href="https://www.linkedin.com/in/southeast-roofing-1b84b3367"',
      ),
      at("LinkedIn icon points at the company profile"),
    );
  }

  // --- Structured data ----------------------------------------------
  const { nodes, parseOk } = jsonLdNodes(html);
  check(parseOk, at("every JSON-LD block parses"));
  const orgs = nodes.filter((n) =>
    /RoofingContractor|LocalBusiness/.test(String(n["@type"])),
  );
  check(
    orgs.length === 1,
    at(`exactly one business entity in JSON-LD (found ${orgs.length})`),
  );
  if (orgs.length === 1) {
    const org = orgs[0];
    check(
      String(org["@id"] || "").endsWith("#organization"),
      at(`business entity uses the stable @id (${org["@id"]})`),
    );
    for (const field of ["name", "url", "telephone", "address", "geo"]) {
      check(Boolean(org[field]), at(`business entity has ${field}`));
    }
    const sameAs = [].concat(org.sameAs || []);
    check(sameAs.length > 0, at("business entity has sameAs profiles"));
    /*
     * THE IDENTITY GRAPH, ASSERTED PROFILE BY PROFILE.
     *
     * sameAs is how a search or answer engine decides that a LinkedIn page, a
     * CertainTeed profile and a chamber listing are all the same company as
     * this website. A missing entry is invisible: nothing renders differently
     * and nothing errors, the entity just quietly stops being connected. So
     * each one is named here rather than trusting a count.
     */
    /*
     * The Google share shortlink was removed from sameAs on 2026-09-25: it
     * resolves to a generic Google endpoint rather than a public record of
     * this business. It is still the customer-facing reviews link, which is
     * the right place for it. This keeps it out of the identity graph.
     */
    check(
      !sameAs.some((u) => String(u).includes("share.google")),
      at("sameAs carries no opaque share shortlink"),
    );
    for (const [needle, label] of [
      ["msboc", "MSBOC public record"],
      ["linkedin.com", "LinkedIn"],
      ["certainteed.com/profiles/", "CertainTeed ShingleMaster profile"],
      ["members.theadp.com", "Area Development Partnership member profile"],
      ["bbb.org", "BBB profile"],
      ["gaf.com", "GAF contractor profile"],
    ]) {
      check(
        sameAs.some((u) => String(u).includes(needle)),
        at(`sameAs includes the ${label}`),
      );
    }
    /*
     * The ChamberMaster mirror of the ADP listing resolves to the same page
     * as the branded members.theadp.com URL. Declaring both would be two
     * URLs for one profile, which adds noise to the graph rather than
     * authority, so only the branded one belongs here.
     */
    check(
      !sameAs.some((u) => String(u).includes("chambermaster.com")),
      at("sameAs does not double-declare the ADP listing"),
    );
    const credNames = []
      .concat(org.hasCredential || [])
      .map((c) => c.name || "");
    for (const want of [
      "GAF Certified Contractor",
      "CertainTeed ShingleMaster",
    ]) {
      check(
        credNames.some((c) => c === want),
        at(`hasCredential names ${want}`),
      );
    }
    /*
     * Owens Corning shingles are a product we install, not a credential
     * anybody issued us. It belongs in knowsAbout and nowhere near
     * hasCredential; claiming a certification a manufacturer never granted is
     * the one credential error on this site that could actually be actioned
     * against us.
     */
    check(
      !JSON.stringify(org.hasCredential || []).match(/owens/i),
      at("Owens Corning is not claimed as a credential"),
    );
    const ids = JSON.stringify(org.identifier || []);
    check(
      ids.includes(RESIDENTIAL_LICENSE) && ids.includes(COMMERCIAL_LICENSE),
      at("both licence numbers present as identifiers"),
    );
    const creds = JSON.stringify(org.hasCredential || []);
    check(
      creds.includes(RESIDENTIAL_LICENSE) && creds.includes(COMMERCIAL_LICENSE),
      at("both licences present as credentials"),
    );
  }

  // --- Duplicate body copy ------------------------------------------
  /*
   * The review marquee renders a second copy of every card so the scroll
   * wraps without a seam, and that duplicate used to ship in the server HTML,
   * putting every review's text on the page twice. The mirror is mounted
   * client-side now. This catches it coming back, on any page, from any
   * component, by looking for a long sentence that appears more than once.
   */
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 60);
  const seen = new Map();
  for (const s of sentences) seen.set(s, (seen.get(s) || 0) + 1);
  const dupes = [...seen.entries()].filter(([, n]) => n > 1);
  check(
    dupes.length === 0,
    at(`no sentence rendered twice (${dupes.length} duplicated)`),
    dupes
      .slice(0, 2)
      .map(([s, n]) => `${n}x "${s.slice(0, 90)}..."`)
      .join("\n         "),
  );

  // --- Claims that must never come back ------------------------------
  /*
   * Left column: the exact wrong strings. A hardcoded service count broke
   * the moment a tenth service was added; the blanket licensing claim was
   * broader than what MSBOC actually requires, which is a threshold, not a
   * blanket rule.
   */
  const BANNED = [
    [/\bNine services\b/i, "hardcoded service count in marketing copy"],
    [
      /all commercial (roofing )?work in mississippi requires/i,
      "overbroad licensing claim (MSBOC's rule is a $50,000 threshold)",
    ],
    [
      /commercial work in mississippi requires that certificate/i,
      "overbroad licensing claim",
    ],
    [
      /requires trade and business examinations/i,
      "invented MSBOC application requirements",
    ],
    [/five-figure surprises/i, "unhedged dollar-magnitude promise"],
    /*
     * The company traded as Roofing Society before it was Southeast Roofing,
     * and a couple of Google reviews say so in their text. They stay on the
     * Google profile; on this site a visitor has no way to know that is us.
     * lib/reviews.ts filters them out of the live feed, and this catches the
     * day somebody adds a review surface that bypasses it.
     */
    [/roofing society/i, "a review naming the company's former identity"],
  ];
  for (const [re, why] of BANNED) {
    check(!re.test(text), at(`does not contain: ${why}`));
  }
}

/* ------------------------------------------------------------------ */
/* Class-specific rules.                                               */
/* ------------------------------------------------------------------ */
const ROOFING_WORDS = /roof|shingle|metal|gutter|tpo|epdm|pvc|coating|siding/i;

const CLASS_RULES = {
  home(page, doc) {
    const at = (m) => `[/] ${m}`;
    check(
      /roofing contractor/i.test(doc.h1),
      at(`H1 names the business type ("${doc.h1}")`),
    );
    check(/hattiesburg/i.test(doc.h1), at(`H1 names the city ("${doc.h1}")`));
    check(
      doc.text.includes(RESIDENTIAL_LICENSE) &&
        doc.text.includes(COMMERCIAL_LICENSE),
      at("both licence numbers visible on the page"),
    );
  },

  company(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    check(
      doc.text.includes(RESIDENTIAL_LICENSE) &&
        doc.text.includes(COMMERCIAL_LICENSE),
      at("a company page shows both licences, never one alone"),
    );
  },

  residential(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    check(ROOFING_WORDS.test(doc.h1), at(`H1 names the service ("${doc.h1}")`));
    check(
      doc.text.includes(RESIDENTIAL_LICENSE),
      at("residential licence number present"),
    );
  },

  commercial(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    check(ROOFING_WORDS.test(doc.h1), at(`H1 names the service ("${doc.h1}")`));
    check(
      /commercial|tpo|epdm|pvc|silicone|coating|metal/i.test(doc.h1),
      at(`H1 reads as commercial ("${doc.h1}")`),
    );
    check(
      doc.text.includes(COMMERCIAL_LICENSE),
      at("commercial certificate number present"),
    );
    check(
      /\$50,000/.test(doc.text) ||
        !/requires a commercial licen/i.test(doc.text),
      at("any licensing requirement statement carries the $50,000 threshold"),
    );
    /*
     * Geographic boilerplate. Commercial child pages used to carry the same
     * thirty-town roster as every other commercial child page. Eight hub
     * cities plus a link to the full list is the budget.
     */
    const towns = [
      "Purvis",
      "Sumrall",
      "Seminary",
      "Collins",
      "Ellisville",
      "Richton",
      "Waynesboro",
      "Leakesville",
      "Poplarville",
      "Wiggins",
      "Perkinston",
      "Lucedale",
      "McHenry",
      "Saucier",
      "Diamondhead",
    ].filter((t) => doc.text.includes(t));
    check(
      towns.length <= 4,
      at(`no long town roster (${towns.length} small towns listed)`),
      towns.join(", "),
    );
  },

  city(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    const city = page.path.split("/").pop().replace(/-/g, " ");
    const rx = new RegExp(city.replace(/\s+/g, "[ -]"), "i");
    check(rx.test(doc.h1), at(`H1 names the city ("${doc.h1}")`));
    check(rx.test(doc.title), at(`title names the city ("${doc.title}")`));
  },

  article(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    check(
      (doc.html.match(/<h2[\s>]/g) || []).length >= 2,
      at("article has section headings"),
    );
    check(doc.text.length > 2000, at("article has substantive body copy"));
    /*
     * The learn template renders hero.headline as the H1, so an article
     * whose headline is a pure hook ships an H1 that says nothing about its
     * subject. The H1 has to share real words with the title.
     */
    const stop =
      /^(a|an|the|and|or|to|in|of|for|how|what|why|is|do|does|your|you|it|takes|about)$/i;
    const words = (s) =>
      new Set(
        s
          .toLowerCase()
          .split(/[^a-z0-9']+/)
          .filter((w) => w.length > 2 && !stop.test(w)),
      );
    const shared = [...words(doc.h1)].filter((w) => words(doc.title).has(w));
    check(
      shared.length >= 2,
      at(`H1 states the article's subject ("${doc.h1}")`),
      `shares only [${shared}] with the title "${doc.title}"`,
    );
  },

  licensing(page, doc) {
    const at = (m) => `[${page.path}] ${m}`;
    check(
      doc.text.includes(RESIDENTIAL_LICENSE),
      at("residential licence number present"),
    );
    check(
      doc.text.includes(COMMERCIAL_LICENSE),
      at("commercial certificate number present"),
    );
    check(
      doc.html.includes("search.msboc.us"),
      at("links to the board's public record"),
    );
    check(
      /\$50,000/.test(doc.text) && /\$10,000/.test(doc.text),
      at("states both MSBOC thresholds"),
    );
  },

  "licensing-article"(page, doc) {
    CLASS_RULES.article(page, doc);
    CLASS_RULES.licensing(page, doc);
    const at = (m) => `[${page.path}] ${m}`;
    check(
      /over \$50,000/.test(doc.text),
      at("commercial threshold stated as a threshold, not a blanket rule"),
    );
  },
};

/* ------------------------------------------------------------------ */
/* Cross-page rules: the things that are only wrong in aggregate.      */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Page-specific content, checked against <main> only.                  */
/*                                                                      */
/* Each entry names a page and what that page's OWN copy has to say. A  */
/* shared footer carrying the word does not satisfy any of these.       */
/* ------------------------------------------------------------------ */
const PAGE_CONTENT = [
  {
    path: "/",
    must: ["GAF", "CertainTeed", "Owens Corning"],
    why: "the homepage summarises both certifications and the brands installed",
  },
  {
    path: "/residential",
    must: ["GAF", "CertainTeed"],
    why: "the residential brand-selection answer lists what we install",
  },
  {
    path: "/residential/asphalt-shingle-roofing",
    must: ["GAF", "CertainTeed", "Owens Corning", "ShingleMaster"],
    why: "the shingle page compares the brands and states both certifications",
  },
  {
    path: "/about",
    must: ["GAF", "CertainTeed", "Google Verified"],
    why: "the About credential list is a full summary",
  },
  {
    path: "/faq",
    must: ["GAF", "CertainTeed", "Google Verified"],
    why: "the credentials FAQ answer is the one an answer engine quotes",
  },
  {
    path: "/licenses",
    must: ["GAF Certified Contractor", "CertainTeed ShingleMaster"],
    why: "the credentials page uses the precise credential names",
  },
  {
    path: "/contact",
    must: ["Official social profiles", "LinkedIn", "Facebook", "Instagram"],
    why: "the readable social directory lives here",
  },
];

/**
 * Claims that must never appear in page copy again.
 *
 * "Google Guaranteed" is the important one: it is a different Local Services
 * status from the one this company holds, and it carries a Google-backed
 * money-back promise that nobody would honour. Stating it is not a wording
 * preference, it is promising a refund on somebody else's behalf.
 */
const BANNED_CLAIMS = [
  [/Google Guaranteed/i, "Google Guaranteed (we are Google Verified)"],
  [
    /money[- ]back guarantee from Google|Google[- ]backed guarantee/i,
    "a Google money-back promise",
  ],
  [
    /Owens Corning (certified|preferred) contractor(?!,? though| —)/i,
    "an Owens Corning certification we do not hold",
  ],
  [/factory[- ]certifi/i, "factory certification wording"],
  [/Select ShingleMaster/i, "a CertainTeed credential tier we do not hold"],
];

function pageContentRules(doc) {
  const spec = PAGE_CONTENT.find((p) => p.path === doc.path);
  if (!spec) return;
  const at = (m) => `[${doc.path}] ${m}`;
  for (const needle of spec.must) {
    check(
      doc.main.includes(needle),
      at(`page content names "${needle}"`),
      `${spec.why}. Found only in shared header/footer, or not at all.`,
    );
  }
}

function bannedClaimRules(doc) {
  const at = (m) => `[${doc.path}] ${m}`;
  for (const [re, why] of BANNED_CLAIMS) {
    const hit = doc.text.match(re);
    check(!hit, at(`does not claim ${why}`), hit ? `matched: "${hit[0]}"` : "");
  }

  /*
   * THE CREDENTIAL ROW IS FOR OTHER PEOPLE'S RECORDS.
   *
   * A LinkedIn card was added to this row once and the owner took it out:
   * every other card is something an outside body granted or publishes about
   * this company, and a page we wrote ourselves sitting among them borrows
   * credibility it cannot supply. LinkedIn belongs with the social profiles.
   * This asserts it stays out, on any page that renders the row.
   */
  const row = doc.html.match(
    /<section[^>]*aria-label="Credentials"[\s\S]*?<\/section>/i,
  );
  if (row) {
    check(
      !/linkedin/i.test(row[0]),
      at("no LinkedIn card in the credential row"),
      "LinkedIn is a social profile, not a credential somebody granted us.",
    );
  }
  /*
   * The company's OWN commitments must survive. A blunt search-and-replace
   * for the word "guarantee" would have taken the warranty language and the
   * insurance-claims honesty copy with it, so this asserts the opposite
   * direction: the words we meant to keep are still here.
   */
  if (doc.path === "/") {
    check(
      /Lifetime Warranty/i.test(doc.text),
      at("still states the manufacturer warranty option"),
    );
  }
}

function crossPageRules(docs) {
  const dupes = (field) => {
    const by = new Map();
    for (const d of docs) {
      const v = (d[field] || "").toLowerCase();
      if (!v) continue;
      by.set(v, [...(by.get(v) || []), d.path]);
    }
    return [...by.entries()].filter(([, paths]) => paths.length > 1);
  };

  for (const field of ["title", "desc", "h1"]) {
    const d = dupes(field);
    check(
      d.length === 0,
      `every page has a unique ${field} (${d.length} collisions)`,
      d
        .map(([v, p]) => `${p.join(" + ")}: "${v.slice(0, 70)}"`)
        .join("\n         "),
    );
  }

  /*
   * Metal roofing lives at three routes on purpose (a shared hub, a
   * residential page and a commercial page) and cannibalisation is the
   * obvious risk. They must not converge.
   */
  const metal = docs.filter((d) => d.path.includes("metal-roofing"));
  const metalH1s = new Set(metal.map((d) => d.h1.toLowerCase()));
  check(
    metalH1s.size === metal.length,
    `the ${metal.length} metal-roofing routes have distinct H1s`,
  );
}

/* ------------------------------------------------------------------ */
async function main() {
  console.log(`SEO QA against ${BASE}\n`);

  const docs = [];
  for (const [path, cls] of PAGES) {
    const page = { path, cls };
    let doc;
    try {
      const res = await fetch(BASE + path, { redirect: "follow" });
      const html = await res.text();
      doc = {
        path,
        cls,
        html,
        text: visibleText(html),
        main: mainText(html),
        status: res.status,
        finalUrl: res.url.replace(/\/$/, "") || res.url,
      };
    } catch (err) {
      check(false, `[${path}] fetch failed`, String(err));
      continue;
    }
    universalRules(page, doc);
    if (doc.status === 200) {
      const rule = CLASS_RULES[cls];
      if (rule) rule(page, doc);
      pageContentRules(doc);
      bannedClaimRules(doc);
      docs.push(doc);
    }
    process.stdout.write(".");
  }

  for (const path of MUST_404) {
    const res = await fetch(BASE + path, { redirect: "manual" });
    check(
      res.status === 404,
      `[${path}] must not exist (doorway page): got ${res.status}`,
    );
    process.stdout.write(".");
  }

  crossPageRules(docs);
  process.stdout.write("\n\n");

  if (failures.length) {
    console.log("FAILURES");
    for (const f of failures) console.log(`  FAIL  ${f}`);
    console.log("");
  }
  console.log(
    `${pass} passed, ${failures.length} failed, across ${docs.length} pages`,
  );
  process.exit(failures.length ? 1 : 0);
}

main().catch((err) => {
  console.error("seo-qa error:", err);
  process.exit(2);
});
