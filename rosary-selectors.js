/* Unified accessible selection sheet for every Rosario settings select. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const modal=document.getElementById('modal');
    const content=document.getElementById('modalContent');
    if(!modal||!content)return;
    const sheetStyle=document.createElement('link');
    sheetStyle.rel='stylesheet';
    sheetStyle.href='rosary-settings-refinement.css?v=20261016-1';
    document.head.append(sheetStyle);
    const overlay=document.createElement('div');
    overlay.className='rosario-selection-overlay';
    overlay.hidden=true;
    const dialog=document.createElement('section');
    dialog.className='rosario-selection-sheet';
    dialog.setAttribute('role','dialog');
    dialog.setAttribute('aria-modal','true');
    dialog.setAttribute('aria-labelledby','rosarioSelectionTitle');
    overlay.append(dialog);
    modal.append(overlay);
    let origin=null,activeSelect=null;
    function closeSheet(restoreFocus=true){
      overlay.hidden=true;
      dialog.replaceChildren();
      if(restoreFocus)origin?.focus({preventScroll:true});
      origin=null;activeSelect=null;
    }
    window.rosarioCloseChoiceSheet=()=>{
      if(overlay.hidden)return false;
      closeSheet();
      return true;
    };
    overlay.addEventListener('click',e=>{
      if(e.target===overlay)closeSheet();
    });
    modal.addEventListener('close',()=>{
      if(!overlay.hidden)closeSheet(false);
    });
    overlay.addEventListener('keydown',e=>{
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeSheet();}
      if(e.key!=='Tab')return;
      const controls=[...dialog.querySelectorAll('button:not([disabled])')];
      if(!controls.length)return;
      const first=controls[0],last=controls[controls.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    function labelFor(select){
      if(select.id==='groupSelect')return 'Misterios del día';
      if(select.id==='prayerSelect')return 'Oración';
      if(select.closest('.controls-position-setting'))return 'Posición de los controles';
      if(select.closest('.rosary-color-variant')){
        return 'Color de '+(select.closest('.rosary-color-variant').querySelector('span:not(.rosary-color-dot)')?.textContent||'los misterios');
      }
      return select.getAttribute('aria-label')||
        select.closest('label')?.querySelector('span')?.textContent?.trim()||'Seleccionar opción';
    }
    function selectedLabel(select){
      return select.selectedOptions[0]?.textContent?.trim()||'Seleccionar';
    }
    function openSheet(select,trigger){
      if(!overlay.hidden)closeSheet(false);
      activeSelect=select;origin=trigger;
      dialog.replaceChildren();
      const header=document.createElement('div');
      header.className='rosario-selection-header';
      const title=document.createElement('h2');
      title.id='rosarioSelectionTitle';title.textContent=labelFor(select);
      const dismiss=document.createElement('button');
      dismiss.type='button';dismiss.className='rosario-selection-close';
      dismiss.setAttribute('aria-label','Cerrar opciones');
      dismiss.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      dismiss.onclick=()=>closeSheet();
      header.append(title,dismiss);
      const list=document.createElement('div');
      list.className='rosario-selection-list';
      list.setAttribute('role','listbox');
      list.setAttribute('aria-label',title.textContent);
      [...select.options].filter(o=>!o.disabled).forEach(option=>{
        const item=document.createElement('button');
        item.type='button';item.className='rosario-selection-option';
        item.setAttribute('role','option');
        const chosen=option.value===select.value;
        item.setAttribute('aria-selected',String(chosen));
        item.classList.toggle('is-selected',chosen);
        const text=document.createElement('span');text.textContent=option.textContent;
        const check=document.createElement('svg');
        check.setAttribute('viewBox','0 0 24 24');
        check.setAttribute('aria-hidden','true');
        check.innerHTML='<path d="m5 12 4.4 4.4L19 7"/>';
        item.append(text,check);
        item.onclick=()=>{
          select.value=option.value;
          select.dispatchEvent(new Event('change',{bubbles:true}));
          syncTriggers();
          closeSheet();
        };
        list.append(item);
      });
      dialog.append(header,list);
      overlay.hidden=false;
      const selected=list.querySelector('.is-selected')||list.firstElementChild;
      selected?.focus({preventScroll:true});
      requestAnimationFrame(()=>{
        if(!overlay.hidden&&selected)
          selected.scrollIntoView({block:'nearest',behavior:'instant'});
      });
    }
    function updateTrigger(select){
      const trigger=select.nextElementSibling;
      if(!trigger?.classList.contains('rosario-choice-trigger'))return;
      const name=labelFor(select);
      const value=trigger.querySelector('.rosario-choice-value');
      const label=selectedLabel(select);
      if(value.textContent!==label)value.textContent=label;
      trigger.setAttribute('aria-label',name+': '+selectedLabel(select)+'. Cambiar opción.');
    }
    function syncTriggers(){
      content.querySelectorAll('select.rosario-native-select').forEach(updateTrigger);
    }
    function upgrade(select){
      if(select.classList.contains('rosario-native-select'))return;
      if(select.multiple||select.size>1)return;
      select.classList.add('rosario-native-select');
      select.setAttribute('tabindex','-1');
      const button=document.createElement('button');
      button.type='button';
      button.className='rosario-choice-trigger';
      if(select.id==='groupSelect'||select.id==='prayerSelect')
        button.classList.add('rosario-choice-trigger--full');
      const value=document.createElement('span');
      value.className='rosario-choice-value';
      const chevron=document.createElement('svg');
      chevron.classList.add('rosario-choice-chevron');
      chevron.setAttribute('viewBox','0 0 24 24');
      chevron.setAttribute('aria-hidden','true');
      chevron.innerHTML='<path d="m5.5 9 6.5 6.5L18.5 9"/>';
      button.append(value,chevron);
      select.after(button);
      button.onclick=e=>{
        e.stopPropagation();
        openSheet(select,button);
      };
      select.addEventListener('change',syncTriggers);
      updateTrigger(select);
    }
    let updating=false;
    function upgradeAll(){
      if(updating)return;
      updating=true;
      try{
        content.querySelectorAll('select').forEach(upgrade);
        syncTriggers();
      }finally{updating=false;}
    }
    new MutationObserver(()=>upgradeAll()).observe(content,{childList:true,subtree:true});
    const settings=document.getElementById('settings');
    const previous=settings?.onclick;
    if(settings)settings.onclick=function(e){
      previous?.call(this,e);
      upgradeAll();
    };
    upgradeAll();
  });
})();
