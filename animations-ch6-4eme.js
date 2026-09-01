/* Animations du chapitre 6 — 4ème — "L'énergie"
   Une animation par sous-partie (a à d). */

/* ---------- a. Les formes d'énergie ---------- */
function initEnergyForms(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const FORMS = [
    { name: "Énergie cinétique", icon: "🚗", text: "Un objet en mouvement possède de l'énergie cinétique. Elle augmente lorsque la masse ou la vitesse de l'objet augmente." },
    { name: "Énergie potentielle de position", icon: "🏔️", text: "Un objet situé en hauteur possède de l'énergie potentielle de position. Elle diminue lorsque l'objet se rapproche du sol, et augmente si la masse de l'objet augmente." },
    { name: "Énergie chimique", icon: "🍎", text: "Les aliments, le pétrole, le charbon, le gaz contiennent de l'énergie chimique." },
    { name: "Énergie thermique", icon: "🔥", text: "Le feu fournit de l'énergie thermique (chaleur) et de l'énergie lumineuse." },
    { name: "Énergie lumineuse", icon: "☀️", text: "L'énergie lumineuse provenant du Soleil nous éclaire et nous chauffe." },
    { name: "Énergie nucléaire", icon: "☢️", text: "L'énergie nucléaire de l'uranium est utilisée dans les centrales nucléaires." }
  ];

  let step = 1;
  function render() {
    const f = FORMS[step - 1];
    svg.innerHTML = `<text x="110" y="65" font-size="34" text-anchor="middle">${f.icon}</text><text x="110" y="95" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">${f.name}</text>`;
    explainEl.innerHTML = f.text;
    stepEl.textContent = `${step} / 6`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 6;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 6) { step++; render(); } });
  render();
}

