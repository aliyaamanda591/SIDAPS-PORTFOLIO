import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';
import {canonicalPortfolioUrl,canonicalPortfolioRedirect} from '../../lib/canonical-url.ts';
import {landingHtml,loginHtml,portfolioHtml} from './helpers/templates.mjs';
const cases=[
 ['https://sidaps-portfolio.sidaps.workers.dev/?login=1','https://sidaps.online/?login=1'],
 ['https://sidaps-portfolio.aliyaamanda591.workers.dev/reset-password?oobCode=synthetic%2Bcode&mode=resetPassword','https://sidaps.online/reset-password?oobCode=synthetic%2Bcode&mode=resetPassword'],
 ['https://preview.anything.workers.dev/api/state?q=a+b&q=c%2Fd','https://sidaps.online/api/state?q=a+b&q=c%2Fd'],
 ['https://sidaps-portfolio.sidaps.workers.dev./?login=1&v=example','https://sidaps.online/?login=1&v=example'],
 ['https://old.workers.dev/favicon.svg?v=2','https://sidaps.online/favicon.svg?v=2'],
 ['http://old.workers.dev:8080/path?a=1','https://sidaps.online/path?a=1'],
 ['https://sidaps.online./?login=1','https://sidaps.online/?login=1'],
 ['http://sidaps.online/path','https://sidaps.online/path']
];
for(const [input,expected]of cases){
 assert.equal(canonicalPortfolioUrl(input),expected);
 for(const method of ['GET','HEAD','POST']){
  const r=canonicalPortfolioRedirect(new Request(input,{method}));assert.equal(r.status,301);assert.equal(r.headers.get('Location'),expected);assert.equal(r.headers.get('Set-Cookie'),null);
 }
 assert.equal(canonicalPortfolioUrl(expected),null,'Target must never redirect again');
}
for(const input of ['https://sidaps.online/','https://sidaps.online/?login=1','http://localhost:5173/?demo=1','http://127.0.0.1:5194/','http://[::1]:5173/','https://other.example./','https://workers.dev/','https://old.workers.dev.attacker.invalid/'])assert.equal(canonicalPortfolioUrl(input),null,input);
assert.equal(canonicalPortfolioRedirect(new Request('https://sidaps.online/',{headers:{'X-Forwarded-Host':'old.workers.dev'}})),null,'Do not trust spoofed host headers');

