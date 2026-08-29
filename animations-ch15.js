/* Animations du chapitre 14 — 1ère spé PC */

/* ---------- 1. Explorateur de groupes caractéristiques ---------- */
function initFunctionalGroupExplorer(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const cx = 110, cy = 90;

  // trait de liaison qui s'arrête AVANT chaque lettre (laisse un espace),
  // avec un décalage perpendiculaire pour les doubles liaisons
  function bond(p1, p2, color, offset, inset1, inset2) {
    offset = offset || 0;
    if (inset1 === undefined) inset1 = 9;
    if (inset2 === undefined) inset2 = inset1;
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1], len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len, perpX = -uy * offset, perpY = ux * offset;
    const x1 = p1[0] + ux * inset1 + perpX, y1 = p1[1] + uy * inset1 + perpY;
    const x2 = p2[0] - ux * inset2 + perpX, y2 = p2[1] - uy * inset2 + perpY;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>`;
  }
  function doubleBond(p1, p2, color) {
    // p1 = carbone, p2 = oxygène : inset plus grand côté C, plus petit côté O
    return bond(p1, p2, color, -3, 12, 2) + bond(p1, p2, color, 3, 12, 2);
  }

  const FAMILIES = {
    alcool: {
      name: "Alcool", color: "var(--teal)",
      formule: "R — OH",
      text: "Groupe hydroxyle −OH : le O ET le H en font partie. Formule générale R−OH.",
      draw() {
        const R = [cx - 60, cy + 16], O = [cx - 32, cy], H = [cx - 4, cy + 16];
        let s = `<text x="${R[0] - 12}" y="${R[1] + 5}" font-size="14" fill="var(--chalk)" text-anchor="middle">R</text>`;
        s += bond(R, O, "var(--chalk)");
        s += bond(O, H, "var(--teal)");
        s += `<text x="${O[0]}" y="${O[1] + 5}" font-size="14" fill="var(--teal)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<text x="${H[0] + 12}" y="${H[1] + 5}" font-size="14" fill="var(--teal)" text-anchor="middle" font-weight="700">H</text>`;
        s += `<rect x="${O[0] - 13}" y="${O[1] - 13}" width="${H[0] - O[0] + 38}" height="${H[1] - O[1] + 26}" fill="none" stroke="var(--teal)" stroke-width="1.3" stroke-dasharray="2,2" rx="6"/>`;
        return s;
      }
    },
    aldehyde: {
      name: "Aldéhyde", color: "var(--coral)",
      formule: "R — CHO",
      text: "Groupe carbonyle en bout de chaîne : le C, le O ET le H qui lui est attaché en font partie. Formule générale R−CHO.",
      draw() {
        const R = [cx - 66, cy + 16], C = [cx - 38, cy], O = [cx - 38, cy - 32], H = [cx - 10, cy + 16];
        let s = `<text x="${R[0] - 12}" y="${R[1] + 5}" font-size="14" fill="var(--chalk)" text-anchor="middle">R</text>`;
        s += bond(R, C, "var(--chalk)");
        s += doubleBond(C, O, "var(--coral)");
        s += bond(C, H, "var(--coral)");
        s += `<text x="${C[0]}" y="${C[1] + 5}" font-size="14" fill="var(--coral)" text-anchor="middle" font-weight="700">C</text>`;
        s += `<text x="${O[0]}" y="${O[1] - 8}" font-size="13" fill="var(--coral)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<text x="${H[0] + 12}" y="${H[1] + 5}" font-size="14" fill="var(--coral)" text-anchor="middle" font-weight="700">H</text>`;
        s += `<rect x="${O[0] - 15}" y="${O[1] - 20}" width="${H[0] - O[0] + 40}" height="${H[1] - O[1] + 33}" fill="none" stroke="var(--coral)" stroke-width="1.3" stroke-dasharray="2,2" rx="6"/>`;
        return s;
      }
    },
    cetone: {
      name: "Cétone", color: "var(--yellow)",
      formule: "R — CO — R'",
      text: "Groupe carbonyle au milieu de la chaîne : seuls le C et le O en font partie, R et R' restent hors du groupe. Formule générale R−CO−R'.",
      draw() {
        const R = [cx - 78, cy + 16], C = [cx - 50, cy], Rp = [cx - 22, cy + 16], O = [cx - 50, cy - 32];
        let s = `<text x="${R[0] - 12}" y="${R[1] + 5}" font-size="14" fill="var(--chalk)" text-anchor="middle">R</text>`;
        s += bond(R, C, "var(--chalk)");
        s += bond(C, Rp, "var(--chalk)");
        s += `<text x="${Rp[0] + 14}" y="${Rp[1] + 5}" font-size="14" fill="var(--chalk)" text-anchor="middle">R'</text>`;
        s += doubleBond(C, O, "var(--yellow)");
        s += `<text x="${C[0]}" y="${C[1] + 5}" font-size="14" fill="var(--yellow)" text-anchor="middle" font-weight="700">C</text>`;
        s += `<text x="${O[0]}" y="${O[1] - 8}" font-size="13" fill="var(--yellow)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<rect x="${C[0] - 15}" y="${O[1] - 20}" width="30" height="${C[1] - O[1] + 33}" fill="none" stroke="var(--yellow)" stroke-width="1.3" stroke-dasharray="2,2" rx="6"/>`;
        return s;
      }
    },
    acide: {
      name: "Acide carboxylique", color: "var(--teal)",
      formule: "R — COOH",
      text: "Groupe carboxyle : le C, les deux O ET le H en font tous partie (carbonyle + hydroxyle sur le même carbone). Formule générale R−COOH.",
      draw() {
        const R = [cx - 78, cy + 16], C = [cx - 50, cy], Od = [cx - 50, cy - 32], Oh = [cx - 22, cy + 16], H = [cx + 6, cy + 16];
        let s = `<text x="${R[0] - 12}" y="${R[1] + 5}" font-size="14" fill="var(--chalk)" text-anchor="middle">R</text>`;
        s += bond(R, C, "var(--chalk)");
        s += doubleBond(C, Od, "var(--teal)");
        s += bond(C, Oh, "var(--teal)");
        s += bond(Oh, H, "var(--teal)");
        s += `<text x="${C[0]}" y="${C[1] + 5}" font-size="14" fill="var(--teal)" text-anchor="middle" font-weight="700">C</text>`;
        s += `<text x="${Od[0]}" y="${Od[1] - 8}" font-size="13" fill="var(--teal)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<text x="${Oh[0]}" y="${Oh[1] + 5}" font-size="13" fill="var(--teal)" text-anchor="middle" font-weight="700">O</text>`;
        s += `<text x="${H[0] + 12}" y="${H[1] + 5}" font-size="14" fill="var(--teal)" text-anchor="middle" font-weight="700">H</text>`;
        s += `<rect x="${C[0] - 15}" y="${Od[1] - 20}" width="${H[0] - C[0] + 38}" height="${H[1] - Od[1] + 33}" fill="none" stroke="var(--teal)" stroke-width="1.3" stroke-dasharray="2,2" rx="6"/>`;
        return s;
      }
    }
  };

  function select(key) {
    const fam = FAMILIES[key];
    svg.innerHTML = fam.draw();
    readout.innerHTML = `<strong style="color:${fam.color}">${fam.name}</strong> — ${fam.text} Formule générale : <strong style="color:${fam.color}">${fam.formule}</strong>.`;
  }

  buttons.forEach((btn, i) => {
    const key = cfg.familyKeys[i];
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      select(key);
    });
  });
  buttons[0].classList.add("active-hist");
  select(cfg.familyKeys[0]);
}

