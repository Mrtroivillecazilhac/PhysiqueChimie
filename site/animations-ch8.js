/* Animations du chapitre 8 — 1ère spé PC */

/* ---------- 24. Méthode pas à pas : déterminer la taille de l'image (objet fixe) ---------- */
function initLensMethod(cfg) {
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);
  const svg = document.getElementById(cfg.svgId);

  // Exemple fixe (objet immobile) : xA = -7,5 cm ; f' = 5,0 cm → xA' = 15 cm, γ = -2,0
  const XA = -7.5, FP = 5.0;
  const XAP = 1 / (1 / FP + 1 / XA);
  const GAMMA = XAP / XA;

  const PX = 10, cx = 100, cy = 90, objH = 20;
  const Ax = cx + XA * PX, Bx = Ax, By = cy - objH;
  const Fx = cx - FP * PX, Fpx = cx + FP * PX;
  const imgX = cx + XAP * PX, imgY = cy - GAMMA * objH; // GAMMA négatif → sous l'axe

  const STEPS = [
    { explain: "Étape 1 — On place l'objet AB et la lentille (x<sub>A</sub> = −7,5 cm, f' = 5,0 cm), avec les foyers F et F'.", rays: [] },
    { explain: "Étape 2 — Le rayon qui passe par le centre optique O n'est pas dévié : il continue tout droit.", rays: ["center"] },
    { explain: "Étape 3 — Le rayon parallèle à l'axe, une fois réfracté, passe par le foyer image F'.", rays: ["center", "parallel"] },
    { explain: "Étape 4 — Le rayon qui passe par le foyer objet F, une fois réfracté, ressort parallèle à l'axe.", rays: ["center", "parallel", "focal"] },
    { explain: "Étape 5 — Les trois rayons se croisent au même point B' : c'est là que se forme l'image, réelle et renversée.", rays: ["center", "parallel", "focal"], showImage: true }
  ];

  let step = 0;

  function drawDiagram(rays, showImage) {
    let s = `<line x1="10" y1="${cy}" x2="290" y2="${cy}" stroke="var(--line)" stroke-width="1.5"/>`;
    // lentille
    s += `<line x1="${cx}" y1="${cy - 45}" x2="${cx}" y2="${cy + 45}" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<path d="M${cx - 5} ${cy - 40} L${cx} ${cy - 46} L${cx + 5} ${cy - 40}" fill="none" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<path d="M${cx - 5} ${cy + 40} L${cx} ${cy + 46} L${cx + 5} ${cy + 40}" fill="none" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<text x="${cx}" y="${cy - 52}" font-size="9" fill="var(--yellow)" text-anchor="middle">O</text>`;
    // F et F'
    s += `<circle cx="${Fx}" cy="${cy}" r="2.5" fill="var(--chalk-dim)"/><text x="${Fx}" y="${cy + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">F</text>`;
    s += `<circle cx="${Fpx}" cy="${cy}" r="2.5" fill="var(--chalk-dim)"/><text x="${Fpx}" y="${cy + 14}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">F'</text>`;
    // objet
    s += `<line x1="${Ax}" y1="${cy}" x2="${Bx}" y2="${By}" stroke="var(--coral)" stroke-width="2.5"/>`;
    s += `<polygon points="${Bx - 4},${By + 6} ${Bx + 4},${By + 6} ${Bx},${By}" fill="var(--coral)"/>`;
    s += `<text x="${Ax}" y="${cy + 26}" font-size="9" fill="var(--coral)" text-anchor="middle">A</text>`;
    s += `<text x="${Bx}" y="${By - 6}" font-size="9" fill="var(--coral)" text-anchor="middle">B</text>`;

    if (rays.includes("center")) {
      const slope = (imgY - By) / (imgX - Bx);
      const endX = imgX + 30, endY = imgY + slope * (endX - imgX);
      s += `<line x1="${Bx}" y1="${By}" x2="${endX}" y2="${endY}" stroke="var(--teal)" stroke-width="1.8"/>`;
    }
    if (rays.includes("parallel")) {
      const slope = (imgY - By) / (imgX - cx);
      const endX = imgX + 30, endY = imgY + slope * (endX - imgX);
      s += `<line x1="${Bx}" y1="${By}" x2="${cx}" y2="${By}" stroke="var(--yellow)" stroke-width="1.8"/>`;
      s += `<line x1="${cx}" y1="${By}" x2="${endX}" y2="${endY}" stroke="var(--yellow)" stroke-width="1.8"/>`;
    }
    if (rays.includes("focal")) {
      // droite de B vers F, prolongée jusqu'à la lentille (passe par F au passage)
      const slope1 = (cy - By) / (Fx - Bx);
      const yAtLens = By + slope1 * (cx - Bx);
      const endX = imgX + 30, endY = imgY; // ressort parallèle à l'axe après la lentille
      s += `<line x1="${Bx}" y1="${By}" x2="${cx}" y2="${yAtLens}" stroke="var(--coral)" stroke-width="1.8"/>`;
      s += `<line x1="${cx}" y1="${yAtLens}" x2="${endX}" y2="${endY}" stroke="var(--coral)" stroke-width="1.8"/>`;
    }
    if (showImage) {
      s += `<line x1="${imgX}" y1="${cy}" x2="${imgX}" y2="${imgY}" stroke="var(--chalk)" stroke-width="2.5"/>`;
      s += `<polygon points="${imgX - 4},${imgY - 6} ${imgX + 4},${imgY - 6} ${imgX},${imgY}" fill="var(--chalk)"/>`;
      s += `<text x="${imgX}" y="${cy - 8}" font-size="9" fill="var(--chalk)" text-anchor="middle">A'</text>`;
      s += `<text x="${imgX}" y="${imgY + 12}" font-size="9" fill="var(--chalk)" text-anchor="middle">B'</text>`;
    }
    svg.innerHTML = s;
  }

  function render() {
    explainEl.innerHTML = STEPS[step].explain;
    stepEl.textContent = `Étape ${step + 1} / ${STEPS.length}`;
    prevBtn.disabled = step === 0;
    nextBtn.disabled = step === STEPS.length - 1;
    drawDiagram(STEPS[step].rays, STEPS[step].showImage);
  }

  prevBtn.addEventListener("click", () => { if (step > 0) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length - 1) { step++; render(); } });
  render();
}

