/* Animations du chapitre 16 — 2nde — « Transformation nucléaire ».
   initNucleus (composition d'un noyau, isotopes), initNuclearEq (lois de conservation de Soddy). */

var C16 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63", blue: "#9fd3e6",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
function c16N(v) { return Math.round(v * 100) / 100; }
function c16El(id) { return id ? document.getElementById(id) : null; }
function c16Listen(el, type, fn) {
  if (!el) return;
  el.__c16H = el.__c16H || {};
  if (el.__c16H[type]) el.removeEventListener(type, el.__c16H[type]);
  el.__c16H[type] = fn;
  el.addEventListener(type, fn);
}
function c16Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c16N(x) + " " + c16N(y) + ') scale(0.25)" font-size="' + c16N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C16.hand : C16.font) + '" text-anchor="' + (anchor || "start") + '"'
    + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function c16Strong(t, c) { return '<strong style="color:' + (c || C16.yellow) + '">' + t + "</strong>"; }
function c16Sgn(z) { return z < 0 ? "−" + (-z) : String(z); }
/* Écriture conventionnelle A/Z X en HTML (empilement vertical à gauche du symbole). */
function c16Nuc(A, Z, sym, color) {
  return '<span style="display:inline-flex;align-items:center;gap:3px;color:' + (color || "inherit") + ';">'
    + '<span style="display:inline-flex;flex-direction:column;align-items:flex-end;font-size:0.56em;line-height:1.02;">'
    + "<span>" + A + "</span><span>" + c16Sgn(Z) + "</span></span><span>" + sym + "</span></span>";
}
function c16Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C16.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C16.yellow : C16.dim;
  });
}
function ch16Loop(svg, fn) {
  if (svg.__c16Loop) svg.__c16Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c16Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}

