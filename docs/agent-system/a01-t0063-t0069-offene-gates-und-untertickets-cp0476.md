# A01 – Offene T-0063-/T-0069-Gates und Untertickets (CP-0476)

**Status:** Elf offene Minimalziel-Gates in adressierte Untertickets aufgeteilt; erste Fachpakete gestartet
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Goals/Tickets:** MG-002 / SLG-002.2, SLG-002.5 / T-0063, T-0069
**Vorgänger:** CP-0475 (ENTWURF)
**Branch/HEAD:** `main` / `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`

## Gate-Abgleich

Die vorherigen Skalenwerte 6/10 und 5/10 sind Fortschrittsschätzungen, nicht die Anzahl bestandener Binärkriterien. Der verbindliche Minimalzielkatalog hat je Ticket genau zehn Kriterien. Der Abgleich mit CP-0475, den bestehenden Run-/Finanzreports und den Kriterien ergibt:

| Hauptticket | Als offen/pending geführte Gates | Anzahl | Hauptgrund |
|---|---|---:|---|
| T-0063 | G3, G5, G7, G10 | 4 | Mindestens zwei Außenwirtschaftskanäle müssen eine echte Firmenvariable/Spieloption ändern; EZB-Zinsschritt braucht Finanzierungs- plus Makro-/Betriebswirkung; wirksame Kanäle brauchen echte, isolierte Wirkungspaare; aktuelle Gesamtfachabnahme fehlt. |
| T-0069 | G3, G5, G6, G7, G8, G9, G10 | 7 | Jahreswirtschaftlichkeit, kompletter Auftrags-/Produktfluss, monatsweiser Bestand, Finanz-/Ledgerabgleich, Recovery je Profil, konkrete Laufzeitgrenze und aktuelle Browser-/Unabhängigkeitsprüfung sind nicht vollständig belegt. |

G1/G2/G4 bei T-0069 bleiben durch CP-0450/CP-0474 als begrenzte synthetische Makro-/Markt-Harness-Evidenz belegt; das ist kein Unternehmensjahres-PASS. Frühere Gates werden nicht aufgrund der 5/10-Schätzung als pauschal PASS behandelt. Gate 10 bei T-0063 bleibt offen, bis sämtliche anderen T-0063-Gates frisch und mit den erforderlichen Fachrollen re-reviewed sind.

## Untertickets

| Unterticket | Gate | Adressat / Owner | Abnahmekriterium | Status / Abhängigkeit |
|---|---|---|---|---|
| T-0070 | T-0063 G3 Außenwirtschaft | A02; Review A08/A03/A09 | Mindestens drei getrennte Kanäle; zwei kontrolliert veränderte echte Spieloptionen/Firmenvariablen mit Neutral-/Wirkungspaar, Quellen/Annahmen, Lag, Replay und Finanz-Nichtmutation. Keine bloße Indexanzeige. | IN_PROGRESS |
| T-0071 | T-0063 G5 EZB | A03; Simulation A02; QA A09 | Zinsanhebung und -senkung ändern eine ausdrücklich unverbindliche Finanzierungsgröße und einen getrennten Makro-/Betriebsindikator; Methodik, Quelle/Annahme, Lag, Grenzen und Nonposting sind belegt. | IN_PROGRESS |
| T-0072 | T-0063 G7 operative Wirkung | A02; Review A03/A08/A09, UI A05 | Für jeden als wirksam markierten Kanal bestehen ein kontrolliertes Paar, das nur die vorgesehene echte V3-Spielvariable ändert, und ein neutraler Gegenfall; keine Doppelzählung. | PENDING; abhängig von T-0070/0071 |
| T-0073 | T-0063 G10 Fachabnahme | A09; Beiträge A08/A02/A03/A05 | Unabhängige Prüfung aller neun Gates nach Implementation; Quellen, Modell/Replay, Finanzgrenze und UI-Anzeige sind aktuell belegt. | PENDING; nach T-0070–0072 |
| T-0074 | T-0069 G3 Jahreswirtschaftlichkeit | A02; Finanzreview A03; QA A09 | In reproduzierbaren Jahresläufen mindestens ein tragfähiger und ein wirtschaftlich scheiternder Unternehmensverlauf mit konkreten Spielerentscheidungen/Kennzahlen; keine erfundenen Ergebnis-/Ledgerwerte. | PENDING; hängt von T-0075–0077 ab |
| T-0075 | T-0069 G5 Auftrags-/Produktfluss | A02; Integration A05; Review A03/A09 | Jahreslauf stimmt Kundenaufträge und Eigenprodukte von Anfrage/Angebot bis Planung, Produktion, Fertigbestand, Abnahme/Versand und Abschluss mengen-/statusgenau ab. | PENDING |
| T-0076 | T-0069 G6 Material-/Bestandsabgleich | A02; Finanzreview A03; QA A09 | Material, Fertigware, Reservierung, Quarantäne und Lagerkapazität erfüllen in jedem Monatsabschluss nachvollziehbare Roll-forward-Gleichungen; Bewertungs-/COGS-Lücken bleiben explizit pending. | PENDING |
| T-0077 | T-0069 G7 Finanzabgleich | A03; Integration A02; QA A09 | Ein integrierter Jahrespfad stimmt Rechnungen, OP, Kundenzahlungen, eigene Zahlungen, Bank/Dispo, Steuern und Ledger/Perioden vollständig ab; keine unbelegte Buchung. Fehlende API wird mit konkretem minimalem Implementierungsslice geschlossen, nicht als PASS umformuliert. | IN_PROGRESS |
| T-0078 | T-0069 G8 Recovery | A02; unabhängige QA A09 | Für jedes Jahresprofil mindestens ein Save/Restore/Fortsetzen mit identischem fachlichem State-/Eventhash; Fehler-/Negativbestand-/Doppelbuchungsfälle fail-closed und ohne Teilmutation. | IN_PROGRESS |
| T-0079 | T-0069 G9 Laufzeit | A02; Mess-/Grenzreview A09 | Konkrete Laufzeitobergrenze je Profil und Zielumgebung steht vor Vollrun im Ticket; vier Jahresprofile protokollieren Laufzeit, Validatoraufrufe und Abbruchstatus und bleiben darunter. | IN_PROGRESS |
| T-0080 | T-0069 G10 Browser/Unabhängigkeit | A12; UI-Fixes A05; QA A09 | Kernpfade in 390×844 und 768×1024 ohne abgeschnittene Aktionen, horizontalen Overflow oder Browserfehler; A09 prüft Reconciliationbelege unabhängig und A12 dokumentiert die reproduzierbare Geräte-/Browserprüfung. | PENDING; nach den integrierten Runpfaden |

