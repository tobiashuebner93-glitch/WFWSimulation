// Non-posting, user-approved synthetic sensitivity overlay for T-0074/G3.
// This is not an accounting, cash, tax, inventory, COGS, or ledger source.
export const V3_T0074_ECONOMIC_SCENARIO_ID = 'D-0187-SYNTHETIC-TEST-ONLY';
export const V3_T0074_ECONOMIC_ASSUMPTIONS = Object.freeze({
  variableOperatingCostBasisPoints: 3500,
  monthlyFixedOperatingCostCents: 120000,
  monthlyOwnerDrawCents: 180000,
  status: 'synthetic_user_approved_test_assumption',
});

function requireCents(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(`${label} must be non-negative safe integer cents`);
  return value;
}

function roundBasisPoints(cents, basisPoints) {
  return Number((BigInt(cents) * BigInt(basisPoints) + 5000n) / 10000n);
}

/**
 * Apply the approved test-only assumptions to 12 monthly net-revenue observations.
 * Private drawings are shown separately and are never classified as operating expense.
 */
export function assessV3T0074EconomicScenario(monthlyRevenue) {
  if (!Array.isArray(monthlyRevenue) || monthlyRevenue.length !== 12) {
    throw new TypeError('monthlyRevenue must contain exactly twelve month rows');
  }
  const periods = monthlyRevenue.map((row, index) => {
    const period = row?.period;
    if (!/^2027-(0[1-9]|1[0-2])$/.test(period ?? '') || (index && period <= monthlyRevenue[index - 1].period)) {
      throw new TypeError(`monthlyRevenue[${index}] must use unique ascending 2027 calendar months`);
    }
    const revenueCents = requireCents(row.netRevenueCents, `monthlyRevenue[${index}].netRevenueCents`);
    const variableOperatingCostCents = roundBasisPoints(revenueCents, V3_T0074_ECONOMIC_ASSUMPTIONS.variableOperatingCostBasisPoints);
    const fixedOperatingCostCents = V3_T0074_ECONOMIC_ASSUMPTIONS.monthlyFixedOperatingCostCents;
    const ownerDrawCents = V3_T0074_ECONOMIC_ASSUMPTIONS.monthlyOwnerDrawCents;
    const operatingResultCents = revenueCents - variableOperatingCostCents - fixedOperatingCostCents;
    if (!Number.isSafeInteger(operatingResultCents)) throw new TypeError(`monthlyRevenue[${index}] operating result exceeds safe integer cents`);
    return {
      period, netRevenueCents: revenueCents, variableOperatingCostCents,
      fixedOperatingCostCents, operatingResultCents, ownerDrawCents,
      scenarioSurplusAfterOwnerDrawCents: operatingResultCents - ownerDrawCents,
      costSource: V3_T0074_ECONOMIC_SCENARIO_ID,
    };
  });
  const sum = key => {
    const total = periods.reduce((result, row) => result + BigInt(row[key]), 0n);
    if (total > BigInt(Number.MAX_SAFE_INTEGER) || total < BigInt(Number.MIN_SAFE_INTEGER)) throw new TypeError(`annual ${key} exceeds safe integer cents`);
    return Number(total);
  };
  const annualOperatingResultCents = sum('operatingResultCents');
  return {
    scenarioId: V3_T0074_ECONOMIC_SCENARIO_ID,
    status: V3_T0074_ECONOMIC_ASSUMPTIONS.status,
    postingStatus: 'non_posting_scenario_only',
    resultClassification: annualOperatingResultCents > 0 ? 'positive_operating_result' : annualOperatingResultCents < 0 ? 'negative_operating_result' : 'break_even',
    assumptions: { ...V3_T0074_ECONOMIC_ASSUMPTIONS },
    annual: {
      netRevenueCents: sum('netRevenueCents'),
      variableOperatingCostCents: sum('variableOperatingCostCents'),
      fixedOperatingCostCents: sum('fixedOperatingCostCents'),
      operatingResultCents: annualOperatingResultCents,
      ownerDrawCents: sum('ownerDrawCents'),
      scenarioSurplusAfterOwnerDrawCents: sum('scenarioSurplusAfterOwnerDrawCents'),
    },
    periods,
    excludedFromPosting: ['cash', 'bank', 'receivables', 'payables', 'tax', 'inventory', 'WIP', 'finishedGoods', 'COGS', 'BAB', 'ledger'],
    limitations: ['synthetic sensitivity only', 'not actual expense evidence', 'not a liquidity forecast', 'not a solvency or full-year-accounting conclusion'],
  };
}
