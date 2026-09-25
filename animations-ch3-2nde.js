/* Animations du chapitre 3 — 2nde — "Solutions aqueuses" */

/* ---------- Utilitaires communs au chapitre ---------- */

/* Nombre au format français : virgule décimale. */
function ch3Fr(x, digits) {
  return Number(x).toFixed(digits).replace(".", ",");
}

/* Branche un écouteur en remplaçant celui posé par un appel précédent :
   une animation ré-initialisée sur les mêmes éléments ne cumule pas les écouteurs. */
function ch3Listen(el, type, fn) {
  if (!el) return;
  el.__ch3Handlers = el.__ch3Handlers || {};
  if (el.__ch3Handlers[type]) el.removeEventListener(type, el.__ch3Handlers[type]);
  el.__ch3Handlers[type] = fn;
  el.addEventListener(type, fn);
}

/* Impose la plage d'un curseur et y ramène sa valeur courante. */
function ch3Range(el, min, max, step) {
  if (!el) return;
  el.min = String(min);
  el.max = String(max);
  el.step = String(step);
  const v = Number(el.value);
  if (!isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}

/* Vérifie que tous les éléments requis existent avant de dessiner. */
function ch3Ready() {
  for (let i = 0; i < arguments.length; i++) if (!arguments[i]) return false;
  return true;
}

function ch3Frac(num, den) {
  return `<span class="frac"><span class="num">${num}</span><span class="den">${den}</span></span>`;
}

/* ---------- 1. Soluté ionique ou moléculaire ---------- */
function initSoluteType(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnIonic = document.getElementById(cfg.btnIonicId);
  const btnMolecular = document.getElementById(cfg.btnMolecularId);
  if (!ch3Ready(svg, readout)) return;

  let mode = "ionic";

  /* Entités du soluté, relatives au centre (110 ; 105).
     Toutes contenues dans l'ellipse rx = 45, ry = 35, rayon des entités compris :
     aucune ne touche la paroi ni la surface libre. */
  const CX = 110, CY = 105;
  const IONS = [[-32, -8], [-18, 14], [-4, -20], [8, 4], [24, -10], [30, 16], [-6, 26], [14, -26]];
  const MOLS = [[-30, -6], [-12, 14], [4, -18], [22, 6], [-2, 0], [30, -14], [8, 24]];

  function drawLegend() {
    if (mode === "ionic") {
      return `<g font-family="var(--font-body)">
        <circle cx="18" cy="14" r="6.5" fill="var(--coral)"/>
        <text x="18" y="17" font-size="7.5" fill="var(--board)" text-anchor="middle" font-weight="700">+</text>
        <text x="30" y="18" font-size="9" fill="var(--chalk-dim)">Na⁺(aq)</text>
        <circle cx="115" cy="14" r="6.5" fill="var(--teal)"/>
        <text x="115" y="17" font-size="7.5" fill="var(--board)" text-anchor="middle" font-weight="700">−</text>
        <text x="127" y="18" font-size="9" fill="var(--chalk-dim)">Cl⁻(aq)</text>
      </g>`;
    }
    return `<g font-family="var(--font-body)">
      <circle cx="18" cy="14" r="6" fill="var(--yellow)"/>
      <text x="30" y="18" font-size="9" fill="var(--chalk-dim)">C₆H₁₂O₆(aq) glucose</text>
    </g>`;
  }

  function styleButtons() {
    [[btnIonic, "ionic"], [btnMolecular, "molecular"]].forEach(([b, m]) => {
      if (!b) return;
      const on = mode === m;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.style.borderStyle = on ? "solid" : "dashed";
      b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.22)";
      b.style.color = on ? "#e8c468" : "#c9c2b0";
    });
  }

  function draw() {
    const left = 30, right = 190, top = 50, bottom = 175, surf = 62;
    let s = drawLegend();

    // solution aqueuse : fond bleu translucide, surface libre avec léger ménisque (remonte aux parois)
    s += `<path d="M${left + 2} ${surf - 4} Q${left + 6} ${surf} ${left + 20} ${surf} L${right - 20} ${surf} Q${right - 6} ${surf} ${right - 2} ${surf - 4} L${right - 2} ${bottom - 20} Q${right - 2} ${bottom - 2} ${right - 20} ${bottom - 2} L${left + 20} ${bottom - 2} Q${left + 2} ${bottom - 2} ${left + 2} ${bottom - 20} Z" fill="rgba(90,160,230,0.2)"/>`;
    s += `<path d="M${left + 2} ${surf - 4} Q${left + 6} ${surf} ${left + 20} ${surf} L${right - 20} ${surf} Q${right - 6} ${surf} ${right - 2} ${surf - 4}" fill="none" stroke="rgba(150,200,240,0.75)" stroke-width="1.4"/>`;

    // récipient
    s += `<path d="M${left} ${top} L${left} ${bottom - 20} Q${left} ${bottom} ${left + 20} ${bottom} L${right - 20} ${bottom} Q${right} ${bottom} ${right} ${bottom - 20} L${right} ${top}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    if (mode === "ionic") {
      IONS.forEach(([dx, dy], i) => {
        const x = CX + dx, y = CY + dy;
        const isPos = i % 2 === 0;
        s += `<circle cx="${x}" cy="${y}" r="7" fill="${isPos ? "var(--coral)" : "var(--teal)"}"/>`;
        s += `<text x="${x}" y="${y + 3}" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">${isPos ? "+" : "−"}</text>`;
      });
    } else {
      MOLS.forEach(([dx, dy]) => {
        s += `<circle cx="${CX + dx}" cy="${CY + dy}" r="6" fill="var(--yellow)"/>`;
      });
    }

    svg.innerHTML = s;
    readout.innerHTML = (mode === "ionic"
      ? "Soluté ionique : ex. Na⁺(aq) + Cl⁻(aq) — des ions positifs (Na⁺, en corail) et négatifs (Cl⁻, en bleu-vert) dissous dans le solvant."
      : "Soluté moléculaire : ex. C₆H₁₂O₆(aq) le glucose — des molécules neutres (en jaune) dissoutes dans le solvant.")
      + `<br><span style="color:var(--chalk-dim); font-size:0.85em;">L'indice (aq) se lit « aqueux » : il indique que l'espèce est dissoute dans l'eau, donc en solution aqueuse.</span>`;
    styleButtons();
  }

  ch3Listen(btnIonic, "click", () => { mode = "ionic"; draw(); });
  ch3Listen(btnMolecular, "click", () => { mode = "molecular"; draw(); });
  draw();
}

