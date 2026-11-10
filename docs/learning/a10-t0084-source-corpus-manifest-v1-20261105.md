# A10 – T-0084 Quellenkorpusmanifest v1

**Status:** erstellt; ausschließlich Inventarisierung, kein Inhalts-, Rechte- oder Nutzungsrechts-PASS  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A10 – DEVOPS_INFRASTRUCTURE  
**Master Goal / Second-Level Goal:** MG-002 / SLG-002.1  
**Ticket:** T-0084  
**Erstellt:** 2026-11-05  
**Preflight:** main @ 8b72b7e35fd7bbd8d967655d0a97e0a01b93266c; sieben Control-Plane-Digests wurden verifiziert; 12 tracked Änderungen und 558 untracked Statuszeilen im Checkout.

## Auswahlregel und Bestand

Einbezogen sind alle Dateien unter docs/qa/HQ/** und docs/qa/WQ/** mit Endung .pdf oder .docx, rekursiv, im Checkout vom 2026-11-05. Ausgeschlossen sind Markdownnotizen und sonstige Dateitypen; sie zählen nicht als Prüfungsquelle im T-0084-Korpus. Der Nenner ist **129 Dateipfade** (124 PDF, 5 DOCX). Dateipfade mit identischem SHA-256 bleiben separate Inventareinträge; byteidentische Dubletten sind markiert und werden nicht still aus dem Dateinenner entfernt.

Das CSV enthält pro Datei relativen Pfad, stabilen Manifestdatensatz, Dateityp, Bytes, SHA-256, Gitstatus und getrennte Dispositionen für Lesbarkeit/OCR, Rollenstatus, Inhaltsabdeckung, Kompetenzmapping und Rechte/Lizenz. Alle 129 Quelldateien sind im aktuellen Checkout untracked.

## Übernommene Lesbarkeitsbefunde

Die Lesbarkeitslabels wurden aus dem von A06/A09 abgeglichenen CP-0491/Auditbericht übernommen, nicht neu als fachliche Inhaltsprüfung erhoben: 49 ausreichend textlesbare Quellen (47 PDF + 2 DOCX), eine teilweise lesbare PDF und 79 unter der dokumentierten Schwelle (76 PDF + 3 DOCX). Für PDF ist die dokumentierte Schwelle mindestens 40 Nicht-Whitespace-Zeichen je Seite mittels pdfplumber. OCR wurde nicht ausgeführt. Die partielle Datei ist docs/qa/HQ/2020/HQ_HJ-2020_Sit. Aufg. 1.pdf.

Bei 49 ausreichend textlesbaren Quellen ist die Rollenklassifikation im begrenzten Audit dokumentiert. 15 Quellen verfügen über Themen-/Kompetenzkandidaten in den A06-Nachweisen; diese IDs sind nicht einzeln gegen Frageformulierung, Optionen und Lösung geprüft und gelten nicht als Itemabdeckung. 34 der lesbaren Quellen haben noch keine detaillierte Themen-/Itemzuordnung. Die 80 partiellen/niedrigtextigen Quellen bleiben für Inhaltsabdeckung und Kompetenzmapping offen. Nutzungsrechte/Lizenzen sind für alle 129 Einträge als offen/unreviewed geführt; keine Erlaubnis wird aus Lesbarkeit oder öffentlicher Auffindbarkeit abgeleitet.

## Reconciliation und Grenze

Kontrollierte Nenner: 129 = 124 PDF + 5 DOCX; 49 + 1 + 79 = 129; 47 lesbare PDF + 1 partielle PDF + 76 niedrigtextige PDF = 124; 2 lesbare DOCX + 3 niedrigtextige DOCX = 5. Get-FileHash SHA256 wurde für jeden Inventareintrag ausgeführt; kein Quelldateipfad wurde geändert.

**Nächster Schritt:** A06 beginnt item-/kompetenzgenaues Mapping der 34 bislang nicht im Detail gemappten lesbaren Quellen in Fünferpaketen. Parallel A08 prüft Rechte/Provenienz; A07 validiert Itembezüge und Antworttiefe; A09 prüft Korpusvollständigkeit und Abnahmegrenzen. T-0084 bleibt IN_PROGRESS.

**Dateien:** docs/learning/a10-t0084-source-corpus-manifest-v1-20261105.csv; docs/learning/a10-t0084-source-corpus-manifest-v1-20261105.md.

**Änderungsumfang:** nur diese zwei neuen Dateien in docs/learning; keine Korpusquelle, Frage, CP/MCP oder Produktdatei wurde geändert. Kein Commit/Push.