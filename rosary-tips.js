/* Consejos discretos de descubrimiento, sin seguimiento remoto.
   Se muestran sólo al abrir, nunca mientras avanza una oración. */
(()=>{
  'use strict';
  const DAY=24*60*60*1000;
  const WEEK=7*DAY;
  let tipCard=null;
  let hideTimer=null;
  let interactionStarted=false;
  let hiddenAt=0;
  let previewIndex=0;
  let activeTarget=null;
  let highlightFrame=null;
  let targetTimer=null;
  let focusRequestId=0;

  // El cuadro se dibuja en la propia capa superior del diálogo.
  // No depende del outline del botón (que puede quedar recortado por
  // listas desplazables) ni del color del misterio.
  function positionHighlight(){
    if(!activeTarget?.isConnected||!highlightFrame)return;
    const rect=activeTarget.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const gap=5;
    highlightFrame.style.left=(rect.left-gap)+'px';
    highlightFrame.style.top=(rect.top-gap)+'px';
    highlightFrame.style.width=(rect.width+gap*2)+'px';
    highlightFrame.style.height=(rect.height+gap*2)+'px';
  }
  function clearFocusedTarget(){
    focusRequestId++;
    clearTimeout(targetTimer);
    targetTimer=null;
    window.removeEventListener('resize',positionHighlight,true);
    document.removeEventListener('scroll',positionHighlight,true);
    highlightFrame?.remove();
    highlightFrame=null;
    activeTarget=null;
  }
  // Se espera a que Navegación / Ajustes termine de construir la
  // pantalla. Sólo las interacciones humanas cierran el indicador.
  const focusControl=selector=>{
    clearFocusedTarget();
    const requestId=focusRequestId;
    let attempts=0;
    function locate(){
      if(requestId!==focusRequestId)return;
      const modal=document.getElementById('modal');
      const target=modal?.querySelector(selector);
      if(!modal?.open||!target||!target.getClientRects().length){
        if(++attempts<14)requestAnimationFrame(locate);
        return;
      }
      target.scrollIntoView({block:'center',inline:'nearest',behavior:'auto'});
      activeTarget=target;
      const frame=document.createElement('div');
      frame.className='rosario-tip-highlight-frame';
      frame.setAttribute('aria-hidden','true');
      frame.setAttribute('role','presentation');
      modal.append(frame);
      highlightFrame=frame;
      positionHighlight();
      window.addEventListener('resize',positionHighlight,true);
      document.addEventListener('scroll',positionHighlight,true);
      targetTimer=setTimeout(clearFocusedTarget,7000);
    }
    requestAnimationFrame(locate);
  };
  const openSettings=(id,selector)=>{
    document.getElementById('settings')?.click();
    window.rosarioOpenSettingsSection?.(id);
    if(selector)focusControl(selector);
  };
  const openIntentionTarget=selector=>{
    // Abrir desde la sección Navegación permite que «Atrás»
    // regrese a Ajustes en lugar de cerrar el Rosario.
    openSettings('navigation');
    window.rosarioOpenIntentionSettings?.();
    focusControl(selector);
  };
  const openFinalIntentionTarget=()=>{
    document.getElementById('settings')?.click();
    window.rosarioOpenFinalIntentionChoice?.();
    focusControl('#finalIntentionChoices .rosario-contrition-option');
  };
  const tips=[
    {
      id:'pin-intentions',
      text:'Puedes fijar una intención para que aparezca en los cinco misterios, junto a la aleatoria.',
      unused:()=>!Array.isArray(state.pinnedIntentions)||!state.pinnedIntentions.length,
      open:()=>openIntentionTarget(
        '#navList .intention-entry:not(.is-pinned) .intention-pin-btn, '+
        '#navList .intention-entry .intention-pin-btn')
    },
    {
      id:'final-intentions',
      text:'Puedes elegir entre una lista con marcas o leer las oraciones completas en las intenciones finales.',
      unused:()=>state.finalIntentionsDisplay!=='prayers',
      open:openFinalIntentionTarget
    },
    {
      id:'custom-intention-heading',
      text:'La frase que acompaña cada intención puede cambiarse, escribirse a tu gusto o desaparecer.',
      unused:()=>!state.intentionCaptionMode||state.intentionCaptionMode==='default',
      open:()=>openIntentionTarget(
        '#navList .intention-caption-settings .intention-caption-options')
    },
    {
      id:'haptic-intensity',
      text:'Puedes ajustar la intensidad y los patrones de vibración desde Controles de vibración.',
      unused:()=>state.haptics!==false&&
        (state.hapticIntensity===undefined||state.hapticIntensity==='system')&&
        (Boolean(window.RosarioAndroid)||typeof navigator.vibrate==='function'),
      open:()=>openSettings('haptics','.rosario-haptic-gear')
    }
  ];
  function hideTip(){
    clearTimeout(hideTimer);
    hideTimer=null;
    if(tipCard){tipCard.remove();tipCard=null;}
  }
  window.rosarioTipsSetEnabled=enabled=>{
    state.rosarioTipsEnabled=Boolean(enabled);
    persist();
    if(!enabled)hideTip();
  };
  function chooseTip(){
    const seen=Array.isArray(state.rosarioTipsSeen)?state.rosarioTipsSeen:[];
    return tips.find(tip=>!seen.includes(tip.id)&&tip.unused());
  }
  // Desde Ajustes se puede probar todo el catálogo, incluso si se
  // agotaron los consejos, están desactivados o faltan aperturas.
  window.rosarioShowTipPreview=()=>{
    const relevant=tips.filter(tip=>tip.unused());
    const choices=relevant.length?relevant:tips;
    const tip=choices[previewIndex%choices.length];
    previewIndex++;
    const modal=document.getElementById('modal');
    if(modal?.open)modal.close();
    hideTip();
    // No cuenta como sugerencia mostrada: la siguiente sugerencia
    // automática seguirá disponible al cumplir la cadencia.
    requestAnimationFrame(()=>showTip(tip,true));
  };
  function showTip(tip,preview=false){
    const card=document.createElement('aside');
    card.id='rosario-discovery-tip';
    card.setAttribute('aria-label','Sugerencia de función de Rosario');

    const kicker=document.createElement('p');
    kicker.className='rosario-tip-kicker';
    kicker.textContent='¿Sabías que…';
    const description=document.createElement('p');
    description.className='rosario-tip-description';
    const sentence=tip.text.replace(/[.!?\s]+$/,'').trim();
    description.textContent='…'+sentence.charAt(0).toLowerCase()+
      sentence.slice(1)+'?';
    const actions=document.createElement('div');
    actions.className='rosario-tip-actions';
    function button(label,cssClass,handler){
      const item=document.createElement('button');
      item.type='button';
      item.className=cssClass;
      item.textContent=label;
      item.addEventListener('click',handler);
      actions.append(item);
    }
    button('Probar','rosario-tip-primary',()=>{
      hideTip();
      tip.open();
    });
    button('Ahora no','rosario-tip-later',hideTip);
    button('No volver a mostrar','rosario-tip-never',()=>{
      window.rosarioTipsSetEnabled(false);
    });
    card.append(kicker,description,actions);
    document.body.append(card);
    tipCard=card;

    // Las pruebas desde Ajustes no alteran el intervalo semanal,
    // ni consumen una sugerencia pendiente.
    if(!preview){
      state.rosarioTipsLastShownAt=Date.now();
      state.rosarioTipsSeen=[
        ...new Set([...(Array.isArray(state.rosarioTipsSeen)?state.rosarioTipsSeen:[]),tip.id])
      ];
      persist();
    }
    hideTimer=setTimeout(hideTip,preview?30000:16000);
  }
  function showOnEligibleLaunch(){
    // La guía inicial tiene prioridad. Las sesiones en curso, las
    // coronillas y cualquier diálogo abierto quedan excluidos.
    if(interactionStarted||state.rosarioTipsEnabled===false||
       state.rosarioFirstRunDone!==true||
       !window.rosarioHadSavedStateAtLoad||
       state.chapletActive===true||
       document.getElementById('modal')?.open||
       document.visibilityState==='hidden')return;

    const count=Number(state.rosarioTipsOpenCount)||0;
    if(count<3)return;
    const last=Number(state.rosarioTipsLastShownAt)||0;
    if(last&&Date.now()-last<WEEK)return;
    const tip=chooseTip();
    if(tip)showTip(tip);
  }
  document.addEventListener('pointerdown',event=>{
    if(event.isTrusted)clearFocusedTarget();
    if(!tipCard||!tipCard.contains(event.target))hideTip();
    interactionStarted=true;
  },true);
  // Los .click() programáticos que abren pantallas NO deben borrar
  // el borde. Los clics reales, el teclado y los toques sí lo cierran.
  document.addEventListener('click',event=>{
    if(event.isTrusted)clearFocusedTarget();
  },true);
  document.addEventListener('keydown',event=>{
    if(event.isTrusted)clearFocusedTarget();
    if(!tipCard||!tipCard.contains(event.target))hideTip();
    interactionStarted=true;
  },true);
  document.getElementById('modal')?.addEventListener('close',clearFocusedTarget);
  document.addEventListener('rosario:daily-reset',()=>{
    hideTip();
    clearFocusedTarget();
  });

  document.addEventListener('DOMContentLoaded',()=>{
    state.rosarioTipsOpenCount=Math.min(100000,
      (Number(state.rosarioTipsOpenCount)||0)+1);
    persist();
    // Web y Android: ofrecer el consejo al abrir, antes del primer gesto.
    setTimeout(showOnEligibleLaunch,500);
  });
  // En una PWA o pestaña web, volver a primer plano no siempre recarga
  // el documento. Contar aperturas reales tras estar en segundo plano.
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden'){
      hiddenAt=Date.now();
      hideTip();
      return;
    }
    if(!hiddenAt||Date.now()-hiddenAt<10000)return;
    hiddenAt=0;
    // Después de una ausencia real, esta es una nueva apertura.
    // Nunca mostrar si el usuario ya ha interactuado desde el regreso.
    interactionStarted=false;
    state.rosarioTipsOpenCount=Math.min(100000,
      (Number(state.rosarioTipsOpenCount)||0)+1);
    persist();
    setTimeout(showOnEligibleLaunch,500);
  });
})();
