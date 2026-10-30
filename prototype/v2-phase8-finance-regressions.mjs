import assert from 'node:assert/strict';
import { createInitialFinance, issueInvoice, processFinancialDay, drawForMachineLoan } from './finance.js';
import { createInitialGame } from './engine.js';

const date='2027-01-29';
function makeFinance(cash=0){const finance=createInitialFinance();finance.cash=cash;finance.initialCash=cash;finance.events=[];finance.cashMovements=[];return finance;}
function addTax(finance,month,dueDate,amount,{firstFailedAt=null,reminderDate=null,formalNoticeDate=null}={}){finance.taxPeriods.push({month,outputTax:amount,inputTax:0,creditBroughtForward:0,creditCarriedForward:0,amount,dueDate,paidAt:null,settledAt:null,firstFailedAt,reminderDate,formalNoticeDate,reminderAt:null,formalNoticeAt:null,retryFailures:0});}
function eventIndex(finance,kind){return finance.events.findIndex(event=>event.kind===kind);}

// 1. Same-day priority across every due payment type.
const sameDay=makeFinance(2000), sameGame=createInitialGame();
sameDay.overdraftLimit=1000;sameDay.overdraftDrawn=40;sameDay.machineLoan=24000;
sameDay.propertyLoan={balance:1000,rate:.12,monthlyInstallment:100,nextDueDate:date,installmentsPaid:0};
sameDay.equipmentLoans=[{id:'EQ-SAME',balance:1000,rate:.12,monthlyPayment:100,nextDueDate:date,monthsRemaining:12}];
sameDay.invoices=[{id:'RE-100',orderId:'ORDER-100',gross:100,status:'OFFEN',paymentDate:date,dueDate:date},{id:'RE-200',orderId:'ORDER-200',gross:50,status:'OFFEN',paymentDate:date,dueDate:date}];
sameDay.unpaidItems=[{id:'COST-SAME',date:'2027-01-20',type:'LIEFERANT',label:'Lieferantenposten',amount:50,nextRetryDate:date,reminderDate:date,formalNoticeDate:date,firstFailedAt:'2027-01-10',retryFailures:0,status:'ERINNERT'},{id:'COST-REMINDER',date:'2027-01-20',type:'LIEFERANT',label:'Erinnerungsposten',amount:5000,nextRetryDate:date,reminderDate:date,formalNoticeDate:date,firstFailedAt:'2027-01-10',retryFailures:0,status:'OFFEN'}];sameDay.unpaidCosts=5050;sameDay.paymentPriority=['COST-SAME'];
addTax(sameDay,'2026-12',date,20);
const paidSameDay=processFinancialDay(sameDay,date,sameGame),kinds=sameDay.events.map(event=>event.kind);
assert.deepEqual(paidSameDay,['ORDER-100','ORDER-200']);
const receipt=kinds.indexOf('KUNDENEINGANG'),machine=kinds.indexOf('MASCHINENRATE'),property=kinds.indexOf('IMMOBILIENRATE'),equipment=kinds.indexOf('ANLAGENRATE'),cost=kinds.indexOf('KOSTEN_RETRY_BEZAHLT'),tax=kinds.indexOf('SIMTAX_ZAHLUNG'),reminder=kinds.indexOf('ZAHLUNGSERINNERUNG');
assert(receipt>=0&&receipt<machine&&machine<property&&property<equipment&&equipment<cost&&cost<tax&&tax<reminder,'Phase 8 did not preserve D-0160 order');
assert.equal(sameDay.overdraftDrawn,0,'customer receipt must repay overdraft first');
assert.equal(sameDay.cash,1500.79,'cash result after all ordered same-day payments is incorrect');
assert.equal(sameDay.unpaidItems[0].status,'BEZAHLT','paid item must not be overwritten by reminder status');
assert(!sameDay.unpaidItems[0].reminderAt,'paid item must not receive same-day reminder');
assert.equal(sameDay.monthlyClosings.length,0,'daily processing must not close a month');
assert.equal(sameDay.initialCash+sameDay.cashMovements.reduce((sum,item)=>sum+item.amount,0),sameDay.cash,'same-day cash movements must reconcile');

