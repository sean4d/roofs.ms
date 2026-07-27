"""
Generate the isometric roof-anatomy house as SVG.

Axonometric projection with explicit axis vectors so the view angle is
controllable (a true 30-degree isometric tilts the ridge too steeply to read):

    screen = X*UX + Z*UZ + Y*UY
    UX = ( 1.00, -0.30)   +X -> right, slightly up   (house length)
    UZ = ( 0.66,  0.38)   +Z -> right, down          (depth, toward viewer)
    UY = ( 0.00, -1.00)   +Y -> up

Camera therefore sits above, to the left, and in front: the visible faces are
the front wall (+Z), the left gable end (-X), and the front roof plane.
Faces are emitted back-to-front (painter's algorithm).
"""
import math

UX = (1.00, -0.26)
UZ = (0.60, 0.30)
UY = (0.00, -1.00)

# ---------------------------------------------------------------- model
H = 3.7                     # wall height
W = 11.0                    # main wing length  (X)
D = 5.2                     # main wing depth   (Z)
RZ = D / 2                  # ridge sits at mid-depth
RY = H + 3.0                # ridge height
OH = 0.40                   # eave overhang
SLOPE = (RY - H) / (D - RZ)  # rise per unit Z, front plane

# cross gable (projects toward viewer from the main front slope)
GX0, GX1 = 6.5, 10.0
GRX = (GX0 + GX1) / 2
GRY = H + 1.8
GZ1 = 9.6                                     # front (with overhang)
GZ0 = RZ + (RY - GRY) / SLOPE                 # where its ridge dies into the main roof

CHX0, CHX1 = 4.1, 5.05      # chimney footprint
CHZ0, CHZ1 = 3.15, 4.10
CH_TOP = 7.4

VPX, VPZ = 3.15, 4.5        # plumbing vent pipe

_all = []


def P(x, y, z):
    sx = x * UX[0] + z * UZ[0] + y * UY[0]
    sy = x * UX[1] + z * UZ[1] + y * UY[1]
    _all.append((sx, sy))
    return (sx, sy)


def roof_y(z):
    """Height of the main front roof plane at depth z."""
    return RY - (z - RZ) * SLOPE


# ---- main wing -------------------------------------------------------
ridge_l = P(-OH, RY, RZ)
ridge_r = P(W + OH, RY, RZ)
eave_l = P(-OH, H - OH * SLOPE, D + OH)
eave_r = P(W + OH, H - OH * SLOPE, D + OH)

wall_fbl = P(0, 0, D)
wall_fbr = P(W, 0, D)
wall_ftr = P(W, H, D)
wall_ftl = P(0, H, D)

gable_bb = P(0, 0, 0)
gable_bt = P(0, H, 0)
gable_apex = P(0, RY, RZ)

back_eave_l = P(-OH, H - OH * SLOPE, -OH)
back_eave_r = P(W + OH, H - OH * SLOPE, -OH)

soffit_ol = P(-OH, H - OH * SLOPE, D + OH)
soffit_or = P(W + OH, H - OH * SLOPE, D + OH)

# ---- cutaway layer stack (left end of the main front plane) ----------
CUT_X0, CUT_X1 = -OH, 2.45
LAYERS = []
for name, lift in [("decking", 0.00), ("underlayment", 0.17),
                   ("ice-water-shield", 0.34), ("starter-shingles", 0.51)]:
    znear = D + OH - lift * 1.5
    quad = (
        P(CUT_X0, RY + lift, RZ),
        P(CUT_X1, RY + lift, RZ),
        P(CUT_X1, roof_y(znear) + lift, znear),
        P(CUT_X0, roof_y(znear) + lift, znear),
    )
    LAYERS.append((name, quad))

