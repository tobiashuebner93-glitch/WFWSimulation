import {
  createV3MarketState, scheduleV3MarketWeek, advanceV3MarketDay, closeV3MarketDay,
  submitV3MarketOffer, createV3MarketOfferId, getV3MarketPlayerView, getV3MonthlyCompetitorReport,
} from '../v3-market-simulation.js';
import { calculateV3OfferEstimate, createV3OfferSnapshot, acceptV3OfferSnapshot } from '../v3-financial-calculation.js';
import processLearning from '../../docs/learning/t-0068-v3-prozesslernobjekt.json' with { type: 'json' };

const euro = cents => {
  const amount=BigInt(cents), sign=amount<0n?'-':'', absolute=amount<0n?-amount:amount;
  return `${sign}${new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}).format(Number(absolute/100n))},${String(absolute%100n).padStart(2,'0')} €`;
};
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const shiftDate=(date,days)=>new Date(Date.parse(`${date}T12:00:00Z`)+days*86400000).toISOString().slice(0,10);
const statusText={scheduled:'Geplant',open:'Offen',resolved:'Entschieden',expired:'Abgelaufen',submitted:'Eingereicht',accepted:'Angenommen',declined:'Abgelehnt'};
const sizeText={small:'Klein',medium:'Mittel',large:'Groß'};

// Mirrors explicit A02 market regression fixtures; values remain synthetic test inputs.
export function createDocumentedMarketFixture(mode='competition'){
  if(!['competition','no_competitor_bids'].includes(mode)) throw new TypeError('Unbekannte Fixture-Variante');
  const parameters={weekdayWeights:{mon:.2,tue:.2,wed:.2,thu:.2,fri:.2},invitationWeights:{capacity:.25,reputation:.35,segmentFit:.4},minimumInvitationScore:.2,maximumInvitations:4,offerWindowCalendarDays:{min:3,max:5},customerDecisionDelayCalendarDays:{min:2,max:2},minimumMonthlyCompetitorSample:3};
  const segments=[
    {segmentId:'small',decisionWeights:{price:.6,reputation:.2,segmentFit:.2}},
    {segmentId:'medium',decisionWeights:{price:.5,reputation:.25,segmentFit:.25}},
    {segmentId:'large',decisionWeights:{price:.4,reputation:.25,segmentFit:.35}},
  ];
  const firms=[
    {firmId:'player',role:'player',reputation:.65,capacityUnits:12,capabilities:['turning','milling'],segmentFit:{small:.75,medium:.7,large:.6}},
    {firmId:'competitor-a',role:'competitor',reputation:.7,capacityUnits:15,capabilities:['turning','milling'],segmentFit:{small:.8,medium:.78,large:.75},offerPriceCentsBySizeClass:{small:10000,medium:30000,large:50000}},
    {firmId:'competitor-b',role:'competitor',reputation:.55,capacityUnits:8,capabilities:['turning'],segmentFit:{small:.6,medium:.55,large:.5},offerPriceCentsBySizeClass:{small:12000,medium:36000,large:62000}},
    {firmId:'ineligible',role:'competitor',reputation:1,capacityUnits:100,capabilities:['welding'],segmentFit:{small:1,medium:1,large:1},offerPriceCentsBySizeClass:{small:1,medium:1,large:1}},
  ];
  const scenarioFirms=mode==='no_competitor_bids'?firms.map(firm=>firm.role==='competitor'?{...firm,offerPriceCentsBySizeClass:{}}:firm):firms;
  let state=createV3MarketState({runId:mode==='no_competitor_bids'?'market-expiry-run':'market-run-1',scenarioId:mode==='no_competitor_bids'?'market-expiry-scenario':'market-scenario',seed:'seed-a',parameterSetId:mode==='no_competitor_bids'?'market-expiry-fixture-v1':'market-fixture-v1',startDate:'2027-01-04',parameters,segments,firms:scenarioFirms});
  const sizes=['small','medium','large'];
  const sizeInputs={small:{capacity:2,referencePriceCents:11000},medium:{capacity:4,referencePriceCents:33000},large:{capacity:5,referencePriceCents:55000}};
  const templatesFor=week=>Array.from({length:5},(_,i)=>{const sizeClass=sizes[i%3],input=sizeInputs[sizeClass];return {templateId:`${week}-request-${i}`,customerId:`customer-${week}-${i}`,segmentId:sizeClass,sizeClass,requiredCapabilities:['turning'],requiredCapacity:input.capacity,referencePriceCents:input.referencePriceCents,macroPeriod:'2027-01'};});
  for(const week of ['2027-01-04','2027-01-11','2027-01-18','2027-01-25']){
    const scheduled=scheduleV3MarketWeek(state,{weekStart:week,templates:templatesFor(week)});
    if(!scheduled.ok) throw new Error(scheduled.error?.message??'Fixture-Wochen konnten nicht geplant werden');
    state=scheduled.state;
  }
  return {state,dayOpen:false,fixtureLabel:mode==='no_competitor_bids'?'synthetic no-bid expiry fixture':'A02 market regression fixture'};
}

