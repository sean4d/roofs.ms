import { CallLink, TextLink } from "@/components/shared/contact-actions";
import { QuoteButton } from "@/components/shared/quote-button";
import { siteConfig } from "@/config/site";

export function CtaBand({
  title,
  body,
  location,
  quoteLabel,
  quoteHref,
}: {
  title: string;
  body: string;
  location: string;
  quoteLabel?: string;
  quoteHref?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 py-20">
      <div className="glow-top absolute inset-x-0 top-0 -z-10 h-40" />
      <div className="container-site flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 leading-relaxed text-bone-300">{body}</p>
          <p className="mt-3 text-sm text-bone-500">
            {siteConfig.responseTime}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <QuoteButton
            location={location}
            label={quoteLabel}
            href={quoteHref}
          />
          <TextLink className="btn-secondary" />
          <CallLink className="justify-center px-2 py-3.5 text-bone-300 transition-colors hover:text-champagne-300" />
        </div>
      </div>
    </section>
  );
}
