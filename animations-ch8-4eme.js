/* Animations du chapitre 8 — 4ème — "Les signaux lumineux et les signaux sonores"
   Une animation par sous-partie (a à f). */

/* ---------- a. Sources de lumière et vision des objets ---------- */
function initLightSourcesAndVision(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnPrimaire = document.getElementById(cfg.btnPrimaireId);
  const btnDiffusant = document.getElementById(cfg.btnDiffusantId);

  let mode = "primaire";

  function draw() {
    let s = `<defs><marker id="lsArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--yellow)"/></marker></defs>`;
    // œil, à droite
    s += `<path d="M175,60 Q195,50 210,60 Q195,70 175,60 Z" fill="none" stroke="var(--chalk)" stroke-width="1.5"/>`;
    s += `<circle cx="192" cy="60" r="3" fill="var(--chalk)"/>`;

    if (mode === "primaire") {
      s += `<circle cx="45" cy="60" r="12" fill="var(--yellow)"/>`;
      s += `<text x="45" y="90" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">réverbère (source primaire)</text>`;
      [-20, -10, 0, 10, 20].forEach(dy => {
        s += `<line x1="55" y1="${60 + dy * 0.3}" x2="170" y2="60" stroke="var(--yellow)" stroke-width="1.3" opacity="0.6" marker-end="url(#lsArrow)"/>`;
      });
    } else {
      s += `<circle cx="20" cy="30" r="8" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<text x="20" y="20" font-size="7" fill="var(--chalk-dim)" text-anchor="middle">Soleil</text>`;
      s += `<circle cx="90" cy="60" r="10" fill="#c8c8c8"/>`;
      s += `<text x="90" y="90" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Lune (objet diffusant)</text>`;
      s += `<line x1="28" y1="35" x2="83" y2="55" stroke="var(--yellow)" stroke-width="1.5" marker-end="url(#lsArrow)"/>`;
      [-15, 0, 15].forEach(dy => {
        s += `<line x1="98" y1="${60 + dy * 0.5}" x2="170" y2="60" stroke="var(--yellow)" stroke-width="1.3" opacity="0.7" marker-end="url(#lsArrow)"/>`;
      });
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "primaire"
      ? "Une <strong style=\"color:var(--yellow)\">source primaire</strong> (comme un réverbère allumé) émet sa propre lumière. Voir un objet, c'est recevoir dans les yeux de la lumière provenant de cet objet."
      : "Un <strong style=\"color:var(--yellow)\">objet diffusant</strong> (comme la Lune) ne produit pas sa propre lumière : il renvoie dans toutes les directions une partie de la lumière qu'il reçoit (ici, celle du Soleil).";
  }
  btnPrimaire.addEventListener("click", () => { mode = "primaire"; draw(); });
  btnDiffusant.addEventListener("click", () => { mode = "diffusant"; draw(); });
  draw();
}

/* ---------- b. Propagation de la lumière et année-lumière ---------- */
function initLightPropagation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    const d = Number(dRange.value); // distance en années-lumière

    let s = `<defs><marker id="lpArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;
    s += `<rect x="15" y="45" width="20" height="30" rx="3" fill="var(--chalk)"/>`;
    s += `<text x="25" y="88" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">lampe</text>`;
    s += `<line x1="35" y1="60" x2="195" y2="60" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#lpArrow)"/>`;
    s += `<text x="115" y="50" font-size="8" fill="var(--coral)" text-anchor="middle">rayon lumineux (propagation rectiligne)</text>`;
    s += `<circle cx="200" cy="60" r="8" fill="var(--yellow)"/>`;
    s += `<text x="200" y="88" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">étoile</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `La lumière se propage en <strong style="color:var(--coral)">ligne droite</strong> dans un milieu transparent (propagation rectiligne), modélisée par un rayon lumineux (demi-droite fléchée).<br>L'<strong style="color:var(--yellow)">année-lumière (al)</strong> est la distance parcourue par la lumière en un an. Pour une étoile à ${d} années-lumière, sa lumière met <strong style="color:var(--yellow)">${d} an${d > 1 ? "s" : ""}</strong> à nous parvenir (exemple : Proxima du Centaure, à 4 al).`;
  }
  dRange.addEventListener("input", draw);
  draw();
}

