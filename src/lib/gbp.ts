/**
 * Official Google Business Profile (GBP) API client — Tier 1 SEO automation.
 *
 * This is the direct, first-party path to the two highest-value local-SEO
 * surfaces on the profile, replacing the uncertain Metricool photo route:
 *   1. PHOTOS gallery — every finished job's photos land in the profile's
 *      Photos tab (fresh photos are a documented local-ranking signal).
 *   2. UPDATES feed  — one "What's new" post per job (photo + short caption +
 *      a "Learn more" button linking to that job's project page), which shows
 *      in the Business Profile and can surface in local search.
 *
 * ── Auth model ─────────────────────────────────────────────────────────────
 * GBP uses OAuth 2.0 with the `business.manage` scope. The owner authorizes
 * ONCE (the standard "Sign in with Google and allow" consent screen) and we
 * store the resulting long-lived REFRESH TOKEN as a secret env var. From then
 * on this module mints short-lived access tokens itself — no further human
 * step. Nothing here runs, and no token is ever needed, until those env vars
 * are set, so with none present it's a safe no-op and the upload still fully
 * succeeds (identical to the Meta/Metricool paths).
 *
 * Required env (all secret, set in Vercel — NEVER commit):
 *   GBP_CLIENT_ID       OAuth client id     (Google Cloud console)
 *   GBP_CLIENT_SECRET   OAuth client secret (Google Cloud console)
 *   GBP_REFRESH_TOKEN   from the one-time owner consent (see step=gbp-auth)
 *   GBP_ACCOUNT_ID      the GBP account   — number or "accounts/123"
 *   GBP_LOCATION_ID     the GBP location  — number or "locations/456"
 * Discover the account/location ids with the password-gated step=gbp
 * diagnostic once the first three are set.
 *
 * ── Quota ──────────────────────────────────────────────────────────────────
 * A freshly-approved GBP project starts at a LOW quota (~1 request/min) until
 * a quota increase is granted. So a job posts ONE Update plus a small, capped
 * set of gallery photos; every call degrades gracefully on 429/error and never
 * blocks the website upload.
 */

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
/** business.manage covers reading/writing locations, media, and local posts. */
const SCOPE = "https://www.googleapis.com/auth/business.manage";
/** Account + Business-information APIs (v1) for discovery. */
const ACCOUNT_MGMT = "https://mybusinessaccountmanagement.googleapis.com/v1";
const BUSINESS_INFO = "https://mybusinessbusinessinformation.googleapis.com/v1";
/** Media + local posts still live on the v4 My Business API. */
const V4 = "https://mybusiness.googleapis.com/v4";

/** Just the numeric id from either "accounts/123"/"locations/456" or "123". */
function bareId(value: string | undefined): string {
  return (value ?? "").trim().replace(/^.*\//, "");
}

export function gbpConfigured(): boolean {
  return Boolean(
    process.env.GBP_CLIENT_ID &&
      process.env.GBP_CLIENT_SECRET &&
      process.env.GBP_REFRESH_TOKEN,
  );
}

/**
 * Fully wired for AUTOMATIC posting: OAuth creds AND the specific account +
 * location the job photos belong to. Once the owner sets all five env vars,
 * every upload just posts — matching the "everything works when I upload"
 * directive. Until then the upload still fully succeeds; only the GBP push is
 * held back.
 */
export function gbpReady(): boolean {
  return (
    gbpConfigured() &&
    Boolean(process.env.GBP_ACCOUNT_ID && process.env.GBP_LOCATION_ID)
  );
}

// Access tokens live ~1h; cache the minted one in module memory and refresh a
// minute before expiry. Serverless may cold-start between requests — that just
// means an occasional extra refresh, which is fine.
let cachedToken: { value: string; expiresAt: number } | null = null;

/** Mint (or reuse) an access token from the stored refresh token. Throws on a
 *  real auth failure so callers can surface an actionable error. */
async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID!,
      client_secret: process.env.GBP_CLIENT_SECRET!,
      refresh_token: process.env.GBP_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.access_token) {
    throw new Error(
      `GBP token refresh failed: ${data.error ?? res.status} ${data.error_description ?? ""}`.trim(),
    );
  }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

/** Authorized fetch against a GBP API. Returns parsed JSON + ok/status so
 *  callers can decide how to surface failures without try/catch noise. */
async function gbpFetch(
  url: string,
  init: RequestInit = {},
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const token = await getAccessToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // leave body as raw text
  }
  return { ok: res.ok, status: res.status, body };
}

// ── One-time OAuth: exchange the consent code for a refresh token ────────────

