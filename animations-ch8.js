/* Animations du chapitre 8 — 1ère spé PC — Couleurs
   Partie 1 : animations d'origine du site. Partie 2 : animations des diapos. */

/* ---------- 1. Simulateur de synthèse additive (RVB) ---------- */
function initAdditiveSynthesis(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const rRange = document.getElementById(cfg.rRangeId);
  const gRange = document.getElementById(cfg.gRangeId);
  const bRange = document.getElementById(cfg.bRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const R = Math.round(Number(rRange.value) * 2.55);
    const G = Math.round(Number(gRange.value) * 2.55);
    const B = Math.round(Number(bRange.value) * 2.55);

    const cx1 = 110, cy1 = 65, cx2 = 80, cy2 = 115, cx3 = 140, cy3 = 115, r = 55;
    let s = `<g style="isolation:isolate">`;
    s += `<rect x="0" y="0" width="220" height="180" fill="#0a0a0a"/>`;
    s += `<circle cx="${cx1}" cy="${cy1}" r="${r}" fill="rgb(${R},0,0)" style="mix-blend-mode:screen"/>`;
    s += `<circle cx="${cx2}" cy="${cy2}" r="${r}" fill="rgb(0,${G},0)" style="mix-blend-mode:screen"/>`;
    s += `<circle cx="${cx3}" cy="${cy3}" r="${r}" fill="rgb(0,0,${B})" style="mix-blend-mode:screen"/>`;
    s += `</g>`;
    s += `<text x="${cx1}" y="${cy1 - r - 8}" font-size="9" fill="#ff6b6b" text-anchor="middle">Rouge</text>`;
    s += `<text x="${cx2 - 20}" y="${cy2 + r + 4}" font-size="9" fill="#6bff8f" text-anchor="middle">Vert</text>`;
    s += `<text x="${cx3 + 20}" y="${cy3 + r + 4}" font-size="9" fill="#6b9fff" text-anchor="middle">Bleu</text>`;

    svg.innerHTML = s;

    const hex = "#" + [R, G, B].map(v => v.toString(16).padStart(2, "0")).join("");
    readout.innerHTML = `R=${R}, G=${G}, B=${B} → couleur perçue au centre : <strong style="color:${hex};">${hex}</strong>. Avec les trois intensités au maximum, la superposition donne du <strong style="color:var(--yellow);">blanc</strong> (trichromie).`;
  }

  rRange.addEventListener("input", draw);
  gRange.addEventListener("input", draw);
  bRange.addEventListener("input", draw);
  draw();
}

/* ---------- 1b. Simulateur de synthèse soustractive (CMJ) ---------- */
function initSubtractiveSynthesis(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const cRange = document.getElementById(cfg.cRangeId);
  const mRange = document.getElementById(cfg.mRangeId);
  const yRange = document.getElementById(cfg.yRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const C = Number(cRange.value) / 100; // intensité du filtre cyan, 0 à 1
    const M = Number(mRange.value) / 100;
    const Y = Number(yRange.value) / 100;

    const cx1 = 110, cy1 = 65, cx2 = 80, cy2 = 115, cx3 = 140, cy3 = 115, r = 55;
    let s = `<g style="isolation:isolate">`;
    s += `<rect x="0" y="0" width="220" height="180" fill="#f2f2f2"/>`;
    s += `<circle cx="${cx1}" cy="${cy1}" r="${r}" fill="rgba(0,220,220,${C})" style="mix-blend-mode:multiply"/>`;
    s += `<circle cx="${cx2}" cy="${cy2}" r="${r}" fill="rgba(230,0,200,${M})" style="mix-blend-mode:multiply"/>`;
    s += `<circle cx="${cx3}" cy="${cy3}" r="${r}" fill="rgba(240,220,0,${Y})" style="mix-blend-mode:multiply"/>`;
    s += `</g>`;
    s += `<text x="${cx1}" y="${cy1 - r - 8}" font-size="9" fill="#00b8b8" text-anchor="middle">Cyan</text>`;
    s += `<text x="${cx2 - 24}" y="${cy2 + r + 4}" font-size="9" fill="#c800a8" text-anchor="middle">Magenta</text>`;
    s += `<text x="${cx3 + 20}" y="${cy3 + r + 4}" font-size="9" fill="#a89600" text-anchor="middle">Jaune</text>`;

    svg.innerHTML = s;

    // le filtre cyan absorbe le rouge, le magenta absorbe le vert, le jaune absorbe le bleu
    const R = Math.round(255 * (1 - C));
    const G = Math.round(255 * (1 - M));
    const B = Math.round(255 * (1 - Y));
    const hex = "#" + [R, G, B].map(v => v.toString(16).padStart(2, "0")).join("");
    readout.innerHTML = `Filtre cyan à ${(C * 100).toFixed(0)}%, magenta à ${(M * 100).toFixed(0)}%, jaune à ${(Y * 100).toFixed(0)}% → couleur perçue au centre : <strong style="color:${hex};">${hex}</strong>. Avec les trois filtres au maximum, la superposition donne du <strong style="color:var(--yellow);">noir</strong> (chaque filtre absorbe une composante de la lumière blanche).`;
  }

  cRange.addEventListener("input", draw);
  mRange.addEventListener("input", draw);
  yRange.addEventListener("input", draw);
  draw();
}

