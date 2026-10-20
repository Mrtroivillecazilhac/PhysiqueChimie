/* Animations du chapitre 9 — 1ère spé PC — De la structure à la polarité
   Partie 1 : animations d'origine du site. Partie 2 : animations des diapos. */

/* ---------- 26. Constructeur de schéma de Lewis ---------- */
function initLewisBuilder(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const tableEl = document.getElementById(cfg.tableId);

  // Les 18 éléments des 3 premières périodes, avec leur nombre d'électrons
  // de valence dérivé directement de leur colonne (groupe).
  const ELEMENTS = [
    { symbol: "H", period: 1, group: 1, valence: 1, cat: "h" },
    { symbol: "He", period: 1, group: 18, valence: 2, cat: "noble" },
    { symbol: "Li", period: 2, group: 1, valence: 1, cat: "metal" },
    { symbol: "Be", period: 2, group: 2, valence: 2, cat: "metal" },
    { symbol: "B", period: 2, group: 13, valence: 3, cat: "nonmetal" },
    { symbol: "C", period: 2, group: 14, valence: 4, cat: "nonmetal" },
    { symbol: "N", period: 2, group: 15, valence: 5, cat: "nonmetal" },
    { symbol: "O", period: 2, group: 16, valence: 6, cat: "nonmetal" },
    { symbol: "F", period: 2, group: 17, valence: 7, cat: "nonmetal" },
    { symbol: "Ne", period: 2, group: 18, valence: 8, cat: "noble" },
    { symbol: "Na", period: 3, group: 1, valence: 1, cat: "metal" },
    { symbol: "Mg", period: 3, group: 2, valence: 2, cat: "metal" },
    { symbol: "Al", period: 3, group: 13, valence: 3, cat: "metal" },
    { symbol: "Si", period: 3, group: 14, valence: 4, cat: "nonmetal" },
    { symbol: "P", period: 3, group: 15, valence: 5, cat: "nonmetal" },
    { symbol: "S", period: 3, group: 16, valence: 6, cat: "nonmetal" },
    { symbol: "Cl", period: 3, group: 17, valence: 7, cat: "nonmetal" },
    { symbol: "Ar", period: 3, group: 18, valence: 8, cat: "noble" }
  ];
  const SLOT_GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];

  const cx = 100, cy = 90, R = 34;
  const POS = [[0, -R], [R, 0], [0, R], [-R, 0]];

  function isValidSlot(period, col) {
    if (period === 1) return col === 1 || col === 18; // seules H et He existent en période 1
    return SLOT_GROUPS.includes(col);
  }

  function buildTable() {
    tableEl.innerHTML = "";
    for (let period = 1; period <= 3; period++) {
      for (let col = 1; col <= 18; col++) {
        const cell = document.createElement("div");
        if (isValidSlot(period, col)) {
          const el = ELEMENTS.find(e => e.period === period && e.group === col);
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
    const atom = ELEMENTS.find(e => e.symbol === symbol);
    tableEl.querySelectorAll(".ptable-slot").forEach(c => c.classList.remove("selected"));
    tableEl.querySelector(`[data-symbol="${symbol}"]`).classList.add("selected");
    draw(atom);
  }

  function draw(atom) {
    const v = atom.valence;
    let celibataires, doublets, lacunes, nSlots;

    if (atom.period === 1) {
      // n=1 : une seule "case" de valence (une orbitale 1s), pas 4
      nSlots = 1;
      celibataires = v === 1 ? 1 : 0;
      doublets = v === 2 ? 1 : 0;
      lacunes = 0;
    } else {
      nSlots = 4;
      if (v <= 4) {
        // moins de 4 électrons : pas de doublet, les cases restantes sont
        // des lacunes électroniques (Li, Be, B, Na, Mg, Al)
        celibataires = v;
        doublets = 0;
        lacunes = 4 - v;
      } else {
        doublets = v - 4;
        celibataires = 4 - doublets;
        lacunes = 0;
      }
    }

    let s = `<text x="${cx}" y="${cy + 6}" font-size="22" fill="var(--chalk)" text-anchor="middle" font-family="var(--font-body)">${atom.symbol}</text>`;

    for (let i = 0; i < nSlots; i++) {
      const [dx, dy] = POS[i];
      const px = cx + dx, py = cy + dy;
      if (i < doublets) {
        const perpX = dy !== 0 ? 5 : 0, perpY = dx !== 0 ? 5 : 0;
        s += `<circle cx="${px - perpX}" cy="${py - perpY}" r="2.4" fill="var(--yellow)"/>`;
        s += `<circle cx="${px + perpX}" cy="${py + perpY}" r="2.4" fill="var(--yellow)"/>`;
      } else if (i < doublets + celibataires) {
        s += `<circle cx="${px}" cy="${py}" r="2.6" fill="var(--coral)"/>`;
      } else {
        // lacune électronique : case rectangulaire vide
        const rw = dx !== 0 ? 10 : 14, rh = dx !== 0 ? 14 : 10;
        s += `<rect x="${px - rw / 2}" y="${py - rh / 2}" width="${rw}" height="${rh}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      }
    }
    svg.innerHTML = s;

    let text = `${atom.symbol} possède ${v} électron${v > 1 ? "s" : ""} de valence → <strong style="color:var(--coral)">${celibataires} célibataire(s)</strong>, <strong style="color:var(--yellow)">${doublets} doublet(s)</strong>`;
    if (lacunes > 0) text += `, <strong style="color:var(--chalk-dim)">${lacunes} lacune(s) électronique(s)</strong>`;
    text += ".";
    if (atom.cat === "noble") {
      text += atom.symbol === "He"
        ? ` <span style="color:var(--yellow)">Stable avec 2 électrons (n = 1).</span>`
        : ` <span style="color:var(--yellow)">Stable avec 8 électrons (n &gt; 1).</span>`;
    }
    readout.innerHTML = text;
  }

  buildTable();
  selectAtom("C");
}

/* ---------- 27. Explorateur de géométrie (VSEPR) ---------- */
function initGeometryExplorer(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const exSvg = document.getElementById(cfg.exampleSvgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const cx = 120, cy = 105;

  function bondPlain(dx, dy, color) {
    const ex = cx + dx, ey = cy + dy;
    return `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="2.5"/>
            <circle cx="${ex}" cy="${ey}" r="8" fill="${color}"/>`;
  }
  function bondWedge(dx, dy, color) {
    // triangle plein, étroit au centre, large à l'extrémité = vers l'avant (vers nous)
    const ex = cx + dx, ey = cy + dy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / len, py = dx / len, w = 5;
    return `<polygon points="${cx},${cy} ${ex + px * w},${ey + py * w} ${ex - px * w},${ey - py * w}" fill="${color}"/>
            <circle cx="${ex}" cy="${ey}" r="8" fill="${color}"/>`;
  }
  function bondDash(dx, dy, color) {
    // trait pointillé = vers l'arrière (s'éloigne de nous)
    const ex = cx + dx, ey = cy + dy;
    return `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="2.5" stroke-dasharray="4,3"/>
            <circle cx="${ex}" cy="${ey}" r="8" fill="${color}"/>`;
  }
  function loneVolume(dx, dy, color) {
    // doublet non liant représenté comme un volume (un "ballon"), pas deux points :
    // il prend de la place et repousse les autres doublets, comme dans le livre
    const ex = cx + dx, ey = cy + dy;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    return `<g transform="rotate(${angleDeg} ${ex} ${ey})">
              <ellipse cx="${ex}" cy="${ey}" rx="14" ry="22" fill="${color}" opacity="0.30" stroke="${color}" stroke-width="1.5"/>
            </g>
            <circle cx="${ex - 3}" cy="${ey}" r="2.2" fill="${color}"/>
            <circle cx="${ex + 3}" cy="${ey}" r="2.2" fill="${color}"/>`;
  }
  function centralAtom() {
    return `<circle cx="${cx}" cy="${cy}" r="9" fill="var(--yellow)"/><text x="${cx}" y="${cy + 4}" font-size="10" fill="var(--board)" text-anchor="middle" font-weight="700">A</text>`;
  }

  // Chaque configuration précise, pour chaque groupe, son type (bond/lone),
  // son style (plain/wedge/dash — seuls les édifices dérivés du tétraèdre
  // ont vraiment besoin de la 3D ; triangulaire/coudée(3)/linéaire sont
  // réellement plans, donc restent en traits pleins) et sa direction.
  const CONFIGS = [
    {
      name: "Tétraédrique",
      example: "CH₄",
      groups: [
        { type: "bond", style: "plain", dx: -48, dy: -32 },
        { type: "bond", style: "plain", dx: 48, dy: -32 },
        { type: "bond", style: "wedge", dx: -20, dy: 58 },
        { type: "bond", style: "dash", dx: 20, dy: 58 }
      ]
    },
    {
      name: "Pyramidale à base triangulaire",
      example: "NH₃",
      groups: [
        { type: "bond", style: "plain", dx: -48, dy: 32 },
        { type: "bond", style: "plain", dx: 48, dy: 32 },
        { type: "bond", style: "wedge", dx: 0, dy: 62 },
        { type: "lone", dx: 0, dy: -58 }
      ]
    },
    {
      name: "Coudée",
      example: "H₂O",
      groups: [
        { type: "bond", style: "plain", dx: -42, dy: 38 },
        { type: "bond", style: "plain", dx: 42, dy: 38 },
        { type: "lone", dx: -40, dy: -46 },
        { type: "lone", dx: 40, dy: -46 }
      ]
    },
    {
      name: "Triangulaire",
      example: "CO₃²⁻",
      groups: [
        { type: "bond", style: "plain", dx: 0, dy: -58 },
        { type: "bond", style: "plain", dx: 50, dy: 35 },
        { type: "bond", style: "plain", dx: -50, dy: 35 }
      ]
    },
    {
      name: "Coudée",
      example: "O₃ (ozone)",
      groups: [
        { type: "bond", style: "plain", dx: 50, dy: 35 },
        { type: "bond", style: "plain", dx: -50, dy: 35 },
        { type: "lone", dx: 0, dy: -58 }
      ]
    },
    {
      name: "Linéaire",
      example: "CO₂",
      groups: [
        { type: "bond", style: "plain", dx: -58, dy: 0 },
        { type: "bond", style: "plain", dx: 58, dy: 0 }
      ]
    }
  ];

  // Écritures de Lewis réelles des exemples, dans le même style que
  // l'animation de formation des molécules.
  const ecx = 100, ecy = 100;
  function exBond(x1, y1, x2, y2, order, color) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len, inset = 11;
    const ix1 = x1 + ux * inset, iy1 = y1 + uy * inset, ix2 = x2 - ux * inset, iy2 = y2 - uy * inset;
    const px = -uy * 3.2, py = ux * 3.2;
    const offs = order === 1 ? [0] : [-1, 1];
    let s = "";
    offs.forEach(o => { s += `<line x1="${ix1 + px * o}" y1="${iy1 + py * o}" x2="${ix2 + px * o}" y2="${iy2 + py * o}" stroke="${color}" stroke-width="2"/>`; });
    return s;
  }
  function exDot(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    return `<circle cx="${px + 15 * Math.cos(rad)}" cy="${py + 15 * Math.sin(rad)}" r="2.4" fill="${color}"/>`;
  }
  function exDoublet(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    const perpX = 4 * Math.sin(rad), perpY = -4 * Math.cos(rad);
    const ox = 15 * Math.cos(rad), oy = 15 * Math.sin(rad);
    return `<circle cx="${px + ox - perpX}" cy="${py + oy - perpY}" r="2.2" fill="${color}"/>
            <circle cx="${px + ox + perpX}" cy="${py + oy + perpY}" r="2.2" fill="${color}"/>`;
  }
  function exLabel(x, y, text, color, size) {
    return `<text x="${x}" y="${y + (size || 15) / 3}" font-size="${size || 15}" fill="${color}" text-anchor="middle" font-family="var(--font-body)" font-weight="700">${text}</text>`;
  }

  const EXAMPLES = [
    // CH4
    () => {
      let s = "";
      [[0, -42], [42, 0], [0, 42], [-42, 0]].forEach(([dx, dy]) => {
        s += exBond(ecx, ecy, ecx + dx, ecy + dy, 1, "var(--chalk)");
        s += exLabel(ecx + dx, ecy + dy, "H", "var(--teal)");
      });
      return s + exLabel(ecx, ecy, "C", "var(--coral)");
    },
    // NH3
    () => {
      let s = "";
      [[42, 0], [0, 42], [-42, 0]].forEach(([dx, dy]) => {
        s += exBond(ecx, ecy, ecx + dx, ecy + dy, 1, "var(--chalk)");
        s += exLabel(ecx + dx, ecy + dy, "H", "var(--teal)");
      });
      s += exDoublet(ecx, ecy, -90, "var(--coral)");
      return s + exLabel(ecx, ecy, "N", "var(--coral)");
    },
    // H2O
    () => {
      let s = "";
      [[42, 0], [-42, 0]].forEach(([dx, dy]) => {
        s += exBond(ecx, ecy, ecx + dx, ecy + dy, 1, "var(--chalk)");
        s += exLabel(ecx + dx, ecy + dy, "H", "var(--teal)");
      });
      s += exDoublet(ecx, ecy, -90, "var(--coral)");
      s += exDoublet(ecx, ecy, 90, "var(--coral)");
      return s + exLabel(ecx, ecy, "O", "var(--coral)");
    },
    // CO3 2-
    () => {
      const O1 = [ecx, ecy - 55], O2 = [ecx + 50, ecy + 30], O3 = [ecx - 50, ecy + 30];
      let s = exBond(ecx, ecy, O1[0], O1[1], 2, "var(--chalk)"); // C=O
      s += exBond(ecx, ecy, O2[0], O2[1], 1, "var(--chalk)");    // C-O-
      s += exBond(ecx, ecy, O3[0], O3[1], 1, "var(--chalk)");    // C-O-
      s += exDoublet(O1[0], O1[1], -90, "var(--teal)");
      s += exDoublet(O1[0], O1[1], 180, "var(--teal)");
      [O2, O3].forEach(([ox, oy], i) => {
        [0, 120, 240].forEach((a, j) => { s += exDoublet(ox, oy, a + (i === 0 ? 0 : 0), "var(--teal)"); });
        s += exLabel(ox + (i === 0 ? 14 : -14), oy - 4, "−", "var(--teal)", 12);
      });
      s += exLabel(O1[0], O1[1], "O", "var(--teal)") + exLabel(O2[0], O2[1], "O", "var(--teal)") + exLabel(O3[0], O3[1], "O", "var(--teal)");
      return s + exLabel(ecx, ecy, "C", "var(--coral)");
    },
    // O3 ozone (simplifié : 2 liaisons simples + 1 doublet sur O central, dans l'esprit VSEPR)
    () => {
      const A = [ecx - 45, ecy + 15], B = [ecx + 45, ecy + 15];
      let s = exBond(A[0], A[1], ecx, ecy, 1, "var(--chalk)");
      s += exBond(ecx, ecy, B[0], B[1], 1, "var(--chalk)");
      s += exDoublet(ecx, ecy, -90, "var(--coral)");
      [A, B].forEach(([ox, oy]) => {
        [90, 210, 330].forEach(a => { s += exDoublet(ox, oy, a, "var(--teal)"); });
      });
      s += exLabel(A[0], A[1], "O", "var(--teal)") + exLabel(B[0], B[1], "O", "var(--teal)");
      return s + exLabel(ecx, ecy, "O", "var(--coral)");
    },
    // CO2
    () => {
      const O1x = ecx - 55, O2x = ecx + 55;
      let s = exBond(O1x, ecy, ecx, ecy, 2, "var(--chalk)");
      s += exBond(ecx, ecy, O2x, ecy, 2, "var(--chalk)");
      [O1x, O2x].forEach(ox => {
        s += exDoublet(ox, ecy, -90, "var(--teal)");
        s += exDoublet(ox, ecy, 90, "var(--teal)");
        s += exLabel(ox, ecy, "O", "var(--teal)");
      });
      return s + exLabel(ecx, ecy, "C", "var(--coral)");
    }
  ];

  function draw(idx) {
    const { groups, name, example } = CONFIGS[idx];
    let bonds = 0, lone = 0;
    let s = "";
    groups.forEach(g => {
      if (g.type === "bond") {
        bonds++;
        const color = "var(--teal)";
        if (g.style === "wedge") s += bondWedge(g.dx, g.dy, color);
        else if (g.style === "dash") s += bondDash(g.dx, g.dy, color);
        else s += bondPlain(g.dx, g.dy, color);
      } else {
        lone++;
        s += loneVolume(g.dx, g.dy, "var(--coral)");
      }
    });
    s += centralAtom();
    svg.innerHTML = s;
    exSvg.innerHTML = EXAMPLES[idx]();
    readout.innerHTML = `${bonds} liaison(s), ${lone} doublet(s) non liant(s) → géométrie <strong style="color:var(--teal)">${name}</strong>, comme dans <strong style="color:var(--yellow)">${example}</strong>. Les doublets non liants (en volume translucide) repoussent autant que les liaisons — ce sont ces répulsions électroniques qui imposent la géométrie.`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      draw(i);
    });
  });
  draw(0);
  buttons[0].classList.add("active-hist");
}

/* ---------- 28. Polarité d'une molécule (CO2 vs H2O) ---------- */
function initPolarityDemo(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLinear = document.getElementById(cfg.btnLinearId);
  const btnBent = document.getElementById(cfg.btnBentId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const cx = 130, cy = 105;

  function geometry(mode) {
    if (mode === "linear") {
      return {
        center: [cx, cy], A: [cx - 65, cy], B: [cx + 65, cy],
        centerSymbol: "C", periphSymbol: "O",
        centerCharge: "+2q", periphCharge: "−q",
        label: "CO₂ — linéaire"
      };
    }
    const angle = 52 * Math.PI / 180;
    const center = [cx, cy - 15];
    return {
      center, A: [cx - 58 * Math.sin(angle), center[1] + 58 * Math.cos(angle)],
      B: [cx + 58 * Math.sin(angle), center[1] + 58 * Math.cos(angle)],
      centerSymbol: "O", periphSymbol: "H",
      centerCharge: "−2q", periphCharge: "+q",
      label: "H₂O — coudée"
    };
  }

  // petit vecteur dipolaire : de + vers −, avec une petite croix à l'origine (convention du cours)
  function dipoleVector(x1, y1, x2, y2, color) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    const startOffset = 16, endOffset = len - 20;
    const sx = x1 + ux * startOffset, sy = y1 + uy * startOffset;
    const ex = x1 + ux * endOffset, ey = y1 + uy * endOffset;
    let s = `<defs><marker id="dipArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${color}"/></marker></defs>`;
    s += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="2" marker-end="url(#dipArrow)"/>`;
    s += `<line x1="${sx - 4}" y1="${sy}" x2="${sx + 4}" y2="${sy}" stroke="${color}" stroke-width="1.5"/>`;
    s += `<line x1="${sx}" y1="${sy - 4}" x2="${sx}" y2="${sy + 4}" stroke="${color}" stroke-width="1.5"/>`;
    return s;
  }

  function draw(mode, step) {
    const g = geometry(mode);
    const isLinear = mode === "linear";
    const centerColor = isLinear ? "var(--coral)" : "var(--teal)";
    const periphColor = isLinear ? "var(--teal)" : "var(--coral)";

    let s = "";
    s += `<line x1="${g.center[0]}" y1="${g.center[1]}" x2="${g.A[0]}" y2="${g.A[1]}" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    s += `<line x1="${g.center[0]}" y1="${g.center[1]}" x2="${g.B[0]}" y2="${g.B[1]}" stroke="var(--chalk-dim)" stroke-width="3"/>`;

    if (step >= 3) {
      // vecteurs le long de chaque liaison, du + vers le −
      s += dipoleVector(g.center[0], g.center[1], g.A[0], g.A[1], "var(--yellow)");
      s += dipoleVector(g.center[0], g.center[1], g.B[0], g.B[1], "var(--yellow)");
    }

    s += `<circle cx="${g.center[0]}" cy="${g.center[1]}" r="14" fill="${centerColor}"/>`;
    s += `<text x="${g.center[0]}" y="${g.center[1] + 4}" font-size="10" fill="var(--board)" text-anchor="middle" font-weight="700">${g.centerSymbol}</text>`;
    [g.A, g.B].forEach(p => {
      s += `<circle cx="${p[0]}" cy="${p[1]}" r="11" fill="${periphColor}"/>`;
      s += `<text x="${p[0]}" y="${p[1] + 4}" font-size="9" fill="var(--board)" text-anchor="middle" font-weight="700">${g.periphSymbol}</text>`;
    });

    if (step >= 2) {
      s += `<text x="${g.center[0]}" y="${g.center[1] - 20}" font-size="9" fill="${centerColor}" text-anchor="middle">${g.centerCharge}</text>`;
      [g.A, g.B].forEach(p => {
        s += `<text x="${p[0]}" y="${p[1] + (p[1] > g.center[1] ? 22 : -16)}" font-size="9" fill="${periphColor}" text-anchor="middle">${g.periphCharge}</text>`;
      });
    }

    if (step >= 4) {
      // somme vectorielle : direction = somme des deux vecteurs unitaires
      const uA = [(g.A[0] - g.center[0]), (g.A[1] - g.center[1])];
      const uB = [(g.B[0] - g.center[0]), (g.B[1] - g.center[1])];
      const lenA = Math.hypot(uA[0], uA[1]), lenB = Math.hypot(uB[0], uB[1]);
      const sumX = uA[0] / lenA + uB[0] / lenB, sumY = uA[1] / lenA + uB[1] / lenB;
      const sumLen = Math.hypot(sumX, sumY);
      const resX = 200, resY = 40; // petit encart en haut à droite
      if (sumLen < 0.05) {
        s += `<text x="${resX}" y="${resY}" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">Σ = vecteur nul</text>`;
        s += `<circle cx="${resX}" cy="${resY + 16}" r="4" fill="none" stroke="var(--yellow)" stroke-width="2"/>`;
      } else {
        const ux = sumX / sumLen, uy = sumY / sumLen;
        const ex2 = resX + ux * 30, ey2 = resY + 14 + uy * 30;
        s += `<defs><marker id="sumArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker></defs>`;
        s += `<line x1="${resX}" y1="${resY + 14}" x2="${ex2}" y2="${ey2}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#sumArrow)"/>`;
        s += `<text x="${resX}" y="${resY}" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">Σ ≠ vecteur nul</text>`;
      }
    }

    svg.innerHTML = s;

    const STEP_TEXT = [
      `${g.label} : la molécule, sans charges pour l'instant.`,
      `Étape 2 — Les charges partielles apparaissent (électronégativités différentes) : liaisons polarisées.`,
      `Étape 3 — Un vecteur (du + vers le −) représente chaque liaison polarisée.`,
      step >= 4
        ? (isLinear
          ? `Étape 4 — Les deux vecteurs sont opposés et de même norme (géométrie linéaire) → leur somme est le <strong style="color:var(--yellow)">vecteur nul</strong> → molécule <strong style="color:var(--yellow)">apolaire</strong>.`
          : `Étape 4 — Les deux vecteurs ne sont pas opposés (géométrie coudée) → leur somme n'est <strong style="color:var(--coral)">pas nulle</strong> → molécule <strong style="color:var(--coral)">polaire</strong>.`)
        : ""
    ];
    readout.innerHTML = STEP_TEXT[step - 1];
    stepEl.textContent = `Étape ${step} / 4`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 4;
  }

  let currentMode = "linear", currentStep = 1;
  function render() { draw(currentMode, currentStep); }

  btnLinear.addEventListener("click", () => { btnLinear.classList.add("active-hist"); btnBent.classList.remove("active-hist"); currentMode = "linear"; currentStep = 1; render(); });
  btnBent.addEventListener("click", () => { btnBent.classList.add("active-hist"); btnLinear.classList.remove("active-hist"); currentMode = "bent"; currentStep = 1; render(); });
  prevBtn.addEventListener("click", () => { if (currentStep > 1) { currentStep--; render(); } });
  nextBtn.addEventListener("click", () => { if (currentStep < 4) { currentStep++; render(); } });

  btnLinear.classList.add("active-hist");
  render();
}

/* ---------- 29. Formation de molécules par liaison covalente ---------- */
function initMoleculeFormation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const formBtn = document.getElementById(cfg.formBtnId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const cx = 110, cy = 90;

  function bondLines(x1, y1, x2, y2, order, color) {
    let s = "";
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    const inset = 11; // laisse un petit espace pour la lettre, comme dans un livre
    const ix1 = x1 + ux * inset, iy1 = y1 + uy * inset;
    const ix2 = x2 - ux * inset, iy2 = y2 - uy * inset;
    const perpX = -uy * 3.5, perpY = ux * 3.5;
    const offsets = order === 1 ? [0] : order === 2 ? [-1, 1] : [-1.4, 0, 1.4];
    offsets.forEach(o => {
      s += `<line x1="${ix1 + perpX * o}" y1="${iy1 + perpY * o}" x2="${ix2 + perpX * o}" y2="${iy2 + perpY * o}" stroke="${color}" stroke-width="2"/>`;
    });
    return s;
  }
  function dotAt(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    return `<circle cx="${px + 17 * Math.cos(rad)}" cy="${py + 17 * Math.sin(rad)}" r="2.8" fill="${color}"/>`;
  }
  function doubletAt(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    const perpX = 4.5 * Math.sin(rad), perpY = -4.5 * Math.cos(rad);
    const ox = 17 * Math.cos(rad), oy = 17 * Math.sin(rad);
    return `<circle cx="${px + ox - perpX}" cy="${py + oy - perpY}" r="2.6" fill="${color}"/>
            <circle cx="${px + ox + perpX}" cy="${py + oy + perpY}" r="2.6" fill="${color}"/>`;
  }
  function atomLabel(x, y, text, color) {
    return `<text x="${x}" y="${y + 6}" font-size="18" fill="${color}" text-anchor="middle" font-family="var(--font-body)" font-weight="700">${text}</text>`;
  }
  // Schéma de Lewis isolé (avant liaison), réutilise la logique du
  // constructeur de Lewis : jusqu'à 4 côtés, célibataires puis doublets.
  function isolatedAtom(x, y, symbol, valence, color) {
    let s = atomLabel(x, y, symbol, color);
    if (valence === 1) { s += dotAt(x, y, -90, color); return s; } // H
    const doublets = Math.max(0, valence - 4);
    const celibataires = 4 - doublets;
    const angles = [-90, 0, 90, 180];
    for (let i = 0; i < 4; i++) {
      if (i < doublets) s += doubletAt(x, y, angles[i], color);
      else if (i < doublets + celibataires) s += dotAt(x, y, angles[i], color);
    }
    return s;
  }

  const MOLECULES = {
    H2: {
      separated() {
        return isolatedAtom(55, cy, "H", 1, "var(--teal)") + isolatedAtom(165, cy, "H", 1, "var(--teal)");
      },
      formed() {
        let s = bondLines(65, cy, 155, cy, 1, "var(--chalk)");
        return s + atomLabel(55, cy, "H", "var(--teal)") + atomLabel(165, cy, "H", "var(--teal)");
      },
      text: "H possède 1 électron célibataire → il forme 1 liaison avec un autre H → H₂ (aucun doublet non liant)."
    },
    CH4: {
      separated() {
        let s = isolatedAtom(cx, cy, "C", 4, "var(--coral)");
        [[0, -70], [70, 0], [0, 70], [-70, 0]].forEach(([dx, dy]) => { s += isolatedAtom(cx + dx, cy + dy, "H", 1, "var(--teal)"); });
        return s;
      },
      formed() {
        let s = "";
        [[0, -45], [45, 0], [0, 45], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, 1, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        return s + atomLabel(cx, cy, "C", "var(--coral)");
      },
      text: "C possède 4 électrons célibataires → il forme 4 liaisons avec 4 atomes H → CH₄ (aucun doublet non liant sur C)."
    },
    NH3: {
      // haut = doublet non liant, droite/bas/gauche = liaisons avec H
      separated() {
        let s = isolatedAtom(cx, cy, "N", 5, "var(--coral)");
        [[70, 0], [0, 70], [-70, 0]].forEach(([dx, dy]) => { s += isolatedAtom(cx + dx, cy + dy, "H", 1, "var(--teal)"); });
        return s;
      },
      formed() {
        let s = "";
        [[45, 0], [0, 45], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, 1, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        s += doubletAt(cx, cy, -90, "var(--yellow)");
        return s + atomLabel(cx, cy, "N", "var(--coral)");
      },
      text: "N possède 3 électrons célibataires (+ 1 doublet non liant en haut) → il forme 3 liaisons avec 3 atomes H → NH₃."
    },
    H2O: {
      // gauche/droite = liaisons avec H, haut/bas = doublets non liants
      separated() {
        let s = isolatedAtom(cx, cy, "O", 6, "var(--coral)");
        [[70, 0], [-70, 0]].forEach(([dx, dy]) => { s += isolatedAtom(cx + dx, cy + dy, "H", 1, "var(--teal)"); });
        return s;
      },
      formed() {
        let s = "";
        [[45, 0], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, 1, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        s += doubletAt(cx, cy, -90, "var(--yellow)");
        s += doubletAt(cx, cy, 90, "var(--yellow)");
        return s + atomLabel(cx, cy, "O", "var(--coral)");
      },
      text: "O possède 2 électrons célibataires (+ 2 doublets non liants, haut et bas) → il forme 2 liaisons avec 2 atomes H → H₂O."
    },
    HF: {
      separated() {
        return isolatedAtom(cx, cy, "F", 7, "var(--coral)") + isolatedAtom(cx + 70, cy, "H", 1, "var(--teal)");
      },
      formed() {
        let s = bondLines(cx, cy, cx + 45, cy, 1, "var(--chalk)");
        s += atomLabel(cx + 45, cy, "H", "var(--teal)");
        [-90, 90, 180].forEach(a => { s += doubletAt(cx, cy, a, "var(--yellow)"); });
        return s + atomLabel(cx, cy, "F", "var(--coral)");
      },
      text: "F possède 1 électron célibataire (+ 3 doublets non liants) → il forme 1 liaison avec un atome H → HF."
    },
    CO2: {
      separated() {
        let s = isolatedAtom(cx, cy, "C", 4, "var(--coral)");
        s += isolatedAtom(cx - 90, cy, "O", 6, "var(--teal)");
        s += isolatedAtom(cx + 90, cy, "O", 6, "var(--teal)");
        return s;
      },
      formed() {
        const O1x = cx - 70, O2x = cx + 70;
        let s = bondLines(O1x, cy, cx, cy, 2, "var(--chalk)");
        s += bondLines(cx, cy, O2x, cy, 2, "var(--chalk)");
        [O1x, O2x].forEach(ox => {
          s += doubletAt(ox, cy, -90, "var(--yellow)");
          s += doubletAt(ox, cy, 90, "var(--yellow)");
          s += atomLabel(ox, cy, "O", "var(--teal)");
        });
        return s + atomLabel(cx, cy, "C", "var(--coral)");
      },
      text: "C (4 célibataires) forme deux doubles liaisons avec deux O (2 célibataires chacun) → O=C=O. Chaque O garde ses 2 doublets non liants."
    },
    N2: {
      separated() {
        return isolatedAtom(cx - 60, cy, "N", 5, "var(--coral)") + isolatedAtom(cx + 60, cy, "N", 5, "var(--coral)");
      },
      formed() {
        const Ax = cx - 55, Bx = cx + 55;
        let s = bondLines(Ax, cy, Bx, cy, 3, "var(--chalk)");
        s += doubletAt(Ax, cy, 180, "var(--yellow)");
        s += doubletAt(Bx, cy, 0, "var(--yellow)");
        return s + atomLabel(Ax, cy, "N", "var(--coral)") + atomLabel(Bx, cy, "N", "var(--coral)");
      },
      text: "Chaque N (3 célibataires) met en commun ses 3 électrons → triple liaison N≡N, avec un doublet non liant restant sur chaque atome."
    }
  };

  let currentKey = "H2", formed = false;

  function render() {
    const m = MOLECULES[currentKey];
    svg.innerHTML = formed ? m.formed() : m.separated();
    readout.innerHTML = formed ? m.text : "Atomes séparés — clique sur \"Former !\" pour créer la molécule.";
    formBtn.textContent = formed ? "↺ Séparer" : "⚛️ Former !";
  }

  buttons.forEach((btn, i) => {
    const key = cfg.moleculeKeys[i];
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      currentKey = key;
      formed = false;
      render();
    });
  });
  formBtn.addEventListener("click", () => { formed = !formed; render(); });

  buttons[0].classList.add("active-hist");
  render();
}

/* ---------- 30. Formation des ions polyatomiques (NH4+ et OH-) ---------- */
function initIonFormation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const formBtn = document.getElementById(cfg.formBtnId);
  const btnNH4 = document.getElementById(cfg.btnNH4Id);
  const btnOH = document.getElementById(cfg.btnOHId);

  const cx = 120, cy = 95;

  function bondLines(x1, y1, x2, y2, color) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len, inset = 11;
    return `<line x1="${x1 + ux * inset}" y1="${y1 + uy * inset}" x2="${x2 - ux * inset}" y2="${y2 - uy * inset}" stroke="${color}" stroke-width="2"/>`;
  }
  function dotAt(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    return `<circle cx="${px + 17 * Math.cos(rad)}" cy="${py + 17 * Math.sin(rad)}" r="2.8" fill="${color}"/>`;
  }
  function doubletAt(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    const perpX = 4.5 * Math.sin(rad), perpY = -4.5 * Math.cos(rad);
    const ox = 17 * Math.cos(rad), oy = 17 * Math.sin(rad);
    return `<circle cx="${px + ox - perpX}" cy="${py + oy - perpY}" r="2.6" fill="${color}"/>
            <circle cx="${px + ox + perpX}" cy="${py + oy + perpY}" r="2.6" fill="${color}"/>`;
  }
  function atomLabel(x, y, text, color, size) {
    return `<text x="${x}" y="${y + (size || 18) / 3}" font-size="${size || 18}" fill="${color}" text-anchor="middle" font-family="var(--font-body)" font-weight="700">${text}</text>`;
  }
  function formalCharge(x, y, sign, color) {
    return `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${color}" stroke-width="1.5"/>
            <text x="${x}" y="${y + 3}" font-size="9" fill="${color}" text-anchor="middle" font-weight="700">${sign}</text>`;
  }
  function lacuneAt(px, py, angleDeg, color) {
    const rad = (angleDeg * Math.PI) / 180;
    const ox = 17 * Math.cos(rad), oy = 17 * Math.sin(rad);
    return `<rect x="${ox + px - 5}" y="${oy + py - 4}" width="10" height="8" fill="none" stroke="${color}" stroke-width="1.5"/>`;
  }
  function atomWithLacune(x, y, color) {
    // H⁺ : un atome d'hydrogène sans son électron = lacune électronique
    // (déficit de 2 par rapport au duet stable de He), même symbole que
    // dans le cours (section "lacune électronique").
    return atomLabel(x, y, "H⁺", color) + lacuneAt(x, y, -90, color);
  }

  const IONS = {
    "NH4+": {
      start() {
        let s = "";
        [[45, 0], [0, 45], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        s += doubletAt(cx, cy, -90, "var(--yellow)");
        s += atomLabel(cx, cy, "N", "var(--coral)");
        // l'atome d'hydrogène qui arrive, sans son électron (lacune électronique)
        s += atomWithLacune(cx, cy - 62, "var(--chalk-dim)");
        return s;
      },
      formed() {
        let s = "";
        [[0, -45], [45, 0], [0, 45], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        s += atomLabel(cx, cy, "N", "var(--coral)");
        s += formalCharge(cx + 16, cy - 16, "+", "var(--coral)");
        return s;
      },
      text: "NH₃ (doublet non liant sur N) capte un atome d'hydrogène sans son électron (H⁺) grâce à ce doublet → NH₄⁺. N ne « possède » plus que 4 électrons (contre 5 dans NH₃) : charge formelle +1. (Conservation de la charge : NH₃ neutre + H⁺ (+1) → NH₄⁺ (+1).)"
    },
    "OH-": {
      start() {
        let s = "";
        [[45, 0], [-45, 0]].forEach(([dx, dy]) => {
          s += bondLines(cx, cy, cx + dx, cy + dy, "var(--chalk)");
          s += atomLabel(cx + dx, cy + dy, "H", "var(--teal)");
        });
        s += doubletAt(cx, cy, -90, "var(--yellow)");
        s += doubletAt(cx, cy, 90, "var(--yellow)");
        s += atomLabel(cx, cy, "O", "var(--coral)");
        return s;
      },
      formed() {
        let s = bondLines(cx, cy, cx - 45, cy, "var(--chalk)");
        s += atomLabel(cx - 45, cy, "H", "var(--teal)");
        s += doubletAt(cx, cy, -90, "var(--yellow)");
        s += doubletAt(cx, cy, 90, "var(--yellow)");
        s += doubletAt(cx, cy, 0, "var(--yellow)"); // nouveau doublet, ex-liaison
        s += atomLabel(cx, cy, "O", "var(--coral)");
        s += formalCharge(cx - 16, cy - 16, "−", "var(--teal)");
        // l'atome d'hydrogène qui repart, sans son électron (lacune électronique)
        s += atomWithLacune(cx + 90, cy, "var(--chalk-dim)");
        return s;
      },
      text: "H₂O perd un atome d'hydrogène sans son électron (H⁺) : les 2 électrons de l'ancienne liaison restent entièrement sur O, formant un nouveau doublet → OH⁻. O « possède » alors 7 électrons (contre 6 dans H₂O) : charge formelle −1. (Conservation de la charge : H₂O neutre → OH⁻ (−1) + H⁺ (+1).)"
    }
  };

  let currentKey = "NH4+", formed = false;

  function render() {
    const ion = IONS[currentKey];
    svg.innerHTML = formed ? ion.formed() : ion.start();
    readout.innerHTML = formed ? ion.text : "État de départ — clique sur \"Former l'ion !\".";
    formBtn.textContent = formed ? "↺ Revenir au départ" : "⚛️ Former l'ion !";
  }

  btnNH4.addEventListener("click", () => { btnNH4.classList.add("active-hist"); btnOH.classList.remove("active-hist"); currentKey = "NH4+"; formed = false; render(); });
  btnOH.addEventListener("click", () => { btnOH.classList.add("active-hist"); btnNH4.classList.remove("active-hist"); currentKey = "OH-"; formed = false; render(); });
  formBtn.addEventListener("click", () => { formed = !formed; render(); });

  btnNH4.classList.add("active-hist");
  render();
}

/* ---------- 31. Polarité d'une liaison (tableau de Pauling + constructeur) ---------- */
function initBondPolarity(cfg) {
  const tableEl = document.getElementById(cfg.tableId);
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);

  // Échelle de Pauling simplifiée (mêmes valeurs que le manuel), pas de gaz nobles
  const EN = [
    { symbol: "H", period: 1, group: 1, chi: 2.2 },
    { symbol: "Li", period: 2, group: 1, chi: 1.0 },
    { symbol: "Be", period: 2, group: 2, chi: 1.6 },
    { symbol: "B", period: 2, group: 13, chi: 2.0 },
    { symbol: "C", period: 2, group: 14, chi: 2.6 },
    { symbol: "N", period: 2, group: 15, chi: 3.0 },
    { symbol: "O", period: 2, group: 16, chi: 3.4 },
    { symbol: "F", period: 2, group: 17, chi: 4.0 },
    { symbol: "Na", period: 3, group: 1, chi: 0.9 },
    { symbol: "Mg", period: 3, group: 2, chi: 1.3 },
    { symbol: "Al", period: 3, group: 13, chi: 1.6 },
    { symbol: "Si", period: 3, group: 14, chi: 1.9 },
    { symbol: "P", period: 3, group: 15, chi: 2.2 },
    { symbol: "S", period: 3, group: 16, chi: 2.6 },
    { symbol: "Cl", period: 3, group: 17, chi: 3.2 }
  ];
  const SLOT_GROUPS = [1, 2, 13, 14, 15, 16, 17];

  function buildTable() {
    tableEl.innerHTML = "";
    for (let period = 1; period <= 3; period++) {
      for (let col of SLOT_GROUPS) {
        const cell = document.createElement("div");
        const valid = period === 1 ? col === 1 : true;
        if (valid) {
          const el = EN.find(e => e.period === period && e.group === col);
          cell.className = "ptable-slot en-slot";
          cell.innerHTML = `<span class="en-symbol">${el.symbol}</span><span class="en-value">${el.chi.toFixed(1)}</span>`;
          cell.dataset.symbol = el.symbol;
          cell.addEventListener("click", () => selectAtom(el));
        } else {
          cell.className = "ptable-cell empty";
        }
        tableEl.appendChild(cell);
      }
    }
  }

  let picked = [];

  function selectAtom(el) {
    if (picked.length === 2) {
      picked = [];
      tableEl.querySelectorAll(".en-slot").forEach(c => c.classList.remove("pick-a", "pick-b"));
    }
    picked.push(el);
    const cell = tableEl.querySelector(`[data-symbol="${el.symbol}"]`);
    cell.classList.add(picked.length === 1 ? "pick-a" : "pick-b");
    if (picked.length === 2) drawBond(picked[0], picked[1]);
    else {
      svg.innerHTML = "";
      readout.textContent = `${el.symbol} sélectionné (χ = ${el.chi.toFixed(1)}) — choisis un second atome pour former une liaison.`;
    }
  }

  function drawBond(a, b) {
    const dchi = Math.abs(a.chi - b.chi);
    const Ax = 55, Bx = 165, y = 70;
    let s = `<line x1="${Ax + 14}" y1="${y}" x2="${Bx - 14}" y2="${y}" stroke="var(--chalk)" stroke-width="2.5"/>`;
    s += `<text x="${Ax}" y="${y + 6}" font-size="18" fill="var(--teal)" text-anchor="middle" font-weight="700">${a.symbol}</text>`;
    s += `<text x="${Bx}" y="${y + 6}" font-size="18" fill="var(--coral)" text-anchor="middle" font-weight="700">${b.symbol}</text>`;
    s += `<text x="${Ax}" y="${y + 26}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">χ = ${a.chi.toFixed(1)}</text>`;
    s += `<text x="${Bx}" y="${y + 26}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">χ = ${b.chi.toFixed(1)}</text>`;

    if (dchi >= 0.5) {
      const lessEN = a.chi < b.chi ? a : b, moreEN = a.chi < b.chi ? b : a;
      const lessX = a.chi < b.chi ? Ax : Bx, moreX = a.chi < b.chi ? Bx : Ax;
      s += `<text x="${lessX}" y="${y - 22}" font-size="12" fill="var(--yellow)" text-anchor="middle" font-weight="700">+q</text>`;
      s += `<text x="${moreX}" y="${y - 22}" font-size="12" fill="var(--yellow)" text-anchor="middle" font-weight="700">−q</text>`;
    }
    svg.innerHTML = s;

    if (dchi >= 0.5) {
      readout.innerHTML = `Δχ = |${a.chi.toFixed(1)} − ${b.chi.toFixed(1)}| = <strong style="color:var(--yellow)">${dchi.toFixed(1)}</strong> ≥ 0,5 → <strong style="color:var(--coral)">liaison polarisée</strong> : charges partielles +q sur l'atome le moins électronégatif, −q sur le plus électronégatif.`;
    } else {
      readout.innerHTML = `Δχ = |${a.chi.toFixed(1)} − ${b.chi.toFixed(1)}| = <strong style="color:var(--teal)">${dchi.toFixed(1)}</strong> &lt; 0,5 → <strong style="color:var(--teal)">liaison non polarisée</strong> : pas de charge partielle.`;
    }
  }

  buildTable();
  readout.textContent = "Clique deux éléments du tableau pour former une liaison entre eux.";
}


/* ================================================================== */
/* Partie 2 : animations grand format (diapos, largeur 1780)           */
/* ================================================================== */
var CH9 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", b2: "#1d3229", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };
var CH9_E = { H: "#6bbfab", C: "#e8c468", N: "#d97a63", O: "#d97a63", F: "#d97a63" };
var CH9_3D = { H: "#e9e4d8", C: "#e8c468", N: "#6bbfab", O: "#d97a63" };
var CH9_UID = 0;

function ch9$(id) { return id ? document.getElementById(id) : null; }
function ch9f(v) { return (+v).toFixed(1); }
function ch9op(op) { return op != null ? ` opacity="${Math.max(0, Math.min(1, op)).toFixed(2)}"` : ""; }
function ch9t(x, y, s, o) {
  o = o || {};
  return `<text x="${ch9f(x)}" y="${ch9f(y)}" font-size="${o.size || 26}" fill="${o.fill || CH9.dim}" font-family="${o.font || CH9.fh}" text-anchor="${o.anchor || "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}${ch9op(o.op)}>${s}</text>`;
}
function ch9btn(id, fn) {
  const b = ch9$(id);
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function ch9setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function ch9clamp(v) { return Math.max(0, Math.min(1, v)); }
function ch9ease(t) { t = ch9clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function ch9tween(st, from, to, dur, onFrame, onDone) {
  if (st.raf) cancelAnimationFrame(st.raf);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    onFrame(from + (to - from) * k);
    if (k < 1) st.raf = requestAnimationFrame(step);
    else { st.raf = 0; if (onDone) onDone(); }
  };
  st.raf = requestAnimationFrame(step);
}
function ch9num(x, d) { return x.toFixed(d == null ? 1 : d).replace(".", ","); }
function ch9pw(n, sing, plur) { return n + " " + (n > 1 ? plur : sing); }
function ch9readout(title, body, col) {
  return `<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:40px;color:${col || "#e8c468"};line-height:1.15;">${title}</div><div style="font-size:28px;line-height:1.45;text-wrap:pretty;color:#f2ede1;">${body}</div></div>`;
}

/* --- primitives de schéma de Lewis --- */
function ch9sym(x, y, s, col, F, op) {
  return `<text x="${ch9f(x)}" y="${ch9f(y + F * 0.36)}" font-size="${F}" fill="${col}" font-family="Space Grotesk, sans-serif" font-weight="700" text-anchor="middle"${ch9op(op)}>${s}</text>`;
}
function ch9dot(x, y, a, d, r, col, off, op) {
  const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180), o = off || 0;
  return `<circle cx="${ch9f(x + d * ca - o * sa)}" cy="${ch9f(y + d * sa + o * ca)}" r="${r}" fill="${col}"${ch9op(op)}/>`;
}
function ch9dash(x, y, a, d, len, col, w, op) {
  const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
  const cx = x + d * ca, cy = y + d * sa, hx = -sa * len / 2, hy = ca * len / 2;
  return `<line x1="${ch9f(cx - hx)}" y1="${ch9f(cy - hy)}" x2="${ch9f(cx + hx)}" y2="${ch9f(cy + hy)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${ch9op(op)}/>`;
}
function ch9bond(x1, y1, x2, y2, order, col, inset, gap, w, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const offs = order === 1 ? [0] : order === 2 ? [-gap / 2, gap / 2] : [-gap, 0, gap];
  return offs.map((o) => `<line x1="${ch9f(x1 + ux * inset + px * o)}" y1="${ch9f(y1 + uy * inset + py * o)}" x2="${ch9f(x2 - ux * inset + px * o)}" y2="${ch9f(y2 - uy * inset + py * o)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${ch9op(op)}/>`).join("");
}
function ch9charge(x, y, sign, col, r, op) {
  return `<g${ch9op(op)}><circle cx="${ch9f(x)}" cy="${ch9f(y)}" r="${r}" fill="none" stroke="${col}" stroke-width="3"/>` +
    `<text x="${ch9f(x)}" y="${ch9f(y + r * 0.42)}" font-size="${Math.round(r * 1.3)}" fill="${col}" font-family="Space Grotesk, sans-serif" font-weight="700" text-anchor="middle">${sign}</text></g>`;
}
function ch9lacune(x, y, a, d, col, op) {
  const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
  return `<rect x="-20" y="-11" width="40" height="22" fill="none" stroke="${col}" stroke-width="3" transform="translate(${ch9f(x + d * ca)} ${ch9f(y + d * sa)}) rotate(${a + 90})"${ch9op(op)}/>`;
}
function ch9arrow(x1, y1, x2, y2, col, w, head, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 2) return "";
  const ux = dx / L, uy = dy / L, h = Math.min(head || 20, L), bx = x2 - ux * h, by = y2 - uy * h;
  return `<g${ch9op(op)}><line x1="${ch9f(x1)}" y1="${ch9f(y1)}" x2="${ch9f(bx + ux * 2)}" y2="${ch9f(by + uy * 2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<polygon points="${ch9f(x2)},${ch9f(y2)} ${ch9f(bx - uy * h * 0.55)},${ch9f(by + ux * h * 0.55)} ${ch9f(bx + uy * h * 0.55)},${ch9f(by - ux * h * 0.55)}" fill="${col}"/></g>`;
}
function ch9curve(x1, y1, cx, cy, x2, y2, col, op) {
  const dx = x2 - cx, dy = y2 - cy, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 20, bx = x2 - ux * h, by = y2 - uy * h;
  return `<g${ch9op(op)}><path d="M${ch9f(x1)},${ch9f(y1)} Q${ch9f(cx)},${ch9f(cy)} ${ch9f(bx)},${ch9f(by)}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>` +
    `<polygon points="${ch9f(x2)},${ch9f(y2)} ${ch9f(bx - uy * 11)},${ch9f(by + ux * 11)} ${ch9f(bx + uy * 11)},${ch9f(by - ux * 11)}" fill="${col}"/></g>`;
}
function ch9lewis(sp, F, ox, oy) {
  const d = F * 0.66, len = F * 0.44, w = Math.max(3, F * 0.065), inset = F * 0.46, gap = F * 0.17;
  let m = "";
  sp.bonds.forEach(([i, j, o]) => { const A = sp.atoms[i], B = sp.atoms[j]; m += ch9bond(ox + A.x, oy + A.y, ox + B.x, oy + B.y, o, CH9.chalk, inset, gap, w); });
  sp.atoms.forEach((A) => {
    const col = CH9_E[A.s] || CH9.chalk;
    (A.lp || []).forEach((a) => { m += ch9dash(ox + A.x, oy + A.y, a, d, len, col, w); });
    m += ch9sym(ox + A.x, oy + A.y, A.s, CH9.chalk, F);
    if (A.ch) {
      const cd = F * 0.98, ca = Math.cos(A.ch.a * Math.PI / 180), sa = Math.sin(A.ch.a * Math.PI / 180);
      m += ch9charge(ox + A.x + cd * ca, oy + A.y + cd * sa, A.ch.s, A.ch.s === "+" ? CH9.c : CH9.t, F * 0.22);
    }
  });
  return m;
}

/* ------------------------------------------------------------------ */
/* 1. Schéma de Lewis d'un atome                                       */
/* ------------------------------------------------------------------ */
function initCh9LewisAtom(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId);
  if (!svg) return;
  const RAW = [["H", 1, 1, 1], ["He", 2, 1, 18], ["Li", 3, 2, 1], ["Be", 4, 2, 2], ["B", 5, 2, 13], ["C", 6, 2, 14], ["N", 7, 2, 15], ["O", 8, 2, 16], ["F", 9, 2, 17], ["Ne", 10, 2, 18],
    ["Na", 11, 3, 1], ["Mg", 12, 3, 2], ["Al", 13, 3, 13], ["Si", 14, 3, 14], ["P", 15, 3, 15], ["S", 16, 3, 16], ["Cl", 17, 3, 17], ["Ar", 18, 3, 18]];
  const EL = RAW.map(([s, z, p, g]) => ({ s, z, p, g, v: s === "He" ? 2 : g <= 2 ? g : g - 10 }));
  const COLS = [1, 2, 13, 14, 15, 16, 17, 18], TX = 150, TY = 120, CW = 96, GP = 10;
  const NONMET = ["H", "B", "C", "N", "O", "F", "Si", "P", "S", "Cl"];
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = (n) => String(n).split("").map((c) => SUP[+c]).join("");
  const LX = 1140, LY = 290, F = 150, D = 112, IX = 1335;
  let cur = null;
  const st = {};
  function counts(e) {
    const nD = e.p === 1 ? (e.v === 2 ? 1 : 0) : Math.max(0, e.v - 4);
    return { nD, nC: e.v - 2 * nD };
  }
  function conf(e) {
    const O = [["1s", 2, 1], ["2s", 2, 2], ["2p", 6, 2], ["3s", 2, 3], ["3p", 6, 3]];
    let r = e.z, out = "";
    O.forEach(([n, c, sh]) => { if (r <= 0) return; const k = Math.min(c, r); r -= k; out += `<tspan fill="${sh === e.p ? CH9.y : CH9.dim}">${n}${sup(k)} </tspan>`; });
    return out;
  }
  function table() {
    let m = "";
    COLS.forEach((g, ci) => { m += ch9t(TX + ci * (CW + GP) + CW / 2, TY - 16, g, { anchor: "middle", size: 22 }); });
    [1, 2, 3].forEach((p) => { m += ch9t(TX - 20, TY + (p - 1) * (CW + GP) + CW / 2 + 9, "n = " + p, { anchor: "end", size: 26 }); });
    EL.forEach((e) => {
      const x = TX + COLS.indexOf(e.g) * (CW + GP), y = TY + (e.p - 1) * (CW + GP), on = cur && cur.s === e.s;
      const fill = on ? CH9.y : e.g === 18 ? "rgba(232,196,104,0.12)" : "rgba(242,237,225,0.05)";
      m += `<g data-sym="${e.s}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${CW}" height="${CW}" rx="12" fill="${fill}" stroke="${on ? CH9.y : "rgba(242,237,225,0.28)"}" stroke-width="2"/>`;
      m += ch9t(x + 10, y + 24, e.z, { size: 18, fill: on ? CH9.board : CH9.dim, font: CH9.fb });
      m += ch9t(x + CW / 2, y + 72, e.s, { anchor: "middle", size: 42, fill: on ? CH9.board : CH9.chalk, weight: 700 }) + `</g>`;
    });
    m += ch9t(TX, 470, "Colonnes 1 et 2 : électrons de valence = numéro de colonne", { size: 26 });
    m += ch9t(TX, 510, "Colonnes 13 à 18 : électrons de valence = numéro − 10 (sauf He : 2)", { size: 26 });
    return m;
  }
  function draw(k, p) {
    const e = cur;
    let m = table();
    m += `<circle cx="${LX}" cy="${LY}" r="${D}" fill="none" stroke="rgba(242,237,225,0.22)" stroke-width="3" stroke-dasharray="10 10"/>`;
    m += ch9sym(LX, LY, e.s, CH9.chalk, F);
    const A = [-90, 0, 90, 180], c = [0, 0, 0, 0];
    for (let i = 0; i < k; i++) c[e.p === 1 ? 0 : i % 4]++;
    c.forEach((n, i) => {
      if (n === 1) m += ch9dot(LX, LY, A[i], D, 13, CH9.c);
      if (n === 2) m += ch9dot(LX, LY, A[i], D, 12, CH9.y, -22, 1 - p) + ch9dot(LX, LY, A[i], D, 12, CH9.y, 22, 1 - p) + ch9dash(LX, LY, A[i], D, 72, CH9.y, 11, p);
    });
    m += ch9t(LX, LY + D + 80, `couche de valence n = ${e.p}`, { anchor: "middle", size: 26 });
    const { nD, nC } = counts(e);
    m += ch9t(IX, 140, "Z = " + e.z, { size: 28, font: CH9.fb });
    m += ch9t(IX, 198, conf(e), { size: 36 });
    m += ch9t(IX, 278, ch9pw(e.v, "électron de valence", "électrons de valence"), { size: 36, fill: CH9.y, op: p });
    m += `<circle cx="${IX + 14}" cy="${336}" r="11" fill="${CH9.c}"${ch9op(p)}/>` + ch9t(IX + 44, 346, ch9pw(nC, "électron célibataire", "électrons célibataires"), { size: 27, fill: CH9.chalk, font: CH9.fb, op: p });
    m += `<line x1="${IX}" y1="${396}" x2="${IX + 30}" y2="${396}" stroke="${CH9.y}" stroke-width="9" stroke-linecap="round"${ch9op(p)}/>` + ch9t(IX + 44, 406, ch9pw(nD, "doublet non liant", "doublets non liants"), { size: 27, fill: CH9.chalk, font: CH9.fb, op: p });
    if (e.g === 18) m += ch9t(IX, 480, "couche saturée : atome stable", { size: 34, fill: CH9.t, op: p });
    else if (NONMET.includes(e.s)) m += ch9t(IX, 480, "→ forme " + ch9pw(nC, "liaison", "liaisons"), { size: 34, fill: CH9.t, op: p });
    svg.innerHTML = m;
  }
  function say(e) {
    const { nD, nC } = counts(e);
    let body;
    if (e.s === "He") body = "Couche n = 1 saturée à 2 électrons : un doublet. L'hélium est stable, il ne forme pas de liaison.";
    else if (e.g === 18) body = "Couche de valence saturée à 8 électrons : quatre doublets. Atome stable, il ne forme pas de liaison.";
    else if (e.s === "H") body = "Un seul électron de valence, célibataire : H forme 1 liaison.";
    else if (e.v <= 4) body = `Jusqu'à quatre électrons, chacun reste célibataire : ${ch9pw(nC, "électron célibataire", "électrons célibataires")}.` + (NONMET.includes(e.s) ? ` ${e.s} forme ${ch9pw(nC, "liaison", "liaisons")}.` : "");
    else body = `Les quatre premiers électrons sont célibataires, les ${e.v - 4} suivants s'apparient en doublets : ${ch9pw(nD, "doublet non liant", "doublets non liants")} et ${ch9pw(nC, "électron célibataire", "électrons célibataires")}. ${e.s} forme ${ch9pw(nC, "liaison", "liaisons")}.`;
    return ch9readout(`${e.s} : ${ch9pw(e.v, "électron de valence", "électrons de valence")}`, body);
  }
  function select(s) {
    cur = EL.find((e) => e.s === s);
    const v = cur.v, per = 230;
    if (readout) readout.innerHTML = say(cur);
    ch9tween(st, 0, v + 1.6, (v + 1.6) * per, (x) => { draw(Math.min(v, Math.floor(x)), ch9clamp((x - v - 0.4) / 1.2)); });
  }
  svg.addEventListener("click", (ev) => { const g = ev.target.closest && ev.target.closest("[data-sym]"); if (g) select(g.getAttribute("data-sym")); });
  cur = EL.find((e) => e.s === (cfg.start || "O"));
  draw(cur.v, 1);
  if (readout) readout.innerHTML = say(cur);
}

