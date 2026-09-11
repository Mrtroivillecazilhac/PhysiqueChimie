/* Animations du chapitre 4 — 2nde — "Description des mouvements" */

/* ---------- 0. Utilitaire : boucle requestAnimationFrame pilotée par la visibilité ---------- */
/* Suspend automatiquement une animation quand son SVG n'est plus affiché (onglet
   "Cours" / "Entraînement" masqué par mode-tabs, ou simplement scrollé hors
   écran), et la relance dès qu'il redevient visible. */
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

/* ---------- 1. Types de trajectoire ---------- */
function initTrajectoryTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLine = document.getElementById(cfg.btnLineId);
  const btnCircle = document.getElementById(cfg.btnCircleId);
  const btnCurvy = document.getElementById(cfg.btnCurvyId);

  let mode = "line";

  function draw() {
    let path, points;
    if (mode === "line") {
      path = "M30,150 L200,60";
      points = [[30, 150], [72, 128], [114, 105], [156, 83], [200, 60]];
    } else if (mode === "circle") {
      const cx = 115, cy = 150, r = 90;
      path = `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx},${cy - r}`;
      points = [0, 0.25, 0.5, 0.75, 1].map(t => {
        const a = Math.PI - t * Math.PI / 2;
        return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
      });
    } else {
      path = "M20,160 Q70,20 115,110 T210,50";
      // Points calculés exactement sur le path (2 courbes de Bézier
      // quadratiques : M20,160→Q70,20→115,110 puis 115,110→160,200→210,50,
      // le second point de contrôle étant le symétrique du premier via T) —
      // évalués à t = 0, 0.25, 0.5, 0.75, 1 le long du path complet.
      points = [[20, 160], [68.75, 77.5], [115, 110], [161.25, 140], [210, 50]];
    }

    let s = `<path d="${path}" fill="none" stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="4,3"/>`;
    points.forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--teal)"/>`;
      s += `<text x="${x}" y="${y - 9}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">M${i + 1}</text>`;
    });
    svg.innerHTML = s;

    const texts = {
      line: "Mouvement rectiligne : la trajectoire est une portion de droite.",
      circle: "Mouvement circulaire : la trajectoire est une portion de cercle.",
      curvy: "Mouvement curviligne : la trajectoire n'est ni une droite, ni un cercle."
    };
    readout.textContent = texts[mode];
  }
  btnLine.addEventListener("click", () => { mode = "line"; draw(); });
  btnCircle.addEventListener("click", () => { mode = "circle"; draw(); });
  btnCurvy.addEventListener("click", () => { mode = "curvy"; draw(); });
  draw();
}

/* ---------- 2. Vecteur déplacement (indépendant de la trajectoire) ---------- */
function initDisplacementVector(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btn1 = document.getElementById(cfg.btn1Id);
  const btn2 = document.getElementById(cfg.btn2Id);
  const pfx = cfg.svgId;

  let mode = "traj1";
  const M = [40, 150], Mp = [190, 60];

  function draw() {
    const path1 = `M${M[0]},${M[1]} C90,40 140,180 ${Mp[0]},${Mp[1]}`;
    const path2 = `M${M[0]},${M[1]} C60,190 190,190 ${Mp[0]},${Mp[1]}`;
    let s = `<defs><marker id="${pfx}_dvArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<path d="${mode === 'traj1' ? path1 : path2}" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="4,3"/>`;
    s += `<line x1="${M[0]}" y1="${M[1]}" x2="${Mp[0]}" y2="${Mp[1]}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfx}_dvArrow)"/>`;
    s += `<circle cx="${M[0]}" cy="${M[1]}" r="4.5" fill="var(--chalk)"/>`;
    s += `<circle cx="${Mp[0]}" cy="${Mp[1]}" r="4.5" fill="var(--chalk)"/>`;
    s += `<text x="${M[0] - 10}" y="${M[1] + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    s += `<text x="${Mp[0] + 10}" y="${Mp[1] - 6}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M'</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Que le système suive la trajectoire ${mode === 'traj1' ? '1' : '2'} entre M et M', le vecteur déplacement <span class="vec">MM'</span> (en jaune) reste exactement le même.`;
  }
  btn1.addEventListener("click", () => { mode = "traj1"; draw(); });
  btn2.addEventListener("click", () => { mode = "traj2"; draw(); });
  draw();
}

