"use client";

import { cn } from "@/lib/utils";

/**
 * Form primitives.
 *
 * Every field has a real <label> tied by id, errors are announced via
 * aria-describedby and role="alert", and touch targets clear 44px. Required
 * fields are marked in the label rather than only by an asterisk.
 */

export function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-bone-200">
        {label}
        {required ? (
          <span className="ml-1 text-champagne-400" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-2 text-xs font-normal text-bone-500">Optional</span>
        )}
      </label>
      {hint ? <p className="-mt-1 text-xs text-bone-500">{hint}</p> : null}
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-brand-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const base =
  "w-full rounded-lg border bg-white/[0.03] px-4 py-3 text-bone-100 placeholder:text-bone-500/70 transition-colors focus:border-champagne-400/60 focus:outline-none";

export function TextInput({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={cn(base, error ? "border-brand-400/70" : "border-white/12", className)}
    />
  );
}

export function TextArea({
  error,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  return (
    <textarea
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={cn(base, "min-h-32 resize-y", error ? "border-brand-400/70" : "border-white/12", className)}
    />
  );
}

export function Select({
  error,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      {...props}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${props.id}-error` : undefined}
      className={cn(base, "appearance-none", error ? "border-brand-400/70" : "border-white/12", className)}
    >
      {children}
    </select>
  );
}

/** Multi-select chips. Keyboard operable, aria-pressed for screen readers. */
export function ChipGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-bone-200">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-lg border px-4 py-2.5 text-sm transition-colors",
                on
                  ? "border-champagne-400/50 bg-champagne-400/10 text-champagne-200"
                  : "border-white/12 text-bone-400 hover:text-bone-200",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Honeypot. Hidden from people, visible to naive bots. Not display:none,
 * which some bots detect; positioned off-screen and removed from the tab
 * order and the accessibility tree instead.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label htmlFor="company-website">Company website</label>
      <input
        id="company-website"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
