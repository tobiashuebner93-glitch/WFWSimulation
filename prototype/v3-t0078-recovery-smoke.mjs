import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  createRunFromInputs, installRunOperatingResources, openNextRunDay, buildWeeklyTemplates,
  getRunProjection, submitRunOffer, planRunOrder, completeRunOrderStep,
  submitRunDelivery, createFinanceStateForRun, issueAcceptedScenarioInvoices,
  processRunDayCustomerReceipts, createRunSaveEnvelope, restoreRunSaveEnvelope,
} from './v3/run.js';
import { recordV3RunCustomerAcceptanceDecision, validateV3RunState, openV3RunDay, closeV3RunDay, startV3RunDiagnostics, setV3RunDiagnosticPhase, finishV3RunDiagnostics, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction } from './v3-run-orchestrator.js';
import { createV3ManagementContractSnapshot } from './v3-management-order-planner.js';
import { V3_COMMERCIAL_TERMS_VERSION, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import { buildRunMacroMonthInput } from './v3-run-macro-fixture.js';

const PROFILES = ['UPSWING', 'BOOM', 'DOWNTURN', 'LOW'];
const START = '2027-01-04';
const END = '2027-12-31';
const CHECKPOINT = '2027-06-30';
const SEED = 'T-0078-recovery-seed-1';
const BASELINES = resolve('prototype/v3-t0078-recovery-baselines.json');
const hash = value => createHash('sha256').update(stable(value)).digest('hex');
function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
const nextDate = date => new Date(Date.parse(`${date}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
const requireOk = result => { assert.equal(result.ok, true, result.error?.message); return result; };
const now = () => globalThis.performance?.now?.() ?? Date.now();

function buildOpenInput(run, profile, date) {
  const input = { date };
  if (run.modules.macro && (!run.modules.macro.periods.length || date.slice(8) === '01')) input.macroMonthInput = buildRunMacroMonthInput({
    period: date.slice(0, 7), path: profile,
    priorMonthlySpiIndexes: run.modules.macro.periods.map(snapshot => snapshot.spi.index),
    costPlanFixtureId: run.costPlanFixtureId ?? 'NEUTRAL',
    foreignDemandFixtureId: run.foreignDemandFixtureId ?? 'NEUTRAL',
    importPriceBenchmarkId: run.importPriceBenchmarkId ?? 'NEUTRAL',
    fxOfferPlanFixtureId: run.fxOfferPlanFixtureId ?? 'NEUTRAL',
  });
  if (new Date(`${date}T12:00:00Z`).getUTCDay() === 1) {
    const latestMacro = run.modules.macro?.periods.at(-1);
    const macroInput = input.macroMonthInput;
    const activityGapPct = macroInput ? 100 * (macroInput.activity.activityIndex / macroInput.activity.trendIndex - 1) : latestMacro?.activity.activityGapPct ?? 0;
    const activitySource = macroInput?.activity ?? latestMacro?.activity ?? { sourceType: 'synthetic_scenario_assumption', sourceRef: 'D-0169:neutral-missing-activity-fallback' };
    input.marketWeekTemplates = buildWeeklyTemplates(date, run.seed, {
      runId: run.runId, scenarioId: run.scenarioId, activityGapPct,
      activitySourceType: activitySource.sourceType, activitySourceRef: activitySource.sourceRef,
      exposure: 1, macroSnapshotId: run.modules.macro?.sourceSnapshotId ?? null, macroSnapshotPeriod: date.slice(0, 7),
      effectiveMacroEvents: run.modules.macro?.events ?? [], segments: run.modules.market.segments,
      foreignDemandFixtureId: run.foreignDemandFixtureId ?? 'NEUTRAL',
      priorWeeks: run.modules.market.events
        .filter(event => event.type === 'schedule_week' && event.payload?.weekStart < date && event.payload?.weekStart?.slice(0, 7) === date.slice(0, 7))
        .map(event => ({ weekStart: event.payload.weekStart, templates: event.payload.templates })),
    });
  }
  return input;
}

function createProfile(profile) {
  const scenarioId = `T-0078-RECOVERY-${profile}`;
  let run = createRunFromInputs({ scenarioId, seed: SEED, startDate: START, endDate: END, macroPath: profile });
  run = installRunOperatingResources(run, {
    peopleJson: JSON.stringify([{ id: 'P1', hoursPerDay: 8, skills: ['turning', 'turning_manual'], skillLevels: { turning_manual: 2 } }]),
    equipmentJson: JSON.stringify([{ id: 'M1', hoursPerDay: 8, capabilities: ['turning', 'manual-lathe'] }]),
    materialsJson: JSON.stringify([{ id: 'steel', quantity: 10 }]),
    commitmentsJson: '[]', finishedGoodsCapacity: '1', finishedGoodsUsed: '0',
  });
  const finance = createFinanceStateForRun(run);
  assert.ok(finance, 'each 2027 profile has the documented sourced opening finance state');
  return { run, finance };
}

function assertNegativeEnvelopesFailClosed(envelope) {
  const original = JSON.stringify(envelope);
  const cases = [
    ['bad save version', candidate => { candidate.saveVersion = 'UNSUPPORTED'; }],
    ['duplicate run event ID', candidate => { candidate.runState.dayEvents.push(structuredClone(candidate.runState.dayEvents[0])); }],
    ['negative material balance', candidate => { candidate.runState.modules.product.materials[0].quantity = -1; }],
    ['cross-run finance state', candidate => { candidate.financeState.runId = 'OTHER-RUN'; }],
    ['duplicate scenario invoice ID', candidate => { candidate.financeState.invoices.push(structuredClone(candidate.financeState.invoices[0])); }],
    ['duplicate payment event ID', candidate => { const payment = candidate.financeState.events.find(event => event.financeType === 'customer-payment'); assert.ok(payment, 'midyear fixture contains a settled customer payment'); candidate.financeState.events.push(structuredClone(payment)); }],
  ];
  for (const [label, mutate] of cases) {
    const candidate = structuredClone(envelope);
    mutate(candidate);
    const beforeRejectedAttempt = JSON.stringify(candidate);
    assert.throws(() => restoreRunSaveEnvelope(candidate), undefined, label);
    assert.equal(JSON.stringify(candidate), beforeRejectedAttempt, `${label} rejection leaves the attempted save unchanged`);
  }
  assert.equal(JSON.stringify(envelope), original, 'all rejected envelope clones leave the valid saved envelope unchanged');
  return cases.map(([label]) => label);
}

export function runV3T0078RecoverySmoke({ profile, mode, fixtureCheckOnly = false }) {
  if (!PROFILES.includes(profile)) throw new TypeError(`profile must be one of ${PROFILES.join(', ')}`);
  if (!['baseline', 'recovery'].includes(mode)) throw new TypeError('mode must be baseline or recovery');
  const startedAt = new Date().toISOString();
  const started = now();
  let { run, finance } = createProfile(profile);
  const dailyDates = [];
  const macroPeriods = [];
  let orderCompleted = false;
  let offerSubmitted = false;
  let invoiceIds = [];
  let paymentIds = [];
  let recoveryHashBefore = null;
  let negativeCases = [];
  let resumed = false;
  let invoiceSyncNeeded = false;

  startV3RunDiagnostics();
  for (let date = START; date <= (fixtureCheckOnly ? '2027-02-12' : END); date = nextDate(date)) {
    setV3RunDiagnosticPhase('dayOpen');
    const openInput = buildOpenInput(run, profile, nextDate(run.currentDate));
    let opened;
    if (date === START || date.slice(8) === '01') {
      const wrapped = openNextRunDay(run);
      const direct = openV3RunDay(run, openInput);
      assert.equal(hash(wrapped.state), hash(direct.state), `direct day-open matches UI wrapper on ${date}`);
      assert.equal(hash(wrapped.result), hash(direct.result), `direct day-open result matches UI wrapper on ${date}`);
      opened = direct;
    } else {
      opened = openV3RunDay(run, openInput);
    }
    run = opened.state;
    assert.equal(opened.result.date, date, 'no calendar date is skipped or repeated');
    if (date === START) {
      const instructionId = `T0078-instruction-${profile}`;
      run = planV3RunEquipmentInstruction(run, { instructionId, personId: 'P1', equipmentId: 'M1', plannedDate: date, sourceRef: `instruction:${instructionId}` }).state;
      run = completeV3RunEquipmentInstruction(run, { instructionId }).state;
    }

    const receipt = processRunDayCustomerReceipts(finance, date);
    finance = receipt.financeState;
    paymentIds.push(...receipt.receipts.map(event => event.eventId));

    if (!offerSubmitted) {
      const inquiry = getRunProjection(run).playerView.inquiries.find(row => row.status === 'open');
      // Customer requests are distributed over the week, not guaranteed Monday.
      if (inquiry) {
      const offered = submitRunOffer(run, inquiry, {
        netPrice: '10,00', costVersion: 'COST-UI-1', babVersion: 'BAB-UI-1',
        commercialTerms: { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Ein Präzisionsdrehteil nach Kundenvorgabe', quantity: 1, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maße nach Zeichnung und Sichtprüfung', deliveryDate: new Date(Date.parse(`${date}T12:00:00Z`) + 14 * 86400000).toISOString().slice(0, 10), contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) },
        directCostsJson: JSON.stringify([{ id: 'material-1', amountEuro: '2,00', variable: true }]),
        sourcePoolsJson: JSON.stringify([{
          poolId: 'POOL-UI-1', sourceCostCenterId: 'CC-SOURCE', costBasisId: 'COST-BASIS-1',
          period: '2027-01', poolEuro: '100,01', allocationMode: 'keys', unitLabel: 'h',
          recipients: [{ costCenterId: 'CC-PROD', keyValue: '10' }],
        }]),
        offerDriversJson: JSON.stringify([{ poolId: 'POOL-UI-1', costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '2', unitLabel: 'h' }]),
      });
      run = offered.state;
      assert.equal(offered.calculation.resultAfterBabCents, -1200);
      offerSubmitted = true;
      }
    }

    if (!orderCompleted) {
      const order = run.customerWorkOrders.find(row => row.inquiryId && row.status === 'awaiting_operational_plan');
      if (order) {
        const contractFields = createV3ManagementContractSnapshot(order);
        run = planRunOrder(run, order, { contractFields, operationsJson: JSON.stringify([{
          operationId: 'cut', date, personId: 'P1', equipmentId: 'M1', hours: 2,
          requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 },
        }]) }).state;
        run = completeRunOrderStep(run, order.workOrderId, 'cut').state;
        run = submitRunDelivery(run, order.workOrderId, { deliveryId: `DELIVERY-T0078-${profile}`, sourceRef: `fixture:delivery:T0078:${profile}` }).state;
        const decision = recordV3RunCustomerAcceptanceDecision(run, {
          decisionId: `DECISION-T0078-${profile}`, sourceRef: `fixture:customer-acceptance:T0078:${profile}`,
          workOrderId: order.workOrderId, deliveryId: `DELIVERY-T0078-${profile}`, decisionDate: date,
          decision: 'accept', actorRole: 'customer', actorPartyId: order.customerPartyId,
          customerRef: order.customerPartyId, authorizedForRef: null, partyAuthorityRef: null,
          acceptanceCriterionRef: contractFields.acceptanceCriterionRef,
        });
        run = decision.state;
        assert.equal(decision.result.status, 'accepted_non_posting');
        orderCompleted = true;
        invoiceSyncNeeded = true;
      }
    }

    setV3RunDiagnosticPhase('dayClose');
    run = closeV3RunDay(run, { date }).state;
    if (invoiceSyncNeeded) {
      setV3RunDiagnosticPhase('invoiceSync');
      const invoiced = issueAcceptedScenarioInvoices(run, finance);
      finance = invoiced.financeState;
      invoiceIds.push(...invoiced.invoiceIds);
      invoiceSyncNeeded = false;
    }
    dailyDates.push(date);
    if (fixtureCheckOnly && orderCompleted && invoiceIds.length === 1 && paymentIds.length === 1) {
      assert.equal(validateV3RunState(run), true);
      return { status: 'FIXTURE_PASS', profile, mode, days: dailyDates.length, date, invoices: invoiceIds.length, payments: paymentIds.length, diagnostics: finishV3RunDiagnostics(), annualSmokeExecuted: false };
    }
    const macro = run.modules.macro.periods.at(-1);
    if (macro && macroPeriods.at(-1) !== macro.period) macroPeriods.push(macro.period);

    if (mode === 'recovery' && date === CHECKPOINT) {
      const envelope = createRunSaveEnvelope(run, finance);
      const checkpointJson = JSON.stringify(envelope);
      const restored = restoreRunSaveEnvelope(JSON.parse(checkpointJson));
      assert.equal(hash(restored.runState), hash(run), 'midyear save/restore preserves the complete run state');
      assert.equal(hash(restored.financeState), hash(finance), 'midyear save/restore preserves the complete finance state');
      assert.equal(restored.runState.currentDate, CHECKPOINT);
      recoveryHashBefore = hash({ run, finance });
      negativeCases = assertNegativeEnvelopesFailClosed(envelope);
      run = restored.runState;
      finance = restored.financeState;
      resumed = true;

      // Resume-replay checks: the already issued invoice and due receipt cannot be duplicated.
      const replayedInvoice = issueAcceptedScenarioInvoices(run, finance);
      assert.deepEqual(replayedInvoice.invoiceIds, []);
      assert.equal(hash(replayedInvoice.financeState), hash(finance));
      const replayedReceipt = processRunDayCustomerReceipts(finance, '2027-01-19');
      assert.equal(hash(replayedReceipt.financeState), hash(finance));
      finance = replayedReceipt.financeState;
      assert.equal(hash({ run, finance }), recoveryHashBefore, 'safe repeated invoice/receipt inputs have no second effect');
    }
  }

  assert.equal(fixtureCheckOnly, false, `bounded fixture did not complete: offer=${offerSubmitted}, order=${orderCompleted}, invoices=${invoiceIds.length}, payments=${paymentIds.length}`);
  assert.equal(dailyDates.length, 362);
  assert.equal(dailyDates[0], START);
  assert.equal(dailyDates.at(-1), END);
  assert.equal(macroPeriods.length, 12);
  assert.equal(orderCompleted, true);
  assert.equal(run.customerWorkOrders.length, 1);
  assert.equal(run.customerWorkOrders[0].status, 'ready_for_delivery');
  assert.ok(run.dayEvents.some(event => event.phase === 'customer_acceptance_decision' && event.result?.status === 'accepted_non_posting'));
  assert.equal(invoiceIds.length, 1);
  assert.equal(finance.invoices.length, 1);
  assert.equal(paymentIds.length, 1);
  assert.equal(finance.events.filter(event => event.financeType === 'customer-payment').length, 1);
  assert.equal(run.modules.product.materials.find(row => row.id === 'steel').quantity, 9);
  setV3RunDiagnosticPhase('finalValidation');
  assert.equal(validateV3RunState(run), true);
  if (mode === 'recovery') assert.equal(resumed, true);

  setV3RunDiagnosticPhase('finalEnvelope');
  const finalEnvelope = createRunSaveEnvelope(run, finance);
  const finalRestored = restoreRunSaveEnvelope(JSON.parse(JSON.stringify(finalEnvelope)));
  const finalHash = hash({ run, finance });
  assert.equal(hash({ run: finalRestored.runState, finance: finalRestored.financeState }), finalHash, 'end-of-year envelope also round-trips');
  setV3RunDiagnosticPhase('finalValidation');
  const diagnostics = finishV3RunDiagnostics();
  const wallMs = Number((now() - started).toFixed(3));
  const result = {
    status: 'PASS', mode, profile, seed: SEED, scenarioId: run.scenarioId,
    startDate: START, endDate: END, checkpointDate: mode === 'recovery' ? CHECKPOINT : null,
    days: dailyDates.length, months: macroPeriods.length, macroPeriods,
    runEvents: run.dayEvents.length, workOrders: run.customerWorkOrders.length,
    invoices: finance.invoices.length, payments: finance.events.filter(event => event.financeType === 'customer-payment').length,
    wallMs, diagnostics, finalStateEventHash: finalHash,
    recoveryHashBefore, negativeEnvelopeCases: negativeCases,
  };
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname.replace(/^\//, ''))) {
  const profile = process.argv.find(value => value.startsWith('--profile='))?.slice('--profile='.length) ?? 'UPSWING';
  const mode = process.argv.find(value => value.startsWith('--mode='))?.slice('--mode='.length) ?? 'baseline';
  const fixtureCheckOnly = process.argv.includes('--fixture-check');
  const result = runV3T0078RecoverySmoke({ profile, mode, fixtureCheckOnly });
  if (fixtureCheckOnly) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }
  if (result.wallMs > 360_000) throw new Error(`T-0078 ${profile} ${mode} exceeded the 360-second per-run limit (${result.wallMs} ms)`);
  if (mode === 'baseline') {
    const prior = existsSync(BASELINES) ? JSON.parse(readFileSync(BASELINES, 'utf8')) : { fixture: 'T-0078-BASELINE-1', profiles: {} };
    prior.profiles[profile] = { seed: SEED, stateHash: result.finalStateEventHash, wallMs: result.wallMs, days: result.days, events: result.runEvents };
    writeFileSync(BASELINES, `${JSON.stringify(prior, null, 2)}\n`, 'utf8');
  } else {
    if (!existsSync(BASELINES)) throw new Error('T-0078 baseline file is missing; run baseline mode first for each profile');
    const baseline = JSON.parse(readFileSync(BASELINES, 'utf8')).profiles?.[profile];
    assert.ok(baseline, `baseline for ${profile} is missing`);
    assert.equal(result.finalStateEventHash, baseline.stateHash, `${profile} recovered end-state/event hash matches its uninterrupted baseline`);
    console.log(`SAME-END-HASH ${profile}: ${result.finalStateEventHash}`);
  }
  console.log(JSON.stringify(result, null, 2));
}
