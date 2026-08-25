/**
 * Client-side photo preparation.
 *
 * Two hard constraints make this necessary rather than a nicety:
 *
 * 1. A Vercel function request body is capped at 4.5 MB. A phone photo is
 *    routinely 5-8 MB, so an untouched upload is rejected by the platform
 *    before our route ever runs, and the browser gets an HTML error page
 *    instead of our JSON.
 * 2. iPhones shoot HEIC by default. Safari can decode it, so re-encoding in
 *    the browser turns a file most tooling cannot open into a plain JPEG on
 *    the way out.
 *
 * Anything already small enough is passed through untouched: re-encoding a
 * file that does not need it only costs quality.
 */

/** Long edge we keep. The widest slot on the site renders around 2400px. */
const MAX_EDGE = 2600;
/** Comfortably under the 4.5 MB platform cap, leaving room for form overhead. */
const TARGET_BYTES = 3.5 * 1024 * 1024;
const QUALITY_STEPS = [0.9, 0.82, 0.72, 0.62];

export interface Prepared {
  file: File;
  /** Set when the file was changed or when it could not be, for the UI. */
  note?: string;
}

async function decode(file: File): Promise<ImageBitmap | null> {
  try {
    // from-image applies EXIF rotation, so portrait phone shots do not arrive
    // sideways.
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return null;
  }
}

function toBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
}

export async function prepareForUpload(file: File): Promise<Prepared> {
  const small = file.size <= TARGET_BYTES;

  const bitmap = await decode(file);
  if (!bitmap) {
    // Chrome and Firefox cannot decode HEIC. Nothing to do but send it as is
    // and let the server or the platform say no.
    return small
      ? { file }
      : {
          file,
          note: "This file is large and the browser cannot resize it. If the upload fails, send a JPG instead.",
        };
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  if (small && scale === 1 && file.type === "image/jpeg") {
    bitmap.close();
    return { file };
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return { file };
  }
  // A JPEG has no alpha, so anything transparent would render black. White is
  // the safer ground for a PNG logo or screenshot that lands here by mistake.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let out: Blob | null = null;
  for (const quality of QUALITY_STEPS) {
    out = await toBlob(canvas, quality);
    if (out && out.size <= TARGET_BYTES) break;
  }
  if (!out) return { file };

  // Re-encoding can lose to the original on an already-optimized file.
  if (out.size >= file.size && scale === 1) return { file };

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return {
    file: new File([out], name, { type: "image/jpeg" }),
    note: `Resized to ${canvas.width}x${canvas.height} for upload.`,
  };
}
