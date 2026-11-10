# A12 – T-0080 Browser-/Unabhängigkeitsgate

**Status:** NONPASS – visueller und funktionaler Browser-Smoke in dieser Ausführung nicht möglich
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A12 – Browser-/Playtest
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.5
**Ticket:** T-0080 – T-0069 G10 Browser/Unabhängigkeit
**Datum:** 2026-11-01

## Preflight

Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; `git status --short` enthielt beim Preflight 519 Einträge. Vorhandene lokale Änderungen wurden nicht verändert oder bereinigt.

| Kontrollquelle | SHA-256 |
|---|---|
| `AGENTS.md` | `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556` |
| `agent-structure.md` | `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE` |
| `agent-rights-matrix.md` | `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE` |
| `goals.md` | `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D` |
| `ticket-board.md` | `D3D2A24FF53AA685306B527FB9523F1DB7F18B41171D4557F6F9B54289ACB915` |
| `collaboration-state.md` | `B3669CC837CFC3842CBFD2565D31217FB7794CB2B6D113E18A9E84644AC54C2F` |
| `decision-log.md` | `1EA4649C21FCC505BD4A9931CB7B9C16628656A0A9F2BB88DF07E3460ADAACEB` |

## Abnahmekriterien und tatsächliche Prüfung

T-0080 verlangt die Kernpfade bei 390×844 und 768×1024 ohne abgeschnittene Aktionen, horizontalen Overflow oder Browserfehler; außerdem eine unabhängige A09-Prüfung der Reconciliationbelege und eine reproduzierbare A12-Geräte-/Browserprüfung.

Der bekannte lokale Zielpfad antwortet mit `HTTP 200`: `http://127.0.0.1:8041/prototype/v3/run.html` (Abruf per `Invoke-WebRequest`, Antwortlänge 14.577 Bytes). `node --check prototype/v3/run.js` war erfolgreich. Diese Prüfungen belegen Serverantwort und JavaScript-Syntax, aber keine Bedienbarkeit oder Darstellung in einem Browser.

Die UI-Steuerung wurde versucht. Der Computer-Use-Browserzugriff wurde durch die Laufzeit gestoppt mit: `Computer Use has been stopped for this turn because it could not determine the current browser URL on Windows with enough confidence to enforce policy.` Gemäß Toolvorgabe wurden danach keine UI-Aktionen mehr ausgeführt. Der Root-IAB meldete außerdem `browser.user is unavailable`.

Im Checkout gibt es keinen erkennbaren Playwright-/Puppeteer-Testlauf: `prototype/package.json` definiert nur `test:year`; die Abhängigkeiten `playwright`, `playwright-core`, `puppeteer` und `puppeteer-core` sind lokal nicht auflösbar. Es wurde keine Software installiert.

## Ergebnis

**T-0080 bleibt NONPASS / offen.** Es gab keinen visuellen Smoke, keine Interaktion mit Run-UI-Kernpfaden, keinen Viewportwechsel und keine unabhängige A09-Reconciliation-Prüfung im Rahmen dieses Untertickets. Insbesondere wird aus HTTP 200 und `node --check` kein Browser-PASS abgeleitet.

## Nächster Schritt

A01/A12 kann den reproduzierbaren UI-Smoke wiederholen, sobald eine kontrollierbare Browser-Session oder ein bereits installierter Browser-Runner verfügbar ist. Danach die Kriterien bei 390×844 und 768×1024 mit URL, Bedienpfaden, Overflow-/Fehlerbeobachtung und Artefakt-Hash protokollieren; A09 prüft den integrierten Reconciliationbeleg unabhängig. Kein Commit/Push.
