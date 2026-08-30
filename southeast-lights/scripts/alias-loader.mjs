/**
 * Make the app's own modules importable by a plain `node` test script.
 *
 * Three small gaps between what Next resolves and what bare node resolves:
 *
 *   1. `@/x` is a tsconfig path alias for `src/x`.
 *   2. TypeScript source omits the file extension; node insists on it.
 *   3. `server-only` is a Next marker package that throws if a client bundle
 *      imports it. A test process is neither, so it stands in as a no-op.
 *
 * Fixing them here means the tests exercise the real modules that ship,
 * rather than a copy that quietly drifts out of step with them.
 */
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = new URL("../src/", import.meta.url);
const NOOP = pathToFileURL(
  fileURLToPath(new URL("./noop-module.mjs", import.meta.url)),
).href;

/** Append `.ts`/`.tsx` when an extensionless specifier names a real file. */
function withExtension(url) {
  if (/\.[a-z]+$/i.test(url.pathname)) return url.href;
  for (const ext of [".ts", ".tsx", "/index.ts"]) {
    const candidate = new URL(url.href + ext);
    if (existsSync(fileURLToPath(candidate))) return candidate.href;
  }
  return url.href;
}

export function resolve(specifier, context, next) {
  if (specifier === "server-only" || specifier === "client-only") {
    return next(NOOP, context);
  }
  if (specifier.startsWith("@/")) {
    return next(withExtension(new URL(specifier.slice(2), SRC)), context);
  }
  if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
    return next(withExtension(new URL(specifier, context.parentURL)), context);
  }
  return next(specifier, context);
}
