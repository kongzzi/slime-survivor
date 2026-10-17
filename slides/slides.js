(()=>{
  const slides=[...document.querySelectorAll('.slide')],counter=document.querySelector('#counter'),prev=document.querySelector('#prev'),next=document.querySelector('#next'),notes=document.querySelector('#notes'),notesButton=document.querySelector('#notesButton'),toc=document.querySelector('#toc'),tocButton=document.querySelector('#tocButton');
  let current=0,notesOpen=false,start=null;
  const tocButtons=slides.map((slide,i)=>{const button=document.createElement('button');button.textContent=`${String(i+1).padStart(2,'0')}  ${slide.dataset.title}`;button.onclick=()=>{go(i);toggleToc(false);};toc.append(button);return button;});
  function show(index){
    current=Math.max(0,Math.min(slides.length-1,index));slides.forEach((slide,i)=>{slide.classList.toggle('active',i===current);slide.hidden=i!==current;slide.setAttribute('aria-hidden',String(i!==current));});
    counter.textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;prev.disabled=current===0;next.disabled=current===slides.length-1;
    document.querySelector('#progress').style.width=`${(current+1)/slides.length*100}%`;notes.textContent=slides[current].dataset.notes;notes.hidden=!notesOpen;notesButton.setAttribute('aria-pressed',String(notesOpen));
    tocButtons.forEach((button,i)=>button.setAttribute('aria-current',String(i===current)));document.title=`${current+1}. ${slides[current].dataset.title} — 용사 대신 슬라임 제작기`;window.scrollTo({top:0,behavior:'instant'});
  }
  function fromHash(){const n=Number(location.hash.slice(1));show(Number.isFinite(n)&&n>=1?n-1:0);}
  function go(n){n=Math.max(0,Math.min(slides.length-1,n));if(location.hash===`#${n+1}`)show(n);else location.hash=String(n+1);}
  function toggleToc(open=toc.hidden){toc.hidden=!open;tocButton.setAttribute('aria-expanded',String(open));}
  function toggleNotes(){notesOpen=!notesOpen;show(current);if(notesOpen)notes.scrollIntoView({block:'nearest',behavior:'smooth'});}
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.querySelector('#fullButton').textContent='브라우저 전체 화면 사용';}}
  prev.onclick=()=>go(current-1);next.onclick=()=>go(current+1);notesButton.onclick=toggleNotes;tocButton.onclick=()=>toggleToc();document.querySelector('#fullButton').onclick=fullscreen;
  window.addEventListener('hashchange',fromHash);
  window.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]'))return;if(event.target.closest('input,textarea,select'))return;
    if(['ArrowRight','PageDown'].includes(event.key)||(event.key===' '&&event.target.tagName!=='BUTTON')){event.preventDefault();go(current+1);}
    else if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();go(current-1);}
    else if(event.key==='Home'){event.preventDefault();go(0);}else if(event.key==='End'){event.preventDefault();go(slides.length-1);}
    else if(event.key.toLowerCase()==='n')toggleNotes();else if(event.key.toLowerCase()==='f')fullscreen();else if(event.key.toLowerCase()==='g')toggleToc();else if(event.key==='Escape')toggleToc(false);
  });
  const deck=document.querySelector('#deck');deck.addEventListener('touchstart',e=>{if(e.touches.length===1&&!e.target.closest('a,button'))start={x:e.touches[0].clientX,y:e.touches[0].clientY};else start=null;},{passive:true});
  deck.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));start=null;},{passive:true});deck.addEventListener('touchcancel',()=>start=null);
  document.addEventListener('click',e=>{if(!toc.hidden&&!e.target.closest('#toc,#tocButton'))toggleToc(false);});
  const dialog=document.querySelector('#lightbox');document.querySelectorAll('[data-enlarge]').forEach(button=>button.onclick=()=>{dialog.querySelector('img').src=button.dataset.enlarge;dialog.showModal();});document.querySelector('#closeImage').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  window.addEventListener('beforeprint',()=>slides.forEach(s=>s.hidden=false));window.addEventListener('afterprint',()=>show(current));fromHash();
})();
