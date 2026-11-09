import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createMarketBoard,yahooQuote,coinQuotes} from '../lib/market-board.ts';
let now=Date.parse('2026-11-09T10:00Z'),calls=0,offline=false;
const stock=(code)=>({chart:{result:[{meta:{symbol:code+'.JK',currency:'IDR',regularMarketPrice:110,chartPreviousClose:100,regularMarketTime:now/1000},indicators:{quote:[{close:[100,null,105,110]}]}}]}});
const crypto=['bitcoin','ethereum','solana'].map(id=>({id,current_price:1000,price_change_percentage_24h:-2,last_updated:new Date(now).toISOString(),sparkline_in_7d:{price:[1100,1050,1000]}}));
const fetcher=async url=>{calls++;if(offline)throw Error('offline');return Response.json(url.includes('coingecko')?crypto:stock(url.match(/chart\/([A-Z]+)\.JK/)[1]));};
const service=createMarketBoard(fetcher,()=>now);
const [a,b]=await Promise.all([service.get(),service.get()]);assert.equal(calls,5,'Concurrent anonymous reads share one refresh');assert.deepEqual(a,b);assert.equal(a.length,7);
assert.equal(a[0].change.toFixed(2),'10.00');assert.equal(a[0].points.length,3);assert.equal(a.find(q=>q.code==='BTC').period,'7 hari');
await service.get();assert.equal(calls,5,'Five-minute cache');
const original=a[0].marketAt;now+=300001;offline=true;const stale=await service.get();assert.equal(stale.length,7);assert.ok(stale.every(q=>q.stale));assert.equal(stale[0].marketAt,original,'Outage retains original quote timestamp');
const empty=await createMarketBoard(fetcher,()=>now).get();assert.deepEqual(empty,[],'Cold outage never invents prices');
assert.throws(()=>yahooQuote(stock('BBCA'),'BMRI','Mandiri',now));assert.throws(()=>yahooQuote({chart:{result:[{meta:{regularMarketPrice:0}}]}},'BMRI','Mandiri',now));
assert.equal(coinQuotes([{...crypto[0],current_price:0}],now).length,0);
// Public board is deferred, independent of login, and never invents a missing chart.
const list={innerHTML:''},note={textContent:''},buttons=['stock','crypto'].map(kind=>({dataset:{watchKind:kind},setAttribute(){},addEventListener(_,fn){this.click=fn;}}));
const root={querySelectorAll:()=>buttons},timers=[],intervals=[],storage=new Map();let publicCalls=0;
const context={Date,Intl,Number,Math,Array,String,JSON,AbortSignal,document:{hidden:false,body:{classList:{contains:()=>true}},getElementById:id=>({marketWatch:root,marketWatchList:list,marketWatchNote:note}[id]),addEventListener(){}},setTimeout:fn=>{timers.push(fn);},setInterval:(fn,ms)=>intervals.push(ms)};
context.window={localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},fetch:async url=>{assert.equal(url,'/api/market-board');publicCalls++;return Response.json({quotes:a});}};
vm.createContext(context);vm.runInContext(fs.readFileSync('public/market-board.js','utf8'),context);
assert.equal(publicCalls,0,'Market fetch never blocks initial login');await timers[0]();assert.equal(publicCalls,1);assert.ok(list.innerHTML.includes('watch-chart'));assert.ok(list.innerHTML.includes('BMRI'));buttons[1].click();assert.ok(list.innerHTML.includes('BTC'));assert.ok(list.innerHTML.includes('7 hari'));assert.ok(intervals.includes(300000));
const missing=yahooQuote({chart:{result:[{...stock('BMRI').chart.result[0],meta:{...stock('BMRI').chart.result[0].meta,chartPreviousClose:null},indicators:{}}]}},'BMRI','Mandiri',now);assert.equal(missing.change,null);assert.deepEqual(missing.points,[]);
if(process.argv.includes('--live')){const live=await createMarketBoard().get();assert.ok(live.length>0);console.log(live.map(q=>({code:q.code,price:q.price,change:q.change,chartPoints:q.points.length,source:q.source,marketAt:q.marketAt})));const fallback=await createMarketBoard((url,init)=>{if(url.includes('coingecko')||url.includes('indodax'))return Promise.reject(Error('Provider blocked'));return fetch(url,init);}).get();assert.equal(fallback.length,7);assert.ok(fallback.filter(q=>q.kind==='crypto').every(q=>q.estimated&&q.changeLabel==='sesi USD'&&q.points.length>1));console.log('PASS: live crypto fallback when CoinGecko and Indodax are unavailable.');}
console.log('PASS: fixed public watchlist, authentic changes/history, five-minute cache, concurrent reads, invalid payloads, cold outage and retained timestamps.');
