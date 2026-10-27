# Gemeinsamer A02/A03-Abgleich – Ereignis- und Periodenübergaben

**Historischer Bestandsstand:** Die Vorrats- und Dispo-Startwerte aus CP-0155 wurden für den V1-Prototyp durch D-0128/CP-0181 aktualisiert. Die übrigen hier dokumentierten Ereignis-/Periodenabstimmungen bleiben als damaliger Fachstand erhalten.

Datum: 2026-10-27
Fachrollen: A02 – SIMULATION; A03 – ACCOUNTING_FINANCE (fachlicher Review)
Adressat: A01 – MASTER_ORCHESTRATOR
Bezug: MG-000 / SLG-000.2 / T-0008 / T-0010 / CP-0148–CP-0154

## Abgestimmte Regeln

- Kundenzahlungseingänge werden am vertraglichen Fälligkeitstag vollständig ausgelöst, sofern kein ausdrücklich gesetztes Verspätungsereignis greift. Sie hängen nicht von der Liquidität des Unternehmens ab (D-0110; A03 §§ C/G).
- Eigene fällige Lieferanten-/Gläubigerposten erhalten einen automatischen Vollzahlungsversuch. Kein Teilbetrag und kein negativer Cashbestand; Fehlschlag lässt den vollen OP offen (D-0024–29; A03 §§ D/G).
- Der Spieler wählt die Reihenfolge eigener fälliger Rechnungen (D-0021). Das regelt nur die Rangfolge der Auszahlungen untereinander, nicht deren Reihenfolge gegenüber Kundeneingängen.
- Bei Kundeneingängen und eigenen fälligen Zahlungen am selben wirksamen Simulationstag werden zuerst alle Kundeneingänge gebucht; anschließend werden eigene Vollzahlungsversuche in der Spielerreihenfolge mit Liquiditätsprüfung verarbeitet (D-0120). Das ist eine deterministische V1-Regel und keine allgemeine Rechts- oder Bankregel.
- Dispositionskredit ist eine angebotene Option und wird nicht automatisch gezogen. D-0123/24 setzen den Höchstbetrag auf 10 % der Bilanzsumme zum Ende des Vorquartals, wirksam ab dem ersten Tag des Folgequartals; zum Start sind dies 5.530 €. D-0125 erlaubt bei knapper Liquidität einen manuellen Abruf exakt des Fehlbetrags, soweit der freie Rahmen reicht; andernfalls scheitert die Vollzahlung ohne Teilzahlung. Kundeneingänge tilgen nach D-0126 einen bestehenden Disposaldo automatisch zuerst bis zur Höhe des Eingangs; nur der Rest wird freie Liquidität. Nach D-0127 wird der Dispozins täglich auf den gezogenen Saldo berechnet und am Monatsende einmalig als Sammelposten belastet. Tageszählbasis, Rundungszeitpunkt und Buchungsreihenfolge am Monatsende sowie Rückführung aus anderen Eingangstypen bleiben offen.
- Die Tagesphasenfolge bleibt unverändert. Kundeneingänge, eigene Zahlungsversuche, Retries, Dunning und Darlehenszahlungsereignisse gehören zur bestehenden Phase 8. Finanzielle Ergebnisse/OP-/Cashwirkungen liefert autoritativ A03; A02 ordnet auslösende Simulationsereignisse ein.
- Nach einem fehlgeschlagenen eigenen Fälligkeitsversuch folgen acht wöchentliche Retries; Niederlage nach dem achten erfolglosen Retry. Erinnerung nach 10 Kalendertagen ab erstem Fehlschlag, formelle Mahnung weitere 14 Kalendertage später, sofern offen. D-0029 schließt allgemeine Pfändung/Liquidation in V1 aus (D-0024–29).
- Der Maschinenkredit bleibt ein separater Fluss: nicht gezahlte Rate führt sofort zu Verzug und wöchentlichen Wiederholungsversuchen; Verwertung bei insgesamt drei nicht gezahlten Raten. Die genaue Zähl-/Auslöseauslegung bleibt offen (D-0042/43).
- Nach D-0011 werden auf Wochenenden fallende geplante Ereignisse auf den nächsten Arbeitstag verschoben; Feiertage werden nicht berücksichtigt. Ausgelöste Ereignisse tragen den verschobenen Arbeitstag als wirksames Simulationsdatum. Bei einer Verschiebung in den Folgemonat bleibt die Zuordnung zur Monats-/Buchungsperiode offen; es erfolgt keine Rückdatierung.
- D-0033 bestimmt den monatlichen Fälligkeitstag als letzten Arbeitstag; D-0121 legt die erste tatsächliche Rate auf den 29.01.2027. Bei sieben Jahren Restlaufzeit ergibt das 84 Monatsraten bis Dezember 2033. Die Rate ist durch A03 zu berechnen.

