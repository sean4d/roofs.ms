import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import type { Lead } from "@/lib/leads";
import {
  drain,
  ensureDelivered,
  saveLead,
  sendBody,
  signatureHeader,
  type Outbox,
  type OutboxRow,
  type RoofgoLead,
  type Sync,
  type Transport,
} from "@/lib/roofgo-lead";
import { recordInstantEstimate } from "@/lib/instant-estimate-save";

/**
 * The instant estimate's save path after SE8: the RoofGo copy goes through
 * an outbox, and RoofGo being down, slow or refusing never touches the
 * homeowner's answer, their email, the lead email or Zapier.
 *
 * Run: npm test
 */

const SECRET = "test-secret-test-secret-test-secret-0123";
const ENDPOINT = "https://roofgo.test/api/integrations/roofs-ms/lead";

/* ---------- fakes ---------- */

function memoryOutbox() {
  const rows = new Map<string, OutboxRow & { nextAt: number }>();
  let clock = 0;
  const box: Outbox & {
    rows: typeof rows;
    advance(s: number): void;
    failInsert?: boolean;
  } = {
    rows,
    advance(s) {
      clock += s * 1000;
    },
    async insert(leadId, publicToken, body) {
      if (box.failInsert) throw new Error("db down");
      if (!rows.has(leadId))
        rows.set(leadId, {
          leadId,
          publicToken,
          body,
          createdAt: new Date(clock),
          attempts: 0,
          deliveredAt: null,
          gaveUpAt: null,
          alertedAt: null,
          lastError: null,
          nextAt: clock,
        });
    },
    async byToken(token) {
      return [...rows.values()].find((r) => r.publicToken === token) ?? null;
    },
    async due(limit) {
      return [...rows.values()]
        .filter((r) => !r.deliveredAt && !r.gaveUpAt && r.nextAt <= clock)
        .slice(0, limit);
    },
    async delivered(leadId) {
      const r = rows.get(leadId)!;
      r.deliveredAt = new Date(clock);
      r.body = null;
      r.attempts += 1;
    },
    async failed(leadId, error, retry) {
      const r = rows.get(leadId)!;
      r.attempts += 1;
      r.lastError = error;
      if (!retry) r.gaveUpAt = new Date(clock);
      r.nextAt = clock + 60_000 * r.attempts;
    },
    async needsAlert() {
      return [...rows.values()].filter(
        (r) =>
          !r.deliveredAt &&
          !r.alertedAt &&
          (r.gaveUpAt || clock - r.createdAt.getTime() > 3_600_000),
      );
    },
    async alerted(ids) {
      for (const id of ids) rows.get(id)!.alertedAt = new Date(clock);
    },
  };
  return box;
}

type Call = { url: string; init: RequestInit };
function fakeRoofgo(respond: (call: Call) => Response | Promise<Response>): {
  transport: Transport;
  calls: Call[];
} {
  const calls: Call[] = [];
  return {
    calls,
    transport: {
      endpoint: ENDPOINT,
      secret: SECRET,
      timeoutMs: 50,
      fetch: (async (url: string, init: RequestInit) => {
        const call = { url: String(url), init };
        calls.push(call);
        return respond(call);
      }) as unknown as typeof fetch,
    },
  };
}

const up = () => fakeRoofgo(() => new Response("{}", { status: 201 }));
const down = () =>
  fakeRoofgo(() => {
    throw new TypeError("fetch failed");
  });
/** Never answers: only the timeout ends it. */
const hanging = () =>
  fakeRoofgo(
    (call) =>
      new Promise<Response>((_, reject) =>
        call.init.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError")),
        ),
      ),
  );

function sync(transport: Transport, outbox = memoryOutbox()) {
  const alerts: OutboxRow[][] = [];
  const s: Sync = {
    outbox,
    transport,
    alert: async (rows) => {
      alerts.push(rows);
    },
  };
  return { s, outbox, alerts };
}

