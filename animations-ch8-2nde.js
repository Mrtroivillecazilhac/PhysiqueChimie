/* Animations du chapitre 8 — 2nde — « Vers des entités plus stables ».
   Réécriture de uploads/animations-ch8-2nde.js : mêmes noms de fonctions et mêmes clés
   de configuration que la version du site. Vraies configurations électroniques (Z ≤ 18),
   ions dessinés avec le bon nombre d'électrons, schémas de Lewis complets (H₂O, C₂H₄).
   Clés optionnelles ajoutées : zOutId, nOutId (affichage des curseurs).
   Le viewBox de chaque SVG est fixé ici (pas besoin de le changer dans la page). */

var CH8S = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.14)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
var CH8S_SYM = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar".split(" ");
var CH8S_NAME = ["hydrogène", "hélium", "lithium", "béryllium", "bore", "carbone", "azote", "oxygène", "fluor", "néon",
  "sodium", "magnésium", "aluminium", "silicium", "phosphore", "soufre", "chlore", "argon"];
var SUBSHELLS = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6]];

/* Conservées pour compatibilité avec la version du site. */
function computeElectronConfig(Z) {
  var remaining = Z, cfg = [];
  for (var i = 0; i < SUBSHELLS.length; i++) {
    if (remaining <= 0) break;
    var n = Math.min(remaining, SUBSHELLS[i][1]);
    cfg.push([SUBSHELLS[i][0], n]);
    remaining -= n;
  }
  return cfg;
}
function configToString(cfg) {
  return cfg.map(function (c) { return c[0] + '<tspan baseline-shift="super" font-size="0.7em">' + c[1] + "</tspan>"; }).join(" ");
}