/* ---------- 1. Composition d'un noyau ---------- */
var C16_ISO = [
  { A: 1, Z: 1, s: "H", el: "hydrogène" }, { A: 2, Z: 1, s: "H", el: "hydrogène" }, { A: 3, Z: 1, s: "H", el: "hydrogène" },
  { A: 12, Z: 6, s: "C", el: "carbone" }, { A: 13, Z: 6, s: "C", el: "carbone" }, { A: 14, Z: 6, s: "C", el: "carbone" },
  { A: 63, Z: 29, s: "Cu", el: "cuivre" }, { A: 65, Z: 29, s: "Cu", el: "cuivre" },
  { A: 235, Z: 92, s: "U", el: "uranium" }, { A: 238, Z: 92, s: "U", el: "uranium" }
];
function initNucleus(cfg) {
  var svg = c16El(cfg.svgId), readout = c16El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 150");
  var btns = (cfg.buttonIds || []).map(c16El);
  var cur = 3, prev = null, balls = [], k0 = cfg.scale || 1;
  function px(v) { return Math.round(v * k0) + "px"; }
  function build() {
    var it = C16_ISO[cur], n = it.A, Z = it.Z;
    var r = Math.min(13, 58 / (1.12 * Math.sqrt(n))), c = 1.12 * r;
    balls = [];
    for (var i = 0; i < n; i++) {
      var rad = n === 1 ? 0 : c * Math.sqrt(i + 0.5), a = i * 2.39996;
      var isP = Math.floor((i + 1) * Z / n) > Math.floor(i * Z / n);
      balls.push({ x: 82 + rad * Math.cos(a), y: 75 + rad * Math.sin(a), p: isP, ph: i * 1.7 });
    }
    balls.reverse();
    balls.r = r;
  }
  function draw(t) {
    var s = "", r = balls.r, k = 0.35 + r * 0.04;
    s += '<circle cx="82" cy="75" r="68" fill="rgba(242,237,225,0.03)" stroke="rgba(242,237,225,0.12)" stroke-width="0.6" stroke-dasharray="2 2"/>';
    balls.forEach(function (b) {
      var x = b.x + Math.sin(t * 3 + b.ph) * k, y = b.y + Math.cos(t * 2.6 + b.ph) * k;
      var fill = b.p ? C16.coral : C16.blue;
      s += '<circle cx="' + c16N(x) + '" cy="' + c16N(y) + '" r="' + c16N(r) + '" fill="' + fill + '" stroke="#16261f" stroke-width="' + c16N(Math.max(0.3, r * 0.08)) + '"/>';
      s += '<circle cx="' + c16N(x - r * 0.32) + '" cy="' + c16N(y - r * 0.32) + '" r="' + c16N(r * 0.3) + '" fill="rgba(255,255,255,0.28)"/>';
    });
    s += '<circle cx="176" cy="58" r="6" fill="' + C16.coral + '"/>' + c16Text(186, 61, "proton", C16.chalk, 7.5, "start", true);
    s += '<circle cx="176" cy="82" r="6" fill="' + C16.blue + '"/>' + c16Text(186, 85, "neutron", C16.chalk, 7.5, "start", true);
    s += c16Text(170, 104, "noyau non", C16.dim, 5.5, "start") + c16Text(170, 111, "à l'échelle", C16.dim, 5.5, "start");
    svg.innerHTML = s;
  }
  function info() {
    if (!readout) return;
    var it = C16_ISO[cur], N = it.A - it.Z;
    var same = C16_ISO.filter(function (o, j) { return o.Z === it.Z && j !== cur; })
      .map(function (o) { return c16Nuc(o.A, o.Z, o.s); }).join(" , ");
    var h = '<div style="font-family:Kalam,cursive;font-size:' + px(96) + ';color:' + C16.yellow + ';line-height:1;margin-bottom:' + px(14) + ';">' + c16Nuc(it.A, it.Z, it.s) + "</div>"
      + "<div><em>Z</em> = " + c16Strong(it.Z, C16.coral) + " proton" + (it.Z > 1 ? "s" : "") + "</div>"
      + "<div><em>A</em> = " + c16Strong(it.A) + " nucléon" + (it.A > 1 ? "s" : "") + "</div>"
      + "<div><em>N</em> = <em>A</em> − <em>Z</em> = " + it.A + " − " + it.Z + " = " + c16Strong(N, C16.blue) + " neutron" + (N > 1 ? "s" : "") + "</div>"
      + '<div style="margin-top:' + px(14) + ';color:' + C16.chalk + ';">Élément ' + it.el + " · isotopes : " + same + "</div>";
    if (prev != null && prev !== cur) {
      var p = C16_ISO[prev];
      h += '<div style="margin-top:' + px(10) + ';font-size:' + px(27) + ';">Par rapport à ' + c16Nuc(p.A, p.Z, p.s) + " : "
        + (p.Z === it.Z ? c16Strong("même Z, isotopes", C16.teal) : c16Strong("Z différent, autre élément", C16.coral)) + "</div>";
    }
    readout.innerHTML = h;
  }
  function select(i) {
    prev = cur === i ? prev : cur;
    cur = i;
    c16Toggle(btns, cur);
    build();
    info();
  }
  btns.forEach(function (b, i) { c16Listen(b, "click", function () { select(i); }); });
  prev = null;
  c16Toggle(btns, cur);
  build();
  info();
  ch16Loop(svg, draw);
}

