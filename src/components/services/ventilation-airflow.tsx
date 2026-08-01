import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";

/**
 * Attic-airflow diagram (owner request 2026-07-06): a house cross-section
 * that shows the whole ventilation system at a glance: cool air drawn in
 * low at the soffits, rising as it heats, and pushed out high at the ridge
 * vent. Balanced intake + exhaust is the point the copy keeps making; this
 * lets a homeowner see it.
 */

const STEPS = [
  {
    n: 1,
    title: "Cool air enters at the soffits",
    text: "Intake vents low under the eaves pull fresh outside air into the attic, the half of the system most homes are missing or have painted shut.",
  },
  {
    n: 2,
    title: "It warms and rises",
    text: "Attic air heats against the hot roof deck and climbs toward the peak, carrying summer heat and winter moisture up with it.",
  },
  {
    n: 3,
    title: "Hot air exhausts out the ridge",
    text: "The ridge vent lets that heat and humidity escape at the very top: continuously, with no moving parts, so the whole roof runs cooler and drier.",
  },
];

const NAVY = "#0d2c4b";
const STEEL = "#4f7ea8";
const EMBER = "#e2703a";

/** Schematic gable cross-section with intake (cool) and exhaust (hot) flow. */
function AirflowSvg() {
  return (
    <svg
      viewBox="0 0 600 430"
      role="img"
      aria-label="Cross-section of a house showing cool air drawn in at the soffit vents, rising through the attic, and hot air exhausting out the ridge vent"
      className="w-full"
    >
      <defs>
        <marker
          id="vent-intake"
          markerWidth="9"
          markerHeight="9"
          refX="6"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 0 L9 4.5 L0 9 Z" fill={STEEL} />
        </marker>
        <marker
          id="vent-exhaust"
          markerWidth="9"
          markerHeight="9"
          refX="6"
          refY="4.5"
          orient="auto"
        >
          <path d="M0 0 L9 4.5 L0 9 Z" fill={EMBER} />
        </marker>
      </defs>

      {/* attic cavity */}
      <path d="M120 250 L300 100 L480 250 Z" fill="#eef4fa" />
      {/* living space */}
      <rect
        x="150"
        y="250"
        width="300"
        height="140"
        fill="#f7fafc"
        stroke="#cdd8e3"
        strokeWidth="2"
      />
      {/* ceiling / attic floor */}
      <line
        x1="150"
        y1="250"
        x2="450"
        y2="250"
        stroke="#cdd8e3"
        strokeWidth="2"
        strokeDasharray="5 5"
      />

      {/* roof planes with eave overhang */}
      <path
        d="M112 254 L300 100 L488 254"
        fill="none"
        stroke={NAVY}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ridge vent cap + slit */}
      <line
        x1="272"
        y1="120"
        x2="328"
        y2="120"
        stroke="#ffffff"
        strokeWidth="4"
      />
      <rect x="270" y="104" width="60" height="10" rx="3" fill={NAVY} />

      {/* soffit intake vents */}
      <rect x="118" y="243" width="26" height="9" rx="2" fill={STEEL} />
      <rect x="456" y="243" width="26" height="9" rx="2" fill={STEEL} />

      {/* intake arrows (cool air in) */}
      <path
        d="M96 300 Q104 268 128 252"
        fill="none"
        stroke={STEEL}
        strokeWidth="3.5"
        markerEnd="url(#vent-intake)"
      />
      <path
        d="M504 300 Q496 268 472 252"
        fill="none"
        stroke={STEEL}
        strokeWidth="3.5"
        markerEnd="url(#vent-intake)"
      />

      {/* rising convection inside the attic */}
      <path
        d="M150 240 Q200 150 288 128"
        fill="none"
        stroke={STEEL}
        strokeWidth="3.5"
        strokeDasharray="7 6"
        markerEnd="url(#vent-intake)"
      />
      <path
        d="M450 240 Q400 150 312 128"
        fill="none"
        stroke={STEEL}
        strokeWidth="3.5"
        strokeDasharray="7 6"
        markerEnd="url(#vent-intake)"
      />

      {/* exhaust arrows (hot air out) */}
      <path
        d="M286 96 Q276 60 258 40"
        fill="none"
        stroke={EMBER}
        strokeWidth="3.5"
        markerEnd="url(#vent-exhaust)"
      />
      <path
        d="M314 96 Q324 60 342 40"
        fill="none"
        stroke={EMBER}
        strokeWidth="3.5"
        markerEnd="url(#vent-exhaust)"
      />

      {/* numbered markers */}
      {[
        { n: 1, x: 92, y: 312 },
        { n: 2, x: 300, y: 196 },
        { n: 3, x: 300, y: 30 },
      ].map((m) => (
        <g key={m.n}>
          <circle cx={m.x} cy={m.y} r="14" fill={NAVY} />
          <text
            x={m.x}
            y={m.y + 4.5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill="#ffffff"
          >
            {m.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function VentilationAirflow() {
  return (
    <Section tone="surface">
      <SectionHeading
        eyebrow="How a balanced attic breathes"
        title="Where the air actually goes"
        description="A working attic is a chimney: cool air in low, hot air out high. Miss either half and the whole system stalls, which is exactly what we check for."
        align="center"
      />

      <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Reveal>
          <AirflowSvg />
        </Reveal>

        <StaggerGroup as="ul" className="space-y-4">
          {STEPS.map((step) => (
            <StaggerItem
              as="li"
              key={step.n}
              className="flex items-start gap-3.5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 font-display text-xs font-bold text-white"
              >
                {step.n}
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-slate-600">
          <span
            className="inline-block h-2.5 w-6 rounded-full"
            style={{ backgroundColor: STEEL }}
            aria-hidden="true"
          />
          Cool intake air
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-slate-600">
          <span
            className="inline-block h-2.5 w-6 rounded-full"
            style={{ backgroundColor: EMBER }}
            aria-hidden="true"
          />
          Hot exhaust air
        </span>
      </div>
    </Section>
  );
}
