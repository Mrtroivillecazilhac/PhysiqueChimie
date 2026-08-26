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
