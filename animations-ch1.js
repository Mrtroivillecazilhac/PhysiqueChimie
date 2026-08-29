/* Animations du chapitre 1 — 1ère spé PC — "Détermination de la composition d'un système chimique"
   Une animation par sous-partie (a à g). Version 2 : sac plus lisible, tableau
   périodique avec exemple de lecture, schémas de Lewis pour les molécules,
   particules dispersées pour le gaz, lecture n/C mise en valeur pour la dilution. */

/* Les 18 éléments des 3 premières périodes, avec masse molaire atomique
   réelle (g/mol) — mêmes éléments que le tableau périodique du chapitre 9. */
const CH1_ELEMENTS = [
  { symbol: "H", period: 1, group: 1, cat: "h", M: 1.0 },
  { symbol: "He", period: 1, group: 18, cat: "noble", M: 4.0 },
  { symbol: "Li", period: 2, group: 1, cat: "metal", M: 6.9 },
  { symbol: "Be", period: 2, group: 2, cat: "metal", M: 9.0 },
  { symbol: "B", period: 2, group: 13, cat: "nonmetal", M: 10.8 },
  { symbol: "C", period: 2, group: 14, cat: "nonmetal", M: 12.0 },
  { symbol: "N", period: 2, group: 15, cat: "nonmetal", M: 14.0 },
  { symbol: "O", period: 2, group: 16, cat: "nonmetal", M: 16.0 },
  { symbol: "F", period: 2, group: 17, cat: "nonmetal", M: 19.0 },
  { symbol: "Ne", period: 2, group: 18, cat: "noble", M: 20.2 },
  { symbol: "Na", period: 3, group: 1, cat: "metal", M: 23.0 },
  { symbol: "Mg", period: 3, group: 2, cat: "metal", M: 24.3 },
  { symbol: "Al", period: 3, group: 13, cat: "metal", M: 27.0 },
  { symbol: "Si", period: 3, group: 14, cat: "nonmetal", M: 28.1 },
  { symbol: "P", period: 3, group: 15, cat: "nonmetal", M: 31.0 },
  { symbol: "S", period: 3, group: 16, cat: "nonmetal", M: 32.1 },
  { symbol: "Cl", period: 3, group: 17, cat: "nonmetal", M: 35.5 },
  { symbol: "Ar", period: 3, group: 18, cat: "noble", M: 39.9 }
];
const CH1_SLOT_GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
function ch1IsValidSlot(period, col) {
  if (period === 1) return col === 1 || col === 18;
  return CH1_SLOT_GROUPS.includes(col);
}
// code couleur des atomes, réutilisé dans le schéma, la formule brute et le calcul
const CH1_ATOM_COLOR = { C: "var(--chalk)", H: "var(--yellow)", O: "var(--coral)", Al: "var(--teal)" };

