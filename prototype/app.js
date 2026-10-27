import { createInitialGame, advanceOneDay, isWorkday, acceptOrder, rejectOrder, cancelRejectedOrder, closePaidOrder, getCurrentOperation, formatDate, getWeekLabel, assignEmployee, bookTemporaryWorker, scheduleVacationWeek, getSpaceUse, isHoliday, CONTINUING_COURSES, startContinuingEducation, startApprenticeship, acceptMarketOffer, declineMarketOffer, setOrderPriority, startRework, INITIAL_INVENTORY, INITIAL_INVENTORY_VALUE, MATERIAL_PRICE_BASELINE } from './engine.js';
import { createInitialFinance, migrateFinanceState, issueInvoice, getOpenReceivables, closeMonthlyPeriod, money, processFinancialDay, refreshOverdraftLimit, recordMaterialUse, recordMaterialPurchase, drawForUnpaidCost, drawForMachineLoan, recordTrainingCost, reorderPaymentPriority } from './finance.js';
import { ECONOMIC_SCENARIOS, estimateOrderEconomics } from './economics.js';

const KEY = 'werkstatt-v2-save';
const BACKUP_KEY = `${KEY}-backup`;
const CORRUPT_KEY = `${KEY}-damaged-copy`;
const app = document.querySelector('#app');
const today = document.querySelector('#today');
const weekday = document.querySelector('#weekday');
const toastNode = document.querySelector('#toast');
let toastTimer;
let recoveryMode = null;
let state = load();

