/* Public prices only; loaded independently of authentication and private portfolios. */
(()=>{
  const root=document.getElementById('marketWatch');if(!root||!document.body.classList.contains('locked'))return;
  const list=document.getElementById('marketWatchList'),note=document.getElementById('marketWatchNote');
  const catalog=[['BMRI','Bank Mandiri','stock'],['BBCA','Bank Central Asia','stock'],['BBRI','Bank Rakyat Indonesia','stock'],['TLKM','Telkom Indonesia','stock'],['BTC','Bitcoin','crypto'],['ETH','Ethereum','crypto'],['SOL','Solana','crypto']];
  const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
  const stamp=s=>{const n=Date.parse(s);return Number.isFinite(n)?new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(n)+' WIB':'Waktu pasar tidak disediakan';};
  let quotes=[],group='stock',busy=false,lastAttempt=0;
  function chart(q){
    const p=Array.isArray(q.points)?q.points.filter(n=>typeof n==='number'&&Number.isFinite(n)&&n>0).slice(0,61):[];
    if(p.length<2)return '<span class="watch-no-chart">Grafik belum tersedia</span>';
    const low=Math.min(...p),span=Math.max(...p)-low||1,xy=p.map((n,i)=>(i/(p.length-1)*100).toFixed(1)+','+(30-(n-low)/span*26).toFixed(1)).join(' ');
    return '<svg class="watch-chart" viewBox="0 0 100 34" role="img" aria-label="'+safe(q.code+' · '+q.period)+'"><title>'+safe(q.code+' · '+q.period)+'</title><polyline points="'+xy+'" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke"/></svg><small class="watch-period">'+safe(q.period)+'</small>';
  }
  function render(){
    list.innerHTML=catalog.filter(c=>c[2]===group).map(([code,name])=>{
      const q=quotes.find(q=>q.code===code),valid=q&&Number.isFinite(q.price)&&q.price>0,change=valid&&typeof q.change==='number'&&Number.isFinite(q.change)?q.change:null;
      const tone=change===null?'neutral':change<0?'down':'up';
      const delta=change===null?'Perubahan —':(change>0?'+':'')+change.toLocaleString('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
      return '<article class="watch-quote '+tone+'"><div class="watch-identity"><span class="watch-symbol">'+code+'</span><span class="watch-name">'+name+'</span></div><div class="watch-value"><strong>'+ (valid?safe(money(q.price)):'—')+'</strong><span class="watch-change">'+safe(delta)+(group==='crypto'?' <small>24j</small>':'')+'</span></div><div class="watch-trend">'+(valid?chart(q):'<span class="watch-no-chart">Menunggu sumber</span>')+'</div><p class="watch-source">'+(valid?safe((q.stale?'Tersimpan · ':'')+q.source)+'<br>'+safe(stamp(q.marketAt||q.fetchedAt)):'Harga belum tersedia')+'</p></article>';
    }).join('');
  }
  function accept(data,cached=false){
    if(!Array.isArray(data?.quotes))return;
    for(const q of data.quotes){if(!catalog.some(c=>c[0]===q.code)||!Number.isFinite(q.price)||q.price<=0)continue;const i=quotes.findIndex(x=>x.code===q.code);const item={...q,stale:cached||q.stale};if(i<0)quotes.push(item);else quotes[i]=item;}
    render();
  }
  try{const d=JSON.parse(window.localStorage.getItem('sidaps_public_market_v1')||'null');if(d&&Date.now()-d.savedAt<7*86400000){accept(d,true);note.textContent='Harga tersimpan · memeriksa sumber…';}}catch{}
  render();
  root.querySelectorAll('[data-watch-kind]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.watchKind;root.querySelectorAll('[data-watch-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
  async function refresh(){
    if(busy||document.hidden||!document.body.classList.contains('locked')||Date.now()-lastAttempt<300000)return;
    busy=true;lastAttempt=Date.now();
    try{
      const r=await window.fetch('/api/market-board',{signal:AbortSignal.timeout(10000),credentials:'omit'});if(!r.ok)throw Error('unavailable');
      const d=await r.json();quotes=quotes.map(q=>({...q,stale:true}));accept(d);
      note.textContent=quotes.length?(quotes.some(q=>q.stale)?'Sebagian harga tersimpan · periksa waktu sumber':'Otomatis 5 menit · harga dapat tertunda'):'Sumber harga belum tersedia. Login tetap bisa digunakan.';
      try{window.localStorage.setItem('sidaps_public_market_v1',JSON.stringify({quotes,savedAt:Date.now()}));}catch{}
    }catch{quotes=quotes.map(q=>({...q,stale:true}));render();note.textContent=quotes.length?'Koneksi terputus · harga tersimpan dipertahankan':'Sumber harga belum tersedia. Login tetap bisa digunakan.';}
    finally{busy=false;}
  }
  // First paint and login initialization always come before market traffic.
  setTimeout(refresh,800);setInterval(refresh,300000);document.addEventListener('visibilitychange',refresh);
})();
