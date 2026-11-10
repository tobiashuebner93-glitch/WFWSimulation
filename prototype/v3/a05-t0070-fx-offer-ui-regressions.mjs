import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderRunOfferFxForm, renderRunOfferFxPreview } from './run.js';

const inquiry = { inquiryId: 'INQ-UI-1', status: 'open', ownOffer: null };
const form = renderRunOfferFxForm(inquiry);
assert.match(form, /<form class="fx-offer-plan-form" data-inquiry="INQ-UI-1">/);
assert.match(form, /name="planBasisEuros"[^>]*required/);
assert.match(form, /name="importExposureFactor"[^>]*required/);
assert.match(form, /type="submit">Planvorschau berechnen/);
assert.match(form, /synthetische Lernannahme/i);
assert.match(form, /kein Lieferantenangebot und kein ECB-Transaktionskurs/i);
assert.doesNotMatch(form, /name="netPrice"|<form class="offer-form"/);
assert.equal(renderRunOfferFxForm({ ...inquiry, status: 'closed' }), '');
assert.equal(renderRunOfferFxForm({ ...inquiry, ownOffer: { status: 'submitted' } }), '');

const readyResult = {
  status: 'ready', planBasisCents: 100000, hypotheticalPlanCents: 101250,
  deltaCents: 1250, effectivePeriod: '2027-03', observedPeriod: '2027-02',
  lagPeriods: 1, assumptionId: 'synthetic-test-only', passThroughRate: 0.25,
  monthlyCapPct: 2, sourceRef: 'synthetic-fixture:T0070', fxSeriesRef: 'synthetic-fixture:T-0070:USD-EUR:v1',
};
const before = structuredClone(readyResult);
const readyHtml = renderRunOfferFxPreview(readyResult);
assert.match(readyHtml, /data-preview-status="ready"/);
assert.match(readyHtml, /1\.000,00 € → 1\.012,50 €/);
assert.match(readyHtml, /Netto-Angebot R/);
assert.match(readyHtml, /nicht gebucht/);
assert.match(readyHtml, /invers zur Fixture-Quote EUR je USD/);
assert.match(readyHtml, /synthetic-fixture:T-0070:USD-EUR:v1/);
assert.deepEqual(readyResult, before, 'rendering preview does not mutate its result');

const neutralHtml = renderRunOfferFxPreview({ status: 'neutral', reason: 'kein Fixture' });
assert.match(neutralHtml, /data-preview-status="neutral"/);
assert.match(neutralHtml, /Keine FX-Wirkung/);
const blockedHtml = renderRunOfferFxPreview({ status: 'blocked', reason: 'Anfrage geschlossen' });
assert.match(blockedHtml, /data-preview-status="blocked"/);
assert.match(blockedHtml, /Vorschau gesperrt/);

const html = await readFile(new URL('./run.html', import.meta.url), 'utf8');
assert.match(html, /name="fxOfferPlanFixtureId"/);
assert.match(html, /value="NEUTRAL" selected>Neutral · keine FX-Planvorschau/);
assert.match(html, /nur vor dem Start möglich/i);

console.log('A05 T-0070 FX offer preview UI regressions: PASS');
