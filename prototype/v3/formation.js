import {
  createV3FormationState,
  applyV3FormationEvent,
  validateV3FormationState,
} from '../v3-company-formation.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const stageInfo = {
  idea: ['Idee', 'Beschreibe die Geschäftsidee und halte einen belegten nächsten Schritt fest.'],
  market_check: ['Markt prüfen', 'Prüfe Zielkunden, Nachfrage und Wettbewerb mit belegten Annahmen.'],
  offer_defined: ['Angebot definieren', 'Lege fest, welche Leistung oder welches Produkt angeboten wird.'],
  resources_and_capital_plan: ['Ressourcen & Kapitalplan', 'Erfasse Kapazität, Kosten, Finanzierung und Anforderungen. Danach ist die Tragfähigkeitsbewertung möglich.'],
  viability_assessed: ['Tragfähigkeit bewertet', 'Die dokumentierte Nutzerbewertung bleibt sichtbar. Eine Rechtsformwahl folgt als eigener Schritt.'],
  form_selected: ['Rechtsform gewählt', 'Bereite die gewählte Form vor und führe Statusbelege je Rechtsträger getrennt.'],
  formation_prepared: ['Gründung vorbereitet', 'Die Betriebsbereitschaft wird separat anhand belegter Eingaben geprüft.'],
  operating_ready: ['Betriebsbereit', 'Der Betrieb kann im Modell aufgenommen werden.'],
  operating: ['Betrieb aktiv', 'Die Betriebsaufnahme ist als V3-Statusereignis dokumentiert.'],
};
const stages = ['idea', 'market_check', 'offer_defined', 'resources_and_capital_plan'];
const viabilityKeys = [['market','Markt'],['offer','Angebot'],['capacity','Kapazität'],['costs','Kosten'],['financing','Finanzierung'],['requirements','Anforderungen']];
const readinessKeys = [['representatives','Geschäftsführung & Vertretung'],['locationAndResources','Standort & Ressourcen'],['requirements','Erlaubnisse & Voraussetzungen'],['financialPlan','Finanzplan']];
const statusLabels = {preparation:'Vorbereitung',filing_pending:'Einreichung offen',registered:'Eingetragen',rejected_or_returned:'Zurückgewiesen/zurückgegeben',not_started:'Nicht begonnen',not_applicable:'Nicht anwendbar',proposed:'Vorgeschlagen',assessed:'Geprüft',review_pending:'Prüfung offen',closed:'Abgeschlossen',operating:'Aktiv',blocked:'Gesperrt'};
let state = null;
let scenarioPrefix = '';
let nextNumber = 1;

