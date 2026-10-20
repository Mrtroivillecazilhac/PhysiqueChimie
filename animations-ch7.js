/* Animations du chapitre 7 — 1ère spé PC — Lentilles minces convergentes
   Partie 1 : animations d'origine du site. Partie 2 : animations des diapos. */

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


/* ================================================================== */
/* Partie 2 : animations grand format (diapos, largeur 1780)           */
/* ================================================================== */
var CH7 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };

function ch7fr(n, d) { return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace("-", "−"); }
function ch7text(x, y, s, o) {
  o = o || {};
  return `<text x="${x}" y="${y}" font-size="${o.size || 26}" fill="${o.fill || CH7.dim}" font-family="${o.font || CH7.fh}" text-anchor="${o.anchor || "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}>${s}</text>`;
}
function ch7sub(v, s, size) { return `<tspan font-style="italic">${v}</tspan><tspan font-size="${Math.round((size || 30) * 0.66)}" dy="8">${s}</tspan>`; }
function ch7btn(id, fn) {
  const b = id ? document.getElementById(id) : null;
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function ch7setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function ch7frac(a, b) {
  return `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.1;"><span style="border-bottom:3px solid currentColor;padding:0 8px 4px;align-self:stretch;text-align:center;">${a}</span><span style="padding:4px 8px 0;">${b}</span></span>`;
}
function ch7chip(lab, val, col) {
  return `<div style="border:2px solid ${col}55;background:${col}14;border-radius:12px;padding:10px 20px;display:flex;flex-direction:column;gap:2px;min-width:0;"><span style="font-size:24px;color:#c9c2b0;">${lab}</span><span style="font-family:Kalam,cursive;font-size:40px;color:${col};line-height:1.2;">${val}</span></div>`;
}
function ch7conj(xa, f) {
  if (Math.abs(xa + f) < 1e-6) return null;
  const xap = f * xa / (f + xa);
  return { xap, g: xap / xa };
}
function ch7seg(x1, y1, x2, y2, col, dash, arrow) {
  let s = `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${dash ? 2.5 : 3.5}"${dash ? ' stroke-dasharray="12 9"' : ""}/>`;
  if (arrow) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L > 70) {
      const ux = dx / L, uy = dy / L, k = Math.min(L * 0.5, 190);
      const mx = x1 + ux * k, my = y1 + uy * k;
      s += `<polygon points="${(mx + ux * 13).toFixed(1)},${(my + uy * 13).toFixed(1)} ${(mx - ux * 10 - uy * 10).toFixed(1)},${(my - uy * 10 + ux * 10).toFixed(1)} ${(mx - ux * 10 + uy * 10).toFixed(1)},${(my - uy * 10 - ux * 10).toFixed(1)}" fill="${col}"/>`;
    }
  }
  return s;
}
function ch7vArrow(x, yb, yt, col, dash) {
  const d = yt < yb ? 1 : -1;
  return `<line x1="${x.toFixed(1)}" y1="${yb.toFixed(1)}" x2="${x.toFixed(1)}" y2="${(yt + d * 18).toFixed(1)}" stroke="${col}" stroke-width="5"${dash ? ' stroke-dasharray="12 8"' : ""}/><polygon points="${x.toFixed(1)},${yt.toFixed(1)} ${(x - 12).toFixed(1)},${(yt + d * 24).toFixed(1)} ${(x + 12).toFixed(1)},${(yt + d * 24).toFixed(1)}" fill="${col}"/>`;
}
function ch7arrowFrom(x0, x1, y, col, label) {
  const d = x1 > x0 ? 1 : -1;
  let s = `<line x1="${x0}" y1="${y - 10}" x2="${x0}" y2="${y + 10}" stroke="${col}" stroke-width="3"/>`;
  s += `<line x1="${x0}" y1="${y}" x2="${(x1 - d * 14).toFixed(1)}" y2="${y}" stroke="${col}" stroke-width="3"/>`;
  s += `<polygon points="${x1.toFixed(1)},${y} ${(x1 - d * 16).toFixed(1)},${y - 8} ${(x1 - d * 16).toFixed(1)},${y + 8}" fill="${col}"/>`;
  if (label) s += ch7text(((x0 + x1) / 2).toFixed(1), y - 14, label, { anchor: "middle", size: 30, fill: col });
  return s;
}

