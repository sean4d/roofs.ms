"""
Generate the roof-anatomy house illustration as SVG + hot-spot anchors.

Axonometric projection with explicit axis vectors (a true 30-degree isometric
tilts the ridge too steeply to read):

    screen = X*UX + Z*UZ + Y*UY
    UX = ( 1.00, -0.24)   +X -> right, slightly up   (house length)
    UZ = ( 0.60,  0.30)   +Z -> right, down          (depth, toward viewer)
    UY = ( 0.00, -1.00)   +Y -> up

Camera sits above, left, and in front, so the visible faces are the front wall
(+Z), the left gable end (-X), and the front roof plane. Faces are emitted
back-to-front (painter's algorithm).

Design rule: every labelled component must be a distinct, physically-sized
shape. A homeowner clicking "starter shingles" has to SEE a thin strip appear
around the perimeter, so starter is drawn as a perimeter band and not as a
slab in the cutaway. Same for drip edge (the outermost edge line, offset from
starter so the two never sit on top of each other) and ice & water (drawn
down the valleys, which is where it actually goes).
"""
import math

UX = (1.00, -0.24)
UZ = (0.60, 0.30)
UY = (0.00, -1.00)

# ---------------------------------------------------------------- model
H = 3.7                        # wall height
W = 12.2                       # main wing length (X)
D = 5.6                        # main wing depth  (Z)
RZ = D / 2                     # ridge at mid-depth
RY = H + 2.3                   # ridge height (~10:12)
OH = 0.45                      # eave overhang
SLOPE = (RY - H) / (D - RZ)    # rise per unit Z on the front plane

CUT_X0, CUT_X1 = -OH, 3.2      # stepped cutaway
VPX, VPZ = 4.0, 4.6            # plumbing vent
CHX0, CHX1 = 4.5, 5.95         # chimney
CHZ0, CHZ1 = 3.5, 4.3
CH_TOP = 7.9

DX0, DX1 = 6.2, 9.0            # shed dormer
DZB, DZF = 3.05, 4.95
DTOP_B, DTOP_F = 5.95, 5.60

GX0, GX1 = 9.6, 12.4           # cross gable
GRX = (GX0 + GX1) / 2
GRY = H + 1.5
GZ1 = 10.4
GZ0 = RZ + (RY - GRY) / SLOPE  # where its ridge dies into the main roof

_all = []


def P(x, y, z):
    sx = x * UX[0] + z * UZ[0] + y * UY[0]
    sy = x * UX[1] + z * UZ[1] + y * UY[1]
    _all.append((sx, sy))
    return (sx, sy)


def roof_y(z):
    """Height of the main front roof plane at depth z."""
    return RY - (z - RZ) * SLOPE


def RP(x, z, lift=0.0):
    """A point sitting on (or lifted above) the front roof plane."""
    return P(x, roof_y(z) + lift, z)


# ---- main wing -------------------------------------------------------
ridge_l, ridge_r = RP(-OH, RZ), RP(W + OH, RZ)
eave_l, eave_r = RP(-OH, D + OH), RP(W + OH, D + OH)
back_eave_l, back_eave_r = P(-OH, roof_y(D + OH), -OH), P(W + OH, roof_y(D + OH), -OH)

wall_fbl, wall_fbr = P(0, 0, D), P(W, 0, D)
wall_ftl, wall_ftr = P(0, H, D), P(W, H, D)
gable_bb, gable_bt = P(0, 0, 0), P(0, H, 0)
gable_apex = P(0, RY, RZ)

# ---- eave assembly: soffit, fascia, gutter, downspout ----------------
FASCIA_DROP = 0.42
fascia_tl, fascia_tr = eave_l, eave_r
fascia_bl = P(-OH, roof_y(D + OH) - FASCIA_DROP, D + OH)
fascia_br = P(W + OH, roof_y(D + OH) - FASCIA_DROP, D + OH)
soffit_il, soffit_ir = P(0, H - FASCIA_DROP, D), P(W, H - FASCIA_DROP, D)

