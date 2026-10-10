/* Animations du chapitre 15 — 2nde — « Lentilles minces convergentes ».
   initLensRays (rayons particuliers), initImageBuild (construction de A'B'),
   initEyeModel (modèle de l'œil réduit, accommodation). */

var C15 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63", blue: "#9fd3e6",
  line: "rgba(242,237,225,0.4)", font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
function c15N(v) { return Math.round(v * 100) / 100; }
function c15El(id) { return id ? document.getElementById(id) : null; }
function c15Listen(el, type, fn) {
  if (!el) return;
  el.__c15H = el.__c15H || {};
  if (el.__c15H[type]) el.removeEventListener(type, el.__c15H[type]);
  el.__c15H[type] = fn;
  el.addEventListener(type, fn);
}
function c15Text(x, y, txt, color, size, anchor, hand, weight, op) {
  return '<text transform="translate(' + c15N(x) + " " + c15N(y) + ') scale(0.25)" font-size="' + c15N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C15.hand : C15.font) + '" text-anchor="' + (anchor || "start") + '"'
    + (weight ? ' font-weight="' + weight + '"' : "") + (op != null ? ' opacity="' + op + '"' : "") + ">" + txt + "</text>";
}
function c15Fr(v, d) { return Number(v).toFixed(d).replace(".", ","); }
function c15Strong(t, c) { return '<strong style="color:' + (c || C15.yellow) + '">' + t + "</strong>"; }
function c15Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C15.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C15.yellow : C15.dim;
  });
}
function ch15Loop(svg, fn) {
  if (svg.__c15Loop) svg.__c15Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c15Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
function c15Line(a, b, color, w, dash, op) {
  return '<line x1="' + c15N(a[0]) + '" y1="' + c15N(a[1]) + '" x2="' + c15N(b[0]) + '" y2="' + c15N(b[1]) + '" stroke="' + color
    + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + (op != null ? ' opacity="' + op + '"' : "") + ' stroke-linecap="round"/>';
}
function c15Head(x, y, dx, dy, color, s) {
  var l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l;
  s = s || 3.4;
  var bx = x - ux * s, by = y - uy * s;
  return '<polygon points="' + c15N(x) + "," + c15N(y) + " " + c15N(bx - uy * s * 0.55) + "," + c15N(by + ux * s * 0.55) + " "
    + c15N(bx + uy * s * 0.55) + "," + c15N(by - ux * s * 0.55) + '" fill="' + color + '"/>';
}
/* Rayon brisé : liste de points, une flèche au milieu de chaque segment, un point lumineux qui circule. */
function c15Path(pts, color, w, t, op) {
  var s = "", tot = 0, segs = [];
  for (var i = 0; i < pts.length - 1; i++) {
    var a = pts[i], b = pts[i + 1], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy);
    segs.push(l); tot += l;
    s += c15Line(a, b, color, w, null, op);
    if (l > 14) s += c15Head(a[0] + dx * 0.5, a[1] + dy * 0.5, dx, dy, color, 2.4 + w);
  }
  if (t != null && tot > 0) {
    var d = ((t * 60) % tot);
    for (var j = 0; j < segs.length; j++) {
      if (d <= segs[j]) {
        var u = d / segs[j], p = pts[j], q = pts[j + 1];
        s += '<circle cx="' + c15N(p[0] + (q[0] - p[0]) * u) + '" cy="' + c15N(p[1] + (q[1] - p[1]) * u) + '" r="1.5" fill="' + color + '"/>';
        break;
      }
      d -= segs[j];
    }
  }
  return s;
}
/* Prolonge la droite (a, b) jusqu'à l'abscisse x. */
function c15At(a, b, x) { return [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])]; }
/* Lentille convergente : segment vertical, flèches vers l'extérieur. */
function c15Lens(x, y1, y2, color) {
  return c15Line([x, y1], [x, y2], color, 1.2) + c15Head(x, y1 - 0.5, 0, -1, color, 4) + c15Head(x, y2 + 0.5, 0, 1, color, 4);
}
function c15Arrow(x, y0, y1, color, w) {
  return c15Line([x, y0], [x, y1], color, w || 1.4) + c15Head(x, y1, 0, y1 - y0, color, 3.6);
}
function c15Tick(x, y, color) { return c15Line([x, y - 2.5], [x, y + 2.5], color, 0.9); }

