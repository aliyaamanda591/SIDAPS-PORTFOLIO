import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loginHtml} from '../../lib/login-html.ts';
const js=fs.readFileSync('public/login-experience.js','utf8'),css=fs.readFileSync('public/login-experience.css','utf8');
assert.equal(createHash('sha256').update(fs.readFileSync('public/sidaps-mark.svg')).digest('hex'),'58ea172b5e5ca389caf31fbbad8c8fa8c12660d343c43d9664c292efcc39ecec','Original Sidaps logo remains byte-for-byte identical');
assert.ok(Buffer.byteLength(loginHtml)<30000);
assert.ok(loginHtml.includes('Ilustrasi dekoratif · bukan data pasar'));assert.ok(loginHtml.includes('data-login-experience="emerald"'));assert.ok(loginHtml.includes('INVESTMENT MANAGEMENT PLATFORM'));
assert.equal((loginHtml.match(/class="intro-candle /g)||[]).length,12);
assert.ok(!/lightning|petir/i.test(css));for(const color of css.match(/#[0-9a-f]{3,8}\b/gi)||[])assert.ok(!['#00f','#0000ff','#f0f','#ff00ff','#800080'].includes(color.toLowerCase()));
assert.ok(!/requestAnimationFrame|setInterval|fetch\(/.test(js),'Enhancement does not introduce a render loop or API traffic');
assert.ok(css.includes('prefers-reduced-motion'));assert.ok(css.includes('[data-page-hidden]'));
assert.ok(loginHtml.includes('hidden><button type="button" id="introSkip"'),'Intro is hidden by default if JavaScript is disabled');
const element=()=>{const classes=new Set();return {hidden:false,inert:false,textContent:'',disabled:false,attrs:{},events:{},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)},setAttribute(k,v){this.attrs[k]=v;},removeAttribute(k){delete this.attrs[k];},addEventListener(type,fn){this.events[type]=fn;},focus(){this.focused=true;},querySelector(){return element();},animate(){this.animations=(this.animations||0)+1;return {cancel(){}};}};};
function setup({reduce=false,pending=true}={}){
 const elements=new Map(['loginEntry','sidapsIntro','introSkip','emailAuthForm','authTitle','emailSubmit','googleSignInButton','emailAuthMessage'].map(id=>[id,element()])),root=element(),body=element(),timers=new Map(),storage=new Map(),events={},calls={email:0,google:0,mode:0,reload:0};let timerId=0;
 if(pending)root.classList.add('login-intro-pending');
 const context={console,URL,Promise,setTimeout:(fn,ms)=>{const id=++timerId;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id),matchMedia:()=>({matches:reduce,addEventListener(){}}),sessionStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},addEventListener:(key,fn)=>events[key]=fn,location:{href:'https://sidaps.example/?login=1',reload(){calls.reload++;}},document:{documentElement:root,body,hidden:false,getElementById:id=>elements.get(id),querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn}};
 const form=elements.get('emailAuthForm');form.onsubmit=async event=>{event.preventDefault();calls.email++;await new Promise(resolve=>{calls.resolveEmail=resolve;});};
 context.cloudAuthSetMode=()=>{calls.mode++;};context.googleSignIn=async()=>{calls.google++;await new Promise(resolve=>{calls.resolveGoogle=resolve;});};context.window=context;vm.createContext(context);vm.runInContext(js,context);return {context,elements,root,body,timers,storage,events,calls,form};
}
const a=setup();assert.equal(a.elements.get('loginEntry').inert,true);assert.equal(a.elements.get('sidapsIntro').hidden,false);assert.ok([...a.timers.values()].some(t=>t.ms===2280));
a.elements.get('introSkip').events.click();assert.equal(a.elements.get('loginEntry').inert,false);assert.equal(a.elements.get('sidapsIntro').hidden,true);assert.equal(a.storage.get('sidaps_login_intro_v1'),'1');assert.equal(a.elements.get('authTitle').focused,true);
const reduced=setup({reduce:true});assert.equal(reduced.elements.get('loginEntry').inert,false);assert.equal(reduced.elements.get('sidapsIntro').hidden,true);reduced.context.cloudAuthSetMode('register');assert.equal(reduced.form.animations,undefined);
// Inline watchdog releases a partially initialized intro even if the external enhancement fails.
const fallback=setup({pending:false});vm.runInContext([...loginHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],fallback.context);assert.equal(fallback.root.classList.contains('login-intro-pending'),false,'Seen intro is not replayed');fallback.storage.clear();vm.runInContext([...loginHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],fallback.context);fallback.elements.get('loginEntry').inert=true;[...fallback.timers.values()].find(t=>t.ms===3200).fn();assert.equal(fallback.elements.get('loginEntry').inert,false);
const event={preventDefault(){this.prevented=true;}};const first=a.form.onsubmit(event);const second=a.form.onsubmit(event);await second;assert.equal(a.calls.email,1,'Double submit cannot duplicate an auth request');await a.context.googleSignIn();assert.equal(a.calls.google,0,'Google cannot race an email request');a.context.cloudAuthSetMode('recover');assert.equal(a.calls.mode,0,'Mode stays stable during request');assert.equal(a.elements.get('emailSubmit').attrs['aria-busy'],'true');a.calls.resolveEmail();await first;assert.equal(a.elements.get('emailSubmit').attrs['aria-busy'],'false');
a.context.cloudAuthSetMode('register');assert.equal(a.calls.mode,1);assert.equal(a.form.animations,1);const g1=a.context.googleSignIn(),g2=a.context.googleSignIn();await g2;assert.equal(a.calls.google,1);assert.equal(a.elements.get('googleSignInButton').attrs['aria-busy'],'true');a.calls.resolveGoogle();await g1;assert.equal(a.elements.get('googleSignInButton').attrs['aria-busy'],'false');
a.context.document.hidden=true;a.events.visibilitychange();assert.equal(a.body.attrs['data-page-hidden'],'');a.context.document.hidden=false;a.events.visibilitychange();assert.equal(a.body.attrs['data-page-hidden'],undefined);
const success=reduced.context.SidapsLoginExperience.authenticated();await success;assert.equal(reduced.calls.reload,1);await reduced.context.SidapsLoginExperience.authenticated();assert.equal(reduced.calls.reload,1,'Success cannot navigate twice');
const failure=setup();const pendingFailure=failure.form.onsubmit(event);failure.calls.resolveEmail();await pendingFailure;assert.equal(failure.body.attrs['data-auth-busy'],undefined,'Completion restores controls without replacing auth error handling');
const ids=[...loginHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
assert.ok(loginHtml.includes('else if(window.SidapsLoginExperience)await window.SidapsLoginExperience.authenticated();else location.reload();'));
console.log('PASS: original logo, decorative 12-candle reveal, <30KB HTML, reduced motion, skip/watchdog/no-JS fallback, no API/render loop, duplicate-submit and Google/email race protection, mode transitions, background pause and success navigation.');
