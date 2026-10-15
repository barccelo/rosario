/* Un solo rosario físico: la misma cadena sube por un costado y regresa
   por el otro, ligeramente detrás y en gris. Una sola cruz en el colgante. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const stage=document.querySelector('.rosary');
    if(!stage || !window.rosarioNativeScroll)return;
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='rosary-physical.css?v=20261015-8';
    document.head.append(css);

    const NS='http://www.w3.org/2000/svg';
    const HEIGHT=2670,TOP=54,MEDAL_Y=2104,CROSS_Y=2533;
    const FRONT_END=27;
    // La cuenta grande del nacimiento del aro es la misma del regreso.
    // El colgante contiene sólo CUATRO cuentas adicionales: tres pequeñas
    // y una grande cerca de la única cruz.
    const intro=[
      {key:'small-top',y:2190,r:17},
      {key:'small-middle',y:2251,r:17},
      {key:'small-bottom',y:2312,r:17},
      {key:'large-bottom',y:2390,r:23}
    ];
    const missionary=[
      ['#23845E','#23845E','#FFFFFF'],
      ['#BD3948','#BD3948','#FFFFFF'],
      ['#FAF9F6','#9BA19D','#37413C'],
      ['#365DAB','#365DAB','#FFFFFF'],
      ['#DEB82C','#D3AA22','#453816']
    ];
    state.rosaryViewLayout=state.rosaryViewLayout==='physical'?'physical':'vertical';
    // Opcional y DESACTIVADO por defecto; disponible en ambas vistas.
    state.screenTapNavigation=state.screenTapNavigation===true;

    const viewport=document.createElement('div');
    viewport.className='physical-scroll-viewport';
    viewport.setAttribute('aria-label','Rosario completo. Desliza por sus cuentas sin cambiar la oración.');
    const svg=document.createElementNS(NS,'svg');
    svg.classList.add('physical-path');
    svg.setAttribute('role','group');
    svg.setAttribute('aria-label','Un solo rosario: cinco decenas en un lazo y un colgante con una cruz.');
    svg.style.setProperty('--physical-path-height',HEIGHT+'px');
    viewport.append(svg);
    stage.append(viewport);

    let positions=[],introPoints=[],crossX=0;
    let beforeIndex=-1,beforeMode='';
    function format(n){return Number(n).toFixed(2);}
    function beadMarkup(x,y,r,attributes,label,number){
      return '<g class="physical-bead" role="button" tabindex="0" '+
        attributes+' aria-label="'+label+'">'+
        '<circle class="physical-hit" cx="'+format(x)+'" cy="'+format(y)+
        '" r="'+Math.max(29,r+8)+'"/>'+
        // Placa opaca: nunca deja pasar el hilo, aun si la cuenta es gris.
        '<circle class="physical-occluder" cx="'+format(x)+'" cy="'+format(y)+
        '" r="'+(r+3)+'"/>'+
        '<circle class="halo" cx="'+format(x)+'" cy="'+format(y)+
        '" r="'+(r+16)+'" fill="url(#physicalHalo)"/>'+
        '<circle class="ring" cx="'+format(x)+'" cy="'+format(y)+'" r="'+r+'"/>'+
        (number?'<text class="number" x="'+format(x)+'" y="'+format(y+4)+
          '" text-anchor="middle">'+number+'</text>':'')+
        '</g>';
    }
    function crossMarkup(x,y){
      return '<g class="physical-cross" role="button" tabindex="0" data-cross="only" '+
        'aria-label="Única cruz del rosario, al principio y al final" '+
        'transform="translate('+format(x)+' '+format(y)+')">'+
        '<circle cy="-54" r="7" fill="none" stroke="#B49663" stroke-width="3"/>'+
        '<path d="M-8 -46 Q-8 -49 -5 -49 H5 Q8 -49 8 -46 V-19 H29 Q32 -19 32 -16 '+
        'V-4 Q32 -1 29 -1 H8 V57 Q8 60 5 60 H-5 Q-8 60 -8 57 V-1 H-29 '+
        'Q-32 -1 -32 -4 V-16 Q-32 -19 -29 -19 H-8 Z"/>'+
        '<path class="cross-detail" d="M0 -39 V49 M-23 -10 H23"/></g>';
    }
    function draw(){
      const width=Math.max(320,document.documentElement.clientWidth);
      // La cadena permanece junto al borde izquierdo, sin invadir
      // el texto; hay espacio entre dos cuentas grandes.
      const railWidth=width*.42;
      const separation=Math.min(66,Math.max(56,railWidth-72));
      const center=Math.max(74,Math.min(88,railWidth-27-separation/2));
      const leftX=center-separation/2,rightX=center+separation/2;
      crossX=center;
      // 55 cuentas únicas. La primera es una sola cuenta grande,
      // compartida por el comienzo y el cierre de la quinta decena.
      // Las 27 siguientes ascienden; las otras 27 regresan por la derecha.
      const rise=(MEDAL_Y-(TOP+48))/FRONT_END;
      positions=Array.from({length:55},(_,i)=>{
        if(i===0)return{x:center,y:MEDAL_Y,strand:'junction'};
        if(i<=FRONT_END)
          return{x:leftX+2*Math.sin(i*.24),y:MEDAL_Y-i*rise,strand:'out'};
        return{
          x:rightX+2*Math.sin(i*.24),
          y:TOP+48+(i-FRONT_END-1)*rise,
          strand:'back'
        };
      });
      introPoints=intro.map((item,i)=>({
        x:center+2*Math.sin(i*.5),y:item.y,r:item.r
      }));
      svg.setAttribute('viewBox','0 0 '+width+' '+HEIGHT);
      const at=p=>format(p.x)+' '+format(p.y);
      // Tangentes Catmull–Rom pasadas a curvas cúbicas Bézier para que
      // los encuentros superior e inferior sean suaves, sin vértices.
      function curvedSegment(previous,from,to,next){
        const c1={x:from.x+(to.x-previous.x)/6,y:from.y+(to.y-previous.y)/6};
        const c2={x:to.x-(next.x-from.x)/6,y:to.y-(next.y-from.y)/6};
        return'M '+at(from)+' C '+at(c1)+' '+at(c2)+' '+at(to);
      }
      function topTurn(left,right){
        // Arco redondeado en la parte superior, no una línea recta.
        return'M '+at(left)+' C '+format(left.x)+' '+format(left.y-90)+
          ' '+format(right.x)+' '+format(right.y-90)+' '+at(right);
      }
      const body=[
        '<defs><radialGradient id="physicalHalo"><stop stop-color="#D8B66F" stop-opacity=".67"/>'+
        '<stop offset="1" stop-color="#D8B66F" stop-opacity="0"/></radialGradient></defs>'
      ];
      // La trayectoria es UN solo óvalo curvo y angosto. Sus segmentos
      // pueden colorearse de manera acumulativa, sin intercambiar ramas.
      let lines='<g class="physical-loop-links">';
      positions.forEach((from,i)=>{
        const previous=positions[(i+54)%55];
        const to=positions[(i+1)%55];
        const next=positions[(i+2)%55];
        lines+='<path class="physical-link physical-loop-link" data-link="'+i+
          '" d="'+(i===FRONT_END?topTurn(from,to):
            curvedSegment(previous,from,to,next))+'"/>';
      });
      lines+='</g>';
      body.push(lines);
      // Todos los hilos van detrás de todas las cuentas. Antes, la
      // cuerda del colgante atravesaba la cuenta grande compartida.
      let pendantWire='<g class="physical-pendant-links">';
      const tail=[positions[0],...introPoints,{x:center,y:CROSS_Y-54}];
      tail.slice(0,-1).forEach((from,i)=>{
        const previous=tail[Math.max(0,i-1)];
        const to=tail[i+1],next=tail[Math.min(tail.length-1,i+2)];
        pendantWire+='<path class="physical-link physical-intro-link" d="'+
          curvedSegment(previous,from,to,next)+'"/>';
      });
      body.push(pendantWire+'</g>');
      // Las cuentas del aro se dibujan una sola vez.
      let beads='<g class="physical-loop-beads">';
      positions.forEach((p,i)=>{
        const big=i%11===0;
        const n=i%11;
        const label=(big?'Padrenuestro':'Avemaría '+n)+
          ', misterio '+(Math.floor(i/11)+1);
        beads+=beadMarkup(p.x,p.y,big?23:17,
          'data-bead="'+i+'"',label,big?'':String(n));
      });
      beads+='</g>';
      body.push(beads);
      // El colgante arranca exactamente en la cuenta compartida, sin
      // medallón ni cuenta grande adicional.
      let pendant='<g class="physical-pendant">';
      introPoints.forEach((p,i)=>{
        pendant+=beadMarkup(p.x,p.y,p.r,'data-intro="'+i+'"',
          i<3?'Cuenta pequeña introductoria '+(i+1):
            'Cuenta grande junto a la cruz','');
      });
      pendant+=crossMarkup(center,CROSS_Y);
      body.push(pendant+'</g>');
      svg.innerHTML=body.join('');
      svg.querySelectorAll('[data-bead]').forEach(el=>{
        const index=Number(el.dataset.bead);
        const colors=missionary[Math.floor(index/11)];
        el.classList.add('is-decade');
        el.style.setProperty('--mission-color',colors[0]);
        el.style.setProperty('--mission-border',colors[1]);
        el.style.setProperty('--mission-text',colors[2]);
      });
    }
    draw();

    function positionFor(step){
      const firstMystery=steps.findIndex(item=>item.kind==='mystery');
      if(!step)return{type:'cross',phase:'finished',y:CROSS_Y,completed:55};
      // Mapeo litúrgico exacto: la Estación COMPLETA (tres ciclos con
      // sus invocaciones, padrenuestros, avemarías y glorias) permanece
      // en la cruz. El resto llega al aro sin inventar cuentas.
      if(firstMystery>=0 && state.index<firstMystery){
        if(step.title==='Comunión espiritual')
          return{type:'intro',phase:'opening',intro:3,
            y:introPoints[3].y,completed:0};
        if(step.title==='Señal de la cruz')
          return{type:'intro',phase:'opening',intro:2,
            y:introPoints[2].y,completed:0};
        if(step.title==='Señor mío Jesucristo')
          return{type:'intro',phase:'opening',intro:1,
            y:introPoints[1].y,completed:0};
        if(step.title==='Versículos iniciales' ||
           (step.title==='Gloria' && !step.stationNumber))
          return{type:'intro',phase:'opening',intro:0,
            y:introPoints[0].y,completed:0};
        // Toda la Estación al Santísimo Sacramento, incluyendo los
        // tres ciclos, se realiza en la única cruz.
        return{type:'cross',phase:'opening',y:CROSS_Y,completed:0};
      }
      // El Gloria del quinto misterio cierra el aro en la MISMA cuenta
      // grande con la que empezó. Las jaculatorias de esa decena
      // permanecen en esa cuenta antes de iniciar el colgante de regreso.
      if(step.m===4 && !Number.isInteger(step.bead) &&
         step.kind!=='mystery')
        return{type:'loop',bead:0,y:positions[0].y,
          strand:'junction',completed:55};
      if(step.m>=0 && step.m<5){
        const bead=Number.isInteger(step.bead) ? step.bead :
          step.kind==='mystery' ? step.m*11 :
            Math.min(54,(step.m+1)*11-1);
        return{type:'loop',bead,y:positions[bead].y,
          strand:positions[bead].strand,completed:bead+1};
      }
      // De vuelta al colgante, las tres pequeñas reciben las tres
      // Avemarías de dedicación. El resto de las oraciones finales
      // permanece en la grande inferior hasta la Salve, en la cruz.
      if(step.m>=5){
        if(Number.isInteger(step.dedication) && step.dedication>=0 &&
           step.dedication<3){
          const introIndex=step.dedication;
          return{type:'intro',phase:'closing',intro:introIndex,
            y:introPoints[introIndex].y,completed:55};
        }
        if(step.title==='Salve' ||
          (step.title==='Ruega por nosotros' &&
           steps[state.index-1]?.title==='Salve'))
          return{type:'cross',phase:'closing',y:CROSS_Y,completed:55};
        return{type:'intro',phase:'closing',intro:3,
          y:introPoints[3].y,completed:55};
      }
      return{type:'cross',phase:'opening',y:CROSS_Y,completed:0};
    }
    function paint(){
      const physical=state.rosaryViewLayout==='physical';
      document.body.classList.toggle('rosario-physical-view',physical);
      if(!physical){
        if(beforeMode==='physical'){
          const step=steps[state.index];
          const bead=step?.bead!==undefined?step.bead:
            !step||step.m>=5?54:step.m<0?0:
              Math.min(54,(step.m+1)*11-1);
          window.rosarioScrollToBead?.(bead,!step||step.m>=5);
        }
        beforeMode='vertical';beforeIndex=state.index;
        return;
      }
      const selected=positionFor(steps[state.index]);
      const completed=Math.max(0,Math.min(55,selected.completed||0));
      // El recorrido se acumula: el lado izquierdo NO se vuelve gris
      // al empezar la bajada por el derecho.
      svg.querySelectorAll('[data-bead]').forEach(el=>{
        const i=Number(el.dataset.bead);
        const already=i<completed;
        const active=selected.type==='loop' && selected.bead===i;
        el.classList.toggle('is-complete',already);
        el.classList.toggle('is-pending',!already);
        el.classList.toggle('active',active);
        el.setAttribute('aria-current',active?'step':'false');
      });
      svg.querySelectorAll('[data-link]').forEach(el=>{
        const i=Number(el.dataset.link);
        const traversed=i<completed;
        el.classList.toggle('is-complete',traversed);
        el.classList.toggle('is-pending',!traversed);
      });
      svg.querySelectorAll('[data-intro]').forEach(el=>{
        const i=Number(el.dataset.intro);
        const active=selected.type==='intro' && selected.intro===i;
        // Al regresar, las tres pequeñas y la grande inferior se
        // iluminan progresivamente, nunca se crean cuentas adicionales.
        const traversed=selected.phase==='closing' ?
          (selected.type==='cross'||(selected.type==='intro'&&i<=selected.intro))
          :selected.type==='loop'||(
            selected.phase==='opening'&&selected.type==='intro'&&i>=selected.intro);
        el.classList.toggle('is-complete',traversed);
        el.classList.toggle('is-pending',!traversed);
        el.classList.toggle('active',active);
        el.setAttribute('aria-current',active?'step':'false');
      });
      const cross=svg.querySelector('[data-cross]');
      const crossActive=selected.type==='cross';
      cross.classList.toggle('active',crossActive);
      cross.setAttribute('aria-current',crossActive?'step':'false');
      if(beforeMode!=='physical'||beforeIndex!==state.index){
        const max=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
        const target=Math.max(0,selected.y-viewport.clientHeight*.64);
        viewport.scrollTop=Math.min(max,target);
      }
      beforeMode='physical';beforeIndex=state.index;
    }
    function goToNode(el){
      if(el.hasAttribute('data-cross')){
        // Misma cruz: Estación al empezar y Salve al finalizar.
        const current=steps[state.index];
        const finalSalve=steps.findIndex(s=>s.title==='Salve' && s.m===5);
        state.index=current?.m>=5 && finalSalve>=0 ? finalSalve : 0;
      }else if(el.hasAttribute('data-bead')){
        const index=steps.findIndex(s=>s.bead===Number(el.dataset.bead));
        if(index<0)return;
        state.index=index;
      }else if(el.hasAttribute('data-intro')){
        const item=Number(el.dataset.intro);
        const closing=steps[state.index]?.m>=5;
        if(closing){
          if(item<3){
            const dedication=steps.findIndex(s=>s.m===5 &&
              s.dedication===item);
            if(dedication<0)return;
            state.index=dedication;
          }else{
            const afterDedications=steps.findIndex((s,i)=>
              s.m===5 && !Number.isInteger(s.dedication));
            if(afterDedications<0)return;
            state.index=afterDedications;
          }
        }else{
          const title=['Versículos iniciales','Señor mío Jesucristo',
            'Señal de la cruz','Comunión espiritual'][item];
          const index=steps.findIndex(s=>s.m===-1 && s.title===title);
          if(index<0)return;
          state.index=index;
        }
      }
      render();
    }
    svg.addEventListener('click',event=>{
      const bead=event.target.closest('[data-cross],[data-bead],[data-intro]');
      if(bead&&!bead.closest('.is-rear'))goToNode(bead);
    });
    svg.addEventListener('keydown',event=>{
      if(event.key!=='Enter' && event.key!==' ')return;
      const bead=event.target.closest('[data-cross],[data-bead],[data-intro]');
      if(bead&&!bead.closest('.is-rear')){
        event.preventDefault();goToNode(bead);
      }
    });
    // Navegación por mitades. No intercepta deslizamientos, pulsaciones
    // sobre cuentas, lectura, botones, menús ni el scroll cinético.
    // Se instala sobre el documento, pero sólo actúa dentro del rosario.
    let tapStart=null,lastChainScroll=0;
    for(const pane of [viewport,window.rosarioNativeScroll]){
      pane?.addEventListener('scroll',()=>{
        lastChainScroll=performance.now();
      },{passive:true});
    }
    function isFreeBackground(target){
      if(!(target instanceof Element)||!target.closest('.rosary'))return false;
      if(target.closest('button,a,input,select,textarea,[contenteditable],'+
        '[role="button"],[role="link"],.physical-bead,.physical-cross,'+
        '.focus-bead,.rosary-cross,.chain-bead,.top-controls,'+
        '.controls-dot,.meditation-tools,.rosary-mystery-context,'+
        '.mystery-announcement-link'))return false;
      // La zona vacía alrededor del texto sí admite toques; el texto,
      // sus renglones y las ayudas de lectura nunca los activan.
      const reader=target.closest('.immersive-prayer');
      if(reader && target!==reader)return false;
      if(target.closest('.reading-prayer-heading,'+
        '.rosary-mystery-context,.meditation-full'))return false;
      return true;
    }
    document.addEventListener('pointerdown',event=>{
      tapStart=null;
      if(!state.screenTapNavigation||$('modal').open ||
         event.button!==0||!event.isPrimary||
         !isFreeBackground(event.target))return;
      tapStart={pointer:event.pointerId,x:event.clientX,y:event.clientY,
        started:performance.now()};
    },true);
    document.addEventListener('pointerup',event=>{
      const data=tapStart;
      tapStart=null;
      if(!data||!state.screenTapNavigation||
         event.pointerId!==data.pointer||$('modal').open||
         !isFreeBackground(event.target))return;
      if(Math.hypot(event.clientX-data.x,event.clientY-data.y)>12||
         performance.now()-data.started>650||
         performance.now()-lastChainScroll<250||
         window.getSelection?.()?.toString())return;
      // Se divide la ventana real, no el documento desplazable.
      if(event.clientY<window.innerHeight/2)
        state.index=Math.max(0,state.index-1),render();
      else advance();
    },true);
    for(const cancel of ['pointercancel','lostpointercapture'])
      document.addEventListener(cancel,()=>{tapStart=null;},true);

    const originalRender=render;
    render=function(){originalRender();paint();};
    const originalSettings=$('settings').onclick;
    $('settings').onclick=function(event){
      originalSettings.call(this,event);
      const host=$('modalContent');
      if(!host.querySelector('#groupSelect'))return;
      const field=document.createElement('fieldset');
      field.className='physical-layout-settings';
      const legend=document.createElement('legend');
      legend.textContent='Presentación del rosario';
      const list=document.createElement('div');
      list.className='physical-layout-options';
      [
        {id:'vertical',name:'Vista vertical',
          help:'Conserva el diseño anterior, con sus gestos y funciones.'},
        {id:'physical',name:'Rosario físico · experimental',
          help:'Una cruz; una cuenta grande compartida, tres pequeñas y una grande inferior. El color progresa por ambas ramas.'}
      ].forEach(item=>{
        const label=document.createElement('label');
        label.className='physical-layout-option';
        const input=document.createElement('input');
        input.type='radio';
        input.name='rosaryViewLayout';
        input.value=item.id;
        input.checked=state.rosaryViewLayout===item.id;
        const content=document.createElement('span');
        const title=document.createElement('strong');
        title.textContent=item.name;
        const small=document.createElement('small');
        small.textContent=item.help;
        content.append(title,small);
        label.append(input,content);
        label.classList.toggle('selected',input.checked);
        input.onchange=()=>{
          if(!input.checked)return;
          state.rosaryViewLayout=item.id;
          persist();render();
          host.querySelectorAll('.physical-layout-option').forEach(row=>
            row.classList.toggle('selected',row.querySelector('input').checked));
        };
        list.append(label);
      });
      const hint=document.createElement('p');
      hint.className='physical-layout-hint';
      hint.textContent='En el lado izquierdo, desliza el dedo de arriba hacia abajo para subir a la curva superior. En el lado derecho, de abajo hacia arriba para bajar. La cadena utiliza la inercia nativa del navegador.';
      field.append(legend,list,hint);
      const tapField=document.createElement('fieldset');
      tapField.className='physical-layout-settings physical-tap-settings';
      const tapLegend=document.createElement('legend');
      tapLegend.textContent='Navegación por toques';
      const tapLabel=document.createElement('label');
      tapLabel.className='physical-tap-option';
      const toggle=document.createElement('input');
      toggle.type='checkbox';toggle.checked=state.screenTapNavigation;
      toggle.setAttribute('aria-label','Activar navegación por toques en las mitades de la pantalla');
      const tapTitle=document.createElement('span');
      tapTitle.textContent='Avanzar o retroceder tocando el fondo';
      tapLabel.append(tapTitle,toggle);
      const tapHint=document.createElement('p');
      tapHint.className='physical-layout-hint';
      tapHint.textContent='Mitad superior: oración anterior. Mitad inferior: siguiente oración. No se activará sobre el texto, cuentas, controles ni durante un deslizamiento.';
      tapField.append(tapLegend,tapLabel,tapHint);
      toggle.onchange=()=>{
        state.screenTapNavigation=toggle.checked;
        persist();
      };
      const controls=host.querySelector('.controls-position-setting');
      if(controls){
        host.insertBefore(field,controls);
        host.insertBefore(tapField,controls);
      }else host.append(field,tapField);
    };
    window.addEventListener('resize',()=>{
      if(state.rosaryViewLayout!=='physical')return;
      draw();
      beforeIndex=-1;
      paint();
    });
    paint();
  });
})();
