/* Animations du chapitre 11 — 1ère spé PC */

/* ---------- 1. Le vecteur vitesse le long d'une trajectoire ---------- */
function initVelocityVector(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const gapRange = document.getElementById(cfg.gapRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const formulaEl = document.getElementById(cfg.formulaId);

  // trajectoire paramétrique (arc de type "tir")
  function pos(t) { return [30 + 16 * t, 190 - 6 * t * (12 - t) / 3]; }

  function draw() {
    const t0 = 5;
    const gap = Number(gapRange.value) / 10; // 0.2 à 6.0
    const [x0, y0] = pos(t0);
    const [x1, y1] = pos(t0 + gap);

    let s = "";
    // trajectoire complète, en pointillé fin
    let path = `M${pos(0)[0]} ${pos(0)[1]}`;
    for (let t = 0.5; t <= 13; t += 0.5) path += ` L${pos(t)[0]} ${pos(t)[1]}`;
    s += `<path d="${path}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;

    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    s += `<defs>
      <marker id="dispArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk)"/></marker>
      <marker id="viArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
    </defs>`;

    // vecteur déplacement M_i M_i+1, en blanc — c'est LUI qui devient tangent
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--chalk)" stroke-width="2" marker-end="url(#dispArrow)"/>`;
    s += `<circle cx="${x1}" cy="${y1}" r="4" fill="var(--teal)"/>`;
    s += `<text x="${x1 + ux * 10}" y="${y1 + uy * 10}" font-size="9" fill="var(--teal)" text-anchor="middle">M<tspan font-size="6" dy="2">i+1</tspan></text>`;

    // vecteur vitesse, en jaune — même direction, longueur FIXE (échelle
    // indépendante de la position de Mi+1, ne s'arrête pas forcément dessus)
    const V_SCALE = 55;
    const vx = x0 + ux * V_SCALE, vy = y0 + uy * V_SCALE;
    s += `<line x1="${x0}" y1="${y0}" x2="${vx}" y2="${vy}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#viArrow)"/>`;
    s += `<text x="${vx + ux * 14}" y="${vy + uy * 14}" font-size="10" fill="var(--yellow)" font-weight="700">v<tspan font-size="7" dy="2">i</tspan></text>`;

    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--coral)"/><text x="${x0}" y="${y0 - 10}" font-size="9" fill="var(--coral)" text-anchor="middle">M<tspan font-size="7" dy="2">i</tspan></text>`;

    svg.innerHTML = s;

    const isTangent = gap < 0.6;
    readout.innerHTML = `Écart temporel = ${gap.toFixed(1)} × Δt → le <strong style="color:var(--chalk)">vecteur déplacement</strong> (blanc) ${isTangent ? 'est maintenant tangent à la trajectoire' : 'coupe encore la trajectoire'}. Le <strong style="color:var(--yellow)">vecteur vitesse v<sub>i</sub></strong> (jaune) a cette même direction, mais une longueur fixe (échelle indépendante) — regarde comme les deux se comparent différemment selon l'écart.`;

    formulaEl.innerHTML = `v<sub>i</sub> = <span class="frac"><span class="num">M<sub>i</sub>M<sub>i+1</sub></span><span class="den">t<sub>i+1</sub> − t<sub>i</sub></span></span> = <span class="frac"><span class="num">${len.toFixed(0)} m</span><span class="den">${gap.toFixed(1)} Δt</span></span>`;
  }
  gapRange.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Variation de la VALEUR du vecteur vitesse (ligne droite, animée) ---------- */
function initSpeedVariation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const btnConst = document.getElementById(cfg.btnConstId);

  // x(t) = x0 + v0.t + 0,5.a.t² ; v(t) = v0 + a.t — chaque scénario est
  // calibré pour traverser exactement la piste (30 → 210 px) en durée T
  const SCENARIOS = {
    accel: { v0: 30, a: 50, T: 2.15, verb: "augmente", label: "Accélération" },
    decel: { v0: 137.5, a: -50, T: 2.15, verb: "diminue", label: "Décélération" },
    constant: { v0: 70, a: 0, T: 2.571, verb: "reste constante", label: "Vitesse constante" }
  };

  const y = 100, xStart = 30, xEnd = 210, ARROW_SCALE = 0.3;
  let key = "constant", rafId = null, startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const { v0, a, T, verb, label } = SCENARIOS[key];
    const t = ((now - startTime) / 1000) % T;

    const x = xStart + v0 * t + 0.5 * a * t * t;
    const v = v0 + a * t;
    const arrowLen = v * ARROW_SCALE;

    let s = `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
    s += `<defs><marker id="svArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${x}" cy="${y}" r="5" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 22}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;
    s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#svArrow)"/>`;
    s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `<strong style="color:var(--yellow)">${label}</strong> — le point se déplace en ligne droite : le vecteur vitesse garde la même direction et le même sens, mais sa valeur ${verb} (v ≈ ${(v / 10).toFixed(1)} m·s⁻¹).`;

    rafId = requestAnimationFrame(frame);
  }

  function switchTo(newKey) {
    key = newKey;
    startTime = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(frame);
  }

  btnAccel.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnAccel.classList.add("active-hist"); switchTo("accel"); });
  btnDecel.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnDecel.classList.add("active-hist"); switchTo("decel"); });
  btnConst.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnConst.classList.add("active-hist"); switchTo("constant"); });

  btnConst.classList.add("active-hist");
  rafId = requestAnimationFrame(frame);
}

