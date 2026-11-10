// Pure V3 finance/calculation helpers. No ledger, cash, stock, UI, V1 or V2 access.
export const V3_FINANCIAL_CALCULATION_VERSION = 'V3-FINANCIAL-CALCULATION-1';
const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
const CENTS_PER_EURO = 100n;

function invalid(message) { throw new TypeError(message); }
function isRecord(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function assertId(value, field) {
  if (typeof value !== 'string' || !value.trim()) invalid(`${field} must be a non-empty stable ID`);
  return value;
}
function assertSafeInteger(value, field, { min = 0 } = {}) {
  if (!Number.isSafeInteger(value) || value < min) invalid(`${field} must be a safe integer >= ${min}`);
  return BigInt(value);
}
function assertSignedSafeInteger(value, field) {
  if (!Number.isSafeInteger(value)) invalid(`${field} must be a safe integer`);
  return BigInt(value);
}
function assertDate(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) invalid(`${field} must be an ISO date YYYY-MM-DD`);
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) invalid(`${field} must be a real calendar date`);
  return value;
}
function parseDecimal(value, field) {
  // Fractional quantities must be decimal strings to avoid binary-float ambiguity.
  if (typeof value === 'number' && Number.isSafeInteger(value)) value = String(value);
  if (typeof value !== 'string' || !/^(?:0|[1-9]\d*)(?:\.\d{1,6})?$/.test(value)) {
    invalid(`${field} must be a non-negative decimal string (up to six fractional digits) or safe integer`);
  }
  const [whole, fraction = ''] = value.split('.');
  return { digits: BigInt(whole + fraction), scale: 10n ** BigInt(fraction.length) };
}
function normalizeDecimals(values, field) {
  const parsed = values.map((value, index) => parseDecimal(value, `${field}[${index}]`));
  const scale = parsed.reduce((max, item) => item.scale > max ? item.scale : max, 1n);
  return { scale, values: parsed.map(item => item.digits * (scale / item.scale)) };
}
function toSafeNumber(value, field) {
  if (value > MAX_SAFE_BIGINT || value < -MAX_SAFE_BIGINT) invalid(`${field} exceeds the safe integer range`);
  return Number(value);
}
function roundHalfUpPositive(numerator, denominator) {
  if (numerator < 0n || denominator <= 0n) invalid('rounding requires a non-negative numerator and positive denominator');
  return (numerator * 2n + denominator) / (denominator * 2n);
}
function formatCents(cents) {
  const value = BigInt(cents);
  const sign = value < 0n ? '-' : '';
  const abs = value < 0n ? -value : value;
  return `${sign}${abs / CENTS_PER_EURO},${String(abs % CENTS_PER_EURO).padStart(2, '0')} €`;
}
function formatHundredths(value, suffix) {
  const n = BigInt(value);
  const sign = n < 0n ? '-' : '';
  const abs = n < 0n ? -n : n;
  return `${sign}${abs / 100n},${String(abs % 100n).padStart(2, '0')}${suffix}`;
}
function deepCloneJson(value, field = 'value') {
  let serialized;
  try { serialized = JSON.stringify(value); } catch { invalid(`${field} must be JSON-serializable`); }
  if (serialized === undefined) invalid(`${field} must be JSON-serializable`);
  return JSON.parse(serialized);
}
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

