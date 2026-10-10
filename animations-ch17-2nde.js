/* Animations du chapitre 17 — 2nde — « Lois de l'électricité ».
   initBranches (loi des nœuds + loi des mailles en dérivation), initOhm (caractéristique d'un conducteur ohmique),
   initThermistor (courbe d'étalonnage d'une thermistance). */

var C17 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63", blue: "#9fd3e6",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive", line: "rgba(242,237,225,0.14)"
};
function c17N(v) { return Math.round(v * 100) / 100; }
function c17El(id) { return id ? document.getElementById(id) : null; }
function c17Fr(v, d) { return (d == null ? String(v) : Number(v).toFixed(d)).replace(".", ","); }
function c17Listen(el, type, fn) {
  if (!el) return;
  el.__c17H = el.__c17H || {};
  if (el.__c17H[type]) el.removeEventListener(type, el.__c17H[type]);
  el.__c17H[type] = fn;
  el.addEventListener(type, fn);
}
function c17Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c17N(x) + " " + c17N(y) + ') scale(0.25)" font-size="' + c17N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C17.hand : C17.font) + '" text-anchor="' + (anchor || "start") + '"'
    + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function c17Line(x1, y1, x2, y2, c, w, dash) {
  return '<line x1="' + c17N(x1) + '" y1="' + c17N(y1) + '" x2="' + c17N(x2) + '" y2="' + c17N(y2) + '" stroke="' + c + '" stroke-width="' + (w || 1) + '"'
    + (dash ? ' stroke-dasharray="' + dash + '"' : "") + ' stroke-linecap="round"/>';
}
function c17Strong(t, c) { return '<strong style="color:' + (c || C17.yellow) + '">' + t + "</strong>"; }
function c17Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C17.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C17.yellow : C17.dim;
  });
}
function ch17Loop(svg, fn) {
  if (svg.__c17Loop) svg.__c17Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c17Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
/* Petite flèche (tête) au point (x,y) orientée selon (dx,dy). */
function c17Head(x, y, dx, dy, c, s) {
  s = s || 4;
  var L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  var bx = x - ux * s, by = y - uy * s;
  return '<path d="M' + c17N(x) + " " + c17N(y) + " L" + c17N(bx - uy * s * 0.55) + " " + c17N(by + ux * s * 0.55)
    + " L" + c17N(bx + uy * s * 0.55) + " " + c17N(by - ux * s * 0.55) + ' Z" fill="' + c + '"/>';
}
/* Position le long d'une polyligne à l'abscisse curviligne d. */
function c17Along(pts, d) {
  for (var i = 0; i < pts.length - 1; i++) {
    var a = pts[i], b = pts[i + 1], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l) return [a[0] + (b[0] - a[0]) * d / l, a[1] + (b[1] - a[1]) * d / l];
    d -= l;
  }
  return pts[pts.length - 1];
}
function c17Len(pts) {
  var s = 0;
  for (var i = 0; i < pts.length - 1; i++) s += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  return s;
}