# ---- chimney ---------------------------------------------------------
ch = {}
for k, (x, z) in {"fl": (CHX0, CHZ1), "fr": (CHX1, CHZ1),
                  "bl": (CHX0, CHZ0), "br": (CHX1, CHZ0)}.items():
    ch[k + "t"] = P(x, CH_TOP, z)
    ch[k + "b"] = P(x, roof_y(z) if z > RZ else RY - (RZ - z) * SLOPE, z)

# ---- cross gable -----------------------------------------------------
g_ridge_b = P(GRX, GRY, GZ0)
g_ridge_f = P(GRX, GRY, GZ1)
g_eave_lf = P(GX0, H, GZ1)
g_eave_lm = P(GX0, H, D)          # left eave meets the main eave line
g_eave_rf = P(GX1, H, GZ1)
g_eave_rm = P(GX1, H, D)
g_wall_bl = P(GX0, 0, GZ1)
g_wall_br = P(GX1, 0, GZ1)
g_wall_lm_t = P(GX0, H, D)
g_wall_lm_b = P(GX0, 0, D)

# ---- vent pipe -------------------------------------------------------
vp_b = P(VPX, roof_y(VPZ), VPZ)
vp_t = P(VPX, roof_y(VPZ) + 0.65, VPZ)

# ---------------------------------------------------------------- fit
xs = [p[0] for p in _all]
ys = [p[1] for p in _all]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
VW, VH = 960.0, 600.0
PAD = 54.0
scale = min((VW - 2 * PAD) / (maxx - minx), (VH - 2 * PAD) / (maxy - miny))
offx = PAD - minx * scale + (VW - 2 * PAD - (maxx - minx) * scale) / 2
offy = PAD - miny * scale + (VH - 2 * PAD - (maxy - miny) * scale) / 2


def T(p):
    return (p[0] * scale + offx, p[1] * scale + offy)


def pts(*ps):
    return " ".join(f"{T(p)[0]:.1f},{T(p)[1]:.1f}" for p in ps)


def xy(p):
    q = T(p)
    return (round(q[0]), round(q[1]))


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


# ---------------------------------------------------------------- style
SHINGLE = "#8d9aa8"
SHINGLE_D = "#6c7986"
SHINGLE_L = "#a7b3bf"
WALL = "#ffffff"
WALL_S = "#e8edf3"
WALL_S2 = "#d5dde6"
LINE = "#46525e"
ACCENT = "#c9702e"
DECK = "#c9a679"
UNDER = "#4f7ea8"
IWS = "#12304d"

o = []
A = o.append
A(f'<svg viewBox="0 0 {VW:.0f} {VH:.0f}" xmlns="http://www.w3.org/2000/svg">')
A('<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">'
  '<stop offset="0%" stop-color="#f8fbfd"/><stop offset="100%" stop-color="#e9f0f7"/>'
  '</linearGradient></defs>')
A(f'<rect width="{VW:.0f}" height="{VH:.0f}" rx="24" fill="url(#skyG)"/>')

# ground shadow
sc = T(lerp(wall_fbl, wall_fbr, 0.5))
A(f'<ellipse cx="{sc[0]:.0f}" cy="{sc[1] + 14:.0f}" rx="{scale * 8.4:.0f}" '
  f'ry="{scale * 1.35:.0f}" fill="#0d2c4b" opacity="0.07"/>')

# ---- back roof plane (mostly hidden; caps the gable so it isn't an open wall)
A(f'<polygon points="{pts(ridge_l, ridge_r, back_eave_r, back_eave_l)}" '
  f'fill="{SHINGLE_D}" stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')

