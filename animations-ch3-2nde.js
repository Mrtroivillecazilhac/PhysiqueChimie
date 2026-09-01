/* Animations du chapitre 2 — 2nde — "Solutions aqueuses"
   Version simple (raw) : à raffiner plus tard. */

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

/* ---------- 2. Calculateur de concentration en masse ---------- */
function initMassConcentration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const m = Number(mRange.value); // g
    const V = Number(vRange.value); // mL
    const Vl = V / 1000; // L
    const t = Vl > 0 ? m / Vl : 0;

    const x0 = 75, y0 = 20, x1 = 135, yBase = 150;
    let s = `<path d="M${x0} ${y0} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${y0}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    const fillH = Math.min(yBase - y0 - 4, (V / 500) * (yBase - y0));
    s += `<rect x="${x0 + 2}" y="${yBase - fillH}" width="${x1 - x0 - 4}" height="${fillH - 4}" fill="rgba(107,191,171,0.4)"/>`;
    // quelques points de soluté, nombre indicatif proportionnel à t
    const dotCount = Math.min(20, Math.round(t / 3));
    const pos = generateDotsInEllipse(dotCount, 0, 0, 1, 1);
    pos.forEach(([u, v]) => {
      const x = (x0 + x1) / 2 + u * (x1 - x0 - 10) / 2;
      const y = yBase - 8 - Math.abs(v) * (fillH - 12);
      if (y > yBase - fillH) s += `<circle cx="${x}" cy="${y}" r="2.2" fill="var(--yellow)"/>`;
    });
    svg.innerHTML = s;

    readout.innerHTML = `t = <span class="frac"><span class="num">m</span><span class="den">V</span></span> = <span class="frac"><span class="num">${m.toFixed(1)} g</span><span class="den">${(Vl).toFixed(3)} L</span></span> = <strong style="color:var(--yellow)">${t.toFixed(1)} g/L</strong>`;
  }
  mRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Préparation par dissolution ---------- */
function initDissolutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tRange = document.getElementById(cfg.tRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_M = 15; // g, borne haute réaliste (t max 30 g/L × V max 500 mL)
  const PIVOT_Y = 14, PLATE_Y_MIN = 55, PLATE_Y_MAX = 100;

  function draw() {
    const t = Number(tRange.value); // g/L
    const V = Number(vRange.value); // mL
    const m = t * (V / 1000); // g
    const mClamped = Math.min(m, MAX_M);
    const plateY = PLATE_Y_MIN + (mClamped / MAX_M) * (PLATE_Y_MAX - PLATE_Y_MIN);

    // balance analogique : la BILLE garde une taille fixe, seule sa
    // position (via le plateau) varie avec la masse m à peser
    let s = `<rect x="10" y="7" width="70" height="7" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<rect x="42" y="1" width="6" height="13" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<line x1="88" y1="${PLATE_Y_MIN}" x2="88" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.3"/>`;
    for (let i = 0; i <= 5; i++) {
      const v = (i / 5) * MAX_M;
      const y = PLATE_Y_MIN + (v / MAX_M) * (PLATE_Y_MAX - PLATE_Y_MIN);
      s += `<line x1="84" y1="${y}" x2="92" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.1"/>`;
      s += `<text x="95" y="${y + 3}" font-size="6.5" fill="var(--chalk-dim)">${v.toFixed(0)}g</text>`;
    }
    const segs = 5, zx = 8;
    let spring = `M45 ${PIVOT_Y + 9}`;
    for (let i = 1; i <= segs; i++) {
      const y = PIVOT_Y + 9 + (plateY - PIVOT_Y - 9) * (i / segs);
      spring += ` L${45 + (i % 2 === 0 ? zx : -zx)} ${y}`;
    }
    s += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="18" y1="${plateY}" x2="72" y2="${plateY}" stroke="var(--yellow)" stroke-width="1.8" stroke-dasharray="3,2"/>`;
    s += `<ellipse cx="45" cy="${plateY}" rx="26" ry="5" fill="rgba(0,0,0,0.2)" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    const objR = 12;
    s += `<circle cx="45" cy="${plateY - objR - 2}" r="${objR}" fill="var(--yellow)" opacity="0.85" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="45" y="${plateY - objR - 2 + 3}" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">m</text>`;

    // fiole jaugée à côté
    const fx = 155, fTop = 12, fNeck = 42, fBase = 120;
    s += `<path d="M${fx - 8} ${fTop} L${fx - 8} ${fNeck} L${fx - 28} ${fBase - 10} Q${fx - 30} ${fBase} ${fx - 18} ${fBase} L${fx + 18} ${fBase} Q${fx + 30} ${fBase} ${fx + 28} ${fBase - 10} L${fx + 8} ${fNeck} L${fx + 8} ${fTop}" fill="rgba(90,150,210,0.15)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${fx - 28}" y1="${fBase - 22}" x2="${fx + 28}" y2="${fBase - 22}" stroke="var(--coral)" stroke-width="1.4" stroke-dasharray="3,2"/>`;
    s += `<text x="${fx}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">V = ${V} mL</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `m = t × V<sub>solution</sub> = ${t.toFixed(1)} × ${(V / 1000).toFixed(3)} = <strong style="color:var(--yellow)">${m.toFixed(2)} g</strong> à peser`;
  }
  tRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Préparation par dilution ---------- */
function initDilutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tmRange = document.getElementById(cfg.tmRangeId);
  const fRange = document.getElementById(cfg.fRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const VF_FIXED = 100; // mL, volume final fixé pour l'exemple
  const TM_MAX = 30; // g/L, borne haute du curseur t_m, sert de référence commune pour l'opacité

  function draw() {
    const tm = Number(tmRange.value);
    const F = Number(fRange.value);
    const tf = tm / F;
    const Vm = VF_FIXED / F;

    // deux fioles : la teinte (opacité) de chacune est directement proportionnelle
    // à SA concentration réelle sur la même échelle (0 → TM_MAX) : plus t est
    // grand, plus la fiole est opaque ; plus t est petit, plus elle est translucide.
    function flask(x, tVal, label) {
      const fTop = 16, fNeck = 42, fBase = 122;
      const alpha = 0.10 + Math.min(1, tVal / TM_MAX) * 0.80;
      let s = `<path d="M${x - 6} ${fTop} L${x - 6} ${fNeck} L${x - 22} ${fBase - 8} Q${x - 24} ${fBase} ${x - 14} ${fBase} L${x + 14} ${fBase} Q${x + 24} ${fBase} ${x + 22} ${fBase - 8} L${x + 6} ${fNeck} L${x + 6} ${fTop}" fill="rgba(232,196,104,${alpha.toFixed(2)})" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      // points de soluté, nombre proportionnel à tVal : moins nombreux quand la solution est diluée
      const dotCount = Math.max(1, Math.round((tVal / TM_MAX) * 14));
      const dots = generateDotsInEllipse(dotCount, 0, 0, 1, 1);
      dots.forEach(([u, v]) => {
        const dx = x + u * 15, dy = (fNeck + 8) + Math.abs(v) * (fBase - fNeck - 16);
        if (dy < fBase - 4) s += `<circle cx="${dx}" cy="${dy}" r="2" fill="var(--yellow)" opacity="0.9"/>`;
      });
      s += `<text x="${x}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${label}</text>`;
      s += `<text x="${x}" y="${fBase + 25}" font-size="8" fill="var(--yellow)" text-anchor="middle" font-weight="700">${tVal.toFixed(1)} g/L</text>`;
      return s;
    }
    let s = flask(55, tm, "mère (t\u2098)");
    s += `<line x1="85" y1="62" x2="115" y2="62" stroke="var(--chalk-dim)" stroke-width="1.6" marker-end="url(#dilArrow)"/>`;
    s += `<text x="100" y="55" font-size="7.5" fill="var(--teal)" text-anchor="middle">+ eau (×${F})</text>`;
    s += `<defs><marker id="dilArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += flask(150, tf, "fille (t\u0192)");

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
