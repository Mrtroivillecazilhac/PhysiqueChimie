/* Animations du chapitre 4 — 2nde — "Description des mouvements" */

/* ---------- 0. Utilitaire : boucle requestAnimationFrame pilotée par la visibilité ---------- */
/* Suspend automatiquement une animation quand son SVG n'est plus affiché (onglet
   "Cours" / "Entraînement" masqué par mode-tabs, ou simplement scrollé hors
   écran), et la relance dès qu'il redevient visible. */
function makePausableAnimation(el, frameFn) {
  let rafId = null;
  let visible = false;

  function tick(now) {
    frameFn(now);
    rafId = requestAnimationFrame(tick);
  }
  function start() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }
  function stop() {
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  if (el && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible = entry.isIntersecting;
        if (visible) start(); else stop();
      });
    }, { threshold: 0 });
    observer.observe(el);
  } else {
    start(); // repli si IntersectionObserver indisponible
  }

  return { start, stop };
}

/* ---------- Palette (les attributs SVG reçoivent des couleurs en dur) ---------- */
var C4 = { board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0", yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63", line: "rgba(242,237,225,0.25)", hand: "Kalam,cursive" };
function c4Fr(x, d) { return Number(x).toFixed(d).replace(".", ","); }
function c4Sup(n) { const m = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }; return String(n).split("").map(c => m[c] || c).join(""); }
function c4Num(x) {
  if (x === 0) return "0";
  if (x >= 0.01 && x < 1e4) return String(Math.round(x * 10) / 10).replace(".", ",");
  const e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e);
  return c4Fr(m, 1) + " × 10" + c4Sup(e);
}
function c4Active(btn, on) { if (btn) btn.classList.toggle("active-hist", !!on); }
function c4Arrow(id, color, size) { return '<marker id="' + id + '" markerWidth="' + size + '" markerHeight="' + size + '" refX="' + (size - 1) + '" refY="' + (size / 2) + '" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L' + size + ',' + (size / 2) + ' L0,' + size + ' Z" fill="' + color + '"/></marker>'; }

/* ---------- 0a. Référentiel = repère + horloge ---------- */
/* Un ballon est lancé ; ses positions sont relevées toutes les 0,2 s. On peut
   retirer le repère (plus de coordonnées) ou l'horloge (plus de dates) pour
   montrer que les deux sont nécessaires pour décrire le mouvement. */
function initFrameOfReference(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const bR = document.getElementById(cfg.btnRepereId);
  const bH = document.getElementById(cfg.btnHorlogeId);
  if (!svg) return;
  const pfx = cfg.svgId;
  let showR = true, showH = true, start = null, lastTxt = "";
  const O = [30, 140], S = 18, DT = 0.2, T = 1.6, SLOW = 2.2, HOLD = 1.6;
  const pos = (t) => [5 * t, 7.84 * t - 4.9 * t * t];
  const px = ([x, y]) => [O[0] + x * S, O[1] - y * S];

  function frame(now) {
    if (start === null) start = now;
    let tr = ((now - start) / 1000) % (T * SLOW + HOLD);
    const tp = Math.min(T, tr / SLOW);
    const n = Math.floor(tp / DT + 1e-6);
    let s = '<defs>' + c4Arrow(pfx + "_ax", C4.chalk, 7) + '</defs>';
    s += '<rect x="0" y="' + (O[1] + 1) + '" width="240" height="10" fill="rgba(107,191,171,0.14)"/>';
    s += '<text x="236" y="' + (O[1] + 9) + '" font-size="7" fill="' + C4.dim + '" text-anchor="end">sol</text>';
    if (showR) {
      s += '<line x1="' + O[0] + '" y1="' + O[1] + '" x2="214" y2="' + O[1] + '" stroke="' + C4.chalk + '" stroke-width="1.3" marker-end="url(#' + pfx + '_ax)"/>';
      s += '<line x1="' + O[0] + '" y1="' + O[1] + '" x2="' + O[0] + '" y2="36" stroke="' + C4.chalk + '" stroke-width="1.3" marker-end="url(#' + pfx + '_ax)"/>';
      for (let i = 1; i <= 9; i++) { const x = O[0] + i * S; s += '<line x1="' + x + '" y1="' + (O[1] - 2.5) + '" x2="' + x + '" y2="' + (O[1] + 2.5) + '" stroke="' + C4.chalk + '" stroke-width="1"/>'; if (i % 2 === 0) s += '<text x="' + x + '" y="' + (O[1] + 10) + '" font-size="7" fill="' + C4.dim + '" text-anchor="middle">' + i + '</text>'; }
      for (let j = 1; j <= 5; j++) { const y = O[1] - j * S; s += '<line x1="' + (O[0] - 2.5) + '" y1="' + y + '" x2="' + (O[0] + 2.5) + '" y2="' + y + '" stroke="' + C4.chalk + '" stroke-width="1"/><text x="' + (O[0] - 5) + '" y="' + (y + 2.5) + '" font-size="7" fill="' + C4.dim + '" text-anchor="end">' + j + '</text>'; }
      s += '<text x="' + (O[0] - 6) + '" y="' + (O[1] + 10) + '" font-size="8" fill="' + C4.chalk + '">O</text>';
      s += '<text x="216" y="' + (O[1] - 5) + '" font-size="8" fill="' + C4.chalk + '" text-anchor="end">x (m)</text>';
      s += '<text x="' + (O[0] + 5) + '" y="40" font-size="8" fill="' + C4.chalk + '">y (m)</text>';
    }
    for (let k = 0; k <= n; k++) {
      const [x, y] = px(pos(k * DT));
      s += '<circle cx="' + x + '" cy="' + y + '" r="2.8" fill="' + C4.teal + '"' + (k === n ? '' : ' opacity="0.75"') + '/>';
    }
    const [bx, by] = px(pos(tp));
    s += '<circle cx="' + bx + '" cy="' + by + '" r="5" fill="' + C4.coral + '"/><path d="M' + (bx - 5) + ',' + by + ' Q' + bx + ',' + (by - 2.5) + ' ' + (bx + 5) + ',' + by + '" fill="none" stroke="' + C4.board + '" stroke-width="0.8"/>';
    if (showH) {
      s += '<rect x="166" y="8" width="68" height="26" rx="5" fill="' + C4.board2 + '" stroke="' + C4.yellow + '" stroke-width="1.2"/>';
      s += '<text x="200" y="25" text-anchor="middle" font-size="12" fill="' + C4.yellow + '" font-family="' + C4.hand + '">⏱ t = ' + c4Fr(tp, 2) + ' s</text>';
    }
    svg.innerHTML = s;

    const [xm, ym] = pos(n * DT);
    let line = 'Dernière position relevée M<sub>' + n + '</sub> : '
      + 't = ' + (showH ? '<strong style="color:#e8c468">' + c4Fr(n * DT, 1) + ' s</strong>' : '<strong style="color:#d97a63">?</strong>') + ' ; '
      + 'x = ' + (showR ? '<strong style="color:#e8c468">' + c4Fr(xm, 1) + ' m</strong>' : '<strong style="color:#d97a63">?</strong>') + ' ; '
      + 'y = ' + (showR ? '<strong style="color:#e8c468">' + c4Fr(Math.max(0, ym), 1) + ' m</strong>' : '<strong style="color:#d97a63">?</strong>') + '.<br>';
    if (showR && showH) line += '<span style="color:#6bbfab">Repère + horloge = référentiel : chaque position est située et datée.</span>';
    else if (!showR && !showH) line += '<span style="color:#d97a63">Sans repère ni horloge, on voit le ballon bouger, mais on ne peut ni situer ni dater ses positions.</span>';
    else if (!showR) line += '<span style="color:#d97a63">Sans repère, on ne peut pas situer les positions : pas de coordonnées.</span>';
    else line += '<span style="color:#d97a63">Sans horloge, on ne peut pas dater les positions : on ignore à quel instant le ballon y est passé.</span>';
    if (readout && line !== lastTxt) { readout.innerHTML = line; lastTxt = line; }
  }
  function sync() { c4Active(bR, showR); c4Active(bH, showH); }
  if (bR) bR.addEventListener("click", () => { showR = !showR; sync(); });
  if (bH) bH.addEventListener("click", () => { showH = !showH; sync(); });
  sync();
  makePausableAnimation(svg, frame);
}

/* ---------- 0b. Échelles adaptées : la plaque tectonique ---------- */
/* La plaque avance de 2 cm par an. On l'observe pendant 5 unités de temps,
   avec une règle graduée dans l'unité de longueur choisie. */
