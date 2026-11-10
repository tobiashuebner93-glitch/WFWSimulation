const MAX_DAILY_ANSWERS = 5;
const OPTION_KEYS = new Set(['A', 'B', 'C', 'D']);

function hash(value) {
  let result = 2166136261;
  for (const char of String(value)) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function stableOrder(items, seed, date, cycle) {
  return [...items].sort((a, b) => {
    const left = hash(`${seed}:${date}:${cycle}:${a.id}`);
    const right = hash(`${seed}:${date}:${cycle}:${b.id}`);
    return left - right || a.id.localeCompare(b.id);
  });
}

function validateCatalog(items) {
  if (!Array.isArray(items) || items.length === 0) throw new TypeError('A non-empty V3 learning catalog is required.');
  const ids = new Set();
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id.startsWith('EVT-')) throw new TypeError('Each learning item needs a stable EVT-* id.');
    if (ids.has(item.id)) throw new TypeError(`Duplicate learning item id: ${item.id}`);
    if (!OPTION_KEYS.has(item.correctOption)) throw new TypeError(`Invalid answer key for ${item.id}`);
    ids.add(item.id);
  }
  return ids;
}

export function createV3LearningRuntime({ seed = 'v3-learning', items, state = null } = {}) {
  const ids = validateCatalog(items);
  const catalog = new Map(items.map(item => [item.id, structuredClone(item)]));
  const restored = state ? structuredClone(state) : { version: 1, seed: String(seed), offeredIdsByDate: {}, answeredIdsByDate: {}, trace: [], score: { correct: 0, incorrect: 0 } };
  if (restored.version !== 1 || typeof restored.seed !== 'string' || !restored.offeredIdsByDate || !restored.answeredIdsByDate || !Array.isArray(restored.trace) || !restored.score) throw new TypeError('Invalid learning runtime state.');
  if (!Number.isInteger(restored.score.correct) || restored.score.correct < 0 || !Number.isInteger(restored.score.incorrect) || restored.score.incorrect < 0) throw new TypeError('Invalid persisted score.');
  for (const [date, offered] of Object.entries(restored.offeredIdsByDate)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(offered) || offered.length > MAX_DAILY_ANSWERS || new Set(offered).size !== offered.length || offered.some(id => !ids.has(id))) throw new TypeError(`Invalid persisted daily queue for ${date}.`);
  }
  for (const [date, answers] of Object.entries(restored.answeredIdsByDate)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(answers) || answers.length > MAX_DAILY_ANSWERS || new Set(answers).size !== answers.length || answers.some(id => !ids.has(id))) throw new TypeError(`Invalid persisted daily answers for ${date}.`);
  }
  return { catalog, state: restored };
}

function seenIds(runtime) {
  return new Set(Object.values(runtime.state.answeredIdsByDate).flat());
}

export function getV3DailyLearningEvents(runtime, date, { limit = MAX_DAILY_ANSWERS } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('A simulation date in YYYY-MM-DD format is required.');
  if (!Number.isInteger(limit) || limit < 0 || limit > MAX_DAILY_ANSWERS) throw new RangeError('Daily event limit must be between 0 and 5.');
  const answeredToday = runtime.state.answeredIdsByDate[date] || [];
  if (!Object.hasOwn(runtime.state.offeredIdsByDate, date)) {
    const alreadySeen = seenIds(runtime);
    const unseen = [...runtime.catalog.values()].filter(item => !alreadySeen.has(item.id));
    const candidates = unseen.length ? unseen : [...runtime.catalog.values()];
    const cycle = Math.floor(alreadySeen.size / candidates.length);
    runtime.state.offeredIdsByDate[date] = stableOrder(candidates, runtime.state.seed, date, cycle).slice(0, MAX_DAILY_ANSWERS).map(item => item.id);
  }
  const remaining = Math.min(limit, MAX_DAILY_ANSWERS - answeredToday.length);
  if (!remaining) return [];
  const answeredTodaySet = new Set(answeredToday);
  return runtime.state.offeredIdsByDate[date].filter(id => !answeredTodaySet.has(id)).slice(0, remaining).map(id => structuredClone(runtime.catalog.get(id)));
}

export function answerV3LearningEvent(runtime, { date, eventId, selectedOption } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new TypeError('A simulation date in YYYY-MM-DD format is required.');
  if (!OPTION_KEYS.has(selectedOption)) throw new TypeError('Answer must be A, B, C or D.');
  const item = runtime.catalog.get(eventId);
  if (!item) return { accepted: false, reason: 'unknown_event' };
  const answered = runtime.state.answeredIdsByDate[date] || [];
  if (answered.length >= MAX_DAILY_ANSWERS) return { accepted: false, reason: 'daily_limit' };
  if (answered.includes(eventId)) return { accepted: false, reason: 'already_answered' };
  const offered = getV3DailyLearningEvents(runtime, date);
  if (!offered.some(candidate => candidate.id === eventId)) return { accepted: false, reason: 'event_not_offered' };

  const correct = selectedOption === item.correctOption;
  runtime.state.answeredIdsByDate[date] = [...answered, eventId];
  runtime.state.score[correct ? 'correct' : 'incorrect'] += 1;
  const trace = Object.freeze({
    type: 'learning_answer',
    eventId,
    date,
    selectedOption,
    correct,
    points: correct ? 1 : 0,
    totalAnsweredToday: runtime.state.answeredIdsByDate[date].length,
    effectStatus: 'not_applied',
    effectReason: 'No V3 effect adapter is authorized for this isolated learning runtime; company and finance state remain unchanged.',
  });
  runtime.state.trace.push(trace);
  return { accepted: true, correct, points: trace.points, trace: structuredClone(trace) };
}

export function exportV3LearningRuntimeState(runtime) {
  return structuredClone(runtime.state);
}
