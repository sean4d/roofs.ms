"use client";

import { useRef } from "react";

import { splitAddress } from "@/lib/leads/crm-fields";

import { Field, TextInput } from "./field";

/**
 * Property address, asked for as the four fields a CRM needs.
 *
 * This used to be one box. Roofr requires street, city, state and postal code
 * separately and rejects a job card when any is blank, and reading a city out
 * of "3705 Mable St Hattiesburg MS 39401" is guesswork: there is no reliable
 * boundary between a street name and a town name without a comma. Asking is
 * the only way to be certain, and certainty is what turns a lead into a job.
 *
 * The friction that adds is paid back by the paste handler: drop a whole
 * address into the street box and the other three fill themselves in. Between
 * that and browser autofill, which needs these exact autocomplete tokens to
 * work at all, most people still fill this in with one gesture.
 */
export function AddressFields({
  errors,
  hint,
}: {
  errors: Record<string, string>;
  hint?: string;
}) {
  const city = useRef<HTMLInputElement>(null);
  const state = useRef<HTMLInputElement>(null);
  const postal = useRef<HTMLInputElement>(null);

  /**
   * Spread a pasted full address across the fields.
   *
   * Only fills boxes the customer has left empty, so this can never overwrite
   * something they typed on purpose, and only when the paste actually looks
   * like a full address rather than a street on its own.
   */
  const spread = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.includes(",") && !/\d{5}/.test(pasted)) return;

    const parts = splitAddress(pasted);
    if (!parts.city && !parts.state && !parts.postal) return;

    event.preventDefault();
    const input = event.currentTarget;
    input.value = parts.street ?? pasted;

    const fill = (ref: React.RefObject<HTMLInputElement | null>, value?: string) => {
      if (ref.current && value && !ref.current.value) ref.current.value = value;
    };
    fill(city, parts.city);
    fill(state, parts.state);
    fill(postal, parts.postal);
  };

  return (
    <>
      <Field
        id="address"
        label="Street address"
        required
        error={errors.address}
        hint={hint}
      >
        <TextInput
          id="address"
          name="address"
          autoComplete="address-line1"
          placeholder="3705 Mable St"
          required
          error={errors.address}
          onPaste={spread}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_5rem_7rem]">
        <Field id="city" label="City" required error={errors.city}>
          <TextInput
            id="city"
            name="city"
            ref={city}
            autoComplete="address-level2"
            placeholder="Hattiesburg"
            required
            error={errors.city}
          />
        </Field>

        <Field id="state" label="State" required error={errors.state}>
          <TextInput
            id="state"
            name="state"
            ref={state}
            autoComplete="address-level1"
            placeholder="MS"
            maxLength={2}
            required
            error={errors.state}
            className="uppercase"
          />
        </Field>

        <Field id="postal" label="ZIP" required error={errors.postal}>
          <TextInput
            id="postal"
            name="postal"
            ref={postal}
            autoComplete="postal-code"
            placeholder="39401"
            inputMode="numeric"
            maxLength={10}
            required
            error={errors.postal}
          />
        </Field>
      </div>
    </>
  );
}
