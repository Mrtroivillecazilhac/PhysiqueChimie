/* ============================================================
   Boîte à outils pédagogique partagée entre tous les chapitres :
   onglets de mode (Cours / Entraînement / Synthèse), composants
   d'activité (QCM, Vrai/Faux, estimation), score et progression
   (stockés en localStorage, par chapitre).
   ============================================================ */

/* ---------- Onglets Cours / Entraînement / Synthèse ---------- */
function initModeTabs(chapterId) {
  const tabs = document.querySelectorAll(".mode-tab");
  const panels = document.querySelectorAll(".mode-panel");

  function activate(panelId) {
    tabs.forEach(t => t.classList.toggle("active", t.dataset.panel === panelId));
    panels.forEach(p => p.classList.toggle("active", p.id === panelId));
    localStorage.setItem(`lastMode_${chapterId}`, panelId);
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab.dataset.panel));
  });

  // rouvre le dernier mode consulté par l'élève, sinon le premier onglet
  const last = localStorage.getItem(`lastMode_${chapterId}`);
  const hasLast = last && document.getElementById(last);
  activate(hasLast ? last : (tabs[0] ? tabs[0].dataset.panel : null));
}

/* ---------- Score & progression (localStorage, par chapitre) ---------- */
const ProgressStore = {
  key(chapterId) { return `progress_${chapterId}`; },
  load(chapterId) {
    try { return JSON.parse(localStorage.getItem(this.key(chapterId))) || {}; }
    catch (e) { return {}; }
  },
  save(chapterId, data) {
    localStorage.setItem(this.key(chapterId), JSON.stringify(data));
  },
  record(chapterId, activityId, correct) {
    const data = this.load(chapterId);
    data[activityId] = !!correct;
    this.save(chapterId, data);
    this.refreshBar(chapterId);
  },
  reset(chapterId) {
    localStorage.removeItem(this.key(chapterId));
    this.refreshBar(chapterId);
  },
  refreshBar(chapterId) {
    const data = this.load(chapterId);
    const doneIds = Object.keys(data);
    const totalEl = document.getElementById(`progressFill_${chapterId}`);
    if (!totalEl) return;
    const total = Number(totalEl.dataset.total) || doneIds.length;
    const correct = doneIds.filter(id => data[id]).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    totalEl.style.width = `${pct}%`;
    const label = document.getElementById(`progressLabel_${chapterId}`);
    if (label) label.textContent = `${correct} / ${total} activités réussies`;
  }
};

function initProgressBar(chapterId, totalActivities) {
  const fill = document.getElementById(`progressFill_${chapterId}`);
  if (fill) fill.dataset.total = totalActivities;
  ProgressStore.refreshBar(chapterId);
}

/* ---------- QCM ---------- */
function initQCM(cfg) {
  // cfg: { containerId, chapterId, activityId, prompt, options:[{text,correct}], explanation }
  const el = document.getElementById(cfg.containerId);
  let answered = false;

  el.innerHTML = `
    <div class="activity-prompt">${cfg.prompt}</div>
    <div class="activity-options">
      ${cfg.options.map((opt, i) => `<button class="activity-option" data-i="${i}">${opt.text}</button>`).join("")}
    </div>
    <div class="activity-feedback" id="${cfg.containerId}_fb"></div>
  `;
  const fb = document.getElementById(`${cfg.containerId}_fb`);

  el.querySelectorAll(".activity-option").forEach(btn => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const i = Number(btn.dataset.i);
      const isCorrect = !!cfg.options[i].correct;

      el.querySelectorAll(".activity-option").forEach((b, j) => {
        b.disabled = true;
        if (cfg.options[j].correct) b.classList.add("reveal-correct");
      });
      btn.classList.add(isCorrect ? "selected-correct" : "selected-wrong");

      fb.className = `activity-feedback show ${isCorrect ? "feedback-ok" : "feedback-ko"}`;
      fb.innerHTML = (isCorrect ? "✅ Exact ! " : "❌ Pas tout à fait. ") + (cfg.explanation || "");

      if (cfg.chapterId && cfg.activityId) ProgressStore.record(cfg.chapterId, cfg.activityId, isCorrect);
    });
  });
}

/* ---------- Vrai / Faux ---------- */
function initVraiFaux(cfg) {
  // cfg: { containerId, chapterId, activityId, prompt, correct:true|false, explanation }
  initQCM({
    containerId: cfg.containerId,
    chapterId: cfg.chapterId,
    activityId: cfg.activityId,
    prompt: cfg.prompt,
    explanation: cfg.explanation,
    options: [
      { text: "Vrai", correct: cfg.correct === true },
      { text: "Faux", correct: cfg.correct === false }
    ]
  });
}

