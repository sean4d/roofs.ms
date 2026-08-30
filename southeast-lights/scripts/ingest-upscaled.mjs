/**
 * Bring AI-upscaled owner photographs into public/img.
 *
 * WHY THIS EXISTS, separate from ingest-photos.mjs.
 *
 * The Photo Desk compresses anything attached to it to 800px at JPEG quality
 * 55, so forty-six previews fit inside one artifact. That is fine for saying
 * "this photo, this slot" and useless as a source for a 2400px hero: dropped
 * straight in, those files are blurrier than what they replace, which is the
 * opposite of the point.
 *
 * So the attachments go through a real upscaler first (4096px long edge) and
 * land here. This script is what turns those into published files. It is a
 * one-way trip: the 4096px intermediates are not kept, because the published
 * WebP is what the site serves and the originals live with the owner.
 *
 * Run:  node scripts/ingest-upscaled.mjs <dir-of-pngs>
 * Files are named <slot>.png, camelCase or kebab-case both accepted.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const IN = process.argv[2] ?? "/tmp/upscaled";
const OUT = "public/img";
const MANIFEST = "src/config/image-manifest.json";

/* Long-edge ceiling per slot. Heroes and anything full-bleed get 2400; cards
   and tiles get 1600, which is already more than they are ever displayed at. */
const TARGET = {
  "hoa-entrance": 2400,
  "colonial-columns": 2400,
  "live-oak-wrap": 2400,
  "project-hattiesburg-canopy": 2400,
  "holiday-hero-estate": 2400,
  church: 1600,
  "bistro-patio": 1600,
  "c9-detail": 1600,
  "landscape-lighting": 1600,
  "permanent-color": 1600,
  "storage-warehouse": 1600,
  "tree-shrub": 1600,
  "project-poplarville-colonial": 1600,
};

/**
 * Making the lights pop on a dark page.
 *
 * These are night photographs going onto a near-black site, and the complaint
 * they have to answer is that the bulbs look dull. Three things, in this
 * order, and none of them invent detail:
 *
 *   saturation  warm filament light reads as beige when it is desaturated,
 *               and as light when it is not. 1.14 is enough to see and short
 *               of the point where bulbs go orange.
 *   linear      a black-point pull. Night phone photos sit on a grey veil
 *               because the camera exposes for the highlights; dropping the
 *               floor and lifting the slope separates the bulb from the sky
 *               it sits against, which is exactly what "pop" means here.
 *   sharpen     modest, and applied AFTER the downscale from 4096, where it
 *               is correcting resampling rather than faking resolution.
 */
const enhance = (pipeline) =>
  pipeline
    .modulate({ saturation: 1.14 })
    .linear(1.12, -12)
    .sharpen({ sigma: 0.9, m1: 0.4, m2: 1.6 });

const kebab = (s) => s.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const files = fs.readdirSync(IN).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
let done = 0;

for (const file of files) {
  const slot = kebab(path.basename(file, path.extname(file)));
  const target = TARGET[slot];
  if (!target) {
    console.log(`SKIP  ${slot}  (no target size defined)`);
    continue;
  }

  const src = path.join(IN, file);
  const out = path.join(OUT, `${slot}.webp`);
  const before = await sharp(src).metadata();

  await enhance(
    sharp(src).rotate().resize({
      width: target,
      height: target,
      fit: "inside",
      kernel: "lanczos3",
      // Same rule as the main ingest: a ceiling, never a target to reach for.
      withoutEnlargement: true,
    }),
  )
    .webp({ quality: 90, effort: 6 })
    .toFile(out);

  const blur = await sharp(src).resize(16).webp({ quality: 28 }).toBuffer();
  const after = await sharp(out).metadata();

  manifest[slot] = {
    width: after.width,
    height: after.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };

  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(
    `${slot.padEnd(30)} ${before.width}x${before.height} -> ${after.width}x${after.height}  ${kb}KB`,
  );
  done++;
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${done} images published, manifest updated`);
