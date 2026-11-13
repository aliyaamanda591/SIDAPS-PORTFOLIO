import assert from 'node:assert/strict';
import {generateKeyPair,exportJWK,createLocalJWKSet,SignJWT} from 'jose';
import {verifyGoogleToken,FIREBASE_PROJECT_ID} from '../../lib/firebase-google.ts';
const {privateKey,publicKey}=await generateKeyPair('RS256'),jwk=await exportJWK(publicKey),key=createLocalJWKSet({keys:[{...jwk,kid:'fixture-key',alg:'RS256',use:'sig'}]});
const now=Math.floor(Date.now()/1000),base={sub:'google-fixture-uid',aud:FIREBASE_PROJECT_ID,iss:'https://securetoken.google.com/'+FIREBASE_PROJECT_ID,iat:now,exp:now+3600,auth_time:now,email:'Member@Example.test',email_verified:true,name:'Member One',firebase:{sign_in_provider:'google.com'}};
const sign=payload=>new SignJWT(payload).setProtectedHeader({alg:'RS256',kid:'fixture-key'}).sign(privateKey);
const valid=await sign(base);assert.deepEqual(await verifyGoogleToken(valid,key),{uid:'google-fixture-uid',email:'member@example.test',displayName:'Member One'});
assert.equal((await verifyGoogleToken(await sign({...base,picture:'https://lh3.googleusercontent.com/a/fixture=s96-c'}),key)).photoURL,'https://lh3.googleusercontent.com/a/fixture=s96-c');
assert.equal((await verifyGoogleToken(await sign({...base,picture:'https://evil.test/avatar'}),key)).photoURL,undefined);
await assert.rejects(()=>verifyGoogleToken('short-invalid-token',key));
// Exercise signed invalid claims as well as malformed input.
for(const invalid of [{aud:'another-project'},{iss:'https://securetoken.google.com/another-project'},{exp:now-300},{iat:now-3600},{auth_time:now-1800},{auth_time:now+300},{email_verified:false},{email:'invalid-email'},{sub:''},{firebase:{sign_in_provider:'password'}}]){const token=await sign({...base,...invalid});await assert.rejects(()=>verifyGoogleToken(token,key));}
const pieces=valid.split('.');pieces[1]=Buffer.from(JSON.stringify({...base,email:'owner@example.test'})).toString('base64url');await assert.rejects(()=>verifyGoogleToken(pieces.join('.'),key),'Forged email is rejected by signature verification');
const missing={...base};delete missing.auth_time;await assert.rejects(()=>sign(missing).then(token=>verifyGoogleToken(token,key)));
console.log('PASS: Google token signatures, Firebase project audience/issuer, verified email, provider, expiry, recent sign-in, required claims, and tamper rejection.');