GUT_H, GUT_OUT = 0.40, 0.20
gut_tl = P(-OH, roof_y(D + OH) - FASCIA_DROP, D + OH)
gut_tr = P(W + OH, roof_y(D + OH) - FASCIA_DROP, D + OH)
gut_ol = P(-OH, roof_y(D + OH) - FASCIA_DROP + 0.06, D + OH + GUT_OUT)
gut_or = P(W + OH, roof_y(D + OH) - FASCIA_DROP + 0.06, D + OH + GUT_OUT)
gut_bl = P(-OH, roof_y(D + OH) - FASCIA_DROP - GUT_H, D + OH + GUT_OUT)
gut_br = P(W + OH, roof_y(D + OH) - FASCIA_DROP - GUT_H, D + OH + GUT_OUT)
DSX = 0.55
ds_t0 = P(DSX, roof_y(D + OH) - FASCIA_DROP - GUT_H, D + OH + GUT_OUT)
ds_t1 = P(DSX + 0.42, roof_y(D + OH) - FASCIA_DROP - GUT_H, D + OH + GUT_OUT)
ds_b0 = P(DSX, 0.15, D + OH + GUT_OUT)
ds_b1 = P(DSX + 0.42, 0.15, D + OH + GUT_OUT)

# ---- stepped cutaway -------------------------------------------------
# Four columns across the slope, each one layer deeper and one step lower, so
# every layer is a large panel instead of a hairline band.
CUT_COLS = []
_names = ["decking", "underlayment", "ice-water-shield", "field-shingles"]
_span = (CUT_X1 - CUT_X0) / 4
for i, nm in enumerate(_names):
    x0 = CUT_X0 + i * _span
    x1 = x0 + _span
    lift = i * 0.16
    CUT_COLS.append((nm, (
        RP(x0, RZ, lift), RP(x1, RZ, lift),
        RP(x1, D + OH, lift), RP(x0, D + OH, lift),
    ), (  # the step face revealed on the column's left edge
        RP(x0, RZ, lift), RP(x0, D + OH, lift),
        RP(x0, D + OH, lift - 0.16), RP(x0, RZ, lift - 0.16),
    )))

# ---- perimeter: starter band + drip edge -----------------------------
STARTER_W = 0.62
starter_eave = (RP(-OH, D + OH), RP(W + OH, D + OH),
                RP(W + OH, D + OH - STARTER_W), RP(-OH, D + OH - STARTER_W))
starter_rake = (RP(-OH, RZ), RP(-OH, D + OH),
                RP(-OH + STARTER_W, D + OH), RP(-OH + STARTER_W, RZ))

# ---- ridge vent + cap ------------------------------------------------
VENT_H = 0.62
vent_bl, vent_br = RP(0.5, RZ), RP(W - 0.5, RZ)
vent_tl, vent_tr = RP(0.5, RZ, VENT_H), RP(W - 0.5, RZ, VENT_H)

# ---- chimney ---------------------------------------------------------
ch = {}
for k, (x, z) in {"fl": (CHX0, CHZ1), "fr": (CHX1, CHZ1),
                  "bl": (CHX0, CHZ0), "br": (CHX1, CHZ0)}.items():
    ch[k + "t"] = P(x, CH_TOP, z)
    ch[k + "b"] = P(x, roof_y(z) if z > RZ else RY - (RZ - z) * SLOPE, z)
# cricket: small saddle on the uphill side
cr_apex = RP((CHX0 + CHX1) / 2, CHZ0 - 1.35, 0.60)
cr_l, cr_r = RP(CHX0, CHZ0), RP(CHX1, CHZ0)

# ---- shed dormer -----------------------------------------------------
d_bl_b, d_bl_f = RP(DX0, DZB), RP(DX0, DZF)          # left wall base (step run)
d_br_b, d_br_f = RP(DX1, DZB), RP(DX1, DZF)
d_tl_b, d_tl_f = P(DX0, DTOP_B, DZB), P(DX0, DTOP_F, DZF)
d_tr_b, d_tr_f = P(DX1, DTOP_B, DZB), P(DX1, DTOP_F, DZF)
d_win0 = P(DX0 + 0.55, DTOP_F - 0.45, DZF)
d_win1 = P(DX1 - 0.55, DTOP_F - 0.45, DZF)
d_win2 = P(DX1 - 0.55, DTOP_F - 1.35, DZF)
d_win3 = P(DX0 + 0.55, DTOP_F - 1.35, DZF)

