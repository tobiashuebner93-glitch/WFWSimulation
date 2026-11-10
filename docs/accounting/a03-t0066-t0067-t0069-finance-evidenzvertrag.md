# A03 – T-0066/T-0067/T-0069 Finance-Evidenz- und Reconciliation-Vertrag

**Status:** Dokumentarischer Fachvertrag; nichtbuchend; keine Implementierungs-, Schema-, Ledger- oder Bewertungsfreigabe
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Goals:** MG-002 / SLG-002.2 / SLG-002.5
**Tickets:** T-0066, T-0067, T-0069
**V3-Profil:** gemeinsamer Szenariolauf ab 04.01.2027; keine Änderung an V1/V2 oder Startprofilen 2019/2027
**Entscheidungen:** D-0162, D-0165–D-0168; D-0169 nur als separate Makro-Nichtbuchungsgrenze
**Vorgänger:** CP-0339; CP-0340 (A02, ENTWURF); CP-0338 (A11, ENTWURF)
**Stand:** 2026-10-31

## 1. Zweck und Grenze

Dieser Vertrag legt die fachlichen Evidenzanforderungen fest, bevor A02-Istereignisse für A03-Plan/Ist-BAB, Material-/WIP-/Fertigwarenbestand oder eine spätere COGS-Übergabe verwendet werden dürfen. Er ist ein nichtbuchendes Daten- und Reconciliation-Arbeitsformat. Feldnamen sind beschreibende Übergabebegriffe, keine Datenbank-/Schemafreigabe. Ein vollständiger Belegdatensatz ist höchstens `ready_non_posting`; er ermächtigt nicht zu einer Finanz-, Bestands-, Steuer- oder Hauptbuchbuchung.

Es werden ausschließlich bereits festgelegte Regeln übernommen:

- **D-0162:** `R` ist Nettoplanpreis; DB I zieht nur explizit variable Einzelkosten ab; direkte Kosten bleiben sichtbar getrennt; BAB verteilt statt Kosten zu erzeugen; Restcentverfahren und Kostenstellen-Tie-break sind fixiert; Plan-/Annahmesnapshot bleibt unveränderlich; operative Flüsse gehören in Kalendermonate, Cash/OP zusätzlich zu Stichtagen.
- **D-0165–D-0168:** 19 % SimTAX und 14 Tage gelten nur im dokumentierten V3-Rechnungs-/Forderungsfall; Leistungs-, Liefer-, Kundenentscheid-, Rechnungs- und Zahlungsereignisse bleiben getrennt. Diese Regeln bestimmen keine Produktionskosten oder Materialbewertung.
- **D-0169:** Makroaktivität darf im explizit synthetischen V3-Kanal nur die Anzahl der Marktanfragen beeinflussen; das Makroereignis verändert selbst weder operative Finanzwerte noch Kosten, Preise oder Kapazitäten. Die A02-Implementierung und das dafür angeforderte A03-Nichtbuchungsreview sind in diesem Dokumentationsauftrag nicht geprüft.

## 2. Trennung der Sichten

Jeder Wert erhält ausdrücklich eine Sicht und darf nicht in eine andere Sicht kopiert werden:

1. `plan`: Angebots-/Produktannahme, geschätzte Menge/Zeit/Kosten, Kostenbasis und BAB-Version. Quelle ist der Kalkulationssnapshot.
2. `accepted_plan`: eingefrorener Angebots-/Vertragssnapshot nach Annahme. Änderungen werden nicht rückwirkend eingerechnet.
3. `actual_evidence`: beobachtete oder belegte Mengen, Arbeitszeiten, Materialbewegungen und tatsächlich angefallene Kosten mit Ereignisquelle. Dies ist weiterhin kein Posting.
4. `period_reconciliation`: nichtbuchender Vergleich von Plan/accepted plan mit actual evidence und BAB-Verteilung für die bezeichnete Periode.
5. `valuation_pending`: Bestand/WIP/Fertigware hat physische Mengen-/Statusnachweise, aber keine ausdrücklich zulässige vollständige Bewertungsbasis.
6. `cogs_pending`: Verkauf/Abgang ist ggf. belegt, aber keine freigegebene Zuordnung des bewerteten Bestands zum Aufwand.

Planstunden, Angebotswerte, Sollverbrauch oder BAB-Angebotssätze sind keine Istwerte. Ein fehlender Wert ist `missing/unknown`, niemals stillschweigend `0`. Ein bestätigter Gesamt-Eröffnungswert wird nicht ohne belegte Einzelwerte auf Gruppen verteilt.

