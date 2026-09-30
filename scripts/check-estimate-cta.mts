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

// The class list alone, not the whole file: the comments in it discuss the
// z-50 header and the px/py trap, and a naive substring search over the file
// found that prose and called it a defect.
const railClasses = rail.slice(
  rail.indexOf("className={["),
  rail.indexOf("].join"),
);

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
  rail.includes("IntersectionObserver") && rail.includes("data-estimate-cta"),
  "the rail stands down while a real in-page CTA is on screen",
);
check(
  /setShown\(true\)/.test(rail) && /targets\.length === 0/.test(rail),
  "a page with no in-page CTA still gets the rail",
);
check(
  /useState\(false\)/.test(rail),
  "it starts hidden, so the homepage never flashes it over the hero",
);
check(
  rail.includes("tabIndex={shown ? undefined : -1}") &&
    rail.includes("aria-hidden={shown ? undefined : true}"),
  "a hidden rail is out of the tab order and off the screen reader",
);
check(
  rail.includes("motion-reduce:transition-none"),
  "the reveal respects prefers-reduced-motion",
);

/*
 * THE AXIS TRAP, and it cost several rounds of tuning.
 *
 * Tailwind's py-* compiles to padding-block and px-* to padding-inline. Under
 * writing-mode: vertical-rl the inline axis runs DOWN the screen, so the two
 * swap: py-* pads the sides and px-* pads the ends. The tab carried py-2.5,
 * then py-8, and its height never moved, because both were padding the sides
 * where physical pr-3 and pl-4 overrode them to zero. Computed style read
 * "0px 12px 0px 16px" against a class list asking for 32px top and bottom.
 *
 * Written as paddingInline and paddingBlock there is nothing to get
 * backwards, so that is what this insists on.
 */
check(
  rail.includes("paddingInline") && rail.includes("paddingBlock"),
  "the tab sets padding in logical properties, not py-*/px-*",
);
check(
  !/\bp[xy]-[\d.]+/.test(railClasses),
  "no px-*/py-* on the tab, where the axes are swapped",
  "use paddingInline for its height and paddingBlock for its width",
);

// Every CTA the rail is meant to defer to has to carry the marker, or the
// rail sits on top of a real button and the duplication is back.
for (const [file, label] of [
  ["src/components/home/hero.tsx", "the homepage hero"],
  ["src/components/tools/cta-section.tsx", "the tools CTA strip"],
  ["src/components/quote/quote-wizard.tsx", "the quote wizard"],
] as const) {
  check(
    read(file).includes("data-estimate-cta"),
    `${label} is marked so the rail defers to it`,
  );
}
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

/* ------------------------------------------------------------------ */
/* 7. Every address field on the site gets suggestions                 */
/* ------------------------------------------------------------------ */
console.log("\nEvery address field uses the shared box");

const ADDRESS_FORMS = [
  ["src/components/forms/lead-form.tsx", "the lead form"],
  ["src/components/forms/commercial-form.tsx", "the commercial form"],
  ["src/components/quote/quote-wizard.tsx", "the quote wizard"],
  [
    "src/app/(marketing)/storm-damage/insurance-claims/wizard/insurance-wizard.tsx",
    "the insurance wizard",
  ],
  [
    "src/app/(marketing)/roof-damage-analyzer/damage-analyzer.tsx",
    "the damage analyzer",
  ],
] as const;

for (const [file, label] of ADDRESS_FORMS) {
  const src = read(file);
  check(src.includes("AddressAutocomplete"), `${label} uses the shared box`);
  check(
    src.includes('mode="street"'),
    `${label} writes the street line, not the whole formatted address`,
    "a box labelled Street address should not end up holding the city and ZIP",
  );
  // A plain input left behind would be the old field, still there, silently.
  check(
    !/<input[^>]*autoComplete="street-address"/.test(src),
    `${label} has no plain address input left over`,
  );
}

check(
  combobox.includes("parseAddressParts") && combobox.includes("fillSiblings"),
  "choosing a suggestion fills the form's city, state and ZIP too",
);

/*
 * The ZIP needs a second call, and finding that out the hard way is the point
 * of these two checks.
 *
 * Autocomplete's secondary line is "Petal, MS, USA". There is no postal code
 * anywhere in the response. A browser test drove the whole flow green against
 * a stubbed payload that carried one, because the fixture was written from
 * what the response was assumed to look like. The ZIP box had never filled in
 * production even once.
 */
/*
 * The icon padding is the component's own business.
 *
 * The default class string carried pl-11 to clear the pin. Every form passes
 * its own className to match the fields around it, which REPLACED that string
 * wholesale, so the pin printed straight through whatever was typed. The
 * owner's screenshot caught it over the 3 of 3705.
 */
check(
  /className=\{cn\(/.test(combobox) && /"pl-11 pr-11"/.test(combobox),
  "icon padding is merged onto any caller className, not replaced by it",
);
for (const [file, label] of ADDRESS_FORMS) {
  check(
    !/pl-11/.test(read(file)),
    `${label} does not hand-patch the icon padding`,
    "the component owns it now; a second copy drifts",
  );
}

check(
  combobox.includes("/api/places/resolve"),
  "the ZIP is resolved separately, because autocomplete does not return one",
);
const resolve = read("src/app/api/places/resolve/route.ts");
check(
  resolve.includes("geocode("),
  "resolve reuses the geocoder rather than buying a second Places SKU",
);
check(
  resolve.includes("sameOrigin") && resolve.includes("MAX_PER_WINDOW"),
  "resolve is same-origin only and rate limited",
);
check(
  /catch[\s\S]{0,120}NOTHING/.test(resolve) &&
    resolve.includes("const NOTHING"),
  "a failed resolve returns empty parts, never an error",
  "the first pass has already filled what it could; there is nothing to undo",
);
check(
  combobox.includes("US_STATES"),
  "the parser only accepts real US state codes",
  "without it \"London, UK\" parsed as state UK and overwrote a real field",
);

console.log(
  failures === 0
    ? "\nAll estimate CTA and address checks passed.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
