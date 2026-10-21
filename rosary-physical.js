/* Un solo rosario físico: la misma cadena sube por un costado y regresa
   por el otro, ligeramente detrás y en gris. Una sola cruz en el colgante. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const stage=document.querySelector('.rosary');
    if(!stage || !window.rosarioNativeScroll)return;
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='rosary-physical.css?v=20261017-1';
    // El visor se coloca al final después de que este CSS haya cargado.
    // Antes de ello scrollHeight/clientHeight puede dar cero y dejar
    // el rosario incorrectamente posicionado en el arco superior.
    css.addEventListener('load',()=>{
      requestAnimationFrame(restoreInitialFrame);
    });
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
    state.rosarySide=state.rosarySide==='right'?'right':'left';
    state.rosarySwipeMode=['follow','uniform','down'].includes(state.rosarySwipeMode)?state.rosarySwipeMode:'follow';
    // La cuerda varía automáticamente cada día; no requiere preferencia.
    window.rosarioSetSide=side=>{
      state.rosarySide=side==='right'?'right':'left';
      persist();render();
    };
    // El modo actual de halos acumulados es el predeterminado, incluso
    // tras actualizar una instalación que aún no tenga esta preferencia.
    // Los tres modos conservan su valor entre aperturas de la app.
    const haloModes=['normal','continuous','none'];
    if(!haloModes.includes(state.rosaryHaloMode))
      state.rosaryHaloMode='continuous';
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
    function threadDateKey(){
      const now=new Date();
      return now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+
        '-'+String(now.getDate()).padStart(2,'0');
    }
    let drawnThreadDate=threadDateKey();
    function threadNoise(index,salt){
      const seed=Number(drawnThreadDate.replace(/-/g,''));
      const raw=Math.sin((index+1)*12.9898+seed*.017+salt*78.233)*43758.5453;
      return 2*(raw-Math.floor(raw))-1;
    }
    let lastDrawWidth=0;
    let beforeIndex=-1,beforeMode='';
    let lastPhysicalType=null;
    let lastPhysicalBead=-1;
    let autoFollowTarget=null;
    let displacedManually=false;
    const launchPrayerIndex=state.index;
    // Con progreso guardado, la animación empieza SIEMPRE desde la cruz.
    // La primera orden de avance sólo enfoca la cuenta de la oración actual.
    let resumeAtCrossPending=launchPrayerIndex>0&&launchPrayerIndex<steps.length;
    let animateResumeFollow=false;
    let initialFramePending=true;
    let initialFrameAnchored=false;
    let startFrameInterrupted=false;
    function restoreInitialFrame(){
      if(!initialFramePending&&!initialFrameAnchored)return;
      if(state.rosaryViewLayout!=='physical'||
         state.index!==launchPrayerIndex||startFrameInterrupted){
        initialFramePending=false;
        initialFrameAnchored=false;
        return;
      }
      // No basta con que exista el SVG: es imprescindible que el
      // viewport ya tenga overflow y altura medidos por el CSS.
      if(getComputedStyle(viewport).overflowY!=='auto')return;
      const height=viewport.clientHeight;
      const end=viewport.scrollHeight-height;
      if(height<=0||end<=1)return;
      // Mantener la cruz durante la extracción de la funda.
      // El progreso se conserva, pero todavía no se encuadra su cuenta.
      if(resumeAtCrossPending){
        viewport.scrollTop=end;
        autoFollowTarget=null;
        initialFramePending=false;
        initialFrameAnchored=true;
        return;
      }
      viewport.scrollTop=end;
      autoFollowTarget=null;
      initialFramePending=false;
      // Hasta que el usuario empiece a rezar o desplace la cadena,
      // mantener la cruz en el fondo si Android reajusta las barras.
      initialFrameAnchored=true;
    }
    // La opción «Reiniciar progreso» debe restaurar también el
    // encuadre inicial, incluso si ya está seleccionada la oración 0.
    window.rosarioPhysicalReset=()=>{
      resumeAtCrossPending=false;
      animateResumeFollow=false;
      autoFollowTarget=null;
      displacedManually=false;
      beforeMode='';
      beforeIndex=-1;
      lastPhysicalType=null;
      lastPhysicalBead=-1;
    };
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
      drawnThreadDate=threadDateKey();
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
        // Disparidad vertical progresiva entre las dos ramas: las
        // cuentas grandes no quedan una frente a la otra como filas.
        // El desfase es cero en ambos extremos para mantener intactos
        // el arco superior y la unión inferior ya corregida.
        const naturalStagger=46*Math.sin(Math.PI*n/26);
        return{x:rightX,y:TOP+48+n*rise-18*n/26+
          naturalStagger,strand:'back'};
      });
      introPoints=intro.map((item,i)=>({x:center+3.5*Math.sin(i*.9+.4),y:item.y,r:item.r}));
      svg.setAttribute('viewBox','0 0 '+width+' '+HEIGHT);
      const at=p=>format(p.x)+' '+format(p.y);
      // Tangentes Catmull–Rom pasadas a curvas cúbicas Bézier para que
      // los encuentros superior e inferior sean suaves, sin vértices.
      function curvedSegment(previous,from,to,next,threadIndex){
        const c1={x:from.x+(to.x-previous.x)/6,y:from.y+(to.y-previous.y)/6};
        const c2={x:to.x-(next.x-from.x)/6,y:to.y-(next.y-from.y)/6};
        // Leve irregularidad de un cordón real: sólo sus controles
        // Bézier cambian, las cuentas y sus anclajes quedan intactos.
        // Los giros completos superior e inferior no se modifican.
        if(Number.isInteger(threadIndex)&&
           Math.abs(to.x-from.x)<8&&Math.abs(to.y-from.y)>35){
          c1.x+=threadNoise(threadIndex,1)*4.6;
          c2.x+=threadNoise(threadIndex,2)*4.6;
          c1.y+=threadNoise(threadIndex,3)*1.7;
          c2.y+=threadNoise(threadIndex,4)*1.7;
        }
        return'M '+at(from)+' C '+at(c1)+' '+at(c2)+' '+at(to);
      }
      function topTurn(left,right){
        // Arco redondeado en la parte superior, no una línea recta.
        // Un arco más bajo y compacto (antes controles a -90). Las
        // tangentes verticales en los extremos siguen enlazando sin
        // quiebres con el hilo de las dos ramas.
        return'M '+at(left)+' C '+format(left.x)+' '+format(left.y-55)+
          ' '+format(right.x)+' '+format(right.y-55)+' '+at(right);
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
          curvedSegment(previous,from,to,next,i);
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
        const d=curvedSegment(previous,from,to,next,100+i);
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

    // Los gestos manuales siguen siendo 100 % nativos. Sólo anulan
    // el destino de centrado automático pendiente cuando empiezan.
    function clearAutoFollow(){
      autoFollowTarget=null;
      displacedManually=true;
      startFrameInterrupted=true;
      initialFramePending=false;
      initialFrameAnchored=false;
    }
    viewport.addEventListener('pointerdown',clearAutoFollow,{passive:true});
    viewport.addEventListener('touchstart',clearAutoFollow,{passive:true});
    viewport.addEventListener('wheel',clearAutoFollow,{passive:true});
    viewport.addEventListener('scrollend',()=>{
      // No borrar el destino de una animación nueva cuando WebView
      // emite tarde el scrollend de la animación interrumpida.
      if(autoFollowTarget!==null&&
         Math.abs(viewport.scrollTop-autoFollowTarget)<1.5){
        autoFollowTarget=null;
      }
    },{passive:true});

    // Antes del giro del aro el avance sigue el gesto hacia ABAJO.
    // Exactamente en la primera cuenta del lado derecho (n.º 28),
    // el avance cambia al gesto hacia ARRIBA y sigue así hasta la cruz.
    // Las oraciones introductorias y los cierres de cada misterio
    // heredan la dirección de su cuenta correspondiente.
    function physicalSwipeDown(){
      if(state.rosarySwipeMode==='down')return true;
      if(state.rosaryViewLayout!=='physical'||state.rosarySwipeMode==='uniform')return false;
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
        // Gloria y jaculatorias se rezan en la cuenta GRANDE
        // siguiente, nunca sobre la décima Avemaría. El quinto
        // misterio ya se resuelve arriba en la grande compartida.
        const bead=Number.isInteger(step.bead) ? step.bead :
          step.kind==='mystery' ? step.m*11 :
            (step.m+1)*11;
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
    // Se llama desde advance() antes de cambiar el índice guardado.
    // El primer toque enfoca la oración actual; el siguiente ya avanza.
    window.rosarioPhysicalResumeFromCross=()=>{
      if(!resumeAtCrossPending||state.rosaryViewLayout!=='physical')
        return false;
      resumeAtCrossPending=false;
      initialFramePending=false;
      initialFrameAnchored=false;
      startFrameInterrupted=true;
      autoFollowTarget=null;
      displacedManually=true;
      animateResumeFollow=true;
      beforeMode='';
      beforeIndex=-1;
      paint();
      return true;
    };
    function paint(){
      if(resumeAtCrossPending&&state.index!==launchPrayerIndex){
        resumeAtCrossPending=false;
        initialFrameAnchored=false;
      }
      // El CSS controla solamente el brillo, nunca la geometría ni la
      // navegación. Cambiar de modo no afecta el progreso del rosario.
      document.body.dataset.rosaryHaloMode=state.rosaryHaloMode;
      document.body.dataset.rosarySide=state.rosarySide;
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
        autoFollowTarget=null;
        return;
      }
      if(initialFramePending&&state.index!==launchPrayerIndex)
        initialFramePending=false;
      if(initialFrameAnchored&&state.index!==launchPrayerIndex)
        initialFrameAnchored=false;
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
      // Después de rezar la primera estación, la cruz conserva su
      // luz durante el resto del rosario y vuelve a resaltar al final.
      cross.classList.toggle('is-complete',state.index>0);
      cross.classList.toggle('active',crossActive);
      cross.setAttribute('aria-current',crossActive?'step':'false');
      if(beforeMode!=='physical'||beforeIndex!==state.index){
        const height=viewport.clientHeight;
        const max=Math.max(0,viewport.scrollHeight-height);
        const bead=selected.type==='loop'?selected.bead:-1;
        const prayerStep=steps[state.index];
        const priorStep=steps[beforeIndex];
        // La vuelta superior sólo cambia el encuadre; NO cambia la
        // geometría ni la lógica del swipe sobre las cuentas.
        const atClosing=selected.phase==='closing';
        const atFinalMystery=prayerStep?.m===4&&
          (bead>=51||(bead===0&&selected.completed===55));
        const priorInFinalSection=priorStep?.m>=5||
          priorStep?.m===4&&
          (lastPhysicalBead>=51||
           lastPhysicalBead===0&&
           steps[beforeIndex]?.kind!=='mystery');
        const keepFinalFraming=atClosing||atFinalMystery;
        // Después de un desplazamiento manual el siguiente avance
        // debe volver a la cuenta activa, esté a la distancia que esté.
        let restoreActiveBead=displacedManually;
        const smoothResumedFocus=animateResumeFollow;
        animateResumeFollow=false;
        displacedManually=false;

        const entering=beforeMode!=='physical';
        const goingForward=!entering&&state.index===beforeIndex+1;
        const goingBackward=!entering&&state.index===beforeIndex-1;
        const sequential=goingForward||goingBackward;
        const currentTop=viewport.scrollTop;
        // Recuperar la cuenta fuera de pantalla incluso cuando no hubo
        // pointerdown previo; no limitar el salto a 90–176 px por avance.
        if(!restoreActiveBead &&
           (selected.type==='loop'||selected.type==='intro')){
          const screenY=selected.y-currentTop;
          if(screenY< -height*.12||screenY>height*1.12)
            restoreActiveBead=true;
        }
        // Los avances rápidos utilizan el destino pendiente, nunca una
        // coordenada intermedia de una animación todavía en marcha.
        const previous=autoFollowTarget===null?currentTop:autoFollowTarget;
        const clamp=n=>Math.max(0,Math.min(max,n));
        const margin=Math.max(22,Math.min(34,height*.055));
        const firstFiveTop=clamp(positions[5].y-margin);
        // El encuadre inferior es el límite REAL del scroll nativo.
        // El antiguo 39 % dejaba ~90 px de recorrido sin utilizar en
        // pantallas de 780 px y cortaba la cruz por el borde inferior.
        // Al llegar a la cuenta 7 de la última decena, ese límite se
        // alcanza gradualmente y se conserva durante los cierres.
        const finalTop=max;
        let target=previous;

        if(entering){
          // Al abrir con progreso guardado, mantener la cruz hasta el
          // siguiente toque, sin desplazar el SVG durante la extracción.
          if(resumeAtCrossPending){
            target=finalTop;
          }else{
          // Al iniciar un rosario nuevo, la cruz debe quedar completa
          // en el límite inferior real, igual que al terminarlo.
          // Esto cubre primer uso, recarga con progreso 0 y reinicio.
          if(initialFramePending&&state.index===launchPrayerIndex ||
             selected.type==='cross'&&selected.phase==='opening' ||
             state.index===0&&selected.phase==='opening'){
            target=finalTop;
          }else if(atClosing||atFinalMystery||bead>=50){
            target=finalTop;
          }else if(bead>=0&&bead<=5){
            target=Math.min(firstFiveTop,clamp(selected.y-height*.64));
          }else{
            target=selected.y-height*.64;
          }
          }
        }else if(keepFinalFraming&&priorInFinalSection){
          // Una vez que la séptima cuenta de la última decena ha
          // alcanzado el encuadre final, mantenerlo también al rezar
          // en la cuenta grande compartida, el colgante y todas las
          // oraciones de cierre (incluidas las letanías). No importa
          // que sus coordenadas y crucifijo estén más abajo en el SVG.
          target=previous;
        }else if(!sequential&&keepFinalFraming){
          // Navegación deliberada a una oración final desde otro punto.
          target=finalTop;
        }else if(goingForward&&bead>=24&&bead<=28&&
                 lastPhysicalBead===bead-1){
          // La curva superior comienza sobre los dos extremos y está
          // a sólo ~35 px del borde con scrollTop=0. El seguimiento
          // previo se detenía a ~50 px y recortaba el arco.
          // Revelarlo gradualmente entre 24–27 y conservarlo al girar
          // de la rama izquierda a la derecha (28).
          const beadGap=positions[26].y-positions[27].y;
          target=Math.min(previous,Math.max(0,27-bead)*beadGap);
        }else if(goingForward &&
                 selected.type==='intro' &&
                 selected.phase==='opening' &&
                 selected.intro===0){
          // La tercera pequeña del colgante ya prepara el paso a la
          // grande, evitando un salto en la siguiente oración.
          target=Math.min(previous,firstFiveTop);
        }else if(bead>=0&&bead<=5 && sequential &&
                 (lastPhysicalType==='intro'||
                  lastPhysicalBead>=0&&lastPhysicalBead<=5)){
          // Entre la grande y las primeras cinco, mostrar toda la zona
          // en un encuadre estable. Nunca recentrar cuenta por cuenta.
          // Si el usuario había desplazado la cadena manualmente,
          // también garantizar que la cuenta seleccionada no quede
          // por debajo del límite visible.
          const radius=bead%11===0?23:17;
          const visibleMinimum=selected.y-height+margin+radius;
          target=Math.max(visibleMinimum,Math.min(previous,firstFiveTop));
        }else if(goingForward&&bead>=(height<620?33:height<720?35:39)&&
                 bead<=54&&lastPhysicalBead===bead-1){
          // Sobre la rama derecha, llegar gradualmente al final REAL
          // en la séptima cuenta (51). Pantallas compactas empiezan
          // antes: su límite de distancia por paso es más pequeño.
          const startBead=height<620?33:height<720?35:39;
          const startTop=clamp(positions[startBead].y-height*.57);
          const progress=Math.max(0,Math.min(1,
            (bead-startBead)/(51-startBead)));
          const planned=startTop+(finalTop-startTop)*progress;
          target=Math.max(previous,planned);
        }else if(goingForward&&bead===0&&lastPhysicalBead===54){
          // La cuenta grande final no debe iniciar otro encuadre.
          target=previous;
        }else{
          // El seguimiento habitual mueve la cadena sólo cuando la
          // siguiente cuenta deja de estar dentro de la zona visible.
          const radius=bead>=0&&bead%11===0?23:17;
          const screenY=selected.y-previous;
          const upper=margin+radius;
          const lower=height-margin-radius;
          if(screenY<upper)target=selected.y-upper;
          else if(screenY>lower)target=selected.y-lower;
        }

        // El seguimiento progresivo sólo sirve cuando ya estamos cerca.
        // Si el usuario dejó el rosario en otro sitio, recentrar
        // directamente el destino litúrgico, sin el límite por paso.
        if(restoreActiveBead){
          if(selected.type==='cross' || selected.phase==='closing'){
            target=finalTop;
          }else if(selected.type==='intro'){
            target=clamp(selected.y-height*.55);
          }else if(selected.type==='loop'){
            target=clamp(selected.y-height*.53);
          }
        }
        target=clamp(target);
        if(sequential&&!restoreActiveBead){
          // Límite exclusivamente para los movimientos AUTOMÁTICOS
          // entre oraciones adyacentes. No modifica el swipe manual.
          // Más corto junto a la unión inferior; suficiente margen
          // para llegar gradualmente al encuadre final en la cuenta 7.
          const closeToBottom=bead>=0&&bead<=5 ||
            selected.type==='intro'&&selected.phase==='opening';
          const limit=closeToBottom
            ?Math.max(60,Math.min(128,height*.15))
            :Math.max(90,Math.min(176,height*.22));
          target=clamp(previous+
            Math.max(-limit,Math.min(limit,target-previous)));
        }
        if(Math.abs(target-previous)>.5){
          autoFollowTarget=target;
          // No saltar por una sucesión rápida de clics: los trayectos
          // adyacentes son SIEMPRE suaves, incluso si WebView aún está
          // interpolando el anterior. El swipe conserva su scroll nativo.
          const distant=(!sequential||restoreActiveBead)&&
            Math.abs(target-currentTop)>height*.95;
          if((smoothResumedFocus||!entering&&!distant)&&
             typeof viewport.scrollTo==='function'){
            viewport.scrollTo({top:target,behavior:'smooth'});
          }else{
            viewport.scrollTop=target;
          }
        }
      }
      lastPhysicalType=selected.type;
      lastPhysicalBead=selected.type==='loop'?selected.bead:-1;
      beforeMode='physical';beforeIndex=state.index;
    }
    function goToNode(el){
      let destination=-1;
      // La cuenta compartida y el colgante se usan al entrar y al
      // regresar. Al seleccionar la décima Avemaría del quinto misterio,
      // sus toques deben corresponder al recorrido de cierre desde
      // que se selecciona la cuenta 10, sin esperar al siguiente avance.
      const lastFifthAvemaria=steps.findIndex(s=>
        s.m===4 && s.title==='Avemaría' && s.n===10 && s.bead===54);
      const closing=lastFifthAvemaria>=0 && state.index>=lastFifthAvemaria;
      if(el.hasAttribute('data-cross')){
        const finalSalve=steps.findIndex(s=>s.title==='Salve' && s.m===5);
        destination=closing && finalSalve>=0 ? finalSalve : 0;
      }else if(el.hasAttribute('data-bead')){
        const touched=Number(el.dataset.bead);
        const active=positionFor(steps[state.index]);
        // Los toques sucesivos sobre la cuenta activa siguen avanzando
        // una oración, incluidos el quinto Gloria y sus jaculatorias.
        if(active.type==='loop'&&active.bead===touched){
          advance();return;
        }
        // La grande compartida (cuenta 0) es el comienzo del primer
        // misterio y también el cierre del quinto: no volver al primero.
        destination=closing && touched===0
          ? steps.findIndex(s=>s.m===4 && s.title==='Gloria')
          : steps.findIndex(s=>s.bead===touched);
      }else if(el.hasAttribute('data-intro')){
        const item=Number(el.dataset.intro);
        if(closing){
          if(item<3){
            destination=steps.findIndex(s=>s.m===5 &&
              s.dedication===item);
          }else{
            // La grande inferior retoma las letanías, después de
            // las tres Avemarías finales del colgante.
            destination=steps.findIndex(s=>s.m===5 &&
              s.kind==='litany' && s.litanyIndex===0);
          }
        }else{
          const title=['Versículos iniciales','Señor mío Jesucristo',
            'Señal de la cruz','Comunión espiritual'][item];
          destination=steps.findIndex(s=>s.m===-1 && s.title===title);
        }
      }
      // Conserva la confirmación de saltos grandes y el comportamiento
      // de retroceso habitual para todas las cuentas del aro.
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
        {id:'physical',name:'Rosario completo'},
        {id:'vertical',name:'Vista vertical'}
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
      const haloField=document.createElement('fieldset');
      haloField.className='physical-layout-settings physical-halo-settings';
      const haloLegend=document.createElement('legend');
      haloLegend.textContent='Iluminación de las cuentas';
      const haloOptions=document.createElement('div');
      haloOptions.className='physical-layout-options';
      [
        {id:'normal',name:'Halo normal',
          hint:'Sólo sigue la cuenta actual; la cruz conserva una luz tenue.'},
        {id:'continuous',name:'Halo continuo',
          hint:'Las cuentas completadas permanecen iluminadas.'},
        {id:'none',name:'Sin halo',
          hint:'Desactiva el brillo de todas las cuentas y de la cruz.'}
      ].forEach(item=>{
        const label=document.createElement('label');
        label.className='physical-layout-option physical-halo-option';
        const input=document.createElement('input');
        input.type='radio';
        input.name='rosaryHaloMode';
        input.value=item.id;
        input.checked=state.rosaryHaloMode===item.id;
        const content=document.createElement('span');
        const title=document.createElement('strong');
        title.textContent=item.name;
        const description=document.createElement('small');
        description.textContent=item.hint;
        content.append(title,description);
        label.append(input,content);
        label.classList.toggle('selected',input.checked);
        input.onchange=()=>{
          if(!input.checked)return;
          state.rosaryHaloMode=item.id;
          persist();
          paint();
          haloOptions.querySelectorAll('.physical-halo-option').forEach(row=>
            row.classList.toggle('selected',row.querySelector('input').checked));
        };
        haloOptions.append(label);
      });
      haloField.append(haloLegend,haloOptions);
      const controls=host.querySelector('.rosario-preferences-group');
      if(controls){
        host.insertBefore(field,controls);
        host.insertBefore(haloField,controls);
      }else host.append(field,haloField);
    };
    // Primer encuadre: después de pintar y de medir el CSS cargado.
    // Se vuelve a intentar si el navegador todavía no ha terminado
    // el layout. Nunca altera la oración que quedó guardada.
    requestAnimationFrame(restoreInitialFrame);
    if(typeof ResizeObserver!=='undefined'){
      const resizeObserver=new ResizeObserver(()=>{
        if(initialFramePending||initialFrameAnchored)
          requestAnimationFrame(restoreInitialFrame);
      });
      resizeObserver.observe(viewport);
    }
    // Cambios de altura (barras del sistema, scroll nativo) NO deben
    // regenerar la cadena ni alterar la posición actual de las cuentas.
    window.addEventListener('resize',()=>{
      if(state.rosaryViewLayout!=='physical')return;
      if(Math.abs(stage.getBoundingClientRect().width-lastDrawWidth)<2)return;
      const previousScroll=viewport.scrollTop;
      autoFollowTarget=null;
      draw();
      viewport.scrollTop=previousScroll;
      beforeIndex=state.index;
      paint();
      if(initialFramePending||initialFrameAnchored)
        requestAnimationFrame(restoreInitialFrame);
    });
    // La caída diaria se actualiza al regresar a la aplicación después
    // de medianoche, manteniendo el scroll y la oración actuales.
    const checkDailyThread=()=>{
      if(drawnThreadDate===threadDateKey())return;
      const scroll=viewport.scrollTop;
      draw();paint();viewport.scrollTop=scroll;
    };
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden)checkDailyThread();
    });
    window.addEventListener('focus',checkDailyThread);
    paint();
    restoreInitialFrame();
  });
})();
