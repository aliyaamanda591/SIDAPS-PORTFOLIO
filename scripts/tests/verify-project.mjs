// Static verification uses assembled HTML and public files; no network or credentials.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {portfolioHtml,loginHtml,landingHtml} from './helpers/templates.mjs';

process.chdir(fileURLToPath(new URL('../../',import.meta.url)));
let references=0,inlineScripts=0;
for(const html of [portfolioHtml,loginHtml,landingHtml]){
 for(const match of html.matchAll(/<(?:script|link|img|image)\b[^>]*?\b(?:src|href)="(\/[^"<>]+)"/g)){
  const url=match[1].split(/[?#]/)[0];
  if(url.startsWith('//')||url.includes('$')||url.includes("'"))continue;
  assert.ok(fs.existsSync(path.join('public',decodeURIComponent(url))),'Missing public asset: '+url);
  references++;
 }
 for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)){
  new vm.Script(match[1]);inlineScripts++;
 }
}
const files=fs.readdirSync('public').filter(file=>file.endsWith('.js'));
for(const file of files){
 const checked=spawnSync(process.execPath,['--check',path.join('public',file)],{encoding:'utf8'});
 assert.equal(checked.status,0,file+': '+checked.stderr);
}
const config=JSON.parse(fs.readFileSync('lib/firebase-web-config.json','utf8'));
assert.equal(config.projectId,'sidaps-portfolio');
assert.equal(config.authDomain,'sidaps-portfolio.firebaseapp.com');
assert.ok(!('private_key' in config)&&!('client_email' in config),'Only public Firebase Web Config belongs in source');
console.log(`PASS: ${references} asset references, ${inlineScripts} inline scripts, ${files.length} public scripts, original Firebase project and public config format.`);