# ---- left gable end wall
A(f'<polygon points="{pts(gable_bb, wall_fbl, wall_ftl, gable_apex, gable_bt)}" '
  f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')

# ---- front wall + siding
A(f'<polygon points="{pts(wall_fbl, wall_fbr, wall_ftr, wall_ftl)}" '
  f'fill="{WALL}" stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
for i in range(1, 7):
    t = i / 7
    A(f'<line x1="{T(lerp(wall_ftl, wall_fbl, t))[0]:.1f}" '
      f'y1="{T(lerp(wall_ftl, wall_fbl, t))[1]:.1f}" '
      f'x2="{T(lerp(wall_ftr, wall_fbr, t))[0]:.1f}" '
      f'y2="{T(lerp(wall_ftr, wall_fbr, t))[1]:.1f}" '
      f'stroke="{WALL_S2}" stroke-width="1.1"/>')

# ---- windows on the front wall
for wx in (1.5, 3.3, 5.1):
    a = P(wx, H - 0.85, D); b = P(wx + 1.0, H - 0.85, D)
    c = P(wx + 1.0, H - 2.15, D); d = P(wx, H - 2.15, D)
    A(f'<polygon points="{pts(a, b, c, d)}" fill="#cfe0ee" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round"/>')

# ---- soffit + fascia (underside of the overhang)
A('<g id="part-soffit-fascia">')
A(f'<polygon points="{pts(soffit_ol, soffit_or, wall_ftr, wall_ftl)}" '
  f'fill="{WALL_S2}" stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
A('</g>')

# ---- main roof front plane
A('<g id="part-field-shingles">')
A(f'<polygon points="{pts(ridge_l, ridge_r, eave_r, eave_l)}" '
  f'fill="{SHINGLE}" stroke="{LINE}" stroke-width="1.9" stroke-linejoin="round"/>')
A('</g>')
for i in range(1, 9):
    t = i / 9
    A(f'<line x1="{T(lerp(ridge_l, eave_l, t))[0]:.1f}" '
      f'y1="{T(lerp(ridge_l, eave_l, t))[1]:.1f}" '
      f'x2="{T(lerp(ridge_r, eave_r, t))[0]:.1f}" '
      f'y2="{T(lerp(ridge_r, eave_r, t))[1]:.1f}" '
      f'stroke="{SHINGLE_D}" stroke-width="1" opacity="0.5"/>')

# ---- cutaway layers
STYLE = {"decking": (DECK, "#a8874f"), "underlayment": (UNDER, "#3d6688"),
         "ice-water-shield": (IWS, "#08203a"), "starter-shingles": (SHINGLE_L, SHINGLE_D)}
for name, quad in LAYERS:
    f, s = STYLE[name]
    A(f'<g id="part-{name}"><polygon points="{pts(*quad)}" fill="{f}" stroke="{s}" '
      f'stroke-width="1.7" stroke-linejoin="round"/></g>')

# ---- vent pipe + boot
A('<g id="part-pipe-boots">')
A(f'<ellipse cx="{T(vp_b)[0]:.1f}" cy="{T(vp_b)[1]:.1f}" rx="{scale * 0.40:.1f}" '
  f'ry="{scale * 0.17:.1f}" fill="{ACCENT}" stroke="{LINE}" stroke-width="1.4"/>')
A(f'<line x1="{T(vp_b)[0]:.1f}" y1="{T(vp_b)[1]:.1f}" x2="{T(vp_t)[0]:.1f}" '
  f'y2="{T(vp_t)[1]:.1f}" stroke="{IWS}" stroke-width="7" stroke-linecap="round"/>')
A('</g>')

# ---- chimney + flashing
A('<g id="part-flashing">')
A(f'<polygon points="{pts(ch["flt"], ch["frt"], ch["frb"], ch["flb"])}" fill="{WALL}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["blb"], ch["flb"])}" fill="{WALL_S2}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["brt"], ch["frt"])}" fill="{WALL_S}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polyline points="{pts(ch["blb"], ch["flb"], ch["frb"])}" fill="none" stroke="{ACCENT}" '
  f'stroke-width="6.5" stroke-linejoin="round" stroke-linecap="round"/>')
A('</g>')

# ---- drip edge + gutter along the front eave
A('<g id="part-drip-edge">')
A(f'<polyline points="{pts(eave_l, eave_r)}" fill="none" stroke="{ACCENT}" '
  f'stroke-width="6" stroke-linecap="round"/></g>')
gl = (eave_l[0], eave_l[1] + 0.30)
gr = (eave_r[0], eave_r[1] + 0.30)
A('<g id="part-gutters">')
A(f'<polygon points="{pts(eave_l, eave_r, gr, gl)}" fill="#f4f7fa" stroke="{LINE}" '
  f'stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polyline points="{pts(gl, gr)}" fill="none" stroke="{LINE}" stroke-width="2.2" '
  f'stroke-linecap="round" opacity="0.75"/></g>')

# ---- ridge vent band + ridge cap
rv_l = (ridge_l[0], ridge_l[1] + 0.13)
rv_r = (ridge_r[0], ridge_r[1] + 0.13)
A('<g id="part-ridge-vent">')
A(f'<polygon points="{pts(ridge_l, ridge_r, rv_r, rv_l)}" fill="{SHINGLE_D}" '
  f'stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/></g>')
A('<g id="part-ridge-cap">')
A(f'<polyline points="{pts(ridge_l, ridge_r)}" fill="none" stroke="{IWS}" '
  f'stroke-width="7.5" stroke-linecap="round"/></g>')

# ---- cross gable: end wall, left roof plane (with valley), right plane
A(f'<polygon points="{pts(g_wall_lm_t, g_eave_lf, g_wall_bl, g_wall_lm_b)}" '
  f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(g_ridge_f, g_eave_rf, g_wall_br, g_wall_bl, g_eave_lf)}" '
  f'fill="{WALL}" stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
_d0 = P(GX0 + 1.3, H - 2.6, GZ1); _d1 = P(GX0 + 2.3, H - 2.6, GZ1)
_d2 = P(GX0 + 2.3, 0, GZ1); _d3 = P(GX0 + 1.3, 0, GZ1)
A(f'<polygon points="{pts(_d0, _d1, _d2, _d3)}" fill="{IWS}" stroke="{LINE}" '
  f'stroke-width="1.4" stroke-linejoin="round" opacity="0.55"/>')
A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_rf, g_eave_rm)}" '
  f'fill="{SHINGLE}" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>')
