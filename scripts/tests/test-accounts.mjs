import assert from 'node:assert/strict';import {validateState} from '../../lib/state-validation.ts';
const origin=process.env.SIDAPS_TEST_ORIGIN||'http://127.0.0.1:5193';assert.equal(new URL(origin).hostname,'127.0.0.1');
for(const path of ['/api/state','/api/admin/accounts']){const r=await fetch(origin+path,{headers:{'oai-authenticated-user-id':'forged-owner','oai-authenticated-user-email':'owner@example.invalid'}});assert.equal(r.status,401);await r.text();}
const r=await fetch(origin+'/api/admin/accounts',{method:'PATCH',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({id:'other-user',status:'resolved'})});assert.equal(r.status,401);await r.text();
const state={transactions:[],assets:[{name:'BMRI',kind:'stock',quantity:-1,unit:'lembar',symbol:'BMRI.JK',valueSnapshot:0}],profile:{displayName:'Local Test',photo:''},logs:[],sheetUrl:'',lastBackup:''};assert.throws(()=>validateState(state),/Aset/);
const h=await (await fetch(origin+'/?login=1')).text();assert.ok(h.includes('/firebase-auth.js'));assert.ok(!h.includes('initialTx'));assert.ok(!h.includes('Handled by'));
console.log('PASS: native-auth account boundary, anonymous admin/state denial, financial validation and sanitized public login. Positive account linking/isolation is tested with local SQLite in test-firebase-auth.mjs.');
