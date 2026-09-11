/* Animations du chapitre 1 — 1ère spé PC — "Détermination de la composition d'un système chimique"
   Une animation par sous-partie (a à g). Version 2 : sac plus lisible, tableau
   périodique avec exemple de lecture, schémas de Lewis pour les molécules,
   particules dispersées pour le gaz, lecture n/C mise en valeur pour la dilution. */

/* Les 18 éléments des 3 premières périodes, avec masse molaire atomique
   réelle (g/mol) — mêmes éléments que le tableau périodique du chapitre 9. */
const CH1_ELEMENTS = [
  { symbol: "H", period: 1, group: 1, cat: "h", M: 1.0 },
  { symbol: "He", period: 1, group: 18, cat: "noble", M: 4.0 },
  { symbol: "Li", period: 2, group: 1, cat: "metal", M: 6.9 },
  { symbol: "Be", period: 2, group: 2, cat: "metal", M: 9.0 },
  { symbol: "B", period: 2, group: 13, cat: "nonmetal", M: 10.8 },
  { symbol: "C", period: 2, group: 14, cat: "nonmetal", M: 12.0 },
  { symbol: "N", period: 2, group: 15, cat: "nonmetal", M: 14.0 },
  { symbol: "O", period: 2, group: 16, cat: "nonmetal", M: 16.0 },
  { symbol: "F", period: 2, group: 17, cat: "nonmetal", M: 19.0 },
  { symbol: "Ne", period: 2, group: 18, cat: "noble", M: 20.2 },
  { symbol: "Na", period: 3, group: 1, cat: "metal", M: 23.0 },
  { symbol: "Mg", period: 3, group: 2, cat: "metal", M: 24.3 },
  { symbol: "Al", period: 3, group: 13, cat: "metal", M: 27.0 },
  { symbol: "Si", period: 3, group: 14, cat: "nonmetal", M: 28.1 },
  { symbol: "P", period: 3, group: 15, cat: "nonmetal", M: 31.0 },
  { symbol: "S", period: 3, group: 16, cat: "nonmetal", M: 32.1 },
  { symbol: "Cl", period: 3, group: 17, cat: "nonmetal", M: 35.5 },
  { symbol: "Ar", period: 3, group: 18, cat: "noble", M: 39.9 }
];
const CH1_SLOT_GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
function ch1IsValidSlot(period, col) {
  if (period === 1) return col === 1 || col === 18;
  return CH1_SLOT_GROUPS.includes(col);
}
// code couleur des atomes, réutilisé dans le schéma, la formule brute et le calcul
const CH1_ATOM_COLOR = { C: "var(--chalk)", H: "var(--yellow)", O: "var(--coral)", Al: "var(--teal)" };

/* ---------- a. Le zoom interactif multiniveau sur la mole ---------- */
/* Construction inductive : 1) éprouvette graduée (échelle labo)
   2) nuée de molécules H2O individuelles en forte agitation (échelle atomique)
   3) sacs à cordon scellés contenant des molécules H2O animées (paquetage en moles).
   Widget autonome : chaque instance construit toute son interface dans un
   unique conteneur (cfg.containerId), pour la double instanciation Cours / Entraînement. */

function injectMoleZoomStyles() {
  if (document.getElementById("moleZoomStyles")) return;
  const style = document.createElement("style");
  style.id = "moleZoomStyles";
  style.textContent = `
    .mole-zoom-widget{ font-family:var(--font-body); }
    .mz-stepper{ display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:14px; }
    .mz-step{ display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px 6px; }
    .mz-step-num{ width:30px; height:30px; border-radius:50%; border:2px solid var(--line); color:var(--chalk-dim); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1rem; transition:all .2s ease; }
    .mz-step-label{ font-size:0.68rem; color:var(--chalk-dim); text-transform:uppercase; letter-spacing:0.03em; }
    .mz-step.active .mz-step-num{ border-color:var(--yellow); background:var(--yellow); color:var(--board); }
    .mz-step.active .mz-step-label{ color:var(--yellow); }
    .mz-step-line{ width:34px; height:2px; background:var(--line); margin-bottom:16px; }
    .mz-level{ display:none; border:1px solid var(--line); border-radius:12px; padding:16px; background:rgba(255,255,255,0.015); }
    .mz-level.mz-visible{ display:block; animation:mzFadeIn .35s ease; }
    @keyframes mzFadeIn{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
    .mz-level-title{ font-family:var(--font-display); color:var(--yellow); font-size:1rem; margin-bottom:10px; text-align:center; }
    .mz-level-body{ display:flex; gap:20px; align-items:center; flex-wrap:wrap; justify-content:center; }
    .mz-svg-wrap{ flex:none; width:190px; }
    .mz-svg-wrap svg{ width:100%; height:auto; display:block; animation:mzPop .4s ease; }
    @keyframes mzPop{ from{ opacity:0; transform:scale(0.85);} to{ opacity:1; transform:scale(1);} }
    .mz-side{ flex:1; min-width:220px; text-align:center; }
    .mz-control-bar{ text-align:center; margin-bottom:16px; padding-bottom:14px; border-bottom:1px solid var(--line); }
    .mz-readout-n{ font-family:var(--font-display); font-size:1.25rem; color:var(--yellow); margin-bottom:8px; }
    .mz-range{ width:100%; max-width:280px; }
    .mz-control-hint{ color:var(--chalk-dim); font-size:0.78rem; margin-top:6px; }
    .mz-tube-caption{ color:var(--chalk-dim); font-size:0.82rem; margin:10px 0 8px; }
    .mz-hint{ color:var(--coral); font-size:0.82rem; margin-bottom:14px; line-height:1.4; }
    .mz-action-btn{ font-family:var(--font-display); font-size:0.95rem; background:var(--yellow); color:var(--board); border:none; border-radius:8px; padding:10px 18px; cursor:pointer; transition:transform .15s ease, box-shadow .15s ease; box-shadow:0 2px 0 rgba(0,0,0,0.25); }
    .mz-action-btn:hover{ transform:translateY(-1px); box-shadow:0 3px 0 rgba(0,0,0,0.3); }
    .mz-action-btn:active{ transform:translateY(1px); box-shadow:0 1px 0 rgba(0,0,0,0.3); }
    .mz-micro-count{ font-family:var(--font-display); font-size:1.35rem; color:var(--chalk); margin-bottom:8px; min-height:1.6em; }
    .mz-count-sci{ font-family:var(--font-display); font-size:1.35rem; }
    .mz-count-full{ font-family:monospace; font-size:0.68rem; color:var(--chalk-dim); word-break:break-all; line-height:1.5; margin:6px 0 2px; }
    .mz-count-words{ font-style:italic; color:var(--coral); font-size:0.85rem; margin-top:2px; }
    .mz-micro-msg{ color:var(--coral); font-size:0.85rem; margin-bottom:14px; min-height:2.6em; line-height:1.4; }
    .mz-level-3-body{ flex-direction:column; }
    .mz-sacks-wrap{ display:flex; gap:16px; flex-wrap:wrap; justify-content:center; margin-bottom:14px; }
    .mz-sack{ text-align:center; }
    .mz-sack svg{ width:100px; height:auto; display:block; animation:mzPackIn .35s ease backwards; }
    @keyframes mzPackIn{ from{ opacity:0; transform:translateY(8px) scale(0.85);} to{ opacity:1; transform:translateY(0) scale(1);} }
    .mz-sack-label{ font-family:var(--font-display); color:var(--yellow); font-size:0.88rem; margin-top:2px; }
    .mz-sack-count{ font-size:0.6rem; color:var(--chalk-dim); }
    .mz-formula-eq{ text-align:center; font-family:var(--font-display); font-size:1.02rem; color:var(--chalk); border-top:1px solid var(--line); padding-top:12px; }
    @media (max-width:640px){ .mz-svg-wrap{ width:150px; } .mz-sack svg{ width:82px; } }
  `;
  document.head.appendChild(style);
}

/* Molécule d'eau H2O stylisée : O corail au centre, 2 H chalk, angle ~104,5°.
   Réutilisée à l'échelle atomique (grande, isolée) et dans les sacs (petite, en nuée). */