/* ---------- a. Le sac de la mole (pochette à cordon, plus reconnaissable) ---------- */
function initMoleBag(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const range = document.getElementById(cfg.rangeId);
  const readout = document.getElementById(cfg.readoutId);
  const countEl = document.getElementById(cfg.countId);
  const warnEl = document.getElementById(cfg.warnId);

  const BODY_PATH = "M38 92 Q26 200 55 213 L145 213 Q174 200 162 92 Z";
  const NECK_RUFFLE = "M62 92 Q72 74 82 92 Q92 74 100 92 Q108 74 118 92 Q128 74 138 92";
  const SLOTS = [[65, 130], [100, 130], [135, 130], [65, 175], [100, 175], [135, 175]];
  const DOT_PATTERN = generateDotsInEllipse(7, 0, 0, 1, 1);

  function moundPath(cx, cy) {
    return `M${cx - 13} ${cy + 11} Q${cx - 13} ${cy - 9} ${cx} ${cy - 12} Q${cx + 13} ${cy - 9} ${cx + 13} ${cy + 11} Z`;
  }
  function drawMound(cx, cy) {
    let s = `<path d="${moundPath(cx, cy)}" fill="rgba(232,196,104,0.15)" stroke="var(--yellow)" stroke-width="1.8"/>`;
    DOT_PATTERN.forEach(([u, v]) => {
      s += `<circle cx="${cx + u * 8}" cy="${cy - 1 + v * 8}" r="1.5" fill="var(--yellow)" opacity="0.85"/>`;
    });
    return s;
  }

  function drawBagShell() {
    let s = "";
    s += `<path d="${BODY_PATH}" fill="rgba(107,191,171,0.05)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    s += `<path d="${NECK_RUFFLE}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<path d="M55 88 Q100 78 145 88" fill="none" stroke="var(--yellow)" stroke-width="3"/>`;
    s += `<path d="M58 96 Q100 87 142 96" fill="none" stroke="var(--yellow)" stroke-width="2.2"/>`;
    s += `<path d="M92 82 Q78 68 90 60 Q98 68 92 82" fill="none" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<path d="M108 82 Q122 68 110 60 Q102 68 108 82" fill="none" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<circle cx="100" cy="80" r="4" fill="var(--yellow)"/>`;
    return s;
  }

  function draw() {
    const n = Number(range.value) / 10;
    const N = n * NA;
    const fullPiles = Math.floor(n + 1e-9);
    const hasHalf = Math.abs(n - fullPiles - 0.5) < 1e-9;

    let svgContent = drawBagShell();
    for (let i = 0; i < fullPiles && i < SLOTS.length; i++) {
      const [cx, cy] = SLOTS[i];
      svgContent += drawMound(cx, cy);
    }
    if (hasHalf && fullPiles < SLOTS.length) {
      const [cx, cy] = SLOTS[fullPiles];
      const clipId = "halfClip-" + cfg.svgId;
      svgContent += `<clipPath id="${clipId}"><rect x="${cx - 13}" y="${cy - 13}" width="13" height="26"/></clipPath>`;
      svgContent += `<g clip-path="url(#${clipId})">${drawMound(cx, cy)}</g>`;
      svgContent += `<line x1="${cx}" y1="${cy - 13}" x2="${cx}" y2="${cy + 13}" stroke="var(--coral)" stroke-width="1.3" stroke-dasharray="2,2"/>`;
    }
    svg.innerHTML = svgContent;

    const pilesLabel = hasHalf
      ? `${fullPiles} tas plein${fullPiles > 1 ? "s" : ""} + 1 demi-tas`
      : `${fullPiles} tas plein${fullPiles > 1 ? "s" : ""}`;
    readout.textContent = `n = ${n.toString().replace(".", ",")} mol`;
    warnEl.textContent = `→ ${pilesLabel} dans la pochette`;
    countEl.innerHTML = `Nombre total d'entités : N = n × N<sub>A</sub> ≈ <strong style="color:var(--yellow)">${formatSci(N)}</strong>`;
  }
  range.addEventListener("input", draw);
  draw();
}

/* ---------- b. Masse molaire atomique (tableau périodique interactif) ---------- */
function initAtomicMolarMass(cfg) {
  const tableEl = document.getElementById(cfg.tableId);
  const readout = document.getElementById(cfg.readoutId);

  function buildTable() {
    tableEl.innerHTML = "";
    for (let period = 1; period <= 3; period++) {
      for (let col = 1; col <= 18; col++) {
        const cell = document.createElement("div");
        if (ch1IsValidSlot(period, col)) {
          const el = CH1_ELEMENTS.find(e => e.period === period && e.group === col);
          cell.className = "ptable-slot cat-" + el.cat;
          cell.textContent = el.symbol;
          cell.dataset.symbol = el.symbol;
          cell.addEventListener("click", () => selectAtom(el.symbol));
        } else {
          cell.className = "ptable-cell empty";
        }
        tableEl.appendChild(cell);
      }
    }
  }

  function selectAtom(symbol) {
    const atom = CH1_ELEMENTS.find(e => e.symbol === symbol);
    tableEl.querySelectorAll(".ptable-slot").forEach(c => c.classList.remove("selected"));
    tableEl.querySelector(`[data-symbol="${symbol}"]`).classList.add("selected");
    readout.innerHTML = `M(${atom.symbol}) = <strong style="color:var(--yellow)">${atom.M.toFixed(1)} g/mol</strong>`;
  }

  buildTable();
  readout.textContent = "Clique sur un élément du tableau périodique pour afficher sa masse molaire atomique.";
}

