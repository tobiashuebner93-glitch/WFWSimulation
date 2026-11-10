# V3 – Zehn binäre Minimalziele je offenem Ticket

**Stand:** 2026-11-01, Fortschreibung CP-0470 (Entwurf)  
**Geltung:** Die fünf in der letzten Nutzerbewertung als offen geführten Tickets T-0063, T-0065, T-0066, T-0067 und T-0069.  
**Zweck:** Jedes Ticket hat genau zehn einzeln zu bewertende PASS/FAIL-Kriterien. Das Ticket-Minimalziel ist nur bei **10/10 PASS** erreicht. Fehlender, nicht reproduzierbarer oder nicht unabhängig geprüfter Nachweis zählt als FAIL. Diese Zieldefinition behauptet keinen Implementierungs-PASS und schließt keine Tickets.

## Gemeinsame Bewertungsregeln

- Jeder Testfall nennt Run-/Profil-ID, Seed, Version und konkrete Assertion oder UI-Aktion.
- Gleiche Eingaben müssen fachlich identische Ergebnisse liefern.
- Manipulierte oder unzulässige Eingaben müssen fail-closed und ohne Teilmutation enden.
- A01 dokumentiert und integriert; A01-Selbstreview ersetzt keinen erforderlichen Fachreview.
- Planwerte, Vertragswerte, Istwerte und Buchungen bleiben getrennt. Fehlende Belege bleiben `pending`; es werden keine Beträge oder Rechtsfolgen erfunden.
- Bestehende Detailkriterien bleiben verbindlich, insbesondere T-0066 G1–G10 und T-0067-Fachvertrag in `a01-t0066-t0067-mindestziele.md` sowie das T-0063-Kanalregister in `a01-v3-ticket-ausarbeitungsplan.md`.

## T-0063 – Makroökonomie: 10 Kriterien

1. **Quellenprovenienz:** 100 % der verwendeten beobachteten Eingaben besitzen Quelle, Reihen-ID, Einheit, Beobachtungsdatum, Veröffentlichungs-/Abrufstand und Revisionsstatus oder sind explizit als synthetisch markiert.
2. **Vier Konjunkturphasen:** Aufschwung, Boom, Abschwung und Tiefstand sind unterscheidbar; jede Phase wird in einem festen, reproduzierbaren 12-Monatslauf erreicht und protokolliert.
3. **Außenwirtschaftskanäle:** Mindestens drei getrennte Kanäle sind modelliert; mindestens zwei verändern in kontrollierten Tests eine echte Firmenvariable oder Spieloption. Pro Kanal bestehen Null- und Wirkungsfall.
4. **Politikfelder:** Für Geld-, Finanz-, Wachstums-, Tarif-, Arbeitsmarkt-, Umwelt-, nachfrageorientierte und angebotsorientierte Politik existiert je ein unterscheidbares Ereignis mit Zielvariable, Wirkungspfad und Lag.
5. **EZB:** Je ein dokumentiertes Zinserhöhungs- und Zinssenkungsereignis wirkt nachweisbar über den festgelegten Kanal auf eine Finanzierungsgröße und mindestens einen weiteren Makro-/Betriebsindikator.
6. **Inflationsmessung:** Indexkorb, Basisperiode, Gewichte, Einheiten und Aktualisierung sind dokumentiert; Monats- und Jahresrate bestehen gegen drei feste Rechenvektoren (konstant, Preisänderung, Basiswechsel) mit dem spezifizierten Rundungsverfahren.
7. **Operative Wirkung:** Für jeden als wirksam gewerteten Kanal ändert ein kontrolliertes Paar ausschließlich die vorgesehene Spielvariable; mindestens ein neutraler Gegenfall bleibt unverändert.
8. **Zeit und Replay:** Wirksamkeitsdatum, Periode und Lag werden je Kanal geprüft; Save/Restore und Replay erzeugen dieselbe Historie und keine doppelte Wirkung.
9. **Finanzgrenze:** Kein Makroinput erzeugt ohne separates belegtes Folgeereignis Vertrag, Istkosten, Cash, Steuer, Forderung, Verbindlichkeit oder Ledgerbuchung; Regressionen prüfen diese Invarianten.
10. **Fachabnahme:** A08 bestätigt Quellen/Klassifikation, A02 Modell/Replay, A03 Finanzgrenze und A09 unabhängig alle neun vorherigen Kriterien; A05 belegt die Anzeige der Herkunft, Annahmen und Wirkung im V3-UI.

