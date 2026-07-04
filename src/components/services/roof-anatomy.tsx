import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Roof system anatomy (visual-education directive 2026-07-04): most
 * homeowners can't picture underlayment, drip edge, or ridge vent — this
 * exploded-layer diagram shows every component of a complete shingle
 * system before the copy ever mentions one.
 */

const LAYERS = [
  {
    n: 1,
    title: "Roof decking",
    text: "The wooden foundation everything attaches to — inspected and repaired during tear-off.",
    fill: "#d9b98c",
    edge: "#c2a071",
  },
  {
    n: 2,
    title: "Ice & water shield",
    text: "Self-sealing membrane at valleys, edges, and penetrations — the leak points.",
    fill: "#3d434c",
    edge: "#2b3037",
  },
  {
    n: 3,
    title: "Synthetic underlayment",
    text: "The weather barrier across the whole deck, under every shingle.",
    fill: "#e8eff6",
    edge: "#c9d8e6",
  },
  {
    n: 4,
    title: "Drip edge",
    text: "Metal at the eaves and rakes that steers water into the gutters, not behind them.",
    fill: "#9aa7b4",
    edge: "#7e8b98",
  },
  {
    n: 5,
    title: "Starter strip",
    text: "The sealed first course that locks the roof edge down against wind.",
    fill: "#4f7ea8",
    edge: "#3e6689",
  },
  {
    n: 6,
    title: "Architectural shingles",
    text: "The layer you see — dimensional shingles fastened to manufacturer spec.",
    fill: "#123b63",
    edge: "#0d2c4b",
  },
  {
    n: 7,
    title: "Ridge vent & cap",
    text: "Exhaust for the attic under a finished ridge line — heat out, shingle life up.",
    fill: "#0a2036",
    edge: "#061527",
  },
];

/** Exploded isometric layer stack, drawn to brand palette. */
function AnatomySvg() {
  // Each layer is a skewed parallelogram stacked bottom-up with a slight
  // 3D edge; numbered markers sit on the right tip.
  const width = 560;
  const layerW = 380;
  const skew = 110;
  const layerH = 26;
  const depth = 9;
  const gap = 24;
  const baseY = 380;

  return (
    <svg
      viewBox={`0 0 ${width} ${baseY + layerH + depth + 10}`}
      role="img"
      aria-label="Exploded diagram of a complete shingle roof system, from decking to ridge vent"
      className="w-full"
    >
      {LAYERS.map((layer, index) => {
        const y = baseY - index * (layerH + gap);
        const x = 20 + (index % 2 === 0 ? 0 : 0); // aligned stack
        const top = `M ${x + skew} ${y} L ${x + skew + layerW} ${y} L ${x + layerW} ${y + layerH} L ${x} ${y + layerH} Z`;
        const front = `M ${x} ${y + layerH} L ${x + layerW} ${y + layerH} L ${x + layerW} ${y + layerH + depth} L ${x} ${y + layerH + depth} Z`;
        const markerX = x + skew + layerW + 26;
        const markerY = y + layerH / 2 + 2;

        return (
          <g key={layer.n}>
            <path d={top} fill={layer.fill} />
            <path d={front} fill={layer.edge} />
            {/* connector + numbered marker */}
            <line
              x1={x + skew + layerW - 6}
              y1={markerY}
              x2={markerX - 14}
              y2={markerY}
              stroke="#8faecb"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <circle cx={markerX} cy={markerY} r="13" fill="#0d2c4b" />
            <text
              x={markerX}
              y={markerY + 4.5}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="#ffffff"
            >
              {layer.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function RoofAnatomy() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="Visual guide"
        title="What's actually in a complete roof system"
        description="A roof isn't shingles — it's seven layers working together. Here's every component we install, bottom to top."
        align="center"
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Reveal>
          <AnatomySvg />
        </Reveal>

        <StaggerGroup as="ul" className="space-y-4">
          {LAYERS.map((layer) => (
            <StaggerItem
              as="li"
              key={layer.n}
              className="flex items-start gap-3.5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xs font-bold text-white"
              >
                {layer.n}
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold sm:text-base">
                  {layer.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                  {layer.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