## 3. Evidenzvertrag für Istkosten und Ist-BAB (T-0067, T-0066)

Je tatsächlicher Kostenposition müssen mindestens folgende Angaben entweder mit Quelle belegt oder als fehlend/offen markiert sein:

| Evidenzfeld | Erforderlicher Inhalt | Sperre bei fehlendem/ungültigem Inhalt |
|---|---|---|
| Ereignisidentität | Run, Auftrag oder Produkt; stabiler Ereignisschlüssel; Art des Arbeitsschritts/Kostenereignisses | `pending_missing_event_ref` |
| Quelle/Beleg | A02-Ereignisreferenz und zugrunde liegender Beleg bzw. ausdrücklich gekennzeichnete synthetische Beobachtung; Aussteller/Quelle und Beleg-ID soweit vorhanden | `pending_missing_source` |
| Ereignis-/Leistungsdatum | tatsächlicher Beginn/Abschluss oder sonstiger belegter Kostentag; Datumstyp eindeutig benannt | `pending_missing_event_date` |
| Periode | Kalendermonat wird aus belegtem Ist-Ereignis-/Leistungsdatum nach D-0162 abgeleitet. Separat angegebene Periode wird dagegen geprüft; eine Abweichung braucht einen expliziten Zuordnungsgrund und bleibt bis zur fachlichen Klärung offen. Kein stilles Rückdatieren; Makroperiode ersetzt keine operative Periode. | `pending_missing_period` / `pending_period_assignment_review` |
| Menge und Einheit | tatsächliche Zeit, Menge oder physischer Treiber; Einheit, Messmethode und Zuordnung zu Tätigkeit/Material/Produkt | `pending_missing_quantity` / `pending_missing_unit` |
| Kostenbetrag und Kostensatzbasis | tatsächlich belegter Betrag oder belegte Rate × Istmenge; Währung, Ratebasis, Zeitraum/Gültigkeit und Kostenkategorie; keine Ableitung aus dem Angebot | `pending_missing_cost_basis` |
| Klassifikation | ausdrücklich `variable`, `direct_fixed/other_direct` oder BAB-Pool/Gemeinkostenart gemäß Eingabe; keine Klassifikation nur aus unmittelbarer Zurechenbarkeit | `pending_missing_cost_classification` |
| Kostenstelle und BAB | Quellkostenstelle, Empfängerkostenstelle(n), Kostenpool, BAB-Version/Stand und Periode; Verteilungsschlüssel samt Typ/Einheit/Basis und Empfängern | `pending_missing_cost_center` / `pending_missing_bab_version` / `pending_missing_bab_basis` |
| Snapshotbezug | verwendete Angebots-/Produktplanversion und angenommener Snapshot; Plan- und Istversionen bleiben separat | `pending_missing_plan_snapshot` |
| Idempotenz/Korrektur | stabile `sourceEventId`/`sourceRef`; bei Korrektur Verweis auf Original, Korrekturgrund und ersetzte/gegenläufige Evidenz | `pending_missing_idempotency_ref` / `pending_correction_link` |

**Nichtbuchende Auswertung:** Bei vollständigem Eingang können Plan-Ist-Differenz, Istkosten nach ausdrücklich gewählter Kategorie sowie die D-0162-konforme BAB-Verteilung berechnet und angezeigt werden. Nicht vollständig belegte Positionen bleiben aus der BAB-/Plan-Ist-Berechnung heraus oder blockieren das betroffene Ergebnis; es wird weder ein Nullwert noch ein pauschaler Ersatzbetrag verwendet. Die Summe der BAB-Ausgabe muss nach D-0162 exakt auf den belegten Kostenpool abstimmen. Verteilungsfehler erhalten `rejected_reconciliation_mismatch`.

Die Vertragstexte definieren die Plan-BAB-Arithmetik. Sie bestimmen derzeit nicht, wie eine konkrete A02-Zeit-/Materialbeobachtung zu einem buchungsfähigen Ist-Kostensatz wird, ob alle tatsächlichen Gemeinkosten bereits vorliegen oder welcher Anlagen-/Personalaufwand finanziell anzusetzen ist. Diese Eingaben bleiben offen, bis belegte Werte und eine hierfür zuständige A03-Freigabe bestehen.

## 4. Evidenzvertrag für Bestand, WIP, Fertigware und COGS (T-0066/T-0069)

