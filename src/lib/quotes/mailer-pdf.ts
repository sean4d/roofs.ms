import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import QRCode from "qrcode";
import {
  PDFDocument,
  StandardFonts,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";

import { siteConfig } from "@/config/site";
import {
  FINANCING,
  MATERIALS,
  materialForCustomer,
  paymentFor,
  type MaterialKey,
} from "@/config/quote-rates";
import { fetchAerial } from "@/lib/quotes/aerial";
import { nearbyProjects } from "@/lib/quotes/nearby";
import { getProfile } from "@/lib/quotes/profile";
import type { ProposalData } from "@/lib/quotes/save";
import { longDate, summarizeStorms } from "@/lib/quotes/storms";

import { COLORS, LETTER, Sheet, px, type TextStyle } from "./pdf-layout";

/**
 * The mailed estimate, as a real PDF.
 *
 * FOUR PAGES, AND NOW ACTUALLY FOUR. This is the same document as
 * pin/proposal/mailer-doc.tsx, set in points instead of CSS pixels, and it
 * exists because the HTML version could not hold its page count. Two sheets
 * printed double sided and folded once into a 6x9 envelope is a fixed budget,
 * and the browser's answer to "how tall is a page" is not fixed: about 980 CSS
 * pixels in desktop Chrome, about 700 on iOS Safari, which stamps a header and
 * a footer on every web page it prints and will not be talked out of it. The
 * same file measured four sheets in the office and five on the owner's phone,
 * repeatedly, whichever of the two budgets it was tuned to. There is no CSS
 * that satisfies both, because the two page boxes are different sizes.
 *
 * A PDF page is a page. A print dialog scales it to the paper and does not
 * re-flow it, so what is laid out here is what comes out of the printer, on
 * any device. It also drops the URL and timestamp iOS prints in the margin of
 * a web page, which had no business being on a document that goes to a
 * customer.
 *
 * THE HTML VERSION STAYS as the on-screen preview: the office checks the piece
 * before committing paper to it, and the admin edit link lives there. It is no
 * longer what gets printed.
 *
 * INK IS A REAL COST. Hundreds of these go through an office printer, so the
 * price sits on white paper between two navy rules rather than inside a navy
 * block. The single darkest element is the response band on page four, which
 * is the one place a reader has to look.
 */

const MARGIN = { top: 42, bottom: 40, side: 48 };
const CONTENT = {
  left: MARGIN.side,
  top: MARGIN.top,
  width: LETTER.width - MARGIN.side * 2,
  height: LETTER.height - MARGIN.top - MARGIN.bottom,
};

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

type Profile = Awaited<ReturnType<typeof getProfile>>;

/** What each sheet actually used, so a check can prove nothing overflowed. */
export interface PageFit {
  used: number;
  height: number;
  /** Points of the content box left unused. Negative means overset. */
  slack: number;
}

export interface MailerPdfResult {
  bytes: Uint8Array;
  filename: string;
  pages: PageFit[];
  /** Whether the response code actually made it onto page four. It is the one
   *  thing on the piece a reader is asked to act on, and it went missing once
   *  already, so a caller can assert on it rather than hope. */
  qr: boolean;
}

/* -------------------------------------------------------------- brand mark */

/**
 * The brand mark, as vector path data.
 *
 * public/icon.svg is one path inside a translate/scale group, with a
 * prefers-color-scheme rule that turns it white on a dark background. That
 * rule is right for a browser tab and catastrophic on paper, so nothing here
 * reads it: the colour is pinned to navy at the point of drawing.
 *
 * Read once per process, and null rather than throwing if the file moves. A
 * mailer with a wordmark and no symbol is a small loss; a mailer that failed
 * to build is a total one.
 */
let cachedMark:
  | { d: string; tx: number; ty: number; scale: number; stroke: number }
  | null
  | undefined;

function brandMark() {
  if (cachedMark !== undefined) return cachedMark;
  try {
    const raw = readFileSync(join(process.cwd(), "public", "icon.svg"), "utf8");
    const d = raw.match(/\sd="([^"]+)"/)?.[1];
    if (!d) throw new Error("no path");
    const transform = raw.match(/transform="([^"]+)"/)?.[1] ?? "";
    const translate = transform.match(
      /translate\(\s*([-\d.]+)[\s,]+([-\d.]+)\s*\)/,
    );
    const scale = transform.match(/scale\(\s*([-\d.]+)/);
    const stroke = raw.match(/stroke-width="([\d.]+)"/)?.[1];
    cachedMark = {
      d,
      tx: translate ? Number(translate[1]) : 0,
      ty: translate ? Number(translate[2]) : 0,
      scale: scale ? Number(scale[1]) : 1,
      stroke: stroke ? Number(stroke) : 0,
    };
  } catch {
    cachedMark = null;
  }
  return cachedMark;
}