/* ---------- 3. Calculateur de vitesse moyenne ---------- */
function initAverageVelocity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const tRange = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const pfx = cfg.svgId;

  function draw() {
    const d = Number(dRange.value); // m
    const t = Number(tRange.value); // s
    const v = t > 0 ? d / t : 0;

    const x0 = 20, y0 = 90, maxLen = 190;
    const len = Math.min(maxLen, (d / 30) * maxLen);
    let s = `<defs><marker id="${pfx}_avArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0 + len}" y2="${y0}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#${pfx}_avArrow)"/>`;
    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--chalk)"/>`;
    s += `<text x="${x0}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    s += `<text x="${x0 + len}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M'</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `<span class="vec">v<sub>moy</sub></span> = <span class="frac"><span class="num"><span class="vec">MM'</span></span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${d} m</span><span class="den">${t} s</span></span> = <strong style="color:var(--yellow)">${v.toFixed(1)} m/s</strong>`;
  }
  dRange.addEventListener("input", draw);
  tRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Vecteur vitesse en un point (tangence) ---------- */
/* Même logique que initVelocityVector en 1ère spé : trajectoire parabolique
   fluide, slider temporel explicite, vecteur déplacement MM' (qui devient
   tangent) affiché en parallèle du vecteur vitesse v (longueur étalonnée,
   fixe). Adapté au niveau 2nde : pas d'indices M_i/M_i+1, on garde les
   notations M / M' utilisées dans tout le reste du chapitre. Le point se
   déplace aussi réellement de M à M' à l'écran, en un temps d'autant plus
   long que l'écart Δt choisi est grand — pour rendre concret le lien entre
   « Δt » et « durée du trajet », qui restait abstrait sur un simple schéma
   statique. */