/* ---------- 2. Couleur perçue selon la lumière incidente ---------- */
function initPerceivedColor(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const lightButtons = cfg.lightButtonIds.map(id => document.getElementById(id));
  const objectButtons = cfg.objectButtonIds.map(id => document.getElementById(id));

  const LIGHTS = {
    blanche: { rgb: [255, 255, 255], name: "blanche", hex: "#ffffff" },
    rouge: { rgb: [255, 0, 0], name: "rouge", hex: "#ff0000" },
    verte: { rgb: [0, 200, 0], name: "verte", hex: "#00c800" },
    bleue: { rgb: [0, 0, 255], name: "bleue", hex: "#0000ff" }
  };
  // pour chaque objet : quels canaux R, G, B il diffuse (1) ou absorbe (0)
  const OBJECTS = {
    blanc: { diffuse: [1, 1, 1], name: "blanc", swatch: "#ffffff" },
    noir: { diffuse: [0, 0, 0], name: "noir", swatch: "#050505" },
    rouge: { diffuse: [1, 0, 0], name: "rouge", swatch: "#ff0000" },
    vert: { diffuse: [0, 1, 0], name: "vert", swatch: "#00c800" },
    bleu: { diffuse: [0, 0, 1], name: "bleu", swatch: "#0000ff" },
    jaune: { diffuse: [1, 1, 0], name: "jaune", swatch: "#ffff00" },
    cyan: { diffuse: [0, 1, 1], name: "cyan", swatch: "#00e0e0" },
    magenta: { diffuse: [1, 0, 1], name: "magenta", swatch: "#ff00ff" }
  };

  let lightKey = "blanche", objectKey = "jaune";

  function perceivedColor(light, object) {
    return light.rgb.map((v, i) => Math.round(v * object.diffuse[i]));
  }

  function diffuseDesc(diffuse) {
    const parts = [];
    if (diffuse[0]) parts.push("le rouge");
    if (diffuse[1]) parts.push("le vert");
    if (diffuse[2]) parts.push("le bleu");
    return parts.length ? parts.join(", ") : "rien (il absorbe tout)";
  }

  function draw() {
    const light = LIGHTS[lightKey];
    const object = OBJECTS[objectKey];
    const p = perceivedColor(light, object);
    const hex = "#" + p.map(v => v.toString(16).padStart(2, "0")).join("");
    const isBlack = p[0] < 15 && p[1] < 15 && p[2] < 15;

    let s = `<rect x="0" y="0" width="220" height="170" fill="#111"/>`;
    // rayons de lumière incidente
    for (let i = 0; i < 4; i++) {
      const x = 30 + i * 15;
      s += `<line x1="${x}" y1="10" x2="${x + 25}" y2="70" stroke="${light.hex}" stroke-width="2" opacity="0.6"/>`;
    }
    s += `<text x="45" y="20" font-size="8.5" fill="${light.hex}" text-anchor="middle">lumière ${light.name}</text>`;

    // objet (triangle, façon pyramide du cours), coloré selon la couleur perçue
    s += `<polygon points="110,60 70,140 150,140" fill="${isBlack ? '#050505' : hex}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;

    svg.innerHTML = s;
    readout.innerHTML = isBlack
      ? `L'objet ${object.name} diffuse ${diffuseDesc(object.diffuse)}. Sous une lumière ${light.name}, il ne reçoit rien qu'il peut diffuser → il apparaît <strong style="color:var(--chalk);">noir</strong>.`
      : `L'objet ${object.name} diffuse ${diffuseDesc(object.diffuse)}. Sous une lumière ${light.name} → couleur perçue : <strong style="color:${hex};">${hex}</strong>.`;
  }

  const lightKeys = ["blanche", "rouge", "verte", "bleue"];
  lightButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      lightButtons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      lightKey = lightKeys[i];
      draw();
    });
  });

  const objectKeys = ["blanc", "noir", "rouge", "vert", "bleu", "jaune", "cyan", "magenta"];
  objectButtons.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      objectButtons.forEach(b => b.classList.remove("active-hist"));
      btn.classList.add("active-hist");
      objectKey = objectKeys[i];
      draw();
    });
  });

  lightButtons[0].classList.add("active-hist");
  objectButtons[5].classList.add("active-hist"); // jaune par défaut
  draw();
}


/* ================================================================== */
/* Partie 2 : animations grand format (diapos, largeur 1780)           */
/* ================================================================== */
var CH8 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif",
  R: "#ff5a4e", G: "#4fd96b", B: "#6b8cff", Cy: "#36d4d9", Ma: "#e766d6", Ja: "#ecd94a" };
var CH8_PURE = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"];
var CH8_COMP = [CH8.R, CH8.G, CH8.B];
var CH8_COMPN = ["rouge", "vert", "bleu"];

