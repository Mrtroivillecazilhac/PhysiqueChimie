/* Animations du chapitre 8 — 2nde — "La mole"
   Version simple (raw) : à raffiner plus tard. */

const ATOM_MASS = { C: 2.00e-26, O: 2.67e-26 }; // kg, valeurs du manuel

/* ---------- 1. Calculateur de masse d'une entité ---------- */
function initEntityMass(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnCO2 = document.getElementById(cfg.btnCO2Id);
  const btnCO = document.getElementById(cfg.btnCOId);
  const btnO2 = document.getElementById(cfg.btnO2Id);

  const SPECIES = {
    co2: { formula: "CO₂", nC: 1, nO: 2 },
    co: { formula: "CO", nC: 1, nO: 1 },
    o2: { formula: "O₂", nC: 0, nO: 2 }
  };
  let current = "co2";

  function draw() {
    const sp = SPECIES[current];
    const mEntite = sp.nC * ATOM_MASS.C + sp.nO * ATOM_MASS.O;

    const cx = 110, cy = 80;
    let s = "";
    let atoms = [];
    for (let i = 0; i < sp.nC; i++) atoms.push({ label: "C", color: "var(--chalk)" });
    for (let i = 0; i < sp.nO; i++) atoms.push({ label: "O", color: "var(--coral)" });
    const spacing = 50;
    const startX = cx - (atoms.length - 1) * spacing / 2;
    atoms.forEach((a, i) => {
      const x = startX + i * spacing;
      s += `<circle cx="${x}" cy="${cy}" r="16" fill="${a.color}"/>`;
      s += `<text x="${x}" y="${cy + 5}" font-size="13" fill="var(--board)" text-anchor="middle" font-weight="700">${a.label}</text>`;
      if (i > 0) s += `<line x1="${startX + (i - 1) * spacing + 16}" y1="${cy}" x2="${x - 16}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    });
    svg.innerHTML = s;

    const detail = sp.nC > 0 && sp.nO > 0
      ? `${sp.nC}×m<sub>C</sub> + ${sp.nO}×m<sub>O</sub>`
      : (sp.nC > 0 ? `${sp.nC}×m<sub>C</sub>` : `${sp.nO}×m<sub>O</sub>`);
    readout.innerHTML = `m(${sp.formula}) = ${detail} = <strong style="color:var(--yellow)">${mEntite.toExponential(2)} kg</strong>`;
  }
  btnCO2.addEventListener("click", () => { current = "co2"; draw(); });
  btnCO.addEventListener("click", () => { current = "co"; draw(); });
  btnO2.addEventListener("click", () => { current = "o2"; draw(); });
  draw();
}

/* ---------- 2. Calculateur du nombre d'entités N ---------- */
function initEntityCount(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const mEntite = 7.35e-26; // kg, masse d'une molécule de CO2 (valeur du manuel)

  function draw() {
    const m = Number(mRange.value); // kg
    const N = m / mEntite;

    const x0 = 70, y0 = 20, x1 = 150, yBase = 140;
    let s = `<path d="M${x0} ${y0} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${y0}" fill="rgba(232,196,104,0.35)" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yBase + 18}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">CO₂, m = ${m} kg</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `N = <span class="frac"><span class="num">m</span><span class="den">m<sub>entité</sub></span></span> = <span class="frac"><span class="num">${m} kg</span><span class="den">7,35×10⁻²⁶ kg</span></span> = <strong style="color:var(--yellow)">${N.toExponential(1)}</strong> molécules`;
  }
  mRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Calculateur de quantité de matière n ---------- */
function initMoleAmount(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const NA = 6.02e23; // mol^-1

  function draw() {
    const exponent = Number(nRange.value); // exposant de N = 10^exponent (mantisse 1,4 fixe pour rester proche de l'exemple)
    const N = 1.4 * Math.pow(10, exponent);
    const n = N / NA;

    const barMaxH = 120, x0 = 90;
    const h = Math.min(barMaxH, Math.max(4, (Math.log10(n + 1) / 30) * barMaxH * 10));
    let s = `<rect x="${x0}" y="${150 - barMaxH}" width="35" height="${barMaxH}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<rect x="${x0}" y="${150 - h}" width="35" height="${h}" fill="var(--teal)"/>`;
    svg.innerHTML = s;

    readout.innerHTML = `N ≈ ${N.toExponential(1)} entités → n = <span class="frac"><span class="num">N</span><span class="den">N<sub>A</sub></span></span> = <span class="frac"><span class="num">${N.toExponential(1)}</span><span class="den">6,02×10²³ mol⁻¹</span></span> = <strong style="color:var(--yellow)">${n.toExponential(1)} mol</strong>`;
  }
  nRange.addEventListener("input", draw);
  draw();
}
