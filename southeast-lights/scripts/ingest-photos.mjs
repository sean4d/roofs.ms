/**
 * Ingest owner-supplied photography.
 *
 * Drop files into southeast-lights/incoming/ using the slot names below, then:
 *
 *   npm run images:ingest
 *
 * Each file is enhanced, resized, converted to WebP, given a blur placeholder,
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
  "permanent-hero": { width: 2400, use: "Homepage hero, off-season mode" },
  "estate-wide": { width: 2400, use: "Final CTA band, services hub hero" },
  "retail-center": { width: 1600, use: "Commercial segment tile and vertical" },
  "colonial-columns": { width: 1600, use: "Residential segment tile" },
  "installer-roof": { width: 1600, use: "Why a roofing company section" },
  "live-oak-wrap": { width: 1600, use: "Tree wrapping service" },
  "tree-wrapping-hero": {
    width: 2400,
    use: "Tree Lighting & Wrapping card and service hero",
  },
  church: { width: 1600, use: "Churches vertical" },
  "country-club": { width: 1600, use: "Country clubs vertical" },
  "hotel-resort": { width: 1600, use: "Hotels and resorts vertical" },
  "downtown-municipal": { width: 1600, use: "Municipal vertical" },
  "bistro-patio": { width: 1600, use: "Bistro and patio service" },
  "mardi-gras": { width: 1600, use: "Mardi Gras service" },
  "wedding-event": { width: 1600, use: "Wedding and event service" },
  "landscape-lighting": { width: 1600, use: "Landscape lighting service" },
  "landscape-lighting-hero": {
    width: 2400,
    use: "Landscape Lighting card and service hero",
  },
  "tree-shrub": { width: 1600, use: "Tree and shrub lighting" },
  "permanent-color": { width: 1600, use: "Permanent lighting in color" },
  "c9-detail": { width: 1600, use: "FAQ hero, C9 close-up" },
  "storage-warehouse": { width: 1600, use: "Storage and organization" },
  "components-flatlay": {
    width: 2000,
    use: "What's included section, holiday lighting page",
  },
  "project-poplarville-colonial": {
    width: 1600,
    use: "Gallery project: Poplarville colonial",
  },
  "project-hattiesburg-ridges-hips": {
    width: 1600,
    use: "Gallery project: Hattiesburg ridges and hips",
  },
  "project-hattiesburg-palms": {
    width: 1600,
    use: "Gallery project: Hattiesburg wrapped palms",
  },
  "project-poplarville-blue-white": {
    width: 1600,
    use: "Gallery project: Poplarville blue and white",
  },
  "project-poplarville-red-green-white": {
    width: 1600,
    use: "Gallery project: Poplarville red, green and white",
  },
  "project-poplarville-outbuildings": {
    width: 1600,
    use: "Gallery project: Poplarville outbuildings",
  },
  "project-poplarville-apples": {
    width: 1600,
    use: "Gallery project: Apples Ltd. storefront, Poplarville",
  },
  "project-poplarville-halloween": {
    width: 1600,
    use: "Gallery project and Halloween service hero, Poplarville",
  },
  "project-hattiesburg-two-story": {
    width: 1600,
    use: "Gallery project: Hattiesburg two-story gallery",
  },
  "project-hattiesburg-canopy": {
    width: 1600,
    use: "Gallery project and Christmas installation hero, Hattiesburg",
  },
  "project-gcs-front": {
    width: 1600,
    use: "Gallery hero and Schools vertical: Grace Community School",
  },
  "project-gcs-walkway": {
    width: 1600,
    use: "Gallery photo: Grace Community School covered walkway",
  },
  "project-gcs-mural": {
    width: 1600,
    use: "Gallery photo: Grace Community School mural elevation",
  },
  "project-hattiesburg-low-wide": {
    width: 1600,
    use: "Gallery project: Hattiesburg low wide roof",
  },
  "project-hattiesburg-low-wide-angle": {
    width: 1600,
    use: "Gallery photo: Hattiesburg low wide roof from the drive",
  },
  "project-pearsons-front": {
    width: 1600,
    use: "Gallery project: Pearson's Barber Shop, Poplarville",
  },
  "project-pearsons-block": {
    width: 1600,
    use: "Gallery photo: Pearson's Barber Shop from across the street",
  },
  "project-poplarville-continuous-run": {
    width: 1600,
    use: "Gallery project: Poplarville continuous run",
  },
  "project-hattiesburg-clean-line": {
    width: 1600,
    use: "Gallery project: Hattiesburg clean line",
  },
  "hero-mobile-install": {
    width: 1800,
    use: "Homepage hero on phones, holiday mode",
  },
};

/**
 * Enhancement applied to every owner photograph on the way in.
 *
 * Tuned by eye against the softest file in the set. Heavier sharpening puts
 * halos around the bulbs and heavier saturation blows out their filaments,
 * both of which read as processed rather than sharp.
 *
 * MAX_EDGE is a ceiling on the long edge, not a target to reach for. A photo
 * that arrives smaller than this stays the size it arrived: see the resize
 * call for why.
 *
 * Two sharpening strengths, because sharpening is a fix for one specific
 * thing, the softening that resampling causes, and not a way to make a soft
 * photograph sharp. A downscaled image was genuinely smeared by the resample
 * and takes the stronger pass. An image left at its own resolution was not
 * touched, so it gets a light pass that counters the WebP encode and nothing
 * more. Running the heavy numbers over an untouched phone photo is what
 * produces the crunchy, haloed look of a blurry picture trying to pass for a
 * sharp one.
 */
