/* Animations du chapitre 10 — 2nde — « Spectres d'émission ».
   Utilisées par le site (chapitre10-2nde.html) et par le deck (Chapitre10-2nde-Diapos-de-cours.dc.html).
   Le viewBox de chaque SVG est fixé ici. */

var C10 = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.12)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};

function c10N(v) { return Math.round(v * 100) / 100; }
function c10El(id) { return id ? document.getElementById(id) : null; }
function c10Listen(el, type, fn) {
  if (!el) return;
  el.__c10H = el.__c10H || {};
  if (el.__c10H[type]) el.removeEventListener(type, el.__c10H[type]);
  el.__c10H[type] = fn;
  el.addEventListener(type, fn);
}
function c10Range(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  var v = Number(el.value);
  if (el.value === "" || !isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}
function c10View(svg, vb) { if (svg && svg.getAttribute("viewBox") !== vb) svg.setAttribute("viewBox", vb); }
/* Texte déclaré ×4 puis réduit (contourne la taille de police minimale des navigateurs). */
function c10Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c10N(x) + " " + c10N(y) + ') scale(0.25)" font-size="' + c10N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C10.hand : C10.font) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function c10Fr(v, d) {
  return Number(v).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\u202f/g, "\u00a0");
}
function c10Line(t) { return "<div>" + t + "</div>"; }
function c10Strong(t, c) { return '<strong style="color:' + (c || C10.yellow) + '">' + t + "</strong>"; }
function c10Toggle(pairs, isOn) {
  pairs.forEach(function (pr) {
    var b = pr[0]; if (!b) return;
    var on = isOn(pr[1]);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C10.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C10.yellow : C10.dim;
  });
}
/* Boucle rAF liée au SVG ; s'arrête quand il quitte le document, ne dessine pas s'il est masqué. */
function ch10sLoop(svg, fn) {
  if (svg.__c10Loop) svg.__c10Loop.stop = true;
  var L = { stop: false }, t0 = performance.now();
  svg.__c10Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
/* Couleur approchée d'une radiation visible (λ en nm), k = luminosité 0–1. null hors du visible. */
function c10Rgb(l, k) {
  if (l < 380 || l > 800) return null;
  var r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; }
  else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = (645 - l) / 65; }
  else { r = 1; }
  var f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : (l > 700 ? 0.3 + 0.7 * (800 - l) / 100 : 1);
  f *= (k === undefined ? 1 : Math.max(0, Math.min(1, k)));
  function c(v) { return Math.round(255 * Math.pow(v * f, 0.8)); }
  return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")";
}
function c10ColorName(l) {
  if (l < 400) return "ultraviolet";
  if (l < 450) return "violet";
  if (l < 490) return "bleu";
  if (l < 560) return "vert";
  if (l < 590) return "jaune";
  if (l < 630) return "orange";
  if (l <= 800) return "rouge";
  return "infrarouge";
}
/* Bande de spectre : segments de 2 nm entre l0 et l1, de x0 à x1. kFn(λ) optionnel. */
function c10Strip(x0, x1, y, h, l0, l1, kFn) {
  var s = "", step = 2;
  for (var l = l0; l < l1; l += step) {
    var xa = x0 + (x1 - x0) * (l - l0) / (l1 - l0), xb = x0 + (x1 - x0) * (l + step - l0) / (l1 - l0);
    var col = c10Rgb(l + step / 2, kFn ? kFn(l + step / 2) : 1) || "#000";
    s += '<rect x="' + c10N(xa) + '" y="' + y + '" width="' + c10N(xb - xa + 0.3) + '" height="' + h + '" fill="' + col + '"/>';
  }
  return s;
}

