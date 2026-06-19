'use strict';

// Geräte-Icons: Gerät + Mensch in schattiertem, warmem Stil mit glühendem Zielmuskel —
// gleiche Bildsprache wie das Körpermodell (body-map.js). Eine kleine Figuren-Engine
// (gefüllte, verjüngte Glieder) sorgt für konsistente, natürliche Proportionen; je Übung
// kommen Gerät + Pose + Zielmuskel dazu.
//
// WICHTIG (CSP): Die App erlaubt keine Inline-`style`-Attribute. Farben kommen daher nur
// über CSS-Klassen (style.css, gespeist aus --ic-*) oder Verlaufs-Referenzen
// `fill/stroke="url(#ic-*)"`. Verläufe sind je SVG eingebettet (iconGradDefs).
//
// Animation aus style.css: das bewegte Teil trägt `.anim-part`; die Keyframe-Zuordnung je
// `data-icon-id` (Druck/Zug/Kurbel…) ist dort bereits definiert. `.ico-hl` lässt den
// Zielmuskel pulsieren. Beides wirkt nur im Detail-Fenster (`.svg-icon-large`).

// Muskel → Körperseite (front/back). Quelle: MUSCLE_REGIONS (body-map.js).
const MUSCLE_VIEW = Object.fromEntries(MUSCLE_REGIONS.map(m => [m.id, m.view]));

// ---------- Geometrie-/Bau-Helfer ----------
function P(x, y) { return { x, y }; }
function off(p, dx, dy) { return { x: p.x + dx, y: p.y + dy }; }
function f1(n) { return (Math.round(n * 100) / 100).toString(); }

// Verjüngter, an beiden Enden gerundeter Körper-Abschnitt zwischen H und S (Breiten wH→wS).
function taper(H, S, wH, wS) {
  const dx = S.x - H.x, dy = S.y - H.y, L = Math.hypot(dx, dy) || 0.001;
  const ux = dx / L, uy = dy / L, px = -uy, py = ux;
  const a = `${f1(H.x + px * wH)} ${f1(H.y + py * wH)}`;
  const b = `${f1(S.x + px * wS)} ${f1(S.y + py * wS)}`;
  const sT = `${f1(S.x + ux * wS)} ${f1(S.y + uy * wS)}`;
  const c = `${f1(S.x - px * wS)} ${f1(S.y - py * wS)}`;
  const e = `${f1(H.x - px * wH)} ${f1(H.y - py * wH)}`;
  const hT = `${f1(H.x - ux * wH)} ${f1(H.y - uy * wH)}`;
  return `M${a} L${b} Q${sT} ${c} L${e} Q${hT} ${a} Z`;
}
function seg(H, S, wH, wS, attr) { return `<path d="${taper(H, S, wH, wS)}" ${attr}/>`; }

const SKIN = 'fill="url(#ic-skin)"';
const SKINSH = 'class="ic-skinshf"';

function hairCap(h) {
  const x = h.x, y = h.y;
  return `<path d="M${f1(x - 2.9)} ${f1(y - 0.6)} Q${f1(x - 2.3)} ${f1(y - 4.3)} ${f1(x + 0.5)} ${f1(y - 3.8)} Q${f1(x + 2.7)} ${f1(y - 3.3)} ${f1(x + 2.5)} ${f1(y - 0.9)} Q${f1(x + 1)} ${f1(y - 3.1)} ${f1(x - 1.3)} ${f1(y - 2.8)} Q${f1(x - 2.5)} ${f1(y - 2.5)} ${f1(x - 2.9)} ${f1(y - 0.6)} Z" class="ic-hair"/>`;
}

