/* ============================================================
   script.js — "moteur" partagé par toutes les pages de niveau.
   Chaque page appelle initWheel(...) avec SES propres questions,
   et éventuellement initMemo(...) avec SES propres cartes.
   ============================================================ */

const WHEEL_COLORS = ["#6bbfab","#e8c468","#d97a63","#8fb3d9","#b98fd9","#d9a86b"];

function initWheel({
  levelLabel,
  questions,
  wheelId = "wheel",
  spinBtnId = "spinBtn",
  resultTagId = "resultTag",
  resultQId = "resultQ",
  timerId = "timer"
}) {
  const wheelEl = document.getElementById(wheelId);
  let currentRotation = 0;

  // Tirage "sans remise" : on garde une réserve des index pas encore
  // tombés. Une fois tous sortis, on la remélange pour un nouveau tour.
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  let remaining = shuffle(questions.map((_, i) => i));

  function drawWheel() {
    const n = questions.length;
    const cx = 100, cy = 100, r = 98;
    let svg = "";
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      svg += `<path d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${WHEEL_COLORS[i % WHEEL_COLORS.length]}" opacity="0.85" stroke="#16261f" stroke-width="1.5"/>`;
    }
    wheelEl.innerHTML = svg;
  }
  drawWheel();

  let timerInterval = null;
  const spinBtn = document.getElementById(spinBtnId);

  spinBtn.addEventListener("click", () => {
    const n = questions.length;
    if (remaining.length === 0) {
      remaining = shuffle(questions.map((_, i) => i));
    }
    const idx = remaining.pop();
    const segAngle = 360 / n;
    const targetAngle = 360 * 5 - (idx * segAngle + segAngle / 2);
    currentRotation += 360 * 5 + (targetAngle % 360);
    wheelEl.style.transform = `rotate(${currentRotation}deg)`;

    spinBtn.disabled = true;
    document.getElementById(resultTagId).textContent = "La roue tourne…";
    document.getElementById(resultQId).textContent = "";
    document.getElementById(timerId).textContent = "";
    clearInterval(timerInterval);

    setTimeout(() => {
      spinBtn.disabled = false;
      const vues = n - remaining.length;
      document.getElementById(resultTagId).textContent = `${levelLabel} · ${vues}/${n} vues ce tour`;
      document.getElementById(resultQId).textContent = questions[idx];
      let t = 60;
      document.getElementById(timerId).textContent = "⏱ 1:00";
      timerInterval = setInterval(() => {
        t--;
        const m = Math.floor(t / 60), s = t % 60;
        document.getElementById(timerId).textContent = `⏱ ${m}:${s.toString().padStart(2, "0")}`;
        if (t <= 0) {
          clearInterval(timerInterval);
          document.getElementById(timerId).textContent = "⏱ Temps écoulé !";
        }
      }, 1000);
    }, 4300);
  });
}

/* ============================================================
   Icônes SVG de verrerie — dessinées "à la craie", pas de dépendance
   externe. currentColor permet au CSS de gérer la couleur.
   ============================================================ */