/* ------------------------------------------------------------------ */
/* 2. Formation de molécules par liaison covalente                     */
/* ------------------------------------------------------------------ */
function initCh9Molecule(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId);
  if (!svg) return;
  const L = 165, F = 96, CX = 890, CY = 290, HZ = 2.1, VT = 1.4;
  const at = (s, p, q, lp) => ({ s, p, q: q || p, lp: lp || [] });
  const M = [
    { n: "H₂", atoms: [at("H", [-L / 2, 0], [-330, 0]), at("H", [L / 2, 0], [330, 0])], bonds: [[0, 1, 1]], text: "Chaque H apporte son électron célibataire : ils forment un doublet liant, H–H." },
    { n: "CH₄", atoms: [at("C", [0, 0]), at("H", [0, -L], [0, -VT * L]), at("H", [L, 0], [HZ * L, 0]), at("H", [0, L], [0, VT * L]), at("H", [-L, 0], [-HZ * L, 0])], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], text: "C possède 4 électrons célibataires : il forme 4 liaisons avec 4 atomes H." },
    { n: "NH₃", atoms: [at("N", [0, 0], null, [-90]), at("H", [L, 0], [HZ * L, 0]), at("H", [0, L], [0, VT * L]), at("H", [-L, 0], [-HZ * L, 0])], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], text: "N possède 3 électrons célibataires et 1 doublet non liant : il forme 3 liaisons avec 3 atomes H." },
    { n: "H₂O", atoms: [at("O", [0, 0], null, [-90, 90]), at("H", [-L, 0], [-HZ * L, 0]), at("H", [L, 0], [HZ * L, 0])], bonds: [[0, 1, 1], [0, 2, 1]], text: "O possède 2 électrons célibataires et 2 doublets non liants : il forme 2 liaisons avec 2 atomes H." },
    { n: "HF", atoms: [at("F", [-L / 2, 0], [-L / 2 - 120, 0], [-90, 90, 180]), at("H", [L / 2, 0], [L / 2 + 300, 0])], bonds: [[0, 1, 1]], text: "F possède 1 électron célibataire et 3 doublets non liants : il forme 1 liaison avec H." },
    { n: "CO₂", atoms: [at("C", [0, 0]), at("O", [-L, 0], [-HZ * L, 0], [-90, 90]), at("O", [L, 0], [HZ * L, 0], [-90, 90])], bonds: [[0, 1, 2], [0, 2, 2]], text: "C met en commun deux électrons avec chaque O : deux liaisons doubles, O=C=O. Chaque O garde 2 doublets non liants." },
    { n: "N₂", atoms: [at("N", [-L / 2, 0], [-L / 2 - 200, 0], [180]), at("N", [L / 2, 0], [L / 2 + 200, 0], [0])], bonds: [[0, 1, 3]], text: "Chaque N met en commun ses 3 électrons célibataires : liaison triple N≡N, et un doublet non liant sur chaque N." }
  ];
  let k = 0, t = 0;
  const st = {};
  const order = (m0, i) => m0.bonds.reduce((acc, [x, y, o]) => acc + (x === i || y === i ? o : 0), 0);
  function draw() {
    const m0 = M[k], u = ch9ease(t / 0.7), fade = ch9clamp((t - 0.66) / 0.14), lo = ch9clamp((t - 0.72) / 0.18), lab = ch9clamp((t - 0.88) / 0.12);
    const P = m0.atoms.map((a) => [CX + a.q[0] + (a.p[0] - a.q[0]) * u, CY + a.q[1] + (a.p[1] - a.q[1]) * u]);
    let s = "";
    if (lo > 0) m0.bonds.forEach(([i, j, o]) => { s += ch9bond(P[i][0], P[i][1], P[j][0], P[j][1], o, CH9.chalk, 44, 16, 6, lo); });
    if (fade < 1) m0.bonds.forEach(([i, j, o]) => {
      const A = m0.atoms[i], B = m0.atoms[j], ang = Math.atan2(B.p[1] - A.p[1], B.p[0] - A.p[0]) * 180 / Math.PI;
      const offs = o === 1 ? [0] : o === 2 ? [-13, 13] : [-24, 0, 24];
      offs.forEach((f) => { s += ch9dot(P[i][0], P[i][1], ang, 62, 8, CH9_E[A.s], f, 1 - fade) + ch9dot(P[j][0], P[j][1], ang + 180, 62, 8, CH9_E[B.s], -f, 1 - fade); });
    });
    m0.atoms.forEach((a, i) => {
      a.lp.forEach((g) => { s += ch9dash(P[i][0], P[i][1], g, 62, 40, CH9_E[a.s], 6); });
      s += ch9sym(P[i][0], P[i][1], a.s, CH9.chalk, F);
      if (lab > 0) s += ch9t(P[i][0] + 50, P[i][1] - 56, (2 * a.lp.length + 2 * order(m0, i)) + " e⁻", { size: 30, fill: CH9.t, op: lab });
    });
    let lx = 40;
    [...new Set(m0.atoms.map((a) => a.s))].forEach((e) => { s += `<circle cx="${lx + 10}" cy="562" r="9" fill="${CH9_E[e]}"/>` + ch9t(lx + 28, 571, "électrons de " + e, { size: 24 }); lx += 250; });
    if (lab > 0) s += ch9t(1740, 571, "e⁻ : électrons autour de chaque atome", { size: 24, anchor: "end", fill: CH9.t, op: lab });
    svg.innerHTML = s;
  }
  function say() {
    const m0 = M[k];
    if (!readout) return;
    if (t >= 0.5) {
      const onlyH = m0.atoms.every((a) => a.s === "H");
      const rule = onlyH ? " Chaque H est entouré de 2 électrons : règle du duet respectée." : " Chaque atome est entouré de 8 électrons (2 pour H) : règles du duet et de l'octet respectées.";
      readout.innerHTML = ch9readout("Molécule " + m0.n, m0.text + rule);
    } else {
      const seen = {}, parts = [];
      m0.atoms.forEach((a, i) => { if (seen[a.s]) return; seen[a.s] = 1; parts.push(`${a.s} : ${ch9pw(order(m0, i), "électron célibataire", "électrons célibataires")}`); });
      readout.innerHTML = ch9readout("Avant la liaison", parts.join(" · ") + ". Clique sur « Former ! ».");
    }
  }
  const mb = (cfg.molIds || []).map((id, i) => ch9btn(id, () => { if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; k = i; t = 0; draw(); sync(); }));
  const go = ch9btn(cfg.goId, () => { const to = t >= 0.5 ? 0 : 1; ch9tween(st, t, to, to ? 1500 : 800, (x) => { t = x; draw(); }, sync); });
  function sync() { mb.forEach((b, i) => ch9setBtn(b, i === k)); if (go) go.textContent = t >= 0.5 ? "↺ Séparer" : "⚛️ Former !"; say(); }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* 3. Ions polyatomiques : NH4+ et OH-                                 */
