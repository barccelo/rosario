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

  function miniatureRosary(){
    const ring=[];
    const points=[{x:130,y:234}];
    // El mismo recorrido cerrado de las cinco decenas: unión, subida,
    // arco superior, bajada y retorno a la cuenta compartida.
    for(let i=1;i<=27;i++)points.push({x:91,y:233-i*7.37});
    for(let i=28;i<55;i++)points.push({x:169,y:34+(i-28)*7.65});
    for(let i=0;i<55;i++){
      const p=points[i],big=i%11===0,r=big?6.1:3.5;
      ring.push('<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+
        '" r="'+r+'" fill="var(--pouch-bead)" stroke="var(--pouch-outline)" stroke-width="'+(big?2:1.05)+'"/>');
    }
    const small=[259,278,297].map(y=>
      '<circle cx="130" cy="'+y+'" r="5.2" fill="var(--pouch-bead)" stroke="var(--pouch-outline)" stroke-width="1.4"/>').join('');
    return `<svg viewBox="0 0 260 390" preserveAspectRatio="xMidYMax meet"
      aria-label="Rosario completo, cinco decenas y cruz" role="img">
      <defs>
        <linearGradient id="pouch-rosary-cross-gold" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#f3e3bc"/><stop offset=".45" stop-color="#bd9657"/>
          <stop offset=".7" stop-color="#e1c58d"/><stop offset="1" stop-color="#96713f"/>
        </linearGradient>
      </defs>
      <path d="M130 234 Q91 244 91 225 V40 C91 2 169 2 169 40
        V225 Q169 244 130 234" fill="none" stroke="var(--pouch-thread)"
        stroke-width="2.8" stroke-linecap="round"/>
      <path d="M130 234 L130 344" fill="none" stroke="var(--pouch-thread)"
        stroke-width="2.8" stroke-linecap="round"/>
      <g>${ring.join('')}</g>
      ${small}
      <circle cx="130" cy="326" r="8.7" fill="#e4ca97"
        stroke="#bb985d" stroke-width="1.7"/>
      <circle cx="130" cy="326" r="5.6" fill="#847458"/>
      <g transform="translate(130 349) scale(.4)">
        <rect x="-2.7" y="-8" width="5.4" height="9" rx="2" fill="#b89a66"
          stroke="#927344" stroke-width=".7"/>
        <ellipse cy="7" rx="5" ry="8" fill="none" stroke="#b49663" stroke-width="2.5"/>
        <path d="M-7 17 Q-7 14 -4 14 H4 Q7 14 7 17 V38 H28 Q31 38 31 41 V49
          Q31 52 28 52 H7 V94 Q7 97 4 97 H-4 Q-7 97 -7 94 V52 H-28
          Q-31 52 -31 49 V41 Q-31 38 -28 38 H-7Z"
          fill="url(#pouch-rosary-cross-gold)" stroke="#927344" stroke-width="1.5"/>
        <path d="M-3 20 V42 H-25 M3 20 V42 H25 M-3 56 V90"
          stroke="#fff4d5" stroke-opacity=".65" stroke-width="1.2" fill="none"/>
        <circle cy="45" r="3" fill="#f8ebce" stroke="#a6844c" stroke-width="1"/>
      </g>
    </svg>`;
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
        <div class="rosario-pouch-chain">${miniatureRosary()}</div>
      </div>
      <div class="rosario-pouch-wallet">
        <div class="rosario-pouch-front">${lowerCross}</div>
        <div class="rosario-pouch-flap">${upperCross}</div>
        <button class="rosario-pouch-open" type="button" aria-label="Abrir el rosario"></button>
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
    if(state.index>=steps.length && !completeToday()){
      state.index=0;
      state.intentionCycle=[null,null,null,null,null];
      window.rosarioResetIntentionCycle?.();
      window.rosarioPhysicalReset?.();
      render();
    }
    opened=true;
    appearance();
    calculateDock();
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    layer.dataset.phase='opening';  // 1,5 s: solapa
    hint.textContent='';
    after(1600,()=>{
      layer.dataset.phase='extracting'; // 3,8 s: aro completo asciende desde la boca
      after(4000,()=>{
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
        after(4000,()=>{
          layer.dataset.phase='sealing'; // 1,5 s: solapa y bordado
          after(1650,()=>{
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
    if(!opened||animating)return;
    if(previous<steps.length && state.index>=steps.length)closePouch();
    else if(!layer.hidden)appearance();
  };

  // Evitar las interrupciones propias de «reducir movimiento» sólo para este
  // acto deliberadamente animado; la duración es parte de la interacción.
  appearance();
  layer.hidden=false;
})();