/* ---------- 2. Constructeur de nomenclature ---------- */
function initNomenclatureBuilder(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const nameEl = document.getElementById(cfg.nameId);
  const nRange = document.getElementById(cfg.nRangeId);
  const posRange = document.getElementById(cfg.posRangeId);
  const buttons = cfg.familyBtnIds.map(id => document.getElementById(id));
  const branchBtn = document.getElementById(cfg.branchBtnId);
  const branchZone = document.getElementById(cfg.branchZoneId);
  const branchPosSelect = document.getElementById(cfg.branchPosId);
  const branchAlkylSelect = document.getElementById(cfg.branchAlkylId);

  const RACINES = { 1: "méthan", 2: "éthan", 3: "propan", 4: "butan", 5: "pentan", 6: "hexan", 7: "heptan", 8: "octan" };
  const SUFFIXES = { alcane: "e", alcool: "ol", aldehyde: "al", cetone: "one", acide: "oïque" };
  const FAMILY_LABEL = { alcane: "Alcane", alcool: "Alcool", aldehyde: "Aldéhyde", cetone: "Cétone", acide: "Acide carboxylique" };
  const ALKYLES = {
    methyl: { carbons: 1, name: "méthyl" },
    ethyl: { carbons: 2, name: "éthyl" },
    propyl: { carbons: 3, name: "propyl" },
    butyl: { carbons: 4, name: "butyl" }
  };

  let family = "alcane";
  let hasBranch = false;

  function updatePosRange(n) {
    if (family === "alcane" || family === "aldehyde" || family === "acide") {
      posRange.min = 1; posRange.max = 1; posRange.value = 1; posRange.disabled = true;
    } else if (family === "cetone") {
      posRange.min = 2; posRange.max = Math.max(2, n - 1); posRange.disabled = false;
      if (Number(posRange.value) < 2 || Number(posRange.value) > n - 1) posRange.value = 2;
    } else {
      posRange.min = 1; posRange.max = n; posRange.disabled = false;
      if (Number(posRange.value) > n) posRange.value = n;
    }
  }

  function refreshBranchPosOptions(n) {
    const current = Number(branchPosSelect.value) || 2;
    branchPosSelect.innerHTML = "";
    // une ramification ne peut être que sur un carbone interne (2 à n-1) :
    // sur un carbone terminal, elle allongerait simplement la chaîne principale.
    // Si n < 3, il n'existe aucun carbone interne : pas de ramification possible.
    const maxPos = n - 1;
    for (let p = 2; p <= maxPos; p++) {
      const opt = document.createElement("option");
      opt.value = p; opt.textContent = p;
      if (p === current) opt.selected = true;
      branchPosSelect.appendChild(opt);
    }
    if (current < 2 || current > maxPos) branchPosSelect.value = 2;
  }

  function refreshBranchAlkylOptions(n, pos) {
    // règle réelle : une ramification ne doit jamais donner un chemin plus
    // long que la chaîne principale choisie. Le plus long chemin alternatif
    // passant par la ramification vaut max(pos, n-pos+1) + carbones ; pour
    // que la chaîne principale reste la plus longue, il faut donc :
    // carbones_ramification ≤ min(pos-1, n-pos).
    const maxBranchCarbons = Math.min(pos - 1, n - pos);
    const current = branchAlkylSelect.value;
    branchAlkylSelect.innerHTML = "";
    let firstKey = null;
    Object.entries(ALKYLES).forEach(([key, a]) => {
      if (a.carbons > maxBranchCarbons) return;
      if (firstKey === null) firstKey = key;
      const opt = document.createElement("option");
      opt.value = key; opt.textContent = a.name;
      if (key === current) opt.selected = true;
      branchAlkylSelect.appendChild(opt);
    });
    if (![...branchAlkylSelect.options].some(o => o.value === current) && firstKey) {
      branchAlkylSelect.value = firstKey;
    }
  }

  function draw() {
    const n = Number(nRange.value);
    updatePosRange(n);
    const pos = Number(posRange.value);
    refreshBranchPosOptions(n);
    const branchPos = Number(branchPosSelect.value);
    refreshBranchAlkylOptions(n, branchPos);
    const canBranch = n >= 3;
    branchBtn.style.display = canBranch ? "" : "none";
    if (!canBranch && hasBranch) {
      hasBranch = false;
      branchZone.style.display = "none";
      branchBtn.textContent = "+ Ajouter une ramification";
    }
    const branchKey = branchAlkylSelect.value;

    // nom
    const racine = RACINES[n] || "?";
    const suffixe = SUFFIXES[family];
    const needsPos = family === "alcool" || family === "cetone";
    const branchPrefix = hasBranch ? `${branchPos}-${ALKYLES[branchKey].name}` : "";
    const suffixPart = needsPos ? `-${pos}-${suffixe}` : suffixe;
    // 3 couleurs : préfixe (corail) — racine (blanc) — suffixe (jaune), pour bien voir l'assemblage
    const coloredName = `${branchPrefix ? `<span style="color:var(--coral);">${branchPrefix}</span>` : ""}<span style="color:var(--chalk);">${racine}</span><span style="color:var(--yellow);">${suffixPart}</span>`;
    const name = `${branchPrefix}${racine}${suffixPart}`;
    const fullName = family === "acide" ? `acide ${name}` : name;
    nameEl.innerHTML = family === "acide" ? `acide ${coloredName}` : coloredName;

    // schéma en chaîne carbonée
    const cx0 = 25, step = (200 - 25) / (n - 1 || 1), cy = 65;
    let s = "";
    for (let i = 1; i <= n; i++) {
      const x = cx0 + (i - 1) * step;
      const isFunctional = family !== "alcane" && i === pos;
      s += `<circle cx="${x}" cy="${cy}" r="9" fill="${isFunctional ? 'var(--yellow)' : 'var(--chalk-dim)'}"/>`;
      s += `<text x="${x}" y="${cy + 3}" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">${i}</text>`;
      if (i < n) s += `<line x1="${x + 9}" y1="${cy}" x2="${x + step - 9}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      if (isFunctional) {
        const label = family === "alcool" ? "OH" : family === "acide" ? "OOH" : "O";
        s += `<line x1="${x}" y1="${cy - 9}" x2="${x}" y2="${cy - 25}" stroke="var(--yellow)" stroke-width="2"/>`;
        s += `<text x="${x}" y="${cy - 30}" font-size="9" fill="var(--yellow)" text-anchor="middle">${label}</text>`;
      }
    }

    // ramification : 1ère boule tout droit en dessous, puis à 90°, parallèle à la chaîne principale
    if (hasBranch) {
      const bx0 = cx0 + (branchPos - 1) * step;
      const by0 = cy + 26;
      const carbons = ALKYLES[branchKey].carbons;
      s += `<line x1="${bx0}" y1="${cy + 9}" x2="${bx0}" y2="${by0 - 9}" stroke="var(--coral)" stroke-width="2"/>`;
      for (let k = 0; k < carbons; k++) {
        const x = bx0 + k * 22;
        if (k > 0) s += `<line x1="${x - 22 + 9}" y1="${by0}" x2="${x - 9}" y2="${by0}" stroke="var(--coral)" stroke-width="2"/>`;
        s += `<circle cx="${x}" cy="${by0}" r="8" fill="var(--coral)"/>`;
      }
      // (le nom de l'alkyle est déjà écrit dans le nom construit au-dessus, pas la peine de le répéter ici)
    }

    svg.innerHTML = s;

    const branchDesc = hasBranch ? `, ramification ${ALKYLES[branchKey].name} en position ${branchPos}` : "";
    readout.innerHTML = `${n} atomes de carbone (racine "${racine}"), famille <strong style="color:var(--yellow)">${FAMILY_LABEL[family]}</strong> (suffixe "${suffixe}")${needsPos ? `, groupe en position ${pos}` : ""}${branchDesc} → nom : <strong style="color:var(--yellow)">${fullName}</strong>.`;
  }

  buttons.forEach((btn, i) => {
    const key = cfg.familyKeys[i];
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      family = key;
      draw();
    });
  });
  branchBtn.addEventListener("click", () => {
    hasBranch = !hasBranch;
    branchZone.style.display = hasBranch ? "flex" : "none";
    branchBtn.textContent = hasBranch ? "✕ Retirer la ramification" : "+ Ajouter une ramification";
    draw();
  });
  nRange.addEventListener("input", draw);
  posRange.addEventListener("input", draw);
  branchPosSelect.addEventListener("change", draw);
  branchAlkylSelect.addEventListener("change", draw);

  buttons[0].classList.add("active-hist");
  branchZone.style.display = "none";
  draw();
}

/* ---------- 3. Lecteur de spectre infrarouge ---------- */
function initIRSpectrumReader(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAlcool = document.getElementById(cfg.btnAlcoolId);
  const btnAcide = document.getElementById(cfg.btnAcideId);

  const x0 = 30, x1 = 230, y0 = 30, y1 = 140; // axe : sigma de 4000 (x0) à 500 (x1), inversé
  const sigmaMin = 500, sigmaMax = 4000;

  function sigmaToX(sigma) {
    return x0 + ((sigmaMax - sigma) / (sigmaMax - sigmaMin)) * (x1 - x0);
  }

  const SPECTRA = {
    alcool: {
      bands: [{ sigma: 3300, label: "O−H (alcool)", desc: "Bande forte et large entre 3 200 et 3 400 cm⁻¹ : liaison O−H d'un alcool.", color: "var(--teal)" }]
    },
    acide: {
      bands: [
        { sigma: 2900, label: "O−H (acide)", desc: "Bande forte et très large entre 2 600 et 3 200 cm⁻¹ : liaison O−H d'un acide carboxylique.", color: "var(--teal)" },
        { sigma: 1730, label: "C=O", desc: "Bande forte et fine entre 1 700 et 1 760 cm⁻¹ : liaison C=O.", color: "var(--coral)" }
      ]
    }
  };

  let mode = "alcool";

  function baseCurve(bands) {
    // courbe de transmittance simplifiée : proche de 90% partout, avec des creux aux bandes
    let path = `M${x0} ${y0 + 15}`;
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const sigma = sigmaMax - (i / steps) * (sigmaMax - sigmaMin);
      const x = sigmaToX(sigma);
      let T = 90;
      bands.forEach(b => {
        const width = 120;
        const dist = Math.abs(sigma - b.sigma);
        if (dist < width) T -= (1 - dist / width) * 65;
      });
      const y = y0 + (100 - T) / 100 * (y1 - y0);
      path += ` L${x} ${y}`;
    }
    return path;
  }

  function draw() {
    const bands = SPECTRA[mode].bands;
    let s = "";
    // axes
    s += `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${y1 + 18}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">nombre d'ondes σ (cm⁻¹) — décroissant →</text>`;
    s += `<text x="${x0 - 8}" y="${y0 - 6}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">T (%)</text>`;
    [4000, 3000, 2000, 1000].forEach(v => {
      const x = sigmaToX(v);
      s += `<text x="${x}" y="${y1 + 12}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">${v}</text>`;
    });

    // courbe
    s += `<path d="${baseCurve(bands)}" fill="none" stroke="var(--chalk)" stroke-width="1.8"/>`;

    // zones cliquables sur chaque bande
    bands.forEach((b, i) => {
      const x = sigmaToX(b.sigma);
      s += `<rect data-band="${i}" x="${x - 14}" y="${y0}" width="28" height="${y1 - y0}" fill="${b.color}" opacity="0.12" stroke="${b.color}" stroke-width="1" stroke-dasharray="2,2" style="cursor:pointer;"/>`;
    });

    svg.innerHTML = s;

    svg.querySelectorAll("rect[data-band]").forEach(rect => {
      rect.addEventListener("click", () => {
        const b = bands[Number(rect.dataset.band)];
        readout.innerHTML = `<strong style="color:${b.color}">${b.label}</strong> — ${b.desc}`;
      });
    });

    const intro = mode === "alcool"
      ? "Spectre d'un alcool : clique sur la bande pour l'identifier."
      : "Spectre d'un acide carboxylique : clique sur chaque bande pour les identifier (il y en a deux).";
    readout.innerHTML = intro;
  }

  btnAlcool.addEventListener("click", () => { btnAlcool.classList.add("active-hist"); btnAcide.classList.remove("active-hist"); mode = "alcool"; draw(); });
  btnAcide.addEventListener("click", () => { btnAcide.classList.add("active-hist"); btnAlcool.classList.remove("active-hist"); mode = "acide"; draw(); });

  btnAlcool.classList.add("active-hist");
  draw();
}
