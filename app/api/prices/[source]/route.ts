import { authenticatedUser } from "@/lib/account-store";
export const dynamic = "force-dynamic";
const sources: Record<string,string> = {
  bitcoin: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=idr&include_last_updated_at=true",
  gold: "https://api.gold-api.com/price/XAU", fx: "https://open.er-api.com/v6/latest/USD",
  gold15: "https://rajaemas.id/api/proxy/prices",
};
const cache = new Map<string,{expires:number; data:unknown}>();
async function forward(source: string, init?: RequestInit, key=source) {
  const existing = cache.get(key); if (existing && existing.expires > Date.now()) return Response.json(existing.data, {headers:{"Cache-Control":"private, max-age=30"}});
  const response = await fetch(source, { ...init, signal: AbortSignal.timeout(8500) });
  if (!response.ok) throw Error("Sumber harga belum merespons.");
  const data = await response.json(); if(cache.size>250)cache.clear();cache.set(key,{data,expires:Date.now()+300000});
  return Response.json(data,{headers:{"Cache-Control":"private, max-age=30"}});
}
export async function GET(request:Request,{params}:{params:Promise<{source:string}>}) {
  try { await authenticatedUser(); const { source }=await params; if (source === "yahoo") {const symbol=new URL(request.url).searchParams.get("symbol")||"";if(!/^[A-Z]{4}\.JK$/.test(symbol))return Response.json({error:"Kode tidak valid"},{status:400});return await forward("https://query1.finance.yahoo.com/v8/finance/chart/"+symbol+"?range=1d&interval=1d");}if(!sources[source])return new Response(null,{status:404});return await forward(sources[source]);}
  catch(error){if(error instanceof Response)return error;return Response.json({error:"Sumber harga belum tersedia. Harga terakhir dipertahankan."},{status:502});}
}
export async function POST(request:Request,{params}:{params:Promise<{source:string}>}) {
  try {await authenticatedUser();const {source}=await params;if(source!=="stocks")return new Response(null,{status:404});if(request.headers.get("origin")!==new URL(request.url).origin)return new Response(null,{status:403});const text=await request.text();if(text.length>15000)return new Response(null,{status:413});const body=JSON.parse(text),codes=body?.symbols?.tickers;if(!Array.isArray(codes)||codes.length>200||codes.some(c=>typeof c!=="string"||!/^IDX:[A-Z]{4}$/.test(c)))return Response.json({error:"Kode tidak valid"},{status:400});const payload={symbols:{tickers:[...new Set(codes)].sort()},columns:["name","close","currency","description","update_mode"]};return await forward("https://scanner.tradingview.com/indonesia/scan",{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(payload)},JSON.stringify(payload));}
  catch(error){if(error instanceof Response)return error;return Response.json({error:"Harga saham belum tersedia."},{status:502});}
}
