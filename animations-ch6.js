/* Animations du chapitre 6 — 1ère spé PC — Ondes mécaniques
   Partie 1 : animations d'origine du site (vague, retard, double périodicité).
   Partie 2 : nouvelles animations (diapos + site). */

/* ---------- 12. Vague animée (propagation transverse) ---------- */
function initWaveAnimation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tRange = document.getElementById(cfg.tRangeId);
  const lambdaRange = document.getElementById(cfg.lambdaRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const W = 260, baseline = 60, amplitude = 28;
  let lastTime = performance.now();
  let phase = 0; // accumulée progressivement, jamais recalculée d'un bloc

  function frame(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    const T = Number(tRange.value) / 10;      // secondes
    const lambda = Number(lambdaRange.value);  // "unités" arbitraires
    const omega = (2 * Math.PI) / T;
    phase += omega * dt; // pas de saut : on avance depuis la phase actuelle
    const k = (2 * Math.PI) / lambda;

    let path = "";
    for (let x = 0; x <= W; x += 4) {
      const y = baseline - amplitude * Math.sin(k * x - phase);
      path += (x === 0 ? "M" : "L") + x + " " + y + " ";
    }
    const markX = 130;
    const markY = baseline - amplitude * Math.sin(k * markX - phase);

    svg.innerHTML = `
      <line x1="0" y1="${baseline}" x2="${W}" y2="${baseline}" stroke="var(--line)" stroke-width="1"/>
      <path d="${path}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>
      <line x1="${markX}" y1="${baseline - amplitude - 12}" x2="${markX}" y2="${baseline + amplitude + 12}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,2"/>
      <circle cx="${markX}" cy="${markY}" r="6" fill="var(--yellow)"/>`;

    readout.innerHTML = `T = ${T.toFixed(1)} s · λ = ${lambda} → v = λ/T ≈ <strong style="color:var(--yellow)">${(lambda / T).toFixed(1)}</strong> · le point jaune oscille, il n'avance pas`;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- 13. Retard entre deux points (A → B) — bosse sur une corde ---------- */
function initWaveDelay(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const distRange = document.getElementById(cfg.distRangeId);
  const veloRange = document.getElementById(cfg.veloRangeId);
  const playBtn = document.getElementById(cfg.playBtnId);
  const readout = document.getElementById(cfg.readoutId);

  const startX = 10, baseline = 55, amplitude = 22, bumpWidth = 24, lead = 30;
  let animId = null;

  function ropeY(x, pulseX) {
    const dx = x - pulseX;
    if (Math.abs(dx) > bumpWidth) return baseline;
    return baseline - amplitude * 0.5 * (1 + Math.cos((Math.PI * dx) / bumpWidth));
  }

  function drawFrame(pulseX, aReached, bReached) {
    const D = Number(distRange.value);
    const Ax = startX + lead, Bx = Ax + D;
    const W = Bx + lead + 20;

    let path = "";
    for (let x = 0; x <= W; x += 4) {
      const y = ropeY(x, pulseX);
      path += (x === 0 ? "M" : "L") + x + " " + y + " ";
    }

    const Ay = ropeY(Ax, pulseX), By = ropeY(Bx, pulseX);
    let svgContent = `<path d="${path}" fill="none" stroke="var(--yellow)" stroke-width="2.5"/>`;
    svgContent += `<line x1="${startX}" y1="${baseline}" x2="${W}" y2="${baseline}" stroke="var(--line)" stroke-width="1" stroke-dasharray="2,3"/>`;
    svgContent += `<circle cx="${Ax}" cy="${Ay}" r="6" fill="${aReached ? 'var(--teal)' : 'var(--chalk-dim)'}"/><text x="${Ax}" y="${baseline + amplitude + 16}" font-size="10" fill="var(--chalk-dim)" text-anchor="middle">A</text>`;
    svgContent += `<circle cx="${Bx}" cy="${By}" r="6" fill="${bReached ? 'var(--coral)' : 'var(--chalk-dim)'}"/><text x="${Bx}" y="${baseline + amplitude + 16}" font-size="10" fill="var(--chalk-dim)" text-anchor="middle">B</text>`;
    svg.setAttribute("viewBox", `0 0 ${W} ${baseline + amplitude + 30}`);
    svg.innerHTML = svgContent;
  }

  function play() {
    const D = Number(distRange.value);
    const v = Number(veloRange.value);
    const dt = D / v;
    const Ax = startX + lead, Bx = Ax + D;
    const pulseStart = Ax - lead, pulseEnd = Bx + lead;
    const totalDist = pulseEnd - pulseStart;
    const totalDur = totalDist / v;
    const start = performance.now();
    cancelAnimationFrame(animId);
    let aFlashed = false, bFlashed = false;

    function frame(now) {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(1, elapsed / totalDur);
      const pulseX = pulseStart + progress * totalDist;
      if (pulseX >= Ax) aFlashed = true;
      if (pulseX >= Bx) bFlashed = true;
      drawFrame(pulseX, aFlashed, bFlashed);
      if (progress < 1) {
        animId = requestAnimationFrame(frame);
      } else {
        readout.innerHTML = `d = ${D}, v = ${v} → retard <strong style="color:var(--coral)">Δt = d / v = ${dt.toFixed(2)} s</strong> entre le passage en A et en B`;
      }
    }
    readout.textContent = "La déformation parcourt la corde de A vers B…";
    animId = requestAnimationFrame(frame);
  }

  distRange.addEventListener("input", () => drawFrame(-999, false, false));
  veloRange.addEventListener("input", () => drawFrame(-999, false, false));
  playBtn.addEventListener("click", play);
  drawFrame(-999, false, false);
}

/* ---------- 14. Double périodicité (temporelle vs spatiale) ---------- */
function initDoublePeriodicity(cfg) {
  const svgTime = document.getElementById(cfg.svgTimeId);
  const svgSpace = document.getElementById(cfg.svgSpaceId);
  const readout = document.getElementById(cfg.readoutId);
  const syncBtn = document.getElementById(cfg.syncBtnId);

  // Plus de curseurs propres à cette animation : les valeurs viennent
  // uniquement de "Figer les réglages" (lu depuis la vague animée).
  let currentT = Number(document.getElementById(cfg.sourceTId).value) / 10;
  let currentLambda = Number(document.getElementById(cfg.sourceLambdaId).value);

  const W = 240, baseline = 55, amplitude = 26;
  const PX_PER_SEC = 60;   // échelle FIXE : le graphe s'étire/se compresse vraiment avec T
  const PX_PER_UNIT = 1.2; // échelle FIXE pour λ (même plage que l'anim 1 : 40 à 200)

  function sineSvg(period, pxPerUnit, axisLabel, periodLabel, color) {
    let path = "";
    for (let x = 0; x <= W; x += 3) {
      const y = baseline - amplitude * Math.sin((2 * Math.PI / (period * pxPerUnit)) * x);
      path += (x === 0 ? "M" : "L") + x + " " + y + " ";
    }
    const periodPxFull = period * pxPerUnit;
    // repère placé entre deux crêtes (sommets), toujours visible même si
    // la période totale dépasse la largeur du cadre
    const bracketPx = Math.min(periodPxFull, W * 0.65);
    const x1 = bracketPx / 4;       // 1ère crête (sin = 1)
    const x2 = x1 + bracketPx;      // crête suivante, une période plus loin
    const peakY = baseline - amplitude;
    const arrowY = peakY - 16;

    const markerId = "periodArrow-" + color.replace(/[^a-z]/gi, "");
    let s = `<defs>
      <marker id="${markerId}" markerWidth="6" markerHeight="6" refX="3" refY="3" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker>
    </defs>`;
    s += `<line x1="0" y1="${baseline}" x2="${W}" y2="${baseline}" stroke="var(--line)" stroke-width="1"/>`;
    s += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.2"/>`;
    // pointillés reliant les deux crêtes à la flèche du haut
    s += `<line x1="${x1}" y1="${peakY}" x2="${x1}" y2="${arrowY}" stroke="${color}" stroke-width="1" stroke-dasharray="2,2" opacity="0.7"/>`;
    s += `<line x1="${x2}" y1="${peakY}" x2="${x2}" y2="${arrowY}" stroke="${color}" stroke-width="1" stroke-dasharray="2,2" opacity="0.7"/>`;
    // double flèche horizontale entre les deux pointillés
    s += `<line x1="${x1 + 2}" y1="${arrowY}" x2="${x2 - 2}" y2="${arrowY}" stroke="${color}" stroke-width="1.5" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>`;
    s += `<text x="${(x1 + x2) / 2}" y="${arrowY - 6}" font-size="9" fill="${color}" text-anchor="middle" font-weight="700">${periodLabel}</text>`;
    s += `<text x="${W / 2}" y="${baseline + amplitude + 24}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${axisLabel}</text>`;
    return s;
  }

  function draw() {
    const T = currentT;
    const lambda = currentLambda;
    svgTime.innerHTML = sineSvg(T, PX_PER_SEC, "Temps (s)", `T = ${T.toFixed(1)} s`, "var(--coral)");
    svgSpace.innerHTML = sineSvg(lambda, PX_PER_UNIT, "Distance (m)", `λ = ${lambda} m`, "var(--teal)");
    readout.innerHTML = `📸 Ceci est un <strong style="color:var(--yellow);">instantané figé</strong> de l'onde animée ci-dessus. Les deux graphes décrivent <strong style="color:var(--yellow)">la même onde</strong>. À gauche : on reste au même endroit et on regarde l'élongation évoluer dans le <strong style="color:var(--coral)">temps</strong> (période T). À droite : on prend une "photo" à un instant donné et on regarde comment l'élongation varie dans l'<strong style="color:var(--teal)">espace</strong> (période λ).`;
  }

  syncBtn.addEventListener("click", () => {
    const sourceT = document.getElementById(cfg.sourceTId);
    const sourceLambda = document.getElementById(cfg.sourceLambdaId);
    currentT = Number(sourceT.value) / 10;
    currentLambda = Number(sourceLambda.value);
    draw();
  });

  draw();
}


var CH6 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };

function ch6fr(n, d) { return Number(n).toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function ch6visible(el) {
  if (!el || el.getBoundingClientRect().width === 0) return false;
  const sec = el.closest("section");
  if (!sec) return true;
  if (!document.querySelector("[data-deck-active]")) return true;
  return sec.hasAttribute("data-deck-active");
}
function ch6btn(id, fn) {
  const b = id ? document.getElementById(id) : null;
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function ch6loop(el, fn) {
  let last = performance.now();
  function f(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    if (ch6visible(el)) fn(dt);
    requestAnimationFrame(f);
  }
  requestAnimationFrame(f);
}
function ch6set(el, html) { if (el && el.__h !== html) { el.__h = html; el.innerHTML = html; } }
function ch6text(x, y, s, o) {
  o = o || {};
  return `<text x="${x}" y="${y}" font-size="${o.size || 26}" fill="${o.fill || CH6.dim}" font-family="${o.font || CH6.fh}" text-anchor="${o.anchor || "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}>${s}</text>`;
}
function ch6arrowH(x1, x2, y, col, label, size) {
  const h = 14;
  let m = `<line x1="${(x1 + h).toFixed(1)}" y1="${y}" x2="${(x2 - h).toFixed(1)}" y2="${y}" stroke="${col}" stroke-width="3"/>`;
  m += `<polygon points="${x1.toFixed(1)},${y} ${(x1 + h).toFixed(1)},${y - 8} ${(x1 + h).toFixed(1)},${y + 8}" fill="${col}"/>`;
  m += `<polygon points="${x2.toFixed(1)},${y} ${(x2 - h).toFixed(1)},${y - 8} ${(x2 - h).toFixed(1)},${y + 8}" fill="${col}"/>`;
  if (label) m += ch6text(((x1 + x2) / 2).toFixed(1), y - 14, label, { fill: col, size: size || 30, anchor: "middle", weight: 700 });
  return m;
}
function ch6arrowTo(x1, y1, x2, y2, col, w) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, h = 16;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" stroke="${col}" stroke-width="${w || 3}"/><polygon points="${x2.toFixed(1)},${y2.toFixed(1)} ${(bx - uy * 8).toFixed(1)},${(by + ux * 8).toFixed(1)} ${(bx + uy * 8).toFixed(1)},${(by - ux * 8).toFixed(1)}" fill="${col}"/>`;
}
function ch6setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function ch6frac(a, b) {
  return `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;"><span style="padding:0 8px 3px;">${a}</span><span style="border-bottom:3px solid currentColor;width:100%;"></span><span style="padding:3px 8px 0;">${b}</span></span>`;
}

/* ================================================================== */
/* 1. Un caillou dans l'eau : les bateaux montent, mais n'avancent pas */
/* ================================================================== */
function initWaterBoats(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const status = document.getElementById(cfg.statusId);
  const readout = document.getElementById(cfg.readoutId);
  if (!svg) return;
  const W = 1780, Y0 = 350, BOT = 560, X0 = 90, PXM = 160, IMPACT = 170;
  const V = 320, AMP = 80, WID = 85, CM = 0.25, FALL = 0.5;
  const boats = [
    { x: X0 + 4 * PXM, col: CH6.y, name: "jaune", max: 0 },
    { x: X0 + 8 * PXM, col: CH6.c, name: "corail", max: 0 }
  ];
  let t = -1;
  const front = () => IMPACT + V * (t - FALL);
  function surf(x) {
    if (t < FALL) return Y0;
    const s = t - FALL, g = Math.min(1, s / 0.3);
    const cR = IMPACT + V * s, cL = IMPACT - V * s;
    return Y0 - AMP * g * (Math.exp(-(((x - cR) / WID) ** 2)) + Math.exp(-(((x - cL) / WID) ** 2)));
  }
  function boat(b) {
    const y = surf(b.x), sl = (surf(b.x + 8) - surf(b.x - 8)) / 16, a = Math.atan(sl) * 180 / Math.PI;
    return `<g transform="translate(${b.x} ${y.toFixed(1)}) rotate(${a.toFixed(1)})">
      <line x1="0" y1="-14" x2="0" y2="-150" stroke="${CH6.chalk}" stroke-width="4"/>
      <path d="M7 -146 L7 -34 L80 -34 Z" fill="${b.col}"/>
      <path d="M-7 -132 L-7 -40 L-56 -40 Z" fill="${b.col}" opacity="0.6"/>
      <path d="M-82 -16 L82 -16 L58 22 L-58 22 Z" fill="#e9e2d2" stroke="${CH6.dim}" stroke-width="2"/>
    </g>`;
  }
  function msg() {
    if (t < 0) return "Lâche le caillou et observe les deux bateaux.";
    if (t < FALL) return "Le caillou tombe…";
    const c = front();
    if (c < boats[0].x - 130) return "La surface se déforme au point d'impact : la perturbation se propage.";
    if (c < boats[0].x + 130) return "Le bateau <strong style=\"color:#e8c468\">jaune</strong> est soulevé, puis redescend.";
    if (c < boats[1].x - 130) return "La perturbation continue vers le bateau corail…";
    if (c < boats[1].x + 130) return "Au tour du bateau <strong style=\"color:#d97a63\">corail</strong>.";
    return "Les bateaux ont été soulevés l'un après l'autre : l'onde transporte de l'<strong style=\"color:#e8c468\">énergie</strong>. Leur position <em>x</em> n'a pas changé : <strong style=\"color:#e8c468\">pas de transport de matière</strong>.";
  }
  function draw() {
    let m = "";
    let sy = 40;
    if (t >= 0) sy = t < FALL ? 40 + (Y0 - 40) * (t / FALL) ** 2 : Math.min(BOT - 22, Y0 + (t - FALL) * 90);
    m += `<ellipse cx="${IMPACT}" cy="${sy.toFixed(1)}" rx="22" ry="16" fill="#8d8a80" stroke="${CH6.dim}" stroke-width="2"/>`;
    if (t < 0) m += ch6text(IMPACT + 44, 50, "caillou", { size: 26 });
    boats.forEach((b) => { m += boat(b); });
    let d = "";
    for (let x = 0; x <= W; x += 8) d += (d ? " L" : "M") + x + " " + surf(x).toFixed(1);
    m += `<path d="${d} L${W} ${BOT} L0 ${BOT} Z" fill="rgba(107,191,171,0.26)"/>`;
    m += `<path d="${d}" fill="none" stroke="${CH6.t}" stroke-width="4"/>`;
    m += `<line x1="0" y1="${Y0}" x2="${W}" y2="${Y0}" stroke="rgba(242,237,225,0.45)" stroke-width="2" stroke-dasharray="12 10"/>`;
    m += ch6text(W - 16, Y0 + 42, "niveau de repos", { anchor: "end", size: 26 });
    boats.forEach((b) => {
      const e = Y0 - surf(b.x);
      if (e > 6) {
        const ax = b.x + 112;
        m += ch6arrowTo(ax, Y0, ax, Y0 - e, b.col, 4);
        m += ch6text(ax + 14, (Y0 - e / 2 + 10).toFixed(1), "y", { fill: b.col, size: 34, weight: 700 });
      }
    });
    if (t > FALL) {
      const c = front();
      if (c < W - 70) {
        m += ch6arrowTo(c - 60, 92, c + 60, 92, CH6.chalk, 3);
        m += ch6text(c.toFixed(1), 70, "propagation", { anchor: "middle", size: 26, fill: CH6.chalk });
      }
    }
    const RY = 605;
    m += `<line x1="${X0}" y1="${RY}" x2="${X0 + 10 * PXM}" y2="${RY}" stroke="${CH6.dim}" stroke-width="2"/>`;
    for (let i = 0; i <= 10; i++) {
      const x = X0 + i * PXM;
      m += `<line x1="${x}" y1="${RY - 8}" x2="${x}" y2="${RY + 8}" stroke="${CH6.dim}" stroke-width="2"/>`;
      m += ch6text(x, RY + 42, i + (i === 10 ? " m" : ""), { anchor: "middle", size: 24, font: CH6.fb });
    }
    boats.forEach((b) => { m += `<polygon points="${b.x},${RY - 10} ${b.x - 12},${RY - 32} ${b.x + 12},${RY - 32}" fill="${b.col}"/>`; });
    ch6set(svg, m);
    boats.forEach((b) => { b.max = Math.max(b.max, Y0 - surf(b.x)); });
    ch6set(readout, boats.map((b) => {
      const e = Math.max(0, Y0 - surf(b.x));
      return `<div style="display:flex;align-items:center;gap:18px;font-size:28px;flex-wrap:wrap;"><span style="width:24px;height:24px;border-radius:50%;background:${b.col};flex:none;"></span><span style="min-width:330px;">Bateau ${b.name} : <em>x</em> = ${ch6fr((b.x - X0) / PXM, 1)} m</span><span style="min-width:280px;">élongation <em>y</em> = <strong style="color:${b.col};">${ch6fr(e * CM, 0)} cm</strong></span><span style="color:#c9c2b0;">maximum atteint : ${ch6fr(b.max * CM, 0)} cm</span></div>`;
    }).join(""));
    ch6set(status, msg());
  }
  ch6btn(cfg.dropBtnId, () => { boats.forEach((b) => { b.max = 0; }); t = 0; });
  ch6btn(cfg.resetBtnId, () => { boats.forEach((b) => { b.max = 0; }); t = -1; });
  ch6loop(svg, (dt) => { if (t >= 0 && front() < W + 220) t += dt; draw(); });
  draw();
}

/* ================================================================== */
/* 2. Échelle microscopique : une chaîne d'entités reliées             */
/* ================================================================== */
function initMicroChain(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const status = document.getElementById(cfg.statusId);
  if (!svg) return;
  const N = 16, X0 = 125, DX = 102, Y = 215, R = 24, TAU = 0.24, DP = 1.1;
  const AMP = { ud: 110, lr: 46 };
  const END = (N - 1) * TAU + DP;
  let mode = "ud", t = -1;
  const bUd = ch6btn(cfg.udBtnId, () => setMode("ud"));
  const bLr = ch6btn(cfg.lrBtnId, () => setMode("lr"));
  ch6btn(cfg.pushBtnId, () => { t = 0; });
  function setMode(k) { mode = k; t = -1; ch6setBtn(bUd, k === "ud"); ch6setBtn(bLr, k === "lr"); }
  const p = (s) => (s <= 0 || s >= DP ? 0 : Math.sin(Math.PI * s / DP) ** 2);
  function pos(i) {
    const u = t < 0 ? 0 : AMP[mode] * p(t - i * TAU);
    return mode === "ud" ? { x: X0 + i * DX, y: Y - u, u } : { x: X0 + i * DX + u, y: Y, u };
  }
  function spring(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const sx = a.x + ux * R, sy = a.y + uy * R, Lz = L - 2 * R, K = 7, zz = 11;
    let d = `M${sx.toFixed(1)} ${sy.toFixed(1)}`;
    for (let j = 1; j < 2 * K; j++) {
      const f = j / (2 * K), o = (j % 2 ? 1 : -1) * zz;
      d += ` L${(sx + ux * Lz * f + nx * o).toFixed(1)} ${(sy + uy * Lz * f + ny * o).toFixed(1)}`;
    }
    d += ` L${(b.x - ux * R).toFixed(1)} ${(b.y - uy * R).toFixed(1)}`;
    const r = L / DX, col = r > 1.06 ? CH6.y : r < 0.94 ? CH6.c : "rgba(201,194,176,0.7)";
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  function draw() {
    let m = "";
    const P = [];
    for (let i = 0; i < N; i++) {
      P.push(pos(i));
      m += `<circle cx="${X0 + i * DX}" cy="${Y}" r="${R + 2}" fill="none" stroke="rgba(242,237,225,0.32)" stroke-width="2" stroke-dasharray="6 6"/>`;
    }
    for (let i = 0; i < N - 1; i++) m += spring(P[i], P[i + 1]);
    P.forEach((q) => {
      const moving = Math.abs(q.u) > 0.04 * AMP[mode];
      m += `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${R}" fill="${moving ? CH6.y : CH6.t}" stroke="#16261f" stroke-width="2"/>`;
    });
    if (t >= 0 && t < DP) {
      if (mode === "ud") { m += ch6arrowTo(52, Y + 70, 52, Y - 80, CH6.c, 5); m += ch6text(12, Y + 112, "perturbation", { fill: CH6.c, size: 26 }); }
      else { m += ch6arrowTo(20, Y - 70, 120, Y - 70, CH6.c, 5); m += ch6text(12, Y - 92, "perturbation", { fill: CH6.c, size: 26 }); }
    }
    const LY = 440;
    m += `<circle cx="92" cy="${LY - 9}" r="15" fill="${CH6.t}"/>` + ch6text(120, LY, "entité au repos", { size: 26, font: CH6.fb });
    m += `<circle cx="472" cy="${LY - 9}" r="15" fill="${CH6.y}"/>` + ch6text(500, LY, "entité écartée", { size: 26, font: CH6.fb });
    m += `<circle cx="832" cy="${LY - 9}" r="16" fill="none" stroke="rgba(242,237,225,0.5)" stroke-width="2" stroke-dasharray="6 6"/>` + ch6text(860, LY, "position d'équilibre", { size: 26, font: CH6.fb });
    m += `<path d="M1210 ${LY - 9} l6 -10 l8 20 l8 -20 l8 20 l8 -20 l8 20 l6 -10" fill="none" stroke="${CH6.y}" stroke-width="3"/>` + ch6text(1280, LY, "interaction modifiée", { size: 26, font: CH6.fb });
    ch6set(svg, m);
    let s;
    if (t < 0) s = "Clique sur « Perturber » : la première entité est écartée de sa position d'équilibre.";
    else if (t < END) {
      const k = Math.min(N, Math.floor(t / TAU) + 1);
      s = `L'entité n° ${k} est écartée de sa position d'équilibre : ses interactions avec sa <strong style="color:#e8c468">voisine</strong> sont modifiées, et la voisine est déplacée à son tour.`;
    } else s = "Toutes les entités sont revenues à leur position d'équilibre. La perturbation s'est propagée <strong style=\"color:#e8c468\">de proche en proche</strong>, sans transport de matière.";
    ch6set(status, s);
  }
  setMode("ud");
  ch6loop(svg, (dt) => { if (t >= 0 && t < END + 0.1) t += dt; draw(); });
  draw();
}

/* ================================================================== */
/* 3. Retard entre A et B : chronométrer la perturbation               */
/* ================================================================== */
function initDelayAB(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dR = document.getElementById(cfg.dRangeId), vR = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const dL = document.getElementById(cfg.dLabelId), vL = document.getElementById(cfg.vLabelId);
  if (!svg) return;
  const X0 = 90, PXM = 80, Y = 250, AMP = 110, WM = 0.6, XA = 2;
  let t = -1, tA = null, tB = null;
  const D = () => Number(dR.value), Vv = () => Number(vR.value) / 10;
  const c = () => (t < 0 ? -10 : Vv() * t);
  const ry = (xm) => Y - AMP * Math.exp(-(((xm - c()) / WM) ** 2));
  const px = (m) => X0 + m * PXM;
  function chip(lab, val, col) {
    return `<div style="border:2px solid ${col}55;background:${col}14;border-radius:12px;padding:10px 20px;display:flex;flex-direction:column;gap:2px;min-width:0;"><span style="font-size:24px;color:#c9c2b0;">${lab}</span><span style="font-family:Kalam,cursive;font-size:42px;color:${col};line-height:1.2;">${val}</span></div>`;
  }
  function draw() {
    const d = D(), v = Vv(), xB = XA + d;
    let m = `<rect x="${X0 - 52}" y="${Y - 30}" width="40" height="60" rx="8" fill="rgba(242,237,225,0.12)" stroke="${CH6.dim}" stroke-width="2"/>`;
    [[XA, "A", tA !== null ? CH6.t : CH6.dim], [xB, "B", tB !== null ? CH6.c : CH6.dim]].forEach((q) => {
      m += `<line x1="${px(q[0])}" y1="112" x2="${px(q[0])}" y2="${Y + 60}" stroke="${q[2]}" stroke-width="2" stroke-dasharray="6 8"/>`;
      m += ch6text(px(q[0]), 96, q[1], { anchor: "middle", size: 50, fill: q[2], weight: 700 });
    });
    let s = "";
    for (let x = X0 - 12; x <= X0 + 20 * PXM; x += 6) s += (s ? " L" : "M") + x + " " + ry((x - X0) / PXM).toFixed(1);
    m += `<path d="${s}" fill="none" stroke="${CH6.y}" stroke-width="5" stroke-linecap="round"/>`;
    m += `<circle cx="${px(XA)}" cy="${ry(XA).toFixed(1)}" r="14" fill="${tA !== null ? CH6.t : CH6.dim}" stroke="#16261f" stroke-width="3"/>`;
    m += `<circle cx="${px(xB)}" cy="${ry(xB).toFixed(1)}" r="14" fill="${tB !== null ? CH6.c : CH6.dim}" stroke="#16261f" stroke-width="3"/>`;
    m += ch6arrowH(px(XA), px(xB), Y + 88, CH6.chalk);
    m += ch6text((px(XA) + px(xB)) / 2, Y + 132, `d = ${d} m`, { anchor: "middle", size: 34, fill: CH6.chalk });
    const RY = 418;
    m += `<line x1="${X0}" y1="${RY}" x2="${px(20)}" y2="${RY}" stroke="${CH6.dim}" stroke-width="2"/>`;
    for (let i = 0; i <= 20; i++) {
      const x = px(i);
      m += `<line x1="${x}" y1="${RY - (i % 2 ? 5 : 9)}" x2="${x}" y2="${RY + (i % 2 ? 5 : 9)}" stroke="${CH6.dim}" stroke-width="2"/>`;
      if (i % 2 === 0) m += ch6text(x, RY + 42, i + (i === 20 ? " m" : ""), { anchor: "middle", size: 24, font: CH6.fb });
    }
    ch6set(svg, m);
    const dash = "—";
    const tt = t < 0 ? 0 : t;
    let h = `<div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;">`;
    h += chip("Chronomètre", `t = ${ch6fr(tt, 2)} s`, "#f2ede1");
    h += chip("Passage en A", tA !== null ? `t<sub>A</sub> = ${ch6fr(tA, 2)} s` : dash, "#6bbfab");
    h += chip("Passage en B", tB !== null ? `t<sub>B</sub> = ${ch6fr(tB, 2)} s` : dash, "#d97a63");
    h += chip("Retard", tB !== null ? `Δt = ${ch6fr(tB - tA, 2)} s` : dash, "#e8c468");
    h += `</div>`;
    if (tB !== null) {
      h += `<div style="display:flex;align-items:center;gap:14px;font-family:Kalam,cursive;font-size:42px;color:#e8c468;margin-top:14px;flex-wrap:wrap;"><span><em>v</em> =</span>${ch6frac("<em>d</em>", "Δ<em>t</em>")}<span>=</span>${ch6frac(d, ch6fr(tB - tA, 2))}<span>= ${ch6fr(d / (tB - tA), 1)} m·s⁻¹</span></div>`;
    } else {
      h += `<div style="font-size:28px;color:#c9c2b0;margin-top:14px;">${t < 0 ? "Règle d et v, puis lance la perturbation." : "La perturbation parcourt la corde…"}</div>`;
    }
    ch6set(readout, h);
    if (dL) dL.textContent = `d = ${d} m`;
    if (vL) vL.innerHTML = `v = ${ch6fr(v, 1)} m·s⁻¹`;
  }
  const reset = () => { t = -1; tA = null; tB = null; };
  dR.addEventListener("input", reset);
  vR.addEventListener("input", reset);
  ch6btn(cfg.playBtnId, () => { t = 0; tA = null; tB = null; });
  ch6loop(svg, (dt) => {
    if (t >= 0 && c() < 21.5) {
      t += dt;
      const v = Vv();
      if (tA === null && c() >= XA) tA = XA / v;
      if (tB === null && c() >= XA + D()) tB = (XA + D()) / v;
    }
    draw();
  });
  draw();
}

/* ================================================================== */
/* 4. La course : même onde, milieux différents                        */
/* ================================================================== */
function initMediaRace(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  if (!svg) return;
  const SX = 300, FX = 1500, DIST = 1000;
  const lanes = [
    { n: "Air", v: 340, s: "≈ 340 m·s⁻¹", col: CH6.chalk, bg: "rgba(242,237,225,0.04)", cy: 95 },
    { n: "Eau", v: 1500, s: "≈ 1 500 m·s⁻¹", col: CH6.t, bg: "rgba(107,191,171,0.12)", cy: 235 },
    { n: "Acier", v: 5000, s: "≈ 5 000 m·s⁻¹", col: CH6.y, bg: "rgba(201,194,176,0.13)", cy: 375 },
    { n: "Vide", v: 0, s: "aucun milieu matériel", col: CH6.c, bg: "rgba(0,0,0,0.35)", cy: 515 }
  ];
  const END = DIST / 340 + 0.4;
  let t = -1, slow = 1;
  const bSlow = ch6btn(cfg.slowBtnId, () => { slow = slow === 1 ? 10 : 1; ch6setBtn(bSlow, slow === 10); });
  ch6btn(cfg.goBtnId, () => { t = 0; });
  ch6setBtn(bSlow, false);
  function draw() {
    let m = "";
    lanes.forEach((L) => {
      m += `<rect x="270" y="${L.cy - 55}" width="1250" height="110" rx="14" fill="${L.bg}" stroke="rgba(242,237,225,0.12)" stroke-width="2"/>`;
      m += ch6text(20, L.cy + 4, L.n, { size: 42, fill: L.col, weight: 700 });
      m += ch6text(20, L.cy + 38, L.s, { size: 24, font: CH6.fb });
      m += `<circle cx="${SX}" cy="${L.cy}" r="${t >= 0 && t < 0.08 ? 20 : 13}" fill="${L.col}"/>`;
      if (t >= 0 && L.v > 0) {
        const f = Math.min(1, L.v * t / DIST), xf = SX + (FX - SX) * f;
        m += `<rect x="${SX}" y="${L.cy - 50}" width="${(xf - SX).toFixed(1)}" height="100" fill="${L.col}" opacity="0.1"/>`;
        if (f < 1) {
          for (let k = 0; k < 4; k++) {
            const x = xf - k * 18;
            if (x > SX) m += `<path d="M${x.toFixed(1)} ${L.cy - 40} Q${(x + 20).toFixed(1)} ${L.cy} ${x.toFixed(1)} ${L.cy + 40}" fill="none" stroke="${L.col}" stroke-width="4" opacity="${1 - k * 0.24}"/>`;
          }
          m += ch6text(1545, L.cy + 14, "…", { size: 42 });
        } else {
          m += ch6text(1545, L.cy + 14, ch6fr(DIST / L.v, 2) + " s", { size: 42, fill: CH6.y, weight: 700 });
        }
      }
      if (t >= 0 && L.v === 0) m += ch6text(900, L.cy + 12, "✕ pas de propagation", { size: 36, fill: CH6.c, anchor: "middle" });
    });
    m += `<line x1="${FX}" y1="36" x2="${FX}" y2="580" stroke="${CH6.y}" stroke-width="3" stroke-dasharray="12 10"/>`;
    m += ch6text(FX, 28, "arrivée : 1 km", { size: 26, fill: CH6.y, anchor: "middle" });
    ch6set(svg, m);
    let h = `<div style="font-family:Kalam,cursive;font-size:48px;color:#f2ede1;">t = ${ch6fr(Math.max(0, t), 3)} s</div>`;
    if (t >= END - 0.4) h += `<div style="font-size:29px;line-height:1.45;">La célérité dépend du milieu : ici <strong style="color:#e8c468;">acier</strong> &gt; <strong style="color:#6bbfab;">eau</strong> &gt; air. Dans le vide, aucune onde mécanique ne se propage.</div>`;
    else h += `<div style="font-size:29px;color:#c9c2b0;">${t < 0 ? "Même source, même distance : quel milieu arrive en premier ?" : "Les perturbations se propagent…"}</div>`;
    ch6set(readout, h);
  }
  ch6loop(svg, (dt) => { if (t >= 0 && t < END) t = Math.min(END, t + dt / slow); draw(); });
  draw();
}

/* ================================================================== */
/* 5. Double périodicité : photo dans l'espace + enregistrement temps  */
/* ================================================================== */
function initDoublePeriod(cfg) {
  const sS = document.getElementById(cfg.svgSpaceId), sT = document.getElementById(cfg.svgTimeId);
  const tR = document.getElementById(cfg.tRangeId), lR = document.getElementById(cfg.lRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const tL = document.getElementById(cfg.tLabelId), lL = document.getElementById(cfg.lLabelId);
  if (!sS || !sT) return;
  const X0 = 70, XE = 1220, PXM = (XE - X0) / 3, Y0 = 170, AMP = 88, XP = 0.6, WIN = 8, TR = 1210, PXS = (TR - X0) / WIN;
  const T = () => Number(tR.value) / 10, L = () => Number(lR.value) / 10;
  let phase = 0, now = 0, hist = [], frozen = false;
  const yAt = (xm) => AMP * Math.cos(phase - 2 * Math.PI * xm / L());
  for (let s = 0; s <= WIN; s += 1 / 60) { phase = 2 * Math.PI * s / T(); now = s; hist.push({ t: s, y: yAt(XP) }); }
  const fB = ch6btn(cfg.freezeBtnId, () => { frozen = !frozen; label(); });
  function label() { if (fB) fB.textContent = frozen ? "▶ Reprendre" : "📸 Figer l'image"; ch6setBtn(fB, frozen); }
  [tR, lR].forEach((r) => r.addEventListener("input", () => { frozen = false; label(); }));
  function frame(isTime) {
    let m = `<line x1="${X0}" y1="${Y0}" x2="${XE + 20}" y2="${Y0}" stroke="${CH6.dim}" stroke-width="2"/>`;
    m += `<line x1="${X0}" y1="22" x2="${X0}" y2="276" stroke="${CH6.dim}" stroke-width="2"/>`;
    m += ch6text(X0 + 12, 30, "Élongation", { size: 24 });
    return m;
  }
  function drawSpace() {
    let m = frame(false);
    for (let i = 0; i <= 6; i++) {
      const x = X0 + i * 0.5 * PXM;
      m += `<line x1="${x.toFixed(1)}" y1="${Y0 - 7}" x2="${x.toFixed(1)}" y2="${Y0 + 7}" stroke="${CH6.dim}" stroke-width="2"/>`;
      m += ch6text(x.toFixed(1), 294, ch6fr(i * 0.5, 1).replace(",0", "") + (i === 6 ? " m" : ""), { anchor: "middle", size: 24, font: CH6.fb });
    }
    let d = "";
    for (let x = X0; x <= XE; x += 5) d += (d ? " L" : "M") + x + " " + (Y0 - yAt((x - X0) / PXM)).toFixed(1);
    m += `<path d="${d}" fill="none" stroke="${CH6.t}" stroke-width="4"/>`;
    const xp = X0 + XP * PXM, yp = Y0 - yAt(XP);
    m += `<line x1="${xp.toFixed(1)}" y1="60" x2="${xp.toFixed(1)}" y2="276" stroke="rgba(242,237,225,0.35)" stroke-width="2" stroke-dasharray="6 6"/>`;
    if (frozen) {
      const x2 = X0 + (XP + L()) * PXM;
      m += `<line x1="${x2.toFixed(1)}" y1="60" x2="${x2.toFixed(1)}" y2="276" stroke="rgba(242,237,225,0.35)" stroke-width="2" stroke-dasharray="6 6"/>`;
      m += `<circle cx="${x2.toFixed(1)}" cy="${yp.toFixed(1)}" r="22" fill="none" stroke="${CH6.y}" stroke-width="3"/><circle cx="${x2.toFixed(1)}" cy="${yp.toFixed(1)}" r="10" fill="${CH6.y}"/>`;
      m += ch6arrowH(xp, x2, 50, CH6.t, `λ = ${ch6fr(L(), 1)} m`, 30);
    }
    m += `<circle cx="${xp.toFixed(1)}" cy="${yp.toFixed(1)}" r="14" fill="${CH6.y}" stroke="#16261f" stroke-width="3"/>`;
    return m;
  }
  function drawTime() {
    let m = frame(true);
    for (let s = Math.ceil(now - WIN); s <= Math.floor(now); s++) {
      const x = TR - (now - s) * PXS;
      if (x < X0 + 30) continue;
      m += `<line x1="${x.toFixed(1)}" y1="${Y0 - 7}" x2="${x.toFixed(1)}" y2="${Y0 + 7}" stroke="${CH6.dim}" stroke-width="2"/>`;
      m += ch6text(x.toFixed(1), 294, s + " s", { anchor: "middle", size: 24, font: CH6.fb });
    }
    let d = "";
    hist.forEach((h) => {
      const x = TR - (now - h.t) * PXS;
      if (x >= X0) d += (d ? " L" : "M") + x.toFixed(1) + " " + (Y0 - h.y).toFixed(1);
    });
    m += `<path d="${d}" fill="none" stroke="${CH6.c}" stroke-width="4"/>`;
    const yp = Y0 - yAt(XP);
    m += `<line x1="${TR}" y1="60" x2="${TR}" y2="276" stroke="rgba(242,237,225,0.35)" stroke-width="2" stroke-dasharray="6 6"/>`;
    if (frozen && T() < WIN - 0.2) {
      const tt = now - T();
      let best = hist[0];
      hist.forEach((h) => { if (Math.abs(h.t - tt) < Math.abs(best.t - tt)) best = h; });
      const x1 = TR - T() * PXS, y1 = Y0 - best.y;
      m += `<line x1="${x1.toFixed(1)}" y1="60" x2="${x1.toFixed(1)}" y2="276" stroke="rgba(242,237,225,0.35)" stroke-width="2" stroke-dasharray="6 6"/>`;
      m += `<circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="22" fill="none" stroke="${CH6.y}" stroke-width="3"/><circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="10" fill="${CH6.y}"/>`;
      m += ch6arrowH(x1, TR, 50, CH6.c, `T = ${ch6fr(T(), 1)} s`, 30);
    }
    m += `<circle cx="${TR}" cy="${yp.toFixed(1)}" r="14" fill="${CH6.y}" stroke="#16261f" stroke-width="3"/>`;
    return m;
  }
  const render = () => {
    ch6set(sS, drawSpace()); ch6set(sT, drawTime());
    if (tL) tL.textContent = `T = ${ch6fr(T(), 1)} s`;
    if (lL) lL.textContent = `λ = ${ch6fr(L(), 1)} m`;
    let h = `<div style="font-family:Kalam,cursive;font-size:38px;line-height:1.35;"><div><span style="color:#d97a63;">f</span> = 1 / T = ${ch6fr(1 / T(), 2)} Hz</div><div><span style="color:#e8c468;">v</span> = λ / T = <strong style="color:#e8c468;">${ch6fr(L() / T(), 2)} m·s⁻¹</strong></div></div>`;
    h += `<div style="font-size:27px;line-height:1.45;color:${frozen ? "#f2ede1" : "#c9c2b0"};margin-top:12px;">${frozen ? "Le point entouré est dans le <strong style=\"color:#e8c468\">même état vibratoire</strong> que le point jaune : à une distance λ dans l'espace, une durée T plus tôt dans le temps." : "Le point jaune monte et descend sur place. En bas, on enregistre son élongation au cours du temps."}</div>`;
    ch6set(readout, h);
  };
  ch6loop(sS, (dt) => {
    if (!frozen) {
      phase += 2 * Math.PI * dt / T(); now += dt;
      hist.push({ t: now, y: yAt(XP) });
      while (hist.length && hist[0].t < now - WIN - 0.5) hist.shift();
    }
    render();
  });
  render();
}

/* ================================================================== */
/* 6. En une période, l'onde avance d'une longueur d'onde              */
/* ================================================================== */
function initOnePeriod(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const tR = document.getElementById(cfg.tRangeId), lR = document.getElementById(cfg.lRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const tL = document.getElementById(cfg.tLabelId), lL = document.getElementById(cfg.lLabelId);
  if (!svg) return;
  const W = 1780, X0 = 80, PXM = 400, Y0 = 270, AMP = 100, XC = 0.8;
  const T = () => Number(tR.value) / 10, L = () => Number(lR.value) / 10;
  let t = 0, running = false, done = false;
  const px = (m) => X0 + m * PXM;
  const shift = () => L() * t / T();
  const y = (xm) => AMP * Math.cos(2 * Math.PI * (xm - XC - shift()) / L());
  function draw() {
    let m = `<line x1="${X0}" y1="${Y0}" x2="${px(4)}" y2="${Y0}" stroke="rgba(242,237,225,0.4)" stroke-width="2" stroke-dasharray="10 8"/>`;
    let d = "";
    for (let x = X0; x <= px(4); x += 5) d += (d ? " L" : "M") + x + " " + (Y0 - y((x - X0) / PXM)).toFixed(1);
    m += `<path d="${d}" fill="none" stroke="${CH6.t}" stroke-width="5"/>`;
    m += `<circle cx="${px(XC)}" cy="${Y0 - AMP}" r="24" fill="none" stroke="${CH6.y}" stroke-width="3" stroke-dasharray="7 6"/>`;
    const xc = px(XC + shift());
    m += `<line x1="${xc.toFixed(1)}" y1="${Y0 - AMP}" x2="${xc.toFixed(1)}" y2="${Y0 + AMP + 20}" stroke="${CH6.y}" stroke-width="2" stroke-dasharray="6 6"/>`;
    m += `<circle cx="${xc.toFixed(1)}" cy="${Y0 - AMP}" r="16" fill="${CH6.y}" stroke="#16261f" stroke-width="3"/>`;
    if (done) m += ch6arrowH(px(XC), px(XC + L()), Y0 - AMP - 56, CH6.y, `λ = ${ch6fr(L(), 1)} m`, 34);
    m += ch6text(W - 30, 64, done ? `t = T = ${ch6fr(T(), 1)} s` : `t = ${ch6fr(t, 2)} s`, { anchor: "end", size: 50, fill: done ? CH6.c : CH6.chalk, weight: 700 });
    const RY = 440;
    m += `<line x1="${X0}" y1="${RY}" x2="${px(4)}" y2="${RY}" stroke="${CH6.dim}" stroke-width="2"/>`;
    for (let i = 0; i <= 8; i++) {
      const x = px(i * 0.5);
      m += `<line x1="${x}" y1="${RY - 8}" x2="${x}" y2="${RY + 8}" stroke="${CH6.dim}" stroke-width="2"/>`;
      m += ch6text(x, RY + 42, ch6fr(i * 0.5, 1).replace(",0", "") + (i === 8 ? " m" : ""), { anchor: "middle", size: 24, font: CH6.fb });
    }
    ch6set(svg, m);
    if (tL) tL.textContent = `T = ${ch6fr(T(), 1)} s`;
    if (lL) lL.textContent = `λ = ${ch6fr(L(), 1)} m`;
    let h;
    if (done) h = `<div style="font-size:29px;line-height:1.45;">En une période <strong style="color:#d97a63;">T = ${ch6fr(T(), 1)} s</strong>, la crête a parcouru une longueur d'onde <strong style="color:#e8c468;">λ = ${ch6fr(L(), 1)} m</strong>.</div><div style="display:flex;align-items:center;gap:14px;font-family:Kalam,cursive;font-size:42px;color:#e8c468;margin-top:10px;flex-wrap:wrap;"><span><em>v</em> =</span>${ch6frac("λ", "T")}<span>=</span>${ch6frac(ch6fr(L(), 1), ch6fr(T(), 1))}<span>= ${ch6fr(L() / T(), 2)} m·s⁻¹</span></div>`;
    else h = `<div style="font-size:29px;color:#c9c2b0;line-height:1.45;">${running ? "La crête jaune avance…" : "Lance le chrono : on suit la crête jaune pendant exactement une période T."}</div>`;
    ch6set(readout, h);
  }
  const reset = () => { t = 0; running = false; done = false; };
  [tR, lR].forEach((r) => r.addEventListener("input", reset));
  ch6btn(cfg.playBtnId, () => { t = 0; done = false; running = true; });
  ch6btn(cfg.resetBtnId, reset);
  ch6loop(svg, (dt) => {
    if (running) { t += dt; if (t >= T()) { t = T(); running = false; done = true; } }
    draw();
  });
  draw();
}

/* ================================================================== */
/* 7. Onde sinusoïdale : explorer A, T (ou λ), φ + courbe mystère      */
/* ================================================================== */
function initSineExplorer(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), aR = $(cfg.aRangeId), pR = $(cfg.pRangeId), fR = $(cfg.phiRangeId);
  const formula = $(cfg.formulaId), status = $(cfg.statusId);
  const aL = $(cfg.aLabelId), pL = $(cfg.pLabelId), fL = $(cfg.phiLabelId);
  if (!svg) return;
  const X0 = 110, XE = 1060, PX = 95, Y0 = 320, PY = 76;
  const PHI = ["0", "π/4", "π/2", "3π/4", "π", "5π/4", "3π/2", "7π/4"];
  let mode = "t", myst = null;
  const bT = ch6btn(cfg.timeBtnId, () => setMode("t"));
  const bS = ch6btn(cfg.spaceBtnId, () => setMode("x"));
  const bM = ch6btn(cfg.mysteryBtnId, () => {
    if (myst) myst = null;
    else {
      const As = [1, 1.5, 2, 2.5, 3], Ps = [2, 2.5, 3, 4, 5], Ks = [0, 2, 4];
      const pick = (a) => a[Math.floor(Math.random() * a.length)];
      do { myst = { A: pick(As), P: pick(Ps), k: pick(Ks) }; } while (myst.A === A() && myst.P === P() && myst.k === K());
    }
    bM.textContent = myst ? "✕ Quitter le défi" : "🎲 Courbe mystère";
    ch6setBtn(bM, !!myst);
    draw();
  });
  function setMode(k) { mode = k; ch6setBtn(bT, k === "t"); ch6setBtn(bS, k === "x"); draw(); }
  const A = () => Number(aR.value) / 10, P = () => Number(pR.value) / 10, K = () => Number(fR.value);
  const px = (u) => X0 + u * PX;
  function curve(a, p, k, col, extra) {
    let d = "";
    for (let x = X0; x <= XE; x += 3) {
      const u = (x - X0) / PX;
      d += (d ? " L" : "M") + x + " " + (Y0 - PY * a * Math.cos(2 * Math.PI * u / p + k * Math.PI / 4)).toFixed(1);
    }
    return `<path d="${d}" fill="none" stroke="${col}" ${extra}/>`;
  }
  function draw() {
    const col = mode === "t" ? CH6.c : CH6.t, a = A(), p = P(), k = K();
    const Pn = mode === "t" ? "T" : "λ", un = mode === "t" ? "s" : "m", ph = mode === "t" ? "φ" : "φ′", v = mode === "t" ? "t" : "x";
    let m = "";
    for (let i = 0; i <= 10; i++) m += `<line x1="${px(i)}" y1="54" x2="${px(i)}" y2="586" stroke="rgba(242,237,225,0.08)" stroke-width="1.5"/>`;
    for (let j = -3; j <= 3; j++) m += `<line x1="${X0}" y1="${Y0 - j * PY}" x2="${XE}" y2="${Y0 - j * PY}" stroke="rgba(242,237,225,0.08)" stroke-width="1.5"/>`;
    m += ch6arrowTo(X0, Y0, XE + 30, Y0, CH6.dim, 2) + ch6arrowTo(X0, 598, X0, 30, CH6.dim, 2);
    for (let i = 2; i <= 10; i += 2) m += ch6text(px(i), Y0 + 36, i, { anchor: "middle", size: 24, font: CH6.fb });
    m += ch6text(X0 - 14, Y0 + 36, "0", { anchor: "end", size: 24, font: CH6.fb });
    for (let j = -3; j <= 3; j++) if (j) m += ch6text(X0 - 16, Y0 - j * PY + 8, j, { anchor: "end", size: 24, font: CH6.fb });
    m += ch6text(X0 + 16, 44, "<tspan font-style=\"italic\">y</tspan> (cm)", { size: 26, fill: CH6.chalk });
    m += ch6text(XE + 30, Y0 - 16, mode === "t" ? "Temps (s)" : "Distance (m)", { anchor: "end", size: 26, fill: CH6.chalk });
    if (myst) m += curve(myst.A, myst.P, myst.k, CH6.y, `stroke-width="5" stroke-dasharray="14 10" opacity="0.85"`);
    m += curve(a, p, k, col, `stroke-width="4.5"`);
    if (!myst) {
      const u1 = (((-k / 8) % 1) + 1) % 1 * p, u2 = u1 + p, top = Y0 - a * PY;
      const yb = top - 34;
      m += `<line x1="${px(u1)}" y1="${top}" x2="${px(u1)}" y2="${yb}" stroke="${col}" stroke-width="2" stroke-dasharray="5 5"/>`;
      m += `<line x1="${px(u2)}" y1="${top}" x2="${px(u2)}" y2="${yb}" stroke="${col}" stroke-width="2" stroke-dasharray="5 5"/>`;
      m += ch6arrowH(px(u1), px(u2), yb, col, `${Pn} = ${ch6fr(p, 1)} ${un}`, 28);
      const xa = px(u2) + 16;
      m += `<line x1="${xa}" y1="${Y0}" x2="${xa}" y2="${top}" stroke="${CH6.chalk}" stroke-width="3"/>`;
      m += `<polygon points="${xa},${top} ${xa - 7},${top + 14} ${xa + 7},${top + 14}" fill="${CH6.chalk}"/><polygon points="${xa},${Y0} ${xa - 7},${Y0 - 14} ${xa + 7},${Y0 - 14}" fill="${CH6.chalk}"/>`;
      m += ch6text(xa + 12, (Y0 + top) / 2 + 12, "A", { size: 34, fill: CH6.chalk, weight: 700 });
    }
    ch6set(svg, m);
    if (aL) aL.textContent = `A = ${ch6fr(a, 1)} cm`;
    if (pL) pL.textContent = `${Pn} = ${ch6fr(p, 1)} ${un}`;
    if (fL) fL.textContent = `${ph} = ${PHI[k]}`;
    ch6set(formula, `<div style="display:flex;align-items:center;gap:10px;font-family:Kalam,cursive;font-size:44px;color:${mode === "t" ? "#d97a63" : "#6bbfab"};flex-wrap:wrap;"><span><em>y</em>(<em>${v}</em>) = ${ch6fr(a, 1)} cos(</span>${ch6frac("2π", ch6fr(p, 1))}<span>× <em>${v}</em> + ${PHI[k]})</span></div>`);
    let s;
    if (myst) {
      const ok = myst.A === a && myst.P === p && myst.k === k;
      s = ok ? `✔ Superposition parfaite : <strong style="color:#e8c468;">A = ${ch6fr(a, 1)} cm, ${Pn} = ${ch6fr(p, 1)} ${un}, ${ph} = ${PHI[k]}</strong>.` : `Retrouve A, ${Pn} et ${ph} pour superposer ta courbe à la courbe mystère (pointillés jaunes).`;
    } else s = `Modifie A, ${Pn} ou ${ph} : observe ce qui change sur la représentation.`;
    ch6set(status, s);
  }
  [aR, pR, fR].forEach((r) => r.addEventListener("input", draw));
  setMode("t");
}

/* ================================================================== */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ================================================================== */
function initCh6Stages() {
  document.querySelectorAll(".ch6-stage").forEach((outer) => {
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
