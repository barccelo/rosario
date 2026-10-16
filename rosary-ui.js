/* Presentación compartida de las pantallas de Rosario. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const modal=document.getElementById('modal');
    const content=document.getElementById('modalContent');
    const close=modal?.querySelector('.close');
    if(!modal||!content||!close)return;

    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='rosary-ui.css?v=20261015-1';
    document.head.append(style);

    const header=document.createElement('div');
    header.className='modal-screen-header';
    const name=document.createElement('span');
    name.className='modal-screen-name';
    name.id='modalScreenName';
    name.textContent='Rosario';
    const actions=document.createElement('div');
    actions.className='modal-screen-actions';

    const align=modal.querySelector('.modal-align-button');
    if(align)actions.append(align);
    actions.append(close);
    header.append(name,actions);
    modal.insertBefore(header,content);
    modal.setAttribute('aria-label','Pantalla de Rosario');
    close.setAttribute('aria-label','Volver al rosario');
    close.title='Volver al rosario';

    function refreshTitle(){
      if(content.querySelector('#groupSelect')){
        name.textContent='Ajustes';
      }else if(content.querySelector('.nav-tabs')){
        name.textContent='Navegación';
      }else{
        const heading=content.querySelector('h2');
        name.textContent=heading?.textContent?.trim()||'Rosario';
      }
    }
    new MutationObserver(refreshTitle).observe(content,{childList:true});
    refreshTitle();
  });
})();
