/* Lectura inmersiva, alternancia de voces y controles persistentes. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const prayer = document.getElementById('immersiveText');
    const reading = document.querySelector('.immersive-prayer');
    if (!prayer || !reading) return;
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = 'rosary-polish.css?v=20261017-3';
    document.head.append(sheet);

    state.textScale = Number.isFinite(Number(state.textScale)) ?
      Math.min(1.65, Math.max(.75, Number(state.textScale))) : 1;
    state.voiceLabels = state.voiceLabels !== false;
    state.voiceColors = state.voiceColors !== false;

    // El número romano y el nombre forman una sola unidad dentro del panel de lectura.
    const context = document.createElement('button');
    context.type = 'button';
    context.className = 'rosary-mystery-context';
    context.hidden = true;
    context.setAttribute('aria-label', 'Leer meditación del misterio en curso');
    context.innerHTML =
      '<span class="rosary-mystery-badge" id="rosaryMysteryRoman"></span>' +
      '<span class="rosary-mystery-name" id="rosaryMysteryName"></span>';
    reading.insertBefore(context, prayer);
    context.onclick = () => {
      const step = steps[state.index];
      if (step && step.m >= 0 && step.m < 5)
        window.rosarioOpenMeditation?.(step.m);
    };

    // La oración corta usa swipes; la oración larga utiliza el scroll nativo.
    function refreshReadingGesture(){
      reading.classList.toggle('can-swipe',
        reading.scrollHeight <= reading.clientHeight + 3);
    }
    sheet.addEventListener('load',()=>requestAnimationFrame(refreshReadingGesture));
    window.addEventListener('resize',()=>requestAnimationFrame(refreshReadingGesture));

    // Los botones de tamaño comparten la misma barra con el menú.
    function makeSizeButton(sign) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'font-button top-control';
      button.textContent = sign === 1 ? 'T+' : 'T−';
      button.title = sign === 1 ? 'Aumentar tamaño del texto' : 'Reducir tamaño del texto';
      button.setAttribute('aria-label', button.title);
      button.onclick = () => {
        state.textScale = Math.max(.75, Math.min(1.65,
          Math.round((state.textScale + sign * .1) * 100) / 100));
        applyPrefs();
        requestAnimationFrame(refreshReadingGesture);
        persist();
      };
      return button;
    }
    const increase = makeSizeButton(1);
    const decrease = makeSizeButton(-1);
    document.getElementById('iNavigate').after(decrease, increase);
    // Los tres controles (menú, T− y T+) pertenecen a .top-controls:
    // al ocultarse la barra en pantalla completa quedan detrás del punto.


    function applyPrefs() {
      document.documentElement.classList.toggle('voice-labels-hidden', !state.voiceLabels);
      document.documentElement.classList.toggle('voice-colors-off', !state.voiceColors);
      const width = document.documentElement.clientWidth;
      const base = Math.min(28,Math.max(18,width * .034));
      document.documentElement.style.setProperty('--rosary-font-size',
        (Math.round(base * state.textScale * 10) / 10) + 'px');
      document.documentElement.style.setProperty('--rosary-secondary-font',
        (Math.round(Math.max(15, base * .85) * state.textScale * 10) / 10) + 'px');
    }
    function appendWithAmen(container, value) {
      const text = String(value || '');
      const pattern = /Amén\.?/gi;
      let last = 0, match;
      while ((match=pattern.exec(text))) {
        const prefix = text.slice(last, match.index).replace(/[ \t]+$/,'');
        if(prefix)container.append(document.createTextNode(prefix));
        const amen = document.createElement('span');
        amen.className = 'amen-line';
        amen.textContent = match[0];
        container.append(amen);
        last = pattern.lastIndex;
      }
      if(last < text.length) container.append(document.createTextNode(text.slice(last).replace(/^[ \t]+/,'')));
    }
    window.rosaryFormatAmens=(container,text)=>{
      container.replaceChildren();
      appendWithAmen(container,text);
    };

    function appendVoice(text,role) {
      const wrapper = document.createElement('span');
      wrapper.className='prayer-part voice-'+role;
      const label = document.createElement('span');
      label.className = 'voice-label';
      label.textContent=role==='guide'?'Guía':'Asamblea';
      wrapper.append(label);
      appendWithAmen(wrapper,text);
      prayer.append(wrapper);
    }
    function voiceOrder(step) {
      // Durante las tres vueltas de la Estación el primer fragmento
      // pertenece siempre al Guía y el segundo a la Asamblea. El
      // dorado no debe alternar en la segunda vuelta.
      if(Number.isInteger(step.stationNumber) ||
        step.title==='Avemaría'&&step.n===10&&(step.m===1||step.m===3))
        return ['guide','assembly'];
      const i = step.m>=0 && step.m<5 ? step.m :
        Number.isInteger(step.dedication) ? step.dedication :
        Number.isInteger(step.intentionNumber) ? step.intentionNumber : 0;
      return i%2===0 ? ['guide','assembly'] : ['assembly','guide'];
    }
    function addVerses(parts) {
      prayer.replaceChildren();
      parts.forEach(part=>{
        [['℣.',part.verse,'guide'],['℟.',part.response,'assembly']].forEach(([glyph,text,role])=>{
          const line=document.createElement('span');
          line.className='dialogue-line voice-'+role;
          const mark=document.createElement('span');
          mark.className='verse-mark';
          mark.textContent=glyph;
          mark.setAttribute('aria-label',role==='guide'?'Versículo':'Respuesta');
          line.append(mark);
          appendWithAmen(line,text);
          prayer.append(line);
        });
      });
    }
    function announce(step) {
      prayer.replaceChildren();
      const ord=['primer','segundo','tercer','cuarto','quinto'][step.m];
      const sing={Gozosos:'gozoso',Dolorosos:'doloroso',
        Gloriosos:'glorioso',Luminosos:'luminoso'}[state.group];
      const intention=window.rosarioIntentionFor?.(step.m);
      if(intention){
        const block=document.createElement('div');
        block.className='mystery-random-intention';
        const caption=document.createElement('span');
        caption.className='mystery-intention-caption';
        caption.textContent='Intención de este misterio';
        const content=document.createElement('span');
        content.className='mystery-intention-body';
        content.textContent=intention;
        block.append(caption,content);
        prayer.append(block);
      }
      const label=document.createElement('span');
      label.className='mystery-announcement-label';
      label.textContent=ord+' misterio '+sing;
      const title=document.createElement('button');
      title.type='button';
      title.className='mystery-announcement-name mystery-announcement-link';
      title.textContent=groups[state.group][step.m];
      title.setAttribute('aria-label','Leer meditación: '+title.textContent);
      title.onclick=()=>window.rosarioOpenMeditation?.(step.m);
      const frame=document.createElement('div');
      frame.className='rosario-mystery-frame';
      frame.append(label,title);
      prayer.append(frame);
    }
    function specialSymbol() {
      const symbol=document.createElement('span');
      symbol.className='prayer-symbol';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent='✝';
      prayer.append(symbol);
    }
    function prayerSource(step) {
      return window.rosarioPrayerText?.(step.title,step) ||
        step.text || prayers[step.title] || '';
    }
    function addJaculatoria(step,source) {
      const parts = source.split(/\n\s*\n/);
      if (step.title==='Jaculatoria') {
        const marker='Madre de misericordia,';
        const pos=source.indexOf(marker);
        if (pos>=0) return [source.slice(0,pos+marker.length).trim(),source.slice(pos+marker.length).trim()];
      }
      if (step.title==='Jaculatoria de Fátima') {
        const marker='presérvanos del fuego del infierno,';
        const pos=source.indexOf(marker);
        if (pos>=0) return [source.slice(0,pos+marker.length).trim(),source.slice(pos+marker.length).trim()];
      }
      if(parts.length>1) return [parts[0],parts.slice(1).join('\n\n')];
      // Una oración breve se pronuncia por mitades, sin duplicarla.
      const offset=Math.round(source.length/2);
      let split=source.indexOf(',',offset);
      if(split<0)split=source.lastIndexOf(',',offset);
      return split>0?[source.slice(0,split+1),source.slice(split+1).trim()]:[source,''];
    }
    function renderPrayer() {
      const step=steps[state.index];
      applyPrefs();
      const decade=!!(step && step.m>=0 && step.m<5);
      const announced=decade && step.kind==='mystery';
      const showMystery=decade && !announced &&
        (step.title==='Padrenuestro'||step.title==='Avemaría');
      reading.classList.toggle('is-mystery-announcement',!!announced);
      reading.classList.toggle('has-decade-context',!!showMystery);
      context.hidden=!showMystery;
      if(showMystery){
        document.getElementById('rosaryMysteryRoman').textContent=['I','II','III','IV','V'][step.m];
        document.getElementById('rosaryMysteryName').textContent=groups[state.group][step.m];
        context.setAttribute('aria-label','Leer meditación: '+groups[state.group][step.m]);
      }
      const intro=step?.intention;
      if(announced)announce(step);
      else if(step?.kind==='litany'){
        prayer.replaceChildren();
      } else if(step?.kind==='dialogue-group'){
        const edited=state.prayerEdits?.[step.title];
        const matches=edited?[...edited.matchAll(/℣\.\s*([^\n]+)\s*\n\s*℟\.\s*([\s\S]*?)(?=\n\s*\n℣\.|$)/g)]:[];
        if(matches.length===step.dialogues.length)
          addVerses(matches.map(m=>({verse:m[1].trim(),response:m[2].trim()})));
        else if(edited){
          prayer.replaceChildren();appendWithAmen(prayer,edited);
        }else addVerses(step.dialogues);
        prayer.prepend(makeCross());
      } else if(step?.verse && step?.response) {
        const edited=step.title==='Cordero de Dios'?null:state.prayerEdits?.[step.title];
        if(edited){
          const match=edited.match(/℣\.\s*([^\n]+)\s*\n\s*℟\.\s*([\s\S]+)/);
          if(match)addVerses([{verse:match[1],response:match[2]}]);
          else {prayer.replaceChildren();appendWithAmen(prayer,edited);}
        }else addVerses([step]);
      }
      else if(step){
        prayer.replaceChildren();
        if(step.title==='Señal de la cruz') specialSymbol();
        if(intro){
          const label=document.createElement('span');
          label.className='intention-heading';
          label.textContent=intro;
          prayer.append(label);
        }
        const source=prayerSource(step);
        if (step.title==='Comunión espiritual' || step.title==='Salve' ||
            step.title==='Oración final'||step.title==='Señor mío Jesucristo') {
          const heading=document.createElement('span');
          heading.className='reading-prayer-heading';
          heading.textContent=step.title==='Salve'
            ? (state.assemblyEnabled!==false
              ? 'Y ahora te saludamos con una Salve'
              : 'Y ahora te saludo con una Salve')
            : step.title==='Oración final' ? 'Oración'
            : step.title==='Señor mío Jesucristo'?'Acto de contrición'
            : 'Comunión espiritual';
          if(step.title==='Señor mío Jesucristo'){
            // El selector sólo aparece al rezar esta oración.
            const picker=document.createElement('button');
            picker.type='button';
            picker.className='contrition-quick-choice';
            picker.setAttribute('aria-label','Cambiar acto de contrición');
            picker.innerHTML='<span class="contrition-notch-grooves" aria-hidden="true"></span>';
            picker.onclick=()=>window.rosarioOpenContritionChoice?.();
            heading.append(picker);
          }
          prayer.append(heading);
        }
        const voices=state.assemblyEnabled!==false&&
          (step.title==='Padrenuestro'||step.title==='Avemaría'||
          step.title==='Gloria'||step.kind==='jaculatory');
        const pair=step.kind==='jaculatory'?addJaculatoria(step,source):source.split(/\n\s*\n/);
        if(voices && pair.length>=2){
          const [a,b]=voiceOrder(step);
          appendVoice(pair[0],a);
          const second=pair.slice(1).join('\n\n');
          // En los misterios II y IV, solamente en la décima Avemaría,
          // la Asamblea dice «Gloria» inmediatamente ANTES de «Santa María».
          // Se preserva el primer «Dios te salve» sin modificaciones.
          const addGloria=step.title==='Avemaría'&&step.n===10&&
            (step.m===1||step.m===3)&&state.assemblyEnabled!==false;
          appendVoice(addGloria?'Gloria.\n'+second:second,b);
        }else appendWithAmen(prayer,source);
      }else{
        prayer.replaceChildren();
        specialSymbol();
        appendWithAmen(prayer,'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. Amén.');
      }
      document.getElementById('readFull').hidden=true;
      requestAnimationFrame(refreshReadingGesture);
    }
    function makeCross(){
      const cross=document.createElement('span');
      cross.className='prayer-symbol';
      cross.setAttribute('aria-hidden','true');
      cross.textContent='✝';
      return cross;
    }
    // Se anima un único elemento real. Jamás crear una copia del
    // texto: los clones anteriores causaban superposición y negritas.
    const transitions=new WeakMap();
    function animateText(element,mode,swap){
      const active=transitions.get(element);
      if(active)active.cancel();
      const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if(mode==='none'||reduced||!element.animate){
        swap();return;
      }
      let stopped=false;
      let running;
      const task={
        cancel(){
          stopped=true;
          if(running)running.cancel();
          element.style.opacity='';
          transitions.delete(element);
        }
      };
      transitions.set(element,task);
      running=element.animate([{opacity:1},{opacity:0}],
        {duration:145,easing:'ease-in',fill:'forwards'});
      running.onfinish=()=>{
        if(stopped)return;
        swap();
        running.cancel();
        const frames=mode==='slide'
          ?[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}]
          :mode==='soft'
          ?[{opacity:0,filter:'blur(2px)'},{opacity:1,filter:'blur(0)'}]
          :[{opacity:0},{opacity:1}];
        running=element.animate(frames,{
          duration:mode==='slide'?440:mode==='soft'?480:360,
          easing:'cubic-bezier(.18,.65,.26,1)',fill:'both'
        });
        running.onfinish=()=>{
          if(stopped)return;
          running.cancel();transitions.delete(element);
        };
      };
    }
    window.rosarioAnimateText=animateText;
    const prior=render;
    let lastRenderedIndex=null,lastRenderedTitle=null;
    render=function(){
      const step=steps[state.index];
      const mode=state.textTransition;
      const animate=lastRenderedIndex!==null&&state.index!==lastRenderedIndex&&
        lastRenderedTitle==='Avemaría'&&step?.title==='Avemaría'&&
        step.m>=0&&step.m<5&&['fade','slide','soft'].includes(mode);
      transitions.get(prayer)?.cancel();
      const oldNodes=animate?[...prayer.childNodes]:null;
      prior();
      renderPrayer();
      if(animate){
        const nextNodes=[...prayer.childNodes];
        prayer.replaceChildren(...oldNodes);
        animateText(prayer,mode,()=>prayer.replaceChildren(...nextNodes));
      }
      lastRenderedIndex=state.index;
      lastRenderedTitle=step?.title||null;
    };
    const readFull=document.getElementById('readFull');
    if(readFull)readFull.hidden=true;

    // Pulsación prolongada sobre dorado, compatible con touch y ratón.
    // Prevenir el menú nativo del navegador (seleccionar/copiar texto).
    let hold=null,origin=null,holdFired=false,suppressVoiceClickUntil=0;
    const goldTarget=target=>target.closest?.('.voice-assembly,.wheel-response');
    function openVoiceSettings(){
      if(holdFired)return;
      holdFired=true;
      clearTimeout(hold);hold=null;
      suppressVoiceClickUntil=performance.now()+950;
      window.rosarioOpenVoiceSettings?.();
    }
    function cancelHold(){
      clearTimeout(hold);hold=null;origin=null;
    }
    reading.addEventListener('contextmenu',e=>{
      if(!state.voiceColors || !goldTarget(e.target))return;
      e.preventDefault();
      openVoiceSettings();
    });
    reading.addEventListener('click',e=>{
      if(performance.now()<suppressVoiceClickUntil){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },true);
    reading.addEventListener('pointerdown',e=>{
      if(!state.voiceColors || e.button!==0 || !goldTarget(e.target))return;
      cancelHold();
      holdFired=false;
      origin={x:e.clientX,y:e.clientY,id:e.pointerId};
      hold=setTimeout(openVoiceSettings,510);
    },true);
    reading.addEventListener('pointermove',e=>{
      if(origin && e.pointerId===origin.id &&
         Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>10)cancelHold();
    },true);
    for(const name of ['pointerup','pointercancel','pointerleave'])
      reading.addEventListener(name,cancelHold,true);
    // En pantallas táctiles Android el menú de selección puede interceptar
    // pointercancel; conservar también el temporizador de touchstart.
    let touchTimer=null,touchOrigin=null;
    reading.addEventListener('touchstart',e=>{
      if(!state.voiceColors || e.touches.length!==1 || !goldTarget(e.target))return;
      touchOrigin={x:e.touches[0].clientX,y:e.touches[0].clientY};
      holdFired=false;
      clearTimeout(touchTimer);
      touchTimer=setTimeout(openVoiceSettings,530);
    },{passive:true,capture:true});
    reading.addEventListener('touchmove',e=>{
      if(touchOrigin && Math.hypot(e.touches[0].clientX-touchOrigin.x,
          e.touches[0].clientY-touchOrigin.y)>10){
        clearTimeout(touchTimer);touchTimer=null;touchOrigin=null;
      }
    },{passive:true,capture:true});
    for(const name of ['touchend','touchcancel'])
      reading.addEventListener(name,()=>{
        clearTimeout(touchTimer);touchTimer=null;touchOrigin=null;
      },{passive:true,capture:true});
    render();
  });
})();
