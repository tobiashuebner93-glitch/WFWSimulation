# A01 – T-0112 Runtime-Lückenkarte (CP-0506)

Datum: 2026-11-06  
Status: Management-Briefing-Teilfortschritt implementiert; Kernfluss offen  
Adressat: A01 – MASTER_ORCHESTRATOR  
Ticket: T-0112  
Ziel: MG-002 / SLG-002.2

## Befund

Die Management-UX ist nicht durch reines Entfernen technischer Formulare erreichbar. Aktuell nimmt `submitRunOffer` Netto-Preis und synthetische Kosten-/BAB-Profile entgegen. Der Snapshot bindet Preis und Kalkulationsbeleg, aber keine Angebotsmenge, Einheit, Leistungsbeschreibung, Qualitäts-/Abnahmekriterien oder verbindlichen Termin. Nach Zuschlag erstellt der Orchestrator eine `customerWorkOrder` nur mit Inquiry-, Offer-, Decision-, Kunden- und Datumsreferenzen. Die anschließende `planRunOrder`-Eingabe verlangt einen separaten Vertrags-Snapshot und ein JSON-Array technischer Operationen. Damit ist die Vertragsbasis nicht durchgängig aus Angebot und Annahme reproduzierbar.

Die Produktentwicklung erzeugt aktuell eine Idee aus einem technischen Archetyp mit dessen Rezeptur und Anforderungen. Produkt- und Konzeptformulare erlauben weiterhin JSON-Schritte, manuelle Person-/Maschinen-/Materialplanung und technische Kostenquellen. Ein persistentes Management-Briefing mit Teammitglied, Kundennutzen, Zielpreis und Qualitätsziel wurde jetzt implementiert und an Produktidee/Quellereignis gebunden. Weiterhin fehlen ein Teamauftrag mit erzeugter Mitarbeitervorschau für Dauer und erreichbare Qualität sowie die Angebots-/Vertrags-/Planbrücke.

## Reihenfolge der Umsetzung

1. Ergänze ein managementtaugliches Angebot: Leistungsgegenstand, Stückzahl/Einheit, Qualitäts-/Abnahmekriterien, Preis und Termin. Binde alle Felder im Angebotsereignis und unveränderlichen Snapshot an die gewonnene Annahme. IDs und technische Planfelder bleiben generiert.
2. Modellier Annahmeabweichungen als Gegenangebot; Spieleränderung vor Annahme erzeugt eine neue Fassung. Nach Annahme sperrt die Runtime Scope, Menge und Preis; Änderungen laufen über beidseitig angenommene Nachträge. Der bestehende D-0162 Kosten-/Preis-Snapshot darf nicht mutieren.
3. Erzeuge nach Annahme einen deterministischen Plan aus Scope und vorhandenen Ressourcen: Anforderungen aus Produkt-/Auftragsprofil, geeignete qualifizierte Mitarbeitende und Anlagen, verfügbare Materialmengen, Arbeitstag-/Tageskapazität und Vorgängerfolge. Bei fehlenden Ressourcen soll die Planung mit verständlichem Engpass abbrechen und keinen Teilplan speichern.
4. Zeige Fortschritt, prognostizierten Termin, Auslastung, Risiken und Spielerentscheidungen zuerst. Technische Operationen und Belege werden als optionale Lesedetails angeboten, nie als JSON-Pflichtfeld.
5. Ergänze ein persistentes Produktbriefing: Team/Mitarbeiter, Zielsegment/Kundennutzen, Zielpreis/Preisspanne, Qualitätsziel. Die Vorschau weist klar aus, welche Materialrezeptur aus Archetyp/Teamvorschlag kommt, modellierte Dauer, erreichbare Qualität, Skills/Ausstattung und Unsicherheit. Freigabe erzeugt Produktidee/Konzept; keine automatische Produktion oder Buchung. Bestehende Kosten-/FIFO-Evidenz bleibt davon unabhängig.

## Gates und Grenzen

- T-0065-Angebots-/Kundenentscheidungsereignisse sowie T-0066-Betriebsmittel-/Material-/Assignment-Belege unverändert oder mit kompatiblem Revisionspfad erhalten.
- A03 prüft Snapshot, Preis, Mengen- und Finanzgrenze. A08 prüft aktuellen BGB-Vertragstyp je vereinbartem Leistungsgegenstand. A09 reviewt Gegenangebote, Replay, Nachtrags-/Freeze-Manipulation, Ressourcenfehler und UI. A05 prüft Managementdarstellung.
- Der Produktbriefing-UI-/Persistenzslice ist implementiert. Regressionen, Browser- oder Mobilprüfung wurden nicht ausgeführt. Kein Architektur-/Schema-/Finanz-/Rechts-/Release-PASS. T-0112 bleibt offen.
