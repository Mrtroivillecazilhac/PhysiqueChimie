/* Animations du chapitre 1 — 4ème — "Constitution de la matière"
   Une animation par sous-partie (a à g). */

/* ---------- a. Les états de la matière (macroscopique + microscopique) ---------- */
function initStatesOfMatter(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const STATES = {
    solide: {
      name: "Solide", color: "#5a96d2",
      forme: "a une forme propre", volume: "a un volume propre", compress: "incompressible",
      particles: "fixes les unes par rapport aux autres, très proches"
    },
    liquide: {
      name: "Liquide", color: "var(--teal)",
      forme: "n'a pas de forme propre (prend celle du récipient)", volume: "a un volume propre", compress: "incompressible",
      particles: "proches, mais peuvent se déplacer les unes par rapport aux autres"
    },
    gaz: {
      name: "Gaz", color: "var(--coral)",
      forme: "n'a pas de forme propre", volume: "n'a pas de volume propre (occupe tout l'espace)", compress: "compressible",
      particles: "éloignées les unes des autres et se déplacent dans tout l'espace disponible"
    }
  };
  const keys = ["solide", "liquide", "gaz"];
  let current = "solide";

  // grille de positions fixes pour les particules (réutilisée, juste réinterprétée selon l'état)
  const GRID = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) GRID.push([col, row]);
  const SCATTER = generateDotsInEllipse(16, 0, 0, 1, 1);

  function draw() {
    const st = STATES[current];
    const boxX = 15, boxY = 15, boxW = 90, boxH = 90;
    let s = `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<text x="${boxX + boxW / 2}" y="${boxY - 5}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">échelle macroscopique</text>`;

    if (current === "solide") {
      s += `<rect x="${boxX + 20}" y="${boxY + 20}" width="50" height="50" fill="${st.color}" opacity="0.5" stroke="${st.color}" stroke-width="2"/>`;
    } else if (current === "liquide") {
      s += `<path d="M${boxX} ${boxY + 45} L${boxX} ${boxY + boxH} L${boxX + boxW} ${boxY + boxH} L${boxX + boxW} ${boxY + 45} Z" fill="${st.color}" opacity="0.4"/>`;
      s += `<line x1="${boxX}" y1="${boxY + 45}" x2="${boxX + boxW}" y2="${boxY + 45}" stroke="${st.color}" stroke-width="1.5"/>`;
    } else {
      s += `<rect x="${boxX + 2}" y="${boxY + 2}" width="${boxW - 4}" height="${boxH - 4}" fill="${st.color}" opacity="0.12"/>`;
    }

    // vignette microscopique
    const mbx = 130, mby = 15, mbw = 90, mbh = 90;
    s += `<rect x="${mbx}" y="${mby}" width="${mbw}" height="${mbh}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<text x="${mbx + mbw / 2}" y="${mby - 5}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">échelle microscopique</text>`;

    if (current === "solide") {
      GRID.forEach(([col, row]) => {
        const x = mbx + 12 + col * 22, y = mby + 12 + row * 22;
        s += `<circle cx="${x}" cy="${y}" r="6" fill="${st.color}"/>`;
      });
    } else if (current === "liquide") {
      GRID.forEach(([col, row], i) => {
        const jitterX = (i % 3 - 1) * 3, jitterY = (Math.floor(i / 3) % 3 - 1) * 3;
        const x = mbx + 12 + col * 22 + jitterX, y = mby + 12 + row * 22 + jitterY;
        s += `<circle cx="${x}" cy="${y}" r="6" fill="${st.color}"/>`;
      });
    } else {
      SCATTER.forEach(([u, v]) => {
        const x = mbx + mbw / 2 + u * (mbw / 2 - 8), y = mby + mbh / 2 + v * (mbh / 2 - 8);
        s += `<circle cx="${x}" cy="${y}" r="5" fill="${st.color}"/>`;
      });
    }
    svg.innerHTML = s;

    readout.innerHTML = `<strong style="color:${st.color}">${st.name}</strong> : les particules sont <strong>${st.particles}</strong>.<br>Conséquences : ${st.name.toLowerCase() === "solide" ? "il" : "il"} <strong>${st.forme}</strong> et <strong>${st.volume}</strong> (${st.compress}).`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- b. Corps purs et mélanges ---------- */
function initPureOrMixtureParticles(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPure = document.getElementById(cfg.btnPureId);
  const btnMix = document.getElementById(cfg.btnMixId);

  let mode = "pure";
  const POS = generateDotsInEllipse(20, 0, 0, 1, 1);

  function shape(kind, x, y, color) {
    if (kind === 0) return `<circle cx="${x}" cy="${y}" r="6" fill="${color}"/>`;
    if (kind === 1) return `<polygon points="${x},${y - 7} ${x - 6},${y + 5} ${x + 6},${y + 5}" fill="${color}"/>`;
    return `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="${color}"/>`;
  }

  function draw() {
    const cx = 110, cy = 80, r = 70;
    let s = `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    const colors = ["var(--teal)", "var(--coral)", "var(--yellow)"];
    POS.forEach(([u, v], i) => {
      const x = cx + u * (r - 12), y = cy + v * (r - 12);
      if (mode === "pure") {
        s += shape(0, x, y, "var(--teal)");
      } else {
        s += shape(i % 3, x, y, colors[i % 3]);
      }
    });
    svg.innerHTML = s;

    readout.textContent = mode === "pure"
      ? "Corps pur : à l'échelle microscopique, les particules qui le constituent sont toutes identiques (même forme)."
      : "Mélange : à l'échelle microscopique, les particules qui le constituent sont différentes (formes différentes).";
  }
  btnPure.addEventListener("click", () => { mode = "pure"; draw(); });
  btnMix.addEventListener("click", () => { mode = "mix"; draw(); });
  draw();
}

/* ---------- c. Changements d'état : masse et volume ---------- */
function initStateChangeMassVolume(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const progressRange = document.getElementById(cfg.progressRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MASS_FIXED = 82.3; // g, comme l'exemple du manuel — ne change jamais

  function draw() {
    const p = Number(progressRange.value) / 100; // 0 = tout solide, 1 = tout liquide
    const x0 = 60, x1 = 160, yTop = 20, yBase = 130;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;

    // le volume occupé DIMINUE progressivement (glace -> eau, plus compact)
    const fillHSolid = 80, fillHLiquid = 60; // le liquide occupe moins de hauteur que le solide (comme la glace qui fond)
    const fillH = fillHSolid + (fillHLiquid - fillHSolid) * p;
    const colorSolid = "#5a96d2", colorLiquid = "var(--teal)";

    if (p < 1) {
      // glaçons flottants (proportion décroissante)
      const nCubes = Math.max(0, Math.round(4 * (1 - p)));
      for (let i = 0; i < nCubes; i++) {
        const cx = x0 + 20 + i * 22;
        s += `<rect x="${cx}" y="${yBase - fillH - 5}" width="16" height="16" fill="${colorSolid}" opacity="0.8"/>`;
      }
    }
    s += `<rect x="${x0 + 3}" y="${yBase - fillH}" width="${x1 - x0 - 6}" height="${fillH - 3}" fill="${colorLiquid}" opacity="0.35"/>`;

    // balance numérique, valeur TOUJOURS identique
    s += `<rect x="${(x0 + x1) / 2 - 25}" y="${yBase + 10}" width="50" height="18" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yBase + 23}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">${MASS_FIXED} g</text>`;

    svg.innerHTML = s;

    const label = p < 0.15 ? "solide" : p > 0.85 ? "liquide" : "solide + liquide";
    readout.innerHTML = `État : <strong style="color:var(--yellow)">${label}</strong>. La masse reste <strong style="color:var(--yellow)">${MASS_FIXED} g</strong> tout au long de la fusion (le nombre de particules ne change pas), mais le <strong style="color:var(--teal)">volume diminue</strong> : la distance entre les particules change.`;
  }
  progressRange.addEventListener("input", draw);
  draw();
}

