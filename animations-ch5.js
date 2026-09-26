/* Animations du chapitre 5 — 1ère spé PC — Titrages colorimétriques
   Réaction support : I2(aq) + 2 S2O3²⁻(aq) → 2 I⁻(aq) + S4O6²⁻(aq) */

function ch5fr(n, d) { return n.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }); }
function ch5mix(a, b, t) { return a.map((v, i) => v + (b[i] - v) * t); }
function ch5rgba(c) { return `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${c[3].toFixed(3)})`; }
function ch5visible(el) {
  if (!el || el.getBoundingClientRect().width === 0) return false;
  const sec = el.closest("section");
  if (!sec) return true;
  if (!document.querySelector("[data-deck-active]")) return true;
  return sec.hasAttribute("data-deck-active");
}
function ch5blurAfter(btn, fn) {
  if (!btn) return;
  btn.addEventListener("click", (e) => { fn(e); btn.blur(); });
}

var CH5_CLEAR = [214, 230, 234, 0.16];
var CH5_IODE = [201, 118, 30, 0.93];
var CH5_AMIDON = [34, 40, 112, 0.94];
var CH5_TITRANT = "rgba(107,191,171,0.32)";

/* ------------------------------------------------------------------ */
/* Dessin du montage (repère 420 × 540)                               */
/* s = { VB, open, liquid, ang, drops, ripples, hl, uid }             */
/* ------------------------------------------------------------------ */
function ch5benchMarkup(s) {
  const dim = "#c9c2b0", Y = "#e8c468";
  const st = (k) => s.hl === k ? `stroke="${Y}" stroke-width="4"` : `stroke="${dim}" stroke-width="2.5"`;
  const gl = (k) => s.hl === k ? ` filter="url(#glow-${s.uid})"` : "";
  const dimmed = (k) => s.hl && s.hl !== k ? ` opacity="0.45"` : "";
  const glass = "rgba(242,237,225,0.05)";
  let m = `<defs><filter id="glow-${s.uid}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;

  // Potence
  m += `<g data-part="potence" style="cursor:pointer"${gl("potence")}${dimmed("potence")}>
    <rect x="20" y="516" width="100" height="14" rx="4" fill="${glass}" ${st("potence")}/>
    <rect x="58" y="30" width="10" height="486" rx="3" fill="${glass}" ${st("potence")}/>
    <rect x="68" y="146" width="126" height="9" rx="2" fill="${glass}" ${st("potence")}/>
    <rect x="192" y="136" width="36" height="28" rx="5" fill="none" ${st("potence")}/>
  </g>`;

  // Agitateur magnétique
  m += `<g data-part="agitateur" style="cursor:pointer"${gl("agitateur")}${dimmed("agitateur")}>
    <rect x="120" y="500" width="190" height="30" rx="7" fill="rgba(242,237,225,0.07)" ${st("agitateur")}/>
    <circle cx="150" cy="515" r="7" fill="none" ${st("agitateur")}/>
    <circle cx="176" cy="515" r="7" fill="none" ${st("agitateur")}/>
    <circle cx="288" cy="515" r="4" fill="${s.hl === "agitateur" ? Y : "#d97a63"}"/>
  </g>`;

  // Liquide dans l'erlenmeyer
  const yl = 470 - s.VB * 0.45;
  const xl = 194 - (yl - 418) * (62 / 76), xr = 420 - xl;
  m += `<path d="M${xl.toFixed(1)} ${yl.toFixed(1)} L${xr.toFixed(1)} ${yl.toFixed(1)} L288 492 Q292 500 282 500 L138 500 Q128 500 132 492 Z" fill="${s.liquid}" style="transition:fill .25s linear"/>`;
  m += `<line x1="${(xl + 3).toFixed(1)}" y1="${yl.toFixed(1)}" x2="${(xr - 3).toFixed(1)}" y2="${yl.toFixed(1)}" stroke="rgba(242,237,225,0.35)" stroke-width="1.5"/>`;
  (s.ripples || []).forEach((r) => {
    m += `<ellipse cx="210" cy="${yl.toFixed(1)}" rx="${r.r.toFixed(1)}" ry="${(r.r * 0.28).toFixed(1)}" fill="none" stroke="rgba(242,237,225,${Math.max(0, r.a).toFixed(2)})" stroke-width="1.5"/>`;
  });

  // Barreau aimanté (tourne)
  const rx = 4 + 16 * Math.abs(Math.cos(s.ang || 0));
  m += `<g data-part="barreau" style="cursor:pointer"${gl("barreau")}${dimmed("barreau")}>
    <rect x="${(210 - rx).toFixed(1)}" y="489" width="${(2 * rx).toFixed(1)}" height="8" rx="4" fill="${s.hl === "barreau" ? Y : "#f2ede1"}"/>
  </g>`;

  // Erlenmeyer
  m += `<g data-part="erlen" style="cursor:pointer"${gl("erlen")}${dimmed("erlen")}>
    <path d="M194 372 L194 418 L132 492 Q128 500 138 500 L282 500 Q292 500 288 492 L226 418 L226 372" fill="${glass}" ${st("erlen")} stroke-linejoin="round"/>
    <line x1="190" y1="372" x2="198" y2="372" ${st("erlen")}/><line x1="222" y1="372" x2="230" y2="372" ${st("erlen")}/>
  </g>`;

  // Gouttes
  (s.drops || []).forEach((d) => {
    if (d.y > 380) m += `<ellipse cx="210" cy="${d.y.toFixed(1)}" rx="3.2" ry="4.2" fill="#9fd8ca"/>`;
  });

  // Burette
  const yV = 40 + 5.6 * Math.min(50, s.VB);
  m += `<g data-part="burette" style="cursor:pointer"${gl("burette")}${dimmed("burette")}>
    <rect x="202" y="${yV.toFixed(1)}" width="16" height="${(330 - yV).toFixed(1)}" fill="${CH5_TITRANT}"/>
    <line x1="202" y1="${yV.toFixed(1)}" x2="218" y2="${yV.toFixed(1)}" stroke="#9fd8ca" stroke-width="2"/>
    <polygon points="202,330 207,345 213,345 218,330" fill="${s.VB < 50 ? CH5_TITRANT : "none"}"/>`;
  for (let v = 0; v <= 50; v++) {
    const y = 40 + 5.6 * v, long = v % 5 === 0;
    m += `<line x1="${long ? 220 : 220}" y1="${y.toFixed(1)}" x2="${long ? 232 : 226}" y2="${y.toFixed(1)}" stroke="${dim}" stroke-width="${long ? 1.4 : 0.8}"/>`;
    if (v % 10 === 0) m += `<text x="238" y="${(y + 5).toFixed(1)}" font-size="14" fill="${dim}" font-family="Space Grotesk, sans-serif">${v}</text>`;
  }
  m += `<path d="M200 22 L200 330 L207 346 L213 346 L220 330 L220 22" fill="none" ${st("burette")} stroke-linejoin="round"/>
    <rect x="203" y="346" width="14" height="12" rx="2" fill="${glass}" ${st("burette")}/>
    ${s.open
      ? `<rect x="207" y="332" width="6" height="40" rx="3" fill="#d97a63"/>`
      : `<rect x="184" y="349" width="52" height="6" rx="3" fill="#d97a63"/>`}
    <path d="M207 358 L209 382 L211 382 L213 358" fill="${CH5_TITRANT}" ${st("burette")} stroke-linejoin="round"/>
  </g>`;
  return m;
}

/* ================================================================== */
/* 1. Le montage de titrage, pièce par pièce                          */
/* ================================================================== */
function initSetupExplorer(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const list = document.getElementById(cfg.listId);
  const info = document.getElementById(cfg.infoId);
  const INFO = {
    burette: { t: "Burette graduée", c: "#6bbfab", d: "Elle contient la solution de <strong style=\"color:#6bbfab\">réactif titrant B</strong>, de concentration <em>C</em><sub>B</sub> <strong>connue</strong>. On y lit le volume versé <em>V</em><sub>B</sub>." },
    potence: { t: "Potence et pince", c: "#c9c2b0", d: "Elles maintiennent la burette bien verticale au-dessus du récipient." },
    erlen: { t: "Erlenmeyer (ou bécher)", c: "#e8c468", d: "Il contient un volume <em>V</em><sub>A</sub> connu de solution de <strong style=\"color:#e8c468\">réactif titré A</strong>, de concentration <em>C</em><sub>A</sub> <strong>à déterminer</strong>." },
    barreau: { t: "Barreau aimanté", c: "#f2ede1", d: "Il tourne dans la solution et homogénéise le mélange réactionnel après chaque ajout." },
    agitateur: { t: "Agitateur magnétique", c: "#c9c2b0", d: "Son aimant tournant entraîne le barreau aimanté placé dans la solution." }
  };
  let active = null, ang = 0.4, last = 0;
  const liquid = ch5rgba(CH5_IODE);

  function select(k) {
    active = active === k ? null : k;
    list.querySelectorAll("[data-part]").forEach((b) => {
      const on = b.getAttribute("data-part") === active;
      b.style.background = on ? "rgba(232,196,104,0.16)" : "rgba(0,0,0,0.2)";
      b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.16)";
      b.style.color = on ? "#f2ede1" : "#c9c2b0";
    });
    if (active) {
      const it = INFO[active];
      info.style.opacity = "1";
      info.innerHTML = `<div style="font-family:Kalam,cursive;font-size:40px;color:${it.c};margin-bottom:8px;">${it.t}</div><div style="font-size:32px;line-height:1.45;color:#f2ede1;">${it.d}</div>`;
    } else {
      info.style.opacity = "0.7";
      info.innerHTML = `<div style="font-size:30px;color:#c9c2b0;line-height:1.45;">Clique sur un élément du montage ou sur son nom.</div>`;
    }
  }
  list.querySelectorAll("[data-part]").forEach((b) => ch5blurAfter(b, () => select(b.getAttribute("data-part"))));
  svg.addEventListener("click", (e) => {
    const g = e.target.closest("[data-part]");
    if (g) select(g.getAttribute("data-part"));
  });
  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    if (ch5visible(svg)) {
      ang += dt * 7;
      svg.innerHTML = ch5benchMarkup({ VB: 8, open: false, liquid, ang, hl: active, uid: cfg.svgId });
    }
    requestAnimationFrame(frame);
  }
  select(null);
  requestAnimationFrame(frame);
}

/* ================================================================== */
/* 2. Le titrage, goutte à goutte (et variante « flacon mystère »)    */
/* ================================================================== */
function initTitrationBench(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), vbOut = $(cfg.vbId), status = $(cfg.statusId), bars = $(cfg.barsId);
  const openBtn = $(cfg.openBtnId), dropBtn = $(cfg.dropBtnId), mlBtn = $(cfg.mlBtnId);
  const resetBtn = $(cfg.resetBtnId), starchBtn = $(cfg.starchBtnId);
  const newBtn = $(cfg.newBtnId), revealBtn = $(cfg.revealBtnId), calc = $(cfg.calcId);

  const CB = 0.050, VA = 20, RATE = 1.6; // mol/L, mL, mL/s
  let CA = cfg.mystery ? 0 : 0.025, n0 = 0, VE = 0;
  const s = { VB: 0, open: false, starch: false, drops: [], ripples: [], ang: 0, uid: cfg.svgId };
  let last = 0, spawnT = 0, lastStatus = "", lastBars = "", lastVB = "";

  function setCA(c) { CA = c; n0 = CA * VA; VE = Math.round((2 * n0 / CB) * 1000) / 1000; }
  function newFlask() { setCA((16 + Math.floor(Math.random() * 19)) / 1000); reset(); if (calc) { calc.innerHTML = ""; calc.style.opacity = "0"; } }
  function reset() { s.VB = 0; s.open = false; s.drops = []; s.ripples = []; syncButtons(); }
  function addVB(v) { s.VB = Math.min(50, Math.round((s.VB + v) * 1000) / 1000); }
  function syncButtons() {
    if (openBtn) {
      openBtn.textContent = s.open ? "🔒 Fermer le robinet" : "🔓 Ouvrir le robinet";
      openBtn.style.background = s.open ? "#d97a63" : "#e8c468";
    }
    if (starchBtn) {
      starchBtn.textContent = s.starch ? "Empois d'amidon ajouté ✓" : "+ Empois d'amidon";
      starchBtn.style.borderColor = s.starch ? "#8e98e0" : "rgba(242,237,225,0.35)";
      starchBtn.style.color = s.starch ? "#c3c9f5" : "#f2ede1";
    }
  }

  function state() {
    const nB = CB * s.VB;
    const x = Math.min(nB / 2, n0);
    return { nB, x, nI2: Math.max(0, n0 - x), nS: Math.max(0, nB - 2 * x), nI: 2 * x, nS4: x };
  }

  function liquidColor(q) {
    const f = n0 > 0 ? q.nI2 / n0 : 0;
    if (s.starch) return ch5rgba(f > 1e-9 ? CH5_AMIDON : CH5_CLEAR);
    return ch5rgba(ch5mix(CH5_CLEAR, CH5_IODE, Math.pow(f, 0.45)));
  }

  const pill = (txt, c) => `<span style="display:inline-block;font-family:Kalam,cursive;font-size:30px;padding:4px 20px;border-radius:999px;border:2px solid ${c};color:${c};background:rgba(0,0,0,0.2);">${txt}</span>`;

  function renderPanels(q) {
    const vb = ch5fr(Math.round(s.VB * 20) / 20, 2);
    if (vbOut && vb !== lastVB) { vbOut.innerHTML = `<em>V</em><sub>B</sub> = ${vb} mL`; lastVB = vb; }
    if (status && !cfg.mystery) {
      let html;
      if (s.VB < VE - 0.024) html = `${pill("Avant l'équivalence", "#6bbfab")}<div style="margin-top:12px;">Réactif limitant : <strong style="color:#6bbfab">S₂O₃²⁻, le titrant</strong>. Chaque goutte versée est aussitôt consommée.</div>`;
      else if (s.VB <= VE + 0.024) html = `${pill("Équivalence", "#e8c468")}<div style="margin-top:12px;">Mélange <strong style="color:#e8c468">stœchiométrique</strong> : les deux réactifs sont totalement consommés. <em>V</em><sub>E</sub> = ${ch5fr(VE, 2)} mL</div>`;
      else html = `${pill("Après l'équivalence", "#d97a63")}<div style="margin-top:12px;">Réactif limitant : <strong style="color:#e8c468">I₂, le titré</strong>. Le titrant versé s'accumule en excès.</div>`;
      if (html !== lastStatus) { status.innerHTML = html; lastStatus = html; }
    }
    if (bars && !cfg.mystery) {
      const MAX = 1.5;
      const rows = [["I₂", q.nI2, "#e8c468"], ["S₂O₃²⁻", q.nS, "#6bbfab"], ["I⁻", q.nI, "#d97a63"], ["S₄O₆²⁻", q.nS4, "#f2ede1"]];
      const html = rows.map(([l, n, c]) => `<div style="display:grid;grid-template-columns:150px minmax(0,1fr) 190px;align-items:center;gap:18px;">
        <span style="font-family:Kalam,cursive;font-size:32px;color:${c};">${l}</span>
        <span style="display:block;height:24px;background:rgba(242,237,225,0.07);border-radius:6px;overflow:hidden;"><span style="display:block;height:100%;width:${Math.min(100, n / MAX * 100).toFixed(1)}%;background:${c};opacity:.85;border-radius:6px;"></span></span>
        <span style="font-size:28px;color:#f2ede1;text-align:right;">${ch5fr(n, 3)} mmol</span></div>`).join("");
      if (html !== lastBars) { bars.innerHTML = html; lastBars = html; }
    }
  }

  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    if (ch5visible(svg)) {
      s.ang += dt * 9;
      if (s.open) {
        addVB(RATE * dt);
        spawnT += dt;
        if (spawnT > 0.08) { spawnT = 0; s.drops.push({ y: 382, v: 80, vol: 0 }); }
        if (s.VB >= 50) { s.open = false; syncButtons(); }
      }
      const yl = 470 - s.VB * 0.45;
      s.drops.forEach((d) => {
        d.v += 1100 * dt; d.y += d.v * dt;
        if (d.y >= yl) { d.dead = true; if (s.ripples.length < 6) s.ripples.push({ r: 4, a: 0.9 }); if (d.vol) addVB(d.vol); }
      });
      s.drops = s.drops.filter((d) => !d.dead);
      s.ripples.forEach((r) => { r.r += 70 * dt; r.a -= 1.6 * dt; });
      s.ripples = s.ripples.filter((r) => r.a > 0);
      const q = state();
      s.liquid = liquidColor(q);
      svg.innerHTML = ch5benchMarkup(s);
      renderPanels(q);
    }
    requestAnimationFrame(frame);
  }

  ch5blurAfter(openBtn, () => { if (s.VB < 50) s.open = !s.open; syncButtons(); });
  ch5blurAfter(dropBtn, () => { if (s.VB < 50) s.drops.push({ y: 382, v: 60, vol: 0.05 }); });
  ch5blurAfter(mlBtn, () => { for (let i = 0; i < 5; i++) s.drops.push({ y: 382 - i * 22, v: 60, vol: 0.2 }); });
  ch5blurAfter(resetBtn, reset);
  ch5blurAfter(starchBtn, () => { s.starch = !s.starch; syncButtons(); });
  ch5blurAfter(newBtn, newFlask);
  ch5blurAfter(revealBtn, () => {
    if (!calc) return;
    const frac = (n, d) => `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 6px;"><span style="padding:0 8px 4px;">${n}</span><span style="border-top:2px solid currentColor;padding:4px 8px 0;">${d}</span></span>`;
    const cA = CB * VE / (2 * VA) * 100;
    calc.innerHTML = `<div style="font-size:28px;color:#c9c2b0;margin-bottom:10px;">Le virage se produit pour <em>V</em><sub>E</sub> = <strong style="color:#f2ede1">${ch5fr(VE, 2)} mL</strong></div>
      <div style="font-size:32px;color:#f2ede1;display:flex;align-items:center;flex-wrap:wrap;gap:4px;"><em>C</em><sub>A</sub> = ${frac("1", "2")} × ${frac("<em>C</em><sub>B</sub> × <em>V</em><sub>E</sub>", "<em>V</em><sub>A</sub>")} = ${frac("1", "2")} × ${frac("5,0 × 10⁻² × " + ch5fr(VE, 2), "20,0")} = <strong style="color:#e8c468;font-family:Kalam,cursive;font-size:40px;">${ch5fr(cA, 2)} × 10⁻² mol·L⁻¹</strong></div>`;
    calc.style.opacity = "1";
  });

  if (cfg.mystery) newFlask(); else { setCA(0.025); reset(); }
  requestAnimationFrame(frame);
}

