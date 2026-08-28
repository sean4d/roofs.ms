"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Measurement } from "@/lib/quotes/measure";
import {
  MATERIALS,
  STORIES,
  monthlyPayment,
  priceFor,
  type MaterialKey,
  type StoriesKey,
} from "@/config/quote-rates";

/**
 * The map a rep works from.
 *
 * Built for a phone held in one hand on a driveway, which drives most of the
 * decisions here: the map fills the screen, the result slides up from the
 * bottom where a thumb already is, and there is exactly one thing to do on
 * each screen.
 *
 * Google's own map rather than a cheaper tile provider, because the roof
 * measurement comes from Google's imagery. If the picture on screen disagreed
 * with the picture that got measured, every argument about a wrong number
 * would start with the rep not trusting the tool.
 */

interface PriceResult {
  low: number;
  high: number;
  shown: number | null;
  monthlyLow: number;
  monthlyHigh: number;
}

interface StormResult {
  sentence: string | null;
  counts: { hail: number; wind: number; tornado: number };
  recent: Array<{ date: string; label: string; distanceMi: number }>;
  years: number[];
}

interface Result {
  measurement: Measurement;
  price: PriceResult | null;
  storms: StormResult | null;
}

// Hattiesburg. Where the truck usually starts.
const HOME = { lat: 31.3271, lng: -89.2903 };

