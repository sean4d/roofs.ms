import type { Metadata } from "next";
import { BadgeCheck, Ruler, Send, ShieldCheck, Star } from "lucide-react";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs } from "@/components/services/breadcrumbs";
import { Reveal } from "@/components/motion/reveal";
import { InstantEstimator } from "@/components/estimate/instant-estimator";

/**
 * Our own instant estimator, in place of the Roofr one.
 *
 * Every "Instant Estimate" button on the site used to leave for Roofr, which
 * meant the highest-intent visitor on the whole site was handed to somebody
 * else's domain, somebody else's branding and somebody else's data. This page
 * keeps them here and the lead lands in our own pipeline first.
 */

export const metadata: Metadata = buildMetadata({
  title: "Instant Roof Estimate in Hattiesburg, MS | Southeast Roofing",
  description:
    "Type your address and get a real roof replacement price in about a minute, measured from aerial imagery and priced on our own rate card. No account, no obligation.",
  path: "/instant-estimate",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Instant Roof Estimate", path: "/instant-estimate" },
];

const HOW = [
  {
    icon: Ruler,
    title: "We measure the roof",
    body: "Your address is matched to the building and every roof plane on it is measured from aerial imagery. Nobody climbs anything and nothing gets guessed from your square footage.",
  },
  {
    icon: BadgeCheck,
    title: "We price it on our real rate card",
    body: "The same numbers we use on jobs we actually sell, not an internet average. Tear-off, underlayment, flashing and disposal are all in it.",
  },
  {
    icon: Send,
    title: "You get it in writing",
    body: "A written estimate with the measurements, the price, financing options and the storm history on your address, plus a free inspection to confirm it on the roof.",
  },
];

export default function InstantEstimatePage() {
  const t = siteConfig.trustFacts;
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-14 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="mx-auto mt-8 max-w-2xl text-center">
            <Reveal>
              <h1 className="font-[family-name:var(--font-archivo)] text-4xl leading-[1.05] font-extrabold tracking-tight text-[#123b63] sm:text-5xl">
                Your roof price,
                <br />
                in about a minute.
              </h1>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                Type your address. We measure the roof from aerial imagery and
                price it on the same rate card we use on real jobs. No account,
                no obligation, no waiting on a callback.
              </p>
            </Reveal>
          </div>

          <div className="mt-9">
            <InstantEstimator />
          </div>

          <ul className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            {[t.licensed, t.insured, t.bbbRating, t.googleRating].map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <ShieldCheck
                  aria-hidden
                  className="h-3.5 w-3.5 text-[#123b63]"
                />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-[family-name:var(--font-archivo)] text-3xl font-extrabold text-[#123b63]">
              How the number gets made
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {HOW.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06}>
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#123b63]">
                    <step.icon aria-hidden className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-archivo)] text-lg font-bold text-[#123b63]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="mx-auto mt-12 max-w-3xl rounded-2xl border-l-4 border-[#123b63] bg-slate-50 p-6">
              <p className="text-sm leading-relaxed text-slate-700">
                <strong className="text-[#123b63]">
                  What an instant estimate is not.
                </strong>{" "}
                It is a measured, honest starting number, not a bid. It assumes
                one existing layer of shingles, decking that does not need
                replacing, and normal access for a truck. Those are the three
                things that move a roof price, and the only way to know them is
                for somebody to get on the roof. That is what the free
                inspection is for, and anything we find that changes the number
                gets shown to you in writing before it changes what you pay.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Star aria-hidden className="mx-auto h-6 w-6 text-[#123b63]" />
          <p className="mt-3 font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
            {t.warranty}. {t.financing}.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {t.experience}, based in {siteConfig.address.addressLocality} since{" "}
            {siteConfig.foundingYear}. MSBOC #{siteConfig.license}.
          </p>
        </div>
      </section>
    </>
  );
}
