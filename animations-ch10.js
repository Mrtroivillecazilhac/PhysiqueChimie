/* Animations du chapitre 12 — 1ère spé PC */

/* ---------- 1. Comparateur d'interactions et de cohésion ---------- */
function initInteractionComparator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const svgBars = document.getElementById(cfg.svgBarsId);
  const readout = document.getElementById(cfg.readoutId);
  const btnIon = document.getElementById(cfg.btnIonId);
  const btnVdw = document.getElementById(cfg.btnVdwId);
  const btnHyd = document.getElementById(cfg.btnHydId);

  const cx = 110, cy = 90;

  const TYPES = {
    ionique: {
      name: "Interaction ionique",
      barHeight: 90,
      text: "Attraction électrostatique directe entre deux ions de charges opposées (charges permanentes et entières) — la plus intense des trois.",
      draw() {
        let s = `<circle cx="${cx - 45}" cy="${cy}" r="16" fill="var(--coral)"/><text x="${cx - 45}" y="${cy + 5}" font-size="14" fill="var(--board)" text-anchor="middle" font-weight="700">+</text>`;
        s += `<circle cx="${cx + 45}" cy="${cy}" r="16" fill="var(--teal)"/><text x="${cx + 45}" y="${cy + 5}" font-size="14" fill="var(--board)" text-anchor="middle" font-weight="700">−</text>`;
        s += `<line x1="${cx - 27}" y1="${cy}" x2="${cx + 27}" y2="${cy}" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="4,3"/>`;
        s += `<text x="${cx}" y="${cy - 24}" font-size="9" fill="var(--yellow)" text-anchor="middle">attraction forte</text>`;
        return s;
      }
    },
    vdw: {
      name: "Interactions de van der Waals",
      barHeight: 18,
      text: "Interactions électrostatiques attractives présentes entre TOUTES les molécules (polaires ou non), dues à des charges partielles instantanées ou permanentes. Quelques kJ·mol⁻¹.",
      draw() {
        let s = "";
        // molécule de gauche : − (extérieur) — + (intérieur, face à l'autre molécule)
        s += `<circle cx="${cx - 55}" cy="${cy}" r="10" fill="var(--chalk-dim)"/>`;
        s += `<circle cx="${cx - 35}" cy="${cy}" r="10" fill="var(--chalk-dim)"/>`;
        s += `<text x="${cx - 55}" y="${cy - 16}" font-size="9" fill="var(--teal)" text-anchor="middle">−</text>`;
        s += `<text x="${cx - 35}" y="${cy - 16}" font-size="9" fill="var(--coral)" text-anchor="middle">+</text>`;
        // molécule de droite : − (intérieur, face à l'autre) — + (extérieur)
        s += `<circle cx="${cx + 35}" cy="${cy}" r="10" fill="var(--chalk-dim)"/>`;
        s += `<circle cx="${cx + 55}" cy="${cy}" r="10" fill="var(--chalk-dim)"/>`;
        s += `<text x="${cx + 35}" y="${cy - 16}" font-size="9" fill="var(--teal)" text-anchor="middle">−</text>`;
        s += `<text x="${cx + 55}" y="${cy - 16}" font-size="9" fill="var(--coral)" text-anchor="middle">+</text>`;
        // les pôles qui se font face sont opposés (+ ... −) : vraie attraction
        s += `<line x1="${cx - 25}" y1="${cy}" x2="${cx + 25}" y2="${cy}" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
        s += `<text x="${cx}" y="${cy - 30}" font-size="9" fill="var(--yellow)" text-anchor="middle">pôles opposés en vis-à-vis → attraction</text>`;
        return s;
      }
    },
    hyd: {
      name: "Liaison hydrogène",
      barHeight: 45,
      text: "Interaction attractive entre un atome d'hydrogène lié à un atome A très électronégatif (F, O, N), et un doublet non liant porté par un atome B tout aussi électronégatif. Quelques dizaines de kJ·mol⁻¹.",
      draw() {
        const yLine = cy; // O1, H1a et O2 sont tous les trois alignés sur cette ligne
        // Molécule 1 (donneuse)
        const O1 = [cx - 68, yLine], H1a = [cx - 38, yLine], H1b = [cx - 85, yLine - 18];
        // Molécule 2 (accepteuse), symétrique de part et d'autre de la ligne
        const O2 = [cx + 38, yLine], H2a = [cx + 63, yLine - 18], H2b = [cx + 63, yLine + 18];

        let s = "";
        // liaison O–H polarisée (trait plein) ET liaison hydrogène (pointillé),
        // sur le même axe horizontal : O1 — H1a ┄┄┄ O2
        s += `<line x1="${O1[0]}" y1="${O1[1]}" x2="${H1a[0]}" y2="${H1a[1]}" stroke="var(--chalk)" stroke-width="2.2"/>`;
        s += `<line x1="${H1a[0]}" y1="${H1a[1]}" x2="${O2[0]}" y2="${O2[1]}" stroke="var(--yellow)" stroke-width="2" stroke-dasharray="3,3"/>`;
        // les liaisons O–H non impliquées, discrètes
        s += `<line x1="${O1[0]}" y1="${O1[1]}" x2="${H1b[0]}" y2="${H1b[1]}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
        s += `<line x1="${O2[0]}" y1="${O2[1]}" x2="${H2a[0]}" y2="${H2a[1]}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
        s += `<line x1="${O2[0]}" y1="${O2[1]}" x2="${H2b[0]}" y2="${H2b[1]}" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;

        // atomes
        s += `<circle cx="${O1[0]}" cy="${O1[1]}" r="10" fill="var(--coral)"/><text x="${O1[0]}" y="${O1[1] + 4}" font-size="9" fill="var(--board)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<circle cx="${O2[0]}" cy="${O2[1]}" r="10" fill="var(--coral)"/><text x="${O2[0]}" y="${O2[1] + 4}" font-size="9" fill="var(--board)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<circle cx="${H1a[0]}" cy="${H1a[1]}" r="6.5" fill="var(--chalk)"/><text x="${H1a[0]}" y="${H1a[1] + 3}" font-size="7.5" fill="var(--board)" text-anchor="middle" font-weight="700">H</text>`;
        [H1b, H2a, H2b].forEach(H => {
          s += `<circle cx="${H[0]}" cy="${H[1]}" r="6" fill="var(--chalk-dim)"/><text x="${H[0]}" y="${H[1] + 3}" font-size="7" fill="var(--board)" text-anchor="middle" font-weight="700">H</text>`;
        });

        // charges, seulement sur le trio qui interagit — le reste sans étiquette pour ne pas surcharger
        s += `<text x="${O1[0]}" y="${O1[1] - 15}" font-size="7.5" fill="var(--teal)" text-anchor="middle">−2q</text>`;
        s += `<text x="${H1a[0]}" y="${H1a[1] - 12}" font-size="7.5" fill="var(--coral)" text-anchor="middle">+q</text>`;
        s += `<text x="${O2[0]}" y="${O2[1] - 15}" font-size="7.5" fill="var(--teal)" text-anchor="middle">−2q</text>`;

        s += `<text x="${(H1a[0] + O2[0]) / 2}" y="${yLine + 22}" font-size="8" fill="var(--yellow)" text-anchor="middle">liaison hydrogène</text>`;
        return s;
      }
    }
  };

  function drawBars(active) {
    const baseline = 100, barW = 26;
    const order = [["vdw", cx - 65], ["hyd", cx], ["ionique", cx + 65]];
    let s = `<line x1="20" y1="${baseline}" x2="200" y2="${baseline}" stroke="var(--line)" stroke-width="1.5"/>`;
    order.forEach(([key, x]) => {
      const t = TYPES[key];
      const isActive = key === active;
      s += `<rect x="${x - barW / 2}" y="${baseline - t.barHeight}" width="${barW}" height="${t.barHeight}" fill="${isActive ? 'var(--yellow)' : 'var(--chalk-dim)'}" opacity="${isActive ? 1 : 0.4}" rx="3"/>`;
      s += `<text x="${x}" y="${baseline + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${key === "vdw" ? "van der Waals" : key === "hyd" ? "liaison H" : "ionique"}</text>`;
    });
    svgBars.innerHTML = s;
  }

  function select(key) {
    svg.innerHTML = TYPES[key].draw();
    drawBars(key);
    readout.innerHTML = `<strong style="color:var(--yellow)">${TYPES[key].name}</strong> — ${TYPES[key].text}`;
  }

  btnIon.addEventListener("click", () => { [btnIon, btnVdw, btnHyd].forEach(b => b.classList.remove("active-hist")); btnIon.classList.add("active-hist"); select("ionique"); });
  btnVdw.addEventListener("click", () => { [btnIon, btnVdw, btnHyd].forEach(b => b.classList.remove("active-hist")); btnVdw.classList.add("active-hist"); select("vdw"); });
  btnHyd.addEventListener("click", () => { [btnIon, btnVdw, btnHyd].forEach(b => b.classList.remove("active-hist")); btnHyd.classList.add("active-hist"); select("hyd"); });

  btnVdw.classList.add("active-hist");
  select("vdw");
}