export function advanceMarketDate(run){
  if(!run||!run.state) throw new TypeError('Marktszenario fehlt');
  let state=run.state;
  let view=getV3MarketPlayerView(state);
  if(run.dayOpen){
    const closed=closeV3MarketDay(state,view.currentDate);
    if(!closed.ok) throw new Error(closed.error?.message??'Simulationstag konnte nicht geschlossen werden');
    state=closed.state; run.dayOpen=false; view=getV3MarketPlayerView(state);
  }
  const date=shiftDate(view.currentDate,1);
  const opened=advanceV3MarketDay(state,date);
  if(!opened.ok) throw new Error(opened.error?.message??'Simulationstag konnte nicht geöffnet werden');
  run.state=opened.state; run.dayOpen=true;
  const playerView=getV3MarketPlayerView(run.state);
  const report=getV3MonthlyCompetitorReport(run.state,playerView.currentDate.slice(0,7));
  return {playerView,report,receivedCount:opened.result.receivedInquiryIds.length,decisions:opened.result.decisions.length};
}

function euroToCents(raw,label){
  const value=String(raw??'').trim().replace(',','.');
  if(!/^\d+(?:\.\d{1,2})?$/.test(value)) throw new Error(`${label}: Eurobetrag mit höchstens zwei Nachkommastellen eingeben.`);
  const [whole,fraction='']=value.split('.'); const cents=BigInt(whole)*100n+BigInt((fraction+'00').slice(0,2));
  if(cents>BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`${label}: Betrag überschreitet den sicheren Zahlenbereich.`);
  return Number(cents);
}

export function submitPlayerOffer(run, formInput){
  const {inquiryId,submittedAt,netPrice,costVersion,babVersion,variableCosts,otherDirectCosts,babAllocatedCents}=formInput;
  const playerView=getV3MarketPlayerView(run.state);
  const inquiry=playerView.inquiries.find(item=>item.inquiryId===inquiryId);
  if(!inquiry||inquiry.status!=='open'||inquiry.ownOffer) throw new Error('Diese Anfrage ist nicht mehr für ein eigenes Angebot offen.');
  if(!run.dayOpen||playerView.currentDate!==submittedAt) throw new Error('Angebote sind nur am geöffneten Simulationstag möglich.');
  const netPriceCents=euroToCents(netPrice,'Nettoplanpreis');
  const variableCents=euroToCents(variableCosts,'Variable direkte Kosten');
  const otherCents=euroToCents(otherDirectCosts,'Sonstige direkte Kosten');
  const babCents=euroToCents(babAllocatedCents,'BAB-Anteil');
  if(!String(costVersion??'').trim()||!String(babVersion??'').trim()) throw new Error('Kosten- und BAB-Version müssen ausdrücklich angegeben werden.');
  const submissionEventId=`player-offer:${inquiryId}`;
  const offerId=createV3MarketOfferId(run.state,submissionEventId);
  const calculation=calculateV3OfferEstimate({netPriceCents,directCosts:[{id:'variable-direct',amountCents:variableCents,variable:true},{id:'other-direct',amountCents:otherCents,variable:false}],babAllocatedCents:babCents});
  const calculationSnapshot=createV3OfferSnapshot({offerId,submittedAt,netPriceCents,costVersion:String(costVersion).trim(),babVersion:String(babVersion).trim(),calculation});
  const submitted=submitV3MarketOffer(run.state,{eventId:submissionEventId,inquiryId,firmId:'player',submittedAt,calculationSnapshot});
  if(!submitted.ok) throw new Error(submitted.error?.message??'Angebot konnte nicht eingereicht werden');
  run.state=submitted.state;
  return {result:submitted.result,calculationSnapshot};
}

