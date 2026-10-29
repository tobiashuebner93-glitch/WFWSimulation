# WFWSimulation – Agent Control Plane

## Verbindlicher Preflight

Jeder Agent und der Master Orchestrator müssen VOR jeder Bearbeitung:

1. dieses Dokument lesen,
2. `docs/agent-system/agent-structure.md` und `docs/agent-system/agent-rights-matrix.md` lesen,
3. `docs/agent-system/goals.md` lesen,
4. `docs/agent-system/ticket-board.md` lesen und nur Tickets des aktuellen Master-/Second-Level-Goals berücksichtigen,
5. `docs/agent-system/collaboration-state.md` lesen,
6. relevante Architektur-/Fachdokumente prüfen,
7. Repository-Stand und Änderungen anderer Agenten prüfen,
8. offene Entscheidungen und Blocker prüfen,
9. Kommunikationsrouting beachten: jede Antwort an A01 adressieren; Rückfragen aus Fachagenten an den Nutzer über A01 bündeln; Antworten ohne Rückfragen in den nächsten nötigen Auftrag mit benanntem Adressaten überführen.

Abgeschlossene Second-Level-Goals und deren Tickets bleiben historisch erhalten, gehören aber NICHT zum aktiven Arbeitskontext.

## Dokumentationspflicht

Maximal 3 eigenständige Agentenarbeiten dürfen ohne Checkpoint erfolgen.

Danach ist ein dauerhafter Checkpoint verpflichtend.

Bei Entscheidungen, Architekturänderungen, wesentlichen Erkenntnissen, Blockern, neuen Abhängigkeiten oder Änderungen an Goals/Tickets ist sofort zu dokumentieren.

Der Master Orchestrator unterliegt denselben Regeln wie alle anderen Agenten.

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
OFFENE PUNKTE:
RÜCKFRAGEN AN A01:
BLOCKER:
NÄCHSTER SCHRITT:

## Verbindliches Kommunikationsrouting

- Jeder Fachagent adressiert Status, Ergebnisse, offene Punkte und Rückfragen an A01 – MASTER_ORCHESTRATOR. Agenten richten Rückfragen nicht direkt an den Nutzer.
- A01 bündelt notwendige Nutzerfragen, prüft sie auf Abhängigkeiten und adressiert sie gesammelt an den Nutzer.
- Ergibt eine Agentenantwort keine notwendige Rückfrage, erstellt A01 aus dem Ergebnis den nächsten erforderlichen Auftrag mit ausdrücklich benanntem Adressaten, Goal-/Ticketbezug, Aufgabe und Ergebnis. Ist kein weiterer Arbeitsschritt erforderlich, dokumentiert A01 den Abschluss statt einen künstlichen Auftrag anzulegen.
- A01 hält abhängige Folgeaufträge zurück, bis notwendige Nutzerantworten vorliegen; unabhängige Arbeit kann weiterlaufen.

## Autorität

Fachagenten besitzen Fachautorität in ihrem jeweiligen Bereich.

A01 koordiniert, ist aber keine Ersatz-Fachautorität.

Der Nutzer hat die finale Produkt- und Architekturentscheidung.

AI-Agenten dürfen autoritativen Simulations-, Accounting- oder Ledger-State nicht direkt mutieren.