/* ---------- 2b. Construction de Δv (variation de direction) ---------- */
function initDeltaVConstruction(cfg) {
  const svgCircle = document.getElementById(cfg.svgCircleId);
  const svgVec = document.getElementById(cfg.svgVecId);
  const readout = document.getElementById(cfg.readoutId);

  const vScale = 30;

  // même trajectoire que l'animation 1
  function curvePos(t) { return [30 + 16 * t, 190 - 2 * t * (12 - t)]; }
  function curveTangent(t) {
    const [x0, y0] = curvePos(t - 0.15), [x1, y1] = curvePos(t + 0.15);
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    return [dx / len, dy / len];
  }

  const T_SEP = 2.5;   // écart temporel fixe entre A et B
  const T_MAX = 13 - T_SEP; // borne pour que B reste sur la trajectoire
  const DURATION = 3.5; // secondes pour parcourir toute la piste, en boucle

  let rafId = null, startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const t = ((now - startTime) / 1000 / DURATION) * T_MAX;
    const t0 = t % T_MAX;

    const A = curvePos(t0), B = curvePos(t0 + T_SEP);
    const vA = curveTangent(t0), vB = curveTangent(t0 + T_SEP);

    let path = `M${curvePos(0)[0]} ${curvePos(0)[1]}`;
    for (let tt = 0.5; tt <= 13; tt += 0.5) path += ` L${curvePos(tt)[0]} ${curvePos(tt)[1]}`;
    let s1 = `<path d="${path}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
    s1 += `<defs><marker id="vArrowA" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
           <marker id="vArrowB" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;
    s1 += `<circle cx="${A[0]}" cy="${A[1]}" r="4" fill="var(--coral)"/>`;
    s1 += `<line x1="${A[0]}" y1="${A[1]}" x2="${A[0] + vA[0] * vScale}" y2="${A[1] + vA[1] * vScale}" stroke="var(--coral)" stroke-width="2.2" marker-end="url(#vArrowA)"/>`;
    s1 += `<text x="${A[0] + vA[0] * vScale + 10}" y="${A[1] + vA[1] * vScale}" font-size="10" fill="var(--coral)">v<tspan font-size="7" dy="2">A</tspan></text>`;
    s1 += `<circle cx="${B[0]}" cy="${B[1]}" r="4" fill="var(--teal)"/>`;
    s1 += `<line x1="${B[0]}" y1="${B[1]}" x2="${B[0] + vB[0] * vScale}" y2="${B[1] + vB[1] * vScale}" stroke="var(--teal)" stroke-width="2.2" marker-end="url(#vArrowB)"/>`;
    s1 += `<text x="${B[0] + vB[0] * vScale + 10}" y="${B[1] + vB[1] * vScale}" font-size="10" fill="var(--teal)">v<tspan font-size="7" dy="2">B</tspan></text>`;
    svgCircle.innerHTML = s1;

    // construction : vA et vB partent du même point O, Δv relie la pointe de vA à celle de vB
    const ox = 100, oy = 100;
    const Atip = [ox + vA[0] * vScale, oy + vA[1] * vScale];
    const Btip = [ox + vB[0] * vScale, oy + vB[1] * vScale];
    let s2 = `<defs><marker id="vArrowA2" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
              <marker id="vArrowB2" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker>
              <marker id="dvArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker></defs>`;
    s2 += `<circle cx="${ox}" cy="${oy}" r="3" fill="var(--chalk)"/>`;
    s2 += `<line x1="${ox}" y1="${oy}" x2="${Atip[0]}" y2="${Atip[1]}" stroke="var(--coral)" stroke-width="2.2" marker-end="url(#vArrowA2)"/>`;
    s2 += `<text x="${Atip[0] - 14}" y="${Atip[1] - 6}" font-size="10" fill="var(--coral)">v<tspan font-size="7" dy="2">A</tspan></text>`;
    s2 += `<line x1="${ox}" y1="${oy}" x2="${Btip[0]}" y2="${Btip[1]}" stroke="var(--teal)" stroke-width="2.2" marker-end="url(#vArrowB2)"/>`;
    s2 += `<text x="${Btip[0] + 6}" y="${Btip[1] - 6}" font-size="10" fill="var(--teal)">v<tspan font-size="7" dy="2">B</tspan></text>`;
    s2 += `<line x1="${Atip[0]}" y1="${Atip[1]}" x2="${Btip[0]}" y2="${Btip[1]}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#dvArrow)"/>`;
    const midx = (Atip[0] + Btip[0]) / 2, midy = (Atip[1] + Btip[1]) / 2;
    s2 += `<text x="${midx}" y="${midy - 8}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">Δv</text>`;
    svgVec.innerHTML = s2;

    readout.innerHTML = `A et B avancent ensemble le long de la trajectoire, à écart de temps constant : la direction du vecteur vitesse change en permanence, donc <strong style="color:var(--coral)">Δv = v<sub>B</sub> − v<sub>A</sub> n'est jamais le vecteur nul</strong>.`;

    rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);
}