/** The mark at `size` points square, its top-left corner at (x, topY). */
function drawMark(page: PDFPage, x: number, topY: number, size: number) {
  const mark = brandMark();
  if (!mark) return false;
  // The SVG is a 100 unit viewBox, so one viewBox unit is size/100 points.
  const unit = size / 100;
  page.drawSvgPath(mark.d, {
    x: x + mark.tx * unit,
    y: topY - mark.ty * unit,
    scale: mark.scale * unit,
    color: COLORS.navy,
    borderColor: COLORS.navy,
    borderWidth: mark.stroke,
  });
  return true;
}

/**
 * The uploaded logo, when there is one and it is a raster.
 *
 * The settings page accepts whatever a phone camera roll hands it, so this has
 * to survive an SVG, a truncated data URI and a format pdf-lib cannot embed.
 * Any of those falls back to the built-in mark, which always works.
 */
async function embedLogo(pdf: PDFDocument, dataUri: string | null) {
  if (!dataUri) return null;
  const match = dataUri.match(/^data:(image\/[a-z+]+);base64,(.+)$/i);
  if (!match) return null;
  const [, mime, base64] = match;
  try {
    const bytes = Buffer.from(base64, "base64");
    if (/png/i.test(mime)) return await pdf.embedPng(bytes);
    if (/jpe?g/i.test(mime)) return await pdf.embedJpg(bytes);
    return null;
  } catch {
    return null;
  }
}

/**
 * The QR, as ONE EMBEDDED IMAGE rather than a thousand vector squares.
 *
 * The first version drew every module as its own filled rectangle, on the
 * reasoning that vectors stay sharp at any size and survive a photocopier.
 * That reasoning is fine and the result was not: a code at error correction H
 * is 41 modules square for a short link and 49 for a long one, so the page
 * carried between eight hundred and twelve hundred separate rectangles, each
 * about a point and a half across. It rendered on a desktop and came out
 * BLANK ON A PHONE, which is the one place it matters, because the whole
 * point of the code is that somebody holding the paper scans it.
 *
 * An image is a single object and every renderer treats it the same. Sharpness
 * is bought with resolution instead: 16 pixels per module is roughly 350 dpi at
 * the size it prints, which is finer than any office laser will lay down, and
 * the PNG is about six kilobytes.
 *
 * Error correction stays at the highest level. These get posted, folded, and
 * scanned off a kitchen counter, and a scuffed code that still reads is the
 * entire point.
 */
async function embedQr(
  pdf: PDFDocument,
  url: string,
): Promise<PDFImage | null> {
  try {
    const png = await QRCode.toBuffer(url, {
      type: "png",
      errorCorrectionLevel: "H",
      // No quiet zone from the encoder: the white card it sits on is wider
      // than the four modules the spec asks for.
      margin: 0,
      scale: 16,
      color: { dark: "#123b63ff", light: "#ffffffff" },
    });
    return await pdf.embedPng(png);
  } catch {
    return null;
  }
}

/** A tick, drawn rather than typed: the character is not in WinAnsi. */
function drawCheck(page: PDFPage, x: number, topY: number, size: number) {
  page.drawSvgPath("M 0 5.4 L 3.6 9 L 10 0.6", {
    x,
    y: topY - size * 0.1,
    scale: size / 11,
    borderColor: COLORS.navy,
    borderWidth: 1.9,
  });
}

/* ---------------------------------------------------------------- assembly */

const clamp = (n: number, low: number, high: number) =>
  Math.min(Math.max(n, low), high);

/**
 * Lay a page out twice: once to see how tall it comes out, then again with
 * every springy gap stretched so the content reaches the foot of the sheet.
 *
 * The second pass is what stops an estimate with no storm history from
 * printing a page that is two thirds white, and what stops a long address or a
 * wrapped material name from crowding one. Only `gap` moves; rigid spacing,
 * type sizes and rules stay exactly as designed.
 */
async function fitted(
  pdf: PDFDocument,
  render: (sheet: Sheet) => void | Promise<void>,
  options: { spring?: boolean } = {},
): Promise<PageFit> {
  const make = () =>
    new Sheet(pdf.addPage([LETTER.width, LETTER.height]), CONTENT);

  const trial = make();
  await render(trial);
  const target = trial.limit ?? trial.height;
  const reached = trial.measured ?? trial.y;

  let sheet = trial;
  if (options.spring !== false && trial.gapTotal > 0) {
    const rigid = reached - trial.gapTotal;
    const scale = clamp((target - rigid) / trial.gapTotal, 0.7, 2.2);
    // Only redraw when it would actually move something.
    if (Math.abs(scale - 1) > 0.01) {
      pdf.removePage(pdf.getPageCount() - 1);
      sheet = make();
      sheet.gapScale = scale;
      await render(sheet);
    }
  }

  const used = sheet.measured ?? sheet.y;
  return { used, height: sheet.height, slack: sheet.height - sheet.y };
}

