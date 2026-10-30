import { WBQ_ITEMS, WBQ_AREAS, WBQ_SOURCES } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';
import { SUPPLEMENTAL_ITEMS } from './learning-supplemental.js';
import { applyLearningAnswerEffect } from './engine.js';

const areaLabels = new Map([
  ...WBQ_AREAS.map(area => [area.id, `${area.name || area.title} (WBQ)`]),
  ...HSQ_AREAS.map(area => [area.id, `${area.name} (HSQ)`]),
]);
// The reviewed exam bank also feeds the dashboard. Daily answers still use
// their own progress store and are the only mode with modeled game effects.
const coreItems = [...WBQ_ITEMS, ...hsqQuestions];
const examItems = [...coreItems, ...SUPPLEMENTAL_ITEMS];
const pools = { practice: examItems, daily: examItems };
const progressKeys = { practice: 'werkstatt-learning-progress-v1', daily: 'werkstatt-daily-progress-v1' };
const progressStores = { practice: loadProgress(progressKeys.practice), daily: loadProgress(progressKeys.daily) };
const sessions = {
  practice: { areaId: 'all', position: 0, answered: null, impact: '', selectedId: null },
  daily: { areaId: 'all', position: 0, answered: null, impact: '', selectedId: null, date: null, queue: [] },
};
let examSession = null;
let examRunCount = 0;
const letters = ['A', 'B', 'C', 'D'];
const tierNames = { basic: 'Grundwissen', applied: 'Aufbauwissen', transfer: 'Transferwissen' };

// A09's item-by-item editorial mapping. Tiers describe the intended cognitive
// demand; they are not a psychometric or IHK certification.
const coreDifficultySuffixes = {
  'wbq-volks-und-betriebswirtschaft': {
    basic: [3,7,9,14,17,18,20,22,23,24,26,29,34,39,40,43,46,47,49,50],
    applied: [1,2,5,6,8,10,11,12,16,21,27,28,30,32,35],
    transfer: [4,13,15,19,25,31,33,36,37,38,41,42,44,45,48],
  },
  'wbq-rechnungswesen': {
    basic: [1,2,4,5,6,8,10,11,12,13,15,17,18,19,23,27,28,36,38,39],
    applied: [7,9,14,16,20,24,26,29,31,32,33,34,37,41,45],
    transfer: [3,21,22,25,30,35,40,42,43,44,46,47,48,49,50],
  },
  'wbq-recht-und-steuern': {
    basic: [1,2,4,6,11,12,18,19,20,21,22,23,26,27,30,36,39,43,14,15],
    applied: [3,5,7,8,9,10,13,16,17,24,28,29,31,32,33],
    transfer: [25,34,35,37,38,40,41,42,44,45,46,47,48,49,50],
  },
  'wbq-unternehmensfuehrung': {
    basic: [2,5,7,8,10,11,12,15,16,17,19,20,21,22,26,29,32,34,35,36],
    applied: [1,3,4,6,9,13,14,18,23,24,25,27,28,30,31],
    transfer: [33,37,38,39,40,41,42,43,44,45,46,47,48,49,50],
  },
  'hsq-betriebliches-management': {
    basic: [6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,40],
    applied: [1,3,4,5,21,26,27,28,29,30,31,32,34,35,36],
    transfer: [2,33,37,38,39,41,42,43,44,45,46,47,48,49,50],
  },
  'hsq-investition-finanzierung-rechnungswesen-controlling': {
    basic: [2,6,8,12,13,14,15,17,18,19,20,28,34,36,37,38,41,42,46,50],
    applied: [1,3,4,5,7,9,10,11,16,21,22,23,24,25,26],
    transfer: [27,29,30,31,32,33,35,39,40,43,44,45,47,48,49],
  },
  'hsq-logistik': {
    basic: [5,6,8,9,10,11,13,16,19,21,23,25,30,31,34,36,37,38,43,48],
    applied: [1,2,4,12,14,22,24,27,32,35,41,42,44,46,49],
    transfer: [3,7,15,17,18,20,26,28,29,33,39,40,45,47,50],
  },
  'hsq-marketing-vertrieb': {
    basic: [3,4,6,8,9,10,11,12,14,15,16,19,20,21,22,25,26,28,29,30],
    applied: [1,2,5,7,13,18,23,27,31,33,34,35,36,38,40],
    transfer: [17,24,32,37,39,41,42,43,44,45,46,47,48,49,50],
  },
  'hsq-fuehrung-zusammenarbeit': {
    basic: [1,6,7,10,12,13,14,16,17,18,20,22,23,26,27,31,32,37,38,39],
    applied: [2,3,4,5,8,9,11,15,19,21,24,25,29,30,33],
    transfer: [28,34,35,36,40,41,42,43,44,45,46,47,48,49,50],
  },
};
const coreDifficultyById = new Map();
const coreIdPrefixes = {
  'wbq-volks-und-betriebswirtschaft': 'wbq-vw',
  'wbq-rechnungswesen': 'wbq-rw',
  'wbq-recht-und-steuern': 'wbq-rt',
  'wbq-unternehmensfuehrung': 'wbq-uf',
};
for (const [areaId, tiers] of Object.entries(coreDifficultySuffixes)) {
  for (const [difficulty, suffixes] of Object.entries(tiers)) {
    for (const suffix of suffixes) {
      const id = `${coreIdPrefixes[areaId] || areaId}-${String(suffix).padStart(3, '0')}`;
      if (coreDifficultyById.has(id)) throw new Error(`Duplicate difficulty assignment for ${id}`);
      coreDifficultyById.set(id, difficulty);
    }
  }
}
for (const item of coreItems) {
  const difficulty = coreDifficultyById.get(item.id);
  if (!difficulty) throw new Error(`No reviewed difficulty assignment for core learning item ${item.id}`);
  item.difficulty = difficulty;
}
if (coreDifficultyById.size !== coreItems.length) throw new Error('Difficulty mapping contains unknown core learning items');
for (const areaId of Object.keys(coreDifficultySuffixes)) {
  const items = coreItems.filter(item => item.areaId === areaId);
  for (const [difficulty, expected] of [['basic', 20], ['applied', 15], ['transfer', 15]]) {
    const actual = items.filter(item => item.difficulty === difficulty).length;
    if (actual !== expected) throw new Error(`${areaId} has ${actual} ${difficulty} core items; expected ${expected}`);
  }
}

