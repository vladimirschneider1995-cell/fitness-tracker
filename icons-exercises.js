'use strict';

// Geräte-Icons im feinen Linien-Stil, ausgearbeitet (viewBox 0 0 64 64, Outline, currentColor).
// Maschinen mit Sitzen/Polstern/Gewichten, Figuren mit Körper-Umriss.
// Jede SVG hat .frame (statisch) und .anim-part (bewegt sich im Detail-Fenster).

const LINE = 'fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';

const EXERCISE_ICONS = {

  'dumbbell': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <line x1="25" y1="32" x2="39" y2="32"/>
      <line x1="27" y1="28" x2="27" y2="36"/>
      <line x1="37" y1="28" x2="37" y2="36"/>
    </g>
    <g class="anim-part">
      <rect x="19" y="19" width="6" height="26" rx="3"/>
      <rect x="13" y="23" width="5" height="18" rx="2.5"/>
      <rect x="7" y="26" width="4.5" height="12" rx="2.25"/>
      <rect x="39" y="19" width="6" height="26" rx="3"/>
      <rect x="46" y="23" width="5" height="18" rx="2.5"/>
      <rect x="52.5" y="26" width="4.5" height="12" rx="2.25"/>
    </g>
  </svg>`,

  'leg-extension': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="12" y="13" width="6" height="22" rx="2"/>
      <rect x="12" y="34" width="22" height="6" rx="2"/>
      <line x1="15" y1="40" x2="15" y2="52"/>
      <line x1="30" y1="40" x2="30" y2="52"/>
      <line x1="10" y1="52" x2="35" y2="52"/>
      <circle cx="32" cy="40" r="2"/>
    </g>
    <g class="anim-part">
      <line x1="32" y1="40" x2="50" y2="40"/>
      <rect x="48" y="35" width="8" height="10" rx="4"/>
    </g>
  </svg>`,

  'leg-press': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="7" y="34" width="6" height="14" rx="2"/>
      <rect x="7" y="44" width="16" height="7" rx="2"/>
      <line x1="6" y1="54" x2="26" y2="54"/>
      <line x1="22" y1="46" x2="48" y2="22"/>
      <line x1="26" y1="49" x2="52" y2="25"/>
    </g>
    <g class="anim-part">
      <rect x="44" y="9" width="7" height="17" rx="2"/>
      <circle cx="56" cy="17" r="5"/>
    </g>
  </svg>`,

  'beinbeuger': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="8" y="30" width="40" height="7" rx="3"/>
      <line x1="12" y1="37" x2="12" y2="50"/>
      <line x1="44" y1="37" x2="44" y2="50"/>
      <line x1="8" y1="50" x2="48" y2="50"/>
      <rect x="53" y="14" width="5" height="22" rx="2"/>
    </g>
    <g class="anim-part">
      <line x1="55" y1="20" x2="44" y2="30"/>
      <rect x="40" y="27" width="9" height="7" rx="3.5"/>
    </g>
  </svg>`,

  'wadenheben': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="29" y="17" width="6" height="29" rx="2"/>
      <rect x="22" y="46" width="20" height="5" rx="1"/>
      <line x1="18" y1="54" x2="46" y2="54"/>
      <line x1="22" y1="51" x2="22" y2="54"/>
      <line x1="42" y1="51" x2="42" y2="54"/>
    </g>
    <g class="anim-part">
      <rect x="20" y="11" width="24" height="7" rx="3.5"/>
      <line x1="26" y1="18" x2="26" y2="22"/>
      <line x1="38" y1="18" x2="38" y2="22"/>
    </g>
  </svg>`,

  'hip-thrust': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="8" y="40" width="32" height="6" rx="3"/>
      <line x1="13" y1="46" x2="13" y2="54"/>
      <line x1="35" y1="46" x2="35" y2="54"/>
    </g>
    <g class="anim-part">
      <line x1="17" y1="33" x2="47" y2="33"/>
      <circle cx="17" cy="33" r="7"/>
      <circle cx="47" cy="33" r="7"/>
    </g>
  </svg>`,

  'schulterdruecken': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="14" y="22" width="6" height="20" rx="2"/>
      <rect x="14" y="40" width="20" height="6" rx="2"/>
      <line x1="16" y1="46" x2="16" y2="54"/>
      <line x1="32" y1="46" x2="32" y2="54"/>
      <line x1="11" y1="54" x2="37" y2="54"/>
    </g>
    <g class="anim-part">
      <line x1="20" y1="14" x2="44" y2="14"/>
      <line x1="24" y1="14" x2="24" y2="20"/>
      <line x1="40" y1="14" x2="40" y2="20"/>
      <circle cx="20" cy="14" r="3"/>
      <circle cx="44" cy="14" r="3"/>
    </g>
  </svg>`,

  'seitheben': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <circle cx="32" cy="12" r="5"/>
      <path d="M26 20 Q32 17.5 38 20 Q37 29 36 38 Q32 40 28 38 Q27 29 26 20 Z"/>
      <path d="M29.5 39 Q27.5 47 26 54"/>
      <path d="M34.5 39 Q36.5 47 38 54"/>
    </g>
    <g class="anim-part">
      <path d="M27 22 Q19 23.5 13 29"/>
      <path d="M37 22 Q45 23.5 51 29"/>
      <line x1="9.5" y1="26" x2="9.5" y2="33"/>
      <line x1="16" y1="27" x2="16" y2="32"/>
      <line x1="9.5" y1="29.5" x2="16" y2="29.5"/>
      <line x1="54.5" y1="26" x2="54.5" y2="33"/>
      <line x1="48" y1="27" x2="48" y2="32"/>
      <line x1="48" y1="29.5" x2="54.5" y2="29.5"/>
    </g>
  </svg>`,

  'bauchpresse': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="10" y="42" width="22" height="6" rx="2"/>
      <rect x="30" y="24" width="5" height="20" rx="2"/>
      <line x1="12" y1="48" x2="12" y2="54"/>
      <line x1="30" y1="48" x2="30" y2="54"/>
      <line x1="8" y1="54" x2="36" y2="54"/>
      <rect x="48" y="14" width="5" height="28" rx="2"/>
    </g>
    <g class="anim-part">
      <line x1="50" y1="22" x2="40" y2="26"/>
      <rect x="33" y="22" width="9" height="9" rx="3"/>
    </g>
  </svg>`,

  'crunches': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="10" y="42" width="22" height="6" rx="2"/>
      <line x1="12" y1="48" x2="12" y2="54"/>
      <line x1="30" y1="48" x2="30" y2="54"/>
      <line x1="8" y1="54" x2="36" y2="54"/>
      <rect x="40" y="38" width="4" height="14" rx="2"/>
      <circle cx="42" cy="38" r="3"/>
    </g>
    <g class="anim-part">
      <rect x="8" y="19" width="16" height="6" rx="3"/>
      <line x1="10" y1="25" x2="10" y2="42"/>
    </g>
  </svg>`,

  'lat-pulldown': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <line x1="12" y1="9" x2="54" y2="9"/>
      <circle cx="14" cy="9" r="2.5"/>
      <line x1="54" y1="9" x2="54" y2="56"/>
      <rect x="48" y="34" width="12" height="22" rx="2"/>
      <line x1="48" y1="40" x2="60" y2="40"/>
      <line x1="48" y1="46" x2="60" y2="46"/>
      <line x1="18" y1="48" x2="34" y2="48"/>
      <line x1="20" y1="48" x2="20" y2="56"/>
      <line x1="32" y1="48" x2="32" y2="56"/>
      <line x1="22" y1="42" x2="30" y2="42"/>
      <line x1="26" y1="42" x2="26" y2="48"/>
    </g>
    <g class="anim-part">
      <line x1="14" y1="11" x2="14" y2="21"/>
      <line x1="8" y1="23" x2="32" y2="23"/>
      <line x1="8" y1="23" x2="8" y2="28"/>
      <line x1="32" y1="23" x2="32" y2="28"/>
      <line x1="14" y1="23" x2="14" y2="20"/>
      <line x1="26" y1="23" x2="26" y2="20"/>
    </g>
  </svg>`,

  'rudern-maschine': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <rect x="10" y="40" width="18" height="6" rx="2"/>
      <line x1="12" y1="46" x2="12" y2="54"/>
      <line x1="26" y1="46" x2="26" y2="54"/>
      <line x1="6" y1="54" x2="32" y2="54"/>
      <rect x="30" y="24" width="6" height="10" rx="2"/>
      <rect x="50" y="34" width="9" height="14" rx="2"/>
      <line x1="50" y1="40" x2="59" y2="40"/>
      <line x1="52" y1="16" x2="52" y2="34"/>
    </g>
    <g class="anim-part">
      <line x1="40" y1="30" x2="52" y2="30"/>
      <line x1="38" y1="25" x2="38" y2="35"/>
      <line x1="36" y1="30" x2="40" y2="30"/>
    </g>
  </svg>`,

  'shrugs': `<svg viewBox="0 0 64 64" ${LINE} aria-hidden="true">
    <g class="frame">
      <circle cx="32" cy="12" r="5"/>
      <path d="M26 20 Q32 17.5 38 20 Q37 28 36 36 Q32 38 28 36 Q27 28 26 20 Z"/>
      <path d="M27 23 Q24 33 23 45"/>
      <path d="M37 23 Q40 33 41 45"/>
      <path d="M29.5 37 Q28 46 27 54"/>
      <path d="M34.5 37 Q36 46 37 54"/>
    </g>
    <g class="anim-part">
      <line x1="18" y1="46" x2="46" y2="46"/>
      <circle cx="20" cy="46" r="4.5"/>
      <circle cx="44" cy="46" r="4.5"/>
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