export function getMarketScreenData(run){
  const playerView=getV3MarketPlayerView(run.state);
  const rawReport=getV3MonthlyCompetitorReport(run.state,playerView.currentDate.slice(0,7));
  // Re-project only aggregate fields; individual competitor records are never read by this UI.
  const report=rawReport.map(({period,sizeClass,sampleCount,meanCompetitorNetPriceCents,suppressed})=>({period,sizeClass,sampleCount,meanCompetitorNetPriceCents,suppressed}));
  return {playerView,report};
}

/** Read-only process-learning projection from references already present in the player-safe market view. */
export function renderProcessLearning(playerView, object=processLearning){
  const inquiries=playerView?.inquiries??[];
  const inquiry=inquiries.find(row=>row.ownOffer?.calculationSnapshot)||inquiries.find(row=>row.ownOffer)||inquiries[0];
  const refs=inquiry?{
    inquiryId:inquiry.inquiryId,inquiryStatus:inquiry.status,offerDeadline:inquiry.expiresAt,
    requirements:inquiry.requiredCapabilities,offerId:inquiry.ownOffer?.offerId,
    calculationSnapshotRef:inquiry.ownOffer?.calculationSnapshot?.offerId,
    decisionId:undefined,workPlanRef:undefined,deliveryRef:undefined,
    customerAcceptanceRef:undefined,invoiceRef:undefined,customerPaymentRef:undefined,
  }:{};
  const steps=object.steps.map((step,index)=>{
    const available=step.reads.every(key=>refs[key]!==undefined&&refs[key]!==null&&refs[key]!=='');
    const badge=available?'Referenz vorhanden':'Im V3-Prototyp noch nicht verbunden';
    const body=available?`<ul>${step.successCriteria.map(item=>`<li>${esc(item)}</li>`).join('')}</ul><p class="learning-feedback">${esc(step.feedback)}</p>`:'<p class="muted">In der aktuellen Route fehlt eine passende Prozessreferenz. Es wird kein Zustand ergänzt oder nachgebildet.</p>';
    return `<li class="learning-step ${available?'available':'unavailable'}"><div class="learning-step-head"><h3>${index+1}. ${esc(step.prompt)}</h3><span class="tag ${available?'good':'pending'}">${badge}</span></div>${body}</li>`;
  }).join('');
  const branchFieldMap={inquiryStatus:'status'};
  const terminalBranches=(object.endingBranches??[]).flatMap(branch=>inquiries.filter(row=>(branch.sourceFields??[]).every(key=>Object.hasOwn(row,branchFieldMap[key]??key))&&Object.entries(branch.when??{}).every(([key,value])=>row[branchFieldMap[key]??key]===value)).map(row=>`<article class="learning-step ending-branch"><div class="learning-step-head"><h3>${esc(branch.branchId)}</h3><span class="tag neutral">Terminal · keine Folgeschritte</span></div><p>${esc(branch.terminalFeedback)}</p></article>`));
  const branchSummary=terminalBranches.length?terminalBranches.join(''):'<p class="muted">Kein Endzweig ist für den aktuellen Marktzustand exakt belegt. Ablehnung oder Fristablauf werden hier nicht angenommen.</p>';
  const context=inquiry?`<p class="learning-context">Aktuelle Anfrage: ${esc(sizeText[inquiry.sizeClass]??inquiry.sizeClass)} · ${esc(statusText[inquiry.status]??inquiry.status)}${inquiry.ownOffer?` · eigenes Angebot ${esc(inquiry.ownOffer.offerId)}`:''}</p>`:'<p class="muted">Lade zuerst ein Szenario und öffne eine Anfrage, damit vorhandene Prozessreferenzen angezeigt werden.</p>';
  return `<section class="panel learning-panel" aria-labelledby="learning-title"><div class="panel-heading"><div><p class="eyebrow">V3-06 · optionale Prozessübung</p><h2 id="learning-title">${esc(object.title)}</h2></div><span class="tag neutral">Nur lesend · keine Spielwirkung</span></div><p class="hint">Die Ansicht nutzt ausschließlich vorhandene Referenzen aus dem Marktpostfach. Sie löst keine Lernantwort, Simulation, Buchung oder Änderung aus.</p>${context}<ol class="learning-steps">${steps}</ol><section class="learning-endings" aria-labelledby="learning-endings-title"><h3 id="learning-endings-title">Abschlusszweige</h3>${branchSummary}</section></section>`;
}

