import {portfolioHtml} from './helpers/templates.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {validateState} from '../../lib/state-validation.ts';
import {validateFinancialData,validateStockMutations} from '../../lib/financial-validation.js';

const html=portfolioHtml;
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const el=()=>({value:'',textContent:'',innerHTML:'',style:{},className:'',attrs:{},classList:{add(){},remove(){},contains(){return false},toggle(){}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(){},focus(){},reset(){},contains(){return false},remove(){},click(){},scrollHeight:800,clientHeight:300,scrollTop:0});
function boot({state,userId,device=new Map(),request=async()=>{throw Error('offline');}}={}){
 const c=Object.fromEntries(ids.map(id=>[id,el()]));c.authCanvas.getContext=()=>({});let warning='';
 Object.assign(c,{console,TextEncoder,Intl,Date,Math,Number,String,Array,Object,JSON,Promise,Set,Map,Blob,URL,AbortController,Event,crypto:webcrypto,localStorage:{getItem:k=>device.get(k)??null,setItem:(k,v)=>device.set(k,String(v)),removeItem:k=>device.delete(k)},sessionStorage:{getItem:()=>null},fetch:request,setTimeout:(...args)=>{const timer=setTimeout(...args);timer.unref();return timer;},clearTimeout,setInterval:()=>0,requestAnimationFrame:()=>0,matchMedia:()=>({matches:true}),addEventListener(){},dispatchEvent(){},MutationObserver:class{observe(){}},alert:m=>{warning=m;},confirm:()=>true,location:{reload(){}},document:{hidden:false,activeElement:null,body:el(),querySelectorAll:()=>[],addEventListener(){},createElement:el()}});
 c.document.createElement=()=>el();c.document.getElementById=id=>c[id];c.window=c;vm.createContext(c);const run=s=>vm.runInContext(s,c);
 run(html.replace('/*__CLOUD_BOOTSTRAP__*/null',JSON.stringify(userId?{user:{id:userId,username:'Synthetic',roles:['member']},state,revision:0}:null)).match(/<script>([\s\S]*?)<\/script>/)[1]);
 return {c,run,device,warning:()=>warning};
}
const asset={name:'BBCA',unit:'lembar',kind:'stock',symbol:'BBCA.JK',quantity:100,valueSnapshot:1000,manualPrice:null};
const buy={id:'legacy-buy',date:'2026-01-01',type:'MASUK',asset:'BBCA',amount:1000,description:'Synthetic',platform:'Stockbit'};
const state={transactions:[buy],assets:[asset],profile:{displayName:'Saved profile',photo:'data:image/png;base64,aGVsbG8=',photoMode:'custom'},logs:[{t:'2026-01-01T00:00:00Z',m:'fixture'}],sheetUrl:'https://docs.google.com/spreadsheets/d/fixture',lastBackup:'2026-01-01'};
const b=boot({state,userId:'audit-only'});await b.run('refreshPrices()');
// Legacy buy deletion must not invalidate dependent sales or alter any state.
b.run("openSale(0);sellQty.value='50';sellAmount.value='750';sellDate.value='2026-01-02';sellPlatform.value='Stockbit';saleForm.onsubmit({preventDefault(){}})");
const before=b.run('JSON.stringify({assets,transactions})');b.run("deleteTx('legacy-buy')");assert.equal(b.run('JSON.stringify({assets,transactions})'),before);assert.equal(b.run('capitalFor(assets[0])'),500);assert.match(b.warning(),/dasar modal/);
// New stock fractions fail at buy, holding edit and server mutation boundaries.
b.run("openPurchase(0);buyQty.value='0.5';buyAmount.value='50';buyDate.value='2026-01-03';buyPlatform.value='Stockbit';purchaseForm.onsubmit({preventDefault(){}})");assert.equal(b.run('JSON.stringify({assets,transactions})'),before);assert.equal(b.c.buyQty.step,'1');
b.run("editHolding(0);holdingQty.value='50.5';holdingForm.onsubmit({preventDefault(){}})");assert.equal(b.run('assets[0].quantity'),50);
assert.throws(()=>validateStockMutations({...state,assets:[{...asset,quantity:100.5}]}),/lembar utuh/);
assert.throws(()=>validateStockMutations({...state,transactions:[{...buy,trade:'buy',quantityDelta:.5}]}),/lembar utuh/);
const fractional={...state,assets:[{...asset,quantity:100.5}]};validateStockMutations(fractional,fractional); // old records stay accessible
validateStockMutations({...fractional,assets:[{...asset,quantity:0}],transactions:[buy,{id:'exit',asset:'BBCA',type:'KELUAR',trade:'sell',quantityDelta:-100.5,amount:1000,costBasis:1000,realizedPnl:0}]},fractional);
const legacy=boot({userId:'fractional-fixture',state:fractional});legacy.run("openSale(0);fillFullSale();sellAmount.value='1000';sellDate.value='2026-01-02';sellPlatform.value='Stockbit';saleForm.onsubmit({preventDefault(){}})");assert.equal(legacy.run('assets[0].quantity'),0,'Existing fractions can be fully liquidated');
// Durable, account-scoped quote cache survives an offline reload, not shared across accounts.
const device=new Map(),first=boot({userId:'price-a',state,device});await first.run('refreshPrices()');first.run("storeQuote('BBCA.JK',9600,'Synthetic market')");const saved=JSON.parse(first.run('JSON.stringify(cloudState())'));
const reload=boot({userId:'price-a',state:saved,device});await reload.run('refreshPrices()');assert.equal(reload.run('priceFor(assets[0])'),9600);assert.equal(reload.run('valueFor(assets[0])'),960000);assert.equal(boot({userId:'price-b',state,device}).run('priceFor(assets[0])'),null);
// Client/server reject the same malformed financial records before replacing the portfolio.
assert.ok(html.includes(validateFinancialData.toString()),'Browser embeds the exact server financial validator');
for(const mutate of [s=>s.transactions[0].amount=-1,s=>s.transactions[0].date='not-a-date',s=>s.transactions[0].date='2026-02-30',s=>s.assets[0].kind='unknown',s=>s.transactions.push({...s.transactions[0]}),s=>s.assets[0].valueSnapshot=Infinity]){
 const invalid=structuredClone(state);mutate(invalid);assert.throws(()=>validateState(invalid));assert.equal(b.run('validData('+JSON.stringify(invalid)+')'),false);
 const snapshot=b.run('JSON.stringify(cloudState())');assert.equal(await b.run('applyData('+JSON.stringify(invalid)+',"invalid fixture")'),false);assert.equal(b.run('JSON.stringify(cloudState())'),snapshot);
}
// A server refusal cannot replace the visible data either.
const refused=boot({userId:'import-refusal',state,request:async()=>({ok:false,status:409,json:async()=>({error:'Fixture conflict'})})});refused.run('cloudDirty=false');const unchanged=refused.run('JSON.stringify({assets,transactions})');const next=structuredClone(state);next.assets[0].quantity=200;
assert.equal(await refused.run('applyData('+JSON.stringify(next)+',"fixture")'),false);assert.equal(refused.run('JSON.stringify({assets,transactions})'),unchanged);
// Versioned backup restores profile/settings and still accepts old finance-only backups.
first.run("localStorage.setItem('sidaps_hide_balances_v1','true');balancesHidden=true;localStorage.setItem('denny_profile_v1',JSON.stringify({displayName:'Saved profile',photo:'data:image/png;base64,aGVsbG8=',photoMode:'custom'}))");device.set('sidaps_appearance_v1','dark');
const backup=JSON.parse(first.run('JSON.stringify(accountBackup())'));assert.equal(backup.schemaVersion,2);assert.equal(backup.profile.displayName,'Saved profile');assert.equal(backup.settings.appearance,'dark');assert.equal(backup.settings.balancesHidden,true);assert.equal(backup.sheetUrl,state.sheetUrl);assert.deepEqual(Object.keys(backup).filter(k=>/token|password|cookie|recovery/i.test(k)),[]);
const restored=boot();assert.equal(await restored.run('applyData('+JSON.stringify(backup)+',"restore fixture")'),true);assert.equal(restored.run('getProfile().displayName'),'Saved profile');assert.equal(restored.run('balancesHidden'),true);
assert.equal(restored.run('validData('+JSON.stringify({transactions:state.transactions,assets:state.assets})+')'),true,'Old backup format remains accepted');
// Text formula neutralization never changes numeric cells.
for(const input of ['=1+1','+SUM(1,1)','-1+1','@SUM(1,1)',' \t=1+1','\ttext','\rtext','\ntext'])assert.ok(b.run('csvSafeText('+JSON.stringify(input)+')').startsWith("'"));
assert.equal(b.run('csvSafeText(12345)'), '12345');assert.equal(b.run("csvSafeText('Stockbit')"),'Stockbit');
// Historical-entry guard prevents applying later cost basis to an earlier sale.
assert.equal(b.run("validTradeDate(assets[0],'2026-01-01')"),false);
const auth=fs.readFileSync('lib/identity.ts','utf8');assert.ok(!auth.includes('getChatGPTUser'));assert.ok(!fs.readFileSync('app/chatgpt-auth.ts','utf8').includes('requestHeaders.get('));
const css=fs.readFileSync('public/emerald-gold.css','utf8');assert.match(css,/\.asset-logo,\.platform-logo\)\{background:#fff!important/);assert.match(css,/\.platform-logo:before\{color:#173c2d!important/);
console.log('PASS: legacy deletion, stock boundaries/legacy exit, durable isolated prices, shared strict import validation, import rejection rollback, full/legacy backup, CSV safety, chronology guard, header distrust and logo contrast.');
