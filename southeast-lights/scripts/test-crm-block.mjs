/**
 * The CRM block must have the same shape for every lead.
 *
 *   node --experimental-strip-types --no-warnings scripts/test-crm-block.mjs
 *
 * Zapier's Email Parser learns where each field sits from one training email
 * and then reads every later email by position. If a lead missing an optional
 * field prints one line fewer, every field below it shifts up and Roofr gets
 * the wrong value in the wrong box, or rejects the job card outright. That is
 * the bug that cost real leads on 2026-08-30.
 *
 * So: same labels, same order, same count, every time. If you add a field to
 * the block, append it at the end, update LABELS here, and retrain the parser
 * template in Zapier.
 */
import { plainTextBody } from "../src/lib/leads/deliver.ts";

const LABELS = [
  "First name",
  "Last name",
  "Phone",
  "Email",
  "Street",
  "City",
  "State",
  "ZIP",
  "Country",
];

/** Pull the CRM FIELDS block out of a rendered email body. */
function crmBlock(body) {
  const lines = body.split("\n");
  const start = lines.indexOf("CRM FIELDS");
  if (start === -1) return null;
  // One blank line after the heading, then the fields, then a blank line.
  const out = [];
  for (let i = start + 2; i < lines.length; i++) {
    if (lines[i] === "") break;
    out.push(lines[i]);
  }
  return out;
}

const base = {
  kind: "residential",
  firstName: "Elizabeth",
  lastName: "Landry",
  email: "e@example.com",
  phone: "6015550142",
  address: "412 Hardy St",
  city: "Hattiesburg",
  state: "MS",
  postal: "39401",
  services: ["Roofline"],
  projectCategories: [],
  attribution: {},
};

const cases = [
  ["full residential lead", base],
  ["no budget, no notes", { ...base, budget: undefined, notes: undefined }],
  [
    "single-word surname",
    { ...base, firstName: "Cher", lastName: "Sarkisian" },
  ],
  ["no estimate attached", { ...base, estimate: undefined }],
  [
    "full commercial lead",
    {
      ...base,
      kind: "commercial",
      organization: "Canebrake HOA",
      propertyType: "HOA / community",
      communityName: "Canebrake",
      buildingCount: "3",
      projectCategories: ["Entrance"],
    },
  ],
  [
    "commercial with every optional blank",
    {
      ...base,
      kind: "commercial",
      organization: "Canebrake HOA",
      propertyType: "HOA / community",
      communityName: undefined,
      buildingCount: undefined,
      desiredCompletion: undefined,
      electrical: undefined,
      siteAccess: undefined,
      notes: undefined,
      projectCategories: [],
    },
  ],
  [
    "notes containing a fake field line",
    { ...base, notes: "City: Nowhere\nZIP: 00000\nplease ignore" },
  ],
];

let failed = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "  ok  " : "FAIL  "}${name}${ok ? "" : `  ${detail}`}`);
};

for (const [name, lead] of cases) {
  const block = crmBlock(plainTextBody(lead));
  if (!block) {
    check(name, false, "no CRM FIELDS block found");
    continue;
  }
  const labels = block.map((line) => line.slice(0, line.indexOf(":")));
  check(
    `${name}: ${LABELS.length} lines in order`,
    labels.length === LABELS.length && labels.every((l, i) => l === LABELS[i]),
    `got [${labels.join(", ")}]`,
  );
}

// The notes case is the one that would quietly poison the parser: free text a
// customer typed must sit below the block, never inside it.
const poisoned = plainTextBody({
  ...base,
  notes: "City: Nowhere\nZIP: 00000",
});
check(
  "customer notes land after the CRM block",
  poisoned.indexOf("CRM FIELDS") < poisoned.indexOf("NOTES"),
  "notes appeared before or inside the block",
);

/*
 * The load-bearing test.
 *
 * A field that prints only when it has a value looks harmless while every
 * lead happens to have one, and breaks the day a lead does not. So blank each
 * field in turn and insist the block is still seven labels in the same order.
 * This is the check that fails if anyone puts `add` back.
 */
for (const blank of ["address", "city", "state", "postal"]) {
  for (const value of ["", "   ", undefined]) {
    const block = crmBlock(plainTextBody({ ...base, [blank]: value }));
    const labels = block?.map((line) => line.slice(0, line.indexOf(":"))) ?? [];
    check(
      `${blank} = ${value === undefined ? "undefined" : JSON.stringify(value)}: block keeps its shape`,
      labels.length === LABELS.length &&
        labels.every((l, i) => l === LABELS[i]),
      `got [${labels.join(", ")}]`,
    );
  }
}

// And every label still ends in a colon with nothing after it, rather than
// the label vanishing along with the value.
const allBlank = crmBlock(
  plainTextBody({ ...base, address: "", city: "", state: "", postal: "" }),
);
check(
  "a lead with no address at all still prints every label",
  allBlank.length === LABELS.length,
  `got [${allBlank.join(" | ")}]`,
);

console.log(failed ? `\n${failed} FAILED` : `\nall checks pass`);
process.exit(failed ? 1 : 0);