function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function setStatus(message, kind='') { const el = $('#live-status'); el.textContent = message; el.className = `live-status ${kind}`; }
function setSetupStatus(message, ready=false) { const chip=$('#setup-status'); chip.textContent=message; chip.className=`tag ${ready?'good':'pending'}`; }
function formData(form) { return Object.fromEntries(new FormData(form).entries()); }
function tokens(value) { return value.split(',').map(item => item.trim()).filter(Boolean); }
function currentDate() { return $('#event-date').value; }
function sourceInput(form, name='sourceRef') { return new FormData(form).get(name)?.toString().trim() || ''; }
function makeEvent(type, sourceRef, extra={}) {
  const date = currentDate();
  if (!date || !sourceRef.trim()) throw new Error('Bitte Wirksamkeitsdatum und Quellen-/Belegreferenz angeben.');
  const eventId = `${scenarioPrefix}-${String(nextNumber++).padStart(4,'0')}`;
  return { eventId, type, effectiveDate: date, sourceRef: sourceRef.trim(), ...extra };
}
function dispatch(type, sourceRef, extra={}) {
  if (!state) return false;
  let event;
  try { event = makeEvent(type, sourceRef, extra); }
  catch (error) { setStatus(error.message, 'error'); return false; }
  const result = applyV3FormationEvent(state, event);
  if (!result.ok) { setStatus(`Nicht gespeichert: ${result.error?.message || result.error?.code || 'A02 hat das Ereignis abgelehnt.'}`, 'error'); render(); return false; }
  state = result.state;
  setStatus(result.duplicate ? 'Ereignis war bereits verarbeitet; es wurde nicht erneut angewendet.' : `Gespeichert: ${type}.`);
  render();
  return true;
}
function selectedEntityIds() {
  const form = state?.foundingProject?.selectedForm;
  if (form === 'gmbh_co_kg') return state.entities.filter(entity => ['gmbh','kg'].includes(entity.entityType)).map(entity => entity.entityId);
  return [state.entities[0].entityId];
}
function renderInputList(container, rows, namePrefix, mode='complete') {
  container.innerHTML = rows.map(([key,label]) => `<label class="input-item"><strong>${esc(label)}</strong><select name="${esc(namePrefix)}-${esc(key)}-status" required><option value="">Status auswählen</option><option value="${mode}">${mode === 'complete' ? 'Vollständig belegt' : 'Bestanden und belegt'}</option></select><input name="${esc(namePrefix)}-${esc(key)}-ref" required autocomplete="off" placeholder="Quellen-/Belegreferenz" aria-label="Beleg: ${esc(label)}"></label>`).join('');
}
function render() {
  if (!state) return;
  $('#workspace').hidden = false;
  const project = state.foundingProject;
  const [title,description] = stageInfo[project.stage] || ['Status', ''];
  $('#stage-title').textContent = title;
  $('#stage-description').textContent = description;
  const badge = $('#stage-badge');
  badge.textContent = project.stage === 'viability_assessed' ? (project.viability.result === 'viable' ? 'Tragfähig' : 'Nicht tragfähig') : (statusLabels[project.stage] || title);
  badge.className = `tag${project.viability.result === 'viable' ? ' good' : project.viability.result === 'not_viable' ? ' bad' : ''}`;
  const idx = stages.indexOf(project.stage);
  $('#stage-form').hidden = idx < 0;
  $('#viability-panel').hidden = project.stage !== 'resources_and_capital_plan' && project.viability.status !== 'assessed';
  $('#form-panel').hidden = project.stage !== 'viability_assessed' && project.stage !== 'form_selected' && project.stage !== 'formation_prepared' && project.stage !== 'operating_ready' && project.stage !== 'operating';
  $('#formation-panel').hidden = !['form_selected','formation_prepared','operating_ready','operating'].includes(project.stage);
  $('#readiness-panel').hidden = !['formation_prepared','operating_ready','operating'].includes(project.stage);
  $('#operations-form').hidden = project.stage !== 'operating_ready';
  $$('#viability-form input, #viability-form select, #viability-form button').forEach(input => input.disabled = project.viability.status === 'assessed');
  if (project.viability.status === 'assessed') $('#viability-form button').textContent = 'Bewertung bereits gespeichert';
  $('#viability-result').textContent = project.viability.status === 'assessed' ? (project.viability.result === 'viable' ? 'Tragfähig (Spielerbewertung)' : 'Nicht tragfähig (Spielerbewertung)') : 'Noch nicht bewertet';
  $('#viability-result').className = `tag${project.viability.result === 'viable' ? ' good' : project.viability.result === 'not_viable' ? ' bad' : ''}`;
  const selectedForm = project.selectedForm;
  $('#entity-id-fields').hidden = selectedForm !== 'gmbh_co_kg';
  $$('#form-select-form input[name="legalForm"]').forEach(input => { input.disabled = Boolean(selectedForm); input.checked = input.value === selectedForm; });
  $('#form-select-form button').disabled = Boolean(selectedForm);
  $('#prepare-form').hidden = project.stage !== 'form_selected';
  $('#register-controls').innerHTML = state.entities.filter(entity => entity.entityType !== 'einzelunternehmen').map(entity => {
    const next = entity.registerStatus === 'preparation' ? 'filing_pending' : entity.registerStatus === 'filing_pending' ? 'registered' : null;
    return `<div class="register-card"><div><strong>${esc(entity.entityType === 'gmbh' ? 'GmbH' : 'KG')} · ${esc(entity.entityId)}</strong><p>Status: ${esc(statusLabels[entity.registerStatus] || entity.registerStatus)}</p></div>${next ? `<form class="register-form form-grid" data-entity="${esc(entity.entityId)}" data-next="${esc(next)}"><label>Beleg für ${esc(statusLabels[next])}<input name="evidence" required autocomplete="off"></label><button class="primary" type="submit">Status dokumentieren</button></form>` : ''}</div>`;
  }).join('');
  const kg = state.entities.find(entity => entity.entityType === 'kg');
  $('#prereg-panel').hidden = !kg || kg.registerStatus === 'registered';
  $('#prereg-form [name="kgEntityId"]').value = kg?.entityId || '';
  $('#prereg-form [name="kgEntityId"]').readOnly = Boolean(kg);
  $('#prereg-form [name="partnerEntityIds"]').value = kg?.partners?.map(partner => partner.partnerId).join(', ') || '';
  $('#prereg-form [name="partnerEntityIds"]').readOnly = Boolean(kg?.partners?.length);
  $('#readiness-form').hidden = project.stage !== 'formation_prepared';
  $('#readiness-inputs').innerHTML = readinessKeys.map(([key,label]) => `<label class="input-item"><strong>${esc(label)}</strong><select name="ready-${esc(key)}" required><option value="">Status auswählen</option><option value="passed">Bestanden und belegt</option></select><input name="ready-ref-${esc(key)}" required autocomplete="off" placeholder="Quellen-/Belegreferenz" aria-label="Beleg: ${esc(label)}"></label>`).join('');
  renderEntities(); renderDeals(); renderEvents(); renderFinance();
  const validity = validateV3FormationState(state);
  $('#model-validity').textContent = validity.valid ? 'A02-Zustand gültig' : `A02-Fehler: ${validity.errors.join(', ')}`;
  $('#model-validity').className = `tag ${validity.valid ? 'good' : 'bad'}`;
}
function renderEntities() {
  $('#entity-list').innerHTML = state.entities.map(entity => `<article class="entity-card"><div><div class="entity-type">${esc(entity.entityType === 'einzelunternehmen' ? 'Einzelunternehmen' : entity.entityType === 'gmbh' ? 'GmbH' : 'KG')}</div><p>ID: <code>${esc(entity.entityId)}</code> · Gründung: ${esc(statusLabels[entity.formationStatus] || entity.formationStatus)} · Register: ${esc(statusLabels[entity.registerStatus] || entity.registerStatus)} · Betrieb: ${esc(statusLabels[entity.operatingStatus] || entity.operatingStatus)}</p>${entity.gmbhEntityId ? `<p>Komplementärin-Referenz: ${esc(entity.gmbhEntityId)}</p>` : ''}</div><span class="tag">${esc(entity.legalForm)}</span></article>`).join('');
}
function renderDeals() {
  const coopCards = state.cooperations.map(item => `<article class="deal-card"><div class="deal-head"><div><strong>${item.cooperationType === 'joint_procurement' ? 'Gemeinsame Beschaffung' : 'Arbeitsgemeinschaft'} · ${esc(item.cooperationId)}</strong><p>Status: ${esc(statusLabels[item.status] || item.status)} · Beteiligte: ${item.participantEntityIds.map(esc).join(', ')}</p></div><span class="tag pending">Prüfpflichtig</span></div>${['proposed','review_pending'].includes(item.status) ? `<form class="review-form review-row" data-kind="cooperation" data-id="${esc(item.cooperationId)}"><div class="review-grid"><label>Rechtsformprüfung<select name="legalStatus"><option value="">Status</option><option value="cleared">Geprüft</option><option value="not_applicable">Nicht anwendbar</option></select><input name="legalRef" required placeholder="Belegreferenz"></label><label>Wettbewerbsprüfung<select name="competitionStatus"><option value="">Status</option><option value="cleared">Geprüft</option><option value="not_applicable">Nicht anwendbar</option></select><input name="competitionRef" required placeholder="Belegreferenz"></label></div><button class="primary" type="submit">Prüfergebnisse dokumentieren</button></form>`:''}${item.status === 'assessed' ? `<form class="close-form review-row" data-kind="cooperation" data-id="${esc(item.cooperationId)}"><label>Abschlussbeleg<input name="closureRef" required></label><button class="primary" type="submit">Kooperation abschließen</button></form>`:''}</article>`);
  const dealCards = state.deals.map(item => `<article class="deal-card"><div class="deal-head"><div><strong>${item.dealType === 'share_deal' ? 'Anteilserwerb (Share Deal)' : 'Asset-/Betriebskauf'} · ${esc(item.dealId)}</strong><p>Käufer: ${esc(item.buyerEntityId)} · Ziel: ${esc(item.targetEntityId)} · Status: ${esc(statusLabels[item.status] || item.status)}</p></div><span class="tag pending">Einzelfallprüfung</span></div><details class="subpanel"><summary>Erfasste Prüfinputs ansehen</summary><p class="muted">Eingaben und Belegreferenzen; keine automatische Rechtsbewertung.</p><pre>${esc(JSON.stringify({legalReview:item.legalReview,competitionReview:item.competitionReview,businessTransferReview:item.businessTransferReview,section613a2Review:item.section613a2Review,section25Review:item.section25Review,employeeTransferReviews:item.employeeTransferReviews},null,2))}</pre></details>${['proposed','review_pending'].includes(item.status) ? `<form class="review-form review-row" data-kind="deal" data-id="${esc(item.dealId)}" data-type="${esc(item.dealType)}"><div class="review-grid"><label>Rechtsprüfung<select name="legalStatus"><option value="">Status</option><option value="cleared">Geprüft</option><option value="needs_review">Weitere Prüfung nötig</option><option value="not_applicable">Nicht anwendbar</option></select><input name="legalRef" required placeholder="Belegreferenz"></label><label>Wettbewerbsprüfung<select name="competitionStatus"><option value="">Status</option><option value="cleared">Geprüft</option><option value="needs_review">Weitere Prüfung nötig</option><option value="not_applicable">Nicht anwendbar</option></select><input name="competitionRef" required placeholder="Belegreferenz"></label>${item.dealType === 'asset_business_deal' ? `<label>§ 613a BGB: Prüfergebnis<select name="businessTransferStatus" required><option value="">Status</option><option value="applies">Anwendbarkeit festgestellt</option><option value="not_applicable">Nicht anwendbar festgestellt</option><option value="needs_review">Prüfung offen</option></select><input name="businessTransferRef" required placeholder="Belegreferenz"><small>Nur dokumentiertes Prüfergebnis übernehmen; die UI leitet es nicht ab.</small></label>
<label>Übertragener Betrieb/Betriebsteil<input name="businessTransferScope" required placeholder="konkreter Umfang / Referenz"><input name="businessTransferDate" type="date" required aria-label="Wirksamkeitsdatum der Übertragung"><input name="employerEntityRefs" required placeholder="bisheriger und neuer Arbeitgeber (IDs)"></label>
<label>Unterrichtung der Beschäftigten<select name="employeeInformationStatus" required><option value="">Status</option><option value="complete">Belegt abgeschlossen</option><option value="pending">Offen</option><option value="not_applicable">Nach dokumentierter Prüfung nicht anwendbar</option></select><input name="employeeInformationRef" required placeholder="Belegreferenz"></label>
<label>Widersprüche / Friststatus<select name="objectionStatus" required><option value="">Status</option><option value="none_reported">Keine gemeldet (Beleg erforderlich)</option><option value="reported">Widerspruch gemeldet</option><option value="pending">Prüfung offen</option><option value="not_applicable">Nach dokumentierter Prüfung nicht anwendbar</option></select><input name="objectionRef" required placeholder="Belegreferenz"></label>
<label>§ 25 HGB: Prüfergebnis<select name="section25Status" required><option value="">Status</option><option value="applies">Tatbestand festgestellt</option><option value="not_applicable">Nicht anwendbar festgestellt</option><option value="needs_review">Prüfung offen</option></select><input name="section25Ref" required placeholder="Belegreferenz"></label>
<label>Fortführung unter bisheriger Firma<select name="firmContinuation" required><option value="">Status</option><option value="yes">Belegt</option><option value="no">Nicht belegt</option><option value="unknown">Ungeklärt</option></select><input name="priorFirmRef" required placeholder="Beleg frühere Firma"><input name="continuedFirmRef" required placeholder="Beleg fortgeführte Firma"></label>
<label>Zustimmung zur Forderungsübertragung<select name="claimTransferConsent" required><option value="">Status</option><option value="yes">Zustimmung belegt</option><option value="no">Keine Zustimmung belegt</option><option value="unknown">Ungeklärt</option></select><input name="claimConsentRef" required placeholder="Belegreferenz"></label>
<label>Drittwirkung einer abweichenden Vereinbarung<select name="thirdPartyEffect" required><option value="">Status</option><option value="registered_and_published">Eingetragen und bekanntgemacht</option><option value="notified_to_third_party">Drittem mitgeteilt</option><option value="none">Keiner der Belege</option><option value="unknown">Ungeklärt</option></select><input name="thirdPartyEffectRef" required placeholder="Register-/Mitteilungsbeleg"></label>
<label>§ 613a Abs. 2 Prüfergebnis<select name="section613a2Status" required><option value="">Status</option><option value="assessed">Anspruchspositionen geprüft</option><option value="not_applicable">Nicht anwendbar geprüft</option></select><input name="section613a2Ref" required placeholder="Belegreferenz"></label>
<label class="wide">§ 613a Abs. 2 Anspruchspositionen als JSON<input name="section613a2Claims" required placeholder='[] oder [{"obligationRef":"…","priorEmployerEntityId":"…","newEmployerEntityId":"…","incurredAt":"YYYY-MM-DD","dueAt":"YYYY-MM-DD","measurementPeriodStart":"YYYY-MM-DD","measurementPeriodEnd":"YYYY-MM-DD","amountStatus":"unknown","amountRef":"… (falls documented)","sourceRef":"…"}]'></label>
<label>§ 25 HGB Prüfgrundlage<select name="section25Basis" required><option value="">Auswählen</option><option value="firm_continuation">Fortführung unter bisheriger Firma</option><option value="special_obligation">Besonderer Verpflichtungsgrund</option><option value="needs_review">Prüfung offen</option><option value="not_applicable">Nicht anwendbar geprüft</option></select></label>
<label>Besonderer Verpflichtungsgrund ohne Firmenfortführung<input name="specialCommitmentRef" required placeholder="Beleg / ausdrücklich: nicht anwendbar"></label>
<label>Betroffene § 25-Verbindlichkeiten als JSON<input name="section25Obligations" required placeholder='[] oder [{"obligationRef":"…","sourceRef":"…"}]'></label>
<label>Betroffene Altverbindlichkeiten<input name="liabilityRefs" required placeholder="IDs/Quellen oder ausdrücklich: keine festgestellt"></label>
<label>Betroffene Betriebsforderungen<input name="receivableRefs" required placeholder="IDs/Quellen oder ausdrücklich: keine festgestellt"></label>
<label class="wide">Beschäftigtenprüfungen als JSON (falls § 613a anwendbar)<textarea name="employeeReviews" rows="3" placeholder='[{"employeeRef":"…","outcome":"transfers","informationStatus":"complete","objectionStatus":"pending_window","sourceRef":"…"}]'></textarea><small>Bei Ergebnis „anwendbar“ verlangt A02 einen Eintrag je betroffener Person.</small></label>` : ''}</div><button class="primary" type="submit">Prüfergebnisse speichern</button></form>`:''}${item.status === 'assessed' ? `<form class="close-form review-row" data-kind="deal" data-id="${esc(item.dealId)}"><label>Abschlussbeleg<input name="closureRef" required></label><button class="primary" type="submit">Vorgang abschließen (A03-Handoff)</button></form>`:''}${item.status === 'review_pending' ? '<p class="muted">Weiterer Review nötig. Der Vorgang bleibt offen; kein Abschluss verfügbar.</p>':''}</article>`);
  $('#deal-list').innerHTML = [...coopCards,...dealCards].join('') || '<p class="muted">Noch keine Kooperationen oder Erwerbsvorgänge.</p>';
}
function renderEvents() {
  const entries = [...state.events].reverse().map(event => `<li class="event-row"><strong>${esc(event.type)}</strong> · ${esc(event.effectiveDate)}<br><code>${esc(event.eventId)}</code> · Quelle: ${esc(event.sourceRef)}</li>`);
  $('#event-list').innerHTML = entries.join('') || '<li class="muted">Noch keine Ereignisse.</li>';
}
function renderFinance() {
  $('#finance-list').innerHTML = state.financeHandoffs.length ? state.financeHandoffs.map(item => `<article class="handoff"><div><strong>Ausstehende A03-Übergabe · ${esc(item.sourceType)}</strong><p>Datum: ${esc(item.effectiveDate)} · Quellevent: ${esc(item.sourceEventId)}</p><p>Keine Buchung und keine Cashwirkung. Finanzdetails warten auf explizite A03-Ereignisgrundlage.</p><ul>${(item.requiredForA03Evaluation||[]).map(value=>`<li>${esc(value)}</li>`).join('')}</ul></div><span class="tag pending">Offen</span></article>`).join('') : '<p class="muted">Keine A03-Übergaben vorhanden.</p>';
}
function parseJson(text, label) { try { return JSON.parse(text); } catch { throw new Error(`${label}: gültiges JSON eingeben.`); } }

