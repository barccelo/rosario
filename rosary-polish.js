/* Lectura inmersiva, alternancia de voces y controles persistentes. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const prayer = document.getElementById('immersiveText');
    const reading = document.querySelector('.immersive-prayer');
    if (!prayer || !reading) return;
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = 'rosary-polish.css?v=20261110-2';
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
        (step.title==='Avemaría'&&step.m===5) ||
        (step.title==='Avemaría'&&step.n===10&&(step.m===1||step.m===3)))
        return ['guide','assembly'];
      const i = step.m>=0 && step.m<5 ? step.m :
        Number.isInteger(step.dedication) ? step.dedication :
        Number.isInteger(step.intentionNumber) ? step.intentionNumber : 0;
      return i%2===0 ? ['guide','assembly'] : ['assembly','guide'];
    }
    function addVerses(parts,showVoiceLabels=false,includeChestIcon=false) {
      prayer.replaceChildren();
      // Únicamente los tres Cordero de Dios usan el diseño horizontal:
      // figura a la izquierda, versículo y respuesta a la derecha.
      // Los otros diálogos conservan el diseño y la navegación originales.
      let output=prayer;
      if(includeChestIcon){
        // El contorno del personaje se afina sin tocar la ilustración
        // ni alterar las dos líneas del golpe, el rostro o el cabello.
        // El filtro actúa únicamente sobre la capa coloreada del misterio.
        if(!document.getElementById('rosario-lamb-stroke-soften')){
          const ns='http://www.w3.org/2000/svg';
          const svg=document.createElementNS(ns,'svg');
          svg.id='rosario-lamb-stroke-soften-defs';
          svg.setAttribute('aria-hidden','true');
          svg.setAttribute('width','0');
          svg.setAttribute('height','0');
          svg.style.cssText='position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
          svg.innerHTML='<defs><filter id="rosario-lamb-stroke-soften" x="-5%" y="-5%" width="110%" height="110%">'+
            '<feMorphology in="SourceAlpha" operator="erode" radius="0.45" result="fine"/>'+
            '<feComposite in="SourceGraphic" in2="fine" operator="in"/>'+
            '</filter></defs>';
          document.body.append(svg);
        }
        const layout=document.createElement('span');
        layout.className='rosario-lamb-layout';
        const visual=document.createElement('span');
        visual.className='rosario-lamb-gesture';
        visual.setAttribute('role','img');
        visual.setAttribute('aria-label','Golpearse el lado izquierdo del pecho con la mano derecha empuñada');
        const image=document.createElement('img');
        image.src='assets/rosary-lamb-reference.webp';
        image.alt='';
        image.width=480;
        image.height=800;
        image.decoding='async';
        image.draggable=false;
        visual.append(image);
        const ink=document.createElement('span');
        ink.className='rosario-lamb-outline';
        ink.setAttribute('aria-hidden','true');
        ink.style.setProperty('--rosario-lamb-ink-mask',
          'url("assets/rosary-lamb-reference-outline.png")');
        visual.append(ink);
        image.onerror=()=>{
          image.onerror=null;
          // Recurso de respaldo en navegadores con decodificación WebP antigua.
          visual.classList.add('rosario-lamb-fallback');
          ink.style.setProperty('--rosario-lamb-ink-mask',
            'url("assets/rosary-lamb-approved-outline.png")');
          image.src='assets/rosary-lamb-approved.webp';
        };
        const divider=document.createElement('span');
        divider.className='rosario-lamb-divider';
        divider.setAttribute('aria-hidden','true');
        const words=document.createElement('span');
        words.className='rosario-lamb-copy';
        layout.append(visual,divider,words);
        prayer.append(layout);
        output=words;
      }
      parts.forEach(part=>{
        [['℣.',part.verse,'guide'],['℟.',part.response,'assembly']].forEach(([glyph,text,role])=>{
          const line=document.createElement('span');
          line.className='dialogue-line voice-'+role;
          if(showVoiceLabels){
            const label=document.createElement('span');
            label.className='voice-label';
            label.textContent=role==='guide'?'Guía':'Asamblea';
            line.append(label);
          }
          const mark=document.createElement('span');
          mark.className='verse-mark';
          mark.textContent=glyph;
          mark.setAttribute('aria-label',role==='guide'?'Versículo':'Respuesta');
          line.append(mark);
          appendWithAmen(line,text);
          output.append(line);
        });
      });
    }
    function announce(step) {
      prayer.replaceChildren();
      const ord=['primer','segundo','tercer','cuarto','quinto'][step.m];
      const sing={Gozosos:'gozoso',Dolorosos:'doloroso',
        Gloriosos:'glorioso',Luminosos:'luminoso'}[state.group];
      const intention=window.rosarioIntentionFor?.(step.m);

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
    }
    function specialSymbol() {
      prayer.append(makeCross());
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
    function appendFinalIntentionChecklist(step,target=prayer) {
      const list=document.createElement('div');
      list.className='rosario-final-intention-list';
      list.setAttribute('role','list');
      const names=step.intentionNumber===2
        ?['Padrenuestro','Avemaría','Descansen en paz']
        :['Padrenuestro','Avemaría','Gloria'];
      // La presentación inicial no marca ninguna oración; cada avance
      // incorpora una marca, y retroceder la retira naturalmente.
      const completed=step.kind==='final-intention'?0:names.indexOf(step.title)+1;
      names.forEach((name,i)=>{
        const marked=i<completed;
        const row=document.createElement('div');
        row.className='rosario-final-intention-row';
        row.classList.toggle('is-checked',marked);
        row.setAttribute('role','listitem');
        row.setAttribute('aria-label',name+(marked?', completada':', pendiente'));
        const title=document.createElement('span');
        title.textContent=name;
        const symbol=document.createElement('span');
        symbol.className='rosario-final-intention-check';
        symbol.setAttribute('aria-hidden','true');
        symbol.innerHTML='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
        row.append(title,symbol);
        list.append(row);
      });
      target.append(list);
    }
    // Un único SVG para ambos selectores: idéntico al engranaje
    // original del acto de contrición, evitando variantes torcidas.
    const quickSettingsSvg='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+
      '<circle cx="12" cy="12" r="3"/>'+
      '<path d="M10 2.5h4l.6 2.3a8 8 0 0 1 2 1.1l2.3-.7 2 3.5-1.7 1.7a8 8 0 0 1 0 2.3l1.7 1.7-2 3.5-2.3-.7a8 8 0 0 1-2 1.1l-.6 2.3h-4l-.6-2.3a8 8 0 0 1-2-1.1l-2.3.7-2-3.5 1.7-1.7a8 8 0 0 1 0-2.3L3.1 8.7l2-3.5 2.3.7a8 8 0 0 1 2-1.1z"/>'+
      '</svg>';
    function renderPrayer() {
      const step=steps[state.index];
      applyPrefs();
      const decade=!!(step && step.m>=0 && step.m<5);
      const announced=decade && step.kind==='mystery';
      const showMystery=decade && !announced &&
        (step.title==='Padrenuestro'||step.title==='Avemaría');
      reading.classList.toggle('is-mystery-announcement',!!announced);
      reading.classList.toggle('is-lamb-layout',step?.title==='Cordero de Dios'&&!!step.verse&&!!step.response);
      reading.classList.toggle('has-decade-context',!!showMystery);
      context.hidden=!showMystery;
      if(showMystery){
        document.getElementById('rosaryMysteryRoman').textContent=['I','II','III','IV','V'][step.m];
        document.getElementById('rosaryMysteryName').textContent=groups[state.group][step.m];
        context.setAttribute('aria-label','Leer meditación: '+groups[state.group][step.m]);
      }
      const isFinalIntention=Number.isInteger(step?.intentionNumber)&&
        (step.kind==='final-intention'||
         ['Padrenuestro','Avemaría','Gloria','Descansen en paz'].includes(step.title));
      // La intención de cada paso de la lista debe conservar su propio
      // encabezado. Se deriva del paso introductorio para evitar que
      // desaparezca al marcar/desmarcar oraciones.
      const intro=step?.intention||(isFinalIntention
        ?steps.find(item=>item.kind==='final-intention'&&
          item.intentionNumber===step.intentionNumber)?.intention
        :null);
      if(announced)announce(step);
      else if(step?.kind==='litany'){
        prayer.replaceChildren();
      } else if(step?.kind==='dialogue-group'){
        const edited=state.prayerEdits?.[step.title];
        const matches=edited?[...edited.matchAll(/℣\.\s*([^\n]+)\s*\n\s*℟\.\s*([\s\S]*?)(?=\n\s*\n℣\.|$)/g)]:[];
        if(matches.length===step.dialogues.length)
          addVerses(matches.map(m=>({verse:m[1].trim(),response:m[2].trim()})),true);
        else if(edited){
          prayer.replaceChildren();appendWithAmen(prayer,edited);
        }else addVerses(step.dialogues,true);
        prayer.prepend(makeCross());
      } else if(step?.verse && step?.response) {
        const edited=step.title==='Cordero de Dios'?null:state.prayerEdits?.[step.title];
        if(edited){
          const match=edited.match(/℣\.\s*([^\n]+)\s*\n\s*℟\.\s*([\s\S]+)/);
          if(match)addVerses([{verse:match[1],response:match[2]}]);
          else {prayer.replaceChildren();appendWithAmen(prayer,edited);}
        }else addVerses([step],step.title==='Estación al Santísimo Sacramento',
                      step.title==='Cordero de Dios');
      }
      else if(step){
        prayer.replaceChildren();
        const listMode=isFinalIntention&&state.finalIntentionsDisplay==='checklist';
        // Mantener la tarjeta y las tres filas en el mismo bloque visual
        // durante todos los avances, sin desplazar ni ocultar el título.
        const contentHost=listMode?document.createElement('section'):prayer;
        if(listMode){
          contentHost.className='rosario-final-intention-section';
          contentHost.setAttribute('aria-label',intro||'Intención final');
          prayer.append(contentHost);
        }
        if(step.title==='Señal de la cruz') specialSymbol();
        // En «oraciones completas», la tarjeta dorada se muestra
        // sólo al presentar cada intención, nunca sobre cada oración.
        if(intro&&(step.kind==='final-intention'||
                   state.finalIntentionsDisplay==='checklist')){
          const group=document.createElement('div');
          group.className='intention-heading-group';
          const heading=document.createElement('span');
          heading.className='intention-heading';
          const words=document.createElement('span');
          words.className='intention-heading-words';
          words.textContent=intro;
          heading.append(words);
          if(isFinalIntention){
            const picker=document.createElement('button');
            picker.type='button';
            picker.className='contrition-quick-choice intention-heading-settings';
            picker.setAttribute('aria-label','Configurar formato de intenciones finales');
            picker.innerHTML=quickSettingsSvg;
            picker.onclick=()=>window.rosarioOpenFinalIntentionChoice?.();
            // La muesca está ENCIMA y FUERA de la tarjeta.
            group.append(picker);
          }
          group.append(heading);
          if(step.kind==='final-intention' &&
             state.finalIntentionsDisplay==='prayers'){
            // Indicador independiente: debajo y fuera de la tarjeta.
            const arrow=document.createElement('span');
            arrow.className='intention-heading-next';
            arrow.setAttribute('aria-hidden','true');
            arrow.innerHTML='<svg viewBox="0 0 24 24" focusable="false">'+
              '<path d="M4 12h15m-6-6 6 6-6 6"/></svg>';
            group.append(arrow);
          }
          contentHost.append(group);
        }
        if(isFinalIntention && (state.finalIntentionsDisplay==='checklist'||step.kind==='final-intention')){
          if(listMode) appendFinalIntentionChecklist(step,contentHost);
        }else{
        const source=prayerSource(step);
        if (step.title==='Comunión espiritual' || step.title==='Salve' ||
            step.title==='Oración final'||step.title==='Señor mío Jesucristo'||
            step.title==='Bajo tu amparo') {
          const heading=document.createElement('span');
          heading.className='reading-prayer-heading';
          heading.textContent=step.title==='Salve'
            ? (state.voiceLabels!==false
              ? 'Y ahora te saludamos con una Salve'
              : 'Y ahora te saludo con una Salve')
            : step.title==='Oración final' ? 'Oración'
            : step.title==='Señor mío Jesucristo'?'Acto de contrición'
            : step.title==='Bajo tu amparo'?'Bajo tu amparo'
            : 'Comunión espiritual';
          if(step.title==='Señor mío Jesucristo'){
            // El selector sólo aparece al rezar esta oración.
            const picker=document.createElement('button');
            picker.type='button';
            picker.className='contrition-quick-choice';
            picker.setAttribute('aria-label','Cambiar acto de contrición');
            picker.innerHTML=quickSettingsSvg;
            picker.onclick=()=>window.rosarioOpenContritionChoice?.();
            heading.append(picker);
          }
          prayer.append(heading);
        }
        const voices=(step.title==='Padrenuestro'||step.title==='Avemaría'||
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
            (step.m===1||step.m===3)&&state.voiceLabels!==false;
          appendVoice(addGloria?'Gloria.\n'+second:second,b);
        }else appendWithAmen(prayer,source);
        }
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
      // Cruz de la referencia aprobada: dos trazos rectos y
      // cuadrados, mismos brazos y proporciones. SVG independiente
      // de la tipografía o biblioteca de emojis del dispositivo.
      cross.innerHTML='<svg viewBox="0 0 43 52" focusable="false" aria-hidden="true">'+
        '<path d="M21 6h3v11h9v3h-9v20h-3V20h-9v-3h9Z" '+
        'fill="currentColor"/></svg>';
      return cross;
    }
    // Se anima un único elemento real. Jamás crear una copia del
    // texto: los clones anteriores causaban superposición y negritas.
    const transitions=new WeakMap();
    // Transiciones elegidas por el usuario. Animan el único bloque de
    // lectura, sin clones ni dependencia de la escala de Android.
    function animateText(element,mode,swap){
      transitions.get(element)?.cancel();
      if(mode==='none'||!['fade','slide','soft'].includes(mode)){
        swap();return;
      }
      const raf=window.requestAnimationFrame?.bind(window);
      const cancelRaf=window.cancelAnimationFrame?.bind(window);
      if(!raf||!cancelRaf){swap();return;}
      const durations={fade:[310,450],slide:[240,570],soft:[300,560]}[mode];
      let stopped=false,handle=null,stage=0,start=null;
      const clean=()=>{
        element.style.opacity='';
        element.style.transform='';
        element.style.filter='';
        element.style.willChange='';
      };
      const task={cancel(){
        stopped=true;
        if(handle!==null)cancelRaf(handle);
        clean();
        if(transitions.get(element)===task)transitions.delete(element);
      }};
      transitions.set(element,task);
      const smooth=t=>t*t*(3-2*t);
      const draw=(progress,arriving)=>{
        const eased=smooth(Math.max(0,Math.min(progress,1)));
        const opacity=arriving?eased:1-eased;
        element.style.opacity=String(opacity);
        if(mode==='slide'){
          const distance=arriving?(1-eased)*20:-eased*13;
          element.style.transform='translate3d(0,'+distance.toFixed(2)+'px,0)';
          element.style.filter='';
        }else if(mode==='soft'){
          element.style.transform='';
          element.style.filter='blur('+((1-opacity)*5.5).toFixed(2)+'px)';
        }else{
          element.style.transform='';element.style.filter='';
        }
      };
      const frame=now=>{
        if(stopped)return;
        if(start===null)start=now;
        const progress=Math.min(1,(now-start)/durations[stage]);
        draw(progress,stage===1);
        if(progress<1){
          handle=raf(frame);return;
        }
        if(stage===0){
          swap();stage=1;start=null;draw(0,true);handle=raf(frame);
        }else{clean();transitions.delete(element);}
      };
      element.style.willChange='opacity,transform,filter';
      draw(0,false);
      handle=raf(frame);
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
    // Copiar sólo la selección real de oraciones. Así las
    // descripciones automáticas de gráficos nunca se agregan al texto.
    document.addEventListener('copy',event=>{
      const selection=window.getSelection?.();
      if(!selection||selection.isCollapsed||!event.clipboardData)return;
      const parent=node=>node?.nodeType===1?node:node?.parentElement;
      const anchor=parent(selection.anchorNode),focus=parent(selection.focusNode);
      const containers=[reading,document.getElementById('prayer'),
        document.getElementById('fullPrayerText')].filter(Boolean);
      if(!containers.some(root=>root.contains(anchor)||root.contains(focus)))return;
      const selected=selection.toString().replace(
        /\s*Un solo rosario:\s*cinco decenas en un lazo y un colgante con una cruz\.?\s*$/i,'');
      if(!selected.trim())return;
      event.clipboardData.setData('text/plain',selected);
      event.preventDefault();
    },true);

    // Los ajustes de voces sólo se abren al mantener pulsada una respuesta.
    // En Android, contextmenu puede llegar antes que el umbral del gesto:
    // se bloquea el menú nativo, pero NUNCA se utiliza para abrir ajustes.
    const VOICE_HOLD_MS=1200;
    const VOICE_HOLD_MOVE_PX=12;
    let voiceHold=null,suppressVoiceClickUntil=0;
    const voiceTarget=target=>target.closest?.('.voice-assembly,.wheel-response');
    function cancelVoiceHold(){
      if(voiceHold)clearTimeout(voiceHold.timer);
      voiceHold=null;
    }
    function startVoiceHold(source,id,x,y){
      cancelVoiceHold();
      const candidate={source,id,x,y,timer:null};
      voiceHold=candidate;
      candidate.timer=setTimeout(()=>{
        if(voiceHold!==candidate || document.hidden ||
           document.getElementById('modal')?.open)return;
        cancelVoiceHold();
        suppressVoiceClickUntil=performance.now()+950;
        window.rosarioOpenVoiceSettings?.();
      },VOICE_HOLD_MS);
    }
    function moveVoiceHold(source,id,x,y){
      if(!voiceHold||voiceHold.source!==source||voiceHold.id!==id)return;
      if(Math.hypot(x-voiceHold.x,y-voiceHold.y)>VOICE_HOLD_MOVE_PX)
        cancelVoiceHold();
    }
    reading.addEventListener('contextmenu',e=>{
      if(state.voiceColors && voiceTarget(e.target))e.preventDefault();
    });
    reading.addEventListener('click',e=>{
      if(performance.now()<suppressVoiceClickUntil){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },true);
    // Un solo temporizador por gesto: touch para Android y pointer para ratón/lápiz.
    // No iniciar dos temporizadores para el mismo dedo.
    reading.addEventListener('pointerdown',e=>{
      if(e.pointerType==='touch')return;
      if(!state.voiceColors||e.button!==0||!voiceTarget(e.target)){
        cancelVoiceHold();
        return;
      }
      startVoiceHold('pointer',e.pointerId,e.clientX,e.clientY);
    },true);
    reading.addEventListener('pointermove',e=>{
      moveVoiceHold('pointer',e.pointerId,e.clientX,e.clientY);
    },true);
    for(const name of ['pointerup','pointercancel','pointerleave'])
      reading.addEventListener(name,e=>{
        if(voiceHold?.source==='pointer'&&voiceHold.id===e.pointerId)
          cancelVoiceHold();
      },true);
    reading.addEventListener('touchstart',e=>{
      if(!state.voiceColors||e.touches.length!==1||!voiceTarget(e.target)){
        cancelVoiceHold();
        return;
      }
      const t=e.touches[0];
      startVoiceHold('touch',t.identifier,t.clientX,t.clientY);
    },{passive:true,capture:true});
    reading.addEventListener('touchmove',e=>{
      if(voiceHold?.source!=='touch')return;
      if(e.touches.length!==1){cancelVoiceHold();return;}
      const t=e.touches[0];
      moveVoiceHold('touch',t.identifier,t.clientX,t.clientY);
    },{passive:true,capture:true});
    for(const name of ['touchend','touchcancel'])
      reading.addEventListener(name,()=>{
        if(voiceHold?.source==='touch')cancelVoiceHold();
      },{passive:true,capture:true});
    window.addEventListener('blur',cancelVoiceHold);
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden)cancelVoiceHold();
    });
    render();
  });
})();