export function renderMarketScreen(data){
  const {playerView,report}=data;
  const cards=playerView.inquiries.map(inquiry=>{
    const outcome=inquiry.outcome==='won'?'Zuschlag erhalten':inquiry.outcome==='not_won'?'Nicht bezuschlagt':statusText[inquiry.status]??inquiry.status;
    const statusClass=inquiry.status==='resolved'?(inquiry.outcome==='won'?'good':'neutral'):inquiry.status==='expired'?'warn':'neutral';
    const capabilities=inquiry.requiredCapabilities.map(skill=>`<span>${esc(skill)}</span>`).join('')||'<span>Keine Zusatzfähigkeit</span>';
    let offer='';
    if(inquiry.ownOffer){
      const own=inquiry.ownOffer;
      let accepted='';
      if(own.status==='accepted'){
        const frozen=acceptV3OfferSnapshot(own.calculationSnapshot,playerView.currentDate);
        accepted=`<div class="result-values"><div><strong>Fixierter Vertragspreis</strong>${euro(frozen.contractPriceCents)} netto</div><div><strong>Angenommen am</strong>${esc(frozen.acceptedAt)}</div></div>`;
      }
      offer=`<div class="own-offer"><div class="offer-head"><strong>Eigenes Angebot · ${esc(own.offerId)}</strong><span class="badge ${own.status==='accepted'?'good':own.status==='declined'?'neutral':own.status==='expired'?'warn':'neutral'}">${esc(statusText[own.status]??own.status)}</span></div><p>Netto ${euro(own.netPriceCents)} · eingereicht ${esc(own.submittedAt)} · Kundenentscheidung vorgesehen ${esc(own.decisionAt)}</p>${accepted}</div>`;
    }else if(inquiry.status==='open'){
      offer=`<form class="offer-form" data-offer-form data-inquiry="${esc(inquiry.inquiryId)}"><h4>Eigenes Angebot kalkulieren</h4><div class="form-grid"><label>Nettoplanpreis R (€)<input name="netPrice" required inputmode="decimal" autocomplete="off" placeholder="Eingabe"></label><label>Variable direkte Kosten (€)<input name="variableCosts" required inputmode="decimal" autocomplete="off" placeholder="Eingabe"></label><label>Sonstige direkte Kosten (€)<input name="otherDirectCosts" required inputmode="decimal" autocomplete="off" placeholder="Eingabe"></label><label>BAB-Anteil (€)<input name="babAllocatedCents" required inputmode="decimal" autocomplete="off" placeholder="Eingabe"></label><label>Kostenversion<input name="costVersion" required autocomplete="off" placeholder="Versions-ID"></label><label>BAB-Version<input name="babVersion" required autocomplete="off" placeholder="Versions-ID"></label><div class="cost-note">Die Kalkulation nutzt A03s D-0162-Rechenfunktion. R ist netto und ohne SimTAX. Variable Kosten bestimmen DB I; alle direkten Kosten und BAB bleiben separat sichtbar. Es erfolgt keine Buchung.</div></div><button class="primary" type="submit">Angebot mit Snapshot einreichen</button></form>`;
    }else if(inquiry.status==='expired') offer='<p class="muted">Frist abgelaufen, bevor ein eigenes Angebot eingereicht wurde.</p>';
    else if(inquiry.status==='resolved'&&!inquiry.ownOffer) offer='<p class="muted">Die Kundenentscheidung ist gefallen. Es wurde kein eigenes Angebot eingereicht.</p>';
    return `<article class="request" data-inquiry-id="${esc(inquiry.inquiryId)}"><div class="request-head"><div><p class="eyebrow">Kundenanfrage · ${esc(inquiry.receivedAt)}</p><h3>${esc(inquiry.customerId)}</h3></div><span class="badge ${statusClass}">${esc(outcome)}</span></div><div class="request-meta"><span>Größe: ${esc(sizeText[inquiry.sizeClass]??inquiry.sizeClass)}</span><span>Segment: ${esc(inquiry.segmentId)}</span><span>Frist: ${esc(inquiry.expiresAt)}</span><span>Kapazitätsbedarf: ${fmtCapacity(inquiry.requiredCapacity)}</span></div><div class="cap-list">${capabilities}</div><p class="fit-note"><span class="badge good">Skill- und Kapazitätsgate erfüllt</span> Einladung erhalten: Die Szenario-Fitprüfung hat alle angegebenen Fähigkeiten und Mindestkapazität bei der Einladung erfüllt. Nicht passende Anfragen werden nicht in dieses Postfach projiziert.</p>${offer}</article>`;
  }).join('');
  const reportRows=report.map(row=>`<article class="report-row"><strong>${esc(sizeText[row.sizeClass]??row.sizeClass)} · Monatsmittel netto</strong><output>${row.suppressed||row.meanCompetitorNetPriceCents==null?'Unter Mindeststichprobe verborgen':euro(row.meanCompetitorNetPriceCents)}</output><small>Aggregierte Stichprobe n = ${Number(row.sampleCount)}</small></article>`).join('');
  return {inboxHtml:cards||'<p class="muted">Für diesen Tag liegen noch keine an das Unternehmen gerichteten Anfragen vor.</p>',inboxCount:playerView.inquiries.length,reportHtml:reportRows||'<p class="muted">Für diesen Monat liegt noch keine veröffentlichbare Stichprobe vor.</p>',learningHtml:renderProcessLearning(playerView),reportPeriod:playerView.currentDate.slice(0,7),currentDate:playerView.currentDate};
}
function fmtCapacity(value){return Number.isFinite(value)?String(value):'—';}