/** Calculate DB I and the direct-cost result without classifying any line implicitly. */
export function calculateV3OfferEstimate({ netPriceCents, directCosts, babAllocatedCents = 0 }) {
  const price = assertSafeInteger(netPriceCents, 'netPriceCents');
  const bab = assertSafeInteger(babAllocatedCents, 'babAllocatedCents');
  if (!Array.isArray(directCosts)) invalid('directCosts must be an array');
  const seen = new Set();
  let directTotal = 0n;
  let variableTotal = 0n;
  const lines = directCosts.map((line, index) => {
    if (!isRecord(line)) invalid(`directCosts[${index}] must be an object`);
    const id = assertId(line.id, `directCosts[${index}].id`);
    if (seen.has(id)) invalid(`duplicate direct cost ID: ${id}`);
    seen.add(id);
    const amount = assertSafeInteger(line.amountCents, `directCosts[${index}].amountCents`);
    if (typeof line.variable !== 'boolean') invalid(`directCosts[${index}].variable must be explicitly true or false`);
    directTotal += amount;
    if (line.variable) variableTotal += amount;
    return { id, amountCents: toSafeNumber(amount, `directCosts[${index}].amountCents`), variable: line.variable };
  });
  const dbI = price - variableTotal;
  const directResult = price - directTotal;
  const afterBab = directResult - bab;
  return Object.freeze({
    modelVersion: V3_FINANCIAL_CALCULATION_VERSION,
    netPriceCents: toSafeNumber(price, 'netPriceCents'),
    directCosts: Object.freeze(lines),
    variableDirectCostsCents: toSafeNumber(variableTotal, 'variableDirectCostsCents'),
    allDirectCostsCents: toSafeNumber(directTotal, 'allDirectCostsCents'),
    dbICents: toSafeNumber(dbI, 'dbICents'),
    dbICentNear: dbI >= -1n && dbI <= 1n,
    resultAfterDirectCostsCents: toSafeNumber(directResult, 'resultAfterDirectCostsCents'),
    babAllocatedCents: toSafeNumber(bab, 'babAllocatedCents'),
    resultAfterBabCents: toSafeNumber(afterBab, 'resultAfterBabCents')
  });
}

/** Return a serializable exact rate fraction plus a rounded display-only rate. */
export function calculateV3BabRate({ poolCents, basisKind, basisValue, unitLabel = '' }) {
  const pool = assertSafeInteger(poolCents, 'poolCents');
  if (basisKind === 'driver') {
    const basis = parseDecimal(basisValue, 'basisValue');
    if (basis.digits === 0n || typeof unitLabel !== 'string' || !unitLabel.trim()) invalid('driver basis and unitLabel must be positive/non-empty');
    const numeratorCents = pool * basis.scale;
    const denominator = basis.digits;
    const displayedCentsPerUnit = roundHalfUpPositive(numeratorCents, denominator);
    return Object.freeze({
      basisKind,
      numeratorCents: numeratorCents.toString(),
      denominator: denominator.toString(),
      basisScale: basis.scale.toString(),
      displayValue: `${formatCents(displayedCentsPerUnit).replace(" €", " €/")}${unitLabel.trim()}`,
      displayRounded: true,
      unitLabel: unitLabel.trim(),
      calculationUsesDisplayValue: false
    });
  }
  if (basisKind === 'money') {
    const basis = assertSafeInteger(basisValue, 'basisValue');
    if (basis === 0n) invalid('money basis must be positive');
    // z = pool / monetary basis; display as percent with two fractional digits.
    const displayedPercentHundredths = roundHalfUpPositive(pool * 10000n, basis);
    return Object.freeze({
      basisKind,
      numeratorCents: pool.toString(),
      denominator: basis.toString(),
      basisScale: '1',
      displayValue: formatHundredths(displayedPercentHundredths, '%'),
      displayRounded: true,
      unitLabel: '%',
      calculationUsesDisplayValue: false
    });
  }
  invalid('basisKind must be "driver" or "money"');
}

