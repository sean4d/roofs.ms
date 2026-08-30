/**
 * Build the favicon and app-icon set from the roof mark.
 *
 * Run with `node scripts/build-icons.mjs` after changing the mark artwork.
 *
 * WHY THIS EXISTS. The tab icon used to point straight at the 2048px brand
 * lockup, lettering, divider bar, internal padding and all. A browser asked
 * for sixteen pixels then downscaled the whole thing itself, so the roof
 * ended up occupying about a third of the height and the word "SOUTHEAST
 * LIGHTS" became a grey smudge under it. Small and blurry, and no amount of
 * fiddling with the source file fixes it, because the problem is that one
 * image was doing a job that needs several.
 *
 * So each size is rendered here, on purpose, at the size it will be shown:
 * a 16px favicon is drawn as 16px with a sharpening pass, not handed to the
 * browser as 512px and hoped for.
 *
 * WHY A FILLED TILE, when the roofing site's favicon is a transparent mark.
 * Roofing's mark is a single-colour vector, so it can flip navy-on-light to
 * white-on-dark and sit directly on the tab bar. This mark is full colour,
 * and the white fur on the hat disappears against a light tab. Painting it
 * on the site's own near-black gives one icon that reads on both, and it is
 * the same choice roofing already makes for its installed-app icon.
 */
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const MARK = "public/brand/southeast-lights-roofmark.png";
const INK = "#0A0908";

/** Fraction of the tile the mark spans horizontally. */
const FILL = 0.88;
/** Corner radius as a fraction of the tile, roughly the iOS squircle. */
const RADIUS = 0.22;

/**
 * One square icon: ink tile, mark centred on it.
 *
 * `rounded` is off for Apple and maskable icons, where the platform applies
 * its own mask and a pre-rounded corner shows as a dark notch inside it.
 * `fill` is overridable so the maskable icon can hold its safe zone.
 */
async function tile(size, { rounded = true, fill = FILL } = {}) {
  const markWidth = Math.round(size * fill);
  const mark = await sharp(MARK)
    .resize({ width: markWidth, kernel: "lanczos3" })
    // Small renders lose the chevron edge to the resample; a light pass puts
    // it back. Larger ones are already crisp and sharpening only adds halos.
    .sharpen(size <= 64 ? { sigma: 0.6, m1: 0.5, m2: 2 } : { sigma: 0.4 })
    .toBuffer({ resolveWithObject: true });

  const base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: rounded ? { r: 0, g: 0, b: 0, alpha: 0 } : INK,
    },
  });

  const layers = [];
  if (rounded) {
    const r = Math.round(size * RADIUS);
    layers.push({
      input: Buffer.from(
        `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${INK}"/></svg>`,
      ),
      top: 0,
      left: 0,
    });
  }
  layers.push({
    input: mark.data,
    top: Math.round((size - mark.info.height) / 2),
    left: Math.round((size - mark.info.width) / 2),
  });

  return base.composite(layers).png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Pack PNGs into an .ico.
 *
 * Sharp cannot write the container, but it is only a header, one directory
 * entry per size and the PNG bytes appended. Every browser that still reads
 * .ico accepts PNG-compressed entries.
 */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, data } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    dir.push(entry);
  }

  return Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]);
}

await mkdir("public/favicon", { recursive: true });
await mkdir("public/icons", { recursive: true });

const written = [];
const put = async (path, data) => {
  await writeFile(path, data);
  written.push(`${path}  ${(data.length / 1024).toFixed(1)} kB`);
};

// Tab icons, each drawn at its own size.
const small = {};
for (const size of [16, 32, 48]) {
  small[size] = await tile(size);
  await put(`public/favicon/favicon-${size}.png`, small[size]);
}
await put(
  "src/app/favicon.ico",
  ico([16, 32, 48].map((size) => ({ size, data: small[size] }))),
);

// Installed-app icons. Apple and maskable go full bleed; the maskable one
// also holds the 20% safe zone Android crops into.
await put("src/app/apple-icon.png", await tile(180, { rounded: false }));
await put("public/icons/icon-192.png", await tile(192));
await put("public/icons/icon-512.png", await tile(512));
await put(
  "public/icons/icon-maskable-512.png",
  await tile(512, { rounded: false, fill: 0.6 }),
);

console.log(written.join("\n"));
