export const V3_INQUIRY_PRACTICE_VERSION = 'T-0109-identify-inquiry-v1';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const OPTIONS = Object.freeze({
  A: 'Prüfen, ob Status und Angebotsfrist noch offen sind; Fähigkeiten, Kapazitätsbedarf und Auftragsgröße mit dem Betrieb abgleichen. Kundensegment ist Kontext, aber weder Auftrag noch garantierter Umsatz.',
  B: 'Die Anfrage ist bereits ein Auftrag. Ich kann deshalb Arbeit einplanen und den erwarteten Preis als Umsatz buchen.',
  C: 'Wenn der erwartete Deckungsbeitrag positiv ist, reichen Material und Preis für die Entscheidung; Fähigkeiten und Kapazität können später geprüft werden.',
  D: 'Wenn Auftragsgröße und Kundensegment zum Betrieb passen, ist der Zuschlag sicher; Frist und geforderte Fähigkeiten ändern das nicht.',
});
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '') && Number.isFinite(Date.parse(value + 'T00:00:00.000Z')) && new Date(value + 'T00:00:00.000Z').toISOString().slice(0, 10) === value;
const FEEDBACK = Object.freeze({
  A: 'Richtig. Eine offene, fristgerechte Anfrage ist noch kein Auftrag. Prüfe die Anforderungen und verfügbare Kapazität; Segment und Größe helfen bei der Einordnung, garantieren aber keinen Zuschlag.',
  B: 'Eine Anfrage ist weder Vertrag noch Umsatz. Erst eine spätere Kundenannahme kann den Auftragsablauf öffnen; bis dahin gibt es keine Arbeitsfreigabe oder Buchung.',
  C: 'Eine positive Kalkulation ersetzt nicht die Prüfung von Angebotsfrist, benötigten Fähigkeiten und verfügbarer Kapazität. Beides muss vor der Angebotsentscheidung getrennt geprüft werden.',
  D: 'Größe und Segment sind Nachfragekontext, keine Zuschlagsgarantie. Status, Frist und konkrete Fertigungsanforderungen bleiben entscheidend.',
});

export function getInquiryPracticeSourceRevision(inquiry, currentDate) {
  return JSON.stringify({
    inquiryId: inquiry?.inquiryId ?? null,
    status: inquiry?.status ?? null,
    currentDate: currentDate ?? null,
    expiresAt: inquiry?.expiresAt ?? null,
    sizeClass: inquiry?.sizeClass ?? null,
    segmentId: inquiry?.segmentId ?? null,
    requiredCapabilities: Array.isArray(inquiry?.requiredCapabilities) ? [...inquiry.requiredCapabilities] : null,
    requiredCapacity: Number.isFinite(inquiry?.requiredCapacity) ? inquiry.requiredCapacity : null,
  });
}

export function evaluateInquiryPractice(inquiry, currentDate, selectedOption) {
  if (!inquiry || inquiry.status !== 'open') throw new Error('Die Übung ist nur für eine aktuell offene Anfrage verfügbar.');
  if (typeof inquiry.inquiryId !== 'string' || !inquiry.inquiryId.trim()) throw new Error('Anfrage-ID ist nicht verfügbar.');
  if (!validDate(currentDate) || !validDate(inquiry.expiresAt)) throw new Error('Datum oder Angebotsfrist ist nicht verfügbar.');
  if (!Array.isArray(inquiry.requiredCapabilities)
    || typeof inquiry.sizeClass !== 'string' || !inquiry.sizeClass
    || typeof inquiry.segmentId !== 'string' || !inquiry.segmentId
    || !Number.isFinite(inquiry.requiredCapacity)) {
    throw new Error('Anforderungs- oder Kontextdaten sind nicht vollständig verfügbar; die Antwort wird nicht bewertet.');
  }
  if (currentDate > inquiry.expiresAt) throw new Error('Die Angebotsfrist ist abgelaufen; die Anfrage kann nicht geübt werden.');
  if (!Object.hasOwn(OPTIONS, selectedOption)) throw new Error('Bitte wähle eine der angezeigten Antworten.');
  return Object.freeze({
    exerciseVersion: V3_INQUIRY_PRACTICE_VERSION,
    inquiryId: inquiry.inquiryId,
    sourceRevision: getInquiryPracticeSourceRevision(inquiry, currentDate),
    selectedOption,
    correct: selectedOption === 'A',
    feedback: FEEDBACK[selectedOption],
    completedAt: currentDate,
  });
}

