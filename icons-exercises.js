'use strict';

// Geräte-Icons im konsistenten Strichstil (viewBox 0 0 64 64, currentColor).
// Jede SVG hat .frame (statisch) und .anim-part (für Bewegungs-Animation).

const EXERCISE_ICONS = {

  'dumbbell': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="20" y1="32" x2="44" y2="32"/>
    </g>
    <g class="anim-part">
      <rect x="8" y="22" width="8" height="20" rx="2"/>
      <rect x="48" y="22" width="8" height="20" rx="2"/>
    </g>
  </svg>`,

  'leg-extension': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="12" y1="40" x2="12" y2="16"/>
      <line x1="12" y1="40" x2="32" y2="40"/>
      <line x1="14" y1="40" x2="14" y2="54"/>
      <line x1="30" y1="40" x2="30" y2="54"/>
      <line x1="8" y1="54" x2="36" y2="54"/>
    </g>
    <g class="anim-part">
      <line x1="32" y1="40" x2="52" y2="40"/>
      <line x1="52" y1="35" x2="52" y2="45"/>
    </g>
  </svg>`,

  'leg-press': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="8" y1="44" x2="8" y2="22"/>
      <line x1="8" y1="44" x2="22" y2="44"/>
      <line x1="22" y1="44" x2="54" y2="16"/>
      <line x1="6" y1="52" x2="28" y2="52"/>
    </g>
    <g class="anim-part">
      <rect x="44" y="8" width="14" height="14" rx="2"/>
    </g>
  </svg>`,

  'beinbeuger': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="6" y1="38" x2="50" y2="38"/>
      <line x1="12" y1="38" x2="12" y2="52"/>
      <line x1="44" y1="38" x2="44" y2="52"/>
      <line x1="6" y1="34" x2="14" y2="38"/>
      <line x1="56" y1="38" x2="56" y2="14"/>
    </g>
    <g class="anim-part">
      <line x1="56" y1="20" x2="44" y2="32"/>
      <circle cx="44" cy="32" r="3"/>
    </g>
  </svg>`,

  'wadenheben': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="32" y1="10" x2="32" y2="46"/>
      <line x1="20" y1="54" x2="44" y2="54"/>
      <line x1="22" y1="50" x2="42" y2="50"/>
    </g>
    <g class="anim-part">
      <rect x="22" y="12" width="20" height="6" rx="2"/>
    </g>
  </svg>`,

  'hip-thrust': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="10" y1="42" x2="40" y2="42"/>
      <line x1="14" y1="42" x2="14" y2="54"/>
      <line x1="36" y1="42" x2="36" y2="54"/>
      <circle cx="50" cy="50" r="6"/>
    </g>
    <g class="anim-part">
      <line x1="20" y1="34" x2="50" y2="34"/>
    </g>
  </svg>`,

  'schulterdruecken': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="14" y1="42" x2="14" y2="22"/>
      <line x1="14" y1="42" x2="34" y2="42"/>
      <line x1="14" y1="42" x2="14" y2="54"/>
      <line x1="34" y1="42" x2="34" y2="54"/>
      <line x1="10" y1="54" x2="38" y2="54"/>
    </g>
    <g class="anim-part">
      <line x1="22" y1="14" x2="42" y2="14"/>
      <line x1="22" y1="14" x2="22" y2="20"/>
      <line x1="42" y1="14" x2="42" y2="20"/>
    </g>
  </svg>`,

  'seitheben': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <circle cx="32" cy="14" r="4"/>
      <line x1="32" y1="20" x2="32" y2="44"/>
      <line x1="26" y1="50" x2="26" y2="56"/>
      <line x1="38" y1="50" x2="38" y2="56"/>
      <line x1="32" y1="44" x2="26" y2="50"/>
      <line x1="32" y1="44" x2="38" y2="50"/>
    </g>
    <g class="anim-part">
      <line x1="32" y1="26" x2="16" y2="32"/>
      <line x1="32" y1="26" x2="48" y2="32"/>
      <circle cx="14" cy="32" r="3"/>
      <circle cx="50" cy="32" r="3"/>
    </g>
  </svg>`,

  'bauchpresse': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="10" y1="44" x2="34" y2="44"/>
      <line x1="34" y1="44" x2="34" y2="22"/>
      <line x1="10" y1="44" x2="10" y2="54"/>
      <line x1="34" y1="44" x2="34" y2="54"/>
      <line x1="6" y1="54" x2="38" y2="54"/>
      <line x1="50" y1="14" x2="50" y2="40"/>
    </g>
    <g class="anim-part">
      <line x1="50" y1="24" x2="40" y2="28"/>
      <circle cx="40" cy="28" r="3"/>
    </g>
  </svg>`,

  'crunches': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="10" y1="44" x2="34" y2="44"/>
      <line x1="10" y1="44" x2="10" y2="24"/>
      <line x1="6" y1="28" x2="14" y2="28"/>
      <line x1="10" y1="44" x2="10" y2="54"/>
      <line x1="34" y1="44" x2="34" y2="54"/>
      <line x1="6" y1="54" x2="38" y2="54"/>
      <line x1="42" y1="40" x2="42" y2="50"/>
      <circle cx="42" cy="40" r="3"/>
    </g>
    <g class="anim-part">
      <line x1="8" y1="20" x2="22" y2="20"/>
      <line x1="22" y1="20" x2="22" y2="32"/>
    </g>
  </svg>`,

  'lat-pulldown': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="8" y1="8" x2="56" y2="8"/>
      <line x1="56" y1="8" x2="56" y2="56"/>
      <rect x="50" y="38" width="10" height="18" rx="1"/>
      <line x1="20" y1="46" x2="36" y2="46"/>
      <line x1="22" y1="46" x2="22" y2="54"/>
      <line x1="34" y1="46" x2="34" y2="54"/>
      <line x1="18" y1="40" x2="38" y2="40"/>
    </g>
    <g class="anim-part">
      <line x1="20" y1="10" x2="20" y2="20"/>
      <line x1="8" y1="22" x2="32" y2="22"/>
      <line x1="8" y1="22" x2="8" y2="26"/>
      <line x1="32" y1="22" x2="32" y2="26"/>
    </g>
  </svg>`,

  'rudern-maschine': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <line x1="10" y1="42" x2="32" y2="42"/>
      <line x1="12" y1="42" x2="12" y2="54"/>
      <line x1="30" y1="42" x2="30" y2="54"/>
      <line x1="6" y1="54" x2="34" y2="54"/>
      <line x1="32" y1="22" x2="32" y2="38"/>
    </g>
    <g class="anim-part">
      <line x1="40" y1="28" x2="56" y2="28"/>
      <line x1="56" y1="24" x2="56" y2="32"/>
    </g>
  </svg>`,

  'shrugs': `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="frame">
      <circle cx="32" cy="14" r="4"/>
      <line x1="32" y1="18" x2="32" y2="40"/>
      <line x1="20" y1="32" x2="20" y2="46"/>
      <line x1="44" y1="32" x2="44" y2="46"/>
      <rect x="14" y="44" width="12" height="6" rx="2"/>
      <rect x="38" y="44" width="12" height="6" rx="2"/>
    </g>
    <g class="anim-part">
      <line x1="20" y1="26" x2="44" y2="26"/>
    </g>
  </svg>`,
};