/* ---------- 3. ΣF, Δv et le rôle de la masse ---------- */
/* ---------- 3. ΣF et Δv, pas à pas (chute libre / mouvement circulaire) ---------- */
function initForceScenarioSteps(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const btnFall = document.getElementById(cfg.btnFallId);
  const btnCirc = document.getElementById(cfg.btnCircId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const cx = 110, cy = 100;
  const defs = `<defs>
    <marker id="sfArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--coral)"/></marker>
    <marker id="dvArrow2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
  </defs>`;

  const STEPS_TEXT = {
    fall: [
      "Étape 1 — Les forces en présence : seul le poids P s'exerce sur la balle → ΣF = P.",
      "Étape 2 — Le mouvement : la balle tombe verticalement, en accélérant, en suivant la direction du vecteur ΣF.",
      "Étape 3 — Le mouvement est accéléré : le vecteur Δv grandit avec le temps, mais reste colinéaire à ΣF et de même sens."
    ],
    circular: [
      "Étape 1 — Les forces en présence : la Terre subit la force d'attraction gravitationnelle du Soleil, dirigée vers le centre → ΣF pointe vers le centre.",
      "Étape 2 — Le mouvement : la Terre parcourt une trajectoire circulaire — contrairement à la chute libre, cette trajectoire n'est pas alignée avec ΣF.",
      "Étape 3 — Le mouvement est uniforme (vitesse de valeur constante) : le vecteur Δv garde une longueur constante, mais tourne avec la balle — toujours colinéaire à ΣF, vers le centre."
    ]
  };

  let scenario = "fall", step = 1, rafId = null, startTime = null;

  function drawFall(t, showV) {
    // g_anim : accélération "à l'échelle" de l'animation (px/s²)
    const g = 55, LOOP_Y = [cy - 40, cy + 45];
    const localT = t % 1.6; // boucle toutes les 1,6 s
    const yBall = LOOP_Y[0] + 0.5 * g * localT * localT;
    const y = Math.min(yBall, LOOP_Y[1]);
    const v = g * localT;

    let s = defs;
    s += `<line x1="${cx}" y1="${LOOP_Y[0]}" x2="${cx}" y2="${LOOP_Y[1]}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>`;
    s += `<circle cx="${cx}" cy="${y}" r="8" fill="var(--chalk)"/>`;
    s += `<line x1="${cx - 10}" y1="${y + 12}" x2="${cx - 10}" y2="${y + 45}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#sfArrow)"/>`;
    s += `<text x="${cx - 10}" y="${y + 58}" font-size="10" fill="var(--coral)" text-anchor="middle">ΣF</text>`;
    if (showV) {
      const vLen = Math.min(60, v * 0.7);
      s += `<line x1="${cx + 10}" y1="${y + 12}" x2="${cx + 10}" y2="${y + 12 + vLen}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#dvArrow2)"/>`;
      s += `<text x="${cx + 10}" y="${y + 12 + vLen + 13}" font-size="10" fill="var(--yellow)" text-anchor="middle">Δv</text>`;
    }
    svg.innerHTML = s;
  }

  function drawCircular(t, showBothSteps, showV) {
    const R = 55;
    const omega = 1.4; // rad/s
    const angle = -Math.PI / 2 - omega * t; // horaire
    const px = cx + R * Math.cos(angle), py = cy + R * Math.sin(angle);

    let s = defs;
    s += `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--yellow)"/>`;
    if (showBothSteps) s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<circle cx="${px}" cy="${py}" r="5" fill="var(--chalk)"/>`;

    // ΣF : du point vers le centre
    const dx = cx - px, dy = cy - py, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    const fEndX = px + ux * 40, fEndY = py + uy * 40;
    s += `<line x1="${px}" y1="${py}" x2="${fEndX}" y2="${fEndY}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#sfArrow)"/>`;
    s += `<text x="${fEndX + ux * 12}" y="${fEndY + uy * 12}" font-size="10" fill="var(--coral)">ΣF</text>`;

    if (showV) {
      // Δv : même direction (vers le centre), longueur CONSTANTE (mouvement uniforme),
      // légèrement décalé de ΣF pour rester visible à côté
      const perpX = -uy * 8, perpY = ux * 8;
      s += `<line x1="${px + perpX}" y1="${py + perpY}" x2="${px + perpX + ux * 40}" y2="${py + perpY + uy * 40}" stroke="var(--yellow)" stroke-width="2.2" marker-end="url(#dvArrow2)"/>`;
      s += `<text x="${px + perpX + ux * 48}" y="${py + perpY + uy * 48}" font-size="10" fill="var(--yellow)">Δv</text>`;
    }
    svg.innerHTML = s;
  }

  function frame(now) {
    if (startTime === null) startTime = now;
    const t = (now - startTime) / 1000;

    if (scenario === "fall") {
      if (step === 1) { drawFall(0, false); }
      else drawFall(t, step === 3);
    } else {
      if (step === 1) {
        // étape 1 : statique, juste ΣF au point de départ
        drawCircular(0, false, false);
      } else {
        drawCircular(t, true, step === 3);
      }
    }
    rafId = requestAnimationFrame(frame);
  }

  function render() {
    explainEl.innerHTML = STEPS_TEXT[scenario][step - 1];
    stepEl.textContent = `Étape ${step} / 3`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 3;
    startTime = null; // redémarre l'horloge de l'animation à chaque changement
  }

  btnFall.addEventListener("click", () => { btnFall.classList.add("active-hist"); btnCirc.classList.remove("active-hist"); scenario = "fall"; step = 1; render(); });
  btnCirc.addEventListener("click", () => { btnCirc.classList.add("active-hist"); btnFall.classList.remove("active-hist"); scenario = "circular"; step = 1; render(); });
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 3) { step++; render(); } });

  btnFall.classList.add("active-hist");
  render();
  rafId = requestAnimationFrame(frame);
}

/* ---------- 3b. Le rôle de la masse ---------- */
function initForceMassRole(cfg) {
  const svg = document.getElementById(cfg.svgMassId);
  const massRange = document.getElementById(cfg.massRangeId);
  const readout = document.getElementById(cfg.massReadoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);

  // même mécanique que "Variation de la valeur du vecteur vitesse" : point qui
  // accélère (ou décélère) sur une ligne droite, mais ici c'est la masse qui
  // pilote l'accélération à force ΣF fixée (a = ΣF / m).
  const F_FIXED = 80; // unité arbitraire
  const V0_FIXED = 50; // vitesse initiale FIXE en décélération, la même quelle que soit la masse
  const DURATION = 6.6; // boucle, en secondes — assez long pour laisser les grosses masses finir de s'arrêter
  const y = 100, xStart = 30, xEnd = 210, ARROW_SCALE = 0.3;
  let mode = "accel", rafId = null, startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const mass = Number(massRange.value);
    const a = F_FIXED / mass;

    let x, v, t;
    if (mode === "accel") {
      const T = Math.sqrt(2 * (xEnd - xStart) / a); // durée pour traverser la piste
      t = ((now - startTime) / 1000) % T;
      x = xStart + 0.5 * a * t * t;
      v = a * t;
    } else {
      // v0 FIXE, quelle que soit la masse — seule l'accélération (donc la
      // distance et le temps nécessaires pour s'arrêter) change avec m.
      t = ((now - startTime) / 1000) % DURATION;
      const tStop = V0_FIXED / a; // instant où v atteint 0
      if (t < tStop) {
        x = xStart + V0_FIXED * t - 0.5 * a * t * t;
        v = V0_FIXED - a * t;
      } else {
        // arrêté : position FIGÉE (la formule quadratique redescendrait sinon,
        // c'était le bug — une parabole continue après son sommet)
        x = xStart + (V0_FIXED * V0_FIXED) / (2 * a);
        v = 0;
      }
      x = Math.min(x, xEnd); // au cas où l'arrêt théorique dépasserait la piste (grosse masse)
    }
    const arrowLen = v * ARROW_SCALE;

    let s = `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
    s += `<defs><marker id="mArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${x}" cy="${y}" r="${4 + mass * 0.6}" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 24}" font-size="9" fill="var(--coral)" text-anchor="middle">m = ${mass}</text>`;
    if (arrowLen > 1) {
      s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#mArrow)"/>`;
      s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;
    }

    svg.innerHTML = s;
    const verb = mode === "accel" ? "grandit" : "rétrécit";
    const decelNote = mode === "decel" ? " Le vecteur initial (v₀) est toujours le même : seule la masse change la distance nécessaire pour s'arrêter." : "";
    readout.innerHTML = `ΣF fixée, m = ${mass} → a = <span class="frac"><span class="num">ΣF</span><span class="den">m</span></span> ≈ <strong style="color:var(--yellow)">${a.toFixed(1)}</strong> — plus la masse est grande, plus le vecteur vitesse ${verb} lentement (elle "résiste" davantage au changement de mouvement).${decelNote}`;

    rafId = requestAnimationFrame(frame);
  }

  btnAccel.addEventListener("click", () => { btnAccel.classList.add("active-hist"); btnDecel.classList.remove("active-hist"); mode = "accel"; startTime = null; });
  btnDecel.addEventListener("click", () => { btnDecel.classList.add("active-hist"); btnAccel.classList.remove("active-hist"); mode = "decel"; startTime = null; });
  massRange.addEventListener("input", () => { startTime = null; });
  btnAccel.classList.add("active-hist");
  rafId = requestAnimationFrame(frame);
}
