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
    const categories=[
      {id:'interaction',title:'Controles y gestos',caption:'Toques, desplazamiento y vibraciones',symbol:'hand'},
      {id:'appearance',title:'Rosario y apariencia',caption:'Presentación, colores y carterita',symbol:'circle'},
      {id:'navigation',title:'Navegación y contenido',caption:'Días, misterios, meditaciones y oraciones',symbol:'book'},
      {id:'prayers',title:'Lectura y oraciones',caption:'Textos y acto de contrición',symbol:'type'},
      {id:'voices',title:'Guía y asamblea',caption:'Participación y respuestas',symbol:'users'},
      {id:'android',title:'Android',caption:'Recordatorios',symbol:'bell'},
      {id:'other',title:'Otros ajustes',caption:'Progreso y opciones adicionales',symbol:'sliders'}
    ];
    const buckets=Object.fromEntries(categories.map(category=>[category.id,[]]));
    const groupFor=node=>{
      const cls=node.classList;
      if(node.matches?.('#groupSelect, label[for="groupSelect"],.rosary-colors-settings,.physical-layout-settings,.physical-halo-settings'))
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
    allNodes.forEach(node=>{
      if(node.matches?.('h2')&&node.textContent.trim()==='Preferencias')return;
      buckets[groupFor(node)].push(node);
    });
    const row=makeToggle('Mostrar la carterita al abrir',state.pouchEnabled!==false,value=>{
      window.rosarioSetPouchEnabled?.(value);state.pouchEnabled=value;persist();
    });
    row.classList.add('rosario-pouch-settings-toggle');
    buckets.appearance.unshift(row);
    function openHome(){
      host.replaceChildren();
      const header=document.createElement('h2');header.textContent='Ajustes';
      const menu=document.createElement('div');menu.className='rosario-settings-home';
      for(const section of categories){
        if(section.id!=='navigation'&&!buckets[section.id].length)continue;
        const btn=document.createElement('button');
        btn.type='button';btn.className='rosario-settings-section';
        const ico=document.createElement('span');ico.className='rosario-settings-symbol';
        const symbols={hand:'✥',circle:'◉',book:'☷',type:'Aa',users:'℣',bell:'◷',sliders:'⚙'};
        ico.textContent=symbols[section.symbol]||'◦';
        const copy=document.createElement('span');copy.className='rosario-settings-copy';
        const name=document.createElement('strong');name.textContent=section.title;
        const sub=document.createElement('small');sub.textContent=section.caption;
        copy.append(name,sub);
        const chevron=document.createElement('span');chevron.className='rosario-settings-arrow';
        chevron.textContent='›';
        btn.append(ico,copy,chevron);
        btn.onclick=()=>section.id==='navigation'?
          window.rosarioOpenNavigation?.('days'):openSection(section);
        menu.append(btn);
      }
      host.append(header,menu);
      byId('modal').scrollTop=0;
    }
    function openSection(section){
      host.replaceChildren();
      const back=document.createElement('button');
      back.className='rosario-settings-back';back.type='button';
      back.textContent='‹ Ajustes';
      back.onclick=openHome;
      const title=document.createElement('h2');title.textContent=section.title;
      host.append(back,title,...buckets[section.id]);
      byId('modal').scrollTop=0;
    }
    openHome();
  }

  document.addEventListener('DOMContentLoaded',()=>{
    const settings=byId('settings');
    if(!settings)return;
    const previous=settings.onclick;
    settings.onclick=function(event){
      previous?.call(this,event);
      const host=byId('modalContent');
      if(!host?.querySelector('#groupSelect'))return;
      renderSettingsHome(host,[...host.children]);
    };
    if(window.rosarioHadSavedStateAtLoad===false){
      requestAnimationFrame(()=>setTimeout(showFirstRun,80));
    }
  });
})();