## A01-Arbeitsreihenfolge

1. A02 bearbeitet T-0070; A03 bearbeitet T-0071. Sie liefern ihre Ergebnisse ausschließlich an A01 und benennen keine Rückfrage direkt an den Nutzer.
2. A01 integriert die Ergebnisse in T-0072 und vergibt danach T-0073 an A09.
3. A02/A03 schließen T-0075 bis T-0077 als integrierte Kette; A02 bearbeitet T-0078/T-0079 parallel nur soweit keine überlappenden Run-Dateien konfligieren.
4. A12/A05/A09 bearbeiten T-0080 nach dem integrierten Stand. T-0074 wird erst auf die reconcilierten Läufe gestützt.

Annahmen dürfen fehlende Daten nicht in Istwerte umdeuten. Produkt-/Finanzregeln mit realer Simulationswirkung sind ausdrücklich als synthetische V3-Annahme zu versionieren und fachlich zu prüfen. A01 bündelt notwendige Nutzerrückfragen; bei einer nicht entscheidungsbedürftigen Agentenantwort entsteht ein konkret adressierter Folgeauftrag.

## Preflight-Digest für erste Übergaben

- `AGENTS.md`: `414F899B62C8EA818B6DC62590EB4677274476AB429B7D81A7F81744E9E4E556`
- `agent-structure.md`: `AA054E90AA07B7E141531711D32C1F20B19CA5D28D7E677E9F117CEA40BCD3EE`
- `agent-rights-matrix.md`: `94E6088395EF4B4C881BD8958DEBB80B4271C5B8485CF5675191DA37126DD5FE`
- `goals.md`: `FC23DC22972177C6F4D3E715444EE279A380E76BF9B66C07E6F9C9AFEDB1EF0D`
- `ticket-board.md`: `9B36CE3ACBFCC555E8CC37FD51C95121B8D6CB8A18C7DB10001BC500B55787D9`
- `collaboration-state.md`: `AA56C835E95A71326E392A38541DBD5C909054C0FDECDC31A35869D4E0FBBFC1`
- `decision-log.md`: `1EA4649C21FCC505BD4A9931CB7B9C16628656A0A9F2BB88DF07E3460ADAACEB`

Bericht und Unterticketregister sind Arbeitsstand, kein Abschlussnachweis der Untertickets. CP-0475 und ältere CPs bleiben unverändert. Kein Commit/Push.