/* Banc optique : axe, lentille (ou repère), foyers, objet, rayons, image */
function ch7bench(o) {
  const X = (c) => o.cx + c * o.pxc, Y = (u) => o.y0 - u * o.py;
  const f = o.f, xa = o.xa, h = o.h || 1, XR = o.xmax, XL = o.xmin;
  const r = ch7conj(xa, f), FS = o.fs || 30;
  const inf = !r || Math.abs(xa + f) < 0.25;
  const virt = r && r.xap < 0;
  const clip = o.id + "Clip";
  let m = `<defs><clipPath id="${clip}"><rect x="${X(XL)}" y="${o.top}" width="${X(XR) - X(XL)}" height="${o.bot - o.top}"/></clipPath></defs>`;
  if (o.zones) {
    m += `<rect x="${X(XL)}" y="${o.top}" width="${X(-f) - X(XL)}" height="${o.bot - o.top}" rx="10" fill="rgba(107,191,171,${xa < -f ? 0.11 : 0.03})"/>`;
    m += `<rect x="${X(-f)}" y="${o.top}" width="${X(0) - X(-f)}" height="${o.bot - o.top}" rx="10" fill="rgba(217,122,99,${xa > -f ? 0.14 : 0.03})"/>`;
    m += ch7text(((X(XL) + X(-f)) / 2).toFixed(1), o.bot - 18, "objet avant F", { anchor: "middle", size: 28, fill: CH7.t });
    m += ch7text(((X(-f) + X(0)) / 2).toFixed(1), o.bot - 18, "entre F et O", { anchor: "middle", size: 28, fill: CH7.c });
  }
  m += `<line x1="${X(XL)}" y1="${o.y0}" x2="${X(XR)}" y2="${o.y0}" stroke="${CH7.dim}" stroke-width="2"/>`;
  const L = X(0);
  if (o.noLens) {
    m += `<polygon points="${X(XR) + 4},${o.y0} ${X(XR) - 14},${o.y0 - 8} ${X(XR) - 14},${o.y0 + 8}" fill="${CH7.dim}"/>`;
    m += ch7text(X(XR) - 6, o.y0 - 18, `<tspan font-style="italic">x</tspan>`, { anchor: "end", size: 34, fill: CH7.chalk });
    m += `<line x1="${L}" y1="${o.bot}" x2="${L}" y2="${o.top + 8}" stroke="${CH7.dim}" stroke-width="2"/>`;
    m += `<polygon points="${L},${o.top} ${L - 8},${o.top + 18} ${L + 8},${o.top + 18}" fill="${CH7.dim}"/>`;
    m += ch7text(L + 16, o.top + 26, `<tspan font-style="italic">y</tspan>`, { size: 34, fill: CH7.chalk });
  } else {
    m += ch7text(X(XR) - 10, o.y0 - 14, "Δ", { anchor: "end", size: 30 });
    const lt = o.lensTop || o.top + 10, lb = o.lensBot || o.bot - 10;
    m += `<line x1="${L}" y1="${lt + 4}" x2="${L}" y2="${lb - 4}" stroke="${CH7.chalk}" stroke-width="4"/>`;
    m += `<polygon points="${L},${lt} ${L - 14},${lt + 24} ${L + 14},${lt + 24}" fill="${CH7.chalk}"/>`;
    m += `<polygon points="${L},${lb} ${L - 14},${lb - 24} ${L + 14},${lb - 24}" fill="${CH7.chalk}"/>`;
  }
  [[-f, "F"], [f, "F′"]].forEach((p) => {
    const x = X(p[0]);
    m += `<line x1="${x}" y1="${o.y0 - 10}" x2="${x}" y2="${o.y0 + 10}" stroke="${CH7.chalk}" stroke-width="3"/>`;
    m += ch7text(x, o.y0 + 42, p[1], { anchor: "middle", size: FS, fill: CH7.chalk });
  });
  m += ch7text(L + 12, o.y0 + 42, "O", { size: FS, fill: CH7.chalk });
  m += ch7vArrow(X(xa), o.y0, Y(h), CH7.chalk, false);
  m += ch7text(X(xa) - 12, o.y0 + (Math.abs(X(xa) - X(-f)) < 60 ? 80 : 42), "A", { anchor: "end", size: FS, fill: CH7.chalk });
  m += ch7text(X(xa), Y(h) - 16, "B", { anchor: "middle", size: FS, fill: CH7.chalk });

  let g = `<g clip-path="url(#${clip})">`;
  const seg = (a, b, col, dash, arrow) => ch7seg(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), col, dash, arrow);
  const B = [xa, h], rays = o.rays || [], ext = virt && o.showImage && !inf;
  if (rays.indexOf("c") > -1) {
    g += seg(B, [0, 0], CH7.t, false, true);
    g += seg([0, 0], [XR, h * XR / xa], CH7.t, false, true);
    if (ext) g += seg(B, [r.xap, r.g * h], CH7.t, true, false);
  }
  if (rays.indexOf("p") > -1) {
    g += seg(B, [0, h], CH7.c, false, true);
    g += seg([0, h], [XR, h * (1 - XR / f)], CH7.c, false, true);
    if (ext) g += seg([0, h], [r.xap, r.g * h], CH7.c, true, false);
  }
  if (rays.indexOf("f") > -1 && !inf) {
    const y1 = h * f / (xa + f);
    if (virt) g += seg([-f, 0], B, CH7.dim, true, false);
    g += seg(B, [0, y1], CH7.dim, false, true);
    g += seg([0, y1], [XR, y1], CH7.dim, false, true);
    if (ext) g += seg([0, y1], [r.xap, y1], CH7.dim, true, false);
  }
  if (o.showImage && !inf) {
    const xi = X(r.xap), yi = Y(r.g * h);
    g += ch7vArrow(xi, o.y0, yi, CH7.y, virt);
    if (r.g < 0) { g += ch7text(xi + 12, o.y0 - 16, "A′", { size: FS, fill: CH7.y }); g += ch7text(xi, yi + 42, "B′", { anchor: "middle", size: FS, fill: CH7.y }); }
    else { g += ch7text(xi + 14, o.y0 + 42, "A′", { size: FS, fill: CH7.y }); g += ch7text(xi, yi - 16, "B′", { anchor: "middle", size: FS, fill: CH7.y }); }
  }
  g += "</g>";
  return { svg: m + g, r, inf, virt, X, Y };
}

