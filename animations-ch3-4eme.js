/* Animations du chapitre 3 — 4ème — "Organisation de la matière dans l'Univers"
   Une animation par sous-partie (a à e). */

/* ---------- a. La Terre : rotation et révolution ---------- */
function initEarthMotion(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnRotation = document.getElementById(cfg.btnRotationId);
  const btnRevolution = document.getElementById(cfg.btnRevolutionId);
  const timeRange = document.getElementById(cfg.timeRangeId);

  let mode = "rotation";

  function draw() {
    const t = Number(timeRange.value) / 100; // 0 à 1

    let s = "";
    if (mode === "rotation") {
      const cx = 110, cy = 75, r = 35;
      const angle = t * 2 * Math.PI;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#5a96d2" opacity="0.85"/>`;
      s += `<line x1="${cx}" y1="${cy - r - 10}" x2="${cx}" y2="${cy + r + 10}" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
      const mx = cx + r * Math.sin(angle), my = cy - r * Math.cos(angle) * 0.3;
      s += `<circle cx="${mx}" cy="${cy}" r="4" fill="var(--yellow)"/>`;
      s += `<text x="${cx}" y="${cy + r + 28}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">rotation sur elle-même</text>`;
      readout.innerHTML = `La Terre tourne sur elle-même en <strong style="color:var(--yellow)">24 h</strong> (période de rotation). Heure simulée : <strong style="color:var(--yellow)">${(t * 24).toFixed(1)} h</strong>.`;
    } else {
      const cx = 110, cy = 90, r = 55;
      const angle = t * 2 * Math.PI;
      s += `<circle cx="${cx}" cy="${cy}" r="10" fill="var(--yellow)"/>`;
      s += `<text x="${cx}" y="${cy - 16}" font-size="8" fill="var(--yellow)" text-anchor="middle">Soleil</text>`;
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5" stroke-dasharray="3,2"/>`;
      const ex = cx + r * Math.cos(angle), ey = cy + r * Math.sin(angle);
      s += `<circle cx="${ex}" cy="${ey}" r="6" fill="#5a96d2"/>`;
      s += `<text x="${(cx + ex) / 2 + 10}" y="${(cy + ey) / 2 - 6}" font-size="7.5" fill="var(--chalk-dim)">150 000 000 km</text>`;
      readout.innerHTML = `La Terre tourne autour du Soleil en <strong style="color:var(--yellow)">1 an</strong> (période de révolution), sur une orbite quasi circulaire, à environ 150 000 000 km du Soleil. Jour simulé : <strong style="color:var(--yellow)">${(t * 365).toFixed(0)} / 365</strong>.`;
    }
    svg.innerHTML = s;
  }

  btnRotation.addEventListener("click", () => { mode = "rotation"; draw(); });
  btnRevolution.addEventListener("click", () => { mode = "revolution"; draw(); });
  timeRange.addEventListener("input", draw);
  draw();
}