/* ---------- 2. Dissolution d'un solide ionique (NaCl), pas à pas ---------- */
function initDissolutionSteps(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const STEPS = [
    "Étape 1 — Le solide ionique NaCl(s) : cations Na⁺ et anions Cl⁻ régulièrement disposés, maintenus par attraction électrostatique.",
    "Étape 2 — Dissociation : au contact de l'eau, les ions du solide commencent à se séparer les uns des autres.",
    "Étape 3 — L'eau pénètre le réseau : des molécules d'eau s'insèrent déjà entre certains ions, qui restent cependant encore proches les uns des autres.",
    "Étape 4 — Solvatation et dispersion : chaque ion est maintenant isolé, entièrement entouré de molécules d'eau (hydraté) — Na⁺(aq) et Cl⁻(aq)."
  ];

  function waterMolecule(x, y, orientToward) {
    // molécule d'eau : O (corail) au centre officiel (x,y), les 2 H (petites
    // boules blanches) vraiment collées dessus, du côté "orientToward" (-1 gauche/+1 droite)
    const hX = x + orientToward * 7;
    let s = `<circle cx="${hX}" cy="${y - 3.5}" r="3.2" fill="var(--chalk)" stroke="var(--board)" stroke-width="0.8"/>`;
    s += `<circle cx="${hX}" cy="${y + 3.5}" r="3.2" fill="var(--chalk)" stroke="var(--board)" stroke-width="0.8"/>`;
    s += `<circle cx="${x}" cy="${y}" r="5.5" fill="var(--coral)" stroke="var(--board)" stroke-width="0.8"/>`;
    return s;
  }

  function draw(step) {
    const cx = 110, cy = 100;
    let s = "";

    if (step === 1) {
      // grille 4x4 d'ions alternés, intacte
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const x = cx - 45 + col * 30, y = cy - 45 + row * 30;
          const isNa = (row + col) % 2 === 0;
          s += `<circle cx="${x}" cy="${y}" r="9" fill="${isNa ? 'var(--yellow)' : 'var(--teal)'}"/>`;
        }
      }
    } else if (step === 2) {
      // grille avec les ions du coin qui commencent à se détacher
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const isCorner = (row === 0 || row === 3) && (col === 0 || col === 3);
          const isNa = (row + col) % 2 === 0;
          let x = cx - 45 + col * 30, y = cy - 45 + row * 30;
          if (isCorner) {
            const dx = col === 0 ? -12 : 12, dy = row === 0 ? -12 : 12;
            x += dx; y += dy;
          }
          s += `<circle cx="${x}" cy="${y}" r="9" fill="${isNa ? 'var(--yellow)' : 'var(--teal)'}" opacity="${isCorner ? 0.85 : 1}"/>`;
        }
      }
    } else if (step === 3) {
      // réseau 3x3 (plus de place pour l'eau qui s'insère) : les ions
      // s'écartent légèrement, des molécules d'eau se glissent entre eux
      const spacing = 42;
      const grid = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const x = cx - spacing + col * spacing, y = cy - spacing + row * spacing;
          const isNa = (row + col) % 2 === 0;
          grid.push({ x, y, isNa, row, col });
        }
      }
      // eau insérée dans les espaces horizontaux et verticaux entre ions voisins
      grid.forEach(({ x, y, row, col }) => {
        if (col < 2) s += waterMolecule(x + spacing / 2, y, 1); // entre deux ions horizontaux
        if (row < 2) s += waterMolecule(x, y + spacing / 2, 1);
      });
      grid.forEach(({ x, y, isNa }) => {
        s += `<circle cx="${x}" cy="${y}" r="8" fill="${isNa ? 'var(--yellow)' : 'var(--teal)'}"/>`;
      });
    } else {
      // solvatation + dispersion : ions isolés, chacun entièrement hydraté
      const ionSpots = [
        [cx - 55, cy - 40, "na"], [cx + 55, cy - 40, "cl"],
        [cx - 55, cy + 45, "cl"], [cx + 55, cy + 45, "na"]
      ];
      ionSpots.forEach(([x, y, kind]) => {
        const isNa = kind === "na";
        s += `<circle cx="${x}" cy="${y}" r="9" fill="${isNa ? 'var(--yellow)' : 'var(--teal)'}" stroke="var(--board)" stroke-width="1"/>`;
        const angles = [20, 92, 164, 236, 308];
        angles.forEach(a => {
          const rad = a * Math.PI / 180;
          s += waterMolecule(x + 22 * Math.cos(rad), y + 22 * Math.sin(rad), isNa ? -1 : 1);
        });
      });
    }
    svg.innerHTML = s;
    explainEl.innerHTML = STEPS[step - 1];
    stepEl.textContent = `Étape ${step} / 4`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 4;
  }

  let step = 1;
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; draw(step); } });
  nextBtn.addEventListener("click", () => { if (step < 4) { step++; draw(step); } });
  draw(step);
}

