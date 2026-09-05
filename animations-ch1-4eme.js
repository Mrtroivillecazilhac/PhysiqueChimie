/* Animations du chapitre 1 — 4ème — "Constitution de la matière"
   Une animation par sous-partie (a à g). */

/* ---------- a. Les états de la matière — seringue tactile (compressibilité) ---------- */
function initSyringeCompressibility(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  const range = document.getElementById(cfg.rangeId);

  const STATES = {
    solide: {
      name: "Solide", color: "#5a96d2",
      txt: "fixes les unes par rapport aux autres, très proches"
    },
    liquide: {
      name: "Liquide", color: "var(--teal)",
      txt: "proches, mais mobiles les unes par rapport aux autres"
    },
    gaz: {
      name: "Gaz", color: "var(--coral)",
      txt: "éloignées les unes des autres, très mobiles", compress: true
    }
  };
  const keys = ["solide", "liquide", "gaz"];
  let current = "solide";

  const JAM_VALUE = 6; // % de course max toléré pour un état incompressible avant blocage
  const X0 = 45, X1 = 200, YTOP = 30, YBOT = 75; // intérieur du corps de la seringue
  const DOTS = generateDotsInEllipse(10, 0, 0, 1, 1);

  function draw() {
    const st = STATES[current];
    const compress = !!st.compress;
    const requested = Number(range.value);
    const forced = !compress && requested > JAM_VALUE;
    const effective = compress ? requested : Math.min(requested, JAM_VALUE);
    const pistonX = X0 + (effective / 100) * (X1 - X0 - 15);
    const chamberX0 = pistonX, chamberX1 = X1, chamberW = chamberX1 - chamberX0;

    let s = `<style>
      @keyframes syrShake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-3px);} 40%{transform:translateX(3px);} 60%{transform:translateX(-2px);} 80%{transform:translateX(2px);} }
      .syr-jam { animation: syrShake 0.35s ease; }
    </style>`;

    // aiguille
    s += `<rect x="${X1}" y="${(YTOP + YBOT) / 2 - 3}" width="14" height="6" fill="var(--chalk-dim)"/>`;
    // corps de la seringue
    s += `<rect x="${X0}" y="${YTOP}" width="${X1 - X0}" height="${YBOT - YTOP}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    for (let i = 1; i < 4; i++) {
      const gx = X0 + i * (X1 - X0) / 4;
      s += `<line x1="${gx}" y1="${YTOP}" x2="${gx}" y2="${YTOP + 5}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    }

    // chambre + particules
    s += `<rect x="${chamberX0}" y="${YTOP + 2}" width="${chamberW}" height="${YBOT - YTOP - 4}" fill="${st.color}" opacity="0.12"/>`;
    DOTS.forEach(([u, v]) => {
      const rawX = chamberX0 + chamberW / 2 + u * (chamberW / 2 - 6);
      const x = Math.max(chamberX0 + 5, Math.min(chamberX1 - 5, rawX));
      const y = (YTOP + YBOT) / 2 + v * (YBOT - YTOP) / 2 - 4;
      s += `<circle cx="${x}" cy="${y}" r="4" fill="${st.color}"/>`;
    });

    // piston (tige + tête), secoue si l'élève force
    s += `<g class="${forced ? "syr-jam" : ""}">`;
    s += `<rect x="${pistonX - 4}" y="${YTOP - 2}" width="6" height="${YBOT - YTOP + 4}" fill="${forced ? "#e86a5a" : "var(--chalk)"}"/>`;
    s += `<rect x="10" y="${YTOP - 4}" width="${Math.max(0, pistonX - 16)}" height="${YBOT - YTOP + 8}" fill="none" stroke="${forced ? "#e86a5a" : "var(--chalk-dim)"}" stroke-width="1.5"/>`;
    s += `<rect x="2" y="${YTOP - 8}" width="14" height="${YBOT - YTOP + 16}" fill="${forced ? "#e86a5a" : "var(--chalk)"}" opacity="0.85"/>`;
    s += `</g>`;

    if (forced) {
      s += `<text x="${(X0 + X1) / 2}" y="${YBOT + 22}" font-size="8.5" fill="#e86a5a" text-anchor="middle" font-weight="700">Bloqué : ${st.name.toLowerCase()} incompressible !</text>`;
    }

    svg.innerHTML = s;

    if (forced) {
      readout.innerHTML = `<strong style="color:#e86a5a">Impossible !</strong> Un ${st.name.toLowerCase()} est <strong>incompressible</strong> : ses particules sont ${st.txt} — le piston ne peut presque pas bouger.`;
    } else if (compress) {
      const volPct = 100 - effective;
      readout.innerHTML = `<strong style="color:${st.color}">${st.name}</strong> : particules ${st.txt}.<br>Volume occupé : environ <strong style="color:var(--yellow)">${volPct}%</strong> — pousse le piston pour comprimer le gaz !`;
    } else {
      readout.innerHTML = `<strong style="color:${st.color}">${st.name}</strong> : particules ${st.txt}.<br>Essaie de pousser le piston : il reste bloqué, le volume ne change (presque) pas.`;
    }
  }

  range.addEventListener("input", draw);
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- b. Corps purs et mélanges — mini-jeu de tri par glisser-déposer ---------- */
function initSortingGame(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const shuffleBtn = document.getElementById(cfg.shuffleBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);

  svg.style.touchAction = "none";

  const N_EACH = 4;
  const mixZone = { x: 10, y: 8, w: 200, h: 72 };
  const zoneA = { x: 10, y: 92, w: 95, h: 40, type: 0, label: "Ronds bleus" };
  const zoneB = { x: 115, y: 92, w: 95, h: 40, type: 1, label: "Triangles corail" };

  let shapes = [];
  let dragging = null;
  let dragOffset = { x: 0, y: 0 };

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const ctm = svg.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  function shapeMarkup(type, color) {
    return type === 0
      ? `<circle r="8" fill="${color}"/>`
      : `<polygon points="0,-9 -8,7 8,7" fill="${color}"/>`;
  }

  function randomPositions(n) {
    const pts = [];
    let tries = 0;
    while (pts.length < n && tries < 500) {
      tries++;
      const x = mixZone.x + 15 + Math.random() * (mixZone.w - 30);
      const y = mixZone.y + 14 + Math.random() * (mixZone.h - 24);
      if (pts.every(p => Math.hypot(p.x - x, p.y - y) > 22)) pts.push({ x, y });
    }
    while (pts.length < n) pts.push({ x: mixZone.x + 20, y: mixZone.y + 20 });
    return pts;
  }

  function inZone(sh, zone) {
    return sh.x >= zone.x && sh.x <= zone.x + zone.w && sh.y >= zone.y && sh.y <= zone.y + zone.h;
  }

  function buildDOM() {
    const positions = randomPositions(N_EACH * 2);
    shapes = [];
    let idx = 0;
    for (let i = 0; i < N_EACH; i++) { shapes.push({ id: idx, type: 0, color: "var(--teal)", ...positions[idx], sorted: false }); idx++; }
    for (let i = 0; i < N_EACH; i++) { shapes.push({ id: idx, type: 1, color: "var(--coral)", ...positions[idx], sorted: false }); idx++; }
    shapes.forEach(sh => { sh.homeX = sh.x; sh.homeY = sh.y; });

    let s = `<rect x="${mixZone.x}" y="${mixZone.y}" width="${mixZone.w}" height="${mixZone.h}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    s += `<text x="${mixZone.x + mixZone.w / 2}" y="${mixZone.y - 2}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">mélange à trier</text>`;
    s += `<rect x="${zoneA.x}" y="${zoneA.y}" width="${zoneA.w}" height="${zoneA.h}" fill="rgba(74,196,181,0.08)" stroke="var(--teal)" stroke-width="1.5" rx="4"/>`;
    s += `<text x="${zoneA.x + zoneA.w / 2}" y="${zoneA.y + zoneA.h + 9}" font-size="7.5" fill="var(--teal)" text-anchor="middle">${zoneA.label}</text>`;
    s += `<rect x="${zoneB.x}" y="${zoneB.y}" width="${zoneB.w}" height="${zoneB.h}" fill="rgba(232,107,90,0.08)" stroke="var(--coral)" stroke-width="1.5" rx="4"/>`;
    s += `<text x="${zoneB.x + zoneB.w / 2}" y="${zoneB.y + zoneB.h + 9}" font-size="7.5" fill="var(--coral)" text-anchor="middle">${zoneB.label}</text>`;

    shapes.forEach(sh => {
      s += `<g class="sort-shape" data-id="${sh.id}" transform="translate(${sh.x},${sh.y})" style="cursor:grab;">${shapeMarkup(sh.type, sh.color)}</g>`;
    });
    svg.innerHTML = s;

    shapes.forEach(sh => {
      sh.el = svg.querySelector(`.sort-shape[data-id="${sh.id}"]`);
      sh.el.addEventListener("pointerdown", (e) => onDown(e, sh));
    });

    readout.textContent = "Glisse chaque forme dans le bon récipient : ronds d'un côté, triangles de l'autre.";
  }

  function onDown(e, sh) {
    if (sh.sorted) return;
    e.preventDefault();
    dragging = sh;
    sh.el.setPointerCapture(e.pointerId);
    const p = svgPoint(e);
    dragOffset.x = sh.x - p.x; dragOffset.y = sh.y - p.y;
    sh.el.style.cursor = "grabbing";
    sh.el.addEventListener("pointermove", onMove);
    sh.el.addEventListener("pointerup", onUp);
    sh.el.addEventListener("pointercancel", onUp);
  }

  function onMove(e) {
    if (!dragging) return;
    const p = svgPoint(e);
    dragging.x = p.x + dragOffset.x; dragging.y = p.y + dragOffset.y;
    dragging.el.setAttribute("transform", `translate(${dragging.x},${dragging.y})`);
  }

  function onUp(e) {
    if (!dragging) return;
    const sh = dragging;
    sh.el.removeEventListener("pointermove", onMove);
    sh.el.removeEventListener("pointerup", onUp);
    sh.el.removeEventListener("pointercancel", onUp);
    sh.el.style.cursor = "grab";
    dragging = null;

    const correctZone = sh.type === 0 ? zoneA : zoneB;
    const wrongZone = sh.type === 0 ? zoneB : zoneA;
    if (inZone(sh, correctZone)) {
      const slotIndex = shapes.filter(o => o.sorted && o.type === sh.type).length;
      const cols = 4;
      sh.x = correctZone.x + 18 + (slotIndex % cols) * 20;
      sh.y = correctZone.y + 20;
      sh.sorted = true;
      sh.el.setAttribute("transform", `translate(${sh.x},${sh.y})`);
      sh.el.style.cursor = "default";
      checkComplete();
    } else if (inZone(sh, wrongZone)) {
      flashWrong(sh);
      returnHome(sh);
    } else {
      returnHome(sh);
    }
  }

  function returnHome(sh) {
    sh.x = sh.homeX; sh.y = sh.homeY;
    sh.el.setAttribute("transform", `translate(${sh.x},${sh.y})`);
  }

  function flashWrong(sh) {
    const shapeEl = sh.el.firstElementChild;
    shapeEl.setAttribute("fill", "#e86a5a");
    setTimeout(() => shapeEl.setAttribute("fill", sh.color), 300);
  }

  function checkComplete() {
    const remaining = shapes.filter(s => !s.sorted).length;
    readout.innerHTML = remaining === 0
      ? `<strong style="color:var(--yellow)">Bravo ! Tu as séparé le mélange en deux corps purs.</strong>`
      : `Encore ${remaining} forme(s) à trier...`;
  }

  shuffleBtn.addEventListener("click", buildDOM);
  resetBtn.addEventListener("click", buildDOM);
  buildDOM();
}

/* ---------- Fonction partagée : bécher de fusion (bloc solide -> liquide teal) ---------- */
/* p = 0 -> 100% solide (un seul bloc de carrés, aucun liquide)
   p = 1 -> 100% liquide (aucun solide, uniquement le liquide)
   Transition continue : le bloc solide (en haut) rétrécit pendant que le liquide (en bas) grandit,
   sans jamais sauter d'une représentation à une autre.                                          */
function meltBeakerSVG(p, opts) {
  opts = opts || {};
  const x0 = 60, x1 = 160, yTop = 20, yBase = 130;
  const colorSolid = "#5a96d2", colorLiquid = "var(--teal)";
  const fillHSolid = 80, fillHLiquid = 60;

  const totalH = fillHSolid + (fillHLiquid - fillHSolid) * p; // 80 -> 60 (le volume total diminue)
  const liquidH = totalH * p;      // 0 -> 60 : grandit progressivement depuis le bas
  const solidH = totalH - liquidH; // 80 -> 0 : rétrécit progressivement au fur et à mesure

  let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;

  if (liquidH > 0.5) {
    s += `<rect x="${x0 + 3}" y="${yBase - liquidH}" width="${x1 - x0 - 6}" height="${Math.max(0, liquidH - 3)}" fill="${colorLiquid}" opacity="0.35"/>`;
  }
  if (solidH > 0.5) {
    const sy0 = yBase - totalH;   // haut du bloc solide
    const sy1 = yBase - liquidH;  // bas du bloc solide = surface du liquide
    s += `<rect x="${x0 + 3}" y="${sy0}" width="${x1 - x0 - 6}" height="${sy1 - sy0}" fill="${colorSolid}"/>`;
    // quadrillage pour donner l'aspect de carrés/glaçons assemblés (purement visuel)
    const cell = 18;
    for (let gy = sy0 + cell; gy < sy1; gy += cell) {
      s += `<line x1="${x0 + 3}" y1="${gy}" x2="${x1 - 3}" y2="${gy}" stroke="var(--board)" stroke-width="1" opacity="0.5"/>`;
    }
    for (let gx = x0 + 3 + cell; gx < x1 - 3; gx += cell) {
      s += `<line x1="${gx}" y1="${sy0}" x2="${gx}" y2="${sy1}" stroke="var(--board)" stroke-width="1" opacity="0.5"/>`;
    }
  }

  if (opts.massText) {
    s += `<rect x="${(x0 + x1) / 2 - 25}" y="${yBase + 10}" width="50" height="18" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yBase + 23}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">${opts.massText}</text>`;
  }
  return s;
}