Jede physische Bestandsbewegung wird separat und mengenbasiert nachgewiesen:

- Material-/Produkt-/Los-ID, Lagerort und Einheit;
- Ereignisart (Eingang, Reservierung, Verbrauch, WIP-Übergang, Fertigwarenfreigabe, Versand/Abgang, Korrektur);
- Run-/Auftrags-/Produkt- und Operationsreferenz;
- Quelle/Beleg/Beobachtung sowie stabiler Event-/Idempotenzschlüssel;
- wirksames Bewegungsdatum, tatsächliches Leistungs-/Abschlussdatum soweit verschieden, und Kalenderperiode;
- Menge vor, Bewegung (+/−) und Menge nach mit gleicher Einheit; bei Umrechnung beide Einheiten und belegte Umrechnungsbasis;
- Prozessstatus und Vorgängerbezüge für WIP; Fertigwarenfreigabe nur, wenn A02 die erforderlichen Schritte als abgeschlossen belegt;
- für jeden Korrekturdatensatz Referenz auf das Ursprungsevent und Korrekturgrund.

Eine Mengenreconciliation muss je Material/Produkt/Lagerort/Einheit die Anfangsmenge plus belegte Zugänge minus belegte Abgänge gleich der Endmenge zeigen. Reservierungen, WIP und verfügbare Fertigwaren werden als unterschiedliche physische Zustände ausgewiesen und nicht doppelt gezählt.

**Bewertung ist zusätzlich erforderlich und derzeit nicht entschieden:** Eine monetäre Bestands-, WIP- oder Fertigwarenbewertung verlangt je Eingang bzw. Produktionslos eine belegte Bewertungsbasis (Beleg, Betrag/Währung, bewertete Menge/Einheit, Preis-/Kostensatzbasis und Gültigkeits-/Periode), eine für alle Bewegungen verwendbare Bewertungsmethode und eine Reconciliation der Wertbewegungen. Für WIP müssen die in den Wert einbezogenen tatsächlichen Material-, Arbeits- und sonstigen Kosten separat belegt sein; ein Plan-BAB genügt nicht. Für COGS braucht es zusätzlich einen belegten Absatz-/Übergang von einer bestimmten bewerteten Fertigwarenmenge an den Käufer, Menge/Datum/Beleg sowie die nachvollziehbare Verbindung zum bewerteten Los bzw. zulässigen Bewertungsfluss. **Der vorliegende Auftrag erteilt keine Bewertungsmethode und keine Postingfreigabe.** Fehlt eine dieser Voraussetzungen, bleibt der Geldwert/COGS `pending_unapproved_valuation` bzw. `pending_cogs_cost_basis`.

Der bestätigte Anfangsvorrat von **12.800 €** ist nur ein Gesamtposten. Es fehlen belegte Eröffnungswerte nach Materialgruppe, insbesondere der Stahl-Vorjahresschlusswert. Daher dürfen weder Einzelwerte verteilt noch ein Stahlwert als Rest aus 12.800 € abgeleitet werden. Ein nicht quantifizierter oder nicht belegter Warenwert bleibt `pending_opening_valuation`; das schränkt keine physische Mengenevidenz ein.

D-0165–D-0168 lösen diese Bewertungsfrage nicht: SimTAX betrifft die abgegrenzte steuerpflichtige Rechnungsposition; die D-0166-Rechnung begründet keine Herstellungskosten-/COGS-Bewertung. Ein Kundenauftrag, eine Lieferung, Abnahme oder Zahlung erzeugt aus diesem Vertrag allein keinen Bestandseingang, Lagerabgang oder COGS-Posten.

## 5. Zulässige Statuswerte

Status gilt je Position bzw. Reconciliation-Bereich, damit ein fehlender BAB-Satz nicht eine belegte physische Menge unsichtbar macht:

