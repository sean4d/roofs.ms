/**
 * Upload constraints. One place, shared by the client UI and the server route
 * so the two can never disagree about what is allowed.
 */

export const UPLOAD = {
  /** Per file. Phone photos are routinely 5-8MB. */
  maxBytes: 15 * 1024 * 1024,
  maxFiles: 10,
  /** HEIC included: iPhones shoot it by default and customers will send it. */
  accept: [
    "image/jpeg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
    "application/pdf",
  ],
  acceptAttr: ".jpg,.jpeg,.png,.heic,.heif,.webp,.pdf",
} as const;

export function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function fileError(file: File): string | null {
  if (file.size > UPLOAD.maxBytes) {
    return `${file.name} is ${humanSize(file.size)}. The limit is ${humanSize(UPLOAD.maxBytes)}.`;
  }
  const ok =
    (UPLOAD.accept as readonly string[]).includes(file.type) ||
    /\.(jpe?g|png|heic|heif|webp|pdf)$/i.test(file.name);
  if (!ok) return `${file.name} is not a supported file type.`;
  return null;
}