/* ---------- 3. Extraction liquide-liquide (ampoule à décanter) ---------- */
function initLiquidExtraction(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const cx = 110;
  const funnelTop = 20, funnelBottom = 175, funnelWidth = 90;
  const interfaceY = 95; // d(cyclohexane)=0,78 < d(eau)=1 → l'organique surnage

  const funnelPath = `M${cx - funnelWidth / 2} ${funnelTop} L${cx - funnelWidth / 2} ${funnelBottom - 40} Q${cx - funnelWidth / 2} ${funnelBottom - 10} ${cx - 8} ${funnelBottom - 5} L${cx - 6} ${funnelBottom + 15} L${cx + 6} ${funnelBottom + 15} L${cx + 8} ${funnelBottom - 5} Q${cx + funnelWidth / 2} ${funnelBottom - 10} ${cx + funnelWidth / 2} ${funnelBottom - 40} L${cx + funnelWidth / 2} ${funnelTop} Z`;

  const STEPS = [
    {
      title: "Le problème",
      text: "Le diiode I₂ est dissous dans de l'eau. Comment le séparer de l'eau ? → Une extraction liquide-liquide.",
      draw() {
        // un simple bécher rempli d'eau (bleu) avec le diiode dedans
        let s = `<path d="M65 60 L65 155 Q65 165 75 165 L145 165 Q155 165 155 155 L155 60" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
        s += `<path d="M68 65 L68 152 Q68 162 76 162 L144 162 Q152 162 152 152 L152 65 Z" fill="rgba(90,150,210,0.22)"/>`;
        s += `<text x="110" y="45" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">Bécher : I₂ dissous dans l'eau</text>`;
        [[85, 130], [125, 145], [100, 110], [135, 120], [90, 95]].forEach(([x, y]) => {
          s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--coral)" opacity="0.9"/>`;
        });
        return s;
      }
    },
    {
      title: "On verse et on ajoute le cyclohexane",
      text: "On transvase le contenu du bécher dans l'ampoule à décanter, puis on ajoute du cyclohexane, le solvant d'extraction.",
      draw() {
        let s = `<path d="${funnelPath}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
        // cyclohexane juste versé dessus, pas encore mélangé
        s += `<path d="M${cx - funnelWidth / 2 + 2} ${funnelTop + 2} L${cx - funnelWidth / 2 + 2} ${interfaceY} L${cx + funnelWidth / 2 - 2} ${interfaceY} L${cx + funnelWidth / 2 - 2} ${funnelTop + 2} Z" fill="rgba(232,196,104,0.20)"/>`;
        s += `<text x="${cx}" y="${(funnelTop + interfaceY) / 2}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">cyclohexane (ajouté)</text>`;
        s += `<path d="M${cx - funnelWidth / 2 + 2} ${interfaceY} L${cx - funnelWidth / 2 + 2} ${funnelBottom - 40} Q${cx - funnelWidth / 2 + 2} ${funnelBottom - 12} ${cx - 8} ${funnelBottom - 7} L${cx + 8} ${funnelBottom - 7} Q${cx + funnelWidth / 2 - 2} ${funnelBottom - 12} ${cx + funnelWidth / 2 - 2} ${funnelBottom - 40} L${cx + funnelWidth / 2 - 2} ${interfaceY} Z" fill="rgba(90,150,210,0.22)"/>`;
        s += `<text x="${cx}" y="${(interfaceY + funnelBottom) / 2}" font-size="8.5" fill="#5a96d2" text-anchor="middle">eau + I₂</text>`;
        s += `<line x1="${cx - funnelWidth / 2 + 2}" y1="${interfaceY}" x2="${cx + funnelWidth / 2 - 2}" y2="${interfaceY}" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        [[cx - 25, 140], [cx + 15, 155], [cx - 10, 125], [cx + 30, 135], [cx - 35, 160]].forEach(([x, y]) => {
          s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--coral)" opacity="0.9"/>`;
        });
        return s;
      }
    },
    {
      title: "On secoue",
      text: "L'agitation mélange intimement les deux phases : c'est ce contact qui permet au diiode de migrer vers le solvant où il est le plus soluble.",
      draw() {
        let s = `<path d="${funnelPath}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
        // mélange chaotique : patchs bleus et jaunes entremêlés
        const patches = [
          [cx - 30, 60, "var(--yellow)"], [cx + 10, 75, "#5a96d2"], [cx - 10, 95, "var(--yellow)"],
          [cx + 25, 110, "#5a96d2"], [cx - 25, 125, "var(--yellow)"], [cx + 5, 140, "#5a96d2"],
          [cx - 5, 55, "#5a96d2"], [cx + 30, 90, "var(--yellow)"], [cx - 30, 145, "#5a96d2"]
        ];
        patches.forEach(([x, y, color]) => {
          s += `<circle cx="${x}" cy="${y}" r="16" fill="${color}" opacity="0.18"/>`;
        });
        s += `<text x="${cx}" y="30" font-size="9" fill="var(--chalk)" text-anchor="middle">mélange agité !</text>`;
        // diiode dispersé partout
        [[cx - 25, 60], [cx + 15, 75], [cx - 10, 95], [cx + 30, 110], [cx - 35, 125], [cx + 5, 140], [cx - 15, 150], [cx + 25, 65]].forEach(([x, y]) => {
          s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--coral)" opacity="0.9"/>`;
        });
        return s;
      }
    },
    {
      title: "On attend (décantation)",
      text: "Les deux phases se séparent à nouveau : le diiode, plus soluble dans le cyclohexane, rejoint progressivement la phase organique qui remonte.",
      draw() {
        let s = `<path d="${funnelPath}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
        s += `<path d="M${cx - funnelWidth / 2 + 2} ${funnelTop + 2} L${cx - funnelWidth / 2 + 2} ${interfaceY} L${cx + funnelWidth / 2 - 2} ${interfaceY} L${cx + funnelWidth / 2 - 2} ${funnelTop + 2} Z" fill="rgba(232,196,104,0.20)"/>`;
        s += `<text x="${cx}" y="${(funnelTop + interfaceY) / 2 - 5}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">phase organique</text>`;
        s += `<path d="M${cx - funnelWidth / 2 + 2} ${interfaceY} L${cx - funnelWidth / 2 + 2} ${funnelBottom - 40} Q${cx - funnelWidth / 2 + 2} ${funnelBottom - 12} ${cx - 8} ${funnelBottom - 7} L${cx + 8} ${funnelBottom - 7} Q${cx + funnelWidth / 2 - 2} ${funnelBottom - 12} ${cx + funnelWidth / 2 - 2} ${funnelBottom - 40} L${cx + funnelWidth / 2 - 2} ${interfaceY} Z" fill="rgba(90,150,210,0.22)"/>`;
        s += `<text x="${cx}" y="${(interfaceY + funnelBottom) / 2 + 8}" font-size="8.5" fill="#5a96d2" text-anchor="middle">phase aqueuse</text>`;
        s += `<line x1="${cx - funnelWidth / 2 + 2}" y1="${interfaceY}" x2="${cx + funnelWidth / 2 - 2}" y2="${interfaceY}" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        // quelques molécules encore dans l'eau, la plupart déjà montées, avec des flèches
        const upArrow = `<marker id="upA" markerWidth="7" markerHeight="7" refX="3.5" refY="6" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,7 L3.5,0 L7,7 Z" fill="var(--yellow)"/></marker>`;
        s += `<defs>${upArrow}</defs>`;
        [[cx - 25, 130], [cx + 20, 145]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--coral)" opacity="0.7"/>`; });
        [[cx - 10, 130, cx - 10, 105], [cx + 30, 140, cx + 30, 80]].forEach(([x1, y1, x2, y2]) => {
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="2,2" marker-end="url(#upA)"/>`;
        });
        [[cx - 20, 60], [cx + 15, 45], [cx - 5, 70]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--coral)" opacity="0.95"/>`; });
        return s;
      }
    },
    {
      title: "On fait couler",
      text: "On ouvre le robinet : la phase aqueuse (plus dense, sans diiode) s'écoule en premier dans un bécher. La phase organique, avec le diiode extrait, reste dans l'ampoule.",
      draw() {
        let s = `<path d="${funnelPath}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
        s += `<path d="M${cx - funnelWidth / 2 + 2} ${funnelTop + 2} L${cx - funnelWidth / 2 + 2} ${funnelBottom - 55} L${cx + funnelWidth / 2 - 2} ${funnelBottom - 55} L${cx + funnelWidth / 2 - 2} ${funnelTop + 2} Z" fill="rgba(232,196,104,0.20)"/>`;
        s += `<text x="${cx}" y="${(funnelTop + funnelBottom) / 2 - 30}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">phase organique + I₂</text>`;
        [[cx - 20, 55], [cx + 18, 42], [cx - 5, 68], [cx + 25, 60]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--coral)" opacity="0.95"/>`; });
        // robinet ouvert + filet qui coule
        s += `<circle cx="${cx}" cy="${funnelBottom + 10}" r="3" fill="var(--teal)"/>`;
        s += `<line x1="${cx}" y1="${funnelBottom + 16}" x2="${cx}" y2="${funnelBottom + 40}" stroke="#5a96d2" stroke-width="3" opacity="0.7"/>`;
        // bécher de collecte en dessous
        s += `<path d="M${cx - 20} ${funnelBottom + 42} L${cx - 20} ${funnelBottom + 70} Q${cx - 20} ${funnelBottom + 78} ${cx - 12} ${funnelBottom + 78} L${cx + 12} ${funnelBottom + 78} Q${cx + 20} ${funnelBottom + 78} ${cx + 20} ${funnelBottom + 70} L${cx + 20} ${funnelBottom + 42}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<path d="M${cx - 17} ${funnelBottom + 60} L${cx - 17} ${funnelBottom + 68} Q${cx - 17} ${funnelBottom + 75} ${cx - 11} ${funnelBottom + 75} L${cx + 11} ${funnelBottom + 75} Q${cx + 17} ${funnelBottom + 75} ${cx + 17} ${funnelBottom + 68} L${cx + 17} ${funnelBottom + 60} Z" fill="rgba(90,150,210,0.3)"/>`;
        s += `<text x="${cx}" y="${funnelBottom + 90}" font-size="8" fill="#5a96d2" text-anchor="middle">phase aqueuse (récupérée, sans I₂)</text>`;
        return s;
      }
    }
  ];

  let step = 1;

  function render() {
    svg.innerHTML = STEPS[step - 1].draw();
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong> — ${STEPS[step - 1].text}`;
    stepEl.textContent = `Étape ${step} / ${STEPS.length}`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === STEPS.length;
  }

  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length) { step++; render(); } });
  render();
}
