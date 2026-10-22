/* Animations du chapitre 4 — 1ère spé PC — Tableau d'avancement */

function fmt1(n) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

/* ================================================================== */
/* a. Avancement d'une réaction chimique — A → B + C                  */
/* ================================================================== */
function initAvancementIntro(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const xR = document.getElementById(cfg.xId);
  const readout = document.getElementById(cfg.readoutId);
  const explain = document.getElementById(cfg.explainId);

  const N0A = 10;
  const SPECIES = [
    { key: "A", label: "A", color: "var(--yellow)" },
    { key: "B", label: "B", color: "var(--teal)" },
    { key: "C", label: "C", color: "var(--coral)" }
  ];
  const baseline = 130, barW = 48, gap = 34, SCALE = 11;

  function draw() {
    const x = Number(xR.value);
    const quantities = { A: N0A - x, B: x, C: x };

    let svgContent = `<line x1="10" y1="${baseline}" x2="250" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;
    SPECIES.forEach((sp, i) => {
      const bx = 25 + i * (barW + gap);
      const h = Math.min(baseline - 12, quantities[sp.key] * SCALE);
      svgContent += `<rect x="${bx}" y="${baseline - h}" width="${barW}" height="${h}" fill="${sp.color}" opacity="0.85" rx="4"/>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline + 16}" font-size="11" fill="var(--chalk-dim)" text-anchor="middle">${sp.label}</text>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline - h - 6}" font-size="10" fill="${sp.color}" text-anchor="middle">${quantities[sp.key].toFixed(1)}</text>`;
    });
    svg.innerHTML = svgContent;

    readout.innerHTML = `x = ${x.toFixed(1)} mol &nbsp;|&nbsp; A restant : ${quantities.A.toFixed(1)} mol &nbsp;|&nbsp; B formé : ${quantities.B.toFixed(1)} mol &nbsp;|&nbsp; C formé : ${quantities.C.toFixed(1)} mol`;

    explain.classList.add("lit");
    clearTimeout(explain._litTimer);
    explain._litTimer = setTimeout(() => explain.classList.remove("lit"), 700);
  }

  xR.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* b. Tableau d'avancement — A + 2B → C                                */
/* ================================================================== */
function initAvancementTableDemo(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const xR = document.getElementById(cfg.xId);
  const readout = document.getElementById(cfg.readoutId);
  const tableBody = document.getElementById(cfg.tableBodyId);
  const formulas = document.getElementById(cfg.formulasId);

  const N0A = 5, N0B = 8;
  const XMAX = Math.min(N0A / 1, N0B / 2); // = 4
  const SPECIES = [
    { key: "A", label: "A", color: "var(--yellow)" },
    { key: "B", label: "B", color: "var(--teal)" },
    { key: "C", label: "C", color: "var(--coral)" }
  ];
  const baseline = 130, barW = 48, gap = 34, SCALE = 13.5;

  function quantitiesAt(x) {
    return {
      A: Math.max(0, N0A - x),
      B: Math.max(0, N0B - 2 * x),
      C: x
    };
  }

  function draw() {
    const x = Math.min(Number(xR.value), XMAX);
    const q = quantitiesAt(x);

    let svgContent = `<line x1="10" y1="${baseline}" x2="250" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;
    SPECIES.forEach((sp, i) => {
      const bx = 25 + i * (barW + gap);
      const h = Math.min(baseline - 12, q[sp.key] * SCALE);
      svgContent += `<rect x="${bx}" y="${baseline - h}" width="${barW}" height="${h}" fill="${sp.color}" opacity="0.85" rx="4"/>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline + 16}" font-size="11" fill="var(--chalk-dim)" text-anchor="middle">${sp.label}</text>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline - h - 6}" font-size="10" fill="${sp.color}" text-anchor="middle">${q[sp.key].toFixed(1)}</text>`;
    });
    svg.innerHTML = svgContent;

    formulas.innerHTML = `
      <div><span style="color:var(--yellow)">n(A) = 5 − x</span> = <strong>${fmt1(q.A)} mol</strong></div>
      <div><span style="color:var(--teal)">n(B) = 8 − 2x</span> = <strong>${fmt1(q.B)} mol</strong></div>
      <div><span style="color:var(--coral)">n(C) = x</span> = <strong>${fmt1(q.C)} mol</strong></div>
    `;

    const isInitial = x <= 0.001;
    const isFinal = x >= XMAX - 0.001;
    const isInter = !isInitial && !isFinal;
    tableBody.innerHTML = `
      <tr class="${isInitial ? 'row-active' : ''}">
        <td>État initial</td><td>x = 0</td><td>5</td><td>8</td><td>0</td>
      </tr>
      <tr class="${isInter ? 'row-active' : ''}">
        <td>État intermédiaire</td><td>0 &lt; x &lt; x<sub>max</sub></td>
        <td>5 − x</td><td>8 − 2x</td><td>x</td>
      </tr>
      <tr class="${isFinal ? 'row-active' : ''}">
        <td>État final</td><td>x = x<sub>max</sub> = ${fmt1(XMAX)}</td>
        <td>${fmt1(N0A - XMAX)}</td><td>${fmt1(N0B - 2 * XMAX)}</td><td>${fmt1(XMAX)}</td>
      </tr>
    `;

    readout.innerHTML = `x = ${x.toFixed(1)} mol (x<sub>max</sub> = ${fmt1(XMAX)} mol)`;
  }

  xR.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* c. Réactif limitant & x_max — 2A + B → P                            */
