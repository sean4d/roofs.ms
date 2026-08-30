/**
 * Build the favicon and app-icon set from the roof mark.
 *
 *   npm run icons:build
 *
 * WHY THIS FILE EXISTS. The tab icon used to point straight at the 2048px
 * brand lockup, lettering and all, for every size a browser might ask for.
 * The browser then shrank the whole thing to sixteen pixels itself, so the
 * roof came out about a third of the height and the wordmark under it became
 * a grey smudge. Rendering each size deliberately, at the size it will be
 * shown, is the only thing that fixes that.
 *
 * TWO THINGS LEARNED THE HARD WAY, both worth keeping:
 *
 * 1. NO TILE BEHIND THE TAB ICON. The first version of this script painted
 *    the mark on a rounded near-black square. The mark's red pixels cover
 *    only about a quarter of their own bounding box, and that box is nearly
 *    two to one, so on a square tile the artwork worked out to roughly a
 *    tenth of the icon and the other nine tenths were black. In a tab it
 *    read as a black square. The mark now sits on transparency, the way the
 *    roofing site's favicon does.
 *
 * 2. CROP TO THE PART THAT SURVIVES SIXTEEN PIXELS. The full mark is a wide
 *    lockup: hat, main gable, and a second chevron trailing off to the right.
 *    Fitted into a square it is half the height of the frame and every stroke
 *    lands on less than a pixel. Cropping to the hat and the main gable, the
 *    half anyone would actually recognise, makes the same artwork about
 *    seventy percent larger in the icon without redrawing anything.
 *
 * The installed-app icons keep a filled tile, because iOS and Android
 * composite them onto backgrounds of their own and a transparent app icon
 * looks broken. At 180px and up the detail is all visible anyway, so the
 * tile costs nothing there.
 */
import { Buffer } from "node:buffer";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const MARK = "public/brand/southeast-lights-roofmark.png";
const INK = "#0A0908";

/**
 * The hat and the main gable, out of the full 1523x800 mark.
 *
 * Nearly square on purpose, so fitting it into the icon barely scales it
 * down. Nudging these numbers changes how much of the second chevron shows;
 * anything wider starts shrinking the hat again.
 */
const CROP = { left: 120, top: 0, width: 880, height: 800 };

/** Sharpen small renders only. Larger ones are crisp and only gain halos. */
const sharpenFor = (size) =>
  size <= 64 ? { sigma: 0.6, m1: 0.5, m2: 2 } : { sigma: 0.4 };

/** The cropped mark, scaled to fit a square of `size` at `fill` of its width. */
async function mark(size, fill) {
  const box = Math.round(size * fill);
  return sharp(MARK)
    .extract(CROP)
    .resize(box, box, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: "lanczos3",
    })
    .sharpen(sharpenFor(size))
    .toBuffer({ resolveWithObject: true });
}

/** Tab icon: the mark on transparency, near full bleed. */
async function favicon(size) {
  const m = await mark(size, 1);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: m.data,
        top: Math.round((size - m.info.height) / 2),
        left: Math.round((size - m.info.width) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Installed-app icon: the mark on a filled tile.
 *
 * `rounded` is off for Apple and maskable icons, where the platform applies
 * its own mask and a pre-rounded corner shows as a dark notch inside it.
 * `fill` drops for the maskable icon, which has to hold a safe zone Android
 * crops into.
 */
async function appIcon(size, { rounded = true, fill = 0.82 } = {}) {
  const m = await mark(size, fill);
  const layers = [];

  if (rounded) {
    const r = Math.round(size * 0.22);
    layers.push({
      input: Buffer.from(
        `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${INK}"/></svg>`,
      ),
      top: 0,
      left: 0,
    });
  }

  layers.push({
    input: m.data,
    top: Math.round((size - m.info.height) / 2),
    left: Math.round((size - m.info.width) / 2),
  });

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: rounded ? { r: 0, g: 0, b: 0, alpha: 0 } : INK,
    },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer();
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

// Tab icons, each drawn at its own size, on transparency.
const small = {};
for (const size of [16, 32, 48]) {
  small[size] = await favicon(size);
  await put(`public/favicon/favicon-${size}.png`, small[size]);
}
await put(
  "src/app/favicon.ico",
  ico([16, 32, 48].map((size) => ({ size, data: small[size] }))),
);

// Installed-app icons, on a filled tile.
await put("src/app/apple-icon.png", await appIcon(180, { rounded: false }));
await put("public/icons/icon-192.png", await appIcon(192));
await put("public/icons/icon-512.png", await appIcon(512));
await put(
  "public/icons/icon-maskable-512.png",
  await appIcon(512, { rounded: false, fill: 0.58 }),
);

console.log(written.join("\n"));
