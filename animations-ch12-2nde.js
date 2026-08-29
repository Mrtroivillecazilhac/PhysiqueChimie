/* Animations du chapitre 9 — 2nde — "Transformation chimique"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Équation de réaction équilibrée (conservation des éléments) ---------- */
function initBalancedEquation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnMethane = document.getElementById(cfg.btnMethaneId);
  const btnMg = document.getElementById(cfg.btnMgId);

  let mode = "methane";

  function draw() {
    let s = "";
    if (mode === "methane") {
      s += `<text x="15" y="70" font-size="13" fill="var(--teal)">CH₄</text>`;
      s += `<text x="65" y="70" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="85" y="70" font-size="13" fill="var(--teal)">2 O₂</text>`;
      s += `<text x="140" y="70" font-size="13" fill="var(--yellow)">→</text>`;
      s += `<text x="165" y="70" font-size="13" fill="var(--coral)">CO₂</text>`;
      s += `<text x="205" y="70" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="15" y="100" font-size="13" fill="var(--coral)">2 H₂O</text>`;
      s += `<text x="15" y="130" font-size="8.5" fill="var(--chalk-dim)">réactifs : 1 C, 4 H, 4 O</text>`;
      s += `<text x="15" y="145" font-size="8.5" fill="var(--chalk-dim)">produits : 1 C, 4 H, 4 O ✓</text>`;
    } else {
      s += `<text x="15" y="70" font-size="13" fill="var(--teal)">Mg</text>`;
      s += `<text x="50" y="70" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="70" y="70" font-size="13" fill="var(--teal)">2 H⁺</text>`;
      s += `<text x="120" y="70" font-size="13" fill="var(--yellow)">→</text>`;
      s += `<text x="145" y="70" font-size="13" fill="var(--coral)">Mg²⁺</text>`;
      s += `<text x="195" y="70" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="15" y="100" font-size="13" fill="var(--coral)">H₂</text>`;
      s += `<text x="15" y="130" font-size="8.5" fill="var(--chalk-dim)">réactifs : 1 Mg, 2 H, charge +2</text>`;
      s += `<text x="15" y="145" font-size="8.5" fill="var(--chalk-dim)">produits : 1 Mg, 2 H, charge +2 ✓</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "methane"
      ? "L'équation est équilibrée : autant d'atomes de chaque élément de chaque côté. Le diazote N₂(g), spectateur, n'apparaît pas dans l'équation."
      : "Les ions chlorure Cl⁻(aq), spectateurs, n'apparaissent pas dans l'équation. La charge électrique totale est conservée (+2 des deux côtés).";
  }
  btnMethane.addEventListener("click", () => { mode = "methane"; draw(); });
  btnMg.addEventListener("click", () => { mode = "mg"; draw(); });
  draw();
}

/* ---------- 2. Réactif limitant (bilan de matière) ---------- */
function initLimitingReagent(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const n1Range = document.getElementById(cfg.n1RangeId);
  const n2Range = document.getElementById(cfg.n2RangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const n0CH4 = Number(n1Range.value);
    const n0O2 = Number(n2Range.value);
    const r1 = n0CH4 / 1, r2 = n0O2 / 2;
    let limiting, xmax;
    if (r1 < r2) { limiting = "CH₄"; xmax = n0CH4; }
    else if (r1 > r2) { limiting = "O₂"; xmax = n0O2 / 2; }
    else { limiting = "les deux (mélange stœchiométrique)"; xmax = n0CH4; }

    const restCH4 = n0CH4 - xmax, restO2 = n0O2 - 2 * xmax;

    const barW = 22, scale = 15, base = 150;
    function bar(x, val, color) {
      const h = Math.max(1, val * scale);
      return `<rect x="${x}" y="${base - h}" width="${barW}" height="${h}" fill="${color}"/>`;
    }
    let s = "";
    s += bar(20, n0CH4, "var(--teal)") + bar(50, n0O2, "#5a96d2");
    s += bar(120, restCH4, "var(--teal)") + bar(150, restO2, "#5a96d2");
    s += `<text x="35" y="${base + 14}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">CH₄</text>`;
    s += `<text x="65" y="${base + 14}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">O₂</text>`;
    s += `<text x="135" y="${base + 14}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">CH₄</text>`;
    s += `<text x="165" y="${base + 14}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">O₂</text>`;
    s += `<text x="45" y="12" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">état initial</text>`;
    s += `<text x="145" y="12" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">état final</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `n₀(CH₄)/1 = ${r1.toFixed(1)} ; n₀(O₂)/2 = ${r2.toFixed(1)} → réactif limitant : <strong style="color:var(--yellow)">${limiting}</strong>. x<sub>max</sub> = <strong style="color:var(--yellow)">${xmax.toFixed(1)} mol</strong>.`;
  }
  n1Range.addEventListener("input", draw);
  n2Range.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Transformation exothermique / endothermique ---------- */
function initThermalTransformation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnExo = document.getElementById(cfg.btnExoId);
  const btnEndo = document.getElementById(cfg.btnEndoId);

  let mode = "exo";

  function draw() {
    const cx = 110, cy = 90;
    let s = `<defs><marker id="thArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="26" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<text x="${cx}" y="${cy + 4}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">système</text>`;

    if (mode === "exo") {
      s += `<line x1="${cx + 30}" y1="${cy}" x2="${cx + 65}" y2="${cy}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#thArrow)" color="var(--coral)"/>`;
      s += `<text x="${cx + 75}" y="${cy - 8}" font-size="8" fill="var(--coral)" text-anchor="middle">énergie</text>`;
      s += `<text x="${cx}" y="${cy + 45}" font-size="9" fill="var(--coral)" text-anchor="middle">T milieu ↑</text>`;
    } else {
      s += `<line x1="${cx + 65}" y1="${cy}" x2="${cx + 30}" y2="${cy}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#thArrow)" color="var(--teal)"/>`;
      s += `<text x="${cx + 75}" y="${cy - 8}" font-size="8" fill="var(--teal)" text-anchor="middle">énergie</text>`;
      s += `<text x="${cx}" y="${cy + 45}" font-size="9" fill="var(--teal)" text-anchor="middle">T milieu ↓</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "exo"
      ? "Transformation exothermique : le système chimique libère de l'énergie vers le milieu extérieur, dont la température augmente."
      : "Transformation endothermique : le système chimique reçoit de l'énergie du milieu extérieur, dont la température diminue.";
  }
  btnExo.addEventListener("click", () => { mode = "exo"; draw(); });
  btnEndo.addEventListener("click", () => { mode = "endo"; draw(); });
  draw();
}

/* ---------- 4. Espèce naturelle ou synthétique ---------- */
function initNaturalSynthetic(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnNatural = document.getElementById(cfg.btnNaturalId);
  const btnSynthetic = document.getElementById(cfg.btnSyntheticId);

  let mode = "natural";

  function draw() {
    const cx = 110, cy = 75;
    let s = "";
    if (mode === "natural") {
      s += `<circle cx="${cx}" cy="${cy + 30}" r="24" fill="#5a8a3c"/>`;
      s += `<circle cx="${cx - 10}" cy="${cy + 15}" r="6" fill="var(--coral)"/>`;
      s += `<circle cx="${cx + 8}" cy="${cy + 20}" r="6" fill="var(--coral)"/>`;
      s += `<text x="${cx}" y="${cy - 15}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">plante (café)</text>`;
    } else {
      s += `<rect x="${cx - 30}" y="${cy}" width="60" height="45" rx="4" fill="none" stroke="var(--teal)" stroke-width="2"/>`;
      s += `<rect x="${cx - 8}" y="${cy - 15}" width="16" height="18" fill="var(--teal)"/>`;
      s += `<text x="${cx}" y="${cy - 22}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">ballon (laboratoire)</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "natural"
      ? "Une espèce chimique naturelle est issue de la nature : par exemple, la caféine extraite du café."
      : "Une espèce chimique synthétique est fabriquée par l'homme, au laboratoire : par exemple, la caféine synthétisée en chimie.";
  }
  btnNatural.addEventListener("click", () => { mode = "natural"; draw(); });
  btnSynthetic.addEventListener("click", () => { mode = "synthetic"; draw(); });
  draw();
}

/* ---------- 5. Les 4 étapes d'une synthèse ---------- */
function initSynthesisSteps4(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const STEPS = [
    {
      title: "Étape 1 — Prélèvement des réactifs",
      text: "On recherche d'abord les pictogrammes de danger et les consignes de sécurité. Solide → on pèse une masse m. En solution → on mesure un volume V_solution. Liquide pur → on mesure un volume V.",
      draw() {
        let s = `<rect x="30" y="90" width="60" height="14" rx="3" fill="var(--board)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
        s += `<text x="60" y="118" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">balance</text>`;
        s += `<path d="M43,72 L77,72 L72,90 L48,90 Z" fill="none" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
        s += `<rect x="120" y="40" width="16" height="55" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
        s += `<rect x="122" y="65" width="12" height="28" fill="rgba(90,150,210,0.35)"/>`;
        s += `<text x="128" y="105" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">éprouvette</text>`;
        return s;
      }
    },
    {
      title: "Étape 2 — Transformation chimique",
      text: "Le produit est formé au cours de cette étape. Certaines transformations nécessitent un montage de chauffage à reflux, qui accélère la réaction sans perte de matière (le réfrigérant liquéfie les vapeurs).",
      draw() {
        let s = `<line x1="35" y1="15" x2="35" y2="145" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<rect x="65" y="125" width="55" height="10" fill="var(--coral)"/>`;
        s += `<circle cx="92" cy="105" r="18" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="85" y1="88" x2="85" y2="60" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="99" y1="88" x2="99" y2="60" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<rect x="77" y="18" width="30" height="42" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<text x="130" y="20" font-size="7" fill="var(--chalk-dim)" text-anchor="start">réfrigérant à eau</text>`;
        return s;
      }
    },
    {
      title: "Étape 3 — Isolement du produit brut",
      text: "L'isolement permet de séparer l'espèce synthétisée du reste du milieu réactionnel (réactifs n'ayant pas réagi, autres produits, solvant...).",
      draw() {
        let s = `<path d="M150 15 L165 15 L165 40 Q165 55 157 60 L157 72 L163 72 L163 78 L151 78 L151 72 L157 72 Q149 55 149 40 L149 15" fill="none" stroke="var(--teal)" stroke-width="2"/>`;
        s += `<line x1="149" y1="42" x2="165" y2="42" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        s += `<text x="157" y="90" font-size="8" fill="var(--teal)" text-anchor="middle">ampoule à décanter</text>`;
        return s;
      }
    },
    {
      title: "Étape 4 — Analyse du produit brut",
      text: "L'analyse permet l'identification et le contrôle de la pureté du produit obtenu : température de fusion (solide), densité/température d'ébullition (liquide), ou chromatographie sur couche mince (CCM).",
      draw() {
        let s = `<rect x="130" y="15" width="40" height="55" fill="none" stroke="var(--teal)" stroke-width="1.5"/>`;
        s += `<line x1="130" y1="55" x2="170" y2="55" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        s += `<circle cx="140" cy="52" r="3" fill="var(--yellow)"/>`;
        s += `<circle cx="150" cy="30" r="3" fill="var(--yellow)"/>`;
        s += `<circle cx="160" cy="30" r="3" fill="var(--coral)"/>`;
        s += `<text x="150" y="88" font-size="8" fill="var(--teal)" text-anchor="middle">chromatographie (CCM)</text>`;
        return s;
      }
    }
  ];

  let step = 1;
  function render() {
    svg.innerHTML = STEPS[step - 1].draw();
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong> — ${STEPS[step - 1].text}`;
    stepEl.textContent = `Étape ${step} / 4`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 4;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 4) { step++; render(); } });
  render();
}
