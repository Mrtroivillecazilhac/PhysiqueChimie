/* Animations du chapitre 1 — 1ère spé PC */

/* ---------- 1. Le sac de la mole (un seul sac, des tas dedans) ---------- */
function initMoleBag(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const range = document.getElementById(cfg.rangeId);
  const readout = document.getElementById(cfg.readoutId);
  const countEl = document.getElementById(cfg.countId);
  const warnEl = document.getElementById(cfg.warnId);

  const BAG_PATH = "M40 55 Q30 20 100 20 Q170 20 160 55 L172 195 Q170 215 150 215 L50 215 Q30 215 28 195 Z";
  // 6 emplacements fixes à l'intérieur du sac (2 rangées de 3) — le curseur
  // va jusqu'à 6 mol, donc ça tient toujours.
  const SLOTS = [[65, 95], [100, 95], [135, 95], [65, 150], [100, 150], [135, 150]];
  const DOT_PATTERN = generateDotsInEllipse(7, 0, 0, 1, 1);

  function moundPath(cx, cy) {
    return `M${cx - 14} ${cy + 12} Q${cx - 14} ${cy - 10} ${cx} ${cy - 13} Q${cx + 14} ${cy - 10} ${cx + 14} ${cy + 12} Z`;
  }
  function drawMound(cx, cy) {
    let s = `<path d="${moundPath(cx, cy)}" fill="rgba(232,196,104,0.15)" stroke="var(--yellow)" stroke-width="1.8"/>`;
    DOT_PATTERN.forEach(([u, v]) => {
      s += `<circle cx="${cx + u * 9}" cy="${cy - 1 + v * 9}" r="1.6" fill="var(--yellow)" opacity="0.85"/>`;
    });
    return s;
  }

  function draw() {
    const n = Number(range.value) / 10; // slider en dixièmes de mole
    const N = n * NA;
    const fullPiles = Math.floor(n + 1e-9);
    const hasHalf = Math.abs(n - fullPiles - 0.5) < 1e-9;

    let svgContent = `<path d="${BAG_PATH}" fill="rgba(107,191,171,0.05)" stroke="var(--chalk-dim)" stroke-width="3"/>`;

    for (let i = 0; i < fullPiles && i < SLOTS.length; i++) {
      const [cx, cy] = SLOTS[i];
      svgContent += drawMound(cx, cy);
    }
    if (hasHalf && fullPiles < SLOTS.length) {
      const [cx, cy] = SLOTS[fullPiles];
      const clipId = "halfClip-" + cfg.svgId;
      svgContent += `<clipPath id="${clipId}"><rect x="${cx - 14}" y="${cy - 15}" width="14" height="30"/></clipPath>`;
      svgContent += `<g clip-path="url(#${clipId})">${drawMound(cx, cy)}</g>`;
      svgContent += `<line x1="${cx}" y1="${cy - 15}" x2="${cx}" y2="${cy + 15}" stroke="var(--coral)" stroke-width="1.3" stroke-dasharray="2,2"/>`;
    }

    svg.innerHTML = svgContent;

    const pilesLabel = hasHalf
      ? `${fullPiles} tas plein${fullPiles > 1 ? "s" : ""} + 1 demi-tas`
      : `${fullPiles} tas plein${fullPiles > 1 ? "s" : ""}`;
    readout.textContent = `n = ${n.toString().replace(".", ",")} mol`;
    warnEl.textContent = `→ ${pilesLabel} dans le sac`;
    countEl.innerHTML = `Nombre total d'entités : N = n × N<sub>A</sub> ≈ <strong style="color:var(--yellow)">${formatSci(N)}</strong>`;
  }
  range.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Balance à plateau (descend/monte avec la masse) ---------- */
function initMassScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const molarRange = document.getElementById(cfg.molarRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_MASS_DISPLAY = 1000; // g, au-delà le plateau reste en butée basse
  const PIVOT_Y = 25, PLATE_Y_MIN = 55, PLATE_Y_MAX = 165;
  const BALL_DX = [0, -14, 14, -24, -4, 16, 26, -30, -10, 10, 30];

  function draw() {
    const n = Number(nRange.value);
    const M = Number(molarRange.value);
    const m = n * M;
    const mClamped = Math.min(m, MAX_MASS_DISPLAY);
    const saturated = m > MAX_MASS_DISPLAY;
    const plateY = PLATE_Y_MIN + (mClamped / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);

    const t = Math.min(1, Math.max(0, (M - 10) / (200 - 10)));
    const radius = 5 + t * 8;
    const color = `rgb(${Math.round(107 + t * (217 - 107))}, ${Math.round(191 + t * (122 - 191))}, ${Math.round(171 + t * (99 - 171))})`;

    let svgContent = "";
    // potence
    svgContent += `<rect x="40" y="18" width="120" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<rect x="96" y="10" width="8" height="16" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    // règle graduée sur le côté
    svgContent += `<line x1="165" y1="${PLATE_Y_MIN}" x2="165" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    [0, 250, 500, 750, 1000].forEach(v => {
      const y = PLATE_Y_MIN + (v / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);
      svgContent += `<line x1="160" y1="${y}" x2="170" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      svgContent += `<text x="174" y="${y + 3}" font-size="8" fill="var(--chalk-dim)">${v}</text>`;
    });
    // ressort en zig-zag entre la potence et le plateau
    const segs = 6, zx = 14;
    let spring = `M100 ${PIVOT_Y + 10}`;
    for (let i = 1; i <= segs; i++) {
      const y = PIVOT_Y + 10 + (plateY - PIVOT_Y - 10) * (i / segs);
      spring += ` L${100 + (i % 2 === 0 ? zx : -zx)} ${y}`;
    }
    svgContent += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    // pointeur de lecture (petite flèche vers la règle)
    svgContent += `<line x1="140" y1="${plateY}" x2="160" y2="${plateY}" stroke="${saturated ? 'var(--coral)' : 'var(--yellow)'}" stroke-width="2" stroke-dasharray="3,2"/>`;
    // plateau
    svgContent += `<ellipse cx="100" cy="${plateY}" rx="42" ry="7" fill="rgba(0,0,0,0.2)" stroke="${saturated ? 'var(--coral)' : 'var(--chalk-dim)'}" stroke-width="2"/>`;
    // boules empilées sur le plateau
    const visible = Math.min(n, BALL_DX.length);
    for (let i = 0; i < visible; i++) {
      const stackRow = Math.floor(i / 5);
      svgContent += `<circle cx="${100 + BALL_DX[i]}" cy="${plateY - 8 - stackRow * (radius * 1.4)}" r="${radius}" fill="${color}" stroke="var(--board)" stroke-width="1"/>`;
    }

    svg.innerHTML = svgContent;
    readout.innerHTML = saturated
      ? `n = ${n}, M = ${M} g/mol → m = n × M = ${m} g <strong style="color:var(--coral)">(hors échelle, le plateau touche le fond !)</strong>`
      : `n = ${n}, M = ${M} g/mol → m = n × M = <strong style="color:var(--yellow)">${m} g</strong>`;
  }

  nRange.addEventListener("input", draw);
  molarRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Dilution animée (bécher qui grandit avec V) ---------- */
function initDilution(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_DOTS = 70;
  // positions normalisées dans un disque unité — réutilisées, juste remises
  // à l'échelle du bécher courant à chaque dessin (donc pas de saut visuel)
  const normPositions = generateDotsInEllipse(MAX_DOTS, 0, 0, 1, 1);

  function draw() {
    const n = Number(nRange.value) / 100;   // mol
    const V = Number(vRange.value) / 100;   // L
    const C = V > 0 ? n / V : 0;
    // Le nombre de points dépend de n SEUL (la quantité de matière ne
    // change pas quand on dilue) — c'est la taille du bécher (liée à V)
    // qui fait apparaître les points plus ou moins espacés.
    const dotCount = Math.min(MAX_DOTS, Math.round(n * 23));

    // le bécher grandit avec V (largeur ET hauteur)
    const vNorm = (V - 0.1) / (3 - 0.1); // 0 à 1 sur la plage du curseur
    const width = 70 + vNorm * 70;
    const height = 90 + vNorm * 90;
    const baseY = 195, centerX = 100;
    const topY = baseY - height;
    const left = centerX - width / 2, right = centerX + width / 2;

    let svgContent = `<path d="M${left} ${topY} L${left} ${baseY - 12} Q${left} ${baseY} ${left + 12} ${baseY} L${right - 12} ${baseY} Q${right} ${baseY} ${right} ${baseY - 12} L${right} ${topY}" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    for (let i = 0; i < dotCount; i++) {
      const [u, v] = normPositions[i];
      const x = centerX + u * (width / 2 - 10);
      const y = baseY - 10 - ((v + 1) / 2) * (height - 20);
      svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="var(--coral)" opacity="0.85"/>`;
    }
    svg.innerHTML = svgContent;

    readout.innerHTML = `n = ${n.toFixed(2)} mol, V = ${V.toFixed(2)} L → C = n / V = <strong style="color:var(--yellow)">${C.toFixed(2)} mol/L</strong>`;
  }
  nRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Cuve interactive — loi de Beer-Lambert (C seule varie) ---------- */
function initBeerLambert(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const cRange = document.getElementById(cfg.cRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const EPSILON = 1700; // L·mol⁻¹·cm⁻¹, valeur typique (ex: permanganate)
  const L_FIXED = 1;    // cm — épaisseur standard d'une cuve, non modifiable

  function draw() {
    const cSlider = Number(cRange.value);              // dixièmes de ×10⁻⁴ mol/L
    const cDisplay = cSlider / 10;                       // ×10⁻⁴ mol/L, ex: 6.5
    const C = cDisplay / 1e4;                             // mol/L réel
    const A = EPSILON * L_FIXED * C;
    const T = Math.pow(10, -A);                           // transmittance
    const beamOpacityOut = Math.max(0.06, T);

    const cuveWidth = 55;
    const cuveLeft = 130 - cuveWidth / 2;
    const cuveRight = 130 + cuveWidth / 2;
    const colorT = Math.min(1, A / 1.3);
    const fillColor = `rgba(${Math.round(107 + colorT * (217 - 107))}, ${Math.round(191 + colorT * (122 - 191))}, ${Math.round(171 + colorT * (99 - 171))}, ${0.15 + colorT * 0.55})`;

    let svgContent = "";
    svgContent += `<defs>
      <marker id="arrowIn" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
      <marker id="arrowOut" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)" opacity="${beamOpacityOut}"/></marker>
    </defs>`;
    svgContent += `<line x1="20" y1="90" x2="${cuveLeft - 4}" y2="90" stroke="var(--yellow)" stroke-width="4" marker-end="url(#arrowIn)"/>`;
    svgContent += `<rect x="${cuveLeft}" y="45" width="${cuveWidth}" height="90" fill="${fillColor}" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    svgContent += `<line x1="${cuveRight + 4}" y1="90" x2="240" y2="90" stroke="var(--yellow)" stroke-width="4" opacity="${beamOpacityOut}" marker-end="url(#arrowOut)"/>`;
    svgContent += `<text x="130" y="150" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">ℓ = ${L_FIXED} cm (fixe)</text>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `C = ${cDisplay.toFixed(1)} × 10⁻⁴ mol/L → A = ε × ℓ × C = <strong style="color:var(--yellow)">${A.toFixed(2)}</strong> (transmittance ≈ ${(T * 100).toFixed(0)}%)`;
  }

  cRange.addEventListener("input", draw);
  draw();
}

/* ---------- 5. Courbe d'étalonnage interactive (lecture graphique) ---------- */
function initCalibrationCurve(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const aSlider = document.getElementById(cfg.sliderId);
  const readout = document.getElementById(cfg.readoutId);

  // points étalons (exemple permanganate de potassium, cf. manuel)
  const POINTS = [
    { C: 1.2, A: 0.20 }, { C: 3.6, A: 0.60 }, { C: 4.1, A: 0.68 },
    { C: 5.0, A: 0.83 }, { C: 6.5, A: 1.10 }
  ]; // C en ×10⁻⁴ mol/L

  // régression forcée par l'origine : k = Σ(C×A) / Σ(C²)
  const k = POINTS.reduce((s, p) => s + p.C * p.A, 0) / POINTS.reduce((s, p) => s + p.C * p.C, 0);

  const C_MAX = 7.5, A_MAX = 1.4;
  const PAD_L = 40, PAD_B = 55, PAD_T = 15, PAD_R = 15;
  const W = 260, H = 205;
  const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;

  function xPix(C) { return PAD_L + (C / C_MAX) * plotW; }
  function yPix(A) { return PAD_T + plotH - (A / A_MAX) * plotH; }

  function flaskSvg(cx, topY, intensityT) {
    const fill = `rgba(${Math.round(107 + intensityT * (217 - 107))}, ${Math.round(191 + intensityT * (122 - 191))}, ${Math.round(171 + intensityT * (99 - 171))}, ${0.25 + intensityT * 0.6})`;
    return `<path d="M${cx - 5} ${topY} L${cx - 5} ${topY + 5} L${cx - 11} ${topY + 20} Q${cx - 11} ${topY + 24} ${cx - 7} ${topY + 24} L${cx + 7} ${topY + 24} Q${cx + 11} ${topY + 24} ${cx + 11} ${topY + 20} L${cx + 5} ${topY + 5} L${cx + 5} ${topY} Z" fill="${fill}" stroke="var(--chalk-dim)" stroke-width="1.2"/>
      <line x1="${cx - 6}" y1="${topY}" x2="${cx + 6}" y2="${topY}" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
  }

  function draw() {
    const Ameasured = Number(aSlider.value) / 100;
    const Cinc = Ameasured / k;

    let svgContent = "";
    svgContent += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<text x="${W / 2}" y="${H - 4}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">C (× 10⁻⁴ mol/L)</text>`;
    svgContent += `<text x="10" y="${PAD_T + 6}" font-size="8" fill="var(--chalk-dim)">A</text>`;

    svgContent += `<line x1="${xPix(0)}" y1="${yPix(0)}" x2="${xPix(C_MAX)}" y2="${yPix(k * C_MAX)}" stroke="var(--teal)" stroke-width="2"/>`;

    // fioles alignées sous chaque point, dont la teinte montre la concentration croissante
    POINTS.forEach(p => {
      const t = p.C / POINTS[POINTS.length - 1].C;
      svgContent += flaskSvg(xPix(p.C), H - PAD_B + 8, t);
      svgContent += `<line x1="${xPix(p.C)}" y1="${yPix(p.A)}" x2="${xPix(p.C)}" y2="${H - PAD_B + 8}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>`;
    });

    POINTS.forEach(p => {
      svgContent += `<circle cx="${xPix(p.C)}" cy="${yPix(p.A)}" r="4" fill="var(--yellow)"/>`;
    });

    const py = yPix(Ameasured), px = xPix(Cinc);
    svgContent += `<line x1="${PAD_L}" y1="${py}" x2="${px}" y2="${py}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svgContent += `<line x1="${px}" y1="${py}" x2="${px}" y2="${H - PAD_B}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svgContent += `<circle cx="${px}" cy="${py}" r="5" fill="var(--coral)"/>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `A mesurée = ${Ameasured.toFixed(2)} → lecture graphique : C<sub>inc</sub> = <span class="frac"><span class="num">A</span><span class="den">k</span></span> = <strong style="color:var(--coral)">${Cinc.toFixed(2)} × 10⁻⁴ mol/L</strong>`;
  }

  aSlider.addEventListener("input", draw);
  draw();
}
