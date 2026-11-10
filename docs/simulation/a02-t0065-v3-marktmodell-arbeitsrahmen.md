# A02-Arbeitsrahmen – T-0065 V3-Marktmodell

**Status:** Arbeitsentwurf / unabhängige Teilphase
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Fachrolle:** A02 – SIMULATION
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.2
**Ticket:** T-0065
**Stand:** 2026-10-31
**Preflight:** AGENTS.md, Agentenstruktur/Rechte, Goals, Ticket Board, Collaboration State, Decision Log, V3-Zielkarte, V2-Marktspezifikation und Git-Status geprüft.
**Abhängigkeiten:** T-0063 (Makro-/Konjunkturparameter); T-0064 nur, wenn ein Marktfall Rechtsform-/Gründungsregeln benötigt; Kostenabgleich mit T-0067.

Gemeinsame Schnittstellen, Ereignisfolge, Szenario-Fixtures und A05/A06/A09-Handoffs: [A02-Integrationsvertrag T-0063/T-0065/T-0066](a02-v3-t0063-t0065-t0066-integrationsvertrag.md).

## Zweck und Abgrenzung

Dieser Entwurf beschreibt den von V3 geforderten Markt-/Angebotskreislauf und markiert die Übergaben. Er ist keine Implementierung, keine neue Nutzerentscheidung und keine Marktprognose. Bestehende V2-Profile und die abgenommene V2-Version bleiben unverändert. Die vorhandenen V2-Regeln und historischen Entscheidungsbelege D-0136 bis D-0142 gelten nur innerhalb ihres dokumentierten Versionsumfangs; ihre konkreten Frequenzen, Gewichte und Preise werden nicht ungeprüft als V3-Werte übernommen.

## Fachlicher Kreislauf

