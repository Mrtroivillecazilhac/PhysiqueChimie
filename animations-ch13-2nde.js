/* Animations du chapitre 13 — 2nde — « Transformation physique ».
   initStateChanges (6 changements d'état), initStatesMicro (états microscopiques),
   initTemperaturePlateau (palier), initStateEquation (équation), initStateEnergy (Q = m × L),
   initMixtureMethod (méthode des mélanges). */

var C13 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  ice: "#9fd3e6", board: "#16261f", line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.13)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
function c13N(v) { return Math.round(v * 100) / 100; }
function c13El(id) { return id ? document.getElementById(id) : null; }
function c13Listen(el, type, fn) {
  if (!el) return;
  el.__c13H = el.__c13H || {};
  if (el.__c13H[type]) el.removeEventListener(type, el.__c13H[type]);
  el.__c13H[type] = fn;
  el.addEventListener(type, fn);
}
function c13Text(x, y, txt, color, size, anchor, hand, weight, op) {
  return '<text transform="translate(' + c13N(x) + " " + c13N(y) + ') scale(0.25)" font-size="' + c13N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C13.hand : C13.font) + '" text-anchor="' + (anchor || "start") + '"'
    + (weight ? ' font-weight="' + weight + '"' : "") + (op != null ? ' opacity="' + c13N(op) + '"' : "") + ">" + txt + "</text>";
}
function c13Fr(v, d) { return Number(v).toFixed(d).replace(".", ","); }
function c13Num(v) {
  var neg = v < 0, a = Math.abs(Math.round(v * 10) / 10), p = String(a).split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  return (neg ? "−" : "") + p.join(",");
}
function c13Strong(t, c) { return '<strong style="color:' + (c || C13.yellow) + '">' + t + "</strong>"; }
function c13Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C13.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C13.yellow : C13.dim;
  });
}
function ch13Loop(svg, fn) {
  if (svg.__c13Loop) svg.__c13Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c13Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
function c13Head(x, y, dx, dy, color, size) {
  var l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l, s = size || 4;
  var bx = x - ux * s, by = y - uy * s;
  return '<polygon points="' + c13N(x) + "," + c13N(y) + " " + c13N(bx - uy * s * 0.55) + "," + c13N(by + ux * s * 0.55) + " "
    + c13N(bx + uy * s * 0.55) + "," + c13N(by - ux * s * 0.55) + '" fill="' + color + '"/>';
}
function c13Tri(u) { u = ((u % 2) + 2) % 2; return u > 1 ? 2 - u : u; }

/* Particules d'un état : S ordonné, L compact désordonné, G dispersé. */
var C13_LIQ = [[-0.62, 0.55], [-0.12, 0.6], [0.4, 0.52], [0.66, 0.1], [-0.4, 0.15], [0.12, 0.18], [-0.66, -0.25], [0.3, -0.22]];
function c13Particles(state, cx, cy, w, h, t, color) {
  var r = Math.min(w, h) / 11, s = "", i, x, y;
  function dot(px, py) { s += '<circle cx="' + c13N(px) + '" cy="' + c13N(py) + '" r="' + c13N(r) + '" fill="' + color + '"/>'; }
  if (state === "S") {
    var sp = r * 2.25;
    for (i = 0; i < 9; i++) {
      x = cx + ((i % 3) - 1) * sp + 0.18 * r * Math.sin(t * 11 + i * 1.9);
      y = cy + (Math.floor(i / 3) - 1) * sp + 0.18 * r * Math.cos(t * 13 + i * 2.3);
      dot(x, y);
    }
  } else if (state === "L") {
    C13_LIQ.forEach(function (p, k) {
      dot(cx + p[0] * (w / 2 - r * 1.3) + 0.5 * r * Math.sin(t * 1.6 + k * 1.7),
        cy + p[1] * (h / 2 - r * 1.3) + 0.35 * r * Math.cos(t * 1.9 + k * 1.3));
    });
  } else {
    var V = [[0.37, 0.29], [0.23, 0.41], [0.31, 0.19], [0.43, 0.33], [0.19, 0.27]];
    V.forEach(function (v, k) {
      dot(cx - w / 2 + r * 1.2 + (w - r * 2.4) * c13Tri(t * v[0] + k * 0.37),
        cy - h / 2 + r * 1.2 + (h - r * 2.4) * c13Tri(t * v[1] + k * 0.61));
    });
  }
  return s;
}
var C13_STATE = { S: { name: "Solide", col: C13.ice }, L: { name: "Liquide", col: C13.teal }, G: { name: "Gaz", col: C13.chalk } };

/* ---------- 1. Les 6 changements d'état ---------- */
function initStateChanges(cfg) {
  var svg = c13El(cfg.svgId), readout = c13El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 220 160");
  var btns = (cfg.buttonIds || []).map(c13El);
  var POS = { S: 36, L: 110, G: 184 }, CY = 84, BW = 44, BH = 46;
  function line(x1, y, x2) { return { p: function (u) { return [x1 + (x2 - x1) * u, y]; }, d: [x2 - x1, 0] }; }
  function arc(x1, y1, cx, cy, x2, y2) {
    return { p: function (u) { var a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * x1 + b * cx + c * x2, a * y1 + b * cy + c * y2]; }, d: [x2 - cx, y2 - cy], q: [x1, y1, cx, cy, x2, y2] };
  }
  var T = [
    { k: "fusion", from: "S", to: "L", name: "Fusion", type: "endo", g: line(61, 76, 85) },
    { k: "solidification", from: "L", to: "S", name: "Solidification", type: "exo", g: line(85, 92, 61) },
    { k: "vaporisation", from: "L", to: "G", name: "Vaporisation", type: "endo", g: line(135, 76, 159) },
    { k: "liquefaction", from: "G", to: "L", name: "Liquéfaction", type: "exo", g: line(159, 92, 135) },
    { k: "sublimation", from: "S", to: "G", name: "Sublimation", type: "endo", g: arc(50, 60, 110, 18, 170, 60) },
    { k: "condensation", from: "G", to: "S", name: "Condensation", type: "exo", g: arc(170, 108, 110, 150, 50, 108) }
  ];
  var cur = 0;
  function path(g, color, w) {
    var a = g.p(0), b = g.p(0.97), s;
    if (g.q) s = '<path d="M' + g.q[0] + " " + g.q[1] + " Q" + g.q[2] + " " + g.q[3] + " " + c13N(b[0]) + " " + c13N(b[1]) + '" fill="none" stroke="' + color + '" stroke-width="' + w + '"/>';
    else s = '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + c13N(b[0]) + '" y2="' + b[1] + '" stroke="' + color + '" stroke-width="' + w + '"/>';
    var e = g.p(1);
    return s + c13Head(e[0], e[1], g.d[0], g.d[1], color, 2.2 + w * 1.3);
  }
  function draw(t) {
    var tr = T[cur], col = tr.type === "endo" ? C13.teal : C13.coral, s = "";
    s += c13Text(110, 17, tr.name, C13.yellow, 13, "middle", true, 700);
    T.forEach(function (o, i) { if (i !== cur) s += path(o.g, C13.faint, 1.1); });
    s += path(tr.g, C13.yellow, 2.2);
    for (var k = 0; k < 3; k++) {
      var p = tr.g.p(((t * 0.55) + k / 3) % 1);
      s += '<circle cx="' + c13N(p[0]) + '" cy="' + c13N(p[1]) + '" r="1.7" fill="' + C13.chalk + '"/>';
    }
    ["S", "L", "G"].forEach(function (st) {
      var x = POS[st], on = st === tr.from || st === tr.to, isTo = st === tr.to;
      s += '<rect x="' + (x - BW / 2) + '" y="' + (CY - BH / 2) + '" width="' + BW + '" height="' + BH + '" rx="5" fill="' + (on ? "rgba(232,196,104,0.10)" : "rgba(0,0,0,0.18)")
        + '" stroke="' + (isTo ? C13.yellow : on ? C13.dim : C13.line) + '" stroke-width="' + (on ? 1.4 : 0.9) + '"' + (on && !isTo ? ' stroke-dasharray="3 2"' : "") + "/>";
      s += c13Particles(st, x, CY, BW - 6, BH - 6, t, C13_STATE[st].col);
      s += c13Text(x, CY + BH / 2 + 10, C13_STATE[st].name, on ? C13.chalk : C13.dim, 7, "middle", false, on ? 600 : 400);
    });
    s += c13Text(110, 154, tr.from + " → " + tr.to + "  ·  " + (tr.type === "endo" ? "endothermique (Q > 0)" : "exothermique (Q < 0)"), col, 7.5, "middle", false, 600);
    svg.innerHTML = s;
  }
  function select(i) {
    cur = i; c13Toggle(btns, i);
    var tr = T[i], col = tr.type === "endo" ? C13.teal : C13.coral;
    if (readout) readout.innerHTML = c13Strong(tr.name) + " : " + C13_STATE[tr.from].name.toLowerCase() + " → " + C13_STATE[tr.to].name.toLowerCase()
      + ". C'est une transformation " + c13Strong(tr.type === "endo" ? "endothermique (Q > 0)" : "exothermique (Q < 0)", col)
      + (tr.type === "endo" ? " : l'espèce reçoit de l'énergie, le milieu extérieur se refroidit." : " : l'espèce cède de l'énergie, le milieu extérieur se réchauffe.");
  }
  btns.forEach(function (b, i) { c13Listen(b, "click", function () { select(i); }); });
  select(cfg.start || 0);
  ch13Loop(svg, draw);
}

