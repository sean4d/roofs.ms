/** Detect horizontal overflow and offscreen elements across pages/widths. */
import { chromium } from "playwright";
const BASE = process.env.BASE ?? "http://localhost:3231";
const PATHS = ["/", "/estimator", "/quote", "/commercial/request-proposal", "/commercial",
  "/commercial/hoa-communities", "/services/permanent-architectural-lighting",
  "/service-areas/hattiesburg", "/projects", "/faq", "/about", "/inspiration", "/reviews"];
const WIDTHS = [375, 390, 430, 768, 1280, 1440, 1920];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const problems = [];
for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const p of PATHS) {
    await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load").catch(() => {});
    await page.waitForTimeout(600);
    const r = await page.evaluate((vw) => {
      const doc = document.documentElement;
      const over = doc.scrollWidth > vw + 1;
      const bad = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && b.right > vw + 2;
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
      return { over, scrollWidth: doc.scrollWidth, bad };
    }, w);
    if (r.over) problems.push(`${w}px ${p}  scrollWidth=${r.scrollWidth}  [${r.bad.join(", ")}]`);
  }
  await page.close();
}
await browser.close();
console.log(problems.length ? "OVERFLOW:\n" + problems.map((p) => "  " + p).join("\n")
  : `No horizontal overflow across ${PATHS.length} pages x ${WIDTHS.length} widths (${PATHS.length * WIDTHS.length} checks)`);
