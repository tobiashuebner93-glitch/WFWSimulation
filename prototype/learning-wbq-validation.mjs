import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { WBQ_ITEMS, WBQ_AREAS, WBQ_SOURCES } from './learning-wbq.js';
const expected=new Map(WBQ_AREAS.map(area=>[area.id,50]));
assert.equal(WBQ_ITEMS.length,200,'exactly 200 WBQ items');
assert.equal(new Set(WBQ_ITEMS.map(item=>item.id)).size,200,'unique item IDs');
assert.equal(new Set(WBQ_SOURCES.map(source=>source.id)).size,WBQ_SOURCES.length,'unique source IDs');
const sourceById=new Map(WBQ_SOURCES.map(source=>[source.id,source]));
const mapped=await readFile(new URL('../docs/learning/wirtschaftsfachwirt-kompetenzlandkarte.md',import.meta.url),'utf8');
const checklist=await readFile(new URL('./learning-wbq-review-checklist.md',import.meta.url),'utf8');
const mappedIds=new Set([...mapped.matchAll(/^\| `([^`]+)` \| § 4 Abs\. [1-4] WFachwPrV \|/gm)].map(m=>m[1]));
const norm=value=>value.trim().toLocaleLowerCase('de-DE');
const counts={A:0,B:0,C:0,D:0};
const english=/\b(the|which|what|why|how|does|is|are|should|would|could|might|after|before|with|without|because|company|customer|supplier|business|shop|management|price cut|market share|workshop|balance sheet|income statement)\b/i;
for(const [area,count] of expected) assert.equal(WBQ_ITEMS.filter(item=>item.areaId===area).length,count,'area count '+area);
const checklistIds=new Set([...checklist.matchAll(/^### (wbq-[a-z]+-[0-9]{3})$/gm)].map(match=>match[1]));assert.equal(checklistIds.size,200,'one manual review checklist entry per case');
assert.ok(WBQ_ITEMS.every(item=>checklistIds.has(item.id)), 'all items have checklist coverage');
assert.equal(checklist.split("Autorenselbstprüfung:** [x]").length-1,200,"author review recorded for each case");
assert.equal(checklist.split("A09 unabhängiger Review:** [x]").length-1,200,"A09 independent review is complete for every case");
for(const item of WBQ_ITEMS){
 for(const field of ['id','areaId','competenceId','scenario','question','explanation','companyEffect','correctAnswer','sourceRef','sourceKind','tooltipKey']) assert.equal(typeof item[field],'string',item.id+' field '+field);
 assert.ok(item.scenario.length>20&&item.question.length>15&&item.explanation.length>20&&item.companyEffect.length>20,item.id+' meaningful prose');
 for(const text of [item.scenario,item.question,item.explanation,item.companyEffect,...item.options]) assert.equal(english.test(text),false,item.id+' contains English: '+text);
 assert.equal(item.options.length,4,item.id+' four options');
 assert.equal(new Set(item.options.map(norm)).size,4,item.id+' unique options');
 assert.ok(item.options.every(x=>typeof x==='string'&&x.trim()),item.id+' string options');
 assert.ok(['A','B','C','D'].includes(item.correctOption),item.id+' answer key'); assert.equal(item.options['ABCD'.indexOf(item.correctOption)],item.correctAnswer,item.id+' correct key points to semantic answer'); counts[item.correctOption]++;
 assert.ok(expected.has(item.areaId),item.id+' area'); assert.ok(mappedIds.has(item.competenceId),item.id+' competence ID mapping');
 const refs=item.sourceRef.split(';');
 for(const id of refs){assert.ok(sourceById.has(id),item.id+' unknown source '+id); if(item.sourceKind==='law') assert.ok(/gesetze-im-internet\.de|eur-lex\.europa\.eu/.test(sourceById.get(id).url),item.id+' non-primary legal source '+id);}
 assert.ok(['law','competency-derivation'].includes(item.sourceKind),item.id+' source kind');
 if(item.sourceKind==='law'){assert.ok(refs.every(id=>sourceById.get(id).kind==='law'),item.id+' legal source kind');assert.ok(refs.every(id=>{const url=sourceById.get(id).url;const law=url.startsWith('https://www.gesetze-im-internet.de/')&&url.includes('/__')&&url.endsWith('.html');const eu=url.startsWith('https://eur-lex.europa.eu/eli/reg/2016/679/oj#art_')&&!Number.isNaN(Number(url.slice(url.lastIndexOf('_')+1)));return law||eu;}),item.id+' direct section/article anchors');}
}
for(const field of ['scenario','question','explanation','companyEffect']){const values=WBQ_ITEMS.map(x=>norm(x[field]));assert.equal(new Set(values).size,200,field+' uniqueness');}
for(const key of Object.keys(counts)) assert.ok(counts[key]>=40&&counts[key]<=60,'answer-position balance '+key+': '+counts[key]);
console.log('PASS: 200 WBQ items, 50 per area; German fields; mapped competence IDs; direct primary legal sources; answer-key distribution '+JSON.stringify(counts));
const usedSources=new Set(WBQ_ITEMS.flatMap(item=>item.sourceRef.split(';')));assert.equal(WBQ_SOURCES.filter(source=>!usedSources.has(source.id)).length,0,'no unused source entries');
const obvious=/logo|geburtstag|newsletter|firmenfarbe|kfz-steuer|firmenname/i;assert.equal(WBQ_ITEMS.filter(item=>item.options.some((option,index)=>index!=='ABCD'.indexOf(item.correctOption)&&obvious.test(option))).length,0,'no obvious strawman distractors');

console.log('Semantic distractor plausibility is not proven by automation; consult prototype/learning-wbq-review-checklist.md and independent A09 review.');