/* ---------- b. La Lune : révolution, rotation et phases ---------- */
function initMoonPhases(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const angleRange = document.getElementById(cfg.angleRangeId);

  const PHASES = [
    { max: 22.5, name: "Nouvelle lune" },
    { max: 67.5, name: "Premier croissant" },
    { max: 112.5, name: "Premier quartier" },
    { max: 157.5, name: "Lune gibbeuse croissante" },
    { max: 202.5, name: "Pleine lune" },
    { max: 247.5, name: "Lune gibbeuse décroissante" },
    { max: 292.5, name: "Dernier quartier" },
    { max: 337.5, name: "Dernier croissant" },
    { max: 361, name: "Nouvelle lune" }
  ];
  function phaseName(angle) {
    for (const p of PHASES) if (angle <= p.max) return p.name;
    return "Nouvelle lune";
  }

  function moonDisc(cx, cy, r, angleDeg, uid) {
    const rad = (angleDeg * Math.PI) / 180;
    const delta = r * (1 + Math.cos(rad));
    const dir = angleDeg <= 180 ? 1 : -1;
    const bx = cx + dir * delta;
    const clipId = "moonclip-" + uid;
    let s = `<clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`;
    s += `<g clip-path="url(#${clipId})">`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3a3f4a"/>`;
    s += `<circle cx="${bx}" cy="${cy}" r="${r}" fill="#e8e4d8"/>`;
    s += `</g>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    return s;
  }

  function draw() {
    const angle = Number(angleRange.value);
    const rad = (angle * Math.PI) / 180;

    // vue de dessus : Terre au centre, Lune en orbite, Soleil fixe à droite
    const cx = 60, cy = 60, orbitR = 42;
    let s = `<text x="${cx}" y="14" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">vue de dessus</text>`;
    s += `<line x1="${cx + orbitR + 8}" y1="${cy}" x2="${cx + orbitR + 30}" y2="${cy}" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<text x="${cx + orbitR + 34}" y="${cy + 3}" font-size="14" text-anchor="start">☀️</text>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${orbitR}" fill="none" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="10" fill="#5a96d2"/>`;

    const mx = cx + orbitR * Math.cos(rad), my = cy + orbitR * Math.sin(rad);
    // demi-lune éclairée (toujours le côté qui fait face au Soleil, à droite)
    s += `<clipPath id="topmoonclip"><circle cx="${mx}" cy="${my}" r="7"/></clipPath>`;
    s += `<g clip-path="url(#topmoonclip)">`;
    s += `<rect x="${mx - 8}" y="${my - 8}" width="8" height="16" fill="#3a3f4a"/>`;
    s += `<rect x="${mx}" y="${my - 8}" width="8" height="16" fill="#e8e4d8"/>`;
    s += `</g>`;
    s += `<circle cx="${mx}" cy="${my}" r="7" fill="none" stroke="var(--chalk-dim)" stroke-width="1"/>`;
    // repère fixe sur la Lune, toujours tourné vers la Terre (rotation = révolution)
    const faceX = mx + 3.5 * Math.cos(rad + Math.PI), faceY = my + 3.5 * Math.sin(rad + Math.PI);
    s += `<circle cx="${faceX}" cy="${faceY}" r="1.3" fill="var(--coral)"/>`;

    // vue depuis la Terre (à droite)
    const vcx = 165, vcy = 60, vr = 34;
    s += `<text x="${vcx}" y="14" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">vue depuis la Terre</text>`;
    s += moonDisc(vcx, vcy, vr, angle, "b");

    svg.innerHTML = s;

    const name = phaseName(angle);
    readout.innerHTML = `Position sur l'orbite : ${angle}°. Vue depuis la Terre : <strong style="color:var(--yellow)">${name}</strong>.<br>Le repère rouge sur la Lune (vue de dessus) reste toujours tourné vers la Terre : sa <strong>période de rotation est égale à sa période de révolution</strong> (≈ 1 mois), on ne voit donc toujours que la même face.`;
  }
  angleRange.addEventListener("input", draw);
  draw();
}

/* ---------- c. Le Système solaire ---------- */
function initSolarSystem(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const PLANETS = [
    { name: "Mercure", color: "#a9a29a", r: 4, fact: "La planète la plus proche du Soleil." },
    { name: "Vénus", color: "#e0c087", r: 6, fact: "La planète la plus chaude du Système solaire." },
    { name: "Terre", color: "#5a96d2", r: 6, fact: "La seule planète connue avec de la vie." },
    { name: "Mars", color: "#c1603c", r: 5, fact: "La « planète rouge », à cause de l'oxyde de fer à sa surface." },
    { name: "Jupiter", color: "#d8b892", r: 16, fact: "La plus grosse planète du Système solaire." },
    { name: "Saturne", color: "#e8d0a0", r: 14, fact: "Célèbre pour ses anneaux, formés de glace et de roche." },
    { name: "Uranus", color: "#a8d8e0", r: 9, fact: "Tourne presque « couchée » sur son orbite." },
    { name: "Neptune", color: "#6a8fd0", r: 9, fact: "La planète la plus éloignée du Soleil." }
  ];

  let step = 1;
  function render() {
    const p = PLANETS[step - 1];
    const cx = 110, cy = 60;
    let s = `<circle cx="${cx}" cy="${cy}" r="${p.r}" fill="${p.color}"/>`;
    if (p.name === "Saturne") s += `<ellipse cx="${cx}" cy="${cy}" rx="${p.r + 12}" ry="4" fill="none" stroke="${p.color}" stroke-width="2" opacity="0.8"/>`;
    s += `<text x="${cx}" y="${cy + p.r + 20}" font-size="10" fill="var(--yellow)" text-anchor="middle" font-weight="700">${p.name}</text>`;
    svg.innerHTML = s;

    explainEl.innerHTML = `<strong style="color:var(--yellow)">${step}ᵉ planète en partant du Soleil : ${p.name}</strong> — ${p.fact}`;
    stepEl.textContent = `${step} / 8`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 8;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 8) { step++; render(); } });
  render();
}

