# A09 – T-0078 UPSWING-Recovery-Re-Review (CP-0489)

**Adressat:** A01 – MASTER_ORCHESTRATOR
**Datum:** 2026-11-01
**Ergebnis:** **PASS für den dokumentierten UPSWING-Recovery-Slice.** T-0078 bleibt offen, bis BOOM, DOWNTURN und LOW jeweils dieselben Baseline-/Restore-Kriterien bestehen.

## Preflight und Prüfumfang

Checkout `C:\Users\Tobia\Documents\GitHub\WFWSimulation`, Branch `main`, HEAD `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`, Status 527. Alle sieben vom A01-Preflight angegebenen Governance-Hashes stimmen. A02-Bericht SHA-256 `992CCA364616668AB84F4211EAB819BABA7DDF228186EE5779521D0BB6C2F14B`; Harness `prototype/v3-t0078-recovery-smoke.mjs` SHA-256 `211F57EF216942C42C970B83E408FC3435013D6AF5F708A9A959FA84DA188DE5`; Baselinefixture SHA-256 `DD85588B77C372B1A103CC425507CBA5C6BB22B5BD28CB0A85E89AD42978EC3B`; `prototype/v3/run.js` SHA-256 `F212881101238256AE8C7CE098D4070B38A04FC9235AB96BAD0206E310EE3C9A`.

Der Review vergleicht die A02-Messwerte mit den aktuellen Harness-Assertions, Baselinefixture und Restore-Envelope-Grenze. Die zwei ca. 4-Minuten-Jahresläufe wurden nicht erneut ausgeführt; daher ist dies ein unabhängiger Artefakt-/Assertionsreview, keine zweite Laufzeitreproduktion. `node --check prototype/v3/run.js` und `node --check prototype/v3-t0078-recovery-smoke.mjs` bestanden.

## UPSWING-Vektor

A02 dokumentiert Baseline und Fortsetzung mit demselben Profil `UPSWING`, Seed `T-0078-recovery-seed-1`, Daten 2027-01-04 bis 2027-12-31. Der Baseline-Endhash und der Wiederaufnahme-Endhash stimmen exakt überein: `bdb8c1b38eb9ea3ffeb20fc3a94954a731766f9ae384e0960ebc20dd5dc00c4b`. Der Recovery-Lauf erstellt und restauriert am **2027-06-30** das Run- und Finance-State-Envelope; der Harness bindet beide vollständigen Zustände vor der Fortsetzung per Hash und prüft `currentDate` gleich Checkpoint. Beide Läufe enden mit 362 Tagesdaten und 12 Makroperioden. Der dokumentierte UPSWING-Checkpoint enthält ein abgeschlossenes Work Order, eine Rechnung und einen Zahlungsvorgang.

Der Harness prüft zusätzlich den vollständigen finalen Envelope-Roundtrip. Nach Restore werden Rechnungserstellung und Receipt-Verarbeitung wiederholt; beides erzeugt keine zweite Wirkung und der Zustandhash bleibt identisch. Das unterstützt die behauptete Dedupe-/Replay-Idempotenz für diese Invoice-/Receipt-Wiederholungen.

## Fail-closed-Envelopefälle

Der Harness klont jeweils das Envelope, verändert genau einen der sechs dokumentierten Negativfälle und erwartet eine Exception: unsupported saveVersion, doppelte Run-Event-ID, negatives Materialquantum, Finance-State aus anderem Run, doppelte Invoice-ID und doppeltes Zahlungsevent. Für jeden Reject vergleicht er den serialisierten Kandidaten vor und nach dem Restoreversuch; zusätzlich bleibt das gültige Original-Envelope unverändert. Ein gültiges Envelope wird anschließend erfolgreich restauriert. `run.js` prüft doppelte nichtleere Invoice-IDs vor Finance-Reconciliation und vor Clone/Rückgabe; der Restorepfad repariert oder dedupliziert den Save nicht.

## Urteil und Grenze

Für den dokumentierten UPSWING-Slice sind Baseline-/Fortsetzungs-Endhash, Checkpointdatum, Save/Restore-Run- und Finance-State-Bindung, sechs unveränderte Rejectfälle und gültiger Roundtrip im aktuellen Harness nachvollziehbar. **PASS gilt nur für diesen Slice und auf Basis der A02-Laufbelege plus Code-/Assertion-Review.** Es gibt keinen Browser-/Gerätenachweis. Die drei Profile BOOM, DOWNTURN und LOW sind nicht abgedeckt; damit bleibt T-0078 als Unterticket offen und es folgt kein PASS für T-0069 G8 oder andere Gates. Keine Code-, Ticket-, Governance- oder Commitänderung vorgenommen.
