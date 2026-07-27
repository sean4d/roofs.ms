#!/usr/bin/env python3
"""
Copy the generated hot-spot anchors into src/config/roof-anatomy.ts.

Run after docs/roof-house-geometry.py:

    python3 docs/roof-house-geometry.py && python3 docs/sync-roof-anchors.py

The geometry script emits anchors.json next to itself; this rewrites every
`hotspot:` line in the config to match. Transcribing those numbers by hand is
how pins silently drift off the parts they label after a geometry change, so
don't — run this instead. It fails loudly if a key is missing on either side.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
ANCHORS = pathlib.Path(__file__).resolve().parent / "anchors.json"
CONFIG = ROOT / "src" / "config" / "roof-anatomy.ts"

if not ANCHORS.exists():
    sys.exit(f"missing {ANCHORS} — run docs/roof-house-geometry.py first")

data = json.loads(ANCHORS.read_text())
wanted = {**data["parts"], **data["flashing"]}
src = CONFIG.read_text()

seen = set()
out, current = [], None
for line in src.split("\n"):
    m = re.match(r'    key: "([a-z-]+)",', line)
    if m:
        current = m.group(1)
        out.append(line)
        continue
    if current and line.startswith("    hotspot:"):
        if current not in wanted:
            sys.exit(f"config key {current!r} has no anchor in anchors.json")
        a = wanted[current]
        out.append(f"    hotspot: {{ x: {a['x']}, y: {a['y']} }},")
        seen.add(current)
        current = None
        continue
    out.append(line)

missing = set(wanted) - seen
if missing:
    sys.exit(f"anchors with no matching config entry: {sorted(missing)}")

CONFIG.write_text("\n".join(out))
vb = data["viewBox"]
print(f"synced {len(seen)} hot spots  (viewBox {vb['width']}x{vb['height']})")
