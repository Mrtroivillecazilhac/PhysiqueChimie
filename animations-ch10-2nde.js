/* Animations du chapitre 10 — 2nde — "Transformation physique"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Les 6 changements d'état ---------- */
function initStateChanges(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const TRANSITIONS = {
    fusion: { from: "S", to: "L", name: "Fusion", type: "endo" },
    solidification: { from: "L", to: "S", name: "Solidification", type: "exo" },
    vaporisation: { from: "L", to: "G", name: "Vaporisation", type: "endo" },
    liquefaction: { from: "G", to: "L", name: "Liquéfaction", type: "exo" },
    sublimation: { from: "S", to: "G", name: "Sublimation", type: "endo" },
    condensation: { from: "G", to: "S", name: "Condensation", type: "exo" }
  };
  const keys = ["fusion", "solidification", "vaporisation", "liquefaction", "sublimation", "condensation"];
  let current = "fusion";

  const POS = { S: [40, 110], L: [110, 110], G: [180, 110] };

  function draw() {
    const t = TRANSITIONS[current];
    let s = `<defs><marker id="scArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;

    ["S", "L", "G"].forEach(letter => {
      const [x, y] = POS[letter];
      const isActive = (letter === t.from || letter === t.to);
      s += `<rect x="${x - 20}" y="${y - 15}" width="40" height="30" rx="5" fill="${isActive ? 'rgba(232,196,104,0.25)' : 'rgba(255,255,255,0.04)'}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<text x="${x}" y="${y + 5}" font-size="12" fill="${isActive ? 'var(--yellow)' : 'var(--chalk-dim)'}" text-anchor="middle" font-weight="700">${letter}</text>`;
    });

    const [x1] = POS[t.from], [x2] = POS[t.to];
    const yArrow = t.from < t.to || (t.from === "G" || t.to === "G" && t.from !== "S") ? 85 : 135;
    const arrowY = (t.from === "S" && t.to === "G") || (t.from === "G" && t.to === "S") ? 60 : (POS[t.from][1]);
    if (POS[t.from][0] < POS[t.to][0]) {
      s += `<line x1="${POS[t.from][0] + 22}" y1="${arrowY - 20}" x2="${POS[t.to][0] - 22}" y2="${arrowY - 20}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#scArrow)"/>`;
    } else {
      s += `<line x1="${POS[t.from][0] - 22}" y1="${arrowY - 20}" x2="${POS[t.to][0] + 22}" y2="${arrowY - 20}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#scArrow)"/>`;
    }
    svg.innerHTML = s;

    const typeLabel = t.type === "endo" ? "endothermique (Q > 0)" : "exothermique (Q < 0)";
    readout.innerHTML = `<strong style="color:var(--yellow)">${t.name}</strong> : ${t.from} → ${t.to}. C'est une transformation <strong style="color:${t.type === 'endo' ? 'var(--teal)' : 'var(--coral)'}">${typeLabel}</strong>.`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- 2. Palier de température lors d'un changement d'état ---------- */
