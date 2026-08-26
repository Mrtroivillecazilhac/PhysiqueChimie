/* Fonctions utilitaires partagées entre plusieurs chapitres (1ère spé PC) */

const NA = 6.02e23; // constante d'Avogadro, utilisée par plusieurs animations

function toSuperscript(numStr) {
  const map = { "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻" };
  return numStr.split("").map(c => map[c] ?? c).join("");
}

function formatSci(x) {
  // "1,32e+24" → "1,32 × 10²⁴" avec un vrai exposant
  const [mantissa, exp] = x.toExponential(2).split("e");
  const cleanExp = exp.replace("+", "");
  return `${mantissa.replace(".", ",")} × 10${toSuperscript(cleanExp)}`;
}

function generateDotsInEllipse(count, cx, cy, rx, ry, tries = 4000) {
  const pts = [];
  let t = 0;
  while (pts.length < count && t < tries) {
    t++;
    const x = cx - rx + Math.random() * rx * 2;
    const y = cy - ry + Math.random() * ry * 2;
    if (((x - cx) ** 2) / (rx ** 2) + ((y - cy) ** 2) / (ry ** 2) <= 1) pts.push([x, y]);
  }
  return pts;
}
