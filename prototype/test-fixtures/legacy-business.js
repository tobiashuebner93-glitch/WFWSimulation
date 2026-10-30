// Historical 2027 company-state fixture for regression tests only. New game profiles
// use createInitialGame/createLegacyInitialGame and share the garage opening state.
import {createLegacyInitialGame,FACILITIES,STAFF,INITIAL_INVENTORY,INITIAL_INVENTORY_VALUE} from '../engine.js';
import {createLegacyInitialFinance} from '../finance.js';
const LEGACY_TEST_ORDERS = [
  { id:'ORD-START-01',customer:'K-01',name:'Großer Serienauftrag',quantity:20,dueDate:'2027-01-29',planningHours:5,materials:{steel:120,aluminium:60,parts:40},operations:[{id:10,name:'Materialbereitstellung',resource:'MA-PROD',skill:'PREP',totalHours:12},{id:20,name:'CNC-Fräsen',resource:'MA-CNC + CNC-01',skill:'CNC',totalHours:60,machineHours:60},{id:30,name:'Qualitätskontrolle',resource:'MA-CNC',skill:'QUALITY',totalHours:16},{id:40,name:'Verpackung und Versand',resource:'MA-PROD',skill:'PACK',totalHours:10}]},
  { id:'ORD-START-02',customer:'K-02',name:'Mittlerer Auftrag',quantity:8,dueDate:'2027-01-22',planningHours:3,materials:{steel:40,aluminium:20,parts:12},operations:[{id:10,name:'Materialbereitstellung',resource:'MA-PROD',skill:'PREP',totalHours:5},{id:20,name:'CNC-Fräsen',resource:'MA-CNC + CNC-01',skill:'CNC',totalHours:24,machineHours:24},{id:30,name:'Qualitätskontrolle',resource:'MA-CNC',skill:'QUALITY',totalHours:6},{id:40,name:'Verpackung und Versand',resource:'MA-PROD',skill:'PACK',totalHours:4}]},
  { id:'ORD-START-03',customer:'K-03',name:'Kleiner Präzisionsauftrag',quantity:2,dueDate:'2027-01-15',planningHours:2,materials:{steel:12,aluminium:10,parts:4},operations:[{id:10,name:'Materialbereitstellung',resource:'MA-PROD',skill:'PREP',totalHours:4},{id:20,name:'CNC-Fräsen',resource:'MA-CNC + CNC-01',skill:'CNC',totalHours:10,machineHours:10},{id:30,name:'Qualitätskontrolle',resource:'MA-CNC',skill:'QUALITY',totalHours:6},{id:40,name:'Verpackung und Versand',resource:'MA-PROD',skill:'PACK',totalHours:3}]},
];
const clone=value=>JSON.parse(JSON.stringify(value));
export function createLegacyBusinessTestGame(){
 const game=createLegacyInitialGame(),network=game.network;
 game.startProfile='legacy-test';game.startDate='2027-01-01';game.date='2027-01-01';game.dayNumber=0;
 game.orders=LEGACY_TEST_ORDERS.map(order=>{const customer=network.customers.find(x=>x.id===order.customer);return {...clone(order),customerName:customer?.name,paymentMoral:customer?.paymentMoral||80,paymentDelayDays:customer?.lateDays||0,planningDone:0,operationIndex:0,operationDone:0,consumed:false,status:'BESTÄTIGT',deliveredAt:null,acceptanceDue:null,acceptedAt:null,rejectedAt:null,invoiceReadyAt:null,closedAt:null,priority:0,generated:false};});
 game.inventory={...INITIAL_INVENTORY};game.initialInventory={...INITIAL_INVENTORY};
 game.employees=STAFF.map(person=>({...clone(person),morale:72,productivityBonus:0,competencies:{fach:78,methoden:72,sozial:70,individual:74},maxPotential:{fach:92,methoden:88,sozial:86,individual:90},qualifications:{machines:person.skill.includes('CNC')?['CNC-01']:[],trainer:false},vacationDaysUsed:0,vacationDaysTaken:[],sickUntil:null,vacationPlan:[]}));
 game.facility={...FACILITIES.find(x=>x.id==='site-3'),tenure:'rent'};
 game.roomSettings={rent:2400,warehouse:70,office:35,staff:35,workshop:180,storageUsed:32,officePeople:3,staffPeople:3,machineCount:1};
 game.network.companyReputation=68;game.network.companyPriceIndex=1;game.network.opportunities=0;game.network.awardedOrders=0;game.network.lostOrders=0;game.network.mailbox=[];game.network.preferredSuppliers={};
 game.events=[{date:game.date,phase:1,kind:'TEST_FIXTURE',text:'Historischer 2027-Unternehmensstand; nur für Regressionen.'}];
 return game;
}
export function createLegacyBusinessTestFinance(){
 const finance=createLegacyInitialFinance();
 Object.assign(finance,{cash:30000,initialCash:30000,openingReceivables:12500,openingPayables:7500,openingInventoryValue:INITIAL_INVENTORY_VALUE,openingInventory:{...INITIAL_INVENTORY},machineLoan:24000,openingEquity:Math.round((30000+12500+INITIAL_INVENTORY_VALUE-7500-24000)*100)/100,overdraftLimit:Math.round((30000+12500+INITIAL_INVENTORY_VALUE)*.1*100)/100,businessStartDate:'2027-01-01'});
 return finance;
}
