/* Animations du chapitre 2 — 2nde — « Corps purs et mélanges »
   Version site (révision) : mêmes fonctions init*, mêmes identifiants HTML que la
   version précédente — seul le contenu des SVG change (animé, plus lisible). */

/* ---------- Outils communs à ce chapitre ---------- */
const CH2 = (() => {
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

/* ---------- 1. Corps pur / mélange homogène / hétérogène ----------
   À gauche, le bécher vu « à l'œil nu » ; à droite, une loupe sur le modèle
   particulaire : les particules s'agitent en permanence. En passant au mélange
   hétérogène, les deux espèces se séparent sous nos yeux. */
function initPureOrMixture(cfg) {
  const { txt, ln, mix, RGB, clamp } = CH2;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = [cfg.btnPureId, cfg.btnHomoId, cfg.btnHeteroId].map(id => document.getElementById(id));
  const MODES = ["pure", "homo", "hetero"];
  svg.setAttribute("viewBox", "0 0 360 220");

  const TEXTS = {
    pure: "Corps pur : une seule espèce chimique (un seul type de point).",
    homo: "Mélange homogène : plusieurs espèces, mais indiscernables à l'œil nu — bien réparties dans tout le volume.",
    hetero: "Mélange hétérogène : plusieurs espèces, mais on distingue au moins deux zones différentes à l'œil nu."
  };
  const EX = { pure: "eau", homo: "eau sucrée", hetero: "eau + huile" };
  const LOOK = { pure: [0, 0, 0], homo: [0.5, 0.5, 0], hetero: [1, 0, 1] }; // teinte haut, teinte bas, séparation

  const rnd = CH2.rng(11);
  const P = [];
  for (let i = 0; i < 36; i++) {
    let x, y;
    do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; } while (x * x + y * y > 0.7);
    P.push({ x, y, vx: 0, vy: 0, k: i % 2, c: 0 });
  }
  const ZX = 268, ZY = 98, ZR = 80, PR = 0.075, MIN = 0.17;
  const bkClip = cfg.svgId + "-bk", zClip = cfg.svgId + "-zoom";
  const st = {};
  const dtOf = CH2.clock();
  let mode = "pure", stir = 0;
  // Remélange rapide : chaque particule reçoit une cible aléatoire dans le disque
  function startStir() {
    const idx = P.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const k = Math.floor(rnd() * (i + 1)); [idx[i], idx[k]] = [idx[k], idx[i]]; }
    const slots = [];
    while (slots.length < P.length) { const x = rnd() * 1.6 - 0.8, y = rnd() * 1.6 - 0.8; if (x * x + y * y < 0.6) slots.push([x, y]); }
    idx.forEach((pi, n) => { P[pi].tx = slots[n][0]; P[pi].ty = slots[n][1]; });
    stir = 1.1;
  }

  function physics(dt) {
    const n = Math.max(1, Math.ceil(dt / 0.02)), h = dt / n;
    for (let s = 0; s < n; s++) {
      for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j], dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
        if (d2 < MIN * MIN && d2 > 1e-8) {
          const d = Math.sqrt(d2), f = (MIN - d) * 22 * h, ux = dx / d, uy = dy / d;
          a.vx -= ux * f; a.vy -= uy * f; b.vx += ux * f; b.vy += uy * f;
        }
      }
      P.forEach(p => {
        p.vx += (rnd() - 0.5) * 5 * h; p.vy += (rnd() - 0.5) * 5 * h;
        const r = Math.hypot(p.x, p.y), R = 0.86;
        if (r > R) { p.vx -= (p.x / r) * (r - R) * 40 * h; p.vy -= (p.y / r) * (r - R) * 40 * h; }
        if (stir > 0) { p.vx += (p.tx - p.x) * 18 * h; p.vy += (p.ty - p.y) * 18 * h; }
        if (mode === "hetero") {
          if (p.k === 0 && p.y < 0.12) p.vy += (0.12 - p.y) * 14 * h;
          if (p.k === 1 && p.y > -0.12) p.vy -= (p.y + 0.12) * 14 * h;
        }
        const damp = Math.exp(-1.6 * h); p.vx *= damp; p.vy *= damp;
        const v = Math.hypot(p.vx, p.vy), VM = stir > 0 ? 1.6 : 0.4;
        if (v > VM) { p.vx *= VM / v; p.vy *= VM / v; }
        p.x += p.vx * h; p.y += p.vy * h;
        p.c += ((mode === "pure" ? 0 : p.k) - p.c) * (1 - Math.exp(-4 * h));
      });
      if (stir > 0) stir -= h;
    }
  }

  function draw(t) {
    const dt = dtOf(t);
    physics(dt);
    const L = LOOK[mode];
    const top = CH2.smooth(st, "top", L[0], dt, 3), bot = CH2.smooth(st, "bot", L[1], dt, 3), sep = CH2.smooth(st, "sep", L[2], dt, 3);

    let s = `<defs><clipPath id="${bkClip}"><path d="M42 46 L42 178 Q42 184 48 184 L142 184 Q148 184 148 178 L148 46 Z"/></clipPath>` +
      `<clipPath id="${zClip}"><circle cx="${ZX}" cy="${ZY}" r="${ZR - 1}"/></clipPath></defs>`;

    // bécher « à l'œil nu »
    s += txt(95, 32, "à l'œil nu", { size: 11, fill: "var(--chalk-dim)" });
    s += `<g clip-path="url(#${bkClip})" opacity="0.4"><rect x="40" y="82" width="112" height="54" fill="${mix(RGB.teal, RGB.coral, top)}"/>` +
      `<rect x="40" y="135" width="112" height="52" fill="${mix(RGB.teal, RGB.coral, bot)}"/></g>`;
    s += ln(42, 82, 148, 82, "var(--chalk-dim)", 1.2, `opacity="0.7"`);
    s += ln(42, 135, 148, 135, "var(--chalk)", 1.3, `stroke-dasharray="5,3" opacity="${sep.toFixed(2)}"`);
    [100, 125, 150].forEach(y => { s += ln(138, y, 148, y, "var(--chalk-dim)", 1, `opacity="0.4"`); });
    s += `<path d="M36 44 Q40 44 40 50 L40 178 Q40 186 48 186 L142 186 Q150 186 150 178 L150 44" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round"/>`;
    s += txt(95, 208, EX[mode], { size: 17, fill: "var(--yellow)", hand: true, weight: 700 });

    // loupe
    s += `<circle cx="95" cy="135" r="14" fill="none" stroke="var(--yellow)" stroke-width="1.5" stroke-dasharray="3,3"/>`;
    s += ln(106, 126, ZX - 30, ZY - ZR + 6, "var(--yellow)", 1, `stroke-dasharray="3,4" opacity="0.5"`);
    s += ln(106, 144, ZX - 30, ZY + ZR - 6, "var(--yellow)", 1, `stroke-dasharray="3,4" opacity="0.5"`);
    s += `<circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="#101c17"/>`;
    s += `<g clip-path="url(#${zClip})">`;
    s += ln(ZX - ZR, ZY, ZX + ZR, ZY, "var(--chalk)", 1.2, `stroke-dasharray="5,4" opacity="${(sep * 0.6).toFixed(2)}"`);
    P.forEach(p => {
      s += `<circle cx="${(ZX + p.x * ZR).toFixed(1)}" cy="${(ZY + p.y * ZR).toFixed(1)}" r="${(PR * ZR).toFixed(1)}" fill="${mix(RGB.teal, RGB.coral, p.c)}"/>`;
    });
    s += `</g><circle cx="${ZX}" cy="${ZY}" r="${ZR}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += txt(ZX, 200, "modèle microscopique", { size: 11, fill: "var(--chalk-dim)" });
    return s;
  }

  const r = CH2.runner(svg, draw);
  function select(i) {
    const was = mode;
    mode = MODES[i]; CH2.active(buttons, i);
    if (was === "hetero" && mode !== "hetero") startStir();
    readout.textContent = TEXTS[mode];
    r.kick();
  }
  buttons.forEach((b, i) => b && b.addEventListener("click", () => select(i)));
  select(0);
  r.play(Infinity);
}

/* ---------- 2. Calculateur de proportion (massique / volumique) ----------
   100 particules représentent le mélange ; N = round(pct) « s'allument » pour
   l'espèce E. En mode volumique, le flacon grossit avec le volume total ; en
   mode massique, un peson s'étire avec la masse totale (l'objet garde sa taille).
   À droite : le pourcentage et une jauge E / reste. */
function initProportionCalculator(cfg) {
  const { txt, ln, fr, clamp } = CH2;
  const svg = document.getElementById(cfg.svgId);
  const eRange = document.getElementById(cfg.eRangeId);
  const totRange = document.getElementById(cfg.totRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnMass = document.getElementById(cfg.btnMassId);
  const btnVol = document.getElementById(cfg.btnVolId);
  const unitLabelE = document.getElementById(cfg.unitLabelEId);
  const unitLabelTot = document.getElementById(cfg.unitLabelTotId);
  const grandeurLabelE = document.getElementById(cfg.grandeurLabelEId);
  const grandeurLabelTot = document.getElementById(cfg.grandeurLabelTotId);
  svg.setAttribute("viewBox", "0 0 360 230");

  let mode = "vol";
  const norm = [];
  for (let row = 0; row < 10; row++) for (let col = 0; col < 10; col++) norm.push({ u: col / 9, v: row / 9 });
  const rnd = CH2.rng(42);
  const order = norm.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const colorRank = new Array(100);
  order.forEach((posIndex, rank) => { colorRank[posIndex] = rank; });
  const lit = new Float32Array(100);

  const totMax = Number(totRange.max) || 10;
  const totMin = Number(totRange.min) || 0;
  const st = {};
  const dtOf = CH2.clock();
  let cur = { e: 0, tot: 1 };

  function draw(t) {
    const dt = dtOf(t);
    const { e, tot } = cur;
    const span = totMax - totMin;
    const sT = span > 0 ? clamp((tot - totMin) / span) : 0;
    const pct = tot > 0 ? (e / tot) * 100 : 0;
    const N = Math.max(0, Math.min(100, Math.round(pct)));
    const sc = CH2.smooth(st, "s", sT, dt, 6);
    const pS = CH2.smooth(st, "pct", pct, dt, 6);
    const kL = dt >= 0.5 ? 1 : 1 - Math.exp(-7 * dt);
    for (let i = 0; i < 100; i++) lit[i] += ((colorRank[i] < N ? 1 : 0) - lit[i]) * kL;
    const colorE = mode === "mass" ? "var(--yellow)" : "var(--teal)";

    let s = "", box, dotR;
    if (mode === "vol") {
      const W = 50 + 100 * sc, H = 60 + 110 * sc, bx = 100 - W / 2, topY = 205 - H, neckW = Math.max(24, W * 0.32), neckH = 18;
      s += ln(14, 205, 186, 205, "var(--chalk-dim)", 1, `opacity="0.5"`);
      s += `<rect x="${bx.toFixed(1)}" y="${topY.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" rx="16" fill="rgba(107,191,171,0.06)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<rect x="${(100 - neckW / 2).toFixed(1)}" y="${(topY - neckH).toFixed(1)}" width="${neckW.toFixed(1)}" height="${neckH + 1}" rx="4" fill="#16261f" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<rect x="${(100 - neckW / 2 - 5).toFixed(1)}" y="${(topY - neckH - 8).toFixed(1)}" width="${(neckW + 10).toFixed(1)}" height="8" rx="3" fill="var(--chalk-dim)"/>`;
      box = { x: bx + W * 0.12, y: topY + H * 0.12, w: W * 0.76, h: H * 0.76 };
      dotR = 2.6 + 2.2 * sc;
    } else {
      const hook = CH2.spring(st, "hook", 36 + 50 * sT, dt), plateY = hook + 110;
      s += `<rect x="50" y="4" width="100" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<path d="${CH2.zigzag(100, 12, hook - 3, 9, 10)}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.2" stroke-linejoin="round"/>`;
      s += `<circle cx="100" cy="${hook.toFixed(1)}" r="3" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += ln(40, hook.toFixed(1), 160, hook.toFixed(1), "var(--chalk-dim)", 2.5, `stroke-linecap="round"`);
      s += ln(42, hook.toFixed(1), 42, plateY.toFixed(1), "var(--chalk-dim)", 1.2) + ln(158, hook.toFixed(1), 158, plateY.toFixed(1), "var(--chalk-dim)", 1.2);
      s += `<ellipse cx="100" cy="${plateY.toFixed(1)}" rx="62" ry="6" fill="rgba(0,0,0,0.25)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<rect x="55" y="${(plateY - 72).toFixed(1)}" width="90" height="66" rx="10" fill="rgba(232,196,104,0.05)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ln(182, 36, 182, 86, "var(--chalk-dim)", 1.5);
      for (let i = 0; i <= 5; i++) s += ln(178, 36 + i * 10, 186, 36 + i * 10, "var(--chalk-dim)", 1);
      s += ln(162, hook.toFixed(1), 180, hook.toFixed(1), "var(--yellow)", 2, `stroke-linecap="round"`);
      box = { x: 64, y: plateY - 65, w: 72, h: 52 };
      dotR = 2.5;
    }

    norm.forEach((p, i) => {
      const x = (box.x + p.u * box.w + 0.5 * Math.sin(t * 2.1 + i * 1.7)).toFixed(1);
      const y = (box.y + p.v * box.h + 0.5 * Math.cos(t * 1.8 + i * 2.3)).toFixed(1);
      const L = lit[i];
      if (L < 0.99) s += `<circle cx="${x}" cy="${y}" r="${dotR.toFixed(1)}" fill="var(--chalk-dim)" opacity="${(0.28 * (1 - L)).toFixed(2)}"/>`;
      if (L > 0.01) s += `<circle cx="${x}" cy="${y}" r="${(dotR * (1 + 1.4 * L * (1 - L))).toFixed(1)}" fill="${colorE}" opacity="${L.toFixed(2)}"/>`;
    });

    // pourcentage + jauge
    const BX = 263, BW = 40, BT = 96, BH = 110, hE = clamp(pS / 100) * BH;
    s += txt(283, 28, mode === "mass" ? "proportion massique" : "proportion volumique", { size: 11, fill: "var(--chalk-dim)" });
    s += txt(283, 74, `${fr(pS, 0)} %`, { size: 38, fill: colorE, hand: true, weight: 700 });
    s += `<rect x="${BX}" y="${BT}" width="${BW}" height="${BH}" rx="4" fill="rgba(201,194,176,0.14)"/>`;
    s += `<rect x="${BX}" y="${(BT + BH - hE).toFixed(1)}" width="${BW}" height="${hE.toFixed(1)}" fill="${colorE}" opacity="0.85"/>`;
    s += `<rect x="${BX}" y="${BT}" width="${BW}" height="${BH}" rx="4" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    if (hE > 14) s += txt(BX + BW + 7, (BT + BH - hE / 2 + 4).toFixed(1), "E", { size: 12, fill: colorE, anchor: "start", weight: 700 });
    if (BH - hE > 14) s += txt(BX + BW + 7, (BT + (BH - hE) / 2 + 4).toFixed(1), "reste", { size: 11, fill: "var(--chalk-dim)", anchor: "start" });
    return s;
  }

  const r = CH2.runner(svg, draw);
  function update() {
    let e = Number(eRange.value), tot = Number(totRange.value);
    eRange.max = String(tot);
    if (e > tot) { e = tot; eRange.value = String(tot); }
    cur = { e, tot };
    const pct = tot > 0 ? (e / tot) * 100 : 0, decimal = tot > 0 ? e / tot : 0;
    const N = Math.max(0, Math.min(100, Math.round(pct)));
    const unit = mode === "mass" ? "g" : "L", grandeur = mode === "mass" ? "masse" : "volume", grandeurCap = mode === "mass" ? "Masse" : "Volume";
    if (unitLabelE) unitLabelE.textContent = unit;
    if (unitLabelTot) unitLabelTot.textContent = unit;
    if (grandeurLabelE) grandeurLabelE.textContent = grandeurCap;
    if (grandeurLabelTot) grandeurLabelTot.textContent = grandeurCap;
    CH2.active([btnMass, btnVol], mode === "mass" ? 0 : 1);
    readout.innerHTML = `Proportion ${grandeur} = <span class="frac"><span class="num">${fr(e, 1)} ${unit}</span><span class="den">${fr(tot, 1)} ${unit}</span></span> = <strong>${fr(decimal, 2)}</strong> = <strong style="color:var(--yellow)">${fr(pct, 0)} %</strong><br><span style="font-size:0.85em; color:var(--chalk-dim);">Soit ${N} particules de E allumées sur 100 particules de mélange.</span>`;
    r.kick();
  }
  eRange.addEventListener("input", update);
  totRange.addEventListener("input", update);
  if (btnMass) btnMass.addEventListener("click", () => { mode = "mass"; update(); });
  if (btnVol) btnVol.addEventListener("click", () => { mode = "vol"; update(); });
  update();
  r.play(Infinity);
}

/* ---------- 3. Température de changement d'état : corps pur vs mélange ----------
   La courbe de refroidissement se trace en direct ; en parallèle, le tube se
   solidifie et le thermomètre descend. Pour le corps pur, le thermomètre reste
   bloqué à 0 °C pendant tout le palier. */
function initStateChangeGraph(cfg) {
  const { txt, ln, fr, clamp, mix, RGB } = CH2;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = [document.getElementById(cfg.btnPureId), document.getElementById(cfg.btnMixId)];
  const MODES = ["pure", "mix"];
  svg.setAttribute("viewBox", "0 0 360 220");

  const X0 = 165, X1 = 345, YB = 190, DUR = 6;
  const yOf = T => YB - (T + 20) * 3.6;
  const xOf = u => X0 + u * (X1 - X0);
  const CURVES = {
    pure: u => {
      if (u < 0.28) { const p = u / 0.28; return 20 * (1 - p) * (1 - 0.35 * p); }
      if (u < 0.66) return 0;
      const p = clamp((u - 0.66) / 0.34); return -16 * (1 - Math.pow(1 - p, 1.7));
    },
    mix: u => {
      if (u < 0.28) { const p = u / 0.28; return -3 + 23 * (1 - p) * (1 - 0.35 * p); }
      if (u < 0.7) { const p = (u - 0.28) / 0.42; return -3 - 7 * Math.pow(p, 1.15); }
      const p = clamp((u - 0.7) / 0.3); return -10 - 8 * (1 - Math.pow(1 - p, 1.7));
    }
  };
  const SOLID = { pure: u => clamp((u - 0.28) / 0.38), mix: u => clamp((u - 0.28) / 0.42) };
  const TEXTS = {
    pure: "Un corps pur change d'état à température constante : la courbe présente un vrai palier (ici, coexistence du liquide et du solide pendant la solidification).",
    mix: "Un mélange n'a pas de température de changement d'état constante : pas de vrai palier, la température continue d'évoluer pendant le changement d'état."
  };
  const tubeClip = cfg.svgId + "-tube";
  let mode = "pure";

  function path(fn, u1) {
    const n = Math.max(2, Math.round(140 * u1));
    let d = "";
    for (let i = 0; i <= n; i++) { const u = u1 * i / n; d += (i ? "L" : "M") + xOf(u).toFixed(1) + " " + yOf(fn(u)).toFixed(1); }
    return d;
  }

  function draw(t) {
    const u = clamp(t / DUR), fn = CURVES[mode], T = fn(u), sol = SOLID[mode](u);
    const col = mode === "pure" ? "var(--teal)" : "var(--coral)";
    const op = (a, b) => clamp((u - a) / (b - a)).toFixed(2);

    // tube à essais
    let s = `<defs><clipPath id="${tubeClip}"><path d="M46 40 L46 166 A16 16 0 0 0 78 166 L78 40 Z"/></clipPath></defs>`;
    s += txt(62, 26, mode === "pure" ? "eau" : "eau salée", { size: 16, fill: "var(--yellow)", hand: true, weight: 700 });
    const liq = mode === "pure" ? RGB.teal : [162, 157, 135];
    const hS = sol * 114;
    s += `<g clip-path="url(#${tubeClip})"><rect x="44" y="70" width="36" height="116" fill="${mix(liq, liq, 0)}" opacity="0.4"/>`;
    s += `<rect x="44" y="${(184 - hS).toFixed(1)}" width="36" height="${(hS + 2).toFixed(1)}" fill="var(--chalk)" opacity="0.6"/>`;
    for (let y = 180; y > 184 - hS + 6; y -= 11) s += ln(50, y, 58, y - 5, "#16261f", 1, `opacity="0.5"`) + ln(64, y - 3, 72, y - 8, "#16261f", 1, `opacity="0.5"`);
    s += `</g>`;
    s += ln(46, 70, 78, 70, "var(--chalk-dim)", 1, `opacity="0.6"`);
    s += `<path d="M44 40 L44 166 A18 18 0 0 0 80 166 L80 40" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += ln(40, 40, 84, 40, "var(--chalk-dim)", 2.5, `stroke-linecap="round"`);

    // thermomètre
    const yTh = 160 - (T + 20) / 45 * 118;
    s += `<rect x="103" y="34" width="12" height="130" rx="6" fill="rgba(0,0,0,0.25)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<rect x="106.5" y="${yTh.toFixed(1)}" width="5" height="${(168 - yTh).toFixed(1)}" fill="var(--coral)"/>`;
    s += `<circle cx="109" cy="170" r="9" fill="var(--coral)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += ln(115, 160 - 20 / 45 * 118, 121, 160 - 20 / 45 * 118, "var(--chalk-dim)", 1);
    s += txt(78, 208, `θ = ${fr(T, 1)} °C`, { size: 16, fill: "var(--yellow)", hand: true, weight: 700 });

    // graphe
    s += ln(X0 - 5, YB, X1 + 5, YB, "var(--chalk-dim)", 1.5) + ln(X0 - 5, YB, X0 - 5, 20, "var(--chalk-dim)", 1.5);
    s += txt(X0 - 5, 13, "θ (°C)", { size: 11, fill: "var(--chalk-dim)" });
    s += txt(X1 + 5, YB + 16, "temps", { size: 11, fill: "var(--chalk-dim)", anchor: "end" });
    [0, 20].forEach(v => { s += ln(X0 - 9, yOf(v), X0 - 1, yOf(v), "var(--chalk-dim)", 1.5) + txt(X0 - 12, yOf(v) + 4, v, { size: 10, fill: "var(--chalk-dim)", anchor: "end" }); });
    s += ln(X0 - 5, yOf(0), X1, yOf(0), "var(--line)", 1, `stroke-dasharray="2,4"`);

    s += txt(205, 62, "liquide", { size: 12, op: op(0.06, 0.14) });
    if (mode === "pure") {
      const o = op(0.34, 0.42);
      s += ln(xOf(0.28), yOf(0) - 8, xOf(0.66), yOf(0) - 8, "var(--yellow)", 1.2, `stroke-dasharray="3,3" opacity="${o}"`);
      s += txt(250, yOf(0) - 14, "liquide + solide", { size: 11, op: o });
      s += txt(243, yOf(0) + 20, "palier : θ constante", { size: 13, fill: "var(--yellow)", hand: true, weight: 700, op: o });
      s += txt(332, 152, "solide", { size: 12, op: op(0.75, 0.83) });
    } else {
      s += txt(253, 104, "pas de palier", { size: 14, fill: "var(--coral)", hand: true, weight: 700, op: op(0.45, 0.55) });
      s += txt(245, 164, "liquide + solide", { size: 10.5, op: op(0.36, 0.44) });
      s += txt(330, 164, "solide", { size: 12, op: op(0.78, 0.86) });
    }
    s += `<path d="${path(fn, u)}" fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    const cx = xOf(u).toFixed(1), cy = yOf(T).toFixed(1);
    s += `<circle cx="${cx}" cy="${cy}" r="9" fill="${col}" opacity="0.25"/><circle cx="${cx}" cy="${cy}" r="4.5" fill="${col}"/>`;
    return s;
  }

  const r = CH2.runner(svg, draw);
  function select(i) {
    const was = mode;
    mode = MODES[i]; CH2.active(buttons, i);
    if (was === "hetero" && mode !== "hetero") startStir();
    readout.textContent = TEXTS[mode];
    r.play(DUR + 0.1);
  }
  buttons.forEach((b, i) => b && b.addEventListener("click", () => select(i)));
  select(0);
}

