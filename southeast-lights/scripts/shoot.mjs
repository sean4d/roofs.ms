/**
 * Screenshot arbitrary routes at arbitrary viewports.
 *
 *   node scripts/shoot.mjs '[{"name":"home","path":"/","w":390,"h":844}]'
 *
 * Writes PNGs to /tmp/shots. Pass "full": true for a full-page capture.
 * Development tooling only.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3210";
const shots = JSON.parse(process.argv[2]);
fs.mkdirSync("/tmp/shots", { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const s of shots) {
  const page = await browser.newPage({
    viewport: { width: s.w, height: s.h },
    deviceScaleFactor: 1,
  });
  await page.goto(BASE + s.path, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("load").catch(()=>{});
  await page.waitForTimeout(s.wait ?? 2500);
  await page.screenshot({ path: `/tmp/shots/${s.name}.png`, fullPage: !!s.full });
  console.log(`${s.name}  ${s.w}x${s.h}  ${s.path}`);
  await page.close();
}
await browser.close();
