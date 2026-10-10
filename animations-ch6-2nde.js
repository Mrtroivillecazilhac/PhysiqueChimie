/* Animations du chapitre 6 — 2nde — « Principe d'inertie ».
   Réécriture de uploads/animations-ch6-2nde.js : mêmes noms de fonctions et mêmes clés
   de configuration que la version du site, animations en mouvement (chronophotographies),
   plus des options pour les diapos (mode initial, forces masquées).
   Nouvelle animation : initForceBalance (deux forces se compensent-elles ?). */

var CH6 = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.14)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};

function ch6N(v) { return Math.round(v * 100) / 100; }
function ch6Fr(x, d) { return Number(x).toFixed(d).replace(".", ","); }
function ch6El(id) { return id ? document.getElementById(id) : null; }

function ch6Listen(el, type, fn) {
  if (!el) return;
  el.__ch6H = el.__ch6H || {};
  if (el.__ch6H[type]) el.removeEventListener(type, el.__ch6H[type]);
  el.__ch6H[type] = fn;
  el.addEventListener(type, fn);
}

function ch6Range(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  const v = Number(el.value);
  if (el.value === "" || !isFinite(v)) el.value = String(min);
  else if (v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}

/* Flèche à pointe pleine (pas de marker : rendu identique partout). */
function ch6Arrow(x1, y1, x2, y2, color, w, dash) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 1.5) return "";
  w = w || 2.4;
  const ux = dx / L, uy = dy / L, h = Math.min(L, 2.4 * w + 2), hw = h * 0.5;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<line x1="${ch6N(x1)}" y1="${ch6N(y1)}" x2="${ch6N(bx)}" y2="${ch6N(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"${dash ? ' stroke-dasharray="3.5,2.5"' : ""}/>`
    + `<path d="M${ch6N(x2)},${ch6N(y2)} L${ch6N(bx - uy * hw)},${ch6N(by + ux * hw)} L${ch6N(bx + uy * hw)},${ch6N(by - ux * hw)} Z" fill="${color}"/>`;
}

/* Symbole vectoriel SVG : lettre + indice, flèche au-dessus de la lettre. */
function ch6VecSym(x, y, main, sub, color, size, anchorEnd) {
  const wMain = size * 0.5;
  const subW = sub ? sub.length * size * 0.62 * 0.52 : 0;
  if (anchorEnd) x -= wMain + subW + size * 0.1;
  const top = y - size * 0.95;
  let s = `<text x="${ch6N(x)}" y="${ch6N(y)}" font-size="${size}" fill="${color}" font-family="${CH6.font}" font-style="italic" font-weight="600">${main}`;
  if (sub) s += `<tspan font-size="${size * 0.62}" dy="${size * 0.28}" font-style="normal" font-weight="500">${sub}</tspan>`;
  s += `</text>`;
  s += `<line x1="${ch6N(x + size * 0.04)}" y1="${ch6N(top)}" x2="${ch6N(x + wMain)}" y2="${ch6N(top)}" stroke="${color}" stroke-width="${size * 0.08}"/>`;
  s += `<path d="M${ch6N(x + wMain)},${ch6N(top - size * 0.15)} L${ch6N(x + wMain + size * 0.26)},${ch6N(top)} L${ch6N(x + wMain)},${ch6N(top + size * 0.15)} Z" fill="${color}"/>`;
  return s;
}

function ch6Text(x, y, txt, color, size, anchor, hand) {
  return `<text x="${ch6N(x)}" y="${ch6N(y)}" font-size="${size}" fill="${color}" font-family="${hand ? CH6.hand : CH6.font}" text-anchor="${anchor || "start"}">${txt}</text>`;
}

/* HTML (readouts) */
function ch6Vec(sym, sub) {
  return `<span style="white-space:nowrap"><span class="vec"><em>${sym}</em></span>${sub ? `<sub>${sub}</sub>` : ""}</span>`;
}
function ch6Row(ok, t) {
  return `<div style="display:flex;gap:12px;align-items:baseline;"><span style="color:${ok ? CH6.teal : CH6.coral};flex:none;">${ok ? "✓" : "✗"}</span><span>${t}</span></div>`;
}
function ch6Line(t) { return `<div>${t}</div>`; }
function ch6Strong(t) { return `<strong style="color:${CH6.yellow}">${t}</strong>`; }

/* Boutons bascule : style du site via .active-hist, style inline pour les diapos. */
function ch6Toggle(pairs, isOn) {
  pairs.forEach(([b, k]) => {
    if (!b) return;
    const on = isOn(k);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? CH6.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? CH6.yellow : CH6.dim;
  });
}

function ch6Stop(svg) { if (svg && svg.__ch6Loop) svg.__ch6Loop.stop = true; }

/* Boucle rAF continue liée au SVG (t en secondes depuis le départ).
   S'arrête quand le SVG quitte le document ; ne dessine pas quand il est masqué. */
function ch6Loop(svg, fn) {
  ch6Stop(svg);
  const L = { stop: false }, t0 = performance.now();
  svg.__ch6Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    const r = svg.getBoundingClientRect();
    if (r.width > 0) fn((now - t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- 1. Effet d'une force sur le mouvement (frappe de tennis) ---------- */
function initForceEffect(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const bB = ch6El(cfg.btnBeforeId), bA = ch6El(cfg.btnAfterId);
  let mode = cfg.mode || "before"; /* before | after | full */

  const Y = 96, I = { x: 66, y: Y }, u = { x: 0.906, y: -0.423 };
  const DT = 0.28, tIn = 5 * DT, tOut = 4 * DT, HOLD = 1.3;
  const vIn = 28 / DT, vOut = 40 / DT;
  const dotsIn = [0, 1, 2, 3, 4, 5].map((k) => ({ x: 206 - 28 * k, y: Y, t: k * DT }));
  const dotsOut = [0, 1, 2, 3, 4].map((k) => ({ x: I.x + 40 * k * u.x, y: I.y + 40 * k * u.y, t: tIn + k * DT }));
  const dF = { x: 0.967, y: -0.255 };

  function pos(tau) {
    if (tau <= tIn) return { x: 206 - vIn * tau, y: Y };
    const d = vOut * Math.min(tau - tIn, tOut);
    return { x: I.x + d * u.x, y: I.y + d * u.y };
  }

  function racket() {
    let s = `<g transform="rotate(-14 50 96)">`;
    s += `<line x1="50" y1="118" x2="50" y2="150" stroke="${CH6.dim}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<ellipse cx="50" cy="96" rx="8" ry="22" fill="rgba(242,237,225,0.06)" stroke="${CH6.chalk}" stroke-width="2"/>`;
    for (let i = -14; i <= 14; i += 7) s += `<line x1="43" y1="${96 + i}" x2="57" y2="${96 + i}" stroke="${CH6.faint}" stroke-width="0.8"/>`;
    s += `<line x1="50" y1="76" x2="50" y2="116" stroke="${CH6.faint}" stroke-width="0.8"/>`;
    s += `</g>`;
    s += ch6Text(6, 146, "raquette", CH6.dim, 12, "start", true);
    return s;
  }

  function dot(p, alpha) {
    return `<circle cx="${ch6N(p.x)}" cy="${ch6N(p.y)}" r="2.2" fill="${CH6.chalk}" opacity="${alpha}"/>`;
  }

  function frame(t) {
    let start, end;
    if (mode === "before") { start = 0; end = tIn; }
    else if (mode === "after") { start = tIn; end = tIn + tOut; }
    else { start = 0; end = tIn + tOut; }
    const span = end - start, T = span + HOLD;
    const tau = start + Math.min(t % T, span);
    let s = racket();
    s += ch6Text(232, 140, "positions à intervalles de temps égaux", CH6.dim, 8, "end");
    dotsIn.forEach((p) => {
      if (mode === "after") s += dot(p, 0.3);
      else if (p.t <= tau + 1e-6) s += dot(p, 1);
    });
    dotsOut.forEach((p, k) => {
      if (k === 0) return;
      if (mode !== "before" && p.t <= tau + 1e-6) s += dot(p, 1);
    });
    if (!cfg.hideForces) {
      if (mode === "before" && tau >= dotsIn[2].t) {
        s += ch6Arrow(dotsIn[2].x, Y, dotsIn[2].x - 26, Y, CH6.yellow, 2.6);
        s += ch6VecSym(dotsIn[2].x - 18, Y - 10, "v", "", CH6.yellow, 13);
      }
      if (mode === "after") {
        if (tau >= dotsOut[1].t) {
          const p = dotsOut[1];
          s += ch6Arrow(p.x, p.y, p.x + 37 * u.x, p.y + 37 * u.y, CH6.yellow, 2.6);
          s += ch6VecSym(p.x + 14, p.y - 18, "v", "'", CH6.yellow, 13);
        }
        const fa = tau - tIn < 0.35 ? 1 : 0.55;
        s += `<g opacity="${fa}">` + ch6Arrow(I.x, I.y, I.x + 30 * dF.x, I.y + 30 * dF.y, CH6.teal, 2.6);
        s += ch6VecSym(I.x + 2, I.y + 22, "F", "raquette/balle", CH6.teal, 11) + `</g>`;
      }
    }
    const b = pos(tau);
    s += `<circle cx="${ch6N(b.x)}" cy="${ch6N(b.y)}" r="5.2" fill="#c9e265" stroke="${CH6.board}" stroke-width="0.8"/>`;
    s += `<path d="M${ch6N(b.x - 4)},${ch6N(b.y - 2.6)} Q${ch6N(b.x)},${ch6N(b.y)} ${ch6N(b.x - 4)},${ch6N(b.y + 2.6)}" fill="none" stroke="${CH6.chalk}" stroke-width="0.8"/>`;
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    if (mode === "before") {
      readout.innerHTML = ch6Line(`<strong style="color:${CH6.chalk}">Avant la frappe</strong>`)
        + ch6Line(`La balle se déplace en ligne droite vers la raquette. Ses positions sont régulièrement espacées : la valeur de sa vitesse ne change pas.`);
    } else {
      readout.innerHTML = ch6Line(`<strong style="color:${CH6.chalk}">Après la frappe</strong>`)
        + ch6Row(true, `la <strong>direction</strong> du vecteur vitesse a changé`)
        + ch6Row(true, `sa <strong>valeur</strong> a changé : positions plus espacées, ${ch6Vec("v")}' plus long`)
        + ch6Line(`Cause : la force ${ch6Vec("F", "raquette/balle")} exercée pendant le contact.`);
    }
  }

  function show() {
    ch6Toggle([[bB, "before"], [bA, "after"]], (x) => x === mode);
    text();
    ch6Loop(svg, frame);
  }
  ch6Listen(bB, "click", () => { mode = "before"; show(); });
  ch6Listen(bA, "click", () => { mode = "after"; show(); });
  show();
}