// Check the actual Worker entry with framework/binding substitutes, before any auth/env work.
const source=fs.readFileSync('worker/index.ts','utf8');
const code=ts.transpileModule(source.replace(/^import .*;\r?$/gm,'').replaceAll('import.meta.env.DEV','false').replace('export default worker;','globalThis.testWorker=worker;'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/export \{\};?\s*$/,'');
let frameworkCalls=0,assetCalls=0;
const context={URL,Date,Response,canonicalPortfolioRedirect,handler:{fetch(){frameworkCalls++;return new Response('framework');}},runWithConnectorBinding:(_binding,fn)=>fn()};vm.createContext(context);vm.runInContext(code,context);
for(const path of ['/','/?login=1','/reset-password?oobCode=test','/api/state','/favicon.svg']){
 const env=new Proxy({},{get(){throw Error('Redirect must precede binding access');}});
 const r=await context.testWorker.fetch(new Request('https://legacy.workers.dev'+path),env,undefined);
 assert.equal(r.status,301);assert.equal(r.headers.get('Location'),'https://sidaps.online'+path);
}
assert.equal(frameworkCalls,0);
const assets={fetch(){assetCalls++;return new Response('asset');}};
assert.equal(await (await context.testWorker.fetch(new Request('https://sidaps.online/favicon.svg'),{ASSETS:assets},{})).text(),'asset');assert.equal(assetCalls,1);
await context.testWorker.fetch(new Request('http://localhost:5194/api/state'),{ASSETS:assets},{});assert.equal(frameworkCalls,1);
assert.ok(fs.readFileSync('vite.config.ts','utf8').includes('run_worker_first: true'),'Static files must not bypass the redirect');
const route=fs.readFileSync('app/route.ts','utf8');assert.ok(route.indexOf('canonicalPortfolioRedirect(request)')<route.indexOf('resolveIdentity()'));

// Client fallback is consistent with the server, including old already-open pages.
for(const file of ['lib/google-auth-client.js','lib/login/auth-script.ts','lib/portfolio/scripts/hosted-auth.ts']){
 const text=fs.readFileSync(file,'utf8');const match=text.match(/function correctGoogleLoginOrigin\(\)\{[^\n\r]+?return true;\}/);assert.ok(match,file);
 let target='';const ctx={URL,location:{hostname:'legacy.workers.dev',href:'https://legacy.workers.dev/?login=1',replace:value=>{target=value;}}};vm.createContext(ctx);vm.runInContext(match[0],ctx);assert.equal(ctx.correctGoogleLoginOrigin(),true);assert.equal(target,'https://sidaps.online/?login=1');ctx.location={hostname:'sidaps.online',href:target,replace(){throw Error('Loop');}};assert.equal(ctx.correctGoogleLoginOrigin(),false);
}
assert.equal((landingHtml.match(/rel="canonical"/g)||[]).length,1);assert.match(landingHtml,/<link rel="canonical" href="https:\/\/sidaps\.online"\s*\/>/);assert.match(landingHtml,/<meta property="og:url" content="https:\/\/sidaps\.online">/);
for(const html of [landingHtml,loginHtml,portfolioHtml]){
 assert.doesNotMatch(html,/https?:\/\/[^\s"'<>]*(?:workers\.dev|chatgpt\.site)/,'No legacy outbound URLs in rendered UI');
}
for(const match of landingHtml.matchAll(/href="([^"]+)"/g))if(match[1].includes('?login=')||match[1].includes('?demo='))assert.equal(new URL(match[1],'https://sidaps.online').origin,'https://sidaps.online');
console.log('PASS: Worker-wide permanent redirect for pages/API/assets, paths/queries, no host spoof/open redirect/loops, localhost bypass, asset serving, consistent SDK fallback, primary CTA links, canonical and Open Graph.');

// Public SEO documents describe only real canonical pages, not auth/demo/private data.
assert.equal(landingHtml.match(/<title>(.*?)<\/title>/)[1].replaceAll('&amp;','&'),'Sidaps Portfolio — Catatan Investasi Saham, Kripto & Emas');
assert.match(landingHtml,/<meta name="description" content="Sidaps[^\"]+Indonesia[^\"]+">/);
const structured=[...landingHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];assert.equal(structured.length,1);
const schema=JSON.parse(structured[0][1]);assert.equal(schema['@context'],'https://schema.org');assert.deepEqual(schema['@graph'].map(x=>x['@type']),['WebSite','SoftwareApplication']);
for(const node of schema['@graph']){assert.equal(node.name,'Sidaps');assert.equal(node.alternateName,'Sidaps Portfolio');assert.equal(node.url,'https://sidaps.online');assert.equal(node.aggregateRating,undefined);}
const robots=fs.readFileSync('public/robots.txt','utf8');assert.match(robots,/User-agent: \*/);assert.match(robots,/^Allow: \/$/m);assert.match(robots,/Sitemap: https:\/\/sidaps\.online\/sitemap\.xml/);assert.doesNotMatch(robots,/^Disallow: \/$/m);
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');assert.match(sitemap,/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]);assert.deepEqual(urls,['https://sidaps.online','https://sidaps.online/blog/cara-mencatat-portofolio-investasi']);
assert.ok(!/noindex/.test(route.slice(route.indexOf('function landingResponse()'))),'Public landing must remain indexable');
console.log('PASS: branded title/description, valid WebSite and SoftwareApplication JSON-LD, crawlable robots, canonical-only sitemap and indexable public landing.');