function ch8sOrd(n) { return n === 1 ? "1ʳᵉ" : n + "ᵉ"; }
function ch8sN(v) { return Math.round(v * 100) / 100; }
function ch8sEl(id) { return id ? document.getElementById(id) : null; }
function ch8sSup(s) { return typeof toSuperscript === "function" ? toSuperscript(String(s)) : String(s); }
function ch8sListen(el, type, fn) {
  if (!el) return;
  el.__ch8sH = el.__ch8sH || {};
  if (el.__ch8sH[type]) el.removeEventListener(type, el.__ch8sH[type]);
  el.__ch8sH[type] = fn;
  el.addEventListener(type, fn);
}
function ch8sRange(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  var v = Number(el.value);
  if (el.value === "" || !isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}
function ch8sView(svg, vb) { if (svg && svg.getAttribute("viewBox") !== vb) svg.setAttribute("viewBox", vb); }

/* Texte SVG déclaré ×4 puis réduit (contourne la taille de police minimale des navigateurs). */
function ch8sText(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + ch8sN(x) + " " + ch8sN(y) + ') scale(0.25)" font-size="' + ch8sN(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? CH8S.hand : CH8S.font) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
function ch8sElectron(x, y, r, color, op) {
  return "<g" + (op != null && op < 1 ? ' opacity="' + ch8sN(Math.max(0, op)) + '"' : "") + '><circle cx="' + ch8sN(x) + '" cy="' + ch8sN(y) + '" r="' + ch8sN(r) + '" fill="' + (color || CH8S.chalk) + '"/>'
    + (r >= 2.6 ? '<line x1="' + ch8sN(x - r * 0.5) + '" y1="' + ch8sN(y) + '" x2="' + ch8sN(x + r * 0.5) + '" y2="' + ch8sN(y) + '" stroke="' + CH8S.board + '" stroke-width="' + ch8sN(r * 0.28) + '"/>' : "") + "</g>";
}
/* Configuration en tspans SVG ; couche de valence en jaune. */
function ch8sCfgSvg(cfg, valN) {
  return cfg.map(function (c, i) {
    var col = Number(c[0][0]) === valN ? CH8S.yellow : CH8S.chalk;
    return (i ? '<tspan dx="16"> </tspan>' : "") + '<tspan fill="' + col + '">' + c[0] + '</tspan><tspan fill="' + col + '" dy="-18" font-size="0.68em">' + c[1] + '</tspan><tspan dy="18"></tspan>';
  }).join("");
}
/* Configuration en HTML. */
function ch8sCfgHtml(cfg, valN) {
  return cfg.map(function (c) {
    var on = valN != null && Number(c[0][0]) === valN;
    return '<span style="white-space:nowrap;' + (on ? "color:" + CH8S.yellow + ";font-weight:600;" : "") + '">' + c[0] + ch8sSup(c[1]) + "</span>";
  }).join(" ");
}
function ch8sValence(Z) {
  var cfg = computeElectronConfig(Z), maxN = 0, s = 0, p = 0;
  cfg.forEach(function (c) { maxN = Math.max(maxN, Number(c[0][0])); });
  cfg.forEach(function (c) { if (Number(c[0][0]) === maxN) { if (c[0][1] === "s") s = c[1]; else p = c[1]; } });
  return { cfg: cfg, n: maxN, s: s, p: p, v: s + p };
}
function ch8sLine(t) { return "<div>" + t + "</div>"; }
function ch8sStrong(t, c) { return '<strong style="color:' + (c || CH8S.yellow) + '">' + t + "</strong>"; }
function ch8sRow(ok, t) {
  return '<div style="display:flex;gap:12px;align-items:baseline;"><span style="color:' + (ok ? CH8S.teal : CH8S.coral) + ';flex:none;">' + (ok ? "✓" : "✗") + "</span><span>" + t + "</span></div>";
}
function ch8sToggle(pairs, isOn) {
  pairs.forEach(function (pr) {
    var b = pr[0]; if (!b) return;
    var on = isOn(pr[1]);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? CH8S.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? CH8S.yellow : CH8S.dim;
  });
}
/* Boucle rAF liée au SVG ; s'arrête quand il quitte le document, ne dessine pas s'il est masqué. */
function ch8sLoop(svg, fn) {
  if (svg.__ch8sLoop) svg.__ch8sLoop.stop = true;
  var L = { stop: false }, t0 = performance.now();
  svg.__ch8sLoop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function ch8sEase(p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); }

/* ---------- 1. Configuration électronique ---------- */
function initElectronConfig(cfg) {
  var svg = ch8sEl(cfg.svgId);
  if (!svg) return;
  ch8sView(svg, "0 0 240 150");
  var zR = ch8sEl(cfg.zRangeId), readout = ch8sEl(cfg.readoutId), zOut = ch8sEl(cfg.zOutId);
  ch8sRange(zR, 1, 18, 1);
  var getZ = function () { return zR ? Number(zR.value) : 14; };
  var lastZ = getZ(), changedAt = -10;
  var ROWS = { 1: 132, 2: 102, 3: 72 };
  var BOX = { s: { x: 46, w: 30 }, p: { x: 86, w: 82 } };

  function frame(t) {
    var Z = getZ();
    if (Z !== lastZ) { lastZ = Z; changedAt = t; }
    var V = ch8sValence(Z);
    var s = ch8sText(8, 18, "atome de " + CH8S_NAME[Z - 1], CH8S.chalk, 12, "start", true);
    s += ch8sText(232, 18, CH8S_SYM[Z - 1] + "  (Z = " + Z + ")", CH8S.yellow, 11, "end", false, 600);
    s += ch8sText(8, 42, ch8sCfgSvg(V.cfg, V.n), CH8S.chalk, 12, "start", false, 500);
    var k = 0;
    [1, 2, 3].forEach(function (n) {
      var y = ROWS[n], val = n === V.n;
      if (val) s += '<rect x="38" y="' + (y - 21) + '" width="138" height="31" rx="5" fill="rgba(232,196,104,0.08)" stroke="' + CH8S.yellow + '" stroke-width="1"/>';
      s += ch8sText(10, y + 3, "n = " + n, val ? CH8S.yellow : CH8S.dim, 9, "start", false, 600);
      if (val) s += ch8sText(180, y + 3, "couche de", CH8S.yellow, 8, "start") + ch8sText(180, y + 12, "valence", CH8S.yellow, 8, "start");
      ["s", "p"].forEach(function (l) {
        if (n === 1 && l === "p") return;
        var B = BOX[l], max = l === "s" ? 2 : 6, name = n + l;
        s += '<rect x="' + B.x + '" y="' + (y - 7) + '" width="' + B.w + '" height="14" rx="3" fill="rgba(0,0,0,0.22)" stroke="' + CH8S.line + '" stroke-width="0.8"/>';
        s += ch8sText(B.x + 1, y - 10, name, val ? CH8S.yellow : CH8S.dim, 7.5, "start", false, 600);
        var filled = 0;
        V.cfg.forEach(function (c) { if (c[0] === name) filled = c[1]; });
        for (var i = 0; i < max; i++) {
          var x = B.x + 8 + i * (l === "s" ? 14 : 13.2);
          if (i < filled) {
            var idx = k + i, isNew = idx === Z - 1;
            var r = 3.3 + (isNew ? 0.6 * Math.sin(t * 5) : 0);
            var drop = isNew ? (1 - ch8sEase((t - changedAt) / 0.5)) * 14 : 0;
            s += ch8sElectron(x, y - drop, r, val ? CH8S.yellow : CH8S.chalk);
          } else {
            s += '<circle cx="' + ch8sN(x) + '" cy="' + y + '" r="3" fill="none" stroke="' + CH8S.faint + '" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>';
          }
        }
        k += filled;
      });
    });
    svg.innerHTML = s;
  }

  function text() {
    var Z = getZ(), V = ch8sValence(Z);
    if (zOut) zOut.textContent = "Z = " + Z;
    if (!readout) return;
    readout.innerHTML = ch8sLine('<strong style="color:' + CH8S.chalk + '">' + CH8S_NAME[Z - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + "</strong> (" + CH8S_SYM[Z - 1] + ") : " + Z + " électron" + (Z > 1 ? "s" : "") + ".")
      + ch8sLine(ch8sCfgHtml(V.cfg, V.n))
      + ch8sLine("Ordre de remplissage : 1s → 2s → 2p → 3s → 3p (s : 2 max ; p : 6 max).")
      + '<div style="margin-top:10px;">Couche de valence n = ' + V.n + " : " + ch8sStrong(V.v + " électron" + (V.v > 1 ? "s" : "") + " de valence") + ".</div>";
  }
  ch8sListen(zR, "input", text);
  text();
  ch8sLoop(svg, frame);
}

/* ---------- 2. Position dans le tableau périodique ---------- */
function ch8sPosition(Z) {
  if (Z === 1) return { periode: 1, colonne: 1 };
  if (Z === 2) return { periode: 1, colonne: 18 };
  var V = ch8sValence(Z);
  return { periode: V.n, colonne: V.p > 0 ? 12 + V.p : V.s };
}
function initPeriodicPosition(cfg) {
  var svg = ch8sEl(cfg.svgId);
  if (!svg) return;
  ch8sView(svg, "0 0 240 142");
  var zR = ch8sEl(cfg.zRangeId), readout = ch8sEl(cfg.readoutId), zOut = ch8sEl(cfg.zOutId);
  ch8sRange(zR, 1, 18, 1);
  var getZ = function () { return zR ? Number(zR.value) : 15; };
  var COLS = [1, 2, 13, 14, 15, 16, 17, 18], W = 24, H = 25;
  var cx = function (ci) { return 30 + ci * 26 + (ci >= 2 ? 12 : 0); };
  var ry = function (p) { return 27 + (p - 1) * 28; };
  function zAt(p, c) {
    if (p === 1) return c === 1 ? 1 : c === 18 ? 2 : 0;
    var base = p === 2 ? 2 : 10;
    return c <= 2 ? base + c : base + c - 10;
  }

  function frame(t) {
    var Z = getZ(), P = ch8sPosition(Z), V = ch8sValence(Z);
    var ci0 = COLS.indexOf(P.colonne), glow = 0.5 + 0.5 * Math.sin(t * 3);
    var s = ch8sText(cx(0) + 25, 9, "bloc s", CH8S.dim, 7.5, "middle", true);
    s += ch8sText((cx(2) + cx(7) + W) / 2, 9, "bloc p", CH8S.dim, 7.5, "middle", true);
    s += '<rect x="2" y="' + (ry(P.periode) - 2) + '" width="236" height="' + (H + 4) + '" rx="4" fill="rgba(107,191,171,0.1)"/>';
    s += '<rect x="' + (cx(ci0) - 2) + '" y="12" width="' + (W + 4) + '" height="' + (ry(3) + H - 10) + '" rx="4" fill="rgba(107,191,171,0.1)"/>';
    COLS.forEach(function (c, ci) { s += ch8sText(cx(ci) + W / 2, 21, c, c === P.colonne ? CH8S.teal : CH8S.dim, 7, "middle", false, 600); });
    s += ch8sText(cx(1) + W + 7, ry(2) + 15, "…", CH8S.dim, 10, "middle");
    s += ch8sText(cx(1) + W + 7, ry(3) + 15, "…", CH8S.dim, 10, "middle");
    for (var p = 1; p <= 3; p++) {
      s += ch8sText(12, ry(p) + 16, p, p === P.periode ? CH8S.teal : CH8S.dim, 9, "middle", false, 600);
      COLS.forEach(function (c, ci) {
        var z = zAt(p, c);
        if (!z) return;
        var on = z === Z, x = cx(ci), y = ry(p);
        s += '<rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="3" fill="' + (on ? CH8S.yellow : "rgba(0,0,0,0.25)") + '" stroke="' + (on ? CH8S.yellow : CH8S.line) + '" stroke-width="' + (on ? 1.2 + glow : 0.8) + '"/>';
        s += ch8sText(x + 2.5, y + 7, z, on ? CH8S.board : CH8S.dim, 5.5);
        s += ch8sText(x + W / 2, y + 19, CH8S_SYM[z - 1], on ? CH8S.board : CH8S.chalk, 10, "middle", true, 700);
      });
    }
    var rule = Z <= 2 ? (Z === 2 ? "He : gaz noble → colonne 18" : "1s¹ → colonne 1")
      : V.p > 0 ? V.n + "s" + ch8sSup(V.s) + " " + V.n + "p" + ch8sSup(V.p) + "  →  colonne 12 + " + V.p + " = " + P.colonne
      : V.n + "s" + ch8sSup(V.s) + "  →  colonne " + P.colonne;
    s += ch8sText(8, 128, "valence : " + rule, CH8S.yellow, 9, "start", false, 600);
    s += ch8sText(8, 140, "n le plus grand = " + P.periode + "  →  " + ch8sOrd(P.periode) + " période", CH8S.teal, 9, "start", false, 600);
    svg.innerHTML = s;
  }

  function text() {
    var Z = getZ(), P = ch8sPosition(Z), V = ch8sValence(Z);
    if (zOut) zOut.textContent = "Z = " + Z;
    if (!readout) return;
    var col = Z === 2 ? "exception : placé en colonne 18 avec les gaz nobles"
      : V.p > 0 ? V.p + " électron" + (V.p > 1 ? "s" : "") + " en " + V.n + "p : colonne 12 + " + V.p + " = " + P.colonne
      : V.s + " électron" + (V.s > 1 ? "s" : "") + " en " + V.n + "s : colonne " + P.colonne;
    readout.innerHTML = ch8sLine('<strong style="color:' + CH8S.chalk + '">' + CH8S_SYM[Z - 1] + "</strong> (Z = " + Z + ") : " + ch8sCfgHtml(V.cfg, V.n))
      + ch8sRow(true, "n le plus grand = " + V.n + " → " + ch8sStrong(ch8sOrd(P.periode) + " période"))
      + ch8sRow(true, col + " → " + ch8sStrong(ch8sOrd(P.colonne) + " colonne"));
  }
  ch8sListen(zR, "input", text);
  text();
  ch8sLoop(svg, frame);
}

/* ---------- 3. Formation d'un ion stable (règle de stabilité) ---------- */
function initStableIon(cfg) {
  var svg = ch8sEl(cfg.svgId);
  if (!svg) return;
  ch8sView(svg, "0 0 240 170");
  var readout = ch8sEl(cfg.readoutId), bAl = ch8sEl(cfg.btnAlId), bS = ch8sEl(cfg.btnSId);
  var CASES = {
    al: { symbol: "Al", name: "aluminium", z: 13, lose: 3, gas: "Ne", gasName: "néon", ion: "Al³⁺", ch: "+3e", shells: [2, 8, 3], slots: [0, 3, 5] },
    s: { symbol: "S", name: "soufre", z: 16, gain: 2, gas: "Ar", gasName: "argon", ion: "S²⁻", ch: "−2e", shells: [2, 8, 6], slots: [0, 1, 2, 4, 5, 6], add: [3, 7] }
  };
  var current = cfg.mode || "al";
  var C = { x: 66, y: 88 }, R = [15, 30, 46], T1 = 1.4, T2 = 2.9, PER = 6.5;

  function frame(t) {
    var c = CASES[current], lose = current === "al";
    var tt = t % PER, e = ch8sEase((tt - T1) / (T2 - T1)), isIon = tt >= T2;
    var s = "";
    R.forEach(function (r, i) {
      var op = i === 2 && lose ? 1 - e * 0.85 : 1;
      s += '<circle cx="' + C.x + '" cy="' + C.y + '" r="' + r + '" fill="none" stroke="' + (i === 2 ? CH8S.yellow : CH8S.line) + '" stroke-width="0.9" stroke-dasharray="2.5,2.5" opacity="' + ch8sN(i === 2 ? 0.55 * op : 1) + '"/>';
    });
    s += '<circle cx="' + C.x + '" cy="' + C.y + '" r="9" fill="' + CH8S.coral + '"/>';
    s += ch8sText(C.x, C.y + 3.5, c.symbol, CH8S.board, 9, "middle", false, 700);
    [0, 1].forEach(function (i) {
      var n = c.shells[i], w = i ? 0.35 : -0.5;
      for (var j = 0; j < n; j++) {
        var a = t * w + j * 2 * Math.PI / n;
        s += ch8sElectron(C.x + R[i] * Math.cos(a), C.y + R[i] * Math.sin(a), 2.8, CH8S.chalk);
      }
    });
    var rot = t * 0.22, slot = function (k) { return rot + k * Math.PI / 4; };
    c.slots.forEach(function (k) {
      var a = slot(k), r = R[2] + (lose ? e * 70 : 0);
      s += ch8sElectron(C.x + r * Math.cos(a), C.y + r * Math.sin(a), 3, CH8S.yellow, lose ? 1 - e : 1);
    });
    if (!lose) c.add.forEach(function (k) {
      var a = slot(k), r = R[2] + (1 - e) * 70;
      s += ch8sElectron(C.x + r * Math.cos(a), C.y + r * Math.sin(a), 3, CH8S.teal, e * 1.4);
      if (e > 0 && e < 1) s += '<circle cx="' + ch8sN(C.x + r * Math.cos(a)) + '" cy="' + ch8sN(C.y + r * Math.sin(a)) + '" r="6" fill="none" stroke="' + CH8S.teal + '" stroke-width="1"/>';
    });
    s += '<line x1="128" y1="14" x2="128" y2="160" stroke="' + CH8S.faint + '" stroke-width="1"/>';
    var X = 136;
    s += ch8sText(X, 22, isIon ? "ion " + c.ion : "atome " + c.symbol, isIon ? CH8S.yellow : CH8S.chalk, 13, "start", true, 700);
    s += ch8sText(X, 36, "charge : " + (isIon ? c.ch : "0"), isIon ? CH8S.yellow : CH8S.dim, 9, "start", false, 600);
    var cfgA = computeElectronConfig(c.z), cfgI = computeElectronConfig(lose ? c.z - c.lose : c.z + c.gain);
    s += ch8sText(X, 58, "configuration", CH8S.dim, 8);
    var lines = (isIon ? cfgI : cfgA);
    s += ch8sText(X, 72, ch8sCfgSvg(lines.slice(0, 3), isIon ? -1 : 3), CH8S.chalk, 9.5, "start", false, 500);
    if (lines.length > 3) s += ch8sText(X, 86, ch8sCfgSvg(lines.slice(3), isIon ? -1 : 3), CH8S.chalk, 9.5, "start", false, 500);
    var nv = isIon ? (lose ? 8 : 8) : c.shells[2];
    s += ch8sText(X, 108, "couche externe : " + nv + " e⁻", isIon ? CH8S.teal : CH8S.yellow, 9, "start", false, 600);
    if (isIon) {
      s += '<rect x="' + X + '" y="118" width="98" height="30" rx="5" fill="rgba(107,191,171,0.12)" stroke="' + CH8S.teal + '" stroke-width="1"/>';
      s += ch8sText(X + 49, 131, "comme le " + c.gasName + " " + c.gas, CH8S.teal, 8.5, "middle", false, 600);
      s += ch8sText(X + 49, 143, "octet ✓", CH8S.teal, 10, "middle", true, 700);
    } else {
      s += ch8sText(X, 132, lose ? "perd " + c.lose + " électrons…" : "gagne " + c.gain + " électrons…", CH8S.dim, 9, "start", true);
    }
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    var c = CASES[current], lose = current === "al";
    var cfgA = computeElectronConfig(c.z), cfgI = computeElectronConfig(lose ? c.z - c.lose : c.z + c.gain);
    readout.innerHTML = ch8sLine('<strong style="color:' + CH8S.chalk + '">Atome de ' + c.name + "</strong> " + c.symbol + " (Z = " + c.z + ") : " + ch8sCfgHtml(cfgA, 3))
      + ch8sLine("Il " + (lose ? "perd " + c.lose : "gagne " + c.gain) + " électrons pour obtenir la configuration du gaz noble le plus proche, " + (lose ? "le " : "l'") + ch8sStrong(c.gasName + " " + c.gas) + ".")
      + ch8sLine("Ion " + ch8sStrong(c.ion, lose ? CH8S.coral : CH8S.teal) + " : " + ch8sCfgHtml(cfgI))
      + ch8sRow(true, "couche externe en octet : l'ion est stable");
  }

  function show() {
    ch8sToggle([[bAl, "al"], [bS, "s"]], function (x) { return x === current; });
    text();
    ch8sLoop(svg, frame);
  }
  ch8sListen(bAl, "click", function () { current = "al"; show(); });
  ch8sListen(bS, "click", function () { current = "s"; show(); });
  show();
}

/* ---------- 4. Schéma de Lewis (doublets liants / non liants) ---------- */
function initLewisSchema(cfg) {
  var svg = ch8sEl(cfg.svgId);
  if (!svg) return;
  ch8sView(svg, "0 0 240 150");
  var readout = ch8sEl(cfg.readoutId), bSi = ch8sEl(cfg.btnSimpleId), bDo = ch8sEl(cfg.btnDoubleId);
  var mode = cfg.mode || "simple";
  var MOL = {
    simple: {
      title: "molécule d'eau H₂O", center: "O",
      atoms: [["O", 120, 74], ["H", 68, 74], ["H", 172, 74]],
      parts: [
        { id: "b1", kind: "liant", lines: [[78, 74, 108, 74]] },
        { id: "b2", kind: "liant", lines: [[132, 74, 162, 74]] },
        { id: "n1", kind: "nl", lines: [[112, 56, 128, 56]] },
        { id: "n2", kind: "nl", lines: [[112, 92, 128, 92]] }
      ],
      steps: [["b1", 2], ["b2", 2], ["n1", 2], ["n2", 2]], rule: "octet", h: "b1"
    },
    double: {
      title: "molécule d'éthène C₂H₄", center: "C",
      atoms: [["C", 98, 74], ["C", 142, 74], ["H", 62, 46], ["H", 62, 102], ["H", 178, 46], ["H", 178, 102]],
      parts: [
        { id: "d", kind: "double", lines: [[107, 70, 133, 70], [107, 78, 133, 78]] },
        { id: "h1", kind: "liant", lines: [[90, 67, 70, 52]] },
        { id: "h2", kind: "liant", lines: [[90, 81, 70, 96]] },
        { id: "h3", kind: "liant", lines: [[150, 67, 170, 52]] },
        { id: "h4", kind: "liant", lines: [[150, 81, 170, 96]] }
      ],
      steps: [["h1", 2], ["h2", 2], ["d", 4]], rule: "octet", h: "h1"
    }
  };
  var STEP = 0.9;

  function frame(t) {
    var M = MOL[mode], nSteps = M.steps.length, per = nSteps * STEP + 1.6 + 1.8;
    var tt = t % per, k = Math.min(nSteps, Math.floor(tt / STEP) + 1), phaseH = tt > nSteps * STEP + 1.6;
    var on = {}, count = 0;
    if (!phaseH) for (var i = 0; i < k; i++) { on[M.steps[i][0]] = 1; count += M.steps[i][1]; }
    else on[M.h] = 1;
    var s = ch8sText(8, 16, M.title, CH8S.chalk, 11, "start", true, 700);
    M.parts.forEach(function (p) {
      var col = p.kind === "nl" ? CH8S.coral : p.kind === "double" ? CH8S.yellow : CH8S.teal;
      p.lines.forEach(function (L) {
        if (on[p.id]) s += '<line x1="' + L[0] + '" y1="' + L[1] + '" x2="' + L[2] + '" y2="' + L[3] + '" stroke="' + col + '" stroke-width="7" stroke-linecap="round" opacity="0.25"/>';
        s += '<line x1="' + L[0] + '" y1="' + L[1] + '" x2="' + L[2] + '" y2="' + L[3] + '" stroke="' + col + '" stroke-width="2.6" stroke-linecap="round"/>';
      });
    });
    var focus = phaseH ? null : M.center;
    M.atoms.forEach(function (a, i) {
      var hl = (i === 0 && !phaseH) || (phaseH && a[0] === "H" && i === (mode === "simple" ? 1 : 2));
      if (hl) s += '<circle cx="' + a[1] + '" cy="' + a[2] + '" r="25" fill="none" stroke="' + CH8S.yellow + '" stroke-width="1" stroke-dasharray="3,3" opacity="0.8"/>';
      s += ch8sText(a[1], a[2] + 7.5, a[0], CH8S.chalk, 22, "middle", true, 700);
    });
    if (mode === "simple") {
      s += ch8sText(140, 52, "doublet non liant", CH8S.coral, 8, "start");
      s += ch8sText(93, 112, "doublet liant", CH8S.teal, 8, "middle");
    } else {
      s += ch8sText(120, 98, "liaison double", CH8S.yellow, 8, "middle");
      s += ch8sText(120, 108, "(2 doublets liants)", CH8S.yellow, 7.5, "middle");
    }
    var msg = phaseH ? "autour de H : 2 électrons  →  duet ✓"
      : "autour de " + focus + " : " + count + " électrons" + (k >= nSteps && tt > nSteps * STEP ? "  →  octet ✓" : "");
    s += '<rect x="20" y="124" width="200" height="20" rx="5" fill="rgba(0,0,0,0.25)" stroke="' + CH8S.faint + '" stroke-width="0.8"/>';
    s += ch8sText(120, 138, msg, msg.indexOf("✓") > -1 ? CH8S.yellow : CH8S.chalk, 10, "middle", false, 600);
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    readout.innerHTML = mode === "simple"
      ? ch8sLine('<strong style="color:' + CH8S.chalk + '">Eau H₂O</strong> : 2 ' + ch8sStrong("doublets liants", CH8S.teal) + " (liaisons O−H) et 2 " + ch8sStrong("doublets non liants", CH8S.coral) + " sur O.")
        + ch8sRow(true, "O : 4 doublets = 8 électrons, octet")
        + ch8sRow(true, "H : 1 doublet = 2 électrons, duet")
        + '<div style="margin-top:10px;">Les électrons d\'une liaison appartiennent aux deux atomes.</div>'
      : ch8sLine('<strong style="color:' + CH8S.chalk + '">Éthène C₂H₄</strong> : les deux carbones sont reliés par une ' + ch8sStrong("liaison double") + ".")
        + ch8sLine("Liaison double : 2 doublets liants, soit 4 électrons mis en commun.")
        + ch8sRow(true, "C : 2 + 2 + 4 = 8 électrons, octet")
        + ch8sRow(true, "H : 2 électrons, duet");
  }

  function show() {
    ch8sToggle([[bSi, "simple"], [bDo, "double"]], function (x) { return x === mode; });
    text();
    ch8sLoop(svg, frame);
  }
  ch8sListen(bSi, "click", function () { mode = "simple"; show(); });
  ch8sListen(bDo, "click", function () { mode = "double"; show(); });
  show();
}

/* ---------- 5. Calculateur d'énergie de liaison ---------- */
function initBondEnergy(cfg) {
  var svg = ch8sEl(cfg.svgId);
  if (!svg) return;
  ch8sView(svg, "0 0 240 150");
  var nR = ch8sEl(cfg.nRangeId), readout = ch8sEl(cfg.readoutId), nOut = ch8sEl(cfg.nOutId);
  var bCH = ch8sEl(cfg.btnCHId), bCC = ch8sEl(cfg.btnCCId), bCCd = ch8sEl(cfg.btnCCdoubleId);
  ch8sRange(nR, 1, 6, 1);
  var BONDS = { ch: { label: "C−H", energy: 413 }, cc: { label: "C−C", energy: 348 }, ccd: { label: "C=C", energy: 614 } };
  var current = cfg.mode || "ch";
  var getN = function () { return nR ? Number(nR.value) : 4; };
  var key = "", since = 0, EMAX = 4000, base = 128, HMAX = 108, bx = 168, bw = 34;
  var hOf = function (E) { return E / EMAX * HMAX; };

  function frame(t) {
    var n = getN(), b = BONDS[current];
    if (key !== current + n) { key = current + n; since = t; }
    var shown = Math.min(n, (t - since) / 0.22);
    var s = ch8sText(8, 14, "rompre " + n + " liaison" + (n > 1 ? "s" : "") + " " + b.label, CH8S.chalk, 11, "start", true, 700);
    for (var i = 0; i < 6; i++) {
      var x = 10 + (i % 2) * 70, y = 24 + Math.floor(i / 2) * 30, act = i < n, lit = i < shown;
      s += '<rect x="' + x + '" y="' + y + '" width="64" height="24" rx="5" fill="' + (act ? "rgba(232,196,104," + (lit ? 0.12 : 0.04) + ")" : "none") + '" stroke="' + (act ? CH8S.yellow : CH8S.faint) + '" stroke-width="' + (act ? 1 : 0.7) + '" stroke-dasharray="' + (act ? "none" : "2,2") + '"/>';
      if (act) {
        var gap = lit ? 3 : 0;
        s += ch8sText(x + 18 - gap, y + 16, "C", CH8S.chalk, 11, "middle", true, 700);
        s += ch8sText(x + 32, y + 16, current === "ccd" ? "=" : "−", CH8S.yellow, 11, "middle", false, 700);
        s += ch8sText(x + 46 + gap, y + 16, current === "ch" ? "H" : "C", CH8S.chalk, 11, "middle", true, 700);
      }
    }
    s += ch8sText(8, 128, "E = " + n + " × " + b.energy, CH8S.yellow, 10, "start", false, 600);
    s += ch8sText(8, 142, "= " + (n * b.energy).toLocaleString("fr-FR") + " USI", CH8S.yellow, 12, "start", false, 700);
    [1000, 2000, 3000, 4000].forEach(function (E) {
      var y = base - hOf(E);
      s += '<line x1="' + (bx - 4) + '" y1="' + ch8sN(y) + '" x2="' + (bx + bw + 4) + '" y2="' + ch8sN(y) + '" stroke="' + CH8S.faint + '" stroke-width="0.7"/>';
      s += ch8sText(bx + bw + 7, y + 3, E.toLocaleString("fr-FR"), CH8S.dim, 6.5);
    });
    s += '<line x1="' + (bx - 6) + '" y1="' + base + '" x2="' + (bx + bw + 6) + '" y2="' + base + '" stroke="' + CH8S.chalk + '" stroke-width="1"/>';
    var top = base;
    for (var j = 0; j < Math.ceil(shown); j++) {
      var f = Math.min(1, shown - j), h = hOf(b.energy) * ch8sEase(f);
      top -= h;
      s += '<rect x="' + bx + '" y="' + ch8sN(top) + '" width="' + bw + '" height="' + ch8sN(Math.max(0, h - 0.8)) + '" fill="' + CH8S.yellow + '" opacity="' + (j % 2 ? 0.75 : 0.95) + '"/>';
    }
    var tot = Math.round(Math.min(n, shown) * b.energy);
    s += ch8sText(bx + bw / 2, top - 4, tot.toLocaleString("fr-FR"), CH8S.yellow, 9, "middle", false, 700);
    s += ch8sText(bx + bw / 2, 142, "USI", CH8S.dim, 8, "middle");
    svg.innerHTML = s;
  }

  function text() {
    var n = getN(), b = BONDS[current], tot = n * b.energy;
    if (nOut) nOut.textContent = n;
    if (!readout) return;
    readout.innerHTML = ch8sLine("Énergie de la liaison " + b.label + " : " + b.energy + " USI.")
      + ch8sLine("Pour rompre " + n + " liaison" + (n > 1 ? "s" : "") + " : E = " + n + " × " + b.energy + " = " + ch8sStrong(tot.toLocaleString("fr-FR") + " USI") + ".")
      + '<div style="margin-top:10px;">Plus l\'énergie de liaison est grande, plus la liaison est ' + ch8sStrong("stable", CH8S.teal) + ".</div>";
  }

  function show() {
    ch8sToggle([[bCH, "ch"], [bCC, "cc"], [bCCd, "ccd"]], function (x) { return x === current; });
    text();
    ch8sLoop(svg, frame);
  }
  ch8sListen(nR, "input", text);
  ch8sListen(bCH, "click", function () { current = "ch"; show(); });
  ch8sListen(bCC, "click", function () { current = "cc"; show(); });
  ch8sListen(bCCd, "click", function () { current = "ccd"; show(); });
  show();
}
