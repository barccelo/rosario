/* Inicio guiado, ajustes por secciones y meditación editable. */
(() => {
  'use strict';
  const byId=id=>document.getElementById(id);

  window.rosarioMeditationText=(group,index)=>{
    const custom=state.meditationEdits?.[group]?.[index];
    if(typeof custom==='string')return custom;
    return window.rosaryFullMeditations?.[group]?.[index]||'';
  };

  // Markdown simple de los textos entregados: respeta párrafos, saltos
  // e indicaciones *cursivas*, sin interpolar HTML del usuario.
  window.rosarioRenderMeditation=(node,markdown)=>{
    if(!node)return;
    node.replaceChildren();
    const paragraphs=String(markdown||'').replace(/\r\n?/g,'\n').trim()
      .split(/\n\s*\n/g).filter(x=>x.trim());
    for(const raw of paragraphs){
      const p=document.createElement('p');
      const tokens=raw.trim().split(/(\*[^*\n]+\*)/g);
      for(const token of tokens){
        const part=token.startsWith('*')&&token.endsWith('*')&&token.length>2;
        const target=part?document.createElement('em'):document.createTextNode('');
        if(part){target.textContent=token.slice(1,-1);p.append(target);}
        else{
          const lines=token.split('\n');
          lines.forEach((line,i)=>{
            if(i)p.append(document.createElement('br'));
            p.append(document.createTextNode(line));
          });
        }
      }
      node.append(p);
    }
  };

  window.rosarioOpenMeditationEditor=(group,index)=>{
    if(!window.rosaryFullMeditations?.[group]||index<0||index>4)return;
    show('<div class="rosario-editor-screen"><button type="button" class="nav-preview-back" id="rosarioMedBack">← Volver a la meditación</button><h2 id="rosarioMedTitle"></h2><p class="rosario-med-editor-note">Puedes utilizar *cursivas* y dejar una línea en blanco entre párrafos. Los cambios se guardan en este dispositivo.</p><textarea id="rosarioMedArea" class="rosario-prayer-editor" rows="14"></textarea><div class="rosario-editor-actions"><button type="button" id="rosarioMedSave">Guardar</button><button type="button" id="rosarioMedRestore">Restaurar original</button></div></div>');
    byId('rosarioMedTitle').textContent=groups[group]?.[index]||'Meditación';
    byId('rosarioMedArea').value=window.rosarioMeditationText(group,index);
    byId('rosarioMedBack').onclick=()=>window.rosarioOpenMeditation?.(index);
    byId('rosarioMedSave').onclick=()=>{
      if(!state.meditationEdits||typeof state.meditationEdits!=='object')
        state.meditationEdits={};
      if(!state.meditationEdits[group])state.meditationEdits[group]={};
      state.meditationEdits[group][index]=byId('rosarioMedArea').value;
      persist();
      window.rosarioOpenMeditation?.(index);
    };
    byId('rosarioMedRestore').onclick=()=>{
      if(state.meditationEdits?.[group])delete state.meditationEdits[group][index];
      persist();
      window.rosarioOpenMeditation?.(index);
    };
  };

  function makeToggle(label,checked,onChange){
    const row=document.createElement('label');
    row.className='rosario-setup-choice';
    const text=document.createElement('span');text.textContent=label;
    const input=document.createElement('input');
    input.type='checkbox';input.checked=checked;
    input.addEventListener('change',()=>onChange(input.checked));
    row.append(text,input);
    return row;
  }

  function showFirstRun(){
    window.rosarioShowOnboarding?.();
  }

  // Símbolos monocromáticos de trazo uniforme, inspirados en el lenguaje
  // visual de SF Symbols. SVG propios, sin recursos ni fuentes externas.
  function settingsLineIcon(name){
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('viewBox','0 0 24 24');
    svg.setAttribute('width','21');
    svg.setAttribute('height','21');
    svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor');
    svg.setAttribute('stroke-width','1.65');
    svg.setAttribute('stroke-linecap','round');
    svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false');
    const definitions={
      // Mano con gesto de toque.
      interaction:[
        ['path',{d:'M9.2 11.5V6.1a1.5 1.5 0 0 1 3 0v5'}],
        ['path',{d:'M12.2 10.2a1.55 1.55 0 0 1 3 .6v1'}],
        ['path',{d:'M15.2 11a1.55 1.55 0 0 1 3 .6v1'}],
        ['path',{d:'M18.2 12a1.55 1.55 0 0 1 2.7 1.1v2.3c0 4-2.2 6.1-5.9 6.1h-1.3c-2.1 0-3.7-.9-4.9-2.6l-2.7-3.6a1.55 1.55 0 0 1 2.5-1.8l.6.8'}],
        ['path',{d:'M5.5 8.7 3.9 7.1M7.5 5.9V3.7M5.4 11.1H3.3'}]
      ],
      // Paleta de contorno, con la misma línea y proporción de los demás.
      appearance:[
        ['path',{d:'M12 3a9 9 0 0 0 0 18h1.1a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.35-3H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z'}],
        ['circle',{cx:'8.6',cy:'8.1',r:'1'}],
        ['circle',{cx:'13.3',cy:'7.2',r:'1'}],
        ['circle',{cx:'7.5',cy:'13',r:'1'}],
        ['circle',{cx:'12.6',cy:'12.6',r:'1'}]
      ],
      // Cuadrícula ordenada, equivalente visual a square.grid.2x2.
      navigation:[
        ['rect',{x:'3.8',y:'3.8',width:'7.1',height:'7.1',rx:'1.6'}],
        ['rect',{x:'13.1',y:'3.8',width:'7.1',height:'7.1',rx:'1.6'}],
        ['rect',{x:'3.8',y:'13.1',width:'7.1',height:'7.1',rx:'1.6'}],
        ['rect',{x:'13.1',y:'13.1',width:'7.1',height:'7.1',rx:'1.6'}]
      ],
      haptics:[
        ['path',{d:'M6 10v4M9 6v12M12 3v18M15 6v12M18 10v4'}]
      ],
      android:[
        ['path',{d:'M8 18h8M7 18h10c-1.2-1.4-1.8-2.5-1.8-4.4v-3a3.2 3.2 0 0 0-6.4 0v3C8.8 15.5 8.2 16.6 7 18Z'}],
        ['path',{d:'M10.3 20a1.9 1.9 0 0 0 3.4 0'}],
        ['path',{d:'M12 5.8V4'}]
      ]
    };
    for(const [tag,attrs] of definitions[name]||definitions.navigation){
      const node=document.createElementNS(ns,tag);
      for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);
      svg.append(node);
    }
    return svg;
  }

  function renderSettingsHome(host,allNodes){
    const modal=byId('modal');
    const sections=[
      {id:'interaction',title:'Controles e interacción',caption:'Toques, gestos y desplazamiento'},
      {id:'haptics',title:'Vibración',caption:'Intensidad, avisos y patrones personalizados'},
      {id:'appearance',title:'Rosario y apariencia',caption:'Presentación, colores y carterita'},
      {id:'navigation',title:'Navegación y contenido',caption:'Días, misterios, meditaciones y oraciones'},
      {id:'android',title:'Android',caption:'Recordatorios'}
    ];
    const buckets={interaction:[],haptics:[],appearance:[],prayers:[],voices:[],android:[],other:[]};
    // Reunir el selector original de misterios con su botón personalizado.
    // Mover ambos nodos conserva los listeners y la opción seleccionada.
    const mysterySelect=byId('groupSelect');
    const mysteryLabel=allNodes.find(node=>node.matches?.('label[for="groupSelect"]'));
    const mysteryTrigger=mysterySelect?.nextElementSibling?.classList.contains('rosario-choice-trigger')
      ?mysterySelect.nextElementSibling:null;
    const groupFor=node=>{
      const cls=node.classList;
      if(node.matches?.('.rosary-colors-settings,.physical-layout-settings,.physical-halo-settings'))
        return 'appearance';
      if(cls.contains('rosario-mystery-haptics')||
         cls.contains('rosario-haptic-compatibility')||
         node.querySelector?.('#vibration'))return 'haptics';
      if(cls.contains('physical-tap-settings')||
         cls.contains('rosario-interaction-group'))return 'interaction';
      if(cls.contains('rosario-prayer-settings-group'))return 'prayers';
      if(cls.contains('rosario-voice-settings-group'))return 'voices';
      if(cls.contains('android-native-settings'))return 'android';
      if(cls.contains('physical-side-settings')||cls.contains('rosary-color-preview'))return 'appearance';
      if(cls.contains('rosario-reading-settings')||cls.contains('rosario-text-settings'))return 'prayers';
      return 'other';
    };
    for(const node of allNodes){
      if(node.matches?.('h2')&&node.textContent.trim()==='Preferencias')continue;
      if(node===mysterySelect||node===mysteryLabel||node===mysteryTrigger)continue;
      buckets[groupFor(node)].push(node);
    }
    if(mysterySelect){
      const mysteryRow=document.createElement('div');
      mysteryRow.className='rosario-settings-mystery-picker';
      const title=document.createElement('span');
      title.textContent='Misterios del día';
      mysteryRow.append(title,mysterySelect);
      if(mysteryTrigger)mysteryRow.append(mysteryTrigger);
      // Si el select ya figuraba mejorado sin botón, permitir que el
      // actualizador de selectores vuelva a crear el disparador.
      else if(mysterySelect.classList.contains('rosario-native-select')){
        mysterySelect.classList.remove('rosario-native-select');
        mysterySelect.removeAttribute('tabindex');
      }
      mysteryLabel?.remove();
      buckets.other.unshift(mysteryRow);
    }
    const pouchToggle=makeToggle('Mostrar la carterita al abrir',
      state.pouchEnabled!==false,value=>{
        window.rosarioSetPouchEnabled?.(value);
        state.pouchEnabled=value;persist();
      });
    pouchToggle.classList.add('rosario-pouch-settings-toggle');
    buckets.appearance.unshift(pouchToggle);

    // Extraer una sola vez las opciones de los grupos originales.
    // Sus nodos se reutilizan al entrar y volver de otras pantallas,
    // en lugar de vaciar un contenedor distinto en cada apertura.
    for(const key of ['prayers','voices','other']){
      buckets[key]=buckets[key].flatMap(node=>{
        if(!node.classList?.contains('rosario-preferences-group'))
          return [node];
        return [...node.children].filter(child=>!child.matches?.('h3'));
      });
    }

    // Las secciones sencillas quedan desplegadas en el panel principal.
    function addInline(title,items){
      if(!items.length)return;
      const group=document.createElement('section');
      group.className='rosario-settings-inline';
      const head=document.createElement('h3');head.textContent=title;
      group.append(head);
      // Se trasladan los mismos elementos, con sus eventos intactos.
      // La lista persistente nunca se vacía al reconstruir Ajustes.
      for(const node of items)group.append(node);
      // El botón de controles abre otra pantalla: su regreso es a Ajustes.
      group.querySelectorAll('.rosario-navigation-settings-button,.voice-settings-link')
        .forEach(button=>{
          if(button.dataset.rosarioSettingsBackWired)return;
          button.dataset.rosarioSettingsBackWired='true';
          button.addEventListener('click',()=>{
            modal.dataset.rosarioSettingsLevel='subpage';
            window.rosarioUpdateBackLabel?.();
          },true);
        });
      return group;
    }
    function quickConfigurationButton(){
      const button=document.createElement('button');
      button.type='button';
      button.className='rosario-onboarding-launch rosario-quick-configuration';
      button.innerHTML='<span class="rosario-onboarding-launch-mark" aria-hidden="true">✧</span>'+
        '<span><strong>Configuración rápida</strong>'+
        '<small>Reiniciar guía visual de temas, gestos y controles</small></span>'+
        '<span aria-hidden="true">›</span>';
      button.onclick=()=>window.rosarioShowOnboarding?.();
      return button;
    }
    function openHome(){
      modal.dataset.rosarioSettingsLevel='home';
      window.rosarioUpdateBackLabel?.();
      host.replaceChildren();
      host.classList.add('rosario-settings-dashboard');
      const header=document.createElement('h2');header.textContent='Ajustes';
      host.append(header,quickConfigurationButton());
      const coronilla=document.createElement('button');
      coronilla.type='button';
      coronilla.className='rosario-chaplet-entry';
      coronilla.innerHTML='<span class="rosario-chaplet-entry-symbol" aria-hidden="true">✝</span>'+
        '<span class="rosario-chaplet-entry-copy"><strong>Coronilla de la Divina Misericordia</strong>'+
        '<small>Rezar ahora o configurar los días</small></span>'+
        '<span class="rosario-chaplet-entry-arrow" aria-hidden="true">›</span>';
      coronilla.onclick=()=>window.rosarioOpenChapletSettings?.();
      host.append(coronilla);
      const menu=document.createElement('div');
      menu.className='rosario-settings-home';
      for(const section of sections){
        if(section.id!=='navigation'&&!buckets[section.id]?.length)continue;
        const button=document.createElement('button');
        button.type='button';button.className='rosario-settings-section';
        const icon=document.createElement('span');icon.className='rosario-settings-symbol';
        icon.append(settingsLineIcon(section.id));
        const copy=document.createElement('span');copy.className='rosario-settings-copy';
        const label=document.createElement('strong');label.textContent=section.title;
        const sub=document.createElement('small');sub.textContent=section.caption;
        copy.append(label,sub);
        const arrow=document.createElement('span');arrow.className='rosario-settings-arrow';
        arrow.textContent='›';
        button.append(icon,copy,arrow);
        button.onclick=()=>{
          if(section.id==='navigation'){
            modal.dataset.rosarioSettingsLevel='subpage';
            window.rosarioUpdateBackLabel?.();
            window.rosarioOpenNavigation?.('days');
          }else openSection(section);
        };
        menu.append(button);
      }
      host.append(menu);
      for(const [title,items] of [
        ['Lectura y oraciones',buckets.prayers],
        ['Guía y asamblea',buckets.voices],
        ['Otros ajustes',buckets.other]
      ]){
        const inline=addInline(title,items);
        if(inline)host.append(inline);
      }
      modal.scrollTop=0;
    }
    // Un solo mecanismo de regreso para flecha, Escape y Atrás de Android.
    window.rosarioSettingsGoHome=openHome;
    window.rosarioOpenSettingsSection=id=>{
      const section=sections.find(item=>item.id===id);
      if(!section)return false;
      if(section.id==='navigation'){
        modal.dataset.rosarioSettingsLevel='subpage';
        window.rosarioUpdateBackLabel?.();
        window.rosarioOpenNavigation?.('days');
      }else openSection(section);
      return true;
    };
    function openHapticEditor(section){
      modal.dataset.rosarioSettingsLevel='subpage';
      window.rosarioUpdateBackLabel?.();
      host.replaceChildren();
      host.classList.remove('rosario-settings-dashboard');
      const wrapper=document.createElement('section');
      wrapper.id='rosarioHapticEditor';
      wrapper.className='rosario-haptic-editor';
      const back=document.createElement('button');
      back.id='rosarioHapticBack';
      back.type='button';
      back.className='rosario-haptic-editor-back';
      back.textContent='← Volver a Vibración';
      back.onclick=()=>openSection(section);
      const heading=document.createElement('h2');
      heading.textContent='Patrones de vibración';
      const help=document.createElement('p');
      help.className='rosario-haptic-editor-help';
      help.textContent='Personaliza los pulsos y las pausas en milisegundos. Cada patrón conserva su número de toques.';
      wrapper.append(back,heading,help);
      const patterns=[
        {key:'normal',name:'Corta',hint:'Avance normal · 1 pulso'},
        {key:'long',name:'Larga',hint:'Anuncio del misterio · 1 pulso'},
        {key:'double',name:'Doble',hint:'Gloria y jaculatorias · 2 pulsos'},
        {key:'triple',name:'Triple',hint:'Anuncio del misterio · 3 pulsos'}
      ];
      const appendPattern=spec=>{
        const card=document.createElement('section');
        card.className='rosario-haptic-pattern';
        const header=document.createElement('div');
        header.className='rosario-haptic-pattern-header';
        const info=document.createElement('div');
        const title=document.createElement('h3');title.textContent=spec.name;
        const hint=document.createElement('p');hint.textContent=spec.hint;
        info.append(title,hint);
        const test=document.createElement('button');
        test.type='button';test.className='rosario-haptic-test';
        test.textContent='Probar';
        test.onclick=()=>window.rosarioPreviewHapticPattern?.(spec.key);
        header.append(info,test);card.append(header);
        const fields=document.createElement('div');
        fields.className='rosario-haptic-pattern-fields';
        const original=window.rosarioGetHapticPattern?.(spec.key);
        const segments=Array.isArray(original)?original:[original||440];
        const inputs=[];
        const total=document.createElement('p');
        total.className='rosario-haptic-total';
        const update=()=>{
          const values=inputs.map(input=>Number(input.value));
          if(values.some(value=>!Number.isInteger(value)||value<20||value>1100))return;
          if(!window.rosarioSetHapticPattern?.(spec.key,values))return;
          total.textContent='Duración total: '+values.reduce((a,b)=>a+b,0)+' ms';
          window.rosarioPreviewHapticPattern?.(spec.key);
        };
        segments.forEach((duration,i)=>{
          const row=document.createElement('label');
          row.className='rosario-haptic-duration';
          const name=document.createElement('span');
          name.textContent=i%2===0?(segments.length===1?'Duración':'Pulso '+(Math.floor(i/2)+1)):'Pausa '+(Math.floor(i/2)+1);
          const control=document.createElement('span');
          control.className='rosario-haptic-duration-input';
          const input=document.createElement('input');
          input.type='number';
          input.min='20';input.max='1100';input.step='10';
          input.value=duration;input.inputMode='numeric';
          input.setAttribute('aria-label',spec.name+': '+name.textContent+' en milisegundos');
          const unit=document.createElement('span');unit.textContent='ms';
          control.append(input,unit);
          row.append(name,control);
          fields.append(row);
          inputs.push(input);
          input.addEventListener('change',()=>{
            const value=Number(input.value);
            if(!Number.isInteger(value)||value<20||value>1100){
              const last=window.rosarioGetHapticPattern?.(spec.key);
              input.value=Array.isArray(last)?last[i]:last;
              return;
            }
            update();
          });
        });
        total.textContent='Duración total: '+segments.reduce((a,b)=>a+b,0)+' ms';
        const restore=document.createElement('button');
        restore.className='rosario-haptic-restore';
        restore.type='button';
        restore.textContent='Restaurar este patrón';
        restore.onclick=()=>{
          window.rosarioResetHapticPattern?.(spec.key);
          const defaults=window.rosarioGetHapticPattern?.(spec.key);
          const parts=Array.isArray(defaults)?defaults:[defaults];
          inputs.forEach((input,i)=>{input.value=parts[i];});
          total.textContent='Duración total: '+parts.reduce((a,b)=>a+b,0)+' ms';
          window.rosarioPreviewHapticPattern?.(spec.key);
        };
        card.append(fields,total,restore);
        wrapper.append(card);
      };
      patterns.forEach(appendPattern);
      host.append(wrapper);
      modal.scrollTop=0;
    }
    function openSection(section){
      modal.dataset.rosarioSettingsLevel='section';
      window.rosarioUpdateBackLabel?.();
      host.classList.remove('rosario-settings-dashboard');
      host.replaceChildren();
      const title=document.createElement('h2');title.textContent=section.title;
      host.append(title);
      if(section.id==='haptics'){
        const top=document.createElement('div');
        top.className='rosario-haptic-section-heading';
        top.append(title);
        const gear=document.createElement('button');
        gear.className='rosario-haptic-gear';
        gear.type='button';
        gear.setAttribute('aria-label','Editar patrones y duraciones de vibración');
        gear.title='Editar patrones';
        gear.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.3 2.8h3.4l.5 2a7.6 7.6 0 0 1 1.7 1l2-.6 1.7 2.9-1.4 1.5a7.8 7.8 0 0 1 0 2l1.4 1.5-1.7 2.9-2-.6a7.6 7.6 0 0 1-1.7 1l-.5 2h-3.4l-.5-2a7.6 7.6 0 0 1-1.7-1l-2 .6-1.7-2.9 1.4-1.5a7.8 7.8 0 0 1 0-2L4.4 8.1l1.7-2.9 2 .6a7.6 7.6 0 0 1 1.7-1z" transform="translate(0 1.8)"/><circle cx="12" cy="12.3" r="2.6"/></svg>';
        gear.onclick=()=>openHapticEditor(section);
        top.append(gear);
        host.prepend(top);
        host.append(...buckets.haptics);
      }else if(section.id==='interaction'){
        for(const node of buckets.interaction){
          if(node.classList?.contains('rosario-interaction-group'))continue;
          host.append(node);
        }
        // Incluir los controles completos aquí, sin el botón intermedio.
        window.rosarioRenderNavigationPreferences?.(host);

      }else{
        host.append(...buckets[section.id]);
      }
      modal.scrollTop=0;
    }
    openHome();
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const settings=byId('settings');
    if(!settings)return;
    const previous=settings.onclick;
    const modal=byId('modal');
    const close=modal?.querySelector('.close');
    window.rosarioUpdateBackLabel=()=>{
      if(!close)return;
      const nested=['section','subpage'].includes(modal.dataset.rosarioSettingsLevel);
      const name=nested?'Volver a Ajustes':'Volver al rosario';
      close.setAttribute('aria-label',name);
      close.title=name;
    };
    // Vuelve a la lista desde una oración abierta, o a Ajustes desde
    // una sección. Nunca cierra el diálogo mientras quede un nivel.
    window.rosarioNavigateBack=()=>{
      if(!modal?.open)return false;
      if(window.rosarioCloseChoiceSheet?.())return true;
      if(!['section','subpage'].includes(modal.dataset.rosarioSettingsLevel))
        return false;
      const chapletBack=byId('chapletSettingsBack');
      if(chapletBack){chapletBack.click();return true;}
      const hapticBack=byId('rosarioHapticBack');
      if(hapticBack){hapticBack.click();return true;}
      const editor=byId('rosarioMedBack');
      if(editor){editor.click();return true;}
      const detail=byId('navDetail');
      if(detail&&!detail.hidden){
        const back=detail.querySelector('.nav-preview-back');
        if(back){back.click();return true;}
      }
      window.rosarioSettingsGoHome?.();
      return true;
    };
    close?.addEventListener('click',event=>{
      if(!window.rosarioNavigateBack?.())return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },true);
    // Escape (incluido el gesto Atrás del navegador) sigue la misma ruta.
    modal?.addEventListener('cancel',event=>{
      if(!window.rosarioNavigateBack?.())return;
      event.preventDefault();
    });
    modal?.addEventListener('close',()=>{
      delete modal.dataset.rosarioSettingsLevel;
      window.rosarioUpdateBackLabel?.();
      window.rosarioSettingsGoHome=null;
      window.rosarioOpenSettingsSection=null;
    });
    byId('iNavigate')?.addEventListener('click',()=>{
      delete modal.dataset.rosarioSettingsLevel;
      window.rosarioUpdateBackLabel?.();
    },true);
    const previousSettings=previous;
    settings.onclick=function(event){
      previousSettings?.call(this,event);
      const host=byId('modalContent');
      if(!host?.querySelector('#groupSelect'))return;
      renderSettingsHome(host,[...host.children]);
    };
    // El botón superior de tema abre Apariencia con pulsación larga.
    // El toque corto sigue alternando entre claro y oscuro.
    const theme=byId('iTheme');
    if(theme){
      let timer=null,held=false;
      const cancelHold=()=>{if(timer!==null){clearTimeout(timer);timer=null;}};
      theme.addEventListener('pointerdown',event=>{
        if(event.button!==0||modal.open)return;
        cancelHold();held=false;
        timer=setTimeout(()=>{
          timer=null;held=true;
          settings.click();
          window.rosarioOpenSettingsSection?.('appearance');
        },530);
      });
      ['pointerup','pointercancel','pointerleave'].forEach(event=>
        theme.addEventListener(event,cancelHold));
      theme.addEventListener('click',event=>{
        if(!held)return;
        held=false;
        event.preventDefault();
        event.stopImmediatePropagation();
      },true);
      theme.addEventListener('contextmenu',event=>{
        event.preventDefault();
        if(held||modal.open)return;
        cancelHold();held=true;
        settings.click();
        window.rosarioOpenSettingsSection?.('appearance');
      });
      const normalTitle=theme.title;
      theme.title=normalTitle+' · Mantener pulsado: Rosario y apariencia';
    }
    // Estilos unificados, cargados después de las hojas de componentes.
    const unified=document.createElement('link');
    unified.rel='stylesheet';
    unified.href='rosary-design-system.css?v=20261020-10';
    document.head.append(unified);
    if(window.rosarioHadSavedStateAtLoad===false&&state.rosarioFirstRunDone!==true){
      requestAnimationFrame(()=>setTimeout(showFirstRun,80));
    }
  });
})();