/**
 * Screenshot the floating Instant Estimate tab, cropped and in context.
 *
 * Throwaway companion to measure-rail.mjs. Numbers said the tab was 44x230
 * through several rounds where it still looked wrong, so the shape gets looked
 * at as well as measured.
 *
 * Run a production server on :3100 first, then: node scripts/shot-rail.mjs
 */
import { chromium } from "playwright-core";

const OUT = process.argv[2] ?? "/tmp/rail";

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 2000));
// Lazy images below the fold have to actually arrive or the context shot shows
// the tab against empty placeholders.
await page.waitForFunction(
  () =>
    [...document.querySelectorAll("img")].every(
      (i) => !i.complete || i.naturalWidth > 0,
    ),
  null,
  { timeout: 10_000 },
);
await page.waitForTimeout(700);

const box = await page
  .locator('[data-testid="instant-estimate-rail"]')
  .boundingBox();
if (!box) throw new Error("the rail is not on screen");

await page.screenshot({
  path: `${OUT}-crop.png`,
  clip: {
    x: box.x - 36,
    y: box.y - 24,
    width: box.width + 36,
    height: box.height + 48,
  },
});
await page.screenshot({ path: `${OUT}-context.png` });
console.log(
  `${OUT}-crop.png and ${OUT}-context.png written; tab ${box.width}x${box.height}`,
);

await browser.close();