/* ---------- 1. Vitesse de la lumière : durée de quelques trajets ---------- */
function initLightSpeed(cfg) {
  var svg = c10El(cfg.svgId); if (!svg) return;
  c10View(svg, "0 0 240 130");
  var readout = c10El(cfg.readoutId);
  var C = 3.0e8;
  var T = [
    { id: "lune", btn: c10El(cfg.btnLuneId), a: "Terre", b: "Lune", rA: 10, rB: 4, cA: C10.teal, cB: C10.dim, d: 3.84e8, dStr: "3,84 × 10⁸ m", anim: 1.28, mode: "temps réel", dec: 2 },
    { id: "soleil", btn: c10El(cfg.btnSoleilId), a: "Soleil", b: "Terre", rA: 16, rB: 5, cA: C10.yellow, cB: C10.teal, d: 1.5e11, dStr: "1,50 × 10¹¹ m", anim: 5, mode: "accéléré × 100", dec: 0 },
    { id: "ny", btn: c10El(cfg.btnNyId), a: "Paris", b: "New York", rA: 3, rB: 3, cA: C10.chalk, cB: C10.chalk, d: 5.8e6, dStr: "5,8 × 10⁶ m", anim: 1.93, mode: "ralenti × 100", dec: 3 }
  ];
  var sel = T[0], start = 0, now = 0, XA = 34, XB = 206, Y = 60;
  function frame(t) {
    now = t;
    var m = sel, cyc = m.anim + 1.4, tc = (t - start) % cyc, p = Math.min(1, tc / m.anim), s = "";
    var real = m.d / C, x = XA + m.rA + 2 + (XB - m.rB - 2 - XA - m.rA - 2) * p;
    s += c10Text(120, 14, m.mode, C10.dim, 6.5, "middle", true);
    s += c10Text(120, 30, "Δt = " + c10Fr(real * p, m.dec) + " s", C10.yellow, 9, "middle", true, 700);
    s += '<circle cx="' + XA + '" cy="' + Y + '" r="' + m.rA + '" fill="' + m.cA + '" opacity="0.9"/>';
    s += '<circle cx="' + XB + '" cy="' + Y + '" r="' + m.rB + '" fill="' + m.cB + '" opacity="' + (p >= 1 ? 1 : 0.6) + '"/>';
    s += c10Text(XA, Y + m.rA + 11, m.a, C10.chalk, 6.5, "middle", true);
    s += c10Text(XB, Y + Math.max(m.rB, 5) + 11, m.b, C10.chalk, 6.5, "middle", true);
    s += '<line x1="' + (XA + m.rA + 2) + '" y1="' + Y + '" x2="' + c10N(x) + '" y2="' + Y + '" stroke="' + C10.yellow + '" stroke-width="1.2" opacity="0.55"/>';
    if (p < 1) s += '<circle cx="' + c10N(x) + '" cy="' + Y + '" r="2.4" fill="' + C10.yellow + '"/>';
    else s += c10Text(XB, Y - Math.max(m.rB, 5) - 5, "arrivée", C10.teal, 6.5, "middle", true, 700);
    s += '<line x1="' + XA + '" y1="108" x2="' + XB + '" y2="108" stroke="' + C10.line + '" stroke-width="0.8"/>';
    s += '<line x1="' + XA + '" y1="104" x2="' + XA + '" y2="112" stroke="' + C10.line + '" stroke-width="0.8"/><line x1="' + XB + '" y1="104" x2="' + XB + '" y2="112" stroke="' + C10.line + '" stroke-width="0.8"/>';
    s += c10Text(120, 121, "d = " + m.dStr, C10.dim, 6.5, "middle", true);
    svg.innerHTML = s;
  }
  function info() {
    var m = sel, real = m.d / C;
    c10Toggle(T.map(function (x) { return [x.btn, x.id]; }), function (id) { return id === sel.id; });
    if (!readout) return;
    var extra = m.id === "soleil" ? "Soit environ " + c10Strong("8 min 20 s", C10.teal) + "."
      : m.id === "lune" ? "Un peu plus d'une seconde pour 384 000 km."
      : "Le son, à 345 m·s⁻¹, mettrait environ " + c10Strong("4 h 40 min", C10.coral) + ".";
    readout.innerHTML = c10Line(m.a + " → " + m.b + " : " + c10Strong("d = " + m.dStr, C10.chalk))
      + c10Line("Δt = d / c = " + m.dStr.replace(" m", "") + " / 3,00 × 10⁸")
      + c10Line("Δt = " + c10Strong(c10Fr(real, m.dec) + " s"))
      + c10Line(extra);
  }
  T.forEach(function (m) { c10Listen(m.btn, "click", function () { sel = m; start = now; info(); }); });
  info();
  ch10sLoop(svg, frame);
}