export async function buildMailerPdf(
  data: ProposalData,
): Promise<MailerPdfResult> {
  const profile = await getProfile();
  const pdf = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };

  pdf.setTitle(`Roof replacement estimate, ${data.address}`);
  pdf.setAuthor(profile.legalName);
  pdf.setSubject(`Estimate #${shortId(data)}`);
  pdf.setProducer(profile.website);
  pdf.setCreator(profile.website);

  const estimateUrl = data.publicToken
    ? `${siteConfig.url}/estimate/${data.publicToken}?m=1`
    : `${siteConfig.url}/free-inspection`;

  /* Fetched before any drawing, because a slow tile must not leave a half
     written document. A failure here loses the photograph and nothing else. */
  const tile = await fetchAerial(data.lat, data.lon, {
    size: 640,
    format: "jpg",
  });
  let aerial: PDFImage | null = null;
  if (tile) {
    try {
      aerial =
        tile.contentType === "image/png"
          ? await pdf.embedPng(tile.bytes)
          : await pdf.embedJpg(tile.bytes);
    } catch {
      // An unreadable tile is not worth losing the document over.
      aerial = null;
    }
  }
  const logo = await embedLogo(pdf, profile.logoDataUri);
  // Built once, up here, because every page is laid out twice and there is no
  // sense encoding the same code again for a trial run that gets thrown away.
  const qr = await embedQr(pdf, estimateUrl);

  const pages: PageFit[] = [];
  // Page one does not spring: the aerial photograph absorbs whatever room is
  // left, which is a better use of it than air between the paragraphs.
  pages.push(
    await fitted(
      pdf,
      (sheet) => pageOne(sheet, data, profile, fonts, logo, aerial),
      { spring: false },
    ),
  );
  pages.push(
    await fitted(pdf, (sheet) => pageTwo(sheet, data, profile, fonts)),
  );
  pages.push(
    await fitted(pdf, (sheet) => pageThree(sheet, data, profile, fonts)),
  );
  pages.push(
    await fitted(pdf, (sheet) => pageFour(sheet, data, profile, fonts, qr)),
  );

  return {
    bytes: await pdf.save(),
    filename: `estimate-${shortId(data)}.pdf`,
    pages,
    qr: qr !== null,
  };
}

/* ------------------------------------------------------------------ shared */

const shortId = (data: ProposalData) => data.quoteId.slice(0, 8).toUpperCase();

const money = (n: number) => `$${n.toLocaleString()}`;

function pitchOver12(data: ProposalData): number | null {
  if (data.pitchDegrees === null) return null;
  return (
    Math.round(Math.tan((data.pitchDegrees * Math.PI) / 180) * 12 * 10) / 10
  );
}

/**
 * How the material reads to a customer, manufacturer and line included where
 * the price assumes one. The same helper the rep's copy uses, so the two
 * documents cannot disagree about what we said we were installing.
 */
function materialLabelFor(data: ProposalData): string {
  if (data.structures?.length) {
    return [
      ...new Set(data.structures.map((p) => materialForCustomer(p.material))),
    ].join(", ");
  }
  return materialForCustomer(
    data.material && data.material in MATERIALS
      ? (data.material as MaterialKey)
      : "architectural",
  );
}

function styles(fonts: Fonts) {
  return {
    eyebrow: {
      font: fonts.bold,
      size: px(10),
      color: COLORS.slate500,
      tracking: 1.1,
      lineHeight: 1.3,
    } satisfies TextStyle,
    sectionHead: {
      font: fonts.bold,
      size: px(11.5),
      color: COLORS.slate600,
      tracking: 1.1,
      lineHeight: 1.3,
    } satisfies TextStyle,
    body: {
      font: fonts.regular,
      size: px(13.5),
      color: COLORS.slate800,
      lineHeight: 1.45,
    } satisfies TextStyle,
    list: {
      font: fonts.regular,
      size: px(13),
      color: COLORS.slate800,
      lineHeight: 1.4,
    } satisfies TextStyle,
    muted: {
      font: fonts.regular,
      size: px(11.5),
      color: COLORS.slate500,
      lineHeight: 1.45,
    } satisfies TextStyle,
    fine: {
      font: fonts.regular,
      size: px(9),
      color: COLORS.slate500,
      lineHeight: 1.5,
    } satisfies TextStyle,
  };
}

/** The heading that opens pages two, three and four. */
function sheetHead(
  sheet: Sheet,
  fonts: Fonts,
  title: string,
  note?: string,
): void {
  sheet.text(title, {
    font: fonts.bold,
    size: px(22),
    color: COLORS.navy,
    lineHeight: 1.2,
  });
  if (note) {
    sheet.down(px(6));
    sheet.text(note, {
      font: fonts.regular,
      size: px(12),
      color: COLORS.slate600,
      lineHeight: 1.4,
    });
  }
  sheet.down(px(10)).rule(COLORS.navy, 1.6);
}

