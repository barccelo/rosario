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

  // Reutiliza los nodos SVG y el relieve reales; sólo se modifica la postura
  // del hilo y la posición de las cuentas, como un rosario suspendido en la mano.
  function syncPhysicalRosary(){
    const source=document.querySelector('.physical-scroll-viewport .physical-path');
    const target=layer.querySelector('.rosario-pouch-chain');
    if(!source?.querySelector('.physical-loop-beads')||!target)return false;
    const NS='http://www.w3.org/2000/svg';
    const svg=(tag)=>document.createElementNS(NS,tag);
    const root=svg('svg');
    root.setAttribute('viewBox','0 0 360 430');
    root.setAttribute('preserveAspectRatio','xMidYMax meet');
    root.setAttribute('aria-hidden','true');
    root.classList.add('physical-path','rosario-pouch-preview');
    // Se conservan las variables CSS y los degradados de la interfaz.
    const computed=getComputedStyle(source);
    for(const key of ['fill','line','outline','number','metal','shadow','surface',
      'pending','pending-stroke','complete','complete-stroke']){
      const name='--physical-'+key;
      root.style.setProperty(name,computed.getPropertyValue(name).trim());
    }
    source.querySelectorAll(':scope > defs').forEach(def=>root.append(def.cloneNode(true)));
    const pts=[{x:180,y:296}];
    for(let i=1;i<=27;i++){
      const t=i/27;
      pts.push({x:180-(48+13*Math.sin(Math.PI*t))+4*Math.sin(t*4),
        y:296-238*t+5*Math.sin(Math.PI*t*.85)});
    }
    for(let i=28;i<55;i++){
      const t=(i-28)/26;
      pts.push({x:180+48+12*Math.sin(Math.PI*t)-3*Math.sin(t*5),
        y:58+238*t-9*Math.sin(Math.PI*t)});
    }
    const pos=p=>p.x.toFixed(2)+' '+p.y.toFixed(2);
    function segment(i){
      const p=pts[i],q=pts[(i+1)%55];
      if(i===27)return 'M '+pos(p)+' C '+p.x.toFixed(2)+' 15 '+q.x.toFixed(2)+' 15 '+pos(q);
      if(i===54)return 'M '+pos(p)+' C 227 318 199 320 '+pos(q);
      if(i===0)return 'M '+pos(p)+' C 158 320 135 315 '+pos(q);
      const prev=pts[(i+54)%55],next=pts[(i+2)%55];
      const c1={x:p.x+(q.x-prev.x)/6,y:p.y+(q.y-prev.y)/6};
      const c2={x:q.x-(next.x-p.x)/6,y:q.y-(next.y-p.y)/6};
      return 'M '+pos(p)+' C '+pos(c1)+' '+pos(c2)+' '+pos(q);
    }
    const wires=svg('g');wires.setAttribute('class','physical-loop-links');
    const threadTemplate=source.querySelector('.physical-loop-link');
    const grainTemplate=source.querySelector('.physical-cord-grain');
    for(let i=0;i<55;i++){
      const d=segment(i);
      for(const origin of [threadTemplate,grainTemplate]){
        if(!origin)continue;
        const line=origin.cloneNode(true);
        line.setAttribute('d',d);
        line.removeAttribute('data-link');
        wires.append(line);
      }
    }
    root.append(wires);
    const pendant=[pts[0],{x:179,y:322},{x:183,y:340},{x:178,y:358},
      {x:180,y:378},{x:180,y:381}];
    for(let i=0;i<pendant.length-1;i++){
      const p=pendant[i],q=pendant[i+1],d=
        'M '+pos(p)+' Q '+(180+3*Math.sin(i)).toFixed(2)+' '+
        ((p.y+q.y)/2).toFixed(2)+' '+pos(q);
      for(const origin of [source.querySelector('.physical-intro-link'),grainTemplate]){
        if(!origin)continue;
        const link=origin.cloneNode(true);link.setAttribute('d',d);
        link.removeAttribute('data-link');wires.append(link);
      }
    }
    // Las cuentas son clones de los <g> originales, no círculos reconstruidos.
    // El mismo halo, aro, número y color se escalan sin deformarlos.
    function beadAt(original,targetPoint,scale){
      if(!original)return;
      const ring=original.querySelector('.ring');
      const cx=Number(ring?.getAttribute('cx'));
      const cy=Number(ring?.getAttribute('cy'));
      if(!Number.isFinite(cx)||!Number.isFinite(cy))return;
      const wrapper=svg('g');
      wrapper.setAttribute('transform','translate('+pos(targetPoint)+') scale('+scale+
        ') translate('+(-cx)+' '+(-cy)+')');
      const clone=original.cloneNode(true);
      clone.removeAttribute('tabindex');clone.removeAttribute('role');
      clone.removeAttribute('aria-label');clone.removeAttribute('aria-current');
      clone.querySelectorAll('text').forEach(t=>t.remove());
      wrapper.append(clone);root.append(wrapper);
    }
    const originals=Array.from(source.querySelectorAll('[data-bead]'));
    originals.forEach(node=>beadAt(node,pts[Number(node.dataset.bead)],.22));
    const intro=Array.from(source.querySelectorAll('[data-intro]'));
    intro.forEach((node,i)=>beadAt(node,pendant[i+1],.24));
    const ferrule=source.querySelector('.physical-cross-ferrule');
    if(ferrule){
      const rect=ferrule.cloneNode(true);
      rect.setAttribute('x','178');rect.setAttribute('y','374');
      rect.setAttribute('width','4');rect.setAttribute('height','7');
      root.append(rect);
    }
    const cross=source.querySelector('.physical-cross');
    if(cross){
      const copy=cross.cloneNode(true);
      copy.removeAttribute('tabindex');copy.removeAttribute('role');
      copy.removeAttribute('aria-label');copy.setAttribute('transform','translate(180 378) scale(.31)');
      root.append(copy);
    }
    // En la pantalla existen los mismos nombres de filtros; la copia necesita IDs únicos.
    const ids=new Map();
    root.querySelectorAll('[id]').forEach(el=>{
      const old=el.id,next='pouch-'+old;
      ids.set(old,next);el.id=next;
    });
    root.querySelectorAll('*').forEach(el=>{
      for(const attr of Array.from(el.attributes)){
        if(attr.name==='id')continue;
        let val=attr.value;
        for(const [old,next] of ids){
          val=val.replaceAll('url(#'+old+')','url(#'+next+')');
          if(val==='#'+old)val='#'+next;
        }
        if(val!==attr.value)el.setAttribute(attr.name,val);
      }
    });
    target.replaceChildren(root);
    return true;
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
  let stageTimer=0;
  let gestureSerial=0;
  let blessingGesture=state.index>=steps.length?0:-1;
  let blessingTime=0;
  let prayerGesture=false;
  document.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0)return;
    gestureSerial++;
    prayerGesture=!!(event.target instanceof Element&&
      event.target.closest('.immersive-prayer,#prayer')) &&
      !event.target.closest('a,button,input,select,textarea');
  },true);
  if(!window.PointerEvent){
    document.addEventListener('touchstart',event=>{
      if(event.touches.length!==1)return;
      gestureSerial++;
      prayerGesture=!!(event.target instanceof Element&&
        event.target.closest('.immersive-prayer,#prayer'));
    },{capture:true,passive:true});
  }

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

  function calculateDock(){
    const sceneRect=scene.getBoundingClientRect();
    const side=state.rosarySide==='right'?'right':'left';
    const inset=Math.max(64,Math.min(115,window.innerWidth*.17));
    const endX=side==='right'?window.innerWidth-inset:inset;
    const dx=endX-(sceneRect.left+sceneRect.width*.5);
    const dy=Math.max(-48,Math.min(48,window.innerHeight*.43-
      (sceneRect.top+sceneRect.height*.34)));
    scene.style.setProperty('--pouch-dock-x',Math.round(dx)+'px');
    scene.style.setProperty('--pouch-dock-y',Math.round(dy)+'px');
    layer.dataset.side=side;
  }

  function after(ms,fn){stageTimer=window.setTimeout(fn,ms)}
  function openPouch(){
    if(animating)return;
    animating=true;
    if(state.index>=steps.length && state.pouchCompletedDate &&
       state.pouchCompletedDate!==dayKey()){
      state.index=0;
      state.intentionCycle=[null,null,null,null,null];
      window.rosarioResetIntentionCycle?.();
      window.rosarioPhysicalReset?.();
      render();
    }
    opened=true;
    syncPhysicalRosary();
    appearance();
    calculateDock();
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    layer.dataset.phase='opening';
    hint.textContent='';
    // La extracción empieza inmediatamente después de abrir la solapa.
    after(1660,()=>{
      layer.dataset.phase='extracting';
      after(3250,()=>{
        // Las dos mitades de la funda desaparecen al mismo tiempo.
        layer.dataset.phase='docking';
        after(2050,()=>{
          layer.classList.add('is-revealing');
          after(600,()=>{
            layer.hidden=true;
            animating=false;
          });
        });
      });
    });
  }

  function closePouch(){
    if(animating)return;
    animating=true;
    state.pouchCompletedDate=dayKey();
    persist();
    syncPhysicalRosary();
    appearance();
    calculateDock();
    hint.textContent='';
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    layer.dataset.phase='returning';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      layer.dataset.phase='centering';
      after(1700,()=>{
        layer.dataset.phase='stowing';
        after(3250,()=>{
          layer.dataset.phase='sealing';
          after(1720,()=>{
            layer.dataset.phase='finished';
            hint.textContent='Rosario de hoy completado';
            animating=false;
          });
        });
      });
    }));
  }

  action.addEventListener('click',openPouch);
  window.addEventListener('resize',()=>{if(!layer.hidden)calculateDock();},{passive:true});
  const formerRender=render;
  render=function(){
    const previous=lastIndex;
    formerRender();
    lastIndex=state.index;
    if(previous<steps.length && state.index>=steps.length){
      // El gesto que muestra «El Señor nos bendiga» no puede cerrarlo.
      blessingGesture=gestureSerial;
      blessingTime=performance.now();
    }
    if(!layer.hidden&&!animating)appearance();
  };

  window.rosarioPouchFinish=()=>{
    if(!opened||animating||!layer.hidden||
       state.index<steps.length||completeToday())return false;
    // Debe comenzar OTRO toque o swipe, sobre la oración final.
    if(!prayerGesture||gestureSerial<=blessingGesture||
       performance.now()-blessingTime<400)return false;
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
  // Además del swipe, el toque simple en el texto final confirma el guardado.
  document.addEventListener('click',event=>{
    if(!opened||animating||!layer.hidden||state.index<steps.length)return;
    if(!(event.target instanceof Element)||
       !event.target.closest('.immersive-prayer,#prayer'))return;
    if(event.target.closest('button,a,input,textarea,select'))return;
    if(window.rosarioPouchFinish()){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);
  // El rosario físico se crea en DOMContentLoaded; esperamos su dibujo real.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(syncPhysicalRosary),{once:true});
  }else requestAnimationFrame(syncPhysicalRosary);

  // La carterita conserva sus transiciones; la bendición final exige otro toque.
  appearance();
  layer.hidden=false;
})();
