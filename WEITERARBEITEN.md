# Weiterarbeiten an der Fitness-App — für Vladimir

> Diese Datei ist deine Gedächtnisstütze. Wenn du in einem **neuen Claude-Chat** weitermachst,
> sag einfach: *"Lies ~/Projekte/fitness-tracker/WEITERARBEITEN.md"* — dann weiß Claude sofort,
> wo das Projekt steht.

---

## 1. Was ist diese App?

Ein simpler Tracker fürs Fitnessstudio: pro Gerät/Übung merkst du dir **das zuletzt benutzte Gewicht**.
Mehr nicht — bewusst minimal.

- **Live-Adresse (auf dem Handy):** https://vladimirschneider1995-cell.github.io/fitness-tracker/
- **Auf dem iPhone installiert:** ja, als Icon auf dem Homescreen (über Safari → Teilen → „Zum Home-Bildschirm")
- **Die Daten** (deine Gewichte) liegen **nur in deinem Handy-Browser**, nicht im Internet. Niemand sonst sieht sie.

---

## 2. Was ist GitHub? (in einfachen Worten)

Stell dir GitHub wie eine **Cloud für Programm-Code** vor — so wie Google Drive für Dokumente, nur für Apps.

Drei Dinge passieren da:

1. **Aufbewahrung:** Der gesamte Code deiner App liegt sicher bei GitHub (das nennt man ein *Repository* oder kurz *Repo*).
   Dein Repo: https://github.com/vladimirschneider1995-cell/fitness-tracker
2. **Veröffentlichung:** GitHub kann aus dem Code automatisch eine echte Webseite machen — das ist der „GitHub Pages"-Teil. Deshalb ist deine App unter der Live-Adresse oben erreichbar.
3. **Versionen:** Jede Änderung wird gespeichert (ein *Commit*). Man kann jederzeit zurück. Nichts geht verloren.

**Wichtige Begriffe, die du hören wirst:**

| Begriff | Bedeutet |
|---|---|
| Repository / Repo | Der Projekt-Ordner bei GitHub |
| Commit | Ein gespeicherter Schnappschuss einer Änderung |
| Push | Änderungen vom Mac zu GitHub hochladen |
| GitHub Pages | Der Dienst, der deine App als Webseite live stellt |
| Account | Dein Login: **vladimirschneider1995-cell** |

Du musst **nichts davon selbst tippen** — das macht Claude für dich. Du musst nur grob wissen, was passiert.

---

## 3. Wie ändere ich Design oder Funktionen?

**Ganz einfach: in einem neuen Claude-Chat in normalen Worten sagen, was du willst.** Beispiele:

- *„Mach die Knöpfe blau statt orange."*
- *„Die Schrift beim Gewicht soll größer sein."*
- *„Ich will eine neue Kategorie ‚Arme' mit den Übungen Bizeps-Curl und Trizeps."*
- *„Kann ich pro Übung auch die Wiederholungen eintragen?"*
- *„Das Icon für Lat Pulldown gefällt mir nicht, mach es anders."*

Claude hat **direkten Zugriff auf die App-Dateien** auf deinem Mac (sie liegen unter `~/Projekte/fitness-tracker/`).
Claude ändert sie, zeigt dir das Ergebnis in der Vorschau, und wenn es dir gefällt, lädt Claude es zu GitHub hoch.

**Der Ablauf, den du in jedem neuen Chat nutzt:**

1. Neuen Chat öffnen
2. Sagen: *„Lies ~/Projekte/fitness-tracker/WEITERARBEITEN.md, ich will an meiner Fitness-App weiterarbeiten."*
3. Beschreiben, was du ändern willst
4. Claude ändert + zeigt Vorschau
5. Wenn's passt: *„Super, lad es hoch / mach es live."*
6. Nach ~1 Minute ist die neue Version online. **Auf dem Handy: App schließen und neu öffnen** → neue Version ist da.

> Du brauchst **kein** „Claude Design" oder spezielles Tool. Dieser Chat (Cowork) ist alles, was du brauchst,
> weil Claude hier direkt deine Dateien bearbeiten und hochladen kann.

---

## 4. Der „Live stellen"-Knopf (technisch, nur zur Info)

Wenn Claude eine Änderung hochlädt, passiert im Hintergrund das hier (musst du dir nicht merken):

```bash
cd ~/Projekte/fitness-tracker
git add .
git commit -m "Beschreibung der Änderung"
git push
```

GitHub Pages baut dann automatisch neu (~1 Min). Fertig.

**Wichtig bei Datei-Änderungen:** Wenn sich Code ändert, sollte in `service-worker.js` die Zeile
`const CACHE_NAME = 'fitness-v6'` (aktueller Stand) hochgezählt werden (`v7`, `v8`, …), sonst zeigt das Handy evtl. die alte Version.
Claude denkt normalerweise daran — falls die App nach einem Update „alt" aussieht, ist das fast immer die Ursache.

---

## 5. Deine Daten sichern (wichtig!)

Deine Gewichte leben **nur im Handy-Browser**. Wenn du in Safari „Website-Daten löschst" oder die App vom
Homescreen entfernst, sind sie weg.

➡️ **In der App: Zahnrad (⚙️) → „Backup exportieren"** lädt eine Sicherungs-Datei runter. Mach das ab und zu.

---

## 6. Wo liegt was?

| Was | Wo |
|---|---|
| App-Code (auf dem Mac) | `~/Projekte/fitness-tracker/` |
| App-Code (in der Cloud) | https://github.com/vladimirschneider1995-cell/fitness-tracker |
| Live-App | https://vladimirschneider1995-cell.github.io/fitness-tracker/ |
| Projekt-Notiz im Cortex | `_Cortex/00_Vault/🌱 Entwicklung/Fitness Tracker PWA.md` |
| Diese Anleitung | `~/Projekte/fitness-tracker/WEITERARBEITEN.md` |

---

## 7. Ideen-Liste / nächste Schritte

**Schon erledigt (Juni 2026):**
- ✅ Sicherheits-Check + Härtung — keine API-Keys/Secrets im Code, CSP-Schutz, nicht bei Google auffindbar (noindex)
- ✅ Geräte-Icons komplett neu im feinen, detaillierten Linien-Stil
- ✅ Mehr Leben: Seiten-Slides beim Menüwechsel, gestaffeltes Einblenden, „Morph" beim Öffnen einer Übung, Tipp-Feedback
- ✅ Neue Übungs-Icons: Liegestütze, Ausfallschritte, 3 Klimmzug-Varianten (breit/parallel/Untergriff), 5 Resistance-Band-Übungen — mit **wählbarer Bandfarbe** (grün/lila/blau/schwarz/rot), bei Klimmzügen optional
- ✅ **Heller Modus + Automatik** (folgt dem iPhone), umschaltbar unter Einstellungen → Darstellung; wärmerer „Anthropic"-Farbton (Koralle im Dunkeln, Terrakotta im Hellen)
- ✅ **Verlaufs-Kurve** pro Übung über der Verlaufsliste (edle Mini-Kurve mit Verlauf-Fill, ab 2 Einträgen)

**Als Nächstes / offene Ideen:**
- **Mehr Geräte-Icons** für weitere Maschinen ergänzen (Vladimir benennt die Übungen selbst; das Icon soll das jeweilige Gerät abbilden)
- Übungen für Brust und Arme ergänzen
- Bandfarbe einer **bestehenden** Übung nachträglich ändern (geht aktuell nur beim Neu-Anlegen)
- Optional: Wiederholungen/Sätze zusätzlich zum Gewicht (macht die App etwas weniger minimal)

Schreib einfach in einem neuen Chat, was davon (oder was ganz anderes) du willst.
