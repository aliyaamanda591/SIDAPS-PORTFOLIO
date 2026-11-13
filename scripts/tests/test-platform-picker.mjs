import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('lib/portfolio-html.ts','utf8'),html=JSON.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/,''));
const catalog=JSON.parse(html.match(/const PLATFORM_CATALOG=(\[.*?\]);/)[1]),values=catalog.flatMap(g=>g.items.map(([value])=>value));
assert.equal(values.length,168);assert.equal(new Set(values).size,values.length);
for(const name of ['GROWIN','STOCKBIT','IPOT','AJAIB','INDODAX','BIONS','HOTS','MOTIONTRADE','BRIGHTS','SIMINVEST','BEST','POEMS','RHB TRADESMART'])assert.ok(values.includes(name),name+' available');
const nodes=new Map();let focused='',alert='';
const context=vm.createContext({transactions:[],Event,esc:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),key:value=>String(value).toUpperCase(),alert:message=>{alert=message;},document:{getElementById(id){if(!nodes.has(id))nodes.set(id,{value:'',hidden:true,disabled:true,required:false,innerHTML:'',focus(){focused=id;},dispatchEvent(){context.platformChanged(id);}});return nodes.get(id);}}});
vm.runInContext(html.slice(html.indexOf('const PLATFORM_CATALOG='),html.indexOf('let usageTourStep=')),context);
for(const id of ['txPlatform','buyPlatform','sellPlatform']){
 context.selectCustomPlatform(id);assert.equal(focused,id+'Custom');assert.equal(nodes.get(id+'CustomWrap').hidden,false);assert.equal(nodes.get(id+'Custom').required,true);
 nodes.get(id+'Custom').value='  Toko   Pilihan Saya  ';assert.equal(context.readPlatform(id),'Toko Pilihan Saya');
 nodes.get(id).value='BIONS';context.platformChanged(id);assert.equal(context.readPlatform(id),'BIONS');assert.equal(nodes.get(id+'CustomWrap').hidden,true);assert.equal(nodes.get(id+'Custom').disabled,true);
 nodes.get(id).value='';assert.equal(context.readPlatform(id),null);assert.ok(alert);
}
context.transactions=[{platform:'Platform <pribadi>'},{platform:'BIBIK'},{platform:'GROWIN'}];let options=context.platformOptions();assert.ok(options.includes('Platform &lt;pribadi>'));assert.ok(options.includes('BIBIK'));assert.equal((options.match(/value="GROWIN"/g)||[]).length,1,'Used platform not duplicated in catalog');
context.transactions=[];options=context.platformOptions();assert.ok(!options.includes('Platform &lt;pribadi>'),'Custom names are account-specific');
console.log('PASS: 168 unique platforms, old values, eight app names, all three custom-name forms, validation, escaping and account-specific choices.');
