/* Carterita de entrada y cierre. Solo para la web hasta aprobar la experiencia en Android. */
(() => {
  'use strict';
  if (window.RosarioAndroid) return;

  const todayKey = () => {
    const d = new Date();
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  };
  const names = {
    Gozosos:'Misterios gozosos',Dolorosos:'Misterios dolorosos',
    Gloriosos:'Misterios gloriosos',Luminosos:'Misterios luminosos'
  };
  const flower = `<svg class="rosario-pouch-cross" viewBox="0 0 40 54" aria-hidden="true">
    <path d="M17 3 H23 V18 H34 V25 H23 V51 H17 V25 H6 V18 H17 Z"
      fill="none" stroke="#b49357" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M19 5 V48 M9 21 H31" fill="none" stroke="#e6ce96" stroke-width="1.1"/>
  </svg>`;
  // El rosario sale de una ventana recortada justo detrás de la boca de la cartera.
  // Se reutiliza la cruz de la interfaz, sin convertirla en un simple signo +.
  const rosary = `<svg viewBox="0 0 142 300" preserveAspectRatio="xMidYMax meet"
    role="img" aria-label="Rosario con cuentas, hilo, argolla y cruz dorada">
    <defs>
      <linearGradient id="pouch-gold" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#f3e3bc"/><stop offset=".45" stop-color="#bd9657"/>
        <stop offset=".7" stop-color="#e1c58d"/><stop offset="1" stop-color="#96713f"/>
      </linearGradient>
    </defs>
    <path d="M71 1 Q69 35 71 87 Q73 147 71 220" stroke="#aab4ab" stroke-width="3.1" fill="none" stroke-linecap="round"/>
    <path d="M71 1 Q69 35 71 87 Q73 147 71 220" stroke="#e3d6ba" stroke-width=".7"
      stroke-dasharray="3 7" fill="none"/>
    <g fill="#abb6ac">
      <circle cx="71" cy="29" r="11.5"/><circle cx="71" cy="83" r="11.5"/>
      <circle cx="71" cy="137" r="11.5"/>
    </g>
    <g fill="#dfe7e0"><circle cx="71" cy="29" r="8.6"/><circle cx="71" cy="83" r="8.6"/>
      <circle cx="71" cy="137" r="8.6"/></g>
    <circle cx="71" cy="197" r="17" fill="#e8cc9b"/>
    <circle cx="71" cy="197" r="12" fill="#877959"/>
    <g transform="translate(71 222) scale(.72)">
      <rect x="-2.7" y="-8" width="5.4" height="9" rx="2" fill="#b89a66"
        stroke="#927344" stroke-width=".7"/>
      <ellipse cy="7" rx="5" ry="8" fill="none" stroke="#b49663" stroke-width="2.5"/>
      <path d="M-7 17 Q-7 14 -4 14 H4 Q7 14 7 17 V38 H28 Q31 38 31 41 V49
         Q31 52 28 52 H7 V94 Q7 97 4 97 H-4 Q-7 97 -7 94 V52 H-28 Q-31 52 -31 49
         V41 Q-31 38 -28 38 H-7Z" fill="url(#pouch-gold)" stroke="#927344" stroke-width="1.5"/>
      <path d="M-3 20 V42 H-25 M3 20 V42 H25 M-3 56 V90"
        stroke="#fff4d5" stroke-opacity=".65" stroke-width="1.2" fill="none"/>
      <circle cy="45" r="3" fill="#f8ebce" stroke="#a6844c" stroke-width="1"/>
    </g>
  </svg>`;

  const layer=document.createElement('div');
  layer.className='rosario-pouch-layer';
  layer.dataset.phase='closed';
  layer.setAttribute('role','dialog');
  layer.setAttribute('aria-modal','true');
  layer.setAttribute('aria-label','Guardar y sacar el Santo Rosario');
  layer.innerHTML=`
    <div class="rosario-pouch-scene">
      <div class="rosario-pouch-title">Santo Rosario</div>
      <div class="rosario-pouch-chain-window" aria-hidden="true">
        <div class="rosario-pouch-chain">${rosary}</div>
      </div>
      <div class="rosario-pouch-wallet">
        <div class="rosario-pouch-back"></div>
        <div class="rosario-pouch-mouth"></div>
        <div class="rosario-pouch-front"></div>
        ${flower}
        <div class="rosario-pouch-flap"></div>
        <div class="rosario-pouch-snap"></div>
        <button type="button" class="rosario-pouch-open" aria-label="Abrir carterita y sacar el rosario"></button>
      </div>
      <div class="rosario-pouch-hint" aria-live="polite"></div>
    </div>`;
  document.body.append(layer);
  const action=layer.querySelector('.rosario-pouch-open');
  const hint=layer.querySelector('.rosario-pouch-hint');
  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const finishedToday=()=>state.index>=steps.length && state.pouchCompletedDate===todayKey();
  let lastIndex=state.index;
  let isAnimating=false;
  let viewOpened=false;

  function syncAppearance(){
    const kind=Object.prototype.hasOwnProperty.call(names,state.group)?state.group:'Gloriosos';
    layer.dataset.theme=kind;
    if(layer.dataset.phase==='closed'||layer.dataset.phase==='finished'){
      const complete=finishedToday();
      hint.textContent=complete?'Rosario de hoy completado · Toca para revisar':
        state.index>0&&state.index<steps.length?'Toca para continuar tu rosario':
        'Toca la carterita para comenzar';
      action.setAttribute('aria-label',complete?'Abrir el rosario completado':
        state.index>0&&state.index<steps.length?'Abrir la carterita y continuar el rosario':
        'Abrir la carterita y sacar el rosario');
      layer.querySelector('.rosario-pouch-title').textContent=names[kind];
    }
  }

  function openPouch(){
    if(isAnimating)return;
    isAnimating=true;
    // Se conserva cualquier oración a medio rezar. Solo el fin de un día anterior
    // permite iniciar desde cero; nunca se reinicia por abrir la carterita.
    if(state.index>=steps.length && !finishedToday()){
      state.index=0;
      state.intentionCycle=[null,null,null,null,null];
      if(typeof window.rosarioResetIntentionCycle==='function')
        window.rosarioResetIntentionCycle();
      window.rosarioPhysicalReset?.();
      render();
    }
    viewOpened=true;
    syncAppearance();
    hint.textContent='Sacando el rosario…';
    layer.dataset.phase='opening';
    const duration=reduced()?80:5400;
    window.setTimeout(()=>{
      layer.classList.add('is-revealing');
      window.setTimeout(()=>{
        layer.hidden=true;
        isAnimating=false;
      },reduced()?30:1050);
    },duration);
  }

  function closePouch(){
    if(isAnimating)return;
    isAnimating=true;
    state.pouchCompletedDate=todayKey();
    persist();
    syncAppearance();
    layer.hidden=false;
    layer.classList.remove('is-revealing');
    layer.dataset.phase='closing';
    hint.textContent='Guardando el rosario…';
    window.setTimeout(()=>{
      layer.dataset.phase='finished';
      hint.textContent='Rosario de hoy completado · Toca para revisar';
      action.setAttribute('aria-label','Abrir el rosario completado');
      isAnimating=false;
      // Sin foco programático: evita un recuadro sobre la carterita.
    },reduced()?80:5600);
  }

  action.addEventListener('click',openPouch);
  action.addEventListener('keydown',event=>{
    if(event.key==='Escape' && layer.dataset.phase==='finished')openPouch();
  });

  // Captura TODOS los métodos existentes de avance sin tocarlos: swipe, cuentas,
  // botones de volumen, navegación y el botón de oración final.
  const previousRender=render;
  render=function(){
    const before=lastIndex;
    previousRender();
    lastIndex=state.index;
    if(!viewOpened || layer.hidden===false&&isAnimating)return;
    if(before<steps.length && state.index>=steps.length){
      closePouch();
    } else if(!layer.hidden) syncAppearance();
  };

  layer.hidden=false;
  syncAppearance();
  // El botón mantiene enfoque por teclado cuando el usuario lo solicite.
})();