function mzWaterMolecule(cx, cy, scale, angleDeg) {
  const bondLen = 6.5 * scale;
  const half = (52.25 * Math.PI) / 180;
  const a0 = (angleDeg * Math.PI) / 180;
  const a1 = a0 - half, a2 = a0 + half;
  const h1x = cx + Math.cos(a1) * bondLen, h1y = cy + Math.sin(a1) * bondLen;
  const h2x = cx + Math.cos(a2) * bondLen, h2y = cy + Math.sin(a2) * bondLen;
  const rO = 3.4 * scale, rH = 1.8 * scale;
  return `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${h1x.toFixed(1)}" y2="${h1y.toFixed(1)}" stroke="var(--chalk-dim)" stroke-width="${(0.9 * scale).toFixed(2)}"/>` +
    `<line x1="${cx.toFixed(1)}" y1="${cy.toFixed(1)}" x2="${h2x.toFixed(1)}" y2="${h2y.toFixed(1)}" stroke="var(--chalk-dim)" stroke-width="${(0.9 * scale).toFixed(2)}"/>` +
    `<circle cx="${h1x.toFixed(1)}" cy="${h1y.toFixed(1)}" r="${rH.toFixed(2)}" fill="var(--chalk)"/>` +
    `<circle cx="${h2x.toFixed(1)}" cy="${h2y.toFixed(1)}" r="${rH.toFixed(2)}" fill="var(--chalk)"/>` +
    `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rO.toFixed(2)}" fill="var(--coral)"/>`;
}

const MZ_SVG_NS = "http://www.w3.org/2000/svg";

/* Crée un groupe SVG persistant pour une molécule H2O (5 nœuds), à réutiliser
   d'une frame à l'autre en ne modifiant que ses attributs — évite de reconstruire
   le HTML (et donc de relancer les animations CSS d'entrée) à chaque frame. */
function mzCreateMoleculeEl(scale) {
  const g = document.createElementNS(MZ_SVG_NS, "g");
  const line1 = document.createElementNS(MZ_SVG_NS, "line");
  const line2 = document.createElementNS(MZ_SVG_NS, "line");
  const hC1 = document.createElementNS(MZ_SVG_NS, "circle");
  const hC2 = document.createElementNS(MZ_SVG_NS, "circle");
  const oC = document.createElementNS(MZ_SVG_NS, "circle");
  [line1, line2].forEach(l => { l.setAttribute("stroke", "var(--chalk-dim)"); l.setAttribute("stroke-width", (0.9 * scale).toFixed(2)); });
  [hC1, hC2].forEach(c => { c.setAttribute("r", (1.8 * scale).toFixed(2)); c.setAttribute("fill", "var(--chalk)"); });
  oC.setAttribute("r", (3.4 * scale).toFixed(2));
  oC.setAttribute("fill", "var(--coral)");
  g.appendChild(line1); g.appendChild(line2); g.appendChild(hC1); g.appendChild(hC2); g.appendChild(oC);
  return { g, line1, line2, hC1, hC2, oC };
}
function mzUpdateMoleculeEl(els, cx, cy, scale, angleDeg) {
  const bondLen = 6.5 * scale;
  const half = (52.25 * Math.PI) / 180;
  const a0 = (angleDeg * Math.PI) / 180;
  const a1 = a0 - half, a2 = a0 + half;
  const h1x = cx + Math.cos(a1) * bondLen, h1y = cy + Math.sin(a1) * bondLen;
  const h2x = cx + Math.cos(a2) * bondLen, h2y = cy + Math.sin(a2) * bondLen;
  els.line1.setAttribute("x1", cx); els.line1.setAttribute("y1", cy); els.line1.setAttribute("x2", h1x); els.line1.setAttribute("y2", h1y);
  els.line2.setAttribute("x1", cx); els.line2.setAttribute("y1", cy); els.line2.setAttribute("x2", h2x); els.line2.setAttribute("y2", h2y);
  els.hC1.setAttribute("cx", h1x); els.hC1.setAttribute("cy", h1y);
  els.hC2.setAttribute("cx", h2x); els.hC2.setAttribute("cy", h2y);
  els.oC.setAttribute("cx", cx); els.oC.setAttribute("cy", cy);
}

/* Décompose un grand nombre en 3 chiffres significatifs (cohérent avec les
   3 c.s. de N_A = 6,02×10²³) + son exposant. Réutilisé pour l'écriture décimale
   complète et pour la formulation en toutes lettres. */
function mzDecompose3SF(N) {
  let exp = Math.floor(Math.log10(N) + 1e-9);
  let mantissa = N / Math.pow(10, exp);
  let digits3 = Math.round(mantissa * 100);
  if (digits3 >= 1000) { digits3 = Math.round(digits3 / 10); exp += 1; }
  return { digits3, exp };
}
function mzGroupDigits(str) {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}
/* Écriture décimale complète, sans notation scientifique, avec tous les zéros. */
function mzFullDigitsString(N) {
  if (N < 1) return "0";
  const { digits3, exp } = mzDecompose3SF(N);
  const totalDigits = exp + 1;
  const zerosToAdd = Math.max(0, totalDigits - 3);
  const fullDigits = String(digits3) + "0".repeat(zerosToAdd);
  return mzGroupDigits(fullDigits);
}
/* Formulation en toutes lettres par paliers de milliards (échelle familière,
   plus parlante pour des lycéens que "trilliard" etc.) : ex. "602 000 milliards
   de milliards de molécules". */
function mzWordsPhrase(N, unitLabel) {
  const unit = unitLabel || "molécules";
  if (N < 1e6) return `${mzGroupDigits(String(Math.round(N)))} ${unit}`;
  const { digits3, exp } = mzDecompose3SF(N);
  const k = Math.floor(exp / 9);
  const r = exp - 9 * k; // reste, 0..8
  const leftover = Math.round(digits3 * Math.pow(10, r - 2));
  const leftoverStr = mzGroupDigits(String(leftover));
  if (k === 0) return `${leftoverStr} ${unit}`;
  const chain = Array(k).fill("milliards").join(" de ");
  return `${leftoverStr} ${chain} de ${unit}`;
}

/* Forme du sac à cordon (pochette scellée), réutilisée pour chaque paquet de mole */
const MZ_BAG_BODY = "M38 92 Q26 200 55 213 L145 213 Q174 200 162 92 Z";
const MZ_BAG_NECK_RUFFLE = "M62 92 Q72 74 82 92 Q92 74 100 92 Q108 74 118 92 Q128 74 138 92";

