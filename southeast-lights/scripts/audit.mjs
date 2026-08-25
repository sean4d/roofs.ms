/**
 * SEO and accessibility audit across representative routes.
 *
 * Checks each page for exactly one h1, a meta description, a canonical, valid
 * JSON-LD, alt text on every image, labelled buttons, correct html lang, no
 * heading-level jumps, and unique titles and descriptions across the set.
 *
 *   BASE=http://localhost:3000 node scripts/audit.mjs
 *
 * Exits with a printed problem list. Development tooling only.
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3213";
const PATHS = [
  "/", "/holiday-lighting", "/estimator", "/commercial",
  "/commercial/hoa-communities", "/commercial/churches",
  "/services/christmas-light-installation", "/services/permanent-architectural-lighting",
  "/service-areas/hattiesburg", "/service-areas/biloxi",
  "/projects", "/faq", "/quote", "/about", "/inspiration", "/reviews", "/contact",
  "/commercial/request-proposal", "/services", "/service-areas",
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const titles = new Map();
const descs = new Map();
const problems = [];

for (const path of PATHS) {
  await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("load").catch(() => {});

  const data = await page.evaluate(() => {
    const h1s = [...document.querySelectorAll("h1")];
    const imgs = [...document.querySelectorAll("img")];
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
    // Heading order: flag a jump of more than one level.
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
      Number(h.tagName[1]),
    );
    let jump = null;
    for (let i = 1; i < heads.length; i++) {
      if (heads[i] - heads[i - 1] > 1) { jump = `h${heads[i - 1]}->h${heads[i]}`; break; }
    }
    const btns = [...document.querySelectorAll("button")].filter(
      (b) => !b.textContent.trim() && !b.getAttribute("aria-label"),
    );
    return {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
      h1Count: h1s.length,
      h1: h1s[0]?.textContent?.trim().slice(0, 50) ?? "",
      imgsNoAlt: imgs.filter((i) => !i.hasAttribute("alt")).length,
      ldCount: ld.length,
      ldTypes: ld.map((s) => { try { return JSON.parse(s.textContent)["@type"]; } catch { return "INVALID"; } }),
      jump,
      unlabeledButtons: btns.length,
      lang: document.documentElement.lang,
    };
  });

  if (data.h1Count !== 1) problems.push(`${path}: ${data.h1Count} h1 elements`);
  if (!data.desc) problems.push(`${path}: missing meta description`);
  if (!data.canonical) problems.push(`${path}: missing canonical`);
  if (data.imgsNoAlt > 0) problems.push(`${path}: ${data.imgsNoAlt} img without alt`);
  if (data.ldTypes.includes("INVALID")) problems.push(`${path}: invalid JSON-LD`);
  if (data.jump) problems.push(`${path}: heading jump ${data.jump}`);
  if (data.unlabeledButtons > 0) problems.push(`${path}: ${data.unlabeledButtons} unlabeled button(s)`);
  if (data.lang !== "en") problems.push(`${path}: html lang="${data.lang}"`);

  if (titles.has(data.title)) problems.push(`${path}: duplicate title with ${titles.get(data.title)}`);
  titles.set(data.title, path);
  if (data.desc && descs.has(data.desc)) problems.push(`${path}: duplicate description with ${descs.get(data.desc)}`);
  descs.set(data.desc, path);

  console.log(`${path.padEnd(46)} h1:${data.h1Count} ld:${data.ldCount} [${data.ldTypes.join(",")}]`);
}

await browser.close();
console.log("\n" + (problems.length ? `PROBLEMS (${problems.length}):\n` + problems.map((p) => "  - " + p).join("\n") : "No problems found across " + PATHS.length + " pages"));
