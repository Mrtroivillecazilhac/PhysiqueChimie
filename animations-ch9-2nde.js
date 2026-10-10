/* Animations du chapitre 9 — 2nde — « Émission et perception d'un son ».
   Utilisées par le site (chapitre9-2nde.html) et par le deck (Chapitre9-2nde-Diapos-de-cours.dc.html).
   Le viewBox de chaque SVG est fixé ici. */

var C9 = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63", red: "#b4483a",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.12)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};

function c9N(v) { return Math.round(v * 100) / 100; }
function c9El(id) { return id ? document.getElementById(id) : null; }
function c9Listen(el, type, fn) {
  if (!el) return;
  el.__c9H = el.__c9H || {};
  if (el.__c9H[type]) el.removeEventListener(type, el.__c9H[type]);
  el.__c9H[type] = fn;
  el.addEventListener(type, fn);
}
function c9Range(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  var v = Number(el.value);
  if (el.value === "" || !isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}
function c9View(svg, vb) { if (svg && svg.getAttribute("viewBox") !== vb) svg.setAttribute("viewBox", vb); }
/* Texte déclaré ×4 puis réduit (contourne la taille de police minimale des navigateurs). */
function c9Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c9N(x) + " " + c9N(y) + ') scale(0.25)" font-size="' + c9N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C9.hand : C9.font) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function c9Fr(v, d) {
  return Number(v).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\u202f/g, "\u00a0");
}
/* 3 chiffres significatifs, virgule décimale. */
function c9Sig(v) {
  return Number(Number(v).toPrecision(3)).toLocaleString("fr-FR", { maximumFractionDigits: 3 }).replace(/\u202f/g, "\u00a0");
}
function c9Sup(s) { return typeof toSuperscript === "function" ? toSuperscript(String(s)) : String(s); }
function c9Pow(v) {
  var e = Math.floor(Math.log10(v) + 1e-9), m = v / Math.pow(10, e);
  m = Math.round(m * 10) / 10;
  if (m >= 10) { m = 1; e += 1; }
  return (m === 1 ? "" : c9Fr(m, 1) + " × ") + "10" + c9Sup(e);
}
function c9Line(t) { return "<div>" + t + "</div>"; }
function c9Strong(t, c) { return '<strong style="color:' + (c || C9.yellow) + '">' + t + "</strong>"; }
function c9Toggle(pairs, isOn) {
  pairs.forEach(function (pr) {
    var b = pr[0]; if (!b) return;
    var on = isOn(pr[1]);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C9.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C9.yellow : C9.dim;
  });
}
/* Boucle rAF liée au SVG ; s'arrête quand il quitte le document, ne dessine pas s'il est masqué. */
function ch9sLoop(svg, fn) {
  if (svg.__c9Loop) svg.__c9Loop.stop = true;
  var L = { stop: false }, t0 = performance.now();
  svg.__c9Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function c9Speaker(x, y, d) {
  return '<rect x="' + (x - 12) + '" y="' + (y - 13) + '" width="10" height="26" rx="2" fill="' + C9.dim + '" opacity="0.55"/>'
    + '<polygon points="' + (x - 2) + "," + (y - 8) + " " + c9N(x + 10 + d) + "," + (y - 24) + " " + c9N(x + 10 + d) + "," + (y + 24) + " " + (x - 2) + "," + (y + 8) + '" fill="rgba(242,237,225,0.08)" stroke="' + C9.chalk + '" stroke-width="1"/>'
    + '<line x1="' + c9N(x + 10 + d) + '" y1="' + (y - 24) + '" x2="' + c9N(x + 10 + d) + '" y2="' + (y + 24) + '" stroke="' + C9.yellow + '" stroke-width="2" stroke-linecap="round"/>';
}

/* ---------- 1. Propagation : air ou vide ---------- */
function initSoundPropagation(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 130");
  var readout = c9El(cfg.readoutId), bAir = c9El(cfg.btnAirId), bVide = c9El(cfg.btnVideId);
  var mode = "air", start = 0, now = 0;
  var X0 = 44, X1 = 200, Y0 = 26, Y1 = 112, F = 0.8, LAMBDA = 34, AMP = 2.4;
  var dots = [], seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (var cx = X0 + 2; cx < X1; cx += 4.6) for (var cy = Y0 + 3; cy < Y1; cy += 5.6) dots.push([cx + (rnd() - 0.5) * 2.2, cy + (rnd() - 0.5) * 2.2]);
  var tracked = [X0 + 2 + 4.6 * 14, 69];
  var v = LAMBDA * F, w = 2 * Math.PI * F, k = 2 * Math.PI / LAMBDA;

  function disp(x, t) {
    var front = X0 + v * t;
    if (x > front) return 0;
    return AMP * Math.sin(w * t - k * (x - X0));
  }
  function frame(t) {
    now = t; var tt = t - start, s = "";
    var d = 1.6 * Math.sin(w * tt);
    s += c9Text(120, 14, "propagation du signal sonore →", C9.teal, 7, "middle", true);
    s += c9Speaker(18, 69, d);
    s += c9Text(16, 104, "haut-parleur", C9.dim, 6, "middle", true);
    s += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" rx="4" fill="none" stroke="' + C9.faint + '"/>';
    var arrived = false;
    if (mode === "air") {
      for (var i = 0; i < dots.length; i++) {
        var p = dots[i];
        s += '<circle cx="' + c9N(p[0] + disp(p[0], tt)) + '" cy="' + c9N(p[1]) + '" r="1.05" fill="' + C9.chalk + '" opacity="0.75"/>';
      }
      var tx = tracked[0];
      s += '<line x1="' + tx + '" y1="' + (tracked[1] - 7) + '" x2="' + tx + '" y2="' + (tracked[1] + 7) + '" stroke="' + C9.yellow + '" stroke-width="0.5" stroke-dasharray="1.5 1.5"/>';
      s += '<circle cx="' + c9N(tx + disp(tx, tt) * 1.15) + '" cy="' + tracked[1] + '" r="2.4" fill="' + C9.yellow + '"/>';
      s += c9Text(tx, Y1 + 9, "une molécule vibre sur place", C9.yellow, 6, "middle", true);
      arrived = X0 + v * tt >= X1;
    } else {
      s += c9Text((X0 + X1) / 2, 72, "vide : aucune molécule", C9.coral, 9, "middle", true);
    }
    var mx = 218;
    s += '<circle cx="' + mx + '" cy="62" r="7" fill="none" stroke="' + (arrived ? C9.teal : C9.dim) + '" stroke-width="1.4"/>';
    s += '<rect x="' + (mx - 2) + '" y="69" width="4" height="16" rx="1.5" fill="' + (arrived ? C9.teal : C9.dim) + '"/>';
    s += c9Text(mx, 96, "micro", C9.dim, 6, "middle", true);
    s += c9Text(mx, 106, arrived ? "son reçu" : (mode === "air" ? "…" : "rien"), arrived ? C9.teal : (mode === "air" ? C9.dim : C9.coral), 6.5, "middle", true, 700);
    svg.innerHTML = s;
  }
  function info() {
    if (!readout) return;
    readout.innerHTML = mode === "air"
      ? c9Line("La membrane du haut-parleur " + c9Strong("vibre") + " et met en mouvement les molécules d'air voisines.")
        + c9Line("Chaque molécule vibre autour de sa position et transmet ce mouvement " + c9Strong("de proche en proche", C9.teal) + ".")
        + c9Line("La matière ne se déplace pas : c'est la vibration qui se propage.")
      : c9Line("La membrane vibre toujours, mais il n'y a " + c9Strong("aucune molécule", C9.coral) + " pour transmettre la vibration.")
        + c9Line("Un signal sonore " + c9Strong("ne se propage pas dans le vide", C9.coral) + " : il a besoin d'un milieu matériel.");
  }
  function set(m) { mode = m; start = now; c9Toggle([[bAir, "air"], [bVide, "vide"]], function (x) { return x === mode; }); info(); }
  c9Listen(bAir, "click", function () { set("air"); });
  c9Listen(bVide, "click", function () { set("vide"); });
  set("air");
  ch9sLoop(svg, frame);
}

/* ---------- 2. Vitesse du son selon le milieu (1 km) ---------- */
function initSoundSpeed(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 130");
  var readout = c9El(cfg.readoutId);
  var M = [
    { id: "air", name: "air", v: 345, btn: c9El(cfg.btnAirId) },
    { id: "eau", name: "eau liquide", v: 1500, btn: c9El(cfg.btnEauId) },
    { id: "acier", name: "acier solide", v: 5000, btn: c9El(cfg.btnAcierId) }
  ];
  var sel = "air", D = 1000, X0 = 52, X1 = 222, CYCLE = 4.2;
  function frame(t) {
    var tc = t % CYCLE, s = "";
    s += '<line x1="' + X0 + '" y1="18" x2="' + X1 + '" y2="18" stroke="' + C9.line + '"/>';
    s += '<line x1="' + X0 + '" y1="15" x2="' + X0 + '" y2="21" stroke="' + C9.dim + '"/><line x1="' + X1 + '" y1="15" x2="' + X1 + '" y2="21" stroke="' + C9.dim + '"/>';
    s += c9Text(X0, 11, "départ", C9.dim, 6, "middle", true);
    s += c9Text(X1, 11, "1 km", C9.dim, 6, "middle", true);
    s += c9Text(137, 11, "t = " + c9Fr(Math.min(tc, 3.5), 1) + " s", C9.chalk, 6.5, "middle", true);
    M.forEach(function (m, i) {
      var y = 42 + i * 34, on = m.id === sel, col = on ? C9.yellow : C9.dim;
      var dt = D / m.v, p = Math.min(1, tc / dt), x = X0 + (X1 - X0) * p;
      s += c9Text(8, y + 2.5, m.name, col, 7, "start", true, on ? 700 : 400);
      s += '<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" stroke="' + (on ? "rgba(232,196,104,0.35)" : C9.faint) + '" stroke-width="5" stroke-linecap="round"/>';
      s += '<line x1="' + X0 + '" y1="' + y + '" x2="' + c9N(x) + '" y2="' + y + '" stroke="' + col + '" stroke-width="1.4" opacity="0.6"/>';
      for (var a = 0; a < 3; a++) {
        var r = 3 + a * 2.6;
        s += '<path d="M ' + c9N(x - 1 + r * 0.2) + " " + c9N(y - r) + " A " + r + " " + r + " 0 0 1 " + c9N(x - 1 + r * 0.2) + " " + c9N(y + r) + '" fill="none" stroke="' + col + '" stroke-width="1" opacity="' + (1 - a * 0.3) + '"/>';
      }
      if (p >= 1) s += c9Text(X1, y + 15, c9Fr(dt, dt < 1 ? 2 : 1) + " s", col, 6.5, "end", true, 700);
    });
    svg.innerHTML = s;
  }
  function info() {
    var m = M.filter(function (x) { return x.id === sel; })[0];
    c9Toggle(M.map(function (x) { return [x.btn, x.id]; }), function (id) { return id === sel; });
    if (!readout) return;
    var dt = D / m.v;
    readout.innerHTML = c9Line("Son dans l'" + (m.id === "air" ? "air" : m.name) + " : " + c9Strong("v = " + c9Fr(m.v, 0) + " m·s⁻¹"))
      + c9Line("Durée pour parcourir 1 km : " + c9Strong(c9Fr(dt, dt < 1 ? 2 : 1) + " s", C9.teal))
      + c9Line("Soit " + c9Strong(c9Fr(m.v / 345, 1).replace(",0", ""), C9.chalk) + " fois la vitesse du son dans l'air.")
      + c9Line("La vitesse de propagation dépend du milieu.");
  }
  M.forEach(function (m) { c9Listen(m.btn, "click", function () { sel = m.id; info(); }); });
  info();
  ch9sLoop(svg, frame);
}

/* Cadre d'oscillogramme commun (0–10 ms, ±50 mV). */
function c9Scope(s, yLabel) {
  var X0 = 30, X1 = 228, YC = 72, H = 50;
  for (var i = 0; i <= 10; i++) {
    var x = X0 + (X1 - X0) * i / 10;
    s += '<line x1="' + c9N(x) + '" y1="' + (YC - H) + '" x2="' + c9N(x) + '" y2="' + (YC + H) + '" stroke="' + C9.faint + '" stroke-width="0.5"/>';
    if (i % 2 === 0) s += c9Text(x, YC + H + 9, String(i), C9.dim, 6, "middle");
  }
  [-40, -20, 20, 40].forEach(function (u) {
    var y = YC - u * H / 50;
    s += '<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" stroke="' + C9.faint + '" stroke-width="0.5"/>';
    s += c9Text(X0 - 3, y + 2, String(u).replace("-", "−"), C9.dim, 6, "end");
  });
  s += '<line x1="' + X0 + '" y1="' + YC + '" x2="' + (X1 + 4) + '" y2="' + YC + '" stroke="' + C9.line + '" stroke-width="0.8"/>';
  s += '<line x1="' + X0 + '" y1="' + (YC + H) + '" x2="' + X0 + '" y2="' + (YC - H - 4) + '" stroke="' + C9.line + '" stroke-width="0.8"/>';
  s += c9Text(X0 - 3, YC + 2, "0", C9.dim, 6, "end");
  s += c9Text(X0 + 2, 14, yLabel || "Tension (mV)", C9.chalk, 6.5, "start", true);
  s += c9Text(X1 + 4, YC + H + 9, "t (ms)", C9.chalk, 6.5, "end", true);
  return { s: s, X0: X0, X1: X1, YC: YC, H: H, tx: function (ms) { return X0 + (X1 - X0) * ms / 10; }, uy: function (mv) { return YC - mv * H / 50; } };
}

/* ---------- 3. Signal périodique : période, fréquence, amplitude ---------- */
function initPeriodicSignal(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 140");
  var fR = c9El(cfg.fRangeId), aR = c9El(cfg.aRangeId), readout = c9El(cfg.readoutId), fOut = c9El(cfg.fOutId), aOut = c9El(cfg.aOutId);
  c9Range(fR, 150, 1000, 10); c9Range(aR, 10, 40, 5);
  function getF() { return fR ? Number(fR.value) : 400; }
  function getA() { return aR ? Number(aR.value) : 30; }
  function frame(t) {
    var f = getF(), A = getA(), T = 1000 / f;
    var sc = c9Scope("", "Tension (mV)"), s = sc.s, pts = [];
    for (var i = 0; i <= 500; i++) {
      var ms = 10 * i / 500;
      pts.push(c9N(sc.tx(ms)) + "," + c9N(sc.uy(A * Math.sin(2 * Math.PI * ms / T))));
    }
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C9.teal + '" stroke-width="1.5" stroke-linejoin="round"/>';
    var t1 = T / 4, t2 = 5 * T / 4, yA = sc.uy(A), yT = sc.uy(A) - 7;
    s += '<line x1="' + c9N(sc.tx(t1)) + '" y1="' + c9N(yA) + '" x2="' + c9N(sc.tx(t1)) + '" y2="' + c9N(yT - 2) + '" stroke="' + C9.yellow + '" stroke-width="0.6" stroke-dasharray="1.5 1.5"/>';
    s += '<line x1="' + c9N(sc.tx(t2)) + '" y1="' + c9N(yA) + '" x2="' + c9N(sc.tx(t2)) + '" y2="' + c9N(yT - 2) + '" stroke="' + C9.yellow + '" stroke-width="0.6" stroke-dasharray="1.5 1.5"/>';
    s += '<line x1="' + c9N(sc.tx(t1) + 2) + '" y1="' + c9N(yT) + '" x2="' + c9N(sc.tx(t2) - 2) + '" y2="' + c9N(yT) + '" stroke="' + C9.yellow + '" stroke-width="1"/>';
    s += '<polygon points="' + c9N(sc.tx(t1)) + "," + c9N(yT) + " " + c9N(sc.tx(t1) + 3) + "," + c9N(yT - 1.6) + " " + c9N(sc.tx(t1) + 3) + "," + c9N(yT + 1.6) + '" fill="' + C9.yellow + '"/>';
    s += '<polygon points="' + c9N(sc.tx(t2)) + "," + c9N(yT) + " " + c9N(sc.tx(t2) - 3) + "," + c9N(yT - 1.6) + " " + c9N(sc.tx(t2) - 3) + "," + c9N(yT + 1.6) + '" fill="' + C9.yellow + '"/>';
    s += c9Text((sc.tx(t1) + sc.tx(t2)) / 2, yT - 2.5, "T", C9.yellow, 8, "middle", true, 700);
    var xa = sc.tx(t1);
    s += '<line x1="' + c9N(xa) + '" y1="' + sc.YC + '" x2="' + c9N(xa) + '" y2="' + c9N(yA + 2) + '" stroke="' + C9.coral + '" stroke-width="1.1"/>';
    s += '<polygon points="' + c9N(xa) + "," + c9N(yA) + " " + c9N(xa - 1.6) + "," + c9N(yA + 3) + " " + c9N(xa + 1.6) + "," + c9N(yA + 3) + '" fill="' + C9.coral + '"/>';
    s += c9Text(xa - 3, (sc.YC + yA) / 2 + 2, "A", C9.coral, 8, "end", true, 700);
    var ms = (t % 3) / 3 * 10;
    s += '<circle cx="' + c9N(sc.tx(ms)) + '" cy="' + c9N(sc.uy(A * Math.sin(2 * Math.PI * ms / T))) + '" r="2.2" fill="' + C9.chalk + '"/>';
    svg.innerHTML = s;
  }
  function info() {
    var f = getF(), A = getA(), T = 1000 / f;
    if (fOut) fOut.textContent = c9Fr(f, 0) + " Hz";
    if (aOut) aOut.textContent = A + " mV";
    if (!readout) return;
    readout.innerHTML = c9Line("Fréquence : " + c9Strong("f = " + c9Fr(f, 0) + " Hz"))
      + c9Line("Période : " + c9Strong("T = 1 / f = " + c9Sig(T) + " ms", C9.yellow) + " = " + c9Sig(T) + " × 10⁻³ s")
      + c9Line("Dans la fenêtre de 10 ms : " + c9Strong(c9Fr(10 / T, 1).replace(",0", "") + " périodes", C9.teal))
      + c9Line("Amplitude : " + c9Strong("A = " + A + " mV", C9.coral));
  }
  c9Listen(fR, "input", info); c9Listen(aR, "input", info);
  info();
  ch9sLoop(svg, frame);
}

/* ---------- 4. Domaines de fréquences et hauteur ---------- */
function initFrequencyDomain(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 120");
  var fR = c9El(cfg.fRangeId), readout = c9El(cfg.readoutId), fOut = c9El(cfg.fOutId);
  c9Range(fR, 0, 5, 0.02);
  var X0 = 16, X1 = 226, YA = 84;
  function lx(e) { return X0 + (X1 - X0) * e / 5; }
  function getE() { return fR ? Number(fR.value) : 2.64; }
  function fmt(f) { return f >= 1000 ? c9Sig(f / 1000) + " kHz" : c9Sig(f) + " Hz"; }
  function dom(f) { return f < 20 ? "infra" : (f > 20000 ? "ultra" : "aud"); }
  var shown = null;
  function frame(t) {
    var target = getE(); shown = shown == null ? target : shown + (target - shown) * 0.2;
    var e = shown, f = Math.pow(10, e), d = dom(f), s = "";
    var a = lx(Math.log10(20)), b = lx(Math.log10(20000));
    s += '<rect x="' + X0 + '" y="46" width="' + c9N(a - X0) + '" height="36" fill="rgba(217,122,99,' + (d === "infra" ? 0.22 : 0.08) + ')"/>';
    s += '<rect x="' + c9N(a) + '" y="46" width="' + c9N(b - a) + '" height="36" fill="rgba(107,191,171,' + (d === "aud" ? 0.24 : 0.09) + ')"/>';
    s += '<rect x="' + c9N(b) + '" y="46" width="' + c9N(X1 - b) + '" height="36" fill="rgba(217,122,99,' + (d === "ultra" ? 0.22 : 0.08) + ')"/>';
    s += c9Text((X0 + a) / 2, 67, "infrasons", d === "infra" ? C9.coral : C9.dim, 7, "middle", true, d === "infra" ? 700 : 400);
    s += c9Text((a + b) / 2, 67, "sons audibles", d === "aud" ? C9.teal : C9.dim, 7.5, "middle", true, d === "aud" ? 700 : 400);
    s += c9Text((b + X1) / 2, 67, "ultrasons", d === "ultra" ? C9.coral : C9.dim, 7, "middle", true, d === "ultra" ? 700 : 400);
    s += '<line x1="' + X0 + '" y1="' + YA + '" x2="' + (X1 + 5) + '" y2="' + YA + '" stroke="' + C9.chalk + '" stroke-width="0.9"/>';
    s += '<polygon points="' + (X1 + 8) + "," + YA + " " + (X1 + 4) + "," + (YA - 2) + " " + (X1 + 4) + "," + (YA + 2) + '" fill="' + C9.chalk + '"/>';
    ["1 Hz", "10 Hz", "100 Hz", "1 kHz", "10 kHz", "100 kHz"].forEach(function (lab, i) {
      s += '<line x1="' + c9N(lx(i)) + '" y1="' + (YA - 2) + '" x2="' + c9N(lx(i)) + '" y2="' + (YA + 2) + '" stroke="' + C9.dim + '"/>';
      if (i !== 1 && i !== 4) s += c9Text(lx(i), YA + 10, lab, C9.dim, 5.5, "middle");
    });
    [[a, "20 Hz"], [b, "20 kHz"]].forEach(function (p) {
      s += '<line x1="' + c9N(p[0]) + '" y1="44" x2="' + c9N(p[0]) + '" y2="' + (YA + 3) + '" stroke="' + C9.yellow + '" stroke-width="0.7" stroke-dasharray="2 1.5"/>';
      s += c9Text(p[0], YA + 20, p[1], C9.yellow, 6.5, "middle", true, 700);
    });
    var x = lx(e);
    s += '<line x1="' + c9N(x) + '" y1="40" x2="' + c9N(x) + '" y2="' + YA + '" stroke="' + C9.chalk + '" stroke-width="1.4"/>';
    s += '<polygon points="' + c9N(x) + "," + (YA - 1) + " " + c9N(x - 3) + "," + (YA - 6) + " " + c9N(x + 3) + "," + (YA - 6) + '" fill="' + C9.chalk + '"/>';
    var bx = Math.max(X0, Math.min(X1 - 70, x - 35)), cyc = 1 + e * 2.2, pts = [];
    s += '<rect x="' + c9N(bx) + '" y="6" width="70" height="30" rx="3" fill="rgba(0,0,0,0.25)" stroke="' + C9.faint + '"/>';
    for (var i = 0; i <= 140; i++) {
      var u = i / 140;
      pts.push(c9N(bx + 3 + 64 * u) + "," + c9N(21 + 10 * Math.sin(2 * Math.PI * (cyc * u - t * 0.6))));
    }
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + (d === "aud" ? C9.teal : C9.coral) + '" stroke-width="1" opacity="' + (d === "aud" ? 1 : 0.6) + '"/>';
    svg.innerHTML = s;
  }
  function info() {
    var f = Math.pow(10, getE()), d = dom(f);
    if (fOut) fOut.textContent = fmt(f);
    if (!readout) return;
    var h = "";
    if (d === "infra") h = c9Line(c9Strong("Infrason", C9.coral) + " : fréquence inférieure à 20 Hz, inaudible pour l'oreille humaine.");
    else if (d === "ultra") h = c9Line(c9Strong("Ultrason", C9.coral) + " : fréquence supérieure à 20 kHz, inaudible pour l'oreille humaine.");
    else h = c9Line(c9Strong("Son audible", C9.teal) + " : 20 Hz ≤ f ≤ 20 kHz.")
      + c9Line(f < 250 ? "Fréquence basse : le son est " + c9Strong("grave") + "." : (f > 2500 ? "Fréquence élevée : le son est " + c9Strong("aigu") + "." : "Plus la fréquence augmente, plus le son devient " + c9Strong("aigu") + "."));
    readout.innerHTML = c9Line("f = " + c9Strong(fmt(f))) + h;
  }
  c9Listen(fR, "input", info);
  info();
  ch9sLoop(svg, frame);
}

/* ---------- 5. Timbre : même période, formes différentes ---------- */
function initTimbre(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 140");
  var readout = c9El(cfg.readoutId);
  var I = [
    { id: "diapason", name: "Diapason", h: [[1, 0]], btn: c9El(cfg.btnDiapasonId) },
    { id: "flute", name: "Flûte", h: [[1, 0], [0.45, 0.6], [0.18, 1.2]], btn: c9El(cfg.btnFluteId) },
    { id: "guitare", name: "Guitare", h: [[1, 0], [0.75, 1.1], [0.55, 0.3], [0.35, 2.0], [0.22, 0.9]], btn: c9El(cfg.btnGuitareId) }
  ];
  I.forEach(function (ins) {
    var m = 0;
    for (var i = 0; i < 400; i++) m = Math.max(m, Math.abs(raw(ins, i / 400)));
    ins.k = 34 / m;
  });
  function raw(ins, u) { var v = 0; ins.h.forEach(function (c, n) { v += c[0] * Math.sin(2 * Math.PI * (n + 1) * u + c[1]); }); return v; }
  var sel = "guitare", T = 2.5;
  function frame(t) {
    var sc = c9Scope("", "Tension (mV)"), s = sc.s, cur = I.filter(function (x) { return x.id === sel; })[0];
    for (var k = 0; k <= 4; k++) {
      var x = sc.tx(k * T);
      s += '<line x1="' + c9N(x) + '" y1="' + (sc.YC - sc.H) + '" x2="' + c9N(x) + '" y2="' + (sc.YC + sc.H) + '" stroke="' + C9.yellow + '" stroke-width="0.6" stroke-dasharray="2 2" opacity="0.7"/>';
    }
    s += c9Text((sc.tx(0) + sc.tx(T)) / 2, sc.YC - sc.H + 7, "T", C9.yellow, 7.5, "middle", true, 700);
    [I[0], cur].forEach(function (ins, j) {
      if (j === 1 && ins === I[0]) return;
      var pts = [];
      for (var i = 0; i <= 500; i++) { var ms = 10 * i / 500; pts.push(c9N(sc.tx(ms)) + "," + c9N(sc.uy(ins.k * raw(ins, ms / T)))); }
      var ref = j === 0 && cur !== I[0];
      s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + (ref ? C9.dim : C9.teal) + '" stroke-width="' + (ref ? 0.8 : 1.5) + '"' + (ref ? ' stroke-dasharray="2 1.5" opacity="0.6"' : "") + ' stroke-linejoin="round"/>';
    });
    var ms = (t % 3) / 3 * 10;
    s += '<circle cx="' + c9N(sc.tx(ms)) + '" cy="' + c9N(sc.uy(cur.k * raw(cur, ms / T))) + '" r="2.2" fill="' + C9.chalk + '"/>';
    s += c9Text(sc.X1, 14, cur.name + (cur !== I[0] ? " · diapason en pointillés" : ""), C9.teal, 6.5, "end", true);
    svg.innerHTML = s;
  }
  function info() {
    c9Toggle(I.map(function (x) { return [x.btn, x.id]; }), function (id) { return id === sel; });
    if (!readout) return;
    readout.innerHTML = c9Line("Période : " + c9Strong("T = 2,5 ms") + " · fréquence : " + c9Strong("f = 400 Hz"))
      + c9Line("Même fréquence pour les trois sources : " + c9Strong("même hauteur", C9.teal) + ".")
      + c9Line(sel === "diapason" ? "Le diapason donne un signal sinusoïdal, de forme très simple." : "La forme du signal est différente de celle du diapason : " + c9Strong("le timbre est différent", C9.coral) + ".");
  }
  I.forEach(function (ins) { c9Listen(ins.btn, "click", function () { sel = ins.id; info(); }); });
  info();
  ch9sLoop(svg, frame);
}

/* ---------- 6. Niveau d'intensité sonore et exposition ---------- */
function initSoundLevel(cfg) {
  var svg = c9El(cfg.svgId); if (!svg) return;
  c9View(svg, "0 0 240 150");
  var lR = c9El(cfg.lRangeId), readout = c9El(cfg.readoutId), lOut = c9El(cfg.lOutId), bD = c9El(cfg.btnDoubleId);
  c9Range(lR, 0, 130, 1);
  var GX = 74, GW = 12, YB = 140, SC = 1;
  function ly(L) { return YB - L * SC; }
  function getL() { return lR ? Number(lR.value) : 60; }
  var EX = [[0, "seuil d'audibilité"], [30, "chuchotement"], [40, "bibliothèque"], [60, "conversation"], [70, "rue animée"], [85, "circulation dense"], [90, "tondeuse à gazon"], [100, "baladeur (maximum légal)"], [105, "discothèque (maximum légal)"], [110, "concert"], [120, "seuil de douleur"], [130, "avion au décollage, de près"]];
  function zone(L) {
    if (L < 80) return ["pas de risque", C9.teal];
    if (L < 90) return ["limite de nocivité", C9.yellow];
    if (L < 120) return ["danger : sons nocifs", C9.coral];
    return ["dommages irréversibles", C9.red];
  }
  function dur(L) {
    if (L < 85) return null;
    if (L >= 120) return "quelques secondes";
    var h = 8 / Math.pow(2, (L - 85) / 3);
    if (h >= 1) { var hh = Math.floor(h + 1e-6), mm = Math.round((h - hh) * 60 / 5) * 5; if (mm === 60) { hh++; mm = 0; } return hh + " h" + (mm ? " " + mm + " min" : "") + " par jour"; }
    var m = h * 60;
    if (m >= 1) return Math.round(m) + " min par jour";
    return Math.round(m * 60) + " s par jour";
  }
  var shown = null;
  function frame() {
    var L = getL(); shown = shown == null ? L : shown + (L - shown) * 0.2;
    var s = "";
    [[0, 80, C9.teal], [80, 90, C9.yellow], [90, 120, C9.coral], [120, 130, C9.red]].forEach(function (b) {
      s += '<rect x="' + GX + '" y="' + ly(b[1]) + '" width="' + GW + '" height="' + (b[1] - b[0]) * SC + '" fill="' + b[2] + '" opacity="0.8"/>';
    });
    s += '<rect x="' + GX + '" y="' + ly(130) + '" width="' + GW + '" height="' + 130 * SC + '" fill="none" stroke="' + C9.line + '"/>';
    s += c9Text(GX + GW + 4, 8, "L (dB)", C9.chalk, 6.5, "start", true);
    s += c9Text(GX - 4, 8, "I (W·m⁻²)", C9.chalk, 6.5, "end", true);
    for (var L0 = 0; L0 <= 130; L0 += 10) {
      var y = ly(L0);
      s += '<line x1="' + (GX + GW) + '" y1="' + y + '" x2="' + (GX + GW + 3) + '" y2="' + y + '" stroke="' + C9.dim + '" stroke-width="0.6"/>';
      s += c9Text(GX + GW + 5, y + 2, String(L0), C9.dim, 6, "start");
      if (L0 % 20 === 0) {
        s += '<line x1="' + (GX - 3) + '" y1="' + y + '" x2="' + GX + '" y2="' + y + '" stroke="' + C9.dim + '" stroke-width="0.6"/>';
        s += c9Text(GX - 5, y + 2, "10" + c9Sup(L0 / 10 - 12), C9.dim, 6, "end");
      }
    }
    var yc = ly(shown), z = zone(L);
    s += '<line x1="' + (GX - 6) + '" y1="' + c9N(yc) + '" x2="' + (GX + GW + 22) + '" y2="' + c9N(yc) + '" stroke="' + C9.chalk + '" stroke-width="1.3"/>';
    s += '<polygon points="' + (GX + GW + 22) + "," + c9N(yc) + " " + (GX + GW + 27) + "," + c9N(yc - 3) + " " + (GX + GW + 27) + "," + c9N(yc + 3) + '" fill="' + C9.chalk + '"/>';
    var RX = 124;
    s += c9Text(RX, 34, c9Fr(L, 0) + " dB", C9.yellow, 18, "start", true, 700);
    s += c9Text(RX, 50, "I = " + c9Pow(1e-12 * Math.pow(10, L / 10)) + " W·m⁻²", C9.chalk, 7.5, "start");
    var ex = EX.filter(function (e) { return e[0] <= L; }).pop();
    s += c9Text(RX, 66, "≈ " + ex[1], C9.dim, 7, "start", true);
    s += '<rect x="' + RX + '" y="80" width="108" height="20" rx="4" fill="' + z[1] + '" opacity="0.18"/>';
    s += c9Text(RX + 6, 93, z[0], z[1], 7.5, "start", true, 700);
    var d = dur(L);
    s += c9Text(RX, 116, "Durée limite d'exposition :", C9.dim, 6.5, "start");
    s += c9Text(RX, 130, d || "pas de limite", d ? C9.chalk : C9.teal, 8, "start", true, 700);
    svg.innerHTML = s;
  }
  function info(extra) {
    var L = getL();
    if (lOut) lOut.textContent = L + " dB";
    if (!readout) return;
    readout.innerHTML = (extra ? c9Line(extra) : "")
      + c9Line("Plus " + c9Strong("L") + " est élevé, plus " + c9Strong("I", C9.chalk) + " est grande : elles varient dans le même sens.")
      + c9Line("+ 10 dB : l'intensité est multipliée par " + c9Strong("10", C9.teal) + " ; + 3 dB : elle est multipliée par " + c9Strong("2", C9.teal) + ".");
  }
  c9Listen(lR, "input", function () { info(); });
  c9Listen(bD, "click", function () {
    if (!lR) return;
    var L = Number(lR.value);
    if (L + 3 > 130) { info(c9Strong("Déjà au maximum de l'échelle.", C9.coral)); return; }
    lR.value = String(L + 3); lR.dataset.userSet = "1";
    info(c9Strong("I × 2", C9.yellow) + " → L passe de " + L + " dB à " + c9Strong((L + 3) + " dB") + " (et non au double).");
  });
  info();
  ch9sLoop(svg, frame);
}
