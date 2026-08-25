"use client";

import { cn } from "@/lib/utils";

/**
 * The estimator's property illustration.
 *
 * Hand-authored SVG, drawn as a restrained architectural front elevation
 * rather than a cartoon: straight rules, honest proportions, no wobble, no
 * clip-art. It is the single most visible custom asset on the site, and a
 * cheap-looking house here would undo the rest of the design.
 *
 * Every lightable element is a path with bulbs distributed along it by the
 * `Run` component, so a selection illuminates exactly the part of the
 * property it names. Bulb colour follows the chosen scheme.
 */

export type ElementKey =
  | "mainRoof"
  | "secondaryRoof"
  | "peaks"
  | "dormers"
  | "windows"
  | "columns"
  | "entry"
  | "pathway"
  | "shrubs"
  | "trees";

export const COLOR_SCHEMES = {
  "warm-white": { label: "Warm White", colors: ["#FFD9A0"] },
  "pure-white": { label: "Pure White", colors: ["#FFFFFF"] },
  "red-white": { label: "Red & White", colors: ["#E03A34", "#FFFFFF"] },
  "red-green": { label: "Red & Green", colors: ["#E03A34", "#3FA463"] },
  multicolor: {
    label: "Multicolor",
    colors: ["#E03A34", "#3FA463", "#4A8FE0", "#F0C040", "#FFFFFF"],
  },
} as const;

export type SchemeKey = keyof typeof COLOR_SCHEMES;

/** Distribute bulbs evenly along a polyline. */
function bulbsAlong(points: [number, number][], spacing: number) {
  const out: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i];
    const [bx, by] = points[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    const n = Math.max(1, Math.round(len / spacing));
    for (let j = 0; j <= n; j++) {
      if (i > 0 && j === 0) continue; // no doubled bulb at a joint
      const t = j / n;
      out.push([ax + dx * t, ay + dy * t]);
    }
  }
  return out;
}

function Run({
  points,
  spacing = 11,
  on,
  colors,
  offset = 0,
}: {
  points: [number, number][];
  spacing?: number;
  on: boolean;
  colors: readonly string[];
  offset?: number;
}) {
  const bulbs = bulbsAlong(points, spacing);
  return (
    <g
      className={cn(
        "transition-opacity duration-500",
        on ? "opacity-100" : "opacity-0",
      )}
      style={{ filter: on ? "url(#bulbGlow)" : undefined }}
    >
      {bulbs.map(([x, y], index) => (
        <circle
          key={`${x}-${y}-${index}`}
          cx={x}
          cy={y}
          r={2.5}
          fill={colors[(index + offset) % colors.length]}
        />
      ))}
    </g>
  );
}

