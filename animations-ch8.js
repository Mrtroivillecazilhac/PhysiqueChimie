/* Animations du chapitre 15 — 1ère spé PC */

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

