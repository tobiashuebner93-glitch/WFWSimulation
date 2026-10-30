import {createLegacyBusinessTestGame as createInitialGame, createLegacyBusinessTestFinance as createInitialFinance} from './test-fixtures/legacy-business.js';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {MARKETING_CAMPAIGNS,activateMarketingCampaign,setPreferredSupplier,advanceOneDay} from './engine.js';
import {recordMarketingCost,recordMaterialPurchase,closeMonthlyPeriod} from './finance.js';

// Marketing is a separate, finite decision cycle with a cash and P&L trail.
const game=createInitialGame(),finance=createInitialFinance(),campaign=MARKETING_CAMPAIGNS.find(x=>x.id==='targeted');
assert(activateMarketingCampaign(game,campaign.id));
assert.equal(game.network.marketingCampaign.id,campaign.id);
assert.equal(activateMarketingCampaign(game,campaign.id),false,'only one pending campaign may be active');
recordMarketingCost(finance,game.date,campaign);
assert.equal(finance.cash,30000-campaign.cost);
assert.equal(finance.expenses.filter(x=>x.type==='MARKETING').length,1);
const opportunityCount=game.network.opportunities;
while(game.network.opportunities===opportunityCount)advanceOneDay(game);
const effectEvent=game.events.find(e=>e.text.includes('Einladungschance'));
assert(effectEvent,'the next opportunity must report campaign effect even if it is not awarded');
assert.equal(game.network.marketingCampaign,null,'campaign is consumed exactly once');
for(let i=0;i<32;i++)advanceOneDay(game);
assert.equal(game.events.filter(e=>e.text.includes('Einladungschance')).length,1,'campaign cannot affect later opportunities');

// Preferred procurement choice controls the supplier on the actual purchase order.
const logistics=createInitialGame();
assert(setPreferredSupplier(logistics,'steel','L-02'));
assert.equal(setPreferredSupplier(logistics,'steel','L-03'),false,'ineligible supplier must be rejected');
logistics.inventory.steel=0;
logistics.inventory.aluminium=1000;
logistics.inventory.parts=1000;
logistics.orders[0].planningDone=logistics.orders[0].planningHours;
let purchaseOrder;
for(let i=0;i<15&&!purchaseOrder;i++){
  advanceOneDay(logistics);
  purchaseOrder=logistics.pendingMaterialOrders.find(p=>p.material==='steel');
}
assert(purchaseOrder,'shortage must create a procurement order');
assert.equal(purchaseOrder.supplierId,'L-02','player preference must drive supplier selection');
assert(purchaseOrder.dueDate>purchaseOrder.orderedAt,'supplier reliability still controls lead time');
const logisticsFinance=createInitialFinance();
const paidMaterialCost=recordMaterialPurchase(logisticsFinance,{steel:purchaseOrder.quantity},purchaseOrder.dueDate,purchaseOrder.supplierId,logistics);
assert(paidMaterialCost>0,'material receipt must create a financially traceable purchase');
assert.equal(logisticsFinance.expenses.find(x=>x.type==='MATERIAL')?.label,'Werkstoffkontor West');
assert.equal(logisticsFinance.expenses.find(x=>x.type==='MATERIAL')?.amount,paidMaterialCost);

// Campaign spend reconciles through the normal monthly expense summary.
const closeGame=createInitialGame();
const summary=closeMonthlyPeriod(finance,closeGame,'2027-01','2027-01-31');
const baselineSummary=closeMonthlyPeriod(createInitialFinance(),createInitialGame(),'2027-01','2027-01-31');
assert.equal(summary.marketingCost,campaign.cost);
assert.equal(summary.operatingExpenses-baselineSummary.operatingExpenses,campaign.cost);
assert.equal(summary.scenarioResult-baselineSummary.scenarioResult,-campaign.cost);
assert.equal(summary.cashReconciliation,0);
const appSource=await readFile(new URL('./app.js',import.meta.url),'utf8');
assert(appSource.includes('<details class="learning-tip"><summary>Fachwissen: Marketingmix'),'marketing tooltip must use native keyboard/touch details');
assert(appSource.includes('<details class="learning-tip"><summary>Fachwissen: Beschaffung'),'logistics tooltip must use native keyboard/touch details');
assert(appSource.includes('data-action="activate-campaign"'),'campaign choice must be actionable in the UI');
assert(appSource.includes('data-preferred-material="'),'preferred supplier choice must be available in the UI');

console.log(JSON.stringify({marketing:{campaign:campaign.id,cost:summary.marketingCost,events:game.events.filter(e=>e.kind==='MARKETING_AKTIVIERT'||e.text.includes('Marketingkampagne'))},logistics:{supplierId:purchaseOrder.supplierId,orderedAt:purchaseOrder.orderedAt,dueDate:purchaseOrder.dueDate,materialCost:paidMaterialCost,expense:logisticsFinance.expenses.find(x=>x.type==='MATERIAL')},monthly:{operatingExpenses:summary.operatingExpenses,scenarioResult:summary.scenarioResult,cashReconciliation:summary.cashReconciliation}},null,2));
