/* Animations du chapitre 13 — 1ère spé PC */

/* ---------- 1. Modèle microscopique du courant électrique ---------- */
function initCurrentModel(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const qRange = document.getElementById(cfg.qRangeId);
  const dtRange = document.getElementById(cfg.dtRangeId);
  const formulaEl = document.getElementById(cfg.formulaId);
  const readout = document.getElementById(cfg.readoutId);
  const btnMetal = document.getElementById(cfg.btnMetalId);
  const btnSolution = document.getElementById(cfg.btnSolutionId);

  const tubeY = 90, tubeX0 = 20, tubeX1 = 220, markerX = 130;
  const L = tubeX1 - tubeX0;
  let mode = "metal", rafId = null, startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const Q = Number(qRange.value);   // nombre de charges = nombre de boules
    const dt = Number(dtRange.value); // durée d'un tour complet, en s
    const speed = L / dt;             // px/s : un tour complet dure pile Δt

    let s = `<rect x="${tubeX0}" y="${tubeY - 22}" width="${L}" height="44" rx="20" fill="rgba(107,191,171,0.08)" stroke="var(--teal)" stroke-width="2"/>`;
    s += `<line x1="${markerX}" y1="${tubeY - 30}" x2="${markerX}" y2="${tubeY + 30}" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
    s += `<text x="${markerX}" y="${tubeY - 36}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">section</text>`;

    // Q boules réparties régulièrement sur le tube (bouclé) : comme chaque
    // tour dure Δt, exactement Q boules franchissent la section pendant Δt
    // → le débit visible EST, par construction, I = Q / Δt.
    // (en solution, cations et anions vont en sens opposés, mais les deux
    // sens transportent du courant dans la même direction conventionnelle)
    const elapsed = (now - startTime) / 1000;

    if (mode === "metal") {
      for (let i = 0; i < Q; i++) {
        const offset = (i / Q) * L;
        const x = tubeX0 + ((offset + speed * elapsed) % L);
        const y = tubeY + (((i * 37) % 30) - 15);
        s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--teal)"/>`;
      }
    } else {
      const nPos = Math.ceil(Q / 2), nNeg = Q - nPos;
      for (let i = 0; i < nPos; i++) {
        const offset = (i / nPos) * L;
        const x = tubeX0 + ((offset + speed * elapsed) % L); // cations → vers la droite
        const y = tubeY + (((i * 37) % 24) - 12) - 5;
        s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--coral)"/>`;
        s += `<text x="${x}" y="${y + 3}" font-size="6" fill="var(--board)" text-anchor="middle" font-weight="700">+</text>`;
      }
      for (let i = 0; i < nNeg; i++) {
        const offset = (i / nNeg) * L;
        const x = tubeX0 + (((offset - speed * elapsed) % L) + L) % L; // anions → vers la gauche
        const y = tubeY + (((i * 37) % 24) - 12) + 5;
        s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--teal)"/>`;
        s += `<text x="${x}" y="${y + 3}" font-size="6" fill="var(--board)" text-anchor="middle" font-weight="700">−</text>`;
      }
    }

    svg.innerHTML = s;

    const I = Q / dt;
    formulaEl.innerHTML = `I = <span class="frac"><span class="num">Q</span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${Q} C</span><span class="den">${dt.toFixed(1)} s</span></span> = <strong style="color:var(--yellow)">${I.toFixed(1)}</strong> A`;
    readout.innerHTML = `${mode === "metal" ? "Porteurs : électrons (e⁻)" : "Porteurs : cations (+, vers la droite) et anions (−, vers la gauche) — les deux sens transportent le courant dans la même direction conventionnelle"} — Q boules parcourent tout le tube en Δt secondes : regarde combien franchissent la section repère à chaque tour.`;

    rafId = requestAnimationFrame(frame);
  }

  function setMode(newMode) {
    mode = newMode;
  }

  btnMetal.addEventListener("click", () => { btnMetal.classList.add("active-hist"); btnSolution.classList.remove("active-hist"); setMode("metal"); });
  btnSolution.addEventListener("click", () => { btnSolution.classList.add("active-hist"); btnMetal.classList.remove("active-hist"); setMode("solution"); });
  qRange.addEventListener("input", () => { startTime = null; });
  dtRange.addEventListener("input", () => { startTime = null; });

  btnMetal.classList.add("active-hist");
  rafId = requestAnimationFrame(frame);
}

