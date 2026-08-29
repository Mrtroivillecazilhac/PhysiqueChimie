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

  function draw() {
    const cx = 110, cy = 95, r = 80;
    let s = `<path d="M${cx - r} ${cy - 30} L${cx - r} ${cy + r - 20} Q${cx - r} ${cy + r} ${cx - r + 20} ${cy + r} L${cx + r - 20} ${cy + r} Q${cx + r} ${cy + r} ${cx + r} ${cy + r - 20} L${cx + r} ${cy - 30}" fill="rgba(90,150,210,0.15)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

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
    readout.textContent = mode === "ionic"
      ? "Soluté ionique : ex. Na⁺(aq) + Cl⁻(aq) — des ions positifs et négatifs dissous dans le solvant."
      : "Soluté moléculaire : ex. C₆H₁₂O₆(aq) le glucose — des molécules neutres dissoutes dans le solvant.";
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

  function draw() {
    const t = Number(tRange.value); // g/L
    const V = Number(vRange.value); // mL
    const m = t * (V / 1000); // g

    // spatule + petit tas de poudre, taille proportionnelle à m
    const heapR = 6 + Math.min(20, m * 3);
    let s = `<rect x="20" y="60" width="40" height="6" rx="3" fill="var(--chalk-dim)"/>`;
    s += `<circle cx="40" cy="90" r="${heapR}" fill="var(--yellow)" opacity="0.85"/>`;
    s += `<text x="40" y="${90 + heapR + 16}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">masse à peser</text>`;

    // fiole jaugée
    const fx = 130, fTop = 20, fNeck = 55, fBase = 140;
    s += `<path d="M${fx - 8} ${fTop} L${fx - 8} ${fNeck} L${fx - 30} ${fBase - 10} Q${fx - 32} ${fBase} ${fx - 20} ${fBase} L${fx + 20} ${fBase} Q${fx + 32} ${fBase} ${fx + 30} ${fBase - 10} L${fx + 8} ${fNeck} L${fx + 8} ${fTop}" fill="rgba(90,150,210,0.15)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${fx - 30}" y1="${fBase - 24}" x2="${fx + 30}" y2="${fBase - 24}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="3,2"/>`;
    s += `<text x="${fx}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">fiole jaugée, trait de jauge</text>`;

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

  function draw() {
    const tm = Number(tmRange.value);
    const F = Number(fRange.value);
    const tf = tm / F;
    const Vm = VF_FIXED / F;

    // deux fioles : mère (teinte foncée) et fille (teinte plus claire, proportionnelle à tf/tm)
    function flask(x, colorAlpha, label) {
      const fTop = 20, fNeck = 45, fBase = 130;
      let s = `<path d="M${x - 6} ${fTop} L${x - 6} ${fNeck} L${x - 22} ${fBase - 8} Q${x - 24} ${fBase} ${x - 14} ${fBase} L${x + 14} ${fBase} Q${x + 24} ${fBase} ${x + 22} ${fBase - 8} L${x + 6} ${fNeck} L${x + 6} ${fTop}" fill="rgba(232,196,104,${colorAlpha})" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<text x="${x}" y="${fBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${label}</text>`;
      return s;
    }
    let s = flask(55, 0.85, "mère (t\u2098)");
    s += `<line x1="85" y1="70" x2="115" y2="70" stroke="var(--chalk-dim)" stroke-width="1.6" marker-end="url(#dilArrow)"/>`;
    s += `<defs><marker id="dilArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += flask(150, Math.max(0.08, 0.85 / F), "fille (t\u0192)");

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

    const tubeW = 24, gap = 10, startX = 20, tubeH = 120, y0 = 15;
    let s = "";
    T_VALUES.forEach((t, i) => {
      const x = startX + i * (tubeW + gap);
      const alpha = 0.15 + (t / 5) * 0.75;
      s += `<rect x="${x}" y="${y0}" width="${tubeW}" height="${tubeH}" rx="4" fill="rgba(217,122,99,${alpha})" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<text x="${x + tubeW / 2}" y="${y0 + tubeH + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">t${i + 1}</text>`;
    });

    // tube S, teinte interpolée selon sa position
    const sx = startX + 5 * (tubeW + gap) + 10;
    const sAlpha = 0.15 + (sVal / 5) * 0.75;
    s += `<rect x="${sx}" y="${y0}" width="${tubeW}" height="${tubeH}" rx="4" fill="rgba(217,122,99,${sAlpha})" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<text x="${sx + tubeW / 2}" y="${y0 + tubeH + 14}" font-size="9" fill="var(--yellow)" text-anchor="middle">S</text>`;

    svg.innerHTML = s;

    const lower = Math.floor(sVal), upper = Math.ceil(sVal);
    const encadrement = lower === upper
      ? `t ≈ t${lower} (même teinte qu'un étalon)`
      : `t${lower} &lt; t &lt; t${upper}`;
    readout.innerHTML = `En comparant la teinte de S à celle des étalons, on obtient l'encadrement : <strong style="color:var(--yellow)">${encadrement}</strong>`;
  }
  sRange.addEventListener("input", draw);
  draw();
}