/* ---------- 1. Circuit en dérivation : loi des nœuds et loi des mailles ---------- */
function initBranches(cfg) {
  var svg = c17El(cfg.svgId), readout = c17El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var sE = c17El(cfg.eId), s1 = c17El(cfg.r1Id), s2 = c17El(cfg.r2Id);
  var oE = c17El(cfg.eOutId), o1 = c17El(cfg.r1OutId), o2 = c17El(cfg.r2OutId);
  var k0 = cfg.scale || 1;
  function px(v) { return Math.round(v * k0) + "px"; }
  var P = {
    main: [[30, 68], [30, 22], [120, 22]],
    b1: [[120, 22], [120, 128]],
    b2: [[120, 22], [205, 22], [205, 128], [120, 128]],
    ret: [[120, 128], [30, 128], [30, 82]]
  };
  var phase = { main: 0, b1: 0, b2: 0, ret: 0 }, last = 0, vals = {};
  function compute() {
    var E = sE ? +sE.value : 6, R1 = s1 ? +s1.value : 100, R2 = s2 ? +s2.value : 220;
    var I1 = E / R1, I2 = E / R2;
    vals = { E: E, R1: R1, R2: R2, I1: I1, I2: I2, I: I1 + I2 };
    if (oE) oE.textContent = c17Fr(E, 1) + " V";
    if (o1) o1.textContent = R1 + " Ω";
    if (o2) o2.textContent = R2 + " Ω";
    info();
  }
  function dots(key, I, t, col) {
    var pts = P[key], L = c17Len(pts), gap = 9, s = "";
    for (var d = (phase[key] % gap); d < L; d += gap) {
      var p = c17Along(pts, d);
      s += '<circle cx="' + c17N(p[0]) + '" cy="' + c17N(p[1]) + '" r="1.6" fill="' + col + '"/>';
    }
    return s;
  }
  function draw(t) {
    var dt = Math.min(0.05, t - last); last = t;
    var v = 900;
    phase.main += vals.I * v * dt; phase.ret += vals.I * v * dt;
    phase.b1 += vals.I1 * v * dt; phase.b2 += vals.I2 * v * dt;
    var w = "rgba(242,237,225,0.75)", s = "";
    s += '<polyline points="30,68 30,22 205,22 205,128 30,128 30,82" fill="none" stroke="' + w + '" stroke-width="1.2"/>';
    s += c17Line(120, 22, 120, 128, w, 1.2);
    s += dots("main", vals.I, t, C17.yellow) + dots("ret", vals.I, t, C17.yellow) + dots("b1", vals.I1, t, C17.teal) + dots("b2", vals.I2, t, C17.coral);
    /* générateur */
    s += '<rect x="20" y="66" width="20" height="18" fill="#16261f"/>';
    s += c17Line(21, 70, 39, 70, C17.chalk, 1.4) + c17Line(25, 78, 35, 78, C17.chalk, 2.6);
    s += c17Text(43, 68, "+", C17.chalk, 6, "start") + c17Text(43, 86, "−", C17.chalk, 6, "start");
    s += c17Text(13, 78, "P", C17.dim, 5, "end", true) + c17Text(13, 86, "N", C17.dim, 5, "end", true);
    /* résistances */
    s += '<rect x="114" y="60" width="12" height="28" fill="#16261f" stroke="' + C17.teal + '" stroke-width="1.3"/>';
    s += '<rect x="199" y="60" width="12" height="28" fill="#16261f" stroke="' + C17.coral + '" stroke-width="1.3"/>';
    s += c17Text(131, 77, "R₁", C17.teal, 7, "start", true) + c17Text(194, 77, "R₂", C17.coral, 7, "end", true);
    /* nœuds */
    s += '<circle cx="120" cy="22" r="2.4" fill="' + C17.chalk + '"/><circle cx="120" cy="128" r="2.4" fill="' + C17.chalk + '"/>';
    s += c17Text(120, 14, "A", C17.chalk, 6, "middle", true) + c17Text(120, 141, "B", C17.chalk, 6, "middle", true);
    /* flèches d'intensité */
    s += c17Head(80, 22, 1, 0, C17.yellow, 4) + c17Text(75, 16, "I", C17.yellow, 6.5, "middle", true);
    s += c17Head(120, 44, 0, 1, C17.teal, 4) + c17Text(112, 46, "I₁", C17.teal, 6.5, "end", true);
    s += c17Head(170, 22, 1, 0, C17.coral, 4) + c17Text(165, 16, "I₂", C17.coral, 6.5, "middle", true);
    svg.innerHTML = s;
  }
  function mA(i) { return c17Fr(i * 1000, 1); }
  function info() {
    if (!readout) return;
    var x = vals;
    readout.innerHTML =
      "<div><em>I</em><sub>1</sub> = " + c17Strong(mA(x.I1) + " mA", C17.teal) + " · <em>I</em><sub>2</sub> = " + c17Strong(mA(x.I2) + " mA", C17.coral) + "</div>"
      + '<div style="font-family:Kalam,cursive;font-size:' + px(40) + ';color:' + C17.yellow + ';margin:' + px(8) + ' 0;">'
      + "Nœud A : <em>I</em> = <em>I</em><sub>1</sub> + <em>I</em><sub>2</sub> = " + mA(x.I) + " mA</div>"
      + '<div style="color:' + C17.chalk + ';">Mailles : <em>U</em><sub>PN</sub> = <em>U</em><sub>R₁</sub> = <em>U</em><sub>R₂</sub> = ' + c17Strong(c17Fr(x.E, 1) + " V") + "</div>"
      + '<div style="font-size:' + px(25) + ';margin-top:' + px(6) + ';">La branche de plus faible résistance est parcourue par le courant le plus intense.</div>';
  }
  [sE, s1, s2].forEach(function (el) { c17Listen(el, "input", compute); });
  compute();
  ch17Loop(svg, draw);
}

