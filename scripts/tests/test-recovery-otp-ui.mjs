// Historical filename: current UI uses email reset links, not numeric OTP.
import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {setImmediate as tick} from 'node:timers/promises';
import {loginHtml,portfolioHtml} from './helpers/templates.mjs';
for(const html of [loginHtml,portfolioHtml]){assert.match(html,/\/recovery-otp\.js\?v=\d+/);assert.match(html,/\/recovery-otp\.css\?v=\d+/);}
assert.ok(loginHtml.indexOf('/recovery-otp.js')<loginHtml.indexOf('/login-experience.js'));
function setup(href='https://sidaps.online/?login=1',verifyFailure=false){
 const nodes=new Map(),timers=new Map(),requests=[];let clock=1000,serial=0,baseSubmits=0,navigated=0,failure=null;
 function el(){return {value:'',textContent:'',hidden:false,required:false,disabled:false,attrs:{},
  set id(value){nodes.set(value,this);},closest(){return this.parent;},before(){},after(){},prepend(){},appendChild(){},
  setAttribute(k,v){this.attrs[k]=String(v);},getAttribute(k){return this.attrs[k]??null;},removeAttribute(k){delete this.attrs[k];},
  focus(){this.focused=true;},querySelector(){return null;},
  set innerHTML(value){this.html=value;for(const [,id]of value.matchAll(/id="([^"]+)"/g))nodes.set(id,el());}
 };}
 for(const id of ['emailAuthForm','emailAddress','emailRecoveryField','emailRecovery','emailPassword','emailConfirm','emailConfirmField','emailSubmit','emailAuthMessage','authBack','authTitle','authSub','registerSecurityNote'])nodes.set(id,el());
 const get=id=>nodes.get(id);get('emailAddress').parent=el();get('emailPassword').parent=el();
 const location=new URL(href),events={};
 const context={URL,console,Date:{now:()=>clock},location,
  setTimeout(fn){timers.set(++serial,fn);return serial;},clearTimeout(id){timers.delete(id);},
  addEventListener:(name,fn)=>events[name]=fn,history:{replaceState(_s,_t,path){location.href=new URL(path,location).href;}},
  document:{getElementById:get,querySelector:()=>null,createElement:el},
  cloudAuthSetMode(mode){get('emailConfirmField').hidden=mode!=='register';get('emailConfirm').required=mode==='register';get('emailPassword').value='';get('emailConfirm').value='';},
  async emailAuthRequest(action,body){requests.push({action,body:JSON.parse(JSON.stringify(body))});if(failure||(verifyFailure&&action==='verify-reset'))throw Error(failure||'Tautan kedaluwarsa');return action==='verify-reset'?{ok:true,email:'member@example.test'}:{ok:true,retryAfter:60};},
  SidapsLoginExperience:{async authenticated(){navigated++;},skipIntro(){}}
 };
 get('emailAuthForm').onsubmit=async()=>{baseSubmits++;};get('emailAuthForm').requestSubmit=()=>get('emailAuthForm').onsubmit({preventDefault(){}});
 context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync('public/recovery-otp.js','utf8'),context);
 return {context,get,requests,timers,events,mode:value=>context.cloudAuthSetMode(value),submit:()=>get('emailAuthForm').onsubmit({preventDefault(){}}),
  advance(ms){clock+=ms;for(const [id,fn]of [...timers]){timers.delete(id);fn();}},fail(value){failure=value;},get baseSubmits(){return baseSubmits;},get navigated(){return navigated;}};
}
const a=setup();a.mode('register');assert.equal(a.get('emailConfirm').required,true);await a.submit();assert.equal(a.baseSubmits,1);
a.mode('login');assert.equal(a.get('emailConfirmField').hidden,true);await a.submit();assert.equal(a.baseSubmits,2);
a.mode('recover');assert.equal(a.get('emailRecoveryField').hidden,true);assert.equal(a.get('emailRecovery').required,false);
assert.equal(a.get('emailPassword').parent.hidden,true);assert.equal(a.get('emailPassword').required,false);assert.equal(a.get('emailSubmit').textContent,'Kirim tautan reset');assert.equal(a.get('emailOtp'),undefined);
a.get('emailAddress').value='member@example.test';a.fail('Email belum berhasil dikirim');await a.submit();assert.equal(a.get('emailAuthMessage').attrs['data-state'],'error');assert.equal(a.get('resetSentGuide').hidden,true);assert.equal(a.get('emailSubmit').disabled,false);assert.equal(a.navigated,0);
a.fail(null);await a.submit();assert.deepEqual(a.requests.at(-1),{action:'request-otp',body:{email:'member@example.test'}});assert.equal(a.get('resetSentGuide').hidden,false);assert.equal(a.get('emailSubmit').hidden,true);assert.equal(a.get('emailAddress').readOnly,true);assert.equal(a.get('otpResend').disabled,true);
const count=a.requests.length;a.get('otpResend').onclick();assert.equal(a.requests.length,count);a.advance(61000);assert.equal(a.get('otpResend').disabled,false);a.get('otpResend').onclick();await tick();assert.equal(a.requests.length,count+1);
a.get('otpBackToLogin').onclick();assert.equal(a.get('emailAddress').readOnly,false);assert.equal(a.get('emailPassword').parent.hidden,false);assert.equal(a.get('resetSentGuide').hidden,true);assert.equal(a.get('emailAddress').value,'member@example.test');a.events.pagehide();assert.equal(a.timers.size,0);
for(const [field,credential]of [['oobCode','firebase-code-synthetic-123'],['token','a'.repeat(64)]]){
 const reset=setup('https://sidaps.online/reset-password?'+field+'='+credential);await tick();assert.deepEqual(reset.requests[0],{action:'verify-reset',body:{[field]:credential}});assert.equal(reset.get('emailAddress').value,'member@example.test');assert.equal(reset.get('emailAddress').readOnly,true);assert.equal(reset.get('emailPassword').required,true);assert.equal(reset.get('emailPassword').minLength,8);
 reset.get('emailPassword').value=reset.get('emailConfirm').value='short';await reset.submit();assert.equal(reset.requests.length,1);
 reset.get('emailPassword').value='New-Password-83!';reset.get('emailConfirm').value='Different-password';await reset.submit();assert.equal(reset.requests.length,1);
 reset.get('emailConfirm').value=reset.get('emailPassword').value;reset.fail('Tautan kedaluwarsa');await reset.submit();assert.equal(reset.navigated,0);assert.equal(reset.get('emailAuthMessage').attrs['data-state'],'error');
 reset.fail(null);await reset.submit();assert.equal(reset.requests.at(-1).action,'confirm-reset');assert.equal(reset.requests.at(-1).body[field],credential);assert.equal(reset.requests.at(-1).body.password,'New-Password-83!');assert.equal(reset.navigated,1);assert.equal(reset.context.location.search,'');
}
const expired=setup('https://sidaps.online/reset-password?oobCode=expired-synthetic-code',true);await tick();assert.equal(expired.get('emailAuthMessage').textContent,'Tautan kedaluwarsa');assert.equal(expired.navigated,0);assert.equal(expired.requests.length,1);
console.log('PASS: actual shells, email reset links, signup/login preservation, delivery failure, resend cooldown, back navigation, Firebase/custom proof, expiry, password validation, retry and successful navigation; no real email.');
