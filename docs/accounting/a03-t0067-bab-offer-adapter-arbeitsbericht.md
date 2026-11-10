# A03 – T-0067 Grund-BAB-/Angebotsadapter: Arbeitsbericht

**Status:** Gewichtssemantik nach CP-0294 korrigiert; A03-Regressions PASS; A05-Schnittstellenanpassung offen
**Adressat:** A01 – MASTER_ORCHESTRATOR; nächster Adressat nach Freigabe: A05 – FRONTEND
**Agent:** A03 – ACCOUNTING_FINANCE
**Ziele/Ticket:** MG-002 / SLG-002.2 und SLG-002.5 / T-0067, Schnittstelle zu T-0069
**Basis:** `main` @ `8b72b7e35fd7bbd8d967655d0a97e0a01b93266`; vorhandene lokale Änderungen wurden erhalten
**Entscheidung:** D-0162; fachlicher Vertrag `a03-t0067-v3-kalkulations-bab-vertrag.md`

## Ergebnis

`prototype/v3-financial-calculation.js` exportiert `calculateV3OfferWithBab`. Die Funktion verbindet ausdrücklich eingegebene periodische BAB-Quellkostenpools und deren Verteilung mit einer expliziten Auftrags-Treiberbasis. Für `weights` ist nach CP-0294 nur eine gemeinsame positive physische Basis je Pool zulässig; alle Empfängertreiber nutzen dieselbe Einheit und bleiben innerhalb `B_g × w_g,c`. Unabhängige Empfängerbasen und Geld-/Treibermischungen werden abgewiesen. Die Funktion validiert Eingaben fail-closed, verteilt Primärkosten je Pool centgenau nach D-0162 und berechnet den Auftragsanteil aus exakten, ungerundeten Quotienten. Angezeigte Sätze sind als gerundet markiert und werden nicht für die Folgerechnung zurückverwendet.

Das Ergebnis enthält die bestehende Trennung von `dbICents`, `resultAfterDirectCostsCents`, `babAllocatedCents` und `resultAfterBabCents` sowie einen eingefrorenen, deterministischen `babSnapshot` mit Quellkosten, Verteilung, Satzbasis, Rundungsangaben und Auftragsanteilen. Es erzeugt weder Buchungen noch Cash, Forderungen, Rechnungen, Steuern oder Ledger-Einträge. `createV3OfferSnapshot` kann das gesamte Ergebnis als Kalkulationssnapshot für `submitV3RunOffer` einfrieren; Annahme hält Vertragspreis und Snapshot unverändert.

Es gibt keine impliziten Nullpools, Pauschalen, Zuschlagssätze, Steuersätze, Mengen, Klassifikationen oder BAB-Versionen. Auch eine ausdrücklich eingegebene leere direkte Kostenliste ist zulässig; Quelle und Einordnung jedes direkten Kostenpostens muss bei vorhandenen Positionen explizit sein.

## A05-Aufrufvertrag

Import in `prototype/v3/run.js` (A05 muss nach CP-0294 seine bisherige Parseroberfläche auf `rateBasis` anpassen):

```js
import { calculateV3OfferWithBab, createV3OfferSnapshot } from '../v3-financial-calculation.js';
```

Berechnung mit `keys` (künstliche Fixture-Werte, keine Markt- oder Produktvorgabe):

```js
const period = state.activeDay.date.slice(0, 7);
const calculation = calculateV3OfferWithBab({
  period,
  offerDate: state.activeDay.date,
  netPriceCents: 10000,
  directCosts: [{ id: 'material', amountCents: 6000, variable: true }],
  sourcePools: [{
    poolId: 'SHOP-POOL',
    sourceCostCenterId: 'CC-SHOP',
    costBasisId: 'PLAYER-ENTERED-COST-BASIS',
    period,
    poolCents: 10001,
    allocationMode: 'keys',
    unitLabel: 'h',
    recipients: [
      { costCenterId: 'CC-PROD', keyValue: '10' },
      { costCenterId: 'CC-ADMIN', keyValue: '5' }
    ]
  }],
  offerDrivers: [
    { poolId: 'SHOP-POOL', costCenterId: 'CC-PROD', period, basisKind: 'driver', quantity: '2', unitLabel: 'h' },
    { poolId: 'SHOP-POOL', costCenterId: 'CC-ADMIN', period, basisKind: 'driver', quantity: '1', unitLabel: 'h' }
  ]
});

const offerId = createV3MarketOfferId(state.modules.market, eventId);
const calculationSnapshot = createV3OfferSnapshot({
  offerId,
  submittedAt: state.activeDay.date,
  netPriceCents: calculation.netPriceCents,
  costVersion, // required explicit UI input; do not synthesize
  babVersion,  // required explicit UI input; do not synthesize
  calculation
});
const result = submitV3RunOffer(state, {
  eventId, inquiryId: inquiry.inquiryId, firmId: 'player',
  submittedAt: state.activeDay.date, calculationSnapshot
});
```

The UI must collect source-pool fields, receiver keys and the offer driver for every receiver. Use cents internally (UI euro values must be explicitly parsed/validated at the boundary); `period` is `YYYY-MM` and must match `offerDate`, each pool, each driver and every separately entered rate basis. Stable IDs are required. The sample only shows one pool and two receivers; it does not define live cost centers, values, driver units, cost classifications or versions.

### Gewichte (`weights`) – korrigierte gemeinsame Treiberbasis

