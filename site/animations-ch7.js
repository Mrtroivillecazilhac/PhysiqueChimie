/* Animations du chapitre 7 — 1ère spé PC */

/* ---------- 21. Simulation du titrage colorimétrique ---------- */
function initTitrationSim(cfg) {
  const svgFlask = document.getElementById(cfg.svgFlaskId);
  const svgMol = document.getElementById(cfg.svgMolId);
  const vbRange = document.getElementById(cfg.vbRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const tableBody = document.getElementById(cfg.tableBodyId);

  // Même réaction que le tableau d'avancement du chapitre 5 :
  // I2(aq) + 2 S2O3²⁻(aq) → 2 I⁻(aq) + S4O6²⁻(aq)
  const N0_I2 = 1.0;  // mmol, dans l'erlenmeyer (réactif titré)
  const CB = 0.05;    // mmol/mL, dans la burette (réactif titrant)
  const A = 1, B = 2, C = 2, D = 1;
  const VE = (N0_I2 * B) / (A * CB); // mL
  const X_MAX = N0_I2 / A;

  const SPECIES = [
    { key: "I2", label: "I₂", color: "var(--yellow)" },
    { key: "S2O3", label: "S₂O₃²⁻", color: "var(--teal)" },
    { key: "I", label: "I⁻", color: "var(--coral)" },
    { key: "S4O6", label: "S₄O₆²⁻", color: "var(--chalk)" }
  ];
  const DOT_GRID = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) DOT_GRID.push([col, row]);

  function fmt(n) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function drawFlask(liquidColor) {
    let svgContent = "";
    svgContent += `<rect x="90" y="10" width="10" height="70" fill="rgba(255,255,255,0.08)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    const fillFrac = Math.max(0, 1 - Number(vbRange.value) / 60);
    svgContent += `<rect x="91" y="${11 + 68 * (1 - fillFrac)}" width="8" height="${68 * fillFrac}" fill="var(--teal)" opacity="0.5"/>`;
    svgContent += `<polygon points="90,80 100,80 95,90" fill="var(--chalk-dim)"/>`;
    const exX = 95, exTopY = 105;
    svgContent += `<path d="M${exX - 8} ${exTopY} L${exX - 8} ${exTopY + 15} L${exX - 30} ${exTopY + 70} Q${exX - 32} ${exTopY + 78} ${exX - 22} ${exTopY + 78} L${exX + 22} ${exTopY + 78} Q${exX + 32} ${exTopY + 78} ${exX + 30} ${exTopY + 70} L${exX + 8} ${exTopY + 15} L${exX + 8} ${exTopY}" fill="${liquidColor}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    svgFlask.innerHTML = svgContent;
  }

  function drawMolecules(quantities) {
    const zoneW = 42, zoneH = 96, zoneY = 6, gapM = 5;
    let svgContent = "";
    SPECIES.forEach((sp, i) => {
      const zx = 4 + i * (zoneW + gapM);
      svgContent += `<rect x="${zx}" y="${zoneY}" width="${zoneW}" height="${zoneH}" fill="rgba(255,255,255,0.03)" stroke="${sp.color}" stroke-width="1.3" stroke-dasharray="3,2" rx="6"/>`;

      const exact = Math.min(20, quantities[sp.key] * 4); // 4 points par mmol
      const fullDots = Math.floor(exact);
      const remainder = exact - fullDots;
      const r = 3;

      for (let d = 0; d < fullDots; d++) {
        const [col, row] = DOT_GRID[d];
        const dx = zx + 6 + col * 7, dy = zoneY + 10 + row * 20;
        svgContent += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${sp.color}"/>`;
      }
      if (remainder >= 0.15 && fullDots < 20) {
        const [col, row] = DOT_GRID[fullDots];
        const dx = zx + 6 + col * 7, dy = zoneY + 10 + row * 20;
        svgContent += `<circle cx="${dx}" cy="${dy}" r="${r}" fill="${sp.color}" opacity="0.2"/>`;
        svgContent += `<path d="M${dx} ${dy - r} A${r} ${r} 0 0 0 ${dx} ${dy + r} Z" fill="${sp.color}"/>`;
      }
      svgContent += `<text x="${zx + zoneW / 2}" y="${zoneY + zoneH + 14}" font-size="8.5" fill="${sp.color}" text-anchor="middle">${sp.label}</text>`;
      svgContent += `<text x="${zx + zoneW / 2}" y="${zoneY + zoneH + 25}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">${quantities[sp.key].toFixed(2)}</text>`;
    });
    svgMol.innerHTML = svgContent;
  }

  function draw() {
    const VB = Number(vbRange.value);
    const nB = CB * VB;
    const x = Math.min(nB / B, X_MAX); // avancement de la réaction de titrage

    const nI2Remaining = Math.max(0, N0_I2 - A * x);
    const nS2O3Excess = Math.max(0, nB - B * x);
    const fraction = nI2Remaining / N0_I2; // 1 = plein orangé, 0 = incolore

    // bascule NETTE près de l'équivalence (comme un vrai indicateur),
    // pas un dégradé progressif qui masquerait le moment précis
    const isColored = fraction > 0.03;
    const liquidColor = isColored ? "rgb(232,196,104)" : "rgb(240,240,245)";

    drawFlask(liquidColor);
    drawMolecules({ I2: nI2Remaining, S2O3: nS2O3Excess, I: C * x, S4O6: D * x });

    // tableau d'avancement live, même logique que le chapitre 5
    const isBefore = VB < VE - 0.5, isAt = Math.abs(VB - VE) <= 0.5, isAfter = VB > VE + 0.5;
    tableBody.innerHTML = `
      <tr class="${isBefore ? 'row-active' : ''}">
        <td>Avant l'équivalence</td><td>x &lt; x<sub>max</sub></td>
        <td>${fmt(nI2Remaining)}</td><td>0,00</td><td>${fmt(C * x)}</td><td>${fmt(D * x)}</td>
      </tr>
      <tr class="${isAt ? 'row-active' : ''}">
        <td>À l'équivalence</td><td>x = x<sub>max</sub> = ${fmt(X_MAX)}</td>
        <td>0,00</td><td>0,00</td><td>${fmt(C * X_MAX)}</td><td>${fmt(D * X_MAX)}</td>
      </tr>
      <tr class="${isAfter ? 'row-active' : ''}">
        <td>Après l'équivalence</td><td>x = x<sub>max</sub></td>
        <td>0,00</td><td>${fmt(nS2O3Excess)}</td><td>${fmt(C * X_MAX)}</td><td>${fmt(D * X_MAX)}</td>
      </tr>
    `;

    let statusText;
    if (VB < VE - 0.5) statusText = `<strong style="color:var(--yellow)">avant l'équivalence</strong> — la solution reste colorée`;
    else if (VB > VE + 0.5) statusText = `<strong style="color:var(--teal)">après l'équivalence</strong> — solution incolore, excès de thiosulfate`;
    else statusText = `<strong style="color:var(--coral)">équivalence atteinte !</strong> (V<sub>E</sub> ≈ ${VE.toFixed(0)} mL)`;

    readout.innerHTML = `V<sub>B</sub> versé = ${VB} mL → ${statusText}`;
  }

  vbRange.addEventListener("input", draw);
  draw();
}