function ch7propArrow(x, y, size) {
  return ch7text(x, y, "Sens de propagation de la lumière", { size: size || 30, font: CH7.fb }) + ch7seg(x, y + 20, x + 400, y + 20, CH7.dim, false, false) + `<polygon points="${x + 412},${y + 20} ${x + 396},${y + 12} ${x + 396},${y + 28}" fill="${CH7.dim}"/>`;
}

/* ------------------------------------------------------------------ */
/* 1. Repère : abscisses (mode "x") ou ordonnées (mode "y")            */
/* ------------------------------------------------------------------ */
function initLensRepere(cfg) {
  const svg = document.getElementById(cfg.svgId);
  if (!svg) return;
  const Y = cfg.mode === "y", fs = Y ? 36 : 32;
  const o = { id: cfg.svgId, cx: 760, pxc: 44, y0: 260, py: 80, xmin: -15, xmax: Y ? 17 : 22, top: 20, bot: 500, f: 5, xa: -7.5, h: 1, showImage: true, noLens: true, fs };
  if (Y) svg.setAttribute("viewBox", "60 0 1460 520");
  const b = ch7bench(o);
  let m = b.svg + ch7propArrow(Y ? 70 : 90, 40, Y ? 31 : 30);
  if (cfg.mode === "y") {
    const yB = b.Y(1), yBp = b.Y(b.r.g);
    m += `<line x1="${b.X(o.xa)}" y1="${yB}" x2="${b.X(0)}" y2="${yB}" stroke="${CH7.chalk}" stroke-width="2" stroke-dasharray="8 8"/>`;
    m += `<line x1="${b.X(0)}" y1="${yBp}" x2="${b.X(b.r.xap)}" y2="${yBp}" stroke="${CH7.y}" stroke-width="2" stroke-dasharray="8 8"/>`;
    m += ch7text(b.X(0) + 14, yB + 10, ch7sub("y", "B", 36) + `<tspan dy="-8"> = 1,0 cm</tspan>`, { size: 36, fill: CH7.chalk });
    m += ch7text(b.X(0) - 14, yBp + 10, ch7sub("y", "B′", 36) + `<tspan dy="-8"> = −2,0 cm</tspan>`, { anchor: "end", size: 36, fill: CH7.y });
  } else {
    m += ch7arrowFrom(b.X(0), b.X(o.xa), o.y0 + 120, CH7.chalk, "");
    m += ch7text((b.X(0) + b.X(o.xa)) / 2, o.y0 + 106, ch7sub("x", "A", 32) + `<tspan dy="-8"> = −7,5 cm</tspan>`, { anchor: "middle", size: 32, fill: CH7.chalk });
    m += ch7arrowFrom(b.X(0), b.X(b.r.xap), o.y0 - 70, CH7.y, "");
    m += ch7text((b.X(0) + b.X(b.r.xap)) / 2, o.y0 - 84, ch7sub("x", "A′", 32) + `<tspan dy="-8"> = 15 cm</tspan>`, { anchor: "middle", size: 32, fill: CH7.y });
  }
  svg.innerHTML = m;
}

