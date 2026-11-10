// Non-posting, provenance-bound benchmark for the V3 MRO-to-company-rate context.
// D-0022 supplies a reference range and mean, not an individual borrower quote.
export const V3_COMPANY_MARGIN_BENCHMARK = Object.freeze({
  decisionId: 'D-0022',
  unit: 'percentage_points',
  low: 0.5,
  mean: 3,
  high: 5.5,
});

export const V3_FINANCING_REFERENCE_VERSION = 'V3-FINANCING-REFERENCE-D0022-1';

export function projectV3FinancingReference(macroState) {
  const snapshot = macroState?.periods?.at(-1) ?? null;
  const mro = snapshot?.mro ?? null;
  const rateAvailable = Number.isFinite(mro?.valuePctPA);

  return {
    version: V3_FINANCING_REFERENCE_VERSION,
    status: rateAvailable ? 'reference_available' : 'pending',
    runId: snapshot?.runId ?? macroState?.runId ?? null,
    scenarioId: snapshot?.scenarioId ?? macroState?.scenarioId ?? null,
    period: snapshot?.period ?? null,
    referenceRate: rateAvailable ? {
      valuePctPA: mro.valuePctPA,
      sourceType: mro.sourceType ?? 'unknown',
      sourceRef: mro.sourceRef ?? null,
      observedPeriod: mro.observedPeriod ?? mro.referencePeriod ?? null,
      effectiveFrom: mro.effectiveFrom ?? null,
      publishedAt: mro.publishedAt ?? null,
      dataVintage: mro.dataVintage ?? null,
      sourceSnapshotId: mro.sourceSnapshotId ?? snapshot?.sourceSnapshotId ?? null,
      lagPeriods: Number.isInteger(mro.lagPeriods) ? mro.lagPeriods : 0,
      formulaId: mro.formulaId ?? null,
      assumptionStatus: mro.assumptionStatus ?? null,
    } : null,
    marginBenchmark: { ...V3_COMPANY_MARGIN_BENCHMARK, status: 'approved_reference_only' },
    individualTerms: {
      status: 'pending',
      spreadPp: null,
      ratePctPA: null,
      assessmentFactors: ['equity_ratio', 'balance_sheet_total', 'payment_history'],
      assessmentFormula: null,
      contractId: null,
      contractVersion: null,
    },
    effects: {
      createsCreditContract: false,
      createsFinancialEvent: false,
      createsLiability: false,
      createsInterestExpense: false,
      changesCash: false,
      changesReceivables: false,
      changesPayables: false,
      changesExistingContracts: false,
      changesDispo: false,
      changesDemandFactor: false,
    },
  };
}