/* ---------- 2. Tracé de la caractéristique U = f(I) ---------- */
function initCharacteristicPlot(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const svgCircuit = document.getElementById(cfg.svgCircuitId);
  const eRange = document.getElementById(cfg.eRangeId);
  const rRange = document.getElementById(cfg.rRangeId);
  const traceBtn = document.getElementById(cfg.traceBtnId);
  const readout = document.getElementById(cfg.readoutId);

  const originX = 40, originY = 170, axisIMax = 200, axisUMax = 150;
  const IMAX = 3, UMAX = 12; // échelle du graphe — I max réduit pour une pente moins abrupte

  function drawCircuit() {
    const left = 75, right = 195, top = 30, bottom = 125;
    let s = "";
    s += `<defs>
      <marker id="tealArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker>
      <marker id="yellowArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
      <marker id="chalkArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chalk)"/></marker>
    </defs>`;
    // boucle du circuit : un vrai rectangle continu, sans trou
    // (le cercle "E, r" vient simplement se poser PAR-DESSUS le fil gauche)
    const cy = (top + bottom) / 2;
    s += `<line x1="${left}" y1="${top}" x2="${right}" y2="${top}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${right}" y1="${top}" x2="${right}" y2="${bottom}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${right}" y1="${bottom}" x2="${left}" y2="${bottom}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${left}" y1="${bottom}" x2="${left}" y2="${top}" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    // source réelle : cercle "E, r" sur la branche gauche
    s += `<circle cx="${left}" cy="${cy}" r="18" fill="var(--board)" stroke="var(--coral)" stroke-width="2.5"/>`;
    s += `<text x="${left}" y="${cy + 4}" font-size="10.5" fill="var(--coral)" text-anchor="middle" font-weight="700">E, r</text>`;

    // voltmètre en dérivation de la source, comme dans le livre (avec COM)
    const vX = 25;
    s += `<line x1="${left - 18}" y1="${cy - 12}" x2="${vX}" y2="${cy - 12}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    s += `<line x1="${vX}" y1="${cy - 12}" x2="${vX}" y2="${cy + 12}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    s += `<line x1="${vX}" y1="${cy + 12}" x2="${left - 18}" y2="${cy + 12}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    s += `<circle cx="${vX}" cy="${cy}" r="12" fill="var(--board)" stroke="var(--teal)" stroke-width="1.8"/>`;
    s += `<text x="${vX}" y="${cy + 4}" font-size="10" fill="var(--teal)" text-anchor="middle" font-weight="700">V</text>`;
    s += `<text x="${vX}" y="${cy + 24}" font-size="7" fill="var(--chalk-dim)" text-anchor="middle">COM</text>`;

    // flèche U : entre la source et le voltmètre
    s += `<line x1="${left - 30}" y1="${cy - 22}" x2="${left - 30}" y2="${cy + 22}" stroke="var(--teal)" stroke-width="1.8" marker-end="url(#tealArrow)"/>`;
    s += `<text x="${left - 30}" y="${cy - 28}" font-size="11" fill="var(--teal)" text-anchor="middle" font-weight="700">U</text>`;

    // flèche I : sens du courant sur le fil du haut
    s += `<line x1="${left + 10}" y1="${top - 10}" x2="${left + 38}" y2="${top - 10}" stroke="var(--yellow)" stroke-width="1.8" marker-end="url(#yellowArrow)"/>`;
    s += `<text x="${left + 24}" y="${top - 16}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">I</text>`;

    // résistance variable (rhéostat) sur le fil du haut, à droite
    const rhX = 140;
    s += `<rect x="${rhX - 22}" y="${top - 7}" width="44" height="14" fill="none" stroke="var(--chalk)" stroke-width="1.8"/>`;
    s += `<line x1="${rhX - 22}" y1="${top + 12}" x2="${rhX + 22}" y2="${top - 12}" stroke="var(--chalk)" stroke-width="1.8" marker-end="url(#chalkArrow)"/>`;
    s += `<text x="${rhX}" y="${top - 14}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">rhéostat</text>`;

    // ampèremètre
    s += `<circle cx="${right}" cy="${cy}" r="12" fill="var(--board)" stroke="var(--chalk)" stroke-width="1.8"/>`;
    s += `<text x="${right}" y="${cy + 4}" font-size="10" fill="var(--chalk)" text-anchor="middle" font-weight="700">A</text>`;

    s += `<text x="${(left + right) / 2}" y="${bottom + 18}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">Rhéostat : fait varier I.</text>`;
    s += `<text x="${(left + right) / 2}" y="${bottom + 30}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">V et A : mesurent U et I à chaque réglage.</text>`;

    svgCircuit.innerHTML = s;
  }
  drawCircuit();

  function toPx(I, U) {
    return [originX + (I / IMAX) * axisIMax, originY - (U / UMAX) * axisUMax];
  }

  let rafId = null, animStart = null, animating = false;

  function drawAxesAndIdeal(E) {
    let s = "";
    s += `<line x1="${originX}" y1="${originY}" x2="${originX + axisIMax + 10}" y2="${originY}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<line x1="${originX}" y1="${originY}" x2="${originX}" y2="${originY - axisUMax - 10}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="${originX + axisIMax + 16}" y="${originY + 4}" font-size="10" fill="var(--chalk-dim)">I (A)</text>`;
    s += `<text x="${originX - 8}" y="${originY - axisUMax - 16}" font-size="10" fill="var(--chalk-dim)" text-anchor="middle">U (V)</text>`;

    // source idéale : U = E, droite horizontale pointillée, toujours visible en référence
    const [ix0, iy0] = toPx(0, Math.min(E, UMAX));
    const [ix1, iy1] = toPx(IMAX, Math.min(E, UMAX));
    s += `<line x1="${ix0}" y1="${iy0}" x2="${ix1}" y2="${iy1}" stroke="var(--teal)" stroke-width="2" stroke-dasharray="4,3"/>`;
    s += `<text x="${ix1 - 5}" y="${iy0 - 6}" font-size="8.5" fill="var(--teal)" text-anchor="end">source idéale (U = E)</text>`;

    s += `<circle cx="${originX}" cy="${toPx(0, E)[1]}" r="3" fill="var(--yellow)"/>`;
    s += `<text x="${originX - 6}" y="${toPx(0, E)[1] + 3}" font-size="8.5" fill="var(--yellow)" text-anchor="end">E</text>`;
    return s;
  }

  function drawStatic() {
    const E = Number(eRange.value);
    svg.innerHTML = drawAxesAndIdeal(E);
    readout.innerHTML = `E et r réglés. Clique sur "Tracer !" pour voir la caractéristique se dessiner.`;
  }

  function frame(now) {
    if (animStart === null) animStart = now;
    const E = Number(eRange.value), r = Number(rRange.value);
    const DURATION = 1600;
    const t = Math.min(1, (now - animStart) / DURATION);

    const IendReal = Math.min(IMAX, r > 0 ? E / r : IMAX);
    const ICurrent = t * IendReal;

    let s = drawAxesAndIdeal(E);
    const [rx0, ry0] = toPx(0, E);
    const [rx1, ry1] = toPx(ICurrent, Math.max(0, E - r * ICurrent));
    s += `<line x1="${rx0}" y1="${ry0}" x2="${rx1}" y2="${ry1}" stroke="var(--coral)" stroke-width="2.5"/>`;
    s += `<circle cx="${rx1}" cy="${ry1}" r="4" fill="var(--coral)"/>`;
    if (t > 0.15) s += `<text x="${(rx0 + rx1) / 2}" y="${(ry0 + ry1) / 2 - 8}" font-size="8.5" fill="var(--coral)">source réelle (U = E − r×I)</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `E = ${E} V, r = ${r} Ω → U = ${E} − ${r}×I. La droite réelle s'écarte de la droite idéale : plus I augmente, plus U chute.`;

    if (t < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      animating = false;
    }
  }

  function startAnimation() {
    animating = true;
    animStart = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(frame);
  }

  eRange.addEventListener("input", () => { if (!animating) drawStatic(); });
  rRange.addEventListener("input", () => { if (!animating) drawStatic(); });
  traceBtn.addEventListener("click", startAnimation);

  drawStatic();
}