const roofgoLead = (over: Partial<RoofgoLead> = {}): RoofgoLead => ({
  leadId: `ie_${Math.random().toString(36).slice(2, 14)}`,
  createdAt: "2026-10-15T14:03:00.000Z",
  publicToken: "tok_" + "a".repeat(30) + Math.random().toString(36).slice(2),
  name: "RoofGo Test Lead",
  email: "sean+leadtest@roofgo.com",
  phone: "6015550123",
  address: "1 Test St, Hattiesburg, MS 39401, USA",
  city: "Hattiesburg",
  state: "MS",
  postal: "39401",
  lat: 31.3,
  lon: -89.3,
  squares: 28.4,
  pitchDegrees: 26.57,
  planes: 6,
  imageryDate: "2024-03-02",
  material: "architectural",
  stories: 1,
  priceShown: 14100,
  monthlyLow: 210,
  monthlyHigh: 210,
  rateCard: { perSquare: 496 },
  emailedTo: "sean+leadtest@roofgo.com",
  ...over,
});

/* ---------- signing ---------- */

test("the signature is RoofGo's format over the exact body", () => {
  const body = '{"a":1}';
  const header = signatureHeader(SECRET, body, 1700000000);
  const expected = createHmac("sha256", SECRET)
    .update(`1700000000.${body}`)
    .digest("hex");
  assert.equal(header, `t=1700000000,v1=${expected}`);
});

test("a lead is posted signed, to the configured endpoint, with the exact body", async () => {
  const r = up();
  const lead = roofgoLead();
  const { s, outbox } = sync(r.transport);
  const out = await saveLead(lead, s);
  assert.equal(out.ok, true);
  assert.equal(r.calls.length, 1);
  assert.equal(r.calls[0].url, ENDPOINT);
  const body = String(r.calls[0].init.body);
  assert.deepEqual(JSON.parse(body), lead);
  const sig = (r.calls[0].init.headers as Record<string, string>)[
    "X-RoofGo-Signature"
  ];
  const t = Number(/t=(\d+)/.exec(sig)![1]);
  assert.equal(sig, signatureHeader(SECRET, body, t));
  // Delivered, and the homeowner's details no longer sit in the outbox.
  const row = outbox.rows.get(lead.leadId)!;
  assert.ok(row.deliveredAt);
  assert.equal(row.body, null);
});

/* ---------- RoofGo down ---------- */

test("RoofGo down: the lead is queued, retried with backoff, and delivered later", async () => {
  const outbox = memoryOutbox();
  const lead = roofgoLead();
  const first = sync(down().transport, outbox);
  const out = await saveLead(lead, first.s);
  assert.equal(out.ok, false);
  const row = outbox.rows.get(lead.leadId)!;
  assert.equal(row.deliveredAt, null);
  assert.ok(row.body);
  assert.equal(row.attempts, 1);

  // Not due yet: nothing is posted.
  const later = up();
  const second = sync(later.transport, outbox);
  assert.equal((await drain(second.s)).attempted, 0);
  // After the backoff it goes, with the same body.
  outbox.advance(61);
  const res = await drain(second.s);
  assert.deepEqual(res, { attempted: 1, delivered: 1, alerted: 0 });
  assert.deepEqual(JSON.parse(String(later.calls[0].init.body)), lead);
  assert.ok(outbox.rows.get(lead.leadId)!.deliveredAt);
});

test("RoofGo slow: the attempt is cut off by the timeout and queued", async () => {
  const outbox = memoryOutbox();
  const lead = roofgoLead();
  const started = Date.now();
  const out = await saveLead(lead, sync(hanging().transport, outbox).s);
  assert.equal(out.ok, false);
  assert.ok(Date.now() - started < 2000);
  assert.equal(out.ok === false && out.retry, true);
  assert.ok(outbox.rows.get(lead.leadId)!.body);
});

