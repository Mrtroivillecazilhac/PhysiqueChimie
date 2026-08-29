/* Animations du chapitre 7 — 2nde — "Principe d'inertie"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Effet d'une force sur le mouvement ---------- */
function initForceEffect(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnBefore = document.getElementById(cfg.btnBeforeId);
  const btnAfter = document.getElementById(cfg.btnAfterId);

  let mode = "before";

  function draw() {
    const cx = 110, cy = 90;
    let s = `<defs><marker id="feArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="10" fill="#c9e265"/>`;

    if (mode === "before") {
      s += `<line x1="${cx + 12}" y1="${cy}" x2="${cx + 65}" y2="${cy}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#feArrow)"/>`;
      s += `<text x="${cx + 40}" y="${cy - 10}" font-size="9" fill="var(--yellow)" text-anchor="middle">v</text>`;
    } else {
      s += `<rect x="${cx - 55}" y="${cy - 45}" width="12" height="45" rx="3" fill="var(--chalk-dim)" transform="rotate(35 ${cx - 30} ${cy - 10})"/>`;
      s += `<text x="${cx - 60}" y="${cy - 55}" font-size="8" fill="var(--chalk-dim)">raquette</text>`;
      s += `<line x1="${cx + 8}" y1="${cy - 8}" x2="${cx + 50}" y2="${cy - 55}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#feArrow)"/>`;
      s += `<text x="${cx + 55}" y="${cy - 55}" font-size="9" fill="var(--yellow)" text-anchor="middle">v'</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "before"
      ? "Avant la frappe : la balle a un vecteur vitesse v horizontal."
      : "Après la frappe : la raquette a exercé une force sur la balle, qui a modifié la valeur ET la direction de son vecteur vitesse (devenu v').";
  }
  btnBefore.addEventListener("click", () => { mode = "before"; draw(); });
  btnAfter.addEventListener("click", () => { mode = "after"; draw(); });
  draw();
}

/* ---------- 2. Forces qui se compensent (principe d'inertie) ---------- */
function initCompensatingForces(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPalet = document.getElementById(cfg.btnPaletId);
  const btnBowling = document.getElementById(cfg.btnBowlingId);

  let mode = "palet";

  function draw() {
    const cx = 110, cy = 55;
    let s = `<defs><marker id="cfArrowU" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker>
      <marker id="cfArrowD" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="10" fill="#e8a03c"/>`;
    s += `<line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy - 40}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#cfArrowU)"/>`;
    s += `<text x="${cx + 10}" y="${cy - 30}" font-size="8" fill="var(--teal)">${mode === "palet" ? "F table" : "R sol"}</text>`;
    s += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy + 40}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#cfArrowD)"/>`;
    s += `<text x="${cx + 10}" y="${cy + 32}" font-size="8" fill="var(--coral)">P</text>`;

    // positions à v constante (mouvement rectiligne uniforme)
    const xs = [20, 65, 110, 155, 200];
    xs.forEach((x, i) => {
      s += `<circle cx="${x}" cy="150" r="3.5" fill="var(--chalk)"/>`;
      if (i < xs.length - 1) s += `<line x1="${x + 5}" y1="150" x2="${x + 40}" y2="150" stroke="var(--yellow)" stroke-width="2" marker-end="url(#cfArrowU)"/>`;
    });
    s = s.replace(/marker-end="url\(#cfArrowU\)"\/><\/svg>/, ""); // (no-op safety)
    svg.innerHTML = s;

    readout.innerHTML = mode === "palet"
      ? "Le palet d'air hockey est soumis à son poids P et à la force de la table F<sub>table/palet</sub>, qui se compensent : le vecteur vitesse ne varie pas (mouvement rectiligne uniforme, en bas)."
      : "La boule de bowling est soumise à son poids P et à la réaction R du sol, qui se compensent : le vecteur vitesse ne varie pas (mouvement rectiligne uniforme, en bas).";
  }
  btnPalet.addEventListener("click", () => { mode = "palet"; draw(); });
  btnBowling.addEventListener("click", () => { mode = "bowling"; draw(); });
  draw();
}

