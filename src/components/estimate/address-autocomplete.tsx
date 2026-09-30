"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

/**
 * The address box, with suggestions.
 *
 * THE PROBLEM IT SOLVES. The old box was one free-text field that went
 * straight to the geocoder, so a homeowner who typed "123 Main" got nothing
 * and a homeowner who typed their address the way they say it out loud, with
 * no city, often got the wrong town. They had to produce a complete, correctly
 * formatted address before the tool would do anything, which is a strange
 * thing to ask of somebody whose reward for getting it right is a price.
 *
 * WHY A COMBOBOX RATHER THAN FOUR FIELDS. Four boxes (street, city, state,
 * ZIP) is the other honest answer and it is what the contact form does, but it
 * is four taps and four keyboards on a phone, and it still lets somebody
 * mistype the ZIP into a different county. Picking a real address off a list
 * is one tap, and what it hands the backend is a complete formatted address
 * that Google has already resolved. The submitted value is still a single
 * string, so /api/instant-estimate is unchanged.
 *
 * TYPING STILL WORKS. Suggestions are an accelerator, never a gate. Somebody
 * on a rural road that Places does not list, or anybody whose suggestions fail
 * to load, can type the address and submit exactly as before.
 *
 * ACCESSIBILITY. This is a real combobox: aria-expanded, aria-controls,
 * aria-activedescendant, arrow keys, Enter to choose, Escape to dismiss, and a
 * polite live region so a screen reader hears how many suggestions arrived.
 * The list is mouse, touch and keyboard reachable.
 */

export interface AddressSuggestion {
  placeId: string | null;
  description: string;
  main: string;
  secondary: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onResolved,
  id,
  required,
  placeholder = "Start typing your address",
}: {
  value: string;
  onChange: (value: string) => void;
  /** Fired when the customer picks a real address rather than typing one. */
  onResolved?: (suggestion: AddressSuggestion) => void;
  id: string;
  required?: boolean;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  /*
   * The text we last asked Google about.
   *
   * Without this, choosing a suggestion sets the input value, the effect below
   * sees a change, and fires a fresh lookup for the address that was just
   * chosen: a wasted billed request and a list that reopens under the
   * customer's thumb the instant they pick something.
   */
  const lastQuery = useRef("");

  useEffect(() => {
    const q = value.trim();
    if (q === lastQuery.current) return;

    /*
     * Everything that sets state happens inside the timer, never in the effect
     * body. Clearing the list synchronously here tripped
     * react-hooks/set-state-in-effect and, worse, re-rendered on every
     * keystroke below three characters for no visible benefit. Deleting back
     * to two characters now simply closes the list when the debounce lands.
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
        // An aborted or failed lookup leaves the customer typing, which is a
        // working state. Nothing is shown and nothing is broken.
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value]);

  // Dismiss on an outside tap. On a phone this is how the list gets out of the
  // way when somebody decides to scroll instead of choose.
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

  function choose(s: AddressSuggestion) {
    lastQuery.current = s.description;
    onChange(s.description);
    onResolved?.(s);
    setOpen(false);
    setSuggestions([]);
    setActive(-1);
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
        id={id}
        required={required}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
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
        aria-activedescendant={
          active >= 0 ? `${listId}-option-${active}` : undefined
        }
        className="w-full rounded-xl border border-slate-300 py-4 pr-11 pl-11 text-base outline-none focus:border-[#123b63] focus:ring-4 focus:ring-[#123b63]/10"
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
               * blurs, and the blur can close the list before the tap lands on
               * anything. Choosing on pointerdown makes the first tap the one
               * that counts, which is what a thumb expects.
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
              {/* 44px+ of tappable height per row, so a thumb on a phone hits
                  the address it aimed at rather than the one below it. */}
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

      {/* Announced, not drawn. A sighted user sees the list appear; a screen
          reader user gets told it did. */}
      <p aria-live="polite" className="sr-only">
        {open && suggestions.length > 0
          ? `${suggestions.length} address ${suggestions.length === 1 ? "suggestion" : "suggestions"} available. Use the arrow keys to review them.`
          : ""}
      </p>
    </div>
  );
}
