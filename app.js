'use strict';

const STORAGE_EXERCISES = 'fitness_exercises';
const STORAGE_LOGS = 'fitness_logs';

const SEED_EXERCISES = [
  { id: 'leg-extension',   name: 'Leg Extension',         group: 'lower', category: 'Beine' },
  { id: 'leg-press',       name: 'Leg Press',             group: 'lower', category: 'Beine' },
  { id: 'beinbeuger',      name: 'Beinbeuger (liegend)',  group: 'lower', category: 'Beine' },
  { id: 'wadenheben',      name: 'Wadenheben',            group: 'lower', category: 'Beine' },
  { id: 'hip-thrust',      name: 'Hip Thrust',            group: 'lower', category: 'Beine' },

  { id: 'schulterdruecken', name: 'Schulterdrücken (Maschine)', group: 'upper', category: 'Schultern' },
  { id: 'seitheben',        name: 'Seitheben',                  group: 'upper', category: 'Schultern' },

  { id: 'bauchpresse',     name: 'Bauchpresse',           group: 'upper', category: 'Bauch' },
  { id: 'crunches',        name: 'Crunches (Maschine)',   group: 'upper', category: 'Bauch' },

  { id: 'lat-pulldown',    name: 'Lat Pulldown',          group: 'upper', category: 'Rücken' },
  { id: 'rudern-maschine', name: 'Rudern (Maschine)',     group: 'upper', category: 'Rücken' },

  { id: 'shrugs',          name: 'Shrugs / Nackenheben',  group: 'upper', category: 'Nacken' },
];

const GROUP_LABEL = { upper: 'Oberkörper', lower: 'Unterkörper' };