/* ------------------------------------------------------------------ */
function initCh9Ion(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId);
  if (!svg) return;
  const L = 165, F = 96, CX = 560, CY = 300;
  let k = 0, t = 0;
  const st = {};
  const PANEL = [
    { who: "N", rows: [["N isolé", "5 électrons de valence"], ["Dans NH₃ : 1 doublet non liant, 3 liaisons", "2 + 3 = 5 électrons → charge 0"], ["Dans NH₄⁺ : 4 liaisons", "4 électrons → charge 5 − 4 = +1"]] },
    { who: "O", rows: [["O isolé", "6 électrons de valence"], ["Dans H₂O : 2 doublets non liants, 2 liaisons", "4 + 2 = 6 électrons → charge 0"], ["Dans OH⁻ : 3 doublets non liants, 1 liaison", "6 + 1 = 7 électrons → charge 6 − 7 = −1"]] }
  ];
  const TXT = [
    ["NH₃ + H⁺ → NH₄⁺", "Le doublet non liant de N capte un atome d'hydrogène sans son électron (H⁺) et devient un doublet liant. N n'a plus que 4 électrons attribués, contre 5 à l'état isolé : il porte la charge formelle +."],
    ["H₂O → OH⁻ + H⁺", "Un atome d'hydrogène part sans son électron (H⁺) : les deux électrons de la liaison restent sur O et forment un troisième doublet non liant. O a 7 électrons attribués, contre 6 à l'état isolé : il porte la charge formelle −."]
  ];
  function hydrogenPlus(x, y, lacOp, plusOp) {
    return ch9sym(x, y, "H", CH9.chalk, F) + ch9t(x + 40, y - 24, "+", { size: 54, fill: CH9.y, font: CH9.fb, weight: 700, op: plusOp }) + ch9lacune(x, y, 180, 62, CH9.y, lacOp);
  }
  function bracket(x1, y1, x2, y2, ch, op) {
    return `<path d="M${x1 + 22},${y1} H${x1} V${y2} H${x1 + 22} M${x2 - 22},${y1} H${x2} V${y2} H${x2 - 22}" fill="none" stroke="${CH9.chalk}" stroke-width="4"${ch9op(op)}/>` + ch9t(x2 + 10, y1 + 30, ch, { size: 52, fill: CH9.chalk, font: CH9.fb, weight: 700, op });
  }
  function draw() {
    let s = "";
    if (k === 0) {
      const u = ch9ease(t / 0.75), j = ch9clamp((t - 0.68) / 0.16), z = ch9clamp((t - 0.84) / 0.16);
      const Hs = [[CX, CY - L], [CX, CY + L], [CX - L, CY]], hx = CX + 520 + (L - 520) * u;
      Hs.forEach((h) => { s += ch9bond(CX, CY, h[0], h[1], 1, CH9.chalk, 44, 16, 6); });
      s += ch9bond(CX, CY, hx, CY, 1, CH9.chalk, 44, 16, 6, j);
      s += ch9dash(CX, CY, 0, 62, 40, CH9.c, 6, 1 - j);
      if (t < 0.6) s += ch9curve(CX + 66, CY - 30, (CX + hx) / 2, CY - 150, hx - 66, CY - 44, CH9.y, 1 - ch9clamp(t / 0.5));
      Hs.forEach((h) => { s += ch9sym(h[0], h[1], "H", CH9.chalk, F); });
      s += hydrogenPlus(hx, CY, 1 - j, 1 - j);
      s += ch9sym(CX, CY, "N", CH9.chalk, F);
      s += ch9charge(CX - 62, CY - 62, "+", CH9.c, 20, z);
      s += bracket(CX - L - 60, CY - L - 70, CX + L + 60, CY + L + 70, "+", z);
    } else {
      const a = ch9clamp(t / 0.3), u = ch9ease((t - 0.25) / 0.75), pl = ch9clamp((t - 0.35) / 0.2), z = ch9clamp((t - 0.7) / 0.2);
      const hx = CX + L + (520 - L) * u;
      s += ch9bond(CX, CY, CX - L, CY, 1, CH9.chalk, 44, 16, 6);
      s += ch9bond(CX, CY, CX + L, CY, 1, CH9.chalk, 44, 16, 6, 1 - a);
      s += ch9dash(CX, CY, -90, 62, 40, CH9.c, 6) + ch9dash(CX, CY, 90, 62, 40, CH9.c, 6) + ch9dash(CX, CY, 0, 62, 40, CH9.c, 6, a);
      if (t < 0.3) s += ch9curve(CX + L / 2 + 10, CY - 16, CX + L / 2, CY - 100, CX + 54, CY - 46, CH9.y, 1 - a);
      s += ch9sym(CX - L, CY, "H", CH9.chalk, F);
      s += hydrogenPlus(hx, CY, pl, pl);
      s += ch9sym(CX, CY, "O", CH9.chalk, F);
      s += ch9charge(CX + 62, CY - 62, "−", CH9.t, 20, z);
      s += bracket(CX - L - 60, CY - 110, CX + 110, CY + 110, "−", z);
    }
    const P = PANEL[k], fin = ch9clamp((t - 0.8) / 0.2);
    s += `<rect x="1140" y="40" width="610" height="520" rx="20" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>`;
    s += ch9t(1170, 95, "Électrons attribués à " + P.who, { size: 34, fill: CH9.y });
    P.rows.forEach((r, i) => {
      const op = i === 2 ? fin : 1, y = 165 + i * 110;
      s += ch9t(1170, y, r[0], { size: 28, fill: CH9.chalk, op });
      s += ch9t(1170, y + 40, r[1], { size: 26, fill: i === 2 ? CH9.y : CH9.dim, font: CH9.fb, op, weight: i === 2 ? 700 : null });
    });
    s += ch9t(1170, 500, "doublet non liant : 2 électrons · liaison : 1 électron", { size: 22, font: CH9.fb });
    s += ch9t(1170, 534, "charge formelle = valence − électrons attribués", { size: 22, font: CH9.fb });
    svg.innerHTML = s;
  }
  function say() {
    if (!readout) return;
    readout.innerHTML = t >= 0.5 ? ch9readout(TXT[k][0], TXT[k][1]) : ch9readout("État de départ", k === 0 ? "La molécule NH₃ et un ion H⁺ (lacune électronique : il n'a plus d'électron). Clique sur « Former l'ion ! »." : "La molécule H₂O. Clique sur « Former l'ion ! » pour en retirer un ion H⁺.");
  }
  const ib = (cfg.ionIds || []).map((id, i) => ch9btn(id, () => { if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; k = i; t = 0; draw(); sync(); }));
  const go = ch9btn(cfg.goId, () => { const to = t >= 0.5 ? 0 : 1; ch9tween(st, t, to, to ? 1800 : 800, (x) => { t = x; draw(); }, sync); });
  function sync() { ib.forEach((b, i) => ch9setBtn(b, i === k)); if (go) go.textContent = t >= 0.5 ? "↺ Revenir au départ" : "⚛️ Former l'ion !"; say(); }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* 4. Géométrie VSEPR en 3D                                            */
