/* ============================================================
   VERRERIE_SVG — bibliothèque partagée de schémas de verrerie de laboratoire
   Fichier partagé (comme styles.css / animations-common.js), à inclure une
   seule fois et à réutiliser dans tous les chapitres qui ont besoin de
   représenter du matériel de chimie (bécher, fiole jaugée, pipette, etc.).

   Chaque entrée fournit :
   - width / height : dimensions natives du dessin (repère local)
   - markup         : fragment SVG (paths/lines/etc.), SANS balise <svg>,
                       à placer dans un <g transform="translate(x,y) scale(s)">

   Utilisation :
     const scene = `
       <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">
         ${verrerieG("flacon", { x: 10, y: 5, scale: 0.7 })}
         ${verrerieG("becher", { x: 140, y: 10, scale: 0.75 })}
       </svg>`;

   Toutes les couleurs utilisent les variables CSS du site
   (--chalk-dim, --yellow, --teal, --coral, --board) pour s'adapter
   automatiquement au thème de chaque niveau.
   ============================================================ */

const VERRERIE_SVG = {

  /* Bécher avec bec verseur et graduations */
  becher: {
    width: 120, height: 140,
    markup: `
      <path d="M26 30 L34 112 Q34 120 42 120 L78 120 Q86 120 86 112 L92 32 L102 20 L94 30 Z"
            fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="38" y1="58" x2="43" y2="58" stroke="var(--chalk-dim)" stroke-width="1.2"/>
      <line x1="37" y1="78" x2="44" y2="78" stroke="var(--chalk-dim)" stroke-width="1.2"/>
      <line x1="36" y1="98" x2="45" y2="98" stroke="var(--chalk-dim)" stroke-width="1.2"/>
    `
  },

  /* Flacon de réactif / solution mère, avec étiquette */
  flacon: {
    width: 120, height: 180,
    markup: `
      <path d="M30 60 L30 158 Q30 168 40 168 L80 168 Q90 168 90 158 L90 60 L70 38 L70 24 L50 24 L50 38 Z"
            fill="rgba(232,196,104,0.06)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="46" y="14" width="28" height="12" rx="2" fill="rgba(255,255,255,0.05)" stroke="var(--chalk-dim)" stroke-width="2.2"/>
      <rect x="40" y="92" width="40" height="34" rx="3" fill="var(--board)" stroke="var(--chalk-dim)" stroke-width="1.6"/>
      <line x1="46" y1="102" x2="74" y2="102" stroke="var(--chalk-dim)" stroke-width="1.4"/>
      <line x1="46" y1="110" x2="74" y2="110" stroke="var(--chalk-dim)" stroke-width="1.4"/>
      <line x1="46" y1="118" x2="66" y2="118" stroke="var(--chalk-dim)" stroke-width="1.4"/>
    `
  },

  /* Fiole jaugée OUVERTE : corps conique, col fin, trait de jauge (sans bouchon,
     état le plus courant pendant le protocole : on verse, on remplit, on ajuste) */
  fioleJaugee: {
    width: 120, height: 200,
    markup: `
      <path d="M55 30 L55 90 L35 165 Q35 178 45 178 L75 178 Q85 178 85 165 L65 90 L65 30 Z"
            fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="47" y1="45" x2="73" y2="45" stroke="var(--yellow)" stroke-width="2"/>
    `
  },

  /* Bouchon seul, à composer par-dessus fioleJaugee (translate x=52,y=20 dans
     le repère de la fiole) quand la fiole doit apparaître fermée */
  bouchon: {
    width: 16, height: 10,
    markup: `<rect x="0" y="0" width="16" height="10" rx="2" fill="rgba(255,255,255,0.05)" stroke="var(--chalk-dim)" stroke-width="2"/>`
  },

  /* Propipette (poire de sécurité à 3 valves A/S/E) — se pose au-dessus de pipetteJaugee */
  propipette: {
    width: 100, height: 90,
    markup: `
      <ellipse cx="50" cy="38" rx="23" ry="28" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="2.5"/>
      <circle cx="38" cy="16" r="4.5" fill="var(--chalk-dim)"/>
      <circle cx="50" cy="11" r="4.5" fill="var(--teal)"/>
      <circle cx="62" cy="16" r="4.5" fill="var(--coral)"/>
      <text x="38" y="18" text-anchor="middle" font-size="5.5" fill="var(--board)" font-family="var(--font-body)">A</text>
      <text x="50" y="13" text-anchor="middle" font-size="5.5" fill="var(--board)" font-family="var(--font-body)">S</text>
      <text x="62" y="18" text-anchor="middle" font-size="5.5" fill="var(--board)" font-family="var(--font-body)">E</text>
      <path d="M42 64 L45 90 L55 90 L58 64 Z" fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round"/>
    `
  },

  /* Pipette jaugée seule (repère local : le haut du tube est à y=0,
     pensé pour être placé juste sous propipette avec translate(0,90)) */
  pipetteJaugee: {
    width: 100, height: 170,
    markup: `
      <path d="M45 0 L45 35 Q30 55 45 80 L45 150 L50 170 L55 150 L55 80 Q70 55 55 35 L55 0 Z"
            fill="rgba(107,191,171,0.06)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <line x1="42" y1="90" x2="58" y2="90" stroke="var(--yellow)" stroke-width="2"/>
    `
  },

  /* Pissette (flacon laveur) avec tube coudé */
  pissette: {
    width: 140, height: 200,
    markup: `
      <path d="M35 70 L35 172 Q35 180 43 180 L87 180 Q95 180 95 172 L95 70 L75 45 L75 30 L55 30 L55 45 Z"
            fill="rgba(107,191,171,0.08)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="52" y="20" width="26" height="11" rx="2" fill="rgba(255,255,255,0.05)" stroke="var(--chalk-dim)" stroke-width="2.2"/>
      <path d="M68 22 C86 12 104 20 108 36 C111 47 114 52 120 58"
            fill="none" stroke="var(--chalk-dim)" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="121" cy="60" r="2.6" fill="var(--teal)"/>
      <circle cx="123" cy="67" r="1.8" fill="var(--teal)" opacity="0.7"/>
    `
  },

  /* Compte-gouttes */
  compteGouttes: {
    width: 100, height: 170,
    markup: `
      <path d="M38 10 Q30 10 30 22 L30 38 Q30 44 36 44 L64 44 Q70 44 70 38 L70 22 Q70 10 62 10 Z"
            fill="rgba(217,122,99,0.14)" stroke="var(--chalk-dim)" stroke-width="2.5"/>
      <path d="M42 44 L44 130 L50 150 L56 130 L58 44 Z"
            fill="rgba(107,191,171,0.06)" stroke="var(--chalk-dim)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      <ellipse cx="50" cy="158" rx="2.6" ry="3.4" fill="var(--coral)"/>
    `
  }
};

/* Place une pièce de verrerie dans une scène composée :
   verrerieG("becher", { x: 140, y: 10, scale: 0.75 }) */
function verrerieG(name, opts) {
  const piece = VERRERIE_SVG[name];
  if (!piece) return "";
  const { x = 0, y = 0, scale = 1 } = opts || {};
  return `<g transform="translate(${x} ${y}) scale(${scale})">${piece.markup}</g>`;
}
