// Optional, non-posting plan-only sensitivity for unsubmitted V3 offers.
// This module deliberately has no finance, ledger, stock, BAB, or UI imports.
export const V3_OFFER_PLAN_SENSITIVITY_VERSION = 'V3-OFFER-PLAN-SENSITIVITY-1';
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const invalid = message => { throw new TypeError(message); };
function multiplyCentsByIndexHalfUp(cents, index) {
  // Convert the index's canonical decimal spelling to an integer ratio so the
  // cent result does not depend on binary floating-point tie behavior.
  const text = String(index);
  const match = /^(0|[1-9]\d*)(?:\.(\d+))?$/.exec(text);
  if (!match) invalid('plan index must be a positive decimal value');
  const scale = 10n ** BigInt((match[2] ?? '').length);
  const indexUnits = BigInt(match[1] + (match[2] ?? ''));
  const numerator = BigInt(cents) * indexUnits;
  const denominator = scale * 100n;
  const rounded = (numerator * 2n + denominator) / (denominator * 2n);
  if (rounded > BigInt(Number.MAX_SAFE_INTEGER)) invalid('adjusted direct cost exceeds safe integer range');
  return Number(rounded);
}

function selectedIndex(effects, target, offerPeriod) {
  const rows = effects.filter(row => row?.target === target);
  if (rows.length !== 1) return { pending: true, reason: `Es wird genau ein ${target} für ${offerPeriod} benötigt.` };
  const row = rows[0];
  const sourceOk = typeof row.sourceRef === 'string' && row.sourceRef.trim()
    && ['observed', 'synthetic_fixture'].includes(row.sourceType)
    && typeof row.modelVersion === 'string' && row.modelVersion.trim()
    && (typeof row.parameterSetId === 'string' && row.parameterSetId.trim()
      || typeof row.sourceSnapshotId === 'string' && row.sourceSnapshotId.trim())
    && Array.isArray(row.componentContributions) && row.componentContributions.length > 0;
  if (row.status !== 'projected' || row.accountingClass !== 'information_plan'
    || row.directFinanceEffect !== false || row.actualStateChanged !== false
    || row.basePeriod !== '2027-01' || row.effectivePeriod !== offerPeriod
    || row.before !== 100 || !Number.isFinite(row.after) || row.after <= 0
    || !sourceOk) return { pending: true, reason: `${target} fehlt mit eindeutiger Periode, Provenienz oder gültigem Planwert.` };
  const contributions = row.componentContributions;
  const expectedIds = target === 'procurementPlanIndex' ? ['material', 'logistics'] : ['wage'];
  if (contributions.map(item => item?.componentId).sort().join(',') !== expectedIds.slice().sort().join(',')
    || row.aggregationRuleId !== 'V3-L4-RAW-COMPONENT-INDEX-1') return { pending: true, reason: `${target} enthält nicht die vorgeschriebenen Komponenten oder Aggregationsregel.` };
  const weights = row.aggregationWeights;
  if (!weights || Object.keys(weights).sort().join(',') !== expectedIds.slice().sort().join(',')
    || expectedIds.some(id => typeof weights[id] !== 'number' || !Number.isFinite(weights[id]) || weights[id] < 0)
    || Math.abs(expectedIds.reduce((sum, id) => sum + weights[id], 0) - 1) > 1e-10) return { pending: true, reason: `${target} hat keine vollständigen und auf eins summierenden Komponenten-Gewichte.` };
  for (const item of contributions) {
    const validUnits = item.componentId === 'material' ? ['EUR/kg']
      : item.componentId === 'logistics' ? ['EUR/shipment', 'EUR/t-km'] : ['EUR/h'];
    const driver = item.driverIds?.[0];
    if (!validUnits.includes(item.unit) || !Number.isFinite(item.baseValue) || item.baseValue <= 0
      || !Number.isFinite(item.currentValue) || item.currentValue <= 0
      || !Number.isFinite(item.componentIndex) || Math.abs(item.componentIndex - 100 * item.currentValue / item.baseValue) > 1e-10
      || item.sourceType !== row.sourceType || typeof item.sourceRef !== 'string' || !item.sourceRef.trim()
      || !item.contributionId || !Array.isArray(item.driverIds) || item.driverIds.length !== 1
      || driver?.driverType !== 'raw_component' || driver.componentId !== item.componentId
      || driver.period !== row.sourcePeriod || driver.eventRef !== row.sourceRef
      || driver.contributionId !== item.contributionId || !driver.driverId || !driver.effectGroupId
      || (item.sourceType === 'observed' && !item.dataVintage && !row.sourceSnapshotId)) {
      return { pending: true, reason: `${target} enthält unvollständige oder inkonsistente Komponenten-/Quellenprovenienz.` };
    }
  }
  const calculated = target === 'wagePlanIndex'
    ? contributions[0].componentIndex
    : contributions.reduce((sum, item) => sum + weights[item.componentId] * item.componentIndex, 0);
  if (Math.abs(calculated - row.after) > 1e-9) return { pending: true, reason: `${target} entspricht nicht seinen Rohkomponenten, Gewichten und der Aggregationsregel.` };
  return { index: row.after, evidence: structuredClone(row) };
}