/** An underlined small-caps section heading. */
function sectionHead(sheet: Sheet, fonts: Fonts, text: string): void {
  sheet.text(text, styles(fonts).sectionHead);
  sheet.down(px(8)).rule(COLORS.slate300, 0.75);
}

/* ------------------------------------------------------------------- pages */

/** PAGE 1: who it is from, whose roof it is, what it costs. */
function pageOne(
  sheet: Sheet,
  data: ProposalData,
  profile: Profile,
  fonts: Fonts,
  logo: PDFImage | null,
  aerial: PDFImage | null,
): void {
  const s = styles(fonts);
  const page = sheet.page;
  const price = data.priceShown ?? data.priceLow;
  const pitch = pitchOver12(data);
  const material = materialLabelFor(data);
  const structures = data.structures?.length ?? 1;

  /* Masthead. */
  const markSize = 36;
  const contactColumn = 132;
  let textLeft = sheet.left;
  if (logo) {
    const height = markSize;
    const width = Math.min((logo.width / logo.height) * height, 150);
    page.drawImage(logo, {
      x: sheet.left,
      y: sheet.topAt(0) - height,
      width,
      height,
    });
    textLeft = sheet.left + width + 13;
  } else if (drawMark(page, sheet.left, sheet.topAt(0), markSize)) {
    textLeft = sheet.left + markSize + 13;
  }

  const nameWidth = sheet.width - (textLeft - sheet.left) - contactColumn;
  sheet.down(3);
  sheet.text(
    profile.legalName,
    { font: fonts.bold, size: px(20), color: COLORS.navy, lineHeight: 1.15 },
    { x: textLeft, width: nameWidth },
  );
  sheet.down(3);
  sheet.text(
    `${profile.city}, ${profile.state}  ·  MSBOC #${profile.license}`,
    s.eyebrow,
    { x: textLeft, width: nameWidth },
  );

  // Contact details, right aligned against the same masthead line.
  const afterName = sheet.y;
  sheet.y = 4;
  sheet.text(
    profile.phone,
    { font: fonts.bold, size: px(11), color: COLORS.navy, lineHeight: 1.5 },
    { align: "right" },
  );
  sheet.text(
    profile.website,
    {
      font: fonts.regular,
      size: px(11),
      color: COLORS.slate600,
      lineHeight: 1.5,
    },
    { align: "right" },
  );
  sheet.y = Math.max(afterName, sheet.y, markSize);

  sheet.down(px(15)).rule(COLORS.navy, 1.6);

  /* The document's own title. */
  sheet.down(px(26));
  sheet.text("Roof Replacement Estimate", {
    font: fonts.bold,
    size: px(28),
    color: COLORS.navy,
    lineHeight: 1.1,
  });

  /*
   * The property is the personalisation when there is no name. Printing
   * "Homeowner" in the space a name goes reads as a mail merge that failed and
   * throws away the one thing this piece has: that we picked out their roof.
   */
  sheet.down(px(22));
  sheet.text(
    data.name ? "Prepared for" : "Prepared for the property at",
    s.eyebrow,
  );
  sheet.down(px(6));
  if (data.name) {
    sheet.text(data.name, {
      font: fonts.bold,
      size: px(17),
      color: COLORS.ink,
      lineHeight: 1.25,
    });
    sheet.down(px(3));
  }
  sheet.text(data.address, {
    font: fonts.bold,
    size: px(21),
    color: COLORS.ink,
    lineHeight: 1.25,
  });
  sheet.down(px(5));
  sheet.text(
    `Estimate #${shortId(data)}  ·  ${longDate(data.createdAt.slice(0, 10))}`,
    { font: fonts.regular, size: px(10.5), color: COLORS.slate500 },
  );

  /* The price: white paper between two navy rules. Same prominence as a navy
     block, a fraction of the ink, and hundreds of these get printed. */
  sheet.down(px(24)).rule(COLORS.navy, 2.25).down(px(20));
  sheet.text("Estimated roof replacement", {
    font: fonts.bold,
    size: px(11),
    color: COLORS.slate500,
    tracking: 1.2,
    lineHeight: 1.3,
  });
  sheet.down(px(5));
  sheet.text(money(price), {
    font: fonts.bold,
    size: px(58),
    color: COLORS.navy,
    lineHeight: 1.05,
  });
  sheet.down(px(11));
  sheet.text(
    `Approximately ${data.squares} roofing squares` +
      (data.stories ? `, ${data.stories} story` : "") +
      (pitch ? `, ${pitch}:12 pitch` : "") +
      `, ${material}` +
      (structures > 1 ? `, ${structures} structures` : "") +
      ".",
    { font: fonts.regular, size: px(13.5), color: COLORS.slate700 },
  );
  sheet.down(px(19)).rule(COLORS.navy, 2.25);

  /*
   * THE QUALIFIER GOES NEXT TO THE PRICE, NOT ON PAGE TWO.
   *
   * Page two explains at length what the estimate is based on, and page two is
   * not where a homeowner is standing when they read the number. They see a
   * figure, they form an opinion, and everything after that is read against
   * the opinion they already have. If the first thing they learn about how we
   * got it is on the other side of the sheet, we have let them believe it is
   * firmer than it is, and then corrected them.
   *
   * Both directions, deliberately. "It may be a bit more, it may be a bit
   * less" is the owner's own wording and it is the honest shape: a caveat that
   * only ever warns of increases reads as a sales tactic, because it is one.
   */
  const caveatLead = "This number came from aerial measurements, not a visit.";
  const caveatBody =
    "It can land a little over or a little under once somebody gets on the roof and measures it properly. You will see the final figure in writing, and nothing is agreed until you do.";
  const inset = 14;
  const caveatWidth = sheet.width - inset - 16;
  const leadStyle: TextStyle = {
    font: fonts.bold,
    size: px(12),
    color: COLORS.navy,
    lineHeight: 1.4,
  };
  const bodyStyle: TextStyle = {
    font: fonts.regular,
    size: px(12),
    color: COLORS.slate700,
    lineHeight: 1.4,
  };
  const caveatHeight =
    sheet.measure(caveatLead, leadStyle, caveatWidth) +
    sheet.measure(caveatBody, bodyStyle, caveatWidth) +
    px(21);
  sheet.down(px(14));
  // The same light tint and navy bar as the survey note on page two, so a
  // reader learns the treatment once. Barely any ink at #f8fafc, which matters
  // when hundreds of these go through an office printer.
  sheet.box(caveatHeight, COLORS.slate50);
  sheet.box(caveatHeight, COLORS.navy, { width: 2.5 });
  sheet.down(px(10));
  sheet.text(caveatLead, leadStyle, {
    x: sheet.left + inset,
    width: caveatWidth,
  });
  sheet.down(px(2));
  sheet.text(caveatBody, bodyStyle, {
    x: sheet.left + inset,
    width: caveatWidth,
  });
  sheet.down(px(10));

  /* Financing. The APR is printed beside the payments, not hidden: under
     Regulation Z, stating a payment amount is a triggering term and the rate
     has to appear with it. Showing payments without it is the exposed
     position, not the safe one. */
  if (profile.showFinancing) {
    sheet.down(px(19));
    sheet.text(profile.financingLine, s.eyebrow);
    sheet.down(px(8));

    // Laid out in columns rather than as a sentence, because the figure and
    // its term have to stay together when the line is read at arm's length.
    const columnWidth = sheet.width / FINANCING.termsMonths.length;
    const top = sheet.y;
    FINANCING.termsMonths.forEach((months, i) => {
      const x = sheet.left + i * columnWidth;
      sheet.y = top;
      sheet.text(
        money(paymentFor(price, months)),
        {
          font: fonts.bold,
          size: px(21),
          color: COLORS.navy,
          lineHeight: 1.15,
        },
        { x, width: columnWidth },
      );
      sheet.text(
        `per month, ${months / 12} years`,
        { font: fonts.regular, size: px(11.5), color: COLORS.slate600 },
        { x, width: columnWidth },
      );
    });
    sheet.down(px(7));
    sheet.text(
      `Example payments on ${money(price)} at ${(FINANCING.apr * 100).toFixed(2)}% APR through ${FINANCING.partner}, subject to credit approval. Your rate and term may differ.`,
      { font: fonts.regular, size: px(9), color: COLORS.slate500 },
    );
  }

  /*
   * The recognition moment. A homeowner seeing their own roof from the air is
   * the difference between this and a flyer.
   *
   * THE FRAME GOVERNS THE HEIGHT and the tile is cropped to fill it. The tile
   * is square and this space is not, and an uncropped square photograph is
   * exactly what used to land on top of the price when a browser was deciding
   * where the page ended. It also takes whatever room page one has left, which
   * is a better use of it than air between the paragraphs.
   */
  if (aerial) {
    const caption = px(24);
    const frame = clamp(sheet.remaining - caption - px(20), 130, 320);
    sheet.cover(aerial, frame, px(20));
    sheet.down(px(7));
    sheet.text("The roof measured for this estimate.", {
      font: fonts.regular,
      size: px(10.5),
      color: COLORS.slate500,
    });
  }
}

