import assert from 'node:assert/strict';
import { createInitialGame, advanceOneDay, assignEmployeeToStage, createMaterialProcurement, assignEmployeeToTask, scheduleShippingTask } from './engine.js';
import { EQUIPMENT_CATALOG, buyEquipment, equipmentSatisfiesTool } from './equipment.js';
import { createInitialFinance, recordMaterialPurchase, repayLoanEarly } from './finance.js';

const game=createInitialGame();
const finance=createInitialFinance();
finance.cash=10000;
const bench=EQUIPMENT_CATALOG.find(x=>x.id==='workbench-10');
assert.ok(buyEquipment(game,finance,bench.id).ok,'Industrie-Werkbank sollte gekauft werden können.');
assert.equal(equipmentSatisfiesTool(game,'bench-clamp-set'),true,'Eine gekaufte Werkbank samt Spannmittel erfüllt die passende Spannmittel-Anforderung.');
assert.equal(equipmentSatisfiesTool(game,'cnc-metrology-kit'),false,'Eine Werkbank ersetzt weder CNC-Maschine noch CNC-Prüfmittel.');

game.date='2019-01-02';
game.employees.push({id:'BASIC-1',name:'Fachkraft',role:'Fertigung',skill:['BASIC'],morale:75,motivation:75,competencies:{fach:70,methoden:70,sozial:70,individual:70},maxPotential:{fach:90,methoden:90,sozial:90,individual:90},qualifications:{machines:[]},vacationPlan:[],sickUntil:null});
const order={id:'T0045-ORDER',name:'Spannmodul',quantity:1,status:'BESTÄTIGT',generated:true,dueDate:'2019-02-01',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,consumed:false,materials:{steel:0,aluminium:0,parts:0},requiredToolId:'bench-clamp-set',requiredToolSkill:'BASIC',operations:[{id:10,name:'Materialbereitstellung',skill:'PREP',totalHours:9},{id:20,name:'Manuelle Bearbeitung',skill:'BASIC',totalHours:1},{id:30,name:'Verpackung',skill:'PACK',totalHours:1}]};
game.orders.push(order);const nextOrder={id:'T0045-ORDER-2',name:'Folgeauftrag',quantity:1,status:'BESTÄTIGT',generated:true,dueDate:'2019-02-01',planningHours:0,planningDone:0,operationIndex:0,operationDone:0,consumed:false,materials:{steel:0,aluminium:0,parts:0},operations:[{id:10,name:'Bereitstellung',skill:'PREP',totalHours:1},{id:20,name:'Verpackung',skill:'PACK',totalHours:1}]};game.orders.push(nextOrder);
assert.equal(assignEmployeeToStage(game,'OWNER',order.id,0),true);
assert.equal(assignEmployeeToStage(game,'BASIC-1',order.id,1),true,'Die spätere Zuweisung darf vorgemerkt werden.');
advanceOneDay(game);
assert.equal(order.operationIndex,0,'Der nächste Arbeitsschritt darf vor Abschluss der Materialbereitstellung nicht beginnen.');
assert.equal(order.operationDone,8);
advanceOneDay(game);
assert.equal(order.operationIndex,3,'Nach Abschluss läuft die Folgearbeit mit qualifiziertem Personal weiter.');
assert.equal(order.status,'VERSANDBEREIT');assert.equal(nextOrder.operationIndex,2,'Nach Auftragsabschluss kann der Mitarbeiter den Folgeauftrag am selben Tag übernehmen.');

const localProc=createInitialGame();localProc.date='2019-01-02';const localTask=createMaterialProcurement(localProc,'steel',20,'hardware-store');assert.ok(localTask.ok);assert.equal(localProc.inventory.steel,0,'Baumarktware wird erst nach eingeplanter Einkaufszeit verfügbar.');assert.equal(assignEmployeeToTask(localProc,'OWNER',localTask.task.id),true);advanceOneDay(localProc);assert.equal(localProc.inventory.steel,20,'Abgeschlossener Einkauf übernimmt den Bestand.');
const onlineProc=createInitialGame();onlineProc.date='2019-01-02';const onlineSupplier=onlineProc.network.suppliers.find(x=>x.channel==='online'&&x.materials.includes('steel'));assert.equal(createMaterialProcurement(onlineProc,'steel',50,onlineSupplier.id).ok,false,'Online-Mindestmenge muss eingehalten werden.');const onlineOrder=createMaterialProcurement(onlineProc,'steel',onlineSupplier.minimumOrder.steel,onlineSupplier.id);assert.ok(onlineOrder.ok);while(onlineProc.date<=onlineOrder.order.dueDate)advanceOneDay(onlineProc);assert.ok(onlineProc.events.some(e=>e.kind==='MATERIALZUGANG'&&e.alreadyPaid===true),'Vorab bezahlte Onlinebestellung darf bei Ankunft nicht erneut berechnet werden.');const receipt=onlineProc.plannedTasks.find(t=>t.kind==='WARENANNAHME');assert.ok(receipt,'Lieferankunft erzeugt eine Warenannahmeaufgabe.');assert.equal(onlineProc.inventory.steel,0);assert.equal(assignEmployeeToTask(onlineProc,'OWNER',receipt.id),true);advanceOneDay(onlineProc);assert.equal(onlineProc.inventory.steel,onlineOrder.order.quantity);
const shipping=createInitialGame();shipping.date='2019-01-02';const ready={id:'T0045-SHIP',name:'Versandtest',quantity:1,status:'VERSANDBEREIT',producedAt:shipping.date,acceptanceDue:null,operations:[],materials:{steel:0,aluminium:0,parts:0}};shipping.orders.push(ready);assert.equal(scheduleShippingTask(shipping,ready.id),true);const shippingTask=shipping.plannedTasks[0];assert.equal(assignEmployeeToTask(shipping,'OWNER',shippingTask.id),true);advanceOneDay(shipping);assert.equal(ready.status,'GELIEFERT','Versand wird nach geplantem Arbeitseinsatz ausgeführt.');const supplierGame=createInitialGame(),supplier=supplierGame.network.suppliers.find(x=>x.channel==='online'&&x.materials.includes('steel'));
supplier.relationship=100;
const lowOrderFinance=createInitialFinance(),bulkFinance=createInitialFinance();
lowOrderFinance.cash=bulkFinance.cash=100000;
recordMaterialPurchase(lowOrderFinance,{steel:50},supplierGame.date,supplier.id,supplierGame,0);
recordMaterialPurchase(bulkFinance,{steel:1000},supplierGame.date,supplier.id,supplierGame,0);
assert.ok(bulkFinance.materialPurchases/1000<lowOrderFinance.materialPurchases/50,'Mengen- und Beziehungsrabatte müssen bei Online-Lieferanten wirken.');

const payoff=createInitialFinance();payoff.cash=4000;payoff.equipmentLoans=[{id:'EQ-TEST',assetId:'A-1',balance:1500,nextDueDate:'2019-02-28'}];
assert.equal(repayLoanEarly(payoff,'equipment','EQ-TEST','2019-01-02'),true);
assert.equal(payoff.equipmentLoans[0].balance,0);
assert.equal(payoff.cash,2500);
assert.equal(repayLoanEarly(payoff,'equipment','EQ-TEST','2019-01-02'),false,'Ablösung darf kein bereits erledigtes Darlehen erneut belasten.');

console.log('T-0045 operational regression checks passed');
