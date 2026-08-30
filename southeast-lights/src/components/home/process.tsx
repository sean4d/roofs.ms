import { StaggerGroup, StaggerItem } from "@/components/motion/stagger";
/**
 * How the service works.
 *
 * Numbered because this genuinely is a sequence: the order carries
 * information the reader needs. Numbering a set of unordered features would
 * be decoration; numbering a process is not.
 */
const STEPS = [
  {
    title: "Tell us about the property",
    body: "Send the address and a few photos, or build a display in the estimator. Most residential quotes never need a site visit first, because we can measure from aerial imagery.",
  },
  {
    title: "We design and price it",
    body: "You get a layout and a fixed price for the whole season. Commercial and community projects also get a visual concept you can put in front of a board.",
  },
  {
    title: "We install on your date",
    body: "Commercial-grade lighting, custom cut to your property. Timers, cords and connections included. Most residential installations are finished in a day.",
  },
  {
    title: "We keep it running",
    body: "Something fails, we come fix it, at no extra charge. Larger installations get our own night inspections roughly every couple of weeks so we find problems before you do.",
  },
  {
    title: "We take it down and store it",
    body: "Takedown starts mid-January. Everything is labeled and stored under your property's name, which is why next season goes up faster and looks identical.",
  },
];

export function Process() {
  return (
    <section className="band border-y border-white/[0.08] bg-ink-900">
      <div className="container-site">
        <p className="eyebrow text-champagne-500">How it works</p>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold text-balance sm:text-4xl">
          Five steps, and you are only involved in the first one.
        </h2>

        <StaggerGroup
          as="ul"
          className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
        >
          {STEPS.map((step, index) => (
            <StaggerItem as="li" key={step.title} className="relative">
              <span className="font-display text-sm font-semibold text-champagne-500 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="rule-lit mt-3 mb-4" />
              <h3 className="text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-500">
                {step.body}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
