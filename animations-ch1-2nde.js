/* Animations du chapitre 1 — 2nde — « Introduction : la précision en physique-chimie »
   Version site (révision) : mêmes fonctions init*, mêmes identifiants HTML que la
   version précédente — seul le contenu des SVG change (animé, plus lisible). */

/* ---------- Arrondi à N chiffres significatifs ---------- */
function roundToSig(x, n) {
  if (x === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const power = n - d;
  const magnitude = Math.pow(10, power);
  return Math.round(x * magnitude) / magnitude;
}
// Un nombre JS ne garde jamais de zéro final : pour AFFICHER le bon nombre de CS,
// on formate en chaîne avec le bon nombre de décimales.
function formatSig(x, n) {
  const rounded = roundToSig(x, n);
  if (rounded === 0) return (0).toFixed(Math.max(0, n - 1));
  const d = Math.ceil(Math.log10(Math.abs(rounded)));
  const decimals = Math.max(0, n - d);
  return rounded.toFixed(decimals);
}

/* ---------- Outils communs à ce chapitre ---------- */
const CH1 = (() => {
  const reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = t => { t = clamp(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
  const prog = (t, a, b) => ease((t - a) / (b - a));
  const fr = (x, d) => Number(x).toFixed(d).replace(".", ",").replace("-", "−");
  const frs = s => String(s).replace(".", ",");
  const txt = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" font-size="${o.size || 13}" fill="${o.fill || "var(--chalk)"}" text-anchor="${o.anchor || "middle"}"` +
    (o.weight ? ` font-weight="${o.weight}"` : "") +
    (o.hand ? ` font-family="Kalam, 'Segoe Print', cursive"` : "") +
    (o.op != null ? ` opacity="${o.op}"` : "") + `>${s}</text>`;
  const ln = (x1, y1, x2, y2, stroke, w = 1.5, extra = "") =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;
  function active(buttons, i) { buttons.forEach((b, j) => b && b.classList.toggle("active-hist", j === i)); }
  // Boucle d'animation : draw(t) reçoit le temps (s) depuis le dernier play().
  // Le temps est gelé tant que le SVG est caché (onglet non affiché).
  function runner(el, draw) {
    let t0 = 0, last = 0, dur = 0, running = false;
    function frame(now) {
      if (!el.getClientRects().length) { t0 += now - last; last = now; requestAnimationFrame(frame); return; }
      last = now;
      const t = reduce ? 1e4 : (now - t0) / 1000;
      el.innerHTML = draw(t);
      if (!reduce && t <= dur) requestAnimationFrame(frame); else running = false;
    }
    return {
      play(d) {
        t0 = last = performance.now(); dur = d;
        if (!running) { running = true; requestAnimationFrame(frame); }
      }
    };
  }
  // Générateur pseudo-aléatoire reproductible
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  return { reduce, clamp, ease, prog, fr, frs, txt, ln, active, runner, rng };
})();

/* ---------- a1. Incertitude implicite (vie quotidienne) vs explicite (physicien) ---------- */
function initImplicitExplicit(cfg) {
  const { prog, txt, ln } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  svg.setAttribute("viewBox", "0 0 360 215");

  const EXAMPLES = {
    trajet: { daily: "« Le trajet dure 20 minutes. »", v: 20, U: 2, unit: "min", min: 14, max: 26, lab: 2 },
    temperature: { daily: "« Il fait 20 °C dehors. »", v: 20, U: 1, unit: "°C", min: 16, max: 24, lab: 1 }
  };
  const keys = ["trajet", "temperature"];
  let current = 0;
  const X0 = 30, X1 = 330, Y = 122;

  function draw(t) {
    const ex = EXAMPLES[keys[current]];
    const px = v => X0 + ((v - ex.min) / (ex.max - ex.min)) * (X1 - X0);
    const o1 = prog(t, 0, 0.4), o2 = prog(t, 0.5, 1);
    let s = txt(180, 22, "VIE QUOTIDIENNE · incertitude implicite", { size: 11, fill: "var(--chalk-dim)", op: o1 });
    s += txt(180, 52, ex.daily, { size: 18, op: o1 });

    s += `<g opacity="${o2}">` + ln(X0, Y, X1, Y, "var(--chalk-dim)", 1.5);
    for (let v = ex.min; v <= ex.max; v++) {
      const major = (v - ex.min) % ex.lab === 0;
      s += ln(px(v), Y - (major ? 7 : 4), px(v), Y + (major ? 7 : 4), "var(--chalk-dim)", major ? 1.5 : 1);
      if (major) s += txt(px(v), Y + 22, v, { size: 11, fill: "var(--chalk-dim)" });
    }
    s += txt(X1, Y + 38, ex.unit, { size: 11, fill: "var(--chalk-dim)", anchor: "end" }) + `</g>`;

    const w = prog(t, 1.0, 1.8) * ex.U;
    if (w > 0) s += `<rect x="${px(ex.v - w)}" y="${Y - 16}" width="${px(ex.v + w) - px(ex.v - w)}" height="32" rx="3" fill="rgba(107,191,171,0.2)" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += `<circle cx="${px(ex.v)}" cy="${Y}" r="5" fill="var(--yellow)" opacity="${o2}"/>`;

    if (t > 1.8) {
      const o = prog(t, 1.8, 2.3);
      const dv = ex.U * 0.8 * Math.sin(t * 1.1) * Math.cos(t * 0.43 + 1);
      const x = px(ex.v + dv);
      s += `<g opacity="${o}"><circle cx="${x}" cy="${Y}" r="7" fill="none" stroke="var(--teal)" stroke-width="2"/>`;
      s += txt(x, Y - 24, "valeur vraie ?", { size: 11, fill: "var(--teal)" }) + `</g>`;
    }
    s += txt(180, 174, "UN PHYSICIEN ÉCRIT · incertitude explicite", { size: 11, fill: "var(--yellow)", op: prog(t, 1.9, 2.3) });
    s += txt(180, 205, `${ex.v} ± ${ex.U} ${ex.unit}`, { size: 28, fill: "var(--yellow)", hand: true, weight: 700, op: prog(t, 2.1, 2.6) });
    return s;
  }

  const r = CH1.runner(svg, draw);
  function select(i) {
    current = i; CH1.active(buttons, i);
    readout.textContent = "Il y a toujours une incertitude, même à l'oral, dans la vie de tous les jours — elle est juste implicite (sous-entendue, jamais énoncée). En sciences, on est obligé de la rendre explicite (chiffrée), car la mesure doit pouvoir être vérifiée et comparée par d'autres.";
    r.play(Infinity);
  }
  buttons.forEach((btn, i) => btn.addEventListener("click", () => select(i)));
  select(0);
}

/* ---------- a2. Pourquoi ne peut-on jamais avoir une précision parfaite ? (types d'erreurs) ---------- */
function initErrorTypes(cfg) {
  const { prog, txt, ln, fr } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);
  svg.setAttribute("viewBox", "0 0 360 220");

  // petit diagramme en points : valeurs empilées au-dessus d'un axe
  function dotPlot(values, { x0, x1, y, vMin, vMax, step, labels, dec }) {
    const px = v => x0 + ((v - vMin) / (vMax - vMin)) * (x1 - x0);
    let s = ln(x0, y, x1, y, "var(--chalk-dim)", 1.5);
    labels.forEach(v => { s += ln(px(v), y - 4, px(v), y + 4, "var(--chalk-dim)", 1) + txt(px(v), y + 16, fr(v, dec), { size: 10, fill: "var(--chalk-dim)" }); });
    const count = {};
    values.forEach((v, j) => {
      const k = Math.round(v / step);
      count[k] = (count[k] || 0) + 1;
      const last = j === values.length - 1;
      s += `<circle cx="${px(k * step)}" cy="${y - 8 - (count[k] - 1) * 10}" r="4" fill="${last ? "var(--yellow)" : "var(--teal)"}"/>`;
    });
    return s;
  }

  const READ = [2.4, 2.5, 2.6, 2.4, 2.5, 2.3, 2.6, 2.5];
  const MASSES = [500, 498, 503, 501, 499, 502, 497, 500, 501, 499];

  const STEPS = [
    {
      title: "Erreur aléatoire — la lecture de l'utilisateur",
      text: "Deux personnes qui lisent la même position sur un instrument gradué n'obtiennent pas toujours exactement la même valeur (angle de lecture, temps de réaction...). Quand l'aiguille ou le repère tombe entre deux graduations, il faut estimer « au jugé » — et c'est là que l'erreur varie d'une personne à l'autre.",
      dur: Infinity,
      draw(t) {
        const cx = 110, cy = 150, R = 84;
        const pt = (v, r) => { const a = Math.PI * (1 - v / 5); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
        const [ax, ay] = pt(0, R), [bx, by] = pt(5, R);
        let s = `<path d="M${ax} ${ay} A${R} ${R} 0 0 1 ${bx} ${by}" fill="none" stroke="var(--chalk-dim)" stroke-width="2"/>`;
        for (let v = 0; v <= 5; v++) {
          const [x1, y1] = pt(v, R - 12), [x2, y2] = pt(v, R), [xl, yl] = pt(v, R + 14);
          s += ln(x1, y1, x2, y2, "var(--chalk-dim)", 2) + txt(xl, yl + 4, v, { size: 12, fill: "var(--chalk-dim)" });
        }
        const [hx, hy] = pt(2.45 + 0.02 * Math.sin(t * 3), R - 18);
        s += ln(cx, cy, hx, hy, "var(--yellow)", 3, `stroke-linecap="round"`) + `<circle cx="${cx}" cy="${cy}" r="4" fill="var(--yellow)"/>`;
        s += txt(cx, cy + 24, "l'aiguille est entre 2 et 3", { size: 11, fill: "var(--chalk-dim)" });

        const per = 1.1, cycle = READ.length * per + 1.6, tc = t % cycle;
        const k = Math.min(READ.length, Math.floor(tc / per) + 1);
        s += txt(284, 30, "lectures des élèves", { size: 11, fill: "var(--chalk-dim)" });
        const start = Math.max(0, k - 4);
        for (let j = start; j < k; j++) {
          const newest = j === k - 1;
          const o = newest ? prog(tc, j * per, j * per + 0.3) : 1;
          s += txt(284, 54 + (j - start) * 20, `élève ${j + 1} : ${fr(READ[j], 1)}`, { size: 13, fill: newest ? "var(--yellow)" : "var(--chalk-dim)", op: o });
        }
        s += dotPlot(READ.slice(0, k), { x0: 232, x1: 336, y: 180, vMin: 2.2, vMax: 2.8, step: 0.1, labels: [2.3, 2.5, 2.7], dec: 1 });
        s += txt(180, 214, "même aiguille, lectures différentes", { size: 12, fill: "var(--yellow)" });
        return s;
      }
    },
    {
      title: "Erreur aléatoire — la variabilité de l'objet mesuré",
      text: "Même des objets censés être identiques varient légèrement. Exemple : la masse de plusieurs comprimés d'un même médicament, sortis de la même chaîne de fabrication, n'est jamais exactement la même d'un comprimé à l'autre.",
      dur: Infinity,
      draw(t) {
        const per = 1.3, cycle = MASSES.length * per + 1.6, tc = t % cycle;
        const k = Math.floor(tc / per), local = tc - k * per;
        const weighing = k < MASSES.length;
        const shown = weighing ? MASSES.slice(0, k + (local > 0.55 ? 1 : 0)) : MASSES.slice();
        let s = ln(50, 150, 170, 150, "var(--chalk-dim)", 3, `stroke-linecap="round"`);
        s += `<rect x="104" y="151" width="12" height="17" fill="var(--chalk-dim)" opacity="0.6"/>`;
        s += `<rect x="40" y="168" width="140" height="38" rx="6" fill="rgba(0,0,0,0.2)" stroke="var(--chalk-dim)" stroke-width="1.5"/>`;
        s += `<rect x="66" y="176" width="88" height="22" rx="3" fill="#0d1512"/>`;
        const disp = weighing ? (local > 0.55 ? `${MASSES[k]} mg` : "--- mg") : `${MASSES[MASSES.length - 1]} mg`;
        s += txt(110, 192, disp, { size: 14, fill: "var(--yellow)", weight: 600 });
        if (weighing) {
          const y = 22 + (141 - 22) * prog(local, 0, 0.45);
          s += `<ellipse cx="110" cy="${y}" rx="18" ry="8" fill="var(--teal)"/>`;
          s += `<line x1="96" y1="${y}" x2="124" y2="${y}" stroke="var(--board)" stroke-width="1.2" opacity="0.6"/>`;
        }
        s += txt(282, 40, "masses mesurées", { size: 11, fill: "var(--chalk-dim)" });
        s += dotPlot(shown, { x0: 222, x1: 342, y: 168, vMin: 495, vMax: 505, step: 1, labels: [496, 500, 504], dec: 0 });
        s += txt(180, 214, "comprimés « identiques », masses différentes", { size: 12, fill: "var(--yellow)" });
        return s;
      }
    },
    {
      title: "Erreur systématique — la résolution de l'appareil",
      text: "Un instrument ne peut jamais donner une précision meilleure que sa plus petite graduation. Entre deux graduations, on estime « au jugé » — un dixième de graduation, par exemple — mais on ne peut jamais être certain de cette estimation.",
      dur: 2.2,
      draw(t) {
        const X0 = 20, CM = 38, L = 4.64, yR = 150;
        let s = `<rect x="14" y="${yR}" width="318" height="36" rx="3" fill="rgba(242,237,225,0.06)" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
        for (let i = 0; i <= 80; i++) {
          const x = X0 + i * CM / 10, len = i % 10 === 0 ? 14 : i % 5 === 0 ? 9 : 5;
          s += ln(x, yR, x, yR + len, "var(--chalk-dim)", i % 10 === 0 ? 1.5 : 0.8);
          if (i % 10 === 0) s += txt(x, yR + 28, i / 10, { size: 11, fill: "var(--chalk-dim)" });
        }
        const w = L * CM * prog(t, 0, 1);
        s += `<rect x="${X0}" y="${yR - 20}" width="${w}" height="16" rx="3" fill="var(--teal)" opacity="0.85"/>`;
        const ex = X0 + L * CM;
        const o = prog(t, 1.1, 1.7);
        if (o > 0) {
          const ix = 190, iy = 14, iw = 155, ih = 84, vMin = 4.5, vMax = 4.8;
          const ipx = v => ix + ((v - vMin) / (vMax - vMin)) * iw;
          s += `<g opacity="${o}">`;
          s += `<circle cx="${ex}" cy="${yR - 6}" r="16" fill="none" stroke="var(--yellow)" stroke-width="1.5"/>`;
          s += ln(ex - 12, yR - 16, ix, iy + ih, "var(--yellow)", 1, `stroke-dasharray="3,3"`) + ln(ex + 12, yR - 16, ix + iw, iy + ih, "var(--yellow)", 1, `stroke-dasharray="3,3"`);
          s += `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" rx="6" fill="#16261f" stroke="var(--yellow)" stroke-width="1.5"/>`;
          s += `<rect x="${ix}" y="${iy + 32}" width="${ipx(L) - ix}" height="16" fill="var(--teal)" opacity="0.85"/>`;
          s += ln(ix, iy + 50, ix + iw, iy + 50, "var(--chalk-dim)", 1.5);
          [4.5, 4.6, 4.7, 4.8].forEach(v => {
            s += ln(ipx(v), iy + 50, ipx(v), iy + 64, "var(--chalk-dim)", 1.5);
            if (v > 4.5 && v < 4.8) s += txt(ipx(v), iy + 78, fr(v, 1), { size: 11, fill: "var(--chalk-dim)" });
          });
          s += txt(ipx(L), iy + 22, "4,6 ou 4,7 ?", { size: 12, fill: "var(--yellow)" });
          s += `</g>`;
        }
        s += txt(180, 212, "au-delà de la plus petite graduation, on estime au jugé", { size: 12, fill: "var(--yellow)", op: o });
        return s;
      }
    }
  ];

  const r = CH1.runner(svg, t => STEPS[step - 1].draw(t));
  let step = 1;
  function render() {
    const st = STEPS[step - 1];
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${st.title}</strong> — ${st.text}`;
    stepEl.textContent = `${step} / ${STEPS.length}`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === STEPS.length;
    r.play(st.dur);
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length) { step++; render(); } });
  render();
}

/* ---------- b. Chiffres significatifs (comptage) ---------- */
function initSignificantFigures(cfg) {
  const { prog, txt } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  svg.setAttribute("viewBox", "0 0 360 175");

  const EXAMPLES = {
    a: { digits: [["3", true, "non nul"], [","], ["2", true, "non nul"], ["0", true, "zéro final"]], count: "3", rule: "Tous les chiffres sont significatifs, y compris le zéro après la virgule." },
    b: { digits: [["0", false, "de tête"], [","], ["0", false, "de tête"], ["4", true, "non nul"], ["5", true, "non nul"], ["0", true, "zéro final"]], count: "3", rule: "Les zéros de tête (avant le premier chiffre non nul) ne sont pas significatifs ; le zéro final après la virgule l'est." },
    c: { digits: [["2", true, "non nul"], ["0", true, "encadré"], ["5", true, "non nul"]], count: "3", rule: "Un zéro encadré par deux chiffres non nuls est toujours significatif." }
  };
  const keys = ["a", "b", "c"];
  let current = 0;
  const TW = 48, GAP = 6, CW = 16, Y0 = 34, TH = 60, DT = 0.55;

  function draw(t) {
    const ex = EXAMPLES[keys[current]];
    const total = ex.digits.reduce((w, d) => w + (d.length === 1 ? CW : TW) + GAP, -GAP);
    let x = 180 - total / 2, idx = 0, count = 0, s = "";
    ex.digits.forEach(d => {
      if (d.length === 1) { s += txt(x + CW / 2, Y0 + 46, ",", { size: 34, hand: true }); x += CW + GAP; return; }
      const [c, sig, why] = d;
      const ts = 0.4 + idx * DT, p = prog(t, ts, ts + 0.3);
      const cx = x + TW / 2;
      if (t >= ts && t < ts + DT) s += `<polygon points="${cx - 6},${Y0 - 14} ${cx + 6},${Y0 - 14} ${cx},${Y0 - 5}" fill="var(--yellow)"/>`;
      const stroke = p > 0 ? (sig ? "var(--teal)" : "var(--chalk-dim)") : "var(--line)";
      const fill = sig ? `rgba(107,191,171,${0.2 * p})` : "transparent";
      s += `<rect x="${x}" y="${Y0}" width="${TW}" height="${TH}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="2"${!sig && p > 0 ? ` stroke-dasharray="4,3"` : ""}/>`;
      s += txt(cx, Y0 + 44, c, { size: 36, hand: true, weight: 700, fill: p > 0.5 ? (sig ? "var(--teal)" : "var(--chalk-dim)") : "var(--chalk)", op: !sig && p > 0.5 ? 0.6 : 1 });
      s += txt(cx, Y0 + TH + 18, why, { size: 11, fill: sig ? "var(--teal)" : "var(--chalk-dim)", op: p });
      if (sig && p >= 1) count++;
      x += TW + GAP; idx++;
    });
    s += txt(180, 160, `${count} chiffre${count > 1 ? "s" : ""} significatif${count > 1 ? "s" : ""}`, { size: 24, hand: true, fill: "var(--yellow)", weight: 700 });
    return s;
  }

  const r = CH1.runner(svg, draw);
  function select(i) {
    current = i; CH1.active(buttons, i);
    const ex = EXAMPLES[keys[i]];
    readout.innerHTML = `<strong style="color:var(--yellow)">${ex.count} chiffre(s) significatif(s)</strong> (en <span style="color:var(--teal)">bleu</span> ; en <span style="color:var(--chalk-dim)">gris</span> : non significatif).<br>${ex.rule}`;
    r.play(0.4 + ex.digits.length * DT + 0.5);
  }
  buttons.forEach((btn, i) => btn.addEventListener("click", () => select(i)));
  select(0);
}