## Echte offene Abhängigkeiten

1. **A02/A03-Ereignisdetail:** Reihenfolge von zusammenfallenden Retry-, Erinnerungs- und Mahnereignissen; genaue Zählung/Verwertungszeitpunkt des dritten nicht gezahlten Maschinenkredit-Ratenereignisses. Keine Tie-Break-Regel ergänzt.
2. **A02/A03-Periodendetail:** Monatszuordnung eines wirksam durch Wochenendverschiebung in den Folgemonat versetzten Finanzereignisses. Kalenderereignisdatum ist der nächste Arbeitstag; Periodenregel ist nicht beschlossen.
3. **Finanzierungsdaten:** erster tatsächlicher Darlehenstermin ist mit D-0121 entschieden. Die konkrete Annuitäten-/Anfangsrate und die Schlussrate sind von A03 anhand der bestätigten Vertragsparameter zu berechnen.
4. **Vorräte:** 12.800 € bleibt bestätigter Gesamtbilanzwert (CP-0154). Die Einzelgruppenwerte einschließlich Stahl-Vorjahresschluss sind noch nicht übergeben/bestätigt; A02 und A03 ergänzen keinen Differenzwert. Die bedingte Nutzerfrage zur Abweichung ist noch nicht entscheidungsreif und wird erst gestellt, wenn belegte Einzelwerte tatsächlich nicht 12.800 € ergeben.
5. **Dispositionskredit:** D-0123/24 bestätigen 10 % der Vorquartals-Bilanzsumme, wirksam zum Quartalsbeginn (Startwert 5.530 €). D-0125 erlaubt manuelle Ziehung genau des Fehlbetrags bis zum freien Rahmen. Automatische Rückführung aus Kundeneingängen ist nach D-0126 entschieden. D-0127 legt tägliche Berechnung und einmalige Monatsendbelastung als Sammelposten fest; Tageszählbasis, Rundungszeitpunkt, Buchungsreihenfolge und Rückführung aus anderen Eingangstypen bleiben offen. Kein automatischer Draw.

## Betroffene Unterlagen und Grenzen

A02-Spezifikation in Phase-8-/Zeit-/Periodenabschnitten aktualisiert. A03-Finanzspezifikation übernimmt D-0120 und D-0121. Dieser Bericht und Collaboration State dokumentieren die Abstimmung. Keine Änderung an D-0010, Datenmodell, Code, Schema, Datenbank oder Architektur. Kein Commit/Push.

Prüfungen: `git diff --check` und `git status --short --branch`.

## A01-Koordinierungsfortschreibung (CP-0182)

Für V1 konkretisiert D-0129 die Gleichzeitigkeit: Kundeneingänge werden zuerst gebucht und tilgen Dispo gemäß D-0126; anschließend folgt die Maschinenrate, danach eigene fällige Rechnungen in Spielerreihenfolge. Erinnerungen/Mahnungen werden nur nach dem Zahlungsversuch für weiter offene Posten ausgelöst. Wochenendverschobene Vorgänge gehören zum Monat ihres wirksamen Simulationstags. Dispozinsen werden nach Actual/365 täglich ohne Tagesrundung berechnet und am Monatsende als einmalig cent-gerundeter Sammelposten gebucht. Diese Regeln sind deterministische Spielkonventionen, keine allgemeine Bank- oder Rechtspriorität.