if(typeof document!=='undefined'){
  const $=id=>document.getElementById(id); let run=null;
  const render=()=>{if(!run)return;const data=getMarketScreenData(run),view=renderMarketScreen(data);$('inbox').innerHTML=view.inboxHtml;$('inbox').classList.toggle('empty',!data.playerView.inquiries.length);$('inbox-count').textContent=String(view.inboxCount);$('report-period').textContent=`Berichtsmonat ${view.reportPeriod}`;$('competitor-report').innerHTML=view.reportHtml;$('learning-practice').innerHTML=view.learningHtml;$('date-label').textContent=`Simulationstag ${view.currentDate}${run.dayOpen?' · Aktionen offen':' · geschlossen'}`;$('next-day').disabled=false;};
  const loadRun=mode=>{try{run=createDocumentedMarketFixture(mode);advanceMarketDate(run);render();$('run-status').textContent=mode==='no_competitor_bids'?'Ablauf-Fixture · synthetisch':'Wettbewerbs-Fixture · synthetisch';$('run-status').className='tag good';$('live-status').textContent=mode==='no_competitor_bids'?'Ablauf-Test: synthetische Anfrage ohne Wettbewerbergebot; sie läuft bei Nichtbeantwortung ab.':'Synthetisches Szenario geladen. Nur eigene Angebote und anonyme Monatsaggregate werden angezeigt.';}catch(error){run=null;$('live-status').textContent=error.message;$('run-status').textContent='Laden fehlgeschlagen';$('run-status').className='tag pending';}};
  $('load-fixture').addEventListener('click',()=>loadRun('competition'));
  $('load-expiry-fixture').addEventListener('click',()=>loadRun('no_competitor_bids'));
  $('next-day').addEventListener('click',()=>{if(!run)return;try{const result=advanceMarketDate(run);render();$('live-status').textContent=`${result.playerView.currentDate}: ${result.receivedCount} neue Anfrage(n), ${result.decisions} Kundenentscheidung(en) verarbeitet.`;}catch(error){$('live-status').textContent=error.message;}});
  $('inbox').addEventListener('submit',event=>{const form=event.target.closest('[data-offer-form]');if(!form)return;event.preventDefault();try{const values=new FormData(form);submitPlayerOffer(run,{inquiryId:form.dataset.inquiry,submittedAt:getV3MarketPlayerView(run.state).currentDate,netPrice:values.get('netPrice'),variableCosts:values.get('variableCosts'),otherDirectCosts:values.get('otherDirectCosts'),babAllocatedCents:values.get('babAllocatedCents'),costVersion:values.get('costVersion'),babVersion:values.get('babVersion')});render();$('live-status').textContent='Angebot eingereicht. Netto-Preis und D-0162-Kalkulationssnapshot sind fixiert; die Kundenentscheidung folgt verzögert.';}catch(error){$('live-status').textContent=error.message;}});
}
