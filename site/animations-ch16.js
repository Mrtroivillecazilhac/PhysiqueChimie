/* Animations du chapitre 16 — 1ère spé PC */

/* ---------- 1. Les 4 étapes d'une synthèse, pas à pas ---------- */
function initSynthesisSteps(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);

  // mini-pipette réutilisable (ampoule + corps + pointe effilée), coloré selon
  // ce qu'elle contient ; renvoie le SVG et la position de sa pointe
  function miniPipette(cx, topY, color) {
    const bulbW = 7, bulbH = 13, bodyH = 13, taperH = 7, tipH = 9;
    const bodyTop = topY + bulbH, bodyBottom = bodyTop + bodyH, tipY = bodyBottom + taperH, tipEnd = tipY + tipH;
    let s = `<rect x="${cx - bulbW / 2}" y="${topY}" width="${bulbW}" height="${bulbH}" rx="3.5" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<path d="M${cx - 2},${bodyTop} L${cx - 2},${bodyBottom} L${cx},${tipY} L${cx + 2},${bodyBottom} L${cx + 2},${bodyTop}" fill="none" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<line x1="${cx}" y1="${tipY}" x2="${cx}" y2="${tipEnd}" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
    s += `<rect x="${cx - 1.5}" y="${bodyTop + 5.5}" width="3" height="7" fill="${color}"/>`;
    return { svg: s, tipEnd };
  }

  const STEPS = [
    {
      title: "Étape 1 — Prélèvement des réactifs",
      text: "Avant de prélever, on recherche les pictogrammes de danger et les consignes de sécurité.<br><br>Solide → on pèse une masse m.<br>Soluté → on mesure un volume de solution.<br>Liquide → on pèse une masse m ou on mesure un volume V.",
      draw() {
        let s = "";
        // balance : socle simple, avec un petit récipient posé dessus
        s += `<rect x="30" y="95" width="60" height="14" rx="3" fill="var(--board)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
        s += `<text x="60" y="122" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">balance</text>`;
        s += `<path d="M43,78 L77,78 L72,95 L48,95 Z" fill="none" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;

        s += `<defs><marker id="ssArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--chalk-dim)"/></marker></defs>`;

        // solide : petits carrés gris, en haut à gauche, avec une flèche vers le récipient
        s += `<rect x="22" y="26" width="10" height="10" fill="var(--chalk-dim)"/>`;
        s += `<rect x="33" y="31" width="9" height="9" fill="var(--chalk-dim)"/>`;
        s += `<rect x="25" y="38" width="8" height="8" fill="var(--chalk-dim)"/>`;
        s += `<text x="28" y="18" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">solide</text>`;
        s += `<line x1="35" y1="50" x2="50" y2="76" stroke="var(--chalk-dim)" stroke-width="1.6" marker-end="url(#ssArrow)"/>`;

        // 3 pipettes rapprochées : la 1ère (bleue) vers la balance, les 2 suivantes
        // (bleue + rouge) vers l'éprouvette. "liquide" légende les deux bleues,
        // "soluté" légende la rouge.
        const pA = miniPipette(90, 8, "#5a96d2");   // liquide → balance
        const pB = miniPipette(112, 8, "#5a96d2");  // liquide → éprouvette
        const pC = miniPipette(134, 8, "var(--coral)"); // soluté → éprouvette
        s += pA.svg + pB.svg + pC.svg;
        s += `<text x="101" y="6" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">liquide</text>`;
        s += `<text x="134" y="6" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">soluté</text>`;

        s += `<line x1="89" y1="${pA.tipEnd}" x2="72" y2="78" stroke="var(--chalk-dim)" stroke-width="1.6" marker-end="url(#ssArrow)"/>`;

        // éprouvette graduée : reçoit soit le liquide (bleu), soit le soluté (rouge)
        s += `<line x1="112" y1="${pB.tipEnd}" x2="117" y2="62" stroke="var(--chalk-dim)" stroke-width="1.4" marker-end="url(#ssArrow)"/>`;
        s += `<line x1="134" y1="${pC.tipEnd}" x2="129" y2="62" stroke="var(--chalk-dim)" stroke-width="1.4" marker-end="url(#ssArrow)"/>`;
        s += `<rect x="115" y="60" width="20" height="45" fill="none" stroke="var(--chalk-dim)" stroke-width="1.8"/>`;
        s += `<rect x="116" y="85" width="18" height="19" fill="rgba(90,150,210,0.35)"/>`;
        [70, 78, 86, 94].forEach(y => s += `<line x1="115" y1="${y}" x2="120" y2="${y}" stroke="var(--chalk-dim)" stroke-width="1"/>`);
        s += `<text x="125" y="118" font-size="8.5" fill="var(--chalk-dim)" text-anchor="middle">volume V</text>`;

        return s;
      }
    },
    {
      title: "Étape 2 — Transformation chimique",
      text: "Le produit est formé au cours de cette étape. Une augmentation de température accélère en général la réaction et favorise la dissolution des réactifs solides. À la fin, le milieu réactionnel est refroidi.<br><br>Le montage de chauffage à reflux permet de chauffer sans perte de matière : le réfrigérant liquéfie les vapeurs. Le support élévateur reste en position haute pour pouvoir éloigner rapidement la source de chaleur.",
      draw() {
        let s = "";
        s += `<defs><marker id="ssWArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="var(--teal)"/></marker></defs>`;

        // potence : un seul trait vertical
        s += `<line x1="35" y1="10" x2="35" y2="185" stroke="var(--chalk-dim)" stroke-width="2"/>`;

        // surélévateur : plaques empilées, à la base
        s += `<rect x="20" y="168" width="30" height="5" fill="none" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
        s += `<rect x="23" y="174" width="24" height="5" fill="none" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
        s += `<rect x="26" y="180" width="18" height="5" fill="none" stroke="var(--chalk-dim)" stroke-width="1.4"/>`;
        s += `<text x="20" y="192" font-size="7" fill="var(--chalk-dim)" text-anchor="start">support élévateur</text>`;

        // chauffe-ballon : rectangle corail
        s += `<rect x="65" y="162" width="55" height="10" fill="var(--coral)"/>`;
        s += `<text x="125" y="170" font-size="7" fill="var(--coral)" text-anchor="start">chauffe-ballon</text>`;

        // ballon à col rond
        s += `<circle cx="92" cy="145" r="20" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="85" y1="126" x2="85" y2="92" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<line x1="99" y1="126" x2="99" y2="92" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<text x="120" y="148" font-size="7" fill="var(--chalk-dim)" text-anchor="start">ballon</text>`;

        // réfrigérant : simple tube, sans zigzag
        s += `<rect x="77" y="22" width="30" height="70" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        s += `<text x="112" y="55" font-size="7" fill="var(--chalk-dim)" text-anchor="start">réfrigérant</text>`;

        // flèches eau
        s += `<line x1="55" y1="85" x2="75" y2="85" stroke="var(--teal)" stroke-width="2" marker-end="url(#ssWArrow)"/>`;
        s += `<text x="50" y="89" font-size="7" fill="var(--teal)" text-anchor="end">arrivée</text>`;
        s += `<line x1="132" y1="27" x2="109" y2="27" stroke="var(--teal)" stroke-width="2" marker-end="url(#ssWArrow)"/>`;
        s += `<text x="137" y="24" font-size="7" fill="var(--teal)" text-anchor="start">sortie</text>`;

        return s;
      }
    },
    {
      title: "Étape 3 — Isolement",
      text: "Séparer le produit du milieu réactionnel conduit au produit brut. Pour un solide : filtration, lavage au solvant glacé, séchage à l'étuve. Pour un liquide : extraction liquide-liquide (ampoule à décanter), séchage, évaporation du solvant.",
      draw() {
        let s = "";
        // entonnoir de filtration (solide)
        s += `<polygon points="45,20 85,20 72,55 58,55" fill="none" stroke="var(--coral)" stroke-width="2"/>`;
        s += `<line x1="65" y1="55" x2="65" y2="75" stroke="var(--coral)" stroke-width="2"/>`;
        s += `<text x="65" y="90" font-size="8" fill="var(--coral)" text-anchor="middle">filtration (solide)</text>`;
        // ampoule à décanter (liquide)
        s += `<path d="M150 15 L165 15 L165 40 Q165 55 157 60 L157 72 L163 72 L163 78 L151 78 L151 72 L157 72 Q149 55 149 40 L149 15" fill="none" stroke="var(--teal)" stroke-width="2"/>`;
        s += `<line x1="149" y1="42" x2="165" y2="42" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        s += `<text x="157" y="90" font-size="8" fill="var(--teal)" text-anchor="middle">extraction (liquide)</text>`;
        return s;
      }
    },
    {
      title: "Étape 4 — Analyse",
      text: "L'analyse permet l'identification de l'espèce chimique obtenue et le contrôle de sa pureté : mesure d'une caractéristique physique (température de fusion pour un solide, température d'ébullition pour un liquide), ou méthodes chromatographiques/spectroscopiques.",
      draw() {
        let s = "";
        // thermomètre
        s += `<rect x="55" y="15" width="8" height="50" rx="4" fill="none" stroke="var(--coral)" stroke-width="2"/>`;
        s += `<circle cx="59" cy="72" r="9" fill="var(--coral)"/>`;
        s += `<rect x="57" y="40" width="4" height="30" fill="var(--coral)"/>`;
        s += `<text x="59" y="94" font-size="8" fill="var(--coral)" text-anchor="middle">T fusion / ébullition</text>`;
        // chromatographie (plaque + taches)
        s += `<rect x="130" y="15" width="40" height="55" fill="none" stroke="var(--teal)" stroke-width="1.5"/>`;
        s += `<line x1="130" y1="55" x2="170" y2="55" stroke="var(--chalk-dim)" stroke-width="1" stroke-dasharray="2,2"/>`;
        s += `<circle cx="140" cy="52" r="3" fill="var(--yellow)"/>`;
        s += `<circle cx="150" cy="30" r="3" fill="var(--yellow)"/>`;
        s += `<circle cx="160" cy="45" r="3" fill="var(--coral)"/>`;
        s += `<text x="150" y="88" font-size="8" fill="var(--teal)" text-anchor="middle">chromatographie</text>`;
        return s;
      }
    }
  ];

  let step = 1;
  function render() {
    svg.innerHTML = STEPS[step - 1].draw();
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong> — ${STEPS[step - 1].text}`;
    stepEl.textContent = `Étape ${step} / 4`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === 4;
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < 4) { step++; render(); } });
  render();
}

/* ---------- 3. Calculateur de rendement ---------- */
function initYieldCalculator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const npRange = document.getElementById(cfg.npRangeId);
  const nmaxRange = document.getElementById(cfg.nmaxRangeId);
  const readout = document.getElementById(cfg.readoutId);

  function draw() {
    let np = Number(npRange.value);
    const nmax = Number(nmaxRange.value);
    if (np > nmax) { np = nmax; npRange.value = nmax; }
    const eta = nmax > 0 ? np / nmax : 0;

    const gx = 90, gTop = 20, gBottom = 150, gW = 40;
    let s = `<rect x="${gx}" y="${gTop}" width="${gW}" height="${gBottom - gTop}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
    const h = eta * (gBottom - gTop);
    s += `<rect x="${gx}" y="${gBottom - h}" width="${gW}" height="${h}" fill="var(--teal)"/>`;
    s += `<text x="${gx + gW / 2}" y="${gBottom + 16}" font-size="9" fill="var(--chalk-dim)" text-anchor="middle">rendement η</text>`;
    s += `<text x="${gx + gW / 2}" y="${gTop - 8}" font-size="11" fill="var(--yellow)" text-anchor="middle" font-weight="700">${(eta * 100).toFixed(0)}%</text>`;

    svg.innerHTML = s;
    readout.innerHTML = `η = n<sub>P</sub> / n<sub>max</sub> = ${np.toFixed(2)} / ${nmax.toFixed(2)} = <strong style="color:var(--yellow);">${(eta * 100).toFixed(0)}%</strong>. Un rendement faible peut venir d'un réactif limitant pas totalement consommé, d'un refroidissement insuffisant, de pertes lors des manipulations, ou d'une réaction non totale.`;
  }

  npRange.addEventListener("input", draw);
  nmaxRange.addEventListener("input", draw);
  draw();
}
