/* Coronilla de la Divina Misericordia · Vatican News · modalidad alternativa. */
(() => {
  'use strict';
  const source='https://www.vaticannews.va/es/oraciones/coronilla-de-la-divina-misericordia.html';
  const dayNames=[['Lunes',1],['Martes',2],['Miércoles',3],['Jueves',4],['Viernes',5],['Sábado',6],['Domingo',0]];
  const dateKey=()=>{
    const now=new Date();
    return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),
      String(now.getDate()).padStart(2,'0')].join('-');
  };
  const offer='Padre Eterno, te ofrezco el Cuerpo, la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.';
  const passion='Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.';
  const holy='Santo Dios, Santo Fuerte, Santo Inmortal, ten misericordia de nosotros y del mundo entero.';
  const closing='Oh Dios Eterno, en quien la misericordia es infinita y el tesoro de compasión inagotable, vuelve a nosotros tu mirada bondadosa y aumenta tu misericordia en nosotros, para que en momentos difíciles no nos desesperemos ni nos desalentemos, sino que, con gran confianza, nos sometamos a tu santa voluntad, que es el Amor y la Misericordia mismos. Amén.';
  const creed='Creo en Dios, Padre todopoderoso, creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo; nació de Santa María Virgen; padeció bajo el poder de Poncio Pilato; fue crucificado, muerto y sepultado; descendió a los infiernos; al tercer día resucitó de entre los muertos; subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.';
  const steps=[
    {title:'Señal de la cruz',text:'En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',position:'cross'},
    {title:'Padrenuestro',text:()=>prayers['Padrenuestro'],position:'intro0'},
    {title:'Avemaría',text:()=>prayers['Avemaría'],position:'intro1'},
    {title:'Credo',text:creed,position:'intro3'}
  ];
  for(let d=0;d<5;d++){
    steps.push({title:'Padre Eterno',text:offer,decade:d,bead:d*11,kind:'major'});
    for(let n=1;n<=10;n++)steps.push({
      title:'Por su dolorosa Pasión',text:passion,decade:d,n,
      bead:d*11+n,kind:'minor'
    });
  }
  for(let i=1;i<=3;i++)steps.push({
    title:'Santo Dios',text:holy,repetition:i,kind:'triple',position:'intro3'
  });
  steps.push({title:'Oración final (opcional)',text:closing,kind:'closing',position:'cross'});
  const stepForBead=bead=>steps.findIndex(s=>s.bead===bead);
  function validRule(rule){return ['off','ask','days'].includes(rule)?rule:'off';}
  state.chapletRule=validRule(state.chapletRule);
  state.chapletDays=Array.isArray(state.chapletDays)?
    [...new Set(state.chapletDays.filter(n=>Number.isInteger(n)&&n>=0&&n<=6))]:[];
  state.chapletIndex=Number.isInteger(state.chapletIndex)?
    Math.max(0,Math.min(steps.length,state.chapletIndex)):0;
  const activeToday=()=>state.chapletChoiceDate===dateKey()&&
    state.chapletChoice==='chaplet';
  const el=(tag,cls,text)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const svgNs='http://www.w3.org/2000/svg';
  let stage,rail,reading,heading,subtitle,count,progress,previous,next,finish,settingsTip;
  let currentPosition=-1;
  const svg=(name,attributes)=>{
    const node=document.createElementNS(svgNs,name);
    Object.entries(attributes||{}).forEach(([key,value])=>node.setAttribute(key,String(value)));
    return node;
  };
  function beadPosition(n){
    if(n===0)return{x:93,y:585};
    if(n<=27)return{x:58,y:585-n*16.75};
    return{x:128,y:133+(n-28)*16.7};
  }
  function beadRadius(n){return n%11===0?18:12;}
  function drawRosary(){
    const artwork=svg('svg',{viewBox:'0 0 188 1040','aria-label':'Cuentas de la Coronilla','role':'group'});
    artwork.classList.add('chaplet-chain-svg');
    const thread=svg('path',{d:'M93 585 C61 563 58 547 58 568 V133 C58 50 128 50 128 133 V567 C128 579 112 584 93 585 M93 585 C93 668 92 740 94 885',
      class:'chaplet-thread'});
    artwork.append(thread);
    [680,732,784,836].forEach((y,i)=>{
      const group=svg('g',{'data-intro':i,role:'button',tabindex:'0','aria-label':['Padrenuestro','Avemaría','Cuenta pequeña','Credo'][i]});
      group.append(svg('circle',{cx:94,cy:y,r:i===3?18:12,class:'chaplet-bead'}));
      artwork.append(group);
    });
    const cross=svg('g',{'data-cross':'true',tabindex:'0',role:'button','aria-label':'Señal de la cruz'});
    cross.append(svg('path',{d:'M90 888V941 M77 904H103',class:'chaplet-cross-shadow', 'stroke-width':19}));
    cross.append(svg('path',{d:'M90 888V941 M77 904H103',class:'chaplet-cross','stroke-width':13}));
    artwork.append(cross);
    const data=[];
    for(let i=0;i<55;i++){
      const p=beadPosition(i);
      const group=svg('g',{'data-bead':i,role:'button',tabindex:'0',
        'aria-label':(i%11===0?'Cuenta grande ':'Cuenta pequeña ')+(i+1)});
      group.classList.add('chaplet-bead-node');
      group.append(svg('circle',{cx:p.x,cy:p.y,r:beadRadius(i),class:'chaplet-bead'}));
      if(i%11!==0){
        const number=i%11;
        group.append(svg('text',{x:p.x,y:p.y+3.6,'text-anchor':'middle',class:'chaplet-number'}));
        group.lastChild.textContent=String(number);
      }
      data.push(group);
      artwork.append(group);
    }
    const selectNode=target=>{
      const bead=target.closest('[data-bead]');
      if(bead){jumpTo(stepForBead(Number(bead.getAttribute('data-bead'))));return;}
      const intro=target.closest('[data-intro]');
      if(intro){
        jumpTo([1,2,2,3][Number(intro.getAttribute('data-intro'))]);return;
      }
      if(target.closest('[data-cross]'))jumpTo(0);
    };
    artwork.addEventListener('click',event=>selectNode(event.target));
    artwork.addEventListener('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      event.preventDefault();selectNode(event.target);
    });
    return artwork;
  }
  function touchHaptic(){
    if(state.haptics!==false)window.rosarioPreviewHapticPattern?.('normal');
  }
  function jumpTo(index){
    if(!Number.isInteger(index)||index<0||index>=steps.length)return;
    if(index===state.chapletIndex){move(1);return;}
    state.chapletIndex=index;persist();touchHaptic();renderChaplet();
  }
  function move(delta){
    const target=Math.max(0,Math.min(steps.length,state.chapletIndex+delta));
    if(target===state.chapletIndex)return;
    state.chapletIndex=target;
    persist();touchHaptic();renderChaplet();
  }
  function renderChaplet(){
    if(!stage||stage.hidden)return;
    const current=steps[state.chapletIndex];
    const complete=!current;
    heading.textContent=complete?'Coronilla completada':current.title;
    reading.textContent=complete?'Has terminado la Coronilla. Jesús, en Ti confío.':(
      typeof current.text==='function'?current.text():current.text);
    if(!complete&&Number.isInteger(current.decade)){
      subtitle.textContent='Decena '+(current.decade+1)+' de 5';
      count.textContent=current.kind==='major'?'Cuenta grande':
        current.n+' de 10';
    }else if(!complete&&current.kind==='triple'){
      subtitle.textContent='Invocación final';
      count.textContent=current.repetition+' de 3';
    }else{
      subtitle.textContent=complete?'Has terminado la oración':'Oraciones de la Coronilla';
      count.textContent='';
    }
    progress.style.width=(state.chapletIndex/steps.length*100)+'%';
    previous.disabled=state.chapletIndex===0;
    next.textContent=complete?'Volver al Rosario':state.chapletIndex===steps.length-1?'Terminar':'Avanzar';
    finish.hidden=!(current?.kind==='closing');
    stage.querySelectorAll('[data-bead]').forEach(node=>{
      const i=stepForBead(Number(node.getAttribute('data-bead')));
      node.classList.toggle('is-current',current?.bead===Number(node.getAttribute('data-bead')));
      node.classList.toggle('is-complete',i>=0&&i<state.chapletIndex);
    });
    stage.querySelectorAll('[data-intro]').forEach(node=>{
      const i=Number(node.getAttribute('data-intro'));
      const mapping=[1,2,2,3][i];
      node.classList.toggle('is-current',current?.position==='intro'+i);
      node.classList.toggle('is-complete',mapping<state.chapletIndex);
    });
    stage.querySelectorAll('[data-cross]').forEach(node=>
      node.classList.toggle('is-current',current?.position==='cross'));
    // Desplazamiento visual suave hacia la cuenta activa (sin mover las
    // oraciones ni cambiar el eje vertical usado en el Rosario original).
    if(current?.bead!==undefined){
      const p=beadPosition(current.bead);
      const target=p.y*rail.clientWidth/188-rail.clientHeight*.44;
      rail.scrollTo({top:Math.max(0,target),behavior:currentPosition<0?'instant':'smooth'});
    }else if(current?.position){
      rail.scrollTo({top:rail.scrollHeight-rail.clientHeight,behavior:'smooth'});
    }
    if(currentPosition!==state.chapletIndex)reading.parentElement.scrollTop=0;
    currentPosition=state.chapletIndex;
  }
  function setMode(mode,manual=false){
    if(mode!=='rosary'&&mode!=='chaplet')return;
    if(manual){
      state.chapletChoiceDate=dateKey();
      state.chapletChoice=mode;persist();
    }
    const on=mode==='chaplet';
    document.body.classList.toggle('chaplet-active',on);
    stage.hidden=!on;
    if(on)renderChaplet();
    window.rosarioRefreshPouchControls?.();
  }
  window.rosarioChapletStart=()=>{
    document.getElementById('modal')?.close();
    setMode('chaplet',true);
  };
  window.rosarioChapletReturn=()=>setMode('rosary',true);
  window.rosarioChapletCurrent=()=>document.body.classList.contains('chaplet-active');
  function chapletSettingScreen(){
    const modal=document.getElementById('modal');
    const host=document.getElementById('modalContent');
    if(!modal||!host)return;
    modal.dataset.rosarioSettingsLevel='subpage';
    window.rosarioUpdateBackLabel?.();
    host.classList.remove('rosario-settings-dashboard');
    host.replaceChildren();
    const screen=el('section','chaplet-settings');
    const back=el('button','chaplet-settings-back','← Volver a Ajustes');
    back.type='button';back.id='chapletSettingsBack';
    back.onclick=()=>window.rosarioSettingsGoHome?.();
    const heading=el('h2',null,'Coronilla de la Divina Misericordia');
    const description=el('p','chaplet-settings-description',
      'Puedes rezar la Coronilla en cualquier momento o elegir cómo aparece al comenzar un día nuevo.');
    const start=el('button','chaplet-start-button','Rezar la Coronilla ahora');
    start.type='button';
    start.onclick=window.rosarioChapletStart;
    const restart=el('button','chaplet-restart-button','Comenzar la Coronilla desde el principio');
    restart.type='button';restart.hidden=state.chapletIndex===0;
    restart.onclick=()=>{
      state.chapletIndex=0;currentPosition=-1;persist();
      window.rosarioChapletStart();
    };
    const options=el('fieldset','chaplet-settings-rules');
    const legend=el('legend',null,'Inicio del día');
    options.append(legend);
    const modes=[
      ['off','Rosario habitual','No se pregunta por la Coronilla al abrir.'],
      ['ask','Preguntar siempre','Cada nuevo día podrás escoger cuál de los dos rezar.'],
      ['days','Elegir días','En los días señalados se abre la Coronilla automáticamente.']
    ];
    const days=el('div','chaplet-schedule-days');
    const title=el('p','chaplet-settings-days-title','Días para la Coronilla');
    dayNames.forEach(([name,index])=>{
      const label=el('label','chaplet-schedule-day');
      const check=document.createElement('input');
      check.type='checkbox';check.value=String(index);
      check.checked=state.chapletDays.includes(index);
      const short=el('span',null,name.substring(0,3));
      label.append(check,short);days.append(label);
      check.onchange=()=>{
        state.chapletDays=[...days.querySelectorAll('input:checked')]
          .map(node=>Number(node.value));
        persist();
      };
    });
    modes.forEach(([key,name,description])=>{
      const label=el('label','chaplet-setting-mode');
      const radio=document.createElement('input');
      radio.type='radio';radio.name='chapletModeRule';radio.value=key;
      radio.checked=state.chapletRule===key;
      const info=el('span','chaplet-setting-mode-copy');
      info.append(el('strong',null,name),el('small',null,description));
      label.append(radio,info);
      radio.onchange=()=>{
        if(!radio.checked)return;
        state.chapletRule=key;
        // La configuración automática se aplica desde el próximo día;
        // no interrumpe la oración actual.
        state.chapletChoiceDate=dateKey();
        state.chapletChoice=document.body.classList.contains('chaplet-active')?
          'chaplet':'rosary';
        persist();
        updateSelected();
      };
      options.append(label);
    });
    function updateSelected(){
      options.querySelectorAll('.chaplet-setting-mode').forEach(row=>
        row.classList.toggle('is-selected',row.querySelector('input').checked));
      const visible=state.chapletRule==='days';
      title.hidden=!visible;days.hidden=!visible;
    }
    screen.append(back,heading,description,start,restart,options,title,days);
    const sourceLink=el('a','chaplet-source','Texto de referencia · Vatican News ↗');
    sourceLink.href=source;sourceLink.target='_blank';sourceLink.rel='noopener noreferrer';
    screen.append(sourceLink);
    host.append(screen);updateSelected();modal.scrollTop=0;
  }
  window.rosarioOpenChapletSettings=chapletSettingScreen;
  function askForToday(){
    if(state.chapletChoiceDate===dateKey())return;
    const modal=document.getElementById('modal');
    if(!modal)return;
    show('<section class="chaplet-daily-prompt"><div class="chaplet-prompt-symbol" aria-hidden="true">✝</div>'+
      '<h2>¿Qué quieres rezar hoy?</h2><p>Escoge tu oración para este día.</p>'+
      '<div class="chaplet-prompt-actions"><button type="button" id="chapletChooseRosary">Santo Rosario</button>'+
      '<button type="button" id="chapletChooseMercy">Divina Misericordia</button></div></section>');
    // Cerrar el aviso equivale a elegir Rosario sólo para ese día.
    // No se repetirá hasta que comience otro día.
    modal.addEventListener('close',()=>{
      if(state.chapletChoiceDate===dateKey())return;
      state.chapletChoiceDate=dateKey();
      state.chapletChoice='rosary';persist();setMode('rosary');
    },{once:true});
    const choose=mode=>{
      state.chapletChoiceDate=dateKey();
      state.chapletChoice=mode;persist();
      modal.close();setMode(mode);
    };
    document.getElementById('chapletChooseRosary').onclick=()=>choose('rosary');
    document.getElementById('chapletChooseMercy').onclick=()=>choose('chaplet');
  }
  function resolveNewDay(){
    const today=dateKey();
    // Una WebView que permanece abierta puede cruzar la medianoche
    // sin recargar. Actualizar también el misterio del Rosario habitual.
    if(state.dayDate!==today){
      const day=new Date().getDay();
      state.day=day;
      state.group=['Gloriosos','Gozosos','Dolorosos','Gloriosos',
        'Luminosos','Dolorosos','Gozosos'][day];
      state.dayDate=today;
      state.intentionCycle=[null,null,null,null,null];
      render();persist();
    }
    const fresh=state.chapletChoiceDate!==today;
    if(state.chapletProgressDate!==today){
      state.chapletProgressDate=today;
      state.chapletIndex=0;
      currentPosition=-1;persist();
    }
    if(fresh){
      if(state.chapletRule==='ask'){
        askForToday();return;
      }
      state.chapletChoiceDate=today;
      state.chapletChoice=state.chapletRule==='days' &&
        state.chapletDays.includes(new Date().getDay())?'chaplet':'rosary';
      persist();
    }
    setMode(state.chapletChoice==='chaplet'?'chaplet':'rosary');
  }
  function buildStage(){
    stage=el('section','chaplet-stage');
    stage.id='chapletStage';
    stage.hidden=true;
    stage.setAttribute('aria-label','Coronilla de la Divina Misericordia');
    const bar=el('header','chaplet-toolbar');
    const title=el('div','chaplet-brand','Divina Misericordia');
    const menu=el('button','chaplet-gear','Ajustes');
    menu.type='button';
    menu.onclick=()=>document.getElementById('settings')?.click();
    const rosary=el('button','chaplet-return','Rosario');
    rosary.type='button';
    rosary.onclick=window.rosarioChapletReturn;
    bar.append(title,rosary,menu);
    const main=el('div','chaplet-main');
    rail=el('div','chaplet-rail');
    rail.append(drawRosary());
    const pane=el('div','chaplet-reader');
    const kicker=el('span','chaplet-kicker','CORONILLA DE LA DIVINA MISERICORDIA');
    subtitle=el('div','chaplet-decade');
    heading=el('h2','chaplet-heading');
    reading=el('p','chaplet-prayer');
    reading.setAttribute('aria-live','polite');
    count=el('div','chaplet-count');
    const footer=el('div','chaplet-navigation');
    previous=el('button','chaplet-previous','← Anterior');
    previous.type='button';previous.onclick=()=>move(-1);
    next=el('button','chaplet-next','Avanzar');
    next.type='button';next.onclick=()=>{
      if(state.chapletIndex>=steps.length)window.rosarioChapletReturn();
      else move(1);
    };
    finish=el('button','chaplet-skip-final','Omitir oración final');
    finish.type='button';finish.onclick=()=>move(1);
    const track=el('div','chaplet-progress');
    progress=el('span','chaplet-progress-fill');
    track.append(progress);
    footer.append(previous,next);
    const content=el('div','chaplet-prayer-content');
    content.append(kicker,subtitle,heading,reading,count,finish);
    pane.append(content,track,footer);
    main.append(rail,pane);
    stage.append(bar,main);
    document.body.append(stage);
    // Gestos verticales en el texto: se mantiene el esquema seleccionado.
    let start=null;
    pane.addEventListener('pointerdown',e=>{
      if(!e.isPrimary||e.target.closest('button'))return;
      start={x:e.clientX,y:e.clientY,scroll:pane.scrollTop,
        id:e.pointerId};
    });
    pane.addEventListener('pointerup',e=>{
      if(!start||start.id!==e.pointerId)return;
      const dy=e.clientY-start.y,dx=e.clientX-start.x;
      const current=start;start=null;
      if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)*1.4){
        if(Math.abs(pane.scrollTop-current.scroll)>8)return;
        let down=false;
        if(state.rosarySwipeMode==='down')down=true;
        else if(state.rosarySwipeMode==='follow'){
          const step=steps[state.chapletIndex];down=(step?.bead??0)<=27;
        }
        if((dy>0)===down)move(1);else move(-1);
      }else if(Math.abs(dy)<10&&Math.abs(dx)<10&&state.screenTapNavigation){
        if(e.clientY<window.innerHeight/2)move(-1);
        else move(1);
      }
    });
    pane.addEventListener('pointercancel',()=>{start=null;});
  }
  document.addEventListener('DOMContentLoaded',()=>{
    buildStage();
    // Respetar las elecciones del primer uso. La pregunta diaria se
    // muestra encima de la carterita mediante el diálogo del sistema.
    resolveNewDay();
    document.addEventListener('visibilitychange',()=>{
      if(!document.hidden&&state.chapletChoiceDate!==dateKey())resolveNewDay();
    });
    window.addEventListener('pageshow',()=>{
      if(state.chapletChoiceDate!==dateKey())resolveNewDay();
    });
  });
})();