test("a lead still missing after an hour is alerted once", async () => {
  const outbox = memoryOutbox();
  const { s, alerts } = sync(down().transport, outbox);
  const lead = roofgoLead();
  await saveLead(lead, s);
  outbox.advance(30 * 60);
  await drain(s);
  assert.equal(alerts.length, 0);
  outbox.advance(31 * 60);
  await drain(s);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0][0].leadId, lead.leadId);
  outbox.advance(2 * 3600);
  await drain(s);
  assert.equal(alerts.length, 1);
});

test("a refusal that cannot succeed (400, 409) stops retrying and alerts at once", async () => {
  const outbox = memoryOutbox();
  const r = fakeRoofgo(() => new Response('{"reason":"x"}', { status: 409 }));
  const { s, alerts } = sync(r.transport, outbox);
  const lead = roofgoLead();
  const out = await saveLead(lead, s);
  assert.equal(out.ok === false && out.retry, false);
  outbox.advance(3600 * 24);
  const res = await drain(s);
  assert.equal(res.attempted, 0);
  assert.equal(alerts.length, 1);
});

test("not configured: nothing is sent, the lead waits in the outbox", async () => {
  const outbox = memoryOutbox();
  const t: Transport = { ...up().transport, endpoint: undefined };
  const out = await saveLead(roofgoLead(), sync(t, outbox).s);
  assert.equal(out.ok, false);
  assert.equal([...outbox.rows.values()][0].deliveredAt, null);
});

test("outbox unwritable: the lead still goes straight to RoofGo", async () => {
  const outbox = memoryOutbox();
  outbox.failInsert = true;
  const r = up();
  const out = await saveLead(roofgoLead(), sync(r.transport, outbox).s);
  assert.equal(out.ok, true);
  assert.equal(r.calls.length, 1);
});

test("the homeowner's link retries a waiting lead before forwarding", async () => {
  const outbox = memoryOutbox();
  const lead = roofgoLead();
  await saveLead(lead, sync(down().transport, outbox).s);
  assert.equal(
    await ensureDelivered(lead.publicToken, sync(down().transport, outbox).s),
    "pending",
  );
  assert.equal(
    await ensureDelivered(lead.publicToken, sync(up().transport, outbox).s),
    "delivered",
  );
  assert.equal(
    await ensureDelivered(
      "unknown-token-unknown",
      sync(up().transport, outbox).s,
    ),
    "unknown",
  );
});

test("401 during a key change is retried, not dropped", async () => {
  const r = fakeRoofgo(() => new Response("{}", { status: 401 }));
  const out = await sendBody("{}", r.transport);
  assert.equal(out.ok === false && out.retry, true);
});

/* ---------- the whole save path ---------- */

const input = {
  firstName: "RoofGo",
  lastName: "Test Lead",
  email: "sean+leadtest@roofgo.com",
  phone: "6015550123",
  point: {
    formatted: "1 Test St, Hattiesburg, MS 39401, USA",
    lat: 31.3,
    lon: -89.3,
    city: "Hattiesburg",
    state: "MS",
    postal: "39401",
  },
  options: { material: "architectural", stories: 1 },
  measured: {
    squares: 28.4,
    pitchDegrees: 26.57,
    planes: 6,
    imageryDate: "2024-03-02",
  },
  price: 14100,
  monthly: 210,
  rateCard: { perSquare: 496 },
};

function deps(
  saveLeadImpl: (
    l: RoofgoLead,
  ) => Promise<never | Awaited<ReturnType<typeof saveLead>>>,
) {
  const leads: Lead[] = [];
  const emails: Array<{ to: string; url: string }> = [];
  const saved: RoofgoLead[] = [];
  return {
    leads,
    emails,
    saved,
    deps: {
      baseUrl: () => "https://southeastroofing.llc",
      emailEstimate: async (a: { to: string; url: string }) => {
        emails.push(a);
        return true;
      },
      deliverLead: async (l: Lead) => {
        leads.push(l);
        return { delivered: true, transports: ["webhook", "email"] };
      },
      saveLead: async (l: RoofgoLead) => {
        saved.push(l);
        return saveLeadImpl(l);
      },
      now: () => new Date("2026-10-15T14:03:00.000Z"),
    },
  };
}

