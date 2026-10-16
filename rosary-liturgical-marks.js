/* Consistent illustrated ℣/℟ marks independent of Android's fallback font. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded',()=>{
    const sheet=document.createElement('style');
    sheet.textContent=`
      .verse-mark.rosario-liturgical-mark{
        display:inline-flex!important;align-items:baseline!important;
        justify-content:center!important;vertical-align:-.24em!important;
        width:36px!important;height:39px!important;min-width:36px!important;
        margin-right:10px!important;padding:0!important;border:0!important;
        background:none!important;line-height:1!important;
      }
      .rosario-liturgical-mark svg{
        width:36px;height:39px;display:block;overflow:visible;
        color:inherit;fill:currentColor;pointer-events:none;
      }
      .rosario-liturgical-mark .liturgical-slash{
        stroke:currentColor;fill:none;stroke-width:2.4;
        stroke-linecap:round;
      }
      .litany-wheel .rosario-liturgical-mark{
        width:33px!important;height:36px!important;min-width:33px!important;
        vertical-align:-.2em!important
      }
      .litany-wheel .rosario-liturgical-mark svg{width:33px;height:36px}
    `;
    document.head.append(sheet);
    function decorate(mark){
      if(mark.dataset.liturgicalDrawn)return;
      const value=mark.textContent?.trim()||'';
      const isResponse=/^([℟R])/.test(value);
      const letter=isResponse?'R':'V';
      // La única barra es una diagonal simple que cruza la letra.
      // V: atraviesa el centro. R: está ligeramente a la derecha.
      const slash=isResponse?'M 20 42 L 34 0':'M 13 42 L 29 0';
      mark.replaceChildren();
      mark.dataset.liturgicalDrawn='true';
      mark.classList.add('rosario-liturgical-mark');
      if(!mark.hasAttribute('aria-label'))mark.setAttribute('aria-label',isResponse?'Respuesta':'Versículo');
      mark.innerHTML='<svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">'+
        '<text x="1" y="34" font-family="Georgia, Times New Roman, serif" font-size="37">'+letter+'</text>'+
        '<path class="liturgical-slash" d="'+slash+'"/>'+
        '<circle cx="40" cy="35" r="2.7"/></svg>';
    }
    function decoratePlainText(root){
      if(!root)return;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      const nodes=[];
      let node;
      while((node=walker.nextNode())){
        if(/[℣℟]\./.test(node.nodeValue) &&
          !node.parentElement?.closest('.verse-mark,svg,script,style'))
          nodes.push(node);
      }
      nodes.forEach(node=>{
        const pieces=node.nodeValue.split(/([℣℟]\.)/g);
        if(pieces.length<2)return;
        const fragment=document.createDocumentFragment();
        pieces.forEach(part=>{
          if(/^[℣℟]\.$/.test(part)){
            const mark=document.createElement('span');
            mark.className='verse-mark';
            mark.textContent=part;decorate(mark);fragment.append(mark);
          }else if(part)fragment.append(document.createTextNode(part));
        });
        node.replaceWith(fragment);
      });
    }
    let running=false;
    function refresh(){
      if(running)return;
      running=true;
      try{
        document.querySelectorAll('.verse-mark:not([data-liturgical-drawn])').forEach(decorate);
        document.querySelectorAll('.nav-preview-reading,#fullPrayerText,.meditation-full')
          .forEach(decoratePlainText);
      }finally{running=false;}
    }
    const prayer=document.querySelector('.immersive-prayer');
    const modal=document.getElementById('modalContent');
    for(const root of [prayer,modal]){
      if(root)new MutationObserver(refresh).observe(root,{childList:true,subtree:true,characterData:true});
    }
    refresh();
  });
})();