/* ================================================================== */
function initLimitingReagentDemo(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const n0AR = document.getElementById(cfg.n0AId);
  const n0BR = document.getElementById(cfg.n0BId);
  const readout = document.getElementById(cfg.readoutId);

  const baseline = 128, barW = 40, maxBarH = 96, SCALE = maxBarH / 10; // xmax varie de 0 à 10

  function draw() {
    const n0A = Number(n0AR.value), n0B = Number(n0BR.value);
    const xmax1 = n0A / 2;   // hypothèse : A limitant
    const xmax2 = n0B / 1;   // hypothèse : B limitant
    const xmax = Math.min(xmax1, xmax2);
    const isStoich = Math.abs(xmax1 - xmax2) < 0.05;
    const limitingKey = isStoich ? null : (xmax1 < xmax2 ? "A" : "B");

    const bars = [
      { label: "Hyp. 1 : A limitant", value: xmax1, color: "var(--yellow)", active: limitingKey === "A" },
      { label: "Hyp. 2 : B limitant", value: xmax2, color: "var(--teal)", active: limitingKey === "B" },
      { label: "x_max réel", value: xmax, color: "var(--coral)", active: true }
    ];

    let svgContent = `<line x1="10" y1="${baseline}" x2="250" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;
    bars.forEach((b, i) => {
      const bx = 20 + i * (barW + 32);
      const h = Math.min(maxBarH, b.value * SCALE);
      const opacity = b.active ? 0.9 : 0.35;
      svgContent += `<rect x="${bx}" y="${baseline - h}" width="${barW}" height="${h}" fill="${b.color}" opacity="${opacity}" rx="4"/>`;
      if (b.active && i < 2) {
        svgContent += `<rect x="${bx - 2}" y="${baseline - h - 2}" width="${barW + 4}" height="${h + 2}" fill="none" stroke="${b.color}" stroke-width="1.5" rx="5"/>`;
      }
      svgContent += `<text x="${bx + barW / 2}" y="${baseline - h - 6}" font-size="10" fill="${b.color}" text-anchor="middle">${fmt1(b.value)}</text>`;
    });
    svg.innerHTML = svgContent;

    const badgeText = isStoich
      ? `<span class="limiting-badge stoich">mélange stœchiométrique</span>`
      : `<span class="limiting-badge">Réactif limitant : ${limitingKey}</span>`;

    readout.innerHTML = `n₀(A) = ${n0A} mol, n₀(B) = ${n0B} mol &nbsp;→&nbsp; x<sub>max</sub> = min(${fmt1(xmax1)} ; ${fmt1(xmax2)}) = <strong>${fmt1(xmax)} mol</strong> &nbsp;${badgeText}`;
  }

  n0AR.addEventListener("input", draw);
  n0BR.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* e. Espèce en excès — soluté vs eau (solvant)                        */
/* ================================================================== */
function initExcessSpeciesDemo(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nR = document.getElementById(cfg.nId);
  const readout = document.getElementById(cfg.readoutId);

  const baseline = 128, barW = 56, maxH = 100;

  function draw() {
    const n = Number(nR.value);
    const hSolute = Math.min(maxH, n * 9);
    const hWater = maxH; // toujours "plein" : excès

    let svgContent = `<line x1="10" y1="${baseline}" x2="250" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;

    // Soluté
    svgContent += `<rect x="40" y="${baseline - hSolute}" width="${barW}" height="${hSolute}" fill="var(--coral)" opacity="0.85" rx="4"/>`;
    svgContent += `<text x="${40 + barW / 2}" y="${baseline + 16}" font-size="11" fill="var(--chalk-dim)" text-anchor="middle">Réactif dissous</text>`;
    svgContent += `<text x="${40 + barW / 2}" y="${baseline - hSolute - 6}" font-size="10" fill="var(--coral)" text-anchor="middle">${n.toFixed(1)} mol</text>`;

    // Eau (grisée, "infinie")
    svgContent += `<rect x="160" y="${baseline - hWater}" width="${barW}" height="${hWater}" fill="var(--chalk-dim)" opacity="0.25" stroke="var(--chalk-dim)" stroke-dasharray="3,2" rx="4"/>`;
    for (let i = 0; i < 3; i++) {
      svgContent += `<line x1="${168 + i * 14}" y1="${baseline - hWater - 6}" x2="${168 + i * 14 - 4}" y2="${baseline - hWater - 14}" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    }
    svgContent += `<text x="${160 + barW / 2}" y="${baseline + 16}" font-size="11" fill="var(--chalk-dim)" text-anchor="middle">H₂O (solvant)</text>`;
    svgContent += `<text x="${160 + barW / 2}" y="${baseline - hWater - 20}" font-size="9.5" fill="var(--chalk-dim)" text-anchor="middle">« excès »</text>`;

    svg.innerHTML = svgContent;
    readout.textContent = `Réactif dissous : ${n.toFixed(1)} mol — quelle que soit cette valeur (dans la gamme du labo), la quantité d'eau reste sans commune mesure.`;
  }

  nR.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* d. Mélange stœchiométrique — I₂ + 2 S₂O₃²⁻ → 2 I⁻ + S₄O₆²⁻           */
/*    (simulateur complet — Cours uniquement)                          */
/* ================================================================== */
function initAdvancementTable(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const n0AR = document.getElementById(cfg.n0AId);
  const n0BR = document.getElementById(cfg.n0BId);
  const xR = document.getElementById(cfg.xId);
  const readout = document.getElementById(cfg.readoutId);
  const viewBtn = document.getElementById(cfg.viewToggleId);
  const tableBody = document.getElementById(cfg.tableBodyId);

  const COEF = { I2: 1, S2O3: 2, I: 2, S4O6: 1 };
  const SPECIES = [
    { key: "I2", label: "I₂", color: "var(--yellow)" },
    { key: "S2O3", label: "S₂O₃²⁻", color: "var(--teal)" },
    { key: "I", label: "I⁻", color: "var(--coral)" },
    { key: "S4O6", label: "S₄O₆²⁻", color: "var(--chalk)" }
  ];

  const W = 260, H = 150, baseline = 130, barW = 42, gap = 20;
  const SCALE = 20; // px par mmol
  let mode = "bars"; // ou "molecules"

  // positions fixes pour la vue molécules (grille 4×5, jusqu'à 20 points par zone)
  const DOT_GRID = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) DOT_GRID.push([col, row]);

  function computeQuantities() {
    const n0I2 = Number(n0AR.value), n0S2O3 = Number(n0BR.value);
    const xMaxI2 = n0I2 / COEF.I2, xMaxS2O3 = n0S2O3 / COEF.S2O3;
    const xMax = Math.min(xMaxI2, xMaxS2O3);
    const x = Math.min(Number(xR.value) / 10, xMax);
    return {
      n0I2, n0S2O3, xMax, x,
      quantities: {
        I2: Math.max(0, n0I2 - COEF.I2 * x),
        S2O3: Math.max(0, n0S2O3 - COEF.S2O3 * x),
        I: COEF.I * x,
        S4O6: COEF.S4O6 * x
      }
    };
  }

  function drawBars(quantities) {
    let svgContent = `<line x1="10" y1="${baseline}" x2="${W - 10}" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;
    SPECIES.forEach((sp, i) => {
      const bx = 25 + i * (barW + gap);
      const h = Math.min(baseline - 10, quantities[sp.key] * SCALE);
      svgContent += `<rect x="${bx}" y="${baseline - h}" width="${barW}" height="${h}" fill="${sp.color}" opacity="0.85" rx="3"/>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${sp.label}</text>`;
      svgContent += `<text x="${bx + barW / 2}" y="${baseline - h - 5}" font-size="8.5" fill="${sp.color}" text-anchor="middle">${quantities[sp.key].toFixed(2)}</text>`;
    });
    svg.innerHTML = svgContent;
  }

  function drawMolecules(quantities) {
    const zoneW = 58, zoneH = 96, zoneY = 12, gapM = 6, r = 3.4;
    let svgContent = "";
    SPECIES.forEach((sp, i) => {
      const zx = 8 + i * (zoneW + gapM);
      svgContent += `<rect x="${zx}" y="${zoneY}" width="${zoneW}" height="${zoneH}" fill="rgba(255,255,255,0.03)" stroke="${sp.color}" stroke-width="1.3" stroke-dasharray="3,2" rx="6"/>`;

      const exact = Math.min(20, quantities[sp.key] * 4); // 4 points par mmol (exact, pas arrondi)
      const fullDots = Math.floor(exact);
      const remainder = exact - fullDots; // partie fractionnaire → demi-boule si assez grande

      for (let d = 0; d < fullDots; d++) {
        const [col, row] = DOT_GRID[d];
        const dx = zx + 9 + col * 10, dy = zoneY + 12 + row * 20;
        svgContent += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${sp.color}"/>`;
      }
      if (remainder >= 0.15 && fullDots < 20) {
        const [col, row] = DOT_GRID[fullDots];
        const dx = zx + 9 + col * 10, dy = zoneY + 12 + row * 20;
        // demi-boule : cercle plein en fond léger + moitié gauche pleine
        svgContent += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${sp.color}" opacity="0.2"/>`;
        svgContent += `<path d="M${dx} ${dy - r} A${r} ${r} 0 0 0 ${dx} ${dy + r} Z" fill="${sp.color}"/>`;
      }

      svgContent += `<text x="${zx + zoneW / 2}" y="${zoneY + zoneH + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${sp.label}</text>`;
      svgContent += `<text x="${zx + zoneW / 2}" y="${zoneY + zoneH + 26}" font-size="8.5" fill="${sp.color}" text-anchor="middle">${quantities[sp.key].toFixed(2)} mmol</text>`;
    });
    svg.innerHTML = svgContent;
  }

  function drawTable(n0I2, n0S2O3, x, xMax) {
    const isInitial = x <= 0.001;
    const isFinal = x >= xMax - 0.001;
    const isInter = !isInitial && !isFinal;

    tableBody.innerHTML = `
      <tr class="${isInitial ? 'row-active' : ''}">
        <td>État initial</td><td>x = 0</td>
        <td>${fmt1(n0I2)}</td><td>${fmt1(n0S2O3)}</td><td>0,0</td><td>0,0</td>
      </tr>
      <tr class="${isInter ? 'row-active' : ''}">
        <td>État intermédiaire</td><td>0 &lt; x &lt; x<sub>max</sub></td>
        <td>${fmt1(n0I2)} − x</td><td>${fmt1(n0S2O3)} − 2x</td><td>2x</td><td>x</td>
      </tr>
      <tr class="${isFinal ? 'row-active' : ''}">
        <td>État final</td><td>x = x<sub>max</sub> = ${fmt1(xMax)}</td>
        <td>${fmt1(n0I2 - xMax)}</td><td>${fmt1(n0S2O3 - 2 * xMax)}</td><td>${fmt1(2 * xMax)}</td><td>${fmt1(xMax)}</td>
      </tr>
    `;
  }

  function draw() {
    const { n0I2, n0S2O3, xMax, x, quantities } = computeQuantities();
    if (mode === "bars") drawBars(quantities); else drawMolecules(quantities);
    drawTable(n0I2, n0S2O3, x, xMax);

    const ratioI2 = n0I2 / COEF.I2, ratioS2O3 = n0S2O3 / COEF.S2O3;
    const isStoich = Math.abs(ratioI2 - ratioS2O3) < 0.05;
    const limitingText = isStoich
      ? `<strong style="color:var(--yellow)">mélange stœchiométrique !</strong> (les deux réactifs s'épuisent en même temps)`
      : `réactif limitant : <strong style="color:var(--coral)">${ratioI2 <= ratioS2O3 ? "I₂" : "S₂O₃²⁻"}</strong>`;
    readout.innerHTML = `x = ${x.toFixed(2)} mmol (x<sub>max</sub> = ${xMax.toFixed(2)} mmol, ${limitingText})`;
  }

  viewBtn.addEventListener("click", () => {
    mode = mode === "bars" ? "molecules" : "bars";
    viewBtn.textContent = mode === "bars" ? "🔵 Voir les molécules" : "📊 Voir les barres";
    draw();
  });
  n0AR.addEventListener("input", draw);
  n0BR.addEventListener("input", draw);
  xR.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* Entraînement — Tableau mystère : réaction et quantités tirées au   */
