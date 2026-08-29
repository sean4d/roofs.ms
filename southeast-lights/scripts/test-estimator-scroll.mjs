/**
 * Estimator scroll test.
 *
 * The estimator's whole promise is that toggling an option changes the house
 * and the price while you can see both. That is a scroll-position property,
 * not something a unit test or a screenshot can hold, so it gets walked.
 *
 * For each viewport it toggles every control in turn and asserts that the
 * house, the price and the control being edited are all on screen at once,
 * clear of the header and the bottom action bar. It also asserts that the
 * dock lets go once the configurator ends.
 *
 *   BASE=http://localhost:3210 node scripts/test-estimator-scroll.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3210";
const HEADER = 64;
const BAR = 84;
const VIEWPORTS = [
  { w: 375, h: 812, label: "iPhone SE / mini" },
  { w: 390, h: 844, label: "iPhone 14/15" },
  { w: 430, h: 932, label: "iPhone Pro Max" },
  { w: 1440, h: 900, label: "desktop" },
];
const CONTROLS = [
  /Add Secondary rooflines/i,
  /Add Peaks/i,
  /Add Dormers/i,
  /Add Window outlines/i,
  /Add Wrapped columns/i,
  /Add Pathway/i,
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
  });
  const desktop = vp.w >= 1024;
  const bar = desktop ? 0 : BAR;
  await page.goto(`${BASE}/estimator`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  // Start where a customer starts: inside the configurator, not at the hero.
  await page.evaluate(() => {
    const dock = document.querySelector(".estimator-dock");
    window.scrollTo({
      top: window.scrollY + dock.getBoundingClientRect().top - 40,
      behavior: "instant",
    });
  });
  await page.waitForTimeout(500);
  console.log(`\n${vp.label} (${vp.w}x${vp.h})`);

  const read = () =>
    page.evaluate(() => {
      const dock = document.querySelector(".estimator-dock");
      const box = (el) => {
        const r = el?.getBoundingClientRect();
        return r ? { top: r.top, bottom: r.bottom, height: r.height } : null;
      };
      return {
        dock: box(dock),
        house: box(dock?.querySelector("svg")),
        price: box(dock?.querySelector(".estimator-price")),
        priceText: dock?.querySelector(".estimator-price")?.textContent?.trim(),
        vh: window.innerHeight,
        docWidth: document.documentElement.scrollWidth,
        vw: window.innerWidth,
      };
    });

  const onScreen = (b, vh) => b && b.bottom > HEADER && b.top < vh - bar;
  let previousPrice = null;
  let previousDockTop = null;

  for (const [index, name] of CONTROLS.entries()) {
    // Hold the handle: the accessible name flips from "Add" to "Remove" on
    // click, so re-querying by the same name after toggling finds nothing.
    const control = await page
      .getByRole("switch", { name })
      .first()
      .elementHandle();
    /*
     * Park the control in the middle of the free strip between the dock and
     * the action bar, which is where a thumb would leave it. Deliberately not
     * scrollIntoViewIfNeeded: that is a legacy Blink API which ignores
     * block-end scroll-margin, so it parks things under the action bar and
     * tests the browser rather than the layout.
     */
    await page.evaluate(
      ([el, headerPx, barPx]) => {
        const rect = el.getBoundingClientRect();
        const top =
          headerPx +
          (window.innerHeight - barPx - headerPx) / 2 -
          rect.height / 2;
        window.scrollTo({
          top: window.scrollY + rect.top - top,
          behavior: "instant",
        });
      },
      [control, HEADER + (desktop ? 0 : 175), bar],
    );
    await page.waitForTimeout(200);
    await control.click();
    await page.waitForTimeout(320);

    const state = await read();
    const label = `${index + 1}. ${String(name).slice(1, -2)}`;
    if (!onScreen(state.house, state.vh)) fail(`${label}: house off screen`);
    if (!onScreen(state.price, state.vh)) fail(`${label}: price off screen`);
    if (state.docWidth > state.vw + 1)
      fail(
        `${label}: document ${state.docWidth}px wide in a ${state.vw}px viewport`,
      );

    const box = await control.boundingBox();
    if (!box || box.y + box.height > state.vh - bar || box.y < HEADER)
      fail(
        `${label}: the control being edited is under the header or the action bar`,
      );

    if (previousPrice === state.priceText)
      fail(`${label}: price did not move (${state.priceText})`);
    previousPrice = state.priceText;

    // Once pinned the dock must not drift between steps.
    if (
      previousDockTop !== null &&
      Math.abs(state.dock.top - previousDockTop) > 1
    )
      fail(
        `${label}: dock jumped ${Math.round(state.dock.top - previousDockTop)}px`,
      );
    if (state.dock.top <= HEADER + 2) previousDockTop = state.dock.top;

    console.log(
      `  ok  ${label.padEnd(30)} dock@${Math.round(state.dock.top)} h${Math.round(state.dock.height)}  ${state.priceText}`,
    );
  }

  // Containment: past the configurator the dock stops sticking.
  await page.evaluate(() =>
    window.scrollTo({
      top: document.body.scrollHeight - 1400,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(400);
  const after = await read();
  if (after.dock.bottom > HEADER)
    fail(
      `dock still pinned past the configurator (bottom ${Math.round(after.dock.bottom)})`,
    );
  else console.log("  ok  dock releases past the configurator");

  await page.close();
}

await browser.close();
console.log(
  failures === 0
    ? `\nestimator scroll: all checks pass across ${VIEWPORTS.length} viewports`
    : `\nestimator scroll: ${failures} failure(s)`,
);
process.exit(failures === 0 ? 0 : 1);