A('<g id="part-valleys">')
A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_lf, g_eave_lm)}" '
  f'fill="{SHINGLE_L}" stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>')
A(f'<polyline points="{pts(g_ridge_b, g_eave_lm)}" fill="none" stroke="{ACCENT}" '
  f'stroke-width="7" stroke-linecap="round"/>')
A('</g>')
A(f'<polyline points="{pts(g_ridge_b, g_ridge_f)}" fill="none" stroke="{IWS}" '
  f'stroke-width="6" stroke-linecap="round"/>')

A('</svg>')

svg = "\n".join(o)
base = "/tmp/claude-0/-home-user-roofs-ms/85ddd989-1cdb-5fc8-835b-83db0edcad02/scratchpad/"
open(base + "house.svg", "w").write(svg)

anchors = {
    # Spread deliberately: pins sit on their own component but are nudged
    # apart so no two halos collide at rendered size.
    "ridge-cap": xy(lerp(ridge_l, ridge_r, 0.82)),
    "ridge-vent": xy(lerp(ridge_l, ridge_r, 0.30)),
    "field-shingles": xy(lerp(lerp(ridge_l, ridge_r, 0.71), lerp(eave_l, eave_r, 0.71), 0.26)),
    # the four cutaway layers stagger along their own near edge
    "starter-shingles": xy(lerp(LAYERS[3][1][2], LAYERS[3][1][3], 0.92)),
    "ice-water-shield": xy(lerp(LAYERS[2][1][2], LAYERS[2][1][3], 0.63)),
    "underlayment": xy(lerp(LAYERS[1][1][2], LAYERS[1][1][3], 0.34)),
    "decking": xy(lerp(LAYERS[0][1][2], LAYERS[0][1][3], 0.05)),
    "drip-edge": xy(lerp(eave_l, eave_r, 0.42)),
    "flashing": xy(ch["flt"]),
    "valleys": xy(lerp(g_ridge_b, g_eave_lm, 0.62)),
    "pipe-boots": xy(vp_t),
    "gutters": xy(lerp(gl, gr, 0.55)),
    "soffit-fascia": xy(lerp(lerp(soffit_ol, soffit_or, 0.67), lerp(wall_ftl, wall_ftr, 0.67), 0.5)),
}
print(f"VIEWBOX {VW:.0f} {VH:.0f}")
for k, v in anchors.items():
    print(f'  "{k}": {{ x: {v[0]}, y: {v[1]} }},')