`allocationMode: 'weights'` erwartet dimensionslose Empfängeranteile, deren Summe exakt `1` ist. Sie ordnen nur den Pool den Empfängern zu. Für einen Angebots-BAB-Anteil verlangt der Adapter genau eine zusätzliche gemeinsame positive physische Treiberbasis für diesen Pool. Beispiel (synthetische Werte):

```js
sourcePools: [{
  poolId: 'POOL', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'ENTERED-BASIS',
  period, poolCents: 10001, allocationMode: 'weights',
  recipients: [
    { costCenterId: 'CC-A', keyValue: '0.6' },
    { costCenterId: 'CC-B', keyValue: '0.4' }
  ],
  rateBasis: { basisKind: 'driver', value: '300', unitLabel: 'h', period }
}],
offerDrivers: [
  { poolId: 'POOL', costCenterId: 'CC-A', period, basisKind: 'driver', quantity: '6', unitLabel: 'h' },
  { poolId: 'POOL', costCenterId: 'CC-B', period, basisKind: 'driver', quantity: '20', unitLabel: 'h' }
]
```

Die Empfänger-Satzbasen betragen deterministisch `300 h × 0,6 = 180 h` und `300 h × 0,4 = 120 h`. Beide Angebotsmengen müssen dieselbe Einheit `h` verwenden und dürfen ihren jeweiligen Empfängeranteil nicht überschreiten. Der gemeinsame ungerundete Satz ist `10.001 Cent / 300 h`; die UI darf diesen Anzeigesatz nicht zurückmultiplizieren. Eine andere Einheit je Empfänger, unabhängige Empfängerbasen, `recipientRateBases` oder eine Geldbasis werden abgewiesen. Für `weights`-Allokation ohne Ratebasis kann `allocateV3BabPool` nur Pool-Verteilung/Reconciliation liefern und enthält kein Satzfeld; ein vollständiger Angebots-BAB-Anteil wird dann nicht berechnet. `calculateV3OfferWithBab` verlangt für jeden eingereichten Angebots-Pool eine gemeinsame Ratebasis und explizite Treiber sämtlicher Empfänger.

### Validation and result semantics

- `sourcePools` and `offerDrivers` must be non-empty; every pool has explicit stable IDs, same-period positive pool amount, allocation mode and nonempty receivers.
- `keys` requires one common nonempty physical `unitLabel`; keys are nonnegative and sum positive. Each offer driver uses that exact unit and cannot exceed its receiver period key.
- `weights` must sum exactly to one. Offer calculation requires one common matching-period physical `rateBasis` per source pool; every receiver uses the same unit and its driver quantity is bounded by the weighted share. Do not accept per-recipient rate basis fields or money bases. Allocation-only call `allocateV3BabPool({ poolCents, recipients, allocationMode: 'weights' })` has no rate field; it cannot be used as a priced offer result.
- Exactly one explicit offer driver is required for each receiver; unknown pools, duplicate receivers/drivers, missing keys/bases, negative/invalid monetary inputs, nonmatching periods or units and bad weights throw a validation error.
- Per-source-pool allocation reconciliation must be exactly zero cents. Job shares are rounded only once per pool by largest fractional remainder, with stable `costCenterId` as deterministic tie-break; the exact unrounded rational amount is retained in the snapshot.
- Direct-cost classification is passed via `directCosts[].variable` and must remain an explicit UI choice. Net price and costs use the same pre-tax basis; SimTAX is not part of this adapter.
- Read result fields by name; no field implies acceptance, invoicing, performance completion, cash, ledger or posting. Pass the returned object as `calculation` to `createV3OfferSnapshot`, then let the existing run offer submit path capture it.

## Dateien und Prüfungen

Produkt-/Testdateien aus diesem A03-Schritt:

- `prototype/v3-financial-calculation.js`
- `prototype/v3-financial-calculation-regressions.mjs`
- `docs/accounting/a03-t0067-bab-offer-adapter-arbeitsbericht.md`

Regressionen decken Primärkosten-Reconciliation, Rate aus ungerundeten Quellen, reproduzierbaren Angebots-/Annahmesnapshot, positiven/centnahen/negativen DB I, `weights` mit gemeinsamer physischer Treiberbasis, fehlende Basis ohne Ratefeld bei reiner Allokation, Rejection des CP-0294-h/kg-Mixes, falsche Basisperiode, Geld-/Mengentreiber-Mix, Gewichtsbasis-Überlauf, Restcentverteilung und ungültige Eingaben ab.

Ausgeführt, alle erfolgreich:

- `node --check prototype/v3-financial-calculation.js`
- `node --check prototype/v3-financial-calculation-regressions.mjs`
- `node prototype/v3-financial-calculation-regressions.mjs`
- `node prototype/v3-market-simulation-regressions.mjs`
- `node prototype/v3-run-orchestrator-regressions.mjs`
- `node --check prototype/v3/run.js`

A03 hat keine unabhängige Browser-/Mobilprüfung durchgeführt. Nach der CP-0294-Korrektur sind A05s Parser und Gewichtsregression noch auf `recipientRateBases` ausgerichtet; die aktuelle A05-Regression bricht deshalb bis zu ihrer erneuten Übergabe erwartungsgemäß an dieser veralteten Eingabeform. A05 muss `rateBasis` gemeinsam erfassen/validieren, die Auftragsmengen gegen `B_g × w_g,c` begrenzen und anschließend die vom A03-Review zuvor beanstandete BAB-Aufschlüsselung mit Ratenbasis, Einheit und Reconciliation sichtbar darstellen. Keine Schema-/Architekturänderung, kein Commit oder Push.
