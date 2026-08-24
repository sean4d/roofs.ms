import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { SeasonMode } from "@/config/season";
import { PhoneLink } from "@/components/shared/phone-link";

/**
 * The hero states the business differently depending on the season, because
 * the business genuinely behaves differently. In holiday mode the display is
 * the product and the deadline is real. Off-season, permanent lighting leads,
 * because that is what someone is searching for in April.
 *
 * [NEEDS: real night photography for the background.] Until it lands, the
 * gradient below is a deliberate placeholder that still looks composed.
 */
export function Hero({ mode }: { mode: SeasonMode }) {
  const holiday = mode === "holiday";

  return (
    <section className="surface-night relative overflow-hidden">
      {/* Ambient glow: a roofline just out of frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,var(--color-glow-500)_0%,transparent_70%)] opacity-[0.14]"
      />

      <div className="container-site relative py-24 lg:py-32">
        <p className="font-display text-xs tracking-[0.18em] text-glow-500 uppercase">
          Hattiesburg &middot; South Mississippi
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
          {holiday ? (
            <>
              Your best Christmas display,{" "}
              <span className="text-gradient-glow">handled</span>.
            </>
          ) : (
            <>
              Lighting that stays up{" "}
              <span className="text-gradient-glow">all year</span>.
            </>
          )}
        </h1>

        <p className="mt-6 max-w-xl text-lg text-steel-300">
          {holiday
            ? "Custom-cut commercial-grade C9, designed for your rooflines. We install it, maintain it, take it down, and store it until next year. You never touch a ladder or a storage bin."
            : "Permanent architectural lighting installed into your trim: warm white every evening, full colour for every holiday, and it disappears in daylight. Installed by the roofing company that knows how not to hurt your roof."}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/free-estimate"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-glow-500 px-6 py-3.5 font-semibold text-night-950 transition-colors hover:bg-glow-400"
          >
            Get a free estimate
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
          <Link
            href={holiday ? "/estimator" : "/permanent-lighting"}
            className="inline-flex items-center justify-center rounded-lg border border-night-700 px-6 py-3.5 font-semibold text-steel-100 transition-colors hover:border-glow-500/50 hover:text-glow-400"
          >
            {holiday ? "See what it costs" : "How permanent lighting works"}
          </Link>
          <PhoneLink className="justify-center px-2 py-3.5 text-steel-300 transition-colors hover:text-glow-400 sm:ml-2" />
        </div>
      </div>
    </section>
  );
}
