# A03-Änderungsbericht CP-0024: Fälligkeitsversuch und Dunning

Datum: 2026-09-26  
Agent: A03 – ACCOUNTING_FINANCE  
Bezug: MG-000 / SLG-000.2 / CP-0020 bis CP-0023 / A09-Re-Review HIGH-2 FAIL

## Änderung

Die Finanzspezifikation wurde an die bestätigte Regel des automatischen Vollzahlungsversuchs am Fälligkeitstag und den bestätigten V1-Mahn-/Dunning-Fluss bei Fehlschlag angepasst.

Korrigiert wurden folgende veraltete Aussagen:

- § C schloss Mahn-/Inkassologik aus. Nun führt ein fehlgeschlagener automatischer Vollzahlungsversuch bei fortbestehendem vollem offenem Posten in den bestätigten V1-Mahn-/Dunning-Fluss.
- § D ließ Zahlungsausgänge am Fälligkeitstag ohne weitere Zahlungssteuerungsentscheidung offen und schloss Mahnlogik aus. Nun ist der Vollzahlungsversuch bestätigt; Zahlung, Liquiditätsänderung und Schließung des offenen Postens treten nur bei Erfolg ein.
- § G stellte automatische Zahlung bei Fälligkeit oder Spieleraktion als offene Produktentscheidung dar. Diese Darstellung wurde durch den bestätigten automatischen Vollzahlungsversuch und das Verhalten bei ausreichender bzw. unzureichender Liquidität ersetzt.
- § K erklärte Mahnlogik für entbehrlich und automatische versus spielergesteuerte Zahlung für offen. Auch das wurde an den bestätigten V1-Ablauf angepasst.
- Die offene-Entscheidungen-Tabelle, der Übergabeeintrag zu Zahlungsereignissen und der Abschlussabschnitt wurden entsprechend bereinigt.

Die Spezifikation trennt ausdrücklich Fälligkeit, Zahlungsversuch, tatsächliche Zahlung, Liquiditätswirkung, offenen Posten und Mahnstatus. Ein Fehlversuch erzeugt keine Teilzahlung, keine negative Liquidität und keine Liquiditätsbewegung; der vollständige Betrag bleibt offen. Bei Erfolg wird vollständig gezahlt und der Posten geschlossen.

## Weiterhin offen

- Priorität konkurrierender fälliger Zahlungen.
- Retry-Zeitpunkt und Retry-Fristen.
- Konkrete Mahnfristen, Schwellen und Eskalationsparameter.
- Abschreibung/Forderungsausbuchung als eigener Vorgang.
- Darlehensspezifischer Zahlungsplan, Fälligkeiten und Behandlung einer nicht zahlbaren Rate.

Es wurden keine Mahnfristen, Retry-Regeln, Schwellenwerte, Gebühren oder rechtlichen Details ergänzt. Eröffnungsbilanz, Darlehensmodell, SimTAX und Kostenrechnung wurden inhaltlich nicht verändert; die darlehensspezifisch offenen Zahlungsplanparameter bleiben ausdrücklich getrennt von der OP-Regel.

## Umfang und Prüfung

Nur die A03-Finanzspezifikation, dieser Änderungsbericht, CP-0024 und der Checkpoint-Eintrag im Collaboration-State werden geändert. Keine Implementierung, Datenbankänderung, Migration oder Architekturänderung; D-0010 bleibt unverändert. Architektur V0.2 und ADRs bleiben PROPOSED.

`git diff --check` und `git status` werden nach den Dokumentänderungen ausgeführt.