function initTemperaturePlateau(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFusion = document.getElementById(cfg.btnFusionId);
  const btnVapo = document.getElementById(cfg.btnVapoId);

  let mode = "fusion";

  function draw() {
    const x0 = 30, y0 = 15, x1 = 230, y1 = 140;
    let s = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${y1 + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">temps</text>`;
    s += `<text x="${x0 - 12}" y="${y0 - 4}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">T</text>`;

    let path, plateauY, plateauX1, plateauX2, label;
    if (mode === "fusion") {
      plateauY = y0 + 90; plateauX1 = x0 + 50; plateauX2 = x0 + 120;
      path = `M${x0 + 10} ${y0 + 100} L${plateauX1} ${plateauY} L${plateauX2} ${plateauY} L${x1 - 20} ${y0 + 20}`;
      label = "palier à T_fus (S + L coexistent)";
    } else {
      plateauY = y0 + 40; plateauX1 = x0 + 70; plateauX2 = x0 + 150;
      path = `M${x0 + 10} ${y0 + 90} L${plateauX1} ${plateauY} L${plateauX2} ${plateauY} L${x1 - 20} ${y0 + 10}`;
      label = "palier à T_éb (L + G coexistent)";
    }
    s += `<path d="${path}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>`;
    s += `<line x1="${plateauX1}" y1="${plateauY}" x2="${plateauX2}" y2="${plateauY}" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="3,3"/>`;
    s += `<text x="${(plateauX1 + plateauX2) / 2}" y="${plateauY - 8}" font-size="7.5" fill="var(--yellow)" text-anchor="middle">${label}</text>`;
    svg.innerHTML = s;

    readout.textContent = mode === "fusion"
      ? "Pendant la fusion, la température reste constante à T_fus : le solide et le liquide coexistent."
      : "Pendant la vaporisation, la température reste constante à T_éb : le liquide et le gaz coexistent.";
  }
  btnFusion.addEventListener("click", () => { mode = "fusion"; draw(); });
  btnVapo.addEventListener("click", () => { mode = "vapo"; draw(); });
  draw();
}

/* ---------- 3. Équation d'un changement d'état ---------- */
function initStateEquation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFusion = document.getElementById(cfg.btnFusionId);
  const btnVapo = document.getElementById(cfg.btnVapoId);
  const btnSublim = document.getElementById(cfg.btnSublimId);

  const EQUATIONS = {
    fusion: { text: "H₂O(s) → H₂O(ℓ)", desc: "Fusion de l'eau : passage de l'état solide à l'état liquide." },
    vapo: { text: "H₂O(ℓ) → H₂O(g)", desc: "Vaporisation de l'eau : passage de l'état liquide à l'état gazeux." },
    sublim: { text: "CO₂(s) → CO₂(g)", desc: "Sublimation du dioxyde de carbone (neige carbonique) : passage direct de l'état solide à l'état gazeux." }
  };
  let current = "fusion";

  function draw() {
    const eq = EQUATIONS[current];
    let s = `<text x="110" y="70" font-size="15" fill="var(--yellow)" text-anchor="middle">${eq.text}</text>`;
    svg.innerHTML = s;
    readout.textContent = eq.desc;
  }
  btnFusion.addEventListener("click", () => { current = "fusion"; draw(); });
  btnVapo.addEventListener("click", () => { current = "vapo"; draw(); });
  btnSublim.addEventListener("click", () => { current = "sublim"; draw(); });
  draw();
}

/* ---------- 4. Calculateur d'énergie Q = m × L ---------- */
function initStateEnergy(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFusion = document.getElementById(cfg.btnFusionId);
  const btnVapo = document.getElementById(cfg.btnVapoId);

  const L_VALUES = { fusion: { L: 334, name: "fusion de l'eau" }, vapo: { L: 2257, name: "vaporisation de l'eau" } }; // kJ/kg
  let mode = "fusion";

  function draw() {
    const m = Number(mRange.value); // kg
    const L = L_VALUES[mode].L;
    const Q = m * L; // kJ

    const barMaxH = 120, x0 = 90;
    const h = Math.min(barMaxH, (Q / 3000) * barMaxH);
    let s = `<rect x="${x0}" y="${150 - barMaxH}" width="35" height="${barMaxH}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<rect x="${x0}" y="${150 - h}" width="35" height="${h}" fill="var(--teal)"/>`;
    svg.innerHTML = s;

    readout.innerHTML = `Q = m × L = ${m} kg × ${L} kJ/kg = <strong style="color:var(--yellow)">${Q.toFixed(0)} kJ</strong> pour la ${L_VALUES[mode].name}.`;
  }
  mRange.addEventListener("input", draw);
  btnFusion.addEventListener("click", () => { mode = "fusion"; draw(); });
  btnVapo.addEventListener("click", () => { mode = "vapo"; draw(); });
  draw();
}

/* ---------- 5. Méthode des mélanges (calorimètre) ---------- */
function initMixtureMethod(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const q1Range = document.getElementById(cfg.q1RangeId);
  const q2Range = document.getElementById(cfg.q2RangeId);
  const q3Range = document.getElementById(cfg.q3RangeId);
  const q4Range = document.getElementById(cfg.q4RangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const Q1 = Number(q1Range.value), Q2 = Number(q2Range.value), Q3 = Number(q3Range.value), Q4 = Number(q4Range.value);
    const Q5 = -(Q1 + Q2 + Q3 + Q4);

    const cx = 110, cy = 80, r = 55;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="4,3"/>`;
    s += `<text x="${cx}" y="${cy + 4}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">système isolé</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Q₁ + Q₂ + Q₃ + Q₄ + Q₅ = 0<br>${Q1} + (${Q2}) + ${Q3} + ${Q4} + Q₅ = 0 → Q₅ = <strong style="color:var(--yellow)">${Q5.toFixed(0)} J</strong>`;
  }
  q1Range.addEventListener("input", draw);
  q2Range.addEventListener("input", draw);
  q3Range.addEventListener("input", draw);
  q4Range.addEventListener("input", draw);
  draw();
}