// ---------- Storage ----------

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Konnte ${key} nicht lesen:`, e);
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getExercises() {
  return loadJSON(STORAGE_EXERCISES, []);
}

function getLogs() {
  return loadJSON(STORAGE_LOGS, []);
}

function seedIfEmpty() {
  if (getExercises().length === 0) {
    saveJSON(STORAGE_EXERCISES, SEED_EXERCISES);
  }
}

function addExercise(name, group, category, iconId, bandColor) {
  const exercises = getExercises();
  const id = slugify(name) + '-' + Date.now().toString(36);
  const resolvedIcon = iconId && EXERCISE_ICONS[iconId] ? iconId : 'dumbbell';
  exercises.push({
    id,
    name: name.trim(),
    group,
    category: category.trim(),
    iconId: resolvedIcon,
    // Bandfarbe nur speichern, wenn das Icon band-fähig ist und eine Farbe gewählt wurde.
    bandColor: (bandColor && iconIsBandCapable(resolvedIcon)) ? bandColor : null,
  });
  saveJSON(STORAGE_EXERCISES, exercises);
  return id;
}

// Migration: bestehende Übungen kriegen iconId nachträglich (falls fehlt).
function migrateIconIds() {
  const exercises = getExercises();
  let changed = false;
  for (const ex of exercises) {
    if (!ex.iconId) {
      ex.iconId = EXERCISE_ICONS[ex.id] ? ex.id : 'dumbbell';
      changed = true;
    }
  }
  if (changed) saveJSON(STORAGE_EXERCISES, exercises);
}

function renameExercise(id, newName) {
  const exercises = getExercises();
  const ex = exercises.find(e => e.id === id);
  if (!ex) return;
  ex.name = newName.trim();
  saveJSON(STORAGE_EXERCISES, exercises);
}

function deleteExercise(id) {
  const exercises = getExercises().filter(e => e.id !== id);
  saveJSON(STORAGE_EXERCISES, exercises);
  const logs = getLogs().filter(l => l.exerciseId !== id);
  saveJSON(STORAGE_LOGS, logs);
}

function addLog(exerciseId, weight) {
  const logs = getLogs();
  logs.push({
    id: 'l-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
    exerciseId,
    weight: Number(weight),
    ts: new Date().toISOString(),
  });
  saveJSON(STORAGE_LOGS, logs);
}

function latestLog(exerciseId) {
  const logs = getLogs().filter(l => l.exerciseId === exerciseId);
  if (logs.length === 0) return null;
  logs.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return logs[0];
}

function historyFor(exerciseId, limit = 5) {
  const logs = getLogs().filter(l => l.exerciseId === exerciseId);
  logs.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return logs.slice(0, limit);
}

// ---------- Helpers ----------

function slugify(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 32) || 'ex';
}

function fmtWeight(n) {
  if (n === null || n === undefined) return '—';
  const s = Number(n).toFixed(2).replace(/\.?0+$/, '');
  return s;
}

function fmtDate(isoString) {
  const d = new Date(isoString);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (isToday) return `Heute ${time}`;
  if (isYesterday) return `Gestern ${time}`;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ` ${time}`;
}

function groupBy(arr, keyFn) {
  const map = new Map();
  for (const item of arr) {
    const k = keyFn(item);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(item);
  }
  return map;
}

// ---------- Render: Home ----------

let homeIntroDone = false;

function renderHome() {
  const exercises = getExercises();
  let introIndex = 0;
  for (const group of ['upper', 'lower']) {
    const container = document.querySelector(`[data-categories="${group}"]`);
    container.innerHTML = '';
    const inGroup = exercises.filter(e => e.group === group);
    if (inGroup.length === 0) {
      container.innerHTML = `<p class="empty-state">Keine Übungen — über Einstellungen hinzufügen.</p>`;
      continue;
    }
    const byCat = groupBy(inGroup, e => e.category);
    const sortedCats = Array.from(byCat.keys()).sort((a, b) => a.localeCompare(b, 'de'));
    for (const cat of sortedCats) {
      const catEl = document.createElement('div');
      catEl.className = 'category';
      catEl.innerHTML = `<h3 class="category-title">${escapeHTML(cat)}</h3>`;
      const ul = document.createElement('ul');
      ul.className = 'exercise-list';
      for (const ex of byCat.get(cat)) {
        const latest = latestLog(ex.id);
        const weightHtml = latest
          ? `<span class="exercise-weight">${fmtWeight(latest.weight)} kg</span>`
          : `<span class="exercise-weight empty">—</span>`;
        const li = document.createElement('li');
        li.className = 'exercise-row';
        if (latest) li.classList.add('has-weight');
        if (!homeIntroDone) {
          li.classList.add('row-in');
          li.style.animationDelay = (introIndex++ * 0.04) + 's';
        }
        li.dataset.id = ex.id;
        li.innerHTML = `
          ${iconHTML(ex, 'svg-icon')}
          <span class="exercise-name">${escapeHTML(ex.name)}</span>
          ${weightHtml}
          <span class="exercise-chevron">›</span>
        `;
        li.addEventListener('click', () => openExercise(ex.id));
        ul.appendChild(li);
      }
      catEl.appendChild(ul);
      container.appendChild(catEl);
    }
  }
  homeIntroDone = true;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---------- Modal: Exercise Detail ----------

let currentExerciseId = null;

function openExercise(id) {
  const ex = getExercises().find(e => e.id === id);
  if (!ex) return;
  currentExerciseId = id;
  document.getElementById('modal-title').textContent = ex.name;
  document.getElementById('modal-icon-slot').innerHTML = iconHTML(ex, 'svg-icon-large');
  showModal('modal-exercise');
  renderExerciseDetail(); // nach showModal: Sparkline kann die echte Breite messen
  // Pre-fill input with latest weight for easy re-entry
  const latest = latestLog(id);
  const input = document.getElementById('input-weight');
  input.value = latest ? latest.weight : '';
  setTimeout(() => input.focus(), 100);
}

function renderExerciseDetail(opts = {}) {
  const latest = latestLog(currentExerciseId);
  document.getElementById('weight-current').textContent = latest ? fmtWeight(latest.weight) : '—';
  renderSparkline();

  const history = historyFor(currentExerciseId, 5);
  const ul = document.getElementById('history-list');
  ul.innerHTML = '';
  if (history.length === 0) {
    const li = document.createElement('li');
    li.className = 'history-empty-row';
    li.textContent = 'Noch keine Einträge';
    li.style.justifyContent = 'center';
    li.style.color = 'var(--text-dim)';
    ul.appendChild(li);
    return;
  }
  history.forEach((log, idx) => {
    const li = document.createElement('li');
    if (opts.flashNewest && idx === 0) li.classList.add('new');
    li.innerHTML = `
      <span class="h-date">${fmtDate(log.ts)}</span>
      <span class="h-weight">${fmtWeight(log.weight)} kg</span>
    `;
    ul.appendChild(li);
  });
}

function flashWeightDisplay() {
  const el = document.getElementById('weight-current');
  el.classList.remove('weight-flash');
  // force reflow so re-adding the class restarts the animation
  void el.offsetWidth;
  el.classList.add('weight-flash');
}

document.getElementById('form-weight').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('input-weight');
  const weight = parseFloat(input.value);
  if (isNaN(weight) || weight < 0) return;
  addLog(currentExerciseId, weight);
  renderExerciseDetail({ flashNewest: true });
  flashWeightDisplay();
  renderHome();
  // Subtle confirmation: blur to dismiss keyboard
  input.blur();
});

// ---------- Modal: Settings ----------

function openSettings() {
  renderSettings();
  renderBandPicker();
  renderIconPicker();
  renderThemeToggle();
  showModal('modal-settings');
}

function renderIconPicker() {
  const grid = document.getElementById('icon-picker-grid');
  const hidden = document.getElementById('new-ex-icon');
  const bandHidden = document.getElementById('new-ex-band');
  const current = hidden.value || 'dumbbell';
  grid.innerHTML = '';
  for (const opt of AVAILABLE_ICONS) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'icon-picker-cell' + (opt.id === current ? ' selected' : '');
    cell.dataset.iconId = opt.id;
    cell.setAttribute('aria-label', opt.label);
    cell.title = opt.label;
    // Live-Vorschau der Bandfarbe nur am aktuell gewählten band-fähigen Icon.
    const showBand = opt.band && opt.id === current && bandHidden.value;
    const band = showBand ? ` data-band="${bandHidden.value}"` : '';
    cell.innerHTML = `<div class="svg-icon" data-icon-id="${opt.id}"${band}>${EXERCISE_ICONS[opt.id]}</div>`;
    cell.addEventListener('click', () => {
      hidden.value = opt.id;
      grid.querySelectorAll('.icon-picker-cell.selected').forEach(el => el.classList.remove('selected'));
      cell.classList.add('selected');
      updateBandPickerVisibility(opt.id);
    });
    grid.appendChild(cell);
  }
  updateBandPickerVisibility(current);
}

// Band-Farb-Picker: „Kein Band" + 5 Farb-Swatches (nur sichtbar bei band-fähigem Icon).

function renderBandPicker() {
  const wrap = document.getElementById('band-swatches');
  const bandHidden = document.getElementById('new-ex-band');
  wrap.innerHTML = '';

  const none = document.createElement('button');
  none.type = 'button';
  none.className = 'band-swatch none' + (bandHidden.value ? '' : ' selected');
  none.dataset.band = '';
  none.setAttribute('aria-label', 'Kein Band');
  none.title = 'Kein Band';
  none.addEventListener('click', () => selectBand(''));
  wrap.appendChild(none);

  for (const c of BAND_COLORS) {
    const sw = document.createElement('button');
    sw.type = 'button';
    sw.className = 'band-swatch' + (bandHidden.value === c.id ? ' selected' : '');
    sw.dataset.band = c.id;
    sw.style.background = c.css;
    sw.setAttribute('aria-label', c.label);
    sw.title = c.label;
    sw.addEventListener('click', () => selectBand(c.id));
    wrap.appendChild(sw);
  }
}

function selectBand(bandId) {
  document.getElementById('new-ex-band').value = bandId;
  syncBandSwatchSelection(bandId);
  // Live-Vorschau: ausgewähltes Icon im Raster nimmt die Bandfarbe an.
  renderIconPicker();
}

function syncBandSwatchSelection(bandId) {
  document.querySelectorAll('#band-swatches .band-swatch').forEach(el => {
    el.classList.toggle('selected', (el.dataset.band || '') === bandId);
  });
}

function updateBandPickerVisibility(iconId) {
  const picker = document.getElementById('band-picker');
  if (iconIsBandCapable(iconId)) {
    picker.classList.remove('hidden');
  } else {
    picker.classList.add('hidden');
    document.getElementById('new-ex-band').value = '';
    syncBandSwatchSelection('');
  }
}

function renderSettings() {
  const exercises = getExercises();
  const ul = document.getElementById('settings-exercise-list');
  ul.innerHTML = '';
  if (exercises.length === 0) {
    ul.innerHTML = `<li><span class="s-info"><span class="s-name">Keine Übungen</span></span></li>`;
    return;
  }
  const sorted = [...exercises].sort((a, b) => {
    if (a.group !== b.group) return a.group === 'upper' ? -1 : 1;
    if (a.category !== b.category) return a.category.localeCompare(b.category, 'de');
    return a.name.localeCompare(b.name, 'de');
  });
  for (const ex of sorted) {
    const li = document.createElement('li');
    li.innerHTML = `
      ${iconHTML(ex, 'svg-icon')}
      <div class="s-info">
        <div class="s-name">${escapeHTML(ex.name)}</div>
        <div class="s-meta">${GROUP_LABEL[ex.group]} · ${escapeHTML(ex.category)}</div>
      </div>
      <div class="s-actions">
        <button class="btn-icon-sm" data-action="rename" data-id="${ex.id}" aria-label="Umbenennen">✎</button>
        <button class="btn-icon-sm danger" data-action="delete" data-id="${ex.id}" aria-label="Löschen">🗑</button>
      </div>
    `;
    ul.appendChild(li);
  }
}

document.getElementById('settings-exercise-list').addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const ex = getExercises().find(x => x.id === id);
  if (!ex) return;
  if (action === 'rename') {
    const newName = prompt('Neuer Name:', ex.name);
    if (newName && newName.trim()) {
      renameExercise(id, newName);
      renderSettings();
      renderHome();
    }
  } else if (action === 'delete') {
    if (confirm(`"${ex.name}" wirklich löschen?\nAlle gespeicherten Gewichte gehen verloren.`)) {
      deleteExercise(id);
      renderSettings();
      renderHome();
    }
  }
});

document.getElementById('form-new-exercise').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('new-ex-name').value.trim();
  const group = document.getElementById('new-ex-group').value;
  const category = document.getElementById('new-ex-category').value.trim();
  const iconId = document.getElementById('new-ex-icon').value || 'dumbbell';
  const bandColor = document.getElementById('new-ex-band').value;
  if (!name || !category) return;
  addExercise(name, group, category, iconId, bandColor);
  document.getElementById('new-ex-name').value = '';
  document.getElementById('new-ex-category').value = '';
  document.getElementById('new-ex-icon').value = 'dumbbell';
  document.getElementById('new-ex-band').value = '';
  renderSettings();
  renderBandPicker();
  renderIconPicker();
  renderHome();
});

document.getElementById('btn-export').addEventListener('click', () => {
  const data = {
    exportedAt: new Date().toISOString(),
    exercises: getExercises(),
    logs: getLogs(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `fitness-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ---------- Modal Helpers ----------

