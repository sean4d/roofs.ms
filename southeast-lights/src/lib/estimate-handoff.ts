/**
 * Carrying an estimate from the estimator to the quote form.
 *
 * "Get my exact quote" was a bare link to /quote, so everything the customer
 * had just configured, the footage, the colour, the total, was thrown away on
 * navigation. The lead arrived with no estimate attached and the office had no
 * idea what had been priced, which is most of the point of having a live
 * estimator at all.
 *
 * sessionStorage rather than the URL. The alternative was a long query string,
 * which would be shareable and bookmarkable but also editable: a price in the
 * address bar invites somebody to change it, and a lead that claims a total
 * the estimator never produced is worse than a lead with no total. Same tab,
 * same visit, gone when the tab closes, which matches how this is actually
 * used: configure, click through, submit.
 *
 * Estimates go stale, so one carries for two hours and is then ignored. A
 * customer who wandered off and came back tomorrow should get a clean form
 * rather than yesterday's numbers silently attached to today's request.
 */

const KEY = "sel-estimate-handoff";
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

/** Mirrors the `estimate` block on the lead schema. */
export interface EstimateHandoff {
  total?: number;
  roofFt?: number;
  colorScheme?: string;
  /** Line label to formatted amount, e.g. "Main roofline · 120 ft" -> "$1,200". */
  selections?: Record<string, string>;
}

interface Stored extends EstimateHandoff {
  savedAt: number;
}

export function saveEstimate(estimate: EstimateHandoff): void {
  try {
    const payload: Stored = { ...estimate, savedAt: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // A blocked or full sessionStorage must never stop someone reaching the
    // form. They lose the carried numbers, not the ability to ask for a quote.
  }
}

export function readEstimate(): EstimateHandoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Stored;
    if (typeof parsed.savedAt !== "number") return null;
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    if (!parsed.total) return null;

    return {
      total: parsed.total,
      roofFt: parsed.roofFt,
      colorScheme: parsed.colorScheme,
      selections: parsed.selections,
    };
  } catch {
    return null;
  }
}

export function clearEstimate(): void {
  snapshot = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

/* ------------------------------------------------------------------
   useSyncExternalStore adapters.

   The form cannot read sessionStorage during render, because the server
   renders first and has none, and reading it in an effect means setting
   state in an effect, which this codebase lints against for good reason.
   useSyncExternalStore is the shape React provides for exactly this: an
   external value that differs between server and client.

   The snapshot has to be referentially stable or React re-renders forever,
   so it is read once and cached. Nothing else writes it during a visit; the
   estimate is fixed the moment the customer leaves the estimator.
------------------------------------------------------------------- */

let snapshot: EstimateHandoff | null | undefined;

export function estimateSnapshot(): EstimateHandoff | null {
  if (snapshot === undefined) snapshot = readEstimate();
  return snapshot;
}

/** The server has no session, so it renders the form without the card. */
export function serverEstimateSnapshot(): EstimateHandoff | null {
  return null;
}

export function subscribeEstimate(): () => void {
  return () => {};
}
