/* Animations du chapitre 7 — 2nde — « De l'atome à l'élément chimique ».
   Réécriture de uploads/animations-ch7-2nde.js : mêmes noms de fonctions et mêmes clés
   de configuration que la version du site. Positions déterministes (plus de « saut »
   aléatoire à chaque réglage), électrons en mouvement, vraies données d'éléments.
   Clés optionnelles ajoutées : *OutId (affichage des curseurs), svgId pour initSameElement.
   Nouvelle animation : initAtomScale (zoom de l'atome vers le noyau). */

var CH7S = {
  board: "#16261f", board2: "#1d3229", chalk: "#f2ede1", dim: "#c9c2b0",
  yellow: "#e8c468", teal: "#6bbfab", coral: "#d97a63",
  line: "rgba(242,237,225,0.28)", faint: "rgba(242,237,225,0.14)",
  font: "'Space Grotesk',sans-serif", hand: "Kalam,cursive"
};

var CH7S_SYM = ("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn " +
  "Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd " +
  "Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg").split(" ");
var CH7S_LIGHT = [null,
  ["hydrogène", 0], ["hélium", 2], ["lithium", 4], ["béryllium", 5], ["bore", 6], ["carbone", 6],
  ["azote", 7], ["oxygène", 8], ["fluor", 10], ["néon", 10], ["sodium", 12], ["magnésium", 12]];

