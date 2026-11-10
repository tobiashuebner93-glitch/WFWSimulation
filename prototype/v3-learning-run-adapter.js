import {
  createV3LearningRuntime,
  getV3DailyLearningEvents,
  answerV3LearningEvent,
  exportV3LearningRuntimeState,
} from './v3-learning-runtime.js';
import { V3_EVENT_CATALOG, V3_EVENT_CATALOG_VERSION } from './v3-event-catalog.js';

export const V3_LEARNING_RUN_VERSION = 'V3-LEARNING-RUN-2';
export const V3_LEARNING_EFFECT_VERSION = 'D-0147-V2-SCALED-1';
const V3_LEARNING_BASELINE_VERSION = 'V3-LEARNING-TARGET-BASELINE-1';
const COMPETENCIES = ['fach', 'methoden', 'sozial', 'individual'];
const clone = value => structuredClone(value);
const fail = (code, message) => Object.assign(new TypeError(message), { code });
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(`${value}T12:00:00Z`))
  && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
function stableHash(value) {
  let result = 2166136261;
  for (const char of String(value)) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619); }
  return result >>> 0;
}
function expectedDailyQueue(seed, date, answeredBefore) {
  const seen = new Set(answeredBefore);
  const unseen = V3_EVENT_CATALOG.filter(item => !seen.has(item.id));
  const candidates = unseen.length ? unseen : V3_EVENT_CATALOG;
  const cycle = Math.floor(seen.size / candidates.length);
  return [...candidates]
    .sort((a, b) => stableHash(`${seed}:${date}:${cycle}:${a.id}`) - stableHash(`${seed}:${date}:${cycle}:${b.id}`) || a.id.localeCompare(b.id))
    .slice(0, 5).map(item => item.id);
}

function createRuntime(seed, runtimeState = null) {
  return createV3LearningRuntime({ seed, items: V3_EVENT_CATALOG, state: runtimeState });
}

const closeEnough = (left, right) => Math.abs(left - right) <= 1e-9;

function currentTargetValue(run, target) {
  if (target === 'market.player.reputation') return run.modules.market.firms.find(row => row.role === 'player')?.reputation;
  const people = run.modules.product?.people ?? [];
  const competenceMarker = '.competencies.';
  const competencePosition = target.indexOf(competenceMarker);
  if (target.startsWith('product.people.') && competencePosition > 'product.people.'.length) {
    const personId = target.slice('product.people.'.length, competencePosition);
    const competency = target.slice(competencePosition + competenceMarker.length);
    return COMPETENCIES.includes(competency) ? people.find(person => person.id === personId)?.competencies?.[competency] : undefined;
  }
  const field = target.endsWith('.motivation') ? 'motivation' : target.endsWith('.morale') ? 'morale' : null;
  if (field && target.startsWith('product.people.')) {
    const personId = target.slice('product.people.'.length, -(`.${field}`).length);
    return people.find(person => person.id === personId)?.[field];
  }
  return undefined;
}

function captureTargetBaselines(run) {
  const targets = {};
  const reputation = currentTargetValue(run, 'market.player.reputation');
  if (Number.isFinite(reputation) && reputation >= 0 && reputation <= 1) targets['market.player.reputation'] = { value: reputation, capturedAt: 'run_start' };
  for (const person of run.modules.product?.people ?? []) {
    if (!person || typeof person.id !== 'string' || !person.id) continue;
    for (const competency of COMPETENCIES) {
      const value = person.competencies?.[competency];
      const ceiling = person.maxPotential?.[competency];
      if (Number.isFinite(value) && value >= 0 && value <= 100 && Number.isFinite(ceiling) && ceiling >= value && ceiling <= 100) {
        targets[`product.people.${person.id}.competencies.${competency}`] = { value, capturedAt: 'run_start' };
      }
    }
    for (const field of ['motivation', 'morale']) {
      const value = person[field];
      if (Number.isFinite(value) && value >= 0 && value <= 100) targets[`product.people.${person.id}.${field}`] = { value, capturedAt: 'run_start' };
    }
  }
  return {
    version: V3_LEARNING_BASELINE_VERSION,
    runId: run.runId,
    scenarioId: run.scenarioId,
    seed: run.seed,
    startDate: run.startDate,
    targets,
  };
}