/* ---------- 24b. Exploiter les relations (calcul de position/taille) ---------- */
function initLensCalc(cfg) {
  const eqEl = document.getElementById(cfg.eqId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);
  const svg = document.getElementById(cfg.svgId);

  // Même exemple fixe que la construction géométrique : xA = -7,5 cm ; f' = 5,0 cm
  const XA = -7.5, FP = 5.0;
  const XAP = 1 / (1 / FP + 1 / XA); // = 15 cm
  const GAMMA = XAP / XA;             // = -2,0

  const PX = 10, cx = 100, cy = 90, objH = 26; // mêmes constantes que l'animation de tracé
  const objX = cx + XA * PX, Fx = cx - FP * PX, Fpx = cx + FP * PX, imgX = cx + XAP * PX;

  const STEPS = [
    {
      eq: `x<sub>A</sub> = −7,5 cm &nbsp;&nbsp; f' = 5,0 cm`,
      explain: "Étape 1 — Données de départ : la position de l'objet et la distance focale de la lentille.",
      show: "object"
    },
    {
      eq: `<span class="frac"><span class="num">1</span><span class="den">x<sub>A'</sub></span></span> = <span class="frac"><span class="num">1</span><span class="den">f'</span></span> + <span class="frac"><span class="num">1</span><span class="den">x<sub>A</sub></span></span> = <span class="frac"><span class="num">1</span><span class="den">5,0</span></span> + <span class="frac"><span class="num">1</span><span class="den">−7,5</span></span>`,
      explain: "Étape 2 — On applique la relation de conjugaison pour isoler 1/x<sub>A'</sub>.",
      show: "object"
    },
    {
      eq: `x<sub>A'</sub> = 15 cm`,
      explain: "Étape 3 — Calcul : x<sub>A'</sub> = 15 cm. Comme x<sub>A'</sub> &gt; 0, l'image est réelle (projetable sur un écran).",
      show: "image-pos"
    },
    {
      eq: `γ = <span class="frac"><span class="num">x<sub>A'</sub></span><span class="den">x<sub>A</sub></span></span> = <span class="frac"><span class="num">15</span><span class="den">−7,5</span></span> = −2,0`,
      explain: "Étape 4 — On applique la relation de grandissement pour trouver γ.",
      show: "image-pos"
    },
    {
      eq: `γ = −2,0`,
      explain: "Étape 5 — Interprétation : γ < 0 → image renversée. |γ| = 2,0 > 1 → image deux fois plus grande que l'objet.",
      show: "image-full"
    }
  ];

  let step = 0;

  function bracket(x1, x2, y, label, color) {
    let s = `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="1.3"/>`;
    s += `<line x1="${x1}" y1="${y - 4}" x2="${x1}" y2="${y + 4}" stroke="${color}" stroke-width="1.3"/>`;
    s += `<line x1="${x2}" y1="${y - 4}" x2="${x2}" y2="${y + 4}" stroke="${color}" stroke-width="1.3"/>`;
    s += `<text x="${(x1 + x2) / 2}" y="${y + 11}" font-size="7.5" fill="${color}" text-anchor="middle">${label}</text>`;
    return s;
  }

  function drawDiagram(show) {
    let s = `<line x1="10" y1="${cy}" x2="290" y2="${cy}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${cx}" y1="${cy - 45}" x2="${cx}" y2="${cy + 45}" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<text x="${cx}" y="${cy - 52}" font-size="9" fill="var(--yellow)" text-anchor="middle">O</text>`;

    // foyers F et F', toujours visibles (données de départ)
    s += `<circle cx="${Fx}" cy="${cy}" r="2.5" fill="var(--teal)"/><text x="${Fx}" y="${cy - 8}" font-size="9" fill="var(--teal)" text-anchor="middle">F</text>`;
    s += `<circle cx="${Fpx}" cy="${cy}" r="2.5" fill="var(--teal)"/><text x="${Fpx}" y="${cy - 8}" font-size="9" fill="var(--teal)" text-anchor="middle">F'</text>`;

    // objet, avec le point A repéré sur l'axe
    s += `<line x1="${objX}" y1="${cy}" x2="${objX}" y2="${cy - objH}" stroke="var(--coral)" stroke-width="2.5"/>`;
    s += `<polygon points="${objX - 4},${cy - objH + 6} ${objX + 4},${cy - objH + 6} ${objX},${cy - objH}" fill="var(--coral)"/>`;
    s += `<circle cx="${objX}" cy="${cy}" r="2.5" fill="var(--coral)"/><text x="${objX}" y="${cy + 12}" font-size="9" fill="var(--coral)" text-anchor="middle">A</text>`;
    s += `<text x="${objX}" y="${cy - objH - 6}" font-size="9" fill="var(--coral)" text-anchor="middle">B</text>`;

    // doubles flèches de distance : x_A (A→O) et f' (O→F')
    s += bracket(objX, cx, cy + 26, `x<tspan baseline-shift="sub" font-size="0.75em">A</tspan> = −7,5 cm`, "var(--coral)");
    s += bracket(cx, Fpx, cy + 26, "f' = 5,0 cm", "var(--teal)");

    if (show === "image-pos" || show === "image-full") {
      s += `<line x1="${imgX}" y1="${cy}" x2="${imgX}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
      s += `<circle cx="${imgX}" cy="${cy}" r="3" fill="var(--chalk)"/>`;
      s += `<text x="${imgX}" y="${cy - 8}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">A'</text>`;
      s += bracket(cx, imgX, cy + 42, `x<tspan baseline-shift="sub" font-size="0.75em">A'</tspan> = 15 cm`, "var(--chalk)");
    }
    if (show === "image-full") {
      const imgH = objH * Math.abs(GAMMA);
      s += `<line x1="${imgX}" y1="${cy}" x2="${imgX}" y2="${cy + imgH}" stroke="var(--chalk)" stroke-width="2.5"/>`;
      s += `<polygon points="${imgX - 4},${cy + imgH - 6} ${imgX + 4},${cy + imgH - 6} ${imgX},${cy + imgH}" fill="var(--chalk)"/>`;
      s += `<text x="${imgX}" y="${cy + imgH + 14}" font-size="9" fill="var(--chalk)" text-anchor="middle">B'</text>`;
    }
    svg.innerHTML = s;
  }

  function render() {
    eqEl.innerHTML = STEPS[step].eq;
    explainEl.innerHTML = STEPS[step].explain;
    stepEl.textContent = `Étape ${step + 1} / ${STEPS.length}`;
    prevBtn.disabled = step === 0;
    nextBtn.disabled = step === STEPS.length - 1;
    drawDiagram(STEPS[step].show);
  }

  prevBtn.addEventListener("click", () => { if (step > 0) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length - 1) { step++; render(); } });
  render();
}

