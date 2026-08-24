import type { Metadata } from "next";

import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { HOLIDAY, PERMANENT } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Permanent Outdoor Lighting in Hattiesburg",
  description:
    "Permanent architectural lighting installed into your trim: warm white every evening, full colour for every holiday, invisible by day. Installed by a licensed roofing contractor.",
};

/**
 * DELIBERATELY UNBRANDED.
 *
 * Southeast Lights is not an authorised dealer for any permanent-lighting
 * manufacturer (owner-confirmed 2026-08-24), so no manufacturer name, logo,
 * product photography or warranty language appears on this page.
 *
 * That is not a weakness to write around. The genuine differentiator here
 * has nothing to do with whose track is in the trim: this is a roofing
 * company, and the customer's real anxiety is what happens to their roof
 * when hardware gets permanently fastened along the eave. Sell that.
 *
 * If a dealership is secured later, set siteConfig.permanentLightingBrand
 * and let the name flow outward from there.
 */

const WHY_US = [
  {
    title: "We are the roofing company",
    body: "Permanent lighting means fastening hardware along your roofline for good. Every homeowner's first real question is whether that causes a leak in three years. We are a licensed roofing contractor, so the crew mounting your track is the crew that understands the roof edge, the drip edge and the fascia behind it.",
  },
  {
    title: "Nothing penetrates the roof surface",
    body: "The channel mounts into trim and fascia, not through shingles or the roof deck. No holes in the water-shedding surface of your roof.",
  },
  {
    title: "It disappears in daylight",
    body: "The track is colour-matched to your trim and tucks under the edge. From the street in the middle of the day, you should not be able to tell it is there.",
  },
  {
    title: "One install, every occasion",
    body: "Warm white on an ordinary Tuesday. Red and green in December. Orange in October, team colours on game day, and off entirely when you want it off. All from your phone.",
  },
];

const FAQS = [
  {
    question: "What does permanent lighting cost?",
    answer: `Installation runs ${formatUsd(PERMANENT.perFt.low)} to ${formatUsd(PERMANENT.perFt.high)} per linear foot, plus ${formatUsd(PERMANENT.controller.low)} to ${formatUsd(PERMANENT.controller.high)} for the controller. A typical 150 foot home lands between ${formatUsd(PERMANENT.perFt.low * 150 + PERMANENT.controller.low)} and ${formatUsd(PERMANENT.perFt.high * 150 + PERMANENT.controller.high)}. Difficult rooflines, two-story sections and steep access push toward the upper end.`,
  },
  {
    question: "How does that compare to renting Christmas lights every year?",
    answer: `A 150 foot holiday display rents for about ${formatUsd(150 * HOLIDAY.roofPerFt)} a season, every season. Permanent lighting on the same roofline is a one-time cost that works out to roughly three and a half seasons of renting, and it runs all year instead of six weeks. If you plan to light the house every December for the foreseeable future, the maths favours owning.`,
  },
  {
    question: "Will it damage my roof?",
    answer:
      "No. The mounting channel attaches to trim and fascia rather than penetrating the roof surface. We are a roofing contractor, and we are not going to install something on a roof that we would not want to be called back to repair.",
  },
  {
    question: "What happens if something stops working?",
    answer:
      "Call us and we will come out. We install it, so we service it. Southeast Lights is a division of Southeast Roofing LLC and is not going anywhere.",
  },
  {
    question: "Do I still need Christmas light installation?",
    answer:
      "For the roofline, no. Permanent lighting covers it. Plenty of customers still add wrapped trees, pathway lighting or garland, and we are happy to do those alongside your permanent system.",
  },
];

export default function PermanentLightingPage() {
  const typicalLow = PERMANENT.perFt.low * 150 + PERMANENT.controller.low;
  const typicalHigh = PERMANENT.perFt.high * 150 + PERMANENT.controller.high;

  return (
    <>
      <PageHero
        eyebrow="Permanent Lighting"
        title={
          <>
            Lighting that stays up{" "}
            <span className="text-gradient-glow">all year</span>, and
            disappears by day.
          </>
        }
        intro="Architectural LED installed into your trim. Warm white every evening, full colour for every holiday, and invisible from the street in daylight. You never hang a light again."
        secondary={{ label: "Compare with renting", href: "/estimator" }}
      />

      <Section
        tone="tint"
        eyebrow="Why us"
        title="Anyone can sell you a light strip. The install is the product."
        intro="What you are actually buying is hardware fastened permanently to the edge of your roof, and someone standing behind that decision."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {WHY_US.map((item) => (
            <div key={item.title} className="card-day flex flex-col gap-3 p-7">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        tone="night"
        eyebrow="Pricing"
        title="What it costs, before you call anyone."
        intro={`${formatUsd(PERMANENT.perFt.low)} to ${formatUsd(PERMANENT.perFt.high)} per linear foot installed, plus the controller. Here is what that means for a real house.`}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[100, 150, 200, 250].map((ft) => {
            const low = PERMANENT.perFt.low * ft + PERMANENT.controller.low;
            const high = PERMANENT.perFt.high * ft + PERMANENT.controller.high;
            return (
              <div key={ft} className="card-lit flex flex-col gap-2 p-6">
                <span className="text-sm text-steel-300">{ft} linear feet</span>
                <span className="font-display text-xl font-bold text-glow-400 tabular-nums">
                  {formatUsd(low)} &ndash; {formatUsd(high)}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-6 max-w-2xl text-sm text-steel-300">
          Ranges include the controller. Difficult rooflines, two-story
          sections, steep access and peak-season installs move toward the upper
          end. A typical Hattiesburg home is around 150 feet, so{" "}
          {formatUsd(typicalLow)} to {formatUsd(typicalHigh)} is the number
          most people are looking at.
        </p>
        {siteConfig.workmanshipWarranty ? (
          <p className="mt-4 max-w-2xl text-sm text-steel-300">
            {siteConfig.workmanshipWarranty}
          </p>
        ) : null}
      </Section>

      <Section tone="tint" eyebrow="Questions" title="What people ask us">
        <FaqList items={FAQS} />
      </Section>

      <CtaBand
        title="Find out what your house would cost."
        body="We will measure the roofline, walk you through the colour options, and send you a fixed price. No pressure and no obligation."
      />
    </>
  );
}
