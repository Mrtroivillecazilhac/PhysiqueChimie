/* Animations du chapitre 2 — 2nde — "Corps purs et mélanges"
   Version simple (raw) : à raffiner plus tard, une fois toute la
   progression du 1er trimestre posée. */

/* ---------- 1. Corps pur / mélange homogène / hétérogène ---------- */
function initPureOrMixture(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPure = document.getElementById(cfg.btnPureId);
  const btnHomo = document.getElementById(cfg.btnHomoId);
  const btnHetero = document.getElementById(cfg.btnHeteroId);

  let mode = "pure";

  // positions fixes de points dans un cercle unité, réutilisées pour les 3 vues
  const POS = generateDotsInEllipse(24, 0, 0, 1, 1);

  function draw() {
    const cx = 110, cy = 90, r = 75;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(107,191,171,0.06)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    POS.forEach(([u, v], i) => {
      const x = cx + u * r * 0.85, y = cy + v * r * 0.85;
      let color;
      if (mode === "pure") {
        color = "var(--teal)";
      } else if (mode === "homo") {
        color = i % 2 === 0 ? "var(--teal)" : "var(--coral)";
      } else {
        // hétérogène : deux zones distinctes (gauche / droite)
        color = u < 0 ? "var(--teal)" : "var(--coral)";
      }
      s += `<circle cx="${x}" cy="${y}" r="5" fill="${color}"/>`;
    });

    svg.innerHTML = s;

    const texts = {
      pure: "Corps pur : une seule espèce chimique (un seul type de point).",
      homo: "Mélange homogène : plusieurs espèces, mais indiscernables à l'œil nu — bien réparties dans tout le volume.",
      hetero: "Mélange hétérogène : plusieurs espèces, mais on distingue au moins deux zones différentes à l'œil nu."
    };
    readout.textContent = texts[mode];
  }

  btnPure.addEventListener("click", () => { mode = "pure"; draw(); });
  btnHomo.addEventListener("click", () => { mode = "homo"; draw(); });
  btnHetero.addEventListener("click", () => { mode = "hetero"; draw(); });
  draw();
}

/* ---------- 2. Calculateur de proportion (massique / volumique) ----------
   Représentation particulaire macro/micro. 100 billes existent toujours
   (elles représentent le pourcentage), mais le récipient qui les contient
   réagit maintenant à la quantité TOTALE choisie, pour que "augmenter le
   total" se voie clairement :
     - en mode volumique : un flacon qui grossit avec le volume total (posé
       sur une ligne de sol fixe) ;
     - en mode massique : la balance analogique déjà utilisée pour la masse
       volumique plus bas dans la page — le plateau s'enfonce d'autant plus
       que la masse totale est grande (l'objet posé dessus garde une taille
       fixe : seule la position du plateau change, la masse ne "grossit"
       pas comme un volume).
   Dans les deux cas, exactement N = round(pct) billes "s'allument" (couleur
   pleine) pour symboliser l'espèce E ; les 100−N restantes restent
   éteintes/grisées pour symboliser le reste du mélange. L'ordre d'allumage
   est mélangé une seule fois à l'initialisation (aspect "mélange homogène"
   plutôt qu'un remplissage en bloc façon jauge). */