function validateTargetBaseline(baseline, run, traces) {
  if (!baseline || baseline.version !== V3_LEARNING_BASELINE_VERSION || baseline.runId !== run.runId
      || baseline.scenarioId !== run.scenarioId || baseline.seed !== run.seed || baseline.startDate !== run.startDate
      || !baseline.targets || typeof baseline.targets !== 'object' || Array.isArray(baseline.targets)) {
    throw fail('invalid_learning_run_state', 'learning target baseline identity or shape is invalid');
  }
  for (const [target, value] of Object.entries(baseline.targets)) {
    const allowedTarget = target === 'market.player.reputation'
      || /^product\.people\.[^.]+\.competencies\.(fach|methoden|sozial|individual)$/.test(target)
      || /^product\.people\.[^.]+\.(motivation|morale)$/.test(target);
    const max = target === 'market.player.reputation' ? 1 : 100;
    if (!allowedTarget || !value || typeof value !== 'object' || !['run_start', 'first_effect'].includes(value.capturedAt)
        || !Number.isFinite(value.value) || value.value < 0 || value.value > max) throw fail('invalid_learning_run_state', 'learning target baseline contains an invalid value');
  }
  const firstEffectByTarget = new Map();
  for (const trace of traces) {
    const effect = trace.effect;
    if (effect.target === 'none' || firstEffectByTarget.has(effect.target)) continue;
    firstEffectByTarget.set(effect.target, effect.before);
  }
  for (const [target, firstValue] of firstEffectByTarget) {
    if (!Object.hasOwn(baseline.targets, target) || !closeEnough(baseline.targets[target].value, firstValue)) {
      throw fail('invalid_learning_run_state', 'first learning effect does not match its run-start/first-effect target baseline');
    }
  }
}

export function projectV3EventCatalog() {
  return clone(V3_EVENT_CATALOG);
}

export function createV3LearningRunState({ runId, scenarioId, seed, startDate, marketState, productState = null }) {
  if (![runId, scenarioId, String(seed ?? '')].every(value => typeof value === 'string' && value.trim()) || !validDate(startDate)) {
    throw fail('invalid_learning_run_identity', 'learning run needs the shared run identity and valid start date');
  }
  const runIdentity = { runId, scenarioId, seed: String(seed), startDate, modules: { market: marketState, product: productState } };
  return {
    version: V3_LEARNING_RUN_VERSION,
    runId,
    scenarioId,
    seed: String(seed),
    startDate,
    catalogVersion: V3_EVENT_CATALOG_VERSION,
    targetBaseline: captureTargetBaselines(runIdentity),
    runtime: exportV3LearningRuntimeState(createRuntime(String(seed))),
  };
}

