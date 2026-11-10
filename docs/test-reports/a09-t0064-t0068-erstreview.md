# A09 – Erstreview T-0064/T-0068

**Status:** T-0064 Dokumentvertrag PASS mit fehlendem ausführbarem V3-Grenzfalltest; T-0068 strukturell PASS, redaktionelle Nacharbeit offen (2026-10-31)
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A09 – QA
**Ziele/Tickets:** MG-002; SLG-002.2–SLG-002.5; T-0064/T-0068

## T-0064

A02s Statusvertrag trennt Gründung, Rechtsträger, Registerstatus, Betriebsfähigkeit und Transaktionsstatus. `candidate_not_enabled` schützt AG/eG/GmbH & Co. KGaA; GmbH & Co. KG verwendet getrennte GmbH-/KG-IDs; Ereignis-IDs sind idempotent; Finanzwirkung benötigt ein separates A03-Ereignis. A09 fand keinen Konflikt mit D-0161/D-0163/D-0164.

Der vorhandene Validator `node prototype/a02-t0064-legal-regressions.mjs` besteht, deckt aber vor allem ältere Engine-/Rechtsfolgen ab. Es gibt keinen V3-Runtime-Code und keinen ausführbaren Grenzfalltest für Kandidatensperre, getrennte IDs, Idempotenz und fehlende Finanzbuchungen. Diese Prüfung bleibt Integrationsarbeit, kein Fehler im dokumentarischen Vertrag.

## T-0068

Strukturell: 21 V3-Kriterien, 60 eindeutige Vw-Regelfragen in 20/20/20 und 50 lückenlos eindeutige Ereignisfragen mit vier Optionen, Lösungsschlüssel, Erklärung, Wirkungsbeschreibung und `Mutation: keine`. Vorhandene Validatoren bestanden: `prototype/learning-wbq-validation.mjs`, `prototype/learning-hsq-validation.mjs`, `prototype/learning-ui-regressions.mjs`.

A06-Mapping enthält veraltete Abhängigkeitsangaben: T-0063-Makroquellen/SPI und der T-0064-Gründungsvertrag werden noch als nicht geliefert dargestellt. Laufzeitintegration/Fachreview bleiben tatsächlich offen. Die Bereinigung ist erforderlich.

A09 wies auf eine mögliche Wirkungstiefenfrage hin. A01 hat D-0147 geprüft: Tages-/Dashboardantworten zählen gemeinsam zum Limit von fünf und erzeugen bei richtig/falsch die dort festgelegten kleinen Kompetenz-/Ruf-/Motivationseffekte, ohne Buchungen. D-0159 verschiebt nur verpflichtende tagesblockierende Lernereignisse aus V2. Damit ist keine neue Nutzerentscheidung nötig; die T-0068-Wirkungsbeschreibung muss diese bestehende Regel respektieren.

## Verifikation und Grenzen

A09 las den vollständigen Git-Status, erhielt alle vorhandenen Änderungen und änderte keine Datei. `git diff --check` PASS mit LF/CRLF-Hinweisen. Kein Commit/Push. Nicht geprüft: Browser-/Geräteintegration und Jahres-Smokes.
