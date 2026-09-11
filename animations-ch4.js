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
/* Entraînement — Défi interactif : Bilan de matière (tirage aléatoire) */
/* ================================================================== */
function initBilanChallenge(cfg) {
  const container = document.getElementById(cfg.containerId);
  const chapterId = cfg.chapterId;
  const activityId = cfg.activityId;

  let state = null;

  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function drawExercise() {
    let a, b, n0A, n0B, xmax1, xmax2;
    // on retire les tirages trop proches d'une égalité pour éviter l'ambiguïté du réactif limitant
    do {
      a = randInt(1, 3);
      b = randInt(1, 3);
      n0A = randInt(2, 12);
      n0B = randInt(2, 12);
      xmax1 = n0A / a;
      xmax2 = n0B / b;
    } while (Math.abs(xmax1 - xmax2) < 0.4);

    const limiting = xmax1 < xmax2 ? "A" : "B";
    const xmax = Math.min(xmax1, xmax2);
    const c = randInt(1, 3);

    state = { a, b, c, n0A, n0B, xmax1, xmax2, limiting, xmax, checked: false };
    renderExercise();
  }

  function renderExercise() {
    const s = state;
    container.innerHTML = `
      <div class="big-equation" style="font-size:1.15rem; margin-bottom:14px;">
        <span class="coef">${s.a}</span> <span style="color:var(--yellow);">A</span>
        &nbsp;+&nbsp;
        <span class="coef">${s.b}</span> <span style="color:var(--teal);">B</span>
        &nbsp;→&nbsp;
        <span class="coef">${s.c}</span> <span style="color:var(--coral);">C</span>
      </div>
      <p class="course-text">n₀(A) = <strong>${s.n0A} mol</strong> &nbsp;—&nbsp; n₀(B) = <strong>${s.n0B} mol</strong></p>

      <div class="challenge-field">
        <label>Quel est le réactif limitant ?</label>
        <div class="challenge-radios">
          <label><input type="radio" name="${cfg.activityId}-limiting" value="A"> A</label>
          <label><input type="radio" name="${cfg.activityId}-limiting" value="B"> B</label>
        </div>
      </div>

      <div class="challenge-field">
        <label for="${cfg.activityId}-xmax">Valeur de x<sub>max</sub> (en mol) :</label>
        <input type="number" step="0.1" id="${cfg.activityId}-xmax" class="challenge-input">
      </div>

      <div class="actions" style="justify-content:flex-start; margin-top:10px;">
        <button id="${cfg.activityId}-check">✅ Vérifier</button>
        <button id="${cfg.activityId}-redraw">🎲 Nouveau tirage</button>
      </div>
      <div class="challenge-feedback" id="${cfg.activityId}-feedback"></div>
    `;

    container.querySelector(`#${cfg.activityId}-check`).addEventListener("click", checkAnswer);
    container.querySelector(`#${cfg.activityId}-redraw`).addEventListener("click", drawExercise);
  }

  function checkAnswer() {
    const s = state;
    const feedback = container.querySelector(`#${cfg.activityId}-feedback`);
    const radios = container.querySelectorAll(`input[name="${cfg.activityId}-limiting"]`);
    let chosenLimiting = null;
    radios.forEach(r => { if (r.checked) chosenLimiting = r.value; });
    const xmaxInput = container.querySelector(`#${cfg.activityId}-xmax`);
    const chosenXmax = Number(xmaxInput.value);

    if (chosenLimiting === null || xmaxInput.value === "") {
      feedback.innerHTML = `<p style="color:var(--coral);">Réponds aux deux questions avant de vérifier.</p>`;
      return;
    }

    const limitingOk = chosenLimiting === s.limiting;
    const xmaxOk = Math.abs(chosenXmax - s.xmax) < 0.05;
    const allOk = limitingOk && xmaxOk;

    feedback.innerHTML = `
      <p style="color:${allOk ? 'var(--teal)' : 'var(--coral)'}; font-weight:700;">
        ${allOk ? "✅ Bravo, c'est exact !" : "❌ Pas tout à fait."}
      </p>
      <p class="course-text" style="font-size:0.88rem;">
        x<sub>max,1</sub> (A limitant) = ${s.n0A} / ${s.a} = ${fmt1(s.xmax1)} mol<br>
        x<sub>max,2</sub> (B limitant) = ${s.n0B} / ${s.b} = ${fmt1(s.xmax2)} mol<br>
        Le plus petit des deux impose x<sub>max</sub> = ${fmt1(s.xmax)} mol : le réactif limitant est <strong>${s.limiting}</strong>.
      </p>
    `;

    if (allOk && !s.checked) {
      s.checked = true;
      ProgressStore.record(chapterId, activityId, true);
    }
  }

  drawExercise();
}