/* ---------- 1 bis. Les trois états à l'échelle microscopique ---------- */
function initStatesMicro(cfg) {
  var svg = c13El(cfg.svgId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 112");
  var D = { S: "compact et ordonné", L: "compact et désordonné", G: "dispersé et désordonné" };
  ch13Loop(svg, function (t) {
    var s = "";
    ["S", "L", "G"].forEach(function (st, i) {
      var x = 40 + i * 80;
      s += '<rect x="' + (x - 32) + '" y="6" width="64" height="60" rx="6" fill="rgba(0,0,0,0.2)" stroke="' + C13.line + '" stroke-width="0.9"/>';
      s += c13Particles(st, x, 36, 56, 52, t, C13_STATE[st].col);
      s += c13Text(x, 80, C13_STATE[st].name, C13_STATE[st].col, 9, "middle", true, 700);
      s += c13Text(x, 90, D[st], C13.dim, 5.6, "middle");
    });
    s += '<line x1="14" y1="102" x2="222" y2="102" stroke="' + C13.yellow + '" stroke-width="0.9"/>' + c13Head(226, 102, 1, 0, C13.yellow, 3.5);
    s += c13Text(120, 99, "agitation des molécules croissante", C13.yellow, 5.6, "middle");
    svg.innerHTML = s;
  });
}

/* ---------- 2. Palier de température ---------- */
function initTemperaturePlateau(cfg) {
  var svg = c13El(cfg.svgId), readout = c13El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 260 155");
  var bF = c13El(cfg.btnFusionId), bV = c13El(cfg.btnVapoId);
  var M = {
    fusion: { min: -20, max: 40, Tp: 0, pts: [[0, -20], [0.28, 0], [0.64, 0], [1, 40]], ph: ["S", "L"], lab: "T_fus" },
    vapo: { min: 20, max: 130, Tp: 100, pts: [[0, 20], [0.3, 100], [0.68, 100], [1, 130]], ph: ["L", "G"], lab: "T_éb" }
  };
  var mode = "fusion", x0 = 34, x1 = 246, yT = 16, yB = 128;
  function X(f) { return x0 + 6 + f * (x1 - x0 - 16); }
  function Y(T, m) { return yB - 10 - (T - m.min) / (m.max - m.min) * (yB - yT - 20); }
  function at(m, f) {
    for (var i = 1; i < m.pts.length; i++) {
      var a = m.pts[i - 1], b = m.pts[i];
      if (f <= b[0]) { var u = (f - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * u; }
    }
    return m.pts[m.pts.length - 1][1];
  }
  function draw(t) {
    var m = M[mode], s = "", cyc = 8, f = Math.min(1, (t % cyc) / (cyc - 1.4));
    var A = C13_STATE[m.ph[0]], B = C13_STATE[m.ph[1]], yp = Y(m.Tp, m);
    s += '<line x1="' + x0 + '" y1="' + yB + '" x2="' + (x1 + 4) + '" y2="' + yB + '" stroke="' + C13.line + '" stroke-width="1"/>' + c13Head(x1 + 8, yB, 1, 0, C13.line, 3.5);
    s += '<line x1="' + x0 + '" y1="' + yB + '" x2="' + x0 + '" y2="' + (yT - 2) + '" stroke="' + C13.line + '" stroke-width="1"/>' + c13Head(x0, yT - 6, 0, -1, C13.line, 3.5);
    s += c13Text(x0 + 5, yT - 2, "T (°C)", C13.dim, 6.5);
    s += c13Text(x1 + 6, yB + 10, "t", C13.dim, 7, "end");
    s += '<line x1="' + x0 + '" y1="' + c13N(yp) + '" x2="' + c13N(X(m.pts[1][0])) + '" y2="' + c13N(yp) + '" stroke="' + C13.yellow + '" stroke-width="0.7" stroke-dasharray="2.5 2"/>';
    s += c13Text(x0 - 4, yp + 2.4, String(m.Tp), C13.yellow, 7, "end", false, 600);
    var d = "", n = 60;
    for (var i = 0; i <= n; i++) { var g = f * i / n; d += (i ? " L" : "M") + c13N(X(g)) + " " + c13N(Y(at(m, g), m)); }
    s += '<path d="M' + X(0) + " " + Y(m.pts[0][1], m) + m.pts.slice(1).map(function (p) { return " L" + c13N(X(p[0])) + " " + c13N(Y(p[1], m)); }).join("") + '" fill="none" stroke="' + C13.faint + '" stroke-width="1.6"/>';
    s += '<path d="' + d + '" fill="none" stroke="' + C13.teal + '" stroke-width="2.2" stroke-linejoin="round"/>';
    var pm = (m.pts[1][0] + m.pts[2][0]) / 2;
    s += c13Text(X(pm), yp - 7, "palier : " + A.name.toLowerCase() + " + " + B.name.toLowerCase(), C13.yellow, 6.5, "middle", false, 600);
    s += c13Text(X(m.pts[1][0] * 0.5) + 6, Y(at(m, m.pts[1][0] * 0.5), m) + 12, A.name, A.col, 7, "start", true, 700);
    s += c13Text(X((m.pts[2][0] + 1) / 2) - 4, Y(at(m, (m.pts[2][0] + 1) / 2), m) + 4, B.name, B.col, 7, "end", true, 700);
    var T = at(m, f), cx = X(f), cyy = Y(T, m), ph = f < m.pts[1][0] ? [A] : f < m.pts[2][0] ? [A, B] : [B];
    s += '<circle cx="' + c13N(cx) + '" cy="' + c13N(cyy) + '" r="3" fill="' + C13.yellow + '"/>';
    s += '<rect x="166" y="' + (yB - 30) + '" width="78" height="24" rx="4" fill="rgba(0,0,0,0.35)" stroke="' + C13.faint + '" stroke-width="0.8"/>';
    s += c13Text(205, yB - 20, "T = " + c13Fr(T, 0).replace("-", "−") + " °C", C13.chalk, 7.5, "middle", false, 600);
    s += c13Text(205, yB - 10, ph.map(function (p) { return p.name.toLowerCase(); }).join(" + "), ph.length > 1 ? C13.yellow : ph[0].col, 6.5, "middle");
    svg.innerHTML = s;
  }
  function select(k) {
    mode = k; c13Toggle([bF, bV], k === "fusion" ? 0 : 1);
    if (readout) readout.innerHTML = k === "fusion"
      ? "Pendant la " + c13Strong("fusion") + " de l'eau, la température reste constante à " + c13Strong("T<sub>fus</sub> = 0 °C") + " : le solide et le liquide coexistent."
      : "Pendant la " + c13Strong("vaporisation") + " de l'eau, la température reste constante à " + c13Strong("T<sub>éb</sub> = 100 °C") + " : le liquide et le gaz coexistent.";
    if (svg.__c13Loop) svg.__c13Loop.t0 = performance.now();
  }
  c13Listen(bF, "click", function () { select("fusion"); });
  c13Listen(bV, "click", function () { select("vapo"); });
  select("fusion");
  ch13Loop(svg, draw);
}

/* ---------- 3. Équation d'un changement d'état ---------- */
function initStateEquation(cfg) {
  var svg = c13El(cfg.svgId), readout = c13El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 220 100");
  var btns = [cfg.btnFusionId, cfg.btnVapoId, cfg.btnSublimId].map(c13El);
  var EQ = [
    { f: "H₂O", a: "(s)", b: "(ℓ)", name: "Fusion de l'eau", desc: "passage de l'état solide à l'état liquide." },
    { f: "H₂O", a: "(ℓ)", b: "(g)", name: "Vaporisation de l'eau", desc: "passage de l'état liquide à l'état gazeux." },
    { f: "CO₂", a: "(s)", b: "(g)", name: "Sublimation du dioxyde de carbone", desc: "la neige carbonique passe directement de l'état solide à l'état gazeux." }
  ];
  var cur = 0, tSel = 0;
  function draw(t) {
    var e = EQ[cur], s = "", u = Math.min(1, (t - tSel) / 0.6), y = 56;
    s += c13Text(110, 24, "sens d'évolution", C13.dim, 6.5, "middle");
    s += '<line x1="110" y1="28" x2="110" y2="40" stroke="' + C13.dim + '" stroke-width="0.6"/>';
    s += c13Text(56, y, e.f, C13.chalk, 15, "middle", false, 600);
    s += c13Text(84, y, e.a, C13.yellow, 13, "middle", false, 600);
    var ax = 97 + 27 * u;
    s += '<line x1="97" y1="' + (y - 5) + '" x2="' + c13N(ax - 2) + '" y2="' + (y - 5) + '" stroke="' + C13.teal + '" stroke-width="1.8"/>' + c13Head(ax + 1, y - 5, 1, 0, C13.teal, 5);
    s += c13Text(146, y, e.f, C13.chalk, 15, "middle", false, 600, u);
    s += c13Text(174, y, e.b, C13.yellow, 13, "middle", false, 600, u);
    s += '<line x1="56" y1="63" x2="56" y2="76" stroke="' + C13.dim + '" stroke-width="0.6"/>';
    s += c13Text(56, 84, "formule chimique", C13.dim, 6.5, "middle");
    s += '<line x1="114" y1="80" x2="86" y2="62" stroke="' + C13.dim + '" stroke-width="0.6"/><line x1="142" y1="80" x2="172" y2="62" stroke="' + C13.dim + '" stroke-width="0.6"/>';
    s += c13Text(128, 88, "état physique", C13.yellow, 6.5, "middle");
    svg.innerHTML = s;
  }
  function select(i) {
    cur = i; c13Toggle(btns, i);
    tSel = svg.__c13Loop ? (performance.now() - svg.__c13Loop.t0) / 1000 : 0;
    if (readout) readout.innerHTML = c13Strong(EQ[i].name) + " : " + EQ[i].desc + "<br>(s) solide · (ℓ) liquide · (g) gaz";
  }
  btns.forEach(function (b, i) { c13Listen(b, "click", function () { select(i); }); });
  select(0);
  ch13Loop(svg, draw);
}

/* ---------- 4. Q = m × L ---------- */
function initStateEnergy(cfg) {
  var svg = c13El(cfg.svgId), rM = c13El(cfg.mRangeId), readout = c13El(cfg.readoutId), oM = c13El(cfg.outMId);
  if (!svg || !rM) return;
  svg.setAttribute("viewBox", "0 0 200 170");
  var bF = c13El(cfg.btnFusionId), bV = c13El(cfg.btnVapoId);
  var LV = { fusion: { L: 334, name: "fusion de l'eau", st: "S" }, vapo: { L: 2257, name: "vaporisation de l'eau", st: "L" } };
  var mode = "fusion", hCur = 0, gCur = 0, QMAX = 5 * 2257, HMAX = 124;
  function draw() {
    var m = Number(rM.value), o = LV[mode], other = LV[mode === "fusion" ? "vapo" : "fusion"];
    var Q = m * o.L, h = Q / QMAX * HMAX, g = m * other.L / QMAX * HMAX, s = "";
    hCur += (h - hCur) * 0.14; gCur += (g - gCur) * 0.14;
    s += c13Text(16, 12, "Q = m × L", C13.yellow, 9, "start", true, 700);
    for (var k = 0; k < 5; k++) {
      var yb = 148 - k * 22, fill = Math.max(0, Math.min(1, m - k));
      s += '<rect x="18" y="' + (yb - 20) + '" width="40" height="20" rx="2" fill="none" stroke="' + C13.faint + '" stroke-width="0.7" stroke-dasharray="2 2"/>';
      if (fill > 0) s += '<rect x="18" y="' + c13N(yb - 20 * fill) + '" width="40" height="' + c13N(20 * fill) + '" rx="2" fill="' + C13_STATE[o.st].col + '" opacity="0.85"/>';
      if (fill >= 1) s += c13Text(38, yb - 7.5, "1 kg", C13.board, 6, "middle", false, 600);
    }
    s += c13Text(38, 162, "m = " + c13Fr(m, 1).replace(",0", "") + " kg", C13.chalk, 7.5, "middle", false, 600);
    s += '<line x1="68" y1="96" x2="100" y2="96" stroke="' + C13.dim + '" stroke-width="1.2"/>' + c13Head(106, 96, 1, 0, C13.dim, 4);
    s += c13Text(86, 90, "× L", C13.dim, 7.5, "middle", true, 700);
    s += c13Text(86, 106, c13Num(o.L) + " kJ/kg", C13.dim, 5.2, "middle");
    s += '<line x1="114" y1="148" x2="186" y2="148" stroke="' + C13.line + '" stroke-width="0.9"/>';
    s += '<rect x="130" y="' + c13N(148 - gCur) + '" width="40" height="' + c13N(Math.max(0.1, gCur)) + '" fill="none" stroke="' + C13.dim + '" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.7"/>';
    s += '<rect x="130" y="' + c13N(148 - hCur) + '" width="40" height="' + c13N(Math.max(0.6, hCur)) + '" fill="' + C13.yellow + '" opacity="0.9"/>';
    s += c13Text(150, Math.max(22, 148 - hCur - 4), c13Num(Q) + " kJ", C13.yellow, 7.5, "middle", false, 700);
    s += c13Text(150, 162, "énergie Q", C13.chalk, 7.5, "middle", false, 600);
    svg.innerHTML = s;
  }
  function text() {
    var m = Number(rM.value), o = LV[mode];
    if (oM) oM.textContent = c13Fr(m, 1).replace(",0", "") + " kg";
    if (readout) readout.innerHTML = "Q = m × L = " + c13Fr(m, 1).replace(",0", "") + " kg × " + c13Num(o.L) + " kJ·kg⁻¹ = " + c13Strong(c13Num(m * o.L) + " kJ")
      + " pour la " + o.name + ".<br>Q &gt; 0 : transformation " + c13Strong("endothermique", C13.teal) + ".";
  }
  function select(k) { mode = k; c13Toggle([bF, bV], k === "fusion" ? 0 : 1); text(); }
  c13Listen(rM, "input", text);
  c13Listen(bF, "click", function () { select("fusion"); });
  c13Listen(bV, "click", function () { select("vapo"); });
  select("fusion");
  ch13Loop(svg, draw);
}

/* ---------- 5. Méthode des mélanges ---------- */
function initMixtureMethod(cfg) {
  var svg = c13El(cfg.svgId), readout = c13El(cfg.readoutId);
  var rs = [cfg.q1RangeId, cfg.q2RangeId, cfg.q3RangeId, cfg.q4RangeId].map(c13El);
  var outs = (cfg.outIds || []).map(c13El);
  if (!svg || rs.some(function (r) { return !r; })) return;
  svg.setAttribute("viewBox", "0 0 220 150");
  var cur = [0, 0, 0, 0, 0], Y0 = 76, K = 40 / 500, CL = 50;
  function vals() { var q = rs.map(function (r) { return Number(r.value); }); q.push(-(q[0] + q[1] + q[2] + q[3])); return q; }
  function draw() {
    var q = vals(), s = "";
    s += '<rect x="4" y="4" width="212" height="142" rx="8" fill="none" stroke="' + C13.dim + '" stroke-width="0.9" stroke-dasharray="4 3"/>';
    s += c13Text(12, 15, "système isolé (calorimètre)", C13.dim, 6.5);
    s += c13Text(208, 15, "Q₁ + Q₂ + Q₃ + Q₄ + Q₅ = 0", C13.yellow, 6.5, "end", false, 600);
    s += '<line x1="18" y1="' + Y0 + '" x2="202" y2="' + Y0 + '" stroke="' + C13.line + '" stroke-width="0.9"/>';
    q.forEach(function (v, i) {
      cur[i] += (v * K - cur[i]) * 0.16;
      var h = Math.max(-CL, Math.min(CL, cur[i])), x = 40 + i * 35, last = i === 4;
      var col = last ? C13.yellow : v >= 0 ? C13.teal : C13.coral;
      var top = h >= 0 ? Y0 - h : Y0, hh = Math.max(0.6, Math.abs(h));
      s += '<rect x="' + (x - 10) + '" y="' + c13N(top) + '" width="20" height="' + c13N(hh) + '" fill="' + col + '" opacity="' + (last ? 0.95 : 0.8) + '"/>';
      if (Math.abs(cur[i]) > CL) s += c13Head(x, h >= 0 ? Y0 - CL - 5 : Y0 + CL + 5, 0, h >= 0 ? -1 : 1, col, 4);
      var ty = h >= 0 ? Y0 - Math.abs(h) - (Math.abs(cur[i]) > CL ? 9 : 3) : Y0 + Math.abs(h) + (Math.abs(cur[i]) > CL ? 14 : 8);
      s += c13Text(x, ty, c13Num(v) + " J", col, 6, "middle", false, 600);
      s += c13Text(x, 140, "Q" + "₁₂₃₄₅"[i], last ? C13.yellow : C13.chalk, 8, "middle", true, 700);
    });
    svg.innerHTML = s;
  }
  function text() {
    var q = vals();
    outs.forEach(function (o, i) { if (o) o.textContent = c13Num(q[i]) + " J"; });
    if (readout) readout.innerHTML = "Q₁ + Q₂ + Q₃ + Q₄ + Q₅ = 0<br>" + q.slice(0, 4).map(function (v) { return v < 0 ? "(" + c13Num(v) + ")" : c13Num(v); }).join(" + ")
      + " + Q₅ = 0 → Q₅ = " + c13Strong(c13Num(q[4]) + " J")
      + "<br><span style=\"color:" + C13.teal + "\">Q &gt; 0 : énergie reçue</span> · <span style=\"color:" + C13.coral + "\">Q &lt; 0 : énergie cédée</span>";
  }
  rs.forEach(function (r) { c13Listen(r, "input", text); });
  text();
  ch13Loop(svg, draw);
}
