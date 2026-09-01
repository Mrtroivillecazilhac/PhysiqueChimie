/* Animations du chapitre 2 — 4ème — "Transformations chimiques"
   Une animation par sous-partie (a à e). */

/* ---------- a. Transformation chimique ou transformation physique ---------- */
function initChemicalOrPhysical(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPhysique = document.getElementById(cfg.btnPhysiqueId);
  const btnChimique = document.getElementById(cfg.btnChimiqueId);

  let mode = "physique";
  const POOL = generateDotsInEllipse(14, 0, 0, 1, 1);

  function draw() {
    const x0 = 55, x1 = 145, yTop = 20, yBase = 140;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<rect x="${x0 + 2}" y="${yTop + 40}" width="${x1 - x0 - 4}" height="${yBase - yTop - 42}" fill="rgba(90,150,210,0.3)"/>`;

    if (mode === "physique") {
      // glaçon qui fond : une seule espèce (H2O), juste un changement d'état
      s += `<rect x="${(x0 + x1) / 2 - 16}" y="${yTop + 30}" width="32" height="24" fill="#cfe8f5" opacity="0.9" stroke="var(--chalk-dim)" stroke-width="1"/>`;
      s += `<text x="${(x0 + x1) / 2}" y="${yTop + 12}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">glaçon (H₂O solide)</text>`;
    } else {
      // réaction chimique : effervescence, nouvelle espèce (bulles de gaz) apparaît
      POOL.forEach(([u, v], i) => {
        if (i % 2 === 0) return;
        const x = (x0 + x1) / 2 + u * (x1 - x0 - 16) / 2;
        const y = yTop + 60 + v * (yBase - yTop - 70) / 2;
        s += `<circle cx="${x}" cy="${y}" r="3" fill="none" stroke="var(--yellow)" stroke-width="1.2"/>`;
      });
      s += `<text x="${(x0 + x1) / 2}" y="${yTop + 12}" font-size="8" fill="var(--yellow)" text-anchor="middle">effervescence : nouvelle espèce (gaz)</text>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "physique"
      ? "Transformation physique : le glaçon fond, mais l'espèce chimique reste la même (H₂O). Aucune nouvelle espèce n'apparaît."
      : "Transformation chimique : des bulles de gaz apparaissent — une <strong style=\"color:var(--yellow)\">nouvelle espèce chimique</strong> s'est formée, qui n'existait pas avant. Une espèce chimique est constituée de particules identiques.";
  }
  btnPhysique.addEventListener("click", () => { mode = "physique"; draw(); });
  btnChimique.addEventListener("click", () => { mode = "chimique"; draw(); });
  draw();
}

