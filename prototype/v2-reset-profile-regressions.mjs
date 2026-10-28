import assert from 'node:assert/strict';
import { createInitialGame, advanceOneDay, FACILITIES, MACHINE_RENTALS, HARDWARE_TOOL_RENTALS, acceptMarketOffer, shipOrder, closePaidOrder, negotiateTemporaryAgency, bookTemporaryWorker, assignEmployee, rentMachine, rentHardwareTool, startContinuingEducation, startApprenticeship } from './engine.js';
import { createInitialFinance, closeMonthlyPeriod, issueInvoice, processFinancialDay, recordMaterialPurchase, recordMaterialUse, recordToolRental } from './finance.js';
import { estimateOrderEconomics } from './economics.js';

const game=createInitialGame(),finance=createInitialFinance();
assert.equal(game.date,'2019-01-01');
assert.equal(finance.cash,10000);
assert.equal(game.inventory.steel+game.inventory.aluminium+game.inventory.parts,0);
assert.equal(game.employees.length,1);
assert.ok(game.employees[0].isOwner&&!game.employees[0].qualifications.machines.includes('CNC-01'));
assert.equal(game.facility.tenure,'rent');
assert.ok(game.roomSettings.rent>0);
assert.equal(game.ownerToolKit.name,'Werkbank und Baumarkt-Handwerkzeug');
assert.equal(FACILITIES.filter(x=>x.tenureOptions.includes('rent')).length,10);
assert.equal(FACILITIES.filter(x=>x.tenureOptions.includes('purchase')).length,10);
assert.ok(MACHINE_RENTALS.length>=2);
advanceOneDay(game);
assert.equal(game.mailbox[0].type,'MARKTBERICHT');
assert.equal(game.mailbox[0].priceBands.length,3);
assert.ok(game.network.suppliers.every(s=>Object.values(s.minimumOrder).every(n=>n>0)));
game.orders.push({id:'ORD-V2-GUARANTEED',name:'Werkbank-Erstauftrag',customer:'K-01',customerName:'Testkunde',status:'BESTÄTIGT',dueDate:'2019-02-01',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,operations:[{id:10,name:'Handarbeit',skill:'BASIC',totalHours:4}],materials:{steel:0,aluminium:0,parts:0},scenarioPrice:600,agreedTerms:14,deliveredAt:null,acceptedAt:null,rejectedAt:null,invoiceReadyAt:null,closedAt:null,priority:0});

const planning=createInitialGame();
planning.orders.push({id:'V2-A',name:'Werkbankauftrag',status:'BESTÄTIGT',planningHours:1,planningDone:0,operationIndex:0,operations:[{id:10,skill:'BASIC',totalHours:1}],materials:{steel:0,aluminium:0,parts:0}});
assignEmployee(planning,'OWNER','V2-A');
assert.equal(planning.workPlan[planning.date].OWNER,'V2-A');
assignEmployee(planning,'OWNER',null);
assert.equal(planning.workPlan[planning.date].OWNER,undefined,'AUTO clears a manual assignment');
const followOn=createInitialGame();followOn.date='2019-01-02';followOn.orders=[{id:'V2-CLOSED',name:'Beendeter Auftrag',status:'ABGESCHLOSSEN',closedAt:'2019-01-01',planningHours:0,planningDone:0,operationIndex:0,operations:[{id:10,skill:'BASIC',totalHours:1}],materials:{steel:0,aluminium:0,parts:0}},{id:'V2-NEXT',name:'Folgeauftrag',status:'BESTÄTIGT',dueDate:'2019-02-01',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,operations:[{id:20,skill:'BASIC',totalHours:2}],materials:{steel:0,aluminium:0,parts:0},consumed:true}];assignEmployee(followOn,'OWNER','V2-CLOSED');advanceOneDay(followOn);assert.ok(followOn.workLog.some(w=>w.orderId==='V2-NEXT'),'a worker whose previous assignment is closed proceeds to the next eligible order');
assert.equal(rentMachine(planning,'cnc-compact'),false,'garage is too small for CNC rent');
assert.equal(startContinuingEducation(planning,'OWNER','CNC-BASIC'),true,'the owner can gain a machine qualification through training');
const trained=createInitialGame();trained.employees[0].trainerQualified=true;assert.equal(startApprenticeship(trained,'OWNER'),true,'the 2019 profile supports vocational training with a qualified trainer');