function mzBagShell(half) {
  const dash = half ? ' stroke-dasharray="5,4"' : "";
  const bodyOpacity = half ? 0.03 : 0.06;
  let s = `<path d="${MZ_BAG_BODY}" fill="rgba(107,191,171,${bodyOpacity})" stroke="var(--chalk-dim)" stroke-width="3"${dash}/>`;
  s += `<path d="${MZ_BAG_NECK_RUFFLE}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
  s += `<path d="M55 88 Q100 78 145 88" fill="none" stroke="var(--yellow)" stroke-width="3"/>`;
  s += `<path d="M58 96 Q100 87 142 96" fill="none" stroke="var(--yellow)" stroke-width="2.2"/>`;
  s += `<path d="M92 82 Q78 68 90 60 Q98 68 92 82" fill="none" stroke="var(--yellow)" stroke-width="2.5"/>`;
  s += `<path d="M108 82 Q122 68 110 60 Q102 68 108 82" fill="none" stroke="var(--yellow)" stroke-width="2.5"/>`;
  s += `<circle cx="100" cy="80" r="4" fill="var(--yellow)"/>`;
  return s;
}

function initMoleZoom(cfg) {
  const root = document.getElementById(cfg.containerId);
  if (!root) return;
  injectMoleZoomStyles();

  const MIN_VOL = 9, MAX_VOL = 54;
  const VM_WATER = 18; // mL/mol — repère : 1 mol d'eau ≈ 18 mL (densité 1 g/mL, M = 18 g/mol)
  const uid = cfg.containerId;

  let volume = 18; // mL
  let level = 1;
  let nanoRAF = null, sackRAF = null, countRAF = null;
  let nanoMols = [];
  let sackBags = [];
  let sackDom = []; // références DOM persistantes { bag, moleculeEls } — construites une seule fois par entrée dans l'étape 3

  root.innerHTML = `
    <div class="mz-stepper">
      <button class="mz-step active" data-step="1"><span class="mz-step-num">1</span><span class="mz-step-label">Labo</span></button>
      <div class="mz-step-line"></div>
      <button class="mz-step" data-step="2"><span class="mz-step-num">2</span><span class="mz-step-label">Atomique</span></button>
      <div class="mz-step-line"></div>
      <button class="mz-step" data-step="3"><span class="mz-step-num">3</span><span class="mz-step-label">Paquets</span></button>
    </div>

    <div class="mz-control-bar">
      <div class="mz-readout-n"></div>
      <input type="range" class="mz-range" min="9" max="54" value="18" step="9">
      <div class="mz-control-hint">Volume d'eau prélevé — règle n ici, à n'importe quelle étape : les 3 échelles se mettent à jour ensemble.</div>
    </div>

    <div class="mz-level mz-visible" data-level="1">
      <div class="mz-level-title">🧪 Étape 1 — Au laboratoire (échelle macroscopique)</div>
      <div class="mz-level-body">
        <div class="mz-svg-wrap"><svg class="mz-tube-svg" viewBox="0 0 120 220"></svg></div>
        <div class="mz-side">
          <div class="mz-tube-caption"></div>
          <div class="mz-hint">On mesure facilement un volume ou une masse au laboratoire, mais comment savoir combien de molécules cela représente ?</div>
          <button class="mz-action-btn mz-zoom-btn">Plonger à l'échelle atomique 🔬</button>
        </div>
      </div>
    </div>

    <div class="mz-level" data-level="2">
      <div class="mz-level-title">🔬 Étape 2 — Le vertige du nombre (échelle atomique)</div>
      <div class="mz-level-body">
        <div class="mz-svg-wrap"><svg class="mz-micro-svg" viewBox="0 0 220 220"></svg></div>
        <div class="mz-side">
          <div class="mz-micro-count"></div>
          <div class="mz-micro-msg"></div>
          <button class="mz-action-btn mz-pack-btn">Regrouper par paquets (La mole) 📦</button>
        </div>
      </div>
    </div>

    <div class="mz-level" data-level="3">
      <div class="mz-level-title">📦 Étape 3 — L'outil du chimiste : le paquetage en moles</div>
      <div class="mz-level-body mz-level-3-body">
        <div class="mz-sacks-wrap"></div>
        <div class="mz-formula"></div>
      </div>
    </div>
  `;

  const stepBtns = root.querySelectorAll(".mz-step");
  const levelEls = {
    1: root.querySelector('.mz-level[data-level="1"]'),
    2: root.querySelector('.mz-level[data-level="2"]'),
    3: root.querySelector('.mz-level[data-level="3"]')
  };
  const rangeEl = root.querySelector(".mz-range");
  const readoutN = root.querySelector(".mz-readout-n");
  const tubeSvg = root.querySelector(".mz-tube-svg");
  const tubeCaption = root.querySelector(".mz-tube-caption");
  const zoomBtn = root.querySelector(".mz-zoom-btn");
  const microSvg = root.querySelector(".mz-micro-svg");
  const microCount = root.querySelector(".mz-micro-count");
  const microMsg = root.querySelector(".mz-micro-msg");
  const packBtn = root.querySelector(".mz-pack-btn");
  const sacksWrap = root.querySelector(".mz-sacks-wrap");
  const formulaWrap = root.querySelector(".mz-formula");

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function currentN() { return volume / VM_WATER; }

  /* ----- Étape 1 : éprouvette graduée ----- */
  function drawTube() {
    const n = currentN();
    readoutN.textContent = `V = ${volume} mL → n = ${n.toFixed(1).replace(".", ",")} mol`;

    const tubeTop = 18, tubeBottom = 198, tubeLeft = 42, tubeRight = 78;
    const usableHeight = tubeBottom - tubeTop - 12;
    const liquidTop = tubeBottom - (volume / MAX_VOL) * usableHeight;

    let s = `<path d="M${tubeLeft} ${tubeTop} L${tubeLeft} ${tubeBottom - 10} Q${tubeLeft} ${tubeBottom} ${tubeLeft + 8} ${tubeBottom} L${tubeRight - 8} ${tubeBottom} Q${tubeRight} ${tubeBottom} ${tubeRight} ${tubeBottom - 10} L${tubeRight} ${tubeTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="3"/>`;

    for (let v = 9; v <= 54; v += 9) {
      const y = tubeBottom - (v / MAX_VOL) * usableHeight;
      s += `<line x1="${tubeLeft - 6}" y1="${y}" x2="${tubeLeft}" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
      s += `<text x="${tubeLeft - 9}" y="${y + 3}" font-size="7" fill="var(--chalk-dim)" text-anchor="end">${v}</text>`;
    }

    const clipId = `mzTubeClip-${uid}`;
    s += `<clipPath id="${clipId}"><path d="M${tubeLeft} ${tubeTop} L${tubeLeft} ${tubeBottom - 10} Q${tubeLeft} ${tubeBottom} ${tubeLeft + 8} ${tubeBottom} L${tubeRight - 8} ${tubeBottom} Q${tubeRight} ${tubeBottom} ${tubeRight} ${tubeBottom - 10} L${tubeRight} ${tubeTop} Z"/></clipPath>`;
    s += `<g clip-path="url(#${clipId})">`;
    s += `<rect x="${tubeLeft}" y="${liquidTop}" width="${tubeRight - tubeLeft}" height="${tubeBottom - liquidTop}" fill="rgba(107,191,171,0.35)"/>`;
    s += `<line x1="${tubeLeft}" y1="${liquidTop}" x2="${tubeRight}" y2="${liquidTop}" stroke="var(--teal)" stroke-width="2"/>`;
    s += `</g>`;
    s += `<text x="60" y="212" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">eau pure</text>`;
    tubeSvg.innerHTML = s;

    tubeCaption.innerHTML = `Éprouvette graduée : <strong style="color:var(--chalk);">${volume} mL</strong> d'eau pure prélevés.`;
  }

  /* ----- Étape 2 : nuée de molécules H2O, agitation rapide ----- */
  const NANO_COUNT = 24, NANO_R = 90, NANO_CX = 110, NANO_CY = 110;
  const NANO_MAX_SPEED = 4.2, NANO_JITTER = 0.5, NANO_MARGIN = 8;

  function initNanoMolecules() {
    nanoMols = [];
    for (let i = 0; i < NANO_COUNT; i++) {
      const ang = Math.random() * 2 * Math.PI;
      const rad = Math.sqrt(Math.random()) * NANO_R * 0.85;
      nanoMols.push({
        x: NANO_CX + Math.cos(ang) * rad,
        y: NANO_CY + Math.sin(ang) * rad,
        vx: (Math.random() - 0.5) * 3.4,
        vy: (Math.random() - 0.5) * 3.4,
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 12
      });
    }
  }
  function stepNanoMolecules() {
    nanoMols.forEach(m => {
      m.x += m.vx; m.y += m.vy; m.angle += m.vAngle;
      const dx = m.x - NANO_CX, dy = m.y - NANO_CY;
      const dist = Math.hypot(dx, dy);
      if (dist > NANO_R - NANO_MARGIN) {
        const nx = dx / dist, ny = dy / dist;
        const dot = m.vx * nx + m.vy * ny;
        m.vx -= 2 * dot * nx; m.vy -= 2 * dot * ny;
        m.x = NANO_CX + nx * (NANO_R - NANO_MARGIN);
        m.y = NANO_CY + ny * (NANO_R - NANO_MARGIN);
      }
      m.vx += (Math.random() - 0.5) * NANO_JITTER;
      m.vy += (Math.random() - 0.5) * NANO_JITTER;
      const speed = Math.hypot(m.vx, m.vy);
      if (speed > NANO_MAX_SPEED) { m.vx *= NANO_MAX_SPEED / speed; m.vy *= NANO_MAX_SPEED / speed; }
    });
  }
  function renderNanoMolecules() {
    let s = `<circle cx="${NANO_CX}" cy="${NANO_CY}" r="${NANO_R}" fill="rgba(255,255,255,0.03)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    nanoMols.forEach(m => { s += mzWaterMolecule(m.x, m.y, 1, m.angle); });
    microSvg.innerHTML = s;
  }
  function startNanoAnim() {
    stopNanoAnim();
    initNanoMolecules();
    function frame() {
      stepNanoMolecules();
      renderNanoMolecules();
      nanoRAF = requestAnimationFrame(frame);
    }
    nanoRAF = requestAnimationFrame(frame);
  }
  function stopNanoAnim() {
    if (nanoRAF) cancelAnimationFrame(nanoRAF);
    nanoRAF = null;
  }

  function runCountAnimation() {
    cancelAnimationFrame(countRAF);
    const N = currentN() * NA;
    const start = performance.now();
    microMsg.textContent = "À l'échelle atomique, les molécules sont identiques mais beaucoup trop nombreuses pour être comptées une par une.";
    microCount.innerHTML = `<div class="mz-count-sci">N ≈ <strong style="color:var(--yellow)"></strong></div>`;
    const sciEl = microCount.querySelector("strong");
    function frame(now) {
      const t = now - start;
      let display;
      if (t < 900) {
        const p = t / 900;
        display = String(Math.floor(Math.pow(p, 0.55) * 999));
      } else if (t < 2200) {
        const p = (t - 900) / 1300;
        const logVal = Math.log10(999) + (Math.log10(N) - Math.log10(999)) * easeOutCubic(p);
        display = formatSci(Math.pow(10, logVal));
      } else {
        showFinalCount();
        return;
      }
      sciEl.textContent = display;
      countRAF = requestAnimationFrame(frame);
    }
    countRAF = requestAnimationFrame(frame);
  }
  function showFinalCount() {
    const N = currentN() * NA;
    microMsg.textContent = "À l'échelle atomique, les molécules sont identiques mais beaucoup trop nombreuses pour être comptées une par une.";
    microCount.innerHTML = `
      <div class="mz-count-sci">N ≈ <strong style="color:var(--yellow)">${formatSci(N)}</strong></div>
      <div class="mz-count-full">soit <strong style="color:var(--chalk)">${mzFullDigitsString(N)}</strong> molécules d'eau</div>
      <div class="mz-count-words">— autrement dit environ <strong>${mzWordsPhrase(N)}</strong> !</div>
    `;
  }

  /* ----- Étape 3 : sacs à cordon avec molécules H2O animées à l'intérieur ----- */
  function makeBagParticles(half) {
    const count = half ? 5 : 9;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = half ? 55 + Math.random() * 90 : 45 + Math.random() * 110;
      const y = half ? 162 + Math.random() * 40 : 115 + Math.random() * 85;
      arr.push({
        x, y,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        angle: Math.random() * 360,
        vAngle: (Math.random() - 0.5) * 3
      });
    }
    return arr;
  }
  function stepBagParticles(bag) {
    const minX = 42, maxX = 158;
    const minY = bag.half ? 155 : 108, maxY = 208;
    bag.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.vAngle;
      if (p.x < minX || p.x > maxX) { p.vx *= -1; p.x = Math.max(minX, Math.min(maxX, p.x)); }
      if (p.y < minY || p.y > maxY) { p.vy *= -1; p.y = Math.max(minY, Math.min(maxY, p.y)); }
      p.vx += (Math.random() - 0.5) * 0.12;
      p.vy += (Math.random() - 0.5) * 0.12;
      const speed = Math.hypot(p.vx, p.vy), maxSpeed = 0.9;
      if (speed > maxSpeed) { p.vx *= maxSpeed / speed; p.vy *= maxSpeed / speed; }
    });
  }
  function buildSacks() {
    const n = currentN();
    const fullBags = Math.floor(n + 1e-9);
    const hasHalf = Math.abs(n - fullBags - 0.5) < 1e-9;
    sackBags = [];
    for (let i = 0; i < fullBags; i++) sackBags.push({ half: false, particles: makeBagParticles(false) });
    if (hasHalf) sackBags.push({ half: true, particles: makeBagParticles(true) });

    const N = n * NA;
    formulaWrap.innerHTML = `<div class="mz-formula-eq">n = ${n.toFixed(1).replace(".", ",")} mol &nbsp;·&nbsp; N = n × N<sub>A</sub> = ${n.toFixed(1).replace(".", ",")} × 6,02×10²³ ≈ <strong style="color:var(--yellow)">${formatSci(N)}</strong></div>`;
  }
  function renderSacks() {
    // Ne touche plus au DOM (pas d'innerHTML) : met seulement à jour les
    // attributs des molécules déjà créées par buildSacksDOM(). Voir la note
    // dans buildSacksDOM() pour la raison de ce choix.
    sackDom.forEach(({ bag, moleculeEls }) => {
      bag.particles.forEach((p, idx) => {
        mzUpdateMoleculeEl(moleculeEls[idx], p.x, p.y, 0.85, p.angle);
      });
    });
  }
  function buildSacksDOM() {
    // Construit le DOM des sacs une seule fois (à l'entrée de l'étape 3, ou
    // quand n change) plutôt qu'à chaque frame. Reconstruire un <svg> complet
    // (avec son animation CSS d'entrée) 60x/s empêchait l'animation de se
    // terminer et laissait les sacs bloqués à opacity:0 — c'était la cause du
    // bug "aucune image pour les sacs".
    sacksWrap.innerHTML = "";
    sackDom = [];
    sackBags.forEach(bag => {
      const wrapper = document.createElement("div");
      wrapper.className = "mz-sack";

      const svg = document.createElementNS(MZ_SVG_NS, "svg");
      svg.setAttribute("viewBox", "0 0 200 220");
      svg.innerHTML = mzBagShell(bag.half); // statique : construit une fois, jamais reconstruit ensuite

      const molGroup = document.createElementNS(MZ_SVG_NS, "g");
      const moleculeEls = bag.particles.map(() => {
        const els = mzCreateMoleculeEl(0.85);
        molGroup.appendChild(els.g);
        return els;
      });
      svg.appendChild(molGroup);
      wrapper.appendChild(svg);

      const label = document.createElement("div");
      label.className = "mz-sack-label";
      label.textContent = bag.half ? "0,5 mol" : "1 mol";
      wrapper.appendChild(label);

      const count = document.createElement("div");
      count.className = "mz-sack-count";
      count.textContent = bag.half ? "3,01×10²³ H₂O" : "6,02×10²³ H₂O";
      wrapper.appendChild(count);

      sacksWrap.appendChild(wrapper);
      sackDom.push({ bag, moleculeEls });
    });
    renderSacks(); // positionne les molécules dès la construction, avant la 1ère frame d'animation
  }
  function startSackAnim() {
    stopSackAnim();
    function frame() {
      sackBags.forEach(stepBagParticles);
      renderSacks();
      sackRAF = requestAnimationFrame(frame);
    }
    sackRAF = requestAnimationFrame(frame);
  }
  function stopSackAnim() {
    if (sackRAF) cancelAnimationFrame(sackRAF);
    sackRAF = null;
  }

  /* ----- Navigation entre étapes ----- */
  function goLevel(target, opts) {
    opts = opts || {};
    level = target;
    stepBtns.forEach(b => b.classList.toggle("active", Number(b.dataset.step) === target));
    Object.keys(levelEls).forEach(k => levelEls[k].classList.toggle("mz-visible", Number(k) === target));

    if (target !== 2) stopNanoAnim();
    if (target !== 3) stopSackAnim();

    if (target === 1) drawTube();
    if (target === 2) {
      startNanoAnim();
      if (opts.animateCount) runCountAnimation();
      else showFinalCount();
    }
    if (target === 3) {
      buildSacks();
      buildSacksDOM();
      startSackAnim();
    }
  }

  stepBtns.forEach(b => b.addEventListener("click", () => goLevel(Number(b.dataset.step), { animateCount: false })));
  rangeEl.addEventListener("input", () => {
    volume = Number(rangeEl.value);
    drawTube(); // toujours à jour, même si l'étape 1 n'est pas affichée
    if (level === 2) showFinalCount(); // pas de replay de l'animation vertigineuse à chaque glissement
    if (level === 3) { buildSacks(); buildSacksDOM(); } // nouveau nombre de sacs → on reconstruit le DOM (boucle déjà active)
  });
  zoomBtn.addEventListener("click", () => goLevel(2, { animateCount: true }));
  packBtn.addEventListener("click", () => goLevel(3));

  drawTube();
}

/* ---------- b. Masse molaire atomique (tableau périodique interactif) ---------- */
function initAtomicMolarMass(cfg) {
  const tableEl = document.getElementById(cfg.tableId);
  const readout = document.getElementById(cfg.readoutId);

  function buildTable() {
    tableEl.innerHTML = "";
    for (let period = 1; period <= 3; period++) {
      for (let col = 1; col <= 18; col++) {
        const cell = document.createElement("div");
        if (ch1IsValidSlot(period, col)) {
          const el = CH1_ELEMENTS.find(e => e.period === period && e.group === col);
          cell.className = "ptable-slot cat-" + el.cat;
          cell.textContent = el.symbol;
          cell.dataset.symbol = el.symbol;
          cell.addEventListener("click", () => selectAtom(el.symbol));
        } else {
          cell.className = "ptable-cell empty";
        }
        tableEl.appendChild(cell);
      }
    }
  }

  function selectAtom(symbol) {
    const atom = CH1_ELEMENTS.find(e => e.symbol === symbol);
    tableEl.querySelectorAll(".ptable-slot").forEach(c => c.classList.remove("selected"));
    tableEl.querySelector(`[data-symbol="${symbol}"]`).classList.add("selected");
    readout.innerHTML = `M(${atom.symbol}) = <strong style="color:var(--yellow)">${atom.M.toFixed(1)} g/mol</strong>`;
  }

  buildTable();
  readout.textContent = "Clique sur un élément du tableau périodique pour afficher sa masse molaire atomique.";
}

/* ---------- c. Masse molaire moléculaire (schémas de Lewis) ---------- */
function initMolecularMolarMass(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const formulaEl = document.getElementById(cfg.formulaId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const M = {};
  CH1_ELEMENTS.forEach(e => { M[e.symbol] = e.M; });
  const COL = CH1_ATOM_COLOR;

  function atomDot(x, y, sym, r) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${COL[sym]}" opacity="0.9"/><text x="${x}" y="${y + 4}" font-size="11" fill="var(--board)" text-anchor="middle" font-weight="700">${sym}</text>`;
  }
  function lonePair(x, y, angleDeg) {
    const a = (angleDeg * Math.PI) / 180;
    const dx = Math.cos(a) * 5, dy = Math.sin(a) * 5;
    return `<circle cx="${x - dy}" cy="${y + dx}" r="1.6" fill="var(--chalk)"/><circle cx="${x + dy}" cy="${y - dx}" r="1.6" fill="var(--chalk)"/>`;
  }

  const MOLECULES = {
    CO2: {
      atoms: [{ s: "C", n: 1 }, { s: "O", n: 2 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "O", c: COL.O, sub: "2" }],
      draw() {
        const cy = 60, r = 15;
        let s = "";
        s += `<line x1="65" y1="${cy - 3}" x2="95" y2="${cy - 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="65" y1="${cy + 3}" x2="95" y2="${cy + 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="125" y1="${cy - 3}" x2="155" y2="${cy - 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="125" y1="${cy + 3}" x2="155" y2="${cy + 3}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += lonePair(50, cy, 90) + lonePair(50, cy, -0);
        s += lonePair(170, cy, 90) + lonePair(170, cy, 0);
        s += atomDot(50, cy, "O", r);
        s += atomDot(110, cy, "C", r);
        s += atomDot(170, cy, "O", r);
        return s;
      }
    },
    CH4: {
      atoms: [{ s: "C", n: 1 }, { s: "H", n: 4 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "H", c: COL.H, sub: "4" }],
      draw() {
        const cx = 110, cy = 60, r = 15, rh = 11, d = 42;
        let s = "";
        [[0, -d], [0, d], [-d, 0], [d, 0]].forEach(([dx, dy]) => {
          s += `<line x1="${cx}" y1="${cy}" x2="${cx + dx}" y2="${cy + dy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        });
        s += atomDot(cx, cy, "C", r);
        [[0, -d], [0, d], [-d, 0], [d, 0]].forEach(([dx, dy]) => {
          s += atomDot(cx + dx, cy + dy, "H", rh);
        });
        return s;
      }
    },
    CH3OH: {
      atoms: [{ s: "C", n: 1 }, { s: "H", n: 4 }, { s: "O", n: 1 }],
      formulaParts: [{ t: "C", c: COL.C }, { t: "H", c: COL.H, sub: "3" }, { t: "O", c: COL.O }, { t: "H", c: COL.H }],
      draw() {
        const cCx = 65, cy = 60, r = 15, rh = 11, rO = 15;
        const oX = 125;
        const hoX = 175;
        let s = "";
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx}" y2="${cy - 38}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx - 34}" y2="${cy - 20}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${cCx - 20}" y2="${cy + 34}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${cCx}" y1="${cy}" x2="${oX}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="${oX}" y1="${cy}" x2="${hoX}" y2="${cy}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += lonePair(oX, cy, 90) + lonePair(oX, cy, -90);
        s += atomDot(cCx, cy, "C", r);
        s += atomDot(cCx, cy - 38, "H", rh);
        s += atomDot(cCx - 34, cy - 20, "H", rh);
        s += atomDot(cCx - 20, cy + 34, "H", rh);
        s += atomDot(oX, cy, "O", rO);
        s += atomDot(hoX, cy, "H", rh);
        return s;
      }
    },
    Al2O3: {
      atoms: [{ s: "Al", n: 2 }, { s: "O", n: 3 }],
      formulaParts: [{ t: "Al", c: COL.Al, sub: "2" }, { t: "O", c: COL.O, sub: "3" }],
      draw() {
        const cy = 60, r = 15;
        const xs = [35, 70, 105, 140, 175];
        const labels = ["Al", "O", "Al", "O", "O"];
        let s = "";
        s += `<text x="110" y="20" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">composé ionique — pas de liaison covalente</text>`;
        xs.forEach((x, i) => {
          const sym = labels[i];
          const charge = sym === "Al" ? "3+" : "2−";
          s += atomDot(x, cy, sym, r);
          s += `<text x="${x + 11}" y="${cy - 12}" font-size="8" fill="${COL[sym === 'Al' ? 'Al' : 'O']}" text-anchor="middle">${charge}</text>`;
        });
        return s;
      }
    }
  };
  const keys = ["CO2", "CH4", "CH3OH", "Al2O3"];
  let current = "CO2";

  function draw() {
    const mol = MOLECULES[current];
    svg.innerHTML = mol.draw();

    formulaEl.innerHTML = mol.formulaParts.map(p => `<span style="color:${p.c}">${p.t}${p.sub ? `<sub>${p.sub}</sub>` : ""}</span>`).join("");

    const detail = mol.atoms.map(a => `${a.n > 1 ? a.n + "×" : ""}M(<span style="color:${COL[a.s]}">${a.s}</span>)`).join(" + ");
    const numeric = mol.atoms.map(a => `${a.n > 1 ? a.n + "×" : ""}${M[a.s].toFixed(1)}`).join(" + ");
    const total = mol.atoms.reduce((sum, a) => sum + a.n * M[a.s], 0);
    readout.innerHTML = `M = ${detail} = ${numeric} = <strong style="color:var(--yellow)">${total.toFixed(1)} g/mol</strong>`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- d. Balance à plateau (descend/monte avec la masse) ---------- */
function initMassScale(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const molarRange = document.getElementById(cfg.molarRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_MASS_DISPLAY = 1000;
  const PIVOT_Y = 25, PLATE_Y_MIN = 55, PLATE_Y_MAX = 165;
  const BALL_DX = [0, -14, 14, -24, -4, 16, 26, -30, -10, 10, 30];

  function draw() {
    const n = Number(nRange.value);
    const M = Number(molarRange.value);
    const m = n * M;
    const mClamped = Math.min(m, MAX_MASS_DISPLAY);
    const saturated = m > MAX_MASS_DISPLAY;
    const plateY = PLATE_Y_MIN + (mClamped / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);

    const t = Math.min(1, Math.max(0, (M - 10) / (200 - 10)));
    const radius = 5 + t * 8;
    const color = `rgb(${Math.round(107 + t * (217 - 107))}, ${Math.round(191 + t * (122 - 191))}, ${Math.round(171 + t * (99 - 171))})`;

    let svgContent = "";
    svgContent += `<rect x="40" y="18" width="120" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<rect x="96" y="10" width="8" height="16" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    svgContent += `<line x1="165" y1="${PLATE_Y_MIN}" x2="165" y2="${PLATE_Y_MAX}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    [0, 250, 500, 750, 1000].forEach(v => {
      const y = PLATE_Y_MIN + (v / MAX_MASS_DISPLAY) * (PLATE_Y_MAX - PLATE_Y_MIN);
      svgContent += `<line x1="160" y1="${y}" x2="170" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      svgContent += `<text x="174" y="${y + 3}" font-size="8" fill="var(--chalk-dim)">${v}</text>`;
    });
    const segs = 6, zx = 14;
    let spring = `M100 ${PIVOT_Y + 10}`;
    for (let i = 1; i <= segs; i++) {
      const y = PIVOT_Y + 10 + (plateY - PIVOT_Y - 10) * (i / segs);
      spring += ` L${100 + (i % 2 === 0 ? zx : -zx)} ${y}`;
    }
    svgContent += `<path d="${spring}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    svgContent += `<line x1="140" y1="${plateY}" x2="160" y2="${plateY}" stroke="${saturated ? 'var(--coral)' : 'var(--yellow)'}" stroke-width="2" stroke-dasharray="3,2"/>`;
    svgContent += `<ellipse cx="100" cy="${plateY}" rx="42" ry="7" fill="rgba(0,0,0,0.2)" stroke="${saturated ? 'var(--coral)' : 'var(--chalk-dim)'}" stroke-width="2"/>`;
    const visible = Math.min(n, BALL_DX.length);
    for (let i = 0; i < visible; i++) {
      const stackRow = Math.floor(i / 5);
      svgContent += `<circle cx="${100 + BALL_DX[i]}" cy="${plateY - 8 - stackRow * (radius * 1.4)}" r="${radius}" fill="${color}" stroke="var(--board)" stroke-width="1"/>`;
    }

    svg.innerHTML = svgContent;
    readout.innerHTML = saturated
      ? `n = ${n}, M = ${M} g/mol → m = n × M = ${m} g <strong style="color:var(--coral)">(hors échelle, le plateau touche le fond !)</strong>`
      : `n = ${n}, M = ${M} g/mol → m = n × M = <strong style="color:var(--yellow)">${m} g</strong>`;
  }

  nRange.addEventListener("input", draw);
  molarRange.addEventListener("input", draw);
  draw();
}

/* ---------- e. Quantité de matière d'un gaz (particules dispersées) ---------- */
function initGasMolarVolume(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const VM = 24.0;
  const GASES = {
    N2: { label: "N₂", rParticle: 5, dots: 2, color: "var(--teal)" },
    O2: { label: "O₂", rParticle: 4.5, dots: 2, color: "var(--coral)" },
    Ar: { label: "Ar", rParticle: 6, dots: 1, color: "var(--yellow)" },
    CH4: { label: "CH₄", rParticle: 6.5, dots: 5, color: "var(--chalk)" }
  };
  const keys = ["N2", "O2", "Ar", "CH4"];
  let current = "N2";

  const SCATTER = generateDotsInEllipse(16, 0, 0, 1, 1);

  function draw() {
    const n = Number(nRange.value) / 10;
    const V = n * VM;
    const gas = GASES[current];

    const cx = 110, cy = 100;
    const rContainer = 16 + Math.sqrt(n) * 34;

    let s = `<circle cx="${cx}" cy="${cy}" r="${rContainer}" fill="rgba(255,255,255,0.03)" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;

    const nShown = Math.min(SCATTER.length, Math.max(3, Math.round(3 + n * 2)));
    const usable = rContainer - gas.rParticle - 4;
    for (let i = 0; i < nShown; i++) {
      const [u, v] = SCATTER[i];
      const px = cx + u * usable;
      const py = cy + v * usable;
      if (gas.dots === 1) {
        s += `<circle cx="${px}" cy="${py}" r="${gas.rParticle}" fill="${gas.color}" opacity="0.85"/>`;
      } else if (gas.dots === 2) {
        s += `<circle cx="${px - gas.rParticle * 0.55}" cy="${py}" r="${gas.rParticle * 0.68}" fill="${gas.color}" opacity="0.85"/>`;
        s += `<circle cx="${px + gas.rParticle * 0.55}" cy="${py}" r="${gas.rParticle * 0.68}" fill="${gas.color}" opacity="0.85"/>`;
      } else {
        s += `<circle cx="${px}" cy="${py}" r="${gas.rParticle * 0.6}" fill="${gas.color}" opacity="0.9"/>`;
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
          s += `<circle cx="${px + dx * gas.rParticle * 0.55}" cy="${py + dy * gas.rParticle * 0.55}" r="${gas.rParticle * 0.32}" fill="${gas.color}" opacity="0.7"/>`;
        });
      }
    }
    s += `<text x="${cx}" y="${cy + rContainer + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">gaz : ${gas.label} (représentation symbolique)</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `n = ${n.toFixed(1)} mol de ${gas.label} → V = n × V<sub>m</sub> = ${n.toFixed(1)} × 24,0 = <strong style="color:var(--yellow)">${V.toFixed(1)} L</strong> (même volume qu'avec n'importe quel autre gaz, pour la même quantité de matière)`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  nRange.addEventListener("input", draw);
  draw();
}

/* ---------- f. Concentration en quantité de matière (n et V indépendants) ---------- */
function initConcentration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const MAX_DOTS = 70;
  const normPositions = generateDotsInEllipse(MAX_DOTS, 0, 0, 1, 1);

  function draw() {
    const n = Number(nRange.value) / 100;
    const V = Number(vRange.value) / 100;
    const C = V > 0 ? n / V : 0;
    const dotCount = Math.min(MAX_DOTS, Math.round(n * 23));

    const vNorm = (V - 0.1) / (3 - 0.1);
    const width = 70 + vNorm * 70;
    const height = 90 + vNorm * 90;
    const baseY = 195, centerX = 100;
    const topY = baseY - height;
    const left = centerX - width / 2, right = centerX + width / 2;

    let svgContent = `<path d="M${left} ${topY} L${left} ${baseY - 12} Q${left} ${baseY} ${left + 12} ${baseY} L${right - 12} ${baseY} Q${right} ${baseY} ${right} ${baseY - 12} L${right} ${topY}" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    for (let i = 0; i < dotCount; i++) {
      const [u, v] = normPositions[i];
      const x = centerX + u * (width / 2 - 10);
      const y = baseY - 10 - ((v + 1) / 2) * (height - 20);
      svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="var(--coral)" opacity="0.85"/>`;
    }
    svg.innerHTML = svgContent;

    readout.innerHTML = `n = ${n.toFixed(2)} mol, V = ${V.toFixed(2)} L → C = n / V = <strong style="color:var(--yellow)">${C.toFixed(2)} mol/L</strong>`;
  }
  nRange.addEventListener("input", draw);
  vRange.addEventListener("input", draw);
  draw();
}

/* ---------- g. La dilution (n fixé, on ajoute du volume) — lecture n/C mise en valeur ---------- */
function initDilutionProcess(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const nRange = document.getElementById(cfg.nRangeId);
  const fRange = document.getElementById(cfg.fRangeId);
  const lockBtn = document.getElementById(cfg.lockBtnId);
  const diluteBtn = document.getElementById(cfg.diluteBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);
  const readout = document.getElementById(cfg.readoutId);
  const fRow = document.getElementById(cfg.fRowId);

  const MAX_DOTS = 46;
  const V0 = 1.0;
  const normPositions = generateDotsInEllipse(MAX_DOTS, 0, 0, 1, 1);

  let locked = false;
  let nLocked = 1;
  let animFrame = null;
  let currentF = 1;

  function beakerGeometry(F) {
    const vNorm = Math.min(1, (F - 1) / 4);
    const width = 60 + vNorm * 90;
    const height = 80 + vNorm * 110;
    const baseY = 195, centerX = 100;
    const topY = baseY - height;
    return { width, height, baseY, centerX, topY, left: centerX - width / 2, right: centerX + width / 2 };
  }

  function drawBeaker(F, n) {
    const g = beakerGeometry(F);
    const dotCount = Math.min(MAX_DOTS, Math.round(n * 30));

    let svgContent = `<path d="M${g.left} ${g.topY} L${g.left} ${g.baseY - 12} Q${g.left} ${g.baseY} ${g.left + 12} ${g.baseY} L${g.right - 12} ${g.baseY} Q${g.right} ${g.baseY} ${g.right} ${g.baseY - 12} L${g.right} ${g.topY}" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="3"/>`;
    for (let i = 0; i < dotCount; i++) {
      const [u, v] = normPositions[i];
      const x = g.centerX + u * (g.width / 2 - 10);
      const y = g.baseY - 10 - ((v + 1) / 2) * (g.height - 20);
      svgContent += `<circle cx="${x}" cy="${y}" r="3" fill="var(--coral)" opacity="0.85"/>`;
    }
    svg.innerHTML = svgContent;
  }

  function statBlock(label, value, color) {
    return `<div style="text-align:center;">
      <div style="font-size:0.72rem; color:var(--chalk-dim); text-transform:uppercase; letter-spacing:0.04em;">${label}</div>
      <div style="font-family:var(--font-display); font-size:1.5rem; color:${color};">${value}</div>
    </div>`;
  }

  function updateReadout(F, n) {
    if (!locked) {
      readout.innerHTML = `<p style="color:var(--chalk-dim); text-align:center;">Choisis la quantité de matière n à mettre dans la solution mère (V = ${V0.toFixed(1)} L), puis clique sur « Sélectionner ».</p>`;
      return;
    }
    const V = V0 * F;
    const C = n / V;
    readout.innerHTML = `
      <div style="display:flex; gap:22px; justify-content:center; align-items:flex-end; padding:10px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line);">
        ${statBlock("n (fixe)", n.toFixed(2) + " mol", "var(--teal)")}
        ${statBlock("V (bécher)", V.toFixed(2) + " L", "var(--chalk-dim)")}
        ${statBlock("C (évolue)", C.toFixed(2) + " mol/L", "var(--yellow)")}
      </div>`;
  }

  function draw() {
    const n = locked ? nLocked : Number(nRange.value) / 100;
    drawBeaker(currentF, n);
    updateReadout(currentF, n);
  }

  nRange.addEventListener("input", draw);

  lockBtn.addEventListener("click", () => {
    locked = true;
    nLocked = Number(nRange.value) / 100;
    currentF = 1;
    nRange.disabled = true;
    lockBtn.style.display = "none";
    diluteBtn.style.display = "inline-block";
    fRow.style.display = "none";
    draw();
  });

  diluteBtn.addEventListener("click", () => {
    const targetF = Number(fRange.value) / 10;
    fRow.style.display = "block";
    const startF = currentF;
    const duration = 900;
    const start = performance.now();
    cancelAnimationFrame(animFrame);
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      currentF = startF + (targetF - startF) * t;
      draw();
      if (t < 1) animFrame = requestAnimationFrame(frame);
    }
    animFrame = requestAnimationFrame(frame);
  });

  fRange.addEventListener("input", () => {
    if (!locked) return;
    currentF = Number(fRange.value) / 10;
    draw();
  });

  resetBtn.addEventListener("click", () => {
    locked = false;
    currentF = 1;
    nRange.disabled = false;
    lockBtn.style.display = "inline-block";
    diluteBtn.style.display = "none";
    fRow.style.display = "none";
    fRange.value = 10;
    draw();
  });

  fRow.style.display = "none";
  diluteBtn.style.display = "none";
  draw();
}