// Vollständige Figur aus Gelenken. j: {head,shoulder,elbow,hand,hip,knee,foot, far?:{...}}
function figureFill(j, d) {
  let s = '';
  const far = j.far || {};
  if (far.knee) { s += seg(off(j.hip, 0.8, 0.5), far.knee, 2.1, 1.7, SKINSH) + seg(far.knee, far.foot, 1.7, 1.3, SKINSH); }
  if (far.elbow) { s += seg(off(j.shoulder, 0.5, 0.3), far.elbow, 1.7, 1.4, SKINSH) + seg(far.elbow, far.hand, 1.4, 1.1, SKINSH); }
  s += seg(j.hip, j.shoulder, 3.9, 4.4, SKIN);                       // Rumpf
  s += seg(j.hip, j.knee, 2.4, 1.9, SKIN) + seg(j.knee, j.foot, 1.9, 1.4, SKIN);   // vorderes Bein
  s += seg(j.shoulder, j.elbow, 1.9, 1.5, SKIN) + seg(j.elbow, j.hand, 1.5, 1.2, SKIN); // vorderer Arm
  s += seg(j.shoulder, j.head, 1.7, 1.5, SKIN);                      // Hals
  s += `<ellipse cx="${j.head.x}" cy="${j.head.y}" rx="3" ry="3.3" fill="url(#ic-skin)"/>`;
  if (d) s += hairCap(j.head);
  s += `<circle cx="${j.hand.x}" cy="${j.hand.y}" r="1.5" fill="url(#ic-skin)"/>`;
  s += `<circle cx="${j.foot.x}" cy="${j.foot.y}" r="1.6" fill="url(#ic-skin)"/>`;
  return s;
}

function muscleGlow(x, y, rx, ry, rot, d) {
  let s = '';
  if (d) s += `<ellipse class="ico-hl" cx="${x}" cy="${y}" rx="${f1(rx + 3.4)}" ry="${f1(ry + 2.6)}" fill="url(#ic-glow)"/>`;
  s += `<ellipse class="ico-hl" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#ic-coral)" transform="rotate(${rot} ${x} ${y})"/>`;
  return s;
}