/* ---------- 2. Deux forces se compensent-elles ? (nouvelle) ---------- */
function initForceBalance(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const vR = ch6El(cfg.valueRangeId), aR = ch6El(cfg.angleRangeId);
  const vOut = ch6El(cfg.valueOutId), aOut = ch6El(cfg.angleOutId);
  ch6Range(vR, 1, 5, 0.5); ch6Range(aR, -180, 180, 5);
  const F1 = 3, K = 16, O = { x: 120, y: 74 };

  function draw() {
    const F2 = vR ? Number(vR.value) : 3, a = (aR ? Number(aR.value) : 0) * Math.PI / 180;
    const d2 = { x: -Math.cos(a), y: -Math.sin(a) };
    const p1 = { x: O.x + F1 * K, y: O.y }, p2 = { x: O.x + F2 * K * d2.x, y: O.y + F2 * K * d2.y };
    const S = { x: F1 * K + F2 * K * d2.x, y: F2 * K * d2.y };
    const sameLine = Math.abs(Math.sin(a)) < 1e-6, opposite = sameLine && Math.cos(a) > 0;
    const sameVal = Math.abs(F2 - F1) < 1e-6, ok = sameLine && opposite && sameVal;
    let s = "";
    s += `<line x1="6" y1="${O.y}" x2="234" y2="${O.y}" stroke="${CH6.line}" stroke-width="1" stroke-dasharray="3,3"/>`;
    if (!sameLine) s += `<line x1="${ch6N(O.x - 110 * d2.x)}" y1="${ch6N(O.y - 110 * d2.y)}" x2="${ch6N(O.x + 110 * d2.x)}" y2="${ch6N(O.y + 110 * d2.y)}" stroke="${CH6.line}" stroke-width="1" stroke-dasharray="3,3"/>`;
    s += ch6Text(234, O.y - 5, "droite d'action", CH6.dim, 7.5, "end");
    for (let i = 1; i <= 5; i++) s += `<line x1="${O.x + i * K}" y1="${O.y + 3}" x2="${O.x + i * K}" y2="${O.y + 7}" stroke="${CH6.line}" stroke-width="1"/>`;
    s += ch6Arrow(O.x, O.y, p1.x, p1.y, CH6.teal, 2.8);
    s += ch6VecSym(p1.x - 8, O.y + 20, "F", "1", CH6.teal, 12);
    s += ch6Arrow(O.x, O.y, p2.x, p2.y, CH6.coral, 2.8);
    const lx = p2.x + (d2.x >= 0 ? 6 : -6), ly = p2.y + (d2.y > 0.2 ? 14 : -8);
    s += ch6VecSym(lx, ly, "F", "2", CH6.coral, 12, d2.x < 0);
    if (!ok) {
      s += ch6Arrow(O.x, O.y, O.x + S.x, O.y + S.y, CH6.chalk, 1.8, true);
      s += ch6Text(O.x + S.x * 0.5 + 4, O.y + S.y * 0.5 + (S.y > 0 ? 14 : 22), "somme", CH6.chalk, 9);
    }
    s += `<circle cx="${O.x}" cy="${O.y}" r="3.2" fill="${CH6.chalk}"/>`;
    s += ch6Text(O.x - 6, O.y + 16, "M", CH6.chalk, 12, "end", true);
    s += ch6Text(8, 146, "échelle : 1 graduation ↔ 1 N", CH6.dim, 8);
    if (ok) s += ch6Text(232, 146, "somme des forces = vecteur nul", CH6.teal, 10, "end", true);
    svg.innerHTML = s;
    if (vOut) vOut.textContent = ch6Fr(F2, 1) + " N";
    if (aOut) aOut.textContent = Math.round(a * 180 / Math.PI) + "°";
    if (readout) {
      readout.innerHTML = ch6Line(`${ch6Vec("F", "1")} : 3,0 N ; ${ch6Vec("F", "2")} : ${ch6Fr(F2, 1)} N`)
        + ch6Row(sameLine, "même droite d'action")
        + ch6Row(opposite, "sens opposés")
        + ch6Row(sameVal, "même valeur")
        + `<div style="margin-top:10px;">${ok ? `Les deux forces ${ch6Strong("se compensent")} : ${ch6Vec("F", "1")} + ${ch6Vec("F", "2")} = ${ch6Vec("0")}.` : `Les deux forces ${ch6Strong("ne se compensent pas")} : leur somme n'est pas nulle.`}</div>`;
    }
  }
  ch6Listen(vR, "input", draw);
  ch6Listen(aR, "input", draw);
  draw();
}

