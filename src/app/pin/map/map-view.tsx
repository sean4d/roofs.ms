"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Measurement } from "@/lib/quotes/measure";

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
 * The answer, as a sheet over the map.
 *
 * A rejected measurement is shown as prominently as a good one, with the
 * reason in plain words and the aerial photo to look at. The whole point of
 * the confidence rules is that the rep finds out here, on the driveway, rather
 * than the homeowner finding out when the real number arrives.
 */
function ResultSheet({
  result,
  onClose,
}: {
  result: Result;
  onClose: () => void;
}) {
  const { measurement: m, price, storms } = result;
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
          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">
              Measure this one by hand
            </p>
            <p className="mt-1 text-sm leading-relaxed text-amber-900">
              {m.reason}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-3">
              <p className="font-[family-name:var(--font-archivo)] text-3xl font-extrabold text-[#123b63]">
                {price?.shown !== null && price
                  ? `$${price.shown.toLocaleString()}`
                  : price
                    ? `$${price.low.toLocaleString()} to $${price.high.toLocaleString()}`
                    : "--"}
              </p>
              {price && (
                <span className="text-sm text-slate-500">
                  about ${price.monthlyLow.toLocaleString()}/mo
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {m.squares} squares at {m.pitchOver12}:12, {m.planes} planes
            </p>
          </>
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
            {storms.recent.length > 1 && (
              <ul className="mt-2 space-y-0.5">
                {storms.recent.slice(1).map((e) => (
                  <li
                    key={`${e.date}${e.label}`}
                    className="text-xs text-slate-600"
                  >
                    {e.date} &middot; {e.label} &middot; {e.distanceMi} mi
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Save and make a proposal. Only offered when there is a price to put
            on it: a rejected measurement has nothing to send. */}
        {!rejected && <SaveBar result={result} />}

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

/**
 * Capture what the rep learned at the door, then make the proposal.
 *
 * Name, email and phone are all optional. A rep who knocked and got nothing
 * but a look through the blinds still wants the measurement saved and a piece
 * to print, and a form that demanded contact details would simply not get
 * used. Anything they did get makes the follow-up better, so it is offered,
 * never required.
 */
function SaveBar({ result }: { result: Result }) {
  const { measurement: m } = result;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  async function save() {
    if (saving || !m.squares) return;
    setSaving(true);
    setFailed(false);
    try {
      const res = await fetch("/api/pin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: m.formattedAddress ?? `${m.lat}, ${m.lon}`,
          lat: m.lat,
          lon: m.lon,
          squares: m.squares,
          pitchDegrees: m.pitchDegrees,
          planes: m.planes,
          measureSource: "solar",
          measureQuality: m.confidence,
          imageryDate: m.imageryDate,
          name: name.trim() || null,
          email: email.trim() || null,
          phone: phone.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFailed(true);
        setSaving(false);
        return;
      }
      window.location.href = `/pin/proposal/${data.quoteId}`;
    } catch {
      setFailed(true);
      setSaving(false);
    }
  }

  return (
    <div className="mt-5 border-t border-slate-200 pt-4">
      {open && (
        <div className="mb-3 space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Homeowner name (optional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            inputMode="email"
            placeholder="Email (optional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            inputMode="tel"
            placeholder="Phone (optional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-[#123b63]"
          />
        </div>
      )}

      {failed && (
        <p className="mb-2 text-sm text-red-700">
          Could not save that. Try again.
        </p>
      )}

      <div className="flex gap-2">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Add contact
          </button>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="flex-1 rounded-lg bg-[#123b63] px-4 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save and make proposal"}
        </button>
      </div>
    </div>
  );
}