/* ---------- 2. Dispersion par un prisme ---------- */
function initPrism(cfg) {
  var svg = c10El(cfg.svgId); if (!svg) return;
  c10View(svg, "0 0 240 130");
  var readout = c10El(cfg.readoutId);
  var M = [
    { id: "blanche", btn: c10El(cfg.btnBlancheId) },
    { id: "rouge", btn: c10El(cfg.btnRougeId), l: 650 },
    { id: "vert", btn: c10El(cfg.btnVertId), l: 532 }
  ];
  var sel = "blanche";
  var IN = [105, 66], OUT = [136.6, 70], SX = 224;
  function yOut(l) { return 74 + (800 - l) / 400 * 40; }
  function draw() {
    var m = M.filter(function (x) { return x.id === sel; })[0], s = "";
    var beam = m.l ? c10Rgb(m.l) : C10.chalk;
    s += '<rect x="6" y="75" width="16" height="12" rx="2" fill="none" stroke="' + C10.dim + '" stroke-width="0.8"/>';
    s += c10Text(4, 98, m.l ? "laser" : "lumière blanche", C10.dim, 6, "start", true);
    s += '<line x1="22" y1="81" x2="' + IN[0] + '" y2="' + IN[1] + '" stroke="' + beam + '" stroke-width="1.6"/>';
    s += '<polygon points="120,26 92,100 148,100" fill="rgba(242,237,225,0.07)" stroke="' + C10.chalk + '" stroke-width="0.8"/>';
    s += '<line x1="' + IN[0] + '" y1="' + IN[1] + '" x2="' + OUT[0] + '" y2="' + OUT[1] + '" stroke="' + beam + '" stroke-width="1.4" opacity="0.85"/>';
    s += c10Text(120, 110, "prisme", C10.dim, 6, "middle", true);
    s += '<line x1="' + (SX + 3) + '" y1="38" x2="' + (SX + 3) + '" y2="122" stroke="' + C10.dim + '" stroke-width="1"/>';
    s += c10Text(SX + 3, 33, "écran", C10.dim, 6, "middle", true);
    if (!m.l) {
      for (var l = 400; l < 800; l += 10) {
        s += '<polygon points="' + OUT[0] + "," + OUT[1] + " " + SX + "," + c10N(yOut(l)) + " " + SX + "," + c10N(yOut(l + 10)) + '" fill="' + c10Rgb(l + 5) + '" opacity="0.5"/>';
        s += '<rect x="' + (SX - 1) + '" y="' + c10N(yOut(l + 10)) + '" width="4" height="' + c10N(yOut(l) - yOut(l + 10) + 0.3) + '" fill="' + c10Rgb(l + 5) + '"/>';
      }
      s += c10Text(SX - 4, 70, "rouge", "#e05040", 6, "end", true);
      s += c10Text(SX - 4, 122, "violet", "#a070ff", 6, "end", true);
    } else {
      var y = yOut(m.l);
      s += '<line x1="' + OUT[0] + '" y1="' + OUT[1] + '" x2="' + SX + '" y2="' + c10N(y) + '" stroke="' + beam + '" stroke-width="1.6"/>';
      s += '<circle cx="' + (SX + 1) + '" cy="' + c10N(y) + '" r="2.6" fill="' + beam + '"/>';
      s += c10Text(SX - 4, y - 4, "λ = " + m.l + " nm", beam, 6, "end", true, 700);
    }
    svg.innerHTML = s;
  }
  function info() {
    c10Toggle(M.map(function (x) { return [x.btn, x.id]; }), function (id) { return id === sel; });
    draw();
    if (!readout) return;
    var m = M.filter(function (x) { return x.id === sel; })[0];
    readout.innerHTML = !m.l
      ? c10Line("La lumière blanche est " + c10Strong("dispersée") + " par le prisme.")
        + c10Line("Sur l'écran : un " + c10Strong("spectre continu", C10.teal) + ", du violet au rouge, sans aucune couleur manquante.")
        + c10Line("La lumière blanche est " + c10Strong("polychromatique") + " : radiations de 400 nm à 800 nm.")
      : c10Line("La lumière du laser est déviée mais " + c10Strong("pas décomposée", C10.coral) + ".")
        + c10Line("Une seule couleur sur l'écran : une seule radiation, " + c10Strong("λ = " + m.l + " nm") + ".")
        + c10Line("Cette lumière est " + c10Strong("monochromatique", C10.teal) + ".");
  }
  M.forEach(function (m) { c10Listen(m.btn, "click", function () { sel = m.id; info(); }); });
  info();
}