1. **Marktbedarf:** Ein deterministischer Szenariolauf erzeugt einen Bedarf mit Zeitstempel, Auftragsgröße, technischer Anforderung, Angebotsfrist und Kundenprofil. Der Generator nimmt die Makro-/Konjunkturlage aus T-0063 als Eingabe, nicht als versteckte Konstante.
2. **Kundensegmente:** Mindestens drei Segmente unterscheiden sich anhand dokumentierter Preisempfindlichkeit und wenigstens eines weiteren Kriteriums (z. B. Lieferzeit, Qualität oder Beziehung). Segmentmerkmale verändern Einladung, Bewertung oder Zuschlagschance nach einer nachvollziehbaren, testbaren Regel.
3. **Passende Einladungen:** Ein Unternehmen wird nur eingeladen, wenn sein Kompetenz-/Kapazitätsprofil und die Anfrage zusammenpassen. Reputation, relative Preisposition und verfügbare Kapazität beeinflussen die Einladung beziehungsweise Teilnahmechance. Die exakte Kalibrierung bleibt offen bis T-0063 und kontrollierte Paarvergleiche vorliegen.
4. **Wettbewerber:** Mindestens drei fiktive Wettbewerber unterscheiden sich in Reputation, Kapazitäts-/Lieferprofil und Angebotsstrategie. Ihre Einzelangebote bleiben im Spielerfluss verborgen. Seed und Eingaben müssen Ergebnisse reproduzierbar machen; synthetische Werte werden als Spielmodell kenntlich gemacht.
5. **Eigenes Angebot:** Vor Einreichung kann der Spieler den Nettoplanpreis `R` und Angebotsannahmen bearbeiten. Für V3 enthält `R` keine SimTAX-Komponente; D-0160 bleibt V2-only. Die Kostenübergabe von T-0067 weist DB I ausschließlich nach ausdrücklich variablen Einzelkosten aus; direkte Arbeits- und Maschinenkosten werden getrennt gezeigt, ebenso das Ergebnis nach direkten Einzelkosten. Ein negatives Ergebnis bleibt sichtbar und darf angeboten oder abgelehnt werden; es wird nicht automatisch verhindert. DB I von −0,01 € bis einschließlich +0,01 € wird als „centnah“ gekennzeichnet, ohne daraus eine zusätzliche Warnschwelle oder Angebotsregel abzuleiten.
6. **Entscheidungsverzug:** Nach Abgabe tritt Annahme oder Ablehnung nicht sofort ein. Der V2-Fall mit 1–3 Kalendertagen Wartezeit ist nur ein bestehender Hinweis; die konkrete V3-Entscheidungsverzögerung und Anfragefrist bleiben ein zu kalibrierender Parameter. Für den Gleichstand von Entscheidungs- und Ablaufdatum gilt als **A01-koordinierte V3-Interpretation, nicht als Nutzerentscheidung**: Am Ablaufdatum wird ein für diesen Tag angesetztes Kundenentscheidungsevent zuerst verarbeitet; bleibt das Angebot nach dieser Entscheidungsphase offen, läuft es am Tagesende ab. Dasselbe Datum erzeugt höchstens einen Endzustand.
7. **Fixierter Vertrag:** Bei Einreichung werden Angebots-, Kosten- und BAB-Snapshot der verwendeten Kalkulation festgehalten. Nicht angenommene Entwürfe dürfen bei geänderten Annahmen neu kalkuliert werden. Bei Annahme bleiben Vertragspreis und zugehöriger Snapshot unveränderlich; tatsächliche Abweichungen werden separat ausgewiesen. Nachträgliche Kosten- oder Marktänderungen ändern weder Preis noch Snapshot. Ablehnung und Fristablauf erzeugen keinen Auftrag und keine Rechnung.
8. **Marktbericht:** A02 definiert Berichtsperiode, Größenklassen, Stichprobe, Mittelwertbasis und Verhalten bei kleinen/leeren Gruppen; A05 verantwortet Darstellung und A03 prüft nur die finanzielle Bedeutung der ausgewiesenen Preisgröße. Der Monatsbericht zeigt durchschnittliche Konkurrenzpreise nach mindestens drei Auftragsgrößen, ohne Einzelgebote oder Einzelbieterpreise. Eine A01-koordinierte V3-Implementierungskonvention unterdrückt den Mittelwert bei weniger als drei eindeutigen Konkurrenzangebots-IDs pro Größenklasse und Monat; die Zahl `n` bleibt sichtbar. Die Schwelle ist ein konservativer Spiel-Aggregationsschutz, keine rechtliche, statistische oder allgemeine Datenschutzgarantie: Auch größere Aggregate können bei bekanntem Vorwissen rückrechenbar sein. Die drei Demo-Größen und Werte bleiben explizit synthetische Fixtures, keine Marktkalibrierung oder Nutzerentscheidung. Operative Angebots-, Kosten- und Ergebniskennzahlen werden Kalendermonaten zugeordnet; Jahreswerte sind die Summe bzw. der Abschluss der zwölf Kalendermonate. Cash und offene Posten erscheinen zusätzlich als Stichtagswerte. Makroperioden aus T-0063 bleiben davon getrennt.

## Schnittstellenverträge

| Übergabe | Benötigte Felder/Regel | Verantwortlich | Status |
|---|---|---|---|
| T-0063 → T-0065 | Makrolage, Nachfrage-/Kostenimpuls, Geltungsperiode, Szenario-/Seed-Reproduzierbarkeit sowie zulässige Bandbreiten | A08 Quellen; A02 Modell; A03 Finanzreview | Ausstehend |
| T-0067 → T-0065 | `R` = Nettoplanpreis ohne SimTAX; DB I nur aus variablen Einzelkosten; direkte Arbeit/Maschine getrennt; Ergebnis nach direkten Einzelkosten; BAB-Restcent größte ungerundete Restfraktion, Tie-break stabile Kostenstellen-ID aufsteigend; Snapshot bei Einreichung und Fixierung bei Annahme; centnah −0,01 € bis +0,01 € inkl.; operative Kennzahlen Kalendermonat/Jahressumme, Cash/OP als Stichtag | A03 | D-0162-Vertrag integriert und A02/A03-Fachreview erfolgt; unabhängiger A09-Rechenreview offen |
| T-0065 → A05 | Anfragezustände, Annahme-/Ablehnungsdatum, Spieleraktionen, sichtbare Berichtsfelder und Preis-Freeze | A02 mit A05 | Nach Vertragsklärung |
| T-0065 → A09 | deterministische Seeds, Segment-/Wettbewerbsfälle, Entscheidungsverzug, Ablauf, versteckte Einzelgebote, DB-Fälle | A02; Review A09 | nach Integration |