/* ---------- 2. Caractéristique d'un conducteur ohmique ---------- */
var C17_RES = [47, 100, 220];
function initOhm(cfg) {
  var svg = c17El(cfg.svgId), readout = c17El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var sI = c17El(cfg.iId), oI = c17El(cfg.iOutId), meter = c17El(cfg.meterId);
  var rb = (cfg.resIds || []).map(c17El), bM = c17El(cfg.measureId), bC = c17El(cfg.clearId);
  var k0 = cfg.scale || 1, ri = 1, pts = [];
  function px(v) { return Math.round(v * k0) + "px"; }
  var X0 = 30, Y0 = 128, W = 195, H = 112, IMAX = 50, UMAX = 12;
  function gx(i) { return X0 + i / IMAX * W; }
  function gy(u) { return Y0 - u / UMAX * H; }
  function curI() { return sI ? +sI.value : 20; }
  function curU() { return C17_RES[ri] * curI() / 1000; }
  function slope() {
    var n = 0, d = 0;
    pts.forEach(function (p) { n += p.i * p.u; d += p.i * p.i; });
    return d > 0 ? n / d : null;
  }
  function draw() {
    var s = "";
    for (var i = 10; i <= IMAX; i += 10) s += c17Line(gx(i), Y0, gx(i), Y0 - H, C17.line, 0.5) + c17Text(gx(i), Y0 + 8, i, C17.dim, 5, "middle");
    for (var u = 2; u <= UMAX; u += 2) s += c17Line(X0, gy(u), X0 + W, gy(u), C17.line, 0.5) + c17Text(X0 - 3, gy(u) + 1.8, u, C17.dim, 5, "end");
    s += c17Line(X0, Y0, X0 + W + 4, Y0, C17.chalk, 0.9) + c17Head(X0 + W + 6, Y0, 1, 0, C17.chalk, 3.5);
    s += c17Line(X0, Y0, X0, Y0 - H - 4, C17.chalk, 0.9) + c17Head(X0, Y0 - H - 6, 0, -1, C17.chalk, 3.5);
    s += c17Text(X0 + W + 4, Y0 - 4, "I (mA)", C17.chalk, 5.5, "end", true) + c17Text(X0 + 4, Y0 - H - 2, "U (V)", C17.chalk, 5.5, "start", true);
    s += c17Text(X0 - 3, Y0 + 8, "0", C17.dim, 5, "end");
    var k = pts.length >= 2 ? slope() : null;
    if (k != null) {
      var iEnd = Math.min(IMAX, UMAX / k * 1);
      s += c17Line(gx(0), gy(0), gx(iEnd), gy(k * iEnd), C17.yellow, 1, "3 2");
    }
    pts.forEach(function (p) { s += '<circle cx="' + c17N(gx(p.i)) + '" cy="' + c17N(gy(p.u)) + '" r="2.2" fill="' + C17.coral + '"/>'; });
    var ci = curI(), cu = curU();
    if (cu <= UMAX) {
      s += c17Line(gx(ci), Y0, gx(ci), gy(cu), "rgba(232,196,104,0.35)", 0.6, "1.5 1.5") + c17Line(X0, gy(cu), gx(ci), gy(cu), "rgba(232,196,104,0.35)", 0.6, "1.5 1.5");
      s += '<circle cx="' + c17N(gx(ci)) + '" cy="' + c17N(gy(cu)) + '" r="2.6" fill="none" stroke="' + C17.yellow + '" stroke-width="0.9"/>';
    }
    svg.innerHTML = s;
  }
  function info() {
    var ci = curI(), cu = curU();
    if (oI) oI.textContent = ci + " mA";
    if (meter) meter.innerHTML = '<span>Ampèremètre : ' + c17Strong(c17Fr(ci, 1) + " mA", C17.teal) + '</span><span>Voltmètre : '
      + (cu > UMAX ? c17Strong("hors calibre", C17.coral) : c17Strong(c17Fr(cu, 2) + " V")) + "</span>";
    if (!readout) return;
    var k = pts.length >= 2 ? slope() : null;
    if (k == null) {
      readout.innerHTML = pts.length
        ? "1 point mesuré. Encore au moins un point pour tracer la caractéristique."
        : "Régler l'intensité, puis cliquer sur « Mesurer » pour placer le point (<em>I</em> ; <em>U</em>).";
    } else {
      var R = k * 1000;
      readout.innerHTML = pts.length + " points alignés sur une " + c17Strong("droite passant par l'origine") + "."
        + '<div style="font-family:Kalam,cursive;font-size:' + px(38) + ';color:' + C17.yellow + ';margin-top:' + px(8) + ';">'
        + "<em>R</em> = <em>U</em> / <em>I</em> ≈ " + c17Fr(Math.round(R)) + " Ω</div>"
        + '<div style="font-size:' + px(25) + ';">La résistance est le coefficient directeur de la droite (<em>I</em> en ampères).</div>';
    }
  }
  function render() { c17Toggle(rb, ri); draw(); info(); }
  rb.forEach(function (b, i) { c17Listen(b, "click", function () { ri = i; pts = []; render(); }); });
  c17Listen(sI, "input", render);
  c17Listen(bM, "click", function () {
    var ci = curI(), cu = curU();
    if (ci <= 0 || cu > UMAX) return;
    pts = pts.filter(function (p) { return p.i !== ci; });
    pts.push({ i: ci, u: cu });
    render();
  });
  c17Listen(bC, "click", function () { pts = []; render(); });
  render();
}