## T-0065 – Markt und Angebote: 10 Kriterien

1. **Kundensegmente:** Mindestens drei Segmente mit unterscheidbarer Preisempfindlichkeit und mindestens einem weiteren Auswahlmerkmal; je Segment existiert ein kontrollierter Angebots-/Fitfall.
2. **Konkurrenz:** Mindestens drei Wettbewerber besitzen unterscheidbare Preis-, Ruf- oder Kapazitätsprofile; ein Paarvergleich zeigt die vorgesehene Auswirkung jedes Profils.
3. **Reproduzierbarkeit:** Drei Läufe derselben 20-Arbeitstage-Fixture mit identischem Seed ergeben identische Anfragen, Konkurrenzereignisse und Entscheidungen.
4. **Anfrageverteilung:** In einem 20-Arbeitstage-Lauf entstehen passende Anfragen an mindestens vier verschiedenen Wochentagen; jede Anfrage speichert Größe, Fähigkeiten, Frist und Segment/Kundenprofil.
5. **Angebotslebenszyklus:** Je ein Testfall endet in Annahme, Ablehnung und Fristablauf; Entscheidungsverzug beträgt 1–3 Tage und abgelaufene Anfragen werden nicht mehr angeboten.
6. **Zuschlagslogik:** Kontrollierte Paare belegen die Wirkungsrichtung von Preis, Ruf, Segmentpassung und verfügbarer Kapazität auf Einladung/Zuschlag; kein einzelner Faktor wird als garantierter Zuschlag dargestellt.
7. **Konkurrenzbericht:** Monatsbericht gibt Mittelpreise für mindestens drei Auftragsgrößen korrekt aus; Einzelgebote sowie nicht belastbare Mittelwerte bei zu kleiner Stichprobe bleiben verborgen.
8. **Wirtschaftlichkeit:** Positiver, centnaher und negativer DB-I-Fall stimmen mit der T-0067-Routine centgenau überein; negatives Angebot kann vor Einreichung abgelehnt werden.
9. **Vertragspreis:** Vor Einreichung änderbarer Preis wird beim Zuschlag unveränderlich; nach Annahme scheitern UI- und Engineversuche einer Preisänderung ohne Mutation.
10. **Integrität und Review:** Save/Restore, Wiederholung und manipulierte Inquiry-/Award-Referenzen bestehen Idempotenz-/Fail-closed-Tests; A02, A03, A05 und A09 dokumentieren ihre jeweiligen Reviews, A01 belegt den Browserpfad.

## T-0066 – Produktivität und eigene Produkte: 10 Kriterien

Die folgenden Kriterien entsprechen inhaltlich den bestehenden Gates G1–G10; die ausführlichen Gleichungen, Randbedingungen und Evidenzanforderungen in `a01-t0066-t0067-mindestziele.md` bleiben normativ.