/* ---------- h. Protocole expérimental — la dilution étape par étape ---------- */
/* Widget autonome : timeline de 6 pastilles cliquables (pattern tablist/tab/tabpanel,
   roving tabindex, navigation clavier ← → Home End), chaque étape avec schéma SVG,
   encadré Verrerie/Matériel et encadré Vigilance/Bon geste. Même principe de double
   instanciation Cours / Entraînement que les autres animations (cfg.containerId). */

function getCH1DprSteps() {
  return [
  {
    title: "Prélever la solution mère dans un bécher dédié",
    label: "Bécher dédié",
    description:
      "Verse une quantité suffisante de solution mère du flacon d'origine dans un bécher propre et sec, réservé à cet usage. C'est dans <strong>ce bécher</strong> que tu prélèveras ensuite à la pipette.",
    materiel: ["Flacon de solution mère", "Bécher propre et sec (réservé au prélèvement)"],
    vigilance:
      "Ne jamais plonger la pipette — ni la propipette — directement dans le flacon d'origine : la moindre goutte ou impureté introduite contaminerait durablement tout le stock de solution mère.",
    svg: `<svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg">
      ${verrerieG("flacon", { x: 15, y: 5, scale: 0.72 })}
      <path d="M112 78 Q140 78 168 78" stroke="var(--yellow)" stroke-width="2.5" fill="none" marker-end="url(#dprArrowStep1)"/>
      <defs><marker id="dprArrowStep1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="var(--yellow)"/></marker></defs>
      ${verrerieG("becher", { x: 168, y: 10, scale: 0.82 })}
      <text x="65" y="160" text-anchor="middle" font-size="10" fill="var(--chalk-dim)" font-family="var(--font-body)">flacon</text>
      <text x="205" y="160" text-anchor="middle" font-size="10" fill="var(--chalk-dim)" font-family="var(--font-body)">bécher</text>
    </svg>`
  },
  {
    title: "Prélever V<sub>mère</sub> à la pipette jaugée",
    label: "Pipette + propipette",
    description:
      "À l'aide d'une <strong>propipette</strong> (jamais à la bouche), prélève dans le bécher le volume <em>V</em><sub>mère</sub> calculé, avec une pipette jaugée adaptée. Ajuste le bas du ménisque exactement sur le trait de jauge, l'œil à sa hauteur.",
    materiel: ["Pipette jaugée (volume adapté à V<sub>mère</sub>)", "Propipette"],
    vigilance:
      "Vise toujours avec le <strong>bas du ménisque</strong>, œil à hauteur du trait — jamais en regardant par-dessus ou par-dessous, sous peine d'erreur de parallaxe sur le volume prélevé.",
    svg: `<svg viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
      ${verrerieG("propipette", { x: 70, y: 5, scale: 0.85 })}
      ${verrerieG("pipetteJaugee", { x: 70, y: 81.5, scale: 0.85 })}
      <line x1="30" y1="158" x2="64" y2="158" stroke="var(--chalk-dim)" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="26" cy="158" r="2.8" fill="var(--chalk-dim)"/>
      <text x="20" y="152" text-anchor="middle" font-size="9" fill="var(--chalk-dim)" font-family="var(--font-body)">œil</text>
    </svg>`
  },
  {
    title: "Transférer dans la fiole jaugée",
    label: "Transfert en fiole",
    description:
      "Verse le contenu de la pipette dans la fiole jaugée de volume <em>V</em><sub>fille</sub>, <strong>pointe posée contre la paroi inclinée</strong> du col de la fiole, pour un écoulement sans éclaboussure ni bulle.",
    materiel: ["Fiole jaugée de volume V<sub>fille</sub>"],
    vigilance:
      "Laisse s'écouler tout le liquide par gravité ; ne souffle jamais dans la pipette pour évacuer la dernière goutte — ce volume résiduel est déjà pris en compte dans le jaugeage de la pipette.",
    svg: `<svg viewBox="0 0 210 150" xmlns="http://www.w3.org/2000/svg">
      ${verrerieG("pipetteJaugee", { x: 20, y: 5, scale: 0.6 })}
      <path d="M50 107 Q103.4 117 156.8 33.4" stroke="var(--teal)" stroke-width="2" fill="none" stroke-dasharray="2,3"/>
      ${verrerieG("fioleJaugee", { x: 110, y: 5, scale: 0.78 })}
    </svg>`
  },
  {
    title: "Ajouter l'eau distillée aux 2/3 et homogénéiser",
    label: "Eau distillée 2/3",
    description:
      "Complète avec de l'eau distillée à la <strong>pissette</strong> jusqu'aux deux tiers environ du volume de la fiole, puis bouche et effectue une première homogénéisation par mouvements circulaires doux.",
    materiel: ["Pissette d'eau distillée", "Bouchon de la fiole jaugée"],
    vigilance:
      "Ne remplis pas jusqu'au trait dès maintenant : il faut laisser de la place pour ajuster précisément au trait de jauge à l'étape suivante.",
    svg: `<svg viewBox="0 0 210 150" xmlns="http://www.w3.org/2000/svg">
      ${verrerieG("pissette", { x: 0, y: 10, scale: 0.5 })}
      <path d="M60.5 40 Q103.65 48 146.8 28.4" stroke="var(--teal)" stroke-width="2" fill="none" stroke-dasharray="2,3"/>
      ${verrerieG("fioleJaugee", { x: 100, y: 0, scale: 0.78 })}
      <path d="M130.8 105.3 a16 8 0 1 0 32 0 a16 8 0 1 0 -32 0" fill="none" stroke="var(--yellow)" stroke-width="1.8" stroke-dasharray="3,2"/>
      <path d="M159.8 98.3 l4 4 l-4 4" fill="none" stroke="var(--yellow)" stroke-width="1.8"/>
      <text x="105" y="145" text-anchor="middle" font-size="8" fill="var(--chalk-dim)" font-family="var(--font-body)">≈ 2/3 + agitation circulaire</text>
    </svg>`
  },
  {
    title: "Ajuster précisément au trait de jauge",
    label: "Ajustement au trait",
    description:
      "Complète au <strong>compte-gouttes</strong> jusqu'à ce que le bas du ménisque soit tangent au trait de jauge, l'œil parfaitement à l'horizontale du trait pour éviter toute erreur de parallaxe.",
    materiel: ["Compte-gouttes", "Eau distillée"],
    vigilance:
      "Ajoute l'eau goutte à goutte à l'approche du trait : un excès, même minime, oblige à tout recommencer depuis l'étape 1.",
    svg: `<svg viewBox="0 0 210 150" xmlns="http://www.w3.org/2000/svg">
      ${verrerieG("fioleJaugee", { x: 30, y: 5, scale: 0.72 })}
      ${verrerieG("compteGouttes", { x: 128, y: 0, scale: 0.52 })}
      <path d="M154 78 Q113.6 84 73.2 28.04" stroke="var(--coral)" stroke-width="1.6" fill="none" stroke-dasharray="1,3"/>
      <line x1="2" y1="37.4" x2="63.84" y2="37.4" stroke="var(--chalk-dim)" stroke-width="1.5" stroke-dasharray="3,3"/>
      <circle cx="0" cy="37.4" r="2.5" fill="var(--chalk-dim)"/>
      <text x="8" y="31.4" font-size="9" fill="var(--chalk-dim)" font-family="var(--font-body)">œil</text>
    </svg>`
  },
  {
    title: "Boucher et homogénéiser par retournement",
    label: "Bouchage + retournement",
    description:
      "Bouche la fiole jaugée et retourne-la plusieurs fois (une dizaine), en la maintenant fermement, pour homogénéiser parfaitement la solution fille obtenue.",
    materiel: ["Fiole jaugée bouchée"],
    vigilance:
      "Une homogénéisation insuffisante laisse des zones de concentration différente dans la fiole : la solution ne serait pas uniforme, faussant tout prélèvement ultérieur.",
    svg: `<svg viewBox="0 0 210 175" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(14 115 83)">
        ${verrerieG("fioleJaugee", { x: 70, y: 8, scale: 0.75 })}
        ${verrerieG("bouchon", { x: 109, y: 23, scale: 0.75 })}
      </g>
      <path d="M22 46 A32 32 0 1 1 22 80" fill="none" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#dprSpinStep6)"/>
      <defs><marker id="dprSpinStep6" markerWidth="9" markerHeight="9" refX="5" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8 Z" fill="var(--teal)"/></marker></defs>
      <text x="105" y="168" text-anchor="middle" font-size="9" fill="var(--chalk-dim)" font-family="var(--font-body)">×10 retournements</text>
    </svg>`
  }
  ];
}