// 2. Tight liquidity: receipts repay overdraft, then full fixed rates by priority; no partial payment/negative cash/auto draw.
const tight=makeFinance(0),tightGame=createInitialGame();tight.overdraftLimit=1000;tight.overdraftDrawn=60;tight.machineLoan=24000;
tight.propertyLoan={balance:1000,rate:.12,monthlyInstallment:100,nextDueDate:date,installmentsPaid:0};
tight.equipmentLoans=[{id:'EQ-TIGHT',balance:1000,rate:.12,monthlyPayment:100,nextDueDate:date,monthsRemaining:12}];
tight.invoices=[{id:'RE-TIGHT',orderId:'ORDER-TIGHT',gross:400,status:'OFFEN',paymentDate:date,dueDate:date}];
addTax(tight,'2026-12',date,20);
processFinancialDay(tight,date,tightGame);
assert.equal(tight.overdraftDrawn,0);assert.equal(tight.cash,.79);
assert.equal(tight.loanInstallmentsPaid,1);assert.equal(tight.propertyLoan.installmentsPaid,0);assert.equal(tight.equipmentLoans[0].balance,1000);
assert(tight.cash>=0);assert.equal(tight.cashMovements.filter(x=>x.kind==='IMMOBILIENRATE'||x.kind==='ANLAGENRATE'||x.kind==='SimTAX').length,0,'later payments must remain wholly unpaid');
assert(!tight.events.some(x=>x.kind==='DISPOZIEHUNG'||x.kind==='DISPO_MANUELLER_ZAHLUNG'),'no automatic overdraft draw is allowed');

// 3. D-0125 boundary: processing does not auto-draw; existing machine-rate manual draw remains supported; no rate expansion.
const draw=makeFinance(0),drawGame=createInitialGame();draw.overdraftLimit=1000;draw.machineLoan=24000;
draw.propertyLoan={balance:1000,rate:.12,monthlyInstallment:100,nextDueDate:date,installmentsPaid:0};draw.equipmentLoans=[{id:'EQ-DRAW',balance:1000,rate:.12,monthlyPayment:100,nextDueDate:date,monthsRemaining:12}];
processFinancialDay(draw,date,drawGame);assert.equal(draw.overdraftDrawn,0);assert.equal(draw.cash,0);
assert.equal(draw.propertyLoan.installmentsPaid,0);assert.equal(draw.equipmentLoans[0].balance,1000);
assert.equal(drawForMachineLoan(draw,'2027-01-30',drawGame),true,'existing supported manual machine-rate draw must remain available');
assert.equal(draw.overdraftDrawn,339.21);assert.equal(draw.machineArrears.length,0);

// 4. Credit-specific weekly retry behavior is preserved and retried on the due effective date.
const retry=makeFinance(0),retryGame=createInitialGame();retry.machineLoan=24000;
retry.propertyLoan={balance:1000,rate:.12,monthlyInstallment:100,nextDueDate:date,installmentsPaid:0};
retry.equipmentLoans=[{id:'EQ-RETRY',balance:1000,rate:.12,monthlyPayment:100,nextDueDate:date,monthsRemaining:12}];
processFinancialDay(retry,date,retryGame);
const machineRetry=retry.machineArrears[0].nextRetryDate,propertyRetry=retry.propertyLoan.nextDueDate,equipmentRetry=retry.equipmentLoans[0].nextDueDate;
assert.equal(machineRetry,'2027-02-05');assert.equal(propertyRetry,'2027-02-05');assert.equal(equipmentRetry,'2027-02-05');
retry.cash=1000;retry.initialCash=1000;processFinancialDay(retry,'2027-02-05',retryGame);
assert.equal(retry.machineArrears.length,0);assert.equal(retry.propertyLoan.installmentsPaid,1);assert.equal(retry.equipmentLoans[0].monthsRemaining,11);
assert(retry.events.filter(x=>['MASCHINENRATE','IMMOBILIENRATE','ANLAGENRATE'].includes(x.kind)).every(x=>x.date==='2027-02-05'));
assert.equal(retry.machineSeized,false,'one missed installment must not trigger machine liquidation');

