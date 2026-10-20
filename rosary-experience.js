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
    show('<div class="rosario-setup-welcome"><div class="rosario-setup-eyebrow">Primer uso</div><h2>Configura tu rosario</h2><p>Escoge cómo quieres avanzar. Podrás modificarlo en Ajustes.</p><div id="rosarioSetupChoices"></div><button class="advance rosario-setup-finish" type="button" id="rosarioSetupDone">Comenzar el rosario</button></div>');
    const host=byId('rosarioSetupChoices');
    host.append(makeToggle('Vibración al avanzar',state.haptics!==false,value=>{
      state.haptics=value;persist();
      if(value)window.rosarioPreviewMysteryHaptic?.('double');
    }));
    host.append(makeToggle('Avanzar tocando la pantalla',state.screenTapNavigation===true,value=>{
      state.screenTapNavigation=value;persist();render();
    }));
    const field=document.createElement('fieldset');
    field.className='rosario-setup-swipes';
    const legend=document.createElement('legend');legend.textContent='Dirección de los gestos';field.append(legend);
    const items=[
      ['follow','Según el recorrido del rosario'],
      ['uniform','Siempre hacia arriba'],
      ['down','Siempre hacia abajo']
    ];
    items.forEach(([id,label])=>{
      const row=document.createElement('label');row.className='rosario-setup-choice';
      const text=document.createElement('span');text.textContent=label;
      const radio=document.createElement('input');radio.type='radio';
      radio.name='rosarioWelcomeSwipe';radio.value=id;
      radio.checked=(state.rosarySwipeMode||'follow')===id;
      radio.addEventListener('change',()=>{
        if(!radio.checked)return;
        state.rosarySwipeMode=id;persist();
      });
      row.append(text,radio);field.append(row);
    });
    host.append(field);
    host.append(makeToggle('Mostrar la carterita al abrir',state.pouchEnabled!==false,value=>{
      window.rosarioSetPouchEnabled?.(value);
      state.pouchEnabled=value;persist();
    }));
    byId('rosarioSetupDone').onclick=()=>{
      state.rosarioFirstRunDone=true;persist();
      byId('modal').close();
    };
  }

  function renderSettingsHome(host,allNodes){
    const modal=byId('modal');
    const sections=[
      {id:'interaction',title:'Controles e interacción',caption:'Toques, deslizamientos y vibración',symbol:'✥'},
      {id:'appearance',title:'Rosario y apariencia',caption:'Presentación, colores y carterita',symbol:'◉'},
      {id:'navigation',title:'Navegación y contenido',caption:'Días, misterios, meditaciones y oraciones',symbol:'☷'},
      {id:'android',title:'Android',caption:'Recordatorios',symbol:'◷'}
    ];
    const buckets={interaction:[],appearance:[],prayers:[],voices:[],android:[],other:[]};
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
      if(cls.contains('physical-tap-settings')||cls.contains('rosario-interaction-group')||
         cls.contains('rosario-mystery-haptics')||cls.contains('rosario-haptic-compatibility')||
         node.querySelector?.('#vibration'))return 'interaction';
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

    // Las secciones sencillas quedan desplegadas en el panel principal.
    function addInline(title,items){
      if(!items.length)return;
      const group=document.createElement('section');
      group.className='rosario-settings-inline';
      const head=document.createElement('h3');head.textContent=title;
      group.append(head);
      for(const node of items){
        if(node.classList?.contains('rosario-preferences-group')){
          while(node.firstChild){
            const child=node.firstChild;
            if(child.matches?.('h3'))child.remove();
            else group.append(child);
          }
        }else group.append(node);
      }
      // El botón de controles abre otra pantalla: su regreso es a Ajustes.
      group.querySelectorAll('.rosario-navigation-settings-button,.voice-settings-link')
        .forEach(button=>button.addEventListener('click',()=>{
          modal.dataset.rosarioSettingsLevel='subpage';
        },true));
      return group;
    }
    function openHome(){
      modal.dataset.rosarioSettingsLevel='home';
      host.replaceChildren();
      host.classList.add('rosario-settings-dashboard');
      const header=document.createElement('h2');header.textContent='Ajustes';
      host.append(header);
      const menu=document.createElement('div');
      menu.className='rosario-settings-home';
      for(const section of sections){
        if(section.id!=='navigation'&&!buckets[section.id]?.length)continue;
        const button=document.createElement('button');
        button.type='button';button.className='rosario-settings-section';
        const icon=document.createElement('span');icon.className='rosario-settings-symbol';
        icon.textContent=section.symbol;
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
    function openSection(section){
      modal.dataset.rosarioSettingsLevel='section';
      host.classList.remove('rosario-settings-dashboard');
      host.replaceChildren();
      const title=document.createElement('h2');title.textContent=section.title;
      host.append(title);
      if(section.id==='interaction'){
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
    // La flecha única del encabezado retrocede a Ajustes desde
    // cualquier subsección; sólo el nivel principal vuelve al rosario.
    const modal=byId('modal');
    const close=modal?.querySelector('.close');
    close?.addEventListener('click',event=>{
      if(!['section','subpage'].includes(modal.dataset.rosarioSettingsLevel))
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      settings.onclick();
    },true);
    modal?.addEventListener('close',()=>{
      delete modal.dataset.rosarioSettingsLevel;
    });
    byId('iNavigate')?.addEventListener('click',()=>{
      delete modal.dataset.rosarioSettingsLevel;
    },true);
    const previousSettings=previous;
    settings.onclick=function(event){
      previousSettings?.call(this,event);
      const host=byId('modalContent');
      if(!host?.querySelector('#groupSelect'))return;
      renderSettingsHome(host,[...host.children]);
    };
    if(window.rosarioHadSavedStateAtLoad===false){
      requestAnimationFrame(()=>setTimeout(showFirstRun,80));
    }
  });
})();