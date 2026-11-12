// Rearranges existing controls without changing account or portfolio data.
(()=>{
const header=document.querySelector('.app-header'),chip=document.getElementById('userChip'),tabs=document.querySelector('nav.tabs'),actions=document.querySelector('.header-actions');
if(!header||!chip||!tabs||!actions)return;
const panel=document.createElement('div');panel.id='accountQuickMenu';panel.className='account-quick-menu';panel.hidden=true;panel.setAttribute('role','region');panel.setAttribute('aria-label','Menu akun dan navigasi');
const heading=document.createElement('div');heading.className='account-menu-heading';heading.textContent='Ruang portofoliomu';panel.append(heading,tabs);
const label=document.createElement('p');label.className='account-menu-label';label.textContent='PENGATURAN TAMPILAN';panel.append(label,actions);
// Both entry points use the existing single privacy control and device preference.
const privacy=actions.querySelector('#balanceVisibilityButton'),capital=document.querySelector('.capital-stat');
if(privacy&&capital){
 const quick=document.createElement('button');quick.id='capitalBalanceVisibilityButton';quick.type='button';quick.className='capital-balance-toggle';
 const icon=privacy.querySelector('svg');if(icon)quick.append(icon.cloneNode(true));
 quick.addEventListener('click',()=>privacy.click());capital.append(quick);
 const menuText=privacy.querySelector('.balance-eye-label');
 function syncPrivacy(){const hidden=privacy.getAttribute('aria-pressed')==='true',text=hidden?'Tampilkan saldo':'Sembunyikan saldo';quick.setAttribute('aria-label',text);quick.setAttribute('aria-pressed',String(hidden));quick.title=text;quick.classList.toggle('is-private',hidden);if(menuText&&menuText.textContent!==text)menuText.textContent=text;}
 syncPrivacy();new MutationObserver(syncPrivacy).observe(privacy,{attributes:true,attributeFilter:['aria-pressed']});
}
const footer=document.createElement('div');footer.className='account-menu-footer';
const edit=document.createElement('button');edit.type='button';edit.className='account-edit-profile';edit.textContent='Edit profil';edit.addEventListener('click',()=>{close();window.openProfileEditor?.();});footer.append(edit);panel.append(footer);header.querySelector('.top').append(panel);
function trigger(){return chip.querySelector('.header-profile');}
function close(restore=false){panel.hidden=true;trigger()?.setAttribute('aria-expanded','false');if(restore)trigger()?.focus();}
function sync(){const button=trigger();if(button){button.removeAttribute('onclick');button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded',String(!panel.hidden));button.setAttribute('aria-label','Buka menu akun '+(chip.querySelector('.header-profile-copy b')?.textContent||''));}const logout=chip.querySelector('.header-logout');if(logout){footer.querySelector('.header-logout')?.remove();footer.append(logout);}greet();}
chip.addEventListener('click',event=>{if(!event.target.closest('.header-profile'))return;panel.hidden=!panel.hidden;trigger()?.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)tabs.querySelector('.tab.active')?.focus();});
panel.addEventListener('click',event=>{if(event.target.closest('.tab,.header-help-button'))close();});
document.addEventListener('click',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!chip.contains(event.target))close();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();close(true);}});
header.addEventListener('focusout',()=>{setTimeout(()=>{if(!header.contains(document.activeElement))close();},0);});
const greeting=document.createElement('div');greeting.className='trader-greeting';const title=document.createElement('h2'),copy=document.createElement('p');greeting.append(title,copy);document.getElementById('dashboard')?.prepend(greeting);
function greet(){const hour=new Date().getHours(),name=chip.querySelector('.header-profile-copy b')?.textContent?.trim();const period=hour>=5&&hour<11?'pagi':hour>=11&&hour<15?'siang':hour>=15&&hour<18?'sore':'malam';title.textContent='Selamat '+period+(name?', '+name: ', trader')+'.';copy.textContent=period==='pagi'?'Mulai hari dengan rencana. Langkah kecil yang konsisten membawa tujuanmu lebih dekat.':period==='siang'?'Ambil jeda, tinjau rencanamu, dan tetap disiplin mengelola portofolio.':period==='sore'?'Saatnya meninjau perjalanan hari ini. Setiap catatan membantu langkah berikutnya.':'Istirahat sejenak. Rencana yang tenang membantu langkah investasi esok hari.';}
sync();new MutationObserver(sync).observe(chip,{childList:true,subtree:false});setInterval(greet,60000);
})();