const agency=createInitialGame();assert.equal(negotiateTemporaryAgency(agency,'balanced'),true);assert.equal(bookTemporaryWorker(agency,{skill:'PREP',count:3,duration:'week'}),null,'booking cannot exceed garage workplace capacity');

let negativeContributionFound=false,competitorPriceLeaked=false;
while(game.date<'2020-01-01'){
  const today=game.date,eventIndex=game.events.length;
  advanceOneDay(game);
  for(const o of game.orders.filter(x=>x.status==='VERSANDBEREIT'))shipOrder(game,o.id);
  const dayEvents=game.events.slice(eventIndex);
  for(const e of dayEvents){
    if(e.kind==='MATERIALZUGANG')recordMaterialPurchase(finance,e.materials,e.date,e.supplierId,game,e.shippingFee||0);
    if(e.kind==='MATERIALVERBRAUCH'){const o=game.orders.find(x=>x.id===e.orderId);if(o)recordMaterialUse(finance,game,o,e.date);}
  }
  for(const o of game.orders.filter(x=>x.status==='ANGEBOT')){
    const economics=estimateOrderEconomics(o,game);
    negativeContributionFound ||= economics.contribution<0;
    if((o.competitorQuotes||[]).length){const rival=o.competitorQuotes[0];acceptMarketOffer(game,o.id,Math.max(1,o.marketReferenceNet*.7),14);}
    else acceptMarketOffer(game,o.id,economics.suggestedNet,14);
  }
  for(const o of game.orders.filter(x=>x.requiredToolId&&!x.closedAt&&!x.deliveredAt&&!['ANGEBOT','ANGEBOT_EINGEREICHT','ANGEBOT_ABGELAUFEN','MARKT_VERLOREN'].includes(x.status))){
    const rented=(game.rentedTools||[]).some(r=>r.toolId===o.requiredToolId&&r.status==='GEBUCHT'&&r.returnDate>=game.date);
    if(!rented){const rental=rentHardwareTool(game,o.requiredToolId,3);if(rental)recordToolRental(finance,game.date,rental);}
  }
  for(const o of game.orders){
    if(o.invoiceReadyAt&&!finance.invoices.some(i=>i.orderId===o.id))issueInvoice(finance,o,o.scenarioPrice||Math.max(1,o.marketReferenceNet||100),o.agreedTerms||14);
  }
  const paid=processFinancialDay(finance,game.lastProcessedDate,game);
  for(const id of paid)closePaidOrder(game,id,game.lastProcessedDate);
  if(game.closedMonths.includes(game.lastProcessedDate.slice(0,7)))closeMonthlyPeriod(finance,game,game.lastProcessedDate.slice(0,7),game.lastProcessedDate);
  competitorPriceLeaked ||= game.events.some(e=>e.date===today&&/gewinnt mit .*€ netto/i.test(e.text||''));
}
assert.equal(game.date,'2020-01-01');
assert.ok(game.annualStats.ordersGenerated>0,'customer inquiries are generated through the year');
assert.ok(game.mailbox.some(m=>m.type==='KUNDENANFRAGE'));
assert.equal(game.mailbox.filter(m=>m.type==='MARKTBERICHT').length,12);
assert.equal(finance.monthlyClosings.length,12);
assert.ok(finance.monthlyClosings.every(m=>m.privateWithdrawal===1695));
assert.ok(finance.monthlyClosings.some(m=>m.bab.totalOverhead>0),'BAB reflects realized site costs');
assert.ok(finance.monthlyClosings.some(m=>m.bab.labourHours>0),'BAB uses realized labor logs');
assert.equal(competitorPriceLeaked,false);
assert.ok(negativeContributionFound,'generated opportunities include an uneconomic scenario for contribution-margin learning');
assert.ok(finance.invoices.length>0);
console.log(JSON.stringify({date:game.date,generated:game.annualStats.ordersGenerated,closedOrders:game.annualStats.ordersClosed,mail:game.mailbox.length,monthlyReports:game.mailbox.filter(m=>m.type==='MARKTBERICHT').length,monthlyClosings:finance.monthlyClosings.length,babHours:finance.monthlyClosings.reduce((sum,x)=>sum+x.bab.labourHours,0),privateWithdrawals:finance.privateWithdrawals.length,negativeContributionFound,competitorPriceLeaked,endingCash:finance.cash},null,2));
