import "server-only";

import {
  clip,
  endPath,
  popGraphicsState,
  pushGraphicsState,
  rectangle,
  rgb,
  setCharacterSpacing,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  type RGB,
} from "pdf-lib";

/**
 * A very small typesetter, so a printed document paginates once and stays put.
 *
 * WHY THIS EXISTS AT ALL, given the whole app is HTML. The mailed estimate is
 * four Letter pages by design: two sheets, printed double sided, folded once
 * into a 6x9 envelope. Getting four pages out of CSS means asking a print
 * dialog how tall a page is, and every dialog answers differently. Desktop
 * Chrome leaves about 980 CSS pixels between its margins. iOS Safari adds a
 * header and a footer that cannot be switched off and leaves roughly 700. A
 * layout sized for one splits on the other, which is exactly what happened:
 * the same document measured four sheets in the office and five on a phone,
 * repeatedly, whichever budget it was tuned to.
 *
 * There is no CSS that satisfies both, because the two page boxes are simply
 * different sizes. So the pagination is decided here instead, once, in points
 * on a Letter sheet, and the result is a PDF. A print dialog scales a PDF page
 * to fit its paper; it does not re-flow it. Four pages stay four pages on an
 * iPhone, an office laser printer and a print shop alike, and the customer's
 * copy no longer carries the URL and timestamp iOS stamps on a web page.
 *
 * It is deliberately not a layout engine. It does one column of text, an
 * optional second column, rules, boxes and images, top down, with an explicit
 * cursor. Anything more and it would be worth reaching for a real library.
 */

/** Letter, in PostScript points. 72pt to the inch. */
export const LETTER = { width: 612, height: 792 } as const;

/**
 * CSS pixels to points. The mailer was designed in a browser at 96dpi, so the
 * sizes in mailer-doc.tsx convert straight across and the two documents stay
 * recognisably the same piece.
 */
export const px = (n: number) => n * 0.75;

export const COLORS = {
  navy: rgb(0x12 / 255, 0x3b / 255, 0x63 / 255),
  ink: rgb(0x0f / 255, 0x17 / 255, 0x2a / 255),
  slate800: rgb(0x1e / 255, 0x29 / 255, 0x3b / 255),
  slate700: rgb(0x33 / 255, 0x41 / 255, 0x55 / 255),
  slate600: rgb(0x47 / 255, 0x55 / 255, 0x69 / 255),
  slate500: rgb(0x64 / 255, 0x74 / 255, 0x8b / 255),
  slate400: rgb(0x94 / 255, 0xa3 / 255, 0xb8 / 255),
  slate300: rgb(0xcb / 255, 0xd5 / 255, 0xe1 / 255),
  slate100: rgb(0xf1 / 255, 0xf5 / 255, 0xf9 / 255),
  slate50: rgb(0xf8 / 255, 0xfa / 255, 0xfc / 255),
  white: rgb(1, 1, 1),
} as const;

export interface TextStyle {
  font: PDFFont;
  size: number;
  color?: RGB;
  /** Multiple of the font size. 1.35 is comfortable body copy. */
  lineHeight?: number;
  /** Extra space between characters, in points, for the small caps labels. */
  tracking?: number;
}

export interface TextOptions {
  /** Defaults to the sheet's content width. */
  width?: number;
  /** Defaults to the sheet's left margin. */
  x?: number;
  align?: "left" | "right";
  /** Draw nothing, just report the height it would take. */
  measureOnly?: boolean;
}

const widthOf = (text: string, style: TextStyle): number =>
  style.font.widthOfTextAtSize(text, style.size) +
  (style.tracking ?? 0) * Math.max(0, text.length - 1);

/**
 * Greedy wrap. A single word longer than the column is left to overhang rather
 * than broken mid-word: it only happens with an email address or a URL, and a
 * hyphen inserted into one of those is worse than a slightly long line.
 */
