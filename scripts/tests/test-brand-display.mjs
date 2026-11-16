import {portfolioHtml} from './helpers/templates.mjs';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=portfolioHtml;
const assets=[{name:'BTC INDODAX',kind:'crypto',unit:'BTC',company:'Bitcoin · BTC/IDR · Indodax',qty:0.25,capital:1000,symbol:'indodax:btc_idr'},{name:'SOL INDODAX',kind:'crypto',unit:'SOL',company:'Solana · SOL/IDR · Indodax'},{name:'BMRI',kind:'stock',unit:'lembar',company:'PT Bank Mandiri'}];
const before=JSON.stringify(assets),ctx={assets,companyFor:a=>a.company};vm.createContext(ctx);
vm.runInContext(html.slice(html.indexOf('function assetDisplayName('),html.indexOf('function assetLogoHtml(')),ctx);
assert.equal(ctx.assetDisplayName('BTC INDODAX'),'BTC');assert.equal(ctx.assetDisplayName(assets[1]),'SOL');assert.equal(ctx.assetDisplayName('BMRI'),'BMRI');assert.equal(ctx.assetDisplayName('UNKNOWN INDODAX'),'UNKNOWN');
assert.equal(ctx.assetDisplayCompany(assets[0]),'Bitcoin · BTC/IDR');assert.equal(ctx.assetDisplayCompany(assets[2]),'PT Bank Mandiri');assert.equal(JSON.stringify(assets),before,'Presentation must not modify legacy financial keys or quantities');
assert.ok(html.includes("'<option value=\"'+esc(name)+'\">'+esc(assetDisplayName(name))+'</option>'"),'Asset selector submits original stored key');
assert.ok(html.includes("name:coin.code+' INDODAX'"),'Keep exchange-backed internal key to avoid stock collisions');
assert.ok(html.includes('Harga kripto: Indodax'),'Preserve price source disclosure');
const logos={window:{}};vm.runInNewContext(fs.readFileSync('public/brand-logos.js','utf8'),logos);const map=logos.window.SidapsBrandLogos;
assert.equal(Object.keys(map.stocks).length,839);
for(const ticker of ['AMIN','AMMN','AMMS','AMOR','AMRT','ANDI','ANJT','ANTM'])assert.ok(map.stocks[ticker],ticker+' has local logo');
for(const [ticker,path] of Object.entries(map.stocks)){assert.match(ticker,/^[A-Z]{4}$/);assert.equal(path,'/logos/stocks/'+ticker+'.svg');const svg=fs.readFileSync('public'+path,'utf8');assert.ok(svg.includes('<svg'));assert.doesNotMatch(svg,/<script|<foreignObject|<!DOCTYPE|javascript:|\son\w+\s*=/i);}
for(const [key,path] of Object.entries(map.platforms)){assert.match(path,/^\/logos\/(platforms\/[a-z0-9-]+\.(?:png|jpg)|stocks\/[A-Z]{4}\.svg)$/);assert.ok(fs.existsSync('public'+path),key);}
for(const platform of ['GROWIN','STOCKBIT','INDODAX','PLUANG','PINTU','BIONS','BIBIT'])assert.ok(map.platforms[platform],platform+' logo');
console.log('PASS: neutral crypto labels, unchanged legacy keys/holdings, source disclosure, 839 safe stock SVGs and '+Object.keys(map.platforms).length+' platform logo mappings.');