/* ------------------------------------------------------------------ */
/* 2. Construction pas à pas avec les trois rayons                     */
/* ------------------------------------------------------------------ */
function initLensRays(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explain = document.getElementById(cfg.explainId), stepEl = document.getElementById(cfg.stepId);
  if (!svg) return;
  const STEPS = [
    { rays: [], t: "On place l'objet AB (<em>x</em><sub>A</sub> = −7,5 cm) et la lentille de distance focale <em>f</em>′ = 5,0 cm, avec ses foyers F et F′." },
    { rays: ["c"], t: "Le rayon qui passe par le <strong style=\"color:#6bbfab\">centre optique O</strong> n'est pas dévié." },
    { rays: ["c", "p"], t: "Le rayon <strong style=\"color:#d97a63\">parallèle à l'axe optique</strong> ressort en passant par le foyer image F′." },
    { rays: ["c", "p", "f"], t: "Le rayon qui passe par le <strong>foyer objet F</strong> ressort parallèle à l'axe optique." },
    { rays: ["c", "p", "f"], img: true, t: "Les trois rayons se croisent en B′ : l'image A′B′ est <strong style=\"color:#e8c468\">réelle et renversée</strong>. On mesure <em>x</em><sub>A′</sub> = 15 cm." }
  ];
  let step = 0;
  const prev = ch7btn(cfg.prevBtnId, () => { if (step > 0) { step--; draw(); } });
  const next = ch7btn(cfg.nextBtnId, () => { if (step < STEPS.length - 1) { step++; draw(); } });
  function draw() {
    const S = STEPS[step];
    const o = { id: cfg.svgId, cx: 880, pxc: 40, y0: 330, py: 80, xmin: -20, xmax: 22, top: 20, bot: 620, f: 5, xa: -7.5, h: 1, rays: S.rays, showImage: !!S.img };
    const b = ch7bench(o);
    let m = b.svg;
    if (S.img) {
      m += ch7arrowFrom(b.X(0), b.X(-7.5), o.y0 + 110, CH7.chalk, "");
      m += ch7text((b.X(0) + b.X(-7.5)) / 2, o.y0 + 96, ch7sub("x", "A", 30), { anchor: "middle", size: 30, fill: CH7.chalk });
      m += ch7arrowFrom(b.X(0), b.X(15), o.y0 - 70, CH7.y, "");
      m += ch7text(b.X(10), o.y0 - 84, ch7sub("x", "A′", 30), { anchor: "middle", size: 30, fill: CH7.y });
    }
    svg.innerHTML = m;
    if (explain) explain.innerHTML = S.t;
    if (stepEl) stepEl.textContent = `Étape ${step + 1} / ${STEPS.length}`;
    if (prev) prev.disabled = step === 0;
    if (next) next.disabled = step === STEPS.length - 1;
  }
  draw();
}

