/* Animations du chapitre 19 — Lumière : ondes et particules — 1ère spé PC */
/* Grand format (SVG 1780 × 600), utilisé par les diapos et par la page du site (mise à l'échelle). */
var CH19_VERSION = 1;
var C19 = { chalk: "#f2ede1", dim: "#c9c2b0", y: "#e8c468", t: "#6bbfab", c: "#d97a63", board: "#16261f", fh: "Kalam, cursive", fb: "Space Grotesk, sans-serif" };
var C19_H = 6.63e-34, C19_C = 3.00e8, C19_EV = 1.60e-19;

function c19$(id) { return id ? document.getElementById(id) : null; }
function c19f(v) { return (+v).toFixed(1); }
function c19dec(v, d) { return (+v).toFixed(d == null ? 1 : d).replace(".", ",").replace("-", "−"); }
function c19int(v) { const n = Math.round(v), s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); return (n < 0 ? "−" : "") + s; }
function c19sup(n) { const m = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" }; return String(n).split("").map((c) => m[c] || c).join(""); }
function c19sci(v, d) {
  if (!v) return "0";
  d = d == null ? 2 : d;
  const a = Math.abs(v); let e = Math.floor(Math.log10(a)), m = a / Math.pow(10, e);
  if (+m.toFixed(d) >= 10) { m /= 10; e += 1; }
  if (e === 0) return (v < 0 ? "−" : "") + c19dec(m, d);
  return (v < 0 ? "−" : "") + c19dec(m, d) + " × 10" + c19sup(e);
}
function c19t(x, y, s, o) {
  o = o || {};
  return '<text x="' + c19f(x) + '" y="' + c19f(y) + '" font-size="' + (o.size || 28) + '" fill="' + (o.fill || C19.dim) + '" font-family="' + (o.font || C19.fh) + '" text-anchor="' + (o.anchor || "start") + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : "") + (o.op != null ? ' opacity="' + (+o.op).toFixed(2) + '"' : "") + '>' + s + '</text>';
}
function c19line(x1, y1, x2, y2, col, w, dash) {
  return '<line x1="' + c19f(x1) + '" y1="' + c19f(y1) + '" x2="' + c19f(x2) + '" y2="' + c19f(y2) + '" stroke="' + col + '" stroke-width="' + (w || 3) + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : "") + '/>';
}
function c19rect(x, y, w, h, o) {
  o = o || {};
  return '<rect x="' + c19f(x) + '" y="' + c19f(y) + '" width="' + c19f(w) + '" height="' + c19f(h) + '" rx="' + (o.rx || 0) + '" fill="' + (o.fill || "none") + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.w || 3) + '"' : "") + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : "") + (o.op != null ? ' opacity="' + (+o.op).toFixed(2) + '"' : "") + (o.extra || "") + '/>';
}
function c19circ(cx, cy, r, o) {
  o = o || {};
  return '<circle cx="' + c19f(cx) + '" cy="' + c19f(cy) + '" r="' + c19f(r) + '" fill="' + (o.fill || "none") + '"' + (o.stroke ? ' stroke="' + o.stroke + '" stroke-width="' + (o.w || 3) + '"' : "") + (o.op != null ? ' opacity="' + (+o.op).toFixed(2) + '"' : "") + '/>';
}
function c19arrow(x1, y1, x2, y2, col, w) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  if (len < 6) return "";
  const ux = dx / len, uy = dy / len, h = Math.min(24, len * 0.5), hw = 12 + (w || 4);
  const bx = x2 - ux * h, by = y2 - uy * h;
  return c19line(x1, y1, bx, by, col, w || 4) + '<polygon points="' + c19f(x2) + "," + c19f(y2) + " " + c19f(bx - uy * hw / 2) + "," + c19f(by + ux * hw / 2) + " " + c19f(bx + uy * hw / 2) + "," + c19f(by - ux * hw / 2) + '" fill="' + col + '"/>';
}
function c19panel() { return c19rect(1130, 20, 630, 560, { rx: 22, fill: "rgba(0,0,0,0.22)", stroke: "rgba(242,237,225,0.16)", w: 2 }); }
function c19readout(title, body, col) {
  return '<div style="display:flex;flex-direction:column;gap:6px;"><div style="font-family:Kalam,cursive;font-size:38px;color:' + (col || "#e8c468") + ';line-height:1.15;">' + title + '</div><div style="font-size:27px;line-height:1.5;text-wrap:pretty;color:#f2ede1;">' + body + '</div></div>';
}
function c19setBtn(b, on) {
  if (!b) return;
  b.style.background = on ? "#e8c468" : "transparent";
  b.style.color = on ? "#16261f" : "#f2ede1";
  b.style.borderColor = on ? "#e8c468" : "rgba(242,237,225,0.35)";
}
function c19ease(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function c19tween(st, dur, onFrame, done) {
  if (st.raf) cancelAnimationFrame(st.raf);
  const t0 = performance.now();
  const step = (now) => {
    const k = Math.min(1, (now - t0) / dur);
    onFrame(k);
    if (k < 1) st.raf = requestAnimationFrame(step); else { st.raf = 0; if (done) done(); }
  };
  st.raf = requestAnimationFrame(step);
}
function c19active(el) {
  const any = document.querySelector("[data-deck-active]");
  if (!any) return true;
  const s = el.closest("section");
  return !s || s.hasAttribute("data-deck-active");
}
var C19_IT = (s) => '<tspan font-style="italic">' + s + "</tspan>";
var C19_SUB = (s) => '<tspan font-size="0.6em" dy="0.3em">' + s + '</tspan><tspan dy="-0.3em">\u200b</tspan>';

/* couleur perçue d'une radiation visible (λ en nm) */
function c19rgb(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = (440 - nm) / 60; b = 1; }
  else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
  else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
  else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
  else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
  else if (nm <= 800) { r = 1; }
  let f = 1;
  if (nm < 420) f = 0.35 + 0.65 * (nm - 380) / 40; else if (nm > 700) f = 0.35 + 0.65 * (800 - nm) / 100;
  if (nm < 380 || nm > 800) f = 0;
  const c = (v) => Math.round(255 * Math.pow(Math.max(0, v * f), 0.8));
  return "rgb(" + c(r) + "," + c(g) + "," + c(b) + ")";
}
function c19colorName(nm) {
  if (nm < 400) return "ultraviolet";
  if (nm < 450) return "violet";
  if (nm < 490) return "bleu";
  if (nm < 570) return "vert";
  if (nm < 590) return "jaune";
  if (nm < 620) return "orangé";
  if (nm <= 800) return "rouge";
  return "infrarouge";
}
function c19gradStops(n0, n1) {
  let s = "";
  for (let i = 0; i <= 20; i++) { const nm = n0 + (n1 - n0) * i / 20; s += '<stop offset="' + (i * 5) + '%" stop-color="' + c19rgb(nm) + '"/>'; }
  return s;
}

