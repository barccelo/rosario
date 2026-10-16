/* Intenciones breves: cinco por cada uno de los veinte misterios. */
(() => {
  'use strict';
  const intentions = {
  "Gozosos": [
    [
      "Por quienes buscan descubrir la voluntad de Dios.",
      "Por las madres que esperan un hijo.",
      "Por quienes temen aceptar nuevos caminos.",
      "Por los jóvenes llamados a la vida consagrada.",
      "Por quienes necesitan confiar en las promesas de Dios."
    ],
    [
      "Por las familias que necesitan reconciliarse.",
      "Por quienes cuidan a sus familiares enfermos.",
      "Por las mujeres que viven embarazos difíciles.",
      "Por quienes sirven silenciosamente al prójimo.",
      "Por los ancianos que viven en soledad."
    ],
    [
      "Por los niños que nacen en condiciones de pobreza.",
      "Por las familias que carecen de un hogar.",
      "Por quienes pasarán la Navidad en soledad.",
      "Por los corazones que necesitan recuperar la alegría.",
      "Por los recién nacidos y sus padres."
    ],
    [
      "Por los padres que educan a sus hijos en la fe.",
      "Por los niños que reciben el bautismo.",
      "Por quienes consagran su vida al Señor.",
      "Por los ancianos que esperan con fe.",
      "Por las familias que buscan vivir en santidad."
    ],
    [
      "Por los padres que sufren la ausencia de sus hijos.",
      "Por los niños desaparecidos y sus familias.",
      "Por quienes se han alejado de la Iglesia.",
      "Por los jóvenes que buscan sentido a su vida.",
      "Por quienes desean reencontrarse con Dios."
    ]
  ],
  "Luminosos": [
    [
      "Por quienes recibirán el sacramento del bautismo.",
      "Por los cristianos que han olvidado su fe.",
      "Por los padrinos y su compromiso espiritual.",
      "Por quienes buscan renovar su vida en Cristo.",
      "Por la fidelidad a nuestras promesas bautismales."
    ],
    [
      "Por los matrimonios que atraviesan dificultades.",
      "Por los esposos que desean fortalecer su amor.",
      "Por las familias que necesitan un milagro.",
      "Por quienes preparan su matrimonio cristiano.",
      "Por los hogares donde se ha perdido la alegría."
    ],
    [
      "Por la conversión de los corazones endurecidos.",
      "Por quienes viven alejados del Evangelio.",
      "Por los sacerdotes que anuncian la Palabra.",
      "Por quienes luchan contra sus propios pecados.",
      "Por quienes necesitan descubrir la misericordia divina."
    ],
    [
      "Por quienes atraviesan una crisis de fe.",
      "Por los enfermos que necesitan esperanza.",
      "Por quienes buscan la luz en la oscuridad.",
      "Por los jóvenes que disciernen su vocación.",
      "Por quienes desean contemplar la gloria de Dios."
    ],
    [
      "Por quienes recibirán su primera comunión.",
      "Por los sacerdotes y su fidelidad eucarística.",
      "Por quienes han dejado de recibir la Eucaristía.",
      "Por los cristianos perseguidos a causa de su fe.",
      "Por quienes encuentran fortaleza en la adoración."
    ]
  ],
  "Dolorosos": [
    [
      "Por quienes sufren ansiedad y angustia.",
      "Por quienes enfrentan decisiones dolorosas.",
      "Por los enfermos que temen la muerte.",
      "Por quienes se sienten abandonados.",
      "Por quienes necesitan aceptar la voluntad divina."
    ],
    [
      "Por las víctimas de violencia y maltrato.",
      "Por quienes padecen enfermedades dolorosas.",
      "Por las personas sometidas a torturas.",
      "Por quienes sufren injusticias en silencio.",
      "Por la dignidad de quienes son humillados."
    ],
    [
      "Por quienes son despreciados a causa de su fe.",
      "Por las víctimas de burlas y humillaciones.",
      "Por quienes sufren abusos de autoridad.",
      "Por los gobernantes que necesitan humildad.",
      "Por quienes soportan acusaciones injustas."
    ],
    [
      "Por quienes cargan grandes responsabilidades familiares.",
      "Por los padres que luchan contra la pobreza.",
      "Por quienes cuidan a enfermos dependientes.",
      "Por los que han perdido su trabajo.",
      "Por quienes necesitan fortaleza ante las dificultades."
    ],
    [
      "Por quienes se encuentran en sus últimos momentos.",
      "Por las familias que lloran a sus difuntos.",
      "Por el perdón entre quienes se han herido.",
      "Por las víctimas de guerras y conflictos.",
      "Por quienes necesitan experimentar el amor de Cristo."
    ]
  ],
  "Gloriosos": [
    [
      "Por quienes han perdido la esperanza.",
      "Por las familias que viven un duelo.",
      "Por quienes desean comenzar una nueva vida.",
      "Por los cristianos que dudan de su fe.",
      "Por quienes necesitan experimentar la alegría pascual."
    ],
    [
      "Por quienes buscan alcanzar la santidad.",
      "Por los misioneros que anuncian a Cristo.",
      "Por quienes viven apegados a los bienes materiales.",
      "Por los cristianos llamados a dar testimonio.",
      "Por quienes anhelan la vida eterna."
    ],
    [
      "Por la unidad de la Iglesia.",
      "Por el Papa, los obispos y los sacerdotes.",
      "Por quienes necesitan sabiduría y discernimiento.",
      "Por los jóvenes que recibirán la confirmación.",
      "Por la renovación espiritual de nuestras comunidades."
    ],
    [
      "Por quienes esperan reunirse con sus seres queridos.",
      "Por las madres que sufren en silencio.",
      "Por quienes necesitan confiar en la vida eterna.",
      "Por los enfermos que invocan a la Virgen María.",
      "Por quienes buscan vivir con pureza de corazón."
    ],
    [
      "Por las familias consagradas a la Virgen María.",
      "Por quienes buscan la protección de nuestra Madre.",
      "Por la paz entre las naciones.",
      "Por los pecadores que necesitan conversión.",
      "Por nuestra perseverancia hasta el encuentro con Dios."
    ]
  ]
};
  const historyKey = 'rosario-intention-history-v1';
  const last = (() => { try { return JSON.parse(localStorage.getItem(historyKey) || '{}'); } catch { return {}; } })();
  if (typeof state.intentionsEnabled !== 'boolean') state.intentionsEnabled = true;
  if (!state.intentionChoices || typeof state.intentionChoices !== 'object') state.intentionChoices = {};
  const keyOf = (group, m) => group + ':' + m;
  function select(group,m,change=false) {
    const list=intentions[group]?.[m];
    if(!list) return '';
    const key=keyOf(group,m);
    let index=state.intentionChoices[key];
    if(change || !Number.isInteger(index) || index<0 || index>=list.length) {
      const previous=change ? index : last[key];
      const candidates=list.map((_,i)=>i).filter(i=>i!==previous);
      index=candidates[Math.floor(Math.random()*candidates.length)];
      state.intentionChoices[key]=index;
      last[key]=index;
      try { localStorage.setItem(historyKey,JSON.stringify(last)); } catch {}
      persist();
    }
    return list[index];
  }
  function updateIntention() {
    const step=steps[state.index];
    const active=!!(state.intentionsEnabled && step?.kind==='mystery');
    const text=active ? select(state.group,step.m) : '';
    for(const id of ['rosary-intention-panel','rosary-intention-immersive']){
      const el=document.getElementById(id);
      if(el){el.hidden=!active;el.querySelector('.rosary-intention-text').textContent=text;}
    }
  }
  function createBlock(id, parent, before=null) {
    if(!parent || document.getElementById(id))return;
    const el=document.createElement('div');
    el.id=id;el.className='rosary-intention-block';el.hidden=true;
    const heading=document.createElement('div');heading.className='rosary-intention-label';heading.textContent='Ofrecemos este misterio';
    const phrase=document.createElement('p');phrase.className='rosary-intention-text';
    const button=document.createElement('button');button.type='button';button.className='rosary-intention-another';button.textContent='Otra intención';
    button.addEventListener('click',()=>{
      const step=steps[state.index];
      if(step?.kind==='mystery'){select(state.group,step.m,true);updateIntention();}
    });
    el.append(heading,phrase,button);
    if(before)parent.insertBefore(el,before);else parent.append(el);
  }
  const style=document.createElement('style');
  style.textContent=`
    .rosary-intention-block[hidden]{display:none!important}
    .rosary-intention-block{margin:16px 0 20px;padding:14px 16px;border-radius:14px;background:rgba(161,132,81,.09);border:1px solid rgba(161,132,81,.23);text-align:center}
    .rosary-intention-label{font:11px system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;opacity:.72}
    .rosary-intention-text{font:18px/1.5 Georgia,serif;margin:10px 0;color:inherit}
    .rosary-intention-another{border:0;background:transparent;color:#977443;font:12px system-ui,sans-serif;padding:9px;min-height:36px}
    .dark .rosary-intention-another{color:#dab77c}
    .rosary-intention-setting{display:flex;align-items:center;justify-content:space-between;gap:15px}
  `;
  document.head.append(style);
  document.addEventListener('DOMContentLoaded',()=>{
    const panel=document.getElementById('prayer');
    createBlock('rosary-intention-panel',panel?.parentElement,panel);
    const immersive=document.querySelector('.immersive-prayer');
    createBlock('rosary-intention-immersive',immersive?.parentElement,immersive);
    // Los módulos anteriores ya envolvieron render; conservar toda su lógica.
    const previousRender=render;
    render=function(){previousRender();updateIntention();};
    const settings=document.getElementById('settings');
    const previousSettings=settings.onclick;
    settings.onclick=function(...args) {
      previousSettings?.apply(this,args);
      const container=document.getElementById('modalContent');
      const label=document.createElement('label');
      label.className='rosary-intention-setting';
      const caption=document.createElement('span');caption.textContent='Intenciones al anunciar cada misterio';
      const input=document.createElement('input');input.type='checkbox';input.checked=state.intentionsEnabled;
      input.onchange=()=>{state.intentionsEnabled=input.checked;persist();updateIntention();};
      label.append(caption,input);container.append(label);
    };
    updateIntention();
  });
  window.rosarioIntenciones=intentions;
})();
