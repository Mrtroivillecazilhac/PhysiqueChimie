/* Animations du chapitre 14 — 2nde — « Réfraction et réflexion de la lumière ».
   initRayVocab (vocabulaire : normale, angles), initSnellRefraction (n1 sin i1 = n2 sin i2),
   initPrismDispersion (dispersion de la lumière blanche par un prisme). */

var C14 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  board: "#16261f", line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.13)",
  medium: "rgba(107,191,171,0.15)", glass: "rgba(159,211,230,0.16)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
var C14_RAD = Math.PI / 180;
function c14N(v) { return Math.round(v * 100) / 100; }
function c14El(id) { return id ? document.getElementById(id) : null; }
function c14Listen(el, type, fn) {
  if (!el) return;
  el.__c14H = el.__c14H || {};
  if (el.__c14H[type]) el.removeEventListener(type, el.__c14H[type]);
  el.__c14H[type] = fn;
  el.addEventListener(type, fn);
}
function c14Text(x, y, txt, color, size, anchor, hand, weight, op) {
  return '<text transform="translate(' + c14N(x) + " " + c14N(y) + ') scale(0.25)" font-size="' + c14N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C14.hand : C14.font) + '" text-anchor="' + (anchor || "start") + '"'
    + (weight ? ' font-weight="' + weight + '"' : "") + (op != null ? ' opacity="' + c14N(op) + '"' : "") + ">" + txt + "</text>";
}
function c14Sub(t) { return '<tspan baseline-shift="sub" font-size="68%">' + t + "</tspan>"; }
function c14Fr(v, d) { return Number(v).toFixed(d).replace(".", ","); }
function c14Strong(t, c) { return '<strong style="color:' + (c || C14.yellow) + '">' + t + "</strong>"; }
function c14Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C14.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C14.yellow : C14.dim;
  });
}
function ch14Loop(svg, fn) {
  if (svg.__c14Loop) svg.__c14Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c14Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
function c14Head(x, y, dx, dy, color, size) {
  var l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l, s = size || 4;
  var bx = x - ux * s, by = y - uy * s;
  return '<polygon points="' + c14N(x) + "," + c14N(y) + " " + c14N(bx - uy * s * 0.55) + "," + c14N(by + ux * s * 0.55) + " "
    + c14N(bx + uy * s * 0.55) + "," + c14N(by - ux * s * 0.55) + '" fill="' + color + '"/>';
}
function c14Pt(cx, cy, r, th) { return [cx + r * Math.cos(th * C14_RAD), cy + r * Math.sin(th * C14_RAD)]; }
function c14Arc(cx, cy, r, a, b, color, w) {
  if (Math.abs(b - a) < 0.5) return "";
  var p = c14Pt(cx, cy, r, a), q = c14Pt(cx, cy, r, b);
  return '<path d="M' + c14N(p[0]) + " " + c14N(p[1]) + " A" + r + " " + r + " 0 0 " + (b > a ? 1 : 0) + " " + c14N(q[0]) + " " + c14N(q[1])
    + '" fill="none" stroke="' + color + '" stroke-width="' + (w || 1) + '"/>';
}
function c14Line(a, b, color, w, dash, op) {
  return '<line x1="' + c14N(a[0]) + '" y1="' + c14N(a[1]) + '" x2="' + c14N(b[0]) + '" y2="' + c14N(b[1]) + '" stroke="' + color
    + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + (op != null ? ' opacity="' + op + '"' : "") + ' stroke-linecap="round"/>';
}
function c14Lerp(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; }
function c14Ray(a, b, color, w, op) {
  var m = c14Lerp(a, b, 0.55);
  return c14Line(a, b, color, w, null, op) + (op != null && op < 0.3 ? "" : c14Head(m[0], m[1], b[0] - a[0], b[1] - a[1], color, 2.6 + w));
}

/* Scène commune : surface horizontale, milieu 1 en haut, milieu 2 en bas. */
function c14Scene(o) {
  var I = [120, 72], L = 80, s = "";
  var s2 = o.n1 / o.n2 * Math.sin(o.i1 * C14_RAD), i2 = s2 <= 1 ? Math.asin(s2) / C14_RAD : null;
  var hl = o.hl || null, Y = C14.yellow;
  function col(k, base) { return hl === k ? Y : base; }
  function wid(k, w) { return hl === k ? w + 0.9 : w; }
  var S = c14Pt(I[0], I[1], L, -90 - o.i1), R = c14Pt(I[0], I[1], L, -90 + o.i1), T = i2 != null ? c14Pt(I[0], I[1], L, 90 - i2) : null;
  s += '<rect x="0" y="' + I[1] + '" width="240" height="' + (150 - I[1]) + '" fill="' + C14.medium + '"/>';
  s += c14Line([0, I[1]], [240, I[1]], C14.line, 0.9);
  s += c14Text(6, 11, o.lab1, C14.dim, 6.2);
  s += c14Text(6, 145, o.lab2, C14.teal, 6.2, null, false, 600);
  s += c14Text(234, I[1] - 3, "surface de séparation", C14.dim, 5, "end");
  s += c14Line([I[0], 4], [I[0], 146], col("normale", C14.chalk), wid("normale", 0.7), "2.5 2", hl && hl !== "normale" ? 0.45 : 0.85);
  if (o.vocab) s += c14Text(I[0] + 3, 9, "normale", col("normale", C14.dim), 5.6);
  var rOp = o.vocab ? 0.95 : 0.55;
  s += c14Ray(S, I, col("inc", C14.chalk), wid("inc", 1.3));
  s += c14Ray(I, R, col("refl", C14.chalk), wid("refl", 1.0), rOp);
  if (T) s += c14Ray(I, T, col("refr", C14.chalk), wid("refr", 1.3));
  var arcBase = o.vocab ? C14.dim : C14.yellow;
  if (o.i1 > 0.5) {
    s += c14Arc(I[0], I[1], 20, -90 - o.i1, -90, col("inc", arcBase), wid("inc", 0.9));
    var pa = c14Pt(I[0], I[1], 27, -90 - o.i1 / 2);
    s += c14Text(pa[0], pa[1] + 2.5, "i" + c14Sub("1"), col("inc", arcBase), 7.5, "middle", true, 700);
    s += c14Arc(I[0], I[1], 24, -90, -90 + o.i1, col("refl", C14.dim), wid("refl", 0.8));
    var pr = c14Pt(I[0], I[1], 31, -90 + o.i1 / 2);
    s += c14Text(pr[0], pr[1] + 2.5, "i" + c14Sub("R"), col("refl", C14.dim), 7.5, "middle", true, 700);
    if (T && i2 > 0.5) {
      s += c14Arc(I[0], I[1], 22, 90 - i2, 90, col("refr", arcBase), wid("refr", 0.9));
      var pt = c14Pt(I[0], I[1], 29, 90 - i2 / 2);
      s += c14Text(pt[0], pt[1] + 2.5, "i" + c14Sub("2"), col("refr", arcBase), 7.5, "middle", true, 700);
    }
  }
  s += '<circle cx="' + I[0] + '" cy="' + I[1] + '" r="1.4" fill="' + C14.chalk + '"/>';
  if (o.vocab) {
    s += c14Text(I[0] - 4, I[1] + 8, "I", C14.chalk, 6.5, "end", true, 700);
    s += c14Text(S[0] - 2, S[1] + 2, "rayon incident", col("inc", C14.dim), 5.6, "end");
    s += c14Text(R[0] + 2, R[1] + 2, "rayon réfléchi", col("refl", C14.dim), 5.6);
    if (T) s += c14Text(T[0] + 3, T[1] - 4, "rayon réfracté", col("refr", C14.dim), 5.6);
  } else if (o.i1 > 0.5) {
    s += c14Text(236, 22, "i" + c14Sub("1") + " = " + c14Fr(o.i1, 0) + "°", Y, 7.5, "end", true, 700);
    s += c14Text(236, 32, "i" + c14Sub("R") + " = " + c14Fr(o.i1, 0) + "°", C14.dim, 7, "end", true, 700);
    if (T) s += c14Text(236, 132, "i" + c14Sub("2") + " = " + c14Fr(i2, 1) + "°", Y, 7.5, "end", true, 700);
  }
  for (var k = 0; k < 3; k++) {
    var u = ((o.t || 0) * 0.45 + k / 3) % 1, p;
    if (u < 0.5) {
      p = c14Lerp(S, I, u * 2);
      s += '<circle cx="' + c14N(p[0]) + '" cy="' + c14N(p[1]) + '" r="1.6" fill="' + C14.chalk + '"/>';
    } else {
      if (T) { p = c14Lerp(I, T, (u - 0.5) * 2); s += '<circle cx="' + c14N(p[0]) + '" cy="' + c14N(p[1]) + '" r="1.6" fill="' + C14.chalk + '"/>'; }
      p = c14Lerp(I, R, (u - 0.5) * 2);
      s += '<circle cx="' + c14N(p[0]) + '" cy="' + c14N(p[1]) + '" r="1.1" fill="' + C14.chalk + '" opacity="0.55"/>';
    }
  }
  return { svg: s, i2: i2 };
}

/* ---------- 1. Vocabulaire : normale et angles ---------- */
function initRayVocab(cfg) {
  var svg = c14El(cfg.svgId), readout = c14El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c14El);
  var K = ["normale", "inc", "refl", "refr"];
  var TXT = [
    "La " + c14Strong("normale") + " est la droite perpendiculaire à la surface de séparation, au point d'incidence I.",
    "L'" + c14Strong("angle d'incidence <em>i</em>₁") + " est mesuré entre le rayon incident et la normale.",
    "L'" + c14Strong("angle de réflexion <em>i</em><sub>R</sub>") + " est mesuré entre le rayon réfléchi et la normale. Ici <em>i</em><sub>R</sub> = <em>i</em>₁ = 50°.",
    "L'" + c14Strong("angle de réfraction <em>i</em>₂") + " est mesuré entre le rayon réfracté et la normale. Ici <em>i</em>₂ ≈ 35° : le rayon se rapproche de la normale en entrant dans l'eau."
  ];
  var cur = 0;
  function draw(t) {
    svg.innerHTML = c14Scene({ i1: 50, n1: 1, n2: 1.33, hl: K[cur], t: t, vocab: true,
      lab1: "Milieu 1 · air", lab2: "Milieu 2 · eau" }).svg;
  }
  function select(i) {
    cur = i; c14Toggle(btns, i);
    if (readout) readout.innerHTML = TXT[i] + '<br><span style="color:' + C14.coral + '">Chaque angle se mesure par rapport à la normale, jamais par rapport à la surface.</span>';
  }
  btns.forEach(function (b, i) { c14Listen(b, "click", function () { select(i); }); });
  select(cfg.start || 0);
  ch14Loop(svg, draw);
}

