/**
 * Slideshow video builder for TikTok. TikTok's posting API is video-first and
 * rejects photo posts outright, so we turn a job's photos into a vertical
 * 1080×1920 MP4 (H.264 + silent AAC track — TikTok wants both) that meets its
 * spec. Each photo is centered on a blurred fill of itself so mixed
 * orientations look intentional, not letterboxed.
 *
 * sharp normalizes every frame; a static ffmpeg (bundled via
 * @ffmpeg-installer/ffmpeg, whose binary ships from npm so it installs on
 * Vercel) encodes. Runs in the Node runtime with a writable /tmp. Returns null
 * on any failure so the caller falls back gracefully — a video hiccup never
 * blocks the rest of a post.
 */

import { spawn } from "node:child_process";
import { mkdtemp, writeFile, readFile, rm, chmod } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const W = 1080;
const H = 1920;
/** Brand navy, used only if the blurred fill can't be built. */
const BG = { r: 18, g: 59, b: 99 };

/** One 1080×1920 frame: the photo centered over a blurred cover of itself. */
async function makeFrame(src: Buffer): Promise<Buffer> {
  const bg = await sharp(src)
    .resize(W, H, { fit: "cover" })
    .blur(25)
    .modulate({ brightness: 0.75 })
    .toBuffer();
  const fg = await sharp(src).resize(W, H, { fit: "inside" }).toBuffer();
  return sharp(bg)
    .composite([{ input: fg, gravity: "center" }])
    .flatten({ background: BG })
    .jpeg({ quality: 88 })
    .toBuffer();
}

function runFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpegInstaller.path, args);
    let err = "";
    p.stderr.on("data", (d) => {
      err += d.toString();
    });
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}: ${err.slice(-600)}`)),
    );
  });
}

/**
 * Build a TikTok-ready MP4 from image URLs. Returns the MP4 bytes, or null if
 * nothing could be produced.
 */
export async function buildSlideshow(imageUrls: string[]): Promise<Buffer | null> {
  if (imageUrls.length === 0) return null;
  const dir = await mkdtemp(join(tmpdir(), "slideshow-"));
  try {
    let count = 0;
    for (const url of imageUrls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const frame = await makeFrame(Buffer.from(await res.arrayBuffer()));
        await writeFile(join(dir, `f${String(count).padStart(3, "0")}.jpg`), frame);
        count++;
      } catch {
        // skip a bad photo; keep building from the rest
      }
    }
    if (count === 0) return null;

    // ≥6s total so TikTok always accepts it; ~3s per photo once there are a few.
    const perImage = count >= 2 ? 3 : 6;
    const out = join(dir, "out.mp4");

    try {
      await chmod(ffmpegInstaller.path, 0o755);
    } catch {
      // best-effort; the traced binary is usually already executable
    }

    await runFfmpeg([
      "-y",
      "-framerate",
      `1/${perImage}`,
      "-start_number",
      "0",
      "-i",
      join(dir, "f%03d.jpg"),
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=44100:cl=stereo",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-shortest",
      "-movflags",
      "+faststart",
      out,
    ]);

    return await readFile(out);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
