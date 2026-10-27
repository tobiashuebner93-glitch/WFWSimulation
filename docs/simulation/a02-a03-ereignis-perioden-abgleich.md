# Gemeinsamer A02/A03-Abgleich – Ereignis- und Periodenübergaben

Datum: 2026-10-27
Fachrollen: A02 – SIMULATION; A03 – ACCOUNTING_FINANCE (fachlicher Review)
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0010 / CP-0148–CP-0154

## Abgestimmte Regeln

- Kundenzahlungseingänge werden am vertraglichen Fälligkeitstag vollständig ausgelöst, sofern kein ausdrücklich gesetztes Verspätungsereignis greift. Sie hängen nicht von der Liquidität des Unternehmens ab (D-0110; A03 §§ C/G).
- Eigene fällige Lieferanten-/Gläubigerposten erhalten einen automatischen Vollzahlungsversuch. Kein Teilbetrag und kein negativer Cashbestand; Fehlschlag lässt den vollen OP offen (D-0024–29; A03 §§ D/G).
- Der Spieler wählt die Reihenfolge eigener fälliger Rechnungen (D-0021). Das regelt nur die Rangfolge der Auszahlungen untereinander, nicht deren Reihenfolge gegenüber Kundeneingängen.
- Dispositionskredit ist eine angebotene Option, kein automatischer oder bereits verfügbarer Cashpuffer. Limit, Verfügbarkeit, Ziehung und Rückzahlung bleiben offen (D-0021–23). Ohne diese Regeln wird kein Draw angenommen.
- Die Tagesphasenfolge bleibt unverändert. Kundeneingänge, eigene Zahlungsversuche, Retries, Dunning und Darlehenszahlungsereignisse gehören zur bestehenden Phase 8. Finanzielle Ergebnisse/OP-/Cashwirkungen liefert autoritativ A03; A02 ordnet auslösende Simulationsereignisse ein.
- Nach einem fehlgeschlagenen eigenen Fälligkeitsversuch folgen acht wöchentliche Retries; Niederlage nach dem achten erfolglosen Retry. Erinnerung nach 10 Kalendertagen ab erstem Fehlschlag, formelle Mahnung weitere 14 Kalendertage später, sofern offen. D-0029 schließt allgemeine Pfändung/Liquidation in V1 aus (D-0024–29).
- Der Maschinenkredit bleibt ein separater Fluss: nicht gezahlte Rate führt sofort zu Verzug und wöchentlichen Wiederholungsversuchen; Verwertung bei insgesamt drei nicht gezahlten Raten. Die genaue Zähl-/Auslöseauslegung bleibt offen (D-0042/43).
- Nach D-0011 werden auf Wochenenden fallende geplante Ereignisse auf den nächsten Arbeitstag verschoben; Feiertage werden nicht berücksichtigt. Ausgelöste Ereignisse tragen den verschobenen Arbeitstag als wirksames Simulationsdatum. Bei einer Verschiebung in den Folgemonat bleibt die Zuordnung zur Monats-/Buchungsperiode offen; es erfolgt keine Rückdatierung.
- D-0033 bestimmt den monatlichen Fälligkeitstag als letzten Arbeitstag; für Januar 2027 ist dies der 29.01.2027. Dieser Fälligkeitstermin ist vom Beginn des tatsächlichen Ratenplans/Zahlungsdatums und der Annuitätenhöhe zu trennen; erster tatsächlicher Zahlungstermin und Rate bleiben nach D-0032/33 und CP-0149/0154 offen.

## Echte offene Abhängigkeiten

1. **Nutzerentscheidung für deterministische Zahlungswirkung:** Wenn Kundeneingang und eigene Fälligkeiten am selben Tag eintreten und die Liquidität knapp ist: steht der Kundeneingang vor den vom Spieler priorisierten eigenen Vollzahlungsversuchen zur Verfügung oder erst danach? Keine bestehende Regel entscheidet dies; das Ergebnis bestimmt, welche eigenen Rechnungen bezahlt werden. Bitte A01 bündelt diese eng gefasste Frage mit dem Nutzer.
2. **A02/A03-Ereignisdetail:** Reihenfolge von zusammenfallenden Retry-, Erinnerungs- und Mahnereignissen; genaue Zählung/Verwertungszeitpunkt des dritten nicht gezahlten Maschinenkredit-Ratenereignisses. Keine Tie-Break-Regel ergänzt.
3. **A02/A03-Periodendetail:** Monatszuordnung eines wirksam durch Wochenendverschiebung in den Folgemonat versetzten Finanzereignisses. Kalenderereignisdatum ist der nächste Arbeitstag; Periodenregel ist nicht beschlossen.
4. **Finanzierungsdaten:** erster tatsächlicher Darlehenszahlungstermin und Annuitätenhöhe bleiben eigenständige offene Werte.
5. **Vorräte:** 12.800 € bleibt bestätigter Gesamtbilanzwert (CP-0154). Die Einzelgruppenwerte einschließlich Stahl-Vorjahresschluss sind noch nicht übergeben/bestätigt; A02 und A03 ergänzen keinen Differenzwert. Die bedingte Nutzerfrage zur Abweichung ist noch nicht entscheidungsreif und wird erst gestellt, wenn belegte Einzelwerte tatsächlich nicht 12.800 € ergeben.
6. **Dispositionskredit:** Option bestätigt; Limit, Verfügbarkeit, Ziehung und Rückzahlung offen. Sie begründet aktuell keine automatisch verfügbare Liquidität.

## Betroffene Unterlagen und Grenzen

A02-Spezifikation in Phase-8-/Zeit-/Periodenabschnitten aktualisiert. A03-Finanzspezifikation wurde geprüft; § C/G, Dunning, Darlehensabschnitt und CP-0154 enthalten die Finanzregeln und offenen Punkte bereits, daher keine A03-Datei geändert. Dieser Bericht, CP-0155 und Collaboration State dokumentieren die gemeinsame Abstimmung. Keine Änderung an Decision Log, Ticket Board, D-0010, Datenmodell, Code, Schema, Datenbank oder Architektur. Kein Commit/Push.

Prüfungen: `git diff --check` und `git status --short --branch`.