/* ---------- 4. Masse volumique et densité ----------
   À gauche, le peson : le plateau descend avec m (petit rebond), la taille de
   l'objet suit V. À droite, la conséquence de d : si E n'est pas miscible à
   l'eau, il surnage ou coule ; pour un gaz, le ballon monte ou tombe dans l'air. */
function initDensityCalculator(cfg) {
  const { txt, ln, fr, clamp, mix, RGB } = CH2;
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const vRange = document.getElementById(cfg.vRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLiquid = document.getElementById(cfg.btnLiquidId);
  const btnGas = document.getElementById(cfg.btnGasId);
  const unitMLabel = document.getElementById(cfg.unitMLabelId);
  svg.setAttribute("viewBox", "0 0 360 220");

  const MODE_CONF = {
    liquid: { unit: "kg", maxM: 5, stepM: 0.05, defaultM: 1.00, rhoUnit: "kg/L", ref: 1.00, refLabel: "eau" },
    gas: { unit: "g", maxM: 5, stepM: 0.05, defaultM: 1.30, rhoUnit: "g/L", ref: 1.3, refLabel: "air" }
  };
  let mode = "liquid";
  const st = {};
  const dtOf = CH2.clock();

  function applyModeToSlider() {
    const conf = MODE_CONF[mode];
    mRange.min = "0.05";
    mRange.max = String(conf.maxM);
    mRange.step = String(conf.stepM);
    if (Number(mRange.value) > conf.maxM) mRange.value = conf.defaultM;
    if (unitMLabel) unitMLabel.textContent = conf.unit;
  }

  function draw(t) {
    const dt = dtOf(t);
    const conf = MODE_CONF[mode];
    const m = Number(mRange.value), V = Number(vRange.value);
    const d = V > 0 ? (m / V) / conf.ref : 0;
    const hook = CH2.spring(st, "hook", 30 + Math.min(m, conf.maxM) / conf.maxM * 60, dt);
    const vS = CH2.smooth(st, "v", Math.min(V, 5), dt, 8);
    const dS = CH2.smooth(st, "d", d, dt, 5);
    const plateY = hook + 100;
    const col = mix(RGB.teal, RGB.coral, clamp(dS / 2));

    // peson
    let s = `<rect x="50" y="4" width="100" height="8" rx="3" fill="var(--board-2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<path d="${CH2.zigzag(100, 12, hook - 3, 8, 10)}" fill="none" stroke="var(--chalk-dim)" stroke-width="2.2" stroke-linejoin="round"/>`;
    s += `<circle cx="100" cy="${hook.toFixed(1)}" r="3" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += ln(36, hook.toFixed(1), 164, hook.toFixed(1), "var(--chalk-dim)", 2.5, `stroke-linecap="round"`);
    s += ln(38, hook.toFixed(1), 38, plateY.toFixed(1), "var(--chalk-dim)", 1.2) + ln(162, hook.toFixed(1), 162, plateY.toFixed(1), "var(--chalk-dim)", 1.2);
    s += `<ellipse cx="100" cy="${plateY.toFixed(1)}" rx="66" ry="6" fill="rgba(0,0,0,0.25)" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    s += ln(178, 30, 178, 90, "var(--chalk-dim)", 1.5);
    for (let i = 0; i <= 5; i++) {
      const y = 30 + i * 12;
      s += ln(174, y, 182, y, "var(--chalk-dim)", 1) + txt(186, y + 3, fr(i / 5 * conf.maxM, 0), { size: 9, fill: "var(--chalk-dim)", anchor: "start" });
    }
    s += txt(178, 104, conf.unit, { size: 9, fill: "var(--chalk-dim)" });
    s += ln(164, hook.toFixed(1), 176, hook.toFixed(1), "var(--yellow)", 2, `stroke-linecap="round"`);

    if (mode === "liquid") {
      const w = 20 + vS * 10, h = 24 + vS * 12, x0 = 100 - w / 2, x1 = 100 + w / 2, baseY = plateY - 5, topY = baseY - h;
      s += `<path d="M${x0.toFixed(1)} ${(topY + h * 0.12).toFixed(1)} L${x0.toFixed(1)} ${(baseY - 6).toFixed(1)} Q${x0.toFixed(1)} ${baseY.toFixed(1)} ${(x0 + 6).toFixed(1)} ${baseY.toFixed(1)} L${(x1 - 6).toFixed(1)} ${baseY.toFixed(1)} Q${x1.toFixed(1)} ${baseY.toFixed(1)} ${x1.toFixed(1)} ${(baseY - 6).toFixed(1)} L${x1.toFixed(1)} ${(topY + h * 0.12).toFixed(1)} Z" fill="${col}" opacity="0.55"/>`;
      s += `<path d="M${x0.toFixed(1)} ${topY.toFixed(1)} L${x0.toFixed(1)} ${(baseY - 6).toFixed(1)} Q${x0.toFixed(1)} ${baseY.toFixed(1)} ${(x0 + 6).toFixed(1)} ${baseY.toFixed(1)} L${(x1 - 6).toFixed(1)} ${baseY.toFixed(1)} Q${x1.toFixed(1)} ${baseY.toFixed(1)} ${x1.toFixed(1)} ${(baseY - 6).toFixed(1)} L${x1.toFixed(1)} ${topY.toFixed(1)}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
    } else {
      const rB = 10 + vS * 6, cy = plateY - rB - 9;
      s += `<ellipse cx="100" cy="${cy.toFixed(1)}" rx="${(rB * 0.85).toFixed(1)}" ry="${rB.toFixed(1)}" fill="${col}" opacity="0.55" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
      s += `<path d="M96 ${(cy + rB + 5).toFixed(1)} L104 ${(cy + rB + 5).toFixed(1)} L100 ${(cy + rB - 1).toFixed(1)} Z" fill="var(--chalk-dim)"/>`;
      s += ln(100, (cy + rB + 5).toFixed(1), 100, (plateY - 4).toFixed(1), "var(--chalk-dim)", 1);
    }

    // conséquence de d
    const light = d < 0.98, heavy = d > 1.02;
    if (mode === "liquid") {
      if (light) st.orderT = 0; else if (heavy) st.orderT = 1; else if (st.orderT == null) st.orderT = 0;
      const o = CH2.smooth(st, "order", st.orderT, dt, 4);
      const yE = 76 + o * 55, yW = 76 + (1 - o) * 55;
      s += txt(282, 20, "si E n'est pas miscible à l'eau", { size: 10.5, fill: "var(--chalk-dim)" });
      s += `<g clip-path="url(#${cfg.svgId}-bk)" opacity="0.5"><rect x="226" y="${yW.toFixed(1)}" width="112" height="56" fill="var(--teal)"/><rect x="226" y="${yE.toFixed(1)}" width="112" height="56" fill="${col}"/></g>`;
      s = `<defs><clipPath id="${cfg.svgId}-bk"><path d="M230 34 L230 180 Q230 186 236 186 L328 186 Q334 186 334 180 L334 34 Z"/></clipPath></defs>` + s;
      s += `<path d="M226 32 L226 180 Q226 188 234 188 L330 188 Q338 188 338 180 L338 32" fill="none" stroke="var(--chalk-dim)" stroke-width="2.2"/>`;
      s += ln(230, 76, 334, 76, "var(--chalk-dim)", 1, `opacity="0.6"`);
      s += txt(282, (yE + 33).toFixed(1), "E", { size: 16, hand: true, weight: 700 });
      s += txt(282, (yW + 33).toFixed(1), "eau", { size: 15, hand: true, weight: 700 });
      s += txt(282, 209, light ? "E surnage" : heavy ? "E coule sous l'eau" : "même densité que l'eau", { size: 14, fill: "var(--yellow)", hand: true, weight: 700 });
    } else {
      const by = CH2.smooth(st, "by", light ? 62 : heavy ? 158 : 110, dt, 1.6) + 2 * Math.sin(t * 2.2);
      s += txt(282, 20, "ballon rempli de E, dans l'air", { size: 10.5, fill: "var(--chalk-dim)" });
      s += `<rect x="226" y="30" width="112" height="160" rx="8" fill="rgba(242,237,225,0.03)" stroke="var(--line)" stroke-width="1.5" stroke-dasharray="4,4"/>`;
      s += txt(332, 46, "air", { size: 11, fill: "var(--chalk-dim)", anchor: "end" });
      s += `<path d="M282 ${(by + 20).toFixed(1)} q 5 8 0 14 q -5 6 0 12" fill="none" stroke="var(--chalk-dim)" stroke-width="1"/>`;
      s += `<ellipse cx="282" cy="${by.toFixed(1)}" rx="14" ry="17" fill="${col}" opacity="0.65" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<path d="M278 ${(by + 21).toFixed(1)} L286 ${(by + 21).toFixed(1)} L282 ${(by + 16).toFixed(1)} Z" fill="var(--chalk-dim)"/>`;
      s += txt(282, 209, light ? "le ballon monte" : heavy ? "le ballon tombe" : "le ballon reste sur place", { size: 14, fill: "var(--yellow)", hand: true, weight: 700 });
    }
    return s;
  }

  const r = CH2.runner(svg, draw);
  function update() {
    const conf = MODE_CONF[mode];
    const m = Number(mRange.value), V = Number(vRange.value);
    const rho = V > 0 ? m / V : 0, d = rho / conf.ref;
    CH2.active([btnLiquid, btnGas], mode === "liquid" ? 0 : 1);
    readout.innerHTML = `ρ = m/V = ${fr(m, 2)}/${fr(V, 2)} = <strong style="color:var(--yellow)">${fr(rho, 2)} ${conf.rhoUnit}</strong><br>d = ρ/ρ<sub>${conf.refLabel}</sub> = <strong style="color:var(--teal)">${fr(d, 2)}</strong> (sans unité)`;
    r.kick();
  }
  mRange.addEventListener("input", update);
  vRange.addEventListener("input", update);
  btnLiquid.addEventListener("click", () => { mode = "liquid"; applyModeToSlider(); update(); });
  btnGas.addEventListener("click", () => { mode = "gas"; applyModeToSlider(); update(); });
  applyModeToSlider();
  update();
  r.play(Infinity);
}

/* ---------- 5. Chromatographie interactive (CCM dans sa cuve) ----------
   L'éluant monte par capillarité (de plus en plus lentement) et entraîne les
   taches. Elles restent neutres pendant l'élution ; la révélation sous UV les
   rend visibles et identifiables, puis on compare les hauteurs. */
function initChromatography(cfg) {
  const { txt, ln, clamp, mix, RGB } = CH2;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const eluerBtn = document.getElementById(cfg.eluerBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);
  svg.setAttribute("viewBox", "0 0 360 230");

  const RF_A = 0.30, RF_B = 0.64, H_CM = 5.0; // H = 5,0 cm → h_A = 1,5 cm ; h_B = 3,2 cm
  const PX0 = 118, PX1 = 242, PTOP = 50, PBOT = 214, YDEP = 172, YSOL = 196, YFRONT = 62;
  const LANES = [[145, "A"], [180, "A + B"], [215, "B"]];
  const T_EL = 4.5, T_REV = 1.2;
  const clip = cfg.svgId + "-cuve";
  const T_LEG = 0.7;
  let phase = "idle", stage = "";
  const hA = RF_A * H_CM, hB = RF_B * H_CM;
  const frac = (n, d) => `<span class="frac"><span class="num">${n}</span><span class="den">${d}</span></span>`;
  function arrow(x, y1, y2, c) {
    return ln(x, y1, x, y2, c, 1.4) +
      `<path d="M${x - 3} ${y1 + 5} L${x} ${y1} L${x + 3} ${y1 + 5} M${x - 3} ${y2 - 5} L${x} ${y2} L${x + 3} ${y2 - 5}" fill="none" stroke="${c}" stroke-width="1.4"/>` +
      ln(x - 4, y1, x + 4, y1, c, 1) + ln(x - 4, y2, x + 4, y2, c, 1);
  }

  function setStage(k) {
    if (k === stage) return;
    stage = k;
    if (k === "idle") readout.textContent = "Trois dépôts : A pur, B pur, et un mélange A + B. Clique sur « Éluer ! » pour faire monter le solvant.";
    else if (k === "run") readout.textContent = "Le front du solvant monte et entraîne chaque tache à sa propre vitesse…";
    else if (k === "rev") readout.textContent = "Révélation sous lampe UV : les taches deviennent visibles.";
    else if (k === "cmp") readout.innerHTML = `Élution terminée. Dans le mélange, les deux taches sont à la <strong style="color:var(--yellow)">même hauteur</strong> que les taches pures A et B : le mélange contient donc bien A et B.`;
    else readout.innerHTML = `Rapport frontal R<sub>f</sub> = ${frac("<em>h</em>", "<em>H</em>")} avec <em>H</em> = ${CH2.fr(H_CM, 1)} cm (dépôt → front de l'éluant).<br>A : R<sub>f</sub> = ${frac(CH2.fr(hA, 1) + " cm", CH2.fr(H_CM, 1) + " cm")} = <strong style="color:var(--teal)">${CH2.fr(RF_A, 2)}</strong> &nbsp;·&nbsp; B : R<sub>f</sub> = ${frac(CH2.fr(hB, 1) + " cm", CH2.fr(H_CM, 1) + " cm")} = <strong style="color:var(--coral)">${CH2.fr(RF_B, 2)}</strong><br><span style="font-size:0.85em; color:var(--chalk-dim);">Les taches du mélange ont les mêmes R<sub>f</sub> que A et B purs : le mélange contient A et B.</span>`;
    if (false) readout.innerHTML = `Élution terminée. Dans le mélange, les deux taches sont à la <strong style="color:var(--yellow)">même hauteur</strong> que les taches pures A et B : le mélange contient donc bien A et B.`;
  }

  function draw(t) {
    let u = 0, rev = 0, cmp = 0, leg = 0;
    const T_CMP = T_EL + T_REV * 0.6, T_L0 = T_EL + T_REV + 1.4;
    if (phase === "run") {
      u = clamp(t / T_EL); rev = clamp((t - T_EL) / T_REV); cmp = clamp((t - T_CMP) / 0.6); leg = clamp((t - T_L0) / T_LEG);
      if (t >= T_L0 + T_LEG) { phase = "done"; eluerBtn.disabled = false; }
    }
    if (phase === "done") { u = 1; rev = 1; cmp = 1; leg = 1; }
    setStage(phase === "idle" ? "idle" : u < 1 ? "run" : rev < 1 ? "rev" : leg <= 0 ? "cmp" : "done");

    const f = 1 - Math.pow(1 - u, 1.8);
    const frontY = YSOL - f * (YSOL - YFRONT);
    const dist = Math.max(0, YDEP - frontY);
    const yA = YDEP - RF_A * dist, yB = YDEP - RF_B * dist;
    const moving = u > 0 && u < 1 && dist > 0;
    const glow = Math.sin(Math.PI * rev);

    let s = `<defs><clipPath id="${clip}"><path d="M94 36 L94 212 Q94 220 102 220 L258 220 Q266 220 266 212 L266 36 Z"/></clipPath></defs>`;
    s += `<g clip-path="url(#${clip})"><rect x="90" y="${YSOL}" width="180" height="30" fill="var(--teal)" opacity="0.3"/></g>`;
    s += ln(94, YSOL, 266, YSOL, "var(--teal)", 1.2, `opacity="0.7"`);
    // plaque
    s += `<rect x="${PX0}" y="${PTOP}" width="${PX1 - PX0}" height="${PBOT - PTOP}" fill="rgba(242,237,225,0.13)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    if (u > 0) s += `<rect x="${PX0}" y="${frontY.toFixed(1)}" width="${PX1 - PX0}" height="${(PBOT - frontY).toFixed(1)}" fill="var(--teal)" opacity="0.16"/>`;
    if (glow > 0.01) s += `<rect x="${PX0}" y="${PTOP}" width="${PX1 - PX0}" height="${PBOT - PTOP}" fill="#8f7cff" opacity="${(0.32 * glow).toFixed(2)}"/>`;
    s += ln(PX0 + 6, YDEP, PX1 - 6, YDEP, "var(--chalk-dim)", 1, `stroke-dasharray="2,3"`);
    if (u > 0.01) s += ln(PX0, frontY.toFixed(1), PX1, frontY.toFixed(1), "var(--yellow)", 1.5, `stroke-dasharray="4,3"`);
    LANES.forEach(([x, name]) => { s += txt(x, 188, name, { size: 10, fill: "var(--chalk-dim)" }); });

    // taches
    const cA = mix(RGB.grey, RGB.teal, rev), cB = mix(RGB.grey, RGB.coral, rev);
    const ry = moving ? 7.5 : 5.5;
    const spot = (x, y, c) => `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="6.5" ry="${ry}" fill="${c}" opacity="0.9"/>`;
    s += spot(145, yA, cA) + spot(180, yA, cA) + spot(180, yB, cB) + spot(215, yB, cB);
    if (cmp > 0) {
      s += ln(139, yA.toFixed(1), 186, yA.toFixed(1), "var(--teal)", 1.2, `stroke-dasharray="3,3" opacity="${cmp.toFixed(2)}"`);
      s += ln(174, yB.toFixed(1), 221, yB.toFixed(1), "var(--coral)", 1.2, `stroke-dasharray="3,3" opacity="${cmp.toFixed(2)}"`);
    }

    if (leg > 0) {
      const o = `opacity="${leg.toFixed(2)}"`;
      s += `<g ${o}>` + arrow(126, frontY, YDEP, "var(--yellow)") + txt(128, (YDEP + frontY) / 2 - 8, "H", { size: 13, fill: "var(--yellow)", hand: true, weight: 700, anchor: "start" });
      s += arrow(162, yA, YDEP, "var(--teal)") + txt(164, (YDEP + yA) / 2 + 4, "h", { size: 12, fill: "var(--teal)", hand: true, weight: 700, anchor: "start" }) + txt(171, (YDEP + yA) / 2 + 7, "A", { size: 8, fill: "var(--teal)", anchor: "start" });
      s += arrow(198, yB, YDEP, "var(--coral)") + txt(200, (YDEP + yB) / 2 + 4, "h", { size: 12, fill: "var(--coral)", hand: true, weight: 700, anchor: "start" }) + txt(207, (YDEP + yB) / 2 + 7, "B", { size: 8, fill: "var(--coral)", anchor: "start" });
      s += `</g>`;
      s += txt(276, (yA + 4).toFixed(1), `R<tspan font-size="8" dy="2">f</tspan><tspan dy="-2">(A) = ${CH2.fr(RF_A, 2)}</tspan>`, { size: 10.5, fill: "var(--teal)", anchor: "start", op: leg.toFixed(2) });
      s += txt(276, (yB + 4).toFixed(1), `R<tspan font-size="8" dy="2">f</tspan><tspan dy="-2">(B) = ${CH2.fr(RF_B, 2)}</tspan>`, { size: 10.5, fill: "var(--coral)", anchor: "start", op: leg.toFixed(2) });
      s += ln(PX1, yA.toFixed(1), 272, yA.toFixed(1), "var(--teal)", 0.8, `opacity="${(0.6 * leg).toFixed(2)}"`) + ln(PX1, yB.toFixed(1), 272, yB.toFixed(1), "var(--coral)", 0.8, `opacity="${(0.6 * leg).toFixed(2)}"`);
    }
    // cuve + couvercle
    s += `<path d="M92 36 L92 212 Q92 222 102 222 L258 222 Q268 222 268 212 L268 36" fill="none" stroke="var(--chalk-dim)" stroke-width="2.5"/>`;
    s += `<rect x="86" y="30" width="188" height="5" rx="2" fill="var(--chalk-dim)" opacity="0.55"/>`;

    // légendes
    s += txt(84, 94, "plaque", { size: 10, fill: "var(--chalk-dim)", anchor: "end" }) + ln(87, 91, PX0, 91, "var(--chalk-dim)", 0.8, `opacity="0.5"`);
    s += txt(84, YDEP + 4, "ligne de dépôt", { size: 10, fill: "var(--chalk-dim)", anchor: "end" }) + ln(87, YDEP, PX0, YDEP, "var(--chalk-dim)", 0.8, `opacity="0.5"`);
    s += txt(84, 212, "éluant", { size: 10, fill: "var(--teal)", anchor: "end" }) + ln(87, 209, 104, 209, "var(--teal)", 0.8, `opacity="0.6"`);
    if (u > 0.02) s += txt(276, (frontY + 4).toFixed(1), "front de l'éluant", { size: 10, fill: "var(--yellow)", anchor: "start" }) + ln(PX1, frontY.toFixed(1), 272, frontY.toFixed(1), "var(--yellow)", 0.8, `opacity="0.6"`);
    if (glow > 0.01) s += txt(180, 20, "révélation sous lampe UV", { size: 11, fill: "#b9adff", op: glow.toFixed(2) });
    return s;
  }

  const r = CH2.runner(svg, draw);
  eluerBtn.addEventListener("click", () => {
    if (phase === "run") return;
    phase = "run"; eluerBtn.disabled = true;
    r.play(T_EL + T_REV + 1.4 + T_LEG + 0.2);
  });
  resetBtn.addEventListener("click", () => {
    phase = "idle"; eluerBtn.disabled = false;
    r.play(0);
  });
  r.play(0);
}