/* ---------- 25. Mise au point (netteté de l'image) ---------- */
function initFocusSharpness(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const screenRange = document.getElementById(cfg.screenRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const XA = -10, FP = 5;
  const TRUE_XAP = 1 / (1 / FP + 1 / XA); // = 10 dans cet exemple
  const PX = 14, cx = 60, cy = 80;

  function draw() {
    const screenPos = Number(screenRange.value);
    const defocus = Math.abs(screenPos - TRUE_XAP);
    const blur = Math.min(6, defocus * 0.6);

    let s = `<defs><filter id="focusBlur"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>`;
    s += `<line x1="10" y1="${cy}" x2="280" y2="${cy}" stroke="var(--line)" stroke-width="1.5"/>`;
    s += `<line x1="${cx}" y1="${cy - 40}" x2="${cx}" y2="${cy + 40}" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<text x="${cx}" y="${cy - 46}" font-size="9" fill="var(--yellow)" text-anchor="middle">Lentille</text>`;

    // écran (position ajustable)
    const screenX = cx + screenPos * PX;
    s += `<line x1="${screenX}" y1="${cy - 45}" x2="${screenX}" y2="${cy + 45}" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    s += `<text x="${screenX}" y="${cy + 58}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">Écran</text>`;

    // image projetée sur l'écran, floue selon la défocalisation
    s += `<g filter="url(#focusBlur)">
      <line x1="${screenX}" y1="${cy}" x2="${screenX}" y2="${cy - 25}" stroke="var(--coral)" stroke-width="3"/>
      <circle cx="${screenX}" cy="${cy - 25}" r="4" fill="var(--coral)"/>
    </g>`;

    // repère de la vraie position de netteté
    const trueX = cx + TRUE_XAP * PX;
    s += `<line x1="${trueX}" y1="${cy + 20}" x2="${trueX}" y2="${cy + 30}" stroke="var(--teal)" stroke-width="2"/>`;
    s += `<text x="${trueX}" y="${cy + 42}" font-size="8" fill="var(--teal)" text-anchor="middle">netteté ici</text>`;

    svg.innerHTML = s;

    const isSharp = defocus < 0.4;
    readout.innerHTML = `Position de l'écran = ${screenPos.toFixed(1)} → ${isSharp ? '<strong style="color:var(--teal)">image nette !</strong>' : `<strong style="color:var(--coral)">floue</strong> (écart de ${defocus.toFixed(1)} par rapport à la position de netteté)`}`;
  }
  screenRange.addEventListener("input", draw);
  draw();
}