/* ------------------------------------------------------------------ */
function initCh9Geometry(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId);
  if (!svg) return;
  const rad = (a) => a * Math.PI / 180;
  const T = [[0, 1, 0]].concat([0, 120, 240].map((a) => [0.943 * Math.cos(rad(a)), -0.333, 0.943 * Math.sin(rad(a))]));
  const G = [
    { name: "Tétraédrique", ex: "CH₄", c: "C", per: "H", b: T, l: [], ang: "109,5°" },
    { name: "Pyramidale à base triangulaire", ex: "NH₃", c: "N", per: "H", b: T.slice(1), l: [T[0]], ang: "≈ 107°" },
    { name: "Coudée", ex: "H₂O", c: "O", per: "H", b: [[0.816, -0.577, 0], [-0.816, -0.577, 0]], l: [[0, 0.577, 0.816], [0, 0.577, -0.816]], ang: "≈ 104,5°" },
    { name: "Triangulaire", ex: "CO₃²⁻", c: "C", per: "O", b: [[0, 1, 0], [0.866, -0.5, 0], [-0.866, -0.5, 0]], l: [], ang: "120°" },
    { name: "Coudée", ex: "O₃", c: "O", per: "O", b: [[0.866, -0.5, 0], [-0.866, -0.5, 0]], l: [[0, 1, 0]], ang: "≈ 117°" },
    { name: "Linéaire", ex: "CO₂", c: "C", per: "O", b: [[1, 0, 0], [-1, 0, 0]], l: [], ang: "180°" }
  ];
  const LL = 115, c30 = 0.866 * LL, s30 = 0.5 * LL;
  const A = (s, x, y, lp, ch) => ({ s, x, y, lp, ch });
  const LW = [
    { atoms: [A("C", 0, 0), A("H", 0, -LL), A("H", LL, 0), A("H", 0, LL), A("H", -LL, 0)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
    { atoms: [A("N", 0, 0, [-90]), A("H", LL, 0), A("H", 0, LL), A("H", -LL, 0)], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
    { atoms: [A("O", 0, 0, [-90, 90]), A("H", -LL, 0), A("H", LL, 0)], bonds: [[0, 1, 1], [0, 2, 1]] },
    { atoms: [A("C", 0, 0), A("O", 0, -LL, [180, 0]), A("O", c30, s30, [-60, 30, 120], { s: "−", a: 75 }), A("O", -c30, s30, [60, 150, 240], { s: "−", a: 105 })], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1]] },
    { atoms: [A("O", 0, 0, [-90], { s: "+", a: -30 }), A("O", -c30, s30, [60, 240]), A("O", c30, s30, [-60, 30, 120], { s: "−", a: 75 })], bonds: [[0, 1, 2], [0, 2, 1]] },
    { atoms: [A("C", 0, 0), A("O", -LL, 0, [-90, 90]), A("O", LL, 0, [-90, 90])], bonds: [[0, 1, 2], [0, 2, 2]] }
  ];
  const TXT = [
    "4 doublets liants autour de C : ils s'écartent au maximum, vers les sommets d'un tétraèdre.",
    "4 doublets autour de N, dont 1 non liant. Ce doublet occupe un sommet du tétraèdre, mais la géométrie décrit la position des atomes : N et les 3 H forment une pyramide à base triangulaire.",
    "4 doublets autour de O, dont 2 non liants. Les atomes H, O et H ne sont pas alignés : la molécule est coudée.",
    "3 directions autour de C (une liaison double compte pour une seule direction) : elles s'écartent à 120°, dans un plan.",
    "3 directions autour de l'atome O central, dont 1 doublet non liant : les trois atomes O forment une molécule coudée.",
    "2 directions autour de C (chaque liaison double compte pour une seule direction) : elles s'écartent à 180°, la molécule est linéaire."
  ];
  const CX = 520, CY = 300, R = 205;
  let th = 0.5, ph = 0.35, playing = true, idx = 0, drag = null, dirty = true, raf = 0;
  svg.innerHTML = "<g></g><g></g>";
  const gs = svg.children[0], gd = svg.children[1];
  svg.style.touchAction = "none";
  svg.style.cursor = "grab";
  function rot(v) {
    const ct = Math.cos(th), stt = Math.sin(th), cp = Math.cos(ph), sp = Math.sin(ph);
    const x1 = v[0] * ct + v[2] * stt, z1 = -v[0] * stt + v[2] * ct;
    return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
  }
  function sphere(x, y, r, s) {
    return `<circle cx="${ch9f(x)}" cy="${ch9f(y)}" r="${ch9f(r)}" fill="${CH9_3D[s]}" stroke="#16261f" stroke-width="3"/>` +
      `<circle cx="${ch9f(x - r * 0.35)}" cy="${ch9f(y - r * 0.38)}" r="${ch9f(r * 0.28)}" fill="#ffffff" opacity="0.28"/>` +
      ch9t(x, y + r * 0.33, s, { anchor: "middle", size: Math.round(r * 0.9), fill: CH9.board, font: CH9.fb, weight: 700 });
  }
  function staticPart() {
    const g = G[idx];
    let m = `<rect x="1100" y="10" width="660" height="580" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>`;
    m += ch9t(1130, 62, "Schéma de Lewis de " + g.ex, { size: 30 });
    m += ch9lewis(LW[idx], 64, 1430, 245);
    m += ch9t(1430, 455, g.name, { anchor: "middle", size: g.name.length > 20 ? 36 : 48, fill: CH9.y });
    m += ch9t(1430, 515, `${ch9pw(g.b.length, "atome lié", "atomes liés")} · ${ch9pw(g.l.length, "doublet non liant", "doublets non liants")}`, { anchor: "middle", size: 27, fill: CH9.chalk, font: CH9.fb });
    m += ch9t(1430, 560, "angle entre deux liaisons : " + g.ang, { anchor: "middle", size: 25, font: CH9.fb });
    m += ch9t(40, 585, "glisser pour faire tourner la molécule", { size: 24 });
    gs.innerHTML = m;
  }
  function draw3d() {
    const g = G[idx], items = [];
    g.b.forEach((v) => items.push({ k: "b", p: rot(v) }));
    g.l.forEach((v) => items.push({ k: "l", p: rot(v) }));
    items.forEach((it) => { it.z = it.p[2]; });
    items.push({ k: "c", z: 0 });
    items.sort((a, b) => a.z - b.z);
    let s = "";
    items.forEach((it) => {
      if (it.k === "c") { s += sphere(CX, CY, 54, g.c); return; }
      const px = it.p[0], py = -it.p[1], sc = 1 + 0.16 * it.p[2];
      if (it.k === "b") {
        const X = CX + R * px, Y = CY + R * py;
        s += `<line x1="${CX}" y1="${CY}" x2="${ch9f(X)}" y2="${ch9f(Y)}" stroke="#8c8678" stroke-width="${ch9f(14 * sc)}" stroke-linecap="round"/>`;
        s += sphere(X, Y, (g.per === "H" ? 40 : 50) * sc, g.per);
      } else {
        const pl = Math.hypot(px, py), ang = Math.atan2(py, px) * 180 / Math.PI;
        const ex = CX + px * R * 0.55, ey = CY + py * R * 0.55, rx = Math.max(R * 0.4 * pl, R * 0.27), ry = R * 0.27;
        s += `<ellipse cx="${ch9f(ex)}" cy="${ch9f(ey)}" rx="${ch9f(rx)}" ry="${ch9f(ry)}" transform="rotate(${ch9f(ang)} ${ch9f(ex)} ${ch9f(ey)})" fill="rgba(232,196,104,0.20)" stroke="rgba(232,196,104,0.75)" stroke-width="3"/>`;
        const qa = (ang + 90) * Math.PI / 180;
        s += `<circle cx="${ch9f(ex + 12 * Math.cos(qa))}" cy="${ch9f(ey + 12 * Math.sin(qa))}" r="7" fill="${CH9.y}"/><circle cx="${ch9f(ex - 12 * Math.cos(qa))}" cy="${ch9f(ey - 12 * Math.sin(qa))}" r="7" fill="${CH9.y}"/>`;
      }
    });
    if (g.l.length) s += `<ellipse cx="60" cy="40" rx="20" ry="13" fill="rgba(232,196,104,0.20)" stroke="rgba(232,196,104,0.75)" stroke-width="3"/>` + ch9t(94, 49, "doublet non liant", { size: 26 });
    gd.innerHTML = s;
    dirty = false;
  }
  function loop() {
    if (!svg.isConnected) return;
    raf = requestAnimationFrame(loop);
    if (!svg.getBoundingClientRect().width) return;
    if (playing && !drag) { th += 0.007; dirty = true; }
    if (dirty) draw3d();
  }
  svg.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY, th, ph }; svg.style.cursor = "grabbing"; try { svg.setPointerCapture(e.pointerId); } catch (_) {} });
  svg.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const sc = 1780 / (svg.getBoundingClientRect().width || 1780);
    th = drag.th + (e.clientX - drag.x) * sc * 0.008;
    ph = Math.max(-1.3, Math.min(1.3, drag.ph + (e.clientY - drag.y) * sc * 0.008));
    dirty = true;
  });
  const end = () => { drag = null; svg.style.cursor = "grab"; };
  svg.addEventListener("pointerup", end);
  svg.addEventListener("pointercancel", end);
  const play = ch9btn(cfg.playId, () => { playing = !playing; syncPlay(); });
  function syncPlay() { if (play) play.textContent = playing ? "⏸ Pause" : "▶ Faire tourner"; }
  const gb = (cfg.geoIds || []).map((id, i) => ch9btn(id, () => { idx = i; sync(); }));
  function sync() {
    gb.forEach((b, i) => ch9setBtn(b, i === idx));
    staticPart(); dirty = true; draw3d();
    if (readout) readout.innerHTML = ch9readout(`${G[idx].name} — ${G[idx].ex}`, TXT[idx]);
  }
  sync(); syncPlay();
  raf = requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ */
/* 5. Polarité d'une liaison                                           */
/* ------------------------------------------------------------------ */
function initCh9BondPolarity(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId);
  if (!svg) return;
  const uid = "ch9cl" + (++CH9_UID);
  const EN = [["H", 1, 1, 2.2], ["Li", 2, 1, 1.0], ["Be", 2, 2, 1.6], ["B", 2, 13, 2.0], ["C", 2, 14, 2.6], ["N", 2, 15, 3.0], ["O", 2, 16, 3.4], ["F", 2, 17, 4.0],
    ["Na", 3, 1, 0.9], ["Mg", 3, 2, 1.3], ["Al", 3, 13, 1.6], ["Si", 3, 14, 1.9], ["P", 3, 15, 2.2], ["S", 3, 16, 2.6], ["Cl", 3, 17, 3.2]].map(([s, p, g, x]) => ({ s, p, g, x }));
  const COLS = [1, 2, 13, 14, 15, 16, 17], TX = 130, TY = 100, CW = 100, GP = 8;
  const X0 = 1310, Y0 = 200, XA = 1140, XB = 1480, GX0 = 1080, GX1 = 1740, GMAX = 3.2, Y_G = 430;
  const gx = (v) => GX0 + (GX1 - GX0) * Math.min(v, GMAX) / GMAX;
  let a = EN.find((e) => e.s === "H"), b = EN.find((e) => e.s === "Cl"), sh = 0, fr = 1;
  const st = {};
  const dchi = () => (b ? Math.round(Math.abs(a.x - b.x) * 10) / 10 : 0);
  const target = () => (b ? Math.sign(b.x - a.x) * (dchi() / 3.1) * 150 : 0);
  function draw() {
    let m = `<defs><radialGradient id="${uid}"><stop offset="0" stop-color="#e8c468" stop-opacity="0.42"/><stop offset="1" stop-color="#e8c468" stop-opacity="0"/></radialGradient></defs>`;
    EN.forEach((e) => {
      const x = TX + COLS.indexOf(e.g) * (CW + GP), y = TY + (e.p - 1) * (CW + GP);
      const isA = e === a, isB = e === b;
      const stroke = isA && isB ? CH9.y : isA ? CH9.t : isB ? CH9.c : "rgba(242,237,225,0.28)";
      m += `<g data-sym="${e.s}" style="cursor:pointer"><rect x="${x}" y="${y}" width="${CW}" height="${CW}" rx="12" fill="rgba(232,196,104,${(0.04 + 0.3 * (e.x - 0.9) / 3.1).toFixed(3)})" stroke="${stroke}" stroke-width="${isA || isB ? 6 : 2}"/>`;
      m += ch9t(x + CW / 2, y + 52, e.s, { anchor: "middle", size: 40, fill: CH9.chalk, weight: 700 });
      m += ch9t(x + CW / 2, y + 86, ch9num(e.x), { anchor: "middle", size: 24, fill: CH9.dim, font: CH9.fb }) + `</g>`;
    });
    const right = TX + 7 * (CW + GP) - GP;
    m += ch9arrow(TX, 460, right, 460, CH9.dim, 4, 22) + ch9t((TX + right) / 2, 500, "χ augmente", { anchor: "middle", size: 28 });
    m += ch9arrow(80, TY + 3 * (CW + GP) - GP, 80, TY, CH9.dim, 4, 22) + `<text x="52" y="${TY + 160}" font-size="28" fill="${CH9.dim}" font-family="${CH9.fh}" text-anchor="middle" transform="rotate(-90 52 ${TY + 160})">χ augmente</text>`;
    m += ch9t(TX, 560, "Clique deux éléments pour former une liaison.", { size: 26, fill: CH9.chalk });
    if (!b) {
      m += ch9sym(XA, Y0, a.s, CH9.t, 96) + ch9t(XA, Y0 + 105, "χ = " + ch9num(a.x), { anchor: "middle", size: 28 });
      m += ch9t(XB - 40, Y0 + 12, "choisis un second atome", { anchor: "middle", size: 32 });
    } else {
      const d = dchi(), pol = d >= 0.5, less = a.x <= b.x ? [a, XA] : [b, XB], more = a.x <= b.x ? [b, XB] : [a, XA];
      m += `<ellipse cx="${ch9f(X0 + sh)}" cy="${Y0}" rx="230" ry="78" fill="url(#${uid})"/>`;
      m += `<line x1="${XA + 64}" y1="${Y0}" x2="${XB - 64}" y2="${Y0}" stroke="${CH9.chalk}" stroke-width="6" stroke-linecap="round"/>`;
      m += `<circle cx="${ch9f(X0 + sh - 15)}" cy="${Y0}" r="10" fill="${CH9.y}" stroke="${CH9.board}" stroke-width="3"/><circle cx="${ch9f(X0 + sh + 15)}" cy="${Y0}" r="10" fill="${CH9.y}" stroke="${CH9.board}" stroke-width="3"/>`;
      m += ch9t(X0 + sh, Y0 + 52, "doublet liant", { anchor: "middle", size: 24, fill: CH9.y });
      m += ch9sym(XA, Y0, a.s, CH9.t, 96) + ch9sym(XB, Y0, b.s, CH9.c, 96);
      m += ch9t(XA, Y0 + 105, "χ = " + ch9num(a.x), { anchor: "middle", size: 28 }) + ch9t(XB, Y0 + 105, "χ = " + ch9num(b.x), { anchor: "middle", size: 28 });
      if (pol) m += ch9t(less[1], Y0 - 84, "+q", { anchor: "middle", size: 46, fill: CH9.c, op: fr }) + ch9t(more[1], Y0 - 84, "−q", { anchor: "middle", size: 46, fill: CH9.t, op: fr });
      m += ch9t(GX0, Y_G - 60, "Différence d'électronégativité Δχ", { size: 26 });
      const th = gx(0.5);
      m += `<rect x="${GX0}" y="${Y_G - 8}" width="${ch9f(th - GX0)}" height="16" rx="4" fill="${CH9.t}" opacity="0.55"/><rect x="${ch9f(th)}" y="${Y_G - 8}" width="${ch9f(GX1 - th)}" height="16" rx="4" fill="${CH9.c}" opacity="0.55"/>`;
      m += ch9t(th - 10, Y_G - 20, "non polarisée", { anchor: "end", size: 24, fill: CH9.t }) + ch9t(th + 10, Y_G - 20, "polarisée", { size: 24, fill: CH9.c });
      m += ch9t(GX0, Y_G + 40, "0", { anchor: "middle", size: 24, font: CH9.fb }) + ch9t(th, Y_G + 40, "0,5", { anchor: "middle", size: 24, font: CH9.fb, fill: CH9.y }) + ch9t(GX1, Y_G + 40, "3", { anchor: "middle", size: 24, font: CH9.fb });
      const mx = gx(d * fr);
      m += `<polygon points="${ch9f(mx)},${Y_G + 10} ${ch9f(mx - 13)},${Y_G + 32} ${ch9f(mx + 13)},${Y_G + 32}" fill="${CH9.y}"/>`;
      m += ch9t(Math.max(GX0 + 90, Math.min(GX1 - 90, mx)), Y_G + 92, "Δχ = " + ch9num(d), { anchor: "middle", size: 40, fill: CH9.y });
    }
    svg.innerHTML = m;
  }
  function say() {
    if (!readout) return;
    if (!b) { readout.innerHTML = ch9readout(`${a.s} sélectionné (χ = ${ch9num(a.x)})`, "Choisis un second élément pour former la liaison."); return; }
    const d = dchi(), less = a.x <= b.x ? a : b, more = a.x <= b.x ? b : a;
    if (d >= 0.5) readout.innerHTML = ch9readout(`Δχ = ${ch9num(d)} ≥ 0,5 : liaison polarisée`, `${more.s} est plus électronégatif que ${less.s} : il attire davantage le doublet liant. ${more.s} porte la charge partielle −q, ${less.s} la charge partielle +q.`, CH9.c);
    else readout.innerHTML = ch9readout(`Δχ = ${ch9num(d)} < 0,5 : liaison non polarisée`, d === 0 ? "Les deux atomes ont la même électronégativité : le doublet liant est partagé équitablement." : "Électronégativités très proches : le doublet liant est considéré comme partagé équitablement, pas de charge partielle.", CH9.t);
  }
  svg.addEventListener("click", (ev) => {
    const g = ev.target.closest && ev.target.closest("[data-sym]");
    if (!g) return;
    const el = EN.find((e) => e.s === g.getAttribute("data-sym"));
    if (b) { a = el; b = null; sh = 0; draw(); say(); return; }
    b = el;
    const to = target();
    say();
    ch9tween(st, 0, 1, 700, (x) => { fr = ch9ease(x); sh = to * fr; draw(); });
  });
  sh = target(); fr = 1;
  draw(); say();
}