- `ready_non_posting`: erforderliche Evidenz für genau diese nichtbuchende Berechnung ist vollständig und konsistent; keine Buchungswirkung autorisiert.
- `pending_missing_source`, `pending_missing_event_ref`, `pending_missing_event_date`, `pending_missing_period`, `pending_missing_quantity`, `pending_missing_unit`, `pending_missing_cost_basis`, `pending_missing_cost_classification`, `pending_missing_cost_center`, `pending_missing_bab_version`, `pending_missing_bab_basis`, `pending_missing_plan_snapshot`, `pending_missing_idempotency_ref`, `pending_period_assignment_review`: benannte Pflichtangabe fehlt oder eine abweichende Periodenzuordnung benötigt fachliche Klärung.
- `pending_opening_valuation`: aggregierter Eröffnungswert ohne belegte Gruppen-/Losaufteilung.
- `pending_unapproved_valuation`: Bewertungsmethode oder notwendige Ist-Kostenbasis nicht durch die vorhandenen Regeln gestützt.
- `pending_wip_completion_evidence`: Schritte/Übergaben belegen WIP, aber nicht vollständige Fertigwarenfreigabe.
- `pending_cogs_cost_basis`: Absatz/Abgang ist belegt, aber der belastbare bewertete Bestand und dessen Kostenzuordnung fehlt.
- `pending_correction_link`: Korrektur ohne Ursprungsreferenz/Grund.
- `rejected_inconsistent_units`, `rejected_inconsistent_dates`, `rejected_period_mismatch`, `rejected_duplicate_identity`, `rejected_reconciliation_mismatch`: widersprüchliche Einheit, Ereignisdatum/Periode, Chronologie/Identität oder nicht abstimmende Summen.
- `duplicate_noop`: exakt wiederholte, bereits verarbeitete Quelle; Reconciliation unverändert.
- `correction_pending`: Korrektur ist referenziert, benötigt aber eine erneute nichtbuchende Abstimmung.

Statuswerte erlauben weder Saldenmutation noch Hauptbuch-/Steuer-/Bestandsbuchung. Fehlende A03-Berechnungs- oder Posting-APIs bleiben eine Integrationssperre.

## 6. A02/A09-Akzeptanz- und Reconciliation-Fälle

Diese Fälle sind konkrete künftige Vertragsprüfungen; in diesem Dokumentationsauftrag wurden keine Tests ausgeführt:

1. **Unveränderlicher Plan vs. tatsächliche Zeit:** Ein angenommener Auftrag behält Preis-, Kosten- und BAB-Snapshot des Angebots. Ein A02-Operationsabschluss mit belegter Istzeit aktualisiert nur `actual_evidence`; Planstunden bleiben unverändert. Fehlender Istkostensatz ergibt `pending_missing_cost_basis`, niemals den Plankostensatz als Ist.
2. **D-0162-BAB-Prüfung:** Vollständige belegte Kostenpool- und Schlüsselinputs einer gemeinsamen Periode ergeben centgenaue Empfängerbeträge; Pool- und Gesamtsumme stimmen auf 0,00 € Differenz ab; Tie-break folgt stabiler Kostenstellen-ID. Kein zusätzlicher Aufwand/Cashposten entsteht durch Verteilung. Die angegebene Kalenderperiode stimmt mit dem Monat des belegten Ist-Ereignis-/Leistungsdatums überein. Ein explizit abweichender Periodengrund wird dokumentiert und bleibt bis zur fachlichen Klärung offen; eine stille Rückdatierung wird abgewiesen.
3. **BAB-Evidenzlücke:** Fehlende Periode, Kostenstelle, BAB-Version, gemeinsame physische Ratebasis oder Variabilitätsklassifikation lässt den abhängigen Ist-BAB-Bereich offen/abgewiesen; andere korrekt belegte Mengen bleiben separat darstellbar.
4. **Planabweichung:** Eine Differenz zwischen Plan- und Iststunden bzw. -kosten wird nur als Abweichung ausgewiesen. Sie überschreibt weder angenommenen Preis noch den eingefrorenen Snapshot und erzeugt keinen Erlös/OP/Cash.
5. **Mengenbestand:** Belegter Zugang/Verbrauch mit Menge und Einheit stimmt Anfang + Zugang − Abgang = Ende ab. Fehlt ein Mengenbeleg, wird kein Abgang geschätzt. Exakter Ereignis-Replay ergibt `duplicate_noop`; geänderte Quelle mit gleicher ID wird abgewiesen.
6. **12.800-€-Eröffnungswert:** Ohne belegte Materialgruppenwerte, einschließlich Stahl-Schlusswert, bleibt die Einzelbewertung `pending_opening_valuation`. Kein Agent leitet einen Restwert ab oder ändert die bestätigte Summe.
7. **WIP/Fertigware:** Abschluss nur eines erforderlichen Prozessschritts lässt Menge als WIP und verhindert Fertigwarenfreigabe/COGS. Fertigwarenfreigabe verlangt vollständige A02-Schrittbelege; sie selbst erzeugt weder Verkauf noch COGS.
8. **COGS erst mit vollständig belegter Grundlage:** Ein späteres, separates Absatz-/Versandereignis kann ohne Bewertungsmethode und eindeutig bewerteten Loswert keinen Geld-COGS-Wert erzeugen; Status bleibt `pending_cogs_cost_basis`. D-0166-Rechnung/Zahlung wird nicht als Kosten- oder Lagerbeleg recycelt.
9. **Korrektur und Idempotenz:** Eine Korrektur verweist explizit auf Originalevent und Grund. Derselbe Replay erzeugt keine doppelte Menge/Kostenposition. Korrektur ohne Gegen-/Ursprungsreferenz bleibt `pending_correction_link`.
10. **Makro-Nichtbuchungsgrenze (separater D-0169-Gate):** Die Entscheidung erlaubt ausschließlich synthetische Nachfrage-/Anfragezahländerung. Ein A02-Makroereignis darf keinerlei FinanceState-/Kosten-/Bestandsänderung auslösen. Da CP-0340 nur den Kandidaten dokumentiert und die A02-Implementierung erst separat beauftragt ist, kann A03 diese Invariante erst nach Vorlage des Codes/Regressionen fachlich reviewen; es wird hier kein PASS behauptet.