# ---- cross gable + valleys -------------------------------------------
g_ridge_b, g_ridge_f = P(GRX, GRY, GZ0), P(GRX, GRY, GZ1)
g_eave_lf, g_eave_lm = P(GX0, H, GZ1), P(GX0, H, D)
g_eave_rf, g_eave_rm = P(GX1, H, GZ1), P(GX1, H, D)
g_wall_bl, g_wall_br = P(GX0, 0, GZ1), P(GX1, 0, GZ1)
g_wall_lm_t, g_wall_lm_b = P(GX0, H, D), P(GX0, 0, D)
VW_ = 0.42   # valley lining half-width
val_l = (P(GRX - VW_, roof_y(GZ0), GZ0), P(GRX + VW_, roof_y(GZ0), GZ0),
         P(GX0 + VW_, H, D), P(GX0 - VW_, H, D))
val_r = (P(GRX - VW_, roof_y(GZ0), GZ0), P(GRX + VW_, roof_y(GZ0), GZ0),
         P(GX1 + VW_, H, D), P(GX1 - VW_, H, D))

# ---- vent pipe + boot ------------------------------------------------
vp_b = RP(VPX, VPZ)
vp_t = RP(VPX, VPZ, 0.85)
boot = (RP(VPX - 0.50, VPZ - 0.34), RP(VPX + 0.50, VPZ - 0.34),
        RP(VPX + 0.50, VPZ + 0.34), RP(VPX - 0.50, VPZ + 0.34))

# ---- front-wall window (z-flashing head) -----------------------------
w0, w1 = P(1.4, H - 0.9, D), P(2.6, H - 0.9, D)
w2, w3 = P(2.6, H - 2.3, D), P(1.4, H - 2.3, D)
zf0, zf1 = P(1.3, H - 0.82, D), P(2.7, H - 0.82, D)

# ---------------------------------------------------------------- fit
xs, ys = [p[0] for p in _all], [p[1] for p in _all]
minx, maxx, miny, maxy = min(xs), max(xs), min(ys), max(ys)
VW, VH = 1040.0, 620.0
PAD = 52.0
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


def mid(*ps):
    return (sum(p[0] for p in ps) / len(ps), sum(p[1] for p in ps) / len(ps))


# ---------------------------------------------------------------- style
SHINGLE, SHINGLE_D, SHINGLE_L = "#8d9aa8", "#6c7986", "#a7b3bf"
WALL, WALL_S, WALL_S2 = "#ffffff", "#e8edf3", "#d5dde6"
LINE, ACCENT = "#46525e", "#c9702e"
DECK, UNDER, IWS = "#c9a679", "#4f7ea8", "#12304d"
METAL = "#b9c4cf"

o = []
A = o.append
A(f'<svg viewBox="0 0 {VW:.0f} {VH:.0f}" xmlns="http://www.w3.org/2000/svg">')
A('<defs><linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">'
  '<stop offset="0%" stop-color="#f8fbfd"/><stop offset="100%" stop-color="#e9f0f7"/>'
  '</linearGradient></defs>')
A(f'<rect width="{VW:.0f}" height="{VH:.0f}" rx="24" fill="url(#skyG)"/>')
sc = T(lerp(wall_fbl, wall_fbr, 0.5))
A(f'<ellipse cx="{sc[0]:.0f}" cy="{sc[1] + 16:.0f}" rx="{scale * 9.5:.0f}" '
  f'ry="{scale * 1.4:.0f}" fill="#0d2c4b" opacity="0.07"/>')

# back roof plane caps the gable so it doesn't read as an open wall
A(f'<polygon points="{pts(ridge_l, ridge_r, back_eave_r, back_eave_l)}" '
  f'fill="{SHINGLE_D}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')

# walls
A(f'<polygon points="{pts(gable_bb, wall_fbl, wall_ftl, gable_apex, gable_bt)}" '
  f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(wall_fbl, wall_fbr, wall_ftr, wall_ftl)}" '
  f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
for i in range(1, 7):
    t = i / 7
    a, b = lerp(wall_ftl, wall_fbl, t), lerp(wall_ftr, wall_fbr, t)
    A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
      f'y2="{T(b)[1]:.1f}" stroke="{WALL_S2}" stroke-width="1.1"/>')