/* ---------- 2. Loi de Snell-Descartes pour la réfraction ---------- */
var C14_MEDIA = [
  { name: "eau", n: 1.33 },
  { name: "verre", n: 1.50 },
  { name: "diamant", n: 2.52 }
];
function initSnellRefraction(cfg) {
  var svg = c14El(cfg.svgId), readout = c14El(cfg.readoutId), range = c14El(cfg.rangeId), out = c14El(cfg.outId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c14El);
  var med = 0, last = { i2: 0 };
  function i1() { return range ? Number(range.value) : 40; }
  function draw(t) {
    var m = C14_MEDIA[med];
    last = c14Scene({ i1: i1(), n1: 1, n2: m.n, t: t,
      lab1: "Milieu 1 · air (n₁ = 1,00)", lab2: "Milieu 2 · " + m.name + " (n₂ = " + c14Fr(m.n, 2) + ")" });
    svg.innerHTML = last.svg;
  }
  function update() {
    var a = i1(), m = C14_MEDIA[med], s1 = Math.sin(a * C14_RAD), s2 = s1 / m.n, i2 = Math.asin(s2) / C14_RAD;
    if (out) out.textContent = "i₁ = " + a + "°";
    if (!readout) return;
    if (a === 0) { readout.innerHTML = "Incidence normale (<em>i</em>₁ = 0°) : le rayon traverse la surface " + c14Strong("sans être dévié") + "."; return; }
    readout.innerHTML = "<em>n</em>₁ × sin <em>i</em>₁ = 1,00 × sin " + a + "° = " + c14Fr(s1, 3)
      + "<br>sin <em>i</em>₂ = " + c14Fr(s1, 3) + " / " + c14Fr(m.n, 2) + " = " + c14Fr(s2, 3)
      + "<br><em>i</em>₂ = " + c14Strong(c14Fr(i2, 1) + "°")
      + '<br><span style="color:' + C14.dim + '">' + "<em>n</em>₂ &gt; <em>n</em>₁ : le rayon réfracté se rapproche de la normale.</span>";
  }
  function select(i) { med = i; c14Toggle(btns, i); update(); }
  btns.forEach(function (b, i) { c14Listen(b, "click", function () { select(i); }); });
  c14Listen(range, "input", update);
  select(cfg.start || 0);
  ch14Loop(svg, draw);
}

