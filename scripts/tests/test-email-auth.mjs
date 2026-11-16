import assert from 'node:assert/strict';
const origin=process.env.SIDAPS_TEST_ORIGIN||'http://127.0.0.1:5193';assert.equal(new URL(origin).hostname,'127.0.0.1');
const post=(action,body={},from=origin)=>fetch(origin+'/api/auth/'+action,{method:'POST',headers:{Origin:from,'Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await post('firebase',{idToken:'forged'},'https://untrusted.example')).status,403);
for(const action of ['register','login','recover','request-otp','reset-otp','activate','change-password']){const r=await post(action,{email:'synthetic@example.invalid',password:'Synthetic-Password-123!'});assert.equal(r.status,410,action);assert.equal(r.headers.get('set-cookie'),null);}
for(const action of ['firebase','google']){const r=await post(action,{idToken:'forged',email:'owner@example.invalid',roles:['admin']});assert.equal(r.status,401);assert.equal(r.headers.get('set-cookie'),null);}
const config=await fetch(origin+'/api/auth/config');assert.equal(config.status,200);const publicConfig=await config.json();assert.equal(publicConfig.projectId,'sidaps-portfolio');assert.equal(publicConfig.private_key,undefined);assert.equal(publicConfig.client_email,undefined);
const logout=await post('logout');assert.equal(logout.status,200);const cookies=logout.headers.getSetCookie();assert.equal(cookies.length,2);for(const c of cookies){assert.ok(c.includes('Max-Age=0'));assert.ok(c.includes('HttpOnly'));assert.ok(c.includes('Secure'));}
console.log('PASS: native Firebase config endpoint, Origin guard, forged-token/role rejection, custom password/OTP endpoints retired and logout clears both cookie formats.');