# window + its head flashing
A(f'<polygon points="{pts(w0, w1, w2, w3)}" fill="#cfe0ee" stroke="{LINE}" '
  f'stroke-width="1.4" stroke-linejoin="round"/>')
A('<g id="part-z-flashing">')
A(f'<polyline points="{pts(zf0, zf1)}" fill="none" stroke="{METAL}" stroke-width="6" '
  f'stroke-linecap="round"/></g>')

# soffit -> fascia -> gutter (all sit below the roof edge)
A('<g id="part-soffit-fascia">')
A(f'<polygon points="{pts(fascia_bl, fascia_br, soffit_ir, soffit_il)}" '
  f'fill="{WALL_S2}" stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(fascia_tl, fascia_tr, fascia_br, fascia_bl)}" '
  f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A('</g>')
A('<g id="part-gutters">')
A(f'<polygon points="{pts(gut_tl, gut_tr, gut_or, gut_ol)}" fill="{METAL}" '
  f'stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(gut_ol, gut_or, gut_br, gut_bl)}" fill="#e6ecf2" '
  f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(ds_t0, ds_t1, ds_b1, ds_b0)}" fill="#e6ecf2" '
  f'stroke="{LINE}" stroke-width="1.4" stroke-linejoin="round"/>')
A('</g>')

# main roof plane + courses
A('<g id="part-field-shingles-main">')
A(f'<polygon points="{pts(ridge_l, ridge_r, eave_r, eave_l)}" fill="{SHINGLE}" '
  f'stroke="{LINE}" stroke-width="1.8" stroke-linejoin="round"/></g>')
for i in range(1, 9):
    t = i / 9
    a, b = lerp(ridge_l, eave_l, t), lerp(ridge_r, eave_r, t)
    A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
      f'y2="{T(b)[1]:.1f}" stroke="{SHINGLE_D}" stroke-width="1" opacity="0.45"/>')

# stepped cutaway: one large panel per layer
STY = {"decking": (DECK, "#a8874f"), "underlayment": (UNDER, "#3d6688"),
       "ice-water-shield": (IWS, "#08203a"), "field-shingles": (SHINGLE_L, SHINGLE_D)}
for nm, quad, step in CUT_COLS:
    f, s = STY[nm]
    A(f'<g id="part-{nm}">')
    A(f'<polygon points="{pts(*step)}" fill="{s}" stroke="{s}" stroke-width="1.2"/>')
    A(f'<polygon points="{pts(*quad)}" fill="{f}" stroke="{s}" stroke-width="1.6" '
      f'stroke-linejoin="round"/>')
    A('</g>')

# chimney (neutral) — flashing is the skirt, not the masonry
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
A('<g id="part-chimney-cricket">')
A(f'<polyline points="{pts(cr_l, cr_apex, cr_r)}" fill="none" stroke="{METAL}" '
  f'stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/></g>')

# shed dormer
A(f'<polygon points="{pts(d_tl_b, d_tr_b, d_tr_f, d_tl_f)}" fill="{SHINGLE_L}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(d_tl_b, d_tl_f, d_bl_f, d_bl_b)}" fill="{WALL_S}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(d_tl_f, d_tr_f, d_br_f, d_bl_f)}" fill="{WALL}" '
  f'stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(d_win0, d_win1, d_win2, d_win3)}" fill="#cfe0ee" '
  f'stroke="{LINE}" stroke-width="1.3" stroke-linejoin="round"/>')
A('<g id="part-step-flashing">')
A(f'<polyline points="{pts(d_bl_b, d_bl_f)}" fill="none" stroke="{METAL}" '
  f'stroke-width="9" stroke-linecap="round"/></g>')
A('<g id="part-apron-flashing">')
A(f'<polyline points="{pts(d_bl_b, d_br_b)}" fill="none" stroke="{METAL}" '
  f'stroke-width="9" stroke-linecap="round"/></g>')
A('<g id="part-kickout-flashing">')
A(f'<circle cx="{T(d_bl_f)[0]:.1f}" cy="{T(d_bl_f)[1]:.1f}" r="{scale * 0.36:.1f}" '
  f'fill="{METAL}" stroke="{LINE}" stroke-width="1.8"/></g>')

