import assert from 'node:assert/strict';import fs from 'node:fs';import {createHash} from 'node:crypto';import {portfolioHtml} from '../../lib/portfolio-html.ts';
assert.ok(Buffer.byteLength(portfolioHtml)<450000,'Dashboard shell must stay below 450KB');
assert.ok(!/prompt\s*:\s*['"]select_account/.test(fs.readFileSync('lib/google-auth-client.js','utf8')),'Do not force account chooser every time');
assert.ok(fs.readFileSync('lib/google-auth-client.js','utf8').includes('inMemoryPersistence'),'Firebase session must not auto-reauthenticate after explicit site logout');
for(const path of new Set([...portfolioHtml.matchAll(/\/shell-assets\/[a-f0-9]+\.(?:png|woff2?|otf|ttf)/g)].map(m=>m[0]))){assert.ok(fs.existsSync('public'+path),path);assert.ok(createHash('sha256').update(fs.readFileSync('public'+path)).digest('hex').startsWith(path.split('/').at(-1).split('.')[0]));}
assert.ok(portfolioHtml.includes('font-display:swap'));assert.ok(portfolioHtml.includes('id="appBoot"'));assert.ok(portfolioHtml.includes('getElementById("appBoot")?.remove()'));
const store=fs.readFileSync('lib/account-store.ts','utf8'),read=store.slice(store.indexOf('export async function readState('),store.indexOf('export async function writeState('));assert.ok(read.includes('database().batch(['));assert.ok(!read.includes('await ensureAccount'));assert.ok(read.includes('WHERE user_id=?'));
console.log('PASS: compact cached dashboard assets, content hashes, nonblocking fonts, visible boot state, unforced Google chooser and one-batch account-owned state loading.');