/* ---------- c. Changements d'état : masse et volume ---------- */
function initStateChangeMassVolume(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const progressRange = document.getElementById(cfg.progressRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MASS_FIXED = 82.3; // g, comme l'exemple du manuel — ne change jamais

  function draw() {
    const p = Number(progressRange.value) / 100; // 0 = tout solide, 1 = tout liquide
    svg.innerHTML = meltBeakerSVG(p, { massText: `${MASS_FIXED} g` });

    const label = p <= 0 ? "solide" : p >= 1 ? "liquide" : "solide + liquide";
    readout.innerHTML = `État : <strong style="color:var(--yellow)">${label}</strong>. La masse reste <strong style="color:var(--yellow)">${MASS_FIXED} g</strong> tout au long de la fusion (le nombre de particules ne change pas), mais le <strong style="color:var(--teal)">volume diminue</strong> : la distance entre les particules change.`;
  }
  progressRange.addEventListener("input", draw);
  draw();
}

/* ---------- d. Changements d'état et température — chauffage en temps réel ---------- */
function initHeatingCurve(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPure = document.getElementById(cfg.btnPureId);
  const btnMix = document.getElementById(cfg.btnMixId);
  const heatBtn = document.getElementById(cfg.heatBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);
  const meltSvg = document.getElementById(cfg.meltSvgId);

  const TMIN = -10, TFUSION = 0, TMAX = 40;
  const DURATION_MS = 6000;
  const PLATEAU_START = 0.30, PLATEAU_END = 0.65; // palier élargi pour bien le voir

  let mode = "pure";
  let elapsed = 0; // 0..100
  let holding = false;
  let rafId = null;
  let lastTs = null;

  function tempAt(t) { // t dans [0,1]
    if (mode === "pure") {
      if (t < PLATEAU_START) return TMIN + (TFUSION - TMIN) * (t / PLATEAU_START);
      if (t < PLATEAU_END) return TFUSION;
      return TFUSION + (TMAX - TFUSION) * ((t - PLATEAU_END) / (1 - PLATEAU_END));
    }
    const eased = Math.min(1, Math.max(0, t - 0.12 * Math.sin(Math.PI * t)));
    return TMIN + (TMAX - TMIN) * eased;
  }

  function inFusionWindow(t) {
    return mode === "pure" && t >= PLATEAU_START && t < PLATEAU_END;
  }

  // progression de la fonte affichée dans le bécher partagé avec la section c
  function meltProgress(t) {
    if (mode === "pure") {
      if (t < PLATEAU_START) return 0;
      if (t < PLATEAU_END) return (t - PLATEAU_START) / (PLATEAU_END - PLATEAU_START);
      return 1;
    }
    return t; // mélange : fonte progressive tout au long du chauffage, pas de palier net
  }

  function draw() {
    const x0 = 25, y0 = 15, x1 = 190, y1 = 105;
    const tempToY = T => y1 - ((T - TMIN) / (TMAX - TMIN)) * (y1 - y0);
    const tEnd = elapsed / 100;

    let s = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${y1 + 13}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">durée de chauffage</text>`;
    s += `<text x="${x0 - 10}" y="${y0 - 3}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">T</text>`;

    if (mode === "pure") {
      const yFus = tempToY(TFUSION);
      s += `<line x1="${x0}" y1="${yFus}" x2="${x1}" y2="${yFus}" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>`;
    }

    const steps = 60;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const t = Math.min((i / steps) * tEnd, tEnd);
      const T = tempAt(t);
      const x = x0 + t * (x1 - x0);
      const y = tempToY(T);
      d += (i === 0 ? `M${x} ${y}` : ` L${x} ${y}`);
      if (t >= tEnd) break;
    }
    if (d) s += `<path d="${d}" fill="none" stroke="${mode === "pure" ? "var(--teal)" : "var(--coral)"}" stroke-width="2.5"/>`;

    // thermomètre
    const thX = 205, thTubeY0 = 10, thTubeY1 = 95, thBulbR = 10;
    const curT = tempAt(tEnd);
    const frac = Math.max(0, Math.min(1, (curT - TMIN) / (TMAX - TMIN)));
    const fillY = thTubeY1 - frac * (thTubeY1 - thTubeY0 - thBulbR);
    const fusioning = inFusionWindow(tEnd);
    const liqColor = fusioning ? "var(--yellow)" : (mode === "pure" ? "var(--teal)" : "var(--coral)");
    s += `<rect x="${thX - 4}" y="${thTubeY0}" width="8" height="${thTubeY1 - thTubeY0}" rx="4" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    s += `<circle cx="${thX}" cy="${thTubeY1 + thBulbR - 4}" r="${thBulbR}" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    s += `<rect x="${thX - 2.5}" y="${fillY}" width="5" height="${Math.max(0, thTubeY1 - fillY)}" fill="${liqColor}"/>`;
    s += `<circle cx="${thX}" cy="${thTubeY1 + thBulbR - 4}" r="${thBulbR - 2.5}" fill="${liqColor}"/>`;
    s += `<text x="${thX}" y="${thTubeY0 - 4}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">${curT.toFixed(0)}°C</text>`;

    svg.innerHTML = s;

    // bécher de fusion, à côté, dans son propre svg (même rendu que la section c)
    if (meltSvg) {
      meltSvg.innerHTML = meltBeakerSVG(meltProgress(tEnd));
    }

    let statusTxt;
    if (tEnd <= 0) {
      statusTxt = "Maintiens le bouton 🔥 pour commencer à chauffer.";
    } else if (fusioning) {
      statusTxt = `<strong style="color:var(--yellow)">Palier de fusion :</strong> la température reste constante à ${TFUSION}°C tant que tout le solide n'a pas fondu (regarde le bécher à côté).`;
    } else if (tEnd >= 1) {
      statusTxt = mode === "pure"
        ? `Chauffage terminé. Le palier net à ${TFUSION}°C correspond au changement d'état du corps pur.`
        : "Chauffage terminé. Aucun vrai palier : la température du mélange évolue en continu, et la fonte se fait progressivement.";
    } else {
      statusTxt = `Température actuelle : <strong style="color:var(--yellow)">${curT.toFixed(1)}°C</strong>${mode === "mix" ? " (mélange : pas de vrai palier)" : ""}`;
    }
    readout.innerHTML = statusTxt;
  }

  function loop(ts) {
    if (!holding) { rafId = null; return; }
    if (lastTs === null) lastTs = ts;
    const dt = ts - lastTs; lastTs = ts;
    elapsed = Math.min(100, elapsed + (dt / DURATION_MS) * 100);
    draw();
    if (elapsed < 100) {
      rafId = requestAnimationFrame(loop);
    } else {
      holding = false; rafId = null;
    }
  }

  function startHeating(e) {
    e.preventDefault();
    if (elapsed >= 100) return;
    holding = true; lastTs = null;
    if (!rafId) rafId = requestAnimationFrame(loop);
  }
  function stopHeating() { holding = false; }

  heatBtn.addEventListener("mousedown", startHeating);
  heatBtn.addEventListener("touchstart", startHeating, { passive: false });
  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(evt => {
    heatBtn.addEventListener(evt, stopHeating);
  });

  resetBtn.addEventListener("click", () => { elapsed = 0; holding = false; draw(); });
  btnPure.addEventListener("click", () => { mode = "pure"; elapsed = 0; holding = false; draw(); });
  btnMix.addEventListener("click", () => { mode = "mix"; elapsed = 0; holding = false; draw(); });

  draw();
}

