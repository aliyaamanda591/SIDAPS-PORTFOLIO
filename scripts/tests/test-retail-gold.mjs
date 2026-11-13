import assert from 'node:assert/strict';
import fs from 'node:fs';
import {RETAIL_SOURCES,parseRetailPage,RetailGoldService} from '../../lib/retail-gold.ts';
const now=Date.parse('2026-11-09T04:00:00Z');
const pages=[
 '<div class="last-updated">Monday, 09 November 2026, 08:58 WIB</div><div class="harga-kami-beli"><div id="perhiasan-emas"><table><tr><td>K14</td><td>Rp1.208.138</td></tr><tr><td>K15</td><td>Rp1.295.173</td></tr></table></div></div><div class="harga-kami-jual"><td>K15</td><td>Rp9.999.999</td></div>',
 '<p>HARGA BUYBACK</p><div class="se-price-update"><span></span> Pembaruan terakhir <strong>9 November 2026 • 10:49 WIB</strong></div><div class="se-price-row"><span><i class="se-price-mark"></i>K15</span><strong>Rp&nbsp;1.289.000</strong></div>',
 '<h2>Harga Beli Perhiasan Emas</h2><strong>Last Updated : 9 November , 2026 at 09.00 (WITA)</strong><table><tr><td>K15</td><td>Rp1.297.685</td></tr></table>',
];
for(let i=0;i<3;i++){const q=parseRetailPage(RETAIL_SOURCES[i],pages[i],now);assert.equal(q.price,[1295173,1289000,1297685][i]);assert.equal(q.stale,false);assert.equal(q.fallback,i!==0);assert.equal(q.marketAt,Date.parse(['2026-11-09T01:58Z','2026-11-09T03:49Z','2026-11-09T01:00Z'][i]));}
for(const bad of [pages[0].replace('K15','K150'),pages[0].replace('Rp1.295.173','Rp0'),pages[0].replace('09 November','10 November'),pages[0].replace('last-updated','other')])assert.throws(()=>parseRetailPage(RETAIL_SOURCES[0],bad,now));
const response=html=>new Response(html,{headers:{'Content-Type':'text/html'}});
let calls=[];const choose=(failed)=>async url=>{calls.push(url);const i=RETAIL_SOURCES.findIndex(s=>s.url===url);if(failed.includes(i))throw Error('Site down');return response(pages[i]);};
const service=new RetailGoldService();let q=await service.get(choose([]),now);assert.equal(q.price,1295173);assert.equal(calls.length,1);await service.get(choose([]),now+1000);assert.equal(calls.length,1,'Five-minute cache avoids excess requests');
calls=[];q=await service.get(choose([0]),now+300001);assert.equal(q.price,1289000);assert.equal(q.fallback,true);assert.equal(calls.length,2,'Primary failure selects first backup');
calls=[];q=await service.get(choose([0,1]),now+600002);assert.equal(q.price,1297685);assert.equal(calls.length,3,'Second backup covers two outages');
calls=[];const old=q;q=await service.get(choose([0,1,2]),now+900003);assert.equal(q.price,old.price);assert.equal(q.fetchedAt,old.fetchedAt,'Outage never refreshes the timestamp');assert.equal(q.stale,true,'Retained prices are explicitly stale');
await assert.rejects(()=>new RetailGoldService().get(choose([0,1,2]),now));
const staleFetch=async url=>response(pages[RETAIL_SOURCES.findIndex(s=>s.url===url)].replace(/9 November|09 November/g,'6 November'));
q=await new RetailGoldService().get(staleFetch,now);assert.equal(q.stale,true,'Old source dates are never advertised fresh');
// Date or markup drift in one provider must not stop the others.
q=await new RetailGoldService().get(async url=>url===RETAIL_SOURCES[0].url?response('<html>maintenance</html>'):choose([])(url),now);assert.equal(q.price,1289000);
if(process.argv.includes('--live')){
 for(const s of RETAIL_SOURCES){const r=await fetch(s.url,{signal:AbortSignal.timeout(12000)});assert.equal(r.ok,true);const html=await r.text();const parsed=parseRetailPage(s,html);console.log(JSON.stringify({source:s.name,price:parsed.price,marketAt:new Date(parsed.marketAt).toISOString(),stale:parsed.stale}));}
}
if(process.argv.includes('--fixtures')){
 for(let i=0;i<3;i++){const html=fs.readFileSync(['../../outputs-iloveemas.html','../../outputs-superemas.html','../../outputs-haloemas.html'][i],'utf8');const p=parseRetailPage(RETAIL_SOURCES[i],html);console.log(JSON.stringify({source:p.source,price:p.price,marketAt:new Date(p.marketAt).toISOString()}));}
}
console.log('PASS: three exact K15 parsers, source dates/timezones, safe price validation, five-minute cache, primary/backup outages, format drift, stale source dates, last-good timestamps and total failure.');