/* ---------- 3. Forces qui ne se compensent pas (contraposée) ---------- */
function initNonCompensatingForces(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const cx = 110, cy = 50;
    let s = `<defs><marker id="ncArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="currentColor"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="10" fill="#f2c14e"/>`;
    s += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy + 38}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#ncArrow)" color="var(--coral)"/>`;
    s += `<text x="${cx + 10}" y="${cy + 30}" font-size="8" fill="var(--coral)">P</text>`;
    s += `<line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy - 30}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#ncArrow)" color="var(--teal)"/>`;
    s += `<text x="${cx + 10}" y="${cy - 20}" font-size="8" fill="var(--teal)">R sable</text>`;
    s += `<line x1="${cx - 10}" y1="${cy}" x2="${cx - 30}" y2="${cy}" stroke="#5a96d2" stroke-width="2.5" marker-end="url(#ncArrow)" color="#5a96d2"/>`;
    s += `<text x="${cx - 45}" y="${cy - 4}" font-size="8" fill="#5a96d2">f air</text>`;

    // positions avec v variable (mouvement pas uniforme)
    const xs = [20, 65, 120, 190];
    const lens = [15, 25, 35, 45];
    xs.forEach((x, i) => {
      s += `<circle cx="${x}" cy="150" r="3.5" fill="var(--chalk)"/>`;
      if (i < lens.length) s += `<line x1="${x + 5}" y1="150" x2="${x + 5 + lens[i]}" y2="150" stroke="var(--yellow)" stroke-width="2" marker-end="url(#ncArrow)" color="var(--yellow)"/>`;
    });
    svg.innerHTML = s;

    readout.textContent = "Le ballon de beach-volley est soumis à son poids, la réaction du sable, et la force de l'air : ces trois forces ne se compensent pas. Son vecteur vitesse varie (mouvement non uniforme, en bas — les vecteurs v grandissent d'une position à l'autre).";
  }
  draw();
}

/* ---------- 4. Chute libre ou non ---------- */
function initFreeFall(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFree = document.getElementById(cfg.btnFreeId);
  const btnNotFree = document.getElementById(cfg.btnNotFreeId);

  let mode = "free";

  function draw() {
    const cx = 110, cy = 70;
    let s = `<defs><marker id="ffArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
      <marker id="ffArrowT" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="10" fill="var(--chalk)"/>`;
    s += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy + 55}" stroke="var(--coral)" stroke-width="3" marker-end="url(#ffArrow)"/>`;
    s += `<text x="${cx + 10}" y="${cy + 40}" font-size="9" fill="var(--coral)">P</text>`;

    if (mode !== "free") {
      s += `<line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy - 45}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#ffArrowT)"/>`;
      s += `<text x="${cx + 10}" y="${cy - 30}" font-size="8" fill="var(--teal)">f<tspan baseline-shift="sub" font-size="0.7em">air/système</tspan></text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "free"
      ? "Le système n'est soumis qu'à son poids P : c'est une chute libre (par exemple dans le vide, comme dans un tube de Newton)."
      : "Le système est soumis à son poids P ET à la résistance de l'air : ce n'est pas une chute libre à proprement parler.";
  }
  btnFree.addEventListener("click", () => { mode = "free"; draw(); });
  btnNotFree.addEventListener("click", () => { mode = "notfree"; draw(); });
  draw();
}

/* ---------- 5. Variation du vecteur vitesse en chute libre (jongleur) ---------- */
function initFallVelocity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnUp = document.getElementById(cfg.btnUpId);
  const btnDown = document.getElementById(cfg.btnDownId);

  let mode = "up";

  function draw() {
    const cx = 110, cy = 90;
    let s = `<defs><marker id="fvArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
    s += `<circle cx="${cx}" cy="${cy}" r="9" fill="#e88ac9"/>`;

    if (mode === "up") {
      s += `<line x1="${cx}" y1="${cy - 12}" x2="${cx}" y2="${cy - 55}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#fvArrow)"/>`;
      s += `<text x="${cx + 12}" y="${cy - 40}" font-size="9" fill="var(--yellow)">v</text>`;
    } else {
      s += `<line x1="${cx}" y1="${cy + 12}" x2="${cx}" y2="${cy + 65}" stroke="var(--yellow)" stroke-width="3" marker-end="url(#fvArrow)"/>`;
      s += `<text x="${cx + 12}" y="${cy + 50}" font-size="9" fill="var(--yellow)">v</text>`;
    }
    svg.innerHTML = s;

    readout.textContent = mode === "up"
      ? "Lors de la montée, le vecteur vitesse est vertical vers le haut, et sa valeur diminue."
      : "Lors de la descente, le vecteur vitesse est vertical vers le bas, et sa valeur augmente.";
  }
  btnUp.addEventListener("click", () => { mode = "up"; draw(); });
  btnDown.addEventListener("click", () => { mode = "down"; draw(); });
  draw();
}