function ch8text(x, y, s, o) {
  o = o || {};
  return `<text x="${x}" y="${y}" font-size="${o.size || 26}" fill="${o.fill || CH8.dim}" font-family="${o.font || CH8.fh}" text-anchor="${o.anchor || "start"}"${o.weight ? ` font-weight="${o.weight}"` : ""}>${s}</text>`;
}
function ch8btn(id, fn) {
  const b = id ? document.getElementById(id) : null;
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function ch8setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function ch8hex(c) { return "#" + c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, "0")).join(""); }
function ch8lum(c) { return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
function ch8name(c) {
  const m = Math.max(c[0], c[1], c[2]), n = Math.min(c[0], c[1], c[2]);
  if (m < 0.06) return "noir";
  if ((m - n) / m < 0.12) return m > 0.85 ? "blanc" : "gris";
  const r = c[0], g = c[1], b = c[2];
  let h;
  if (m === r) h = 60 * (((g - b) / (m - n)) % 6);
  else if (m === g) h = 60 * ((b - r) / (m - n) + 2);
  else h = 60 * ((r - g) / (m - n) + 4);
  if (h < 0) h += 360;
  let nm = h < 15 ? "rouge" : h < 45 ? "orange" : h < 70 ? "jaune" : h < 165 ? "vert" : h < 195 ? "cyan" : h < 255 ? "bleu" : h < 285 ? "violet" : h < 340 ? "magenta" : "rouge";
  if (m < 0.45) nm += " sombre";
  return nm;
}
function ch8du(nm) { return /^[aeiouéèh]/i.test(nm) ? "de l'" + nm : "du " + nm; }
function ch8list(a) { return a.length <= 1 ? (a[0] || "") : a.slice(0, -1).join(", ") + " et " + a[a.length - 1]; }
function ch8swatch(hex, size) {
  return `<span style="display:inline-block;flex:none;width:${size || 64}px;height:${size || 64}px;border-radius:50%;background:${hex};border:3px solid rgba(242,237,225,0.55);"></span>`;
}
function ch8dots(on) {
  return `<span style="display:inline-flex;gap:8px;align-items:center;">` + on.map((v, i) => `<span style="width:26px;height:26px;border-radius:50%;${v ? `background:${CH8_COMP[i]};` : ""}border:2px solid ${v ? CH8_COMP[i] : "rgba(242,237,225,0.3)"};"></span>`).join("") + `</span>`;
}
function ch8seg(x1, y1, x2, y2, col, w, arrow, op) {
  let s = `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${w || 4}" stroke-linecap="round"${op != null ? ` opacity="${op}"` : ""}/>`;
  if (arrow) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    if (L > 60) {
      const ux = dx / L, uy = dy / L, k = arrow === "end" ? L - 4 : Math.min(L * 0.5, 190);
      const mx = x1 + ux * k, my = y1 + uy * k;
      s += `<polygon points="${(mx + ux * 4).toFixed(1)},${(my + uy * 4).toFixed(1)} ${(mx - ux * 18 - uy * 10).toFixed(1)},${(my - uy * 18 + ux * 10).toFixed(1)} ${(mx - ux * 18 + uy * 10).toFixed(1)},${(my - uy * 18 - ux * 10).toFixed(1)}" fill="${col}"${op != null ? ` opacity="${op}"` : ""}/>`;
    }
  }
  return s;
}
function ch8readout(hex, title, body) {
  return `<div style="display:flex;gap:24px;align-items:center;">${ch8swatch(hex, 78)}<div style="display:flex;flex-direction:column;gap:4px;min-width:0;"><div style="font-family:Kalam,cursive;font-size:40px;color:#e8c468;line-height:1.15;">${title}</div><div style="font-size:27px;line-height:1.45;text-wrap:pretty;">${body}</div></div></div>`;
}

/* ------------------------------------------------------------------ */
/* 1. Synthèse additive : trois projecteurs sur un écran noir          */
/* ------------------------------------------------------------------ */
function initCh8Additive(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId);
  if (!svg) return;
  const rr = [$(cfg.rId), $(cfg.gId), $(cfg.bId)], ll = [$(cfg.rLId), $(cfg.gLId), $(cfg.bLId)], readout = $(cfg.readoutId);
  const NAMES = ["Rouge", "Vert", "Bleu"];
  const PRESETS = [[100, 100, 100], [100, 100, 0], [0, 100, 100], [100, 0, 100]];
  const pb = (cfg.presetIds || []).map((id, i) => ch8btn(id, () => { PRESETS[i].forEach((v, k) => { rr[k].value = v; }); draw(); }));
  const C = { x: 1240, y: 300 }, r = 200, d = 112;
  const U = [[0, -1], [-0.866, 0.5], [0.866, 0.5]];
  const P = U.map((u) => [C.x + u[0] * d, C.y + u[1] * d]);
  const PROJ = [[90, 120], [90, 300], [90, 480]];
  const at = (u, k) => [C.x + u[0] * k, C.y + u[1] * k];
  const REG = [
    { on: [1, 0, 0], p: at(U[0], 205) }, { on: [0, 1, 0], p: at(U[1], 205) }, { on: [0, 0, 1], p: at(U[2], 205) },
    { on: [1, 1, 0], p: at([-0.866, -0.5], 128) }, { on: [0, 1, 1], p: at([0, 1], 128) }, { on: [1, 0, 1], p: at([0.866, -0.5], 128) },
    { on: [1, 1, 1], p: [C.x, C.y] }
  ];
  const col = (k, v) => `rgb(${k === 0 ? Math.round(255 * v) : 0},${k === 1 ? Math.round(255 * v) : 0},${k === 2 ? Math.round(255 * v) : 0})`;
  function draw() {
    const v = rr.map((x) => Number(x.value) / 100);
    let m = `<g style="isolation:isolate"><rect x="0" y="0" width="1780" height="600" rx="22" fill="#060807"/>`;
    PROJ.forEach((p, k) => {
      const lx = p[0] + 150, cx = P[k][0], cy = P[k][1];
      m += `<polygon points="${lx},${p[1] - 24} ${cx - r * 0.35},${cy - r * 0.9} ${cx - r * 0.35},${cy + r * 0.9} ${lx},${p[1] + 24}" fill="${col(k, v[k])}" opacity="0.22" style="mix-blend-mode:screen"/>`;
    });
    P.forEach((c, k) => { m += `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="${col(k, v[k])}" style="mix-blend-mode:screen"/>`; });
    m += `</g>`;
    PROJ.forEach((p, k) => {
      m += `<rect x="${p[0] - 30}" y="${p[1] - 36}" width="160" height="72" rx="12" fill="#1d3229" stroke="${CH8.dim}" stroke-width="2"/>`;
      m += `<circle cx="${p[0] + 140}" cy="${p[1]}" r="20" fill="${col(k, Math.max(v[k], 0.12))}" stroke="${CH8.chalk}" stroke-width="2"/>`;
      m += ch8text(p[0] - 30, p[1] - 50, `${NAMES[k]} · ${Math.round(v[k] * 100)} %`, { size: 28, fill: CH8_COMP[k] });
    });
    REG.forEach((g) => {
      const c = g.on.map((o, i) => (o ? v[i] : 0));
      if (Math.max(c[0], c[1], c[2]) < 0.06) return;
      m += ch8text(g.p[0].toFixed(1), (g.p[1] + 12).toFixed(1), ch8name(c), { anchor: "middle", size: 34, weight: 700, fill: ch8lum(c) > 0.42 ? "#101410" : CH8.chalk });
    });
    m += ch8text(1740, 572, "écran blanc dans le noir", { anchor: "end", size: 24 });
    svg.innerHTML = m;
    ll.forEach((el, k) => { if (el) el.innerHTML = `<span style="color:${CH8_COMP[k]}">${NAMES[k]}</span> : ${Math.round(v[k] * 100)} %`; });
    pb.forEach((b, i) => ch8setBtn(b, PRESETS[i].every((x, k) => x / 100 === v[k])));
    const nm = ch8name(v), hex = ch8hex(v);
    const full = v.filter((x) => x === 1).length, zero = v.filter((x) => x === 0).length;
    let ex;
    if (full === 3) ex = "Les trois lumières à pleine intensité donnent du <strong>blanc</strong> : c'est la trichromie.";
    else if (zero === 3) ex = "Projecteurs éteints : l'écran reste noir.";
    else if (full === 2 && zero === 1) {
      const miss = v.indexOf(0);
      const T = [["Vert + bleu = cyan.", "Le cyan et le rouge"], ["Rouge + bleu = magenta.", "Le magenta et le vert"], ["Rouge + vert = jaune.", "Le jaune et le bleu"]][miss];
      ex = `${T[0]} ${T[1]} sont <strong>complémentaires</strong> : superposés, ils donnent du blanc.`;
    } else if (full === 1 && zero === 2) ex = "Une seule lumière : l'écran prend sa couleur.";
    else ex = "En dosant l'intensité des trois lumières, on obtient une infinité de couleurs.";
    if (readout) readout.innerHTML = ch8readout(hex, `Au centre : ${nm}`, ex);
  }
  rr.forEach((x) => x.addEventListener("input", draw));
  draw();
}

