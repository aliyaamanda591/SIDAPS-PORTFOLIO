// Run against a disposable local production Worker, never a live user database.
import assert from 'node:assert/strict';
const origin=process.env.SIDAPS_TEST_ORIGIN||'http://127.0.0.1:5189';
assert.equal(new URL(origin).hostname,'127.0.0.1','This test creates synthetic local accounts only');
const headers={'oai-authenticated-user-id':'forged-owner','oai-authenticated-user-email':'owner-security-fixture@example.invalid'};
for(const path of ['/api/state','/api/admin/accounts','/api/prices/__audit_nonexistent__']){
 const response=await fetch(origin+path,{headers});assert.equal(response.status,401,path+' rejects spoofed identity in the actual production handler');assert.equal(response.headers.get('set-cookie'),null);
}
const post=(action,body,cookie='',from=origin)=>fetch(origin+'/api/auth/'+action,{method:'POST',headers:{Origin:from,'Content-Type':'application/json',Cookie:cookie,...headers},body:JSON.stringify(body)});
assert.equal((await post('activate',{password:'Fixture-password-827!',confirm:'Fixture-password-827!'})).status,401,'Header identity cannot activate/reset a password');
assert.equal((await post('google',{idToken:'forged-token'})).status,401);
assert.equal((await post('register',{email:'csrf@example.invalid'},'','https://untrusted.invalid')).status,403);
const suffix=Date.now().toString(36),email='security-'+suffix+'@example.invalid',password='Synthetic-test-'+suffix+'-83!';
let response=await post('register',{email,displayName:'Synthetic security QA',password,confirm:password});assert.equal(response.status,200,await response.clone().text());
const recovery=(await response.json()).recoveryCode;assert.equal(recovery.replaceAll('-','').length,48);
const cookie=response.headers.getSetCookie()[0].split(';')[0],stateGet=c=>fetch(origin+'/api/state',{headers:{Cookie:c,...headers}});
let stored=await (await stateGet(cookie)).json();assert.equal(stored.state,null,'New account starts empty');
assert.equal((await fetch(origin+'/api/admin/accounts',{headers:{Cookie:cookie,...headers}})).status,403,'A real member plus forged owner headers is still a member');
const state={transactions:[{id:'buy',date:'2026-01-01',type:'MASUK',amount:1000,asset:'BBCA',description:'Synthetic record',platform:'Stockbit'}],assets:[{name:'BBCA',kind:'stock',symbol:'BBCA.JK',unit:'lembar',quantity:100,valueSnapshot:1000}],profile:{displayName:'Synthetic security QA',photo:''},logs:[],sheetUrl:'',lastBackup:''};
const put=(s,r)=>fetch(origin+'/api/state',{method:'PUT',headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json',...headers},body:JSON.stringify({state:s,revision:r,userId:'victim',roles:['admin']})});
response=await put(state,0);assert.equal(response.status,200,await response.clone().text());const revision=(await response.json()).revision;
assert.equal((await put(state,0)).status,409,'Revision guard retained');
for(const invalid of [structuredClone(state),structuredClone(state),structuredClone(state)]){
 if(!globalThis.fixtureStep)globalThis.fixtureStep=1;
 if(globalThis.fixtureStep===1)invalid.assets[0].quantity=100.5;
 if(globalThis.fixtureStep===2)invalid.transactions[0].date='2026-02-30';
 if(globalThis.fixtureStep===3)invalid.transactions.push({id:'sell',date:'2026-02-01',type:'KELUAR',trade:'sell',amount:3000,asset:'BBCA',quantityDelta:-100,costBasis:2000,realizedPnl:1000});
 globalThis.fixtureStep++;assert.equal((await put(invalid,revision)).status,400);
}
stored=await (await stateGet(cookie)).json();assert.equal(stored.revision,revision);assert.equal(stored.state.assets[0].quantity,100);
response=await post('register',{email:'other-'+suffix+'@example.invalid',displayName:'Other synthetic QA',password,confirm:password});assert.equal(response.status,200);const otherCookie=response.headers.getSetCookie()[0].split(';')[0];assert.equal((await (await stateGet(otherCookie)).json()).state,null,'Account isolation retained');
response=await post('login',{email,password});assert.equal(response.status,200,'Email login still works');
response=await post('logout',{},cookie);assert.equal(response.status,200);assert.equal((await stateGet(cookie)).status,401);assert.equal((await stateGet(otherCookie)).status,200);
console.log('PASS: actual production Worker rejects forged headers/token/activation, preserves signup/login/session logout, member roles, user isolation, revision checks and financial validation. Synthetic local database only.');