/**
 * Apply a player-selected procurement/wage plan index to explicit January-2027
 * base-cost lines. The result is a preview only; callers must snapshot it when
 * submitting the offer. A selected but incomplete path fails closed as pending.
 */
export function calculateV3OfferPlanSensitivity({ directCosts, mode = 'unadjusted', offerPeriod, effects = [] }) {
  if (!Array.isArray(directCosts)) invalid('directCosts must be an array');
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(offerPeriod ?? '')) invalid('offerPeriod must be YYYY-MM');
  if (!['unadjusted', 'apply_l4_plan_indices'].includes(mode)) invalid('mode must be explicitly unadjusted or apply_l4_plan_indices');
  if (mode === 'unadjusted') {
    return Object.freeze({
      status: 'ready', modelVersion: V3_OFFER_PLAN_SENSITIVITY_VERSION, mode, offerPeriod,
      directCosts: structuredClone(directCosts),
      evidence: { basePeriod: null, indexes: [], directFinanceEffect: false, actualStateChanged: false },
    });
  }
  if (!Array.isArray(effects)) invalid('effects must be an array');
  const needProcurement = directCosts.some(row => row?.category === 'material' || row?.category === 'logistics');
  const needWage = directCosts.some(row => row?.category === 'labor');
  const procurement = needProcurement ? selectedIndex(effects, 'procurementPlanIndex', offerPeriod) : null;
  const wage = needWage ? selectedIndex(effects, 'wagePlanIndex', offerPeriod) : null;
  const pending = [procurement, wage].filter(row => row?.pending);
  if (pending.length) return Object.freeze({
    status: 'pending', modelVersion: V3_OFFER_PLAN_SENSITIVITY_VERSION, mode, offerPeriod,
    directCosts: null, evidence: { directFinanceEffect: false, actualStateChanged: false },
    reasons: pending.map(row => row.reason),
  });

  const indexes = [];
  if (procurement) indexes.push({ target: 'procurementPlanIndex', index: procurement.index, evidence: procurement.evidence });
  if (wage) indexes.push({ target: 'wagePlanIndex', index: wage.index, evidence: wage.evidence });
  const rows = directCosts.map((line, i) => {
    if (!isRecord(line)) invalid(`directCosts[${i}] must be an object`);
    if (!['material', 'logistics', 'labor', 'other'].includes(line.category)) invalid(`directCosts[${i}].category must be material, logistics, labor, or other`);
    if (line.basePeriod !== '2027-01') invalid(`directCosts[${i}].basePeriod must be 2027-01`);
    if (!Number.isSafeInteger(line.amountCents) || line.amountCents < 0) invalid(`directCosts[${i}].amountCents must be a nonnegative safe integer`);
    const target = line.category === 'labor' ? 'wagePlanIndex'
      : ['material', 'logistics'].includes(line.category) ? 'procurementPlanIndex' : null;
    const index = target ? indexes.find(item => item.target === target)?.index : null;
    const adjusted = target ? multiplyCentsByIndexHalfUp(line.amountCents, index) : line.amountCents;
    if (!Number.isSafeInteger(adjusted)) invalid(`directCosts[${i}] adjusted amount exceeds safe integer range`);
    return { ...structuredClone(line), baseAmountCents: line.amountCents, amountCents: adjusted, appliedIndexTarget: target, appliedIndex: index };
  });
  return Object.freeze({
    status: 'ready', modelVersion: V3_OFFER_PLAN_SENSITIVITY_VERSION, mode, offerPeriod,
    directCosts: rows,
    evidence: {
      basePeriod: '2027-01', indexes: indexes.map(item => structuredClone(item)),
      aggregationRuleId: 'V3-L4-RAW-COMPONENT-INDEX-1',
      doubleCountGuard: 'BusinessInputCostIndex is not additionally applied to adjusted lines',
      rounding: 'positive half-up, per direct-cost line to cents',
      directFinanceEffect: false, actualStateChanged: false,
    },
  });
}
