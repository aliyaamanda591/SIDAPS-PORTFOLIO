/* Landing controls address only the explicitly marked, isolated demo iframe. */
(()=>{
 const frame=document.getElementById('sidapsPhone'),status=document.getElementById('phoneStatus');if(!frame)return;
 let ready=false;
 const send=command=>frame.contentWindow?.postMessage({type:'sidaps-landing-demo',command,theme:document.documentElement.dataset.sidapsTheme},location.origin);
 frame.addEventListener('load',()=>{ready=false;status.textContent='Menyiapkan demo ponsel…';send('ping');});
 window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow)return;const data=event.data;if(data?.type==='sidaps-demo-ready'){ready=true;status.textContent='Demo aktif · sentuh dan gulir di dalam layar ponsel';send('theme');}if(data?.type==='sidaps-demo-theme'&&['light','dark'].includes(data.theme)&&data.theme!==document.documentElement.dataset.sidapsTheme){document.querySelector('[data-theme-option="'+data.theme+'"]')?.click();}});
 document.querySelectorAll('[data-phone-command]').forEach(button=>button.addEventListener('click',()=>{if(!ready){status.textContent='Demo sedang dimuat. Tunggu sebentar lalu coba lagi.';return;}send(button.dataset.phoneCommand);if(matchMedia('(max-width:760px)').matches)frame.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}));
 document.getElementById('phoneReset')?.addEventListener('click',()=>{ready=false;frame.src='/?demo=1&embed=phone';status.textContent='Mengulang data contoh ponsel…';});
 new MutationObserver(()=>{if(ready)send('theme');}).observe(document.documentElement,{attributes:true,attributeFilter:['data-sidaps-theme']});
})();

// The final invitation reveals once; its ambient glow pauses outside the viewport.
(()=>{const closing=document.querySelector('.closing');if(!closing||!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;closing.classList.add('landing-reveal');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{closing.classList.toggle('is-in-view',entry.isIntersecting);if(entry.isIntersecting)closing.classList.add('is-revealed');}),{threshold:.18});observer.observe(closing);})();