/* ---------- 3. Forces qui se compensent (principe d'inertie) ---------- */
function initCompensatingForces(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const bP = ch6El(cfg.btnPaletId), bB = ch6El(cfg.btnBowlingId);
  let mode = cfg.mode || "palet";
  const SURF = 88, X0 = 22, X1 = 212, DUR = 3.4, STRIP = 128;

  function frame(t) {
    const p = (t % (DUR + 0.6)) / DUR, x = X0 + (X1 - X0) * Math.min(1, p);
    let s = "";
    if (mode === "palet") {
      s += `<rect x="6" y="${SURF}" width="228" height="9" rx="2" fill="rgba(107,191,171,0.12)" stroke="${CH6.dim}" stroke-width="1.2"/>`;
      for (let i = 12; i < 232; i += 9) s += `<circle cx="${i}" cy="${SURF + 4.5}" r="0.9" fill="${CH6.dim}"/>`;
      s += ch6Text(8, 16, "table à coussin d'air", CH6.dim, 12, "start", true);
      s += `<rect x="${ch6N(x - 13)}" y="${SURF - 9}" width="26" height="7" fill="${CH6.board2}" stroke="${CH6.chalk}" stroke-width="1.4"/>`;
      s += `<ellipse cx="${ch6N(x)}" cy="${SURF - 9}" rx="13" ry="3.4" fill="${CH6.board2}" stroke="${CH6.chalk}" stroke-width="1.4"/>`;
    } else {
      s += `<rect x="6" y="${SURF}" width="228" height="9" fill="rgba(232,196,104,0.10)" stroke="${CH6.dim}" stroke-width="1.2"/>`;
      for (let i = 20; i < 232; i += 22) s += `<line x1="${i}" y1="${SURF}" x2="${i}" y2="${SURF + 9}" stroke="${CH6.faint}" stroke-width="1"/>`;
      s += ch6Text(8, 16, "piste de bowling", CH6.dim, 12, "start", true);
      const r = 12, cy = SURF - r, ang = (x - X0) / r;
      s += `<circle cx="${ch6N(x)}" cy="${cy}" r="${r}" fill="${CH6.board2}" stroke="${CH6.chalk}" stroke-width="1.5"/>`;
      [0, 0.5, -0.5].forEach((o, i) => {
        const aa = ang + o, rr = i ? 6.5 : 5;
        s += `<circle cx="${ch6N(x + rr * Math.cos(aa - 1.2))}" cy="${ch6N(cy + rr * Math.sin(aa - 1.2))}" r="1.5" fill="${CH6.dim}"/>`;
      });
    }
    const cy = mode === "palet" ? SURF - 6 : SURF - 12;
    if (!cfg.hideForces) {
      s += ch6Arrow(x, cy, x, cy + 30, CH6.coral, 2.6);
      s += ch6Arrow(x, cy, x, cy - 30, CH6.teal, 2.6);
      s += ch6VecSym(x + 6, cy + 30, "P", "", CH6.coral, 12);
      s += ch6VecSym(x + 6, cy - 22, "F", mode === "palet" ? "table/palet" : "sol/boule", CH6.teal, 11);
    }
    s += `<circle cx="${ch6N(x)}" cy="${cy}" r="1.8" fill="${CH6.chalk}"/>`;
    /* chronophotographie */
    for (let k = 0; k <= 6; k++) {
      const xk = X0 + k * 30;
      const seen = p >= (xk - X0) / (X1 - X0) - 1e-6;
      s += `<circle cx="${xk}" cy="${STRIP}" r="2.4" fill="${CH6.chalk}" opacity="${seen ? 1 : 0.25}"/>`;
      if (!cfg.hideForces && k < 6 && seen) s += ch6Arrow(xk, STRIP, xk + 20, STRIP, CH6.yellow, 2);
    }
    if (!cfg.hideForces) s += ch6VecSym(X0 + 4, STRIP - 7, "v", "", CH6.yellow, 11);
    s += ch6Text(234, 148, "positions à intervalles de temps égaux", CH6.dim, 8, "end");
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    const F = mode === "palet" ? ch6Vec("F", "table/palet") : ch6Vec("F", "sol/boule");
    readout.innerHTML = ch6Line(mode === "palet"
      ? `Le palet est soumis à son poids ${ch6Vec("P")} et à l'action de la table ${F} (coussin d'air, sans frottement).`
      : `La boule est soumise à son poids ${ch6Vec("P")} et à l'action du sol ${F} (frottements négligés).`)
      + ch6Row(true, `les forces se compensent : ${ch6Vec("P")} + ${F} = ${ch6Vec("0")}`)
      + ch6Row(true, `positions alignées et régulièrement espacées : ${ch6Vec("v")} ne varie pas`)
      + `<div style="margin-top:10px;">${ch6Strong("Mouvement rectiligne uniforme")}</div>`;
  }

  function show() {
    ch6Toggle([[bP, "palet"], [bB, "bowling"]], (x) => x === mode);
    text();
    ch6Loop(svg, frame);
  }
  ch6Listen(bP, "click", () => { mode = "palet"; show(); });
  ch6Listen(bB, "click", () => { mode = "bowling"; show(); });
  show();
}