/* ------------------------------------------------------------------ */
/* 2. Couleur perçue : réponse des trois types de cônes                */
/* ------------------------------------------------------------------ */
function ch8wl(l) {
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = -(l - 510) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = -(l - 645) / 65; } else r = 1;
  const f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (780 - l) / 80 : 1;
  return [r * f, g * f, b * f];
}
function initCh8Eye(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId);
  if (!svg) return;
  const l1R = $(cfg.l1Id), l2R = $(cfg.l2Id), l1L = $(cfg.l1LId), l2L = $(cfg.l2LId), readout = $(cfg.readoutId);
  const l2Box = l2R ? l2R.parentElement : null;
  const CONES = [{ mu: 610, s: 40, col: CH8.R, n: "« rouge »" }, { mu: 530, s: 40, col: CH8.G, n: "« vert »" }, { mu: 450, s: 30, col: CH8.B, n: "« bleu »" }];
  const sens = (c, l) => Math.exp(-((l - c.mu) * (l - c.mu)) / (2 * c.s * c.s));
  const W = CONES.map((c) => { let s = 0; for (let l = 400; l <= 700; l += 5) s += sens(c, l); return s; });
  const X = (l) => 110 + (l - 400) / 300 * 970, BASE = 380, H = 290;
  let mode = 0, twoDone = false;
  const mb = (cfg.modeIds || []).map((id, i) => ch8btn(id, () => {
    mode = i;
    if (i === 1 && !twoDone) { twoDone = true; l1R.value = 650; l2R.value = 530; }
    draw();
  }));
  let grad = "";
  for (let l = 400; l <= 700; l += 20) grad += `<stop offset="${((l - 400) / 300).toFixed(3)}" stop-color="${ch8hex(ch8wl(l))}"/>`;
  function draw() {
    const l1 = Number(l1R.value), l2 = Number(l2R.value);
    const lams = mode === 2 ? null : mode === 1 ? [l1, l2] : [l1];
    const resp = lams ? CONES.map((c, i) => lams.reduce((a, l) => a + sens(c, l), 0) / W[i]) : [1, 1, 1];
    const mx = Math.max(resp[0], resp[1], resp[2]);
    const rgb = resp.map((x) => x / mx), nm = ch8name(rgb), hex = ch8hex(rgb);
    let m = `<defs><linearGradient id="${cfg.svgId}Sp" x1="0" x2="1" y1="0" y2="0">${grad}</linearGradient></defs>`;
    if (!lams) {
      m += `<rect x="${X(400)}" y="80" width="${X(700) - X(400)}" height="${BASE - 80}" fill="rgba(242,237,225,0.09)"/>`;
      m += ch8text(X(550), 250, "toutes les radiations visibles", { anchor: "middle", size: 32, fill: CH8.chalk });
    }
    CONES.forEach((c) => {
      let pts = "";
      for (let l = 400; l <= 700; l += 5) pts += `${X(l).toFixed(1)},${(BASE - H * sens(c, l)).toFixed(1)} `;
      m += `<polygon points="${X(400)},${BASE} ${pts}${X(700)},${BASE}" fill="${c.col}" opacity="0.1"/>`;
      m += `<polyline points="${pts}" fill="none" stroke="${c.col}" stroke-width="4"/>`;
      m += ch8text(X(c.mu), BASE - H - 16, "cônes " + c.n, { anchor: "middle", size: 28, fill: c.col });
    });
    m += `<line x1="${X(400)}" y1="${BASE}" x2="${X(700)}" y2="${BASE}" stroke="${CH8.dim}" stroke-width="2"/>`;
    m += `<rect x="${X(400)}" y="396" width="${X(700) - X(400)}" height="40" rx="6" fill="url(#${cfg.svgId}Sp)"/>`;
    [400, 500, 600, 700].forEach((l) => { m += ch8text(X(l), 470, l + " nm", { anchor: "middle", size: 26 }); });
    m += ch8text(X(400) - 20, 422, "λ", { anchor: "end", size: 30, fill: CH8.chalk });
    (lams || []).forEach((l, j) => {
      const lc = ch8hex(ch8wl(l));
      m += `<line x1="${X(l)}" y1="76" x2="${X(l)}" y2="440" stroke="${lc}" stroke-width="7"/>`;
      m += `<polygon points="${X(l)},446 ${X(l) - 12},466 ${X(l) + 12},466" fill="${CH8.chalk}"/>`;
      m += ch8text(X(l), 512, `λ${lams.length > 1 ? (j === 0 ? "₁" : "₂") : ""} = ${l} nm`, { anchor: "middle", size: 30, fill: CH8.chalk });
      CONES.forEach((c) => {
        const s = sens(c, l);
        if (s > 0.02) m += `<circle cx="${X(l)}" cy="${(BASE - H * s).toFixed(1)}" r="9" fill="${c.col}" stroke="#16261f" stroke-width="3"/>`;
      });
    });
    m += ch8text(1200, 62, "Stimulation des cônes", { size: 32, fill: CH8.chalk });
    CONES.forEach((c, i) => {
      const y = 100 + i * 80;
      m += ch8text(1200, y + 28, "cônes " + c.n, { size: 28, fill: c.col });
      m += `<rect x="1430" y="${y}" width="310" height="38" rx="8" fill="rgba(242,237,225,0.1)"/>`;
      m += `<rect x="1430" y="${y}" width="${(310 * rgb[i]).toFixed(1)}" height="38" rx="8" fill="${c.col}"/>`;
    });
    m += ch8text(1200, 380, "Couleur perçue", { size: 32, fill: CH8.chalk });
    m += `<circle cx="1280" cy="466" r="64" fill="${hex}" stroke="${CH8.chalk}" stroke-width="3"/>`;
    m += ch8text(1370, 484, nm, { size: 52, fill: CH8.y, weight: 700 });
    svg.innerHTML = m;
    mb.forEach((b, i) => ch8setBtn(b, i === mode));
    if (l2R) l2R.disabled = mode !== 1;
    if (l1R) l1R.disabled = mode === 2;
    if (l2Box) l2Box.style.opacity = mode === 1 ? "1" : "0.35";
    if (l1R && l1R.parentElement) l1R.parentElement.style.opacity = mode === 2 ? "0.35" : "1";
    if (l1L) l1L.innerHTML = `λ<sub>1</sub> = ${l1} nm`;
    if (l2L) l2L.innerHTML = `λ<sub>2</sub> = ${l2} nm`;
    const st = CONES.filter((c, i) => rgb[i] >= 0.35).map((c) => c.n);
    const who = st.length === 3 ? "les trois types de cônes" : st.length === 2 ? `les cônes ${st[0]} et ${st[1]}` : `surtout les cônes ${st[0]}`;
    let body;
    if (mode === 2) body = "Toutes les radiations visibles stimulent les trois types de cônes de la même façon : on perçoit du <strong>blanc</strong>.";
    else if (mode === 1) body = `Deux radiations (${l1} nm et ${l2} nm) stimulent ${who} : on perçoit ${ch8du(nm)}. Le cerveau additionne les signaux des cônes : c'est la <strong>synthèse additive</strong>.`;
    else body = `Une radiation de ${l1} nm stimule ${who} : on perçoit ${ch8du(nm)}.`;
    if (readout) readout.innerHTML = `<div style="font-size:28px;line-height:1.5;text-wrap:pretty;">${body}</div>`;
  }
  [l1R, l2R].forEach((x) => x && x.addEventListener("input", draw));
  draw();
}