/** Allocate one positive BAB pool exactly in cents; stable IDs break equal remainders. */
export function allocateV3BabPool({ poolCents, recipients, unitLabel = '', allocationMode = 'keys' }) {
  const pool = assertSafeInteger(poolCents, 'poolCents');
  if (!Array.isArray(recipients) || recipients.length === 0) invalid('recipients must be a non-empty array');
  const ids = new Set();
  const normalized = recipients.map((item, index) => {
    if (!isRecord(item)) invalid(`recipients[${index}] must be an object`);
    const costCenterId = assertId(item.costCenterId, `recipients[${index}].costCenterId`);
    if (ids.has(costCenterId)) invalid(`duplicate costCenterId: ${costCenterId}`);
    ids.add(costCenterId);
    return { costCenterId, keyValue: item.keyValue };
  });
  const { scale, values } = normalizeDecimals(normalized.map(item => item.keyValue), 'keyValue');
  const totalKey = values.reduce((sum, value) => sum + value, 0n);
  if (allocationMode !== 'keys' && allocationMode !== 'weights') invalid('allocationMode must be "keys" or "weights"');
  if (totalKey <= 0n) invalid('sum of recipient keys must be positive');
  if (allocationMode === 'weights' && (totalKey !== scale || values.some(value => value > scale))) invalid('weight values must be decimal fractions between 0 and 1 summing exactly to 1');

  const rows = normalized.map((item, index) => {
    const numerator = pool * values[index];
    return {
      costCenterId: item.costCenterId,
      keyValue: String(item.keyValue),
      rawNumerator: numerator,
      floorCents: numerator / totalKey,
      remainder: numerator % totalKey
    };
  });
  const allocatedFloor = rows.reduce((sum, row) => sum + row.floorCents, 0n);
  let remainderCents = pool - allocatedFloor;
  const ranked = [...rows].sort((a, b) => {
    if (a.remainder !== b.remainder) return a.remainder > b.remainder ? -1 : 1;
    return a.costCenterId < b.costCenterId ? -1 : a.costCenterId > b.costCenterId ? 1 : 0;
  });
  for (let index = 0; remainderCents > 0n; index++, remainderCents--) {
    if (index >= ranked.length) invalid('remainder allocation exceeded recipient count');
    ranked[index].floorCents += 1n;
  }
  const allocations = rows.map(row => Object.freeze({
    costCenterId: row.costCenterId,
    keyValue: row.keyValue,
    rawAmountCentsNumerator: row.rawNumerator.toString(),
    rawAmountCentsDenominator: totalKey.toString(),
    amountCents: toSafeNumber(row.floorCents, 'amountCents')
  }));
  const totalAllocated = allocations.reduce((sum, row) => sum + BigInt(row.amountCents), 0n);
  const result = {
    modelVersion: V3_FINANCIAL_CALCULATION_VERSION,
    poolCents: toSafeNumber(pool, 'poolCents'),
    allocationMode,
    allocations: Object.freeze(allocations),
    reconciliationDifferenceCents: toSafeNumber(pool - totalAllocated, 'reconciliationDifferenceCents'),
    reconciled: totalAllocated === pool
  };
  // Physical driver keys define their own denominator. Normalized weights do not
  // carry a unit, so a rate must be calculated separately from an explicit basis.
  if (allocationMode === 'keys') {
    result.rate = calculateV3BabRate({
      poolCents: toSafeNumber(pool, 'poolCents'),
      basisKind: 'driver',
      basisValue: decimalFromScaled(totalKey, scale),
      unitLabel: unitLabel || 'Treiber'
    });
  }
  return Object.freeze(result);
}
function decimalFromScaled(digits, scale) {
  if (scale === 1n) return digits.toString();
  const places = scale.toString().length - 1;
  const whole = digits / scale;
  const fraction = String(digits % scale).padStart(places, '0').replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : String(whole);
}

