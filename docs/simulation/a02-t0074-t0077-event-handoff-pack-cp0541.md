# A02 – T-0074/T-0077 operativer Finance-Handoff-Pack

**Datum:** 2026-11-09
**Status:** Dokumentarischer Handoff aus bereits vorhandenen T-0075/T-0076-Artefakten; keine neuen Läufe und keine Finanzbuchungen
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A02 – SIMULATION
**Goals/Tickets:** MG-002 / SLG-002.2 / T-0069 / T-0074 (G3) / T-0077 (G7)
**Vorgänger:** CP-0540
**Profil:** V3, Start 2027-01-04; 2019-/2027-Profile unverändert
**Entscheidungen:** D-0175–D-0182; insbesondere D-0178 (COGS pending), D-0180 (Opening), D-0182 (Runtime/API)

## Preflight und Belegbasis

Die Control Plane wurde gemäß A01-Arbeitsauftrag gelesen. Governance-Hashes stimmen mit der CP-0540-Baseline überein: AGENTS `BD9FCB3D…A45F7`, Agentenstruktur `6AEC63F7…688182`, Rechtematrix `111373DC…7650A`, Goals `BEED7768…35F374`, Ticketboard `A5F27CA7…5163D8`, Collaboration State `9AC5265A…014AA2`, Decision Log `455E5DC7…36A97`. Branch `main`, HEAD `fdc4960`; der Arbeitsbaum enthält umfangreiche vorherige gestagte, ungestagte und ungetrackte Änderungen. Es wurde nichts gestaged, verworfen oder überschrieben.

Dieser Pack verwendet ausschließlich vorhandene Nachweise:

| Artefakt | Vorhandener Nachweis | Quelle/Identität |
|---|---|---|
| T-0075, Jahres-Auftrags-/Produktfluss | CP-0524: 12 Perioden Jan–Dez 2027, 12 Kundenaufträge, 6 Produktversände, Midyear-Restore; ausdrücklich `accepted_non_posting`/`pendingFinance=true`. Historischer Harnessbeleg CP-0513 ist nicht mehr an aktuelle Bytes gebunden. | `prototype/v3-t0075-annual-order-product-flow-smoke.mjs`; aktueller Datei-SHA-256 `2812A2640589B371DB9CDA7F4026BE2469888F38CFCBE6E35F0BCDB52CA4AA4B`; historischer CP-0513-Hash `2FEA2D86830EDA1FC38DFEEB8B7ACE3D47E04EE7A6EBED6C8C231750B1372579`. CP-0540/T-0124 hält fest, dass CP-0524 Pfad, Kommando und alle Assertions nicht gemeinsam neu bindet. |
| T-0076, Monatsmengen-/Recoverylauf | CP-0525: 12 Monatsperioden, 12 Kundenaufträge (11 angenommen, 1 abgelehnt), 8 Produktversände, 12/12 `stateHash=restoreHash`; Finanzstatus weiterhin `pendingFinance=true`. | `prototype/v3-t0076-month-end-quantity-reconciliation-smoke.mjs`, SHA-256 `D8859ACC4B154469F8A98510CB503090929E65AEE47B44C5AA753A5799D03FF4`; State SHA-256 `fa28ab6ad84d0dbda9c44d22d2335a327c87334082f776901866fd208e56d462`; Snapshotdatei SHA-256 `F12B75292EEC8FE94A26ECE39193C759ADB0BF1DE225E439CB120275B902D60E`. Details in `docs/agent-system/a01-t0076-current-run-addendum-cp0525.md`. |
| A02 Finanzquellmapping | Bestehende Laufzeitquellen und deren Grenzen sind bereits dokumentiert. | `docs/simulation/a02-t0118-finance-source-map-bericht.md`, SHA-256 `D850E678B118CBB85A6714592861DA31920ECF62BAD47DC134316A2235FBDA0F`. |
| A03 Finanzvertrag | Zulässige Quelle, Datum, Periode und Nichtbuchungsgrenzen sind beschrieben. | `docs/accounting/a03-t0069-v3-finance-handoff-matrix.md`; begrenzte Runtime: `docs/accounting/a03-t0069-finance-runtime-arbeitsbericht.md`. |