export interface OAuthExchange {
  ok: boolean;
  refreshToken?: string;
  note: string;
  raw?: unknown;
}

/**
 * The "installed app / OOB"-style code exchange for the one-time owner consent.
 * The owner visits the consent URL (see authConsentUrl), approves, and pastes
 * the resulting `code` back through the password-gated step=gbp-auth endpoint.
 * We exchange it here and RETURN the refresh token so the owner can paste it
 * into Vercel env as GBP_REFRESH_TOKEN. We never persist it ourselves.
 */
export async function exchangeAuthCode(
  code: string,
  redirectUri: string,
): Promise<OAuthExchange> {
  if (!process.env.GBP_CLIENT_ID || !process.env.GBP_CLIENT_SECRET) {
    return { ok: false, note: "Set GBP_CLIENT_ID + GBP_CLIENT_SECRET first" };
  }
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GBP_CLIENT_ID,
      client_secret: process.env.GBP_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.refresh_token) {
    return {
      ok: false,
      note:
        data.error_description ??
        data.error ??
        "No refresh_token returned — ensure access_type=offline & prompt=consent",
      raw: data,
    };
  }
  return {
    ok: true,
    refreshToken: data.refresh_token,
    note: "Copy this into Vercel env as GBP_REFRESH_TOKEN (secret), then redeploy.",
  };
}