/** Classify flow values by their event calendar month; retain stock snapshots by date. */
export function aggregateV3KpiPeriods({ flows = [], stockSnapshots = [] }) {
  if (!Array.isArray(flows) || !Array.isArray(stockSnapshots)) invalid('flows and stockSnapshots must be arrays');
  const monthlyFlows = Object.create(null);
  const yearlyFlows = Object.create(null);
  for (const [index, flow] of flows.entries()) {
    if (!isRecord(flow)) invalid(`flows[${index}] must be an object`);
    const metricId = assertId(flow.metricId, `flows[${index}].metricId`);
    const date = assertDate(flow.date, `flows[${index}].date`);
    const amount = assertSafeInteger(flow.amountCents, `flows[${index}].amountCents`, { min: -Number.MAX_SAFE_INTEGER });
    const month = date.slice(0, 7);
    monthlyFlows[metricId] ||= Object.create(null);
    monthlyFlows[metricId][month] = (monthlyFlows[metricId][month] || 0) + Number(amount);
    const year = date.slice(0, 4);
    yearlyFlows[year] ||= Object.create(null);
    yearlyFlows[year][metricId] = (yearlyFlows[year][metricId] || 0) + Number(amount);
    if (!Number.isSafeInteger(monthlyFlows[metricId][month]) || !Number.isSafeInteger(yearlyFlows[year][metricId])) invalid('aggregated flow exceeds safe integer range');
  }
  const snapshots = stockSnapshots.map((snapshot, index) => {
    if (!isRecord(snapshot)) invalid(`stockSnapshots[${index}] must be an object`);
    return Object.freeze({
      metricId: assertId(snapshot.metricId, `stockSnapshots[${index}].metricId`),
      date: assertDate(snapshot.date, `stockSnapshots[${index}].date`),
      amountCents: toSafeNumber(BigInt(assertSignedSafeInteger(snapshot.amountCents, `stockSnapshots[${index}].amountCents`)), `stockSnapshots[${index}].amountCents`)
    });
  }).sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.metricId < b.metricId ? -1 : a.metricId > b.metricId ? 1 : 0);
  return Object.freeze({
    modelVersion: V3_FINANCIAL_CALCULATION_VERSION,
    monthlyFlows: deepFreeze(monthlyFlows),
    yearlyFlows: deepFreeze(yearlyFlows),
    stockSnapshots: Object.freeze(snapshots)
  });
}

/** Create an immutable offer calculation snapshot at submission; no financial side effects. */
export function createV3OfferSnapshot({ offerId, submittedAt, netPriceCents, costVersion, babVersion, calculation }) {
  assertId(offerId, 'offerId');
  assertDate(submittedAt, 'submittedAt');
  const price = assertSafeInteger(netPriceCents, 'netPriceCents');
  assertId(costVersion, 'costVersion');
  assertId(babVersion, 'babVersion');
  if (!isRecord(calculation)) invalid('calculation must be an object');
  const copiedCalculation = deepCloneJson(calculation, 'calculation');
  if (calculation.netPriceCents !== undefined && calculation.netPriceCents !== Number(price)) invalid('snapshot price must match calculation netPriceCents');
  return deepFreeze({
    modelVersion: V3_FINANCIAL_CALCULATION_VERSION,
    offerId,
    submittedAt,
    netPriceCents: Number(price),
    costVersion,
    babVersion,
    calculation: copiedCalculation
  });
}

/** Acceptance carries the submitted price/snapshot unchanged and creates no ledger effects. */
export function acceptV3OfferSnapshot(snapshot, acceptedAt) {
  if (!isRecord(snapshot) || snapshot.modelVersion !== V3_FINANCIAL_CALCULATION_VERSION) invalid('snapshot is not a V3 offer calculation snapshot');
  assertDate(acceptedAt, 'acceptedAt');
  if (acceptedAt < assertDate(snapshot.submittedAt, 'snapshot.submittedAt')) invalid('acceptedAt cannot precede submission');
  if (!Number.isSafeInteger(snapshot.netPriceCents) || snapshot.netPriceCents < 0) invalid('snapshot netPriceCents is invalid');
  const stableSnapshot = deepCloneJson(snapshot, 'snapshot');
  return deepFreeze({
    modelVersion: V3_FINANCIAL_CALCULATION_VERSION,
    offerId: assertId(snapshot.offerId, 'snapshot.offerId'),
    acceptedAt,
    contractPriceCents: snapshot.netPriceCents,
    snapshot: stableSnapshot
  });
}

function assertAllowedKeys(value, allowed, field) {
  if (!isRecord(value)) invalid(`${field} must be an object`);
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(value)) if (!allowedSet.has(key)) invalid(`${field}.${key} is not supported`);
}
function assertPeriod(value, field) {
  if (typeof value !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) invalid(`${field} must be a calendar month YYYY-MM`);
  return value;
}
function roundRatioHalfUp(numerator, denominator, field) {
  if (numerator < 0n || denominator <= 0n) invalid(`${field} requires a non-negative numerator and positive denominator`);
  return (numerator * 2n + denominator) / (denominator * 2n);
}
function compareDecimal(left, right) {
  const scale = left.scale > right.scale ? left.scale : right.scale;
  const a = left.digits * (scale / left.scale); const b = right.digits * (scale / right.scale);
  return a < b ? -1 : a > b ? 1 : 0;
}