/* ---------- c. Masse molaire moléculaire (schémas de Lewis) ---------- */
function initMolecularMolarMass(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const formulaEl = document.getElementById(cfg.formulaId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const M = {};
  CH1_ELEMENTS.forEach(e => { M[e.symbol] = e.M; });
  const COL = CH1_ATOM_COLOR;

  function atomDot(x, y, sym, r) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${COL[sym]}" opacity="0.9"/><text x="${x}" y="${y + 4}" font-size="11" fill="var(--board)" text-anchor="middle" font-weight="700">${sym}</text>`;
  }
  function lonePair(x, y, angleDeg) {
    const a = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(a) * 5, dy = Math.sin(a) * 5;
    return `<circle cx="${x - dy}" cy="${y + dx}" r="1.6" fill="var(--chalk)"/><circle cx="${x + dy}" cy="${y - dx}" r="1.6" fill="var(--chalk)"/>`;
  }

  const MOLECULES = {
    CO2: {
      atoms: [{ s: "C", n: 1 }, { s: "O", n: 2 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "O", c: COL.O, sub: "2" }],
      draw() {
        const cy = 60, r = 15;
        let s = "";
        s += `<line x1="65" y1="${cy - 3}" x2="95" y2="${cy - 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="65" y1="${cy + 3}" x2="95" y2="${cy + 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="125" y1="${cy - 3}" x2="155" y2="${cy - 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="125" y1="${cy + 3}" x2="155" y2="${cy + 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += lonePair(50, cy, 90) + lonePair(50, cy, -0);
        s += lonePair(170, cy, 90) + lonePair(170, cy, 0);
        s += atomDot(50, cy, "O", r);
        s += atomDot(110, cy, "C", r);
        s += atomDot(170, cy, "O", r);
        return s;
      }
    },
    CH4: {
      atoms: [{ s: "C", n: 1 }, { s: "H", n: 4 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "H", c: COL.H, sub: "4" }],
      draw() {
        const cx = 110, cy = 60, r = 15, rh = 11, d = 42;
        let s = "";
        [[0, -d], [0, d], [-d, 0], [d, 0]].forEach(([dx, dy]) => {
          s += `<line x1="${cx}" y1="${cy}" x2="${cx + dx}" y2="${cy + dy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        });
        s += atomDot(cx, cy, "C", r);
        [[0, -d], [0, d], [-d, 0], [d, 0]].forEach(([dx, dy]) => {
          s += atomDot(cx + dx, cy + dy, "H", rh);
        });
        return s;
      }
    },
    CH3OH: {
      atoms: [{ s: "C", n: 1 }, { s: "H", n: 4 }, { s: "O", n: 1 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "H", c: COL.H, sub: "3" }, { t: "O", c: COL.O }, { t: "H", c: COL.H }],
      draw() {
        const cCx = 65, cy = 60, r = 15, rh = 11, rO = 15;
        const oX = 125;
        const hoX = 175;
        let s = "";
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx}" y2="${cy - 38}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx - 34}" y2="${cy - 20}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx - 20}" y2="${cy + 34}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${oX}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${oX}" y1="${cy}" x2="${hoX}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += lonePair(oX, cy, 90) + lonePair(oX, cy, -90);
        s += atomDot(cCx, cy, "C", r);
        s += atomDot(cCx, cy - 38, "H", rh);
        s += atomDot(cCx - 34, cy - 20, "H", rh);
        s += atomDot(cCx - 20, cy + 34, "H", rh);
        s += atomDot(oX, cy, "O", rO);
        s += atomDot(hoX, cy, "H", rh);
        return s;
      }
    },
    Al2O3: {
      atoms: [{ s: "Al", n: 2 }, { s: "O", n: 3 }],
      formulaParts: [{ t: "Al", c: COL.Al, sub: "2" }, { t: "O", c: COL.O, sub: "3" }],
      draw() {
        const cy = 60, r = 15;
        const xs = [35, 70, 105, 140, 175];
        const labels = ["Al", "O", "Al", "O", "O"];
        let s = "";
        s += `<text x="110" y="20" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">composé ionique — pas de liaison covalente</text>`;
        xs.forEach((x, i) => {
          const sym = labels[i];
          const charge = sym === "Al" ? "3+" : "2−";
          s += atomDot(x, cy, sym, r);
          s += `<text x="${x + 11}" y="${cy - 12}" font-size="8" fill="${COL[sym === 'Al' ? 'Al' : 'O']}" text-anchor="middle">${charge}</text>`;
        });
        return s;
      }
    }
  };
  const keys = ["CO2", "CH4", "CH3OH", "Al2O3"];
  let current = "CO2";

  function draw() {
    const mol = MOLECULES[current];
    svg.innerHTML = mol.draw();

    formulaEl.innerHTML = mol.formulaParts.map(p => `<span style="color:${p.c}">${p.t}${p.sub ? `<sub>${p.sub}</sub>` : ""}</span>`).join("");

    const detail = mol.atoms.map(a => `${a.n > 1 ? a.n + "×" : ""}M(<span style="color:${COL[a.s]}">${a.s}</span>)`).join(" + ");
    const numeric = mol.atoms.map(a => `${a.n > 1 ? a.n + "×" : ""}${M[a.s].toFixed(1)}`).join(" + ");
    const total = mol.atoms.reduce((sum, a) => sum + a.n * M[a.s], 0);
    readout.innerHTML = `M = ${detail} = ${numeric} = <strong style="color:var(--yellow)">${total.toFixed(1)} g/mol</strong>`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- d. Balance à plateau (descend/monte avec la masse) ---------- */
function initMassScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const molarRange = document.getElementById(cfg.molarRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_MASS_DISPLAY = 1000;
  const PIVOT_Y = 25, PLATE_Y_MIN = 55, PLATE_Y_MAX = 165;
  const BALL_DX = [0, -14, 14, -24, -4, 16, 26, -30, -10, 10, 30];

  function draw() {
    const n = Number(nRange.value);
    const M = Number(molarRange.value);
    const m = n * M;
    const mClamped = Math.min(m, MAX_MASS_DISPLAY);
    const saturated = m > MAX_MASS_DISPLAY;
    const plateY = PLATE_Y_MIN + (mClamped / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);

    const t = Math.min(1, Math.max(0, (M - 10) / (200 - 10)));
    const radius = 5 + t * 8;
    const color = `rgb(${Math.round(107 + t * (217 - 107))}, ${Math.round(191 + t * (122 - 191))}, ${Math.round(171 + t * (99 - 171))})`;

    let svgContent = "";
    svgContent += `<rect x="40" y="18" width="120" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<rect x="96" y="10" width="8" height="16" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<line x1="165" y1="${PLATE_Y_MIN}" x2="165" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    [0, 250, 500, 750, 1000].forEach(v => {
      const y = PLATE_Y_MIN + (v / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);
      svgContent += `<line x1="160" y1="${y}" x2="170" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      svgContent += `<text x="174" y="${y + 3}" font-size="8" fill="var(--chalk-dim)">${v}</text>`;
    });
    const segs = 6, zx = 14;
    let spring = `M100 ${PIVOT_Y + 10}`;
    for (let i = 1; i <= segs; i++) {
      const y = PIVOT_Y + 10 + (plateY - PIVOT_Y - 10) * (i / segs);
      spring += ` L${100 + (i % 2 === 0 ? zx : -zx)} ${y}`;
    }
    svgContent += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    svgContent += `<line x1="140" y1="${plateY}" x2="160" y2="${plateY}" stroke="${saturated ? 'var(--coral)' : 'var(--yellow)'}" stroke-width="2" stroke-dasharray="3,2"/>`;
    svgContent += `<ellipse cx="100" cy="${plateY}" rx="42" ry="7" fill="rgba(0,0,0,0.2)" stroke="${saturated ? 'var(--coral)' : 'var(--chalk-dim)'}" stroke-width="2"/>`;
    const visible = Math.min(n, BALL_DX.length);
    for (let i = 0; i < visible; i++) {
      const stackRow = Math.floor(i / 5);
      svgContent += `<circle cx="${100 + BALL_DX[i]}" cy="${plateY - 8 - stackRow * (radius * 1.4)}" r="${radius}" fill="${color}" stroke="var(--board)" stroke-width="1"/>`;
    }

    svg.innerHTML = svgContent;
    readout.innerHTML = saturated
      ? `n = ${n}, M = ${M} g/mol → m = n × M = ${m} g <strong style="color:var(--coral)">(hors échelle, le plateau touche le fond !)</strong>`
      : `n = ${n}, M = ${M} g/mol → m = n × M = <strong style="color:var(--yellow)">${m} g</strong>`;
  }

  nRange.addEventListener("input", draw);
  molarRange.addEventListener("input", draw);
  draw();
}

