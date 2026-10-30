import assert from 'node:assert/strict';
import {createInitialGame,createLegacyInitialGame,migrateGameState} from './engine.js';
import {createInitialFinance,createLegacyInitialFinance,processMachineLoanDue} from './finance.js';
const g19=createInitialGame(),g27=createLegacyInitialGame(),f19=createInitialFinance(),f27=createLegacyInitialFinance();
const normalize=x=>JSON.parse(JSON.stringify(x).replaceAll('2019','YYYY').replaceAll('2027','YYYY'));
assert.deepEqual(normalize(g19),normalize(g27),'fresh game profiles differ beyond their start year');
assert.deepEqual(normalize(f19),normalize(f27),'fresh finance profiles differ beyond their start year');
assert.equal(g19.date,'2019-01-01');assert.equal(g27.date,'2027-01-01');
assert.equal(f19.businessStartDate,'2019-01-01');assert.equal(f27.businessStartDate,'2027-01-01');
for (const [g,f] of [[g19,f19],[g27,f27]]) {assert.equal(f.cash,10000);assert.equal(f.openingReceivables,0);assert.equal(f.openingPayables,0);assert.equal(f.machineLoan,0);assert.equal(f.openingInventoryValue,0);assert.equal(g.orders.length,0);assert.equal(g.employees.length,1);assert.equal(g.inventory.steel+g.inventory.aluminium+g.inventory.parts,0);assert.equal(g.startProfile,'garage');}
const loan19=createInitialFinance();loan19.machineLoan=24000;loan19.cash=100000;assert.equal(processMachineLoanDue(loan19,'2019-01-30',{startDate:'2019-01-01'}),false);assert.equal(processMachineLoanDue(loan19,'2019-01-31',{startDate:'2019-01-01'}),true);assert.equal(loan19.loanInstallmentsDue,1);const loan27=createLegacyInitialFinance();loan27.machineLoan=24000;loan27.cash=100000;assert.equal(processMachineLoanDue(loan27,'2027-01-29',{startDate:'2027-01-01'}),true);assert.equal(loan27.loanInstallmentsDue,1);const legacySave={date:'2027-02-01',startDate:'2027-01-01',startProfile:'legacy-company',employees:[],inventory:{},network:{},roomSettings:{}};migrateGameState(legacySave);assert.equal(legacySave.startProfile,'legacy-company','migration must preserve an existing save profile');assert.equal(legacySave.startDate,'2027-01-01');console.log('profiles equivalent except start year; relative loan date and migration preservation passed');