/* ---------- 2. Calculateur de concentration en masse (avec saturation) ---------- */
function initMassConcentration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);
  if (!ch3Ready(svg, mRange, vRange, readout)) return;

  const SOLUBILITY = 50; // g/L — solubilité fixée pour l'exemple pédagogique
  const V_MAX = 500;     // mL

  ch3Range(mRange, 0, 40, 0.5);
  ch3Range(vRange, 50, 500, 25);

  function draw() {
    const m = Number(mRange.value); // g
    const V = Number(vRange.value); // mL
    const Vl = V / 1000;            // L
    const t = Vl > 0 ? m / Vl : 0;
    const saturated = t > SOLUBILITY;
    const tDissolved = Math.min(t, SOLUBILITY);
    const mDeposit = saturated ? m - SOLUBILITY * Vl : 0;

    const x0 = 70, x1 = 140, y0 = 18, yBase = 150;
    const innerH = yBase - y0 - 6;
    const fillH = (V / V_MAX) * innerH;   // hauteur strictement proportionnelle à V
    const yTop = yBase - 2 - fillH;
    let s = "";

    // solution : teinte proportionnelle à la concentration dissoute, bloquée à la solubilité
    const alpha = 0.10 + (tDissolved / SOLUBILITY) * 0.55;
    const b = yBase - 2, l = x0 + 2, r = x1 - 2;
    const bottomRound = Math.min(8, fillH);
    s += `<path d="M${l} ${yTop.toFixed(1)} L${l} ${(b - bottomRound).toFixed(1)} Q${l} ${b} ${l + bottomRound} ${b} L${r - bottomRound} ${b} Q${r} ${b} ${r} ${(b - bottomRound).toFixed(1)} L${r} ${yTop.toFixed(1)} Z" fill="rgba(232,196,104,${alpha.toFixed(2)})"/>`;
    s += `<line x1="${l}" y1="${yTop.toFixed(1)}" x2="${r}" y2="${yTop.toFixed(1)}" stroke="rgba(232,196,104,0.9)" stroke-width="1"/>`;

    // dépôt solide non dissous
    let depH = 0;
    if (saturated) {
      depH = Math.min(fillH * 0.55, 3 + 12 * Math.min(1, mDeposit / 25));
      const dy = b - 1 - depH;
      s += `<rect x="${x0 + 4}" y="${dy.toFixed(1)}" width="${x1 - x0 - 8}" height="${depH.toFixed(1)}" rx="3" fill="var(--yellow)" stroke="var(--coral)" stroke-width="1"/>`;
      const grains = Math.min(16, 4 + Math.round(mDeposit / 1.5));
      for (let i = 0; i < grains; i++) {
        const frac = grains > 1 ? i / (grains - 1) : 0.5;
        const gx = x0 + 9 + frac * (x1 - x0 - 18) + Math.sin(i * 12.9) * 1.5;
        const gy = dy - 1.6 - (i % 3 === 1 ? 2.2 : 0);
        s += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="2.2" fill="var(--yellow)" stroke="#b89a2e" stroke-width="0.6"/>`;
      }
      s += `<text x="${x1 + 6}" y="${(dy + depH / 2 + 3).toFixed(1)}" font-size="8" fill="var(--coral)" font-weight="700">dépôt</text>`;
    }

    // entités dissoutes : nombre proportionnel à la concentration dissoute
    const dotCount = Math.round((tDissolved / SOLUBILITY) * 18);
    const pos = generateDotsInEllipse(dotCount, 0, 0, 1, 1);
    const zoneTop = yTop + 4, zoneBottom = b - depH - 6;
    if (zoneBottom > zoneTop) {
      pos.forEach(([u, v]) => {
        const x = (x0 + x1) / 2 + u * (x1 - x0 - 14) / 2;
        const y = zoneTop + ((v + 1) / 2) * (zoneBottom - zoneTop);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="var(--yellow)"/>`;
      });
    }

    // graduations du bécher
    for (let g = 100; g <= V_MAX; g += 100) {
      const gy = yBase - 2 - (g / V_MAX) * innerH;
      s += `<line x1="${x0}" y1="${gy.toFixed(1)}" x2="${x0 + 6}" y2="${gy.toFixed(1)}" stroke="var(--chalk-dim)" stroke-width="1"/>`;
      s += `<text x="${x0 - 4}" y="${(gy + 2.5).toFixed(1)}" font-size="7" fill="var(--chalk-dim)" text-anchor="end">${g}</text>`;
    }

    // bécher
    s += `<path d="M${x0} ${y0} L${x0} ${yBase - 10} Q${x0} ${yBase} ${x0 + 10} ${yBase} L${x1 - 10} ${yBase} Q${x1} ${yBase} ${x1} ${yBase - 10} L${x1} ${y0}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<text x="${(x0 + x1) / 2}" y="${yBase + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">V = ${V} mL</text>`;

    svg.innerHTML = s;

    const tColor = saturated ? "var(--coral)" : "var(--yellow)";
    const formula = `<em>t</em> = ${ch3Frac("<em>m</em>", "<em>V</em>")} = ${ch3Frac(`${ch3Fr(m, 1)} g`, `${ch3Fr(Vl, 3)} L`)} = <strong style="color:${tColor}">${ch3Fr(t, 1)} g/L</strong>`;
    readout.innerHTML = saturated
      ? `${formula}<br>`
        + `<span style="color:var(--coral); font-weight:700;">⚠️ <em>t</em> dépasse la solubilité (${SOLUBILITY} g/L) : la solution est saturée.</span><br>`
        + `Concentration réellement dissoute : <strong style="color:var(--yellow)">${SOLUBILITY} g/L</strong> (maximum)<br>`
        + `Dépôt non dissous : <em>m</em><sub>dépôt</sub> = <em>m</em> − ${SOLUBILITY} × <em>V</em> = ${ch3Fr(m, 1)} − ${SOLUBILITY} × ${ch3Fr(Vl, 3)} = <strong style="color:var(--coral)">${ch3Fr(mDeposit, 2)} g</strong>`
      : `${formula}<br><span style="color:var(--teal);">Solution homogène, non saturée (solubilité : ${SOLUBILITY} g/L).</span>`;
  }
  ch3Listen(mRange, "input", draw);
  ch3Listen(vRange, "input", draw);
  draw();
}

