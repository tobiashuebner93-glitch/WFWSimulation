# A09 QA-Review – T-0079 Laufzeitgrenze (CP-0476)

**STATUS:** PASS für die ex-ante Laufzeitgrenze allein; Profilbestehen und T-0079-Abschluss nicht bewertet  
**ADRESSAT:** A01 – MASTER_ORCHESTRATOR  
**AGENT:** A09 – QA  
**GOALS/TICKETS:** MG-002 / SLG-002.5 / T-0069 G9 / T-0079  
**BASIS:** CP-0476; `main@8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; Windows / Node.js v24.22.1 / `prototype/v3-year-smoke.mjs`  
**DIGEST:** Alle sieben CP-0476-Control-Plane-SHA-256 beim Preflight erneut bestätigt. Checkout mit 570 vorbestehenden Statuszeilen; read-only, keine Dateien geändert.

## Bewertung der vorgeschlagenen Grenze

Die vorgeschlagene Obergrenze von **360 Sekunden je Profil** ist als reproduzierbare ex-ante Testgrenze für die genannte Zielumgebung und den genannten Jahres-Smoke **ausreichend konkret**. Sie liegt 120 Sekunden bzw. 50 % über der dokumentierten abgeschlossenen 362-Tage-UPSWING-Baseline von CP-0451 (240,069 s). Der spätere UPSWING-Lauf bei A02 erreichte die dortige harte 240-s-Grenze nach 240,405 s ohne Abschlussbericht; daraus folgt weder ein Jahres-PASS noch eine tatsächliche Laufzeit von genau 240,405 s, aber es begründet die geplante Reserve.

Die 30-/90-Tage-Messungen sind Plausibilitäts- und Regressionsdaten, keine belastbare Hochrechnung auf 362 Tage: CP-0475 meldet 1,495 s / 10,691 s, der aktuelle A02-Bericht 1,666 s / 12,664 s (rund +11 % / +18 %). Zusammen mit der unbekannten nichtlinearen Validatorarbeit stützen sie keine Garantie, dass der Jahreslauf 360 s unterschreitet. Als vorab festgelegte Abbruchschwelle ist 360 s dennoch sinnvoll: Ein Überschreiten ergibt eindeutig NONPASS, statt einen unbegrenzten Lauf oder nachträgliches Anpassen der Grenze zu erlauben. Das ist ein Testlimit, keine Produktlaufzeitgarantie.

## Nächster sinnvoller Schritt

Ein **einzelner UPSWING-Jahresprofilrun mit derselben 360-s-Grenze** ist ein sinnvoller nächster Prüfschritt, sofern die Grenze vor dem Start im Ticket festgeschrieben bleibt. Kein Vierprofil- oder Same-seed-Lauf wurde von A09 gestartet. Erst ein abgeschlossener Lauf innerhalb des Limits kann diesen Profilfall bestehen lassen; Timeout, kontrollierter Abbruch oder fehlender Abschlussbericht ist NONPASS und darf keinen Endhash/PASS vortäuschen.

## Erforderliche Laufprotokollierung

Vor Start: Zielumgebung (OS/Node-Version), exakter Befehl/Fixture, Profil-/Run-ID, Seed, Simulationsstart/-ende, Modell-/Fixtureversion und feste 360-s-Grenze. Während/nach dem Lauf mindestens:

- Wall-clock-Laufzeit mit monotonic timer, Start-/Endzeit und erreichte Simulationsperiode/Tag;
- Ende-Status `completed`, `timeout` oder konkreter Fehler/Abbruch samt Zeitpunkt und Grund;
- ausgeführte Simulationstage/Events und Vollvalidatoraufrufe insgesamt (soweit möglich getrennt nach Init, Tagesöffnung, Tagesschluss, final);
- bei Abschluss: State-/Eventhash und Validator-Endzustand; bei Abbruch ausdrücklich `kein Endhash / kein Abschlussbericht`;
- identische Logs für jeden späteren Profilrun und keine Wiederverwendung eines abgebrochenen Runs als PASS.

Die vom Ticket verlangte spätere Vierprofilprüfung muss dieselbe vorher festgeschriebene Obergrenze je Profil sowie Laufzeit, Validatorzahl und Abbruchstatus protokollieren. Dieser Bericht bestätigt allein die Qualität der vorgeschlagenen Messgrenze, nicht das Bestehen eines Jahresprofils oder den T-0069-G9-Gateabschluss.

**AUSFÜHRUNG:** Dokumentenreview; kein Lauf gestartet.  
**UNABHÄNGIGE QA:** PASS nur für die ex-ante Grenze von 360 s/profil als Testregel.  
**GIT:** read-only; kein Stage/Commit/Push.