/* ---------- c. Écriture scientifique ---------- */
function initScientificNotation(cfg) {
  const { prog, txt } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  svg.setAttribute("viewBox", "0 0 360 205");

  // digits : chiffres sans virgule ; c0 / c1 : position de la virgule avant / après
  const EXAMPLES = {
    a: { standard: "45 000", digits: "45000", c0: 5, c1: 1, keep: [0, 1], a: "4,5", n: 4, cs: 2 },
    b: { standard: "0,0032", digits: "00032", c0: 1, c1: 4, keep: [3, 4], a: "3,2", n: -3, cs: 2 }
  };
  const keys = ["a", "b"];
  let current = 0;
  const SW = 34, YD = 96, HOP = 0.6, T0 = 0.8;
  const sup = n => String(n).replace("-", "−");

  function timing(ex) { const hops = Math.abs(ex.c1 - ex.c0); return { hops, tF: T0 + hops * HOP + 0.2 }; }

  function draw(t) {
    const ex = EXAMPLES[keys[current]];
    const { hops, tF } = timing(ex);
    const dir = Math.sign(ex.c1 - ex.c0);
    const len = ex.digits.length, x0 = 180 - (len * SW) / 2;
    const bx = c => x0 + c * SW;
    let s = txt(180, 16, `nombre de départ : ${ex.standard}`, { size: 12, fill: "var(--chalk-dim)" });

    let done = 0, c = ex.c0;
    for (let k = 0; k < hops; k++) {
      const p = prog(t, T0 + k * HOP, T0 + k * HOP + 0.45);
      c += dir * p;
      if (p >= 1) done++;
      if (p > 0) {
        const xa = bx(ex.c0 + dir * k), xb = bx(ex.c0 + dir * (k + 1)), xm = (xa + xb) / 2;
        s += `<path d="M${xa} 62 Q${xm} 32 ${xb} 62" fill="none" stroke="var(--yellow)" stroke-width="1.6" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1 - p}"/>`;
        s += `<polygon points="${xb - 4},${58} ${xb + 4},${58} ${xb},${65}" fill="var(--yellow)" opacity="${p}"/>`;
        s += txt(xm, 38, k + 1, { size: 11, fill: "var(--yellow)", op: p });
      }
    }
    const fade = prog(t, tF, tF + 0.5);
    for (let i = 0; i < len; i++) {
      const kept = ex.keep.includes(i);
      s += txt(x0 + i * SW + SW / 2, YD, ex.digits[i], { size: 38, hand: true, weight: 700, fill: kept && fade > 0 ? "var(--yellow)" : "var(--chalk)", op: kept ? 1 : 1 - 0.8 * fade });
    }
    const commaOp = ex.c0 === len && t < T0 ? 0.45 : 1;
    s += txt(bx(c), YD + 4, ",", { size: 38, hand: true, weight: 700, fill: "var(--coral)", op: commaOp });

    const side = dir < 0 ? "gauche" : "droite";
    s += txt(180, 132, `virgule décalée de ${done} rang${done > 1 ? "s" : ""} vers la ${side}`, { size: 13, fill: "var(--chalk-dim)" });
    const fo = prog(t, tF + 0.5, tF + 1);
    s += `<text x="180" y="174" font-size="30" fill="var(--yellow)" text-anchor="middle" font-family="Kalam, 'Segoe Print', cursive" font-weight="700" opacity="${fo}">${ex.a} × 10<tspan dy="-14" font-size="19">${sup(ex.n)}</tspan></text>`;
    s += txt(180, 199, dir < 0 ? "virgule vers la gauche → n positif" : "virgule vers la droite → n négatif", { size: 12, fill: "var(--teal)", op: fo });
    return s;
  }

  function toSupExp(n) {
    const sup = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
    return String(n).split("").map(d => sup[d]).join("");
  }

  const r = CH1.runner(svg, draw);
  function select(i) {
    current = i; CH1.active(buttons, i);
    const ex = EXAMPLES[keys[i]];
    readout.innerHTML = `${ex.standard} = <strong style="color:var(--yellow)">${ex.a} × 10${ex.n >= 0 ? "" : "⁻"}${toSupExp(Math.abs(ex.n))}</strong> — la mantisse « ${ex.a} » contient exactement <strong style="color:var(--teal)">${ex.cs} chiffres significatifs</strong> (1 ≤ a &lt; 10).`;
    r.play(timing(ex).tF + 1.2);
  }
  buttons.forEach((btn, i) => btn.addEventListener("click", () => select(i)));
  select(0);
}