1. **Zwei Produktlebenszyklen:** Zwei verschiedene Produkte durchlaufen Definition, Kalkulation, Planung, Fertigstellung, Angebot und Käuferentscheidung; ein positiver und ein unwirtschaftlicher Fall werden tatsächlich angenommen und versandt.
2. **Qualifikation:** Kontrolliertes qualifiziertes/unqualifiziertes Paar; fehlender Skill blockiert Planung ohne Zustands- oder Ressourcenmutation.
3. **Motivation:** Kontrolliertes Paar ändert nur Motivation und weist die spezifizierte Änderung von Produktivitätsfaktor und Planstunden nach; abgeschlossene Blöcke tragen modellierte Zeitbelege.
4. **Ausstattung:** Kontrolliertes Paar belegt Produktivitätswirkung geeigneter Ausstattung; fehlende Pflichtausstattung blockiert fail-closed.
5. **Kapazitätskonkurrenz:** Kundenauftrag und beide Produkte teilen Person, Maschine, Material und Fertigwarenlager; die vier separaten Überlastungsfälle werden ohne Teilmutation abgewiesen und ein zulässiger Fall besteht.
6. **Ablauf und Wiederherstellung:** Prozessfolge, Arbeitstagsregeln, Save/Restore, stabile IDs, idempotenter Replay und Zurückweisung widersprüchlicher/manipulierter Bewegungen bestehen.
7. **Erfolgs-/Verlustfall vor BAB:** Mit explizitem Netto-Preis und belegten direkten Produktkosten ist der Plan-DB I im positiven Fall > 0 Cent und im unwirtschaftlichen Fall < 0 Cent; es wird kein Ergebnis nach BAB behauptet.
8. **Kalkulations-Snapshot ohne BAB:** Eingaben, Einheiten, Quellen, Rundung und Version bleiben über Änderung und Restore unverändert; BAB/Vollkostenstatus ist ausstehend und wird nicht aus Planwerten simuliert.
9. **Mengen-, Kapazitäts- und Zeitbelege:** Physischer Bestand, Reservierung, Quarantäne, Versand/Rücklauf und Lagerkapazität stimmen je SKU/Lot nach den festgelegten Roll-forward-Gleichungen; Zeitbeleg enthält Assignment/Quelle/Datum/Periode.
10. **FIFO-Mengenabgang und Kostenabgrenzung:** Beide angenommenen Produktverkäufe stimmen Menge und unveränderlichen Snapshot mit Versand und physischem Lager-Roll-forward ab. Weil BAB und Ist-Kostensatzbasis später entwickelt werden, bleibt `cogsStatus` bis dahin explizit `pending_deferred_bab`; Versand ist möglich, aber vollständiges COGS wird nicht behauptet oder gebucht. A03 bestätigt die Finanzgrenze, A09 prüft unabhängig Mengen-/Status-/Restore-Invarianten, A05 UI-Regression und A01 Browser-Smoke bestehen.

## T-0067 – Kalkulation und BAB: 10 Kriterien

1. **Pflichteingaben:** Mindestens drei wesentliche Werte aus Nettoverkaufspreis, Menge/Material, Zeit/Leistung, Kostensatz und BAB-Pool/Treiber müssen eingegeben oder aktiv bestätigt werden.
2. **Validierung:** Fehlende, nicht endliche, negative oder dimensional unpassende Pflichtwerte blockieren die Kalkulation mit verständlicher Meldung; kein stiller Default wird verwendet.
3. **DB-I-Vektoren:** Feste Rechenfälle ergeben DB I > 0 Cent, DB I zwischen −1 und +1 Cent sowie DB I < 0 Cent; Ergebnisse entsprechen D-0162 centgenau.
4. **Produktrechnung:** Mindestens ein eigener Produktfall weist direkte Einzelkosten, DB I und Ergebnis nach BAB getrennt aus und stimmt mit T-0066-Snapshot überein.
5. **Poolverteilung:** Für jeden Kostenpool und jede Periode beträgt `Summe(Empfänger) − Quellpool` exakt 0 Cent.
6. **Rundungsrest:** Rundungsrest wird nach festem Tie-breaker deterministisch verteilt; veränderte Eingabereihenfolge verändert das Ergebnis nicht.
7. **Live-Neuberechnung:** Änderung jeder Eingabe aktualisiert alle abhängigen offenen Planwerte; automatisierte Regression prüft mindestens je einen Eingabewert pro Kategorie.
8. **Snapshot-Freeze:** Abgegebene und angenommene Angebots-/Produkt-Snapshots behalten Preis, Version, Periode, Annahmen und Rechenergebnis trotz späterer Planänderung und Save/Restore bei.
9. **Plan-/Ist-/Finanzgrenze:** Planwerte werden nie als Istkosten, COGS, Cash oder Ledger ausgewiesen; unvollständige Istquellen bleiben `pending`, vollständige Istbuchung verlangt den spezifizierten Ereignis-/Quellenbeleg.
10. **Integration und Review:** T-0065-Angebot und T-0066-Produkt nutzen dieselbe freigegebene Rechenroutine; A03 prüft fachlich, A09 unabhängig Rundung/Manipulation/Replay, A05 UI-Regression und A01 den Browserpfad.

