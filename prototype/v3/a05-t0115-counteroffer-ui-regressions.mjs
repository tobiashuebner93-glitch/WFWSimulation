import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const runUi = readFileSync(new URL('./run.js', import.meta.url), 'utf8');

assert.match(runUi, /Kunden-Gegenangebot annehmen · Vertrag sofort schließen/);
assert.match(runUi, /Niedrigeren Preis anbieten · Entscheidung in 1–3 Tagen/);
assert.match(runUi, /cents===counterPrice/);
assert.match(runUi, /data-counter-price-cents=/);
assert.match(runUi, /sent\.result\?\.contractCreated===true/);
assert.match(runUi, /Der Vertrag ist sofort geschlossen und der Auftrag angelegt/);
assert.match(runUi, /Kundenentscheidung erwartet bis/);
assert.match(runUi, /finanzielle Wirkung entsteht erst durch die getrennten Leistungs-\/Rechnungsereignisse/);
assert.match(runUi, /Vor Vertragsschluss entsteht aus der Verhandlung weder ein Auftrag noch eine Finanzwirkung/);
assert.match(runUi, /Der Vertrag und Auftrag sind geschlossen\. Die Verhandlung selbst erzeugt keine Finanzbuchung/);
assert.match(runUi, /const footer=n\.status===\"accepted\"/);
assert.doesNotMatch(runUi, /Ein Gegenangebot erzeugt noch keinen Auftrag oder Zahlungseingang/);
assert.doesNotMatch(runUi, /Kundengegenangebot.*wird.*1–3 Tage.*bei exakter Annahme/);

console.log('A05 T-0115 counteroffer UI regression checks passed');
