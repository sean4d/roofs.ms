import { readFileSync } from "node:fs";

import { stripSwipeCue, googleSummary, roundRobinByJob } from "@/lib/gbp-content";

/**
 * The social fan-out tells customers to do things, so it has to be right about
 * what it is showing them.
 *
 * WHY THIS EXISTS. Three faults reached the public profile and the feed before
 * anybody noticed, all on 2026-10-06:
 *
 *   1. Four Google Business Profile Updates opened with "swipe to see the
 *      before and after" above a SINGLE photo. A Business Profile post has one
 *      image and no swipe gesture, so the caption was instructing readers to
 *      do something the surface cannot do.
 *
 *   2. The weekly photo rotation ran the same roof for three weeks, then
 *      another for two, then another for two. It was working exactly as
 *      written: no photo repeated. They were just all from the same job,
 *      because the pool arrives grouped by project and the picker takes the
 *      first unused entry.
 *
 *   3. Instagram rejected a whole job with "The aspect ratio is not
 *      supported", and nothing retried it. Seven of its nine photos were
 *      1350x1800, which is 3:4, which is what every iPhone shoots, and which
 *      is below Instagram's 4:5 floor. Earlier jobs posted only because they
 *      happened to be landscape.
 *
 * Each of those is a one-line mistake with a visible public consequence, and
 * none of them threw an error anywhere. That is what this file is for.
 *
 * Run: npm run check:social
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
  readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");

/* ------------------------------------------------------------------ */
/* 1. Nothing tells a Google reader to swipe                           */
/* ------------------------------------------------------------------ */
console.log("\nA single-photo surface never asks for a swipe");

// The template the carousel builder prepends.
check(
  stripSwipeCue("\u{1F4F8} Swipe to see the before and after \u{1F449}\n\nThis Bassfield home got a new roof.") ===
    "This Bassfield home got a new roof.",
  "the carousel's own swipe template is removed",
);
// The variant the AI writer produced by itself, no emoji, different wording.
// This is the one that actually went out, so matching only our template would
// have missed the post the owner complained about.
check(
  stripSwipeCue("Swipe to see the before and after!\n\nThis Bassfield home received a new GAF roof.") ===
    "This Bassfield home received a new GAF roof.",
  "an AI-written swipe line is removed too, not just our template",
  "the live Bassfield post had no leading emoji, so it came from the model",
);
check(
  stripSwipeCue("Swipe through to see the whole job \u{1F449}\nA Purvis tear-off.") ===
    "A Purvis tear-off.",
  "a reworded swipe cue is still caught",
);
// And it must not eat real copy.
const essay =
  "We replaced this roof in Wiggins after hail damage, and the homeowner can now swipe their insurance paperwork into a drawer and forget it.";
check(
  stripSwipeCue(essay) === essay,
  "a long first line that merely contains the word is left alone",
  "removing text from the middle of real copy is worse than leaving it",
);
check(
  stripSwipeCue("This Petal home got new gutters.") ===
    "This Petal home got new gutters.",
  "a caption with no cue is untouched",
);