/* ---------- 3. Préparation par dissolution (balance électronique + fiole jaugée dynamique) ---------- */
function initDissolutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tRange = document.getElementById(cfg.tRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);
  if (!ch3Ready(svg, tRange, vRange, readout)) return;

  const MAX_M = 15;        // g, borne haute réaliste (t max 30 g/L × V max 500 mL)
  const FILL_MS = 1100;    // durée du remplissage jusqu'au trait de jauge
  const clipId = `${cfg.svgId}-fiole-clip`;

  let fillProgress = 1;    // 0 → 1 : niveau d'eau entre le fond et le trait de jauge
  let rafId = 0;

  function balance(m) {
    const heapScale = Math.min(m, MAX_M) / MAX_M;
    const baseX = 8, baseY = 108, baseW = 96, baseH = 34;
    let s = `<rect x="${baseX}" y="${baseY}" width="${baseW}" height="${baseH}" rx="5" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
    const lcdX = baseX + 8, lcdY = baseY + 6, lcdW = 58, lcdH = 20;
    s += `<rect x="${lcdX}" y="${lcdY}" width="${lcdW}" height="${lcdH}" rx="2" fill="#16241a" stroke="#3a5a3a" stroke-width="1"/>`;
    s += `<text x="${lcdX + lcdW - 5}" y="${lcdY + lcdH / 2 + 4}" font-size="10" font-family="monospace" fill="var(--yellow)" text-anchor="end">${ch3Fr(m, 2)} g</text>`;
    s += `<circle cx="${baseX + baseW - 12}" cy="${baseY + baseH - 10}" r="4" fill="var(--chalk-dim)" opacity="0.55"/>`;
    const plateCx = baseX + 30, plateY = baseY - 3;
    s += `<rect x="${plateCx - 26}" y="${plateY}" width="52" height="6" rx="2" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
    const dishCy = plateY - 6;
    s += `<ellipse cx="${plateCx}" cy="${dishCy}" rx="22" ry="6" fill="rgba(90,160,230,0.18)" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
    s += `<ellipse cx="${plateCx}" cy="${dishCy - 1.5}" rx="19" ry="4.3" fill="none" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    if (heapScale > 0.01) {
      const heapRx = 3 + heapScale * 15, heapRy = 2 + heapScale * 6.5;
      s += `<ellipse cx="${plateCx}" cy="${(dishCy - 2.5).toFixed(1)}" rx="${heapRx.toFixed(1)}" ry="${heapRy.toFixed(1)}" fill="var(--yellow)" opacity="0.9"/>`;
      const grains = Math.min(10, Math.round(heapScale * 10));
      for (let i = 0; i < grains; i++) {
        const ang = i * 2.4;
        const gx = plateCx + Math.cos(ang) * heapRx * 0.55;
        const gy = (dishCy - 2.5) + Math.sin(ang) * heapRy * 0.5;
        s += `<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="0.9" fill="#b89a2e"/>`;
      }
    }
    return s;
  }

  function flask(t, V) {
    const fx = 168, fTop = 26, base = 150, neckHalf = 4.5;
    const k = Math.sqrt(Math.min(1, V / 500));        // 50 mL → petit bulbe, 500 mL → grand bulbe
    const w = 12 + 18 * k;                             // demi-largeur du bulbe
    const bulbH = 38 + 40 * k;                         // hauteur du bulbe
    const neckBot = base - bulbH;
    const jaugeY = fTop + 12;                          // trait de jauge gravé sur le col
    const h = bulbH;

    const body = `M${fx - neckHalf} ${fTop} L${fx - neckHalf} ${neckBot} C${fx - neckHalf} ${neckBot + h * 0.25} ${fx - w} ${neckBot + h * 0.35} ${fx - w} ${neckBot + h * 0.72} Q${fx - w} ${base} ${fx - w + 8} ${base} L${fx + w - 8} ${base} Q${fx + w} ${base} ${fx + w} ${neckBot + h * 0.72} C${fx + w} ${neckBot + h * 0.35} ${fx + neckHalf} ${neckBot + h * 0.25} ${fx + neckHalf} ${neckBot} L${fx + neckHalf} ${fTop}`;

    let s = `<defs><clipPath id="${clipId}"><path d="${body} Z"/></clipPath></defs>`;

    // eau (légèrement teintée par le soluté) montant jusqu'au trait de jauge
    const level = base - fillProgress * (base - jaugeY);
    const alpha = 0.16 + Math.min(1, t / 30) * 0.45;
    s += `<rect x="${fx - w - 2}" y="${level.toFixed(1)}" width="${2 * w + 4}" height="${(base - level + 1).toFixed(1)}" fill="rgba(232,196,104,${alpha.toFixed(2)})" clip-path="url(#${clipId})"/>`;
    s += `<rect x="${fx - w - 2}" y="${level.toFixed(1)}" width="${2 * w + 4}" height="1.2" fill="rgba(150,200,240,0.8)" clip-path="url(#${clipId})"/>`;

    // entonnoir à solide au-dessus du col
    s += `<path d="M${fx - 20} ${fTop - 22} L${fx + 20} ${fTop - 22} L${fx + 4} ${fTop - 4} L${fx - 4} ${fTop - 4} Z" fill="rgba(90,160,230,0.12)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<line x1="${fx - 3}" y1="${fTop - 4}" x2="${fx - 2.5}" y2="${fTop + 5}" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
    s += `<line x1="${fx + 3}" y1="${fTop - 4}" x2="${fx + 2.5}" y2="${fTop + 5}" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;

    // paroi de la fiole
    s += `<path d="${body}" fill="rgba(90,160,230,0.10)" stroke="var(--chalk-dim)" stroke-width="2"/>`;

    // trait de jauge
    s += `<line x1="${fx - neckHalf - 3}" y1="${jaugeY}" x2="${fx + neckHalf + 3}" y2="${jaugeY}" stroke="var(--coral)" stroke-width="1.6"/>`;
    s += `<text x="${fx + neckHalf + 6}" y="${jaugeY + 3}" font-size="7" fill="var(--coral)">trait de jauge</text>`;

    s += `<text x="${fx}" y="${base + 13}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Fiole jaugée de ${V} mL</text>`;
    return s;
  }

  function render() {
    const t = Number(tRange.value); // g/L
    const V = Number(vRange.value); // mL
    const m = t * (V / 1000);       // g
    svg.innerHTML = balance(m) + flask(t, V);
    readout.innerHTML = `<em>m</em> = <em>t</em> × <em>V</em><sub>solution</sub> = ${ch3Fr(t, 1)} × ${ch3Fr(V / 1000, 3)} = <strong style="color:var(--yellow)">${ch3Fr(m, 2)} g</strong> à peser`;
  }

  function animateFill() {
    if (rafId) cancelAnimationFrame(rafId);
    const t0 = performance.now();
    fillProgress = 0;
    const step = (now) => {
      if (!svg.isConnected) { rafId = 0; return; }
      const p = Math.min(1, (now - t0) / FILL_MS);
      fillProgress = 1 - Math.pow(1 - p, 2);
      render();
      rafId = p < 1 ? requestAnimationFrame(step) : 0;
    };
    rafId = requestAnimationFrame(step);
  }

  ch3Listen(tRange, "input", render);
  ch3Listen(vRange, "input", animateFill);
  render();
}

