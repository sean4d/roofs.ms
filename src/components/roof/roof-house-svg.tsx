"use client";

/**
 * Isometric roof illustration for the Anatomy of a Roof diagram.
 *
 * GENERATED — the geometry comes from an axonometric projection of a 3D house
 * model (see docs/roof-house-geometry.md). Hand-editing the coordinates will
 * desynchronise them from the hotspot anchors in config/roof-anatomy.ts.
 *
 * Every labelled component is wrapped in a group tagged via `part()`, so the
 * active part is recoloured and lit by CSS rather than by re-rendering paths.
 * CSS beats SVG presentation attributes, which is what lets the highlight
 * override each shape's own fill/stroke.
 */

import { cn } from "@/lib/utils";

export const ROOF_SVG_VIEWBOX = { width: 960, height: 600 };

export function RoofHouseSvg({
  activeKey,
  className,
}: {
  activeKey: string;
  className?: string;
}) {
  const part = (key: string) => ({
    "data-part": key,
    className: cn(
      "transition-[filter,opacity] duration-300",
      key === activeKey &&
        "[filter:drop-shadow(0_0_9px_rgba(201,112,46,0.75))] [&_ellipse]:fill-ember-500 [&_line]:stroke-ember-500 [&_polygon]:fill-ember-500 [&_polyline]:stroke-ember-500",
    ),
  });

  return (
    <svg
      viewBox="0 0 960 600"
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label="Cutaway illustration of a roof showing every component in place"
    >
      <defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8fbfd"/><stop offset="100%" stopColor="#e9f0f7"/></linearGradient></defs>
      <rect width="960" height="600" rx="24" fill="url(#skyG)"/>
      <ellipse cx="530" cy="493" rx="396" ry="64" fill="#0d2c4b" opacity="0.07"/>
      <polygon points="178.5,198.5 734.4,54.0 649.6,174.7 93.7,319.2" fill="#6c7986" stroke="#46525e" strokeWidth="1.7" strokeLinejoin="round"/>
      <polygon points="123.9,472.5 270.8,546.0 270.8,371.7 197.3,193.6 123.9,298.2" fill="#e8edf3" stroke="#46525e" strokeWidth="1.7" strokeLinejoin="round"/>
      <polygon points="270.8,546.0 789.0,411.3 789.0,237.0 270.8,371.7" fill="#ffffff" stroke="#46525e" strokeWidth="1.7" strokeLinejoin="round"/>
      <line x1="270.8" y1="396.6" x2="789.0" y2="261.9" stroke="#d5dde6" strokeWidth="1.1"/>
      <line x1="270.8" y1="421.5" x2="789.0" y2="286.8" stroke="#d5dde6" strokeWidth="1.1"/>
      <line x1="270.8" y1="446.4" x2="789.0" y2="311.7" stroke="#d5dde6" strokeWidth="1.1"/>
      <line x1="270.8" y1="471.3" x2="789.0" y2="336.6" stroke="#d5dde6" strokeWidth="1.1"/>
      <line x1="270.8" y1="496.2" x2="789.0" y2="361.5" stroke="#d5dde6" strokeWidth="1.1"/>
      <line x1="270.8" y1="521.1" x2="789.0" y2="386.4" stroke="#d5dde6" strokeWidth="1.1"/>
      <polygon points="341.5,393.4 388.6,381.1 388.6,442.4 341.5,454.6" fill="#cfe0ee" stroke="#46525e" strokeWidth="1.4" strokeLinejoin="round"/>
      <polygon points="426.3,371.3 473.4,359.1 473.4,420.3 426.3,432.6" fill="#cfe0ee" stroke="#46525e" strokeWidth="1.4" strokeLinejoin="round"/>
      <polygon points="511.1,349.3 558.2,337.0 558.2,398.3 511.1,410.5" fill="#cfe0ee" stroke="#46525e" strokeWidth="1.4" strokeLinejoin="round"/>
      <g {...part("soffit-fascia")}>
      <polygon points="263.3,404.0 819.2,259.5 789.0,237.0 270.8,371.7" fill="#d5dde6" stroke="#46525e" strokeWidth="1.5" strokeLinejoin="round"/>
      </g>
      <g {...part("field-shingles")}>
      <polygon points="178.5,198.5 734.4,54.0 819.2,259.5 263.3,404.0" fill="#8d9aa8" stroke="#46525e" strokeWidth="1.9" strokeLinejoin="round"/>
      </g>
      <line x1="187.9" y1="221.4" x2="743.8" y2="76.8" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="197.3" y1="244.2" x2="753.2" y2="99.7" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="206.8" y1="267.0" x2="762.7" y2="122.5" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="216.2" y1="289.8" x2="772.1" y2="145.3" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="225.6" y1="312.7" x2="781.5" y2="168.1" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="235.0" y1="335.5" x2="790.9" y2="191.0" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="244.5" y1="358.3" x2="800.3" y2="213.8" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <line x1="253.9" y1="381.2" x2="809.8" y2="236.6" stroke="#6c7986" strokeWidth="1" opacity="0.5"/>
      <g {...part("decking")}><polygon points="178.5,198.5 312.8,163.6 397.6,369.1 263.3,404.0" fill="#c9a679" stroke="#a8874f" strokeWidth="1.7" strokeLinejoin="round"/></g>
      <g {...part("underlayment")}><polygon points="178.5,190.5 312.8,155.6 390.4,343.6 256.1,378.5" fill="#4f7ea8" stroke="#3d6688" strokeWidth="1.7" strokeLinejoin="round"/></g>
      <g {...part("ice-water-shield")}><polygon points="178.5,182.5 312.8,147.6 383.1,318.1 248.9,353.0" fill="#12304d" stroke="#08203a" strokeWidth="1.7" strokeLinejoin="round"/></g>
      <g {...part("starter-shingles")}><polygon points="178.5,174.5 312.8,139.6 375.9,292.7 241.7,327.6" fill="#a7b3bf" stroke="#6c7986" strokeWidth="1.7" strokeLinejoin="round"/></g>
      <g {...part("pipe-boots")}>
      <ellipse cx="399.4" cy="285.2" rx="18.8" ry="8.0" fill="#c9702e" stroke="#46525e" strokeWidth="1.4"/>
      <line x1="399.4" y1="285.2" x2="399.4" y2="254.6" stroke="#12304d" strokeWidth="7" strokeLinecap="round"/>
      </g>
      <g {...part("flashing")}>
      <polygon points="432.9,131.6 477.6,120.0 477.6,234.5 432.9,246.1" fill="#ffffff" stroke="#46525e" strokeWidth="1.6" strokeLinejoin="round"/>
      <polygon points="432.9,131.6 406.0,118.2 406.0,181.1 432.9,246.1" fill="#d5dde6" stroke="#46525e" strokeWidth="1.6" strokeLinejoin="round"/>
      <polygon points="432.9,131.6 406.0,118.2 450.8,106.6 477.6,120.0" fill="#e8edf3" stroke="#46525e" strokeWidth="1.6" strokeLinejoin="round"/>
      <polyline points="406.0,181.1 432.9,246.1 477.6,234.5" fill="none" stroke="#c9702e" strokeWidth="6.5" strokeLinejoin="round" strokeLinecap="round"/>
      </g>
      <g {...part("drip-edge")}>
      <polyline points="263.3,404.0 819.2,259.5" fill="none" stroke="#c9702e" strokeWidth="6" strokeLinecap="round"/></g>
      <g {...part("gutters")}>
      <polygon points="263.3,404.0 819.2,259.5 819.2,273.6 263.3,418.1" fill="#f4f7fa" stroke="#46525e" strokeWidth="1.6" strokeLinejoin="round"/>
      <polyline points="263.3,418.1 819.2,273.6" fill="none" stroke="#46525e" strokeWidth="2.2" strokeLinecap="round" opacity="0.75"/></g>
      <g {...part("ridge-vent")}>
      <polygon points="178.5,198.5 734.4,54.0 734.4,60.1 178.5,204.7" fill="#6c7986" stroke="#46525e" strokeWidth="1.4" strokeLinejoin="round"/></g>
      <g {...part("ridge-cap")}>
      <polyline points="178.5,198.5 734.4,54.0" fill="none" stroke="#12304d" strokeWidth="7.5" strokeLinecap="round"/></g>
      <polygon points="577.0,292.1 701.4,354.3 701.4,528.6 577.0,466.4" fill="#e8edf3" stroke="#46525e" strokeWidth="1.7" strokeLinejoin="round"/>
      <polygon points="783.8,248.0 866.3,311.4 866.3,485.7 701.4,528.6 701.4,354.3" fill="#ffffff" stroke="#46525e" strokeWidth="1.7" strokeLinejoin="round"/>
      <polygon points="762.7,460.8 809.8,448.6 809.8,500.4 762.7,512.6" fill="#12304d" stroke="#46525e" strokeWidth="1.4" strokeLinejoin="round" opacity="0.55"/>
      <polygon points="615.4,163.8 783.8,248.0 866.3,311.4 741.9,249.2" fill="#8d9aa8" stroke="#46525e" strokeWidth="1.8" strokeLinejoin="round"/>
      <g {...part("valleys")}>
      <polygon points="615.4,163.8 783.8,248.0 701.4,354.3 577.0,292.1" fill="#a7b3bf" stroke="#46525e" strokeWidth="1.8" strokeLinejoin="round"/>
      <polyline points="615.4,163.8 577.0,292.1" fill="none" stroke="#c9702e" strokeWidth="7" strokeLinecap="round"/>
      </g>
      <polyline points="615.4,163.8 783.8,248.0" fill="none" stroke="#12304d" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  );
}