/* ---------- 3. Longueur d'onde et couleur ---------- */
function initWavelength(cfg) {
  var svg = c10El(cfg.svgId); if (!svg) return;
  c10View(svg, "0 0 240 130");
  var range = c10El(cfg.rangeId), readout = c10El(cfg.readoutId), out = c10El(cfg.outId);
  c10Range(range, 300, 900, 1);
  function getL() { return range ? Number(range.value) : 550; }
  function X(l) { return 20 + (l - 300) / 600 * 200; }
  function frame(t) {
    var l = getL(), col = c10Rgb(l), s = "", P = l / 20, ph = (t * 18) % P, YC = 32, A = 10;
    var wc = col || C10.dim, pts = [];
    for (var x = 20; x <= 220; x += 0.8) pts.push(c10N(x) + "," + c10N(YC - A * Math.sin(2 * Math.PI * (x - 20 - ph) / P)));
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + wc + '" stroke-width="1.4"' + (col ? "" : ' stroke-dasharray="2 2"') + '/>';
    var xa = 20 + ph + P / 4; while (xa < 60) xa += P;
    s += '<line x1="' + c10N(xa) + '" y1="' + (YC - A - 4) + '" x2="' + c10N(xa + P) + '" y2="' + (YC - A - 4) + '" stroke="' + C10.yellow + '" stroke-width="0.8"/>';
    s += '<line x1="' + c10N(xa) + '" y1="' + (YC - A - 6) + '" x2="' + c10N(xa) + '" y2="' + (YC - A) + '" stroke="' + C10.yellow + '" stroke-width="0.6"/>';
    s += '<line x1="' + c10N(xa + P) + '" y1="' + (YC - A - 6) + '" x2="' + c10N(xa + P) + '" y2="' + (YC - A) + '" stroke="' + C10.yellow + '" stroke-width="0.6"/>';
    s += c10Text(xa + P / 2, YC - A - 6, "λ", C10.yellow, 7, "middle", true, 700);
    s += '<rect x="' + X(300) + '" y="62" width="' + (X(400) - X(300)) + '" height="18" fill="rgba(242,237,225,0.05)" stroke="' + C10.faint + '"/>';
    s += '<rect x="' + X(800) + '" y="62" width="' + (X(900) - X(800)) + '" height="18" fill="rgba(242,237,225,0.05)" stroke="' + C10.faint + '"/>';
    s += c10Strip(X(400), X(800), 62, 18, 400, 800);
    s += c10Text((X(300) + X(400)) / 2, 73, "UV", C10.dim, 6, "middle", true);
    s += c10Text((X(800) + X(900)) / 2, 73, "IR", C10.dim, 6, "middle", true);
    for (var k = 300; k <= 900; k += 100) {
      s += '<line x1="' + X(k) + '" y1="80" x2="' + X(k) + '" y2="83" stroke="' + C10.line + '"/>';
      s += c10Text(X(k), 90, String(k), C10.dim, 5.5, "middle");
    }
    s += c10Text(220, 98, "λ (nm)", C10.chalk, 5.5, "end", true);
    var xc = X(l);
    s += '<line x1="' + c10N(xc) + '" y1="58" x2="' + c10N(xc) + '" y2="82" stroke="' + C10.chalk + '" stroke-width="1"/>';
    s += '<polygon points="' + c10N(xc) + ",58 " + c10N(xc - 3) + ",53 " + c10N(xc + 3) + ',53" fill="' + C10.chalk + '"/>';
    s += '<circle cx="34" cy="114" r="7" fill="' + (col || "none") + '" stroke="' + C10.chalk + '" stroke-width="0.6"' + (col ? "" : ' stroke-dasharray="1.5 1.5"') + '/>';
    s += c10Text(46, 117, col ? "radiation visible : " + c10ColorName(l) : "radiation invisible : " + c10ColorName(l), col ? C10.chalk : C10.coral, 7, "start", true, 700);
    svg.innerHTML = s;
  }
  function info() {
    var l = getL();
    if (out) out.textContent = l + " nm";
    if (!readout) return;
    var vis = l >= 400 && l <= 800;
    readout.innerHTML = c10Line("Longueur d'onde : " + c10Strong("λ = " + l + " nm"))
      + c10Line("Soit λ = " + c10Fr(l / 100, 2) + " × 10⁻⁷ m (1 nm = 10⁻⁹ m)")
      + c10Line(vis ? "Radiation " + c10Strong("visible", C10.teal) + " : " + c10ColorName(l) + "." : "Radiation " + c10Strong("invisible", C10.coral) + " pour l'œil : " + c10ColorName(l) + ".")
      + c10Line("Une radiation seule = une lumière " + c10Strong("monochromatique", C10.teal) + ".");
  }
  c10Listen(range, "input", info);
  info();
  ch10sLoop(svg, frame);
}

