/* Animations du chapitre 3 — 2nde — "De l'atome à l'élément chimique"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Modèle de l'atome : neutralité électrique ---------- */
function initAtomModel(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const zRange = document.getElementById(cfg.zRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const Z = Number(zRange.value); // protons = neutrons = électrons (atome neutre)
    const cx = 110, cy = 90;

    // noyau : protons (+) et neutrons, en cercle compact
    const nucleusPos = generateDotsInEllipse(2 * Z, 0, 0, 1, 1);
    let s = "";
    nucleusPos.forEach(([u, v], i) => {
      const x = cx + u * 22, y = cy + v * 22;
      const isProton = i % 2 === 0;
      s += `<circle cx="${x}" cy="${y}" r="5" fill="${isProton ? 'var(--coral)' : 'var(--teal)'}"/>`;
    });

    // électrons, en orbite désordonnée autour
    const ePos = generateDotsInEllipse(Z, 0, 0, 1, 1);
    ePos.forEach(([u, v]) => {
      const r = 55 + Math.abs(u * v) * 10;
      const x = cx + u * r, y = cy + v * r;
      s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--chalk)"/>`;
      s += `<text x="${x}" y="${y + 2.5}" font-size="6" fill="var(--board)" text-anchor="middle">−</text>`;
    });

    svg.innerHTML = s;
    readout.innerHTML = `${Z} protons (+e), ${Z} neutrons, ${Z} électrons (−e) → charge totale = <strong style="color:var(--yellow)">${Z}×(+e) + ${Z}×(−e) = 0</strong> : l'atome est électriquement neutre.`;
  }
  zRange.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Écriture du noyau : A, Z → neutrons ---------- */
function initNucleusCalculator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const aRange = document.getElementById(cfg.aRangeId);
  const zRange = document.getElementById(cfg.zRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    let A = Number(aRange.value);
    let Z = Number(zRange.value);
    if (Z > A) { Z = A; zRange.value = A; }
    const N = A - Z;

    let s = `<text x="110" y="60" font-size="34" fill="var(--chalk)" text-anchor="middle" font-family="var(--font-display)">X</text>`;
    s += `<text x="82" y="42" font-size="16" fill="var(--coral)" text-anchor="middle">${A}</text>`;
    s += `<text x="82" y="82" font-size="16" fill="var(--teal)" text-anchor="middle">${Z}</text>`;
    s += `<text x="82" y="26" font-size="8" fill="var(--coral)" text-anchor="middle">A</text>`;
    s += `<text x="82" y="98" font-size="8" fill="var(--teal)" text-anchor="middle">Z</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `A = ${A} nucléons, Z = ${Z} protons → nombre de neutrons N = A − Z = <strong style="color:var(--yellow)">${N}</strong><br>masse de l'atome ≈ A × m<sub>nucléon</sub> = <strong style="color:var(--yellow)">${A}</strong> × m<sub>nucléon</sub>`;
  }
  aRange.addEventListener("input", draw);
  zRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Formation d'un ion monoatomique ---------- */
function initIonFormation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLose = document.getElementById(cfg.btnLoseId);
  const btnGain = document.getElementById(cfg.btnGainId);

  const Z_FIXED = 3; // lithium, comme dans le manuel
  let mode = "lose";

  function draw() {
    const n = Number(nRange.value);
    const nElectrons = mode === "lose" ? Math.max(0, Z_FIXED - n) : Z_FIXED + n;
    const charge = Z_FIXED - nElectrons; // en unités de e

    const cx = 110, cy = 90;
    const nucleusPos = generateDotsInEllipse(2 * Z_FIXED, 0, 0, 1, 1);
    let s = "";
    nucleusPos.forEach(([u, v], i) => {
      const x = cx + u * 16, y = cy + v * 16;
      s += `<circle cx="${x}" cy="${y}" r="5" fill="${i % 2 === 0 ? 'var(--coral)' : 'var(--teal)'}"/>`;
    });

    const ePos = generateDotsInEllipse(Math.max(1, nElectrons), 0, 0, 1, 1);
    ePos.slice(0, nElectrons).forEach(([u, v]) => {
      const r = 45 + Math.abs(u * v) * 10;
      const x = cx + u * r, y = cy + v * r;
      s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--chalk)"/>`;
    });

    const sign = charge > 0 ? "+" : (charge < 0 ? "−" : "");
    s += `<text x="${cx}" y="${cy - 65}" font-size="14" fill="var(--yellow)" text-anchor="middle" font-weight="700">charge : ${sign}${Math.abs(charge)}e</text>`;
    svg.innerHTML = s;

    readout.innerHTML = mode === "lose"
      ? `L'atome (3 protons, 3 électrons) perd ${n} électron(s) : il reste ${nElectrons} électrons → charge <strong style="color:var(--coral)">+${n}e</strong> — c'est un <strong>cation</strong>.`
      : `L'atome (3 protons, 3 électrons) gagne ${n} électron(s) : il possède maintenant ${nElectrons} électrons → charge <strong style="color:var(--teal)">−${n}e</strong> — c'est un <strong>anion</strong>.`;
  }

  btnLose.addEventListener("click", () => { mode = "lose"; draw(); });
  btnGain.addEventListener("click", () => { mode = "gain"; draw(); });
  nRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Le même élément chimique (Z fixe) ---------- */
