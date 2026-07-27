"""
Generate BOTH roof illustrations as React components + hot-spot anchors:

  1. The ANATOMY house  -> src/components/roof/roof-house-svg.tsx
  2. The FLASHING house -> src/components/roof/flashing-house-svg.tsx
     (modelled on the Gibraltar Building Products flashing diagram the owner
     supplied: plain roof, prominent centre gable with valleys, chimney,
     shed dormer, door with head trim — each flashing piece in its own
     clearly separated location)

plus docs/anchors.json, which docs/sync-roof-anchors.py copies into
src/config/roof-anatomy.ts. Never transcribe anchor numbers by hand.

Projection (shared): axonometric with explicit axis vectors —

    screen = X*UX + Z*UZ + Y*UY
    UX = ( 1.00, -0.24)   +X -> right, slightly up   (house length)
    UZ = ( 0.60,  0.30)   +Z -> right, down          (depth, toward viewer)
    UY = ( 0.00, -1.00)   +Y -> up

Design rules learned the hard way:
  * Every clickable component must be a distinct, physically-sized shape.
  * Neutral colours everywhere; ember is reserved for the active highlight.
  * Pins must sit BESIDE small parts, never on top of them.
  * Ice & water shield appears in the valleys only — that is where we
    install it, and showing it anywhere else confused real customers.
  * The build fails if any two pins land within MIN_GAP of each other.
"""
import itertools
import json
import math
import pathlib
import re

UX = (1.00, -0.24)
UZ = (0.60, 0.30)
UY = (0.00, -1.00)

MIN_GAP = 42
HERE = pathlib.Path(__file__).resolve().parent


class Scene:
    """Collects projected points so each house can auto-fit its viewBox."""

    def __init__(self, vw, vh, pad=52.0):
        self.vw, self.vh, self.pad = vw, vh, pad
        self.pts = []
        self.scale = self.offx = self.offy = None

    def P(self, x, y, z):
        sx = x * UX[0] + z * UZ[0] + y * UY[0]
        sy = x * UX[1] + z * UZ[1] + y * UY[1]
        self.pts.append((sx, sy))
        return (sx, sy)

    def fit(self):
        xs = [p[0] for p in self.pts]
        ys = [p[1] for p in self.pts]
        minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
        self.scale = min((self.vw - 2 * self.pad) / (maxx - minx),
                         (self.vh - 2 * self.pad) / (maxy - miny))
        self.offx = (self.pad - minx * self.scale
                     + (self.vw - 2 * self.pad - (maxx - minx) * self.scale) / 2)
        self.offy = (self.pad - miny * self.scale
                     + (self.vh - 2 * self.pad - (maxy - miny) * self.scale) / 2)

    def T(self, p):
        return (p[0] * self.scale + self.offx, p[1] * self.scale + self.offy)

    def pts_s(self, *ps):
        return " ".join(f"{self.T(p)[0]:.1f},{self.T(p)[1]:.1f}" for p in ps)

    def xy(self, p, dx=0, dy=0):
        q = self.T(p)
        return (round(q[0] + dx), round(q[1] + dy))


def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def mid(*ps):
    return (sum(p[0] for p in ps) / len(ps), sum(p[1] for p in ps) / len(ps))


# ---------------------------------------------------------------- palette
SHINGLE, SHINGLE_D, SHINGLE_L = "#8d9aa8", "#6c7986", "#a7b3bf"
WALL, WALL_S, WALL_S2 = "#ffffff", "#e8edf3", "#d5dde6"
LINE = "#46525e"
DECK, UNDER, IWS = "#c9a679", "#4f7ea8", "#12304d"
METAL = "#b9c4cf"
STARTER = "#7d8b99"


def collisions(d):
    return [(a, b) for a, b in itertools.combinations(d, 2)
            if math.dist(d[a], d[b]) < MIN_GAP]


