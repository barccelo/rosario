/* Recorrido visual de primer uso: usa las preferencias reales del Rosario. */
(() => {
  'use strict';
  const pages = [
    {title:'Elige cómo quieres verlo',detail:'Prueba ambos temas. El Rosario y las oraciones cambiarán al instante.'},
    {title:'Los colores del Rosario',detail:'Las cuentas pueden conservar el diseño clásico, recorrer los cinco continentes o cambiar según el misterio.'},
    {title:'Sentido del deslizamiento',detail:'Mira cómo se mueve el dedo en cada lado del Rosario. Elige el recorrido que te resulte natural.'},
    {title:'Vibración al avanzar',detail:'Una señal táctil confirma cada avance. También puedes rezar sin vibración.'},
    {title:'Avanzar tocando la pantalla',detail:'Elige si quieres navegar con un toque, además de los gestos y las cuentas.'},
    {title:'Acto de contrición',detail:'Escoge la oración que prefieres utilizar. Las dos se pueden cambiar después.'},
    {title:'Conoce los controles',detail:'Toca los botones de esta demostración para descubrir su función.'}
  ];
  const icon = {
    settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2.5h4l.6 2.3 2 1.1 2.3-.7 2 3.5-1.7 1.7v2.3l1.7 1.7-2 3.5-2.3-.7-2 1.1-.6 2.3h-4l-.6-2.3-2-1.1-2.3.7-2-3.5 1.7-1.7v-2.3L3.1 8.7l2-3.5 2.3.7 2-1.1z"/>',
    full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
    nav:'<rect x="4" y="4" width="7" height="7" rx="1.4"/><rect x="13" y="4" width="7" height="7" rx="1.4"/><rect x="4" y="13" width="7" height="7" rx="1.4"/><rect x="13" y="13" width="7" height="7" rx="1.4"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7"/>'
  };
  const svg = paths => '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+paths+'</svg>';
  const rosary = () => '<div class="onb-chain" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>';
  function choice(value,title,visual,description,selected) {
    return '<button type="button" class="onb-choice'+(selected?' is-selected':'')+'" data-value="'+value+'" aria-pressed="'+String(selected)+'">'+
      '<span class="onb-choice-visual">'+visual+'</span>'+
      '<span class="onb-choice-copy"><strong>'+title+'</strong><small>'+description+'</small></span>'+
      '<span class="onb-choice-check" aria-hidden="true">'+svg(icon.check)+'</span></button>';
  }
  function swipeGraphic(directions) {
    const strand = (dir,label) => '<span class="onb-swipe-half"><small>'+label+'</small>'+
      '<svg viewBox="0 0 74 76" aria-hidden="true"><path class="onb-swipe-thread" d="M16 9C16 2 58 2 58 9M16 9V70M58 9V70"/>'+
      '<circle class="onb-swipe-bead" cx="'+(label==='Primer lado'?'16':'58')+'" cy="32" r="8"/>'+
      '<circle class="onb-swipe-bead" cx="'+(label==='Primer lado'?'16':'58')+'" cy="54" r="8"/>'+
      '<path class="onb-swipe-arrow" d="'+(dir==='up'?'M37 62V16M27 26l10-10 10 10':'M37 16V62M27 52l10 10 10-10')+'"/></svg>'+
      '<span class="onb-direction">'+(dir==='up'?'Hacia arriba':'Hacia abajo')+'</span></span>';
    return '<span class="onb-swipe-pair">'+strand(directions[0],'Primer lado')+
      strand(directions[1],'Tras el arco')+'</span>';
  }
  function setPreference(page,value) {
    if(page===0)state.dark=value==='dark';
    if(page===1)state.rosaryColorMode=value;
    if(page===2)state.rosarySwipeMode=value;
    if(page===3)state.haptics=value==='yes';
    if(page===4)state.screenTapNavigation=value==='yes';
    if(page===5){
      window.rosarioSetContrition?.(value);
      return;
    }
    persist();
    if(page===0||page===1||page===4)render();
    if(page===3&&value==='yes')window.rosarioPreviewHapticPattern?.('normal');
  }
  function savedValue(page) {
    return [
      state.dark?'dark':'light',
      state.rosaryColorMode||'classic',
      state.rosarySwipeMode||'follow',
      state.haptics!==false?'yes':'no',
      state.screenTapNavigation===true?'yes':'no',
      state.contritionVersion||'jesucristo'
    ][page];
  }
  function contentFor(page) {
    const selected=savedValue(page);
    if(page===0){
      const scene = (dark) => '<span class="onb-theme-scene '+(dark?'onb-theme-dark':'onb-theme-light')+'">'+rosary()+
        '<span class="onb-theme-reading"><i></i><i></i><i></i></span></span>';
      return '<div class="onb-choices onb-themes">'+choice('light','Claro',scene(false),'Fondo luminoso',selected==='light')+
        choice('dark','Oscuro',scene(true),'Fondo profundo',selected==='dark')+'</div>';
    }
    if(page===1){
      const beads = colors => '<span class="onb-palette">'+colors.map(color=>'<i style="--preview-bead:'+color+'"></i>').join('')+'</span>';
      return '<div class="onb-choices">'+
        choice('classic','Clásico',beads(['#B99557','#B99557','#B99557','#B99557','#B99557']),'Un mismo estilo durante todo el Rosario',selected==='classic')+
        choice('missionary','Misionero',beads(['#68A6DD','#E7CB64','#C85C58','#84A87C','#F6EEE0']),'Cinco colores, una intención universal',selected==='missionary')+
        choice('mystery','Según los misterios',beads(['#9775B9','#D9BD66','#71B8D9','#DFE2DC']),'Colores correspondientes al día y misterio',selected==='mystery')+'</div>';
    }
    if(page===2){
      return '<div class="onb-choices onb-swipes">'+
        choice('follow','Según el recorrido',swipeGraphic(['down','up']),'El gesto se invierte después del arco',selected==='follow')+
        choice('uniform','Siempre hacia arriba',swipeGraphic(['up','up']),'El mismo gesto en ambos lados',selected==='uniform')+
        choice('down','Siempre hacia abajo',swipeGraphic(['down','down']),'El mismo gesto hacia abajo',selected==='down')+'</div>';
    }
    if(page===3){
      const pulses = '<span class="onb-vibration-preview"><span class="onb-pulse-ring"></span><span class="onb-pulse-bead"></span><span class="onb-pulse-ring"></span></span>';
      return '<div class="onb-choices onb-two">'+choice('yes','Con vibración',pulses,'Una respuesta táctil al avanzar',selected==='yes')+
        choice('no','Sin vibración','<span class="onb-no-vibration">'+rosary()+'</span>','Recorrido silencioso',selected==='no')+
        '</div><button type="button" class="onb-demo-action" id="onbTestVibration">Probar una vibración</button>';
    }
    if(page===4){
      return '<div class="onb-tap-demo" aria-label="Demostración de las zonas táctiles">'+
        '<button type="button" data-demotap="previous" class="onb-tap-half onb-tap-prev"><span>Mitad superior</span>'+
          '<strong>↑ Anterior</strong><small>Toca aquí para probar</small></button>'+
        '<button type="button" data-demotap="next" class="onb-tap-half onb-tap-next"><span>Mitad inferior</span>'+
          '<strong>↓ Siguiente</strong><small>Toca aquí para probar</small></button>'+
        '<p class="onb-tap-feedback" id="onbTapFeedback" aria-live="polite">Prueba las dos mitades.</p></div>'+
        '<div class="onb-choices onb-two">'+
        choice('yes','Activar toques',svg('<path d="M12 3v11m0 0-4-4m4 4 4-4M5 18h14"/>'),'Puedes tocar incluso las oraciones',selected==='yes')+
        choice('no','Solo gestos y cuentas',svg('<path d="M5 12h14M12 5l7 7-7 7"/>'),'El toque no cambia de oración',selected==='no')+'</div>';
    }
    if(page===5){
      const sources=[
        ['jesucristo','Señor mío Jesucristo','Señor mío Jesucristo, Dios y hombre verdadero…'],
        ['redentor','Jesús, mi Señor y Redentor','Jesús, mi Señor y Redentor, yo me arrepiento…']
      ];
      return '<div class="onb-choices">'+sources.map(a=>choice(a[0],a[1],
        '<span class="onb-prayer-paper"><span class="onb-prayer-cross">✝</span><em>'+a[2]+'</em></span>',
        a[0]==='jesucristo'?'Fórmula tradicional':'Fórmula alternativa',selected===a[0])).join('')+'</div>';
    }
    const buttons = [
      ['settings','Ajustes','Personaliza el Rosario y su apariencia.'],
      ['full','Pantalla completa','Oculta las barras para tener más espacio.'],
      ['minus','Reducir texto','Disminuye el tamaño de las oraciones.'],
      ['plus','Ampliar texto','Aumenta el tamaño de las oraciones.'],
      ['nav','Navegación','Salta a días, misterios y oraciones.'],
      ['dot','Botón de navegación','Muestra los controles compactados.']
    ];
    const glyph=key=>key==='plus'?'A+':key==='minus'?'A−':key==='dot'?'<span class="onb-small-dot"></span>':svg(icon[key]);
    return '<div class="onb-control-preview"><div class="onb-control-toolbar">'+
      buttons.map(a=>'<button type="button" class="onb-control-button" data-demo-control="'+a[0]+'" aria-label="'+a[1]+'">'+glyph(a[0])+'</button>').join('')+
      '</div><div class="onb-control-reading" id="onbControlReading">Dios te salve, María, llena eres de gracia.</div>'+
      '<div class="onb-control-feedback" id="onbControlFeedback" aria-live="polite">Toca un control para ver lo que hace.</div></div>'+
      '<div class="onb-control-key">'+buttons.map(a=>'<div><strong>'+a[1]+'</strong><span>'+a[2]+'</span></div>').join('')+'</div>';
  }
  window.rosarioShowOnboarding=function(){
    const modal=document.getElementById('modal');
    if(!modal)return;
    let page=0;
    let zoom=0;
    const finish=()=>{
      state.rosarioFirstRunDone=true;
      persist();
      modal.close();
    };
    // Cerrar o pulsar Atrás equivale a omitir el recorrido, pero no
    // descarta las preferencias que ya se hayan elegido.
    function onClose(){
      state.rosarioFirstRunDone=true;
      persist();
      modal.removeEventListener('close',onClose);
    }
    modal.addEventListener('close',onClose,{once:true});
    delete modal.dataset.rosarioSettingsLevel;
    window.rosarioUpdateBackLabel?.();
    show('<div class="rosario-onboarding-wizard" id="rosarioOnboarding"></div>');
    const host=document.getElementById('rosarioOnboarding');
    function draw(){
      const data=pages[page];
      host.innerHTML='<div class="onb-upper"><span class="onb-eyebrow">CONFIGURACIÓN INICIAL</span>'+
        '<button type="button" class="onb-skip-all" id="onbSkipAll">Omitir todo</button></div>'+
        '<div class="onb-progress" role="progressbar" aria-label="Progreso de la configuración" aria-valuemin="1" aria-valuemax="'+pages.length+'" aria-valuenow="'+(page+1)+'">'+
          pages.map((a,i)=>'<span class="'+(i<=page?'is-active':'')+'"></span>').join('')+'</div>'+
        '<div class="onb-step-number">PASO '+(page+1)+' DE '+pages.length+'</div>'+
        '<h2>'+data.title+'</h2><p class="onb-description">'+data.detail+'</p>'+
        '<div class="onb-content">'+contentFor(page)+'</div>'+
        '<div class="onb-actions">'+
        (page>0?'<button type="button" class="onb-back" id="onbBack">← Anterior</button>':'')+
        '<button type="button" class="onb-skip" id="onbSkip">Omitir este paso</button>'+
        '<button type="button" class="onb-next" id="onbNext">'+(page===pages.length-1?'Comenzar':'Continuar →')+'</button></div>';
      host.querySelector('#onbSkipAll').onclick=finish;
      const back=host.querySelector('#onbBack');
      if(back)back.onclick=()=>{page--;draw();};
      host.querySelector('#onbSkip').onclick=()=>{
        if(page===pages.length-1)finish();
        else{page++;draw();}
      };
      host.querySelector('#onbNext').onclick=()=>{
        if(page===pages.length-1)finish();
        else{page++;draw();}
      };
      host.querySelectorAll('button[data-value]').forEach(button=>{
        button.onclick=()=>{setPreference(page,button.dataset.value);draw();};
      });
      host.querySelector('#onbTestVibration')?.addEventListener('click',()=>window.rosarioPreviewHapticPattern?.('normal'));
      host.querySelectorAll('button[data-demotap]').forEach(button=>{
        button.onclick=()=>{
          const feedback=host.querySelector('#onbTapFeedback');
          feedback.textContent=button.dataset.demotap==='previous'?
            'Retrocede a la oración anterior.':'Avanza a la oración siguiente.';
          host.querySelectorAll('.onb-tap-half').forEach(item=>
            item.classList.toggle('is-pressed',item===button));
        };
      });
      host.querySelectorAll('button[data-demo-control]').forEach(button=>{
        button.onclick=()=>{
          const key=button.dataset.demoControl;
          const descriptions={
            settings:'Ajustes · Modifica los colores, gestos y oraciones.',
            full:'Pantalla completa · Amplía el área del Rosario.',
            plus:'Texto ampliado · La oración se lee más grande.',
            minus:'Texto reducido · La oración ocupa menos espacio.',
            nav:'Navegación · Abre el índice de días, misterios y oraciones.',
            dot:'Control compacto · Vuelve a mostrar los botones ocultos.'
          };
          const reading=host.querySelector('#onbControlReading');
          const container=host.querySelector('.onb-control-preview');
          if(key==='plus')zoom=Math.min(2,zoom+1);
          if(key==='minus')zoom=Math.max(-1,zoom-1);
          reading.style.fontSize=(17+zoom*3)+'px';
          container.classList.toggle('is-expanded',key==='full'?!container.classList.contains('is-expanded'):container.classList.contains('is-expanded'));
          host.querySelector('#onbControlFeedback').textContent=descriptions[key];
          host.querySelectorAll('[data-demo-control]').forEach(b=>
            b.classList.toggle('is-current',b===button));
        };
      });
      modal.scrollTop=0;
    }
    draw();
  };
})();