/* ---------- 3. Chaîne de puissance et rendement ---------- */
function initPowerChain(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const etaRange = document.getElementById(cfg.etaRangeId);
  const readout = document.getElementById(cfg.readoutId);

  // flèche épaisse en un seul polygone (hampe + pointe fusionnées) — l'épaisseur
  // représente la puissance transportée, comme un tuyau qui grossit ou rétrécit
  function thickArrow(x1, y1, x2, y2, thickness, color) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len, perpX = -uy, perpY = ux;
    const headLen = Math.min(len * 0.45, thickness + 16);
    const shaftHalf = thickness / 2, headHalf = shaftHalf + 8;
    const sx = x2 - ux * headLen, sy = y2 - uy * headLen;
    const pts = [
      [x1 + perpX * shaftHalf, y1 + perpY * shaftHalf],
      [x1 - perpX * shaftHalf, y1 - perpY * shaftHalf],
      [sx - perpX * shaftHalf, sy - perpY * shaftHalf],
      [sx - perpX * headHalf, sy - perpY * headHalf],
      [x2, y2],
      [sx + perpX * headHalf, sy + perpY * headHalf],
      [sx + perpX * shaftHalf, sy + perpY * shaftHalf]
    ];
    return `<polygon points="${pts.map(p => p.join(",")).join(" ")}" fill="${color}"/>`;
  }

  function draw() {
    const eta = Number(etaRange.value) / 100;
    const P_ENTREE = 100; // référence, unité arbitraire
    const P_exploit = P_ENTREE * eta;
    const P_degrad = P_ENTREE * (1 - eta);

    const THICK_MAX = 20;
    const boxX = 95, boxY = 65, boxW = 60, boxH = 42;
    const boxCx = boxX + boxW / 2, boxMidY = boxY + boxH / 2, boxBottom = boxY + boxH;

    let s = "";
    // flèche d'entrée, toujours pleine épaisseur (référence = 100%)
    s += thickArrow(15, boxMidY, boxX - 4, boxMidY, THICK_MAX, "var(--chalk)");
    s += `<text x="${(15 + boxX) / 2}" y="${boxMidY - 16}" font-size="8" fill="var(--chalk)" text-anchor="middle">P entrée</text>`;

    // convertisseur
    s += `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="6" fill="rgba(255,255,255,0.05)" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<text x="${boxCx}" y="${boxMidY + 4}" font-size="9" fill="var(--yellow)" text-anchor="middle" font-weight="700">Convertisseur</text>`;

    // flèche exploitable, même direction, épaisseur ∝ η
    const exploitThick = Math.max(2, eta * THICK_MAX);
    s += thickArrow(boxX + boxW + 4, boxMidY, 225, boxMidY, exploitThick, "var(--teal)");
    s += `<text x="${(boxX + boxW + 225) / 2}" y="${boxMidY - 16}" font-size="8" fill="var(--teal)" text-anchor="middle">P exploitable</text>`;

    // flèche dégradée, perpendiculaire vers le bas, épaisseur ∝ (1 − η)
    const degradThick = Math.max(2, (1 - eta) * THICK_MAX);
    if (1 - eta > 0.01) {
      s += thickArrow(boxCx, boxBottom + 4, boxCx, 185, degradThick, "var(--coral)");
      s += `<text x="${boxCx + 34}" y="165" font-size="8" fill="var(--coral)" text-anchor="middle">P dégradée</text>`;
    }

    svg.innerHTML = s;

    readout.innerHTML = `P entrée = P exploitable + P dégradée : ${P_ENTREE.toFixed(0)} = ${P_exploit.toFixed(0)} + ${P_degrad.toFixed(0)}.<br>η = P exploitable / P entrée = <strong style="color:var(--yellow)">${eta.toFixed(2)}</strong> — plus la flèche dégradée est épaisse, plus le rendement est faible.`;
  }

  etaRange.addEventListener("input", draw);

  draw();
}

