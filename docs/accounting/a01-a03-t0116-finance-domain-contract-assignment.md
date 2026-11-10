# A03-Arbeitsauftrag – T-0116 V3-Finanzverträge und Posting-Spezifikation

**Status:** IN_PROGRESS nach expliziter Nutzerbestätigung der Leitentscheidungen  
**Adressat:** A03 – ACCOUNTING_FINANCE  
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 / SLG-002.5  
**Ticket:** T-0116 als Vorbereitungs-/Unterticket zu T-0077 und T-0069 G7  
**Rückmeldung:** ausschließlich an A01

## Auftrag

Erstelle einen fachlichen, implementierungsfähigen Domain-/Event- und Kontierungsvertrag für die bestätigten D-0175 bis D-0180. Trenne ihn in diese Slices:

1. Payroll samt OPs, Abgaben und Zahlungen;
2. getrennte Steuerarten samt Meldungs-/Fälligkeits-/Zahlungsevents;
3. Dispo: 1.000 € Anfangsrahmen aus D-0180; 10 % der belegten Bilanzsumme quartalsweise; manueller Draw, Kundeneingang-zuerst-Rückführung und bestätigte Actual/365-Monatszinsregel;
4. Materialbestand: nur quellengestützte Rechnungswerte, gleitender Durchschnitt; WIP/Fertigware/COGS nach D-0178 bis BAB/Kostenpoolbelege PENDING;
5. Hauptbuch: Soll/Haben-Postingmappings und Kontrollkonten; D-0174 bleibt unverändert, GL-Mirror darf denselben AP-/Bank-Event nicht doppelt ausführen oder zählen;
6. Eröffnungsbilanz: 10.000 € Bank gegen 10.000 € Inhabereinlage; Grundwerkbank/-werkzeuge als physische, bis zur Wertbelegung nichtmonetäre Spielausstattung.

## Akzeptanzkriterien

- Jede Domain-/Eventart hat Quelle, stabile ID/Dedupe, wirksames Datum, Periode, Betrag/Währung, Status, Autorisierer, Gegenkonto und Restore-/Reversal-Regel.
- Soll/Haben je GL-Event ist centgenau ausgeglichen. Kontrollkonten stimmen mit AR/AP/Payroll/Steuer/Finanzierung/Bank/Materialnebenbüchern überein.
- PENDING wird fail-closed für fehlende Vertrags-, Steuer-, Zahlung-, Inventar- oder Kostenpoolwerte verwendet; keine Null-, Planwert- oder Restwertproxies.
- Rechtsfrist- und Parameterreferenzen sind aktuelle amtliche Quellen mit Prüfdatum, Wirksamkeit und V-Version. Steuerarten werden nicht zu einer einheitlichen Fälligkeit zusammengezogen.
- Bestätigte V1-Dispo-Elemente sind aufgelistet; D-0129s sachfremde bzw. noch nicht für V3 bestätigte Ereignisordnung wird nicht pauschal portiert.
- D-0174s operatives AP-/Bankverhalten bleibt unverändert; neue GL-Spiegelung ist ein getrenntes, dedupliziertes Postingevent ohne zweite Cashmutation.
- COGS/WIP/Fertigwaren bleiben entsprechend D-0178 offen, bis spätere BAB/Kostenpoolzuordnung vorliegt.
- Der Vertrag benennt offene technische Abhängigkeiten und exakte Gegenproben für A02/A04/A09; er behauptet keinen G7-PASS und ändert weder Runtime noch Schema.

## Änderungslimits und Review

Nur neue A03-Vertrags-/Berichtsdokumente bearbeiten. Keine Änderungen an decision-log, D-0175–D-0180, Runtime, Engine, Datenmodell/Schema oder bestehenden CP-Dateien. A01 integriert Ergebnisse erst nach fachlicher Prüfung. Danach folgen A02-Quell-Event-Abgleich, A04 Restore-/Persistenzreview und A09 unabhängige Gegenprüfung im autoritativen Checkout.

## Präflight für diesen Agentenwechsel

- Datum: 2026-11-08
- Vorgänger: CP-0529 nach dieser Übergabe
- Branch/HEAD: main / fdc4960d4bf92fb13f6802e8d0738eb3d9110097
- Bereits vorliegende lokale Änderungen: 763 Statuszeilen (689 staged additions, 22 added-and-modified, 12 unstaged modifications, 40 untracked); keine Änderung wird gestasht/verworfen.
- Control-Plane-Hashes nach Dokumentation der Nutzerentscheidungen:
  - AGENTS.md: BD9FCB3DE9082E716E2DB0D5B59F824B43B8E1007FDB2BA759DDC591A83A45F7
  - agent-structure.md: 6AEC63F774DD47A4396249B006F40843A4C65F53484AD5CB0BAD27EE34688182
  - agent-rights-matrix.md: 111373DC950C41DD4191B62A36CACAB730A2E8E34BE757AB55D83D608CC7650A
  - goals.md: BEED7768B5C2D7F8EF1D8280E389E492E0216012A3401BF03254DE734A35F374
  - ticket-board.md: 59724CAB6A5C2F4C570EA060AB735E0F6D3726318479CF843358BFCD14EB5970
  - collaboration-state.md: 1A50CD1A73FF0120EBC7FA5353F33BD483389EBA2EB6EF27712137236978A9FD
  - decision-log.md: B1C4CC45E4042A93CCF8DA90AE6C013220288915D2CE4BA70BF3364FBE528C6A
- Ticket-/Entscheidungsbasis: T-0077, CP-0527–0529, D-0152, D-0165–D-0180.
- Zielartefakt: separater A03-Bericht, ohne überlappende Schreibpfade.
