/* Public presentation only. No account/state APIs or portfolio storage. */
(()=>{
 'use strict';
 const intro=document.getElementById('sidaps-intro');if(!intro)return;
 const stage=document.getElementById('si-stage'),opening=document.getElementById('si-opening'),hero=document.getElementById('si-hero'),dashboard=document.getElementById('si-dashboard'),device=document.getElementById('si-laptop'),art=document.getElementById('si-art'),image=document.getElementById('si-art-image'),line=document.getElementById('si-line'),area=document.getElementById('si-area'),fill=document.getElementById('si-progress-fill'),skip=document.getElementById('si-skip');
 const movers=[...intro.querySelectorAll('.si-asset-move')],segments=[...intro.querySelectorAll('.si-donut-segment')],entryHash=window.location?.hash,intentEvents=['wheel','touchmove','pointerdown','keydown'];let activeTimeline=null,media=null,finished=false,exitFrame=0,hasIntent=Boolean(entryHash&&entryHash!=='#sidaps-intro');
 const markIntent=()=>{hasIntent=true;};
 // Completion belongs to this document only: a fresh visit/reload starts over.
 const finishIntro=()=>{
  if(finished)return;finished=true;
  const root=document.documentElement,remainingScroll=Math.max(0,window.scrollY-intro.offsetHeight),focusInside=intro.contains(document.activeElement),next=intro.nextElementSibling;
  window.removeEventListener('scroll',watchCompletion);intentEvents.forEach(type=>window.removeEventListener(type,markIntent,true));cancelAnimationFrame(exitFrame);document.removeEventListener('visibilitychange',visibility);
  media?.revert();activeTimeline=null;
  intro.hidden=true;intro.inert=true;intro.setAttribute('aria-hidden','true');root.classList.remove('si-scroll-active');
  const previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo({top:remainingScroll,behavior:'instant'});root.style.scrollBehavior=previous;
  if(focusInside&&next){next.setAttribute('tabindex','-1');next.focus({preventScroll:true});}
  window.ScrollTrigger?.refresh();
 };
 const watchCompletion=()=>{
  if(finished||exitFrame)return;
  // Browser scroll restoration/layout changes must not silently consume the intro.
  if(!hasIntent){if(window.scrollY>0)window.scrollTo({top:0,behavior:'instant'});return;}
  const trigger=activeTimeline?.scrollTrigger,passed=trigger?window.scrollY>trigger.end+1:intro.getBoundingClientRect().bottom<=0;
  if(passed)exitFrame=requestAnimationFrame(()=>{exitFrame=0;finishIntro();});
 };
 const visibility=()=>intro.classList.toggle('si-hidden',document.hidden);
 intentEvents.forEach(type=>window.addEventListener(type,markIntent,{passive:true,capture:true}));window.addEventListener('scroll',watchCompletion,{passive:true});document.addEventListener('visibilitychange',visibility);visibility();
 const staticVersion=()=>{document.documentElement?.classList.remove('si-scroll-active');intro.classList.add('si-static');intro.classList.remove('si-ready','si-idle');opening.setAttribute('aria-hidden','true');hero.inert=false;hero.setAttribute('aria-hidden','false');dashboard.setAttribute('aria-hidden','false');};
 image.addEventListener('error',()=>{image.hidden=true;});
 skip.addEventListener('click',finishIntro);
 if(!entryHash||entryHash==='#sidaps-intro'){if(window.history)window.history.scrollRestoration='manual';window.scrollTo({top:0,behavior:'instant'});}
 if((entryHash&&entryHash!=='#sidaps-intro')||!window.gsap||!window.ScrollTrigger){staticVersion();return;}
 gsap.registerPlugin(ScrollTrigger);ScrollTrigger.config({ignoreMobileResize:true});
 media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: reduce)',()=>{if(finished)return;staticVersion();return()=>intro.classList.remove('si-static');});
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  if(finished)return;
  intro.classList.remove('si-static');intro.classList.add('si-ready','si-idle');
  let tl,alive=true,lastHero=null,lastOpening=null,lastCard=null,resizeTimer=0,lastSize='';
  const probe=document.getElementById('si-viewport-probe');
  const viewportSize=()=>probe.offsetWidth+'x'+Math.max(540,probe.offsetHeight);
  const measureViewport=()=>{lastSize=viewportSize();intro.style.setProperty('--si-screen-height',Math.max(540,probe.offsetHeight)+'px');const available=Math.max(155,stage.clientHeight-hero.offsetTop-hero.offsetHeight-48);intro.style.setProperty('--si-device-width',Math.floor(Math.max(180,(available-26)/.65))+'px');};
  measureViewport();document.documentElement.classList.add('si-scroll-active');
  const refresh=()=>{if(!alive)return;const root=document.documentElement,previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';measureViewport();ScrollTrigger.refresh();root.style.scrollBehavior=previous;};
  const synchronize=()=>{if(!tl)return;const t=tl.time(),showHero=t>=80,showOpening=t<22,showCard=t>=36;
   if(lastHero!==showHero){hero.inert=!showHero;hero.setAttribute('aria-hidden',String(!showHero));lastHero=showHero;}
   if(lastOpening!==showOpening){opening.setAttribute('aria-hidden',String(!showOpening));lastOpening=showOpening;}
   if(lastCard!==showCard){dashboard.setAttribute('aria-hidden',String(!showCard));lastCard=showCard;}
   intro.classList.toggle('si-idle',t<14&&window.scrollY<=(tl.scrollTrigger?.end||Infinity));
   document.documentElement.classList.toggle('si-scroll-active',window.scrollY<=(tl.scrollTrigger?.end||Infinity));
  };
  const assetStart={x:(i,e)=>Number(e.dataset.x)*stage.clientWidth,y:(i,e)=>Number(e.dataset.y)*stage.clientHeight,rotation:(i,e)=>Number(e.dataset.rotation),scale:1,opacity:1};
  gsap.set(movers,{...assetStart,force3D:true});gsap.set(opening,{autoAlpha:1,y:0});gsap.set(hero,{autoAlpha:0,y:22});gsap.set(device,{autoAlpha:0,scale:.62,y:0,rotationX:16,transformPerspective:1200,force3D:true});gsap.set(art,{opacity:.26,scale:1,rotation:0,force3D:true});
  const length=line.getTotalLength();gsap.set(line,{strokeDasharray:length,strokeDashoffset:length});gsap.set(area,{opacity:0});gsap.set(segments,{attr:{'stroke-dasharray':'0 100'}});gsap.set(fill,{scaleX:0});
  tl=gsap.timeline({defaults:{ease:'none'},onUpdate:synchronize,scrollTrigger:{trigger:intro,start:'top top',end:()=>'+='+Math.max(1,parseFloat(intro.style.getPropertyValue('--si-screen-height'))*2),scrub:1,invalidateOnRefresh:true,onToggle:synchronize,onRefresh:synchronize}});
  activeTimeline=tl;
  tl.to({progress:0},{progress:1,duration:100},0).to(fill,{scaleX:1,duration:100},0).addLabel('pembuka',0).addLabel('penyatuan',10);
  tl.to(opening,{autoAlpha:0,y:-25,duration:12,ease:'power1.inOut'},10).to(art,{scale:.15,rotation:-9,opacity:.48,duration:53,ease:'power2.inOut'},10).to(art,{opacity:0,duration:9},63);
  tl.fromTo(movers,assetStart,{x:0,y:0,rotation:0,scale:.12,duration:50,stagger:{each:1.8,from:'edges'},ease:'power2.inOut',immediateRender:true},12);
  tl.to(movers,{opacity:0,duration:9,stagger:.5},62).to(device,{autoAlpha:1,scale:.86,duration:18,ease:'power2.out'},28).to(device,{scale:1,rotationX:0,duration:16,ease:'power2.inOut'},55);
  tl.addLabel('hero',75).to(device,{y:()=>{const cardHeight=device.offsetHeight,desiredTop=hero.offsetTop+hero.offsetHeight+28,maxTop=stage.clientHeight-cardHeight-20,top=Math.min(desiredTop,maxTop);return top+cardHeight/2-stage.clientHeight/2;},duration:14,ease:'power2.inOut'},70).to(hero,{autoAlpha:1,y:0,duration:12,ease:'power2.out'},75);
  segments.forEach((segment,i)=>{const share=Number(segment.dataset.share);tl.to(segment,{attr:{'stroke-dasharray':share+' '+(100-share)},duration:10,ease:'power2.out'},82+i*1.2);});
  tl.to(line,{strokeDashoffset:0,duration:14,ease:'power1.inOut'},82).to(area,{opacity:1,duration:10},87).addLabel('selesai',100);
  const sizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>{if(viewportSize()===lastSize)return;clearTimeout(resizeTimer);resizeTimer=setTimeout(refresh,120);}):null;
  sizeObserver?.observe(probe);
  hero.inert=true;synchronize();refresh();document.fonts?.ready.then(refresh);image.addEventListener('load',refresh,{once:true});
  return()=>{alive=false;clearTimeout(resizeTimer);sizeObserver?.disconnect();image.removeEventListener('load',refresh);intro.classList.remove('si-ready','si-idle');intro.style.removeProperty('--si-screen-height');intro.style.removeProperty('--si-device-width');document.documentElement.classList.remove('si-scroll-active');hero.inert=false;hero.setAttribute('aria-hidden','false');opening.setAttribute('aria-hidden','true');dashboard.setAttribute('aria-hidden','false');if(activeTimeline===tl)activeTimeline=null;};
 });
})();
