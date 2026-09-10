/**
 * Browser-only helper: downscale a user-selected photo to a small JPEG and
 * return its base64 payload (no data: prefix) for the analysis APIs. Keeping
 * images ~1024px / q0.72 keeps request bodies small and Claude vision cost to
 * fractions of a cent, while staying more than sharp enough for a preliminary
 * read. Any file that fails to decode is skipped, never fatal.
 */

const MAX_EDGE = 1024;
const QUALITY = 0.72;

/** One resized, base64-encoded JPEG (no "data:...;base64," prefix). */
export interface EncodedImage {
  data: string;
}

async function encodeOne(file: File): Promise<EncodedImage | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
    const comma = dataUrl.indexOf(",");
    if (comma === -1) return null;
    return { data: dataUrl.slice(comma + 1) };
  } catch {
    return null;
  }
}

/**
 * Encode up to `limit` images. Best-effort: returns whatever encoded cleanly,
 * so a bad file never blocks the analysis.
 */
export async function encodeImages(
  files: File[],
  limit = 4,
): Promise<EncodedImage[]> {
  const picked = files.slice(0, limit);
  const out = await Promise.all(picked.map(encodeOne));
  return out.filter((x): x is EncodedImage => x !== null);
}