function initSameElement(cfg) {
  const readout = document.getElementById(cfg.readoutId);
  const btnAtom1 = document.getElementById(cfg.btnAtom1Id);
  const btnIon = document.getElementById(cfg.btnIonId);
  const btnAtom2 = document.getElementById(cfg.btnAtom2Id);

  // exemple du manuel : cuivre, Z = 29 fixe pour les 3 entités
  const ENTITIES = {
    atom1: { label: "Atome de cuivre Cu", Z: 29, N: 34, e: 29 },
    ion: { label: "Ion cuivre (II) Cu²⁺", Z: 29, N: 34, e: 27 },
    atom2: { label: "Autre atome de cuivre Cu (isotope)", Z: 29, N: 36, e: 29 }
  };
  let current = "atom1";

  function draw() {
    const ent = ENTITIES[current];
    readout.innerHTML = `
      <strong style="color:var(--yellow)">${ent.label}</strong><br>
      Protons (Z) = <strong style="color:var(--teal)">${ent.Z}</strong> · Neutrons = ${ent.N} · Électrons = ${ent.e}<br>
      <span style="color:var(--chalk-dim); font-style:italic;">Les 3 entités ont le même Z = 29 : elles appartiennent au même élément chimique, le cuivre.</span>
    `;
  }
  btnAtom1.addEventListener("click", () => { current = "atom1"; draw(); });
  btnIon.addEventListener("click", () => { current = "ion"; draw(); });
  btnAtom2.addEventListener("click", () => { current = "atom2"; draw(); });
  draw();
}

/* ---------- 5. Du microscopique au macroscopique ---------- */
function initMicroMacro(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAtomic = document.getElementById(cfg.btnAtomicId);
  const btnMolecular = document.getElementById(cfg.btnMolecularId);
  const btnIonic = document.getElementById(cfg.btnIonicId);

  let mode = "atomic";
  const POS = generateDotsInEllipse(16, 0, 0, 1, 1);

  function draw() {
    const cx = 110, cy = 90, r = 75;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="rgba(107,191,171,0.06)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    if (mode === "atomic") {
      POS.forEach(([u, v]) => {
        const x = cx + u * r * 0.8, y = cy + v * r * 0.8;
        s += `<circle cx="${x}" cy="${y}" r="6" fill="var(--chalk)"/>`;
      });
    } else if (mode === "molecular") {
      POS.slice(0, 10).forEach(([u, v]) => {
        const x = cx + u * r * 0.8, y = cy + v * r * 0.8;
        s += `<circle cx="${x - 4}" cy="${y}" r="5" fill="#5a96d2"/>`;
        s += `<circle cx="${x + 5}" cy="${y}" r="3.5" fill="var(--chalk)"/>`;
      });
    } else {
      POS.forEach(([u, v], i) => {
        const x = cx + u * r * 0.8, y = cy + v * r * 0.8;
        const isCation = i % 3 !== 0; // 2 anions pour 1 cation environ (ratio illustratif)
        s += `<circle cx="${x}" cy="${y}" r="6" fill="${isCation ? 'var(--coral)' : 'var(--teal)'}"/>`;
      });
    }
    svg.innerHTML = s;

    const texts = {
      atomic: "Fer : espèce chimique atomique. Entité chimique = atome de fer, de formule Fe.",
      molecular: "Eau : espèce chimique moléculaire. Entité chimique = molécule d'eau, de formule H₂O.",
      ionic: "Chlorure de sodium : espèce chimique ionique. Entités chimiques = ions Na⁺ et Cl⁻, dans des proportions qui rendent le solide électriquement neutre."
    };
    readout.textContent = texts[mode];
  }
  btnAtomic.addEventListener("click", () => { mode = "atomic"; draw(); });
  btnMolecular.addEventListener("click", () => { mode = "molecular"; draw(); });
  btnIonic.addEventListener("click", () => { mode = "ionic"; draw(); });
  draw();
}
