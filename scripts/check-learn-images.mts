import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { learnArticles } from "@/content/learn";

/**
 * Every Learning Center card has its own photo, and the photo exists.
 *
 * WHY THIS EXISTS. The owner opened the Learning Center on 2026-09-30 and
 * found a bare residential tear-off photo on "TPO, EPDM, or a coating?", a
 * guide for commercial building owners about single-ply membrane. It was not
 * the only one. Two articles had no image assigned at all and were quietly
 * inheriting a category fallback that another card was already using, so the
 * grid showed the same photo twice and nothing anywhere said so.
 *
 * That is the failure worth guarding: a MISSING entry and a CORRECT entry look
 * identical on the page, because the fallback always produces something. The
 * page never breaks, it just slowly stops meaning anything.
 *
 * What this cannot check is whether a photo suits its article. That is a
 * judgement and it stays a judgement. What it can check is everything
 * mechanical underneath: every article has an entry, no two share a file,
 * every file is really on disk, every one has alt text worth reading, and none
 * of them is heavy enough to hurt the page they load into.
 *
 * Run: npm run check:learn-images
 */

let failures = 0;
function check(ok: boolean, label: string, detail?: string) {
  console.log(`${ok ? "  pass" : "  FAIL"}  ${label}`);
  if (!ok) {
    failures++;
    if (detail) console.log(`        ${detail}`);
  }
}

const page = readFileSync(
  new URL("../src/app/(marketing)/learn/page.tsx", import.meta.url),
  "utf8",
);

/* Parse the map out of the page rather than importing it: it is a private
   const inside a server component, and exporting it just to test it would
   change the shape of the thing under test. */
