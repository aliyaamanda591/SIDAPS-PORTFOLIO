import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
const exported=fs.readFileSync('lib/portfolio-html.ts','utf8').split('export const portfolioHtml=')[1].trim();
const html=JSON.parse(exported.slice(0,-1)),ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const element=()=>({value:'',innerHTML:'',textContent:'',style:{},required:false,className:'',attrs:{},classList:{add(){},remove(){},contains(){return false},toggle(){}},addEventListener(){},setAttribute(k,v){this.attrs[k]=String(v);},focus(){},reset(){},contains(){return false},scrollHeight:800,clientHeight:300,scrollTop:0});
function boot(bootstrap){
const context=Object.fromEntries(ids.map(id=>[id,element()]));context.authCanvas.getContext=()=>({});
const stored=new Map(),storage={getItem:k=>stored.get(k)??null,setItem:(k,v)=>stored.set(k,String(v)),removeItem:k=>stored.delete(k)};
Object.assign(context,{console,TextEncoder,Intl,Date,Math,Number,String,Array,Object,JSON,Promise,Set,Map,Blob,URL,AbortController,crypto:webcrypto,localStorage:storage,sessionStorage:{getItem:()=>null},fetch:async()=>{throw Error('Offline fixture');},setTimeout,clearTimeout,setInterval:()=>0,requestAnimationFrame:()=>0,matchMedia:()=>({matches:true}),addEventListener(){},MutationObserver:class{observe(){}},alert(){},confirm:()=>true,location:{reload(){}},document:{hidden:false,activeElement:null,body:element(),querySelectorAll:()=>[],addEventListener(){},createElement:element}});
context.document.getElementById=id=>context[id];context.window=context;vm.createContext(context);const run=code=>vm.runInContext(code,context);run(html.replace('/*__CLOUD_BOOTSTRAP__*/null',JSON.stringify(bootstrap??null)).match(/<script>([\s\S]*?)<\/script>/)[1]);return {context,run};
}
const {context,run}=boot();await run('refreshPrices()');
const assets=[{name:'BMRI',kind:'stock',symbol:'BMRI.JK',unit:'lembar',quantity:100,valueSnapshot:28864174},{name:'BBNI',kind:'stock',symbol:'BBNI.JK',unit:'lembar',quantity:0,valueSnapshot:0,archived:true}];
const transactions=[{id:'buy-fixture',date:'2026-11-08',type:'MASUK',asset:'BMRI',amount:30099500,platform:'GROWIN',description:'Fixture'},{id:'sale-fixture',date:'2026-11-08',type:'KELUAR',trade:'sell',asset:'BBNI',amount:680000,costBasis:0,realizedPnl:680000,quantityDelta:-200,platform:'GROWIN',description:'Fixture sale'}];
run(`assets=${JSON.stringify(assets)};transactions=${JSON.stringify(transactions)};quotes={};quoteMeta={};render()`);
const ledger=run('JSON.stringify({assets,transactions})');
assert.equal(context.totalCapital.textContent,run('rupiah(30099500)'));assert.equal(context.currentValue.textContent,run('rupiah(28864174)'));
assert.equal(context.profitLoss.textContent,run('signedRupiah(-1235326)'),'Screenshot: value minus capital is loss 1,235,326');
assert.equal(run('realizedFor()'),680000,'Recorded sale result is preserved');assert.equal(context.saleProfitLoss.textContent,run('signedRupiah(680000)'));assert.equal(context.profitBreakdown.textContent,'Nilai sekarang − modal aset tersisa');
assert.ok(context.overviewProfitState.textContent.includes('di bawah modal'));assert.ok(context.profitLoss.className.includes('red'));
run("storeQuote('BMRI.JK',310000,'Fixture live update')");assert.equal(context.profitLoss.textContent,run('signedRupiah(900500)'),'Live price updates headline');assert.ok(context.profitLoss.className.includes('green'));
assert.equal(run('JSON.stringify({assets,transactions})'),ledger,'Render and live prices do not rewrite financial records');
run("transactions[1].realizedPnl=99000000;storeQuote('BMRI.JK',288641.74,'Fixture loss')");assert.equal(context.profitLoss.textContent,run('signedRupiah(-1235326)'),'Realized gains never offset this asset headline');assert.ok(context.profitLoss.className.includes('red'));
run('toggleBalancePrivacy()');for(const id of ['profitLoss','saleProfitLoss','saleProceeds','saleCostBasis'])assert.equal(context[id].textContent,'••••••',id+' respects privacy');assert.equal(context.saleProfitState.textContent,'Nominal disembunyikan');run('toggleBalancePrivacy()');assert.equal(context.profitLoss.textContent,run('signedRupiah(-1235326)'));
run('quotes={};quoteMeta={};assets=assets.slice(0,1);transactions=transactions.slice(0,1);transactions[0].amount=10.6;assets[0].valueSnapshot=11.4;render()');assert.equal(context.profitLoss.textContent,run('signedRupiah(0)'),'Displayed whole-rupiah values stay arithmetically consistent');
run('transactions[0].amount=11.6;assets[0].valueSnapshot=10.4;render()');assert.equal(context.profitLoss.textContent,run('signedRupiah(-2)'));
run('assets=[];transactions=[];render()');assert.equal(context.profitLoss.textContent,run('signedRupiah(0)'));assert.ok(!context.profitBreakdown.textContent.includes('penjualan'),'Empty account does not show sale history');
assert.equal(context.saleProfitLoss.textContent,run('signedRupiah(0)'));assert.equal(context.saleSummaryCount.textContent,'0 transaksi penjualan');
// A first-time cloud account uses the same formulas, without owner data.
const fresh=boot({user:{id:'summary-test-member',username:'New member',email:'member@example.invalid',roles:['member']},revision:0,state:null});await fresh.run('refreshPrices()');
assert.equal(fresh.run('transactions.length'),0);assert.equal(fresh.run('assets.every(a=>a.quantity===0&&a.valueSnapshot===0)'),true);
for(const id of ['totalCapital','currentValue','profitLoss','saleProfitLoss','saleProceeds','saleCostBasis'])assert.equal(fresh.context[id].textContent,fresh.run('rupiah(0)'),id+' starts at zero');
fresh.run("assets=[{name:'BMRI',kind:'stock',symbol:'BMRI.JK',unit:'lembar',quantity:0,valueSnapshot:0}];quotes={};quoteMeta={};storeQuote('BMRI.JK',6000,'Test price');openPurchase(0);buyQty.value='100';buyAmount.value='500000';buyDate.value='2026-11-08';buyPlatform.value='STOCKBIT';purchaseForm.onsubmit({preventDefault(){}})");
assert.equal(fresh.run('capitalFor(assets[0])'),500000);assert.equal(fresh.run('valueFor(assets[0])'),600000);assert.equal(fresh.context.profitLoss.textContent,fresh.run('signedRupiah(100000)'));assert.equal(fresh.context.saleProfitLoss.textContent,fresh.run('rupiah(0)'));
fresh.run("openSale(0);sellQty.value='40';sellAmount.value='260000';sellDate.value='2026-11-08';sellPlatform.value='STOCKBIT';saleForm.onsubmit({preventDefault(){}})");
assert.equal(fresh.run('assets[0].quantity'),60);assert.equal(fresh.run('capitalFor(assets[0])'),300000);assert.equal(fresh.run('saleSummary().basis'),200000);assert.equal(fresh.context.profitLoss.textContent,fresh.run('signedRupiah(60000)'));assert.equal(fresh.context.saleProfitLoss.textContent,fresh.run('signedRupiah(60000)'));
fresh.run("openPurchase(0);buyQty.value='100';buyAmount.value='700000';buyDate.value='2026-11-08';buyPlatform.value='STOCKBIT';purchaseForm.onsubmit({preventDefault(){}})");
assert.equal(fresh.run('capitalFor(assets[0])'),1000000);assert.equal(fresh.run('assets[0].quantity'),160);assert.equal(fresh.context.profitLoss.textContent,fresh.run('signedRupiah(-40000)'));
fresh.run("openSale(0);fillFullSale();sellAmount.value='800000';sellDate.value='2026-11-08';sellPlatform.value='STOCKBIT';sellArchive.checked=true;saleForm.onsubmit({preventDefault(){}})");
assert.equal(fresh.run('capitalFor(assets[0])'),0);assert.equal(fresh.run('assets[0].archived'),true);assert.equal(fresh.context.profitLoss.textContent,fresh.run('signedRupiah(0)'));assert.equal(fresh.context.saleProfitLoss.textContent,fresh.run('signedRupiah(-140000)'));assert.ok(fresh.context.saleProfitLoss.className.includes('red'));assert.equal(fresh.context.saleProceeds.textContent,fresh.run('rupiah(1060000)'));assert.equal(fresh.context.saleCostBasis.textContent,fresh.run('rupiah(1200000)'));
const state=fresh.run('({assets,transactions,profile:{displayName:"New member",photo:""},logs:[],sheetUrl:"",lastBackup:""})');const reloaded=boot({user:{id:'summary-test-member',username:'New member',roles:['member']},revision:4,state});assert.equal(reloaded.context.saleProfitLoss.textContent,reloaded.run('signedRupiah(-140000)'),'Sale results survive account reload and archived cards');
fresh.run('deleteTx(transactions.at(-1).id)');assert.equal(fresh.run('capitalFor(assets[0])'),1000000);assert.equal(fresh.context.saleProfitLoss.textContent,fresh.run('signedRupiah(60000)'),'Deleting a sale recomputes the independent panel');
// Untracked withdrawals are not counted as realized sales.
run("assets=[];transactions=[{type:'KELUAR',amount:900000,asset:'UMUM'}];render()");assert.equal(context.saleProfitLoss.textContent,run('rupiah(0)'));assert.equal(context.saleSummaryCount.textContent,'0 transaksi penjualan');
assert.ok(html.includes('PROFIT / LOSS ASET'));assert.ok(html.includes('PROFIT / LOSS PENJUALAN'));assert.equal(new Set(ids).size,ids.length);assert.ok(!html.includes('pl=vals-caps+realizedFor()'));
console.log('PASS: independent asset/sale panels, screenshot arithmetic, live updates, privacy, empty cloud account, first purchase, proportional partial sale, repurchase, full sale, archived sale history, reload, deletion, withdrawals, and rupiah rounding.');
