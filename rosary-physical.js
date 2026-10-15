/* Un solo rosario físico: la misma cadena sube por un costado y regresa
   por el otro, ligeramente detrás y en gris. Una sola cruz en el colgante. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const stage=document.querySelector('.rosary');
    if(!stage || !window.rosarioNativeScroll)return;
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='rosary-physical.css?v=20261015-5';
    document.head.append(css);

    const NS='http://www.w3.org/2000/svg';
    const HEIGHT=2670,TOP=320,MEDAL_Y=2104,CROSS_Y=2533;
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
      const center=Math.max(84,Math.min(123,width*.225));
      const leftX=center-23,rightX=center+23;
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
          '" d="'+curvedSegment(previous,from,to,next)+'"/>';
      });
      lines+='</g>';
      body.push(lines);
      // Las cuentas del aro se dibujan una sola vez. La cuenta cero es
      // compartida entre el colgante y las dos ramas del óvalo.
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
      const tail=[positions[0],...introPoints,{x:center,y:CROSS_Y-54}];
      tail.slice(0,-1).forEach((from,i)=>{
        const previous=tail[Math.max(0,i-1)];
        const to=tail[i+1],next=tail[Math.min(tail.length-1,i+2)];
        pendant+='<path class="physical-link physical-intro-link" d="'+
          curvedSegment(previous,from,to,next)+'"/>';
      });
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
      const firstFinal=steps.findIndex(item=>item.m===5);
      if(!step)return{type:'cross',phase:'finished',y:CROSS_Y,completed:55};
      // Los pasos anteriores al primer misterio recorren el mismo
      // colgante: cruz -> cuenta grande inferior -> tres pequeñas ->
      // cuenta compartida del aro. Nunca se insertan oraciones nuevas.
      if(firstMystery>=0 && state.index<firstMystery){
        const progress=state.index/Math.max(1,firstMystery);
        const slots=[
          {type:'cross',phase:'opening',y:CROSS_Y},
          {type:'intro',intro:3,y:introPoints[3].y},
          {type:'intro',intro:2,y:introPoints[2].y},
          {type:'intro',intro:1,y:introPoints[1].y},
          {type:'intro',intro:0,y:introPoints[0].y},
          {type:'loop',bead:0,y:positions[0].y,strand:'junction'}
        ];
        const index=Math.min(slots.length-1,Math.floor(progress*slots.length));
        return{...slots[index],completed:0};
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
      // Después del último Gloria el recorrido desciende, sin crear
      // otro rosario: tres pequeñas (dedicaciones), la grande inferior y
      // la única cruz al concluir todas las oraciones restantes.
      if(step.m>=5){
        if(Number.isInteger(step.dedication) && step.dedication>=0 &&
           step.dedication<3){
          const introIndex=step.dedication;
          return{type:'intro',phase:'closing',intro:introIndex,
            y:introPoints[introIndex].y,completed:55};
        }
        // Salve, letanías, oración e intenciones finales comparten el
        // último tramo físico hasta llegar a la cruz en la bendición.
        const end=steps.length;
        const beginning=Math.max(0,firstFinal);
        const remaining=Math.max(1,end-beginning);
        const t=(state.index-beginning)/remaining;
        if(t>.94)return{type:'cross',phase:'closing',y:CROSS_Y,completed:55};
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
        // La misma cruz es el punto de partida y de llegada.
        const current=steps[state.index];
        state.index=(!current||current.m>=5)?0:
          Math.max(0,steps.findIndex(s=>s.title==='Señal de la cruz'));
      }else if(el.hasAttribute('data-bead')){
        const index=steps.findIndex(s=>s.bead===Number(el.dataset.bead));
        if(index<0)return;
        state.index=index;
      }else if(el.hasAttribute('data-intro')){
        const first=steps.findIndex(s=>s.kind==='mystery');
        if(first<0)return;
        const item=Number(el.dataset.intro);
        const mapped=first>0 ?
          Math.floor(first*(4-item)/6) : 0;
        // La misma cuenta se usa al inicio o al final, según la fase
        // que se esté rezando.
        if(steps[state.index]?.m>=5){
          const dedication=steps.findIndex(s=>s.m===5&&
            s.dedication===item);
          state.index=dedication>=0?dedication:
            Math.max(0,steps.findIndex(s=>s.m===5&&s.title==='Salve'));
        }else state.index=Math.max(0,Math.min(first-1,mapped));
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
      hint.textContent='La cuenta grande que une el colgante con el aro es la primera y la última. El rosario se colorea acumulativamente por la izquierda y luego la derecha. Al finalizar, se baja por las tres pequeñas, la cuenta grande inferior y la única cruz.';
      field.append(legend,list,hint);
      const controls=host.querySelector('.controls-position-setting');
      if(controls)host.insertBefore(field,controls);
      else host.append(field);
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
