import { createLegacyInitialGame as createInitialGame, advanceOneDay, acceptMarketOffer } from './engine.js';
import { estimateOrderEconomics } from './economics.js';

const ownedSite=createInitialGame();ownedSite.roomSettings.rent=0;ownedSite.latestBab=null;const zeroRentCost=estimateOrderEconomics(ownedSite.orders[0],ownedSite).estimatedCost;ownedSite.roomSettings.rent=550;const rentedSiteCost=estimateOrderEconomics(ownedSite.orders[0],ownedSite).estimatedCost;if(!(zeroRentCost<rentedSiteCost))throw new Error('Gekaufter Standort mit Monatsmiete 0 erhält in der Fallback-Kalkulation fiktive Miete');

function marketInquiry(date, reputation=68, priceIndex=1) {
  const game=createInitialGame();
  game.date=date;
  game.network.companyReputation=reputation;
  game.network.companyPriceIndex=priceIndex;
  advanceOneDay(game);
  return game;
}

let sampleDate=null,first=null;
for(let year=2027;year<2035&&!first;year++) for(let month=2;month<=12&&!first;month++){const date=`${year}-${String(month).padStart(2,'0')}-01`,candidate=marketInquiry(date);if(candidate.orders.some(o=>o.generated)){sampleDate=date;first=candidate;}}
if(!first) throw new Error('Kein reproduzierbares offenes Marktangebot im Suchzeitraum gefunden');
const repeated=marketInquiry(sampleDate);
const firstOffers=first.orders.filter(o=>o.generated&&o.status==='ANGEBOT');
const repeatedOffers=repeated.orders.filter(o=>o.generated&&o.status==='ANGEBOT');
if(JSON.stringify(firstOffers)!==JSON.stringify(repeatedOffers)) throw new Error('Marktanfragen und Konkurrenzangebote sind nicht reproduzierbar');
if(firstOffers.some(o=>!Array.isArray(o.competitorQuotes)||o.competitorQuotes.length<1||o.competitorQuotes.length>2)) throw new Error('Eine offene Anfrage muss ein bis zwei, nie alle drei Konkurrenzangebote enthalten');
if(firstOffers.some(o=>o.competitorQuotes.some(q=>q.responseDate!==o.offerDate))) throw new Error('Konkurrenzangebote dürfen nicht vor ihrem simulierten Eingangsdatum berücksichtigt werden');

function marketWithDeliveredBacklog(date) {
  const game=createInitialGame();
  game.date=date;
  game.orders.push(...Array.from({length:6},(_,i)=>({id:`DELIVERED-${i}`,generated:true,status:'ABGESCHLOSSEN',deliveredAt:'2026-12-20',closedAt:null,competitorQuotes:[]})));
  advanceOneDay(game);
  return game.orders.some(o=>o.generated&&!o.id.startsWith('DELIVERED-'));
}
for(let date='2027-01-04';date<'2030-01-01';date=new Date(Date.parse(date+'T12:00:00Z')+7*86400000).toISOString().slice(0,10)) {
  const withoutBacklog=marketInquiry(date).orders.some(o=>o.generated);
  if(marketWithDeliveredBacklog(date)!==withoutBacklog) throw new Error(`Gelieferte, noch unbezahlte Aufträge belasten fälschlich die Produktionskapazität am ${date}`);
}

let lowInviteCount=0,highInviteCount=0;
for(let date='2027-01-04';date<'2030-01-01';date=new Date(Date.parse(date+'T12:00:00Z')+7*86400000).toISOString().slice(0,10)) {
  if(marketInquiry(date,20,1.35).orders.some(o=>o.generated)) lowInviteCount++;
  if(marketInquiry(date,100,.75).orders.some(o=>o.generated)) highInviteCount++;
}
if(highInviteCount<=lowInviteCount) throw new Error(`Ruf/Preis beeinflussen die Einladungen nicht erwartungsgemäß: ${highInviteCount} gegen ${lowInviteCount}`);

function quoteGame(price) {
  const game=createInitialGame();
  game.orders.push({id:'TEST-MARKT',customer:'K-01',status:'ANGEBOT',marketReferenceNet:1000,scenarioPrice:0,agreedTerms:14,competitorQuotes:[{competitorId:'W-03',name:'Metallform Süd',netPrice:970,priceIndex:.97,reputation:90}]});
  if(!acceptMarketOffer(game,'TEST-MARKT',price,14)) throw new Error('Gültiges Angebot wurde nicht eingereicht');
  return game;
}
const aggressive=quoteGame(700),expensive=quoteGame(1200);
if(aggressive.orders.at(-1).status!=='BESTÄTIGT'||expensive.orders.at(-1).status!=='MARKT_VERLOREN') throw new Error('Auftragsvergabe berücksichtigt Preis und Wettbewerberruf nicht');
if(aggressive.orders.at(-1).scenarioPrice!==700||aggressive.orders.at(-1).agreedTerms!==14||expensive.orders.at(-1).scenarioPrice!==0||expensive.orders.at(-1).agreedTerms!==14||expensive.orders.at(-1).submittedPrice!==1200||expensive.orders.at(-1).submittedTerms!==14) throw new Error('Verlorenes Angebot wurde als Vertrags-/Auftragspreis oder Zahlungsziel gespeichert');
if(aggressive.network.companyPriceIndex>=expensive.network.companyPriceIndex) throw new Error('Bisheriges Angebotsniveau wirkt sich nicht auf das künftige Preisprofil aus');
console.log(`Markt-Konkurrenzregressionen bestanden: ${firstOffers.length} reproduzierbare Angebote, Einladungen low/high ${lowInviteCount}/${highInviteCount}, Preis/Ruf-Zuschlag geprüft.`);