/* ---------- e. Quantité de matière d'un gaz (particules dispersées) ---------- */
function initGasMolarVolume(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const VM = 24.0;
  const GASES = {
    N2: { label: "N₂", rParticle: 5, dots: 2, color: "var(--teal)" },
    O2: { label: "O₂", rParticle: 4.5, dots: 2, color: "var(--coral)" },
    Ar: { label: "Ar", rParticle: 6, dots: 1, color: "var(--yellow)" },
    CH4: { label: "CH₄", rParticle: 6.5, dots: 5, color: "var(--chalk)" }
  };
  const keys = ["N2", "O2", "Ar", "CH4"];
  let current = "N2";

  const SCATTER = generateDotsInEllipse(16, 0, 0, 1, 1);

  function draw() {
    const n = Number(nRange.value) / 10;
    const V = n * VM;
    const gas = GASES[current];

    const cx = 110, cy = 100;
    const rContainer = 16 + Math.sqrt(n) * 34;

    let s = `<circle cx="${cx}" cy="${cy}" r="${rContainer}" fill="rgba(255,255,255,0.03)" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;

    const nShown = Math.min(SCATTER.length, Math.max(3, Math.round(3 + n * 2)));
    const usable = rContainer - gas.rParticle - 4;
    for (let i = 0; i < nShown; i++) {
      const [u, v] = SCATTER[i];
      const px = cx + u * usable;
      const py = cy + v * usable;
      if (gas.dots === 1) {
        s += `<circle cx="${px}" cy="${py}" r="${gas.rParticle}" fill="${gas.color}" opacity="0.85"/>`;
      } else if (gas.dots === 2) {
        s += `<circle cx="${px - gas.rParticle * 0.55}" cy="${py}" r="${gas.rParticle * 0.68}" fill="${gas.color}" opacity="0.85"/>`;
        s += `<circle cx="${px + gas.rParticle * 0.55}" cy="${py}" r="${gas.rParticle * 0.68}" fill="${gas.color}" opacity="0.85"/>`;
      } else {
        s += `<circle cx="${px}" cy="${py}" r="${gas.rParticle * 0.6}" fill="${gas.color}" opacity="0.9"/>`;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
          s += `<circle cx="${px + dx * gas.rParticle * 0.55}" cy="${py + dy * gas.rParticle * 0.55}" r="${gas.rParticle * 0.32}" fill="${gas.color}" opacity="0.7"/>`;
        });
      }
    }
    s += `<text x="${cx}" y="${cy + rContainer + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">gaz : ${gas.label} (représentation symbolique)</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `n = ${n.toFixed(1)} mol de ${gas.label} → V = n × V<sub>m</sub> = ${n.toFixed(1)} × 24,0 = <strong style="color:var(--yellow)">${V.toFixed(1)} L</strong> (même volume qu'avec n'importe quel autre gaz, pour la même quantité de matière)`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  nRange.addEventListener("input", draw);
  draw();
}

/* ---------- f. Concentration en quantité de matière (n et V indépendants) ---------- */
function initConcentration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_DOTS = 70;
  const normPositions = generateDotsInEllipse(MAX_DOTS, 0, 0, 1, 1);

  function draw() {
    const n = Number(nRange.value) / 100;
    const V = Number(vRange.value) / 100;
    const C = V > 0 ? n / V : 0;
    const dotCount = Math.min(MAX_DOTS, Math.round(n * 23));

    const vNorm = (V - 0.1) / (3 - 0.1);
    const width = 70 + vNorm * 70;
    const height = 90 + vNorm * 90;
    const baseY = 195, centerX = 100;
    const topY = baseY - height;
    const left = centerX - width / 2, right = centerX + width / 2;

    let svgContent = `<path d="M${left} ${topY} L${left} ${baseY - 12} Q${left} ${baseY} ${left + 12} ${baseY} L${right - 12} ${baseY} Q${right} ${baseY} ${right} ${baseY - 12} L${right} ${topY}" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    for (let i = 0; i < dotCount; i++) {
      const [u, v] = normPositions[i];
      const x = centerX + u * (width / 2 - 10);
      const y = baseY - 10 - ((v + 1) / 2) * (height - 20);
      svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="var(--coral)" opacity="0.85"/>`;
    }
    svg.innerHTML = svgContent;

    readout.innerHTML = `n = ${n.toFixed(2)} mol, V = ${V.toFixed(2)} L → C = n / V = <strong style="color:var(--yellow)">${C.toFixed(2)} mol/L</strong>`;
  }
  nRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- g. La dilution (n fixé, on ajoute du volume) — lecture n/C mise en valeur ---------- */
