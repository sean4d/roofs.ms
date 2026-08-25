/**
 * Trim transparent padding from the brand logos.
 *
 * The source artwork is a 2048x2048 square that is ~87% empty, so any
 * `h-N w-auto` rendering produced a square box with a tiny mark floating in
 * it, which read as squashed. Trimming makes the intrinsic aspect ratio match
 * the actual artwork, so the logo sizes correctly everywhere with no
 * per-usage fudging.
 *
 * Run after replacing any brand file. Idempotent.
 */
import sharp from "sharp";
import fs from "node:fs";

const SOURCES = [
  ["public/brand/southeast-lights-logo.png", "public/brand/southeast-lights-mark.png"],
  ["public/brand/southeast-roofing-logo.png", "public/brand/southeast-roofing-mark.png"],
];

for (const [src, out] of SOURCES) {
  const before = await sharp(src).metadata();
  await sharp(src)
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9 })
    .toFile(out);
  const after = await sharp(out).metadata();
  console.log(
    `${src.split("/").pop()}  ${before.width}x${before.height} (${(before.width / before.height).toFixed(2)}) ` +
      `-> ${after.width}x${after.height} (${(after.width / after.height).toFixed(2)})  ` +
      `${(fs.statSync(out).size / 1024).toFixed(0)}KB`,
  );
}
