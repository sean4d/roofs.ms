import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = "public/img";
// Heroes stay wide; cards need less. next/image resamples down from these.
const WIDE = new Set(["holiday-hero-estate","estate-wide","permanent-hero","hoa-entrance"]);
const files = fs.readdirSync(dir).filter(f => f.endsWith(".png"));
const manifest = {};

for (const f of files) {
  const name = path.basename(f, ".png");
  const src = path.join(dir, f);
  const maxW = WIDE.has(name) ? 2400 : 1600;
  const img = sharp(src);
  const meta = await img.metadata();
  const outPath = path.join(dir, `${name}.webp`);

  await sharp(src)
    .resize({ width: Math.min(maxW, meta.width), withoutEnlargement: true })
    .webp({ quality: 76, effort: 6 })
    .toFile(outPath);

  // Tiny LQIP so hero areas never flash empty.
  const blur = await sharp(src).resize(16).webp({ quality: 28 }).toBuffer();
  const out = fs.statSync(outPath);
  const resized = await sharp(outPath).metadata();
  manifest[name] = {
    width: resized.width,
    height: resized.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
  console.log(`${name.padEnd(22)} ${meta.width}x${meta.height} -> ${resized.width}x${resized.height}  ${(fs.statSync(src).size/1e6).toFixed(1)}MB -> ${(out.size/1024).toFixed(0)}KB`);
  fs.unlinkSync(src);
}

fs.writeFileSync("src/config/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${Object.keys(manifest).length} images optimized`);
