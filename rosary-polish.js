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

    const context = document.createElement('div');
    context.className = 'rosary-mystery-context';
    context.hidden = true;
    context.setAttribute('role', 'heading');
    context.setAttribute('aria-level', '2');
    context.innerHTML =
      '<button type="button" class="rosary-mystery-badge" id="rosaryMysteryRoman" aria-label="Abrir meditación del misterio"></button>' +
      '<div class="rosary-mystery-name" id="rosaryMysteryName"></div>';
    document.querySelector('.rosary').append(context);
    document.getElementById('rosaryMysteryRoman').onclick = () => {
      const step = steps[state.index];
      if (step && step.m >= 0 && step.m < 5)
        window.rosarioOpenMeditation?.(step.m);
    };

    // Controles visibles en la barra y, sin barra expandida, cerca del menú compacto.
    function makeSizeButton(sign, fullscreen) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = fullscreen ? 'font-button font-button-compact' : 'font-button top-control';
      button.textContent = sign === 1 ? 'T+' : 'T−';
      button.title = sign === 1 ? 'Aumentar tamaño del texto' : 'Reducir tamaño del texto';
      button.setAttribute('aria-label', button.title);
      button.onclick = () => {
        state.textScale = Math.max(.75, Math.min(1.65,
          Math.round((state.textScale + sign * .1) * 100) / 100));
        applyPrefs();
        persist();
      };
      return button;
    }
    const topBar = document.querySelector('.top-controls');
    const increase = makeSizeButton(1,false);
    const decrease = makeSizeButton(-1,false);
    const fullscreenSize = document.createElement('div');
    fullscreenSize.className = 'font-controls-compact';
    fullscreenSize.append(makeSizeButton(-1,true), makeSizeButton(1,true));
    document.body.append(fullscreenSize);
    const nav = document.getElementById('iNavigate');
    nav.after(decrease,increase);
    function syncCompact() {
      const full = Boolean(document.fullscreenElement);
      fullscreenSize.hidden = !full || !topBar.hidden;
      // Solo debe aparecer el grupo compacto cuando se oculta la barra.
      fullscreenSize.hidden = !(full && topBar.hidden);
    }
    new MutationObserver(syncCompact).observe(topBar,{attributes:true,attributeFilter:['hidden']});
    document.addEventListener('fullscreenchange',syncCompact);
    syncCompact();

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
      const title=document.createElement('span');
      title.className='mystery-announcement-name';
      title.textContent=groups[state.group][step.m];
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
      }
      const intro=step?.intention;
      if(announced)announce(step);
      else if(step?.kind==='litany'){
        prayer.replaceChildren();
      } else if(step?.kind==='dialogue-group'){
        specialSymbol();
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
        const voices=(step.title==='Padrenuestro'||step.title==='Avemaría'||step.kind==='jaculatory');
        const pair=step.kind==='jaculatory'?addJaculatoria(step,source):source.split(/\n\s*\n/);
        if(voices && pair.length>=2){
          const [a,b]=voiceOrder(step);
          appendVoice(pair[0],a);
          appendVoice(pair.slice(1).join('\n\n'),b);
        }else appendWithAmen(prayer,source);
      }else{
        prayer.replaceChildren();
        appendWithAmen(prayer,'Has terminado el rosario. Que la paz te acompañe.');
      }
      document.getElementById('readFull').hidden=true;
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

    // Pulsación prolongada de una intervención dorada: abrir ajustes de voces.
    let hold=null,origin=null,suppressVoiceClickUntil=0;
    reading.addEventListener('click',event=>{
      if(performance.now()<suppressVoiceClickUntil){
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },true);
    reading.addEventListener('pointerdown',e=>{
      const gold=e.target.closest('.voice-assembly,.wheel-response');
      if(!gold || !state.voiceColors || e.button!==0)return;
      origin={x:e.clientX,y:e.clientY};
      clearTimeout(hold);
      hold=setTimeout(()=>{
        hold=null;
        suppressVoiceClickUntil=performance.now()+900;
        window.rosarioOpenVoiceSettings?.();
      },620);
    });
    reading.addEventListener('pointermove',e=>{
      if(origin && Math.hypot(e.clientX-origin.x,e.clientY-origin.y)>12){
        clearTimeout(hold);hold=null;origin=null;
      }
    });
    for(const name of ['pointerup','pointercancel','pointerleave'])
      reading.addEventListener(name,()=>{clearTimeout(hold);hold=null;origin=null});
    render();
  });
})();
