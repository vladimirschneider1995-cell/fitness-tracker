'use strict';

// Anatomische Übungs-Icons: Mini-Version der Körpermodell-Figur mit coral hervorgehobenem
// Zielmuskel. Die Figur ist EINMAL als unsichtbares Sprite (#fig-*/#hm-*) in index.html
// definiert; hier nur Referenzen via <use> (DOM-leicht). Gleiche Bildsprache wie body-map.js.
//  - Liste/Picker: schlanke Outline-Figur (#fig-<view>-o) + Zielmuskel
//  - Detail-Fenster: volle Figur (#fig-<view>) + Zielmuskel, der pulsiert (CSS)

// Muskel → Körperseite (front/back). Quelle: MUSCLE_REGIONS (body-map.js).
const MUSCLE_VIEW = Object.fromEntries(MUSCLE_REGIONS.map(m => [m.id, m.view]));

function anatomyIcon(iconId, detailed) {
  const muscle = (typeof ICON_MUSCLE !== 'undefined' && ICON_MUSCLE[iconId]) ? ICON_MUSCLE[iconId] : null;
  const view = muscle ? (MUSCLE_VIEW[muscle] || 'front') : 'front';
  const vb = view === 'back' ? '724 0 724 1448' : '0 0 724 1448';
  const fig = detailed ? `#fig-${view}` : `#fig-${view}-o`;
  const hl = muscle
    ? `<use class="ico-hl" href="#hm-${muscle}"/>`
    : '';
  return `<svg viewBox="${vb}" class="anatomy-icon" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><use href="${fig}"/>${hl}</svg>`;
}

// Liste für den Picker im Settings-Form (Label = Übungstyp, Icon zeigt den Zielmuskel)
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

// Vorgebaute schlanke Icons je iconId — für Liste & Picker.
const EXERCISE_ICONS = {};
for (const o of AVAILABLE_ICONS) EXERCISE_ICONS[o.id] = anatomyIcon(o.id, false);
if (!EXERCISE_ICONS['dumbbell']) EXERCISE_ICONS['dumbbell'] = anatomyIcon('dumbbell', false);

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
  // Detail-Fenster: volle Figur (mit Puls); Liste/Picker: schlanke Outline-Figur.
  const svg = (sizeClass === 'svg-icon-large') ? anatomyIcon(id, true) : (EXERCISE_ICONS[id] || anatomyIcon(id, false));
  // Bandfarbe nur anhängen, wenn gesetzt UND das Icon band-fähig ist.
  const band = (exercise.bandColor && iconIsBandCapable(id)) ? ` data-band="${exercise.bandColor}"` : '';
  return `<div class="${sizeClass}" data-icon-id="${id}"${band}>${svg}</div>`;
}