/* ------------------------------------------------------------------ */
/* 3. Interaction lumière-objet : absorption, diffusion, transmission  */
/* ------------------------------------------------------------------ */
function initCh8Interaction(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), readout = $(cfg.readoutId);
  if (!svg) return;
  const OBJ = [
    { n: "feuille blanche", op: true, k: [1, 1, 1], fill: "#efece4", f: "elle" },
    { n: "feuille rouge", op: true, k: [1, 0, 0], fill: "#d23a2c", f: "elle" },
    { n: "feuille jaune", op: true, k: [1, 1, 0], fill: "#e5cf35", f: "elle" },
    { n: "objet noir", op: true, k: [0, 0, 0], fill: "#0a0c0b", f: "il" },
    { n: "filtre rouge", op: false, k: [1, 0, 0], fill: "rgba(255,50,40,0.5)", f: "il" },
    { n: "filtre cyan", op: false, k: [0, 1, 1], fill: "rgba(30,220,230,0.45)", f: "il" },
    { n: "vitre", op: false, k: [1, 1, 1], fill: "rgba(200,235,245,0.16)", f: "elle" }
  ];
  let k = 1;
  const ob = (cfg.objIds || []).map((id, i) => ch8btn(id, () => { k = i; draw(); }));
  const FACE = 800, SL = 0.22, HY = [250, 300, 350];
  function draw() {
    const o = OBJ[k], w = o.op ? 130 : 38;
    let m = ch8text(110, 60, "lumière blanche incidente", { size: 30, fill: CH8.chalk });
    HY.forEach((hy, i) => { m += ch8seg(120, hy - SL * (FACE - 120), FACE, hy, CH8_COMP[i], 5, "mid"); });
    if (o.op) {
      HY.forEach((hy, i) => {
        if (!o.k[i]) return;
        for (let a = 0; a < 5; a++) {
          const th = (128 + a * 26 + (i - 1) * 5) * Math.PI / 180;
          m += ch8seg(FACE, hy, FACE + Math.cos(th) * 200, hy + Math.sin(th) * 200, CH8_COMP[i], 4, "end", 0.9);
        }
      });
      if (o.k.some(Boolean)) m += ch8text(590, 575, "lumière diffusée", { anchor: "middle", size: 30, fill: CH8.chalk });
    }
    m += `<rect x="${FACE}" y="110" width="${w}" height="420" rx="${o.op ? 10 : 6}" fill="${o.fill}" stroke="${CH8.dim}" stroke-width="2"/>`;
    HY.forEach((hy, i) => {
      if (o.k[i]) return;
      m += `<circle cx="${FACE + 16}" cy="${hy + 4}" r="11" fill="${CH8_COMP[i]}" opacity="0.75"/>`;
    });
    if (!o.op) {
      HY.forEach((hy, i) => {
        if (!o.k[i]) return;
        const y0 = hy + SL * w;
        m += ch8seg(FACE + w, y0, 1580, y0 + SL * (1580 - FACE - w), CH8_COMP[i], 5, "mid");
      });
      if (o.k.some(Boolean)) m += ch8text(1330, 330, "lumière transmise", { anchor: "middle", size: 30, fill: CH8.chalk });
    }
    m += ch8text(FACE + w / 2, 96, o.n, { anchor: "middle", size: 32, fill: CH8.y, weight: 700 });
    if (o.k.some((x) => !x)) m += ch8text(FACE + w + 18, 560, "● lumière absorbée", { size: 26 });
    svg.innerHTML = m;
    ob.forEach((b, i) => ch8setBtn(b, i === k));
    const abs = o.k.map((x) => !x), dif = o.op ? o.k : [0, 0, 0], tr = o.op ? [0, 0, 0] : o.k;
    const words = (a) => { const l = CH8_COMPN.filter((x, i) => a[i]).map((x) => "le " + x); return l.length ? ch8list(l) : "rien"; };
    const chip = (lab, a) => `<div style="border:1px solid rgba(242,237,225,0.16);background:rgba(0,0,0,0.22);border-radius:12px;padding:12px 20px;display:flex;flex-direction:column;gap:8px;min-width:0;"><span style="font-family:Kalam,cursive;font-size:30px;color:#6bbfab;">${lab}</span><div style="display:flex;gap:14px;align-items:center;">${ch8dots(a)}<span style="font-size:26px;">${words(a)}</span></div></div>`;
    const see = ch8name(o.k);
    let msg;
    if (k === 3) msg = "L'objet noir absorbe toute la lumière incidente : il paraît <strong>noir</strong>.";
    else if (k === 6) msg = "La vitre transmet toute la lumière : elle est incolore.";
    else if (o.op) msg = `En lumière blanche, la ${o.n.split(" ")[0]} paraît <strong>${see}</strong> : c'est la couleur de la lumière qu'elle diffuse.`;
    else msg = `Le ${o.n} paraît <strong>${see}</strong> : c'est la couleur de la lumière qu'il transmet.`;
    if (readout) readout.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;">${chip("Absorbe", abs)}${chip("Diffuse", dif)}${chip("Transmet", tr)}</div><div style="font-size:28px;line-height:1.45;margin-top:14px;">${msg}</div>`;
  }
  draw();
}

