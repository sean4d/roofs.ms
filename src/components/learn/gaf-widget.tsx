import type { GafWidgetKey } from "@/content/learn/types";

/**
 * GAF partner-portal widget embed (owner directive 2026-07-05: embed the
 * portal tools, but the customer has already chosen us — no escape
 * hatches). The iframe is sandboxed WITHOUT allow-popups or
 * allow-top-navigation, so any "Visit GAF" / "Find a Contractor" link
 * inside the widget is inert: clicks cannot open new tabs or navigate
 * this page away. We cannot restyle a cross-origin iframe's internals,
 * but we can (and do) remove its ability to take the visitor anywhere.
 */

const WIDGET_META: Record<GafWidgetKey, { src: string; height: number }> = {
  "hdz-widget": {
    src: "https://widgets.gaf.com/hdz-widget",
    height: 1000,
  },
  "parts-of-a-roof-widget": {
    src: "https://widgets.gaf.com/parts-of-a-roof-widget",
    height: 1000,
  },
  "shingle-comparison-chart": {
    src: "https://widgets.gaf.com/shingle-comparison-chart",
    height: 1000,
  },
};

export function GafWidget({
  widget,
  title,
  caption,
}: {
  widget: GafWidgetKey;
  title: string;
  caption: string;
}) {
  const meta = WIDGET_META[widget];

  return (
    <figure className="my-10">
      <div className="shadow-premium overflow-hidden rounded-2xl border border-border bg-white">
        <iframe
          src={meta.src}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer"
          className="block w-full border-0"
          style={{ height: meta.height }}
        />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-slate-500">
        {caption}
      </figcaption>
    </figure>
  );
}
