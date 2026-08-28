"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Home,
  Loader2,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
} from "lucide-react";

import { siteConfig } from "@/config/site";

/**
 * The public instant estimator, in place of the Roofr link.
 *
 * Four states and no more, because every extra screen between an address and a
 * number is somewhere to lose people: ask, measuring, the result, and the
 * handover. The address box is the whole first screen for the same reason.
 *
 * A NOTE ON WHERE THE PRICE SITS. The number is shown BEFORE any contact
 * details are asked for. Gating it behind a form converts better on paper and
 * is the reason most of these tools feel like a trick: you type your address,
 * you get a form. Showing the price first means the person who then hands over
 * a phone number actually wants a roof, which is a better lead than a bigger
 * pile of worse ones. It also matches how the company already talks about
 * itself everywhere else on the site: tell people the truth first.
 */

type Stage = "ask" | "working" | "result" | "sent";

interface Payment {
  months: number;
  years: number;
  amount: number;
}

interface Estimate {
  measured: boolean;
  address: string;
  squares?: number;
  pitchOver12?: number | null;
  price?: number;
  payments?: Payment[];
  apr?: number;
  partner?: string;
  materialLabel?: string;
  storiesLabel?: string;
  storm?: string | null;
}

const money = (n: number) => `$${n.toLocaleString()}`;

export function InstantEstimator() {
  const [stage, setStage] = useState<Stage>("ask");
  const [address, setAddress] = useState("");
  const [stories, setStories] = useState<1 | 2>(1);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  async function measure(event: React.FormEvent) {
    event.preventDefault();
    if (address.trim().length < 5) return;
    setStage("working");
    setError(null);
    try {
      const res = await fetch("/api/instant-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, stories }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong.");
        setStage("ask");
        return;
      }
      setEstimate(data);
      setStage("result");
    } catch {
      setError("Lost the connection. Try again.");
      setStage("ask");
    }
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (sending || !estimate) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/instant-estimate/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: estimate.address,
          squares: estimate.squares,
          price: estimate.price,
          material: estimate.materialLabel,
          stories: estimate.storiesLabel?.startsWith("2") ? 2 : 1,
          storm: estimate.storm ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send that.");
        setSending(false);
        return;
      }
      setStage("sent");
    } catch {
      setError("Lost the connection. Try again.");
      setSending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {stage === "ask" && (
          <Panel key="ask">
            <Steps active={0} />
            <form onSubmit={measure} className="mt-6">
              <label
                htmlFor="ie-address"
                className="block text-sm font-semibold text-slate-700"
              >
                What is the address?
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <MapPin
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="ie-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Main St, Hattiesburg, MS"
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-slate-300 py-4 pr-4 pl-11 text-base outline-none focus:border-[#123b63] focus:ring-4 focus:ring-[#123b63]/10"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#123b63] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#123b63]/20"
                >
                  Get my price
                  <ArrowRight aria-hidden className="h-5 w-5" />
                </motion.button>
              </div>

              <fieldset className="mt-5">
                <legend className="text-sm font-semibold text-slate-700">
                  How many stories?
                </legend>
                <div className="mt-2 flex gap-2">
                  {([1, 2] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setStories(n)}
                      className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                        stories === n
                          ? "border-[#123b63] bg-[#123b63]/5 text-[#123b63]"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {n} story{n === 2 ? "" : ""}
                    </button>
                  ))}
                </div>
              </fieldset>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  {error}
                </p>
              )}

              <p className="mt-4 text-xs leading-relaxed text-slate-500">
                We measure your roof from aerial imagery and price it on our
                real rate card. No account, no obligation, and we will not call
                you unless you ask us to.
              </p>
            </form>
          </Panel>
        )}

        {stage === "working" && (
          <Panel key="working">
            <Steps active={1} />
            <div className="flex flex-col items-center py-14">
              <Loader2
                aria-hidden
                className="h-9 w-9 animate-spin text-[#123b63]"
              />
              <p className="mt-4 font-[family-name:var(--font-archivo)] text-lg font-bold text-[#123b63]">
                Measuring your roof
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Finding the building, then every plane on it.
              </p>
            </div>
          </Panel>
        )}

        {stage === "result" && estimate && (
          <Panel key="result">
            <Steps active={2} />
            {estimate.measured ? (
              <Result estimate={estimate} />
            ) : (
              <NotMeasured address={estimate.address} />
            )}

            {estimate.measured && (
              <form
                onSubmit={send}
                className="mt-7 border-t border-slate-200 pt-6"
              >
                <h3 className="font-[family-name:var(--font-archivo)] text-lg font-bold text-[#123b63]">
                  Want the full written estimate?
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  We will send it over and book your free inspection to confirm
                  the number on the roof.
                </p>
                <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                    className="rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-[#123b63]"
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    autoComplete="email"
                    className="rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-[#123b63]"
                  />
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    autoComplete="tel"
                    className="rounded-xl border border-slate-300 px-4 py-3.5 text-base outline-none focus:border-[#123b63]"
                  />
                </div>
                {error && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: sending ? 1 : 1.01 }}
                  whileTap={{ scale: sending ? 1 : 0.99 }}
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#123b63] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#123b63]/20 disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send me the estimate"}
                  {!sending && <ArrowRight aria-hidden className="h-5 w-5" />}
                </motion.button>
              </form>
            )}
          </Panel>
        )}

        {stage === "sent" && (
          <Panel key="sent">
            <div className="flex flex-col items-center py-12 text-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-[#123b63]"
              >
                <Check aria-hidden className="h-8 w-8 text-white" />
              </motion.span>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-2xl font-extrabold text-[#123b63]">
                On its way
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                We have your estimate and someone will reach out to set up the
                free inspection. If you would rather not wait, call us.
              </p>
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-[#123b63] px-6 py-3 text-base font-bold text-[#123b63]"
              >
                <Phone aria-hidden className="h-4 w-4" />
                {siteConfig.phone.display}
              </a>
            </div>
          </Panel>
        )}
      </AnimatePresence>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
    >
      {children}
    </motion.div>
  );
}

