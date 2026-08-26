/* Animations du chapitre 9 — 1ère spé PC */

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