function initDilutionProcess(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const fRange = document.getElementById(cfg.fRangeId);
  const lockBtn = document.getElementById(cfg.lockBtnId);
  const diluteBtn = document.getElementById(cfg.diluteBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);
  const readout = document.getElementById(cfg.readoutId);
  const fRow = document.getElementById(cfg.fRowId);

  const MAX_DOTS = 46;
  const V0 = 1.0;
  const normPositions = generateDotsInEllipse(MAX_DOTS, 0, 0, 1, 1);

  let locked = false;
  let nLocked = 1;
  let animFrame = null;
  let currentF = 1;

  function beakerGeometry(F) {
    const vNorm = Math.min(1, (F - 1) / 4);
    const width = 60 + vNorm * 90;
    const height = 80 + vNorm * 110;
    const baseY = 195, centerX = 100;
    const topY = baseY - height;
    return { width, height, baseY, centerX, topY, left: centerX - width / 2, right: centerX + width / 2 };
  }

  function drawBeaker(F, n) {
    const g = beakerGeometry(F);
    const dotCount = Math.min(MAX_DOTS, Math.round(n * 30));

    let svgContent = `<path d="M${g.left} ${g.topY} L${g.left} ${g.baseY - 12} Q${g.left} ${g.baseY} ${g.left + 12} ${g.baseY} L${g.right - 12} ${g.baseY} Q${g.right} ${g.baseY} ${g.right} ${g.baseY - 12} L${g.right} ${g.topY}" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    for (let i = 0; i < dotCount; i++) {
      const [u, v] = normPositions[i];
      const x = g.centerX + u * (g.width / 2 - 10);
      const y = g.baseY - 10 - ((v + 1) / 2) * (g.height - 20);
      svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="var(--coral)" opacity="0.85"/>`;
    }
    svg.innerHTML = svgContent;
  }

  function statBlock(label, value, color) {
    return `<div style="text-align:center;">
      <div style="font-size:0.72rem; color:var(--chalk-dim); text-transform:uppercase; letter-spacing:0.04em;">${label}</div>
      <div style="font-family:var(--font-display); font-size:1.5rem; color:${color};">${value}</div>
    </div>`;
  }

  function updateReadout(F, n) {
    if (!locked) {
      readout.innerHTML = `<p style="color:var(--chalk-dim); text-align:center;">Choisis la quantité de matière n à mettre dans la solution mère (V = ${V0.toFixed(1)} L), puis clique sur « Sélectionner ».</p>`;
      return;
    }
    const V = V0 * F;
    const C = n / V;
    readout.innerHTML = `
      <div style="display:flex; gap:22px; justify-content:center; align-items:flex-end; padding:10px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
        ${statBlock("n (fixe)", n.toFixed(2) + " mol", "var(--teal)")}
        ${statBlock("V (bécher)", V.toFixed(2) + " L", "var(--chalk-dim)")}
        ${statBlock("C (évolue)", C.toFixed(2) + " mol/L", "var(--yellow)")}
      </div>`;
  }

  function draw() {
    const n = locked ? nLocked : Number(nRange.value) / 100;
    drawBeaker(currentF, n);
    updateReadout(currentF, n);
  }

  nRange.addEventListener("input", draw);

  lockBtn.addEventListener("click", () => {
    locked = true;
    nLocked = Number(nRange.value) / 100;
    currentF = 1;
    nRange.disabled = true;
    lockBtn.style.display = "none";
    diluteBtn.style.display = "inline-block";
    fRow.style.display = "none";
    draw();
  });

  diluteBtn.addEventListener("click", () => {
    const targetF = Number(fRange.value) / 10;
    fRow.style.display = "block";
    const startF = currentF;
    const duration = 900;
    const start = performance.now();
    cancelAnimationFrame(animFrame);
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      currentF = startF + (targetF - startF) * t;
      draw();
      if (t < 1) animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  });

  fRange.addEventListener("input", () => {
    if (!locked) return;
    currentF = Number(fRange.value) / 10;
    draw();
  });

  resetBtn.addEventListener("click", () => {
    locked = false;
    currentF = 1;
    nRange.disabled = false;
    lockBtn.style.display = "inline-block";
    diluteBtn.style.display = "none";
    fRow.style.display = "none";
    fRange.value = 10;
    draw();
  });

  fRow.style.display = "none";
  diluteBtn.style.display = "none";
  draw();
}
