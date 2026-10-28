import { createLegacyInitialGame as createInitialGame, advanceOneDay, acceptMarketOffer, declineMarketOffer, closePaidOrder } from './engine.js';
import { createLegacyInitialFinance as createInitialFinance, issueInvoice, closeMonthlyPeriod, processFinancialDay, refreshOverdraftLimit, recordMaterialUse, recordMaterialPurchase } from './finance.js';
import { estimateOrderEconomics } from './economics.js';

const game=createInitialGame(),finance=createInitialFinance();
let madeDecision=false;
while(game.date<'2028-01-01') {
  for(const offer of game.orders.filter(o=>o.status==='ANGEBOT')) {
    if(!madeDecision) {
      const accepted=acceptMarketOffer(game,offer.id,estimateOrderEconomics(offer,game).suggestedNet,14);
      if(!accepted) throw new Error('Erstes Spielerangebot konnte im Stresslauf nicht entschieden werden');
      madeDecision=true;
    } else declineMarketOffer(game,offer.id);
  }
  const date=game.date,eventStart=game.events.length;
  refreshOverdraftLimit(finance,game,date);
  advanceOneDay(game);
  for(const event of game.events.slice(eventStart)) {
    if(event.kind==='MATERIALVERBRAUCH') {
      const order=game.orders.find(o=>o.id===event.orderId);
      if(order) recordMaterialUse(finance,game,order,event.date);
    }
    if(event.kind==='MATERIALZUGANG') recordMaterialPurchase(finance,event.materials,event.date,event.supplierId,game);
  }
  for(const order of game.orders) if(order.invoiceReadyAt&&!finance.invoices.some(i=>i.orderId===order.id)) {
    const net=Number(order.scenarioPrice);
    if(net>0) issueInvoice(finance,order,net,order.agreedTerms||14);
  }
  const paid=processFinancialDay(finance,game.lastProcessedDate,game);
  for(const id of paid) closePaidOrder(game,id,game.lastProcessedDate);
  if(game.closedMonths.includes(game.lastProcessedDate.slice(0,7))) closeMonthlyPeriod(finance,game,game.lastProcessedDate.slice(0,7),game.lastProcessedDate);
}

const liveCosts=finance.unpaidItems.filter(item=>!item.paidAt);
const maxRetryFailures=Math.max(0,...liveCosts.map(item=>item.retryFailures||0));
const lost=Boolean(finance.gameLost);
const result={date:game.date,opportunities:game.annualStats.marketOpportunities,offers:game.annualStats.ordersGenerated,won:game.annualStats.ordersWon,lostOffers:game.annualStats.ordersLost,delivered:game.orders.filter(o=>o.deliveredAt).length,cash:Number(finance.cash.toFixed(2)),unpaidCosts:Number(finance.unpaidCosts.toFixed(2)),unpaidItems:liveCosts.length,maxRetryFailures,gameLost:lost,lossReason:finance.lossReason||null,machineSeized:finance.machineSeized,loanBalance:finance.machineLoan};
console.log(JSON.stringify(result,null,2));
if(game.date!=='2028-01-01'||game.annualStats.ordersWon!==1||!Number.isFinite(finance.cash)||finance.unpaidCosts<0||maxRetryFailures!==8||!lost||!finance.machineSeized||liveCosts.some(item=>item.retryFailures>8)) throw new Error(`Ein-Auftrag-Stresslauf weicht vom erwarteten Verlustpfad ab: Retry=${maxRetryFailures}/8, gameLost=${lost}, machineSeized=${finance.machineSeized}`);
