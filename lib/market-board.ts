// Public, fixed watchlist only. Never reads accounts or portfolio records.
export type MarketQuote = { code:string; name:string; kind:'stock'|'crypto'; price:number; change:number|null; points:number[]; period:string; source:string; marketAt:string; fetchedAt:string; stale:boolean };
const stocks = [['BMRI','Bank Mandiri'],['BBCA','Bank Central Asia'],['BBRI','Bank Rakyat Indonesia'],['TLKM','Telkom Indonesia']];
const coins = [['bitcoin','BTC','Bitcoin'],['ethereum','ETH','Ethereum'],['solana','SOL','Solana']];
const positive = (n:unknown):n is number => typeof n==='number'&&Number.isFinite(n)&&n>0;
const finite = (n:unknown):n is number => typeof n==='number'&&Number.isFinite(n);
function points(raw:unknown):number[]{ return Array.isArray(raw)?raw.filter(positive).filter((_,i,a)=>i%Math.max(1,Math.ceil(a.length/60))===0||i===a.length-1):[]; }
export function yahooQuote(data:any,code:string,name:string,now:number):MarketQuote {
  const r=data?.chart?.result?.[0],m=r?.meta;
  if(m?.symbol!==code+'.JK'||m.currency!=='IDR'||!positive(m.regularMarketPrice)||!positive(m.regularMarketTime))throw Error('Invalid equity quote');
  const previous=m.chartPreviousClose??m.previousClose;
  return {code,name,kind:'stock',price:m.regularMarketPrice,change:positive(previous)?(m.regularMarketPrice/previous-1)*100:null,points:points(r.indicators?.quote?.[0]?.close),period:'Sesi terakhir',source:'Yahoo Finance · dapat tertunda',marketAt:new Date(m.regularMarketTime*1000).toISOString(),fetchedAt:new Date(now).toISOString(),stale:false};
}
export function coinQuotes(data:any,now:number):MarketQuote[]{
  if(!Array.isArray(data))throw Error('Invalid crypto quotes');
  return coins.flatMap(([id,code,name])=>{const q=data.find((d:any)=>d.id===id);if(!positive(q?.current_price)||!Number.isFinite(Date.parse(q.last_updated)))return [];
    return [{code,name,kind:'crypto' as const,price:q.current_price,change:finite(q.price_change_percentage_24h_in_currency)?q.price_change_percentage_24h_in_currency:finite(q.price_change_percentage_24h)?q.price_change_percentage_24h:null,points:points(q.sparkline_in_7d?.price),period:'7 hari',source:'CoinGecko',marketAt:q.last_updated,fetchedAt:new Date(now).toISOString(),stale:false}];});
}
export function createMarketBoard(fetcher:typeof fetch=fetch,clock=Date.now){
  const saved=new Map<string,MarketQuote>();let expires=0,pending:Promise<MarketQuote[]>|null=null;
  async function json(url:string,init?:RequestInit):Promise<any>{const r=await fetcher(url,{...init,headers:{Accept:'application/json','User-Agent':'SidapsPortfolio/1.0',...init?.headers},signal:AbortSignal.timeout(4000)});if(!r.ok)throw Error('Market source unavailable');return r.json();}
  async function refresh(){
    const now=clock(),fresh=new Map<string,MarketQuote>();
    const results=await Promise.allSettled([
      ...stocks.map(async([code,name])=>{const q=yahooQuote(await json('https://query1.finance.yahoo.com/v8/finance/chart/'+code+'.JK?range=1d&interval=5m'),code,name,now);fresh.set(code,q);}),
      (async()=>{for(const q of coinQuotes(await json('https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=bitcoin,ethereum,solana&sparkline=true&price_change_percentage=24h'),now))fresh.set(q.code,q);})()
    ]);
    // Independent quote fallback; no manufactured charts or percentage changes.
    const missing=stocks.filter(([code])=>!fresh.has(code));
    await Promise.allSettled([
      missing.length?(async()=>{const d=await json('https://scanner.tradingview.com/indonesia/scan',{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({symbols:{tickers:missing.map(([c])=>'IDX:'+c)},columns:['name','close','change']})});for(const row of d?.data||[]){const [code,price,change]=row.d||[];const entry=missing.find(([c])=>c===code);if(entry&&positive(price))fresh.set(code,{code,name:entry[1],kind:'stock',price,change:finite(change)?change:null,points:[],period:'Grafik belum tersedia',source:'TradingView · dapat tertunda',marketAt:'',fetchedAt:new Date(now).toISOString(),stale:false});}})():Promise.resolve(),
      results[4].status==='rejected'||coins.some(([,code])=>!fresh.has(code))?(async()=>{const d=await json('https://indodax.com/api/tickers');for(const [,code,name]of coins){if(fresh.has(code))continue;const row=d?.tickers?.[code.toLowerCase()+'_idr'],price=Number(row?.last);if(positive(price))fresh.set(code,{code,name,kind:'crypto',price,change:null,points:[],period:'Grafik belum tersedia',source:'Indodax',marketAt:positive(d?.server_time)?new Date(d.server_time*1000).toISOString():'',fetchedAt:new Date(now).toISOString(),stale:false});}})():Promise.resolve()
    ]);
    for(const [code,q]of fresh)saved.set(code,q);
    expires=clock()+(fresh.size===7?300000:30000);
    return [...saved.values()].map(q=>({...q,stale:!fresh.has(q.code)}));
  }
  let last:MarketQuote[]=[];
  return {async get(){if(clock()<expires)return last;if(!pending)pending=refresh().then(q=>(last=q)).finally(()=>{pending=null;});return pending;}};
}
export const marketBoard=createMarketBoard();
