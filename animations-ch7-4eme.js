/* Animations du chapitre 7 — 4ème — "Circuit électrique"
   Une animation par sous-partie (a à d). */

/* ---------- a. Le circuit électrique ---------- */
function initElectricCircuit(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFerme = document.getElementById(cfg.btnFermeId);
  const btnDiode = document.getElementById(cfg.btnDiodeId);

  let mode = "ferme";

  function draw() {
    let s = "";
    if (mode === "ferme") {
      // boucle fermée : pile -> lampe -> retour
      s += `<rect x="30" y="60" width="30" height="18" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<text x="45" y="72" font-size="7" fill="var(--board)" text-anchor="middle" font-weight="700">pile</text>`;
      s += `<line x1="60" y1="65" x2="150" y2="65" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<circle cx="165" cy="65" r="16" fill="none" stroke="var(--coral)" stroke-width="2.5"/>`;
      s += `<line x1="154" y1="54" x2="176" y2="76" stroke="var(--coral)" stroke-width="2"/>`;
      s += `<line x1="176" y1="54" x2="154" y2="76" stroke="var(--coral)" stroke-width="2"/>`;
      s += `<line x1="165" y1="81" x2="165" y2="105" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="165" y1="105" x2="45" y2="105" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="45" y1="105" x2="45" y2="78" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<text x="105" y="55" font-size="8" fill="var(--yellow)" text-anchor="middle">transfert d'énergie électrique</text>`;
      s += `<circle cx="45" cy="65" r="2" fill="var(--yellow)"/><circle cx="105" cy="65" r="2" fill="var(--yellow)"/><circle cx="165" cy="100" r="2" fill="var(--yellow)"/>`;
    } else {
      // sens de branchement d'une diode : bascule sens correct/incorrect
      s += `<rect x="30" y="60" width="30" height="18" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<text x="45" y="72" font-size="7" fill="var(--board)" text-anchor="middle" font-weight="700">pile</text>`;
      s += `<line x1="60" y1="65" x2="90" y2="65" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<polygon points="90,58 110,65 90,72" fill="var(--teal)"/>`;
      s += `<line x1="110" y1="58" x2="110" y2="72" stroke="var(--teal)" stroke-width="2.5"/>`;
      s += `<text x="100" y="48" font-size="7.5" fill="var(--teal)" text-anchor="middle">diode</text>`;
      s += `<line x1="110" y1="65" x2="150" y2="65" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      const litUp = diodeState === "correct";
      s += `<circle cx="165" cy="65" r="16" fill="none" stroke="${litUp ? 'var(--coral)' : 'var(--chalk-dim)'}" stroke-width="2.5"/>`;
      if (litUp) s += `<circle cx="165" cy="65" r="10" fill="var(--coral)" opacity="0.4"/>`;
      s += `<line x1="165" y1="81" x2="165" y2="105" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="165" y1="105" x2="45" y2="105" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="45" y1="105" x2="45" y2="78" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    }
    svg.innerHTML = s;

    readout.innerHTML = mode === "ferme"
      ? "Un circuit électrique permet le transfert de l'énergie électrique issue d'un générateur vers un récepteur. Il doit former une <strong style=\"color:var(--yellow)\">boucle fermée</strong>, constituée d'une suite ininterrompue de conducteurs."
      : diodeState === "correct"
        ? "Sens <strong style=\"color:var(--teal)\">correct</strong> : la diode laisse passer le courant, la lampe s'allume."
        : "Sens <strong style=\"color:var(--coral)\">incorrect</strong> : certains dipôles (diode, DEL) ont un sens de branchement ; dans l'autre sens, ils ne laissent pas passer le courant. La lampe reste éteinte.";
  }

  let diodeState = "correct";
  btnFerme.addEventListener("click", () => { mode = "ferme"; draw(); });
  btnDiode.addEventListener("click", () => { mode = "diode"; diodeState = diodeState === "correct" ? "incorrect" : "correct"; draw(); });
  draw();
}

