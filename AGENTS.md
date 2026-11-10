# WFWSimulation – Agent Control Plane

## Verbindlicher Preflight

Jeder Agent und der Master Orchestrator führen VOR jeder Bearbeitung einen kompakten, aktuellen Preflight durch:

1. A01 erstellt für das aktive Ticketpaket einen **Preflight-Digest** im Arbeitsauftrag oder im aktuellen CP. Er nennt: Datum, Goal/Ticket, Agent/Adressat, Start-/Zielprofil, Vorgänger-CP, maßgebliche Entscheidungs-IDs, Abhängigkeiten/offene Entscheidungen, Branch/HEAD, Status- und Diff-Zusammenfassung, betroffene Pfade sowie SHA-256 der folgenden Control-Plane-Dateien: `AGENTS.md`, Agentenstruktur, Rechtematrix, `goals.md`, `ticket-board.md`, `collaboration-state.md` und `decision-log.md`.
2. Der Agent verifiziert die Digest-Hashes und prüft Status/Diff vor jeder Bearbeitung oder Übernahme. Sind Digest und Ticketkontext aktuell, darf er die letzte gelesene, unveränderte Control-Plane-Zusammenfassung verwenden; die unveränderten Volltexte müssen nicht bei jedem Agentenwechsel erneut ausgegeben oder vollständig in den Kontext kopiert werden.
3. Fehlt der Digest, weicht ein Hash ab oder haben sich Goal, Ticket, Profil, Entscheidung, Vorgänger-CP oder Abhängigkeiten geändert, liest der Agent die betroffenen Control-Plane-Abschnitte vollständig neu. Die aktuelle Ticketbeschreibung, alle seit dem letzten Digest geänderten Quellen, fachlich relevanten Dokumente und alle konflikt-/blockerrelevanten Stellen sind immer direkt zu lesen. Bei Unsicherheit gilt Vollprüfung.
4. Nur Tickets des aktuellen Master-/Second-Level-Goals gehören zum aktiven Kontext. Abgeschlossene Goals/Tickets bleiben historisch.
5. Start-/Zielprofil, relevante Entscheidungen und Vorgänger-CP sind im Auftrag/Checkpoint auszuweisen; Repository-Stand, Änderungen anderer Agenten, offene Entscheidungen und Blocker sind zu prüfen.
6. Jede Agentenantwort wird an A01 adressiert. Fachagenten richten Rückfragen ausschließlich an A01; A01 bündelt sie für den Nutzer. Antworten ohne Rückfragen werden in einen konkret adressierten Folgeauftrag überführt oder als Abschluss dokumentiert.

Abgeschlossene Second-Level-Goals und deren Tickets bleiben historisch erhalten, gehören aber NICHT zum aktiven Arbeitskontext.

## Übergaben und kompakte Berichte

A01 vergibt je Übergabe ein klar begrenztes Arbeitspaket mit genau einem verantwortlichen Agenten, Akzeptanzkriterien, Änderungsgrenzen und erwarteten Belegen. Unabhängige Read-only-Reviews dürfen parallel laufen. Schreibaufträge mit überlappenden Dateien werden seriell ausgeführt oder erhalten ausdrücklich getrennte Pfade. Der Agent meldet nur Delta und benötigte Belege; keine großen Quelldateien, Logs oder unveränderte Vorgeschichte kopieren. Das Kurzformat umfasst: Status/Adressat/Goal/Ticket, geänderte Pfade, Kriterien PASS/NONPASS mit Test-/Fundstellen, nicht geprüfter Umfang, Blocker/Rückfragen sowie nächsten Adressaten. Ausführungs-, Fachreview-, unabhängige QA-, Browser-/Geräte- und Git-Nachweise bleiben klar getrennt; fehlende Prüfung wird ausdrücklich als nicht ausgeführt markiert.
## Dokumentationspflicht

Maximal 3 eigenständige Agentenarbeiten dürfen ohne Checkpoint erfolgen.

Danach ist ein dauerhafter Checkpoint verpflichtend.

Bei Entscheidungen, Architekturänderungen, wesentlichen Erkenntnissen, Blockern, neuen Abhängigkeiten oder Änderungen an Goals/Tickets ist sofort zu dokumentieren.

Review-, Retro- und Analysefrequenz: Eine gebündelte Checkpoint-Review/Retro wird nur bei jedem 250. CP durchgeführt (CP-0250, CP-0500, CP-0750 usw.), nicht nach jedem einzelnen CP oder Arbeitsauftrag. Zusätzlich wird nach jedem erfolgreich erstellten Commit und nach jedem erfolgreich ausgeführten Push eine Review/Retro ausgelöst. Die CP-Nummern werden nie zurückgesetzt. Nutzeranweisungen mit späterem Datum/Stand haben Vorrang vor älteren CP-/MCP-Texten; bestätigte CPs/MCPs bleiben dennoch unverändert. Außerhalb dieser Auslöser wird keine Analyseabfrage allein wegen eines neuen CP gestellt.

Der Master Orchestrator unterliegt denselben Regeln wie alle anderen Agenten.
Abgeschlossene Checkpoints (CP) und Mastercheckpoints (MCP) sind unveränderliche Historie, sobald die zugehörige Analyse abgeschlossen und vom Nutzer bestätigt ist. Danach dürfen sie weder inhaltlich noch redaktionell verändert, ergänzt, umsortiert oder gelöscht werden; das gilt auch für Tippfehler, Links und nachträgliche Registereinträge. Entwürfe bleiben bis zu diesem Zeitpunkt ausdrücklich als ENTWURF gekennzeichnet. Korrekturen, Ergänzungen oder spätere Erkenntnisse werden in einem neuen, fortlaufend nummerierten CP dokumentiert und auf den betroffenen Vorgänger zurückgeführt. Eine spätere Gesamtsynthese erhält eine neue MCP-ID und verweist auf ältere MCPs, ohne sie zu ändern oder zu ersetzen.