// And the Google branch has to actually call it.
const upload = read("src/app/api/upload/route.ts");
const gbpBranch = upload.slice(
  upload.indexOf('} else if (platform === "google")'),
  upload.indexOf('} else if (platform === "google")') + 1200,
);
check(
  /summary: googleSummary\(/.test(gbpBranch),
  "the Google branch rewrites the caption before posting",
  "the caption it receives was written for a carousel",
);

// Hashtags are the other Instagram habit that does not survive the trip:
// Google Business Profile has no hashtag feature, so a tag block is just
// leftover social copy sitting on a business listing.
check(
  googleSummary("A Petal reroof.\n\n#Roofing #Petal #GAF") === "A Petal reroof.",
  "a trailing hashtag block is removed for Google",
);
check(
  googleSummary("Licensed with the MSBOC (#R22245) and GAF certified.").includes(
    "#R22245",
  ),
  "a hash inside a sentence survives, because that is the licence number",
  "a blanket hashtag strip would take a real credential off the post",
);
check(
  googleSummary("Swipe to see it!\n\nA McComb tear-off.\n\n#Roofing #McComb") ===
    "A McComb tear-off.",
  "both the swipe cue and the tags come off together",
);

/* ------------------------------------------------------------------ */
/* 2. Consecutive posts come from different jobs                       */
/* ------------------------------------------------------------------ */
console.log("\nThe photo rotation moves between jobs, not through one");

// The real shape of the library when this was found: 13 jobs, 41 finished
// photos, very unevenly distributed.
const LIBRARY = [
  ["petal-gutters", 3],
  ["hattiesburg-hickory", 2],
  ["hattiesburg-metal", 2],
  ["ocean-springs", 3],
  ["mccomb", 3],
  ["leakesville", 5],
  ["purvis-hickory", 5],
  ["perkinston", 4],
  ["lucedale", 2],
  ["hattiesburg-charcoal", 3],
  ["purvis-weathered", 4],
  ["bassfield", 5],
] as const;
const pool = LIBRARY.flatMap(([job, n]) =>
  Array.from({ length: n }, (_, i) => ({ job, id: `${job}-${i}` })),
);

const ordered = roundRobinByJob(pool, (p) => p.job);
check(
  ordered.length === pool.length,
  "every photo survives the reorder",
  `${ordered.length} of ${pool.length}`,
);
check(
  new Set(ordered.map((p) => p.id)).size === pool.length,
  "no photo is duplicated by the reorder",
);

// The actual complaint: the same house, week after week.
let worstRun = 1;
let run = 1;
for (let i = 1; i < ordered.length; i++) {
  run = ordered[i].job === ordered[i - 1].job ? run + 1 : 1;
  worstRun = Math.max(worstRun, run);
}
check(
  worstRun === 1,
  "no job ever appears in two consecutive posts",
  `longest run of one job: ${worstRun}`,
);

// The first pass should visit every job before any job comes back.
const firstPass = ordered.slice(0, LIBRARY.length).map((p) => p.job);
check(
  new Set(firstPass).size === LIBRARY.length,
  "the first 12 posts are 12 different jobs",
  `got ${new Set(firstPass).size} distinct`,
);

// The old behaviour, asserted as the thing that must not come back.
const naiveWorst = (() => {
  let worst = 1;
  let r = 1;
  for (let i = 1; i < pool.length; i++) {
    r = pool[i].job === pool[i - 1].job ? r + 1 : 1;
    worst = Math.max(worst, r);
  }
  return worst;
})();
check(
  naiveWorst > worstRun,
  "the reorder is doing real work against the raw project order",
  `raw order would run the same job ${naiveWorst} times straight`,
);

/* ------------------------------------------------------------------ */
/* 3. Instagram is sent pictures it will actually accept               */
/* ------------------------------------------------------------------ */
console.log("\nInstagram gets a legal aspect ratio");

check(
  upload.includes("instagramUrl"),
  "there is a dedicated Instagram URL builder",
);
check(
  /platform === "instagram"\s*\?\s*\(order \?\? \[\]\)\.map\(\(m\) => instagramUrl/.test(
    upload,
  ),
  "the Instagram branch uses it, and the other platforms do not",
  "Facebook, Google and TikTok take the full frame",
);
// The two bounds, named rather than inlined, because they are Instagram's
// numbers and not ours to round.
check(
  /IG_MIN_AR = 0\.8\b/.test(upload) && /IG_MAX_AR = 1\.91\b/.test(upload),
  "the limits are Instagram's documented 4:5 and 1.91:1",
);
check(
  upload.includes('.crop("entropy")'),
  "the clamp crops to content rather than blindly to centre",
);

/* ------------------------------------------------------------------ */
/* 4. A failed platform is retried, but not forever                    */
/* ------------------------------------------------------------------ */
console.log("\nA platform that errored gets another go, within reason");

const reconcile = read("src/app/api/cron/social-reconcile/route.ts");
check(
  /r\.status === "posted" \|\|\s*r\.status === "skipped"/.test(reconcile),
  "only posted and skipped count as settled",
  "treating any row as settled is what left Instagram unposted",
);
check(
  /attempts \?\? 0\) >= MAX_ATTEMPTS/.test(reconcile),
  "a platform that keeps failing is eventually left alone",
  "without a cap, an error that actually posted republishes daily for a week",
);
check(
  /syndication\[\]\{ platform, status, attempts \}/.test(reconcile),
  "the sweeper actually reads the attempt count it filters on",
);
check(
  /attempts: \(typeof prior\?\.attempts === "number"/.test(upload),
  "the attempt count survives the row being replaced",
  "the row is replaced per platform, so an uncarried counter resets every try",
);

/* ------------------------------------------------------------------ */
/* 5. Duplicates can be found from outside                             */
/* ------------------------------------------------------------------ */
console.log("\nThe profile can be audited for repeats");

check(
  /mediaUrls: p\.mediaUrls/.test(upload),
  "the post listing returns image URLs, so repeats can be detected",
  "Google rehosts our images, so only the bytes can match two posts",
);

/* ------------------------------------------------------------------ */
/* 6. Both photo publishers share one memory                           */
/* ------------------------------------------------------------------ */
console.log("\nA job post and the weekly cron cannot pick the same photo");

check(
  /if \(posted\) await recordGbpPhotoUse\(/.test(upload),
  "a job's Google post records its photo in the rotation state",
  "the 24 August Update reran the 8 July gutters photo, byte identical",
);
check(
  upload.includes("const results = gallery ? await uploadGbpPhotos"),
  "replacing an Update does not also add a second copy to the photo gallery",
  "fixing a duplicate by creating one somewhere else is not a fix",
);

check(
  upload.includes('if (step === "gbp-mark")'),
  "a photo published by hand can be recorded in the rotation",
  "a hand-made repost is a third publisher the cron cannot otherwise see",
);

console.log(
  failures === 0
    ? "\nAll social checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