/* ---------- b. Les différents types de circuit ---------- */
function initCircuitTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSerie = document.getElementById(cfg.btnSerieId);
  const btnDerivation = document.getElementById(cfg.btnDerivationId);
  const btnCasser = document.getElementById(cfg.btnCasserId);

  let mode = "serie";
  let broken = false;

  function lampIcon(cx, cy, lit) {
    return `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="${lit ? 'var(--coral)' : 'var(--chalk-dim)'}" stroke-width="2"/>${lit ? `<circle cx="${cx}" cy="${cy}" r="7" fill="var(--coral)" opacity="0.4"/>` : ""}`;
  }

  function draw() {
    let s = "";
    if (mode === "serie") {
      s += `<rect x="15" y="55" width="26" height="16" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<line x1="41" y1="63" x2="90" y2="63" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += lampIcon(105, 63, !broken);
      s += `<line x1="117" y1="63" x2="150" y2="63" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += lampIcon(165, 63, !broken);
      s += `<line x1="165" y1="75" x2="165" y2="100" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="165" y1="100" x2="28" y2="100" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="28" y1="100" x2="28" y2="71" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      if (broken) s += `<line x1="97" y1="55" x2="113" y2="71" stroke="var(--coral)" stroke-width="2.5"/>`;
    } else {
      s += `<rect x="15" y="65" width="26" height="16" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<line x1="41" y1="73" x2="60" y2="73" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="60" y1="35" x2="60" y2="110" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="60" y1="45" x2="95" y2="45" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += lampIcon(110, 45, !broken);
      s += `<line x1="122" y1="45" x2="150" y2="45" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="150" y1="35" x2="150" y2="110" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="60" y1="100" x2="95" y2="100" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += lampIcon(110, 100, true);
      s += `<line x1="122" y1="100" x2="150" y2="100" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="150" y1="73" x2="165" y2="73" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="165" y1="73" x2="165" y2="73" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      if (broken) s += `<line x1="102" y1="37" x2="118" y2="53" stroke="var(--coral)" stroke-width="2.5"/>`;
    }
    svg.innerHTML = s;

    if (!broken) {
      readout.innerHTML = mode === "serie"
        ? "Dipôles associés en série, sur une seule boucle : les deux lampes sont allumées."
        : "Dipôles associés en dérivation, sur plusieurs boucles : les deux lampes sont allumées, chacune sur sa propre boucle.";
    } else {
      readout.innerHTML = mode === "serie"
        ? "Une lampe grillée <strong style=\"color:var(--coral)\">ouvre la boucle</strong> : le courant ne circule plus du tout, <strong>les deux lampes s'éteignent</strong>."
        : "Une lampe grillée <strong style=\"color:var(--coral)\">n'affecte que sa propre boucle</strong> : l'autre lampe, sur une autre boucle, <strong>reste allumée</strong>. Les dipôles en dérivation fonctionnent indépendamment.";
    }
  }
  btnSerie.addEventListener("click", () => { mode = "serie"; broken = false; draw(); });
  btnDerivation.addEventListener("click", () => { mode = "derivation"; broken = false; draw(); });
  btnCasser.addEventListener("click", () => { broken = !broken; draw(); });
  draw();
}

