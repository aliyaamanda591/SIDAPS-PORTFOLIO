import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('lib/portfolio-html.ts','utf8').split('export const portfolioHtml=')[1].trim();
const html=JSON.parse(source.slice(0,-1));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const start=script.indexOf('const IDX_HOLIDAYS='),end=script.indexOf('function lastCompletedIdxClose(',start);
const elements=Object.fromEntries(['loginMarket','loginMarketBadge','loginMarketTitle','loginMarketMessage','loginMarketSession','loginMarketClock','dashboardMarketNotice','dashboardMarketBadge','dashboardMarketTitle','dashboardMarketMessage'].map(id=>[id,{textContent:'',className:'',attrs:{},setAttribute(k,v){this.attrs[k]=v;}}]));
const timers=[],events={};const context={Intl,Date,Set,document:{hidden:false,getElementById:id=>elements[id],addEventListener:(name,fn)=>{events[name]=fn;}},setInterval:(fn,delay)=>{timers.push({fn,delay});},window:{addEventListener:(name,fn)=>{events[name]=fn;}}};vm.createContext(context);vm.runInContext(script.slice(start,end),context);
const at=(date,time)=>Date.parse(date+'T'+time+':00+07:00');
function check(date,time,tone,needle){context.now=at(date,time);vm.runInContext('updateLoginMarket(now)',context);assert.equal(elements.loginMarket.className,'login-market market-board '+tone,date+' '+time);assert.ok(elements.loginMarketSession.textContent.includes(needle));assert.ok(elements.loginMarketClock.textContent.includes(time.replace(':','.')));}
check('2026-11-09','08:44','closed','belum buka');check('2026-11-09','08:45','opening','Prapembukaan');check('2026-11-09','09:00','open','sesi I');
assert.ok(elements.loginMarketTitle.textContent.includes('Semangat, trader'));check('2026-11-09','11:59','open','sesi I');check('2026-11-09','12:00','break','13.30');check('2026-11-09','13:29','break','Istirahat');check('2026-11-09','13:30','open','sesi II');check('2026-11-09','15:49','open','sesi II');check('2026-11-09','15:50','closing','Prapenutupan');check('2026-11-09','16:00','closing','Pencocokan');check('2026-11-09','16:02','closing','Pascapenutupan');check('2026-11-09','16:15','closed','selesai');assert.ok(elements.loginMarketTitle.textContent.includes('Mau lihat apa?'));
check('2026-11-13','11:30','break','14.00');check('2026-11-13','13:59','break','14.00');check('2026-11-13','14:00','open','sesi II');check('2026-11-14','10:00','closed','akhir pekan');check('2026-12-25','10:00','closed','libur bursa');
// Explicit Jakarta conversion, regardless of the execution machine's timezone.
context.now=Date.parse('2026-11-09T02:00:00Z');vm.runInContext('updateLoginMarket(now)',context);assert.ok(elements.loginMarketClock.textContent.includes('09.00'));assert.equal(elements.loginMarketBadge.textContent,'Bursa buka · sesi I');
check('2027-01-04','10:00','open','Kalender libur tahun 2027 belum tersedia');
// Dashboard and every equity badge share the same lunch / closing schedule.
context.Date=class extends Date{static now(){return context.now;}};context.esc=s=>String(s);context.idxMarketStatus={};
vm.runInContext(script.match(/function marketBadgeHtml\(a\)[^\n]+/)[0],context);
vm.runInContext(script.match(/function updateMarketSummary\(now=Date.now\(\)\)[^\n]+/)[0],context);
check('2026-11-09','11:44','open','sesi I');assert.ok(!elements.loginMarketTitle.textContent.includes('menit'));
check('2026-11-09','11:45','open','sesi I');assert.ok(elements.loginMarketTitle.textContent.includes('15 menit'));vm.runInContext('updateMarketSummary(now)',context);assert.equal(elements.dashboardMarketTitle.textContent,elements.loginMarketTitle.textContent);
check('2026-11-09','12:00','break','13.30');vm.runInContext('updateMarketSummary(now)',context);assert.ok(elements.dashboardMarketMessage.textContent.includes('Selamat makan siang'));assert.ok(elements.dashboardMarketMessage.textContent.includes('13.30 WIB'));assert.ok(vm.runInContext("marketBadgeHtml({kind:'stock'})",context).includes('jeda siang'));
check('2026-11-13','11:15','open','sesi I');assert.ok(elements.loginMarketTitle.textContent.includes('15 menit'));check('2026-11-13','11:30','break','14.00');assert.ok(elements.loginMarketMessage.textContent.includes('14.00 WIB'));
check('2026-11-09','13:30','open','sesi II');vm.runInContext('updateMarketSummary(now)',context);assert.equal(elements.dashboardMarketBadge.textContent,'BURSA BUKA');assert.ok(!elements.dashboardMarketMessage.textContent.includes('berhenti sementara'));
check('2026-11-09','16:15','closed','selesai');vm.runInContext('updateMarketSummary(now)',context);assert.ok(elements.dashboardMarketMessage.textContent.includes('harga terakhir'));assert.ok(vm.runInContext("marketBadgeHtml({kind:'stock'})",context).includes('Bursa tutup'));assert.ok(vm.runInContext("marketBadgeHtml({kind:'crypto'})",context).includes('24 jam'));assert.equal(vm.runInContext("marketBadgeHtml({kind:'gold15'})",context),'');
assert.ok(html.includes("${a.kind==='stock'?marketBadgeHtml(a):''}</td>"),'Portfolio rows carry current stock status');assert.ok(html.includes('${transactionMarketBadge(t)}</td>'),'Historical stock rows carry a separately displayed current market status');
assert.ok(timers.some(t=>t.delay===15000));assert.equal(typeof events.focus,'function');assert.equal(typeof events.visibilitychange,'function');
assert.ok(html.includes('Kripto tetap buka 24 jam'));assert.ok(html.includes('@media(prefers-reduced-motion:reduce){.login-market'));
assert.ok(html.includes('id="emailAuthForm"'));assert.ok(html.includes('id="googleSignInButton"'));assert.ok(html.indexOf('id="loginMarket"')<html.indexOf('id="emailAuthForm"'));
console.log('PASS: login/dashboard lunch and closing notices, 15-minute heads-up, Monday/Friday boundaries, resumption, stock-row badges, crypto separation, weekends, holidays, Jakarta timezone, automatic updates and login controls.');
