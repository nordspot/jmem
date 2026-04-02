Hoi Simon

Danke für die detaillierte Auflistung und den Einblick in den Prototyp auf new.jmemwiler.ch! Ich habe mir alles genau angeschaut — die bestehende Seite, den Prototyp und auch den Shop.

Ich habe euer Anforderungsdokument studiert und möchte euch einen alternativen Ansatz vorschlagen, der **alle eure Anforderungen abdeckt**, aber deutlich moderner, schneller und einfacher zu pflegen ist als TYPO3.

---

## Euer Bedarf — unsere Lösung

Ihr habt folgende Punkte aufgelistet. Hier Punkt für Punkt unsere Antwort:

### Phase 1: Website-Einrichtung

| Eure Anforderung | Unsere Lösung |
|---|---|
| **Staging-Umgebung** | Automatisch dabei — jeder Entwurf wird auf einer separaten Preview-URL getestet, bevor er live geht. Die bestehende Website bleibt unberührt bis zum Go-Live. |
| **TYPO3 v13 Installation** | Statt TYPO3 setzen wir auf **Next.js + Cloudflare Pages** — kein PHP-Server nötig, keine Datenbank, keine regelmässigen Security-Updates. Die Seite ist statisch und damit extrem schnell und sicher. |
| **T3 Karma Website Builder** | Wir bieten **3 Wege zur Bearbeitung** (siehe unten) — vom visuellen Live-Editor bis zum AI-Assistenten. Viel flexibler und einfacher als T3 Karma. |
| **Google Analytics** | Google Analytics 4 Einbindung inklusive. |
| **Consent-Management** | Datenschutzkonforme Cookie-Lösung mit Cookie-Banner, Consent-Blocker und Datenschutzerklärung — DSGVO/DSG-konform. |
| **Live-Schaltung** | Domain-Umschaltung auf die neue Seite, sobald ihr zufrieden seid. |

### Phase 2: Fortlaufender Support

| Eure Anforderung | Unsere Lösung |
|---|---|
| **Regelmässige Systemupdates und Backups** | Entfällt fast komplett — kein PHP, kein MySQL, keine TYPO3-Patches. **Jede Änderung wird automatisch versioniert** und kann jederzeit rückgängig gemacht werden. Das ist besser als jedes Backup. |
| **Technischer Support und Fehlerbehebung** | Technischer Support von uns im Hintergrund, schnelle Reaktionszeiten. |

---

## 3 Wege zur Bearbeitung — für jedes Level

Das Herzstück unserer Lösung: Euer Team kann die Website auf **drei verschiedene Arten** bearbeiten, je nach Komfort und Anforderung:

### 1. Live-Editor (Keystatic)
> *Für Sandra & Vera — direkt im Browser bearbeiten*

Ein visueller Editor direkt auf der Website. Texte anklicken, ändern, speichern. Bilder per Drag & Drop austauschen. Neue Angebote oder Schulen hinzufügen über einfache Formulare. Keine technischen Kenntnisse nötig.

- Texte direkt auf der Seite bearbeiten
- Bilder hochladen und austauschen
- Neue Einträge erstellen (Schulen, Angebote, Produkte)
- Änderungen sofort sichtbar

### 2. Backend CMS (Admin-Panel)
> *Für Power-User — strukturierte Bearbeitung aller Inhalte*

Ein klassisches Admin-Backend mit Formularen für jeden Inhaltstyp. Übersichtliche Listen, Such- und Filterfunktionen, Massenbearbeitung.

- **Schulen** — alle 10 Schulen mit Details (Daten, Preise, Beschreibungen, Varianten)
- **Shop-Produkte** — alle ~40 Produkte verwalten, neue hinzufügen, Preise ändern
- **Angebote** — alle 25+ Programme mit Bildern und Kategorien
- **Seiteninhalt** — Homepage-Texte, Hero-Bereich, CTAs bearbeiten
- **Einstellungen** — Kontaktdaten, Adresse, Telefon, Social Media, Bankverbindung

### 3. AI-Assistent (Agentic CMS)
> *Für den Admin — Änderungen per Textbefehl oder Screenshot*

Ein AI-gestützter Assistent, der Änderungen auf natürliche Art versteht und umsetzt. Einfach beschreiben, was ihr ändern wollt — der Assistent liest die aktuellen Dateien, macht die Änderungen und committet sie automatisch.

- **Textbefehle**: "Aktualisiere die DTS-Startdaten auf Oktober 2026"
- **Screenshot hochladen**: "Mach die Seite so wie auf diesem Bild"
- **PDF hochladen**: "Hier ist der neue Flyer, übernimm die Infos auf die Website"
- **Bilder hochladen**: Bis zu 20 MB pro Datei, direkt per Drag & Drop
- **Vollständige Historie**: Jede Änderung nachvollziehbar, jederzeit rückgängig machbar

---