/* hasard (1 à 3 réactifs, 1 à 3 produits). L'élève construit tout le */
/* tableau, trouve le réactif limitant et x_max, puis décide si la    */
/* transformation est totale à partir d'une mesure à l'état final.    */
/* ================================================================== */
const CH4_MT_COLORS = ["var(--yellow)", "var(--teal)", "#b9a7e8", "var(--coral)", "var(--chalk)", "#8fc7e8"];

function ch4mtFmt(n) {
  return (Math.round(n * 100) / 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
}

// Lit un nombre écrit par un élève ("2,5", " 3 ") ; NaN sinon.
function ch4mtNumber(raw) {
  const t = String(raw ?? "").trim().replace(/\s+/g, "").replace(",", ".").replace(/[−–]/g, "-");
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(t)) return NaN;
  return Number(t);
}

// Lit une expression affine en x ("5 - 2x", "3x", "0 + x", "-2*x+5") → { k, m } (k + m·x) ; null si illisible.
function ch4mtLinear(raw) {
  let t = String(raw ?? "").toLowerCase().replace(/\s+/g, "")
    .replace(/[−–—]/g, "-").replace(/[×*·.](?=x)/g, "").replace(/,/g, ".");
  if (!t) return null;
  if (!/^[+-]/.test(t)) t = "+" + t;
  const re = /([+-])(\d+(?:\.\d+)?)?(x)?/y;
  let k = 0, m = 0, pos = 0;
  while (pos < t.length) {
    re.lastIndex = pos;
    const g = re.exec(t);
    if (!g || g[0].length === 1) return null;       // signe seul ou caractère inconnu
    if (!g[2] && !g[3]) return null;
    const sign = g[1] === "-" ? -1 : 1;
    const val = g[2] !== undefined ? Number(g[2]) : 1;
    if (g[3]) m += sign * val; else k += sign * val;
    pos = re.lastIndex;
  }
  return { k, m };
}

