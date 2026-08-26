/* Animations du chapitre 2 — 1ère spé PC */

/* ---------- 6. Simulateur d'interaction (gravitation ↔ électrostatique) ---------- */
function initForceSimulator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const modeBtn = document.getElementById(cfg.modeBtnId);
  const sliderA = document.getElementById(cfg.sliderAId);
  const sliderB = document.getElementById(cfg.sliderBId);
  const sliderD = document.getElementById(cfg.sliderDId);
  const signABtn = document.getElementById(cfg.signABtnId);
  const signBBtn = document.getElementById(cfg.signBBtnId);
  const readout = document.getElementById(cfg.readoutId);

  let mode = "grav"; // ou "electro"
  let signA = true, signB = true; // true = positif

  function draw() {
    const A = Number(sliderA.value), B = Number(sliderB.value), D = Number(sliderD.value);
    const sep = 40 + (D / 100) * 150;
    const cx = 130, cy = 70;
    const xA = cx - sep / 2, xB = cx + sep / 2;
    const rA = 8 + A * 1.4, rB = 8 + B * 1.4;

    const ratio = (A * B) / (D * D);
    const F = Math.min(100, 1000 * ratio); // pour l'affichage numérique
    let attractive, colorA, colorB, label;

    if (mode === "grav") {
      attractive = true;
      colorA = colorB = "var(--yellow)";
      label = "Force gravitationnelle — toujours attractive";
    } else {
      const sameSign = signA === signB;
      attractive = !sameSign;
      colorA = signA ? "var(--coral)" : "var(--teal)";
      colorB = signB ? "var(--coral)" : "var(--teal)";
      label = attractive ? "Charges opposées → force attractive" : "Charges de même signe → force répulsive";
    }

    let svgContent = `<defs>
      <marker id="fArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--chalk)"/></marker>
    </defs>`;
    svgContent += `<circle cx="${xA}" cy="${cy}" r="${rA}" fill="${colorA}" opacity="0.85"/>`;
    svgContent += `<circle cx="${xB}" cy="${cy}" r="${rB}" fill="${colorB}" opacity="0.85"/>`;
    if (mode === "electro") {
      svgContent += `<text x="${xA}" y="${cy + 4}" font-size="11" fill="var(--board)" text-anchor="middle" font-weight="700">${signA ? "+" : "−"}</text>`;
      svgContent += `<text x="${xB}" y="${cy + 4}" font-size="11" fill="var(--board)" text-anchor="middle" font-weight="700">${signB ? "+" : "−"}</text>`;
    }

    const dir = attractive ? 1 : -1;
    const maxArrow = sep / 2 - Math.max(rA, rB) - 6; // ne dépasse jamais le milieu
    const arrowLen = Math.max(3, Math.min(maxArrow, 1500 * ratio)); // relation directe en 1/d² — pas de compression
    const aStartX = xA + rA * dir, aEndX = aStartX + arrowLen * dir;
    const bStartX = xB - rB * dir, bEndX = bStartX - arrowLen * dir;
    svgContent += `<line x1="${aStartX}" y1="${cy}" x2="${aEndX}" y2="${cy}" stroke="var(--chalk)" stroke-width="2.5" marker-end="url(#fArrow)"/>`;
    svgContent += `<line x1="${bStartX}" y1="${cy}" x2="${bEndX}" y2="${cy}" stroke="var(--chalk)" stroke-width="2.5" marker-end="url(#fArrow)"/>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `${label} · F ∝ ${mode === "grav" ? "m<sub>A</sub> × m<sub>B</sub>" : "|q<sub>A</sub> × q<sub>B</sub>|"} / d² → intensité relative ≈ <strong style="color:var(--yellow)">${F.toFixed(1)}</strong>`;
  }

  modeBtn.addEventListener("click", () => {
    mode = mode === "grav" ? "electro" : "grav";
    modeBtn.textContent = mode === "grav" ? "⚛️ Gravitation" : "⚡ Électrostatique";
    signABtn.style.display = mode === "electro" ? "inline-block" : "none";
    signBBtn.style.display = mode === "electro" ? "inline-block" : "none";
    draw();
  });
  signABtn.addEventListener("click", () => { signA = !signA; signABtn.textContent = signA ? "A: +" : "A: −"; draw(); });
  signBBtn.addEventListener("click", () => { signB = !signB; signBBtn.textContent = signB ? "B: +" : "B: −"; draw(); });
  sliderA.addEventListener("input", draw);
  sliderB.addEventListener("input", draw);
  sliderD.addEventListener("input", draw);

  signABtn.style.display = "none";
  signBBtn.style.display = "none";
  draw();
}

/* ---------- 7. Cartographie des lignes de champ ---------- */
function initFieldLines(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const btnMasse = document.getElementById(cfg.btnMasseId);
  const btnPos = document.getElementById(cfg.btnPosId);
  const btnNeg = document.getElementById(cfg.btnNegId);
  const readout = document.getElementById(cfg.readoutId);

  let current = "masse";
  const N_LINES = 10;
  const cx = 130, cy = 100, rInner = 32, rOuter = 90;

  function draw() {
    const diverging = current === "pos";
    const color = current === "masse" ? "var(--yellow)" : current === "pos" ? "var(--coral)" : "var(--teal)";

    let svgContent = `<defs>
      <marker id="fieldArrowOut" markerWidth="6" markerHeight="6" refX="3" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker>
      <marker id="fieldArrowIn" markerWidth="6" markerHeight="6" refX="3" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker>
    </defs>`;

    for (let i = 0; i < N_LINES; i++) {
      const a = (i / N_LINES) * 2 * Math.PI;
      const x1 = cx + rInner * Math.cos(a), y1 = cy + rInner * Math.sin(a);
      const x2 = cx + rOuter * Math.cos(a), y2 = cy + rOuter * Math.sin(a);
      if (diverging) {
        svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8" marker-end="url(#fieldArrowOut)"/>`;
      } else {
        svgContent += `<line x1="${x2}" y1="${y2}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="1.8" marker-end="url(#fieldArrowIn)"/>`;
      }
    }
    svgContent += `<circle cx="${cx}" cy="${cy}" r="10" fill="${color}"/>`;
    if (current !== "masse") {
      svgContent += `<text x="${cx}" y="${cy + 4}" font-size="12" fill="var(--board)" text-anchor="middle" font-weight="700">${current === "pos" ? "+" : "−"}</text>`;
    }

    svg.innerHTML = svgContent;
    readout.textContent = current === "masse"
      ? "Champ de gravitation : les lignes convergent toujours vers la masse."
      : current === "pos"
        ? "Charge positive : les lignes de champ divergent (s'éloignent)."
        : "Charge négative : les lignes de champ convergent (se rapprochent).";
  }

  btnMasse.addEventListener("click", () => { current = "masse"; draw(); });
  btnPos.addEventListener("click", () => { current = "pos"; draw(); });
  btnNeg.addEventListener("click", () => { current = "neg"; draw(); });
  draw();
}