# vent pipe + boot
A('<g id="part-pipe-boots">')
A(f'<polygon points="{pts(*boot)}" fill="{METAL}" stroke="{LINE}" stroke-width="1.5" '
  f'stroke-linejoin="round"/>')
A(f'<ellipse cx="{T(vp_b)[0]:.1f}" cy="{T(vp_b)[1]:.1f}" rx="{scale * 0.26:.1f}" '
  f'ry="{scale * 0.12:.1f}" fill="#5b6773" stroke="{LINE}" stroke-width="1.2"/>')
A('</g>')
A(f'<polygon points="{pts(P(VPX - 0.16, roof_y(VPZ), VPZ), P(VPX + 0.16, roof_y(VPZ), VPZ), P(VPX + 0.16, roof_y(VPZ) + 0.85, VPZ), P(VPX - 0.16, roof_y(VPZ) + 0.85, VPZ))}" '
  f'fill="{IWS}" stroke="{LINE}" stroke-width="1.3" stroke-linejoin="round"/>')
A(f'<ellipse cx="{T(vp_t)[0]:.1f}" cy="{T(vp_t)[1]:.1f}" rx="{scale * 0.16:.1f}" '
  f'ry="{scale * 0.07:.1f}" fill="#2b4a68" stroke="{LINE}" stroke-width="1.1"/>')

# cross gable
A(f'<polygon points="{pts(g_wall_lm_t, g_eave_lf, g_wall_bl, g_wall_lm_b)}" '
  f'fill="{WALL_S}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(g_ridge_f, g_eave_rf, g_wall_br, g_wall_bl, g_eave_lf)}" '
  f'fill="{WALL}" stroke="{LINE}" stroke-width="1.6" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_rf, g_eave_rm)}" fill="{SHINGLE}" '
  f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(g_ridge_b, g_ridge_f, g_eave_lf, g_eave_lm)}" fill="{SHINGLE_L}" '
  f'stroke="{LINE}" stroke-width="1.7" stroke-linejoin="round"/>')
A(f'<polyline points="{pts(g_ridge_b, g_ridge_f)}" fill="none" stroke="{IWS}" '
  f'stroke-width="8" stroke-linecap="round"/>')
# ice & water down both valleys (drawn over the cross gable further down too)
A('<g id="part-ice-water-shield-valley">')
A(f'<polygon points="{pts(*val_l)}" fill="{IWS}" stroke="#08203a" stroke-width="1.4" '
  f'stroke-linejoin="round"/>')
A(f'<polygon points="{pts(*val_r)}" fill="{IWS}" stroke="#08203a" stroke-width="1.4" '
  f'stroke-linejoin="round"/>')
A('</g>')

# valley lines sit on top so the channel reads
A('<g id="part-valley-flashing">')
A(f'<polyline points="{pts(g_ridge_b, g_eave_lm)}" fill="none" stroke="{METAL}" '
  f'stroke-width="9" stroke-linecap="round"/>')
A(f'<polyline points="{pts(g_ridge_b, g_eave_rm)}" fill="none" stroke="{METAL}" '
  f'stroke-width="9" stroke-linecap="round"/></g>')

# starter strip: thin band inboard of the edge, all around the perimeter
A('<g id="part-starter-shingles">')
A(f'<polygon points="{pts(*starter_eave)}" fill="#7d8b99" stroke="{LINE}" '
  f'stroke-width="1.3" stroke-linejoin="round"/>')
A(f'<polygon points="{pts(*starter_rake)}" fill="#7d8b99" stroke="{LINE}" '
  f'stroke-width="1.3" stroke-linejoin="round"/>')
A('</g>')

# drip edge: the outermost line, outboard of starter so they never collide
A('<g id="part-drip-edge">')
A(f'<polyline points="{pts(ridge_l, eave_l, eave_r)}" fill="none" stroke="{METAL}" '
  f'stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>')
A(f'<polyline points="{pts(ridge_l, eave_l, eave_r)}" fill="none" stroke="{LINE}" '
  f'stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>')
A('</g>')

# ridge vent (raised band) then ridge cap on top of it
A('<g id="part-ridge-vent">')
A(f'<polygon points="{pts(vent_bl, vent_br, vent_tr, vent_tl)}" fill="{SHINGLE_D}" '
  f'stroke="{LINE}" stroke-width="1.5" stroke-linejoin="round"/>')
