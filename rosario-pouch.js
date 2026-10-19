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

  // Reutiliza el SVG que dibuja rosary-physical.js: sus hilos, cuentas y cruz reales.
  function syncPhysicalRosary(){
    const source=document.querySelector('.physical-path');
    const target=layer.querySelector('.rosario-pouch-chain');
    if(!source?.querySelector('.physical-loop-beads')||!target)return false;
    const NS='http://www.w3.org/2000/svg';
    const root=document.createElementNS(NS,'svg');
    root.setAttribute('viewBox','0 0 260 390');
    root.setAttribute('preserveAspectRatio','xMidYMax meet');
    root.classList.add('physical-path','rosario-pouch-preview');
    root.setAttribute('aria-hidden','true');
    const computed=getComputedStyle(source);
    ['fill','line','outline','number','metal','shadow','surface','pending',
     'pending-stroke','complete','complete-stroke'].forEach(key=>{
      const name='--physical-'+key;
      root.style.setProperty(name,computed.getPropertyValue(name).trim());
    });
    const group=document.createElementNS(NS,'g');
    const bead=source.querySelector('[data-bead="0"] .ring');
    const cx=Number(bead?.getAttribute('cx'))||76;
    const fy=.145,fr=.30;
    group.setAttribute('transform',
      'translate('+(130-cx).toFixed(2)+' '+(10-54*fy).toFixed(2)+') scale(1 '+fy+')');
    Array.from(source.children).forEach(child=>group.append(child.cloneNode(true)));
    root.append(group);
    // La reducción vertical no deforma las cuentas en el pequeño rosario.
    root.querySelectorAll('circle').forEach(circle=>{
      const r=Number(circle.getAttribute('r'));
      if(!Number.isFinite(r)||r<=0)return;
      const ellipse=document.createElementNS(NS,'ellipse');
      for(const attr of Array.from(circle.attributes))
        if(attr.name!=='r')ellipse.setAttribute(attr.name,attr.value);
      ellipse.setAttribute('rx',(r*fr).toFixed(3));
      ellipse.setAttribute('ry',(r*fr/fy).toFixed(3));
      circle.replaceWith(ellipse);
    });
    root.querySelectorAll('text').forEach(el=>el.remove());
    root.querySelectorAll('[tabindex]').forEach(el=>el.removeAttribute('tabindex'));
    root.querySelectorAll('[role="button"]').forEach(el=>el.removeAttribute('role'));
    // La cruz mantiene el mismo trazado; su escala es uniforme en pantalla.
    const cross=root.querySelector('.physical-cross');
    if(cross){
      const t=cross.getAttribute('transform')||'';
      const match=t.match(/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/);
      if(match){
        cross.setAttribute('transform','translate('+match[1]+' '+match[2]+
          ') scale(.28 '+(.28/fy).toFixed(4)+')');
      }
    }
    // Evita IDs de degradados duplicados entre el rosario animado y la interfaz.
    const ids=new Map();
    root.querySelectorAll('[id]').forEach(el=>{
      const old=el.id,next='pouch-'+old;
      ids.set(old,next);el.id=next;
    });
    root.querySelectorAll('*').forEach(el=>{
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
    const target=document.querySelector('.physical-scroll-viewport');
    const rect=target&&getComputedStyle(target).display!=='none'
      ?target.getBoundingClientRect():null;
    const side=state.rosarySide==='right'?'right':'left';
    const centerX=rect&&rect.width>0?(rect.left+rect.width*.45):
      (side==='right'?window.innerWidth*.88:window.innerWidth*.12);
    const centerY=rect&&rect.height>0?rect.top+rect.height*.45:window.innerHeight*.43;
    const mouth=scene.getBoundingClientRect();
    const rosaryCenterY=mouth.top+mouth.height*.6-160;
    const dx=centerX-(mouth.left+mouth.width/2);
    const dy=centerY-rosaryCenterY;
    scene.style.setProperty('--pouch-dock-x',dx.toFixed(1)+'px');
    scene.style.setProperty('--pouch-dock-y',Math.max(-85,Math.min(85,dy)).toFixed(1)+'px');
  }

  function after(ms,fn){stageTimer=window.setTimeout(fn,ms)}
  function openPouch(){
    if(animating)return;
    animating=true;
    if(state.index>=steps.length && state.pouchCompletedDate && state.pouchCompletedDate!==dayKey()){
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
    layer.dataset.phase='opening';  // 1,5 s: solapa
    hint.textContent='';
    after(1800,()=>{
      layer.dataset.phase='extracting'; // 3,8 s: aro completo asciende desde la boca
      after(4500,()=>{
        layer.dataset.phase='docking'; // 1,8 s: rosario a su lado
        after(1950,()=>{
          layer.classList.add('is-revealing');
          after(850,()=>{
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
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    layer.dataset.phase='returning';
    hint.textContent='';
    // Dos cuadros para asegurar que el navegador pinte el origen lateral
    // antes de animarlo al centro.
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      layer.dataset.phase='centering';
      after(2000,()=>{
        layer.dataset.phase='stowing'; // 3,8 s: la cruz, las cuentas y el aro entran en la boca
        after(4500,()=>{
          layer.dataset.phase='sealing'; // 1,5 s: solapa y bordado
          after(1850,()=>{
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
    formerRender();
    lastIndex=state.index;
    // Mostrar la bendición final sin cerrar automáticamente la funda.
    // El cierre se realiza al avanzar una vez MÁS tras haberla leído.
    if(!layer.hidden && !animating)appearance();
  };

  window.rosarioPouchFinish=()=>{
    if(!opened||animating||!layer.hidden||state.index<steps.length)return false;
    closePouch();
    return true;
  };
  // Avanzar al marcador de cierre NO equivale a terminar de rezar la
  // bendición que aparece en la última pantalla.
  const priorAdvance=advance;
  advance=function(...args){
    if(state.index>=steps.length){
      window.rosarioPouchFinish();
      return;
    }
    return priorAdvance(...args);
  };
  // El toque directo sobre la oración final también guarda el rosario.
  document.addEventListener('click',event=>{
    if(!opened||animating||!layer.hidden||state.index<steps.length)return;
    if(!(event.target instanceof Element)||
        !event.target.closest('.immersive-prayer,#prayer'))return;
    if(event.target.closest('button,a,input,textarea,select'))return;
    event.preventDefault();
    event.stopPropagation();
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