/* ---------- 4. Préparation par dilution : des gestes au facteur de dilution ----------
   L'élève choisit les gestes (pipette jaugée V_m, fiole jaugée V_f) ;
   c'est l'animation qui fait apparaître le rapport F = V_f / V_m. */
function initDilutionPrep(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const vmRange = document.getElementById(cfg.vmRangeId);
  const vfRange = document.getElementById(cfg.vfRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const vmValue = cfg.vmValueId ? document.getElementById(cfg.vmValueId) : null;
  const vfValue = cfg.vfValueId ? document.getElementById(cfg.vfValueId) : null;
  if (!ch3Ready(svg, vmRange, vfRange, readout)) return;

  const TM = cfg.tm || 20;                    // g/L, concentration de la solution mère (fixée)
  const PIPETTES = [5, 10, 20, 25];           // mL, pipettes jaugées disponibles
  const FIOLES = [50, 100, 200, 250, 500];    // mL, fioles jaugées disponibles (toujours > V_m)
  const arrowId = `${cfg.svgId}-arrow`;

  // les curseurs parcourent l'index de la verrerie disponible
  ch3Range(vmRange, 0, PIPETTES.length - 1, 1);
  ch3Range(vfRange, 0, FIOLES.length - 1, 1);

  // teinte proportionnelle à la concentration ; la mère sert de référence
  function tint(tVal) {
    return 0.15 + Math.min(1, tVal / TM) * 0.75;
  }

  function motherBeaker(x, tVal) {
    const top = 40, base = 122, w = 22, liq = 62;
    const fill = `rgba(232,196,104,${tint(tVal).toFixed(2)})`;
    let s = `<path d="M${x - w} ${liq} L${x - w} ${base - 6} Q${x - w} ${base} ${x - w + 6} ${base} L${x + w - 6} ${base} Q${x + w} ${base} ${x + w} ${base - 6} L${x + w} ${liq} Z" fill="${fill}"/>`;
    s += `<path d="M${x - w} ${top} L${x - w} ${base - 6} Q${x - w} ${base} ${x - w + 6} ${base} L${x + w - 6} ${base} Q${x + w} ${base} ${x + w} ${base - 6} L${x + w} ${top}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<text x="${x}" y="135" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">solution mère</text>`;
    s += `<text x="${x}" y="146" font-size="8" fill="var(--yellow)" text-anchor="middle" font-weight="700">t\u2098 = ${ch3Fr(tVal, 1)} g/L</text>`;
    return s;
  }

  function pipette(x, tVal, vol) {
    const bulbCy = 44, bulbRx = 7, bulbRy = 6;
    const stemTop = 26, tubeBottom = 108, tipY = 118, half = 2.6;
    const fill = `rgba(232,196,104,${tint(tVal).toFixed(2)})`;
    const jaugeY = stemTop + 5;
    let s = "";
    // liquide : tige haute (jusqu'au trait de jauge), bulbe, tube et pointe
    s += `<rect x="${x - half}" y="${jaugeY}" width="${2 * half}" height="${bulbCy - jaugeY}" fill="${fill}"/>`;
    s += `<rect x="${x - half}" y="${bulbCy}" width="${2 * half}" height="${tubeBottom - bulbCy}" fill="${fill}"/>`;
    s += `<ellipse cx="${x}" cy="${bulbCy}" rx="${bulbRx}" ry="${bulbRy}" fill="${fill}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<path d="M${x - half} ${tubeBottom} L${x} ${tipY} L${x + half} ${tubeBottom} Z" fill="${fill}" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    // parois du tube (au-dessus et au-dessous du bulbe)
    [[stemTop, bulbCy - bulbRy], [bulbCy + bulbRy, tubeBottom]].forEach(([y1, y2]) => {
      s += `<line x1="${x - half}" y1="${y1}" x2="${x - half}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1.3"/>`;
      s += `<line x1="${x + half}" y1="${y1}" x2="${x + half}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1.3"/>`;
    });
    // trait de jauge unique de la pipette jaugée
    s += `<line x1="${x - 6}" y1="${jaugeY}" x2="${x + 6}" y2="${jaugeY}" stroke="var(--coral)" stroke-width="1.4"/>`;
    s += `<text x="${x}" y="135" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">pipette</text>`;
    s += `<text x="${x}" y="146" font-size="8" fill="var(--yellow)" text-anchor="middle" font-weight="700">V\u2098 = ${vol} mL</text>`;
    return s;
  }

  function daughterFlask(x, tVal, V) {
    const fTop = 26, base = 122, neckHalf = 4;
    const k = Math.sqrt(Math.min(1, V / 500));
    const w = 11 + 15 * k, bulbH = 32 + 38 * k;
    const neckBot = base - bulbH, h = bulbH, jaugeY = fTop + 10;
    const body = `M${x - neckHalf} ${fTop} L${x - neckHalf} ${neckBot} C${x - neckHalf} ${neckBot + h * 0.25} ${x - w} ${neckBot + h * 0.35} ${x - w} ${neckBot + h * 0.72} Q${x - w} ${base} ${x - w + 7} ${base} L${x + w - 7} ${base} Q${x + w} ${base} ${x + w} ${neckBot + h * 0.72} C${x + w} ${neckBot + h * 0.35} ${x + neckHalf} ${neckBot + h * 0.25} ${x + neckHalf} ${neckBot} L${x + neckHalf} ${fTop}`;
    const clipId = `${cfg.svgId}-fille-clip`;
    let s = `<defs><clipPath id="${clipId}"><path d="${body} Z"/></clipPath></defs>`;
    s += `<rect x="${x - w - 2}" y="${jaugeY}" width="${2 * w + 4}" height="${base - jaugeY + 1}" fill="rgba(232,196,104,${tint(tVal).toFixed(2)})" clip-path="url(#${clipId})"/>`;
    s += `<path d="${body}" fill="rgba(90,160,230,0.10)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += `<line x1="${x - neckHalf - 3}" y1="${jaugeY}" x2="${x + neckHalf + 3}" y2="${jaugeY}" stroke="var(--coral)" stroke-width="1.5"/>`;
    s += `<text x="${x}" y="135" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">fiole ${V} mL</text>`;
    s += `<text x="${x}" y="146" font-size="8" fill="var(--teal)" text-anchor="middle" font-weight="700">t\u0192 = ${ch3Fr(tVal, 2)} g/L</text>`;
    return s;
  }

  function arrow(x1, y1, x2, y2) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1.5" marker-end="url(#${arrowId})"/>`;
  }

  function draw() {
    const Vm = PIPETTES[Math.round(Number(vmRange.value))] || PIPETTES[0];
    const Vf = FIOLES[Math.round(Number(vfRange.value))] || FIOLES[0];
    const ratio = Vf / Vm;
    const tf = TM / ratio;
    const mPrel = TM * Vm / 1000; // g

    if (vmValue) vmValue.textContent = `${Vm} mL`;
    if (vfValue) vfValue.textContent = `${Vf} mL`;

    let s = `<defs><marker id="${arrowId}" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += motherBeaker(30, TM);
    s += arrow(56, 74, 88, 74);
    s += `<text x="72" y="66" font-size="7.5" fill="var(--teal)" text-anchor="middle">1. prélever</text>`;
    s += pipette(102, TM, Vm);
    s += arrow(114, 74, 144, 74);
    s += `<text x="132" y="9" font-size="7.5" fill="var(--teal)" text-anchor="middle">2. verser dans la fiole,</text>`;
    s += `<text x="132" y="18" font-size="7.5" fill="var(--teal)" text-anchor="middle">puis compléter à l'eau</text>`;
    s += daughterFlask(176, tf, Vf);
    s += `<text x="110" y="164" font-size="9" fill="var(--yellow)" text-anchor="middle" font-weight="700">volume : ${Vm} mL → ${Vf} mL, soit × ${ch3Fr(ratio, ratio % 1 ? 1 : 0)}</text>`;

    svg.innerHTML = s;

    const F = ch3Fr(ratio, ratio % 1 ? 1 : 0);
    readout.innerHTML =
      `<div>Masse de soluté prélevée : <em>m</em> = <em>t</em><sub>m</sub> × <em>V</em><sub>m</sub> = ${TM} × ${ch3Fr(Vm / 1000, 3)} = <strong style="color:var(--yellow)">${ch3Fr(mPrel, 2)} g</strong></div>`
      + `<div>Cette masse se conserve dans la fiole : <em>t</em><sub>m</sub> × <em>V</em><sub>m</sub> = <em>t</em><sub>f</sub> × <em>V</em><sub>f</sub></div>`
      + `<div>d'où <em>t</em><sub>f</sub> = <em>t</em><sub>m</sub> × ${ch3Frac("<em>V</em><sub>m</sub>", "<em>V</em><sub>f</sub>")} = ${TM} × ${ch3Frac(Vm, Vf)} = <strong style="color:var(--teal)">${ch3Fr(tf, 2)} g/L</strong></div>`
      + `<div>Le volume a été multiplié par ${F}, la concentration divisée par ${F}.</div>`
      + `<div style="margin-top:10px;border:2px solid rgba(107,191,171,0.5);background:rgba(107,191,171,0.1);border-radius:12px;padding:12px 18px;color:var(--chalk);">Le rapport <em>F</em> = ${ch3Frac("<em>V</em><sub>f</sub>", "<em>V</em><sub>m</sub>")} = ${ch3Frac("<em>t</em><sub>m</sub>", "<em>t</em><sub>f</sub>")} est appelé <strong style="color:var(--teal)">facteur de dilution</strong> : ici <em>F</em> = ${F}, la solution a été diluée ${F} fois.</div>`;
  }
  ch3Listen(vmRange, "input", draw);
  ch3Listen(vfRange, "input", draw);
  draw();
}

/* ---------- 5. Gamme d'étalonnage (échelle de teintes) ---------- */
function initColorScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const sRange = document.getElementById(cfg.sRangeId);
  const readout = document.getElementById(cfg.readoutId);
  if (!ch3Ready(svg, sRange, readout)) return;

  const T_VALUES = [1, 2, 3, 4, 5]; // concentrations arbitraires croissantes des étalons
  const arrowId = `${cfg.svgId}-arrow`;

  function draw() {
    const sVal = Number(sRange.value);
    const lower = Math.max(1, Math.floor(sVal));
    const upper = Math.min(5, Math.ceil(sVal));

    const tubeW = 26, gap = 10, startX = 15, tubeH = 65, y0 = 10;
    let s = `<defs><marker id="${arrowId}" markerWidth="6" markerHeight="6" refX="5" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--teal)"/></marker></defs>`;
    const tubeCenterX = {};
    T_VALUES.forEach((t, i) => {
      const x = startX + i * (tubeW + gap);
      tubeCenterX[t] = x + tubeW / 2;
      const alpha = 0.15 + (t / 5) * 0.75;
      const isBracket = lower !== upper && (t === lower || t === upper);
      const strokeColor = isBracket ? "var(--teal)" : "var(--chalk-dim)";
      s += `<rect x="${x}" y="${y0}" width="${tubeW}" height="${tubeH}" rx="4" fill="rgba(217,122,99,${alpha.toFixed(2)})" stroke="${strokeColor}" stroke-width="${isBracket ? 2.5 : 1.5}"/>`;
      s += `<text x="${x + tubeW / 2}" y="${y0 + tubeH + 13}" font-size="9" fill="${strokeColor}" text-anchor="middle" font-weight="${isBracket ? "700" : "400"}">t${i + 1}</text>`;
    });

    const sCenterX = startX + tubeW / 2 + (sVal - 1) * (tubeW + gap);
    const sY = y0 + tubeH + 40, sTubeH = 55;
    const sAlpha = 0.15 + (sVal / 5) * 0.75;

    (lower === upper ? [lower] : [lower, upper]).forEach((t) => {
      s += `<line x1="${sCenterX.toFixed(1)}" y1="${sY}" x2="${tubeCenterX[t]}" y2="${y0 + tubeH}" stroke="var(--teal)" stroke-width="1.6" stroke-dasharray="3,2" marker-end="url(#${arrowId})"/>`;
    });

    s += `<rect x="${(sCenterX - tubeW / 2).toFixed(1)}" y="${sY}" width="${tubeW}" height="${sTubeH}" rx="4" fill="rgba(217,122,99,${sAlpha.toFixed(2)})" stroke="var(--yellow)" stroke-width="2.5"/>`;
    s += `<text x="${sCenterX.toFixed(1)}" y="${sY + sTubeH + 14}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">S</text>`;

    svg.innerHTML = s;

    const encadrement = lower === upper
      ? `<em>t</em> ≈ t${lower} (même teinte qu'un étalon)`
      : `t${lower} &lt; <em>t</em> &lt; t${upper}`;
    readout.innerHTML = `En comparant la teinte de S à celle des étalons, on obtient l'encadrement : <strong style="color:var(--yellow)">${encadrement}</strong>`;
  }
  ch3Listen(sRange, "input", draw);
  draw();
}

