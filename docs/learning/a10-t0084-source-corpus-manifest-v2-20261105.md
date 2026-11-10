# A10 – T-0084 Quellenkorpusmanifest v2: keine Projektlizenz

**Status:** versionierte Projekt-Nutzungsdisposition; kein Inhalts-, Rechteinhaber- oder allgemeiner Rechts-PASS
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A10 – DEVOPS_INFRASTRUCTURE
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.1
**Ticket:** T-0084
**Erstellt:** 2026-11-05
**Preflight:** main @ 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c; sieben Control-Plane-Dateien gehasht und aktuelle Ticket-/Goal-Zusammenfassung gelesen. CP-0500 und MCP-2026110401 sind eingefroren.

## Nutzerbestätigung und Disposition

Der Nutzer hat am 2026-11-05 bestätigt: „Ich habe keine Lizenz.“ Bezogen auf die in `docs/qa/HQ/` und `docs/qa/WQ/` abgelegten Prüfungsdateien wird deshalb im Projekt kein Nutzungsrecht für eine Übernahme, Bearbeitung oder Einbindung in die Simulation zugrunde gelegt.

Für **alle 129** Quellenzeilen im CSV gilt:

- `rights_license_disposition=NO_PROJECT_REUSE_LICENSE_PROVIDED`
- `project_use_disposition=DO_NOT_USE_IN_PRODUCT`
- `rights_evidence` verweist auf die Nutzerbestätigung und grenzt die Aussage ein.

Diese Projektentscheidung bestimmt weder die Urheberschaft noch den allgemeinen rechtlichen Status jedes einzelnen Dokuments. Es wird keine Lizenz, Ausnahme oder Einzelerlaubnis behauptet. Die Dateien bleiben unverändert und werden nicht zitiert, extrahiert, verarbeitet oder in das Produkt übernommen.

## Manifestumfang und Integrität

Die Auswahlregel aus v1 bleibt erhalten: rekursiv PDF- und DOCX-Dateien unter `docs/qa/HQ/**` und `docs/qa/WQ/**`, keine Markdownnotizen oder sonstige Dateitypen. Der Nenner bleibt 129 Pfade: 124 PDF und 5 DOCX. Doppelte Hashes bleiben getrennte Pfade/Inventareinträge.

Alle 129 Pfade wurden nur auf Vorhandensein und SHA-256 geprüft. Jeder aktuelle Quelldatei-Hash stimmt mit dem Inventarwert aus v1 überein. Die unveränderten fachlichen Felder wurden aus v1 übernommen; geändert wurden `corpus_version`, `rights_license_disposition`, `rights_evidence` und die neue getrennte Spalte `project_use_disposition`. Die Lesbarkeits-, Inhaltsabdeckungs- und Kompetenzzuordnungsfelder wurden nicht zu einer Produktfreigabe hochgestuft.

Die v1-Dateien bleiben unverändert: `a10-t0084-source-corpus-manifest-v1-20261105.csv` und `.md`. Dieses v2-Manifest ersetzt v1 nicht als historische Prüfgrundlage; es hält nur die spätere Nutzungsentscheidung fest.

## Getrennte fachliche Befunde aus v1

Die mitgeführten Lesbarkeitslabels bleiben: 49 ausreichend textlesbar, 1 teilweise lesbar und 79 unter der dokumentierten Textschwelle. OCR wurde nicht ausgeführt. Frühere Themen-/Kompetenzkandidaten bleiben Kandidaten und ergeben weder Itemabdeckung noch eine Erlaubnis zur Nutzung von Frage-, Antwort-, Lösungs-, Anlagen- oder Bildmaterial.

Da kein Projekt-Reuse-Recht vorliegt, wird keine weitere Prüfung des Prüfungswortlauts, der Antwortoptionen oder der Lösungen aus diesen Dateien für Produktentwicklung fortgesetzt. Die Bestandsaufnahme kann für Provenienz und Ausschluss dokumentiert bleiben.

## Zulässiger Fortsetzungspfad

T-0084 kann mit öffentlich zugänglichen und für den konkreten Zweck verwendbaren Kompetenz-/Prüfungsrahmen sowie geeigneten amtlichen Rechtsquellen fortgesetzt werden. A08 prüft deren konkrete Quellenbasis. A06 ordnet unabhängig formulierte Aufgaben Kompetenzen zu; A07 erstellt eigene, inhaltlich neu formulierte Fälle und plausible Distraktoren; A09 reviewt fachliche Tiefe, Qualität und Quellenabgrenzung. Nicht öffentliche oder sonst lizenzpflichtige IHK-/DIHK-Materialien werden nicht als Produktquelle verwendet.

Falls der Nutzer künftig ausdrücklich eine externe Lizenz erwirbt, ist vor einer Nutzung eine neue, versionsgebundene Prüfung mit Lizenzgeber, betroffenen Quellen-IDs, erlaubten Nutzungen, Zielgruppe, Online-/Offline-Verbreitung, Gebiet, Laufzeit und Bearbeitungsrechten erforderlich. Dann wird ein neues Manifest angelegt; v2 bleibt unverändert.

## Ergebnis und nächste Zuständigkeit

- **A10:** v2-Manifesterstellung und Hash-/Nennerprüfung; kein Quelleninhalt gelesen.
- **A08:** kann die Nichtnutzung aufgrund fehlender Lizenz als Rechtegate bestätigen; keine Einzelerlaubnis wird fingiert.
- **A06/A07:** nächsten Inhaltsslice ausschließlich aus unabhängig erstellten Aufgaben und freigegebenen Rahmenquellen planen.
- **A09:** prüft die neue Disposition und die getrennten Gates, bevor T-0084 Abschluss erhält.
- **A01:** integriert die neue Nutzungsgrenze in Ticketstatus und nächsten Agentenauftrag.

## Verifikation und Grenzen

| Prüfung | Ergebnis |
|---|---|
| Manifestdatensätze | 129/129, IDs eindeutig |
| Bestandsumfang | 124 PDF + 5 DOCX |
| Quelldatei-SHA-256 | 129/129 stimmen mit v1 überein |
| Rechte-/Projektgebrauch | 129/129 NO_PROJECT_REUSE_LICENSE_PROVIDED / DO_NOT_USE_IN_PRODUCT |
| Lesbarkeit/OCR | unverändert aus v1; keine neue OCR-/Inhaltsprüfung |
| Produkt-/Schema-/Architekturänderung | keine |
| CP-0500 / MCP-2026110401 | unverändert |
| Commit / Push | keiner |

**Dateien:** `docs/learning/a10-t0084-source-corpus-manifest-v2-20261105.csv` und `.md`.
**Autor:** A10 – DEVOPS_INFRASTRUCTURE.
**Mitwirkende:** keine.
**Fachreview:** A08-Rechtebefund als Eingabe; kein neues Review der v2.
**Unabhängige QA:** nicht ausgeführt; A09 erforderlich.
**Browser-/Gerätetest:** nicht anwendbar.
**Nächster Adressat:** A01.
