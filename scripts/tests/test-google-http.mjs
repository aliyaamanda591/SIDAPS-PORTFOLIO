import assert from 'node:assert/strict';
const origin='http://127.0.0.1:5178';
const post=(body,from=origin)=>fetch(origin+'/api/auth/google',{method:'POST',headers:{Origin:from,'Content-Type':'application/json'},body:JSON.stringify(body)});
assert.equal((await post({idToken:'fake-token'},'https://untrusted.example')).status,403,'Google session exchange is same-origin only');
for(const body of [{},{idToken:'fake-token'},{idToken:123},{idToken:'A'.repeat(7500),roles:['admin'],email:'owner@example.test'}])assert.equal((await post(body)).status,401,'Forged client identity cannot create session');
const rejected=await post({idToken:'fake-token',userId:'another-user',roles:['admin']});assert.equal(rejected.headers.get('set-cookie'),null,'Rejected token never issues cookie');
const html=await (await fetch(origin+'/')).text();assert.ok(html.includes('id="googleSignInButton"'));assert.ok(html.includes('onclick="googleSignIn()"'));assert.ok(html.includes('sidaps-portfolio.firebaseapp.com'));assert.ok(html.includes('id="emailAuthForm"'),'Email/password form retained');assert.ok(!html.includes('Handled by'),'Private seed transactions absent');
console.log('PASS: Google endpoint CSRF, forged token/roles/email rejection, no invalid cookie issuance, Google button/configuration, preserved email form, sanitized shell.');
