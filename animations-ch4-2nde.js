/* Animations du chapitre 5 — 2nde — "Description des mouvements"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Types de trajectoire ---------- */
function initTrajectoryTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLine = document.getElementById(cfg.btnLineId);
  const btnCircle = document.getElementById(cfg.btnCircleId);
  const btnCurvy = document.getElementById(cfg.btnCurvyId);

  let mode = "line";

  function draw() {
    let path, points;
    if (mode === "line") {
      path = "M30,150 L200,60";
      points = [[30, 150], [72, 128], [114, 105], [156, 83], [200, 60]];
    } else if (mode === "circle") {
      const cx = 115, cy = 150, r = 90;
      path = `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx},${cy - r}`;
      points = [0, 0.25, 0.5, 0.75, 1].map(t => {
        const a = Math.PI - t * Math.PI / 2;
        return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
      });
    } else {
      path = "M20,160 Q70,20 115,110 T210,50";
      points = [[20, 160], [55, 90], [95, 105], [150, 75], [210, 50]];
    }

    let s = `<path d="${path}" fill="none" stroke="var(--chalk-dim)" stroke-width="2" stroke-dasharray="4,3"/>`;
    points.forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--teal)"/>`;
      s += `<text x="${x}" y="${y - 9}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">M${i + 1}</text>`;
    });
    svg.innerHTML = s;

    const texts = {
      line: "Mouvement rectiligne : la trajectoire est une portion de droite.",
      circle: "Mouvement circulaire : la trajectoire est une portion de cercle.",
      curvy: "Mouvement curviligne : la trajectoire n'est ni une droite, ni un cercle."
    };
    readout.textContent = texts[mode];
  }
  btnLine.addEventListener("click", () => { mode = "line"; draw(); });
  btnCircle.addEventListener("click", () => { mode = "circle"; draw(); });
  btnCurvy.addEventListener("click", () => { mode = "curvy"; draw(); });
  draw();
}

/* ---------- 2. Vecteur déplacement (indépendant de la trajectoire) ---------- */
function initDisplacementVector(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btn1 = document.getElementById(cfg.btn1Id);
  const btn2 = document.getElementById(cfg.btn2Id);

  let mode = "traj1";
  const M = [40, 150], Mp = [190, 60];

  function draw() {
    const path1 = `M${M[0]},${M[1]} C90,40 140,180 ${Mp[0]},${Mp[1]}`;
    const path2 = `M${M[0]},${M[1]} C60,190 190,190 ${Mp[0]},${Mp[1]}`;
    let s = `<defs><marker id="dvArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<path d="${mode === 'traj1' ? path1 : path2}" fill="none" stroke="var(--teal)" stroke-width="2" stroke-dasharray="4,3"/>`;
    s += `<line x1="${M[0]}" y1="${M[1]}" x2="${Mp[0]}" y2="${Mp[1]}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#dvArrow)"/>`;
    s += `<circle cx="${M[0]}" cy="${M[1]}" r="4.5" fill="var(--chalk)"/>`;
    s += `<circle cx="${Mp[0]}" cy="${Mp[1]}" r="4.5" fill="var(--chalk)"/>`;
    s += `<text x="${M[0] - 10}" y="${M[1] + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    s += `<text x="${Mp[0] + 10}" y="${Mp[1] - 6}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M'</text>`;
    svg.innerHTML = s;

    readout.textContent = `Que le système suive la trajectoire ${mode === 'traj1' ? '1' : '2'} entre M et M', le vecteur déplacement MM' (en jaune) reste exactement le même.`;
  }
  btn1.addEventListener("click", () => { mode = "traj1"; draw(); });
  btn2.addEventListener("click", () => { mode = "traj2"; draw(); });
  draw();
}