/* ------------------------------------------------------------------ */
/* 3. Mise au point : déplacer l'écran ou changer f′                   */
/* ------------------------------------------------------------------ */
function initFocusBench(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), prevSvg = $(cfg.previewId), sR = $(cfg.screenRangeId), fR = $(cfg.fRangeId);
  const sL = $(cfg.screenLabelId), fL = $(cfg.fLabelId), readout = $(cfg.readoutId);
  if (!svg) return;
  const XA = -15, A = 2.3;
  function draw() {
    const xs = Number(sR.value) / 10, f = Number(fR.value) / 10;
    const o = { id: cfg.svgId, cx: 680, pxc: 40, y0: 240, py: 70, xmin: -15, xmax: 27, top: 40, bot: 440, f, xa: XA, h: 1, lensTop: 60, lensBot: 420 };
    const b = ch7bench(o), r = b.r, X = b.X, Y = b.Y;
    const yb = r.g;
    const ya = A + (yb - A) * xs / r.xap, yz = -A + (yb + A) * xs / r.xap;
    let m = b.svg;
    const pt = (c, u) => `${X(c).toFixed(1)},${Y(u).toFixed(1)}`;
    m += `<polygon points="${pt(XA, 1)} ${pt(0, A)} ${pt(0, -A)}" fill="rgba(232,196,104,0.10)"/>`;
    if (xs <= r.xap) m += `<polygon points="${pt(0, A)} ${pt(xs, ya)} ${pt(xs, yz)} ${pt(0, -A)}" fill="rgba(232,196,104,0.16)"/>`;
    else m += `<polygon points="${pt(0, A)} ${pt(r.xap, yb)} ${pt(0, -A)}" fill="rgba(232,196,104,0.16)"/><polygon points="${pt(r.xap, yb)} ${pt(xs, ya)} ${pt(xs, yz)}" fill="rgba(232,196,104,0.16)"/>`;
    [[A, ya], [-A, yz]].forEach((q) => {
      m += ch7seg(X(XA), Y(1), X(0), Y(q[0]), CH7.y, false, true);
      m += ch7seg(X(0), Y(q[0]), X(xs), Y(q[1]), CH7.y, false, true);
    });
    m += `<circle cx="${X(r.xap).toFixed(1)}" cy="${Y(yb).toFixed(1)}" r="7" fill="${CH7.y}" opacity="0.7"/>`;
    const sx = X(xs);
    m += `<rect x="${(sx - 6).toFixed(1)}" y="50" width="12" height="380" rx="4" fill="rgba(242,237,225,0.28)" stroke="${CH7.dim}" stroke-width="2"/>`;
    m += `<line x1="${sx.toFixed(1)}" y1="${Y(ya).toFixed(1)}" x2="${sx.toFixed(1)}" y2="${Y(yz).toFixed(1)}" stroke="${CH7.y}" stroke-width="10" stroke-linecap="round"/>`;
    m += ch7text(sx + 16, 72, "écran", { size: 28, fill: CH7.chalk });
    svg.innerHTML = m;
    const spot = Math.abs(ya - yz), sharp = Math.abs(xs - r.xap) < 0.26;
    if (prevSvg) {
      const blur = sharp ? 0 : Math.min(22, spot * 9);
      const hgt = 70 * Math.abs(1 * xs / XA) * 1.4;
      prevSvg.innerHTML = `<defs><filter id="${cfg.previewId}F" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur.toFixed(1)}"/></filter></defs><rect x="0" y="0" width="400" height="300" rx="14" fill="rgba(242,237,225,0.12)"/><g filter="url(#${cfg.previewId}F)">${ch7vArrow(200, 80, 80 + hgt, CH7.y, false)}<line x1="150" y1="80" x2="250" y2="80" stroke="${CH7.y}" stroke-width="4"/></g>`;
    }
    if (sL) sL.innerHTML = `écran : <em>x</em> = ${ch7fr(xs, 1)} cm`;
    if (fL) fL.innerHTML = `<em>f</em>′ = ${ch7fr(f, 1)} cm`;
    if (readout) readout.innerHTML = sharp
      ? `<div style="font-family:Kalam,cursive;font-size:42px;color:#6bbfab;">✔ Image nette</div><div style="font-size:28px;line-height:1.45;">L'écran est à l'endroit où se forme l'image : <em>x</em><sub>A′</sub> = ${ch7fr(r.xap, 1)} cm.</div>`
      : `<div style="font-family:Kalam,cursive;font-size:42px;color:#d97a63;">Image floue</div><div style="font-size:28px;line-height:1.45;color:#c9c2b0;">Les rayons issus de B ne se rejoignent pas sur l'écran : ils forment une tache. Déplace l'écran ou change <em>f</em>′.</div>`;
  }
  [sR, fR].forEach((x) => x.addEventListener("input", draw));
  draw();
}

