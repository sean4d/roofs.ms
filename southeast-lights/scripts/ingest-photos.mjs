/**
 * Ingest owner-supplied photography.
 *
 * Drop files into southeast-lights/incoming/ using the slot names below, then:
 *
 *   npm run images:ingest
 *
 * Each file is resized, converted to WebP, given an LQIP blur placeholder,
 * written into public/img/ under the slot name, and the manifest regenerated.
 * No code changes needed: the layouts, crops, aspect ratios and scrims are
 * already built around these slots.
 *
 * Accepts .jpg .jpeg .png .webp .heic (HEIC only if libvips was built with it).
 *
 * Slots, and where each one appears:
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SLOTS = {
  "holiday-hero-estate": { width: 2400, use: "Homepage hero, holiday mode" },
  "permanent-hero": { width: 2400, use: "Homepage hero, off-season mode" },
  "estate-wide": { width: 2400, use: "Final CTA band, services hub hero" },
  "hoa-entrance": { width: 2400, use: "HOA segment tile, HOA vertical hero" },
  "retail-center": { width: 1600, use: "Commercial segment tile and vertical" },
  "colonial-columns": { width: 1600, use: "Residential segment tile" },
  "installer-roof": { width: 1600, use: "Why a roofing company section" },
  "crew-boom-lift": { width: 1600, use: "About hero, commercial proof" },
  "live-oak-wrap": { width: 1600, use: "Tree wrapping service" },
  church: { width: 1600, use: "Churches vertical" },
  "country-club": { width: 1600, use: "Country clubs vertical" },
  "golf-club": { width: 1600, use: "Golf clubs" },
  "hotel-resort": { width: 1600, use: "Hotels and resorts vertical" },
  "downtown-municipal": { width: 1600, use: "Municipal vertical" },
  apartments: { width: 1600, use: "Multifamily vertical" },
  "office-building": { width: 1600, use: "Commercial buildings vertical" },
  "bistro-patio": { width: 1600, use: "Bistro and patio service" },
  "mardi-gras": { width: 1600, use: "Mardi Gras service" },
  "wedding-event": { width: 1600, use: "Wedding and event service" },
  "landscape-lighting": { width: 1600, use: "Landscape lighting service" },
  "tree-shrub": { width: 1600, use: "Tree and shrub lighting" },
  "permanent-color": { width: 1600, use: "Permanent lighting in color" },
  "c9-detail": { width: 1600, use: "FAQ hero, C9 close-up" },
  "storage-warehouse": { width: 1600, use: "Storage and organization" },
};

const IN = "incoming";
const OUT = "public/img";
const MANIFEST = "src/config/image-manifest.json";

const IMAGE_RE = /\.(jpe?g|png|webp|heic|heif|tiff?)$/i;
const incoming = fs.existsSync(IN)
  ? fs.readdirSync(IN).filter((f) => IMAGE_RE.test(f))
  : [];

if (incoming.length === 0) {
  console.log("Nothing in incoming/. Slots available:\n");
  for (const [slot, meta] of Object.entries(SLOTS)) {
    console.log(`  ${slot.padEnd(24)} ${meta.use}`);
  }
  console.log("\nName each file after its slot, e.g. incoming/holiday-hero-estate.jpg");
  process.exit(0);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
let done = 0;
const skipped = [];

for (const file of incoming) {
  const slot = path.basename(file, path.extname(file));
  if (!(slot in SLOTS)) {
    skipped.push(file);
    continue;
  }

  const src = path.join(IN, file);
  const out = path.join(OUT, `${slot}.webp`);
  const meta = await sharp(src).metadata();

  await sharp(src)
    .rotate() // honor EXIF orientation from phone photos
    .resize({ width: Math.min(SLOTS[slot].width, meta.width), withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(out);

  const blur = await sharp(src).rotate().resize(16).webp({ quality: 28 }).toBuffer();
  const final = await sharp(out).metadata();

  manifest[slot] = {
    width: final.width,
    height: final.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };

  console.log(
    `${slot.padEnd(24)} ${meta.width}x${meta.height} -> ${final.width}x${final.height}  ` +
      `${(fs.statSync(out).size / 1024).toFixed(0)}KB`,
  );
  done++;
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${done} photo(s) ingested.`);
if (skipped.length) {
  console.log(`Skipped (name does not match a slot): ${skipped.join(", ")}`);
}
console.log("\nNow set isPlaceholder: false for these slots in src/config/images.ts.");