function injectDilutionProtocolStyles() {
  if (document.getElementById("dilutionProtocolStyles")) return;
  const style = document.createElement("style");
  style.id = "dilutionProtocolStyles";
  style.textContent = `
    .dilution-protocol-widget{ font-family:var(--font-body); }
    .dpr-timeline{ display:flex; align-items:flex-start; justify-content:center; gap:0; margin-bottom:18px; overflow-x:auto; padding:4px 2px 8px; }
    .dpr-step-wrap{ display:flex; align-items:center; flex:none; }
    .dpr-dot{ display:flex; flex-direction:column; align-items:center; gap:5px; background:none; border:none; cursor:pointer; padding:4px 6px; font-family:var(--font-body); }
    .dpr-dot-num{ width:32px; height:32px; border-radius:50%; border:2px solid var(--line); color:var(--chalk-dim); display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-size:1.02rem; transition:all .2s ease; background:var(--board, #12181a); }
    .dpr-dot-label{ font-size:0.62rem; color:var(--chalk-dim); max-width:76px; text-align:center; line-height:1.25; white-space:normal; overflow-wrap:break-word; }
    .dpr-dot:hover .dpr-dot-num{ border-color:var(--teal); }
    .dpr-dot:focus-visible .dpr-dot-num{ outline:2px solid var(--yellow); outline-offset:2px; }
    .dpr-dot.done .dpr-dot-num{ border-color:var(--teal); color:var(--teal); }
    .dpr-dot.active .dpr-dot-num{ border-color:var(--yellow); background:var(--yellow); color:var(--board, #12181a); }
    .dpr-dot.active .dpr-dot-label{ color:var(--yellow); }
    .dpr-connector{ width:26px; height:2px; background:var(--line); margin:0 2px 22px; flex:none; transition:background .2s ease; }
    .dpr-connector.done{ background:var(--teal); }
    .dpr-nav{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
    .dpr-nav-btn{ font-family:var(--font-display); font-size:0.85rem; background:transparent; color:var(--chalk); border:1.5px solid var(--line); border-radius:8px; padding:8px 14px; cursor:pointer; transition:border-color .15s ease, color .15s ease; }
    .dpr-nav-btn:hover:not(:disabled){ border-color:var(--yellow); color:var(--yellow); }
    .dpr-nav-btn:disabled{ opacity:0.35; cursor:not-allowed; }
    .dpr-nav-label{ font-size:0.8rem; color:var(--chalk-dim); text-align:center; flex:1; min-width:120px; }
    .dpr-panel{ border:1px solid var(--line); border-radius:12px; padding:18px; background:rgba(255,255,255,0.015); animation:dprFadeIn .3s ease; }
    @keyframes dprFadeIn{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
    .dpr-title{ font-family:var(--font-display); color:var(--yellow); font-size:1.08rem; margin:0 0 14px; text-align:center; }
    .dpr-body{ display:flex; gap:22px; align-items:flex-start; flex-wrap:wrap; }
    .dpr-schema{ flex:none; width:200px; background:rgba(0,0,0,0.12); border:1px solid var(--line); border-radius:10px; padding:8px; }
    .dpr-schema svg{ width:100%; height:auto; display:block; }
    .dpr-text{ flex:1; min-width:220px; }
    .dpr-desc{ color:var(--chalk); font-size:0.95rem; line-height:1.55; margin:0 0 14px; }
    .dpr-box{ border-radius:8px; padding:12px 14px; font-size:0.86rem; line-height:1.5; margin-bottom:10px; position:relative; }
    .dpr-box:last-child{ margin-bottom:0; }
    .dpr-box-label{ display:block; font-family:var(--font-display); font-size:0.74rem; text-transform:uppercase; letter-spacing:0.03em; margin-bottom:6px; }
    .dpr-materiel{ background:rgba(107,191,171,0.08); border:1px solid rgba(107,191,171,0.28); }
    .dpr-materiel .dpr-box-label{ color:var(--teal); }
    .dpr-materiel ul{ margin:0; padding-left:18px; color:var(--chalk-dim); }
    .dpr-materiel li{ margin-bottom:2px; }
    .dpr-vigilance{ background:rgba(217,122,99,0.08); border:1px solid rgba(217,122,99,0.30); color:var(--chalk-dim); }
    .dpr-vigilance .dpr-box-label{ color:var(--coral); }
    @media (max-width:640px){
      .dpr-body{ flex-direction:column; align-items:center; }
      .dpr-schema{ width:160px; }
      .dpr-dot-label{ display:none; }
      .dpr-nav-label{ order:3; width:100%; }
    }
  `;
  document.head.appendChild(style);
}