function initProportionCalculator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const eRange = document.getElementById(cfg.eRangeId);
  const totRange = document.getElementById(cfg.totRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnMass = document.getElementById(cfg.btnMassId);
  const btnVol = document.getElementById(cfg.btnVolId);
  const unitLabelE = document.getElementById(cfg.unitLabelEId);
  const unitLabelTot = document.getElementById(cfg.unitLabelTotId);
  const grandeurLabelE = document.getElementById(cfg.grandeurLabelEId);
  const grandeurLabelTot = document.getElementById(cfg.grandeurLabelTotId);

  let mode = "vol"; // "mass" (grammes) ou "vol" (litres)

  // ---- grille de 100 billes, en coordonnées NORMALISÉES (0..1) à l'intérieur
  // d'une "boîte" qui sera repositionnée/redimensionnée à chaque dessin selon
  // le récipient utilisé (flacon ou objet posé sur la balance). ----
  const GRID_COLS = 10, GRID_ROWS = 10;
  const norm = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      norm.push({
        u: GRID_COLS > 1 ? col / (GRID_COLS - 1) : 0.5,
        v: GRID_ROWS > 1 ? row / (GRID_ROWS - 1) : 0.5
      });
    }
  }

  // ---- ordre d'allumage fixé une fois pour toutes (mélangé, aspect
  // "mélange homogène" — un générateur pseudo-aléatoire simple suffit car
  // seul le rendu visuel est concerné, pas la reproductibilité d'un calcul). ----
  const order = norm.map((_, i) => i);
  let seed = 42;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const colorRank = new Array(100);
  order.forEach((posIndex, rank) => { colorRank[posIndex] = rank; });

  const totMax = Number(totRange.max) || 10;
  const totMin = Number(totRange.min) || 0;

  // Facteur d'échelle (0.35 → 1) du récipient, calculé à partir de la
  // quantité TOTALE choisie : plus le total est grand, plus le flacon (ou
  // l'objet sur la balance) grossit. Borné à 0.35 pour rester visible même
  // quand le total est réglé au minimum.
  function scaleFromTotal(tot) {
    const span = totMax - totMin;
    const t = span > 0 ? Math.max(0, Math.min(1, (tot - totMin) / span)) : 0;
    return 0.35 + 0.65 * t;
  }

  // Dessine les 100 billes à l'intérieur d'une boîte {x,y,w,h} (coordonnées
  // SVG), N d'entre elles "allumées" dans la couleur de l'espèce E.
  function drawParticles(box, N, colorE, dotR) {
    let s = "";
    norm.forEach((p, i) => {
      const cx = box.x + p.u * box.w;
      const cy = box.y + p.v * box.h;
      const lit = colorRank[i] < N;
      if (lit) {
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${dotR.toFixed(1)}" fill="${colorE}" opacity="0.95"/>`;
      } else {
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${dotR.toFixed(1)}" fill="var(--chalk-dim)" opacity="0.3"/>`;
      }
    });
    return s;
  }

  function draw() {
    let e = Number(eRange.value);
    let tot = Number(totRange.value);

    // Empêche strictement E > total : le curseur de E ne peut pas dépasser
    // la valeur courante du total.
    eRange.max = String(tot);
    if (e > tot) { e = tot; eRange.value = String(tot); }

    const pct = tot > 0 ? (e / tot) * 100 : 0;
    const decimal = tot > 0 ? e / tot : 0;
    const N = Math.max(0, Math.min(100, Math.round(pct)));
    const unit = mode === "mass" ? "g" : "L";
    const grandeur = mode === "mass" ? "masse" : "volume";
    const grandeurCap = mode === "mass" ? "Masse" : "Volume";
    const colorE = mode === "mass" ? "var(--yellow)" : "var(--teal)";
    const scale = scaleFromTotal(tot);
    const dotR = mode === "vol" ? (3.4 + 2.0 * scale) : 4.4; // taille fixe en mode masse (seule la position du plateau bouge)

    let s = "";
    let box; // zone {x,y,w,h} où répartir les 100 billes

    if (mode === "vol") {
      // ---- un flacon qui grossit avec le volume total, posé sur un sol fixe ----
      const W = 46 + 110 * scale, H = 60 + 110 * scale;
      const bx = 100 - W / 2, topY = 192 - H; // base toujours au même niveau
      const neckW = Math.max(24, W * 0.32), neckH = 22;

      s += `<line x1="20" y1="192" x2="180" y2="192" stroke="var(--chalk-dim)" stroke-width="1" opacity="0.5"/>`;
      s += `<rect x="${bx.toFixed(1)}" y="${topY.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" rx="14" fill="rgba(107,191,171,0.05)" stroke="var(--line)" stroke-width="2"/>`;
      s += `<rect x="${(100 - neckW / 2).toFixed(1)}" y="${(topY - neckH).toFixed(1)}" width="${neckW.toFixed(1)}" height="${neckH.toFixed(1)}" rx="5" fill="rgba(107,191,171,0.05)" stroke="var(--line)" stroke-width="2"/>`;
      s += `<rect x="${(100 - neckW / 2 - 5).toFixed(1)}" y="${(topY - neckH - 8).toFixed(1)}" width="${(neckW + 10).toFixed(1)}" height="8" rx="4" fill="var(--chalk-dim)"/>`;

      box = { x: bx + W * 0.1, y: topY + H * 0.1, w: W * 0.8, h: H * 0.8 };
    } else {
      // ---- balance analogique (même principe que le Test 2 plus bas) : seul
      // le plateau s'enfonce quand la masse totale augmente (plus lourd = plus
      // bas). L'objet posé dessus garde une taille FIXE : la masse ne "grossit"
      // pas comme un volume, elle pèse plus ou moins lourd. ----
      const PIVOT_Y = 18, PLATE_Y_MIN = 66, PLATE_Y_MAX = 150;
      const plateY = PLATE_Y_MIN + scale * (PLATE_Y_MAX - PLATE_Y_MIN);
      const W = 100, H = 74; // taille fixe, indépendante de la masse totale
      const bx = 100 - W / 2, topY = plateY - H;

      // potence
      s += `<rect x="40" y="12" width="120" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<rect x="96" y="4" width="8" height="16" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      // règle graduée sur le côté
      s += `<line x1="176" y1="${PLATE_Y_MIN}" x2="176" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
      // ressort en zig-zag
      const segs = 6, zx = 12;
      let spring = `M100 ${PIVOT_Y + 8}`;
      for (let i = 1; i <= segs; i++) {
        const y = PIVOT_Y + 8 + (plateY - PIVOT_Y - 8) * (i / segs);
        spring += ` L${(100 + (i % 2 === 0 ? zx : -zx)).toFixed(1)} ${y.toFixed(1)}`;
      }
      s += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
      // plateau
      s += `<ellipse cx="100" cy="${plateY.toFixed(1)}" rx="46" ry="7" fill="rgba(0,0,0,0.2)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      // objet posé sur le plateau (taille fixe)
      s += `<rect x="${bx.toFixed(1)}" y="${topY.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" rx="12" fill="rgba(107,191,171,0.05)" stroke="var(--line)" stroke-width="2"/>`;

      box = { x: bx + W * 0.1, y: topY + H * 0.1, w: W * 0.8, h: H * 0.8 };
    }

    s += drawParticles(box, N, colorE, dotR);
    svg.innerHTML = s;

    if (unitLabelE) unitLabelE.textContent = unit;
    if (unitLabelTot) unitLabelTot.textContent = unit;
    if (grandeurLabelE) grandeurLabelE.textContent = grandeurCap;
    if (grandeurLabelTot) grandeurLabelTot.textContent = grandeurCap;

    readout.innerHTML = `Proportion ${grandeur} = <span class="frac"><span class="num">${e.toFixed(1)} ${unit}</span><span class="den">${tot.toFixed(1)} ${unit}</span></span> = <strong>${decimal.toFixed(2)}</strong> = <strong style="color:var(--yellow)">${pct.toFixed(0)}%</strong><br><span style="font-size:0.85em; color:var(--chalk-dim);">Soit ${N} particules de E allumées sur 100 particules de mélange.</span>`;
  }
  eRange.addEventListener("input", draw);
  totRange.addEventListener("input", draw);
  if (btnMass) btnMass.addEventListener("click", () => { mode = "mass"; draw(); });
  if (btnVol) btnVol.addEventListener("click", () => { mode = "vol"; draw(); });
  draw();
}

/* ---------- 3. Température de changement d'état : corps pur vs mélange ---------- */
function initStateChangeGraph(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPure = document.getElementById(cfg.btnPureId);
  const btnMix = document.getElementById(cfg.btnMixId);

  let mode = "pure";

  function draw() {
    const x0 = 30, y0 = 15, x1 = 230, y1 = 140;
    let s = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${y1 + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">temps</text>`;
    s += `<text x="${x0 - 10}" y="${y0 - 4}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">T</text>`;

    let path, color;
    const platX1 = x0 + 60, platX2 = x0 + 130, platY = y0 + 60;
    if (mode === "pure") {
      // refroidissement d'un liquide : descend (liquide), palier (liquide+solide), redescend (solide)
      path = `M${x0 + 10} ${y0 + 15} L${platX1} ${platY} L${platX2} ${platY} L${x1 - 20} ${y0 + 110}`;
      color = "var(--teal)";
      // ligne pointillée du palier, juste au-dessus de la vraie courbe pour ne jamais se confondre avec elle
      s += `<line x1="${platX1}" y1="${platY - 9}" x2="${platX2}" y2="${platY - 9}" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="3,3"/>`;
      s += `<text x="${(x0 + 10 + platX1) / 2}" y="${y0 + 8}" font-size="8.5" fill="var(--chalk)" text-anchor="middle">liquide</text>`;
      s += `<text x="${(platX1 + platX2) / 2}" y="${platY - 16}" font-size="8" fill="var(--yellow)" text-anchor="middle">liquide + solide</text>`;
      s += `<text x="${(platX1 + platX2) / 2}" y="${platY + 16}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle" font-style="italic">palier à température constante</text>`;
      s += `<text x="${(platX2 + x1 - 20) / 2}" y="133" font-size="8.5" fill="var(--chalk)" text-anchor="middle">solide</text>`;
    } else {
      // descend, ralentit mais continue de baisser (pas de vrai palier)
      path = `M${x0 + 10} ${y0 + 15} L${x0 + 60} ${y0 + 55} Q${x0 + 95} ${y0 + 65} ${x0 + 130} ${y0 + 80} L${x1 - 20} ${y0 + 115}`;
      color = "var(--coral)";
      s += `<text x="${(x0 + 10 + x0 + 60) / 2}" y="${y0 + 8}" font-size="8.5" fill="var(--chalk)" text-anchor="middle">liquide</text>`;
      s += `<text x="${(x0 + 130 + x1 - 20) / 2}" y="133" font-size="8.5" fill="var(--chalk)" text-anchor="middle">solide</text>`;
    }
    s += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
    svg.innerHTML = s;

    readout.textContent = mode === "pure"
      ? "Un corps pur change d'état à température constante : la courbe présente un vrai palier (ici, coexistence du liquide et du solide pendant la solidification)."
      : "Un mélange n'a pas de température de changement d'état constante : pas de vrai palier, la température continue d'évoluer pendant le changement d'état.";
  }

  btnPure.addEventListener("click", () => { mode = "pure"; draw(); });
  btnMix.addEventListener("click", () => { mode = "mix"; draw(); });
  draw();
}