function initTableauMystere(cfg) {
  const root = document.getElementById(cfg.containerId);
  if (!root) return;
  const id = cfg.activityId;
  const TOL = 0.011;
  let ex = null;

  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (weights) => { let r = Math.random(), acc = 0; for (const [v, w] of weights) { acc += w; if (r < acc) return v; } return weights[weights.length - 1][0]; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  function draw() {
    const nR = pick([[1, 0.25], [2, 0.55], [3, 0.2]]);
    const nP = pick([[1, 0.35], [2, 0.45], [3, 0.2]]);
    let coefs;
    do { coefs = Array.from({ length: nR + nP }, () => pick([[1, 0.4], [2, 0.3], [3, 0.2], [4, 0.1]])); }
    while (coefs.reduce(gcd) !== 1);                  // équation écrite avec les plus petits entiers

    const letters = "ABCDEF";
    const species = coefs.map((c, i) => ({ name: letters[i], coef: c, reactant: i < nR, color: CH4_MT_COLORS[i] }));
    const reactants = species.filter((sp) => sp.reactant);

    // x_max « candidat » de chaque réactif, au dixième près : toutes les valeurs restent décimales simples
    const stoich = nR >= 2 && Math.random() < 0.2;
    let r;
    if (stoich) { const v = rand(5, 60) / 10; r = reactants.map(() => v); }
    else {
      do { r = reactants.map(() => rand(5, 60) / 10); }
      while (nR >= 2 && [...r].sort((a, b) => a - b)[1] - Math.min(...r) < 0.3);
    }
    reactants.forEach((sp, i) => { sp.n0 = Math.round(sp.coef * r[i] * 10) / 10; sp.xCand = r[i]; });
    species.filter((sp) => !sp.reactant).forEach((sp) => { sp.n0 = 0; });

    const xmax = Math.min(...r);
    const limiting = stoich ? "all" : reactants[r.indexOf(xmax)].name;
    const total = Math.random() < 0.5;
    let xf = xmax;
    if (!total) {
      const hi = Math.max(1, Math.round(xmax * 9) - 1);   // x_f ≤ 0,9·x_max (au dixième)
      xf = rand(Math.max(1, Math.round(xmax * 4)), hi) / 10;
      if (xf >= xmax) xf = Math.round((xmax - 0.1) * 10) / 10;
    }
    const measured = species[rand(0, species.length - 1)];
    const nfMeasured = measured.reactant ? Math.round((measured.n0 - measured.coef * xf) * 10) / 10 : Math.round(measured.coef * xf * 10) / 10;

    ex = { species, reactants, xmax, xf, total, limiting, stoich, measured, nfMeasured,
           unit: Math.random() < 0.5 ? "mol" : "mmol", revealed: false, done: false };
    render();
  }

  const coefTxt = (c) => (c === 1 ? "" : c + " ");
  const expected = {
    init: (sp) => sp.n0,
    cours: (sp) => ({ k: sp.n0, m: sp.reactant ? -sp.coef : sp.coef }),
    fin: (sp) => Math.round((sp.n0 + (sp.reactant ? -1 : 1) * sp.coef * ex.xmax) * 100) / 100
  };
  const coursTxt = (sp) => sp.reactant
    ? `${ch4mtFmt(sp.n0)} − ${sp.coef === 1 ? "" : sp.coef}x`
    : `${sp.coef === 1 ? "" : sp.coef}x`;

  function render() {
    const e = ex, u = e.unit;
    const eq = e.species.map((sp, i) => {
      const sep = i === 0 ? "" : (sp.reactant || i > e.reactants.length ? " + " : " → ");
      return `${sep}${sp.coef === 1 ? "" : `<span class="coef">${sp.coef}</span> `}<span style="color:${sp.color};">${sp.name}</span>`;
    }).join("");
    const head = e.species.map((sp, i) => {
      const sep = i === 0 ? "" : (sp.reactant || i > e.reactants.length ? "+ " : "→ ");
      return `<th>${sep}${coefTxt(sp.coef)}<span style="color:${sp.color};">${sp.name}</span></th>`;
    }).join("");
    const cells = (row) => e.species.map((sp, i) => `<td><input class="mt-in" data-row="${row}" data-i="${i}" autocomplete="off" spellcheck="false" inputmode="${row === "cours" ? "text" : "decimal"}"></td>`).join("");
    const data = e.reactants.map((sp) => `n₀(${sp.name}) = <strong>${ch4mtFmt(sp.n0)} ${u}</strong>`).join(" &nbsp;·&nbsp; ");
    const radios = e.reactants.map((sp) => `<label><input type="radio" name="${id}-lim" value="${sp.name}"> <span style="color:${sp.color};">${sp.name}</span></label>`).join("")
      + (e.reactants.length >= 2 ? `<label><input type="radio" name="${id}-lim" value="all"> Tous (mélange stœchiométrique)</label>` : "");

    root.innerHTML = `
      <div class="big-equation" style="font-size:1.25rem; margin-bottom:12px;">${eq}</div>
      <p class="course-text">${data}. Les produits sont absents à l'état initial.</p>

      <p class="mt-step">1. Construis le tableau d'avancement <span class="hint-dim">(ligne « en cours » : écris par exemple <em>5 − 2x</em> ou <em>3x</em>)</span></p>
      <div style="overflow-x:auto;">
        <table class="adv-table mt-table">
          <thead><tr><th>État du système</th><th>Avancement (${u})</th>${head}</tr></thead>
          <tbody>
            <tr><td>État initial</td><td>x = 0</td>${cells("init")}</tr>
            <tr><td>En cours</td><td>x</td>${cells("cours")}</tr>
            <tr><td>État final si totale</td><td>x = x<sub>max</sub></td>${cells("fin")}</tr>
          </tbody>
        </table>
      </div>

      <p class="mt-step">2. Réactif limitant et avancement maximal</p>
      <div class="challenge-field">
        <label>Quel est le réactif limitant ?</label>
        <div class="challenge-radios" style="flex-wrap:wrap;">${radios}</div>
      </div>
      <div class="challenge-field">
        <label for="${id}-xmax">x<sub>max</sub> (en ${u}) :</label>
        <input id="${id}-xmax" class="challenge-input mt-in" inputmode="decimal" autocomplete="off">
      </div>

      <p class="mt-step">3. L'avancement final est-il maximal ?</p>
      <p class="course-text">À l'état final, on mesure n<sub>f</sub>(<span style="color:${e.measured.color};">${e.measured.name}</span>) = <strong>${ch4mtFmt(e.nfMeasured)} ${u}</strong>.</p>
      <div class="challenge-field">
        <label for="${id}-xf">x<sub>f</sub> (en ${u}) :</label>
        <input id="${id}-xf" class="challenge-input mt-in" inputmode="decimal" autocomplete="off">
      </div>
      <div class="challenge-field">
        <label>Conclusion</label>
        <div class="challenge-radios" style="flex-wrap:wrap;">
          <label><input type="radio" name="${id}-tot" value="tot"> <span>x<sub>f</sub> = x<sub>max</sub> : transformation totale</span></label>
          <label><input type="radio" name="${id}-tot" value="non"> <span>x<sub>f</sub> &lt; x<sub>max</sub> : transformation non totale</span></label>
        </div>
      </div>

      <div class="actions" style="justify-content:flex-start; margin-top:10px; flex-wrap:wrap;">
        <button id="${id}-check">✅ Vérifier</button>
        <button id="${id}-show">👁️ Voir la correction</button>
        <button id="${id}-new">🎲 Nouveau tableau</button>
      </div>
      <div class="challenge-feedback" id="${id}-fb"></div>
    `;
    root.querySelector(`#${id}-check`).addEventListener("click", check);
    root.querySelector(`#${id}-show`).addEventListener("click", reveal);
    root.querySelector(`#${id}-new`).addEventListener("click", draw);
    root.querySelectorAll(".mt-in").forEach((inp) => inp.addEventListener("input", () => inp.classList.remove("ok", "ko")));
  }

  const mark = (inp, ok) => { inp.classList.remove("ok", "ko"); inp.classList.add(ok ? "ok" : "ko"); };
  const radioVal = (name) => { const r = root.querySelector(`input[name="${name}"]:checked`); return r ? r.value : null; };

  function check() {
    const e = ex, fb = root.querySelector(`#${id}-fb`);
    const inputs = [...root.querySelectorAll(".mt-table .mt-in")];
    const xmaxIn = root.querySelector(`#${id}-xmax`), xfIn = root.querySelector(`#${id}-xf`);
    const lim = radioVal(`${id}-lim`), tot = radioVal(`${id}-tot`);
    const all = [...inputs, xmaxIn, xfIn];
    const empty = all.filter((i) => !i.value.trim()).length + (lim ? 0 : 1) + (tot ? 0 : 1);
    if (empty === all.length + 2) {
      fb.innerHTML = `<p style="color:var(--coral);">Commence par remplir au moins une case.</p>`;
      return;
    }
    const errs = { init: 0, cours: 0, fin: 0 };
    let coursCoefOnly = 0;
    inputs.forEach((inp) => {
      inp.classList.remove("ok", "ko");
      if (!inp.value.trim()) return;                  // case vide : non corrigée
      const sp = e.species[+inp.dataset.i], row = inp.dataset.row;
      let ok;
      if (row === "cours") {
        const got = ch4mtLinear(inp.value), want = expected.cours(sp);
        ok = !!got && Math.abs(got.k - want.k) < TOL && Math.abs(got.m - want.m) < TOL;
        if (!ok && got && Math.abs(got.k - want.k) < TOL && Math.abs(Math.abs(got.m) - 1) < TOL && sp.coef !== 1) coursCoefOnly++;
      } else {
        const v = ch4mtNumber(inp.value);
        ok = Math.abs(v - expected[row](sp)) < TOL;
      }
      mark(inp, ok);
      if (!ok) errs[row]++;
    });
    const grade = (inp, want) => { if (!inp.value.trim()) return null; const ok = Math.abs(ch4mtNumber(inp.value) - want) < TOL; mark(inp, ok); return ok; };
    xmaxIn.classList.remove("ok", "ko"); xfIn.classList.remove("ok", "ko");
    const okLim = lim === null ? null : lim === e.limiting;
    const okXmax = grade(xmaxIn, e.xmax);
    const okXf = grade(xfIn, e.xf);
    const okTot = tot === null ? null : (tot === "tot") === e.total;
    const wrong = errs.init + errs.cours + errs.fin + [okLim, okXmax, okXf, okTot].filter((v) => v === false).length;
    const allOk = empty === 0 && wrong === 0;

    const tips = [];
    if (errs.init) tips.push(`État initial : ${errs.init} case(s) fausse(s). Recopie les n₀ de l'énoncé ; les produits valent 0.`);
    if (errs.cours) tips.push(`Ligne « en cours » : ${errs.cours} case(s) fausse(s). Un réactif perd (coefficient) × x, un produit gagne (coefficient) × x.` + (coursCoefOnly ? " As-tu oublié un coefficient stœchiométrique ?" : ""));
    if (errs.fin) tips.push(`État final : ${errs.fin} case(s) fausse(s). Remplace x par x<sub>max</sub> dans la ligne « en cours ».`);
    if (okLim === false || okXmax === false) tips.push("Réactif limitant / x<sub>max</sub> : pour chaque réactif, cherche la valeur de x qui l'épuise (n₀ − a·x = 0). La plus petite est x<sub>max</sub>.");
    if (okXf === false) tips.push(`x<sub>f</sub> : utilise la case de ${e.measured.name} dans la ligne « en cours » et la valeur mesurée.`);
    if (okTot === false) tips.push("Conclusion : compare x<sub>f</sub> et x<sub>max</sub>.");

    const left = empty ? `<p class="course-text" style="color:var(--chalk-dim); font-size:0.9rem;">Encore ${empty} réponse(s) à donner.</p>` : "";
    if (allOk) fb.innerHTML = `<p style="color:var(--teal); font-weight:700;">✅ Bravo, tableau et conclusions exacts !${e.revealed ? " <em style=\"font-weight:400;\">(Correction déjà vue : non compté. Tente un nouveau tableau.)</em>" : ""}</p>`;
    else if (!wrong) fb.innerHTML = `<p style="color:var(--teal); font-weight:700;">👍 Tout ce que tu as rempli est juste.</p>${left}`;
    else fb.innerHTML = `<p style="color:var(--coral); font-weight:700;">❌ Corrige les cases en rouge :</p><ul class="course-text" style="font-size:0.9rem; padding-left:20px;">${tips.map((t) => `<li>${t}</li>`).join("")}</ul>${left}`;
    if (allOk && !e.revealed && !e.done) { e.done = true; ProgressStore.record(cfg.chapterId, cfg.activityId, true); }
  }

  function reveal() {
    const e = ex, u = e.unit;
    e.revealed = true;
    root.querySelectorAll(".mt-table .mt-in").forEach((inp) => {
      const sp = e.species[+inp.dataset.i], row = inp.dataset.row;
      inp.value = row === "cours" ? coursTxt(sp) : ch4mtFmt(expected[row](sp));
      mark(inp, true);
    });
    const xmaxIn = root.querySelector(`#${id}-xmax`), xfIn = root.querySelector(`#${id}-xf`);
    xmaxIn.value = ch4mtFmt(e.xmax); mark(xmaxIn, true);
    xfIn.value = ch4mtFmt(e.xf); mark(xfIn, true);
    root.querySelectorAll(`input[name="${id}-lim"]`).forEach((r) => { r.checked = r.value === e.limiting; });
    root.querySelectorAll(`input[name="${id}-tot"]`).forEach((r) => { r.checked = (r.value === "tot") === e.total; });

    const cand = e.reactants.map((sp) => `Si ${sp.name} est limitant : ${ch4mtFmt(sp.n0)} − ${sp.coef === 1 ? "" : sp.coef}x = 0 ⇒ x = ${sp.coef === 1 ? "" : `${ch4mtFmt(sp.n0)} / ${sp.coef} = `}${ch4mtFmt(sp.xCand)} ${u}`).join("<br>");
    const limTxt = e.limiting === "all"
      ? `Toutes les valeurs sont égales : mélange stœchiométrique, tous les réactifs sont épuisés ensemble. x<sub>max</sub> = ${ch4mtFmt(e.xmax)} ${u}.`
      : (e.reactants.length === 1
        ? `Seul réactif : ${e.limiting} est limitant et x<sub>max</sub> = ${ch4mtFmt(e.xmax)} ${u}.`
        : `La plus petite valeur l'emporte : x<sub>max</sub> = ${ch4mtFmt(e.xmax)} ${u}, le réactif limitant est ${e.limiting}.`);
    const m = e.measured;
    const xfTxt = m.reactant
      ? `n<sub>f</sub>(${m.name}) = ${ch4mtFmt(m.n0)} − ${m.coef === 1 ? "" : m.coef}x<sub>f</sub> = ${ch4mtFmt(e.nfMeasured)} ⇒ x<sub>f</sub> = ${m.coef === 1 ? "" : "("}${ch4mtFmt(m.n0)} − ${ch4mtFmt(e.nfMeasured)}${m.coef === 1 ? "" : `) / ${m.coef}`} = ${ch4mtFmt(e.xf)} ${u}`
      : `n<sub>f</sub>(${m.name}) = ${m.coef === 1 ? "" : m.coef}x<sub>f</sub> = ${ch4mtFmt(e.nfMeasured)} ⇒ x<sub>f</sub> = ${m.coef === 1 ? "" : `${ch4mtFmt(e.nfMeasured)} / ${m.coef} = `}${ch4mtFmt(e.xf)} ${u}`;
    const concl = e.total
      ? `x<sub>f</sub> = x<sub>max</sub> : la transformation est <strong>totale</strong>.`
      : `x<sub>f</sub> = ${ch4mtFmt(e.xf)} ${u} &lt; x<sub>max</sub> = ${ch4mtFmt(e.xmax)} ${u} : la transformation est <strong>non totale</strong>.`;
    root.querySelector(`#${id}-fb`).innerHTML = `
      <div class="method-box" style="margin-top:6px;">
        <span class="box-label">🔧 Correction</span>
        <div class="course-text" style="line-height:1.9; font-size:0.92rem;">${cand}<br>${limTxt}<br>${xfTxt}<br>${concl}</div>
      </div>`;
  }

  draw();
  return { get exercise() { return ex; }, draw };
}

