import { cn } from "@/lib/utils";

type SectionTone = "white" | "surface" | "navy";

const toneClasses: Record<SectionTone, string> = {
  white: "bg-background",
  surface: "bg-secondary",
  navy: "bg-navy-900 text-white",
};

interface SectionProps {
  children: React.ReactNode;
  /** Surface tone, alternate white/surface for rhythm; navy sparingly. */
  tone?: SectionTone;
  className?: string;
  /** Anchor id for in-page links. */
  id?: string;
  /** Accessible label when the section has no visible heading. */
  ariaLabel?: string;
}

/**
 * Standard homepage/page section: generous vertical rhythm (PRD §6.4, 
 * breathing room) with a consistent content container.
 */
export function Section({
  children,
  tone = "white",
  className,
  id,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("py-20 sm:py-24 lg:py-28", toneClasses[tone], className)}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}