/* ---------- d1. Chiffres significatifs et opérations : somme/différence ---------- */
function initSigFigAddition(cfg) {
  const { prog, txt, ln, frs } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const dec1Range = document.getElementById(cfg.dec1RangeId);
  const dec2Range = document.getElementById(cfg.dec2RangeId);
  const readout = document.getElementById(cfg.readoutId);
  svg.setAttribute("viewBox", "0 0 360 215");

  const A_TRUE = 12.34567, B_TRUE = 4.78912;
  const BLUE = "#5a96d2";
  const decX = k => 186 + (k - 1) * 28;           // colonne de la k-ième décimale
  const intX = [128, 156];                         // dizaines, unités
  const COMMA_X = 170;
  const dLabel = n => `${n} décimale${n > 1 ? "s" : ""}`;

  function state() {
    const dec1 = Number(dec1Range.value), dec2 = Number(dec2Range.value);
    const a = A_TRUE.toFixed(dec1), b = B_TRUE.toFixed(dec2);
    const minDec = Math.min(dec1, dec2), maxDec = Math.max(dec1, dec2);
    const cRaw = Number(a) + Number(b);
    return { dec1, dec2, a, b, minDec, maxDec, cRaw, rawStr: cRaw.toFixed(maxDec), c: cRaw.toFixed(minDec) };
  }

  // écrit un nombre en colonnes, alignées sur la virgule
  function row(str, y, color, opts = {}) {
    const [ip, dp = ""] = str.split(".");
    let s = "";
    const ints = ip.padStart(2, " ");
    [0, 1].forEach(i => { if (ints[i] !== " ") s += txt(intX[i], y, ints[i], { size: 22, weight: 600, fill: color }); });
    if (dp) s += txt(COMMA_X, y, ",", { size: 22, weight: 600, fill: color });
    for (let k = 1; k <= dp.length; k++) {
      const dead = opts.deadFrom != null && k > opts.deadFrom;
      s += txt(decX(k), y, dp[k - 1], { size: 22, weight: 600, fill: dead ? "var(--chalk-dim)" : color, op: dead ? 0.55 : 1 });
      if (dead && opts.strike > 0) s += ln(decX(k) - 9, y - 7, decX(k) - 9 + 18 * opts.strike, y - 7, "var(--coral)", 2);
    }
    return s;
  }

  function draw(t) {
    const st = state();
    const o = prog(t, 0, 0.5);
    let s = "";
    if (st.maxDec > st.minDec) {
      const xa = decX(st.minDec + 1) - 14, xb = decX(st.maxDec) + 14;
      s += `<rect x="${xa}" y="24" width="${xb - xa}" height="120" rx="4" fill="rgba(217,122,99,0.14)" stroke="var(--coral)" stroke-width="1" stroke-dasharray="4,3" opacity="${o}"/>`;
      s += txt((xa + xb) / 2, 17, "inconnu pour " + (st.dec1 < st.dec2 ? "a" : "b"), { size: 11, fill: "var(--coral)", op: o });
      const yQ = st.dec1 < st.dec2 ? 50 : 86;
      for (let k = st.minDec + 1; k <= st.maxDec; k++) s += txt(decX(k), yQ, "?", { size: 20, fill: "var(--coral)", op: o });
    }
    s += txt(22, 50, "a", { size: 14, fill: "var(--teal)", anchor: "start" }) + row(st.a, 50, "var(--teal)");
    s += txt(22, 86, "b", { size: 14, fill: BLUE, anchor: "start" }) + txt(100, 86, "+", { size: 22, fill: "var(--chalk)" }) + row(st.b, 86, BLUE);
    s += ln(92, 100, 290, 100, "var(--chalk)", 1.5);
    s += txt(22, 132, "a + b", { size: 14, fill: "var(--chalk-dim)", anchor: "start" }) + row(st.rawStr, 132, "var(--chalk)", { deadFrom: st.minDec, strike: prog(t, 0.4, 0.8) });
    const fo = prog(t, 0.5, 0.9);
    s += txt(180, 184, `c ≈ ${frs(st.c)}`, { size: 30, hand: true, weight: 700, fill: "var(--yellow)", op: fo });
    s += txt(180, 207, st.dec1 === st.dec2 ? `même précision : arrondi à ${dLabel(st.minDec)}` : `arrondi à la moins précise : ${dLabel(st.minDec)}`, { size: 12, fill: "var(--chalk-dim)", op: fo });
    return s;
  }

  const r = CH1.runner(svg, draw);
  function update() {
    const st = state();
    const a = frs(st.a), b = frs(st.b), raw = frs(st.rawStr), c = frs(st.c);
    readout.innerHTML = st.dec1 === st.dec2
      ? `a = <strong style="color:var(--teal)">${a}</strong> et b = <strong style="color:${BLUE}">${b}</strong> ont la même précision (${dLabel(st.dec1)} après la virgule). Résultat brut : a + b = <strong style="color:var(--yellow)">${raw}</strong>, arrondi à cette même précision : <strong style="color:var(--yellow)">${c}</strong>.`
      : `a = <strong style="color:var(--teal)">${a}</strong> (${dLabel(st.dec1)}) et b = <strong style="color:${BLUE}">${b}</strong> (${dLabel(st.dec2)}) n'ont pas la même précision. Résultat brut : a + b = <strong style="color:var(--yellow)">${raw}</strong>, arrondi à la précision la moins bonne des deux : <strong style="color:var(--yellow)">${c}</strong>.`;
    r.play(1);
  }
  dec1Range.addEventListener("input", update);
  dec2Range.addEventListener("input", update);
  update();
}

