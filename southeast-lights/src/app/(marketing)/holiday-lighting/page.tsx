import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CtaBand } from "@/components/shared/cta-band";
import { FaqList } from "@/components/shared/faq-list";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { HOLIDAY, INCLUDED } from "@/config/pricing";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Christmas Light Installation in Hattiesburg",
  description:
    "Full-service Christmas light installation across South Mississippi. Custom-cut commercial-grade C9 on a rental plan: we design, install, maintain, take down and store your display.",
};

const STEPS = [
  {
    title: "We measure and design",
    body: "We walk the property, measure every run, and lay out a display that fits the architecture instead of fighting it.",
  },
  {
    title: "We cut to your house",
    body: "Commercial-grade C9 cut to your exact rooflines. No gaps at the corners, no bulbs dangling past the end of a run.",
  },
  {
    title: "We install and maintain",
    body: "Installed on a schedule you pick. If anything fails mid-season, we come back and fix it. That is included, not an add-on.",
  },
  {
    title: "We take it down and keep it",
    body: "After the season we remove everything, label it, and store it in our warehouse. Your attic stays empty.",
  },
];

const FAQS = [
  {
    question: "Do I own the lights?",
    answer:
      "No, and that is the point. This is a rental service. The lights are ours, which is why we handle the maintenance, the takedown and the storage, and why nothing ends up in your garage.",
  },
  {
    question: "What does it cost?",
    answer: `Roofline runs ${formatUsd(HOLIDAY.roofPerFt)} per linear foot, with a ${formatUsd(HOLIDAY.minimum)} minimum. Two-story sections and steep roofs (over a 9/12 pitch) each add ${formatUsd(HOLIDAY.surcharge.twoStory)} per foot. Columns are ${formatUsd(HOLIDAY.columnPerFt)} per foot and pathway lighting is ${formatUsd(HOLIDAY.pathwayPerFt)} per foot.`,
  },
  {
    question: "Does the price go up in year two?",
    answer:
      "No. The rate is the same every season. Returning customers also get first pick of install dates before we open the calendar to new bookings.",
  },
  {
    question: "What if a bulb burns out in December?",
    answer:
      "Call us and we will come out and replace it. In-season maintenance is part of the rate, not a separate service call.",
  },
  {
    question: "Will the lights damage my roof?",
    answer:
      "No. We use clips designed for the purpose, never staples or nails through roofing material. We are also a roofing company, so the people hanging your lights are the people who understand exactly what a roof can and cannot take.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. Southeast Lights operates as a division of Southeast Roofing LLC, and the work is covered by the same Mississippi licence and the same insurance that covers our roofing crews.",
  },
];

export default function HolidayLightingPage() {
  return (
    <>
      <PageHero
        eyebrow="Holiday Lighting"
        title={
          <>
            Christmas lights, <span className="text-gradient-glow">handled</span>{" "}
            from start to finish.
          </>
        }
        intro="Custom-cut commercial-grade C9, designed for your rooflines. We install it, maintain it through the season, take it down, and store it until next year."
        secondary={{ label: "See what it costs", href: "/estimator" }}
      />

      <Section
        tone="tint"
        eyebrow="What you get"
        title="One rate covers the entire season."
        intro={`${formatUsd(HOLIDAY.roofPerFt)} per foot of roofline, ${formatUsd(HOLIDAY.minimum)} minimum. Everything below is included, not sold back to you later.`}
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INCLUDED.map((item) => (
            <li key={item} className="card-day px-5 py-4 text-sm text-[#2b2f33]">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        eyebrow="How it works"
        title="Four steps, and you are only involved in the first one."
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="card-day flex flex-col gap-3 p-6">
              <span className="font-display text-sm font-semibold text-glow-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        tone="night"
        eyebrow="Where we work"
        title="Homes, and everything that is not a home."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            href="/holiday-lighting/residential"
            className="card-lit group flex flex-col gap-3 p-7"
          >
            <h3 className="text-xl font-semibold">Residential</h3>
            <p className="text-steel-300">
              Rooflines, ridges, columns, windows, wrapped trees and pathway
              lighting, designed around your house.
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-glow-400">
              Residential lighting
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
          </Link>
          <Link
            href="/holiday-lighting/commercial"
            className="card-lit group flex flex-col gap-3 p-7"
          >
            <h3 className="text-xl font-semibold">Commercial</h3>
            <p className="text-steel-300">
              Churches, schools, municipalities, parks, retail centers and
              large tree installations, with insurance certificates and bid
              paperwork handled.
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-glow-400">
              Commercial lighting
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </span>
          </Link>
        </div>
      </Section>

      <Section tone="tint" eyebrow="Questions" title="What people ask us">
        <FaqList items={FAQS} />
      </Section>

      <CtaBand
        title="Get on the schedule."
        body="Tell us the address and roughly what you have in mind. We will measure, design it, and send you a fixed price."
      />
    </>
  );
}
