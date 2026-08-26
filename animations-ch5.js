/* Animations du chapitre 5 — 1ère spé PC */

/* ---------- 15. Tableau d'avancement interactif (barres animées) ---------- */
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

  function fmt(n) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }

  function drawTable(n0I2, n0S2O3, x, xMax) {
    const isInitial = x <= 0.001;
    const isFinal = x >= xMax - 0.001;
    const isInter = !isInitial && !isFinal;

    tableBody.innerHTML = `
      <tr class="${isInitial ? 'row-active' : ''}">
        <td>État initial</td><td>x = 0</td>
        <td>${fmt(n0I2)}</td><td>${fmt(n0S2O3)}</td><td>0,0</td><td>0,0</td>
      </tr>
      <tr class="${isInter ? 'row-active' : ''}">
        <td>État intermédiaire</td><td>0 &lt; x &lt; x<sub>max</sub></td>
        <td>${fmt(n0I2)} − x</td><td>${fmt(n0S2O3)} − 2x</td><td>2x</td><td>x</td>
      </tr>
      <tr class="${isFinal ? 'row-active' : ''}">
        <td>État final</td><td>x = x<sub>max</sub> = ${fmt(xMax)}</td>
        <td>${fmt(n0I2 - xMax)}</td><td>${fmt(n0S2O3 - 2 * xMax)}</td><td>${fmt(2 * xMax)}</td><td>${fmt(xMax)}</td>
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
