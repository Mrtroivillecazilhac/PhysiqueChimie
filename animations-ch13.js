/* Animations du chapitre 13 — 1ère spé PC */

/* ---------- 0. Utilitaire : boucle requestAnimationFrame pilotée par la visibilité ---------- */
/* Suspend automatiquement une animation quand son SVG n'est plus affiché (onglet
   "Cours" / "Entraînement" masqué par mode-tabs, ou simplement scrollé hors
   écran), et la relance dès qu'il redevient visible. Évite de faire tourner en
   tâche de fond les 8 boucles d'animation du chapitre en même temps. */
function makePausableAnimation(el, frameFn) {
  let rafId = null;
  let visible = false;

  function tick(now) {
    frameFn(now);
    rafId = requestAnimationFrame(tick);
  }
  function start() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }
  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  if (el && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
      });
    }, { threshold: 0 });
    observer.observe(el);
  } else {
    start(); // repli si IntersectionObserver indisponible
  }

  return { start, stop };
}

/* ---------- 1. Le vecteur vitesse le long d'une trajectoire ---------- */
function initVelocityVector(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const gapRange = document.getElementById(cfg.gapRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const formulaEl = document.getElementById(cfg.formulaId);
  const pfx = cfg.svgId; // préfixe d'IDs SVG propre à cette instance (Cours / Entraînement)

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
      <marker id="${pfx}_dispArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk)"/></marker>
      <marker id="${pfx}_viArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
    </defs>`;

    // vecteur déplacement M_i M_i+1, en blanc — c'est LUI qui devient tangent
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--chalk)" stroke-width="2" marker-end="url(#${pfx}_dispArrow)"/>`;
    s += `<circle cx="${x1}" cy="${y1}" r="4" fill="var(--teal)"/>`;
    s += `<text x="${x1 + ux * 10}" y="${y1 + uy * 10}" font-size="9" fill="var(--teal)" text-anchor="middle">M<tspan font-size="6" dy="2">i+1</tspan></text>`;

    // vecteur vitesse, en jaune — même direction, longueur FIXE (échelle
    // indépendante de la position de Mi+1, ne s'arrête pas forcément dessus)
    const V_SCALE = 55;
    const vx = x0 + ux * V_SCALE, vy = y0 + uy * V_SCALE;
    s += `<line x1="${x0}" y1="${y0}" x2="${vx}" y2="${vy}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfx}_viArrow)"/>`;
    s += `<text x="${vx + ux * 14}" y="${vy + uy * 14}" font-size="10" fill="var(--yellow)" font-weight="700">v<tspan font-size="7" dy="2">i</tspan></text>`;

    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--coral)"/><text x="${x0}" y="${y0 - 10}" font-size="9" fill="var(--coral)" text-anchor="middle">M<tspan font-size="7" dy="2">i</tspan></text>`;

    svg.innerHTML = s;

    const isTangent = gap < 0.6;
    readout.innerHTML = `Écart temporel = ${gap.toFixed(1)} × Δt → le <strong style="color:var(--chalk)">vecteur déplacement</strong> (blanc) ${isTangent ? 'est maintenant tangent à la trajectoire' : 'coupe encore la trajectoire'}. Le <strong style="color:var(--yellow)">vecteur vitesse <span class="vec">v<sub>i</sub></span></strong> (jaune) a cette même direction, mais une longueur fixe (échelle indépendante) — regarde comme les deux se comparent différemment selon l'écart.`;

    formulaEl.innerHTML = `<span class="vec">v<sub>i</sub></span> = <span class="frac"><span class="num"><span class="vec">M<sub>i</sub>M<sub>i+1</sub></span></span><span class="den">t<sub>i+1</sub> − t<sub>i</sub></span></span> = <span class="frac"><span class="num">${len.toFixed(0)} m</span><span class="den">${gap.toFixed(1)} Δt</span></span>`;
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
  const pfx = cfg.svgId;

  // x(t) = x0 + v0.t + 0,5.a.t² ; v(t) = v0 + a.t — chaque scénario est
  // calibré pour traverser exactement la piste (30 → 210 px) en durée T
  const SCENARIOS = {
    accel: { v0: 30, a: 50, T: 2.15, verb: "augmente", label: "Accélération" },
    decel: { v0: 137.5, a: -50, T: 2.15, verb: "diminue", label: "Décélération" },
    constant: { v0: 70, a: 0, T: 2.571, verb: "reste constante", label: "Vitesse constante" }
  };

  const y = 100, xStart = 30, xEnd = 210, ARROW_SCALE = 0.3;
  let key = "constant", startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const { v0, a, T, verb, label } = SCENARIOS[key];
    const t = ((now - startTime) / 1000) % T;

    const x = xStart + v0 * t + 0.5 * a * t * t;
    const v = v0 + a * t;
    const arrowLen = v * ARROW_SCALE;

    let s = `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
    s += `<defs><marker id="${pfx}_svArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${x}" cy="${y}" r="5" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 22}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;
    s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#${pfx}_svArrow)"/>`;
    s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `<strong style="color:var(--yellow)">${label}</strong> — le point se déplace en ligne droite : le vecteur vitesse garde la même direction et le même sens, mais sa valeur ${verb} (v ≈ ${(v / 10).toFixed(1)} m·s⁻¹).`;
  }

  const loop = makePausableAnimation(svg, frame);

  function switchTo(newKey) {
    key = newKey;
    startTime = null; // la boucle déjà active reprend avec le nouveau scénario au prochain tick
  }

  btnAccel.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnAccel.classList.add("active-hist"); switchTo("accel"); });
  btnDecel.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnDecel.classList.add("active-hist"); switchTo("decel"); });
  btnConst.addEventListener("click", () => { [btnAccel, btnDecel, btnConst].forEach(b => b.classList.remove("active-hist")); btnConst.classList.add("active-hist"); switchTo("constant"); });

  btnConst.classList.add("active-hist");
}

