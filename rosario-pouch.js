/* Funda animada: rosario completo, salida desde la boca y desplazamiento a su lado. */
(() => {
  'use strict';
  if (window.RosarioAndroid) return;

  const dayKey=()=>{
    const d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  };
  const labels={
    Gozosos:'Misterios gozosos',Dolorosos:'Misterios dolorosos',
    Gloriosos:'Misterios gloriosos',Luminosos:'Misterios luminosos'
  };
  // Colores coordinados con los grupos y variantes ya disponibles en rosary-colors.js.
  const themeData={
    Gozosos:{
      sky:['#ECF7FB','#F9FDFF','#70B9DE','#4A9BC8','#7AAABE','#D6EBF3','#9EBECB'],
      blue:['#EDF3FC','#FAFCFF','#387BB9','#266AA7','#7498BE','#D5E5F6','#98B8D8']
    },
    Dolorosos:{
      purple:['#F5EFF8','#FFF9FF','#76579B','#694C89','#9780AB','#DDD0E8','#A58BB7'],
      red:['#FAF0F2','#FFF9FA','#B54D61','#A63F55','#AF7B83','#EFCBD5','#C58C9B']
    },
    Luminosos:{
      gold:['#FCF7E9','#FFFBF0','#BC922D','#A58025','#B49B63','#F4E5B7','#C9B06E'],
      yellow:['#FFFAEB','#FFFDF5','#E0BB4C','#C9A232','#B9A05C','#F6E8B4','#D5BB72']
    },
    Gloriosos:{
      pearl:['#F4F4F0','#FFFFFF','#DADFD9','#929D99','#ADB3AD','#F4F2EC','#C8C8BF']
    }
  };
  const darkBg={Gozosos:'#14242D',Dolorosos:'#211B2B',
    Luminosos:'#292316',Gloriosos:'#202629'};

  // Copia íntegra: ningún hilo, cuenta, radio, arco ni coordenada se recalcula.
  // El último fotograma coincide píxel a píxel con el SVG de la interfaz.
  let transfer=null;
  let geometry=null;
  function syncPhysicalRosary(){
    const source=document.querySelector('.physical-scroll-viewport .physical-path');
    if(!source?.querySelector('.physical-loop-beads'))return false;
    const bounds=source.getBoundingClientRect();
    const bead=source.querySelector('[data-bead="0"] .ring');
    const axis=Number(bead?.getAttribute('cx'))||76;
    const h=bounds.height||2670,w=bounds.width||innerWidth;
    const left=Number.isFinite(bounds.left)?bounds.left:0;
    const top=Number.isFinite(bounds.top)?bounds.top:0;
    transfer?.remove();
    transfer=source.cloneNode(true);
    transfer.classList.add('rosario-pouch-transfer');
    transfer.removeAttribute('role');
    transfer.setAttribute('aria-hidden','true');
    transfer.querySelectorAll('[tabindex]').forEach(el=>el.removeAttribute('tabindex'));
    transfer.querySelectorAll('[role="button"]').forEach(el=>el.removeAttribute('role'));
    const ids=new Map();
    transfer.querySelectorAll('[id]').forEach(el=>{
      const old=el.id,next='pouch-transfer-'+old;
      ids.set(old,next);
      el.id=next;
    });
    transfer.querySelectorAll('*').forEach(el=>{
      for(const attr of Array.from(el.attributes)){
        if(attr.name==='id')continue;
        let value=attr.value;
        for(const [old,next] of ids){
          value=value.replaceAll('url(#'+old+')','url(#'+next+')');
          if(value==='#'+old)value='#'+next;
        }
        if(value!==attr.value)el.setAttribute(attr.name,value);
      }
    });
    const computed=getComputedStyle(source);
    for(const name of ['--physical-fill','--physical-line','--physical-outline',
      '--physical-number','--physical-metal','--physical-shadow',
      '--physical-surface','--physical-pending','--physical-pending-stroke',
      '--physical-complete','--physical-complete-stroke'])
      transfer.style.setProperty(name,computed.getPropertyValue(name).trim());
    // Sin un visor con scroll el SVG se posiciona de forma absoluta,
    // exactamente en las coordenadas que ocupa su original.
    Object.assign(transfer.style,{
      position:'fixed',left:left+'px',top:top+'px',
      width:w+'px',height:h+'px',maxWidth:'none',maxHeight:'none',
      overflow:'visible',pointerEvents:'none',touchAction:'none',
      transformOrigin:axis+'px 100%',willChange:'transform,opacity',
      opacity:'0'
    });
    scene.append(transfer);
    const sceneBox=scene.getBoundingClientRect();
    const mouthX=sceneBox.left+sceneBox.width/2;
    const mouthY=sceneBox.top+sceneBox.height/2-36;
    geometry={mouthX,mouthY,originX:left+axis,originY:top+h,scale:.12};
    return true;
  }

  function transformAt(dx,dy,scale){
    return 'translate('+Math.round(dx)+'px,'+Math.round(dy)+'px) scale('+scale+')';
  }
  function atMouth(scale){
    const g=geometry;
    return transformAt(g.mouthX-g.originX,g.mouthY-g.originY,scale);
  }
  function atScreen(scale){
    return transformAt(0,0,scale);
  }
  function wait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
  async function motion(frames,duration,easing='cubic-bezier(.25,.7,.24,1)'){
    const animation=transfer.animate(frames,{duration,easing,fill:'forwards'});
    try{await animation.finished}catch{}
    if(transfer){
      const last=frames[frames.length-1];
      if(last.transform!==undefined)transfer.style.transform=last.transform;
      if(last.opacity!==undefined)transfer.style.opacity=String(last.opacity);
    }
    animation.cancel();
  }

  // La cruz de la funda está repartida entre solapa y cuerpo.
  // No se coloca un botón o broche metálico encima.
  const upperCross=`<svg class="rosario-pouch-cross-upper" viewBox="0 0 42 30" aria-hidden="true">
    <path d="M18 1 H24 V13 H36 V21 H24 V30 H18 V21 H6 V13 H18 Z"
      fill="none" stroke="#b5975f" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M21 3 V29 M9 17 H33" fill="none" stroke="#e7cb8e" stroke-width="1.3"/>
  </svg>`;
  const lowerCross=`<svg class="rosario-pouch-cross-lower" viewBox="0 0 42 32" aria-hidden="true">
    <path d="M18 0 V28 Q18 30 21 30 Q24 30 24 28 V0"
      fill="none" stroke="#b5975f" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M21 0 V26" fill="none" stroke="#e7cb8e" stroke-width="1.3"/>
  </svg>`;

  const layer=document.createElement('div');
  layer.className='rosario-pouch-layer';
  layer.hidden=true;
  layer.dataset.phase='closed';
  layer.setAttribute('role','dialog');
  layer.setAttribute('aria-modal','true');
  layer.setAttribute('aria-label','Santo Rosario');
  layer.innerHTML=`
    <div class="rosario-pouch-scene">
      <div class="rosario-pouch-title"></div>
      <div class="rosario-pouch-rear" aria-hidden="true">
        <div class="rosario-pouch-back"></div>
        <div class="rosario-pouch-mouth"></div>
      </div>
      <div class="rosario-pouch-chain-window" aria-hidden="true">
        <div class="rosario-pouch-chain"></div>
      </div>
      <div class="rosario-pouch-wallet">
        <div class="rosario-pouch-front">${lowerCross}</div>
        <button class="rosario-pouch-open" type="button" aria-label="Abrir el rosario"></button>
      </div>
      <div class="rosario-pouch-flap-unit" aria-hidden="true">
        <div class="rosario-pouch-flap">${upperCross}</div>
      </div>
      <div class="rosario-pouch-hint" aria-live="polite"></div>
    </div>`;
  document.body.append(layer);
  const action=layer.querySelector('.rosario-pouch-open');
  const title=layer.querySelector('.rosario-pouch-title');
  const hint=layer.querySelector('.rosario-pouch-hint');
  const scene=layer.querySelector('.rosario-pouch-scene');
  const completeToday=()=>state.index>=steps.length && state.pouchCompletedDate===dayKey();
  let lastIndex=state.index;
  let animating=false;
  let opened=false;
  let finalPress=null;

  // Únicamente un gesto que COMIENZA con la bendición ya visible la cierra.
  // El swipe que acaba de revelar esa oración nunca puede reutilizarse.
  document.addEventListener('pointerdown',event=>{
    finalPress=null;
    if(!event.isPrimary||event.button!==0||!opened||animating||
       !layer.hidden||state.index<steps.length)return;
    if(!(event.target instanceof Element)||
       !event.target.closest('.immersive-prayer,#prayer')||
       event.target.closest('button,a,input,textarea,select'))return;
    finalPress={id:event.pointerId,x:event.clientX,y:event.clientY};
  },true);
  document.addEventListener('pointerup',event=>{
    const p=finalPress;
    finalPress=null;
    if(!p||p.id!==event.pointerId||state.index<steps.length)return;
    const dx=event.clientX-p.x,dy=event.clientY-p.y;
    const forwardDown=window.rosarioPhysicalSwipeDown?.()===true;
    const forward=forwardDown?dy>45:dy< -45;
    // Un toque, o un swipe de avance. Ni swipe inverso ni horizontal.
    if(Math.abs(dx)>40||Math.abs(dy)>40&&!forward)return;
    window.rosarioPouchFinish();
  },true);
  document.addEventListener('pointercancel',()=>{finalPress=null},true);

  function appearance(){
    const group=labels[state.group]?state.group:'Gloriosos';
    const variations=themeData[group];
    const proposed=state.rosaryColorVariants?.[group];
    const keys=Object.keys(variations);
    const palette=variations[proposed]||variations[keys[0]];
    const [bg,surface,bead,outline,thread,material,edge]=palette;
    layer.dataset.theme=group;
    layer.style.setProperty('--pouch-bg',state.dark?darkBg[group]:bg);
    layer.style.setProperty('--pouch-surface',state.dark?darkBg[group]:surface);
    layer.style.setProperty('--pouch-bead',bead);
    layer.style.setProperty('--pouch-outline',outline);
    layer.style.setProperty('--pouch-thread',thread);
    layer.style.setProperty('--pouch-light',material);
    layer.style.setProperty('--pouch-mid',surface);
    layer.style.setProperty('--pouch-shadow',edge);
    layer.style.setProperty('--pouch-stitch',edge);
    layer.style.setProperty('--pouch-ink',state.dark?'#F4EDE1':'#34414B');
    title.textContent=labels[group];
    if(!animating){
      hint.textContent=completeToday()?'Rosario de hoy completado':
        state.index>0 && state.index<steps.length?'Toca para continuar':'Toca para comenzar';
    }
  }

  async function openPouch(){
    if(animating)return;
    animating=true;
    if(state.index>=steps.length&&state.pouchCompletedDate&&
       state.pouchCompletedDate!==dayKey()){
      state.index=0;
      state.intentionCycle=[null,null,null,null,null];
      window.rosarioResetIntentionCycle?.();
      window.rosarioPhysicalReset?.();
      render();
    }
    opened=true;
    appearance();
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    hint.textContent='';
    if(!syncPhysicalRosary()){
      layer.hidden=true;
      animating=false;
      return;
    }
    transfer.style.transform=atMouth(.012);
    layer.dataset.phase='opening';
    await wait(1620);
    layer.dataset.phase='extracting';
    await motion([
      {transform:atMouth(.012),opacity:0},
      {transform:atMouth(.12),opacity:1}
    ],2750);
    layer.dataset.phase='traveling';
    await motion([
      {transform:atMouth(.12),opacity:1},
      {transform:atScreen(.12),opacity:1}
    ],1100);
    layer.dataset.phase='expanding';
    // La funda ya se ha desvanecido: primero crece hasta coincidir
    // exactamente con el SVG visible, luego comienza el fundido.
    await motion([
      {transform:atScreen(.12),opacity:1},
      {transform:atScreen(.63),opacity:1,offset:.63},
      {transform:atScreen(1),opacity:1}
    ],1850);
    layer.dataset.phase='handoff';
    await motion([
      {transform:atScreen(1),opacity:1},
      {transform:atScreen(1),opacity:0}
    ],850,'linear');
    layer.classList.add('is-revealing');
    await wait(500);
    layer.hidden=true;
    transfer?.remove();
    transfer=null;
    animating=false;
  }

  async function closePouch(){
    if(animating)return;
    animating=true;
    state.pouchCompletedDate=dayKey();
    persist();
    appearance();
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    hint.textContent='';
    if(!syncPhysicalRosary()){
      layer.hidden=true;
      animating=false;
      return;
    }
    transfer.style.transform=atScreen(1);
    transfer.style.opacity='0';
    layer.dataset.phase='returning';
    // Se captura el mismo dibujo donde está la oración, sin salto.
    await motion([
      {transform:atScreen(1),opacity:0},
      {transform:atScreen(1),opacity:1}
    ],700,'linear');
    layer.dataset.phase='shrinking';
    await motion([
      {transform:atScreen(1),opacity:1},
      {transform:atScreen(.12),opacity:1}
    ],1850);
    layer.dataset.phase='traveling-in';
    await motion([
      {transform:atScreen(.12),opacity:1},
      {transform:atMouth(.12),opacity:1}
    ],1100);
    layer.dataset.phase='stowing';
    await motion([
      {transform:atMouth(.12),opacity:1},
      {transform:atMouth(.012),opacity:0}
    ],2700);
    layer.dataset.phase='sealing';
    await wait(1650);
    layer.dataset.phase='finished';
    hint.textContent='Rosario de hoy completado';
    transfer?.remove();
    transfer=null;
    animating=false;
  }

  action.addEventListener('click',openPouch);
  const formerRender=render;
  render=function(){
    formerRender();
    lastIndex=state.index;
    if(!layer.hidden&&!animating)appearance();
  };

  window.rosarioPouchFinish=()=>{
    if(!opened||animating||!layer.hidden||state.index<steps.length)
      return false;
    closePouch();
    return true;
  };
  const priorAdvance=advance;
  advance=function(...args){
    if(state.index>=steps.length){
      window.rosarioPouchFinish();
      return;
    }
    return priorAdvance(...args);
  };
  // Aun con dispositivos que no disparan pointerup, el toque puede
  // confirmar el cierre sin interferir con el swipe de apertura final.
  document.addEventListener('click',event=>{
    if(event.detail!==0||!opened||animating||!layer.hidden||
       state.index<steps.length)return;
    if(!(event.target instanceof Element)||
       !event.target.closest('.immersive-prayer,#prayer'))return;
    window.rosarioPouchFinish();
  },true);

  // El rosario físico se crea en DOMContentLoaded; esperamos su dibujo real.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(syncPhysicalRosary),{once:true});
  }else requestAnimationFrame(syncPhysicalRosary);

  // La carterita conserva sus transiciones; la bendición final exige otro toque.
  appearance();
  layer.hidden=false;
})();
