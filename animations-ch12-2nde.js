/* Animations du chapitre 12 — 2nde — « La transformation chimique ».
   initBalance (ajuster une équation), initLimiting (réactif limitant),
   initReflux (montage de chauffage à reflux), initTLC (chromatographie sur couche mince). */

var C12 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  board: "#16261f", line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.12)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
function c12N(v) { return Math.round(v * 100) / 100; }
function c12El(id) { return id ? document.getElementById(id) : null; }
function c12Listen(el, type, fn) {
  if (!el) return;
  el.__c12H = el.__c12H || {};
  if (el.__c12H[type]) el.removeEventListener(type, el.__c12H[type]);
  el.__c12H[type] = fn;
  el.addEventListener(type, fn);
}
function c12Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c12N(x) + " " + c12N(y) + ') scale(0.25)" font-size="' + c12N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C12.hand : C12.font) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function c12Fr(v, d) { return Number(v).toFixed(d).replace(".", ","); }
function c12Mol(v) { return (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : c12Fr(v, 1)); }
function c12Strong(t, c) { return '<strong style="color:' + (c || C12.yellow) + '">' + t + "</strong>"; }
function c12Ease(x) { x = Math.max(0, Math.min(1, x)); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
function c12Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C12.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C12.yellow : C12.dim;
  });
}
function ch12Loop(svg, fn) {
  if (svg.__c12Loop) svg.__c12Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c12Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
var C12_EL = {
  C: { fill: "#8f9a94", ink: "#16261f" },
  H: { fill: "#f2ede1", ink: "#16261f" },
  O: { fill: "#d97a63", ink: "#16261f" },
  Mg: { fill: "#6bbfab", ink: "#16261f" },
  Fe: { fill: "#b08a5a", ink: "#16261f" }
};

/* ---------- 1. Ajuster une équation de réaction ---------- */
var C12_EQS = [
  { name: "Combustion complète du méthane", sp: [
    { f: "CH₄", st: "(g)", at: { C: 1, H: 4 }, q: 0, side: 0 },
    { f: "O₂", st: "(g)", at: { O: 2 }, q: 0, side: 0 },
    { f: "CO₂", st: "(g)", at: { C: 1, O: 2 }, q: 0, side: 1 },
    { f: "H₂O", st: "(g)", at: { H: 2, O: 1 }, q: 0, side: 1 }], els: ["C", "H", "O"] },
  { name: "Magnésium et acide chlorhydrique", sp: [
    { f: "Mg", st: "(s)", at: { Mg: 1 }, q: 0, side: 0 },
    { f: "H⁺", st: "(aq)", at: { H: 1 }, q: 1, side: 0 },
    { f: "Mg²⁺", st: "(aq)", at: { Mg: 1 }, q: 2, side: 1 },
    { f: "H₂", st: "(g)", at: { H: 2 }, q: 0, side: 1 }], els: ["Mg", "H"], charge: true },
  { name: "Combustion du fer", sp: [
    { f: "Fe", st: "(s)", at: { Fe: 1 }, q: 0, side: 0 },
    { f: "O₂", st: "(g)", at: { O: 2 }, q: 0, side: 0 },
    { f: "Fe₃O₄", st: "(s)", at: { Fe: 3, O: 4 }, q: 0, side: 1 }], els: ["Fe", "O"] }
];
function initBalance(cfg) {
  var svg = c12El(cfg.svgId), ctrl = c12El(cfg.ctrlId), readout = c12El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 130");
  var btns = (cfg.buttonIds || []).map(c12El);
  var fs = cfg.size || 16;
  var cur = 0, coefs = [], births = {}, loop = null, tNow = 0;
  function counts(side) {
    var eq = C12_EQS[cur], c = {}, q = 0;
    eq.els.forEach(function (e) { c[e] = 0; });
    eq.sp.forEach(function (s, i) {
      if (s.side !== side) return;
      Object.keys(s.at).forEach(function (e) { c[e] += s.at[e] * coefs[i]; });
      q += s.q * coefs[i];
    });
    c.q = q;
    return c;
  }
  function rows() { var eq = C12_EQS[cur]; return eq.charge ? eq.els.concat(["q"]) : eq.els.slice(); }
  function markBirths() {
    [0, 1].forEach(function (side) {
      var c = counts(side);
      rows().forEach(function (e) {
        var k = side + e, arr = births[k] || [];
        while (arr.length < c[e]) arr.push(tNow);
        arr.length = c[e];
        births[k] = arr;
      });
    });
  }
  function draw(t) {
    tNow = t;
    var rs = rows(), H = 104 / rs.length, s = "";
    s += c12Text(70, 10, "Réactifs", C12.teal, 7, "middle", true, 700);
    s += c12Text(178, 10, "Produits", C12.yellow, 7, "middle", true, 700);
    s += '<line x1="124" y1="16" x2="124" y2="126" stroke="' + C12.faint + '" stroke-width="0.8"/>';
    rs.forEach(function (e, r) {
      var y0 = 18 + r * H, yc = y0 + H / 2;
      var L = counts(0)[e], R = counts(1)[e], ok = L === R;
      if (r > 0) s += '<line x1="6" y1="' + c12N(y0) + '" x2="234" y2="' + c12N(y0) + '" stroke="' + C12.faint + '" stroke-width="0.5"/>';
      s += c12Text(12, yc + 2.5, e === "q" ? "charge" : e, e === "q" ? C12.dim : C12.chalk, e === "q" ? 6 : 8, "middle", true, 700);
      [0, 1].forEach(function (side) {
        var n = side ? R : L, arr = births[side + e] || [];
        var x0 = side ? 134 : 26, per = 12, sp = 6.8, rad = 2.8;
        var lines = Math.max(1, Math.ceil(n / per));
        for (var i = 0; i < n; i++) {
          var li = Math.floor(i / per), col = i % per;
          var x = x0 + col * sp + 3, y = yc + (li - (lines - 1) / 2) * 7;
          var k = c12Ease((t - (arr[i] == null ? -9 : arr[i]) - (i % per) * 0.03) / 0.3);
          if (k <= 0.01) continue;
          if (e === "q") s += '<circle cx="' + c12N(x) + '" cy="' + c12N(y) + '" r="' + c12N(rad * k) + '" fill="none" stroke="' + C12.yellow + '" stroke-width="0.8"/>' + (k > 0.6 ? c12Text(x, y + 2, "+", C12.yellow, 5.5, "middle", false, 700) : "");
          else s += '<circle cx="' + c12N(x) + '" cy="' + c12N(y) + '" r="' + c12N(rad * k) + '" fill="' + C12_EL[e].fill + '" stroke="#16261f" stroke-width="0.4"/>';
        }
        s += c12Text(side ? 226 : 116, yc + 2.5, String(n), ok ? C12.teal : C12.coral, 7.5, "end", true, 700);
      });
      var pulse = ok ? 1 : 0.75 + 0.25 * Math.sin(t * 5);
      s += '<circle cx="124" cy="' + c12N(yc) + '" r="6" fill="#16261f" stroke="' + (ok ? C12.teal : C12.coral) + '" stroke-width="1" opacity="' + c12N(pulse) + '"/>';
      s += c12Text(124, yc + 2.6, ok ? "=" : "≠", ok ? C12.teal : C12.coral, 8, "middle", false, 700);
    });
    svg.innerHTML = s;
  }
  function btnStyle() {
    return "font-family:" + C12.font + ";font-size:" + fs + "px;width:" + Math.round(fs * 1.6) + "px;height:" + Math.round(fs * 1.6) + "px;line-height:1;background:transparent;border:2px solid rgba(242,237,225,0.3);color:" + C12.chalk + ";border-radius:8px;cursor:pointer;padding:0;";
  }
  function buildCtrl() {
    if (!ctrl) return;
    var eq = C12_EQS[cur], h = "";
    eq.sp.forEach(function (sp, i) {
      if (i > 0) h += '<span style="font-size:' + fs * 1.1 + 'px;color:' + C12.dim + ';">' + (sp.side !== eq.sp[i - 1].side ? "→" : "+") + "</span>";
      h += '<span style="display:inline-flex;align-items:center;gap:' + Math.round(fs * 0.3) + 'px;">'
        + '<span style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;">'
        + '<button type="button" data-i="' + i + '" data-d="1" aria-label="augmenter" style="' + btnStyle() + '">+</button>'
        + '<span data-coef="' + i + '" style="font-family:' + C12.hand + ';font-weight:700;font-size:' + fs * 1.5 + 'px;line-height:1;color:' + C12.yellow + ';"></span>'
        + '<button type="button" data-i="' + i + '" data-d="-1" aria-label="diminuer" style="' + btnStyle() + '">−</button></span>'
        + '<span style="font-size:' + fs * 1.25 + 'px;color:' + C12.chalk + ';white-space:nowrap;">' + sp.f + ' <span style="font-size:' + fs * 0.8 + 'px;color:' + C12.dim + ';">' + sp.st + "</span></span></span>";
    });
    ctrl.innerHTML = '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:' + Math.round(fs * 0.8) + 'px;">' + h + "</div>";
    Array.prototype.forEach.call(ctrl.querySelectorAll("button[data-i]"), function (b) {
      b.addEventListener("click", function () {
        var i = Number(b.getAttribute("data-i"));
        coefs[i] = Math.max(1, Math.min(6, coefs[i] + Number(b.getAttribute("data-d"))));
        update();
      });
    });
  }
  function update() {
    var eq = C12_EQS[cur];
    if (ctrl) Array.prototype.forEach.call(ctrl.querySelectorAll("[data-coef]"), function (el) {
      var i = Number(el.getAttribute("data-coef"));
      el.textContent = coefs[i];
      el.style.opacity = coefs[i] === 1 ? "0.6" : "1";
    });
    markBirths();
    var l = counts(0), r = counts(1), bad = rows().filter(function (e) { return l[e] !== r[e]; });
    if (!readout) return;
    var eqTxt = eq.sp.map(function (sp, i) {
      return (i > 0 ? (sp.side !== eq.sp[i - 1].side ? " → " : " + ") : "") + (coefs[i] > 1 ? coefs[i] + " " : "") + sp.f + " " + sp.st;
    }).join("");
    readout.innerHTML = "<div>" + eq.name + "</div>"
      + (bad.length
        ? "<div>À vérifier : " + bad.map(function (e) { return c12Strong(e === "q" ? "la charge" : "l'élément " + e, C12.coral); }).join(", ") + ".</div>"
        : "<div>" + c12Strong("Équation ajustée ✓", C12.teal) + "</div><div>" + c12Strong(eqTxt) + "</div>");
  }
  function select(i) {
    cur = i;
    c12Toggle(btns, i);
    coefs = C12_EQS[i].sp.map(function () { return 1; });
    births = {};
    buildCtrl();
    update();
  }
  btns.forEach(function (b, i) { c12Listen(b, "click", function () { select(i); }); });
  select(0);
  loop = ch12Loop(svg, draw);
}

/* ---------- 2. Réactif limitant : CH4 + 2 O2 → CO2 + 2 H2O ---------- */
function initLimiting(cfg) {
  var svg = c12El(cfg.svgId), readout = c12El(cfg.readoutId);
  var rA = c12El(cfg.rangeAId), rB = c12El(cfg.rangeBId), oA = c12El(cfg.outAId), oB = c12El(cfg.outBId), play = c12El(cfg.playId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 130");
  [rA, rB].forEach(function (r, i) { if (!r) return; r.min = "0.5"; r.max = "4"; r.step = "0.5"; if (!r.value || Number(r.value) < 0.5) r.value = i ? "3" : "1"; });
  var start = 0, tNow = 0, DUR = 2.4, HOLD = 0.6;
  function vals() {
    var a = rA ? Number(rA.value) : 1, b = rB ? Number(rB.value) : 3;
    return { a: a, b: b, x: Math.min(a, b / 2) };
  }
  function draw(t) {
    tNow = t;
    var v = vals(), p = c12Ease((t - start - HOLD) / DUR), s = "";
    var X0 = 30, Y0 = 108, K = 21, cur = [v.a - v.x * p, v.b - 2 * v.x * p, v.x * p, 2 * v.x * p], ini = [v.a, v.b, 0, 0];
    var names = ["CH₄", "O₂", "CO₂", "H₂O"], cols = [C12.teal, C12.teal, C12.yellow, C12.yellow];
    s += c12Text(6, 10, "Quantité de matière (mol)", C12.dim, 6.2, "start");
    for (var g = 0; g <= 4; g++) {
      var y = Y0 - g * K;
      s += '<line x1="' + X0 + '" y1="' + y + '" x2="232" y2="' + y + '" stroke="' + (g ? C12.faint : C12.line) + '" stroke-width="' + (g ? 0.5 : 1) + '"/>';
      s += c12Text(X0 - 4, y + 2.2, String(g), C12.dim, 6.2, "end", true);
    }
    var lim = v.a < v.b / 2 - 1e-9 ? 0 : (v.a > v.b / 2 + 1e-9 ? 1 : 2);
    var bw = 30, gap = 18, x = X0 + 14;
    names.forEach(function (nm, i) {
      if (i === 2) x += 10;
      var h = cur[i] * K, h0 = ini[i] * K;
      if (i < 2 && h0 > 0) s += '<rect x="' + x + '" y="' + c12N(Y0 - h0) + '" width="' + bw + '" height="' + c12N(h0) + '" fill="none" stroke="' + cols[i] + '" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.7"/>';
      if (h > 0.05) s += '<rect x="' + x + '" y="' + c12N(Y0 - h) + '" width="' + bw + '" height="' + c12N(h) + '" fill="' + cols[i] + '" opacity="0.85"/>';
      s += c12Text(x + bw / 2, Y0 - h - 3, c12Fr(cur[i], 1), cols[i], 6.5, "middle", true, 700);
      s += c12Text(x + bw / 2, Y0 + 9, nm, C12.chalk, 7, "middle", false, 600);
      var isLim = p > 0.99 && i < 2 && (lim === 2 || lim === i);
      if (isLim) s += c12Text(x + bw / 2, Y0 + 18, "limitant", C12.coral, 6.2, "middle", true, 700);
      x += bw + gap;
    });
    var state = p <= 0 ? "État initial" : (p >= 0.999 ? "État final" : "Transformation en cours…");
    s += c12Text(232, 10, state, p >= 0.999 ? C12.yellow : C12.chalk, 7, "end", true, 700);
    svg.innerHTML = s;
  }
  function update(restart) {
    var v = vals();
    if (oA) oA.textContent = c12Mol(v.a) + " mol";
    if (oB) oB.textContent = c12Mol(v.b) + " mol";
    if (restart) start = tNow;
    if (!readout) return;
    var qa = v.a, qb = v.b / 2;
    var cmp = Math.abs(qa - qb) < 1e-9 ? "=" : (qa < qb ? "<" : ">");
    var concl = cmp === "=" ? "Mélange stœchiométrique : " + c12Strong("les deux réactifs sont limitants") + "."
      : (cmp === "<" ? c12Strong("CH₄ est le réactif limitant") + " ; il reste " + c12Mol(v.b - 2 * v.a) + " mol de O₂."
        : c12Strong("O₂ est le réactif limitant") + " ; il reste " + c12Mol(v.a - v.b / 2) + " mol de CH₄.");
    readout.innerHTML = "<div><em>n</em><sub>0</sub>(CH₄) / 1 = " + c12Mol(qa) + " &nbsp; " + cmp + " &nbsp; <em>n</em><sub>0</sub>(O₂) / 2 = " + c12Mol(qb) + "</div><div>" + concl + "</div>";
  }
  c12Listen(rA, "input", function () { update(true); });
  c12Listen(rB, "input", function () { update(true); });
  c12Listen(play, "click", function () { update(true); });
  ch12Loop(svg, draw);
  update(true);
}

/* ---------- 3. Montage de chauffage à reflux ---------- */
function initReflux(cfg) {
  var svg = c12El(cfg.svgId), btn = c12El(cfg.buttonId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var on = cfg.startOn !== false, heat = on ? 1 : 0, last = 0;
  var parts = [];
  for (var i = 0; i < 14; i++) parts.push({ ph: Math.random(), sp: 0.35 + Math.random() * 0.25, dx: (Math.random() - 0.5) * 3 });
  var bubbles = [];
  for (var j = 0; j < 9; j++) bubbles.push({ ph: Math.random(), x: (Math.random() - 0.5) * 22, sp: 0.8 + Math.random() * 0.6 });
  function label(x1, y1, txt) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="142" y2="' + y1 + '" stroke="' + C12.dim + '" stroke-width="0.6"/>' + c12Text(146, y1 + 2.4, txt, C12.chalk, 7, "start");
  }
  function draw(t) {
    var dt = Math.min(0.05, t - last); last = t;
    heat += ((on ? 1 : 0) - heat) * Math.min(1, dt * 1.5);
    var s = "", cx = 80, cy = 100, R = 19;
    // support élévateur
    s += '<rect x="54" y="136" width="52" height="5" fill="' + C12.dim + '" opacity="0.7"/>';
    s += '<line x1="58" y1="126" x2="102" y2="136" stroke="' + C12.dim + '" stroke-width="1.2"/><line x1="58" y1="136" x2="102" y2="126" stroke="' + C12.dim + '" stroke-width="1.2"/>';
    s += '<rect x="54" y="124" width="52" height="3" fill="' + C12.dim + '" opacity="0.7"/>';
    // chauffe-ballon
    var glow = "rgba(217,122,99," + c12N(0.15 + 0.55 * heat) + ")";
    s += '<path d="M56 104 Q56 124 66 124 L94 124 Q104 124 104 104 Z" fill="' + glow + '" stroke="' + C12.dim + '" stroke-width="1.2"/>';
    // ballon + liquide
    s += '<defs><clipPath id="' + cfg.svgId + 'B"><circle cx="' + cx + '" cy="' + cy + '" r="' + (R - 1) + '"/></clipPath></defs>';
    s += '<g clip-path="url(#' + cfg.svgId + 'B)"><rect x="' + (cx - R) + '" y="' + (cy + 2) + '" width="' + 2 * R + '" height="' + R + '" fill="rgba(107,191,171,0.4)"/>';
    bubbles.forEach(function (b) {
      var k = (b.ph + t * b.sp) % 1, y = cy + 16 - k * 14;
      if (heat > 0.3) s += '<circle cx="' + c12N(cx + b.x) + '" cy="' + c12N(y) + '" r="' + c12N(0.8 + k * 1.2) + '" fill="none" stroke="' + C12.chalk + '" stroke-width="0.5" opacity="' + c12N((heat - 0.3) * (1 - k)) + '"/>';
    });
    s += "</g>";
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + C12.chalk + '" stroke-width="1.4"/>';
    s += '<rect x="' + (cx - 4) + '" y="74" width="8" height="8" fill="#16261f" stroke="none"/>';
    s += '<line x1="' + (cx - 4) + '" y1="66" x2="' + (cx - 4) + '" y2="82.5" stroke="' + C12.chalk + '" stroke-width="1.4"/><line x1="' + (cx + 4) + '" y1="66" x2="' + (cx + 4) + '" y2="82.5" stroke="' + C12.chalk + '" stroke-width="1.4"/>';
    // réfrigérant : tube intérieur + manchon d'eau
    s += '<rect x="70" y="20" width="20" height="44" rx="4" fill="rgba(107,191,171,0.12)" stroke="' + C12.chalk + '" stroke-width="1.2"/>';
    var wy = (t * 14 * Math.max(0.15, heat)) % 8;
    s += '<line x1="73" y1="60" x2="73" y2="24" stroke="' + C12.teal + '" stroke-width="1" stroke-dasharray="3 5" stroke-dashoffset="' + c12N(wy) + '" opacity="0.8"/>';
    s += '<line x1="87" y1="60" x2="87" y2="24" stroke="' + C12.teal + '" stroke-width="1" stroke-dasharray="3 5" stroke-dashoffset="' + c12N(wy) + '" opacity="0.8"/>';
    s += '<rect x="76" y="8" width="8" height="60" fill="#16261f" stroke="' + C12.chalk + '" stroke-width="1.2"/>';
    // arrivée / sortie d'eau
    s += '<line x1="90" y1="56" x2="104" y2="56" stroke="' + C12.chalk + '" stroke-width="1.2"/><line x1="90" y1="28" x2="104" y2="28" stroke="' + C12.chalk + '" stroke-width="1.2"/>';
    s += '<path d="M106 56 L101 53.5 L101 58.5 Z" fill="' + C12.teal + '" transform="rotate(180 103.5 56)"/>';
    s += '<path d="M108 28 L103 25.5 L103 30.5 Z" fill="' + C12.teal + '"/>';
    // vapeurs qui montent, condensation, gouttes qui retombent
    parts.forEach(function (p) {
      var k = (p.ph + t * p.sp) % 1;
      if (heat < 0.2) return;
      var op = (heat - 0.2) / 0.8;
      if (k < 0.55) {
        var y = 96 - (k / 0.55) * 62;
        s += '<circle cx="' + c12N(cx + p.dx * (1 - k)) + '" cy="' + c12N(y) + '" r="1.1" fill="' + C12.coral + '" opacity="' + c12N(op * 0.9) + '"/>';
      } else {
        var k2 = (k - 0.55) / 0.45, y2 = 34 + k2 * 66;
        s += '<path d="M' + c12N(cx + p.dx * 0.6) + " " + c12N(y2 - 2) + " q1.2 2 0 2.6 q-1.2 -0.6 0 -2.6 Z" + '" fill="' + C12.teal + '" opacity="' + c12N(op) + '"/>';
      }
    });
    s += label(90, 28, "Sortie d'eau");
    s += label(84, 42, "Réfrigérant à eau");
    s += label(90, 56, "Arrivée d'eau");
    s += label(99, 92, "Ballon");
    s += label(104, 114, "Chauffe-ballon");
    s += label(106, 133, "Support élévateur");
    if (heat > 0.5) {
      s += c12Text(36, 52, "vapeurs", C12.coral, 6.5, "middle", true, 700);
      s += '<path d="M44 50 L72 46" stroke="' + C12.coral + '" stroke-width="0.6" fill="none"/>';
      s += c12Text(36, 74, "condensation", C12.teal, 6.5, "middle", true, 700);
      s += '<path d="M44 72 L76 64" stroke="' + C12.teal + '" stroke-width="0.6" fill="none"/>';
    }
    svg.innerHTML = s;
  }
  function sync() { if (btn) btn.textContent = on ? "⏸ Arrêter le chauffage" : "🔥 Chauffer"; }
  c12Listen(btn, "click", function () { on = !on; sync(); });
  sync();
  ch12Loop(svg, draw);
}

/* ---------- 4. Chromatographie sur couche mince ---------- */
function initTLC(cfg) {
  var svg = c12El(cfg.svgId), play = c12El(cfg.playId), readout = c12El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 140");
  var start = 0, tNow = 0, DUR = 4.5, PRE = 0.5;
  var PX0 = 40, PX1 = 120, PY0 = 12, BASE = 112, FRONT = 26;
  var deps = [{ x: 60, name: "A", rf: [0.72, 0.3] }, { x: 100, name: "B", rf: [0.72] }];
  function draw(t) {
    tNow = t;
    var p = c12Ease((t - start - PRE) / DUR), done = p > 0.999, s = "";
    var front = BASE + 8 - p * (BASE + 8 - FRONT);
    // cuve
    s += '<path d="M30 20 L30 132 L130 132 L130 20" fill="none" stroke="' + C12.dim + '" stroke-width="1.2"/>';
    s += '<rect x="31" y="120" width="98" height="11.5" fill="rgba(107,191,171,0.25)"/>';
    s += '<line x1="26" y1="20" x2="134" y2="20" stroke="' + C12.dim + '" stroke-width="1.6"/>';
    // plaque
    s += '<rect x="' + PX0 + '" y="' + PY0 + '" width="' + (PX1 - PX0) + '" height="' + (128 - PY0) + '" fill="#f2ede1" opacity="0.1" stroke="' + C12.chalk + '" stroke-width="1"/>';
    s += '<rect x="' + PX0 + '" y="' + c12N(front) + '" width="' + (PX1 - PX0) + '" height="' + c12N(128 - front) + '" fill="rgba(107,191,171,0.22)"/>';
    if (p > 0.02) s += '<line x1="' + PX0 + '" y1="' + c12N(front) + '" x2="' + PX1 + '" y2="' + c12N(front) + '" stroke="' + C12.teal + '" stroke-width="' + (done ? 1 : 0.7) + '"' + (done ? ' stroke-dasharray="3 2"' : "") + "/>";
    s += '<line x1="' + PX0 + '" y1="' + BASE + '" x2="' + PX1 + '" y2="' + BASE + '" stroke="' + C12.chalk + '" stroke-width="0.6" stroke-dasharray="2 2"/>';
    var dist = BASE - front;
    deps.forEach(function (d) {
      d.rf.forEach(function (rf) {
        var y = BASE - Math.max(0, dist) * rf;
        s += '<ellipse cx="' + d.x + '" cy="' + c12N(y) + '" rx="' + c12N(3.2 + p * 1.3) + '" ry="' + c12N(2.6 + p * 0.6) + '" fill="#2a1f12" stroke="' + C12.yellow + '" stroke-width="0.6" opacity="0.95"/>';
      });
      s += c12Text(d.x, 124.5, d.name, C12.chalk, 7.5, "middle", true, 700);
    });
    if (done) {
      var yS = BASE - dist * 0.72;
      s += '<rect x="50" y="' + c12N(yS - 6) + '" width="60" height="12" rx="2" fill="none" stroke="' + C12.coral + '" stroke-width="0.8"/>';
      s += '<line x1="110" y1="' + c12N(yS) + '" x2="142" y2="' + c12N(yS) + '" stroke="' + C12.coral + '" stroke-width="0.6"/>';
      s += c12Text(146, yS - 3, "même hauteur :", C12.coral, 6.5, "start", true, 700);
      s += c12Text(146, yS + 5, "même espèce", C12.coral, 6.5, "start", true, 700);
      s += '<line x1="120" y1="' + FRONT + '" x2="142" y2="' + FRONT + '" stroke="' + C12.dim + '" stroke-width="0.6"/>';
      s += c12Text(146, FRONT + 2.4, "Ligne de front", C12.chalk, 6.5, "start");
    }
    s += '<line x1="120" y1="' + BASE + '" x2="142" y2="' + BASE + '" stroke="' + C12.dim + '" stroke-width="0.6"/>';
    s += c12Text(146, BASE + 2.4, "Ligne de dépôt", C12.chalk, 6.5, "start");
    s += '<line x1="130" y1="126" x2="142" y2="126" stroke="' + C12.dim + '" stroke-width="0.6"/>';
    s += c12Text(146, 128.4, "Éluant", C12.chalk, 6.5, "start");
    if (!done) s += c12Text(146, 70, p > 0 ? "L'éluant monte…" : "Dépôts A et B", C12.dim, 6.5, "start", true);
    svg.innerHTML = s;
    if (readout && done !== readout.__done) {
      readout.__done = done;
      readout.innerHTML = done
        ? "<div>A : " + c12Strong("2 taches") + " → la solution naturelle est un mélange.</div><div>B : " + c12Strong("1 tache") + " à la même hauteur qu'une tache de A → l'espèce synthétisée est " + c12Strong("identique") + " à l'espèce naturelle.</div>"
        : "<div>A : solution contenant l'espèce naturelle.</div><div>B : solution contenant l'espèce synthétisée.</div>";
    }
  }
  c12Listen(play, "click", function () { start = tNow; });
  ch12Loop(svg, draw);
}
