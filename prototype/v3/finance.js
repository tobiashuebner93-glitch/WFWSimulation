import {
  V3_FINANCIAL_CALCULATION_VERSION,
  calculateV3OfferEstimate,
  calculateV3BabRate,
  allocateV3BabPool,
  aggregateV3KpiPeriods,
  createV3OfferSnapshot,
  acceptV3OfferSnapshot,
} from '../v3-financial-calculation.js';

const $ = selector => document.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let costRowCount=0, poolCount=0, flowCount=0, stockCount=0;
let estimate=null, estimateLabels=[], snapshots=[], acceptedSnapshots=[], poolResults=new Map();
function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function status(message,kind=''){const el=$('#finance-status');el.textContent=message;el.className=`live-status ${kind}`;}
function euroToCents(raw,{allowNegative=false}={}){
  const value=String(raw??'').trim().replace(',', '.');
  const pattern=allowNegative?/^-?\d+(?:\.\d{1,2})?$/:/^\d+(?:\.\d{1,2})?$/;
  if(!pattern.test(value))throw new Error('Betrag als Euro mit höchstens zwei Nachkommastellen eingeben.');
  const negative=value.startsWith('-');const unsigned=negative?value.slice(1):value;const [whole,fraction='']=unsigned.split('.');
  const cents=BigInt(whole)*100n+BigInt((fraction+'00').slice(0,2));
  const signed=negative?-cents:cents;
  if(signed>BigInt(Number.MAX_SAFE_INTEGER)||signed<BigInt(-Number.MAX_SAFE_INTEGER))throw new Error('Betrag überschreitet den sicheren Zahlenbereich.');
  return Number(signed);
}
function formatCents(cents){const amount=BigInt(cents);const sign=amount<0n?'-':'';const absolute=amount<0n?-amount:amount;const euros=new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}).format(Number(absolute/100n));return sign+euros+','+String(absolute%100n).padStart(2,'0')+' €';}
function signedCents(cents){return cents>0?`+${formatCents(cents)}`:formatCents(cents);}
function setHidden(element,hidden){element.hidden=hidden;}
function invalidateEstimate(){
  if(!estimate)return;
  estimate=null;estimateLabels=[];
  $('#calc-status').textContent='Veraltet · neu berechnen';$('#calc-status').className='tag bad';
  $('#estimate-output').innerHTML='<p class="validation-message">Eingaben geändert. Vor Snapshot oder Angebotsversion erst erfolgreich neu berechnen.</p>';
  setHidden($('#estimate-output'),false);setSnapshotControls();
}
function costRowHtml(){
  const index=costRowCount++;
  return `<div class="input-row cost-row" data-row="${index}">
    <label>Stabile Positions-ID<input data-field="id" required autocomplete="off" placeholder="eigene ID"></label>
    <label>Kostenart<input data-field="category" required autocomplete="off" placeholder="z. B. Material, Arbeit"></label>
    <label>Direkter Betrag<input data-field="amount" inputmode="decimal" required placeholder="€"></label>
    <label>Variabel?<select data-field="variable" required><option value="">Explizit wählen</option><option value="true">Ja, variabel</option><option value="false">Nein, nicht variabel</option></select></label>
    <button class="remove-button" type="button" data-remove-cost="${index}" aria-label="Kostenposition entfernen">Entfernen</button>
  </div>`;
}
function readDirectCosts(){
  const rows=$$('.cost-row');if(!rows.length)throw new Error('Mindestens eine direkte Kostenposition erfassen; fehlende Kosten werden nicht still als null klassifiziert.');
  return rows.map(row=>{
    const value=name=>row.querySelector(`[data-field="${name}"]`).value.trim();
    const id=value('id'),category=value('category'),variable=value('variable');
    if(!id||!category||!value('amount')||!['true','false'].includes(variable))throw new Error('Jede Kostenposition braucht ID, Kostenart, Betrag und eine ausdrückliche Variabel-Klassifikation.');
    return {id,category,amountCents:euroToCents(value('amount')),variable:variable==='true'};
  });
}
function renderEstimate(result,directCosts){
  estimate=result;estimateLabels=directCosts.map(({id,category})=>({id,category}));
  const out=$('#estimate-output');setHidden(out,false);
  const dbClass=result.dbICents>0?'positive':result.dbICents<0?'negative':'neutral';
  const dbLabel=result.dbICentNear?'DB I · centnah':'DB I';
  const rows=[
    ['Nettoplanpreis R',result.netPriceCents,''],
    ['Variable direkte Einzelkosten',result.variableDirectCostsCents,''],
    [dbLabel,result.dbICents,dbClass],
    ['Direkte Arbeit / Maschinen / weitere Kosten',result.allDirectCostsCents,''],
    ['Ergebnis nach direkten Einzelkosten',result.resultAfterDirectCostsCents,result.resultAfterDirectCostsCents<0?'negative':''],
    ['Manuell bestätigter BAB-Anteil',result.babAllocatedCents,''],
    ['Ergebnis nach BAB',result.resultAfterBabCents,result.resultAfterBabCents<0?'negative':'']
  ];
  out.innerHTML=rows.map(([label,value,kind])=>`<div class="result-card ${kind}"><strong>${esc(label)}</strong><output>${esc(signedCents(value))}</output></div>`).join('')+
    `<div class="result-card full"><strong>Direkte Einzelkosten · jede Position einmal ausgewiesen</strong><div class="cost-lines">${directCosts.map(line=>`<div class="cost-line"><span>${esc(line.category)} · ${esc(line.id)} · ${line.variable?'variabel':'nicht variabel'}</span><span>${esc(formatCents(line.amountCents))}</span></div>`).join('')}</div></div>`;
  $('#calc-status').textContent='Berechnet · nur Plan';$('#calc-status').className='tag good';
  setSnapshotControls();
}
function isSnapshotAccepted(offerId){return acceptedSnapshots.some(item=>item.offerId===offerId);}
function setSnapshotControls(){
  // Acceptance freezes its stored snapshot; a new draft can still be calculated.
  $('#snapshot-form').hidden=!estimate;
  $('#accept-form').hidden=!snapshots.some(snapshot=>!isSnapshotAccepted(snapshot.offerId));
  $('#offer-status').textContent=acceptedSnapshots.length?acceptedSnapshots.length+' Snapshot(s) angenommen · gesperrt':snapshots.length?snapshots.length+' Snapshot(s) gespeichert':estimate?'Entwurf berechnet':'Kein Snapshot';
  $('#offer-status').className='tag '+(acceptedSnapshots.length?'good':snapshots.length?'pending':'');
  renderAcceptedSnapshots();
}
function renderAcceptedSnapshots(){
  const output=$('#accepted-output');
  output.hidden=!acceptedSnapshots.length;
  output.innerHTML=acceptedSnapshots.map(accepted=>'<article class="accepted-box"><strong>Vertragspreis / Snapshot unveränderlich</strong><p>Angebot <code>'+esc(accepted.offerId)+'</code> · akzeptiert am '+esc(accepted.acceptedAt)+'</p><p>Vertragspreis: '+esc(formatCents(accepted.contractPriceCents))+' netto</p><p>Kostenstand: '+esc(accepted.snapshot.costVersion)+' · BAB-Stand: '+esc(accepted.snapshot.babVersion)+'</p><p>Keine Buchung, kein Cash-, Steuer-, OP- oder Ledger-Effekt.</p></article>').join('');
}
$('#add-cost').addEventListener('click',()=>{invalidateEstimate();$('#cost-rows').insertAdjacentHTML('beforeend',costRowHtml());});
$('#cost-rows').addEventListener('click',event=>{const button=event.target.closest('[data-remove-cost]');if(!button)return;invalidateEstimate();button.closest('.cost-row').remove();});
$('#calculation-form').addEventListener('input',invalidateEstimate);
$('#calculation-form').addEventListener('change',invalidateEstimate);
$('#bab-pools').addEventListener('input',invalidateEstimate);
$('#bab-pools').addEventListener('change',event=>{invalidateEstimate();if(event.target.matches('[data-field="allocationMode"],[data-field="rateEnabled"]'))updatePoolMode(event.target.closest('[data-pool]'));});
$('#calculation-form').addEventListener('submit',event=>{
  event.preventDefault();try{
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());const directCosts=readDirectCosts();
    const result=calculateV3OfferEstimate({netPriceCents:euroToCents(data.netPrice),directCosts:directCosts.map(({id,amountCents,variable})=>({id,amountCents,variable})),babAllocatedCents:euroToCents(data.babAllocated)});
    renderEstimate(result,directCosts);status('Kalkulation erfolgreich berechnet. Alle Ergebnisse bleiben Planwerte ohne Finanzbuchung.');
  }catch(error){estimate=null;estimateLabels=[];$('#calc-status').textContent='Nicht berechenbar · neu eingeben';$('#calc-status').className='tag bad';$('#estimate-output').innerHTML=`<p class="validation-message">${esc(error.message)} Keine alte Kalkulation kann jetzt gespeichert werden.</p>`;setHidden($('#estimate-output'),false);setSnapshotControls();status(error.message,'error');}
});
function recipientHtml(){return `<div class="recipient-row" data-recipient><label>Stabile Empfänger-ID<input data-recipient-field="id" required placeholder="Kostenstellen-ID"></label><label><span data-key-label>Schlüsselwert</span><input data-recipient-field="key" inputmode="decimal" required placeholder="Menge oder Anteil"></label><button type="button" class="remove-button" data-remove-recipient aria-label="Empfänger entfernen">Entfernen</button></div>`;}
function poolHtml(index){return `<article class="pool-card" data-pool="${index}">
  <div class="pool-header"><div><p class="eyebrow">BAB-Quellkostenstelle</p><h3>Pool ${index+1}</h3></div><button type="button" class="remove-button" data-remove-pool>Pool entfernen</button></div>
  <div class="pool-grid">
    <label>Stabile Pool-ID<input data-field="poolId" required placeholder="eigene ID"></label>
    <label>Gemeinsame Periode<input data-field="period" type="month" required></label>
    <label>Primärkosten des Pools<input data-field="amount" inputmode="decimal" required placeholder="€"></label>
    <label>Verteilungsmodus<select data-field="allocationMode" required><option value="">Auswählen</option><option value="keys">Physische Treibermengen</option><option value="weights">Dimensionslose Anteile</option></select></label>
    <label data-unit-field>Gemeinsame Treibereinheit<input data-field="unitLabel" required autocomplete="off" placeholder="z. B. h, kg"></label>
  </div>
  <p class="pool-mode-note" data-mode-note role="note">Alle Empfänger eines Pools verwenden dieselbe Periode und – bei physischen Treibermengen – dieselbe Einheit.</p>
  <label class="rate-toggle" data-rate-toggle hidden><input data-field="rateEnabled" type="checkbox"> Zusätzlich separaten Mengensatz ausweisen</label>
  <label class="rate-basis-field" data-rate-basis hidden>Separate Satzbasis · physische Gesamt-Treibermenge<input data-field="basisValue" inputmode="decimal" placeholder="Menge, z. B. Stunden"></label>
  <div class="panel-heading"><div><h3>Empfänger und Verteilung</h3><p class="muted">Treibermengen und Anteile haben unterschiedliche Nenner; angezeigt wird ausschließlich die dazu passende Satzbasis.</p></div><button type="button" class="secondary" data-add-recipient>Empfänger hinzufügen</button></div>
  <div class="pool-recipients"></div>
  <button type="button" class="primary" data-calculate-pool>Pool verteilen und abstimmen</button>
  <div class="pool-result" aria-live="polite"></div>
</article>`;}
function updatePoolMode(pool){
  if(!pool)return;
  const mode=pool.querySelector('[data-field="allocationMode"]').value;
  const rateToggle=pool.querySelector('[data-rate-toggle]');
  const rateCheckbox=pool.querySelector('[data-field="rateEnabled"]');
  const unitLabel=pool.querySelector('[data-unit-field]');
  const basisLabel=pool.querySelector('[data-rate-basis]');
  if(mode==='keys'){
    rateToggle.hidden=true;rateCheckbox.checked=false;unitLabel.hidden=false;unitLabel.querySelector('input').required=true;basisLabel.hidden=true;basisLabel.querySelector('input').required=false;
    pool.querySelector('[data-mode-note]').textContent='Jeder Schlüssel ist eine physische Menge. Satznenner und Einheit entstehen ausschließlich aus der Summe dieser Schlüssel. Periode und Einheit gelten gemeinsam für alle Empfänger.';
  }else if(mode==='weights'){
    rateToggle.hidden=false;unitLabel.hidden=!rateCheckbox.checked;unitLabel.querySelector('input').required=rateCheckbox.checked;basisLabel.hidden=!rateCheckbox.checked;basisLabel.querySelector('input').required=rateCheckbox.checked;
    pool.querySelector('[data-mode-note]').textContent='Anteile sind dimensionslos und verteilen nur den Pool. Sie bilden keinen Mengensatz. Ein Satz ist optional und braucht eine getrennte physische Gesamt-Treibermenge; beide nutzen die oben ausgewählte Poolperiode und die explizite Einheit.';
  }else{
    rateToggle.hidden=true;unitLabel.hidden=false;unitLabel.querySelector('input').required=false;basisLabel.hidden=true;basisLabel.querySelector('input').required=false;
    pool.querySelector('[data-mode-note]').textContent='Zuerst den Verteilungsmodus wählen. Periode und Einheit gelten für den gesamten Pool.';
  }
  pool.querySelectorAll('[data-key-label]').forEach(label=>label.textContent=mode==='keys'?'Physische Treibermenge':'Verteilungsanteil');
}
$('#add-pool').addEventListener('click',()=>{invalidateEstimate();const index=poolCount++;$('#bab-pools').insertAdjacentHTML('beforeend',poolHtml(index));});
$('#bab-pools').addEventListener('click',event=>{
  const pool=event.target.closest('[data-pool]');if(!pool)return;
  if(event.target.closest('[data-remove-pool]')){invalidateEstimate();poolResults.delete(pool.dataset.pool);pool.remove();return;}
  if(event.target.closest('[data-add-recipient]')){invalidateEstimate();pool.querySelector('.pool-recipients').insertAdjacentHTML('beforeend',recipientHtml());updatePoolMode(pool);return;}
  if(event.target.closest('[data-remove-recipient]')){invalidateEstimate();event.target.closest('[data-recipient]').remove();return;}
  if(event.target.closest('[data-calculate-pool]'))calculatePool(pool);
});
function calculatePool(pool){
  try{
    const get=key=>pool.querySelector(`[data-field="${key}"]`).value.trim();
    const mode=get('allocationMode'),poolId=get('poolId'),period=get('period'),unitLabel=get('unitLabel');
    const poolCents=euroToCents(get('amount'));
    const recipients=$$('[data-recipient]',pool).map(row=>({costCenterId:row.querySelector('[data-recipient-field="id"]').value.trim(),keyValue:row.querySelector('[data-recipient-field="key"]').value.trim()}));
    if(!poolId||!period||!['keys','weights'].includes(mode)||!recipients.length||recipients.some(row=>!row.costCenterId||!row.keyValue))throw new Error('Pool-ID, gemeinsame Periode, Kosten und mindestens ein vollständiger Empfänger mit Schlüssel sind erforderlich.');
    if(mode==='keys'&&!unitLabel)throw new Error('Physische Treibermengen brauchen eine gemeinsame Einheit für alle Schlüssel.');
    const allocation=allocateV3BabPool({poolCents,recipients,unitLabel:mode==='keys'?unitLabel:'',allocationMode:mode});
    let rate=null,rateBasisLabel='';
    if(mode==='keys'){
      rate=allocation.rate;
      if(!rate)throw new Error('A03 hat für physische Schlüssel keinen Verrechnungssatz geliefert.');
      rateBasisLabel=`Satzbasis: Summe der physischen Treibermengen · ${period} · ${unitLabel}`;
    }else if(pool.querySelector('[data-field="rateEnabled"]').checked){
      const basisValue=get('basisValue');
      if(!basisValue||!unitLabel)throw new Error('Ein separater Mengensatz braucht eine positive physische Gesamt-Treibermenge und eine gemeinsame Einheit.');
      rate=calculateV3BabRate({poolCents,basisKind:'driver',basisValue,unitLabel});
      rateBasisLabel=`Separate Satzbasis: physische Gesamt-Treibermenge ${basisValue} ${unitLabel} · ${period}`;
    }
    poolResults.set(pool.dataset.pool,{poolId,period,allocation,rate});
    const amountLabel=mode==='keys'?'Treibermenge':'Anteil';
    const rateOutput=rate?`<div class="result-card"><strong>${esc(rateBasisLabel)}</strong><output>${esc(rate.displayValue)} (gerundet)</output><p class="inline-note">Exakte interne Quotientenbasis: <span class="rate-exact">${esc(rate.numeratorCents)} / ${esc(rate.denominator)}${rate.basisScale!=='1'?` · Skalierung 10^${esc(rate.basisScale.length-1)}`:''}</span>. Der gerundete Anzeigesatz wird nicht weitergerechnet.</p></div>`:`<div class="result-card"><strong>Verrechnungssatz</strong><p class="inline-note">Kein Mengensatz ausgewiesen: Gewichte besitzen keine physische Einheit. Eine Rate erfordert eine separat eingegebene physische Satzbasis.</p></div>`;
    const result=pool.querySelector('.pool-result');
    result.innerHTML=`<div class="pool-result-grid"><div class="result-card"><strong>Verteilung nach ${mode==='keys'?'physischen Treibermengen':'dimensionslosen Anteilen'} · ${esc(period)}</strong><div class="cost-lines">${allocation.allocations.map(row=>`<div class="cost-line"><span>${esc(row.costCenterId)} · ${amountLabel} ${esc(row.keyValue)}${mode==='keys'?` ${esc(unitLabel)}`:''}</span><span>${esc(formatCents(row.amountCents))}</span></div>`).join('')}</div></div>${rateOutput}<div class="result-card"><strong>Reconciliation · Quellpool ${esc(poolId)}</strong><output>${allocation.reconciled?'Abgestimmt':'Nicht abgestimmt'} · Differenz ${esc(formatCents(allocation.reconciliationDifferenceCents))}</output><p class="inline-note">Quellpool ${esc(formatCents(allocation.poolCents))}; Summe der ausgegebenen Centbeträge gegen denselben Quellpool.</p></div></div>`;
    status(`BAB-Pool ${poolId} für ${period} berechnet; Reconciliation ${allocation.reconciled?'0,00 €':'offen'}.`);
  }catch(error){pool.querySelector('.pool-result').innerHTML=`<p class="validation-message">${esc(error.message)}</p>`;status(error.message,'error');}
}
function renderFlowRow(){const id=flowCount++;return `<div class="input-row flow-row" data-flow="${id}"><label>Sicht<select data-field="view" required><option value="">Auswählen</option><option value="Plan">Plan</option><option value="Ist">Ist</option></select></label><label>Kennzahl-ID<input data-field="metric" required placeholder="eigene ID"></label><label>Ereignisdatum<input data-field="date" type="date" required></label><label>Betrag<input data-field="amount" inputmode="decimal" required placeholder="€; negatives Ergebnis möglich"></label><button type="button" class="remove-button" data-remove-flow>Entfernen</button></div>`;}
function renderStockRow(){const id=stockCount++;return `<div class="input-row stock-row" data-stock="${id}"><label>Bestands-ID<input data-field="metric" required placeholder="z. B. Bestand-ID"></label><label>Stichtag<input data-field="date" type="date" required></label><label>Bestandswert<input data-field="amount" inputmode="decimal" required placeholder="€; synthetische Eingabe"></label><span class="inline-note">Stichtagswert</span><button type="button" class="remove-button" data-remove-stock>Entfernen</button></div>`;}
$('#add-flow').addEventListener('click',()=>$('#flow-rows').insertAdjacentHTML('beforeend',renderFlowRow()));
$('#add-stock').addEventListener('click',()=>$('#stock-rows').insertAdjacentHTML('beforeend',renderStockRow()));
$('#flow-rows').addEventListener('click',event=>{if(event.target.closest('[data-remove-flow]'))event.target.closest('[data-flow]').remove();});
$('#stock-rows').addEventListener('click',event=>{if(event.target.closest('[data-remove-stock]'))event.target.closest('[data-stock]').remove();});
$('#aggregate-periods').addEventListener('click',()=>{
  try{
    const flows=$$('[data-flow]').map(row=>{const get=field=>row.querySelector(`[data-field="${field}"]`).value.trim();const view=get('view'),metric=get('metric');if(!view||!metric||!get('date')||!get('amount'))throw new Error('Jeder Plan-/Ist-Fluss braucht Sicht, Kennzahl-ID, Datum und Betrag.');return {metricId:`${view}:${metric}`,date:get('date'),amountCents:euroToCents(get('amount'),{allowNegative:true})};});
    const stockSnapshots=$$('[data-stock]').map(row=>{const get=field=>row.querySelector(`[data-field="${field}"]`).value.trim();if(!get('metric')||!get('date')||!get('amount'))throw new Error('Jeder Stichtag braucht Bestands-ID, Datum und Betrag.');return {metricId:get('metric'),date:get('date'),amountCents:euroToCents(get('amount'),{allowNegative:true})};});
    const result=aggregateV3KpiPeriods({flows,stockSnapshots});
    const monthly=Object.entries(result.monthlyFlows).flatMap(([metric,months])=>Object.entries(months).map(([period,amount])=>({metric,period,amount})));
    const yearly=Object.entries(result.yearlyFlows).flatMap(([year,metrics])=>Object.entries(metrics).map(([metric,amount])=>({metric,period:year,amount})));
    $('#period-output').innerHTML=`<div class="period-card"><h3>Monatsflüsse · Plan/Ist getrennt</h3>${periodTable(monthly)}</div><div class="period-card"><h3>Jahresflüsse</h3>${periodTable(yearly)}</div><div class="period-card"><h3>Stichtagsbestände · nicht summiert</h3>${result.stockSnapshots.length?`<table class="period-table"><thead><tr><th>Bestand</th><th>Stichtag</th><th>Wert</th></tr></thead><tbody>${result.stockSnapshots.map(row=>`<tr><td>${esc(row.metricId)}</td><td>${esc(row.date)}</td><td>${esc(formatCents(row.amountCents))}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">Keine Bestandswerte erfasst.</p>'}</div>`;
    status('Plan-/Ist-Flüsse und Stichtagswerte über A03 periodisiert. Keine Spielbuchung erfolgt.');
  }catch(error){$('#period-output').innerHTML=`<p class="validation-message">${esc(error.message)}</p>`;status(error.message,'error');}
});
function periodTable(rows){if(!rows.length)return '<p class="muted">Keine Flusswerte erfasst.</p>';return `<table class="period-table"><thead><tr><th>Kennzahl</th><th>Kalenderperiode</th><th>Wert</th></tr></thead><tbody>${rows.sort((a,b)=>a.period.localeCompare(b.period)||a.metric.localeCompare(b.metric)).map(row=>`<tr><td>${esc(row.metric)}</td><td>${esc(row.period)}</td><td>${esc(formatCents(row.amount))}</td></tr>`).join('')}</tbody></table>`;}
$('#snapshot-form').addEventListener('submit',event=>{
  event.preventDefault();try{
    if(!estimate)throw new Error('Vor dem Snapshot zuerst einen Kalkulationsentwurf berechnen.');
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());if(snapshots.some(item=>item.offerId===data.offerId.trim()))throw new Error('Diese Angebots-ID hat bereits einen Snapshot. Für eine weitere Version eine neue eigene Angebots-ID verwenden.');
    const snapshot=createV3OfferSnapshot({offerId:data.offerId.trim(),submittedAt:data.submittedAt,netPriceCents:estimate.netPriceCents,costVersion:data.costVersion.trim(),babVersion:data.babVersion.trim(),calculation:{...estimate,directCostLabels:estimateLabels}});
    snapshots.push(snapshot);renderSnapshots();setSnapshotControls();status(`Snapshot ${snapshot.offerId} gesichert. Keine Annahme oder Buchung wurde ausgelöst.`);
  }catch(error){status(error.message,'error');$('#snapshot-list').insertAdjacentHTML('afterbegin',`<p class="validation-message">${esc(error.message)}</p>`);}
});
function renderSnapshots(){
  $('#snapshot-list').innerHTML=snapshots.map(snapshot=>'<article class="snapshot-card"><div class="snapshot-header"><div><strong>Snapshot '+esc(snapshot.offerId)+'</strong><p class="muted">Eingereicht '+esc(snapshot.submittedAt)+' · Kosten '+esc(snapshot.costVersion)+' · BAB '+esc(snapshot.babVersion)+'</p></div><span class="tag">'+(isSnapshotAccepted(snapshot.offerId)?'Angenommen · gesperrt':'Eingereicht')+'</span></div><p>Festgehaltener Nettoplanpreis: <strong>'+esc(formatCents(snapshot.netPriceCents))+'</strong></p><details><summary>Gespeicherte Kalkulation anzeigen</summary><pre>'+esc(JSON.stringify(snapshot.calculation,null,2))+'</pre></details></article>').join('');
  const select=$('#accept-form select');
  select.innerHTML='<option value="">Snapshot wählen</option>'+snapshots.filter(snapshot=>!isSnapshotAccepted(snapshot.offerId)).map(snapshot=>'<option value="'+esc(snapshot.offerId)+'">'+esc(snapshot.offerId)+' · '+esc(snapshot.submittedAt)+' · '+esc(formatCents(snapshot.netPriceCents))+'</option>').join('');
}
$('#accept-form').addEventListener('submit',event=>{
  event.preventDefault();try{
    const data=Object.fromEntries(new FormData(event.currentTarget).entries());
    const snapshot=snapshots.find(item=>item.offerId===data.snapshotId);
    if(!snapshot||isSnapshotAccepted(snapshot.offerId))throw new Error('Nicht angenommenen Snapshot auswählen.');
    acceptedSnapshots.push(acceptV3OfferSnapshot(snapshot,data.acceptedAt));
    renderSnapshots();setSnapshotControls();
    status('Snapshot '+snapshot.offerId+' angenommen und unveränderlich gesperrt. Neue Entwürfe bleiben möglich; keine Buchung wurde ausgelöst.');
  }catch(error){status(error.message,'error');}
});

function initialize(){
  if(V3_FINANCIAL_CALCULATION_VERSION!=='V3-FINANCIAL-CALCULATION-1'){status('Unbekannte A03-Bibliotheksversion.','error');return;}
  setSnapshotControls();
}
initialize();