/* ---------- d2. Chiffres significatifs et opérations : produit/quotient ---------- */
function initSigFigOperations(cfg) {
  const { prog, txt, ln, frs } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const cs1Range = document.getElementById(cfg.cs1RangeId);
  const cs2Range = document.getElementById(cfg.cs2RangeId);
  const readout = document.getElementById(cfg.readoutId);
  svg.setAttribute("viewBox", "0 0 360 215");

  // valeurs neutres, vérifiées sur toutes les combinaisons de CS (2 à 6)
  const A_TRUE = 8.234567, B_TRUE = 5.671234;
  const BLUE = "#5a96d2";
  const TW = 24, GAP = 3, CW = 9, X0 = 84;

  function state() {
    const cs1 = Number(cs1Range.value), cs2 = Number(cs2Range.value);
    const a = formatSig(A_TRUE, cs1), b = formatSig(B_TRUE, cs2);
    const cRaw = Number(a) * Number(b);
    const rawStr = String(Number(cRaw.toPrecision(8)));
    const minCS = Math.min(cs1, cs2);
    return { cs1, cs2, a, b, cRaw, rawStr, minCS, c: formatSig(cRaw, minCS) };
  }

  // une case par chiffre ; opts.keep = nb de chiffres conservés (les autres barrés)
  function tiles(str, y, color, opts = {}) {
    let x = X0, s = "", j = 0;
    for (const ch of str) {
      if (ch === ".") { s += txt(x + CW / 2, y + 23, ",", { size: 20, weight: 600, fill: color }); x += CW + GAP; continue; }
      const dead = opts.keep != null && j >= opts.keep;
      const p = dead ? prog(opts.t, 0.2 + (j - opts.keep) * 0.08, 0.5 + (j - opts.keep) * 0.08) : 0;
      const fill = opts.keep != null && !dead ? "rgba(232,196,104,0.18)" : "transparent";
      const stroke = opts.keep != null ? (dead ? "var(--line)" : "var(--yellow)") : color;
      s += `<rect x="${x}" y="${y}" width="${TW}" height="32" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      s += txt(x + TW / 2, y + 23, ch, { size: 18, weight: 600, fill: dead ? "var(--chalk-dim)" : color, op: dead ? 1 - 0.5 * p : 1 });
      if (dead && p > 0) s += ln(x + 3, y + 29, x + 3 + (TW - 6) * p, y + 3, "var(--coral)", 2);
      x += TW + GAP; j++;
    }
    return { s, end: x - GAP };
  }

  function draw(t) {
    const st = state();
    let s = "";
    const lim1 = st.cs1 < st.cs2, lim2 = st.cs2 < st.cs1;
    s += txt(20, 42, "a", { size: 14, fill: "var(--teal)", anchor: "start" }) + tiles(st.a, 20, "var(--teal)").s;
    s += txt(345, 42, `${st.cs1} CS`, { size: 13, anchor: "end", fill: lim1 ? "var(--yellow)" : "var(--chalk-dim)", weight: lim1 ? 700 : 400 });
    s += txt(20, 86, "b", { size: 14, fill: BLUE, anchor: "start" }) + tiles(st.b, 64, BLUE).s;
    s += txt(345, 86, `${st.cs2} CS`, { size: 13, anchor: "end", fill: lim2 ? "var(--yellow)" : "var(--chalk-dim)", weight: lim2 ? 700 : 400 });
    s += ln(20, 110, 345, 110, "var(--line)", 1);
    s += txt(20, 142, "a × b", { size: 14, fill: "var(--chalk-dim)", anchor: "start" });
    const raw = tiles(st.rawStr, 120, "var(--chalk)", { keep: st.minCS, t });
    s += raw.s;
    // accolade sous les chiffres conservés
    const intLen = st.rawStr.indexOf(".") < 0 ? st.rawStr.length : st.rawStr.indexOf(".");
    const keptEnd = X0 + st.minCS * (TW + GAP) - GAP + (st.minCS > intLen ? CW + GAP : 0);
    const o = prog(t, 0.3, 0.7);
    s += `<path d="M${X0} 158 v6 H${keptEnd} v-6" fill="none" stroke="var(--yellow)" stroke-width="1.5" opacity="${o}"/>`;
    s += txt((X0 + keptEnd) / 2, 180, `on garde ${st.minCS} CS`, { size: 12, fill: "var(--yellow)", op: o });
    s += txt(345, 180, `c ≈ ${frs(st.c)}`, { size: 26, hand: true, weight: 700, fill: "var(--yellow)", anchor: "end", op: prog(t, 0.6, 1) });
    s += txt(180, 208, st.cs1 === st.cs2 ? `même précision : ${st.minCS} CS` : `arrondi au plus petit nombre de CS : ${st.minCS}`, { size: 12, fill: "var(--chalk-dim)", op: prog(t, 0.6, 1) });
    return s;
  }

  const r = CH1.runner(svg, draw);
  function update() {
    const st = state();
    const a = frs(st.a), b = frs(st.b), raw = frs(st.rawStr), c = frs(st.c);
    readout.innerHTML = st.cs1 === st.cs2
      ? `a = <strong style="color:var(--teal)">${a}</strong> et b = <strong style="color:${BLUE}">${b}</strong> ont la même précision (${st.cs1} CS). Résultat brut : a × b = <strong style="color:var(--yellow)">${raw}</strong>, arrondi à cette même précision : <strong style="color:var(--yellow)">${c}</strong> (${st.minCS} CS).`
      : `a = <strong style="color:var(--teal)">${a}</strong> (${st.cs1} CS) et b = <strong style="color:${BLUE}">${b}</strong> (${st.cs2} CS) n'ont pas la même précision. Résultat brut : a × b = <strong style="color:var(--yellow)">${raw}</strong>, arrondi au plus petit nombre de CS des deux : <strong style="color:var(--yellow)">${c}</strong> (${st.minCS} CS).`;
    r.play(1.2);
  }
  cs1Range.addEventListener("input", update);
  cs2Range.addEventListener("input", update);
  update();
}

/* ---------- d3. Calcul mixte (produit/quotient + somme) ---------- */
function initMixedCalculation(cfg) {
  const { prog, txt, ln } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const explainEl = document.getElementById(cfg.explainId);
  const prevBtn = document.getElementById(cfg.prevBtnId);
  const nextBtn = document.getElementById(cfg.nextBtnId);
  const stepEl = document.getElementById(cfg.stepId);
  svg.setAttribute("viewBox", "0 0 360 250");

  // arrondir trop tôt donnerait 4,5 + 2,8 = 7,3 s au lieu de 7,4 s
  const D1 = 5.0, V1 = 1.1, D2 = 8.5, V2 = 3.0;
  const t1Raw = D1 / V1, t2Raw = D2 / V2;
  const t1RawStr = t1Raw.toFixed(3).replace(".", ",") + "...";
  const t2RawStr = t2Raw.toFixed(3).replace(".", ",") + "...";
  const sumRawStr = (t1Raw + t2Raw).toFixed(3).replace(".", ",") + "...";
  const finalResult = (t1Raw + t2Raw).toFixed(1).replace(".", ",");
  const t1Rounded = formatSig(t1Raw, 2), t2Rounded = formatSig(t2Raw, 2);
  const early = (Number(t1Rounded) + Number(t2Rounded)).toFixed(1).replace(".", ",");

  function frac(x, num, den, op) {
    return `<g opacity="${op}">` + txt(x, 34, num, { size: 24, hand: true }) + ln(x - 42, 45, x + 42, 45, "var(--chalk)", 1.6) + txt(x, 72, den, { size: 24, hand: true }) + `</g>`;
  }

  function drawLayers(level, t) {
    const op = l => (l === level ? prog(t, 0, 0.6) : 1);
    let s = frac(95, "5,0", "1,1", op(1)) + frac(265, "8,5", "3,0", op(1));
    s += txt(180, 60, "+", { size: 28, fill: "var(--chalk-dim)", op: op(1) });
    s += txt(95, 102, `t₁ = ${t1RawStr} s`, { size: 15, fill: "var(--teal)", op: op(1) });
    s += txt(265, 102, `t₂ = ${t2RawStr} s`, { size: 15, fill: "var(--teal)", op: op(1) });
    if (level >= 2) {
      s += txt(95, 124, `≈ ${t1Rounded.replace(".", ",")} s à 2 CS`, { size: 13, fill: "var(--yellow)", op: op(2) });
      s += txt(265, 124, `≈ ${t2Rounded.replace(".", ",")} s à 2 CS`, { size: 13, fill: "var(--yellow)", op: op(2) });
    }
    if (level >= 3) {
      s += ln(20, 140, 340, 140, "var(--chalk-dim)", 1, `stroke-dasharray="3,3" opacity="${op(3)}"`);
      s += txt(180, 164, `t = ${t1RawStr} + ${t2RawStr} = ${sumRawStr} s`, { size: 14, fill: "var(--chalk)", op: op(3) });
    }
    if (level >= 4) {
      s += txt(180, 186, "arrondi une seule fois, à la fin, à 1 décimale", { size: 12, fill: "var(--chalk-dim)", op: op(4) });
      s += txt(180, 218, `t ≈ ${finalResult} s`, { size: 30, hand: true, weight: 700, fill: "var(--yellow)", op: op(4) });
      s += txt(180, 243, `✗ arrondir trop tôt : ${t1Rounded.replace(".", ",")} + ${t2Rounded.replace(".", ",")} = ${early} s`, { size: 12, fill: "var(--coral)", op: prog(t, 0.8, 1.3) });
    }
    return s;
  }

  const STEPS = [
    { title: "Étape 1 — calculer chaque durée séparément, sans arrondir",
      text: `t₁ = d₁ / v₁ = 5,0 / 1,1 = ${t1RawStr} s ; t₂ = d₂ / v₂ = 8,5 / 3,0 = ${t2RawStr} s. On garde toute la précision affichée par la calculatrice, on n'arrondit rien pour l'instant.` },
    { title: "Étape 2 — repérer la précision visée pour le résultat final",
      text: `On regarde quelle précision aurait chaque quotient s'il était arrondi seul : t₁ arrondi à 2 CS donnerait ${t1Rounded.replace(".", ",")} s (1 décimale), t₂ arrondi à 2 CS donnerait ${t2Rounded.replace(".", ",")} s (1 décimale). Le résultat final devra donc être donné à 1 décimale — mais on n'arrondit toujours pas les valeurs utilisées dans le calcul.` },
    { title: "Étape 3 — additionner les valeurs complètes, non arrondies",
      text: `t = t₁ + t₂ = ${t1RawStr} + ${t2RawStr} = ${sumRawStr} s. On additionne les valeurs entières telles que la calculatrice les donne, pas des valeurs déjà arrondies.` },
    { title: "Étape 4 — arrondir une seule fois, à la fin",
      text: `On arrondit le résultat à la précision fixée à l'étape 2 (1 décimale) : t ≈ ${finalResult} s. C'est le seul arrondi de tout le calcul.` }
  ];

  let step = 1;
  const r = CH1.runner(svg, t => drawLayers(step, t));
  function render() {
    explainEl.innerHTML = `<strong style="color:var(--yellow)">${STEPS[step - 1].title}</strong><br>${STEPS[step - 1].text}`;
    stepEl.textContent = `${step} / ${STEPS.length}`;
    prevBtn.disabled = step === 1;
    nextBtn.disabled = step === STEPS.length;
    r.play(1.4);
  }
  prevBtn.addEventListener("click", () => { if (step > 1) { step--; render(); } });
  nextBtn.addEventListener("click", () => { if (step < STEPS.length) { step++; render(); } });
  render();
}

/* ---------- e. Incertitude de mesure ---------- */
function initMeasurementUncertainty(cfg) {
  const { prog, clamp, txt, ln, fr } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const readout = document.getElementById(cfg.readoutId);
  const buttons = cfg.buttonIds.map(id => document.getElementById(id));
  svg.setAttribute("viewBox", "0 0 360 200");

  const MEASURED = 15.3; // cm
  // chaque échelle = une règle différente ; la fenêtre zoome autour de la lecture
  const SCALES = {
    s10: { grad: 10, min: 0, max: 40, decimals: 0 },
    s1: { grad: 1, min: 12, max: 19, decimals: 0 },
    s01: { grad: 0.1, min: 14.8, max: 15.8, decimals: 1 },
    s001: { grad: 0.01, min: 15.25, max: 15.35, decimals: 2 }
  };
  const keys = ["s10", "s1", "s01", "s001"];
  let current = 1;
  let from = { min: SCALES.s1.min, max: SCALES.s1.max }, shown = { ...from };
  const X0 = 20, X1 = 340, YR = 62;

  function draw(t) {
    const sc = SCALES[keys[current]];
    // zoom : interpolation logarithmique de la largeur de fenêtre
    const p = prog(t, 0, 0.8);
    const w0 = from.max - from.min, w1 = sc.max - sc.min;
    const w = Math.exp(Math.log(w0) + (Math.log(w1) - Math.log(w0)) * p);
    const c0 = (from.max + from.min) / 2, c1 = (sc.max + sc.min) / 2;
    const cc = c0 + (c1 - c0) * p;
    shown = { min: cc - w / 2, max: cc + w / 2 };
    const px = v => X0 + ((v - shown.min) / w) * (X1 - X0);
    const grad = sc.grad, U = grad / 2;

    let s = `<rect x="${X0 - 6}" y="${YR}" width="${X1 - X0 + 12}" height="36" rx="3" fill="rgba(242,237,225,0.06)" stroke="var(--chalk-dim)" stroke-width="1.2"/>`;
    const spacing = (grad / w) * (X1 - X0);
    if (spacing >= 2) {
      const tickOp = clamp((spacing - 2) / 10);
      const lab = spacing >= 40 ? 1 : 2;
      for (let i = Math.ceil(shown.min / grad - 1e-9); i <= Math.floor(shown.max / grad + 1e-9); i++) {
        const v = i * grad, x = px(v);
        s += ln(x, YR, x, YR + 14, "var(--chalk-dim)", 1.5, `opacity="${tickOp}"`);
        if (i % lab === 0 && spacing >= 18) s += txt(x, YR + 30, fr(v, sc.decimals), { size: 11, fill: "var(--chalk-dim)", op: clamp((spacing - 18) / 10) });
      }
    }
    s += txt(X1 + 4, YR + 52, "cm", { size: 11, fill: "var(--chalk-dim)", anchor: "end" });

    const oB = prog(t, 0.6, 1);
    s += `<rect x="${px(MEASURED - U)}" y="${YR - 4}" width="${px(MEASURED + U) - px(MEASURED - U)}" height="44" fill="rgba(107,191,171,0.2)" stroke="var(--teal)" stroke-width="1.5" opacity="${oB}"/>`;
    const mx = px(MEASURED);
    s += txt(mx, 18, "on lit : 15,3 cm", { size: 13, fill: "var(--yellow)" });
    s += ln(mx, 24, mx, YR - 8, "var(--yellow)", 1.5) + `<polygon points="${mx - 4},${YR - 9} ${mx + 4},${YR - 9} ${mx},${YR - 2}" fill="var(--yellow)"/>`;

    const lower = Math.floor(MEASURED / grad + 1e-9) * grad, upper = lower + grad;
    const bx0 = px(lower), bx1 = px(upper), yb = YR + 58, oG = prog(t, 0.7, 1.1);
    s += `<g opacity="${oG}">` + ln(bx0, yb, bx1, yb, "var(--teal)", 1.5) + ln(bx0, yb - 5, bx0, yb + 5, "var(--teal)", 1.5) + ln(bx1, yb - 5, bx1, yb + 5, "var(--teal)", 1.5);
    s += txt(clamp((bx0 + bx1) / 2, 80, 280), yb + 16, "1 graduation = 2 × U(x)", { size: 11, fill: "var(--teal)" }) + `</g>`;

    const rel = formatSig((U / MEASURED) * 100, 2).replace(".", ",");
    s += txt(180, 172, `U(x) = ${fr(grad, sc.decimals)} / 2 = ${fr(U, sc.decimals + 1)} cm`, { size: 20, hand: true, weight: 700, fill: "var(--yellow)", op: oG });
    s += txt(180, 194, `incertitude relative : U(x) / x ≈ ${rel} %`, { size: 13, fill: "var(--teal)", op: oG });
    return s;
  }

  const r = CH1.runner(svg, draw);
  function select(i) {
    from = { ...shown };
    current = i; CH1.active(buttons, i);
    const sc = SCALES[keys[i]], U = sc.grad / 2;
    const rel = ((U / MEASURED) * 100);
    readout.innerHTML = `Sur cette règle, la plus petite graduation vaut ${fr(sc.grad, sc.decimals)} cm. Entre deux graduations, on ne peut qu'estimer. Par convention, on prend :<br>U(x) = graduation / 2 = ${fr(sc.grad, sc.decimals)} / 2 = <strong style="color:var(--yellow)">${fr(U, sc.decimals + 1)} cm</strong> (incertitude absolue)<br>incertitude relative = U(x)/x = ${fr(U, sc.decimals + 1)}/${fr(MEASURED, 1)} ≈ <strong style="color:var(--teal)">${formatSig(rel, 2).replace(".", ",")} %</strong>`;
    r.play(1.3);
  }
  buttons.forEach((btn, i) => btn.addEventListener("click", () => select(i)));
  select(current);
}

/* ---------- f. Intervalle : entre quelles valeurs ? ---------- */
function initConfidenceInterval(cfg) {
  const { prog, txt, ln, fr, rng } = CH1;
  const svg = document.getElementById(cfg.svgId);
  const uRange = document.getElementById(cfg.uRangeId);
  const readout = document.getElementById(cfg.readoutId);
  svg.setAttribute("viewBox", "0 0 360 215");

  const X = 15.3, RANGE = 1.5, SIGMA = 0.28, N = 40, RATE = 0.12, CYCLE = N * RATE + 3.2;
  const X0 = 20, X1 = 340, Y = 160, BIN = 0.1;
  const px = v => X0 + ((v - (X - RANGE)) / (2 * RANGE)) * (X1 - X0);
  const cache = {};
  function sample(seed) {
    if (cache[seed]) return cache[seed];
    const rand = rng(seed * 7919 + 13), out = [];
    while (out.length < N) {
      const u = 1 - rand(), v = rand();
      const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      const m = X + SIGMA * z;
      if (Math.abs(m - X) < RANGE - 0.05) out.push(Math.round(m / BIN) * BIN);
    }
    return (cache[seed] = out);
  }

  function draw(t) {
    const U = Number(uRange.value) / 100;
    const xMin = X - U, xMax = X + U;
    const cyc = Math.floor(t / CYCLE), tc = t - cyc * CYCLE;
    const data = sample(cyc + 1);
    const k = Math.min(N, Math.floor(tc / RATE) + 1);

    let s = `<rect x="${px(xMin)}" y="64" width="${px(xMax) - px(xMin)}" height="${Y - 64}" fill="rgba(107,191,171,0.14)" stroke="var(--teal)" stroke-width="1.5"/>`;
    s += txt(px(xMin) - 4, 58, fr(xMin, 2), { size: 12, fill: "var(--teal)", anchor: "end" });
    s += txt(px(xMax) + 4, 58, fr(xMax, 2), { size: 12, fill: "var(--teal)", anchor: "start" });
    s += ln(X0, Y, X1, Y, "var(--chalk-dim)", 2);
    for (let v = 14; v <= 16.6 + 1e-9; v += 0.5) s += ln(px(v), Y - 5, px(v), Y + 5, "var(--chalk-dim)", 1.5) + txt(px(v), Y + 18, fr(v, 1), { size: 11, fill: "var(--chalk-dim)" });

    const count = {};
    let inside = 0;
    for (let j = 0; j < k; j++) {
      const m = data[j], b = Math.round(m / BIN);
      count[b] = (count[b] || 0) + 1;
      const yEnd = Y - 7 - (count[b] - 1) * 8;
      const fall = j === k - 1 ? prog(tc, j * RATE, j * RATE + 0.25) : 1;
      const isIn = m >= xMin - 1e-9 && m <= xMax + 1e-9;
      if (isIn) inside++;
      s += `<circle cx="${px(m)}" cy="${40 + (yEnd - 40) * fall}" r="3.5" fill="${isIn ? "var(--chalk)" : "var(--coral)"}"/>`;
    }
    s += ln(px(X), 38, px(X), Y + 6, "var(--yellow)", 2);
    s += txt(px(X), 30, `x = ${fr(X, 1)} cm`, { size: 13, fill: "var(--yellow)" });
    s += `<text x="180" y="204" font-size="12" fill="var(--chalk-dim)" text-anchor="middle"><tspan fill="var(--teal)" font-weight="700">${inside}</tspan> mesures répétées sur ${k} tombent dans l'intervalle</text>`;
    return s;
  }

  const r = CH1.runner(svg, draw);
  function update() {
    const U = Number(uRange.value) / 100;
    readout.innerHTML = `On écrit : L = ${fr(X, 1)} ± ${fr(U, 2)} cm.<br>Cela signifie que la longueur vraie a de bonnes chances d'être <strong style="color:var(--teal)">comprise entre ${fr(X - U, 2)} et ${fr(X + U, 2)} cm</strong>.`;
  }
  uRange.addEventListener("input", () => { update(); if (CH1.reduce) r.play(0); });
  update();
  r.play(Infinity);
}