function initScales(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const bS = document.getElementById(cfg.btnSId), bA = document.getElementById(cfg.btnAnId), bM = document.getElementById(cfg.btnMaId);
  if (!svg) return;
  const SC = {
    s: { tu: "s", tw: ["seconde", "secondes"], lu: "m", lw: "le mètre", per: 6.3e-10, max: 10, ok: false },
    an: { tu: "an", tw: ["an", "ans"], lu: "cm", lw: "le centimètre", per: 2, max: 10, ok: true },
    ma: { tu: "Ma", tw: ["million d'années", "millions d'années"], lu: "km", lw: "le kilomètre", per: 20, max: 100, ok: true }
  };
  const TN = { s: "la seconde", an: "l'année", ma: "le million d'années" };
  const TICK = 0.8, N = 5, HOLD = 1.8, x0 = 92, W = 140, yR = 116;
  let mode = "s", start = null, lastTxt = "";

  function frame(now) {
    if (start === null) start = now;
    const c = SC[mode];
    const tr = ((now - start) / 1000) % (N * TICK + HOLD);
    const k = Math.min(N, tr / TICK), ki = Math.floor(k + 1e-6);
    const X = x0 + Math.min(1.02, c.per * k / c.max) * W;
    let s = "";
    s += '<rect x="' + (X - 84) + '" y="62" width="84" height="34" rx="3" fill="' + C4.board2 + '" stroke="' + C4.dim + '" stroke-width="1.2"/>';
    for (let i = 1; i < 4; i++) s += '<line x1="' + (X - 84) + '" y1="' + (62 + i * 8.5) + '" x2="' + (X - 3) + '" y2="' + (62 + i * 8.5) + '" stroke="' + C4.line + '" stroke-width="1"/>';
    s += '<text x="' + (X - 8) + '" y="82" font-size="10" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="end">plaque</text>';
    s += '<line x1="' + X + '" y1="56" x2="' + X + '" y2="' + (yR - 4) + '" stroke="' + C4.coral + '" stroke-width="1.6" stroke-dasharray="3,2"/>';
    s += '<path d="M' + (X - 4) + ',' + (yR - 9) + ' L' + (X + 4) + ',' + (yR - 9) + ' L' + X + ',' + (yR - 3) + ' Z" fill="' + C4.coral + '"/>';
    s += '<line x1="' + x0 + '" y1="' + yR + '" x2="' + (x0 + W) + '" y2="' + yR + '" stroke="' + C4.chalk + '" stroke-width="1.4"/>';
    for (let i = 0; i <= 10; i++) {
      const x = x0 + i * W / 10;
      s += '<line x1="' + x + '" y1="' + (yR - 4) + '" x2="' + x + '" y2="' + (yR + 4) + '" stroke="' + C4.chalk + '" stroke-width="1"/>';
      if (i % 2 === 0) s += '<text x="' + x + '" y="' + (yR + 15) + '" font-size="8" fill="' + C4.dim + '" text-anchor="middle">' + (i * c.max / 10) + '</text>';
    }
    s += '<text x="' + (x0 + W) + '" y="' + (yR + 27) + '" font-size="8" fill="' + C4.dim + '" text-anchor="end">règle graduée en ' + c.lu + '</text>';
    s += '<rect x="150" y="10" width="84" height="26" rx="5" fill="' + C4.board2 + '" stroke="' + C4.yellow + '" stroke-width="1.2"/>';
    s += '<text x="192" y="28" font-size="12" fill="' + C4.yellow + '" font-family="' + C4.hand + '" text-anchor="middle">t = ' + ki + ' ' + c.tu + (mode === "an" && ki > 1 ? "s" : "") + '</text>';
    s += '<text x="10" y="28" font-size="9" fill="' + C4.dim + '">vitesse réelle : 2 cm par an</text>';
    svg.innerHTML = s;

    const d = c.per * ki;
    const tw = ki > 1 ? c.tw[1] : c.tw[0];
    const txt = 'Unités choisies : <strong style="color:#f2ede1">' + TN[mode] + '</strong> et <strong style="color:#f2ede1">' + c.lw + '</strong>. '
      + 'Après ' + ki + ' ' + tw + ', la plaque a avancé de <strong style="color:#e8c468">' + c4Num(d) + ' ' + c.lu + '</strong>.<br>'
      + (c.ok ? '<span style="color:#6bbfab">Le déplacement se lit sur la règle : échelles adaptées.</span>'
              : '<span style="color:#d97a63">Rien ne bouge à cette échelle : échelles inadaptées au mouvement étudié.</span>');
    if (readout && txt !== lastTxt) { readout.innerHTML = txt; lastTxt = txt; }
  }
  function set(m) { mode = m; start = null; c4Active(bS, m === "s"); c4Active(bA, m === "an"); c4Active(bM, m === "ma"); }
  if (bS) bS.addEventListener("click", () => set("s"));
  if (bA) bA.addEventListener("click", () => set("an"));
  if (bM) bM.addEventListener("click", () => set("ma"));
  set("s");
  makePausableAnimation(svg, frame);
}

/* ---------- 0c. Modéliser la Terre par un point ---------- */
function initPointModel(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const bSph = document.getElementById(cfg.btnSphereId), bSc = document.getElementById(cfg.btnScaleId), bPt = document.getElementById(cfg.btnPointId);
  if (!svg) return;
  const C = [120, 88], RX = 92, RY = 58, PERIOD = 10, ROT = 1.4;
  let mode = "sphere", start = null, trail = [], lastSample = -1;
  const TEXTS = {
    sphere: '<strong style="color:#e8c468">Terre agrandie</strong> (échelle non respectée) : on voit le mouvement de la Terre autour du Soleil <em>et</em> sa rotation sur elle-même (le point corail fait le tour, rotation accélérée).',
    scale: '<strong style="color:#e8c468">À l\'échelle</strong> : le rayon de la Terre (6,4 × 10³ km) est environ 23 000 fois plus petit que celui de son orbite (1,5 × 10⁸ km). Sur ce schéma, elle ferait 0,004 pixel de rayon : elle est indiscernable d\'un point.',
    point: '<strong style="color:#e8c468">Modèle du point</strong> : on suit seulement le centre de la Terre. Sa trajectoire autour du Soleil est bien décrite, mais on a <strong style="color:#d97a63">perdu l\'information sur la rotation</strong> de la Terre sur elle-même.'
  };
  function frame(now) {
    if (start === null) { start = now; trail = []; lastSample = -1; }
    const t = (now - start) / 1000;
    const a = 2 * Math.PI * t / PERIOD;
    const E = [C[0] + RX * Math.cos(a), C[1] - RY * Math.sin(a)];
    const lab = (txt, off, col) => {
      const up = E[1] < C[1], y = up ? E[1] - off - 3 : E[1] + off + 10;
      const x = Math.max(48, Math.min(192, E[0]));
      return '<text x="' + x + '" y="' + y + '" font-size="9" fill="' + col + '" font-family="' + C4.hand + '" text-anchor="middle">' + txt + '</text>';
    };
    let s = '<ellipse cx="' + C[0] + '" cy="' + C[1] + '" rx="' + RX + '" ry="' + RY + '" fill="none" stroke="' + C4.line + '" stroke-width="1.3" stroke-dasharray="4,3"/>';
    s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="13" fill="' + C4.yellow + '"/>';
    s += '<text x="' + C[0] + '" y="' + (C[1] + 25) + '" font-size="10" fill="' + C4.yellow + '" font-family="' + C4.hand + '" text-anchor="middle">Soleil</text>';
    if (mode === "point") {
      const sIdx = Math.floor(t / 0.4);
      if (sIdx > lastSample) { lastSample = sIdx; trail.push(E); if (trail.length > 25) trail.shift(); }
      trail.forEach(([x, y]) => { s += '<circle cx="' + x + '" cy="' + y + '" r="2" fill="' + C4.teal + '" opacity="0.65"/>'; });
      s += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="3.4" fill="' + C4.chalk + '"/>';
      s += lab("centre de la Terre", 6, C4.chalk);
    } else if (mode === "scale") {
      s += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="0.7" fill="' + C4.teal + '"/>';
      s += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="10" fill="none" stroke="' + C4.coral + '" stroke-width="1" stroke-dasharray="2,2"/>';
      s += lab("Terre ici", 12, C4.coral);
    } else {
      const r = 12, ux = (E[0] - C[0]), uy = (E[1] - C[1]), th = Math.atan2(uy, ux);
      s += '<circle cx="' + E[0] + '" cy="' + E[1] + '" r="' + r + '" fill="' + C4.teal + '"/>';
      let p = "";
      for (let k = 0; k <= 16; k++) { const g = th + Math.PI / 2 - Math.PI * k / 16; p += (k ? " L" : "M") + (E[0] + r * Math.cos(g)).toFixed(2) + "," + (E[1] + r * Math.sin(g)).toFixed(2); }
      s += '<path d="' + p + ' Z" fill="rgba(0,0,0,0.45)"/>';
      const ra = -2 * Math.PI * t / ROT;
      s += '<circle cx="' + (E[0] + 0.72 * r * Math.cos(ra)) + '" cy="' + (E[1] + 0.72 * r * Math.sin(ra)) + '" r="2.4" fill="' + C4.coral + '"/>';
      s += lab("Terre (agrandie)", 14, C4.teal);
    }
    svg.innerHTML = s;
  }
  function set(m) {
    mode = m; trail = []; lastSample = -1;
    c4Active(bSph, m === "sphere"); c4Active(bSc, m === "scale"); c4Active(bPt, m === "point");
    if (readout) readout.innerHTML = TEXTS[m];
  }
  if (bSph) bSph.addEventListener("click", () => set("sphere"));
  if (bSc) bSc.addEventListener("click", () => set("scale"));
  if (bPt) bPt.addEventListener("click", () => set("point"));
  set("sphere");
  makePausableAnimation(svg, frame);
}

