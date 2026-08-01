"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";

import { estimateCost, pricingConfig, type CalcInput } from "@/config/pricing";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-navy-900 outline-none focus:border-steel-500";

function pill(active: boolean) {
  return `rounded-full border px-4 py-2 text-sm font-semibold transition ${
    active ? "border-navy-900 bg-navy-900 text-white" : "border-border bg-white text-slate-600"
  }`;
}

export function CostCalculator() {
  const [material, setMaterial] = useState("architectural-shingles");
  const [homeSize, setHomeSize] = useState("");
  const [stories, setStories] = useState<"one" | "two">("one");
  const [pitch, setPitch] = useState<"low" | "average" | "steep">("average");
  const [tearOff, setTearOff] = useState<"yes" | "no" | "unsure">("unsure");
  const [decking, setDecking] = useState<"yes" | "no" | "unsure">("unsure");
  const [gutters, setGutters] = useState<"yes" | "no">("no");

  useEffect(() => {
    track("tool_opened", { tool: "cost-calculator" });
  }, []);

  const input: CalcInput = {
    material,
    homeSize: Number(homeSize) || 0,
    stories,
    pitch,
    tearOff: tearOff !== "no",
    decking: decking !== "no",
    gutters: gutters === "yes",
  };
  const result = estimateCost(input);

  const fired = useRef(false);
  useEffect(() => {
    if (result && !fired.current) {
      fired.current = true;
      track("calculator_completed", { tool: "cost-calculator", material });
    }
  }, [result, material]);

  const factors = [
    tearOff !== "no" ? "Tear-off of the old roof" : null,
    decking !== "no" ? "Possible decking replacement" : null,
    gutters === "yes" ? "New gutters" : null,
    stories === "two" ? "Two-story access" : null,
    pitch === "steep" ? "Steep pitch" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-white p-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy-900">Roof material</span>
          <select value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass}>
            {Object.entries(pricingConfig.materials).map(([key, m]) => (
              <option key={key} value={key}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-navy-900">Approximate home size (sq ft)</span>
          <input
            type="number"
            inputMode="numeric"
            value={homeSize}
            onChange={(e) => setHomeSize(e.target.value)}
            placeholder="e.g. 2000"
            className={inputClass}
          />
        </label>

        <Choice label="Stories" value={stories} set={(v) => setStories(v as "one" | "two")} options={[["one", "One"], ["two", "Two"]]} />
        <Choice label="Roof pitch" value={pitch} set={(v) => setPitch(v as typeof pitch)} options={[["low", "Low"], ["average", "Average"], ["steep", "Steep"]]} />
        <Choice label="Tear-off needed?" value={tearOff} set={(v) => setTearOff(v as typeof tearOff)} options={[["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]]} />
        <Choice label="Decking concerns?" value={decking} set={(v) => setDecking(v as typeof decking)} options={[["yes", "Yes"], ["no", "No"], ["unsure", "Not sure"]]} />
        <Choice label="Include gutters?" value={gutters} set={(v) => setGutters(v as "yes" | "no")} options={[["yes", "Yes"], ["no", "No"]]} />
      </div>

      {/* Result */}
      <div className="flex flex-col gap-5 rounded-2xl border border-border bg-secondary/40 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-steel-500">Estimated project range</p>
        {result ? (
          <>
            <p className="font-display text-4xl font-bold text-navy-900">
              {usd(result.low)} – {usd(result.high)}
            </p>
            <p className="text-sm text-slate-600">
              Roughly {result.squares} roofing squares. Illustrative financing:{" "}
              <strong className="text-navy-900">
                {usd(result.monthlyLow)}–{usd(result.monthlyHigh)}/mo
              </strong>{" "}
              (est. over {pricingConfig.financing.months} months).
            </p>
            {factors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-navy-900">Included in this estimate:</p>
                <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                  {factors.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="rounded-lg bg-white p-3 text-xs text-slate-500">
              This is an estimate only. Final pricing depends on an on-site inspection: 
              roof condition, access, and material details can change the number.
            </p>
            <Link
              href="/free-inspection"
              onClick={() => track("cta_click", { action: "free-inspection", source: "cost-calculator" })}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 font-semibold text-white"
            >
              Get your exact price, free inspection
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <p className="text-slate-500">Enter your home size to see an estimated range.</p>
        )}
      </div>
    </div>
  );
}

function Choice({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-navy-900">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(([val, lbl]) => (
          <button key={val} type="button" onClick={() => set(val)} className={pill(value === val)}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
