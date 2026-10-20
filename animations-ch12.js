/* Animations du chapitre 6 — 1ère spé PC */

/* ---------- 18. Vision microscopique d'un fluide (agitation, proximité, chocs) ---------- */
function initMicroFluid(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const macroSvg = document.getElementById(cfg.macroSvgId);
  const tempRange = document.getElementById(cfg.tempRangeId);
  const densRange = document.getElementById(cfg.densRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const boxX0 = 15, boxY0 = 15, boxX1 = 225, boxY1 = 175;
  let particles = [];
  let lastN = -1;
  let collisionCount = 0;
  let lastSample = performance.now();
  let smoothedRate = 0; // moyenne glissante, pas un chiffre brut qui saute
  let lastTime = performance.now();

  function rebuildParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * 2 * Math.PI;
      particles.push({
        x: boxX0 + 10 + Math.random() * (boxX1 - boxX0 - 20),
        y: boxY0 + 10 + Math.random() * (boxY1 - boxY0 - 20),
        dx: Math.cos(angle),
        dy: Math.sin(angle)
      });
    }
    lastN = n;
  }

  // Panneau macroscopique — statique, rien ne bouge : juste la pression
  // qui augmente avec la profondeur (poids de l'eau), pour contraste avec
  // le panneau microscopique animé.
  const depthRange = document.getElementById(cfg.depthRangeId);

  function drawMacroPanel() {
    const x0 = 30, x1 = 130, y0 = 22, y1 = 175;
    const depth = Number(depthRange.value);
    const pointY = y0 + (depth / 25) * (y1 - y0);
    const P = 1e5 + 1e4 * depth;
    const midX = (x0 + x1) / 2;

    let s = "";
    // eau, bien bleue, pour que ce soit clairement identifiable
    s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="rgba(90,150,210,0.28)" stroke="#5a96d2" stroke-width="2"/>`;
    // surface bien ondulée (plusieurs vaguelettes)
    let wavePath = `M${x0} ${y0}`;
    const waveCount = 4, waveW = (x1 - x0) / waveCount;
    for (let i = 0; i < waveCount; i++) {
      const wx0 = x0 + i * waveW, wxMid = wx0 + waveW / 2, wx1 = wx0 + waveW;
      const dir = i % 2 === 0 ? -5 : 5;
      wavePath += ` Q${wxMid} ${y0 + dir} ${wx1} ${y0}`;
    }
    s += `<path d="${wavePath}" fill="none" stroke="#8fc4f0" stroke-width="2"/>`;
    s += `<text x="${midX}" y="${y0 - 10}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Surface — 0 m</text>`;

    // vecteur g (pesanteur), fixe, à côté — l'origine du phénomène
    s += `<defs><marker id="macroArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--chalk)"/></marker></defs>`;
    s += `<line x1="${x1 + 22}" y1="${y0}" x2="${x1 + 22}" y2="${y0 + 26}" stroke="var(--chalk)" stroke-width="2" marker-end="url(#macroArrow)"/>`;
    s += `<text x="${x1 + 22}" y="${y0 + 38}" font-size="9" fill="var(--chalk)" text-anchor="middle">g</text>`;

    // point M à la profondeur choisie, avec le plongeur (masque + tuba)
    s += `<line x1="${x0}" y1="${pointY}" x2="${x1}" y2="${pointY}" stroke="var(--coral)" stroke-width="1.3" stroke-dasharray="2,2"/>`;
    s += `<circle cx="${midX}" cy="${pointY}" r="10" fill="var(--yellow)"/>`;
    s += `<text x="${midX}" y="${pointY + 4}" font-size="12" text-anchor="middle">🤿</text>`;
    s += `<text x="${midX + 16}" y="${pointY + 4}" font-size="9" fill="var(--coral)" font-weight="700">M</text>`;

    // colonne d'eau au-dessus de M, hachurée en corail — montre visuellement
    // "voilà la quantité de matière qui pousse", pas besoin de texte à l'étroit
    if (depth > 0.5) {
      s += `<defs><pattern id="coralStripes" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="6" stroke="var(--coral)" stroke-width="2"/></pattern></defs>`;
      s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${pointY - y0}" fill="url(#coralStripes)" opacity="0.55"/>`;
    }

    // UNE seule grosse flèche = le poids de toute la colonne au-dessus de M
    if (depth > 0.5) {
      const arrowX = midX - 30;
      s += `<defs><marker id="weightArrow" markerWidth="14" markerHeight="14" refX="12" refY="7" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L14,7 L0,14 Z" fill="var(--yellow)"/></marker></defs>`;
      s += `<line x1="${arrowX}" y1="${y0 + 4}" x2="${arrowX}" y2="${pointY - 6}" stroke="var(--yellow)" stroke-width="4" marker-end="url(#weightArrow)"/>`;
    }

    s += `<text x="${midX}" y="${y1 + 18}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">Profondeur de M : ${depth} m</text>`;
    s += `<text x="${midX}" y="${y1 + 31}" font-size="9" fill="var(--coral)" text-anchor="middle" font-weight="700">P(M) = ${(P / 1e5).toFixed(2)} × 10⁵ Pa</text>`;
    if (depth > 0.5) {
      s += `<text x="${midX}" y="${y1 + 43}" font-size="7.5" fill="var(--coral)" text-anchor="middle" font-style="italic">rayures = quantité d'eau au-dessus de M</text>`;
    }
    macroSvg.innerHTML = s;
  }
  depthRange.addEventListener("input", drawMacroPanel);
  drawMacroPanel();

  function frame(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const temp = Number(tempRange.value);   // agitation, en °C
    const n = Number(densRange.value);       // nombre de particules = proximité
    if (n !== lastN) rebuildParticles(n);

    const speed = 8 + temp * 1.8; // px/s — même vitesse lente à T=0, beaucoup plus rapide en haut d'échelle

    particles.forEach(p => {
      p.x += p.dx * speed * dt;
      p.y += p.dy * speed * dt;
      if (p.x < boxX0 + 4) { p.x = boxX0 + 4; p.dx *= -1; collisionCount++; }
      if (p.x > boxX1 - 4) { p.x = boxX1 - 4; p.dx *= -1; collisionCount++; }
      if (p.y < boxY0 + 4) { p.y = boxY0 + 4; p.dy *= -1; collisionCount++; }
      if (p.y > boxY1 - 4) { p.y = boxY1 - 4; p.dy *= -1; collisionCount++; }
    });

    if (now - lastSample > 250) {
      const sampleRate = collisionCount / ((now - lastSample) / 1000);
      smoothedRate = smoothedRate === 0 ? sampleRate : smoothedRate * 0.75 + sampleRate * 0.25;
      collisionCount = 0;
      lastSample = now;
    }

    let svgContent = `<rect x="${boxX0}" y="${boxY0}" width="${boxX1 - boxX0}" height="${boxY1 - boxY0}" fill="rgba(107,191,171,0.05)" stroke="var(--teal)" stroke-width="2"/>`;
    particles.forEach(p => {
      svgContent += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--yellow)" opacity="0.9"/>`;
    });
    svg.innerHTML = svgContent;

    readout.innerHTML = `
      <div>Température → agitation : <strong style="color:var(--coral)">${temp} °C</strong></div>
      <div>Masse volumique → proximité : <strong style="color:var(--teal)">${n} entités</strong> <span style="color:var(--chalk-dim); font-weight:400;">(nombre arbitraire, pas une vraie unité de densité)</span></div>
      <div>Pression → chocs moyens sur la paroi : <strong style="color:var(--yellow)">≈ ${Math.round(smoothedRate)} chocs/s</strong></div>
    `;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------- 19. Force pressante sur une paroi ---------- */
function initPressureForce(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const fRange = document.getElementById(cfg.fRangeId);
  const sRange = document.getElementById(cfg.sRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const P_MAX = 400; // Pa, borne haute de la jauge (F_max / S_min)
  const gaugeX = 210, gaugeBase = 165, gaugeTop = 15, gaugeW = 26;

  function draw() {
    const F = Number(fRange.value);   // en N
    const S = Number(sRange.value);   // en m²
    const P = F / S;                    // en Pa (N·m⁻²)

    const plateW = 30 + S * 20;         // la plaque de contact grandit avec S
    const plateX = 90 - plateW / 2;
    const plateY = 100;
    const colorT = Math.min(1, P / P_MAX);
    const plateColor = `rgb(${Math.round(107 + colorT * (217 - 107))}, ${Math.round(191 + colorT * (122 - 191))}, ${Math.round(171 + colorT * (99 - 171))})`;

    let svgContent = "";
    // flèche en un seul polygone (hampe + pointe fusionnées) : grossit comme
    // un seul bloc cohérent avec F, jamais de désaccord entre les deux parties
    const fT = Math.min(1, (F - 10) / 190); // 0 à 1 sur la plage du curseur
    const arrowColor = `rgb(${Math.round(150 + fT * (217 - 150))}, ${Math.round(150 - fT * (150 - 122))}, ${Math.round(150 - fT * (150 - 99))})`;
    const shaftHalf = (3 + fT * 6) / 2;   // demi-largeur de la hampe
    const headHalf = shaftHalf + 8;        // demi-largeur de la pointe, toujours plus large
    const headLen = 16;
    const cx = 90, yStart = 15, yEnd = plateY, yHeadBase = yEnd - headLen;
    const arrowPoints = [
      [cx - shaftHalf, yStart], [cx + shaftHalf, yStart],
      [cx + shaftHalf, yHeadBase], [cx + headHalf, yHeadBase],
      [cx, yEnd], [cx - headHalf, yHeadBase],
      [cx - shaftHalf, yHeadBase]
    ].map(p => p.join(",")).join(" ");
    svgContent += `<polygon points="${arrowPoints}" fill="${arrowColor}"/>`;
    // plaque de contact (largeur = S), couleur = intensité de P
    svgContent += `<rect x="${plateX}" y="${plateY}" width="${plateW}" height="16" rx="3" fill="${plateColor}" stroke="var(--chalk)" stroke-width="1.5"/>`;
    svgContent += `<text x="90" y="${plateY + 30}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">S = ${S} m²</text>`;
    svgContent += `<text x="90" y="12" font-size="9" fill="${arrowColor}" text-anchor="middle">F = ${F} N</text>`;
    // sol
    svgContent += `<line x1="20" y1="${plateY + 22}" x2="160" y2="${plateY + 22}" stroke="var(--line)" stroke-width="1.5"/>`;

    // jauge verticale = P
    const barH = Math.min(gaugeBase - gaugeTop, (P / P_MAX) * (gaugeBase - gaugeTop));
    svgContent += `<rect x="${gaugeX}" y="${gaugeTop}" width="${gaugeW}" height="${gaugeBase - gaugeTop}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    svgContent += `<rect x="${gaugeX}" y="${gaugeBase - barH}" width="${gaugeW}" height="${barH}" fill="${plateColor}"/>`;
    svgContent += `<text x="${gaugeX + gaugeW / 2}" y="${gaugeBase - barH - 8}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">${P.toFixed(0)} Pa</text>`;
    svgContent += `<text x="${gaugeX + gaugeW / 2}" y="${gaugeBase + 14}" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">P</text>`;

    svg.innerHTML = svgContent;
    readout.innerHTML = `F = ${F} N, S = ${S} m² → P = <span class="frac"><span class="num">F</span><span class="den">S</span></span> = <strong style="color:var(--yellow)">${P.toFixed(0)} Pa (N·m⁻²)</strong>`;
  }
  fRange.addEventListener("input", draw);
  sRange.addEventListener("input", draw);
  draw();
}

/* ---------- 20. Loi de Mariotte (sac qui gonfle/dégonfle) ---------- */
function initMariotteBag(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const depthRange = document.getElementById(cfg.depthRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const K = 250000; // constante P × V (Pa × unité de volume arbitraire)
  const x0 = 30, x1 = 130, y0 = 22, y1 = 175;
  const midX = (x0 + x1) / 2;

  function draw() {
    const depth = Number(depthRange.value);
    const P = 1e5 + 1e4 * depth;
    const V = K / P;
    const radius = Math.sqrt(V) * 17.7; // proportionnel à √V — pas d'offset constant qui amortirait l'effet

    // position verticale bornée : ne touche jamais le haut ni le bas du bassin
    const margin = 34;
    const ballonY = y0 + margin + (depth / 25) * (y1 - y0 - 2 * margin);
    const rx = radius * 0.82, ry = radius * 1.05;

    let s = "";
    s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="rgba(90,150,210,0.28)" stroke="#5a96d2" stroke-width="2"/>`;
    let wavePath = `M${x0} ${y0}`;
    const waveCount = 4, waveW = (x1 - x0) / waveCount;
    for (let i = 0; i < waveCount; i++) {
      const wx0 = x0 + i * waveW, wxMid = wx0 + waveW / 2, wx1 = wx0 + waveW;
      const dir = i % 2 === 0 ? -5 : 5;
      wavePath += ` Q${wxMid} ${y0 + dir} ${wx1} ${y0}`;
    }
    s += `<path d="${wavePath}" fill="none" stroke="#8fc4f0" stroke-width="2"/>`;
    s += `<text x="${midX}" y="${y0 - 10}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Surface — 0 m</text>`;

    // ballon de baudruche : ovale + petit nœud, pas de points à l'intérieur
    s += `<ellipse cx="${midX}" cy="${ballonY}" rx="${rx}" ry="${ry}" fill="rgba(232,196,104,0.75)" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<ellipse cx="${midX - rx * 0.35}" cy="${ballonY - ry * 0.4}" rx="${rx * 0.25}" ry="${ry * 0.18}" fill="rgba(255,255,255,0.35)"/>`; // reflet
    s += `<path d="M${midX - 4} ${ballonY + ry} L${midX + 4} ${ballonY + ry} L${midX} ${ballonY + ry + 7} Z" fill="var(--yellow)"/>`; // nœud

    s += `<text x="${midX}" y="${y1 + 18}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">Profondeur : ${depth} m</text>`;
    s += `<text x="${midX}" y="${y1 + 31}" font-size="9" fill="var(--coral)" text-anchor="middle" font-weight="700">P = ${(P / 1e5).toFixed(2)} × 10⁵ Pa</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Profondeur = ${depth} m → P = ${(P / 1e5).toFixed(2)} × 10⁵ Pa → V = K / P = <strong style="color:var(--yellow)">${V.toFixed(2)}</strong> (P × V reste constant)`;
  }
  depthRange.addEventListener("input", draw);
  draw();
}

/* ================================================================== */
/* Partie 2 : animations grand format (diapos et site, largeur 1780)   */
/* ================================================================== */
var CH12_VERSION = 1;
var CH12 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", water: "#5a96d2", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };

function c12$(id) { return id ? document.getElementById(id) : null; }
function c12f(v) { return (+v).toFixed(1); }
function c12fr(v, n) { return (+v).toFixed(n == null ? 2 : n).replace(".", ","); }
function c12op(op) { return op != null ? ' opacity="' + Math.max(0, Math.min(1, op)).toFixed(2) + '"' : ""; }
function c12sup(n) { const m = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" }; return String(n).split("").map((c) => m[c] || c).join(""); }
function c12sci(v, d) {
  if (!v) return "0";
  d = d == null ? 2 : d;
  let e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
  if (Math.abs(+m.toFixed(d)) >= 10) { m /= 10; e++; }
  return c12fr(m, d) + " × 10" + c12sup(e);
}
function c12int(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); }
function c12t(x, y, s, o) {
  o = o || {};
  return '<text x="' + c12f(x) + '" y="' + c12f(y) + '" font-size="' + (o.size || 26) + '" fill="' + (o.fill || CH12.dim) + '" font-family="' + (o.font || CH12.fh) + '" text-anchor="' + (o.anchor || "start") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : "") + (o.italic ? ' font-style="italic"' : "") + c12op(o.op) + '>' + s + '</text>';
}
/* indice dans un texte SVG : base + petit indice, puis retour à la ligne de base */
function c12s(base, sub, size) {
  const d = c12f(size * 0.24);
  return base + '<tspan dy="' + d + '" font-size="' + c12f(size * 0.62) + '">' + sub + '</tspan><tspan dy="-' + d + '">\u200b</tspan>';
}
function c12btn(id, fn) {
  const b = c12$(id);
  if (b) b.addEventListener("click", (e) => { fn(e); b.blur(); });
  return b;
}
function c12setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function c12clamp(v) { return Math.max(0, Math.min(1, v)); }
function c12ease(t) { t = c12clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function c12tween(st, dur, onFrame) {
  if (st.raf) cancelAnimationFrame(st.raf);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    onFrame(c12ease(k));
    st.raf = k < 1 ? requestAnimationFrame(step) : 0;
  };
  st.raf = requestAnimationFrame(step);
}
function c12mix(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.substr(i, 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.substr(i, 2), 16));
  return "rgb(" + pa.map((v, i) => Math.round(v + (pb[i] - v) * c12clamp(t))).join(",") + ")";
}
function c12readout(title, body, col) {
  return '<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:40px;color:' + (col || "#e8c468") + ';line-height:1.15;">' + title + '</div><div style="font-size:28px;line-height:1.45;text-wrap:pretty;color:#f2ede1;">' + body + '</div></div>';
}
function c12arrow(x1, y1, x2, y2, col, w, head, op) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
  if (L < 2) return "";
  const ux = dx / L, uy = dy / L, h = Math.min(head || 20, L), bx = x2 - ux * h, by = y2 - uy * h;
  return '<g' + c12op(op) + '>' + (L > h + 1 ? '<line x1="' + c12f(x1) + '" y1="' + c12f(y1) + '" x2="' + c12f(bx + ux * 2) + '" y2="' + c12f(by + uy * 2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>' : "") +
    '<polygon points="' + c12f(x2) + ',' + c12f(y2) + ' ' + c12f(bx - uy * h * 0.55) + ',' + c12f(by + ux * h * 0.55) + ' ' + c12f(bx + uy * h * 0.55) + ',' + c12f(by - ux * h * 0.55) + '" fill="' + col + '"/></g>';
}
function c12line(x1, y1, x2, y2, col, w, dash, op) {
  return '<line x1="' + c12f(x1) + '" y1="' + c12f(y1) + '" x2="' + c12f(x2) + '" y2="' + c12f(y2) + '" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + c12op(op) + '/>';
}
function c12panel() {
  return '<rect x="1130" y="20" width="630" height="560" rx="22" fill="rgba(0,0,0,0.22)" stroke="rgba(242,237,225,0.16)" stroke-width="2"/>';
}
function c12bar(x, y, w, h, frac, col) {
  return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '" fill="rgba(242,237,225,0.10)"/>' +
    '<rect x="' + x + '" y="' + y + '" width="' + c12f(Math.max(h, w * c12clamp(frac))) + '" height="' + h + '" rx="' + h / 2 + '" fill="' + col + '"/>';
}
/* bassin d'eau avec surface ondulée */
function c12basin(x0, y0, x1, y1, fill) {
  let s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '" fill="' + (fill || "rgba(90,150,210,0.28)") + '"/>';
  s += '<path d="M' + x0 + ' ' + (y0 - 30) + ' L' + x0 + ' ' + y1 + ' L' + x1 + ' ' + y1 + ' L' + x1 + ' ' + (y0 - 30) + '" fill="none" stroke="' + CH12.water + '" stroke-width="4"/>';
  const n = Math.max(4, Math.round((x1 - x0) / 90)), w = (x1 - x0) / n;
  let d = "M" + x0 + " " + y0;
  for (let i = 0; i < n; i++) d += " Q" + c12f(x0 + i * w + w / 2) + " " + (y0 + (i % 2 ? 9 : -9)) + " " + c12f(x0 + (i + 1) * w) + " " + y0;
  return s + '<path d="' + d + '" fill="none" stroke="#8fc4f0" stroke-width="3"/>';
}
/* pas-à-pas : boutons − / + et affichage de la valeur */
function c12steppers(steps, V, LIM, fmt, onChange) {
  function show() {
    Object.keys(steps).forEach((k) => {
      const ids = steps[k], v = c12$(ids[2]), m = c12$(ids[0]), p = c12$(ids[1]);
      if (v) v.textContent = fmt && fmt[k] ? fmt[k](V[k]) : V[k];
      if (m) m.disabled = V[k] <= LIM[k][0] + 1e-9;
      if (p) p.disabled = V[k] >= LIM[k][1] - 1e-9;
    });
  }
  Object.keys(steps || {}).forEach((k) => {
    const ids = steps[k];
    const go = (dir) => {
      const old = V[k];
      V[k] = Math.round(Math.max(LIM[k][0], Math.min(LIM[k][1], V[k] + dir * LIM[k][2])) * 1000) / 1000;
      show();
      if (V[k] !== old) onChange(k, dir);
    };
    c12btn(ids[0], () => go(-1)); c12btn(ids[1], () => go(1));
  });
  show();
}

/* ------------------------------------------------------------------ */
/* 1. Vision microscopique : agitation, proximité, chocs                */
/* ------------------------------------------------------------------ */
function initCh12Micro(cfg) {
  const svg = c12$(cfg.svgId), readout = c12$(cfg.readoutId);
  if (!svg) return;
  const V = { T: 20, N: 18 }, LIM = { T: [0, 100, 20], N: [6, 36, 6] };
  const X0 = 50, Y0 = 40, X1 = 1090, Y1 = 560, R = 12;
  let parts = [], hits = [], last = performance.now();
  function rebuild() {
    while (parts.length < V.N) {
      const a = Math.random() * Math.PI * 2;
      parts.push({ x: X0 + R + Math.random() * (X1 - X0 - 2 * R), y: Y0 + R + Math.random() * (Y1 - Y0 - 2 * R), dx: Math.cos(a), dy: Math.sin(a) });
    }
    parts.length = V.N;
  }
  const speed = () => 40 + V.T * 3.2;
  /* fréquence exacte des chocs sur les parois (pas de chocs entre entités) */
  function rate() {
    const v = speed();
    return parts.reduce((r, p) => r + v * Math.abs(p.dx) / (X1 - X0 - 2 * R) + v * Math.abs(p.dy) / (Y1 - Y0 - 2 * R), 0);
  }
  function draw(now) {
    let s = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + (X1 - X0) + '" height="' + (Y1 - Y0) + '" rx="6" fill="rgba(107,191,171,0.05)" stroke="' + CH12.t + '" stroke-width="4"/>';
    hits.forEach((h) => {
      const op = 1 - (now - h.t) / 350;
      s += h.v ? c12line(h.x, h.y - 20, h.x, h.y + 20, CH12.c, 7, null, op) : c12line(h.x - 20, h.y, h.x + 20, h.y, CH12.c, 7, null, op);
    });
    parts.forEach((p) => { s += '<circle cx="' + c12f(p.x) + '" cy="' + c12f(p.y) + '" r="' + R + '" fill="' + CH12.y + '" opacity="0.92"/>'; });
    const r = rate();
    s += c12panel();
    s += c12t(1160, 72, "Température → agitation", { size: 28 });
    s += c12t(1160, 128, "T = " + V.T + " °C", { size: 46, fill: CH12.chalk });
    s += c12bar(1160, 148, 570, 16, (speed() - 20) / 340, CH12.c);
    s += c12t(1160, 228, "Masse volumique → proximité", { size: 28 });
    s += c12t(1160, 284, V.N + " entités", { size: 46, fill: CH12.chalk });
    s += c12bar(1160, 304, 570, 16, V.N / 36, CH12.t);
    s += c12line(1170, 358, 1720, 358, "rgba(242,237,225,0.16)", 2);
    s += c12t(1160, 408, "Pression → chocs sur les parois", { size: 28 });
    s += c12t(1160, 476, "≈ " + c12fr(r, 1) + " chocs/s", { size: 56, fill: CH12.y });
    s += c12bar(1160, 500, 570, 20, r / 25, CH12.y);
    s += c12t(1445, 560, "nombre d'entités et vitesses fictifs", { anchor: "middle", size: 22 });
    svg.innerHTML = s;
  }
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (svg.getClientRects().length && !document.hidden) {
      const v = speed();
      parts.forEach((p) => {
        p.x += p.dx * v * dt; p.y += p.dy * v * dt;
        if (p.x < X0 + R) { p.x = X0 + R; p.dx = Math.abs(p.dx); hits.push({ x: X0, y: p.y, v: 1, t: now }); }
        if (p.x > X1 - R) { p.x = X1 - R; p.dx = -Math.abs(p.dx); hits.push({ x: X1, y: p.y, v: 1, t: now }); }
        if (p.y < Y0 + R) { p.y = Y0 + R; p.dy = Math.abs(p.dy); hits.push({ x: p.x, y: Y0, v: 0, t: now }); }
        if (p.y > Y1 - R) { p.y = Y1 - R; p.dy = -Math.abs(p.dy); hits.push({ x: p.x, y: Y1, v: 0, t: now }); }
      });
      hits = hits.filter((h) => now - h.t < 350);
      draw(now);
    }
    requestAnimationFrame(frame);
  }
  function text(k, dir) {
    if (!readout) return;
    const T = !k ? "Un fluide au repos… en mouvement incessant"
      : k === "T" ? (dir > 0 ? "Température plus élevée → agitation plus grande" : "Température plus basse → agitation plus faible")
      : (dir > 0 ? "Entités plus nombreuses → plus proches les unes des autres" : "Entités moins nombreuses → plus éloignées");
    const up = !k || dir > 0;
    readout.innerHTML = c12readout(T, "À l'échelle microscopique, les entités se déplacent de façon <strong>désordonnée</strong>. " +
      (k ? "Les chocs sur les parois deviennent " + (up ? "plus" : "moins") + " fréquents : la pression " + (up ? "augmente" : "diminue") + "." : "T reflète leur agitation, ρ leur proximité, et P leurs chocs sur les parois."), k === "T" ? "#d97a63" : "#6bbfab");
  }
  c12steppers(cfg.steppers, V, LIM, null, (k, dir) => { rebuild(); text(k, dir); });
  rebuild();
  text();
  requestAnimationFrame(frame);
}

/* ------------------------------------------------------------------ */
/* 2. Force pressante : P = F / S                                        */
/* ------------------------------------------------------------------ */
function initCh12Press(cfg) {
  const svg = c12$(cfg.svgId), readout = c12$(cfg.readoutId);
  if (!svg) return;
  const V = { F: 200, S: 2 }, LIM = { F: [50, 400, 50], S: [0.5, 4, 0.5] };
  const D = { F: 200, S: 2 }, tw = {};
  function draw() {
    const P = D.F / D.S, cx = 570, gy = 440, t = P / 800, pc = c12mix(CH12.t, CH12.c, t);
    const pw = 100 + D.S * 110, px = cx - pw / 2;
    let s = '<rect x="60" y="' + gy + '" width="1020" height="150" fill="rgba(242,237,225,0.04)"/>';
    s += c12line(60, gy, 1080, gy, "rgba(242,237,225,0.4)", 3);
    /* force F : flèche pleine dont l'épaisseur suit F */
    const sh = 5 + D.F / 400 * 16, hh = sh + 20, y0 = 70, y1 = gy - 28, yh = y1 - 44;
    s += '<polygon points="' + [[cx - sh, y0], [cx + sh, y0], [cx + sh, yh], [cx + hh, yh], [cx, y1], [cx - hh, yh], [cx - sh, yh]].map((p) => c12f(p[0]) + "," + c12f(p[1])).join(" ") + '" fill="' + CH12.chalk + '"/>';
    s += c12t(cx + hh + 24, 150, "F = " + Math.round(D.F) + " N", { size: 42, fill: CH12.chalk });
    s += '<rect x="' + c12f(px) + '" y="' + (gy - 26) + '" width="' + c12f(pw) + '" height="26" rx="5" fill="' + pc + '" stroke="' + CH12.chalk + '" stroke-width="2"/>';
    /* la même force répartie : une petite flèche par quart de m² */
    const n = Math.max(2, Math.round(D.S * 4)), L = 14 + c12clamp(t) * 100;
    for (let i = 0; i < n; i++) {
      const x = px + (i + 0.5) * pw / n;
      s += c12arrow(x, gy + 6, x, gy + 6 + L, pc, 4, 14);
    }
    s += c12t(cx, 590, "S = " + c12fr(D.S, 1) + " m²", { anchor: "middle", size: 32, fill: CH12.chalk });
    s += c12t(90, 590, "force répartie sur la surface", { size: 24 });
    s += c12panel();
    s += c12t(1160, 72, "Pression exercée", { size: 30 });
    s += c12t(1200, 196, "P =", { size: 50, fill: CH12.chalk });
    s += c12t(1340, 170, "F", { anchor: "middle", size: 44, fill: CH12.chalk }) + c12line(1310, 186, 1370, 186, CH12.chalk, 3) + c12t(1340, 230, "S", { anchor: "middle", size: 44, fill: CH12.chalk });
    s += c12t(1400, 196, "=", { size: 50, fill: CH12.chalk });
    s += c12t(1540, 170, String(V.F), { anchor: "middle", size: 44, fill: CH12.chalk }) + c12line(1470, 186, 1610, 186, CH12.chalk, 3) + c12t(1540, 230, c12fr(V.S, 1), { anchor: "middle", size: 44, fill: CH12.chalk });
    s += c12t(1445, 340, "P = " + c12int(V.F / V.S) + " Pa", { anchor: "middle", size: 66, fill: CH12.y });
    s += c12bar(1160, 384, 570, 22, P / 800, pc);
    s += c12t(1160, 440, "0", { size: 24 }) + c12t(1730, 440, "800 Pa", { size: 24, anchor: "end" });
    s += c12line(1170, 476, 1720, 476, "rgba(242,237,225,0.16)", 2);
    s += c12t(1445, 536, "1 Pa = 1 N·m⁻²", { anchor: "middle", size: 34, fill: CH12.chalk });
    svg.innerHTML = s;
  }
  function text(k, dir) {
    if (!readout) return;
    const P = c12int(V.F / V.S);
    const T = !k ? "La pression : une force par unité de surface"
      : k === "F" ? (dir > 0 ? "Force plus grande, même surface → pression plus grande" : "Force plus faible, même surface → pression plus faible")
      : (dir > 0 ? "Même force, surface plus grande → pression plus faible" : "Même force, surface plus petite → pression plus grande");
    readout.innerHTML = c12readout(T, "P = F / S, soit <strong>F = P × S</strong>. Ici, chaque mètre carré de surface reçoit une force de " + P + " N : P = " + P + " Pa.");
  }
  c12steppers(cfg.steppers, V, LIM, { S: (v) => c12fr(v, 1) }, (k, dir) => {
    const f0 = D.F, s0 = D.S;
    c12tween(tw, 450, (e) => { D.F = f0 + (V.F - f0) * e; D.S = s0 + (V.S - s0) * e; draw(); });
    text(k, dir);
  });
  draw();
  text();
}

/* ------------------------------------------------------------------ */
/* 3. Pression et profondeur dans un liquide                            */
/* ------------------------------------------------------------------ */
function initCh12Depth(cfg) {
  const svg = c12$(cfg.svgId), readout = c12$(cfg.readoutId);
  if (!svg) return;
  const FL = [
    { n: "eau douce", rho: 1000, fill: "rgba(90,150,210,0.30)" },
    { n: "eau de mer", rho: 1025, fill: "rgba(70,150,160,0.36)" },
    { n: "huile", rho: 920, fill: "rgba(232,196,104,0.22)" }
  ];
  let fi = 0, dz = 10;
  const V = { Z: 10 }, LIM = { Z: [0, 20, 2] }, tw = {};
  const PA = 101300, g = 9.81, X0 = 270, X1 = 1060, SY = 100, BY = 560, K = (BY - SY - 20) / 20;
  const xB = 560, xC = 900;
  function probe(x, y, P, r, col) {
    const L = 12 + P / 1e5 * 20;
    let s = "";
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach((u) => {
      s += c12arrow(x + u[0] * (r + 8 + L), y + u[1] * (r + 8 + L), x + u[0] * (r + 6), y + u[1] * (r + 6), CH12.c, 5, 16);
    });
    return s;
  }
  function draw() {
    const fl = FL[fi], yB = SY + dz * K, P = PA + fl.rho * g * dz;
    const Pt = PA + fl.rho * g * V.Z, dP = fl.rho * g * V.Z;
    let s = c12basin(X0, SY, X1, BY, fl.fill);
    s += c12t((X0 + X1) / 2, 46, "air : " + c12s("P", "atm", 28) + " = 1,013 × 10⁵ Pa", { anchor: "middle", size: 28 });
    /* axe z orienté vers le haut */
    s += c12arrow(70, 580, 70, 40, CH12.chalk, 3, 20);
    s += c12t(88, 52, "z", { size: 36, fill: CH12.chalk, font: CH12.fb, italic: true });
    s += c12line(60, SY, 80, SY, CH12.chalk, 3) + c12t(92, SY + 9, c12s("z", "A", 26) + " = 0", { size: 26, fill: CH12.chalk });
    if (dz > 0.4) {
      s += c12line(60, yB, 80, yB, CH12.y, 3) + c12t(92, yB + 9, c12s("z", "B", 26) + " = −" + Math.round(dz) + " m", { size: 26, fill: CH12.y });
      s += c12line(X0, yB, X1, yB, "rgba(242,237,225,0.45)", 2, "10 10");
      s += c12line(xB - 70, SY, xB - 70, yB, CH12.chalk, 2, null, 0.6) + c12t(xB - 84, (SY + yB) / 2 + 9, "h = " + Math.round(dz) + " m", { size: 26, fill: CH12.chalk, anchor: "end" });
    }
    s += '<circle cx="' + xB + '" cy="' + SY + '" r="8" fill="' + CH12.chalk + '"/>' + c12t(xB + 18, SY - 16, "A", { size: 32, fill: CH12.chalk, font: CH12.fb, weight: 700 });
    s += probe(xC, yB, P, 16) + '<circle cx="' + xC + '" cy="' + c12f(yB) + '" r="16" fill="' + CH12.chalk + '"/>' + c12t(xC + 30, yB - 26, "C", { size: 30, fill: CH12.chalk, font: CH12.fb, weight: 700 });
    s += probe(xB, yB, P, 24) + '<circle cx="' + xB + '" cy="' + c12f(yB) + '" r="24" fill="' + CH12.y + '"/>' + c12t(xB, yB + 11, "B", { anchor: "middle", size: 30, fill: CH12.board, font: CH12.fb, weight: 700 });
    s += c12panel();
    s += c12t(1160, 70, "Loi de la statique des fluides", { size: 28 });
    s += c12t(1445, 136, c12s("P", "B", 40) + " − " + c12s("P", "A", 40) + " = ρ × g × (" + c12s("z", "A", 40) + " − " + c12s("z", "B", 40) + ")", { anchor: "middle", size: 40, fill: CH12.chalk });
    s += c12t(1445, 200, "= " + c12int(fl.rho) + " × 9,81 × " + V.Z, { anchor: "middle", size: 36, fill: CH12.chalk });
    s += c12t(1445, 254, "= " + (dP ? c12sci(dP) : "0") + " Pa", { anchor: "middle", size: 36, fill: CH12.chalk });
    s += c12line(1170, 290, 1720, 290, "rgba(242,237,225,0.16)", 2);
    s += c12t(1445, 342, c12s("P", "A", 28) + " = " + c12s("P", "atm", 28) + " = 1,013 × 10⁵ Pa", { anchor: "middle", size: 28 });
    s += c12t(1445, 430, c12s("P", "B", 58) + " = " + c12sci(Pt) + " Pa", { anchor: "middle", size: 58, fill: CH12.y });
    s += c12t(1445, 494, "soit " + c12fr(Pt / PA, 2) + " × " + c12s("P", "A", 34), { anchor: "middle", size: 34, fill: CH12.chalk });
    s += c12t(1445, 556, "ρ(" + fl.n + ") = " + c12int(fl.rho) + " kg·m⁻³", { anchor: "middle", size: 26 });
    svg.innerHTML = s;
  }
  function text() {
    if (!readout) return;
    const fl = FL[fi], Pt = PA + fl.rho * g * V.Z;
    const T = V.Z === 0 ? "À la surface : P<sub>B</sub> = P<sub>A</sub> = P<sub>atm</sub>" : "À " + V.Z + " m sous la surface : P<sub>B</sub> = " + c12sci(Pt) + " Pa";
    readout.innerHTML = c12readout(T, "La pression augmente avec la profondeur. L'axe z est orienté vers le <strong>haut</strong> : B étant sous A, z<sub>A</sub> − z<sub>B</sub> &gt; 0, donc P<sub>B</sub> &gt; P<sub>A</sub>. Le point C, à la même profondeur que B, subit la même pression.");
  }
  const fb = (cfg.fluidIds || []).map((id, i) => c12btn(id, () => { fi = i; sync(); draw(); text(); }));
  function sync() { fb.forEach((b, i) => c12setBtn(b, i === fi)); }
  c12steppers(cfg.steppers, V, LIM, null, () => {
    const z0 = dz;
    c12tween(tw, 600, (e) => { dz = z0 + (V.Z - z0) * e; draw(); });
    text();
  });
  sync();
  draw();
  text();
}

/* ------------------------------------------------------------------ */
/* 4. Loi de Mariotte : le ballon qui descend                           */
/* ------------------------------------------------------------------ */
function initCh12Mariotte(cfg) {
  const svg = c12$(cfg.svgId), readout = c12$(cfg.readoutId);
  if (!svg) return;
  const V = { Z: 0 }, LIM = { Z: [0, 30, 5] }, tw = {};
  let dz = 0;
  const X0 = 70, X1 = 560, SY = 90, BY = 560, K = 12;
  const Pof = (z) => 1e5 + 1e4 * z, Vof = (z) => 3e5 / Pof(z);
  const O = [690, 520], KP = 90, KV = 128;
  function draw() {
    const P = Pof(dz), Vol = Vof(dz), cy = SY + 64 + dz * K, r = 58 * Math.cbrt(Vol / 3);
    const rx = r * 0.88, ry = r * 1.04, cx = (X0 + X1) / 2;
    let s = c12basin(X0, SY, X1, BY);
    s += c12t(cx, 46, "surface — 0 m", { anchor: "middle", size: 26 });
    s += '<ellipse cx="' + cx + '" cy="' + c12f(cy) + '" rx="' + c12f(rx) + '" ry="' + c12f(ry) + '" fill="rgba(232,196,104,0.78)" stroke="' + CH12.y + '" stroke-width="3"/>';
    s += '<ellipse cx="' + c12f(cx - rx * 0.35) + '" cy="' + c12f(cy - ry * 0.4) + '" rx="' + c12f(rx * 0.24) + '" ry="' + c12f(ry * 0.17) + '" fill="rgba(255,255,255,0.35)"/>';
    s += '<path d="M' + c12f(cx - 7) + ' ' + c12f(cy + ry) + ' L' + c12f(cx + 7) + ' ' + c12f(cy + ry) + ' L' + cx + ' ' + c12f(cy + ry + 12) + ' Z" fill="' + CH12.y + '"/>';
    s += c12t(X0 + 18, BY - 20, "profondeur : " + Math.round(dz) + " m", { size: 28, fill: CH12.chalk });
    /* graphe V = f(P) */
    s += c12arrow(O[0], O[1], 1090, O[1], CH12.chalk, 3, 18) + c12arrow(O[0], O[1], O[0], 50, CH12.chalk, 3, 18);
    s += c12t(1090, O[1] + 46, "P (10⁵ Pa)", { anchor: "end", size: 26 });
    s += c12t(O[0] + 14, 62, "V (L)", { size: 26 });
    [1, 2, 3, 4].forEach((k) => { const x = O[0] + k * KP; s += c12line(x, O[1] - 6, x, O[1] + 6, CH12.chalk, 2) + c12t(x, O[1] + 34, String(k), { anchor: "middle", size: 24 }); });
    [1, 2, 3].forEach((k) => { const y = O[1] - k * KV; s += c12line(O[0] - 6, y, O[0] + 6, y, CH12.chalk, 2) + c12t(O[0] - 16, y + 8, String(k), { anchor: "end", size: 24 }); });
    let d = "";
    for (let p = 0.88; p <= 4.31; p += 0.04) d += (d ? " L" : "M") + c12f(O[0] + p * KP) + " " + c12f(O[1] - 3 / p * KV);
    s += '<path d="' + d + '" fill="none" stroke="' + CH12.t + '" stroke-width="4"/>';
    const gx = O[0] + P / 1e5 * KP, gy = O[1] - Vol * KV;
    s += c12line(gx, gy, gx, O[1], CH12.y, 2, "8 8") + c12line(gx, gy, O[0], gy, CH12.y, 2, "8 8");
    s += '<circle cx="' + c12f(gx) + '" cy="' + c12f(gy) + '" r="11" fill="' + CH12.y + '" stroke="' + CH12.board + '" stroke-width="3"/>';
    s += c12t(1070, 150, "P × V = constante", { anchor: "end", size: 30, fill: CH12.t });
    s += c12panel();
    const Pt = Pof(V.Z), Vt = Vof(V.Z), k = Pt / 1e5;
    s += c12t(1160, 72, V.Z ? "À " + V.Z + " m de profondeur" : "En surface", { size: 30 });
    s += c12t(1445, 150, "P = " + c12sci(Pt, 1) + " Pa", { anchor: "middle", size: 46, fill: CH12.chalk });
    s += c12t(1445, 236, "V = " + c12fr(Vt, Vt < 1 ? 2 : 1) + " L", { anchor: "middle", size: 62, fill: CH12.y });
    s += c12line(1170, 282, 1720, 282, "rgba(242,237,225,0.16)", 2);
    s += c12t(1445, 344, "P × V = " + c12sci(Pt * Vt, 1) + " Pa·L", { anchor: "middle", size: 40, fill: CH12.t });
    s += c12t(1445, 396, "reste constant", { anchor: "middle", size: 34, fill: CH12.t });
    s += c12line(1170, 438, 1720, 438, "rgba(242,237,225,0.16)", 2);
    s += V.Z ? c12t(1445, 512, "P × " + c12fr(k, 1) + "  →  V ÷ " + c12fr(k, 1), { anchor: "middle", size: 42, fill: CH12.chalk })
      : c12t(1445, 512, "descends le ballon", { anchor: "middle", size: 34 });
    svg.innerHTML = s;
  }
  function text() {
    if (!readout) return;
    const k = c12fr(Pof(V.Z) / 1e5, 1);
    const T = V.Z ? "Pression multipliée par " + k + " → volume divisé par " + k : "En surface : P = 1,0 × 10⁵ Pa et V = 3,0 L";
    readout.innerHTML = c12readout(T, "À température et quantité de matière constantes, P × V reste constant : le ballon rétrécit quand on descend. On prend ici P ≈ 1,0 × 10⁵ Pa + 1,0 × 10⁴ Pa par mètre de profondeur.");
  }
  c12steppers(cfg.steppers, V, LIM, null, () => {
    const z0 = dz;
    c12tween(tw, 700, (e) => { dz = z0 + (V.Z - z0) * e; draw(); });
    text();
  });
  draw();
  text();
}

/* ------------------------------------------------------------------ */
/* Site web : mise à l'échelle des blocs d'animation (largeur 1780)    */
/* ------------------------------------------------------------------ */
function initCh12Stages() {
  document.querySelectorAll(".ch12-stage").forEach((outer) => {
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