/** PAGE 2: what the number is based on, and what could move it. */
function pageTwo(
  sheet: Sheet,
  data: ProposalData,
  profile: Profile,
  fonts: Fonts,
): void {
  const s = styles(fonts);
  const pitch = pitchOver12(data);
  const material = materialLabelFor(data);
  const structures = data.structures?.length ?? 1;

  sheetHead(
    sheet,
    fonts,
    "What this estimate is based on",
    "We measured this property from aerial survey data. No appointment was needed.",
  );

  const facts: Array<[string, string]> = [
    ["Roof area", `${data.squares} squares`],
    ["Stories", data.stories ? `${data.stories}` : "Not recorded"],
    ["Pitch", pitch ? `${pitch}:12` : "Verified on site"],
    ["Material priced", material],
    ["Structures measured", `${structures}`],
    [
      "Survey data recorded",
      data.imageryDate
        ? longDate(data.imageryDate.slice(0, 10))
        : "Not recorded",
    ],
  ];

  sheet.gap(px(22));
  const gutter = 30;
  const column = (sheet.width - gutter) / 2;
  const valueStyle: TextStyle = {
    font: fonts.bold,
    size: px(18),
    color: COLORS.navy,
    lineHeight: 1.2,
  };
  for (let row = 0; row * 2 < facts.length; row++) {
    const top = sheet.y;
    let deepest = top;
    for (let col = 0; col < 2; col++) {
      const fact = facts[row * 2 + col];
      if (!fact) continue;
      sheet.y = top;
      const x = sheet.left + col * (column + gutter);
      sheet.text(fact[0], s.eyebrow, { x, width: column });
      sheet.down(px(4));
      sheet.text(fact[1], valueStyle, { x, width: column });
      deepest = Math.max(deepest, sheet.y);
    }
    sheet.y = deepest;
    sheet.gap(px(17));
  }

  /*
   * HONESTY ABOUT THE DATA'S AGE. A homeowner who added a room knows perfectly
   * well the figure will be short, and a document that pretends otherwise
   * loses them. The date is the SURVEY's, not the photograph's: those come
   * from two different Google datasets, and saying the picture was taken then
   * is a claim they can disprove by looking at their own house.
   */
  if (data.imageryDate) {
    const note =
      "This is the most recent survey data available for this address through our mapping provider. If the house has been extended or altered since, the area above will be short, and we correct that in person before any contract.";
    const inset = 14;
    const style: TextStyle = {
      font: fonts.regular,
      size: px(12),
      color: COLORS.slate700,
      lineHeight: 1.45,
    };
    const height =
      sheet.measure(note, style, sheet.width - inset - 16) + px(22);
    sheet.box(height, COLORS.slate50);
    sheet.box(height, COLORS.navy, { width: 2.5 });
    sheet.down(px(11));
    sheet.text(note, style, {
      x: sheet.left + inset,
      width: sheet.width - inset - 16,
    });
    sheet.down(px(11));
  }

  sheet.gap(px(28));
  sectionHead(sheet, fonts, "WHAT IS INCLUDED AT THIS PRICE");
  sheet.gap(px(14));
  sheet.bulletColumns(
    [
      "Tear off the existing roof and haul it away",
      `${material}, installed to manufacturer spec`,
      "Synthetic underlayment and starter strip",
      "Ridge cap and drip edge",
      "New pipe boots and standard flashing",
      "Ventilation where the existing roof has it",
      "Permits and final inspection",
      "Cleanup and a magnetic nail sweep",
    ],
    s.list,
    {
      indent: 16,
      rowGap: px(11),
      marker: (x, top) => drawCheck(sheet.page, x, sheet.topAt(top), 9.5),
    },
  );

  sheet.gap(px(24));
  sectionHead(sheet, fonts, "WHAT CAN CHANGE THE FINAL PRICE");
  sheet.gap(px(14));
  sheet.bulletColumns(
    [
      "A second layer of shingles underneath",
      "Decking that has rotted and has to be replaced",
      "Structural damage that is not visible from the air",
      "Additions built since the survey data was recorded",
      "Chimneys, skylights or unusual flashing",
      "Upgrades you choose, such as a heavier shingle",
    ],
    { ...s.list, color: COLORS.slate700 },
    {
      indent: 16,
      rowGap: px(11),
      marker: (x, top) =>
        sheet.page.drawCircle({
          x: x + 3.5,
          y: sheet.topAt(top) - 9.5,
          size: 1.8,
          color: COLORS.slate400,
        }),
    },
  );

  sheet.gap(px(28)).rule(COLORS.navy, 1.6).down(px(15));
  sheet.text("This is an estimate, not a contract price.", {
    font: fonts.bold,
    size: px(13.5),
    color: COLORS.navy,
    lineHeight: 1.45,
  });
  sheet.down(px(3));
  sheet.text(
    `Before any work is agreed, ${profile.legalName} verifies the measurements and the condition of the roof in person, and anything that changes what you would pay is shown to you in writing first.`,
    s.body,
  );
}

