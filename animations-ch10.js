/* Animations du chapitre 10 — 1ère spé PC — Cohésion de la matière
   Partie 1 : animations d'origine du site. Partie 2 : animations des diapos. */

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


/* ================================================================== */
/* Partie 2 : animations grand format (diapos et site, largeur 1780)   */
/* ================================================================== */
var CH10 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", b2: "#1d3229", w: "#5a96d2", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };
var CH10_UID = 0;

function ch10$(id) { return id ? document.getElementById(id) : null; }
function ch10f(v) { return (+v).toFixed(1); }
function ch10op(op) { return op != null ? ` opacity="${Math.max(0, Math.min(1, op)).toFixed(2)}"` : ""; }
function ch10t(x, y, s, o) {
  o = o || {};
  return `<text x="${ch10f(x)}" y="${ch10f(y)}" font-size="${o.size || 26}" fill="${o.fill || CH10.dim}" font-family="${o.font || CH10.fh}" text-anchor="${o.anchor || "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}${ch10op(o.op)}>${s}</text>`;
}
function ch10btn(id, fn) {
  const b = ch10$(id);
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function ch10setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function ch10clamp(v) { return Math.max(0, Math.min(1, v)); }
function ch10ease(t) { t = ch10clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function ch10lerp(a, b, t) { return a + (b - a) * t; }
function ch10tween(st, from, to, dur, onFrame, onDone) {
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
function ch10readout(title, body, col) {
  return `<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:40px;color:${col || "#e8c468"};line-height:1.15;">${title}</div><div style="font-size:28px;line-height:1.45;text-wrap:pretty;color:#f2ede1;">${body}</div></div>`;
}
function ch10arrow(x1, y1, x2, y2, col, w, head, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 2) return "";
  const ux = dx / L, uy = dy / L, h = Math.min(head || 20, L), bx = x2 - ux * h, by = y2 - uy * h;
  return `<g${ch10op(op)}><line x1="${ch10f(x1)}" y1="${ch10f(y1)}" x2="${ch10f(bx + ux * 2)}" y2="${ch10f(by + uy * 2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>` +
    `<polygon points="${ch10f(x2)},${ch10f(y2)} ${ch10f(bx - uy * h * 0.55)},${ch10f(by + ux * h * 0.55)} ${ch10f(bx + uy * h * 0.55)},${ch10f(by - ux * h * 0.55)}" fill="${col}"/></g>`;
}
function ch10line(x1, y1, x2, y2, col, w, dash, op) {
  return `<line x1="${ch10f(x1)}" y1="${ch10f(y1)}" x2="${ch10f(x2)}" y2="${ch10f(y2)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}${ch10op(op)}/>`;
}
/* molécule d'eau : O au point (x, y), les deux H du côté « dir » (degrés) */
function ch10water(x, y, dir, op) {
  const d = 21, a1 = (dir + 52) * Math.PI / 180, a2 = (dir - 52) * Math.PI / 180;
  const h1x = x + d * Math.cos(a1), h1y = y + d * Math.sin(a1), h2x = x + d * Math.cos(a2), h2y = y + d * Math.sin(a2);
  return `<g${ch10op(op)}>` + ch10line(x, y, h1x, h1y, CH10.dim, 4) + ch10line(x, y, h2x, h2y, CH10.dim, 4) +
    `<circle cx="${ch10f(h1x)}" cy="${ch10f(h1y)}" r="8" fill="${CH10.chalk}" stroke="${CH10.board}" stroke-width="1.5"/>` +
    `<circle cx="${ch10f(h2x)}" cy="${ch10f(h2y)}" r="8" fill="${CH10.chalk}" stroke="${CH10.board}" stroke-width="1.5"/>` +
    `<circle cx="${ch10f(x)}" cy="${ch10f(y)}" r="13" fill="${CH10.c}" stroke="${CH10.board}" stroke-width="1.5"/></g>`;
}
function ch10ion(x, y, na, op) {
  const r = na ? 24 : 32;
  return `<g${ch10op(op)}><circle cx="${ch10f(x)}" cy="${ch10f(y)}" r="${r}" fill="${na ? CH10.y : CH10.t}" stroke="${CH10.board}" stroke-width="2"/>` +
    `<text x="${ch10f(x)}" y="${ch10f(y + (na ? 10 : 12))}" font-size="${na ? 28 : 36}" fill="${CH10.board}" font-family="${CH10.fb}" font-weight="700" text-anchor="middle">${na ? "+" : "−"}</text></g>`;
}
function ch10atom(x, y, r, s, fill, fs) {
  return `<circle cx="${ch10f(x)}" cy="${ch10f(y)}" r="${r}" fill="${fill}" stroke="${CH10.board}" stroke-width="3"/>` +
    ch10t(x, y + fs * 0.36, s, { anchor: "middle", size: fs, fill: CH10.board, font: CH10.fb, weight: 700 });
}

/* ------------------------------------------------------------------ */
/* 1. Comparateur d'interactions                                       */
/* ------------------------------------------------------------------ */
function initCh10Interactions(cfg) {
  const svg = ch10$(cfg.svgId), readout = ch10$(cfg.readoutId);
  if (!svg) return;
  const T = [
    { lab: "van der Waals", name: "Interactions de van der Waals", bar: 0.2, order: "quelques kJ·mol⁻¹",
      body: "Interactions électrostatiques attractives qui existent entre toutes les molécules, polaires comme apolaires. Ce sont les plus faibles des trois." },
    { lab: "liaison H", name: "Liaison hydrogène", bar: 0.5, order: "quelques dizaines de kJ·mol⁻¹",
      body: "Un atome H lié à un atome A très électronégatif est attiré par le doublet non liant d'un atome B très électronégatif. A et B : essentiellement F, O et N." },
    { lab: "ionique", name: "Interaction entre ions", bar: 1, order: "quelques centaines de kJ·mol⁻¹",
      body: "Attraction électrostatique entre ions de charges opposées : elle assure la cohésion des solides ioniques. C'est la plus intense des trois." }
  ];
  let cur = cfg.start || 0, p = 1;
  const st = {};
  function drawVdw(e) {
    const g = (1 - e) * 140;
    const mol = (x) => `<circle cx="${ch10f(x)}" cy="330" r="58" fill="${CH10.b2}" stroke="${CH10.chalk}" stroke-width="3"/><circle cx="${ch10f(x + 84)}" cy="330" r="58" fill="${CH10.b2}" stroke="${CH10.chalk}" stroke-width="3"/>`;
    let s = mol(250 - g) + mol(708 + g);
    s += ch10t(250 - g, 245, "−q", { anchor: "middle", size: 38, fill: CH10.t }) + ch10t(334 - g, 245, "+q", { anchor: "middle", size: 38, fill: CH10.c });
    s += ch10t(708 + g, 245, "−q", { anchor: "middle", size: 38, fill: CH10.t }) + ch10t(792 + g, 245, "+q", { anchor: "middle", size: 38, fill: CH10.c });
    s += ch10line(404 - g, 330, 638 + g, 330, CH10.y, 5, "14 12", e);
    s += ch10t(521, 300, "attraction faible", { anchor: "middle", size: 34, fill: CH10.y, op: e });
    s += ch10t(521, 530, "entre toutes les molécules, polaires ou apolaires", { anchor: "middle", size: 32 });
    return s;
  }
  function drawHyd(e) {
    const g = (1 - e) * 140, O2x = 690 + g;
    let s = "";
    s += ch10line(330, 330, 470, 330, CH10.chalk, 8);
    s += ch10line(330, 330, 295, 466, CH10.dim, 6);
    s += ch10line(O2x, 330, O2x + 86, 220, CH10.dim, 6) + ch10line(O2x, 330, O2x + 86, 440, CH10.dim, 6);
    [160, 200].forEach((a) => {
      const r = a * Math.PI / 180, cx = O2x + 64 * Math.cos(r), cy = 330 + 64 * Math.sin(r), hx = -Math.sin(r) * 17, hy = Math.cos(r) * 17;
      s += ch10line(cx - hx, cy - hy, cx + hx, cy + hy, CH10.chalk, 6);
    });
    s += ch10line(504, 330, O2x - 72, 330, CH10.y, 5, "12 10", e);
    s += ch10atom(330, 330, 46, "O", CH10.c, 40) + ch10atom(470, 330, 30, "H", CH10.chalk, 30) + ch10atom(295, 466, 30, "H", CH10.dim, 30);
    s += ch10atom(O2x, 330, 46, "O", CH10.c, 40) + ch10atom(O2x + 86, 220, 30, "H", CH10.dim, 30) + ch10atom(O2x + 86, 440, 30, "H", CH10.dim, 30);
    s += ch10t(330, 262, "−2q", { anchor: "middle", size: 34, fill: CH10.t }) + ch10t(470, 282, "+q", { anchor: "middle", size: 34, fill: CH10.c }) + ch10t(O2x, 262, "−2q", { anchor: "middle", size: 34, fill: CH10.t });
    s += ch10t(270, 344, "A", { anchor: "end", size: 42, fill: CH10.y }) + ch10t(O2x, 450, "B", { anchor: "middle", size: 42, fill: CH10.y });
    s += ch10t(565, 408, "liaison hydrogène", { anchor: "middle", size: 32, fill: CH10.y, op: e });
    s += ch10t(521, 548, "A et B : atomes très électronégatifs (F, O ou N)", { anchor: "middle", size: 32 });
    return s;
  }
  function drawIon(e) {
    const g = (1 - e) * 120;
    let s = "";
    s += `<circle cx="${ch10f(380 - g)}" cy="320" r="52" fill="${CH10.y}" stroke="${CH10.board}" stroke-width="3"/>` + ch10t(380 - g, 336, "+", { anchor: "middle", size: 48, fill: CH10.board, font: CH10.fb, weight: 700 });
    s += `<circle cx="${ch10f(700 + g)}" cy="320" r="74" fill="${CH10.t}" stroke="${CH10.board}" stroke-width="3"/>` + ch10t(700 + g, 338, "−", { anchor: "middle", size: 58, fill: CH10.board, font: CH10.fb, weight: 700 });
    s += ch10arrow(446 - g, 320, 520, 320, CH10.y, 7, 26, e) + ch10arrow(614 + g, 320, 552, 320, CH10.y, 7, 26, e);
    s += ch10t(380 - g, 440, "Na⁺", { anchor: "middle", size: 40, fill: CH10.y }) + ch10t(700 + g, 450, "Cl⁻", { anchor: "middle", size: 40, fill: CH10.t });
    s += ch10t(536, 236, "attraction forte", { anchor: "middle", size: 36, fill: CH10.y, op: e });
    s += ch10t(521, 548, "entre ions de charges opposées", { anchor: "middle", size: 32 });
    return s;
  }
  function draw() {
    const e = ch10ease(p);
    let s = `<g transform="translate(40 0)">` + [drawVdw, drawHyd, drawIon][cur](e) + `</g>`;
    s += `<rect x="1130" y="20" width="630" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>`;
    s += ch10t(1160, 74, "Intensité relative", { size: 32 });
    const base = 470, maxH = 330, xs = [1280, 1445, 1610];
    s += ch10line(1170, base, 1720, base, "rgba(242,237,225,0.35)", 3);
    T.forEach((t, i) => {
      const on = i === cur, h = t.bar * maxH * (on ? e : 1);
      s += `<rect x="${xs[i] - 50}" y="${ch10f(base - h)}" width="100" height="${ch10f(h)}" rx="8" fill="${on ? CH10.y : CH10.dim}"${ch10op(on ? 1 : 0.3)}/>`;
      s += ch10t(xs[i], base + 46, t.lab, { anchor: "middle", size: 30, fill: on ? CH10.y : CH10.dim });
    });
    s += ch10t(1445, 560, "la plus faible → la plus intense", { anchor: "middle", size: 26 });
    svg.innerHTML = s;
  }
  const bs = (cfg.typeIds || []).map((id, i) => ch10btn(id, () => { cur = i; sync(); ch10tween(st, 0, 1, 900, (x) => { p = x; draw(); }); }));
  function sync() {
    bs.forEach((b, i) => ch10setBtn(b, i === cur));
    if (readout) readout.innerHTML = ch10readout(T[cur].name, T[cur].body + ` Ordre de grandeur : <strong style="color:#e8c468">${T[cur].order}</strong>.`);
  }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* 2. Dissolution de NaCl dans l'eau                                   */
/* ------------------------------------------------------------------ */
function initCh10Dissolution(cfg) {
  const svg = ch10$(cfg.svgId), readout = ch10$(cfg.readoutId), stepEl = ch10$(cfg.stepId);
  if (!svg) return;
  const IONS = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) IONS.push({ na: (r + c) % 2 === 0, r, c, leave: c === 3 });
  const S2 = [[640, 95], [740, 235], [640, 375], [740, 515]];
  const S3 = [[700, 120], [1010, 190], [820, 430], [1050, 470]];
  const TXT = [
    ["Le solide ionique NaCl(s)", "Cations Na⁺ et anions Cl⁻ sont régulièrement disposés, maintenus par l'interaction électrostatique attractive entre ions de charges opposées."],
    ["1. Dissociation", "Au contact de l'eau, des ions se détachent du solide : les interactions entre ces ions et leurs voisins sont rompues."],
    ["2. Solvatation", "Chaque ion s'entoure de molécules d'eau. L'atome O (charge partielle −) se tourne vers Na⁺, les atomes H (charges partielles +) vers Cl⁻."],
    ["3. Dispersion", "Les ions solvatés se répartissent dans toute la solution : on les note Na⁺(aq) et Cl⁻(aq). En réalité, les trois étapes ont lieu <strong style=\"color:#6bbfab\">simultanément</strong>."]
  ];
  let s = 0, target = 0;
  const st = {};
  function posAt(ion, k) {
    const gx = 180 + ion.c * 92, gy = 162 + ion.r * 92;
    if (!ion.leave || k === 0) return [gx, gy];
    if (k === 1) return [gx + 95, gy + (ion.r - 1.5) * 14];
    return k === 2 ? S2[ion.r] : S3[ion.r];
  }
  function pos(ion) {
    const k = Math.min(2, Math.floor(s)), t = ch10ease(s - k), a = posAt(ion, k), b = posAt(ion, Math.min(3, k + 1));
    return [ch10lerp(a[0], b[0], t), ch10lerp(a[1], b[1], t)];
  }
  function draw() {
    let m = `<rect x="20" y="20" width="1120" height="560" rx="22" fill="rgba(90,150,210,0.10)" stroke="rgba(90,150,210,0.4)" stroke-width="2"/>`;
    m += ch10t(1110, 64, "eau", { anchor: "end", size: 32, fill: CH10.w });
    const f = ch10ease(ch10clamp(s - 1));
    IONS.forEach((ion) => {
      if (!ion.leave || f <= 0) return;
      const [x, y] = pos(ion), R = ion.na ? 24 : 32;
      for (let j = 0; j < 6; j++) {
        const th = j * 60 + 15, rad = th * Math.PI / 180, d = ch10lerp(R + 90, ion.na ? R + 15 : R + 30, f);
        m += ch10water(x + d * Math.cos(rad), y + d * Math.sin(rad), ion.na ? th : th + 180, ch10clamp(f * 1.6));
      }
    });
    IONS.forEach((ion) => { const [x, y] = pos(ion); m += ch10ion(x, y, ion.na); });
    m += `<rect x="1170" y="20" width="590" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>`;
    m += ch10t(1200, 74, "Les étapes de la dissolution", { size: 32 });
    const near = Math.round(s);
    ["Le solide NaCl(s)", "1. Dissociation", "2. Solvatation", "3. Dispersion"].forEach((lab, i) => {
      const y = 150 + i * 70, on = i === near, past = i < near;
      m += `<circle cx="1214" cy="${y - 12}" r="10" fill="${on ? CH10.y : past ? CH10.chalk : "none"}" stroke="${on ? CH10.y : CH10.dim}" stroke-width="3"/>`;
      m += ch10t(1242, y, lab, { size: 38, fill: on ? CH10.y : past ? CH10.chalk : CH10.dim, op: on || past ? 1 : 0.55 });
    });
    const eq = ch10clamp((s - 2.4) * 1.7);
    if (eq > 0) m += ch10t(1465, 455, "NaCl(s) → Na⁺(aq) + Cl⁻(aq)", { anchor: "middle", size: 36, fill: CH10.y, op: eq });
    m += ch10line(1200, 495, 1730, 495, "rgba(242,237,225,0.16)", 2);
    m += ch10ion(1222, 538, true) + ch10t(1256, 548, "Na⁺", { size: 30, fill: CH10.chalk });
    m += ch10ion(1366, 538, false) + ch10t(1408, 548, "Cl⁻", { size: 30, fill: CH10.chalk });
    m += ch10water(1530, 540, 0) + ch10t(1572, 548, "H₂O", { size: 30, fill: CH10.chalk });
    svg.innerHTML = m;
  }
  const prev = ch10btn(cfg.prevId, () => go(target - 1));
  const next = ch10btn(cfg.nextId, () => go(target + 1));
  function go(k) {
    if (k < 0 || k > 3) return;
    target = k; sync();
    ch10tween(st, s, k, 1300, (v) => { s = v; draw(); });
  }
  function sync() {
    if (prev) prev.disabled = target === 0;
    if (next) next.disabled = target === 3;
    if (stepEl) stepEl.textContent = `Étape ${target + 1} / 4`;
    if (readout) readout.innerHTML = ch10readout(TXT[target][0], TXT[target][1]);
  }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* 3. Extraction liquide-liquide du diiode par le cyclohexane          */
/* ------------------------------------------------------------------ */
function initCh10Extraction(cfg) {
  const svg = ch10$(cfg.svgId), readout = ch10$(cfg.readoutId), stepEl = ch10$(cfg.stepId);
  if (!svg) return;
  const uid = "ch10ex" + (++CH10_UID), cx = 360, BOT = 480;
  const AQ = "rgba(90,150,210,0.30)", ORG = "rgba(232,196,104,0.28)";
  function hw(y) {
    if (y <= 92) return 24;
    if (y <= 210) { const t = (y - 92) / 118; return 24 + 126 * Math.sqrt(1 - (1 - t) * (1 - t)); }
    if (y <= 420) return 150 - 134 * (y - 210) / 210;
    if (y <= 428) return 16 - 9 * (y - 420) / 8;
    return 7;
  }
  const Lp = [], Rp = [];
  for (let y = 56; y <= BOT; y += 4) { Lp.push(`${ch10f(cx - hw(y))},${y}`); Rp.unshift(`${ch10f(cx + hw(y))},${y}`); }
  const PATH = "M" + Lp.join(" L") + " L" + Rp.join(" L") + " Z";
  function vol(a, b) { let v = 0; for (let y = Math.round(a); y < b; y++) v += hw(y) * hw(y); return v; }
  const yTop = 150;
  let yInt = 200; while (yInt < 420 && vol(yTop, yInt) < vol(yInt, BOT)) yInt++;
  const yInt2 = 426, vOrg = vol(yTop, yInt);
  let yTop2 = yInt2; while (yTop2 > yTop && vol(yTop2, yInt2) < vOrg) yTop2--;
  const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const DOTS = Array.from({ length: 14 }, (_, i) => ({ u: rnd(i, 1), v: rnd(i, 2) }));
  function inRegion(d, a, b) {
    const pad = Math.min(14, (b - a) / 3), y = a + pad + d.v * Math.max(0, b - a - 2 * pad);
    return [cx + (2 * d.u - 1) * Math.max(0, hw(y) - 20), y];
  }
  const TXT = [
    ["Le problème", "Le diiode I₂ est dissous dans l'eau. Pour l'en extraire, on choisit un solvant d'extraction S₂ : ici, le cyclohexane."],
    ["On verse, puis on ajoute le cyclohexane", "On transvase la solution aqueuse dans l'ampoule à décanter, puis on ajoute le cyclohexane. Les deux liquides ne se mélangent pas : ils sont non miscibles."],
    ["On agite", "On bouche et on agite, en dégazant régulièrement. Le contact entre les deux phases permet au diiode de passer dans le solvant où il est le plus soluble."],
    ["On laisse décanter", "Les deux phases se séparent. Le cyclohexane, moins dense, surnage : la phase organique, au-dessus, contient maintenant le diiode."],
    ["On sépare les deux phases", "On retire le bouchon et on ouvre le robinet : la phase aqueuse, plus dense, s'écoule en premier dans le bécher. La phase organique, avec le diiode extrait, reste dans l'ampoule."]
  ];
  const DUR = [700, 2000, 2800, 2000, 2400];
  let step = 1, p = 1;
  const st = {};
  function beakerScene(op) {
    let s = `<g${ch10op(op)}>`;
    s += `<path d="M236,286 L236,520 Q236,539 255,539 L465,539 Q484,539 484,520 L484,286 Z" fill="${AQ}"/>`;
    s += `<path d="M230,200 L230,520 Q230,545 255,545 L465,545 Q490,545 490,520 L490,200" fill="none" stroke="${CH10.dim}" stroke-width="5" stroke-linejoin="round"/>`;
    DOTS.forEach((d) => { s += `<circle cx="${ch10f(256 + d.u * 208)}" cy="${ch10f(306 + d.v * 214)}" r="9" fill="${CH10.c}"/>`; });
    s += ch10t(360, 170, "bécher : diiode dissous dans l'eau", { anchor: "middle", size: 32, fill: CH10.chalk });
    return s + `</g>`;
  }
  function panel() {
    let s = `<rect x="860" y="20" width="900" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>`;
    s += ch10t(890, 74, "Choisir le solvant d'extraction", { size: 32 });
    s += ch10t(1380, 132, "eau (S₁)", { anchor: "middle", size: 32, fill: CH10.w }) + ch10t(1610, 132, "cyclohexane (S₂)", { anchor: "middle", size: 32, fill: CH10.y });
    const rows = [["densité", "1,00", "0,78"], ["solubilité du diiode", "faible", "très grande"]];
    rows.forEach((r, i) => {
      const y = 196 + i * 56;
      s += ch10line(890, y - 38, 1730, y - 38, "rgba(242,237,225,0.14)", 2);
      s += ch10t(890, y, r[0], { size: 29, fill: CH10.chalk, font: CH10.fb }) + ch10t(1380, y, r[1], { anchor: "middle", size: 29, fill: CH10.chalk, font: CH10.fb }) + ch10t(1610, y, r[2], { anchor: "middle", size: 29, fill: CH10.chalk, font: CH10.fb });
    });
    s += ch10line(890, 270, 1730, 270, "rgba(242,237,225,0.14)", 2);
    s += ch10t(890, 308, "miscibilité", { size: 29, fill: CH10.chalk, font: CH10.fb }) + ch10t(1495, 308, "non miscibles", { anchor: "middle", size: 29, fill: CH10.chalk, font: CH10.fb });
    const ck = step >= 2 ? (step === 2 ? ch10clamp(p * 2) : 1) : 0;
    if (ck > 0) {
      s += ch10t(890, 392, "✓ le diiode est plus soluble dans S₂ que dans S₁", { size: 30, fill: CH10.t, op: ck });
      s += ch10t(890, 440, "✓ S₂ est non miscible à S₁", { size: 30, fill: CH10.t, op: ck });
      s += ch10t(890, 488, "→ danger minimal : vérifier les pictogrammes", { size: 30, fill: CH10.dim, op: ck });
    }
    const dn = step >= 4 ? (step === 4 ? ch10clamp((p - 0.4) * 2.5) : 1) : 0;
    if (dn > 0) s += ch10t(890, 552, "0,78 &lt; 1,00 : la phase organique surnage", { size: 32, fill: CH10.y, op: dn });
    return s;
  }
  function draw() {
    const e = ch10ease(p);
    let s = "";
    if (step === 1) { svg.innerHTML = beakerScene(e) + panel(); return; }
    let aqTop = yInt, orgTop = yTop, intf = yInt, mix = 0, ang = 0, dotOp = 1, stop = 0, open = false, drain = 0;
    if (step === 2) {
      aqTop = ch10lerp(BOT, yInt, ch10ease((p - 0.1) / 0.4));
      orgTop = ch10lerp(yInt, yTop, ch10ease((p - 0.6) / 0.4));
      dotOp = ch10clamp((p - 0.12) / 0.2);
    } else if (step === 3) {
      mix = ch10clamp(p / 0.15); stop = ch10clamp(p / 0.08);
      ang = 11 * Math.sin(p * Math.PI * 8) * Math.sin(Math.PI * ch10clamp((p - 0.08) / 0.84));
    } else if (step === 4) {
      mix = 1 - ch10ease(p / 0.5); stop = 1;
    } else if (step === 5) {
      stop = 1 - ch10clamp(p / 0.1); drain = ch10ease((p - 0.12) / 0.8);
      intf = ch10lerp(yInt, yInt2, drain); aqTop = intf; orgTop = ch10lerp(yTop, yTop2, drain);
      open = p > 0.1 && p < 0.95;
    }
    const fo = step === 2 ? ch10clamp(p / 0.1) : 1;
    s += `<defs><clipPath id="${uid}"><path d="${PATH}"/></clipPath></defs>`;
    s += `<g${ch10op(fo)} transform="rotate(${ch10f(ang)} ${cx} 260)">`;
    s += `<g clip-path="url(#${uid})">`;
    if (mix < 1) {
      s += `<g${ch10op(1 - mix)}>`;
      if (orgTop < intf - 0.5) s += `<rect x="${cx - 160}" y="${ch10f(orgTop)}" width="320" height="${ch10f(intf - orgTop)}" fill="${ORG}"/>`;
      if (aqTop < BOT) s += `<rect x="${cx - 160}" y="${ch10f(aqTop)}" width="320" height="${ch10f(BOT + 4 - aqTop)}" fill="${AQ}"/>`;
      if (orgTop < intf - 0.5 && intf < 428) s += ch10line(cx - 160, intf, cx + 160, intf, CH10.dim, 2, "6 6");
      s += `</g>`;
    }
    if (mix > 0) {
      s += `<g${ch10op(mix)}><rect x="${cx - 160}" y="${yTop}" width="320" height="${BOT + 4 - yTop}" fill="rgba(160,172,160,0.22)"/>`;
      for (let j = 0; j < 12; j++) {
        const fr = ((j * 0.137 + p * 0.7 * (j % 2 ? 1 : -1)) % 1 + 1) % 1, y = yTop + 20 + fr * (420 - yTop - 40);
        const x = cx + Math.sin(j * 2.1 + p * 9) * Math.max(0, hw(y) - 40) * 0.8;
        s += `<circle cx="${ch10f(x)}" cy="${ch10f(y)}" r="38" fill="${j % 2 ? "rgba(232,196,104,0.30)" : "rgba(90,150,210,0.32)"}"/>`;
      }
      s += `</g>`;
    }
    DOTS.forEach((d, i) => {
      let q;
      const A = inRegion(d, aqTop, 470), O = inRegion(d, orgTop, intf), M = inRegion(d, yTop, 440);
      if (step === 2) q = A;
      else if (step === 3) { const j = [M[0] + 8 * Math.sin(p * 40 + i), M[1] + 8 * Math.cos(p * 34 + i)]; q = [ch10lerp(A[0], j[0], mix), ch10lerp(A[1], j[1], mix)]; }
      else if (step === 4) { const k = ch10ease((p - i * 0.025) / 0.6); q = [ch10lerp(M[0], O[0], k), ch10lerp(M[1], O[1], k)]; }
      else q = O;
      s += `<circle cx="${ch10f(q[0])}" cy="${ch10f(q[1])}" r="9" fill="${CH10.c}"${ch10op(dotOp)}/>`;
    });
    s += `</g>`;
    s += `<path d="${PATH}" fill="none" stroke="${CH10.dim}" stroke-width="5" stroke-linejoin="round"/>`;
    if (stop > 0) s += `<rect x="${cx - 20}" y="30" width="40" height="34" rx="6" fill="${CH10.dim}"${ch10op(stop)}/>`;
    s += open ? `<rect x="${cx - 6}" y="430" width="12" height="44" rx="4" fill="${CH10.t}"/>` : `<rect x="${cx - 26}" y="446" width="52" height="12" rx="4" fill="${CH10.t}"/>`;
    s += `</g>`;
    if (step >= 2) {
      const bo = step === 2 ? ch10clamp(p / 0.1) : 1, lvl = step === 5 ? ch10lerp(586, 524, drain) : 586;
      s += `<g${ch10op(bo)}>`;
      if (lvl < 585) s += `<rect x="${cx - 84}" y="${ch10f(lvl)}" width="168" height="${ch10f(586 - lvl)}" fill="${AQ}"/>`;
      s += `<path d="M${cx - 90},500 L${cx - 90},588 L${cx + 90},588 L${cx + 90},500" fill="none" stroke="${CH10.dim}" stroke-width="4" stroke-linejoin="round"/></g>`;
      if (open) s += ch10line(cx, 482, cx, lvl, CH10.w, 7, null, 0.85);
    }
    if (mix < 0.5 && (step === 2 ? p > 0.9 : true)) {
      const lo = step === 2 ? ch10clamp((p - 0.9) * 10) : 1 - mix * 2, withI = step >= 4;
      s += ch10t(cx + 172, (orgTop + intf) / 2 + 10, withI ? "phase organique + I₂" : "cyclohexane", { size: 30, fill: CH10.y, op: lo });
      if (intf < 410) s += ch10t(cx + 172, (intf + 420) / 2 + 10, withI ? "phase aqueuse" : "eau + I₂", { size: 30, fill: CH10.w, op: lo });
    }
    if (step === 5 && drain > 0.3) s += ch10t(cx + 110, 560, "phase aqueuse", { size: 30, fill: CH10.w, op: ch10clamp((drain - 0.3) * 3) });
    svg.innerHTML = s + panel();
  }
  const prev = ch10btn(cfg.prevId, () => { if (step > 1) { if (st.raf) cancelAnimationFrame(st.raf); st.raf = 0; step--; p = 1; draw(); sync(); } });
  const next = ch10btn(cfg.nextId, () => { if (step < 5) { step++; p = 0; sync(); ch10tween(st, 0, 1, DUR[step - 1], (x) => { p = x; draw(); }); } });
  function sync() {
    if (prev) prev.disabled = step === 1;
    if (next) next.disabled = step === 5;
    if (stepEl) stepEl.textContent = `Étape ${step} / 5`;
    if (readout) readout.innerHTML = ch10readout(TXT[step - 1][0], TXT[step - 1][1]);
  }
  draw(); sync();
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh10Stages() {
  document.querySelectorAll(".ch10-stage").forEach((outer) => {
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
