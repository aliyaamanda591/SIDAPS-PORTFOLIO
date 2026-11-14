/* Public illustrative animation, independent from authentication and account data. */
(()=>{
 const player=document.getElementById('tutorial'),screen=document.getElementById('landingDemoScreen');if(!player||!screen)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)'),chapters=[...document.querySelectorAll('[data-how-step]')];
 const cursor='<div class="ld-cursor" aria-hidden="true"><svg viewBox="0 0 30 36"><path d="M3 2v28l7-7 6 11 5-3-6-10h10Z" fill="white" stroke="#173f30" stroke-width="2" stroke-linejoin="round"/></svg></div><div class="ld-ring" aria-hidden="true"></div>';
 const badge='<div class="ld-window-top"><span><img src="/sidaps-mark.svg" width="20" height="20" alt=""> Sidaps</span><small>SIMULASI</small></div>';
 const slides=[
 {title:'Buat ruang pribadimu.',text:'Pilih Google atau daftar dengan email. Akunmu dimulai dari portofolio kosong.',html:'<div class="ld-login"><span class="ld-eyebrow">SELAMAT DATANG</span><h4>Mulai catatan pertamamu.</h4><div class="ld-field">nama@email.com</div><div class="ld-field">••••••••••</div><div class="ld-google" data-ld="google"><b>G</b> Lanjutkan dengan Google</div><small>atau daftar dengan email dan password</small></div><div class="ld-toast" hidden>✓ Akun contoh siap · 0 aset</div>'},
 {title:'Pilih aset. Catat pembelianmu.',text:'Cari aset, isi unit dan total pembelian, lalu pilih tanggal serta platform milikmu.',html:'<div class="ld-heading">Tambah aset ke portofolio</div><div class="ld-search">⌕ Cari saham, kripto, atau emas</div><div class="ld-asset" data-ld="asset"><span class="ld-icon">BCA</span><span><b>BBCA</b><small>Bank Central Asia</small></span><b class="ld-selected">＋</b></div><div class="ld-form"><div><small>Jumlah (lembar)</small><div class="ld-field" data-ld="qty"><b data-ld-value="qty">—</b></div></div><div><small>Total pembelian (Rp)</small><div class="ld-field" data-ld="amount"><b data-ld-value="amount">—</b></div></div><div><small>Tanggal</small><div class="ld-field">14/11/2026</div></div><div><small>Platform</small><div class="ld-field" data-ld="platform"><b data-ld-value="platform">Pilihanmu ⌄</b></div></div></div><div class="ld-save" data-ld="save">Simpan pembelian</div><div class="ld-toast" hidden>✓ 100 lembar · modal Rp500.000 tercatat</div>'},
 {title:'Lihat gambaran yang lebih utuh.',text:'Pantau modal, nilai aset dan riwayat. Catat penjualan saat kamu menjual melalui platformmu.',html:'<div class="ld-heading">Ringkasan investasi</div><div class="ld-metrics"><span>Modal tercatat<b>Rp500.000</b></span><span>Nilai ilustrasi<b>Rp520.000</b></span></div><div class="ld-chart"><span>Perjalanan catatan <small>Ilustrasi</small></span><svg viewBox="0 0 340 110"><path class="ld-grid" d="M0 25H340M0 65H340M0 105H340"/><path class="ld-chart-line" pathLength="1" d="M5 92L40 83L75 90L110 59L145 67L180 40L215 50L250 25L290 34L335 15"/></svg></div><div class="ld-asset" data-ld="details"><span class="ld-icon">BCA</span><span><b>BBCA</b><small>100 lembar · contoh aset</small></span><b class="ld-growth">+Rp20.000</b></div><div class="ld-toast" hidden>✓ Catatanmu kini lebih teratur</div>'}
 ];
 let index=0,timers=[],animations=[],playing=false,visible=false,userPaused=false,last={x:14,y:40};
 const q=s=>screen.querySelector(s),el=id=>document.getElementById(id);
 function clear(){timers.forEach(clearTimeout);timers=[];animations.forEach(a=>a.cancel());animations=[];}
 function later(ms,fn){timers.push(setTimeout(()=>{if(playing&&!document.hidden)fn();},ms));}
 function controls(){el('landingDemoToggle').textContent=playing?'Ⅱ Jeda':'▶ Putar';el('landingDemoToggle').setAttribute('aria-label',playing?'Jeda tutorial':'Putar tutorial');player.classList.toggle('ld-playing',playing);}
 function point(name){const target=q('[data-ld="'+name+'"]'),pointer=q('.ld-cursor');if(!target||!pointer)return;screen.querySelectorAll('.ld-focus').forEach(e=>e.classList.remove('ld-focus'));target.classList.add('ld-focus');const r=target.getBoundingClientRect(),root=screen.getBoundingClientRect(),next={x:r.left-root.left+r.width*.65,y:r.top-root.top+r.height*.55};pointer.style.transform='translate('+next.x+'px,'+next.y+'px)';if(!reduce.matches&&pointer.animate)animations.push(pointer.animate([{transform:'translate('+last.x+'px,'+last.y+'px)'},{transform:pointer.style.transform}],{duration:330,easing:'ease-out'}));last=next;const ring=q('.ld-ring');ring.style.left=next.x+'px';ring.style.top=next.y+'px';if(!reduce.matches&&ring.animate)animations.push(ring.animate([{opacity:1,transform:'translate(-50%,-50%) scale(.4)'},{opacity:0,transform:'translate(-50%,-50%) scale(1.7)'}],{duration:550}));}
 function type(name,value){const node=q('[data-ld-value="'+name+'"]');if(!node)return;if(reduce.matches){node.textContent=value;return;}for(let i=1;i<=value.length;i++)later(i*42,()=>{node.textContent=value.slice(0,i);});}
 function toast(){q('.ld-toast').hidden=false;}
 function show(){clear();last={x:14,y:40};screen.innerHTML='<div class="ld-window" aria-hidden="true">'+badge+slides[index].html+'</div>'+cursor;el('landingDemoTitle').textContent=slides[index].title;el('landingDemoText').textContent=slides[index].text;el('landingDemoCounter').textContent='0'+(index+1)+' / 03';chapters.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));player.style.setProperty('--ld-duration','6000ms');player.classList.remove('ld-new-scene');void player.offsetWidth;player.classList.add('ld-new-scene');controls();if(!playing)return;
  if(index===0){later(650,()=>point('google'));later(1550,toast);}
  if(index===1){later(350,()=>point('asset'));later(800,()=>{q('.ld-selected').textContent='✓';q('.ld-asset').classList.add('ld-chosen');});later(1250,()=>{point('qty');type('qty','100');});later(1900,()=>{point('amount');type('amount','500000');});later(2600,()=>point('platform'));later(3100,()=>{q('[data-ld-value="platform"]').textContent='Stockbit';});later(3800,()=>point('save'));later(4450,toast);}
  if(index===2){later(900,()=>point('details'));later(1800,toast);}
  later(6000,()=>{index=(index+1)%slides.length;show();});
 }
 function focusPlayer(){player.scrollIntoView({block:'start',behavior:reduce.matches?'auto':'smooth'});}
 function start(){if(document.hidden)return;playing=true;show();}
 function pause(manual=false){clear();playing=false;if(manual)userPaused=true;controls();}
 el('landingDemoToggle').addEventListener('click',()=>{if(playing)pause(true);else{userPaused=false;start();focusPlayer();}});
 el('landingDemoReplay').addEventListener('click',()=>{userPaused=false;index=0;start();focusPlayer();});
 chapters.forEach((b,i)=>b.addEventListener('click',()=>{index=i;userPaused=false;start();focusPlayer();}));
 document.querySelectorAll('[data-watch-tutorial]').forEach(link=>link.addEventListener('click',()=>{userPaused=false;index=0;start();}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(visible&&!userPaused&&!reduce.matches)start();});
 show();
 if(window.IntersectionObserver){new window.IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!userPaused&&!reduce.matches)start();else if(!visible)pause();},{threshold:.25}).observe(player);}else{visible=true;if(!reduce.matches)start();}
 // Public hero preview: rotate existing asset tabs without account/API requests.
 const hero=document.querySelector('.hero-visual'),buttons=[...document.querySelectorAll('[data-preview]')],line=document.querySelector('.portfolio-chart .chart-line');if(!hero||!buttons.length||!line)return;
 const paths=['M0 115L35 108L68 116L102 88L133 95L166 73L199 84L232 47L265 61L298 37L331 46L365 22L402 33L440 13','M0 100L35 80L68 109L102 62L133 88L166 39L199 70L232 52L265 76L298 31L331 51L365 18L402 39L440 25','M0 115L35 113L68 106L102 110L133 96L166 91L199 95L232 74L265 71L298 57L331 63L365 43L402 37L440 28'];
 let heroTimer=null,heroVisible=true,autoClick=false,kind=0,heroAnimation=null;
 function heroClear(){if(heroTimer)clearTimeout(heroTimer);heroTimer=null;}
 function heroPause(){heroClear();heroAnimation?.cancel();heroAnimation=null;}
 function draw(i){heroAnimation?.cancel();line.setAttribute('d',paths[i]);const area=document.querySelector('.portfolio-chart path[fill]');if(area)area.setAttribute('d',paths[i]+'V135H0Z');if(!reduce.matches&&line.animate)heroAnimation=line.animate([{strokeDasharray:1,strokeDashoffset:1},{strokeDasharray:1,strokeDashoffset:0}],{duration:1100,easing:'ease-out'});hero.dataset.animatedAsset=['stock','crypto','gold'][i];}
 function schedule(delay=4800){heroClear();if(document.hidden||!heroVisible||reduce.matches)return;heroTimer=setTimeout(()=>{kind=(kind+1)%buttons.length;autoClick=true;buttons[kind].click();autoClick=false;schedule();},delay);}
 buttons.forEach((b,i)=>b.addEventListener('click',()=>{kind=i;draw(i);if(!autoClick)schedule(9000);}));
 document.addEventListener('visibilitychange',()=>document.hidden?heroPause():schedule());
 if(window.IntersectionObserver)new window.IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;if(heroVisible)schedule();else heroPause();},{threshold:.1}).observe(hero);else schedule();
})();
