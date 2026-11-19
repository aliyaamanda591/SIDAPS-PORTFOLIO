/* This script only enhances the isolated public demo; it never creates an account. */
(()=>{
 if(!cloudBoot?.demo)return;
 const notice=document.createElement('aside');notice.className='demo-notice';notice.setAttribute('aria-label','Mode demo Sidaps');notice.innerHTML='<div><b>Ruang coba Sidaps</b><span>Mulai kosong · harga pasar · latihan tidak disimpan.</span></div><div class="demo-notice-actions"><button type="button" id="resetDemo">↻ Ulang demo</button><a href="/?login=1">Buat akun pribadi ↗</a></div>';
 if(cloudBoot.showcase){document.body.classList.add('demo-showcase');notice.querySelector('b').textContent='Contoh portofolio SIDAPS';notice.querySelector('span').textContent='Kepemilikan contoh · harga pasar dapat tertunda.';}
 document.querySelector('main')?.prepend(notice);
 document.querySelectorAll('.demo-coin').forEach(el=>{el.innerHTML='<img src="https://static.indodax.com/a6091fe/v2/logo/png/color/btc.png" width="34" height="34" alt="Logo BTC">';});
 document.getElementById('resetDemo').onclick=()=>{if(confirm(cloudBoot.showcase?'Kembalikan portofolio contoh ke tampilan awal?':'Kosongkan sesi demo dan mulai dari Rp0? Catatan latihan akan dihapus.'))location.reload();};
 document.querySelectorAll('.header-logout').forEach(el=>el.textContent='Keluar demo');
 const security=document.getElementById('dev-security');if(security){security.innerHTML='<div class="dev-view-heading"><h3>Akun pribadi, setelah kamu siap.</h3><p>Demo tidak memiliki email atau kata sandi. Buat akunmu sendiri untuk menyimpan portofolio dan mengaksesnya dari perangkat lain.</p><a class="btn primary" href="/?login=1">Buat akun pribadi ↗</a></div>';}
 const importer=document.getElementById('devImport');if(importer)importer.closest('label').classList.add('demo-unavailable');
 const sheet=document.getElementById('sheetUrlInput');if(sheet)sheet.closest('.card')?.classList.add('demo-unavailable');
 const loginNote=document.getElementById('profileLoginNote');if(loginNote)loginNote.textContent='Profil percobaan · bukan akun terdaftar.';
 const adminRoles=document.getElementById('adminRoles');if(adminRoles)adminRoles.textContent='Demo · Tamu';
 // Prevent private backup imports into a session that will be discarded.
 document.querySelectorAll('.muted').forEach(el=>{if(el.textContent.includes('Data disimpan di akunmu dan dapat diakses dari perangkat lain.'))el.textContent='Data ini hanya contoh. Perubahan demo tidak disimpan; buat akun pribadi untuk menyimpan portofoliomu.';});
})();

// Load embedded presentation only for an explicitly requested public demo frame.
(()=>{if(!cloudBoot?.demo||new URLSearchParams(location.search).get('embed')!=='phone')return;const css=document.createElement('link');css.rel='stylesheet';css.href='/demo-phone.css';document.head.append(css);const script=document.createElement('script');script.src='/demo-phone.js';document.body.append(script);})();

function demoChooseAsset(kind,query){if(!cloudBoot?.demo)return;openAssetPicker();assetKindFilter.value=kind;assetSearch.value=query;renderAssetCatalog();assetSearch.focus();}
