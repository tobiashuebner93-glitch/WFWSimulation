# A02-Auftrag – T-0118 Finanzquell- und Periodenmapping

**Status:** IN_PROGRESS nach CP-0531  
**Adressat:** A02 – SIMULATION  
**Rückmeldung:** ausschließlich an A01 – MASTER_ORCHESTRATOR  
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0118 / T-0116 / T-0077 / T-0069 G7

## Auftrag

Lies die aktuellen Runtime-/Eventpfade read-only und erstelle ein konkretes Quell-/Periodenmapping für die bestätigten Finanzslices D-0175–D-0180 und A03-Vertrag T-0116. Decke mindestens ab:

1. Payroll: vorhandene Mitarbeiter, genehmigte Einsätze/Arbeitszeit, Abwesenheit, tatsächliche Istzeit, fehlende Vertrags-/Abrechnungsmerkmale.
2. Steuer: Kundenrechnung/SimTAX, Lieferantenrechnung und unbekannter Steuerstatus, Payroll-Abgaben; getrennte Quelldaten und Fälligkeitsanker.
3. Kredit/Dispo: Kundeneingänge, mögliche manuelle Draw-/Rückzahlungs-Events, Tages-/Monatsabschluss; vorhandene Startbilanzwerte.
4. Material: akzeptierter Wareneingang, D-0173-Rechnungsevidence, D-0174 AP-/Payment-Events und Daten für den gleitenden Durchschnitt.
5. GL/Jahreslauf: Run-Ereignisquellen, effektives Datum/Monat, stabile Source-ID, Restore/Dedupe und Monats-/Jahresprojektionen.
6. D-0178: Produktversand und physische Bestandsevents bleiben erfasst, WIP/Fertigwarenwert/COGS aber bis BAB/Kostenpoolbasis PENDING.

Für jede Quelle gib Runtime-Datei/-Funktion, Event-/Datensatzname, erforderliche Felder, Datum/Periode, Replay-/Restorebindung, tatsächliche/fehlende Felder und die mögliche A02-Änderung an. Trenne vorhandene Quellen, bloße Planwerte und fehlende Belege.

## Änderungsgrenzen / Ergebnis

- Nur einen neuen read-only Mappingbericht in docs/simulation/a02-t0118-finance-source-map-bericht.md erstellen.
- Keine Runtime-/Run-/Eventänderung, kein Schema, keine Bilanz-/Finance-Mutation, keine Änderung an D-0175–D-0180 oder bestehenden A03/A09-Berichten.
- Keine Lohn-/Steuer-/Zinssätze oder fehlenden Geldwerte erfinden.
- COGS nicht auf null setzen oder trotz D-0178 als buchbar/abgeschlossen kennzeichnen.
- Keine T-0077/G7- oder T-0069/G3-PASS behaupten.
- Softwaretests/Browser nur melden, falls ausgeführt; sie sind nicht beauftragt.
- Im Bericht angeben, welche spätere A02-Ereignis-/Runtimearbeit tatsächlich notwendig wäre und welche Quellen bereits ausreichen.
- Rückfragen ausschließlich an A01.

## Preflight

Datum: 2026-11-08  
Branch/HEAD: main / fdc4960d4bf92fb13f6802e8d0738eb3d9110097  
Status zum Agentenwechsel: 768 Zeilen; Änderungen anderer Arbeitspakete bleiben erhalten.
AGENTS.md: BD9FCB3DE9082E716E2DB0D5B59F824B43B8E1007FDB2BA759DDC591A83A45F7
agent-structure.md: 6AEC63F774DD47A4396249B006F40843A4C65F53484AD5CB0BAD27EE34688182
agent-rights-matrix.md: 111373DC950C41DD4191B62A36CACAB730A2E8E34BE757AB55D83D608CC7650A
goals.md: BEED7768B5C2D7F8EF1D8280E389E492E0216012A3401BF03254DE734A35F374
ticket-board.md: D03E411689BBFC86CDC67E0E7CBBBBF60D36EFD9A03A371DD4C72B927D6FABB4
collaboration-state.md: A3D867C5ADC5C57A54F24BD6CA6188545B4BBE4AAE232A4E6F818C116146C1E2
decision-log.md: B1C4CC45E4042A93CCF8DA90AE6C013220288915D2CE4BA70BF3364FBE528C6A  
Maßgebliche Entscheidungen: D-0152, D-0165–D-0180.  
Vorgänger: CP-0531 (unverändert).