# A11-Änderungsbericht – CP-0029-MEDIUM-Korrekturen

**Datum:** 2026-09-26
**Agent:** A11 – TECHNICAL_ARCHITECT
**Bezug:** MG-000 / SLG-000.2 / CP-0029
**Status:** Die beiden angeforderten Dokumentationsbefunde sind behoben.

## Änderungen

1. `docs/architecture/architecture-v0.2.md`, §8 unterscheidet jetzt ausdrücklich das Wochenraster, die tageweise Verarbeitung jedes Zwischentags, tatsächliche Simulations-Kalendertage für operative Ereignisse und den nach den Tagesphasen stattfindenden Monats-/Periodenabschluss. Die bestätigte A02-Tagesreihenfolge und Same-Day-Fortschreibung wurden unverändert übernommen; der Monatsabschluss schreibt Ereignisse nicht rückwirkend um.
2. `docs/database/maschinenbau-mvp-datenmodell.md`, §3.2 nennt nun die bestätigte F3-Frist und Ablehnungsbehandlung, automatische Rechnung nach bestätigter Abnahme sowie G3-Abschluss erst nach vollständigem Kundenzahlungseingang. Lieferantenverbindlichkeiten blockieren diesen Kundenauftragsabschluss nicht. Der weitere Ablauf nach Ablehnung bleibt offen.

CP-0020 fehlt weiterhin im Checkout. Es wurde nicht rekonstruiert und nicht als Quelle durch Annahmen ersetzt.

## Unverändert

Keine neue Produkt- oder Architekturentscheidung; D-0010 blieb unverändert. ADR-001 bis ADR-008 bleiben `PROPOSED`. Keine Implementierung, Datenbankänderung oder Migration. Andere vorhandene Arbeitsänderungen wurden beibehalten.

## Prüfung

- Geänderte Passagen auf die beiden CP-0029-MEDIUM-Befunde und die geforderten Regeln begrenzt geprüft.
- `git diff --check` ausgeführt.
- Repository-Status erfasst; keine Commit-/Push-Operation.

## Nächster Schritt

Keine weitere fachliche Änderung aus diesen beiden Befunden erforderlich. Weitere Architektur-/Produktfreigaben sind nicht Teil dieser Korrektur.