function seedInitialQuotes(s){s.agreements||={};for(const order of s.game.orders||[]){if(!order.generated&&!s.agreements[order.id])s.agreements[order.id]={net:estimateOrderEconomics(order,s.game).suggestedNet,terms:14,source:'V1-Kalkulation'};}return s;}
function freshState(){return seedInitialQuotes({version:6,game:createInitialGame(),finance:createInitialFinance(),agreements:{},view:'dashboard',filter:'all'});}
function parseSaved(raw){const saved=JSON.parse(raw);if(![2,3,4,5,6].includes(saved?.version)||!saved.game||!saved.finance)throw new Error('Ungültiger oder nicht unterstützter Spielstand');if(saved.version<4&&saved.game.date==='2027-01-01'&&saved.game.dayNumber===0)return freshState();if(saved.version===2){const fresh=createInitialGame();Object.assign(fresh,saved.game);fresh.network||=createInitialGame().network;fresh.pendingMaterialOrders||=[];fresh.apprentice||=null;fresh.annualStats.marketOpportunities||=0;fresh.annualStats.ordersWon||=0;fresh.annualStats.ordersLost||=0;for(const e of fresh.employees){e.productivityBonus||=0;e.training||=null;}for(const o of fresh.orders){const customer=fresh.network.customers.find(x=>x.id===o.customer);o.customerName||=customer?.name||o.customer;o.paymentMoral??=customer?.paymentMoral||100;o.paymentDelayDays??=customer?.lateDays||0;}fresh.version=5;saved.game=fresh;}saved.version=6;saved.game.version=5;saved.game.macro||={};saved.game.macro.priceIndices||={steel:saved.game.macro.priceIndex||1,aluminium:saved.game.macro.priceIndex||1,parts:saved.game.macro.priceIndex||1,energy:1};saved.game.macro.economicScenario||='base';migrateFinanceState(saved.finance);for(const item of saved.finance.unpaidItems||[])if(item.expenseRef){const e=saved.finance.expenses.find(x=>x.date===item.date&&x.type===item.type&&x.label===item.label&&x.amount===item.amount);item.expenseId=e?.id;delete item.expenseRef;}return seedInitialQuotes(saved);}
function load(){const raw=localStorage.getItem(KEY);if(raw===null)return freshState();try{return parseSaved(raw);}catch{try{if(localStorage.getItem(CORRUPT_KEY)===null)localStorage.setItem(CORRUPT_KEY,raw);}catch{}try{const backupRaw=localStorage.getItem(BACKUP_KEY);if(backupRaw){const backup=parseSaved(backupRaw);recoveryMode='backup';return backup;}}catch{}recoveryMode='new';return freshState();}}
function save(){if(recoveryMode)return;try{const current=localStorage.getItem(KEY);if(current!==null){try{parseSaved(current);localStorage.setItem(BACKUP_KEY,current);}catch{/* Keep the existing valid backup when the primary save is damaged. */}}state.version=6;localStorage.setItem(KEY,JSON.stringify(state));}catch{showToast('Der Browser kann den Spielstand nicht speichern.');}}
function showToast(message) {
  toastNode.textContent = message;
  toastNode.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastNode.classList.remove('show'), 2400);
}
function recoveryBanner(){if(!recoveryMode)return '';const hasBackup=recoveryMode==='backup';return `<section class="recovery-banner" role="alert"><div><strong>${hasBackup?'Spielstand beschädigt – Sicherung verfügbar':'Spielstand beschädigt – keine gültige Sicherung gefunden'}</strong><p>${hasBackup?'Die letzte gültige Sicherung ist geladen. Der beschädigte Originaleintrag bleibt bis zu deiner Auswahl unangetastet.':'Der beschädigte Originaleintrag bleibt unangetastet. Starte erst nach deiner Bestätigung ein neues Spiel.'}</p></div><div class="actions">${hasBackup?'<button class="btn btn-primary" data-recovery="restore">Sicherung wiederherstellen</button>':''}<button class="btn btn-secondary" data-recovery="new">${hasBackup?'Neues Spiel starten':'Beschädigten Stand behalten und neu starten'}</button></div></section>`;}
function gameOverBanner(){return state.finance.gameLost?`<section class="game-over-banner" role="alert"><strong>Spiel verloren</strong><span>${escaped(state.finance.lossReason||'Eine eigene Verbindlichkeit ist nach acht wöchentlichen Fehlversuchen unbezahlt geblieben.')}</span><button class="btn btn-secondary btn-small" data-recovery="new">Neues Spiel starten</button></section>`:'';}
function fmtDay(date) {
  return new Intl.DateTimeFormat('de-DE', { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}
function escaped(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}
function progress(order) {
  const total = order.planningHours + order.operations.reduce((sum, op) => sum + op.totalHours, 0);
  const done = order.planningDone + order.operations.slice(0, order.operationIndex).reduce((sum, op) => sum + op.totalHours, 0) + order.operationDone;
  return Math.min(100, Math.round(done / total * 100));
}
function statusLabel(order) {
  if (order.status === 'ANGEBOT') return ['Angebot offen', 'warn'];
  if (order.status === 'MARKT_VERLOREN') return ['Angebot abgelehnt', ''];
  if (order.status === 'NACHARBEIT') return ['Nacharbeit', 'warn'];
  if (order.closedAt) return ['Abgeschlossen', 'done'];
  if (order.rejectedAt) return ['Abnahme in Klärung', 'warn'];
  if (order.acceptedAt) return ['Abgenommen · Rechnung bereit', 'done'];
  if (order.deliveredAt) return ['Geliefert · Abnahme offen', 'warn'];
  if (order.status === 'IN_BEARBEITUNG') return ['In Produktion', ''];
  if (order.status === 'PRODUKTIONSBEREIT') return ['Produktionsbereit', ''];
  return ['Bestätigt', ''];
}
function currentCapacity() {
  const workday = isWorkday(state.game.date);
  return [
    ['Arbeitsvorbereitung', workday ? '8 h' : '0 h', workday ? 100 : 0],
    ['Produktion', workday ? '8 h' : '0 h', workday ? 100 : 0],
    ['CNC-01', workday ? '8 h' : '0 h', workday ? 100 : 0],
  ];
}
function metric(label, value, note, icon) {
  return `<section class="card"><div class="metric-label">${label}<span class="metric-icon">${icon}</span></div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></section>`;
}
function invoiceFor(order) { return state.finance.invoices.find(item => item.orderId === order.id); }
function orderShort(order) {
  const [label, kind] = statusLabel(order);
  const op = getCurrentOperation(order);
  const pct = progress(order);
  return `<article class="order-row"><div><div class="order-name">${escaped(order.name)}</div><div class="order-meta">${order.id} · ${order.customer} · ${order.quantity} Stück</div></div><span class="status ${kind}">${label}</span><div class="progress"><span style="width:${pct}%"></span></div><div class="order-footer"><span>${order.closedAt ? `Bezahlt ${formatDate(order.closedAt)}` : op ? `${op.name} · ${order.operationDone}/${op.totalHours} h` : order.deliveredAt ? `Abnahme bis ${formatDate(order.acceptanceDue)}` : 'Arbeitsvorbereitung'} </span><span>Lieferziel ${formatDate(order.dueDate)}</span></div></article>`;
}
function eventsList() {
  const all = [...state.game.events, ...state.finance.events]
    .filter(event => event.kind !== 'KUNDENZAHLUNG')
    .sort((a, b) => b.date.localeCompare(a.date) || b.phase - a.phase).slice(0, 7);
  if (!all.length) return '<p class="empty">Noch keine Ereignisse.</p>';
  return `<div class="timeline">${all.map(event => `<div class="event"><span class="event-icon">${event.kind === 'RECHNUNG' ? '€' : event.kind === 'GELIEFERT' ? '↗' : event.kind === 'PRODUKTION' ? '⚙' : '·'}</span><div class="event-copy">${escaped(event.text)}<small>${formatDate(event.date)} · Phase ${event.phase}</small></div></div>`).join('')}</div>`;
}
function dashboard() {
  const orders = state.game.orders;
  const openCount = orders.filter(o => !o.closedAt && !o.rejectedAt && !['ANGEBOT','MARKT_VERLOREN'].includes(o.status)).length;
  const active = orders.filter(o => !o.closedAt);
  const capacity = currentCapacity();
  const space = getSpaceUse(state.game);
  return `<div class="eyebrow">Betriebsübersicht · ${fmtDay(state.game.date)}</div>
    <div class="heading-row"><div><h1>Guten Morgen.</h1><p class="subhead">${getWeekLabel(state.game.date)} · Nächster Spieltag</p></div><div class="actions"><button class="btn btn-secondary" data-action="day">+ 1 Tag</button><button class="btn btn-primary" data-action="week">Woche abarbeiten ↗</button><button class="btn btn-secondary" data-action="year">1 Jahr simulieren</button></div></div>
    <div class="grid metrics">${metric('Bankbestand', money(state.finance.cash), 'Eröffnungsbestand 30.000 €', '€')}${metric('Aktive Aufträge', openCount, `${state.game.annualStats.ordersGenerated} neue Aufträge im Spieljahr`, '▤')}${metric('Offene Forderungen', money(getOpenReceivables(state.finance)), 'inkl. Eröffnungsbestand 12.500 €', '↗')}${metric('Lagerbestand · Stahl', `${state.game.inventory.steel.toLocaleString('de-DE')} kg`, `Vorräte gesamt ${money(INITIAL_INVENTORY_VALUE)}`, '▦')}</div>
    <div class="grid metrics">${metric('Konjunktur', `${Math.round(state.game.macro.marketDemand*100)} % Nachfrage`, `Inflation ${((state.game.macro.inflation||0)*100).toFixed(1)} %`, '↗')}${metric('Dispo', money(state.finance.overdraftDrawn), `Limit ${money(state.finance.overdraftLimit)}`, '€')}${metric('Mitarbeitermoral', `${Math.round(state.game.employees.reduce((a,e)=>a+e.morale,0)/state.game.employees.length)} %`, `Krankheitstage ${state.game.annualStats.sickDays}`, '☺')}${metric('Miete / Monat', money(state.game.roomSettings.rent), 'Szenariowert', '⌂')}</div><div class="grid main-grid"><section class="card"><div class="section-title"><h2>Auftragslage</h2><button class="text-link" data-view="orders">Alle Aufträge →</button></div><div class="order-list">${orders.map(orderShort).join('')}</div><div class="saved">Automatisch lokal gespeichert</div></section>
    <div class="stack"><section class="card balance-card"><div class="metric-label">Betriebsmittel <span>01.01.2027</span></div><div class="metric-value">${money(state.finance.cash)}</div><div class="metric-note">Verfügbares Bankguthaben</div><div class="balance-detail"><span>Lieferantenverbindlichkeiten</span><strong>${money(state.finance.openingPayables)}</strong><span>Maschinendarlehen</span><strong>${money(state.finance.machineLoan)}</strong><span>Restbudgetrahmen · kein Cash</span><strong>20.000 €</strong></div></section>
    <section class="card"><div class="section-title"><h2>Tageskapazität</h2><span class="status">${isWorkday(state.game.date) ? 'Arbeitstag' : isHoliday(state.game.date) ? 'Feiertag' : 'Wochenende'}</span></div>${capacity.map(([name, amount, pct]) => `<div class="capacity-line"><span>${name}</span><span class="capacity-track"><i style="width:${pct}%"></i></span><strong>${amount}</strong></div>`).join('')}</section></div>
    <section class="card wide"><div class="section-title"><h2>Räume und Kapazitäten</h2><button class="text-link" data-view="planning">Arbeitsplanung →</button></div><div class="room-grid"><div>Lager<strong>${space.warehouse.toFixed(1)} / ${space.warehouseCapacity} m²</strong></div><div>Büro<strong>${space.officePeople} / ${space.officeCapacity} Plätze</strong></div><div>Personalraum<strong>${space.staffPeople} / ${space.staffCapacity} Plätze</strong></div><div>Werkstatt<strong>${space.machineCount} / ${space.machineCapacity} Maschinen</strong></div></div><label class="field-label">Monatsmiete im Szenario (€)</label><input class="field" type="number" min=0 step=100 data-setting="rent" value="${state.game.roomSettings.rent}"><div class="notice">Raumflächen sind V1-Betriebsgrenzen. Sie ersetzen keine Arbeitsschutz- oder baurechtliche Prüfung.</div></section><section class="card"><div class="section-title"><h2>Letzte Ereignisse</h2><span class="muted" style="font-size:10px">Phasen 1–10</span></div>${eventsList()}</section></div>`;
}
function orderCard(order) {
  const [label, kind] = statusLabel(order);
  const op = getCurrentOperation(order);
  const pct = progress(order);
  const agreement = state.agreements[order.id] || { net: '', terms: 14 };
  const invoice = invoiceFor(order);
  const offer = order.status === 'ANGEBOT';
  const economics = estimateOrderEconomics(order, state.game, agreement.net || order.scenarioPrice || null);
  const quoteValue = agreement.net || order.scenarioPrice || '';

  return `<article class="card order-card"><div class="order-card-top"><div><h3>${escaped(order.name)}</h3><div class="order-id">${order.id} · ${escaped(order.customerName||order.customer)} · ${order.quantity} Stück</div></div><span class="status ${kind}">${label}</span></div>
    <div class="order-stats"><div><strong>${formatDate(order.dueDate)}</strong><span>Lieferziel</span></div><div><strong>${pct}%</strong><span>Gesamtfortschritt</span></div><div><strong>${order.deliveredAt ? formatDate(order.deliveredAt) : '—'}</strong><span>Lieferdatum</span></div></div>
    <div class="progress"><span style="width:${pct}%"></span></div><div class="operation"><span>${op ? `${op.id} · ${op.name}` : order.deliveredAt ? 'Vollständig geliefert' : 'Alle Arbeitsgänge abgeschlossen'}</span><strong>${op ? `${order.operationDone}/${op.totalHours} h` : ''}</strong></div>
    <div class="materials">Materialbedarf: ${order.materials.steel} kg Stahl · ${order.materials.aluminium} kg Aluminium · ${order.materials.parts} Referenzschrauben</div>
    ${offer?`<div class="notice offer-notice">Angebotsfrist bis ${formatDate(order.offerExpiresAt)} · Noch keine Kapazität gebunden.</div>`:''}
    ${offer||(!order.generated&&!invoice)?`<div class="field-label">Nettoangebot und Zahlungsziel${offer?' · vor Auftragsannahme':''}</div><div class="form-row"><input class="field" type="number" inputmode="decimal" min="0.01" step="0.01" placeholder="Kalkulationsvorschlag ${money(economics.suggestedNet)}" aria-label="Nettoangebot für ${order.id}" data-net="${order.id}" value="${escaped(quoteValue)}"><select class="field" aria-label="Zahlungsziel" data-terms="${order.id}"><option value="14" ${Number(agreement.terms||order.agreedTerms)===14?'selected':''}>14 Tage</option><option value="30" ${Number(agreement.terms||order.agreedTerms)===30?'selected':''}>30 Tage</option></select></div><div class="quote-metrics"><span>Material ${money(economics.material)}</span><span>Arbeit ${money(economics.labor)}</span><span>Gemeinkostenannahme ${money(economics.overhead)}</span><strong>Deckungsbeitrag ${money(economics.contribution)} · Marge ${(economics.margin*100).toFixed(1)} %</strong><span>SimTAX ${money(economics.tax)} · Brutto ${money(economics.gross)}</span></div><p class="muted">Kalkulationsvorschlag: 20 % Zielmarge auf Basis von Material, modellierten Arbeitskosten und pauschal zugeordneten Gemeinkosten. Kein Marktangebot und keine verbindliche BAB-Kalkulation. Du kannst den Preis ändern; ein niedriger Preis kann einen negativen Deckungsbeitrag ergeben.</p>`:''}
    ${offer?`<div class="actions"><button class="btn btn-primary btn-small" data-action="accept-offer" data-order="${order.id}">Angebot abgeben und annehmen</button><button class="btn btn-secondary btn-small" data-action="decline-offer" data-order="${order.id}">Ablehnen</button></div>`:''}
    ${!offer&&!order.deliveredAt&&!order.closedAt?`<label class="field-label">Auftragspriorität</label><select class="field" data-priority="${order.id}">${[0,1,2,3].map(v=>`<option value="${v}" ${Number(order.priority||0)===v?'selected':''}>${['Normal','Erhöht','Hoch','Dringend'][v]}</option>`).join('')}</select>`:''}
    ${order.status==='ABLEHNUNG_IN_KLÄRUNG'?`<div class="notice">Abnahme abgelehnt. Du kannst eine einmalige Nacharbeit mit vier zusätzlichen Qualitätsstunden einleiten oder den Auftrag stornieren. Bereits angefallene Kosten bleiben bestehen.</div><div class="actions"><button class="btn btn-secondary btn-small" data-action="rework" data-order="${order.id}">Nacharbeit einleiten</button><button class="btn btn-secondary btn-small" data-action="cancel-rejected" data-order="${order.id}">Auftrag stornieren</button></div>`:''}
    ${order.deliveredAt && !order.acceptedAt && !order.rejectedAt ? `<div class="actions" style="margin-top:13px"><button class="btn btn-primary btn-small" data-action="accept" data-order="${order.id}">Abnahme erteilen</button><button class="btn btn-secondary btn-small" data-action="reject" data-order="${order.id}">Ablehnen / Klärung</button><span class="muted" style="font-size:9px;align-self:center">Auto-Abnahme ${formatDate(order.acceptanceDue)}</span></div>` : ''}
    ${invoice ? `<div class="invoice-box"><span>Rechnung · netto</span><strong>${money(invoice.net)}</strong><span>SimTAX 19 %</span><strong>${money(invoice.tax)}</strong><span>Brutto · ${invoice.status === 'BEZAHLT' ? 'bezahlt' : `fällig ${formatDate(invoice.dueDate)}`}</span><strong>${money(invoice.gross)}</strong></div>` : ''}
  </article>`;
}
function ordersPage() {
  const filters = [['all','Alle'],['offers','Angebote'],['active','Offen'],['delivered','Geliefert'],['closed','Abgeschlossen']];
  let orders = state.game.orders;
  if (state.filter === 'offers') orders = orders.filter(o => o.status==='ANGEBOT');
  if (state.filter === 'active') orders = orders.filter(o => !o.closedAt && !o.deliveredAt && o.status!=='ANGEBOT');
  if (state.filter === 'delivered') orders = orders.filter(o => o.deliveredAt && !o.closedAt);
  if (state.filter === 'closed') orders = orders.filter(o => o.closedAt);
  orders=[...orders].sort((a,b)=> (a.status==='ANGEBOT'?-1:0)-(b.status==='ANGEBOT'?-1:0)||(Number(b.priority)||0)-(Number(a.priority)||0)||a.dueDate.localeCompare(b.dueDate)||a.id.localeCompare(b.id));
  return `<div class="eyebrow">Produktion · Kundenaufträge</div><div class="heading-row"><div><h1>Aufträge</h1><p class="subhead">Angebote prüfen, Aufträge priorisieren, fertigen und vollständig abrechnen.</p></div><div class="actions"><button class="btn btn-secondary" data-action="day">+ 1 Tag</button><button class="btn btn-primary" data-action="week">Woche abarbeiten ↗</button><button class="btn btn-secondary" data-action="year">1 Jahr simulieren</button></div></div><div class="page-tabs">${filters.map(([key,label]) => `<button class="${state.filter === key ? 'selected' : ''}" data-filter="${key}">${label}</button>`).join('')}</div><div class="grid order-cards">${orders.length ? orders.map(orderCard).join('') : '<section class="card empty">Keine Aufträge in dieser Ansicht.</section>'}</div>`;
}
function planningPage(){
 const g=state.game, open=g.orders.filter(o=>!o.closedAt&&!o.rejectedAt&&!['ANGEBOT','MARKT_VERLOREN'].includes(o.status)), space=getSpaceUse(g);
 const staff=g.employees.map(e=>{const eligible=open.filter(o=>e.skill.includes('PLAN')?o.planningDone<o.planningHours:e.skill.includes(o.operations[o.operationIndex]?.skill));const away=e.sickUntil>=g.date?'Krank':e.vacationPlan.includes(g.date)?'Urlaub':'Verfügbar';return `<article class="card staff-card"><div class="section-title"><div><h3>${escaped(e.name)}</h3><span class="muted">${escaped(e.role)} · ${away}</span></div><span class="status">Moral ${Math.round(e.morale)} %</span></div><label class="field-label">Tageszuweisung · höchstens 8 h</label><select class="field" data-plan="${e.id}"><option value="">Automatische Planung</option>${eligible.map(o=>`<option value="${o.id}" ${g.workPlan[g.date]?.[e.id]===o.id?'selected':''}>${escaped(o.id+' · '+o.name)}</option>`).join('')}</select><p class="muted">Urlaub: ${e.vacationDaysUsed} / 20 Werktage · Monatskosten ${money(e.monthlyCost)}</p><button class="btn btn-secondary btn-small" data-action="vacation" data-employee="${e.id}">Urlaubswoche verschieben</button></article>`;}).join('');
 return `<div class="eyebrow">Personal · Kapazität · Räume</div><div class="heading-row"><div><h1>Arbeitsplanung</h1><p class="subhead">${formatDate(g.date,{year:true})} · Beschäftigte arbeiten höchstens 8 h je Arbeitstag.</p></div><div class="actions"><button class="btn btn-secondary" data-action="day">+ 1 Tag</button><button class="btn btn-primary" data-action="week">Woche abarbeiten</button></div></div><div class="notice">V1-Arbeitsannahmen: 20 Urlaubstage pro Jahr bei 5-Tage-Woche; Krankheit wird zufällig simuliert und senkt verfügbare Kapazität; Moral beeinflusst Produktivität. Für den rechtsorientierten Jahreslauf gelten vorsorglich die Feiertage, die in mindestens einem Bundesland gesetzlich sind.</div><div class="grid order-cards">${staff}</div>
 <section class="card wide"><div class="section-title"><h2>Zeitarbeit buchen</h2><span class="status warn">Spiel-Szenariotarif</span></div><p class="subhead">Buchung auf Auftrag und Tag, maximal 8 Stunden je Person.</p><div class="planner-form"><select class="field" data-temp-order>${open.map(o=>`<option value="${o.id}">${escaped(o.id+' · '+o.name)}</option>`).join('')}</select><select class="field" data-temp-skill><option value="CNC">CNC / Qualität</option><option value="PREP">Materialbereitstellung</option><option value="PACK">Versand</option></select><input class="field" type="number" min="1" max="8" value="8" data-temp-hours aria-label="Stunden"><input class="field" type="number" min="1" step="1" value="45" data-temp-rate aria-label="Agenturpreis pro Stunde"><button class="btn btn-primary" data-action="book-temp">Für heute buchen</button></div><div class="notice">45 €/h ist ein veränderbarer V1-Szenariopreis, kein Marktangebot. Es wird ein lizenzierter Verleiher mit benannter Person und schriftlichem Überlassungsvertrag angenommen. Das Spiel prüft keine konkrete AÜG-Konformität.</div></section>
 <section class="card wide"><h2>Raumplanung</h2><div class="room-grid"><div>Lager<strong>${space.warehouse.toFixed(1)} / ${space.warehouseCapacity} m² belegt</strong></div><div>Büro<strong>${space.officePeople} / ${space.officeCapacity} Plätze</strong></div><div>Personalraum<strong>${space.staffPeople} / ${space.staffCapacity} Plätze</strong></div><div>Werkstatt<strong>${space.machineCount} / ${space.machineCapacity} Maschinenplätze</strong></div></div><div class="room-settings"><label>Lagerfläche m²<input class="field" type="number" min=1 data-room="warehouse" value="${g.roomSettings.warehouse}"></label><label>Bürofläche m²<input class="field" type="number" min=1 data-room="office" value="${g.roomSettings.office}"></label><label>Personalraum m²<input class="field" type="number" min=1 data-room="staff" value="${g.roomSettings.staff}"></label><label>Werkstattfläche m²<input class="field" type="number" min=1 data-room="workshop" value="${g.roomSettings.workshop}"></label><label>CNC-Maschinen<input class="field" type="number" min=0 data-room="machineCount" value="${g.roomSettings.machineCount}"></label></div><p class="muted">Richtwerte für das Betriebsszenario. ArbStättV verlangt nutzungsgerechte Fläche und Luftraum; das Spiel stellt keine Rechtskonformität fest.</p></section>`;
}
function networkPage(){
 const n=state.game.network,scenario=state.game.macro.economicScenario||'base';
 const competitors=n.competitors.map(c=>'<article class="partner-card"><strong>'+escaped(c.name)+'</strong><p>'+escaped(c.focus)+'</p><div class="partner-facts"><span>Qualität <b>'+c.quality+'</b></span><span>Lieferung <b>'+c.delivery+'</b></span><span>Markt <b>'+Math.round(c.marketShare)+' %</b></span></div></article>').join('');
 const suppliers=n.suppliers.map(p=>'<article class="partner-card"><strong>'+escaped(p.name)+'</strong><p>Material: '+p.materials.map(x=>({steel:'Stahl',aluminium:'Aluminium',parts:'Referenzschrauben'}[x]||x)).join(', ')+'</p><div class="partner-facts"><span>Zuverlässigkeit <b>'+Math.round(p.reliability)+' %</b></span><span>Beziehung <b>'+Math.round(p.relationship)+'/100</b></span><span>Vorlauf-Risiko <b>'+Math.round(100-p.reliability)+' %</b></span><span>Eigene Zahlungsmoral <b>'+Math.round(p.paymentMoral||90)+'/100</b></span></div></article>').join('');
 const customers=n.customers.map(c=>'<article class="partner-card"><strong>'+escaped(c.name)+'</strong><p>'+escaped(c.sector)+'</p><div class="partner-facts"><span>Zahlungsmoral <b>'+Math.round(c.paymentMoral)+'/100</b></span><span>Beziehung <b>'+Math.round(c.relationship)+'/100</b></span><span>Erwartete Verspätung <b>'+c.lateDays+' Tage</b></span></div>'+(c.lastPaidAt?'<small class="muted">Letzter Zahlungseingang '+formatDate(c.lastPaidAt)+' · '+(c.lastDelayDays||0)+' Tage nach Frist</small>':'')+'</article>').join('');
 return '<div class="eyebrow">Markt · Lieferkette · Beziehungen</div><div class="heading-row"><div><h1>Geschäftsnetzwerk</h1><p class="subhead">Drei direkte Konkurrenten, fünf Lieferanten und fünf Kunden beeinflussen Wettbewerb, Materialfluss und Zahlungseingänge.</p></div></div><div class="grid metrics">'+metric('Unternehmensruf',Math.round(n.companyReputation)+' %','steigt mit Aufträgen','↗')+metric('Marktanfragen',n.opportunities,'Wettbewerbschancen','⌁')+metric('Gewonnen / verloren',n.awardedOrders+' / '+n.lostOrders,'Auftragsvergabe','⇄')+metric('Offene Materialbestellungen',state.game.pendingMaterialOrders.filter(x=>!x.deliveredAt).length,'Lieferverzug hält Produktion zurück','▦')+'</div><div class="grid order-cards"><section class="card wide"><h2>Wirtschaftsszenario</h2><label class="field-label" for="economic-scenario">Preis- und Nachfragepfad</label><select class="field" id="economic-scenario" data-economic-scenario>'+Object.entries(ECONOMIC_SCENARIOS).map(([key,value])=>`<option value="${key}" ${scenario===key?'selected':''}>${escaped(value.label)}</option>`).join('')+'</select><p class="muted">Basis nutzt D-0044s 2 % p. a. Stresswerte orientieren sich an Destatis-PPI September 2026 (+8,4 % Stahl, +6,4 % Aluminium-/Vorleistungsgüter, +14,9 % Energie); sie sind Sensitivitätspfade, keine Prognose oder konkreten Lieferantenangebote.</p></section><section class="card wide"><h2>Wettbewerber · 3</h2><div class="partner-grid">'+competitors+'</div></section><section class="card wide"><h2>Vorgelagerte Lieferanten · 5</h2><div class="partner-grid">'+suppliers+'</div></section><section class="card wide"><h2>Nachgelagerte Kunden · 5</h2><div class="partner-grid">'+customers+'</div></section><section class="card wide notice">Szenariowerte, keine realen Unternehmen. Kundenbindung, Preisniveau und verfügbare Kapazität beeinflussen Chancen. Lieferantenzuverlässigkeit bestimmt den Vorlauf bei Fehlbeständen.</section></div>';
}
function trainingPage(){
 const g=state.game,a=g.apprentice,eOptions=g.employees.map(e=>'<option value="'+e.id+'">'+escaped(e.name)+' · '+escaped(e.role)+'</option>').join('');
 const courseOptions=CONTINUING_COURSES.map(c=>'<option value="'+c.id+'">'+escaped(c.name)+' · '+c.days+' Arbeitstage · '+money(c.cost)+'</option>').join('');
 const staff=g.employees.map(e=>'<article class="partner-card"><strong>'+escaped(e.name)+'</strong><p>Kompetenzen: '+e.skill.join(' · ')+' · Moral '+Math.round(e.morale)+' % · Produktivität +'+Math.round((e.productivityBonus||0)*100)+' %</p>'+(e.training&&e.training.remainingDays>0?'<span class="status warn">'+escaped(e.training.name)+' · '+e.training.remainingDays+'/'+e.training.totalDays+' AT verbleiben</span>':e.training&&e.training.completedAt?'<span class="status done">Abgeschlossen '+formatDate(e.training.completedAt)+'</span>':'<span class="status">Kein laufender Kurs</span>')+'</article>').join('');
 let apprenticeship='';
 if(a&&a.status==='ACTIVE'){apprenticeship='<strong>'+escaped(a.name)+' · Ausbilder: '+escaped(g.employees.find(e=>e.id===a.trainerId)?.name||'')+'</strong><div class="progress"><span style="width:'+Math.min(100,(a.progressMonths||0)/a.durationMonths*100)+'%"></span></div><p>'+(a.progressMonths||0)+'/'+a.durationMonths+' Monate · '+a.schoolDays+' Berufsschultage · '+a.practiceDays+' betriebliche Praxistage</p><p>Vergütung: '+money((a.progressMonths||0)>=12?902:764)+' € brutto/Monat im Szenariojahr 2027.</p>';}else if(a&&a.status==='COMPLETED'){apprenticeship='<div class="notice">Ausbildung abgeschlossen; Fachkraft in die Belegschaft übernommen.</div>';}else{apprenticeship='<div class="training-form"><select class="field" data-trainer>'+eOptions+'</select><button class="btn btn-primary" data-action="start-apprenticeship" '+(g.date.startsWith('2027')?'':'disabled')+'>Ausbildungsplatz besetzen</button></div><p class="notice">Zweijährige duale Ausbildung zur Fachkraft für Metalltechnik, Fachrichtung Zerspanungstechnik. Ein Ausbildungsplatz; Berufsschule mittwochs. Mindestvergütung 2027: 764 € im 1. und 902 € im 2. Ausbildungsjahr. +20 % Lohnnebenkosten und 85 €/Monat Ausbildungsmittel sind Modellannahmen.</p>';}
 return '<div class="eyebrow">Personalentwicklung · duale Ausbildung</div><div class="heading-row"><div><h1>Aus- und Weiterbildung</h1><p class="subhead">Weiterbildung baut Kompetenzen auf; Ausbildung entwickelt Nachwuchs über zwei Jahre.</p></div></div><div class="grid order-cards"><section class="card wide"><h2>Weiterbildung der Beschäftigten</h2><div class="training-form"><select class="field" data-training-employee>'+eOptions+'</select><select class="field" data-training-course>'+courseOptions+'</select><button class="btn btn-primary" data-action="start-training">Kurs buchen</button></div><div class="partner-grid">'+staff+'</div><p class="notice">Kurskosten und Dauer sind Szenarioannahmen. An Kurstagen steht die Person nicht für Produktion zur Verfügung. Bei Abschluss wird die Kursqualifikation dauerhaft eingetragen und ein möglicher Produktivitätsbonus aktiv.</p></section><section class="card wide"><h2>Ausbildungsplatz · Metalltechnik/Zerspanung</h2>'+apprenticeship+'</section><section class="card wide notice">Das Modell setzt geeigneten Ausbildungsbetrieb, beauftragte ausbildende Person, Ausbildungsplan, Vertrag, Berufsschulbesuch und geeignete Aufgaben voraus. Es prüft keine Kammerregistrierung, Tarifvergütung, Minderjährigenschutz oder tatsächlichen Berufsschulplan und stellt keine anerkannte Qualifikation aus.</section></div>';
}
function financePage() {
  const invoices = [...state.finance.invoices].sort((a,b) => b.issueDate.localeCompare(a.issueDate));
  const periods = state.finance.monthlyClosings ?? [];
  const openCosts=(state.finance.unpaidItems||[]).filter(x=>!x.paidAt),paymentPriority=new Map((state.finance.paymentPriority||[]).map((id,i)=>[id,i]));openCosts.sort((a,b)=>(paymentPriority.get(a.id)??999999)-(paymentPriority.get(b.id)??999999)||a.date.localeCompare(b.date)||a.id.localeCompare(b.id));
  const unpaidSection=`<section class="card wide"><div class="section-title"><h2>Offene Betriebskosten</h2><span class="status warn">${money(state.finance.unpaidCosts)}</span></div>${openCosts.length?`<p class="muted">Reihenfolge der eigenen fälligen Zahlungen: oben zuerst. Kundeneingänge und Maschinenrate werden vorher verarbeitet.</p><div class="order-list">${openCosts.map((x,i)=>`<div class="order-row"><div><strong>${i+1}. ${escaped(x.label)}</strong><div class="order-meta">Erster Fehlversuch ${formatDate(x.firstFailedAt||x.date)} · Retries ${(x.retryFailures||0)}/8 · nächster ${formatDate(x.nextRetryDate)} · Erinnerung ${x.reminderAt?formatDate(x.reminderAt):formatDate(x.reminderDate)} · Mahnung ${x.formalNoticeAt?formatDate(x.formalNoticeAt):formatDate(x.formalNoticeDate)}</div></div><strong>${money(x.amount)}</strong><div class="actions"><button class="btn btn-secondary btn-small" data-action="priority-up" data-cost="${x.id}" aria-label="Zahlung nach oben" ${i===0?'disabled':''}>↑</button><button class="btn btn-secondary btn-small" data-action="priority-down" data-cost="${x.id}" aria-label="Zahlung nach unten" ${i===openCosts.length-1?'disabled':''}>↓</button><button class="btn btn-secondary btn-small" data-action="pay-dispo" data-cost="${x.id}">Fehlbetrag aus Dispo ziehen und voll zahlen</button></div></div>`).join('')}</div>`:'<p class="empty">Keine offenen Betriebskosten.</p>'}<p class="muted">Manueller Abruf erfolgt nur exakt in Höhe des Fehlbetrags und nur bis zum freien Rahmen. Nach acht wöchentlichen Retry-Fehlschlägen ist das Spiel verloren.</p></section>`;
  const machineArrears=state.finance.machineArrears||[];
  const machineLoanSection=`<section class="card wide"><div class="section-title"><h2>Maschinenkredit</h2><span class="status ${machineArrears.length?'warn':'done'}">Restschuld ${money(state.finance.machineLoan)}</span></div>${machineArrears.length?`<div class="order-list">${machineArrears.map(x=>`<div class="order-row"><div><strong>Rate ${x.installment} · ${money(x.amount)}</strong><div class="order-meta">Fällig ${formatDate(x.dueDate)} · nächster Retry ${formatDate(x.nextRetryDate)} · ${x.attempts} Fehlversuche</div></div><button class="btn btn-secondary btn-small" data-action="pay-loan-dispo">Fehlbetrag aus Dispo ziehen und Rate zahlen</button></div>`).join('')}</div>`:'<p class="empty">Keine überfälligen Maschinenraten.</p>'}<p class="muted">Acht Prozent des individuellen Unternehmenszinses als relativer Dispoaufschlag. Bei drei gleichzeitig offenen Raten wird die Maschine gemäß D-0042/43 verwertet; jeder manuelle Abruf bleibt durch den freien Rahmen begrenzt.</p></section>`;
  const taxSection=`<section class="card wide"><div class="section-title"><h2>SimTAX-Vorauszahlungen</h2><span class="muted">D-0097 · Fälligkeit am 10. Folgemonat</span></div>${state.finance.taxPeriods.length?`<div class="order-list">${state.finance.taxPeriods.map(t=>`<div class="order-row"><strong>${t.month}</strong><div class="order-meta">Ausgang ${money(t.outputTax||0)} · Vorsteuer ${money(t.inputTax||0)} · Guthaben davor ${money(t.creditBroughtForward||0)} · netto ${money(t.amount)}</div><span class="status ${t.paidAt||t.settledAt?'done':t.failedAt?'warn':' '}">${t.paidAt?`gezahlt ${formatDate(t.paidAt)}`:t.settledAt?`Guthaben ${money(t.creditCarriedForward||0)} vorgetragen`:t.failedAt?`${t.retryFailures||0}/8 Retry · ${t.formalNoticeAt?'formell gemahnt':t.reminderAt?'erinnert':'offen'}`:`fällig ${t.dueDate||'10. Folgemonat'}`}</span></div>`).join('')}</div>`:'<p class="empty">Noch keine SimTAX-Rechnungen.</p>'}<p class="muted">Vorsteuer auf qualifizierte Material-Lieferantenbelege wird mit Ausgangs-SimTAX verrechnet; Guthaben läuft in Folgeperioden weiter. SimTAX bleibt ein Szenariowert.</p></section>`;
  const monthlySection = `<section class="card wide"><div class="section-title"><h2>Monatsabschluss</h2><span class="muted">Phase 10 · nach dem letzten Kalendertag</span></div>${periods.length ? `<div class="month-report-list">${periods.map(period => { const monthName = new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${period.month}-01T12:00:00Z`)); return `<article class="month-report"><div class="month-report-heading"><strong>${monthName}</strong><span class="status done">abgeschlossen ${formatDate(period.closedAt)}</span></div><div class="month-metrics"><div><span>Umsatz netto</span><strong>${money(period.salesNet)}</strong></div><div><span>SimTAX</span><strong>${money(period.simulatedTax)}</strong></div><div><span>Kundeneingänge</span><strong>${money(period.customerReceipts)}</strong></div><div><span>Bankbestand</span><strong>${money(period.closingCash)}</strong></div><div><span>Personal</span><strong>${money(period.payroll)}</strong></div><div><span>Miete</span><strong>${money(period.rent)}</strong></div><div><span>Energie/Wartung</span><strong>${money(period.utilities+period.maintenance)}</strong></div><div><span>Dispozins</span><strong>${money(period.overdraftInterest)}</strong></div><div><span>Materialzugang</span><strong>${money(period.materialPurchases||0)}</strong></div><div><span>Weiterbildung</span><strong>${money(period.trainingCost||0)}</strong></div></div><p class="muted month-footnote">${period.invoiceCount} Rechnungen · ${period.deliveredOrders} Lieferungen · ${period.completedOrders} abgeschlossene Aufträge · Bank Anfang ${money(period.openingCash)}</p></article>`; }).join("")}</div>` : `<p class="empty">Noch kein Kalendermonat abgeschlossen.</p>`}<div class="notice">Materialpreise folgen dem datierten V1-Händlerbasisstand vom 27.10.2026. Miete, Energie und Wartung bleiben Szenariowerte; weder diese Anzeige noch die vereinfachte Eröffnungsbewertung sind ein vollständiger BAB oder prüfungsfähiger Abschluss.</div></section>`;

  const reconciliationSection=`<section class="card wide"><h2>Monatliche Ergebnis- und Cash-Prüfung</h2><div class="month-report-list">${periods.length?periods.map(p=>`<article class="month-report"><div class="month-report-heading"><strong>${p.month}</strong><span class="status ${Math.abs(p.cashReconciliation)<.01?'done':'warn'}">Cash-Abgleich ${money(p.cashReconciliation)}</span></div><div class="month-metrics"><div><span>Nettoerlös</span><strong>${money(p.salesNet)}</strong></div><div><span>Modellergebnis</span><strong>${money(p.scenarioResult)}</strong></div><div><span>Betriebskosten</span><strong>${money(p.operatingExpenses)}</strong></div><div><span>Materialverbrauch</span><strong>${money(p.materialConsumption)}</strong></div><div><span>Cashflow</span><strong>${money(p.netCashFlow)}</strong></div><div><span>SimTAX gezahlt / offen</span><strong>${money(p.taxPaid)} / ${money(p.taxOutstanding)}</strong></div><div><span>Maschinenrate / Zinsanteil</span><strong>${money(p.loanPayment)} / ${money(p.loanInterest)}</strong></div><div><span>Offene Betriebskosten</span><strong>${money(p.unpaidCosts)}</strong></div></div><p class="month-footnote">Ergebnis und SimTAX sind getrennte Szenariowerte. Das Modellergebnis ist keine Steuerbemessungsgrundlage oder HGB-GuV.</p></article>`).join(''):'<p class="empty">Nach dem ersten Monatsabschluss erscheinen Ergebnis und Cash-Abgleich.</p>'}</div></section>`;  return `<div class="eyebrow">Accounting · Stand ${formatDate(state.game.date)}</div><div class="heading-row"><div><h1>Finanzen</h1><p class="subhead">Cash, Verpflichtungen und Szenariokosten über das Spieljahr.</p></div></div>
    <div class="grid metrics">${metric('Bank', money(state.finance.cash), 'Liquidität zum aktuellen Spielstand', '€')}${metric('Forderungen', money(getOpenReceivables(state.finance)), 'inkl. unzugeordneter Eröffnungsforderungen', '↗')}${metric('Umsatz netto', money(state.finance.salesNet), 'aus ausgestellten Szenario-Rechnungen', '＋')}${metric('SimTAX', money(state.finance.simulatedTax), '19 % · je Position centgerundet', '％')}${metric('Dispo', money(state.finance.overdraftDrawn), `Limit ${money(state.finance.overdraftLimit)}`, '↗')}${metric('Offene Kosten', money(state.finance.unpaidCosts), 'nicht automatisch über Kredit gezogen', '!')}</div>
    <div class="grid balance-sheet"><section class="card"><h3>Eröffnungsbilanz · Aktiva</h3><div class="ledger-row"><span>Bank</span><strong>${money(30000)}</strong></div><div class="ledger-row"><span>Forderungen</span><strong>${money(12500)}</strong></div><div class="ledger-row"><span>Vorräte (${INITIAL_INVENTORY.steel} kg Stahl · ${INITIAL_INVENTORY.aluminium} kg Aluminium · ${INITIAL_INVENTORY.parts} Referenzteile)</span><strong>${money(INITIAL_INVENTORY_VALUE)}</strong></div><div class="ledger-row"><span>CNC · Buchwert</span><strong>${money(0)}</strong></div><div class="ledger-row total"><span>Summe Aktiva</span><strong>${money(30000+12500+INITIAL_INVENTORY_VALUE)}</strong></div><p class="muted">Preisstand 27.10.2026 netto: Stahl ${money(MATERIAL_PRICE_BASELINE.steel)}/kg · Aluminium ${money(MATERIAL_PRICE_BASELINE.aluminium)}/kg · Referenzteil ${money(MATERIAL_PRICE_BASELINE.parts)} / Stück</p></section><section class="card"><h3>Eröffnungsbilanz · Passiva</h3><div class="ledger-row"><span>Lieferantenverbindlichkeiten</span><strong>${money(7500)}</strong></div><div class="ledger-row"><span>Maschinendarlehen</span><strong>${money(24000)}</strong></div><div class="ledger-row"><span>Eigenkapital · Restposition</span><strong>${money(30000+12500+INITIAL_INVENTORY_VALUE-7500-24000)}</strong></div><div class="ledger-row total"><span>Summe Passiva</span><strong>${money(30000+12500+INITIAL_INVENTORY_VALUE)}</strong></div></section>
    <section class="card wide"><div class="section-title"><h2>Rechnungen und Kundeneingänge</h2><span class="muted" style="font-size:10px">Automatischer Eingang am Fälligkeitstag</span></div>${invoices.length ? `<div class="order-list">${invoices.map(inv => `<div class="order-row"><div><div class="order-name">${inv.id}</div><div class="order-meta">Rechnung ${formatDate(inv.issueDate)} · ${inv.termsDays} Tage · Eingang erwartet ${formatDate(inv.paymentDate||inv.dueDate)}</div></div><span class="status ${inv.status === 'BEZAHLT' ? 'done' : 'warn'}">${inv.status === 'BEZAHLT' ? `Bezahlt ${formatDate(inv.paidAt)}` : `Fällig ${formatDate(inv.dueDate)}`}</span><div class="invoice-box"><span>Netto</span><strong>${money(inv.net)}</strong><span>SimTAX</span><strong>${money(inv.tax)}</strong><span>Brutto</span><strong>${money(inv.gross)}</strong></div></div>`).join('')}</div>` : '<p class="empty">Noch keine Rechnungen. Nach Abnahme trägst du den Netto-Szenariopreis auf der Auftragskarte ein.</p>'}</section>
    ${monthlySection}${reconciliationSection}${taxSection}${unpaidSection}${machineLoanSection}<section class="card wide"><div class="section-title"><h2>Offene Startpositionen</h2><span class="status warn">ohne Einzeldokumente</span></div><div class="notice">Die Eröffnungsforderungen (12.500 €) und Lieferantenverbindlichkeiten (7.500 €) besitzen hier keine Einzeldokumente oder Fälligkeitstage. Sie werden deshalb nicht automatisch bewegt. Maschinendarlehen: 5 % nominal, 339,21 € Monatsrate ab 29.01.2027; Zins und Tilgung werden getrennt gebucht. Die 20.000 € Restbudgetrahmen sind kein Bankbestand.</div></section>
     <section class="card wide"><div class="section-title"><h2>Abgrenzung der Finanzansicht</h2><span class="status warn">vereinfachte V1</span></div><div class="notice">Die Eröffnungsbilanz oben ist der V1-Szenariostand zum 01.01.2027. Die Vorräte sind zu festgeschriebenen Händlerreferenzpreisen angesetzt; historische Einkaufsbelege fehlen. Der laufende Cash- und Kostenabschluss ist vereinfacht. Auftragsmargen und vollständige BAB-Werte werden deshalb nicht ausgewiesen.</div></section></div>`;
}
function render() {
  today.textContent = formatDate(state.game.date, { year: true });
  weekday.textContent = fmtDay(state.game.date);
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === state.view));
  app.innerHTML = recoveryBanner()+gameOverBanner()+(state.view === 'orders' ? ordersPage() : state.view === 'planning' ? planningPage() : state.view === 'network' ? networkPage() : state.view === 'training' ? trainingPage() : state.view === 'finance' ? financePage() : dashboard());
  save();
}
function registerInvoice(order) {
  const agreement = state.agreements[order.id];
  if (!agreement || !(Number(agreement.net) > 0) || !order.invoiceReadyAt) return false;
  const invoice = issueInvoice(state.finance, order, agreement.net, agreement.terms);
  if (invoice) { showToast('Rechnung ausgestellt. Der Kundeneingang folgt am Fälligkeitstag.'); return true; }
  return false;
}
function processDay() {
  if(state.finance.gameLost)return state.game.lastProcessedDate||state.game.date;
  const firstEvent=state.game.events.length;
  refreshOverdraftLimit(state.finance,state.game,state.game.date);
  advanceOneDay(state.game);
  for(const ev of state.game.events.slice(firstEvent)){if(ev.kind==='MATERIALVERBRAUCH'){const order=state.game.orders.find(o=>o.id===ev.orderId);if(order)recordMaterialUse(state.finance,state.game,order,ev.date);}if(ev.kind==='MATERIALZUGANG')recordMaterialPurchase(state.finance,ev.materials,ev.date,ev.supplierId,state.game);if(ev.kind==='WEITERBILDUNG_START'){const employee=state.game.employees.find(x=>x.training?.startedAt===ev.date&&x.training?.remainingDays>0);if(employee)recordTrainingCost(state.finance,ev.date,employee.training.name,employee.training.cost);}}
  for(const order of state.game.orders){if(order.invoiceReadyAt&&!invoiceFor(order)){const agreement=state.agreements[order.id];if(order.generated)issueInvoice(state.finance,order,order.scenarioPrice,order.agreedTerms||14);else if(agreement?.net)issueInvoice(state.finance,order,agreement.net,agreement.terms);}}
  const due = processFinancialDay(state.finance,state.game.lastProcessedDate,state.game);
  for (const orderId of due) closePaidOrder(state.game, orderId, state.game.lastProcessedDate);
  const closedMonth = state.game.lastProcessedDate.slice(0, 7);
  if (state.game.closedMonths?.includes(closedMonth)) closeMonthlyPeriod(state.finance, state.game, closedMonth, state.game.lastProcessedDate);
  return state.game.lastProcessedDate;
}
function advanceWeek() {
  let workdays = 0;
  while (workdays < 5&&!state.finance.gameLost) {
    const date = state.game.date;
    processDay();
    if (isWorkday(date)) workdays += 1;
  }
  showToast(state.finance.gameLost?'Spiel verloren; die Zeit steht still.':'Fünf Arbeitstage wurden aufgelöst.');
  render();
}
app.addEventListener('click', event => {
  const recovery=event.target.closest('[data-recovery]');if(recovery){if(recovery.dataset.recovery==='restore'){recoveryMode=null;save();showToast('Letzte gültige Sicherung wiederhergestellt.');render();}else{state=freshState();recoveryMode=null;save();showToast('Neues Spiel am 01.01.2027 gestartet.');render();}return;}
  const view = event.target.closest('[data-view]');
  if (view) { state.view = view.dataset.view; render(); return; }
  const filter = event.target.closest('[data-filter]');
  if (filter) { state.filter = filter.dataset.filter; render(); return; }
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, order: orderId } = button.dataset;
  if(state.finance.gameLost&&['day','week','year'].includes(action)){showToast('Das Spiel ist verloren; starte ein neues Spiel, um fortzufahren.');return;}
  if (action === 'day') { const date = processDay(); showToast(`${formatDate(date)} abgeschlossen.`); render(); }
  if (action === 'week') advanceWeek();
  if(action==='year'){const target=String(Number(state.game.date.slice(0,4))+1)+'-'+state.game.date.slice(5);while(state.game.date<target&&!state.finance.gameLost)processDay();showToast(state.finance.gameLost?'Spiel im Simulationsjahr verloren.':'Ein komplettes Simulationsjahr abgeschlossen.');render();}
  if(action==='vacation'){const ok=scheduleVacationWeek(state.game,button.dataset.employee,state.game.date);showToast(ok?'Urlaubswoche geplant.':'Jahreskontingent ausgeschöpft.');render();}
  if(action==='pay-dispo'){const ok=drawForUnpaidCost(state.finance,button.dataset.cost,state.game.date);showToast(ok?'Vollzahlung mit manuellem Dispoabruf ausgeführt.':'Der freie Disporahmen reicht nicht für den vollständigen Fehlbetrag.');render();}
  if(action==='priority-up'||action==='priority-down'){reorderPaymentPriority(state.finance,button.dataset.cost,action==='priority-up'?-1:1);save();render();}
  if(action==='accept-offer'){const offer=state.game.orders.find(x=>x.id===orderId),agreement=state.agreements[orderId]||{},price=Number(agreement.net||estimateOrderEconomics(offer,state.game).suggestedNet),terms=Number(agreement.terms||14);if(acceptMarketOffer(state.game,orderId,price,terms)){state.agreements[orderId]={net:price,terms,source:'verhandeltes V1-Angebot'};showToast('Angebot angenommen; Preis und Zahlungsziel sind gespeichert.');render();}else showToast('Angebot oder Zahlungsziel ist ungültig.');}
  if(action==='decline-offer'){if(declineMarketOffer(state.game,orderId)){showToast('Angebot abgelehnt; keine Arbeitszeit oder Materialien gebunden.');render();}}
  if(action==='rework'){if(startRework(state.game,orderId)){showToast('Nacharbeit mit vier Qualitätsstunden eingeplant.');render();}}
  if(action==='cancel-rejected'){if(cancelRejectedOrder(state.game,orderId)){showToast('Auftrag storniert; bereits angefallene Kosten bleiben verbucht.');render();}}
  if(action==='pay-loan-dispo'){const ok=drawForMachineLoan(state.finance,state.game.date,state.game);showToast(ok?'Maschinenrate mit manuellem Dispoabruf vollständig gezahlt.':'Der freie Disporahmen reicht nicht für die vollständige Rate.');render();}
  if(action==='start-training'){const employeeId=document.querySelector('[data-training-employee]')?.value,courseId=document.querySelector('[data-training-course]')?.value,employee=state.game.employees.find(e=>e.id===employeeId);const ok=startContinuingEducation(state.game,employeeId,courseId);if(ok&&employee?.training)recordTrainingCost(state.finance,state.game.date,employee.training.name,employee.training.cost);showToast(ok?'Weiterbildung gebucht; die Person ist an Kurstagen nicht in der Produktion.':'Für diese Person läuft bereits ein Kurs.');render();}
  if(action==='start-apprenticeship'){const ok=startApprenticeship(state.game,document.querySelector('[data-trainer]')?.value);showToast(ok?'Ausbildungsverhältnis begonnen.':'Ein Platz ist belegt oder ein Start im Jahr 2027 ist erforderlich.');render();}
  if(action==='book-temp'){bookTemporaryWorker(state.game,{orderId:document.querySelector('[data-temp-order]')?.value,skill:document.querySelector('[data-temp-skill]')?.value||'CNC',hours:Number(document.querySelector('[data-temp-hours]')?.value||8),hourlyRate:Number(document.querySelector('[data-temp-rate]')?.value||45)});showToast('Zeitarbeit für heute gebucht.');render();}
  if (action === 'accept' || action === 'reject') {
    const order = state.game.orders.find(item => item.id === orderId);
    const done = action === 'accept' ? acceptOrder(state.game, order) : rejectOrder(state.game, order);
    if (done) { if (action === 'accept') registerInvoice(order); showToast(action === 'accept' ? 'Abnahme erfasst.' : 'Abnahme abgelehnt; Klärung erforderlich.'); render(); }
  }
  if (action === 'invoice') {
    const order = state.game.orders.find(item => item.id === orderId);
    const agreement = state.agreements[orderId];
    if (!agreement || !(Number(agreement.net) > 0)) { showToast('Bitte einen Szenario-Netto-Preis größer 0 eingeben.'); return; }
    if (registerInvoice(order)) render();
  }
});
document.querySelector('.bottom-nav').addEventListener('click', event => {
  const view = event.target.closest('[data-view]');
  if (!view) return;
  state.view = view.dataset.view;
  render();
});app.addEventListener('change', event => {
  const planInput=event.target.closest('[data-plan]');if(planInput){assignEmployee(state.game,planInput.dataset.plan,planInput.value||null);save();return;}
  const priorityInput=event.target.closest('[data-priority]');if(priorityInput){setOrderPriority(state.game,priorityInput.dataset.priority,priorityInput.value);render();return;}
  const scenarioInput=event.target.closest('[data-economic-scenario]');if(scenarioInput){state.game.macro.economicScenario=scenarioInput.value;save();render();return;}
  const rentInput=event.target.closest('[data-setting=rent]');if(rentInput){state.game.roomSettings.rent=Math.max(0,Number(rentInput.value));save();return;}
  const roomInput=event.target.closest('[data-room]');if(roomInput){state.game.roomSettings[roomInput.dataset.room]=Math.max(0,Number(roomInput.value));render();return;}
  const netInput = event.target.closest('[data-net]');
  const termsInput = event.target.closest('[data-terms]');
  if (!netInput && !termsInput) return;
  const id = netInput?.dataset.net || termsInput?.dataset.terms;
  state.agreements[id] ||= { net: '', terms: 14 };
  const order = state.game.orders.find(item => item.id === id);
  if (netInput) state.agreements[id].net = netInput.value;
  if (termsInput) state.agreements[id].terms = Number(termsInput.value);
  const issued = Boolean(netInput && order?.invoiceReadyAt && Number(state.agreements[id].net) > 0 && registerInvoice(order));
  save();
  if (issued || netInput) render();
});
document.querySelector('#resetButton').addEventListener('click', () => {
  if (!confirm('Spielstand und alle lokal gespeicherten Eingaben zurücksetzen?')) return;
  if(!recoveryMode)try{localStorage.setItem(BACKUP_KEY,JSON.stringify(state));}catch{}
  localStorage.removeItem(KEY);recoveryMode=null;
  state = freshState();
  showToast('Neues Spiel am 01.01.2027 gestartet.');
  render();
});
render();
