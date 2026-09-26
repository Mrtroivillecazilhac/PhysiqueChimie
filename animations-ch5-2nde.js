/* Animations du chapitre 5 — 2nde — « Modéliser une action mécanique sur un système ».
   Réécriture complète de uploads/animations-ch5-2nde.js. Mêmes noms de fonctions et
   mêmes clés de configuration que la version du site (réutilisable en ligne), plus
   des options pour les diapos : mode initial, forces masquées, curseur de masse,
   bouton d'option (oscillation du fil, frottements sur le support incliné). */

var CH5 = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
var CH5_G = 6.67e-11;

function ch5Fr(x, d) { return Number(x).toFixed(d).replace(".", ","); }
function ch5Sup(s) {
  const m = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  return String(s).split("").map((c) => m[c] || c).join("");
}
function ch5Sci(x) {
  const p = x.toExponential(2).split("e");
  return p[0].replace(".", ",") + " × 10" + ch5Sup(Number(p[1]));
}
function ch5El(id) { return id ? document.getElementById(id) : null; }

function ch5Listen(el, type, fn) {
  if (!el) return;
  el.__ch5H = el.__ch5H || {};
  if (el.__ch5H[type]) el.removeEventListener(type, el.__ch5H[type]);
  el.__ch5H[type] = fn;
  el.addEventListener(type, fn);
}