/** The lead email and Zapier payload, exactly as the route built it before. */
function expectedLead(url: string): Lead {
  return {
    source: "instant-estimate",
    firstName: "RoofGo",
    lastName: "Test Lead",
    email: "sean+leadtest@roofgo.com",
    phone: "6015550123",
    address: "1 Test St, Hattiesburg, MS 39401, USA",
    city: "Hattiesburg",
    state: "MS",
    postal: "39401",
    service: "Website Instant Estimate $14,100",
    squareFootage: "28.4 squares",
    roofType: "architectural",
    preference: "1 story",
    page: "/instant-estimate",
    message: [
      "Instant estimate: $14,100 for 28.4 squares.",
      "Address: 1 Test St, Hattiesburg, MS 39401, USA",
      `Estimate link: ${url}`,
    ].join("\n"),
  };
}

test("success: homeowner email, lead email/Zapier and RoofGo all get the same link", async () => {
  const t = deps(async () => ({ ok: true, status: 201 }));
  const out = await recordInstantEstimate(input, t.deps);
  assert.match(
    out.url!,
    /^https:\/\/southeastroofing\.llc\/estimate\/[A-Za-z0-9_-]{32}$/,
  );
  assert.equal(t.emails.length, 1);
  assert.equal(t.emails[0].url, out.url);
  assert.deepEqual(t.leads, [expectedLead(out.url!)]);
  assert.equal(t.saved.length, 1);
  const s = t.saved[0];
  assert.equal(
    out.url,
    `https://southeastroofing.llc/estimate/${s.publicToken}`,
  );
  assert.equal(s.name, "RoofGo Test Lead");
  assert.equal(s.priceShown, 14100);
  assert.equal(s.squares, 28.4);
  assert.equal(s.createdAt, "2026-10-15T14:03:00.000Z");
  assert.equal(s.emailedTo, "sean+leadtest@roofgo.com");
  assert.equal(out.roofgo?.ok, true);
});

test("RoofGo down: the price, the homeowner email and the lead email/Zapier are unchanged", async () => {
  const t = deps(async () => {
    throw new Error("RoofGo is down");
  });
  const out = await recordInstantEstimate(input, t.deps);
  assert.ok(out.url);
  assert.equal(t.emails.length, 1);
  assert.deepEqual(t.leads, [expectedLead(out.url!)]);
  assert.equal(out.roofgo?.ok, false);
});

test("RoofGo slow: the lead email/Zapier does not wait for it", async () => {
  let release!: () => void;
  const t = deps(
    () =>
      new Promise((resolve) => {
        release = () => resolve({ ok: true, status: 201 });
      }),
  );
  const pending = recordInstantEstimate(input, t.deps);
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(
    t.leads.length,
    1,
    "lead delivered while RoofGo is still pending",
  );
  release();
  await pending;
});

test("could not measure: no link, no RoofGo copy, the lead still goes out as before", async () => {
  const t = deps(async () => ({ ok: true, status: 201 }));
  const out = await recordInstantEstimate(
    { ...input, measured: null, price: null, monthly: null },
    t.deps,
  );
  assert.equal(out.url, null);
  assert.equal(t.saved.length, 0);
  assert.equal(t.emails.length, 0);
  assert.equal(
    t.leads[0].service,
    "Website Instant Estimate (could not measure, needs a visit)",
  );
  assert.equal(
    t.leads[0].message,
    "Could not measure from imagery (usually tree cover). Needs a site visit.\nAddress: 1 Test St, Hattiesburg, MS 39401, USA",
  );
});

test("homeowner email failing does not stop the lead or RoofGo", async () => {
  const t = deps(async () => ({ ok: true, status: 201 }));
  t.deps.emailEstimate = async () => {
    throw new Error("Resend down");
  };
  const out = await recordInstantEstimate(input, t.deps);
  assert.equal(t.leads.length, 1);
  assert.equal(t.saved.length, 1);
  assert.equal(t.saved[0].emailedTo, null);
  assert.ok(out.url);
});
