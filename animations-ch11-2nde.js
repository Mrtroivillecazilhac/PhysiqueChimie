/* Animations du chapitre 11 — 2nde — « Compter les entités : la quantité de matière ».
   Le zoom sur la mole (initMoleZoom) est repris tel quel du chapitre 1 de 1ère.
   Masse d'une entité (initEntityMass) et nombre d'entités (initSampleCount) sont propres au chapitre. */
/* Animations du chapitre 1 — 1ère spé PC — « Composition d'un système chimique »
   Version site (révision) : mêmes fonctions init*, mêmes identifiants HTML.
   b à g réécrites (animées, plus lisibles) ; a (zoom sur la mole) et h (protocole) inchangées. */

/* ---------- Outils d'animation (repris du chapitre 2 de 2nde) ---------- */
const CH1K = (() => {
  const reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = t => { t = clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const prog = (t, a, b) => ease((t - a) / (b - a));
  const fr = (x, d) => { const v = Number(x); return (Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v).toFixed(d).replace(".", ",").replace("-", "−"); };
  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" font-size="${o.size || 13}" fill="${o.fill || "var(--chalk)"}" text-anchor="${o.anchor || "middle"}"` +
    (o.weight ? ` font-weight="${o.weight}"` : "") +
    (o.hand ? ` font-family="Kalam, 'Segoe Print', cursive"` : "") +
    (o.op != null ? ` opacity="${o.op}"` : "") + `>${s}</text>`;
  const ln = (x1, y1, x2, y2, stroke, w = 1.5, extra = "") =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
  const RGB = { teal: [107, 191, 171], coral: [217, 122, 99], yellow: [232, 196, 104], chalk: [242, 237, 225], dim: [201, 194, 176], grey: [216, 216, 220] };
  const mix = (a, b, k) => { k = clamp(k); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`; };
  function active(buttons, i) { buttons.forEach((b, j) => b && b.classList.toggle("active-hist", j === i)); }
  // Boucle d'animation : draw(t) reçoit le temps (s) depuis le dernier play().
  // Le temps est gelé tant que le SVG est caché (onglet non affiché).
  function runner(el, draw) {
    let t0 = 0, last = 0, dur = 0, running = false;
    function frame(now) {
      if (!el.getClientRects().length) { t0 += now - last; last = now; requestAnimationFrame(frame); return; }
      last = now;
      const t = reduce ? 1e4 : (now - t0) / 1000;
      el.innerHTML = draw(t);
      if (!reduce && t <= dur) requestAnimationFrame(frame); else running = false;
    }
    return {
      play(d) {
        t0 = last = performance.now(); dur = d;
        if (!running) { running = true; requestAnimationFrame(frame); }
      },
      kick() { if (!running) this.play(Infinity); }
    };
  }
  // Pas de temps entre deux images (s). 1 = « aller directement à la cible ».
  function clock() {
    let last = null;
    return t => { if (reduce || last == null) { last = t; return 1; } const dt = clamp(t - last, 0, 0.05); last = t; return dt; };
  }
  // Lissage exponentiel vers une cible
  function smooth(st, key, target, dt, rate) {
    if (st[key] == null || dt >= 0.5) st[key] = target;
    else st[key] += (target - st[key]) * (1 - Math.exp(-rate * dt));
    return st[key];
  }
  // Ressort amorti (petit rebond) vers une cible
  function spring(st, key, target, dt, w = 12, z = 0.32) {
    const vk = key + "V";
    if (st[key] == null || dt >= 0.5) { st[key] = target; st[vk] = 0; return target; }
    const n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -w * w * (st[key] - target) - 2 * z * w * st[vk];
      st[vk] += a * h; st[key] += st[vk] * h;
    }
    return st[key];
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function zigzag(x, y1, y2, segs, zx) {
    let d = `M${x} ${y1}`;
    for (let i = 1; i <= segs; i++) {
      const y = y1 + (y2 - y1) * (i / segs);
      d += ` L${(i === segs ? x : x + (i % 2 === 0 ? zx : -zx)).toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }
  return { reduce, clamp, ease, prog, fr, txt, ln, RGB, mix, active, runner, clock, smooth, spring, rng, zigzag };
})();

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


/* ================== Chapitre 11 — 2nde ================== */
var C11 = {
  chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.12)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};
var C11_MNUC = 1.67e-27;
var C11_ATOMS = {
  H: { A: 1, r: 5, fill: "#f2ede1", ink: "#16261f" },
  C: { A: 12, r: 8, fill: "#5d6b64", ink: "#f2ede1" },
  N: { A: 14, r: 8, fill: "#6bbfab", ink: "#16261f" },
  O: { A: 16, r: 8.5, fill: "#d97a63", ink: "#16261f" },
  Fe: { A: 56, r: 9.5, fill: "#b08a5a", ink: "#16261f" }
};
function c11N(v) { return Math.round(v * 100) / 100; }
function c11El(id) { return id ? document.getElementById(id) : null; }
function c11Listen(el, type, fn) {
  if (!el) return;
  el.__c11H = el.__c11H || {};
  if (el.__c11H[type]) el.removeEventListener(type, el.__c11H[type]);
  el.__c11H[type] = fn;
  el.addEventListener(type, fn);
}
function c11Text(x, y, txt, color, size, anchor, hand, weight) {
  return '<text transform="translate(' + c11N(x) + " " + c11N(y) + ') scale(0.25)" font-size="' + c11N(size * 4) + '" fill="' + color
    + '" font-family="' + (hand ? C11.hand : C11.font) + '" text-anchor="' + (anchor || "start") + '"' + (weight ? ' font-weight="' + weight + '"' : "") + ">" + txt + "</text>";
}
var C11_SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
/* 3,01 × 10⁻²⁶ (d décimales sur la mantisse) */
function c11Sci(v, d) {
  if (d === undefined) d = 2;
  var e = Math.floor(Math.log10(Math.abs(v)));
  var m = v / Math.pow(10, e);
  if (Number(m.toFixed(d)) >= 10) { m /= 10; e += 1; }
  var ms = m.toFixed(d).replace(".", ",");
  if (e === 0) return ms;
  return ms + " × 10" + String(e).split("").map(function (c) { return C11_SUP[c] || c; }).join("");
}
function c11Fr(v, d) { return Number(v).toFixed(d).replace(".", ","); }
function c11Strong(t, c) { return '<strong style="color:' + (c || C11.yellow) + '">' + t + "</strong>"; }
function c11Toggle(btns, idx) {
  btns.forEach(function (b, i) {
    if (!b) return;
    var on = i === idx;
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? C11.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? C11.yellow : C11.dim;
  });
}
function ch11Loop(svg, fn) {
  if (svg.__c11Loop) svg.__c11Loop.stop = true;
  var L = { stop: false, t0: performance.now() };
  svg.__c11Loop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - L.t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return L;
}
function c11Ease(x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }
function c11AtomMass(s) { return C11_ATOMS[s].A * C11_MNUC; }
function c11AtomSvg(s, x, y, k, op) {
  var a = C11_ATOMS[s];
  return '<g opacity="' + c11N(op) + '"><circle cx="' + c11N(x) + '" cy="' + c11N(y) + '" r="' + c11N(a.r * k) + '" fill="' + a.fill + '" stroke="#16261f" stroke-width="0.6"/>'
    + (k > 0.5 ? c11Text(x, y + 2.2 * k, s, a.ink, 6 * k, "middle", true, 700) : "") + "</g>";
}

/* ---------- 1. Masse d'une entité : chaque atome ajoute sa masse ---------- */
var C11_MOLECULES = [
  { key: "H2O", label: "H₂O", name: "molécule d'eau", atoms: [["O", 0, 0], ["H", -14, 10], ["H", 14, 10]], count: [["H", 2], ["O", 1]] },
  { key: "CO2", label: "CO₂", name: "molécule de dioxyde de carbone", atoms: [["C", 0, 0], ["O", -18, 0], ["O", 18, 0]], count: [["C", 1], ["O", 2]] },
  { key: "CH4", label: "CH₄", name: "molécule de méthane", atoms: [["C", 0, 0], ["H", 0, -14], ["H", 14, 0], ["H", 0, 14], ["H", -14, 0]], count: [["C", 1], ["H", 4]] },
  { key: "O2", label: "O₂", name: "molécule de dioxygène", atoms: [["O", -9, 0], ["O", 9, 0]], count: [["O", 2]] }
];
function c11MolMass(mol) { return mol.count.reduce(function (s, c) { return s + c[1] * Number(c11AtomMass(c[0]).toPrecision(3)); }, 0); }

function initEntityMass(cfg) {
  var svg = c11El(cfg.svgId), readout = c11El(cfg.readoutId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 130");
  var btns = (cfg.buttonIds || []).map(c11El);
  var cur = 0, loop = null;
  var BX0 = 104, BX1 = 230, BY = 62, BH = 16, UMAX = 8, k = (BX1 - BX0) / UMAX;
  var STEP = 0.55, GROW = 0.45, T0 = 0.25;
  function draw(t) {
    var mol = C11_MOLECULES[cur], s = "";
    var cx = 50, cy = 60;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="rgba(0,0,0,0.25)" stroke="' + C11.faint + '" stroke-width="1"/>';
    var bonds = "";
    mol.atoms.forEach(function (a, i) {
      if (i === 0) return;
      var op = c11Ease((t - T0 - i * STEP) / 0.3);
      var c0 = mol.atoms[mol.key === "O2" ? 0 : 0];
      bonds += '<line x1="' + (cx + c0[1] * 1.3) + '" y1="' + (cy + c0[2] * 1.3) + '" x2="' + (cx + a[1] * 1.3) + '" y2="' + (cy + a[2] * 1.3) + '" stroke="' + C11.dim + '" stroke-width="2" opacity="' + c11N(op) + '"/>';
    });
    s += bonds;
    mol.atoms.forEach(function (a, i) {
      var p = c11Ease((t - T0 - i * STEP) / 0.3);
      var drop = (1 - p) * -14;
      s += c11AtomSvg(a[0], cx + a[1] * 1.3, cy + a[2] * 1.3 + drop, 1.3, p);
    });
    s += c11Text(cx, 116, mol.label, C11.chalk, 13, "middle", true, 700);
    // barre graduée
    s += '<rect x="' + BX0 + '" y="' + BY + '" width="' + (BX1 - BX0) + '" height="' + BH + '" fill="rgba(0,0,0,0.3)" stroke="' + C11.line + '" stroke-width="0.8"/>';
    var left = BX0, total = 0;
    mol.atoms.forEach(function (a, i) {
      var m = Number(c11AtomMass(a[0]).toPrecision(3));
      var g = c11Ease((t - T0 - i * STEP - 0.15) / GROW);
      var w = (m / 1e-26) * k * g;
      if (w > 0.05) s += '<rect x="' + c11N(left) + '" y="' + BY + '" width="' + c11N(w) + '" height="' + BH + '" fill="' + C11_ATOMS[a[0]].fill + '" stroke="#16261f" stroke-width="0.5"/>';
      left += w; total += m * g;
    });
    for (var v = 0; v <= UMAX; v += 2) {
      var x = BX0 + v * k;
      s += '<line x1="' + c11N(x) + '" y1="' + (BY + BH) + '" x2="' + c11N(x) + '" y2="' + (BY + BH + 4) + '" stroke="' + C11.dim + '" stroke-width="0.8"/>';
      s += c11Text(x, BY + BH + 12, String(v), C11.dim, 6.5, "middle", true);
    }
    s += c11Text(BX1, BY + BH + 23, "masse (× 10⁻²⁶ kg)", C11.dim, 6, "end");
    var done = t > T0 + (mol.atoms.length - 1) * STEP + GROW + 0.2;
    s += '<line x1="' + c11N(left) + '" y1="' + (BY - 6) + '" x2="' + c11N(left) + '" y2="' + (BY + BH + 1) + '" stroke="' + C11.yellow + '" stroke-width="1.2"/>';
    var lx = Math.max(BX0 + 40, Math.min(BX1 - 40, left));
    s += c11Text(lx, BY - 11, "m = " + c11Sci(Math.max(total, 1e-30), 2) + " kg", C11.yellow, done ? 10 : 8.5, "middle", true, 700);
    // légende des atomes
    var ly = 12, lx0 = BX0;
    mol.count.forEach(function (c) {
      s += c11AtomSvg(c[0], lx0 + 6, ly, 0.75, 1);
      s += c11Text(lx0 + 15, ly + 2.3, "m(" + c[0] + ") = " + c11Sci(c11AtomMass(c[0]), 2) + " kg", C11.dim, 6.5, "start");
      ly += 13;
    });
    svg.innerHTML = s;
  }
  function select(i) {
    cur = i;
    c11Toggle(btns, i);
    var mol = C11_MOLECULES[i];
    var lit = mol.count.map(function (c) { return (c[1] > 1 ? c[1] + " × " : "") + "<em>m</em>(" + c[0] + ")"; }).join(" + ");
    var num = mol.count.map(function (c) { return (c[1] > 1 ? c[1] + " × " : "") + c11Sci(c11AtomMass(c[0]), 2); }).join(" + ");
    if (readout) readout.innerHTML = "<div>" + mol.label + " : " + mol.name + "</div>"
      + "<div><em>m</em>(" + mol.label + ") = " + lit + "</div>"
      + "<div><em>m</em>(" + mol.label + ") = " + num + "</div>"
      + "<div><em>m</em>(" + mol.label + ") = " + c11Strong(c11Sci(c11MolMass(mol), 2) + " kg") + "</div>";
    if (loop) loop.t0 = performance.now(); else loop = ch11Loop(svg, draw);
  }
  btns.forEach(function (b, i) { c11Listen(b, "click", function () { select(i); }); });
  select(0);
}

/* ---------- 2. Nombre d'entités dans un échantillon ---------- */
var C11_SAMPLES = [
  { key: "eau", label: "Eau", formula: "H₂O", entity: "molécules d'eau", atoms: [["O", 0, 0], ["H", -6, 4], ["H", 6, 4]], m: 3.00e-26, heap: "rgba(120,180,230,0.55)" },
  { key: "carbone", label: "Carbone", formula: "C", entity: "atomes de carbone", atoms: [["C", 0, 0]], m: 2.00e-26, heap: "#3d4743" },
  { key: "fer", label: "Fer", formula: "Fe", entity: "atomes de fer", atoms: [["Fe", 0, 0]], m: 9.35e-26, heap: "#8a7356" }
];
function initSampleCount(cfg) {
  var svg = c11El(cfg.svgId), readout = c11El(cfg.readoutId), range = c11El(cfg.rangeId), out = c11El(cfg.outId);
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 240 130");
  var btns = (cfg.buttonIds || []).map(c11El);
  if (range) { range.min = "1"; range.max = "100"; range.step = "1"; if (!range.value || Number(range.value) < 1) range.value = "18"; }
  var cur = 0, shown = 18, loop = null, last = 0;
  var dots = [];
  for (var i = 0; i < 26; i++) dots.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, a: Math.random() * 6.28, sp: 0.4 + Math.random() * 0.6, r: Math.random() * 360 });
  function draw(t) {
    var sp = C11_SAMPLES[cur], m = Number(range ? range.value : 18);
    var dt = Math.min(0.05, t - last); last = t;
    shown += (m - shown) * Math.min(1, dt * 8);
    var s = "";
    // balance
    var bx = 48, by = 100;
    s += '<rect x="' + (bx - 34) + '" y="' + by + '" width="68" height="18" rx="3" fill="#2a3a33" stroke="' + C11.line + '" stroke-width="0.8"/>';
    s += '<rect x="' + (bx - 22) + '" y="' + (by + 4) + '" width="44" height="10" rx="1.5" fill="#0d1512"/>';
    s += c11Text(bx, by + 12, c11Fr(shown, 0) + " g", C11.yellow, 8, "middle", true, 700);
    s += '<rect x="' + (bx - 30) + '" y="' + (by - 3) + '" width="60" height="3" rx="1" fill="' + C11.dim + '"/>';
    var hr = 6 + 20 * Math.cbrt(shown / 100);
    s += '<path d="M' + c11N(bx - hr * 1.3) + " " + (by - 3) + " Q" + bx + " " + c11N(by - 3 - hr * 1.6) + " " + c11N(bx + hr * 1.3) + " " + (by - 3) + ' Z" fill="' + sp.heap + '" stroke="' + C11.line + '" stroke-width="0.6"/>';
    s += c11Text(bx, by + 28, "échantillon : " + sp.label.toLowerCase(), C11.dim, 6.5, "middle");
    // loupe
    var lx = 150, ly = 58, R = 40;
    var hx = bx + 4, hy = by - 3 - hr * 0.6;
    s += '<line x1="' + c11N(hx) + '" y1="' + c11N(hy) + '" x2="' + c11N(lx - R * 0.86) + '" y2="' + c11N(ly + R * 0.5) + '" stroke="' + C11.faint + '" stroke-width="1" stroke-dasharray="2 2"/>';
    s += '<line x1="' + c11N(hx) + '" y1="' + c11N(hy) + '" x2="' + c11N(lx - R * 0.3) + '" y2="' + c11N(ly - R * 0.95) + '" stroke="' + C11.faint + '" stroke-width="1" stroke-dasharray="2 2"/>';
    s += '<defs><clipPath id="' + cfg.svgId + 'Clip"><circle cx="' + lx + '" cy="' + ly + '" r="' + R + '"/></clipPath></defs>';
    s += '<circle cx="' + lx + '" cy="' + ly + '" r="' + R + '" fill="rgba(0,0,0,0.35)"/>';
    s += '<g clip-path="url(#' + cfg.svgId + 'Clip)">';
    dots.forEach(function (d) {
      var x = lx + (d.x * 0.9 + 0.08 * Math.sin(t * d.sp + d.a)) * R;
      var y = ly + (d.y * 0.9 + 0.08 * Math.cos(t * d.sp * 1.3 + d.a)) * R;
      var ang = d.r + t * 20 * d.sp;
      s += '<g transform="translate(' + c11N(x) + " " + c11N(y) + ") rotate(" + c11N(ang) + ')">';
      sp.atoms.forEach(function (a) { s += c11AtomSvg(a[0], a[1], a[2], 0.5, 1); });
      s += "</g>";
    });
    s += "</g>";
    s += '<circle cx="' + lx + '" cy="' + ly + '" r="' + R + '" fill="none" stroke="' + C11.dim + '" stroke-width="2"/>';
    s += '<line x1="' + c11N(lx + R * 0.72) + '" y1="' + c11N(ly + R * 0.72) + '" x2="' + c11N(lx + R * 1.05) + '" y2="' + c11N(ly + R * 1.05) + '" stroke="' + C11.dim + '" stroke-width="4" stroke-linecap="round"/>';
    s += c11Text(lx, ly + R + 14, "1 entité : " + c11Sci(sp.m, 2) + " kg", C11.dim, 6.5, "middle");
    var N = (shown * 1e-3) / sp.m;
    s += c11Text(232, 16, "N ≈ " + c11Sci(N, 2), C11.yellow, 10, "end", true, 700);
    svg.innerHTML = s;
  }
  function update() {
    var sp = C11_SAMPLES[cur], m = Number(range ? range.value : 18);
    var mk = m * 1e-3, N = mk / Number(sp.m.toPrecision(3));
    var N3 = Number(N.toPrecision(3)), n = N3 / 6.02e23;
    if (out) out.textContent = m + " g";
    if (readout) readout.innerHTML =
      "<div><em>m</em><sub>échantillon</sub> = " + m + " g = " + c11Sci(mk, 2) + " kg</div>"
      + "<div><em>m</em>(" + sp.formula + ") = " + c11Sci(sp.m, 2) + " kg</div>"
      + "<div><em>N</em> = " + c11Sci(mk, 2) + " / " + c11Sci(sp.m, 2) + " = " + c11Strong(c11Sci(N3, 2)) + " " + sp.entity + "</div>"
      + (cfg.showMole ? "<div><em>n</em> = <em>N</em> / <em>N</em><sub>A</sub> = " + c11Strong((n >= 0.1 ? c11Fr(n, 3 - Math.floor(Math.log10(n)) - 1) : c11Sci(n, 2)) + " mol") + "</div>" : "");
  }
  function select(i) { cur = i; c11Toggle(btns, i); update(); }
  btns.forEach(function (b, i) { c11Listen(b, "click", function () { select(i); }); });
  if (range) c11Listen(range, "input", update);
  select(0);
  if (range) shown = Number(range.value);
  loop = ch11Loop(svg, draw);
}