/* ---------- d. Changements d'état et température ---------- */
function initStateChangeTemperature(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPure = document.getElementById(cfg.btnPureId);
  const btnMix = document.getElementById(cfg.btnMixId);

  let mode = "pure";

  function draw() {
    const x0 = 25, y0 = 15, x1 = 210, y1 = 130;
    let s = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${y1 + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">durée de chauffage</text>`;
    s += `<text x="${x0 - 12}" y="${y0 - 4}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">T</text>`;

    let path;
    if (mode === "pure") {
      const platY = y0 + 65, platX1 = x0 + 55, platX2 = x0 + 115;
      path = `M${x0 + 10} ${y0 + 15} L${platX1} ${platY} L${platX2} ${platY} L${x1 - 15} ${y0 + 20}`;
      s += `<line x1="${platX1}" y1="${platY - 8}" x2="${platX2}" y2="${platY - 8}" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="3,3"/>`;
      s += `<text x="${(platX1 + platX2) / 2}" y="${platY - 14}" font-size="7.5" fill="var(--yellow)" text-anchor="middle">palier (changement d'état)</text>`;
      s += `<text x="${(x0 + 10 + platX1) / 2}" y="${y0 + 8}" font-size="8" fill="var(--chalk)" text-anchor="middle">solide</text>`;
      s += `<text x="${(platX2 + x1 - 15) / 2}" y="${y0 + 12}" font-size="8" fill="var(--chalk)" text-anchor="middle">gaz</text>`;
    } else {
      path = `M${x0 + 10} ${y0 + 15} L${x0 + 60} ${y0 + 45} Q${x0 + 100} ${y0 + 60} ${x0 + 130} ${y0 + 75} L${x1 - 15} ${y0 + 100}`;
    }
    s += `<path d="${path}" fill="none" stroke="${mode === "pure" ? "var(--teal)" : "var(--coral)"}" stroke-width="2.5"/>`;
    svg.innerHTML = s;

    readout.textContent = mode === "pure"
      ? "Corps pur : lors du changement d'état, la température reste constante (palier net sur la courbe)."
      : "Mélange : lors du changement d'état, la température continue d'évoluer — il n'y a pas de vrai palier.";
  }
  btnPure.addEventListener("click", () => { mode = "pure"; draw(); });
  btnMix.addEventListener("click", () => { mode = "mix"; draw(); });
  draw();
}

/* ---------- e. La composition de l'air ---------- */
function initAirComposition(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const GASES = {
    n2: { label: "Diazote (N₂)", pct: 78, color: "var(--coral)", desc: "Le diazote est un gaz spectateur pour la respiration : il n'est pas utilisé par le corps." },
    o2: { label: "Dioxygène (O₂)", pct: 21, color: "#5a96d2", desc: "Seul le dioxygène est indispensable à la respiration." },
    autres: { label: "Autres gaz", pct: 1, color: "var(--yellow)", desc: "Dioxyde de carbone, gaz rares... en très faible proportion." }
  };
  const keys = ["n2", "o2", "autres"];
  let current = "n2";

  function draw() {
    const cx = 80, cy = 75, r = 60;
    let startAngle = -Math.PI / 2;
    let s = "";
    keys.forEach(k => {
      const gas = GASES[k];
      const angle = (gas.pct / 100) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;
      const isActive = k === current;
      s += `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${gas.color}" opacity="${isActive ? 1 : 0.35}" stroke="var(--board)" stroke-width="1.5"/>`;
      startAngle = endAngle;
    });
    svg.innerHTML = s;

    const gas = GASES[current];
    readout.innerHTML = `<strong style="color:${gas.color}">${gas.label} : ${gas.pct} %</strong><br>${gas.desc}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- f. La masse volumique ---------- */
function initVolumicMass(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const MATERIALS = {
    bois: { label: "Bois", rho: 0.60, color: "#a0703c" },
    huile: { label: "Huile", rho: 0.92, color: "#e8c468" },
    alu: { label: "Aluminium", rho: 2.70, color: "#b8bcc4" },
    fer: { label: "Fer", rho: 7.87, color: "#8a8f98" }
  };
  const keys = ["bois", "huile", "alu", "fer"];
  let current = "bois";

  function draw() {
    const mat = MATERIALS[current];
    const m = Number(mRange.value); // g
    const mKg = m / 1000;
    const V = mKg / mat.rho; // L
    const floats = mat.rho < 1.00;

    // bécher d'eau
    const x0 = 40, x1 = 160, yTop = 15, yBase = 145;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<rect x="${x0 + 2}" y="${yTop + 30}" width="${x1 - x0 - 4}" height="${yBase - yTop - 32}" fill="rgba(90,150,210,0.3)"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yTop + 20}" font-size="8" fill="#5a96d2" text-anchor="middle">eau (ρ = 1,00 kg/L)</text>`;

    // objet, taille proportionnelle à V, positionné flottant ou coulé
    const size = Math.max(10, Math.min(50, Math.sqrt(V) * 40));
    const objY = floats ? yTop + 30 - size * 0.35 : yBase - 6 - size;
    s += `<rect x="${(x0 + x1) / 2 - size / 2}" y="${objY}" width="${size}" height="${size}" fill="${mat.color}" stroke="var(--board)" stroke-width="1.5"/>`;

    svg.innerHTML = s;

    readout.innerHTML = `${mat.label} : ρ = m/V → m = ${m} g = ${mKg.toFixed(3)} kg, V = m/ρ = ${mKg.toFixed(3)}/${mat.rho.toFixed(2)} = <strong style="color:var(--yellow)">${V.toFixed(3)} L</strong><br>ρ(${mat.label.toLowerCase()}) = <strong style="color:var(--yellow)">${mat.rho.toFixed(2)} kg/L</strong> ${floats ? "&lt; 1,00 kg/L → flotte sur l'eau" : "&gt; 1,00 kg/L → coule dans l'eau"}`;
  }

  mRange.addEventListener("input", draw);
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- g. La solubilité ---------- */
function initSolubility(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const addBtn = document.getElementById(cfg.addBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);

  const V = 1; // L, fixe
  const S_MAX = 360; // g/L, solubilité (exemple sel)
  const M_MAX = S_MAX * V; // g
  let added = 0;

  const POOL = generateDotsInEllipse(30, 0, 0, 1, 1);

  function draw() {
    const dissolved = Math.min(added, M_MAX);
    const undissolved = Math.max(0, added - M_MAX);
    const saturated = added >= M_MAX;

    const x0 = 60, x1 = 160, yTop = 20, yBase = 140;
    let s = `<path d="M${x0} ${yTop} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${yTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<rect x="${x0 + 2}" y="${yTop + 20}" width="${x1 - x0 - 4}" height="${yBase - yTop - 22}" fill="rgba(90,150,210,0.25)"/>`;

    // soluté dissous : petits points diffus (invisibles à l'œil nu en réalité, ici symboliques)
    const nDissolvedDots = Math.min(20, Math.round((dissolved / M_MAX) * 20));
    for (let i = 0; i < nDissolvedDots; i++) {
      const [u, v] = POOL[i];
      const x = (x0 + x1) / 2 + u * (x1 - x0 - 16) / 2;
      const y = yTop + 60 + v * (yBase - yTop - 70) / 2;
      s += `<circle cx="${x}" cy="${y}" r="1.6" fill="var(--yellow)" opacity="0.7"/>`;
    }
    // soluté non dissous : tas au fond, visible, si saturation dépassée
    if (undissolved > 0) {
      const heapW = Math.min(70, 20 + undissolved / 5);
      s += `<ellipse cx="${(x0 + x1) / 2}" cy="${yBase - 6}" rx="${heapW / 2}" ry="8" fill="var(--chalk)"/>`;
      s += `<text x="${(x0 + x1) / 2}" y="${yBase + 20}" font-size="8" fill="var(--chalk)" text-anchor="middle">reste visible (non dissous)</text>`;
    }

    svg.innerHTML = s;

    readout.innerHTML = saturated
      ? `Ajouté : ${added} g. La solution est <strong style="color:var(--coral)">saturée</strong> : au-delà de ${M_MAX} g dissous, l'excédent (${undissolved.toFixed(0)} g) reste visible, non dissous.<br>Solubilité s = m<sub>max</sub>/V = ${M_MAX}/${V} = <strong style="color:var(--yellow)">${S_MAX} g/L</strong>`
      : `Ajouté : ${added} g, tout est dissous (solution non saturée). Continue à ajouter pour atteindre la saturation (${M_MAX} g pour ${V} L).`;
  }

  addBtn.addEventListener("click", () => { added += 40; draw(); });
  resetBtn.addEventListener("click", () => { added = 0; draw(); });
  draw();
}