/* ---------- 2b. Construction de Δv (variation de direction) ---------- */
function initDeltaVConstruction(cfg) {
  const svgCircle = document.getElementById(cfg.svgCircleId);
  const svgVec = document.getElementById(cfg.svgVecId);
  const readout = document.getElementById(cfg.readoutId);
  const pfxCircle = cfg.svgCircleId, pfxVec = cfg.svgVecId;

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

  let startTime = null;

  function frame(now) {
    if (startTime === null) startTime = now;
    const t = ((now - startTime) / 1000 / DURATION) * T_MAX;
    const t0 = t % T_MAX;

    const A = curvePos(t0), B = curvePos(t0 + T_SEP);
    const vA = curveTangent(t0), vB = curveTangent(t0 + T_SEP);

    let path = `M${curvePos(0)[0]} ${curvePos(0)[1]}`;
    for (let tt = 0.5; tt <= 13; tt += 0.5) path += ` L${curvePos(tt)[0]} ${curvePos(tt)[1]}`;
    let s1 = `<path d="${path}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
    s1 += `<defs><marker id="${pfxCircle}_vArrowA" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
           <marker id="${pfxCircle}_vArrowB" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;
    s1 += `<circle cx="${A[0]}" cy="${A[1]}" r="4" fill="var(--coral)"/>`;
    s1 += `<line x1="${A[0]}" y1="${A[1]}" x2="${A[0] + vA[0] * vScale}" y2="${A[1] + vA[1] * vScale}" stroke="var(--coral)" stroke-width="2.2" marker-end="url(#${pfxCircle}_vArrowA)"/>`;
    s1 += `<text x="${A[0] + vA[0] * vScale + 10}" y="${A[1] + vA[1] * vScale}" font-size="10" fill="var(--coral)">v<tspan font-size="7" dy="2">A</tspan></text>`;
    s1 += `<circle cx="${B[0]}" cy="${B[1]}" r="4" fill="var(--teal)"/>`;
    s1 += `<line x1="${B[0]}" y1="${B[1]}" x2="${B[0] + vB[0] * vScale}" y2="${B[1] + vB[1] * vScale}" stroke="var(--teal)" stroke-width="2.2" marker-end="url(#${pfxCircle}_vArrowB)"/>`;
    s1 += `<text x="${B[0] + vB[0] * vScale + 10}" y="${B[1] + vB[1] * vScale}" font-size="10" fill="var(--teal)">v<tspan font-size="7" dy="2">B</tspan></text>`;
    svgCircle.innerHTML = s1;

    // construction : vA et vB partent du même point O, Δv relie la pointe de vA à celle de vB
    const ox = 100, oy = 100;
    const Atip = [ox + vA[0] * vScale, oy + vA[1] * vScale];
    const Btip = [ox + vB[0] * vScale, oy + vB[1] * vScale];
    let s2 = `<defs><marker id="${pfxVec}_vArrowA2" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
              <marker id="${pfxVec}_vArrowB2" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker>
              <marker id="${pfxVec}_dvArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker></defs>`;
    s2 += `<circle cx="${ox}" cy="${oy}" r="3" fill="var(--chalk)"/>`;
    s2 += `<line x1="${ox}" y1="${oy}" x2="${Atip[0]}" y2="${Atip[1]}" stroke="var(--coral)" stroke-width="2.2" marker-end="url(#${pfxVec}_vArrowA2)"/>`;
    s2 += `<text x="${Atip[0] - 14}" y="${Atip[1] - 6}" font-size="10" fill="var(--coral)">v<tspan font-size="7" dy="2">A</tspan></text>`;
    s2 += `<line x1="${ox}" y1="${oy}" x2="${Btip[0]}" y2="${Btip[1]}" stroke="var(--teal)" stroke-width="2.2" marker-end="url(#${pfxVec}_vArrowB2)"/>`;
    s2 += `<text x="${Btip[0] + 6}" y="${Btip[1] - 6}" font-size="10" fill="var(--teal)">v<tspan font-size="7" dy="2">B</tspan></text>`;
    s2 += `<line x1="${Atip[0]}" y1="${Atip[1]}" x2="${Btip[0]}" y2="${Btip[1]}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfxVec}_dvArrow)"/>`;
    const midx = (Atip[0] + Btip[0]) / 2, midy = (Atip[1] + Btip[1]) / 2;
    s2 += `<text x="${midx}" y="${midy - 8}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">Δv</text>`;
    svgVec.innerHTML = s2;

    readout.innerHTML = `A et B avancent ensemble le long de la trajectoire, à écart de temps constant : la direction du vecteur vitesse change en permanence, donc <strong style="color:var(--coral)"><span class="vec">Δv</span> = <span class="vec">v<sub>B</sub></span> − <span class="vec">v<sub>A</sub></span> n'est jamais le vecteur nul</strong>.`;
  }

  makePausableAnimation(svgCircle, frame);
}