# =====================================================================
# HOUSE 1 — THE ANATOMY HOUSE
# =====================================================================
def build_anatomy():
    S = Scene(1040, 620)
    P = S.P

    H, W, D = 3.7, 12.2, 5.6
    RZ, RY, OH = D / 2, H + 2.3, 0.45
    SLOPE = (RY - H) / (D - RZ)

    def roof_y(z):
        return RY - (z - RZ) * SLOPE

    def RP(x, z, lift=0.0):
        return P(x, roof_y(z) + lift, z)

    CUT_X0, CUT_X1 = -OH, 3.2
    VPX, VPZ = 4.0, 4.55
    CHX0, CHX1 = 4.6, 5.7
    CHZ0, CHZ1 = 3.4, 4.2
    CH_TOP = 7.7
    GX0, GX1 = 9.6, 12.4
    GRX, GRY, GZ1 = (GX0 + GX1) / 2, H + 1.5, 10.4
    GZ0 = RZ + (RY - GRY) / SLOPE

    # main wing
    ridge_l, ridge_r = RP(-OH, RZ), RP(W + OH, RZ)
    eave_l, eave_r = RP(-OH, D + OH), RP(W + OH, D + OH)
    eave_g = RP(GX0 - 0.05, D + OH)   # where the cross gable interrupts the eave
    back_eave_l, back_eave_r = P(-OH, roof_y(D + OH), -OH), P(W + OH, roof_y(D + OH), -OH)
    wall_fbl, wall_fbr = P(0, 0, D), P(W, 0, D)
    wall_ftl, wall_ftr = P(0, H, D), P(W, H, D)
    gable_bb, gable_bt, gable_apex = P(0, 0, 0), P(0, H, 0), P(0, RY, RZ)

    # eave assembly
    FD = 0.55
    fascia_bl = P(-OH, roof_y(D + OH) - FD, D + OH)
    fascia_br = P(W + OH, roof_y(D + OH) - FD, D + OH)
    soffit_il, soffit_ir = P(0, H - FD, D), P(W, H - FD, D)
    GH, GO = 0.34, 0.20
    GXS = 5.4                     # gutter run: right stretch of the eave only
    gut_tl, gut_tr = RP(GXS, D + OH), RP(GX0 - 0.05, D + OH)
    gut_ol = P(GXS, roof_y(D + OH) - 0.10, D + OH + GO)
    gut_or = P(GX0 - 0.05, roof_y(D + OH) - 0.10, D + OH + GO)
    gut_bl = P(GXS, roof_y(D + OH) - 0.10 - GH, D + OH + GO)
    gut_br = P(GX0 - 0.05, roof_y(D + OH) - 0.10 - GH, D + OH + GO)
    ds0 = P(GXS + 0.25, roof_y(D + OH) - 0.10 - GH, D + OH + GO)
    ds1 = P(GXS + 0.67, roof_y(D + OH) - 0.10 - GH, D + OH + GO)
    ds2 = P(GXS + 0.67, 0.15, D + OH + GO)
    ds3 = P(GXS + 0.25, 0.15, D + OH + GO)

    # stepped cutaway — decking, underlayment, shingles. Ice & water is NOT a
    # cutaway layer: it lives in the valleys, which is where we install it.
    names = ["decking", "underlayment", "field-shingles"]
    span = (CUT_X1 - CUT_X0) / 3
    cols = []
    for i, nm in enumerate(names):
        x0, x1 = CUT_X0 + i * span, CUT_X0 + (i + 1) * span
        lift = i * 0.17
        cols.append((nm,
                     (RP(x0, RZ, lift), RP(x1, RZ, lift),
                      RP(x1, D + OH, lift), RP(x0, D + OH, lift)),
                     (RP(x0, RZ, lift), RP(x0, D + OH, lift),
                      RP(x0, D + OH, lift - 0.17), RP(x0, RZ, lift - 0.17))))

    # starter band: eave + left rake, STOPPING at the cross gable so it never
    # runs into the valley
    SW = 0.62
    st_eave = (RP(-OH, D + OH), RP(GX0 - 0.05, D + OH),
               RP(GX0 - 0.05, D + OH - SW), RP(-OH, D + OH - SW))
    st_rake = (RP(-OH, RZ), RP(-OH, D + OH),
               RP(-OH + SW, D + OH), RP(-OH + SW, RZ))

    # ridge assembly: bold cap band with a visible vent slot beneath it
    cap = (RP(-OH, RZ, 0.16), RP(W + OH, RZ, 0.16),
           RP(W + OH, RZ - 0.34), RP(-OH, RZ - 0.34))
    vent = (RP(0.6, RZ - 0.34), RP(W - 0.6, RZ - 0.34),
            RP(W - 0.6, RZ - 0.62), RP(0.6, RZ - 0.62))

    # chimney + cricket (cricket is scenery here; its pin lives on the
    # flashing house)
    ch = {}
    for k, (x, z) in {"fl": (CHX0, CHZ1), "fr": (CHX1, CHZ1),
                      "bl": (CHX0, CHZ0), "br": (CHX1, CHZ0)}.items():
        ch[k + "t"] = P(x, CH_TOP, z)
        ch[k + "b"] = P(x, roof_y(z), z)
    cr_apex = RP((CHX0 + CHX1) / 2, CHZ0 - 0.9, 0.42)
    cr_l, cr_r = RP(CHX0, CHZ0), RP(CHX1, CHZ0)

    # cross gable + valley
    g_ridge_b, g_ridge_f = P(GRX, GRY, GZ0), P(GRX, GRY, GZ1)
    g_eave_lf, g_eave_lm = P(GX0, H, GZ1), P(GX0, H, D)
    g_eave_rf = P(GX1, H, GZ1)
    g_wall_bl, g_wall_br = P(GX0, 0, GZ1), P(GX1, 0, GZ1)
    g_wall_lm_t, g_wall_lm_b = P(GX0, H, D), P(GX0, 0, D)
    VB = 0.5
    val = (P(GRX - VB, roof_y(GZ0) + 0.02, GZ0), P(GRX + VB, roof_y(GZ0) + 0.02, GZ0),
           P(GX0 + VB, H + 0.02, D), P(GX0 - VB, H + 0.02, D))

    # vent pipe + boot
    vp_b, vp_t = RP(VPX, VPZ), RP(VPX, VPZ, 0.85)
    boot = (RP(VPX - 0.5, VPZ - 0.34), RP(VPX + 0.5, VPZ - 0.34),
            RP(VPX + 0.5, VPZ + 0.34), RP(VPX - 0.5, VPZ + 0.34))

    # window (scenery)
    w0, w1 = P(1.4, H - 0.9, D), P(2.6, H - 0.9, D)
    w2, w3 = P(2.6, H - 2.3, D), P(1.4, H - 2.3, D)

    S.fit()
    T, pts, xy = S.T, S.pts_s, S.xy
    sc = S.scale

    o = []
    A = o.append
    A('<defs><linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1">'
      '<stop offset="0%" stop-color="#f8fbfd"/><stop offset="100%" stop-color="#e9f0f7"/>'
      '</linearGradient></defs>')
    A(f'<rect width="{S.vw:.0f}" height="{S.vh:.0f}" rx="24" fill="url(#skyA)"/>')
    g = T(mid(wall_fbl, wall_fbr))
    A(f'<ellipse cx="{g[0]:.0f}" cy="{g[1] + 16:.0f}" rx="{sc * 9.2:.0f}" '
      f'ry="{sc * 1.4:.0f}" fill="#0d2c4b" opacity="0.07"/>')

    # back plane, walls, window
    A(f'<polygon points="{pts(ridge_l, ridge_r, back_eave_r, back_eave_l)}" '
      f'fill="{SHINGLE_D}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(gable_bb, wall_fbl, wall_ftl, gable_apex, gable_bt)}" '
      f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(wall_fbl, wall_fbr, wall_ftr, wall_ftl)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    for i in range(1, 7):
        t = i / 7
        a, b = lerp(wall_ftl, wall_fbl, t), lerp(wall_ftr, wall_fbr, t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="{WALL_S2}" stroke-width="1.1"/>')
    A(f'<polygon points="{pts(w0, w1, w2, w3)}" fill="#cfe0ee" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round"/>')

    # soffit + fascia, gutter + downspout
    A('<g id="part-soffit-fascia">')
    A(f'<polygon points="{pts(fascia_bl, fascia_br, soffit_ir, soffit_il)}" '
      f'fill="{WALL_S2}" stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(eave_l, eave_r, fascia_br, fascia_bl)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A('</g>')
    A('<g id="part-gutters">')
    A(f'<polygon points="{pts(gut_tl, gut_tr, gut_or, gut_ol)}" fill="{METAL}" '
      f'stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(gut_ol, gut_or, gut_br, gut_bl)}" fill="#e6ecf2" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ds0, ds1, ds2, ds3)}" fill="#e6ecf2" '
      f'stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')
    A('</g>')

    # main roof + courses
    A('<g id="part-field-shingles">')
    A(f'<polygon points="{pts(ridge_l, ridge_r, eave_r, eave_l)}" fill="{SHINGLE}" '
      f'stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/></g>')
    for i in range(1, 9):
        t = i / 9
        a, b = lerp(ridge_l, eave_l, t), lerp(ridge_r, eave_r, t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="{SHINGLE_D}" stroke-width="1" opacity="0.45"/>')

    # cutaway
    STY = {"decking": (DECK, "#a8874f"), "underlayment": (UNDER, "#3d6688"),
           "field-shingles": (SHINGLE_L, SHINGLE_D)}
    for nm, quad, step in cols:
        f, s = STY[nm]
        A(f'<g id="part-{nm}">')
        A(f'<polygon points="{pts(*step)}" fill="{s}" stroke="{s}" stroke-width="1.2"/>')
        A(f'<polygon points="{pts(*quad)}" fill="{f}" stroke="{s}" stroke-width="1.6" '
          f'stroke-linejoin="round"/>')
        A('</g>')

    # starter + drip edge (both clipped at the cross gable)
    A('<g id="part-starter-shingles">')
    A(f'<polygon points="{pts(*st_eave)}" fill="{STARTER}" stroke="{LINE}" '
      f'stroke-width="1.3" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(*st_rake)}" fill="{STARTER}" stroke="{LINE}" '
      f'stroke-width="1.3" stroke-linejoin="round"/>')
    A('</g>')
    A('<g id="part-drip-edge">')
    A(f'<polyline points="{pts(ridge_l, eave_l, eave_g)}" fill="none" stroke="{METAL}" '
      f'stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>')
    A(f'<polyline points="{pts(ridge_l, eave_l, eave_g)}" fill="none" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>')
    A('</g>')

    # vent pipe + boot
    A('<g id="part-pipe-boots">')
    A(f'<polygon points="{pts(*boot)}" fill="{METAL}" stroke="{LINE}" stroke-width="1.5" '
      f'stroke-linejoin="round"/>')
    A(f'<ellipse cx="{T(vp_b)[0]:.1f}" cy="{T(vp_b)[1]:.1f}" rx="{sc * 0.26:.1f}" '
      f'ry="{sc * 0.12:.1f}" fill="#5b6773" stroke="{LINE}" stroke-width="1.2"/>')
    A('</g>')
    vpq = (P(VPX - 0.16, roof_y(VPZ), VPZ), P(VPX + 0.16, roof_y(VPZ), VPZ),
           P(VPX + 0.16, roof_y(VPZ) + 0.85, VPZ), P(VPX - 0.16, roof_y(VPZ) + 0.85, VPZ))
    A(f'<polygon points="{pts(*vpq)}" fill="{IWS}" stroke="{LINE}" stroke-width="1.3" '
      f'stroke-linejoin="round"/>')
    A(f'<ellipse cx="{T(vp_t)[0]:.1f}" cy="{T(vp_t)[1]:.1f}" rx="{sc * 0.16:.1f}" '
      f'ry="{sc * 0.07:.1f}" fill="#2b4a68" stroke="{LINE}" stroke-width="1.1"/>')

    # chimney: masonry neutral, skirt = the flashing
    A(f'<polygon points="{pts(cr_l, cr_apex, cr_r)}" fill="{SHINGLE_L}" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ch["flt"], ch["frt"], ch["frb"], ch["flb"])}" fill="#e3d5c8" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["blb"], ch["flb"])}" fill="#d3c2b2" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["brt"], ch["frt"])}" fill="#efe6dc" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A('<g id="part-flashing">')
    A(f'<polyline points="{pts(ch["blb"], ch["flb"], ch["frb"], ch["brb"])}" fill="none" '
      f'stroke="{METAL}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>')
    A('</g>')

    # cross gable, then ice & water in the valley ON TOP of it
    A(f'<polygon points="{pts(g_wall_lm_t, g_eave_lf, g_wall_bl, g_wall_lm_b)}" '
      f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(g_ridge_f, g_eave_rf, g_wall_br, g_wall_bl, g_eave_lf)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_rf)}" fill="{SHINGLE}" '
      f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_lf, g_eave_lm)}" fill="{SHINGLE_L}" '
      f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
    A(f'<polyline points="{pts(g_ridge_b, g_ridge_f)}" fill="none" stroke="{SHINGLE_D}" '
      f'stroke-width="7" stroke-linecap="round"/>')
    A('<g id="part-ice-water-shield">')
    A(f'<polygon points="{pts(*val)}" fill="{IWS}" stroke="#08203a" stroke-width="1.4" '
      f'stroke-linejoin="round"/>')
    A('</g>')

    # ridge assembly last so it sits above the cutaway columns
    A('<g id="part-ridge-vent">')
    A(f'<polygon points="{pts(*vent)}" fill="#55626f" stroke="{LINE}" stroke-width="1.3" '
      f'stroke-linejoin="round"/>')
    for i in range(1, 18):
        t = i / 18
        a, b = lerp(vent[0], vent[1], t), lerp(vent[3], vent[2], t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="#adb8c2" stroke-width="1.2"/>')
    A('</g>')
    A('<g id="part-ridge-cap">')
    A(f'<polygon points="{pts(*cap)}" fill="{SHINGLE_D}" stroke="{LINE}" '
      f'stroke-width="1.6" stroke-linejoin="round"/>')
    for i in range(1, 16):
        t = i / 16
        a, b = lerp(cap[0], cap[1], t), lerp(cap[3], cap[2], t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="#5a6672" stroke-width="1.1"/>')
    A('</g>')

    anchors = {
        # dx/dy are screen-space nudges so pins sit BESIDE small parts
        "ridge-cap": xy(lerp(mid(cap[0], cap[3]), mid(cap[1], cap[2]), 0.16), dy=-26),
        "ridge-vent": xy(lerp(mid(vent[0], vent[3]), mid(vent[1], vent[2]), 0.55), dy=32),
        "field-shingles": xy(lerp(lerp(ridge_l, ridge_r, 0.62), lerp(eave_l, eave_r, 0.62), 0.36)),
        "starter-shingles": xy(mid(lerp(st_eave[0], st_eave[1], 0.32),
                                   lerp(st_eave[3], st_eave[2], 0.32))),
        "ice-water-shield": xy(lerp(mid(val[0], val[1]), mid(val[2], val[3]), 0.45), dx=32, dy=-12),
        "underlayment": xy(mid(*cols[1][1])),
        "decking": xy(mid(*cols[0][1])),
        "drip-edge": xy(lerp(eave_l, eave_g, 0.62), dy=-22),
        "flashing": xy(ch["flb"], dx=-36, dy=18),
        "pipe-boots": xy(vp_t, dy=-34),
        "gutters": xy(lerp(mid(gut_ol, gut_bl), mid(gut_or, gut_br), 0.5), dy=18),
        "soffit-fascia": xy(lerp(fascia_bl, fascia_br, 0.24), dy=6),
    }
    return "\n".join(o), anchors, S


# =====================================================================
# HOUSE 2 — THE FLASHING HOUSE  (modelled on the Gibraltar diagram)
# =====================================================================
def build_flashing():
    S = Scene(1040, 620)
    P = S.P

    H, W, D = 3.6, 12.0, 5.2
    RZ, RY, OH = D / 2, H + 2.1, 0.45
    SLOPE = (RY - H) / (D - RZ)

    def roof_y(z):
        return RY - (z - RZ) * SLOPE

    def RP(x, z, lift=0.0):
        return P(x, roof_y(z) + lift, z)

    # prominent centre gable, like the reference
    GX0, GX1 = 4.4, 8.0
    GRX, GRY, GZ1 = (GX0 + GX1) / 2, H + 1.55, 9.4
    GZ0 = RZ + (RY - GRY) / SLOPE

    CHX0, CHX1 = 1.7, 2.7          # chimney on the left slope
    CHZ0, CHZ1 = 3.3, 4.1
    CH_TOP = 7.3

    DX0, DX1 = 8.8, 11.2           # shed dormer on the right slope
    DZB, DZF = 3.0, 4.7
    DTOP_B, DTOP_F = 5.55, 5.20

    VPX, VPZ = 3.5, 4.5            # vent pipe between chimney and gable

    # main wing
    ridge_l, ridge_r = RP(-OH, RZ), RP(W + OH, RZ)
    eave_l, eave_r = RP(-OH, D + OH), RP(W + OH, D + OH)
    eave_g0 = RP(GX0 - 0.05, D + OH)
    back_eave_l, back_eave_r = P(-OH, roof_y(D + OH), -OH), P(W + OH, roof_y(D + OH), -OH)
    wall_fbl, wall_fbr = P(0, 0, D), P(W, 0, D)
    wall_ftl, wall_ftr = P(0, H, D), P(W, H, D)
    gable_bb, gable_bt, gable_apex = P(0, 0, 0), P(0, H, 0), P(0, RY, RZ)

    FD = 0.40
    fascia_bl = P(-OH, roof_y(D + OH) - FD, D + OH)
    fascia_br = P(W + OH, roof_y(D + OH) - FD, D + OH)
    soffit_il, soffit_ir = P(0, H - FD, D), P(W, H - FD, D)

    # centre gable
    g_ridge_b, g_ridge_f = P(GRX, GRY, GZ0), P(GRX, GRY, GZ1)
    g_eave_lf, g_eave_lm = P(GX0, H, GZ1), P(GX0, H, D)
    g_eave_rf, g_eave_rm = P(GX1, H, GZ1), P(GX1, H, D)
    g_wall_bl, g_wall_br = P(GX0, 0, GZ1), P(GX1, 0, GZ1)
    g_wall_lm_t, g_wall_lm_b = P(GX0, H, D), P(GX0, 0, D)

    # front door on the gable face, head trim above it (Z-flashing / drip cap)
    door0, door1 = P(GRX - 0.55, 2.2, GZ1), P(GRX + 0.55, 2.2, GZ1)
    door2, door3 = P(GRX + 0.55, 0, GZ1), P(GRX - 0.55, 0, GZ1)
    zf0, zf1 = P(GRX - 0.7, 2.32, GZ1), P(GRX + 0.7, 2.32, GZ1)

    # chimney + cricket
    ch = {}
    for k, (x, z) in {"fl": (CHX0, CHZ1), "fr": (CHX1, CHZ1),
                      "bl": (CHX0, CHZ0), "br": (CHX1, CHZ0)}.items():
        ch[k + "t"] = P(x, CH_TOP, z)
        ch[k + "b"] = P(x, roof_y(z), z)
    cr_apex = RP((CHX0 + CHX1) / 2, CHZ0 - 1.0, 0.5)
    cr_l, cr_r = RP(CHX0, CHZ0), RP(CHX1, CHZ0)

    # shed dormer
    d_bl_b, d_bl_f = RP(DX0, DZB), RP(DX0, DZF)
    d_br_f = RP(DX1, DZF)
    d_tl_b, d_tl_f = P(DX0, DTOP_B, DZB), P(DX0, DTOP_F, DZF)
    d_tr_b, d_tr_f = P(DX1, DTOP_B, DZB), P(DX1, DTOP_F, DZF)
    d_w0 = P(DX0 + 0.5, DTOP_F - 0.4, DZF)
    d_w1 = P(DX1 - 0.5, DTOP_F - 0.4, DZF)
    d_w2 = P(DX1 - 0.5, DTOP_F - 1.25, DZF)
    d_w3 = P(DX0 + 0.5, DTOP_F - 1.25, DZF)

    # vent pipe
    vp_b, vp_t = RP(VPX, VPZ), RP(VPX, VPZ, 0.8)
    boot = (RP(VPX - 0.46, VPZ - 0.32), RP(VPX + 0.46, VPZ - 0.32),
            RP(VPX + 0.46, VPZ + 0.32), RP(VPX - 0.46, VPZ + 0.32))

    S.fit()
    T, pts, xy = S.T, S.pts_s, S.xy
    sc = S.scale

    o = []
    A = o.append
    A('<defs><linearGradient id="skyF" x1="0" y1="0" x2="0" y2="1">'
      '<stop offset="0%" stop-color="#f8fbfd"/><stop offset="100%" stop-color="#eef3f8"/>'
      '</linearGradient></defs>')
    A(f'<rect width="{S.vw:.0f}" height="{S.vh:.0f}" rx="24" fill="url(#skyF)"/>')
    g = T(mid(wall_fbl, wall_fbr))
    A(f'<ellipse cx="{g[0]:.0f}" cy="{g[1] + 16:.0f}" rx="{sc * 9.0:.0f}" '
      f'ry="{sc * 1.4:.0f}" fill="#0d2c4b" opacity="0.07"/>')

    # back plane, walls
    A(f'<polygon points="{pts(ridge_l, ridge_r, back_eave_r, back_eave_l)}" '
      f'fill="{SHINGLE_D}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(gable_bb, wall_fbl, wall_ftl, gable_apex, gable_bt)}" '
      f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(wall_fbl, wall_fbr, wall_ftr, wall_ftl)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    for i in range(1, 7):
        t = i / 7
        a, b = lerp(wall_ftl, wall_fbl, t), lerp(wall_ftr, wall_fbr, t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="{WALL_S2}" stroke-width="1.1"/>')

    # soffit/fascia (scenery on this house)
    A(f'<polygon points="{pts(fascia_bl, fascia_br, soffit_ir, soffit_il)}" '
      f'fill="{WALL_S2}" stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(eave_l, eave_r, fascia_br, fascia_bl)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')

    # main roof + courses + ridge cap (scenery)
    A(f'<polygon points="{pts(ridge_l, ridge_r, eave_r, eave_l)}" fill="{SHINGLE}" '
      f'stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/>')
    for i in range(1, 9):
        t = i / 9
        a, b = lerp(ridge_l, eave_l, t), lerp(ridge_r, eave_r, t)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="{SHINGLE_D}" stroke-width="1" opacity="0.45"/>')
    A(f'<polyline points="{pts(ridge_l, ridge_r)}" fill="none" stroke="{SHINGLE_D}" '
      f'stroke-width="8" stroke-linecap="round"/>')

    # drip edge — the visible left eave stretch
    A('<g id="part-drip-edge-flashing">')
    A(f'<polyline points="{pts(ridge_l, eave_l, eave_g0)}" fill="none" stroke="{METAL}" '
      f'stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>')
    A(f'<polyline points="{pts(ridge_l, eave_l, eave_g0)}" fill="none" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>')
    A('</g>')

    # vent pipe + boot
    A('<g id="part-pipe-flashing">')
    A(f'<polygon points="{pts(*boot)}" fill="{METAL}" stroke="{LINE}" stroke-width="1.5" '
      f'stroke-linejoin="round"/>')
    A(f'<ellipse cx="{T(vp_b)[0]:.1f}" cy="{T(vp_b)[1]:.1f}" rx="{sc * 0.24:.1f}" '
      f'ry="{sc * 0.11:.1f}" fill="#5b6773" stroke="{LINE}" stroke-width="1.2"/>')
    A('</g>')
    vpq = (P(VPX - 0.15, roof_y(VPZ), VPZ), P(VPX + 0.15, roof_y(VPZ), VPZ),
           P(VPX + 0.15, roof_y(VPZ) + 0.8, VPZ), P(VPX - 0.15, roof_y(VPZ) + 0.8, VPZ))
    A(f'<polygon points="{pts(*vpq)}" fill="{IWS}" stroke="{LINE}" stroke-width="1.3" '
      f'stroke-linejoin="round"/>')

    # chimney: cricket pinned separately, counter flashing = the skirt
    A('<g id="part-chimney-cricket">')
    A(f'<polygon points="{pts(cr_l, cr_apex, cr_r)}" fill="{SHINGLE_L}" stroke="{LINE}" '
      f'stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polyline points="{pts(cr_l, cr_apex, cr_r)}" fill="none" stroke="{METAL}" '
      f'stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>')
    A('</g>')
    A(f'<polygon points="{pts(ch["flt"], ch["frt"], ch["frb"], ch["flb"])}" fill="#e3d5c8" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["blb"], ch["flb"])}" fill="#d3c2b2" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(ch["flt"], ch["blt"], ch["brt"], ch["frt"])}" fill="#efe6dc" '
      f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
    A('<g id="part-counter-flashing">')
    A(f'<polyline points="{pts(ch["blb"], ch["flb"], ch["frb"], ch["brb"])}" fill="none" '
      f'stroke="{METAL}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>')
    A('</g>')

    # centre gable + valleys
    A(f'<polygon points="{pts(g_wall_lm_t, g_eave_lf, g_wall_bl, g_wall_lm_b)}" '
      f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(g_ridge_f, g_eave_rf, g_wall_br, g_wall_bl, g_eave_lf)}" '
      f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(door0, door1, door2, door3)}" fill="#7d8b99" stroke="{LINE}" '
      f'stroke-width="1.4" stroke-linejoin="round"/>')
    A('<g id="part-z-flashing">')
    A(f'<polyline points="{pts(zf0, zf1)}" fill="none" stroke="{METAL}" stroke-width="7" '
      f'stroke-linecap="round"/>')
    A('</g>')
    A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_rf, g_eave_rm)}" fill="{SHINGLE}" '
      f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_lf, g_eave_lm)}" fill="{SHINGLE_L}" '
      f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
    A(f'<polyline points="{pts(g_ridge_b, g_ridge_f)}" fill="none" stroke="{SHINGLE_D}" '
      f'stroke-width="7" stroke-linecap="round"/>')
    A('<g id="part-valley-flashing">')
    A(f'<polyline points="{pts(g_ridge_b, g_eave_lm)}" fill="none" stroke="{METAL}" '
      f'stroke-width="9" stroke-linecap="round"/>')
    A(f'<polyline points="{pts(g_ridge_b, g_eave_rm)}" fill="none" stroke="{METAL}" '
      f'stroke-width="9" stroke-linecap="round"/>')
    A('</g>')

    # shed dormer: step (left wall), apron (front base), kickout (bottom corner)
    A(f'<polygon points="{pts(d_tl_b, d_tr_b, d_tr_f, d_tl_f)}" fill="{SHINGLE_L}" '
      f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(d_tl_b, d_tl_f, d_bl_f, d_bl_b)}" fill="{WALL_S}" '
      f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(d_tl_f, d_tr_f, d_br_f, d_bl_f)}" fill="{WALL}" '
      f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A(f'<polygon points="{pts(d_w0, d_w1, d_w2, d_w3)}" fill="#cfe0ee" stroke="{LINE}" '
      f'stroke-width="1.3" stroke-linejoin="round"/>')
    A('<g id="part-step-flashing">')
    # individual pieces so it reads as steps, not one strip
    for i in range(5):
        a = lerp(d_bl_b, d_bl_f, i / 5)
        b = lerp(d_bl_b, d_bl_f, (i + 0.75) / 5)
        A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
          f'y2="{T(b)[1]:.1f}" stroke="{METAL}" stroke-width="8" stroke-linecap="round"/>')
    A('</g>')
    A('<g id="part-apron-flashing">')
    A(f'<polyline points="{pts(d_bl_f, d_br_f)}" fill="none" stroke="{METAL}" '
      f'stroke-width="8" stroke-linecap="round"/>')
    A('</g>')
    A('<g id="part-kickout-flashing">')
    kf = T(d_bl_f)
    A(f'<path d="M {kf[0]:.1f} {kf[1]:.1f} l -16 11 l 22 9 z" fill="{METAL}" '
      f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
    A('</g>')

    anchors = {
        "step-flashing": xy(lerp(d_bl_b, d_bl_f, 0.35), dx=-30, dy=-16),
        "counter-flashing": xy(ch["frb"], dx=36, dy=-8),
        "apron-flashing": xy(mid(d_bl_f, d_br_f), dx=22, dy=28),
        "kickout-flashing": xy(d_bl_f, dx=-30, dy=30),
        "valley-flashing": xy(lerp(g_ridge_b, g_eave_lm, 0.55), dx=-28, dy=-8),
        "drip-edge-flashing": xy(lerp(eave_l, eave_g0, 0.55), dy=-22),
        "pipe-flashing": xy(vp_t, dy=-32),
        "chimney-cricket": xy(cr_apex, dy=-28),
        "z-flashing": xy(mid(zf0, zf1), dx=56),
    }
    return "\n".join(o), anchors, S


# =====================================================================
# EMIT
# =====================================================================
def to_tsx(body, scene, component, viewbox_const, doc, aria):
    for a, b in [("stroke-width", "strokeWidth"), ("stroke-linejoin", "strokeLinejoin"),
                 ("stroke-linecap", "strokeLinecap"), ("stop-color", "stopColor")]:
        body = body.replace(a + "=", b + "=")
    body = re.sub(r'<g id="part-([a-z-]+)">',
                  lambda m: '<g {...part("%s")}>' % m.group(1), body)
    body = re.sub(r'(<(?:rect|line|path|polygon|polyline|ellipse|circle|stop)\b[^>]*?)(?<!/)>',
                  r'\1 />', body)
    indent = "\n".join("      " + l for l in body.strip().split("\n"))
    return '''"use client";

/**
%s
 *
 * GENERATED by docs/roof-house-geometry.py — edit the model there and re-run
 * (then docs/sync-roof-anchors.py). Hand-editing desynchronises the pins.
 *
 * Neutral colours throughout; ember is reserved for the active highlight,
 * applied via CSS (which overrides SVG presentation attributes).
 */

import { cn } from "@/lib/utils";

export const %s = { width: %d, height: %d };

export function %s({
  activeKey,
  className,
  label,
}: {
  activeKey: string;
  className?: string;
  label?: string;
}) {
  const part = (key: string) => ({
    "data-part": key,
    className: cn(
      "transition-[filter,opacity] duration-300",
      key === activeKey &&
        "[filter:drop-shadow(0_0_10px_rgba(201,112,46,0.85))] [&_circle]:fill-ember-500 [&_ellipse]:fill-ember-500 [&_line]:stroke-ember-500 [&_path]:fill-ember-500 [&_polygon]:fill-ember-500 [&_polygon]:stroke-navy-950 [&_polyline]:stroke-ember-500",
    ),
  });

  return (
    <svg
      viewBox="0 0 %d %d"
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label={label ?? "%s"}
    >
%s
    </svg>
  );
}
''' % (doc, viewbox_const, scene.vw, scene.vh, component,
       scene.vw, scene.vh, aria, indent)


a_body, a_anchors, a_scene = build_anatomy()
f_body, f_anchors, f_scene = build_flashing()

bad = collisions(a_anchors) + collisions(f_anchors)
if bad:
    raise SystemExit(f"HOT-SPOT COLLISION: {bad}")

(HERE.parent / "src" / "components" / "roof" / "roof-house-svg.tsx").write_text(
    to_tsx(a_body, a_scene, "RoofHouseSvg", "ROOF_SVG_VIEWBOX",
           " * The ANATOMY house — cutaway layer stack, ridge assembly, chimney,\n"
           " * cross gable with ice & water in the valley, gutter and downspout.",
           "Cutaway illustration of a house showing every roof component in place"))

(HERE.parent / "src" / "components" / "roof" / "flashing-house-svg.tsx").write_text(
    to_tsx(f_body, f_scene, "FlashingHouseSvg", "FLASHING_SVG_VIEWBOX",
           " * The FLASHING house — modelled on the Gibraltar flashing diagram the\n"
           " * owner supplied: centre gable with valleys, chimney with cricket, shed\n"
           " * dormer for step/apron/kickout, door head for Z-flashing.",
           "Illustration of a house with each type of roof flashing marked in place"))

json.dump({"viewBox": {"width": int(a_scene.vw), "height": int(a_scene.vh)},
           "flashingViewBox": {"width": int(f_scene.vw), "height": int(f_scene.vh)},
           "parts": {k: {"x": v[0], "y": v[1]} for k, v in a_anchors.items()},
           "flashing": {k: {"x": v[0], "y": v[1]} for k, v in f_anchors.items()}},
          open(HERE / "anchors.json", "w"), indent=2)

print("anatomy anchors:", len(a_anchors), " flashing anchors:", len(f_anchors))
print("collisions: none — wrote both TSX components + anchors.json")