/* ---------- 4. Forces qui ne se compensent pas (ballon sur le sable) ---------- */
function initNonCompensatingForces(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const bS = ch6El(cfg.btnSumId);
  let sumOn = !!cfg.showSum;
  const SAND = 104, R = 12, CY = SAND - R, STRIP = 140, STEPS = 6, DUR = 3.6, HOLD = 1.4;
  const xAt = (tk) => 20 + 1.5 * (36 * tk - 3 * tk * tk); /* tk en « intervalles » */

  function frame(t) {
    const tt = t % (DUR + HOLD), tk = Math.min(STEPS, tt / DUR * STEPS), x = xAt(tk), moving = tk < STEPS - 0.02;
    let s = `<path d="M0,${SAND} Q30,${SAND - 2} 60,${SAND} T120,${SAND} T180,${SAND} T240,${SAND} L240,${SAND + 12} L0,${SAND + 12} Z" fill="rgba(232,196,104,0.14)" stroke="${CH6.yellow}" stroke-opacity="0.5" stroke-width="1"/>`;
    s += ch6Text(234, SAND + 24, "sable", CH6.dim, 11, "end", true);
    const ang = (x - 20) / R;
    s += `<circle cx="${ch6N(x)}" cy="${CY}" r="${R}" fill="${CH6.board2}" stroke="${CH6.chalk}" stroke-width="1.5"/>`;
    [0, Math.PI / 3, 2 * Math.PI / 3].forEach((o, i) => {
      const c = [CH6.coral, CH6.teal, CH6.yellow][i], a = ang + o;
      s += `<line x1="${ch6N(x - R * Math.cos(a))}" y1="${ch6N(CY - R * Math.sin(a))}" x2="${ch6N(x + R * Math.cos(a))}" y2="${ch6N(CY + R * Math.sin(a))}" stroke="${c}" stroke-width="1.3" opacity="0.8"/>`;
    });
    if (!cfg.hideForces && moving) {
      s += ch6Arrow(x, CY, x, CY + 26, CH6.coral, 2.5);
      s += ch6Arrow(x, CY, x - 7, CY - 26, CH6.teal, 2.5);
      s += ch6Arrow(x, CY, x - 13, CY, CH6.dim, 2.5);
      s += ch6VecSym(x + 5, CY + 26, "P", "", CH6.coral, 11);
      s += ch6VecSym(x - 2, CY - 30, "F", "sable/ballon", CH6.teal, 10);
      s += ch6VecSym(x - 16, CY - 4, "F", "air/ballon", CH6.dim, 10, true);
      if (sumOn) {
        s += ch6Arrow(x, CY + 0.5, x - 20, CY + 0.5, CH6.chalk, 1.6, true);
        s += ch6Text(x - 22, CY + 12, "somme", CH6.chalk, 8, "end");
      }
    }
    s += `<circle cx="${ch6N(x)}" cy="${CY}" r="1.6" fill="${CH6.chalk}"/>`;
    for (let k = 0; k <= STEPS; k++) {
      const xk = xAt(k), seen = tk >= k - 1e-6;
      s += `<circle cx="${ch6N(xk)}" cy="${STRIP}" r="2.4" fill="${CH6.chalk}" opacity="${seen ? 1 : 0.25}"/>`;
      if (!cfg.hideForces && seen && k < STEPS) s += ch6Arrow(xk, STRIP, xk + 0.5 * 1.5 * (36 - 6 * k), STRIP, CH6.yellow, 2);
    }
    if (!cfg.hideForces) s += ch6VecSym(xAt(0) + 4, STRIP - 7, "v", "", CH6.yellow, 11);
    s += ch6Text(234, 156, "positions à intervalles de temps égaux", CH6.dim, 8, "end");
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    readout.innerHTML = ch6Line(`Le ballon roule sur le sable. Il est soumis à son poids ${ch6Vec("P")}, à l'action du sable ${ch6Vec("F", "sable/ballon")} et à l'action de l'air ${ch6Vec("F", "air/ballon")}.`)
      + ch6Row(false, `les forces ne se compensent pas : leur somme n'est pas nulle`)
      + ch6Row(false, `positions de plus en plus rapprochées : la valeur de ${ch6Vec("v")} diminue`)
      + `<div style="margin-top:10px;">${ch6Vec("v")} varie : le mouvement ${ch6Strong("n'est pas rectiligne uniforme")}.</div>`;
  }
  function show() {
    if (bS) {
      bS.textContent = sumOn ? "Masquer la somme des forces" : "Afficher la somme des forces";
      ch6Toggle([[bS, "s"]], () => sumOn);
    }
    text();
  }
  ch6Listen(bS, "click", () => { sumOn = !sumOn; show(); });
  show();
  ch6Loop(svg, frame);
}