/* ---------- 8. Le champ diminue avec la distance (1/d²) ---------- */
function initFieldDistance(cfg) {
  const svg = document.getElementById(cfg.svgId);

  // 5 points à distances croissantes (1, 2, 3, 4, 5 "unités"), affichés
  // tous en même temps — montre directement "plus loin = plus faible",
  // pas besoin de curseur qui finit par ne plus rien montrer.
  const UNITS = [1, 2, 3, 4, 5];
  const sourceX = 25, cy = 90, sourceR = 11;
  const spacing = 42, startX = 75;
  const MAX_ARROW = 30;

  function draw() {
    let svgContent = `<defs>
      <marker id="distArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--yellow)"/></marker>
    </defs>`;

    // source, bien identifiée
    svgContent += `<circle cx="${sourceX}" cy="${cy}" r="${sourceR}" fill="var(--yellow)"/>`;
    svgContent += `<text x="${sourceX}" y="${cy + 26}" font-size="8.5" fill="var(--yellow)" text-anchor="middle">Source</text>`;
    svgContent += `<line x1="${sourceX + sourceR}" y1="${cy}" x2="${startX + (UNITS.length - 1) * spacing + 6}" y2="${cy}" stroke="var(--line)" stroke-width="1.2" stroke-dasharray="2,3"/>`;

    const maxInv = 1 / (UNITS[0] * UNITS[0]);
    UNITS.forEach((u, i) => {
      const x = startX + i * spacing;
      const inv = 1 / (u * u);
      // légère compression visuelle pour que chaque flèche reste bien
      // visible (sinon la 2e est déjà minuscule) ; le nombre exact est
      // affiché en dessous, lui n'est pas compressé.
      const visLen = MAX_ARROW * Math.pow(inv / maxInv, 0.35);

      svgContent += `<circle cx="${x}" cy="${cy}" r="4" fill="var(--chalk)"/>`;
      svgContent += `<line x1="${x - 6}" y1="${cy}" x2="${x - 6 - visLen}" y2="${cy}" stroke="var(--coral)" stroke-width="3" marker-end="url(#distArrow)"/>`;
      svgContent += `<text x="${x}" y="${cy + 22}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${u === 1 ? "d" : u + "d"}</text>`;
      svgContent += `<text x="${x}" y="${cy + 34}" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">1/d²=${inv.toFixed(2)}</text>`;
    });

    svg.innerHTML = svgContent;
  }

  draw();
}
