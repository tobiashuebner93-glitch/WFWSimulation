# A03-Code-Re-Review – L0/L1 Betriebswirkung und Finanz-Nichtmutation

**Status:** NONPASS – Finance-Nichtbuchung PASS; Wochenkapazitäts-Grenzfall offen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Datum:** 31.10.2026
**Goals/Tickets:** MG-002 / SLG-002.2; T-0063, T-0065, T-0069
**Gegenstand:** `prototype/v3/run.js`, `prototype/v3-run-macro-fixture.js`, `prototype/v3-year-smoke.mjs`, `prototype/v3-run-operating-impact-regressions.mjs`
**Vorgänger:** CP-0352, CP-0354–CP-0357; D-0169; A03 Finance-Evidenzvertrag

## Preflight und Prüfgrenze

Erneut gelesen wurden Repository-`AGENTS.md`, Agentenstruktur und Rechtekarte, Goals, Ticket-Board, Collaboration State, Decision Log mit D-0169, CP-0351–CP-0357, A02-Bericht zu CP-0357, die benannten Laufzeit-/Regressiondateien sowie der A03-Evidenzvertrag. CP-0358 und dieser Bericht waren vor dem Review nicht vorhanden. Geprüft wurde read-only; keine Produktregel- oder Codeänderung, keine Buchungsfreigabe.

Git-Root und HEAD sind lesbar (`8b72b7e35fd7bbd8d967655d0a97e0a01b93266`); `git status --short` schlägt in dieser Sitzung mit `fatal: this operation must be run in a work tree` fehl. Working-Tree-Diff ist daher nicht unabhängig verifiziert.

## Ergebnisse nach Prüfkriterium

| Gate | Ergebnis | Befund |
|---|---|---|
| **Planstunden sind keine Istkosten** | **PASS** | `getV3RunOperatingImpact` ist eine reine Projektion aus gespeicherten Wochen-/Produktplanzeilen. Sie führt `plannedHours`, `accountingClass: information_plan` und `directFinanceEffect: false`; sie leitet weder Geldbetrag noch Istkostensatz oder Buchung ab. Der A03-Evidenzvertrag hält fehlende Istkostenbasis offen und verbietet, Plankosten als Ist zu verwenden. |
| **FinanceState/Cash/Kosten/Vertragszustand unverändert** | **PASS** | Projektion enthält keinen FinanceState als Eingabe und mutiert den Run nicht. Die L0/L1-Regression vergleicht den FinanceState vor/nach der Projektion sowie nach JSON-Save/Restore. Separate FinanceRuntime- und Makroregressionen bestanden. `createRunSaveEnvelope`/Restore rufen Finanz-Reconciliation auf, aber die Regressionen bestätigen unveränderten FinanceState. |
| **Nur tatsächliche Spielerannahmen als gewonnene Aufträge** | **PASS** | `wonOrders` wird aus `customerWorkOrders` gebildet; der Shared-Run-Validator bindet diese an akzeptierte Spieler-Marktentscheidungen. Der Test zeigt Anfrage ohne Spielerangebot/Zuschlag als null Gewinn sowie einen echten Spielergewinn als eins. Ein bloßes Angebot oder eine Anfrage reicht nicht. |
| **D-0169 einziger Gesamtanfragefaktor** | **PASS** | Betriebsprojektion liest den kanonischen `schedule_week`-Trace; sie berechnet keine zweite Phasenmultiplikation. Vier explizite Aktivitätslücken, neutrales Exposure und 52-Wochen-Traces wurden in den Regressionen geprüft. Die D-0169-Gesamtzahl bleibt die Anzahl der erzeugten Vorlagen/Anfragen. |
| **Deklarierte Personalstunden × 5 Werktage** | **NONPASS – enger Eingabefall** | Die Kennzahl und ihre Grenze sind lesbar erklärt: Summe `hoursPerDay × 5`, ohne Abwesenheiten oder Maschinenengpässe. Reguläre Produkt-/Kundenplanung prüft Arbeitstage. Der Initialisierungsweg für `commitments` validiert jedoch nur Datum/Resource/Tagessumme, nicht den Wochentag. Ein Samstag-Commitment wird angenommen und im L0/L1-Wochenwert mitgezählt, während der Nenner weiterhin nur fünf Wochentage enthält. |
| **Save/Restore deterministisch** | **PASS im Regressionumfang** | Betriebsauswirkung wird ohne zweiten mutierbaren Ledger aus `schedule_week`, Marktentscheidungen und Produktplänen abgeleitet. JSON-Save/Restore ergibt dieselbe Wochenprojektion und FinanceState. Die Jahressmoke-Kandidatur bindet Makrowochen an D-0169 und prüft Jahreszustand; sie schreibt keine Finanzbuchungen. |

