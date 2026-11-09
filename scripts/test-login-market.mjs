import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('lib/portfolio-html.ts','utf8').split('export const portfolioHtml=')[1].trim();
const html=JSON.parse(source.slice(0,-1));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const start=script.indexOf('const IDX_HOLIDAYS='),end=script.indexOf('function lastCompletedIdxClose(',start);
const elements=Object.fromEntries(['loginMarket','loginMarketBadge','loginMarketTitle','loginMarketMessage','loginMarketSession','loginMarketClock'].map(id=>[id,{textContent:'',className:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;}}]));
const timers=[],events={};const context={Intl,Date,Set,document:{hidden:false,getElementById:id=>elements[id],addEventListener:(name,fn)=>{events[name]=fn;}},setInterval:(fn,delay)=>{timers.push({fn,delay});},window:{addEventListener:(name,fn)=>{events[name]=fn;}}};vm.createContext(context);vm.runInContext(script.slice(start,end),context);
const at=(date,time)=>Date.parse(date+'T'+time+':00+07:00');
function check(date,time,tone,needle){context.now=at(date,time);vm.runInContext('updateLoginMarket(now)',context);assert.equal(elements.loginMarket.className,'login-market '+tone,date+' '+time);assert.ok(elements.loginMarketSession.textContent.includes(needle));assert.ok(elements.loginMarketClock.textContent.includes(time.replace(':','.')));}
check('2026-11-09','08:44','closed','belum buka');check('2026-11-09','08:45','opening','Prapembukaan');check('2026-11-09','09:00','open','sesi I');
assert.ok(elements.loginMarketTitle.textContent.includes('Semangat, trader'));check('2026-11-09','11:59','open','sesi I');check('2026-11-09','12:00','break','13.30');check('2026-11-09','13:29','break','Istirahat');check('2026-11-09','13:30','open','sesi II');check('2026-11-09','15:49','open','sesi II');check('2026-11-09','15:50','closing','Prapenutupan');check('2026-11-09','16:00','closing','Pencocokan');check('2026-11-09','16:02','closing','Pascapenutupan');check('2026-11-09','16:15','closed','selesai');assert.ok(elements.loginMarketTitle.textContent.includes('Mau lihat apa?'));
check('2026-11-13','11:30','break','14.00');check('2026-11-13','13:59','break','14.00');check('2026-11-13','14:00','open','sesi II');check('2026-11-14','10:00','closed','akhir pekan');check('2026-12-25','10:00','closed','libur bursa');
// Explicit Jakarta conversion, regardless of the execution machine's timezone.
context.now=Date.parse('2026-11-09T02:00:00Z');vm.runInContext('updateLoginMarket(now)',context);assert.ok(elements.loginMarketClock.textContent.includes('09.00'));assert.equal(elements.loginMarketBadge.textContent,'BURSA BUKA');
check('2027-01-04','10:00','open','Kalender libur tahun 2027 belum tersedia');
assert.ok(timers.some(t=>t.delay===15000));assert.equal(typeof events.focus,'function');assert.equal(typeof events.visibilitychange,'function');
assert.ok(html.includes('Kripto tetap buka 24 jam'));assert.ok(html.includes('@media(prefers-reduced-motion:reduce){.login-market'));
assert.ok(html.includes('id="emailAuthForm"'));assert.ok(html.includes('id="googleSignInButton"'));assert.ok(html.indexOf('id="loginMarket"')<html.indexOf('id="emailAuthForm"'));
console.log('PASS: BEI opening/closing boundaries, lunch and Friday breaks, weekends, holidays, Jakarta timezone, calendar limits, automatic updates, reduced motion and existing login controls.');