export function wrap(text: string, style: TextStyle, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.split("\n")) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = words[0];
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`;
      if (widthOf(candidate, style) <= width) line = candidate;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * One page, with a cursor that runs from the top down.
 *
 * `y` is the distance from the top of the content box, not a PDF coordinate,
 * because everything about laying out a page reads more naturally downwards.
 * The conversion happens in one place, in `baseline`.
 */
export class Sheet {
  readonly page: PDFPage;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  /** Points used so far, from the top of the content box. */
  y = 0;

  /**
   * The springs, which are what make a page fill its sheet.
   *
   * `down` is rigid space: a three point nudge under a heading means three
   * points whatever else happens. `gap` is space that is allowed to stretch,
   * and it is nearly all of the vertical rhythm between blocks. A page is laid
   * out once to see how tall it comes out, then laid out again with every gap
   * multiplied so the content reaches the foot of the sheet.
   *
   * That is what a designer does by hand when the copy on one estimate runs
   * shorter than another, and it is the reason this document can carry an
   * optional storm section without page three arriving two thirds empty.
   */
  gapScale = 1;
  /** Total unscaled springy space requested, for solving the scale. */
  gapTotal = 0;
  /** Where the springs should reach. Defaults to the foot of the content box;
   *  page four sets it above its pinned footer. */
  limit?: number;
  /** The cursor at the end of the springy content, if it is not the end of the
   *  page. Set by `mark`. */
  measured?: number;

  constructor(
    page: PDFPage,
    box: { left: number; top: number; width: number; height: number },
  ) {
    this.page = page;
    this.left = box.left;
    this.top = box.top;
    this.width = box.width;
    this.height = box.height;
  }

  /** How much of the content box is still free. Negative means overset. */
  get remaining(): number {
    return this.height - this.y;
  }

  /** PDF y for a line whose top edge sits `offset` below the content top. */
  private baseline(offset: number, style: TextStyle): number {
    return (
      LETTER.height -
      this.top -
      offset -
      style.size * (style.lineHeight ?? 1.35)
    );
  }

  /** Rigid space. Stays exactly this tall however the page is fitted. */
  down(points: number): this {
    this.y += points;
    return this;
  }

  /** Springy space between blocks. Stretches to fill the sheet. */
  gap(points: number): this {
    this.gapTotal += points;
    this.y += points * this.gapScale;
    return this;
  }

  /** Note the end of the springy content, when a pinned block follows it. */
  mark(): this {
    this.measured = this.y;
    return this;
  }

  /**
   * A paragraph. Returns the height it took, so a caller can lay something out
   * beside it without guessing.
   */
  text(content: string, style: TextStyle, options: TextOptions = {}): number {
    const width = options.width ?? this.width;
    const x = options.x ?? this.left;
    const leading = style.size * (style.lineHeight ?? 1.35);
    const lines = wrap(content, style, width);

    if (!options.measureOnly) {
      const tracking = style.tracking ?? 0;
      if (tracking) this.page.pushOperators(setCharacterSpacing(tracking));
      lines.forEach((line, i) => {
        const dx = options.align === "right" ? width - widthOf(line, style) : 0;
        this.page.drawText(line, {
          x: x + dx,
          y: this.baseline(this.y + i * leading, style),
          size: style.size,
          font: style.font,
          color: style.color ?? COLORS.ink,
        });
      });
      if (tracking) this.page.pushOperators(setCharacterSpacing(0));
    }

    const used = lines.length * leading;
    if (!options.measureOnly) this.y += used;
    return used;
  }

  /** The height `text` would take, without drawing it. */
  measure(content: string, style: TextStyle, width?: number): number {
    return this.text(content, style, { width, measureOnly: true });
  }

  /** A horizontal rule across the content width. */
  rule(color: RGB, thickness = 1, options: { width?: number } = {}): this {
    const width = options.width ?? this.width;
    this.page.drawRectangle({
      x: this.left,
      y: LETTER.height - this.top - this.y - thickness,
      width,
      height: thickness,
      color,
    });
    this.y += thickness;
    return this;
  }

  /** A filled block. Does not move the cursor: callers position inside it. */
  box(
    height: number,
    fill: RGB,
    options: { x?: number; width?: number; offset?: number } = {},
  ): void {
    const top = this.y + (options.offset ?? 0);
    this.page.drawRectangle({
      x: options.x ?? this.left,
      y: LETTER.height - this.top - top - height,
      width: options.width ?? this.width,
      height,
      color: fill,
    });
  }

  /**
   * An image cropped to a window, the way `object-fit: cover` would.
   *
   * pdf-lib has no crop, so the image is scaled to cover the frame and the
   * overhang is clipped by a path. The frame is what governs the height, which
   * is the whole point: the aerial tile is square and the space for it is not,
   * and an uncropped square photograph is what used to land on top of the
   * price when the browser was doing the pagination.
   */
  cover(image: PDFImage, frameHeight: number, gap = 0): this {
    this.y += gap;
    const frameTop = LETTER.height - this.top - this.y;
    const scale = Math.max(
      this.width / image.width,
      frameHeight / image.height,
    );
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;

    this.page.pushOperators(
      pushGraphicsState(),
      rectangle(this.left, frameTop - frameHeight, this.width, frameHeight),
      clip(),
      endPath(),
    );
    this.page.drawImage(image, {
      x: this.left - (drawWidth - this.width) / 2,
      y: frameTop - frameHeight - (drawHeight - frameHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });
    this.page.pushOperators(popGraphicsState());

    this.page.drawRectangle({
      x: this.left,
      y: frameTop - frameHeight,
      width: this.width,
      height: frameHeight,
      borderColor: COLORS.slate300,
      borderWidth: 0.75,
    });

    this.y += frameHeight;
    return this;
  }

  /**
   * A list in two columns, filled down the left then down the right.
   *
   * Column-major rather than row-major because the items are independent
   * (things included in the price, things that can change it) and a reader
   * scanning one column at a time should not have to zigzag.
   */
  bulletColumns(
    items: string[],
    style: TextStyle,
    options: {
      /** Draws one marker. `top` is measured down from the content top, the
       *  same coordinate the cursor uses, so callers never touch PDF space. */
      marker: (x: number, top: number) => void;
      /** How far the text is indented past the marker. */
      indent: number;
      gutter?: number;
      rowGap?: number;
    },
  ): this {
    const gutter = options.gutter ?? 22;
    const rowGap = options.rowGap ?? px(10);
    const columnWidth = (this.width - gutter) / 2;
    const rows = Math.ceil(items.length / 2);
    const startY = this.y;
    let deepest = 0;

    items.forEach((item, i) => {
      const column = Math.floor(i / rows);
      const x = this.left + column * (columnWidth + gutter);
      // Each column restarts at the top of the block.
      if (i % rows === 0) this.y = startY;

      options.marker(x, this.y);
      this.text(item, style, {
        x: x + options.indent,
        width: columnWidth - options.indent,
      });
      this.y += rowGap;
      deepest = Math.max(deepest, this.y);
    });

    this.y = deepest;
    return this;
  }

  /** PDF y for a point `offset` below the content top. For custom drawing. */
  topAt(offset: number): number {
    return LETTER.height - this.top - offset;
  }

  /** A numbered step, with the circled figure the HTML version uses. */
  step(
    n: number,
    content: string,
    style: TextStyle,
    options: { diameter?: number; gap?: number } = {},
  ): this {
    const diameter = options.diameter ?? px(20);
    const gap = options.gap ?? 9;
    const cx = this.left + diameter / 2;
    // Centred on the first LINE of the step, not on the top of the block, so
    // the figure reads as sitting beside the sentence rather than above it.
    const leading = style.size * (style.lineHeight ?? 1.35);
    const cy = LETTER.height - this.top - this.y - leading + style.size * 0.36;

    this.page.drawCircle({
      x: cx,
      y: cy,
      size: diameter / 2,
      borderColor: COLORS.navy,
      borderWidth: 0.7,
    });
    const label = String(n);
    const labelSize = px(10);
    this.page.drawText(label, {
      x: cx - style.font.widthOfTextAtSize(label, labelSize) / 2,
      y: cy - labelSize / 2 + 0.5,
      size: labelSize,
      font: style.font,
      color: COLORS.navy,
    });

    const used = this.text(content, style, {
      x: this.left + diameter + gap,
      width: this.width - diameter - gap,
    });
    // Never let the text sit shorter than the circle it is numbered by.
    if (used < diameter) this.y += diameter - used;
    return this;
  }
}
