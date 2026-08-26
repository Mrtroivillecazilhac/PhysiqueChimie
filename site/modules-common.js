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