/* ---------- 3. Courbe d'étalonnage d'une thermistance ---------- */
function c17Rth(T) { return 100 * Math.exp(-0.035 * T); }
function initThermistor(cfg) {
  var svg = c17El(cfg.svgId), readout = c17El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var sT = c17El(cfg.tId), oT = c17El(cfg.tOutId), k0 = cfg.scale || 1;
  function px(v) { return Math.round(v * k0) + "px"; }
  var X0 = 30, Y0 = 128, W = 195, H = 112, TMAX = 80, RMAX = 100;
  function gx(t) { return X0 + t / TMAX * W; }
  function gy(r) { return Y0 - r / RMAX * H; }
  function render() {
    var T = sT ? +sT.value : 20, R = c17Rth(T), s = "";
    for (var t = 10; t <= TMAX; t += 10) s += c17Line(gx(t), Y0, gx(t), Y0 - H, C17.line, 0.5) + c17Text(gx(t), Y0 + 8, t, C17.dim, 5, "middle");
    for (var r = 20; r <= RMAX; r += 20) s += c17Line(X0, gy(r), X0 + W, gy(r), C17.line, 0.5) + c17Text(X0 - 3, gy(r) + 1.8, r, C17.dim, 5, "end");
    s += c17Line(X0, Y0, X0 + W + 4, Y0, C17.chalk, 0.9) + c17Head(X0 + W + 6, Y0, 1, 0, C17.chalk, 3.5);
    s += c17Line(X0, Y0, X0, Y0 - H - 4, C17.chalk, 0.9) + c17Head(X0, Y0 - H - 6, 0, -1, C17.chalk, 3.5);
    s += c17Text(X0 + W + 4, Y0 - 4, "T (°C)", C17.chalk, 5.5, "end", true) + c17Text(X0 + 4, Y0 - H - 2, "R (Ω)", C17.chalk, 5.5, "start", true);
    s += c17Text(X0 - 3, Y0 + 8, "0", C17.dim, 5, "end");
    var d = "";
    for (var x = 0; x <= TMAX; x += 2) d += (x ? " L" : "M") + c17N(gx(x)) + " " + c17N(gy(c17Rth(x)));
    s += '<path d="' + d + '" fill="none" stroke="' + C17.blue + '" stroke-width="1.2"/>';
    for (var m = 0; m <= TMAX; m += 10) s += '<circle cx="' + c17N(gx(m)) + '" cy="' + c17N(gy(c17Rth(m))) + '" r="1.6" fill="' + C17.coral + '"/>';
    s += c17Line(gx(T), Y0, gx(T), gy(R), C17.yellow, 0.7, "2 1.5") + c17Line(X0, gy(R), gx(T), gy(R), C17.yellow, 0.7, "2 1.5");
    s += '<circle cx="' + c17N(gx(T)) + '" cy="' + c17N(gy(R)) + '" r="3" fill="' + C17.yellow + '"/>';
    svg.innerHTML = s;
    if (oT) oT.textContent = T + " °C";
    if (readout) readout.innerHTML =
      '<div>Ohmmètre : <span style="font-family:Kalam,cursive;font-size:' + px(46) + ';color:' + C17.yellow + ';">' + c17Fr(R, 1) + " Ω</span></div>"
      + "<div>À " + c17Strong(T + " °C", C17.chalk) + ", la thermistance a une résistance de " + c17Strong(c17Fr(R, 1) + " Ω") + ".</div>"
      + '<div style="font-size:' + px(25) + ';margin-top:' + px(8) + ';">Quand la température augmente, la résistance diminue. Inversement, une résistance mesurée permet de lire la température sur la courbe.</div>';
  }
  c17Listen(sT, "input", render);
  render();
}