function checkRuntimeLearningState(learning, run) {
  if (!learning || learning.version !== V3_LEARNING_RUN_VERSION || learning.runId !== run.runId
      || learning.scenarioId !== run.scenarioId || learning.seed !== run.seed
      || learning.startDate !== run.startDate || learning.catalogVersion !== V3_EVENT_CATALOG_VERSION) {
    throw fail('invalid_learning_run_state', 'learning run identity or catalog version does not match the shared run');
  }
  const runtime = createRuntime(run.seed, learning.runtime);
  const state = runtime.state;
  if (state.seed !== run.seed) throw fail('invalid_learning_run_state', 'learning queue seed does not match the shared run');
  const traces = state.trace;
  validateTargetBaseline(learning.targetBaseline, run, traces);
  if (traces.length !== state.score.correct + state.score.incorrect) throw fail('invalid_learning_run_state', 'learning trace and score disagree');
  const traceKeys = new Set();
  const byDate = new Map();
  let correctCount = 0;
  let incorrectCount = 0;
  const lastEffectByTarget = new Map();
  for (const trace of traces) {
    const item = V3_EVENT_CATALOG.find(candidate => candidate.id === trace.eventId);
    const key = `${trace.date}|${trace.eventId}`;
    if (!item || !validDate(trace.date) || trace.date < run.startDate || trace.date > effectiveDate(run)
        || traceKeys.has(key) || trace.selectedOption == null || !['A', 'B', 'C', 'D'].includes(trace.selectedOption)
        || trace.correct !== (trace.selectedOption === item.correctOption)
        || !['applied', 'no_effect'].includes(trace.effectStatus)
        || trace.effectVersion !== V3_LEARNING_EFFECT_VERSION || !trace.effect
        || !Number.isFinite(trace.effect.before) || !Number.isFinite(trace.effect.after)
        || !Number.isFinite(trace.effect.delta) || Math.abs((trace.effect.after - trace.effect.before) - trace.effect.delta) > 1e-9
        || trace.effectStatus !== (trace.effect.delta === 0 ? 'no_effect' : 'applied')) {
      throw fail('invalid_learning_run_state', 'learning answer/effect provenance is invalid');
    }
    const answerNumber = traces.indexOf(trace) + 1;
    const effect = trace.effect;
    const reputationFirm = run.modules.market.firms.find(row => row.role === 'player');
    const isReputation = effect.target === 'market.player.reputation' && effect.unit === '0..1'
      && effect.before >= 0 && effect.before <= 1 && effect.after >= 0 && effect.after <= 1
      && (trace.correct ? effect.delta >= 0 && effect.delta <= 0.001 + 1e-9 : effect.delta <= 0 && effect.delta >= -0.001 - 1e-9)
      && reputationFirm && (effect.delta !== 0 || (trace.correct ? effect.before === 1 : effect.before === 0));
    const competenceMarker = '.competencies.';
    const competencePosition = effect.target.indexOf(competenceMarker);
    const competenceId = competencePosition > 'product.people.'.length ? effect.target.slice('product.people.'.length, competencePosition) : '';
    const competenceName = effect.target.slice(competencePosition + competenceMarker.length);
    const competencePerson = run.modules.product?.people.find(person => person.id === competenceId);
    const isCompetence = trace.correct && effect.unit === '0..100' && effect.delta > 0 && effect.delta <= 0.2 + 1e-9
      && COMPETENCIES.includes(competenceName) && competencePerson
      && Number.isFinite(competencePerson.maxPotential?.[competenceName])
      && effect.before >= 0 && effect.before < competencePerson.maxPotential[competenceName]
      && effect.after <= competencePerson.maxPotential[competenceName] && effect.after <= 100;
    const motivationMarker = effect.target.endsWith('.motivation') ? '.motivation' : effect.target.endsWith('.morale') ? '.morale' : '';
    const motivationPersonId = motivationMarker ? effect.target.slice('product.people.'.length, -motivationMarker.length) : '';
    const motivationPerson = run.modules.product?.people.find(person => person.id === motivationPersonId);
    const isMotivation = !trace.correct && answerNumber % 2 === 1 && effect.unit === '0..100'
      && effect.delta < 0 && effect.delta >= -0.2 - 1e-9 && effect.before > 0 && effect.before <= 100 && effect.after >= 0
      && motivationPerson && (Number.isFinite(motivationPerson.motivation) || Number.isFinite(motivationPerson.morale));
    const isNone = effect.target === 'none' && effect.unit === 'none' && effect.delta === 0 && trace.effectStatus === 'no_effect';
    if (!(isReputation || isCompetence || isMotivation || isNone)) throw fail('invalid_learning_run_state', 'learning effect target or magnitude is not permitted by D-0147');
    if (effect.target !== 'none') {
      const previousValue = lastEffectByTarget.get(effect.target);
      if (previousValue !== undefined && !closeEnough(previousValue, effect.before)) throw fail('invalid_learning_run_state', 'learning effects for a target do not form a continuous value chain');
      if (previousValue === undefined && (!Object.hasOwn(learning.targetBaseline.targets, effect.target) || !closeEnough(learning.targetBaseline.targets[effect.target].value, effect.before))) throw fail('invalid_learning_run_state', 'first learning effect does not match its run-start/first-effect target baseline');
      lastEffectByTarget.set(effect.target, effect.after);
    }
    traceKeys.add(key);
    const dateAnswers = [...(byDate.get(trace.date) ?? []), trace.eventId];
    byDate.set(trace.date, dateAnswers);
    if (trace.totalAnsweredToday !== dateAnswers.length) throw fail('invalid_learning_run_state', 'daily answer count in trace is not sequential');
    if (!(state.offeredIdsByDate[trace.date] ?? []).includes(trace.eventId)) throw fail('invalid_learning_run_state', 'answered event was not in the persisted daily queue');
    if (trace.correct) correctCount += 1; else incorrectCount += 1;
  }
  for (const [target, lastValue] of lastEffectByTarget) {
    const currentValue = currentTargetValue(run, target);
    if (!Number.isFinite(currentValue) || !closeEnough(currentValue, lastValue)) throw fail('invalid_learning_run_state', 'last learning effect value does not match the current run target');
  }
  if (correctCount !== state.score.correct || incorrectCount !== state.score.incorrect) throw fail('invalid_learning_run_state', 'learning score does not match answer provenance');
  for (const [date, answers] of Object.entries(state.answeredIdsByDate)) {
    if (JSON.stringify(answers) !== JSON.stringify(byDate.get(date) ?? [])) throw fail('invalid_learning_run_state', 'daily learning answer order disagrees with trace');
  }
  for (const [date, offered] of Object.entries(state.offeredIdsByDate)) {
    if (!validDate(date) || date < run.startDate || date > effectiveDate(run) || offered.length > 5 || new Set(offered).size !== offered.length) {
      throw fail('invalid_learning_run_state', 'daily queue is outside the shared run or exceeds the answer limit');
    }
    const priorAnswers = Object.entries(state.answeredIdsByDate).filter(([answeredDate]) => answeredDate < date).flatMap(([, ids]) => ids);
    if (JSON.stringify(offered) !== JSON.stringify(expectedDailyQueue(run.seed, date, priorAnswers))) {
      throw fail('invalid_learning_run_state', 'persisted daily queue does not match its seed, date, and prior answer history');
    }
  }
  return runtime;
}