function ch7sN(v) { return Math.round(v * 100) / 100; }
function ch7sEl(id) { return id ? document.getElementById(id) : null; }
function ch7sRnd(i) { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function ch7sSup(s) { return typeof toSuperscript === "function" ? toSuperscript(String(s)) : String(s); }

function ch7sListen(el, type, fn) {
  if (!el) return;
  el.__ch7sH = el.__ch7sH || {};
  if (el.__ch7sH[type]) el.removeEventListener(type, el.__ch7sH[type]);
  el.__ch7sH[type] = fn;
  el.addEventListener(type, fn);
}

function ch7sRange(el, min, max, step) {
  if (!el) return;
  el.min = String(min); el.max = String(max); el.step = String(step);
  const v = Number(el.value);
  if (el.value === "" || !isFinite(v) || v < min) el.value = String(min);
  else if (v > max) el.value = String(max);
}

/* Texte SVG : police déclarée ×4 puis réduite par transform, pour échapper au réglage
   « taille de police minimale » des navigateurs (sinon les petits textes grossissent). */
function ch7sText(x, y, txt, color, size, anchor, hand, weight) {
  return `<text transform="translate(${ch7sN(x)} ${ch7sN(y)}) scale(0.25)" font-size="${ch7sN(size * 4)}" fill="${color}" font-family="${hand ? CH7S.hand : CH7S.font}" text-anchor="${anchor || "start"}"${weight ? ` font-weight="${weight}"` : ""}>${txt}</text>`;
}

/* Écriture conventionnelle ᴬZX dans le SVG (A au-dessus de Z, alignés à droite). */
function ch7sNotation(x, y, A, Z, sym, size, charge) {
  const sub = size * 0.42;
  let s = ch7sText(x - 2, y - size * 0.42, A, CH7S.yellow, sub, "end", false, 600);
  s += ch7sText(x - 2, y + sub * 0.15, Z, CH7S.coral, sub, "end", false, 600);
  s += ch7sText(x, y, sym, CH7S.chalk, size, "start", true, 700);
  if (charge) s += ch7sText(x + sym.length * size * 0.5 + 2, y - size * 0.5, charge, CH7S.yellow, sub, "start", false, 600);
  return s;
}

/* Noyau compact (empilement en tournesol) : Z protons répartis parmi A nucléons. */
function ch7sNucleus(cx, cy, A, Z, s, t) {
  const rn = s * 1.04;
  let out = "";
  for (let i = A - 1; i >= 0; i--) {
    const r = s * Math.sqrt(i + 0.5), a = i * 2.39996;
    const x = cx + r * Math.cos(a) + 0.35 * Math.sin(t * 7 + i * 1.7);
    const y = cy + r * Math.sin(a) + 0.35 * Math.cos(t * 6 + i * 2.3);
    const isP = Math.floor((i + 1) * Z / A) > Math.floor(i * Z / A);
    out += `<circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="${ch7sN(rn)}" fill="${isP ? CH7S.coral : CH7S.teal}" stroke="${CH7S.board}" stroke-width="${ch7sN(rn * 0.14)}"/>`;
    if (isP && rn >= 3.2) {
      const h = rn * 0.5;
      out += `<path d="M${ch7sN(x - h)},${ch7sN(y)} H${ch7sN(x + h)} M${ch7sN(x)},${ch7sN(y - h)} V${ch7sN(y + h)}" stroke="${CH7S.board}" stroke-width="${ch7sN(rn * 0.22)}"/>`;
    }
  }
  return out;
}

/* Électron j en mouvement désordonné entre les rayons R1 et R2. */
function ch7sElecPos(j, t, cx, cy, R1, R2) {
  const a = ch7sRnd(j * 3 + 1), b = ch7sRnd(j * 3 + 2), c = ch7sRnd(j * 3 + 3);
  const w = (0.3 + 0.45 * b) * (c > 0.5 ? 1 : -1);
  const ang = j * 2.39996 + w * t;
  const rr = R1 + (R2 - R1) * (0.5 + 0.5 * Math.sin(t * (0.5 + b) + j * 1.3 + a * 6));
  return { x: cx + rr * Math.cos(ang), y: cy + rr * Math.sin(ang) * 0.9 };
}

function ch7sElectron(x, y, r, op) {
  return `<g${op != null && op < 1 ? ` opacity="${ch7sN(op)}"` : ""}><circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="${r}" fill="${CH7S.chalk}"/>`
    + (r >= 2.6 ? `<line x1="${ch7sN(x - r * 0.5)}" y1="${ch7sN(y)}" x2="${ch7sN(x + r * 0.5)}" y2="${ch7sN(y)}" stroke="${CH7S.board}" stroke-width="${ch7sN(r * 0.28)}"/>` : "")
    + `</g>`;
}

function ch7sLegend(x, y, size) {
  const g = size * 1.5;
  let s = `<circle cx="${x + 3}" cy="${y - 3}" r="3" fill="${CH7S.coral}"/>` + ch7sText(x + 10, y, "proton (+e)", CH7S.dim, size);
  s += `<circle cx="${x + 3}" cy="${y + g - 3}" r="3" fill="${CH7S.teal}"/>` + ch7sText(x + 10, y + g, "neutron", CH7S.dim, size);
  s += ch7sElectron(x + 3, y + 2 * g - 3, 3) + ch7sText(x + 10, y + 2 * g, "électron (−e)", CH7S.dim, size);
  return s;
}

/* HTML (readouts) */
function ch7sRow(ok, t) {
  return `<div style="display:flex;gap:12px;align-items:baseline;"><span style="color:${ok ? CH7S.teal : CH7S.coral};flex:none;">${ok ? "✓" : "✗"}</span><span>${t}</span></div>`;
}
function ch7sLine(t) { return `<div>${t}</div>`; }
function ch7sStrong(t, c) { return `<strong style="color:${c || CH7S.yellow}">${t}</strong>`; }
function ch7sNot(A, Z, sym, charge) {
  return `<span style="display:inline-flex;align-items:center;white-space:nowrap;"><span style="display:inline-flex;flex-direction:column;align-items:flex-end;font-size:0.62em;line-height:1.05;margin-right:0.08em;"><span style="color:${CH7S.yellow}">${A}</span><span style="color:${CH7S.coral}">${Z}</span></span><span style="font-family:${CH7S.hand};font-weight:700;color:${CH7S.chalk}">${sym}</span>${charge ? `<sup style="color:${CH7S.yellow}">${charge}</sup>` : ""}</span>`;
}

function ch7sToggle(pairs, isOn) {
  pairs.forEach(([b, k]) => {
    if (!b) return;
    const on = isOn(k);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.classList.toggle("active-hist", on);
    if (b.classList.contains("toggle-btn")) return;
    b.style.borderStyle = on ? "solid" : "dashed";
    b.style.borderColor = on ? CH7S.yellow : "rgba(242,237,225,0.22)";
    b.style.color = on ? CH7S.yellow : CH7S.dim;
  });
}

/* Boucle rAF liée au SVG ; s'arrête quand il quitte le document, ne dessine pas s'il est masqué. */
function ch7sLoop(svg, fn) {
  if (svg.__ch7sLoop) svg.__ch7sLoop.stop = true;
  const L = { stop: false }, t0 = performance.now();
  svg.__ch7sLoop = L;
  fn(0);
  function tick(now) {
    if (L.stop || !svg.isConnected) return;
    if (svg.getBoundingClientRect().width > 0) fn((now - t0) / 1000);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------- 1. Modèle de l'atome : neutralité électrique ---------- */
function initAtomModel(cfg) {
  const svg = ch7sEl(cfg.svgId);
  if (!svg) return;
  const zR = ch7sEl(cfg.zRangeId), readout = ch7sEl(cfg.readoutId), zOut = ch7sEl(cfg.zOutId);
  ch7sRange(zR, 1, 12, 1);
  const C = { x: 120, y: 92 };
  const getZ = () => (zR ? Number(zR.value) : 6);

  function frame(t) {
    const Z = getZ(), N = CH7S_LIGHT[Z][1], A = Z + N;
    let s = `<ellipse cx="${C.x}" cy="${C.y}" rx="80" ry="72" fill="rgba(242,237,225,0.03)" stroke="${CH7S.faint}" stroke-width="1" stroke-dasharray="3,3"/>`;
    s += ch7sNucleus(C.x, C.y, A, Z, Math.min(4.3, 19 / Math.sqrt(A)), t);
    for (let j = 0; j < Z; j++) {
      const p = ch7sElecPos(j, t, C.x, C.y, 40, 70);
      s += ch7sElectron(p.x, p.y, 3.6);
    }
    s += ch7sText(8, 18, `atome de ${CH7S_LIGHT[Z][0]}`, CH7S.chalk, 12, "start", true);
    s += ch7sNotation(216, 30, A, Z, CH7S_SYM[Z - 1], 22);
    s += ch7sLegend(6, 146, 8);
    svg.innerHTML = s;
  }

  function text() {
    const Z = getZ(), N = CH7S_LIGHT[Z][1];
    if (zOut) zOut.textContent = "Z = " + Z;
    if (!readout) return;
    readout.innerHTML = ch7sLine(`<strong style="color:${CH7S.chalk}">Atome de ${CH7S_LIGHT[Z][0]}</strong> (${CH7S_SYM[Z - 1]})`)
      + ch7sLine(`${ch7sStrong(Z, CH7S.coral)} protons : charge ${Z} × (+e)`)
      + ch7sLine(`${ch7sStrong(Z, CH7S.chalk)} électrons : charge ${Z} × (−e)`)
      + ch7sLine(`${ch7sStrong(N, CH7S.teal)} neutron${N > 1 ? "s" : ""} : charge nulle`)
      + `<div style="margin-top:10px;">Charge totale = ${ch7sStrong("0")} : l'atome est électriquement neutre.</div>`;
  }
  ch7sListen(zR, "input", text);
  text();
  ch7sLoop(svg, frame);
}

/* ---------- 2. Dimension de l'atome : zoom vers le noyau (nouvelle) ---------- */
function initAtomScale(cfg) {
  const svg = ch7sEl(cfg.svgId);
  if (!svg) return;
  const kR = ch7sEl(cfg.zoomRangeId), readout = ch7sEl(cfg.readoutId), kOut = ch7sEl(cfg.zoomOutId);
  const bPlay = ch7sEl(cfg.btnPlayId);
  ch7sRange(kR, 0, 5, 0.05);
  const C = { x: 120, y: 68 }, R0 = 62;
  let play = null;
  const getK = () => (kR ? Number(kR.value) : 0);

  function frame(t) {
    if (play) {
      const p = Math.min(1, (performance.now() - play) / 7000);
      if (kR) kR.value = String(Math.round(5 * (p * p * (3 - 2 * p)) * 100) / 100);
      if (p >= 1) play = null;
      text();
    }
    const k = getK(), R = R0 * Math.pow(10, k), Rn = R * 1e-5;
    let s = `<defs><clipPath id="${cfg.svgId}Clip"><rect x="0" y="0" width="240" height="130"/></clipPath></defs><g clip-path="url(#${cfg.svgId}Clip)">`;
    if (R < 3000) s += `<circle cx="${C.x}" cy="${C.y}" r="${ch7sN(R)}" fill="rgba(242,237,225,0.035)" stroke="${CH7S.dim}" stroke-width="1" stroke-dasharray="3,3"/>`;
    for (let j = 0; j < 6; j++) {
      const p = ch7sElecPos(j, t, C.x, C.y, 0.55 * R, 0.95 * R);
      if (p.x > -10 && p.x < 250 && p.y > -10 && p.y < 140) s += ch7sElectron(p.x, p.y, 3.4);
    }
    if (Rn >= 2.5) s += ch7sNucleus(C.x, C.y, 12, 6, Rn / Math.sqrt(12), t);
    else s += `<circle cx="${C.x}" cy="${C.y}" r="0.8" fill="${CH7S.coral}"/>`;
    s += `</g>`;
    if (Rn < 2.5) s += ch7sText(C.x + 6, C.y + 3, "← noyau (invisible)", CH7S.coral, 8);
    if (R < 3000 && R > 45 && R < 115) s += ch7sText(C.x, C.y - R * 0.9 + 10, "limite de l'atome", CH7S.dim, 8, "middle");
    if (k > 0.6 && Rn < 25) s += ch7sText(230, 18, "du vide", CH7S.yellow, 13, "end", true);
    /* échelle */
    const upm = R / 1e-10, p10 = Math.floor(Math.log10(110 / upm)), L = Math.pow(10, p10) * upm;
    s += `<line x1="10" y1="140" x2="${ch7sN(10 + L)}" y2="140" stroke="${CH7S.chalk}" stroke-width="1.6"/>`;
    s += `<line x1="10" y1="136" x2="10" y2="144" stroke="${CH7S.chalk}" stroke-width="1.2"/><line x1="${ch7sN(10 + L)}" y1="136" x2="${ch7sN(10 + L)}" y2="144" stroke="${CH7S.chalk}" stroke-width="1.2"/>`;
    s += ch7sText(14 + L, 143, `10${ch7sSup(p10)} m`, CH7S.chalk, 9);
    s += ch7sText(232, 143, `grossissement × ${Math.round(Math.pow(10, k)).toLocaleString("fr-FR")}`, CH7S.dim, 8.5, "end");
    svg.innerHTML = s;
  }

  function text() {
    const k = getK();
    if (kOut) kOut.textContent = "× " + Math.round(Math.pow(10, k)).toLocaleString("fr-FR");
    if (!readout) return;
    let msg;
    if (k < 0.6) msg = `On voit l'atome entier : son rayon est de l'ordre de ${ch7sStrong("10⁻¹⁰ m")}. Le noyau est bien trop petit pour être vu.`;
    else if (k < 4.4) msg = `On zoome vers le centre : les électrons sortent du champ et il ne reste que ${ch7sStrong("du vide")}. Le noyau n'est toujours pas visible.`;
    else msg = `Le noyau apparaît enfin : son rayon est de l'ordre de ${ch7sStrong("10⁻¹⁵ m")}, soit 10⁵ fois plus petit que celui de l'atome.`;
    readout.innerHTML = ch7sLine(msg)
      + `<div style="margin-top:10px;">L'atome est essentiellement constitué de vide : sa structure est ${ch7sStrong("lacunaire")}.</div>`;
  }
  ch7sListen(kR, "input", () => { play = null; text(); });
  ch7sListen(bPlay, "click", () => { if (kR) kR.value = "0"; play = performance.now(); });
  text();
  ch7sLoop(svg, frame);
}

/* ---------- 3. Écriture du noyau : A, Z → neutrons ---------- */
function initNucleusCalculator(cfg) {
  const svg = ch7sEl(cfg.svgId);
  if (!svg) return;
  const aR = ch7sEl(cfg.aRangeId), zR = ch7sEl(cfg.zRangeId), readout = ch7sEl(cfg.readoutId);
  const aOut = ch7sEl(cfg.aOutId), zOut = ch7sEl(cfg.zOutId);
  ch7sRange(aR, 1, 80, 1); ch7sRange(zR, 1, 80, 1);
  const get = () => ({ A: aR ? Number(aR.value) : 63, Z: zR ? Number(zR.value) : 29 });

  function frame(t) {
    const { A, Z } = get(), N = A - Z, sym = CH7S_SYM[Z - 1];
    let s = ch7sNotation(62, 76, A, Z, sym, 50);
    s += ch7sText(10, 112, "A : nombre de masse", CH7S.yellow, 8.5);
    s += ch7sText(10, 123, "Z : numéro atomique", CH7S.coral, 8.5);
    s += `<line x1="122" y1="12" x2="122" y2="118" stroke="${CH7S.faint}" stroke-width="1"/>`;
    s += ch7sNucleus(182, 56, A, Z, Math.min(5, 42 / Math.sqrt(A)), t);
    s += ch7sText(182, 114, `${Z} proton${Z > 1 ? "s" : ""}`, CH7S.coral, 9, "middle", false, 600);
    s += ch7sText(182, 125, `N = A − Z = ${N} neutron${N > 1 ? "s" : ""}`, CH7S.teal, 9, "middle", false, 600);
    svg.innerHTML = s;
  }

  function text() {
    const { A, Z } = get(), N = A - Z;
    if (aOut) aOut.textContent = "A = " + A;
    if (zOut) zOut.textContent = "Z = " + Z;
    if (!readout) return;
    readout.innerHTML = ch7sLine(`Noyau ${ch7sNot(A, Z, CH7S_SYM[Z - 1])} : ${A} nucléon${A > 1 ? "s" : ""}, dont ${Z} proton${Z > 1 ? "s" : ""}.`)
      + ch7sLine(`Nombre de neutrons : N = A − Z = ${A} − ${Z} = ${ch7sStrong(N)}`)
      + `<div style="margin-top:10px;">Masse de l'atome : m<sub>atome</sub> ≈ ${ch7sStrong(A)} × m<sub>nucléon</sub></div>`;
  }
  ch7sListen(aR, "input", () => { if (zR && Number(zR.value) > Number(aR.value)) zR.value = aR.value; text(); });
  ch7sListen(zR, "input", () => { if (aR && Number(zR.value) > Number(aR.value)) aR.value = zR.value; text(); });
  text();
  ch7sLoop(svg, frame);
}

/* ---------- 4. Formation d'un ion monoatomique ---------- */
function initIonFormation(cfg) {
  const svg = ch7sEl(cfg.svgId);
  if (!svg) return;
  const nR = ch7sEl(cfg.nRangeId), readout = ch7sEl(cfg.readoutId), nOut = ch7sEl(cfg.nOutId);
  const bL = ch7sEl(cfg.btnLoseId), bG = ch7sEl(cfg.btnGainId);
  const b1 = ch7sEl(cfg.btnN1Id), b2 = ch7sEl(cfg.btnN2Id);
  ch7sRange(nR, 1, 2, 1);
  let nBtn = 1;
  const ATOMS = {
    lose1: { sym: "Li", name: "lithium", Z: 3, N: 4, ion: "Li⁺", ch: "+" },
    lose2: { sym: "Mg", name: "magnésium", Z: 12, N: 12, ion: "Mg²⁺", ch: "2+" },
    gain1: { sym: "F", name: "fluor", Z: 9, N: 10, ion: "F⁻", ch: "−" },
    gain2: { sym: "O", name: "oxygène", Z: 8, N: 8, ion: "O²⁻", ch: "2−" }
  };
  let mode = cfg.mode || "lose";
  const C = { x: 120, y: 84 }, T1 = 1.4, T2 = 2.8, P = 6;
  const getN = () => (nR ? Number(nR.value) : nBtn);
  const cur = () => ATOMS[mode + getN()];

  function frame(t) {
    const n = getN(), at = cur(), Z = at.Z, tt = t % P;
    const prog = tt < T1 ? 0 : tt > T2 ? 1 : (tt - T1) / (T2 - T1), e = prog * prog * (3 - 2 * prog);
    const nE = mode === "lose" ? Z - n : Z + n;
    let s = ch7sNucleus(C.x, C.y, Z + at.N, Z, Math.min(4.2, 19 / Math.sqrt(Z + at.N)), t);
    for (let j = 0; j < Math.max(Z, nE); j++) {
      const p = ch7sElecPos(j, t, C.x, C.y, 32, 52);
      const moving = mode === "lose" ? j >= Z - n : j >= Z;
      if (!moving) { s += ch7sElectron(p.x, p.y, 3.6); continue; }
      const k = j - (mode === "lose" ? Z - n : Z), dir = { x: k ? -1 : 1, y: -0.35 };
      const out = { x: C.x + dir.x * 130, y: C.y + dir.y * 130 };
      const f = mode === "lose" ? e : 1 - e;
      const x = p.x + (out.x - p.x) * f, y = p.y + (out.y - p.y) * f;
      s += `<g><circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="6" fill="none" stroke="${CH7S.yellow}" stroke-width="1.2" opacity="${ch7sN(prog > 0 && prog < 1 ? 1 : 0)}"/></g>`;
      s += ch7sElectron(x, y, 3.6, 1 - f * 0.9);
    }
    const isIon = prog >= 1;
    s += ch7sText(8, 18, isIon ? `ion <tspan font-family="${CH7S.font}" font-weight="600">${at.ion}</tspan>` : `atome de ${at.name} ${at.sym}`, isIon ? CH7S.yellow : CH7S.chalk, 13, "start", true);
    s += ch7sText(232, 18, `charge : ${isIon ? at.ch.replace(/^(\d?)([+−])$/, "$2$1") + "e" : "0"}`, isIon ? CH7S.yellow : CH7S.dim, 11, "end", false, 600);
    s += ch7sText(8, 160, `protons : ${Z}`, CH7S.coral, 9, "start", false, 600);
    s += ch7sText(8, 171, `électrons : ${isIon ? nE : Z}`, CH7S.chalk, 9, "start", false, 600);
    if (isIon) s += ch7sText(232, 171, "noyau inchangé", CH7S.teal, 11, "end", true);
    svg.innerHTML = s;
  }

  function text() {
    const n = getN(), at = cur(), Z = at.Z, nE = mode === "lose" ? Z - n : Z + n;
    const ee = n > 1 ? "électrons" : "électron";
    if (nOut) nOut.textContent = n + " " + ee;
    if (!readout) return;
    const sign = mode === "lose" ? "+" : "−";
    readout.innerHTML = ch7sLine(`L'atome de ${at.name} (${Z} protons, ${Z} électrons) ${mode === "lose" ? "perd" : "gagne"} ${n} ${ee} : il ${mode === "lose" ? "en reste" : "en possède"} ${nE}.`)
      + ch7sLine(`Charge : ${Z} × (+e) + ${nE} × (−e) = ${ch7sStrong(sign + (n > 1 ? n : "") + "e")}`)
      + ch7sRow(true, `le noyau ne change pas : toujours ${Z} protons`)
      + `<div style="margin-top:10px;">On obtient l'ion ${ch7sStrong(at.ion)} : c'est un ${ch7sStrong(mode === "lose" ? "cation" : "anion", mode === "lose" ? CH7S.coral : CH7S.teal)}.</div>`;
  }

  function show() {
    ch7sToggle([[bL, "lose"], [bG, "gain"]], (x) => x === mode);
    ch7sToggle([[b1, 1], [b2, 2]], (x) => x === getN());
    text();
    ch7sLoop(svg, frame);
  }
  ch7sListen(bL, "click", () => { mode = "lose"; show(); });
  ch7sListen(bG, "click", () => { mode = "gain"; show(); });
  ch7sListen(b1, "click", () => { nBtn = 1; show(); });
  ch7sListen(b2, "click", () => { nBtn = 2; show(); });
  ch7sListen(nR, "input", show);
  show();
}

/* ---------- 5. Le même élément chimique (Z fixe) ---------- */
function initSameElement(cfg) {
  const svg = ch7sEl(cfg.svgId), readout = ch7sEl(cfg.readoutId);
  const b1 = ch7sEl(cfg.btnAtom1Id), bI = ch7sEl(cfg.btnIonId), b2 = ch7sEl(cfg.btnAtom2Id);
  const ENT = {
    atom1: { label: "Atome de cuivre", A: 63, Z: 29, N: 34, e: 29, ch: "" },
    ion: { label: "Ion cuivre (II)", A: 63, Z: 29, N: 34, e: 27, ch: "2+" },
    atom2: { label: "Autre atome de cuivre", A: 65, Z: 29, N: 36, e: 29, ch: "" }
  };
  let current = cfg.mode || "atom1";
  const C = { x: 78, y: 74 };

  function frame(t) {
    const en = ENT[current];
    let s = ch7sNucleus(C.x, C.y, en.A, en.Z, 26 / Math.sqrt(en.A), t);
    for (let j = 0; j < en.e; j++) {
      const p = ch7sElecPos(j, t, C.x, C.y, 38, 64);
      s += ch7sElectron(p.x, p.y, 2.3);
    }
    s += `<line x1="150" y1="14" x2="150" y2="136" stroke="${CH7S.faint}" stroke-width="1"/>`;
    s += ch7sNotation(184, 54, en.A, en.Z, "Cu", 34, en.ch);
    s += `<rect x="160" y="70" width="72" height="20" rx="5" fill="rgba(217,122,99,0.14)" stroke="${CH7S.coral}" stroke-width="1"/>`;
    s += ch7sText(196, 84, "Z = 29 protons", CH7S.coral, 9.5, "middle", false, 600);
    s += ch7sText(196, 106, `${en.N} neutrons`, en.N !== 34 ? CH7S.yellow : CH7S.teal, 9.5, "middle", false, 600);
    s += ch7sText(196, 122, `${en.e} électrons`, en.e !== 29 ? CH7S.yellow : CH7S.chalk, 9.5, "middle", false, 600);
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    const en = ENT[current];
    const diff = current === "ion" ? "2 électrons en moins (charge +2e)" : current === "atom2" ? "2 neutrons de plus (A = 65)" : "rien : c'est la référence";
    readout.innerHTML = ch7sLine(`<strong style="color:${CH7S.chalk}">${en.label}</strong> ${ch7sNot(en.A, en.Z, "Cu", en.ch)}`)
      + ch7sLine(`Protons (Z) = ${ch7sStrong(en.Z, CH7S.coral)} · neutrons = ${en.N} · électrons = ${en.e}`)
      + ch7sLine(`Ce qui change : ${diff}.`)
      + `<div style="margin-top:10px;">Même Z = 29 : ${ch7sStrong("même élément chimique")}, le cuivre.</div>`;
  }

  function show() {
    ch7sToggle([[b1, "atom1"], [bI, "ion"], [b2, "atom2"]], (x) => x === current);
    text();
    if (svg) ch7sLoop(svg, frame);
  }
  ch7sListen(b1, "click", () => { current = "atom1"; show(); });
  ch7sListen(bI, "click", () => { current = "ion"; show(); });
  ch7sListen(b2, "click", () => { current = "atom2"; show(); });
  show();
}

/* ---------- 6. Du microscopique au macroscopique ---------- */
function initMicroMacro(cfg) {
  const svg = ch7sEl(cfg.svgId);
  if (!svg) return;
  const readout = ch7sEl(cfg.readoutId);
  const bA = ch7sEl(cfg.btnAtomicId), bM = ch7sEl(cfg.btnMolecularId), bI = ch7sEl(cfg.btnIonicId);
  let mode = cfg.mode || "atomic";
  const M = { x: 46, y: 80, r: 15 }, Z = { x: 168, y: 78, r: 64 };
  const clip = cfg.svgId + "Clip";

  function sample() {
    if (mode === "atomic") {
      return `<rect x="16" y="64" width="60" height="32" rx="3" fill="rgba(201,194,176,0.25)" stroke="${CH7S.dim}" stroke-width="1.4"/>`
        + ch7sText(46, 116, "bloc de fer", CH7S.dim, 10, "middle", true);
    }
    if (mode === "molecular") {
      return `<path d="M20,52 L24,108 Q24,112 28,112 L64,112 Q68,112 68,108 L72,52" fill="none" stroke="${CH7S.dim}" stroke-width="1.4"/>`
        + `<path d="M21.6,72 L24,108 Q24,112 28,112 L64,112 Q68,112 68,108 L70.4,72 Z" fill="rgba(107,191,171,0.22)"/>`
        + ch7sText(46, 126, "eau liquide", CH7S.dim, 10, "middle", true);
    }
    let s = "";
    [[22, 92], [34, 90], [46, 93], [58, 91], [70, 92], [28, 81], [40, 80], [52, 82], [64, 80], [34, 70], [46, 69], [58, 71]].forEach(([x, y], i) => {
      s += `<rect x="${x - 5}" y="${y - 5}" width="10" height="10" fill="rgba(242,237,225,0.18)" stroke="${CH7S.chalk}" stroke-width="1" transform="rotate(${(i * 23) % 30 - 15} ${x} ${y})"/>`;
    });
    return s + ch7sText(46, 116, "grains de sel", CH7S.dim, 10, "middle", true);
  }

  function ion(x, y, r, color, sign) {
    const h = r * 0.45;
    return `<circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="${r}" fill="${color}" stroke="${CH7S.board}" stroke-width="0.8"/>`
      + `<path d="M${ch7sN(x - h)},${ch7sN(y)} H${ch7sN(x + h)}${sign === "+" ? ` M${ch7sN(x)},${ch7sN(y - h)} V${ch7sN(y + h)}` : ""}" stroke="${CH7S.board}" stroke-width="1.1"/>`;
  }

  function frame(t) {
    let s = `<defs><clipPath id="${clip}"><circle cx="${Z.x}" cy="${Z.y}" r="${Z.r}"/></clipPath></defs>`;
    s += sample();
    s += `<circle cx="${M.x}" cy="${M.y}" r="${M.r}" fill="none" stroke="${CH7S.yellow}" stroke-width="1.4"/>`;
    s += `<line x1="${M.x + 4}" y1="${M.y - M.r + 0.5}" x2="${Z.x - 16}" y2="${Z.y - Z.r + 2}" stroke="${CH7S.yellow}" stroke-width="0.8" stroke-dasharray="2,2"/>`;
    s += `<line x1="${M.x + 4}" y1="${M.y + M.r - 0.5}" x2="${Z.x - 16}" y2="${Z.y + Z.r - 2}" stroke="${CH7S.yellow}" stroke-width="0.8" stroke-dasharray="2,2"/>`;
    s += `<circle cx="${Z.x}" cy="${Z.y}" r="${Z.r}" fill="rgba(0,0,0,0.25)"/>`;
    s += `<g clip-path="url(#${clip})">`;
    if (mode === "atomic") {
      for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) {
        const x = Z.x + i * 13 + (j % 2 ? 6.5 : 0) + 0.6 * Math.sin(t * 8 + i + j * 3), y = Z.y + j * 11.3 + 0.6 * Math.cos(t * 7 + i * 2 + j);
        s += `<circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="6" fill="#8e9894" stroke="${CH7S.chalk}" stroke-width="0.8"/>`;
      }
    } else if (mode === "molecular") {
      for (let m = 0; m < 11; m++) {
        const a = ch7sRnd(m + 40), b = ch7sRnd(m + 80), c = ch7sRnd(m + 120);
        const x = Z.x + 46 * Math.sin(t * (0.25 + 0.3 * a) + m * 2.1), y = Z.y + 46 * Math.sin(t * (0.22 + 0.3 * b) + m * 1.3 + 1);
        const th = t * (c - 0.5) * 2 + m;
        [-0.91, 0.91].forEach((d) => {
          s += `<circle cx="${ch7sN(x + 6.6 * Math.cos(th + d))}" cy="${ch7sN(y + 6.6 * Math.sin(th + d))}" r="3.2" fill="${CH7S.chalk}"/>`;
        });
        s += `<circle cx="${ch7sN(x)}" cy="${ch7sN(y)}" r="5.2" fill="${CH7S.coral}" stroke="${CH7S.board}" stroke-width="0.8"/>`;
      }
    } else {
      for (let j = -6; j <= 6; j++) for (let i = -6; i <= 6; i++) {
        const x = Z.x + i * 12 + 0.5 * Math.sin(t * 8 + i + j * 3), y = Z.y + j * 12 + 0.5 * Math.cos(t * 7 + i * 2 + j);
        s += (i + j) % 2 === 0 ? ion(x, y, 5.4, CH7S.teal, "−") : ion(x, y, 3.6, CH7S.coral, "+");
      }
    }
    s += `</g><circle cx="${Z.x}" cy="${Z.y}" r="${Z.r}" fill="none" stroke="${CH7S.yellow}" stroke-width="1.4"/>`;
    s += ch7sText(46, 152, "macroscopique", CH7S.dim, 9, "middle");
    s += ch7sText(Z.x, 156, "microscopique", CH7S.dim, 9, "middle");
    if (mode === "molecular") {
      s += `<circle cx="10" cy="16" r="4" fill="${CH7S.coral}"/>` + ch7sText(17, 19, "O", CH7S.dim, 9);
      s += `<circle cx="10" cy="28" r="2.8" fill="${CH7S.chalk}"/>` + ch7sText(17, 31, "H", CH7S.dim, 9);
    } else if (mode === "ionic") {
      s += ion(10, 16, 4.4, CH7S.teal, "−") + ch7sText(18, 19, "Cl⁻", CH7S.dim, 9);
      s += ion(10, 29, 3.2, CH7S.coral, "+") + ch7sText(18, 32, "Na⁺", CH7S.dim, 9);
    } else {
      s += `<circle cx="10" cy="16" r="4" fill="#8e9894" stroke="${CH7S.chalk}" stroke-width="0.6"/>` + ch7sText(17, 19, "Fe", CH7S.dim, 9);
    }
    svg.innerHTML = s;
  }

  function text() {
    if (!readout) return;
    const T = {
      atomic: [ "Fer : espèce chimique <strong>atomique</strong>.", `Entité chimique : l'atome de fer, ${ch7sStrong("Fe")}.`, "Des atomes tous identiques, empilés de façon régulière." ],
      molecular: [ "Eau : espèce chimique <strong>moléculaire</strong>.", `Entité chimique : la molécule d'eau, ${ch7sStrong("H₂O")}.`, "Des molécules toutes identiques, en mouvement désordonné." ],
      ionic: [ "Chlorure de sodium : espèce chimique <strong>ionique</strong>.", `Entités chimiques : les ions ${ch7sStrong("Na⁺")} et ${ch7sStrong("Cl⁻")}.`, "Autant d'ions Na⁺ que d'ions Cl⁻ : le solide est électriquement neutre." ]
    }[mode];
    readout.innerHTML = T.map(ch7sLine).join("");
  }

  function show() {
    ch7sToggle([[bA, "atomic"], [bM, "molecular"], [bI, "ionic"]], (x) => x === mode);
    text();
    ch7sLoop(svg, frame);
  }
  ch7sListen(bA, "click", () => { mode = "atomic"; show(); });
  ch7sListen(bM, "click", () => { mode = "molecular"; show(); });
  ch7sListen(bI, "click", () => { mode = "ionic"; show(); });
  show();
}