/* ---------- 1. Les trois rayons particuliers ---------- */
function initLensRays(cfg) {
  var svg = c15El(cfg.svgId), readout = c15El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c15El);
  var X = 120, Y = 80, f = 40, F = [X - f, Y], Fp = [X + f, Y], O = [X, Y];
  var mode = 0;
  var TXT = [
    "Tout rayon incident passant par le " + c15Strong("centre optique O") + " n'est " + c15Strong("pas dévié") + " en traversant la lentille.",
    "Tout rayon incident " + c15Strong("parallèle à l'axe optique") + " émerge de la lentille en passant par le " + c15Strong("foyer image F'") + ".",
    "Tout rayon incident passant par le " + c15Strong("foyer objet F") + " émerge de la lentille " + c15Strong("parallèlement à l'axe optique") + ".",
    "Les trois rayons issus d'un même point B se coupent en un même point " + c15Strong("B'") + " : c'est l'image de B."
  ];
  function draw(t) {
    var s = "";
    s += c15Line([4, Y], [236, Y], C15.line, 0.7, "3 2");
    s += c15Text(234, Y - 4, "Δ", C15.dim, 7, "end", true);
    s += c15Lens(X, 18, 142, C15.chalk);
    s += c15Text(X + 4, 16, "lentille", C15.dim, 5.6);
    s += c15Tick(F[0], Y, C15.chalk) + c15Tick(Fp[0], Y, C15.chalk);
    s += c15Text(F[0], Y - 5, "F", C15.chalk, 7, "middle", true, 700);
    s += c15Text(Fp[0], Y - 5, "F'", C15.chalk, 7, "middle", true, 700);
    s += c15Text(X - 3, Y + 9, "O", C15.chalk, 7, "end", true, 700);
    var tt = function (k) { return t + k * 0.9; };
    if (mode === 0) {
      [-0.42, 0.18, 0.5].forEach(function (m, k) {
        var a = [8, Y - m * (X - 8)], b = [232, Y + m * (232 - X)];
        s += c15Path([a, O, b], C15.teal, 1.2, tt(k));
      });
    } else if (mode === 1) {
      [48, 62, 102].forEach(function (y, k) {
        var L = [X, y];
        s += c15Path([[8, y], L, c15At(L, Fp, 232)], C15.blue, 1.2, tt(k));
      });
    } else if (mode === 2) {
      [46, 60, 104].forEach(function (y, k) {
        var L = [X, y];
        s += c15Path([c15At(L, F, 8), L, [232, y]], C15.coral, 1.2, tt(k));
      });
    } else {
      var B = [40, 50], A = [40, Y], Bp = [200, 110];
      s += c15Arrow(40, Y, 50, C15.chalk, 1.4);
      s += c15Text(36, 48, "B", C15.chalk, 7, "end", true, 700);
      s += c15Path([B, O, c15At(B, O, 232)], C15.teal, 1.1, tt(0));
      s += c15Path([B, [X, 50], c15At([X, 50], Fp, 232)], C15.blue, 1.1, tt(1));
      s += c15Path([B, [X, 110], [232, 110]], C15.coral, 1.1, tt(2));
      s += '<circle cx="' + Bp[0] + '" cy="' + Bp[1] + '" r="2.2" fill="' + C15.yellow + '"/>';
      s += c15Text(Bp[0] + 3, Bp[1] + 9, "B'", C15.yellow, 7.5, null, true, 700);
    }
    svg.innerHTML = s;
  }
  function select(i) { mode = i; c15Toggle(btns, i); if (readout) readout.innerHTML = TXT[i]; }
  btns.forEach(function (b, i) { c15Listen(b, "click", function () { select(i); }); });
  select(cfg.start || 0);
  ch15Loop(svg, draw);
}