function ch5Range(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  const v = Number(el.value);
  if (!isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}

function ch5Frac(n, d) {
  return `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`;
}
function ch5VecHtml(sym, sub) {
  return `<span style="white-space:nowrap"><span class="vec"><em>${sym}</em></span>${sub ? `<sub>${sub}</sub>` : ""}</span>`;
}

function ch5Marker(id, color, size) {
  return `<marker id="${id}" markerWidth="${size}" markerHeight="${size}" refX="${size - 1}" refY="${size / 2}" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L${size},${size / 2} L0,${size} Z" fill="${color}"/></marker>`;
}
function ch5Defs(pfx) {
  return `<defs>${ch5Marker(pfx + "_y", CH5.yellow, 9)}${ch5Marker(pfx + "_t", CH5.teal, 9)}${ch5Marker(pfx + "_c", CH5.coral, 9)}</defs>`;
}

/* Flèche : le trait s'arrête sous la pointe pour ne pas dépasser. */
function ch5Arrow(x1, y1, x2, y2, color, mk, w) {
  const L = Math.hypot(x2 - x1, y2 - y1);
  if (L < 2) return "";
  const k = Math.max(0, L - 5) / L;
  return `<line x1="${x1}" y1="${y1}" x2="${x1 + (x2 - x1) * k}" y2="${y1 + (y2 - y1) * k}" stroke="${color}" stroke-width="${w || 2.6}"/>`
    + `<line x1="${x1 + (x2 - x1) * k * 0.99}" y1="${y1 + (y2 - y1) * k * 0.99}" x2="${x2}" y2="${y2}" stroke="transparent" stroke-width="0.1" marker-end="url(#${mk})"/>`;
}

/* Symbole vectoriel SVG : lettre + indice, flèche au-dessus de la lettre. */
function ch5VecSym(x, y, main, sub, color, size) {
  const w = size * 0.5, top = y - size * 0.95;
  let s = `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-family="${CH5.font}" font-style="italic" font-weight="600">${main}`;
  if (sub) s += `<tspan font-size="${size * 0.62}" dy="${size * 0.28}" font-style="normal" font-weight="500">${sub}</tspan>`;
  s += `</text>`;
  s += `<line x1="${x + size * 0.04}" y1="${top}" x2="${x + w}" y2="${top}" stroke="${color}" stroke-width="${size * 0.08}"/>`;
  s += `<path d="M${x + w},${top - size * 0.15} L${x + w + size * 0.26},${top} L${x + w},${top + size * 0.15} Z" fill="${color}"/>`;
  return s;
}

/* Boutons bascule : trait plein jaune pour le bouton actif. */
function ch5Toggle(pairs, isOn) {
  pairs.forEach(([b, k]) => {
    if (!b) return;
    const on = isOn(k);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return; /* page du site : style porté par styles.css */
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? CH5.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? CH5.yellow : CH5.dim;
  });
}

function ch5Stop(svg) { if (svg.__ch5Loop) svg.__ch5Loop.stop = true; }

/* Boucle rAF liée au SVG, arrêtée quand il quitte le document. dur : arrêt après dur ms. */
function ch5Loop(svg, frameFn, dur) {
  ch5Stop(svg);
  const L = { stop: false }, t0 = performance.now();
  svg.__ch5Loop = L;
  frameFn(t0, 0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    const p = dur ? Math.min(1, (now - t0) / dur) : 0;
    frameFn(now, p);
    if (dur && p >= 1) return;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
function ch5Ease(p) { return 1 - Math.pow(1 - p, 3); }

/* ---------- 1. Principe des actions réciproques ---------- */
function initReciprocalActions(cfg) {
  const svg = ch5El(cfg.svgId);
  if (!svg) return;
  const readout = ch5El(cfg.readoutId);
  const bC = ch5El(cfg.btnContactId), bD = ch5El(cfg.btnDistanceId);
  const mR = ch5El(cfg.massRangeId), mW = ch5El(cfg.massWrapId);
  if (mR) ch5Range(mR, 100, 2000, 100);
  const pfx = cfg.svgId;
  let mode = cfg.mode || "contact";

  const massKg = () => (mR ? Number(mR.value) / 1000 : 1);

  function scene(k) {
    let s = ch5Defs(pfx);
    if (mode === "contact") {
      const m = massKg(), F = m * 9.8;
      const L = (16 + F / 19.6 * 34) * k;
      const hb = 8 + m * 8, yT = 104;
      s += `<line x1="120" y1="26" x2="120" y2="148" stroke="${CH5.line}" stroke-width="1.2" stroke-dasharray="3,3"/>`;
      s += `<text x="124" y="33" font-size="8" font-family="${CH5.font}" fill="${CH5.dim}">droite d'action</text>`;
      s += `<rect x="40" y="${yT}" width="160" height="7" rx="1.5" fill="rgba(242,237,225,0.16)" stroke="${CH5.dim}" stroke-width="1.2"/>`;
      s += `<line x1="54" y1="${yT + 7}" x2="54" y2="146" stroke="${CH5.dim}" stroke-width="3"/><line x1="186" y1="${yT + 7}" x2="186" y2="146" stroke="${CH5.dim}" stroke-width="3"/>`;
      s += `<text x="206" y="${yT + 6}" font-size="12" font-family="${CH5.hand}" fill="${CH5.dim}">table</text>`;
      s += `<rect x="92" y="${yT - hb}" width="56" height="${hb}" rx="2" fill="${CH5.board2}" stroke="${CH5.chalk}" stroke-width="1.6"/>`;
      s += `<line x1="97" y1="${yT - hb + 2.5}" x2="97" y2="${yT - 2.5}" stroke="${CH5.dim}" stroke-width="1"/>`;
      s += `<text x="86" y="${yT - hb / 2 + 4}" font-size="12" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="end">livre</text>`;
      if (!cfg.hideForces && k > 0) {
        s += ch5Arrow(120, yT, 120, yT - L, CH5.yellow, pfx + "_y", 2.8);
        s += ch5Arrow(120, yT, 120, yT + L, CH5.teal, pfx + "_t", 2.8);
        s += ch5VecSym(126, yT - L + 11, "F", "table/livre", CH5.yellow, 11);
        s += ch5VecSym(126, yT + L - 1, "F", "livre/table", CH5.teal, 11);
        s += `<circle cx="120" cy="${yT}" r="2.4" fill="${CH5.chalk}"/>`;
      }
    } else {
      const y = 78, xT = 60, xL = 192, L = 52 * k;
      s += `<line x1="8" y1="${y}" x2="232" y2="${y}" stroke="${CH5.line}" stroke-width="1.2" stroke-dasharray="3,3"/>`;
      s += `<text x="232" y="${y - 6}" font-size="8" font-family="${CH5.font}" fill="${CH5.dim}" text-anchor="end">droite d'action</text>`;
      s += `<circle cx="${xT}" cy="${y}" r="28" fill="rgba(107,191,171,0.22)" stroke="${CH5.teal}" stroke-width="1.6"/>`;
      s += `<circle cx="${xL}" cy="${y}" r="9" fill="rgba(201,194,176,0.28)" stroke="${CH5.dim}" stroke-width="1.4"/>`;
      s += `<text x="${xT}" y="${y + 44}" font-size="13" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="middle">Terre</text>`;
      s += `<text x="${xL}" y="${y + 26}" font-size="13" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="middle">Lune</text>`;
      if (!cfg.hideForces && k > 0) {
        s += ch5Arrow(xL, y, xL - L, y, CH5.yellow, pfx + "_y", 2.8);
        s += ch5Arrow(xT, y, xT + L, y, CH5.teal, pfx + "_t", 2.8);
        s += ch5VecSym(xL - 50, y - 12, "F", "Terre/Lune", CH5.yellow, 11);
        s += ch5VecSym(xT + 32, y + 22, "F", "Lune/Terre", CH5.teal, 11);
      }
      s += `<circle cx="${xT}" cy="${y}" r="2.2" fill="${CH5.chalk}"/><circle cx="${xL}" cy="${y}" r="2.2" fill="${CH5.chalk}"/>`;
    }
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    const ok = (t) => `<div style="display:flex;gap:12px;align-items:baseline;"><span style="color:#6bbfab;">✓</span><span>${t}</span></div>`;
    let val;
    if (mode === "contact") {
      const F = massKg() * 9.8;
      val = `Valeur commune : <strong style="color:#e8c468">${ch5Fr(F, 1)} N</strong> (ici égale au poids du livre).`;
    } else {
      val = `Valeur commune : <strong style="color:#e8c468">${ch5Sci(CH5_G * 5.97e24 * 7.35e22 / Math.pow(3.84e8, 2))} N</strong>, bien que la Terre soit 80 fois plus massive que la Lune.`;
    }
    readout.innerHTML = `<div style="margin-bottom:14px;">${mode === "contact" ? "Interaction de <strong style=\"color:#f2ede1\">contact</strong>" : "Interaction <strong style=\"color:#f2ede1\">à distance</strong>"}</div>`
      + ok("même droite d'action") + ok("sens opposés") + ok("même valeur")
      + `<div style="margin-top:14px;">${val}</div>`;
  }

  function show(animate) {
    ch5Toggle([[bC, "contact"], [bD, "distance"]], (x) => x === mode);
    if (mW) mW.style.visibility = mode === "contact" ? "visible" : "hidden";
    text();
    if (animate && !cfg.hideForces) ch5Loop(svg, (now, p) => scene(ch5Ease(p)), 650);
    else { ch5Stop(svg); scene(1); }
  }
  ch5Listen(bC, "click", () => { mode = "contact"; show(true); });
  ch5Listen(bD, "click", () => { mode = "distance"; show(true); });
  ch5Listen(mR, "input", () => show(false));
  show(!cfg.hideForces && !!(bC || bD));
}

/* ---------- 2. Calculateur de force gravitationnelle ---------- */
function initGravitationalForce(cfg) {
  const svg = ch5El(cfg.svgId);
  const mAR = ch5El(cfg.mARangeId), mBR = ch5El(cfg.mBRangeId), dR = ch5El(cfg.dRangeId);
  const readout = ch5El(cfg.readoutId);
  if (!svg || !mAR || !mBR || !dR) return;
  ch5Range(mAR, 1, 10, 1); ch5Range(mBR, 1, 10, 1); ch5Range(dR, 1, 50, 1);
  const pfx = cfg.svgId;

  function draw() {
    const mA = Number(mAR.value), mB = Number(mBR.value), d = Number(dR.value);
    const F = CH5_G * (mA * 1e24) * (mB * 1e24) / Math.pow(d * 1e6, 2);
    const sep = 110 + (d - 1) / 49 * 100, cx = 125, xA = cx - sep / 2, xB = cx + sep / 2, y = 60;
    const rA = 6 + mA * 1.4, rB = 6 + mB * 1.4;
    /* flèches : même longueur pour les deux forces, échelle logarithmique */
    const L = Math.max(6, Math.min(sep / 2 - 4, 6 + (Math.log10(F) - 19.4) / 8.4 * 45));
    let s = ch5Defs(pfx);
    s += `<circle cx="${xA}" cy="${y}" r="${rA}" fill="rgba(107,191,171,0.22)" stroke="${CH5.teal}" stroke-width="1.5"/>`;
    s += `<circle cx="${xB}" cy="${y}" r="${rB}" fill="rgba(201,194,176,0.24)" stroke="${CH5.dim}" stroke-width="1.5"/>`;
    s += ch5Arrow(xA, y, xA + L, y, CH5.yellow, pfx + "_y", 2.6);
    s += ch5Arrow(xB, y, xB - L, y, CH5.yellow, pfx + "_y", 2.6);
    s += `<circle cx="${xA}" cy="${y}" r="2" fill="${CH5.chalk}"/><circle cx="${xB}" cy="${y}" r="2" fill="${CH5.chalk}"/>`;
    s += ch5VecSym(xA - 9, 24, "F", "B/A", CH5.yellow, 11);
    s += ch5VecSym(xB - 9, 24, "F", "A/B", CH5.yellow, 11);
    s += `<text x="${xA}" y="${y + rA + 12}" font-size="13" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="middle">A</text>`;
    s += `<text x="${xB}" y="${y + rB + 12}" font-size="13" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="middle">B</text>`;
    s += `<line x1="${xA}" y1="96" x2="${xA}" y2="108" stroke="${CH5.dim}" stroke-width="1"/><line x1="${xB}" y1="96" x2="${xB}" y2="108" stroke="${CH5.dim}" stroke-width="1"/>`;
    s += `<line x1="${xA}" y1="102" x2="${xB}" y2="102" stroke="${CH5.dim}" stroke-width="1" stroke-dasharray="3,2"/>`;
    s += `<text x="${cx}" y="120" font-size="10" font-family="${CH5.font}" fill="${CH5.chalk}" text-anchor="middle">d = ${d} × 10⁶ m</text>`;
    svg.innerHTML = s;
    if (readout) {
      readout.innerHTML = `<div><em>F</em> = <em>G</em> × ${ch5Frac("<em>m</em><sub>A</sub> × <em>m</em><sub>B</sub>", "<em>d</em>²")}</div>`
        + `<div><em>F</em> = 6,67 × 10⁻¹¹ × ${ch5Frac(`${mA} × 10²⁴ × ${mB} × 10²⁴`, `(${d} × 10⁶)²`)}</div>`
        + `<div><em>F</em> ≈ <strong style="color:#e8c468">${ch5Sci(F)} N</strong></div>`
        + `<div style="font-size:0.82em;margin-top:10px;">${mA !== mB ? "Masses différentes, mais les deux forces ont la même valeur." : "Les deux forces ont la même valeur."} Longueur des flèches non proportionnelle.</div>`;
    }
  }
  ch5Listen(mAR, "input", draw);
  ch5Listen(mBR, "input", draw);
  ch5Listen(dR, "input", draw);
  draw();
}

/* ---------- 3. Poids selon l'astre ---------- */
function initWeightCalculator(cfg) {
  const svg = ch5El(cfg.svgId);
  const mR = ch5El(cfg.mRangeId);
  const readout = ch5El(cfg.readoutId);
  const bT = ch5El(cfg.btnTerreId), bM = ch5El(cfg.btnMarsId), bL = ch5El(cfg.btnLuneId);
  if (!svg || !mR) return;
  ch5Range(mR, 1, 100, 1);
  const pfx = cfg.svgId;
  const A = {
    terre: { g: 9.8, label: "Terre", name: "la Terre", fill: "rgba(107,191,171,0.28)", stroke: CH5.teal, cx: 40 },
    mars: { g: 3.7, label: "Mars", name: "Mars", fill: "rgba(217,122,99,0.28)", stroke: CH5.coral, cx: 120 },
    lune: { g: 1.6, label: "Lune", name: "la Lune", fill: "rgba(201,194,176,0.24)", stroke: CH5.dim, cx: 200 }
  };
  let astre = cfg.astre || "terre";
  const fmtP = (P) => (P < 100 ? ch5Fr(P, 1) : ch5Fr(P, 0));

  function draw() {
    const m = Number(mR.value);
    let s = ch5Defs(pfx);
    Object.keys(A).forEach((k) => {
      const a = A[k], cx = a.cx, P = m * a.g, L = P / 980 * 92, on = k === astre;
      s += `<g opacity="${on ? 1 : 0.4}">`;
      s += `<text x="${cx}" y="15" font-size="14" font-family="${CH5.hand}" font-weight="700" fill="${on ? CH5.yellow : CH5.chalk}" text-anchor="middle">${a.label}</text>`;
      s += `<text x="${cx}" y="27" font-size="8.5" font-family="${CH5.font}" fill="${CH5.dim}" text-anchor="middle">g = ${ch5Fr(a.g, 1)} N·kg⁻¹</text>`;
      s += `<path d="M${cx - 36},64 Q${cx},56 ${cx + 36},64 L${cx + 36},74 L${cx - 36},74 Z" fill="${a.fill}" stroke="${a.stroke}" stroke-width="1.3"/>`;
      s += `<rect x="${cx - 12}" y="36" width="24" height="24" rx="2" fill="${CH5.board2}" stroke="${CH5.chalk}" stroke-width="1.5"/>`;
      s += ch5Arrow(cx, 48, cx, 48 + L, CH5.coral, pfx + "_c", 2.8);
      s += `<circle cx="${cx}" cy="48" r="2" fill="${CH5.chalk}"/>`;
      if (L > 22) s += ch5VecSym(cx + 6, 48 + L / 2 + 10, "P", "", CH5.coral, 11);
      s += `<text x="${cx}" y="${Math.max(84, 48 + L + 14)}" font-size="10" font-family="${CH5.font}" font-weight="600" fill="${CH5.chalk}" text-anchor="middle">${fmtP(P)} N</text>`;
      s += `</g>`;
    });
    svg.innerHTML = s;
    ch5Toggle([[bT, "terre"], [bM, "mars"], [bL, "lune"]], (k) => k === astre);
    if (readout) {
      const a = A[astre], P = m * a.g;
      readout.innerHTML = `<div>Sur ${a.name} (<em>g</em> = ${ch5Fr(a.g, 1)} N·kg⁻¹) :</div>`
        + `<div><em>P</em> = <em>m</em> × <em>g</em> = ${m} × ${ch5Fr(a.g, 1)} = <strong style="color:#e8c468">${fmtP(P)} N</strong></div>`
        + `<div style="font-size:0.85em;margin-top:12px;">La masse vaut ${m} kg sur les trois astres ; seul le poids change. Même échelle pour les trois flèches.</div>`;
    }
  }
  ch5Listen(mR, "input", draw);
  ch5Listen(bT, "click", () => { astre = "terre"; draw(); });
  ch5Listen(bM, "click", () => { astre = "mars"; draw(); });
  ch5Listen(bL, "click", () => { astre = "lune"; draw(); });
  draw();
}

/* ---------- 4. Force exercée par un fil ou par un support ---------- */
function initContactForce(cfg) {
  const svg = ch5El(cfg.svgId);
  if (!svg) return;
  const readout = ch5El(cfg.readoutId);
  const bF = ch5El(cfg.btnFilId), bS = ch5El(cfg.btnSupportId), bI = ch5El(cfg.btnInclineId);
  const bO = ch5El(cfg.btnOptionId);
  const pfx = cfg.svgId;
  let mode = cfg.mode || "fil", swing = false, friction = true;
  const LP = 36;
  const hide = !!cfg.hideForces;

  function drawFil(t) {
    const TH0 = 28 * Math.PI / 180, PER = 2.2;
    const th = swing ? TH0 * Math.cos(2 * Math.PI * t / PER) : 0;
    const pv = [120, 16], Lf = 74, r = 9;
    const cx = pv[0] + Lf * Math.sin(th), cy = pv[1] + Lf * Math.cos(th);
    const ax = cx - r * Math.sin(th), ay = cy - r * Math.cos(th);
    let s = ch5Defs(pfx);
    s += `<line x1="80" y1="${pv[1]}" x2="160" y2="${pv[1]}" stroke="${CH5.dim}" stroke-width="2"/>`;
    for (let x = 82; x <= 158; x += 8) s += `<line x1="${x}" y1="${pv[1]}" x2="${x + 6}" y2="${pv[1] - 7}" stroke="${CH5.line}" stroke-width="1.2"/>`;
    if (swing) s += `<line x1="${pv[0]}" y1="${pv[1]}" x2="${pv[0]}" y2="${pv[1] + Lf + 18}" stroke="${CH5.line}" stroke-width="1" stroke-dasharray="2,3"/>`;
    s += `<line x1="${pv[0]}" y1="${pv[1]}" x2="${ax}" y2="${ay}" stroke="${CH5.dim}" stroke-width="1.4"/>`;
    s += `<text x="${pv[0] - 8 + 30 * Math.sin(th)}" y="${pv[1] + 30}" font-size="12" font-family="${CH5.hand}" fill="${CH5.dim}" text-anchor="end">fil</text>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${CH5.board2}" stroke="${CH5.chalk}" stroke-width="1.8"/>`;
    if (!hide) {
      const Lt = LP * (swing ? 3 * Math.cos(th) - 2 * Math.cos(TH0) : 1);
      const ux = (pv[0] - ax) / Math.hypot(pv[0] - ax, pv[1] - ay), uy = (pv[1] - ay) / Math.hypot(pv[0] - ax, pv[1] - ay);
      s += ch5Arrow(ax, ay, ax + ux * Lt, ay + uy * Lt, CH5.yellow, pfx + "_y", 2.8);
      s += ch5Arrow(cx, cy, cx, cy + LP, CH5.coral, pfx + "_c", 2.8);
      s += ch5VecSym(ax + ux * Lt * 0.6 + 8, ay + uy * Lt * 0.6 + 4, "F", "fil/système", CH5.yellow, 11);
      s += ch5VecSym(cx + 7, cy + LP - 4, "P", "", CH5.coral, 11);
      s += `<circle cx="${ax}" cy="${ay}" r="2" fill="${CH5.chalk}"/><circle cx="${cx}" cy="${cy}" r="2" fill="${CH5.chalk}"/>`;
    }
    svg.innerHTML = s;
  }

  function drawSupport() {
    const yT = 104;
    let s = ch5Defs(pfx);
    s += `<rect x="50" y="${yT}" width="140" height="7" rx="1.5" fill="rgba(242,237,225,0.16)" stroke="${CH5.dim}" stroke-width="1.2"/>`;
    s += `<line x1="62" y1="${yT + 7}" x2="62" y2="146" stroke="${CH5.dim}" stroke-width="3"/><line x1="178" y1="${yT + 7}" x2="178" y2="146" stroke="${CH5.dim}" stroke-width="3"/>`;
    s += `<text x="46" y="${yT + 6}" font-size="12" font-family="${CH5.hand}" fill="${CH5.dim}" text-anchor="end">support</text>`;
    s += `<rect x="103" y="${yT - 26}" width="34" height="26" rx="2" fill="${CH5.board2}" stroke="${CH5.chalk}" stroke-width="1.6"/>`;
    if (!hide) {
      s += ch5Arrow(120, yT - 13, 120, yT - 13 + LP, CH5.coral, pfx + "_c", 2.8);
      s += ch5Arrow(120, yT, 120, yT - LP, CH5.yellow, pfx + "_y", 2.8);
      s += ch5VecSym(127, yT - 30, "F", "support/système", CH5.yellow, 11);
      s += ch5VecSym(126, yT - 13 + LP - 2, "P", "", CH5.coral, 11);
      s += `<circle cx="120" cy="${yT - 13}" r="2" fill="${CH5.chalk}"/><circle cx="120" cy="${yT}" r="2.2" fill="${CH5.chalk}"/>`;
    }
    svg.innerHTML = s;
  }

  const AL = 25 * Math.PI / 180, B0 = [28, 138], SL = 200;
  const u = [Math.cos(AL), -Math.sin(AL)], n = [-Math.sin(AL), -Math.cos(AL)];
  function drawIncline(t) {
    let sPos = 112;
    if (!friction) {
      const S0 = 150, K = 46, tEnd = Math.sqrt(2 * (S0 - 24) / K), T = tEnd + 0.9;
      const tt = t % T;
      sPos = tt < tEnd ? S0 - 0.5 * K * tt * tt : 24;
    }
    const C = [B0[0] + u[0] * sPos, B0[1] + u[1] * sPos];
    const P = (a, b) => [C[0] + u[0] * a + n[0] * b, C[1] + u[1] * a + n[1] * b];
    const top = [B0[0] + u[0] * SL, B0[1] + u[1] * SL];
    let s = ch5Defs(pfx);
    s += `<path d="M${B0[0]},${B0[1]} L${top[0]},${top[1]} L${top[0]},${B0[1]} Z" fill="rgba(242,237,225,0.07)" stroke="${CH5.dim}" stroke-width="1.3"/>`;
    s += `<text x="${top[0] - 4}" y="${B0[1] - 8}" font-size="12" font-family="${CH5.hand}" fill="${CH5.dim}" text-anchor="end">support incliné</text>`;
    const q = [P(-15, 0), P(15, 0), P(15, 20), P(-15, 20)];
    s += `<path d="M${q.map((p) => p.join(",")).join(" L")} Z" fill="${CH5.board2}" stroke="${CH5.chalk}" stroke-width="1.6"/>`;
    const G = P(0, 10);
    if (!hide) {
      const a1 = P(0, -10), a2 = P(0, 58);
      s += `<line x1="${a1[0]}" y1="${a1[1]}" x2="${a2[0]}" y2="${a2[1]}" stroke="${CH5.line}" stroke-width="1.2" stroke-dasharray="3,3"/>`;
      const nl = P(0, 44);
      s += `<text x="${nl[0] - 4}" y="${nl[1]}" font-size="8" font-family="${CH5.font}" fill="${CH5.dim}" text-anchor="end">normale au support</text>`;
      s += ch5Arrow(G[0], G[1], G[0], G[1] + LP, CH5.coral, pfx + "_c", 2.8);
      const R = friction ? [0, -LP] : [n[0] * LP * Math.cos(AL), n[1] * LP * Math.cos(AL)];
      s += ch5Arrow(C[0], C[1], C[0] + R[0], C[1] + R[1], CH5.yellow, pfx + "_y", 2.8);
      s += friction
        ? ch5VecSym(C[0] + R[0] - 14, C[1] + R[1] - 6, "F", "support/système", CH5.yellow, 11)
        : ch5VecSym(C[0] + R[0] + 8, C[1] + R[1] - 8, "F", "support/système", CH5.yellow, 11);
      s += ch5VecSym(G[0] + 7, G[1] + LP - 3, "P", "", CH5.coral, 11);
      s += `<circle cx="${G[0]}" cy="${G[1]}" r="2" fill="${CH5.chalk}"/><circle cx="${C[0]}" cy="${C[1]}" r="2.2" fill="${CH5.chalk}"/>`;
    }
    svg.innerHTML = s;
  }

  const Fs = (sub) => ch5VecHtml("F", sub);
  const TEXTS = {
    fil: () => `La force du fil est dirigée <strong style="color:#f2ede1">le long du fil</strong>, <strong style="color:#f2ede1">du système vers le fil</strong>.`
      + (swing ? `<div style="margin-top:12px;">Pendant l'oscillation, ${Fs("fil/système")} reste dirigée selon le fil ; sa valeur varie.</div>`
        : `<div style="margin-top:12px;">Système immobile : ${Fs("fil/système")} = −${ch5VecHtml("P")}.</div>`),
    support: () => `Système immobile, soumis seulement à son poids et à l'action du support : <strong style="color:#e8c468">${Fs("support/système")} = −${ch5VecHtml("P")}</strong>.`
      + `<div style="margin-top:12px;">Sans frottement, cette force est perpendiculaire au support.</div>`,
    incline: () => friction
      ? `<span style="color:#d97a63">Avec frottements</span>, le système reste immobile : ${Fs("support/système")} = −${ch5VecHtml("P")}.<div style="margin-top:12px;">Cette force est verticale : elle n'est <strong style="color:#f2ede1">plus perpendiculaire</strong> au support.</div>`
      : `<span style="color:#d97a63">Sans frottement</span>, l'action du support est <strong style="color:#f2ede1">perpendiculaire</strong> au support.<div style="margin-top:12px;">Elle ne compense plus le poids : le système glisse.</div>`
  };

  function run() {
    ch5Toggle([[bF, "fil"], [bS, "support"], [bI, "incline"]], (k) => k === mode);
    if (bO) {
      bO.style.visibility = mode === "support" ? "hidden" : "visible";
      if (mode === "fil") { bO.textContent = swing ? "■ Arrêter l'oscillation" : "▶ Faire osciller"; ch5Toggle([[bO, 1]], () => swing); }
      if (mode === "incline") { bO.textContent = friction ? "Frottements : oui" : "Frottements : non"; ch5Toggle([[bO, 1]], () => friction); }
    }
    if (readout) readout.innerHTML = TEXTS[mode]();
    const t0 = performance.now();
    if (mode === "fil" && swing) ch5Loop(svg, (now) => drawFil((now - t0) / 1000));
    else if (mode === "incline" && !friction && !hide) ch5Loop(svg, (now) => drawIncline((now - t0) / 1000));
    else {
      ch5Stop(svg);
      if (mode === "fil") drawFil(0); else if (mode === "support") drawSupport(); else drawIncline(0);
    }
  }
  ch5Listen(bF, "click", () => { mode = "fil"; run(); });
  ch5Listen(bS, "click", () => { mode = "support"; run(); });
  ch5Listen(bI, "click", () => { mode = "incline"; run(); });
  ch5Listen(bO, "click", () => { if (mode === "fil") swing = !swing; else if (mode === "incline") friction = !friction; run(); });
  run();
}

/* ---------- 0. Partie 1 : schéma du parachutiste modélisé par un point ---------- */
function ch5DrawParachute(svgId) {
  const svg = ch5El(svgId);
  if (!svg) return;
  const pfx = svgId, x = 60, y = 66;
  let s = ch5Defs(pfx);
  s += ch5Arrow(x, y, x, 28, CH5.yellow, pfx + "_y", 2.6);
  s += ch5Arrow(x, y, x, 108, CH5.coral, pfx + "_c", 2.6);
  s += `<path d="M${x - 5},${y - 5} L${x + 5},${y + 5} M${x + 5},${y - 5} L${x - 5},${y + 5}" stroke="${CH5.chalk}" stroke-width="1.8"/>`;
  s += `<text x="${x - 10}" y="${y + 4}" font-size="12" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="end">M</text>`;
  s += ch5VecSym(x + 6, 40, "F", "air/parachutiste", CH5.yellow, 10);
  s += ch5VecSym(x + 6, 104, "P", "", CH5.coral, 10);
  svg.innerHTML = s;
}

/* ---------- 0 bis. Construire le vecteur représentant une force ---------- */
function initForceVector(cfg) {
  const svg = ch5El(cfg.svgId);
  if (!svg) return;
  const readout = ch5El(cfg.readoutId);
  const b1 = ch5El(cfg.btnStep1Id), b2 = ch5El(cfg.btnStep2Id), b3 = ch5El(cfg.btnStep3Id);
  const bF = ch5El(cfg.btnFlipId), fR = ch5El(cfg.fRangeId);
  if (fR) ch5Range(fR, 100, 800, 50);
  const pfx = cfg.svgId, UNIT = 12; /* 1 graduation = 100 N */
  let step = 0, flip = false;
  const M = [120, 74], a = -20 * Math.PI / 180, u0 = [Math.cos(a), Math.sin(a)];

  function draw() {
    const F = fR ? Number(fR.value) : 400, sg = flip ? -1 : 1, u = [u0[0] * sg, u0[1] * sg];
    let s = ch5Defs(pfx);
    if (step >= 1) {
      s += `<line x1="${M[0] - u0[0] * 112}" y1="${M[1] - u0[1] * 112}" x2="${M[0] + u0[0] * 112}" y2="${M[1] + u0[1] * 112}" stroke="${CH5.dim}" stroke-width="1.3" stroke-dasharray="4,3"/>`;
      s += `<text x="${M[0] + u0[0] * 112}" y="${M[1] + u0[1] * 112 - 6}" font-size="9" font-family="${CH5.font}" fill="${CH5.dim}" text-anchor="end">droite d'action</text>`;
    }
    if (step === 2) {
      s += ch5Arrow(M[0], M[1], M[0] + u[0] * 34, M[1] + u[1] * 34, CH5.yellow, pfx + "_y", 2.6);
      s += `<text x="${M[0] + u[0] * 40}" y="${M[1] + u[1] * 40 + 16}" font-size="11" font-family="${CH5.hand}" fill="${CH5.yellow}" text-anchor="middle">sens</text>`;
    }
    if (step >= 3) {
      const L = F / 100 * UNIT, E = [M[0] + u[0] * L, M[1] + u[1] * L];
      for (let k = 1; k * UNIT < L - 0.5; k++) {
        const px = M[0] + u[0] * k * UNIT, py = M[1] + u[1] * k * UNIT;
        s += `<line x1="${px - u[1] * 3.5}" y1="${py + u[0] * 3.5}" x2="${px + u[1] * 3.5}" y2="${py - u[0] * 3.5}" stroke="${CH5.chalk}" stroke-width="1"/>`;
      }
      s += ch5Arrow(M[0], M[1], E[0], E[1], CH5.yellow, pfx + "_y", 2.8);
      s += ch5VecSym(E[0] + (flip ? -8 : 2), E[1] + (flip ? 20 : -8), "F", "", CH5.yellow, 12);
    }
    s += `<path d="M${M[0] - 4.5},${M[1] - 4.5} L${M[0] + 4.5},${M[1] + 4.5} M${M[0] + 4.5},${M[1] - 4.5} L${M[0] - 4.5},${M[1] + 4.5}" stroke="${CH5.chalk}" stroke-width="1.8"/>`;
    s += `<text x="${M[0] + (flip ? 8 : -8)}" y="${M[1] + 16}" font-size="12" font-family="${CH5.hand}" fill="${CH5.chalk}" text-anchor="middle">M</text>`;
    s += `<line x1="14" y1="136" x2="${14 + UNIT}" y2="136" stroke="${CH5.chalk}" stroke-width="2"/><line x1="14" y1="132" x2="14" y2="140" stroke="${CH5.chalk}" stroke-width="1"/><line x1="${14 + UNIT}" y1="132" x2="${14 + UNIT}" y2="140" stroke="${CH5.chalk}" stroke-width="1"/>`;
    s += `<text x="${20 + UNIT}" y="139.5" font-size="9" font-family="${CH5.font}" fill="${CH5.dim}">échelle : 1 graduation ↔ 100 N</text>`;
    svg.innerHTML = s;

    ch5Toggle([[b1, 1], [b2, 2], [b3, 3]], (k) => k <= step);
    if (bF) ch5Toggle([[bF, 1]], () => flip);
    if (readout) {
      const row = (lab, val, on) => `<div style="display:flex;flex-wrap:wrap;column-gap:16px;opacity:${on ? 1 : 0.35};"><span style="font-family:Kalam,cursive;color:#6bbfab;min-width:9em;">${lab}</span><span>${on ? val : "…"}</span></div>`;
      readout.innerHTML = row("point d'application", "le point M", true)
        + row("direction", "la droite d'action (pointillés)", step >= 1)
        + row("sens", flip ? "vers le bas, à gauche" : "vers le haut, à droite", step >= 2)
        + row("norme", `${F} N → ${ch5Fr(F / 100, F % 100 ? 1 : 0)} graduation${F / 100 >= 2 ? "s" : ""}`, step >= 3);
    }
  }
  ch5Listen(b1, "click", () => { step = 1; draw(); });
  ch5Listen(b2, "click", () => { step = 2; draw(); });
  ch5Listen(b3, "click", () => { step = 3; draw(); });
  ch5Listen(bF, "click", () => { flip = !flip; if (step < 2) step = 2; draw(); });
  ch5Listen(fR, "input", () => { step = 3; draw(); });
  draw();
}

/* ---------- 0 ter. Scènes dessinées (remplacent les photos du manuel) ---------- */
function ch5DrawSkydiver(svgId) {
  const svg = ch5El(svgId);
  if (!svg) return;
  const C = CH5;
  let s = "";
  s += `<path d="M-20,150 Q120,122 260,150 L260,180 L-20,180 Z" fill="rgba(107,191,171,0.16)" stroke="${C.teal}" stroke-width="1.4"/>`;
  s += `<text x="210" y="160" font-size="13" font-family="${C.hand}" fill="${C.teal}" text-anchor="middle">Terre</text>`;
  [[26, 34], [182, 26], [200, 100], [30, 110], [150, 118], [70, 18]].forEach(([x, y]) => {
    s += `<path d="M${x},${y} q6,-4 12,0 t12,0" fill="none" stroke="${C.line}" stroke-width="1.4"/>`;
  });
  s += `<text x="30" y="96" font-size="12" font-family="${C.hand}" fill="${C.dim}">air</text>`;
  const ln = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.chalk}" stroke-width="${w}" stroke-linecap="round"/>`;
  s += `<rect x="112" y="56" width="20" height="9" rx="3" fill="${C.coral}"/>`;
  s += ln(104, 66, 140, 70, 8);
  s += ln(106, 64, 96, 46, 3.2) + ln(96, 46, 84, 40, 3.2);
  s += ln(108, 70, 100, 88, 3.2) + ln(100, 88, 88, 94, 3.2);
  s += ln(138, 68, 156, 58, 3.4) + ln(156, 58, 170, 64, 3.4);
  s += ln(139, 72, 158, 80, 3.4) + ln(158, 80, 172, 74, 3.4);
  s += `<circle cx="95" cy="64" r="6.5" fill="${C.board2}" stroke="${C.chalk}" stroke-width="2"/>`;
  s += `<text x="122" y="52" font-size="8" font-family="${C.font}" fill="${C.coral}" text-anchor="middle">équipement</text>`;
  svg.innerHTML = s;
}

function ch5DrawBikes(svgId) {
  const svg = ch5El(svgId);
  if (!svg) return;
  const C = CH5;
  const ln = (x1, y1, x2, y2, col, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  function bike(xr, xf, y, r, col) {
    const xm = xr + (xf - xr) * 0.45, top = y - r * 1.7;
    let s = `<circle cx="${xr}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="1.8"/><circle cx="${xf}" cy="${y}" r="${r}" fill="none" stroke="${col}" stroke-width="1.8"/>`;
    s += ln(xr, y, xm, y, col, 2) + ln(xm, y, xr + r * 0.5, top, col, 2) + ln(xr, y, xr + r * 0.5, top, col, 2);
    s += ln(xr + r * 0.5, top, xf - r * 0.4, top, col, 2) + ln(xm, y, xf - r * 0.4, top, col, 2) + ln(xf, y, xf - r * 0.5, top - r * 0.4, col, 2);
    s += ln(xr + r * 0.2, top - r * 0.35, xr + r * 0.9, top - r * 0.35, col, 3);
    s += ln(xf - r * 0.5, top - r * 0.4, xf - r * 0.1, top - r * 0.5, col, 2.4);
    return { s, rear: [xr + r * 0.5, top], front: [xf - r * 0.4, top] };
  }
  const kid = bike(26, 78, 104, 12, C.dim), adult = bike(128, 204, 100, 17, C.chalk);
  let s = `<line x1="0" y1="117" x2="240" y2="117" stroke="${C.line}" stroke-width="1.4"/>`;
  s += kid.s + adult.s;
  s += ln(adult.rear[0] - 4, adult.rear[1] + 8, kid.front[0], kid.front[1], C.teal, 3.4);
  s += `<circle cx="${adult.rear[0] - 4}" cy="${adult.rear[1] + 8}" r="2.6" fill="${C.teal}"/><circle cx="${kid.front[0]}" cy="${kid.front[1]}" r="2.6" fill="${C.teal}"/>`;
  s += `<text x="104" y="58" font-size="10" font-family="${C.hand}" fill="${C.teal}" text-anchor="middle">barre d'attache</text>`;
  s += `<text x="52" y="134" font-size="11" font-family="${C.hand}" fill="${C.dim}" text-anchor="middle">vélo de l'enfant</text>`;
  s += `<text x="166" y="134" font-size="11" font-family="${C.hand}" fill="${C.chalk}" text-anchor="middle">vélo de l'adulte</text>`;
  s += `<text x="236" y="22" font-size="9" font-family="${C.font}" fill="${C.dim}" text-anchor="end">sens du mouvement →</text>`;
  svg.innerHTML = s;
}