/* ---------- Estimation (réponse numérique à tolérance) ---------- */
function initEstimation(cfg) {
  // cfg: { containerId, chapterId, activityId, prompt, answer, tolerance, unit, explanation }
  const el = document.getElementById(cfg.containerId);
  el.innerHTML = `
    <div class="activity-prompt">${cfg.prompt}</div>
    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
      <input type="number" class="activity-estimate-input" id="${cfg.containerId}_input" step="any">
      <span style="color:var(--chalk-dim);">${cfg.unit || ""}</span>
      <button class="activity-option" style="width:auto;" id="${cfg.containerId}_btn">Valider</button>
    </div>
    <div class="activity-feedback" id="${cfg.containerId}_fb"></div>
  `;
  const input = document.getElementById(`${cfg.containerId}_input`);
  const btn = document.getElementById(`${cfg.containerId}_btn`);
  const fb = document.getElementById(`${cfg.containerId}_fb`);
  let answered = false;

  btn.addEventListener("click", () => {
    if (answered) return;
    const val = Number(input.value);
    if (Number.isNaN(val) || input.value.trim() === "") return;
    answered = true;
    btn.disabled = true; input.disabled = true;

    const tol = cfg.tolerance ?? Math.abs(cfg.answer) * 0.1;
    const isCorrect = Math.abs(val - cfg.answer) <= tol;

    fb.className = `activity-feedback show ${isCorrect ? "feedback-ok" : "feedback-ko"}`;
    fb.innerHTML = (isCorrect
      ? `✅ Exact (ou très proche) ! `
      : `❌ La valeur attendue est plutôt ${cfg.answer} ${cfg.unit || ""}. `) + (cfg.explanation || "");

    if (cfg.chapterId && cfg.activityId) ProgressStore.record(cfg.chapterId, cfg.activityId, isCorrect);
  });
}

/* ============================================================
   Textes à trous : correction tolérante (inputs .blank,
   data-answer="réponse 1|réponse 2|..."), branchée automatiquement
   sur #checkCourseBtn. Neutralise l'ancien script rigide présent en
   bas des pages chapitres, sans modifier le HTML.

   Options facultatives par trou (attributs HTML) :
     data-strict="true"  → seule la normalisation s'applique
                           (pas de sous-expression ni de coquille)
   ============================================================ */