/* ---------- 3. ΣF et Δv, pas à pas (chute libre / mouvement circulaire) ---------- */
function initForceScenarioSteps(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const btnFall = document.getElementById(cfg.btnFallId);
  const btnCirc = document.getElementById(cfg.btnCircId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);
  const pfx = cfg.svgId;

  const cx = 110, cy = 100;
  const defs = `<defs>
    <marker id="${pfx}_sfArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--coral)"/></marker>
    <marker id="${pfx}_dvArrow2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
  </defs>`;

  const STEPS_TEXT = {
    fall: [
      "Étape 1 — Les forces en présence : seul le poids <span class=\"vec\">P</span> s'exerce sur la balle → <span class=\"vec\">ΣF</span> = <span class=\"vec\">P</span>.",
      "Étape 2 — Le mouvement : la balle tombe verticalement, en accélérant, en suivant la direction du vecteur <span class=\"vec\">ΣF</span>.",
      "Étape 3 — Le mouvement est accéléré : le vecteur <span class=\"vec\">Δv</span> grandit avec le temps, mais reste colinéaire à <span class=\"vec\">ΣF</span> et de même sens."
    ],
    circular: [
      "Étape 1 — Les forces en présence : la Terre subit la force d'attraction gravitationnelle du Soleil, dirigée vers le centre → <span class=\"vec\">ΣF</span> pointe vers le centre.",
      "Étape 2 — Le mouvement : la Terre parcourt une trajectoire circulaire — contrairement à la chute libre, cette trajectoire n'est pas alignée avec <span class=\"vec\">ΣF</span>.",
      "Étape 3 — Le mouvement est uniforme (vitesse de valeur constante) : le vecteur <span class=\"vec\">Δv</span> garde une longueur constante, mais tourne avec la balle — toujours colinéaire à <span class=\"vec\">ΣF</span>, vers le centre."
    ]
  };

  let scenario = "fall", step = 1, startTime = null;

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
    s += `<line x1="${cx - 10}" y1="${y + 12}" x2="${cx - 10}" y2="${y + 45}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#${pfx}_sfArrow)"/>`;
    s += `<text x="${cx - 10}" y="${y + 58}" font-size="10" fill="var(--coral)" text-anchor="middle">ΣF</text>`;
    if (showV) {
      const vLen = Math.min(60, v * 0.7);
      s += `<line x1="${cx + 10}" y1="${y + 12}" x2="${cx + 10}" y2="${y + 12 + vLen}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfx}_dvArrow2)"/>`;
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
    s += `<line x1="${px}" y1="${py}" x2="${fEndX}" y2="${fEndY}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#${pfx}_sfArrow)"/>`;
    s += `<text x="${fEndX + ux * 12}" y="${fEndY + uy * 12}" font-size="10" fill="var(--coral)">ΣF</text>`;

    if (showV) {
      // Δv : même direction (vers le centre), longueur CONSTANTE (mouvement uniforme),
      // légèrement décalé de ΣF pour rester visible à côté
      const perpX = -uy * 8, perpY = ux * 8;
      s += `<line x1="${px + perpX}" y1="${py + perpY}" x2="${px + perpX + ux * 40}" y2="${py + perpY + uy * 40}" stroke="var(--yellow)" stroke-width="2.2" marker-end="url(#${pfx}_dvArrow2)"/>`;
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
  makePausableAnimation(svg, frame);
}

/* ---------- 3b. Le rôle de la masse ---------- */
function initForceMassRole(cfg) {
  const svg = document.getElementById(cfg.svgMassId);
  const massRange = document.getElementById(cfg.massRangeId);
  const readout = document.getElementById(cfg.massReadoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const pfx = cfg.svgMassId;

  // même mécanique que "Variation de la valeur du vecteur vitesse" : point qui
  // accélère (ou décélère) sur une ligne droite, mais ici c'est la masse qui
  // pilote l'accélération à force ΣF fixée (a = ΣF / m).
  const F_FIXED = 80; // unité arbitraire
  const V0_FIXED = 50; // vitesse initiale FIXE en décélération, la même quelle que soit la masse
  const DURATION = 6.6; // boucle, en secondes — assez long pour laisser les grosses masses finir de s'arrêter
  const y = 100, xStart = 30, xEnd = 210, ARROW_SCALE = 0.3;
  let mode = "accel", startTime = null;

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
    s += `<defs><marker id="${pfx}_mArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${x}" cy="${y}" r="${4 + mass * 0.6}" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 24}" font-size="9" fill="var(--coral)" text-anchor="middle">m = ${mass}</text>`;
    if (arrowLen > 1) {
      s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#${pfx}_mArrow)"/>`;
      s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;
    }

    svg.innerHTML = s;
    const verb = mode === "accel" ? "grandit" : "rétrécit";
    const decelNote = mode === "decel" ? " Le vecteur initial (v₀) est toujours le même : seule la masse change la distance nécessaire pour s'arrêter." : "";
    readout.innerHTML = `<span class="vec">ΣF</span> fixée, m = ${mass} → a = <span class="frac"><span class="num"><span class="vec">ΣF</span></span><span class="den">m</span></span> ≈ <strong style="color:var(--yellow)">${a.toFixed(1)}</strong> — plus la masse est grande, plus le vecteur vitesse ${verb} lentement (elle "résiste" davantage au changement de mouvement).${decelNote}`;
  }

  btnAccel.addEventListener("click", () => { btnAccel.classList.add("active-hist"); btnDecel.classList.remove("active-hist"); mode = "accel"; startTime = null; });
  btnDecel.addEventListener("click", () => { btnDecel.classList.add("active-hist"); btnAccel.classList.remove("active-hist"); mode = "decel"; startTime = null; });
  massRange.addEventListener("input", () => { startTime = null; });
  btnAccel.classList.add("active-hist");
  makePausableAnimation(svg, frame);
}

/* ================================================================== */
/* Partie 2 : animations grand format (diapos et site, largeur 1780)   */
/* ================================================================== */
var CH13_VERSION = 2;
var CH13 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", water: "#5a96d2", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };

function c13$(id) { return id ? document.getElementById(id) : null; }
function c13f(v) { return (+v).toFixed(1); }
function c13fr(v, n) { return (+v).toFixed(n == null ? 2 : n).replace(".", ","); }
function c13op(op) { return op != null ? ' opacity="' + Math.max(0, Math.min(1, op)).toFixed(2) + '"' : ""; }
function c13t(x, y, s, o) {
  o = o || {};
  return '<text x="' + c13f(x) + '" y="' + c13f(y) + '" font-size="' + (o.size || 26) + '" fill="' + (o.fill || CH13.dim) + '" font-family="' + (o.font || CH13.fh) + '" text-anchor="' + (o.anchor || "start") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : "") + c13op(o.op) + '>' + s + '</text>';
}
function c13s(base, sub, size) {
  const d = c13f(size * 0.24);
  return base + '<tspan dy="' + d + '" font-size="' + c13f(size * 0.62) + '">' + sub + '</tspan><tspan dy="-' + d + '">\u200b</tspan>';
}
function c13arrow(x1, y1, x2, y2, col, w, head, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 2) return "";
  const ux = dx / L, uy = dy / L, h = Math.min(head || 20, L), bx = x2 - ux * h, by = y2 - uy * h;
  return '<g' + c13op(op) + '>' + (L > h + 1 ? '<line x1="' + c13f(x1) + '" y1="' + c13f(y1) + '" x2="' + c13f(bx + ux * 2) + '" y2="' + c13f(by + uy * 2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>' : "") +
    '<polygon points="' + c13f(x2) + ',' + c13f(y2) + ' ' + c13f(bx - uy * h * 0.55) + ',' + c13f(by + ux * h * 0.55) + ' ' + c13f(bx + uy * h * 0.55) + ',' + c13f(by - ux * h * 0.55) + '" fill="' + col + '"/></g>';
}
/* grandeur vectorielle dans le SVG : texte + flèche au-dessus. parts = [[base, indice], …] */
function c13v(x, y, parts, o) {
  o = o || {};
  const size = o.size || 34, col = o.fill || CH13.chalk;
  let w = 0, str = "";
  parts.forEach((p) => { w += p[0].length * size * 0.5 + (p[1] ? p[1].length * size * 0.34 : 0); str += p[1] ? c13s(p[0], p[1], size) : p[0]; });
  const a = o.anchor || "start", xs = a === "middle" ? x - w / 2 : a === "end" ? x - w : x, ya = y - size * 0.92;
  return c13t(x, y, str, { size: size, fill: col, anchor: a }) + c13arrow(xs, ya, xs + w + size * 0.12, ya, col, Math.max(2, size * 0.07), size * 0.26);
}
/* grandeur vectorielle en HTML (flèche au-dessus) */
function c13vh(x) {
  return '<span style="position:relative;display:inline-block;line-height:1;padding-top:0.16em;">' + x + '<span style="position:absolute;left:0.04em;right:0.14em;top:0.07em;border-top:0.06em solid currentColor;"></span><span style="position:absolute;right:0;top:0;border-style:solid;border-width:0.1em 0 0.1em 0.18em;border-color:transparent transparent transparent currentColor;"></span></span>';
}
function c13btn(id, fn) {
  const b = c13$(id);
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function c13setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function c13clamp(v) { return Math.max(0, Math.min(1, v)); }
function c13ease(t) { t = c13clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function c13tween(st, dur, onFrame) {
  if (st.raf) cancelAnimationFrame(st.raf);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    onFrame(c13ease(k));
    st.raf = k < 1 ? requestAnimationFrame(step) : 0;
  };
  st.raf = requestAnimationFrame(step);
}
function c13readout(title, body, col) {
  return '<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:40px;color:' + (col || "#e8c468") + ';line-height:1.15;">' + title + '</div><div style="font-size:28px;line-height:1.5;text-wrap:pretty;color:#f2ede1;">' + body + '</div></div>';
}
function c13line(x1, y1, x2, y2, col, w, dash, op) {
  return '<line x1="' + c13f(x1) + '" y1="' + c13f(y1) + '" x2="' + c13f(x2) + '" y2="' + c13f(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + c13op(op) + '/>';
}
function c13dot(x, y, r, fill, op, stroke) {
  return '<circle cx="' + c13f(x) + '" cy="' + c13f(y) + '" r="' + r + '" fill="' + fill + '"' + (stroke ? ' stroke="' + stroke + '" stroke-width="3"' : "") + c13op(op) + '/>';
}
function c13panel() {
  return '<rect x="1130" y="20" width="630" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>';
}
function c13sep(y) { return c13line(1170, y, 1720, y, "rgba(242,237,225,0.16)", 2); }
function c13bar(x, y, w, h, frac, col) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="rgba(242,237,225,0.10)"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + c13f(Math.max(h, w * c13clamp(frac))) + '" height="' + h + '" rx="' + h / 2 + '" fill="' + col + '"/>';
}
function c13steppers(steps, V, LIM, fmt, onChange) {
  function show() {
    Object.keys(steps).forEach((k) => {
      const ids = steps[k], v = c13$(ids[2]), m = c13$(ids[0]), p = c13$(ids[1]);
      if (v) v.textContent = fmt && fmt[k] ? fmt[k](V[k]) : V[k];
      if (m) m.disabled = V[k] <= LIM[k][0] + 1e-9;
      if (p) p.disabled = V[k] >= LIM[k][1] - 1e-9;
    });
  }
  Object.keys(steps || {}).forEach((k) => {
    const ids = steps[k];
    const go = (dir) => {
      const old = V[k];
      V[k] = Math.round(Math.max(LIM[k][0], Math.min(LIM[k][1], V[k] + dir * LIM[k][2])) * 1000) / 1000;
      show();
      if (V[k] !== old) onChange(k, dir);
    };
    c13btn(ids[0], () => go(-1)); c13btn(ids[1], () => go(1));
  });
  show();
}
/* boucle d'animation qui ne dessine que lorsque le SVG est affiché */
function c13loop(svg, fn) {
  const tick = (now) => {
    if (svg.getClientRects().length && !document.hidden) { fn(now); requestAnimationFrame(tick); }
    else setTimeout(() => requestAnimationFrame(tick), 300);
  };
  requestAnimationFrame(tick);
}
/* trajectoire courbe commune (paramètre t en unités de Δt) */
function c13curve(t) { return [90 + 75 * t, 540 - 13 * t * (12 - t)]; }
function c13tan(t) { const d = [75, -13 * (12 - 2 * t)], L = Math.hypot(d[0], d[1]); return [d[0] / L, d[1] / L]; }
function c13curvePath() {
  let d = "";
  for (let t = 0; t <= 12.001; t += 0.1) { const p = c13curve(t); d += (d ? " L" : "M") + c13f(p[0]) + " " + c13f(p[1]); }
  return '<path d="' + d + '" fill="none" stroke="rgba(242,237,225,0.35)" stroke-width="3" stroke-dasharray="10 10"/>';
}
var C13_SF = function () { return c13vh("ΣF"); }, C13_DV = function () { return c13vh("Δv"); };

/* ------------------------------------------------------------------ */
/* 1. Le vecteur vitesse : M_i M_i+1 devient tangent                    */
/* ------------------------------------------------------------------ */
function initCh13Vel(cfg) {
  const svg = c13$(cfg.svgId), readout = c13$(cfg.readoutId);
  if (!svg) return;
  const V = { G: 6 }, LIM = { G: [0.5, 6, 0.5] }, tw = {};
  const T0 = 3, DT = 0.1, PX = 100, KV = 20;
  const tu = c13tan(T0);
  let g = 6;
  function stats(gg) {
    const A = c13curve(T0), B = c13curve(T0 + gg), dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    const u = [dx / L, dy / L];
    const ang = Math.acos(Math.max(-1, Math.min(1, u[0] * tu[0] + u[1] * tu[1]))) * 180 / Math.PI;
    return { A: A, B: B, u: u, ang: ang, d: L / PX, dt: gg * DT, v: L / PX / (gg * DT) };
  }
  function draw() {
    const S = stats(g), A = S.A, B = S.B, u = S.u, n = [-u[1], u[0]];
    let s = c13curvePath();
    for (let k = 0; k <= 12; k++) { const p = c13curve(k); s += c13dot(p[0], p[1], 6, CH13.chalk, 0.4); }
    s += c13line(A[0] - tu[0] * 230, A[1] - tu[1] * 230, A[0] + tu[0] * 200, A[1] + tu[1] * 200, CH13.t, 3, "4 12", 0.85);
    s += c13t(A[0] + tu[0] * 200 + 18, A[1] + tu[1] * 200 + 10, "tangente en M<tspan dy=\"6\" font-size=\"17\">i</tspan>", { size: 28, fill: CH13.t, anchor: "start" });
    const tip = [A[0] + u[0] * S.v * KV, A[1] + u[1] * S.v * KV];
    s += c13arrow(A[0], A[1], tip[0], tip[1], CH13.y, 11, 34);
    s += c13arrow(A[0], A[1], B[0], B[1], CH13.chalk, 3.5, 18);
    s += c13v(tip[0] - n[0] * 40 + u[0] * 10, tip[1] - n[1] * 40 + u[1] * 10, [["v", "i"]], { size: 40, fill: CH13.y, anchor: "middle" });
    s += c13dot(B[0], B[1], 10, CH13.t);
    s += c13t(B[0] + n[0] * 48 + u[0] * 10, B[1] + n[1] * 48 + 10, c13s("M", "i+1", 32), { size: 32, fill: CH13.t, anchor: "middle" });
    s += c13dot(A[0], A[1], 11, CH13.c);
    s += c13t(A[0] - 26, A[1] - 22, c13s("M", "i", 34), { size: 34, fill: CH13.c, anchor: "end" });
    s += c13t(80, 590, "positions enregistrées à intervalles de temps réguliers Δt", { size: 24 });
    s += c13panel();
    s += c13t(1160, 72, "Écart : " + c13fr(g, 1) + " × Δt   (Δt = 0,10 s)", { size: 28 });
    s += c13t(1160, 140, c13s("M", "i", 40) + c13s("M", "i+1", 40) + " = " + c13fr(S.d, 2) + " m", { size: 40, fill: CH13.chalk });
    s += c13t(1160, 200, c13s("t", "i+1", 40) + " − " + c13s("t", "i", 40) + " = " + c13fr(S.dt, 2) + " s", { size: 40, fill: CH13.chalk });
    s += c13sep(240);
    s += c13t(1160, 290, "valeur de la vitesse moyenne", { size: 28 });
    s += c13t(1445, 370, c13s("v", "i", 62) + " ≈ " + c13fr(S.v, 1) + " m·s⁻¹", { anchor: "middle", size: 62, fill: CH13.y });
    s += c13sep(412);
    s += c13t(1160, 462, "angle avec la tangente", { size: 28 });
    s += c13t(1445, 538, "≈ " + Math.round(S.ang) + "°", { anchor: "middle", size: 58, fill: S.ang < 4 ? CH13.t : CH13.c });
    svg.innerHTML = s;
  }
  function text() {
    if (!readout) return;
    const S = stats(V.G), ok = S.ang < 4;
    const T = ok ? "Écart très court : le déplacement est tangent à la trajectoire" : "Écart de " + c13fr(V.G, 1) + " × Δt : le déplacement coupe encore la trajectoire";
    readout.innerHTML = c13readout(T, "Le vecteur vitesse " + c13vh("v") + "<sub>i</sub> (jaune) a la direction et le sens du vecteur déplacement " + c13vh("M<sub>i</sub>M<sub>i+1</sub>") + " (blanc). Sa valeur, " + c13fr(S.v, 1) + " m·s⁻¹, est la vitesse moyenne sur l'intervalle." + (ok ? " Elle est maintenant très proche de la vitesse en M<sub>i</sub>." : " Réduis l'écart pour te rapprocher de la vitesse en M<sub>i</sub>."), ok ? "#6bbfab" : "#e8c468");
  }
  c13steppers(cfg.steppers, V, LIM, { G: (v) => c13fr(v, 1) }, () => {
    const g0 = g;
    c13tween(tw, 550, (e) => { g = g0 + (V.G - g0) * e; draw(); });
    text();
  });
  draw();
  text();
}

/* ------------------------------------------------------------------ */
/* 2. Variation de la valeur du vecteur vitesse (ligne droite)          */
/* ------------------------------------------------------------------ */
function initCh13Speed(cfg) {
  const svg = c13$(cfg.svgId), readout = c13$(cfg.readoutId);
  if (!svg) return;
  const SC = [
    { v0: 800 / 3, a: 0, label: "Vitesse constante" },
    { v0: 100, a: 1000 / 9, label: "Accélération" },
    { v0: 1300 / 3, a: -1000 / 9, label: "Décélération" }
  ];
  const X0 = 100, Y = 370, T = 3, HOLD = 1.2, KA = 0.4, KG = 0.22, MS = 100 / 3, KP = 1.1, OX = 1240;
  let k = 0, start = null;
  const btns = (cfg.modeIds || []).map((id, i) => c13btn(id, () => { k = i; start = null; sync(); text(); }));
  function sync() { btns.forEach((b, i) => c13setBtn(b, i === k)); }
  function frame(now) {
    if (start === null) start = now;
    const sc = SC[k], t = Math.min(T, ((now - start) / 1000) % (T + HOLD));
    const x = X0 + sc.v0 * t + 0.5 * sc.a * t * t, v = sc.v0 + sc.a * t;
    let s = c13line(X0 - 30, Y, X0 + 830, Y, "rgba(242,237,225,0.4)", 3);
    for (let i = 0; i <= 10; i++) {
      const ti = i * 0.3;
      if (ti > t + 1e-6) break;
      const xi = X0 + sc.v0 * ti + 0.5 * sc.a * ti * ti, vi = sc.v0 + sc.a * ti;
      s += c13dot(xi, Y, 8, CH13.chalk, 0.5);
      s += c13arrow(xi, Y - 34, xi + vi * KG, Y - 34, CH13.t, 4, 15, 0.5);
    }
    s += c13arrow(x, Y - 120, x + v * KA, Y - 120, CH13.t, 7, 26);
    s += c13line(x, Y - 104, x, Y - 18, CH13.t, 2, "4 8", 0.6);
    s += c13v(x + v * KA / 2, Y - 150, [["v", ""]], { size: 40, fill: CH13.t, anchor: "middle" });
    s += c13dot(x, Y, 18, CH13.c);
    s += c13t(x, Y + 58, "M", { size: 32, fill: CH13.c, anchor: "middle" });
    s += c13t(70, 490, "trajectoire rectiligne", { size: 28, fill: CH13.chalk });
    s += c13t(70, 530, "chronophotographie : une position et son vecteur vitesse toutes les 0,3 s", { size: 24 });
    s += c13panel();
    s += c13t(1160, 72, "Construction de Δv", { size: 28 });
    const a0 = OX + sc.v0 * KP, a1 = OX + v * KP;
    s += c13v(1165, 152, [["v", "i"]], { size: 38, fill: CH13.c });
    s += c13arrow(OX, 140, a0, 140, CH13.c, 7, 26);
    s += c13v(1165, 252, [["v", ""]], { size: 38, fill: CH13.t });
    s += c13arrow(OX, 240, a1, 240, CH13.t, 7, 26);
    s += c13line(a0, 158, a0, 330, CH13.c, 2, "6 8", 0.7) + c13line(a1, 258, a1, 330, CH13.t, 2, "6 8", 0.7);
    s += c13v(1165, 352, [["Δv", ""]], { size: 38, fill: CH13.y });
    const dv = (v - sc.v0) / MS;
    s += Math.abs(a1 - a0) > 6 ? c13arrow(a0, 340, a1, 340, CH13.y, 7, 26) : c13t(OX + 20, 352, "vecteur nul", { size: 34, fill: CH13.y });
    s += c13sep(400);
    s += c13t(1160, 450, c13s("v", "i", 30) + " = " + c13fr(sc.v0 / MS, 1) + " m·s⁻¹   →   v = " + c13fr(v / MS, 1) + " m·s⁻¹", { size: 30, fill: CH13.chalk });
    s += c13t(1160, 506, "valeur de Δv = " + c13fr(Math.abs(dv), 1) + " m·s⁻¹", { size: 36, fill: CH13.y });
    s += c13t(1160, 556, Math.abs(dv) < 0.05 ? "aucune variation" : dv > 0 ? "Δv dans le sens du mouvement" : "Δv de sens opposé au mouvement", { size: 28, fill: Math.abs(dv) < 0.05 ? CH13.dim : dv > 0 ? CH13.t : CH13.c });
    svg.innerHTML = s;
  }
  function text() {
    if (!readout) return;
    const B = ["la valeur de la vitesse reste constante : le vecteur vitesse ne change pas et " + C13_DV() + " est le vecteur nul.",
      "la valeur de la vitesse augmente : " + C13_DV() + " est dans le sens du mouvement.",
      "la valeur de la vitesse diminue : " + C13_DV() + " est de sens opposé au mouvement."];
    readout.innerHTML = c13readout(SC[k].label, "Le point se déplace en ligne droite : le vecteur vitesse garde la même direction. Ici, " + B[k], ["#6bbfab", "#e8c468", "#d97a63"][k]);
  }
  sync();
  text();
  c13loop(svg, frame);
}

/* ------------------------------------------------------------------ */
/* 3. Construction de Δv (changement de direction)                      */
/* ------------------------------------------------------------------ */
function initCh13DeltaV(cfg) {
  const svg = c13$(cfg.svgId), readout = c13$(cfg.readoutId);
  if (!svg) return;
  const TS = 2.5, TM = 12 - TS, DUR = 8, VS = 150, VC = 190, O = [1445, 300];
  let t0 = 0.8, playing = true, last = null;
  const pb = c13btn(cfg.playId, () => { playing = !playing; pb.textContent = playing ? "⏸ Pause" : "▶ Lecture"; });
  function frame(now) {
    const dt = last === null ? 0 : Math.min(0.05, (now - last) / 1000);
    last = now;
    if (playing) { t0 += dt / DUR * TM; if (t0 > TM) t0 -= TM; }
    const A = c13curve(t0), B = c13curve(t0 + TS), uA = c13tan(t0), uB = c13tan(t0 + TS);
    let s = c13curvePath();
    const Mm = c13curve(t0 + TS / 2), dd = [uB[0] - uA[0], uB[1] - uA[1]], dl = Math.hypot(dd[0], dd[1]);
    if (dl * VS > 12) {
      const e = [Mm[0] + dd[0] * VS, Mm[1] + dd[1] * VS];
      s += c13arrow(Mm[0], Mm[1], e[0], e[1], CH13.y, 6, 22, 0.9);
      s += c13v(e[0] + dd[0] / dl * 34 + 6, e[1] + dd[1] / dl * 34 + 14, [["Δv", ""]], { size: 32, fill: CH13.y, anchor: "middle" });
    }
    s += c13dot(Mm[0], Mm[1], 6, CH13.y);
    s += c13arrow(A[0], A[1], A[0] + uA[0] * VS, A[1] + uA[1] * VS, CH13.c, 6, 24);
    s += c13v(A[0] + uA[0] * (VS + 36), A[1] + uA[1] * (VS + 36) + 14, [["v", "A"]], { size: 36, fill: CH13.c, anchor: "middle" });
    s += c13dot(A[0], A[1], 11, CH13.c) + c13t(A[0] - 18, A[1] + 42, "A", { size: 32, fill: CH13.c, anchor: "end" });
    s += c13arrow(B[0], B[1], B[0] + uB[0] * VS, B[1] + uB[1] * VS, CH13.t, 6, 24);
    s += c13v(B[0] + uB[0] * (VS + 36), B[1] + uB[1] * (VS + 36) + 14, [["v", "B"]], { size: 36, fill: CH13.t, anchor: "middle" });
    s += c13dot(B[0], B[1], 11, CH13.t) + c13t(B[0] - 18, B[1] + 42, "B", { size: 32, fill: CH13.t, anchor: "end" });
    s += c13panel();
    s += c13t(1160, 72, "Construction graphique", { size: 28 });
    const ta = [O[0] + uA[0] * VC, O[1] + uA[1] * VC], tb = [O[0] + uB[0] * VC, O[1] + uB[1] * VC];
    s += c13arrow(O[0], O[1], ta[0], ta[1], CH13.c, 6, 24);
    s += c13arrow(O[0], O[1], tb[0], tb[1], CH13.t, 6, 24);
    s += c13arrow(ta[0], ta[1], tb[0], tb[1], CH13.y, 7, 26);
    s += c13dot(O[0], O[1], 7, CH13.chalk);
    s += c13v(ta[0] + uA[0] * 34 - 30, ta[1] + uA[1] * 34 + 6, [["v", "A"]], { size: 34, fill: CH13.c, anchor: "middle" });
    s += c13v(tb[0] + uB[0] * 34 + 30, tb[1] + uB[1] * 34 + 14, [["v", "B"]], { size: 34, fill: CH13.t, anchor: "middle" });
    const m = [(ta[0] + tb[0]) / 2, (ta[1] + tb[1]) / 2], dm = Math.hypot(m[0] - O[0], m[1] - O[1]) || 1;
    s += c13v(m[0] + (m[0] - O[0]) / dm * 48 + 20, m[1] + (m[1] - O[1]) / dm * 48 + 12, [["Δv", ""]], { size: 38, fill: CH13.y, anchor: "middle" });
    s += c13sep(492);
    s += c13v(1290, 552, [["Δv", ""]], { size: 40, fill: CH13.y }) + c13t(1365, 552, "=", { size: 40, fill: CH13.chalk });
    s += c13v(1410, 552, [["v", "B"]], { size: 40, fill: CH13.t }) + c13t(1490, 552, "−", { size: 40, fill: CH13.chalk });
    s += c13v(1535, 552, [["v", "A"]], { size: 40, fill: CH13.c });
    svg.innerHTML = s;
  }
  if (readout) readout.innerHTML = c13readout("Même valeur, direction différente : Δv n'est pas nul", "A et B avancent ensemble le long de la trajectoire, à écart de temps constant. La direction du vecteur vitesse change en permanence, donc " + C13_DV() + " = " + c13vh("v") + "<sub>B</sub> − " + c13vh("v") + "<sub>A</sub> n'est jamais le vecteur nul. Reporté sur la trajectoire (jaune), il pointe vers l'intérieur de la courbe.");
  c13loop(svg, frame);
}

/* ------------------------------------------------------------------ */
/* 4. ΣF et Δv, pas à pas (chute libre / mouvement circulaire)          */
/* ------------------------------------------------------------------ */
function initCh13Force(cfg) {
  const svg = c13$(cfg.svgId), readout = c13$(cfg.readoutId), stepEl = c13$(cfg.stepId);
  if (!svg) return;
  let sc = 0, step = 1, start = null;
  const NAMES = ["Les forces en présence", "Le mouvement", "Le vecteur variation de vitesse"];
  const TXT = [
    ["Seul le poids " + c13vh("P") + " s'exerce sur la balle : " + C13_SF() + " = " + c13vh("P") + ".",
      "La balle tombe verticalement en accélérant, dans la direction et le sens de " + C13_SF() + ".",
      "La vitesse augmente régulièrement : sur des durées Δt égales, " + C13_DV() + " est le même, vertical vers le bas, colinéaire à " + C13_SF() + " et de même sens."],
    ["La Terre subit la force d'attraction gravitationnelle du Soleil, dirigée vers le centre : " + C13_SF() + " pointe vers le centre.",
      "La Terre parcourt une trajectoire circulaire. Contrairement à la chute libre, cette trajectoire n'est pas alignée avec " + C13_SF() + ".",
      "Le mouvement est uniforme : " + C13_DV() + " garde une longueur constante et tourne avec la Terre, toujours colinéaire à " + C13_SF() + " et dirigé vers le centre."]
  ];
  const bF = c13btn(cfg.fallId, () => { sc = 0; step = 1; render(); });
  const bC = c13btn(cfg.circId, () => { sc = 1; step = 1; render(); });
  const bP = c13btn(cfg.prevId, () => { if (step > 1) { step--; render(); } });
  const bN = c13btn(cfg.nextId, () => { if (step < 3) { step++; render(); } });
  function render() {
    c13setBtn(bF, sc === 0); c13setBtn(bC, sc === 1);
    if (bP) bP.disabled = step === 1;
    if (bN) bN.disabled = step === 3;
    if (stepEl) stepEl.textContent = "Étape " + step + " / 3";
    start = null;
    if (readout) readout.innerHTML = c13readout("Étape " + step + " — " + NAMES[step - 1], TXT[sc][step - 1], step === 3 ? "#e8c468" : "#6bbfab");
  }
  function fall(t) {
    const X = 560, Y0 = 50, Y1 = 470, G = 300, TF = Math.sqrt(2 * (Y1 - Y0) / G), KV = 0.22, DT = 0.25;
    const tt = step === 1 ? 0 : Math.min(TF, t % (TF + 1));
    const y = Y0 + 0.5 * G * tt * tt, v = G * tt;
    let s = c13line(X, 20, X, 580, "rgba(242,237,225,0.28)", 2, "6 10");
    if (step >= 2) for (let k = 1; k * DT < tt - 0.02; k++) {
      const tk = k * DT, yk = Y0 + 0.5 * G * tk * tk;
      s += c13dot(X, yk, 22, CH13.chalk, 0.16);
      s += c13arrow(X + 40, yk, X + 40, yk + G * tk * KV, CH13.chalk, 3, 14, 0.4);
    }
    s += c13arrow(X - 50, y, X - 50, y + 130, CH13.c, 7, 26);
    s += c13v(X - 74, y + 100, [["ΣF", ""]], { size: 38, fill: CH13.c, anchor: "end" });
    s += c13t(X - 74, y + 140, "(poids)", { size: 26, fill: CH13.c, anchor: "end" });
    if (step >= 2 && v * KV > 16) {
      s += c13arrow(X + 40, y, X + 40, y + v * KV, CH13.chalk, 5, 20);
      s += c13v(X + 64, y + v * KV - 4, [["v", ""]], { size: 34, fill: CH13.chalk });
    }
    if (step === 3) {
      const L = 120;
      s += c13arrow(X + 150, y, X + 150, y + L, CH13.y, 7, 26);
      s += c13v(X + 176, y + L / 2 + 12, [["Δv", ""]], { size: 38, fill: CH13.y });
      s += c13t(X + 176, y + L / 2 + 50, "même Δv à chaque Δt", { size: 24, fill: CH13.y });
    }
    s += c13dot(X, y, 24, CH13.chalk);
    s += c13t(X - 40, y - 30, "balle", { size: 28, anchor: "end" });
    return s;
  }
  function circ(t) {
    const C = [575, 300], R = 205, W = 0.7;
    const a = -Math.PI / 2 - (step === 1 ? 0 : W * t);
    const p = [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)], ui = [-Math.cos(a), -Math.sin(a)], n = [-ui[1], ui[0]];
    let s = "";
    if (step >= 2) s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" fill="none" stroke="rgba(242,237,225,0.3)" stroke-width="3" stroke-dasharray="10 10"/>';
    s += c13dot(C[0], C[1], 36, "rgba(232,196,104,0.28)", null, CH13.y) + c13t(C[0], C[1] + 76, "Soleil", { size: 26, anchor: "middle" });
    s += c13arrow(p[0] - n[0] * 16, p[1] - n[1] * 16, p[0] - n[0] * 16 + ui[0] * 120, p[1] - n[1] * 16 + ui[1] * 120, CH13.c, 7, 26);
    s += c13v(p[0] - n[0] * 54 + ui[0] * 96, p[1] - n[1] * 54 + ui[1] * 96 + 14, [["ΣF", ""]], { size: 36, fill: CH13.c, anchor: "middle" });
    if (step === 3) {
      s += c13arrow(p[0] + n[0] * 16, p[1] + n[1] * 16, p[0] + n[0] * 16 + ui[0] * 120, p[1] + n[1] * 16 + ui[1] * 120, CH13.y, 7, 26);
      s += c13v(p[0] + n[0] * 54 + ui[0] * 96, p[1] + n[1] * 54 + ui[1] * 96 + 14, [["Δv", ""]], { size: 36, fill: CH13.y, anchor: "middle" });
    }
    if (step >= 2) {
      const u = [Math.sin(a), -Math.cos(a)];
      s += c13arrow(p[0], p[1], p[0] + u[0] * 130, p[1] + u[1] * 130, CH13.chalk, 4, 20, 0.85);
      s += c13v(p[0] + u[0] * 160, p[1] + u[1] * 160 + 12, [["v", ""]], { size: 34, fill: CH13.chalk, anchor: "middle" });
    }
    s += c13dot(p[0], p[1], 20, CH13.water) + c13t(p[0] - ui[0] * 50, p[1] - ui[1] * 50 + 10, "Terre", { size: 26, anchor: "middle", fill: CH13.chalk });
    return s;
  }
  function frame(now) {
    if (start === null) start = now;
    const t = (now - start) / 1000;
    let s = sc === 0 ? fall(t) : circ(t);
    s += c13panel();
    s += c13t(1160, 72, (sc === 0 ? "Chute libre" : "Mouvement circulaire") + " · étape " + step + " / 3", { size: 28 });
    s += c13t(1445, 160, NAMES[step - 1].replace("Le vecteur variation de vitesse", "Variation de vitesse"), { anchor: "middle", size: 44, fill: CH13.chalk });
    s += c13sep(205);
    s += c13v(1262, 312, [["ΣF", ""]], { size: 46 }) + c13t(1338, 312, "= m ×", { size: 46, fill: CH13.chalk });
    s += c13v(1548, 282, [["Δv", ""]], { size: 42, anchor: "middle" }) + c13line(1500, 298, 1596, 298, CH13.chalk, 3) + c13t(1548, 346, "Δt", { size: 42, anchor: "middle", fill: CH13.chalk });
    s += c13sep(396);
    if (step === 3) {
      s += c13t(1445, 456, "✓ colinéaires", { anchor: "middle", size: 40, fill: CH13.t });
      s += c13t(1445, 512, "✓ de même sens", { anchor: "middle", size: 40, fill: CH13.t });
    } else if (step === 1) {
      s += c13t(1445, 476, sc === 0 ? "une seule force : le poids" : "une seule force : l'attraction du Soleil", { anchor: "middle", size: 32, fill: CH13.c });
    } else {
      s += c13t(1445, 476, sc === 0 ? "chute verticale, de plus en plus rapide" : "trajectoire circulaire, vitesse de valeur constante", { anchor: "middle", size: 30, fill: CH13.chalk });
    }
    s += c13t(1445, 562, "ΣF en N · m en kg · Δv en m·s⁻¹ · Δt en s", { anchor: "middle", size: 22 });
    svg.innerHTML = s;
  }
  render();
  c13loop(svg, frame);
}

/* ------------------------------------------------------------------ */
/* 5. Le rôle de la masse (inertie)                                     */
/* ------------------------------------------------------------------ */
function initCh13Mass(cfg) {
  const svg = c13$(cfg.svgId), readout = c13$(cfg.readoutId);
  if (!svg) return;
  const V = { M: 2 }, LIM = { M: [1, 10, 1] };
  const F = 3, PXM = 80, X0 = 110, X1 = 980, LOOP = 8, V0 = 3, KA = 0.2;
  let mode = 0, start = null;
  const bt = (cfg.modeIds || []).map((id, i) => c13btn(id, () => { mode = i; start = null; sync(); text(); }));
  function sync() { bt.forEach((b, i) => c13setBtn(b, i === mode)); }
  function lane(m, t) {
    const a = F / m * PXM;
    let x, v;
    if (mode === 0) { x = X0 + 0.5 * a * t * t; v = a * t; }
    else {
      const v0 = V0 * PXM, ts = v0 / a;
      if (t < ts) { x = X0 + v0 * t - 0.5 * a * t * t; v = v0 - a * t; } else { x = X0 + v0 * v0 / (2 * a); v = 0; }
    }
    if (x >= X1) { x = X1; v = 0; }
    return { x: x, v: v };
  }
  function drawLane(m, y, t, label, main) {
    const L = lane(m, t), r = 10 + m * 2.4, dir = mode === 0 ? 1 : -1;
    let s = c13line(X0 - 40, y, X1 + 40, y, "rgba(242,237,225,0.4)", 3);
    s += c13t(60, y - 92, label, { size: main ? 32 : 28, fill: main ? CH13.chalk : CH13.dim });
    const fx = L.x + dir * (r + 90);
    s += c13arrow(L.x, y, fx, y, CH13.c, 6, 24);
    s += c13v(fx, y + 50, [["ΣF", ""]], { size: 32, fill: CH13.c, anchor: "middle" });
    if (L.v * KA > 3) {
      s += c13arrow(L.x, y - r - 26, L.x + L.v * KA, y - r - 26, CH13.y, 6, 22);
      s += c13v(L.x - 14, y - r - 14, [["v", ""]], { size: 32, fill: CH13.y, anchor: "end" });
    }
    s += c13dot(L.x, y, r, main ? CH13.c : "rgba(217,122,99,0.55)");
    return s;
  }
  function frame(now) {
    if (start === null) start = now;
    const t = ((now - start) / 1000) % LOOP;
    let s = drawLane(1, 200, t, "référence : m = 1 kg", false);
    s += drawLane(V.M, 450, t, "système étudié : m = " + V.M + " kg", true);
    s += c13panel();
    s += c13t(1160, 72, "Même somme des forces", { size: 28 });
    s += c13v(1300, 150, [["ΣF", ""]], { size: 44, fill: CH13.c }) + c13t(1375, 150, "= 3,0 N", { size: 44, fill: CH13.chalk });
    s += c13sep(196);
    s += c13t(1160, 246, "pendant Δt = 1,0 s :", { size: 28 });
    s += c13t(1445, 306, "Δv = ΣF × Δt / m", { anchor: "middle", size: 40, fill: CH13.chalk });
    const dv = F / V.M;
    s += c13t(1160, 372, "m = 1 kg", { size: 30 }) + c13t(1730, 372, "Δv = 3,0 m·s⁻¹", { size: 30, anchor: "end" });
    s += c13bar(1160, 390, 570, 16, 1, "rgba(232,196,104,0.45)");
    s += c13t(1160, 462, "m = " + V.M + " kg", { size: 36, fill: CH13.chalk }) + c13t(1730, 462, "Δv = " + c13fr(dv, dv < 1 ? 2 : 1) + " m·s⁻¹", { size: 36, anchor: "end", fill: CH13.y });
    s += c13bar(1160, 482, 570, 20, dv / 3, CH13.y);
    s += c13t(1445, 560, V.M > 1 ? "masse × " + V.M + "  →  Δv ÷ " + V.M : "même masse : même Δv", { anchor: "middle", size: 32, fill: CH13.t });
    svg.innerHTML = s;
  }
  function text() {
    if (!readout) return;
    const m = V.M;
    const T = m === 1 ? "m = 1 kg : même mouvement que la référence" : "Masse " + m + " fois plus grande : Δv " + m + " fois plus petit";
    const extra = mode === 0 ? " Ici, le système le plus massif accélère moins vite." : " Même vitesse initiale (3,0 m·s⁻¹) : le système le plus massif met plus longtemps à s'arrêter.";
    readout.innerHTML = c13readout(T, "À somme des forces " + C13_SF() + " égale, plus la masse est grande, plus la variation de vitesse est petite : le système « résiste » davantage au changement de mouvement." + extra);
  }
  c13steppers(cfg.steppers, V, LIM, null, () => { start = null; text(); });
  sync();
  text();
  c13loop(svg, frame);
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh13Stages() {
  document.querySelectorAll(".ch13-stage").forEach((outer) => {
    const inner = outer.firstElementChild;
    if (!inner || outer.__fit) return;
    outer.__fit = true;
    let lastS = -1, lastH = -1;
    const fit = () => {
      const s = outer.clientWidth / 1780;
      if (!s) return;
      const hgt = Math.round(inner.offsetHeight * s);
      if (s !== lastS) { lastS = s; inner.style.transform = "scale(" + s + ")"; }
      if (hgt !== lastH) { lastH = hgt; outer.style.height = hgt + "px"; }
    };
    new ResizeObserver(fit).observe(inner);
    fit();
    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    document.querySelectorAll(".mode-tab").forEach((b) => b.addEventListener("click", () => setTimeout(fit, 0)));
  });
}