/* ---------- 3. Dispersion de la lumière blanche par un prisme ---------- */
var C14_SPECTRUM = [
  { name: "rouge", c: "#e5534b" }, { name: "orange", c: "#ee9a3a" }, { name: "jaune", c: "#e8d44d" },
  { name: "vert", c: "#5cc46a" }, { name: "cyan", c: "#4cc3d9" }, { name: "bleu", c: "#4f7be0" }, { name: "violet", c: "#a46ce6" }
];
function c14Refract(d, nrm, n1, n2) {
  var cosi = -(nrm[0] * d[0] + nrm[1] * d[1]), eta = n1 / n2, k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null;
  var f = eta * cosi - Math.sqrt(k);
  return [eta * d[0] + f * nrm[0], eta * d[1] + f * nrm[1]];
}
function c14Hit(P, d, A, B) {
  var ex = B[0] - A[0], ey = B[1] - A[1], den = d[0] * ey - d[1] * ex;
  if (Math.abs(den) < 1e-9) return null;
  var s = ((A[0] - P[0]) * ey - (A[1] - P[1]) * ex) / den;
  return [P[0] + s * d[0], P[1] + s * d[1]];
}
function initPrismDispersion(cfg) {
  var svg = c14El(cfg.svgId), readout = c14El(cfg.readoutId), range = c14El(cfg.rangeId), out = c14El(cfg.outId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c14El);
  var A = [100, 20], B = [40, 124], C = [160, 124], P = [70, 72];
  var nOutL = [-0.866, -0.5], nInR = [-0.866, 0.5];
  var mode = 0;
  function nOf(k) { return 1.5 + 0.1 * k / 6; }
  function i1() { return range ? Number(range.value) : 50; }
  function trace(k) {
    var th = (30 - i1()) * C14_RAD, d = [Math.cos(th), Math.sin(th)], n = nOf(k);
    var t = c14Refract(d, nOutL, 1, n), Q = c14Hit(P, t, A, C), e = Q ? c14Refract(t, nInR, n, 1) : null;
    var D = e ? Math.acos(Math.max(-1, Math.min(1, d[0] * e[0] + d[1] * e[1]))) / C14_RAD : null;
    return { d: d, t: t, Q: Q, e: e, D: D, n: n };
  }
  function list() { return mode === 0 ? [0, 1, 2, 3, 4, 5, 6] : mode === 1 ? [0] : [6]; }
  function draw(time) {
    var s = "", ks = list(), tr0 = trace(ks[Math.floor(ks.length / 2)]);
    var S = [P[0] - 120 * tr0.d[0], P[1] - 120 * tr0.d[1]];
    s += '<polygon points="' + A.join(",") + " " + B.join(",") + " " + C.join(",") + '" fill="' + C14.glass + '" stroke="' + C14.dim + '" stroke-width="0.9"/>';
    s += c14Text(100, 112, "prisme en verre", C14.dim, 5.6, "middle");
    s += c14Line([P[0] - 18 * nOutL[0], P[1] - 18 * nOutL[1]], [P[0] + 18 * nOutL[0], P[1] + 18 * nOutL[1]], C14.chalk, 0.6, "2 1.6", 0.6);
    var col0 = mode === 0 ? C14.chalk : C14_SPECTRUM[ks[0]].c;
    s += c14Ray(S, P, col0, mode === 0 ? 1.8 : 1.5);
    s += c14Text(6, 128, mode === 0 ? "lumière blanche" : "lumière " + C14_SPECTRUM[ks[0]].name, col0, 6, null, true, 700);
    ks.forEach(function (k) {
      var tr = trace(k), c = C14_SPECTRUM[k].c;
      if (!tr.Q) return;
      s += c14Line(P, tr.Q, c, mode === 0 ? 0.6 : 1.3);
      if (tr.e) {
        var E = [tr.Q[0] + 120 * tr.e[0], tr.Q[1] + 120 * tr.e[1]];
        s += c14Line(tr.Q, E, c, mode === 0 ? 1.4 : 1.6);
      }
    });
    if (tr0.Q) s += c14Line([tr0.Q[0] - 16 * nInR[0], tr0.Q[1] - 16 * nInR[1]], [tr0.Q[0] + 16 * nInR[0], tr0.Q[1] + 16 * nInR[1]], C14.chalk, 0.6, "2 1.6", 0.6);
    var u = (time * 0.35) % 1;
    ks.forEach(function (k) {
      var tr = trace(k), p;
      if (!tr.Q) return;
      if (u < 0.45) { if (k !== ks[0]) return; p = c14Lerp(S, P, u / 0.45); }
      else if (u < 0.6) p = c14Lerp(P, tr.Q, (u - 0.45) / 0.15);
      else if (tr.e) p = [tr.Q[0] + 120 * tr.e[0] * (u - 0.6) / 0.4, tr.Q[1] + 120 * tr.e[1] * (u - 0.6) / 0.4];
      else return;
      s += '<circle cx="' + c14N(p[0]) + '" cy="' + c14N(p[1]) + '" r="1.5" fill="' + (u < 0.45 ? col0 : C14_SPECTRUM[k].c) + '"/>';
    });
    if (mode === 0) {
      var tr6 = trace(6), tr1 = trace(0);
      if (tr1.e) s += c14Text(Math.min(232, tr1.Q[0] + 64 * tr1.e[0]), tr1.Q[1] + 64 * tr1.e[1] - 4, "rouge", C14_SPECTRUM[0].c, 6, "middle", true, 700);
      if (tr6.e) s += c14Text(Math.min(232, tr6.Q[0] + 56 * tr6.e[0]) - 6, tr6.Q[1] + 56 * tr6.e[1] + 9, "violet", C14_SPECTRUM[6].c, 6, "middle", true, 700);
    }
    s += c14Text(236, 146, "écarts d'indice exagérés pour la lisibilité", C14.dim, 4.6, "end", false, null, 0.8);
    svg.innerHTML = s;
  }
  function update() {
    if (out) out.textContent = "i₁ = " + i1() + "°";
    if (!readout) return;
    var r = trace(0), v = trace(6);
    if (mode === 0) {
      readout.innerHTML = "Le verre est un " + c14Strong("milieu dispersif") + " : son indice dépend de la radiation."
        + "<br>Rouge : <em>n</em> = " + c14Fr(r.n, 2) + " · déviation " + (r.D != null ? c14Fr(r.D, 0) + "°" : "—")
        + "<br>Violet : <em>n</em> = " + c14Fr(v.n, 2) + " · déviation " + (v.D != null ? c14Fr(v.D, 0) + "°" : "—")
        + "<br>Le " + c14Strong("violet") + " est le plus dévié.";
    } else {
      var tr = mode === 1 ? r : v, nm = mode === 1 ? "rouge" : "violette";
      readout.innerHTML = "Lumière " + nm + " seule : <em>n</em> = " + c14Fr(tr.n, 2) + "."
        + "<br>Elle est réfractée deux fois (entrée puis sortie du prisme) mais " + c14Strong("n'est pas décomposée") + "."
        + "<br>Déviation totale : " + c14Strong(tr.D != null ? c14Fr(tr.D, 0) + "°" : "—") + ".";
    }
  }
  function select(i) { mode = i; c14Toggle(btns, i); update(); }
  btns.forEach(function (b, i) { c14Listen(b, "click", function () { select(i); }); });
  c14Listen(range, "input", update);
  select(cfg.start || 0);
  ch14Loop(svg, draw);
}
