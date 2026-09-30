"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The address box, with suggestions. Used by every address field on the site.
 *
 * THE PROBLEM IT SOLVES. A free-text address field goes straight to a
 * geocoder, so "123 Main" returns nothing and an address typed the way people
 * say it out loud often resolves to the wrong town. Asking somebody to produce
 * a correctly formatted address before a tool will do anything is a strange
 * toll to charge, and on the lead forms it meant three separate boxes to fill
 * in by hand.
 *
 * TWO WRITE-BACK MODES, because the forms want different things.
 *
 *   "full"   one box holds the whole address. The instant estimator submits a
 *            single string that the API geocodes, so it needs every part.
 *   "street" the form has its own city, state and ZIP boxes. This one takes
 *            the street line and fills the siblings, so picking a suggestion
 *            completes four fields with one tap. Writing the whole formatted
 *            address into a box labelled "Street address" would look like a
 *            bug to anyone reading it back.
 *
 * CONTROLLED OR NOT. The estimator holds its value in React state. The lead
 * and commercial forms post FormData to a server action and need a real named
 * input. Pass value/onChange for the first, name for the second.
 *
 * TYPING STILL WORKS. Suggestions are an accelerator, never a gate. A rural
 * address Places has never heard of, a blocked request, a missing key: all
 * still type and submit exactly as before.
 *
 * ACCESSIBILITY. A real combobox: aria-expanded, aria-controls,
 * aria-activedescendant, arrow keys, Enter to choose, Escape to dismiss, and a
 * polite live region announcing how many suggestions arrived.
 */

export interface AddressSuggestion {
  placeId: string | null;
  description: string;
  main: string;
  secondary: string;
}

export interface AddressParts {
  city: string;
  state: string;
  postal: string;
}

/**
 * Pull city, state and ZIP out of the secondary line.
 *
 * Places returns it as "Petal, MS 39465, USA" for a US address, which is
 * stable enough to split on. Anything that does not match that shape returns
 * empty strings and the sibling fields are left alone, because filling a form
 * with a wrong guess is worse than not filling it.
 */
/*
 * Real USPS state and territory codes.
 *
 * Without this the pattern below accepted any two capital letters, so
 * "London, UK" parsed as state "UK". The proxy restricts suggestions to the
 * US so that cannot arrive today, but this function overwrites fields the
 * customer typed and a bad parse is worse than no parse. The guard costs one
 * lookup.
 */
const US_STATES = new Set(
  ("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS " +
    "MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV " +
    "WI WY DC AS GU MP PR VI AA AE AP").split(" "),
);

export function parseAddressParts(secondary: string): AddressParts {
  const empty = { city: "", state: "", postal: "" };
  if (!secondary) return empty;

  const bits = secondary
    .split(",")
    .map((b) => b.trim())
    .filter((b) => b && b.toUpperCase() !== "USA" && b !== "US");
  if (bits.length < 2) return empty;

  // Last chunk is "MS 39465", "MS 39465-1234" or sometimes just "MS".
  const tail = bits[bits.length - 1];
  const m = /^([A-Z]{2})(?:\s+(\d{5})(?:-\d{4})?)?$/.exec(tail);
  if (!m || !US_STATES.has(m[1])) return empty;

  return {
    city: bits.slice(0, -1).join(", "),
    state: m[1],
    postal: m[2] ?? "",
  };
}