/* ---------- 4. Corps chaud : spectre et température de surface ---------- */
function c10Planck(lnm, TK) { var l = lnm * 1e-9; return 1 / (Math.pow(l, 5) * (Math.exp(0.014388 / (l * TK)) - 1)); }
function initHotBody(cfg) {
  var svg = c10El(cfg.svgId); if (!svg) return;
  c10View(svg, "0 0 240 140");
  var range = c10El(cfg.rangeId), readout = c10El(cfg.readoutId), out = c10El(cfg.outId);
  c10Range(range, 1000, 7000, 100);
  function getT() { return range ? Number(range.value) : 3500; }
  var X0 = 30, X1 = 226, YB = 86, H = 62, L0 = 200, L1 = 2400;
  function X(l) { return X0 + (X1 - X0) * (l - L0) / (L1 - L0); }
  function draw() {
    var th = getT(), TK = th + 273, lmax = 2.898e6 / TK, Bm = c10Planck(lmax, TK), s = "";
    s += c10Strip(X(400), X(800), YB - H, H, 400, 800, function () { return 0.22; });
    s += '<line x1="' + X0 + '" y1="' + YB + '" x2="' + (X1 + 3) + '" y2="' + YB + '" stroke="' + C10.line + '" stroke-width="0.8"/>';
    s += '<line x1="' + X0 + '" y1="' + YB + '" x2="' + X0 + '" y2="' + (YB - H - 6) + '" stroke="' + C10.line + '" stroke-width="0.8"/>';
    s += c10Text(X0 + 3, YB - H - 2, "Intensité lumineuse (relative)", C10.chalk, 6, "start", true);
    for (var k = 400; k <= 2400; k += 400) {
      s += '<line x1="' + c10N(X(k)) + '" y1="' + YB + '" x2="' + c10N(X(k)) + '" y2="' + (YB + 2.5) + '" stroke="' + C10.line + '"/>';
      s += c10Text(X(k), YB + 9, String(k), C10.dim, 5.5, "middle");
    }
    s += c10Text(X1 + 3, YB + 17, "λ (nm)", C10.chalk, 5.5, "end", true);
    s += c10Text((X(400) + X(800)) / 2, YB - H + 7, "visible", C10.chalk, 5.5, "middle", true);
    var pts = [];
    for (var l = L0; l <= L1; l += 10) pts.push(c10N(X(l)) + "," + c10N(YB - H * 0.92 * c10Planck(l, TK) / Bm));
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C10.yellow + '" stroke-width="1.5" stroke-linejoin="round"/>';
    var xm = X(lmax), ym = YB - H * 0.92;
    s += '<line x1="' + c10N(xm) + '" y1="' + c10N(ym) + '" x2="' + c10N(xm) + '" y2="' + YB + '" stroke="' + C10.coral + '" stroke-width="0.7" stroke-dasharray="1.5 1.5"/>';
    s += '<circle cx="' + c10N(xm) + '" cy="' + c10N(ym) + '" r="1.8" fill="' + C10.coral + '"/>';
    s += c10Text(xm + 4, ym + 2, "maximum : " + Math.round(lmax) + " nm", C10.coral, 6, "start", true, 700);
    s += c10Text(X0, 106, "Spectre de la lumière émise (400 nm → 800 nm)", C10.teal, 6, "start", true);
    s += '<rect x="' + (X0 - 1) + '" y="110" width="' + (X1 - X0 + 2) + '" height="20" fill="#000"/>';
    s += c10Strip(X0, X1, 111, 18, 400, 800, function (l) { return Math.sqrt(c10Planck(l, TK) / Bm); });
    s += c10Text(X0, 138, "400", C10.dim, 5.5, "middle");
    s += c10Text(X1, 138, "800", C10.dim, 5.5, "middle");
    svg.innerHTML = s;
  }
  function info() {
    var th = getT(), lmax = 2.898e6 / (th + 273);
    if (out) out.textContent = c10Fr(th, 0) + " °C";
    draw();
    if (!readout) return;
    var dom = lmax < 400 ? "ultraviolet" : (lmax <= 800 ? "visible" : "infrarouge");
    var teinte = th < 1600 ? "rouge sombre" : th < 2600 ? "orangée" : th < 4200 ? "jaune" : th < 5800 ? "blanche" : "blanc bleuté";
    readout.innerHTML = c10Line("Température de surface : " + c10Strong(c10Fr(th, 0) + " °C"))
      + c10Line("Maximum d'intensité vers " + c10Strong(Math.round(lmax) + " nm", C10.coral) + " (" + dom + ").")
      + c10Line("Lumière perçue : " + c10Strong(teinte, C10.chalk) + ".")
      + c10Line("Spectre " + c10Strong("continu", C10.teal) + " : plus la température augmente, plus il est lumineux et s'enrichit vers le violet.");
  }
  c10Listen(range, "input", info);
  info();
}