export function validateV3LearningRunState(learning, run) {
  checkRuntimeLearningState(learning, run);
  return true;
}

function effectiveDate(run) {
  return run.activeDay?.date ?? (run.currentDate < run.startDate ? run.startDate : run.currentDate);
}

export function getV3RunLearningEvents(run, { date = effectiveDate(run), limit = 5 } = {}) {
  const runtime = checkRuntimeLearningState(run.learning, run);
  if (!validDate(date) || date !== effectiveDate(run)) throw fail('invalid_learning_date', 'dashboard questions must use the current simulation date');
  const next = clone(run);
  const nextRuntime = createRuntime(run.seed, run.learning.runtime);
  const items = getV3DailyLearningEvents(nextRuntime, date, { limit });
  next.learning.runtime = exportV3LearningRuntimeState(nextRuntime);
  validateV3LearningRunState(next.learning, next);
  return { ok: true, state: next, result: { date, items: clone(items), answeredToday: runtime.state.answeredIdsByDate[date]?.length ?? 0, limit: 5 } };
}

function reputationEffect(run, direction) {
  const firm = run.modules.market.firms.find(row => row.role === 'player');
  if (!firm || !Number.isFinite(firm.reputation) || firm.reputation < 0 || firm.reputation > 1) return null;
  const before = firm.reputation;
  const after = Math.max(0, Math.min(1, before + direction * 0.001));
  if (after === before) return { target: 'market.player.reputation', before, after, delta: 0, unit: '0..1' };
  firm.reputation = after;
  return { target: 'market.player.reputation', before, after, delta: after - before, unit: '0..1' };
}

