/**
 * Capture a page in readable viewport-sized slices by scrolling.
 * Full-page screenshots of a long page render too small to judge detail.
 *
 *   BASE=http://localhost:3000 node scripts/slice.mjs /path 1440 900 6
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3220";
const [path, w, h, count] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5]];
const tag = process.argv[6] ?? "slice";

fs.mkdirSync("/tmp/shots", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: w, height: h } });
await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
await page.waitForLoadState("load").catch(() => {});
await page.waitForTimeout(2500);

const total = await page.evaluate(() => document.body.scrollHeight);
for (let i = 0; i < count; i++) {
  const y = Math.round((i * (total - h)) / Math.max(1, count - 1));
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `/tmp/shots/${tag}-${i}.png` });
  console.log(`${tag}-${i}  y=${y}`);
}
await browser.close();
