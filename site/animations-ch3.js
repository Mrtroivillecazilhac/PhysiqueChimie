/* Animations du chapitre 3 — 1ère spé PC */

/* ---------- 9. Transfert d'électrons entre deux espèces ---------- */
function initElectronTransfer(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const slider = document.getElementById(cfg.sliderId);
  const playBtn = document.getElementById(cfg.playBtnId);
  const readout = document.getElementById(cfg.readoutId);

  const redX = 55, oxX = 205, cy = 70;
  let transferred = false; // état avant / après le transfert

  function chargeSup(n) {
    return (n === 1 ? "" : toSuperscript(String(n))) + "⁺";
  }

  function draw() {
    const n = Number(slider.value);
    const labelLeft = transferred ? `M${chargeSup(n)}` : "M";
    const labelRight = transferred ? "Y" : `Y${chargeSup(n)}`;
    const colorLeft = transferred ? "var(--coral)" : "var(--teal)";
    const colorRight = transferred ? "var(--teal)" : "var(--coral)";

    let svgContent = "";
    svgContent += `<circle cx="${redX}" cy="${cy}" r="26" fill="rgba(0,0,0,0.1)" stroke="${colorLeft}" stroke-width="2.5"/>`;
    svgContent += `<text x="${redX}" y="${cy + 4}" font-size="12" fill="${colorLeft}" text-anchor="middle" font-weight="700">${labelLeft}</text>`;
    svgContent += `<text x="${redX}" y="${cy + 42}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">réducteur (départ)</text>`;

    svgContent += `<circle cx="${oxX}" cy="${cy}" r="26" fill="rgba(0,0,0,0.1)" stroke="${colorRight}" stroke-width="2.5"/>`;
    svgContent += `<text x="${oxX}" y="${cy + 4}" font-size="12" fill="${colorRight}" text-anchor="middle" font-weight="700">${labelRight}</text>`;
    svgContent += `<text x="${oxX}" y="${cy + 42}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">oxydant (départ)</text>`;

    if (!transferred) {
      svgContent += `<path id="eTransferPath" d="M${redX + 26} ${cy} L${oxX - 26} ${cy}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
      for (let i = 0; i < n; i++) {
        const startOffset = (i / n) * 18 - 9;
        svgContent += `
          <circle r="4.5" fill="var(--yellow)" opacity="0.95">
            <animateMotion id="eMotion${i}" dur="1.4s" begin="indefinite" fill="freeze"
              path="M${redX + 24} ${cy + startOffset} L${oxX - 24} ${cy + startOffset}"/>
          </circle>`;
      }
    } else {
      svgContent += `<text x="130" y="${cy + 5}" font-size="14" fill="var(--yellow)" text-anchor="middle">${n} e⁻ →</text>`;
    }

    svg.innerHTML = svgContent;
    const n2 = n;
    readout.innerHTML = transferred
      ? `M a cédé ${n2} e⁻ : il devient <strong style="color:var(--coral)">M${chargeSup(n2)}</strong> (son oxydant conjugué). Y${chargeSup(n2)} a capté ${n2} e⁻ : il devient <strong style="color:var(--teal)">Y</strong> (son réducteur conjugué).`
      : `M (réducteur) va céder ${n2} e⁻ à Y${chargeSup(n2)} (oxydant) — clique sur "Transférer".`;
  }

  function play() {
    if (transferred) { transferred = false; draw(); return; } // "Réinitialiser"
    draw();
    const n = Number(slider.value);
    requestAnimationFrame(() => {
      for (let i = 0; i < n; i++) {
        const el = document.getElementById("eMotion" + i);
        if (el && el.beginElement) el.beginElement();
      }
      setTimeout(() => { transferred = true; draw(); playBtn.textContent = "↺ Réinitialiser"; }, 1500);
    });
  }

  slider.addEventListener("input", () => { transferred = false; playBtn.textContent = "▶ Transférer"; draw(); });
  playBtn.addEventListener("click", play);
  draw();
}

/* ---------- 10. Construction pas à pas d'une demi-équation ---------- */
function initHalfEquationBuilder(cfg) {
  const eqEl = document.getElementById(cfg.eqId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const STEPS = [
    {
      eq: `<span class="hl">Mn</span>O₄⁻ ⇌ <span class="hl">Mn</span>²⁺`,
      explain: "Étape 1 — Conservation de l'élément métallique (Mn) : déjà 1 atome de chaque côté, rien à ajouter."
    },
    {
      eq: `MnO₄⁻ ⇌ Mn²⁺ + <span class="hl">4 H₂O</span>`,
      explain: "Étape 2 — Conservation de l'oxygène : 4 atomes O à gauche, on ajoute 4 H₂O à droite."
    },
    {
      eq: `MnO₄⁻ + <span class="hl">8 H⁺</span> ⇌ Mn²⁺ + 4 H₂O`,
      explain: "Étape 3 — Conservation de l'hydrogène : 4 H₂O apportent 8 H à droite, on ajoute 8 H⁺ à gauche."
    },
    {
      eq: `MnO₄⁻ + 8 H⁺ + <span class="hl">5 e⁻</span> ⇌ Mn²⁺ + 4 H₂O`,
      explain: "Étape 4 — Conservation de la charge : à gauche (−1 + 8 = +7), à droite (+2). Il faut ajouter 5 e⁻ à gauche pour que +7 − 5 = +2. ✓"
    }
  ];

  let step = 0;

  function render() {
    eqEl.innerHTML = STEPS[step].eq;
    explainEl.innerHTML = STEPS[step].explain;
    stepEl.textContent = `Étape ${step + 1} / ${STEPS.length}`;
    prevBtn.disabled = step === 0;
    nextBtn.disabled = step === STEPS.length - 1;
  }

  prevBtn.addEventListener("click", () => { if (step > 0) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length - 1) { step++; render(); } });
  render();
}

/* ---------- 11. Équilibrer les électrons entre deux couples ---------- */
function initElectronBalance(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const halfEqEl = document.getElementById(cfg.halfEqId);
  const coefRedSlider = document.getElementById(cfg.coefRedId);
  const coefOxSlider = document.getElementById(cfg.coefOxId);
  const readout = document.getElementById(cfg.readoutId);

  const E_PER_RED = 3, E_PER_OX = 2;

  function draw() {
    const cRed = Number(coefRedSlider.value);
    const cOx = Number(coefOxSlider.value);
    const released = cRed * E_PER_RED;
    const captured = cOx * E_PER_OX;
    const balanced = released === captured;

    halfEqEl.innerHTML = `
      <div class="halfeq-line"><strong style="color:var(--teal);">× ${cRed}</strong> &nbsp; ( Al(s) ⇌ Al³⁺(aq) + 3 e⁻ )</div>
      <div class="halfeq-line"><strong style="color:var(--coral);">× ${cOx}</strong> &nbsp; ( Cu²⁺(aq) + 2 e⁻ ⇌ Cu(s) )</div>
    `;

    const diff = released - captured;
    const angle = Math.max(-18, Math.min(18, diff * 3));

    let svgContent = `<polygon points="130,120 118,140 142,140" fill="var(--chalk-dim)"/>`;
    svgContent += `<g transform="rotate(${angle} 130 120)">`;
    svgContent += `<line x1="50" y1="120" x2="210" y2="120" stroke="var(--chalk)" stroke-width="4" stroke-linecap="round"/>`;
    svgContent += `<rect x="30" y="105" width="40" height="15" rx="4" fill="rgba(107,191,171,0.2)" stroke="var(--teal)" stroke-width="2"/>`;
    svgContent += `<text x="50" y="116" font-size="10" fill="var(--teal)" text-anchor="middle" font-weight="700">${released} e⁻</text>`;
    svgContent += `<rect x="190" y="105" width="40" height="15" rx="4" fill="rgba(217,122,99,0.2)" stroke="var(--coral)" stroke-width="2"/>`;
    svgContent += `<text x="210" y="116" font-size="10" fill="var(--coral)" text-anchor="middle" font-weight="700">${captured} e⁻</text>`;
    svgContent += `</g>`;
    if (balanced) {
      svgContent += `<text x="130" y="30" font-size="20" text-anchor="middle">✅</text>`;
    }

    svg.innerHTML = svgContent;
    readout.innerHTML = balanced
      ? `<strong style="color:var(--teal);">Équilibré !</strong> Les coefficients ×${cRed} et ×${cOx} donnent ${released} e⁻ de chaque côté.`
      : `${released} e⁻ libérés ≠ ${captured} e⁻ captés — ajuste les <strong>coefficients</strong> (les nombres devant chaque demi-équation) jusqu'à égalité.`;
  }

  coefRedSlider.addEventListener("input", draw);
  coefOxSlider.addEventListener("input", draw);
  draw();
}