function initVelocityTangent(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const gapRange = document.getElementById(cfg.gapRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const formulaEl = cfg.formulaId ? document.getElementById(cfg.formulaId) : null;
  const btnPlay = cfg.btnPlayId ? document.getElementById(cfg.btnPlayId) : null;
  const pfx = cfg.svgId;

  // trajectoire parabolique (arc de type "tir"), allant du sol au sol
  function pos(t) { return [25 + 15 * t, 190 - 2 * t * (12 - t)]; }

  const T0 = 5;
  let playRafId = null;

  // movingT : position (en paramètre t de la trajectoire) du point mobile
  // pendant la démonstration animée ; null = pas d'animation en cours, on
  // affiche juste le schéma statique (M, M', les deux vecteurs).
  function render(movingT) {
    const gap = Number(gapRange.value) / 10; // écart temporel, en unités de Δt (0.2 à 6.0)
    const [x0, y0] = pos(T0);
    const [x1, y1] = pos(T0 + gap);

    let s = "";
    // trajectoire complète, en pointillé fin
    let path = `M${pos(0)[0]} ${pos(0)[1]}`;
    for (let t = 0.5; t <= 12; t += 0.5) path += ` L${pos(t)[0]} ${pos(t)[1]}`;
    s += `<path d="${path}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;

    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    s += `<defs>
      <marker id="${pfx}_dispArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk)"/></marker>
      <marker id="${pfx}_vArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
    </defs>`;

    // vecteur déplacement MM', en blanc — c'est lui qui devient tangent
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--chalk)" stroke-width="2" marker-end="url(#${pfx}_dispArrow)"/>`;
    s += `<circle cx="${x1}" cy="${y1}" r="4" fill="var(--teal)"/>`;
    s += `<text x="${x1 + ux * 10}" y="${y1 + uy * 10}" font-size="9" fill="var(--teal)" text-anchor="middle">M'</text>`;

    // vecteur vitesse, en jaune — même direction, longueur FIXE (échelle
    // indépendante de la position de M', ne s'arrête pas forcément dessus)
    const V_SCALE = 50;
    const vx = x0 + ux * V_SCALE, vy = y0 + uy * V_SCALE;
    s += `<line x1="${x0}" y1="${y0}" x2="${vx}" y2="${vy}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfx}_vArrow)"/>`;
    s += `<text x="${vx + ux * 14}" y="${vy + uy * 14}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--coral)"/><text x="${x0 - 10}" y="${y0 + 4}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;

    // point mobile : parcourt réellement MM' pendant la démonstration animée
    if (movingT !== null) {
      const [mx, my] = pos(movingT);
      s += `<circle cx="${mx}" cy="${my}" r="6.5" fill="none" stroke="var(--chalk)" stroke-width="2"/>`;
      s += `<circle cx="${mx}" cy="${my}" r="2.2" fill="var(--chalk)"/>`;
    }

    svg.innerHTML = s;

    const isTangent = gap < 0.6;
    readout.innerHTML = `Écart temporel = ${gap.toFixed(1)} × Δt → le <strong style="color:var(--chalk)">vecteur déplacement <span class="vec">MM'</span></strong> ${isTangent ? 'est maintenant tangent à la trajectoire' : 'coupe encore la trajectoire'}. Le <strong style="color:var(--yellow)">vecteur vitesse <span class="vec">v</span></strong> a cette même direction, mais une longueur fixe (échelle indépendante). Regarde aussi le point (cercle blanc) parcourir M→M' : plus l'écart est grand, plus le trajet prend de temps.`;

    if (formulaEl) {
      formulaEl.innerHTML = `<span class="vec">v</span> = <span class="frac"><span class="num"><span class="vec">MM'</span></span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${len.toFixed(0)} m</span><span class="den">${gap.toFixed(1)} Δt</span></span>`;
    }
  }

  function draw() { render(null); } // mise à jour statique, pendant qu'on fait glisser le curseur

  // démonstration animée : le point met réellement plus ou moins de temps
  // (à l'écran) à parcourir M→M' selon l'écart Δt choisi
  function playMotion() {
    if (playRafId !== null) { cancelAnimationFrame(playRafId); playRafId = null; }
    const gap = Number(gapRange.value) / 10;
    const DURATION = 150 + gap * 220; // ms — un Δt plus grand prend plus de temps à l'écran
    const startTs = Date.now();

    function step() {
      const progress = Math.min(1, (Date.now() - startTs) / DURATION);
      render(T0 + gap * progress);
      if (progress < 1) {
        playRafId = requestAnimationFrame(step);
      } else {
        playRafId = null;
        render(null); // fin de la démonstration : retour au schéma statique
      }
    }
    playRafId = requestAnimationFrame(step);
  }

  gapRange.addEventListener("input", draw);   // retour visuel immédiat pendant le glissement
  gapRange.addEventListener("change", playMotion); // relâchement du curseur → on rejoue le trajet
  if (btnPlay) btnPlay.addEventListener("click", playMotion);

  playMotion(); // petite démonstration dès le chargement
}

/* ---------- 5. Nature du mouvement (accéléré / décéléré / uniforme) ---------- */
/* Animation continue (inspirée de initSpeedVariation en 1ère spé) : une bille
   traverse la piste, avec son vecteur vitesse v qui grandit ou rétrécit en
   direct. Un bouton "points fantômes" active un affichage type
   chronophotographie : des points sont déposés à intervalles de temps Δt
   égaux pour visualiser l'écartement (accéléré) ou le resserrement
   (décéléré) des positions successives. */
function initMotionNature(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const btnUniform = document.getElementById(cfg.btnUniformId);
  const btnGhost = cfg.ghostToggleId ? document.getElementById(cfg.ghostToggleId) : null;
  const pfx = cfg.svgId;

  // x(t) = x0 + v0.t + 0,5.a.t² ; v(t) = v0 + a.t — chaque scénario est
  // calibré pour traverser exactement la piste (20 → 210 px) en durée T
  const SCENARIOS = {
    accel: { v0: 20, a: 60.3, T: 2.2, verb: "augmente", label: "Mouvement accéléré" },
    decel: { v0: 152.7, a: -60.3, T: 2.2, verb: "diminue", label: "Mouvement décéléré" },
    uniform: { v0: 86.4, a: 0, T: 2.2, verb: "reste la même", label: "Mouvement uniforme" }
  };
  const GHOST_NOTES = {
    accel: " Les points fantômes, déposés à intervalles de temps Δt égaux, s'écartent de plus en plus.",
    decel: " Les points fantômes, déposés à intervalles de temps Δt égaux, se resserrent de plus en plus.",
    uniform: " Les points fantômes, déposés à intervalles de temps Δt égaux, restent régulièrement espacés."
  };

  const y = 60, xStart = 20, xEnd = 210, ARROW_SCALE = 0.3;
  const N_GHOSTS = 6; // nombre d'intervalles Δt affichés par cycle
  let key = "uniform", showGhosts = false, startTime = null, ghosts = [], lastStepIndex = -1;

  function frame(now) {
    if (startTime === null) { startTime = now; ghosts = []; lastStepIndex = -1; }
    const { v0, a, T, verb, label } = SCENARIOS[key];
    let t = (now - startTime) / 1000;
    if (t >= T) {
      // nouveau cycle : on relance l'horloge et on efface les points fantômes
      startTime = now;
      t = 0;
      ghosts = [];
      lastStepIndex = -1;
    }

    const x = xStart + v0 * t + 0.5 * a * t * t;
    const v = v0 + a * t;
    const arrowLen = v * ARROW_SCALE;

    // chronophotographie : on dépose un point fantôme toutes les T/N_GHOSTS secondes
    const stepIndex = Math.floor(t / (T / N_GHOSTS));
    if (showGhosts && stepIndex > lastStepIndex) {
      lastStepIndex = stepIndex;
      ghosts.push(x);
    }

    let s = `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
    s += `<defs><marker id="${pfx}_mnArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;

    if (showGhosts) {
      ghosts.forEach((gx) => {
        s += `<circle cx="${gx}" cy="${y}" r="3.5" fill="var(--teal)" opacity="0.55"/>`;
      });
    }

    s += `<circle cx="${x}" cy="${y}" r="5" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 22}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;
    s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#${pfx}_mnArrow)"/>`;
    s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    svg.innerHTML = s;

    const ghostNote = showGhosts ? GHOST_NOTES[key] : "";
    readout.innerHTML = `<strong style="color:var(--yellow)">${label}</strong> — la valeur du vecteur vitesse <span class="vec">v</span> ${verb} (v ≈ ${(v / 10).toFixed(1)} m·s⁻¹).${ghostNote}`;
  }

  function setMode(newKey, btn) {
    [btnAccel, btnDecel, btnUniform].forEach(b => b.classList.remove("active-hist"));
    btn.classList.add("active-hist");
    key = newKey;
    startTime = null;
  }

  btnAccel.addEventListener("click", () => setMode("accel", btnAccel));
  btnDecel.addEventListener("click", () => setMode("decel", btnDecel));
  btnUniform.addEventListener("click", () => setMode("uniform", btnUniform));

  if (btnGhost) {
    btnGhost.addEventListener("click", () => {
      showGhosts = !showGhosts;
      btnGhost.classList.toggle("active-hist", showGhosts);
      ghosts = [];
      lastStepIndex = -1;
    });
  }

  btnUniform.classList.add("active-hist");
  makePausableAnimation(svg, frame);
}
