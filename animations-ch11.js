/* Animations du chapitre 11 — 1ère spé PC — Forces et champs
   Partie 1 : animations d'origine du site. Partie 2 : animations des diapos. */

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


/* ================================================================== */
/* Partie 2 : animations grand format (diapos et site, largeur 1780)   */
/* ================================================================== */
var CH11_VERSION = 2;
var CH11 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", b2: "#1d3229", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };

function c11$(id) { return id ? document.getElementById(id) : null; }
function c11f(v) { return (+v).toFixed(1); }
function c11fr(v, n) { return (+v).toFixed(n == null ? 2 : n).replace(".", ","); }
function c11op(op) { return op != null ? ' opacity="' + Math.max(0, Math.min(1, op)).toFixed(2) + '"' : ""; }
function c11t(x, y, s, o) {
  o = o || {};
  return '<text x="' + c11f(x) + '" y="' + c11f(y) + '" font-size="' + (o.size || 26) + '" fill="' + (o.fill || CH11.dim) + '" font-family="' + (o.font || CH11.fh) + '" text-anchor="' + (o.anchor || "start") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : "") + c11op(o.op) + '>' + s + '</text>';
}
function c11btn(id, fn) {
  const b = c11$(id);
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function c11setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function c11clamp(v) { return Math.max(0, Math.min(1, v)); }
function c11ease(t) { t = c11clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function c11tween(st, dur, onFrame) {
  if (st.raf) cancelAnimationFrame(st.raf);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    onFrame(k);
    st.raf = k < 1 ? requestAnimationFrame(step) : 0;
  };
  st.raf = requestAnimationFrame(step);
}
function c11readout(title, body, col) {
  return '<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:40px;color:' + (col || "#e8c468") + ';line-height:1.15;">' + title + '</div><div style="font-size:28px;line-height:1.45;text-wrap:pretty;color:#f2ede1;">' + body + '</div></div>';
}
function c11arrow(x1, y1, x2, y2, col, w, head, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 2) return "";
  const ux = dx / L, uy = dy / L, h = Math.min(head || 20, L), bx = x2 - ux * h, by = y2 - uy * h;
  return '<g' + c11op(op) + '>' + (L > h + 1 ? '<line x1="' + c11f(x1) + '" y1="' + c11f(y1) + '" x2="' + c11f(bx + ux * 2) + '" y2="' + c11f(by + uy * 2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>' : "") +
    '<polygon points="' + c11f(x2) + ',' + c11f(y2) + ' ' + c11f(bx - uy * h * 0.55) + ',' + c11f(by + ux * h * 0.55) + ' ' + c11f(bx + uy * h * 0.55) + ',' + c11f(by - ux * h * 0.55) + '" fill="' + col + '"/></g>';
}
function c11line(x1, y1, x2, y2, col, w, dash, op) {
  return '<line x1="' + c11f(x1) + '" y1="' + c11f(y1) + '" x2="' + c11f(x2) + '" y2="' + c11f(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + c11op(op) + '/>';
}
/* symbole vectoriel : lettre + indice, petite flèche au-dessus (ancrage à gauche) */
function c11vec(x, y, sym, sub, col, size, op) {
  size = size || 34;
  const w = size * 0.56;
  let s = '<g' + c11op(op) + '>';
  s += '<text x="' + c11f(x) + '" y="' + c11f(y) + '" font-size="' + size + '" fill="' + col + '" font-family="' + CH11.fb + '" font-style="italic">' + sym +
    (sub ? '<tspan font-size="' + c11f(size * 0.6) + '" dy="' + c11f(size * 0.26) + '" font-style="normal">' + sub + '</tspan>' : "") + '</text>';
  const ay = y - size * 0.86;
  s += c11line(x + 2, ay, x + w, ay, col, 2.5) + '<polygon points="' + c11f(x + w + 7) + ',' + c11f(ay) + ' ' + c11f(x + w - 1) + ',' + c11f(ay - 4.5) + ' ' + c11f(x + w - 1) + ',' + c11f(ay + 4.5) + '" fill="' + col + '"/>';
  return s + '</g>';
}
function c11panel() {
  return '<rect x="1130" y="20" width="630" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>';
}

/* ------------------------------------------------------------------ */
/* 1. Simulateur d'interaction : gravitation / électrostatique          */
/* ------------------------------------------------------------------ */
function initCh11Interaction(cfg) {
  const svg = c11$(cfg.svgId), readout = c11$(cfg.readoutId);
  if (!svg) return;
  const sA = c11$(cfg.aId), sB = c11$(cfg.bId), sD = c11$(cfg.dId);
  const st = { mode: "grav", pA: 1, pB: 1 }, tw = {};
  let pulse = 1;
  const V = { A: 2, B: 2, D: 2 }, LIM = { A: [1, 6, 1], B: [1, 6, 1], D: [1, 5, 0.5] };
  function vals() { return { A: sA ? +sA.value : V.A, B: sB ? +sB.value : V.B, D: sD ? +sD.value : V.D }; }
  const steps = cfg.steppers || {};
  function showVals() {
    Object.keys(steps).forEach((k) => {
      const ids = steps[k], v = c11$(ids[2]);
      if (v) v.textContent = k === "D" ? c11fr(V[k], 1) : V[k];
      const m = c11$(ids[0]), p = c11$(ids[1]);
      if (m) m.disabled = V[k] <= LIM[k][0];
      if (p) p.disabled = V[k] >= LIM[k][1];
    });
  }
  Object.keys(steps).forEach((k) => {
    const ids = steps[k];
    const go = (dir) => { V[k] = Math.max(LIM[k][0], Math.min(LIM[k][1], V[k] + dir * LIM[k][2])); showVals(); pulse = 1; draw(); };
    c11btn(ids[0], () => go(-1)); c11btn(ids[1], () => go(1));
  });
  function draw() {
    const v = vals(), cy = 270, cx = 560;
    const sep = 100 + v.D * 160, xA = cx - sep / 2, xB = cx + sep / 2;
    const rA = 26 + v.A * 5, rB = 26 + v.B * 5;
    const grav = st.mode === "grav";
    const attr = grav ? true : st.pA !== st.pB;
    const F = (v.A * v.B) / (v.D * v.D);
    const colOf = (p) => grav ? CH11.y : (p > 0 ? CH11.c : CH11.t);
    let s = "";
    s += c11line(xA, cy, xB, cy, "rgba(242,237,225,0.22)", 3, "10 10");
    s += '<circle cx="' + c11f(xA) + '" cy="' + cy + '" r="' + rA + '" fill="' + colOf(st.pA) + '" stroke="' + CH11.board + '" stroke-width="3"/>';
    s += '<circle cx="' + c11f(xB) + '" cy="' + cy + '" r="' + rB + '" fill="' + colOf(st.pB) + '" stroke="' + CH11.board + '" stroke-width="3"/>';
    if (grav) {
      s += c11t(xA, cy + 14, "A", { anchor: "middle", size: 40, fill: CH11.board, font: CH11.fb, weight: 700 });
      s += c11t(xB, cy + 14, "B", { anchor: "middle", size: 40, fill: CH11.board, font: CH11.fb, weight: 700 });
    } else {
      s += c11t(xA, cy + 18, st.pA > 0 ? "+" : "−", { anchor: "middle", size: 52, fill: CH11.board, font: CH11.fb, weight: 700 });
      s += c11t(xB, cy + 18, st.pB > 0 ? "+" : "−", { anchor: "middle", size: 52, fill: CH11.board, font: CH11.fb, weight: 700 });
      s += c11t(xA, cy - rA - 16, "A", { anchor: "middle", size: 36, fill: CH11.chalk });
      s += c11t(xB, cy - rB - 16, "B", { anchor: "middle", size: 36, fill: CH11.chalk });
    }
    const lab = (val, p) => grav ? "m = " + val + " m₀" : "q = " + (p > 0 ? "+" : "−") + val + " q₀";
    s += c11t(xA, cy + rA + 44, lab(v.A, st.pA), { anchor: "middle", size: 30, fill: CH11.chalk });
    s += c11t(xB, cy + rB + 44, lab(v.B, st.pB), { anchor: "middle", size: 30, fill: CH11.chalk });
    /* flèches de force (même longueur : 3e loi de Newton) */
    let L = 70 * F * c11ease(pulse), clipped = false;
    const maxL = attr ? Math.max(8, (sep - rA - rB) / 2 - 12) : 300;
    if (L > maxL) { L = maxL; clipped = true; }
    const dirB = attr ? -1 : 1;
    const bx0 = xB + dirB * rB, ax0 = xA - dirB * rA;
    s += c11arrow(bx0, cy, bx0 + dirB * L, cy, CH11.chalk, 7, 24);
    s += c11arrow(ax0, cy, ax0 - dirB * L, cy, CH11.chalk, 7, 24);
    const lyB = cy - rB - (grav ? 30 : 70), lyA = cy - rA - (grav ? 30 : 70);
    s += c11vec(xB + (attr ? -rB - 120 : rB + 20), lyB + (attr ? 0 : 0), "F", "A/B", CH11.chalk, 36);
    s += c11vec(xA + (attr ? rA + 20 : -rA - 120), lyA, "F", "B/A", CH11.chalk, 36);
    /* cote d */
    const dy = 500;
    s += c11line(xA, dy - 16, xA, dy + 16, CH11.dim, 3) + c11line(xB, dy - 16, xB, dy + 16, CH11.dim, 3) + c11line(xA, dy, xB, dy, CH11.dim, 3);
    s += c11t(cx, dy - 18, "d = " + c11fr(v.D, 1) + " d₀", { anchor: "middle", size: 32, fill: CH11.chalk });
    if (clipped) s += c11t(cx, 580, "flèches raccourcies : hors échelle", { anchor: "middle", size: 26, fill: CH11.c });
    /* panneau */
    s += c11panel();
    s += c11t(1160, 74, "Valeur de la force", { size: 32 });
    s += c11t(1445, 190, "F = " + c11fr(F) + " × F₀", { anchor: "middle", size: 66, fill: CH11.y });
    const num = grav ? v.A + " × " + v.B : v.A + " × " + v.B, den = c11fr(v.D, 1) + "²";
    s += c11t(1360, 300, "=", { anchor: "middle", size: 46, fill: CH11.chalk });
    s += c11t(1500, 280, num, { anchor: "middle", size: 40, fill: CH11.chalk });
    s += c11line(1420, 296, 1580, 296, CH11.chalk, 3);
    s += c11t(1500, 340, den, { anchor: "middle", size: 40, fill: CH11.chalk });
    s += c11t(1445, 400, "F₀ : valeur pour 1 × 1 à la distance d₀", { anchor: "middle", size: 24 });
    s += c11line(1170, 432, 1720, 432, "rgba(242,237,225,0.16)", 2);
    s += c11t(1160, 482, "Sens", { size: 30 });
    s += c11t(1445, 540, attr ? "attractive" : "répulsive", { anchor: "middle", size: 52, fill: attr ? CH11.t : CH11.c });
    svg.innerHTML = s;
    if (readout) {
      const title = grav ? "Force de gravitation : toujours attractive" : attr ? "Charges de signes opposés : attraction" : "Charges de même signe : répulsion";
      const body = grav
        ? "F est proportionnelle au produit des masses m<sub>A</sub> × m<sub>B</sub> et inversement proportionnelle au carré de la distance d."
        : "F est proportionnelle au produit des valeurs des charges |q<sub>A</sub> × q<sub>B</sub>| et inversement proportionnelle au carré de la distance d.";
      readout.innerHTML = c11readout(title, body + " Les deux forces ont la même valeur et sont portées par la droite (AB).", attr ? "#6bbfab" : "#d97a63");
    }
  }
  const bG = c11btn(cfg.gravId, () => { st.mode = "grav"; sync(); }), bE = c11btn(cfg.elecId, () => { st.mode = "elec"; sync(); });
  const bSA = c11btn(cfg.signAId, () => { st.pA = -st.pA; sync(); }), bSB = c11btn(cfg.signBId, () => { st.pB = -st.pB; sync(); });
  function sync() {
    c11setBtn(bG, st.mode === "grav"); c11setBtn(bE, st.mode === "elec");
    [bSA, bSB].forEach((b) => { if (b) b.style.visibility = st.mode === "elec" ? "visible" : "hidden"; });
    if (bSA) bSA.textContent = "A : " + (st.pA > 0 ? "+" : "−");
    if (bSB) bSB.textContent = "B : " + (st.pB > 0 ? "+" : "−");
    c11tween(tw, 600, (k) => { pulse = k; draw(); });
  }
  [sA, sB, sD].forEach((el) => el && el.addEventListener("input", () => { pulse = 1; draw(); }));
  showVals();
  sync();
}

/* ------------------------------------------------------------------ */
/* 2. Décroissance en 1/d²                                              */
/* ------------------------------------------------------------------ */
function initCh11Decay(cfg) {
  const svg = c11$(cfg.svgId), readout = c11$(cfg.readoutId);
  if (!svg) return;
  let cur = 0, p = 1;
  const tw = {}, cy = 290, sx = 110, MAX = 240;
  const xs = [420, 590, 760, 930, 1080];
  function draw() {
    let s = "";
    s += c11line(sx, cy, 1100, cy, "rgba(242,237,225,0.2)", 3, "4 12");
    s += '<circle cx="' + sx + '" cy="' + cy + '" r="48" fill="' + CH11.y + '" stroke="' + CH11.board + '" stroke-width="3"/>';
    s += c11t(sx, cy + 96, "source", { anchor: "middle", size: 30, fill: CH11.y });
    xs.forEach((x, i) => {
      const k = i + 1, on = i === cur, L = MAX / (k * k) * (on ? c11ease(p) : 1);
      const op = on ? 1 : 0.32;
      s += c11arrow(x, cy, x - L, cy, CH11.c, 8, Math.min(26, 10 + L * 0.3), op);
      s += '<circle cx="' + x + '" cy="' + cy + '" r="9" fill="' + CH11.chalk + '"' + c11op(op) + '/>';
      s += c11t(x, cy + 64, k === 1 ? "d" : k + "d", { anchor: "middle", size: 36, fill: on ? CH11.chalk : CH11.dim, op: on ? 1 : 0.6 });
      s += c11t(x, cy + 108, k === 1 ? "× 1" : "÷ " + k * k, { anchor: "middle", size: 32, fill: on ? CH11.y : CH11.dim, op: on ? 1 : 0.6 });
    });
    s += c11t(600, 120, "flèches à l'échelle", { anchor: "middle", size: 28 });
    s += c11panel();
    const k = cur + 1;
    s += c11t(1160, 74, "Valeur du champ (et de la force)", { size: 30 });
    s += c11t(1445, 180, "à " + (k === 1 ? "d" : k + "d"), { anchor: "middle", size: 48, fill: CH11.chalk });
    s += c11t(1445, 290, k === 1 ? "valeur de référence" : "divisée par " + k + "² = " + k * k, { anchor: "middle", size: k === 1 ? 44 : 52, fill: CH11.y });
    s += c11line(1170, 350, 1720, 350, "rgba(242,237,225,0.16)", 2);
    const bx = [1215, 1320, 1425, 1530, 1635], base = 540, H = 150;
    xs.forEach((_, i) => {
      const h = H / ((i + 1) * (i + 1)), on = i === cur;
      s += '<rect x="' + (bx[i] - 34) + '" y="' + c11f(base - h) + '" width="68" height="' + c11f(Math.max(h, 2)) + '" rx="6" fill="' + (on ? CH11.y : CH11.dim) + '"' + c11op(on ? 1 : 0.35) + '/>';
      s += c11t(bx[i], base - h - 12, i === 0 ? "1" : "1/" + (i + 1) * (i + 1), { anchor: "middle", size: 26, fill: on ? CH11.y : CH11.dim });
    });
    s += c11line(1180, base, 1700, base, "rgba(242,237,225,0.35)", 3);
    svg.innerHTML = s;
  }
  const bs = (cfg.ptIds || []).map((id, i) => c11btn(id, () => { cur = i; sync(true); }));
  function sync(anim) {
    bs.forEach((b, i) => c11setBtn(b, i === cur));
    const k = cur + 1;
    if (readout) readout.innerHTML = k === 1
      ? c11readout("Point de référence, à la distance d", "Choisis un point plus éloigné : la flèche se raccourcit très vite.")
      : c11readout("Distance multipliée par " + k + " → valeur divisée par " + k * k, "Le champ, et donc la force subie, varie comme 1/d² : " + k + " fois plus loin, c'est " + k + "² = " + k * k + " fois plus faible.");
    if (anim) c11tween(tw, 700, (x) => { p = x; draw(); }); else draw();
  }
  sync(false);
}

/* ------------------------------------------------------------------ */
/* 3. Carte de champ : vecteurs, lignes, objet test                     */
/* ------------------------------------------------------------------ */
function initCh11FieldMap(cfg) {
  const svg = c11$(cfg.svgId), readout = c11$(cfg.readoutId);
  if (!svg) return;
  let src = "masse", view = "vec", qTest = 1, p = 1;
  const tw = {}, cx = 520, cy = 300;
  const tx = 800, ty = 150;
  function draw() {
    const e = c11ease(p);
    const col = src === "masse" ? CH11.y : src === "pos" ? CH11.c : CH11.t;
    const out = src === "pos" ? 1 : -1;
    const fsym = src === "masse" ? "G" : "E";
    let s = '<defs><clipPath id="c11clip"><rect x="0" y="0" width="1100" height="600"/></clipPath></defs><g clip-path="url(#c11clip)">';
    if (view === "vec") {
      for (let x = 120; x <= 1020; x += 100) for (let y = 50; y <= 560; y += 100) {
        const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy);
        if (r < 95) continue;
        if (Math.hypot(x - tx, y - ty) < 60) continue;
        const ux = dx / r * out, uy = dy / r * out;
        const L = Math.max(10, Math.min(72, 64 * Math.pow(130 / r, 2))) * e;
        s += c11arrow(x - ux * L / 2, y - uy * L / 2, x + ux * L / 2, y + uy * L / 2, col, 4, 14, 0.85);
      }
    } else {
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2 + Math.PI / 12, ux = Math.cos(a), uy = Math.sin(a);
        const r0 = 62, r1 = 62 + 560 * e;
        s += c11line(cx + ux * r0, cy + uy * r0, cx + ux * r1, cy + uy * r1, col, 4);
        [150, 290].forEach((r) => {
          if (r > r1 - 20) return;
          const a0 = r - 14 * out, a1 = r + 14 * out;
          s += c11arrow(cx + ux * a0, cy + uy * a0, cx + ux * a1, cy + uy * a1, col, 4, 26);
        });
      }
    }
    s += '</g>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="44" fill="' + col + '" stroke="' + CH11.board + '" stroke-width="3"/>';
    s += c11t(cx, cy + (src === "masse" ? 12 : 18), src === "masse" ? "M" : src === "pos" ? "+" : "−", { anchor: "middle", size: src === "masse" ? 38 : 56, fill: CH11.board, font: CH11.fb, weight: 700 });
    /* objet test */
    const dx = tx - cx, dy = ty - cy, r = Math.hypot(dx, dy), ux = dx / r * out, uy = dy / r * out;
    const fdir = src === "masse" ? 1 : qTest;
    s += '<circle cx="' + tx + '" cy="' + ty + '" r="22" fill="' + CH11.chalk + '" stroke="' + CH11.board + '" stroke-width="3"/>';
    s += c11t(tx, ty + 9, src === "masse" ? "m" : qTest > 0 ? "+" : "−", { anchor: "middle", size: src === "masse" ? 28 : 36, fill: CH11.board, font: CH11.fb, weight: 700 });
    const Lf = 120 * e;
    s += c11arrow(tx + ux * 26, ty + uy * 26, tx + ux * (26 + Lf), ty + uy * (26 + Lf), col, 5, 20, 0.9);
    const ox = -uy * 34, oy = ux * 34;
    s += c11arrow(tx + ox + ux * fdir * 26, ty + oy + uy * fdir * 26, tx + ox + ux * fdir * (26 + Lf), ty + oy + uy * fdir * (26 + Lf), CH11.y, 7, 24);
    const ex = tx + ux * (26 + Lf) + 10, ey = ty + uy * (26 + Lf) - 10;
    s += c11vec(ex + (ux < 0 ? -50 : 4), ey + (uy > 0 ? 40 : 0), fsym, "", col, 36, e);
    const fx = tx + ox + ux * fdir * (26 + Lf), fy = ty + oy + uy * fdir * (26 + Lf);
    s += c11vec(fx + (ux * fdir < 0 ? -48 : 10), fy + (uy * fdir > 0 ? 44 : -8), "F", "", CH11.y, 36, e);
    /* panneau */
    s += c11panel();
    s += c11t(1160, 74, "Champ créé par la source", { size: 30 });
    s += c11t(1445, 160, src === "masse" ? "champ de gravitation" : "champ électrostatique", { anchor: "middle", size: 42, fill: col });
    s += c11t(1445, 222, src === "pos" ? "lignes divergentes" : "lignes convergentes", { anchor: "middle", size: 36, fill: CH11.chalk });
    s += c11line(1170, 270, 1720, 270, "rgba(242,237,225,0.16)", 2);
    s += c11t(1160, 320, "Force sur l'objet test", { size: 30 });
    s += c11vec(1300, 410, "F", "", CH11.y, 56) + c11t(1350, 410, "= " + (src === "masse" ? "m" : "q") + " ×", { size: 56, fill: CH11.y, font: CH11.fb }) + c11vec(1520, 410, fsym, "", CH11.y, 56);
    const sense = src === "masse" ? "même sens que le champ" : qTest > 0 ? "q > 0 : même sens que le champ" : "q < 0 : sens opposé au champ";
    s += c11t(1445, 500, sense, { anchor: "middle", size: 34, fill: src !== "masse" && qTest < 0 ? CH11.c : CH11.chalk });
    svg.innerHTML = s;
    if (readout) {
      const T = {
        masse: ["Une masse crée un champ de gravitation", "Les vecteurs champ sont dirigés vers la masse : les lignes de champ convergent. Plus on s'éloigne, plus le champ est faible."],
        pos: ["Une charge positive crée un champ électrostatique", "Les vecteurs champ s'éloignent de la charge : les lignes de champ divergent."],
        neg: ["Une charge négative crée un champ électrostatique", "Les vecteurs champ sont dirigés vers la charge : les lignes de champ convergent."]
      }[src];
      readout.innerHTML = c11readout(T[0], T[1] + " Une ligne de champ est tangente, en chacun de ses points, au vecteur champ.", col);
    }
  }
  const sb = (cfg.srcIds || []).map((id, i) => c11btn(id, () => { src = ["masse", "pos", "neg"][i]; sync(true); }));
  const vb = (cfg.viewIds || []).map((id, i) => c11btn(id, () => { view = i ? "lines" : "vec"; sync(true); }));
  const qb = c11btn(cfg.testId, () => { qTest = -qTest; sync(true); });
  function sync(anim) {
    sb.forEach((b, i) => c11setBtn(b, ["masse", "pos", "neg"][i] === src));
    vb.forEach((b, i) => c11setBtn(b, (i ? "lines" : "vec") === view));
    if (qb) { qb.style.visibility = src === "masse" ? "hidden" : "visible"; qb.textContent = "objet test : q " + (qTest > 0 ? "> 0" : "< 0"); }
    if (anim) c11tween(tw, 800, (x) => { p = x; draw(); }); else draw();
  }
  sync(false);
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh11Stages() {
  document.querySelectorAll(".ch11-stage").forEach((outer) => {
    const inner = outer.firstElementChild;
    if (!inner || outer.__fit) return;
    outer.__fit = true;
    let lastS = -1, lastH = -1;
    const fit = () => {
      const s = outer.clientWidth / 1780;
      if (!s) return;
      const hgt = Math.round(inner.offsetHeight * s);
      if (s !== lastS) { lastS = s; inner.style.transform = "scale(" + s + ")"; }
      if (hgt !== lastH) { lastH = hgt; outer.style.height = hgt + "px"; }
    };
    new ResizeObserver(fit).observe(inner);
    fit();
    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    document.querySelectorAll(".mode-tab").forEach((b) => b.addEventListener("click", () => setTimeout(fit, 0)));
  });
}