/* ------------------------------------------------------------------ */
/* 4. Position de l'objet → caractéristiques de l'image                */
/* ------------------------------------------------------------------ */
function initLensExplorer(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), xR = $(cfg.xaRangeId), fR = $(cfg.fRangeId);
  const xL = $(cfg.xaLabelId), fL = $(cfg.fLabelId), readout = $(cfg.readoutId);
  if (!svg) return;
  function draw() {
    const xa = Number(xR.value) / 10, f = Number(fR.value) / 10;
    const o = { id: cfg.svgId, cx: 990, pxc: 35, y0: 350, py: 64, xmin: -26, xmax: 22, top: 10, bot: 600, f, xa, h: 1, rays: ["c", "p", "f"], showImage: true, zones: true, lensTop: 20, lensBot: 540 };
    const b = ch7bench(o), r = b.r;
    svg.innerHTML = b.svg;
    if (xL) xL.innerHTML = `<em>x</em><sub>A</sub> = ${ch7fr(xa, 1)} cm`;
    if (fL) fL.innerHTML = `<em>f</em>′ = ${ch7fr(f, 1)} cm`;
    let h = "";
    if (!r || Math.abs(xa + f) < 0.01) {
      h = `<div style="font-size:29px;line-height:1.45;">L'objet est <strong>sur le foyer objet F</strong> : les rayons ressortent parallèles, l'image est rejetée à l'infini.</div>`;
    } else {
      const g = r.g, real = r.xap > 0;
      h += `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;">`;
      h += ch7chip("Position de l'image", `<em>x</em><sub>A′</sub> = ${ch7fr(r.xap, 1)} cm`, "#e8c468");
      h += ch7chip("Grandissement", `γ = ${ch7fr(g, 2)}`, "#e8c468");
      h += ch7chip("Nature", real ? "réelle" : "virtuelle", real ? "#6bbfab" : "#d97a63");
      h += `</div><div style="font-size:28px;line-height:1.45;margin-top:12px;">`;
      h += real ? "<em>x</em><sub>A′</sub> &gt; 0 : observable sur un écran. " : "<em>x</em><sub>A′</sub> &lt; 0 : non observable sur un écran. ";
      h += g < 0 ? "γ &lt; 0 : <strong>renversée</strong>. " : "γ &gt; 0 : <strong>droite</strong>. ";
      h += Math.abs(g) > 1 ? "|γ| &gt; 1 : <strong>plus grande</strong> que l'objet." : "|γ| &lt; 1 : <strong>plus petite</strong> que l'objet.";
      if (!real) h += ` <strong style="color:#e8c468;">Effet loupe.</strong>`;
      h += `</div>`;
    }
    readout.innerHTML = h;
  }
  [xR, fR].forEach((x) => x.addEventListener("input", draw));
  draw();
}

