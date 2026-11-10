import assert from 'node:assert/strict';
import { createV3MarketState, createV3MarketOfferId, V3_METAL_GOODS_CONTRACT_CLASSIFICATION, V3_COMMERCIAL_TERMS_VERSION, V3_D0157_F3_CONDITION } from './v3-market-simulation.js';
import { createV3Run, advanceV3RunDay, openV3RunDay, submitV3RunOffer, submitV3RunProductSaleOffer, recordV3RunProductCostLayer, recordV3RunProductSaleBuyerDecision, dispatchV3RunProductSale, closeV3RunDay, planV3RunEquipmentInstruction, completeV3RunEquipmentInstruction, planV3RunWorkOrder, completeV3RunWorkOrderOperation, placeV3RunInternationalMaterialOrder, receiveV3RunInternationalMaterialShipment, deliverV3RunCustomerWorkOrder, cancelV3RunCustomerWorkOrderBeforeShipment, recordV3RunCustomerAcceptanceDecision, recordV3RunCustomerGoodsReturn, getV3RunCustomerEvidence, validateV3RunState } from './v3-run-orchestrator.js';
import { createV3ProductState, createV3Product, defineV3ProductSteps, estimateV3Product, estimateV3ProductWithBab, planV3ProductStep, completeV3ProductStep, getV3ProductCostSourceRefs, recordV3CustomerFinishedGoodsReturn } from './v3-product-lifecycle.js';
import { createV3MacroState, runV3MacroMonth, V3_EXTERNAL_CHANNELS, V3_POLICY_CHANNELS } from './v3-macro-simulation.js';
import { V3_SPI_COICOP12_WEIGHTS_PER_MILLE } from './v3-price-index.js';

const syntheticCostLines = lines => lines.map(line => ({ ...line, unit: 'EUR', sourceRef: `synthetic:run-test:${line.id}`, roundingPolicy: 'already_integer_cents_no_rounding', roundingResultCents: line.amountCents }));

