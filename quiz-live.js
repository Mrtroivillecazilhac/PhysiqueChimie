/* ============================================================
   Quiz en direct (façon Kahoot) — code partagé entre
   quiz-prof.html (écran projeté) et jouer.html (ordinateurs
   des groupes).

   Synchronisation : Firebase Realtime Database, via son API REST
   (fetch + EventSource), sans bibliothèque externe.

   >>> À configurer une seule fois : coller ci-dessous l'URL de la
   base Firebase (console Firebase > Realtime Database > onglet
   « Données » : l'adresse affichée en haut).
   Tant qu'elle est vide, le quiz tourne en « mode démo » : tout se
   passe dans des onglets du même navigateur, pratique pour tester.
   ============================================================ */
const QUIZ_FIREBASE_URL = "";
// ex. "https://quiz-pc-default-rtdb.europe-west1.firebasedatabase.app"

/* ---------- Petites aides ---------- */
const QuizUtil = {
  escape(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  },
  randomId(n) {
    const chars = "abcdefghijkmnpqrstuvwxyz23456789";
    let s = "";
    for (let i = 0; i < (n || 10); i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  },
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  // Les 4 couleurs/formes des réponses, communes aux deux écrans
  FORMES: [
    { nom: "triangle", couleur: "var(--quiz-a)", svg: '<polygon points="12,3 22,21 2,21"/>' },
    { nom: "losange", couleur: "var(--quiz-b)", svg: '<polygon points="12,2 22,12 12,22 2,12"/>' },
    { nom: "rond", couleur: "var(--quiz-c)", svg: '<circle cx="12" cy="12" r="10"/>' },
    { nom: "carré", couleur: "var(--quiz-d)", svg: '<rect x="3" y="3" width="18" height="18" rx="2"/>' }
  ],
  formeSVG(i) {
    return `<svg class="quiz-forme" viewBox="0 0 24 24" aria-hidden="true">${this.FORMES[i].svg}</svg>`;
  },
  // Points : 1000 pour une réponse immédiate, 500 au dernier moment
  points(ecartMs, dureeMs) {
    const f = Math.min(1, Math.max(0, ecartMs / dureeMs));
    return Math.round(1000 * (1 - 0.5 * f));
  },
  BONUS_SERIE: 100,     // par bonne réponse consécutive au-delà de la 1re
  BONUS_SERIE_MAX: 300,
  TOLERANCE_MS: 2000    // délai réseau accepté après la fin du chrono
};

/* ---------- Accès aux données (Firebase ou démo locale) ---------- */
const QuizDB = (function () {
  const params = new URLSearchParams(location.search);
  const base = (QUIZ_FIREBASE_URL || "").trim().replace(/\/+$/, "");
  const mode = (!base || params.has("demo")) ? "demo" : "firebase";
  // Horodatage posé par le serveur (évite les écarts d'horloge entre ordinateurs)
  const SERVER_TIME = { ".sv": "timestamp" };

  function parts(p) { return String(p || "").split("/").filter(Boolean); }

  function getAt(obj, p) {
    let cur = obj;
    for (const k of parts(p)) {
      if (cur == null || typeof cur !== "object") return null;
      cur = cur[k];
    }
    return cur === undefined ? null : cur;
  }

  // Renvoie une copie de obj où la valeur à p est remplacée (null = suppression),
  // en élaguant les objets vides comme le fait Firebase.
  function setAt(obj, p, value) {
    const ks = parts(p);
    if (!ks.length) return value == null ? null : value;
    const copy = (obj && typeof obj === "object") ? (Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)) : {};
    const k = ks[0];
    const child = setAt(copy[k], ks.slice(1).join("/"), value);
    if (child == null || (typeof child === "object" && !Array.isArray(child) && !Object.keys(child).length)) delete copy[k];
    else copy[k] = child;
    return Object.keys(copy).length ? copy : null;
  }

  /* ----- Mode démo : un arbre JSON dans le localStorage ----- */
  const LS_KEY = "quizLiveDemo";
  const localListeners = new Set();

  function demoLoad() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch (e) { return null; }
  }
  function resolveTime(v) {
    if (v && typeof v === "object") {
      if (v[".sv"] === "timestamp") return Date.now();
      const out = Array.isArray(v) ? [] : {};
      for (const k of Object.keys(v)) out[k] = resolveTime(v[k]);
      return out;
    }
    return v;
  }
  function demoSave(tree) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(tree)); } catch (e) { /* stockage plein ou bloqué */ }
    localListeners.forEach(fn => fn());
  }
  if (mode === "demo") {
    window.addEventListener("storage", e => { if (e.key === LS_KEY) localListeners.forEach(fn => fn()); });
  }

  const demo = {
    async get(p) { return getAt(demoLoad(), p); },
    async set(p, v) { const val = resolveTime(v); demoSave(setAt(demoLoad(), p, val)); return val; },
    async update(p, obj) {
      let tree = demoLoad();
      for (const k of Object.keys(obj)) tree = setAt(tree, parts(p).concat(parts(k)).join("/"), resolveTime(obj[k]));
      demoSave(tree);
    },
    async remove(p) { demoSave(setAt(demoLoad(), p, null)); },
    async keys(p) { const v = getAt(demoLoad(), p); return v && typeof v === "object" ? Object.keys(v) : []; },
    listen(p, cb) {
      let last;
      const check = () => {
        const v = getAt(demoLoad(), p);
        const s = JSON.stringify(v);
        if (s !== last) { last = s; cb(v); }
      };
      localListeners.add(check);
      setTimeout(check, 0);
      return () => localListeners.delete(check);
    }
  };

  /* ----- Mode Firebase : API REST + flux EventSource ----- */
  function url(p, query) { return `${base}/${parts(p).join("/")}.json${query ? "?" + query : ""}`; }
  async function req(method, p, body, query) {
    const r = await fetch(url(p, query), {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    if (!r.ok) throw new Error(`Firebase ${method} ${p} : ${r.status}`);
    return r.json();
  }
  const statusListeners = new Set();
  function setStatus(s) { statusListeners.forEach(fn => fn(s)); }

  const firebase = {
    get(p) { return req("GET", p); },
    set(p, v) { return req("PUT", p, v); },
    update(p, obj) { return req("PATCH", p, obj); },
    remove(p) { return req("DELETE", p); },
    async keys(p) { const v = await req("GET", p, undefined, "shallow=true"); return v ? Object.keys(v) : []; },
    listen(p, cb) {
      let snap = null;
      let ready = false;
      const es = new EventSource(url(p));
      const apply = (evt, isPatch) => {
        let msg;
        try { msg = JSON.parse(evt.data); } catch (e) { return; }
        if (!msg) return;
        if (isPatch) {
          for (const k of Object.keys(msg.data || {})) snap = setAt(snap, parts(msg.path).concat(parts(k)).join("/"), msg.data[k]);
        } else {
          snap = setAt(snap, msg.path, msg.data);
        }
        ready = true;
        setStatus("ok");
        cb(snap);
      };
      es.addEventListener("put", e => apply(e, false));
      es.addEventListener("patch", e => apply(e, true));
      es.addEventListener("cancel", () => setStatus("refus"));
      es.onerror = () => setStatus(ready ? "reconnexion" : "erreur");
      return () => es.close();
    }
  };

  const api = mode === "demo" ? demo : firebase;
  return {
    mode,
    SERVER_TIME,
    get: api.get, set: api.set, update: api.update, remove: api.remove, keys: api.keys, listen: api.listen,
    onStatus(fn) { statusListeners.add(fn); },
    // exposés pour les tests
    _setAt: setAt, _getAt: getAt
  };
})();