function motivationEffect(run, answerNumber) {
  const people = run.modules.product?.people ?? [];
  if (!people.length) return null;
  const person = people[answerNumber % people.length];
  const field = Number.isFinite(person.motivation) ? 'motivation' : Number.isFinite(person.morale) ? 'morale' : null;
  if (!field || person[field] <= 0 || person[field] > 100) return null;
  const before = person[field];
  const after = Math.max(0, Math.min(100, before - 0.2));
  if (after !== before) person[field] = after;
  return { target: `product.people.${person.id}.${field}`, before, after, delta: after - before, unit: '0..100' };
}

function competenceEffect(run, answerNumber) {
  const people = run.modules.product?.people ?? [];
  for (let offset = 0; offset < people.length; offset += 1) {
    const person = people[(answerNumber + offset) % people.length];
    if (!person.competencies || !person.maxPotential) continue;
    for (let step = 0; step < COMPETENCIES.length; step += 1) {
      const key = COMPETENCIES[(answerNumber + step) % COMPETENCIES.length];
      const current = person.competencies[key];
      const ceiling = person.maxPotential[key];
      if (!Number.isFinite(current) || !Number.isFinite(ceiling) || current < 0 || current > 100 || ceiling < 0 || ceiling > 100 || current >= ceiling) continue;
      const after = Math.min(ceiling, current + 0.2);
      person.competencies[key] = after;
      return { target: `product.people.${person.id}.competencies.${key}`, before: current, after, delta: after - current, unit: '0..100' };
    }
  }
  return null;
}

function applyEffect(run, correct, answerNumber) {
  let effect;
  if (correct) effect = competenceEffect(run, answerNumber) ?? reputationEffect(run, 1);
  else if (answerNumber % 2 === 0) effect = reputationEffect(run, -1);
  else effect = motivationEffect(run, answerNumber) ?? reputationEffect(run, -1);
  return effect ?? { target: 'none', before: 0, after: 0, delta: 0, unit: 'none' };
}

export function answerV3RunLearningEvent(run, { date = effectiveDate(run), eventId, selectedOption } = {}) {
  const existing = checkRuntimeLearningState(run.learning, run);
  if (!validDate(date) || date !== effectiveDate(run)) throw fail('invalid_learning_date', 'dashboard answers must use the current simulation date');
  const previous = existing.state.trace.find(row => row.date === date && row.eventId === eventId);
  if (previous) {
    if (previous.selectedOption !== selectedOption) throw fail('learning_answer_conflict', 'the same event/date cannot be answered with a different option');
    return { ok: true, duplicate: true, state: clone(run), result: { accepted: true, duplicate: true, correct: previous.correct, trace: clone(previous) } };
  }
  const next = clone(run);
  const runtime = createRuntime(run.seed, run.learning.runtime);
  const answeredBefore = runtime.state.score.correct + runtime.state.score.incorrect;
  const accepted = answerV3LearningEvent(runtime, { date, eventId, selectedOption });
  if (!accepted.accepted) return { ok: false, duplicate: false, state: clone(run), result: accepted };
  const effect = applyEffect(next, accepted.correct, answeredBefore + 1);
  if (effect.target !== 'none' && !Object.hasOwn(next.learning.targetBaseline.targets, effect.target)) {
    // Target fields installed after run creation get a one-time first-effect anchor.
    // Existing anchors are never overwritten by later effect traces.
    next.learning.targetBaseline.targets[effect.target] = { value: effect.before, capturedAt: 'first_effect' };
  }
  const traceIndex = runtime.state.trace.length - 1;
  const trace = {
    ...runtime.state.trace[traceIndex],
    effectStatus: effect.delta === 0 ? 'no_effect' : 'applied',
    effectReason: effect.delta === 0 ? 'No eligible explicit target had remaining headroom; reputation or motivation was already at its clamp.' : 'D-0147 dashboard effect applied once to one explicit target; no finance mutation.',
    effectVersion: V3_LEARNING_EFFECT_VERSION,
    effect,
  };
  runtime.state.trace[traceIndex] = trace;
  next.learning.runtime = exportV3LearningRuntimeState(runtime);
  validateV3LearningRunState(next.learning, next);
  return { ok: true, duplicate: false, state: next, result: { ...accepted, trace: clone(trace) } };
}