/* ---------- 5. Chute libre ou non (tube de Newton) ---------- */
function initFreeFall(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const bF = ch6El(cfg.btnFreeId), bN = ch6El(cfg.btnNotFreeId);
  let mode = cfg.mode || "free";
  const DUR = 1.25, HOLD = 1.1, TOP = 26, H = 108;

  function feather(x, y, a) {
    return `<g opacity="${a}"><path d="M${ch6N(x - 9)},${ch6N(y + 3)} Q${ch6N(x)},${ch6N(y - 8)} ${ch6N(x + 9)},${ch6N(y - 3)} Q${ch6N(x + 1)},${ch6N(y + 5)} ${ch6N(x - 9)},${ch6N(y + 3)} Z" fill="rgba(242,237,225,0.8)"/>`
      + `<line x1="${ch6N(x - 12)}" y1="${ch6N(y + 4.5)}" x2="${ch6N(x + 9)}" y2="${ch6N(y - 3)}" stroke="${CH6.chalk}" stroke-width="0.9"/></g>`;
  }
  const yBall = (p) => TOP + H * p * p;
  const yFeather = (p) => (mode === "free" ? yBall(p) : TOP + 30 * p);

  function frame(t) {
    const tt = t % (DUR + HOLD), p = Math.min(1, tt / DUR);
    let s = `<rect x="36" y="8" width="68" height="144" rx="12" fill="rgba(242,237,225,0.04)" stroke="${CH6.dim}" stroke-width="1.6"/>`;
    s += ch6Text(70, 22, mode === "free" ? "vide" : "air", CH6.dim, 12, "middle", true);
    for (let i = 0; i <= 5; i++) {
      const q = i / 5;
      if (q > p + 1e-6) break;
      s += `<circle cx="56" cy="${ch6N(yBall(q))}" r="5" fill="none" stroke="${CH6.chalk}" stroke-opacity="0.3" stroke-width="1"/>`;
      s += feather(84, yFeather(q), 0.22);
    }
    s += `<circle cx="56" cy="${ch6N(yBall(p))}" r="5" fill="${CH6.dim}" stroke="${CH6.chalk}" stroke-width="1.2"/>`;
    s += feather(84, yFeather(p), 1);
    s += ch6Text(56, 164, "bille", CH6.dim, 10, "middle", true);
    s += ch6Text(86, 164, "plume", CH6.dim, 10, "middle", true);
    /* bilan des forces sur la plume */
    s += `<line x1="120" y1="14" x2="120" y2="150" stroke="${CH6.faint}" stroke-width="1"/>`;
    s += ch6Text(180, 26, "Système : la plume", CH6.chalk, 12, "middle", true);
    const M = { x: 176, y: 82 };
    if (!cfg.hideForces) {
      s += ch6Arrow(M.x, M.y, M.x, M.y + 34, CH6.coral, 2.6);
      s += ch6VecSym(M.x + 7, M.y + 32, "P", "", CH6.coral, 12);
      if (mode !== "free") {
        s += ch6Arrow(M.x, M.y, M.x, M.y - 31, CH6.teal, 2.6);
        s += ch6VecSym(M.x + 7, M.y - 22, "F", "air/plume", CH6.teal, 11);
      }
      s += ch6Text(180, 146, mode === "free" ? "seul le poids : chute libre" : "poids + action de l'air", mode === "free" ? CH6.yellow : CH6.coral, 10, "middle");
    }
    s += `<circle cx="${M.x}" cy="${M.y}" r="2.6" fill="${CH6.chalk}"/>`;
    s += ch6Text(M.x - 6, M.y + 4, "M", CH6.chalk, 11, "end", true);
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    readout.innerHTML = mode === "free"
      ? ch6Line(`<strong style="color:${CH6.chalk}">Tube vidé de son air</strong>`)
        + ch6Row(true, `la plume et la bille ne sont soumises qu'à leur poids : ${ch6Strong("chute libre")}`)
        + ch6Line(`Elles tombent ensemble et arrivent en même temps.`)
      : ch6Line(`<strong style="color:${CH6.chalk}">Tube rempli d'air</strong>`)
        + ch6Row(false, `la plume est soumise à son poids et à l'action de l'air, qui n'est pas négligeable : ${ch6Strong("pas une chute libre")}`)
        + ch6Line(`Pour la bille, l'action de l'air est négligeable devant son poids : sa chute peut être considérée comme libre.`);
  }

  function show() {
    ch6Toggle([[bF, "free"], [bN, "notfree"]], (x) => x === mode);
    text();
    ch6Loop(svg, frame);
  }
  ch6Listen(bF, "click", () => { mode = "free"; show(); });
  ch6Listen(bN, "click", () => { mode = "notfree"; show(); });
  show();
}

