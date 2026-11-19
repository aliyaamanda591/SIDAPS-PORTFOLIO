/** Public, per-page playground. No identity, session cookie, D1 row, or real holdings. */
const showcaseAssets = [
 {name:'BBCA',company:'PT Bank Central Asia Tbk',unit:'lembar',kind:'stock',symbol:'BBCA.JK',quantity:500,capital:2800000,platform:'Stockbit',price:5750},
 {name:'BMRI',company:'PT Bank Mandiri (Persero) Tbk',unit:'lembar',kind:'stock',symbol:'BMRI.JK',quantity:1000,capital:4500000,platform:'GROWIN',price:4800},
 {name:'BTC INDODAX',company:'Bitcoin',unit:'BTC',kind:'crypto',symbol:'indodax:btcidr',quantity:0.002,capital:2200000,platform:'INDODAX',price:1170000000},
 {name:'SOL INDODAX',company:'Solana',unit:'SOL',kind:'crypto',symbol:'indodax:solidr',quantity:1,capital:1250000,platform:'Pintu',price:1360000},
 {name:'EMAS K24',company:'Emas fisik · 24 karat',unit:'gram',kind:'gold24',symbol:'XAU',quantity:1,capital:1900000,platform:'Pegadaian',price:2000000},
];
export function createDemoBootstrap(showcase=false){return {
 demo:true,showcase,revision:0,
 user:{id:'sidaps-public-demo',username:'Trader Demo',email:'',authMethod:'demo',hasPassword:false,roles:['guest']},
 state:{transactions:showcase?showcaseAssets.map((a,i)=>({id:'showcase-buy-'+i,date:['2026-06-10','2026-07-12','2026-08-05','2026-09-17','2026-10-02'][i],type:'MASUK',trade:'buy',quantityDelta:a.quantity,amount:a.capital,asset:a.name,description:'Contoh pembelian '+a.name.replace(' INDODAX',''),platform:a.platform})):[],assets:showcase?showcaseAssets.map(({capital,platform,price,...a})=>({...a,valueSnapshot:Math.round(a.quantity*price),manualPrice:null,archived:false})):[],profile:{displayName:'Trader Demo',photo:'',photoMode:'none'},logs:[],sheetUrl:'',lastBackup:''}
};}
export function renderDemoPortfolio(shell:string,showcase=false){
 const replace=(before:string,after:string)=>{if(!shell.includes(before))throw Error('Demo shell integration missing: '+before.slice(0,60));shell=shell.replace(before,after);};
 replace('/*__CLOUD_BOOTSTRAP__*/null',JSON.stringify(createDemoBootstrap(showcase)).replaceAll('<','\\u003c'));
 // Defense in depth: even a visitor with a real session open cannot send account requests from this page.
 replace('const cloudNativeFetch=window.fetch.bind(window);',`const demoBrowserFetch=window.fetch.bind(window);
const cloudNativeFetch=(input,options)=>{const path=new URL(typeof input==='string'?input:input.url,location.href).pathname;if(/^\\/api\\/(state|auth|admin)(?:\\/|$)/.test(path))return Promise.reject(Error('Mode demo tidak mengakses akun pribadi.'));return demoBrowserFetch(input,options);};`);
 replace('const cloudDeviceStorage=(()=>{try{return window.localStorage;}catch{return null;}})();','const cloudDeviceStorage=null;');
 replace('async function cloudSave(){',"async function cloudSave(){cloudDirty=false;cloudSetSyncStatus('Mode demo · perubahan hanya selama halaman ini terbuka','ok');return;");
 replace('async function cloudFlushBeforeLogout(){',"async function cloudFlushBeforeLogout(){location.href='/?view=landing';return;");
 replace("cloudSetSyncStatus('Tersinkron ke akun pribadi','ok')","cloudSetSyncStatus('Mode demo · data contoh, tidak tersimpan ke akun','ok')");
 replace("member:'Anggota',guest:'Tamu'","member:'Anggota',guest:'Demo'");
 shell=shell.replaceAll('Akun pribadi online','Sesi demo sementara').replaceAll('Backup lengkap melalui menu Developer','Mode demo · perubahan tidak disimpan').replace("profileLoginNote.textContent='Email untuk masuk: '+(a.email||a.username);","profileLoginNote.textContent='Profil demo · bukan akun terdaftar.';");
 shell=shell.replaceAll('/api/prices/','/api/demo-prices/');
 replace('function portfolioEmptyHtml(){', 'function portfolioEmptyHtml(){return '+JSON.stringify("<div class=\"demo-starter\"><span class=\"demo-step-kicker\">MULAI DEMO · PORTOFOLIO KOSONG</span><h3>Coba catat aset pertamamu.</h3><p>Mulai dari Rp0. Pilih aset, catat pembelian latihan, lalu lihat nilai dan profit/loss memakai harga pasar yang tersedia.</p><ol class=\"demo-starter-steps\"><li><b>Pilih aset</b><span>Cari saham Indonesia, kripto, atau emas.</span></li><li><b>Catat pembelian</b><span>Isi unit, total modal, tanggal, dan platform.</span></li><li><b>Lihat hasilnya</b><span>Nilai = unit × harga; profit/loss = nilai − modal.</span></li></ol><div class=\"demo-starter-caption\">Pilihan untuk mulai · belum menjadi kepemilikanmu</div><div class=\"demo-starter-choices\"><button type=\"button\" onclick=\"demoChooseAsset('stock','BBCA')\"><img src=\"/logos/stocks/BBCA.svg\" alt=\"\" width=\"34\" height=\"34\"><span><b>Saham Indonesia</b><small>Contoh pencarian: BBCA · 1 lot = 100 lembar</small></span><i>＋</i></button><button type=\"button\" onclick=\"demoChooseAsset('crypto','Bitcoin')\"><span class=\"demo-coin\"><img src=\"https://static.indodax.com/a6091fe/v2/logo/png/color/btc.png\" alt=\"Logo BTC\" width=\"34\" height=\"34\"></span><span><b>Kripto</b><small>Cari BTC, ETH, atau koin pilihanmu</small></span><i>＋</i></button><button type=\"button\" onclick=\"demoChooseAsset('gold','')\"><img src=\"/logos/gold-premium.svg\" alt=\"\" width=\"34\" height=\"34\"><span><b>Emas</b><small>Pilih kadar · catat berat dalam gram</small></span><i>＋</i></button></div><button type=\"button\" class=\"usage-guide-link\" onclick=\"openUsageGuide()\">Lihat panduan langkah demi langkah →</button><small class=\"demo-starter-note\">Hanya latihan pencatatan. Tidak membeli aset dan tidak menyentuh akun asli. Harga dapat tertunda; lihat sumber dan waktu pada kartu aset.</small></div>")+';');
 replace('</head>','<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/demo-mode.css?v=1"></head>');
 replace('</body>','<script src="/demo-mode.js?v=1"></script></body>');
 return shell;
}
