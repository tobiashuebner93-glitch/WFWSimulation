**Fortschreibung CP-0468 (2026-11-01):** Nutzer hat A03s FIFO-Empfehlung bestätigt; D-0170 dokumentiert die V3-Spielregel. FIFO-Kostenlayer, Versand-COGS, Run-Adapter, Belegformular und Regressionen sind umgesetzt. Produkt-/FIFO-/Shared-Run-/UI-/FinanceRuntime-Suiten und scoped `diff --check` PASS; lokaler Run-HTML-Pfad liefert HTTP 200. G1–G9 PASS; G10 bleibt NONPASS, bis Kostenquellen technisch an Betriebsdaten gebunden und A03/A09 re-reviewed sind. Kein visueller Browser-Smoke (CUA `browser.user is unavailable`). T-0066 bleibt IN_PROGRESS bei 9/10. Siehe [CP-0468](checkpoints/CP-0468.md) und [Reviewbericht](a01-t0066-implementation-review-cp0468.md). Kein Commit/Push.
**Fortschreibung CP-0467 (2026-11-01):** T-0066-Minimalziel wurde nach A09-Review in zehn binäre Gates präzisiert und als Zieltext insgesamt PASS reviewed. A03 hält Gate 10 wegen fehlender freigegebener Bestandsbewertung/COGS weiter NONPASS; kein Wert wurde ergänzt. A02-Review war im alten Projektspiegel nicht ausführbar und gilt nicht als PASS. T-0066 bleibt IN_PROGRESS bis die Gates an Implementierung und Reviews bestanden sind. Details: [CP-0467](checkpoints/CP-0467.md); Ziel: [T-0066/0067-Mindestziele](a01-t0066-t0067-mindestziele.md).**Fortschreibung CP-0465 (2026-11-01):** A03 und A09 bestätigen `simulated_actual`-Zeitbeleg PASS; Minuten/Source/Assignment/Datum/Periode und Event-/Restore-Bindung, keine Kostenwirkung. A05 zeigt Dauer nach Abschluss sichtbar mit Modellierungslabel, Quelle, Datum/Periode und Kosten pending; Planzeit bleibt getrennt; ineligible/incomplete zeigt keine Dauer. A05 meldet beide UI-Suiten, Syntax und diff-check PASS. Finaler A09 UI-Re-Review ausstehend; kein visueller Browser-Tab verfügbar.

**Fortschreibung CP-0502 (2026-11-05):** T-0111 erfasst nutzerfreundliche Angebots-/Produkt-Eingaben und die Berufs-/Produktvoraussetzungen. Angebots-JSON/Standkennungen werden aus sichtbarer Nettoeingabe und synthetischem Profil erzeugt; Produktarchetypen setzen Marktprofil/Rezeptur und sperren fehlende Fähigkeiten, Geräte oder Zusatznachweise. Zehn repräsentative Metallberufsprofile und Startpfade Geselle+Wirtschaftsfachwirt bzw. Meister sind in Code/Dokumentation angelegt. V6/V10-Zielkarte ergänzt. Folgegate bleibt offen: Erwerbsprozess für weitere Skills/Lizenzen/Geräte, unabhängige Reviews und Browser-Smoke. Siehe CP-0502.
**Fortschreibung CP-0464 (2026-11-01):** A02 ergänzt `simulated_actual`-Zeitbelege auf abgeschlossenen Produktblöcken: Assignment-Quelle, Minuten, Datum/Periode, Modellbasis/Label; Restore gleicht Beleg mit Completion-Event und abgeschlossener Dauer ab. Incomplete/cancelled darf keinen Zeitbeleg haben. `costEvidence` bleibt pending; keine Finanzwirkung. Gezielt Produkt- und Runregressionen, Syntax und diff-check PASS. A03/A09 Review und A05 sichtbare Anzeige im UI ausstehend.

**Fortschreibung CP-0463 (2026-11-01):** A09 bewertet T-0066 insgesamt NONPASS ausschließlich wegen fehlender tatsächlicher Zeitbelege je Produktoperation; übrige Ressourcen-, DB-I-, Dispatch-, Lager-, Replay- und UI-Kriterien bestehen. A01 setzt als Simulationsregel: Abschluss eines Arbeitsschritts schreibt die verbrauchte simulierte Blockdauer in Minuten mit Assignment-/Source-ID, Datum/Periode und Kennzeichnung `simulated_actual`; keine reale Messbehauptung, keine Kostenrate/COGS. A02 implementiert Evidence + Regression; A03 prüft Finanzabgrenzung; A05 zeigt Simulationszeit im UI; A09 re-reviewt.

**Fortschreibung CP-0462 (2026-11-01):** A02 ergänzte in der Mixed-Run-Regression explizite DB-I-Vorzeichen: `mixed-positive` > 0 und `mixed-negative` < 0 am eingefrorenen Angebotssnapshot. Gemeinsame Person/Maschine/Material/Lagergrenzen, Dispatch und keine zusätzlichen Finance-Handoffs/Ledger sind ebenfalls belegt. Syntax, Orchestratorregression und diff-check PASS. A03/A09 Abschlussreview ausstehend; T-0066 bleibt bis zu deren PASS IN_PROGRESS. T-0069 Jahresgate weiterhin offen.

**Fortschreibung CP-0461 (2026-11-01):** A09 bestätigt die A05-UI-Fixes PASS; Annahme sagt reserviert, Flächenumrechnung ist Pflichtfeld und im Snapshot. Beide UI-Regressionen PASS. A03/A09-Kernreview bleibt PASS für Lagerroll-forward/Dispatch/No-posting. A01-Finalkriterienprüfung: T-0066-Test bezeichnet Produkte `mixed-positive`/`mixed-negative` und setzt Preis/Kosten, asserts aber DB-I-Vorzeichen nicht direkt; ein expliziter wirtschaftlicher PASS/Verlustbeleg fehlt. A02 soll DB-I >0/<0 im Mixed-Run assertieren. Visueller Browserbeleg bleibt nicht verfügbar. T-0066 noch IN_PROGRESS.

**Fortschreibung CP-0460 (2026-11-01):** A05 korrigierte die Annahmemeldung („reserviert; Bestand bis Versand im Lager“) und das verpflichtende `storageUnitsPerOrderUnit`-Feld; `planRunOrder` übergibt es in den Vertragssnapshot. Kunden-UI-Fixture nutzt regulären Plan-/Completionpfad und prüft Lagerbelegung. A05 Produkt- und T-0069-UI-Regressionen, Syntax, diff-check PASS. A09 finaler Read-only Re-Review der zwei UI-Korrekturen ausstehend; visueller Browserbeleg weiterhin offen. T-0066 nach Code-/Finanz-/Regressionstests nahezu erfüllt, aber UI-Review offen. T-0069 Volljahresgate NONPASS.

**Fortschreibung CP-0459 (2026-11-01):** A03 bestätigt Reservierung/Dispatch/No-Posting-Pfade PASS. A09 bestätigt gemeinsames Lager, Multi-offer, Roll-forward, Overflow, paired-tamper und 52-Wochen-Gate PASS. NONPASS: Klickmeldung nach Käuferannahme behauptet weiter „Fertigwaren wurden ausgebucht“ (run.js:923), obwohl nur Reservierung erfolgt; `a05-t0069-run-ui-regressions.mjs` scheitert zusätzlich an ungültigem `storageUnitsPerOrderUnit`-Fixture. A05 korrigiert beide Texte/Fixture und ergänzt Handler-Assertion; danach A09 final re-run. T-0066 bleibt offen.

**Fortschreibung CP-0458 (2026-11-01):** A02 hat same-product reservations korrigiert: zwei offene Angebote je 2 bei 4 verfügbar werden angenommen, Bestand bleibt physisch 4 bis zu zwei separaten Dispatches; Überzeichnung fail-closed. A05 ergänzte Dispatch-Button, accepted/reserved/not-shipped Status, verfügbare/reservierte/physische Bestände sowie korrekte Copy und UI-Regression. Tests PASS. A05 konnte keinen Browser-Tab öffnen; visueller Browserreview für neue UI fehlt. Finaler A03/A09-Crossreview nach A02/A05 nötig. T-0066 noch IN_PROGRESS.

**Fortschreibung CP-0457 (2026-11-01):** A09 bestätigt T-0066-Lager-Roll-forward, Overflow no-mutation, paired-tamper rejection, eigenständigen Dispatch, 52-Wochen-Gate und 30/90-Tage-Harness PASS. A03 bestätigt No-Posting-/Finanzgrenze, findet aber zwei Angebote derselben Produkt-ID: zweite Annahme wird wegen doppelt gezählter Reservierung abgewiesen. Zusätzlich fehlt in `run.js` eine Versandaktion und die Anzeige sagt fälschlich, Annahme buche den Lagerabgang. T-0066 bleibt offen. A02 Mengenfix/Regression; A05 Dispatch-UI/Textfix. Danach A03/A09 final re-review.

**Fortschreibung CP-0456 (2026-11-01):** A02 hat A09s drei Findings umgesetzt: Rücklauf-Overflow und paired Movement+Source-Tampering werden fail-closed/no-mutation geprüft; Roll-forward rekonstruiert Opening + alle Goods-Movements bis `finishedGoodsUsed`; Full-Year-Gate assertiert 52 Marktwochen. Eigenproduktannahme reserviert, separater Dispatch bucht physischen Abgang. Lifecycle-/Orchestrator-Regressionen, Syntax und diff-check PASS. A03/A09-Crossreview ausstehend, daher T-0066 noch nicht geschlossen. T-0069 weiterhin ohne 362-Tage-PASS.

**Fortschreibung CP-0455 (2026-11-01):** A03 bewertet Finanz-/Periodenfluss des T-0066-Lagerslices PASS; keine Geld-/COGS-/Ledgerwirkung, Zeit/Kosten pending. A09 findet verbleibende NONPASS: Rücklauf-Overflow fehlt als fail-closed/no-mutation Test; paired tampering von Movement + Source-Event könnte Roll-forward-Reconciliation umgehen; unbenutzte 52-Wochen-Konstante. A02 soll diese drei konkreten Punkte beheben, danach A03/A09 erneut reviewen. T-0066 bleibt IN_PROGRESS; T-0069 Jahresgate NONPASS.

**Fortschreibung CP-0454 (2026-11-01):** A02 hat Kundenfertigware ins gemeinsame Lager integriert: Einlagerung/Reservierung bei Arbeitsabschluss, idempotenter Abgang bei Versand, Freigabe bei Vorversandstorno, nach Versand nur separate Retourenbewegung mit Quarantäne. Menge/Datum/Periode/Order/Lot/Delivery/Source/Capacity werden validiert; keine Finanzbuchungen, Zeit/Kosten pending. Produkt-, Orchestrator- und Financial-Regressions, Syntax und diff-check PASS. A03/A09-Crossreview ausstehend. T-0069-Fensterchecks bestehen, Jahres-Smoke NONPASS; A09s offene 52-Wochen-Konstante bleibt noch zu bereinigen/verifizieren. Kein Commit/Push.

**Fortschreibung CP-0453 (2026-11-01):** A09 hat den T-0069-Harness unabhängig geprüft: Import/CLI-Grenze, State-Hash, Tages-/Event-/Monatsassertions und vollständige Validator-Ausführung PASS. Wiederholte 30/90-Tagefenster: 1.598 ms und 10.580 ms; gleiche State-Hashes wie CP-0452, Timingstreuung plausibel. A09 korrigierte die Aufrufzählung auf 122/362 Validierungen (inklusive Init und finaler Assert); CP-0452 wurde berichtigt. Event-Hash ist nicht separat, aber `stateHash` umfasst den Event-State. Unbenutzte 52-Montage-Konstante prüfen/entfernen oder verwenden; danach weiter T-0066-Slice A02. Kein Jahres-PASS, kein Commit/Push.

**Fortschreibung CP-0452 (2026-11-01):** A02 hat T-0069-Microbenchmarkfiles ergänzt. 30 Tage: 1.881 ms / 118 Events / Hash `e3270472…`; 90 Tage: 13.130 ms / 351 Events / Hash `7b5b3585…`. Validierungen bestanden; fensterspezifische Vorherwerte fehlen, daher kein Speedup behauptet. A09-Review der Benchmark-/Fixture-/Hashkorrektheit ausstehend. A02 bearbeitet danach T-0066 gemeinsame Lagerbelegung; Jahres-Smoke weiterhin NONPASS. Kein Commit/Push.

**Fortschreibung CP-0451 (2026-11-01):** A02 meldet für T-0069 eine erfolgreiche instrumentierte Baseline: 362 Tage, 1.409 Events, 204,557 ms, unveränderter State-Hash `d1205dd1…6726a6`; 1.448 Tages-Vollvalidierungen. Teuerste Validatorsegmente: `macroHistory` ca. 70,9 s, `macroDemandBindings` ca. 37,0 s (überlappende Zeiten). Der optimierte Jahreslauf endete nicht innerhalb des 95-s-Messfensters und wurde kontrolliert abgebrochen; kein Speedup/Jahres-PASS. Syntax-, Orchestrator- und Makroregressionen bestanden. Nächster Schritt: begrenzter Microbenchmark/Profiling dieser Validatoren, erst danach erneutes Jahresgate. A02 hat T-0066 noch nicht begonnen. Kein Commit/Push.

**Fortschreibung CP-0450 (2026-11-01):** A03 bestätigte: Istzeit und Istkosten bleiben korrekt `pending`; es gibt nur Planstunden/Abschlussdatum, keine gemessene Dauer oder anwendbare Operationskostenrate. Physischer Materialverbrauch ist kein COGS. Kundenfertigwarenvertrag benötigt stabile Bewegungs-/Quell-IDs, Datum/Periode, Menge/Einheit, Lagerort, Reservierungs- und Vor/Nachbestand. A02 muss Reservierungs-, Versandabgangs- und Ablehnungs-/Rückbewegungsphasen festlegen; keine Bewertungs- oder Postingregel ableiten. A02s T-0069-Baseline-Smoke läuft noch über 90 Sekunden ohne Abschlussausgabe. T-0063/65/66/67/69 IN_PROGRESS; kein Commit/Push.

**Fortschreibung CP-0449 / A09-Re-Review (2026-11-01):** A09 bestätigt Angebots-Snapshot/Replays und Produktlagerpfad; gemeinsame Kundenfertigwarenlagerbelegung sowie Istzeit-/Kostenbelege bleiben NONPASS. Bestehende Regressionen bestehen, aber A09 konnte keinen unabhängigen Browser-Tab steuern; CP-0448s A01-Browserbeleg bleibt separat. A01 weist nach Abschluss des laufenden T-0069-Pakets A02 die gemeinsame Lagerbelegung plus Istzeit-Evidence zu und A03 die Kosten-/COGS-Provenienz. Danach A05-UI und A09-Browser-Re-Review. Kein Commit/Push.

**Fortschreibung CP-0449 (2026-11-01):** A03 re-reviewed T-0066/T-0067: Planproduktivität und Angebots-Snapshot/DB I sind innerhalb der Finanzgrenzen PASS; Istzeit und Istkosten bleiben mangels Belegen pending. T-0066 bleibt NONPASS, weil Kundenfertigware im Mixed-Run das gemeinsame Fertigwarenlager nicht belegt. A02 bearbeitet bereits die T-0069-Timing-/Validierungsinstrumentierung; A09 prüft unabhängig die T-0066/67-UI und Laufzeitpfade. Danach erhält A02 den Lagervertrag (Menge, Zeitraum, Reservierung, einmaliger Abgang); A09 re-reviewed. T-0063/65/66/67/69 bleiben IN_PROGRESS. Kein Commit/Push.

# Ticket Board – WFWSimulation

## Aktive Tickets
| T-0084 | MG-002 / SLG-002.1 | HQ/WQ-Prüfungskorpus inventarisieren und Inhalts-/Fragen-ID-Abdeckung ableiten | A06; A07; A08; A09 Review | COMPLETED — begrenzter Scope gemäß D-0172: vorhandene nicht-verbatim Extraktbefunde synthetisiert; A06/A08/A09 unabhängig PASS; Offline-iPhone/iPad-Paket erstellt und A10 PASS. Kein Zugriff auf/wiederherstellen von Originalen, keine Originalfragen, keine Item-Coverage oder Prüfungsgewichtung behauptet. Vollständiger Korpusausbau bleibt ausgeschlossen. |
| T-0085 | MG-002 / SLG-002.1 | Quellen-zu-Fragen-ID-Crosswalk | A06; A09 review | COMPLETED — begrenzter PASS; Kompetenzbezug abgebildet, Item-IDs nur Kandidaten; keine Produktänderung |
| T-0086 | MG-002 / SLG-002.1 | Qualitätsaudit Fragenkatalog | A07; A09 review | COMPLETED — begrenzter PASS; exakte Wiederholung belegt, 11 Längencue-Kandidaten ungeprüft; Jaccard-Vollständigkeitsclaim NONPASS |
| T-0087 | MG-002 / SLG-002.1 | Unabhängige Evidenz- und Gate-QA zu T-0084–0086 | A09 | COMPLETED — begrenzter Review; Itemabdeckung/OCR/Rechteprüfung offen, keine Vollständigkeitsbehauptung |
| T-0088 | MG-002 / SLG-002.1 | Sichtprüfung repräsentativer Scans/Low-text-Prüfungen | A06; A09 review | COMPLETED — 10 PDFs visuell in begrenztem Seitenumfang klassifiziert; keine OCR/Vollabdeckung; A09-Gate PASS im begrenzten Scope |
| T-0089 | MG-002 / SLG-002.1 | Manuelles Review von 11 Antwortlängenkandidaten | A07; A09 review | COMPLETED — begrenzter PASS; HSQ 9 deutlich/1 schwach, WBQ 1 deutlich; alle Schlüsseloptionen am längsten; A09-Re-Review PASS; keine Produktänderung |
| T-0090 | MG-002 / SLG-002.1 | Unabhängige Gate-QA T-0084/0088/0089 | A09 | COMPLETED — begrenzter PASS; Runtime-ID-/Duplikatbefund bestätigt; T-0084-Gate NONPASS wegen 80 Inhaltsquellen, fehlender itemweiser Abnahme und offener Rechteprüfung |
| T-0091 | MG-002 / SLG-002.1 | Zweite Sicht-/Inhaltsstichprobe Low-text-Quellen | A06; A09 review | COMPLETED — bounded PASS after correction: 10/10 PDFs have exactly 0 extracted chars/page; A09 visually confirmed one page per source; no OCR/full-text claim |
| T-0092 | MG-002 / SLG-002.1 | Erweiterter Quellen-zu-Kompetenz/Fragen-ID-Crosswalk | A07; A09 review | COMPLETED — PASS im revidierten Kriterium: alle 49 Manifestrecords dispositioniert (47 PDF + 2 DOCX), 3 neue Familienkandidaten; keine Itemabdeckung/Rechtefreigabe |
| T-0093 | MG-002 / SLG-002.1 | Unabhängige QA T-0091/T-0092 | A09 | COMPLETED — T-0091 bounded PASS after count correction; T-0092 PARTIAL/NONPASS (3/10 candidate sources, seven exclusions/search coverage not evidenced) |
| T-0094 | MG-002 / SLG-002.1 | Re-Review des vollständigen T-0092-Manifestabgleichs | A09 | COMPLETED — NONPASS: 3 Kandidaten plausibel, aber fünf der 49 Manifestrecords fehlen im Bericht (3 HQ-Aufgaben, 2 DOCX); getrennte Nichtmanifest-Liste nötig |
| T-0095 | MG-002 / SLG-002.1 | Fehlende Records im T-0092-Manifestbericht dispositionieren | A07; A09 review | COMPLETED — PASS: fünf zuvor fehlende Dispositionen ergänzt; 49 unique Records und Nichtmanifest-Dateien getrennt |
| T-0096 | MG-002 / SLG-002.1 | Finales unabhängiges Gate T-0092 nach T-0095 | A09 | COMPLETED — PASS: 49 Pfade stimmen mit CP-0491 überein; 3 Kandidatenfamilien/Runtime-IDs plausibel; keine Item- oder Rechteaussage |
| T-0097 | MG-002 / Governance Review | CP-0500 250-Checkpoint Review/Retro und Mastercheckpoint | A01 – MASTER_ORCHESTRATOR | COMPLETED — CP-0500/MCP eingefroren nach Nutzerbestätigung; Governance-Regeln D-0171 übernommen; kein Commit/Push |
| T-0098 | MG-002 / Governance Review | CP-0251–0500: Simulation und Tages-/Jahresabläufe | A02 – SIMULATION | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0099 | MG-002 / Governance Review | CP-0251–0500: Accounting/Finance und Wirtschaftlichkeit | A03 – ACCOUNTING_FINANCE | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0100 | MG-002 / Governance Review | CP-0251–0500: Datenmodell/Persistenz/Schemaschranken | A04 – DATABASE | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0101 | MG-002 / Governance Review | CP-0251–0500: Oberfläche/UX und Hand-off | A05 – FRONTEND | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0102 | MG-002 / Governance Review | CP-0251–0500: Lernsystem/Kompetenzabdeckung | A06 – IHK_LEARNING | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0103 | MG-002 / Governance Review | CP-0251–0500: Prüfungslogik/Fragenkatalog | A07 – EXAM | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0104 | MG-002 / Governance Review | CP-0251–0500: Recherche/Rechts-/Quellenprovenienz | A08 – RESEARCH | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0105 | MG-002 / Governance Review | CP-0251–0500: unabhängige Qualitäts- und Konfliktanalyse | A09 – QA | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0106 | MG-002 / Governance Review | CP-0251–0500: Git/CI/Deployment/Archivierung | A10 – DEVOPS_INFRASTRUCTURE | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0107 | MG-002 / Governance Review | CP-0251–0500: Architekturgrenzen/Schnittstellen | A11 – TECHNICAL_ARCHITECT | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0108 | MG-002 / Governance Review | CP-0251–0500: Browser-/Geräte-Test und Nutzerübergabe | A12 – BROWSER_PLAYTEST | COMPLETED — fachliches Review und finales MCP-Korrekturreview PASS; dokumentiert in CP-0500 |
| T-0065 | MG-002 / SLG-002.2 | Markt und Angebote | A02; A03/A05/A09 review | COMPLETED — zehn Minimalgates PASS im aktuellen Umfang; A03-Vektorreview, A05-UI/Cachebindung, sichtbarer A01-Smoke und unabhängiger A09-HEAD-Review liegen vor. Jahresintegration bleibt T-0069. CP-0511. |
| T-0066 | MG-002 / SLG-002.2 | Produktivität und eigene Produkte | A02; A03/A05/A09 review | COMPLETED — zehn Minimalgates PASS im festgelegten Plan-/Snapshotumfang; A03 bestätigt G8/G10-Finanzgrenze, A05-UI/Regressionen und A01-Smoke liegen vor, A09 bestätigt G10 unabhängig am HEAD. Kein Ist-COGS-/Postingclaim. CP-0511. |
| T-0067 | MG-002 / SLG-002.2 | Kalkulation und dynamischer BAB | A03; A02/A05/A09 review | COMPLETED — G1–G6 PASS im festgelegten Planumfang; BAB-Rechen-/UI-Smokes, A03-Finanzabgrenzung und unabhängiger A09-G6-Review am HEAD liegen vor. Keine Istkosten-/COGS-/Buchungsfreigabe; Jahresreconciliation bleibt T-0069. CP-0511. |
| T-0069 | MG-002 / SLG-002.2 | Jahresintegration und End-to-End-Reconciliation | A01; A02/A03/A05/A09/A12 | IN_PROGRESS — T-0074/G3 und T-0077/G7 NONPASS laut A09: keine Finanzjahresreconciliation. T-0080/G10 NONPASS bis aktueller A12-Browser-/Mobilbeleg vorliegt. T-0075 alter Harnessnachweis hashdriftet; T-0124 bestätigt CP-0524 nicht als vollständigen Ersatz. T-0076 Mengenbeleg aus CP-0525 bleibt getrennt und `pendingFinance=true`. CP-0540.
| T-0109 | MG-002 / SLG-002.4 | Spielgebundene WBQ/HQ-Übungsfälle mit Feedback | A07; A06 competency; A05 UI; A09 review | IN_PROGRESS / PARTIAL — Code-/Traceability-Review liegt vor; aktueller Klick-/Feedback-/Reload-/Reopen-Smoke kann mangels Testbrowser/Build nicht ausgeführt werden (A12, CP-0539).
| T-0110 | MG-002 / SLG-002.5 | V3-Daten- und Änderungsgrenzen inventarisieren | A11; A04/A02/A03/A09/A10 reviews | IN_PROGRESS / PARTIAL — Daten-/Event-/Persistenzabgrenzung und Manifestreview PASS; aktueller T-0109 Browser-/Reloadbeleg fehlt. D-0180 Restoreguard ist statisch PASS (T-0123), Tamper-/Replay-Verhaltenstest offen. Keine Schemafreigabe. CP-0541.
| T-0111 | MG-002 / SLG-002.2 | Verständliche Angebots-/Produktformulare und berufliche Kompetenzgates | A05; A02 Kompetenzmodell; A08 Rechtsreview; A09 QA | IN_PROGRESS / PARTIAL — Kompetenz-/Codegates reviewed; aktueller interaktiver Browser-/Mobil-Smoke für Skill- und Produktvoraussetzungen fehlt (A12 BLOCKED; CP-0539).
| T-0112 | MG-002 / SLG-002.2 | Auftragsannahme, automatische Arbeitsplanung und Produktkonzept auf Managementebene | A02; A03; A05; A08 Recht; A09 review | IN_PROGRESS / PARTIAL — Modell-/Finanz-/Daten-/Rechtsreviews liegen im beschriebenen Scope vor; positiver Zuschlag/Vertragssnapshot im aktuellen Browser und Mobilbeleg fehlen (A12 BLOCKED; CP-0539).
| T-0113 | MG-002 / SLG-002.5 | Nur aktuelle Testversion über GitHub Pages veröffentlichen und alte Pakete entfernen | A10; A01 koordiniert | IN_PROGRESS / externer Blocker — A10 Diagnose bestätigt `configure-pages` 404, weil Pages-Site nicht eingerichtet ist. Admin-/Maintainer-Schritt erforderlich: Repository Settings → Pages → Build and deployment → Source `GitHub Actions`; danach vorhandenen `workflow_dispatch` auslösen. Keine Einstellung oder Workflowausführung durch A10. CP-0539.
| T-0114 | MG-002 / SLG-002.2 | Simulationsinterne Arbeitsmittel-Unterweisung und besondere Beauftragung | A02 führt; A03/A04/A05/A08/A09 prüfen | IN_PROGRESS — Engine/UI, A02-Regression, A04 JSON-Save/Restore-Roundtrip und statische Reviews PASS. Browser-Smoke 2026-11-09: Startprofil→Material→Tagesöffnung→60-Minuten-Erstunterweisung planen und abschließen; Status wechselt von „nicht aktuell“ zu aktiv bis 04.01.2028. Geräte-/Mobilgeräte-Smoke bleibt offen. CP-0549.
| T-0115 | MG-002 / SLG-002.2 | Kundenseitige Gegenangebote und Preisverhandlung | A02 führt; A03/A05/A08/A09 prüfen | COMPLETED — D-0185 Engine/UI umgesetzt; MAX_SAFE_INTEGER-Fix; vollständige Market-Suite sowie fokussierte Engine-/UI-/Graphcache-Regressionen PASS. A03 Financeboundary, A08 Rechtsreview und A09 unabhängige QA PASS. Browser-Smoke: exakte Annahme 114,40 € schließt Vertrag und legt am selben Tag genau einen Auftrag an; Finanzstatus bleibt ungebucht. A05-Fußtextkorrektur verhindert widersprüchliche Statusanzeige; A09 UI-Re-Review und abschließender Browser-Smoke PASS. Die breite Run-Orchestrator-Suite hat separat eine alte Fixture ohne T-0114-Unterweisungsnachweis; sie ist nicht als T-0115-PASS behandelt und bleibt T-0114-/Fixture-Nacharbeit. CP-0554.
| T-0116 | MG-002 / SLG-002.2 / SLG-002.5 | V3-Finanzverträge Payroll/Steuer/Kredit/Bestand/GL für T-0077 | A03; A01 koordiniert; A02/A04/A09 Folge-Reviews | IN_PROGRESS — A03-Vertragsbericht/A09-T-0117 PASS, A02-T-0118 und T-0074/77-Handoff PASS im Quellmapping-Scope. T-0125/26 abgegrenzter Dispo-Pfad statisch PASS; verbleiben Payroll/Steuern/Materialbewertung/COGS/GL, fehlender Dispozinsnominalsatz und Quartalsbilanzbasis. D-0178 COGS PENDING. CP-0541.

| T-0117 | MG-002 / SLG-002.2 / SLG-002.5 | Unabhängiges Review des T-0116-Finanzvertrags | A09 – INDEPENDENT_QUALITY; A01 koordiniert | COMPLETED — PASS auf Vertragsebene; keine Runtime-/Schema-/Rechts-/Releasefreigabe. Bericht docs/accounting/a09-t0117-t0116-review.md; SHA-256 594F32BC6FD8C95421F08718A5068B51561E8FDB31D43015383D632783E8EABE. CP-0531. |
| T-0118 | MG-002 / SLG-002.2 / SLG-002.5 | A02-Finanzquell-/Periodenmapping für T-0077 | A02 – SIMULATION; A01 koordiniert; A03/A04/A09 Folge-Reviews | COMPLETED — read-only Quellenmapping PASS im Umfang; Bericht docs/simulation/a02-t0118-finance-source-map-bericht.md, SHA-256 D850E678B118CBB85A6714592861DA31920ECF62BAD47DC134316A2235FBDA0F. Runtimelücken und 2019-Start ohne Finance-State an T-0119 übergeben. CP-0532. |
| T-0119 | MG-002 / SLG-002.2 / SLG-002.5 | Finanz-Runtime/API und Startprofil-Integration | A01 koordiniert; A03 Finance; A04 Persistenz; A09 QA; A05 UI | IN_PROGRESS — T-0125/T-0126 sind als abgegrenzte Dispo-Runtime-/UI-Slices implementiert und A03/A09 statisch PASS reviewed; T-0123 Restoreguard statisch PASS, Verhaltenstest offen. Weitere Lücken: Payroll/Steuern/Material/AP-GL-Vollintegration, Dispozinsnominalsatz und belastbare Quartalsbilanzquelle; SV-Endparameter/Personaldaten PENDING. CP-0541.
| T-0120 | MG-002 / SLG-002.2 / T-0119 / T-0077 | Dispo-Kapitalereignisse aus bestätigten Regeln | A03 – ACCOUNTING_FINANCE; A01 koordiniert; A09 danach; A05 UI | IN_PROGRESS — Manueller exakt bezifferter Draw im belegten 1.000-€-Startlimit sowie Kundeneingang-first Rückführung einschließlich Same-Day-Paarung, stabile IDs/Fingerprints und UI-Fälligkeitsschutz: A03/A09 statisch PASS. Offen bleiben Verhaltenstest und die vollständige Quartalslimit-/Zinsumsetzung: D-0177-Mechanik ist festgelegt, aber Zinssatz und belegte Quartalsbilanzbasis fehlen; nichts fingiert. CP-0541.
| T-0121 | MG-002 / SLG-002.2 / T-0119 | A04 Save-/Restore-Review der V3-Finanzzustände | A04 – DATABASE; read-only, A01 koordiniert | COMPLETED — Review NONPASS: Restore erzwingt D-0180 Opening-Bank=Eigenkapital nicht erneut; verändertes Opening kann als neue konsistente Basis akzeptiert werden. T-0123 Follow-up A03; danach A09. CP-0539.
| T-0122 | MG-002 / SLG-002.2 / T-0069 G3 / T-0074 | A02-Abgleich der Jahreswirtschaftlichkeit mit Finanzübergaben | A02 – SIMULATION; read-only, A01 koordiniert; A03 danach | COMPLETED — 12-Monats-Auftrags-/Produkt-/Mengenflüsse belegt, keine Jahresfinanzreconciliation. A02→A03 Event-Handoff konkretisiert; keine erfundenen Kosten/Buchungen. CP-0539.
| T-0123 | MG-002 / SLG-002.2 / T-0119 / T-0077 | D-0180 Opening-Integritätsguard in Save/Restore | A03 – ACCOUNTING_FINANCE; A04 konsultiert; A09 danach | IN_PROGRESS — D-0180-Openingguard A03/A09 statisch PASS; kein ausgeführter Tamper-/Replay-/Restore-Verhaltenstest. CP-0541.
| T-0124 | MG-002 / SLG-002.2 / T-0069 G3/G5 / T-0074 | T-0075-Quellhash-Drift prüfen | A02; A09 unabhängig reviewen | COMPLETED — Hashunterschied 2FEA2D… vs. aktuell 2812A2… ist nicht durch Zeilenenden erklärt. CP-0524 notiert den neuen Hash, bindet ihn aber nicht ausdrücklich an Harnesspfad/Kommando und alle ursprünglichen Assertions. T-0075 historischer Beleg bis zu neuem sicheren Smoke nicht als aktuell bestätigt führen. CP-0540.
| T-0125 | MG-002 / SLG-002.2 / T-0119 / T-0077 | Dispo-Rückzahlungsintegrität und Same-Day-Reconciliation korrigieren | A03 – ACCOUNTING_FINANCE; A09 danach | COMPLETED — Kundeneingang/Rückzahlung kausal gepaart; exakte Rückzahlung, eindeutige IDs/Quellen, Receipt-Persistenzfingerprint und Tamper-/Orphan-Prüfung ergänzt; A09 unabhängiger statischer PASS. Kein Verhaltens-/Regressionstest in diesem Slice. CP-0541.
| T-0126 | MG-002 / SLG-002.2 / T-0119 / T-0077 | Manuelle Dispoauswahl in der Zahlungsoberfläche | A05 – FRONTEND; A03 Fachreview/A09 danach | COMPLETED — UI zeigt Fehlbetrag/verfügbaren Rahmen, verlangt explizite Wahl und sperrt Zahlung/Draw vor Fälligkeit; A03-Fachreview und A09 statischer PASS. Scoped `git diff --check` PASS; kein Browser-/Verhaltenstest. CP-0541.


**Fortschreibung CP-0474 (2026-11-01):** A01 führte 34 gezielte Regressionen zu T-0063/65/66/67/69 sowie T-0064/68-Anschlussmodulen aus. Fehler im T-0069 Ein-Auftrags-Jahresfixture (fehlende Lagerumrechnung/Platz) sind korrigiert; der 362-Tage-Auftragspfad besteht zweimal mit identischem State-/Restore-Hash. `run.html` wurde über den offiziellen Graphbuilder auf den aktuellen 25-Modul-Graph gebracht; zwei UI-Cache-Regressionen bestehen danach. Der aktuelle Vierprofil-Jahres-Rerun wurde wegen auffällig langer Laufzeit ohne Ergebnis kontrolliert abgebrochen. T-0066 G1–G6-Regressionen und die in CP-0473 dokumentierten A03/A09 G7–G10-Reviews bestehen; visueller Browser-Smoke fehlt weiterhin. T-0063, T-0065, T-0066, T-0067 und T-0069 bleiben IN_PROGRESS; Gesamtjahres-/Finanzreconciliation und vollständige Unternehmenswirkungen bleiben offen. Details: [CP-0474](checkpoints/CP-0474.md), [A01-Bericht](a01-v3-open-tickets-progress-cp0474.md). Kein Commit/Push.

**Fortschreibung CP-0448 (2026-11-01):** T-0063-Mindestmatrix im A01-V3-Plan präzisiert; A03-Re-Review PASS, A09 bestätigt Messbarkeit mit Vorbehalten. PASS gilt erst, wenn Projektions- und Unternehmensgate je Kanal bestehen; MRO bleibt bis A03-Methodenfreigabe NONPASS. Keine Runtimewirkung implementiert. T-0066: A02 D-0141/D-0149-Planwirkung und isolierte Kontrollpaare umgesetzt; A03/A09-Re-Review ausstehend; gemeinsame Kunden-/Produkt-Fertigwarenkapazität und Zeit-/Kostensatzbelege bleiben offen/pending. T-0067 Preis-/Snapshot-Bindung von A03 PASS; A05 UI Regression PASS. A01-Browserlauf: alle 8 Reiter sichtbar, 390×844 und 820×1180 ohne Dokumentüberlauf, Nav scrollt zu allen Bereichen, keine Browserfehler; run.html Cachegraph an 24 Module gebunden. T-0069 Jahreslauf/Performance NONPASS: 1.448 Vollvalidierungen im 362-Tage-Lauf, kein Jahres-PASS. Alle Tickets IN_PROGRESS, kein Commit/Push. Details: [CP-0448](checkpoints/CP-0448.md).

**Fortschreibung CP-0447 (2026-11-01):** A02 hat D-0141/D-0149 auf V3-Produktplanung angewandt; drei Kontrollpaare und Tageskapazität bestehen laut Agent, unabhängige A03/A09-Review folgt. Shared-Run mit zwei Produkten + Kundenauftrag teilt Personal/Maschine/Material und stimmt Stahlmengen ab; gemeinsames Kunden-Fertigwarenlager fehlt (T-0066 NONPASS). A03 bestätigte T-0067 Preis-/Snapshotbindung als Teilgate PASS; A05 UI-/Pflichtfeldtests PASS, Browser-/Viewport und run.html-Cachegraph offen. A08-Matrix für T-0063 ist A03-seitig integrierbar; A09 bestätigt Projektionschecks, jedoch überwiegend PARTIAL für reale Firmenwirkung; A01 hat die reviewed Mindestgates in den V3-Arbeitsplan integriert: pro Kanal echte Firmenvariable/Spielhandlung, Quelle oder synthetische ID, Exposure, Lag/Periode, Null-/Wirkungsfall, Replay/Restore, Dedupe und A03/A09-Grenze. A03/A09-Re-Review der integrierten Matrix folgt; danach A02-Wirkungsslice. T-0069-Volljahr/Performance bleibt offen. T-0063 bleibt IN_PROGRESS. Verbindliche Abarbeitungsbasis ist die T-0063-Matrix in [A01-V3-Arbeitsplan](a01-v3-ticket-ausarbeitungsplan.md): beide Gates müssen für jeden Kanal bestehen; offene A03-Gates bedeuten NONPASS. A09-Zweitreview fand Dokumentationslücke im kombinierten PASS-Satz/Ticketverweis; A01 ergänzt diese. MRO-Berechnung und echte Laufzeitwirkungen stehen aus. T-0065/T-0066/T-0067/T-0069 bleiben IN_PROGRESS; kein Commit/Push. Details: [CP-0447](checkpoints/CP-0447.md).

**Fortschreibung CP-0446 (2026-11-01):** T-0067-Angebotskalkulation zum tatsächlichen Angebotspreis und Snapshot-Bindung sind von A03 begrenzt PASS re-reviewed. A05 hat Preisvorschau, Plan-/Angebots-DB-I-Trennung und Pflichtfeld-/JSON-Regressionen umgesetzt; zielgerichtete Tests PASS, Produktformular-Browser-/Viewportnachweis und run.html-Cachegraph fehlen. A02 hat einen Shared-Run-Fall mit zwei Produkten plus Kundenauftrag über Personal/Maschine/Material, exakter Materialreconciliation und Pending-Istkosten ergänzt; gemeinsame FG-Lagerkapazität fehlt weiterhin. V2-Control-Pairs bestehen, ihre Anwendung im V3-Produktplaner fehlt. A08 lieferte eine T-0063-Mindestmatrix; A03 stuft sie mit Gates integrierbar ein. A09 bestätigte die Projektionstests, aber die Firmenwirkung bleibt überwiegend PARTIAL/NONPASS; echte operative Variablen/Spielaktionen, Lagtests je Kanal, EZB/MRO-Abgrenzung und Dedupe sind nachzuziehen. A09 diagnostizierte 1.448 Vollvalidierungen für 362 Smoke-Tage; keine Laufzeitmessung/Jahresfreigabe. T-0063/T-0065/T-0066/T-0067/T-0069 bleiben IN_PROGRESS. Kein Commit/Push. Details: [CP-0446](checkpoints/CP-0446.md).

**Fortschreibung CP-0445 (2026-11-01):** A03/A05/A09 bestätigten begrenzte PASS-Pfade; die T-0066/T-0067-Mindestziele bleiben wegen gemeinsamem Zwei-Produkte+Kundenauftrag-Lauf, Kontrollpaaren/Leistungswirkung, Zeit-/Kostenprovenienz sowie Pflichtfeld-/Produktformular-Responsive-Nachweis NONPASS. A02 hat Angebotspreis und Angebots-Snapshot neu gebunden; gezielte Regressionen bestanden. A05 hat Plan-/Angebots-DB-I, Pflichtfeld-/JSON-Regression und Snapshot-Refresh integriert (gezielte Tests PASS); Browser-/Viewport-E2E sowie Cachegraph-Aktualisierung fehlen. A03-Preisreview PASS; A09-Re-Review folgt nach A02-Slice. A09 identifizierte 1.448 Vollvalidierungen je 362-Tage-Smoke und plausible verschachtelte Hotspots; Messprofil/Jahres-PASS fehlen. A08 bewertet T-0063: Nachfragewirkung begrenzt PASS, Außenwirtschaft/Inflation PARTIAL, EZB-/Politik-Firmenwirkung nicht nachgewiesen; das Gesamt-Minimalziel ist nicht messbar genug. T-0063/T-0065/T-0066/T-0067/T-0069 bleiben IN_PROGRESS. Die vom Nutzer bestätigte Preflight-/Kurzberichtoptimierung ist in AGENTS.md, Agentenstruktur und Rechtematrix eingetragen; CP-gebundener Hash-Digest und bedarfsbezogene Re-Reads gelten ab jetzt. Kein Commit/Push. Details: [CP-0445](checkpoints/CP-0445.md).

**Fortschreibung CP-0444 (2026-11-01):** T-0066/T-0067-Fortschritt ist in [CP-0444](checkpoints/CP-0444.md) aktualisiert. Der Shared-Run führt ein Eigenproduktangebot vom dynamischen BAB-Snapshot bis zur Käuferannahme; Bestand geht auf 0, Finanzwerte bleiben mangels A03-Freigabe unverändert. Der Browser fand einen Nullbestands-Renderfehler; der Guard ist korrigiert und regressionsabgedeckt. Snapshot-Freeze, Run-Event-Bindung, Replay und Tamper-Regression bestehen. Alle acht Reiter wurden nach dem Browserabsatzpfad geprüft. Unabhängige A03-/A09-Reviews und Jahres-/Gesamtgate fehlen. Ein UPSWING-Jahressmoke wurde nach 120 Sekunden ohne Ausgabe abgebrochen; kein Jahres-PASS. T-0063/T-0065/T-0066/T-0067/T-0069 bleiben `IN_PROGRESS`; kein Commit/Push.

**Fortschreibung CP-0440 (2026-11-01):** Browser-Smoke zeigt zwei ausdrücklich kalkulierte Produktfälle (DB I +350,00 € / nach BAB +340,00 €; DB I −50,00 € / nach BAB −70,00 €) und tatsächliche Fertigwarenzugänge +2 bzw. +1 Stück ohne Erlös-/COGS-/Buchungswirkung. Die UI nennt nun die notwendige Reihenfolge der Produkteingabe; passende Regression besteht, interaktiver Retest dieses Hinweises steht aus. Produkt-, Finanz-, Markt-, Makro- und Betriebswirkungsregressionen PASS. Käuferannahme/Produktabsatz, dynamischer BAB-Adapter im Produktpfad, Restore/Adversarial-Review und A03/A09-Re-Reviews fehlen. Ein UPSWING-Jahres-Smoke endete nach ca. 120 Sekunden nicht und wurde abgebrochen; damit kein Jahres-PASS. T-0063/T-0065/T-0066/T-0067/T-0069 bleiben IN_PROGRESS. CP-0440 dokumentiert Evidenz und Folgearbeit; kein Commit/Push.





**Fortschreibung CP-0439 (2026-11-01):** Produktlebenszyklus-, Finanzkalkulations-, FinanceRuntime- und Shared-Run-Orchestrator-Regressionen liefen PASS unter Node v24.22.1. Sie belegen nur vorhandene Teilmechaniken; Eigenprodukt-UI, zwei vollständige Produktläufe, Käuferabnahme-gebundener Fertigwarenabgang und integrierte T-0066/T-0067-Reconciliation fehlen. Daher sind die Minimalziele nicht erreicht, T-0066/T-0067 bleiben IN_PROGRESS. Kein unabhängiger A09- oder Browser-/Jahres-/Ledger-PASS. [CP-0439](checkpoints/CP-0439.md), [Regressionbericht](../simulation/a01-t0066-t0067-minimum-baseline-regression-bericht-cp0439.md).

**Vorheriger Stand CP-0438 (2026-11-01):** A03-Rollenreview durch A01 erteilt CONDITIONAL PASS für die T-0066/T-0067-Mindestzieldefinition im nichtbuchenden Umfang. Plan-DB ist nicht Istgewinn; unbelegte Bewertung/COGS bleibt pending; BAB verteilt, erzeugt keine Kosten. Diese Prüfung war keine unabhängige Zweitprüfung und keine Runtimefreigabe. Nächster Schritt: A02-Produktabsatz/Mengenabgang an belegten Marktauftrag binden, danach A03-Re-Review, A05-UI und A09. [CP-0438](checkpoints/CP-0438.md), [A03-Review](../accounting/a03-t0066-t0067-mindestziel-review-cp0438.md).

**Vorheriger Stand CP-0437 (2026-11-01):** Der Nutzer beauftragt die Abarbeitung aller offenen Tickets mindestens bis zum messbaren Minimalziel. A01 hat für T-0066 und T-0067 konkrete Review-Gates festgelegt: zwei Eigenproduktpfade mit Kapazitäts-/Mengenreconciliation, drei explizite Kalkulationseingaben, positive/centnahe/negative DB-Fälle, centgenauer BAB und unveränderliche Plan-/Ist-Snapshots. Fehlende Bewertung/Kosten bleiben pending; keine erfundenen Werte oder Buchungen. Produkt-UI und Absatz-/COGS-Brücke fehlen weiter. Nächster Schritt ist A03-Fachprüfung, danach A02-Implementierung und Reviews. [CP-0437](checkpoints/CP-0437.md), [Mindestziele T-0066/T-0067](a01-t0066-t0067-mindestziele.md).

**Vorheriger Stand CP-0436 (2026-11-01):** CP-0435 weist keine operative Materialbestellung nach; die ETA-Idee bleibt bis zu einem echten Beschaffungszustand NONREADY. Der vorhandene, nichtbuchende D-0169-Pfad getV3RunOperatingImpact() liefert dagegen pro Woche Anfragen, Awards, Planstunden und deklarierte Personalkapazität, ist aber noch nicht in der Shared-Run-Oberfläche sichtbar. A01 hat den A05-UI-Handoff vorbereitet; Abwesenheiten und Maschinenengpässe müssen als ausgeschlossene Kapazitätsfaktoren gekennzeichnet bleiben. Der Auftrag ist noch nicht an A05 ausgeführt/übernommen. Danach sind A09-Review und A01-Browser-Smoke vorgesehen. T-0063/T-0069 sowie Jahres-/Ledger-/Releasegates bleiben offen; kein Commit/Push. [CP-0435](checkpoints/CP-0435.md), [CP-0436](checkpoints/CP-0436.md), [A05-Handoff](a01-t0063-operating-impact-ui-handoff.md).

**Vorheriger Stand CP-0434 (2026-11-01):** Nach dem abgeschlossenen Destatis-Referenzslice hat A08 einen nächsten kleinen Kandidaten vorgeschlagen: eine ausdrücklich synthetische, nichtbuchende ETA-Projektion für reale offene V3-Materialbestellungen. Der Makro-ETA-Projektor besteht, aber die gemeinsame Run-/T-0066-Bestellreferenz ist noch nachzuweisen. Destatis-Importpreise belegen keinen Lieferzeitkoeffizienten und werden nicht als Verzögerungsursache verwendet; automatischer L4-Pass-through bleibt durch A03 CP-0426 ausgeschlossen. A01 überführt A08s Empfehlung in einen A02-READ/PROPOSE-Handoff, dann A03-Fachreview vor Implementierung; bei fehlender echter Bestellreferenz wird kein künstlicher Prozess ergänzt und der bestehende Betriebswirkungspfad geprüft. CP-0433 hält den letzten Browserbeleg fest. T-0063/T-0065/T-0066/T-0067/T-0069 und Jahres-/Releasegates bleiben offen; kein Commit/Push. [CP-0433](checkpoints/CP-0433.md), [CP-0434](checkpoints/CP-0434.md), [A01-Entscheidungsvorlage](a01-t0063-naechster-slice-eta-entscheidungsvorlage.md).

**V3-Ausarbeitung/Review:** Die verbindliche Reihenfolge für T-0063 bis T-0069, Phasen-Gates und Reviewkriterien stehen im [A01-V3-Arbeitsplan](a01-v3-ticket-ausarbeitungsplan.md). T-0063 ist mit A09-Gesamt-PASS in CP-0501 abgeschlossen; T-0064 und T-0068 sind ebenfalls abgeschlossen. T-0065/T-0066/T-0067/T-0069 bleiben offen. Ältere Fortschreibungen darunter sind historische Momentaufnahmen; der aktive Ticketstatus steht in der Tabelle und den neuesten datierten Nachträgen.

**Aktueller Stand / CP-0352 (Entwurf):** A09 hat Markt-/Makro-Restore, Kundenprozessprojektion und den JSON-Save/Restore-Ein-Auftrags-Smoke im dokumentierten begrenzten Code-/Stateumfang PASS geprüft (CP-0335/0337). A11s erneute Integrationsanalyse bestätigt den gemeinsamen Run und einen kontrollierten Auftrag bis Zahlung, jedoch keine integrierte Unternehmensbuchführung/Jahreswirtschaft. A03s Evidenzvertrag für Istkosten/BAB/Bestand/COGS und die Klarstellungen aus CP-0344 bleiben PASS; A08s institutionelle Zeitreihen sind Kontext, keine firmenspezifische Kalibrierung. A02 schloss D-0169 unter CP-0350; A03 bestätigte die Finanz-Nichtbuchung unter CP-0348 und A09 bestand unter CP-0352 das unabhängige D-0169-Provenienz-/Save-/Restore-Re-Review gegen beide CP-0349-Mutationen. Der D-0169-Teil ist im dokumentierten begrenzten Scope PASS. A08 CP-0351 weist weiterhin fehlende spielbare Unternehmenswirkungen für Konjunkturphasen, Außenwirtschaft, EZB, Politikfelder und Inflation aus; T-0063 bleibt deshalb insgesamt offen. A12 hat keinen aktuellen Browser-/Viewport-/Gerätetest ausgeführt. Jahres-/Ledger-/Lagerabgleich und Gesamtjahresprüfung fehlen; T-0063, T-0065, T-0066, T-0067 und T-0069 bleiben IN_PROGRESS.

**Fortschreibung CP-0353:** A02 hat A08 CP-0351s Makro-Unternehmenswirkungslücken in einen dokumentarischen Vertrag übersetzt. Er umfasst Konjunktur/Auslastung, FX/Außenwirtschaft, neue EZB/MRO-Finanzierungsofferte, acht Politikfelder sowie Inflation→Betriebskosten-/Lohn-/Beschaffungsindizes; für jeden Pfad werden Quelle oder synthetische Annahme, Richtung, Lag, Grenzen, Replay/Restore und Doppelzählungsschutz festgelegt. Keine Runtimeänderung, und vorgeschlagene Testwerte sind noch nicht freigegeben. A03 prüft den Vertrag read-only unter CP-0354; A01 setzt danach kleine Code-/UI-Lose auf. T-0063 bleibt IN_PROGRESS.

**Fortschreibung CP-0354:** A03s Fachreview des A02-Wirkungsvertrags besteht für L0/L1/L3/L6 unter Nichtbuchungs-/Plan-Ist-Bedingungen, aber noch nicht für Umsetzungsreife in L2 (FX/Bestellung/Wareneingang), L4 (Business-Cost-Index-Basis/Einheiten/Gewichte/Rundung/Dedupe) und L5 (unverbindliche MRO-Offerte vs. Kreditvertrag). A02 erstellt unter CP-0355 dokumentarische Klarstellungen; A03 prüft sie vor Runtimearbeit erneut. Keine Buchungs- oder Finanzfreigabe.

**Fortschreibung CP-0356:** A03 hat die Repository-Klarstellungen zu L2/L4/L5 als Dokumentengates PASS nachgeprüft. Das ist keine Kredit-, Kosten-, Posting- oder Runtimefreigabe. A02 arbeitet nun L0/L1 als nichtbuchende V3-Plan-/Kapazitätskette; Phasen ändern dabei keine Kapazität, Personal, Verträge, Preise oder Finanzsalden. A03-/A09-Reviews folgen. T-0063 bleibt IN_PROGRESS.

**Fortschreibung CP-0357:** A02 hat L0/L1 als reproduzierbare, nichtbuchende Projektion implementiert: Anfragen → echte Spieler-Awards → geplante Stunden → deklarierte Personalkapazität × fünf Werktage → Auslastung. Die vier Phasenlücken sind synthetisch; D-0169 bleibt einziger Gesamtanfragefaktor. Gezielte Regressionen und UPSWING-Jahressmoke bestanden; der komplette Vierpfad-Smoke wurde abgebrochen, Produktlebenszyklustest wegen fehlender Stagingabhängigkeit nicht ausgeführt. A03-Fachre-Review und A09-Adversarialreview laufen. Abwesenheiten/Maschinenengpässe sind noch nicht in dieser Kapazitätskennzahl enthalten. T-0063 bleibt IN_PROGRESS.

**Fortschreibung CP-0358/CP-0359:** A03 und A09 reproduzierten unabhängig ein NONPASS: Ein 8-Stunden-Samstags-Commitment (09.01.2027) wird in die 40-Stunden-Werktagskapazität eingerechnet. A02 korrigiert Initial-/Restorevalidierung unter CP-0360; erneute A03-/A09-Prüfung folgt. Übrige L0-Finanz-/D-0169-Gates bestanden im Umfang des Reviews.

**Fortschreibung CP-0360:** A02 hat den Wochenend-Commitment-Fehler in Initialisierung, Shared-Run-Validierung, Save/Restore und Stundenprojektion behoben. Samstag/Sonntag werden abgewiesen; Freitag wird gezählt. Gezielte Regressionen bestehen. A03-/A09-Re-Reviews unter CP-0361/0362 sind ausstehend; T-0063 L1 bleibt bis dahin nicht abgeschlossen.

**Fortschreibung CP-0361/CP-0362:** A03 und A09 haben den Wochenendfix unabhängig bestanden. Samstag/Sonntag werden bei Initialisierung, Save-Envelope und Restore fail-closed abgewiesen; Freitag bleibt zulässig. Mutierte Wochenendbelegungen in Verpflichtungen, Produkt-/Kunden-Zuweisungen, Kundenoperationen und Schedule-Events werden verworfen. L0/L1 ist im begrenzten nichtbuchenden Projektionsumfang PASS. Abwesenheiten, Maschinenengpässe, vollständige Jahres-/UI-Integration bleiben offen; T-0063 bleibt IN_PROGRESS.

**Nächste Arbeit / CP-0363:** A02 implementiert jetzt die nichtbuchenden L3/L6-Planwirkungen für sieben nicht-monetäre Politikkanäle. Geldpolitik/MRO bleibt in der getrennten L5-Quote; L2/L4/L5-Runtime werden nicht verändert. A03- und A09-Reviews folgen; UI-Integration kommt erst danach.

**Fortschreibung CP-0363:** A02s `macroPolicyImpact` enthält sieben nicht-monetäre Politikkanäle als Plan-/Chancen-/Ressourcenindikatoren. Ohne explizite numerische Exposition und passenden Scope/Adoption ist der Beitrag neutral; die aktive Fixture ist daher derzeit neutral und noch nicht als spielbare Unternehmenswirkung aktiviert. Makro-, Policy-, Replay/Restore- und Finance-Nichtmutationsregressionen PASS. A03-/A09-Reviews CP-0364/0365 ausstehend; UI-Integration und L2/L4/L5-Runtime bleiben offen.

**Fortschreibung CP-0364/CP-0365:** A03 bestand die L3/L6-Finanz-Nichtbuchungsgrenze. A09 fand aber zwei Runtime-/Restorelücken: Scope-Referenzen werden nicht strikt typisiert; ein koordiniert geändertes Policy-Event plus alle gespeicherten Historienkopien kann eine +2-Planwirkung auslösen, obwohl der Day-open-Input unverändert ist. A02 bearbeitet den Fix unter CP-0366. Aktive Fixture bleibt neutral; unabhängiger Re-Review folgt. Kein Spiel-/Release-PASS.

**Fortschreibung CP-0332:** A02 hat den Operationsstatus `ready_for_delivery` als absichtlichen T-0066-Planstatus abgegrenzt; Kundenfortschritt liegt in separater Evidence-/Finanzprojektion. A03-Fachreview des T-0069-Jahressmokes PASS im begrenzten D-0166-/D-0168-Scope; keine Ledger- oder Gesamtjahresfreigabe. A01-Rerun des Ein-Auftrags-Smokes PASS mit demselben Hash. A05 behob den A09-Befund zur fehlenden Makromodulpräsenz; A09-Re-Review PASS ist in CP-0335 dokumentiert. A02s Statussemantik-Nachweis ist in CP-0332 gesichert; der parallele CP-0329-Write blieb bei A05s Makrofix.

**Fortschreibung CP-0333:** A05 verlangt nun Makromodulpräsenz für V3-Run-IDs und bindet Modulversion/Snapshot an den ausgewählten Pfad. Die separate Kundenprozessanzeige projiziert Plan-, Kunden-Evidence-, Rechnungs- und Zahlungsstatus ohne Mutation der Arbeitsplan-/Handoffdaten. A01 und A09 haben Makrofixture-, Orchestrator- und Run-UI-Regressionen ausgeführt (PASS). A09-Code-/State-Review PASS in CP-0335; A12 Browser-/Gerätetest ist mangels Checkoutzugriff nicht erfolgt. T-0063 und T-0069 bleiben IN_PROGRESS.

**Fortschreibung CP-0334:** A09 hat den A02-Auftragsjahressmoke zweimal mit identischem Hash geprüft: 362 Tage, zwölf Makromonate, ein kontrollierter Auftrag, eine D-0166-Rechnung und ein D-0168-Eingang am 19.01.2027; UPSWING-Baseline PASS. Review-PASS ist auf diesen Pfad beschränkt. A09 markiert Save/Restore-Inhaltsgleichheit als noch nicht belegt; A02 ergänzt die Assertion. A09 hat die aktuelle A05-UI nicht reviewt; keine Browser-/Geräteabnahme.

**Fortschreibung CP-0336:** A09 bestätigte vollständige State-/Finance-Hashes nach Restore; der unabhängige JSON.stringify/parse-Probelauf bestand. A02 hat die JSON-Serialisierung dauerhaft im Harness ergänzt und A09-Re-Review PASS in CP-0337 erhalten. A12-Playtest war durch Agenten-Checkout `Permission denied` nicht möglich; kein Produktfehler daraus abgeleitet.

**Fortschreibung CP-0335:** A09-Re-Review PASS für A05s Makromodulpflicht/Pfadbindung und Kundenprozessprojektion. Fehlendes Makromodul sowie vorherige Profil-/Pfadmutationen werden an Save/Restore/Tagesstart abgewiesen; gültiger BOOM-Save/Restore/Fortsetzung bis Februar bleibt BOOM. UI-Projektion liest vorhandene Evidence-/Financebelege und verändert weder Run, Plan, Handoff noch Finanzzustand. Browser-/Gerätetest weiterhin bei A12; A02 ergänzt noch stärkere Restore-Inhaltsassertionen im Jahressmoke.


### T-0069 – V3-12 Integration, Jahresgate und unabhängige Qualitätssicherung

Status: IN_PROGRESS (begrenzter Ein-Auftrags- und JSON-Restore-Smoke A09 PASS; A03-Evidenzvertrag/Review ist dokumentarisch PASS, nichtbuchend. Makrotransmission nach D-0169 wird in A02 CP-0343 implementiert und anschließend fachlich/QA-reviewed. Vollständige Ist-BAB-/Bestands-/COGS-/Ledger-/Cashreconciliation, mehrere wirtschaftliche Jahresfälle und aktueller Browser-/Mobilbeleg bleiben offen.)

Fortschreibung CP-0320: Vereinfachte D-0166-Szenariorechnung und D-0168-Kundenzahlung am exakten Fälligkeitstag sind im A05-Tageslauf integriert; A09-Automatikreview PASS, A02/A03/A05-Regressionen PASS. Vier 12-Monats-Konjunktur-Smokes mit 362 Tagen/12 Monatsständen und identischem Same-Seed-Replay PASS, aber ohne angenommene Kundenaufträge, FinanceState, Cash-/Ledger-/Bestandsreconciliation. Browser-/Gerätetest der neuen Zahlungssicht weiterhin offen. T-0069 bleibt IN_PROGRESS.

Fortschreibung CP-0323: A05-Handoff-Statusanzeige wird aus separat belegten Run-, Invoice- und Payment-Ereignissen projiziert; A02-Handoff/validierter Runstate bleibt unverändert `pending_non_posting`. A01-Browserlauf bestätigt den kompletten Ein-Auftrags-Pfad bis Zahlung am Rechnungstermin 2027-01-27 im 390×844-Viewport. Vollständiges Hauptbuch, Lieferanten-/Bestands-/COGS-Buchungen und echter 12-Monats-Lauf mit Aufträgen fehlen weiterhin; T-0069 bleibt IN_PROGRESS.

Fortschreibung CP-0299: Status bleibt IN_PROGRESS. A03-BAB-Fachreview, A09-Snapshot-Adversarialreview und A01-IAB-Smoke inkl. mobiler Statushinweis-Nachkorrektur bestehen. A05-UI ist mit Marktangeboten verbunden; dynamischer Plan-/Ist-Kostenfluss aus T-0066 und unternehmensperiodische Cash-/Ledgerwirkung bleiben Integrationsgates. Keine Postingfreigabe. A09-Test zur Auftragskette ist wegen Agent-Workspace-Zugriff nicht ausgeführt; A02 prüft/implementiert getrennt die D-0147-Lernlaufzeit. A03/BAB-UI und A09 Snapshotkonsistenz-Gates sind PASS; A01-Mobiler IAB-Smoke bei 390×844 ohne horizontalen Überlauf, gespeicherte BAB-Aufschlüsselung lesbar, ungültige weights-Eingabe fail-closed. A02 bestätigte die vorhandene Kette gewonnener Auftrag → expliziter T-0066-Plan → manuelle Operationen → ready_for_delivery/performance_pending. A03 korrigierte den veralteten Workplan-Handoff-Satz in der Finanzmatrix. A09 unabhängiger Operationsreview war wegen Checkout-Zugriffsfehler nicht ausführbar und bleibt offen. Weiter offen: Lieferungs-/Empfängerabnahme-, A03-Finanz-/Invoice-/Cash-/Ledger-Integration, Lernlaufzeit, wirtschaftliche Jahresreconciliation und Gesamt-QA. Keine Postingfreigabe.
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A09 – QA; Mitwirkung A02, A03, A12
Priorität: HIGH
Bezug: V3-01–V3-21; insbesondere V3-12; D-0159; CP-0274/CP-0275
Abhängigkeiten: T-0063 bis T-0068 müssen ihre integrierbaren Ergebnisse und Szenarioverträge bereitstellen.

Aufgabe: V3-End-to-End-Abnahme über die Makro-, Gründungs-, Markt-, Kalkulations-, Produkt- und Lernabläufe organisieren. Vier feste Konjunkturphasen-Szenarien jeweils mindestens zwölf Simulationsmonate reproduzierbar ausführen; mindestens einen tragfähigen und einen wirtschaftlich scheiternden Verlauf erklären. Browserpfade mobil prüfen. Keine neuen Fachannahmen oder Produktregeln hinzufügen.

Fortschreibung CP-0293: Vier synthetische Makro-/Shared-Run-Smokes vom 04.01. bis 31.12.2027 und identischer Upswing-Replay bestehen deterministisch. Die Jahres-Fixtures enthalten keine angenommenen Kundenaufträge; Cash-/Ledger-Reconciliation ist nicht unterstützt. Dies schließt weder den wirtschaftlichen Jahresgate noch den Ticketumfang ab. Die unabhängigen A03/A09-Reviews, Geschäftsprozess-/Finanzintegration und Browser-/Mobilprüfung bleiben offen.

Abnahme: Seed/Profil, Ereignisprotokoll, Cash-/Ledger-Abstimmung, Status und Ergebnisgründe sind für jeden Lauf dokumentiert; keine technische Ausnahme, ungültige Bestände oder nicht abgestimmte Buchungen. A09 prüft unabhängig; A12 dokumentiert Browser-Situationen. V2-Abnahme und D-0159 werden nicht wieder geöffnet. Antworten/Rückfragen gehen an A01.

### T-0068 – V3-Lernintegration, Fragen und Wirtschaftsereignisse

Status: COMPLETED (A07/A08/A09 Content-/Quellen-/Trace-Gates PASS; A06 50/50 Eventwirkungstrace inkl. klarer 18er-Feldregel, A07 18/18 plus EVT-008 separat PASS; V3-06-Lernobjekt mit terminalen Zweigen und A05 read-only Marktroute durch A03/A09 PASS. Runtime der 50 Fragen und D-0147-Laufzeitwirkungen wurden gemäß geklärter Ticketgrenze an T-0069 übergeben. Browser/Mobil/Jahreslauf dort offen)
Master Goal: MG-002
Second-Level Goals: SLG-002.3 / SLG-002.4
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A06 – IHK_LEARNING; Mitwirkung A07, A08, A09, A05
Priorität: HIGH
Bezug: V3-01 / V3-11; versionsübergreifende Fragen- und Ereignisziele; D-0159; CP-0274/CP-0275
Abhängigkeiten: Kompetenz-/Quellenzuordnung aus T-0063; V3-Spielkontexte aus T-0064 bis T-0067.

Aufgabe: V3-Kompetenzen den passenden Spielkontexten, Lernobjekten und überprüfbaren Lernergebnissen zuordnen. Für das Prüfungsfach Volks- und Betriebswirtschaft den vereinbarten Katalogumfang pflegen: je 20–30 reguläre Fragen in Grundwissen, Aufbauwissen und Transferwissen sowie 50 fachbezogene Multiple-Choice-Ereignisse mit begründeter Lern-/Entscheidungswirkung. Dieses Ticket liefert geprüfte Inhalte, Trace und eine optionale, schreibgeschützte Prozessroute für vorhandene V3-Marktreferenzen. Die Laufzeitauswahl/-beantwortung der 50 Ereignisfragen einschließlich des D-0147-Tageslimits und zulässiger Zustandswirkungen ist ausdrücklich T-0069-Integration, weil sie den gemeinsamen V3-Laufzustand voraussetzt. Tagesblockierende Ereignislogik bleibt V12-Spielvision und ist kein V3-Gate.

Abnahme: 100 % der V3-Kompetenzen besitzen mindestens einen Spiel-/Lernbezug; Fragen haben eindeutigen Lösungsschlüssel, fachliche Erklärung, plausible Ablenker, Schwierigkeits- und Quellen-/Kompetenzbezug. Textuelle Eventwirkungen sind plausibel begründet und unterscheiden sich klar von Modell-/Finanzwirkungen; keine unzulässige Finanzbuchung wird behauptet. A07 prüft Aufgaben/Schlüssel, A08 Quellen, A09 Vollständigkeit, Prozessroute und Nichtmutation. A09 bestätigt den separaten Runtimeharness später unter T-0069. Antworten/Rückfragen gehen an A01; bestehende V2-Fragenabnahme bleibt unangetastet.

### T-0067 – V3 aktive Kalkulation, Basis-BAB und Unternehmenskennzahlen

**Fortschreibung CP-0295 (ersetzt den vorstehenden Teilstatus):** A03 korrigierte `weights` auf gemeinsame physische `rateBasis` nach Vertrag 4.1.1; A05 zeigt nun die BAB-Aufschlüsselung und Cent-Reconciliation. A01-Regressionen PASS. A03-Fach-Re-Review, A09-Adversarial-Re-Review und Browser-/Mobiltest stehen noch aus.

**Fortschreibung CP-0296:** A03-Fach-Re-Review ist nun PASS; die gespeicherte BAB-Aufschlüsselung zeigt auch Kostenbasis-/Kostenstand-/BAB-Standkennungen und bleibt escaped/immutable. Offen bleiben A09 adversarial UI review und Browser-/Mobiltest.

**A09-Nachtrag:** Adversarial-Re-Review NONPASS wegen gekoppelter Mutation des Offer-Snapshots und seiner Eventkopie im lokal restaurierten Run. A02 bearbeitet die erreichbare Provenienz-/Konsistenzinvariante; danach A09 erneut prüfen. Browser-/Mobiltest wartet bis zum PASS.

**A02-Nachtrag:** Separate snapshotBinding bindet Offer an Modellversion/ID/Datum/Preis/Kosten- und BAB-Version; A02 regressionen weisen one-sided und paired mutation zurück. Das ist lokale Konsistenz, kein kryptografischer Schutz aller lokal veränderbaren Kopien. A09-Re-Review läuft; seine ältere Adversarial-Datei muss erst von `variableCost` auf das aktuelle BAB-UI-API umgestellt werden. Browser-/Mobiltest ausstehend.

**Fortschreibung CP-0297:** A09 hat nach Aktualisierung des stale UI-Regressionsaufrufs PASS für lokale Snapshot-Konsistenz erteilt. Doppelmutation beider Kopien wird abgewiesen; keine kryptografische Sicherheitsgarantie. A01-Browser-/Touchgate bleibt offen.

**Fortschreibung CP-0298:** A09 Snapshot-Adversarialreview PASS; A01-Browser-/Mobile-Smoke PASS im 390×844-IAB-Viewport (kein horizontaler Überlauf, BAB-Snapshot aufklappbar, ungültige weights-Eingabe abgewiesen, negativer Ergebnis-nach-BAB-Fall sichtbar). Cash-/Ledger-Jahreswirkung bleibt offen; Ticket bleibt bis zur integrierten T-0069-Abnahme IN_PROGRESS.

**Fortschreibung CP-0299:** Mobiler Live-Status-Fix von A05 und A01-IAB-Retest PASS; der Status steht bei 390×844 im normalen Dokumentfluss und verdeckt keine scrollbaren Inhalte. T-0067 bleibt wegen unvollständigem Ist-Kosten-/Perioden- und T-0066/T-0069-Finanzintegrationsgate IN_PROGRESS.

Status: IN_PROGRESS (D-0162 abgearbeitet; A03-Fachreview nach CP-0296 PASS; A09-Finance/UI-Re-Review PASS. A03 lieferte den nichtbuchenden Evidenzvertrag für Ist-BAB/Kosten und Bestand/COGS in CP-0341; A09-Dokumentenreview PASS (CP-0342), Klarstellungen nachgereicht und nachreviewt (CP-0344). Gewichte verlangen eine gemeinsame positive physische rateBasis und gleiche Empfängereinheiten/-periode; Details und Reconciliation sind in der gespeicherten BAB-Aufschlüsselung sichtbar. Offen bleiben Browser-/Mobilreview sowie ausführbare Ist-BAB/Kosten- und T-0066/T-0069-Integration; keine Schemafreigabe.)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A03 – ACCOUNTING_FINANCE; Mitwirkung A02, A05, Review A09
Priorität: HIGH
Bezug: V3-07 / V3-10 / V3-17; D-0159; CP-0274/CP-0275
Abhängigkeiten: Makro-/Finanzannahmen aus T-0063. Kostenvertrag ist eigenständig zu erstellen; Integration und Rechenfälle werden gemeinsam mit T-0065/T-0066 geprüft.

Aufgabe: Aktive Angebots- und Produktkalkulation sowie den dynamischen V3-Grund-BAB als lernbare und abstimmbare Spielabläufe ausarbeiten. Der Spieler gibt mindestens drei wesentliche Kalkulationsannahmen ein oder bestätigt sie. Grund-BAB-Eingaben umfassen primäre Kosten und Verteilungsschlüssel; Unternehmensausrichtungen und Kennzahlen machen Zielkonflikte sichtbar. V4 bleibt für den vollständigen WBQ-Rechnungswesen-Kreislauf, V8 für Mehrperiodenplanung und fortgeschrittenes Controlling zuständig.

Abnahme: Positive, knappe und negative Deckungsbeitragsfälle; alle Rechenschritte und Rundungen nachvollziehbar; BAB-Verrechnung stimmt exakt auf Ausgangskosten ab; Eingabeänderungen aktualisieren abhängige Werte. Ergebnis-, Cash- und Ledgerwirkung werden von A03 abgezeichnet. Keine neue Steuer-, Kredit- oder Buchungspolitik.

### T-0066 – V3 Produktivität, Kapazität und eigener Produktlebenszyklus

Status: IN_PROGRESS (A03 Finanzreview/Re-Review PASS und A09 Runtime-Re-Review PASS nach A02-Korrektur aller fünf Zeit-/Ablaufinvarianten. A03-Evidenzvertrag mit A09-Dokumenten-PASS und den Klarstellungen aus CP-0344 vorhanden; ausführbare Istkosten-/BAB-, Bewertungs- und COGS-Brücke ist nicht implementiert/freigegeben. Regressionen decken Wochenende, Cancel/Replan-ID, Abschlussdatum, Vorgängerchronologie und Fertigwarenfreigabe nach allen Prozessschritten ab. Gesamtticket offen für UI/Jahreslauf, Cash-/Bewertungs-/Absatzübergaben und T-0069.)
Master Goal: MG-002
Second-Level Goals: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A02 – SIMULATION; Mitwirkung A03, A05, Review A09
Priorität: HIGH
Bezug: V3-09 / V3-18; CP-0274/CP-0275
Abhängigkeiten: Kalkulationsvertrag aus T-0067; Nachfrage-/Marktvertrag aus T-0065.

Aufgabe: Produktivität und Kapazität in kontrollierbaren Szenarien abbilden und mindestens zwei eigene Produkte parallel durch Idee/Entwicklung, Produktionsdefinition, Stückkosten, Produktionsplanung, Fertigwarenbestand, Preis-/Vermarktungsentscheidung und Absatz führen. Zeit, Geld, Material und Kapazität konkurrieren mit laufenden Aufträgen. Grenzen zu V7 (Produktions-/Prozessmanagement), V9 (Logistik) und V10 (Marketinginstrumente) einhalten.

Abnahme: Skill, Motivation und Ausstattung haben isoliert nachvollziehbare Wirkungen; Überlastung und Qualifikationsgrenzen werden nicht umgangen. Erfolgreicher und unwirtschaftlicher Produktfall einschließlich Engpass/Bestand sind reproduzierbar; finanzielle Wirkungen sind mit T-0067 abgestimmt. Keine unbeabsichtigte Änderung der V2-Baseline.

### T-0065 – V3 Markt, Nachfrage, Wettbewerb und Angebotsentscheidung

Status: IN_PROGRESS (A02 Runtime, Preiswertung und A09-UI-Review PASS; CP-0322-Restore-Befund wurde durch Safe-Integer-Validierung und Regressionen behoben und von A09 unabhängig bestätigt. Marktpfad ist in T-0069 im begrenzten Ein-Auftragspfad bis D-0166-Rechnung/D-0168-Zahlung integriert. Öffentliche Daten belegen keine repräsentativen Münchner Einzelgebote. A02 prüft Makro-/Betriebswirkung als getrennten, transparenten V3-Kanal; mehrfache wirtschaftliche Jahresverläufe und deren Gesamt-Reconciliation bleiben offen.)
Master Goal: MG-002
Second-Level Goals: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A02 – SIMULATION; Mitwirkung A03, A05, Review A09
Priorität: HIGH
Bezug: V3-03–V3-08; CP-0274/CP-0275
Abhängigkeiten: Makro-/Konjunkturparameter aus T-0063; Gründungs-/Rechtsformpfade aus T-0064, soweit im Marktfall benötigt.

Aufgabe: Kundensegmente, Anfragen, Konkurrenzprofile, Preis-/Rufwirkung, Angebotsabgabe und zeitversetzte Zuschlagsentscheidung als nachvollziehbaren Spielkreislauf integrieren. Einzelne Konkurrenzgebote bleiben verborgen; ein Monatsbericht zeigt Durchschnittspreise nach mindestens drei Auftragsgrößen. Nach Zuschlag ist der vertraglich vereinbarte Preis unveränderlich.

Abnahme: Mindestens drei unterscheidbare Kundensegmente und drei Wettbewerberprofile; Anfrageverteilung hängt nachvollziehbar von Bedarf, Reputation, Preis und Unternehmenspassung ab. Testfälle decken Angebot, Annahme, Ablehnung, Verfall sowie positiven, knappen und negativen Deckungsbeitrag ab. Marktbericht lässt keine Einzelangebote erkennen. Finanzwerte stimmen mit T-0067 überein.

### T-0064 – V3 Gründung, Rechtsformen und Unternehmenszusammenschlüsse

Status: COMPLETED (A02-Runtime, A05-UI und Regressionen geliefert; A08-Rechtsreview, A09-Vertrags-QA, Runtime-Re-Review und UI-Statuschip-Nachreview PASS; A12-Desktop-Playtest PASS nach Behebung des Statuschip-Befunds. Gründungsphasen, Tragfähigkeitsentscheidung, GmbH-&-Co.-KG mit getrennten IDs/Registerständen, Kandidatensperren, Kooperation, Share-/Asset-Deal, bedingte §§613a/25-Prüfinputs und A03-Handoff ohne Buchung sind geprüft. Mobile-/Touchprüfung bleibt als T-0069-Releasestufe offen. AG/eG/GmbH & Co. KGaA sind weiterhin Kandidaten mit ausdrücklicher Vor-Release-Entscheidung.)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A08 – RESEARCH; Mitwirkung A02, A05; Rechtsquellenreview A09
Priorität: HIGH
Bezug: V3-19–V3-21; Rahmenplanpunkte 1.3/1.4; CP-0274/CP-0275
Abhängigkeiten: D-0163; Rechtsquellenmatrix nach aktuellem Rechtsstand. Die Startjahre 2019/2027 ändern den anzuwendenden Rechtsstand nicht (D-0161). GmbH & Co. KG ist für V3 spielbar vorzusehen. AG, eG und GmbH & Co. KGaA bleiben Kandidaten zur Zuordnung und benötigen eine ausdrückliche Auswahlentscheidung vor V3-Release (D-0163/D-0164). Kompetenzzuordnung wird mit T-0068 verbunden; Rechtsrahmenregister als V3-Liefergegenstand fortschreiben.

Aufgabe: Einen spielbaren Gründungsablauf sowie einen abgegrenzten, quellengeprüften Katalog der im Spiel unterstützten Rechtsformen, zulässigen Kombinationen und relevanten Unternehmenszusammenschlüsse erstellen. Für jede angebotene Rechtsform/Kombination sind Voraussetzungen, Haftung, Geschäftsführung, Vertretung, Kapital-/Gründungsanforderungen und Folgen nachvollziehbar. V3 bildet wirtschaftlichen Vergleich und Auswahl ab; V5 vertieft Recht und Steuern.

Abnahme: Kein unbelegter/unzulässiger Fall wird angeboten. Jede rechtliche Matrixzeile nennt konkrete Primärquelle, Paragraph, Rechtsstand und Prüfdatum. A08 vervollständigt die historische Erstprüfung aller im [Rechtsrahmenregister](../legal/legal-framework-register.md) erfassten D-IDs; die Auswirkungen bestätigter Abweichungen werden vor Release in allen betroffenen Dateien aktualisiert und durch A09 geprüft. Zusätzlich sind mindestens ein tragfähiger und ein nicht tragfähiger Gründungsfall sowie Kooperationsfälle (gemeinsamer Einkauf/Arbeitsgemeinschaft) und Konzentrationsfälle (Anteilserwerb/Unternehmenskauf) spielbar. Gesetzliche Verschmelzungen bleiben außerhalb V3. GmbH & Co. KG ist enthalten; AG, eG und GmbH & Co. KGaA bleiben bis zur ausdrücklichen Vor-Release-Entscheidung offene Kandidaten. Es wird keine vollständige Rechtsberatung oder pauschale Freigabe von Zusammenschlüssen behauptet. Fachfragen gehen an A01.

### T-0063 – V3 Makroökonomie, Konjunktur, Außenwirtschaft und Wirtschaftspolitik

Status: IN_PROGRESS (A05 Makro-/SPI-UI und früheres UI-Review PASS; A08 hat amtliche/institutionelle Aggregatreihen und deren Grenzen ergänzt; A11 bestätigt, dass zuvor kein Makro-Übertragungskanal bestand. A03 CP-0348 bestätigte die Finanz-Nichtbuchungsgrenze. A02 CP-0350 härtete Vorlagen↔Day-open-Fingerprint↔Market-Event, Exposure 1 und runId/scenarioId. A09 CP-0352 bestand das unabhängige D-0169-Provenienz-/Save-/Restore-Gate gegen den CP-0349-Mutationsrepro. Dieser begrenzte Teilumfang ist PASS. A08 CP-0351 listet noch fehlende spielbare Betriebswirkungen für vier Konjunkturphasen, FX/Außenwirtschaft, EZB/Finanzierung, Politikfelder und Inflation-/Kostenkopplung. D-0169 ist keine Vollabnahme von T-0063. Firmen-/Jahresintegration, Browser/Mobile und Gesamtgates bleiben offen.)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachverantwortung: A08 – RESEARCH; Mitwirkung A02, A03, A06; Review A09
Priorität: HIGH
Bezug: V3-01/V3-02/V3-13–V3-16; Rahmenplanpunkt 1.1; CP-0274/CP-0275
Abhängigkeiten: Keine; Ergebnisse sind Voraussetzung für T-0065/T-0067 und die V3-Kompetenzzuordnung in T-0068.

Aufgabe: Quellen- und Modellgrundlage sowie spielbare Übertragungskanäle für vier Konjunkturphasen, Außenwirtschaft, EZB und die acht im Goal-Plan benannten wirtschaftspolitischen Kategorien erarbeiten. Inflationskorb, Basisperiode, Gewichte, Formeln, Rundung und Aktualisierung dokumentieren. Keine unquellenbasierten Schwellenwerte oder automatischen Kausalitäten einführen.

Abnahme: Alle verwendeten Größen haben Definition, Einheit, Quelle/Modellannahme, Aktualisierung und Übertragungskanal. Vier Phasen sind unterscheidbar und reproduzierbar; mindestens drei Außenwirtschaftskanäle sind dokumentiert und mindestens zwei wirken nachweisbar auf betriebliche Größen. Jede Politik-Kategorie hat ein Szenario mit Ziel, Wirkungspfad, Verzögerung und Zielkonflikt. Mindestens je ein EZB-Zinssteigerungs- und Senkungsereignis und ein reproduzierbarer Inflations-Rechenfall sind belegt. A02/A03 bestätigen gemeinsamen Ereignis-/Finanzvertrag. Ergebnisse und Rückfragen werden ausschließlich an A01 adressiert.




### T-0062 – Unabhängige Rest-Gates und revisionsgebundene V2-Freigabe

Status: COMPLETED (A09 Release Committee PASS; CP-0273; Pushnachweis CP-0274). Releasecommit `d18ec35` enthält Paket und Nachweise, Parent/Quellcommit ist `7a89210`; Manifest- und Artefakthashes sind geprüft. G01–G11 sind für den Release gebunden und ohne blockierenden Konflikt. Der Push nach `origin/main` wurde später in CP-0274 nachgetragen.
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.4 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Alle V2-Gates mit unabhängigen Rollen prüfen und Nachweise an denselben Release-Quellcommit und dieselbe Artefaktidentität binden. A02/A03 bestätigen D-0160 und Finanzbefunde; A09 führt die Committee-Neubewertung. CP-0270 enthält den 768-px-CSS-Fix; CP-0271 belegt Touch-/Keyboardplanung und responsive Breiten; CP-0272 dokumentiert Quell-/Paketbindung und Commit-Retrospektiven. A09 bestätigt, dass die Kriterien Touch-Emulation akzeptieren, sofern Touchereignisse ausgelöst werden und die Methode benannt ist. Diese Aufgaben wurden durch CP-0273 abgeschlossen; der spätere Push nach `origin/main` ist in CP-0274 dokumentiert. Historische CP-0266 bis CP-0268 bleiben unverändert. Nutzerabnahmen D-0159 nicht erneut erfragen.

Abnahme: G01–G11 für die gebundene Quell-/Artefaktrevision PASS, keine ungelösten blockierenden Konflikte, aktueller Release-Committee-Bericht PASS. Kein Schema-/Architekturentscheid ohne separate Nutzerfreigabe.

### T-0061 – V2-Gates auf aktuellem Arbeitsbaum prüfen

Status: COMPLETED (A01-Selbstprüfung; CP-0265; 2026-10-30)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.4 / SLG-002.5
Koordination / Ausführung: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Die nach CP-0264 vorliegenden V2-Änderungen, Nutzerabnahmen und aktuellen Gate-Nachweise prüfen, automatisierte Suite und Jahreslauf wiederholen, Paketprovenienz validieren und offene formale Gates präzisieren. Keine Commit-/Push-Aktion.

Abschluss: 18 Regressionen/Validatoren und JavaScript-Syntaxprüfungen bestanden. Jahres-Smoke 2027–2028 zweimal identisch mit 12 Monatsabschlüssen, mindestens 2.892,16 € verfügbarer Tagesliquidität, 0 € unbezahlten Betriebskosten, 0,00 € Monatsabgleichsabweichung und identischem Ereignis-Hash. Offlinepaket zweimal bytegleich gebaut, Manifest-/ZIP-Prüfungen bestanden; Nutzer bestätigt iPhone-/iPad-Gerätebeleg und Fragenkatalog. T-0062 hält unabhängige Rollenprüfungen und die Bindung aller Gates an einen gemeinsamen Commit offen. Details: CP-0265.
## Abgeschlossene Tickets
### T-0063 – Makroökonomie (MG-002 / SLG-002.2)

Status: COMPLETED (2026-11-05; G2 Same-Seed-Replay T-0081 und finale A09-Gesamtabnahme T-0073 PASS; G3/G5/G6/G7/G8 zuvor bestanden). Belege: prototype/v3-t0081-same-seed-results.json, docs/agent-system/a09-t0073-final-t0063-gate-review-cp0488.md, CP-0501. Die T-0081/A09-Replayprüfung ergab vier Profile mit übereinstimmenden State-, Event- und Monatslog-Hashes; jedes Ergebnis umfasst 362 Tage, 12 Monate und 1.409 Ereignisse.


### T-0048 – Jahreslauf-Managemententscheidungen (Umzug, Inventar, Personal)

Status: COMPLETED (Jahres-Smoke und Management-Policy geprüft; CP-0253; 2026-10-30)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Den deterministischen Jahreslauf-Smoke so erweitern, dass er zu Simulationsbeginn jeden Inventarkatalogartikel der Stufe 1 kauft und über vorhandene Produkt-APIs einen Mietstandortwechsel sowie eine bedarfs-/kapazitätsgeprüfte Einstellung ausführt. Keine automatische Produktentscheidung oder Änderung am produktiven Simulationsverhalten einführen.

Umsetzung: Der Runner kauft am 01.01.2027 einmal jede der zehn Stufe-1-Ausstattungen (Gesamtpreis 3.680 €), meldet diese Käufe unter `annualManagement.equipmentPurchases` und prüft die vollständige Katalogabdeckung. Danach verlegt er den Betrieb nach Milbertshofen (Miete) und stellt bei mindestens zwei aktiven Aufträgen, freier Arbeitsplatzkapazität und mindestens 3.300 € Kassenbestand eine Fertigungskraft ein. Die AEVO-Weiterbildung darf erst nach dem protokollierten Umzug aus der Startgarage beginnen; die Azubi-Einstellung folgt nach AEVO-Abschluss. Die Runner-Policy zieht für den Umzug mindestens vier abgeschlossene, bezahlte Aufträge und eine sechsmonatige Zielmiete als Liquiditätsreserve heran; eingestellt wird bei mindestens vier aktiven Aufträgen und 6.600 € Cash. Das erfüllt die Mindestbedingungen von zwei aktiven Aufträgen/3.300 € mit zusätzlichem Sicherheitspuffer. Angebotsentscheidungen laufen während der Weiterbildung bereits im Jahresschleifen-Tagesablauf. Anlagenraten werden im Tageslauf über den bestehenden Finanzpfad verarbeitet.

Abnahme 2026-10-30: Runner kauft alle zehn Stufe-1-Artikel am 01.01.2027, verlegt nach Milbertshofen, stellt Personal bedarfs- und kapazitätsgeprüft ein, beginnt AEVO erst nach dem Umzug und startet Ausbildung nach erfolgreicher AEVO. Einjahres-Smoke erreicht 2028-01-01 mit 12 Monatsabschlüssen, 152 Marktchancen, 129 Anfragen, 63 Lieferungen, 59 bezahlten Abschlüssen, 1.239,16 € Cash, 0 € offenen Betriebskosten und Reconciliation-Fehlern. Kontrollierte Fixtures prüfen Krankheit und Weiterbildung. Urlaub wird für die Startkraft als 20 Werktage geprüft; später eingestellte Beschäftigte werden nur für ihre tatsächliche Beschäftigungszeit bewertet. Automatisierter Jahreslauf PASS; der frühere insolvente Lauf ist durch geänderte Simulations-/Runnerstände überholt. Manueller Nutzertest und Jahreslauf stellen keine Architektur- oder Releasefreigabe dar. Details: CP-0253.



### T-0045 – V2-Auftragsplanung, Beschaffung und Finanzbedienung

Status: COMPLETED (A01-Umsetzung und Regressionen; CP-0225; 2026-10-29)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Den gemeldeten Inventar-/Werkzeugfehler beheben und die tägliche Mitarbeiterplanung um zuweisbare Auftragsstufen, Beschaffungs-/Warenannahme-/Versandblöcke ergänzen. Dashboard-Nachrichten, Kreditdarstellung und vorzeitige Ablösung sowie plausiblere V2-Auftragsgrößen/-zeiten ergänzen.

Abschluss: Eine vorhandene Werkbank mit Spannmitteln erfüllt die passende Spannmittelanforderung, aber keine CNC-Anforderung. Drag-and-drop weist passende anwesende Mitarbeitende einzelnen Produktionsstufen zu; Folgestufen können nur nach Abschluss der vorherigen Stufe laufen. Baumarkteinkäufe benötigen 1–4 zugewiesene Arbeitsstunden und geben Material erst nach Abschluss frei; Onlinebestellungen beachten Mindestmengen und Wartezeit, erzeugen nach Ankunft eine 0,5-Stunden-Warenannahme. Versand wird als 1-Stunden-PACK-Aufgabe geplant. Lieferantenrabatte und Beziehungskonditionen wirken bei Bestellungen. Das Dashboard zeigt höchstens drei aktuelle Nachrichten, ungelesene fett und gelesene normal. Aktive Kredite werden nur bei positivem Saldo gezeigt und lassen sich aus verfügbarer Liquidität zum Restkapital ohne modellierte Vorfälligkeitsentschädigung ablösen. V2-Auftragsreferenzpreis und Fälligkeitshorizont wurden gesenkt. Gezielte Regressionen und alle Prototypprüfungen außer der Jahressolvabilitätsprüfung bestanden; HTTP-Server liefert die aktualisierte UI. `year-simulation-smoke.mjs` läuft bis 2028, scheitert im Legacy-2027-Fall aber mit `gameLost=true` und 119.638,87 € offenen Kosten. Derselbe Fehler besteht auch, wenn die Same-Day-Auftragsfreigabe dieses Tickets temporär zurückgenommen wird. Interaktive Browserabnahme wurde nicht ausgeführt. Keine Schema-/Architekturfreigabe, kein Commit/Push.



### T-0039 – Cross-Agent-Konfliktprüfung und Freigabe des Sicherungsstands

Status: COMPLETED (Release-Committee PASS; CP-0216; 2026-10-28)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.3 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachreview: A02–A04 durch unabhängigen Cross-Review; A05–A08 durch A11; A09 Release Committee; A10 DevOps; A11 Architecture
Priorität: HIGH

Aufgabe: Den gesamten lokalen Arbeitsstand nach T-0034 bis T-0038 prüfen, widersprüchliche Implementierungen oder Dokumentation beheben und den vollständigen V2-Sicherungsstand für Commit/Push freigeben. Keine Schema- oder Architekturfreigabe.

Abschluss: Release-Committee PASS. Bereinigt wurden die Kopplung zwischen Tagesfragen und Prüfungsbibliothek, Profilgrenzen der Preisfortschreibung, Bruttozahlung/Vorsteuer, Bilanzbasis des Quartalslimits, gesicherte Immobilien beim Umzug und Nullmiete in der Fallback-Kalkulation. Tagesfragen verwenden nun einen eigenen Pool mit variierter Antwortposition; die 450 Prüfungsfälle bleiben nichtmutierend. Alle 13 MJS-Regressionen/Validatoren, 21 Syntaxchecks, 5/5 Workflow-Sicherheitstests sowie manuelle Mobile-Prüfung bei 390×844 bestanden. Whitespace auch in zuvor ungetrackten Markdown-Dateien bereinigt. Der Stand ist für Commit/Push bereit; diese Git-Schreibvorgänge werden in GitHub Desktop ausgeführt. Siehe CP-0216.


### T-0034 – Personalpools, Kompetenzwirkung und tägliche Lernfragen

Status: COMPLETED (A01-Implementierung, Gesamtregression und Browserprüfung; CP-0211; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2 / SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A05 FRONTEND, A06 IHK_LEARNING, A09 QA
Priorität: HIGH

Aufgabe: Playtestkorrekturen für Zeitarbeits-Personalplanung und Lernfragen integrieren. Zeitarbeit wird aus festem Agenturpool nach Anzahl, Fähigkeit und Zeitraum (Arbeitstag, fünf Arbeitstage oder 20 Arbeitstage) gebucht, bleibt ohne Auftragsbindung und erscheint in der normalen Tagesplanung. Mitarbeitende führen aktuelle und maximale Werte in Fach-, Methoden-, Sozial- und Individualkompetenz; Fachqualifikationen werden zusätzlich explizit markiert. Kompetenz und Motivation müssen die Arbeitsleistung beeinflussen. Lernfragen erscheinen auf der Übersicht, sind auf fünf Antworten je Simulationsdatum begrenzt und haben kleine, sichtbare Ruf-/Kompetenz-/Motivationswirkungen.

Akzeptanz: Personalbuchungen prüfen Agenturpool und Raumgrenze über den gesamten Zeitraum; keine Person wird zeitgleich doppelt gebucht; Agenturabrechnung bleibt abstimmbar; Lernlimit wird gespeichert und täglich zurückgesetzt; Antworten verändern keine Finanz-/Ledgerposten; bestehende Spielstände werden migriert; gezielte Regressionen und der Jahres-Smoke bestehen. Keine Schema- oder Architekturfreigabe.

Abschluss: Drei Agenturen mit je vier fest definierten Poolkräften. Buchungen wählen Personenzahl und Dauer von einem, fünf oder 20 Arbeitstagen, beginnen arbeitsfrei am nächsten Arbeitstag, prüfen durchgehend Poolverfügbarkeit und Standortkapazität und erscheinen ohne Auftragsbindung in der Tagesplanung. Die alte 8-Stunden-Auswahl im Zeitarbeitsformular wurde entfernt; ein Leihmitarbeiter wird modellseitig für einen vollen Arbeitstag gebucht. Kompetenz-/Entwicklungslimits und Qualifikationen werden angezeigt und in Weiterbildung/Leistung berücksichtigt. Das Dashboard enthält die Tagesfragen; fünf Antworten pro Simulationsdatum bewirken kleine sichtbare Änderungen ausschließlich über Engine-Logik, ohne Finanz-/Ledgerbuchungen. Fokus-Regressionen, vollständige MJS-Regressionsmatrix, WBQ-/HSQ-Validatoren, Jahres-Smoke und Browseransichten für Dashboard, Planung und Agenturvertrag bestanden. Kein Schema-/Architekturentscheid; kein Commit/Push in T-0034. Details: [CP-0211](checkpoints/MCP-2026103001.md#cp-0211).


### T-0033 – V2-Integration, Qualitätsreview und Release vorbereiten

Status: COMPLETED (Reviews, Regressionen, Browser-/Mobilprüfung, Commit 4249271 und Push; CP-0210)
Master Goal: MG-002
Second-Level Goal: SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A04 DATABASE, A09 QA, A10 DEVOPS_INFRASTRUCTURE, A11 TECHNICAL_ARCHITECT
Priorität: HIGH

Aufgabe: Die fachlich abgeschlossenen MG-002-Lieferungen integrieren, Browser-/Mobilpfade, Inhalte, Simulation und Qualitätsgates unabhängig prüfen und Konflikte vor Sicherung bereinigen. Keine Architektur- oder Schemafreigabe ohne gesonderte Nutzerentscheidung.

Akzeptanz: Alle V2-Tickets haben dokumentierte Agentenergebnisse und unabhängige Reviews; 450 Lernszenarien sind strukturell und fachlich geprüft; Regressionen und einjähriger Simulationslauf bestehen; Mobilbedienung und Tooltipzugänglichkeit sind geprüft; `git diff --check` ist sauber. Nach Abnahme werden klar benannte Sicherungs-Commits erstellt und über lokale Git-Arbeitsmittel/GitHub Desktop gepusht.


### T-0032 – 450 WBQ-/HSQ-Multiple-Choice-Lernszenarien erstellen und integrieren

Status: COMPLETED (A06/A07-Lieferung, A09-Prüfung sämtlicher 450 Items; 2026-10-28; CP-0208)
Master Goal: MG-002
Second-Level Goal: SLG-002.3 / SLG-002.4
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A06 IHK_LEARNING, A07 EXAM, A05 FRONTEND, A09 QA (Inhaltsproduktion A06/A07 zuerst; UI-Integration A05 erst nach T-0031)
Priorität: HIGH

Aufgabe: Für jeden der vier WBQ-Qualifikationsbereiche und fünf HSQ-Handlungsbereiche jeweils 50 eigenständige, originäre Multiple-Choice-Lernszenarien erstellen. Jede Aufgabe enthält vier plausible Antwortoptionen, einen Lösungsschlüssel A–D, eine fachliche Begründung, Quellen-/Kompetenzbezug, eine verständliche Unternehmenswirkung und eine klare Kennzeichnung von Rechtsstand bzw. Spielvereinfachung. A06 und A07 liefern getrennte Inhaltsmodule mit demselben Schema. A05 integriert diese Module als Lernmodus erst nach Abschluss und Review von T-0031, damit UI-Änderungen nicht konkurrierend erfolgen.

Akzeptanz: Genau 50 valide Fragen je offiziellem Bereich (450 insgesamt); keine kopierten DIHK-Prüfungsaufgaben; genau ein richtiger Schlüssel pro Item; Distraktoren und Erklärungen fachlich geprüft; Unternehmenswirkungen werden als plausible Fallfolgen im Feedback erklärt; Antworten verändern den aktiven Jahres-Spielstand oder das Accounting-/Ledger-State nicht. Inhalte sind responsiv sowie tastatur-/touchbedienbar.


### T-0031 – Marketing, Logistik und kontextbezogene Fachwissen-Tooltips ergänzen

Status: COMPLETED (A02/A03/A05-Implementierung, A11/A09-Review; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.2 / SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A06 IHK_LEARNING, A08 RESEARCH
Priorität: HIGH

Aufgabe: Marketing/Vertrieb sowie Logistik (Beschaffung, Lieferanten, Materialfluss, Lager und Auslieferung) in die nachvollziehbare Unternehmenssimulation und Lernziele aufnehmen. Fachwissen soll an passenden Spielbegriffen und Entscheidungen durch zugängliche Tooltips erklärt werden. Allgemeine Fachregeln, Rechtsvorgaben und V1-/V2-Szenarioannahmen sind sichtbar getrennt.

Akzeptanz: Mindestens ein eigener spielbarer Marketing-/Vertriebszyklus und ein eigener Logistikzyklus bilden jeweils nachvollziehbare Unternehmenswirkungen ab; beide sind reproduzierbar und finanzielle Effekte abstimmbar. Tooltips funktionieren per Maus, Tastatur und Touch. Keine Architektur-/Schemaänderung ohne Freigabe; Fachreview durch unabhängige Rollen.
Abschluss: Zwei einmalige Szenariokampagnen (+8/+14 Prozentpunkte auf die nächste Marktchance) werden beim Aktivieren als Kosten oder offene Kostenposition gebucht und in Monatsabschluss/Ergebnis/Cash geprüft. Bevorzugter Lieferant je Material steuert künftige Fehlbestandsbestellungen, bei unveränderten Bestellungen und Zuverlässigkeits-/Beziehungswartezeiten. Marketing-/Logistikhinweise sind als native, per Tastatur und Touch nutzbare Details integriert. T-0031-Regression, V1-Regressionsuite, Wochenregression und 12-Monats-Smoke bestanden; unabhängiger A11/A09-Review ohne blockierende Konflikte. Ein separater Test des Marketing-Zahlungsversuchs bei unzureichendem Cash wird im T-0033-Gesamt-QA ergänzt. Kein Commit/Push.


### T-0030 – IHK-Prüfungsrahmen und Kompetenzlandkarte belegen

Status: COMPLETED (A06-Lieferung, A07-Fachreview, A08-Quellenreview; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.1
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A08 RESEARCH, A06 IHK_LEARNING, A07 EXAM
Priorität: P0

Aufgabe: Den WBQ-/HSQ-Prüfungsrahmen anhand der geltenden WFachwPrV und öffentlich erreichbarer IHK-/DIHK-Angaben dokumentieren; URL, Versions-/Veröffentlichungsstand und Abrufdatum festhalten. A06 leitet eine nachvollziehbare Kompetenzlandkarte ab, A07 prüft Prüfungsformate und Handlungsorientierung. Verbindlicher Normtext, IHK-Hinweise, agentenseitige Ableitungen und nicht belegte Ergänzungen bleiben unterscheidbar.

Akzeptanz: Vier WBQ- und fünf HSQ-Bereiche vollständig abgebildet; Logistik und Marketing/Vertrieb enthalten; Quellen und Abweichungen dokumentiert; kostenpflichtige Rahmenpläne nicht als eingesehene Quelle ausgegeben; unabhängiger Cross-Review bestanden; Kompetenzlandkarte wird nicht fälschlich als IHK-Veröffentlichung bezeichnet.

Abschluss: `docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md` dokumentiert WFachwPrV §§ 3–5 und 7, regionale IHK-Angaben, agentenseitige Ableitungen und Spielbezüge. A07 und A08 bestätigen Bereichszuordnung, Prüfungsformat, Rechts-/Zeitangaben sowie Quellenstände. Der spezifische Wirtschaftsfachwirt-Rahmenplan 2024 und der allgemeine WBQ-Rahmenplan 2026 sind getrennt; keiner der kostenpflichtigen Volltexte wurde als gelesen behauptet. Keine blockierenden Konflikte; siehe CP-0202.


### T-0029 – „Woche abarbeiten“ bis zum nächsten Montag begrenzen

Status: COMPLETED (A02/A05-Umsetzung, A11/A09-Review; 2026-10-28; CP-0202)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe: Den Wochenknopf so ändern, dass er unabhängig vom Startwochentag bis zum nächsten strikt zukünftigen Montag läuft. Das Ziel-Montagdatum selbst wird nicht verarbeitet. Klar beschriften, welches Zeitintervall aufgelöst wird.

Akzeptanz: Starts an Montag, Mittwoch, Freitag, Samstag und Sonntag sowie Feiertagswochen enden am nächsten zukünftigen Montag; kein Ereignis oder Finanzlauf am Zielmontag; Einzel-Tag-Fortschritt bleibt unverändert; Regressionen und `git diff --check` bestehen.

Abschluss: `getWeekAdvanceWindow()` berechnet das strikt zukünftige Montagziel; die App verarbeitet nur die davorliegenden Kalendertage. Alle drei Buttons nennen das Montagziel. Wochenregression, Playtest-Regression und Jahres-Smoke bestanden; unabhängiger Review durch A11/A09 fand keine blockierenden Konflikte. Browser-E2E folgt unter T-0033. Kein Commit/Push.


### T-0028 – Cross-Agent-Befunde zu Angebotszeit, Kapazität und Liquidität bereinigen

Status: COMPLETED (A01 hat Fachrollen intern abgearbeitet; 2026-10-27; CP-0198)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe:
- A01-Produktkonvention: Konkurrenzgebote liegen als gleichzeitige Vergleichsangebote am Tag der Spieleranfrage vor. A02 setzt responseDate auf das Anfragedatum; A05 bezeichnet es als Eingangsdatum statt als künftige Antwortfrist.
- A02: Kapazitätsabzug nur aus noch nicht gelieferten generierten Aufträgen berechnen, nicht aus bereits gelieferter Produktion, deren Forderung noch offen ist.
- A05: Bei MARKT_VERLOREN den eingereichten Preis als verlorenes Angebot zeigen, nicht als vereinbarten Auftragspreis oder Vertragszahlungsziel. A09 ergänzt Regressionen.
- A05/A02: Qualitätswert als V1-Proxy für Wettbewerber-Reputation kenntlich machen.
- A04: Logische Spezifikation um Anfragezuordnung, Konkurrenzangebots-Snapshot und Zuschlag ergänzen; keine physische Schemaänderung oder Freigabe.
- A03/A09: Ein-Auftrag-Stresslauf wiederholbar prüfen und tatsächlichen Spielverlust-/Retrystatus ausweisen. Keine unbelegte Finanz- oder Insolvenzregel ergänzen.
- A01: D-0136 als historischen Ausgangsstand kennzeichnen; D-0137 als gültige wöchentliche Frequenzreferenz verlinken.

Akzeptanz:
- Verfügbarkeit, Antwortdatum und Zuschlag widersprechen sich nicht.
- Produktionskapazität wird mit Lieferung frei.
- Verlorene Angebote sind klar von angenommenen Verträgen getrennt.
- Ein-Auftrag-Liquiditätsrisiko ist mit Cash, unbezahlten Posten und Retry-/Spielverluststatus reproduzierbar dokumentiert.
- Logische Datenmodellanforderungen sind vollständig, ohne Schemaänderung.
- gezielte Regressionen, bestehende Regressionen und git diff --check bestanden.

Abschluss: Konkurrenzangebote haben das Anfragedatum als Eingangsdatum; gelieferte Aufträge zählen nicht länger als Produktionslast; verlorene Gebote bleiben vom Vertragswert getrennt und die UI kennzeichnet den abgegebenen, nicht angenommenen Preis. Der Wettbewerberruf ist sichtbar als Qualitäts-Proxy beschriftet. Das logische Datenmodell umfasst Anfragebeteiligung, Quote-Snapshot und Zuschlagsergebnis ohne physische Schemaänderung. Regressionen und Ein-Auftrag-Stresstest sind in CP-0198 dokumentiert. Keine Finanzregel ergänzt; Ein-Auftrag-Strategie löst nach acht Fehlversuchen Spielverlust und Maschinenverwertung aus. Kein Commit/Push.


### T-0027 – Marktanfragen und Spielerangebote wöchentlich erzeugen

Status: COMPLETED (A01 intern als A02/A05/A09 ausgeführt; 2026-10-27; CP-0196)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Zu seltene Marktanfragen erhöhen, damit genügend wählbare Angebote entstehen. Konkurrenzselektion und Ruf-/Preisabhängigkeit aus D-0136 erhalten; hohe gleichzeitige Auftragslast soll den Zufluss dämpfen.

Abschluss: Eine Anfrage pro Simulationswoche am ersten Arbeitstag. Einladungsprüfung und Kapazitätsabzug bleiben aktiv; je Spieleranfrage ein bis zwei Konkurrenzbieter. Jahres-Smoke und Marktregression bestanden. Entscheidungen D-0137/D-0138, Nachweis CP-0196. Keine Schemaänderung, kein Commit/Push.


### T-0026 – Selektive Konkurrenzangebote und Zuschlagslogik umsetzen

Status: COMPLETED (A01 intern als A02/A05/A09 ausgeführt; 2026-10-27; CP-0195)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Kundenanfragen nicht an alle Unternehmen verteilen. Sichtbare Konkurrenzangebote für offene Spielerangebote abbilden. Einladung und Zuschlag sollen von Reputation und Preis abhängen; das Verhalten bleibt reproduzierbar und mobil lesbar.

Abschluss: Der Betrieb erhält Anfragen anhand von Ruf, bisherigem Preisprofil und Kapazitätsbelastung; pro Anfrage bieten ein bis zwei Wettbewerber. Preis, Ruf und modellierte Lieferzeit werden angezeigt. Der Zuschlag vergleicht eigenes Angebot und Rivalen deterministisch. Preisprofil wird aus eigenen Geboten fortgeschrieben. Regression, bisherige Playtest-Regressionen und Jahres-Smoke bestanden. Entscheidung D-0136; Nachweis CP-0195. Keine Schemaänderung, kein Commit/Push.


### T-0022 – V1-Playtestfehler beheben und Browserbedienung sichern

Status: COMPLETED (manuelle Browser-Reprüfung durch Nutzer bestätigt; 2026-10-27; CP-0199)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A03/A05/A09/A11 intern abgedeckt)
Priorität: HIGH

Umfang: Save/Load-Export, dauerhaft erreichbare Navigation, Entfernen des Jahressimulationsbuttons aus der Spieloberfläche, Disporahmenanzeige, Platzgrenzen einschließlich Krankheit, unveränderlicher angenommener Preis, Standortwechsel statt Flächeneditierung, Ausbildungs-/Weiterbildungsabgrenzung mit Ausbilderqualifikation und korrekte Urlaubserfassung. Rechtliche Modellgrenzen und deterministische V1-Annahmen dokumentieren.

Akzeptanz: neue Fehlerregressionen, bestehende Regressionen und Einjahres-Smoke bestanden; Nutzer hat die manuelle Browserprüfung von Datei-Dialogen, Bottom-Navigation bei hoher Zoomstufe, Umzugsdialog, Preissperre und Mobilansicht ohne Fehler bestätigt. `git diff --check` sauber. Keine Schemaänderung, kein Commit/Push.

Abschluss: Korrekturen und automatisierte Regressionen sind in CP-0190 dokumentiert; T-0028-Cross-Agent-Prüfung steht in CP-0197/0198. Nutzer bestätigte am 2026-10-27, alle in CP-0190 offenen interaktiven Punkte getestet und keine Fehler gefunden zu haben. T-0022 ist mit CP-0199 abgeschlossen.


### T-0025 – Zeitarbeitskonditionen vor Buchung verhandeln und fixieren

Status: COMPLETED (A01 intern als A02/A03/A05/A09 ausgeführt; 2026-10-27; CP-0194)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A01 – MASTER_ORCHESTRATOR (Fachrollen A02/A03/A05/A09 intern abgedeckt)
Priorität: HIGH

Aufgabe: Zeitarbeitstarif durch Agenturverhandlung mit Grundpreis und Stundenpreis ersetzen. Höherer Grundpreis muss niedrigeren Stundenpreis anbieten; nach Vereinbarung müssen Preise fixiert und in Einsatzkosten abgerechnet werden.

Abschluss: Drei illustrative, monotone Preisstufen eingeführt. Konditionen sind nach Annahme unveränderlich; Buchungen speichern die vereinbarten Sätze. Monatsgrundpreis fällt einmal in Monaten mit mindestens einer Buchung an; Legacy-Spielstände behalten 45 €/h. Regression und Jahres-Smoke bestanden. Details: CP-0194.

### T-0050 – Playtest-Nacharbeiten und Belastungsgrenzen

Status: COMPLETED (Tagesreihenfolge, Teamwirkung und sichere Archivverdichtung umgesetzt; CP-0257; 2026-10-30)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Die akzeptierten Korrekturen aus `prototype/manual-year-smoke-test-log.md` umsetzen. Nutzerentscheidungen zu Arbeitslast und Inhaber-Mehrarbeit sind durch D-0153 festgehalten. Postfachbedienung, eindeutige Angebotswirtschaftlichkeit, Verlustfilter und getrennte Bank-/Dispoanzeige sind ebenfalls begonnen.

Teilabschluss: 8 h = 100 %, Automatik stoppt bei 8 h. Nur eine explizite manuelle Tageszuweisung öffnet die Mehrarbeitsgrenze bis 10 h (125 %) bei Beschäftigten bzw. 12 h (150 %) beim Inhaber. Inhaberarbeit über zehn Stunden senkt Motivation um 1,5 Punkte je Stunde und wird protokolliert. CNC bleibt bei 8 h/Tag. Nachrichtendetail und Navigation, Verliererfilter, negative-DB-Warnung samt Bestätigung sowie Bankbestand/Dispo-KPIs wurden angepasst.

Ursprünglich offene Punkte (Tagesreihenfolge, Teamwirkung und sichere Auftragsverdichtung) wurden mit Abschluss CP-0257 umgesetzt und geprüft. Marktchancen protokollieren die Marketingwirkung; der dynamische BAB berechnet praktische Kapazität, Leerkosten und Privatentnahmen und zeigt Auslastung, Leerkosten sowie verrechnete FGK im Monatsabschluss. Keine Schema- oder Architekturfreigabe.

Abnahme 2026-10-30: Tagesblöcke werden pro Mitarbeiter als Warteschlange abgearbeitet; Auftragsstufen bleiben voneinander abhängig. Aufgaben und Fertigungsstufen können sich am selben Tag abwechseln, solange Kapazität verbleibt. Die Zeitleiste zeigt die Reihenfolge und geschätzte Stundenlast. Arbeitsstunden erhöhen Fach-/Methodenkompetenz höchstens bis zum individuellen Potenzial; Motivation wirkt weiter auf die Leistung und verändert sich leicht durch Arbeit. Abgeschlossene Aufträge werden erst nach 365 Tagen Detailtiefe reduzieren; finanzielle Kerndaten bleiben erhalten. `v2-ui-context-timeline-regressions.mjs` und der Jahres-Smoke bestanden.

### T-0047 – V2-Qualitätsziele, Spiel-/Lernkontext und Mitarbeiter-Zeitleiste

Status: COMPLETED (A01-Browserabnahme gemäß visuellen und Recovery-Kriterien; CP-0257; 2026-10-30)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.3 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: MG-002 als durchgängige Wirtschaftslernspiel-Zielsetzung neu fassen, V2-Qualitätsziele erweitern, A01–A12 je ein V2-Unterziel zuweisen, V3–V12 für alle WBQ-/HQ-Fächer und integrierte Prüfung festlegen. Spieloberfläche und Lernkarten über stabile Kompetenz-/Kontextbezüge zusammenführen. Inventar grafisch und zugänglich darstellen sowie eine Mitarbeiter-Zeitleiste für die nächsten Arbeitstage (ohne Wochenenden) anbieten.

Umsetzung: Die verbindliche Zielkarte steht in `v2-v12-goal-map.md`; `goals.md` fasst Ziel und Releasekriterien zusammen. A01 ergänzte `planning-ui.js`, die Zeitleiste in `app.js`, SVG-Inventar-/Materialsymbole, den Lernkarten-Sprung/Rückkehrkontext und Regressionen. Ein nachweislich veralteter `data-plan`-Change-Handler samt nicht mehr verwendeten Importen wurde entfernt. Das mobile Offline-/iPhone-Paket wurde mit dem neuen Modul neu generiert.

Abnahme: Responsive Browser- und Recovery-Kriterien wurden bei 390×844 geprüft: fünf Werktage ohne Wochenendeinträge, 9/9 sichtbare Navigationsbereiche, keine horizontale Seitenüberbreite; Lieferantenauswahl bleibt in der Kartenbreite. Die Wiederherstellung des zuvor gesicherten Spieltags wurde bestätigt. Kein reales iOS-Gerät geprüft. Details: CP-0257.
### T-0040 – V2-Arbeitsplatzausstattung, Inventar-Lebenszyklus und Ratenkauf

Status: COMPLETED (Netto-/Vorsteuerpfad und mobile Inventarabnahme; CP-0257; 2026-10-30)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR
Fachreview: A02-Simulation, A03-Finance, A05-UI, A08-Quellenhinweise und A09-Qualität anhand CP-0257 und CP-0260
Priorität: HIGH

Aufgabe: Arbeitsplatz- und Lagerausstattung in das 2019er V2-Profil aufnehmen. Mindestens drei Ausrüstungskomponenten je Arbeitsplatzbereich und mindestens zehn kaufbare Ausprägungen je Komponente; Produktivität, Beschaffung, Marketing, Angebote/Rechnungen und Lagerkapazität wirksam abbilden. Werkstätten bleiben über die bestehende Karte auswählbar und mietbar. Ausstattung weist Zustand/Verschleiß sowie Buchwert und AfA aus. Nur Spezialwerkzeuge erhalten einen Mietpfad; größere Anschaffungen können bei fehlender Liquidität als Ratenkauf angeboten werden, sofern die maximale Kreditbelastung eingehalten wird.

Umsetzungsstand: Prototyp-Modul `prototype/equipment.js` enthält zehn Kategorien und je zehn Varianten, mit mindestens drei Kategorien in Büro, Werkstatt und Lager/Versand. Inventaransicht, Kauf, Spezialwerkzeug-Miete, zustandsbasierte Produktion/Markt-/Lagerwirkung und Monatsabschlusswerte sind implementiert. Kreditangebot: 12 Monate, 8 % p. a. als klar gekennzeichnete V2-Modellannahme; Neuverschuldung wird auf den freien Rest des quartalsweisen 10-%-Finanzierungsrahmens nach Abzug bestehender Finanzierungen begrenzt. GWG-Sofortaufwand bis 800 € gilt im Modell nur für selbständig nutzbare Katalogeinheiten. § 6 Abs. 2 EStG und BMF-AfA-Quellen sind gegengeprüft; das Modell weist weiterhin Nettowert/Vorsteuer beim Gerätekauf und Sammelpostenwahl nicht vollständig ab, also keine steuerliche Compliance. Einjahresregression bestanden; Mobile Browserabnahme bei 390×844 abgeschlossen; kein reales iOS-Gerät geprüft. Quellen und Grenzen: [V2-Inventar- und Arbeitsplatzmodell](../simulation/v2-inventar-arbeitsplaetze.md), [D-0149](decision-log.md#d-0149--v2-arbeitsplatzausstattung-verschleiss-und-anschaffungsfinanzierung).

Abnahme: Inventar zeigt Nettokatalogpreis, 19 % SimTAX separat, Bruttobelastung bei Cash/Ratenkauf und getrennten Netto-Buchwert/GWG sowie Vorsteuer-Komponente. Inventarregression und 365-Tage-Smoke bestehen. Steuerbehandlung bleibt eine Spielvereinfachung. Details: CP-0257.
### T-0054 – Bestätigte CPs und MCPs als unveränderliche Historie schützen

Status: COMPLETED (Governance-Regeln in Control Plane und Agentenregeln ergänzt; CP-0256)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR

Aufgabe: Die vom Nutzer bestätigte Unveränderlichkeit abgeschlossener MCP-Dateien analog zu CP-Dateien verbindlich in den Agentenregeln festhalten.

Abschluss: `AGENTS.md`, `agent-structure.md` und `agent-rights-matrix.md` bestimmen, dass CPs und MCPs nach Analyseabschluss und Nutzerbestätigung unveränderlich sind. MCP-Entwürfe sind bis dahin als Entwurf zu markieren. Spätere Korrekturen oder Erkenntnisse werden in einem neuen CP dokumentiert; eine neue Synthese erhält eine neue MCP-ID. Bestehende CP-/MCP-Dateien wurden nicht verändert. Nachweis: CP-0256.

### T-0051 – Checkpoint-Retrospektive und Mastercheckpoint erstellen

Status: COMPLETED (MCP-2026103001 geprüft durch A01–A12; CP-0001–0234 gesichert, indexiert und aus dem aktiven Ordner bereinigt; CP-0250)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Review und Retro aller Checkpoints ab CP-0001 nach den bestätigten Nutzerkriterien. Jeder Agent prüft seine ausführenden/fachprüfenden CPs; A01 prüft nicht eindeutig zugeordnete CPs. Danach prüfen A01–A12 den eigenständig verständlichen, nach Agenten sortierten MCP einzeln. Ältere MCPs und nach Start entstehende CPs werden bis zum finalen Cutoff einbezogen. Die fehlenden CP-IDs 0017 und 0020 werden als nicht belegte Lücken geführt, nicht rekonstruiert.

Ergebnis: eigenständig lesbarer Mastercheckpoint mit Review-/Retro-Befunden, Konfliktregister, Missverständnissen/Extraschleifen samt Ursachen/Lösungen, Customer-intent-Befunden, Hand-off-Kriterien und konkreten Governance-Vorschlägen. Regeländerungen bleiben bis zu einer expliziten Nutzerantwort offen. Alle Konflikte sind vor Abschluss zu lösen oder nach Darstellung ihrer Folgen ausdrücklich durch den Nutzer als Abweichung zu bestätigen.

Sicherung/Archiv: vor Analyse und Bereinigung Bestand vollständig aufnehmen und wiederherstellbar sichern; alle nicht sauberen Repo-Dateien durch zuständige Agenten klassifizieren. Checkpoint-Dateien und Ordnerstruktur erst nach Abschluss, MCP-Einzelreviews und Wiederherstellungsprüfung bereinigen. Ältere MCPs bleiben erhalten; etwaige Löschung wird nur vorgeschlagen.

Nummerierung: CP-IDs fortlaufend und persistent, unabhängig von gelöschten Dateien. Nach CP-0249 wird nach Abschluss des laufenden Arbeitsschritts CP-0250 erstellt und der nächste Analysevorschlag vorgelegt. Künftiger Trigger: CP-0499 führt zu CP-0500 usw. MCP-IDs nutzen MCP-yyyymmttxx (tt = Tag; xx = Tagesfolge).

Keine Produkt-, Architektur- oder Schemaänderung im Rahmen dieses Tickets.


### T-0053 – Bestätigte P-GOV-Regeln übernehmen

Status: COMPLETED (P-GOV-01 bis P-GOV-08 einzeln mit Ja bestätigt und in Control Plane / Rollenunterlagen eingetragen; CP-0252)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR

Ergebnis: Preflight, Berichtsevidenz, A02/A03/A05-Übergabe, Lerninhalts-Gates, Jahres-Smoke-Nachweise, Offlinepaketprüfung, Vorbereitung von Nutzerfragen und Unveränderlichkeit abgeschlossener Checkpoints sind nun verbindlich geregelt. Keine Produktregel, Architektur oder Schemafreigabe geändert. Kein Commit/Push.
### T-0052 – Überholte Audit-Zwischenstände außerhalb des CP-Ordners bereinigen

Status: COMPLETED (nur dynamische Audit-Zwischenstände außerhalb des Checkpointordners bereinigt; CP-0251)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination: A01 – MASTER_ORCHESTRATOR

Ergebnis: T-0051-Zwischenstände CP-0246–CP-0248 aus dem dynamischen Collaboration State entfernt und den aktuellen Stand dort auf CP-0251 zusammengeführt. Keine bestehenden CP-/MCP-Dateien gelöscht oder geändert. Bereits in AGENTS.md, Agentenstruktur und Rechtekarte enthaltene Ergebnisse wurden nicht erneut als offen geführt; nicht eingearbeitete Governance-Vorschläge bleiben bis zur Nutzerdisposition Vorschläge. Vorherige Auditdateien und betroffene Markdown-Quellen sind in einem externen Restore-geprüften ZIP gesichert. Keine Produktänderung, kein Commit/Push.

### T-0049 – Einheitliche 2019-/2027-Neustartprofile

Status: COMPLETED (A01-Umsetzung, Gleichheitsregression und Dokumentationsabgleich; CP-0230)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Das 2019er Startprofil darf sich vom 2027er Profil ausschließlich durch das Startdatum unterscheiden. Den gemeinsamen Spiel-, Betriebs- und Finanzstand herstellen und ältere 2027-Unternehmensdaten nur für historische Regressionen isolieren.

Abschluss: Beide frischen Profile verwenden dieselbe Garage, 10.000 € Bankbestand, keine Anfangsaufträge/-forderungen/-verbindlichkeiten/-Vorräte/-Darlehen/-Maschinen sowie einen Inhaber als einzige Arbeitskraft. Startdatum und Finanzstartdatum sind 01.01.2019 bzw. 01.01.2027. Ein Gleichheitstest normalisiert ausschließlich das Startjahr und vergleicht vollständige Spiel- und Finanzobjekte. Frühere Regressionen mit dem historischen 2027-Betriebsstand verwenden ein separates Test-Fixture; produktive Startfunktionen liefern diesen Bestand nicht mehr. Fachunterlagen kennzeichnen alte 2027-Eröffnungsdaten als historisch. Keine Schemaänderung, kein Commit/Push.


### T-0046 – Eigenständiges iPhone-Paket und Touch-Personalplanung

Status: COMPLETED (A01; Paketprüfung und Nutzerfreigabe der Oberfläche; CP-0226; 2026-10-29)
Master Goal: MG-002
Second-Level Goals: SLG-002.2 / SLG-002.5
Koordination / Umsetzung: A01 – MASTER_ORCHESTRATOR

Aufgabe: Den aktuellen Browserstand als eigenständige, offline nutzbare HTML-Datei und ZIP-Anleitung für iPhone bereitstellen.

Abschluss: HTML enthält alle lokalen Module und Styles; Builder erzeugt HTML und ZIP reproduzierbar. Personalplanung erlaubt Mitarbeiter antippen und anschließend Arbeitsgang antippen; Drag-and-drop bleibt verfügbar. Syntax, interne Imports und ZIP-Struktur geprüft. Nutzer hat die Oberfläche visuell freigegeben. Kein tatsächlicher iPhone-Gerätetest. T-0040 und der fehlgeschlagene Jahressolvabilitäts-Smoke bleiben unabhängig offen; dieses Ticket erteilt keine vollständige V2-Releasefreigabe. Details: CP-0226.


### T-0041 – Lernfragen: Schwierigkeitsstufen, Qualitätsmix und Wiederholung

Status: COMPLETED (A09 Vollreview PASS; 13 Regressionen bestanden; CP-0224; 2026-10-29)
Master Goal: MG-002
Second-Level Goal: SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR

Abschluss: 540 Fragen in neun Fachbereichen, 60 pro Bereich. A09 stufte alle 450 Kernfragen nach Denkoperation ein und prüfte alle 90 Ergänzungen inhaltlich nach. Je Fach werden 20 Fälle pro Stufe erreicht; der Kernbestand ist 20/15/15, ergänzt um je fünf Aufbau- und Transferfälle. Lern-UI, Antwortschlüssel, Quellen-/Kompetenzverweise, Wiederholung und Tageslimit bestehen die vorhandenen Tests. A12s begrenzter isolierter UI-Check steht in CP-0221. Die Einordnung ist redaktionell, keine psychometrische Kalibrierung oder IHK-Zertifizierung. Details: [A09-Review](../learning/a06-a07-a08-a09-review-90-ergaenzungsfragen.md#unabhaengiger-a09-review-2026-10-29), [CP-0224](checkpoints/MCP-2026103001.md#cp-0224).

### T-0043 – A01–A12-Auditbefunde vor T-0041-Abnahme bereinigen

Status: COMPLETED (A01-Fachrollenreview, Regression und isolierter Browsercheck; CP-0221; 2026-10-29)
Master Goal: MG-002
Second-Level Goals: SLG-002.3 / SLG-002.5

Abschluss: Lern-UI-Regression auf 540 Fragen und gemeinsames Tages-/Übungsdeck angepasst; A12 für den isolierten Browserreview aufgenommen; Quellen-/Kompetenzbezüge der Ergänzungen explizit; A05-/A10-Governanceangaben synchronisiert. CP-0224 ergänzt den späteren A09-Inhaltsreview. Browsercheck ohne Import/Änderung eines Nutzerspielstands; Details in CP-0221.

### T-0044 – Rechteprofile A01–A11 und Preflight konsolidieren

Status: COMPLETED (A01; CP-0222; 2026-10-29)
Master Goal: MG-002
Second-Level Goal: SLG-002.5

Abschluss: [Agenten-Rechtekarte](agent-rights-matrix.md) dokumentiert Rollenverantwortung und READ/PROPOSE/VALIDATE/WRITE-/Freigabegrenzen. A05 beschreibt den aktuellen HTML/CSS-/ES-Module-Stack; der bekannte A10-Workflow-Sicherheitsfix ist abgeschlossen. AGENTS.md verankert die Rechtekarte im Pflicht-Preflight. Kein Agent erhält Produkt-, Rechts-, Schema- oder Architekturfreigabe.

### T-0041 – Lernfragen: Schwierigkeitsstufen, Qualitätsmix und Wiederholung

Status: COMPLETED (A09 Vollreview PASS; 13 Regressionen bestanden; CP-0224; 2026-10-29)
Master Goal: MG-002
Second-Level Goal: SLG-002.3
Koordination: A01 – MASTER_ORCHESTRATOR

Abschluss: 540 Fragen in neun Fachbereichen, 60 pro Bereich. A09 stufte alle 450 Kernfragen nach Denkoperation ein und prüfte alle 90 Ergänzungen inhaltlich nach. Je Fach werden 20 Fälle pro Stufe erreicht; der Kernbestand ist 20/15/15 und der Ergänzungsbestand ergänzt je fünf Aufbau- und Transferfälle. Lern-UI, Antwortschlüssel, Quellen-/Kompetenzverweise, Wiederholung und Tageslimit bestehen die vorhandenen Tests. A12s begrenzter isolierter UI-Check steht in CP-0221. Die Einstufung ist redaktionell, keine psychometrische Kalibrierung oder IHK-Zertifizierung. Details: [A09-Review](../learning/a06-a07-a08-a09-review-90-ergaenzungsfragen.md#unabhaengiger-a09-review-2026-10-29), [CP-0224](checkpoints/MCP-2026103001.md#cp-0224).

### T-0043 – A01–A12-Auditbefunde vor T-0041-Abnahme bereinigen

Status: COMPLETED (A01-Fachrollenreview, Regression und isolierter Browsercheck; CP-0221; 2026-10-29)
Master Goal: MG-002
Second-Level Goals: SLG-002.3 / SLG-002.5

Abschluss: Lern-UI-Regression auf 540 Fragen und gemeinsames Tages-/Übungsdeck angepasst; A12 für den isolierten Browserreview aufgenommen; Quellen-/Kompetenzbezüge der Ergänzungen explizit; A05-/A10-Governanceangaben synchronisiert. CP-0224 ergänzt die später erfolgte Inhaltsfreigabe durch A09. Browsercheck ohne Import/Änderung eines Nutzerspielstands; Details in CP-0221.

### T-0044 – Rechteprofile A01–A11 und Preflight konsolidieren

Status: COMPLETED (A01; CP-0222; 2026-10-29)
Master Goal: MG-002
Second-Level Goal: SLG-002.5

Abschluss: [Agenten-Rechtekarte](agent-rights-matrix.md) dokumentiert Rollenverantwortung und READ/PROPOSE/VALIDATE/WRITE-/Freigabegrenzen. A05 beschreibt den aktuellen HTML/CSS-/ES-Module-Stack; der bekannte A10-Workflow-Sicherheitsfix ist abgeschlossen. AGENTS.md verankert die Rechtekarte im Pflicht-Preflight. Kein Agent erhält Produkt-, Rechts-, Schema- oder Architekturfreigabe.

### T-0042 – Browser-Playtest-Agent A12 definieren

Status: COMPLETED (A01-Rollendefinition und Rechteabgrenzung; 2026-10-29; CP-0219)
Master Goal: MG-002
Second-Level Goal: SLG-002.5
Adressat: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Eine eigenständige Browser-Playtest-Rolle samt Fachauftrag, Fähigkeiten, Aufgabenrechten, Sicherheitsgrenzen, Berichtsvorlage und Übergabe reproduzierbarer Situationen an den Nutzer in der bestehenden Agentenstruktur verankern.

Abschluss: A12 – BROWSER_PLAYTEST ist in der Rollenstruktur und im Qualitäts-/Auslieferungsziel ergänzt. Das Rollenprofil grenzt A12 von A09 ab, erlaubt lokale Browserbedienung und isolierte Testspielstände sowie QA-Artefakte und verbietet Produktcode-, Simulations-/Finanzregel-, Nutzerspielstand- und Releaseänderungen. Die Nutzerübergabe verlangt einen direkt ladbaren oder kurz reproduzierbaren Startzustand mit Erwartung und Beleg. Keine Browserprüfung oder Anwendungsänderung war Teil dieses Definitionsauftrags. Nachweis: [CP-0219](checkpoints/MCP-2026103001.md#cp-0219).

### T-0024 – A04-Datenmodell mit aktuellen V1-Entscheidungen synchronisieren

Status: COMPLETED (A01 intern als A04 ausgeführt; 2026-10-27; CP-0193)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Owner: A04 – DATABASE (fachliche Rolle durch A01 ausgeführt)
Koordination: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Überholte Offenmarkierungen und Kalenderaussagen im logischen Datenmodell gegen D-0120 bis D-0129 und D-0134 korrigieren. Historische CP-Verweise als damaligen Stand kennzeichnen. Keine Schema- oder Architekturfreigabe.

Abschluss: Darlehen, Dispositionskredit, Zahlungsreihenfolge und Periodenzuordnung sind aktualisiert; F3/Feiertage sind mit D-0134 abgeglichen; verbleibende offene Punkte sind korrekt eingegrenzt. CP-0193. Keine Schemaänderung, kein Commit/Push.


### T-0023 – Cross-Agent-Konflikte aus CP-0191 bereinigen

Status: COMPLETED (A01 hat die adressierten Fachrollen ausgeführt; 2026-10-27; CP-0192)
Master Goal: MG-001
Second-Level Goal: SLG-001.1
Koordination: A01 – MASTER_ORCHESTRATOR
Adressierte Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A09 QA
Priorität: HIGH

Aufgabe: Die dokumentierten Konflikte und Abdeckungslücken aus CP-0191 beheben. A02 korrigiert den Tagesfilter für wiederholte Zeitarbeitsbuchungen und gleicht die Simulationsspezifikation gegen Urlaub/Krankheit ab. A03 verlagert Immobilienkauf/-verkauf in Finance-eigene Funktionen und synchronisiert die Finanzspezifikation. A04 synchronisiert nur logische Anforderungen zu Facility, Abwesenheit, Zeitarbeit und Ausbildung; keine Schemaänderung. A05 aktualisiert V1-MODELL.md und kennzeichnet automatische Abnahme klar als Spielregel. A09 ergänzt Regressionen für mehrere Zeitarbeitseinsätze und prüft die betroffenen UI-Abläufe.

Zusatzpunkt abgeschlossen: D-0011 bleibt die historische Kernregel; D-0134 hält den später ausdrücklich beauftragten V1-Kalender als konservative Spielkonvention fest.

Akzeptanz: keine stale/conflicting V1-Dokumentation in den betroffenen Themen; wiederholte Buchungen werden eingesetzt oder transparent abgelehnt; Finance-State wird nicht durch UI direkt gebucht; automatisierte Regressionen bestehen; bestehende Architektur- und Datenbankschemafreigaben bleiben unverändert.

Abschlussnachweis: Zeitarbeitsfilter korrigiert und Regression für Einsätze an zwei verschiedenen Tagen ergänzt; Immobilienbuchungen liegen in Finance, UI delegiert und zeigt den Szenariovermögenswert; A02/A03/A04/A05-Dokumentation abgeglichen; Feiertags- und automatische Abnahmeregeln korrekt abgegrenzt. Gezielte Regression, T-0020-Regressionssuite und Jahressmoke bestanden. Details: [CP-0192](checkpoints/MCP-2026103001.md#cp-0192). Keine Schema-/Architekturfreigabe, kein Commit/Push. Browserinteraktion für den vollständigen Playtest bleibt als separates T-0022 offen.


### T-0021 – Goal- und Ticketstatus gegen Checkpoints abgleichen

Status: COMPLETED (2026-10-27; CP-0188)
Master Goal: MG-000
Second-Level Goals: SLG-000.1 / SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe: Goal-Abnahmekriterien und den aktuellen Ticketstatus anhand der maßgeblichen Checkpoints und des Repository-Stands abgleichen. Historische Angaben erhalten und überholte Zustände kenntlich machen. Keine Produkt-, Schema-, Implementierungs- oder Architekturänderung.

Abschlussnachweis: SLG-000.1 anhand T-0001/CP-0182, SLG-000.2 anhand T-0002/CP-0006, CP-0029 und T-0020/CP-0187 bewertet. Goal-/Ticketstatus und Collaboration State konsolidiert; Architektur V0.2 und ADR-001 bis ADR-008 bleiben PROPOSED. Details: [CP-0188](checkpoints/MCP-2026103001.md#cp-0188).

---

### T-0020 – Validierungsbefunde für V1-Finanz- und Auftragsablauf abschließen

Status: COMPLETED (2026-10-27; CP-0187)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A04 DATABASE, A05 FRONTEND, A08 RESEARCH, A09 QA, A10 DEVOPS_INFRASTRUCTURE, A11 TECHNICAL_ARCHITECT
Priorität: HIGH

**Ausgangslage:** Review nach CP-0185 fand Umsetzungslücken trotz COMPLETED-Markierung T-0015–T-0019. T-0020 konsolidiert diese Befunde und ist die maßgebliche Nacharbeit.

**Aufgabe:** V1-Simulations- und Finanzverhalten mit Spezifikation und bestätigten Regeln abstimmen, ohne eine unfreigegebene Zielarchitektur oder ein Datenbankschema einzuführen.

**Abnahmekriterien:**

- Abhängige Planungs-/Fertigungsoperationen können am selben Simulationstag weiterlaufen, sofern Fähigkeiten und Tageskapazitäten reichen; falls die vorhandene Tagesphasenarchitektur das verhindert, Spezifikation und Testverhalten explizit aufeinander abstimmen.
- SimTAX bildet für qualifizierte externe Lieferantenbelege eine getrennte Vorsteuerkomponente ab und verrechnet sie nachvollziehbar mit Ausgangs-SimTAX; Perioden-/Kreditüberträge bleiben reproduzierbar und als Modellregel dokumentiert.
- Offene eigene Verbindlichkeiten protokollieren wöchentliche Fehlversuche bis acht, Zahlungserinnerung zehn Kalendertage nach Fälligkeit und formelle Mahnung 14 Kalendertage später; bezahlte Posten lösen keine späteren Mahnungen aus. Maschinenkredit bleibt separat.
- Beschädigte lokale Spielstände werden vor möglichem Überschreiben geschützt. Wiederherstellung des letzten gültigen Spielstands und bewusster Neustart sind für Nutzer nachvollziehbar.
- Regressionen prüfen die obigen Regeln, Monats-/Steuerabstimmung und Jahreslauf. Mobile UI statisch prüfen; eine nicht ausführbare manuelle Browserprüfung als nicht verifiziert kennzeichnen.
- Research-/Spezifikationsstatus und logisches Datenmodell gegen aktuelle V1-Entscheidungen synchronisieren. Architekturkopplungen dokumentieren, aber keine ADR-/Architekturfreigabe oder Schemaänderung vornehmen.
- Änderungsbericht, QA-Ergebnis und CP; `git diff --check` sauber. Vorhandene Änderungen erhalten; kein Commit/Push ohne gesonderten Auftrag.

**Ergebnis:** Same-Day-Planungs-/Fertigungsketten, getrennte SimTAX-Ausgangs-/Vorsteuerkomponenten mit Guthabenübertrag, allgemeines Dunning, Save-Recovery, mobile UI-Hinweise und Datenmodell-/Spezifikationsabgleich sind umgesetzt und gezielt regressionsgeprüft. Der 365-Tage-Lauf endet am 01.01.2028 ohne Cash-Reconciliation-Fehler. Architekturkopplung ist dokumentiert; keine Schema- oder Architekturfreigabe. `git status` geprüft; `git diff --check` bestanden (nur konfigurierte LF/CRLF-Hinweise). Branch `main`, HEAD `62dbc71`; vorhandene lokale Änderungen und ungetrackte Dateien blieben erhalten. Kein Commit/Push. Ergebnisdetails: [A01-Abschlussbericht](a01-t0020-abschlussbericht.md), [A09-QA-Bericht](a09-t0020-qa-bericht.md), [CP-0187](checkpoints/MCP-2026103001.md#cp-0187).

---

### T-0019 – Auftragspriorisierung, Abnahme und wirtschaftlicher Abschluss

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A09 QA
Priorität: MEDIUM

Aufgabe: Priorisierung bei konkurrierenden Aufträgen sowie Folgen von Verspätung, Abnahmeablehnung, Nacharbeit und Abschluss prüfen. Im UI Fälligkeit, Vertragswirkung, Machbarkeit, Engpass und Deckungsbeitrag als nachvollziehbare Kriterien sichtbar machen. Bestehende Regeln bleiben führend; neue Regeln bei fehlender Grundlage an A01 zur Entscheidung geben.

Ergebnis: Arbeitspriorität ist auswählbar und wirkt deterministisch; Liefertermine und Wirtschaftlichkeitskennzahlen sind in der Auftragsansicht sichtbar. Verspätungen senken Ruf und Kundenbindung nach einer begrenzten V1-Formel. Nach Ablehnung kann einmal nachgearbeitet oder storniert werden; Kosten bereits ausgeführter Arbeit bleiben bestehen. Jahreslauf und Regressionen: [CP-0185](checkpoints/MCP-2026103001.md#cp-0185).

### T-0018 – Monatsabschluss und Finanz-/Steuer-Reconciliation

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A03 ACCOUNTING_FINANCE, A02 SIMULATION, A09 QA
Priorität: HIGH

Aufgabe: Periodenübersichten und Cashflow mit Forderungen, Verbindlichkeiten, Personal, Miete, Energie, Wartung, Material, Zeitarbeit, Finanzierung und SimTAX abstimmen. SimTAX bleibt als Spielmodell gekennzeichnet. Lieferanten-Zahlungsziele und Startposten nicht ohne dokumentierte Fälligkeit/Belege bewegen. Keine steuerrechtliche Vollberechnung oder Bilanzierungsbehauptung ergänzen.

Ergebnis: Monatsabschlüsse stimmen Cashflow, Kosten, Forderungen, offene Kosten, SimTAX, Darlehen und Zinsen ab; ein Jahreslauf meldet keine Cash-Reconciliation-Fehler. V1-SimTAX bleibt Simulation. Nachweis: [CP-0185](checkpoints/MCP-2026103001.md#cp-0185).

### T-0017 – Markt- und Materialpreis-Szenariopfade

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A08 RESEARCH, A02 SIMULATION, A03 ACCOUNTING_FINANCE, A09 QA
Priorität: HIGH

Aufgabe: Reproduzierbare Basis-, Aufwärts- und Abwärtsszenarien für Nachfrage, Stahl, Aluminium, Normteile und Energie definieren. Händlerreferenzpreis, Beobachtungsdatum, Einheit und Marktindex getrennt führen. Makroindex darf nicht direkt als konkreter Einkaufspreis ausgegeben werden. Mit offiziellen Primärdaten und Stressfällen dokumentieren.

Ergebnis: Drei deterministische Szenariopfade ergänzt; der datierte Händlerpreis-Basisstand bleibt getrennt von Preisindizes. Keine Live-Preisbehauptung; der Stresspfad ist ausdrücklich eine Szenarioannahme. Quellen-/Grenzenhinweis und Jahreslauf: [CP-0185](checkpoints/MCP-2026103001.md#cp-0185).

### T-0016 – Angebots-, Preisverhandlungs- und Auftragswirtschaft

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Fachrollen: A02 SIMULATION, A03 ACCOUNTING_FINANCE, A05 FRONTEND, A08 RESEARCH, A09 QA
Priorität: HIGH

Aufgabe: Preisangebot vor Auftragsannahme ermöglichen. Zahlungsziel, Liefertermin, Materialkosten, Arbeits-/Maschinenstunden, Szenario-Gemeinkosten, SimTAX separat, Deckungsbeitrag und Liquiditätswirkung transparent machen. Spieler kann verhandeln, annehmen oder ablehnen, bevor Ressourcen gebunden werden. Ein angenommenes Angebot bleibt Grundlage für Planung, Rechnung und Zahlung. Kosten- und Margenformeln reproduzierbar dokumentieren und mit adversen Aufträgen prüfen.

Ergebnis: Angebotsannahme/-ablehnung, Zahlungsziel und verhandelbarer Nettoerlös sind im UI; angenommene Preise bleiben für Rechnung und Zahlung gespeichert. Deckungsbeitrag, Szenario-Gemeinkosten und SimTAX werden getrennt angezeigt. Reproduzierbare V1-Formeln und Grenzen: [CP-0185](checkpoints/MCP-2026103001.md#cp-0185).
### A01 – V1-Materialpreis-Basis und bedarfsgerechter Anfangsbestand (D-0128 / CP-0181)

Status: COMPLETED (2026-10-27; CP-0185)
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / D-0090–D-0096 / D-0123/24

Der Anfangsbestand deckt die drei bestätigten Aufträge ab: 2.000 kg Stahl, 100 kg Aluminium, 60 Referenzschrauben; Bedarf 172 kg / 90 kg / 56 Stück. Aktuelle Händlerreferenzpreise vom 27.10.2026 ergeben 4.214,20 € Vorratswert. Die Eröffnungsbilanz wurde auf 46.714,20 € und das Dispo-Startlimit auf 4.671,42 € aktualisiert; Eigenkapital als Restposition 15.214,20 €. Die frühere 12.800-€-Vorratsannahme bleibt nur als historischer Entscheidungsstand dokumentiert. Der Preisstand beansprucht keine historische Kostenprovenienz oder HGB-Abschlussqualität. Quellen und Modellgrenzen: [Preis-Basisstand](../market-data/material-price-baseline-2026-10-27.md), [CP-0181](checkpoints/MCP-2026103001.md#cp-0181).

### Historischer A01-Rollenreview und Commit-Kandidatenabgleich (CP-0180; Vorratswerte durch CP-0181 ersetzt)

Status: COMPLETED (2026-10-27; CP-0185)
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0012–T-0014 / CP-0178/0179

A01 hat die Fachstände der Rollen A01–A11 anhand der jeweils zuständigen Unterlagen und V1-Umsetzung geprüft. Behoben wurden die abweichende Dispozinsformel D-0023, nicht normalisierte Partnerabhängigkeiten und eine unklare Abgrenzung der Feiertagserweiterung. Die Darlehensausfall-/Verwertung nach D-0042/43 wurde ergänzt und getestet. Als fachübergreifender Folgepunkt bleiben fehlende Vorjahresschluss-Komponenten für die Vorratsbewertung. Details und Validierung: [CP-0180](checkpoints/MCP-2026103001.md#cp-0180).

Die Review-Unterlagen sind commitbereit als Szenario-Prototyp mit dieser dokumentierten Bewertungsgrenze; sie beanspruchen keine vollständige Bestandsbuchführung. Es wurde nicht committet oder gepusht.

### T-0015 – V1-Zahlungsereignisse an D-0129 angleichen

Status: COMPLETED (2026-10-27; CP-0185)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Koordination: A01 – MASTER_ORCHESTRATOR
Owner: A02 SIMULATION (Ausführung durch A01 gemäß Nutzerauftrag)
Fachreview: A03 ACCOUNTING_FINANCE
UI-Review: A05 FRONTEND
QA: A09 QA
Priorität: HIGH

**Aufgabe**

Den Browser-Prototyp und seine Tests an die bereits festgelegte V1-Ereignisreihenfolge aus D-0120, D-0126 und D-0129 anpassen. Es werden keine neuen Zahlungs-, Steuer- oder Darlehensregeln entschieden.

**Befund im Checkout**

Der aktuelle Ablauf in prototype/app.js ruft nach dem Tagesfortschritt Kundeneingänge, offene Kosten-Retries, Dispozinsberechnung, SimTAX-Zahlung und danach Maschinenkreditraten auf. Das weicht von D-0129 ab, das die Maschinenrate vor den übrigen eigenen Zahlungen vorsieht. Die Spielerreihenfolge eigener Zahlungen muss im UI sichtbar und tatsächlich wirksam sein.

**Zielreihenfolge gemäß Decision Log**

1. Fällige Kundeneingänge ohne eigenes Cash-Gate buchen; daraus Disposchuld zuerst gemäß D-0126 reduzieren.
2. Fällige Maschinenrate und Maschinenkredit-Retries als eigenen Kreditfluss vollständig versuchen.
3. Übrige fällige eigene Rechnungen/Verbindlichkeiten in der vom Spieler festgelegten Reihenfolge voll bezahlen; bei Unterdeckung nur den manuellen Fehlbetragsabruf gemäß D-0125 anbieten. Keine Teilzahlung oder negative Liquidität.
4. Nach den Versuchen offene Posten aktualisieren; an diesem Tag fällige Erinnerungen/Mahnungen nur für weiterhin offene Posten auslösen.
5. Den täglichen Dispozins genau einmal auf Basis des gezogenen Tagessaldos berechnen (Actual/365, keine Tagesrundung); am Monatsende die Monatssumme einmalig auf Cent runden und als Sammelposten belasten. Verschobene Ereignisse dem Monat ihres wirksamen Simulationstags zuordnen.

**Abnahmekriterien**

- Implementierter Ereignisablauf stimmt mit D-0120/D-0126/D-0129 überein; Maschinenkredit bleibt getrennt vom allgemeinen Dunning.
- Spielerreihenfolge eigener fälliger Zahlungen lässt sich im Browser festlegen und beeinflusst die tatsächlichen Vollzahlungsversuche deterministisch.
- Manuelle Dispoziehung bleibt exakt auf den Fehlbetrag begrenzt; automatische Ziehung, Teilzahlung und negative Liquidität entstehen nicht.
- Monatlicher Dispozins wird nicht doppelt berechnet oder gebucht und behält die festgelegte Actual/365-/Rundungsregel.
- Gezielte Regressionen prüfen taggleiche Kundeneingänge, Dispo-Rückführung, knappe Liquidität, Maschinenrate, eigene Rechnungen, Retry/Mahnung und Monatswechsel.
- Bestehender Jahreslauf-Smoke-Test läuft mindestens 365 Tage; Browseransicht einschließlich mobilem UI bleibt bedienbar.
- Änderungsbericht, QA-Ergebnis und Checkpoint; git diff --check erfolgreich.
- Keine Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung; keine Architekturfreigabe.

**Abgrenzung**

D-0010 und bestehende Nutzerentscheidungen bleiben maßgeblich. Falls der Code eine D-Entscheidung nicht abbilden kann, wird die Abweichung an A01 dokumentiert statt eine neue Produktregel einzuführen.

Ergebnis: Tagesablauf folgt Kundeneingang/Disporückführung, Maschinenrate, priorisierten eigenen Betriebsposten, SimTAX und Dispozins. Manuelle Dispoziehung bleibt auf den Fehlbetrag begrenzt. SimTAX hat im V1-Modell eine feste Fälligkeit und wird nach den priorisierten Betriebsposten automatisch versucht; sie wird nicht als frei umsortierbare Lieferantenrechnung angeboten. Regression und Jahreslauf: [CP-0185](checkpoints/MCP-2026103001.md#cp-0185).

---
### T-0014 – Geschäftsnetzwerk und Personalentwicklung in V1

Status: COMPLETED (2026-10-27; CP-0179)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Auf Nutzerauftrag wurden drei fiktive Wettbewerber sowie je fünf Kunden und Lieferanten samt dynamischen Beziehungen, Marktvergabe, Bezugsabhängigkeit, Materialvorlauf und Kundenzahlungsmoral ergänzt. Arbeitsplanung enthält Weiterbildungskurse und eine zweijährige duale Metalltechnik-Ausbildung mit Berufsschule, Betreuung und Monatskosten.

Akzeptanz: mobil erreichbare Netzwerk-/Lernseiten, Datenmigration aus V1-Spielstand, deterministische Jahresläufe inklusive Marktverlust, Zahlungseingangsverzug, Lieferverzug, Kursabschluss und Ausbildungsfortschritt, Rechtsannahmen dokumentiert. Keine Schemaänderung/Architekturfreigabe. Nachweis: [CP-0179](checkpoints/MCP-2026103001.md#cp-0179).

---

### T-0013 – V1-Jahresmodell, Arbeitsplanung und Betriebsressourcen

Status: COMPLETED (2026-10-27; CP-0178)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Auf ausdrücklichen Nutzerauftrag wurde die Browser-V1 um ein Jahresszenario mit synthetischer Volkswirtschaft, Auftragsplanung, Urlaub/Krankheit/Moral, Zeitarbeit, Raumkapazitäten und Mietkosten erweitert. Fehlende Detailentscheidungen wurden als reversible, klar markierte V1-Modellannahmen festgelegt. Keine Schemaänderung, Architekturfreigabe, Commit oder Push.

Akzeptanz: 365-Tage-Lauf, Auftragserzeugung und -abschluss, Finanzperioden, Personalabwesenheiten, Zeitarbeit, Lager-/Raumgrenzen, Browserauslieferung, Rechtsrahmen dokumentiert. Nachweis: [CP-0178](checkpoints/MCP-2026103001.md#cp-0178).

---

### T-0012 – Spielbare Browser-V1 als Prototyp erstellen

Status: COMPLETED (2026-10-27; CP-0159)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 – MASTER_ORCHESTRATOR (führt A02/A03/A05/A09-Arbeit selbst aus)
Priorität: HIGH

Aufgabe:

Auf ausdrücklichen Nutzerauftrag eine schnell spielbare, lokal im Browser ausführbare V1 erstellen. Bestätigte Entscheidungen haben Vorrang; fehlende Startwerte bleiben sichtbar offen. Keine Schemaänderung oder Architekturfreigabe.

Akzeptanzkriterien:

- responsives mobiles Browser-UI mit lokalem Spielstand und Tages-/Wochenfortschritt
- A02-Auftrags-/Kapazitätsabläufe, Lieferung, Abnahme, automatische Kundenrechnung soweit Vertragswert vorliegt, Fälligkeit und Kundeneingang abgebildet
- A03-Eröffnungsbilanz/SimTAX korrekt; unbelegte Preise und Kosten nicht als bestätigte Werte ausgeben
- lokale Startanleitung, Syntax-/Browserprüfung, Checkpoint und `git diff --check`
- keine externe Abhängigkeit, Datenbankschemaänderung, Commit oder Push ohne gesonderten Auftrag

Grundlage: Nutzerauftrag vom 2026-10-27 nach erfolgtem Push; dieser Auftrag hebt T-0010s damaligen Implementierungsausschluss für den Prototyp auf, ohne T-0010 als Spezifikationsarbeit abzuschließen.

---


### T-0010 – A02-Spezifikation für erste spielbare Version überarbeiten

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Priorität: HIGH

Aufgabe:

Die bestehende A02-Spezifikation nach Abschluss der P0-Koordination und Bereitstellung fachlich geprüfter Startwerte erneut prüfen und vor der ersten spielbaren Version sinnvoll ersetzen/überarbeiten. Die bestätigte Warengruppenauswahl gemäß D-0095 integrieren. Norm-/Zukaufteile gemäß D-0096 als nachvollziehbare Artikel statt als einen Durchschnittspreis-Sammelposten abbilden; Schrauben, Muttern und Teile anderer Hersteller sind ausdrücklich Teil der vorgesehenen Gruppe. A02 bestimmt die operative Produkt-/Verbrauchsstruktur, erfindet aber keine Marktpreise und keine A03-Finanzregeln.

Abhängigkeiten:

- T-0008 hat die dafür benötigten Nutzerentscheidungen und Fachübergaben koordiniert.
- T-0011 liefert belegte, als Vorschläge gekennzeichnete Markt-/Referenzdaten.
- A03 bestätigt Startbewertung, Preisbehandlung, Anfangsmengen und accountingrelevante Werte in eigener Fachverantwortung.

Akzeptanzkriterien:

- A02-Spezifikation ist als reproduzierbares Startprofil für eine erste spielbare Version überarbeitet oder durch ein nachvollziehbares Ersatzdokument abgelöst.
- Bestehende bestätigte Simulationsregeln und D-0010-Scope bleiben erhalten.
- Die vom Nutzer bestätigten V1-Warengruppen aus D-0095 werden berücksichtigt; Dienstleistungen/Versorgungsleistungen werden nicht automatisch als Lagerbestand oder Materialverbrauch modelliert.
- Norm-/Zukaufteile sind nicht länger nur ein aggregierter Durchschnittspreis-Sammelposten; Artikeltypen, Einheiten, Mengen und Verbrauchsbezüge sind nachvollziehbar spezifiziert.
- Preise und Anfangswerte stammen aus bestätigten Quellen-/Nutzerwerten; offene A03-Regeln bleiben als offen markiert.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Implementierung, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung und keine Architekturfreigabe.

Grundlage: D-0092 bis D-0096, CP-0118 bis CP-0120. Start erst nach den genannten Abhängigkeiten.

Abschlussnachweis: A02-Startprofil, D-0095-Gruppen und artikelbezogene Norm-/Zukaufteile mit Einheiten/Mengen/Verbrauchsbezügen ergänzt; Preise außerhalb D-0128 bleiben Referenzen. A02-Bericht a02-t0010-v1-startprofil-aenderungsbericht.md; CP-0182.

---

### T-0011 – Marktdaten und Referenzwerte für ausgewählte V1-Warengruppen recherchieren

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A08 RESEARCH
Priorität: HIGH

Aufgabe:

Für die vom Nutzer bestätigten V1-Warengruppen gemäß D-0095 nachvollziehbare aktuelle Markt-/Referenzdaten und realistische Szenariovorschläge recherchieren. Für Norm-/Zukaufteile sind konkrete, repräsentative Artikel wie Schrauben, Muttern und Zukaufteile anderer Hersteller gesondert auszuweisen statt nur eines gemittelten Gruppenpreises. Daten sind mit Quelle, Erhebungs-/Gültigkeitsdatum, Region, Spezifikation, Einheit, Preisbasis und Einschränkungen zu dokumentieren. Die Ergebnisse bleiben Vorschläge bis zur Nutzerbestätigung; A08 entscheidet keine Simulation-, Accounting- oder Produktregel.

Akzeptanzkriterien:

- Quellen und Preis-/Referenzdatum für jede untersuchte Position nachvollziehbar dokumentiert.
- Einzelartikel und Einheiten für Norm-/Zukaufteile werden vorgeschlagen; keine stillschweigende Mittelung der Gruppe.
- Für Dienstleistungen und Versorgungsleistungen werden geeignete Preis-/Einheitenbezüge ausgewiesen und von Lagergütern unterschieden.
- Fehlende, nicht vergleichbare oder nicht belastbare Daten werden als Lücke gekennzeichnet; keine Ersatzwerte erfinden.
- Vorschlagspaket an A01 mit offenen Nutzerentscheidungen; keine Preise als bereits beschlossen darstellen.
- Änderungsbericht und Checkpoint; `git diff --check`.
- Keine Anwendungscode-, Datenbank-/Supabase-/Schema-/Dependency-/Architekturänderung.

Grundlage: D-0093 bis D-0096 und CP-0118 bis CP-0120. Ergebnisse sind Input für T-0010 und für A03s Bewertung unter T-0008.

Abschlussnachweis: Datierter A08-Referenzscan mit Quellen, Preisbasis, Einschränkungen und Datenlücken; nur D-0128-Preise sind als Startwerte festgelegt. CP-0182.

---

### T-0008 – P0-Fachparameter koordinieren und entscheidungsreif vorbereiten

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A01 MASTER_ORCHESTRATOR
Priorität: HIGH

Aufgabe:

Die in CP-0031 und den Fachunterlagen offenen P0-Parameter geordnet koordinieren. A01 koordiniert ausschließlich; keine Fachentscheidung, Implementierung oder Architekturfreigabe. Die dokumentierten Nutzerentscheidungen D-0013 bis D-0127 und die Fachabgleiche CP-0148 ff. sind übernommen; nur tatsächlich offene Parameter und Fachabstimmungen werden weiterverfolgt. A02 hat D-0011 unter T-0009 übernommen; T-0009 ist mit CP-0150 abgeschlossen. Operative Ereignis-/Periodenabstimmungen mit A03 bleiben als getrennte Arbeit unter T-0008 offen.

Akzeptanzkriterien:

- P0-Entscheidungsvorlage mit gesicherten Regeln, präzisen offenen Fragen, Fachrollen und Auswirkungen erstellt
- A02-Abgleich CP-0150/CP-0153, A03-Abgleich CP-0148/CP-0154, A04-Abgleich CP-0151 und A02/A03-Bericht CP-0155 korrekt referenziert; keine nicht erfolgte Arbeit behauptet
- Abhängigkeiten zwischen Kalender-/Simulationsregeln und Finanzregeln dokumentiert
- Kundeneingänge ohne eigenes Cash-Gate und eigene Auszahlungen mit eigenem Liquiditäts-Gate getrennt gehalten
- Beschlossene Darlehensart, Restlaufzeit, Monatsrhythmus, ersten Zahlungstermin und konkrete Rate (D-0121/22) sowie Zinslogik gemäß D-0030 bis D-0043 als entschieden behandeln; A03-Berechnung und A02-Übernahme in CP-0161/0162 dokumentieren
- A03-Abgleich CP-0148/CP-0154 integrieren; A02-T-0009/CP-0150 und CP-0153 sowie A04-CP-0151 und A02/A03-CP-0155 korrekt referenzieren.
- A04-Abschlussabgleich CP-0151, A02-Startprofilkorrektur CP-0153, Vorratsabgleich CP-0154 und Ereignisabstimmung CP-0155 integrieren; aktive Steuerungs- und Fachunterlagen gegen Decision Log und CP-0148 bis CP-0155 validieren.
- D-0010 und ADR-Status unverändert; keine Anwendungscode-, Schema-, Datenbank-, Supabase-, Dependency- oder Architekturänderung
- nächster Nutzerentscheidungs-/Fachübergabepunkt dokumentiert

Historische Zwischenstandsnotizen weiter unten dokumentieren jeweils den damaligen Stand. Der Stand CP-0156 ist durch CP-0180 und die neueren Entscheidungen D-0120 bis D-0127 überholt.

Ergebnisdokument: [P0-Koordinierung offener Fachparameter](p0-offene-parameter-koordinierung.md); Checkpoint [CP-0032](checkpoints/MCP-2026103001.md#cp-0032).

### Historischer Koordinierungsstand (CP-0149)

A03 hat die Finanzunterlagen gegen den Decision Log abgeglichen; siehe [CP-0148](checkpoints/MCP-2026103001.md#cp-0148) und [Abgleichbericht](../accounting/a03-decision-log-abgleich-bericht.md). T-0009 war zu diesem historischen Stand PENDING; A02 hat die Arbeit später ausgeführt und CP-0150 erstellt. A04s CP-0151 lag ebenfalls noch nicht vor.

### Historischer Koordinierungsstand nach A02-/A04-Abgleich (CP-0152; fortgeschrieben durch CP-0153 bis CP-0155)

A02 hat D-0011 übernommen und T-0009 mit CP-0150 abgeschlossen. A04 hat den Datenmodellabgleich in CP-0151 abgeschlossen; A03s Finanzabgleich ist in CP-0148 dokumentiert. T-0008 bleibt IN_PROGRESS und koordiniert die verbleibenden A02/A03-Ereignis- und Periodenabstimmungen. Die Gesamtvalidierung ist noch nicht bestanden: Die A02-Spezifikation enthält im Startprofil weiterhin 40.000 € CNC-Buchwert (D-0099/CP-0148: 0 €) und 3,20 €/kg Stahl (D-0091: Wert aus bereitgestelltem Vorjahresschluss; 3,20 € nicht bestätigt). A02 muss diese alten Angaben aktualisieren oder klar als historische/unbestätigte Vorschläge kennzeichnen. Kein Sicherungs-Commit/Push bis dahin. Nachweise: [CP-0148](checkpoints/MCP-2026103001.md#cp-0148), [CP-0150](checkpoints/MCP-2026103001.md#cp-0150), [CP-0151](checkpoints/MCP-2026103001.md#cp-0151), [CP-0152](checkpoints/MCP-2026103001.md#cp-0152).

### Historischer A01-Koordinierungsstand nach CP-0155 (CP-0156; durch CP-0180 überholt)

A02 hat D-0011 unter T-0009 übernommen; T-0009 ist abgeschlossen (CP-0150). Die aktiven Startprofilangaben wurden gemäß D-0091/D-0099 korrigiert (CP-0153). A03 bestätigt den Gesamtvorratswert von 12.800 €, aber keine bestätigten Einzelgruppenwerte; ein Stahlwert wird nicht als Differenz hergeleitet (CP-0154). A04 hat den Datenmodellabgleich abgeschlossen (CP-0151). A02/A03 haben bestätigte Finanz-/Simulationsregeln und verbleibende Ereignis-/Periodenlücken abgeglichen (CP-0155).

T-0008 bleibt IN_PROGRESS; T-0009 ist COMPLETED. Die Dokumentationsvalidierung ist mit CP-0156 bestanden. Offen bleiben die Nutzerfrage zur Verfügbarkeit gleichentägiger Kundeneingänge vor eigenen Zahlungsversuchen bei knappem Cash, technische Ereignis-/Periodendetails, Darlehensrate und erster tatsächlicher Zahlungstermin sowie die Übergabe belegter Vorratswerte. Die Nutzerfrage bleibt bis nach der Sicherung zurückgestellt. Gesamtvalidierung der aktiven Dokumente bestanden; Sicherungs-Checkpoint: CP-0156. Nachweise: CP-0148 bis CP-0156.

Zwischenstand 2026-10-25: A03 hat die Finanzparameter entscheidungsreif aufbereitet; [A03-Entscheidungsvorlage](../accounting/a03-p0-finanzparameter-entscheidungsvorlage.md), [Änderungsbericht](../accounting/a03-p0-finanzparameter-aenderungsbericht.md) und [CP-0035](checkpoints/MCP-2026103001.md#cp-0035). Kein separates A03-Ticket angelegt. A02-Abstimmung zu Fälligkeit/Ereignisbezug bleibt nach T-0009 und Nutzerantworten offen. Koordinationsnachweis: [CP-0037](checkpoints/MCP-2026103001.md#cp-0037).

Nutzerentscheidung D-0013: Für Kundenforderungen gilt der spätere Zeitpunkt aus Rechnung und tatsächlicher Leistung als Fristanker; bei Leistung ausschließlich durch Lieferung gilt das Lieferdatum. Lieferanten-Fristanker und Zähltage sind davon nicht entschieden. Nutzerfragen werden einzeln gestellt. Nachweis: [CP-0038](checkpoints/MCP-2026103001.md#cp-0038).

Nutzerentscheidung D-0014: Für V1-Lieferantenverbindlichkeiten gilt bei pünktlicher Lieferung das Rechnungsdatum als Fristanker; spätere Vertragsausgestaltungen dürfen gemäß jeweiliger Vereinbarung einen anderen Anker, etwa Wareneingang, nutzen. Zähltage und 14-/30-Tage-Wahl bleiben offen. Nachweis: [CP-0039](checkpoints/MCP-2026103001.md#cp-0039).

Nutzerentscheidung D-0015: Zahlungsziele für Kundenforderungen zählen in V1 Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Ankertagszählung sowie die Zählweise für Lieferantenverbindlichkeiten bleiben offen. Nachweis: [CP-0040](checkpoints/MCP-2026103001.md#cp-0040).

Nutzerentscheidung D-0016: Zahlungsziele für Lieferantenverbindlichkeiten zählen in V1 ebenfalls Kalendertage; Wochenendtermine werden gemäß D-0011 auf den nächsten Arbeitstag verschoben. Die Ankertagszählung bleibt offen. Nachweis: [CP-0041](checkpoints/MCP-2026103001.md#cp-0041).

Nutzerentscheidung D-0017: Bei Kundenforderungen und Lieferantenverbindlichkeiten zählt der jeweilige Ankertag als Tag 1; damit gilt vor Wochenendverschiebung Ankerdatum + (N−1) Kalendertage. Nachweis: [CP-0042](checkpoints/MCP-2026103001.md#cp-0042).

Nutzerentscheidung D-0018: Für Kundenforderungen gilt in V1 gemäß AGB ein Zahlungsziel von 14 Kalendertagen. Einzelvereinbarungen sind möglich und können bei kundenspezifischen Sonderwünschen eine höhere Marge ermöglichen; konkrete abweichende Frist und Margenformel bleiben offen. Nachweis: [CP-0043](checkpoints/MCP-2026103001.md#cp-0043). Die nächste Rückfrage klärt, ob 30 Kalendertage die vorgesehene konkrete V1-Alternative für Einzelvereinbarungen sind.

Nutzerentscheidung D-0019: Die konkrete V1-Alternative bei individueller Kundenvereinbarung beträgt 30 Kalendertage; die Margenformel bleibt offen. Nachweis: [CP-0044](checkpoints/MCP-2026103001.md#cp-0044).

Nutzerentscheidung D-0020: Für Lieferantenverbindlichkeiten gelten standardmäßig 30 Kalendertage; Abweichungen sind in Ereignissen oder Dauerverträgen möglich. Konkrete Sonderkonditionen bleiben offen. Nachweis: [CP-0045](checkpoints/MCP-2026103001.md#cp-0045).

Nutzerentscheidung D-0021: Der Spieler wählt, welche fälligen eigenen Rechnungen zuerst bezahlt werden; die Nutzung eines Dispositionskredits wird als weitere Option angeboten, mit einem Zinssatz 8 Basispunkte über dem durchschnittlichen Zinssatz. Bezugsgröße des Durchschnittszinses sowie Kreditregeln, Maximalverschuldung und Insolvenz sind offen und separat zu prüfen. Nachweis: [CP-0046](checkpoints/MCP-2026103001.md#cp-0046).

Nutzerentscheidung D-0022/D-0023: Der Bankzinssatz wird zu Spielbeginn und jährlich individuell auf Basis EZB-Zinssatz plus Unternehmensaufschlag anhand Eigenkapitalquote, Bilanzsumme und Zahlungsmoral vereinbart. Mittelwert: EZB +3 Prozentpunkte; Spanne: +0,5 bis +5,5 Prozentpunkte. Der Dispositionskreditzins liegt 8 % über diesem individuell vereinbarten Zinssatz. EZB-Referenzsatz und Bewertungsformel bleiben offen; Kreditregeln/Maximalverschuldung/Insolvenz sind separat zu prüfen. Nachweis: [CP-0047](checkpoints/MCP-2026103001.md#cp-0047).

Nutzerentscheidung D-0024: Nach fehlgeschlagenem Zahlversuch einer eigenen Verbindlichkeit erfolgt der nächste Versuch nach einer Woche. Anzahl/Ende und genauer Bezugspunkt der Wochenfrist bleiben offen. Nachweis: [CP-0048](checkpoints/MCP-2026103001.md#cp-0048).

Nutzerentscheidung D-0025: Nach achtmaligem Scheitern gilt das Spiel als verloren. Noch offen ist, ob der erste fehlgeschlagene Fälligkeitsversuch bereits mitzählt. Nachweis: [CP-0049](checkpoints/MCP-2026103001.md#cp-0049).

Nutzerklarstellung D-0026: Gemeint sind acht Wiederholungsversuche nach dem ersten fehlgeschlagenen Fälligkeitsversuch. Nach dem achten fehlgeschlagenen Retry ist das Spiel verloren. Nachweis: [CP-0050](checkpoints/MCP-2026103001.md#cp-0050).

Nutzerentscheidung D-0027: Die erste Zahlungserinnerung wird zehn Kalendertage nach dem ersten fehlgeschlagenen Zahlversuch ausgelöst. Weitere Mahnstufen bleiben offen. Nachweis: [CP-0051](checkpoints/MCP-2026103001.md#cp-0051).

Nutzerentscheidung D-0028: Die formelle Mahnung wird 14 Kalendertage nach der Zahlungserinnerung ausgelöst. Dies ist eine V1-Spielregel, keine gesetzlich vorgeschriebene Frist nach § 286 BGB. Nachweis: [CP-0052](checkpoints/MCP-2026103001.md#cp-0052).

Nutzerentscheidung D-0029: Nach der formellen Mahnung erfolgt in V1 keine weitere Eskalation bis Pfändung oder Liquidation; solche Ereignisse sind für spätere Versionen vorgesehen. Nachweis: [CP-0053](checkpoints/MCP-2026103001.md#cp-0053).

Nutzerentscheidung D-0030: Das Maschinendarlehen ist ein gleichbleibendes Annuitätendarlehen. Restlaufzeit, Rate, Zahlungstermine, Tilgungsbeginn und Zinsberechnung bleiben offen. Nachweis: [CP-0054](checkpoints/MCP-2026103001.md#cp-0054).

Nutzerentscheidung D-0031: Zum Simulationsstart am 01.01.2027 beträgt die Restlaufzeit des Annuitätendarlehens sieben Jahre. Ratenfrequenz und konkrete Zahlungstermine bleiben offen. Nachweis: [CP-0055](checkpoints/MCP-2026103001.md#cp-0055).

Nutzerentscheidung D-0032: Die Annuität wird monatlich gezahlt. Erste Rate, monatlicher Zahlungstag und Annuitätenhöhe bleiben offen. Nachweis: [CP-0056](checkpoints/MCP-2026103001.md#cp-0056).

Nutzerentscheidung D-0033: Die Monatsrate ist am letzten Geschäftstag des Monats fällig. Gemäß D-0011 ist für Januar 2027 der erste Termin Freitag, 29.01.2027; Feiertage bleiben unberücksichtigt. Annuitätenhöhe und Zinsberechnung bleiben offen. Nachweis: [CP-0057](checkpoints/MCP-2026103001.md#cp-0057).

Nutzerentscheidung D-0034: Der Darlehenszins wird nach 30/360 zeitanteilig berechnet. Konkrete Monatsend-Variante und Bezugsbasis innerhalb der Zinsperiode bleiben offen. Nachweis: [CP-0058](checkpoints/MCP-2026103001.md#cp-0058).

Nutzerentscheidung D-0035: Es gilt die deutsche Zinsmethode 30E/360; damit ist die konkrete Monatsend-Variante festgelegt. Die Zinsbezugsbasis innerhalb der Periode bleibt offen. Nachweis: [CP-0059](checkpoints/MCP-2026103001.md#cp-0059).

Nutzerentscheidung D-0036: Verzinst wird das Restschuldsaldo. Die Rundungsregel für monatliche Zinsbeträge bleibt offen. Nachweis: [CP-0060](checkpoints/MCP-2026103001.md#cp-0060).

Nutzerentscheidung D-0037: Monatliche Darlehenszinsen werden kaufmännisch auf Cent gerundet. Nachweis: [CP-0061](checkpoints/MCP-2026103001.md#cp-0061).

Nutzerentscheidung D-0038: Ein aus der kaufmännischen Cent-Rundung verbleibender Darlehensrest wird in der letzten Rate bezahlt. T-0008 bleibt IN_PROGRESS; T-0009 bleibt PENDING. Nachweis: [CP-0062](checkpoints/MCP-2026103001.md#cp-0062).

Nutzerentscheidung D-0039: Der nominale Darlehenszinssatz von 5 % p.a. gilt während der siebenjährigen Restlaufzeit fest. Nachweis: [CP-0063](checkpoints/MCP-2026103001.md#cp-0063).

Nutzerentscheidung D-0040: Darlehenszinsen werden zusammen mit der monatlichen Annuitätenrate gezahlt. Der Stichtag für das maßgebliche Restschuldsaldo bleibt offen. Nachweis: [CP-0064](checkpoints/MCP-2026103001.md#cp-0064).

Nutzerentscheidung D-0041: Für die Zinsperiode gilt der Kalendertag vor der nächsten Rate als Stichtag des maßgeblichen Restschuldsaldos. Nachweis: [CP-0065](checkpoints/MCP-2026103001.md#cp-0065).

Nutzerentscheidung D-0042: Nichtzahlung einer Maschinenrate führt sofort zu Verzug und wöchentlichen Wiederholungsversuchen. Bei insgesamt drei nicht gezahlten Raten wird die Maschine gepfändet und zum aktuellen Marktwert liquidiert; Erlös tilgt das Darlehen, Überschuss wird dem Geschäftskonto gutgeschrieben. Folgen eines Erlösdefizits bleiben offen. Nachweis: [CP-0066](checkpoints/MCP-2026103001.md#cp-0066).

Nutzerentscheidung D-0043: Eine nach der Maschinenverwertung verbleibende Restschuld erlischt, da die Maschine als Pfand für den Kredit akzeptiert wurde. Nachweis: [CP-0067](checkpoints/MCP-2026103001.md#cp-0067).

Nutzerentscheidung D-0044: V1 soll relevante Ressourcen und Produkte in einem Hintergrund-Wirtschaftssystem tracken. Marktpreise werden als statische Zahlen mit linearer jährlicher Preissteigerung von 2 % modelliert; Maschinen und andere Güter verlieren gemäß fester Nutzungsdauer anteilig an Wert. Maschinenmarktwert bei Verwertung: jährlich um 2 % angepasster Neupreis abzüglich des Wertverlusts aus laufender Nutzung. Konkrete Formel, Basispreise und Nutzungsdauern bleiben offen. Nachweis: [CP-0068](checkpoints/MCP-2026103001.md#cp-0068).

Nutzerentscheidung D-0045: Die geplante Gesamtnutzungsdauer der vorhandenen, bei Simulationsstart acht Jahre alten CNC-Fräsmaschine beträgt 16 Jahre. Damit verbleiben rechnerisch acht Jahre. Der Eröffnungsbuchwert von 40.000 € bleibt unberührt; genaue Marktwert- und Abschreibungsberechnung bleibt offen. Nachweis: [CP-0069](checkpoints/MCP-2026103001.md#cp-0069).

Nutzerentscheidung D-0046: Der ursprüngliche Anschaffungswert von 120.000 € gilt als statischer V1-Basispreis der CNC für die lineare jährliche Preissteigerung von 2 %. Die konkrete Verrechnung mit dem Wertverlust nach Nutzungsdauer bleibt offen. Nachweis: [CP-0070](checkpoints/MCP-2026103001.md#cp-0070).

Nutzerentscheidung D-0047: Der inflationsangepasste CNC-Neupreis beträgt `120.000 € × 1,02^(aktuelles Jahr − Startjahr)`. Die Abwertung aufgrund bisheriger Nutzung bleibt offen. Nachweis: [CP-0071](checkpoints/MCP-2026103001.md#cp-0071).

Nutzerentscheidung D-0048: Zum Simulationsstart wird wegen acht bereits genutzter Jahre bei 16 Jahren Gesamtnutzungsdauer ein Nutzungswertverlust von 50 % angesetzt; der Marktwertansatz beträgt damit 50 % des inflationsangepassten Neupreises. Die Fortschreibung nach Simulationsstart bleibt offen. Nachweis: [CP-0072](checkpoints/MCP-2026103001.md#cp-0072).

Nutzerentscheidung D-0049: Der Restwertfaktor lautet `(maximale Nutzungsdauer − genutzte Dauer) / maximale Nutzungsdauer` und wird mit dem Anschaffungswert multipliziert. Offen: welcher Anschaffungswert als Multiplikator gilt und ob eine Untergrenze bei Überschreiten der maximalen Nutzungsdauer gilt. Nachweis: [CP-0073](checkpoints/MCP-2026103001.md#cp-0073).

Nutzerentscheidung D-0050: Der Restwertfaktor wird immer auf Grundlage des Anschaffungspreises angewendet. Offen bleibt, ob und wie die jährliche Preisfortschreibung zusätzlich in den Verwertungsmarktwert einfließt. Nachweis: [CP-0074](checkpoints/MCP-2026103001.md#cp-0074).

Nutzerentscheidung D-0051: Der CNC-Restwert berechnet sich ausschließlich aus dem ursprünglichen Anschaffungspreis von 120.000 € mal Restwertfaktor; die jährliche Preisfortschreibung fließt nicht ein. Untergrenze bei Überschreiten der maximalen Nutzungsdauer bleibt offen. Nachweis: [CP-0075](checkpoints/MCP-2026103001.md#cp-0075).

Nutzerentscheidung D-0052: Der Restwert wird bei 0 € begrenzt; ein negativer rechnerischer Wert bei Erreichen/Überschreiten der maximalen Nutzungsdauer wird auf 0 € gesetzt. Nachweis: [CP-0076](checkpoints/MCP-2026103001.md#cp-0076).

Nutzerentscheidung D-0053: SimTAX-Bemessungsbasis je Rechnungsposition ist der bestätigte Positionswert vor SimTAX. Rundungsdetails bei exakt halbem Cent und Anwendungsbereich bleiben offen. Nachweis: [CP-0077](checkpoints/MCP-2026103001.md#cp-0077).

Nutzerentscheidung D-0054: SimTAX-Beträge werden bei exakt halben Centbeträgen kaufmännisch gerundet, weiterhin je Rechnungsposition und danach summiert. Nachweis: [CP-0078](checkpoints/MCP-2026103001.md#cp-0078).

Nutzerentscheidung D-0055: SimTAX wird je Rechnungsposition auf den Positionsgesamtbetrag angewendet und kaufmännisch gerundet; keine Berechnung je einzelner Einheit. Nachweis: [CP-0079](checkpoints/MCP-2026103001.md#cp-0079).

Nutzerentscheidung D-0056: SimTAX gilt bei jeder externen Rechnungsstellung. Steuerzahlungen und innerbetriebliche Ausgleiche sind ausgenommen; eingehende externe Rechnungen werden dadurch nicht automatisch klassifiziert. Nachweis: [CP-0080](checkpoints/MCP-2026103001.md#cp-0080).

Nutzerentscheidung D-0057: Bei Rechnungskorrekturen wird der ursprüngliche gerundete SimTAX-Betrag referenziert umgekehrt und die Korrektur separat ausgewiesen. Nachweis: [CP-0081](checkpoints/MCP-2026103001.md#cp-0081).

Nutzerentscheidung D-0058: SimTAX erhält eine getrennte Rechnungskomponente und eigene Simulationssaldo-Sicht zum Gegenrechnen von Vorsteuer/Umsatzsteuer; Zahlung gemäß Grundsätzen von UStG und AO. Abrechnungszeitraum und Zahlungsmechanik bleiben offen. Nachweis: [CP-0082](checkpoints/MCP-2026103001.md#cp-0082).

Nutzerentscheidung D-0059: Der SimTAX-Abrechnungszeitraum richtet sich nach dem UStG; konkrete Eingangsparameter zur Periodenbestimmung und Zahlungsmechanik sind noch offen. Nachweis: [CP-0083](checkpoints/MCP-2026103001.md#cp-0083).

Nutzerszenariowert D-0060: Für 2026 wird fiktiv ein Umsatz von 5.000 € pro Woche angenommen. Dieser Wert wird nicht zur Ableitung des für die Periodenwahl maßgeblichen Steuerbetrags verwendet. Nachweis: [CP-0084](checkpoints/MCP-2026103001.md#cp-0084).

Nutzerszenariowert D-0061: Für 2026 wird ein fiktiver maßgeblicher Umsatzsteuerbetrag von 49.400 € als Vorjahresparameter für die SimTAX-Periodenbestimmung gemäß UStG angesetzt; der Betrag wird nicht aus D-0060 abgeleitet. Die konkrete Zahlungsmechanik bleibt offen. Nachweis: [CP-0085](checkpoints/MCP-2026103001.md#cp-0085).

Nutzerentscheidung D-0062: Der MGK-Zuschlag im V1-BAB beträgt 15 % der MEK; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0086](checkpoints/MCP-2026103001.md#cp-0086).

Nutzerentscheidung D-0063: Der FGK-Zuschlag im V1-BAB beträgt 100 % der Fertigungslöhne; übernommen aus dem A03-Arbeitsvorschlag. Weitere BAB-Sätze und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0087](checkpoints/MCP-2026103001.md#cp-0087).

Nutzerentscheidung D-0064: Der Vw/Vt-GK-Zuschlag im V1-BAB beträgt 10 % der Herstellkosten; übernommen aus dem A03-Arbeitsvorschlag. Weitere Zuordnungen und konkrete Kostenwerte bleiben offen. Nachweis: [CP-0088](checkpoints/MCP-2026103001.md#cp-0088).

Nutzerentscheidung D-0065: Die monatliche Bruttolohnsumme des Personals im V1-Startprofil beträgt insgesamt 10.400 €. Rollenaufteilung, Arbeitgebergesamtkosten und FGK-Bemessungsbasis bleiben offen. Nachweis: [CP-0089](checkpoints/MCP-2026103001.md#cp-0089).

Nutzerentscheidung D-0066: Fertigungslöhne für den 100-%-FGK-Zuschlag sind MA-CNC (3.800 €) plus MA-PROD (3.100 €), zusammen 6.900 € monatlich; MA-AV zählt nicht dazu. Arbeitgebergesamtkosten bleiben offen. Nachweis: [CP-0090](checkpoints/MCP-2026103001.md#cp-0090).

Nutzerentscheidung D-0067: Arbeitgebergesamtkosten werden zusätzlich zu den Bruttolöhnen im V1-Personalaufwand berücksichtigt; Betrag und Berechnungsregel bleiben offen. Nachweis: [CP-0091](checkpoints/MCP-2026103001.md#cp-0091).

Nutzerentscheidung D-0068: Arbeitgebergesamtkosten werden mit 21 % der monatlichen Bruttolohnsumme von 10.400 € angesetzt (2.184 € zusätzlich; 12.584 € Personalaufwand insgesamt pro Monat). Nachweis: [CP-0092](checkpoints/MCP-2026103001.md#cp-0092).

Nutzerentscheidung D-0069: Die Arbeitgeberkosten von 21 % auf MA-CNC/MA-PROD zählen zur FGK-Basis; diese beträgt 8.349 € monatlich und ergibt bei 100 % Zuschlag 8.349 € FGK. MA-AV bleibt ausgeschlossen. Nachweis: [CP-0093](checkpoints/MCP-2026103001.md#cp-0093).

Nutzerentscheidung D-0070: MA-AV-Personalaufwand von 4.235 € pro Monat inklusive 21 % Arbeitgeberkosten gehört in den Vw/Vt-GK-Pool und wird nicht separat daneben angesetzt; der 10-%-Zuschlag auf HK bleibt bestehen. Nachweis: [CP-0094](checkpoints/MCP-2026103001.md#cp-0094).

Nutzerentscheidung D-0071: CNC-Abschreibung wird in V1 als FGK im BAB berücksichtigt. Abschreibungsbasis, Methode, Zeitraum und Betrag sind noch offen; die Restwert-/Verwertungsregel ist dafür kein automatischer Ersatz. Nachweis: [CP-0095](checkpoints/MCP-2026103001.md#cp-0095).

Nutzerentscheidung D-0072: Die CNC-BAB-Kalkulation soll Wiederbeschaffungskosten einschließlich 2-%-Inflation im maßgeblichen Betrachtungszeitraum berücksichtigen; Zeitraum und Umlegung bleiben offen. Nachweis: [CP-0096](checkpoints/MCP-2026103001.md#cp-0096).

Nutzerentscheidung D-0073: Für den Inflationszeitraum wird die gesamte CNC-Nutzungsdauer von 16 Jahren angesetzt; die acht verbleibenden Jahre sind nicht maßgeblich. Preisbezugsformel: 120.000 € × 1,02^16. Umlegung auf BAB-Periodenkosten und konkrete Buchabschreibung bleiben offen. Nachweis: [CP-0097](checkpoints/MCP-2026103001.md#cp-0097).

Nutzerentscheidung D-0074: Der inflationsangepasste CNC-Wiederbeschaffungswert wird gleichmäßig auf einen Monat der 16-jährigen Gesamtnutzungsdauer verteilt (192 Monate). Monatlicher BAB-Bezugsbetrag: `(120.000 € × 1,02^16) / 192`. Rundung des Monatsbetrags und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0098](checkpoints/MCP-2026103001.md#cp-0098).

Nutzerentscheidung D-0075: Der monatliche CNC-BAB-Bezugsbetrag wird für die Kalkulation immer aufgerundet. Rundungsgenauigkeit/Einheit und vollständige Buchabschreibungsbehandlung bleiben offen. Nachweis: [CP-0099](checkpoints/MCP-2026103001.md#cp-0099).

Nutzerentscheidung D-0076: Der monatliche CNC-BAB-Bezugsbetrag wird stets auf den nächsten vollen Euro aufgerundet. Bilanzielle Buchabschreibungsbehandlung bleibt davon getrennt offen. Nachweis: [CP-0100](checkpoints/MCP-2026103001.md#cp-0100).

Nutzerentscheidung D-0077: V1 führt zusätzlich zur kalkulatorischen BAB-Kostenbasis eine separate bilanzielle Buchabschreibung der CNC. Methode, Berechnungsbasis, Beginn, Restlaufzeit, Restwert und Betrag sind offen. Nachweis: [CP-0101](checkpoints/MCP-2026103001.md#cp-0101).

Nutzerentscheidung D-0078: Laufende Anschaffungen werden linear nach der AfA-Tabelle des Bundesfinanzministeriums abgeschrieben; die Abschreibungsmethode für Neuanschaffungen wird einmal jährlich festgelegt. AfA-Tabellenposition/Nutzungsdauer der bestehenden CNC und konkrete Abschreibungsparameter bleiben offen. Nachweis: [CP-0102](checkpoints/MCP-2026103001.md#cp-0102).

Nutzerentscheidung D-0079: Die jährliche Festlegung der Abschreibungsmethode für Neuanschaffungen ist eine Spielerentscheidung. Welche Methoden auswählbar sind, bleibt offen. Nachweis: [CP-0103](checkpoints/MCP-2026103001.md#cp-0103).

Nutzerkorrektur D-0080: Die Methodenabfrage erfolgt einmal zu Spielbeginn. Danach kann der Spieler die Methode in einem Menü für zukünftige Neuanschaffungen ändern. Angeboten werden lineare AfA, degressive AfA sowie GWG-Sofortabzug und GWG-Sammelposten unter Berücksichtigung der Grenzen. Die Auswahlregel im GWG-Überschneidungsbereich und die zeitliche Zulässigkeit der degressiven AfA bleiben offen. Nachweis: [CP-0104](checkpoints/MCP-2026103001.md#cp-0104).

Nutzerentscheidung D-0081: Für GWG im Überschneidungsbereich über 250 € bis einschließlich 800 € wird einheitlich je Wirtschaftsjahr zwischen Sofortabzug und Sammelposten entschieden; keine unterschiedliche Wahl je Anschaffung innerhalb desselben Jahres. Nachweis: [CP-0105](checkpoints/MCP-2026103001.md#cp-0105).

Nutzerentscheidung D-0082: Eine im Menü geänderte GWG-Methode wird ab dem nächsten Wirtschaftsjahr wirksam. Nachweis: [CP-0106](checkpoints/MCP-2026103001.md#cp-0106).

Nutzerentscheidung D-0083: Die degressive AfA bleibt auch nach dem derzeit dokumentierten gesetzlichen Zeitraum als vereinfachte Spielregel im Spiel verfügbar. Daraus wird keine steuerrechtliche Zulässigkeit für diesen Zeitraum abgeleitet. Nachweis: [CP-0107](checkpoints/MCP-2026103001.md#cp-0107).

Nutzerentscheidung D-0084: Der degressive AfA-Satz ist der niedrigere Wert aus 30 % und dem Dreifachen des linearen AfA-Satzes; angewendet wird er auf den jeweiligen Restbuchwert. Für spätere Spieljahre gilt dies gemäß D-0083 als vereinfachte Spielregel. Nachweis: [CP-0108](checkpoints/MCP-2026103001.md#cp-0108).

Nutzerentscheidung D-0085: Für die separate lineare bilanzielle Buchabschreibung der bestehenden CNC ist die einschlägige Nutzungsdauer laut BMF-AfA-Tabelle maßgeblich; konkrete Tabellenposition und Restdauer bleiben offen. Nachweis: [CP-0109](checkpoints/MCP-2026103001.md#cp-0109).

Nutzerentscheidung D-0086: Die Bemessungsbasis der CNC-Buchabschreibung sind die ursprünglichen Anschaffungskosten von 120.000 € abzüglich bereits erfolgter AfA; der Eröffnungsbuchwert bleibt 40.000 €. AfA-Verlauf und Restdauer sind fachlich abzugleichen. Nachweis: [CP-0110](checkpoints/MCP-2026103001.md#cp-0110).

Nutzerentscheidung D-0087: Für AfA-Gegenstände im Startbestand ist der Abschreibungstermin der erste Arbeitstag des zweiten Quartals; Neuanschaffungen folgen den jeweils geltenden gesetzlichen Vorgaben. Nachweis: [CP-0111](checkpoints/MCP-2026103001.md#cp-0111).

Nutzerentscheidung D-0088: Am Termin im ersten Arbeitstag des zweiten Quartals wird für die AfA-Gegenstände des Startbestands die AfA des laufenden Wirtschaftsjahrs erfasst. Nachweis: [CP-0112](checkpoints/MCP-2026103001.md#cp-0112).

Abgleich abgeschlossen: Der Nutzer hat den CNC-Anschaffungszeitpunkt auf 01.01.2019 festgelegt. Damit beträgt die Nutzungszeit am Simulationsstart 01.01.2027 genau acht Jahre; D-0045/D-0048 bleiben konsistent. Nachweis: [D-0089](decision-log.md#d-0089--cnc-anschaffungsdatum-auf-01012019-angepasst), [CP-0114](checkpoints/MCP-2026103001.md#cp-0114).

Zwischenstand 2026-10-25: Der Nutzer hat den V1-Arbeitskalender gemäß D-0011 bestätigt. A02-Übernahme in die Simulationsspezifikation und Abstimmung der offenen 14-/30-Tage-Fälligkeit mit A03 stehen noch aus; T-0008 bleibt IN_PROGRESS. Nachweis: [CP-0033](checkpoints/MCP-2026103001.md#cp-0033).

Abschlussnachweis: bestätigte Regeln und V1-Ereignis-/Periodenkonventionen konsolidiert; Erweiterungs- und historische Belegfragen außerhalb V1 markiert. CP-0182.

---

### T-0001 – Agent Control Plane implementieren

Status: COMPLETED (2026-10-27; CP-0182)
Master Goal: MG-000
Second-Level Goal: SLG-000.1
Owner: A10 DEVOPS_INFRASTRUCTURE
Priorität: HIGH

Aufgabe:

AGENTS.md und die strukturierte Agenten-Control-Plane mit Agentenstruktur, Goals, Tickets, Collaboration State, Decision Log, Preflight und Checkpoint-Regeln etablieren.

Akzeptanzkriterien:

- Preflight verbindlich dokumentiert
- A01–A11 definiert
- aktuelle Goals definiert
- Ticketfilter definiert
- abgeschlossene Second-Level Goals aus aktivem Kontext ausgeschlossen
- Checkpoint-Regel dokumentiert
- Kommunikationsformat dokumentiert
- keine Anwendungscodeänderung
- keine Supabaseänderung
- keine Dependencyänderung

Abschlussnachweis: Preflight, Agentenstruktur A01–A11, aktive Goals, Ticketfilter, Checkpoint- und Kommunikationsregeln sind im Repository dokumentiert. CP-0182.

---


### T-0009 – D-0011-Arbeitskalender in A02-Spezifikation übernehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION
Abschlussnachweis: A02-Änderungsbericht und [CP-0150](checkpoints/MCP-2026103001.md#cp-0150).

A02 hat D-0011 in die Simulationsspezifikation übernommen: Montag bis Freitag mit 8 Stunden Tageskapazität für Beschäftigte und CNC, Wochenenden arbeitsfrei, Feiertage in V1 unberücksichtigt, Wochenendtermine am nächsten Arbeitstag und F3 mit fünf Arbeitstagen ab Folgetag nach vollständiger Lieferung. Der aktuelle A02/A03-Ereignis- und Periodenabgleich bleibt als Koordinierungsarbeit unter T-0008 offen; er ändert die bestätigten Vertragsfristregeln D-0013 bis D-0020 nicht. Keine Implementierungs-, Schema- oder Architekturfreigabe.

---

### T-0006 – Maschinenbau-MVP: fachliches und technisches Datenmodell konkretisieren

Status: COMPLETED – A09 QA BESTANDEN (CP-0013)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A04 DATABASE
Priorität: HIGH

Aufgabe und Mindestumfang gemäß D-0010, A02-Simulationsspezifikation und A03-Finanzspezifikation: fachliches/logisches Datenmodell mit vollständiger operativer V1-Abwicklung, differenzierten Finanzbeträgen, statischem/vereinfachtem BAB, festgelegtem Startprofil, offenen Fachentscheidungen und Erweiterungspfaden.

Abschlussnachweis: [Datenmodell](../database/maschinenbau-mvp-datenmodell.md), [CP-0010](checkpoints/MCP-2026103001.md#cp-0010), QA-Erstreview [CP-0011](checkpoints/MCP-2026103001.md#cp-0011), A04-Nachbesserung [CP-0012](checkpoints/MCP-2026103001.md#cp-0012), bestandenes QA-Rereview [CP-0013](checkpoints/MCP-2026103001.md#cp-0013) und finale P0-Gesamtsicherung [CP-0031](checkpoints/MCP-2026103001.md#cp-0031). Die dokumentarische MINOR-Abweichung wurde durch T-0007 bereinigt. Offene Fachparameter bleiben ausdrücklich offen; QA und P0-Validierung sind keine Implementierungs- oder Architekturfreigabe.

---

### T-0005 – Maschinenbau-MVP: Accounting-Wirkungen spezifizieren

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A03 ACCOUNTING_FINANCE
Priorität: HIGH

Aufgabe:

Auf Grundlage der A02-Spezifikation die finanziellen Wirkungen und minimalen Accounting-Übergaben für den Maschinenbau-MVP fachlich spezifizieren. T-0005 ist Analyse-/Spezifikationsarbeit, keine Implementierung.

Akzeptanzkriterien:

- finanzielle Wirkungen für Angebot/Auftrag, Beschaffung/Eingang, Ressourcenverbrauch, Lieferung, Rechnungen, Zahlungen, laufende Kosten und Auftragsergebnis beschrieben
- Zeitpunkt/Bedingungen von Forderungen, Verbindlichkeiten, Umsatz, Kosten und Liquiditätswirkung benannt oder als offen markiert
- MVP-relevante Netto-/Brutto-/Umsatzsteuer-, Materialbewertungs- und Fälligkeitsfragen ausgewiesen, ohne unbelegte Rechts-/Steuerannahmen
- minimale Übergaben von Simulation an Accounting und autoritative Finanzsichten beschrieben
- offene Nutzerentscheidungen und Abhängigkeiten zu A02/A11 kenntlich gemacht
- keine Buchungen, Anwendungscode-, Schema-, Supabase- oder Dependencyänderung
- keine Architekturfreigabe und keine Änderung an D-IDs/ADR-Status

Abschlussnachweis: fachliche Spezifikation [maschinenbau-mvp-finanzspezifikation.md](../accounting/maschinenbau-mvp-finanzspezifikation.md) und Checkpoint [CP-0008](checkpoints/MCP-2026103001.md#cp-0008). Offene Nutzerentscheidungen blockieren die Spezifikation nicht, aber verbindliche Detailregeln und Datenmodellableitung.

---

### T-0002 – Architektur V0.2 als Arbeitsgrundlage sichern

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

A11-Architekturentwurf dauerhaft als vorgeschlagenen Arbeitsstand sichern.

Akzeptanzkriterien:

- Kernarchitektur dokumentiert
- 8 ADR-Entwürfe dokumentiert
- offene Architekturentscheidungen erhalten
- nichts als freigegeben dargestellt
- OpenTycoonOS bleibt zunächst Referenz

Abschlussgrund: Neun Architekturartefakte erstellt, A09-QA bestanden und Commit/Push auf `main` erfolgreich. Abschlussnachweis: Checkpoint [CP-0006](checkpoints/MCP-2026103001.md#cp-0006).

---

### T-0003 – Repository-Bestand read-only aufnehmen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.3
Owner: A11 TECHNICAL_ARCHITECT

Aufgabe:

Tatsächlichen Repository-Zustand gegen den Architekturentwurf prüfen.

Abschlussnachweis: [Checkpoint CP-0002](checkpoints/MCP-2026103001.md#cp-0002).

---

### T-0004 – Maschinenbau-MVP: A02-Spezifikation und Gap-Analyse aufnehmen

Status: COMPLETED (nachträglich dokumentiert)
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION

Aufgabe:

Die read-only fachliche Spezifikation und Gap-Analyse des Maschinenbau-MVP erstellen. Während der A02-Arbeit war dafür kein aktives Ticket eingetragen; dieses Ticket dokumentiert die bereits abgeschlossene Arbeit rückblickend und weist sie dem aktiven SLG-000.2 zu.

Abschlussgrund: A02-Arbeitsergebnis durch A01 geprüft und unverändert im Repository gesichert. Keine Code-, Datenbank-, Dependency- oder Architekturänderung. Abschlussnachweis: [Checkpoint CP-0007](checkpoints/MCP-2026103001.md#cp-0007) und [A02-Bericht](../simulation/maschinenbau-mvp-spezifikation-und-gap-analyse.md).

---

### T-0007 – D-0010-Scope in A02-/A03-Spezifikationen angleichen

Status: COMPLETED
Master Goal: MG-000
Second-Level Goal: SLG-000.2
Owner: A02 SIMULATION / A03 ACCOUNTING_FINANCE

Aufgabe:

Die dokumentarische MINOR-Abweichung aus CP-0013 in den Fachspezifikationen von A02 und A03 bereinigen. D-0010 bleibt maßgeblich und unverändert; Teilfertigung, Teillieferung, Teilrechnung und Teilzahlung sind aus V1 ausgeschlossen. Keine Erweiterung des MVP und keine neuen Fachregeln.

Abschlussgrund: A02 und A03 haben ihre jeweiligen Scope-Texte an D-0010 angeglichen. Konkrete Zahlungs-/Finanzregeln bleiben offen. Nachweis: [CP-0014](checkpoints/MCP-2026103001.md#cp-0014).

### T-0012 Fortschreibung – Monatsabschluss und Finanzansicht (CP-0158)

Der Spielprototyp zeigt nun den kalendarischen Monatsabschluss mit verfügbaren Cash-, Rechnungs-, SimTAX-, Kundeneingangs-, Lieferungs- und Abschlusszahlen. Nicht verfügbare Kosten-/BAB-/Vorratswerte werden nicht abgeleitet. Syntax-, Monatsfunktions- und lokale HTTP-Auslieferungsprüfungen bestanden. Die reale Browser- und Mobilprüfung bleibt offen, daher bleibt T-0012 IN_PROGRESS. Kein Commit/Push. Details: [CP-0158](checkpoints/MCP-2026103001.md#cp-0158).

### T-0012 Abschluss (CP-0159)

Browser- und Mobilprüfung vollständig: echte Oberfläche, Mobile-Navigation, Wochenfortschritt, Produktion/Lieferung, Abnahme, Szenariorechnung/SimTAX, Fälligkeit/Zahlung, G3-Abschluss, Monatsabschluss und lokale Wiederherstellung nach Reload erfolgreich. Der Test fand und korrigierte den Bottom-Nav-Handler. T-0012 ist COMPLETED; CP-0159 enthält den Nachweis. Offene fachliche Parameter verbleiben separat unter T-0008. Kein Commit/Push.


### Nutzerentscheidung D-0127 / A02-A03-Übernahme (CP-0175 bis CP-0177)

Der Dispositionszins wird täglich auf dem gezogenen Saldo berechnet und am Monatsende einmalig als Sammelposten belastet. A03 hat die Finanzspezifikation (CP-0175), A02 das Phase-8-Ereignismodell und den gemeinsamen Abgleich (CP-0176) aktualisiert. A01 hat die offene Detailmenge fortgeschrieben (CP-0177). Offen: Tageszählbasis, Rundungszeitpunkt, Buchungsreihenfolge am Monatsende und Rückführung aus anderen Eingangstypen. T-0008 bleibt IN_PROGRESS.

### T-0032 Qualitätspräzisierung nach A09-Zwischenreview (2026-10-28)

Die Freigabe erfordert zusätzlich zur Mengen- und Feldprüfung: deutsche, natürlich formulierte Falltexte; vier fachlich plausible und fallbezogene Optionen; stabile `competenceId`-Zuordnung zu den tatsächlich in der Kompetenzlandkarte dokumentierten IDs; direkte Primärlinks für jeden inhaltlich herangezogenen Rechtsparagraphen; und eine Validatorabdeckung für Bereichszahlen, Inhaltsduplikate, Optionsverteilung, Kompetenzreferenzen und auffällige Fremdsprachenmarker. Exakte Textunterschiede allein gelten nicht als semantischer Qualitätsnachweis. A09 prüft nach der Nacharbeit erneut unabhängig.

### T-0032 UI-Integration und neuer WBQ-Schlüsselkonflikt (2026-10-28)

A01 hat den vorhandenen Bereich „Lernen“ um eine Prüfungsfallansicht mit WBQ-/HSQ-Filter, vier Antwortbuttons, Feedback, Quellen-/Kompetenzhinweis und separatem lokalen Wiederholungsfortschritt erweitert. Die Quizantworten speichern nur den Lernfortschritt und verändern laut Regression weder den aktiven Spielstand noch Finance/Ledger. Browserprüfung korrigierte den WBQ-Bereichstitel (Exportfeld `title`). Ein Inhaltsabgleich fand anschließend im WBQ-Modul doppelte Rotation der Antwortoptionen; dadurch ist der Lösungsschlüssel bei einigen Items nicht mehr der richtigen Option zugeordnet. A06 bereinigt die Verarbeitung und ergänzt eine Prüfung gegen den richtigen Antworttext; A09 reprüft HSQ separat. Das Ticket bleibt IN_PROGRESS.

### T-0032 HSQ-Nachreview 2: Kompetenzlandkarte und Distraktoren offen

A09 bestätigte Umfang, deutsche und eindeutige Inhalte, Schlüsselkorrektheit, Rechtslinks und getrennten Spielstand, erteilte aber keine Freigabe. A07 muss die 25 HSQ-Kompetenz-IDs in der externen Kompetenzlandkarte hinterlegen und jedes Item gegen diese tatsächlichen Map-Einträge validieren. Zusätzlich müssen offensichtliche Falschantworten in allen fünf HSQ-Bereichen durch plausible fallbezogene Fehlannahmen oder Zielkonflikte ersetzt werden; ein Längen-/Schlüsselwortfilter ist kein Plausibilitätsnachweis.

### T-0032 WBQ-Schlüsselabgleich korrigiert; A09-Review offen

A06 hat englische Altinhalte und doppelte Bearbeitungs-/Rotationsblöcke entfernt. Die endgültige A–D-Position wird einmalig aus dem Datensatz erzeugt; jedes Item führt `correctAnswer`, und die WBQ-Regression prüft `options[correctOption] === correctAnswer`. A01 reproduzierte den Validator mit 200 Items und 50 je Bereich. Die unabhängige fachliche A09-Prüfung bleibt vor Freigabe erforderlich.

### T-0032 WBQ-Inhaltsreview: Distraktoren noch nicht freigegeben

A09 bestätigt strukturelle WBQ-Korrekturen (200/50, deutsche statische Inhalte, Kompetenz-Map, direkte Rechtsquellen, korrekte Schlüssel, keine Spielmutation). Die fachliche Abnahme blockiert weiterhin an unplausiblen Distraktoren in allen vier Bereichen. Die aktuelle Keyword-Prüfung reicht nicht; A06 überarbeitet die Optionen fallweise und ergänzt eine nachvollziehbare manuelle Prüfliste, bevor A09 erneut reviewt.

### T-0032 A01-Fortsetzung (2026-10-28; CP-0203)

Der aktuelle A01-Lauf bestätigt, dass die HSQ-Kompetenzlandkarte nun 25 `wfprv5-*` IDs enthält und der HSQ-Strukturvalidator 250/50, Quellen, Schlüssel und Referenzen besteht. Der WBQ-Strukturvalidator besteht mit 200/50 und korrekten Antworttexten; A06 arbeitet die verbleibenden 100 Distraktor-Sets zu Recht/Steuern und Unternehmensführung noch fallweise nach. Die getrennte Lern-UI-Regression besteht. Diese automatisierten Strukturprüfungen ersetzen keine fachliche Distraktorprüfung. A07/A06 setzen ihre Arbeit im Repository-Checkout fort; A09 muss beide finalen Datensätze unabhängig neu prüfen. T-0032 bleibt IN_PROGRESS; T-0033, Commit und Push bleiben ausstehend. Details: CP-0203.

**Nachtrag:** A06 hat die übrigen WBQ-Distraktoren inzwischen ebenfalls fallweise überarbeitet und `prototype/learning-wbq-review-checklist.md` erstellt. Validator und Syntaxprüfung bestehen (200/50, A48/B52/C52/D48). A09 prüft jetzt unabhängig den gesamten HSQ- und WBQ-Satz; fachliche Abnahme bleibt offen.

### T-0032 A09-Befunde und gezielte Korrekturen (2026-10-28; CP-0204)

A09 meldete vorläufige Inhaltsblocker: mehrdeutige/unterbestimmte Fallfragen (HSQ BM-027, IFRWC-027/-039, Logistik-007/-010/-015/-018; WBQ VW-002/RW-013), Rechtspräzisierung in WBQ RT-005/RT-006 (Werkvertrag/Werklieferungsvertrag und Abnahme) sowie auffällige offensichtliche Distraktoren in den genannten Marketing-/Führungs-/Rechts-/Unternehmensführungsfällen. Der Review lief aus einem Spiegel ohne `.git`; diese Befunde sind direkt im Repo zu verifizieren. A06/A07 bearbeiten konkrete Fälle. A09 wiederholt nach Korrektur die vollständige Prüfung im Git-Checkout. Keine Abnahme, kein Commit/Push. Details: CP-0204.

### T-0032 A09-Verifikation und verbleibende fachliche Blocker (2026-10-28; CP-0205)

A09 hat den Nachreview im tatsächlichen Checkout mit Preflight durchgeführt. WBQ VW-002, RW-013 und RT-005/006 sind jetzt behoben; WBQ RW und RT sind fachlich PASS mit Restqualität RT-001. Verbleibend: HSQ BM-027, IFRWC-027 und Logistik-007/-010/-015/-018 sind mehrdeutig/unterbestimmt; Marketing-005/-030, Führung-002/-008/-012/-018 sowie WBQ UF-034/-045/RT-001 haben zu offensichtliche Distraktoren; WBQ VW-027/-028 enthalten jeweils zwei richtige Antworten. WBQ-Validator bricht zusätzlich an verwaister Quelle `LAW-BGB-631-DIRECT` ab. A06/A07 korrigieren, danach finaler A09-Nachreview. Keine Freigabe, kein Commit/Push. Details: CP-0205.

**Nacharbeit:** A06/A07 haben alle IDs aus CP-0205 korrigiert, die Checklisten angepasst und Validatoren/syntax erfolgreich ausgeführt. BGB §§ 640, 650 und 442 sind in den betroffenen Fallbegründungen/Links abgeglichen. Der finale A09-Abschlussreview der aktuellen 450 Items läuft; T-0032 bleibt bis zu dessen Ergebnis offen. Siehe CP-0206.

### T-0032 A09-Abschlussreview: ein einzelner Blocker (CP-0207)

A09 hatte nach CP-0206 zunächst acht Bereiche PASS gegeben; danach wurde `hsq-logistik-018` verengt und im gezielten Re-Review PASS gegeben. T-0032 ist mit CP-0208 abgeschlossen.

### T-0032 Abschluss (CP-0208)

A09 hat den letzten Befund `hsq-logistik-018` gezielt freigegeben und zuvor alle neun Prüfungsbereiche vollständig bestanden. 450 Fälle sind strukturell, fachlich, quellen-/kompetenzbezogen und auf Nichtmutation des aktiven Spielstands geprüft. WBQ-Checkliste enthält 200 A09-Freigaben; HSQ-Nacharbeit und Re-Review sind dokumentiert. Validatoren, Lern-UI-Regression, Gesamtsuite/Jahreslauf und `git diff --check` bestehen. T-0032 ist COMPLETED; T-0033 übernimmt Integration/Release. Kein Commit/Push vor T-0033-Abnahme.

### T-0033 Start nach T-0032-Abnahme (CP-0208)

T-0033 ist IN_PROGRESS. Offen sind abschließende Integrations- und Architektur-/Daten-/DevOps-Reviews, Browser-/Mobil-E2E und Tooltip-/Tastaturprüfung. Anschließend erfolgt der kontrollierte Commit-/Push-Lauf gemäß AGENTS.md. Bestehende lokale Änderungen bleiben erhalten.


### T-0033 Abschluss (CP-0210)

A04/A09/A10/A11-Reviews, die vollständige Regressionsmatrix, der einjährige Simulationslauf sowie Browser-/Mobilprüfung sind in CP-0209 belegt. Der 32-Dateien-Sicherungsstand wurde am 2026-10-28 über GitHub Desktop als feat: add Wirtschaftsfachwirt V2 learning simulation committed und nach origin/main gepusht. HEAD und origin/main stimmen auf 424927125ba882b33726c47de7b68347a9dbe4d9 überein; Arbeitsbaum sauber. T-0033 ist abgeschlossen. MG-002/SLG-002.2 bleiben in Arbeit; SLG-002.4 ist Folgearbeit. Keine Architektur- oder Schemafreigabe; ADR-001 bis ADR-008 bleiben PROPOSED. Siehe [CP-0210](checkpoints/MCP-2026103001.md#cp-0210).
### T-0035 – V2-Neustartprofil, Postfach, dynamischer BAB und Betriebsstandorte

Status: COMPLETED (V2-Startprofil, Marktberichte, BAB und Standorte; CP-0212; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Den Spielstart als Einzelunternehmen in München 2019 mit 10.000 € Bankbestand, leerem Lager und einer gemieteten Garage neu aufsetzen. Manuelle Tageszuweisung bleibt optional und automatische Planung der Standard. Anfragen und Marktberichte laufen über ein Postfach; individuelle Konkurrenzpreise sind verborgen und Monatsberichte zeigen Durchschnittswerte je Auftragsgröße. Dynamische BAB-Auswertung, Nachfrage-/Standortwirkung, Maschinenmiete/-qualifikation, Lieferanten-Mindestmengen, Lebenshaltungskosten/Privatentnahmen und Gesellschaftsformwechsel als V2-Szenariofunktionen integrieren.

Umfang: Browserfähiger Prototyp. Historische/regionale Preise und Flächen sind ausdrücklich Szenariowerte, keine aktuellen Immobilienangebote oder Rechts-/Steuerberatung. Bestehende Spielstände bleiben ladbar; das neue Profil gilt für neu gestartete Spiele.

Abnahmekriterien: Neues Spiel zeigt 01.01.2019 und 10.000 € Bankbestand, keine Mitarbeiter außer Inhaber, kein Vorrat, Garagenmiete und Privatentnahme; automatische Planung ist vorausgewählt und manuell umstellbar; abgelaufene/abgeschlossene Aufträge blockieren keine Folgezuweisung; Postfach erhält Kundenanfragen und einen monatlichen anonymisierten Konkurrenzpreisbericht; Standortübersicht hat mindestens zehn Miet- und zehn Kaufobjekte auf einer schematischen München-Umlandkarte; monatlicher BAB wird aus den realisierten Szenariokosten und Beschäftigungs-/Maschinenstunden errechnet.

Abschluss: Ein neues V2-Spiel beginnt 01.01.2019 mit 10.000 €, leerem Lager, Inhaber, gemieteter Garage, Handwerkzeug und monatlicher Privatentnahme. Im Planer ist Automatisch voreingestellt und Auftragsauswahl manuell möglich; erledigte Zuweisungen blockieren die automatische Folgeplanung nicht. Das Postfach enthält Monatsberichte mit Mittelwert und Spanne aller drei Konkurrenzprofile nach drei Auftragsgrößenklassen; weder Auftragsansicht noch Konkurrenz-Zuschlagsmeldung veröffentlicht Einzelpreise. Die wöchentliche Marktchance wurde auf drei Einladungsgelegenheiten erhöht; ein Teil ist absichtlich verlustbringend. Es gibt 10 Miet- und 10 Kaufobjekte sowie zwei CNC-Mietmaschinen; Standort, Nachfrage, Kapazität, Mindestbestellmengen und Baumarktpreise beeinflussen das Spiel. Der BAB rechnet Szenariokosten und realisierte Arbeits-/Maschinenstunden mit. Einjahreslauf: 62 Anfragen, 57 abgeschlossene Aufträge, 12 Marktberichte, 12 Monatsabschlüsse und positiver Endbankbestand bei getesteter wettbewerbsfähiger Angebotsstrategie. V1-Regressionsläufe wurden auf explizite Legacy-Startfabriken umgestellt und bestehen weiterhin. Browserprüfung auf isoliertem Port 8011 bestand für Dashboard, Planung, Standorte, Bank-/Dispoanzeige und Postfach. Historische Marktwerte, Immobilien-/Betriebsdaten, UG/GmbH-Wechsel und Rechtsmechanik bleiben Szenarioheuristiken; UG-Rücklage sowie vollständige Steuer-, Gründungs- und Registerlogik sind keine Implementierungsbehauptung. Details: CP-0212.

### T-0036 – Verteilte Anfragen, verzögerte Kundenentscheidung und Inventar

Status: COMPLETED (V2-Marktfluss und Baumarkt-Inventar; CP-0213; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Verteilte Eingangstage, Antwortwartezeit, Angebotsablauf, sichtbare Fertigungsqualifikationen und Überlastanzeige ergänzen. Baumarkt als Materiallieferant und Werkzeugverleiher sowie ein Inventarreiter für Bestände und Betriebsmittel integrieren.

Abschluss: Neue V2-Anfragen entstehen an drei über die fünf Arbeitstage rotierenden Werktagen je Woche (Feiertage bleiben ohne Erzeugung). Unbeantwortete Anfragen laufen nach 3–5 Kalendertagen ab. Nach Angebotsabgabe wartet der V2-Kunde 1–3 Kalendertage; Preis und Zahlungsziel bleiben währenddessen unverändert und der Zuschlag wird erst am Entscheidungstag aufgelöst. Generierte Aufträge zeigen Skills; fehlende interne Skill-/Maschinenberechtigung erscheint rot. Der globale Datumspfeil wird gelb, wenn die restliche modellierte Auftragsstundenlast die aktuell verfügbare tägliche Belegschaftskapazität übersteigt. Baumarkt ist als Materiallieferant auswählbar und liefert nach Mindestmengenregel weiterhin Notbeschaffung; Handwerkzeuge können tageweise gemietet und automatisch zurückgegeben werden, mit Betriebskostenbuchung. Der neue Inventarreiter zeigt Material, Arbeitsmittel, Maschinen, Computerhinweis und laufende Baumarkt-Ausleihen. V1 bleibt im Angebotsentscheidungsfluss unverändert. Gezielt und regressiv geprüft; Einzelheiten CP-0213.

### T-0037 – Werkzeugverleih nach Auftragsbedarf, Maschinen-Skills und Logo-Navigation

Status: COMPLETED (UX-/Qualifikationspräzisierung; CP-0214; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Die Baumarkt-Mietauswahl sprachlich eindeutig machen, irrelevante Werkzeuge ausblenden und Spezialwerkzeug an aktive Auftragsanforderungen binden. Maschinen-Skills zeigen und die Logo-Navigation zur Übersicht reparieren.

Abschluss: Werkzeugmiete wählt ausdrücklich ein Gerät; der Zahlenwert steht für Arbeitstage (1–30). Der Baumarkt bietet nur ein Spezialwerkzeug an, wenn ein angenommener, noch nicht abgeschlossener Auftrag genau dieses Werkzeug erfordert. Der Engine-Start eines entsprechenden Arbeitsgangs wartet, wenn das Mietwerkzeug an dem Tag nicht verfügbar ist. Mietmaschinen führen benötigte Fachskills und Maschinenberechtigungen in ihrem Katalog und im Inventar. Der Klick auf das Logo setzt die Ansicht auf Übersicht und verhindert, dass nur der Hash geändert wird. Geprüft mit gezielter Regression, V2-Jahreslauf, Legacy-Jahreslauf, Gesamtsuite, Syntax- und Whitespaceprüfung; siehe CP-0214.
### T-0038 – Lagerbelegung, Materialvorlauf und Versandfertigwaren

Status: COMPLETED (Materialfluss und Fertigwarenlager; CP-0215; 2026-10-28)
Master Goal: MG-002
Second-Level Goal: SLG-002.2
Owner: A01 MASTER_ORCHESTRATOR

Aufgabe: Die Lageranzeige als belegte/maximale Fläche ausweisen, Materialien einzeln im Lager führen, Bestellvorlauf und Lieferantenunterschiede simulieren und Fertigware bis zum Versand im Lager halten.

Abschluss: Dashboard und Inventar zeigen belegte von maximaler Lagerfläche in m². Unter „Inventar → Lager“ stehen Stahl, Aluminium und Zukaufteile einzeln, Fertigware bis zum tatsächlichen Versand sowie offene Lieferungen mit Lieferant und voraussichtlichem Termin. Online-Lieferanten sind im Modell günstiger als Baumarkt-Einzelbezug, verlangen Versand und Mindestmengen, haben mehrtägige Vorläufe und ein reproduzierbares Verzögerungsrisiko. Der lokale Baumarkt liefert sofort, aber nur aus endlichem Lagerbestand und mit Einzelmengenaufschlag; ausgeschöpfte Bestände weichen auf Onlinebeschaffung aus. Fertige V2-Aufträge belegen bis zur Aktion „Auftrag aus Lager versenden“ gemeinsam mit Rohmaterial Fläche. Bei Platzmangel warten Warenzugänge und Fertigung. Legacy-/2027-Versandverhalten bleibt kompatibel. Regressionen und Jahresläufe siehe CP-0215.

### T-0055 – Review-/Retrofrequenz in der Control Plane aktualisieren

Status: COMPLETED (Nutzerregel in Control Plane, Rollenunterlagen und Decision Log übernommen; CP-0259)
Master Goal: MG-002
Koordination: A01 – MASTER_ORCHESTRATOR

Aufgabe: Die bestätigte Nutzerfrequenz für Reviews/Retros nach 250er-CP-Meilensteinen sowie nach Commit und Push in den Agentenregeln verankern.

Abschluss: AGENTS.md, Agentenstruktur und Rechtekarte nennen CP-0250, CP-0500 usw. und erfolgreiche Commit-/Push-Vorgänge als Auslöser; die ältere Abfrage nach jedem Arbeitsauftrag wird ausdrücklich ersetzt. D-0155 hält die Entscheidung fest. Historische bestätigte CPs/MCPs blieben unverändert.

### T-0056 – Cross-Review-Befunde vor Sicherung auflösen

Status: COMPLETED (Planungsrollback, SimTAX-Abgleich und iPhone/iPad-Paket nach Review nachgearbeitet; CP-0260)
Master Goal: MG-002
Second-Level Goal: SLG-002.2 / SLG-002.5
Koordination: A01 – MASTER_ORCHESTRATOR

Aufgabe: A02–A12-Reviewbefunde am aktuellen Diff abarbeiten, blockierende Konflikte lösen und ein überprüfbares Offlinepaket für iPhone und iPad bereitstellen.

Abschluss: Abgewiesene Planungsänderungen stellen auch die Tagesreihenfolge wieder her und besitzen eine Regression. D-0156 klärt eng begrenzt die V2-SimTAX-Vorsteuer auf Inventaranschaffungen; D-0149 und historische Checkpoints bleiben unverändert. Der Offline-Builder erzeugt iPhone/iPad-Hinweise und ein SHA-256-Manifest für Quellrevision, Eingabedateien und Ausgabe-HTML. A02–A12 Reviewbefunde sind getrennt dokumentiert. Kein Schema-/Architekturentscheid.

**T-0069 Statusfortschreibung 2026-10-31:** A09 hat Shared-Run RUN-01–RUN-04 und Finance F-01/F-02 unabhängig PASS bestätigt. A05 lieferte die mobile gemeinsame Run-Route samt Regressionen; die Angebotsabgabe bleibt bis zur A02-Zweiphasen-API bewusst gesperrt. Noch offen: Kunden-Work-Order-Operations, A03-Integration, UI-Angebots-/Kalkulationskreis, vier 12-Monatsläufe mit Finance-Reconciliation und A12-Browser/Mobiltest. T-0069 bleibt IN_PROGRESS.

**T-0069 Statusfortschreibung / CP-0287 (2026-10-31):** A02 behob beide A09-Folgefunde: chronologisch unmögliche Vorgänger werden abgewiesen; unbelegte gespeicherte `delivered`-/`posted`-Status bestehen die Restorevalidierung nicht. A03 Cross-Review PASS innerhalb der nicht-postenden Finance-Grenze; A09 Re-Review der beiden Korrekturen PASS. A05 integriert nun zweiphasige Angebote sowie ausdrücklich eingegebene Vertrags-/Operations- und Ressourcenparameter in die Run-UI. T-0069 bleibt IN_PROGRESS. Noch offen: UI-Integration, A09-Gesamt-QA, A12-Funktional-/Mobilreview, vier reproduzierbare 12-Monatsläufe mit Cash-/Ledgerabstimmung und vollständiger Kundenleistungs-/Liefer-/Abnahme-/Rechnungs-/Zahlungsablauf. Kein Commit/Push.

**T-0069 Fortschreibung / CP-0288 (2026-10-31):** A05 integrierte die gemeinsame UI mit zweiphasigem Tagesablauf, expliziter Angebotskalkulation, Ressourcen-/Operationsplanung und manuellem Schrittabschluss. Fokusregressionen und Desktop-Smoke laut A05 PASS; noch keine mobile oder vollständige Browser-Operationsabnahme. A03 Finance-Crossreview, A09 adversarial Gesamt-QA und A12 Browser-/Mobilreview laufen. T-0069 bleibt IN_PROGRESS; Jahres-/Cash-/Ledgerabstimmung und End-to-End-Rechnungs-/Zahlungspfad bleiben offen.

**T-0069 Fortschreibung / CP-0289 (2026-10-31):** A03 Finance-Crossreview der Run-UI PASS im begrenzten nicht-postenden Umfang. A09 adversarial NONPASS mit (1) stiller Umdeutung ungültiger variable/fix Kostenklassifikation und (2) nachträglicher Ressourceninitialisierung nach Tageslaufbeginn. Persistierte A09-Repros liegen in `prototype/a09-t0069-run-ui-adversarial-regressions.mjs`. A05 erhält den Fixauftrag; anschließend unabhängiger A09-Re-Review. A12 explorativer Browser-/Mobilreview separat. T-0069 bleibt IN_PROGRESS; Jahres-/Ledgerreconciliation und vollständige Leistungs-/Rechnungs-/Zahlungsintegration offen.

**T-0069 Fortschreibung / CP-0290 (2026-10-31):** A05 korrigierte beide A09-Adapter-NONPASS-Fälle; unabhängiges A09-Re-Review steht aus. A12 konnte wegen fehlendem IAB im Agentenkontext keine Browser-/Mobilprüfung durchführen. A01 kontrollierter Browser-Smoke zeigte nach „Synthetischen Lauf starten“ Queryparameter in URL, aber unveränderten sichtbaren Status „Nicht gestartet“; A05 untersucht. Das ist vorläufiger Befund ohne bestätigte Ursache. T-0069 bleibt IN_PROGRESS.

**T-0069 Fortschreibung / CP-0291 (2026-10-31):** A09-Re-Review PASS für Kostenarten- und Ressourcenzeitpunktadapter. A01 bestätigte fehlenden Content-Type am Server 8031; mit temporärer MIME-korrekter Route 8032 bestanden Runstart, erster Tag, Postfach, explizite Angebotsabgabe und Tagesabschluss. Neue UI-Sackgasse: Ohne vorherigen Ressourcenstand bleibt Tag 2 gesperrt. A05 soll eine explizite, defaultfreie Ressourcenbasis vor Tag 1 verlangen oder sichtbar begrenzte Market-only-Route definieren. T-0069 weiterhin IN_PROGRESS; echter Browser-/Mobilgerätebeleg und Jahres-/Ledgerabstimmung fehlen.

**T-0069 Fortschreibung / CP-0292 (2026-10-31):** A05-Fixes für explizite Ressourcenbasis vor Tag 1 und Responsive CSS umgesetzt; A09 Code-/Regression-Review PASS. A01 kontrollierte IAB-Smoke auf MIME-korrigiertem Port 8032 bestätigte Runstart, Tagesöffnung/-abschluss, Angebot, Kundenannahme, Auftragsplanung, manuelle Operation und nichtbuchenden Leistungsstatus; visuell keine horizontale Scrollbar in schmaler Ansicht. 390×844/768×1024 nicht exakt vermessen. `git diff --check` sauber; `main@8b72b7e`; 111 Statuszeilen. T-0069 bleibt IN_PROGRESS, Jahres-/Ledgerabgleich, dynamischer BAB, vollständiger Finanzkreislauf und Release-QA offen.

**T-0069 Fortschreibung / CP-0300 (2026-10-31):** A02-Lernruntime integriert; A05 Lernsektion geliefert. A06-Fachreview und A09-unabhängige QA fanden NONPASS: Restore-Trace nicht an realen Zielfeldwert gebunden, Restore-Queue nicht gegen deterministische Seed-/Datumswahl geprüft, gültige Dezimalstände können bei Effekt-Rundung scheitern; A05 beobachtete außerdem einen exakten Floatvergleich .20000000000000284 vs .2 in der A02-Regression. A02 behebt die Fälle. A05-UI-Regressionen PASS; unabhängiges UI-Review und Browser-Smoke stehen aus. T-0069 IN_PROGRESS; keine Gesamt- oder Finanzfreigabe. Siehe CP-0300.

**T-0069 Fortschreibung / CP-0301 (2026-10-31):** A02 schloss Trace-Zielketten, deterministische Queue und Dezimalfälle; Root-Regressions PASS. A09 Re-Review PASS im Lernruntime/UI-Testumfang. Root IAB-Smoke: Fragen sichtbar, D-0147-Effekttrace und Tagabschluss mit unbeantworteten Fragen funktionieren; kein Posting. A06 fand verbliebenen Restore-Randfall: veränderter plausibler Anfangswert der Effektkette wird nicht unabhängig verankert. A02 erhält Fixauftrag; danach A06/A09-Re-Review. T-0069 IN_PROGRESS; vollständige Finanz- und Jahresreconciliation offen. Details CP-0301.

**T-0069 Fortschreibung / CP-0302 (2026-10-31):** A02 ergänzte rungebundenen Startwertanker für Effektketten. Root wiederholte Lern-/Run-/UI-Regressions (PASS) und IAB-Smoke: fünf freiwillige Fragen, sichtbarer Kompetenztrace und Tagesabschluss trotz offener Fragen; kein Finanzposting. A03 Finance-Crossreview PASS, A06 Fach-Re-Review PASS für Trace-, Baseline-only- und Identitätsmutationen. A09 unabhängiger Re-Review des neuen Baselineankers steht aus. T-0069 IN_PROGRESS; Jahres-/Finance-/End-to-End-Gates offen. CP-0302.

**T-0069 Fortschreibung / CP-0303 (2026-10-31):** A09-Final-Re-Review PASS für Lernadapter-Trace-Anker, Queue, Dezimalfälle, Replay, Nichtbuchung und nicht-blockierenden Tag; A06 Fachreview und A03 Finance-Nichtbuchungsreview PASS. Root Regressionen und IAB-Smoke PASS; echter Gerätetest nicht ausgeführt. Der Lernlaufteil ist im geprüften Scope PASS, T-0069 gesamt bleibt IN_PROGRESS für Delivery/Acceptance/Invoice/Payment, A03-Posting, 12-Monats-Reconciliation und Gesamt-QA. CP-0303.

**T-0069 Fortschreibung / CP-0304 (2026-10-31):** A02 non-posting delivery/customer-decision events delivered; A09 PASS on runtime/restore and root regressions PASS. A03 cross-review NONPASS: customerPartyId is not tied to the originating inquiry customer and an alternate recipient lacks evidenced authority; seller can self-name as acceptance party and accept, conflicting with D-0157. A02 fixes identity/authority binding and restore, adds self-acceptance test; A03/A09 re-review before A05 UI. T-0069 IN_PROGRESS, no finance posting. See CP-0304.

**T-0069 Fortschreibung / CP-0305 (2026-10-31):** A02 D-0157-Korrektur bindet Kundenpartei an die angenommene Marktanfrage; Empfänger benötigen Vertrags-/Event-Autoritätsreferenzen; Verkäufer-Selbstabnahme wird abgewiesen. A03 Fach-Re-Review und A09 adversariale Runtime-/Restore-Re-Review PASS. Root Run/Product/Learning/Finance/Market Regressionen PASS. Events bleiben pending/non-posting. A05 kann Verkäufer-UI für Lieferung und wartende Kundenentscheidung integrieren; Customer acceptance darf nicht vom Verkäufer ausgelöst werden. T-0069 IN_PROGRESS; Invoice/Payment/Finance/Year gates offen. CP-0305.

**T-0069 Fortschreibung / CP-0306 (2026-10-31):** A03 Liefer-UI-Fachreview PASS im begrenzten Finance-/Vertragsumfang. A09 adversariale UI-Prüfung NONPASS: vertraglich bevollmächtigter Empfänger abweichend vom Kunden ist durch fehlende Autoritätsreferenzfelder in contractForm/planRunOrder nicht modellierbar. A01 IAB-Smoke bestätigte Start, Ressourcenübernahme, ersten Tag, Anfrage, Lernfragen und sichtbaren nichtbuchenden Stand; vollständiger Lieferpfad nicht freigegeben. A05 erhält Korrekturauftrag. T-0069 bleibt IN_PROGRESS; keine Commit-/Push-Aktion. Siehe CP-0306.

**T-0069 Fortschreibung / CP-0307 (2026-10-31):** A05 integrierte explizite uthorizedForRef-/partyAuthorityRef-Übergabe in Vertragsformular und Planadapter; Standardkunde bleibt unverändert, fehlende/falsch gebundene Referenzen werden von der Runtime abgewiesen. A01 wiederholte UI-/Orchestratorregressionen, Syntax- und Whitespaceprüfungen PASS. A03/A09 Re-Review und Browser-Smoke der Korrektur stehen aus. T-0069 IN_PROGRESS; keine Buchungs- oder Architekturfreigabe. Siehe CP-0307.

**T-0069 Fortschreibung / CP-0308 (2026-10-31):** A03 Fach-Re-Review PASS und A09 adversarial Re-Review PASS für D-0157-Alternativempfängerbindung, Standardkundenpfad, Zurückweisung unberechtigter Partei-/Replay-Manipulation und Nichtbuchung. A01 wiederholte QA-/UI-/Orchestrator-Regressionen PASS. Browser-/Touchdurchlauf des korrigierten Alternativempfängerpfads noch offen. T-0069 IN_PROGRESS; Finanzvollzug und Jahresreconciliation offen. Siehe CP-0308.


**T-0069 Fortschreibung / CP-0309 (2026-10-31):** A01 IAB-Smoke bis zur Kundenentscheidung zeigte Runstart, Ressourcen, Marktanfrage, freiwillige Lernfragen, explizite Angebotskalkulation/-abgabe und Annahme am 06.01. Beim Rendern des angenommenen Auftrags tritt `workOrderCard is not defined` in `prototype/v3/run.js` auf; Auftragsplanung und Deliverypfad sind UI-seitig blockiert. A03/A09 D-0157-Code-Reviews bleiben PASS, Browser-Gate jedoch NONPASS. A05 erhält Rendererfix plus Regression; T-0069 IN_PROGRESS, kein Commit/Push. Siehe CP-0309.


**T-0069 Fortschreibung / CP-0310 (2026-10-31):** A05 korrigierte den undefinierten Auftragsrenderer über renderWorkOrderList; Regression prüft die angenommene Auftragskarte und Alternativempfängerfelder. A01 UI-/Orchestratorregressionen, Syntax und gezielter diff-check PASS. A09 unabhängiger Renderer-Re-Review und A01 Browser-Retest stehen aus. T-0069 IN_PROGRESS, kein Commit/Push. Siehe CP-0310.


**T-0069 Fortschreibung / CP-0311 (2026-10-31):** A03 Renderer-Cross-Review PASS; A09 unabhängiger Run-Renderer-Re-Review PASS über angenommene/geplante/fertige/gelieferte Zustände, D-0157-Felder, Nichtbuchung und Verkäuferrollenabgrenzung. A01 wiederholte QA-/UI-/Orchestrator-Suites PASS. Browser-Retest des zuvor nach Annahme fehlgeschlagenen Pfads steht aus. T-0069 IN_PROGRESS; Finanz-/Jahresabstimmung offen. CP-0311.


**T-0069 Fortschreibung / CP-0312 (2026-10-31):** A01 Browser-Smoke nach Rendererfix PASS bis zur Lieferung an gebundenen abweichenden Empfänger. Angebot → Annahme → Orderkarte/Arbeitsplanung → Werkvertragssnapshot mit Autoritätsreferenzen → Operation → Lieferung funktionierte. Nach Lieferung bleibt Kundenentscheidung ausstehend, kein Seller-Abnahmebutton und keine Buchung. T-0069 bleibt offen für A03-Leistungs-/Invoice-/Payment-Integration, Jahresreconciliation und Gesamtreview. Kein Commit/Push. CP-0312.

**Fortschreibung CP-0366/CP-0367:** A02 hat den autoritativen Makrohistorie-Replay und strikte Referenztypen ergänzt. A09 hat die beiden CP-0365-Angriffswege unabhängig PASS geprüft: gültige Wirkung und neutraler Fehlwertfall, koordinierte Mutation der Historykopien bei unverändertem Day-open-Fingerprint, Save-Envelope und Restore, D-0169-Invarianz sowie Finanz-/Run-Nichtmutation. Das PASS gilt nur für diese Replay-/Provenienz- und Projektionsgates. Die aktive Standardfixture bleibt ohne Policy-Exposition neutral; L2/L4/L5-Runtime, UI, Jahres-/Ledgerabgleich und T-0063/T-0069-Gesamtintegration bleiben offen. CP-0367 ist ein Entwurf; kein Commit/Push.

**Fortschreibung CP-0368/CP-0369:** A02 implementierte L2 als replaygebundene, nichtbuchende FX-/Importplan-, Exportsegment- und Liefer-ETA-Projektion. A03 bestätigte FX-Notierungsrichtung und offene/nicht angenommene Importplanung, unveränderliche angenommene Preis-Snapshots, D-0169-Gesamtanfrageninvarianz, ETA-only sowie Finanz-/Run-Nichtmutation und Save/Restore-Replay. PASS beschränkt sich auf die Projektions-/Finance-Grenze. Operative Bestell-/Beschaffungsreferenzen, UI, tatsächliche Istkosten-/Lager-/Rechnungs-/COGS-Wirkung und Jahresabstimmung bleiben unintegriert; A09-Adversarialreview steht aus. CP-0369 ist ENTWURF. T-0063/T-0069 bleiben IN_PROGRESS; kein Commit/Push.

**Fortschreibung CP-0368/CP-0369/CP-0370:** A02-L2 und A03-Finanzgrenzen bestanden die gezielten Projektionsreviews. A09 fand danach einen NONPASS in der FX-Provenienz: Das Januar-Basisereignis akzeptiert eine falsche quoteUnit und fehlende Test-Fixture-Bindung; ein Februar-Kurs kann so fälschlich +1,25 % Planwirkung erzeugen. Exportverteilung, Lag, D-0169-Gesamtzahl, Save/Restore und Finance-/Run-Nichtmutation PASS. CP-0370 dokumentiert den Repro; A02 erhält den Fixauftrag, anschließend A09-Re-Review. T-0063 L2 bleibt bis dahin offen; reale Bestellung/UI/Jahresintegration weiterhin nicht belegt.

**Fortschreibung CP-0371/CP-0372:** A09 hat den vorherigen FX-Provenienz-NONPASS unabhängig PASS nachgeprüft. Der falsche Januar-Basiswert 0.9 USD_per_EUR ohne Fixture-ID erzeugt weder direkt noch über Save/Restore eine Planwirkung; die gültige synthetische Kontrollreihe funktioniert. Einheit, Basisperiode/-index, Quellen-/Serien-/Fixture-, Run-/Szenario- und Plan-/Expositionsbindung sind abgedeckt. Sieben L2-/Macro-/Run-/Market-/D-0169-/Finance-Suites PASS. Der Status bleibt auf reine nichtbuchende Projektions-/Provenienzprüfung beschränkt; operative Beschaffungs-/Bestellintegration, UI, Jahres-/Ledgerabgleich sowie T-0063/T-0069-Gesamtgates sind offen. CP-0372 ist ENTWURF, kein Commit/Push.

**Fortschreibung CP-0371 bis CP-0373:** Nach A09 CP-0372 PASS hat A03 den FX-Provenienzfix im Finance-Scope ebenfalls PASS geprüft. Einheit EUR je USD, Januar-2027-Basisindex, synthetische Fixture/Serie/Quelle, Run-/Szenario- und identische offene Importplan-/Exposure-Bindung bestehen; unzulässige Inputs bleiben neutral. Direkte Finanzwirkung 0,00 €, D-0169 bleibt alleiniger Gesamtanfragenfaktor. L2 ist im Replay-/Projektions-/Nichtbuchungsscope geprüft, nicht als operative Bestell-, Istkosten-, FX-Bewertungs-, UI-, Jahres- oder Releaseintegration. T-0063/T-0069 bleiben IN_PROGRESS.

**Fortschreibung CP-0371–CP-0374:** A09 CP-0372 und A03 CP-0373 bestätigten den FX-Provenienzfix im begrenzten L2-Projektions-/Nichtbuchungsumfang. A02 hat danach L4 als separate replayfähige BICI-, WagePlan- und ProcurementPlan-Projektion ergänzt; CPI/SPI 2020=100 bleibt getrennt, synthetische Gleichgewichte sind fixturegebunden, Standardlauf neutral, fehlende/konfligierende Inputs pending. Gezielte Regressionssuite PASS laut A02 CP-0374; A03 prüft jetzt Finance-/Nichtbuchungsgrenze, anschließend folgt A09. Keine Istkosten-, BAB-, Lohn-, Lager-, Vertrags-, Finanz- oder Ledgerwirkung behauptet. T-0063/T-0069 IN_PROGRESS, kein Commit/Push.

**Fortschreibung CP-0374/CP-0375:** A03 bestätigte L4-Gewichte/Normalisierung, Einheiten, Basis/Lag, CPI/SPI-Trennung, Wage-/Procurement-Sichten, Präzision, Pendingfälle, Replay und Finance-Nichtmutation. NONPASS: driverIds darf fehlen. Damit kann ein bereits enthaltener FX-, Politik- oder Tarifeffekt nicht dedupliziert werden, obwohl der Vertrag bei nicht deduplizierbaren Treibern pending verlangt. A02 erhält Korrekturauftrag. Kein Buchungs-/Jahres-/Release-PASS.

**Fortschreibung CP-0375/CP-0376:** A02 hat den fehlenden Treiberprovenienz-Nachweis behoben: indexwirksame Komponenten benötigen eine eindeutige raw_component-Referenz, gebunden an Komponente/Monat/Quellereignis/Scope/Contribution/Effect-Group; fehlende, doppelte oder widersprüchliche Referenzen und unaggregierte Fremdtreiber erzeugen keine Wirkung. A02-Regressionssuite PASS; A03-Finanz-Re-Review läuft. CP-0376 ist ENTWURF; kein Commit/Push.

**Fortschreibung CP-0376/CP-0377:** A03 hat den L4-Treiberprovenienzfix PASS geprüft: fehlende/leere/falsche/doppelte/inkonsistente Referenzen sowie deklarierte unaggregierte Fremdtreiber bleiben pending; die vollständige synthetische raw_component-Positivfixture bleibt berechenbar. L4-/Finance-/SPI-/Makro-/Run-/D-0169-Regressionen PASS; direkte Finanzwirkung 0,00 €. Verborgene Fremdtreiber bei falsch deklarierten Rohdaten bleiben eine Eingabegrenze. A09-Adversarialreview folgt; keine Istkosten-/BAB-/Posting-/Jahres-/Releasefreigabe.

**Fortschreibung CP-0376–CP-0378:** A09 hat A02s Treiberprovenienzfix unabhängig PASS geprüft. Fehlende/falsche/duplizierte/überkreuzte Referenzen und nicht aggregierte Treiber bleiben ohne Wirkung; synthetische Positivfixture/Indexformel sind korrekt, Wage-/Procurement-Sichten bleiben getrennt. Save-/Restore weisen koordinierte Historymanipulation bei unverändertem Day-open-Input zurück. Zehn L4-/SPI-/Macro-/Run-/L2-/L3L6-/Market-/D-0169-/Finance-Suites PASS. Grenze: formal als raw_component deklarierte, upstream falsch etikettierte Fremdtreiber bleiben metadatenseitig unerkennbar. PASS nur für Provenienz-/Planindex-/Nichtmutationsscope; kein Istkosten-/BAB-/Jahres-/UI-/Releasegate. T-0063/T-0069 IN_PROGRESS.

**Fortschreibung CP-0374–CP-0378:** L4 wurde implementiert, vom A03-Finanzreview (CP-0375 NONPASS → CP-0376 Fix → CP-0377 PASS) und A09-Adversarialreview CP-0378 PASS geprüft. Die getrennten BICI-/Lohn-/Beschaffungsplanindizes bleiben nichtbuchend, CPI/SPI getrennt und synthetische Gewichte explizit; fehlende/konfligierende Treiber bleiben pending. Das QA-Gate deckt auch koordinierte Historymutation in Save/Restore ab. Die bekannte Grenze falsch als raw_component deklarierter upstream-Treiber bleibt. Keine operative Kosten-/BAB-/UI-/Jahresintegration; T-0063/T-0069 IN_PROGRESS.

**Fortschreibung CP-0378/CP-0379:** A05 integrierte die geprüften L2/L3-L6/L4-Projektionen in die Run-Makroübersicht. Neutral/pending/aktiv, Herkunft/Periode/Lag/Scope, separate L4-Indizes, D-0169-Invarianz und Plan-/Nichtbuchungsgrenze sind sichtbar; keine Berechnung im Renderer. Aktive/neutral Shared-Run-Fixtures, Escaping, Mobile-Layout-Vertrag, Finance-/Run-Nichtmutation und bestehende Run-/Makro-/L2-/L3L6-/L4-/Finance-Regressionen PASS. A09 UI-Adversarialreview läuft; danach A12 Browser-/Geräteprüfung. T-0063/T-0069 bleiben offen.

**Fortschreibung CP-0379/CP-0380:** A09 UI-Adversarialreview NONPASS. (1) 5.000 gültige offene ETA-Effekte erzeugen 5.000 Karten/~2,4 MiB HTML ohne Begrenzung; (2) allgemeiner Hinweis bezeichnet auch beobachtete L4-Quellen unzutreffend als synthetisch. Shared-Run-Datenbindung, neutrale/pending Anzeige, Escaping, getrennte L4-Sichten, D-0169 und Nichtbuchung bestanden; elf Regressionen PASS. A05 soll UI-Ausgabe begrenzen und Quellenhinweis quellenneutral korrekt machen; danach A09-Re-Review, erst dann A12 Browserprüfung.

**Fortschreibung CP-0380/CP-0381:** A05 behebt beide UI-NONPASS-Befunde: maximal 20 initiale Detailkarten insgesamt, per Kanal Gesamt-/wirksam/pending/rest summary ohne versteckte vollständige HTML-Liste; observed vs synthetic vs unknown Quellen werden getrennt und jede Karte bleibt als nicht gebuchte Planprojektion markiert. Exakter 5.000-ETA-Repro: 20 Karten, 12.634 Zeichen. A05 UI-/Makro-/L2-/L3L6-/L4-/Finance-Suites PASS. A09-Re-Review CP-0382 ausstehend; danach A12 Browser-/Gerätetest.

**Fortschreibung CP-0381/CP-0382:** A09 bestätigt CP-0380s beide Befunde als behoben: 5.000 ETA-Effekte werden auf 20 Karten/12.634 Zeichen begrenzt, observed L4 wird nicht als synthetic bezeichnet. Neuer UI-NONPASS: globale Restzeile summiert nur „5 weitere ausgeblendet“ und zeigt nicht globale Gesamt-/wirksam-/pending-Werte (Repro: L2 12/9/3, L3/L6 8/6/2, L4 5/4/1; erwartet global 25/19/6/5). A05 erhält eng begrenzten Fix, dann A09-Re-Review; A12 erst danach.

**Fortschreibung CP-0382/CP-0383:** A05 ergänzt globale Gesamtsummen; der dokumentierte Multi-Channel-Repro ergibt 25 gesamt / 19 wirksam / 6 pending / 5 nicht angezeigt, Kanalwerte unverändert. Der 5.000-ETA-Fall bleibt auf höchstens 20 Karten begrenzt, HTML 12.604 Zeichen. Fokusregression/Syntax/Whitespace PASS. A09 kurzer CP-0384-Re-Review ausstehend; danach A12 Browser-/Gerätetest.

**Fortschreibung CP-0382–CP-0384:** A09 bestätigt den globalen Summenfix PASS: CP-0382 Multi-Channel-Repro zeigt 25/19/6/5 und Kanalwerte stimmen. Der 5.000-ETA-Run rendert 20 Detailkarten/12.604 Zeichen ohne versteckte Voll-Liste; observed L4 wird korrekt bezeichnet; D-0169 und Run-/Finance-State unverändert. Fokussierte Regression PASS. A12 Browser-/Geräteprüfung der UI ausstehend; danach T-0063 Gesamtintegration bleibt offen.

**Fortschreibung CP-0385:** A12 hat den Makro-Run im Browser auf 1265×713 px für den neutralen UPSWING-Startpfad vom 04.01. bis 29.01.2027 geprüft. Erster Tages-/Monatssnapshot ohne sichtbaren Fehler; sechs synthetische Anfragen, Makroprojektionen L2/L3/L6/L4 neutral, Bank/Umsatz/Forderungen/SimTAX unverändert. PASS gilt nur für diesen Desktop-Startpfad; Mobilansicht, Konsole, aktive Wirkungspfad-Fixture, Jahres-/Finance-/Releasegate sind nicht abgedeckt. Bericht und CP-0385 sind abgelegt. T-0063/T-0069 bleiben offen.

**Fortschreibung CP-0386–CP-0391 (L5 MRO-Finanzreferenz):** A03 bestätigte den nichtbuchenden Indikator-/Offertenumfang und hielt individuelle Spreadformel, Laufzeit-/Tilgungs-/Gebühren-/Rundungs-/Fälligkeitsterms offen (CP-0386). A02 bindet MRO-Provenienz und D-0022-Aufschlagsband als Referenzbenchmark im Shared Run; individuelle Konditionen bleiben pending (CP-0387). A05 integrierte die Anzeige (CP-0388); A09 fand den irreführenden führenden Plus bei positivem MRO-Level (CP-0389), A05 korrigierte nur die Level-Formatierung (CP-0390), A09 bestätigte Fix und Nichtmutation im begrenzten Reviewumfang (CP-0391). Der D-0022-Mittelwert +3 pp wird nur als Benchmark, nicht als persönlicher Vertragszins gezeigt. Browsercheck der Karte ausstehend (A12, CP-0392). T-0063/T-0069 IN_PROGRESS; kein Release-/Jahresgate.

**Fortschreibung CP-0392–CP-0394:** A12 dokumentierte in CP-0392 NONPASS: Die L5-Karte fehlte im normalen Run. A05 versionierte den HTML-Modul-Einstieg mit `./run.js?v=v3-t0063-cp0393` (CP-0393). A12 konnte mangels Browserzugriff nicht retesten; A01 reproduzierte den neuen Build in frischem IAB-Tab und bestätigte nach Öffnen des ersten Tages die Karte mit MRO pending, D-0022-Benchmark, individuellen Konditionen offen und unverändertem Finanzstatus (CP-0394). PASS gilt nur für diesen Desktop-Ersttag. A09-Re-Review der CP-0393-Einstiegsbindung, mobile/Tablet-/Konsole- und Jahresgates bleiben offen. T-0063/T-0069 IN_PROGRESS.

**Fortschreibung CP-0395–CP-0398:** A09 CP-0395 fand die fehlende Tokenbindung; A05 band den Entry in CP-0396 per SHA-256 an `run.js` und nutzt denselben Token für den Logo-Rücksprung; A09 CP-0397 bestätigte Hash, Mutationstest und fokussierte Regressionen PASS. A01 öffnete danach den hashversionierten Einstieg im frischen IAB und bestätigte L5-Karte, D-0022-Benchmark und unveränderten Finanzstand nach dem ersten Tag (CP-0398). Zusätzlicher Befund: sticky `#live-status` überlagert beim Scrollen teilweise den unteren Inhalt; A05-Fix und A09-Re-Review folgen. Alte HTML-Kopie am unversionierten Einstieg, transitive Imports, Mobile/Tablet/Konsole und Jahres-/Releasegates bleiben ausdrücklich offen. T-0063/T-0069 IN_PROGRESS; kein Commit/Push.

**Fortschreibung CP-0395–CP-0401:** A09 CP-0395 fand fehlende Payloadbindung; A05 band JS und später CSS per SHA-256 an Dateien und URL in CP-0396/0399. A09 CP-0397/0400 bestätigte Hash- und Statuslayoutregressionen PASS; ein falscher Token wird durch den Mutationstest erkannt. A01 bestätigte im Browser CP-0398/0401 die L5-Karte und danach die Statusmeldung im Dokumentfluss ohne Überdeckung bei 1280×720. CP-0392s fehlende Karte und CP-0398s Overlaybefund sind für den geprüften Desktoppfad behoben. Alte HTML-Kopien am unversionierten Direkteinstieg, transitive Imports, Mobil-/Tablet- und Jahres-/Releasegates bleiben offen; T-0063/T-0069 IN_PROGRESS. Kein Commit/Push.

**Fortschreibung CP-0402:** A03 bestätigte bedingt die fachliche Tragfähigkeit einer ausdrücklich vom Spieler gewählten, nichtbuchenden L4-Kalkulationssensitivität für neue, noch nicht abgegebene Angebote: ProcurementPlanIndex nur auf direkt zugeordnete Material-/Logistikkosten, WagePlanIndex nur auf direkte Lohnkosten; Basis Jan-2027=100, bestehende R-, Vertrags-, Bestands- und Istkosten unverändert; Centrundung je Position nach positivem half-up-Geldpfad. Fehlender Index bei aktiver Wahl bleibt pending; BICI nicht doppelt anwenden. A02 muss Runtime-/Snapshotvertrag und Regression implementieren; A03/A09-Re-Review und A05-Integration folgen. T-0063/T-0067/T-0069 IN_PROGRESS, kein Commit/Push.

## T-0063/T-0067 – A02 L4 Angebotsplan-Sensitivität CP-0403

A02 hat den optionalen Runtimepfad für ausdrücklich unadjustierte oder indexbasierte Angebots-Planwerte implementiert. Jan-2027-Basis, kategoriale Zuordnung, Procurement-/Wage-Index, fail-closed Pending und per-Zeile-Half-up-Rundung sind im Kalkulationssnapshot enthalten; R und Finanz-/Istzustand bleiben unverändert. Die neue Sensitivitäts- sowie vorhandene Angebots-, Finance-, Run-, Makro- und UI-Regressionssuiten bestehen. Die sichtbare UI-Auswahl fehlt noch; der Default bleibt rückwärtskompatibel unadjusted. Nächster Schritt A03-Re-Review, danach A09 adversariales Review, dann A05 UI. Vollständiger Submit/Save/Restore-E2E- und Browser-/Gerätebeleg offen. T-0063/T-0067/T-0069 IN_PROGRESS; CP-0403 Entwurf; kein Commit/Push.

**Fortschreibung CP-0403/CP-0404:** A03-Re-Review fand zwei NONPASS-Punkte: vollständige Kalkulationsprovenienz war nicht an die separate Snapshotbindung gekoppelt; der exportierte Sensitivitätsrechner ließ unvollständige Indexkomponenten zu. A02 hat eine vollständige deterministische Snapshot-Replaybindung an das Submit-Result ergänzt und verschärfte Strukturrprüfungen für Procurement (Material+Logistik, Einheiten/Gewichte/Quellen/Treiber/Aggregation) und Wage (EUR/h/Treiber) implementiert. Reale Submit/Save/Restore/Acceptance-Regressionen sowie beide Spiegelkopien, nach Restore, untergeordnetes Quellenfeld und All-copy-updated incomplete-driver attack bestehen. `R`, BAB und FinanceState bleiben gleich; keine Postingwirkung. PASS gilt für den konkreten Integritätspfad; Replay-Witness ist kein kryptografischer Authentisierungsmechanismus für vollständig neu geschriebene Browser-Saves. A03-Re-Review und A09 unabhängige Prüfung folgen; A05 UI bleibt bis dahin zurückgestellt. CP-0404 Entwurf; T-0063/T-0067/T-0069 IN_PROGRESS; kein Commit/Push.

**Fortschreibung CP-0404/CP-0405:** A03 hat den CP-0404-Snapshot-/Indexfix fachlich PASS geprüft; A09 bestätigte unabhängig den begrenzten Integritäts- und Nichtbuchungsschutz. A05 integrierte die sichtbare Opt-in-Wahl `unadjusted` / `apply_l4_plan_indices`, Kategorie-/Basis-Hinweise und die Erklärung der gemeinsamen Material-/Logistikindexwirkung. Asset-Hashbindung und UI-/Offer-/Finance-/Macro-Regressionen bestehen. Browser-/Geräteretest bleibt offen; T-0063/T-0067/T-0069 IN_PROGRESS, kein Commit/Push. CP-0405 Entwurf.
**Fortschreibung CP-0405/CP-0406:** A03 und A09 bestätigen CP-0404 im begrenzten Snapshot-/Provenienz-/Nichtbuchungsscope PASS; die kryptografische Authentisierung vollständig umgeschriebener lokaler Saves bleibt außerhalb des Schutzes. A05 stellte die sichtbare L4-Opt-in-Auswahl bereit, `run.js` ist SHA-256-gebunden. A01 verifizierte im Desktopbrowser den vorausgewählten Unadjusted-Modus, die Erklärung, fail-closed Pending bei fehlendem ProcurementPlanIndex und danach einen erfolgreichen explizit unadjusted Angebotsweg. Finanzstatus blieb unverändert. Kein positiver indexbasierter Browser-Submit, kein Mobil-/Tablet-/Jahresgate. T-0063/T-0067/T-0069 IN_PROGRESS; CP-0406 Entwurf; kein Commit/Push.

**Fortschreibung CP-0407 (ENTWURF):** A02 ergänzt `costPlanFixtureId` als explizite Run-Setup-Option, Standard `NEUTRAL`; die bestehende Fixture-ID `V3-PLAN-INDEX-SYNTH-EQUAL-1` ist ausschließlich synthetisch. Demo-Vektor Jan-2027 (Basis 100, Lag 1): Material 100 / Energie 110 / Lohn 110 / Logistik 120, dadurch BICI 110, Procurement 110, Wage 110. CP-0374-Formel und ursprünglicher 115-Testvektor bleiben unverändert. Der ausgewählte positive Angebotsweg über Submit, Save/Restore und Kundenannahme besteht; R, BAB-Allokation und Finance-State bleiben unverändert; Profil-/Makroinputmutationen werden verworfen. A02 Runtime-Regressions PASS. A05 Offer-UI-Regression besteht Inhaltsprüfungen, stoppt aber am erwartungsgemäß veralteten `run.js`-SHA-256-Token; A05 aktualisiert JS-/Buildtoken nach A03-/A09-Review und wiederholt die Entry-Cache-Suite. T-0063/T-0067/T-0069 bleiben IN_PROGRESS; CP-0407 ENTWURF. Kein Commit/Push. Bericht: [A02-CP-0407](../simulation/a02-t0063-l4-positive-cost-plan-fixture-cp0407.md), [CP-0407](checkpoints/CP-0407.md).

**Nachtrag CP-0409:** A02 ergänzt die vorher fehlende direkte Assertion zum kombinierten Altvektor Material 110 / Energie 100 / Lohn 100 / Logistik 120 bei gleichen 25%-Gewichten: BICI 107.5, Procurement 115, Wage 100. `node prototype/v3-business-cost-plan-index-regressions.mjs` PASS. Die CP-0407-Berichtsbehauptung des bereits vorhandenen direkten Nachweises war überzogen; CP-0407 bleibt unverändert und ein verknüpfter A02-Nachtrag hält die Lücke und den neuen Beleg fest. A03-Re-Review dieses Nachtrags und A09 unabhängige QA stehen aus; Browserprüfung nicht ausgeführt. T-0063/T-0067/T-0069 IN_PROGRESS; kein Commit/Push. [CP-0409](checkpoints/CP-0409.md), [A02-Nachtrag](../simulation/a02-t0063-l4-combined-vector-regression-nachtrag-cp0409.md).

**Fortschreibung CP-0408–CP-0410:** A02 ergänzte den direkten kombinierten Altvektor-Nachweis; A03 und A09 haben CP-0409 danach PASS gereviewt. A05 integrierte am Run-Start `NEUTRAL` als Standard und eine ausdrücklich synthetische Kostenplan-Fixture mit Januar-2027-Basis, Einmonats-Lag und klarer Start-/Enddatumsvalidierung ohne automatische Datumskorrektur. UI-, Entry-Cache- und relevante Run-/Makro-/Kostenindex-/Angebotsregressionen bestehen; Assethash ist aktualisiert. Browser-/Gerätetest durch A01 bleibt offen. T-0063/T-0067/T-0069 bleiben IN_PROGRESS; keine Releasefreigabe, kein Commit/Push; CP-0410 Entwurf.

**T-0063 Fortschreibung / A08 CP-0425 (2026-11-01):** Nach CP-0424 empfiehlt A08 als nächsten kleinsten Quellen-/Spielbarkeitsschnitt einen optionalen Destatis-Einfuhrpreis-Benchmark für offene Angebotsplanpositionen. L2 besitzt bereits FX-/Importplan, Exportmix und ETA; L4 Kostenplanindex und Angebotssensitivität. Neu wäre nur die quellengebundene Monatsdaten-Brücke mit publishedAt-As-of-Gate und getrennter synthetischer 2027+-Zukunft. Nur opt-in Planannahme, keine Ist-/Finanzbuchung, Vertragsänderung oder Doppelzählung. A02/A03/A05/A09-Review, Integration und Browser-/Jahresgates offen. [Bericht](../research/a08-t0063-next-channel-cp0425.md), [CP-0425](checkpoints/CP-0425.md). T-0063 IN_PROGRESS; kein Commit/Push.

**T-0063 / CP-0428 A02 Destatis-Einfuhrpreisreferenz (ENTWURF):** Read-only, optionale Quelle in Macro-Day-Open-Input und separate `references[]`-Projektion. Beobachtung September 2026 mit Release-/Vintage-Belegen; kein behaupteter GENESIS-Zellzeitstempel, keine Importexposition, Koeffizienten oder automatische Kostenwirkung. A02-Regressionen bestehen; A03-Re-Review, A09-QA, A05-Anzeige und A01-Browserprüfung offen. T-0063/T-0067/T-0069 bleiben `IN_PROGRESS`; kein Commit/Push. [CP-0428](checkpoints/CP-0428.md), [A02-Bericht](../simulation/a02-t0063-import-price-reference-bericht-cp0428.md).

**Fortschreibung CP-0441 (2026-11-01):** A01-Browserbeleg im Shared Run: explizites 20-€-Kundenangebot mit DB I 18 € / nach BAB 17,80 € wurde am 06.01. angenommen und als Auftrag mit pending Finance-Handoff angelegt. Im selben Lauf wurde ein eigenes Produkt explizit mit 2 h geplant und abgeschlossen; Fertigwarenbestand +2 (2/10), Plan-DB I 5 € / nach BAB 4 €, ohne Absatz/Erlös/COGS/Buchung. Die gezielten 8 V3-Regressionen plus Syntax und git diff --check bestehen. Käuferannahme/Absatz-/Bestandsabgang für Produkt, dynamischer Produkt-BAB, Jahresreconciliation und unabhängige A03/A09-Reviews bleiben offen. Vor CP: 10 geänderte getrackte und 395 ungetrackte Dateien; main@8b72b7e gleichauf mit origin/main. Kein Commit/Push. Details: [CP-0441](checkpoints/CP-0441.md).

**Fortschreibung CP-0442 (2026-11-01):** V3 zeigt jetzt einen synthetischen Basislauf und explizite Anfangsressourcen als Vorschläge; Start und Ressourcenübernahme bleiben bis zur Bestätigung blockiert. Parameteränderungen invalidieren die jeweilige Zustimmung. Im Browser wurde unbestätigter Submit blockiert, bestätigter Vorschlag übernommen und Ressourcenstart bis zum Shared-Run-Tagesstart geprüft. A01-Regressions, Syntax, SHA-256-Graph/Entry und git diff --check PASS. Future UX: Szenario-gesteuerte Ressourcen oder geführter Start. Kein unabhängiger A09- oder Geräte-Review; keine Ticket-Gesamtfreigabe. [CP-0442](checkpoints/CP-0442.md).

**Fortschreibung CP-0469 (2026-11-01):** Die Minimalziele für T-0063, T-0065, T-0066, T-0067 und T-0069 sind in [a01-v3-offene-minimalziele.md](a01-v3-offene-minimalziele.md) als binäre PASS/FAIL-Gates operationalisiert. T-0066 bleibt bei 9/10; G10 NONPASS. T-0064/T-0068 sind nicht als abgeschlossen angenommen und vor Gesamtabnahme gegen aktuelle Einzelbelege abzugleichen. Kein Ticket geschlossen; keine Implementierung, kein Commit/Push. [CP-0469](checkpoints/CP-0469.md).

**Fortschreibung CP-0470 (2026-11-01):** Auf Nutzerauftrag hat jedes der fünf zuletzt offen geführten Tickets T-0063/T-0065/T-0066/T-0067/T-0069 exakt zehn binäre Minimalzielkriterien erhalten. Für jeden Abschluss sind 10/10 PASS samt erforderlichen Fachreviews nötig. T-0066s zehn Kriterien entsprechen weiterhin G1–G10; CP-0468-Stand bleibt 9/10, G10 NONPASS. Keine Tickets geschlossen, keine Implementierung, kein Commit/Push. [Zielmatrix](a01-v3-offene-minimalziele.md), [CP-0470](checkpoints/CP-0470.md).

**Fortschreibung CP-0471 (2026-11-01):** T-0066 G10-Quellenreferenzen sind nun an abgeschlossene Materialverbräuche, Arbeitszeit-/Maschineneinsatzbelege und historischen BAB-Quellpool-Snapshot gebunden; UI-IDs sind read-only, gefälschte Quellen fail-closed. FIFO-, Produkt-, Shared-Run-, UI- und FinanceRuntime-Regressionen sowie scoped diff-check PASS. Beträge bleiben manuell eingegebene Bewertungswerte ohne verifizierte Ist-Geldwertsätze; A03/A09-Re-Review und Browser-Smoke fehlen. G10 bleibt NONPASS; T-0066 IN_PROGRESS, 9/10. [Bericht](a01-t0066-source-binding-review-cp0471.md), [CP-0471](checkpoints/CP-0471.md).

**Fortschreibung CP-0472 (2026-11-01):** Nutzerklärung: BAB und vollständiges Ist-COGS werden erst in einer späteren Version ausgearbeitet und sind kein V3-Blocker für T-0066. G10 ist auf physischen FIFO-Mengenabgang, Käufer-/Angebotssnapshot, Bestandsintegrität und den expliziten Status `pending_deferred_bab` begrenzt; Versand bleibt möglich, es wird kein vollständiger Ist-COGS-Wert vorgetäuscht. Die gezielten Produkt-, Orchestrator-, UI- und FinanceRuntime-Regressionen PASS. A03-/A09-Re-Review und Browser-Smoke stehen aus; T-0066 bleibt IN_PROGRESS. CP-0471 bleibt unverändert historisch. [Bericht](a01-t0066-bab-deferral-review-cp0472.md), [CP-0472](checkpoints/CP-0472.md).

**Fortschreibung CP-0473 (2026-11-01):** Erste A03-/A09-Reviews fanden BAB-Pflicht im Produkt-UI/Angebotspfad, COGS-Statuswechsel durch vorhandene Kostenlayer und unvollständige Dispatch-Eventbindung. A01 korrigierte den aktiven T-0066-Produktpfad auf DB I ohne BAB, trennte illustrative FIFO-Allokation von Sale-COGS und härtete Dispatch-Eventvalidierung gegen COGS-/Mengenmanipulation. A03-Re-Review PASS für G7/G8/G10; A09-Re-Review PASS für G7–G10. Fünf gezielte Regressionen und scoped diff-check PASS. Browser-Smoke und übrige Ticketgates ausstehend; T-0066 bleibt IN_PROGRESS. [Bericht](a01-t0066-independent-rereviews-cp0473.md), [CP-0473](checkpoints/CP-0473.md).
**Fortschreibung CP-0475 (2026-11-01):** T-0063-Makro-/Politik-/Außenwirtschafts-/Betriebswirkungsregressionen und 30-/90-Tage-Validatorbenchmark PASS; reale Politik-/Außenwirtschafts-Betriebswirkungen bleiben teilweise Planprojektion. Neuer T-0069-Vierprofil-Jahreslauf startete, wurde nach Übergang zum zweiten Profil ohne Ergebnisbericht kontrolliert beendet; kein neuer Jahres-PASS. Vollständige Firmen-/Bestands-/Finanz-/Ledgerreconciliation, Laufzeitgate und Browser-/Mobilgate offen. T-0063 bleibt 6/10 Minimal, 4/10 Optimal; T-0069 5/10 Minimal, 4/10 Optimal; beide IN_PROGRESS. Bericht und CP-0475; kein Commit/Push.
## MG-002 – Untertickets für offene T-0063-/T-0069-Gates (CP-0476)

**Übergeordnete Tickets:** T-0063 und T-0069 bleiben `IN_PROGRESS`. Die Fortschrittsskalen 6/10 und 5/10 sind keine Zahl bestandener Einzelgates. Zum Start des CP-0476 waren T-0063 G3, G5, G7, G10 und T-0069 G3, G5, G6, G7, G8, G9, G10 offen. Nach CP-0483 sind T-0063 G3, G7, G10 (3) und T-0069 weiterhin G3, G5, G6, G7, G8, G9, G10 (7) offen. Die 11 Untertickets sind in [Gate- und Unterticketregister CP-0476](a01-t0063-t0069-offene-gates-und-untertickets-cp0476.md) mit Einzelabnahme, Owner und Abhängigkeit beschrieben.

| Unterticket | Gate | Federführung | Status |
|---|---|---|---|
| T-0070 | T-0063 G3 Außenwirtschaft | A02; A08/A03/A09 reviewen | COMPLETED — A01-Gateabnahme in CP-0487 |
| T-0071 | T-0063 G5 EZB | A03; A02/A09 reviewen | COMPLETED – Slice fachlich/QA PASS; A09 bestätigt G5-Wortlaut; G7 bleibt separat |
| T-0072 | T-0063 G7 operative Wirkung | A02; A03/A08/A09/A05 reviewen | COMPLETED — A09 pair/re-review PASS, CP-0488 |
| T-0073 | T-0063 G10 Fachabnahme | A09; A08/A02/A03/A05 belegen | COMPLETED — A09 finale T-0063-Gesamtprüfung PASS nach T-0081; CP-0501 |
| T-0074 | T-0069 G3 Jahreswirtschaftlichkeit | A02; A03/A09 reviewen | IN_PROGRESS — NONPASS: kein finanziell abgeglichener tragfähiger oder scheiternder Jahresverlauf. A02-Handoff aus bestehenden T-0075/76-Artefakten erstellt; A03 bestätigt, dass die Daten nur operative Mengen/Bezüge, keine Finanzjahreswerte oder Postings belegen. T-0075 braucht weiterhin einen neu gebundenen Laufbeleg. CP-0541.
| T-0075 | T-0069 G5 Auftrags-/Produktfluss | A02; A05 integrieren, A03/A09 reviewen | COMPLETED — jährlicher Auftrags-/Produkt-Enginepfad PASS; A03-Finanzgrenzenreview PASS; A09 unabhängiger G5-Review PASS. Kein Jahres-Finanzreconciliationclaim; der liegt in T-0077. CP-0513. |
| T-0076 | T-0069 G6 Bestand/Monatsabschluss | A02; A03/A09 reviewen | COMPLETED — 12/12 Monats-Snapshots und Mengen-/Restoregrenzen PASS; CP-0490. Aktuelle Neuprüfung mit geänderten D-0157-Contract-Fixtures: 12 Perioden, 12 Kundenaufträge, 8 Produktversände, 12/12 stateHash=restoreHash, State `fa28ab6a…e56d462`, Snapshotdatei `F12B7529…02D60E`; A09 PASS. Mengen-Smoke: `pendingFinance=true`, BAB vertagt, keine Finanz-/COGS-/Ledger-Reconciliation. CP-0525. |
| T-0077 | T-0069 G7 Finanz-/Ledgerabgleich | A03; A02/A09 reviewen | IN_PROGRESS — NONPASS: Payroll, gesetzliche Steuern, Zinssatz/Zinsbuchung, bewertete Vorräte/COGS und vollständiger GL-Jahresabgleich fehlen. A09 PASS nur für den abgegrenzten Dispo-Kapital-/UI-/Restore-Codepfad (T-0120/23/25/26), statisch; keine Vollreconciliation. A02-Handoff und A03-Mapping: bestehender AP/Bank-Subledger ist ein implementierbarer enger Slice, aber T-0075/76 liefern keine Jahres-AP-Zahlungsbelege. D-0178 COGS PENDING. CP-0541.
| T-0078 | T-0069 G8 Recovery | A02; A09 unabhängig prüfen | COMPLETED — A02 Vierprofil-Baseline-/Recoverypaare und A09 unabhängige DOWNTURN-/LOW-Prüfung bestätigt; Reconciliationnachtrag in CP-0501. |
| T-0079 | T-0069 G9 Laufzeit | A02; A09 messen/reviewen | COMPLETED — alle vier 12M-Profile <360 s, A09 PASS (CP-0489) |
| T-0080 | T-0069 G10 Browser/Unabhängigkeit | A12; A05/A09 unterstützen | IN_PROGRESS — Finanz-Code-Review für den abgegrenzten T-0120/T-0123/T-0125/T-0126-Scope PASS (A09, CP-0541); das Gate bleibt offen, weil der aktuelle Browser-/Mobil-Smoke durch A12 mangels erreichbarem Testbrowser/Build nicht belegt ist. Vollständiger G3/G7-Reconciliation-PASS fehlt weiterhin.
| T-0081 | T-0063 G2 vier Phasen/Reproduzierbarkeit | A02; Review A09 | COMPLETED — A09 PASS: vier Profile mit übereinstimmenden State/Event/Monatslog-Hashes, 362 Tage/12 Monate/1.409 Ereignisse je Profil; CP-0501 |
| T-0082 | T-0063 G6 Inflations-Basiswechsel | A02; Vektorreview A03; QA A09 | COMPLETED — synthetischer Rebase, Monatslücken fail-closed; A03/A09 PASS, CP-0490 |
| T-0083 | T-0063 G8 Politik-Lags/Replay | A02; Quellenreview A08; QA A09 | COMPLETED — 8 Kanäle, test-only Lag; A08/A09 PASS, CP-0490 |

Untertickets werden einzeln an A01 zurückgemeldet. A01 übernimmt Befunde, weist Folgearbeit zu und schließt Parent-Tickets erst nach vollständigem 10/10-Nachweis.

**Fortschreibung CP-0477 (2026-11-01):** Ticket-Subtasks T-0070/T-0071/T-0077/T-0079 sind aktiv, kein Hauptgate geschlossen. A02/A09/A08 bewerten Außenwirtschaft: drei Kanäle vorhanden, aber nur Auslandsnachfrage ändert tatsächlich Templates; FX/ETA sind noch nicht an offene Angebots-/Bestellzustände gebunden. T-0071 bleibt PARTIAL: A03 testet SPI→MRO→Quote; A09 fordert EZB/MRO→nachgelagerten Indikator. T-0077: A03 findet fehlendes GL/AP/Payroll/Steuerabführung/Dispo/COGS; Journalprojektion als Teilpfad in Arbeit. T-0079: 30/90 Tage PASS, einzelner Jahres-Smoke timed out nach 240s ohne Hash; 360s vorgeschlagen, A09-Review offen. Siehe Bericht/CP-0477; keine Änderung an Parent-Status, kein Commit/Push.

**Nachtrag T-0079 / A09:** A09 hat die konkrete ex-ante Grenze von 360 Sekunden je Profil für Windows/Node.js v24.22.1 als angemessene Messgrenze bestätigt (PASS nur für das Testlimit, nicht für Jahresprofile). A02 startet als Nächstes einen einzelnen UPSWING-Jahreslauf mit harter 360-s-Grenze; die übrigen Profile warten bis zu dessen PASS. Bericht: `a09-t0079-runtime-limit-review-cp0476.md`.


**Fortschreibung CP-0478 (2026-11-01):** T-0077 Phase 1 (A03) hat fokussierte Regressionen bestanden; A09 unabhängige QA ist NONPASS wegen nicht geprüfter restaurierter Payload-Hashes und fehlender Prüfung doppelter `paymentId`. A03 erhält Korrekturauftrag, danach A09-Re-Review. T-0070 bleibt in Arbeit; T-0071 PARTIAL. T-0079: 360-s-Grenze reviewed, kein Jahreslauf-PASS. T-0080: Testmatrix vorbereitet, kein Browser-/Geräte-PASS. T-0063 weiterhin 4 Gates offen, T-0069 weiterhin 7. Details: CP-0478 und `a01-t0063-t0069-subticket-progress-cp0478.md`; kein Commit/Push.

**Fortschreibung CP-0479 (2026-11-01):** T-0077 Phase 1 PASS nach A03-Fix/A09-Re-Review, aber T-0077/G7 bleibt PARTIAL wegen fehlender A02-Integration und übriger Finanzflüsse. T-0070 FX-Vorschau backendseitig umgesetzt, noch ohne UI/Fachreview; bleibt NONPASS. A02s einzelner UPSWING-12M Lauf unter 360 s war bei CP-Erstellung noch ohne Endstatus. T-0063 (4 Gates) und T-0069 (7 Gates) bleiben IN_PROGRESS; keine Parent-Gates geschlossen. Siehe CP-0479 und Fortschrittsbericht; kein Commit/Push.

**Fortschreibung CP-0480 (2026-11-01):** T-0070 hat Backend/UI und A08 Quellenreview als Teilfortschritt; A03/A09 Review und Browserprüfung offen. T-0079 ein UPSWING-12M-Profil unter 360 s PASS (242,163 s, Hash `5c8f83f4…`); drei Profile und A09-Messreview offen. T-0077 Phase 1 PASS nach A09-Re-Review, Gesamt-G7 bleibt offen. T-0063 vier und T-0069 sieben Gates weiter offen. Details: CP-0480/Fortschrittsbericht; kein Commit/Push.

**Fortschreibung CP-0481 (2026-11-01):** T-0070 UI, A03-Finanzgrenze und A08-Quellenreview sind als Teilprüfungen dokumentiert; G3 bleibt NONPASS bis A09-Prüfung und ein zweiter operativer Außenwirtschaftskanal belegt sind. T-0071 Simulationsslice PASS auf Implementierungsebene, A03/A09-Review offen. T-0079 UPSWING 12M unabhängig reproduziert unter 360 s; drei Profile/Annual reconciliation offen. T-0077 Phase 1 PASS, Gesamt-G7 offen. Gatezählung: T-0063 vier, T-0069 sieben. Siehe CP-0481; kein Commit/Push.

**Fortschreibung CP-0482 (2026-11-01):** T-0071 A03-Finanzgrenzenreview PASS, A09 unabhängige QA PARTIAL/NONPASS wegen fehlender gespeicherte-State-Fingerprint-/Tamper-/Duplicate-/Mehrfachwirkungstests und fehlender UI; A09-Re-Review nach Abschluss des A03-Reviews offen. T-0070 UI-Test-Fixture-ID korrigiert, Regressionen PASS; Gate NONPASS bis operativer zweiter Außenwirtschaftskanal/A09-UI-/Replayreview/Browserbeleg. T-0063 vier und T-0069 sieben Gates weiter offen. Siehe CP-0482; kein Commit/Push.


**Fortschreibung CP-0483 (2026-11-01):** T-0071 ist nach A02-Härtung, A03-Finanzreview und A09-Re-Review COMPLETED; T-0063 G5 PASS. Der zusätzliche `investmentPlanIndex` ist nonbinding und kein G7-Nachweis. Offene Gates: T-0063 G3/G7/G10 (3); T-0069 G3/G5/G6/G7/G8/G9/G10 (7). Weitere Abhängigkeiten und Grenzen: CP-0483/Fortschrittsbericht; kein Commit/Push.

**Fortschreibung CP-0484 (2026-11-01):** T-0070s internationaler Materialreceipt-Slice A02 implemented, A03 finance boundary PASS, A09 independent QA PASS. Physical stock and operation sufficiency change; no monetary/AP/ledger effect. A05 UI is still in progress, A08 source/assumption review and UI QA remain; T-0070/G3 open. T-0076 advances only in physical quantities, no full monthly close. T-0063 G3/G7/G10 (3) open; T-0069 G3/G5/G6/G7/G8/G9/G10 (7) open. See CP-0484; no commit/push.

**Fortschreibung CP-0485 (2026-11-01):** T-0070: A05 Materialbestell-/Receipt-UI und Fokusregressionen abgeschlossen; A08 Quellenannahmen PASS und A03 Finanzgrenze PASS. A09 UI-/Replay-Review läuft, kein Browserlauf; T-0070 bleibt IN_PROGRESS. T-0077: A03 bestätigt eng begrenzte Kundenjournalprojektion, Gesamt-G7 bleibt offen. T-0078: A09 Recovery-Audit NONPASS; für keines der vier Jahresprofile ist Recovery mit identischem fachlichem Endhash belegt. T-0075 wird von A02 bearbeitet; T-0078-Codearbeit wartet, um Überlappungen zu vermeiden. Gatezahl unverändert: T-0063 drei (G3/G7/G10), T-0069 sieben (G3/G5/G6/G7/G8/G9/G10). Details: CP-0485 und Fortschrittsbericht; kein Commit/Push.

**Fortschreibung CP-0486 (2026-11-01):** T-0070 Materialorder/Receipt-UI und A09 Handler-/Runtime-Re-Review PASS im engen Slice; A08 FX-Quellen-Re-Review läuft. Kein Browser-Smoke, A01-Gesamtgatebeurteilung steht aus; T-0070 weiterhin IN_PROGRESS. T-0075 Jan–März Shared-Run-Slice PASS nach A03/A09 Review, aber kein 12M-Lauf; zwei Jahres-Smokes timed out bei 360 s ohne Hash, T-0075 IN_PROGRESS. T-0077 Gesamt-G7 offen nach begrenztem Kundenjournal-PASS. T-0078 A09 NONPASS; T-0079 Laufzeitdiagnose bei A02. Gatezahl T-0063 drei (G3/G7/G10), T-0069 sieben (G3/G5/G6/G7/G8/G9/G10). Details CP-0486/Fortschritt; kein Commit/Push.

**Fortschreibung CP-0487 (2026-11-01):** A01 hat T-0070/T-0063 G3 nach integrierter Quellen-, Finanz-, Runtime- und UI-Re-Review als COMPLETED/PASS bewertet. Zwei echte Variablenänderungen liegen in Auslandsnachfrage-Verteilung und physischer Materialverfügbarkeit; FX ist nur ein dritter nichtbuchender Planindikator. Kein Browser-Smoke; nicht T-0070-blockierend. T-0063 hat G7/G10 offen (2). T-0069 hat weiterhin 7 offene Gates: G3/G5/G6/G7/G8/G9/G10. T-0075 Dreimonatsslice PASS, Jahresläufe timeout; T-0078 Recovery NONPASS; A02 bearbeitet Laufzeit und Recovery. Details CP-0487/Fortschrittsbericht; kein Commit/Push.

**Fortschreibung CP-0488 (2026-11-01):** T-0072/T-0063 G7 wurde nach A09 Re-Review als PASS/COMPLETED bewertet. Die fehlende Makro-UI-Funktion wurde wiederhergestellt und die zuvor nicht startenden Regressionen bestehen. T-0063 hat nur noch G10/T-0073 offen (1); T-0069 hat G3/G5/G6/G7/G8/G9/G10 offen (7). A02s neuer sequenzieller Jahreslauf hat UPSWING und BOOM unter 360s bestanden; DOWNTURN/LOW folgen. T-0078 Recovery bleibt offen. Kein Browser-Smoke, Commit oder Push. Siehe CP-0488.

## MG-002 / CP-0489 – Gate-Neubewertung und Folgeuntertickets

Nach Abschluss des Vierprofil-Messlaufs ist T-0079/T-0069 G9 **COMPLETED/PASS**. Der unabhängige T-0073-Review stellte drei bisher nicht erkannte T-0063-Lücken in G2, G6 und G8 fest; dafür wurden T-0081–T-0083 eingerichtet. T-0073/G10 bleibt offen bis diese drei Kriterien bestehen und A09 die Gesamtfachabnahme wiederholt. A12 konnte T-0080 nicht im Browser testen; der Endpunkt und Syntaxcheck bestehen, aber kein Browser-/Viewport-PASS liegt vor.

Aktuelle offene Einzelgates: T-0063 **G2, G6, G8, G10 (4)**; T-0069 **G3, G5, G6, G7, G8, G10 (6)**. T-0069/G9 ist geschlossen. Gesamt: **10 offene Gates**, jeweils mit Unterticket in T-0073–T-0083.

Bericht: `a01-t0063-t0069-subticket-progress-cp0489.md`; Momentaufnahme: CP-0489. A02 setzt T-0078 fort; danach bearbeitet A02 nacheinander T-0081–T-0083. T-0074 bleibt von T-0075–T-0077 abhängig. Keine Produkt-/Rechtsentscheidung, Schemaänderung, Commit- oder Push-Aktion.

## MG-002 / CP-0490 – T-0076/T-0082/T-0083 reviewed

A01 schließt T-0076/T-0069 G6 nach 12/12 Monats-Snapshots sowie A03/A09-PASS im Mengen-/Kapazitätsscope ab. T-0082/T-0063 G6 besteht nach A01-Korrektur der Monatslückenbehandlung und A03/A09-Re-Review. T-0083/T-0063 G8 besteht nach A08-Quellen-/Annahmenreview und A09-Technikreview für acht Kanäle. T-0079/T-0069 G9 war mit CP-0489 geschlossen. Offen sind T-0063 G2/G10 (2) sowie T-0069 G3/G5/G7/G8/G10 (5), insgesamt **7 Gates**.

T-0078 bleibt nach reviewed UPSWING-Slice offen; drei Profile fehlen. T-0081 Same-Seed-Replays aller vier Profile laufen. T-0077 bleibt PARTIAL; sein Kundenreceipt-Monatsgrenzenvektor ist kein Jahres-G7-PASS. T-0080 bleibt NONPASS mangels steuerbarem Browser-/Viewportnachweis. Fortschritt/Belege: `a01-t0063-t0069-subticket-progress-cp0490.md`, CP-0490. Kein Commit/Push.

## Aktueller Koordinierungsstand (2026-11-05; CP-0501 Entwurf)

- **T-0063 / T-0081 / T-0073:** A09 hat das Vierprofil-Same-Seed-Ergebnis von T-0081 als PASS geprüft; T-0073 kann nach den zuvor bestandenen G6/G8-Gates ebenfalls PASS erhalten. A01 hat T-0081, T-0073 und T-0063 in diesem Koordinierungsstand geschlossen. Die CP-0490-Zeilen weiter oben sind historische Momentaufnahmen.
- **T-0065 – Markt und Angebote (A02):** Als nächstes fixe Seeds für segmentierte Anfragen, Konkurrenz-/Preiswirkung, Annahme/Ablehnung/Verfall und Monatsdurchschnittsbericht auswerten; mindestens einen tragfähigen und einen verlustbringenden Verlauf mit T-0067 abstimmen. A03 prüft Preis-/Kosten-/Cashgrenze, A09 Reproduzierbarkeit.
- **T-0066 – Produktivität/eigene Produkte (A02):** gemischte Mehrperiodenfälle über Entwicklung, Arbeitsschritte, Bestand, Verkauf/Versand und Rücklauf belegen; A03 bestätigt FIFO-/Finanzgrenzen, A05 UI und A09 unabhängig.
- **T-0067 – Kalkulation/BAB (A03 mit A02/A05):** Kalkulations-/BAB-Snapshot über Angebot und Produkt verbinden; Kosten-, DB-I-, Rundungs- und Finanzabgrenzungvektoren abstimmen. A09 re-reviewt. Keine Buchung oder Bestandsbewertung ohne belegte Werte.
- **T-0069 – Jahresintegration:** bleibt offen mit T-0074 (wartet auf 0075–0077), T-0075 (kein gemeinsamer 12-Monats-Auftrags-/Produktlauf mit Midyear-Restore/Resume; A02 bearbeitet Quellen/Artefakte vor neuem Lauf), T-0077 (A03/A02: AP-/Zahlungsquellereignisse und weitere Finanzflüsse fehlen), T-0078 (A02: UPSWING und BOOM Baseline/Recovery PASS; DOWNTURN/LOW ausstehend, je Lauf max. 360 s), T-0080 (A12 Browser-/Viewport-Smoke 390×844 und 768×1024; A05 Fix nach Vollreload bestätigt, A09 Reconciliation danach). T-0076/T-0079 sind abgeschlossen.
- **T-0084 – Prüfungsquellenkorpus (A06/A07/A08/A09):** A10s Manifest v1 enthält 129 Hash-geprüfte Datensätze; A06/A07 Batch 1 ist nur begrenzter PASS für Kandidatenverknüpfungen. A08 bestätigt alle 129 Nutzungsrechte weiterhin UNKNOWN / DO NOT USE IN PRODUCT. Batch 2 bleibt ausgesetzt, bis Lesbarkeit/OCR, Rechteprovenienz und beabsichtigte Verwendung geklärt sind; unabhängig erstellte Materialien aus freigegebenen Rechts-/Kompetenzquellen können weitergehen.
- **T-0109 – Spielgebundene WBQ/HQ-Übungsfälle mit Feedback (SLG-002.4; A07 führt, A06 Kompetenzbezug, A05 UI, A09 Review):** erster Slice nur „Anfrage prüfen“ an einer offenen Kundenanfrage mit dem internen Prozesslernobjekt. Keine HQ/WQ-Originaltexte. Binär: nur gültige offene Anfrage; nur verfügbare Felder; kriterienspezifische richtige/falsche Rückmeldung; Rücksprung zur selben Anfrage; Lernfortschritt getrennt vom Unternehmensstate; Regression belegt unveränderte Anfrage/Angebot/Plan/Cash/AR/Bestand/Ledger und Save/Restore.
- **T-0110 – V3-Daten- und Änderungsgrenzen inventarisieren (SLG-002.5; A11 führt, A04/A02/A03/A09/A10 Sichtbeiträge):** für Kundenauftrag, Beschaffung/Wareneingang, Eigenprodukt, Lernereignis und Makrowirkung Ereignis, Zustand, persistierte Daten, Finanzwirkung, Replay/Dedupe und Freigaberolle abbilden. Unbekanntes bleibt offen; T-0077 bleibt separat; keine Schema-/Architektur-/Persistenzfreigabe.
- **Goals:** MG-002 bleibt IN_PROGRESS; SLG-002.2 bleibt IN_PROGRESS. SLG-002.4 und SLG-002.5 werden über T-0109/T-0110 aktiv vorangetrieben. V4–V12 sind Roadmap, keine aktiven Release-Goals.

Alle Agenten liefern an A01. Es wurde nichts committet oder gepusht; lokale Änderungen blieben erhalten. CP-0500 und MCP-2026110401 bleiben unverändert.

## A01-Fortschreibung der offenen V3-Tickets (2026-11-05; CP-0501 Entwurf)

- **T-0065:** A02/A05-Markt-/Shared-Run-Slice liegt vor. A01 führte die fokussierten Markt-, Orchestrator-, UI- und Shared-Run-Regressionen erneut aus; alle vier bestanden, `git diff --check` im Scope ohne Beanstandung. A09-Gesamtreview bleibt ausstehend.
- **T-0066/T-0067:** Produktlebenszyklus-, Produkt-UI- und BAB-/Finance-UI-Regressionen bestanden. T-0066 bleibt wegen noch offener binärer Gates und unabhängiger Abnahme offen; T-0067 bleibt wegen vollständiger Angebots-/Produktintegration, Fach- und QA-Abnahme offen.
- **T-0078 / T-0069 G8:** Post-fix DOWNTURN und LOW Baseline-/Recovery-Paare bestehen aktuell in-memory, je 362 Tage/12 Makromonate/1.415 Events; Midyear-Run-/Finance-Restore und sechs Fail-closed-Negativfälle PASS. A09 hat DOWNTURN unabhängig bestätigt; LOW unabhängiger Lauf läuft. Bericht: `docs/simulation/a02-t0078-restore-hash-reconciliation-2026-11-05.md`. Gespeicherte JSON-Baselines sind vor dem Fix und bleiben unverändert, bis A09 LOW bestätigt; T-0078/T-0069 bleiben bis dahin offen.
- **T-0080:** A05 390×844-/768×1024-UI-Smoke bleibt PASS; A09-Finanz-/Reconciliation-Review steht aus.
- **T-0084:** Nutzer bestätigt keine Lizenz. T-0084 ist **BLOCKED** für Inhalts-/Lesbarkeitsauswertung der HQ/WQ-Prüfungsdateien. A10-Manifest v2/A09-Integritätsreview decken alle 129 Dateien als `NO_PROJECT_REUSE_LICENSE_PROVIDED` / `DO_NOT_USE_IN_PRODUCT` ab. Keine weitere Datei wird für Itemextraktion geöffnet; unabhängige Lerninhalte aus freigegebenen Quellen bleiben möglich.
- **T-0109:** Fokussierte Antwort-/Feedback-/Invarianz-/Save-Restore-Regression bestanden. UI-Klick → getrenntes localStorage → Reload → Wiederanzeige bleibt unbewiesen; keine Browseraktion erfolgte, da Computer Use die aktuelle URL nicht sicher bestimmen konnte.
- **T-0110:** A11 ergänzte Evidenzmanifest, A09 bestätigte die 30-Zeilen-/Scope-Matrix. A04-Rereview der geänderten Fassung und A10-Lieferreview sind offen; T-0109-Klick-/Reloadbeleg bleibt offen. Keine Schema-/Architektur-/Persistenz-/Releasefreigabe.

MG-002 bleibt IN_PROGRESS. T-0063/T-0073/T-0081 sind abgeschlossen. CP-0500 und MCP-2026110401 bleiben eingefroren. Kein Commit oder Push.

**Nachtrag:** Die Laufstatuszeile zu T-0078 oben wurde überholt. A09 hat LOW unabhängig bestätigt und das aktualisierte Baseline-Fixture geprüft; T-0078/T-0069 G8 ist final **COMPLETED/PASS**. Nur die DOWNTURN-/LOW-Hashfelder wurden ersetzt. Der A02-Reconciliationbericht erhält noch einen datierten Nachtrag. T-0069 bleibt insgesamt IN_PROGRESS.

**Neuer Stand:** Der A02-Reconciliationbericht ist ergänzt; JSON-Baseline und Reporthash sind im CP-0501-Nachtrag gebunden. T-0065 A09-Review ist abgeschlossen, das Ticket aber wegen mehrerer fehlender Kontroll-/Integrationsgates noch offen. A02 bearbeitet nun die kontrollierten T-0065-Effektpaare und 3×20-Tages-Traces. T-0066 hat den vorhandenen Mixed-Run-Pfad und gezielte Regressionen bestanden; sichtbarer Browser-Smoke und erneuter A09-Review nach der BAB-Zielklarstellung bleiben offen. T-0066-Minimalziel macht den Direktkosten-/DB-I-Verkaufssnapshot unabhängig vom separaten T-0067-Plan-BAB; Ist-COGS/Posting bleibt ausstehend.

**A09-Gatematrix-Nachtrag:** T-0066 ist durch `docs/test-reports/a09-t0066-gate-matrix-review-2026-11-05.md` geprüft: G1–G7/G9/G10 PASS im geprüften Codeumfang; G8 NONPASS. Je Kostenzeile fehlen Einheit, Quellenreferenz, Rundungspolitik und Rundungsergebnis im Snapshot. A02 bearbeitet G8 nach T-0065; A03-Fachreview, A05/A09 Re-Review und A01 sichtbarer Browser-Smoke bleiben offen. T-0065 A09-Bericht `docs/simulation/a09-t0065-independent-review-2026-11-05.md` liegt vor; Ticket bleibt offen.

**T-0067-Review:** A09 fand G1–G4 PASS, G5 ohne Istbuchung/COGS-Claim im eingegrenzten Planumfang und G6 PARTIAL, bis T-0066 G8 sowie A01 Browser-Smoke bestehen. T-0067 bleibt offen. A09-Bericht wird nachgereicht; kein BAB-/Istkosten-/Buchungsvollständigkeitsclaim.

**Bericht:** `docs/test-reports/a09-t0067-independent-focused-review-2026-11-05.md` liegt vor (SHA-256 `0440CA4E68A2214A160812911204A06D36E5A59B3968CC315F856C8F1BDC9C92`). Gate 5 PASS gilt nur für den nichtbuchenden Planpfad mit fehlenden Istquellen `pending`; Gate 6 bleibt PARTIAL. T-0067 ist nicht abgeschlossen.

**T-0065 A09-Re-Review:** G3/G4/G5/G9 PASS für den geprüften Engine-Scope und die drei Tracehashes stimmen. G6 NONPASS: Preis-/Ruf-/Fit-Paare variieren zusätzlich ihre Seeds; nur Kapazität hat gleiche Seeds. A02 korrigiert diese drei Paare und lässt danach erneut unabhängig prüfen. UI-/A03-/Browser-Gates bleiben offen.

**Korrektur eingereicht:** A02 hat Preis-/Ruf-/Fit-Paare auf denselben Seed und identische übrige Fixtures umgestellt; nur die Zielgröße variiert. Market Regression PASS; Tracehashes unverändert. A09-Re-Review läuft. G6 bleibt bis zum A09-PASS offen.

**A09-Re-Review abgeschlossen:** G6 PASS für vier synthetische Engine-Paare mit gleichen Seeds (Preis, Reputation, Segment-Fit, Kapazität); G3/G4/G5/G9 PASS im geprüften Scope, Tracehashes identisch zum A02-Bericht. T-0065 bleibt offen wegen A05 UI-Manipulationsversuch/Browserpfad, A03 DB-I-Fachreview und A01 sichtbarem Integrations-Smoke.

**Fortschreibung T-0066 G8 (2026-11-05):** A02 ergänzte quellgebundene Direktkostenzeilen und strukturierte mobile UI-Eingabe. A09s erster UI-Review fand NONPASS, weil eine leere Kostenliste als Nullkostenkalkulation akzeptiert wurde und die Live-Cent-Vorschau als gespeichertes Ergebnis beschriftet war. A02 schloss beides: leere/unausgefüllte Listen und 0,00 € werden fail-closed abgewiesen; die Anzeige heißt „Cent-Übertrag (Vorschau)“. A09 bestätigte den Korrekturslice PASS. Lifecycle-, Orchestrator- und A05-UI-Regressionen bestehen. Kein direkter Kostenwert wird als Istwert oder externe Quelle ausgegeben; `synthetic:` bleibt als unbestätigte Testannahme kenntlich. G8 und T-0066 bleiben offen bis A03-Finanzreview und sichtbarer Browser-Smoke. Der T-0076-Snapshotlauf ist wegen EPERM am Fixture-Schreibschritt kein PASS; Datei blieb unverändert.

**T-0084 Rechte-/Quellenbereinigung (2026-11-05):** Vorhandene nicht-verbatim Analyse ist nutzbar als begrenzte historische Antworttiefen-/Themenanalyse, aber weder vollständig noch eine Projektlizenz. A01 bestätigte per Manifest-/Pfadabgleich 129/129 Dateien als `NO_PROJECT_REUSE_LICENSE_PROVIDED` / `DO_NOT_USE_IN_PRODUCT` und entfernte ausschließlich `docs/qa/HQ` (62 Dateien) sowie `docs/qa/WQ` (67 Dateien). Die Analyseberichte und Manifest v2 bleiben als historische Auditspur; Manifest v3 verzeichnet die Entfernung metadata-only. Keine Prüfungsinhalte wurden beim Bereinigungslauf geöffnet. T-0084 bleibt für Prüfungsinhaltsauswertung ohne Lizenz blockiert. Bericht: `docs/learning/a01-t0084-rights-based-source-purge-2026-11-05.md`.


**T-0075 G5-Fortschreibung (2026-11-05; CP-0501 Entwurf):** A01 führte den neuen synthetischen 12-Monats-Shared-Run mit monatlichem Kundenauftrag und Eigenprodukt, Kapazitätskonflikt sowie Midyear-JSON-Restore/Resume aus; Enginebeleg PASS. A09 unabhängiger Review und Jahresreconciliation offen. Keine Finanzbuchung oder BAB abgeleitet; T-0077/T-0067 bleiben offen. Bericht: `docs/simulation/a01-t0075-annual-order-product-flow-review-2026-11-05.md`.


**A01-Regressionsnachtrag (2026-11-05; CP-0501 Entwurf):** Die aktuelle Market-, Produktlebenszyklus-, FIFO-Kosten-, Shared-Run-/Orchestrator-, T-0066-UI- und T-0067-UI-Suite bestehen. Falscher initialer Dateipfad für T-0067 wurde korrigiert; korrektes `prototype/v3/a05-t0067-regressions.mjs` PASS. Diese automatisierten Suiten schließen die noch offenen unabhängigen Reviews oder Browsergates nicht.


**T-0065 Preisfreeze-UI-Fortschreibung (2026-11-05; CP-0501 Entwurf):** A01 ergänzte eine Regression, die die angenommene Anfrage isoliert und fixierten Vertragspreis sowie fehlendes Angebotsformular, `netPrice`-Feld und Submit-Knopf prüft. T-0065-UI-Regression und scoped `git diff --check` PASS. A09-Re-Review und sichtbarer Browser-Smoke bleiben offen; kein Ticketabschluss.


**T-0084 Autorisierungsfortschreibung (2026-11-05; D-0172; CP-0501 Entwurf):** Nutzer autorisiert die Verwendung vorhandener, nicht wortgetreuer extrahierter Analyseergebnisse. A01 erstellt [die Synthese](../learning/a01-t0084-extracted-results-synthesis-2026-11-05.md) und eine mobile Kurzfassung; A06 prüft Themen-/Kompetenzlandkarte, A08 den engen Autorisierungsumfang und A09 Abstraktion/Claimgrenzen. Die Originale werden nicht wiederhergestellt oder erneut ausgewertet; itemgenaue Coverage und Korpus-Häufigkeiten werden nicht behauptet. Abschluss wartet auf diese Reviews und die A10-Prüfung des iPhone/iPad-Pakets.

Fortschreibung CP-0509 (2026-11-06): T-0065 bleibt IN_PROGRESS: Markt-/Finanz-/Replay-/UI-Regressionen bestehen, aber der DB-I-Satz +1/0/−1 Cent fehlt im vollständigen Angebots-/Zuschlags-/Annahmefluss; A03 bestätigte nur +4.000/−2.000 Cent dort. A05- und A09-Agenten konnten den benannten HEAD nicht aus ihren Projektspiegeln prüfen. T-0066: A03-Fachreview bestätigt G8 PASS im Plan-/Snapshotumfang; A05-Regressionen und sichtbarer Produkt-Browser-Smoke bestehen. A09 unabhängiger HEAD-Re-Review von G10 fehlt. T-0067: gezielte UI/Finanzregressionen und sichtbarer dynamischer BAB-Smoke bestehen; A03-Abhängigkeit ist erfüllt, G6 bleibt bis A09-Re-Review PARTIAL. CP-0509 enthält Belege und offene Adressaten.
Fortschreibung CP-0510 (2026-11-06): T-0065-Vektorgate ergänzt: +1, 0 und −1 Cent laufen durch A03-Kalkulation, Angebotsabgabe, Kundenzuschlag und Annahmesnapshot; signed DB-I und dbICentNear werden geprüft. Der existierende Post-Award-Preis-Tamper schlägt am immutable-submission-validator fehl. A03-Fachreview PASS. A05 ergänzt die read-only Fixpreis-Anzeige im integrierten Lauf samt UI-Regressions; der sichtbare Smoke bestätigte 90,00 € netto am angenommenen Auftrag, ohne Angebotsformular. run.html wurde über den Modulgraph-Cachegenerator an run.js gebunden. A09 konnte den HEAD aus dem Spiegel nicht unabhängig prüfen; T-0065 bleibt bis zur unabhängigen QA offen. T-0066 A03 G8 PASS und A01 Browser-Smoke bestätigt; A09 G10-Review offen. T-0067-Rechen-/BAB-UI-Smoke besteht; A03-Abhängigkeit erfüllt, G6 wartet auf A09-Re-Review. Einzelbelege und Laufgrenzen stehen in CP-0510.
**Abschlussfortschreibung CP-0511 (2026-11-07):** T-0065, T-0066 und T-0067 erfüllen ihre Minimalgates im jeweils dokumentierten Umfang. A03-Fachreview: T-0065 +1/0/−1-Cent-Angebotsfluss PASS; T-0066 G8 und G10-Finanzgrenze PASS; T-0067 BAB-/Finanzabgrenzung PASS. A05-UI-/Cache-/Regressionreview PASS; T-0066 ohne eigenen schmalen Viewport-Test in dieser Reviewrunde. A09 unabhängiger HEAD-Review: T-0065 zehn Gates PASS, T-0066 G10 PASS, T-0067 G6 PASS. A01-Browserbelege stehen in CP-0510. Keine Istkosten-/COGS-/Postingbehauptung. T-0069 bleibt offen und enthält die Jahres-/Finanzintegration; T-0063 offer-sensitivity Altregression bleibt außerhalb dieser Ticketabschlüsse zur T-0063-Triage.
**Fortschreibung CP-0512 (2026-11-07):** A01 führte `node prototype/v3-t0075-annual-order-product-flow-smoke.mjs` aus. Der Lauf umfasst 04.01.–31.12.2027 und 12 Monatsperioden, zwölf angenommene nichtbuchende Kundenaufträge, sechs angenommene und versandte Eigenproduktangebote, wiederholte Ablehnungen, Ressourcenkonflikt, Midyear-JSON-Restore/Resume, Tamperprüfung und stabilen Statehash `9cf22a5dd33b9025f83a215ca645bc898b5ea4591814cc298b91b507b4316c7f`. Erfolg ist ein Engine-/Szenariolauf, noch kein A03-Finanzabgleich oder A09 unabhängiger PASS; G5/T-0075 bleibt IN_PROGRESS bis diese Reviews vorliegen. T-0077-Finance-Ledger-Projektionsregression PASS im bestehenden Kunden-Subledger-Scope; laut A03-Gap-Bericht fehlen AP, Payroll, Steuerabführung, Bank-/Eigenzahlungen, Finanzierung/Dispo, monetäre Bestands-/COGS-Bewertung und ein vollständiger freigegebener Ledgervertrag; T-0077 bleibt offen. T-0109-Fokusregression PASS, aber Browserantwortklick/LocalStorage/Reload wurde nicht belegt. Ein lokaler HTTP-Server ließ sich aus der Testumgebung nicht mit dem In-App-Browser verbinden; der Versuch wurde beendet, kein Nutzerspielstand geändert.
**Fortschreibung CP-0513 (2026-11-07):** A09 führte den T-0075 Jahres-Harness unabhängig aus und bestätigte G5 operativ PASS; A03 bestätigte getrennt die Nichtbuchungs-/Financegrenze PASS. Das 12-Monats-Ergebnis bleibt ohne Cash-/Ledger-/Istkostenclaim. T-0075 COMPLETED; T-0069 bleibt wegen G3/G7/G10 offen. A05 re-reviewed T-0109 UI/Handler read-only: Code speichert Antworten je runId/inquiryId in localStorage und rendert gespeichertes Feedback erneut; Regression PASS. Kein echter Klick-/Reloadbeleg, da Windows Browserautomation die aktuelle Edge-URL nicht sicher bestimmen konnte. T-0109/T-0110 bleiben offen. A01 ergänzte den eigenständigen T-0109-Laufbericht und T-0110 Hash-/Commandanhang; A04 und A10 Reviews ausstehend.

**Fortschreibung CP-0514 (2026-11-07):** T-0109 Browserklick-/Reloadlücke ist durch isolierten Testlauf mit richtiger und falscher Antwort geschlossen; die Antworten und getrennten Feedbacks erschienen nach Reload im reproduzierten Run erneut. T-0109 bleibt bis A09 unabhängiger Review IN_PROGRESS. T-0111 erhielt eine sichtbare, ausdrücklich nichtrechtliche Spielkompetenz-Weiterbildung; gezielte UI-/Lifecycle-Regressionen und Browser-Smoke PASS, aber Erwerbskette und Rollenreviews offen. T-0110 erhielt die neue T-0109-Evidenzverknüpfung; A04/A10 aktuelle Reviews offen. T-0069 G3/G7/G10, T-0112 sowie externer T-0113-Blocker unverändert offen. Details und Testgrenzen: [CP-0514](checkpoints/CP-0514.md) und [Browser-/Weiterbildungsbericht](a01-t0109-browser-and-t0111-training-smoke-cp0514.md). Kein Commit/Push.


**Review-Nachtrag CP-0514 (2026-11-07):** A04 T-0110 Re-Review PASS. A02 T-0111-Re-Review PASS nach Korrektur von zwei Restorelücken; Legacy-Save-Kompatibilität bleibt ungeprüft. A10 hatte wegen fehlender Bytebindung des tatsächlichen Browser-Smokes zunächst NONPASS; CP-0514-Bericht bindet nun Vorfix-Browserbytes und aktuellen Postfix-Code getrennt. A10-Finalreview steht aus. Alte T-0069-UI-Assertions zu technischer RateBasis-Darstellung wurden an die Management-Level-Eingabe angepasst; beide UI-Einstiegstests bestehen. Der korrigierte Build wurde mangels CUA-Verfügbarkeit nicht erneut im Browser getestet. Kein Pages-Upload, da weitere Umsetzungs-/QA-Gates offen sind.


**Reviewabschluss CP-0514 (2026-11-07):** A02 T-0111 Restore-Re-Review PASS; A04 und A10 T-0110 Reviews PASS im jeweiligen Scope. A09 ist nicht verfügbar, deshalb bleiben unabhängige Endabnahmen für T-0109/T-0111 und weitere Gates offen. Nach Restorefix bestand der T-0075 12-Monatslauf erneut (12 Monate; 12 Kundenaufträge; sechs Produktdispatches; Midyear restore/tamper PASS; Hash 6464fb7f64ace835e3bb50012702d31e6174ba96187ec860cb9cd30146de4f13), ohne Finanzreconciliation. T-0069 G3/G7/G10 offen. T-0112 Terms regression PASS, weitere Implementierung/Fachreviews offen. Pages Upload nicht ausgeführt, da nicht nur Nutzertest aussteht und die Pages-Repoeinstellung fehlt.

**Fortschreibung CP-0515 (2026-11-07):** Die Nutzerentscheidung stellt Kompatibilität alter Spielstände ausdrücklich bis zu einem später separat beauftragten Ziel zurück; sie ist kein aktuelles V3-Abnahmegate. T-0112 hat keinen technischen JSON-Plan-Fallback mehr für historische Aufträge ohne gespeicherte Vertragsbedingungen: die UI erklärt dort den fehlenden Umfang und verweist für neue Aufträge auf den geführten Angebotsweg. Die Lieferkarte zeigt interne `pieces` als „Stück“, Runtime-Werte bleiben kanonisch. T-0112-Terms-Regression, beide T-0069-UI-Suiten, A09-Adversarial-UI-Regression und Modulgraphcache bestehen; Syntax- und `git diff --check`-Prüfung bestehen (nur Zeilenendenhinweise). T-0069 G3/G7/G10, T-0109 A09-Endreview, T-0111 Erwerbskette/Reviews, T-0112 Angebotsrevision/Gegenangebot/Teamprognose/Fachreviews und T-0113 Pages-Einstellung/Deploy bleiben offen. Kein Browser-Smoke des korrigierten Builds wegen nicht verfügbarer CUA, kein Commit/Push/Pages-Upload. Siehe [CP-0515](checkpoints/CP-0515.md).

## CP-0526 / T-0077 Restore-Quellbindung und T-0069 Jahres-Smokes (2026-11-07)

Nach A09s unabhängiger NONPASS-Feststellung wurde der Save/Restore-Pfad für Lieferanten-AP erweitert: gespeicherte AP-OPs müssen gegen die validierte A02-Rechnungsevidence im Run stimmen; Zahlungsevents müssen OP und Bank centgenau vollständig ausgleichen und das kanonische D-0174-Referenzformat erfüllen. Eine gemeinsame Manipulation von Finance-Rechnungs-/Zahlungsbeträgen mit neu berechneten lokalen Fingerprints wird bei unveränderter A02-Quelle zurückgewiesen. Das ist lokale Quellkonsistenz, keine kryptografische Save-Datei-Authentifizierung.

Die veraltete Kunden-Ledgerregression wurde auf den aktuellen kommerziellen Vertragssnapshot samt D-0157 F3 aktualisiert und besteht wieder. T-0077-Finance- und Ledger-Projektionsregressionen bestehen. T-0075- und T-0076-Jahresläufe bestehen nach dem Restorefix mit 12 Perioden, melden aber weiterhin `pendingFinance=true` und belegen keine volle Finanzabstimmung.

T-0077/G7 sowie T-0069/G3, G7 und G10 bleiben IN_PROGRESS. A09-Postfix-Review im autoritativen Checkout, vollständige Finanzquellen/GL, wirtschaftliche Jahresabstimmung und aktueller Browser-/Mobilbeleg sind nicht abgeschlossen. Siehe [CP-0526](checkpoints/CP-0526.md). Kein Commit/Push/Deploy.


**Fortschreibung CP-0528 (2026-11-08):** A01 dokumentierte fünf getrennte, ausdrücklich unfreigegebene Lösungsvorschläge für Payroll, Steuerabführung, Kredit/Dispo, monetäre Bestandsbewertung/COGS und Hauptbuch/Jahresabgleich. D-0174 bleibt begrenzend; D-0123–0129 werden nicht stillschweigend nach V3 portiert. Startausstattung/Kapitalquelle, Rechtsstandsprofil, Payrollwerte und genehmigte Kostenpoolzuordnung sind offen. Keine Runtime-, Schema- oder Buchungsänderung. T-0077/G7 und T-0069 bleiben IN_PROGRESS bis Nutzerentscheidung, A03-Fachvertrag, Umsetzung und A09-Reconciliationreview. Details: CP-0528 und a01-t0077-getrennte-finanzloesungen-vorschlag.md.

**Fortschreibung CP-0534 (2026-11-08):** Die Finanzübersicht zeigt unter dem Bankbestand den aus D-0180/D-0177 abgeleiteten Start-Disporahmen von 1.000,00 € als ungezogenes Limit, ausdrücklich kein Guthaben. Keine Ziehung/Verzinsung/Quartalsneuberechnung implementiert; T-0119, T-0077/G7 und T-0069/G3 bleiben offen. Hashbindung run.html→run.js geprüft; Regressionen, unabhängige Reviews und Browser-/Mobil-Smoke nicht ausgeführt. Kein Commit/Push.


**Fortschreibung CP-0535 (2026-11-08):** A01 erstellte ein amtliches/quellengebundenes 2027-Payroll-Mapping. Mindestlohn 14,60 €/h und durchschnittlicher GKV-Zusatzbeitrag 2,9 % sind amtlich; SV-Rechengrößen bleiben bis Bundesratszustimmung/Verkündung vorläufig. EStG §41a und SGB IV §23 erhalten getrennte Fälligkeiten. Personal-/ELStAM-/Versicherungsquellen fehlen; Payroll bleibt PENDING. Keine Runtimeänderung. A08-/A03-/A09-Review ausstehend. Siehe CP-0535.

**Fortschreibung CP-0555 (2026-11-09):** T-0114-Unterweisungs- und Save/Restore-Regressionen PASS; Geräte-/Mobil-Smoke bleibt wegen lokal nicht erreichbarem In-App-Browser offen. T-0069/T-0075 aktueller 12-Monatslauf PASS nach Einbindung der D-0183-Unterweisung und Fix des kanonischen Workorder-Plan-Fingerprints; 12 Perioden, 12 Kundenaufträge, 6 Eigenproduktversände, Restore/Tamper PASS. `pendingFinance=true`; keine Jahresfinanzreconciliation. T-0074/G3, T-0077/G7 und T-0080/G10 bleiben offen. A03-Fachreview und A09 unabhängige QA des neuen Laufs stehen aus. D-0178 vertagt COGS bis BAB/Kostenpools; deswegen ist das bestehende vollständige T-0069-G7-Minimalgate ohne neue Gateentscheidung nicht erreichbar. Siehe [CP-0555](checkpoints/CP-0555.md) und [A01-Bericht](a01-t0114-t0069-progress-cp0555.md). Kein Commit/Push.

**Fortschreibung D-0186 (2026-11-09):** Der Nutzer bestätigt die Begrenzung des T-0069-V3-Mindestgates auf tatsächlich implementierte und im Jahreslauf ausgelöste Finanzflüsse. Diese sind vollständig und perioden-/centgenau abzustimmen; alles nicht implementierte oder durch Entscheidung vertagte bleibt ausdrücklich PENDING. D-0178 COGS/WIP/Fertigwarenbewertung bleiben aus dem V3-Gate. Ein PASS ist kein vollständiger Jahresabschluss oder Solvenzbeleg. A03 muss den konkreten Finanzumfang fachlich bestimmen; A09 unabhängig prüfen. Zusätzlich ist die bestehende QA-Matrix wegen abweichender G3/G7-Benennungen gegen die aktuelle Unterticketzuordnung T-0074/G3, T-0077/G7 abzugleichen. T-0069 bleibt bis zu diesen Reviews und Gatebelegen IN_PROGRESS.

**Fortschreibung CP-0556 (2026-11-09):** T-0114 Minimalziel 10/10 und COMPLETED nach responsive-mobile In-App-Smoke (Start, Tagesöffnung, Erstunterweisung planen/abschließen, aktives Gate bis 04.01.2028, JSON-Sicherung, schmale Reiternavigation); Engine/UI-, JSON-Restore-Regression und Reviews aus CP-0548 bleiben PASS. Kein physisches iPhone/iPad getestet. T-0069 bleibt IN_PROGRESS: D-0186 ist APPROVED; A03/A09 bestätigen, dass der 12M-Smoke trotz Operations-/Restore-PASS `pendingFinance=true` bleibt und weder FinanceState noch Finanzereignisse/Abgleich enthält. T-0074/G3 und T-0077/G7 sind weiterhin NONPASS/keine 10/10; außerdem ist die ältere QA-Vorbereitungsmatrix mit der aktuellen Gatezuordnung unvereinbar. Details CP-0556.


## CP-0561 / T-0069 Browserpfad und G3 (2026-11-09; Entwurf)

Der Nutzer wählte Option 1: G3-Wirtschaftlichkeitsprüfung bleibt bestehen; konkrete synthetische Kostenannahmen sind nicht freigegeben. T-0114 bleibt COMPLETED 10/10. Der manuelle Small-Auftrag zeigte im Browser den Pfad von Anfrage/Angebot über Vertrag, Erstunterweisung, Arbeitsgang, Lieferung, Abnahme, Rechnung bis Zahlung; 110,00 € netto, 20,90 € SimTAX und 130,90 € Eingang ergaben Bank 10.130,90 € bei 10.000,00 € Startbank und 0,00 € Forderung. Das ist kein Jahres-/Hauptbuchnachweis. T-0077/G7 PASS gilt weiterhin nur innerhalb D-0186. T-0074/G3 NONPASS mangels freigegebenem Kosten-/Ergebnisfluss. T-0080/G10 unvollständig: UI-Regression an einem veralteten Plan-Fixture ohne T-0114-Unterweisungsnachweis, geforderte exakte Viewports und integrierter Jahrespfad fehlen. CP-0561 enthält den Nachweis und Grenzen. Kein Commit/Push.
**Fortschreibung CP-0468 (2026-11-01):** Nutzer hat A03s FIFO-Empfehlung bestätigt; D-0170 dokumentiert die V3-Spielregel. FIFO-Kostenlayer, Versand-COGS, Run-Adapter, Belegformular und Regressionen sind umgesetzt. Produkt-/FIFO-/Shared-Run-/UI-/FinanceRuntime-Suiten und scoped `diff --check` PASS; lokaler Run-HTML-Pfad liefert HTTP 200. G1–G9 PASS; G10 bleibt NONPASS, bis Kostenquellen technisch an Betriebsdaten gebunden und A03/A09 re-reviewed sind. Kein visueller Browser-Smoke (CUA `browser.user is unavailable`). T-0066 bleibt IN_PROGRESS bei 9/10. Siehe [CP-0468](checkpoints/CP-0468.md) und [Reviewbericht](a01-t0066-implementation-review-cp0468.md). Kein Commit/Push.
**Fortschreibung CP-0467 (2026-11-01):** T-0066-Minimalziel wurde nach A09-Review in zehn binäre Gates präzisiert und als Zieltext insgesamt PASS reviewed. A03 hält Gate 10 wegen fehlender freigegebener Bestandsbewertung/COGS weiter NONPASS; kein Wert wurde ergänzt. A02-Review war im alten Projektspiegel nicht ausführbar und gilt nicht als PASS. T-0066 bleibt IN_PROGRESS bis die Gates an Implementierung und Reviews bestanden sind. Details: [CP-0467](checkpoints/CP-0467.md); Ziel: [T-0066/0067-Mindestziele](a01-t0066-t0067-mindestziele.md).**Fortschreibung CP-0465 (2026-11-01):** A03 und A09 bestätigen `simulated_actual`-Zeitbeleg PASS; Minuten/Source/Assignment/Datum/Periode und Event-/Restore-Bindung, keine Kostenwirkung. A05 zeigt Dauer nach Abschluss sichtbar mit Modellierungslabel, Quelle, Datum/Periode und Kosten pending; Planzeit bleibt getrennt; ineligible/incomplete zeigt keine Dauer. A05 meldet beide UI-Suiten, Syntax und diff-check PASS. Finaler A09 UI-Re-Review ausstehend; kein visueller Browser-Tab verfügbar.

**Fortschreibung CP-0502 (2026-11-05):** T-0111 erfasst nutzerfreundliche Angebots-/Produkt-Eingaben und die Berufs-/Produktvoraussetzungen. Angebots-JSON/Standkennungen werden aus sichtbarer Nettoeingabe und synthetischem Profil erzeugt; Produktarchetypen setzen Marktprofil/Rezeptur und sperren fehlende Fähigkeiten, Geräte oder Zusatznachweise. Zehn repräsentative Metallberufsprofile und Startpfade Geselle+Wirtschaftsfachwirt bzw. Meister sind in Code/Dokumentation angelegt. V6/V10-Zielkarte ergänzt. Folgegate bleibt offen: Erwerbsprozess für weitere Skills/Lizenzen/Geräte, unabhängige Reviews und Browser-Smoke. Siehe CP-0502.
**Fortschreibung CP-0464 (2026-11-01):** A02 ergänzt `simulated_actual`-Zeitbelege auf abgeschlossenen Produktblöcken: Assignment-Quelle, Minuten, Datum/Periode, Modellbasis/Label; Restore gleicht Beleg mit Completion-Event und abgeschlossener Dauer ab. Incomplete/cancelled darf keinen Zeitbeleg haben. `costEvidence` bleibt pending; keine Finanzwirkung. Gezielt Produkt- und Runregressionen, Syntax und diff-check PASS. A03/A09 Review und A05 sichtbare Anzeige im UI ausstehend.

**Fortschreibung CP-0463 (2026-11-01):** A09 bewertet T-0066 insgesamt NONPASS ausschließlich wegen fehlender tatsächlicher Zeitbelege je Produktoperation; übrige Ressourcen-, DB-I-, Dispatch-, Lager-, Replay- und UI-Kriterien bestehen. A01 setzt als Simulationsregel: Abschluss eines Arbeitsschritts schreibt die verbrauchte simulierte Blockdauer in Minuten mit Assignment-/Source-ID, Datum/Periode und Kennzeichnung `simulated_actual`; keine reale Messbehauptung, keine Kostenrate/COGS. A02 implementiert Evidence + Regression; A03 prüft Finanzabgrenzung; A05 zeigt Simulationszeit im UI; A09 re-reviewt.

**Fortschreibung CP-0462 (2026-11-01):** A02 ergänzte in der Mixed-Run-Regression explizite DB-I-Vorzeichen: `mixed-positive` > 0 und `mixed-negative` < 0 am eingefrorenen Angebotssnapshot. Gemeinsame Person/Maschine/Material/Lagergrenzen, Dispatch und keine zusätzlichen Finance-Handoffs/Ledger sind ebenfalls belegt. Syntax, Orchestratorregression und diff-check PASS. A03/A09 Abschlussreview ausstehend; T-0066 bleibt bis zu deren PASS IN_PROGRESS. T-0069 Jahresgate weiterhin offen.

**Fortschreibung CP-0461 (2026-11-01):** A09 bestätigt die A05-UI-Fixes PASS; Annahme sagt reserviert, Flächenumrechnung ist Pflichtfeld und im Snapshot. Beide UI-Regressionen PASS. A03/A09-Kernreview bleibt PASS für Lagerroll-forward/Dispatch/No-posting. A01-Finalkriterienprüfung: T-0066-Test bezeichnet Produkte `mixed-positive`/`mixed-negative` und setzt Preis/Kosten, asserts aber DB-I-Vorzeichen nicht direkt; ein expliziter wirtschaftlicher PASS/Verlustbeleg fehlt. A02 soll DB-I >0/<0 im Mixed-Run assertieren. Visueller Browserbeleg bleibt nicht verfügbar. T-0066 noch IN_PROGRESS.

**Fortschreibung CP-0460 (2026-11-01):** A05 korrigierte die Annahmemeldung („reserviert; Bestand bis Versand im Lager“) und das verpflichtende `storageUnitsPerOrderUnit`-Feld; `planRunOrder` übergibt es in den Vertragssnapshot. Kunden-UI-Fixture nutzt regulären Plan-/Completionpfad und prüft Lagerbelegung. A05 Produkt- und T-0069-UI-Regressionen, Syntax, diff-check PASS. A09 finaler Read-only Re-Review der zwei UI-Korrekturen ausstehend; visueller Browserbeleg weiterhin offen. T-0066 nach Code-/Finanz-/Regressionstests nahezu erfüllt, aber UI-Review offen. T-0069 Volljahresgate NONPASS.

**Fortschreibung CP-0459 (2026-11-01):** A03 bestätigt Reservierung/Dispatch/No-Posting-Pfade PASS. A09 bestätigt gemeinsames Lager, Multi-offer, Roll-forward, Overflow, paired-tamper und 52-Wochen-Gate PASS. NONPASS: Klickmeldung nach Käuferannahme behauptet weiter „Fertigwaren wurden ausgebucht“ (run.js:923), obwohl nur Reservierung erfolgt; `a05-t0069-run-ui-regressions.mjs` scheitert zusätzlich an ungültigem `storageUnitsPerOrderUnit`-Fixture. A05 korrigiert beide Texte/Fixture und ergänzt Handler-Assertion; danach A09 final re-run. T-0066 bleibt offen.

**Fortschreibung CP-0458 (2026-11-01):** A02 hat same-product reservations korrigiert: zwei offene Angebote je 2 bei 4 verfügbar werden angenommen, Bestand bleibt physisch 4 bis zu zwei separaten Dispatches; Überzeichnung fail-closed. A05 ergänzte Dispatch-Button, accepted/reserved/not-shipped Status, verfügbare/reservierte/physische Bestände sowie korrekte Copy und UI-Regression. Tests PASS. A05 konnte keinen Browser-Tab öffnen; visueller Browserreview für neue UI fehlt. Finaler A03/A09-Crossreview nach A02/A05 nötig. T-0066 noch IN_PROGRESS.

**Fortschreibung CP-0457 (2026-11-01):** A09 bestätigt T-0066-Lager-Roll-forward, Overflow no-mutation, paired-tamper rejection, eigenständigen Dispatch, 52-Wochen-Gate und 30/90-Tage-Harness PASS. A03 bestätigt No-Posting-/Finanzgrenze, findet aber zwei Angebote derselben Produkt-ID: zweite Annahme wird wegen doppelt gezählter Reservierung abgewiesen. Zusätzlich fehlt in `run.js` eine Versandaktion und die Anzeige sagt fälschlich, Annahme buche den Lagerabgang. T-0066 bleibt offen. A02 Mengenfix/Regression; A05 Dispatch-UI/Textfix. Danach A03/A09 final re-review.

**Fortschreibung CP-0456 (2026-11-01):** A02 hat A09s drei Findings umgesetzt: Rücklauf-Overflow und paired Movement+Source-Tampering werden fail-closed/no-mutation geprüft; Roll-forward rekonstruiert Opening + alle Goods-Movements bis `finishedGoodsUsed`; Full-Year-Gate assertiert 52 Marktwochen. Eigenproduktannahme reserviert, separater Dispatch bucht physischen Abgang. Lifecycle-/Orchestrator-Regressionen, Syntax und diff-check PASS. A03/A09-Crossreview ausstehend, daher T-0066 noch nicht geschlossen. T-0069 weiterhin ohne 362-Tage-PASS.

**Fortschreibung CP-0455 (2026-11-01):** A03 bewertet Finanz-/Periodenfluss des T-0066-Lagerslices PASS; keine Geld-/COGS-/Ledgerwirkung, Zeit/Kosten pending. A09 findet verbleibende NONPASS: Rücklauf-Overflow fehlt als fail-closed/no-mutation Test; paired tampering von Movement + Source-Event könnte Roll-forward-Reconciliation umgehen; unbenutzte 52-Wochen-Konstante. A02 soll diese drei konkreten Punkte beheben, danach A03/A09 erneut reviewen. T-0066 bleibt IN_PROGRESS; T-0069 Jahresgate NONPASS.

**Fortschreibung CP-0454 (2026-11-01):** A02 hat Kundenfertigware ins gemeinsame Lager integriert: Einlagerung/Reservierung bei Arbeitsabschluss, idempotenter Abgang bei Versand, Freigabe bei Vorversandstorno, nach Versand nur separate Retourenbewegung mit Quarantäne. Menge/Datum/Periode/Order/Lot/Delivery/Source/Capacity werden validiert; keine Finanzbuchungen, Zeit/Kosten pending. Produkt-, Orchestrator- und Financial-Regressions, Syntax und diff-check PASS. A03/A09-Crossreview ausstehend. T-0069-Fensterchecks bestehen, Jahres-Smoke NONPASS; A09s offene 52-Wochen-Konstante bleibt noch zu bereinigen/verifizieren. Kein Commit/Push.

**Fortschreibung CP-0453 (2026-11-01):** A09 hat den T-0069-Harness unabhängig geprüft: Import/CLI-Grenze, State-Hash, Tages-/Event-/Monatsassertions und vollständige Validator-Ausführung PASS. Wiederholte 30/90-Tagefenster: 1.598 ms und 10.580 ms; gleiche State-Hashes wie CP-0452, Timingstreuung plausibel. A09 korrigierte die Aufrufzählung auf 122/362 Validierungen (inklusive Init und finaler Assert); CP-0452 wurde berichtigt. Event-Hash ist nicht separat, aber `stateHash` umfasst den Event-State. Unbenutzte 52-Montage-Konstante prüfen/entfernen oder verwenden; danach weiter T-0066-Slice A02. Kein Jahres-PASS, kein Commit/Push.

**Fortschreibung CP-0452 (2026-11-01):** A02 hat T-0069-Microbenchmarkfiles ergänzt. 30 Tage: 1.881 ms / 118 Events / Hash `e3270472…`; 90 Tage: 13.130 ms / 351 Events / Hash `7b5b3585…`. Validierungen bestanden; fensterspezifische Vorherwerte fehlen, daher kein Speedup behauptet. A09-Review der Benchmark-/Fixture-/Hashkorrektheit ausstehend. A02 bearbeitet danach T-0066 gemeinsame Lagerbelegung; Jahres-Smoke weiterhin NONPASS. Kein Commit/Push.

**Fortschreibung CP-0451 (2026-11-01):** A02 meldet für T-0069 eine erfolgreiche instrumentierte Baseline: 362 Tage, 1.409 Events, 204,557 ms, unveränderter State-Hash `d1205dd1…6726a6`; 1.448 Tages-Vollvalidierungen. Teuerste Validatorsegmente: `macroHistory` ca. 70,9 s, `macroDemandBindings` ca. 37,0 s (überlappende Zeiten). Der optimierte Jahreslauf endete nicht innerhalb des 95-s-Messfensters und wurde kontrolliert abgebrochen; kein Speedup/Jahres-PASS. Syntax-, Orchestrator- und Makroregressionen bestanden. Nächster Schritt: begrenzter Microbenchmark/Profiling dieser Validatoren, erst danach erneutes Jahresgate. A02 hat T-0066 noch nicht begonnen. Kein Commit/Push.

**Fortschreibung CP-0450 (2026-11-01):** A03 bestätigte: Istzeit und Istkosten bleiben korrekt `pending`; es gibt nur Planstunden/Abschlussdatum, keine gemessene Dauer oder anwendbare Operationskostenrate. Physischer Materialverbrauch ist kein COGS. Kundenfertigwarenvertrag benötigt stabile Bewegungs-/Quell-IDs, Datum/Periode, Menge/Einheit, Lagerort, Reservierungs- und Vor/Nachbestand. A02 muss Reservierungs-, Versandabgangs- und Ablehnungs-/Rückbewegungsphasen festlegen; keine Bewertungs- oder Postingregel ableiten. A02s T-0069-Baseline-Smoke läuft noch über 90 Sekunden ohne Abschlussausgabe. T-0063/65/66/67/69 IN_PROGRESS; kein Commit/Push.

**Fortschreibung CP-0449 / A09-Re-Review (2026-11-01):** A09 bestätigt Angebots-Snapshot/Replays und Produktlagerpfad; gemeinsame Kundenfertigwarenlagerbelegung sowie Istzeit-/Kostenbelege bleiben NONPASS. Bestehende Regressionen bestehen, aber A09 konnte keinen unabhängigen Browser-Tab steuern; CP-0448s A01-Browserbeleg bleibt separat. A01 weist nach Abschluss des laufenden T-0069-Pakets A02 die gemeinsame Lagerbelegung plus Istzeit-Evidence zu und A03 die Kosten-/COGS-Provenienz. Danach A05-UI und A09-Browser-Re-Review. Kein Commit/Push.

**Fortschreibung CP-0449 (2026-11-01):** A03 re-reviewed T-0066/T-0067: Planproduktivität und Angebots-Snapshot/DB I sind innerhalb der Finanzgrenzen PASS; Istzeit und Istkosten bleiben mangels Belegen pending. T-0066 bleibt NONPASS, weil Kundenfertigware im Mixed-Run das gemeinsame Fertigwarenlager nicht belegt. A02 bearbeitet bereits die T-0069-Timing-/Validierungsinstrumentierung; A09 prüft unabhängig die T-0066/67-UI und Laufzeitpfade. Danach erhält A02 den Lagervertrag (Menge, Zeitraum, Reservierung, einmaliger Abgang); A09 re-reviewed. T-0063/65/66/67/69 bleiben IN_PROGRESS. Kein Commit/Push.



**CP-0562-Fortschreibung (2026-11-09):** Nutzer hat D-0187 bestätigt: 35 % variable Szenariokosten auf abgestimmten Netto-Umsatz, 1.200,00 € fixe Szenariokosten monatlich, 1.800,00 € monatliche Privatentnahme getrennt von Aufwand. Der T-0075-12M-Lauf besteht; das nichtbuchende Overlay zeigt 960,00 € Nettoerlös, −13.776,00 € synthetisches Betriebsergebnis und 21.600,00 € separate Privatentnahmen. Positiver kompletter Jahresfall sowie A03-/A09-Review fehlen, T-0074 bleibt IN_PROGRESS. A05 UI-Regression jetzt PASS. T-0069 bleibt IN_PROGRESS, G10-Viewports/Jahresbrowserbeleg offen. Siehe CP-0562 und docs/simulation/a01-t0074-d0187-synthetic-economic-scenario.md. Kein Commit/Push.

**CP-0562 Review-Nachtrag (2026-11-09):** A03 Fachreview PASS für D-0187-Formel, quellengebundenen Nettoerlös, Privatentnahme-Trennung und Nichtbuchungsgrenzen; A03 führte Szenario-, Jahres- und A05-Regressions selbst aus. A09 unabhängige QA/Re-Review PASS für Test-/Grenzlogik, einschließlich Break-even 0 ct und Safe-Integer-Summen. D-0187 benennt break_even nun ausdrücklich. A09 führte den Jahreslauf nach dieser kleinen Korrektur nicht erneut aus; A01 wiederholt ihn vor Abschluss. T-0074 bleibt IN_PROGRESS bis positiver vollständiger Jahresfall und erneuter A09-Jahresprüfung vorliegen.

**A09-Jahreslauf-Re-Review CP-0562 (2026-11-09):** PASS nach der letzten Korrektur. Der T-0075-Lauf enthält 12/12 Monate; 96.000 ct Nettoerlös, 33.600 ct variable Szenariokosten, 1.440.000 ct fixe Szenariokosten, −1.377.600 ct Betriebsergebnis und 2.160.000 ct getrennte Privatentnahmen stimmen. `pendingFinance=true`. T-0074 bleibt offen, weil nur ein negativer vollständiger Jahresfall vorliegt; positiver Jahresvergleich fehlt.

**CP-0562-Fortschreibung – Positivjahreslauf (2026-11-09):** Separater T-0074-Harness für die bestätigte Annahme 60 Aufträge/Monat × 80,00 € angelegt. Januar–Juni bestehen je mit 60 Aufträgen und 480.000 ct Quellenumsatz; kumuliert 2.880.000 ct Erlös, 1.152.000 ct synthetisches Betriebsergebnis und 72.000 ct nach separater Entnahme. Der Lauf wurde im Juli nach rund 32 Minuten und etwa 3,7 GB Spitzen-RAM ohne Jahresabschluss kontrolliert beendet; daher kein positiver 12M-PASS. Markt-/Run-Validatoren wurden indexiert; Markt-, Run-, D-0187-, A05- und negative T-0075-Regressionen bestehen. T-0074 und T-0069 bleiben IN_PROGRESS; nächste Arbeit ist Profiling weiterer Hotspots, dann vollständiger Positivlauf und A03/A09 Review. Kein Commit/Push.

## Fortschreibung CP-0563 (2026-11-09)

Der positive T-0074-Harness erreichte Januar bis Dezember 2027; alle zwölf monatlichen 60-Auftrags-/480.000-ct-Umsatzreconciliations bestanden. Erst eine falsche Endassertion scheiterte: Sie erwartete genau zwölf eindeutige Zahlungseingänge, tatsächlich waren 692 Zahlungseingänge verarbeitet und spätere Dezemberforderungen offen. Die Eindeutigkeitsassertion wurde auf den Ist-Zähler bezogen. Der korrigierte 12M-Lauf wurde noch nicht wiederholt; T-0074 bleibt deshalb IN_PROGRESS und ein Jahresvektor-PASS ist noch nicht belegt. Syntax, Szenarioregression, Marktregression, Run-Orchestratorregression, A05-UI-Regression und scoped `git diff --check` PASS. Laufzeit mehrere Stunden CPU / bis etwa 7,5 GB Working Set. Keine Änderungen verworfen; kein Commit/Push. Siehe CP-0563.

**Fortschreibung CP-0564 (2026-11-09):** Ressourcenprüfung ergab einen wiederholten Vollvalidierungs-/Vollkopierpfad: viele Run-Aktionen klonen und validieren den vollständigen wachsenden Shared Run. Ein korrigierter Lauf bestand Jan–Aug (8/12), bei rund 3.733 Sekunden CPU-Zeit und 5,5 GB Working Set; danach wurde er für die Ressourcenprüfung kontrolliert beendet. Empfehlung: zunächst vollständige, semantisch identische Einmalindizes je Validator implementieren und mit 30-/90-Tageprofilen benchmarken; danach erst atomare Transaktionsvalidierung prüfen. Historische Belege dürfen nicht entfernt werden. Vollständiger Jahres-PASS steht aus. Details CP-0564.

**Fortschreibung CP-0565 (2026-11-09):** A01 indexierte weitere Historienabfragen in der Produktvalidierung (Unterweisung, Training, Assignment, Sale, Shipment, Bewegungsbelege); keine Vollvalidierung oder Belegliste entfernt. Markt-, Run-Orchestrator- und Szenario-Regressionen sowie der negative 12M-Lauf bestehen. Der positive Lauf mit Indizes besteht Jan–Jun, wurde danach als begrenzter Benchmark beendet. Höchster beobachteter CPU-Stand etwa 2.293 s, Working Set etwa 5,5 GB; kein gleichlanger Vorher/Nachher-Punkt, daher keine prozentuale Beschleunigung behauptet. Voller Positivjahreslauf und T-0074/T-0069 bleiben offen. CP-0565.

**CP-0565 Prüfhinweis:** Syntaxchecks PASS; der T-0078 Recovery-Smoke scheitert vor seinem Recoverypfad an einer fehlenden Anfrage im ersten Tagesfixture. Separater bekanntermaßen zu prüfender Fixture-Befund, nicht als PASS gezählt.

## Aktuelle Releasekorrekturen CP-0566 (10.11.2026)

- D-0188: erneuter 12-Monats-Smoke durch Nutzer erlassen (WAIVED, kein PASS). T-0069 bleibt bis übrige Gates/Entscheidung abgeschlossen sind in Releasevalidierung.
- T-0077: COMPLETED im begrenzten D-0186-Kunden-Finanzslice, siehe CP-0559 und aktuelle Gatezuordnung. Alte NONPASS-Zeilen mit Forderung vollständiger GL-/COGS-Abbildung sind historische Zwischenstände.
- T-0114: COMPLETED gemäß CP-0556; heutiger responsiver Browserlauf bestätigt Unterweisungsgate und Auftragsfluss.
- T-0080: integrierter Browsermonat am 10.11. durch A01 bei 390×844 und 768×1024 von Angebot bis Zahlung bestätigt; unabhängiger Abschlussreview folgt.
- T-0128 – V3-10 Unternehmensausrichtung/Kennzahlen: IN_PROGRESS, A05 implementiert drei Ausrichtungen mit je zwei quellengebundenen KPIs, Zielerreichung und Zielkonflikt; drei kontrollierte Monatsfälle ohne Jahreslauf. A09 Abschlussreview folgt.
- T-0127 – Performance nach V3-Release: PENDING; A02/A11/A09, erst nach Commit und Push starten. Fester 30-/90-Tagevergleich mit CPU/RAM und unveränderter Semantik, danach gezielte Reduktion von Kopier-/Validierungskosten. Historische Ressourcenbelege CP-0563–0565 bleiben gültig.
- D-0163/0164: Zuordnung AG/eG/KGaA/GmbH & Co. KGaA zur Folgeversion ist als Nutzerfrage offen; Vorschlag V6. GmbH & Co. KG bleibt V3.

**CP-0566 / D-0189:** Rechtsformversionsentscheidung durch Nutzer bestätigt: AG/eG/KGaA/GmbH & Co. KGaA nach V6; GmbH & Co. KG weiterhin V3. Der entsprechende Release-Entscheidungsblocker ist geschlossen.

**Aktueller Abschluss CP-0566:** T-0128 COMPLETED (V3-10 Code/Drei-Monats-Kontrolle/A11 unabhängiger Review PASS). T-0074 bleibt als WAIVED-Freigabeausnahme erkennbar; T-0069 wird im releasebegrenzten Mindestumfang mit D-0188-Ausnahme abgenommen, kein positiver voller Jahres-PASS. T-0080 aktueller Monatsbrowser-/Mobilpfad PASS. T-0109/Lern-Reopen heute im finalen Graph bestätigt. T-0113 Pages404 bleibt OFFEN; T-0127 Performance bleibt PENDING bis Commit/Push. Details: test-reports/a01-v3-release-validation-cp0566.md. Frühere widersprechende Offen-Markierungen sind historische Zwischenstände.