renderInputList($('#viability-inputs'), viabilityKeys, 'viability');
$('#setup-form').addEventListener('submit', event => {
  event.preventDefault(); const data = formData(event.currentTarget);
  try {
    scenarioPrefix = data.scenarioId.trim().replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,32);
    state = createV3FormationState({scenarioId:data.scenarioId.trim(),startDate:data.startDate,founderPersonId:data.founderPersonId.trim(),initialEntityId:data.initialEntityId.trim(),initialEntitySourceRef:data.initialEntitySourceRef.trim()});
    nextNumber = 1; $('#event-date').value = data.startDate; $('#workspace').hidden = false; render(); setSetupStatus('Szenario geladen',true); setStatus('Szenario geladen. Ausgangswerte stammen vollständig aus deinen Eingaben.');
  } catch(error) { setSetupStatus('Eingaben erforderlich'); setStatus(error.message,'error'); }
});
$('#stage-form').addEventListener('submit', event => {
  event.preventDefault(); const fromStage = state.foundingProject.stage; const toStage = stages[stages.indexOf(fromStage)+1]; const ref = sourceInput(event.currentTarget,'stageEvidenceRef');
  dispatch('ADVANCE_FOUNDING_STAGE',ref,{fromStage,toStage,stageEvidenceRef:ref}); event.currentTarget.reset();
});
$('#viability-form').addEventListener('submit', event => {
  event.preventDefault(); const data = formData(event.currentTarget); const assessmentInputs = {};
  for (const [key] of viabilityKeys) assessmentInputs[key] = {status:data[`viability-${key}-status`],sourceRef:data[`viability-${key}-ref`]};
  const done = dispatch('ASSESS_VIABILITY',data.sourceRef,{assessmentId:data.assessmentId,result:data.result,assessmentInputs}); if(done) event.currentTarget.reset();
});
$('#form-select-form').addEventListener('change', event => { if(event.target.name==='legalForm') $('#entity-id-fields').hidden = event.target.value !== 'gmbh_co_kg'; });
$('#form-select-form').addEventListener('submit', event => {
  event.preventDefault(); const data = formData(event.currentTarget); const extra = {legalForm:data.legalForm,selectionRef:data.selectionRef};
  if(data.legalForm==='gmbh_co_kg') {
    const founder = state.foundingProject.founderPersonId;
    extra.entityIds={gmbhEntityId:data.gmbhEntityId.trim(),kgEntityId:data.kgEntityId.trim()};
    extra.ownershipRefs=[{entityId:extra.entityIds.gmbhEntityId,holderId:founder,shareOrControlBasis:data.gmbhOwnershipBasis.trim(),sourceRef:data.selectionRef},{entityId:extra.entityIds.kgEntityId,holderId:founder,shareOrControlBasis:data.kgOwnershipBasis.trim(),sourceRef:data.selectionRef}];
    extra.partnerRefs=[{kgEntityId:extra.entityIds.kgEntityId,partnerId:extra.entityIds.gmbhEntityId,role:'komplementaer',sourceRef:data.selectionRef},{kgEntityId:extra.entityIds.kgEntityId,partnerId:data.kgLimitedPartnerId.trim(),role:'kommanditist',sourceRef:data.kgPartnerRef.trim()}];
  }
  dispatch('SELECT_FORM',data.selectionRef,extra);
});
$('#prepare-form').addEventListener('submit', event => {event.preventDefault();const ref=sourceInput(event.currentTarget,'preparationRef');dispatch('PREPARE_FORMATION',ref,{preparationRef:ref,entityIds:selectedEntityIds()});});
$('#register-controls').addEventListener('submit', event => {
  if(!event.target.matches('.register-form')) return; event.preventDefault(); const form=event.target; const ref=sourceInput(form,'evidence');
  dispatch('SET_REGISTER_STATUS',ref,{entityId:form.dataset.entity,status:form.dataset.next,registerEvidenceRef:ref});
});
$('#prereg-form').addEventListener('submit', event => {
  event.preventDefault();const data=formData(event.currentTarget);const partnerIds=tokens(data.partnerEntityIds);const partnerConsentRefs=tokens(data.partnerConsentRefs);
  if(data.reviewStatus!=='cleared'){setStatus('Der Vorregisterpfad bleibt offen: eine als ungeklärt markierte Prüfung kann nicht autorisiert werden.','error');return;}
  dispatch('AUTHORIZE_KG_PREREGISTRATION_ACTIVITY',data.reviewSourceRef,{kgEntityId:data.kgEntityId,partnerIds,partnerConsentRefs,section123Review:{status:'cleared',sourceRef:data.reviewSourceRef}});
});
$('#readiness-form').addEventListener('submit', event => {
  event.preventDefault();const data=formData(event.currentTarget);const readiness={}; for(const [key] of readinessKeys) readiness[key]={status:data[`ready-${key}`],sourceRef:data[`ready-ref-${key}`]};
  const sourceRef=readinessKeys.map(([key])=>readiness[key].sourceRef).join('|'); dispatch('ASSESS_OPERATIONAL_READINESS',sourceRef,{readiness});
});
$('#operations-form').addEventListener('submit',event=>{event.preventDefault();dispatch('START_OPERATIONS',sourceInput(event.currentTarget,'sourceRef'));});
$$('.tab').forEach(button=>button.addEventListener('click',()=>{
  $$('.tab').forEach(tab=>tab.classList.toggle('active',tab===button));
  $$('.view').forEach(view=>view.hidden=view.id!==`view-${button.dataset.view}`);
}));
$('#cooperation-open').addEventListener('submit',event=>{
  event.preventDefault();const data=formData(event.currentTarget);dispatch('OPEN_COOPERATION',data.termsRef,{cooperationId:data.cooperationId,cooperationType:data.cooperationType,participantEntityIds:tokens(data.participantEntityIds),purposeRef:data.purposeRef,termsRef:data.termsRef});event.currentTarget.reset();
});
$('#deal-open').addEventListener('submit',event=>{
  event.preventDefault();const data=formData(event.currentTarget);let items;
  try{items=parseJson(data.itemsJson,'Anteils-/Gegenstandsliste');}catch(error){setStatus(error.message,'error');return;}
  const common={dealId:data.dealId,buyerEntityId:data.buyerEntityId,targetEntityId:data.targetEntityId,termsRef:data.termsRef};
  const isShare=data.dealType==='share';dispatch(isShare?'OPEN_SHARE_DEAL':'OPEN_ASSET_DEAL',data.termsRef,{...common,...(isShare?{ownershipChangeRefs:items}:{assetTransferRefs:items})});
});
$('#deal-list').addEventListener('submit',event=>{
  event.preventDefault();const form=event.target;const data=formData(form);
  if(form.matches('.review-form')) {
    if(form.dataset.kind==='cooperation') dispatch('ASSESS_COOPERATION',data.legalRef,{cooperationId:form.dataset.id,legalFormReview:{status:data.legalStatus,sourceRef:data.legalRef},competitionReview:{status:data.competitionStatus,sourceRef:data.competitionRef}});
    else {
      const deal={dealId:form.dataset.id,legalReview:{status:data.legalStatus,sourceRef:data.legalRef},competitionReview:{status:data.competitionStatus,sourceRef:data.competitionRef}};
      if(form.dataset.type==='asset_business_deal') {
        deal.businessTransferReview={status:data.businessTransferStatus,sourceRef:data.businessTransferRef,checklist:{scopeRef:data.businessTransferScope,effectiveDate:data.businessTransferDate,employerEntityRefs:data.employerEntityRefs,employeeInformationStatus:data.employeeInformationStatus,employeeInformationRef:data.employeeInformationRef,objectionStatus:data.objectionStatus,objectionRef:data.objectionRef}}; deal.section613a2Review={status:data.section613a2Status,sourceRef:data.section613a2Ref,claims:parseJson(data.section613a2Claims,'§ 613a Abs. 2 Anspruchspositionen')}; deal.section25Review={status:data.section25Status,sourceRef:data.section25Ref,basis:data.section25Basis,obligationRefs:parseJson(data.section25Obligations,'§ 25 Anspruchspositionen'),priorFirmRef:data.priorFirmRef,continuedFirmRef:data.continuedFirmRef,specialObligationRef:data.specialCommitmentRef,checklist:{firmContinuation:data.firmContinuation,firmContinuationRef:data.firmContinuationRef,claimTransferConsent:data.claimTransferConsent,claimConsentRef:data.claimConsentRef,thirdPartyEffect:data.thirdPartyEffect,thirdPartyEffectRef:data.thirdPartyEffectRef,liabilityRefs:data.liabilityRefs,receivableRefs:data.receivableRefs}};
        try { deal.employeeTransferReviews=data.employeeReviews?.trim()?parseJson(data.employeeReviews,'Beschäftigtenprüfungen'):[]; } catch(error){setStatus(error.message,'error');return;}
      }
      dispatch('REVIEW_DEAL',data.legalRef,deal);
    }
  } else if(form.matches('.close-form')) dispatch(form.dataset.kind==='cooperation'?'CLOSE_COOPERATION':'CLOSE_DEAL',data.closureRef,{...(form.dataset.kind==='cooperation'?{cooperationId:form.dataset.id}:{dealId:form.dataset.id}),closureRef:data.closureRef});
});

for(const key of ['founding','entities','deals']) { const button=$(`.tab[data-view="${key}"]`);button.addEventListener('click',()=>window.scrollTo({top:$('#workspace').offsetTop,behavior:'smooth'})); }