/* ---------- 5. Spectres de raies d'émission ---------- */
var C10_GAZ = {
  hg: { nom: "mercure", raies: [[405, 0.35], [436, 0.6], [546, 1], [579, 0.45]] },
  na: { nom: "sodium", raies: [[568, 0.12], [589, 1], [590, 0.85]] },
  h: { nom: "hydrogène", raies: [[410, 0.15], [434, 0.3], [486, 0.55], [656, 1]] },
  he: { nom: "hélium", raies: [[447, 0.4], [471, 0.15], [492, 0.2], [502, 0.35], [588, 1], [668, 0.5], [707, 0.3]] }
};
function initLineSpectra(cfg) {
  var svg = c10El(cfg.svgId); if (!svg) return;
  c10View(svg, "0 0 240 150");
  var readout = c10El(cfg.readoutId);
  var B = [["hg", c10El(cfg.btnHgId)], ["na", c10El(cfg.btnNaId)], ["h", c10El(cfg.btnHId)], ["he", c10El(cfg.btnHeId)]];
  var sel = "hg", X0 = 30, X1 = 222, L0 = 400, L1 = 750;
  function X(l) { return X0 + (X1 - X0) * (l - L0) / (L1 - L0); }
  function axis(y) {
    var s = '<line x1="' + X0 + '" y1="' + y + '" x2="' + (X1 + 3) + '" y2="' + y + '" stroke="' + C10.line + '" stroke-width="0.8"/>';
    for (var k = 400; k <= 750; k += 50) {
      s += '<line x1="' + c10N(X(k)) + '" y1="' + y + '" x2="' + c10N(X(k)) + '" y2="' + (y + 2.5) + '" stroke="' + C10.line + '"/>';
      s += c10Text(X(k), y + 9, String(k), C10.dim, 5.5, "middle");
    }
    return s;
  }
  function draw() {
    var g = C10_GAZ[sel], s = "";
    s += c10Text(X0, 12, "a · spectre observé au spectroscope", C10.teal, 6, "start", true);
    s += '<rect x="' + X0 + '" y="16" width="' + (X1 - X0) + '" height="24" fill="#000" stroke="' + C10.faint + '"/>';
    g.raies.forEach(function (r) {
      s += '<rect x="' + c10N(X(r[0]) - 0.7) + '" y="16" width="1.4" height="24" fill="' + c10Rgb(r[0], 0.45 + 0.55 * r[1]) + '"/>';
    });
    s += axis(40);
    s += c10Text(X1 + 3, 57, "λ (nm)", C10.chalk, 5.5, "end", true);
    var YB = 128, H = 52;
    s += c10Text(X0, 68, "b · spectre au spectrophotomètre", C10.teal, 6, "start", true);
    s += '<line x1="' + X0 + '" y1="' + YB + '" x2="' + X0 + '" y2="' + (YB - H - 4) + '" stroke="' + C10.line + '" stroke-width="0.8"/>';
    s += c10Text(X0 + 3, YB - H + 1, "Intensité lumineuse", C10.chalk, 5.5, "start", true);
    var pts = [];
    for (var l = L0; l <= L1; l += 0.5) {
      var v = 0;
      g.raies.forEach(function (r) { v += r[1] * Math.exp(-Math.pow((l - r[0]) / 1.6, 2)); });
      pts.push(c10N(X(l)) + "," + c10N(YB - (H - 6) * Math.min(1, v)));
    }
    s += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + C10.yellow + '" stroke-width="1.1" stroke-linejoin="round"/>';
    g.raies.forEach(function (r) {
      if (r[1] < 0.3) return;
      s += c10Text(X(r[0]), YB - (H - 6) * r[1] - 3, String(r[0]), c10Rgb(r[0]) || C10.chalk, 5, "middle", false, 700);
    });
    s += axis(YB);
    s += c10Text(X1 + 3, YB + 17, "λ (nm)", C10.chalk, 5.5, "end", true);
    svg.innerHTML = s;
  }
  function info() {
    c10Toggle(B.map(function (b) { return [b[1], b[0]]; }), function (id) { return id === sel; });
    draw();
    if (!readout) return;
    var g = C10_GAZ[sel];
    var main = g.raies.filter(function (r) { return r[1] >= 0.3; }).map(function (r) { return r[0]; });
    readout.innerHTML = c10Line("Gaz excité : " + c10Strong(g.nom, C10.chalk))
      + c10Line("Raies principales : " + c10Strong(main.join(" ; ") + " nm"))
      + c10Line("Chaque raie colorée correspond à une " + c10Strong("radiation monochromatique", C10.teal) + " ; chaque pic du spectrophotomètre aussi.")
      + c10Line("Ces longueurs d'onde sont " + c10Strong("caractéristiques", C10.teal) + " du " + g.nom + " : elles permettent de l'identifier.");
  }
  B.forEach(function (b) { c10Listen(b[1], "click", function () { sel = b[0]; info(); }); });
  info();
}
