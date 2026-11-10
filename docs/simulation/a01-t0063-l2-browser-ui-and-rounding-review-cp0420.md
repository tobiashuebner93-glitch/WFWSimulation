# A01 Review – T-0063 L2 Browserpfad und Integer-Rundung (CP-0420)

**Status:** ENTWURF – UI-Pfad sichtbar; Modellierungsnachtrag vor Abschluss erforderlich
**Adressat:** A01 – MASTER_ORCHESTRATOR
**Agent:** A01 – MASTER_ORCHESTRATOR (begrenzte direkte Browser-/Runtime-Prüfung)
**Goals/Tickets:** MG-002 / SLG-002.2 / SLG-002.5 / T-0063 L2; Anschluss T-0065/T-0069
**Run-Profil:** Shared Run 04.01.2027–05.02.2027, `UPSWING`, `seed-v3-001`, optional `V3-L2-EXPORT-SHIFT-5PP-LAG1`
**Entscheidungen:** D-0161–D-0169; D-0169 alleiniger Wochen-Gesamtanfragenfaktor
**Vorgänger:** CP-0419 (A03 Finance PASS), CP-0418 (A02 Runtime), CP-0417 (A08 Design)
**Arbeitsbasis:** `main@8b72b7e`; 365 Statuszeilen im umfangreichen lokalen Arbeitsbaum; nichts verworfen, kein Commit/Push.

## Preflight und Prüfgrenze

Der A01-Preflight las AGENTS.md, Agentenstruktur/-Rechte, Goals, Ticket-Board (aktives MG-002/SLG-002.2/.5), Collaboration State, Decision Log, CP-0417–0419, A08-/A02-/A03-Berichte, Run-Setup, L2-Allocator, Restorevalidierung und vorhandene Regressionen. CP-0411–0419 bleiben unverändert.

A09 konnte seinen Auftrag im isolierten ChatGPT-Projektmirror nicht durchführen: der Mirror endet bei CP-0352, enthält weder aktuellen Code noch CP-0417–0419 und ist kein Git-Checkout. A01 prüfte den Runtimepfad im lokalen autoritativen Checkout selbst. Das ersetzt kein unabhängiges A09-Adversarialreview.

## Browserbefund

Das Startformular zeigt `NEUTRAL` standardmäßig und eine explizite synthetische Exportmix-Option. Auswahl und Run-ID-Bindung funktionieren; die Fixture erklärt den Januar-Ausgangspunkt, einmonatigen Lag, mindestens erforderlichen Zeitraum und die unveränderte Wochen-Gesamtmenge. Im Browser wurde der Shared Run mit leeren Testressourcen vom 04.01.2027 bis zum 01.02.2027 in Tagesaktionen geführt. Am 01.02. erschien eine nichtbuchende L2-Projektionskarte mit Quelle, Fixture, Lag, tatsächlichem Basismix und Istmix sowie angeforderter Kapazität. Bank, Erlös, Forderungen und SimTAX blieben unverändert.

## Modellierungslücke entdeckt

Bei der üblichen D-0169-Wochenmenge `N=5` erzeugt die aktuell umgesetzte wochenweise Rundung für Basismix `Klein 2 / Mittel 2 / Groß 1` und Exportsegmente Mittel/Groß denselben Istmix `Klein 2 / Mittel 2 / Groß 1`, obwohl die synthetische Fixture ein Ziel von +5 Prozentpunkten setzt. Die Rasterung auf ganze Anfragen verwirft damit den kleinen Wochenimpuls und kann die operative Mix-/Kapazitätswirkung im wiederkehrenden Fünf-Anfragenfall vollständig ausfallen lassen.

Die UI stellt Basis und tatsächliche Zuordnung nun transparent nebeneinander; sie behauptet keine tatsächliche Verschiebung, falls die Integerverteilung gleich bleibt. Das fachliche Ziel einer über Wochen reproduzierbar wirksamen, mengenwahrenden Verteilung ist dadurch noch nicht erfüllt. A02 soll eine deterministische Monats-Kumulation bzw. einen gleichwertigen Replay-sicheren Ausgleich implementieren: pro Woche exakt D-0169-`N`, über den Monat die synthetische +5pp-Zielverschiebung möglichst genau, mit stabiler Rundungsrestverteilung und unveränderter Anfrage-/Finanzgrenze.

## Prüfungen

- A03 führte sieben fachlich relevante Runtime-Regressionen aus: PASS.
- A01 wiederholte sieben L2-/Run-/Makro-/Markt-Regressionen: PASS.
- A01 UI-/Graph-/Marktregressionen: PASS; statischer Run-Graph blieb bei 20 Modulen und wurde mit vollständigem SHA-256-Graph-Token neu gebunden.
- Frischer Browserlauf: Opt-in-Auswahl, validierter Zeitraum, Jan→Feb-Lag, tatsächlicher Mix und Kapazitätsanzeige sichtbar; keine Finance-Mutation.
- `git diff --check` im betroffenen Änderungsscope: PASS.

## Weiteres Vorgehen

A02 ergänzt eine deterministische, save/restore-validierte Monats-Rundungsrestbehandlung für kleine Wochenanfragemengen. Danach folgen A03-Fachreview, ein unabhängiger A09-Versuch im autoritativen Checkout und A01-Browser-Replay. A05-/Run-Graph-Hashes müssen nach Runtimeänderung erneut generiert werden. T-0063/T-0065/T-0069 bleiben `IN_PROGRESS`; weder Gesamtfreigabe noch Releasefreigabe.

Der Browserbefund belegt eine begrenzte Desktop-Ansicht. Responsive Geräteansichten und vollständiger Jahressmoke für L2 wurden nicht ausgeführt. Kein Commit/Push.