/* ---------- 4. Masse volumique et densité (balance analogique) ---------- */
function initDensityCalculator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLiquid = document.getElementById(cfg.btnLiquidId);
  const btnGas = document.getElementById(cfg.btnGasId);
  const unitMLabel = document.getElementById(cfg.unitMLabelId);

  // Échelles pensées pour tomber sur des valeurs réalistes et lisibles :
  // en kg/L pour un liquide/solide (l'eau vaut alors 1,00 — pas 1000 !),
  // en g/L pour un gaz (où le kg/L donnerait des décimales illisibles).
  const MODE_CONF = {
    liquid: { unit: "kg", maxM: 5, stepM: 0.05, defaultM: 1.00, rhoUnit: "kg/L", ref: 1.00, refLabel: "eau" },
    gas: { unit: "g", maxM: 5, stepM: 0.05, defaultM: 1.30, rhoUnit: "g/L", ref: 1.3, refLabel: "air" }
  };
  let mode = "liquid";

  const PIVOT_Y = 20, PLATE_Y_MIN = 80, PLATE_Y_MAX = 150;
  const MAX_V = 5; // L, même échelle dans les deux modes

  function applyModeToSlider() {
    const conf = MODE_CONF[mode];
    mRange.min = "0.05";
    mRange.max = String(conf.maxM);
    mRange.step = String(conf.stepM);
    if (Number(mRange.value) > conf.maxM) mRange.value = conf.defaultM;
    if (unitMLabel) unitMLabel.textContent = conf.unit;
  }

  function draw() {
    const conf = MODE_CONF[mode];
    const m = Number(mRange.value);
    const V = Number(vRange.value);
    const rho = V > 0 ? m / V : 0;
    const d = rho / conf.ref;

    const plateY = PLATE_Y_MIN + (Math.min(m, conf.maxM) / conf.maxM) * (PLATE_Y_MAX - PLATE_Y_MIN);

    let s = "";
    // potence
    s += `<rect x="40" y="14" width="120" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<rect x="96" y="6" width="8" height="16" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    // règle graduée sur le côté (0 à maxM, 6 graduations)
    s += `<line x1="165" y1="${PLATE_Y_MIN}" x2="165" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    for (let i = 0; i <= 5; i++) {
      const v = (i / 5) * conf.maxM;
      const y = PLATE_Y_MIN + (v / conf.maxM) * (PLATE_Y_MAX - PLATE_Y_MIN);
      s += `<line x1="160" y1="${y}" x2="170" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<text x="174" y="${y + 3}" font-size="7.5" fill="var(--chalk-dim)">${v.toFixed(1)}</text>`;
    }
    // ressort en zig-zag
    const segs = 6, zx = 12;
    let spring = `M100 ${PIVOT_Y + 10}`;
    for (let i = 1; i <= segs; i++) {
      const y = PIVOT_Y + 10 + (plateY - PIVOT_Y - 10) * (i / segs);
      spring += ` L${100 + (i % 2 === 0 ? zx : -zx)} ${y}`;
    }
    s += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<line x1="140" y1="${plateY}" x2="160" y2="${plateY}" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,2"/>`;
    s += `<ellipse cx="100" cy="${plateY}" rx="42" ry="7" fill="rgba(0,0,0,0.2)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    // objet posé sur le plateau : sa TAILLE dépend de V (0 à 5 L), sa
    // position (via le plateau) dépend de m. Teinte selon l'intensité de d.
    const t = Math.min(1, d / 2);
    const color = `rgb(${Math.round(107 + t * 110)},${Math.round(191 - t * 70)},${Math.round(171 - t * 70)})`;
    const vClamped = Math.min(V, MAX_V);

    if (mode === "liquid") {
      const w = 16 + vClamped * 5, h = 22 + vClamped * 6;
      const bx0 = 100 - w / 2, bx1 = 100 + w / 2, topY = plateY - h, baseY = plateY - 4;
      s += `<path d="M${bx0} ${topY} L${bx0} ${baseY - 6} Q${bx0} ${baseY} ${bx0 + 6} ${baseY} L${bx1 - 6} ${baseY} Q${bx1} ${baseY} ${bx1} ${baseY - 6} L${bx1} ${topY}" fill="${color}" opacity="0.5" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
    } else {
      const r = 10 + vClamped * 5;
      const cy2 = plateY - r - 2;
      s += `<ellipse cx="100" cy="${cy2}" rx="${r * 0.85}" ry="${r}" fill="${color}" opacity="0.5" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
      s += `<path d="M96 ${cy2 + r} L104 ${cy2 + r} L100 ${cy2 + r + 6} Z" fill="var(--chalk-dim)"/>`;
    }

    svg.innerHTML = s;
    readout.innerHTML = `ρ = m/V = ${m.toFixed(2)}/${V.toFixed(2)} = <strong style="color:var(--yellow)">${rho.toFixed(2)} ${conf.rhoUnit}</strong><br>d = ρ/ρ<sub>${conf.refLabel}</sub> = <strong style="color:var(--teal)">${d.toFixed(2)}</strong> (sans unité)`;
  }

  mRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  btnLiquid.addEventListener("click", () => { mode = "liquid"; applyModeToSlider(); draw(); });
  btnGas.addEventListener("click", () => { mode = "gas"; applyModeToSlider(); draw(); });
  applyModeToSlider();
  draw();
}

/* ---------- 5. Chromatographie interactive (CCM dynamique, front de solvant animé) ---------- */
function initChromatography(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const eluerBtn = document.getElementById(cfg.eluerBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);

  const RF_A = 0.30, RF_B = 0.65; // valeurs choisies, bien distinctes (non affichées : hors programme)
  const COL_A = "var(--teal)", COL_B = "var(--coral)";
  const COL_NEUTRAL = "#d8d8dc"; // taches non encore identifiées, pendant l'élution

  const x0 = 30, x1 = 190, yTop = 15, yDeposit = 145;
  const travel = yDeposit - yTop - 15;
  const laneA = 65, laneMix = 110, laneB = 155;

  let progress = 0;
  let animId = null;
  let running = false;

  function spot(x, y, color, r = 7) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="var(--chalk-dim)" stroke-width="1" opacity="0.9"/>`;
  }

  function draw() {
    const finished = progress >= 0.999;
    const frontY = yDeposit - progress * travel;
    const yA = yDeposit - progress * travel * RF_A;
    const yB = yDeposit - progress * travel * RF_B;

    let s = `<rect x="${x0}" y="${yTop}" width="${x1 - x0}" height="${yDeposit - yTop + 15}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${x0}" y1="${yDeposit}" x2="${x1}" y2="${yDeposit}" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yDeposit + 12}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">ligne de dépôt</text>`;
    if (progress > 0.01) {
      s += `<line x1="${x0}" y1="${frontY}" x2="${x1}" y2="${frontY}" stroke="var(--yellow)" stroke-width="1.3" stroke-dasharray="3,2"/>`;
    }
    s += `<text x="${laneA}" y="${yDeposit + 24}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">A</text>`;
    s += `<text x="${laneMix}" y="${yDeposit + 24}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">A + B</text>`;
    s += `<text x="${laneB}" y="${yDeposit + 24}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">B</text>`;

    // Pendant l'élution, les taches restent neutres (non identifiées) — on ne
    // les colore et on ne les compare qu'une fois l'élution terminée, comme
    // dans la réalité : on identifie APRÈS comparaison avec les taches pures.
    if (finished) {
      s += spot(laneA, yA, COL_A);
      s += spot(laneB, yB, COL_B);
      s += spot(laneMix, yA, COL_A);
      s += spot(laneMix, yB, COL_B);
      s += `<line x1="${laneA}" y1="${yA}" x2="${laneMix}" y2="${yA}" stroke="${COL_A}" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>`;
      s += `<line x1="${laneMix}" y1="${yB}" x2="${laneB}" y2="${yB}" stroke="${COL_B}" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>`;
    } else {
      s += spot(laneA, yA, COL_NEUTRAL);
      s += spot(laneB, yB, COL_NEUTRAL);
      s += spot(laneMix, yA, COL_NEUTRAL);
      s += spot(laneMix, yB, COL_NEUTRAL);
    }

    svg.innerHTML = s;

    if (progress < 0.01) {
      readout.textContent = "Trois dépôts : A pur, B pur, et un mélange A + B. Clique sur « Éluer ! » pour faire monter le solvant.";
    } else if (!finished) {
      readout.textContent = "Le front du solvant monte et entraîne chaque tache à sa propre vitesse…";
    } else {
      readout.innerHTML = `Élution terminée. Dans le mélange, les deux taches sont à la <strong style="color:var(--yellow)">même hauteur</strong> que les taches pures A et B : le mélange contient donc bien A et B.`;
    }
  }

  function animate() {
    running = true;
    eluerBtn.disabled = true;
    const duration = 1800;
    const start = performance.now();
    cancelAnimationFrame(animId);
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      progress = t;
      draw();
      if (t < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        running = false;
        eluerBtn.disabled = false;
      }
    }
    animId = requestAnimationFrame(frame);
  }

  eluerBtn.addEventListener("click", () => { if (!running) animate(); });
  resetBtn.addEventListener("click", () => {
    cancelAnimationFrame(animId);
    running = false;
    eluerBtn.disabled = false;
    progress = 0;
    draw();
  });

  draw();
}
