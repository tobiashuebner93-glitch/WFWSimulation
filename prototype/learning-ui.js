import { WBQ_ITEMS, WBQ_AREAS, WBQ_SOURCES } from './learning-wbq.js';
import { hsqQuestions, areas as HSQ_AREAS } from './learning-hsq.js';

const areaLabels = new Map([
  ...WBQ_AREAS.map(area => [area.id, `${area.name || area.title} (WBQ)`]),
  ...HSQ_AREAS.map(area => [area.id, `${area.name} (HSQ)`]),
]);
const allItems = [...WBQ_ITEMS, ...hsqQuestions];
const progressKey = 'werkstatt-learning-progress-v1';
let progress = loadProgress();
let session = { areaId: 'all', position: 0, answered: null };
const letters = ['A', 'B', 'C', 'D'];

function loadProgress() {
  try {
    if (typeof localStorage === 'undefined') return {};
    const value = JSON.parse(localStorage.getItem(progressKey) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
function saveProgress() {
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(progressKey, JSON.stringify(progress)); } catch {}
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function currentPool() {
  return session.areaId === 'all' ? allItems : allItems.filter(item => item.areaId === session.areaId);
}
function currentItem() {
  const pool = currentPool();
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

export function renderLearningQuiz(simulationDate) {
  const item = currentItem();
  const pool = currentPool();
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
    return `<button type="button" class="learning-option${stateClass}" data-learning-answer="${letter}" aria-pressed="${selected}" ${session.answered !== null ? 'disabled' : ''}><span class="learning-letter">${letter}</span><span>${escapeHtml(option)}</span></button>`;
  }).join('');
  const record = progress[item.id];
  const answer = session.answered;
  const correct = answer !== null && answer === item.correctOption;
  const feedback = answer === null ? '' : `<div class="learning-feedback ${correct ? 'is-correct' : 'is-wrong'}" role="status"><strong>${correct ? 'Richtig' : `Noch nicht richtig · Lösung ${item.correctOption}`}</strong><p>${escapeHtml(item.explanation)}</p><p><b>Wirkung im Fallunternehmen:</b> ${escapeHtml(item.companyEffect)}</p>${record?.nextReviewAt ? `<small>Nächste Wiederholung ab ${escapeHtml(record.nextReviewAt)} im Spielkalender.</small>` : ''}</div>`;
  const sourceText = item.sourceKind === 'law' || String(item.sourceKind).includes('legal') ? 'Primärrechtsbezug / Rechtsstand' : 'Abgeleitete Lernkompetenz';
  return `<section class="card wide learning-quiz" aria-labelledby="learning-quiz-title"><div class="section-title"><div><h2 id="learning-quiz-title">Prüfungswissen üben</h2><p class="muted">Eigenständige Lernfälle · deine Antworten verändern weder Simulation noch Buchhaltung.</p></div><span class="status">${done}/${allItems.length} begonnen</span></div><div class="learning-stats"><span>${totalAttempts} Antworten</span><span>${totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0} % richtig</span><span>${due} fällige Wiederholungen</span></div><label class="field-label" for="learning-area">Prüfungsbereich</label><select class="field learning-area" id="learning-area" data-learning-area><option value="all" ${session.areaId === 'all' ? 'selected' : ''}>Alle Bereiche (${allItems.length})</option>${[...WBQ_AREAS, ...HSQ_AREAS].map(area => `<option value="${escapeHtml(area.id)}" ${session.areaId === area.id ? 'selected' : ''}>${escapeHtml(area.name || area.title)} (${area.id.startsWith('wbq-') ? 'WBQ' : 'HSQ'}) · ${allItems.filter(entry => entry.areaId === area.id).length}</option>`).join('')}</select><div class="learning-progress-label"><span>${escapeHtml(areaLabels.get(item.areaId) || item.areaId)}</span><span>Fall ${session.position + 1} von ${pool.length} · ${record ? `${record.attempts || 0} Versuche` : 'neu'}</span></div><div class="learning-scenario"><p>${escapeHtml(item.scenario)}</p><h3>${escapeHtml(item.question)}</h3></div><div class="learning-options" role="group" aria-label="Antwortmöglichkeiten">${options}</div>${feedback}<div class="learning-actions">${answer === null ? '<span class="muted">Wähle eine Antwort, um Begründung und Wirkung zu sehen.</span>' : '<button type="button" class="btn btn-primary" data-learning-next>Weiter zum nächsten Fall →</button>'}</div><details class="learning-source"><summary>${sourceText} und Kompetenzbezug</summary><p>${sourceMarkup(item)}</p><p>Kompetenz-ID: <code>${escapeHtml(item.competenceId)}</code></p></details></section>`;
}

export function handleLearningQuizClick(event, simulationDate) {
  const answerButton = event.target.closest('[data-learning-answer]');
  if (answerButton) {
    if (session.answered !== null) return true;
    const item = currentItem();
    const answer = answerButton.dataset.learningAnswer;
    if (!item || !letters.includes(answer)) return true;
    session.answered = answer;
    const previous = progress[item.id] || { attempts: 0, correct: 0, streak: 0, intervalDays: 0 };
    const isCorrect = answer === item.correctOption;
    const streak = isCorrect ? (previous.streak || 0) + 1 : 0;
    const intervalDays = isCorrect ? Math.min(30, previous.intervalDays ? previous.intervalDays * 2 : 1) : 1;
    progress[item.id] = { attempts: (previous.attempts || 0) + 1, correct: (previous.correct || 0) + (isCorrect ? 1 : 0), streak, intervalDays, nextReviewAt: reviewDueDate(simulationDate, intervalDays) };
    saveProgress();
    return true;
  }
  const nextButton = event.target.closest('[data-learning-next]');
  if (nextButton) {
    session.position = (session.position + 1) % currentPool().length;
    session.answered = null;
    return true;
  }
  return false;
}

export function handleLearningQuizChange(event) {
  const select = event.target.closest('[data-learning-area]');
  if (!select) return false;
  session.areaId = areaLabels.has(select.value) ? select.value : 'all';
  session.position = 0;
  session.answered = null;
  return true;
}

export function getLearningProgressSnapshot() {
  return JSON.parse(JSON.stringify(progress));
}


