import { WBQ_ITEMS, WBQ_AREAS, WBQ_SOURCES } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';
import { DAILY_ITEMS } from './learning-daily.js';
import { applyLearningAnswerEffect } from './engine.js';

const areaLabels = new Map([
  ...WBQ_AREAS.map(area => [area.id, `${area.name || area.title} (WBQ)`]),
  ...HSQ_AREAS.map(area => [area.id, `${area.name} (HSQ)`]),
]);
const examItems = [...WBQ_ITEMS, ...hsqQuestions];
const pools = { practice: examItems, daily: DAILY_ITEMS };
const progressKeys = { practice: 'werkstatt-learning-progress-v1', daily: 'werkstatt-daily-progress-v1' };
const progressStores = { practice: loadProgress(progressKeys.practice), daily: loadProgress(progressKeys.daily) };
const sessions = {
  practice: { areaId: 'all', position: 0, answered: null, impact: '' },
  daily: { areaId: 'all', position: 0, answered: null, impact: '' },
};
const letters = ['A', 'B', 'C', 'D'];

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
function currentItem(mode, session) {
  const pool = currentPool(mode, session);
  if (!pool.length) return null;
  session.position %= pool.length;
  return pool[session.position];
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
  if (daily && game && game.learningDaily?.date !== simulationDate) game.learningDaily = { date: simulationDate, answeredCount: 0 };
  const dailyCount = daily ? (game?.learningDaily?.answeredCount || 0) : 0;
  const progress = progressStores[mode];
  const items = pools[mode];
  const item = currentItem(mode, session);
  const pool = currentPool(mode, session);
  const done = Object.keys(progress).length;
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
  const explanation = daily ? 'Eine kurze Tagesfrage. Richtige und falsche Antworten können kleine Spielwirkungen auf Ruf, Kompetenzen oder Motivation haben; sie lösen keine Buchungen aus.' : 'Prüfungstraining mit Lernfortschritt und Wiederholungen. Antworten verändern den aktiven Unternehmens- und Finanzstand nicht.';
  return `<section class="card wide learning-quiz" data-learning-mode="${mode}" aria-labelledby="learning-quiz-title"><div class="section-title"><div><h2 id="learning-quiz-title">${title}</h2><p class="muted">${explanation}</p></div><span class="status">${daily ? `${dailyCount}/5 heute` : 'Prüfungstraining'} · ${done}/${items.length} begonnen</span></div><div class="learning-stats"><span>${totalAttempts} Antworten</span><span>${totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0} % richtig</span><span>${due} fällige Wiederholungen</span></div>${daily && dailyCount >= 5 && answer === null ? '<p class="notice">Das Tageskontingent ist ausgeschöpft. Mit dem nächsten Spieltag stehen wieder fünf Antworten bereit.</p>' : `${daily ? '' : `<label class="field-label" for="learning-area-${mode}">Prüfungsbereich</label><select class="field learning-area" id="learning-area-${mode}" data-learning-mode="${mode}" data-learning-area><option value="all" ${session.areaId === 'all' ? 'selected' : ''}>Alle Bereiche (${examItems.length})</option>${[...WBQ_AREAS, ...HSQ_AREAS].map(area => `<option value="${escapeHtml(area.id)}" ${session.areaId === area.id ? 'selected' : ''}>${escapeHtml(area.name || area.title)} (${area.id.startsWith('wbq-') ? 'WBQ' : 'HSQ'}) · ${examItems.filter(entry => entry.areaId === area.id).length}</option>`).join('')}</select>`}<div class="learning-progress-label"><span>${escapeHtml(daily ? item.areaId : areaLabels.get(item.areaId) || item.areaId)}</span><span>Fall ${session.position + 1} von ${pool.length} · ${record ? `${record.attempts || 0} Versuche` : 'neu'}</span></div><div class="learning-scenario"><p>${escapeHtml(item.scenario)}</p><h3>${escapeHtml(item.question)}</h3></div><div class="learning-options" role="group" aria-label="Antwortmöglichkeiten">${options}</div>${feedback}<div class="learning-actions">${answer === null ? '<span class="muted">Wähle eine Antwort, um Begründung und Wirkung zu sehen.</span>' : `<button type="button" class="btn btn-primary" data-learning-mode="${mode}" data-learning-next>Weiter zum nächsten Fall →</button>`}</div><details class="learning-source"><summary>${sourceText} und Kompetenzbezug</summary><p>${sourceMarkup(item)}</p><p>Kompetenz-ID: <code>${escapeHtml(item.competenceId)}</code></p></details>`}</section>`;
}

export function renderLearningQuiz(simulationDate) { return renderQuiz('practice', simulationDate); }
export function renderDailyQuiz(simulationDate, game) { return renderQuiz('daily', simulationDate, game); }

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
    progress[item.id] = { attempts: (previous.attempts || 0) + 1, correct: (previous.correct || 0) + (isCorrect ? 1 : 0), streak, intervalDays, nextReviewAt: reviewDueDate(simulationDate, intervalDays) };
    session.impact = effect.impact ? `Kleine Lernwirkung: ${effect.impact}.` : '';
    saveProgress(mode);
    return true;
  }
  const nextButton = event.target.closest('[data-learning-next]');
  if (nextButton) {
    const mode = nextButton.dataset?.learningMode === 'daily' ? 'daily' : 'practice';
    const session = sessions[mode];
    session.position = (session.position + 1) % currentPool(mode, session).length;
    session.answered = null;
    session.impact = '';
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
  session.answered = null;
  return true;
}

export function getLearningProgressSnapshot() {
  return JSON.parse(JSON.stringify(progressStores.practice));
}


