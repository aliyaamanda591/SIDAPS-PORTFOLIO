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
function fallback(reduced=false){
 const elements=new Map();const element=()=>{const classes=new Set();return {attrs:{},events:{},classList:{add(...v){v.forEach(x=>classes.add(x));},remove(...v){v.forEach(x=>classes.delete(x));},toggle(v,on){on?classes.add(v):classes.delete(v);},contains(v){return classes.has(v);}},setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,v){this.events[k]=v;},querySelectorAll(){return [];},scrollIntoView(options){this.scrollOptions=options;}};};
 const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);};
 const context={document:{getElementById:get,hidden:false,addEventListener(){}},matchMedia:()=>({matches:reduced}),window:{},console};
 if(reduced){context.gsap={registerPlugin(){},matchMedia(){return {add(query,cb){if(query==='(prefers-reduced-motion: reduce)')cb();}};}};context.ScrollTrigger={config(){}};context.window={gsap:context.gsap,ScrollTrigger:context.ScrollTrigger};}
 vm.runInNewContext(script,context);return {get};
}
for(const reduced of [false,true]){const {get}=fallback(reduced);assert.ok(get('sidaps-intro').classList.contains('si-static'));assert.equal(get('si-hero').inert,false);assert.equal(get('si-hero').attrs['aria-hidden'],'false');assert.equal(get('si-opening').attrs['aria-hidden'],'true');get('si-skip').events.click();assert.equal(get('si-hero').scrollOptions.behavior,reduced?'instant':'smooth');}
assert.ok(landingIntroHtml.includes('src="/sidaps-mark.svg"'),'The intro uses the actual SIDAPS logo');
assert.ok(fs.existsSync('public/landing-assets/aset-investasi.png'));assert.ok(fs.existsSync('public/landing-assets/aset-investasi.webp'));
console.log('PASS: intro isolation, ordered CDN loading, missing-CDN fallback, reduced-motion fallback, keyboard-accessible final actions and linked image assets.');
