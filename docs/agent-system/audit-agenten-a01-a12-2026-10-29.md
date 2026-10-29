# Agenten-Audit A01–A12

**Stand:** 2026-10-29
**Koordination:** A01 – MASTER_ORCHESTRATOR
**Kontext:** MG-002; statischer Rollen-, Rechte-, Goal-/Ticket- und aktueller Arbeitsstandabgleich
**Repository:** `main`, HEAD `797ec5e` bei Auditbeginn
**Prüfart:** Dokumenten-/Code-Lesereview; keine Tests oder Browserläufe ausgeführt

## Ergebnisse je Agent

| Agent | Ergebnis | Befund |
|---|---|---|
| **A01 – MASTER_ORCHESTRATOR** | **Klar, Rechteprofil knapp** | Gesamtkoordination und Ziel-/Ticketsteuerung sind benannt. `AGENTS.md` verlangt A01-Routing und task-level READ/PROPOSE/VALIDATE/WRITE/APPROVE; ein konkretes Rollenprofil für Ticketanlage, Abschluss und Sicherungs-/Releaseentscheidung fehlt. Keine Fachautorität anstelle der Fachagenten; Nutzer bleibt finale Produkt-/Architekturinstanz. |
| **A02 – SIMULATION** | **Klar** | Operative Ereignisse, Mengen, Reihenfolge und Simulationszeit sind von A03s Finanzsalden/Buchungen abgegrenzt (Finanzspezifikation, Abschnitt zur Fachschnittstelle). Kein fachlicher Konflikt gefunden. Eigenes Rechteprofil fehlt; T-0040/T-0041 benennen A02 nicht als aktuellen Owner. |
| **A03 – ACCOUNTING_FINANCE** | **Klar** | Forderungen, Verbindlichkeiten, Kosten/Erlöse, Cashflow und finanzielle Buchungsfolgen sind über die A02/A03-Übergabe abgegrenzt. Kein Rollenkonflikt festgestellt. Eigenes Rechteprofil fehlt; T-0040-Finanzsicht bleibt Reviewarbeit. |
| **A04 – DATABASE** | **Klar** | Logische Datenmodellanforderungen sind von physischem Schema und Architekturfreigabe getrennt; Nutzerfreigabegrenze steht in MG-002/SLG-002.5 und der Datenmodellspezifikation. Kein Schemakonflikt festgestellt. Kein eigener Rollen-/Rechteleitfaden und derzeit kein Owner in den aktiven T-0040/T-0041-Tickets. |
| **A05 – FRONTEND** | **Klar, Stackangabe veraltet** | UI/UX-Verantwortung und Abgrenzung zu A12s Testrolle sind verständlich. Agentenstruktur und vorgeschlagene Architektur nennen Next.js/React/PWA; der aktuelle Prototyp ist dagegen statisches HTML/CSS mit ES-Modulen. Das ist als aktueller Stack nicht zutreffend und kann Umsetzungserwartungen fehlleiten. A05 ist in T-0040/T-0041 eingebunden. |
| **A06 – IHK_LEARNING** | **Klarer Fachschwerpunkt, Grenze zu A07 offen** | Lernengine/Kompetenzlandkarte sind zugewiesen. Die fachliche Verantwortung für Schwierigkeitszuordnung, Inhaltserstellung und Abnahme gegenüber A07 ist nicht als wiederverwendbare Rollengrenze dokumentiert. Die 450 Altfälle in T-0041 sind vorläufig per Komplexitätsheuristik eingestuft und bedürfen A06-Prüfung. |
| **A07 – EXAM** | **Klarer Fachschwerpunkt, Grenze zu A06 offen** | Prüfungssimulation und Bewertung sind zugewiesen. Die Grenze bei MC-Erstellung, Lösungseindeutigkeit, Exam-Format und Inhaltsreview mit A06 ist nur ticketweise bestimmt. Als unabhängige Fachprüfung der 90 neuen Fälle ist A07 einzubeziehen. |
| **A08 – RESEARCH** | **Klar, Provenienz der neuen Lernfälle unzureichend** | Recherche und Abgleich mit IHK-/Internetquellen sind in SLG-002.1 zugewiesen. In `prototype/learning-supplemental.js` werden Quellen-/Kompetenzverweise aus dem jeweils gleichen Arrayindex eines bestehenden Falls übernommen; es gibt keine explizite thematische Zuordnung für jeden neuen Fall. A08/A06 müssen Beleg und Kompetenzbezug bestätigen oder korrigieren. |
| **A09 – QA** | **Klar, akute T-0041-Abnahmelücke** | Automatisierte Regressionen, Testabdeckung und Release-Gates sind von A12s explorativem Browser-Playtest abgegrenzt. Der Review der 90 neuen Fragen steht aus. `prototype/learning-ui-regressions.mjs` erwartet noch 450 Fälle, das alte `DAILY_ITEMS`-Deck und die Anzeige „Fall 1 von 50“, obwohl der aktuelle UI-Code 540 gemeinsame Fragen nutzt. Der Test wurde im Audit nicht ausgeführt; die Regression ist sichtbar veraltet und wahrscheinlich nicht mehr passend. |
| **A10 – DEVOPS_INFRASTRUCTURE** | **Klar, Goal-Text veraltet/unklar** | Zuständigkeit für GitHub, CI/CD und Deployment ist benannt. `goals.md` sagt weiterhin, der Workflow-Sicherheitsrückstand werde erst in SLG-002.5 überführt; T-0033/CP-0216 dokumentieren bereits die Korrektur und 5/5 Sicherheitstests. Der verbleibende Umfang muss entfernt oder präzisiert werden. Kein aktueller A10-Owner in den offenen T-0040/T-0041-Tickets. |
| **A11 – TECHNICAL_ARCHITECT** | **Klar, Freigabegrenze intakt** | Systemgrenzen und Schnittstellen sind zugewiesen. Architektur V0.2 und ADRs bleiben PROPOSED; der Nutzer entscheidet über Freigabe. Kein Konflikt mit A12 gefunden. Detailliertes Rollen-/Rechteprofil fehlt, die globale aufgabenbezogene Berechtigungsregel gilt. |
| **A12 – BROWSER_PLAYTEST** | **Rolle klar, noch nicht praktisch erprobt oder aktiv zugewiesen** | Visuelle/funktionale Explorationsprüfung und reproduzierbare Übergabe sind von A09 abgegrenzt. Speichern/Laden kann grundsätzlich JSON-Spielstände einspielen; Import überschreibt aber den Browser-Spielstand, weshalb ein isoliertes Profil nötig ist. Kein Teststand/Handoff wurde bisher praktisch validiert. T-0041 fordert Browserreview, führt A12 aber nicht als Fachrolle auf. |