## Warum nicht TYPO3?

Ich verstehe total, dass TYPO3 bisher als ideal angesehen wurde. Aber ehrlich gesagt bringt TYPO3 für euren Anwendungsfall einiges an Overhead mit:

- **Server-Wartung**: PHP-Updates, MySQL-Patches, TYPO3-Security-Updates
- **Kosten**: Ein TYPO3-Server kostet CHF 20-50/Monat + Wartungsaufwand
- **Geschwindigkeit**: TYPO3 generiert Seiten dynamisch — das ist langsamer als statische Seiten
- **Sicherheit**: Ein PHP/MySQL-Backend ist ein Angriffsziel. Statische Seiten können nicht gehackt werden
- **Abhängigkeit**: T3 Karma Builder ist ein Nischenprodukt mit begrenztem Support

**Unsere Lösung gibt euch mehr als TYPO3 — ohne den Overhead:**
- Inhalte selbst bearbeiten (3 verschiedene Wege!) ✓
- Design selbst anpassen ✓
- Formulare mit automatischer Kommunikation ✓
- Mehrsprachig (DE/EN) ✓
- Schneller, sicherer, günstiger im Betrieb ✓

---

## Was wir konkret umsetzen

### Komplette Website
- Alle bestehenden Inhalte übernommen (Schulen, Angebote, Einsätze, Über uns, Kontakt)
- **10 Schulseiten** mit allen Details (DTS mit 4 Varianten, SBCW mit 7 Einflussbereichen, SBS mit Quartalstruktur, etc.)
- **25+ Angebote** mit Bildern und Kategorien (Familie, Paare, Kinder, Workshops)
- **Shop** mit allen ~40 Produkten (Bücher, Musik, Kinder-Material, Tricks)
- **2 Sprachen** (Deutsch + Englisch) mit vollständigen Übersetzungen
- Erfahrungsberichte/Testimonials von Studierenden
- Responsive Design (Handy, Tablet, Desktop)
- YouTube-Videos, Wave-Animationen, moderne Bildergalerien
- Euer bestehendes Logo und Branding

### 3-Wege-CMS (siehe oben)
- Live-Editor, Backend-CMS und AI-Assistent
- Vollständige Versionshistorie mit Rückgängig-Funktion
- Passwortgeschützter Admin-Bereich

### Formulare & Kommunikation
- Kontaktformular mit Betreff-Auswahl
- Anmeldeformulare für Schulen und Events
- Automatische E-Mail-Benachrichtigungen
- Newsletter-Anbindung (euer bestehendes Sendinblue/Brevo)

### Analytics & Datenschutz
- Google Analytics 4
- Cookie-Banner mit Consent-Management (DSG-konform)
- Datenschutzerklärung / Cookie-Erklärung

---

## Vorgehen

1. **Kickoff-Meeting** mit dir, Sandra & Vera — Prototyp besprechen, Wünsche klären, Design-Richtung festlegen (nur falls ihr das wollt)
2. **Umsetzung** (ca. 3-4 Tage) — wir bauen die Seite, ihr gebt laufend Feedback
3. **Content-Migration** — alle Inhalte, Bilder, Texte aus der bestehenden Seite werden übernommen
4. **CMS-Schulung** — wir zeigen Sandra & Vera wie sie alle 3 Bearbeitungswege nutzen können
5. **Go-Live** — Staging prüfen, Domain umschalten, fertig

**Zeitrahmen:** Go-Live bis Winter 2026, wie von euch gewünscht. Wir könnten aber deutlich schneller sein — je nach Kickoff-Termin wäre ein Go-Live bereits im Sommer realistisch.

---

## Kosten

### Phase 1: Website-Einrichtung
**CHF 4'800** (einmalig)

Beinhaltet: Komplette Website, Shop, 3-Wege-CMS, 2 Sprachen, Formulare, Content-Migration, Analytics, Consent-Management, Schulung.

### Phase 2: Fortlaufender Support
**CHF 50/Monat**

Beinhaltet: Hosting (Cloudflare), technischer Support, Fehlerbehebung, Updates bei Bedarf.

> Zum Vergleich: Euer Budget von ca. CHF 5'000 für die TYPO3-Lösung deckt nur die Installation und Grundeinrichtung — ohne Content-Migration, ohne Shop, ohne Mehrsprachigkeit, ohne Schulung. Und der laufende Betrieb eines TYPO3-Servers ist teurer.

---

## Nächste Schritte

Sobald Sandra & Vera zurück sind, würde ich vorschlagen, dass wir uns zu dritt/viert zusammensetzen. Ich kann dann live zeigen, wie die 3 Bearbeitungswege funktionieren und wie einfach die Bedienung ist. So könnt ihr direkt einschätzen, ob das für euch passt.

Was meinst du?

Liebe Grüsse
Daniel

---

*nord.spot — Digital Agency*
*info@nord.spot*