/* ---------- 2. Construction de l'image A'B' ---------- */
function initImageBuild(cfg) {
  var svg = c15El(cfg.svgId), readout = c15El(cfg.readoutId), range = c15El(cfg.rangeId), out = c15El(cfg.outId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c15El);
  var X = 120, Y = 72, K = 3, fcm = 10, f = fcm * K, ABcm = 6, h = ABcm * K;
  var O = [X, Y], F = [X - f, Y], Fp = [X + f, Y];
  var step = 2;
  function dcm() { return range ? Number(range.value) : 25; }
  function draw(t) {
    var d = dcm(), xa = X - d * K, B = [xa, Y - h], s = "";
    var real = d > fcm, OAp = real ? d * fcm / (d - fcm) : null;
    s += c15Line([4, Y], [236, Y], C15.line, 0.7, "3 2");
    s += c15Text(234, Y - 4, "Δ", C15.dim, 7, "end", true);
    s += c15Lens(X, 14, 142, C15.chalk);
    s += c15Tick(F[0], Y, C15.chalk) + c15Tick(Fp[0], Y, C15.chalk);
    s += c15Text(F[0], Y + 10, "F", C15.chalk, 7, "middle", true, 700);
    s += c15Text(Fp[0], Y - 5, "F'", C15.chalk, 7, "middle", true, 700);
    s += c15Text(X - 3, Y - 5, "O", C15.chalk, 7, "end", true, 700);
    s += c15Arrow(xa, Y, Y - h, C15.chalk, 1.6);
    s += c15Text(xa, Y + 10, "A", C15.chalk, 7, "middle", true, 700);
    s += c15Text(xa - 3, Y - h - 2, "B", C15.chalk, 7, "end", true, 700);
    s += c15Path([B, O, c15At(B, O, 238)], C15.teal, 1.1, t);
    s += c15Path([B, [X, Y - h], c15At([X, Y - h], Fp, 238)], C15.blue, 1.1, t + 0.8);
    if (step >= 1 && d > fcm + 0.01) {
      var L = c15At(B, F, X);
      s += c15Path([B, L, [238, L[1]]], C15.coral, 1.1, t + 1.6);
    }
    if (step >= 2 && real) {
      var xb = X + OAp * K, yb = Y + h * OAp / d;
      if (xb < 236 && yb < 148) {
        s += '<circle cx="' + c15N(xb) + '" cy="' + c15N(yb) + '" r="2" fill="' + C15.yellow + '"/>';
        s += c15Line([xb, yb], [xb, Y], C15.yellow, 0.7, "1.6 1.4", 0.8);
        s += c15Arrow(xb, Y, yb, C15.yellow, 1.6);
        s += c15Text(xb + 3, Y - 4, "A'", C15.yellow, 7, null, true, 700);
        s += c15Text(xb + 3, yb + 8, "B'", C15.yellow, 7, null, true, 700);
      }
    }
    s += c15Text(6, 146, "f' = 10 cm · AB = 6 cm", C15.dim, 5.4);
    svg.innerHTML = s;
  }
  function update() {
    var d = dcm();
    if (out) out.textContent = "OA = " + d + " cm";
    if (!readout) return;
    if (d <= fcm) {
      readout.innerHTML = "L'objet est entre F et la lentille (OA ≤ <em>f'</em>) : les rayons émergents ne se coupent pas."
        + "<br>" + c15Strong("Pas d'image réelle", C15.coral) + " sur un écran.";
      return;
    }
    var OAp = d * fcm / (d - fcm), g = OAp / d, ABp = ABcm * g;
    var far = X + OAp * K >= 236 || Y + h * g >= 148;
    readout.innerHTML = "OA' = " + c15Strong(c15Fr(OAp, 1) + " cm") + (far ? " (hors du cadre)" : "")
      + "<br>A'B' = " + c15Strong(c15Fr(ABp, 1) + " cm") + " · |γ| = " + c15Strong(c15Fr(g, 2))
      + '<br><span style="color:' + C15.dim + '">Image réelle, renversée, ' + (g > 1.005 ? "plus grande" : g < 0.995 ? "plus petite" : "de même taille") + " que l'objet.</span>";
  }
  function select(i) { step = i; c15Toggle(btns, i); update(); }
  btns.forEach(function (b, i) { c15Listen(b, "click", function () { select(i); }); });
  c15Listen(range, "input", update);
  select(cfg.start != null ? cfg.start : 2);
  ch15Loop(svg, draw);
}