/* ---------- 4. Énergie électrique : E = P × Δt ---------- */
function initEnergyAccumulator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const pRange = document.getElementById(cfg.pRangeId);
  const dtRange = document.getElementById(cfg.dtRangeId);
  const formulaEl = document.getElementById(cfg.formulaId);
  const readout = document.getElementById(cfg.readoutId);
  const btn = document.getElementById(cfg.btnId);

  let rafId = null, startTime = null, running = false;
  const P_MIN = Number(pRange.min), P_MAX = Number(pRange.max);

  // cadran circulaire type "potentiomètre" : l'aiguille balaie -135° à +135°
  function drawKnob(cx, cy, r, frac, color, label, valueText) {
    const angle = -135 + Math.max(0, Math.min(1, frac)) * 270;
    const rad = (angle * Math.PI) / 180;
    const nx = cx + r * 0.72 * Math.cos(rad), ny = cy + r * 0.72 * Math.sin(rad);
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--board)" stroke="${color}" stroke-width="2"/>`;
    // petites graduations de -135° à +135°
    [0, 0.25, 0.5, 0.75, 1].forEach(f => {
      const a = (-135 + f * 270) * Math.PI / 180;
      const x1 = cx + (r - 3) * Math.cos(a), y1 = cy + (r - 3) * Math.sin(a);
      const x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    });
    s += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="${color}" stroke-width="2.5"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="3" fill="${color}"/>`;
    s += `<text x="${cx}" y="${cy + r + 15}" font-size="8.5" fill="${color}" text-anchor="middle">${label}</text>`;
    s += `<text x="${cx}" y="${cy + r + 26}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${valueText}</text>`;
    return s;
  }

  function draw(on, t, dtMax, P) {
    // colonne gauche : machine + jauge d'énergie, côte à côte
    const cx = 50, cy = 90;
    let s = "";
    s += `<rect x="${cx - 28}" y="${cy - 32}" width="56" height="64" rx="8" fill="${on ? 'rgba(232,196,104,0.25)' : 'rgba(255,255,255,0.04)'}" stroke="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" stroke-width="2.5"/>`;
    s += `<circle cx="${cx}" cy="${cy - 10}" r="11" fill="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" opacity="${on ? 1 : 0.4}"/>`;
    s += `<text x="${cx}" y="${cy - 6}" font-size="8.5" fill="var(--board)" text-anchor="middle" font-weight="700">${on ? "ON" : "OFF"}</text>`;
    s += `<text x="${cx}" y="${cy + 20}" font-size="9" fill="${on ? 'var(--yellow)' : 'var(--chalk-dim)'}" text-anchor="middle">machine</text>`;

    // jauge d'énergie, juste à côté du boîtier — en grand, sur toute la hauteur disponible
    const gx = 100, gTop = 20, gBottom = 180, gW = 28;
    const Emax = P * dtMax;
    const fillFrac = Emax > 0 ? (P * t) / Emax : 0;
    s += `<rect x="${gx}" y="${gTop}" width="${gW}" height="${gBottom - gTop}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    const h = Math.max(0, Math.min(1, fillFrac)) * (gBottom - gTop);
    s += `<rect x="${gx}" y="${gBottom - h}" width="${gW}" height="${h}" fill="var(--teal)"/>`;
    s += `<text x="${gx + gW / 2}" y="${gBottom + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">énergie E</text>`;

    // colonne droite : les deux cadrans, l'un sous l'autre, bien alignés
    const knobX = 200;

    // cadran P (potentiomètre), en haut
    const pFrac = (P - P_MIN) / (P_MAX - P_MIN);
    s += drawKnob(knobX, 55, 24, pFrac, "var(--coral)", "puissance P", `${P} W`);

    // chrono circulaire, en dessous, aligné sur le même x
    const chronoFrac = dtMax > 0 ? t / dtMax : 0;
    const chronoAngle = -90 + Math.max(0, Math.min(1, chronoFrac)) * 360;
    const crad = (chronoAngle * Math.PI) / 180;
    const ccy = 150, cr = 24;
    const chx = knobX + cr * 0.75 * Math.cos(crad), chy = ccy + cr * 0.75 * Math.sin(crad);
    s += `<circle cx="${knobX}" cy="${ccy}" r="${cr}" fill="var(--board)" stroke="var(--yellow)" stroke-width="2"/>`;
    [0, 0.25, 0.5, 0.75].forEach(f => {
      const a = (-90 + f * 360) * Math.PI / 180;
      const x1 = knobX + (cr - 3) * Math.cos(a), y1 = ccy + (cr - 3) * Math.sin(a);
      const x2 = knobX + cr * Math.cos(a), y2 = ccy + cr * Math.sin(a);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    });
    s += `<line x1="${knobX}" y1="${ccy}" x2="${chx}" y2="${chy}" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<circle cx="${knobX}" cy="${ccy}" r="3" fill="var(--yellow)"/>`;
    s += `<text x="${knobX}" y="${ccy + cr + 15}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">chrono</text>`;
    s += `<text x="${knobX}" y="${ccy + cr + 26}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${t.toFixed(1)} / ${dtMax} s</text>`;

    svg.innerHTML = s;
  }

  function frame(now) {
    if (startTime === null) startTime = now;
    const P = Number(pRange.value);
    const dtMax = Number(dtRange.value);
    const t = Math.min(dtMax, (now - startTime) / 1000);
    const E = P * t;

    draw(true, t, dtMax, P);
    formulaEl.innerHTML = `E = P × t = <span class="frac"><span class="num">${P} W</span><span class="den">× ${t.toFixed(1)} s</span></span> = <strong style="color:var(--yellow)">${E.toFixed(0)} J</strong>`;
    readout.innerHTML = `La machine tourne depuis ${t.toFixed(1)} s à ${P} W → l'énergie consommée augmente avec le temps écoulé.`;

    if (t < dtMax) {
      rafId = requestAnimationFrame(frame);
    } else {
      running = false;
      btn.textContent = "🔌 Rallumer";
      readout.innerHTML = `Après Δt = ${dtMax} s à P = ${P} W : E = P × Δt = <strong style="color:var(--yellow)">${(P * dtMax).toFixed(0)} J</strong>.`;
    }
  }

  function start() {
    running = true;
    startTime = null;
    btn.textContent = "⏸ En marche...";
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(frame);
  }

  function drawIdle() {
    draw(false, 0, Number(dtRange.value), Number(pRange.value));
    formulaEl.innerHTML = "";
    readout.innerHTML = `Machine éteinte. Règle P et Δt, puis clique sur "Allumer !".`;
  }

  btn.addEventListener("click", () => { if (!running) start(); });
  pRange.addEventListener("input", () => { if (!running) drawIdle(); });
  dtRange.addEventListener("input", () => { if (!running) drawIdle(); });

  drawIdle();
}
