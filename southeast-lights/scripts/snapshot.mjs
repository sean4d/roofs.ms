/**
 * Capture full-page screenshots of the key routes for a visual review pass.
 *
 * Writes base64 JPEGs to /tmp/snaps.json for embedding in a review document.
 * Point BASE at a running server:
 *
 *   BASE=http://localhost:3000 node scripts/snapshot.mjs
 *
 * Development tooling only. Nothing in the site imports this.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3214";
const PAGES = [
  ["Home", "/"],
  ["Off-season", "/?season=offseason"],
  ["Estimator", "/estimator"],
  ["HOA", "/commercial/hoa-communities"],
  ["Commercial", "/commercial"],
  ["Hattiesburg", "/service-areas/hattiesburg"],
  ["Projects", "/projects"],
  ["Holiday", "/holiday-lighting"],
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const out = [];

for (const [name, path] of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load").catch(() => {});
  await page.waitForTimeout(2500);
  const buf = await page.screenshot({ fullPage: true, type: "jpeg", quality: 62 });
  out.push({ name, path, data: buf.toString("base64") });
  console.log(`${name.padEnd(14)} ${(buf.length / 1024).toFixed(0)}KB`);
  await page.close();
}
await browser.close();
fs.writeFileSync("/tmp/snaps.json", JSON.stringify(out));
console.log(`total ${(JSON.stringify(out).length / 1e6).toFixed(1)}MB`);