function loadProgress(key) {
  try {
    if (typeof localStorage === 'undefined') return {};
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function saveProgress(mode) {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(progressKeys[mode], JSON.stringify(progressStores[mode])); } catch {}
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function currentPool(mode, session) {
  const items = pools[mode];
  return mode === 'daily' || session.areaId === 'all' ? items : items.filter(item => item.areaId === session.areaId);
}
function hashText(text) {
  let hash = 2166136261;
  for (const char of String(text)) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return hash >>> 0;
}
function makeDailyQueue(date) {
  const progress = progressStores.daily;
  const candidates = [...examItems].sort((a, b) => hashText(`${date}:${a.id}`) - hashText(`${date}:${b.id}`));
  const selected = [];
  const recent = new Set(Object.entries(progress).filter(([, value]) => value.lastDailyAt && value.lastDailyAt >= reviewDueDate(date, -30)).map(([id]) => id));
  const due = candidates.filter(item => progress[item.id]?.nextReviewAt && progress[item.id].nextReviewAt <= date)
    .sort((a, b) => (progress[a.id]?.lastCorrect === false ? -1 : 0) - (progress[b.id]?.lastCorrect === false ? -1 : 0));
  const add = (item, forceReview = false) => { if (selected.length < 5 && item && !selected.some(entry => entry.id === item.id) && (forceReview || !recent.has(item.id) || selected.length >= candidates.length - recent.size)) selected.push(item); };
  due.forEach(item => add(item, true));
  const areas = [...new Set(candidates.map(item => item.areaId))];
  const tiers = ['basic', 'applied', 'transfer'];
  let round = hashText(date) % areas.length;
  for (let tierIndex = 0; selected.length < 5 && tierIndex < 30; tierIndex++) {
    const areaId = areas[(round + tierIndex) % areas.length];
    const tier = tiers[(hashText(`${date}:tier`) + tierIndex) % tiers.length];
    add(candidates.find(item => item.areaId === areaId && item.difficulty === tier && !recent.has(item.id)));
    if (selected.length < 5 && tierIndex % 3 === 2) add(candidates.find(item => item.areaId === areaId && !recent.has(item.id)));
  }
  for (const item of candidates) { if (selected.length >= 5) break; add(item); }
  return selected.map(item => item.id);
}
function currentItem(mode, session) {
  const pool = currentPool(mode, session);
  if (!pool.length) return null;
  if (mode === 'daily') {
    const id = session.queue[session.position];
    return pool.find(item => item.id === id) || pool[hashText(`${session.date}:${session.position}`) % pool.length];
  }
  if (session.selectedId) return pool.find(item => item.id === session.selectedId) || null;
  session.position %= pool.length;
  const due = pool.filter(item => progressStores.practice[item.id]?.nextReviewAt && progressStores.practice[item.id].nextReviewAt <= (session.date || ''))
    .sort((a, b) => (progressStores.practice[a.id].lastCorrect === false ? -1 : 0) - (progressStores.practice[b.id].lastCorrect === false ? -1 : 0));
  const unseen = pool.filter(item => !progressStores.practice[item.id]);
  const item = due[0] || unseen[session.position % Math.max(1, unseen.length)] || pool[session.position];
  session.selectedId = item.id;
  return item;
}
function reviewDueDate(baseDate, days) {
  const date = new Date(`${baseDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
function sourceMarkup(item) {
  const source = WBQ_SOURCES.find(entry => entry.id === item.sourceRef);
  if (source) return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a>`;
  const escaped = escapeHtml(item.sourceRef);
  return escaped.replace(/(?:https?:\/\/)?(?:www\.)?gesetze-im-internet\.de\/[A-Za-z0-9_./-]+/g, match => {
    const href = `https://www.gesetze-im-internet.de/${match.split('gesetze-im-internet.de/').at(-1)}`;
    return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(match)}</a>`;
  });
}

function renderQuiz(mode, simulationDate, game = null) {
  const daily = mode === 'daily';
  const session = sessions[mode];
  session.date = simulationDate;
  if (daily && session.date !== session.queueDate) session.queueDate = null;
  if (daily && session.queueDate !== simulationDate) {
    session.date = simulationDate;
    session.queue = makeDailyQueue(simulationDate);
    session.position = 0;
    session.answered = null;
    session.impact = '';
    session.queueDate = simulationDate;
    const previousDaily = progressStores.daily;
    const saved = previousDaily[`__session:${simulationDate}`];
    if (saved) { session.queue = saved.queue || session.queue; session.position = Math.min(saved.position || 0, 4); session.answered = saved.answered || null; session.impact = saved.impact || ''; }
  }
  if (daily && game && game.learningDaily?.date !== simulationDate) game.learningDaily = { date: simulationDate, answeredCount: 0 };
  const dailyCount = daily ? (game?.learningDaily?.answeredCount || 0) : 0;
  const progress = progressStores[mode];
  const items = pools[mode];
  const item = currentItem(mode, session);
  const pool = currentPool(mode, session);
  const done = Object.keys(progress).filter(id => !id.startsWith('__session:')).length;
  const due = Object.values(progress).filter(record => record.nextReviewAt && record.nextReviewAt <= simulationDate).length;
  const totalAttempts = Object.values(progress).reduce((sum, record) => sum + (record.attempts || 0), 0);
  const totalCorrect = Object.values(progress).reduce((sum, record) => sum + (record.correct || 0), 0);
  if (!item) return '<section class="card wide"><h2>Prüfungswissen üben</h2><p class="empty">Für diesen Bereich liegen keine Fragen vor.</p></section>';
  const options = item.options.map((option, index) => {
    const letter = letters[index];
    const correct = item.correctOption === letter;
    const selected = session.answered === letter;
    const stateClass = session.answered === null ? '' : correct ? ' is-correct' : selected ? ' is-wrong' : '';
    return `<button type="button" class="learning-option${stateClass}" data-learning-mode="${mode}" data-learning-answer="${letter}" aria-pressed="${selected}" ${session.answered !== null || (daily && dailyCount >= 5) ? 'disabled' : ''}><span class="learning-letter">${letter}</span><span>${escapeHtml(option)}</span></button>`;
  }).join('');
  const record = progress[item.id];
  const answer = session.answered;
  const correct = answer !== null && answer === item.correctOption;
  const feedback = answer === null ? '' : `<div class="learning-feedback ${correct ? 'is-correct' : 'is-wrong'}" role="status"><strong>${correct ? 'Richtig' : `Noch nicht richtig · Lösung ${item.correctOption}`}</strong><p>${escapeHtml(item.explanation)}</p><p><b>Wirkung im Fallunternehmen:</b> ${escapeHtml(item.companyEffect)}</p>${daily && session.impact ? `<p><b>Spielwirkung:</b> ${escapeHtml(session.impact)}</p>` : ''}${record?.nextReviewAt ? `<small>Nächste Wiederholung ab ${escapeHtml(record.nextReviewAt)} im Spielkalender.</small>` : ''}</div>`;
  const sourceText = item.sourceKind === 'law' || String(item.sourceKind).includes('legal') ? 'Primärrechtsbezug / Rechtsstand' : 'Abgeleitete Lernkompetenz';
  const title = daily ? 'Tagesfrage' : 'Prüfungswissen üben';
  const explanation = daily ? 'Fünf täglich wechselnde Fälle aus allen Prüfungsbereichen. Richtige und falsche Antworten können kleine Spielwirkungen haben; sie lösen keine Buchungen aus.' : 'Prüfungstraining mit gemischter Auswahl, Schwierigkeitsstufen und fälligen Wiederholungen. Antworten verändern den aktiven Unternehmens- und Finanzstand nicht.';
  return `<section class="card wide learning-quiz" data-learning-mode="${mode}" aria-labelledby="learning-quiz-title"><div class="section-title"><div><h2 id="learning-quiz-title">${title}</h2><p class="muted">${explanation}</p></div><span class="status">${daily ? `${dailyCount}/5 heute` : 'Prüfungstraining'} · ${done}/${items.length} begonnen</span></div><div class="learning-stats"><span>${totalAttempts} Antworten</span><span>${totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0} % richtig</span><span>${due} fällige Wiederholungen</span></div>${daily && dailyCount >= 5 && answer === null ? '<p class="notice">Das Tageskontingent ist ausgeschöpft. Mit dem nächsten Spieltag stehen wieder fünf Antworten bereit.</p>' : `${daily ? '' : `<label class="field-label" for="learning-area-${mode}">Prüfungsbereich</label><select class="field learning-area" id="learning-area-${mode}" data-learning-mode="${mode}" data-learning-area><option value="all" ${session.areaId === 'all' ? 'selected' : ''}>Alle Bereiche (${examItems.length})</option>${[...WBQ_AREAS, ...HSQ_AREAS].map(area => `<option value="${escapeHtml(area.id)}" ${session.areaId === area.id ? 'selected' : ''}>${escapeHtml(area.name || area.title)} (${area.id.startsWith('wbq-') ? 'WBQ' : 'HSQ'}) · ${examItems.filter(entry => entry.areaId === area.id).length}</option>`).join('')}</select>`}<div class="learning-progress-label"><span>${escapeHtml(daily ? `${areaLabels.get(item.areaId) || item.areaId} · ${tierNames[item.difficulty] || 'Aufbauwissen'}` : `${areaLabels.get(item.areaId) || item.areaId} · ${tierNames[item.difficulty] || 'Aufbauwissen'}`)}</span><span>${record ? `${record.attempts || 0} Versuche` : 'neu'} · ${item.difficulty ? tierNames[item.difficulty] : ''}</span></div><div class="learning-scenario"><p>${escapeHtml(item.scenario)}</p><h3>${escapeHtml(item.question)}</h3></div><div class="learning-options" role="group" aria-label="Antwortmöglichkeiten">${options}</div>${feedback}<div class="learning-actions">${answer === null ? '<span class="muted">Wähle eine Antwort, um Begründung und Wirkung zu sehen.</span>' : `<button type="button" class="btn btn-primary" data-learning-mode="${mode}" data-learning-next>Weiter zum nächsten Fall →</button>`}</div><details class="learning-source"><summary>${sourceText} und Kompetenzbezug</summary><p>${sourceMarkup(item)}</p><p>Kompetenz-ID: <code>${escapeHtml(item.competenceId)}</code></p></details>`}</section>`;
}

export function focusPracticeCompetence(competenceIds=[]){const wanted=new Set(competenceIds);const item=examItems.find(candidate=>wanted.has(candidate.competenceId));if(!item)return null;const session=sessions.practice;session.areaId=item.areaId;session.position=Math.max(0,currentPool('practice',session).findIndex(candidate=>candidate.id===item.id));session.selectedId=item.id;session.answered=null;session.impact='';return {itemId:item.id,areaId:item.areaId,competenceId:item.competenceId};}

export function renderLearningQuiz(simulationDate) { return renderQuiz('practice', simulationDate); }
export function renderDailyQuiz(simulationDate, game) { return renderQuiz('daily', simulationDate, game); }

function buildExamItems(areaId, seed) {
  const areas = areaId === 'all' ? [...WBQ_AREAS, ...HSQ_AREAS] : [...WBQ_AREAS, ...HSQ_AREAS].filter(area => area.id === areaId);
  if (!areas.length) return [];
  const tiers = ['basic', 'applied', 'transfer'];
  const selected = areas.flatMap((area, areaIndex) => {
    const items = examItems.filter(item => item.areaId === area.id);
    if (areaId === 'all') {
      const tier = tiers[areaIndex % tiers.length];
      const candidates = items.filter(item => item.difficulty === tier);
      return [candidates[hashText(`${seed}:${area.id}:${tier}`) % candidates.length]];
    }
    return tiers.flatMap(tier => {
      const candidates = items.filter(item => item.difficulty === tier);
      return Array.from({length:3},(_,index)=>candidates[hashText(`${seed}:${area.id}:${tier}:${index}`)%candidates.length]);
    });
  });
  return selected.sort((a,b)=>hashText(`${seed}:${b.id}`)-hashText(`${seed}:${a.id}`));
}

export function renderExamSession() {
  const areaOptions = [...WBQ_AREAS, ...HSQ_AREAS].map(area => `<option value="${escapeHtml(area.id)}" ${(examSession?.areaId||examSessionArea)===area.id?'selected':''}>${escapeHtml(area.name||area.title)}</option>`).join('');
  if (!examSession) return `<section class="card wide exam-session"><div class="section-title"><div><h2>V2-Übungsrunde</h2><p class="muted">Neun Fragen, eine je Prüfungsbereich. Alle drei Schwierigkeitsstufen kommen vor. Antworten werden erst nach Abschluss ausgewertet.</p></div><span class="status">Übungsformat</span></div><label class="field-label" for="exam-area">Umfang</label><select class="field" id="exam-area" data-exam-area><option value="all">Gemischt · alle 9 Bereiche</option>${areaOptions}</select><div class="actions"><button type="button" class="btn btn-primary" data-exam-action="start">Übungsrunde starten</button></div><p class="muted">Kein Zeitlimit und keine Bestehensgrenze. Das ist keine IHK-Prüfungssimulation. Der Unternehmens- und Finanzstand bleibt unberührt.</p></section>`;
  if (examSession.submitted) {
    const correct = examSession.items.filter(item=>examSession.answers[item.id]===item.correctOption).length;
    const byArea = [...new Set(examSession.items.map(item=>item.areaId))].map(areaId=>{const items=examSession.items.filter(item=>item.areaId===areaId);return {area:areaLabels.get(areaId)||areaId,correct:items.filter(item=>examSession.answers[item.id]===item.correctOption).length,total:items.length};});
    const byTier = tiersOrder.map(tier=>{const items=examSession.items.filter(item=>item.difficulty===tier);return {tier:tierNames[tier],correct:items.filter(item=>examSession.answers[item.id]===item.correctOption).length,total:items.length};}).filter(row=>row.total);
    const review = examSession.items.map((item,index)=>{const selected=examSession.answers[item.id],right=selected===item.correctOption;return `<article class="exam-review-item"><div class="section-title"><strong>${index+1}. ${escapeHtml(areaLabels.get(item.areaId)||item.areaId)} · ${escapeHtml(tierNames[item.difficulty]||'')}</strong><span class="status ${right?'done':'warn'}">${right?'Richtig':'Noch üben'}</span></div><h3>${escapeHtml(item.question)}</h3><p><b>Deine Antwort:</b> ${escapeHtml(item.options['ABCD'.indexOf(selected)]||'—')}</p>${!right?`<p><b>Lösung:</b> ${escapeHtml(item.options['ABCD'.indexOf(item.correctOption)])}</p>`:''}<p>${escapeHtml(item.explanation)}</p><p><b>Fallwirkung:</b> ${escapeHtml(item.companyEffect)}</p><details class="learning-source"><summary>Quelle und Kompetenzbezug</summary><p>${sourceMarkup(item)}</p><p>Kompetenz-ID: <code>${escapeHtml(item.competenceId)}</code></p></details></article>`;}).join('');
    return `<section class="card wide exam-session"><div class="section-title"><div><h2>Rückmeldung zur Übungsrunde</h2><p class="muted">${correct} von ${examSession.items.length} richtig · keine Bestehensgrenze oder IHK-Note</p></div><span class="status">Abgeschlossen</span></div><div class="learning-stats">${byArea.map(row=>`<span>${escapeHtml(row.area)}: ${row.correct}/${row.total}</span>`).join('')}</div><div class="learning-stats">${byTier.map(row=>`<span>${escapeHtml(row.tier)}: ${row.correct}/${row.total}</span>`).join('')}</div><div class="exam-review-list">${review}</div><button type="button" class="btn btn-secondary" data-exam-action="reset">Neue Übungsrunde</button></section>`;
  }
  const item=examSession.items[examSession.position],answer=examSession.answers[item.id]||'';
  const options=item.options.map((option,index)=>{const letter=letters[index];return `<button type="button" class="learning-option${answer===letter?' is-selected':''}" data-exam-answer="${letter}" aria-pressed="${answer===letter}"><span class="learning-letter">${letter}</span><span>${escapeHtml(option)}</span></button>`;}).join('');
  const answered=Object.keys(examSession.answers).length;
  return `<section class="card wide exam-session"><div class="section-title"><div><h2>V2-Übungsrunde · ${examSession.position+1} / ${examSession.items.length}</h2><p class="muted">${escapeHtml(areaLabels.get(item.areaId)||item.areaId)} · ${escapeHtml(tierNames[item.difficulty]||'')}</p></div><span class="status">${answered}/${examSession.items.length} beantwortet</span></div><div class="learning-scenario"><p>${escapeHtml(item.scenario)}</p><h3>${escapeHtml(item.question)}</h3></div><div class="learning-options" role="group" aria-label="Antwortmöglichkeiten">${options}</div><div class="learning-actions"><button type="button" class="btn btn-secondary" data-exam-action="previous" ${examSession.position===0?'disabled':''}>← Zurück</button><button type="button" class="btn btn-secondary" data-exam-action="next" ${examSession.position===examSession.items.length-1?'disabled':''}>Weiter →</button><button type="button" class="btn btn-primary" data-exam-action="submit" ${answered!==examSession.items.length?'disabled':''}>Runde auswerten</button></div><p class="muted">Bis zur Auswertung bleiben Lösung und Feedback verborgen. Deine Auswahl verändert keinen Unternehmens- oder Finanzwert.</p></section>`;
}

const tiersOrder=['basic','applied','transfer'];
export function handleExamSessionClick(event) {
  const button=event.target.closest('[data-exam-action]');
  if(button){const action=button.dataset.examAction;if(action==='start'){const areaId=examSessionArea||'all';examRunCount++;const items=buildExamItems(areaId,`${Date.now()}:${examRunCount}`);if(items.length!==9)return true;examSession={areaId,items,answers:{},position:0,submitted:false};}else if(action==='previous'&&examSession&&!examSession.submitted)examSession.position=Math.max(0,examSession.position-1);else if(action==='next'&&examSession&&!examSession.submitted)examSession.position=Math.min(examSession.items.length-1,examSession.position+1);else if(action==='submit'&&examSession&&!examSession.submitted&&Object.keys(examSession.answers).length===examSession.items.length)examSession.submitted=true;else if(action==='reset')examSession=null;return true;}
  const choice=event.target.closest('[data-exam-answer]');if(choice&&examSession&&!examSession.submitted){examSession.answers[examSession.items[examSession.position].id]=choice.dataset.examAnswer;return true;}
  return false;
}

export function handleExamSessionChange(event){const select=event.target.closest('[data-exam-area]');if(!select||examSession)return false;examSessionArea=select.value;return true;}
let examSessionArea='all';
export function getExamSessionSnapshot(){return examSession?{areaId:examSession.areaId,position:examSession.position,submitted:examSession.submitted,answers:{...examSession.answers},items:examSession.items.map(item=>({id:item.id,areaId:item.areaId,difficulty:item.difficulty,correctOption:item.correctOption}))}:null;}

export function getLearningDebriefs(events=[]){
  const rules=[
    {key:'orders',label:'Markt und Aufträge',match:/ANGEBOT|MARKT|KUNDENANFRAGE|NEUAUFTRAG/,competenceIds:['rt-contract-offer','rw-contribution-margin','wfprv5-4-marketingplanung']},
    {key:'logistics',label:'Beschaffung und Lager',match:/MATERIAL|BESTELL|LIEFER|BAUMARKT|WAREN/,competenceIds:['wfprv5-3-einkauf-beschaffung','rw-inventory-valuation','vw-make-or-buy']},
    {key:'finance',label:'Finanzen und Ergebnis',match:/FINANZ|DISPO|KUNDENEINGANG|RECHNUNG|ZAHLUNG|STEUER|SIMTAX/,competenceIds:['rw-balance-sheet','rw-cash-vs-profit','wfprv5-2-investitionsrechnung']},
    {key:'people',label:'Personal und Führung',match:/PERSONAL|MITARBEITER|WEITERBILDUNG|AUSBILDUNG|URLAUB|KRANK|MOTIVATION/,competenceIds:['wfprv5-1-planung-statistik','wfprv5-5-kommunikation-kooperation','uf-planning']},
  ];
  const latest=new Map();for(const event of [...events].reverse()){const rule=rules.find(item=>item.match.test(event.kind||''));if(rule&&!latest.has(rule.key))latest.set(rule.key,{key:rule.key,label:rule.label,event,competenceIds:rule.competenceIds});}
  return [...latest.values()].slice(0,4);
}

export function handleLearningQuizClick(event, simulationDate, game = null) {
  const answerButton = event.target.closest('[data-learning-answer]');
  if (answerButton) {
    const mode = answerButton.dataset.learningMode === 'daily' ? 'daily' : 'practice';
    const session = sessions[mode];
    if (session.answered !== null) return true;
    const item = currentItem(mode, session);
    const answer = answerButton.dataset.learningAnswer;
    if (!item || !letters.includes(answer)) return true;
    const isCorrect = answer === item.correctOption;
    const effect = mode === 'daily' && game ? applyLearningAnswerEffect(game, isCorrect) : {accepted:true,impact:null};
    if (!effect.accepted) return true;
    session.answered = answer;
    const progress = progressStores[mode];
    const previous = progress[item.id] || { attempts: 0, correct: 0, streak: 0, intervalDays: 0 };
    const streak = isCorrect ? (previous.streak || 0) + 1 : 0;
    const intervalDays = isCorrect ? Math.min(30, previous.intervalDays ? previous.intervalDays * 2 : 1) : 1;
    progress[item.id] = { attempts: (previous.attempts || 0) + 1, correct: (previous.correct || 0) + (isCorrect ? 1 : 0), streak, intervalDays, nextReviewAt: reviewDueDate(simulationDate, intervalDays), lastCorrect: isCorrect, lastDailyAt: mode === 'daily' ? simulationDate : previous.lastDailyAt };
    session.selectedId = item.id;
    session.date = simulationDate;
    session.impact = effect.impact ? `Kleine Lernwirkung: ${effect.impact}.` : '';
    if (mode === 'daily') progress[`__session:${simulationDate}`] = { queue: session.queue, position: session.position, answered: answer, impact: session.impact };
    saveProgress(mode);
    return true;
  }
  const nextButton = event.target.closest('[data-learning-next]');
  if (nextButton) {
    const mode = nextButton.dataset?.learningMode === 'daily' ? 'daily' : 'practice';
    const session = sessions[mode];
    session.position = mode === 'daily' ? Math.min(4, session.position + 1) : (session.position + 1) % currentPool(mode, session).length;
    session.selectedId = null;
    session.answered = null;
    session.impact = '';
    if (mode === 'daily') progressStores.daily[`__session:${session.date}`] = { queue: session.queue, position: session.position, answered: null, impact: '' };
    saveProgress(mode);
    return true;
  }
  return false;
}

export function handleLearningQuizChange(event) {
  const select = event.target.closest('[data-learning-area]');
  if (!select) return false;
  const mode = select.dataset?.learningMode === 'daily' ? 'daily' : 'practice';
  const session = sessions[mode];
  session.areaId = areaLabels.has(select.value) ? select.value : 'all';
  session.position = 0;
  session.selectedId = null;
  session.answered = null;
  return true;
}

export function getLearningProgressSnapshot() {
  return JSON.parse(JSON.stringify(progressStores.practice));
}


