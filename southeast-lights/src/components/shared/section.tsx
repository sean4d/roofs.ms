import { cn } from "@/lib/utils";

/** A page band. `tone` picks the ground; rhythm stays constant everywhere. */
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
        "py-20 lg:py-24",
        tone === "raised" && "border-y border-white/10 bg-ink-900",
        tone === "day" && "surface-day",
        className,
      )}
    >
      <div className="container-site">
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
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-balance sm:text-4xl">
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
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
