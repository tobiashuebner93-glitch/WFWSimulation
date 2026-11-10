import assert from 'node:assert/strict';
import {
  calculateV3SpiCOICOP12,
  calculateV3SpiPeriod,
  rebaseV3SpiHistory,
  V3_SPI_COICOP12_VERSION,
  V3_SPI_COICOP12_WEIGHTS_PER_MILLE
} from './v3-price-index.js';

const tolerance = 1e-10;
const closeTo = (actual, expected, label) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);
};
const baseComponents = Object.fromEntries(
  Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(division => [division, 100])
);

assert.equal(V3_SPI_COICOP12_VERSION, 'V3-SPI-COICOP12-v1');
closeTo(Object.values(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).reduce((sum, weight) => sum + weight, 0), 1000, 'weights in per mille');
closeTo(Object.values(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).reduce((sum, weight) => sum + weight / 1000, 0), 1, 'normalized weights');
closeTo(calculateV3SpiCOICOP12(baseComponents), 100, '2020 base index');

const foodFixture = { ...baseComponents, '01': 101 };
const housingFixture = { ...baseComponents, '04': 102 };
const transportFixture = { ...baseComponents, '07': 99 };
closeTo(calculateV3SpiCOICOP12(foodFixture), 100.11904, 'COICOP 01 hand-check fixture');
closeTo(calculateV3SpiCOICOP12(housingFixture), 100.5185, 'COICOP 04 hand-check fixture');
closeTo(calculateV3SpiCOICOP12(transportFixture), 99.86178, 'COICOP 07 hand-check fixture');

const constant = calculateV3SpiPeriod(baseComponents, Array(12).fill(100));
closeTo(constant.index, 100, 'constant-price index');
closeTo(constant.monthOverMonthInflation, 0, 'constant-price monthly inflation');
closeTo(constant.yearOverYearInflation, 0, 'constant-price annual inflation');

const noHistory = calculateV3SpiPeriod(baseComponents);
assert.equal(noHistory.monthOverMonthInflation, null, 'missing monthly history must remain unavailable');
assert.equal(noHistory.yearOverYearInflation, null, 'missing annual history must remain unavailable');
const partialHistory = calculateV3SpiPeriod(baseComponents, Array(11).fill(100));
assert.equal(partialHistory.yearOverYearInflation, null, 'fewer than twelve prior months must not estimate annual inflation');
const oneYearEarlierAt101 = calculateV3SpiPeriod(baseComponents, [101, ...Array(11).fill(100)]);
closeTo(oneYearEarlierAt101.yearOverYearInflation, 100 * (100 / 101 - 1), 'year-over-year uses the 12-month prior level');

const frozenInput = Object.freeze({ ...baseComponents });
const before = { ...frozenInput };
calculateV3SpiPeriod(frozenInput, Object.freeze(Array(12).fill(100)));
assert.deepEqual(frozenInput, before, 'pure calculation must not mutate component inputs');
assert.throws(() => calculateV3SpiCOICOP12({ ...baseComponents, '12': undefined }), /COICOP 12/);
assert.throws(() => calculateV3SpiPeriod(baseComponents, [0]), /finite positive/);