/** Three dots, so somebody always knows how much is left. */
function Steps({ active }: { active: number }) {
  const labels = ["Address", "Measure", "Your price"];
  return (
    <ol className="flex items-center gap-2">
      {labels.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
              i <= active
                ? "bg-[#123b63] text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {i < active ? <Check aria-hidden className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span
            className={`hidden text-xs font-semibold sm:block ${
              i <= active ? "text-[#123b63]" : "text-slate-400"
            }`}
          >
            {label}
          </span>
          {i < labels.length - 1 && (
            <span
              className={`h-0.5 flex-1 rounded ${
                i < active ? "bg-[#123b63]" : "bg-slate-200"
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function Result({ estimate }: { estimate: Estimate }) {
  return (
    <div className="mt-6">
      <p className="text-sm text-slate-600">{estimate.address}</p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="mt-3 rounded-2xl bg-[#123b63] p-6 text-white"
      >
        <p className="text-[11px] font-bold tracking-[0.14em] text-white/70 uppercase">
          Your estimated roof replacement
        </p>
        <p className="mt-1 font-[family-name:var(--font-archivo)] text-5xl leading-none font-extrabold">
          {money(estimate.price ?? 0)}
        </p>
        {estimate.payments && (
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
            {estimate.payments.map((p) => (
              <div key={p.months}>
                <p className="font-[family-name:var(--font-archivo)] text-xl leading-none font-bold">
                  {money(p.amount)}
                </p>
                <p className="mt-0.5 text-[11px] text-white/70">
                  per month, {p.years} years
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-[10px] leading-relaxed text-white/60">
          Example payments on {money(estimate.price ?? 0)} at{" "}
          {((estimate.apr ?? 0) * 100).toFixed(2)}% APR through our partner{" "}
          {estimate.partner}, subject to credit approval. Your rate and term may
          differ.
        </p>
      </motion.div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat icon={Ruler} label="Roof area" value={`${estimate.squares} sq`} />
        <Stat
          icon={Home}
          label="Pitch"
          value={
            estimate.pitchOver12 ? `${estimate.pitchOver12}:12` : "See visit"
          }
        />
        <Stat
          icon={ShieldCheck}
          label="Stories"
          value={estimate.storiesLabel ?? "1 story"}
        />
      </div>

      {estimate.storm && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            Weather on record at this address
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-800">
            {estimate.storm}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        This is an estimate from aerial measurement, not a bid. It assumes one
        existing layer, sound decking and normal access. We confirm all of that
        on the roof at your free inspection, and anything that changes the price
        gets shown to you in writing first.
      </p>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3.5">
      <Icon aria-hidden className="h-4 w-4 text-[#123b63]" />
      <p className="mt-2 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <p className="font-[family-name:var(--font-archivo)] text-base font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/**
 * When the imagery cannot see the roof.
 *
 * Roughly one address in five, mostly heavy tree cover, which is ordinary in
 * South Mississippi. It says so plainly rather than showing an error, because
 * a homeowner reading "we could not measure it" hears "your house is a
 * problem", and the honest answer is that a photograph from space has limits
 * and a person on a ladder does not.
 */
function NotMeasured({ address }: { address: string }) {
  return (
    <div className="mt-6">
      <p className="text-sm text-slate-600">{address}</p>
      <div className="mt-3 rounded-2xl border-2 border-[#123b63]/20 bg-[#123b63]/5 p-6">
        <h3 className="font-[family-name:var(--font-archivo)] text-xl font-extrabold text-[#123b63]">
          This one needs eyes on it
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          The aerial view of this address is blocked, usually by tree cover,
          which is common around here. That is a limit of the photograph and not
          a problem with your roof. A free inspection gets you a real measured
          number, normally within a day or two.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/free-inspection"
            className="rounded-xl bg-[#123b63] px-6 py-3.5 text-base font-bold text-white"
          >
            Book a free inspection
          </Link>
          <a
            href={`tel:${siteConfig.phone.tel}`}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#123b63] px-6 py-3.5 text-base font-bold text-[#123b63]"
          >
            <Phone aria-hidden className="h-4 w-4" />
            {siteConfig.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