function plate(cx, cy, r, d) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#ic-metal)"/>`;
  if (d) {
    s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" class="ic-hubs" stroke-width="0.85"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f1(r * 0.6)}" fill="none" class="ic-hubs" stroke-width="0.5" opacity="0.6"/>`;
    s += `<path d="M${f1(cx - r * 0.6)} ${f1(cy - r * 0.55)} Q${f1(cx - r * 0.25)} ${f1(cy - r * 0.92)} ${f1(cx + r * 0.1)} ${f1(cy - r * 0.85)}" class="ic-rim" stroke-width="0.85" fill="none" opacity="0.5"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${f1(Math.min(1.5, r * 0.34))}" class="ic-hubf"/>`;
  return s;
}
function mrect(x, y, w, h, r) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r == null ? 1 : r}" fill="url(#ic-metal)"/>`; }
function crect(x, y, w, h, r) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r == null ? 2 : r}" fill="url(#ic-cushion)"/>`; }
function mline(x1, y1, x2, y2, w) { return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="url(#ic-metal)" stroke-width="${w}" fill="none" stroke-linecap="round"/>`; }
function band(x1, y1, x2, y2, cx, cy) {
  const d = cx == null ? `M${x1} ${y1} L${x2} ${y2}` : `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  return `<path d="${d}" class="band-strand" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
}
function stack(x, y, w, h, d) {
  let s = mrect(x, y, w, h, 1.6);
  if (d) for (let yy = y + 2.6; yy < y + h - 1; yy += 2.6) s += `<line x1="${x + 0.6}" y1="${f1(yy)}" x2="${x + w - 0.6}" y2="${f1(yy)}" class="ic-hubs" stroke-width="0.45" opacity="0.55"/>`;
  return s;
}
function dumbbell(cx, cy, d, r) {
  r = r || 1.9;
  return mline(cx - 2.4, cy, cx + 2.4, cy, 1.3) + plate(cx - 2.6, cy, r, d) + plate(cx + 2.6, cy, r, d);
}

function tileBg(d) { return d ? `<rect x="3" y="3" width="58" height="58" rx="15" class="ic-tile"/>` : ''; }
function ground(d, cx, rx) { return `<ellipse cx="${cx}" cy="56" rx="${rx}" ry="2.2" class="ic-shadow" opacity="${d ? 1 : 0.55}"/>`; }
function iconGradDefs() {
  return `<defs>`
    + `<linearGradient id="ic-skin" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="56"><stop offset="0" class="icg-skin0"/><stop offset="0.55" class="icg-skin1"/><stop offset="1" class="icg-skin2"/></linearGradient>`
    + `<linearGradient id="ic-metal" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="58"><stop offset="0" class="icg-metal0"/><stop offset="0.5" class="icg-metal1"/><stop offset="1" class="icg-metal2"/></linearGradient>`
    + `<linearGradient id="ic-cushion" gradientUnits="userSpaceOnUse" x1="0" y1="14" x2="0" y2="54"><stop offset="0" class="icg-cush0"/><stop offset="1" class="icg-cush1"/></linearGradient>`
    + `<linearGradient id="ic-coral" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="icg-acc0"/><stop offset="1" class="icg-acc1"/></linearGradient>`
    + `<radialGradient id="ic-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" class="icg-acc0" stop-opacity="0.55"/><stop offset="1" class="icg-acc1" stop-opacity="0"/></radialGradient>`
    + `</defs>`;
}
function mkIcon(d, body) {
  return `<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` + iconGradDefs() + tileBg(d) + body + `</svg>`;
}
function anim(inner) { return `<g class="anim-part">${inner}</g>`; }

// ---------- Pose-Vorlagen ----------
function standJoints(o) {
  return Object.assign({
    head: P(30, 11.5), shoulder: P(30, 19), hip: P(30.5, 35), knee: P(30, 46.5), foot: P(27.5, 54.5),
    elbow: P(28.8, 27.5), hand: P(28.8, 34.5),
    far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(31.2, 27.5), hand: P(31.2, 34.5) }
  }, o || {});
}
function seatJoints(o) {
  return Object.assign({
    head: P(27, 22.5), shoulder: P(25.5, 29), hip: P(23.5, 40), knee: P(15, 40), foot: P(15, 50),
    elbow: P(27.5, 34), hand: P(28.5, 38),
    far: { knee: P(16.5, 41), foot: P(16.5, 51), elbow: P(27.5, 34), hand: P(28.5, 38) }
  }, o || {});
}

// ======================= Übungs-Builder =======================
const GERAETE_BUILDERS = {

  // --- Brust ---
  'bankdruecken': (d) => mkIcon(d,
    ground(d, 29, d ? 20 : 19)
    + mrect(7.5, 46.2, 35, 1.9, 0.9) + crect(7, 43, 36, 4, 2) + (d ? `<rect x="8" y="43.2" width="34" height="1.2" rx="0.6" class="ic-rimf" opacity="0.45"/>` : '')
    + mrect(13, 47.8, 2.8, 7.8) + mrect(36, 47.8, 2.8, 7.8) + (d ? mrect(13, 53.2, 25.8, 1.7, 0.85) : '') + mrect(46.8, 25.5, 2.8, 22)
    + (d ? `<path d="M48.2 26.4 Q45 26.4 45 29" stroke="url(#ic-metal)" stroke-width="1.8" fill="none" stroke-linecap="round"/>` : '')
    + figureFill({ head: P(45, 37), shoulder: P(40, 38), elbow: P(38, 31), hand: P(36.4, 25.9), hip: P(23, 41), knee: P(17.3, 33.6), foot: P(15.4, 46.4),
        far: { elbow: P(38.6, 31.5), hand: P(37.2, 26.4), knee: P(18.6, 35), foot: P(20.6, 46.4) } }, d)
    + muscleGlow(37.8, 37, 3.6, 2.7, -10, d)
    + anim(mline(22, 24.2, 50, 24.2, 2.4) + plate(24, 24.2, 4.8, d) + plate(48, 24.2, 4.8, d))
  ),

  'ueberzug': (d) => mkIcon(d,
    ground(d, 29, d ? 20 : 18)
    + mrect(8, 46.2, 33, 1.8, 0.9) + crect(7.5, 43, 34, 4, 2) + mrect(13, 47.8, 2.8, 7.8) + mrect(34, 47.8, 2.8, 7.8)
    + figureFill({ head: P(42, 37.6), shoulder: P(37, 38.4), elbow: P(33.5, 34.5), hand: P(30, 31.5), hip: P(21, 41), knee: P(16, 34), foot: P(15, 46.6),
        far: { elbow: P(33.5, 35), hand: P(30.5, 32), knee: P(17.5, 35.5), foot: P(20, 46.6) } }, d)
    + muscleGlow(36, 37.4, 3.4, 2.6, -8, d)
    + anim(dumbbell(27, 30, d, 2.2))
  ),

  'liegestuetze': (d) => mkIcon(d,
    ground(d, 32, d ? 21 : 19)
    + figureFill({ head: P(49, 36), shoulder: P(43, 39), elbow: P(43, 45), hand: P(43, 50), hip: P(24, 36), knee: P(16, 41), foot: P(11.5, 45),
        far: { elbow: P(42, 45), hand: P(42, 50), knee: P(16, 42), foot: P(11.5, 46) } }, d)
    + muscleGlow(40, 39.5, 3.4, 2.4, 12, d)
    + anim('')
  ),

  // --- Schultern ---
  'schulterdruecken': (d) => mkIcon(d,
    ground(d, 26, d ? 19 : 17)
    + crect(15, 30, 4, 16, 2) + crect(15, 44, 18, 4, 2) + mrect(16, 47.6, 2.6, 8) + mrect(29, 47.6, 2.6, 8)
    + figureFill(seatJoints({ head: P(25, 24), shoulder: P(24.5, 30), elbow: P(28, 27), hand: P(29, 21.5),
        far: { knee: P(16.5, 41), foot: P(16.5, 51), elbow: P(28, 27.5), hand: P(29, 22) } }), d)
    + muscleGlow(25.5, 29.5, 2.8, 2.4, 0, d)
    + anim(mline(23.5, 18.5, 35.5, 18.5, 2.2) + plate(24, 18.5, 3, d) + plate(35, 18.5, 3, d))
  ),

  'seitheben': (d) => mkIcon(d,
    ground(d, 30, d ? 16 : 14)
    + figureFill(standJoints({ elbow: P(23, 24), hand: P(17.5, 27), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(37, 24), hand: P(42.5, 27) } }), d)
    + muscleGlow(30, 20.5, 3, 2.2, 0, d)
    + anim(dumbbell(16.5, 27, d, 1.8) + dumbbell(43.5, 27, d, 1.8))
  ),

  // --- Nacken ---
  'shrugs': (d) => mkIcon(d,
    ground(d, 30, d ? 15 : 13)
    + figureFill(standJoints({ shoulder: P(30, 17.5), elbow: P(26, 27), hand: P(25.5, 36), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(34, 27), hand: P(34.5, 36) } }), d)
    + muscleGlow(30, 17, 3.4, 2, 0, d)
    + anim(dumbbell(25.2, 38, d, 1.9) + dumbbell(34.8, 38, d, 1.9))
  ),

  // --- Arme ---
  'sz-curls': (d) => mkIcon(d,
    ground(d, 30, d ? 14 : 12)
    + figureFill(standJoints({ elbow: P(27, 28), hand: P(30, 23.5), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(33, 28), hand: P(30.5, 23.5) } }), d)
    + muscleGlow(27.8, 26.5, 2.2, 2.6, 18, d)
    + anim(`<path d="M24.5 23.8 Q27 22.4 30 23.2 Q33 24 35.5 22.8" stroke="url(#ic-metal)" stroke-width="2" fill="none" stroke-linecap="round"/>` + plate(24, 24, 2.4, d) + plate(36, 23, 2.4, d))
  ),

  // --- Bauch ---
  'bauchpresse': (d) => mkIcon(d,
    ground(d, 27, d ? 18 : 16)
    + crect(14, 30, 4, 16, 2) + crect(14, 44, 18, 4, 2) + mrect(15, 47.6, 2.6, 8) + mrect(28, 47.6, 2.6, 8)
    + crect(30, 22, 4, 13, 2)
    + figureFill(seatJoints({ head: P(26, 23.5), shoulder: P(25, 30), elbow: P(28.5, 33), hand: P(31, 27) }), d)
    + muscleGlow(25, 34, 2.6, 2.8, 0, d)
    + anim(`<g>` + crect(30, 22, 4, 13, 2) + `</g>`)
  ),

  'crunches': (d) => mkIcon(d,
    ground(d, 28, d ? 18 : 16)
    + crect(12, 44, 22, 4, 2) + mrect(14, 47.6, 2.6, 8) + mrect(31, 47.6, 2.6, 8)
    + figureFill({ head: P(38, 30), shoulder: P(34, 34), elbow: P(33, 28), hand: P(35, 24), hip: P(22, 41.5), knee: P(16, 35), foot: P(18, 46.5),
        far: { knee: P(17.5, 36), foot: P(20, 46.5), elbow: P(33, 28.5), hand: P(35, 24.5) } }, d)
    + muscleGlow(27, 38, 2.8, 2.6, 0, d)
    + anim('')
  ),

  // --- Rücken ---
  'lat-pulldown': (d) => mkIcon(d,
    ground(d, 26, d ? 19 : 17)
    + mrect(46, 12, 2.8, 36) + mline(46, 13.4, 30, 13.4, 2.4) + `<circle cx="30" cy="13.4" r="1.8" fill="url(#ic-metal)"/>`
    + stack(43.5, 38, 8.5, 10, d)
    + crect(14, 46, 16, 4, 2) + mrect(21, 49.6, 2.6, 6) + crect(14, 39, 14, 3.4, 1.7)
    + figureFill(seatJoints({ head: P(26, 26.5), shoulder: P(26.5, 31.5), elbow: P(28, 25.5), hand: P(29.5, 20),
        far: { knee: P(16.5, 41), foot: P(16.5, 51.5), elbow: P(28, 26), hand: P(29.5, 20.5) } }), d)
    + muscleGlow(24.5, 32, 2.6, 3, -8, d)
    + anim(mline(30, 15, 30, 19, 1.6) + mline(24, 19, 36, 19, 2.4) + plate(24, 19, 1.6, false) + plate(36, 19, 1.6, false))
  ),

  'rudern-maschine': (d) => mkIcon(d,
    ground(d, 27, d ? 19 : 17)
    + mrect(48, 26, 2.8, 22) + stack(44.5, 30, 7, 16, d)
    + crect(14, 46, 16, 4, 2) + mrect(21, 49.6, 2.6, 6) + crect(31, 30, 3.4, 14, 1.7)
    + figureFill(seatJoints({ head: P(25, 25), shoulder: P(25, 31), elbow: P(29, 33.5), hand: P(33, 35) }), d)
    + muscleGlow(24, 32, 2.6, 2.8, -6, d)
    + anim(mline(33, 35, 44, 35, 2) + `<circle cx="33.5" cy="35" r="1.6" fill="url(#ic-metal)"/>`)
  ),

  'klimmzug-breit': (d) => klimmzug(d, 'breit'),
  'klimmzug-neutral': (d) => klimmzug(d, 'neutral'),
  'klimmzug-untergriff': (d) => klimmzug(d, 'unter'),

  // --- Beine ---
  'leg-extension': (d) => mkIcon(d,
    ground(d, 27, d ? 19 : 17)
    + crect(14, 30, 4, 14, 2) + crect(14, 42, 17, 4, 2) + mrect(16, 49.6, 2.6, 6) + mrect(28, 45.6, 2.6, 4)
    + figureFill(seatJoints({ head: P(26, 24.5), shoulder: P(25.5, 30.5), elbow: P(27, 36), hand: P(24, 40), hip: P(23.5, 41), knee: P(15.5, 40), foot: P(15.5, 49),
        far: { knee: P(17, 41), foot: P(17, 49.5), elbow: P(27, 36), hand: P(24, 40) } }), d)
    + muscleGlow(19, 41.5, 2.8, 2.2, -8, d)
    + anim(`<g>` + seg(P(15.5, 40), P(26, 40), 1.9, 1.5, SKIN) + `<circle cx="26" cy="40" r="1.5" fill="url(#ic-skin)"/>` + mrect(25, 38, 2.4, 4, 1.2) + `</g>`)
  ),

  'leg-press': (d) => mkIcon(d,
    ground(d, 28, d ? 20 : 18)
    + crect(8, 42, 12, 4, 2) + crect(8, 33, 4, 11, 2)
    + mline(18, 44, 44, 24, 2.6) + mline(21, 47, 47, 27, 2.6)
    + figureFill({ head: P(13, 35.5), shoulder: P(15.5, 40), elbow: P(20, 38), hand: P(25, 36), hip: P(20, 44), knee: P(30, 36), foot: P(40, 28),
        far: { knee: P(30, 37.5), foot: P(40, 29.5), elbow: P(20, 38.5), hand: P(25, 36.5) } }, d)
    + muscleGlow(28, 39, 3, 2.4, -38, d)
    + anim(mrect(40, 18, 9, 4, 1.5) + plate(45, 14.5, 3, d) + plate(45, 25.5, 3, d))
  ),

  'beinbeuger': (d) => mkIcon(d,
    ground(d, 28, d ? 20 : 18)
    + crect(10, 36, 30, 4, 2) + mrect(13, 39.6, 2.6, 7) + mrect(35, 39.6, 2.6, 7)
    + figureFill({ head: P(13, 33), shoulder: P(17, 34.5), elbow: P(21, 33), hand: P(25, 32), hip: P(36, 35.5), knee: P(43, 35.5), foot: P(43, 44),
        far: { knee: P(43, 36.5), foot: P(43.5, 44.5), elbow: P(21, 33.5), hand: P(25, 32.5) } }, d)
    + muscleGlow(42, 39, 2.2, 2.6, 0, d)
    + anim(`<g>` + mrect(41, 43, 4, 2.4, 1.2) + `</g>`)
  ),

  'wadenheben': (d) => mkIcon(d,
    ground(d, 30, d ? 15 : 13)
    + mrect(22, 50, 16, 3, 1.4)
    + figureFill(standJoints({ foot: P(28, 49.5), knee: P(30, 43), far: { knee: P(32, 43), foot: P(33, 49.5), elbow: P(31.2, 27.5), hand: P(31.2, 35.5) }, elbow: P(28.8, 27.5), hand: P(28.8, 35.5) }), d)
    + muscleGlow(30.5, 45.5, 1.9, 2.4, 0, d)
    + anim(dumbbell(25.5, 36, d, 1.7) + dumbbell(34.5, 36, d, 1.7))
  ),

  'hip-thrust': (d) => mkIcon(d,
    ground(d, 30, d ? 20 : 18)
    + crect(40, 33, 14, 4, 2) + mrect(44, 36.6, 2.6, 7)
    + figureFill({ head: P(48, 33), shoulder: P(44, 35), elbow: P(41, 39), hand: P(38, 42), hip: P(28, 36), knee: P(20, 38), foot: P(14, 44),
        far: { knee: P(20, 39.5), foot: P(14, 45.5), elbow: P(41, 39.5), hand: P(38, 42.5) } }, d)
    + muscleGlow(31, 35.5, 3, 2.4, -10, d)
    + anim(mline(20, 31, 38, 31, 2.4) + plate(20, 31, 4.4, d) + plate(38, 31, 4.4, d))
  ),

  'ausfallschritte': (d) => mkIcon(d,
    ground(d, 30, d ? 19 : 17)
    + figureFill({ head: P(31, 13), shoulder: P(31, 20), elbow: P(28, 28), hand: P(28, 35), hip: P(31, 35), knee: P(22, 44), foot: P(18, 54),
        far: { knee: P(40, 42), foot: P(43, 54), elbow: P(34, 28), hand: P(34, 35) } }, d)
    + muscleGlow(26, 39, 2.4, 2.8, 28, d)
    + anim(dumbbell(27.5, 36.5, d, 1.7) + dumbbell(34.5, 36.5, d, 1.7))
  ),

  // --- Resistance-Band ---
  'band-curl': (d) => mkIcon(d,
    ground(d, 30, d ? 15 : 13)
    + figureFill(standJoints({ elbow: P(27, 28), hand: P(30, 24), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(33, 28), hand: P(30.5, 24) } }), d)
    + muscleGlow(27.8, 26.5, 2.2, 2.6, 18, d)
    + anim(band(28.5, 54, 30, 24, 26, 40) + band(31.5, 54, 30.6, 24, 35, 40))
  ),

  'band-press': (d) => mkIcon(d,
    ground(d, 30, d ? 15 : 13)
    + figureFill(standJoints({ elbow: P(27, 25), hand: P(30, 19.5), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(33, 25), hand: P(30.6, 19.5) } }), d)
    + muscleGlow(30, 20.5, 3, 2.2, 0, d)
    + anim(band(27, 44, 29.5, 19.5, 25, 32) + band(33, 44, 30.5, 19.5, 35, 32))
  ),

  'band-row': (d) => mkIcon(d,
    ground(d, 28, d ? 17 : 15)
    + mrect(50, 18, 2.6, 30)
    + figureFill(standJoints({ shoulder: P(28, 19.5), elbow: P(31, 27), hand: P(35, 31), far: { knee: P(30, 46.5), foot: P(31.5, 54.5), elbow: P(31, 27.5), hand: P(35, 31.5) }, knee: P(28.5, 46.5), foot: P(26, 54.5) }), d)
    + muscleGlow(27, 27, 2.4, 2.8, -6, d)
    + anim(band(35, 31, 50, 24, 43, 26) + `<circle cx="35" cy="31" r="1.5" fill="url(#ic-metal)"/>`)
  ),

  'band-squat': (d) => mkIcon(d,
    ground(d, 30, d ? 18 : 16)
    + figureFill({ head: P(31, 18), shoulder: P(31, 24), elbow: P(29, 30), hand: P(29, 35), hip: P(31, 38), knee: P(24, 41), foot: P(24, 54),
        far: { knee: P(38, 41), foot: P(38, 54), elbow: P(33, 30), hand: P(33, 35) } }, d)
    + muscleGlow(26, 40, 2.6, 2.4, 0, d)
    + anim(band(24, 54, 29, 35, 25, 44) + band(38, 54, 33, 35, 37, 44))
  ),

  'band-pull-apart': (d) => mkIcon(d,
    ground(d, 30, d ? 16 : 14)
    + figureFill(standJoints({ shoulder: P(30, 20), elbow: P(25, 24), hand: P(19, 26), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(35, 24), hand: P(41, 26) } }), d)
    + muscleGlow(30, 21, 3.2, 2, 0, d)
    + anim(band(19, 26, 41, 26, 30, 22))
  ),

  // --- Standard ---
  'dumbbell': (d) => mkIcon(d,
    ground(d, 30, d ? 15 : 13)
    + figureFill(standJoints({ elbow: P(27.5, 28), hand: P(30, 24.5), far: { knee: P(32, 46.5), foot: P(33.5, 54.5), elbow: P(32.5, 28), hand: P(30.6, 24.5) } }), d)
    + anim(dumbbell(30, 23.5, d, 2))
  ),
};

// Klimmzug-Varianten (Stange oben, hängende Figur, Griffbreite/-art variiert).
function klimmzug(d, grip) {
  const wide = grip === 'breit' ? 6 : grip === 'neutral' ? 3 : 2.4;
  return mkIcon(d,
    ground(d, 31, d ? 14 : 12)
    + mline2(10, 13, 52, 13, 2.6) + mrect(11, 9, 2.4, 4.5) + mrect(48.6, 9, 2.4, 4.5)
    + figureFill({ head: P(31, 21.5), shoulder: P(31, 27), elbow: P(31 - wide + 1.5, 21), hand: P(31 - wide, 14.5), hip: P(31, 41), knee: P(31, 50), foot: P(30, 56),
        far: { knee: P(32, 50), foot: P(33, 56), elbow: P(31 + wide - 1.5, 21), hand: P(31 + wide, 14.5) } }, d)
    + `<circle cx="${31 - wide}" cy="14.5" r="1.5" fill="url(#ic-skin)"/><circle cx="${31 + wide}" cy="14.5" r="1.5" fill="url(#ic-skin)"/>`
    + muscleGlow(31, 30, 3.4, 2.6, 0, d)
    + (grip === 'unter' && d ? `<path d="M${31 - wide} 15 q1 1.5 2.6 0" class="ic-line" stroke-width="0.6" fill="none" opacity="0.5"/>` : '')
    + anim('')
  );
}
function mline2(x1, y1, x2, y2, w) { return mline(x1, y1, x2, y2, w); }

// ---------- Liste für den Picker ----------
const AVAILABLE_ICONS = [
  { id: 'dumbbell',          label: 'Figur (Standard)' },
  { id: 'leg-extension',     label: 'Leg Extension' },
  { id: 'leg-press',         label: 'Leg Press' },
  { id: 'beinbeuger',        label: 'Beinbeuger' },
  { id: 'wadenheben',        label: 'Wadenheben' },
  { id: 'hip-thrust',        label: 'Hip Thrust' },
  { id: 'bankdruecken',      label: 'Bankdrücken' },
  { id: 'ueberzug',          label: 'Überzug / Pullover' },
  { id: 'liegestuetze',      label: 'Liegestütze' },
  { id: 'schulterdruecken',  label: 'Schulterdrücken' },
  { id: 'seitheben',         label: 'Seitheben' },
  { id: 'bauchpresse',       label: 'Bauchpresse' },
  { id: 'crunches',          label: 'Crunches' },
  { id: 'lat-pulldown',      label: 'Lat Pulldown' },
  { id: 'rudern-maschine',   label: 'Rudern' },
  { id: 'shrugs',            label: 'Shrugs' },
  { id: 'sz-curls',          label: 'SZ-Curls' },
  { id: 'ausfallschritte',   label: 'Ausfallschritte' },
  { id: 'klimmzug-breit',      label: 'Klimmzug breit',        band: true },
  { id: 'klimmzug-neutral',    label: 'Klimmzug parallel',     band: true },
  { id: 'klimmzug-untergriff', label: 'Klimmzug Untergriff',   band: true },
  { id: 'band-curl',           label: 'Band Curl',             band: true },
  { id: 'band-press',          label: 'Band Drücken',          band: true },
  { id: 'band-row',            label: 'Band Rudern',           band: true },
  { id: 'band-squat',          label: 'Band Kniebeuge',        band: true },
  { id: 'band-pull-apart',     label: 'Band Auseinanderziehen', band: true },
];

// Bandfarben (Active Vikings). „schwarz" wird hell gerendert. Werte spiegeln sich in style.css.
const BAND_COLORS = [
  { id: 'gruen',   label: 'Grün',    css: '#34c759' },
  { id: 'lila',    label: 'Lila',    css: '#bf5af2' },
  { id: 'blau',    label: 'Blau',    css: '#0a84ff' },
  { id: 'schwarz', label: 'Schwarz', css: '#c7c7cc' },
  { id: 'rot',     label: 'Rot',     css: '#ff453a' },
];

// Geräte-Icon bevorzugt, sonst die anatomische Figur (Fallback / unbekannte iconIds).
function anatomyFallback(iconId, detailed) {
  const muscle = (typeof ICON_MUSCLE !== 'undefined' && ICON_MUSCLE[iconId]) ? ICON_MUSCLE[iconId] : null;
  const view = muscle ? (MUSCLE_VIEW[muscle] || 'front') : 'front';
  const vb = view === 'back' ? '724 0 724 1448' : '0 0 724 1448';
  const fig = detailed ? `#fig-${view}` : `#fig-${view}-o`;
  const hl = muscle ? `<use class="ico-hl" href="#hm-${muscle}"/>` : '';
  return `<svg viewBox="${vb}" class="anatomy-icon" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><use href="${fig}"/>${hl}</svg>`;
}
function iconSvgFor(iconId, detailed) {
  const b = GERAETE_BUILDERS[iconId];
  return b ? b(detailed) : anatomyFallback(iconId, detailed);
}

// Vorgebaute schlanke Icons je iconId — für Liste & Picker.
const EXERCISE_ICONS = {};
for (const o of AVAILABLE_ICONS) EXERCISE_ICONS[o.id] = iconSvgFor(o.id, false);
if (!EXERCISE_ICONS['dumbbell']) EXERCISE_ICONS['dumbbell'] = iconSvgFor('dumbbell', false);

function iconIsBandCapable(iconId) {
  const opt = AVAILABLE_ICONS.find(o => o.id === iconId);
  return !!(opt && opt.band);
}

function iconIdFor(exercise) {
  if (exercise.iconId && EXERCISE_ICONS[exercise.iconId]) return exercise.iconId;
  if (EXERCISE_ICONS[exercise.id]) return exercise.id;
  return 'dumbbell';
}

function iconHTML(exercise, sizeClass) {
  const id = iconIdFor(exercise);
  // Detail-Fenster: volle Detailstufe; Liste/Picker: schlanke Fassung.
  const svg = (sizeClass === 'svg-icon-large') ? iconSvgFor(id, true) : (EXERCISE_ICONS[id] || iconSvgFor(id, false));
  // Bandfarbe nur anhängen, wenn gesetzt UND das Icon band-fähig ist.
  const band = (exercise.bandColor && iconIsBandCapable(id)) ? ` data-band="${exercise.bandColor}"` : '';
  return `<div class="${sizeClass}" data-icon-id="${id}"${band}>${svg}</div>`;
}