const basePeriod = '2027-01';
const nextPeriod = '2027-02';
const basketVersion = V3_SPI_COICOP12_VERSION;
const componentBasePeriod = '2020';
const sourceRef = 'synthetic:test-fixture';
const fixtureId = 'T0082-SPI-REBASE-01';
const componentProvenance = Object.fromEntries(
  Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(division => [division, {
    basketVersion, componentBasePeriod, sourceRef, fixtureId
  }])
);
const rebaseInput = [
  { period: basePeriod, index: 100.5185, basketVersion, componentBasePeriod, sourceRef, fixtureId, componentProvenance },
  { period: nextPeriod, index: 100.77775, basketVersion, componentBasePeriod, sourceRef, fixtureId, componentProvenance }
];
const originalRebaseInput = structuredClone(rebaseInput);
const rebased = rebaseV3SpiHistory(rebaseInput, {
  newBasePeriod: basePeriod,
  basketVersion,
  componentBasePeriod,
  sourceRef,
  fixtureId
});
closeTo(rebased.observations[0].index, 100, 'new base period index');
closeTo(rebased.observations[1].index, 100.2579127225, 'rebased next period index');
closeTo(rebased.observations[1].monthOverMonthInflation, 0.2579127225, 'rebased monthly inflation');
assert.equal(rebased.observations[0].yearOverYearInflation, null, 'base period has no annual comparison');
assert.equal(rebased.observations[1].yearOverYearInflation, null, 'fewer than twelve same-version prior periods leave annual comparison unavailable');
assert.equal(rebased.observations[0].index.toFixed(2), '100.00', 'base index display rounds to two decimals');
assert.equal(rebased.observations[1].index.toFixed(2), '100.26', 'rebased index display rounds to two decimals');
assert.equal(`${rebased.observations[1].monthOverMonthInflation.toFixed(2)}%`, '0.26%', 'monthly display rounds to two decimals');
assert.equal(rebased.basketVersion, basketVersion, 'reference-period rebasing keeps the same basket version');
assert.equal(rebased.referencePeriod, basePeriod, 'rebased history binds its new reference period');
assert.deepEqual(rebaseInput, originalRebaseInput, 'rebasing must not mutate the source history');

const twelveMonthHistory = Array.from({ length: 13 }, (_, position) => {
  const year = 2027 + Math.floor(position / 12);
  const month = (position % 12) + 1;
  return {
    period: `${year}-${String(month).padStart(2, '0')}`,
    index: position === 12 ? 100.77775 : 100.5185,
    basketVersion,
    componentBasePeriod,
    sourceRef,
    fixtureId,
    componentProvenance
  };
});
const fullYearRebased = rebaseV3SpiHistory(twelveMonthHistory, {
  newBasePeriod: '2027-01', basketVersion, componentBasePeriod, sourceRef, fixtureId
});
closeTo(fullYearRebased.observations[12].yearOverYearInflation, 0.2579127225, 'year-over-year compares values in the same rebased version');
assert.equal(fullYearRebased.observations[12].index.toFixed(2), '100.26', 'full-history rebased value display');

assert.throws(() => rebaseV3SpiHistory(rebaseInput, {
  newBasePeriod: basePeriod, componentBasePeriod, sourceRef, fixtureId
}), /basketVersion must/);
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], basketVersion: 'V3-SPI-COICOP12-v2' }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /mixed or missing basket provenance/);
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], componentBasePeriod: '2021' }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /mixed or missing basket provenance/);
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], sourceRef: 'synthetic:other-fixture' }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /mixed or missing basket provenance/);
const mixedComponentProvenance = structuredClone(componentProvenance);
mixedComponentProvenance['04'].componentBasePeriod = '2021';
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], componentProvenance: mixedComponentProvenance }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /component 04 .*mixed or missing provenance/);
const incompleteComponentProvenance = { ...componentProvenance };
delete incompleteComponentProvenance['12'];
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], componentProvenance: incompleteComponentProvenance }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /component 12 .*mixed or missing provenance/);
assert.throws(() => rebaseV3SpiHistory(rebaseInput, {
  newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef
}), /fixtureId must be/);
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[1], rebaseInput[0]
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /unique chronological/);
assert.throws(() => rebaseV3SpiHistory([
  rebaseInput[0], { ...rebaseInput[1], period: '2027-03' }
], { newBasePeriod: basePeriod, basketVersion, componentBasePeriod, sourceRef, fixtureId }), /consecutive calendar months/);

const oldVersionReplay = calculateV3SpiPeriod(housingFixture, [100]);
closeTo(oldVersionReplay.index, 100.5185, 'old basket version remains available for replay');
assert.equal(oldVersionReplay.modelVersion, V3_SPI_COICOP12_VERSION);

console.log('V3 SPI COICOP12 regressions: PASS');
