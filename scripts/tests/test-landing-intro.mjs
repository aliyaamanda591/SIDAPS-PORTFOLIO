import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {landingIntroHtml} from '../../lib/landing-intro-html.ts';
const landing=fs.readFileSync('lib/landing-wealth-html.ts','utf8');
const ids=[...((landingIntroHtml+landing).matchAll(/\bid="([^"]+)"/g))].map(m=>m[1]);
assert.ok(ids.length>30,'Combined landing and intro IDs were found');
assert.equal(ids.length,new Set(ids).size,'Intro IDs do not collide with the existing landing');
assert.ok(landing.includes('\u0024{landingIntroHtml}'));
assert.ok(landing.indexOf('gsap.min.js')<landing.indexOf('ScrollTrigger.min.js'));
assert.ok(landing.indexOf('ScrollTrigger.min.js')<landing.indexOf('/landing-intro.js'));
const script=fs.readFileSync('public/landing-intro.js','utf8');
function fixture(mode='fallback'){
 const elements=new Map(),events={},frames=new Map(),scrolls=[],observers=[];let frameId=0,reverted=false,cleanup;
 const style=()=>({setProperty(k,v){this[k]=v;},removeProperty(k){delete this[k];},getPropertyValue(k){return this[k]||'';}});
 const get=id=>{if(!elements.has(id)){const values=new Set();elements.set(id,{hidden:false,offsetHeight:800,offsetWidth:390,offsetTop:100,clientHeight:800,clientWidth:390,style:style(),attrs:{},events:{},classList:{add(...v){v.forEach(x=>values.add(x));},remove(...v){v.forEach(x=>values.delete(x));},toggle(v,on){on?values.add(v):values.delete(v);},contains(v){return values.has(v);}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;},removeEventListener(k){delete this.events[k];},querySelectorAll(){return [];},getTotalLength(){return 100;},getBoundingClientRect(){return {bottom:this.bottom??800};},contains(e){return e===get('si-skip');},focus(){this.focused=true;}});}return elements.get(id);};
 get('sidaps-intro').offsetHeight=2400;get('sidaps-intro').nextElementSibling=get('nav');
 const document={getElementById:get,documentElement:get('root'),activeElement:null,hidden:false,addEventListener(k,v){events['document:'+k]=v;},removeEventListener(k){delete events['document:'+k];}};
 const window={scrollY:0,location:{hash:''},history:{},addEventListener(k,v){events[k]=v;},removeEventListener(k){delete events[k];},scrollTo(o){scrolls.push(o);this.scrollY=o.top;}};
 const trigger={end:1600},timeline={scrollTrigger:trigger,time(){return 95;},to(){return this;},fromTo(){return this;},addLabel(){return this;}};
 const context={document,window,console,matchMedia:()=>({matches:mode==='reduced'}),requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},cancelAnimationFrame(id){frames.delete(id);},setTimeout,clearTimeout,ResizeObserver:class{constructor(){observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}};
 if(mode!=='fallback'){
  context.ScrollTrigger={config(){},refresh(){}};context.gsap={registerPlugin(){},set(){},timeline(){return timeline;},matchMedia(){return {add(query,cb){if(query==='(prefers-reduced-motion: '+(mode==='reduced'?'reduce':'no-preference')+')')cleanup=cb();},revert(){reverted=true;cleanup?.();}};}};
  Object.assign(window,{gsap:context.gsap,ScrollTrigger:context.ScrollTrigger});
 }
 vm.runInNewContext(script,context);
 return {get,window,document,events,scrolls,observers,get reverted(){return reverted;},flush(){for(const [id,fn]of frames){frames.delete(id);fn();}}};
}
for(const mode of ['fallback','reduced','motion']){
 const f=fixture(mode);assert.equal(f.get('sidaps-intro').hidden,false,'Each new document shows intro');
 if(mode!=='motion'){assert.ok(f.get('sidaps-intro').classList.contains('si-static'));assert.equal(f.get('si-hero').inert,false);}
 f.document.activeElement=f.get('si-skip');f.get('si-skip').events.click();assert.equal(f.get('sidaps-intro').hidden,true);assert.equal(f.get('sidaps-intro').inert,true);assert.equal(f.get('sidaps-intro').attrs['aria-hidden'],'true');assert.equal(f.window.scrollY,0,'Skip hands off to navigation');assert.ok(f.get('nav').focused);assert.equal(f.events.scroll,undefined,'Completion removes scroll listener');
 if(mode==='motion'){assert.ok(f.reverted,'GSAP context is released');assert.ok(f.observers[0].disconnected,'Resize observer is released');}
 f.get('si-skip').events.click();assert.equal(f.scrolls.length,2,'Completion is idempotent');
 assert.equal(fixture(mode).get('sidaps-intro').hidden,false,'Reload creates a fresh intro without storage flags');
}
for(const [mode,y,bottom,expected]of [['motion',1602,800,0],['motion',2900,-500,500],['fallback',2900,-500,500]]){
 const f=fixture(mode);f.window.scrollY=y;f.get('sidaps-intro').bottom=bottom;f.events.wheel();f.events.scroll();f.flush();assert.equal(f.get('sidaps-intro').hidden,true);assert.equal(f.window.scrollY,expected,'Collapse preserves downstream scroll position');f.window.scrollY=0;assert.equal(f.get('sidaps-intro').hidden,true,'Scrolling back never revives intro');
}
const restored=fixture('motion');restored.window.scrollY=2400;restored.events.scroll();restored.flush();assert.equal(restored.get('sidaps-intro').hidden,false,'Automatic scroll restoration cannot consume intro');assert.equal(restored.window.scrollY,0);
const beforeEnd=fixture('motion');beforeEnd.window.scrollY=1400;beforeEnd.events.wheel();beforeEnd.events.scroll();beforeEnd.flush();assert.equal(beforeEnd.get('sidaps-intro').hidden,false,'Final laptop scene remains visible until user leaves intro');
assert.match(fs.readFileSync('public/landing-intro.css','utf8'),/#sidaps-intro\[hidden\]\{display:none!important\}/);
assert.ok(landingIntroHtml.includes('src="/sidaps-mark.svg"'),'The intro uses the actual SIDAPS logo');
assert.ok(fs.existsSync('public/landing-assets/aset-investasi.png'));assert.ok(fs.existsSync('public/landing-assets/aset-investasi.webp'));
console.log('PASS: intro completion once per document, no replay on upward scroll, clean handoff, fresh reload, restoration guard, motion cleanup, reduced-motion and missing-CDN fallbacks.');
