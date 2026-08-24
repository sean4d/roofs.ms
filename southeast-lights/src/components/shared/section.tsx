import { cn } from "@/lib/utils";

/** A page band. `tone` picks the ground; everything else stays constant so
 *  vertical rhythm never drifts between pages. */
export function Section({
  tone = "day",
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  tone?: "day" | "night" | "tint";
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "py-20 lg:py-24",
        tone === "night" && "surface-night",
        tone === "tint" && "bg-[#f5f7fa]",
        tone === "day" && "bg-white",
        className,
      )}
    >
      <div className="container-site">
        {eyebrow ? (
          <p
            className={cn(
              "font-display text-xs tracking-[0.18em] uppercase",
              tone === "night" ? "text-glow-500" : "text-glow-600",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="mt-4 max-w-2xl text-3xl font-bold text-balance sm:text-4xl">
            {title}
          </h2>
        ) : null}
        {intro ? (
          <p
            className={cn(
              "mt-5 max-w-2xl text-lg",
              tone === "night" ? "text-steel-300" : "text-slate-600",
            )}
          >
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