/* ================================================================== */
/* 3. Quantités de matière en fonction du volume versé                */
/* ================================================================== */
function initTitrationGraph(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const range = document.getElementById(cfg.rangeId);
  const readout = document.getElementById(cfg.readoutId);
  const N0 = 0.5, CB = 0.05, VE = 20, VMAX = 40, NMAX = 1.0;
  const X0 = 80, X1 = 580, Y0 = 330, Y1 = 30;
  const px = (v) => X0 + (v / VMAX) * (X1 - X0);
  const py = (n) => Y0 - (n / NMAX) * (Y0 - Y1);
  const q = (v) => { const x = Math.min(CB * v / 2, N0); return { I2: N0 - x, S: CB * v - 2 * x, I: 2 * x, S4: x }; };
  const SER = [["I2", "#e8c468", "I₂", ""], ["S", "#6bbfab", "S₂O₃²⁻", ""], ["I", "#d97a63", "I⁻", ""], ["S4", "#f2ede1", "S₄O₆²⁻", "6,5"]];

  function path(key) {
    let d = "";
    for (let v = 0; v <= VMAX; v += 0.5) d += (v ? " L" : "M") + px(v).toFixed(1) + " " + py(q(v)[key]).toFixed(1);
    return d;
  }
  const base = (() => {
    let m = `<rect x="${X0}" y="${Y1}" width="${px(VE) - X0}" height="${Y0 - Y1}" fill="rgba(107,191,171,0.07)"/>`;
    m += `<rect x="${px(VE)}" y="${Y1}" width="${X1 - px(VE)}" height="${Y0 - Y1}" fill="rgba(232,196,104,0.06)"/>`;
    m += `<text x="${(X0 + px(VE)) / 2}" y="${Y1 + 26}" text-anchor="middle" font-family="Kalam, cursive" font-size="19" fill="#6bbfab">S₂O₃²⁻ limitant</text>`;
    m += `<text x="${(px(VE) + X1) / 2}" y="${Y1 + 26}" text-anchor="middle" font-family="Kalam, cursive" font-size="19" fill="#e8c468">I₂ limitant</text>`;
    m += `<line x1="${X0}" y1="${Y0}" x2="${X1 + 8}" y2="${Y0}" stroke="#c9c2b0" stroke-width="1.8"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y1 - 10}" stroke="#c9c2b0" stroke-width="1.8"/>`;
    for (let v = 0; v <= VMAX; v += 10) m += `<line x1="${px(v)}" y1="${Y0}" x2="${px(v)}" y2="${Y0 + 6}" stroke="#c9c2b0"/><text x="${px(v)}" y="${Y0 + 26}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="16" fill="#c9c2b0">${v}</text>`;
    for (let n = 0; n <= NMAX + 0.001; n += 0.25) m += `<line x1="${X0 - 6}" y1="${py(n)}" x2="${X0}" y2="${py(n)}" stroke="#c9c2b0"/><text x="${X0 - 12}" y="${py(n) + 5}" text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="15" fill="#c9c2b0">${ch5fr(n, 2)}</text>`;
    m += `<text x="${X1 + 8}" y="${Y0 + 48}" text-anchor="end" font-family="Space Grotesk, sans-serif" font-size="16" fill="#c9c2b0">V_B (mL)</text>`.replace("V_B", "V<tspan baseline-shift=\"sub\" font-size=\"12\">B</tspan>");
    m += `<text x="${X0 - 10}" y="${Y1 - 16}" font-family="Space Grotesk, sans-serif" font-size="16" fill="#c9c2b0">n (mmol)</text>`;
    m += `<line x1="${px(VE)}" y1="${Y0}" x2="${px(VE)}" y2="${Y1}" stroke="#e8c468" stroke-width="1.5" stroke-dasharray="6 5"/>`;
    m += `<text x="${px(VE) + 6}" y="${Y0 - 8}" font-family="Kalam, cursive" font-size="20" fill="#e8c468">V<tspan baseline-shift="sub" font-size="14">E</tspan></text>`;
    SER.forEach(([k, c, , dash]) => { m += `<path d="${path(k)}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" ${dash ? `stroke-dasharray="${dash}"` : ""} opacity="0.9"/>`; });
    return m;
  })();

  function draw() {
    const v = Number(range.value), Q = q(v);
    let m = base + `<line x1="${px(v)}" y1="${Y0}" x2="${px(v)}" y2="${Y1}" stroke="#f2ede1" stroke-width="1.5" opacity="0.7"/>`;
    SER.forEach(([k, c]) => { m += `<circle cx="${px(v)}" cy="${py(Q[k])}" r="6.5" fill="${c}" stroke="#16261f" stroke-width="2"/>`; });
    svg.innerHTML = m;
    const lim = v < VE ? `<strong style="color:#6bbfab">S₂O₃²⁻ (titrant)</strong>` : v === VE ? `<strong style="color:#e8c468">les deux : mélange stœchiométrique</strong>` : `<strong style="color:#e8c468">I₂ (titré)</strong>`;
    readout.innerHTML = `<div style="font-family:Kalam,cursive;font-size:40px;color:#f2ede1;margin-bottom:10px;"><em>V</em><sub>B</sub> = ${ch5fr(v, 1)} mL</div>
      <div style="display:grid;grid-template-columns:auto auto;gap:6px 26px;font-size:29px;margin-bottom:14px;">
      ${SER.map(([k, c, l]) => `<span style="color:${c};font-family:Kalam,cursive;font-size:31px;">n(${l})</span><span style="color:#f2ede1;">${ch5fr(Q[k], 2)} mmol</span>`).join("")}
      </div><div style="font-size:29px;color:#c9c2b0;line-height:1.4;">Réactif limitant : ${lim}</div>`;
  }
  range.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* 4. Vue microscopique : 2 S2O3²⁻ pour 1 I2                          */
/* ================================================================== */
function initMicroTitration(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dropBtn = document.getElementById(cfg.dropBtnId);
  const resetBtn = document.getElementById(cfg.resetBtnId);
  const counts = document.getElementById(cfg.countsId);
  const status = document.getElementById(cfg.statusId);
  const CX = 260, CY = 200, R = 180, N0 = 6, MAXDROPS = 9;
  let P = [], flashes = [], drops = 0, last = 0, lastC = "", lastS = "";
  const rnd = (a, b) => a + Math.random() * (b - a);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function reset() {
    P = []; flashes = []; drops = 0;
    for (let i = 0; i < N0; i++) {
      const a = (i / N0) * Math.PI * 2 + rnd(-0.3, 0.3), r = rnd(50, R - 45);
      P.push({ t: "I2", x: CX + r * Math.cos(a), y: CY + r * Math.sin(a), vx: rnd(-20, 20), vy: rnd(-20, 20), ang: rnd(0, 6.3), claims: 0 });
    }
    if (dropBtn) dropBtn.disabled = false;
  }
  function addDrop() {
    if (drops >= MAXDROPS) return;
    drops++;
    [-16, 16].forEach((dx) => P.push({ t: "S", x: CX + dx, y: CY - R + 26, vx: rnd(-8, 8), vy: 90, target: null }));
    if (drops >= MAXDROPS && dropBtn) dropBtn.disabled = true;
  }

  function step(dt) {
    P.forEach((p) => {
      p.vx += rnd(-1, 1) * 140 * dt; p.vy += rnd(-1, 1) * 140 * dt;
      if (p.t === "S" && p.target) {
        const dx = p.target.x - p.x, dy = p.target.y - p.y, d = Math.hypot(dx, dy) || 1;
        p.vx += (dx / d) * 320 * dt; p.vy += (dy / d) * 320 * dt;
      }
      const sp = Math.hypot(p.vx, p.vy), max = p.target ? 130 : (p.t === "I2" ? 28 : 50);
      if (sp > max) { p.vx *= max / sp; p.vy *= max / sp; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      const dx = p.x - CX, dy = p.y - CY, d = Math.hypot(dx, dy), lim = R - 20;
      if (d > lim) {
        p.x = CX + (dx / d) * lim; p.y = CY + (dy / d) * lim;
        const dot = (p.vx * dx + p.vy * dy) / d;
        if (dot > 0) { p.vx -= 2 * dot * dx / d; p.vy -= 2 * dot * dy / d; }
      }
      if (p.ang !== undefined) p.ang += dt * 0.9;
    });
    P.filter((p) => p.t === "S" && !p.target).forEach((sp) => {
      let best = null, bd = 1e9;
      P.forEach((q) => { if (q.t === "I2" && q.claims < 2) { const d = dist(sp, q); if (d < bd) { bd = d; best = q; } } });
      if (best) { sp.target = best; best.claims++; }
    });
    P.filter((q) => q.t === "I2" && q.claims === 2).forEach((q) => {
      const cl = P.filter((sp) => sp.target === q);
      if (cl.length === 2 && cl.every((sp) => dist(sp, q) < 26)) {
        q.dead = true; cl.forEach((sp) => (sp.dead = true));
        const a = rnd(0, 6.3);
        P.push({ t: "I", x: q.x + 12 * Math.cos(a), y: q.y + 12 * Math.sin(a), vx: 60 * Math.cos(a), vy: 60 * Math.sin(a) });
        P.push({ t: "I", x: q.x - 12 * Math.cos(a), y: q.y - 12 * Math.sin(a), vx: -60 * Math.cos(a), vy: -60 * Math.sin(a) });
        P.push({ t: "S4", x: q.x, y: q.y, vx: 60 * Math.cos(a + 1.57), vy: 60 * Math.sin(a + 1.57), ang: a });
        flashes.push({ x: q.x, y: q.y, r: 12, a: 1 });
      }
    });
    P = P.filter((p) => !p.dead);
    flashes.forEach((f) => { f.r += 90 * dt; f.a -= 1.8 * dt; });
    flashes = flashes.filter((f) => f.a > 0);
  }

  function render() {
    const nI2 = P.filter((p) => p.t === "I2").length;
    const tint = ch5rgba(ch5mix(CH5_CLEAR, CH5_IODE, Math.pow(nI2 / N0, 0.6) * 0.55));
    let m = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${tint}" style="transition:fill .4s"/>`;
    flashes.forEach((f) => { m += `<circle cx="${f.x.toFixed(1)}" cy="${f.y.toFixed(1)}" r="${f.r.toFixed(1)}" fill="none" stroke="rgba(232,196,104,${f.a.toFixed(2)})" stroke-width="3"/>`; });
    P.forEach((p) => {
      const x = p.x.toFixed(1), y = p.y.toFixed(1);
      if (p.t === "I2" || p.t === "S4") {
        const c = p.t === "I2" ? "#e8c468" : "#f2ede1", r = p.t === "I2" ? 11 : 9, o = p.t === "I2" ? 9 : 8;
        const ox = o * Math.cos(p.ang), oy = o * Math.sin(p.ang);
        m += `<circle cx="${(p.x - ox).toFixed(1)}" cy="${(p.y - oy).toFixed(1)}" r="${r}" fill="${c}" stroke="#16261f" stroke-width="1.5"/><circle cx="${(p.x + ox).toFixed(1)}" cy="${(p.y + oy).toFixed(1)}" r="${r}" fill="${c}" stroke="#16261f" stroke-width="1.5"/>`;
      } else if (p.t === "S") {
        m += `<circle cx="${x}" cy="${y}" r="10" fill="#6bbfab" stroke="#16261f" stroke-width="1.5"/>`;
      } else {
        m += `<circle cx="${x}" cy="${y}" r="8" fill="#d97a63" stroke="#16261f" stroke-width="1.5"/>`;
      }
    });
    m += `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#c9c2b0" stroke-width="3"/>`;
    m += `<circle cx="${CX}" cy="${CY}" r="${R + 10}" fill="none" stroke="rgba(242,237,225,0.18)" stroke-width="2" stroke-dasharray="4 8"/>`;
    svg.innerHTML = m;

    const c = { I2: nI2, S: 0, I: 0, S4: 0 };
    P.forEach((p) => { if (p.t !== "I2") c[p.t]++; });
    const chip = (l, n, col) => `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;border:1px solid rgba(242,237,225,0.16);background:rgba(0,0,0,0.2);border-radius:12px;padding:10px 20px;"><span style="font-family:Kalam,cursive;font-size:32px;color:${col};">${l}</span><span style="font-family:Kalam,cursive;font-size:40px;color:#f2ede1;">${n}</span></div>`;
    const ch = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">${chip("I₂", c.I2, "#e8c468")}${chip("S₂O₃²⁻", c.S, "#6bbfab")}${chip("I⁻", c.I, "#d97a63")}${chip("S₄O₆²⁻", c.S4, "#f2ede1")}</div>
      <div style="font-size:28px;color:#c9c2b0;margin-top:14px;">Gouttes versées : <strong style="color:#f2ede1">${drops}</strong> → ${2 * drops} ion${drops > 0 ? "s" : ""} S₂O₃²⁻ ajouté${drops > 0 ? "s" : ""}</div>`;
    if (ch !== lastC) { counts.innerHTML = ch; lastC = ch; }
    const tot = 2 * drops;
    let st;
    if (tot < 2 * N0) st = `<strong style="color:#6bbfab">Avant l'équivalence.</strong> Il reste du diiode : chaque ion thiosulfate versé trouve un partenaire et disparaît.`;
    else if (tot === 2 * N0) st = `<strong style="color:#e8c468">Équivalence.</strong> ${tot} ions S₂O₃²⁻ ont consommé ${N0} molécules I₂ : exactement 2 pour 1, les proportions de l'équation.`;
    else st = `<strong style="color:#d97a63">Après l'équivalence.</strong> Plus de diiode : les ions S₂O₃²⁻ versés restent en excès.`;
    if (st !== lastS) { status.innerHTML = st; lastS = st; }
  }

  function frame(ts) {
    const dt = Math.min(0.05, (ts - last) / 1000 || 0); last = ts;
    if (ch5visible(svg)) { step(dt); render(); }
    requestAnimationFrame(frame);
  }
  ch5blurAfter(dropBtn, addDrop);
  ch5blurAfter(resetBtn, reset);
  reset();
  requestAnimationFrame(frame);
}