/* ---------- b. Les signes d'une transformation chimique et la conservation de la masse ---------- */
function initSignsAndMassConservation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnBefore = document.getElementById(cfg.btnBeforeId);
  const btnAfter = document.getElementById(cfg.btnAfterId);

  const MASS_FIXED = 232.9; // g, comme l'exemple du manuel — ne change jamais
  let mode = "before";
  const POOL = generateDotsInEllipse(12, 0, 0, 1, 1);

  function draw() {
    const fx = 110, fTop = 20, fNeck = 55, fBase = 115;
    let s = `<path d="M${fx - 8} ${fTop} L${fx - 8} ${fNeck} L${fx - 30} ${fBase - 10} Q${fx - 32} ${fBase} ${fx - 20} ${fBase} L${fx + 20} ${fBase} Q${fx + 32} ${fBase} ${fx + 30} ${fBase - 10} L${fx + 8} ${fNeck} L${fx + 8} ${fTop}" fill="rgba(90,150,210,0.2)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    if (mode === "after") {
      POOL.forEach(([u, v]) => {
        const x = fx + u * 22, y = fBase - 20 + v * 12;
        s += `<circle cx="${x}" cy="${y}" r="2.5" fill="none" stroke="var(--yellow)" stroke-width="1.2"/>`;
      });
      s += `<text x="${fx}" y="${fTop - 4}" font-size="8" fill="var(--yellow)" text-anchor="middle">effervescence (signe observable)</text>`;
    } else {
      s += `<text x="${fx}" y="${fTop - 4}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">eau + levure chimique</text>`;
    }

    // balance numérique — valeur TOUJOURS identique
    s += `<rect x="${fx - 30}" y="${fBase + 12}" width="60" height="18" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="${fx}" y="${fBase + 25}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">${MASS_FIXED} g</text>`;
    svg.innerHTML = s;

    readout.innerHTML = mode === "before"
      ? `Avant la transformation chimique : masse = <strong style="color:var(--yellow)">${MASS_FIXED} g</strong>.`
      : `Pendant la transformation (effervescence, un des signes possibles avec un changement de couleur, de température ou de pH) : la masse reste <strong style="color:var(--yellow)">${MASS_FIXED} g</strong> — il y a <strong>conservation de la masse</strong> : la masse des produits formés est égale à la masse des réactifs consommés.`;
  }
  btnBefore.addEventListener("click", () => { mode = "before"; draw(); });
  btnAfter.addEventListener("click", () => { mode = "after"; draw(); });
  draw();
}

/* ---------- c. Les espèces chimiques (modèles moléculaires) ---------- */
function initChemicalSpecies(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const COL = { O: "var(--coral)", H: "#c8ccd2", N: "#5a96d2", C: "var(--chalk)" };
  const SPECIES = {
    o2: { name: "Dioxygène", formula: [{ s: "O", n: 2 }], atoms: ["O", "O"] },
    h2: { name: "Dihydrogène", formula: [{ s: "H", n: 2 }], atoms: ["H", "H"] },
    n2: { name: "Diazote", formula: [{ s: "N", n: 2 }], atoms: ["N", "N"] },
    h2o: { name: "Eau", formula: [{ s: "H", n: 2 }, { s: "O", n: 1 }], atoms: ["H", "O", "H"] },
    co2: { name: "Dioxyde de carbone", formula: [{ s: "C", n: 1 }, { s: "O", n: 2 }], atoms: ["O", "C", "O"] }
  };
  const keys = ["o2", "h2", "n2", "h2o", "co2"];
  let current = "o2";

  function draw() {
    const sp = SPECIES[current];
    const cx = 110, cy = 70;
    let s = "";
    const spacing = 42;
    const startX = cx - (sp.atoms.length - 1) * spacing / 2;
    sp.atoms.forEach((a, i) => {
      const x = startX + i * spacing;
      if (i > 0) s += `<line x1="${startX + (i - 1) * spacing + 14}" y1="${cy}" x2="${x - 14}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    });
    sp.atoms.forEach((a, i) => {
      const x = startX + i * spacing;
      s += `<circle cx="${x}" cy="${cy}" r="15" fill="${COL[a]}"/>`;
      s += `<text x="${x}" y="${cy + 4}" font-size="11" fill="var(--board)" text-anchor="middle" font-weight="700">${a}</text>`;
    });
    svg.innerHTML = s;

    const formulaStr = sp.formula.map(f => `<span style="color:${COL[f.s]}">${f.s}${f.n > 1 ? `<sub>${f.n}</sub>` : ""}</span>`).join("");
    readout.innerHTML = `<strong style="color:var(--yellow)">${sp.name}</strong> — formule chimique : ${formulaStr}. Le modèle moléculaire représente chaque atome par une boule.`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- d. Les équations de réaction (conservation des atomes) ---------- */
function initReactionEquation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSimple = document.getElementById(cfg.btnSimpleId);
  const btnMethane = document.getElementById(cfg.btnMethaneId);

  let mode = "simple";

  function draw() {
    let s = "";
    if (mode === "simple") {
      s += `<text x="15" y="55" font-size="14" fill="var(--teal)">C</text>`;
      s += `<text x="35" y="55" font-size="14" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="52" y="55" font-size="14" fill="var(--teal)">O₂</text>`;
      s += `<text x="90" y="55" font-size="14" fill="var(--yellow)">→</text>`;
      s += `<text x="115" y="55" font-size="14" fill="var(--coral)">CO₂</text>`;
      s += `<text x="15" y="90" font-size="8.5" fill="var(--chalk-dim)">réactifs : 1 atome de C, 2 atomes de O</text>`;
      s += `<text x="15" y="105" font-size="8.5" fill="var(--chalk-dim)">produit : 1 atome de C, 2 atomes de O ✓</text>`;
      s += `<text x="15" y="128" font-size="8" fill="var(--chalk-dim)" font-style="italic">Le carbone réagit avec le dioxygène pour donner du dioxyde de carbone.</text>`;
    } else {
      s += `<text x="10" y="45" font-size="13" fill="var(--teal)">CH₄</text>`;
      s += `<text x="48" y="45" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="65" y="45" font-size="13" fill="var(--teal)">2 O₂</text>`;
      s += `<text x="112" y="45" font-size="13" fill="var(--yellow)">→</text>`;
      s += `<text x="135" y="45" font-size="13" fill="var(--coral)">CO₂</text>`;
      s += `<text x="175" y="45" font-size="13" fill="var(--chalk-dim)">+</text>`;
      s += `<text x="10" y="68" font-size="13" fill="var(--coral)">2 H₂O</text>`;
      s += `<text x="10" y="95" font-size="8" fill="var(--chalk-dim)">réactifs : 1 C, 4 H, 4 O</text>`;
      s += `<text x="10" y="110" font-size="8" fill="var(--chalk-dim)">produits : 1 C, 4 H, 4 O ✓</text>`;
      s += `<text x="10" y="132" font-size="7.5" fill="var(--chalk-dim)" font-style="italic">Même nombre d'atomes de chaque sorte des deux côtés.</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "simple"
      ? "Une transformation chimique se traduit par une redistribution des atomes : ils se réorganisent, mais aucun n'apparaît ni ne disparaît."
      : "L'équation traduit à la fois la conservation ET la redistribution des atomes : on doit retrouver le même nombre d'atomes de chaque sorte de chaque côté de la flèche.";
  }
  btnSimple.addEventListener("click", () => { mode = "simple"; draw(); });
  btnMethane.addEventListener("click", () => { mode = "methane"; draw(); });
  draw();
}

/* ---------- e. Les propriétés acidobasiques (le pH) ---------- */
function initPhScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const phRange = document.getElementById(cfg.phRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function colorForPh(ph) {
    if (ph < 7) {
      const t = ph / 7; // 0 (très acide, rouge) -> 1 (neutre, vert)
      const r = Math.round(217 - t * (217 - 107));
      const g = Math.round(90 + t * (191 - 90));
      const b = Math.round(80 + t * (171 - 80));
      return `rgb(${r},${g},${b})`;
    } else {
      const t = (ph - 7) / 7; // 0 (neutre, vert) -> 1 (très basique, violet)
      const r = Math.round(107 + t * (140 - 107));
      const g = Math.round(191 - t * (191 - 90));
      const b = Math.round(171 + t * (210 - 171));
      return `rgb(${r},${g},${b})`;
    }
  }

  function draw() {
    const ph = Number(phRange.value);
    const color = colorForPh(ph);

    const x0 = 20, x1 = 200, y = 55;
    let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    for (let v = 0; v <= 14; v += 1) {
      const x = x0 + (v / 14) * (x1 - x0);
      s += `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
      if (v % 7 === 0 || v === 14) s += `<text x="${x}" y="${y + 18}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${v}</text>`;
    }
    const px = x0 + (ph / 14) * (x1 - x0);
    s += `<circle cx="${px}" cy="${y}" r="8" fill="${color}" stroke="var(--board)" stroke-width="2"/>`;
    s += `<text x="${px}" y="${y - 16}" font-size="10" fill="${color}" text-anchor="middle" font-weight="700">pH = ${ph.toFixed(1)}</text>`;

    // tube témoin (couleur du papier indicateur / de la solution)
    s += `<rect x="${(x0 + x1) / 2 - 12}" y="85" width="24" height="45" rx="4" fill="${color}" opacity="0.75" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;

    svg.innerHTML = s;

    const label = ph < 7 ? "acide" : ph > 7 ? "basique" : "neutre";
    const labelColor = ph < 7 ? "var(--coral)" : ph > 7 ? "#5a96d2" : "var(--teal)";
    readout.innerHTML = `pH = ${ph.toFixed(1)} → solution <strong style="color:${labelColor}">${label}</strong> (à 25 °C : acide si pH &lt; 7, neutre si pH = 7, basique si pH &gt; 7).`;
  }
  phRange.addEventListener("input", draw);
  draw();
}
