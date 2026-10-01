/**
 * Measure the floating Instant Estimate tab on real handset viewports.
 *
 * Throwaway, not wired into any npm script. It exists because every round of
 * tuning this tab has gone through was argued from a number, and a number read
 * off the class list is not a measurement: writing-mode: vertical-rl swaps the
 * padding axes, so the box the browser computes has repeatedly disagreed with
 * the box the code asked for.
 *
 * It reports the painted box, the content inside it and the clearance to the
 * header and the bottom bar, because "too tall" was never about the height on
 * its own.
 *
 * Run a production server on :3100 first, then: node scripts/measure-rail.mjs
 */
import { chromium } from "playwright-core";

const DEVICES = [
  ["iPhone SE", 375, 667],
  ["iPhone 13 / 14", 390, 844],
  ["iPhone 14 Pro Max", 430, 932],
  ["short Android", 360, 640],
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

for (const [name, width, height] of DEVICES) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  // The rail stands down while a hero CTA is on screen, so measure it where it
  // is actually meant to appear: scrolled past the hero.
  await page.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(600);

  const m = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="instant-estimate-rail"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const span = el.querySelector("span:not([aria-hidden])");
    const sr = span?.getBoundingClientRect();
    const icon = el.querySelector("svg.relative, .lucide");
    const ir = icon?.getBoundingClientRect();
    return {
      vw: window.innerWidth,
      vh: window.innerHeight,
      w: Math.round(r.width * 10) / 10,
      h: Math.round(r.height * 10) / 10,
      top: Math.round(r.top),
      bottom: Math.round(window.innerHeight - r.bottom),
      right: Math.round(window.innerWidth - r.right),
      opacity: cs.opacity,
      position: cs.position,
      padding: cs.padding,
      font: cs.fontSize,
      labelH: sr ? Math.round(sr.height) : null,
      // How much navy is left over above the icon and below the label.
      padAbove: ir && sr ? Math.round(ir.top - r.top) : null,
      padBelow: sr ? Math.round(r.bottom - sr.bottom) : null,
    };
  });

  if (!m) {
    console.log(`${name.padEnd(20)} NOT FOUND`);
  } else {
    console.log(
      `${name.padEnd(20)} viewport ${m.vw}x${m.vh}  tab ${m.w}x${m.h}  ` +
        `pos ${m.position} op ${m.opacity}  pad ${m.padding}  font ${m.font}\n` +
        `${" ".repeat(20)} top ${m.top}  bottom-gap ${m.bottom}  right ${m.right}  ` +
        `label ${m.labelH}px  empty above ${m.padAbove}  empty below ${m.padBelow}`,
    );
  }
  await page.close();
}

/*
 * The no-CTA path, which resolves through a deferred setShown rather than
 * through the observer. It is the path that would silently never show the tab
 * if that deferral were ever cancelled wrongly, and nothing else exercises it.
 */
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
await page.goto("http://127.0.0.1:3100/about", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const onNoCta = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="instant-estimate-rail"]');
  if (!el) return "missing";
  const r = el.getBoundingClientRect();
  return `${getComputedStyle(el).opacity} at ${Math.round(r.width)}x${Math.round(r.height)}, ${document.querySelectorAll("[data-estimate-cta]").length} CTAs on the page`;
});
console.log(`\n/about (no hero CTA): ${onNoCta}`);
await page.close();

await browser.close();