/* ---------- 1. Types de trajectoire (le système parcourt la trajectoire) ---------- */
/* Le point parcourt la trajectoire en laissant une trace ; les positions
   M1…M5 apparaissent au fur et à mesure, à intervalles de temps égaux. */
function c4Sample(svg, d) {
  svg.innerHTML = '<path id="' + svg.id + '_tmp" d="' + d + '" fill="none"/>';
  const p = document.getElementById(svg.id + "_tmp"), L = p.getTotalLength(), pts = [];
  for (let i = 0; i <= 200; i++) { const q = p.getPointAtLength(L * i / 200); pts.push([q.x, q.y]); }
  return { d, L, pts, at: (f) => pts[Math.max(0, Math.min(200, Math.round(f * 200)))] };
}
function c4Track(tk, f, color) {
  const n = Math.max(1, Math.round(f * 200));
  let s = '<path d="' + tk.d + '" fill="none" stroke="' + C4.dim + '" stroke-width="1.6" stroke-dasharray="4,3" opacity="0.6"/>';
  s += '<polyline points="' + tk.pts.slice(0, n + 1).map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ") + '" fill="none" stroke="' + (color || C4.teal) + '" stroke-width="2.4" stroke-linejoin="round"/>';
  return s;
}

function initTrajectoryTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLine = document.getElementById(cfg.btnLineId);
  const btnCircle = document.getElementById(cfg.btnCircleId);
  const btnCurvy = document.getElementById(cfg.btnCurvyId);
  if (!svg) return;
  const cx = 115, cy = 150, r = 90;
  const PATHS = { line: "M30,150 L200,60", circle: "M" + (cx - r) + "," + cy + " A" + r + "," + r + " 0 0 1 " + (cx + r) + "," + cy, curvy: "M20,160 Q70,20 115,110 T210,50" };
  const texts = {
    line: "<strong style=\"color:#e8c468\">Mouvement rectiligne</strong> : la trajectoire est une portion de droite.",
    circle: "<strong style=\"color:#e8c468\">Mouvement circulaire</strong> : la trajectoire est une portion de cercle.",
    curvy: "<strong style=\"color:#e8c468\">Mouvement curviligne</strong> : la trajectoire n'est ni une droite, ni un cercle."
  };
  const TRAVEL = 2.8, HOLD = 1.4, NP = 5, SUB = ["₁", "₂", "₃", "₄", "₅"];
  let mode = "line", start = null, tk = null;

  function build() {
    tk = c4Sample(svg, PATHS[mode]);
    start = null;
    if (readout) readout.innerHTML = texts[mode] + "<br><span style=\"color:#c9c2b0\">Les positions M₁ à M₅ sont relevées à intervalles de temps égaux ; leur ensemble forme la trajectoire.</span>";
    c4Active(btnLine, mode === "line"); c4Active(btnCircle, mode === "circle"); c4Active(btnCurvy, mode === "curvy");
  }
  function frame(now) {
    if (!tk) return;
    if (start === null) start = now;
    const tr = ((now - start) / 1000) % (TRAVEL + HOLD);
    const f = Math.min(1, tr / TRAVEL);
    let s = c4Track(tk, f);
    const nShow = Math.floor(f * (NP - 1) + 1e-6);
    for (let i = 0; i <= nShow; i++) {
      const q = tk.at(i / (NP - 1));
      s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="4" fill="' + C4.chalk + '"/><text x="' + q[0] + '" y="' + (q[1] - 9) + '" font-size="9" fill="' + C4.dim + '" text-anchor="middle">M' + SUB[i] + '</text>';
    }
    const p = tk.at(f);
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5.5" fill="' + C4.coral + '"/>';
    svg.innerHTML = s;
  }
  if (btnLine) btnLine.addEventListener("click", () => { mode = "line"; build(); });
  if (btnCircle) btnCircle.addEventListener("click", () => { mode = "circle"; build(); });
  if (btnCurvy) btnCurvy.addEventListener("click", () => { mode = "curvy"; build(); });
  build();
  makePausableAnimation(svg, frame);
}

/* ---------- 2. Vecteur déplacement (indépendant de la trajectoire) ---------- */
/* Le système parcourt la trajectoire choisie (compteur de distance), le
   vecteur MM' reste le même. Échelle : 10 unités SVG = 1 m. */
function initDisplacementVector(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btn1 = document.getElementById(cfg.btn1Id);
  const btn2 = document.getElementById(cfg.btn2Id);
  if (!svg) return;
  const pfx = cfg.svgId;
  const M = [40, 150], Mp = [190, 60];
  const P = { traj1: "M40,150 C90,40 140,180 190,60", traj2: "M40,150 C60,190 190,190 190,60" };
  const D = Math.hypot(Mp[0] - M[0], Mp[1] - M[1]) / 10;
  const TRAVEL = 2.6, HOLD = 1.6;
  let mode = "traj1", tk = null, start = null;

  function build() {
    tk = c4Sample(svg, P[mode]);
    start = null;
    if (readout) readout.innerHTML = 'Trajectoire ' + (mode === "traj1" ? "1" : "2") + ' : distance parcourue ≈ <strong style="color:#6bbfab">' + c4Fr(tk.L / 10, 0) + ' m</strong>.<br>'
      + 'Vecteur déplacement <span class="vec">MM\'</span> (jaune) : valeur MM\' = <strong style="color:#e8c468">' + c4Fr(D, 1) + ' m</strong>, quelle que soit la trajectoire.';
    c4Active(btn1, mode === "traj1"); c4Active(btn2, mode === "traj2");
  }
  function frame(now) {
    if (!tk) return;
    if (start === null) start = now;
    const tr = ((now - start) / 1000) % (TRAVEL + HOLD);
    const f = Math.min(1, tr / TRAVEL);
    let s = '<defs>' + c4Arrow(pfx + "_va", C4.yellow, 9) + '</defs>' + c4Track(tk, f);
    s += '<line x1="' + M[0] + '" y1="' + M[1] + '" x2="' + (Mp[0] - 4) + '" y2="' + (Mp[1] + 2.4) + '" stroke="' + C4.yellow + '" stroke-width="2.6" marker-end="url(#' + pfx + '_va)" opacity="' + (f >= 1 ? 1 : 0.35) + '"/>';
    s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="4.5" fill="' + C4.chalk + '"/><circle cx="' + Mp[0] + '" cy="' + Mp[1] + '" r="4.5" fill="' + C4.chalk + '"/>';
    s += '<text x="' + (M[0] - 10) + '" y="' + (M[1] + 16) + '" font-size="11" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="middle">M</text>';
    s += '<text x="' + (Mp[0] + 10) + '" y="' + (Mp[1] - 6) + '" font-size="11" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="middle">M\'</text>';
    s += '<text x="8" y="16" font-size="10" fill="' + C4.teal + '" font-family="' + C4.hand + '">distance parcourue : ' + c4Fr(f * tk.L / 10, 0) + ' m</text>';
    const p = tk.at(f);
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5.5" fill="' + C4.coral + '"/>';
    svg.innerHTML = s;
  }
  if (btn1) btn1.addEventListener("click", () => { mode = "traj1"; build(); });
  if (btn2) btn2.addEventListener("click", () => { mode = "traj2"; build(); });
  build();
  makePausableAnimation(svg, frame);
}

