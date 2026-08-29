/* Animations du chapitre 6 — 2nde — "Modéliser une action mécanique sur un système"
   Version simple (raw) : à raffiner plus tard. */

/* ---------- 1. Principe des actions réciproques ---------- */
function initReciprocalActions(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnContact = document.getElementById(cfg.btnContactId);
  const btnDistance = document.getElementById(cfg.btnDistanceId);

  let mode = "contact";

  function draw() {
    const yA = 90, yB = 90, xA = 60, xB = 170;
    let s = `<defs><marker id="raArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--yellow)"/></marker>
      <marker id="raArrowT" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker></defs>`;

    if (mode === "contact") {
      s += `<rect x="${xA - 18}" y="${yA - 14}" width="36" height="28" rx="4" fill="var(--chalk)" opacity="0.8"/>`;
      s += `<text x="${xA}" y="${yA + 4}" font-size="8" fill="var(--board)" text-anchor="middle">livre</text>`;
      s += `<rect x="${xB - 24}" y="${yB - 6}" width="48" height="12" fill="var(--chalk-dim)"/>`;
      s += `<text x="${xB}" y="${yB + 24}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">table</text>`;
    } else {
      s += `<circle cx="${xA}" cy="${yA}" r="16" fill="var(--coral)"/>`;
      s += `<text x="${xA}" y="${yA + 30}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Terre</text>`;
      s += `<circle cx="${xB}" cy="${yB}" r="9" fill="var(--chalk)"/>`;
      s += `<text x="${xB}" y="${yB + 24}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">Lune</text>`;
    }

    s += `<line x1="${xA + 25}" y1="${yA - 25}" x2="${xB - 25}" y2="${yA - 25}" stroke="var(--yellow)" stroke-width="2.5" marker-end="url(#raArrow)"/>`;
    s += `<text x="${(xA + xB) / 2}" y="${yA - 32}" font-size="8" fill="var(--yellow)" text-anchor="middle">F<tspan baseline-shift="sub" font-size="0.7em">A/B</tspan></text>`;
    s += `<line x1="${xB - 25}" y1="${yA + 25}" x2="${xA + 25}" y2="${yA + 25}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#raArrowT)"/>`;
    s += `<text x="${(xA + xB) / 2}" y="${yA + 40}" font-size="8" fill="var(--teal)" text-anchor="middle">F<tspan baseline-shift="sub" font-size="0.7em">B/A</tspan></text>`;

    svg.innerHTML = s;
    readout.textContent = "Les deux forces ont la même droite d'action, des sens opposés, et la même valeur — que l'interaction soit de contact ou à distance.";
  }
  btnContact.addEventListener("click", () => { mode = "contact"; draw(); });
  btnDistance.addEventListener("click", () => { mode = "distance"; draw(); });
  draw();
}

/* ---------- 2. Calculateur de force gravitationnelle ---------- */
function initGravitationalForce(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mARange = document.getElementById(cfg.mARangeId);
  const mBRange = document.getElementById(cfg.mBRangeId);
  const dRange = document.getElementById(cfg.dRangeId);
  const readout = document.getElementById(cfg.readoutId);

  const G = 6.67e-11;

  function draw() {
    const mA = Number(mARange.value); // x10^24 kg
    const mB = Number(mBRange.value); // x10^24 kg
    const d = Number(dRange.value);   // x10^6 m
    const F = G * (mA * 1e24) * (mB * 1e24) / ((d * 1e6) ** 2);

    const rA = 10 + mA * 2, rB = 10 + mB * 2;
    const cx = 115, cy = 80;
    const sep = Math.min(80, 20 + d);
    let s = `<circle cx="${cx - sep}" cy="${cy}" r="${rA}" fill="var(--coral)"/>`;
    s += `<circle cx="${cx + sep}" cy="${cy}" r="${rB}" fill="var(--teal)"/>`;
    s += `<text x="${cx - sep}" y="${cy + rA + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">A</text>`;
    s += `<text x="${cx + sep}" y="${cy + rB + 14}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">B</text>`;
    s += `<line x1="${cx - sep + rA}" y1="${cy}" x2="${cx + sep - rB}" y2="${cy}" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="2,2"/>`;
    svg.innerHTML = s;

    readout.innerHTML = `F = G × <span class="frac"><span class="num">m<sub>A</sub> × m<sub>B</sub></span><span class="den">d²</span></span> = 6,67×10⁻¹¹ × <span class="frac"><span class="num">${mA}×10²⁴ × ${mB}×10²⁴</span><span class="den">(${d}×10⁶)²</span></span> ≈ <strong style="color:var(--yellow)">${F.toExponential(2)} N</strong>`;
  }
  mARange.addEventListener("input", draw);
  mBRange.addEventListener("input", draw);
  dRange.addEventListener("input", draw);
  draw();
}

