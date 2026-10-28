import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hsqCompetencies, hsqQuestions, validateHsqQuestions } from './learning-hsq.js';

const here = dirname(fileURLToPath(import.meta.url));
const mapPath = resolve(here, '../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md');
const text = readFileSync(mapPath, 'utf8');
const marker = '<a id="hsq-kompetenz-ids"></a>';
const section = text.split(marker)[1];
const errors = [];
if (!section) throw new Error('External HSQ competency map anchor not found: ' + marker);
const externalEntries = [];
for (const line of section.split(/\r?\n/)) {
  const match = line.match(/^\|\s*`([^`]+)`\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|$/);
  if (match) externalEntries.push({ id: match[1], norm: match[2].trim(), title: match[3].trim() });
}
const byId = new Map(externalEntries.map((entry) => [entry.id, entry]));
if (externalEntries.length !== 25) errors.push('expected 25 external HSQ map entries, found ' + externalEntries.length);
if (byId.size !== externalEntries.length) errors.push('duplicate external HSQ competency IDs');
const localIds = new Set(hsqCompetencies.map((entry) => entry.id));
for (const entry of hsqCompetencies) {
  const external = byId.get(entry.id);
  if (!external) errors.push('module competency is absent from external map: ' + entry.id);
  else if (external.title !== entry.title) errors.push('map/module title mismatch for ' + entry.id);
}
for (const entry of externalEntries) if (!localIds.has(entry.id)) errors.push('external map ID is not represented in the item module: ' + entry.id);
for (const item of hsqQuestions) {
  const external = byId.get(item.competenceId);
  if (!external) errors.push('item references missing external map ID: ' + item.id + ' -> ' + item.competenceId);
  else if (!item.sourceRef.includes('[' + external.id + ']') || !item.sourceRef.includes(external.title) || !item.sourceRef.includes('docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md#hsq-kompetenz-ids')) errors.push('item does not resolve directly to exact external map entry: ' + item.id);
}
const result = validateHsqQuestions(hsqQuestions, externalEntries);
if (!result.ok) errors.push(...result.errors);
const report = { ok: errors.length === 0, externalMap: mapPath, externalCompetencyCount: externalEntries.length, items: result.count, byArea: result.byArea, itemContentUniqueness: result.substantiveUniqueByArea, answerKeyDistribution: result.keyDistributionByArea, weakDistractorFlags: result.weakDistractorCount, EnglishProseFlags: result.englishLeakCount, directStatuteSectionLinksChecked: result.statuteSourceCheckCount, externalReferenceErrors: errors };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