/* ------------------------------------------------------------------ */
/* 5. Exploiter les relations pas à pas (conjugaison → grandissement)  */
/* ------------------------------------------------------------------ */
function initLensCalcDeck(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), eqEl = $(cfg.eqId), explain = $(cfg.explainId), stepEl = $(cfg.stepId);
  if (!svg) return;
  const xa = ch7sub("x", "A", 30), xap = ch7sub("x", "A′", 30);
  const hx = (s) => `<em>x</em><sub>${s}</sub>`;
  const res = (s) => `<span style="color:#e8c468;">${s}</span>`;
  const STEPS = [
    { show: 0, eq: `${hx("A")} = −7,5 cm &nbsp;·&nbsp; <em>f</em>′ = 5,0 cm`,
      t: "Données de départ : la position de l'objet et la distance focale de la lentille." },
    { show: 0, eq: `${ch7frac("1", hx("A′"))} = ${ch7frac("1", "<em>f</em>′")} + ${ch7frac("1", hx("A"))} = ${ch7frac("1", "5,0")} + ${ch7frac("1", "−7,5")}`,
      t: "On applique la relation de conjugaison pour isoler 1 / " + hx("A′") + "." },
    { show: 1, eq: `${ch7frac("1", hx("A′"))} = ${ch7frac("1", "15")} &nbsp; donc &nbsp; ${res(hx("A′") + " = 15 cm")}`,
      t: "Calcul : " + hx("A′") + " = 15 cm. Comme " + hx("A′") + " &gt; 0, l'image est <strong>réelle</strong> (projetable sur un écran)." },
    { show: 1, eq: `γ = ${ch7frac(hx("A′"), hx("A"))} = ${ch7frac("15", "−7,5")} = ${res("−2,0")}`,
      t: "On applique la relation de grandissement pour trouver γ." },
    { show: 2, eq: `${res("γ = −2,0")}`,
      t: "Interprétation : γ &lt; 0, l'image est <strong>renversée</strong>. |γ| = 2,0 &gt; 1, l'image est <strong>deux fois plus grande</strong> que l'objet." }
  ];
  let step = 0;
  const prev = ch7btn(cfg.prevBtnId, () => { if (step > 0) { step--; draw(); } });
  const next = ch7btn(cfg.nextBtnId, () => { if (step < STEPS.length - 1) { step++; draw(); } });
  function draw() {
    const S = STEPS[step];
    const o = { id: cfg.svgId, cx: 820, pxc: 44, y0: 220, py: 70, xmin: -17, xmax: 21, top: 10, bot: 470, f: 5, xa: -7.5, h: 1, showImage: S.show === 2 };
    const b = ch7bench(o);
    let m = b.svg;
    m += ch7arrowFrom(b.X(0), b.X(-7.5), o.y0 + 130, CH7.chalk, "");
    m += ch7text((b.X(0) + b.X(-7.5)) / 2, o.y0 + 116, xa + `<tspan dy="-8"> = −7,5 cm</tspan>`, { anchor: "middle", size: 30, fill: CH7.chalk });
    m += ch7arrowFrom(b.X(0), b.X(5), o.y0 + 130, CH7.t, "");
    m += ch7text((b.X(0) + b.X(5)) / 2, o.y0 + 116, `<tspan font-style="italic">f</tspan>′ = 5,0 cm`, { anchor: "middle", size: 30, fill: CH7.t });
    if (S.show >= 1) {
      const xi = b.X(15);
      if (S.show === 1) {
        m += `<circle cx="${xi}" cy="${o.y0}" r="9" fill="${CH7.y}"/>`;
        m += ch7text(xi + 14, o.y0 - 18, "A′", { size: 30, fill: CH7.y });
      }
      m += ch7arrowFrom(b.X(0), xi, o.y0 - 110, CH7.y, "");
      m += ch7text((b.X(0) + xi) / 2, o.y0 - 124, xap + `<tspan dy="-8"> = 15 cm</tspan>`, { anchor: "middle", size: 30, fill: CH7.y });
    }
    svg.innerHTML = m;
    if (eqEl) eqEl.innerHTML = S.eq;
    if (explain) explain.innerHTML = S.t;
    if (stepEl) stepEl.textContent = `Étape ${step + 1} / ${STEPS.length}`;
    if (prev) prev.disabled = step === 0;
    if (next) next.disabled = step === STEPS.length - 1;
  }
  draw();
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh7Stages() {
  document.querySelectorAll(".ch7-stage").forEach((outer) => {
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
