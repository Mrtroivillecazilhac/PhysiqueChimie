/* Animations du chapitre "Spectrophotométrie UV-visible colorées" — 1ère spé PC
   (scindé depuis l'ancien chapitre 1 — la partie composition/quantité de matière
   est restée dans animations-ch1.js) */

/* ---------- 1. Cuve interactive — loi de Beer-Lambert (C seule varie) ---------- */
function initBeerLambert(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const cRange = document.getElementById(cfg.cRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const EPSILON = 1700; // L·mol⁻¹·cm⁻¹, valeur typique (ex: permanganate)
  const L_FIXED = 1;    // cm — épaisseur standard d'une cuve, non modifiable

  function draw() {
    const cSlider = Number(cRange.value);              // dixièmes de ×10⁻⁴ mol/L
    const cDisplay = cSlider / 10;                       // ×10⁻⁴ mol/L, ex: 6.5
    const C = cDisplay / 1e4;                             // mol/L réel
    const A = EPSILON * L_FIXED * C;
    const T = Math.pow(10, -A);                           // transmittance
    const beamOpacityOut = Math.max(0.06, T);

    const cuveWidth = 55;
    const cuveLeft = 130 - cuveWidth / 2;
    const cuveRight = 130 + cuveWidth / 2;
    const colorT = Math.min(1, A / 1.3);
    const fillColor = `rgba(${Math.round(107 + colorT * (217 - 107))}, ${Math.round(191 + colorT * (122 - 191))}, ${Math.round(171 + colorT * (99 - 171))}, ${0.15 + colorT * 0.55})`;

    let svgContent = "";
    svgContent += `<defs>
      <marker id="arrowIn" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
      <marker id="arrowOut" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)" opacity="${beamOpacityOut}"/></marker>
    </defs>`;
    svgContent += `<line x1="20" y1="90" x2="${cuveLeft - 4}" y2="90" stroke="var(--yellow)" stroke-width="4" marker-end="url(#arrowIn)"/>`;
    svgContent += `<rect x="${cuveLeft}" y="45" width="${cuveWidth}" height="90" fill="${fillColor}" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    svgContent += `<line x1="${cuveRight + 4}" y1="90" x2="240" y2="90" stroke="var(--yellow)" stroke-width="4" opacity="${beamOpacityOut}" marker-end="url(#arrowOut)"/>`;
    svgContent += `<text x="130" y="150" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">ℓ = ${L_FIXED} cm (fixe)</text>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `C = ${cDisplay.toFixed(1)} × 10⁻⁴ mol/L → A = ε × ℓ × C = <strong style="color:var(--yellow)">${A.toFixed(2)}</strong> (transmittance ≈ ${(T * 100).toFixed(0)}%)`;
  }

  cRange.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Courbe d'étalonnage interactive (lecture graphique) ---------- */
function initCalibrationCurve(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const aSlider = document.getElementById(cfg.sliderId);
  const readout = document.getElementById(cfg.readoutId);

  // points étalons (exemple permanganate de potassium, cf. manuel)
  const POINTS = [
    { C: 1.2, A: 0.20 }, { C: 3.6, A: 0.60 }, { C: 4.1, A: 0.68 },
    { C: 5.0, A: 0.83 }, { C: 6.5, A: 1.10 }
  ]; // C en ×10⁻⁴ mol/L

  // régression forcée par l'origine : k = Σ(C×A) / Σ(C²)
  const k = POINTS.reduce((s, p) => s + p.C * p.A, 0) / POINTS.reduce((s, p) => s + p.C * p.C, 0);

  const C_MAX = 7.5, A_MAX = 1.4;
  const PAD_L = 40, PAD_B = 55, PAD_T = 15, PAD_R = 15;
  const W = 260, H = 205;
  const plotW = W - PAD_L - PAD_R, plotH = H - PAD_T - PAD_B;

  function xPix(C) { return PAD_L + (C / C_MAX) * plotW; }
  function yPix(A) { return PAD_T + plotH - (A / A_MAX) * plotH; }

  function flaskSvg(cx, topY, intensityT) {
    const fill = `rgba(${Math.round(107 + intensityT * (217 - 107))}, ${Math.round(191 + intensityT * (122 - 191))}, ${Math.round(171 + intensityT * (99 - 171))}, ${0.25 + intensityT * 0.6})`;
    return `<path d="M${cx - 5} ${topY} L${cx - 5} ${topY + 5} L${cx - 11} ${topY + 20} Q${cx - 11} ${topY + 24} ${cx - 7} ${topY + 24} L${cx + 7} ${topY + 24} Q${cx + 11} ${topY + 24} ${cx + 11} ${topY + 20} L${cx + 5} ${topY + 5} L${cx + 5} ${topY} Z" fill="${fill}" stroke="var(--chalk-dim)" stroke-width="1.2"/>
      <line x1="${cx - 6}" y1="${topY}" x2="${cx + 6}" y2="${topY}" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
  }

  function draw() {
    const Ameasured = Number(aSlider.value) / 100;
    const Cinc = Ameasured / k;

    let svgContent = "";
    svgContent += `<line x1="${PAD_L}" y1="${PAD_T}" x2="${PAD_L}" y2="${H - PAD_B}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<line x1="${PAD_L}" y1="${H - PAD_B}" x2="${W - PAD_R}" y2="${H - PAD_B}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<text x="${W / 2}" y="${H - 4}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">C (× 10⁻⁴ mol/L)</text>`;
    svgContent += `<text x="10" y="${PAD_T + 6}" font-size="8" fill="var(--chalk-dim)">A</text>`;

    svgContent += `<line x1="${xPix(0)}" y1="${yPix(0)}" x2="${xPix(C_MAX)}" y2="${yPix(k * C_MAX)}" stroke="var(--teal)" stroke-width="2"/>`;

    // fioles alignées sous chaque point, dont la teinte montre la concentration croissante
    POINTS.forEach(p => {
      const t = p.C / POINTS[POINTS.length - 1].C;
      svgContent += flaskSvg(xPix(p.C), H - PAD_B + 8, t);
      svgContent += `<line x1="${xPix(p.C)}" y1="${yPix(p.A)}" x2="${xPix(p.C)}" y2="${H - PAD_B + 8}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>`;
    });

    POINTS.forEach(p => {
      svgContent += `<circle cx="${xPix(p.C)}" cy="${yPix(p.A)}" r="4" fill="var(--yellow)"/>`;
    });

    const py = yPix(Ameasured), px = xPix(Cinc);
    svgContent += `<line x1="${PAD_L}" y1="${py}" x2="${px}" y2="${py}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svgContent += `<line x1="${px}" y1="${py}" x2="${px}" y2="${H - PAD_B}" stroke="var(--coral)" stroke-width="1.5" stroke-dasharray="4,3"/>`;
    svgContent += `<circle cx="${px}" cy="${py}" r="5" fill="var(--coral)"/>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `A mesurée = ${Ameasured.toFixed(2)} → lecture graphique : C<sub>inc</sub> = <span class="frac"><span class="num">A</span><span class="den">k</span></span> = <strong style="color:var(--coral)">${Cinc.toFixed(2)} × 10⁻⁴ mol/L</strong>`;
  }

  aSlider.addEventListener("input", draw);
  draw();
}
