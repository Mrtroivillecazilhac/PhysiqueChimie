/* Animations du chapitre 1 — 2nde — "Introduction : la précision en physique-chimie"
   Version simple (raw) : une animation par sous-partie (a à f). */

/* ---------- Fonction utilitaire partagée : arrondi à N chiffres significatifs ---------- */
function roundToSig(x, n) {
  if (x === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const power = n - d;
  const magnitude = Math.pow(10, power);
  return Math.round(x * magnitude) / magnitude;
}
// Un nombre JS ne conserve jamais un zéro final (4.3211 et 4.32110 sont la
// même valeur numérique) : pour AFFICHER le bon nombre de CS, il faut
// formater en chaîne de caractères avec le bon nombre de décimales.
function formatSig(x, n) {
  const rounded = roundToSig(x, n);
  if (rounded === 0) return (0).toFixed(Math.max(0, n - 1));
  const d = Math.ceil(Math.log10(Math.abs(rounded)));
  const decimals = Math.max(0, n - d);
  return rounded.toFixed(decimals);
}

/* ---------- a1. Incertitude implicite (vie quotidienne) vs explicite (physicien) ---------- */
function initImplicitExplicit(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const EXAMPLES = {
    trajet: { daily: "« Le trajet dure 20 minutes. »", science: "20 ± 2 min", icon: "🚗" },
    temperature: { daily: "« Il fait 20 °C dehors. »", science: "20 ± 1 °C", icon: "🌡️" }
  };
  const keys = ["trajet", "temperature"];
  let current = "trajet";

  function draw() {
    const ex = EXAMPLES[current];
    let s = `<text x="110" y="35" font-size="28" text-anchor="middle">${ex.icon}</text>`;
    s += `<text x="110" y="70" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">VIE QUOTIDIENNE (incertitude implicite)</text>`;
    s += `<text x="110" y="88" font-size="12" fill="var(--chalk)" text-anchor="middle">${ex.daily}</text>`;
    s += `<line x1="30" y1="100" x2="190" y2="100" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
    s += `<text x="110" y="118" font-size="8" fill="var(--yellow)" text-anchor="middle">UN PHYSICIEN DIRAIT (incertitude explicite)</text>`;
    s += `<text x="110" y="140" font-size="16" fill="var(--yellow)" text-anchor="middle" font-weight="700">${ex.science}</text>`;
    svg.innerHTML = s;

    readout.textContent = "Il y a toujours une incertitude, même à l'oral, dans la vie de tous les jours — elle est juste implicite (sous-entendue, jamais énoncée). En sciences, on est obligé de la rendre explicite (chiffrée), car la mesure doit pouvoir être vérifiée et comparée par d'autres.";
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- a2. Pourquoi ne peut-on jamais avoir une précision parfaite ? (types d'erreurs) ---------- */
function initErrorTypes(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  const STEPS = [
    {
      title: "Erreur aléatoire — la lecture de l'utilisateur",
      text: "Deux personnes qui lisent la même position sur un instrument gradué n'obtiennent pas toujours exactement la même valeur (angle de lecture, temps de réaction...). Quand l'aiguille ou le repère tombe entre deux graduations, il faut estimer « au jugé » — et c'est là que l'erreur varie d'une personne à l'autre.",
      draw() {
        const cx = 100, cy = 60, r = 28;
        let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        // 12 graduations + chiffres, comme une vraie montre analogique
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + Math.cos(a) * (r - 6), y1 = cy + Math.sin(a) * (r - 6);
          const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
          s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
          const xn = cx + Math.cos(a) * (r + 10), yn = cy + Math.sin(a) * (r + 10);
          const num = i === 0 ? 12 : i;
          s += `<text x="${xn}" y="${yn + 3}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${num}</text>`;
        }
        // aiguille volontairement placée ENTRE deux graduations (ici, entre 12h et 1h)
        const handAngle = (0.5 / 12) * 2 * Math.PI - Math.PI / 2;
        const hx = cx + Math.cos(handAngle) * (r - 8), hy = cy + Math.sin(handAngle) * (r - 8);
        s += `<line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" stroke="var(--yellow)" stroke-width="2.5"/>`;
        s += `<line x1="${cx}" y1="${cy}" x2="${cx + 15}" y2="${cy + 3}" stroke="var(--yellow)" stroke-width="1.5"/>`;
        s += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="var(--yellow)"/>`;
        s += `<text x="${cx}" y="${cy + r + 26}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">montre analogique</text>`;
        s += `<text x="${cx}" y="${cy + r + 38}" font-size="8" fill="var(--yellow)" text-anchor="middle">entre deux graduations : on estime au jugé</text>`;
        return s;
      }
    },
    {
      title: "Erreur aléatoire — la variabilité de l'objet mesuré",
      text: "Même des objets censés être identiques varient légèrement. Exemple : la masse de plusieurs comprimés d'un même médicament, sortis de la même chaîne de fabrication, n'est jamais exactement la même d'un comprimé à l'autre.",
      draw() {
        const masses = ["500 mg", "498 mg", "503 mg"];
        let s = "";
        [40, 100, 160].forEach((x, i) => {
          s += `<ellipse cx="${x}" cy="70" rx="18" ry="10" fill="var(--teal)" opacity="0.8"/>`;
          s += `<text x="${x}" y="95" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${masses[i]}</text>`;
        });
        s += `<text x="110" y="120" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">3 comprimés « identiques », 3 masses différentes</text>`;
        return s;
      }
    },
    {
      title: "Erreur systématique — la résolution de l'appareil",
      text: "Un instrument ne peut jamais donner une précision meilleure que sa plus petite graduation. Entre deux graduations, on estime « au jugé » — un dixième de graduation, par exemple — mais on ne peut jamais être certain de cette estimation.",
      draw() {
        const x0 = 30, x1 = 190, y = 75;
        let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        // grandes graduations (tous les 20 px) avec chiffres (0 à 8 cm)
        for (let i = 0; i <= 8; i++) {
          const x = x0 + i * 20;
          s += `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + 10}" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
          s += `<text x="${x}" y="${y + 22}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">${i}</text>`;
        }
        // petites sous-graduations (tous les 4 px, 5 par intervalle) — pour montrer l'estimation fine
        for (let i = 0; i < 40; i++) {
          const x = x0 + i * 4;
          if (i % 5 !== 0) s += `<line x1="${x}" y1="${y - 4}" x2="${x}" y2="${y + 4}" stroke="var(--chalk-dim)" stroke-width="0.8" opacity="0.5"/>`;
        }
        // point de mesure, délibérément entre deux grandes graduations (90 et 110)
        const px = 102;
        s += `<circle cx="${px}" cy="${y}" r="4" fill="var(--yellow)"/>`;
        s += `<line x1="${px}" y1="${y - 27}" x2="${px}" y2="${y - 12}" stroke="var(--yellow)" stroke-width="1.5"/>`;
        s += `<text x="${px}" y="${y - 31}" font-size="7.5" fill="var(--yellow)" text-anchor="middle">valeur à estimer</text>`;
        s += `<text x="${(x0 + x1) / 2}" y="${y + 38}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">au-delà des graduations, on estime au jugé</text>`;
        return s;
      }
    }
  ];

  let step = 1;
  function render() {
    svg.innerHTML = STEPS[step - 1].draw();
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong> — ${STEPS[step - 1].text}`;
    stepEl.textContent = `${step} / 3`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 3;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 3) { step++; render(); } });
  render();
}