/* ------------------------------------------------------------------ */
/* 4. Synthèse soustractive : filtres cyan, magenta, jaune             */
/* ------------------------------------------------------------------ */
function initCh8Subtractive(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId);
  if (!svg) return;
  const rr = [$(cfg.cId), $(cfg.mId), $(cfg.yId)], ll = [$(cfg.cLId), $(cfg.mLId), $(cfg.yLId)], readout = $(cfg.readoutId);
  const NAMES = ["Cyan", "Magenta", "Jaune"], COLS = [CH8.Cy, CH8.Ma, CH8.Ja], FILL = ["0,255,255", "255,0,255", "255,255,0"];
  const PRESETS = [[100, 0, 100], [100, 100, 0], [0, 100, 100], [100, 100, 100], [0, 0, 0]];
  const pb = (cfg.presetIds || []).map((id, i) => ch8btn(id, () => { PRESETS[i].forEach((v, k) => { rr[k].value = v; }); draw(); }));
  const C = { x: 430, y: 300 }, r = 180, d = 102;
  const U = [[0, -1], [-0.866, 0.5], [0.866, 0.5]];
  const P = U.map((u) => [C.x + u[0] * d, C.y + u[1] * d]);
  const at = (u, k) => [C.x + u[0] * k, C.y + u[1] * k];
  const REG = [
    { on: [1, 0, 0], p: at(U[0], 180) }, { on: [0, 1, 0], p: at(U[1], 180) }, { on: [0, 0, 1], p: at(U[2], 180) },
    { on: [1, 1, 0], p: at([-0.866, -0.5], 115) }, { on: [0, 1, 1], p: at([0, 1], 115) }, { on: [1, 0, 1], p: at([0.866, -0.5], 115) },
    { on: [1, 1, 1], p: [C.x, C.y] }
  ];
  const after = (v, on) => [1 - (on[0] ? v[0] : 0), 1 - (on[1] ? v[1] : 0), 1 - (on[2] ? v[2] : 0)];
  function draw() {
    const v = rr.map((x) => Number(x.value) / 100);
    let m = `<g style="isolation:isolate"><rect x="0" y="0" width="860" height="600" rx="22" fill="#f4f1ea"/>`;
    P.forEach((c, k) => { m += `<circle cx="${c[0]}" cy="${c[1]}" r="${r}" fill="rgba(${FILL[k]},${v[k]})" style="mix-blend-mode:multiply"/>`; });
    m += `</g>`;
    REG.forEach((g) => {
      const c = after(v, g.on);
      const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]);
      if (mx > 0.85 && (mx - mn) < 0.12) return;
      m += ch8text(g.p[0].toFixed(1), (g.p[1] + 12).toFixed(1), ch8name(c), { anchor: "middle", size: 34, weight: 700, fill: ch8lum(c) > 0.42 ? "#101410" : CH8.chalk });
    });
    m += ch8text(840, 580, "filtres superposés sur fond blanc", { anchor: "end", size: 24, fill: "#5a5a52" });
    const XS = [940, 1110, 1150, 1310, 1350, 1510, 1550, 1690], BY = [250, 300, 350];
    const segI = [[1, 1, 1], [1 - v[0], 1, 1], [1 - v[0], 1 - v[1], 1], [1 - v[0], 1 - v[1], 1 - v[2]]];
    for (let s = 0; s < 4; s++) {
      BY.forEach((y, i) => {
        const a = segI[s][i];
        if (a > 0.01) m += `<rect x="${XS[s * 2]}" y="${y - 15}" width="${XS[s * 2 + 1] - XS[s * 2]}" height="30" fill="${CH8_PURE[i]}" opacity="${(0.15 + 0.85 * a).toFixed(2)}"/>`;
      });
    }
    m += ch8text(946, 410, "lumière blanche", { size: 26, fill: CH8.chalk });
    [0, 1, 2].forEach((k) => {
      const x = XS[1 + k * 2];
      m += `<rect x="${x}" y="190" width="40" height="220" rx="6" fill="rgba(${FILL[k]},${(0.12 + 0.6 * v[k]).toFixed(2)})" stroke="${CH8.dim}" stroke-width="2"/>`;
      m += ch8text(x + 20, 448, NAMES[k].toLowerCase(), { anchor: "middle", size: 28, fill: COLS[k] });
      m += ch8text(x + 20, 480, Math.round(v[k] * 100) + " %", { anchor: "middle", size: 24 });
      if (v[k] > 0) m += ch8text(x + 20, 172, "absorbe le " + CH8_COMPN[k], { anchor: "middle", size: 24, fill: CH8.chalk });
    });
    const fin = segI[3];
    m += `<rect x="1690" y="190" width="44" height="220" rx="6" fill="${ch8hex(fin)}" stroke="${CH8.chalk}" stroke-width="2"/>`;
    m += ch8text(1712, 448, "écran", { anchor: "middle", size: 28, fill: CH8.chalk });
    svg.innerHTML = m;
    ll.forEach((el, k) => { if (el) el.innerHTML = `<span style="color:${COLS[k]}">Filtre ${NAMES[k].toLowerCase()}</span> : ${Math.round(v[k] * 100)} %`; });
    pb.forEach((b, i) => ch8setBtn(b, PRESETS[i].every((x, k) => x / 100 === v[k])));
    const nm = ch8name(fin);
    const used = [0, 1, 2].filter((k) => v[k] > 0);
    let ex = used.length ? used.map((k) => `le ${NAMES[k].toLowerCase()} absorbe le ${CH8_COMPN[k]}`).join(", ") + ". " : "Aucun filtre : la lumière blanche arrive intacte. ";
    ex = ex.charAt(0).toUpperCase() + ex.slice(1);
    if (v.every((x) => x === 0 || x === 1) && used.length) {
      const rest = CH8_COMPN.filter((x, i) => fin[i] === 1);
      ex += rest.length ? `Il ne reste que ${ch8list(rest.map((x) => "le " + x))}.` : "Toutes les composantes sont absorbées : on obtient du <strong>noir</strong>.";
    }
    if (readout) readout.innerHTML = ch8readout(ch8hex(fin), `Au centre : ${nm}`, ex);
  }
  rr.forEach((x) => x.addEventListener("input", draw));
  draw();
}

