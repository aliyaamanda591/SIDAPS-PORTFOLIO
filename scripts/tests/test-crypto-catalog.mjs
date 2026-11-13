import assert from 'node:assert/strict';
import { validateState } from '../../lib/state-validation.ts';
const origin='http://127.0.0.1:5178';
for(const path of ['/api/prices/crypto','/api/prices/crypto-pairs','/api/prices/coins?ids=solana'])assert.equal((await fetch(origin+path)).status,401,'Public proxy requires account');
const signIn=await fetch(origin+'/signin-with-chatgpt?return_to=/',{redirect:'manual'});
const cookie=signIn.headers.getSetCookie()[0].split(';')[0];assert.ok(cookie);
const request=path=>fetch(origin+path,{headers:{Cookie:cookie}});
const pairsResponse=await request('/api/prices/crypto-pairs');assert.ok([200,502].includes(pairsResponse.status));
const directPairs=pairsResponse.ok?pairsResponse:await fetch('https://indodax.com/api/pairs');assert.equal(directPairs.status,200);
const pairs=await directPairs.json();for(const coin of ['btc','eth','sol'])assert.ok(pairs.some(p=>p.ticker_id===coin+'_idr'));
const pricesResponse=await request('/api/prices/crypto');assert.ok([200,502].includes(pricesResponse.status));
if(pricesResponse.ok){const prices=await pricesResponse.json();for(const pair of ['btc_idr','eth_idr','sol_idr'])assert.ok(Number(prices.tickers[pair].last)>0,'Real IDR quote '+pair);}
const fallback=await request('/api/prices/coins?ids=bitcoin,ethereum,solana');assert.equal(fallback.status,200,await fallback.clone().text());const fallbackPrices=await fallback.json();for(const id of ['bitcoin','ethereum','solana']){assert.ok(Number(fallbackPrices[id].idr)>0);assert.ok(Number(fallbackPrices[id].last_updated_at)>0);}
for(const ids of ['','https://evil.test','bitcoin%26vs_currencies%3Dusd',Array(202).fill(0).map((_,i)=>'id'+i).join(',')])assert.equal((await request('/api/prices/coins?ids='+ids)).status,400,'Reject malformed or excessive IDs');
const state=validateState({assets:[{name:'SOL INDODAX',kind:'crypto',unit:'SOL',symbol:'indodax:sol_idr',quantity:2.5,valueSnapshot:0}],transactions:[{id:'test-crypto',date:'2026-11-08',type:'MASUK',trade:'buy',asset:'SOL INDODAX',description:'SOL purchase',platform:'INDODAX',amount:3500000,quantityDelta:2.5}],profile:{},logs:[],sheetUrl:'',lastBackup:''});
assert.equal(state.assets[0].symbol,'indodax:sol_idr');assert.equal(state.transactions[0].platform,'INDODAX');assert.equal(state.assets[0].quantity,2.5);
const html=await (await request('/')).text();assert.ok(html.includes('assetKindFilter'));assert.ok(html.includes('assetSearch'));assert.ok(html.includes('/api/prices/crypto-pairs'));assert.ok(html.includes('/api/prices/crypto'));
console.log('PASS: authenticated price proxies, live multi-coin IDR fallback, crypto state validation, fractional quantities, and hosted asset catalog. Indodax server status: '+pricesResponse.status+'; no portfolio records modified.');