export function AddressAutocomplete({
  id,
  name,
  value,
  onChange,
  onResolved,
  mode = "full",
  required,
  defaultValue,
  className,
  placeholder = "Start typing your address",
  "aria-invalid": ariaInvalid,
}: {
  id: string;
  /** Set for a FormData form. Omit when value/onChange are supplied. */
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onResolved?: (suggestion: AddressSuggestion, parts: AddressParts) => void;
  mode?: "full" | "street";
  required?: boolean;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean | undefined;
}) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? "");
  const text = controlled ? value : inner;

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /*
   * The text we last asked Google about.
   *
   * Without this, choosing a suggestion sets the input value, the effect below
   * sees a change and fires a fresh lookup for the address just chosen: a
   * wasted billed request and a list that reopens under the customer's thumb.
   */
  const lastQuery = useRef("");

  const setText = (v: string) => {
    if (controlled) onChange?.(v);
    else setInner(v);
  };

  useEffect(() => {
    const q = text.trim();
    if (q === lastQuery.current) return;

    /*
     * Everything that sets state happens inside the timer, never in the effect
     * body, which keeps react-hooks/set-state-in-effect happy and stops a
     * re-render on every keystroke below the threshold.
     */
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (q.length < 3) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: q }),
          signal: controller.signal,
        });
        const data = await res.json();
        const next: AddressSuggestion[] = data?.suggestions ?? [];
        setSuggestions(next);
        setActive(-1);
        if (next.length) setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  /**
   * Fill the form's own city, state and ZIP from the chosen suggestion.
   *
   * It overwrites rather than only filling blanks, deliberately: the customer
   * just pointed at a specific building, so the town and ZIP attached to it
   * are more trustworthy than anything half-typed above. Only fields the form
   * actually has are touched, and a line that does not parse touches nothing.
   */
  function fillSiblings(parts: AddressParts) {
    const form = inputRef.current?.form;
    if (!form) return;
    if (!parts.city && !parts.state && !parts.postal) return;
    const set = (field: string, v: string) => {
      if (!v) return;
      const el = form.elements.namedItem(field);
      if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) {
        el.value = v;
        // React-controlled siblings would ignore a raw value assignment, so
        // announce it the way a user edit would.
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    set("city", parts.city);
    set("state", parts.state);
    set("postal", parts.postal);
  }

  function choose(s: AddressSuggestion) {
    const written = mode === "street" ? s.main : s.description;
    lastQuery.current = written;
    setText(written);
    setOpen(false);
    setSuggestions([]);
    setActive(-1);

    /*
     * TWO PASSES, BECAUSE AUTOCOMPLETE DOES NOT CARRY A ZIP.
     *
     * The secondary line is "Petal, MS, USA". There is no postal code in the
     * response at all, so parsing it fills city and state and leaves ZIP
     * empty. Pass one does that immediately, because it costs nothing and the
     * customer sees two boxes complete themselves under their thumb.
     *
     * Pass two asks the geocoder for the ZIP and fills it a moment later. It
     * is deliberately not awaited before the first fill: a network round trip
     * between tapping a suggestion and seeing anything happen would read as a
     * broken tap.
     */
    const quick = parseAddressParts(s.secondary);
    if (mode === "street") fillSiblings(quick);
    onResolved?.(s, quick);

    void (async () => {
      try {
        const res = await fetch("/api/places/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: s.description }),
        });
        const data = await res.json();
        const full: AddressParts = {
          city: data?.city || quick.city,
          state: data?.state || quick.state,
          postal: data?.postal || quick.postal,
        };
        if (!full.postal && !full.city) return;
        if (mode === "street") fillSiblings(full);
        onResolved?.(s, full);
      } catch {
        // The first pass already filled what it could. Nothing to undo.
      }
    })();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      // Only swallow Enter when something is highlighted. Otherwise Enter
      // submits the form, which is what somebody who typed a full address
      // expects it to do.
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <MapPin
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400"
      />
      <input
        ref={inputRef}
        id={id}
        name={name}
        required={required}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="street-address"
        role="combobox"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-invalid={ariaInvalid}
        aria-activedescendant={
          active >= 0 ? `${listId}-option-${active}` : undefined
        }
        /*
          THE ICON PADDING IS NOT OPTIONAL, AND IT USED TO BE.
          
          The default class string carried pl-11 to clear the pin and pr-11 to
          clear the spinner. A caller passing its own className REPLACED that
          whole string, and the forms all pass their own so they match the
          fields around them. Their class is px-4, which puts the text at 16px
          while the pin occupies 14 to 34, so the pin sat on top of whatever
          was typed: the owner's screenshot shows it printed through the 3 of
          3705.
          
          cn merges, so the caller keeps its own border, ring and type styling
          and the two paddings this component needs for its own furniture are
          added on top. twMerge orders pl-* after px-*, so it wins.
        */
        className={cn(
          className ??
            "w-full rounded-xl border border-slate-300 py-4 text-base outline-none focus:border-[#123b63] focus:ring-4 focus:ring-[#123b63]/10",
          "pl-11 pr-11",
        )}
      />
      {loading && (
        <Loader2
          aria-hidden
          className="absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2 animate-spin text-slate-400"
        />
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-30 mt-1.5 max-h-72 w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.placeId ?? s.description}
              id={`${listId}-option-${i}`}
              role="option"
              aria-selected={i === active}
              /*
               * pointerdown, not click. On touch a click fires after the input
               * blurs, and the blur can close the list before the tap lands.
               * Choosing on pointerdown makes the first tap the one that
               * counts, which is what a thumb expects.
               */
              onPointerDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={`cursor-pointer px-4 py-3 text-left ${
                i === active ? "bg-[#123b63]/8" : ""
              }`}
            >
              {/* 44px+ of tappable height per row, so a thumb hits the address
                  it aimed at rather than the one below it. */}
              <span className="block text-[15px] leading-tight font-semibold text-slate-900">
                {s.main}
              </span>
              {s.secondary && (
                <span className="mt-0.5 block text-[13px] leading-tight text-slate-500">
                  {s.secondary}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p aria-live="polite" className="sr-only">
        {open && suggestions.length > 0
          ? `${suggestions.length} address ${suggestions.length === 1 ? "suggestion" : "suggestions"} available. Use the arrow keys to review them.`
          : ""}
      </p>
    </div>
  );
}
