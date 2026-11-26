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

  const openSettings=id=>{
    document.getElementById('settings')?.click();
    window.rosarioOpenSettingsSection?.(id);
  };
  const tips=[
    {
      id:'pin-intentions',
      text:'Puedes fijar una intención para que aparezca en los cinco misterios, junto a la aleatoria.',
      unused:()=>!Array.isArray(state.pinnedIntentions)||!state.pinnedIntentions.length,
      open:()=>window.rosarioOpenIntentionSettings?.()
    },
    {
      id:'vertical-controls',
      text:'El punto de los controles también puede abrir un menú vertical, con etiquetas y fondo difuminado.',
      unused:()=>state.controlsMenuLayout!=='vertical',
      open:()=>openSettings('interaction')
    },
    {
      id:'final-intentions',
      text:'Puedes elegir entre una lista con marcas o leer las oraciones completas en las intenciones finales.',
      unused:()=>state.finalIntentionsDisplay!=='prayers',
      open:()=>window.rosarioOpenFinalIntentionChoice?.()
    },
    {
      id:'custom-intention-heading',
      text:'La frase que acompaña cada intención puede cambiarse, escribirse a tu gusto o desaparecer.',
      unused:()=>!state.intentionCaptionMode||state.intentionCaptionMode==='default',
      open:()=>window.rosarioOpenIntentionSettings?.()
    },
    {
      id:'haptic-intensity',
      text:'Puedes ajustar la intensidad y los patrones de vibración desde Controles de vibración.',
      unused:()=>state.haptics!==false&&
        (state.hapticIntensity===undefined||state.hapticIntensity==='system')&&
        (Boolean(window.RosarioAndroid)||typeof navigator.vibrate==='function'),
      open:()=>openSettings('haptics')
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
    kicker.textContent='¿Sabías que…?';
    const description=document.createElement('p');
    description.className='rosario-tip-description';
    description.textContent=tip.text;
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
    if(!tipCard||!tipCard.contains(event.target))hideTip();
    interactionStarted=true;
  },true);
  document.addEventListener('keydown',event=>{
    if(!tipCard||!tipCard.contains(event.target))hideTip();
    interactionStarted=true;
  },true);
  document.addEventListener('rosario:daily-reset',hideTip);

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
    if(!hiddenAt||Date.now()-hiddenAt<2000)return;
    hiddenAt=0;
    if(interactionStarted)return; // No interrumpir una sesión reanudada.
    state.rosarioTipsOpenCount=Math.min(100000,
      (Number(state.rosarioTipsOpenCount)||0)+1);
    persist();
    setTimeout(showOnEligibleLaunch,500);
  });
})();