/* ---------- 3. Calculateur de poids selon l'astre ---------- */
function initWeightCalculator(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const mRange = document.getElementById(cfg.mRangeId);
  const readout = document.getElementById(cfg.readoutId);
  const btnTerre = document.getElementById(cfg.btnTerreId);
  const btnMars = document.getElementById(cfg.btnMarsId);
  const btnLune = document.getElementById(cfg.btnLuneId);

  const G_VALUES = { terre: { g: 9.8, label: "Terre" }, mars: { g: 3.7, label: "Mars" }, lune: { g: 1.6, label: "Lune" } };
  let astre = "terre";

  function draw() {
    const m = Number(mRange.value);
    const g = G_VALUES[astre].g;
    const P = m * g;

    const x0 = 100, y0 = 15, maxLen = 150;
    const len = Math.min(maxLen, (P / 1000) * maxLen);
    let s = `<defs><marker id="wcArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;
    s += `<circle cx="${x0}" cy="${y0}" r="10" fill="var(--chalk)"/>`;
    s += `<line x1="${x0}" y1="${y0 + 10}" x2="${x0}" y2="${y0 + 10 + len}" stroke="var(--coral)" stroke-width="3" marker-end="url(#wcArrow)"/>`;
    s += `<text x="${x0 + 12}" y="${y0 + 10 + len / 2}" font-size="9" fill="var(--coral)">P</text>`;
    svg.innerHTML = s;

    readout.innerHTML = `Sur ${G_VALUES[astre].label} (g = ${g} N/kg) : P = m × g = ${m} × ${g} = <strong style="color:var(--yellow)">${P.toFixed(0)} N</strong>`;
  }
  mRange.addEventListener("input", draw);
  btnTerre.addEventListener("click", () => { astre = "terre"; draw(); });
  btnMars.addEventListener("click", () => { astre = "mars"; draw(); });
  btnLune.addEventListener("click", () => { astre = "lune"; draw(); });
  draw();
}

/* ---------- 4. Force exercée par un fil ou un support ---------- */
function initContactForce(cfg) {
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const btnFil = document.getElementById(cfg.btnFilId);
  const btnSupport = document.getElementById(cfg.btnSupportId);

  let mode = "fil";

  function draw() {
    let s = `<defs><marker id="cfArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--teal)"/></marker>
      <marker id="cfArrowP" markerWidth="8" markerHeight="8" refX="7" refY="4" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="var(--coral)"/></marker></defs>`;

    if (mode === "fil") {
      const sx = 110, sy = 90;
      s += `<line x1="${sx - 25}" y1="${sy - 55}" x2="${sx}" y2="${sy}" stroke="#5a96d2" stroke-width="2" stroke-dasharray="3,2"/>`;
      s += `<text x="${sx - 30}" y="${sy - 58}" font-size="8" fill="#5a96d2">fil</text>`;
      s += `<circle cx="${sx}" cy="${sy}" r="10" fill="var(--chalk)"/>`;
      s += `<line x1="${sx}" y1="${sy}" x2="${sx - 22}" y2="${sy - 48}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#cfArrow)"/>`;
      s += `<text x="${sx - 40}" y="${sy - 35}" font-size="8" fill="var(--teal)">F<tspan baseline-shift="sub" font-size="0.7em">fil/système</tspan></text>`;
    } else {
      const sx = 110, sy = 60;
      s += `<rect x="${sx - 40}" y="${sy + 45}" width="80" height="10" fill="var(--chalk-dim)"/>`;
      s += `<text x="${sx}" y="${sy + 72}" font-size="8" fill="var(--chalk-dim)" text-anchor="middle">support</text>`;
      s += `<circle cx="${sx}" cy="${sy}" r="10" fill="var(--chalk)"/>`;
      s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + 40}" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#cfArrowP)"/>`;
      s += `<text x="${sx + 8}" y="${sy + 30}" font-size="8" fill="var(--coral)">P</text>`;
      s += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy - 40}" stroke="var(--teal)" stroke-width="2.5" marker-end="url(#cfArrow)"/>`;
      s += `<text x="${sx + 8}" y="${sy - 25}" font-size="8" fill="var(--teal)">F<tspan baseline-shift="sub" font-size="0.7em">support/système</tspan></text>`;
    }

    svg.innerHTML = s;
    readout.textContent = mode === "fil"
      ? "L'action du fil a pour direction celle du fil, et pour sens du système vers le fil."
      : "Sans frottement, l'action du support est perpendiculaire au support ; si le système est immobile, F_support/système = −P.";
  }
  btnFil.addEventListener("click", () => { mode = "fil"; draw(); });
  btnSupport.addEventListener("click", () => { mode = "support"; draw(); });
  draw();
}
