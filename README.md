# Fitness Tracker (PWA)

Minimaler Tracker für das zuletzt benutzte Gewicht pro Geräte-Übung. Vanilla HTML/CSS/JS, keine Build-Tools, läuft offline, installierbar als App auf iPhone-Homescreen.

## Lokal starten

```bash
cd ~/Projekte/fitness-tracker
python3 -m http.server 8080
```

Dann im Browser: <http://localhost:8080>

Service Worker funktioniert nur über `http://` oder `https://`, nicht über `file://` — also immer den Dev-Server nutzen.

## Daten

Alle Daten liegen in `localStorage` des Browsers. Zwei Keys:

- `fitness_exercises` — Liste der Übungen (Stammdaten)
- `fitness_logs` — jede Gewichts-Eingabe mit Zeitstempel

**Backup**: In den Einstellungen (Zahnrad) → "Backup exportieren" → JSON-Download.

**Achtung**: `localStorage` wird gelöscht, wenn du in Safari "Website-Daten" löschst oder die App vom Homescreen entfernst. Regelmäßig exportieren.

## Auf GitHub Pages deployen

Voraussetzung: GitHub-Account und installierte `gh` CLI (`brew install gh`).

```bash
cd ~/Projekte/fitness-tracker

git init
git add .
git commit -m "Initial fitness tracker"

gh auth login                              # einmalig, browser-basiert
gh repo create fitness-tracker --public --source=. --push

# Pages aktivieren (main branch, root):
gh api -X POST repos/:owner/fitness-tracker/pages \
  -f source[branch]=main -f source[path]=/
```

Nach ~1 min live unter `https://<username>.github.io/fitness-tracker/`.

## Auf iPhone installieren

1. Safari (nicht Chrome!) → Live-URL öffnen
2. Teilen-Button (Quadrat mit Pfeil)
3. "Zum Home-Bildschirm" → "Hinzufügen"
4. Icon erscheint, öffnet ohne Browser-Chrome

## Update-Flow

```bash
git add . && git commit -m "..." && git push
```

GitHub Pages re-deployed automatisch. Service Worker zieht beim nächsten App-Start die neue Version.

## Dateien

```
index.html           UI-Markup + iOS-Meta-Tags
style.css            Dark-Mode, mobile-first
app.js               Logik, localStorage, Render
manifest.json        PWA-Manifest
service-worker.js    Cache-first für Offline-Nutzung
icons/               Icon-SVG + PNG-Renderings (192/512/180)
```