## Noch zu spezifizieren (keine stillen Defaults)

- Nachfragefrequenz, Wochenverteilung, Marktsättigung und Ereignisgewichtung durch Konjunktur.
- Exakte Segmentgewichte und Angebots-/Einladungs-/Zuschlagsformel einschließlich Kapazität und Reputation.
- Warte- und Angebotsfrist, deren Kalendertagszählung und Periodenzuordnung.
- Auftragsgrößenklassen und Definition des Vergleichspreises für den Monatsbericht; Schutz gegen zu kleine Stichprobe.
- Kapital-/Rechtsformabhängige Zulässigkeit, falls T-0064 auf einen Marktfall einwirkt.
- Noch erforderliche V3-Marktparameter bleiben offen; Preis-/DB-/BAB-/Snapshot-/Periodensemantik ist durch D-0162 festgelegt und wird nicht erneut als Nutzerfrage oder A02-Default behandelt.

Diese Punkte werden nach T-0063/T-0067 als konkrete Übergaben an A01 und die zuständigen Rollen gegeben. Eine Nutzerfrage ist in dieser Teilphase noch nicht nötig: zunächst fehlen die Fachparameter und Rechenbelege.

## Abnahmematrix (V3-03 bis V3-08)

- **V3-03:** drei Segmente, je eine dokumentierte Preisempfindlichkeit und zweites Auswahlkriterium; kontrollierte Grenzfälle.
- **V3-04:** drei unterscheidbare Wettbewerber; Monatsmittelwerte für mindestens drei Größen; keine Offenlegung einzelner Gebote.
- **V3-05:** mindestens 20 Arbeitstage je Seed-Lauf, Anfragen an mindestens vier der fünf Wochentage; drei feste Seeds; vollständige Anfrageattribute.
- **V3-06:** Anfrage → Angebot → verzögerte Annahme/Ablehnung oder Ablauf → bei Annahme unveränderlicher Vertragspreis → Arbeits-/Liefer-/Abnahme-/Rechnungs-/Zahlungsübergabe; Duplikatfreiheit.
- **V3-07:** positive, centnahe (DB I −0,01 € bis +0,01 € einschließlich) und negative DB-I-Fälle; direkte Arbeits-/Maschinenkosten separat; BAB-Verteilung centgenau nach größter ungerundeter Restfraktion und stabilem aufsteigendem Kostenstellen-ID-Tie-break; eingereichte Angebots-Snapshots bleiben bei Annahme unverändert; Abstimmung zu T-0067.
- **V3-08:** Paarvergleiche mit je isolierter Änderung von Preis, Reputation, Segmentpassung und Kapazität; erwartete Wirkungsrichtung sowie Preis-Freeze nach Annahme.

## Review-Befund und Fortsetzung

Keine erkannte Kollision mit D-0159: verpflichtende Lernereignisse sind nicht Teil dieses Marktflusses. D-0162 ist die V3-Preis-/Kosten-/Snapshot-/Kennzahlenbasis; D-0160 bleibt V2-only und wird durch T-0065 nicht erweitert. Die aktuelle V2-Marktlogik darf als Vergleichsbasis dienen, ist aber wegen ihres ausdrücklich begrenzten Geltungsbereichs kein automatischer V3-Default.

**Dependency gate:** Der Marktvertrag kann erst nach Eingang der T-0063-Parameter und des T-0067-Kostenvertrags final kalibriert und implementiert werden. Bis dahin ist dieser Rahmen nur die unabhängige Vorarbeit.
