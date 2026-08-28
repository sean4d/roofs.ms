<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Reading the owner's messages

Sean's keyboard drops **t, o and y** intermittently. Words arrive with those
letters missing and it looks like gibberish or a typo storm: "buil his u" is
"build this out", "wha culd i charge" is "what could i charge", "esimae" is
"estimate", "nw" is "now", "u" is often "you" or "out".

Read straight through it. Put the missing letters back and answer the question
he actually asked. Do not ask him to retype anything, do not comment on the
typing, and never mirror it back. If a sentence is genuinely ambiguous after
restoring t/o/y, ask about that one specific word, not the message.

# House style

No em dashes anywhere a customer, a homeowner or a search engine will read it:
site copy, blog posts, AI captions, PDFs, proposals, emails. Use a comma, a
full stop, or a colon. `src/lib/no-em-dash.ts` enforces this on generated and
third-party text. Code comments are exempt.