/* ---------- e. La composition de l'air ---------- */
function initAirComposition(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const GASES = {
    n2: { label: "Diazote (N₂)", pct: 78, color: "var(--coral)", desc: "Le diazote est un gaz spectateur pour la respiration : il n'est pas utilisé par le corps." },
    o2: { label: "Dioxygène (O₂)", pct: 21, color: "#5a96d2", desc: "Seul le dioxygène est indispensable à la respiration." },
    autres: { label: "Autres gaz", pct: 1, color: "var(--yellow)", desc: "Dioxyde de carbone, gaz rares... en très faible proportion." }
  };
  const keys = ["n2", "o2", "autres"];
  let current = "n2";

  function draw() {
    const cx = 80, cy = 75, r = 60;
    let startAngle = -Math.PI / 2;
    let s = "";
    keys.forEach(k => {
      const gas = GASES[k];
      const angle = (gas.pct / 100) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const isActive = k === current;
      s += `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${gas.color}" opacity="${isActive ? 1 : 0.35}" stroke="var(--board)" stroke-width="1.5"/>`;
      startAngle = endAngle;
    });
    svg.innerHTML = s;

    const gas = GASES[current];
    readout.innerHTML = `<strong style="color:${gas.color}">${gas.label} : ${gas.pct} %</strong><br>${gas.desc}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- f. La masse volumique — flotte ou coule + défi "prédire flotte/coule" ---------- */
function initVolumicMass(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  const modeLibreBtn = document.getElementById(cfg.modeLibreBtnId);
  const modeDefiBtn = document.getElementById(cfg.modeDefiBtnId);
  const sliderWrap = cfg.sliderWrapId ? document.getElementById(cfg.sliderWrapId) : null;
  const materialButtonsWrap = cfg.materialButtonsWrapId ? document.getElementById(cfg.materialButtonsWrapId) : null;
  const defiControlsWrap = cfg.defiControlsWrapId ? document.getElementById(cfg.defiControlsWrapId) : null;
  const predictFloatBtn = document.getElementById(cfg.predictFloatBtnId);
  const predictSinkBtn = document.getElementById(cfg.predictSinkBtnId);
  const newChallengeBtn = document.getElementById(cfg.newChallengeBtnId);

  const MATERIALS = {
    bois: { label: "Bois", rho: 0.60, color: "#a0703c" },
    huile: { label: "Huile", rho: 0.92, color: "#e8c468" },
    alu: { label: "Aluminium", rho: 2.70, color: "#b8bcc4" },
    fer: { label: "Fer", rho: 7.87, color: "#8a8f98" }
  };
  const keys = ["bois", "huile", "alu", "fer"];
  let current = "bois";
  let mode = "libre"; // "libre" | "defi"
  let mystery = null; // { m, V, revealed, correct }

  // en mode défi, on ne demande PAS de deviner un matériau nommé (les élèves ne connaissent pas
  // les masses volumiques par cœur) : on donne m et V mesurés, l'élève calcule ρ et prédit
  // seulement si l'objet flotte ou coule, en comparant ρ à 1,00 kg/L (masse volumique de l'eau).
  function newMystery() {
    const V = +(0.05 + Math.random() * 0.5).toFixed(2); // L, mesuré à la règle
    const targetRho = 0.3 + Math.random() * 7.5; // kg/L, pas lié à un matériau nommé
    const m = Math.round((targetRho * V * 1000) / 5) * 5; // g, mesuré à la balance, arrondi à 5 g
    mystery = { m, V, revealed: false, correct: null };
  }

  function draw() {
    let m, V, floats, objColor, showMark = false;

    if (mode === "defi") {
      m = mystery.m; V = mystery.V;
      const rho = (m / 1000) / V;
      floats = rho < 1.00;
      objColor = mystery.revealed ? (floats ? "#5a96d2" : "#8a8f98") : "#888888";
      showMark = !mystery.revealed;
    } else {
      const mat = MATERIALS[current];
      m = Number(mRange.value);
      V = (m / 1000) / mat.rho;
      floats = mat.rho < 1.00;
      objColor = mat.color;
    }

    const x0 = 40, x1 = 160, yTop = 15, yBase = 145;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<rect x="${x0 + 2}" y="${yTop + 30}" width="${x1 - x0 - 4}" height="${yBase - yTop - 32}" fill="rgba(90,150,210,0.3)"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yTop + 20}" font-size="8" fill="#5a96d2" text-anchor="middle">eau (ρ = 1,00 kg/L)</text>`;

    const size = Math.max(10, Math.min(50, Math.sqrt(V) * 40));
    const floatY = yTop + 30 - size * 0.35;
    const sinkY = yBase - 6 - size;
    let objY;
    if (mode === "defi" && !mystery.revealed) {
      // position neutre, au milieu de l'eau : ne donne aucun indice avant la prédiction
      objY = (floatY + sinkY) / 2;
    } else {
      objY = floats ? floatY : sinkY;
    }
    s += `<rect x="${(x0 + x1) / 2 - size / 2}" y="${objY}" width="${size}" height="${size}" fill="${objColor}" stroke="var(--board)" stroke-width="1.5"/>`;
    if (showMark) {
      s += `<text x="${(x0 + x1) / 2}" y="${objY + size / 2 + 4}" font-size="${Math.max(10, size * 0.5)}" fill="var(--board)" text-anchor="middle" font-weight="700">?</text>`;
    }
    svg.innerHTML = s;

    if (mode === "defi") {
      const rho = (m / 1000) / V;
      if (mystery.revealed) {
        readout.innerHTML = `ρ = m/V = ${(m / 1000).toFixed(3)}/${V.toFixed(3)} = <strong style="color:var(--yellow)">${rho.toFixed(2)} kg/L</strong>. Comme ρ ${floats ? "&lt;" : "&gt;"} 1,00 kg/L (masse volumique de l'eau), l'objet ${floats ? "flotte" : "coule"}.<br>${mystery.correct ? "<strong style=\"color:var(--yellow)\">✅ Ta prédiction était juste !</strong>" : "Ta prédiction était fausse, mais tu vois maintenant pourquoi grâce au calcul."}`;
      } else {
        readout.innerHTML = `Objet mystère : m = <strong style="color:var(--yellow)">${m} g</strong>, V = <strong style="color:var(--yellow)">${V.toFixed(3)} L</strong>.<br>Calcule ρ = m/V, compare-le à 1,00 kg/L (masse volumique de l'eau), puis clique sur ta prédiction : ça flotte ou ça coule ?`;
      }
    } else {
      const mat = MATERIALS[current];
      const mKg = m / 1000;
      readout.innerHTML = `${mat.label} : ρ = m/V → m = ${m} g = ${mKg.toFixed(3)} kg, V = m/ρ = ${mKg.toFixed(3)}/${mat.rho.toFixed(2)} = <strong style="color:var(--yellow)">${V.toFixed(3)} L</strong><br>ρ(${mat.label.toLowerCase()}) = <strong style="color:var(--yellow)">${mat.rho.toFixed(2)} kg/L</strong> ${floats ? "&lt; 1,00 kg/L → flotte sur l'eau" : "&gt; 1,00 kg/L → coule dans l'eau"}`;
    }
  }

  function handlePrediction(predictFloats) {
    if (!mystery || mystery.revealed) return;
    const rho = (mystery.m / 1000) / mystery.V;
    const actualFloats = rho < 1.00;
    mystery.revealed = true;
    mystery.correct = (predictFloats === actualFloats);
    draw();
  }

  mRange.addEventListener("input", () => { if (mode === "libre") draw(); });

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (mode === "libre") { current = keys[i]; draw(); }
    });
  });

  if (predictFloatBtn) predictFloatBtn.addEventListener("click", () => handlePrediction(true));
  if (predictSinkBtn) predictSinkBtn.addEventListener("click", () => handlePrediction(false));
  if (newChallengeBtn) newChallengeBtn.addEventListener("click", () => { newMystery(); draw(); });

  modeLibreBtn.addEventListener("click", () => {
    mode = "libre";
    if (sliderWrap) sliderWrap.style.display = "";
    if (materialButtonsWrap) materialButtonsWrap.style.display = "";
    if (defiControlsWrap) defiControlsWrap.style.display = "none";
    draw();
  });
  modeDefiBtn.addEventListener("click", () => {
    mode = "defi";
    newMystery();
    if (sliderWrap) sliderWrap.style.display = "none";
    if (materialButtonsWrap) materialButtonsWrap.style.display = "none";
    if (defiControlsWrap) defiControlsWrap.style.display = "";
    draw();
  });

  draw();
}

