import assert from 'node:assert/strict';
import fs from 'node:fs';
import { V3_EVENT_CATALOG, V3_EVENT_CATALOG_VERSION } from './v3-event-catalog.js';
import { createV3MarketState } from './v3-market-simulation.js';
import { createV3ProductState } from './v3-product-lifecycle.js';
import {
  createV3Run, openV3RunDay, closeV3RunDay, validateV3RunState,
  getV3RunLearningCatalog, getV3RunLearningEvents, answerV3RunLearningEvent,
} from './v3-run-orchestrator.js';

const source = fs.readFileSync(new URL('../docs/learning/t-0068-v3-ereignisfragen-katalog-entwurf.md', import.meta.url), 'utf8');
const sourceLines = source.split(/\r?\n/).filter(line => /^\d+\. \*\*EVT-/.test(line));
assert.equal(V3_EVENT_CATALOG.length, 50);
assert.equal(new Set(V3_EVENT_CATALOG.map(item => item.id)).size, 50);
assert.equal(V3_EVENT_CATALOG_VERSION, 'T-0068-EVT-50-2026-10-31');
assert.deepEqual(getV3RunLearningCatalog(), V3_EVENT_CATALOG);
assert.deepEqual(V3_EVENT_CATALOG.map(item => item.sourceText), sourceLines, 'each serialized item preserves its full source line verbatim');
for (const [index, item] of V3_EVENT_CATALOG.entries()) {
  const line = sourceLines[index];
  const match = line.match(/^\d+\. \*\*(EVT-\d{3}) · (.*?)\*\* (.*)$/);
  assert.ok(match, `source metadata parses for ${item.id}`);
  const metadata = match[2].split(' · ');
  const body = match[3];
  const solution = body.match(/\*\*Lösung ([ABCD])\.\*\*/);
  assert.equal(item.id, match[1]);
  assert.equal(item.competenceText, metadata[0]);
  assert.equal(item.context, metadata[1]);
  assert.equal(item.sourceRefs, metadata[2]);
  assert.equal(item.difficulty, metadata[3]);
  assert.deepEqual(item.competenceIds, [...metadata[0].matchAll(/`([^`]+)`/g)].map(row => row[1]));
  assert.equal(item.correctOption, solution?.[1]);
  const answerIndex = body.indexOf(solution[0]);
  const optionMarkers = [...body.matchAll(/ ([ABCD]) (?=[A-ZÄÖÜ„0-9])/g)]
    .map(row => ({ key: row[1], index: row.index + 1 }))
    .filter(row => row.index < answerIndex);
  const aIndex = optionMarkers.findIndex(row => row.key === 'A');
  const markers = optionMarkers.slice(aIndex, aIndex + 4);
  assert.equal(markers.map(row => row.key).join(''), 'ABCD', `${item.id} has four ordered options`);
  assert.equal(item.question, body.slice(0, markers[0].index - 1).trimEnd());
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    const end = optionIndex < 3 ? markers[optionIndex + 1].index - 1 : answerIndex;
    assert.equal(item.options[markers[optionIndex].key], body.slice(markers[optionIndex].index + 2, end).trimEnd(), `${item.id} option ${markers[optionIndex].key} matches source`);
  }
  const effectIndex = body.indexOf('**Unternehmenswirkung', answerIndex) >= 0 ? body.indexOf('**Unternehmenswirkung', answerIndex) : body.indexOf('**Wirkung', answerIndex);
  const mutationIndex = body.indexOf('**Mutation:**', answerIndex);
  assert.equal(item.explanation, body.slice(answerIndex + solution[0].length, effectIndex).trim());
  assert.equal(item.companyEffect, body.slice(effectIndex, mutationIndex).trim());
  assert.equal(item.mutation, body.slice(mutationIndex).replace(/^\*\*Mutation:\*\*\s*/, '').trim());
}

const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 }, customerDecisionDelayCalendarDays: { min: 2, max: 2 }, minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.75 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: 0.8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
  { firmId: 'competitor-c', role: 'competitor', reputation: 0.6, capacityUnits: 9, capabilities: ['turning'], segmentFit: { small: 0.7 }, offerPriceCentsBySizeClass: { small: 1150000 } },
];
const person = overrides => ({ id: 'worker-1', hoursPerDay: 8, skills: ['turning'], ...overrides });
const makeRun = (people = [], playerReputation = 0.65) => {
  const runId = 'learning-run'; const scenarioId = 'learning-fixture'; const seed = 'learning-seed'; const startDate = '2027-01-04';
  const marketFirms = structuredClone(firms); marketFirms.find(row => row.role === 'player').reputation = playerReputation;
  const marketState = createV3MarketState({ runId, scenarioId, seed, parameterSetId: 'learning-market-v1', startDate, parameters, segments, firms: marketFirms });
  const productState = createV3ProductState({ runId, currentDate: startDate, people, equipment: [], materials: [], finishedGoodsCapacity: 0, finishedGoodsUsed: 0, commitments: [] });
  return createV3Run({ runId, scenarioId, seed, startDate, endDate: '2027-12-31', marketState, productState });
};
const queueFor = run => getV3RunLearningEvents(run);
const answer = (run, row, correct = true) => answerV3RunLearningEvent(run, { eventId: row.id, selectedOption: correct ? row.correctOption : ['A', 'B', 'C', 'D'].find(option => option !== row.correctOption) });
const changedLeaves = (before, after, prefix = '') => {
  if (Array.isArray(before) && Array.isArray(after)) {
    return Array.from({ length: Math.max(before.length, after.length) }, (_, index) => changedLeaves(before[index], after[index], `${prefix}.${index}`)).flat();
  }
  if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key => changedLeaves(before[key], after[key], prefix ? `${prefix}.${key}` : key));
  }
  return Object.is(before, after) ? [] : [prefix];
};

// Queue and render projections are deterministic and do not mutate the caller's state.
let run = makeRun([person({ competencies: { fach: 50, methoden: 50, sozial: 50, individual: 50 }, maxPotential: { fach: 60, methoden: 50, sozial: 50, individual: 50 }, motivation: 90 })]);
const runBeforeQueue = structuredClone(run);
const queueA = queueFor(run); const queueB = queueFor(run);
assert.deepEqual(queueA.result.items, queueB.result.items);
assert.deepEqual(run, runBeforeQueue, 'question projection does not mutate the input run');
assert.equal(queueA.result.items.length, 5);
const unoffered = V3_EVENT_CATALOG.find(item => !queueA.result.items.some(offered => offered.id === item.id));
assert.equal(answerV3RunLearningEvent(queueA.state, { eventId: unoffered.id, selectedOption: unoffered.correctOption }).result.reason, 'event_not_offered');
run = queueA.state;

// Correct answer raises one explicitly represented competence; no unstated defaults or other business fields change.
const businessBefore = structuredClone({ market: run.modules.market, product: run.modules.product });
const right = answer(run, queueA.result.items[0]);
assert.equal(right.result.correct, true);
assert.equal(right.result.trace.effect.target, 'product.people.worker-1.competencies.fach');
assert.ok(Math.abs(right.result.trace.effect.delta - 0.2) < 1e-9);
assert.deepEqual(changedLeaves(businessBefore, { market: right.state.modules.market, product: right.state.modules.product }), ['product.people.0.competencies.fach']);
const allNonLearningChanges = changedLeaves(run, right.state).filter(path => !path.startsWith('learning.'));
assert.deepEqual(allNonLearningChanges, ['modules.product.people.0.competencies.fach'], 'no cash, receivable, inventory, ledger, finance, or unrelated business field changes');
const replayedAnswer = answer(right.state, queueA.result.items[0]);
assert.equal(replayedAnswer.duplicate, true, 'same answer replay is a no-op');
assert.deepEqual(replayedAnswer.state, right.state, 'same answer replay does not change target or history again');
assert.throws(() => answerV3RunLearningEvent(right.state, { eventId: queueA.result.items[0].id, selectedOption: 'A' === queueA.result.items[0].correctOption ? 'B' : 'A' }), { code: 'learning_answer_conflict' });
assert.equal(validateV3RunState(structuredClone(right.state)), true, 'answer/effect state restores and validates');
const forgedEffect = structuredClone(right.state); forgedEffect.learning.runtime.trace[0].effect.after += 1;
assert.throws(() => validateV3RunState(forgedEffect), { code: 'invalid_learning_run_state' }, 'invalid effect delta is rejected on restore');
const traceOnlyMutation = structuredClone(right.state);
traceOnlyMutation.learning.runtime.trace[0].effect.after = 50.1;
traceOnlyMutation.learning.runtime.trace[0].effect.delta = 0.1;
assert.throws(() => validateV3RunState(traceOnlyMutation), { code: 'invalid_learning_run_state' }, 'coherent trace-only mutation is rejected when final value differs from the run target');
const targetMutation = structuredClone(right.state); targetMutation.modules.product.people[0].competencies.fach = 50.1;
assert.throws(() => validateV3RunState(targetMutation), { code: 'invalid_learning_run_state' }, 'changing the current run target without a matching effect chain is rejected');
const forgedTarget = structuredClone(right.state); forgedTarget.learning.runtime.trace[0].effect.target = 'finance.ledger.posted';
assert.throws(() => validateV3RunState(forgedTarget), { code: 'invalid_learning_run_state' }, 'unauthorized finance target is rejected on restore');
const missingOfferBinding = structuredClone(right.state); missingOfferBinding.learning.runtime.offeredIdsByDate['2027-01-04'] = [];
assert.throws(() => validateV3RunState(missingOfferBinding), { code: 'invalid_learning_run_state' }, 'answer without restored offer binding is rejected');
const forgedQueue = structuredClone(queueA.state);
forgedQueue.learning.runtime.offeredIdsByDate['2027-01-04'] = [...forgedQueue.learning.runtime.offeredIdsByDate['2027-01-04']].reverse();
assert.throws(() => validateV3RunState(forgedQueue), { code: 'invalid_learning_run_state' }, 'restored daily queue is recomputed from seed, date, and answer history');

// Repeated applications to one target form a gap-free before/after chain and bind its tail to current state.
let repeated = makeRun([person({ competencies: { fach: 50, methoden: 50, sozial: 50, individual: 50 }, maxPotential: { fach: 60, methoden: 50, sozial: 50, individual: 50 } })]);
let repeatedQueue = queueFor(repeated); repeated = repeatedQueue.state;
repeated = answer(repeated, repeatedQueue.result.items[0]).state;
repeatedQueue = queueFor(repeated); repeated = repeatedQueue.state;
repeated = answer(repeated, repeatedQueue.result.items[0]).state;
assert.equal(repeated.learning.runtime.trace[0].effect.target, repeated.learning.runtime.trace[1].effect.target);
assert.equal(repeated.learning.runtime.trace[0].effect.after, repeated.learning.runtime.trace[1].effect.before);
assert.equal(validateV3RunState(repeated), true, 'multiple valid effects on the same competency restore');
const coordinatedTraceMutation = structuredClone(repeated);
coordinatedTraceMutation.learning.runtime.trace[0].effect = { ...coordinatedTraceMutation.learning.runtime.trace[0].effect, before: 50.1, after: 50.25, delta: 0.15 };
coordinatedTraceMutation.learning.runtime.trace[1].effect = { ...coordinatedTraceMutation.learning.runtime.trace[1].effect, before: 50.25, after: 50.4, delta: 0.15 };
assert.throws(() => validateV3RunState(coordinatedTraceMutation), { code: 'invalid_learning_run_state' }, 'A06 plausible chain rewrite is rejected against the independent first-effect baseline');
const baselineOnlyMutation = structuredClone(repeated);
baselineOnlyMutation.learning.targetBaseline.targets['product.people.worker-1.competencies.fach'].value = 50.1;
assert.throws(() => validateV3RunState(baselineOnlyMutation), { code: 'invalid_learning_run_state' }, 'changing only the baseline cannot make the original trace chain valid');

// Separate effect targets each bind to their own run-start baseline.
let multiTarget = makeRun([person({ competencies: { fach: 50, methoden: 50, sozial: 50, individual: 50 }, maxPotential: { fach: 50.2, methoden: 60, sozial: 50, individual: 50 } })]);
let multiQueue = queueFor(multiTarget); multiTarget = multiQueue.state;
multiTarget = answer(multiTarget, multiQueue.result.items[0]).state;
multiQueue = queueFor(multiTarget); multiTarget = multiQueue.state;
multiTarget = answer(multiTarget, multiQueue.result.items[0]).state;
assert.notEqual(multiTarget.learning.runtime.trace[0].effect.target, multiTarget.learning.runtime.trace[1].effect.target);
assert.equal(validateV3RunState(multiTarget), true, 'independent target effects validate against their separate baseline entries');
let noEffectChain = makeRun([], 0.001);
let noEffectQueue = queueFor(noEffectChain); noEffectChain = noEffectQueue.state;
noEffectChain = answer(noEffectChain, noEffectQueue.result.items[0], false).state;
noEffectQueue = queueFor(noEffectChain); noEffectChain = noEffectQueue.state;
noEffectChain = answer(noEffectChain, noEffectQueue.result.items[0], false).state;
assert.equal(noEffectChain.learning.runtime.trace[1].effectStatus, 'no_effect');
assert.equal(validateV3RunState(noEffectChain), true, 'repeated and clamped no-effect answers preserve the target chain');

// D-0147 wrong-answer alternation uses the total accepted answer number and falls back if target fields are absent.
let wrongRun = makeRun([person({ motivation: 20 })]);
let wrongQueue = queueFor(wrongRun); wrongRun = wrongQueue.state;
const wrongOne = answer(wrongRun, wrongQueue.result.items[0], false); wrongRun = wrongOne.state;
assert.equal(wrongOne.result.trace.effect.target, 'product.people.worker-1.motivation');
assert.ok(Math.abs(wrongOne.result.trace.effect.delta + 0.2) < 1e-9);
wrongQueue = queueFor(wrongRun); wrongRun = wrongQueue.state;
const wrongTwo = answer(wrongRun, wrongQueue.result.items[0], false); wrongRun = wrongTwo.state;
assert.equal(wrongTwo.result.trace.effect.target, 'market.player.reputation');
assert.ok(Math.abs(wrongTwo.result.trace.effect.delta + 0.001) < 1e-9);

let fallback = makeRun([person()]);
let fallbackQueue = queueFor(fallback); fallback = fallbackQueue.state;
const fallbackWrong = answer(fallback, fallbackQueue.result.items[0], false);
assert.equal(fallbackWrong.result.trace.effect.target, 'market.player.reputation', 'missing explicit motivation uses reputation fallback');
assert.ok(Math.abs(fallbackWrong.result.trace.effect.delta + 0.001) < 1e-9);
let rightFallback = makeRun([person({ competencies: { fach: 60 }, maxPotential: { fach: 60 } })]);
let rightFallbackQueue = queueFor(rightFallback); rightFallback = rightFallbackQueue.state;
const fallbackRight = answer(rightFallback, rightFallbackQueue.result.items[0], true);
assert.equal(fallbackRight.result.trace.effect.target, 'market.player.reputation', 'missing/non-steerable explicit competence uses reputation fallback');
assert.ok(Math.abs(fallbackRight.result.trace.effect.delta - 0.001) < 1e-9);
let motivationClamp = makeRun([person({ motivation: 0 })]);
let motivationQueue = queueFor(motivationClamp); motivationClamp = motivationQueue.state;
const motivationFallback = answer(motivationClamp, motivationQueue.result.items[0], false);
assert.equal(motivationFallback.result.trace.effect.target, 'market.player.reputation', 'a motivation value at its lower clamp uses reputation fallback');
let repClamp = makeRun([], 0.001);
let repQueue = queueFor(repClamp); repClamp = repQueue.state;
const clampedWrong = answer(repClamp, repQueue.result.items[0], false);
assert.equal(clampedWrong.result.trace.effect.after, 0);
assert.ok(Math.abs(clampedWrong.result.trace.effect.delta + 0.001) < 1e-9);
const atCeiling = makeRun([], 1);
const ceilingQueue = queueFor(atCeiling);
const ceilingAnswer = answer(ceilingQueue.state, ceilingQueue.result.items[0]);
assert.equal(ceilingAnswer.result.trace.effect.delta, 0, 'reputation effect respects upper clamp');

// Decimal starting values retain their real change and a self-consistent trace without an extra rounding step.
let decimalCompetence = makeRun([person({ competencies: { fach: 50.05, methoden: 50, sozial: 50, individual: 50 }, maxPotential: { fach: 51, methoden: 50, sozial: 50, individual: 50 } })]);
let decimalCompetenceQueue = queueFor(decimalCompetence); decimalCompetence = decimalCompetenceQueue.state;
const decimalRight = answer(decimalCompetence, decimalCompetenceQueue.result.items[0]);
assert.equal(decimalRight.state.modules.product.people[0].competencies.fach, 50.25);
assert.ok(Math.abs(decimalRight.result.trace.effect.delta - 0.2) < 1e-9);
assert.equal(validateV3RunState(decimalRight.state), true);
let decimalMotivation = makeRun([person({ motivation: 20.05 })]);
let decimalMotivationQueue = queueFor(decimalMotivation); decimalMotivation = decimalMotivationQueue.state;
const decimalWrong = answer(decimalMotivation, decimalMotivationQueue.result.items[0], false);
assert.equal(decimalWrong.state.modules.product.people[0].motivation, 19.85);
assert.ok(Math.abs(decimalWrong.result.trace.effect.delta + 0.2) < 1e-9);
assert.equal(validateV3RunState(decimalWrong.state), true);

// Five answers per simulation date; closing without answers is allowed and question events do not gate the day.
let daily = makeRun();
const open = openV3RunDay(daily, { date: '2027-01-04' }); daily = open.state;
const dailyQueue = queueFor(daily); daily = dailyQueue.state;
for (const row of dailyQueue.result.items) daily = answer(daily, row).state;
assert.equal(getV3RunLearningEvents(daily).result.items.length, 0);
assert.equal(answerV3RunLearningEvent(daily, { eventId: V3_EVENT_CATALOG[10].id, selectedOption: V3_EVENT_CATALOG[10].correctOption }).result.reason, 'daily_limit');
daily = closeV3RunDay(daily, { date: '2027-01-04' }).state;
let noAnswers = makeRun(); noAnswers = openV3RunDay(noAnswers, { date: '2027-01-04' }).state;
assert.equal(closeV3RunDay(noAnswers, { date: '2027-01-04' }).ok, true, 'questions never block day closure');

// Ten dates rotate all 50 IDs exactly once before repeating; same-seed restore preserves future queues.
let rotation = makeRun(); const seen = new Set();
for (let dayIndex = 0; dayIndex < 10; dayIndex += 1) {
  const date = new Date(Date.parse('2027-01-04T12:00:00Z') + dayIndex * 86400000).toISOString().slice(0, 10);
  rotation = openV3RunDay(rotation, { date }).state;
  const dailyItems = getV3RunLearningEvents(rotation).result.items;
  const queueState = getV3RunLearningEvents(rotation).state;
  assert.deepEqual(queueState.learning.runtime.offeredIdsByDate[date], dailyItems.map(item => item.id));
  rotation = queueState;
  for (const item of dailyItems) {
    assert.ok(!seen.has(item.id), `${item.id} does not repeat before catalog exhaustion`);
    seen.add(item.id);
    rotation = answer(rotation, item).state;
  }
  rotation = closeV3RunDay(rotation, { date }).state;
}
assert.equal(seen.size, 50);
const restored = structuredClone(rotation);
assert.equal(validateV3RunState(restored), true);
const restoreOpen = openV3RunDay(restored, { date: '2027-01-14' });
const nextQuestionQueue = getV3RunLearningEvents(restoreOpen.state);
const sameRestoredQueue = getV3RunLearningEvents(restoreOpen.state);
assert.deepEqual(nextQuestionQueue.result.items.map(item => item.id), sameRestoredQueue.result.items.map(item => item.id));

console.log('V3 shared learning-run adapter regressions: PASS (50 verbatim EVT items, D-0147 effects, explicit fallbacks/clamps, daily cap, rotation, replay/restore, non-blocking day)');
