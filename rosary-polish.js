/* Lectura inmersiva, alternancia de voces y controles persistentes. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const prayer = document.getElementById('immersiveText');
    const reading = document.querySelector('.immersive-prayer');
    if (!prayer || !reading) return;
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = 'rosary-polish.css?v=20261015-12';
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
      const i = step.m>=0 && step.m<5 ? step.m :
        Number.isInteger(step.stationNumber) ? step.stationNumber-1 :
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
      const label=document.createElement('span');
      label.className='mystery-announcement-label';
      label.textContent=ord+' misterio '+sing;
      const title=document.createElement('button');
      title.type='button';
      title.className='mystery-announcement-name mystery-announcement-link';
      title.textContent=groups[state.group][step.m];
      title.setAttribute('aria-label','Leer meditación: '+title.textContent);
      title.onclick=()=>window.rosarioOpenMeditation?.(step.m);
      prayer.append(label,title);
    }
    function specialSymbol() {
      const symbol=document.createElement('span');
      symbol.className='prayer-symbol';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent='✝';
      prayer.append(symbol);
    }
    function prayerSource(step) {
      if (step.kind==='dedication' || step.kind==='intention') return step.text || '';
      return step.text || prayers[step.title] || '';
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
        addVerses(step.dialogues);
        // addVerses sustituye los nodos: dejar la cruz sobre los dos diálogos.
        prayer.prepend(makeCross());
      } else if(step?.verse && step?.response) addVerses([step]);
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
        if (step.title==='Comunión espiritual' || step.title==='Salve') {
          const heading=document.createElement('span');
          heading.className='reading-prayer-heading';
          heading.textContent=step.title==='Salve' ?
            'Y ahora te saludamos con una Salve' : 'Comunión espiritual';
          prayer.append(heading);
        }
        const voices=(step.title==='Padrenuestro'||step.title==='Avemaría'||
          step.title==='Gloria'||step.kind==='jaculatory');
        const pair=step.kind==='jaculatory'?addJaculatoria(step,source):source.split(/\n\s*\n/);
        if(voices && pair.length>=2){
          const [a,b]=voiceOrder(step);
          appendVoice(pair[0],a);
          const second=pair.slice(1).join('\n\n');
          // En el segundo y cuarto misterio, el guía introduce la respuesta
          // del Avemaría con «Gloria.» antes de «Santa María».
          appendVoice(second && step.title==='Avemaría' &&
            (step.m===1 || step.m===3) && b==='guide'
            ? 'Gloria.\n'+second : second,b);
        }else appendWithAmen(prayer,source);
      }else{
        prayer.replaceChildren();
        appendWithAmen(prayer,'Has terminado el rosario. Que la paz te acompañe.');
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
    const prior=render;
    render=function(){
      prior();
      renderPrayer();
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