/* ---------- c. Rayonnements visibles et invisibles ---------- */
function initRadiationTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const TYPES = {
    visible: { label: "Lumière visible", color: "var(--yellow)", desc: "Visible par l'œil humain : c'est la lumière du quotidien." },
    ir: { label: "Infrarouge (IR)", color: "var(--coral)", desc: "Invisible par l'œil humain. Exemple : une télécommande utilise des rayonnements IR." },
    uv: { label: "Ultraviolet (UV)", color: "#a86adf", desc: "Invisible par l'œil humain. Exemple : une lampe UV permet de détecter des traces de sang." }
  };
  const keys = ["visible", "ir", "uv"];
  let current = "visible";

  function draw() {
    const t = TYPES[current];
    let s = `<rect x="20" y="50" width="180" height="18" rx="4" fill="${t.color}" opacity="0.7"/>`;
    s += `<text x="110" y="63" font-size="9" fill="var(--board)" text-anchor="middle" font-weight="700">${t.label}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `<strong style="color:${t.color}">${t.label}</strong> — ${t.desc}${current !== "visible" ? " Une exposition prolongée à certains de ces rayonnements est dangereuse pour l'Homme." : ""}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- d. Signaux sonores : propagation et vitesse ---------- */
function initSoundPropagation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dRange = document.getElementById(cfg.dRangeId);
  const tRange = document.getElementById(cfg.tRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnMilieu = document.getElementById(cfg.btnMilieuId);
  const btnVide = document.getElementById(cfg.btnVideId);

  let mode = "milieu";

  function draw() {
    let s = "";
    if (mode === "milieu") {
      const d = Number(dRange.value);
      const t = Number(tRange.value);
      const v = t > 0 ? d / t : 0;
      s += `<text x="30" y="55" font-size="18" text-anchor="middle">🔔</text>`;
      for (let i = 0; i < 3; i++) s += `<path d="M${45 + i * 15},40 Q${55 + i * 15},60 ${45 + i * 15},80" fill="none" stroke="var(--teal)" stroke-width="1.5" opacity="${0.8 - i * 0.2}"/>`;
      s += `<text x="150" y="55" font-size="18" text-anchor="middle">👂</text>`;
      s += `<text x="110" y="95" font-size="8" fill="var(--teal)" text-anchor="middle">air (milieu matériel gazeux)</text>`;
      svg.innerHTML = s;
      readout.innerHTML = `Un signal sonore est une <strong style="color:var(--teal)">vibration</strong> qui a besoin d'un milieu matériel (gazeux, liquide ou solide) pour se propager.<br>v = d/t = ${d} / ${t} = <strong style="color:var(--yellow)">${v.toFixed(0)} m/s</strong>`;
    } else {
      s += `<text x="30" y="55" font-size="18" text-anchor="middle">🔔</text>`;
      s += `<text x="150" y="55" font-size="18" text-anchor="middle">🧑‍🚀</text>`;
      s += `<line x1="40" y1="55" x2="130" y2="55" stroke="var(--coral)" stroke-width="2"/>`;
      s += `<line x1="35" y1="35" x2="145" y2="75" stroke="var(--coral)" stroke-width="2.5"/>`;
      s += `<text x="90" y="95" font-size="8" fill="var(--coral)" text-anchor="middle">le vide (aucun milieu matériel)</text>`;
      svg.innerHTML = s;
      readout.innerHTML = "Le son ne se propage <strong style=\"color:var(--coral)\">pas dans le vide</strong> : un astronaute dans l'espace n'entend pas le son de ses instruments, faute de milieu matériel pour transporter la vibration.";
    }
  }
  dRange.addEventListener("input", draw);
  tRange.addEventListener("input", draw);
  btnMilieu.addEventListener("click", () => { mode = "milieu"; draw(); });
  btnVide.addEventListener("click", () => { mode = "vide"; draw(); });
  draw();
}

/* ---------- e. La fréquence et les sons audibles ---------- */
function initSoundFrequency(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const fRange = document.getElementById(cfg.fRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const F_MIN = 20, F_MAX = 20000;

  function draw() {
    const f = Number(fRange.value);
    const x0 = 20, x1 = 200, y = 60;
    const logMin = Math.log10(F_MIN), logMax = Math.log10(F_MAX);
    const pos = (Math.log10(f) - logMin) / (logMax - logMin);
    const px = x0 + pos * (x1 - x0);

    let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--teal)" stroke-width="4"/>`;
    s += `<text x="${x0}" y="${y + 20}" font-size="8" fill="var(--chalk-dim)" text-anchor="start">graves</text>`;
    s += `<text x="${x1}" y="${y + 20}" font-size="8" fill="var(--chalk-dim)" text-anchor="end">aigus</text>`;
    s += `<circle cx="${px}" cy="${y}" r="7" fill="var(--yellow)" stroke="var(--board)" stroke-width="2"/>`;
    s += `<text x="${px}" y="${y - 14}" font-size="9" fill="var(--yellow)" text-anchor="middle" font-weight="700">${f} Hz</text>`;
    svg.innerHTML = s;

    const nature = f < 500 ? "grave" : f > 4000 ? "aigu" : "moyen";
    readout.innerHTML = `La <strong style="color:var(--yellow)">fréquence</strong> est le nombre de fois par seconde que la vibration se reproduit, en <strong>hertz (Hz)</strong>. Un son de ${f} Hz est plutôt <strong style="color:var(--teal)">${nature}</strong>. La fréquence des sons graves est plus faible que celle des sons aigus.`;
  }
  fRange.addEventListener("input", draw);
  draw();
}

/* ---------- f. La transmission d'informations ---------- */
function initInformationTransmission(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSon = document.getElementById(cfg.btnSonId);
  const btnLumiere = document.getElementById(cfg.btnLumiereId);

  let mode = "son";

  function draw() {
    let s = `<defs><marker id="itArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chalk-dim)"/></marker></defs>`;
    s += `<rect x="10" y="30" width="45" height="35" rx="4" fill="rgba(90,150,210,0.25)" stroke="#5a96d2" stroke-width="1.5"/>`;
    s += `<text x="32" y="50" font-size="8" fill="#5a96d2" text-anchor="middle">Émetteur</text>`;
    s += `<line x1="55" y1="47" x2="80" y2="47" stroke="var(--chalk-dim)" stroke-width="2" marker-end="url(#itArrow)"/>`;
    s += `<text x="67" y="38" font-size="7" fill="var(--chalk-dim)" text-anchor="middle">${mode === "son" ? "son" : "lumière"}</text>`;
    s += `<rect x="80" y="30" width="45" height="35" rx="4" fill="rgba(232,196,104,0.2)" stroke="var(--yellow)" stroke-width="1.5"/>`;
    s += `<text x="102" y="45" font-size="7.5" fill="var(--yellow)" text-anchor="middle">Milieu de</text>`;
    s += `<text x="102" y="55" font-size="7.5" fill="var(--yellow)" text-anchor="middle">transmission</text>`;
    s += `<line x1="125" y1="47" x2="150" y2="47" stroke="var(--chalk-dim)" stroke-width="2" marker-end="url(#itArrow)"/>`;
    s += `<rect x="150" y="30" width="45" height="35" rx="4" fill="rgba(107,191,171,0.25)" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<text x="172" y="50" font-size="8" fill="var(--teal)" text-anchor="middle">Récepteur</text>`;
    svg.innerHTML = s;

    readout.innerHTML = mode === "son"
      ? "L'information est transmise depuis un émetteur vers un récepteur par un signal <strong style=\"color:var(--yellow)\">sonore</strong>. Sans multiplier les intermédiaires, cette transmission ne peut pas se faire sur de longues distances."
      : "Une onde comme la <strong style=\"color:var(--yellow)\">lumière</strong> permet de transmettre une information sur de longues distances, et beaucoup plus rapidement que le son (exemple : ondes radio d'un téléphone).";
  }
  btnSon.addEventListener("click", () => { mode = "son"; draw(); });
  btnLumiere.addEventListener("click", () => { mode = "lumiere"; draw(); });
  draw();
}
