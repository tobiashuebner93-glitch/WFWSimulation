import assert from 'node:assert/strict';
import { createInitialGame, advanceOneDay, acceptMarketOffer, rentHardwareTool, HARDWARE_TOOL_RENTALS, isWorkday, getSpaceUse, shipOrder } from './engine.js';
import { createInitialFinance } from './finance.js';
import { EQUIPMENT_CATALOG, buyEquipment, equipmentTaxAmount, equipmentGrossPrice } from './equipment.js';

const equipmentGame=createInitialGame(),equipmentFinance=createInitialFinance(),pc=EQUIPMENT_CATALOG.find(item=>item.id==='special-tools-1'),equipmentBuy=buyEquipment(equipmentGame,equipmentFinance,pc.id);assert.equal(equipmentBuy.ok,true);assert.equal(equipmentBuy.tax,equipmentTaxAmount(pc.price));assert.equal(equipmentBuy.grossPrice,equipmentGrossPrice(pc.price));assert.equal(equipmentBuy.asset.bookValue,pc.price,'Asset book value stays net of SimTAX');assert.equal(equipmentFinance.cash,10000-equipmentGrossPrice(pc.price),'Cash pays gross purchase price');assert.equal(equipmentFinance.taxPeriods[0].inputTax,equipmentTaxAmount(pc.price),'Input SimTAX is recorded separately');
const game=createInitialGame();
const weekdaySet=new Set();
for(let i=0;i<45;i++){
  advanceOneDay(game);
  for(const order of game.orders){
    if(order.offerDate===game.lastProcessedDate)weekdaySet.add(new Date(`${order.offerDate}T12:00:00Z`).getUTCDay());
  }
}
assert.ok(weekdaySet.size>=3,'Anfragen sollten über mehrere Wochentage verteilt eintreffen.');
const incoming=game.orders.find(o=>o.status==='ANGEBOT');
assert.ok(incoming,'Der Markt sollte eine beantwortbare Anfrage erzeugen.');
const expiryLength=Math.round((new Date(`${incoming.offerExpiresAt}T12:00:00Z`)-new Date(`${incoming.offerDate}T12:00:00Z`))/86400000);
assert.ok(expiryLength>=3&&expiryLength<=5,'Anfragen bleiben 3–5 Kalendertage offen.');
const submittedAt=game.date;
assert.equal(acceptMarketOffer(game,incoming.id,10000,14),true);
assert.equal(incoming.status,'ANGEBOT_EINGEREICHT');
assert.ok(incoming.decisionDueDate>submittedAt);
const responseDays=Math.round((new Date(`${incoming.decisionDueDate}T12:00:00Z`)-new Date(`${submittedAt}T12:00:00Z`))/86400000);
assert.ok(responseDays>=1&&responseDays<=3);
for(let i=0;i<3&&incoming.status==='ANGEBOT_EINGEREICHT';i++)advanceOneDay(game);
assert.notEqual(incoming.status,'ANGEBOT_EINGEREICHT','Kundenentscheidung sollte fristgerecht aufgelöst werden.');
assert.ok(HARDWARE_TOOL_RENTALS.length>=1);
assert.equal(rentHardwareTool(game,HARDWARE_TOOL_RENTALS[0].id,2),null,'Werkzeuge dürfen ohne passenden aktiven Spezialauftrag nicht gemietet werden.');
game.orders.push({id:'ORD-TOOL-TEST',generated:true,status:'BESTÄTIGT',requiredToolId:HARDWARE_TOOL_RENTALS[0].id});
const rental=rentHardwareTool(game,HARDWARE_TOOL_RENTALS[0].id,2);
assert.ok(rental&&rental.returnDate>=rental.startedAt);
assert.equal(game.network.suppliers.find(x=>x.id==='hardware-store')?.name,'Baumarkt');

const local=createInitialGame();local.date='2019-01-02';local.orders.push({id:'ORD-LOCAL',status:'BESTÄTIGT',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,operations:[{id:10,skill:'PREP',totalHours:1}],materials:{steel:20,aluminium:0,parts:0},consumed:false});
advanceOneDay(local);
assert.ok(local.events.some(e=>e.kind==='MATERIALZUGANG'&&e.supplierId==='hardware-store'&&e.materials.steel===20),'small urgent quantities should use immediate local Baumarkt stock');
assert.equal(local.pendingMaterialOrders.length,0);

const online=createInitialGame();online.date='2019-01-02';online.inventory.steel=0;online.network.preferredSuppliers.steel='L-01';online.orders.push({id:'ORD-ONLINE',status:'BESTÄTIGT',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,operations:[{id:10,skill:'PREP',totalHours:1}],materials:{steel:300,aluminium:0,parts:0},consumed:false});
advanceOneDay(online);
const po=online.pendingMaterialOrders[0];
assert.ok(po&&po.dueDate>'2019-01-02','online material must arrive after the order date');
assert.ok(po.shippingFee>0,'online material orders include shipping costs');
assert.equal(online.inventory.steel,0,'online material is not available before delivery');

const finished=createInitialGame();finished.date='2019-01-02';finished.orders.push({id:'ORD-STOCK',name:'Fertigware-Test',quantity:10,status:'BESTÄTIGT',dueDate:'2019-02-01',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,operations:[{id:20,skill:'PREP',totalHours:1}],materials:{steel:0,aluminium:0,parts:0},consumed:true});
advanceOneDay(finished);
const ready=finished.orders.find(o=>o.id==='ORD-STOCK');
assert.equal(ready.status,'VERSANDBEREIT');
assert.ok(getSpaceUse(finished).finishedGoods>0,'finished goods occupy warehouse space until shipment');
assert.equal(shipOrder(finished,ready.id),true);
assert.equal(getSpaceUse(finished).finishedGoods,0,'shipment frees finished-goods warehouse space');
console.log(JSON.stringify({weekdays:[...weekdaySet],expiryDays:expiryLength,responseDays,rentalReturn:rental.returnDate,localImmediateStock:20,onlineDueDate:po.dueDate,shippingFee:po.shippingFee,finishedGoodsUntilShipment:true},null,2));