# ------------------------------------------------------------------ TSX
import re as _re

body = svg
body = body[body.index(">", body.index("<svg")) + 1:body.rindex("</svg>")]

# SVG attribute names -> JSX camelCase
for a, b in [("stroke-width", "strokeWidth"), ("stroke-linejoin", "strokeLinejoin"),
             ("stroke-linecap", "strokeLinecap"), ("stop-color", "stopColor"),
             ("fill-opacity", "fillOpacity"), ("stroke-opacity", "strokeOpacity")]:
    body = body.replace(a + "=", b + "=")

# <g id="part-KEY"> -> <g {...part("KEY")}>
body = _re.sub(r'<g id="part-([a-z-]+)">', lambda m: '<g {...part("%s")}>' % m.group(1), body)

# self-close voids
body = _re.sub(r'(<(?:rect|line|polygon|polyline|ellipse|circle|stop)\b[^>]*?)(?<!/)>',
               r'\1 />', body)

indent = "\n".join("      " + l for l in body.strip().split("\n"))

tsx = '''"use client";

/**
 * Isometric roof illustration for the Anatomy of a Roof diagram.
 *
 * GENERATED — the geometry comes from an axonometric projection of a 3D house
 * model (see docs/roof-house-geometry.md). Hand-editing the coordinates will
 * desynchronise them from the hotspot anchors in config/roof-anatomy.ts.
 *
 * Every labelled component is wrapped in a group tagged via `part()`, so the
 * active part is recoloured and lit by CSS rather than by re-rendering paths.
 * CSS beats SVG presentation attributes, which is what lets the highlight
 * override each shape's own fill/stroke.
 */

import { cn } from "@/lib/utils";

export const ROOF_SVG_VIEWBOX = { width: %d, height: %d };

export function RoofHouseSvg({
  activeKey,
  className,
}: {
  activeKey: string;
  className?: string;
}) {
  const part = (key: string) => ({
    "data-part": key,
    className: cn(
      "transition-[filter,opacity] duration-300",
      key === activeKey &&
        "[filter:drop-shadow(0_0_9px_rgba(201,112,46,0.75))] [&_ellipse]:fill-ember-500 [&_line]:stroke-ember-500 [&_polygon]:fill-ember-500 [&_polyline]:stroke-ember-500",
    ),
  });

  return (
    <svg
      viewBox="0 0 %d %d"
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label="Cutaway illustration of a roof showing every component in place"
    >
%s
    </svg>
  );
}
''' % (VW, VH, VW, VH, indent)

open(base + "roof-house-svg.tsx", "w").write(tsx)
print("\nWROTE roof-house-svg.tsx", len(tsx), "bytes")


# collision check: pins render ~34px wide inside a 960-unit viewBox
import itertools as _it
_bad = [(a, b, round(((anchors[a][0]-anchors[b][0])**2 + (anchors[a][1]-anchors[b][1])**2)**0.5))
        for a, b in _it.combinations(anchors, 2)
        if ((anchors[a][0]-anchors[b][0])**2 + (anchors[a][1]-anchors[b][1])**2)**0.5 < 40]
print("\nPIN COLLISIONS (<40 units apart):", _bad or "none")