/* ---------- b. Les sources d'énergie ---------- */
function initEnergySources(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnNonRenouv = document.getElementById(cfg.btnNonRenouvId);
  const btnRenouv = document.getElementById(cfg.btnRenouvId);

  let mode = "nonrenouv";

  function draw() {
    let s = "";
    if (mode === "nonrenouv") {
      const items = [["🛢️", "Pétrole"], ["🔥", "Gaz"], ["⚫", "Charbon"], ["☢️", "Uranium"]];
      items.forEach(([icon, label], i) => {
        const x = 40 + i * 45;
        s += `<text x="${x}" y="55" font-size="22" text-anchor="middle">${icon}</text>`;
        s += `<text x="${x}" y="80" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">${label}</text>`;
      });
    } else {
      const items = [["💨", "Éolien"], ["☀️", "Solaire"], ["💧", "Hydraulique"], ["🌱", "Biomasse"], ["🌋", "Géothermique"]];
      items.forEach(([icon, label], i) => {
        const x = 25 + i * 40;
        s += `<text x="${x}" y="55" font-size="20" text-anchor="middle">${icon}</text>`;
        s += `<text x="${x}" y="78" font-size="6.5" fill="var(--chalk-dim)" text-anchor="middle">${label}</text>`;
      });
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "nonrenouv"
      ? "Une source <strong style=\"color:var(--coral)\">non renouvelable</strong> disparaîtra un jour à cause de l'exploitation humaine : ses stocks sur Terre sont limités, ou se renouvellent trop lentement (sources fossiles et nucléaire)."
      : "Une source <strong style=\"color:var(--teal)\">renouvelable</strong> est exploitable sans limite de durée à l'échelle humaine.";
  }
  btnNonRenouv.addEventListener("click", () => { mode = "nonrenouv"; draw(); });
  btnRenouv.addEventListener("click", () => { mode = "renouv"; draw(); });
  draw();
}

/* ---------- c. Transferts et conversions d'énergie (chaîne énergétique) ---------- */
function initEnergyChain(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const eRange = document.getElementById(cfg.eRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPile = document.getElementById(cfg.btnPileId);
  const btnCentrale = document.getElementById(cfg.btnCentraleId);

  const EXAMPLES = {
    pile: { convertisseur: "Pile", entree: "Énergie chimique", tauxUtile: 0.8, formeUtile: "Énergie électrique" },
    centrale: { convertisseur: "Centrale nucléaire", entree: "Énergie nucléaire", tauxUtile: 0.33, formeUtile: "Énergie électrique" }
  };
  let current = "pile";

  function draw() {
    const ex = EXAMPLES[current];
    const eExploitee = Number(eRange.value);
    const eUtile = eExploitee * ex.tauxUtile;
    const eDissipee = eExploitee - eUtile;

    let s = `<defs><marker id="ecArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += `<rect x="5" y="45" width="65" height="26" rx="13" fill="rgba(90,150,210,0.25)" stroke="#5a96d2" stroke-width="1.5"/>`;
    s += `<text x="37" y="61" font-size="8" fill="#5a96d2" text-anchor="middle">${ex.entree}</text>`;
    s += `<line x1="70" y1="58" x2="90" y2="58" stroke="var(--chalk-dim)" stroke-width="2" marker-end="url(#ecArrow)"/>`;
    s += `<ellipse cx="115" cy="58" rx="28" ry="20" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="115" y="61" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">${ex.convertisseur}</text>`;
    s += `<line x1="143" y1="50" x2="160" y2="35" stroke="var(--chalk-dim)" stroke-width="2" marker-end="url(#ecArrow)"/>`;
    s += `<line x1="143" y1="66" x2="160" y2="85" stroke="var(--chalk-dim)" stroke-width="2" marker-end="url(#ecArrow)"/>`;
    s += `<rect x="160" y="20" width="55" height="26" rx="13" fill="rgba(107,191,171,0.25)" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<text x="187" y="36" font-size="7.5" fill="var(--teal)" text-anchor="middle">${ex.formeUtile}</text>`;
    s += `<rect x="160" y="72" width="55" height="26" rx="13" fill="rgba(217,122,99,0.25)" stroke="var(--coral)" stroke-width="1.5"/>`;
    s += `<text x="187" y="88" font-size="7.5" fill="var(--coral)" text-anchor="middle">Énergie dissipée</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `E<sub>exploitée</sub> = ${eExploitee} J → E<sub>utile</sub> = <strong style="color:var(--teal)">${eUtile.toFixed(0)} J</strong> + E<sub>dissipée</sub> = <strong style="color:var(--coral)">${eDissipee.toFixed(0)} J</strong><br>Vérification : ${eUtile.toFixed(0)} + ${eDissipee.toFixed(0)} = <strong style="color:var(--yellow)">${eExploitee} J</strong> = E<sub>exploitée</sub> (conservation de l'énergie).`;
  }
  eRange.addEventListener("input", draw);
  btnPile.addEventListener("click", () => { current = "pile"; draw(); });
  btnCentrale.addEventListener("click", () => { current = "centrale"; draw(); });
  draw();
}

/* ---------- d. La puissance ---------- */
function initPowerComparison(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const pRange = document.getElementById(cfg.pRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const E_JOB = 3000; // J, quantité d'énergie fixe nécessaire pour "vider la cave"

  function draw() {
    const P = Number(pRange.value);
    const t = E_JOB / P;

    const x0 = 60, x1 = 160, yTop = 20, yBase = 130;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    // niveau d'eau restant, proportionnel au temps nécessaire (visuel comparatif)
    const fillFrac = Math.min(1, t / 12); // 12s = référence pour l'échelle visuelle
    const fillH = fillFrac * (yBase - yTop - 8);
    s += `<rect x="${x0 + 2}" y="${yBase - fillH}" width="${x1 - x0 - 4}" height="${fillH - 2}" fill="rgba(90,150,210,0.4)"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yBase + 18}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">cave à vider</text>`;

    svg.innerHTML = s;

    readout.innerHTML = `Pompe de puissance P = <strong style="color:var(--yellow)">${P} W</strong> : pour la même quantité d'énergie à convertir (${E_JOB} J), il lui faut <strong style="color:var(--yellow)">t ≈ ${t.toFixed(1)} s</strong>.<br>Plus la puissance est grande, plus le convertisseur agit vite : une pompe de 1000 W vide la cave bien plus rapidement qu'une pompe de 250 W.`;
  }
  pRange.addEventListener("input", draw);
  draw();
}