const TolerantAnswer = (() => {
  // articles et élisions ignorés partout dans la réponse
  const STOPWORDS = new Set(["le", "la", "les", "l", "un", "une", "des", "du", "de", "d", "au", "aux"]);
  const SUBEXPR_MIN_LETTERS = 5;   // "charge" OK, "demi" seul refusé
  const TYPO_MIN_LENGTH = 5;       // coquille tolérée à partir de 5 lettres

  function stripAccents(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function normalize(raw) {
    let s = stripAccents(String(raw ?? "").toLowerCase())
      .replace(/œ/g, "oe").replace(/æ/g, "ae")
      .replace(/[’‘`´]/g, "'")
      .replace(/(\d),(\d)/g, "$1.$2");                   // 3,5 → 3.5
    s = s.replace(/\b([a-z]+)'/g, "$1 ");                // d'électrons → d électrons
    s = s.replace(/[-–—](?=[a-z])/g, " ");               // demi-équation → demi équation (Cl-, e-, -3 inchangés)
    s = s.replace(/[^a-z0-9.+\- ]/g, " ");               // autres symboles → espace
    return s.replace(/\s+/g, " ").trim();
  }

  // un mot est "chimique" s'il contient un chiffre ou un signe de charge : comparaison exacte
  function isFormulaToken(t) { return /[0-9+\-]/.test(t); }

  function singular(t) {
    if (isFormulaToken(t) || t.length <= 3) return t;
    return t.replace(/[sx]$/, "");
  }

  function tokens(raw) {
    const all = normalize(raw).split(" ").filter(Boolean);
    const kept = all.filter(t => !STOPWORDS.has(t));
    return (kept.length ? kept : all).map(singular);    // garde-fou si la réponse n'est qu'un article
  }

  function levenshtein(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;   // on ne s'intéresse qu'à ≤ 1
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  function tokenMatch(given, expected, allowTypo) {
    if (given === expected) return true;
    if (!allowTypo || isFormulaToken(expected) || isFormulaToken(given)) return false;
    return expected.length >= TYPO_MIN_LENGTH && levenshtein(given, expected) <= 1;
  }

  function asNumber(raw) {
    const s = normalize(raw).replace(/\s/g, "");
    return /^[+\-]?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
  }

  // renvoie "exact" | "approx" | null
  function matchOne(given, expected, strict) {
    const nG = asNumber(given), nE = asNumber(expected);
    if (nG !== null && nE !== null) return nG === nE ? "exact" : null;

    const g = tokens(given), e = tokens(expected);
    if (!g.length || !e.length) return null;
    if (g.join(" ") === e.join(" ")) return "exact";
    if (strict) return null;

    // même nombre de mots, chacun identique ou à une coquille près
    if (g.length === e.length && g.every((t, i) => tokenMatch(t, e[i], true))) return "approx";

    // mots collés ou espace en trop : "demiequation" ↔ "demi equation"
    const gj = g.join(""), ej = e.join("");
    if (gj === ej) return "approx";
    if (!e.some(isFormulaToken) && ej.length >= TYPO_MIN_LENGTH && levenshtein(gj, ej) <= 1) return "approx";

    // sous-expression : début significatif de la cible ("charge" pour "charge électrique")
    if (e.length > 1 && g.length < e.length && g.every((t, i) => tokenMatch(t, e[i], true))) {
      const letters = g.join("").length;
      if (letters >= SUBEXPR_MIN_LETTERS || letters >= ej.length / 2) return "approx";
    }
    return null;
  }

  function check(given, acceptedList, strict) {
    let best = null;
    for (const exp of acceptedList) {
      const r = matchOne(given, exp, strict);
      if (r === "exact") return "exact";
      if (r) best = r;
    }
    return best;
  }

  return { normalize, tokens, levenshtein, matchOne, check };
})();

(function setupTolerantBlankCheck() {
  const PASS_THRESHOLD = 0.8;   // activité validée dès 80 % de bonnes réponses

  function detectChapterId() {
    const fill = document.querySelector('[id^="progressFill_"]');
    if (fill) return fill.id.slice("progressFill_".length);
    const label = document.querySelector('[id^="progressLabel_"]');
    return label ? label.id.slice("progressLabel_".length) : null;
  }

  function getReveal(input) {
    const next = input.nextElementSibling;
    if (next && next.matches("span.reveal")) return next;
    const span = document.createElement("span");
    span.className = "reveal";
    input.insertAdjacentElement("afterend", span);
    return span;
  }

  function handler(e) {
    const btn = e.target instanceof Element ? e.target.closest("#checkCourseBtn") : null;
    if (!btn) return;
    // neutralise l'ancien écouteur rigide (sur le bouton ou en délégation)
    e.stopImmediatePropagation();
    e.preventDefault();

    const panel = btn.closest(".mode-panel");
    const scope = panel && panel.querySelector("input.blank") ? panel : document;
    const blanks = [...scope.querySelectorAll("input.blank")];
    if (!blanks.length) return;

    let good = 0;
    blanks.forEach(input => {
      const accepted = (input.dataset.answer || "").split("|").map(s => s.trim()).filter(Boolean);
      const strict = input.dataset.strict === "true";
      const result = input.value.trim() ? TolerantAnswer.check(input.value, accepted, strict) : null;
      const reveal = getReveal(input);

      input.classList.remove("ok", "ko", "approx");
      input.removeAttribute("title");
      if (result) {
        good++;
        input.classList.add("ok");
        if (result === "approx") {
          // accepté, mais on montre l'orthographe attendue au survol
          input.classList.add("approx");
          input.title = `Accepté — forme attendue : ${accepted[0]}`;
        }
        reveal.textContent = "";
        reveal.classList.remove("show");
        reveal.style.display = "none";
      } else {
        input.classList.add("ko");
        reveal.textContent = accepted[0] || "";
        reveal.classList.add("show");
        reveal.style.display = "";
      }
    });

    const total = blanks.length;
    const ratio = good / total;
    const passed = ratio >= PASS_THRESHOLD;

    const scoreLine = document.getElementById("scoreLine");
    if (scoreLine) {
      scoreLine.textContent = `Score : ${good} / ${total} (${Math.round(ratio * 100)} %)` +
        (passed ? " — activité validée ✅" : ` — il faut au moins ${Math.ceil(PASS_THRESHOLD * total)} bonnes réponses pour valider`);
    }

    const chapterId = detectChapterId();
    if (chapterId && typeof ProgressStore !== "undefined") {
      const already = ProgressStore.load(chapterId)["trous-complet"] === true;
      // une réussite déjà acquise n'est jamais effacée par un essai moins bon
      if (passed || !already) ProgressStore.record(chapterId, "trous-complet", passed);
    }
  }

  // Capture au niveau de window : s'exécute avant tout écouteur posé sur le bouton,
  // quel que soit l'ordre de chargement des scripts (même si le bouton n'existe pas encore).
  if (typeof window !== "undefined" && !window.__tolerantBlankCheckInstalled) {
    window.__tolerantBlankCheckInstalled = true;
    window.addEventListener("click", handler, true);
  }
})();