for i in range(1, 14):
    t = i / 14
    a, b = lerp(vent_bl, vent_br, t), lerp(vent_tl, vent_tr, t)
    A(f'<line x1="{T(a)[0]:.1f}" y1="{T(a)[1]:.1f}" x2="{T(b)[0]:.1f}" '
      f'y2="{T(b)[1]:.1f}" stroke="#55626f" stroke-width="1.1"/>')
A('</g>')
A('<g id="part-ridge-cap">')
A(f'<polyline points="{pts(ridge_l, vent_tl)}" fill="none" stroke="{IWS}" '
  f'stroke-width="8" stroke-linecap="round"/>')
A(f'<polyline points="{pts(vent_tl, vent_tr)}" fill="none" stroke="{IWS}" '
  f'stroke-width="8" stroke-linecap="round"/>')
A(f'<polyline points="{pts(vent_tr, ridge_r)}" fill="none" stroke="{IWS}" '
  f'stroke-width="8" stroke-linecap="round"/>')
A('</g>')

A('</svg>')
svg = "\n".join(o)
import pathlib
base = str(pathlib.Path(__file__).resolve().parent) + "/"
# the SVG itself is only useful as a preview; the TSX below is the artifact


# ---------------------------------------------------------------- anchors
PARTS = {
    "ridge-cap": xy(lerp(ridge_l, vent_tl, 0.55)),
    "ridge-vent": xy(mid(lerp(vent_bl, vent_br, 0.62), lerp(vent_tl, vent_tr, 0.62))),
    "field-shingles": xy(lerp(lerp(ridge_l, ridge_r, 0.60), lerp(eave_l, eave_r, 0.60), 0.30)),
    "starter-shingles": xy(mid(*[lerp(starter_eave[0], starter_eave[1], 0.30),
                                 lerp(starter_eave[3], starter_eave[2], 0.30)])),
    "ice-water-shield": xy(lerp(mid(*val_l[:2]), mid(*val_l[2:]), 0.55)),
    "underlayment": xy(mid(*CUT_COLS[1][1])),
    "decking": xy(mid(*CUT_COLS[0][1])),
    "drip-edge": xy(lerp(eave_l, eave_r, 0.60)),
    "flashing": xy(lerp(ch["flb"], ch["frb"], 0.5)),
    "pipe-boots": xy(vp_t),
    "gutters": xy(lerp(mid(gut_ol, gut_bl), mid(gut_or, gut_br), 0.46)),
    "soffit-fascia": xy(lerp(mid(fascia_tl, fascia_bl), mid(fascia_tr, fascia_br), 0.78)),
}

FLASH = {
    "step-flashing": xy(lerp(d_bl_b, d_bl_f, 0.45)),
    "counter-flashing": xy(lerp(ch["flt"], ch["flb"], 0.50)),
    "apron-flashing": xy(lerp(d_bl_b, d_br_b, 0.62)),
    "kickout-flashing": xy(d_bl_f),
    "valley-flashing": xy(lerp(g_ridge_b, g_eave_lm, 0.55)),
    "drip-edge-flashing": xy(lerp(eave_l, eave_r, 0.30)),
    "pipe-flashing": xy(vp_t),
    "chimney-cricket": xy(cr_apex),
    "z-flashing": xy(lerp(zf0, zf1, 0.5)),
}

import itertools


def collisions(d, gap=42):
    return [(a, b) for a, b in itertools.combinations(d, 2)
            if math.dist(d[a], d[b]) < gap]


import json
json.dump({"viewBox": {"width": int(VW), "height": int(VH)},
           "parts": {k: {"x": v[0], "y": v[1]} for k, v in PARTS.items()},
           "flashing": {k: {"x": v[0], "y": v[1]} for k, v in FLASH.items()}},
          open(base + "anchors.json", "w"), indent=2)

_bad = collisions(PARTS) + collisions(FLASH)
if _bad:
    raise SystemExit(f"HOT-SPOT COLLISION: {_bad}")