/* ---------- b. Chiffres significatifs (comptage) ---------- */
function initSignificantFigures(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  // chaque chiffre annoté : sig = true (significatif) / false (non significatif, zéro de tête)
  const EXAMPLES = {
    a: { display: "3,20", digits: [{ c: "3", sig: true }, { c: ",", sig: null }, { c: "2", sig: true }, { c: "0", sig: true }], count: "3", rule: "Tous les chiffres sont significatifs, y compris le zéro après la virgule." },
    b: { display: "0,0450", digits: [{ c: "0", sig: false }, { c: ",", sig: null }, { c: "0", sig: false }, { c: "4", sig: true }, { c: "5", sig: true }, { c: "0", sig: true }], count: "3", rule: "Les zéros de tête (avant le premier chiffre non nul) ne sont pas significatifs ; le zéro final après la virgule l'est." },
    c: { display: "205", digits: [{ c: "2", sig: true }, { c: "0", sig: true }, { c: "5", sig: true }], count: "3", rule: "Un zéro encadré par deux chiffres non nuls est toujours significatif." }
  };
  const keys = ["a", "b", "c"];
  let current = "a";

  function draw() {
    const ex = EXAMPLES[current];
    const cx = 110, cy = 70;
    let text = "";
    ex.digits.forEach(d => {
      const color = d.sig === true ? "var(--teal)" : d.sig === false ? "var(--chalk-dim)" : "var(--chalk)";
      text += `<tspan fill="${color}">${d.c}</tspan>`;
    });
    let s = `<text x="${cx}" y="${cy}" font-size="28" font-family="var(--font-display)" text-anchor="middle">${text}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `<strong style="color:var(--yellow)">${ex.count} chiffre(s) significatif(s)</strong> (en <span style="color:var(--teal)">bleu</span> ; en <span style="color:var(--chalk-dim)">gris</span> : non significatif).<br>${ex.rule}`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- c. Écriture scientifique ---------- */
function initScientificNotation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const EXAMPLES = {
    a: { standard: "45 000", a: "4,5", n: 4, cs: 2 },
    b: { standard: "0,0032", a: "3,2", n: -3, cs: 2 },
    c: { standard: "720 000", a: "7,20", n: 5, cs: 3 }
  };
  const keys = ["a", "b", "c"];
  let current = "a";

  function draw() {
    const ex = EXAMPLES[current];
    const cx = 110, cy = 75;
    let s = `<text x="${cx}" y="${cy - 20}" font-size="16" fill="var(--chalk-dim)" text-anchor="middle">${ex.standard}</text>`;
    s += `<text x="${cx}" y="${cy + 5}" font-size="9" fill="var(--yellow)" text-anchor="middle">↓ écriture scientifique</text>`;
    s += `<text x="${cx}" y="${cy + 35}" font-size="18" fill="var(--yellow)" text-anchor="middle" font-weight="700">${ex.a} × 10${ex.n >= 0 ? "" : "⁻"}${toSupExp(Math.abs(ex.n))}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `${ex.standard} = <strong style="color:var(--yellow)">${ex.a} × 10${ex.n >= 0 ? "" : "⁻"}${toSupExp(Math.abs(ex.n))}</strong> — la mantisse « ${ex.a} » contient exactement <strong style="color:var(--teal)">${ex.cs} chiffres significatifs</strong> (1 ≤ a &lt; 10).`;
  }

  function toSupExp(n) {
    const sup = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    return String(n).split("").map(d => sup[d]).join("");
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- d1. Chiffres significatifs et opérations : somme/différence ---------- */
function initSigFigAddition(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const dec1Range = document.getElementById(cfg.dec1RangeId);
  const dec2Range = document.getElementById(cfg.dec2RangeId);
  const readout = document.getElementById(cfg.readoutId);

  // valeurs neutres, vérifiées sur toutes les combinaisons de décimales (0 à 4)
  const A_TRUE = 12.34567, B_TRUE = 4.78912;

  function draw() {
    const dec1 = Number(dec1Range.value);
    const dec2 = Number(dec2Range.value);
    const a = A_TRUE.toFixed(dec1);   // chaîne, ex: "12.3"
    const b = B_TRUE.toFixed(dec2);
    const aNum = Number(a), bNum = Number(b);
    const cRaw = aNum + bNum;
    const minDec = Math.min(dec1, dec2);
    const c = cRaw.toFixed(minDec);
    const sameDec = dec1 === dec2;
    const dLabel = (n) => `${n} décimale${n > 1 ? "s" : ""}`;

    // exemple générique d'abord : a + b = c (s'applique aussi à une différence)
    let s = `<text x="110" y="20" font-size="10" fill="var(--chalk-dim)" text-anchor="middle">Exemple : <tspan fill="var(--teal)">a</tspan> + <tspan fill="#5a96d2">b</tspan> = <tspan fill="var(--yellow)">c</tspan></text>`;
    s += `<text x="110" y="46" font-size="16" text-anchor="middle"><tspan fill="var(--teal)" font-weight="700">${a}</tspan><tspan fill="var(--chalk)"> + </tspan><tspan fill="#5a96d2" font-weight="700">${b}</tspan><tspan fill="var(--chalk)"> = </tspan><tspan fill="var(--yellow)" font-weight="700">${cRaw.toFixed(4)}</tspan></text>`;
    s += `<line x1="30" y1="64" x2="190" y2="64" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="3,3"/>`;
    const line1 = sameDec ? `a et b ont la même précision (${dLabel(dec1)})` : `a a ${dLabel(dec1)}, b a ${dLabel(dec2)}`;
    const line2 = sameDec ? `→ c est arrondi à ${dLabel(minDec)}` : `→ c arrondi à la moins précise : ${dLabel(minDec)}`;
    s += `<text x="110" y="82" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${line1}</text>`;
    s += `<text x="110" y="96" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${line2}</text>`;
    s += `<text x="110" y="128" font-size="20" fill="var(--yellow)" text-anchor="middle" font-weight="700">c ≈ ${c}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = sameDec
      ? `a = <strong style="color:var(--teal)">${a}</strong> et b = <strong style="color:#5a96d2">${b}</strong> ont la même précision (${dLabel(dec1)} après la virgule). Résultat brut : a + b = <strong style="color:var(--yellow)">${cRaw.toFixed(4)}</strong>, arrondi à cette même précision : <strong style="color:var(--yellow)">${c}</strong>.`
      : `a = <strong style="color:var(--teal)">${a}</strong> (${dLabel(dec1)}) et b = <strong style="color:#5a96d2">${b}</strong> (${dLabel(dec2)}) n'ont pas la même précision. Résultat brut : a + b = <strong style="color:var(--yellow)">${cRaw.toFixed(4)}</strong>, arrondi à la précision la moins bonne des deux : <strong style="color:var(--yellow)">${c}</strong>.`;
  }
  dec1Range.addEventListener("input", draw);
  dec2Range.addEventListener("input", draw);
  draw();
}

/* ---------- d2. Chiffres significatifs et opérations : produit/quotient ---------- */
function initSigFigOperations(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const cs1Range = document.getElementById(cfg.cs1RangeId);
  const cs2Range = document.getElementById(cfg.cs2RangeId);
  const readout = document.getElementById(cfg.readoutId);

  // valeurs neutres, vérifiées sur toutes les combinaisons de CS (2 à 6)
  // pour ne jamais tomber sur un résultat qui ferait rire une classe de lycée
  const A_TRUE = 8.234567, B_TRUE = 5.671234;

  function draw() {
    const cs1 = Number(cs1Range.value);
    const cs2 = Number(cs2Range.value);
    const a = formatSig(A_TRUE, cs1);   // chaîne, ex: "4.32110" (garde le zéro final)
    const b = formatSig(B_TRUE, cs2);
    const aNum = Number(a), bNum = Number(b);
    const cRaw = aNum * bNum;
    const minCS = Math.min(cs1, cs2);
    const c = formatSig(cRaw, minCS);
    const sameCS = cs1 === cs2;

    // exemple générique d'abord : a × b = c (s'applique à n'importe quelle opération)
    let s = `<text x="110" y="20" font-size="10" fill="var(--chalk-dim)" text-anchor="middle">Exemple : <tspan fill="var(--teal)">a</tspan> × <tspan fill="#5a96d2">b</tspan> = <tspan fill="var(--yellow)">c</tspan></text>`;
    s += `<text x="110" y="46" font-size="16" text-anchor="middle"><tspan fill="var(--teal)" font-weight="700">${a}</tspan><tspan fill="var(--chalk)"> × </tspan><tspan fill="#5a96d2" font-weight="700">${b}</tspan><tspan fill="var(--chalk)"> = </tspan><tspan fill="var(--yellow)" font-weight="700">${cRaw.toFixed(4)}</tspan></text>`;
    s += `<line x1="30" y1="64" x2="190" y2="64" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="3,3"/>`;
    const line1 = sameCS ? `a et b ont la même précision (${cs1} CS)` : `a a ${cs1} CS, b a ${cs2} CS`;
    const line2 = sameCS ? `→ c est arrondi à ${minCS} CS` : `→ c arrondi au plus petit : ${minCS} CS`;
    s += `<text x="110" y="82" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${line1}</text>`;
    s += `<text x="110" y="96" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">${line2}</text>`;
    s += `<text x="110" y="128" font-size="20" fill="var(--yellow)" text-anchor="middle" font-weight="700">c ≈ ${c}</text>`;
    svg.innerHTML = s;

    readout.innerHTML = sameCS
      ? `a = <strong style="color:var(--teal)">${a}</strong> et b = <strong style="color:#5a96d2">${b}</strong> ont la même précision (${cs1} CS). Résultat brut : a × b = <strong style="color:var(--yellow)">${cRaw.toFixed(4)}</strong>, arrondi à cette même précision : <strong style="color:var(--yellow)">${c}</strong> (${minCS} CS).`
      : `a = <strong style="color:var(--teal)">${a}</strong> (${cs1} CS) et b = <strong style="color:#5a96d2">${b}</strong> (${cs2} CS) n'ont pas la même précision. Résultat brut : a × b = <strong style="color:var(--yellow)">${cRaw.toFixed(4)}</strong>, arrondi au plus petit nombre de CS des deux : <strong style="color:var(--yellow)">${c}</strong> (${minCS} CS).`;
  }
  cs1Range.addEventListener("input", draw);
  cs2Range.addEventListener("input", draw);
  draw();
}

/* ---------- d3. Chiffres significatifs et opérations : calcul mixte (produit/quotient + somme) ---------- */
function initMixedCalculation(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  // d1/v1 et d2/v2 : deux quotients à 2 CS chacun, choisis pour que l'arrondi
  // prématuré aurait changé le résultat final (7,3 s au lieu de 7,4 s)
  const D1 = 5.0, V1 = 1.1, D2 = 8.5, V2 = 3.0;
  const t1Raw = D1 / V1;                       // 4,545454... s
  const t2Raw = D2 / V2;                       // 2,833333... s
  const t1RawStr = t1Raw.toFixed(3).replace(".", ",") + "...";
  const t2RawStr = t2Raw.toFixed(3).replace(".", ",") + "...";
  const sumRawStr = (t1Raw + t2Raw).toFixed(3).replace(".", ",") + "...";
  const finalResult = (t1Raw + t2Raw).toFixed(1).replace(".", ",");

  // précision que chaque quotient aurait une fois arrondi à son bon nombre de CS
  const t1Rounded = formatSig(t1Raw, 2);       // "4.5" -> 1 décimale
  const t2Rounded = formatSig(t2Raw, 2);       // "2.8" -> 1 décimale

  // dessin cumulatif : chaque étape ajoute une couche au diagramme précédent
  function drawFractions({ showPrecision, showSum, showFinal }) {
    let s = "";

    // fraction 1 : 5,0 / 1,1 (juste les nombres, les unités sont données dans le texte)
    s += `<text x="55" y="22" font-size="14" text-anchor="middle" fill="var(--chalk)">5,0</text>`;
    s += `<line x1="20" y1="30" x2="90" y2="30" stroke="var(--chalk)" stroke-width="1.4"/>`;
    s += `<text x="55" y="46" font-size="14" text-anchor="middle" fill="var(--chalk)">1,1</text>`;

    s += `<text x="110" y="36" font-size="18" text-anchor="middle" fill="var(--chalk-dim)">+</text>`;

    // fraction 2 : 8,5 / 3,0
    s += `<text x="165" y="22" font-size="14" text-anchor="middle" fill="var(--chalk)">8,5</text>`;
    s += `<line x1="130" y1="30" x2="200" y2="30" stroke="var(--chalk)" stroke-width="1.4"/>`;
    s += `<text x="165" y="46" font-size="14" text-anchor="middle" fill="var(--chalk)">3,0</text>`;

    s += `<text x="55" y="66" font-size="10" text-anchor="middle" fill="var(--teal)">t₁ = ${t1RawStr} s</text>`;
    s += `<text x="165" y="66" font-size="10" text-anchor="middle" fill="var(--teal)">t₂ = ${t2RawStr} s</text>`;

    if (showPrecision) {
      s += `<text x="55" y="80" font-size="8" text-anchor="middle" fill="var(--yellow)">≈ ${t1Rounded} s à 2 CS</text>`;
      s += `<text x="165" y="80" font-size="8" text-anchor="middle" fill="var(--yellow)">≈ ${t2Rounded} s à 2 CS</text>`;
    }

    if (showSum) {
      s += `<line x1="10" y1="92" x2="210" y2="92" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="3,3"/>`;
      s += `<text x="110" y="108" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">t = ${t1RawStr} + ${t2RawStr} = ${sumRawStr} s</text>`;
    }

    if (showFinal) {
      s += `<text x="110" y="126" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">arrondi une seule fois, à la fin, à 1 décimale</text>`;
      s += `<text x="110" y="158" font-size="20" font-weight="700" fill="var(--yellow)" text-anchor="middle">t ≈ ${finalResult} s</text>`;
    }
    return s;
  }

  const STEPS = [
    {
      title: "Étape 1 — calculer chaque durée séparément, sans arrondir",
      text: `t₁ = d₁ / v₁ = 5,0 / 1,1 = ${t1RawStr} s ; t₂ = d₂ / v₂ = 8,5 / 3,0 = ${t2RawStr} s. On garde toute la précision affichée par la calculatrice, on n'arrondit rien pour l'instant.`,
      draw: () => drawFractions({ showPrecision: false, showSum: false, showFinal: false })
    },
    {
      title: "Étape 2 — repérer la précision visée pour le résultat final",
      text: `On regarde quelle précision aurait chaque quotient s'il était arrondi seul : t₁ arrondi à 2 CS donnerait ${t1Rounded} s (1 décimale), t₂ arrondi à 2 CS donnerait ${t2Rounded} s (1 décimale). Le résultat final devra donc être donné à 1 décimale — mais on n'arrondit toujours pas les valeurs utilisées dans le calcul.`,
      draw: () => drawFractions({ showPrecision: true, showSum: false, showFinal: false })
    },
    {
      title: "Étape 3 — additionner les valeurs complètes, non arrondies",
      text: `t = t₁ + t₂ = ${t1RawStr} + ${t2RawStr} = ${sumRawStr} s. On additionne les valeurs entières telles que la calculatrice les donne, pas des valeurs déjà arrondies.`,
      draw: () => drawFractions({ showPrecision: true, showSum: true, showFinal: false })
    },
    {
      title: "Étape 4 — arrondir une seule fois, à la fin",
      text: `On arrondit le résultat à la précision fixée à l'étape 2 (1 décimale) : t ≈ ${finalResult} s. C'est le seul arrondi de tout le calcul.`,
      draw: () => drawFractions({ showPrecision: true, showSum: true, showFinal: true })
    }
  ];

  let step = 1;
  function render() {
    svg.innerHTML = STEPS[step - 1].draw();
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong><br>${STEPS[step - 1].text}`;
    stepEl.textContent = `${step} / ${STEPS.length}`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === STEPS.length;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length) { step++; render(); } });
  render();
}

/* ---------- e. Incertitude de mesure ---------- */
function initMeasurementUncertainty(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));

  const MEASURED = 15.3; // cm, valeur fixe lue sur la règle

  // Chaque échelle correspond à une vraie règle différente : plus la
  // graduation est fine, plus on doit zoomer pour voir les traits.
  const SCALES = {
    s10: { grad: 10, windowMin: 10, windowMax: 40, decimals: 0 },
    s1: { grad: 1, windowMin: 12, windowMax: 18, decimals: 0 },
    s01: { grad: 0.1, windowMin: 14.5, windowMax: 15.5, decimals: 1 },
    s001: { grad: 0.01, windowMin: 15.20, windowMax: 15.30, decimals: 2 }
  };
  const keys = ["s10", "s1", "s01", "s001"];
  let current = "s1";

  function draw() {
    const sc = SCALES[current];
    const grad = sc.grad;
    const U = grad / 2;
    const rel = (U / MEASURED) * 100;

    const x0 = 20, x1 = 200, yRuler = 45;
    function toPx(v) { return x0 + ((v - sc.windowMin) / (sc.windowMax - sc.windowMin)) * (x1 - x0); }

    // repère de la valeur lue, AU-DESSUS de la règle (rien ne masque la valeur)
    const mx = toPx(MEASURED);
    let s = `<text x="${mx}" y="18" font-size="9" fill="var(--yellow)" text-anchor="middle">on lit ici : 15,3 cm</text>`;
    s += `<line x1="${mx}" y1="22" x2="${mx}" y2="${yRuler - 10}" stroke="var(--yellow)" stroke-width="1.5"/>`;
    s += `<polygon points="${mx - 3},${yRuler - 10} ${mx + 3},${yRuler - 10} ${mx},${yRuler - 4}" fill="var(--yellow)"/>`;

    // la règle et ses graduations
    s += `<line x1="${x0}" y1="${yRuler}" x2="${x1}" y2="${yRuler}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    const nTicks = Math.round((sc.windowMax - sc.windowMin) / grad);
    for (let i = 0; i <= nTicks; i++) {
      const val = sc.windowMin + i * grad;
      const x = toPx(val);
      s += `<line x1="${x}" y1="${yRuler - 9}" x2="${x}" y2="${yRuler + 9}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<text x="${x}" y="${yRuler + 21}" font-size="7" fill="var(--chalk-dim)" text-anchor="middle">${val.toFixed(sc.decimals)}</text>`;
    }

    // bracket montrant UNE graduation entière — indépendant de la position
    // exacte de la valeur lue : ce n'est pas une boîte posée sur la valeur,
    // c'est la largeur d'un intervalle entre deux traits quelconques.
    let lowerTick = sc.windowMin + Math.floor((MEASURED - sc.windowMin) / grad + 1e-9) * grad;
    let upperTick = lowerTick + grad;
    if (upperTick > sc.windowMax + 1e-9) { upperTick = lowerTick; lowerTick = lowerTick - grad; }
    const bx0 = toPx(lowerTick), bx1 = toPx(upperTick);
    const yBracket = yRuler + 40;
    s += `<line x1="${bx0}" y1="${yBracket}" x2="${bx1}" y2="${yBracket}" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<line x1="${bx0}" y1="${yBracket - 5}" x2="${bx0}" y2="${yBracket + 5}" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<line x1="${bx1}" y1="${yBracket - 5}" x2="${bx1}" y2="${yBracket + 5}" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<text x="${(bx0 + bx1) / 2}" y="${yBracket + 16}" font-size="8" fill="var(--teal)" text-anchor="middle">1 graduation = 2 × U(x)</text>`;

    svg.innerHTML = s;

    readout.innerHTML = `Sur cette règle, la plus petite graduation vaut ${grad} cm. Entre deux graduations, on ne peut qu'estimer. Par convention, on prend :<br>U(x) = graduation / 2 = ${grad} / 2 = <strong style="color:var(--yellow)">${U.toFixed(3)} cm</strong> (incertitude absolue)<br>incertitude relative = U(x)/x = ${U.toFixed(3)}/${MEASURED} = <strong style="color:var(--teal)">${rel.toFixed(2)} %</strong>`;
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => { current = keys[i]; draw(); });
  });
  draw();
}