## Konflikte und Lücken nach Priorität

### Blockiert eine verlässliche Abnahme von T-0041

1. **QA-Regression veraltet:** Erwartungswerte und Daily-Deck-Annahmen in `learning-ui-regressions.mjs` passen nicht zur 540er-Bibliothek und gemeinsamen Tages-/Übungsquelle. Aktualisieren und ausführen, bevor T-0041 abgenommen wird.
2. **A12 nicht als Browserreview-Owner eingetragen:** T-0041 verlangt UI-/Browserprüfung, nennt aber A12 nicht. A01 muss A12 als Browser-Playtest-Fachrolle ergänzen oder ein getrenntes Ticket zuweisen.
3. **90 Zusatzfälle ohne bestätigte Provenienz:** Kompetenz- und Quellen-IDs werden derzeit nach Arrayposition übernommen, nicht pro Fall ausgewählt. A06/A08 müssen die Zuordnung prüfen; A07/A09 müssen Lösungsschlüssel und Distraktoren fachlich reviewen.
4. **Schwierigkeitsstufen der 450 Altfälle heuristisch:** Das Komplexitätsranking ist technische Vorsortierung, keine fachliche Schwierigkeitsbestätigung. A06/A07 müssen umstufen und Zielzahlen je Stufe bestätigen.

### Dokumentationslücken ohne unmittelbaren Rechteverstoß

- A01–A11 besitzen keine gleichartig ausformulierten Einzelprofile für Fähigkeiten und Rechte; A12 ist momentan die einzige Rolle mit einem detaillierten Rollenprofil. Die allgemeine `AGENTS.md`-Regel der aufgabenbezogenen Rechtevergabe bleibt verbindlich, daher ist dies eine Konsistenz-/Wartbarkeitslücke und kein pauschaler Rechteverstoß.
- A05s Frontend-Stackbeschreibung sollte den heutigen statischen ESM-Prototyp von einer vorgeschlagenen künftigen Next.js/React/PWA-Architektur unterscheiden.
- Der A10-Sicherheitsrückstand ist in `goals.md` als noch zu überführen markiert, obwohl Abschlussbelege vorliegen.
- A04, A10 und A11 sind nicht als Owner in den derzeit offenen T-0040/T-0041-Tickets aufgeführt. Das ist nur für Arbeit relevant, die ihren Fachbereich tatsächlich berührt.

## Gesamturteil

Die Rollen A01–A12 sind als Struktur vollständig; die fachlichen Grundzuständigkeiten und besonders die Trennung A02/A03 sowie A09/A12 sind brauchbar. **Kein grundlegender, alle Rollen blockierender Zuständigkeitskonflikt wurde gefunden.** Es bestehen jedoch vier konkrete T-0041-Abnahmelücken und mehrere Dokumentationsabweichungen. Der aktuelle lokale Stand ist daher **nicht release-/abnahmebereit für T-0041**, bis die Regression, A12-Zuweisung, Provenienz und Levelzuordnung nachgearbeitet sind.

## Prüfgrenzen und Git-Stand

Die drei Bereichsreviews A02–A05, A06–A09 und A10–A12 erfolgten nur lesend; A01 prüfte die Governance-/Gesamtzuordnung. Keine Dateien der vorherigen T-0040/T-0041/T-0042-Arbeiten wurden geändert oder verworfen. Es wurden keine Tests oder Browserläufe ausgeführt. Git zeigte zu Auditbeginn bereits bestehende lokale Änderungen; kein Commit/Push im Rahmen des Audits.