print(f"VIEWBOX {VW:.0f} {VH:.0f}")
print("\n--- ROOF PARTS ---")
for k, v in PARTS.items():
    print(f'    hotspot: {{ x: {v[0]}, y: {v[1]} }},   // {k}')
print("collisions:", collisions(PARTS) or "none")
print("\n--- FLASHING ---")
for k, v in FLASH.items():
    print(f'    hotspot: {{ x: {v[0]}, y: {v[1]} }},   // {k}')
print("collisions:", collisions(FLASH) or "none")

# ------------------------------------------------------------------ TSX
import re as _re

# Some components are drawn in more than one place (shingles appear in the
# field and in the cutaway; ice & water in the cutaway and down the valleys),
# and some pieces answer to two names — the chimney skirt is "Flashing" in the
# anatomy diagram and "Counter Flashing" in the flashing one. A group can
# therefore respond to several keys.
GROUP_KEYS = {
    "field-shingles-main": ["field-shingles"],
    "ice-water-shield-valley": ["ice-water-shield"],
    "flashing": ["flashing", "counter-flashing"],
    "pipe-boots": ["pipe-boots", "pipe-flashing"],
    "drip-edge": ["drip-edge", "drip-edge-flashing"],
    "starter-shingles": ["starter-shingles"],
}

body = svg[svg.index(">", svg.index("<svg")) + 1: svg.rindex("</svg>")]
for a, b in [("stroke-width", "strokeWidth"), ("stroke-linejoin", "strokeLinejoin"),
             ("stroke-linecap", "strokeLinecap"), ("stop-color", "stopColor")]:
    body = body.replace(a + "=", b + "=")


def _grp(m):
    gid = m.group(1)
    keys = GROUP_KEYS.get(gid, [gid])
    return "<g {...part(%s)}>" % ", ".join('"%s"' % k for k in keys)


body = _re.sub(r'<g id="part-([a-z-]+)">', _grp, body)
body = _re.sub(r'(<(?:rect|line|polygon|polyline|ellipse|circle|stop)\b[^>]*?)(?<!/)>',
               r'\1 />', body)
indent = "\n".join("      " + l for l in body.strip().split("\n"))

tsx = '''"use client";

/**
 * Isometric roof illustration shared by the anatomy diagram and the flashing
 * diagram.
 *
 * GENERATED by docs/roof-house-geometry.py, which projects a 3D house model
 * through a fixed axonometric transform and emits this file together with the
 * hot-spot coordinates in config/roof-anatomy.ts. Editing the paths by hand
 * desynchronises the pins from the artwork — change the script and re-run it.
 *
 * Everything draws in neutral, realistic colours; ember is reserved for the
 * active selection so a highlight actually means something. `part()` tags each
 * labelled group, and the highlight works through CSS (which overrides SVG
 * presentation attributes) rather than by re-rendering paths. A group can
 * answer to more than one key: the chimney skirt is "Flashing" in the anatomy
 * diagram and "Counter Flashing" in the flashing one, and shingles appear both
 * in the field and in the cutaway.
 */

import { cn } from "@/lib/utils";

export const ROOF_SVG_VIEWBOX = { width: %d, height: %d };

export function RoofHouseSvg({
  activeKey,
  className,
  label,
}: {
  activeKey: string;
  className?: string;
  label?: string;
}) {
  const part = (...keys: string[]) => ({
    "data-part": keys[0],
    className: cn(
      "transition-[filter,opacity] duration-300",
      keys.includes(activeKey)
        ? "[filter:drop-shadow(0_0_10px_rgba(201,112,46,0.85))] [&_circle]:fill-ember-500 [&_ellipse]:fill-ember-500 [&_line]:stroke-ember-500 [&_polygon]:fill-ember-500 [&_polygon]:stroke-navy-950 [&_polyline]:stroke-ember-500"
        : "opacity-100",
    ),
  });

  return (
    <svg
      viewBox="0 0 %d %d"
      className={cn("block h-auto w-full", className)}
      role="img"
      aria-label={
        label ??
        "Cutaway illustration of a house showing every roof component in place"
      }
    >
%s
    </svg>
  );
}
''' % (VW, VH, VW, VH, indent)

open(base + "../src/components/roof/roof-house-svg.tsx", "w").write(tsx)
print("\nWROTE roof-house-svg.tsx", len(tsx), "bytes")