/* ---------- g. La solubilité — défi de saturation à la cuillère ---------- */
function initSolubility(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const addSmallBtn = document.getElementById(cfg.addSmallBtnId);
  const addBigBtn = document.getElementById(cfg.addBigBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);

  const V = 1; // L, fixe
  const S_MAX = 360; // g/L, solubilité (exemple sel)
  const M_MAX = S_MAX * V; // g
  let added = 0;

  const POOL = generateDotsInEllipse(30, 0, 0, 1, 1);

  function draw() {
    const dissolved = Math.min(added, M_MAX);
    const undissolved = Math.max(0, added - M_MAX);
    const exceeded = added > M_MAX;
    const perfect = added === M_MAX;

    const x0 = 60, x1 = 160, yTop = 20, yBase = 140;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="${exceeded ? "var(--coral)" : "var(--chalk-dim)"}" stroke-width="2.5"/>`;
    s += `<rect x="${x0 + 2}" y="${yTop + 20}" width="${x1 - x0 - 4}" height="${yBase - yTop - 22}" fill="rgba(90,150,210,0.25)"/>`;

    // étiquette du volume, toujours visible (on ne devine pas V)
    s += `<text x="${(x0 + x1) / 2}" y="${yTop + 12}" font-size="8" fill="#5a96d2" text-anchor="middle">V = ${V} L d'eau</text>`;

    const nDissolvedDots = Math.min(20, Math.round((dissolved / M_MAX) * 20));
    for (let i = 0; i < nDissolvedDots; i++) {
      const [u, v] = POOL[i];
      const x = (x0 + x1) / 2 + u * (x1 - x0 - 16) / 2;
      const y = yTop + 60 + v * (yBase - yTop - 70) / 2;
      s += `<circle cx="${x}" cy="${y}" r="1.6" fill="var(--yellow)" opacity="0.7"/>`;
    }
    if (undissolved > 0) {
      const heapW = Math.min(70, 20 + undissolved / 5);
      s += `<ellipse cx="${(x0 + x1) / 2}" cy="${yBase - 6}" rx="${heapW / 2}" ry="6" fill="var(--coral)"><animate attributeName="ry" values="4;9;4" dur="0.6s" repeatCount="2"/></ellipse>`;
      s += `<text x="${(x0 + x1) / 2}" y="${yBase + 20}" font-size="8" fill="var(--coral)" text-anchor="middle" font-weight="700">⚠️ Saturé ! Dépôt visible</text>`;
    } else if (perfect) {
      s += `<text x="${(x0 + x1) / 2}" y="${yBase + 20}" font-size="8" fill="var(--yellow)" text-anchor="middle" font-weight="700">🎯 Pile à la saturation !</text>`;
    }

    svg.innerHTML = s;

    addSmallBtn.disabled = exceeded;
    addBigBtn.disabled = exceeded;

    // on ne révèle jamais la limite (M_MAX) tant que l'élève n'a pas fini : le but est de la
    // découvrir en dosant, pas de la lire dans l'interface avant d'avoir essayé.
    if (exceeded) {
      readout.innerHTML = `<strong style="color:var(--coral)">Saturé !</strong> Un dépôt est apparu au fond : tu as versé trop de soluté.<br>Clique sur ↺ pour recommencer et essaie de t'arrêter juste avant l'apparition du premier cristal.`;
    } else if (perfect) {
      readout.innerHTML = `<strong style="color:var(--yellow)">🎉 Parfait !</strong> À ${added} g, la solution est saturée pile à la limite, sans aucun cristal visible.<br>La solubilité de ce sel est donc s = m<sub>max</sub>/V = ${added}/${V} = <strong style="color:var(--yellow)">${added} g/L</strong>.`;
    } else {
      readout.innerHTML = `Ajouté : ${added} g. Tout est dissous, aucun dépôt visible.<br>Continue à doser petit à petit (🥄 + 10 g ou 🥄🥄 + 50 g) et arrête-toi juste avant qu'un cristal n'apparaisse au fond.`;
    }
  }

  addSmallBtn.addEventListener("click", () => { added += 10; draw(); });
  addBigBtn.addEventListener("click", () => { added += 50; draw(); });
  resetBtn.addEventListener("click", () => { added = 0; draw(); });
  draw();
}
