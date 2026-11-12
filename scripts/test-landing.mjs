import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {landingHtml} from '../lib/landing-html.ts';
const ids=[...landingHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const match of landingHtml.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(match[1]),'Navigation points to a real section');
assert.ok(!landingHtml.includes('CLOUD_BOOTSTRAP'));assert.ok(landingHtml.toLowerCase().includes('bukan data pasar'));assert.ok(landingHtml.includes('/?login=1'));
const elements=Object.fromEntries(['demoSymbol','demoName','demoDescription'].map(id=>[id,{}]));const buttons=['stock','crypto','gold'].map(kind=>({dataset:{preview:kind},attrs:{},addEventListener(_,fn){this.click=fn;},setAttribute(k,v){this.attrs[k]=v;}}));
vm.runInNewContext(fs.readFileSync('public/landing.js','utf8'),{document:{querySelectorAll:()=>buttons,getElementById:id=>elements[id]}});
buttons[1].click();assert.equal(elements.demoName.textContent,'Kripto pilihanmu');assert.equal(buttons[1].attrs['aria-pressed'],'true');assert.equal(buttons[0].attrs['aria-pressed'],'false');buttons[2].click();assert.ok(elements.demoDescription.textContent.includes('gram'));
// Motion reveals once, pauses offscreen/background, and is skipped for reduced motion.
function motionFixture(reduced){const classes=()=>{const values=new Set();return {values,add:k=>values.add(k),remove:k=>values.delete(k),toggle:(k,on)=>on?values.add(k):values.delete(k)};};const target={classList:classes()},hero={classList:classes()},root={classList:classes()},observers=[],events={};
 const document={hidden:false,documentElement:root,querySelectorAll:q=>q==='[data-preview]'?[]:[target],querySelector:()=>hero,addEventListener:(name,fn)=>events[name]=fn};
 const window={matchMedia:()=>({matches:reduced}),IntersectionObserver:class{constructor(cb){this.cb=cb;this.removed=[];observers.push(this);}observe(){}unobserve(t){this.removed.push(t);}disconnect(){}}};
 vm.runInNewContext(fs.readFileSync('public/landing.js','utf8'),{document,window});return {target,hero,root,document,observers,events};}
const motion=motionFixture(false);assert.ok(motion.target.classList.values.has('reveal-ready'));motion.observers[0].cb([{target:motion.target,isIntersecting:true}]);assert.ok(motion.target.classList.values.has('is-visible'));assert.equal(motion.observers[0].removed.length,1);motion.observers[1].cb([{isIntersecting:false}]);assert.ok(motion.hero.classList.values.has('motion-offscreen'));motion.document.hidden=true;motion.events.visibilitychange();assert.ok(motion.root.classList.values.has('landing-motion-paused'));assert.equal(motionFixture(true).observers.length,0);
if(process.argv.includes('--http')){
 const origin='http://127.0.0.1:5178';
 const home=await fetch(origin+'/');assert.equal(home.status,200);assert.ok((await home.text()).includes('Semua asetmu.'));
 const login=await fetch(origin+'/?login=1');assert.equal(login.status,200);assert.ok((await login.text()).includes('id="googleSignInButton"'));
 const password='Local-Landing-Test-2026!',registered=await fetch(origin+'/api/auth/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email:'landing-'+Date.now()+'@example.test',password,confirm:password,displayName:'Local landing fixture'})});assert.equal(registered.status,200);
 const cookie=registered.headers.getSetCookie()[0].split(';')[0];const account=await fetch(origin+'/',{headers:{Cookie:cookie}});assert.ok((await account.text()).includes('id="dashboardAssets"'),'Signed-in users still go directly to the portfolio');
 const publicView=await fetch(origin+'/?view=landing',{headers:{Cookie:cookie}});const text=await publicView.text();assert.ok(text.includes('Semua asetmu.'));assert.ok(!text.includes('Local landing fixture'),'Public landing never includes account data');
}
console.log('PASS: public landing, anchored navigation, interactive asset examples, login access and signed-in dashboard isolation.');