const MAX_EDGE = 2400;
const SHARPEN_RESAMPLED = { sigma: 1.45, m1: 0.55, m2: 2.6 };
const SHARPEN_NATIVE = { sigma: 0.8, m1: 0.4, m2: 1.4 };

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
  console.log(
    "\nName each file after its slot, e.g. incoming/holiday-hero-estate.jpg",
  );
  process.exit(0);
}

/**
 * Find white padding bars and return the box that excludes them.
 *
 * Photos that arrive by way of a social export or a phone screenshot are
 * often padded out to a fixed aspect ratio with solid white. Inside a card
 * that is already the right shape those bars render as white stripes down the
 * sides of the picture, which looks like a bug and is one.
 *
 * Only near-white padding is trimmed. Trimming dark edges too would be a
 * trap here, because a night sky legitimately averages close to black and we
 * would quietly crop the top off every roofline shot.
 */
async function contentBox(src) {
  const { data, info } = await sharp(src)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const WHITE = 245;

  const mean = (pixels) => {
    let sum = 0;
    for (const i of pixels) sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    return sum / pixels.length;
  };
  const column = (x) => {
    const out = [];
    for (let y = 0; y < height; y += 7) out.push((y * width + x) * channels);
    return out;
  };
  const row = (y) => {
    const out = [];
    for (let x = 0; x < width; x += 7) out.push((y * width + x) * channels);
    return out;
  };

  let left = 0;
  while (left < width - 1 && mean(column(left)) >= WHITE) left++;
  let right = width - 1;
  while (right > left && mean(column(right)) >= WHITE) right--;
  let top = 0;
  while (top < height - 1 && mean(row(top)) >= WHITE) top++;
  let bottom = height - 1;
  while (bottom > top && mean(row(bottom)) >= WHITE) bottom--;

  const box = {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
  };
  if (box.width === width && box.height === height) return null;
  // Refuse to act on anything that looks like a real crop rather than padding.
  if (box.width < width / 2 || box.height < height / 2) return null;
  return box;
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
  const box = await contentBox(src);

  const prepared = () => {
    const pipeline = sharp(src).rotate(); // honor EXIF orientation
    return box ? pipeline.extract(box) : pipeline;
  };

  const target = Math.max(SLOTS[slot].width, MAX_EDGE);

  /*
   * Long edge, not width: a portrait photograph resized to 2400 wide comes
   * out 3500 tall, which is a lot of bytes for a phone hero. Orientation can
   * swap width and height, and cropping happens before the resize, so the
   * comparison is against the longer side of whatever prepared() will hand
   * over.
   */
  const sourceEdge = box
    ? Math.max(box.width, box.height)
    : Math.max(meta.width ?? 0, meta.height ?? 0);
  const willResample = sourceEdge > target;

  await prepared()
    .resize({
      width: target,
      height: target,
      fit: "inside",
      kernel: "lanczos3",
      /*
       * NEVER ENLARGE.
       *
       * This flag was missing, and it is the whole reason the owner photos
       * look soft. A photograph that arrived at 1000px was resampled up to
       * 2400 and then unsharp-masked, which cannot add detail that was never
       * captured: it only enlarges the softness and rings the edges, so the
       * result is a mushy 2400px file that a viewer reads as blurry. Every
       * one of the first twenty-six ingests went through that, and halving
       * any of them loses no detail at all, which is the measurable
       * signature of it.
       *
       * A small file staying small is honest. next/image serves it at the
       * size it really is, a browser downscales it into the layout, and
       * downscaling is the one operation that makes a photo look sharper.
       */
      withoutEnlargement: true,
    })
    .sharpen(willResample ? SHARPEN_RESAMPLED : SHARPEN_NATIVE)
    .modulate({ saturation: 1.1 })
    // Slight contrast lift. Night photographs of lit rooflines come back flat
    // because the camera exposes for the bulbs.
    .linear(1.08, -6)
    .webp({ quality: 88, effort: 6 })
    .toFile(out);

  const blur = await prepared().resize(16).webp({ quality: 28 }).toBuffer();
  const final = await sharp(out).metadata();

  manifest[slot] = {
    width: final.width,
    height: final.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };

  console.log(
    `${slot.padEnd(24)} ${meta.width}x${meta.height} -> ${final.width}x${final.height}  ` +
      `${(fs.statSync(out).size / 1024).toFixed(0)}KB` +
      (box ? `  (trimmed white padding)` : ""),
  );
  done++;
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${done} photo(s) ingested.`);
if (skipped.length) {
  console.log(`Skipped (name does not match a slot): ${skipped.join(", ")}`);
}
console.log(
  "\nNow set isPlaceholder: false for these slots in src/config/images.ts.",
);
