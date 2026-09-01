/* Animations du chapitre 5 — 4ème — "Les interactions"
   Une animation par sous-partie (a à d). */

/* ---------- a. Actions et interactions (contact / distance, réciprocité) ---------- */
function initActionsAndInteractions(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnContact = document.getElementById(cfg.btnContactId);
  const btnDistance = document.getElementById(cfg.btnDistanceId);

  let mode = "contact";

  function draw() {
    const xA = 60, xB = 160, y = 75;
    let s = `<defs><marker id="aiArrowY" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
      <marker id="aiArrowT" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;

    if (mode === "contact") {
      s += `<rect x="${xA - 16}" y="${y - 10}" width="32" height="20" rx="4" fill="var(--chalk)" opacity="0.85"/>`;
      s += `<text x="${xA}" y="${y + 28}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">pied</text>`;
      s += `<circle cx="${xB}" cy="${y}" r="14" fill="var(--coral)"/>`;
      s += `<text x="${xB}" y="${y + 28}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">ballon</text>`;
    } else {
      s += `<circle cx="${xA}" cy="${y}" r="18" fill="#5a96d2"/>`;
      s += `<text x="${xA}" y="${y + 32}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Terre</text>`;
      s += `<circle cx="${xB}" cy="${y}" r="11" fill="var(--coral)"/>`;
      s += `<text x="${xB}" y="${y + 28}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">ballon</text>`;
    }
    // deux actions réciproques, opposées
    s += `<line x1="${xA + 22}" y1="${y - 15}" x2="${xB - 22}" y2="${y - 15}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#aiArrowY)"/>`;
    s += `<text x="${(xA + xB) / 2}" y="${y - 22}" font-size="7.5" fill="var(--yellow)" text-anchor="middle">action de A sur B</text>`;
    s += `<line x1="${xB - 22}" y1="${y + 15}" x2="${xA + 22}" y2="${y + 15}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#aiArrowT)"/>`;
    s += `<text x="${(xA + xB) / 2}" y="${y + 30}" font-size="7.5" fill="var(--teal)" text-anchor="middle">action opposée de B sur A</text>`;

    svg.innerHTML = s;

    readout.innerHTML = mode === "contact"
      ? "Action mécanique <strong style=\"color:var(--yellow)\">de contact</strong> : le pied agit sur le ballon, et le ballon agit aussi sur le pied (action réciproque). Le pied et le ballon sont <strong>en interaction</strong>."
      : "Action mécanique <strong style=\"color:var(--yellow)\">à distance</strong> : la Terre attire le ballon, et le ballon attire aussi la Terre (action réciproque, bien plus faible). La Terre et le ballon sont <strong>en interaction</strong>.";
  }
  btnContact.addEventListener("click", () => { mode = "contact"; draw(); });
  btnDistance.addEventListener("click", () => { mode = "distance"; draw(); });
  draw();
}