const parameters = {
  weekdayWeights: { mon: 0.2, tue: 0.2, wed: 0.2, thu: 0.2, fri: 0.2 },
  invitationWeights: { capacity: 0.25, reputation: 0.35, segmentFit: 0.4 },
  minimumInvitationScore: 0.2, maximumInvitations: 4,
  offerWindowCalendarDays: { min: 3, max: 5 },
  customerDecisionDelayCalendarDays: { min: 2, max: 2 },
  minimumMonthlyCompetitorSample: 3,
};
const segments = [{ segmentId: 'small', decisionWeights: { price: 0.6, reputation: 0.2, segmentFit: 0.2 } }];
const firms = [
  { firmId: 'player', role: 'player', reputation: 0.65, capacityUnits: 12, capabilities: ['turning'], segmentFit: { small: 0.75 } },
  { firmId: 'competitor-a', role: 'competitor', reputation: 0.7, capacityUnits: 15, capabilities: ['turning'], segmentFit: { small: 0.8 }, offerPriceCentsBySizeClass: { small: 1000000 } },
  { firmId: 'competitor-b', role: 'competitor', reputation: 0.55, capacityUnits: 8, capabilities: ['turning'], segmentFit: { small: 0.6 }, offerPriceCentsBySizeClass: { small: 1200000 } },
  { firmId: 'competitor-c', role: 'competitor', reputation: 0.6, capacityUnits: 9, capabilities: ['turning'], segmentFit: { small: 0.7 }, offerPriceCentsBySizeClass: { small: 1150000 } },
];
const newRun = () => {
  const marketState = createV3MarketState({ runId: 'run-1', scenarioId: 'scenario-1', seed: 'seed-1', parameterSetId: 'market-test-v1', startDate: '2027-01-04', parameters, segments, firms });
  const productState = createV3ProductState({ runId: 'run-1', currentDate: '2027-01-04', people: [{ id: 'worker-1', hoursPerDay: 8, skills: ['turning'] }], equipment: [{ id: 'machine-1', hoursPerDay: 8, capabilities: ['turning'] }], materials: [{ id: 'steel', quantity: 10 }], finishedGoodsCapacity: 10, finishedGoodsUsed: 0, commitments: [] });
  return createV3Run({ runId: 'run-1', scenarioId: 'scenario-1', seed: 'seed-1', startDate: '2027-01-04', endDate: '2027-12-31', marketState, productState });
};
const productSaleRun = () => {
  const base = newRun();
  const opened = openV3RunDay(base, { date: base.startDate, marketWeekTemplates: templates });
  let run = opened.state;
  const instructionId = 'run-regression-product-sale-instruction';
  run = planV3RunEquipmentInstruction(run, { instructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: base.startDate, sourceRef: `instruction:${instructionId}` }).state;
  run = completeV3RunEquipmentInstruction(run, { instructionId }).state;
  let productState = run.modules.product;
  productState = createV3Product(productState, { productId: 'product-1', name: 'Own product', targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [] });
  productState = defineV3ProductSteps(productState, 'product-1', [{ stepId: 'make', kind: 'production', hours: 1, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
  productState = estimateV3Product(productState, 'product-1', { netPriceCents: 10000, directCosts: syntheticCostLines([{ id: 'material', amountCents: 1000, variable: true }]), costVersion: 'COST-1' });
  productState = planV3ProductStep(productState, { productId: 'product-1', stepId: 'make', date: '2027-01-04', personId: 'worker-1', equipmentId: 'machine-1', outputQuantity: 4 });
  productState = completeV3ProductStep(productState, productState.assignments[0].assignmentId);
  run.modules.product = productState;
  return { state: run, openingResult: opened.result };
};
const template = { templateId: 'inquiry-1', customerId: 'customer-1', segmentId: 'small', sizeClass: 'small', requiredCapabilities: ['turning'], requiredCapacity: 2, referencePriceCents: 110000, macroPeriod: '2027-01' };
const templates = Array.from({ length: 5 }, (_, index) => ({ ...template, templateId: `inquiry-${index + 1}`, customerId: `customer-${index + 1}` }));
const snapshot = (offerId, date) => ({ modelVersion: 'V3-FINANCIAL-CALCULATION-1', offerId, submittedAt: date, netPriceCents: 90000, costVersion: 'cost-fixture-v1', babVersion: 'bab-fixture-v1', calculation: { netPriceCents: 90000, dbICents: 3000 } });
const commercialTerms = { version: V3_COMMERCIAL_TERMS_VERSION, scope: 'Fertigung eines Präzisionsdrehteils nach Kundenvorgabe', quantity: 2, unit: 'pieces', qualityTarget: 'standard', acceptanceCriteria: 'Maße gemäß vereinbarter Zeichnung und Sichtprüfung', deliveryDate: '2027-01-12', contractClassification: structuredClone(V3_METAL_GOODS_CONTRACT_CLASSIFICATION), acceptanceScenario: structuredClone(V3_D0157_F3_CONDITION) };
const day = (state, date, input = {}) => advanceV3RunDay(state, { date, ...input });
const macroRecord = label => ({ sourceType: 'synthetic_fixture', sourceRef: `fixture:${label}`, unit: 'index', value: 100, effectiveFrom: '2027-01-01', lagPeriods: 0, uncertaintyBand: { low: -1, base: 0, high: 1 }, firmExposure: `fixture:${label}`, expectedOutcome: 'directional_only' });
const macroInput = period => ({
  period, parameterSetId: 'inputs-fixture-v1', componentIndexes: Object.fromEntries(Object.keys(V3_SPI_COICOP12_WEIGHTS_PER_MILLE).map(id => [id, 100])), priorMonthlySpiIndexes: [], componentSourceType: 'synthetic_fixture', componentSourceRef: `fixture:spi:${period}`,
  activity: { activityIndex: 100, trendIndex: 100, priorActivityIndex: 99, sourceType: 'synthetic_fixture', sourceRef: `fixture:activity:${period}` },
  externalChannels: Object.fromEntries(V3_EXTERNAL_CHANNELS.map(name => [name, macroRecord(name)])),
  policyChannels: Object.fromEntries(V3_POLICY_CHANNELS.map(name => [name, ({ ...macroRecord(name), measure: `fixture ${name} measure`, goal: 'test goal', intermediateIndicator: 'fixture indicator', firmExposure: `fixture exposure ${name}`, expectedOutcome: 'directional test only', counterEffect: 'fixture counter-effect', effectGroupId: `group-${name}`, accountingClass: 'information_plan' })])),
});

// Same deterministic start and inputs produce identical event IDs, states and results.
let run = newRun();
const firstOfferEventId = 'player-submission-1';
const firstOffer = { eventId: firstOfferEventId, templateId: 'inquiry-1', firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: snapshot(createV3MarketOfferId(run.modules.market, firstOfferEventId), '2027-01-04'), commercialTerms: structuredClone(commercialTerms) };
const first = day(run, '2027-01-04', { marketWeekTemplates: templates, offers: [firstOffer, structuredClone(firstOffer)] });
assert.equal(first.ok, true);
assert.equal(validateV3RunState(first.state), true);
assert.deepEqual(first, day(newRun(), '2027-01-04', { marketWeekTemplates: templates, offers: [firstOffer, structuredClone(firstOffer)] }));
assert.equal(first.result.eventOrder.filter(phase => phase === 'player_offer').length, 1, 'duplicate same-day offer submission does not duplicate run history');
assert.equal(first.state.modules.market.events.filter(event => event.eventId.includes(firstOfferEventId)).length, 1, 'duplicate offer ID is recorded once by the market module');
assert.equal(first.state.modules.product.currentDate, '2027-01-04', 'product clock is valid at the shared start date');
const productNextDay = day(first.state, '2027-01-05');
assert.equal(productNextDay.state.modules.product.currentDate, '2027-01-05', 'product clock advances to the next shared workday');
assert.equal(validateV3RunState(productNextDay.state), true);
assert.equal(first.result.date, '2027-01-04');
assert.equal(first.state.modules.market.currentDate, '2027-01-04');
assert.equal(first.state.customerWorkOrders.length, 0, 'an inquiry is not a work order');

// Snapshot consistency is anchored to a separately stored market submission result.
const playerOffer = first.state.modules.market.inquiries.flatMap(inquiry => inquiry.offers).find(offer => offer.firmId === 'player');
assert.ok(playerOffer, 'fixture has one player submission to validate');
const oneSidedSnapshotTamper = structuredClone(first.state);
const oneSidedOffer = oneSidedSnapshotTamper.modules.market.inquiries.flatMap(inquiry => inquiry.offers).find(offer => offer.offerId === playerOffer.offerId);
oneSidedOffer.calculationSnapshot.costVersion = 'tampered-cost-version';
assert.throws(() => validateV3RunState(oneSidedSnapshotTamper), { code: 'invalid_market_state' }, 'changing only the stored offer snapshot is rejected');

const pairedSnapshotTamper = structuredClone(first.state);
const pairedOffer = pairedSnapshotTamper.modules.market.inquiries.flatMap(inquiry => inquiry.offers).find(offer => offer.offerId === playerOffer.offerId);
pairedOffer.calculationSnapshot.costVersion = 'tampered-cost-version';
const submissionSource = pairedSnapshotTamper.modules.market.events.find(event => event.eventId === pairedOffer.submittedEventId);
assert.ok(submissionSource, 'player offer has its market submission source event');
submissionSource.payload.calculationSnapshot.costVersion = 'tampered-cost-version';
assert.throws(() => validateV3RunState(pairedSnapshotTamper), { code: 'invalid_market_state' }, 'matching offer and source-payload mutation is rejected by the independent snapshot binding');

// The shared UI may open a day, read new inquiries, submit an offer, and then close the day.
let phased = newRun();
const opened = openV3RunDay(phased, { date: '2027-01-04', marketWeekTemplates: templates });
phased = opened.state;
assert.equal(phased.modules.market.dayPhase, 'actions');
assert.ok(opened.result.playerInquiries.length > 0, 'player inquiries are exposed before same-day offer input');
assert.equal(phased.modules.market.events.some(event => event.type === 'submit_offer'), false);
assert.equal(openV3RunDay(phased, { date: '2027-01-04', marketWeekTemplates: templates }).duplicate, true, 'identical active open replay is a no-op');
assert.throws(() => openV3RunDay(phased, { date: '2027-01-04' }), { code: 'run_day_payload_conflict' }, 'changed open replay is rejected');
const phasedOfferEventId = 'phased-offer-1';
const phasedOffer = { eventId: phasedOfferEventId, inquiryId: opened.result.playerInquiries[0].inquiryId, firmId: 'player', submittedAt: '2027-01-04', calculationSnapshot: snapshot(createV3MarketOfferId(phased.modules.market, phasedOfferEventId), '2027-01-04'), commercialTerms: structuredClone(commercialTerms) };
const offerResult = submitV3RunOffer(phased, phasedOffer);
phased = offerResult.state;
assert.equal(offerResult.duplicate, false);
assert.equal(submitV3RunOffer(phased, structuredClone(phasedOffer)).duplicate, true, 'identical offer event replay is a no-op');
assert.equal(phased.dayEvents.filter(event => event.phase === 'player_offer').length, 1);
const changedOffer = structuredClone(phasedOffer); changedOffer.calculationSnapshot = { ...changedOffer.calculationSnapshot, netPriceCents: 90001 };
assert.throws(() => submitV3RunOffer(phased, changedOffer), /snapshot price must equal calculation.netPriceCents|event ID already exists with different payload/);
const phasedClosed = closeV3RunDay(phased, { date: '2027-01-04' });
phased = phasedClosed.state;
assert.equal(phased.modules.market.dayPhase, 'closed');
assert.deepEqual(phasedClosed.result.eventOrder.slice(-2), ['player_offer', 'market_expiry']);
assert.equal(closeV3RunDay(phased, { date: '2027-01-04' }).duplicate, true, 'closing a closed day is a no-op');
assert.equal(openV3RunDay(phased, { date: '2027-01-04', marketWeekTemplates: templates }).duplicate, true, 'identical open replay after close is a no-op');
assert.equal(validateV3RunState(phased), true);
const damaged = structuredClone(first.state); damaged.dayEvents.pop();
assert.throws(() => validateV3RunState(damaged), { code: 'invalid_run_state' }, 'incomplete run event history is rejected');
const duplicatedHistory = structuredClone(first.state); duplicatedHistory.dayEvents.push(structuredClone(duplicatedHistory.dayEvents[0]));
assert.throws(() => validateV3RunState(duplicatedHistory), { code: 'invalid_run_state' }, 'duplicate event IDs in restored run history are rejected');

// Own-product buyer offers and decisions are bound to the shared run log and survive restore validation.
let supplyRun = openV3RunDay(newRun(), { date: '2027-01-04' }).state;
const supplyOrderInput = { orderId: 'order-run-supply', shipmentId: 'shipment-run-supply', materialId: 'steel', quantity: 2, supplierId: 'local', sourceRef: 'synthetic-source:D-0173:local', fixtureId: 'synthetic:D-0173:supplier-profile-v1', baselineEtaDate: '2027-01-04', etaDate: '2027-01-04', lagDays: 0 };
const placedSupply = placeV3RunInternationalMaterialOrder(supplyRun, supplyOrderInput);
supplyRun = placedSupply.state;
assert.equal(placeV3RunInternationalMaterialOrder(supplyRun, structuredClone(supplyOrderInput)).duplicate, true, 'shared-run material order replay is idempotent');
assert.throws(() => placeV3RunInternationalMaterialOrder(supplyRun, { ...supplyOrderInput, quantity: 3 }), { code: 'material_order_payload_conflict' }, 'shared-run order payload conflict is rejected');
supplyRun = closeV3RunDay(supplyRun, { date: '2027-01-04' }).state;
supplyRun = openV3RunDay(supplyRun, { date: '2027-01-05' }).state;
const receivedSupply = receiveV3RunInternationalMaterialShipment(supplyRun, 'shipment-run-supply');
supplyRun = receivedSupply.state;
assert.equal(supplyRun.modules.product.materials.find(row => row.id === 'steel').quantity, 12, 'run receipt changes the existing product material quantity');
assert.equal(supplyRun.modules.product.supplierInvoiceEvidence[0].amountCents, 392, 'local supplier invoice evidence uses the accepted quote amount without posting');
assert.equal(supplyRun.modules.product.supplierInvoiceEvidence[0].status, 'pending_non_posting', 'supplier invoice evidence does not change AP or cash');
assert.equal(supplyRun.modules.product.supplierInvoiceEvidence[0].dueDate, '2027-01-18', 'supplier invoice uses invoice date plus the inclusive 14-calendar-day term');
assert.equal(receiveV3RunInternationalMaterialShipment(supplyRun, 'shipment-run-supply').duplicate, true, 'run receipt replay is idempotent');
assert.equal(validateV3RunState(JSON.parse(JSON.stringify(supplyRun))), true, 'material order/receipt survives run save/restore validation');
const tamperedSupply = structuredClone(supplyRun); tamperedSupply.dayEvents.find(event => event.phase === 'international_material_receipt').result.quantityAfter += 1;
assert.throws(() => validateV3RunState(tamperedSupply), { code: 'invalid_run_state' }, 'receipt event mutation is rejected by product/run cross-binding');

const productFixture = productSaleRun();
let productRun = productFixture.state;
const productDayOpened = { state: productRun, result: productFixture.openingResult };
const productInquiry = productDayOpened.result.playerInquiries.find(row => row.requiredCapacity <= 2 && row.segmentId === 'small');
assert.ok(productInquiry, 'shared run fixture exposes a matching product buyer inquiry');
const productOfferInput = { saleId: 'SALE|run-1|inquiry-product|product-1', productId: 'product-1', sellerPartyId: 'player', buyerPartyId: productInquiry.customerId, inquiryId: productInquiry.inquiryId, quantity: productInquiry.requiredCapacity, offerDate: '2027-01-04', decisionDate: '2027-01-06', netPriceCents: 9000, offerSnapshotId: 'PRODUCT-PLAN|COST-1|2027-01-04|V3-FINANCIAL-CALCULATION-1' };
const productOfferResult = submitV3RunProductSaleOffer(productRun, productOfferInput);
productRun = productOfferResult.state;
assert.equal(productOfferResult.result.status, 'pending');
assert.equal(productOfferResult.result.offerSnapshot.offerPriceCents, productOfferInput.netPriceCents, 'shared-run buyer offer freezes the offered price and cost plan together');
assert.equal(productOfferResult.result.offerSnapshot.calculation.netPriceCents, productOfferInput.netPriceCents, 'shared-run offer calculation uses the submitted price rather than the earlier plan price');
assert.equal(productOfferResult.result.offerSnapshot.calculation.dbICents, 8000, 'shared-run DB I is recomputed from the submitted price and stored variable costs');
assert.equal(productOfferResult.result.offerSnapshot.babCalculation, null, 'BAB-free shared-run offer does not invent a BAB allocation');
assert.equal(productOfferResult.result.offerSnapshot.babStatus, 'pending_deferred_bab');
assert.equal(productRun.dayEvents.filter(event => event.phase === 'product_sale_offer').length, 1, 'product offer is stored in the run event log');
assert.equal(submitV3RunProductSaleOffer(productRun, structuredClone(productOfferInput)).duplicate, true, 'identical shared-run product offer replay is idempotent');
assert.throws(() => submitV3RunProductSaleOffer(productRun, { ...productOfferInput, saleId: 'SALE|invalid-quantity', quantity: 1 }), { code: 'product_sale_market_fit_mismatch' }, 'product offer must match the buyer inquiry quantity exactly');
const runProductTamper = structuredClone(productRun); runProductTamper.modules.product.productSales[0].offerSnapshotId = 'tampered';
assert.throws(() => validateV3RunState(runProductTamper), { code: 'invalid_run_state' }, 'product module offer tampering is caught by the independent run event binding');
const runSnapshotTamper = structuredClone(productRun); runSnapshotTamper.modules.product.productSales[0].offerSnapshot.offerPriceCents += 1;
assert.throws(() => validateV3RunState(runSnapshotTamper), { code: 'invalid_run_state' }, 'product offer snapshot mutation is caught by the independent run event binding');
const revisedPlanAfterOffer = structuredClone(productRun);
revisedPlanAfterOffer.modules.product = estimateV3Product(revisedPlanAfterOffer.modules.product, 'product-1', { netPriceCents: 10999, directCosts: syntheticCostLines([{ id: 'material', amountCents: 1000, variable: true }]), costVersion: 'COST-1-REVISED' });
assert.equal(validateV3RunState(revisedPlanAfterOffer), true, 'later product plan revisions do not rewrite the immutable submitted offer snapshot');
assert.throws(() => submitV3RunProductSaleOffer(productRun, { ...productOfferInput, netPriceCents: 10001 }), { code: 'run_product_sale_offer_payload_conflict' }, 'same sale ID with changed offer terms is rejected');
productRun = closeV3RunDay(productRun, { date: '2027-01-04' }).state;
productRun = openV3RunDay(productRun, { date: '2027-01-05' }).state;
productRun = closeV3RunDay(productRun, { date: '2027-01-05' }).state;
productRun = openV3RunDay(productRun, { date: '2027-01-06' }).state;
const buyerDecisionInput = { saleId: productOfferInput.saleId, buyerPartyId: productOfferInput.buyerPartyId, decisionDate: '2027-01-06', accepted: true, decisionRef: 'buyer-e2e-acceptance' };
assert.throws(() => recordV3RunProductSaleBuyerDecision(productRun, { ...buyerDecisionInput, buyerPartyId: 'player' }), { code: 'product_sale_buyer_authority_mismatch' }, 'seller cannot act as the product buyer');
const productDecisionResult = recordV3RunProductSaleBuyerDecision(productRun, buyerDecisionInput);
productRun = productDecisionResult.state;
assert.equal(productRun.modules.product.products[0].outputQuantity, 2, 'buyer acceptance reserves the accepted finished quantity');
assert.equal(productRun.modules.product.finishedGoodsUsed, 4, 'buyer acceptance does not physically remove finished stock');
assert.equal(productRun.modules.product.productSales[0].financeStatus, 'pending_non_posting', 'buyer acceptance remains outside finance posting');
assert.equal(productRun.dayEvents.filter(event => event.phase === 'product_sale_buyer_decision').length, 1, 'buyer decision is stored in the run event log');
assert.equal(validateV3RunState(structuredClone(productRun)), true, 'accepted product sale passes save/restore-shaped run validation');
assert.equal(recordV3RunProductSaleBuyerDecision(productRun, structuredClone(buyerDecisionInput)).duplicate, true, 'identical buyer decision replay is idempotent');
const runDecisionTamper = structuredClone(productRun); runDecisionTamper.dayEvents.find(event => event.phase === 'product_sale_buyer_decision').result.input.decisionRef = 'rewritten-buyer-event';
assert.throws(() => validateV3RunState(runDecisionTamper), { code: 'invalid_run_state' }, 'run buyer decision must remain tied to product module evidence');
const dispatchInput = { saleId: productOfferInput.saleId, dispatchId: 'dispatch-product-1', date: '2027-01-06', sourceRef: 'fixture-product-dispatch-1' };
const dispatched = dispatchV3RunProductSale(productRun, dispatchInput);
productRun = dispatched.state;
assert.equal(productRun.modules.product.finishedGoodsUsed, 2, 'only explicit product dispatch removes warehouse capacity');
assert.equal(productRun.modules.product.finishedGoodsMovements.filter(row => row.kind === 'product_goods_shipped').length, 1, 'product shipment creates one physical stock movement');
assert.equal(dispatchV3RunProductSale(productRun, structuredClone(dispatchInput)).duplicate, true, 'product dispatch replay is idempotent');
assert.throws(() => dispatchV3RunProductSale(productRun, { ...dispatchInput, sourceRef: 'changed-dispatch-source' }), { code: 'run_product_dispatch_payload_conflict' });

// Macro state may match the current run month, but an ahead-of-run snapshot is rejected.
const macroProfile = { runId: 'run-1', scenarioId: 'scenario-1', seed: 'seed-1', profileVersion: 'fixture-v1', sourceSnapshotId: 'macro-snapshot-v1', cycleParameters: { lowGapPct: -2, highGapPct: 2, positiveMomentumPct: 0.1, negativeMomentumPct: -0.1, persistencePeriods: 1, parameterSetId: 'cycle-fixture-v1', sourceRef: 'synthetic-fixture:cycle' } };
const runWithMacro = macroState => {
  const base = newRun();
  return createV3Run({ runId: base.runId, scenarioId: base.scenarioId, seed: base.seed, startDate: base.startDate, endDate: base.endDate, marketState: base.modules.market, productState: base.modules.product, macroState });
};
const currentMacroRun = runWithMacro(createV3MacroState(macroProfile));
const openedMacroRun = openV3RunDay(currentMacroRun, { date: '2027-01-04', macroMonthInput: macroInput('2027-01') });
assert.equal(openedMacroRun.ok, true);
assert.equal(validateV3RunState(openedMacroRun.state), true, 'macro source is created through the authoritative shared day-open input');
let futureMacro = runV3MacroMonth(createV3MacroState(macroProfile), macroInput('2027-01')).state;
for (const period of ['2027-02', '2027-03', '2027-04', '2027-05', '2027-06', '2027-07', '2027-08', '2027-09', '2027-10', '2027-11', '2027-12', '2028-01', '2028-02']) futureMacro = runV3MacroMonth(futureMacro, macroInput(period)).state;
assert.throws(() => runWithMacro(futureMacro), { code: 'invalid_run_state' }, 'macro snapshots ahead of the shared run month are rejected');

// Run-day replay is idempotent, but a changed payload for the same date is rejected.
const replay = advanceV3RunDay(first.state, {
  date: '2027-01-04', marketWeekTemplates: templates,
  offers: [firstOffer, structuredClone(firstOffer)],
});
assert.equal(replay.duplicate, true);
assert.deepEqual(replay.state, first.state);
assert.throws(() => advanceV3RunDay(first.state, { date: '2027-01-04' }), { code: 'run_day_payload_conflict' });
assert.throws(() => day(first.state, '2027-01-06'), { code: 'invalid_run_date' }, 'dates are strictly sequential');

const orphaned = structuredClone(emptyRunState());
function emptyRunState() { return newRun(); }
orphaned.customerWorkOrders.push({ workOrderId: 'WORK|orphan', runId: 'run-1', inquiryId: 'missing', decisionId: 'missing', offerId: 'missing', acceptedAt: '2027-01-04', status: 'awaiting_operational_plan', financeStatus: 'pending_non_posting' });
orphaned.financeHandoffs.push({ handoffId: 'FIN-HANDOFF|orphan', workOrderId: 'WORK|orphan', sourceEventId: 'missing', status: 'pending_non_posting', reason: 'orphan' });
assert.throws(() => validateV3RunState(orphaned), { code: 'invalid_run_state' }, 'unbacked work orders and handoffs are rejected');

// A forged resolved inquiry and matching pending handoff still require a real market decision event.
const forgedDecision = structuredClone(first.state);
const forgedInquiry = forgedDecision.modules.market.inquiries[0];
forgedInquiry.status = 'resolved';
forgedInquiry.winnerFirmId = 'player';
forgedInquiry.winningOfferId = 'forged-winning-offer';
forgedInquiry.decisionId = 'forged-decision-id';
forgedInquiry.decidedAt = '2027-01-04';
const forgedOrderId = `WORK|${encodeURIComponent(forgedDecision.runId)}|${encodeURIComponent(forgedInquiry.decisionId)}`;
forgedDecision.customerWorkOrders.push({ workOrderId: forgedOrderId, runId: forgedDecision.runId, inquiryId: forgedInquiry.inquiryId, decisionId: forgedInquiry.decisionId, offerId: forgedInquiry.winningOfferId, acceptedAt: forgedInquiry.decidedAt, status: 'awaiting_operational_plan', financeStatus: 'pending_non_posting' });
forgedDecision.financeHandoffs.push({ handoffId: `FIN-HANDOFF|${encodeURIComponent(forgedOrderId)}|performance`, workOrderId: forgedOrderId, sourceEventId: forgedInquiry.decisionId, status: 'pending_non_posting', reason: 'customer acceptance is not performance, delivery, acceptance, invoice, payment, or an authorized A03 posting' });
assert.throws(() => validateV3RunState(forgedDecision), { code: 'invalid_run_state' }, 'a fabricated decision field plus matching work-order/handoff is rejected without market event provenance');

// A pre-known scheduled inquiry can be acted on during its opening day; a later customer decision creates one operational reference.
run = first.state;
for (const date of ['2027-01-05', '2027-01-06']) run = day(run, date).state;
assert.equal(run.customerWorkOrders.length, 1, 'winning accepted offer maps to exactly one work order');
assert.equal(run.customerWorkOrders[0].decisionId, run.modules.market.inquiries[0].decisionId);
assert.equal(run.customerWorkOrders[0].status, 'awaiting_operational_plan', 'missing customer production adapter stays explicit');
assert.equal(run.financeHandoffs.length, 1);
assert.equal(run.financeHandoffs[0].status, 'pending_non_posting');
assert.equal('ledger' in run, false, 'A02 run has no ledger mutation surface');
assert.equal('cash' in run, false, 'A02 run has no cash mutation surface');
const posted = structuredClone(run); posted.financeHandoffs[0].status = 'posted';
assert.throws(() => validateV3RunState(posted), { code: 'invalid_run_state' }, 'A02 run validation rejects a claimed A03 posting');
const nextDate = new Date(Date.parse(`${run.currentDate}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
assert.equal(day(run, nextDate).state.customerWorkOrders.length, 1, 'later days do not duplicate prior work orders');

// Adversarial mixed Shared Run: two own products and a real accepted customer order reserve the same personnel, machine and material pool.
const mixedOpenResult = openV3RunDay(run, { date: '2027-01-07' });
let mixedRun = mixedOpenResult.state;
const mixedInstructionId = 'run-regression-mixed-instruction';
mixedRun = planV3RunEquipmentInstruction(mixedRun, { instructionId: mixedInstructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-07', sourceRef: `instruction:${mixedInstructionId}` }).state;
mixedRun = completeV3RunEquipmentInstruction(mixedRun, { instructionId: mixedInstructionId }).state;
let mixedProductState = structuredClone(mixedRun.modules.product);
mixedProductState.finishedGoodsCapacity = 6;
for (const [productId, priceCents, variableCostCents] of [['mixed-positive', 10000, 1000], ['mixed-negative', 1000, 2000]]) {
  mixedProductState = createV3Product(mixedProductState, { productId, name: productId, targetSegment: 'small', marketCapabilities: ['turning'], unitStorage: 1, recipe: [{ materialId: 'steel', quantityPerUnit: 1 }] });
  mixedProductState = defineV3ProductSteps(mixedProductState, productId, [{ stepId: 'make', kind: 'production', hours: 2, requiredSkills: ['turning'], requiredEquipment: ['turning'], predecessors: [] }]);
  mixedProductState = estimateV3ProductWithBab(mixedProductState, productId, { period: '2027-01', offerDate: run.currentDate, netPriceCents: priceCents, directCosts: syntheticCostLines([{ id: 'material', amountCents: variableCostCents, variable: true }]), sourcePools: [{ poolId: 'POOL-' + productId, sourceCostCenterId: 'CC-ADMIN', costBasisId: 'BASIS-' + productId, period: '2027-01', poolCents: 100, allocationMode: 'keys', unitLabel: 'h', recipients: [{ costCenterId: 'CC-PROD', keyValue: '1' }] }], offerDrivers: [{ poolId: 'POOL-' + productId, costCenterId: 'CC-PROD', period: '2027-01', basisKind: 'driver', quantity: '1', unitLabel: 'h' }], costVersion: 'COST-' + productId, babVersion: 'BAB-' + productId });
  mixedProductState = planV3ProductStep(mixedProductState, { productId, stepId: 'make', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', outputQuantity: 2, materialQuantities: { steel: 2 } });
}
assert.ok(mixedProductState.products[0].costEstimate.calculation.dbICents > 0 && mixedProductState.products[1].costEstimate.calculation.dbICents < 0, 'mixed run uses explicit positive and negative product plan cases');
assert.ok(mixedProductState.products[0].costEstimate.calculation.resultAfterBabCents > 0 && mixedProductState.products[1].costEstimate.calculation.resultAfterBabCents < 0, 'shared mixed run has positive and negative results after BAB from explicit inputs');
mixedRun.modules.product = mixedProductState;
assert.equal(validateV3RunState(mixedRun), true, 'two product assignments can be restored inside a run with a real accepted customer order');
const mixedOpened = { state: mixedRun, result: mixedOpenResult.result };
let mixedDay = mixedOpened.state;
const mixedOrder = mixedDay.customerWorkOrders[0];
const mixedContract = { contractRef: 'contract:mixed-shared-run', inquiryId: mixedOrder.inquiryId, offerId: mixedOrder.offerId, decisionId: mixedOrder.decisionId, contractType: V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType, commercialTermsSnapshot: structuredClone(mixedOrder.contractTermsSnapshot), customerPartyId: mixedOrder.customerPartyId, buyerPartyId: 'buyer-mixed', acceptancePartyId: mixedOrder.customerPartyId, performanceCriterionRef: 'performance:mixed', acceptanceCriterionRef: 'acceptance:mixed', orderQuantity: 2, orderUnit: 'pieces' };
const mixedBeforeOverbook = JSON.stringify(mixedDay);
assert.throws(() => planV3RunWorkOrder(mixedDay, { workOrderId: mixedOrder.workOrderId, contractSnapshot: mixedContract, operations: [{ operationId: 'mixed-overbook', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 5, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } }] }), /daily capacity exceeded/, 'customer order cannot overbook the same worker and machine already reserved for two products');
assert.equal(JSON.stringify(mixedDay), mixedBeforeOverbook, 'rejected customer-vs-product overbooking does not mutate shared run state');
const mixedCustomerOperations = [
  { operationId: 'mixed-cut', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 1, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } },
  { operationId: 'mixed-finish', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 1, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: ['mixed-cut'], materials: { steel: 1 } },
];
mixedDay = planV3RunWorkOrder(mixedDay, { workOrderId: mixedOrder.workOrderId, contractSnapshot: mixedContract, operations: mixedCustomerOperations }).state;
for (const operation of mixedCustomerOperations) mixedDay = completeV3RunWorkOrderOperation(mixedDay, { workOrderId: mixedOrder.workOrderId, operationId: operation.operationId }).state;
assert.equal(mixedDay.modules.product.materials.find(row => row.id === 'steel').quantity, 8, 'customer operation consumes material from the same pool after two product reservations');
assert.equal(mixedDay.modules.product.finishedGoodsUsed, 2, 'completed customer output reserves two units in the shared finished-goods warehouse');
assert.equal(mixedDay.modules.product.customerFinishedGoods[0].status, 'reserved');
for (const assignment of [...mixedDay.modules.product.assignments]) {
  mixedDay = structuredClone(mixedDay);
  mixedDay.modules.product = completeV3ProductStep(mixedDay.modules.product, assignment.assignmentId);
  assert.equal(validateV3RunState(mixedDay), true, 'each product completion remains restore-valid inside the mixed shared run');
}
assert.deepEqual(mixedDay.modules.product.products.map(product => product.outputQuantity), [2, 2]);
assert.equal(mixedDay.modules.product.finishedGoodsUsed, 6, 'two own products and customer goods share the same finished-goods capacity');
assert.equal(mixedDay.modules.product.materials.find(row => row.id === 'steel').quantity, 4, 'product and customer operations reconcile against one material pool');
assert.equal(mixedDay.modules.product.assignments.every(row => row.personId === 'worker-1' && row.equipmentId === 'machine-1'), true, 'parallel own-product assignments share the same employee and machine constraints as customer work');
for (const [index, productId] of ['mixed-positive', 'mixed-negative'].entries()) {
  const assignment = mixedDay.modules.product.assignments.find(row => row.productId === productId && row.outputQuantity > 0);
  const total = index === 0 ? { materials: 1000, directLabor: 2000, machine: 1000, manufacturingOverhead: 500 } : { materials: 8000, directLabor: 5000, machine: 4000, manufacturingOverhead: 3000 };
  const productionSourceRefs = [assignment.assignmentId];
  const componentSourceRefs = getV3ProductCostSourceRefs(mixedDay.modules.product, productId, productionSourceRefs);
  mixedDay = recordV3RunProductCostLayer(mixedDay, { layerId: `COST-LOT|${productId}`, productId, productionDate: '2027-01-07', costComponentsCents: total, componentSourceRefs, productionSourceRefs }).state;
}
const mixedBuyerCandidates = mixedOpened.result.playerInquiries.filter(row => row.status === 'open' && row.segmentId === 'small' && row.requiredCapacity === 2 && row.requiredCapabilities.includes('turning'));
assert.ok(mixedBuyerCandidates.length >= 2, 'shared run fixture provides two real open buyer inquiries for the two products');
for (const [index, productId] of ['mixed-positive', 'mixed-negative'].entries()) {
  const buyer = mixedBuyerCandidates[index];
  const priceCents = productId === 'mixed-positive' ? 10000 : 1000;
  mixedDay = submitV3RunProductSaleOffer(mixedDay, { saleId: 'MIXED-SALE|' + productId, productId, sellerPartyId: 'player', buyerPartyId: buyer.customerId, inquiryId: buyer.inquiryId, quantity: 2, offerDate: '2027-01-07', decisionDate: '2027-01-08', netPriceCents: priceCents, offerSnapshotId: 'MIXED-PLAN|' + productId }).state;
}
assert.equal(mixedDay.modules.product.productSales.length, 2, 'both own products submitted an offer in the same shared run as the customer order');
assert.ok(mixedDay.modules.product.productSales.find(sale => sale.productId === 'mixed-positive').offerSnapshot.calculation.dbICents > 0, 'mixed-positive offer snapshot has a positive frozen DB I');
assert.ok(mixedDay.modules.product.productSales.find(sale => sale.productId === 'mixed-negative').offerSnapshot.calculation.dbICents < 0, 'mixed-negative offer snapshot has a negative frozen DB I');
assert.equal(mixedDay.modules.product.productSales.find(sale => sale.productId === 'mixed-positive').offerSnapshot.calculation.resultAfterBabCents, undefined, 'product sale snapshot does not infer an after-BAB result');
assert.equal(mixedDay.modules.product.productSales.find(sale => sale.productId === 'mixed-negative').offerSnapshot.calculation.resultAfterBabCents, undefined, 'uneconomic product sale snapshot also leaves BAB pending');
assert.ok(mixedDay.modules.product.productSales.every(sale => sale.offerSnapshot.babStatus === 'pending_deferred_bab' && sale.offerSnapshot.babCalculation === null));
const mixedFinanceBeforeSales = structuredClone(mixedDay.financeHandoffs);
mixedDay = closeV3RunDay(mixedDay, { date: '2027-01-07' }).state;
mixedDay = openV3RunDay(mixedDay, { date: '2027-01-08' }).state;
for (const [index, productId] of ['mixed-positive', 'mixed-negative'].entries()) {
  const sale = mixedDay.modules.product.productSales.find(row => row.productId === productId);
  mixedDay = recordV3RunProductSaleBuyerDecision(mixedDay, { saleId: sale.saleId, buyerPartyId: sale.buyerPartyId, decisionDate: '2027-01-08', accepted: true, decisionRef: 'MIXED-DECISION-' + index }).state;
}
assert.deepEqual(mixedDay.modules.product.products.map(product => product.outputQuantity), [0, 0], 'both named buyers accept and reserve the offered product quantities');
assert.equal(mixedDay.modules.product.finishedGoodsUsed, 6, 'accepted own-product sales remain physically stored until dispatch');
assert.ok(mixedDay.modules.product.productSales.every(sale => sale.cogsStatus === 'pending_deferred_bab'), 'buyer acceptance leaves full COGS pending until the later BAB/cost-source basis');
for (const [index, productId] of ['mixed-positive', 'mixed-negative'].entries()) {
  const sale = mixedDay.modules.product.productSales.find(row => row.productId === productId);
  mixedDay = dispatchV3RunProductSale(mixedDay, { saleId: sale.saleId, dispatchId: `MIXED-DISPATCH|${index}`, date: '2027-01-08', sourceRef: `MIXED-DISPATCH-SOURCE|${index}` }).state;
}
assert.equal(mixedDay.modules.product.finishedGoodsUsed, 2, 'explicit dispatch removes own products while customer goods remain stored');
assert.ok(mixedDay.modules.product.productSales.every(sale => sale.financeStatus === 'pending_non_posting'), 'dispatch does not create revenue or posting');
assert.deepEqual(mixedDay.financeHandoffs, mixedFinanceBeforeSales, 'buyer acceptance and dispatch create no additional financial handoff or posting');
assert.equal('ledger' in mixedDay, false, 'product offer, acceptance, and dispatch create no ledger surface or booking');
assert.ok(mixedDay.modules.product.productSales.every(sale => sale.revenueStatus === 'pending_non_posting' && sale.cogsStatus === 'pending_deferred_bab' && !Object.hasOwn(sale, 'cogsCents')), 'dispatch keeps COGS pending even when an illustrative test layer exists');
assert.equal(mixedDay.modules.product.productCostMovements.length, 2, 'legacy test layers are allocated in a separate illustrative FIFO movement');
assert.ok(mixedDay.modules.product.productCostMovements.every(movement => movement.valuationKind === 'illustrative_fifo'), 'FIFO allocations are explicitly separate from COGS');
assert.ok(mixedDay.modules.product.productCostLayers.every(layer => layer.quantityRemaining === 0 && layer.remainingCostCents === 0), 'illustrative FIFO quantity allocations follow physical dispatch quantity');
const mixedRestored = JSON.parse(JSON.stringify(mixedDay));
assert.equal(validateV3RunState(mixedRestored), true, 'JSON save/restore round-trip passes after both product acceptances and dispatches');
assert.deepEqual(mixedRestored.modules.product.assignments.map(row => [row.assignmentId, row.productId, row.stepId, row.date, row.status]), mixedDay.modules.product.assignments.map(row => [row.assignmentId, row.productId, row.stepId, row.date, row.status]), 'save/restore preserves product work identities and dates');
assert.deepEqual(mixedRestored.modules.product.productSales.map(sale => [sale.saleId, sale.offerSnapshot.snapshotId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babStatus]), mixedDay.modules.product.productSales.map(sale => [sale.saleId, sale.offerSnapshot.snapshotId, sale.offerSnapshot.period, sale.offerSnapshot.costVersion, sale.offerSnapshot.babStatus]), 'save/restore preserves frozen direct-cost snapshots and deferred BAB status');
assert.equal(validateV3RunState(mixedDay), true, 'mixed two-product/customer-order shared run survives restore-shaped validation after buyer decisions');
// Accepted work order → explicit contract/operation plan → ordered daily work, with finance still pending.
let workDay = openV3RunDay(run, { date: '2027-01-07' }).state;
const workInstructionId = 'run-regression-work-instruction';
workDay = planV3RunEquipmentInstruction(workDay, { instructionId: workInstructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-07', sourceRef: `instruction:${workInstructionId}` }).state;
workDay = completeV3RunEquipmentInstruction(workDay, { instructionId: workInstructionId }).state;
const acceptedOrder = workDay.customerWorkOrders[0];
assert.equal(acceptedOrder.customerPartyId, 'customer-1', 'work order customer is derived from the scheduled market inquiry');
const contractSnapshot = { contractRef: 'contract:offer-snapshot-1', inquiryId: acceptedOrder.inquiryId, offerId: acceptedOrder.offerId, decisionId: acceptedOrder.decisionId, contractType: V3_METAL_GOODS_CONTRACT_CLASSIFICATION.contractType, commercialTermsSnapshot: structuredClone(acceptedOrder.contractTermsSnapshot), customerPartyId: acceptedOrder.customerPartyId, buyerPartyId: 'buyer-1', acceptancePartyId: acceptedOrder.customerPartyId, performanceCriterionRef: 'performance:1', acceptanceCriterionRef: 'acceptance:1', orderQuantity: 2, orderUnit: 'pieces' };
const operations = [
  { operationId: 'cut', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 3, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: [], materials: { steel: 1 } },
  { operationId: 'finish', date: '2027-01-07', personId: 'worker-1', equipmentId: 'machine-1', hours: 2, requiredSkills: ['turning'], requiredEquipmentCapabilities: ['turning'], predecessors: ['cut'], materials: { steel: 1 } },
];
const planResult = planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot, operations });
workDay = planResult.state;
assert.throws(() => planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot: { ...contractSnapshot, customerPartyId: 'player', acceptancePartyId: 'player' }, operations }), { code: 'contract_source_mismatch' }, 'seller cannot name itself as customer/acceptance party');
assert.throws(() => planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot: { ...contractSnapshot, customerPartyId: 'different-customer' }, operations }), { code: 'contract_source_mismatch' }, 'contract customer must match the accepted inquiry customer');
assert.throws(() => planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot: { ...contractSnapshot, acceptancePartyId: 'recipient-1' }, operations }), { code: 'contract_source_mismatch' }, 'distinct recipient without explicit authority evidence is rejected');
assert.equal(workDay.customerWorkOrders[0].status, 'in_progress');
assert.equal(planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot, operations }).duplicate, true, 'identical work-plan replay is a no-op');
assert.throws(() => planV3RunWorkOrder(workDay, { workOrderId: acceptedOrder.workOrderId, contractSnapshot: { ...contractSnapshot, acceptanceCriterionRef: 'changed' }, operations }), { code: 'run_plan_payload_conflict' });
const deliveryInput = { deliveryId: 'delivery-1', sourceRef: 'fixture-delivery-source-1', workOrderId: acceptedOrder.workOrderId, deliveryDate: '2027-01-07', recipientPartyId: contractSnapshot.acceptancePartyId, deliveryCriterionRef: contractSnapshot.performanceCriterionRef, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef, quantity: contractSnapshot.orderQuantity, unit: contractSnapshot.orderUnit };
assert.throws(() => deliverV3RunCustomerWorkOrder(workDay, deliveryInput), { code: 'work_order_not_ready_for_delivery' }, 'delivery is blocked until every T-0066 operation is completed');
assert.throws(() => recordV3RunCustomerAcceptanceDecision(workDay, { decisionId: 'cust-decision-premature', sourceRef: 'fixture-premature', workOrderId: acceptedOrder.workOrderId, deliveryId: 'delivery-1', decisionDate: '2027-01-07', decision: 'accept', actorRole: 'customer', actorPartyId: acceptedOrder.customerPartyId, customerRef: acceptedOrder.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef }), { code: 'customer_decision_delivery_mismatch' }, 'customer decision requires a persisted delivery first');
assert.throws(() => completeV3RunWorkOrderOperation(workDay, { workOrderId: acceptedOrder.workOrderId, operationId: 'finish' }), /predecessor cut is not complete/);
const afterCut = completeV3RunWorkOrderOperation(workDay, { workOrderId: acceptedOrder.workOrderId, operationId: 'cut' });
workDay = afterCut.state;
const steelAfterCut = workDay.modules.product.materials[0].quantity;
assert.equal(completeV3RunWorkOrderOperation(workDay, { workOrderId: acceptedOrder.workOrderId, operationId: 'cut' }).duplicate, true);
assert.equal(completeV3RunWorkOrderOperation(workDay, { workOrderId: acceptedOrder.workOrderId, operationId: 'cut' }).state.modules.product.materials[0].quantity, steelAfterCut, 'operation replay cannot consume material twice');
workDay = completeV3RunWorkOrderOperation(workDay, { workOrderId: acceptedOrder.workOrderId, operationId: 'finish' }).state;
assert.equal(workDay.customerWorkOrders[0].status, 'ready_for_delivery');
assert.equal(workDay.customerWorkOrders[0].financeStatus, 'performance_pending');
assert.equal(workDay.financeHandoffs[0].status, 'pending_non_posting', 'no delivery, acceptance or A03 posting is inferred from completed work');
assert.equal(workDay.modules.product.materials[0].quantity, steelAfterCut - 1);
assert.equal(workDay.modules.product.finishedGoodsUsed, 2, 'completed customer order reserves its finished goods before shipment');
assert.equal(workDay.modules.product.finishedGoodsMovements.filter(row => row.workOrderId === acceptedOrder.workOrderId).length, 1, 'customer output has one stable warehouse receipt evidence row');
assert.equal(workDay.dayEvents.some(event => /delivery|acceptance|invoice|payment|revenue/i.test(event.phase)), false);
const cancellationInput = { cancellationId: 'cancel-before-shipment-1', sourceRef: 'fixture-cancel-before-shipment', workOrderId: acceptedOrder.workOrderId, cancellationDate: '2027-01-07', actorRole: 'customer', actorPartyId: acceptedOrder.customerPartyId, customerRef: acceptedOrder.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef };
const cancelledBeforeShipment = cancelV3RunCustomerWorkOrderBeforeShipment(workDay, cancellationInput);
assert.equal(cancelledBeforeShipment.result.status, 'cancelled_before_shipment_nonposting');
assert.equal(cancelledBeforeShipment.state.customerWorkOrders[0].status, 'cancelled_before_shipment');
assert.equal(cancelledBeforeShipment.state.modules.product.finishedGoodsUsed, 2, 'pre-shipment cancellation releases reservation but physical goods remain in the warehouse');
assert.equal(cancelledBeforeShipment.state.modules.product.customerFinishedGoods[0].status, 'available');
const cancelMovement = cancelledBeforeShipment.state.modules.product.finishedGoodsMovements.find(row => row.kind === 'customer_reservation_released_before_shipment');
assert.equal(cancelMovement.stockBefore, cancelMovement.stockAfter);
assert.ok(cancelMovement.reservedAfter < cancelMovement.reservedBefore);
assert.equal(cancelV3RunCustomerWorkOrderBeforeShipment(cancelledBeforeShipment.state, structuredClone(cancellationInput)).duplicate, true, 'cancellation replay is idempotent');
assert.throws(() => deliverV3RunCustomerWorkOrder(cancelledBeforeShipment.state, deliveryInput), { code: 'work_order_not_ready_for_delivery' }, 'a cancelled pre-shipment order cannot later be shipped');
const productBeforeDelivery = structuredClone(workDay.modules.product); const handoffsBeforeDelivery = structuredClone(workDay.financeHandoffs); const orderBeforeDelivery = structuredClone(workDay.customerWorkOrders);
const delivered = deliverV3RunCustomerWorkOrder(workDay, deliveryInput);
workDay = delivered.state;
assert.equal(delivered.result.status, 'delivered_pending_customer_decision');
assert.equal(delivered.result.financeStatus, 'pending_non_posting');
const deliveredState = structuredClone(workDay);
assert.equal(productBeforeDelivery.finishedGoodsUsed, 2);
assert.equal(workDay.modules.product.finishedGoodsUsed, 0, 'physical customer shipment removes goods from shared finished-goods storage');
assert.equal(workDay.modules.product.finishedGoodsMovements.filter(row => row.workOrderId === acceptedOrder.workOrderId && row.kind === 'customer_goods_shipped').length, 1, 'delivery creates exactly one stock-abgang movement');
assert.notDeepEqual(workDay.modules.product, productBeforeDelivery, 'delivery changes only stock/movement evidence, not plan costs or finances');
assert.deepEqual(workDay.financeHandoffs, handoffsBeforeDelivery, 'delivery handoff cannot post or alter finance');
assert.deepEqual(workDay.customerWorkOrders, orderBeforeDelivery, 'delivery handoff does not invent new work-order/product statuses');
assert.equal(deliverV3RunCustomerWorkOrder(workDay, structuredClone(deliveryInput)).duplicate, true, 'identical delivery replay is a no-op');
assert.throws(() => deliverV3RunCustomerWorkOrder(workDay, { ...deliveryInput, quantity: 1 }), { code: 'run_delivery_payload_conflict' }, 'same delivery ID with changed payload is rejected');
assert.throws(() => deliverV3RunCustomerWorkOrder(workDay, { ...deliveryInput, deliveryId: 'delivery-2' }), { code: 'work_order_already_delivered' }, 'second delivery event for the same order is rejected');
const productAfterDelivery = structuredClone(workDay.modules.product);
const customerDecisionInput = { decisionId: 'customer-decision-1', sourceRef: 'fixture-customer-decision-1', workOrderId: acceptedOrder.workOrderId, deliveryId: deliveryInput.deliveryId, decisionDate: '2027-01-07', decision: 'accept', actorRole: 'customer', actorPartyId: acceptedOrder.customerPartyId, customerRef: acceptedOrder.customerPartyId, authorizedForRef: null, partyAuthorityRef: null, acceptanceCriterionRef: contractSnapshot.acceptanceCriterionRef };
assert.throws(() => recordV3RunCustomerAcceptanceDecision(workDay, { ...customerDecisionInput, actorRole: 'contractor' }), { code: 'invalid_customer_decision_input' }, 'contractor/unknown authority cannot submit a customer decision');
assert.throws(() => recordV3RunCustomerAcceptanceDecision(workDay, { ...customerDecisionInput, actorPartyId: 'player', customerRef: 'player' }), { code: 'customer_decision_authority_mismatch' }, 'seller cannot self-identify as the customer');
assert.throws(() => recordV3RunCustomerAcceptanceDecision(workDay, { ...customerDecisionInput, actorRole: 'recipient', actorPartyId: 'recipient-1' }), { code: 'customer_decision_authority_mismatch' }, 'recipient cannot decide without contract-bound authority');
let rejectedRun = structuredClone(deliveredState);
const rejectedDecision = recordV3RunCustomerAcceptanceDecision(rejectedRun, { ...customerDecisionInput, decisionId: 'customer-rejection-1', sourceRef: 'fixture-customer-rejection-1', decision: 'reject' });
rejectedRun = rejectedDecision.state;
assert.equal(rejectedRun.modules.product.finishedGoodsUsed, 0, 'rejection after shipment does not infer an immediate physical return');
assert.throws(() => recordV3RunCustomerGoodsReturn(rejectedRun, { returnId: 'return-before-date', sourceRef: 'bad-return', workOrderId: acceptedOrder.workOrderId, deliveryId: deliveryInput.deliveryId, returnDate: '2027-01-07', quantity: 2, unit: 'pieces' }), { code: 'customer_return_not_after_rejection' }, 'return movement requires a separate later physical event');
rejectedRun = closeV3RunDay(rejectedRun, { date: '2027-01-07' }).state;
rejectedRun = openV3RunDay(rejectedRun, { date: '2027-01-08' }).state;
const returnInput = { returnId: 'return-1', sourceRef: 'fixture-return-1', workOrderId: acceptedOrder.workOrderId, deliveryId: deliveryInput.deliveryId, returnDate: '2027-01-08', quantity: 2, unit: 'pieces' };
const shippedProductForOverflow = structuredClone(rejectedRun.modules.product);
const returnedGoods = recordV3RunCustomerGoodsReturn(rejectedRun, returnInput);
rejectedRun = returnedGoods.state;
assert.equal(rejectedRun.modules.product.finishedGoodsUsed, 2, 'explicit return re-enters physical goods into warehouse capacity');
assert.equal(rejectedRun.modules.product.customerFinishedGoods[0].status, 'returned_quarantine');
assert.equal(rejectedRun.modules.product.finishedGoodsMovements.filter(row => row.kind === 'customer_rejected_goods_returned').length, 1);
const quarantineMovement = rejectedRun.modules.product.finishedGoodsMovements.find(row => row.kind === 'customer_rejected_goods_returned');
assert.deepEqual([quarantineMovement.physicalQuantityBefore, quarantineMovement.physicalQuantityAfter, quarantineMovement.reservedQuantityAfter, quarantineMovement.quarantinedQuantityBefore, quarantineMovement.quarantinedQuantityAfter, quarantineMovement.availableQuantityAfter], [0, 2, 0, 0, 2, 0], 'returned customer lot adds physical stock to quarantine and exposes zero available quantity');
assert.equal(recordV3RunCustomerGoodsReturn(rejectedRun, structuredClone(returnInput)).duplicate, true, 'return movement replay is idempotent');
assert.equal(validateV3RunState(rejectedRun), true);
const overflowReturnState = shippedProductForOverflow; overflowReturnState.finishedGoodsCapacity = 1;
const beforeOverflowReturn = structuredClone(overflowReturnState);
assert.throws(() => recordV3CustomerFinishedGoodsReturn(overflowReturnState, { returnId: 'return-overflow', sourceRef: 'fixture-return-overflow', workOrderId: acceptedOrder.workOrderId, deliveryId: deliveryInput.deliveryId, date: '2027-01-08', quantity: 2, unit: 'pieces' }), /storage capacity exceeded/, 'return overflow fails closed');
assert.deepEqual(overflowReturnState, beforeOverflowReturn, 'failed overflow return leaves deep state, movement and event identity unchanged');
const pairedTamper = structuredClone(rejectedRun);
const returnMovement = pairedTamper.modules.product.finishedGoodsMovements.find(row => row.kind === 'customer_rejected_goods_returned');
returnMovement.quantity += 1;
const mirroredMovementEvent = pairedTamper.modules.product.events.find(row => row.type === 'finished_goods_movement' && row.movement.movementId === returnMovement.movementId);
mirroredMovementEvent.movement.quantity += 1;
const returnSource = pairedTamper.modules.product.events.find(row => row.type === 'customer_goods_return_source' && row.sourceRef === returnMovement.sourceRef);
returnSource.quantity += 1;
assert.throws(() => validateV3RunState(pairedTamper), { code: 'invalid_run_state' }, 'paired movement/source-event tampering is rejected by immutable run return evidence');
const acceptedDecision = recordV3RunCustomerAcceptanceDecision(workDay, customerDecisionInput);
const acceptedState = acceptedDecision.state;
assert.equal(acceptedDecision.result.status, 'accepted_non_posting');const stateBeforeEvidenceRead = structuredClone(acceptedState);
const acceptedEvidence = getV3RunCustomerEvidence(acceptedState, acceptedOrder.workOrderId);
assert.equal(acceptedEvidence.evidenceStatus, 'customer_decision_recorded');
assert.equal(acceptedEvidence.financeStatus, 'pending_non_posting');
assert.equal(acceptedEvidence.postingEffect, 'none');
assert.equal(acceptedEvidence.orderRefs.offerId, acceptedOrder.offerId, 'accepted offer is referenced but not converted into an invoice position');
const acceptedMarketOffer = acceptedState.modules.market.inquiries.find(row => row.inquiryId === acceptedOrder.inquiryId).offers.find(row => row.offerId === acceptedOrder.offerId);
assert.deepEqual(acceptedEvidence.orderRefs.acceptedNetR, { amountCents: acceptedMarketOffer.netPriceCents, currency: 'EUR', offerSnapshotRef: acceptedMarketOffer.calculationSnapshot.offerId, submissionEventId: acceptedMarketOffer.submittedEventId }, 'D-0166 source fact preserves frozen net R and its accepted offer snapshot without creating an invoice line');
assert.equal(acceptedEvidence.orderRefs.acceptedNetR.amountCents, 90000);
assert.equal(acceptedEvidence.orderRefs.acceptedNetR.offerSnapshotRef, acceptedOrder.offerId);
assert.equal(acceptedEvidence.operations.length, 2);
assert.deepEqual(acceptedEvidence.operations.find(row => row.operationId === 'cut').materialsConsumed, { steel: 1 }, 'completed operation exposes only its configured, already-consumed material quantity');
assert.equal(acceptedEvidence.delivery.deliveryDate, deliveryInput.deliveryDate);
assert.equal(acceptedEvidence.customerDecision.decision, 'accept');
assert.equal(acceptedEvidence.invoiceEvent, null, 'no invoice event is inferred from customer acceptance');
assert.equal(acceptedEvidence.paymentEvent, null, 'no payment event is inferred from customer acceptance');
assert.deepEqual(acceptedState, stateBeforeEvidenceRead, 'evidence projection is read-only');
assert.throws(() => getV3RunCustomerEvidence(acceptedState, 'missing-work-order'), { code: 'unknown_customer_work_order' });
assert.equal(acceptedDecision.result.financeStatus, 'pending_non_posting');
assert.deepEqual(acceptedState.modules.product, productAfterDelivery, 'customer acceptance does not mutate product inventory beyond the already recorded shipment');
assert.deepEqual(acceptedState.financeHandoffs, handoffsBeforeDelivery, 'customer acceptance does not create a financial posting');
assert.equal(recordV3RunCustomerAcceptanceDecision(acceptedState, structuredClone(customerDecisionInput)).duplicate, true, 'identical customer decision replay is a no-op');
assert.throws(() => recordV3RunCustomerAcceptanceDecision(acceptedState, { ...customerDecisionInput, decision: 'reject' }), { code: 'run_customer_decision_payload_conflict' }, 'same decision ID with changed payload is rejected');
assert.throws(() => recordV3RunCustomerAcceptanceDecision(acceptedState, { ...customerDecisionInput, decisionId: 'customer-decision-2' }), { code: 'delivery_already_decided' }, 'a delivery cannot receive a second customer decision');
const forgedCustomerDecision = structuredClone(acceptedState); forgedCustomerDecision.dayEvents.find(event => event.phase === 'customer_acceptance_decision').result.actorPartyId = 'player';
assert.throws(() => validateV3RunState(forgedCustomerDecision), { code: 'invalid_run_state' }, 'restored actor tampering is rejected against contract authority');
const forgedCustomerBinding = structuredClone(acceptedState); forgedCustomerBinding.customerWorkOrders[0].customerPartyId = 'player';
assert.throws(() => validateV3RunState(forgedCustomerBinding), { code: 'invalid_run_state' }, 'restored work-order customer must remain bound to market inquiry customer');
const forgedInquiryCustomer = structuredClone(acceptedState); forgedInquiryCustomer.modules.market.inquiries[0].customerId = 'player';
assert.throws(() => validateV3RunState(forgedInquiryCustomer), { code: 'invalid_market_state' }, 'restored inquiry customer remains bound to its scheduled market template');
const forgedDelivery = structuredClone(acceptedState); forgedDelivery.dayEvents.find(event => event.phase === 'customer_delivery').result.acceptanceCriterionRef = 'fabricated-criterion';
assert.throws(() => validateV3RunState(forgedDelivery), { code: 'invalid_run_state' }, 'restored delivery criterion tampering is rejected against the contract');
const rejectedState = recordV3RunCustomerAcceptanceDecision(delivered.state, { ...customerDecisionInput, decisionId: 'customer-rejection-1', sourceRef: 'fixture-customer-rejection-1', decision: 'reject' }).state;
assert.equal(rejectedState.dayEvents.find(event => event.phase === 'customer_acceptance_decision').result.status, 'rejected_non_posting', 'negative outcome is persisted as a customer-owned decision event');const rejectedEvidence = getV3RunCustomerEvidence(rejectedState, acceptedOrder.workOrderId);
assert.equal(rejectedEvidence.customerDecision.decision, 'reject');
assert.equal(rejectedEvidence.evidenceStatus, 'customer_decision_recorded');
assert.equal(rejectedEvidence.postingEffect, 'none', 'rejection remains non-posting evidence for A03 review');
assert.equal(validateV3RunState(structuredClone(acceptedState)), true, 'delivery and recipient decision restore with bound event provenance');

// D-0157 F3: delivery date excluded; the fifth following weekday emits customer-side event at phase 6.
let f3State = delivered.state;
f3State = closeV3RunDay(f3State, { date: '2027-01-07' }).state;
for (const date of ['2027-01-08', '2027-01-09', '2027-01-10', '2027-01-11', '2027-01-12', '2027-01-13']) {
  f3State = openV3RunDay(f3State, { date }).state;
  assert.equal(f3State.dayEvents.some(event => event.phase === 'customer_acceptance_decision'), false, date + ' is before the fifth working day after delivery');
  f3State = closeV3RunDay(f3State, { date }).state;
}
f3State = openV3RunDay(f3State, { date: '2027-01-14' }).state;
assert.equal(f3State.dayEvents.some(event => event.phase === 'customer_acceptance_decision'), false, 'automatic F3 consequence waits for day-end acceptance phase');
const financeBeforeF3 = structuredClone(f3State.financeHandoffs);
const productBeforeF3 = structuredClone(f3State.modules.product);
const f3Closed = closeV3RunDay(f3State, { date: '2027-01-14' });
f3State = f3Closed.state;
const f3DecisionEvent = f3State.dayEvents.find(event => event.phase === 'customer_acceptance_decision');
assert.ok(f3DecisionEvent, 'the fifth working day creates the F3 customer-side event');
assert.equal(f3DecisionEvent.occurredAt, '2027-01-14');
assert.equal(f3DecisionEvent.result.decision, 'accept');
assert.equal(f3DecisionEvent.result.actorRole, 'customer');
assert.equal(f3DecisionEvent.result.actorPartyId, acceptedOrder.customerPartyId);
assert.equal(f3DecisionEvent.result.decisionId, 'SIM|D-0157|F3|' + encodeURIComponent(acceptedOrder.workOrderId));
assert.deepEqual(f3State.financeHandoffs, financeBeforeF3, 'F3 acceptance does not post finance');
assert.deepEqual(f3State.modules.product, productBeforeF3, 'F3 acceptance does not mutate inventory/operations');
assert.equal('ledger' in f3State, false);
assert.equal('cash' in f3State, false);
assert.ok(f3Closed.result.eventOrder.includes('customer_acceptance_decision'), 'F3 decision is in acceptance phase before daily close');
assert.equal(closeV3RunDay(f3State, { date: '2027-01-14' }).duplicate, true, 'closing/replaying does not duplicate the F3 event');
assert.equal(f3State.dayEvents.filter(event => event.phase === 'customer_acceptance_decision').length, 1);
assert.equal(validateV3RunState(JSON.parse(JSON.stringify(f3State))), true, 'automatic F3 event validates after JSON export/restore');
assert.deepEqual(JSON.parse(JSON.stringify(f3State)).dayEvents.filter(event => event.phase === 'customer_acceptance_decision'), f3State.dayEvents.filter(event => event.phase === 'customer_acceptance_decision'), 'automatic F3 decision survives JSON export/restore with its bindings');

let f3Rejected = delivered.state;
f3Rejected = closeV3RunDay(f3Rejected, { date: '2027-01-07' }).state;
for (const date of ['2027-01-08', '2027-01-09', '2027-01-10', '2027-01-11', '2027-01-12', '2027-01-13']) {
  f3Rejected = closeV3RunDay(openV3RunDay(f3Rejected, { date }).state, { date }).state;
}
f3Rejected = openV3RunDay(f3Rejected, { date: '2027-01-14' }).state;
f3Rejected = recordV3RunCustomerAcceptanceDecision(f3Rejected, {
  ...customerDecisionInput, decisionId: 'customer-reject-f3', sourceRef: 'customer-reject-f3-source',
  decisionDate: '2027-01-14', decision: 'reject',
}).state;
f3Rejected = closeV3RunDay(f3Rejected, { date: '2027-01-14' }).state;
assert.equal(f3Rejected.dayEvents.filter(event => event.phase === 'customer_acceptance_decision').length, 1, 'an explicit customer rejection on the fifth workday suppresses automatic F3 acceptance');
assert.equal(f3Rejected.dayEvents.find(event => event.phase === 'customer_acceptance_decision').result.status, 'rejected_non_posting');

assert.throws(() => recordV3RunCustomerAcceptanceDecision(f3State, { ...customerDecisionInput, decisionId: 'seller-trigger', sourceRef: 'seller-trigger-source', decisionDate: '2027-01-14', actorRole: 'contractor', actorPartyId: 'player' }), { code: 'invalid_customer_decision_input' }, 'seller cannot trigger customer-side F3 acceptance');

// A distinct recipient is valid only when contract snapshot and customer-side event carry matching authority references.
let recipientDay = openV3RunDay(run, { date: '2027-01-07' }).state;
const recipientInstructionId = 'run-regression-recipient-instruction';
recipientDay = planV3RunEquipmentInstruction(recipientDay, { instructionId: recipientInstructionId, personId: 'worker-1', equipmentId: 'machine-1', plannedDate: '2027-01-07', sourceRef: `instruction:${recipientInstructionId}` }).state;
recipientDay = completeV3RunEquipmentInstruction(recipientDay, { instructionId: recipientInstructionId }).state;
const recipientOrder = recipientDay.customerWorkOrders[0];
const recipientContract = { ...contractSnapshot, contractRef: 'contract:recipient-authority', acceptancePartyId: 'recipient-1', authorizedForRef: recipientOrder.customerPartyId, partyAuthorityRef: 'authority:recipient-1-for-customer-1' };
recipientDay = planV3RunWorkOrder(recipientDay, { workOrderId: recipientOrder.workOrderId, contractSnapshot: recipientContract, operations }).state;
recipientDay = completeV3RunWorkOrderOperation(recipientDay, { workOrderId: recipientOrder.workOrderId, operationId: 'cut' }).state;
recipientDay = completeV3RunWorkOrderOperation(recipientDay, { workOrderId: recipientOrder.workOrderId, operationId: 'finish' }).state;
const recipientDelivery = { ...deliveryInput, deliveryId: 'delivery-recipient', sourceRef: 'fixture-delivery-recipient', workOrderId: recipientOrder.workOrderId, recipientPartyId: recipientContract.acceptancePartyId };
recipientDay = deliverV3RunCustomerWorkOrder(recipientDay, recipientDelivery).state;
const recipientDecision = { decisionId: 'recipient-decision-1', sourceRef: 'fixture-recipient-decision-1', workOrderId: recipientOrder.workOrderId, deliveryId: recipientDelivery.deliveryId, decisionDate: '2027-01-07', decision: 'accept', actorRole: 'recipient', actorPartyId: recipientContract.acceptancePartyId, customerRef: recipientOrder.customerPartyId, authorizedForRef: recipientOrder.customerPartyId, partyAuthorityRef: recipientContract.partyAuthorityRef, acceptanceCriterionRef: recipientContract.acceptanceCriterionRef };
assert.throws(() => recordV3RunCustomerAcceptanceDecision(recipientDay, { ...recipientDecision, partyAuthorityRef: 'wrong-authority-ref' }), { code: 'customer_decision_authority_mismatch' }, 'recipient decision rejects mismatched authority proof');
const recipientResult = recordV3RunCustomerAcceptanceDecision(recipientDay, recipientDecision);
assert.equal(recipientResult.result.status, 'accepted_non_posting', 'explicitly authorized recipient can decide for bound customer');
assert.equal(recordV3RunCustomerAcceptanceDecision(recipientResult.state, structuredClone(recipientDecision)).duplicate, true, 'recipient decision replay is idempotent');
assert.equal(validateV3RunState(structuredClone(recipientResult.state)), true, 'recipient authority identity/refs restore against contract and market order');

// Automatic D-0157 F3 also attributes the event to the contract-bound alternate recipient.
let recipientF3State = closeV3RunDay(recipientDay, { date: '2027-01-07' }).state;
for (const date of ['2027-01-08', '2027-01-09', '2027-01-10', '2027-01-11', '2027-01-12', '2027-01-13']) {
  recipientF3State = closeV3RunDay(openV3RunDay(recipientF3State, { date }).state, { date }).state;
}
recipientF3State = closeV3RunDay(openV3RunDay(recipientF3State, { date: '2027-01-14' }).state, { date: '2027-01-14' }).state;
const recipientF3Event = recipientF3State.dayEvents.find(event => event.phase === 'customer_acceptance_decision');
assert.equal(recipientF3Event.result.actorRole, 'recipient');
assert.equal(recipientF3Event.result.actorPartyId, recipientContract.acceptancePartyId);
assert.equal(recipientF3Event.result.authorizedForRef, recipientOrder.customerPartyId);
assert.equal(recipientF3Event.result.partyAuthorityRef, recipientContract.partyAuthorityRef);
assert.equal(validateV3RunState(JSON.parse(JSON.stringify(recipientF3State))), true, 'authorized-recipient F3 event validates after JSON export/restore');

workDay = closeV3RunDay(acceptedState, { date: '2027-01-07' }).state;
assert.equal(validateV3RunState(workDay), true);
assert.equal(deliverV3RunCustomerWorkOrder(workDay, structuredClone(deliveryInput)).duplicate, true, 'identical delivery replay remains a no-op after day close');
const forgedCompletedOrder = structuredClone(workDay);
forgedCompletedOrder.customerWorkOrders[0].status = 'delivered';
forgedCompletedOrder.customerWorkOrders[0].financeStatus = 'posted';
forgedCompletedOrder.modules.product.customerWorkOrderPlans[0].status = 'delivered';
forgedCompletedOrder.modules.product.customerWorkOrderPlans[0].financeStatus = 'posted';
assert.throws(() => validateV3RunState(forgedCompletedOrder), { code: 'invalid_run_state' }, 'restored delivered/posted status is rejected without an authorized execution phase');

// No undeclared fixture, flow, or event is silently fabricated on an otherwise empty day.
const empty = day(newRun(), '2027-01-04');
assert.equal(empty.result.receivedInquiryIds.length, 0);
assert.deepEqual(empty.result.eventOrder, ['market_decisions_and_inquiries', 'market_expiry']);
console.log('V3 run orchestrator regressions: PASS');