/* ------------------------------------------------------------------ */
/* 6. Polarité d'une molécule : CO2 et H2O                             */
/* ------------------------------------------------------------------ */
function initCh9MolPolarity(cfg) {
  const svg = ch9$(cfg.svgId), readout = ch9$(cfg.readoutId), stepEl = ch9$(cfg.stepId);
  if (!svg) return;
  const GEO = [
    { name: "CO₂", atoms: [["O", 380, 300, 54, -1], ["C", 620, 300, 54, 1], ["O", 860, 300, 54, -1]], q: ["−q", "+2q", "−q"], ql: [-1, -1, -1], bonds: [[1, 0, 2], [1, 2, 2]], lp: [[0, [-90, 90]], [2, [-90, 90]]], vec: [[1, 0, [0, 1]], [1, 2, [0, 1]]], gp: [620, 300], gm: [620, 300] },
    { name: "H₂O", atoms: [["O", 620, 230, 56, -1], ["H", 425, 380, 42, 1], ["H", 815, 380, 42, 1]], q: ["−2q", "+q", "+q"], ql: [-1, 1, 1], bonds: [[0, 1, 1], [0, 2, 1]], lp: [[0, [-135, -45]]], vec: [[1, 0, [-0.61, -0.793]], [2, 0, [0.61, -0.793]]], gp: [620, 380], gm: [620, 230] }
  ];
  const TXT = [
    [["CO₂ : molécule linéaire", "Deux liaisons doubles C=O, alignées de part et d'autre de l'atome de carbone."],
     ["Les charges partielles", "χ(O) = 3,4 > χ(C) = 2,6 : chaque liaison C=O est polarisée. Chaque O porte −q, C porte +2q."],
     ["Un vecteur par liaison polarisée", "Chaque vecteur va de la charge + vers la charge −. Ici, les deux vecteurs sont opposés et de même longueur : leur somme est nulle."],
     ["Positions moyennes des charges", "G⁺ (charges +) et G⁻ (charges −) sont tous deux au centre de la molécule : ils sont confondus. CO₂ est <strong style=\"color:#6bbfab\">apolaire</strong>."]],
    [["H₂O : molécule coudée", "Deux liaisons O–H et deux doublets non liants sur O : les trois atomes ne sont pas alignés."],
     ["Les charges partielles", "χ(O) = 3,4 > χ(H) = 2,2 : chaque liaison O–H est polarisée. Chaque H porte +q, O porte −2q."],
     ["Un vecteur par liaison polarisée", "Chaque vecteur va de la charge + vers la charge −. Les deux vecteurs ne sont pas opposés : leur somme n'est pas nulle."],
     ["Positions moyennes des charges", "G⁺ est au milieu des deux H, G⁻ sur O : ils ne sont pas confondus. H₂O est <strong style=\"color:#d97a63\">polaire</strong>."]]
  ];
  let mode = 0, step = 1, p = 1;
  const st = {};
  function vecSym(x1, y1, x2, y2, col, w, op) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L < 2) return "";
    const px = -dy / L * 13, py = dx / L * 13;
    return ch9arrow(x1, y1, x2, y2, col, w, 22, op) + `<line x1="${ch9f(x1 - px)}" y1="${ch9f(y1 - py)}" x2="${ch9f(x1 + px)}" y2="${ch9f(y1 + py)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${ch9op(op)}/>`;
  }
  function draw() {
    const g = GEO[mode], P = (k) => (k < step ? 1 : k === step ? p : 0), p2 = P(2), p3 = P(3), p4 = P(4);
    let s = "";
    g.bonds.forEach(([i, j, o]) => { const A = g.atoms[i], B = g.atoms[j]; s += ch9bond(A[1], A[2], B[1], B[2], o, "#8c8678", A[3] - 4, 18, 7); });
    g.lp.forEach(([i, angs]) => { const A = g.atoms[i]; angs.forEach((a) => { s += ch9dash(A[1], A[2], a, A[3] + 26, 40, CH9.dim, 6); }); });
    if (p3 > 0) g.vec.forEach(([i, j, n]) => {
      const A = g.atoms[i], B = g.atoms[j], dx = B[1] - A[1], dy = B[2] - A[2], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, off = 52;
      const x1 = A[1] + ux * (A[3] + 6) + n[0] * off, y1 = A[2] + uy * (A[3] + 6) + n[1] * off, f = ch9ease(p3 / 0.35), len = (L - A[3] - B[3] - 16) * f;
      s += vecSym(x1, y1, x1 + ux * len, y1 + uy * len, CH9.y, 5);
    });
    g.atoms.forEach((A, i) => {
      s += `<circle cx="${A[1]}" cy="${A[2]}" r="${A[3]}" fill="${CH9.b2}" stroke="${CH9.chalk}" stroke-width="3"/>`;
      if (p2 > 0) s += `<circle cx="${A[1]}" cy="${A[2]}" r="${A[3]}" fill="none" stroke="${A[4] > 0 ? CH9.c : CH9.t}" stroke-width="7"${ch9op(p2)}/>`;
      s += ch9t(A[1], A[2] + 16, A[0], { anchor: "middle", size: 46, fill: CH9.chalk, font: CH9.fb, weight: 700 });
      if (p2 > 0) s += ch9t(A[1], A[2] + (g.ql[i] < 0 ? -A[3] - 26 : A[3] + 56), g.q[i], { anchor: "middle", size: 40, fill: A[4] > 0 ? CH9.c : CH9.t, op: p2 });
    });
    if (p4 > 0) {
      if (mode === 0) {
        s += `<circle cx="${g.gp[0]}" cy="${g.gp[1]}" r="22" fill="none" stroke="${CH9.t}" stroke-width="5"${ch9op(p4)}/><circle cx="${g.gp[0]}" cy="${g.gp[1]}" r="10" fill="${CH9.c}"${ch9op(p4)}/>`;
        s += ch9t(g.gp[0], 460, "G⁺ et G⁻ confondus", { anchor: "middle", size: 36, fill: CH9.y, op: p4 });
      } else {
        s += `<line x1="${g.gp[0]}" y1="${g.gp[1]}" x2="${g.gm[0]}" y2="${g.gm[1]}" stroke="${CH9.y}" stroke-width="4" stroke-dasharray="10 9"${ch9op(p4)}/>`;
        s += `<circle cx="${g.gp[0]}" cy="${g.gp[1]}" r="12" fill="${CH9.c}"${ch9op(p4)}/><circle cx="${g.gm[0]}" cy="${g.gm[1]}" r="12" fill="${CH9.t}" stroke="${CH9.board}" stroke-width="3"${ch9op(p4)}/>`;
        s += ch9t(g.gp[0] + 24, g.gp[1] + 14, "G⁺", { size: 40, fill: CH9.c, op: p4 }) + ch9t(g.gm[0] + 70, g.gm[1] + 14, "G⁻", { size: 40, fill: CH9.t, op: p4 });
      }
      s += ch9t(60, 572, mode === 0 ? "molécule apolaire" : "molécule polaire", { size: 54, fill: mode === 0 ? CH9.t : CH9.c, op: p4 });
    }
    if (p3 > 0) {
      const f1 = ch9ease((p3 - 0.3) / 0.3), f2 = ch9ease((p3 - 0.55) / 0.3), f3 = ch9ease((p3 - 0.82) / 0.18), S = 180;
      s += `<g${ch9op(ch9clamp(p3 / 0.3))}><rect x="1110" y="20" width="650" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>` + ch9t(1140, 74, "Somme des deux vecteurs", { size: 32 }) + `</g>`;
      if (mode === 0) {
        const ox = 1435, oy = 300;
        if (f1 > 0) s += vecSym(ox, oy - 14, ox - S * f1, oy - 14, CH9.y, 5);
        if (f2 > 0) s += `<line x1="${ox - S}" y1="${oy - 14}" x2="${ox - S}" y2="${oy + 14}" stroke="${CH9.dim}" stroke-width="2" stroke-dasharray="4 4"/>` + vecSym(ox - S, oy + 14, ox - S + S * f2, oy + 14, CH9.y, 5);
        if (f3 > 0) s += `<circle cx="${ox}" cy="${oy}" r="12" fill="none" stroke="${CH9.t}" stroke-width="5"${ch9op(f3)}/>` + ch9t(ox, oy + 110, "somme = vecteur nul", { anchor: "middle", size: 40, fill: CH9.t, op: f3 });
      } else {
        const ox = 1435, oy = 500, va = [0.793 * S, -0.61 * S], vb = [-0.793 * S, -0.61 * S];
        if (f1 > 0) s += vecSym(ox, oy, ox + va[0] * f1, oy + va[1] * f1, CH9.y, 5);
        if (f2 > 0) s += vecSym(ox + va[0], oy + va[1], ox + va[0] + vb[0] * f2, oy + va[1] + vb[1] * f2, CH9.y, 5);
        if (f3 > 0) s += ch9arrow(ox, oy, ox, oy + (va[1] + vb[1]) * f3, CH9.c, 9, 28) + ch9t(ox, 160, "somme non nulle", { anchor: "middle", size: 40, fill: CH9.c, op: f3 });
      }
    }
    svg.innerHTML = s;
  }
  const mb = (cfg.molIds || []).map((id, i) => ch9btn(id, () => { mode = i; step = 1; p = 1; if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; draw(); sync(); }));
  const prev = ch9btn(cfg.prevId, () => { if (step > 1) { if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; step--; p = 1; draw(); sync(); } });
  const next = ch9btn(cfg.nextId, () => { if (step < 4) { step++; p = 0; sync(); ch9tween(st, 0, 1, step === 3 ? 1800 : 700, (x) => { p = x; draw(); }); } });
  function sync() {
    mb.forEach((b, i) => ch9setBtn(b, i === mode));
    if (prev) prev.disabled = step === 1;
    if (next) next.disabled = step === 4;
    if (stepEl) stepEl.textContent = `Étape ${step} / 4`;
    if (readout) { const T = TXT[mode][step - 1]; readout.innerHTML = ch9readout(T[0], T[1]); }
  }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh9Stages() {
  document.querySelectorAll(".ch9-stage").forEach((outer) => {
    const inner = outer.firstElementChild;
    if (!inner || outer.__fit) return;
    outer.__fit = true;
    let lastS = -1, lastH = -1;
    const fit = () => {
      const s = outer.clientWidth / 1780;
      if (!s) return;
      const hgt = Math.round(inner.offsetHeight * s);
      if (s !== lastS) { lastS = s; inner.style.transform = "scale(" + s + ")"; }
      if (hgt !== lastH) { lastH = hgt; outer.style.height = hgt + "px"; }
    };
    new ResizeObserver(fit).observe(inner);
    fit();
    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    document.querySelectorAll(".mode-tab").forEach((b) => b.addEventListener("click", () => setTimeout(fit, 0)));
  });
}