/* ---------- 6. Vecteur vitesse en chute libre verticale (jonglage) ---------- */
function initFallVelocity(cfg) {
  const svg = ch6El(cfg.svgId);
  if (!svg) return;
  const readout = ch6El(cfg.readoutId);
  const bU = ch6El(cfg.btnUpId), bD = ch6El(cfg.btnDownId);
  let mode = cfg.mode || "up";
  const DT = 0.17, N = 10, HOLD = 1.0, X = 108, BASE = 150, G = 9.6, KV = 0.5;
  const yAt = (k) => BASE - G * (5 * k - k * k / 2);
  const vAt = (k) => G * (5 - k); /* > 0 vers le haut */

  function frame(t) {
    const tt = t % (N * DT + HOLD), k = Math.min(N, tt / DT), y = yAt(k);
    const k0 = mode === "up" ? 0 : 5, k1 = mode === "up" ? 5 : N;
    let s = `<line x1="60" y1="${BASE + 6}" x2="160" y2="${BASE + 6}" stroke="${CH6.line}" stroke-width="1.2" stroke-dasharray="3,3"/>`;
    s += ch6Text(162, BASE + 9, "main du jongleur", CH6.dim, 9, "start", true);
    for (let i = 0; i <= N; i++) {
      const inPhase = i >= k0 && i <= k1, seen = k >= i - 1e-6;
      if (!inPhase) continue;
      s += `<circle cx="${X}" cy="${ch6N(yAt(i))}" r="2.4" fill="${CH6.chalk}" opacity="${seen ? 1 : 0.25}"/>`;
      if (seen && !cfg.hideForces) {
        const v = vAt(i);
        if (Math.abs(v) > 0.1) s += ch6Arrow(X + 14, yAt(i), X + 14, yAt(i) - v * KV, CH6.yellow, 2.2);
        else s += ch6Text(X + 12, yAt(i) + 4, "v = 0", CH6.yellow, 9);
      }
    }
    s += `<circle cx="${X}" cy="${ch6N(y)}" r="6" fill="#e88ac9" fill-opacity="0.85" stroke="${CH6.chalk}" stroke-width="1"/>`;
    if (!cfg.hideForces) {
      s += ch6Arrow(X - 16, y, X - 16, y + 20, CH6.coral, 2.4);
      s += ch6VecSym(X - 30, y + 18, "P", "", CH6.coral, 11);
      s += ch6VecSym(X + 22, mode === "up" ? yAt(1) + 4 : yAt(9) + 4, "v", "", CH6.yellow, 12);
    }
    s += ch6Text(20, 30, mode === "up" ? "montée" : "descente", CH6.yellow, 14, "start", true);
    s += ch6Text(20, 44, "positions à intervalles", CH6.dim, 8);
    s += ch6Text(20, 54, "de temps égaux", CH6.dim, 8);
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    readout.innerHTML = (mode === "up"
      ? ch6Line(`<strong style="color:${CH6.chalk}">Montée</strong> : ${ch6Vec("v")} est vertical, vers le haut ; sa valeur ${ch6Strong("diminue")} jusqu'à 0 au sommet.`)
      : ch6Line(`<strong style="color:${CH6.chalk}">Descente</strong> : ${ch6Vec("v")} est vertical, vers le bas ; sa valeur ${ch6Strong("augmente")}.`))
      + `<div style="margin-top:10px;">Pendant tout le mouvement, la balle n'est soumise qu'à son poids ${ch6Vec("P")} : ${ch6Vec("v")} varie, le mouvement n'est pas rectiligne uniforme.</div>`;
  }

  function show() {
    ch6Toggle([[bU, "up"], [bD, "down"]], (x) => x === mode);
    text();
    ch6Loop(svg, frame);
  }
  ch6Listen(bU, "click", () => { mode = "up"; show(); });
  ch6Listen(bD, "click", () => { mode = "down"; show(); });
  show();
}