const mapBody = page.slice(
  page.indexOf("const ARTICLE_THUMB"),
  page.indexOf("const FALLBACK_THUMB"),
);
const entries = [
  ...mapBody.matchAll(
    /"([a-z0-9-]+)":\s*\{\s*src:\s*"([^"]+)",\s*alt:\s*"([^"]+)"/g,
  ),
].map((m) => ({ slug: m[1], src: m[2], alt: m[3] }));

console.log(`\nParsed ${entries.length} card images`);
check(entries.length > 0, "the image map parses at all");

/* ------------------------------------------------------------------ */
/* 1. Every article has one, so nothing falls through to the fallback  */
/* ------------------------------------------------------------------ */
console.log("\nEvery article has its own image");

const assigned = new Map(entries.map((e) => [e.slug, e]));
const missing = learnArticles.filter((a) => !assigned.has(a.slug));
check(
  missing.length === 0,
  `all ${learnArticles.length} articles have an image entry`,
  missing.length ? `missing: ${missing.map((a) => a.slug).join(", ")}` : undefined,
);

const orphans = entries.filter(
  (e) => !learnArticles.some((a) => a.slug === e.slug),
);
check(
  orphans.length === 0,
  "no entries point at articles that no longer exist",
  orphans.length ? orphans.map((e) => e.slug).join(", ") : undefined,
);

/* ------------------------------------------------------------------ */
/* 2. No two cards share a photo                                       */
/* ------------------------------------------------------------------ */
console.log("\nNo two cards share a photo");

const bySrc = new Map<string, string[]>();
for (const e of entries) {
  bySrc.set(e.src, [...(bySrc.get(e.src) ?? []), e.slug]);
}
const dupes = [...bySrc.entries()].filter(([, slugs]) => slugs.length > 1);
check(
  dupes.length === 0,
  "every card image is unique",
  dupes.map(([src, slugs]) => `${src} used by ${slugs.join(" + ")}`).join("; "),
);

/* ------------------------------------------------------------------ */
/* 3. The files are actually there                                     */
/* ------------------------------------------------------------------ */
console.log("\nEvery file exists and is a sensible weight");

/*
 * WHAT IS WORTH ASSERTING HERE, AND WHAT IS NOT.
 *
 * The first version of this failed on a 983KB source file, and that was the
 * wrong test. These cards render through next/image with a sizes attribute
 * matched to the grid, so a phone is served a phone-sized variant and the
 * bytes on disk are never the bytes on the wire. A large, high quality source
 * is what next/image WANTS to downscale from.
 *
 * Several of these are also damage photographs shared with the storm gallery,
 * where the whole point is that granule loss and hail bruising stay legible.
 * Recompressing those to win repo weight would trade the thing they exist for
 * against a number nobody is served.
 *
 * So the real faults are a source too small to downscale from cleanly, which
 * produces a blurry card, and a source so far oversized that it is an obvious
 * export mistake. Both are dimension questions, not file-size ones.
 */
const publicDir = new URL("../public", import.meta.url);
const present = entries.filter((e) =>
  existsSync(new URL(`.${e.src}`, `${publicDir}/`)),
);
for (const e of entries) {
  if (!present.includes(e)) check(false, `${e.slug}: file exists`, e.src);
}
check(present.length === entries.length, "no card points at a missing file");

const sizes = await Promise.all(
  present.map(async (e) => {
    const path = new URL(`.${e.src}`, `${publicDir}/`);
    const meta = await sharp(fileURLToPath(path)).metadata();
    return {
      ...e,
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      kb: Math.round(statSync(path).size / 1024),
    };
  }),
);

// A card tops out around 400 CSS px, so next/image requests a 640w variant.
// A source at or above 600px covers that. Below it the browser is upscaling
// and the card is visibly soft.
const tooSmall = sizes.filter((s) => s.width < 600);
check(
  tooSmall.length === 0,
  "no card image is small enough to look blurry when it fills the card",
  tooSmall.map((s) => `${s.slug}: ${s.width}x${s.height}`).join("; "),
);

const absurd = sizes.filter((s) => s.width > 3000 || s.kb > 2048);
check(
  absurd.length === 0,
  "no card image is an oversized export",
  absurd.map((s) => `${s.slug}: ${s.width}px, ${s.kb}KB`).join("; "),
);

// The cards are a fixed 16:9 box with object-cover. A source far off that
// ratio survives, but only by cropping away most of its height or width, and
// that is where badly cropped cards come from.
const offRatio = sizes.filter((s) => {
  const r = s.width / s.height;
  return r < 0.9 || r > 2.4;
});
check(
  offRatio.length === 0,
  "no card image is so far off 16:9 that the crop throws the subject away",
  offRatio
    .map((s) => `${s.slug}: ${(s.width / s.height).toFixed(2)}:1`)
    .join("; "),
);

/* ------------------------------------------------------------------ */
/* 4. Alt text that says something                                     */
/* ------------------------------------------------------------------ */
console.log("\nAlt text describes the photo");

const thin = entries.filter((e) => e.alt.trim().length < 25);
check(
  thin.length === 0,
  "no alt text is a stub",
  thin.map((e) => `${e.slug}: "${e.alt}"`).join("; "),
);

// Alt that just restates the headline is noise: the headline is already the
// link text two elements below it in the same card.
const echoes = entries.filter((e) => {
  const a = learnArticles.find((x) => x.slug === e.slug);
  return a && e.alt.toLowerCase().trim() === a.title.toLowerCase().trim();
});
check(
  echoes.length === 0,
  "no alt text merely repeats the article title",
  echoes.map((e) => e.slug).join("; "),
);

/* ------------------------------------------------------------------ */
/* 5. Commercial articles do not get residential photos                */
/* ------------------------------------------------------------------ */
console.log("\nCommercial guides carry commercial imagery");

// The specific mistake that started this: a residential tear-off on a
// commercial membrane guide. Residential job photos live under recognisable
// names, so the rule can be mechanical for the one case that went wrong.
const RESIDENTIAL_MARKERS = [
  "tear-off-decking",
  "gaf-timberline",
  "owens-corning",
  "residential-",
  "shingle-install",
];
const commercial = learnArticles.filter((a) => a.category === "commercial");
for (const a of commercial) {
  const e = assigned.get(a.slug);
  if (!e) continue;
  const looksResidential = RESIDENTIAL_MARKERS.some((m) => e.src.includes(m));
  check(
    !looksResidential,
    `${a.slug} does not use a residential photo`,
    looksResidential ? e.src : undefined,
  );
}

console.log(
  failures === 0
    ? `\nAll learn image checks passed across ${entries.length} cards.\n`
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
