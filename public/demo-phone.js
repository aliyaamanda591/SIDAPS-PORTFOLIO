/* Only a demo bootstrap may accept these presentation/navigation commands. */
(()=>{
 if(!cloudBoot?.demo||new URLSearchParams(location.search).get('embed')!=='phone'||parent===window)return;
 if(cloudBoot.showcase){
  const heading=document.getElementById('priceStatus')?.closest('.section')?.querySelector('h3');if(heading)heading.textContent='Aset dalam satu pandangan';
  const grid=document.getElementById('dashboardAssets'),seen=new Set();
  if(grid&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const card=entry.target;seen.add(card.dataset.showcaseName);card.classList.add('is-visible');observer.unobserve(card);}),{threshold:.12});
   const decorate=()=>grid.querySelectorAll('.asset:not([data-showcase-name])').forEach((card,index)=>{const name=card.querySelector('h3')?.textContent||String(index);card.dataset.showcaseName=name;if(seen.has(name))return;card.classList.add('showcase-reveal');card.style.transitionDelay=Math.min(index*45,180)+'ms';observer.observe(card);});
   decorate();new MutationObserver(decorate).observe(grid,{childList:true});
  }
 }
 document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.getAttribute('href'),location.href);if(u.pathname==='/'&&(u.searchParams.has('login')||u.searchParams.has('view')))a.target='_top';});
 window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='sidaps-landing-demo')return;const {command,theme}=e.data;if(command==='ping')parent.postMessage({type:'sidaps-demo-ready'},location.origin);
  if(command==='theme'&&['light','dark'].includes(theme))document.documentElement.setAttribute('data-sidaps-theme',theme);
  if(command==='add'&&typeof openAssetPicker==='function')openAssetPicker();
  if(['dashboard','transactions','portfolio'].includes(command)&&typeof showTab==='function'){showTab(command==='portfolio'?'assets':command);window.scrollTo({top:0,behavior:'instant'});}
 });
 new MutationObserver(()=>parent.postMessage({type:'sidaps-demo-theme',theme:document.documentElement.dataset.sidapsTheme},location.origin)).observe(document.documentElement,{attributes:true,attributeFilter:['data-sidaps-theme']});
 parent.postMessage({type:'sidaps-demo-ready'},location.origin);
})();