function c4On(el, t, fn) { if (el) el.addEventListener(t, fn); }

/* ---------- 3b. Vitesse moyenne : deux trajets, même durée ---------- */
/* Deux systèmes partent de M au même instant et arrivent en M' au même
   instant par deux trajets différents : même MM', même Δt, donc même
   vecteur vitesse moyenne. Échelle : 10 unités SVG = 1 m. */
function initAverageVelocityTwoPaths(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tR = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const bPlay = cfg.btnPlayId ? document.getElementById(cfg.btnPlayId) : null;
  if (!svg || !tR) return;
  const pfx = cfg.svgId;
  const M = [40, 150], Mp = [190, 60];
  const P1 = "M40,150 C90,40 140,180 190,60", P2 = "M40,150 C60,190 190,190 190,60";
  const D = Math.hypot(Mp[0] - M[0], Mp[1] - M[1]) / 10, ux = (Mp[0] - M[0]) / (D * 10), uy = (Mp[1] - M[1]) / (D * 10);
  const SPEED = 0.4, HOLD = 2.4;
  const tk1 = c4Sample(svg, P1), tk2 = c4Sample(svg, P2);
  let start = null;
  const dtNow = () => Number(tR.value) || 4;
  function vlab(x, y, col) {
    return '<text x="' + x + '" y="' + y + '" font-size="12" fill="' + col + '" font-family="' + C4.hand + '" font-style="italic" font-weight="700">v<tspan font-size="8" dy="2" font-style="normal">moy</tspan></text>'
      + '<line x1="' + x + '" y1="' + (y - 11) + '" x2="' + (x + 18) + '" y2="' + (y - 11) + '" stroke="' + col + '" stroke-width="1.1"/><path d="M' + (x + 18) + ',' + (y - 13) + ' L' + (x + 22) + ',' + (y - 11) + ' L' + (x + 18) + ',' + (y - 9) + ' Z" fill="' + col + '"/>';
  }
  function text() {
    const dt = dtNow(), v = D / dt;
    if (readout) readout.innerHTML = 'Les deux systèmes partent de M et arrivent en M\' <strong style="color:#f2ede1">au même instant</strong> : Δ<em>t</em> = ' + dt + ' s.<br>'
      + '<span style="color:#6bbfab">Trajet 1 : ≈ ' + c4Fr(tk1.L / 10, 0) + ' m parcourus</span> ; <span style="color:#d97a63">trajet 2 : ≈ ' + c4Fr(tk2.L / 10, 0) + ' m parcourus</span>.<br>'
      + 'Même vecteur déplacement, même durée : même vecteur vitesse moyenne, <em>v</em><sub>moy</sub> = <span class="frac"><span class="num">' + c4Fr(D, 1) + ' m</span><span class="den">' + dt + ' s</span></span> = <strong style="color:#e8c468">' + c4Fr(v, 1) + ' m·s⁻¹</strong>.';
  }
  function frame(now) {
    if (start === null) start = now;
    const dt = dtNow(), travel = dt * SPEED;
    const tr = ((now - start) / 1000) % (travel + HOLD);
    const f = Math.min(1, tr / travel);
    let s = '<defs>' + c4Arrow(pfx + "_d", C4.chalk, 8) + c4Arrow(pfx + "_v", C4.yellow, 10) + '</defs>';
    s += c4Track(tk1, f, C4.teal) + c4Track(tk2, f, C4.coral);
    s += '<text x="64" y="96" font-size="11" font-family="' + C4.hand + '" fill="' + C4.teal + '" text-anchor="middle">trajet 1</text>';
    s += '<text x="122" y="186" font-size="11" font-family="' + C4.hand + '" fill="' + C4.coral + '" text-anchor="middle">trajet 2</text>';
    s += '<line x1="' + M[0] + '" y1="' + M[1] + '" x2="' + (Mp[0] - 4) + '" y2="' + (Mp[1] + 2.4) + '" stroke="' + C4.chalk + '" stroke-width="1.4" stroke-dasharray="3,3" opacity="0.7"/>';
    if (f >= 1) {
      const L = D / dt * 13;
      const ex = M[0] + ux * L, ey = M[1] + uy * L;
      s += '<line x1="' + M[0] + '" y1="' + M[1] + '" x2="' + ex + '" y2="' + ey + '" stroke="' + C4.yellow + '" stroke-width="3" marker-end="url(#' + pfx + '_v)"/>';
      s += vlab(ex - 30, ey - 6, C4.yellow);
    }
    s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="4.5" fill="' + C4.chalk + '"/><circle cx="' + Mp[0] + '" cy="' + Mp[1] + '" r="4.5" fill="' + C4.chalk + '"/>';
    s += '<text x="' + (M[0] - 11) + '" y="' + (M[1] + 16) + '" font-size="12" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="middle">M</text>';
    s += '<text x="' + (Mp[0] + 11) + '" y="' + (Mp[1] - 6) + '" font-size="12" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="middle">M\'</text>';
    const p1 = tk1.at(f), p2 = tk2.at(f);
    s += '<circle cx="' + p1[0] + '" cy="' + p1[1] + '" r="5.5" fill="' + C4.teal + '" stroke="' + C4.board + '" stroke-width="1.2"/>';
    s += '<circle cx="' + p2[0] + '" cy="' + p2[1] + '" r="5.5" fill="' + C4.coral + '" stroke="' + C4.board + '" stroke-width="1.2"/>';
    s += '<rect x="6" y="6" width="74" height="24" rx="5" fill="' + C4.board2 + '" stroke="' + C4.yellow + '" stroke-width="1.2"/>';
    s += '<text x="43" y="23" font-size="12" fill="' + C4.yellow + '" font-family="' + C4.hand + '" text-anchor="middle">t = ' + c4Fr(f * dt, 1) + ' s</text>';
    svg.innerHTML = s;
  }
  c4On(tR, "input", () => { start = null; text(); });
  c4On(bPlay, "click", () => { start = null; });
  text();
  makePausableAnimation(svg, frame);
}

/* ---------- 3. Calculateur de vitesse moyenne ---------- */
function initAverageVelocity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const tRange = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const pfx = cfg.svgId;

  function draw() {
    const d = Number(dRange.value); // m
    const t = Number(tRange.value); // s
    const v = t > 0 ? d / t : 0;

    const x0 = 20, y0 = 90, maxLen = 190;
    const len = Math.min(maxLen, (d / 30) * maxLen);
    let s = `<defs><marker id="${pfx}_avArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0 + len}" y2="${y0}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#${pfx}_avArrow)"/>`;
    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--chalk)"/>`;
    s += `<text x="${x0}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    s += `<text x="${x0 + len}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M'</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `<span class="vec">v<sub>moy</sub></span> = <span class="frac"><span class="num"><span class="vec">MM'</span></span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${d} m</span><span class="den">${t} s</span></span> = <strong style="color:var(--yellow)">${v.toFixed(1)} m/s</strong>`;
  }
  dRange.addEventListener("input", draw);
  tRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Vecteur vitesse en un point (tangence) ---------- */
/* Même logique que initVelocityVector en 1ère spé : trajectoire parabolique
   fluide, slider temporel explicite, vecteur déplacement MM' (qui devient
   tangent) affiché en parallèle du vecteur vitesse v (longueur étalonnée,
   fixe). Adapté au niveau 2nde : pas d'indices M_i/M_i+1, on garde les
   notations M / M' utilisées dans tout le reste du chapitre. Le point se
   déplace aussi réellement de M à M' à l'écran, en un temps d'autant plus
   long que l'écart Δt choisi est grand — pour rendre concret le lien entre
   « Δt » et « durée du trajet », qui restait abstrait sur un simple schéma
   statique. */