/* ---------- f. Intervalle de confiance ---------- */
function initConfidenceInterval(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const uRange = document.getElementById(cfg.uRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const X_MEASURED = 15.3; // cm, même règle et même exemple que la section précédente

  function draw() {
    const U = Number(uRange.value) / 100; // cm
    const xMin = X_MEASURED - U, xMax = X_MEASURED + U;

    const x0 = 20, x1 = 200, y = 70;
    const range = 1.5; // cm, demi-étendue de l'axe autour de X_MEASURED
    function toPx(v) { return x0 + ((v - (X_MEASURED - range)) / (2 * range)) * (x1 - x0); }

    let s = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--chalk-dim)" stroke-width="2"/>`;
    for (let v = Math.ceil((X_MEASURED - range) * 2) / 2; v <= X_MEASURED + range; v += 0.5) {
      const x = toPx(v);
      s += `<line x1="${x}" y1="${y - 6}" x2="${x}" y2="${y + 6}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
      s += `<text x="${x}" y="${y + 18}" font-size="7" fill="var(--chalk-dim)" text-anchor="middle">${v.toFixed(1)}</text>`;
    }
    const pxMin = toPx(xMin), pxMax = toPx(xMax), pxMid = toPx(X_MEASURED);
    s += `<rect x="${pxMin}" y="${y - 16}" width="${pxMax - pxMin}" height="32" fill="rgba(107,191,171,0.3)" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<line x1="${pxMid}" y1="${y - 22}" x2="${pxMid}" y2="${y + 22}" stroke="var(--yellow)" stroke-width="2"/>`;
    s += `<text x="${pxMid}" y="${y - 28}" font-size="9" fill="var(--yellow)" text-anchor="middle">x = ${X_MEASURED} cm</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `On écrit : L = ${X_MEASURED.toFixed(1)} ± ${U.toFixed(2)} cm.<br>Cela signifie que la longueur vraie a de bonnes chances d'être <strong style="color:var(--teal)">comprise entre ${xMin.toFixed(2)} et ${xMax.toFixed(2)} cm</strong>.`;
  }
  uRange.addEventListener("input", draw);
  draw();
}