Die T-0075-/T-0076-Läufe sind synthetische technische Szenarien. Das sind keine Ist-Unternehmensdaten und keine Marktpreis- oder Finanzplausibilitätsbelege.

## Event-Handoff: belegte Felder und Status

| Operatives Ereignis / Artefakt | Aus vorhandenen Quellen belegbar | Finance-Felder `not available` / Grenze |
|---|---|---|
| Marktanfrage, Angebot und Kundenentscheidung | Run-/Szenario-/Seed-ID; Anfrage-/Angebots-/Entscheidungsbezug; Zeitpunkte; Spielerangebot-Snapshot; angenommener oder abgelehnter Status; Vertragspreis-Snapshot im Szenariomodell. | Kein daraus gebuchter Umsatz, AR, Cash oder Ledger. Ein angenommener Angebotspreis ist kein Zahlungseingang. Reproduzierbarer T-0075-Neulaufbeleg: **not available**. |
| Kundenauftrag, Arbeitsplan, Produktionsschritt | Workorder-/Auftrags-/Produktbezug; Person-/Maschinenzuordnung; geplante Stunden, Fähigkeit und Arbeitsschritt/Vorgänger; Abschlussdatum und Mengen; physischer Materialverbrauch. | Genehmigte Payroll-Istzeit, Lohnsatz, Arbeitgeber-/Arbeitnehmerabgaben, Materialwert/Einstandspreis, Istkosten und bewertete WIP-/Fertigwarenwerte: **not available**. Geplante oder simulierte Stunden nicht als abrechnungsfähige Payroll-Istzeit verwenden. |
| Lieferung und Empfängerentscheidung | Liefer-/Auftragsreferenz, Entscheidungsstatus und Datum; V3-Run unterscheidet Lieferung und Auftraggeber-/Empfängerentscheidung. | Rechnungsfähige Positions-/Steuerbasis, A03-authorisiertes Erlös-/AR-Posting und tatsächlicher Zahlungseingang für diese T-0075/76-Jahresfälle: **not available**. Nicht aus Status oder Vertragspreis ableiten. |
| Eigenprodukt und Versand | Produkt-ID, Rezeptur/Schritte im synthetischen Szenario, Output-/Fertigwarenmengen, Angebot-/Käuferentscheidung, Dispatch-/Versanddatum und physischer Bestandsabgang. | Monetäre Materialbewertung, Herstellkosten, dynamischer BAB, Versand-COGS, Umsatz-/AR-/Cash-/GL-Wirkung: **not available**; COGS bleibt nach D-0178 `PENDING`. |
| Materialbestellung, Wareneingang, Retoure | Supplier-/Quote-/Order-/Shipment-/Material-IDs, Menge/Einheit, Bestell-/ETA-/Empfangsdatum, Bewegungsquelle und Mengen vor/nach Zugang/Retouren, Monatsperiode. | Bewerteter Zugang, Anfangswert je Materialgruppe, gleitender Durchschnitt in Euro, Vorsteuer-/Steuerbetrag und Aufwand: **not available**. Mengen dürfen nicht in Euro umgerechnet werden. |
| Lieferantenrechnung und Zahlung | Für die vorhandene AP-Scheibe kann akzeptierter Wareneingang eine Rechnungsevidence und ein isolierter AP-OP begründen; separater expliziter Zahlungsvorgang kann den AP-OP und Bank im begrenzten Subledger abgleichen. T-0076 bestätigt nicht, dass der Jahresmengenlauf diese Ereignisse tatsächlich enthält. | Aus den T-0075/76 Jahres-Snapshots für alle 12 Perioden belegte, tatsächliche Supplier-AP-/Zahlungsereignisse: **not available**. Kein allgemeines Hauptbuch, keine Vorsteuer-/Bestands-/COGS-Gegenbuchung. |
| Monatsperioden und Restore | T-0076 enthält 12 Monats-Snapshots und dokumentierte Mengen-/Restore-Hashes; Perioden `2027-01` bis `2027-12`. T-0075 enthält den dokumentierten 12-Perioden-Betriebsfluss, aber seine aktuelle Quell-/Ausführungsbindung ist unzureichend. | Vollständige Monats-/Jahres-Saldenliste für Ergebnis, Bank, Forderungen, Verbindlichkeiten und monetäre Vorräte: **not available**. Hashgleichheit belegt Restoreidentität, nicht finanzielle Richtigkeit. |

