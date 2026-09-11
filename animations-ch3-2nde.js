/* Animations du chapitre 3 — 2nde — "Solutions aqueuses" */

/* ---------- 1. Soluté ionique ou moléculaire ---------- */
function initSoluteType(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnIonic = document.getElementById(cfg.btnIonicId);
  const btnMolecular = document.getElementById(cfg.btnMolecularId);

  let mode = "ionic";
  const SOLVENT_POS = generateDotsInEllipse(40, 0, 0, 1, 1);

  function drawLegend() {
    if (mode === "ionic") {
      return `<g font-family="var(--font-body)">
        <circle cx="18" cy="14" r="6.5" fill="var(--coral)"/>
        <text x="18" y="17" font-size="7.5" fill="var(--board)" text-anchor="middle" font-weight="700">+</text>
        <text x="30" y="18" font-size="9" fill="var(--chalk-dim)">Na⁺(aq)</text>
        <circle cx="115" cy="14" r="6.5" fill="var(--teal)"/>
        <text x="115" y="17" font-size="7.5" fill="var(--board)" text-anchor="middle" font-weight="700">−</text>
        <text x="127" y="18" font-size="9" fill="var(--chalk-dim)">Cl⁻(aq)</text>
      </g>`;
    }
    return `<g font-family="var(--font-body)">
      <circle cx="18" cy="14" r="6" fill="var(--yellow)"/>
      <text x="30" y="18" font-size="9" fill="var(--chalk-dim)">C₆H₁₂O₆(aq) glucose</text>
    </g>`;
  }

  function draw() {
    const cx = 110, cy = 95, r = 80;
    let s = drawLegend();
    s += `<path d="M${cx - r} ${cy - 30} L${cx - r} ${cy + r - 20} Q${cx - r} ${cy + r} ${cx - r + 20} ${cy + r} L${cx + r - 20} ${cy + r} Q${cx + r} ${cy + r} ${cx + r} ${cy + r - 20} L${cx + r} ${cy - 30}" fill="rgba(90,150,210,0.15)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    // solvant : petits points bleu clair, en fond
    SOLVENT_POS.forEach(([u, v]) => {
      const x = cx + u * (r - 15), y = cy + 15 + v * (r - 35);
      s += `<circle cx="${x}" cy="${y}" r="1.6" fill="#5a96d2" opacity="0.5"/>`;
    });

    if (mode === "ionic") {
      // paires d'ions +/- réparties
      const IONS = [[-45, -10], [-10, 10], [30, -20], [50, 30], [-30, 40], [10, -40]];
      IONS.forEach(([dx, dy], i) => {
        const x = cx + dx, y = cy + 10 + dy;
        const isPos = i % 2 === 0;
        s += `<circle cx="${x}" cy="${y}" r="7" fill="${isPos ? 'var(--coral)' : 'var(--teal)'}"/>`;
        s += `<text x="${x}" y="${y + 3}" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">${isPos ? '+' : '−'}</text>`;
      });
    } else {
      // molécules neutres, un seul type de point (glucose par ex.)
      const MOLS = [[-45, -10], [-10, 10], [30, -20], [50, 30], [-30, 40], [10, -40], [0, 0]];
      MOLS.forEach(([dx, dy]) => {
        const x = cx + dx, y = cy + 10 + dy;
        s += `<circle cx="${x}" cy="${y}" r="6" fill="var(--yellow)"/>`;
      });
    }

    svg.innerHTML = s;
    readout.innerHTML = (mode === "ionic"
      ? "Soluté ionique : ex. Na⁺(aq) + Cl⁻(aq) — des ions positifs (Na⁺, en corail) et négatifs (Cl⁻, en bleu-vert) dissous dans le solvant."
      : "Soluté moléculaire : ex. C₆H₁₂O₆(aq) le glucose — des molécules neutres (en jaune) dissoutes dans le solvant.")
      + `<br><span style="color:var(--chalk-dim); font-size:0.85em;">L'indice (aq) se lit « aqueux » : il indique que l'espèce est dissoute dans l'eau, donc en solution aqueuse.</span>`;
  }

  btnIonic.addEventListener("click", () => { mode = "ionic"; draw(); });
  btnMolecular.addEventListener("click", () => { mode = "molecular"; draw(); });
  draw();
}