const GLASSWARE_ICONS = {
  becher: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 18 L22 82 Q22 90 30 90 L50 90 Q58 90 58 82 L58 18"/><line x1="22" y1="18" x2="16" y2="12"/><line x1="30" y1="60" x2="50" y2="60" stroke-width="1.5" opacity="0.5"/><line x1="30" y1="72" x2="50" y2="72" stroke-width="1.5" opacity="0.5"/></svg>`,
  erlenmeyer: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 14 L32 34 L14 84 Q12 90 20 90 L60 90 Q68 90 66 84 L48 34 L48 14"/><line x1="28" y1="14" x2="52" y2="14"/></svg>`,
  eprouvette: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M28 10 L28 84 Q28 90 34 90 L46 90 Q52 90 52 84 L52 10"/><line x1="20" y1="90" x2="60" y2="90"/><line x1="30" y1="35" x2="38" y2="35" stroke-width="1.5" opacity="0.6"/><line x1="30" y1="50" x2="38" y2="50" stroke-width="1.5" opacity="0.6"/><line x1="30" y1="65" x2="38" y2="65" stroke-width="1.5" opacity="0.6"/></svg>`,
  ballon: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="40" cy="62" r="26"/><line x1="34" y1="14" x2="34" y2="38"/><line x1="46" y1="14" x2="46" y2="38"/><line x1="30" y1="14" x2="50" y2="14"/></svg>`,
  burette: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="38" y1="6" x2="38" y2="78"/><line x1="46" y1="6" x2="46" y2="78"/><rect x="30" y="78" width="24" height="10" rx="3" stroke-width="3"/><line x1="42" y1="88" x2="42" y2="96"/><line x1="38" y1="25" x2="46" y2="25" stroke-width="1.5" opacity="0.6"/><line x1="38" y1="45" x2="46" y2="45" stroke-width="1.5" opacity="0.6"/></svg>`,
  pipette: `<svg viewBox="0 0 80 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="40" y1="6" x2="40" y2="34"/><ellipse cx="40" cy="50" rx="14" ry="18"/><line x1="40" y1="68" x2="40" y2="96" stroke-width="2.5"/></svg>`
};

/* ============================================================
   Chrono-verrerie : un nom s'affiche, l'élève clique sur le bon
   dessin. Chronomètre progressif + tirage "sans remise" des noms.
   items attendu : [{ id: "becher", name: "Bécher" }, ...]
   ============================================================ */
function initSpeedID(items) {
  const grid = document.getElementById("speedGrid");
  const promptEl = document.getElementById("speedPrompt");
  const timerEl = document.getElementById("speedTimer");
  const statsEl = document.getElementById("speedStats");
  const winEl = document.getElementById("speedWin");
  const resetBtn = document.getElementById("resetSpeed");

  let queue = [], current = null, mistakes = 0, found = 0;
  let startTime = null, tickInterval = null, finished = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(ms) {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }

  function renderGrid() {
    grid.innerHTML = "";
    shuffle([...items]).forEach((it) => {
      const tile = document.createElement("button");
      tile.className = "glass-tile";
      tile.innerHTML = GLASSWARE_ICONS[it.id];
      tile.addEventListener("click", () => onTileClick(tile, it.id));
      grid.appendChild(tile);
    });
  }

  function updateStats() {
    statsEl.textContent = `${found}/${items.length} trouvés · ${mistakes} erreur${mistakes > 1 ? "s" : ""}`;
  }

  function nextPrompt() {
    if (queue.length === 0) {
      finished = true;
      clearInterval(tickInterval);
      promptEl.textContent = "Terminé 🎉";
      winEl.textContent = `Bravo ! ${items.length} instruments trouvés en ${formatTime(Date.now() - startTime)} (${mistakes} erreur${mistakes > 1 ? "s" : ""}).`;
      return;
    }
    current = queue.pop();
    promptEl.textContent = current.name;
  }

  function onTileClick(tile, id) {
    if (finished || !current) return;
    if (id === current.id) {
      tile.classList.add("correct");
      setTimeout(() => tile.classList.remove("correct"), 500);
      found++;
      updateStats();
      nextPrompt();
    } else {
      mistakes++;
      tile.classList.add("wrong");
      setTimeout(() => tile.classList.remove("wrong"), 400);
      updateStats();
    }
  }

  function start() {
    resetBtn.textContent = "🔄 Recommencer";
    renderGrid();
    queue = shuffle([...items]);
    mistakes = 0; found = 0; finished = false;
    winEl.textContent = "";
    updateStats();
    startTime = Date.now();
    clearInterval(tickInterval);
    tickInterval = setInterval(() => {
      timerEl.textContent = "⏱ " + formatTime(Date.now() - startTime);
    }, 250);
    nextPrompt();
  }

  resetBtn.addEventListener("click", start);

  // État initial : rien n'est affiché ni lancé tant qu'on n'a pas cliqué.
  grid.innerHTML = "";
  promptEl.textContent = "Clique sur « Démarrer » pour commencer";
  timerEl.textContent = "⏱ 0:00";
  updateStats();
  resetBtn.textContent = "▶ Démarrer";
}