/* ---------- 3. Modèle de l'œil réduit et accommodation ---------- */
var C15_EYE_D = [25, 30, 40, 50, 75, 100, 200, 500, Infinity];
function initEyeModel(cfg) {
  var svg = c15El(cfg.svgId), readout = c15El(cfg.readoutId), range = c15El(cfg.rangeId), out = c15El(cfg.outId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c15El);
  var X = 92, Y = 72, k = 5.3, R = 17, xr = X + R * k;
  var accom = 0;
  function Dmm() { var i = range ? Number(range.value) : 0; return C15_EYE_D[i] * 10; }
  function fp(D) { return accom === 0 ? (isFinite(D) ? 1 / (1 / R + 1 / D) : R) : R; }
  function draw(t) {
    var D = Dmm(), f = fp(D), s = "";
    var OAp = isFinite(D) ? 1 / (1 / f - 1 / D) : f;
    var OAd = R + 8 * (OAp - R);
    s += c15Line([4, Y], [236, Y], C15.line, 0.7, "3 2");
    s += c15Text(236, Y - 4, "Δ", C15.dim, 7, "end", true);
    s += c15Line([X - 7, 20], [X - 7, Y - 19], C15.coral, 2.4) + c15Line([X - 7, Y + 19], [X - 7, 124], C15.coral, 2.4);
    s += c15Text(X - 10, 17, "diaphragme (iris)", C15.coral, 5.4, "end");
    s += c15Lens(X, 26, 118, C15.teal);
    s += c15Text(X + 3, 130, "lentille (milieux transparents)", C15.teal, 5.4);
    s += c15Line([xr, 30], [xr, 114], C15.chalk, 2.2);
    s += c15Text(xr + 3, 27, "écran (rétine)", C15.chalk, 5.4);
    var xf = X + f * k;
    s += c15Tick(xf, Y, C15.yellow);
    s += c15Text(xf - 1, Y - 5, "F'", C15.yellow, 7, "end", true, 700);
    s += c15Line([X, 140], [xr, 140], C15.dim, 0.5) + c15Line([X, 137.5], [X, 142.5], C15.dim, 0.5) + c15Line([xr, 137.5], [xr, 142.5], C15.dim, 0.5);
    s += c15Text((X + xr) / 2, 147, "17 mm (fixe)", C15.dim, 5.2, "middle");
    var slope = 0.2, Ix = X + OAd * k, Iy = Y + slope * OAp * k * (OAd / OAp);
    var sharp = Math.abs(OAp - R) < 0.05;
    [-3, 0, 3].forEach(function (yl, j) {
      var L = [X, Y - yl * k], m = isFinite(D) ? (yl / D - slope) : -slope;
      var x0 = 8, y0 = Y - (yl + m * ((x0 - X) / k)) * k;
      var P = [Ix, Iy], end;
      if (Ix <= xr) end = c15At(L, P, xr); else end = c15At(L, P, xr);
      s += c15Path([[x0, y0], L, end], C15.yellow, 0.9, t + j * 0.5);
    });
    if (sharp) s += '<circle cx="' + c15N(xr) + '" cy="' + c15N(Y + slope * R * k) + '" r="2.2" fill="' + C15.yellow + '"/>';
    else s += c15Line([xr, Y + slope * R * k - 4], [xr, Y + slope * R * k + 4], C15.coral, 3, null, 0.7);
    s += c15Text(6, 12, isFinite(D) ? "lumière issue d'un point B situé à " + (D >= 1000 ? c15Fr(D / 1000, 0) + " m" : c15Fr(D / 10, 0) + " cm") : "lumière issue d'un point B très éloigné", C15.dim, 5.4);
    if (accom === 1 && !sharp) s += c15Text(236, 146, "défaut de netteté exagéré", C15.dim, 4.6, "end", false, null, 0.8);
    svg.innerHTML = s;
  }
  function update() {
    var D = Dmm(), f = fp(D);
    var OAp = isFinite(D) ? 1 / (1 / f - 1 / D) : f;
    if (out) out.textContent = isFinite(D) ? (D >= 1000 ? c15Fr(D / 1000, 0) + " m" : c15Fr(D / 10, 0) + " cm") : "très loin";
    if (!readout) return;
    var sharp = Math.abs(OAp - R) < 0.05;
    if (accom === 0) {
      readout.innerHTML = "Distance focale du cristallin : <em>f'</em> = " + c15Strong(c15Fr(f, 1) + " mm")
        + "<br>L'image se forme " + c15Strong("sur la rétine") + " : elle est nette."
        + '<br><span style="color:' + C15.dim + '">' + (f > 16.95 ? "L'objet est suffisamment éloigné : l'œil est au repos." : "Le cristallin se déforme : l'œil accommode.") + "</span>";
    } else {
      readout.innerHTML = "Œil au repos : <em>f'</em> = " + c15Strong("17,0 mm")
        + "<br>" + (sharp ? "L'image se forme " + c15Strong("sur la rétine") + " : elle est nette."
          : "L'image se forme " + c15Strong("derrière la rétine", C15.coral) + " : sur la rétine, la tache est floue.");
    }
  }
  function select(i) { accom = i; c15Toggle(btns, i); update(); }
  btns.forEach(function (b, i) { c15Listen(b, "click", function () { select(i); }); });
  c15Listen(range, "input", update);
  select(cfg.start || 0);
  ch15Loop(svg, draw);
}
