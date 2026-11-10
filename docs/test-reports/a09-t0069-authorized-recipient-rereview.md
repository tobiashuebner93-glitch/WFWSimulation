# A09 – T-0069 Autorisierter Alternativempfänger: Adversarial Re-Review

**Status:** PASS im UI-/Runtime-Testumfang  
**Adressat:** A01 – MASTER_ORCHESTRATOR  
**Agent:** A09 – QA  
**Goals/Ticket:** MG-002 / SLG-002.2 / SLG-002.5 / T-0069  
**Profil/Entscheidungen:** V3 ab 2027-01-04; D-0157, D-0161, D-0162  
**Vorgänger:** CP-0307 (ENTWURF)

## Preflight

Gelesen: AGENTS.md, agent-structure, agent-rights-matrix, Goals, T-0069-Ticketboard, Collaboration State, Decision Log, CP-0307, A05-Fixbericht, A03-Lieferreview, A09-Erstreview, Run-/Workorder-/Delivery-Code, UI-Regressions und aktueller Gitstatus/Diff. Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; umfangreiche lokale Änderungen anderer Arbeiten bleiben erhalten. Der Review prüft D-0157-Rollenbindung und Replay-/Restore-Sicherheit, keine Echtheit externer Vertragsdokumente und keine Releasefreigabe.

## Befunde

- **Standardkunde:** vorhandene A05-Regression legt Vertragspartei gleich Kundenpartei und besteht.
- **Alternativempfänger ohne Referenzen:** wird durch `planRunOrder`/Runtime abgewiesen.
- **Falsche Kundenbindung:** abweichendes `authorizedForRef` wird abgewiesen.
- **Gültige Autorität:** Referenz wird in den Vertragssnapshot übernommen; Empfänger-ID bleibt bis zur Lieferung gebunden.
- **Tampering/Restore:** Mutationen an Autorisierungsbindung, Referenz, Akzeptanzpartei und Kundenpartei scheitern an `validateV3RunState` mit `invalid_run_state`. Änderung eines bereits gespeicherten Plans wird abgewiesen.
- **Rollenabgrenzung:** gerenderte Verkäuferkarte enthält keine Annahme-/Zurückweisungsaktion; ein Contractor-Entscheidungsversuch scheitert.
- **Nichtbuchung:** Lieferung erhält `pending_non_posting`; Finance-Handoffs und Materialbestand bleiben gegenüber dem Zustand direkt vor Lieferung unverändert.
- **Replay:** identische Lieferung ist idempotent.
- **Escaping:** ein synthetischer Empfängertext `<recipient>&1` wird in der Karte escaped.

## Reproduktion

Neue QA-only Suite: `node prototype/a09-t0069-authorized-recipient-rereview.mjs` — PASS.

Zusätzlich ausgeführt:

- `node prototype/a05-t0069-run-ui-regressions.mjs` — PASS.
- `node prototype/v3-run-orchestrator-regressions.mjs` — PASS.
- `node --check prototype/a09-t0069-authorized-recipient-rereview.mjs` — PASS.
- Gezieltes `git diff --check` — PASS.

## Nachweisrollen und Grenzen

- **Implementierung/Eigenregressionen:** A05 laut Arbeitsbericht PASS.
- **Fachreview A03:** Review des vorherigen Lieferstands PASS; Re-Review des Autoritätsfixes noch ausstehend.
- **Unabhängige QA A09:** PASS in diesem adversarial UI-/Runtime-Scope.
- **Browser-/Gerätetest:** A01 hat vor Korrektur einen ersten Tages-Smoke, aber noch keinen Browserdurchlauf des Alternativempfänger-Lieferpfads; echter Mobilgerätetest nicht ausgeführt.
- **Git:** lokale Arbeitsänderungen erhalten; nur neue QA-Suite plus dieser Bericht erstellt; kein Commit/Push.

**Nächster Schritt an A01:** A03-Fach-Re-Review abwarten. Bei PASS den Alternativempfängerpfad in A01s Browser-Smoke von Workorderplanung bis Lieferung nachvollziehen. T-0069 bleibt IN_PROGRESS; Gesamt-Finanzintegration, Jahresabstimmung und Gesamt-QA sind weiterhin separat offen.