/* ================================================================== */
/* Diapos v2 — moteur « recette » : des jetons qui se combinent        */
/* (sandwich, A + 2B → C, I₂ / S₂O₃²⁻). Les fonctions plus haut restent */
/* utilisées par le site.                                              */
/* ================================================================== */
function initRecipeStage(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const stage = $(cfg.stageId), tbody = $(cfg.tableBodyId), counter = $(cfg.counterId), msg = $(cfg.msgId);
  const bPlus = $(cfg.plusId), bMinus = $(cfg.minusId), bPlay = $(cfg.playId), bReset = $(cfg.resetId), stock = $(cfg.stockId);
  if (!stage) return;
  const W = cfg.width || 1000, ROW_H = cfg.rowH || 96, LABEL_W = cfg.labelW || 230, TOK = cfg.tokenSize || 56;
  const MAX_STEP = cfg.maxStep || 76, LBL = cfg.labelSize || 30;
  const R = cfg.reactants.map((r) => Object.assign({ step: 1, min: 1, max: 12 }, r));
  const P = cfg.products.map((p) => Object.assign({}, p));
  const ALL = R.concat(P);
  const CHALK = "#f2ede1", YEL = "#e8c468", CORAL = "#d97a63";
  const EASE = "cubic-bezier(.55,0,.25,1)";
  const unit = cfg.unit ? " " + cfg.unit : "";
  let x = 0, xmax = 0, busy = false, playing = false, rows = [], timers = [];

  const calcXmax = () => Math.min.apply(null, R.map((r) => Math.floor(r.n0 / r.coef)));
  const tokenHTML = (sp) => sp.html || '<span style="font-size:' + Math.round(TOK * 0.84) + 'px;line-height:1;">' + sp.token + "</span>";
  const slot = (row, j) => ({ left: LABEL_W + j * row.step + (row.step - TOK) / 2, top: row.top + (ROW_H - TOK) / 2 });
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  function makeToken(sp, pos, pop) {
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;left:" + pos.left + "px;top:" + pos.top + "px;width:" + TOK + "px;height:" + TOK +
      "px;display:flex;align-items:center;justify-content:center;transition:left .5s " + EASE + ",top .5s " + EASE +
      ",opacity .3s ease,transform .35s " + EASE + ";";
    el.innerHTML = tokenHTML(sp);
    if (pop) { el.style.opacity = "0"; el.style.transform = "scale(.3)"; }
    stage.appendChild(el);
    if (pop) { void el.offsetWidth; requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "scale(1)"; }); }
    return el;
  }
  const moveTo = (el, pos) => { el.style.left = pos.left + "px"; el.style.top = pos.top + "px"; };

  function build() {
    timers.forEach(clearTimeout); timers = [];
    playing = false; busy = false; x = 0; xmax = calcXmax();
    stage.innerHTML = "";
    stage.style.position = "relative";
    stage.style.height = ALL.length * ROW_H + 18 + "px";
    const caps = ALL.map((sp, i) => (i < R.length ? sp.n0 : sp.coef * xmax));
    const step = Math.min(MAX_STEP, (W - LABEL_W) / Math.max(1, Math.max.apply(null, caps)));
    const sep = document.createElement("div");
    sep.style.cssText = "position:absolute;left:0;right:0;top:" + (R.length * ROW_H + 8) + "px;border-top:2px dashed rgba(242,237,225,0.18);";
    stage.appendChild(sep);
    rows = ALL.map((sp, i) => {
      const isP = i >= R.length;
      const top = i * ROW_H + (isP ? 18 : 0);
      const lab = document.createElement("div");
      lab.style.cssText = "position:absolute;left:0;top:" + top + "px;height:" + ROW_H + "px;width:" + (LABEL_W - 16) +
        "px;display:flex;flex-direction:column;justify-content:center;font-family:Kalam,cursive;line-height:1.1;font-size:" + LBL + "px;";
      lab.innerHTML = '<span style="color:' + sp.color + ';transition:color .3s ease;">' + sp.label + '</span><span style="color:' + CHALK + ';transition:color .3s ease;"></span>';
      stage.appendChild(lab);
      const row = { sp, top, step, tokens: [], name: lab.children[0], nEl: lab.children[1] };
      if (!isP) for (let j = 0; j < sp.n0; j++) row.tokens.push(makeToken(sp, slot(row, j), false));
      return row;
    });
    update();
  }

  function fR(r, v) {
    const k = r.coef > 1 ? r.coef : "";
    if (v === null) return r.n0 + " − " + k + "<em>x</em>";
    return r.n0 + " − " + (r.coef > 1 ? r.coef + "×" : "") + v + ' = <strong style="color:' + YEL + ';">' + (r.n0 - r.coef * v) + "</strong>";
  }
  function fP(p, v) {
    if (v === null) return (p.coef > 1 ? p.coef : "") + "<em>x</em>";
    return p.coef > 1 ? p.coef + "×" + v + ' = <strong style="color:' + YEL + ';">' + p.coef * v + "</strong>"
      : '<strong style="color:' + YEL + ';">' + v + "</strong>";
  }
  function tableHTML(done) {
    const L = cfg.rowLabels || ["État initial", "État intermédiaire", "État final"];
    const mid = x > 0 && !done;
    const q = '<span style="color:rgba(242,237,225,0.4);">?</span>';
    const tr = (on, cells) => '<tr class="' + (on ? "row-active" : "") + '">' + cells.map((c) => "<td>" + c + "</td>").join("") + "</tr>";
    return tr(x === 0, [L[0], "<em>x</em> = 0"].concat(R.map((r) => r.n0), P.map(() => 0))) +
      tr(mid, [L[1], mid ? "<em>x</em> = " + x : "<em>x</em>"].concat(R.map((r) => fR(r, mid ? x : null)), P.map((p) => fP(p, mid ? x : null)))) +
      tr(done && x > 0, [L[2], "<em>x</em><sub>max</sub> = " + (done ? xmax : q)].concat(
        R.map((r) => (done ? fR(r, xmax) : q)), P.map((p) => (done ? fP(p, xmax) : q))));
  }

  function update() {
    const c = ALL.map((sp, i) => (i < R.length ? sp.n0 - sp.coef * x : sp.coef * x));
    const done = x >= xmax;
    rows.forEach((row, i) => {
      row.nEl.textContent = c[i] + unit;
      if (i < R.length) {
        const out = done && c[i] < R[i].coef;
        row.name.style.color = out ? CORAL : R[i].color;
        row.nEl.style.color = out ? CORAL : CHALK;
      }
    });
    if (counter) counter.innerHTML = cfg.counterText ? cfg.counterText(x, xmax, done) : "<em>x</em> = " + x + unit;
    if (tbody) tbody.innerHTML = tableHTML(done);
    if (msg) {
      let html;
      if (x === 0 && !done) html = cfg.msgStart;
      else if (!done) html = cfg.msgStep(x);
      else {
        const left = R.map((r, i) => ({ label: r.label, n: c[i], out: c[i] < r.coef }));
        html = left.every((l) => l.n === 0) ? cfg.msgStoich(xmax) : cfg.msgLimit(xmax, left.filter((l) => l.out), left.filter((l) => l.n > 0));
      }
      msg.innerHTML = html;
      msg.style.borderLeftColor = done ? CORAL : "rgba(242,237,225,0.2)";
    }
    if (bMinus) { bMinus.disabled = x === 0; bMinus.style.opacity = x === 0 ? "0.35" : "1"; }
    if (bPlus) { bPlus.disabled = done; bPlus.style.opacity = done ? "0.35" : "1"; }
    if (cfg.onUpdate) cfg.onUpdate({ x, xmax, counts: c, reactants: R });
  }

  function step() {
    if (busy || x >= xmax) return false;
    busy = true;
    const p0 = rows[R.length];
    const target = slot(p0, p0.tokens.length);
    const moving = [];
    R.forEach((r, i) => { for (let k = 0; k < r.coef; k++) { const t = rows[i].tokens.pop(); if (t) moving.push(t); } });
    moving.forEach((t, k) => {
      t.style.zIndex = "3";
      moveTo(t, { left: target.left + (k - (moving.length - 1) / 2) * TOK * 0.32, top: target.top });
    });
    later(() => {
      moving.forEach((t) => { t.style.opacity = "0"; t.style.transform = "scale(.5)"; });
      x++;
      P.forEach((p, pi) => {
        const row = rows[R.length + pi];
        for (let k = 0; k < p.coef; k++) row.tokens.push(makeToken(p, slot(row, row.tokens.length), true));
      });
      update();
    }, 520);
    later(() => { moving.forEach((t) => t.remove()); busy = false; }, 860);
    return true;
  }

  function back() {
    if (busy || x <= 0) return;
    stopPlay();
    busy = true;
    const p0 = rows[R.length];
    const last = p0.tokens[p0.tokens.length - 1];
    const origin = { left: parseFloat(last.style.left), top: parseFloat(last.style.top) };
    P.forEach((p, pi) => {
      const row = rows[R.length + pi];
      for (let k = 0; k < p.coef; k++) {
        const t = row.tokens.pop();
        if (!t) continue;
        t.style.opacity = "0"; t.style.transform = "scale(.3)";
        later(() => t.remove(), 360);
      }
    });
    x--;
    R.forEach((r, i) => {
      const row = rows[i];
      for (let k = 0; k < r.coef; k++) {
        const j = row.tokens.length;
        const t = makeToken(r, origin, false);
        row.tokens.push(t);
        later(() => moveTo(t, slot(row, j)), 30);
      }
    });
    update();
    later(() => { busy = false; }, 580);
  }

  function setPlayLabel() { if (bPlay) bPlay.textContent = playing ? "⏸ Pause" : (cfg.playLabel || "▶ Tout faire"); }
  function stopPlay() { playing = false; setPlayLabel(); }
  function tick() {
    if (!playing) return;
    if (!step()) {
      if (busy) { later(tick, 120); return; }
      stopPlay(); return;
    }
    later(tick, 920);
  }
  function play() {
    if (playing) { stopPlay(); return; }
    if (x >= xmax) build();
    playing = true; setPlayLabel(); tick();
  }

  if (stock) {
    stock.innerHTML = "";
    R.forEach((r) => {
      const g = document.createElement("div");
      g.style.cssText = "display:flex;align-items:center;gap:12px;";
      const BS = cfg.stockBtn || 52, FS = cfg.stockFont || 30;
      const btn = "font-family:Kalam,cursive;font-size:" + FS + "px;width:" + BS + "px;height:" + BS + "px;background:transparent;color:#f2ede1;border:2px solid rgba(242,237,225,0.35);border-radius:10px;cursor:pointer;line-height:1;padding:0;";
      g.innerHTML = '<span style="font-family:Kalam,cursive;font-size:' + FS + 'px;color:' + r.color + ';min-width:' + (cfg.stockLabelW || 120) + 'px;">' + (r.stockLabel || r.label) +
        '</span><button style="' + btn + '">−</button><span style="font-family:Kalam,cursive;font-size:' + FS + 'px;min-width:44px;text-align:center;"></span><button style="' + btn + '">+</button>';
      const [minus, val, plus] = [g.children[1], g.children[2], g.children[3]];
      const show = () => { val.textContent = r.n0; };
      minus.addEventListener("click", () => { r.n0 = Math.max(r.min, r.n0 - r.step); show(); build(); });
      plus.addEventListener("click", () => { r.n0 = Math.min(r.max, r.n0 + r.step); show(); build(); });
      show();
      stock.appendChild(g);
    });
  }
  if (bPlus) bPlus.addEventListener("click", () => { stopPlay(); step(); });
  if (bMinus) bMinus.addEventListener("click", back);
  if (bPlay) bPlay.addEventListener("click", play);
  if (bReset) bReset.addEventListener("click", build);
  setPlayLabel();
  build();
}