/* ---------- 3. Calculateur de vitesse moyenne ---------- */
function initAverageVelocity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const tRange = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const d = Number(dRange.value); // m
    const t = Number(tRange.value); // s
    const v = t > 0 ? d / t : 0;

    const x0 = 20, y0 = 90, maxLen = 190;
    const len = Math.min(maxLen, (d / 30) * maxLen);
    let s = `<defs><marker id="avArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<line x1="${x0}" y1="${y0}" x2="${x0 + len}" y2="${y0}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#avArrow)"/>`;
    s += `<circle cx="${x0}" cy="${y0}" r="4" fill="var(--chalk)"/>`;
    s += `<text x="${x0}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    s += `<text x="${x0 + len}" y="${y0 + 20}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">M'</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `v<sub>moy</sub> = <span class="frac"><span class="num">MM'</span><span class="den">Δt</span></span> = <span class="frac"><span class="num">${d} m</span><span class="den">${t} s</span></span> = <strong style="color:var(--yellow)">${v.toFixed(1)} m/s</strong>`;
  }
  dRange.addEventListener("input", draw);
  tRange.addEventListener("input", draw);
  draw();
}

/* ---------- 4. Vecteur vitesse en un point (tangence) ---------- */
function initVelocityTangent(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const gapRange = document.getElementById(cfg.gapRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const cx = 30, cy = 190, r = 170;
  const theta0 = Math.PI * 0.95; // position de M sur l'arc

  function pointAt(theta) {
    return [cx + r * Math.cos(theta), cy - r * Math.sin(theta) - 40];
  }

  function draw() {
    const gap = Number(gapRange.value); // en degrés, grand = loin, petit = proche
    const thetaM = theta0;
    const thetaMp = theta0 - (gap * Math.PI / 180);
    const M = pointAt(thetaM), Mp = pointAt(thetaMp);

    // trajectoire (arc complet, en pointillés)
    let s = `<path d="M${pointAt(theta0).join(',')} A${r},${r} 0 0 1 ${pointAt(theta0 - Math.PI * 0.5).join(',')}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5" stroke-dasharray="3,3"/>`;

    // tangente en M (perpendiculaire au rayon en M), pour comparaison visuelle
    const tanAngle = thetaM + Math.PI / 2;
    const tx1 = M[0] + 40 * Math.cos(tanAngle), ty1 = M[1] - 40 * Math.sin(tanAngle);
    const tx2 = M[0] - 40 * Math.cos(tanAngle), ty2 = M[1] + 40 * Math.sin(tanAngle);
    s += `<line x1="${tx1}" y1="${ty1}" x2="${tx2}" y2="${ty2}" stroke="var(--teal)" stroke-width="1.2" stroke-dasharray="2,2"/>`;
    s += `<text x="${tx1 + 6}" y="${ty1}" font-size="7.5" fill="var(--teal)">tangente</text>`;

    // vecteur MM'
    s += `<defs><marker id="vtArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<line x1="${M[0]}" y1="${M[1]}" x2="${Mp[0]}" y2="${Mp[1]}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#vtArrow)"/>`;
    s += `<circle cx="${M[0]}" cy="${M[1]}" r="4" fill="var(--chalk)"/>`;
    s += `<text x="${M[0] - 12}" y="${M[1] + 4}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">M</text>`;
    svg.innerHTML = s;

    readout.textContent = gap <= 8
      ? "Δt est maintenant très courte : le vecteur MM' est quasiment confondu avec la tangente à la trajectoire en M — c'est le vecteur vitesse."
      : "Rapproche M' de M (réduis l'écart) pour observer le vecteur devenir tangent à la trajectoire.";
  }
  gapRange.addEventListener("input", draw);
  draw();
}

/* ---------- 5. Nature du mouvement (accéléré / décéléré / uniforme) ---------- */
function initMotionNature(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const btnUniform = document.getElementById(cfg.btnUniformId);

  let mode = "accel";

  function draw() {
    const y = 90;
    const xs = [20, 80, 140, 200];
    let lengths;
    if (mode === "accel") lengths = [15, 25, 38];
    else if (mode === "decel") lengths = [38, 25, 15];
    else lengths = [25, 25, 25];

    let s = `<defs><marker id="mnArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--yellow)"/></marker></defs>`;
    xs.forEach((x, i) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="var(--chalk)"/>`; s += `<text x="${x}" y="${y + 20}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">M${i + 1}</text>`; });
    xs.slice(0, 3).forEach((x, i) => {
      s += `<line x1="${x}" y1="${y - 15}" x2="${x + lengths[i]}" y2="${y - 15}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#mnArrow)"/>`;
    });
    svg.innerHTML = s;

    const texts = {
      accel: "La valeur du vecteur vitesse augmente : le mouvement rectiligne est accéléré.",
      decel: "La valeur du vecteur vitesse diminue : le mouvement rectiligne est décéléré.",
      uniform: "La valeur du vecteur vitesse reste la même : le mouvement rectiligne est uniforme."
    };
    readout.textContent = texts[mode];
  }
  btnAccel.addEventListener("click", () => { mode = "accel"; draw(); });
  btnDecel.addEventListener("click", () => { mode = "decel"; draw(); });
  btnUniform.addEventListener("click", () => { mode = "uniform"; draw(); });
  draw();
}