/* ------------------------------------------------------------------ */
/* 1. Le spectre électromagnétique : λ = c / ν                         */
/* ------------------------------------------------------------------ */
var CH19_DOM = [
  { k: "g", max: 1e-11, name: "rayons γ", short: "γ", ex: "radioactivité", txt: "Émis lors de désintégrations radioactives : très énergétiques, ils traversent la matière." },
  { k: "x", max: 1e-8, name: "rayons X", short: "X", ex: "radiographie, scanner", txt: "Ils traversent les tissus mous mais sont absorbés par les os : c'est le principe de la radiographie." },
  { k: "uv", max: 4e-7, name: "ultraviolets", short: "UV", ex: "bronzage, stérilisation", txt: "Invisibles pour l'œil, ils provoquent le bronzage et sont utilisés pour stériliser." },
  { k: "vis", max: 8e-7, name: "lumière visible", short: "", ex: "vision humaine", txt: "Le seul domaine perçu par l'œil humain : de 400 nm (violet) à 800 nm (rouge)." },
  { k: "ir", max: 1e-3, name: "infrarouges", short: "IR", ex: "télécommande, caméra thermique", txt: "Émis par tous les corps chauds : caméras thermiques, télécommandes." },
  { k: "mo", max: 0.3, name: "micro-ondes", short: "micro-ondes", ex: "four, WiFi, téléphonie mobile", txt: "Utilisées pour les communications sans fil et pour chauffer les aliments." },
  { k: "radio", max: 1e4, name: "ondes radio", short: "ondes radio", ex: "radio, télévision", txt: "Les plus grandes longueurs d'onde : radio FM, télévision, radioastronomie." }
];
function c19dom(lam) { for (let i = 0; i < CH19_DOM.length; i++) if (lam < CH19_DOM[i].max) return CH19_DOM[i]; return CH19_DOM[CH19_DOM.length - 1]; }
var CH19_PRESET = { g: 1e-12, x: 1e-10, uv: 2e-7, vis: 6e-7, ir: 1e-5, mo: 1.2e-1, radio: 3 };