/** PAGE 3: who we are, what the weather has done here, how a claim works. */
function pageThree(
  sheet: Sheet,
  data: ProposalData,
  profile: Profile,
  fonts: Fonts,
): void {
  const s = styles(fonts);
  const storms = summarizeStorms(data.lat, data.lon);
  // Only the events big enough to be worth a homeowner's attention, and only
  // when there are some. A page of near misses reads as a solicitation.
  const weather = storms.headline?.damaging ? storms : null;
  const projects = nearbyProjects(data.address);

  sheetHead(sheet, fonts, `Why ${profile.displayName}`);

  sheet.gap(px(22));
  sheet.bulletColumns(profile.credentials, s.body, {
    indent: 16,
    rowGap: px(11),
    marker: (x, top) => drawCheck(sheet.page, x, sheet.topAt(top), 9.5),
  });

  sheet.gap(px(16));
  sheet.text(
    `Based in ${profile.city} since ${siteConfig.foundingYear}, working across the Pine Belt and the Gulf Coast. Our licence and our BBB and manufacturer records are public, and you are welcome to check every one of them before you call us back.`,
    { ...s.body, color: COLORS.slate700 },
  );

  /* Only when there genuinely are jobs in their town. City level, because the
     project records carry a city and no coordinates, and "1.4 miles away"
     would be a number we cannot support. */
  if (projects.count > 0) {
    sheet.gap(px(28));
    sectionHead(
      sheet,
      fonts,
      `ROOFS WE HAVE COMPLETED IN ${projects.city.toUpperCase()}`,
    );
    sheet.gap(px(16));
    sheet.text(
      `${projects.count} completed ${projects.city} ${projects.count === 1 ? "roof is" : "roofs are"} in our public gallery, with photographs of the finished work. You can see them at ${profile.website}/projects.`,
      { ...s.body, color: COLORS.slate700 },
    );
  }

  if (weather?.sentence) {
    sheet.gap(px(28));
    sectionHead(sheet, fonts, "SEVERE WEATHER RECORDED NEAR THIS PROPERTY");
    sheet.gap(px(16));
    sheet.text(weather.sentence, s.body);

    if (weather.supporting.length > 0) {
      sheet.gap(px(10));
      for (const event of weather.supporting) {
        sheet.text(
          `${longDate(event.date)}  ·  ${event.label}  ·  ${event.distanceMi} miles away`,
          {
            font: fonts.regular,
            size: px(12.5),
            color: COLORS.slate600,
            lineHeight: 1.55,
          },
        );
      }
    }

    sheet.gap(px(12));
    sheet.text(
      `Source: ${weather.source}, ${weather.years[0]} to ${weather.years[weather.years.length - 1]}. Weather reports do not establish that this roof has damage. An inspection is what determines its condition.`,
      s.muted,
    );
  } else {
    /*
     * WHAT GOES HERE WHEN NOTHING HAS BLOWN THROUGH.
     *
     * Most addresses this piece goes to have a storm record, and page three
     * was built around one. An address without one printed a page that was
     * three quarters white, which is a worse advertisement than no page at
     * all, and the springs cannot stretch that far.
     *
     * The honest replacement is the thing we would be looking at anyway. None
     * of these are claims about their roof: they are what an inspector checks,
     * which is useful to a homeowner deciding whether to bother, and true
     * whether or not the weather has been near them.
     */
    sheet.gap(px(28));
    sectionHead(sheet, fonts, "WHAT WE LOOK AT ON AN INSPECTION");
    sheet.gap(px(16));
    sheet.bulletColumns(
      [
        "Granule loss, and how much of it is in the gutters",
        "Shingles that have lifted, cracked, curled or gone missing",
        "Nail heads that have backed out and are no longer covered",
        "Pipe boots, which perish years before the shingles do",
        "Flashing at the chimney, the walls and every valley",
        "Decking that has gone soft underfoot",
        "Attic ventilation, which decides how long the next roof lasts",
        "Any sign of water where it should not be",
      ],
      s.list,
      {
        indent: 16,
        rowGap: px(12),
        marker: (x, top) => drawCheck(sheet.page, x, sheet.topAt(top), 9.5),
      },
    );
  }

  /* The claims process is about how we work, not about their weather, so it
     prints either way. A homeowner who has never heard of us needs to know
     what we would and would not do with an insurance company before they
     decide to call. */
  sheet.gap(px(28));
  sectionHead(sheet, fonts, "IF YOUR ROOF HAS STORM DAMAGE");
  sheet.gap(px(18));
  [
    "We inspect the roof and photograph what is actually there.",
    "We explain the conditions we found, including when there is nothing wrong.",
    "You decide whether to contact your insurance company.",
    "We provide the roofing documentation and attend the adjuster's inspection.",
    "Your insurer decides what is covered. That decision is theirs, not ours.",
  ].forEach((step, i) => {
    sheet.step(i + 1, step, s.body);
    sheet.gap(px(12));
  });
}