/* ---------- b. Modéliser une force : localisée ou répartie ---------- */
function initForceModelling(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnLocalisee = document.getElementById(cfg.btnLocaliseeId);
  const btnRepartie = document.getElementById(cfg.btnRepartieId);

  let mode = "localisee";

  function draw() {
    let s = `<defs><marker id="fmArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5a96d2"/></marker></defs>`;

    if (mode === "localisee") {
      // ballon touché en un point précis par la volleyeuse
      s += `<circle cx="110" cy="70" r="22" fill="var(--coral)" opacity="0.8"/>`;
      s += `<text x="110" y="74" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">ballon</text>`;
      s += `<circle cx="93" cy="87" r="3" fill="var(--yellow)"/>`;
      s += `<line x1="93" y1="87" x2="55" y2="120" stroke="#5a96d2" stroke-width="2.5" marker-end="url(#fmArrow)"/>`;
      s += `<text x="60" y="135" font-size="7.5" fill="#5a96d2" text-anchor="middle">force (petite zone de contact)</text>`;
    } else {
      // livre posé sur une table, action répartie sur toute la surface de contact
      s += `<rect x="55" y="95" width="110" height="10" fill="var(--chalk-dim)"/>`;
      s += `<text x="110" y="118" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">table</text>`;
      s += `<rect x="70" y="65" width="80" height="30" fill="#c8a86a" opacity="0.85"/>`;
      s += `<text x="110" y="83" font-size="8" fill="var(--board)" text-anchor="middle" font-weight="700">livre</text>`;
      [80, 110, 140].forEach(x => {
        s += `<line x1="${x}" y1="95" x2="${x}" y2="55" stroke="#5a96d2" stroke-width="1.5" marker-end="url(#fmArrow)"/>`;
      });
      s += `<text x="110" y="45" font-size="7.5" fill="#5a96d2" text-anchor="middle">force répartie sur toute la surface de contact</text>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "localisee"
      ? "Une action mécanique est <strong style=\"color:var(--yellow)\">localisée</strong> si elle s'exerce sur une petite zone de l'objet. On la modélise par une force : une flèche caractérisée par une <strong>direction</strong> et un <strong>point d'application</strong>."
      : "Une action mécanique est <strong style=\"color:var(--yellow)\">répartie</strong> si elle s'exerce sur une surface ou tout le volume de l'objet (ex : la table sur le livre). On peut alors représenter la force résultante par une seule flèche.";
  }
  btnLocalisee.addEventListener("click", () => { mode = "localisee"; draw(); });
  btnRepartie.addEventListener("click", () => { mode = "repartie"; draw(); });
  draw();
}

/* ---------- c. L'interaction gravitationnelle ---------- */
function initGravitationalInteraction(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSysteme = document.getElementById(cfg.btnSystemeId);
  const btnTerre = document.getElementById(cfg.btnTerreId);

  let mode = "systeme";

  function draw() {
    let s = `<defs><marker id="giArrowC" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker>
      <marker id="giArrowT" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;

    if (mode === "systeme") {
      const sx = 60, sy = 75, ex = 165, ey = 75;
      s += `<circle cx="${sx}" cy="${sy}" r="20" fill="var(--yellow)"/>`;
      s += `<text x="${sx}" y="${sy + 34}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Soleil</text>`;
      s += `<circle cx="${ex}" cy="${ey}" r="9" fill="#5a96d2"/>`;
      s += `<text x="${ex}" y="${ey + 24}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Terre</text>`;
      s += `<line x1="${sx + 24}" y1="${sy - 10}" x2="${ex - 12}" y2="${ey - 10}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#giArrowC)"/>`;
      s += `<text x="${(sx + ex) / 2}" y="${sy - 16}" font-size="7.5" fill="var(--coral)" text-anchor="middle">F Soleil/Terre</text>`;
      s += `<line x1="${ex - 12}" y1="${ey + 15}" x2="${sx + 24}" y2="${sy + 15}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#giArrowT)"/>`;
      s += `<text x="${(sx + ex) / 2}" y="${sy + 30}" font-size="7.5" fill="var(--teal)" text-anchor="middle">F Terre/Soleil</text>`;
    } else {
      s += `<circle cx="110" cy="110" r="35" fill="#5a96d2"/>`;
      s += `<text x="110" y="150" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Terre</text>`;
      s += `<circle cx="110" cy="35" r="7" fill="var(--coral)"/>`;
      s += `<text x="130" y="30" font-size="8" fill="var(--chalk-dim)">objet</text>`;
      s += `<line x1="110" y1="43" x2="110" y2="70" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#giArrowC)"/>`;
      s += `<text x="150" y="58" font-size="7.5" fill="var(--coral)" text-anchor="middle">F Terre/objet</text>`;
      s += `<line x1="110" y1="70" x2="110" y2="43" stroke="var(--teal)" stroke-width="2" marker-end="url(#giArrowT)"/>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "systeme"
      ? "Dans le Système solaire, les planètes et le Soleil s'attirent mutuellement : c'est l'<strong style=\"color:var(--yellow)\">interaction gravitationnelle</strong>. Les forces F(Soleil/Terre) et F(Terre/Soleil) sont opposées (même direction, sens contraires)."
      : "Tout objet à proximité de la Terre est en interaction gravitationnelle avec elle : la Terre attire l'objet, et l'objet attire aussi (très légèrement) la Terre.";
  }
  btnSysteme.addEventListener("click", () => { mode = "systeme"; draw(); });
  btnTerre.addEventListener("click", () => { mode = "terre"; draw(); });
  draw();
}

/* ---------- d. Le poids (force de pesanteur) ---------- */
function initWeightForce(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const LOCATIONS = {
    terre: { label: "Terre", g: 9.8 },
    lune: { label: "Lune", g: 1.6 },
    mars: { label: "Mars", g: 3.7 }
  };
  const keys = ["terre", "lune", "mars"];
  let current = "terre";

  function draw() {
    const m = Number(mRange.value);
    const g = LOCATIONS[current].g;
    const P = m * g;

    const x0 = 110, y0 = 20, maxLen = 100;
    const len = Math.min(maxLen, (P / 800) * maxLen);
    let s = `<defs><marker id="wfArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;
    s += `<circle cx="${x0}" cy="${y0}" r="11" fill="var(--chalk)"/>`;
    s += `<line x1="${x0}" y1="${y0 + 11}" x2="${x0}" y2="${y0 + 11 + len}" stroke="var(--coral)" stroke-width="3" marker-end="url(#wfArrow)"/>`;
    s += `<text x="${x0 + 14}" y="${y0 + 11 + len / 2}" font-size="10" fill="var(--coral)">P</text>`;
    s += `<text x="${x0}" y="${y0 - 16}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">objet</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Sur ${LOCATIONS[current].label} (g = ${g} N/kg) : P = m × g = ${m} × ${g} = <strong style="color:var(--yellow)">${P.toFixed(0)} N</strong>.<br>Direction : verticale du lieu. Sens : vers le centre de la Terre (ou de l'astre). Point d'application : le centre de l'objet.`;
  }
  mRange.addEventListener("input", draw);
  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}
