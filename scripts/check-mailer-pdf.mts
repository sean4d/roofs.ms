import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

/**
 * Render the mailed estimate to a real PDF and count its pages.
 *
 * The whole point of moving this off CSS is that the page count is decided in
 * code, so the check is: build it, and assert four pages with nothing overset.
 */

/** A 640x640 test tile, so the crop and the frame are actually visible. */
function testPng(size = 640): Buffer {
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const grid = x % 80 < 3 || y % 80 < 3;
      const edge = x < 6 || y < 6 || x > size - 7 || y > size - 7;
      raw[p++] = edge ? 255 : grid ? 240 : 70 + ((x * 31 + y * 17) % 60);
      raw[p++] = edge ? 0 : grid ? 120 : 90 + ((x * 13 + y * 7) % 50);
      raw[p++] = edge ? 0 : grid ? 40 : 60 + ((x * 7 + y * 29) % 40);
    }
  }
  const chunk = (type: string, body: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(body.length);
    const typed = Buffer.concat([Buffer.from(type, "ascii"), body]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typed) >>> 0);
    return Buffer.concat([len, typed, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

let table: number[] | null = null;
function crc32(buf: Buffer): number {
  if (!table) {
    table = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return crc ^ 0xffffffff;
}

process.env.GOOGLE_MAPS_SERVER_KEY = "test-key";
const tile = testPng();
const realFetch = globalThis.fetch;
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.includes("maps.googleapis.com")) {
    return new Response(new Uint8Array(tile), {
      headers: { "Content-Type": "image/png" },
    });
  }
  return realFetch(input as RequestInfo, init);
}) as typeof fetch;

const { buildMailerPdf } = await import("@/lib/quotes/mailer-pdf");

const variants = {
  full: {
    quoteId: "3f2a91c4-77bd-4e18-9c02-5b6d1e4a8f30",
    publicToken: "tok_9d3f1b7c2e5a48",
    address: "109 Green Timber Lp, Purvis, MS 39475, USA",
    name: "Elizabeth Ford",
    email: "elizabeth@example.com",
    phone: "(601) 555-0142",
    lat: 31.1418,
    lon: -89.4106,
    squares: 95.2,
    pitchDegrees: 37.2,
    planes: 11,
    priceLow: 47200,
    priceHigh: 47200,
    priceShown: 47200,
    monthlyLow: 704,
    monthlyHigh: 704,
    createdAt: "2026-08-31T14:02:00.000Z",
    imageryDate: "2024-03-18",
    material: "architectural",
    stories: 2,
    structures: null,
    repName: "Patrick Pitts",
    emailedAt: null,
    printedAt: null,
    mailStatus: null,
    mailNote: null,
  },
  /* No name, no imagery date, no storms nearby: every optional block off, to
     prove the pages still hold together when the data is thin. */
  bare: {
    quoteId: "aa11bb22-cc33-dd44-ee55-ff6677889900",
    publicToken: null,
    address: "14580 Indian Trails, Biloxi, MS 39532, USA",
    name: null,
    email: null,
    phone: null,
    lat: 30.4515,
    lon: -88.9137,
    squares: 18.11,
    pitchDegrees: null,
    planes: 3,
    priceLow: 9100,
    priceHigh: 9100,
    priceShown: 9100,
    monthlyLow: 136,
    monthlyHigh: 136,
    createdAt: "2026-08-31T14:02:00.000Z",
    imageryDate: null,
    material: "metal-26",
    stories: 1,
    structures: null,
    repName: "Sean Ford",
    emailedAt: null,
    printedAt: null,
    mailStatus: null,
    mailNote: null,
  },
  /*
   * The hardest page four and the emptiest page three at once: a long name, a
   * long address, three structures in two materials so the fact grid wraps,
   * and coordinates far enough away that no storm has ever been recorded near
   * them, which is the case that used to leave page three two thirds white.
   */
  stress: {
    quoteId: "deadbeef-0000-1111-2222-333344445555",
    publicToken: "tok_stress_case_00",
    address:
      "18742 Old Columbia Purvis Road Northwest, Lumberton, MS 39455, USA",
    name: "Christopher Alexander Montgomery-Whitfield",
    email: "c.montgomery.whitfield@example.com",
    phone: "(601) 555-0199",
    lat: 44.9778,
    lon: -113.2354,
    squares: 128.4,
    pitchDegrees: 45,
    planes: 19,
    priceLow: 71500,
    priceHigh: 71500,
    priceShown: 71500,
    monthlyLow: 1066,
    monthlyHigh: 1066,
    createdAt: "2026-08-31T14:02:00.000Z",
    imageryDate: "2023-11-02",
    material: "architectural",
    stories: 2,
    structures: [
      { material: "architectural" },
      { material: "metal-26" },
      { material: "tpo" },
    ],
    repName: "Elizabeth Ford",
    emailedAt: null,
    printedAt: null,
    mailStatus: null,
    mailNote: null,
  },
} as const;

const outDir = process.env.MAILER_PDF_OUT ?? "/tmp";

let failed = 0;
for (const [label, data] of Object.entries(variants)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { bytes, pages } = await buildMailerPdf(data as any);
  const out = `${outDir}/mailer-${label}.pdf`;
  writeFileSync(out, bytes);

  const problems: string[] = [];
  if (pages.length !== 4) problems.push(`${pages.length} pages, expected 4`);
  pages.forEach((page, i) => {
    // A springy page solves to slack zero, so allow a point of float error.
    if (page.slack < -1)
      problems.push(`page ${i + 1} overset by ${(-page.slack).toFixed(0)}pt`);
    // Half an empty sheet is a layout failure too, and the whole reason the
    // pages spring. Page one is exempt: the photograph absorbs its slack.
    if (i > 0 && page.slack > 90)
      problems.push(
        `page ${i + 1} is ${page.slack.toFixed(0)}pt short of full`,
      );
  });
  if (problems.length) failed++;

  console.log(
    `${problems.length ? "FAIL" : "PASS"}  ${label}: ${pages.length} pages, ` +
      `${(bytes.length / 1024).toFixed(0)}KB, slack ` +
      pages.map((p) => `${p.slack.toFixed(0)}pt`).join("/") +
      `  -> ${out}`,
  );
  for (const problem of problems) console.log(`      ${problem}`);
}
process.exit(failed ? 1 : 0);
