# Southeast Lights

Year-round lighting company site for Southeast Lights — holiday C9 rental and
Jellyfish permanent architectural lighting.

Southeast Lights is a registered fictitious name (d/b/a, business ID 1412589)
of **Southeast Roofing LLC**. One legal entity, two trading names. Never
describe it as a subsidiary in copy or in schema.

## Why this lives inside the roofing repo (for now)

This is a standalone Next.js app with its own `package.json`, toolchain and
dependency tree. It is deliberately excluded from the roofing project's
`tsconfig.json`, `eslint.config.mjs` and `.prettierignore` so the two never
interfere.

It is intended to move to its own repository and its own Vercel project
before launch. Nothing here imports from the roofing app, so the move is a
directory copy, not a refactor.

## Commands

Run from this directory:

```
npm install
npm run dev        # http://localhost:3000
npm run build
npm run typecheck
npm run lint
```

## Structure

- `src/config/site.ts` — NAP, credentials, Google profile. Single source of
  truth. Null values are honest `[NEEDS]` gaps; never invent a replacement.
- `src/config/pricing.ts` — every price on the site, plus the quote functions.
- `src/config/season.ts` — the holiday/off-season mode switch.
- `src/config/navigation.ts` — IA, including the division flags that keep
  unbuilt divisions off the site entirely.

## Rules inherited from the roofing codebase

1. Never invent phone numbers, licence numbers, stats or credentials. A null
   value renders an honest placeholder.
2. **No GAF branding anywhere.** It certifies shingle installation and would
   read as a lighting credential it is not.
3. BBB accreditation is filed under "Southeast Roofing LLC" and does not list
   the d/b/a, so it always renders with that attribution.
4. Publish the Mable St address, not the roofing office — that is the NAP
   Google has verified for this profile.
