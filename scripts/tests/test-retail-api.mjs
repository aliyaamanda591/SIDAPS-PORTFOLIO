import assert from 'node:assert/strict';
// Local-only integration: never create test accounts on the live investment site.
const origin='http://127.0.0.1:5178',password='Local-Retail-Check-2026!',email='retail-'+Date.now()+'@example.test';
const registration=await fetch(origin+'/api/auth/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email,displayName:'Local retail check',password,confirm:password})});
assert.equal(registration.status,200,await registration.clone().text());
const cookie=registration.headers.getSetCookie()[0].split(';')[0];
assert.equal((await fetch(origin+'/api/prices/gold15')).status,401,'Retail proxy requires authentication');
const response=await fetch(origin+'/api/prices/gold15',{headers:{Cookie:cookie}}),json=await response.json();
assert.equal(response.status,200,JSON.stringify(json));assert.equal(json.karats[0].label,'15K');assert.ok(json.karats[0].price>100000);assert.ok(Date.parse(json.last_updated));assert.ok(Number.isFinite(json.fetched_at));assert.ok(/I Love Emas|Super Emas|Halo Mas/.test(json.source));
console.log(JSON.stringify({status:response.status,source:json.source,price:json.karats[0].price,marketAt:json.last_updated,fallback:json.fallback,stale:json.stale}));
const cached=await (await fetch(origin+'/api/prices/gold15',{headers:{Cookie:cookie}})).json();assert.equal(cached.fetched_at,json.fetched_at,'Cached reads preserve real fetch time');
await fetch(origin+'/api/auth/logout',{method:'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'},body:'{}'});
console.log('PASS: authenticated local Worker retail endpoint, real source fetch/parse, normalized JSON, source timestamp, cache and anonymous access denial.');