function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function hideModal(id) {
  document.getElementById(id).classList.add('hidden');
}

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    if (modal) modal.classList.add('hidden');
  });
});

document.getElementById('btn-settings').addEventListener('click', openSettings);

// ---------- Theme (Hell / Dunkel / Automatisch) ----------

const STORAGE_THEME = 'fitness_theme';

function getTheme() {
  return localStorage.getItem(STORAGE_THEME) || 'auto';
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') {
    root.setAttribute('data-theme', theme);
  } else {
    root.removeAttribute('data-theme'); // 'auto' → folgt dem System (CSS @media)
  }
  updateThemeColorMeta();
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_THEME, theme);
  applyTheme(theme);
  renderThemeToggle();
}

// Statusleisten-Farbe an den tatsächlich gerenderten Hintergrund angleichen
function updateThemeColorMeta() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && bg) meta.setAttribute('content', bg);
}

function renderThemeToggle() {
  const current = getTheme();
  document.querySelectorAll('#theme-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeChoice === current);
  });
}

document.getElementById('theme-toggle').addEventListener('click', e => {
  const btn = e.target.closest('button[data-theme-choice]');
  if (!btn) return;
  setTheme(btn.dataset.themeChoice);
});

// Bei Systemwechsel im Auto-Modus die Statusleiste nachziehen
window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
  if (getTheme() === 'auto') updateThemeColorMeta();
});