/* ================================================================== */
/* Diapos v2 — réactif limitant : chaque réactif annonce jusqu'où il   */
/* peut tenir, la réaction s'arrête au premier épuisé (2 A + B → P)    */
/* ================================================================== */
function initLimitRace(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const root = $(cfg.rootId), readout = $(cfg.readoutId), stock = $(cfg.stockId), bRun = $(cfg.runId);
  if (!root) return;
  const R = cfg.reactants.map((r) => Object.assign({ min: 1, max: 12 }, r));
  const W = cfg.width || 1000, LABEL_W = 230, LANE_H = 100, SMAX = cfg.scaleMax || 12;
  const TRACK = W - LABEL_W - 30;
  const px = (v) => (TRACK * v) / SMAX;
  const CORAL = "#d97a63", YEL = "#e8c468", TEAL = "#6bbfab";
  const nf = (v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  let timer = null;

  root.style.position = "relative";
  root.style.height = (R.length + 1) * LANE_H + 60 + "px";
  root.innerHTML = "";
  const lanes = R.concat([{ label: "Réaction", color: CORAL, isRx: true }]).map((r, i) => {
    const top = i * LANE_H;
    const lab = document.createElement("div");
    lab.style.cssText = "position:absolute;left:0;top:" + top + "px;height:" + LANE_H + "px;width:" + (LABEL_W - 16) + "px;display:flex;flex-direction:column;justify-content:center;line-height:1.15;";
    lab.innerHTML = r.isRx
      ? '<span style="font-family:Kalam,cursive;font-size:32px;color:' + CORAL + ';">Réaction</span><span style="font-size:24px;color:#c9c2b0;">avancement <em>x</em></span>'
      : '<span style="font-family:Kalam,cursive;font-size:32px;color:' + r.color + ';">Si ' + r.label + ' limitant</span><span style="font-size:24px;color:#c9c2b0;">n₀(' + r.label + ') / ' + r.coef + "</span>";
    const track = document.createElement("div");
    track.style.cssText = "position:absolute;left:" + LABEL_W + "px;top:" + (top + 24) + "px;width:" + TRACK + "px;height:52px;border-radius:10px;background:rgba(0,0,0,0.25);border:2px solid rgba(242,237,225,0.12);transition:border-color .3s ease,background .3s ease;";
    const fill = document.createElement("div");
    fill.style.cssText = "position:absolute;left:0;top:0;bottom:0;width:0;border-radius:8px;background:" + r.color + ";opacity:" + (r.isRx ? 0.9 : 0.35) + ";";
    const end = document.createElement("div");
    end.style.cssText = "position:absolute;top:-8px;bottom:-8px;width:5px;margin-left:-2px;border-radius:3px;background:" + r.color + ";transition:left .35s ease;";
    const val = document.createElement("div");
    val.style.cssText = "position:absolute;top:8px;font-family:Kalam,cursive;font-size:28px;color:#f2ede1;white-space:nowrap;transition:left .35s ease;";
    track.appendChild(fill);
    if (!r.isRx) { track.appendChild(end); track.appendChild(val); fill.style.transition = "width .35s ease"; }
    root.appendChild(lab); root.appendChild(track);
    return { r, lab, track, fill, end, val };
  });
  const cursor = document.createElement("div");
  cursor.style.cssText = "position:absolute;top:6px;height:" + ((R.length + 1) * LANE_H - 12) + "px;width:0;border-left:3px dashed " + CORAL + ";left:" + LABEL_W + "px;";
  root.appendChild(cursor);
  const axis = document.createElement("div");
  axis.style.cssText = "position:absolute;left:" + LABEL_W + "px;top:" + ((R.length + 1) * LANE_H + 6) + "px;width:" + TRACK + "px;height:50px;border-top:2px solid rgba(242,237,225,0.3);";
  for (let v = 0; v <= SMAX; v += 2) {
    axis.innerHTML += '<span style="position:absolute;left:' + px(v) + 'px;top:6px;transform:translateX(-50%);font-size:24px;color:#c9c2b0;">' + v + "</span>";
  }
  axis.innerHTML += '<span style="position:absolute;right:-6px;top:-40px;font-size:24px;color:#c9c2b0;">mol</span>';
  root.appendChild(axis);

  function values() {
    const xm = R.map((r) => r.n0 / r.coef);
    const xmax = Math.min.apply(null, xm);
    const stoich = xm.every((v) => Math.abs(v - xmax) < 1e-9);
    return { xm, xmax, stoich };
  }

  function formulas(v, showEnd) {
    let h = R.map((r, i) => '<div>Si <span style="color:' + r.color + ';">' + r.label + "</span> limitant : <em>x</em><sub>max</sub> = " + r.n0 + " / " + r.coef + " = <strong>" + nf(v.xm[i]) + " mol</strong></div>").join("");
    if (showEnd) {
      const badge = v.stoich
        ? '<span class="limiting-badge stoich">mélange stœchiométrique : les deux s\'épuisent ensemble</span>'
        : '<span class="limiting-badge">réactif limitant : ' + R[v.xm.indexOf(v.xmax)].label + "</span>";
      h += '<div style="margin-top:8px;color:#f2ede1;"><em>x</em><sub>max</sub> = min(' + v.xm.map(nf).join(" ; ") + ') = <strong style="color:' + YEL + ';">' + nf(v.xmax) + " mol</strong></div><div style=\"margin-top:10px;\">" + badge + "</div>";
    } else {
      h += '<div style="margin-top:8px;color:#c9c2b0;">La réaction avance…</div>';
    }
    readout.innerHTML = h;
  }

  function run() {
    clearTimeout(timer);
    const v = values();
    lanes.forEach((l, i) => {
      if (l.r.isRx) return;
      l.fill.style.width = px(v.xm[i]) + "px";
      l.end.style.left = px(v.xm[i]) + "px";
      l.val.style.left = px(v.xm[i]) + 14 + "px";
      l.val.textContent = nf(v.xm[i]) + " mol";
      l.track.style.borderColor = "rgba(242,237,225,0.12)";
      l.track.style.background = "rgba(0,0,0,0.25)";
    });
    const rx = lanes[lanes.length - 1];
    rx.fill.style.transition = "none"; rx.fill.style.width = "0";
    cursor.style.transition = "none"; cursor.style.left = LABEL_W + "px";
    void rx.fill.offsetWidth;
    const dur = Math.max(0.6, v.xmax * 0.28);
    rx.fill.style.transition = "width " + dur + "s linear";
    cursor.style.transition = "left " + dur + "s linear";
    requestAnimationFrame(() => {
      rx.fill.style.width = px(v.xmax) + "px";
      cursor.style.left = LABEL_W + px(v.xmax) + "px";
    });
    formulas(v, false);
    timer = setTimeout(() => {
      lanes.forEach((l, i) => {
        if (l.r.isRx) return;
        const hit = Math.abs(v.xm[i] - v.xmax) < 1e-9;
        if (hit) { l.track.style.borderColor = CORAL; l.track.style.background = "rgba(217,122,99,0.14)"; }
      });
      formulas(v, true);
    }, dur * 1000 + 80);
  }

  if (stock) {
    stock.innerHTML = "";
    R.forEach((r) => {
      const g = document.createElement("div");
      g.style.cssText = "display:flex;align-items:center;gap:12px;";
      const BS = cfg.stockBtn || 52, FS = cfg.stockFont || 30;
      const btn = "font-family:Kalam,cursive;font-size:" + FS + "px;width:" + BS + "px;height:" + BS + "px;background:transparent;color:#f2ede1;border:2px solid rgba(242,237,225,0.35);border-radius:10px;cursor:pointer;line-height:1;padding:0;";
      g.innerHTML = '<span style="font-family:Kalam,cursive;font-size:' + FS + 'px;color:' + r.color + ';min-width:' + (cfg.stockLabelW || 130) + 'px;">n₀(' + r.label + ')</span><button style="' + btn + '">−</button><span style="font-family:Kalam,cursive;font-size:' + FS + 'px;min-width:' + (cfg.stockValW || 110) + 'px;text-align:center;"></span><button style="' + btn + '">+</button>';
      const [minus, val, plus] = [g.children[1], g.children[2], g.children[3]];
      const show = () => { val.textContent = r.n0 + " mol"; };
      minus.addEventListener("click", () => { r.n0 = Math.max(r.min, r.n0 - 1); show(); run(); });
      plus.addEventListener("click", () => { r.n0 = Math.min(r.max, r.n0 + 1); show(); run(); });
      show();
      stock.appendChild(g);
    });
  }
  if (bRun) bRun.addEventListener("click", run);
  run();
}

/* Diapos v2 — eau en excès, version TP : 250 mL d'eau + m g d'acide éthanoïque */
function initExcessTP(cfg) {
  const $ = (id) => document.getElementById(id);
  const root = $(cfg.rootId), slider = $(cfg.sliderId);
  if (!root || !slider) return;
  const M_AC = 60, NW = 250 / 18, W = cfg.width || 1700, LABEL_W = 290, SMAX = 15;
  const TRACK = W - LABEL_W - 200;
  const px = (v) => (TRACK * v) / SMAX;
  const nf = (v, d) => v.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  root.style.position = "relative";
  root.style.height = "236px";
  root.innerHTML = "";
  const lane = (top, label, sub, color) => {
    const lab = document.createElement("div");
    lab.style.cssText = "position:absolute;left:0;top:" + top + "px;height:92px;width:" + (LABEL_W - 16) + "px;display:flex;flex-direction:column;justify-content:center;line-height:1.15;";
    lab.innerHTML = '<span style="font-family:Kalam,cursive;font-size:32px;color:' + color + ';">' + label + '</span><span style="font-size:24px;color:#c9c2b0;">' + sub + "</span>";
    const bar = document.createElement("div");
    bar.style.cssText = "position:absolute;left:" + LABEL_W + "px;top:" + (top + 20) + "px;height:52px;border-radius:8px;background:" + color + ";opacity:.85;transition:width .3s ease;";
    const val = document.createElement("div");
    val.style.cssText = "position:absolute;top:" + (top + 26) + "px;font-family:Kalam,cursive;font-size:32px;color:#f2ede1;white-space:nowrap;transition:left .3s ease;";
    root.appendChild(lab); root.appendChild(bar); root.appendChild(val);
    return { bar, val };
  };
  const a = lane(0, "Acide éthanoïque", "CH₃COOH", "#d97a63");
  const w = lane(100, "Eau", "H₂O · 250 mL", "#6bbfab");
  const axis = document.createElement("div");
  axis.style.cssText = "position:absolute;left:" + LABEL_W + "px;top:200px;width:" + TRACK + "px;border-top:2px solid rgba(242,237,225,0.3);";
  for (let v = 0; v <= SMAX; v += 5) axis.innerHTML += '<span style="position:absolute;left:' + px(v) + 'px;top:4px;transform:translateX(-50%);font-size:24px;color:#c9c2b0;">' + v + "</span>";
  axis.innerHTML += '<span style="position:absolute;left:' + (TRACK + 30) + 'px;top:4px;font-size:24px;color:#c9c2b0;">mol</span>';
  root.appendChild(axis);
  w.bar.style.width = px(NW) + "px";
  w.val.style.left = LABEL_W + px(NW) + 16 + "px";
  w.val.textContent = "13,9 mol";
  const set = (id, h) => { const el = $(id); if (el) el.innerHTML = h; };
  function draw() {
    const m = Number(slider.value) / 10;
    const n = m / M_AC;
    const wa = Math.max(3, px(n));
    a.bar.style.width = wa + "px";
    a.val.style.left = LABEL_W + wa + 16 + "px";
    a.val.textContent = nf(n, 3) + " mol";
    set(cfg.massId, nf(m, 1) + " g");
    set(cfg.calcId, "<em>n</em> = " + nf(m, 1) + " / 60 = <strong style=\"color:#e8c468;\">" + nf(n, 3) + " mol</strong>");
    set(cfg.readoutId,
      "<div>Au maximum, l'eau consommée vaut <strong style=\"color:#e8c468;\">" + nf(n, 3) + " mol</strong>, soit " + nf((100 * n) / NW, 1) + " % de l'eau.</div>" +
      "<div>Eau restante : " + nf(NW, 2) + " − " + nf(n, 2) + " = <strong style=\"color:#e8c468;\">" + nf(NW - n, 2) + " mol</strong> au lieu de " + nf(NW, 2) + " mol</div>" +
      "<div style=\"margin-top:8px;color:#c9c2b0;\">Il y a environ " + Math.round(NW / n) + " fois plus d'eau que d'acide : l'eau ne peut pas être limitante.</div>");
  }
  slider.addEventListener("input", draw);
  draw();
}