/* ---------- 2. Calculateur de concentration en masse (avec saturation) ---------- */
function initMassConcentration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const SOLUBILITY = 200; // g/L — solubilité maximale fixée pour l'exemple pédagogique

  function draw() {
    const m = Number(mRange.value); // g
    const V = Number(vRange.value); // mL
    const Vl = V / 1000; // L
    const t = Vl > 0 ? m / Vl : 0;
    const saturated = t > SOLUBILITY;

    const x0 = 75, y0 = 20, x1 = 135, yBase = 150;
    let s = `<path d="M${x0} ${y0} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${y0}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    const fillH = Math.min(yBase - y0 - 4, (V / 500) * (yBase - y0));
    s += `<rect x="${x0 + 2}" y="${yBase - fillH}" width="${x1 - x0 - 4}" height="${fillH - 4}" fill="rgba(107,191,171,0.4)"/>`;

    // soluté dissous : nombre de points proportionnel à la partie dissoute (plafonnée à la solubilité)
    const tDissolved = Math.min(t, SOLUBILITY);
    const dotCount = Math.min(20, Math.round(tDissolved / 3));
    const pos = generateDotsInEllipse(dotCount, 0, 0, 1, 1);
    const depositZoneH = saturated ? 14 : 0;
    pos.forEach(([u, v]) => {
      const x = (x0 + x1) / 2 + u * (x1 - x0 - 10) / 2;
      const y = yBase - depositZoneH - 8 - Math.abs(v) * (fillH - depositZoneH - 12);
      if (y > yBase - fillH) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="var(--yellow)"/>`;
    });

    // soluté non dissous (dépôt), si saturation dépassée
    if (saturated) {
      const excess = t - SOLUBILITY;
      const depositCount = Math.min(16, Math.max(2, Math.round(excess / 12)));
      for (let i = 0; i < depositCount; i++) {
        const frac = depositCount > 1 ? i / (depositCount - 1) : 0.5;
        const layer = Math.floor(i / 6);
        const x = x0 + 8 + frac * (x1 - x0 - 16) + Math.sin(i * 12.9) * 2;
        const y = yBase - 4 - layer * 4;
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="var(--yellow)" stroke="var(--coral)" stroke-width="0.7"/>`;
      }
      s += `<rect x="${x0 + 2}" y="${yBase - 12}" width="${x1 - x0 - 4}" height="10" fill="rgba(217,122,99,0.18)" stroke="var(--coral)" stroke-width="1.2" stroke-dasharray="3,2"/>`;
    }

    svg.innerHTML = s;

    const tColor = saturated ? "var(--coral)" : "var(--yellow)";
    const baseFrac = `t = <span class="frac"><span class="num">m</span><span class="den">V</span></span> = <span class="frac"><span class="num">${m.toFixed(1)} g</span><span class="den">${Vl.toFixed(3)} L</span></span> = <strong style="color:${tColor}">${t.toFixed(1)} g/L</strong>`;
    readout.innerHTML = saturated
      ? `${baseFrac}<br><span style="color:var(--coral); font-weight:700;">⚠️ Solution saturée ! Tout le soluté ne peut pas se dissoudre (dépôt au fond). La concentration dissoute maximale reste bloquée à ${SOLUBILITY} g/L.</span>`
      : `${baseFrac}<br><span style="color:var(--teal);">Solution homogène / non saturée.</span>`;
  }
  mRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Préparation par dissolution (balance électronique + fiole/entonnoir) ---------- */
function initDissolutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tRange = document.getElementById(cfg.tRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_M = 15; // g, borne haute réaliste (t max 30 g/L × V max 500 mL)

  function draw() {
    const t = Number(tRange.value); // g/L
    const V = Number(vRange.value); // mL
    const m = t * (V / 1000); // g
    const mClamped = Math.min(m, MAX_M);
    const heapScale = mClamped / MAX_M; // 0..1, proportion de poudre visible

    let s = "";

    /* ---- Balance électronique de laboratoire ---- */
    const baseX = 8, baseY = 108, baseW = 96, baseH = 34;
    s += `<rect x="${baseX}" y="${baseY}" width="${baseW}" height="${baseH}" rx="5" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;

    // écran digital LCD affichant la masse en direct
    const lcdX = baseX + 8, lcdY = baseY + 6, lcdW = 58, lcdH = 20;
    s += `<rect x="${lcdX}" y="${lcdY}" width="${lcdW}" height="${lcdH}" rx="2" fill="#16241a" stroke="#3a5a3a" stroke-width="1"/>`;
    s += `<text x="${lcdX + lcdW - 5}" y="${lcdY + lcdH / 2 + 4}" font-size="10" font-family="monospace" fill="var(--yellow)" text-anchor="end">${m.toFixed(2)} g</text>`;
    s += `<circle cx="${baseX + baseW - 12}" cy="${baseY + baseH - 10}" r="4" fill="var(--chalk-dim)" opacity="0.55"/>`;

    // plateau de pesée
    const plateCx = baseX + 30, plateY = baseY - 3;
    s += `<rect x="${plateCx - 26}" y="${plateY}" width="52" height="6" rx="2" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;

    // coupelle de pesée (verre de montre)
    const dishCy = plateY - 6;
    s += `<ellipse cx="${plateCx}" cy="${dishCy}" rx="22" ry="6" fill="rgba(90,150,210,0.18)" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
    s += `<ellipse cx="${plateCx}" cy="${dishCy - 1.5}" rx="19" ry="4.3" fill="none" stroke="var(--chalk-dim)" stroke-width="1"/>`;

    // tas de poudre jaune, proportionnel à m
    if (heapScale > 0.01) {
      const heapRx = 3 + heapScale * 15, heapRy = 2 + heapScale * 6.5;
      s += `<ellipse cx="${plateCx}" cy="${(dishCy - 2.5).toFixed(1)}" rx="${heapRx.toFixed(1)}" ry="${heapRy.toFixed(1)}" fill="var(--yellow)" opacity="0.9"/>`;
      const grains = Math.min(10, Math.round(heapScale * 10));
      for (let i = 0; i < grains; i++) {
        const ang = i * 2.4;
        const gx = plateCx + Math.cos(ang) * heapRx * 0.55;
        const gy = (dishCy - 2.5) + Math.sin(ang) * heapRy * 0.5;
        s += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="0.9" fill="#b89a2e"/>`;
      }
    }

    /* ---- Fiole jaugée surmontée d'un entonnoir à solide ---- */
    const fx = 168, fTop = 28, fNeck = 58, fBase = 138;

    // entonnoir à solide, posé au-dessus du col
    s += `<path d="M${fx - 22} ${fTop - 24} L${fx + 22} ${fTop - 24} L${fx + 5} ${fTop - 4} L${fx - 5} ${fTop - 4} Z" fill="rgba(90,150,210,0.12)" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    s += `<line x1="${fx - 5}" y1="${fTop - 4}" x2="${fx - 3}" y2="${fTop + 4}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    s += `<line x1="${fx + 5}" y1="${fTop - 4}" x2="${fx + 3}" y2="${fTop + 4}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;

    // corps de la fiole jaugée
    s += `<path d="M${fx - 8} ${fTop} L${fx - 8} ${fNeck} L${fx - 28} ${fBase - 10} Q${fx - 30} ${fBase} ${fx - 18} ${fBase} L${fx + 18} ${fBase} Q${fx + 30} ${fBase} ${fx + 28} ${fBase - 10} L${fx + 8} ${fNeck} L${fx + 8} ${fTop}" fill="rgba(90,150,210,0.15)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    // trait de jauge
    s += `<line x1="${fx - 28}" y1="${fBase - 22}" x2="${fx + 28}" y2="${fBase - 22}" stroke="var(--coral)" stroke-width="1.4" stroke-dasharray="3,2"/>`;
    s += `<text x="${fx}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">V = ${V} mL</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `m = t × V<sub>solution</sub> = ${t.toFixed(1)} × ${(V / 1000).toFixed(3)} = <strong style="color:var(--yellow)">${m.toFixed(2)} g</strong> à peser`;
  }
  tRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Préparation par dilution (avec pipette jaugée) ---------- */
function initDilutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tmRange = document.getElementById(cfg.tmRangeId);
  const fRange = document.getElementById(cfg.fRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const VF_FIXED = 100; // mL, volume final fixé pour l'exemple
  const TM_MAX = 30; // g/L, borne haute du curseur t_m, référence commune pour l'opacité

  function draw() {
    const tm = Number(tmRange.value);
    const F = Number(fRange.value);
    const tf = tm / F;
    const Vm = VF_FIXED / F;

    // fiole (mère ou fille) : la teinte (opacité) est proportionnelle à la concentration réelle
    function flask(x, tVal, label) {
      const fTop = 16, fNeck = 42, fBase = 122;
      const alpha = 0.10 + Math.min(1, tVal / TM_MAX) * 0.80;
      let s = `<path d="M${x - 6} ${fTop} L${x - 6} ${fNeck} L${x - 22} ${fBase - 8} Q${x - 24} ${fBase} ${x - 14} ${fBase} L${x + 14} ${fBase} Q${x + 24} ${fBase} ${x + 22} ${fBase - 8} L${x + 6} ${fNeck} L${x + 6} ${fTop}" fill="rgba(232,196,104,${alpha.toFixed(2)})" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      const dotCount = Math.max(1, Math.round((tVal / TM_MAX) * 14));
      const dots = generateDotsInEllipse(dotCount, 0, 0, 1, 1);
      dots.forEach(([u, v]) => {
        const dx = x + u * 15, dy = (fNeck + 8) + Math.abs(v) * (fBase - fNeck - 16);
        if (dy < fBase - 4) s += `<circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="2" fill="var(--yellow)" opacity="0.9"/>`;
      });
      s += `<text x="${x}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${label}</text>`;
      s += `<text x="${x}" y="${fBase + 25}" font-size="8" fill="var(--yellow)" text-anchor="middle" font-weight="700">${tVal.toFixed(1)} g/L</text>`;
      return s;
    }

    // pipette jaugée : matérialise le prélèvement du volume mère Vm
    // son opacité reprend celle de la solution mère (t_m), sur la même échelle que les fioles
    function pipette(x, tVal, vol) {
      const bulbCy = 12, bulbRx = 9, bulbRy = 7.5;
      const tubeTop = 21, tubeBottom = 92, tipY = 104;
      const alpha = 0.10 + Math.min(1, tVal / TM_MAX) * 0.80;
      const liquidTopY = tubeBottom - (tubeBottom - tubeTop) * 0.55;

      let s = `<ellipse cx="${x}" cy="${bulbCy}" rx="${bulbRx}" ry="${bulbRy}" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<line x1="${x}" y1="${bulbCy + bulbRy}" x2="${x}" y2="${tubeTop}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      // corps gradué de la pipette
      s += `<line x1="${x - 4}" y1="${tubeTop}" x2="${x - 4}" y2="${tubeBottom}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<line x1="${x + 4}" y1="${tubeTop}" x2="${x + 4}" y2="${tubeBottom}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      // repères de graduation
      for (let i = 1; i <= 3; i++) {
        const gy = tubeTop + (i / 4) * (tubeBottom - tubeTop);
        s += `<line x1="${x - 4}" y1="${gy.toFixed(1)}" x2="${x - 1.5}" y2="${gy.toFixed(1)}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
      }
      // liquide prélevé, même opacité que la solution mère
      s += `<rect x="${x - 4}" y="${liquidTopY.toFixed(1)}" width="8" height="${(tubeBottom - liquidTopY).toFixed(1)}" fill="rgba(232,196,104,${alpha.toFixed(2)})"/>`;
      s += `<line x1="${x - 6}" y1="${liquidTopY.toFixed(1)}" x2="${x + 6}" y2="${liquidTopY.toFixed(1)}" stroke="var(--coral)" stroke-width="1.2" stroke-dasharray="2,1.5"/>`;
      // pointe effilée
      s += `<path d="M${x - 4} ${tubeBottom} L${x} ${tipY} L${x + 4} ${tubeBottom} Z" fill="rgba(232,196,104,${alpha.toFixed(2)})" stroke="var(--chalk-dim)" stroke-width="1.3"/>`;
      s += `<text x="${x}" y="${tipY + 13}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">V\u2098 = ${vol.toFixed(1)} mL</text>`;
      return s;
    }

    function arrow(x1, y1, x2, y2) {
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1.5" marker-end="url(#dilArrow)"/>`;
    }

    let s = `<defs><marker id="dilArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += flask(38, tm, "mère (t\u2098)");
    s += arrow(62, 55, 92, 45);
    s += `<text x="77" y="40" font-size="7" fill="var(--teal)" text-anchor="middle">prélève</text>`;
    s += pipette(110, tm, Vm);
    s += arrow(128, 45, 158, 55);
    s += `<text x="143" y="40" font-size="7" fill="var(--teal)" text-anchor="middle">+ eau (×${F})</text>`;
    s += flask(182, tf, "fille (t\u0192)");

    svg.innerHTML = s;
    readout.innerHTML = `F = ${F} → V<sub>m</sub> à prélever = V<sub>f</sub>/F = ${VF_FIXED}/${F} = <strong style="color:var(--yellow)">${Vm.toFixed(1)} mL</strong><br>t<sub>f</sub> = t<sub>m</sub>/F = ${tm.toFixed(1)}/${F} = <strong style="color:var(--teal)">${tf.toFixed(1)} g/L</strong>`;
  }
  tmRange.addEventListener("input", draw);
  fRange.addEventListener("input", draw);
  draw();
}

/* ---------- 5. Gamme d'étalonnage (échelle de teintes) ---------- */
function initColorScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const sRange = document.getElementById(cfg.sRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const T_VALUES = [1, 2, 3, 4, 5]; // concentrations arbitraires croissantes des étalons

  function draw() {
    const sVal = Number(sRange.value); // position de S sur la même échelle (peut être non entière)
    const lower = Math.max(1, Math.floor(sVal));
    const upper = Math.min(5, Math.ceil(sVal));

    // rangée des étalons, en haut
    const tubeW = 26, gap = 10, startX = 15, tubeH = 65, y0 = 10;
    let s = "";
    const tubeCenterX = {};
    T_VALUES.forEach((t, i) => {
      const x = startX + i * (tubeW + gap);
      tubeCenterX[t] = x + tubeW / 2;
      const alpha = 0.15 + (t / 5) * 0.75;
      const isBracket = lower !== upper && (t === lower || t === upper);
      const strokeColor = isBracket ? "var(--teal)" : "var(--chalk-dim)";
      s += `<rect x="${x}" y="${y0}" width="${tubeW}" height="${tubeH}" rx="4" fill="rgba(217,122,99,${alpha})" stroke="${strokeColor}" stroke-width="${isBracket ? 2.5 : 1.5}"/>`;
      s += `<text x="${x + tubeW / 2}" y="${y0 + tubeH + 13}" font-size="9" fill="${strokeColor}" text-anchor="middle" font-weight="${isBracket ? '700' : '400'}">t${i + 1}</text>`;
    });

    // tube S, EN DESSOUS de la rangée, aligné sur sa position réelle sur l'échelle
    const sCenterX = startX + tubeW / 2 + (sVal - 1) * (tubeW + gap);
    const sY = y0 + tubeH + 40, sTubeH = 55;
    const sAlpha = 0.15 + (sVal / 5) * 0.75;

    // flèches d'encadrement, de S vers les étalons qui l'encadrent
    s += `<defs><marker id="csArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--teal)"/></marker></defs>`;
    const brackets = lower === upper ? [lower] : [lower, upper];
    brackets.forEach(t => {
      s += `<line x1="${sCenterX}" y1="${sY}" x2="${tubeCenterX[t]}" y2="${y0 + tubeH}" stroke="var(--teal)" stroke-width="1.6" stroke-dasharray="3,2" marker-end="url(#csArrow)"/>`;
    });

    s += `<rect x="${sCenterX - tubeW / 2}" y="${sY}" width="${tubeW}" height="${sTubeH}" rx="4" fill="rgba(217,122,99,${sAlpha})" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<text x="${sCenterX}" y="${sY + sTubeH + 14}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">S</text>`;

    svg.innerHTML = s;

    const encadrement = lower === upper
      ? `t ≈ t${lower} (même teinte qu'un étalon)`
      : `t${lower} &lt; t &lt; t${upper}`;
    readout.innerHTML = `En comparant la teinte de S à celle des étalons, on obtient l'encadrement : <strong style="color:var(--yellow)">${encadrement}</strong>`;
  }
  sRange.addEventListener("input", draw);
  draw();
}

/* ---------- 6. Défi Laboratoire & Verrerie (mode Entraînement) ---------- */
function initLabChallenge(cfg) {
  const promptEl = document.getElementById(cfg.promptId);
  const vmInput = document.getElementById(cfg.vmInputId);
  const pipetteSelect = document.getElementById(cfg.pipetteSelectId);
  const fioleSelect = document.getElementById(cfg.fioleSelectId);
  const newBtn = document.getElementById(cfg.newBtnId);
  const validateBtn = document.getElementById(cfg.validateBtnId);
  const feedback = document.getElementById(cfg.feedbackId);

  const VF_OPTIONS = [50, 100, 250];   // mL, volumes de fioles jaugées disponibles
  const VM_OPTIONS = [5, 10, 20];      // mL, volumes de pipettes jaugées disponibles
  const TF_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3]; // g/L, concentrations filles possibles

  let current = null;

  function pickChallenge() {
    let Vf, Vm;
    do {
      Vf = VF_OPTIONS[Math.floor(Math.random() * VF_OPTIONS.length)];
      Vm = VM_OPTIONS[Math.floor(Math.random() * VM_OPTIONS.length)];
    } while (Vm >= Vf);
    const F = Vf / Vm;
    const tf = TF_OPTIONS[Math.floor(Math.random() * TF_OPTIONS.length)];
    const tm = +(tf * F).toFixed(2);
    return { Vf, Vm, F, tf, tm };
  }

  function newChallenge() {
    current = pickChallenge();
    promptEl.innerHTML = `On souhaite préparer un volume V<sub>f</sub> = <strong style="color:var(--yellow)">${current.Vf} mL</strong> d'une solution fille de concentration t<sub>f</sub> = <strong style="color:var(--yellow)">${current.tf.toFixed(1)} g/L</strong> à partir d'une solution mère de concentration t<sub>m</sub> = <strong style="color:var(--yellow)">${current.tm.toFixed(1)} g/L</strong>.`;
    vmInput.value = "";
    pipetteSelect.value = "";
    fioleSelect.value = "";
    feedback.innerHTML = "";
  }

  function validate() {
    if (!current) return;
    const vmGiven = Number(vmInput.value);
    const vmOk = vmInput.value !== "" && Math.abs(vmGiven - current.Vm) <= 0.3;
    const pipetteOk = pipetteSelect.value === `pipette-${current.Vm}`;
    const fioleOk = fioleSelect.value === `fiole-${current.Vf}`;
    const allOk = vmOk && pipetteOk && fioleOk;

    let msg = "";
    msg += vmOk
      ? `<span style="color:var(--teal);">✅ V<sub>m</sub> = V<sub>f</sub>/F = ${current.Vf}/${current.F} = ${current.Vm} mL — correct.</span><br>`
      : `<span style="color:var(--coral);">❌ V<sub>m</sub> = V<sub>f</sub>/F = ${current.Vf}/${current.F} = <strong>${current.Vm} mL</strong> (ta réponse : ${vmInput.value !== "" ? vmInput.value : "—"}).</span><br>`;
    msg += pipetteOk
      ? `<span style="color:var(--teal);">✅ Verrerie de prélèvement adaptée : pipette jaugée ${current.Vm} mL.</span><br>`
      : `<span style="color:var(--coral);">❌ Il fallait une <strong>pipette jaugée de ${current.Vm} mL</strong> : la verrerie jaugée est obligatoire pour une précision analytique (une éprouvette graduée ou une pipette d'un autre volume ne conviennent pas).</span><br>`;
    msg += fioleOk
      ? `<span style="color:var(--teal);">✅ Verrerie de préparation adaptée : fiole jaugée ${current.Vf} mL.</span>`
      : `<span style="color:var(--coral);">❌ Il fallait une <strong>fiole jaugée de ${current.Vf} mL</strong> : un bécher ou une fiole d'un autre volume ne garantissent pas le volume final exact.</span>`;

    feedback.innerHTML = msg;

    if (allOk && cfg.chapterId && cfg.activityId) {
      ProgressStore.record(cfg.chapterId, cfg.activityId, true);
    }
  }

  newBtn.addEventListener("click", newChallenge);
  validateBtn.addEventListener("click", validate);
  newChallenge();
}
