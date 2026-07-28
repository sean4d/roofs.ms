import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";

/**
 * At-rest encryption for production-tracker payloads.
 *
 * The Sanity dataset this site stores content in is PUBLICLY readable (that's
 * correct for the marketing gallery), so customer names, phones, and job notes
 * must never land there in plaintext. Every project payload is sealed with
 * AES-256-GCM before it is written; anyone reading the raw dataset sees only
 * ciphertext.
 *
 * Key material comes from `PRODUCTION_DATA_KEY` when set, otherwise from the
 * server-only `SANITY_WRITE_TOKEN` (guaranteed present wherever writes work).
 * NOTE: rotating the write token without first setting PRODUCTION_DATA_KEY to
 * the value derived from the old token makes existing tracker data
 * unreadable — set PRODUCTION_DATA_KEY once in production and leave it alone.
 */

function dataKey(): Buffer {
  const secret =
    process.env.PRODUCTION_DATA_KEY || process.env.SANITY_WRITE_TOKEN;
  if (!secret) {
    throw new Error(
      "Production tracker storage needs PRODUCTION_DATA_KEY (or " +
        "SANITY_WRITE_TOKEN) set in the hosting environment variables.",
    );
  }
  return createHash("sha256")
    .update(`ser-production-data-v1:${secret}`)
    .digest();
}

export function encryptJson(value: unknown): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", dataKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [
    "v1",
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

export function decryptJson<T>(payload: string): T {
  const [version, iv, tag, ciphertext] = payload.split(".");
  if (version !== "v1" || !iv || !tag || !ciphertext) {
    throw new Error("Unrecognized payload format");
  }
  const decipher = createDecipheriv(
    "aes-256-gcm",
    dataKey(),
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const plain = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
  return JSON.parse(plain) as T;
}
