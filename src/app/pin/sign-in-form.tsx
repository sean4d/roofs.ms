"use client";

import { useState } from "react";

import { ALLOWED_DOMAIN } from "./domain";

/**
 * Ask for a company email, send a one-time link.
 *
 * The success screen is shown for ANY submitted address, including ones that
 * are not allowed. That is on purpose: a form that says "no account here"
 * turns this page into a way to find out who works at the company. The server
 * makes the same promise, so there is nothing to compare against either.
 */
export function SignInForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/pin/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-[family-name:var(--font-archivo)] text-lg font-bold text-[#123b63]">
          Check your email
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          If <span className="font-medium text-slate-900">{email}</span> is a
          Southeast Roofing address, a sign-in link is on its way. It works once
          and expires in 20 minutes.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-4 text-sm font-medium text-[#123b63] underline underline-offset-4"
        >
          Use a different address
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label
        htmlFor="email"
        className="block text-sm font-medium text-slate-700"
      >
        Company email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoFocus
        required
        placeholder={`you@${ALLOWED_DOMAIN}`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#123b63] focus:ring-2 focus:ring-[#123b63]/20"
      />
      <p className="mt-2 text-xs text-slate-500">
        Only @{ALLOWED_DOMAIN} addresses can sign in. There is no password: we
        email you a link.
      </p>

      {state === "error" && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong sending that. Try again in a moment.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-4 w-full rounded-lg bg-[#123b63] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#0d2c4b] disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Email me a link"}
      </button>
    </form>
  );
}
