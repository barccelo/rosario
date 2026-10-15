// A continuous chain moves through a fixed viewport, preserving bead size.
const focusStyle=document.createElement('style');focusStyle.textContent=`
.rosary{height:560px;max-width:520px;overflow:hidden;touch-action:pan-x;border-radius:28px;background:linear-gradient(145deg,#efede6,#faf9f4)}
.rosary>svg:first-child{display:none}.rosary .focus-chain{width:100%;height:100%;overflow:hidden;display:block}
.center{top:140px;left:39%;width:54%;pointer-events:none}.center button{pointer-events:auto}.center h2{font-size:27px}.center p{font-size:13px}.center .eyebrow{line-height:1.9}
.chain-track{transition:transform .65s cubic-bezier(.22,.8,.25,1)}.focus-bead{cursor:pointer;outline:none}.focus-bead .ring{transition:stroke .4s,fill .4s;fill:var(--chain-fill,#f5f3ed)}.focus-bead:focus-visible .ring{stroke:#456b52;stroke-width:6}.focus-bead .halo{opacity:0;transition:opacity .4s}.focus-bead.active .halo{opacity:.65}.focus-bead.active .ring{stroke:#be9859;fill:#e8d8b9}.focus-bead.done .ring{stroke:#b88f48}.chain-link{transition:stroke .4s}.focus-bead .number{font:11px system-ui;fill:#9b927f;pointer-events:none}.focus-bead.done .number{fill:#a17c40}.dark .rosary{background:linear-gradient(145deg,#171c19,#222b24);--chain-fill:#1d251f}.dark .focus-bead .number{fill:#a2a798}.dark .focus-bead.active .ring{fill:#54472e}.dark .focus-bead.done .ring{stroke:#d2a348}.dark .focus-bead.done .number{fill:#d2a348}
.section-dots{display:flex;justify-content:center;gap:9px;margin:16px 0 12px}.section-dots span{width:6px;height:6px;border-radius:50%;background:#d6d2c7}.section-dots .complete{background:#ad8b54}.section-dots .active{width:22px;border-radius:4px;background:#ad8b54}.hint{margin:10px 0 16px}@media(max-width:740px){.rosary{height:480px;max-width:430px;border-radius:23px}.center{top:118px;left:38%;width:57%}.center h2{font-size:23px}.center p{font-size:12px}.intro{margin:23px 0 4px}.simpleActions{margin-bottom:18px}.layout{padding-left:16px;padding-right:16px}}@media(prefers-reduced-motion:reduce){.chain-track{transition:none}}
`;document.head.append(focusStyle);
const ns='http://www.w3.org/2000/svg';const chain=document.createElementNS(ns,'svg');chain.setAttribute('viewBox','0 0 440 560');chain.setAttribute('class','focus-chain');chain.setAttribute('role','group');chain.setAttribute('aria-label','Cuentas del rosario. Desliza a la izquierda para recorrer las cuentas sin cambiar la oración; toca una cuenta para ir a ella.');
const point=i=>({x:89+25*Math.sin(i*.58),y:i*55});let chainMarkup='<defs><radialGradient id="focusGlow"><stop offset="0" stop-color="#d8b66f" stop-opacity=".6"/><stop offset=".5" stop-color="#d8b66f" stop-opacity=".4"/><stop offset="1" stop-color="#d8b66f" stop-opacity="0"/></radialGradient></defs><g class="chain-track">';
for(let i=0;i<55;i++){const p=point(i),q=point(i+1),idx=steps.findIndex(t=>t.bead===i),big=i%11===0,r=big?24:18;chainMarkup+=`<line class="chain-link" data-link="${i}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="#c8c3b7" stroke-width="4"/><g class="focus-bead" role="button" tabindex="0" data-step="${idx}" data-bead="${i}" aria-label="${big?'Padrenuestro':'Avemaría '+i%11}, misterio ${Math.floor(i/11)+1}"><circle cx="${p.x}" cy="${p.y}" r="27" fill="transparent"/><circle class="halo" cx="${p.x}" cy="${p.y}" r="40" fill="url(#focusGlow)" pointer-events="none"/><circle class="ring" cx="${p.x}" cy="${p.y}" r="${r}" stroke="#bcb7ac" stroke-width="4"/><text class="number" x="${p.x}" y="${p.y+4}" text-anchor="middle">${big?'':i%11}</text></g>`}const end=point(55);chainMarkup+=`<defs><linearGradient id="crossGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f3e3bc"/><stop offset=".45" stop-color="#bd9657"/><stop offset=".7" stop-color="#e1c58d"/><stop offset="1" stop-color="#96713f"/></linearGradient></defs><g class="rosary-cross" transform="translate(${end.x} ${end.y})" role="img" aria-label="Cruz del rosario"><ellipse cy="7" rx="5" ry="8" fill="none" stroke="#b49663" stroke-width="2.5"/><path d="M-7 17 Q-7 14 -4 14 H4 Q7 14 7 17 V38 H28 Q31 38 31 41 V49 Q31 52 28 52 H7 V94 Q7 97 4 97 H-4 Q-7 97 -7 94 V52 H-28 Q-31 52 -31 49 V41 Q-31 38 -28 38 H-7Z" fill="url(#crossGold)" stroke="#927344" stroke-width="1.5" stroke-linejoin="round"/><path d="M-3 20 V42 H-25 M3 20 V42 H25 M-3 56 V90" fill="none" stroke="#fff4d5" stroke-opacity=".65" stroke-width="1.2"/><circle cy="45" r="3" fill="#f8ebce" stroke="#a6844c" stroke-width="1"/></g></g>`;chain.innerHTML='<rect class="chain-pan-surface" x="0" y="0" width="42%" height="100%" fill="transparent" pointer-events="all" aria-hidden="true"/>'+chainMarkup;document.querySelector('.rosary').append(chain);
// El rosario usa ahora el desplazamiento nativo del navegador: Android
// proporciona el impulso (fling) como en cualquier lista desplazable.
const rosaryScroller=document.createElement('div');
rosaryScroller.className='rosary-scroll-viewport';
rosaryScroller.setAttribute('aria-label','Desliza para recorrer las cuentas sin cambiar la oración');
const rosaryScrollContent=document.createElement('div');
rosaryScrollContent.className='rosary-scroll-content';
const rosaryStartSpace=document.createElement('div');
rosaryStartSpace.className='rosary-scroll-start';
const rosaryEndSpace=document.createElement('div');
rosaryEndSpace.className='rosary-scroll-end';
rosaryScrollContent.append(rosaryStartSpace,chain,rosaryEndSpace);
rosaryScroller.append(rosaryScrollContent);
document.querySelector('.rosary').append(rosaryScroller);
window.rosarioNativeScroll=rosaryScroller;
window.rosarioScrollToBead=function(bead,ending=false){
  const target=ending ? rosaryScroller.scrollHeight-rosaryScroller.clientHeight
    : point(Math.max(0,Math.min(55,bead))).y;
  rosaryScroller.scrollTop=Math.max(0,target);
};
const nativeScrollStyle=document.createElement('style');
nativeScrollStyle.textContent=`
.rosary-scroll-viewport{
  position:absolute;z-index:1;top:0;bottom:0;left:0;width:42%;
  overflow-x:hidden;overflow-y:auto;scrollbar-width:none;
  -webkit-overflow-scrolling:touch;overscroll-behavior:contain;
  touch-action:pan-y;scroll-snap-type:none;
}
.rosary-scroll-viewport::-webkit-scrollbar{display:none}
.rosary-scroll-content{position:relative;width:100%;overflow:visible}
.rosary-scroll-start{height:50dvh}
.rosary-scroll-end{height:116px}
.rosary-scroll-viewport .focus-chain{
  position:relative!important;inset:auto!important;
  display:block!important;overflow:visible!important;
  width:100vw!important;height:var(--rosary-native-height,3135px)!important;
  touch-action:pan-y!important;
}
.rosary-scroll-viewport .focus-bead,.rosary-scroll-viewport .chain-pan-surface{
  touch-action:pan-y!important;
}
.rosary-scroll-viewport .chain-track{
  transform:none!important;transition:none!important;
}
`;
document.head.append(nativeScrollStyle);
const dots=document.createElement('div');dots.className='section-dots';dots.setAttribute('aria-label','Progreso de los cinco misterios');document.querySelector('.hint').before(dots);document.querySelector('.hint').textContent='Desliza hacia arriba para avanzar · Hacia abajo para volver';
const previousRender=render;render=function(){previousRender();const s=steps[state.index];let bead=s?.bead;if(bead===undefined){if(!s||s.m>4)bead=54;else if(s.m<0)bead=0;else bead=Math.min((s.m+1)*11,55)}// Scroll anchoring is owned by the native scroll viewport.chain.querySelectorAll('.focus-bead').forEach(el=>{const beadNumber=Number(el.dataset.bead),idx=steps.findIndex(t=>t.bead===beadNumber),active=beadNumber===bead;el.dataset.step=String(idx);el.classList.toggle('done',idx<state.index);el.classList.toggle('active',active);el.setAttribute('aria-current',active?'step':'false')});chain.querySelectorAll('.chain-link').forEach(el=>{const i=Number(el.dataset.link);el.setAttribute('stroke',steps.findIndex(t=>t.bead===i+1)<state.index?'#b88f48':state.dark?'#4e574e':'#c8c3b7')});dots.innerHTML=Array.from({length:5},(_,i)=>`<span class="${!s||s.m>i?'complete':s.m===i?'active':''}"></span>`).join('');$('simpleNext').disabled=!s;$('simpleNext').textContent=s?'Completar '+s.title.toLowerCase()+' →':'Rosario completado ✓';$('simpleBack').disabled=state.index===0;};

function selectFocusBead(bead) {
  if (bead.classList.contains('active')) advance();
  else pick(Number(bead.dataset.step));
}
chain.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const bead = event.target.closest('.focus-bead');
  if (bead) { event.preventDefault(); if (!event.repeat) selectFocusBead(bead); }
});
render();