function initVelocityTangent(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const gapRange = document.getElementById(cfg.gapRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const formulaEl = cfg.formulaId ? document.getElementById(cfg.formulaId) : null;
  const btnPlay = cfg.btnPlayId ? document.getElementById(cfg.btnPlayId) : null;
  const pfx = cfg.svgId;

  // trajectoire parabolique (arc de type "tir"), allant du sol au sol
  function pos(t) { return [25 + 15 * t, 190 - 2 * t * (12 - t)]; }

  const T0 = 5;
  let playRafId = null;

  // movingT : position (en paramètre t de la trajectoire) du point mobile
  // pendant la démonstration animée ; null = pas d'animation en cours, on
  // affiche juste le schéma statique (M, M', les deux vecteurs).
  function render(movingT) {
    const gap = Number(gapRange.value) / 10; // écart temporel, en unités de Δt (0.2 à 6.0)
    const [x0, y0] = pos(T0);
    const [x1, y1] = pos(T0 + gap);

    let s = "";
    // trajectoire complète, en pointillé fin
    let path = `M${pos(0)[0]} ${pos(0)[1]}`;
    for (let t = 0.5; t <= 12; t += 0.5) path += ` L${pos(t)[0]} ${pos(t)[1]}`;
    s += `<path d="${path}" fill="none" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="3,3"/>`;

    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;
    s += `<defs>
      <marker id="${pfx}_dispArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk)"/></marker>
      <marker id="${pfx}_vArrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="var(--yellow)"/></marker>
    </defs>`;

    // vecteur déplacement MM', en blanc — c'est lui qui devient tangent
    s += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="var(--chalk)" stroke-width="2" marker-end="url(#${pfx}_dispArrow)"/>`;
    s += `<circle cx="${x1}" cy="${y1}" r="4" fill="var(--teal)"/>`;
    s += `<text x="${x1 + ux * 10}" y="${y1 + uy * 10}" font-size="9" fill="var(--teal)" text-anchor="middle">M'</text>`;

    // vecteur vitesse, en jaune — même direction, longueur FIXE (échelle
    // indépendante de la position de M', ne s'arrête pas forcément dessus)
    const V_SCALE = 50;
    const vx = x0 + ux * V_SCALE, vy = y0 + uy * V_SCALE;
    s += `<line x1="${x0}" y1="${y0}" x2="${vx}" y2="${vy}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#${pfx}_vArrow)"/>`;
    s += `<text x="${vx + ux * 14}" y="${vy + uy * 14}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--coral)"/><text x="${x0 - 10}" y="${y0 + 4}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;

    // point mobile : parcourt réellement MM' pendant la démonstration animée
    if (movingT !== null) {
      const [mx, my] = pos(movingT);
      s += `<circle cx="${mx}" cy="${my}" r="6.5" fill="none" stroke="var(--chalk)" stroke-width="2"/>`;
      s += `<circle cx="${mx}" cy="${my}" r="2.2" fill="var(--chalk)"/>`;
    }

    svg.innerHTML = s;

    const isTangent = gap < 0.6;
    readout.innerHTML = `Écart temporel = ${gap.toFixed(1)} × Δt → le <strong style="color:var(--chalk)">vecteur déplacement <span class="vec">MM'</span></strong> ${isTangent ? 'est maintenant tangent à la trajectoire' : 'coupe encore la trajectoire'}. Le <strong style="color:var(--yellow)">vecteur vitesse <span class="vec">v</span></strong> a cette même direction, mais une longueur fixe (échelle indépendante). Regarde aussi le point (cercle blanc) parcourir M→M' : plus l'écart est grand, plus le trajet prend de temps.`;

    if (formulaEl) {
      formulaEl.innerHTML = `<span class="vec">v</span> = <span class="frac"><span class="num"><span class="vec">MM'</span></span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${len.toFixed(0)} m</span><span class="den">${gap.toFixed(1)} Δt</span></span>`;
    }
  }

  function draw() { render(null); } // mise à jour statique, pendant qu'on fait glisser le curseur

  // démonstration animée : le point met réellement plus ou moins de temps
  // (à l'écran) à parcourir M→M' selon l'écart Δt choisi
  function playMotion() {
    if (playRafId !== null) { cancelAnimationFrame(playRafId); playRafId = null; }
    const gap = Number(gapRange.value) / 10;
    const DURATION = 150 + gap * 220; // ms — un Δt plus grand prend plus de temps à l'écran
    const startTs = Date.now();

    function step() {
      const progress = Math.min(1, (Date.now() - startTs) / DURATION);
      render(T0 + gap * progress);
      if (progress < 1) {
        playRafId = requestAnimationFrame(step);
      } else {
        playRafId = null;
        render(null); // fin de la démonstration : retour au schéma statique
      }
    }
    playRafId = requestAnimationFrame(step);
  }

  gapRange.addEventListener("input", draw);   // retour visuel immédiat pendant le glissement
  gapRange.addEventListener("change", playMotion); // relâchement du curseur → on rejoue le trajet
  if (btnPlay) btnPlay.addEventListener("click", playMotion);

  playMotion(); // petite démonstration dès le chargement
}

/* ---------- 5. Nature du mouvement (accéléré / décéléré / uniforme) ---------- */
/* Animation continue (inspirée de initSpeedVariation en 1ère spé) : une bille
   traverse la piste, avec son vecteur vitesse v qui grandit ou rétrécit en
   direct. Un bouton "points fantômes" active un affichage type
   chronophotographie : des points sont déposés à intervalles de temps Δt
   égaux pour visualiser l'écartement (accéléré) ou le resserrement
   (décéléré) des positions successives. */
function initMotionNature(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const btnUniform = document.getElementById(cfg.btnUniformId);
  const btnGhost = cfg.ghostToggleId ? document.getElementById(cfg.ghostToggleId) : null;
  const pfx = cfg.svgId;

  // x(t) = x0 + v0.t + 0,5.a.t² ; v(t) = v0 + a.t — chaque scénario est
  // calibré pour traverser exactement la piste (20 → 210 px) en durée T
  const SCENARIOS = {
    accel: { v0: 20, a: 60.3, T: 2.2, verb: "augmente", label: "Mouvement accéléré" },
    decel: { v0: 152.7, a: -60.3, T: 2.2, verb: "diminue", label: "Mouvement décéléré" },
    uniform: { v0: 86.4, a: 0, T: 2.2, verb: "reste la même", label: "Mouvement uniforme" }
  };
  const GHOST_NOTES = {
    accel: " Les points fantômes, déposés à intervalles de temps Δt égaux, s'écartent de plus en plus.",
    decel: " Les points fantômes, déposés à intervalles de temps Δt égaux, se resserrent de plus en plus.",
    uniform: " Les points fantômes, déposés à intervalles de temps Δt égaux, restent régulièrement espacés."
  };

  const y = 60, xStart = 20, xEnd = 210, ARROW_SCALE = 0.3;
  const N_GHOSTS = 6; // nombre d'intervalles Δt affichés par cycle
  let key = "uniform", showGhosts = false, startTime = null, ghosts = [], lastStepIndex = -1;

  function frame(now) {
    if (startTime === null) { startTime = now; ghosts = []; lastStepIndex = -1; }
    const { v0, a, T, verb, label } = SCENARIOS[key];
    let t = (now - startTime) / 1000;
    if (t >= T) {
      // nouveau cycle : on relance l'horloge et on efface les points fantômes
      startTime = now;
      t = 0;
      ghosts = [];
      lastStepIndex = -1;
    }

    const x = xStart + v0 * t + 0.5 * a * t * t;
    const v = v0 + a * t;
    const arrowLen = v * ARROW_SCALE;

    // chronophotographie : on dépose un point fantôme toutes les T/N_GHOSTS secondes
    const stepIndex = Math.floor(t / (T / N_GHOSTS));
    if (showGhosts && stepIndex > lastStepIndex) {
      lastStepIndex = stepIndex;
      ghosts.push(x);
    }

    let s = `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="var(--line)" stroke-width="2"/>`;
    s += `<defs><marker id="${pfx}_mnArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;

    if (showGhosts) {
      ghosts.forEach((gx) => {
        s += `<circle cx="${gx}" cy="${y}" r="3.5" fill="var(--teal)" opacity="0.55"/>`;
      });
    }

    s += `<circle cx="${x}" cy="${y}" r="5" fill="var(--coral)"/>`;
    s += `<text x="${x}" y="${y + 22}" font-size="9" fill="var(--coral)" text-anchor="middle">M</text>`;
    s += `<line x1="${x}" y1="${y - 20}" x2="${x + arrowLen}" y2="${y - 20}" stroke="var(--yellow)" stroke-width="2.8" marker-end="url(#${pfx}_mnArrow)"/>`;
    s += `<text x="${x}" y="${y - 28}" font-size="10" fill="var(--yellow)" font-weight="700">v</text>`;

    svg.innerHTML = s;

    const ghostNote = showGhosts ? GHOST_NOTES[key] : "";
    readout.innerHTML = `<strong style="color:var(--yellow)">${label}</strong> — la valeur du vecteur vitesse <span class="vec">v</span> ${verb} (v ≈ ${(v / 10).toFixed(1)} m·s⁻¹).${ghostNote}`;
  }

  function setMode(newKey, btn) {
    [btnAccel, btnDecel, btnUniform].forEach(b => b.classList.remove("active-hist"));
    btn.classList.add("active-hist");
    key = newKey;
    startTime = null;
  }

  btnAccel.addEventListener("click", () => setMode("accel", btnAccel));
  btnDecel.addEventListener("click", () => setMode("decel", btnDecel));
  btnUniform.addEventListener("click", () => setMode("uniform", btnUniform));

  if (btnGhost) {
    btnGhost.addEventListener("click", () => {
      showGhosts = !showGhosts;
      btnGhost.classList.toggle("active-hist", showGhosts);
      ghosts = [];
      lastStepIndex = -1;
    });
  }

  btnUniform.classList.add("active-hist");
  makePausableAnimation(svg, frame);
}

/* ---------- 6. Relativité du mouvement (référentiel du quai / du train) ---------- */
/* Un train défile devant un quai ; selon le référentiel choisi, c'est soit le
   train (et son passager) qui se déplace devant un quai fixe, soit le train
   qui reste fixe à l'écran pendant que le quai (et son observateur) défilent
   sous les yeux du passager. Le bouton "positions successives" dépose des
   points fantômes sur la trajectoire du passager, à intervalles de temps Δt
   égaux, pour rendre visible que sa trajectoire est rectiligne dans un
   référentiel et réduite à un point dans l'autre. */
function initRelativity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnQuai = document.getElementById(cfg.btnQuaiId);
  const btnTrain = document.getElementById(cfg.btnTrainId);
  const btnGhost = cfg.ghostToggleId ? document.getElementById(cfg.ghostToggleId) : null;

  const PERIOD = 4.2, RUN = 150, N_GHOSTS = 7;
  let view = "quai", showGhosts = false, startTime = null, ghosts = [], lastStepIndex = -1;

  const TEXTS = {
    quai: "<strong style=\"color:var(--yellow)\">Référentiel du quai</strong> : le passager se déplace avec le train. Ses positions successives forment une trajectoire rectiligne.",
    train: "<strong style=\"color:var(--yellow)\">Référentiel du train</strong> : le passager reste immobile, ses positions successives sont confondues. Ce sont le quai et l'observateur qui défilent."
  };

  function frame(now) {
    if (startTime === null) { startTime = now; ghosts = []; lastStepIndex = -1; }
    let t = (now - startTime) / 1000;
    if (t >= PERIOD) { startTime = now; t = 0; ghosts = []; lastStepIndex = -1; }

    const sPos = RUN * t / PERIOD;
    const trainX = view === "quai" ? 10 + sPos : 85;
    const offset = view === "quai" ? 0 : 85 - (10 + sPos);
    const px = trainX + 44, py = 44;

    // chronophotographie du passager : un point fantôme toutes les PERIOD/N_GHOSTS secondes
    const stepIndex = Math.floor(t / (PERIOD / N_GHOSTS));
    if (showGhosts && stepIndex > lastStepIndex) { lastStepIndex = stepIndex; ghosts.push(px); }

    let s = "";
    // poteaux du quai (défilent ou non selon le référentiel choisi)
    for (let k = -8; k < 16; k++) {
      const x = offset + k * 36 + 18;
      if (x < -4 || x > 244) continue;
      s += `<line x1="${x}" y1="14" x2="${x}" y2="74" stroke="var(--line)" stroke-width="1.4"/>`;
      s += `<line x1="${x - 5}" y1="16" x2="${x + 5}" y2="16" stroke="var(--line)" stroke-width="1.4"/>`;
    }
    // rail
    s += `<line x1="0" y1="74" x2="240" y2="74" stroke="var(--chalk-dim)" stroke-width="1.6"/>`;
    for (let k = -30; k < 60; k++) {
      const x = offset + k * 8;
      if (x < -4 || x > 244) continue;
      s += `<line x1="${x}" y1="74" x2="${x - 3}" y2="79" stroke="var(--line)" stroke-width="1"/>`;
    }
    // wagon
    s += `<rect x="${trainX}" y="30" width="72" height="36" rx="7" fill="#1d3229" stroke="var(--chalk)" stroke-width="1.8"/>`;
    s += `<rect x="${trainX + 8}" y="36" width="20" height="14" rx="2" fill="none" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    s += `<rect x="${trainX + 34}" y="36" width="20" height="14" rx="2" fill="none" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    s += `<circle cx="${trainX + 14}" cy="69" r="4" fill="var(--board)" stroke="var(--chalk)" stroke-width="1.4"/>`;
    s += `<circle cx="${trainX + 58}" cy="69" r="4" fill="var(--board)" stroke="var(--chalk)" stroke-width="1.4"/>`;
    // points fantômes du passager
    if (showGhosts) {
      ghosts.forEach((gx) => {
        s += `<circle cx="${gx}" cy="${py}" r="3.4" fill="var(--teal)" opacity="0.6"/>`;
      });
    }
    // passager
    s += `<circle cx="${px}" cy="${py}" r="4.6" fill="var(--coral)"/>`;
    s += `<text x="${trainX + 36}" y="25" font-size="9" fill="var(--coral)" text-anchor="middle">passager</text>`;
    // sol
    s += `<rect x="0" y="100" width="240" height="8" fill="rgba(242,237,225,0.12)"/>`;
    // observateur fixe sur le quai
    const ox = offset + 60;
    if (ox > -10 && ox < 250) {
      s += `<circle cx="${ox}" cy="80" r="4.2" fill="none" stroke="var(--teal)" stroke-width="1.6"/>`;
      s += `<line x1="${ox}" y1="84.5" x2="${ox}" y2="94" stroke="var(--teal)" stroke-width="1.8"/>`;
      s += `<line x1="${ox}" y1="94" x2="${ox - 4}" y2="100" stroke="var(--teal)" stroke-width="1.8"/><line x1="${ox}" y1="94" x2="${ox + 4}" y2="100" stroke="var(--teal)" stroke-width="1.8"/>`;
      s += `<line x1="${ox - 5}" y1="88" x2="${ox + 5}" y2="88" stroke="var(--teal)" stroke-width="1.6"/>`;
      s += `<text x="${ox + 9}" y="92" font-size="9" fill="var(--teal)">observateur</text>`;
    }
    s += `<text x="${offset + 200}" y="118" font-size="9" fill="var(--chalk-dim)">quai</text>`;
    s += `<text x="${offset - 160}" y="118" font-size="9" fill="var(--chalk-dim)">quai</text>`;

    svg.innerHTML = s;
  }

  function sync() {
    [btnQuai, btnTrain].forEach(b => b && b.classList.remove("active-hist"));
    (view === "quai" ? btnQuai : btnTrain).classList.add("active-hist");
    if (btnGhost) btnGhost.classList.toggle("active-hist", showGhosts);
    if (readout) readout.innerHTML = TEXTS[view];
  }

  btnQuai.addEventListener("click", () => { view = "quai"; startTime = null; sync(); });
  btnTrain.addEventListener("click", () => { view = "train"; startTime = null; sync(); });
  if (btnGhost) {
    btnGhost.addEventListener("click", () => {
      showGhosts = !showGhosts;
      ghosts = [];
      lastStepIndex = -1;
      startTime = null;
      sync();
    });
  }

  sync();
  makePausableAnimation(svg, frame);
}

/* ---------- Point maths : les vecteurs ---------- */
function vmHead(x1, y1, x2, y2, col, s) {
  const a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), n = Math.sin(a);
  const bx = x2 - s * c, by = y2 - s * n;
  return '<path d="M' + x2 + ',' + y2 + ' L' + (bx + s * 0.5 * n) + ',' + (by - s * 0.5 * c) + ' L' + (bx - s * 0.5 * n) + ',' + (by + s * 0.5 * c) + ' Z" fill="' + col + '"/>';
}
function vmArrow(x1, y1, x2, y2, col, w, s, headCol, op) {
  const a = Math.atan2(y2 - y1, x2 - x1), bx = x2 - s * 0.8 * Math.cos(a), by = y2 - s * 0.8 * Math.sin(a);
  return '<g' + (op != null ? ' opacity="' + op + '"' : '') + '><line x1="' + x1 + '" y1="' + y1 + '" x2="' + bx + '" y2="' + by + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>' + vmHead(x1, y1, x2, y2, headCol || col, s) + '</g>';
}
function vmVec(x, y, txt, col, size) {
  const w = size * 0.5 * txt.length + 2, top = y - size * 0.95;
  return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + col + '" font-family="' + C4.hand + '" font-style="italic" font-weight="700">' + txt + '</text>'
    + '<line x1="' + x + '" y1="' + top + '" x2="' + (x + w) + '" y2="' + top + '" stroke="' + col + '" stroke-width="1"/>'
    + '<path d="M' + (x + w) + ',' + (top - 2) + ' L' + (x + w + 3.5) + ',' + top + ' L' + (x + w) + ',' + (top + 2) + ' Z" fill="' + col + '"/>';
}
function vmCar(x, y, ang, col, op) {
  return '<g transform="translate(' + x + ',' + y + ') rotate(' + ang + ')"' + (op != null ? ' opacity="' + op + '"' : '') + '>'
    + '<rect x="-10" y="-8.5" width="5" height="3" rx="1" fill="' + C4.chalk + '"/><rect x="5" y="-8.5" width="5" height="3" rx="1" fill="' + C4.chalk + '"/>'
    + '<rect x="-10" y="5.5" width="5" height="3" rx="1" fill="' + C4.chalk + '"/><rect x="5" y="5.5" width="5" height="3" rx="1" fill="' + C4.chalk + '"/>'
    + '<rect x="-12" y="-6" width="24" height="12" rx="3.5" fill="' + col + '"/>'
    + '<rect x="-4" y="-4.5" width="8" height="9" rx="1.5" fill="' + C4.board + '" opacity="0.5"/></g>';
}

/* 1. Accroche : une valeur seule ne dit pas où ira la voiture. */
function initVecHook(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const bAsk = document.getElementById(cfg.btnAskId), bArr = document.getElementById(cfg.btnArrowId);
  if (!svg) return;
  const C = [124, 80], R = 54, ANG = [-25, 35, 95, 155, 215, 275], ARR = -25;
  const TXT = {
    start: 'Une voiture roule à <strong style="color:#e8c468">50 km/h</strong>. Où sera-t-elle dans 10 secondes ?',
    ask: 'En 10 s, elle parcourt environ <strong style="color:#e8c468">140 m</strong> (50 km/h ≈ 14 m/s). Mais elle peut se trouver n\'importe où sur ce cercle.<br><span style="color:#d97a63">Connaître la valeur ne suffit pas : il faut savoir sur quelle ligne on roule et vers quel côté !</span>',
    arrow: 'Une flèche réunit toutes les informations : son <strong style="color:#f2ede1">origine</strong> (la voiture), sa <strong style="color:#f2ede1">direction</strong> (la ligne suivie), son <strong style="color:#f2ede1">sens</strong> (le côté) et sa <strong style="color:#f2ede1">longueur</strong> (la valeur).<br>Cette flèche est un <strong style="color:#e8c468">vecteur</strong>.'
  };
  let mode = "start", t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    const t = (now - t0) / 1000;
    let s = '<rect x="4" y="4" width="100" height="24" rx="5" fill="' + C4.board2 + '" stroke="' + C4.yellow + '" stroke-width="1.2"/>'
      + '<text x="54" y="21" font-size="12" fill="' + C4.yellow + '" font-family="' + C4.hand + '" text-anchor="middle">vitesse = 50 km/h</text>';
    let cx = C[0], cy = C[1], ca = 0;
    if (mode === "ask") {
      s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="' + R + '" fill="none" stroke="' + C4.line + '" stroke-width="1.2" stroke-dasharray="3,3"/>';
      s += '<text x="' + (C[0] + R + 4) + '" y="' + (C[1] + 34) + '" font-size="10" fill="' + C4.dim + '" font-family="' + C4.hand + '">≈ 140 m</text>';
      ANG.forEach((a, k) => {
        const r = a * Math.PI / 180, c = Math.cos(r), n = Math.sin(r);
        const op = 0.2 + 0.8 * Math.pow(Math.abs(Math.sin(Math.PI * 0.8 * t - k * 0.52)), 2);
        s += '<line x1="' + C[0] + '" y1="' + C[1] + '" x2="' + (C[0] + R * c) + '" y2="' + (C[1] + R * n) + '" stroke="' + C4.coral + '" stroke-width="1.4" stroke-dasharray="4,3" opacity="' + op.toFixed(2) + '"/>';
        s += vmCar(C[0] + R * c, C[1] + R * n, a, C4.coral, (op * 0.55).toFixed(2));
        s += '<text x="' + (C[0] + (R + 15) * c) + '" y="' + (C[1] + (R + 15) * n + 5) + '" font-size="15" fill="' + C4.coral + '" font-family="' + C4.hand + '" font-weight="700" text-anchor="middle" opacity="' + op.toFixed(2) + '">?</text>';
      });
    }
    if (mode === "arrow") {
      const r = ARR * Math.PI / 180, c = Math.cos(r), n = Math.sin(r), f = Math.min(1, (t % 4.6) / 3.2);
      s += '<line x1="' + C[0] + '" y1="' + C[1] + '" x2="' + (C[0] + R * c) + '" y2="' + (C[1] + R * n) + '" stroke="' + C4.teal + '" stroke-width="1.4" stroke-dasharray="4,3"/>';
      s += '<circle cx="' + C[0] + '" cy="' + C[1] + '" r="2.5" fill="' + C4.dim + '"/><text x="' + (C[0] - 4) + '" y="' + (C[1] + 20) + '" font-size="10" fill="' + C4.dim + '" font-family="' + C4.hand + '" text-anchor="middle">départ</text>';
      const ex = C[0] + R * c, ey = C[1] + R * n;
      s += '<circle cx="' + ex + '" cy="' + ey + '" r="13" fill="none" stroke="' + C4.teal + '" stroke-width="1.2" opacity="' + (f >= 1 ? 1 : 0.35) + '"/>';
      if (f >= 1) s += '<text x="' + (ex + 14) + '" y="' + (ey + 22) + '" font-size="10" fill="' + C4.teal + '" font-family="' + C4.hand + '" text-anchor="middle">dans 10 s</text>';
      cx = C[0] + R * f * c; cy = C[1] + R * f * n; ca = ARR;
      s += vmCar(cx, cy, ca, C4.coral);
      s += vmArrow(cx, cy, cx + 38 * c, cy + 38 * n, C4.yellow, 2.8, 10);
      s += vmVec(cx + 38 * c + 3, cy + 38 * n - 4, "v", C4.yellow, 13);
    } else s += vmCar(cx, cy, ca, C4.coral);
    svg.innerHTML = s;
  }
  function set(m) { mode = m; t0 = null; c4Active(bAsk, m === "ask"); c4Active(bArr, m === "arrow"); if (readout) readout.innerHTML = TXT[m]; }
  c4On(bAsk, "click", () => set("ask"));
  c4On(bArr, "click", () => set("arrow"));
  set("start");
  makePausableAnimation(svg, frame);
}

/* 2. Anatomie : point d'application, direction, sens, valeur (+ piège du sens opposé). */
function initVecAnatomy(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const B = { point: document.getElementById(cfg.btnPointId), dir: document.getElementById(cfg.btnDirId), sens: document.getElementById(cfg.btnSensId), val: document.getElementById(cfg.btnValId) };
  const bF = document.getElementById(cfg.btnFlipId), vR = document.getElementById(cfg.vRangeId);
  if (!svg) return;
  if (vR) { vR.min = "10"; vR.max = "50"; vR.step = "10"; if (!(Number(vR.value) >= 10)) vR.value = "30"; }
  const M = [120, 84], TH = -20, U = 20, rad = TH * Math.PI / 180;
  let act = null, flip = false, sg = 1, t0 = null, prev = null;
  const vNow = () => Number(vR ? vR.value : 30) || 30;
  function text() {
    const v = vNow();
    const T = {
      none: 'Un vecteur se décrit par <strong style="color:#e8c468">4 caractéristiques</strong>. Choisis-en une.',
      point: '<strong style="color:#6bbfab">Point d\'application</strong> : le vecteur part du point M, la position du système à l\'instant <em>t</em>.',
      dir: '<strong style="color:#6bbfab">Direction</strong> : la droite qui porte la flèche. Ce sont les « rails » du mouvement.',
      sens: '<strong style="color:#6bbfab">Sens</strong> : le côté vers lequel pointe la flèche. Sur une même droite, il y a deux sens possibles.',
      val: '<strong style="color:#6bbfab">Valeur</strong> : la longueur de la flèche, à l\'échelle 1 cm ↔ 10 m/s.<br><em>v</em> = <strong style="color:#e8c468">' + v + ' m/s</strong>, donc la flèche mesure <strong style="color:#e8c468">' + (v / 10) + ' cm</strong>.'
    };
    let h = T[act || "none"];
    if (flip) h += '<br><span style="color:#d97a63">Piège : même direction (la même droite), mais sens opposé. Ce n\'est pas le même vecteur !</span>';
    if (readout) readout.innerHTML = h;
  }
  function frame(now) {
    if (t0 === null) { t0 = now; prev = now; }
    const t = (now - t0) / 1000, dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    const target = flip ? -1 : 1;
    sg += Math.sign(target - sg) * Math.min(Math.abs(target - sg), dt * 3.5);
    const L = vNow() / 10 * U, ex = sg * L;
    let g = '';
    if (act === "dir" || flip) g += '<line x1="-300" y1="0" x2="300" y2="0" stroke="' + C4.teal + '" stroke-width="1.4" stroke-dasharray="5,4"/>';
    if (act === "dir") g += '<text x="' + (flip ? 52 : -100) + '" y="-7" font-size="11" fill="' + C4.teal + '" font-family="' + C4.hand + '">direction</text>';
    if (flip) g += vmArrow(0, 0, L, 0, C4.chalk, 2, 9, C4.chalk, 0.3);
    if (act === "val") {
      const d = ex >= 0 ? 1 : -1;
      g += '<line x1="0" y1="18" x2="' + (d * 100) + '" y2="18" stroke="' + C4.chalk + '" stroke-width="1"/>';
      g += '<line x1="0" y1="18" x2="' + ex + '" y2="18" stroke="' + C4.yellow + '" stroke-width="3" opacity="0.6"/>';
      for (let i = 0; i <= 5; i++) g += '<line x1="' + (d * i * U) + '" y1="14" x2="' + (d * i * U) + '" y2="22" stroke="' + C4.chalk + '" stroke-width="1"/><text x="' + (d * i * U) + '" y="33" font-size="9" fill="' + C4.dim + '" text-anchor="middle">' + i + '</text>';
      g += '<text x="' + (d * 106) + '" y="33" font-size="9" fill="' + C4.dim + '" text-anchor="' + (d > 0 ? "start" : "end") + '">cm</text>';
    }
    if (Math.abs(ex) > 4) {
      const hs = act === "sens" ? 10 * (1 + 0.3 * Math.abs(Math.sin(t * 5))) : 10;
      g += vmArrow(0, 0, ex, 0, C4.yellow, 3, hs, act === "sens" ? C4.coral : C4.yellow);
    }
    if (act === "sens") for (let k = 0; k < 3; k++) {
      const x = ((t * 0.7 + k / 3) % 1) * ex * 0.8, d = ex >= 0 ? 1 : -1;
      g += '<polyline points="' + (x - 3 * d) + ',-10 ' + x + ',-6 ' + (x - 3 * d) + ',-2" fill="none" stroke="' + C4.coral + '" stroke-width="1.5"/>';
    }
    let s = '<g transform="translate(' + M[0] + ',' + M[1] + ') rotate(' + TH + ')">' + g + '</g>';
    if (act === "point") {
      const rr = 7 + 3 * Math.abs(Math.sin(t * 3));
      s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="' + rr + '" fill="rgba(107,191,171,0.2)" stroke="' + C4.teal + '" stroke-width="1.4"/>';
      s += '<text x="' + (M[0] - 10) + '" y="' + (M[1] + 30) + '" font-size="11" fill="' + C4.teal + '" font-family="' + C4.hand + '" text-anchor="end">point d\'application</text>';
    }
    s += '<circle cx="' + M[0] + '" cy="' + M[1] + '" r="4" fill="' + C4.chalk + '"/>';
    s += '<text x="' + (M[0] - 4) + '" y="' + (M[1] + 18) + '" font-size="12" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="end">M</text>';
    if (Math.abs(ex) > 4) { const tx = M[0] + ex * Math.cos(rad), ty = M[1] + ex * Math.sin(rad); s += vmVec(tx + (ex > 0 ? 4 : -14), ty - 8, "v", C4.yellow, 13); }
    if (act === "val") s += '<text x="236" y="146" font-size="10" fill="' + C4.dim + '" font-family="' + C4.hand + '" text-anchor="end">échelle : 1 cm ↔ 10 m/s</text>';
    svg.innerHTML = s;
  }
  function sync() { Object.keys(B).forEach(k => c4Active(B[k], act === k)); c4Active(bF, flip); text(); }
  Object.keys(B).forEach(k => c4On(B[k], "click", () => { act = act === k ? null : k; sync(); }));
  c4On(bF, "click", () => { flip = !flip; sync(); });
  c4On(vR, "input", text);
  sync();
  makePausableAnimation(svg, frame);
}

/* 3. Simulation : le vecteur vitesse suit une bille lancée. */
function initVecLive(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const bPlay = document.getElementById(cfg.btnPlayId), bSlow = document.getElementById(cfg.btnSlowId), bReset = document.getElementById(cfg.btnResetId), bShow = document.getElementById(cfg.btnShowId);
  if (!svg) return;
  const X0 = 22, Y0 = 130, VX = 64, K = 44, TT = 3, HOLD = 0.9, S = 0.32;
  const pos = (t) => [X0 + VX * t, Y0 - K * t * (TT - t)], vel = (t) => [VX, -K * (TT - 2 * t)];
  let traj = [];
  for (let t = 0; t <= TT + 1e-6; t += 0.05) traj.push(pos(t).map(v => v.toFixed(1)).join(","));
  traj = traj.join(" ");
  let T = 0, playing = true, slow = false, show = false, prev = null, lastUpd = 0;
  const STATIC = 'Le vecteur vitesse reste attaché à la bille. Il est tangent à la trajectoire et orienté dans le sens du mouvement. Sa longueur suit la valeur de la vitesse : elle diminue à la montée et augmente à la descente.';
  function frame(now) {
    if (prev === null) prev = now;
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    if (playing) { T += dt * (slow ? 0.3 : 1); if (T > TT + HOLD) T = 0; }
    const tc = Math.min(T, TT), p = pos(tc), v = vel(tc), sp = Math.hypot(v[0], v[1]), ux = v[0] / sp, uy = v[1] / sp;
    let s = '<line x1="0" y1="' + (Y0 + 6) + '" x2="240" y2="' + (Y0 + 6) + '" stroke="' + C4.dim + '" stroke-width="1.2"/>';
    s += '<polyline points="' + traj + '" fill="none" stroke="' + C4.dim + '" stroke-width="1.4" stroke-dasharray="4,3" opacity="0.6"/>';
    for (let k = 0; k * 0.25 <= tc + 1e-6; k++) { const q = pos(k * 0.25); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2" fill="' + C4.teal + '" opacity="0.6"/>'; }
    if (show) {
      s += '<line x1="' + (p[0] - 220 * ux) + '" y1="' + (p[1] - 220 * uy) + '" x2="' + (p[0] + 220 * ux) + '" y2="' + (p[1] + 220 * uy) + '" stroke="' + C4.teal + '" stroke-width="1.2" stroke-dasharray="5,4"/>';
      s += '<text x="' + (p[0] - 6) + '" y="' + (p[1] + 18) + '" font-size="12" fill="' + C4.chalk + '" font-family="' + C4.hand + '" text-anchor="end">M</text>';
    }
    s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="5" fill="' + C4.coral + '"/>';
    const tx = p[0] + v[0] * S, ty = p[1] + v[1] * S;
    s += vmArrow(p[0], p[1], tx, ty, C4.yellow, 2.8, 10);
    s += vmVec(tx + 4, ty - 4, "v", C4.yellow, 13);
    svg.innerHTML = s;
    if (readout && show && now - lastUpd > 120) {
      lastUpd = now;
      readout.innerHTML = '<strong style="color:#6bbfab">Point d\'application</strong> : la bille (point M)<br><strong style="color:#6bbfab">Direction</strong> : la tangente à la trajectoire en M<br><strong style="color:#6bbfab">Sens</strong> : celui du mouvement<br><strong style="color:#6bbfab">Valeur</strong> : <em>v</em> = <strong style="color:#e8c468">' + c4Fr(sp / 10, 1) + ' m/s</strong>';
    }
  }
  function sync() {
    if (bPlay) bPlay.textContent = playing ? "⏸ Pause" : "▶ Lecture";
    c4Active(bSlow, slow); c4Active(bShow, show);
    if (readout && !show) readout.innerHTML = STATIC;
    lastUpd = 0;
  }
  c4On(bPlay, "click", () => { playing = !playing; sync(); });
  c4On(bSlow, "click", () => { slow = !slow; sync(); });
  c4On(bReset, "click", () => { T = 0; playing = true; sync(); });
  c4On(bShow, "click", () => { show = !show; sync(); });
  sync();
  makePausableAnimation(svg, frame);
}
