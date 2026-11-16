import assert from 'node:assert/strict';
const origin=process.env.SIDAPS_TEST_ORIGIN||'http://127.0.0.1:5193';assert.equal(new URL(origin).hostname,'127.0.0.1');
const forged={'oai-authenticated-user-id':'owner','oai-authenticated-user-email':'owner@example.invalid'};
for(const headers of [forged,{Cookie:'__Host-sidaps_firebase=forged-token',...forged},{Cookie:'__Host-investment_session='+'a'.repeat(64),...forged}])for(const path of ['/api/state','/api/admin/accounts','/api/prices/__audit_nonexistent__']){const r=await fetch(origin+path,{headers});assert.equal(r.status,401,path);assert.equal(r.headers.get('set-cookie'),null);await r.text();}
const response=await fetch(origin+'/api/auth/firebase',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...forged},body:JSON.stringify({idToken:'forged-token',email:'owner@example.invalid',userId:'victim',roles:['admin']})});assert.equal(response.status,401);assert.equal(response.headers.get('set-cookie'),null);
console.log('PASS: actual production Worker rejects spoofed headers, invalid native and legacy cookies, forged Firebase tokens and client-supplied ownership/roles.');