function bigintGcd(a, b) {
  while (b !== 0n) { const remainder = a % b; a = b; b = remainder; }
  return a < 0n ? -a : a;
}
function allocateOfferPoolCents(rows, poolId) {
  let totalNumerator = 0n; let totalDenominator = 1n;
  const ranked = rows.map(row => {
    const numerator = BigInt(row.rawOfferAmountCentsNumerator);
    const denominator = BigInt(row.rawOfferAmountCentsDenominator);
    const divisor = bigintGcd(totalDenominator, denominator);
    totalNumerator = totalNumerator * (denominator / divisor) + numerator * (totalDenominator / divisor);
    totalDenominator = (totalDenominator / divisor) * denominator;
    const reduce = bigintGcd(totalNumerator, totalDenominator);
    totalNumerator /= reduce; totalDenominator /= reduce;
    return { row, numerator, denominator, floorCents: numerator / denominator, remainder: numerator % denominator };
  });
  const floorTotal = ranked.reduce((sum, row) => sum + row.floorCents, 0n);
  const roundedTotal = roundRatioHalfUp(totalNumerator, totalDenominator, `offer BAB total ${poolId}`);
  let extraCents = roundedTotal - floorTotal;
  const byRemainder = [...ranked].sort((a, b) => {
    const left = a.remainder * b.denominator; const right = b.remainder * a.denominator;
    if (left !== right) return left > right ? -1 : 1;
    return a.row.costCenterId < b.row.costCenterId ? -1 : a.row.costCenterId > b.row.costCenterId ? 1 : 0;
  });
  for (let index = 0; extraCents > 0n; index++, extraCents--) {
    if (index >= byRemainder.length) invalid(`offer BAB residual allocation exceeded recipient count for ${poolId}`);
    byRemainder[index].floorCents += 1n;
  }
  for (const item of ranked) item.row.amountCents = toSafeNumber(item.floorCents, `offer BAB ${poolId}/${item.row.costCenterId}`);
  return toSafeNumber(roundedTotal, `offer BAB total ${poolId}`);
}
/**
 * Calculate an explicitly sourced basic BAB and a single offer's overhead from
 * unrounded source-pool rates. This is a plan/snapshot calculation only; it
 * never posts cash, ledger, receivable, inventory, tax, or actual-cost effects.
 *
 * `keys` are physical quantities sharing one unit. `weights` only distribute
 * source costs. A quote using weights requires one common positive physical
 * `rateBasis`; its receiver bases are `rateBasis × weight`. Each receiver
 * still requires one explicit offer driver, including an explicit zero.
 */