/** PAGE 4: the one thing we want them to do. */
function pageFour(
  sheet: Sheet,
  data: ProposalData,
  profile: Profile,
  fonts: Fonts,
  qr: PDFImage | null,
): void {
  const s = styles(fonts);
  const page = sheet.page;

  /* The legal footer sits on the foot of the page rather than following the
     text, so all four sheets end on the same line. Its height is known up
     front, which is what lets the rest of the page stretch into the space
     above it instead of into it. */
  const footer = `${profile.legalName}, MSBOC #${profile.license}. ${profile.street}, ${profile.city}, ${profile.state} ${profile.postal}. ${profile.phone}. ${profile.email}. Estimate #${shortId(data)} prepared ${longDate(data.createdAt.slice(0, 10))} by ${data.repName}, valid 30 days. Roof area derived from aerial survey data and subject to on-site verification. This is an estimate, not a contract.`;
  const footerHeight = sheet.measure(footer, s.fine);
  sheet.limit = sheet.height - footerHeight - px(30);

  sheetHead(sheet, fonts, "Want us to verify this estimate?");

  sheet.gap(px(22));
  sheet.text(
    "We will inspect the property, measure the roof properly and confirm the scope. If the roof has years left in it, we will tell you that instead.",
    {
      font: fonts.regular,
      size: px(15),
      color: COLORS.slate800,
      lineHeight: 1.45,
    },
  );
  sheet.down(px(9));
  sheet.text("No cost. No obligation.", {
    font: fonts.bold,
    size: px(17),
    color: COLORS.navy,
    lineHeight: 1.25,
  });

  /* The one dark element on the piece, because it is the one place a reader
     has to look. */
  sheet.gap(px(26));
  const pad = 24;
  const qrSize = 132;
  const bandHeight = qrSize + pad * 2;
  sheet.box(bandHeight, COLORS.navy);

  const bandTop = sheet.topAt(sheet.y);
  const qrX = sheet.left + pad;
  if (qr) {
    // The white card is the code's quiet zone. The encoder was told not to
    // add one, because a scanner needs clear space around the code and this
    // is wider than the four modules the specification asks for.
    page.drawRectangle({
      x: qrX - 7,
      y: bandTop - pad - qrSize - 7,
      width: qrSize + 14,
      height: qrSize + 14,
      color: COLORS.white,
    });
    page.drawImage(qr, {
      x: qrX,
      y: bandTop - pad - qrSize,
      width: qrSize,
      height: qrSize,
    });
  }

  const textX = qr ? qrX + qrSize + 28 : sheet.left + pad;
  const textWidth = sheet.left + sheet.width - pad - textX;
  const bandStart = sheet.y;
  sheet.down(pad + 4);
  sheet.text(
    "Verify my estimate",
    { font: fonts.bold, size: px(24), color: COLORS.white, lineHeight: 1.15 },
    { x: textX, width: textWidth },
  );
  sheet.down(px(8));
  sheet.text(
    qr
      ? "Scan the code with your phone camera to open this estimate, including the measurements and the photograph of your roof."
      : "Give us a call and we will send you this estimate, including the measurements and the photograph of your roof.",
    {
      font: fonts.regular,
      size: px(12.5),
      color: COLORS.slate300,
      lineHeight: 1.45,
    },
    { x: textX, width: textWidth },
  );
  sheet.down(px(14));
  sheet.text(
    profile.phone,
    { font: fonts.bold, size: px(30), color: COLORS.white, lineHeight: 1.1 },
    { x: textX, width: textWidth },
  );
  sheet.down(px(5));
  sheet.text(
    `Call us.  ${profile.website}`,
    {
      font: fonts.regular,
      size: px(12.5),
      color: COLORS.slate300,
      lineHeight: 1.3,
    },
    { x: textX, width: textWidth },
  );
  sheet.y = bandStart + bandHeight;

  /* WHAT ACTUALLY HAPPENS NEXT. This is the question a homeowner holding an
     unexpected estimate is really asking: what am I agreeing to by calling.
     Answering it plainly is worth more than the white space. */
  sheet.gap(px(30));
  sectionHead(sheet, fonts, "WHAT HAPPENS WHEN YOU CALL");
  sheet.gap(px(18));
  [
    "We agree a time. Most inspections take under an hour and you do not need to be home for the roof itself.",
    "We go up, photograph the whole roof, and measure it properly rather than from the air.",
    "You get the photographs and a firm price, in writing. If the roof does not need replacing, we say so.",
    "Nothing is agreed until you sign something. There is no deposit to book an inspection.",
  ].forEach((step, i) => {
    sheet.step(i + 1, step, s.body);
    sheet.gap(px(13));
  });

  sheet.gap(px(12));
  sheet.text(
    `Mention estimate #${shortId(data)} when you call and whoever answers will have this property and these measurements in front of them.`,
    { ...s.body, color: COLORS.slate700 },
  );

  sheet.mark();
  sheet.y = Math.max(sheet.y + px(16), sheet.height - footerHeight - px(10));
  sheet.rule(COLORS.slate300, 0.75).down(px(8));
  sheet.text(footer, s.fine);
}