## Reproduzierter Grenzfall und minimale Übergabe

Zusätzlicher read-only Repro verwendete ein 8-Stunden-Personalprofil und eine am Samstag, 09.01.2027, eingetragene bestehende Verpflichtung von 8 Stunden. `installRunOperatingResources` akzeptierte den Datensatz; die Betriebsprojektion meldete `plannedHours: 8`, `availableCapacityHours: 40`, `utilization: 0.2` und deklarierte als Basis fünf Werktage. Dies vermischt eine Nicht-Arbeitstagsbelegung mit der Werktagskapazität.

**Minimale A02-Fixübergabe an A01:** Im Initialisierungs-/Restore-validierten Commitment-Pfad Wochenendtermine fail-closed ablehnen (entsprechend dem bestehenden V3-Arbeitstagevertrag) und eine Regression für Samstag/Sonntag hinzufügen. Alternativ darf A02 eine ausdrücklich andere Wochenkapazitätsdefinition vorschlagen; A03 legt keine operative Kalenderregel fest. Bis zur Korrektur ist das Kapazitätsgate NONPASS für beliebige gültige Eingaben, auch wenn die regulären Regression-Fixtures bestehen.

## Tests und Nachweise

| Befehl | Exitcode | Ergebnis |
|---|---:|---|
| `node prototype/v3-run-operating-impact-regressions.mjs` | 0 | PASS – vier synthetische Aktivitätslücken, Neutralfall, Annahme/keine Annahme, Planstunden, Kapazität, Save/Restore und FinanceState-Nichtmutation. |
| `node prototype/v3-finance-runtime-regressions.mjs` | 0 | PASS – validierte synthetische A02-Run-Fixtures. |
| `node prototype/v3-macro-demand-channel-regressions.mjs` | 0 | PASS – 52-Wochen-Richtung, Trace-/Quellbindung, koordinierter Restore, Replay und Finanzchecks. |
| Ad-hoc Samstag-Commitment-Repro | 0 | **Befund reproduziert** – siehe Werte oben. |

Der vollständige Jahres-Smoke wurde im Auftrag nicht erneut ausgeführt; CP-0357 dokumentiert den einzelnen UPSWING-Jahres-Smoke als PASS (362 Tage/12 Monate) und den abgebrochenen Vierpfadlauf als unvollständig. Browser-/Gerätetest: nicht ausgeführt.

### Dateiidentifikation

SHA-256 der geprüften Repository-Dateien:

| Datei | SHA-256 |
|---|---|
| `prototype/v3/run.js` | `13A69689BC7F7A9DC61EF7990EC46317FB58709EC5F9FCD6F0207FD97087FCA1` |
| `prototype/v3-run-macro-fixture.js` | `DB34F777A1D8F0A2A028EBBDD028530AD6FB23E542759A2ED13CEEEB4EA28CB2` |
| `prototype/v3-year-smoke.mjs` | `B80AE8C115AB00A26FB0618713D11498F538068EB3F88E14F2950F76ECC3B49B` |
| `prototype/v3-run-operating-impact-regressions.mjs` | `1FF6D30FC760CEF27223845B5AAC9A902F5827A142C8D39766031D6E6DC305D0` |
| `prototype/v3-finance-runtime-regressions.mjs` | `710813A1BF0AA5FC913DE14A4C1296AEFA96D8A88D752CB90F7BE29E6993FEBD` |
| `prototype/v3-macro-demand-channel-regressions.mjs` | `D4B1480A0D226B9C353770E205088E8BCCA980BD44B92803A7FA3C5FA7C5A18D` |
| `docs/agent-system/checkpoints/CP-0357.md` | `6C7C9D1FD23F1D5710375000C7E18F5143BF3C555C78C89B69D47500E26FCBBA` |
| `docs/simulation/a02-t0063-l0l1-betriebswirkung-bericht-cp0357.md` | `EF9EFA926048927E1F7CAF1256EEBA705D1CDABC3C6CFBA144E6622E4CBF8108` |

## Gesamtstatus / Übergabe

L0 ist im geprüften Umfang PASS. L1 ist für die üblichen Werktags-Fixtures PASS, aber **als robustes Codegate NONPASS**, weil initiale Wochenend-Commitments angenommen und in eine Werktagsauslastung eingerechnet werden. Finanz-Nichtmutation und D-0169-Abgrenzung bestehen. Keine Buchungs-, Kosten-, Vertrags-, Kapazitätsregel- oder Releasefreigabe durch diesen Review.

**Nächster Schritt:** A01 beauftragt A02 mit dem Wochenend-Commitment-Fix und einer gezielten Re-Regression; danach A03 prüft nur diesen Grenzfall erneut und A09 führt das unabhängige adversariale Review durch. Kein Commit/Push.