## Abgrenzung für die Weitergabe

Der operative Pfad darf auf die vorhandenen IDs, Mengen, Datumsfelder, Perioden und Status zurückgeführt werden. Es darf daraus keine fehlende Finanzgröße abgeleitet werden. `syntheticCostLines` in den Smokequellen sind Test-Fixtures und keine belegten Istkosten. Kundenannahme, Menge, Versand, Materialzugang, Supplier-Rechnungsevidence oder `stateHash` erzeugen allein keine zusätzliche Buchung.

Die A03-Finanzruntime/Handoff-Matrix unterstützt nur ausgewiesene Eventtypen und einen begrenzten Subledgerumfang. Sie ersetzt kein vollständiges GL, keine Payroll-/Steuerabführung, keine Vorratsbewertung/COGS und keinen Jahresabschluss.

## Ergebnis und Folgeauftrag an A03

**T-0074/G3 bleibt NONPASS:** Es liegt kein finanziell abgeglichener tragfähiger und kein scheiternder 12-Monats-Unternehmensverlauf vor. Die Mengen-/Produktjahresläufe genügen dafür nicht.

**T-0077/G7 bleibt NONPASS:** Eine vollständige 12-Monats-Abstimmung von Payroll, gesetzlichen Steuern, Dispo/Kredit, bewerteten Vorräten, COGS und Hauptbuch fehlt. A02 kann nur operative Quellereignisse liefern. D-0178 hält COGS bis zur freigegebenen Bewertungsbasis `PENDING`.

**Folgeauftrag – A03:** Verwende ausschließlich die oben bzw. in CP-0524/CP-0525/CP-0539/CP-0540 und T-0118 dokumentierten Werte und IDs. Gleiche alle unterstützten, vorhandenen Finance-Events mit der A03-Subledger-/Reconciliation-API ab und benenne pro Ereignis, Feld und Periode das Ergebnis. Führe `not available`-Felder in einer Lückenliste; setze keine Ersatzwerte, Defaults, Restbeträge oder Buchungen. Für T-0075 darf kein frischer Herkunftsclaim abgegeben werden, solange der neue gebundene Laufbeleg fehlt. Weise getrennt aus, welche Minimalteile der G3/G7-Jahresabstimmung damit belegt werden und welche weiterhin blockieren. Rückfragen gehen an A01.

## Prüfstatus und Rollen

- **Ausführung:** A02 hat vorhandene Dokumente und Testquellen statisch abgebildet; kein Lauf/keine Tests ausgeführt.
- **Fachreview A03:** noch ausstehend für diesen Handoff-Pack.
- **Unabhängige QA A09:** noch ausstehend; kein Gate-PASS behauptet.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Änderungen:** Nur dieser Bericht ist neu. Kein Code, keine Daten, kein Schema und keine historischen CP-Dateien geändert.
- **Git:** Branch/HEAD siehe Preflight. Arbeitsbaum mit umfangreichen bestehenden Änderungen; kein Staging, Commit oder Push. `git diff --check` für diesen neu erstellten Bericht ist noch durch A01 auszuführen.

**Autor:** A02 – SIMULATION
**Mitwirkende:** A01-Kontextübergabe; keine weiteren Agenten an der Erstellung beteiligt.
**Nächster Adressat:** A01 zur Ticketintegration und A03-Beauftragung.