export function calculateV3OfferWithBab({
  period,
  offerDate,
  netPriceCents,
  directCosts,
  sourcePools,
  offerDrivers
}) {
  assertPeriod(period, 'period');
  assertDate(offerDate, 'offerDate');
  if (offerDate.slice(0, 7) !== period) invalid('offerDate month must match BAB/offer period');
  const price = assertSafeInteger(netPriceCents, 'netPriceCents');
  if (!Array.isArray(directCosts)) invalid('directCosts must be an array');
  if (!Array.isArray(sourcePools) || sourcePools.length === 0) invalid('sourcePools must be a non-empty explicitly entered array');
  if (!Array.isArray(offerDrivers) || offerDrivers.length === 0) invalid('offerDrivers must be a non-empty explicitly entered array');
  const poolIds = new Set(); const driverIds = new Set();
  const babSourcePools = [];
  let sourceTotal = 0n; let reconciledTotal = 0n; let offerBabTotal = 0n;

  for (const [poolIndex, pool] of sourcePools.entries()) {
    assertAllowedKeys(pool, ['poolId', 'sourceCostCenterId', 'costBasisId', 'period', 'poolCents', 'allocationMode', 'unitLabel', 'recipients', 'rateBasis', 'recipientRateBases'], `sourcePools[${poolIndex}]`);
    const poolId = assertId(pool.poolId, `sourcePools[${poolIndex}].poolId`);
    const sourceCostCenterId = assertId(pool.sourceCostCenterId, `sourcePools[${poolIndex}].sourceCostCenterId`);
    const costBasisId = assertId(pool.costBasisId, `sourcePools[${poolIndex}].costBasisId`);
    if (poolIds.has(poolId)) invalid(`duplicate source pool ID: ${poolId}`);
    poolIds.add(poolId);
    if (assertPeriod(pool.period, `sourcePools[${poolIndex}].period`) !== period) invalid(`source pool ${poolId} period must match offer period ${period}`);
    const poolAmount = assertSafeInteger(pool.poolCents, `sourcePools[${poolIndex}].poolCents`);
    if (!Array.isArray(pool.recipients) || pool.recipients.length === 0) invalid(`source pool ${poolId} must explicitly list recipients`);
    if (pool.allocationMode !== 'keys' && pool.allocationMode !== 'weights') invalid(`source pool ${poolId} allocationMode must be explicitly keys or weights`);

    let allocation;
    let normalizedKeys;
    if (pool.allocationMode === 'keys') {
      if (typeof pool.unitLabel !== 'string' || !pool.unitLabel.trim()) invalid(`source pool ${poolId} keys require an explicit physical unitLabel`);
      if (Object.hasOwn(pool, 'rateBasis') || Object.hasOwn(pool, 'recipientRateBases')) invalid(`source pool ${poolId} keys derive their denominator from physical keys; do not supply a separate rate basis`);
      allocation = allocateV3BabPool({ poolCents: toSafeNumber(poolAmount, `sourcePools[${poolIndex}].poolCents`), recipients: pool.recipients, unitLabel: pool.unitLabel, allocationMode: 'keys' });
      normalizedKeys = normalizeDecimals(pool.recipients.map(row => row.keyValue), `sourcePools[${poolIndex}].recipients.keyValue`);
    } else {
      if (Object.hasOwn(pool, 'unitLabel')) invalid(`source pool ${poolId} weights have no allocation unit; put a separate common driver unit on rateBasis`);
      if (Object.hasOwn(pool, 'recipientRateBases')) invalid(`source pool ${poolId} weights accept one common rateBasis, not independent recipientRateBases`);
      if (!isRecord(pool.rateBasis)) invalid(`source pool ${poolId} weights require one common rateBasis for an offer calculation`);
      assertAllowedKeys(pool.rateBasis, ['basisKind', 'value', 'unitLabel', 'period'], `sourcePools[${poolIndex}].rateBasis`);
      if (pool.rateBasis.basisKind !== 'driver') invalid(`source pool ${poolId} weights rateBasis must be one physical driver basis; money/driver mixtures are not supported`);
      if (assertPeriod(pool.rateBasis.period, `source pool ${poolId} rateBasis.period`) !== period) invalid(`rate basis ${poolId} period must match offer period ${period}`);
      if (typeof pool.rateBasis.unitLabel !== 'string' || !pool.rateBasis.unitLabel.trim()) invalid(`source pool ${poolId} rateBasis requires one non-empty physical unitLabel`);
      const basisValue = parseDecimal(pool.rateBasis.value, `rate basis ${poolId}.value`);
      if (basisValue.digits <= 0n) invalid(`rate basis ${poolId}.value must be positive`);
      allocation = allocateV3BabPool({ poolCents: toSafeNumber(poolAmount, `sourcePools[${poolIndex}].poolCents`), recipients: pool.recipients, allocationMode: 'weights' });
      normalizedKeys = normalizeDecimals(pool.recipients.map(row => row.keyValue), `pool ${poolId} weights`);
    }

    const allocationByCenter = new Map(allocation.allocations.map(row => [row.costCenterId, row]));
    const totalRecipientKey = normalizedKeys.values.reduce((sum, value) => sum + value, 0n);
    const keyRows = new Map(pool.recipients.map((row, index) => [row.costCenterId, normalizedKeys.values[index]]));
    const poolDrivers = offerDrivers.filter(row => row.poolId === poolId);
    if (poolDrivers.length !== pool.recipients.length) invalid(`source pool ${poolId} requires exactly one explicit offer driver per recipient`);
    const driverCenters = new Set();
    const poolOfferRows = [];

    for (const [driverIndex, driver] of poolDrivers.entries()) {
      assertAllowedKeys(driver, ['poolId', 'costCenterId', 'period', 'basisKind', 'quantity', 'amountCents', 'unitLabel'], `offerDrivers[${driverIndex}]`);
      if (assertId(driver.poolId, `offerDrivers[${driverIndex}].poolId`) !== poolId) invalid('offer driver pool reference changed during calculation');
      const costCenterId = assertId(driver.costCenterId, `offerDrivers[${driverIndex}].costCenterId`);
      if (driverCenters.has(costCenterId)) invalid(`source pool ${poolId} repeats offer driver for ${costCenterId}`);
      driverCenters.add(costCenterId);
      const rowKey = `${poolId}|${costCenterId}`;
      if (driverIds.has(rowKey)) invalid(`duplicate offer driver ${rowKey}`);
      driverIds.add(rowKey);
      if (!pool.recipients.some(row => row.costCenterId === costCenterId)) invalid(`offer driver ${rowKey} is not a recipient of its source pool`);
      if (assertPeriod(driver.period, `offerDrivers[${driverIndex}].period`) !== period) invalid(`offer driver ${rowKey} period must match offer period ${period}`);
      const shareNum = keyRows.get(costCenterId);
      const shareDen = normalizedKeys.scale;
      const quotedAllocation = allocationByCenter.get(costCenterId)?.amountCents;
      let rate; let rawAmountNumerator; let rawAmountDenominator; let amountCents;

      if (pool.allocationMode === 'keys') {
        if (driver.basisKind !== 'driver' || Object.hasOwn(driver, 'amountCents') || typeof driver.unitLabel !== 'string' || driver.unitLabel.trim() !== pool.unitLabel.trim()) invalid(`offer driver ${rowKey} must use the pool's explicit physical driver unit ${pool.unitLabel}`);
        const quantity = parseDecimal(driver.quantity, `offer driver ${rowKey}.quantity`);
        if (compareDecimal(quantity, { digits: shareNum, scale: normalizedKeys.scale }) > 0) invalid(`offer driver ${rowKey} quantity exceeds the recipient period key`);
        const rateNumerator = poolAmount * normalizedKeys.scale;
        const rateDenominator = totalRecipientKey;
        rate = { basisKind: 'driver', numeratorCents: rateNumerator.toString(), denominator: rateDenominator.toString(), basisScale: normalizedKeys.scale.toString(), displayValue: `${formatCents(roundRatioHalfUp(rateNumerator, rateDenominator, `rate ${rowKey}`)).replace(' €', ` €/${pool.unitLabel.trim()}`)} (gerundet)`, displayRounded: true, calculationUsesDisplayValue: false, unitLabel: pool.unitLabel.trim() };
        rawAmountNumerator = poolAmount * quantity.digits * normalizedKeys.scale;
        rawAmountDenominator = totalRecipientKey * quantity.scale;
        amountCents = toSafeNumber(roundRatioHalfUp(rawAmountNumerator, rawAmountDenominator, `offer BAB ${rowKey}`), `offer BAB ${rowKey}`);
      } else {
        const basis = parseDecimal(pool.rateBasis.value, `rate basis ${poolId}.value`);
        const unitLabel = pool.rateBasis.unitLabel.trim();
        if (driver.basisKind !== 'driver' || Object.hasOwn(driver, 'amountCents') || typeof driver.unitLabel !== 'string' || driver.unitLabel.trim() !== unitLabel) invalid(`offer driver ${rowKey} must use the pool's common physical driver unit ${unitLabel}`);
        const quantity = parseDecimal(driver.quantity, `offer driver ${rowKey}.quantity`);
        const recipientBasisDigits = basis.digits * shareNum;
        const recipientBasisScale = basis.scale * shareDen;
        if (compareDecimal(quantity, { digits: recipientBasisDigits, scale: recipientBasisScale }) > 0) invalid(`offer driver ${rowKey} quantity exceeds its weighted share of the common period rate basis`);
        const rateNumerator = poolAmount * basis.scale;
        const rateDenominator = basis.digits;
        rate = { basisKind: 'driver', numeratorCents: rateNumerator.toString(), denominator: rateDenominator.toString(), basisScale: basis.scale.toString(), displayValue: `${formatCents(roundRatioHalfUp(rateNumerator, rateDenominator, `rate ${rowKey}`)).replace(' €', ` €/${unitLabel}`)} (gerundet)`, displayRounded: true, calculationUsesDisplayValue: false, unitLabel };
        rawAmountNumerator = poolAmount * quantity.digits * basis.scale;
        rawAmountDenominator = basis.digits * quantity.scale;
        amountCents = toSafeNumber(roundRatioHalfUp(rawAmountNumerator, rawAmountDenominator, `offer BAB ${rowKey}`), `offer BAB ${rowKey}`);
      }
      poolOfferRows.push({ costCenterId, recipientShareNumerator: shareNum.toString(), recipientShareDenominator: shareDen.toString(), allocatedPoolCents: quotedAllocation, rawOfferAmountCentsNumerator: rawAmountNumerator.toString(), rawOfferAmountCentsDenominator: rawAmountDenominator.toString(), amountCents, rate });
    }
    offerBabTotal += BigInt(allocateOfferPoolCents(poolOfferRows, poolId));
    for (const recipient of pool.recipients) if (!driverCenters.has(recipient.costCenterId)) invalid(`source pool ${poolId} lacks an explicit offer driver for recipient ${recipient.costCenterId}`);
    sourceTotal += poolAmount;
    reconciledTotal += BigInt(allocation.allocations.reduce((sum, row) => sum + row.amountCents, 0));
    babSourcePools.push({ poolId, sourceCostCenterId, costBasisId, period, poolCents: toSafeNumber(poolAmount, `sourcePools[${poolIndex}].poolCents`), allocationMode: pool.allocationMode, ...(pool.allocationMode === 'keys' ? { unitLabel: pool.unitLabel.trim() } : { weights: pool.recipients.map(row => ({ costCenterId: row.costCenterId, weight: row.keyValue })), rateBasis: { basisKind: 'driver', value: pool.rateBasis.value, unitLabel: pool.rateBasis.unitLabel.trim(), period } }), allocations: allocation.allocations.map(row => ({ ...row })), reconciliationDifferenceCents: allocation.reconciliationDifferenceCents, reconciled: allocation.reconciled, offerAllocations: poolOfferRows });
  }
  for (const driver of offerDrivers) if (!poolIds.has(driver.poolId)) invalid(`offer driver references unknown source pool ${driver.poolId}`);
  const reconciliationDifferenceCents = toSafeNumber(sourceTotal - reconciledTotal, 'reconciliationDifferenceCents');
  if (reconciliationDifferenceCents !== 0) invalid('BAB source pool reconciliation must equal 0 cents');
  const babAllocatedCents = toSafeNumber(offerBabTotal, 'babAllocatedCents');
  const estimate = calculateV3OfferEstimate({ netPriceCents: toSafeNumber(price, 'netPriceCents'), directCosts, babAllocatedCents });
  return deepFreeze({
    ...estimate,
    babPeriod: period,
    babAllocatedCents,
    babSourceTotalCents: toSafeNumber(sourceTotal, 'babSourceTotalCents'),
    babReconciled: true,
    babReconciliationDifferenceCents: reconciliationDifferenceCents,
    babSnapshot: { modelVersion: V3_FINANCIAL_CALCULATION_VERSION, period, sourcePools: babSourcePools, offerDrivers: offerDrivers.map(row => ({ ...row })) }
  });
}
