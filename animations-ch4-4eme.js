/* Animations du chapitre 4 — 4ème — "Les mouvements"
   Une animation par sous-partie (a à d). */

/* ---------- a. La relativité du mouvement ---------- */
function initRelativityOfMotion(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSol = document.getElementById(cfg.btnSolId);
  const btnParachutisteId = document.getElementById(cfg.btnParachutisteId);

  let mode = "sol";

  function draw() {
    let s = "";
    if (mode === "sol") {
      // le sol, fixe, en bas
      s += `<line x1="10" y1="140" x2="210" y2="140" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<text x="110" y="152" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">référentiel SOL</text>`;
      // parachutiste B, en train de "descendre" par rapport au sol
      s += `<circle cx="110" cy="55" r="9" fill="#5a96d2"/>`;
      s += `<text x="110" y="40" font-size="8" fill="#5a96d2" text-anchor="middle">B</text>`;
      // parachutiste A, plus bas (même vitesse de chute que B, mais représenté à une autre position)
      s += `<circle cx="110" cy="95" r="9" fill="var(--coral)"/>`;
      s += `<text x="110" y="112" font-size="8" fill="var(--coral)" text-anchor="middle">A</text>`;
      s += `<line x1="110" y1="66" x2="110" y2="84" stroke="var(--yellow)" stroke-width="2" marker-end="url(#arrowRel)"/>`;
      s += `<defs><marker id="arrowRel" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--yellow)"/></marker></defs>`;
    } else {
      // référentiel parachutiste B : B reste au centre, immobile
      s += `<circle cx="110" cy="75" r="9" fill="#5a96d2"/>`;
      s += `<text x="110" y="60" font-size="8" fill="#5a96d2" text-anchor="middle">B (immobile ici)</text>`;
      // A reste à la même position relative (aucun mouvement dans ce référentiel)
      s += `<circle cx="110" cy="110" r="9" fill="var(--coral)"/>`;
      s += `<text x="110" y="127" font-size="8" fill="var(--coral)" text-anchor="middle">A</text>`;
      s += `<text x="110" y="30" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">référentiel PARACHUTISTE B</text>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "sol"
      ? "Dans le référentiel <strong style=\"color:var(--yellow)\">sol</strong> : le parachutiste A est <strong>en mouvement</strong> (il se rapproche du sol au cours du temps)."
      : "Dans le référentiel <strong style=\"color:var(--yellow)\">parachutiste B</strong> : le parachutiste A reste à la même position relative — il est <strong>immobile</strong> par rapport à B. Le mouvement d'un objet est relatif : sa description dépend du référentiel choisi.";
  }
  btnSol.addEventListener("click", () => { mode = "sol"; draw(); });
  btnParachutisteId.addEventListener("click", () => { mode = "parachutiste"; draw(); });
  draw();
}

/* ---------- b. Les trajectoires ---------- */
function initTrajectoryShapes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const SHAPES = {
    rectiligne: {
      name: "Rectiligne", color: "var(--teal)",
      path: "M25,130 L195,130",
      points: [[25, 130], [67, 130], [110, 130], [152, 130], [195, 130]],
      desc: "La trajectoire est une portion de droite : le mouvement est rectiligne."
    },
    circulaire: {
      name: "Circulaire", color: "var(--coral)",
      path: "M65,130 A45,45 0 1,1 155,130 A45,45 0 1,1 65,130",
      points: [0, 0.25, 0.5, 0.75].map(t => {
        const a = t * 2 * Math.PI;
        return [110 + 45 * Math.cos(a), 85 + 45 * Math.sin(a)];
      }),
      desc: "La trajectoire est un cercle (ou une portion de cercle) : le mouvement est circulaire."
    },
    curviligne: {
      name: "Curviligne", color: "var(--yellow)",
      path: "M20,140 Q70,20 110,100 T205,50",
      points: [[20, 140], [65, 70], [110, 100], [160, 70], [205, 50]],
      desc: "La trajectoire est une portion de courbe (ni droite, ni cercle) : le mouvement est curviligne."
    }
  };
  const keys = ["rectiligne", "circulaire", "curviligne"];
  let current = "rectiligne";

  function draw() {
    const sh = SHAPES[current];
    let s = `<path d="${sh.path}" fill="none" stroke="${sh.color}" stroke-width="2.5"/>`;
    sh.points.forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="4" fill="${sh.color}"/>`;
    });
    svg.innerHTML = s;

    readout.innerHTML = `<strong style="color:${sh.color}">Mouvement ${sh.name.toLowerCase()}</strong> — ${sh.desc}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- c. La vitesse : valeur, direction et sens ---------- */
function initSpeedValueAndDirection(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const tRange = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnRectiligne = document.getElementById(cfg.btnRectiligneId);
  const btnNonRectiligne = document.getElementById(cfg.btnNonRectiligneId);

  let mode = "rectiligne";

  function draw() {
    const d = Number(dRange.value);
    const t = Number(tRange.value);
    const v = t > 0 ? d / t : 0;

    let s = "";
    if (mode === "rectiligne") {
      const x0 = 20, x1 = 200, y = 90;
      s += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<circle cx="${x0}" cy="${y}" r="4" fill="var(--chalk)"/>`;
      s += `<circle cx="${x1}" cy="${y}" r="4" fill="var(--chalk)"/>`;
      s += `<text x="${x0}" y="${y + 18}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">A</text>`;
      s += `<text x="${x1}" y="${y + 18}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">B</text>`;
      s += `<defs><marker id="spArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker></defs>`;
      s += `<line x1="${x0 + 10}" y1="${y - 25}" x2="${x1 - 10}" y2="${y - 25}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#spArrow)"/>`;
      s += `<text x="${(x0 + x1) / 2}" y="${y - 32}" font-size="8" fill="var(--yellow)" text-anchor="middle">sens du mouvement (de A vers B)</text>`;
    } else {
      // grande roue : nacelle avec direction qui change
      const cx = 110, cy = 85, r = 45;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<defs><marker id="spArrowNR" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;
      [0, 60, 120, 180, 240, 300].forEach(deg => {
        const a = (deg * Math.PI) / 180;
        const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
        const tanA = a + Math.PI / 2; // direction tangente (sens horaire)
        const dx = px + 16 * Math.cos(tanA), dy = py + 16 * Math.sin(tanA);
        s += `<circle cx="${px}" cy="${py}" r="4" fill="var(--chalk)"/>`;
        s += `<line x1="${px}" y1="${py}" x2="${dx}" y2="${dy}" stroke="var(--coral)" stroke-width="2" marker-end="url(#spArrowNR)"/>`;
      });
      s += `<text x="${cx}" y="15" font-size="8" fill="var(--coral)" text-anchor="middle">la direction change à chaque instant (sens horaire)</text>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = `v = d/t = ${d} / ${t} = <strong style="color:var(--yellow)">${v.toFixed(1)} m/s</strong>.<br>${mode === "rectiligne"
        ? "Trajectoire rectiligne : la direction de la vitesse est la droite (AB), constante ; le sens va de A vers B."
        : "Trajectoire non rectiligne : la direction de la vitesse change au cours du temps (ici, sens des aiguilles d'une montre)."
      }`;
  }
  dRange.addEventListener("input", draw);
  tRange.addEventListener("input", draw);
  btnRectiligne.addEventListener("click", () => { mode = "rectiligne"; draw(); });
  btnNonRectiligne.addEventListener("click", () => { mode = "nonrectiligne"; draw(); });
  draw();
}

/* ---------- d. Les mouvements : accéléré, décéléré, uniforme ---------- */
function initMotionType(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnAccel = document.getElementById(cfg.btnAccelId);
  const btnDecel = document.getElementById(cfg.btnDecelId);
  const btnUniform = document.getElementById(cfg.btnUniformId);

  let mode = "accel";

  function draw() {
    const y = 75;
    let xs;
    if (mode === "accel") xs = [20, 34, 55, 85, 130, 195];
    else if (mode === "decel") xs = [20, 85, 130, 160, 181, 195];
    else xs = [20, 55, 90, 125, 160, 195];

    let s = `<line x1="10" y1="${y + 15}" x2="205" y2="${y + 15}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    xs.forEach((x, i) => {
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--coral)"/>`;
    });
    svg.innerHTML = s;

    const texts = {
      accel: "La distance entre les positions augmente : la valeur de la vitesse augmente. Le mouvement est <strong style=\"color:var(--yellow)\">accéléré</strong>.",
      decel: "La distance entre les positions diminue : la valeur de la vitesse diminue. Le mouvement est <strong style=\"color:var(--yellow)\">décéléré (ou ralenti)</strong>.",
      uniform: "La distance entre les positions est constante : la valeur de la vitesse est constante. Le mouvement est <strong style=\"color:var(--yellow)\">uniforme</strong>."
    };
    readout.innerHTML = `${texts[mode]} (même durée entre deux positions consécutives)`;
  }
  btnAccel.addEventListener("click", () => { mode = "accel"; draw(); });
  btnDecel.addEventListener("click", () => { mode = "decel"; draw(); });
  btnUniform.addEventListener("click", () => { mode = "uniform"; draw(); });
  draw();
}