export function HouseSvg({
  active,
  scheme,
  className,
}: {
  active: Set<ElementKey>;
  scheme: SchemeKey;
  className?: string;
}) {
  const colors = COLOR_SCHEMES[scheme].colors;
  const on = (key: ElementKey) => active.has(key);

  const S = "#5A4F4A"; // structure stroke: legible unlit, never competing lit
  const F = "#221E1C"; // structure fill
  const D = "#171413"; // recessed fill (openings, columns)

  return (
    <svg
      viewBox="0 0 900 520"
      className={className}
      role="img"
      aria-label="Illustration of a house that illuminates as lighting options are selected"
    >
      <defs>
        <filter id="bulbGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241F1D" />
          <stop offset="100%" stopColor="#0E0C0B" />
        </linearGradient>
        <radialGradient id="sky" cx="50%" cy="90%" r="70%">
          <stop offset="0%" stopColor="#1C1917" />
          <stop offset="100%" stopColor="#0A0908" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="900" height="520" fill="url(#sky)" />
      <rect x="0" y="430" width="900" height="90" fill="url(#ground)" />

      {/* ---- trees, drawn behind the house ---- */}
      <g>
        <path d="M96 430 L96 300" stroke={S} strokeWidth="7" strokeLinecap="round" />
        <path d="M96 340 L58 300 M96 350 L134 312 M96 316 L72 286 M96 322 L124 292"
          stroke={S} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M812 430 L812 312" stroke={S} strokeWidth="6" strokeLinecap="round" />
        <path d="M812 350 L780 316 M812 358 L846 322 M812 328 L792 302"
          stroke={S} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      </g>

      {/* ---- shrub beds ---- */}
      <g fill={D} stroke={S} strokeWidth="1.5">
        <ellipse cx="278" cy="424" rx="30" ry="13" />
        <ellipse cx="336" cy="426" rx="24" ry="11" />
        <ellipse cx="566" cy="424" rx="30" ry="13" />
        <ellipse cx="624" cy="426" rx="24" ry="11" />
      </g>

      {/* ---- main structure ---- */}
      <g fill={F} stroke={S} strokeWidth="2">
        {/* left wing */}
        <rect x="212" y="300" width="150" height="130" />
        <path d="M200 300 L287 236 L374 300 Z" />
        {/* centre block */}
        <rect x="362" y="262" width="182" height="168" />
        <path d="M348 262 L453 182 L558 262 Z" />
        {/* right wing */}
        <rect x="544" y="300" width="150" height="130" />
        <path d="M532 300 L619 236 L706 300 Z" />
        {/* porch roof */}
        <rect x="386" y="336" width="134" height="10" />
        {/* dormers */}
        <path d="M416 232 L436 214 L456 232 Z" />
        <rect x="418" y="232" width="36" height="30" />
        <path d="M452 232 L472 214 L492 232 Z" />
        <rect x="454" y="232" width="36" height="30" />
      </g>

      {/* ---- columns ---- */}
      <g fill={D} stroke={S} strokeWidth="1.8">
        <rect x="392" y="346" width="13" height="84" />
        <rect x="436" y="346" width="13" height="84" />
        <rect x="458" y="346" width="13" height="84" />
        <rect x="502" y="346" width="13" height="84" />
      </g>

      {/* ---- entry + windows ---- */}
      <rect x="440" y="366" width="30" height="64" fill={D} stroke={S} strokeWidth="1.8" />
      <g fill={D} stroke={S} strokeWidth="1.6">
        <rect x="244" y="330" width="30" height="40" />
        <rect x="300" y="330" width="30" height="40" />
        <rect x="576" y="330" width="30" height="40" />
        <rect x="632" y="330" width="30" height="40" />
        <rect x="386" y="288" width="26" height="34" />
        <rect x="494" y="288" width="26" height="34" />
      </g>

      {/* ---- pathway ---- */}
      <path d="M455 430 L455 452 L392 496 M455 452 L518 496"
        stroke={S} strokeWidth="2" fill="none" />

      {/* =================== LIGHT LAYERS =================== */}

      {/* main roof: the two wing gables + porch edge */}
      <Run on={on("mainRoof")} colors={colors}
        points={[[200, 300], [287, 236], [374, 300]]} />
      <Run on={on("mainRoof")} colors={colors} offset={3}
        points={[[532, 300], [619, 236], [706, 300]]} />
      <Run on={on("mainRoof")} colors={colors} offset={6}
        points={[[386, 341], [520, 341]]} />

      {/* secondary roof: centre gable */}
      <Run on={on("secondaryRoof")} colors={colors} offset={2}
        points={[[348, 262], [453, 182], [558, 262]]} />

      {/* peaks: ridge accents at each apex */}
      <Run on={on("peaks")} colors={colors} spacing={9} offset={1}
        points={[[268, 250], [287, 236], [306, 250]]} />
      <Run on={on("peaks")} colors={colors} spacing={9} offset={4}
        points={[[434, 196], [453, 182], [472, 196]]} />
      <Run on={on("peaks")} colors={colors} spacing={9} offset={2}
        points={[[600, 250], [619, 236], [638, 250]]} />

      {/* dormers */}
      <Run on={on("dormers")} colors={colors} spacing={9}
        points={[[416, 232], [436, 214], [456, 232]]} />
      <Run on={on("dormers")} colors={colors} spacing={9} offset={2}
        points={[[452, 232], [472, 214], [492, 232]]} />

      {/* windows: outlined */}
      {[
        [244, 330, 30, 40],
        [300, 330, 30, 40],
        [576, 330, 30, 40],
        [632, 330, 30, 40],
        [386, 288, 26, 34],
        [494, 288, 26, 34],
      ].map(([x, y, w, h], index) => (
        <Run key={`win-${x}-${y}`} on={on("windows")} colors={colors} spacing={9}
          offset={index}
          points={[[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]} />
      ))}

      {/* columns: wrapped */}
      {[398, 442, 464, 508].map((x, index) => (
        <Run key={`col-${x}`} on={on("columns")} colors={colors} spacing={12}
          offset={index} points={[[x, 348], [x, 428]]} />
      ))}

      {/* entry */}
      <Run on={on("entry")} colors={colors} spacing={9}
        points={[[440, 366], [470, 366], [470, 430]]} />

      {/* pathway stakes */}
      <Run on={on("pathway")} colors={colors} spacing={16}
        points={[[452, 456], [392, 496]]} />
      <Run on={on("pathway")} colors={colors} spacing={16} offset={1}
        points={[[458, 456], [518, 496]]} />

      {/* shrubs */}
      {[
        [278, 424, 30, 13],
        [336, 426, 24, 11],
        [566, 424, 30, 13],
        [624, 426, 24, 11],
      ].map(([cx, cy, rx, ry], index) => (
        <Run key={`shrub-${cx}`} on={on("shrubs")} colors={colors} spacing={10}
          offset={index}
          points={Array.from({ length: 13 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as [number, number];
          })} />
      ))}

      {/* trees: trunk and limb wrapping */}
      <Run on={on("trees")} colors={colors} spacing={13}
        points={[[96, 428], [96, 300]]} />
      <Run on={on("trees")} colors={colors} spacing={13} offset={2}
        points={[[96, 340], [58, 300]]} />
      <Run on={on("trees")} colors={colors} spacing={13} offset={4}
        points={[[96, 350], [134, 312]]} />
      <Run on={on("trees")} colors={colors} spacing={13} offset={1}
        points={[[812, 428], [812, 312]]} />
      <Run on={on("trees")} colors={colors} spacing={13} offset={3}
        points={[[812, 350], [780, 316]]} />
      <Run on={on("trees")} colors={colors} spacing={13} offset={5}
        points={[[812, 358], [846, 322]]} />
    </svg>
  );
}