// 5. Reminder/status updates run after every same-day payment attempt and omit paid items.
const notices=makeFinance(100),noticeGame=createInitialGame();
notices.unpaidItems=[
 {id:'PAID-BEFORE-REMINDER',date:'2027-01-10',type:'COST',label:'bezahlt',amount:30,nextRetryDate:date,reminderDate:date,formalNoticeDate:date,firstFailedAt:'2027-01-01',retryFailures:0,status:'OFFEN'},
 {id:'STILL-OPEN',date:'2027-01-10',type:'COST',label:'offen',amount:200,nextRetryDate:date,reminderDate:date,formalNoticeDate:date,firstFailedAt:'2027-01-01',retryFailures:0,status:'OFFEN'}];notices.unpaidCosts=230;
addTax(notices,'2026-12',date,10,{firstFailedAt:'2027-01-01',reminderDate:date,formalNoticeDate:date});
processFinancialDay(notices,date,noticeGame);
const noticeKinds=notices.events.map(x=>x.kind),lastPayment=Math.max(...['KOSTEN_RETRY_BEZAHLT','SIMTAX_FEHLER','SIMTAX_ZAHLUNG'].map(k=>noticeKinds.lastIndexOf(k)));
assert(noticeKinds.indexOf('ZAHLUNGSERINNERUNG')>lastPayment,'reminders must be emitted after payment attempts');
assert.equal(notices.unpaidItems[0].status,'BEZAHLT');assert(!notices.unpaidItems[0].reminderAt);
assert.equal(notices.unpaidItems[1].status,'GEMAHNT','both due notices should settle in the final status phase');

// 6. Effective date controls posting period; repeated date processing is idempotent and cash reconciles.
const effective=makeFinance(1000),effectiveGame=createInitialGame();effective.overdraftDrawn=20;effective.overdraftRate=.365;
effective.propertyLoan={balance:1000,rate:.12,monthlyInstallment:100,nextDueDate:'2027-02-01',installmentsPaid:0};
effective.equipmentLoans=[{id:'EQ-EFFECTIVE',balance:1000,rate:.12,monthlyPayment:100,nextDueDate:'2027-02-01',monthsRemaining:12}];
processFinancialDay(effective,'2027-02-01',effectiveGame);processFinancialDay(effective,'2027-02-01',effectiveGame);
assert.equal(effective.cash,800);assert.equal(effective.cashMovements.reduce((sum,item)=>sum+item.amount,0),-200);
assert.equal(effective.initialCash+effective.cashMovements.reduce((sum,item)=>sum+item.amount,0),effective.cash);
assert.equal(effective.propertyLoanPaymentsByMonth['2027-02'],100);assert.equal(effective.equipmentInterestByMonth['2027-02'],10);
assert.equal(effective.events.filter(x=>x.kind==='IMMOBILIENRATE').length,1);assert.equal(effective.events.filter(x=>x.kind==='ANLAGENRATE').length,1);
assert(Math.abs(effective.overdraftInterestAccrued-.02)<1e-10,'daily interest accrual must be idempotent for the effective date');

// 7. Net offer/invoice amount, per-invoice-position SimTAX rounding, and gross receipt remain separate.
const pricing=makeFinance(0),pricingGame=createInitialGame();
const invoice=issueInvoice(pricing,{id:'NET-ROUNDING',customer:'K-01',invoiceReadyAt:'2027-02-02',deliveredAt:'2027-02-02'},100.03,14);
assert.equal(invoice.net,100.03);assert.equal(invoice.tax,19.01);assert.equal(invoice.gross,119.04);assert.equal(pricing.salesNet,100.03);
processFinancialDay(pricing,invoice.dueDate,pricingGame);
assert.equal(pricing.cash,119.04);assert.equal(pricing.cashReceivedFromSales,119.04);
assert.equal(pricing.cashMovements.find(x=>x.type==='Kundeneingang').amount,119.04);

console.log(JSON.stringify({groups:7,sameDayOrder:['KUNDENEINGANG','MASCHINENRATE','IMMOBILIENRATE','ANLAGENRATE','KOSTEN_RETRY_BEZAHLT','SIMTAX_ZAHLUNG','ZAHLUNGSERINNERUNG'],tightLiquidity:'no partial/negative/automatic draw',D0125:'existing machine manual draw preserved; no expansion',weeklyRetries:'preserved',effectiveDate:'2027-02-01 idempotent/reconciled',net:100.03,simTax:19.01,gross:119.04},null,2));