export function MapView({ apiKey }: { apiKey: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const marker = useRef<google.maps.Marker | null>(null);

  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /** Measure whatever is under this point and open the sheet. */
  const measure = useCallback(async (lat: number, lng: number) => {
    setBusy(true);
    setError(null);
    setResult(null);

    if (map.current) {
      marker.current?.setMap(null);
      marker.current = new google.maps.Marker({
        position: { lat, lng },
        map: map.current,
      });
      map.current.panTo({ lat, lng });
      if ((map.current.getZoom() ?? 0) < 19) map.current.setZoom(19);
    }

    try {
      const res = await fetch("/api/pin/measure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon: lng }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not measure that one.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Lost the connection. Try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  /* Load the Maps script once, then build the map. */
  useEffect(() => {
    let cancelled = false;

    function build() {
      if (cancelled || !holder.current || map.current) return;
      map.current = new google.maps.Map(holder.current, {
        center: HOME,
        zoom: 17,
        mapTypeId: "hybrid",
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        tilt: 0,
      });
      map.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) void measure(e.latLng.lat(), e.latLng.lng());
      });
      setReady(true);
    }

    if (window.google?.maps) {
      build();
    } else {
      const existing = document.getElementById("gmaps");
      if (existing) {
        existing.addEventListener("load", build);
      } else {
        const s = document.createElement("script");
        s.id = "gmaps";
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
        s.async = true;
        s.onload = build;
        s.onerror = () =>
          setError(
            "The map could not load. Check the browser key restrictions.",
          );
        document.head.appendChild(s);
      }
    }

    // Start where the rep is, not where the office is, but never block on it:
    // location permission is a prompt they may well dismiss.
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        if (cancelled || !map.current) return;
        map.current.setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        map.current.setZoom(18);
      },
      () => {},
      { timeout: 5000 },
    );

    return () => {
      cancelled = true;
    };
  }, [apiKey, measure]);

  async function findAddress(event: React.FormEvent) {
    event.preventDefault();
    if (search.trim().length < 4) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/pin/measure?q=${encodeURIComponent(search)}`,
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Could not find that address.");
        setBusy(false);
        return;
      }
      await measure(data.lat, data.lon);
    } catch {
      setError("Lost the connection. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={holder} className="absolute inset-0 bg-slate-200" />

      {/* Search sits over the map: typing an address and tapping a roof are
          the same job, and a rep should not have to choose a mode first. */}
      <form
        onSubmit={findAddress}
        className="absolute inset-x-0 top-0 z-10 flex gap-2 p-3"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type an address, or tap a roof"
          inputMode="search"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white/95 px-4 py-3 text-base shadow-lg backdrop-blur outline-none focus:border-[#123b63]"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-[#123b63] px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          Go
        </button>
      </form>

      {!ready && (
        <div className="absolute inset-0 grid place-items-center">
          <p className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 shadow">
            Loading the map...
          </p>
        </div>
      )}

      {busy && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-[#123b63] px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-sm font-medium text-white">
          Measuring the roof...
        </div>
      )}

      {error && !busy && (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-3 text-sm font-medium text-[#123b63] underline underline-offset-4"
          >
            Close
          </button>
        </div>
      )}

      {result && !busy && (
        <ResultSheet result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}

/**
 * The answer, as a sheet over the map, and a form the rep can correct.
 *
 * WHY THIS IS EDITABLE. The owner tapped six identical apartment buildings on
 * one street and got 18.1 to 39.4 squares, which at the book rate is $8,960
 * against $19,521 for the same building. Four of the six measured sensibly and
 * two did not, and nothing in Google's response distinguishes them: the same
 * plane counts, the same quality flag, the same everything. Attached buildings
 * are simply where the segmenter guesses, and no threshold I can write
 * separates a good guess from a bad one.
 *
 * So the rep corrects it. They are standing in front of the house, they can
 * see it is two storeys and that the number looks light, and thirty seconds of
 * their judgement beats any amount of my tuning. Squares, pitch, storeys and
 * material are all adjustable and the price follows immediately.
 *
 * That is also what lets every quote be ONE NUMBER again rather than a range.
 * The range existed because a wrong measurement could not be corrected. It can
 * be now, so it is gone.
 */
function ResultSheet({
  result,
  onClose,
}: {
  result: Result;
  onClose: () => void;
}) {
  const { measurement: m, storms } = result;
  const rejected = m.confidence === "reject";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 max-h-[70dvh] overflow-y-auto overscroll-contain rounded-t-2xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl">
      <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 pt-4 pb-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {m.formattedAddress ?? "This roof"}
          </p>
          {m.imageryDate && (
            <p className="mt-0.5 text-xs text-slate-500">
              Aerial photo {m.imageryDate.slice(0, 4)}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="-mt-1 -mr-1 shrink-0 rounded-full px-3 py-1 text-xl leading-none text-slate-400"
        >
          &times;
        </button>
      </div>

      <div className="px-5 py-4">
        {rejected ? (
          <RejectedBox reason={m.reason} />
        ) : (
          <Estimator measurement={m} />
        )}

        {m.warnings.map((w) => (
          <p
            key={w}
            className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-xs leading-relaxed text-slate-700"
          >
            {w}
          </p>
        ))}

        {storms?.sentence && (
          <div className="mt-4 rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
              Weather on this address
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-800">
              {storms.sentence}
            </p>
          </div>
        )}

        {/* The rep's own eyes are the last check, and the one the data cannot
            do: a room added after the photo was taken is invisible to it. */}
        {m.aerialUrl && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
              Does this match the house in front of you?
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.aerialUrl}
              alt="Aerial view of the measured roof"
              className="w-full rounded-lg border border-slate-200"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RejectedBox({ reason }: { reason: string | null }) {
  return (
    <div className="rounded-lg bg-amber-50 p-4">
      <p className="text-sm font-bold text-amber-900">
        Measure this one by hand
      </p>
      <p className="mt-1 text-sm leading-relaxed text-amber-900">{reason}</p>
    </div>
  );
}

/**
 * The estimate the rep can steer, and the actions that come off it.
 *
 * Squares start at whatever the imagery measured and move in half-square steps,
 * which is the granularity a roofer actually thinks in. Pitch and storeys are
 * two taps each. The price recalculates as they go, so the rep can see what a
 * second storey or a metal roof does to the number while the homeowner is
 * standing there, which is worth more than any report.
 */
function Estimator({ measurement }: { measurement: Measurement }) {
  const [squares, setSquares] = useState(measurement.squares ?? 20);
  const [pitch, setPitch] = useState(measurement.pitchOver12 ?? 5);
  const [stories, setStories] = useState<StoriesKey>(1);
  const [material, setMaterial] = useState<MaterialKey>("architectural");
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const price = priceFor(squares, { material, stories });
  const monthly = monthlyPayment(price.shown);
  const nudge = (delta: number) =>
    setSquares((s) => Math.max(1, Math.round((s + delta) * 10) / 10));

  async function save(then: "view" | "send") {
    if (saving) return;
    setSaving(true);
    setFailed(null);
    try {
      const res = await fetch("/api/pin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address:
            measurement.formattedAddress ??
            `${measurement.lat.toFixed(5)}, ${measurement.lon.toFixed(5)}`,
          lat: measurement.lat,
          lon: measurement.lon,
          squares,
          pitchDegrees: (Math.atan(pitch / 12) * 180) / Math.PI,
          planes: measurement.planes,
          measureSource: "solar",
          measureQuality: measurement.confidence,
          imageryDate: measurement.imageryDate,
          material,
          stories,
          name: name.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFailed(data.error ?? "Could not save that.");
        setSaving(false);
        return;
      }
      window.location.href =
        then === "send"
          ? `/pin/proposal/${data.quoteId}?send=1`
          : `/pin/proposal/${data.quoteId}`;
    } catch {
      setFailed("Lost the connection. Try again.");
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-baseline gap-3">
        <p className="font-[family-name:var(--font-archivo)] text-4xl leading-none font-extrabold text-[#123b63]">
          ${price.shown.toLocaleString()}
        </p>
        <span className="text-sm text-slate-500">
          about ${monthly.toLocaleString()}/mo
        </span>
      </div>

      {/* Squares, the one number worth correcting on the spot. */}
      <div className="mt-4 flex items-center gap-3">
        <Step label="&minus;" onClick={() => nudge(-0.5)} />
        <div className="flex-1 text-center">
          <p className="font-[family-name:var(--font-archivo)] text-2xl font-bold text-slate-900">
            {squares.toFixed(1)}
          </p>
          <p className="text-[11px] tracking-wide text-slate-500 uppercase">
            squares
          </p>
        </div>
        <Step label="+" onClick={() => nudge(0.5)} />
      </div>
      {measurement.squares !== null && squares !== measurement.squares && (
        <button
          onClick={() => setSquares(measurement.squares!)}
          className="mt-1 w-full text-center text-[11px] text-slate-400 underline underline-offset-2"
        >
          measured {measurement.squares}, tap to reset
        </button>
      )}

      <div className="mt-4 space-y-3">
        <Choice
          label="Stories"
          value={stories}
          options={[1, 2] as StoriesKey[]}
          render={(v) => STORIES[v].label}
          onChange={setStories}
        />
        <Choice
          label="Pitch"
          value={pitch}
          options={[3, 4, 5, 6, 7, 8, 10, 12]}
          render={(v) => `${v}:12`}
          onChange={setPitch}
        />
        <Choice
          label="Material"
          value={material}
          options={Object.keys(MATERIALS) as MaterialKey[]}
          render={(v) => MATERIALS[v].label.replace(" shingle", "")}
          onChange={setMaterial}
        />
      </div>

      {contactOpen && (
        <div className="mt-4 space-y-2">
          <Field value={name} onChange={setName} placeholder="Homeowner name" />
          <Field
            value={email}
            onChange={setEmail}
            placeholder="Email"
            type="email"
          />
          <Field
            value={phone}
            onChange={setPhone}
            placeholder="Phone"
            type="tel"
          />
        </div>
      )}

      {failed && <p className="mt-3 text-sm text-red-700">{failed}</p>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => setContactOpen((v) => !v)}
          className="rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700"
        >
          {contactOpen ? "Hide contact" : "Add contact"}
        </button>
        <button
          onClick={() => save("send")}
          disabled={saving || !email.trim()}
          title={email.trim() ? "" : "Add an email first"}
          className="rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          Email it
        </button>
      </div>
      <button
        onClick={() => save("view")}
        disabled={saving}
        className="mt-2 w-full rounded-lg bg-[#123b63] px-4 py-3.5 text-base font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving..." : "View PDF"}
      </button>
    </>
  );
}

function Step({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-12 w-12 shrink-0 rounded-full border border-slate-300 text-xl font-bold text-[#123b63] active:bg-slate-100"
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );
}

function Choice<T extends string | number>({
  label,
  value,
  options,
  render,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  render: (v: T) => string;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={String(o)}
            onClick={() => onChange(o)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              o === value
                ? "bg-[#123b63] text-white"
                : "border border-slate-300 text-slate-700"
            }`}
          >
            {render(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      inputMode={type === "email" ? "email" : type === "tel" ? "tel" : "text"}
      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
    />
  );
}