/* ---------- 2. Compléter une équation nucléaire ---------- */
var C16_PART = [
  { A: 0, Z: -1, s: "e", n: "électron" }, { A: 0, Z: 1, s: "e", n: "positon" },
  { A: 1, Z: 0, s: "n", n: "neutron" }, { A: 1, Z: 1, s: "p", n: "proton" }, { A: 4, Z: 2, s: "He", n: "noyau d'hélium" }
];
var C16_REAC = [
  { r: [[14, 6, "C"]], p: [[14, 7, "N"]], ans: 0, t: "Désintégration du carbone 14" },
  { r: [[238, 94, "Pu"]], p: [[234, 92, "U"]], ans: 4, t: "Désintégration du plutonium 238" },
  { r: [[30, 15, "P"]], p: [[30, 14, "Si"]], ans: 1, t: "Désintégration du phosphore 30" },
  { r: [[2, 1, "H"], [3, 1, "H"]], p: [[4, 2, "He"]], ans: 2, t: "Fusion de deux isotopes de l'hydrogène (Soleil)" }
];
function initNuclearEq(cfg) {
  var box = c16El(cfg.boxId), readout = c16El(cfg.readoutId);
  if (!box) return;
  var rb = (cfg.reactionIds || []).map(c16El), pb = (cfg.particleIds || []).map(c16El);
  var ri = 0, pick = null, k0 = cfg.scale || 1;
  function px(v) { return Math.round(v * k0) + "px"; }
  function sum(list, k) { return list.reduce(function (a, x) { return a + x[k]; }, 0); }
  function row(label, L, R, ok, color) {
    return '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:' + px(18) + ';font-size:' + px(31) + ';">'
      + '<span style="min-width:' + px(120) + ';font-family:Kalam,cursive;color:' + color + ';">' + label + "</span>"
      + "<span>" + L + "</span><span>" + (ok == null ? "=" : ok ? "=" : "≠") + "</span><span>" + R + "</span>"
      + (ok == null ? "" : '<span>' + (ok ? "✅" : "❌") + "</span>") + "</div>";
  }
  function render() {
    var R = C16_REAC[ri];
    var reac = R.r.map(function (x) { return { A: x[0], Z: x[1], s: x[2] }; });
    var prod = R.p.map(function (x) { return { A: x[0], Z: x[1], s: x[2] }; });
    var P = pick == null ? null : C16_PART[pick];
    var unk = P ? c16Nuc(P.A, P.Z, P.s, C16.yellow)
      : '<span style="display:inline-flex;align-items:center;justify-content:center;width:' + px(96) + ';height:' + px(96) + ';border:3px dashed rgba(232,196,104,0.6);border-radius:12px;color:' + C16.yellow + ';">?</span>';
    var eq = reac.map(function (x) { return c16Nuc(x.A, x.Z, x.s, C16.teal); }).join("<span>+</span>")
      + "<span>→</span>" + prod.map(function (x) { return c16Nuc(x.A, x.Z, x.s, C16.coral); }).join("<span>+</span>")
      + "<span>+</span>" + unk;
    var h = '<div style="font-size:' + px(30) + ';color:' + C16.dim + ';">' + R.t + "</div>"
      + '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:' + px(22) + ';font-family:Kalam,cursive;font-size:' + px(92) + ';line-height:1;min-height:' + px(130) + ';">' + eq + "</div>";
    var lA = reac.map(function (x) { return x.A; }).join(" + "), lZ = reac.map(function (x) { return c16Sgn(x.Z); }).join(" + ");
    var pA = prod.map(function (x) { return x.A; }), pZ = prod.map(function (x) { return c16Sgn(x.Z); });
    if (P) {
      pA.push(P.A); pZ.push(P.Z < 0 ? "(" + c16Sgn(P.Z) + ")" : P.Z);
      var okA = sum(reac, "A") === sum(prod, "A") + P.A, okZ = sum(reac, "Z") === sum(prod, "Z") + P.Z;
      h += '<div style="display:flex;flex-direction:column;gap:' + px(10) + ';margin-top:' + px(8) + ';">'
        + row("Masse A", lA, pA.join(" + "), okA, C16.yellow) + row("Charge Z", lZ, pZ.join(" + "), okZ, C16.yellow) + "</div>";
      if (readout) readout.innerHTML = okA && okZ
        ? "La particule émise est un " + c16Strong(P.n) + " : le nombre de masse " + c16Strong("A") + " et le nombre de charge " + c16Strong("Z") + " sont conservés."
        : '<span style="color:' + C16.coral + ';">Un ' + P.n + " ne convient pas : " + (!okA ? "le nombre de masse A" : "") + (!okA && !okZ ? " et " : "") + (!okZ ? "le nombre de charge Z" : "") + " ne " + (!okA && !okZ ? "sont" : "est") + " pas conservé" + (!okA && !okZ ? "s" : "") + ".</span>";
    } else {
      pA.push("?"); pZ.push("?");
      h += '<div style="display:flex;flex-direction:column;gap:' + px(10) + ';margin-top:' + px(8) + ';">'
        + row("Masse A", lA, pA.join(" + "), null, C16.yellow) + row("Charge Z", lZ, pZ.join(" + "), null, C16.yellow) + "</div>";
      if (readout) readout.innerHTML = "Choisir la particule qui complète l'équation.";
    }
    box.innerHTML = h;
    c16Toggle(rb, ri);
    c16Toggle(pb, pick == null ? -1 : pick);
  }
  rb.forEach(function (b, i) { c16Listen(b, "click", function () { ri = i; pick = null; render(); }); });
  pb.forEach(function (b, i) { c16Listen(b, "click", function () { pick = i; render(); }); });
  render();
}
