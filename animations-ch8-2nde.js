/* Animations du chapitre 4 — 2nde — "Vers des entités plus stables"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- Fonction utilitaire partagée : configuration électronique ---------- */
const SUBSHELLS = [["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6]];
function computeElectronConfig(Z) {
  let remaining = Z, cfg = [];
  for (const [name, max] of SUBSHELLS) {
    if (remaining <= 0) break;
    const n = Math.min(remaining, max);
    cfg.push([name, n]);
    remaining -= n;
  }
  return cfg;
}
function configToString(cfg) {
  return cfg.map(([name, n]) => `${name}<tspan baseline-shift="super" font-size="0.7em">${n}</tspan>`).join(" ");
}

/* ---------- 1. Configuration électronique ---------- */
function initElectronConfig(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const zRange = document.getElementById(cfg.zRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const Z = Number(zRange.value);
    const config = computeElectronConfig(Z);
    const maxN = Math.max(...config.map(([name]) => parseInt(name[0])));
    let valence = 0;
    config.forEach(([name, n]) => { if (parseInt(name[0]) === maxN) valence += n; });

    let s = `<text x="10" y="55" font-size="15" fill="var(--chalk)">`;
    config.forEach(([name, n], i) => {
      const isValence = parseInt(name[0]) === maxN;
      const color = isValence ? "var(--yellow)" : "var(--chalk-dim)";
      s += `<tspan fill="${color}">${name}</tspan><tspan baseline-shift="super" font-size="0.65em" fill="${color}">${n}</tspan>`;
      if (i < config.length - 1) s += `<tspan dx="4"></tspan>`;
    });
    s += `</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Z = ${Z} électrons, répartis selon 1s → 2s → 2p → 3s → 3p.<br>Couche de valence : n = ${maxN} → <strong style="color:var(--yellow)">${valence} électrons de valence</strong> (en jaune).`;
  }
  zRange.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Position dans le tableau périodique ---------- */
function initPeriodicPosition(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const zRange = document.getElementById(cfg.zRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const SYMBOLS = { 1: "H", 2: "He", 3: "Li", 4: "Be", 5: "B", 6: "C", 7: "N", 8: "O", 9: "F", 10: "Ne", 11: "Na", 12: "Mg", 13: "Al", 14: "Si", 15: "P", 16: "S", 17: "Cl", 18: "Ar" };
  const GRID_COLS = [1, 2, 13, 14, 15, 16, 17, 18]; // colonnes affichées pour le tableau simplifié

  function periodeColonne(Z) {
    if (Z === 1) return { periode: 1, colonne: 1 };
    if (Z === 2) return { periode: 1, colonne: 18 };
    const config = computeElectronConfig(Z);
    const maxN = Math.max(...config.map(([name]) => parseInt(name[0])));
    let sE = 0, pE = 0;
    config.forEach(([name, n]) => { if (parseInt(name[0]) === maxN) { if (name[1] === "s") sE = n; if (name[1] === "p") pE = n; } });
    const colonne = pE > 0 ? 12 + pE : sE;
    return { periode: maxN, colonne };
  }

  function draw() {
    const Z = Number(zRange.value);
    const { periode, colonne } = periodeColonne(Z);

    const cellW = 24, cellH = 24, gapX = 4, gapY = 4, startX = 10, startY = 10;
    let s = "";
    for (let p = 1; p <= 3; p++) {
      for (let ci = 0; ci < GRID_COLS.length; ci++) {
        const c = GRID_COLS[ci];
        const x = startX + ci * (cellW + gapX), y = startY + (p - 1) * (cellH + gapY);
        const highlight = (p === periode && c === colonne);
        s += `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" rx="3" fill="${highlight ? 'var(--yellow)' : 'rgba(255,255,255,0.03)'}" stroke="var(--line)" stroke-width="1"/>`;
      }
    }
    svg.innerHTML = s;

    const symbol = SYMBOLS[Z] || "?";
    readout.innerHTML = `Élément ${symbol} (Z = ${Z}) : <strong style="color:var(--yellow)">${periode}ᵉ période</strong>, <strong style="color:var(--yellow)">${colonne}ᵉ colonne</strong>.`;
  }
  zRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Formation d'un ion (règle de stabilité) ---------- */
function initStableIon(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAl = document.getElementById(cfg.btnAlId);
  const btnS = document.getElementById(cfg.btnSId);

  let current = "al";
  const CASES = {
    al: { symbol: "Al", z: 13, lose: 3, gas: "Ne", charge: "3+", ionSymbol: "Al³⁺" },
    s: { symbol: "S", z: 16, gain: 2, gas: "Ar", charge: "2−", ionSymbol: "S²⁻" }
  };

  function draw() {
    const c = CASES[current];
    const cx = 110, cy = 90;
    const isLose = current === "al";
    const exchanged = isLose ? c.lose : c.gain;
    const startElectrons = 8; // représentation symbolique, pas le compte exact
    const finalElectrons = isLose ? startElectrons - exchanged : startElectrons + exchanged;

    let s = `<circle cx="${cx}" cy="${cy}" r="14" fill="var(--coral)"/>`;
    s += `<text x="${cx}" y="${cy + 5}" font-size="12" fill="var(--board)" text-anchor="middle" font-weight="700">${c.symbol}</text>`;
    const pos = generateDotsInEllipse(Math.max(1, finalElectrons), 0, 0, 1, 1);
    pos.forEach(([u, v]) => {
      const r = 40 + Math.abs(u * v) * 15;
      s += `<circle cx="${cx + u * r}" cy="${cy + v * r}" r="4" fill="var(--chalk)"/>`;
    });
    svg.innerHTML = s;

    readout.innerHTML = isLose
      ? `L'atome d'aluminium Al perd ${c.lose} électrons pour obtenir la configuration électronique du gaz noble le plus proche, le <strong style="color:var(--yellow)">néon Ne</strong>. Il forme l'ion <strong style="color:var(--coral)">${c.ionSymbol}</strong>.`
      : `L'atome de soufre S gagne ${c.gain} électrons pour obtenir la configuration électronique du gaz noble le plus proche, l'<strong style="color:var(--yellow)">argon Ar</strong>. Il forme l'ion <strong style="color:var(--teal)">${c.ionSymbol}</strong>.`;
  }
  btnAl.addEventListener("click", () => { current = "al"; draw(); });
  btnS.addEventListener("click", () => { current = "s"; draw(); });
  draw();
}

/* ---------- 4. Schéma de Lewis (doublets liants / non liants) ---------- */
function initLewisSchema(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSimple = document.getElementById(cfg.btnSimpleId);
  const btnDouble = document.getElementById(cfg.btnDoubleId);

  let mode = "simple";

  function draw() {
    let s = "";
    if (mode === "simple") {
      // eau : O central, 2 H, 2 doublets liants, 2 doublets non liants
      const ox = 110, oy = 60, h1x = 75, h1y = 100, h2x = 145, h2y = 100;
      s += `<text x="${ox}" y="${oy + 6}" font-size="16" fill="var(--chalk)" text-anchor="middle">O</text>`;
      s += `<text x="${h1x}" y="${h1y + 6}" font-size="16" fill="var(--chalk)" text-anchor="middle">H</text>`;
      s += `<text x="${h2x}" y="${h2y + 6}" font-size="16" fill="var(--chalk)" text-anchor="middle">H</text>`;
      s += `<line x1="${ox - 10}" y1="${oy + 8}" x2="${h1x + 6}" y2="${h1y - 8}" stroke="var(--teal)" stroke-width="2.5"/>`;
      s += `<line x1="${ox + 10}" y1="${oy + 8}" x2="${h2x - 6}" y2="${h2y - 8}" stroke="var(--teal)" stroke-width="2.5"/>`;
      s += `<line x1="${ox - 8}" y1="${oy - 14}" x2="${ox + 8}" y2="${oy - 14}" stroke="var(--coral)" stroke-width="2.5"/>`;
      s += `<line x1="${ox - 8}" y1="${oy - 20}" x2="${ox + 8}" y2="${oy - 20}" stroke="var(--coral)" stroke-width="2.5"/>`;
      s += `<text x="${ox - 40}" y="${oy - 16}" font-size="7.5" fill="var(--coral)" text-anchor="middle">doublet non liant</text>`;
      s += `<text x="${(ox + h1x) / 2 - 15}" y="${(oy + h1y) / 2}" font-size="7.5" fill="var(--teal)" text-anchor="middle">doublet liant</text>`;
    } else {
      // C=C : deux carbones reliés par une double liaison
      const c1x = 80, c2x = 150, cy = 80;
      s += `<text x="${c1x}" y="${cy + 6}" font-size="16" fill="var(--chalk)" text-anchor="middle">C</text>`;
      s += `<text x="${c2x}" y="${cy + 6}" font-size="16" fill="var(--chalk)" text-anchor="middle">C</text>`;
      s += `<line x1="${c1x + 10}" y1="${cy - 5}" x2="${c2x - 10}" y2="${cy - 5}" stroke="var(--yellow)" stroke-width="2.5"/>`;
      s += `<line x1="${c1x + 10}" y1="${cy + 5}" x2="${c2x - 10}" y2="${cy + 5}" stroke="var(--yellow)" stroke-width="2.5"/>`;
      s += `<text x="${(c1x + c2x) / 2}" y="${cy + 25}" font-size="7.5" fill="var(--yellow)" text-anchor="middle">2 doublets liants = 4 électrons partagés</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "simple"
      ? "Molécule d'eau H₂O : les doublets liants relient les atomes (mise en commun d'électrons), les doublets non liants restent sur un seul atome."
      : "Liaison double C=C : les deux atomes partagent 4 électrons (2 doublets liants) au lieu de 2 pour une liaison simple.";
  }
  btnSimple.addEventListener("click", () => { mode = "simple"; draw(); });
  btnDouble.addEventListener("click", () => { mode = "double"; draw(); });
  draw();
}

/* ---------- 5. Calculateur d'énergie de liaison ---------- */
function initBondEnergy(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnCH = document.getElementById(cfg.btnCHId);
  const btnCC = document.getElementById(cfg.btnCCId);
  const btnCCdouble = document.getElementById(cfg.btnCCdoubleId);

  const BONDS = { ch: { label: "C−H", energy: 413 }, cc: { label: "C−C", energy: 348 }, ccd: { label: "C=C", energy: 614 } };
  let current = "ch";

  function draw() {
    const n = Number(nRange.value);
    const bond = BONDS[current];
    const total = n * bond.energy;

    const barW = 30, barMaxH = 130, x0 = 60;
    const h = Math.min(barMaxH, (total / 2500) * barMaxH);
    let s = `<rect x="${x0}" y="${150 - barMaxH}" width="${barW}" height="${barMaxH}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<rect x="${x0}" y="${150 - h}" width="${barW}" height="${h}" fill="var(--yellow)"/>`;
    s += `<text x="${x0 + barW / 2}" y="${150 - barMaxH - 8}" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">${total} USI</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `${n} liaison(s) ${bond.label} × ${bond.energy} USI = <strong style="color:var(--yellow)">${total} USI</strong> à fournir pour toutes les rompre.`;
  }
  nRange.addEventListener("input", draw);
  btnCH.addEventListener("click", () => { current = "ch"; draw(); });
  btnCC.addEventListener("click", () => { current = "cc"; draw(); });
  btnCCdouble.addEventListener("click", () => { current = "ccd"; draw(); });
  draw();
}