## T-0069 – Integration und Jahresgate: 10 Kriterien

1. **Vier Jahresprofile:** Vier vorab fixierte Konjunkturprofile durchlaufen jeweils mindestens zwölf Simulationsmonate bis zum dokumentierten Enddatum; Timeout, Abbruch oder übersprungener Tag = FAIL.
2. **Wiederholung:** Jedes Profil wird mit gleichem Seed zweimal ausgeführt; fachlicher State-/Event-Hash und Tages-/Monatsresultate sind identisch.
3. **Ergebnisvielfalt:** Mindestens ein tragfähiger und ein wirtschaftlich scheiternder Verlauf entstehen; beide Ursachen sind durch konkrete Spielerentscheidungen und Kennzahlen erklärbar.
4. **Tages-/Ereignisvollständigkeit:** Erwartete Simulationstage und Tagesphasen werden lückenlos protokolliert; kein doppeltes, verlorenes oder rückdatiertes Ereignis bleibt ungeklärt.
5. **Auftrags-/Produktfluss:** Aufträge und Eigenprodukte stimmen von Anfrage/Angebot über Planung, Produktion, Fertigbestand, Abnahme/Versand bis zum jeweiligen Abschluss mengen- und statusgenau ab.
6. **Material-/Bestandsabgleich:** Material, Fertigware, Reservierung, Quarantäne und Lagerkapazität erfüllen die jeweiligen Roll-forward-Gleichungen an jedem Monatsende; ungeklärte Differenz = FAIL.
7. **Finanzabgleich:** Rechnungen, Forderungen/Verbindlichkeiten, Kundeneingänge, Auszahlungen, Bank/Dispo, Steuern und Ledger stimmen nach geltendem Simulationsvertrag und Periodenzuordnung ab; unbelegte Buchung oder ungeklärte Differenz = FAIL.
8. **Fehlerfreiheit und Recovery:** Kein Lauf endet mit technischer Ausnahme, unzulässigem Negativbestand, Doppelbuchung oder unvollständigem Save/Restore; mindestens ein Save/Restore-und-Fortsetzen-Fall je Profil besteht.
9. **Laufzeit:** Vor dem Lauf wird eine konkrete maximale Laufzeit pro Profil und Zielumgebung im Ticket festgeschrieben; alle vier Läufe bleiben darunter und protokollieren Laufzeit, Validierungszahl und Abbruchstatus.
10. **Browser-/Unabhängigkeitsgate:** Kernpfade Start, Angebot, Planung/Produktion, Lager/Beschaffung, Finanzen und Lernen bestehen bei 390×844 sowie 768×1024 ohne abgeschnittene Aktion, horizontales Seitenoverflow oder Browserfehler; A09 prüft Jahres-/Abstimmungsbelege unabhängig, A12 dokumentiert die Browserprüfung.

## Status und Abgrenzung

- T-0066 übernimmt die zehn Gates in derselben Zählung. Die Gate-10-Abgrenzung ist mit dem Nutzerhinweis aus CP-0472 angepasst: V3 prüft FIFO-Mengenfluss und lässt vollständiges COGS bis zur späteren BAB-/Ist-Kostensatzbasis pending. CP-0471 bleibt als historischer Befund unverändert; der neue Implementierungs-/Reviewstand ist in CP-0472 dokumentiert.
- Die jeweils zehn Kriterien sind Mindestziele, keine Aussage, dass das Ticket bereits umgesetzt oder reviewt wurde. Für jedes Ticket gilt genau 10/10.
- T-0064 und T-0068 gehörten nicht zu den fünf offenen Tickets der letzten Nutzerbewertung. Ihre Status müssen vor V3-Gesamtabnahme weiterhin gegen aktuelle Einzelbelege geklärt werden; diese Festlegung schließt sie nicht.
- Kein Produktentscheid, keine Architektur-/Schemafreigabe, keine Implementierung, kein Commit und kein Push wird mit dieser Zieldefinition verbunden.