/* ---------- d. L'Univers : des échelles emboîtées ---------- */
function initUniverseScales(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const SCALES = {
    systeme: {
      label: "Système solaire",
      desc: "Le Soleil et tous les objets célestes qui gravitent autour de lui : planètes, comètes, astéroïdes. Formé il y a environ 4,6 milliards d'années.",
      draw() {
        let s = `<circle cx="110" cy="60" r="8" fill="var(--yellow)"/>`;
        [22, 32, 42, 52].forEach((r, i) => {
          s += `<circle cx="110" cy="60" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
          const a = i * 1.3;
          s += `<circle cx="${110 + r * Math.cos(a)}" cy="${60 + r * Math.sin(a)}" r="3.5" fill="#5a96d2"/>`;
        });
        return s;
      }
    },
    galaxie: {
      label: "Notre galaxie : la Voie lactée",
      desc: "Une galaxie est un regroupement de très nombreuses étoiles, de gaz et de poussières. Le Soleil est l'une des étoiles de la Voie lactée. Diamètre : environ 100 000 années-lumière.",
      draw() {
        let s = "";
        const POS = generateDotsInEllipse(60, 0, 0, 1, 1);
        POS.forEach(([u, v]) => {
          const dist = Math.sqrt(u * u + v * v);
          s += `<circle cx="${110 + u * 70}" cy="${60 + v * 40}" r="1.3" fill="var(--chalk)" opacity="${0.9 - dist * 0.4}"/>`;
        });
        s += `<circle cx="110" cy="60" r="5" fill="var(--yellow)"/>`;
        s += `<text x="110" y="45" font-size="7.5" fill="var(--yellow)" text-anchor="middle">Soleil</text>`;
        return s;
      }
    },
    univers: {
      label: "L'Univers",
      desc: "L'Univers est constitué d'un très grand nombre de galaxies, chacune regroupant elle-même un très grand nombre d'étoiles.",
      draw() {
        let s = "";
        const POS = generateDotsInEllipse(18, 0, 0, 1, 1);
        POS.forEach(([u, v], i) => {
          const x = 110 + u * 85, y = 60 + v * 50;
          s += `<ellipse cx="${x}" cy="${y}" rx="7" ry="3" fill="var(--teal)" opacity="0.7" transform="rotate(${i * 37} ${x} ${y})"/>`;
        });
        return s;
      }
    }
  };
  const keys = ["systeme", "galaxie", "univers"];
  let current = "systeme";

  function draw() {
    const sc = SCALES[current];
    svg.innerHTML = sc.draw();
    readout.innerHTML = `<strong style="color:var(--yellow)">${sc.label}</strong><br>${sc.desc}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- e. Les unités de distance en astronomie ---------- */
function initAstronomicalUnits(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const EXAMPLES = {
    lune: {
      label: "Terre ↔ Lune", value: "400 000 km", unit: "kilomètre (km)",
      desc: "À cette échelle, le kilomètre reste une unité pratique."
    },
    soleil: {
      label: "Terre ↔ Soleil", value: "150 000 000 km = 1 unité astronomique (1 ua)", unit: "unité astronomique (ua)",
      desc: "Le kilomètre donne un nombre à rallonge : on utilise l'unité astronomique, bien adaptée aux distances dans le Système solaire (qui s'étend sur une centaine d'ua, jusqu'à l'orbite de Neptune)."
    },
    etoile: {
      label: "Distance à une étoile lointaine", value: "10 années-lumière (al)", unit: "année-lumière (al)",
      desc: "L'année-lumière est la distance parcourue par la lumière en un an. Une étoile à 10 al signifie que sa lumière a mis 10 ans pour nous parvenir : on la voit telle qu'elle était il y a 10 ans."
    }
  };
  const keys = ["lune", "soleil", "etoile"];
  let current = "lune";

  function draw() {
    const ex = EXAMPLES[current];
    let s = `<text x="110" y="55" font-size="15" fill="var(--yellow)" text-anchor="middle" font-weight="700">${ex.value}</text>`;
    s += `<text x="110" y="80" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">unité utilisée : ${ex.unit}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `<strong style="color:var(--yellow)">${ex.label}</strong> : ${ex.desc}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}
