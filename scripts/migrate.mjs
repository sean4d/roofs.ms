/**
 * Apply src/lib/quotes/schema.sql to the database in DATABASE_URL.
 *
 * Every statement in the schema is idempotent, so this is safe to run again
 * after editing it, and safe to run against a database that is already set up.
 *
 *   DATABASE_URL="postgres://..." node scripts/migrate.mjs
 *
 * Statements are split on semicolons at the end of a line, which is fine for
 * this schema because it contains no functions or DO blocks with inner
 * semicolons. If that ever changes, this splitter has to get smarter.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set.\n\n" +
      "In Vercel: Storage tab, create a Postgres database, and it sets the\n" +
      "variable for you. Then pull it locally with `vercel env pull`, or\n" +
      "paste it inline:\n\n" +
      '  DATABASE_URL="postgres://..." node scripts/migrate.mjs\n',
  );
  process.exit(1);
}

const sql = neon(url);
const file = resolve(process.cwd(), "src/lib/quotes/schema.sql");
const text = readFileSync(file, "utf8");

const statements = text
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s && !/^(--[^\n]*\n?)+$/.test(s));

console.log(`Applying ${statements.length} statements from schema.sql\n`);

let applied = 0;
for (const statement of statements) {
  // First meaningful line, for a readable log.
  const label =
    statement
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("--")) ?? "statement";
  try {
    await sql.query(statement);
    console.log(`  ok    ${label.slice(0, 76)}`);
    applied++;
  } catch (err) {
    console.error(`  FAIL  ${label.slice(0, 76)}`);
    console.error(`        ${err.message}`);
    process.exit(1);
  }
}

const [{ count }] = await sql`
  SELECT count(*)::int AS count
    FROM information_schema.tables
   WHERE table_schema = 'public'
`;
console.log(`\n${applied} statements applied. ${count} tables in public.`);