/* ------------------------------------------------------------------ */
/* 5. Couleur perçue d'un objet selon la lumière incidente             */
/* ------------------------------------------------------------------ */
function initCh8Perceived(cfg) {
  const $ = (id) => (id ? document.getElementById(id) : null);
  const svg = $(cfg.svgId), readout = $(cfg.readoutId);
  if (!svg) return;
  const LIGHTS = [["blanche", [1, 1, 1]], ["rouge", [1, 0, 0]], ["verte", [0, 1, 0]], ["bleue", [0, 0, 1]], ["jaune", [1, 1, 0]], ["cyan", [0, 1, 1]], ["magenta", [1, 0, 1]]];
  const OBJS = [["blanc", [1, 1, 1]], ["noir", [0, 0, 0]], ["rouge", [1, 0, 0]], ["vert", [0, 1, 0]], ["bleu", [0, 0, 1]], ["jaune", [1, 1, 0]], ["cyan", [0, 1, 1]], ["magenta", [1, 0, 1]]];
  let li = 0, oi = 5;
  const lb = (cfg.lightIds || []).map((id, i) => ch8btn(id, () => { li = i; draw(); }));
  const obb = (cfg.objIds || []).map((id, i) => ch8btn(id, () => { oi = i; draw(); }));
  const OX = 700, OY = 380, OR = 150;
  const words = (a) => { const l = CH8_COMPN.filter((x, i) => a[i]).map((x) => "le " + x); return l.length === 3 ? "le rouge, le vert et le bleu" : l.length ? ch8list(l) : "aucune lumière"; };
  function draw() {
    const L = LIGHTS[li][1], O = OBJS[oi][1], Pc = L.map((x, i) => x * O[i]);
    const lhex = ch8hex(L), phex = ch8hex(Pc.some(Boolean) ? Pc : [0.02, 0.02, 0.02]);
    let m = `<polygon points="262,98 262,132 ${OX + 60},${OY + OR - 4} ${OX - OR + 10},${OY - 60}" fill="${lhex}" opacity="0.14"/>`;
    m += `<rect x="60" y="72" width="180" height="86" rx="14" fill="#1d3229" stroke="${CH8.dim}" stroke-width="2"/>`;
    m += `<circle cx="244" cy="115" r="22" fill="${lhex}" stroke="${CH8.chalk}" stroke-width="2"/>`;
    m += ch8text(60, 52, "lumière " + LIGHTS[li][0], { size: 30, fill: CH8.chalk });
    const hit = [OX + OR * Math.cos(222 * Math.PI / 180), OY + OR * Math.sin(222 * Math.PI / 180)];
    const out = [OX + OR * Math.cos(-42 * Math.PI / 180), OY + OR * Math.sin(-42 * Math.PI / 180)];
    [0, 1, 2].forEach((i) => {
      if (!L[i]) return;
      const off = (i - 1) * 20;
      m += ch8seg(268, 115 + off * 0.6, hit[0] - off * 0.6, hit[1] + off * 0.8, CH8_COMP[i], 5, "mid");
    });
    m += `<circle cx="${OX}" cy="${OY}" r="${OR}" fill="${phex}" stroke="${CH8.dim}" stroke-width="3"/>`;
    [0, 1, 2].forEach((i) => {
      if (!L[i] || O[i]) return;
      m += `<circle cx="${(hit[0] + 26 + (i - 1) * 6).toFixed(1)}" cy="${(hit[1] + 24 + (i - 1) * 18).toFixed(1)}" r="11" fill="${CH8_COMP[i]}" opacity="0.8"/>`;
    });
    [0, 1, 2].forEach((i) => {
      if (!Pc[i]) return;
      const off = (i - 1) * 20;
      m += ch8seg(out[0] + off * 0.6, out[1] + off * 0.6, 1110 + off * 0.4, 170 + off, CH8_COMP[i], 5, "end");
    });
    m += ch8text(1120, 128, "vers l'œil", { size: 30, fill: CH8.chalk });
    m += ch8text(OX, OY + OR + 46, `objet ${OBJS[oi][0]}`, { anchor: "middle", size: 32, fill: CH8.y, weight: 700 });
    const TX = [1560, 1630, 1700];
    ["R", "V", "B"].forEach((t, i) => { m += ch8text(TX[i], 262, t, { anchor: "middle", size: 30, fill: CH8_COMP[i], weight: 700 }); });
    const rows = [["Lumière incidente", L], ["L'objet diffuse", O], ["Arrive à l'œil", Pc]];
    m += `<rect x="1226" y="462" width="514" height="76" rx="12" fill="rgba(232,196,104,0.10)" stroke="rgba(232,196,104,0.45)" stroke-width="2"/>`;
    rows.forEach((row, j) => {
      const y = 320 + j * 90;
      m += ch8text(1244, y + 10, row[0], { size: 28, fill: j === 2 ? CH8.y : CH8.chalk });
      row[1].forEach((on, i) => {
        m += `<circle cx="${TX[i]}" cy="${y}" r="20" fill="${on ? CH8_COMP[i] : "none"}" stroke="${on ? CH8_COMP[i] : "rgba(242,237,225,0.3)"}" stroke-width="3"/>`;
      });
    });
    svg.innerHTML = m;
    lb.forEach((b, i) => ch8setBtn(b, i === li));
    obb.forEach((b, i) => ch8setBtn(b, i === oi));
    const black = !Pc.some(Boolean), pn = black ? "noir" : ch8name(Pc);
    const msg = black
      ? `L'objet ${OBJS[oi][0]} diffuse ${words(O)}. En lumière ${LIGHTS[li][0]}, il ne reçoit aucune lumière qu'il peut diffuser : il paraît <strong>noir</strong>.`
      : `L'objet ${OBJS[oi][0]} diffuse ${words(O)}. En lumière ${LIGHTS[li][0]}, il ne renvoie que ${words(Pc)} : il paraît <strong>${pn}</strong>.`;
    if (readout) readout.innerHTML = ch8readout(black ? "#050505" : ch8hex(Pc), `Couleur perçue : ${pn}`, msg);
  }
  draw();
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh8Stages() {
  document.querySelectorAll(".ch8-stage").forEach((outer) => {
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