## Reproduzierbare Korpusprüfungen

Vor jeder Inhaltsprüfung eines Quellen- oder Fragenkorpus wird ein versioniertes Manifest mit Auswahlregel, Dateitypen, Ausschlüssen, eindeutigem Nenner, Pfad und SHA-256 jeder Quelle sowie Einzeldisposition erstellt. Lesbarkeit/OCR, Fragen- bzw. Inhaltsabdeckung, Kompetenzzuordnung und Nutzungsrechte sind getrennte Prüfgates; ein positives Ergebnis in einem Gate gilt nicht als Nachweis für ein anderes. Änderungen am Korpus erzeugen eine neue Manifestversion statt die frühere Prüfgrundlage zu überschreiben.

## Rollen- und Autorisierungsnachweis je Deliverable

Jeder neue CP/MCP und jeder Abschlussbericht nennt getrennt **Autor**, **Mitwirkende**, **Fachreview**, **unabhängige QA** und **nicht ausgeführte Prüfungen**. Unzutreffende oder nicht ausgeführte Rollen werden ausdrücklich so gekennzeichnet; A01-Selbstreview ist keine unabhängige QA.

Für jedes Deliverable werden die einschlägigen Autorisierungsebenen getrennt festgehalten: Domain-/Eventvertrag, Runtime/API, Persistenz/Schema, produktive Finanzmutation und Release. Je Ebene stehen Status, einschlägige D-ID bzw. `NEIN`/`PROPOSED`, entscheidungsbefugte Rolle und Nachweis. `N/A` ist zu verwenden, wenn eine Ebene für das Deliverable nicht zutrifft. Ein Review-PASS, Ticketabschluss oder technische Umsetzung erteilt keine fehlende Freigabe. Diese Felder protokollieren bestehende Befugnisse und schaffen keine neue Autorität.
## GitHub-Connector und Schreibzugriffe

Der GitHub-Connector ist für dieses Projekt ausschließlich READ-ONLY. Über ihn dürfen keine create-, update-, delete-, branch-, PR-, commit- oder sonstigen Schreiboperationen ausgeführt oder versucht werden.

Remote-Schreibvorgänge dürfen ausschließlich über den lokalen Git-Workspace und GitHub Desktop erfolgen, sofern der lokale Schreibzugriff verfügbar ist. Fehlt lokaler Schreibzugriff, sind weitere Schreibversuche zu unterlassen. Den Blocker melden und die fertigen Änderungen als Copy-Paste-Artefakt für den Benutzer bereitstellen.

## Kommunikationsformat

STATUS:
ADRESSAT: A01 – MASTER_ORCHESTRATOR
AGENT:
MASTER GOAL:
SECOND-LEVEL GOAL:
RELEVANTE TICKETS:
AUFGABE:
KONTEXT:
DURCHGEFÜHRTE ARBEIT:
DATEIEN:
ENTSCHEIDUNGEN:
TESTS:
AUTOR:
MITWIRKENDE:
AUSGEFÜHRT VON:
FACHREVIEW:
UNABHÄNGIGE QA:
BROWSER-/GERÄTETEST:
GIT-VERIFIKATION:
OFFENE PUNKTE:
RÜCKFRAGEN AN A01:
BLOCKER:
NÄCHSTER SCHRITT:

## Verbindliche Nachweisrollen

Jeder Bericht unterscheidet ausdrücklich: Ausführung, fachliches Review, unabhängige QA, Browser-/Gerätetest und tatsächliche Git-Verifikation. Je Feld steht ein Ergebnis oder `nicht ausgeführt`/`nicht verfügbar`; fehlender Zugriff darf nicht als Prüfung oder Bestätigung dargestellt werden.

## Verbindliches Kommunikationsrouting

- Jeder Fachagent adressiert Status, Ergebnisse, offene Punkte und Rückfragen an A01 – MASTER_ORCHESTRATOR. Agenten richten Rückfragen nicht direkt an den Nutzer.
- Vor Nutzerfragen erstellt A01 intern eine Entscheidungsübersicht mit Abhängigkeiten, fachlicher Grundlage, Empfehlung/Default, Auswirkungen und nötigem Folgeauftrag. A01 bündelt die notwendigen, voneinander abhängigen Nutzerfragen und legt ihre Folgen verständlich dar.
- Ergibt eine Agentenantwort keine notwendige Rückfrage, erstellt A01 aus dem Ergebnis den nächsten erforderlichen Auftrag mit ausdrücklich benanntem Adressaten, Goal-/Ticketbezug, Aufgabe und Ergebnis. Ist kein weiterer Arbeitsschritt erforderlich, dokumentiert A01 den Abschluss statt einen künstlichen Auftrag anzulegen.
- A01 hält abhängige Folgeaufträge zurück, bis notwendige Nutzerantworten vorliegen; unabhängige Arbeit kann weiterlaufen.

## Autorität

Fachagenten besitzen Fachautorität in ihrem jeweiligen Bereich.

A01 koordiniert, ist aber keine Ersatz-Fachautorität.

Der Nutzer hat die finale Produkt- und Architekturentscheidung.

AI-Agenten dürfen autoritativen Simulations-, Accounting- oder Ledger-State nicht direkt mutieren.
