import { readFileSync } from "node:fs";

import { siteConfig } from "@/config/site";

/**
 * The two routes into the estimator, and the address box that feeds it.
 *
 * WHY THIS EXISTS. Two things here fail silently and neither shows up in a
 * screenshot of one screen size.
 *
 * ONE, THE BREAKPOINTS. A phone gets the right-edge rail and a desktop gets a
 * header button, and the pair has to be exactly complementary. If the two
 * conditions ever drift apart there is either a band of widths showing both
 * invitations to the same page, or a band showing neither. Both look fine at
 * whatever width the person making the change happened to have open.
 *
 * TWO, THE BACKEND CONTRACT. Adding autocomplete changed what the CUSTOMER
 * types. It must not change what /api/instant-estimate receives, which is a
 * single formatted address string it then geocodes. Suggestions are an
 * accelerator on top of a field that still works when they never arrive:
 * Google being unreachable, a rural address Places has never heard of, a
 * browser with the request blocked. In all three the customer types and
 * submits exactly as before.
 *
 * Run: npm run check:estimate-cta
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

const rail = read("src/components/layout/instant-estimate-rail.tsx");
const header = read("src/components/layout/site-header.tsx");
const estimator = read("src/components/estimate/instant-estimator.tsx");
const combobox = read("src/components/estimate/address-autocomplete.tsx");
const proxy = read("src/app/api/places/autocomplete/route.ts");
const layout = read("src/app/(marketing)/layout.tsx");

/* ------------------------------------------------------------------ */
/* 1. Exactly one version at every width                               */
/* ------------------------------------------------------------------ */
console.log("\nOne CTA version per breakpoint, never two and never none");

check(
  rail.includes("md:hidden"),
  "the rail hides from md up",
  "rail must stop exactly where the header button starts",
);
check(
  /className="hidden md:inline-flex"/.test(header),
  "the header button appears from md up",
);
// The two must name the SAME breakpoint. Different ones leave a gap or an
// overlap that only shows at the widths nobody tests at.
const railBp = /(\w+):hidden/.exec(rail)?.[1];
const headerBp = /className="hidden (\w+):inline-flex"/.exec(header)?.[1];
check(
  Boolean(railBp) && railBp === headerBp,
  `both switch at the same breakpoint (rail ${railBp}, header ${headerBp})`,
);

check(
  layout.includes("InstantEstimateRail"),
  "the rail is mounted in the marketing layout",
);

/* ------------------------------------------------------------------ */
/* 2. Both go to the real tool                                         */
/* ------------------------------------------------------------------ */
console.log("\nBoth link to the estimator itself");

check(
  rail.includes("siteConfig.links.instantEstimate"),
  "the rail links via siteConfig, not a hardcoded path",
);
check(
  header.includes("siteConfig.links.instantEstimate"),
  "the header button links via siteConfig, not a hardcoded path",
);
check(
  siteConfig.links.instantEstimate.startsWith("/"),
  `the configured target is an internal path (${siteConfig.links.instantEstimate})`,
);

/* ------------------------------------------------------------------ */
/* 3. The rail keeps out of the way                                    */
/* ------------------------------------------------------------------ */
console.log("\nThe rail clears the furniture it shares a screen with");

check(
  /bottom-\[calc\([^\]]*env\(safe-area-inset-bottom/.test(rail),
  "it sits above the bottom bar and the safe-area inset, not at 0",
);
check(
  rail.includes("env(safe-area-inset-right"),
  "it respects the right safe-area inset for curved and notched screens",
);
// Match the class list, not the file: the comment above it explains the
// header and bottom bar sit at z-50, and a naive substring search found that
// prose and called it a defect.
const railClasses = rail.slice(rail.indexOf("className={["), rail.indexOf("].join"));
check(
  railClasses.includes("z-40") && !railClasses.includes("z-50"),
  "it sits below the header and bottom bar at z-40, so it never covers them",
);
check(
  rail.includes(siteConfig.links.instantEstimate) ||
    rail.includes("pathname === siteConfig.links.instantEstimate"),
  "it hides on the estimator page rather than linking to the current page",
);
for (const app of ["/pin", "/studio", "/production"]) {
  check(
    rail.includes(`"${app}"`),
    `it stays off ${app}, which is not a marketing surface`,
  );
}

/* ------------------------------------------------------------------ */
/* 4. The backend contract is untouched                                */
/* ------------------------------------------------------------------ */
console.log("\nThe estimator still submits what the API expects");

// One string called address, exactly as before autocomplete existed.
check(
  /body: JSON\.stringify\(\{[\s\S]{0,200}?\baddress,/.test(estimator),
  "the submitted payload still carries a single address string",
);
check(
  !estimator.includes("placeId"),
  "no place id is smuggled into the estimate request",
  "the API geocodes the string; anything else would be a second contract",
);
check(
  combobox.includes("required={required}") && estimator.includes("required"),
  "the field is still required, so an empty address cannot be submitted",
);

/* ------------------------------------------------------------------ */
/* 5. Suggestions are an accelerator, never a gate                     */
/* ------------------------------------------------------------------ */
console.log("\nA typed address still works when suggestions do not");

check(
  /if \(!key\) return NextResponse\.json\(\{ ok: true, suggestions: \[\] \}\)/.test(
    proxy,
  ),
  "a missing API key returns an empty list, not an error",
);
check(
  /catch[\s\S]{0,200}suggestions: \[\]/.test(proxy),
  "a failed upstream call returns an empty list, not an error",
);
check(
  !combobox.includes("readOnly") && !combobox.includes("disabled"),
  "the input is never locked to force a selection",
);
check(
  /e\.key === "Enter" && active >= 0/.test(combobox),
  "Enter only picks a suggestion when one is highlighted, so it still submits",
);

/* ------------------------------------------------------------------ */
/* 6. The key stays on the server, and the calls stay cheap            */
/* ------------------------------------------------------------------ */
console.log("\nThe key stays server side and the calls stay bounded");

check(
  !combobox.includes("googleapis.com") &&
    combobox.includes("/api/places/autocomplete"),
  "the browser talks to our proxy, never to Google directly",
);
check(
  proxy.includes("GOOGLE_MAPS_SERVER_KEY") &&
    !proxy.includes("NEXT_PUBLIC_"),
  "the proxy uses the server key, which is never exposed to the client",
);
check(proxy.includes("sameOrigin"), "the proxy refuses cross-site callers");
check(
  /input\.length < 3/.test(proxy) && /q\.length < 3/.test(combobox),
  "nothing is looked up below three characters, on both sides",
);
check(
  /setTimeout\([\s\S]{0,1200}?\}, \d{3}\)/.test(combobox),
  "lookups are debounced rather than fired per keystroke",
);
check(
  proxy.includes("X-Goog-FieldMask"),
  "a field mask is sent, which is what keeps the response small and the SKU cheap",
);
check(
  proxy.includes("MAX_PER_WINDOW"),
  "there is a per-IP ceiling behind the debounce",
);
check(
  proxy.includes("includedRegionCodes") && proxy.includes("locationBias"),
  "results are restricted to the US and biased to the service area",
);

console.log(
  failures === 0
    ? "\nAll estimate CTA and address checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
