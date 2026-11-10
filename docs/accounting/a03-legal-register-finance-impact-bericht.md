# A03-Änderungsbericht – Impact der Rechtsregisterprüfung auf Finanzen

**Status:** A03-Fachupdate abgeschlossen; Rechts-/Release-Gate bleibt bei A01/A08/A09
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A03 – ACCOUNTING_FINANCE
**Master Goal / Second-Level Goals:** MG-002 / SLG-002.2 und SLG-002.5
**Bezug:** T-0064 Rechtsregister-Impact; T-0067 V3-Kalkulation/BAB; D-0083/D-0084, D-0099, D-0113/D-0114, D-0156, D-0160, D-0161; CP-0274 bis CP-0276 (ENTWÜRFE)

## A03-Befund und Änderung

A08s [Rechtsrahmenregister, AfA-/Steuer-/Kreditbefund und A03-Impactliste](../legal/legal-framework-register.md#a08-erstpruefung-des-historischen-rechtsbestands) unterscheidet Rechtsquelle und Spielregel. Die Erstrecherche mit Rechtsstichtag 2026-10-31 meldet keine pauschale Rechtsfreigabe. A03 hat die Auswirkungen auf die eigenen Fachunterlagen begrenzt nachgeführt:

- D-0083/D-0084 bleiben unverändert. Der Spielentscheid, degressive AfA als vereinfachte Methode auch außerhalb eines gesetzlichen Fensters anzubieten, wird nicht als steuerliche Zulässigkeit dargestellt. Das aktuelle im Register geprüfte Fenster für bewegliche Anlagegüter ist 01.07.2025–31.12.2027; Übergangsfenster gelten nur für die dort bezeichneten Zeiträume. Die am 01.01.2019 angeschaffte CNC fällt nicht in das 2025–2027-Fenster.
- Handelsbilanz, steuerliche AfA, BAB-Kostenannahme und physischer Szenario-Verschleiß/Ersatzwert sind getrennte Größen. Der CNC-Wert 0 € nach D-0099 wird in der Finanzspezifikation als Szenario-Eröffnungswert eingeordnet, nicht als vollständige HGB-Abschlussbestätigung.
- SimTAX 19 % bleibt Simulationsannahme. Das V1-Vorsteuer-Gate wird ausdrücklich als vereinfachtes Szenariokriterium kenntlich gemacht; es bestätigt keinen realen Vorsteuerabzug oder allgemeinen Steuerstatus. D-0156 bleibt V2-spezifisch; D-0160 wird nicht auf V3/V1 ausgeweitet.
- D-0042/D-0043 und deren Finanzfolgen bleiben als Darlehens-/Spielregel bestehen. Verzug, Pfändung/Verwertung und Defiziterlass werden nicht als automatische gesetzliche Folge formuliert.
- Der T-0067-BAB verwendet AfA nicht automatisch. Falls eine Anlagenkostenposition vom Spieler eingegeben wird, bleibt sie eine gekennzeichnete KLR-/Kalkulationsannahme und wird nicht allein dadurch steuerliche AfA oder HGB-Buchwert.

## Geänderte A03-Dateien

- [Finanzspezifikation](maschinenbau-mvp-finanzspezifikation.md) – Rechts-/AfA-/SimTAX-Abgrenzung, Eröffnungswert und Kreditverwertung als Szenarioregel präzisiert.
- [T-0067-Kalkulations-/BAB-Vertrag](a03-t0067-v3-kalkulations-bab-vertrag.md) – AfA-/Bilanz-/Steuergrenze für V3 ergänzt.
- Dieser Bericht – checkpoint-geeigneter Ergebnisnachweis und Registerverweis.

Keine Änderung an Decision Log, D-IDs, Nutzerwerten, Simulation, Code, Schema, Architektur oder Rechtsregister. Bestandsänderungen anderer Agenten wurden nicht geändert.

## Checkpoint-geeigneter Nachweis

**Feststellung:** A03 hat die Rechtsimpactliste aus dem zentralen Register in den eigenen Finance-Dokumenten umgesetzt, ohne Nutzerentscheidung oder Steuer-/Kreditpolitik zu verändern. 2019er CNC-Erwerb, D-0083/D-0084-Spielregel, HGB-/Steuer-/BAB-/Verschleißsichten, SimTAX/Vorsteuer und Kreditverwertung sind explizit abgegrenzt. Quelle/Prüfdatum: [Rechtsrahmenregister – A08-Erstprüfung und A03-Impact](../legal/legal-framework-register.md#a08-erstpruefung-des-historischen-rechtsbestands), Rechtsstand 2026-10-31. Der Eintrag für V3 bleibt im Register bis zur vollständigen A08/A09-Versionsprüfung offen; diese A03-Änderung ist keine Rechtsfreigabe.

**Vorgänger und Git-Basis:** CP-0276 (ENTWURF), Git-HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorhandene Änderungen anderer Agenten waren vor Arbeitsbeginn vorhanden und wurden erhalten.

## Offene Übergabe an A01

A01 pflegt die Datei-Impact-/Ticketverknüpfung im lebenden Register. Falls die 2019er CNC oder andere außerhalb des gesetzlichen Fensters angeschaffte Wirtschaftsgüter im Produkt weiterhin degressiv abgeschrieben werden sollen, muss die UI/Erklärung die Methode als Spielannahme getrennt von Steuer-AfA und HGB-Wert ausweisen. A08 führt die Registerprüfung fort; A09 prüft später Traceability und Release-Gate. Keine direkte Nutzerfrage gestellt.

## Prüfstatus

- **A03-Ausführung:** durchgeführt.
- **A03-Fachreview:** Selbstprüfung durchgeführt; keine Entscheidung oder Normwirkung erweitert.
- **A08-Fachreview:** Register/Erstprüfung als Quelle übernommen; separate erneute Quellenprüfung durch A03 nicht durchgeführt.
- **Unabhängige QA/A09:** nicht ausgeführt.
- **Code-/Automatisierungstests:** nicht ausgeführt; Dokumentationsänderung.
- **Browser-/Gerätetest:** nicht ausgeführt.
- **Git:** Status und Diff vorab geprüft; nach Änderung Whitespace-/Diff-Review durch A03. Kein Commit/Push.