function initCh19Spectrum(cfg) {
  const svg = c19$(cfg.svgId), ro = c19$(cfg.readoutId), lIn = c19$(cfg.lId), lV = c19$(cfg.lValId), box = c19$(cfg.presetBoxId);
  if (!svg || svg.__c19) return; svg.__c19 = 1;
  const X0 = 60, XW = 1000, LMIN = -13, LMAX = 3, BY = 200, BH = 80, WY = 470;
  const xl = (lg) => X0 + (lg - LMIN) / (LMAX - LMIN) * XW;
  const btns = box ? Array.prototype.slice.call(box.querySelectorAll("[data-dom]")) : [];
  let lam = 6e-7, wave = null, wpx = 60, wcol = C19.dim, drawn = false;
  const t0 = performance.now();
  function render() {
    const lg = Math.log10(lam), D = c19dom(lam), nu = C19_C / lam, nm = lam * 1e9;
    if (lV) lV.textContent = c19sci(lam, 2) + " m";
    btns.forEach((b) => c19setBtn(b, b.getAttribute("data-dom") === D.k));
    let s = '<defs><linearGradient id="' + cfg.svgId + 'G" x1="0" x2="1" y1="0" y2="0">' + c19gradStops(400, 800) + '</linearGradient></defs>';
    // axe des fréquences
    s += c19line(X0, 150, X0 + XW, 150, C19.dim, 2) + c19t(X0, 110, C19_IT("ν") + " (Hz)", { size: 26 });
    for (let k = 6; k <= 20; k++) { const x = xl(Math.log10(C19_C) - k); s += c19line(x, 142, x, 158, C19.dim, 2); if (k % 2 === 0) s += c19t(x, 134, "10" + c19sup(k), { size: 22, anchor: "middle" }); }
    // bandes des domaines
    let prev = LMIN;
    CH19_DOM.forEach((d, i) => {
      const a = xl(prev), b = xl(Math.min(LMAX, Math.log10(d.max)));
      if (d.k === "vis") s += c19rect(a, BY, b - a, BH, { fill: "url(#" + cfg.svgId + "G)" });
      else s += c19rect(a, BY, b - a, BH, { fill: i % 2 ? "rgba(242,237,225,0.14)" : "rgba(242,237,225,0.07)" });
      if (d.short) s += c19t((a + b) / 2, BY + BH / 2 + 9, d.short, { size: d.short.length > 4 ? 23 : 28, fill: d.k === D.k ? C19.y : C19.chalk, anchor: "middle" });
      if (i > 0) s += c19line(a, BY, a, BY + BH, C19.c, 2, "5,5");
      prev = Math.log10(d.max);
    });
    s += c19rect(X0, BY, XW, BH, { stroke: "rgba(242,237,225,0.35)", w: 2 });
    const xv = (xl(Math.log10(4e-7)) + xl(Math.log10(8e-7))) / 2;
    s += c19t(xv, BY - 14, "visible", { size: 22, fill: C19.chalk, anchor: "middle" });
    // axe des longueurs d'onde
    s += c19line(X0, BY + BH + 20, X0 + XW, BY + BH + 20, C19.dim, 2);
    for (let n = LMIN; n <= LMAX; n++) { const x = xl(n); s += c19line(x, BY + BH + 12, x, BY + BH + 28, C19.dim, 2); s += c19t(x, BY + BH + 56, "10" + c19sup(n), { size: 21, anchor: "middle" }); }
    s += c19t(X0 + XW, BY + BH + 92, C19_IT("λ") + " (m)", { size: 26, anchor: "end" });
    // curseur
    const xc = xl(lg);
    s += c19line(xc, 160, xc, BY + BH + 30, C19.y, 4);
    s += '<polygon points="' + c19f(xc - 12) + ',' + (BY - 30) + ' ' + c19f(xc + 12) + ',' + (BY - 30) + ' ' + c19f(xc) + ',' + (BY - 8) + '" fill="' + C19.y + '"/>';
    // onde schématique
    wpx = 26 + (lg - LMIN) / (LMAX - LMIN) * 440;
    wcol = D.k === "vis" ? c19rgb(nm) : C19.dim;
    s += c19line(X0, WY, X0 + XW, WY, "rgba(242,237,225,0.12)", 2);
    s += '<path data-wave="1" d="" fill="none" stroke="' + wcol + '" stroke-width="5" stroke-linecap="round"/>';
    s += c19t(X0, 590, "onde représentée schématiquement : longueur d'onde non à l'échelle", { size: 22 });
    // panneau
    s += c19panel();
    s += c19t(1165, 80, "domaine", { size: 26 });
    s += c19t(1165, 140, D.name, { size: 52, fill: D.k === "vis" ? c19rgb(Math.max(420, Math.min(700, nm))) : C19.t });
    s += c19t(1165, 215, C19_IT("λ") + " = " + c19sci(lam, 2) + " m", { size: 40, fill: C19.chalk });
    if (lam > 1e-9 && lam < 1e-5) s += c19t(1165, 260, "soit " + c19int(nm) + " nm", { size: 30, fill: C19.dim });
    s += c19line(1165, 295, 1725, 295, "rgba(242,237,225,0.16)", 2);
    s += c19t(1165, 355, C19_IT("ν") + " = " + C19_IT("c") + " / " + C19_IT("λ") + " = 3,00 × 10⁸ / " + c19sci(lam, 2), { size: 28, fill: C19.chalk });
    s += c19t(1165, 435, C19_IT("ν") + " = " + c19sci(nu, 2) + " Hz", { size: 50, fill: C19.y });
    s += c19t(1165, 520, "ex. : " + D.ex, { size: 28, fill: C19.dim });
    svg.innerHTML = s;
    wave = svg.querySelector("[data-wave]");
    if (ro) ro.innerHTML = c19readout(D.name.charAt(0).toUpperCase() + D.name.slice(1) + " : <em>λ</em> = " + c19sci(lam, 2) + " m", D.txt + " Quand <em>λ</em> augmente, la fréquence <em>ν</em> diminue : les deux axes sont gradués en sens inverse.", D.k === "vis" ? "#e8c468" : "#6bbfab");
    paint(performance.now());
  }
  function paint(now) {
    if (!wave) return;
    const ph = ((now - t0) / 1000) * 120;
    let d = "";
    for (let x = 0; x <= XW; x += 4) d += (x ? "L" : "M") + c19f(X0 + x) + "," + c19f(WY - 70 * Math.sin(2 * Math.PI * (x - ph) / wpx));
    wave.setAttribute("d", d);
  }
  function loop(now) { requestAnimationFrame(loop); if (drawn && !c19active(svg)) return; drawn = true; paint(now); }
  lIn.addEventListener("input", () => { lam = Math.pow(10, +lIn.value); render(); });
  btns.forEach((b) => b.addEventListener("click", () => { lam = CH19_PRESET[b.getAttribute("data-dom")]; lIn.value = Math.log10(lam); render(); b.blur(); }));
  lIn.value = Math.log10(lam);
  render();
  requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ */
/* 2. Énergie d'un photon : E = h × ν = h × c / λ                      */
/* ------------------------------------------------------------------ */
function initCh19Photon(cfg) {
  const svg = c19$(cfg.svgId), ro = c19$(cfg.readoutId), lIn = c19$(cfg.lId), lV = c19$(cfg.lValId), box = c19$(cfg.presetBoxId);
  if (!svg || svg.__c19) return; svg.__c19 = 1;
  const btns = box ? Array.prototype.slice.call(box.querySelectorAll("[data-nm]")) : [];
  const BX0 = 200, BX1 = 1080, BY = 220, EX0 = 60, EW = 1000, EMAX = 6.5, EY = 450;
  const xe = (e) => EX0 + Math.min(e, EMAX) / EMAX * EW;
  let packs = [], col = C19.dim, per = 50, drawn = false;
  const t0 = performance.now(), SP = 260, GAP = 330;
  function render() {
    const nm = +lIn.value, lam = nm * 1e-9, nu = C19_C / lam, EJ = C19_H * nu, Ee = EJ / C19_EV;
    if (lV) lV.textContent = nm + " nm";
    btns.forEach((b) => c19setBtn(b, +b.getAttribute("data-nm") === nm));
    col = nm >= 380 && nm <= 800 ? c19rgb(nm) : C19.dim; per = nm / 9;
    let s = '<defs><linearGradient id="' + cfg.svgId + 'G" x1="0" x2="1" y1="0" y2="0">' + c19gradStops(800, 400) + '</linearGradient></defs>';
    // source
    s += c19rect(60, BY - 70, 110, 140, { rx: 16, fill: "rgba(232,196,104,0.08)", stroke: C19.y, w: 3 });
    s += c19t(115, BY + 10, "source", { size: 24, fill: C19.y, anchor: "middle" });
    s += c19t(BX0, 110, "faisceau de photons de longueur d'onde " + C19_IT("λ") + " = " + nm + " nm", { size: 28, fill: C19.chalk });
    s += '<g data-packs="1"></g>';
    // échelle d'énergie
    const v0 = xe(C19_H * C19_C / 800e-9 / C19_EV), v1 = xe(C19_H * C19_C / 400e-9 / C19_EV);
    s += c19t(EX0, EY - 70, "énergie d'un photon (eV)", { size: 28, fill: C19.chalk });
    s += c19rect(EX0, EY - 40, EW, 50, { fill: "rgba(242,237,225,0.06)", stroke: "rgba(242,237,225,0.3)", w: 2 });
    s += c19rect(v0, EY - 40, v1 - v0, 50, { fill: "url(#" + cfg.svgId + "G)" });
    s += c19t((EX0 + v0) / 2, EY - 6, "IR", { size: 26, fill: C19.chalk, anchor: "middle" });
    s += c19t((v1 + EX0 + EW) / 2, EY - 6, "UV", { size: 26, fill: C19.chalk, anchor: "middle" });
    for (let e = 0; e <= 6; e++) s += c19line(xe(e), EY + 10, xe(e), EY + 24, C19.dim, 2) + c19t(xe(e), EY + 54, String(e), { size: 24, anchor: "middle" });
    const xc = xe(Ee);
    s += c19line(xc, EY - 52, xc, EY + 22, C19.y, 5) + '<polygon points="' + c19f(xc - 13) + ',' + (EY - 66) + ' ' + c19f(xc + 13) + ',' + (EY - 66) + ' ' + c19f(xc) + ',' + (EY - 46) + '" fill="' + C19.y + '"/>';
    s += c19t(EX0, 580, "plus " + C19_IT("λ") + " est petite, plus le photon transporte d'énergie", { size: 26, fill: C19.t });
    // panneau
    s += c19panel();
    s += c19t(1165, 95, C19_IT("E") + C19_SUB("photon") + " = " + C19_IT("h") + " × " + C19_IT("ν") + " = " + C19_IT("h") + " × " + C19_IT("c") + " / " + C19_IT("λ"), { size: 38, fill: C19.chalk });
    s += c19t(1165, 165, C19_IT("ν") + " = " + c19sci(nu, 2) + " Hz", { size: 32, fill: C19.chalk });
    s += c19t(1165, 215, "6,63 × 10⁻³⁴ × " + c19sci(nu, 2), { size: 28, fill: C19.dim });
    s += c19t(1165, 295, C19_IT("E") + C19_SUB("photon") + " = " + c19sci(EJ, 2) + " J", { size: 50, fill: C19.y });
    s += c19line(1165, 335, 1725, 335, "rgba(242,237,225,0.16)", 2);
    s += c19t(1165, 395, "1 eV = 1,60 × 10⁻¹⁹ J", { size: 30 });
    s += c19t(1165, 470, C19_IT("E") + C19_SUB("photon") + " = " + c19dec(Ee, 2) + " eV", { size: 50, fill: C19.t });
    s += c19t(1165, 540, "rayonnement : " + c19colorName(nm), { size: 30, fill: nm >= 380 && nm <= 800 ? col : C19.dim });
    svg.innerHTML = s;
    const g = svg.querySelector("[data-packs]");
    let pk = "";
    for (let i = 0; i < 4; i++) pk += '<path d="" fill="none" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>';
    g.innerHTML = pk;
    packs = Array.prototype.slice.call(g.querySelectorAll("path"));
    if (ro) ro.innerHTML = c19readout("Photon " + (nm >= 400 && nm <= 800 ? "de lumière " + c19colorName(nm) : "du domaine " + c19colorName(nm)) + " : " + c19dec(Ee, 2) + " eV", "Chaque photon transporte un quantum d'énergie <em>E</em><sub>photon</sub> = <em>h</em> × <em>c</em> / <em>λ</em>. Un photon violet (400 nm) transporte deux fois plus d'énergie qu'un photon rouge (800 nm).");
    paint(performance.now());
  }
  function paint(now) {
    const d = ((now - t0) / 1000) * SP, L = BX1 - BX0, len = per * 3.2;
    packs.forEach((p, i) => {
      const c = BX0 + ((d + i * GAP) % (GAP * 4)) - len / 2;
      let path = "";
      for (let x = -len / 2; x <= len / 2; x += 3) {
        const xx = c + x; if (xx < BX0 || xx > BX1) continue;
        const env = Math.exp(-Math.pow(x / (len / 3.2), 2));
        path += (path ? "L" : "M") + c19f(xx) + "," + c19f(BY - 55 * env * Math.sin(2 * Math.PI * x / per));
      }
      p.setAttribute("d", path);
    });
  }
  function loop(now) { requestAnimationFrame(loop); if (drawn && !c19active(svg)) return; drawn = true; paint(now); }
  lIn.addEventListener("input", render);
  btns.forEach((b) => b.addEventListener("click", () => { lIn.value = b.getAttribute("data-nm"); render(); b.blur(); }));
  render();
  requestAnimationFrame(loop);
}

/* ------------------------------------------------------------------ */
/* 3. Émission et absorption : atome d'hydrogène                       */
/* ------------------------------------------------------------------ */
var CH19_LV = [-13.6, -3.39, -1.51, -0.85, -0.54];
function initCh19Atom(cfg) {
  const svg = c19$(cfg.svgId), ro = c19$(cfg.readoutId), rst = c19$(cfg.resetId);
  if (!svg || svg.__c19) return; svg.__c19 = 1;
  const AX = 210, L0 = 225, L1 = 500, EXc = 330, SX0 = 690, SW = 400, NM0 = 380, NM1 = 780;
  const ly = (i) => i < 0 ? 100 : i === 0 ? 540 : 100 + (-CH19_LV[i]) / 3.6 * 330;
  const xs = (nm) => SX0 + (nm - NM0) / (NM1 - NM0) * SW;
  const st = {};
  let cur = 0, tr = null, k = 1, emis = {}, abso = {}, busy = false;
  function sq(xa, xb, y, colr, headRight) {
    let d = "";
    for (let x = xa; x <= xb; x += 3) d += (d ? "L" : "M") + c19f(x) + "," + c19f(y - 10 * Math.sin((x - xa) / 26 * 2 * Math.PI));
    const hx = headRight ? xb : xa, dir = headRight ? 1 : -1;
    return '<path d="' + d + '" fill="none" stroke="' + colr + '" stroke-width="4" stroke-linecap="round"/>' + '<polygon points="' + c19f(hx + dir * 16) + ',' + y + ' ' + c19f(hx) + ',' + (y - 10) + ' ' + c19f(hx) + ',' + (y + 10) + '" fill="' + colr + '"/>';
  }
  function info(t) {
    const Ei = CH19_LV[t.from], Ef = CH19_LV[t.to], dE = Math.abs(Ef - Ei), dJ = dE * C19_EV, nm = C19_H * C19_C / dJ * 1e9;
    return { Ei: Ei, Ef: Ef, dE: dE, dJ: dJ, nm: nm, em: t.to < t.from };
  }
  function render() {
    let s = "";
    // axe et niveaux
    s += c19arrow(AX, 575, AX, 50, C19.dim, 3) + c19t(AX + 14, 62, C19_IT("E") + " (eV)", { size: 26 });
    s += c19line(AX - 12, 466, AX + 12, 458, C19.dim, 3) + c19line(AX - 12, 480, AX + 12, 472, C19.dim, 3);
    s += c19line(L0, ly(-1) , L1, ly(-1), "rgba(242,237,225,0.4)", 2, "8,6");
    s += c19t(AX - 14, 107, C19_IT("E") + C19_SUB("∞") + " = 0", { size: 22, anchor: "end" }) + c19t(L1 + 12, 107, "ionisé", { size: 22 });
    CH19_LV.forEach((E, i) => {
      const y = ly(i), on = i === cur && k >= 1;
      s += c19line(L0, y, L1, y, on ? C19.y : C19.chalk, on ? 4 : 3);
      s += c19t(AX - 14, y + 8, C19_IT("E") + C19_SUB(String(i + 1)) + " = " + c19dec(E, 2), { size: 22, anchor: "end", fill: on ? C19.y : C19.dim });
    });
    s += c19t(L1 + 12, ly(0) + 8, "fondamental", { size: 22 });
    s += c19t(L1 + 12, ly(2) + 8, "excités", { size: 22 });
    // transition
    let ey = ly(cur);
    if (tr) {
      const I = info(tr), y0 = ly(tr.from), y1 = ly(tr.to), colr = I.nm >= 380 && I.nm <= 800 ? c19rgb(I.nm) : C19.dim;
      const ke = I.em ? Math.min(1, k / 0.5) : Math.max(0, (k - 0.5) / 0.5);
      const kp = I.em ? Math.max(0, (k - 0.4) / 0.6) : Math.min(1, k / 0.5);
      ey = y0 + (y1 - y0) * c19ease(ke);
      if (ke > 0) s += c19arrow(EXc, y0, EXc, ey, I.em ? C19.c : C19.t, 4);
      const ym = (y0 + y1) / 2;
      if (I.em && kp > 0) { const xb = 360 + 260 * kp; s += sq(Math.max(360, xb - 140), xb, ym, colr, true); }
      if (!I.em && kp < 1) { const xa = 620 - 260 * kp; s += sq(xa, Math.min(640, xa + 140), ym, colr, false); }
      if (k >= 1) s += c19t(500, ym - 22, "photon", { size: 22, fill: C19.chalk, anchor: "middle" });
    }
    s += c19circ(EXc, ey, 13, { fill: C19.y, stroke: C19.board, w: 3 });
    // zone cliquable
    s += c19rect(L0 - 10, 80, L1 - L0 + 140, 490, { fill: "rgba(0,0,0,0)", extra: ' data-hit="1" style="cursor:pointer"' });
    // spectres
    const strip = (y, title, cont, lines, lineCol) => {
      let o = c19t(SX0, y - 18, title, { size: 28, fill: C19.chalk });
      o += c19rect(SX0, y, SW, 70, { fill: cont ? "url(#" + cfg.svgId + "G)" : "#050807", stroke: "rgba(242,237,225,0.3)", w: 2 });
      Object.keys(lines).forEach((key) => { const nm = +key; if (nm >= NM0 && nm <= NM1) o += c19line(xs(nm), y + 2, xs(nm), y + 68, lineCol ? lineCol(nm) : "#050807", 5); });
      for (let n = 400; n <= 700; n += 100) o += c19line(xs(n), y + 72, xs(n), y + 84, C19.dim, 2) + c19t(xs(n), y + 108, String(n), { size: 22, anchor: "middle" });
      return o;
    };
    s += '<defs><linearGradient id="' + cfg.svgId + 'G" x1="0" x2="1" y1="0" y2="0">' + c19gradStops(NM0, NM1) + '</linearGradient></defs>';
    s += strip(140, "spectre d'émission", false, emis, c19rgb);
    s += strip(340, "spectre d'absorption", true, abso, null);
    s += c19t(SX0 + SW, 560, C19_IT("λ") + " (nm)", { size: 24, anchor: "end" });
    // panneau
    s += c19panel();
    if (tr) {
      const I = info(tr), vis = I.nm >= 380 && I.nm <= 800;
      s += c19t(1165, 85, (I.em ? "émission" : "absorption") + " : " + C19_IT("E") + C19_SUB(String(tr.from + 1)) + " → " + C19_IT("E") + C19_SUB(String(tr.to + 1)), { size: 40, fill: I.em ? C19.c : C19.t });
      s += c19t(1165, 150, "Δ" + C19_IT("E") + " = |" + C19_IT("E") + C19_SUB("final") + " − " + C19_IT("E") + C19_SUB("initial") + "|", { size: 32, fill: C19.chalk });
      s += c19t(1165, 205, "Δ" + C19_IT("E") + " = |" + c19dec(I.Ef, 2) + " − (" + c19dec(I.Ei, 2) + ")| = " + c19dec(I.dE, 2) + " eV", { size: 30, fill: C19.chalk });
      s += c19t(1165, 260, "Δ" + C19_IT("E") + " = " + c19sci(I.dJ, 2) + " J", { size: 34, fill: C19.y });
      s += c19line(1165, 295, 1725, 295, "rgba(242,237,225,0.16)", 2);
      s += c19t(1165, 355, C19_IT("λ") + " = " + C19_IT("h") + " × " + C19_IT("c") + " / Δ" + C19_IT("E"), { size: 34, fill: C19.chalk });
      s += c19t(1165, 440, C19_IT("λ") + " = " + c19int(I.nm) + " nm", { size: 56, fill: C19.y });
      s += c19t(1165, 520, vis ? "visible : raie " + c19colorName(I.nm) : (I.nm < 380 ? "ultraviolet : hors du visible" : "infrarouge : hors du visible"), { size: 30, fill: vis ? c19rgb(I.nm) : C19.dim });
    } else {
      s += c19t(1165, 90, "atome d'hydrogène", { size: 40, fill: C19.t });
      s += c19t(1165, 160, "état actuel : " + C19_IT("E") + C19_SUB(String(cur + 1)) + " = " + c19dec(CH19_LV[cur], 2) + " eV", { size: 32, fill: C19.chalk });
      s += c19t(1165, 250, "clique sur un niveau d'énergie :", { size: 30 });
      s += c19t(1165, 300, "plus haut → absorption d'un photon", { size: 30, fill: C19.t });
      s += c19t(1165, 350, "plus bas → émission d'un photon", { size: 30, fill: C19.c });
    }
    svg.innerHTML = s;
  }
  function msg() {
    if (!ro) return;
    if (!tr) { ro.innerHTML = c19readout("L'atome est dans son état fondamental", "Clique sur un niveau plus haut pour lui faire absorber un photon, puis sur un niveau plus bas pour qu'il en émette un. Chaque raie visible s'ajoute au spectre correspondant.", "#6bbfab"); return; }
    const I = info(tr), vis = I.nm >= 380 && I.nm <= 800;
    ro.innerHTML = I.em
      ? c19readout("Émission : l'atome perd " + c19dec(I.dE, 2) + " eV", "Il émet un photon de longueur d'onde " + c19int(I.nm) + " nm. " + (vis ? "Elle appartient au visible : une raie colorée apparaît dans le spectre d'émission." : "Elle n'appartient pas au visible : aucune raie n'apparaît sur le spectre affiché."), "#d97a63")
      : c19readout("Absorption : l'atome gagne " + c19dec(I.dE, 2) + " eV", "Il absorbe un photon de longueur d'onde " + c19int(I.nm) + " nm. " + (vis ? "Elle appartient au visible : une raie noire apparaît dans le spectre de la lumière blanche, à la même position que la raie d'émission." : "Elle n'appartient pas au visible : aucune raie n'apparaît sur le spectre affiché."), "#6bbfab");
  }
  function go(to) {
    if (busy || to === cur) return;
    tr = { from: cur, to: to }; busy = true; k = 0;
    c19tween(st, 1300, (x) => { k = x; render(); }, () => {
      const I = info(tr), key = Math.round(I.nm);
      if (I.em) emis[key] = 1; else abso[key] = 1;
      cur = to; busy = false; k = 1; render(); msg();
    });
  }
  svg.addEventListener("click", (e) => {
    const hit = e.target && e.target.getAttribute && e.target.getAttribute("data-hit");
    if (!hit) return;
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM(); if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    let best = -1, bd = 1e9;
    CH19_LV.forEach((E, i) => { const d = Math.abs(ly(i) - p.y); if (d < bd) { bd = d; best = i; } });
    if (best >= 0 && bd < 40) go(best);
  });
  if (rst) rst.addEventListener("click", () => { rst.blur(); if (busy) return; emis = {}; abso = {}; tr = null; cur = 0; render(); msg(); });
  render(); msg();
}

/* Site web : mise à l'échelle des blocs d'animation (largeur 1780) */
function initCh19Stages() {
  document.querySelectorAll(".ch19-stage").forEach((outer) => {
    const inner = outer.firstElementChild;
    if (!inner || outer.__fit) return;
    outer.__fit = true;
    const fit = () => {
      const s = outer.clientWidth / 1780;
      if (!s) return;
      inner.style.transform = "scale(" + s + ")";
      outer.style.height = Math.round(inner.offsetHeight * s) + "px";
    };
    const ro = new ResizeObserver(fit); ro.observe(inner); ro.observe(outer);
    fit();
    window.addEventListener("load", fit);
    window.addEventListener("resize", fit);
    document.querySelectorAll(".mode-tab").forEach((b) => b.addEventListener("click", () => setTimeout(fit, 0)));
  });
}
