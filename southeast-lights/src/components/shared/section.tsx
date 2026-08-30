import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * A page band. `tone` picks the ground; rhythm stays constant everywhere.
 *
 * MOTION LIVES HERE, which is why almost nothing else has to think about it.
 * Nearly every section on the site renders through this component, so giving
 * the heading block and the body their own reveals covers the whole site from
 * one place, and guarantees they are choreographed the same way: the heading
 * arrives, and the content follows a beat later.
 *
 * The two reveals are separate on purpose. One wrapper around both would move
 * a heading and a twelve-card grid as a single slab, which looks like the
 * page is being dealt rather than composed.
 */
export function Section({
  tone = "ink",
  eyebrow,
  title,
  intro,
  children,
  className,
  id,
}: {
  tone?: "ink" | "raised" | "day";
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "band",
        tone === "raised" && "border-y border-white/10 bg-ink-900",
        tone === "day" && "surface-day",
        className,
      )}
    >
      <div className="container-site">
        <Reveal>
          {eyebrow ? (
            <p
              className={cn(
                "eyebrow",
                tone === "day" ? "text-champagne-600" : "text-champagne-500",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold text-balance sm:text-4xl">
              {title}
            </h2>
          ) : null}
          {intro ? (
            <p
              className={cn(
                "mt-5 max-w-2xl text-lg leading-relaxed",
                tone === "day" ? "text-graphite-600" : "text-bone-300",
              )}
            >
              {intro}
            </p>
          ) : null}
        </Reveal>
        {children ? (
          <Reveal delay={0.12} className="mt-12">
            {children}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
