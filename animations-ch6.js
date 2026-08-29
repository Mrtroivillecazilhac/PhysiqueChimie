/* Animations du chapitre 4 — 1ère spé PC */

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