// Liste für den Picker im Settings-Form
const AVAILABLE_ICONS = [
  { id: 'dumbbell',          label: 'Hantel (Standard)' },
  { id: 'leg-extension',     label: 'Leg Extension' },
  { id: 'leg-press',         label: 'Leg Press' },
  { id: 'beinbeuger',        label: 'Beinbeuger' },
  { id: 'wadenheben',        label: 'Wadenheben' },
  { id: 'hip-thrust',        label: 'Hip Thrust' },
  { id: 'schulterdruecken',  label: 'Schulterdrücken' },
  { id: 'seitheben',         label: 'Seitheben' },
  { id: 'bauchpresse',       label: 'Bauchpresse' },
  { id: 'crunches',          label: 'Crunches' },
  { id: 'lat-pulldown',      label: 'Lat Pulldown' },
  { id: 'rudern-maschine',   label: 'Rudern' },
  { id: 'shrugs',            label: 'Shrugs' },
];

function iconIdFor(exercise) {
  if (exercise.iconId && EXERCISE_ICONS[exercise.iconId]) return exercise.iconId;
  if (EXERCISE_ICONS[exercise.id]) return exercise.id;
  return 'dumbbell';
}

function iconHTML(exercise, sizeClass) {
  const id = iconIdFor(exercise);
  return `<div class="${sizeClass}" data-icon-id="${id}">${EXERCISE_ICONS[id]}</div>`;
}