/* ---------- 6. Défi Laboratoire & Verrerie (mode Entraînement) ---------- */
function initLabChallenge(cfg) {
  const promptEl = document.getElementById(cfg.promptId);
  const vmInput = document.getElementById(cfg.vmInputId);
  const pipetteSelect = document.getElementById(cfg.pipetteSelectId);
  const fioleSelect = document.getElementById(cfg.fioleSelectId);
  const newBtn = document.getElementById(cfg.newBtnId);
  const validateBtn = document.getElementById(cfg.validateBtnId);
  const feedback = document.getElementById(cfg.feedbackId);
  if (!ch3Ready(promptEl, vmInput, pipetteSelect, fioleSelect, newBtn, validateBtn, feedback)) return;

  const VF_OPTIONS = [50, 100, 250];
  const VM_OPTIONS = [5, 10, 20];
  const TF_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3];

  let current = null;

  function pickChallenge() {
    let Vf, Vm;
    do {
      Vf = VF_OPTIONS[Math.floor(Math.random() * VF_OPTIONS.length)];
      Vm = VM_OPTIONS[Math.floor(Math.random() * VM_OPTIONS.length)];
    } while (Vm >= Vf);
    const F = Vf / Vm;
    const tf = TF_OPTIONS[Math.floor(Math.random() * TF_OPTIONS.length)];
    const tm = +(tf * F).toFixed(2);
    return { Vf, Vm, F, tf, tm };
  }

  function newChallenge() {
    current = pickChallenge();
    promptEl.innerHTML = `On souhaite préparer un volume <em>V</em><sub>f</sub> = <strong style="color:var(--yellow)">${current.Vf} mL</strong> d'une solution fille de concentration <em>t</em><sub>f</sub> = <strong style="color:var(--yellow)">${ch3Fr(current.tf, 1)} g/L</strong> à partir d'une solution mère de concentration <em>t</em><sub>m</sub> = <strong style="color:var(--yellow)">${ch3Fr(current.tm, 1)} g/L</strong>.`;
    vmInput.value = "";
    pipetteSelect.value = "";
    fioleSelect.value = "";
    feedback.innerHTML = "";
  }

  function validate() {
    if (!current) return;
    const vmGiven = Number(String(vmInput.value).replace(",", "."));
    const vmOk = vmInput.value !== "" && Math.abs(vmGiven - current.Vm) <= 0.3;
    const pipetteOk = pipetteSelect.value === `pipette-${current.Vm}`;
    const fioleOk = fioleSelect.value === `fiole-${current.Vf}`;
    const allOk = vmOk && pipetteOk && fioleOk;

    let msg = "";
    msg += vmOk
      ? `<span style="color:var(--teal);">✅ <em>V</em><sub>m</sub> = <em>V</em><sub>f</sub>/<em>F</em> = ${current.Vf}/${current.F} = ${current.Vm} mL — correct.</span><br>`
      : `<span style="color:var(--coral);">❌ <em>V</em><sub>m</sub> = <em>V</em><sub>f</sub>/<em>F</em> = ${current.Vf}/${current.F} = <strong>${current.Vm} mL</strong> (ta réponse : ${vmInput.value !== "" ? vmInput.value : "—"}).</span><br>`;
    msg += pipetteOk
      ? `<span style="color:var(--teal);">✅ Verrerie de prélèvement adaptée : pipette jaugée ${current.Vm} mL.</span><br>`
      : `<span style="color:var(--coral);">❌ Il fallait une <strong>pipette jaugée de ${current.Vm} mL</strong> : la verrerie jaugée est obligatoire pour une précision analytique (une éprouvette graduée ou une pipette d'un autre volume ne conviennent pas).</span><br>`;
    msg += fioleOk
      ? `<span style="color:var(--teal);">✅ Verrerie de préparation adaptée : fiole jaugée ${current.Vf} mL.</span>`
      : `<span style="color:var(--coral);">❌ Il fallait une <strong>fiole jaugée de ${current.Vf} mL</strong> : un bécher ou une fiole d'un autre volume ne garantissent pas le volume final exact.</span>`;

    feedback.innerHTML = msg;

    if (allOk && cfg.chapterId && cfg.activityId && typeof ProgressStore !== "undefined") {
      ProgressStore.record(cfg.chapterId, cfg.activityId, true);
    }
  }

  ch3Listen(newBtn, "click", newChallenge);
  ch3Listen(validateBtn, "click", validate);
  newChallenge();
}