A02 liefert die Operations-/Mengen-/Zeitquellen und darf keine A03-Kostenbewertung oder Finanzsalden festlegen. A03 definiert erst bei vollständiger fachlicher Evidenz die zulässige nichtbuchende Kosten-/BAB-Auswertung; jede spätere Buchung braucht einen eigenen expliziten Auftrag und A03-Autorität. A09 prüft die obigen Invarianten unabhängig, sobald sie in einem ausführbaren Datenpfad vorhanden sind.

## 7. Offene Angaben und keine Nutzerfrage

Der Auftrag erlaubt die fachliche Evidenzstruktur, entscheidet aber nicht über eine Bewertungsmethode, tatsächliche Kostensätze, die Aufteilung des Eröffnungsvorrats, periodische Istkosten oder ein allgemeines Buchungssystem. Diese Angaben werden als offen behandelt und lösen keine Buchung aus. Für den dokumentarischen Evidenzvertrag ist keine neue Nutzerentscheidung erforderlich.

## 8. Prüfungs- und Gitstatus

- **Ausführung:** Dokumentarischer A03-Vertrag und CP-0341-Entwurf erstellt.
- **Fachreview:** A03-Selbstabgleich mit D-0162, D-0165–D-0168 sowie den T-0066-/T-0067-/T-0069-Verträgen; keine unabhängige Fachreview behauptet.
- **Unabhängige QA:** nicht ausgeführt; konkrete spätere Vertragsfälle an A09 adressiert.
- **Tests:** nicht ausgeführt (dokumentarischer Auftrag, gemäß Auftrag keine Tests). `git diff --no-index --check -- NUL <Datei>` wurde ausschließlich auf beide neuen Dateien angewandt; nach Entfernung der Markdown-Endleerzeichen blieb die Ausgabe leer (Exit 1 ist der erwartete Diffstatus gegen die leere NUL-Datei).
- **Browser-/Gerätetest:** nicht ausgeführt; für Vertragsdokumentation nicht anwendbar.
- **Makro-Re-Review:** CP-0340 zeigt Kandidatenstatus ohne Umsetzung; D-0169 legt 0,00 € direkte Makro-Finanzwirkung fest. A03-Code-/Regressionreview nach A02-Implementierung noch nicht möglich; kein PASS behauptet.
- **Git-Verifikation:** `git rev-parse --show-toplevel` erkannte den WFWSimulation-Checkout. `git status --short`/`git diff` konnten aus dieser Agentensitzung wegen `fatal: cannot come back to cwd: Permission denied` bzw. `fatal: this operation must be run in a work tree` nicht zuverlässig ausgeführt werden. Der neue Bericht und CP-0341 wurden nur zusätzlich angelegt; Fremdänderungen wurden nicht absichtlich verändert. A01 muss den Gesamtstatus im eigenen zugänglichen Checkout verifizieren.
- **Commit/Push:** nicht ausgeführt.

## 9. Übergabe

**Nächster Adressat:** A01 – MASTER_ORCHESTRATOR. A01 koordiniert T-0066/T-0067/T-0069 mit A02 und A09 anhand der nichtbuchenden Akzeptanzfälle. Bewertungs-/Postingfragen bleiben offen, bis tatsächliche belegte Werte und ein gesonderter fachlicher Auftrag vorliegen.
