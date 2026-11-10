import assert from 'node:assert/strict';
import { createRunFromInputs, getRunProjection, renderMacroSummary } from './run.js';

const run = createRunFromInputs({
  scenarioId: 'a05-mro-reference-ui', seed: 'ui-seed',
  startDate: '2027-01-04', endDate: '2027-01-29',
});
const before = JSON.stringify(run);
const projection = getRunProjection(run);
const initialHtml = renderMacroSummary(run.modules.macro, run.modules.market, projection);

assert.match(initialHtml, /Finanzierungsreferenz/);
assert.match(initialHtml, /MRO-Referenz: derzeit nicht verfügbar/);
assert.match(initialHtml, /D-0022 Referenzaufschlag/);
assert.match(initialHtml, /\+0,50 bis \+5,50 Prozentpunkte/);
assert.match(initialHtml, /Mittelwert \+3,00 Prozentpunkte/);
assert.match(initialHtml, /Individuelle Konditionen: offen \(pending\)/);
assert.match(initialHtml, /kein Kreditangebot/);
assert.equal(JSON.stringify(run), before, 'projection and rendering must not mutate shared run or finance state');

const financingReferenceFor = valuePctPA => ({
  macroFinancingReference: {
    status: 'reference_available', period: '2027-01',
    referenceRate: {
      valuePctPA, sourceType: 'observed', sourceRef: '<script>bad()</script>',
      observedPeriod: '2027-01', effectiveFrom: '2027-01-15', dataVintage: '2027-01-16',
    },
    marginBenchmark: { low: 0.5, mean: 3, high: 5.5 },
    individualTerms: { status: 'pending', ratePctPA: null },
    effects: { createsCreditContract: false, changesCash: false },
  },
});
const sharedMacroState = {
  runId: run.runId, scenarioId: run.scenarioId, periods: [{
    period: '2027-01', phaseState: { phase: 'upswing' },
    spi: { yearOverYearInflation: null, index: 100 },
    activity: { activityGapPct: 0, activityMomentumPct: 0 },
    mro: { valuePctPA: 3.15, sourceType: 'observed', sourceRef: 'ECB fixture', observedPeriod: '2027-01' },
  }],
};
const observedHtml = renderMacroSummary(sharedMacroState, null, financingReferenceFor(3.15));
assert.match(observedHtml, /3,15 % p\. a\./);
assert.doesNotMatch(observedHtml, /\+3,15 % p\. a\./, 'an MRO rate level has no plus sign');
assert.match(observedHtml, /beobachteter Quellenwert/);
assert.match(observedHtml, /wirksam ab 2027-01-15/);
assert.match(observedHtml, /\+0,50 bis \+5,50 Prozentpunkte/);
assert.match(observedHtml, /Mittelwert \+3,00 Prozentpunkte/);
assert.match(observedHtml, /&lt;script&gt;bad\(\)&lt;\/script&gt;/, 'source metadata is escaped');
assert.doesNotMatch(observedHtml, /<script>bad\(\)<\/script>/);
assert.match(observedHtml, /Individuelle Konditionen: offen \(pending\)/);
assert.match(renderMacroSummary(sharedMacroState, null, financingReferenceFor(0)), /0,00 % p\. a\./, 'zero MRO rate has no plus sign');
assert.doesNotMatch(renderMacroSummary(sharedMacroState, null, financingReferenceFor(0)), /\+0,00 % p\. a\./);
assert.match(renderMacroSummary(sharedMacroState, null, financingReferenceFor(-0.5)), /-0,50 % p\. a\./, 'negative MRO rate retains its minus sign');
assert.doesNotMatch(renderMacroSummary(sharedMacroState, null, financingReferenceFor(-0.5)), /\+-0,50 % p\. a\./);

console.log('A05 T-0063 financing reference UI regressions PASS');