// ---------- Verlaufs-Kurve (Sparkline) ----------

function renderSparkline() {
  const slot = document.getElementById('spark-slot');
  const logs = getLogs()
    .filter(l => l.exerciseId === currentExerciseId)
    .sort((a, b) => (a.ts < b.ts ? -1 : 1)); // chronologisch alt → neu
  const recent = logs.slice(-12);
  if (recent.length < 2) { slot.innerHTML = ''; return; }

  const weights = recent.map(l => l.weight);
  const min = Math.min(...weights), max = Math.max(...weights);
  const range = max - min || 1;
  const W = Math.max(slot.clientWidth || 300, 200);
  const H = 56, pad = 8;
  const n = weights.length;
  const xi = i => (i / (n - 1)) * W;
  const yi = w => H - pad - ((w - min) / range) * (H - 2 * pad);
  const pts = weights.map((w, i) => [xi(i), yi(w)]);
  const linePts = pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const areaD = `M ${pts[0][0].toFixed(1)},${H} ` +
    pts.map(p => `L ${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L ${pts[n - 1][0].toFixed(1)},${H} Z`;
  const last = pts[n - 1];
  const delta = weights[n - 1] - weights[0];
  const arrow = delta > 0 ? '↑ +' : (delta < 0 ? '↓ −' : '± ');
  const deltaTxt = arrow + fmtWeight(Math.abs(delta)) + ' kg';

  slot.innerHTML = `
    <div class="spark">
      <div class="spark-head">
        <span class="spark-title">Verlauf · letzte ${n}</span>
        <span class="spark-delta ${delta > 0 ? 'up' : ''}">${deltaTxt}</span>
      </div>
      <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop class="spark-grad-top" offset="0"/>
            <stop class="spark-grad-bottom" offset="1"/>
          </linearGradient>
        </defs>
        <path class="spark-fill" fill="url(#spark-grad)" d="${areaD}"/>
        <polyline class="spark-line draw" points="${linePts}"/>
        <circle class="spark-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.5"/>
      </svg>
    </div>`;

  const line = slot.querySelector('.spark-line');
  if (line && line.getTotalLength) {
    line.style.setProperty('--spark-len', line.getTotalLength());
  }
}

// ---------- Service Worker ----------

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.warn('SW-Registrierung fehlgeschlagen:', err));
  });
}

// ---------- Init ----------

applyTheme(getTheme());
seedIfEmpty();
migrateIconIds();
renderHome();