export function renderInquiryPractice(inquiry, currentDate, progress = null) {
  if (!inquiry || inquiry.status !== 'open') return '';
  const sourceRevision = getInquiryPracticeSourceRevision(inquiry, currentDate);
  const matchingProgress = progress?.exerciseVersion === V3_INQUIRY_PRACTICE_VERSION
    && progress?.inquiryId === inquiry.inquiryId
    && progress?.sourceRevision === sourceRevision
    ? progress : null;
  const missing = [];
  if (!validDate(currentDate)) missing.push('Simulationstag');
  if (!validDate(inquiry.expiresAt)) missing.push('Angebotsfrist');
  if (!Array.isArray(inquiry.requiredCapabilities)) missing.push('geforderte Fähigkeiten');
  if (typeof inquiry.sizeClass !== 'string' || !inquiry.sizeClass) missing.push('Auftragsgröße');
  if (typeof inquiry.segmentId !== 'string' || !inquiry.segmentId) missing.push('Kundensegment');
  if (!Number.isFinite(inquiry.requiredCapacity)) missing.push('Kapazitätsbedarf');
  const blocked = missing.length > 0 || currentDate > (inquiry.expiresAt ?? '');
  const facts = `<dl class="inquiry-practice-facts"><dt>Status</dt><dd>${esc(inquiry.status || 'nicht verfügbar')}</dd><dt>Simulationstag</dt><dd>${esc(currentDate || 'nicht verfügbar')}</dd><dt>Angebotsfrist</dt><dd>${esc(inquiry.expiresAt || 'nicht verfügbar')}</dd><dt>Größe</dt><dd>${esc(inquiry.sizeClass || 'nicht verfügbar')}</dd><dt>Kundensegment</dt><dd>${esc(inquiry.segmentId || 'nicht verfügbar')}</dd><dt>Fähigkeiten</dt><dd>${Array.isArray(inquiry.requiredCapabilities) ? esc(inquiry.requiredCapabilities.join(', ') || 'keine Zusatzfähigkeit angegeben') : 'nicht verfügbar'}</dd><dt>Kapazitätsbedarf</dt><dd>${Number.isFinite(inquiry.requiredCapacity) ? esc(inquiry.requiredCapacity) : 'nicht verfügbar'}</dd></dl>`;
  const result = matchingProgress ? `<div class="inquiry-practice-result ${matchingProgress.correct ? 'is-correct' : 'is-incorrect'}" role="status"><strong>${matchingProgress.correct ? 'Richtig.' : 'Noch nicht richtig.'}</strong><p>${esc(matchingProgress.feedback)}</p><p>Antwort ${esc(matchingProgress.selectedOption)} · gespeichert als Lernfortschritt für diese Anfrage, getrennt vom Unternehmenslauf.</p><button type="button" class="secondary" data-inquiry-practice-return>Zurück zur Anfrage</button></div>` : '';
  const options = Object.entries(OPTIONS).map(([key, label]) => `<button type="button" class="inquiry-practice-option" data-inquiry-practice-answer="${key}" data-inquiry-id="${esc(inquiry.inquiryId)}"${blocked ? ' disabled' : ''}><strong>${key}.</strong> ${esc(label)}</button>`).join('');
  const availability = missing.length ? `<p class="field-note" role="status">Übung nicht bewertbar. Fehlende Angaben: ${esc(missing.join(', '))}. Es werden keine Werte ergänzt oder geraten.</p>` : currentDate > inquiry.expiresAt ? '<p class="field-note" role="status">Übungsantwort gesperrt: Die Angebotsfrist ist abgelaufen.</p>' : '';
  const body = matchingProgress ? result : `${facts}<p class="inquiry-practice-question">${esc('Welche Prüfung ist vor einer Angebotsentscheidung für diese Anfrage sinnvoll?')}</p>${availability}<div class="inquiry-practice-options">${options}</div><p class="field-note">Übung aus dem internen Prozesslernobjekt V3-LO-0068-ORDER-CYCLE-01. Sie reicht kein Angebot ein und verändert weder Anfrage noch Unternehmenslauf.</p>`;
  return `<details class="inquiry-practice" data-inquiry-practice="${esc(inquiry.inquiryId)}"><summary>Üben: Anfrage prüfen</summary><section aria-label="Übung zur Kundenanfrage"><p class="eyebrow">V3 · Markt und Angebotsentscheidung</p>${body}</section></details>`;
}
