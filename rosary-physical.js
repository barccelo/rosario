/* Un solo rosario físico: la misma cadena sube por un costado y regresa
   por el otro, ligeramente detrás y en gris. Una sola cruz en el colgante. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const stage=document.querySelector('.rosary');
    if(!stage || !window.rosarioNativeScroll)return;
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='rosary-physical.css?v=20261016-14';
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
    state.rosaryViewLayout=state.rosaryViewLayout==='vertical'?'vertical':'physical';
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
    let lastDrawWidth=0;
    let beforeIndex=-1,beforeMode='';
    let lastPhysicalType=null;
    let lastPhysicalBead=-1;
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
    // Se reutiliza EXACTAMENTE la cruz de la vista vertical, incluyendo
    // su tamaño, forma, trazos y detalles, sin construir otra ilustración.
    // El degradado original se recrea con ID local a este SVG.
    function crossMarkup(x,y){
      const original=chain.querySelector('.rosary-cross');
      if(!original)return '';
      const copy=original.cloneNode(true);
      copy.classList.remove('rosary-cross');
      copy.classList.add('physical-cross');
      copy.setAttribute('data-cross','only');
      copy.setAttribute('tabindex','0');
      copy.setAttribute('role','button');
      copy.setAttribute('aria-label','Única cruz del rosario, al comienzo y al final');
      // En la original, la argolla está a +7 y el cuerpo entre +14 y +97.
      // La argolla del colgante físico se une a CROSS_Y-54.
      copy.setAttribute('transform','translate('+format(x)+' '+format(y-61)+')');
      const body=copy.querySelector('path[fill="url(#crossGold)"]');
      if(body)body.setAttribute('fill','url(#physicalCrossGold)');
      return copy.outerHTML;
    }
    function draw(){
      lastDrawWidth=stage.getBoundingClientRect().width;
      const width=Math.max(320,document.documentElement.clientWidth);
      // La cadena permanece junto al borde izquierdo, sin invadir
      // el texto; hay espacio entre dos cuentas grandes.
      const railWidth=Math.max(120,stage.getBoundingClientRect().width*.42);
      const separation=Math.min(66,Math.max(56,railWidth-72));
      const center=Math.max(68,Math.min(88,railWidth-separation/2-35));
      const leftX=center-separation/2,rightX=center+separation/2;
      crossX=center;
      // Ramas verticales paralelas, cuenta de unión centrada como antes.
      // No hay variaciones en X al avanzar o desplazar.
      const rise=(MEDAL_Y-(TOP+48))/FRONT_END;
      positions=Array.from({length:55},(_,i)=>{
        if(i===0)return{x:center,y:MEDAL_Y,strand:'junction'};
        if(i<=FRONT_END){
          return{x:leftX,y:MEDAL_Y-i*rise,strand:'out'};
        }
        const n=i-FRONT_END-1;
        return{x:rightX,y:TOP+48+n*rise-18*n/26,strand:'back'};
      });
      introPoints=intro.map((item,i)=>({x:center+3.5*Math.sin(i*.9+.4),y:item.y,r:item.r}));
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
      // Una sola curva inferior como en la vuelta superior, pero con la
      // cuenta grande existente en su punto de unión. Se parte la misma
      // Bézier cúbica en dos MITADES EXACTAS para conservar data-link 54/0:
      // los dos hilos coinciden en posición y tangente en la cuenta grande.
      // No se mueve ninguna cuenta ni cambia el contenedor al hacer swipe.
      function bottomTurn(right,shared,left){
        const delta=left.y-right.y;
        const total=(8*shared.y-right.y-left.y)/3;
        const c1={x:right.x,y:(total-delta)/2};
        const c2={x:left.x,y:(total+delta)/2};
        const mid=(a,b)=>({x:(a.x+b.x)/2,y:(a.y+b.y)/2});
        const a=mid(right,c1),b=mid(c1,c2),d=mid(c2,left);
        const e=mid(a,b),f=mid(b,d),m=mid(e,f);
        return [
          'M '+at(right)+' C '+at(a)+' '+at(e)+' '+at(m),
          'M '+at(m)+' C '+at(f)+' '+at(d)+' '+at(left)
        ];
      }
      const lowerTurn=bottomTurn(positions[54],positions[0],positions[1]);
      const body=[
        '<defs><radialGradient id="physicalHalo"><stop stop-color="#D8B66F" stop-opacity=".67"/>'+
        '<stop offset="1" stop-color="#D8B66F" stop-opacity="0"/></radialGradient>'+
        '<linearGradient id="physicalCrossGold" x1="0" y1="0" x2="1" y2="1">'+
        '<stop stop-color="#f3e3bc"/><stop offset=".45" stop-color="#bd9657"/>'+
        '<stop offset=".7" stop-color="#e1c58d"/><stop offset="1" stop-color="#96713f"/>'+
        '</linearGradient>'+
        // Reflejos diminutos y trenzado diagonal, sin imagen externa
        // ni filtros de ruido costosos para Android.
        '<pattern id="physicalCordThreads" patternUnits="userSpaceOnUse" width="6" height="8">'+
        '<path d="M-1 3 L3 -1 M2 9 L8 3" stroke="#F3DFA9" stroke-width=".85" opacity=".78" fill="none"/>'+
        '<path d="M-1 6 L4 1 M4 9 L8 5" stroke="#7B5B2E" stroke-width=".50" opacity=".50" fill="none"/>'+
        '</pattern></defs>'
      ];
      // La trayectoria es UN solo óvalo curvo y angosto. Sus segmentos
      // pueden colorearse de manera acumulativa, sin intercambiar ramas.
      let lines='<g class="physical-loop-links">';
      positions.forEach((from,i)=>{
        const previous=positions[(i+54)%55];
        const to=positions[(i+1)%55];
        const next=positions[(i+2)%55];
        const d=i===FRONT_END?topTurn(from,to):
          i===54?lowerTurn[0]:
          i===0?lowerTurn[1]:
          curvedSegment(previous,from,to,next);
        lines+='<path fill="none" class="physical-link physical-loop-link" data-link="'+i+
          '" d="'+d+'"/>'+
          '<path fill="none" class="physical-cord-grain" aria-hidden="true" d="'+d+'"/>';
      });
      lines+='</g>';
      body.push(lines);
      // Todos los hilos van detrás de todas las cuentas. Antes, la
      // cuerda del colgante atravesaba la cuenta grande compartida.
      let pendantWire='<g class="physical-pendant-links">';
      const tail=[positions[0],...introPoints,{x:center,y:CROSS_Y-63}];
      tail.slice(0,-1).forEach((from,i)=>{
        const previous=tail[Math.max(0,i-1)];
        const to=tail[i+1],next=tail[Math.min(tail.length-1,i+2)];
        const d=curvedSegment(previous,from,to,next);
        pendantWire+='<path fill="none" class="physical-link physical-intro-link" d="'+d+'"/>'+
          '<path fill="none" class="physical-cord-grain" aria-hidden="true" d="'+d+'"/>';
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
      // Remate metálico discreto: sujeta el extremo de la cuerda y
      // queda parcialmente oculto detrás de la argolla original.
      pendant+='<rect class="physical-cross-ferrule" x="'+format(center-2.7)+
        '" y="'+format(CROSS_Y-69)+
        '" width="5.4" height="9" rx="2" fill="#B89A66"'+
        ' stroke="#927344" stroke-width=".7" pointer-events="none"/>';
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

    // Antes del giro del aro el avance sigue el gesto hacia ABAJO.
    // Exactamente en la primera cuenta del lado derecho (n.º 28),
    // el avance cambia al gesto hacia ARRIBA y sigue así hasta la cruz.
    // Las oraciones introductorias y los cierres de cada misterio
    // heredan la dirección de su cuenta correspondiente.
    function physicalSwipeDown(){
      if(state.rosaryViewLayout!=='physical')return false;
      const step=steps[state.index];
      if(!step)return false;
      if(step.m<0)return true;
      if(step.m>=5)return false;
      if(Number.isInteger(step.bead))
        return step.bead<=FRONT_END;
      const previous=steps.slice(0,state.index+1).reverse().find(
        s=>Number.isInteger(s.bead));
      if(previous)return previous.bead<=FRONT_END;
      return step.m<2;
    }
    window.rosarioPhysicalSwipeDown=physicalSwipeDown;

    // IMPORTANTE: el panel izquierdo es únicamente un desplazamiento
    // inercial nativo del rosario. Nunca avanza ni retrocede oraciones
    // al soltar un swipe. La dirección contextual se conserva sólo en
    // los gestos de navegación del texto, gestionados por immersive.js.

    function positionFor(step){
      const firstMystery=steps.findIndex(item=>item.kind==='mystery');
      if(!step)return{type:'cross',phase:'closing',y:CROSS_Y,completed:55};
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
        lastPhysicalType=null;
        lastPhysicalBead=-1;
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
        // Las cuentas del colgante no pierden su color cuando
        // la oración pasa del aro a las invocaciones finales.
        const traversed=selected.phase==='closing'||selected.type==='loop'||
          (selected.phase==='opening'&&selected.type==='intro'&&i>=selected.intro);
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
        // El dedo sigue usando exactamente el scroll nativo existente.
        // Sólo el avance AUTOMÁTICO de una oración aplica esta política.
        // Antes se recentraba cada cuenta al 64 % de la pantalla,
        // desplazando el giro inferior unos 75 px POR CADA ORACIÓN.
        // Eso producía la apertura/cierre progresivos al pasar de la
        // grande a 1–5 y desde las últimas pequeñas de regreso.
        //
        // Si la cuenta siguiente YA ES VISIBLE, no mover el rosario.
        // Sólo desplazar lo estrictamente necesario si sale del marco.
        const height=viewport.clientHeight;
        const max=Math.max(0,viewport.scrollHeight-height);
        const nearJunction=selected.type==='loop' &&
          (selected.bead<=5||selected.bead>=50);
        const cameFromPendant=lastPhysicalType!=='loop';
        const firstPhysical=beforeMode!=='physical';
        let target=viewport.scrollTop;
        if(firstPhysical || (nearJunction && cameFromPendant)){
          // Al entrar en el aro, dejar visible la cuenta grande y las
          // primeras cinco pequeñas, sin recentrar tras cada avance.
          // Al abrir la vista directamente en las últimas cinco,
          // también deben quedar visibles la seleccionada y la grande.
          target=nearJunction && height>=455
            ? MEDAL_Y-height*(selected.bead>=50?.94:.87)
            : selected.y-height*.64;
        }else if(selected.type==='loop' && height>=455 &&
          selected.bead>=44 && selected.bead<=49 &&
          lastPhysicalBead===selected.bead-1){
          // Preparar la vuelta inferior ANTES de las últimas cinco
          // cuentas. El seguimiento llega gradualmente a una posición
          // desde la que 50–54 y la cuenta grande caben en pantalla.
          // No se mueve ninguna cuenta aparte del scroll estándar.
          const amount=(selected.bead-44)/5;
          const focusRatio=.64-(.64-.12)*amount;
          target=selected.y-height*focusRatio;
        }else if(selected.type==='loop' && height>=455 &&
          selected.bead===50 && lastPhysicalBead===49){
          // Últimas cinco: encuadrar UNA vez el giro inferior y luego
          // dejarlo quieto mientras la selección avanza hasta 54.
          target=MEDAL_Y-height*.94;
        }else{
          const radius=selected.type==='loop' &&
            selected.bead%11===0?23:17;
          const padding=Math.max(16,Math.min(32,height*.055));
          const top=padding+radius;
          const bottom=height-padding-radius;
          const screenY=selected.y-viewport.scrollTop;
          if(screenY<top)target=selected.y-top;
          else if(screenY>bottom)target=selected.y-bottom;
        }
        // Asignación directa; no hay interpolación, escala, deformación
        // de ramas, ni transformaciones sobre el SVG o las cuentas.
        if(Math.abs(target-viewport.scrollTop)>0.5){
          viewport.scrollTop=Math.max(0,Math.min(max,target));
        }
      }
      lastPhysicalType=selected.type;
      lastPhysicalBead=selected.type==='loop'?selected.bead:-1;
      beforeMode='physical';beforeIndex=state.index;
    }
    function goToNode(el){
      let destination=-1;
      if(el.hasAttribute('data-cross')){
        // Misma cruz: Estación al empezar y Salve al finalizar.
        const current=steps[state.index];
        const finalSalve=steps.findIndex(s=>s.title==='Salve' && s.m===5);
        destination=current?.m>=5 && finalSalve>=0 ? finalSalve : 0;
      }else if(el.hasAttribute('data-bead')){
        const index=steps.findIndex(s=>s.bead===Number(el.dataset.bead));
        if(index<0)return;
        destination=index;
      }else if(el.hasAttribute('data-intro')){
        const item=Number(el.dataset.intro);
        const closing=steps[state.index]?.m>=5;
        if(closing){
          if(item<3){
            const dedication=steps.findIndex(s=>s.m===5 &&
              s.dedication===item);
            if(dedication<0)return;
            destination=dedication;
          }else{
            const afterDedications=steps.findIndex((s,i)=>
              s.m===5 && !Number.isInteger(s.dedication));
            if(afterDedications<0)return;
            destination=afterDedications;
          }
        }else{
          const title=['Versículos iniciales','Señor mío Jesucristo',
            'Señal de la cruz','Comunión espiritual'][item];
          const index=steps.findIndex(s=>s.m===-1 && s.title===title);
          if(index<0)return;
          destination=index;
        }
      }
      // Igual que en la vista vertical: confirmar cualquier salto a
      // otra cuenta antes de modificar el progreso del rosario.
      if(destination>=0)pick(destination);
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
        {id:'vertical',name:'Vista vertical'},
        {id:'physical',name:'Rosario completo'}
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
        content.append(title);
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
      field.append(legend,list);
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
      tapHint.textContent='Arriba: anterior · Abajo: siguiente.';
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
    // Cambios de altura (barras del sistema, scroll nativo) NO deben
    // regenerar la cadena ni alterar la posición actual de las cuentas.
    window.addEventListener('resize',()=>{
      if(state.rosaryViewLayout!=='physical')return;
      if(Math.abs(stage.getBoundingClientRect().width-lastDrawWidth)<2)return;
      const previousScroll=viewport.scrollTop;
      draw();
      viewport.scrollTop=previousScroll;
      beforeIndex=state.index;
      paint();
    });
    paint();
  });
})();
