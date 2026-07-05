"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Financing payment estimator (PRD §13 Phase 8 — "real terms only").
 * Terms below are the actual GoodLeap offers from the owner's partner
 * portal (screenshot supplied 2026-07-05): 5/10/15-year standard
 * installment at 12.99% APR with Autopay. Standard amortization math;
 * clearly labeled an estimate, never an offer of credit. Update OFFERS
 * when GoodLeap changes the program.
 */

const APR = 0.1299;

const OFFERS = [
  { years: 5, label: "5-year" },
  { years: 10, label: "10-year" },
  { years: 15, label: "15-year" },
];

const PRESETS = [8500, 12000, 18000, 25000];

function monthlyPayment(principal: number, years: number): number {
  const r = APR / 12;
  const n = years * 12;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

const usd = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export function FinancingCalculator() {
  const [amount, setAmount] = useState(12000);

  return (
    <div className="shadow-premium rounded-3xl border border-border bg-white p-6 sm:p-8">
      <h3 className="font-display text-2xl font-bold text-navy-900">
        Estimate your monthly payment
      </h3>
      <p className="mt-2 leading-relaxed text-slate-600">
        Current GoodLeap offer: <strong>12.99% APR with Autopay</strong>,
        standard installment, $0 down. Slide to your project amount — your
        itemized proposal gives you the exact number to use.
      </p>

      {/* Amount */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="finance-amount"
            className="text-sm font-semibold text-navy-900"
          >
            Project amount
          </label>
          <output className="font-display text-3xl font-bold text-navy-900">
            {usd(amount)}
          </output>
        </div>
        <input
          id="finance-amount"
          type="range"
          min={2000}
          max={50000}
          step={500}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="mt-4 w-full accent-navy-900"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                amount === preset
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-border bg-white text-slate-600 hover:border-steel-500 hover:text-navy-900",
              )}
            >
              {usd(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {OFFERS.map((offer) => {
          const monthly = monthlyPayment(amount, offer.years);
          return (
            <div
              key={offer.years}
              className="rounded-2xl border border-border bg-secondary p-5 text-center"
            >
              <p className="text-sm font-semibold text-slate-500">
                {offer.label} term
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-navy-900">
                {monthly.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
                <span className="text-base font-semibold text-slate-500">
                  /mo
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                12.99% APR · {offer.years * 12} payments
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button
          size="xl"
          render={
            <a
              href={siteConfig.links.financing}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          nativeButton={false}
        >
          Apply with GoodLeap
          <ExternalLink className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-slate-400">
        Estimates only, for planning purposes — not an offer or approval of
        credit. Financing is provided by GoodLeap, LLC, subject to credit
        approval; your actual rate, term, and payment are determined by
        GoodLeap at application. Figures shown use the standard-installment
        12.99% APR with Autopay offer currently available through our
        program and may change. $0-down availability subject to approval.
      </p>
    </div>
  );
}