/** The consent URL the owner opens once to authorize. */
export function authConsentUrl(redirectUri: string): string | null {
  if (!process.env.GBP_CLIENT_ID) return null;
  const params = new URLSearchParams({
    client_id: process.env.GBP_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline", // → returns a refresh_token
    prompt: "consent", // → forces a fresh refresh_token every time
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// ── Discovery: find the account + location ids for the env vars ──────────────

export interface GbpDiscovery {
  configured: boolean;
  accounts?: Array<{ name?: string; accountName?: string; type?: string }>;
  locations?: Array<{ name?: string; title?: string; address?: string }>;
  note?: string;
  error?: string;
}

/**
 * List the authorized accounts and (if GBP_ACCOUNT_ID is set) that account's
 * locations, so the owner can read off the ids to set GBP_ACCOUNT_ID /
 * GBP_LOCATION_ID. Read-only; never throws.
 */
export async function discoverGbp(): Promise<GbpDiscovery> {
  if (!gbpConfigured()) {
    return { configured: false, note: "Set GBP_CLIENT_ID/SECRET/REFRESH_TOKEN" };
  }
  try {
    const acc = await gbpFetch(`${ACCOUNT_MGMT}/accounts`);
    if (!acc.ok) {
      return {
        configured: true,
        error: `accounts ${acc.status}: ${JSON.stringify(acc.body).slice(0, 300)}`,
      };
    }
    const accounts = ((acc.body as { accounts?: unknown[] }).accounts ??
      []) as Array<{ name?: string; accountName?: string; type?: string }>;

    let locations:
      | Array<{ name?: string; title?: string; address?: string }>
      | undefined;
    const accountId = bareId(process.env.GBP_ACCOUNT_ID);
    if (accountId) {
      const loc = await gbpFetch(
        `${BUSINESS_INFO}/accounts/${accountId}/locations?readMask=name,title,storefrontAddress&pageSize=100`,
      );
      if (loc.ok) {
        const raw = ((loc.body as { locations?: unknown[] }).locations ??
          []) as Array<{
          name?: string;
          title?: string;
          storefrontAddress?: { addressLines?: string[]; locality?: string };
        }>;
        locations = raw.map((l) => ({
          name: l.name,
          title: l.title,
          address: [
            ...(l.storefrontAddress?.addressLines ?? []),
            l.storefrontAddress?.locality,
          ]
            .filter(Boolean)
            .join(", "),
        }));
      }
    }
    return {
      configured: true,
      accounts: accounts.map((a) => ({
        name: a.name,
        accountName: a.accountName,
        type: a.type,
      })),
      locations,
      note: accountId
        ? undefined
        : "Set GBP_ACCOUNT_ID from an account name above, then re-run to list locations.",
    };
  } catch (err) {
    return {
      configured: true,
      error: err instanceof Error ? err.message : "discovery failed",
    };
  }
}

// ── Posting: gallery photos + Update local posts ────────────────────────────

/** The v4 `accounts/{acct}/locations/{loc}` parent for media + localPosts. */
function locationParent(): string {
  return `accounts/${bareId(process.env.GBP_ACCOUNT_ID)}/locations/${bareId(process.env.GBP_LOCATION_ID)}`;
}

export interface GbpPostResult {
  surface: "gallery" | "update";
  status: "posted" | "skipped" | "error";
  note?: string;
  /** Resource name of the created item (media/localPost), when posted. */
  resource?: string;
}

/**
 * Upload ONE public photo to the profile's Photos gallery. GBP fetches the
 * image itself from `sourceUrl`, so the URL must be publicly reachable (the
 * Sanity CDN is). Never throws.
 */
export async function uploadGbpPhoto(
  imageUrl: string,
): Promise<GbpPostResult> {
  if (!gbpReady()) {
    return { surface: "gallery", status: "skipped", note: "Not connected yet" };
  }
  try {
    const res = await gbpFetch(`${V4}/${locationParent()}/media`, {
      method: "POST",
      body: JSON.stringify({
        mediaFormat: "PHOTO",
        locationAssociation: { category: "ADDITIONAL" },
        sourceUrl: imageUrl,
      }),
    });
    if (!res.ok) {
      return {
        surface: "gallery",
        status: "error",
        note: `HTTP ${res.status}: ${JSON.stringify(res.body).slice(0, 300)}`,
      };
    }
    return {
      surface: "gallery",
      status: "posted",
      resource: (res.body as { name?: string }).name,
    };
  } catch (err) {
    return {
      surface: "gallery",
      status: "error",
      note: err instanceof Error ? err.message : "media upload failed",
    };
  }
}

/**
 * Post a capped set of job photos to the gallery, one call each. Capped low to
 * respect the freshly-approved project's ~1 req/min quota and to keep a single
 * job from flooding the gallery. Never throws.
 */
export async function uploadGbpPhotos(
  imageUrls: string[],
  max = 3,
): Promise<GbpPostResult[]> {
  if (!gbpReady()) {
    return [{ surface: "gallery", status: "skipped", note: "Not connected yet" }];
  }
  const out: GbpPostResult[] = [];
  for (const url of imageUrls.slice(0, max)) {
    out.push(await uploadGbpPhoto(url));
  }
  return out;
}

export interface GbpUpdateInput {
  /** Post text (GBP allows up to 1500 chars; we keep it short). */
  summary: string;
  /** Lead photo for the Update card. */
  imageUrl?: string;
  /** "Learn more" destination — the job's project page. */
  learnMoreUrl?: string;
}

/**
 * Create an "Update" (a STANDARD local post) in the profile's Updates feed:
 * short caption + optional photo + a "Learn more" button to the job's project
 * page. This is the surface that can show in the Business Profile and local
 * search. Never throws.
 */
export async function createGbpUpdate(
  input: GbpUpdateInput,
): Promise<GbpPostResult> {
  if (!gbpReady()) {
    return { surface: "update", status: "skipped", note: "Not connected yet" };
  }
  // GBP hard-caps the summary at 1500 chars.
  const summary = input.summary.slice(0, 1490);
  const post: Record<string, unknown> = {
    languageCode: "en-US",
    summary,
    topicType: "STANDARD",
  };
  if (input.imageUrl) {
    post.media = [{ mediaFormat: "PHOTO", sourceUrl: input.imageUrl }];
  }
  if (input.learnMoreUrl) {
    post.callToAction = { actionType: "LEARN_MORE", url: input.learnMoreUrl };
  }
  try {
    const res = await gbpFetch(`${V4}/${locationParent()}/localPosts`, {
      method: "POST",
      body: JSON.stringify(post),
    });
    if (!res.ok) {
      return {
        surface: "update",
        status: "error",
        note: `HTTP ${res.status}: ${JSON.stringify(res.body).slice(0, 300)}`,
      };
    }
    return {
      surface: "update",
      status: "posted",
      resource: (res.body as { name?: string }).name,
    };
  } catch (err) {
    return {
      surface: "update",
      status: "error",
      note: err instanceof Error ? err.message : "local post failed",
    };
  }
}

/**
 * The whole Tier-1 GBP push for one finished job: post the Update (highest
 * SEO value, so it goes first while quota is freshest) then a capped set of
 * gallery photos. Never throws; every piece degrades to a skip/error note.
 */
export async function postJobToGbp(input: {
  summary: string;
  imageUrls: string[];
  learnMoreUrl?: string;
}): Promise<GbpPostResult[]> {
  if (!gbpReady()) {
    return [{ surface: "update", status: "skipped", note: "Not connected yet" }];
  }
  const results: GbpPostResult[] = [];
  results.push(
    await createGbpUpdate({
      summary: input.summary,
      imageUrl: input.imageUrls[0],
      learnMoreUrl: input.learnMoreUrl,
    }),
  );
  for (const r of await uploadGbpPhotos(input.imageUrls)) results.push(r);
  return results;
}