/* ---------- c. La sécurité électrique ---------- */
function initElectricalSafety(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  const iRange = document.getElementById(cfg.iRangeId);
  const iRow = document.getElementById(cfg.iRowId);

  const SEUIL = 20; // A, seuil du disjoncteur
  const keys = ["courtcircuit", "electrocution", "surintensite"];
  let current = "courtcircuit";

  function draw() {
    iRow.style.display = current === "surintensite" ? "block" : "none";
    let s = "";
    if (current === "courtcircuit") {
      s += `<rect x="60" y="55" width="30" height="18" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<path d="M90 60 L150 60 L150 70 L90 70" fill="none" stroke="var(--coral)" stroke-width="3"/>`;
      s += `<text x="120" y="45" font-size="20" text-anchor="middle">🔥</text>`;
      s += `<text x="110" y="95" font-size="8" fill="var(--coral)" text-anchor="middle">bornes reliées par un très bon conducteur</text>`;
    } else if (current === "electrocution") {
      s += `<text x="110" y="55" font-size="26" text-anchor="middle">⚡</text>`;
      s += `<text x="110" y="85" font-size="8" fill="var(--coral)" text-anchor="middle">le corps humain est conducteur : risque en cas de contact avec un fil</text>`;
    } else {
      const I = Number(iRange.value);
      const trips = I > SEUIL;
      s += `<rect x="70" y="30" width="40" height="55" rx="4" fill="none" stroke="${trips ? 'var(--coral)' : 'var(--teal)'}" stroke-width="2.5"/>`;
      s += `<text x="90" y="63" font-size="8" fill="${trips ? 'var(--coral)' : 'var(--teal)'}" text-anchor="middle" font-weight="700">${trips ? "OUVERT" : "fermé"}</text>`;
      s += `<text x="90" y="102" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">disjoncteur (seuil ${SEUIL} A)</text>`;
      s += `<text x="160" y="60" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">I = ${I} A</text>`;
    }
    svg.innerHTML = s;

    if (current === "courtcircuit") {
      readout.innerHTML = "Un générateur est en <strong style=\"color:var(--coral)\">court-circuit</strong> lorsqu'on relie ses bornes par un très bon conducteur. Cela peut provoquer un <strong>incendie</strong>.";
    } else if (current === "electrocution") {
      readout.innerHTML = "Le corps humain est un conducteur électrique : il y a un risque d'<strong style=\"color:var(--coral)\">électrocution</strong> en cas de contact avec les fils de connexion d'une habitation.";
    } else {
      const I = Number(iRange.value);
      const trips = I > SEUIL;
      readout.innerHTML = trips
        ? `Intensité I = ${I} A &gt; ${SEUIL} A : le <strong style="color:var(--coral)">disjoncteur ouvre le circuit</strong> pour éviter un incendie.`
        : `Intensité I = ${I} A ≤ ${SEUIL} A : le disjoncteur reste <strong style="color:var(--teal)">fermé</strong>, le circuit fonctionne normalement.`;
    }
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  iRange.addEventListener("input", draw);
  draw();
}

/* ---------- d. L'intensité du courant électrique ---------- */
function initCurrentIntensity(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const i1Range = document.getElementById(cfg.i1RangeId);
  const i2Range = document.getElementById(cfg.i2RangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnSerie = document.getElementById(cfg.btnSerieId);
  const btnDerivation = document.getElementById(cfg.btnDerivationId);

  let mode = "serie";

  function ammeter(cx, cy, val) {
    return `<circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="var(--coral)" stroke-width="2"/><text x="${cx}" y="${cy + 4}" font-size="9" fill="var(--coral)" text-anchor="middle" font-weight="700">A</text>`;
  }

  function draw() {
    const i1 = Number(i1Range.value);
    let s = "";
    if (mode === "serie") {
      // en série : I1 = I2 (une seule valeur pilotée par i1Range)
      s += `<rect x="15" y="55" width="26" height="16" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<line x1="41" y1="63" x2="65" y2="63" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ammeter(80, 63, i1);
      s += `<line x1="93" y1="63" x2="150" y2="63" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ammeter(165, 63, i1);
      s += `<text x="80" y="82" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">I₁ = ${i1} A</text>`;
      s += `<text x="165" y="82" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">I₂ = ${i1} A</text>`;
      svg.innerHTML = s;
      readout.innerHTML = `Dipôles en série : <strong style="color:var(--yellow)">loi d'unicité de l'intensité</strong>. I₁ = I₂ = <strong style="color:var(--yellow)">${i1} A</strong> — l'intensité est la même en tout point du circuit.`;
    } else {
      const i2 = Number(i2Range.value);
      const iTotal = i1 + i2;
      s += `<rect x="15" y="45" width="26" height="16" fill="var(--yellow)" opacity="0.8"/>`;
      s += `<line x1="41" y1="53" x2="60" y2="53" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ammeter(75, 53, iTotal);
      s += `<line x1="88" y1="53" x2="100" y2="53" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="100" y1="30" x2="100" y2="105" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += `<line x1="100" y1="40" x2="115" y2="40" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ammeter(130, 40, i1);
      s += `<text x="130" y="24" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">I₁ = ${i1} A</text>`;
      s += `<line x1="100" y1="95" x2="115" y2="95" stroke="var(--chalk-dim)" stroke-width="2"/>`;
      s += ammeter(130, 95, i2);
      s += `<text x="130" y="115" font-size="7.5" fill="var(--chalk-dim)" text-anchor="middle">I₂ = ${i2} A</text>`;
      s += `<text x="75" y="35" font-size="7.5" fill="var(--yellow)" text-anchor="middle">I = ${iTotal} A</text>`;
      svg.innerHTML = s;
      readout.innerHTML = `Dipôles en dérivation : <strong style="color:var(--yellow)">loi d'additivité des intensités</strong>. I = I₁ + I₂ = ${i1} + ${i2} = <strong style="color:var(--yellow)">${iTotal} A</strong>.`;
    }
  }
  i1Range.addEventListener("input", draw);
  i2Range.addEventListener("input", draw);
  btnSerie.addEventListener("click", () => { mode = "serie"; draw(); });
  btnDerivation.addEventListener("click", () => { mode = "derivation"; draw(); });
  draw();
}