function initDilutionProtocol(cfg) {
  const container = document.getElementById(cfg.containerId);
  if (!container) return;

  if (typeof verrerieG !== "function") {
    console.error("[initDilutionProtocol] verrerieG() est introuvable : le fichier verrerie-svg.js doit être chargé AVANT animations-ch1.js. Widget ignoré, le reste de la page continue normalement.");
    container.innerHTML = `<p style="color:var(--chalk-dim); font-size:0.85rem;">⚠️ Schéma indisponible (verrerie-svg.js non chargé).</p>`;
    return;
  }

  let steps;
  try {
    steps = getCH1DprSteps();
  } catch (err) {
    console.error("[initDilutionProtocol] Erreur lors de la construction des étapes :", err);
    container.innerHTML = `<p style="color:var(--chalk-dim); font-size:0.85rem;">⚠️ Schéma indisponible pour le moment.</p>`;
    return;
  }

  injectDilutionProtocolStyles();
  const uid = cfg.containerId;
  let current = 0;

  container.classList.add("dilution-protocol-widget");
  container.innerHTML = `
    <div class="dpr-timeline" role="tablist" aria-label="Étapes du protocole de dilution">
      ${steps.map((s, i) => `
        <div class="dpr-step-wrap">
          <button type="button" class="dpr-dot" role="tab" id="${uid}-tab-${i}" aria-selected="${i === 0 ? "true" : "false"}" aria-controls="${uid}-panel-${i}" data-index="${i}" tabindex="${i === 0 ? "0" : "-1"}">
            <span class="dpr-dot-num">${i + 1}</span>
            <span class="dpr-dot-label">${s.label}</span>
          </button>
          ${i < steps.length - 1 ? '<div class="dpr-connector"></div>' : ""}
        </div>
      `).join("")}
    </div>
    <div class="dpr-nav">
      <button type="button" class="dpr-nav-btn" id="${uid}-prev">← Étape précédente</button>
      <div class="dpr-nav-label" id="${uid}-navlabel"></div>
      <button type="button" class="dpr-nav-btn" id="${uid}-next">Étape suivante →</button>
    </div>
    <div class="dpr-panels">
      ${steps.map((s, i) => `
        <div class="dpr-panel" role="tabpanel" id="${uid}-panel-${i}" aria-labelledby="${uid}-tab-${i}" ${i === 0 ? "" : "hidden"}>
          <h3 class="dpr-title">Étape ${i + 1} — ${s.title}</h3>
          <div class="dpr-body">
            <div class="dpr-schema">${s.svg}</div>
            <div class="dpr-text">
              <p class="dpr-desc">${s.description}</p>
              <div class="dpr-box dpr-materiel">
                <span class="dpr-box-label">🧪 Verrerie / Matériel</span>
                <ul>${s.materiel.map(m => `<li>${m}</li>`).join("")}</ul>
              </div>
              <div class="dpr-box dpr-vigilance">
                <span class="dpr-box-label">⚠️ Vigilance / Bon geste</span>
                ${s.vigilance}
              </div>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  const dots = Array.from(container.querySelectorAll(".dpr-dot"));
  const connectors = Array.from(container.querySelectorAll(".dpr-connector"));
  const panels = Array.from(container.querySelectorAll(".dpr-panel"));
  const prevBtn = container.querySelector(`#${CSS.escape(uid)}-prev`);
  const nextBtn = container.querySelector(`#${CSS.escape(uid)}-next`);
  const navLabel = container.querySelector(`#${CSS.escape(uid)}-navlabel`);

  function render(focusDot) {
    dots.forEach((dot, i) => {
      dot.setAttribute("aria-selected", i === current ? "true" : "false");
      dot.setAttribute("tabindex", i === current ? "0" : "-1");
      dot.classList.toggle("active", i === current);
      dot.classList.toggle("done", i < current);
    });
    connectors.forEach((c, i) => c.classList.toggle("done", i < current));
    panels.forEach((p, i) => { p.hidden = i !== current; });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === steps.length - 1;
    navLabel.textContent = `Étape ${current + 1} / ${steps.length}`;
    if (focusDot) dots[current].focus();
  }

  function goTo(index, focusDot) {
    current = Math.max(0, Math.min(steps.length - 1, index));
    render(focusDot);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goTo(i, false));
    dot.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(current + 1 >= steps.length ? 0 : current + 1, true); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(current - 1 < 0 ? steps.length - 1 : current - 1, true); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0, true); }
      else if (e.key === "End") { e.preventDefault(); goTo(steps.length - 1, true); }
    });
  });

  prevBtn.addEventListener("click", () => goTo(current - 1, false));
  nextBtn.addEventListener("click", () => goTo(current + 1, false));

  render(false);
}
