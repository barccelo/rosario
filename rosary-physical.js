/* Vista experimental: la cruz cuelga debajo del aro. La vista vertical original se conserva. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const stage=document.querySelector('.rosary');
    if(!stage || !window.rosarioNativeScroll)return;
    const sheet=document.createElement('link');
    sheet.rel='stylesheet';
    sheet.href='rosary-physical.css?v=20261015-1';
    document.head.append(sheet);
    state.rosaryViewLayout=state.rosaryViewLayout==='physical'?'physical':'vertical';
    const ns='http://www.w3.org/2000/svg',HEIGHT=3820;
    const location=i=>3180-i*55;
    const intro=[
      {id:'medal',y:3252,r:14},
      {id:'large1',y:3320,r:23},
      {id:'small1',y:3374,r:17},
      {id:'small2',y:3428,r:17},
      {id:'small3',y:3482,r:17},
      {id:'large2',y:3536,r:23}
    ];
    const missionary=[
      ['#23845E','#23845E','#FFFFFF'],['#BD3948','#BD3948','#FFFFFF'],
      ['#FAF9F6','#9BA19D','#37413C'],['#365DAB','#365DAB','#FFFFFF'],
      ['#DEB82C','#D3AA22','#453816']
    ];
    const viewport=document.createElement('div');
    viewport.className='physical-scroll-viewport';
    viewport.setAttribute('aria-label','Deslizar las cuentas del rosario físico');
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','physical-path');
    svg.setAttribute('role','group');
    svg.style.setProperty('--physical-path-height',HEIGHT+'px');
    viewport.append(svg);
    const ghost=document.createElementNS(ns,'svg');
    ghost.setAttribute('class','physical-ghost');
    ghost.setAttribute('viewBox','0 0 320 700');
    ghost.setAttribute('preserveAspectRatio','xMidYMid meet');
    ghost.setAttribute('aria-hidden','true');
    let faded='<path class="loop" d="M126 163 C34 160 16 275 27 409 C39 540 99 561 131 559 C183 559 226 476 236 358 C247 238 210 162 126 163 Z"/>';
    for(let i=0;i<34;i++){
      const a=2*Math.PI*i/34;
      faded+='<circle class="ghost-beads" cx="'+(131+102*Math.sin(a)).toFixed(2)+
        '" cy="'+(356+197*Math.cos(a)).toFixed(2)+'" r="'+(i%7===0?8:5)+'"/>';
    }
    faded+='<path class="side" d="M131 554 Q112 580 128 604 L130 656 M130 645 v40 m-13-23 h26"/>';
    ghost.innerHTML=faded;
    stage.append(ghost,viewport);
    const xFor=(i,w)=>Math.max(78,Math.min(150,w*.205))+12*Math.sin(i*.55);
    function drawCross(x,y,which){
      return '<g class="physical-cross" role="button" tabindex="0" data-cross="'+which+
        '" aria-label="'+(which==='start'?'Cruz inicial':'Cruz de regreso')+
        '" transform="translate('+x+' '+y+')">'+
        '<circle cy="-54" r="7" fill="none" stroke="#B49663" stroke-width="3"/>'+
        '<path d="M-8 -46 Q-8 -49 -5 -49 H5 Q8 -49 8 -46 V-19 H29 Q32 -19 32 -16 V-4 Q32 -1 29 -1 H8 V57 Q8 60 5 60 H-5 Q-8 60 -8 57 V-1 H-29 Q-32 -1 -32 -4 V-16 Q-32 -19 -29 -19 H-8 Z"/>'+
        '<path class="cross-detail" d="M0 -39 V49 M-23 -10 H23"/></g>';
    }
    function drawBead(x,y,r,attrs,label){
      return '<g class="physical-bead" role="button" tabindex="0" '+attrs+
        ' aria-label="'+label+'">'+
        '<circle class="physical-hit" cx="'+x+'" cy="'+y+'" r="'+Math.max(30,r+8)+'"/>'+
        '<circle class="halo" cx="'+x+'" cy="'+y+'" r="'+(r+18)+'" fill="#D8B66F"/>'+
        '<circle class="ring" cx="'+x+'" cy="'+y+'" r="'+r+'"/>'+
        (r===17?'<text class="number" x="'+x+'" y="'+(y+4)+'" text-anchor="middle">•</text>':'')+
        '</g>';
    }
    function draw(){
      const w=Math.max(320,document.documentElement.clientWidth);
      const x=xFor(0,w);
      svg.setAttribute('viewBox','0 0 '+w+' '+HEIGHT);
      const nodes=[{x,y:93,type:'return'}];
      for(let i=54;i>=0;i--)nodes.push({x:xFor(i,w),y:location(i),type:'bead',bead:i});
      intro.forEach((p,i)=>nodes.push({x:x+6*Math.sin(p.y*.012),y:p.y,type:i===0?'medal':'intro',r:p.r,index:i}));
      nodes.push({x,y:3690,type:'start'});
      let result='';
      for(let i=1;i<nodes.length;i++){
        const a=nodes[i-1],b=nodes[i];
        result+='<path class="physical-link" d="M'+a.x.toFixed(2)+' '+a.y+
          ' L'+b.x.toFixed(2)+' '+b.y+'"/>';
      }
      nodes.forEach(p=>{
        if(p.type==='start'||p.type==='return')result+=drawCross(p.x,p.y,p.type);
        else if(p.type==='medal')result+='<circle class="physical-medallion" cx="'+p.x+
          '" cy="'+p.y+'" r="14"/>';
        else if(p.type==='intro')result+=drawBead(p.x,p.y,p.r,'data-intro="'+p.index+'"',
          'Cuenta introductoria '+p.index);
        else{
          const big=p.bead%11===0;
          result+=drawBead(p.x,p.y,big?23:17,'data-bead="'+p.bead+'"',
            (big?'Padrenuestro':'Avemaría '+p.bead%11)+
            ', misterio '+(Math.floor(p.bead/11)+1));
        }
      });
      svg.innerHTML=result;
      svg.querySelectorAll('[data-bead]').forEach(el=>{
        const bead=Number(el.dataset.bead);
        const colors=missionary[Math.floor(bead/11)];
        el.classList.add('is-decade');
        el.style.setProperty('--mission-color',colors[0]);
        el.style.setProperty('--mission-border',colors[1]);
        el.style.setProperty('--mission-text',colors[2]);
      });
    }
    draw();
    let oldIndex=-1,oldMode='';
    function positionFor(step){
      if(!step)return{kind:'end',y:93};
      if(Number.isInteger(step.bead))return{kind:'bead',bead:step.bead,y:location(step.bead)};
      if(step.m>=0&&step.m<5){
        const bead=step.kind==='mystery'?step.m*11:Math.min(54,(step.m+1)*11-1);
        return{kind:'bead',bead,y:location(bead)};
      }
      if(step.m>=5)return{kind:'end',y:93};
      const cross=steps.findIndex(item=>item.title==='Señal de la cruz');
      const start=steps.findIndex(item=>item.kind==='mystery');
      if(state.index<=cross||cross<0)return{kind:'start',y:3690};
      const ratio=Math.max(0,Math.min(1,(state.index-cross)/Math.max(1,start-cross)));
      const index=Math.min(5,Math.floor(ratio*5));
      return{kind:'intro',intro:5-index,y:intro[5-index].y};
    }
    function paint(){
      const physical=state.rosaryViewLayout==='physical';
      document.body.classList.toggle('rosario-physical-view',physical);
      if(!physical){oldMode='vertical';oldIndex=state.index;return;}
      const selected=positionFor(steps[state.index]);
      svg.querySelectorAll('.physical-bead').forEach(el=>{
        const active=selected.kind==='bead'&&el.hasAttribute('data-bead')?
          Number(el.dataset.bead)===selected.bead:
          selected.kind==='intro'&&el.hasAttribute('data-intro')&&
          Number(el.dataset.intro)===selected.intro;
        el.classList.toggle('active',active);
        el.setAttribute('aria-current',active?'step':'false');
        const idx=el.hasAttribute('data-bead') ?
          steps.findIndex(t=>t.bead===Number(el.dataset.bead)):-1;
        el.classList.toggle('done',idx>=0&&idx<state.index);
      });
      if(oldMode!=='physical'||oldIndex!==state.index){
        const max=Math.max(0,viewport.scrollHeight-viewport.clientHeight);
        const target=selected.kind==='end'?0:
          Math.max(0,selected.y-viewport.clientHeight*.68);
        viewport.scrollTop=Math.min(max,target);
      }
      oldMode='physical';oldIndex=state.index;
    }
    let pending=false;
    viewport.addEventListener('scroll',()=>{
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{
        pending=false;
        const max=Math.max(1,viewport.scrollHeight-viewport.clientHeight);
        ghost.style.setProperty('--physical-parallax',
          ((viewport.scrollTop/max-.5)*10).toFixed(2)+'px');
      });
    },{passive:true});
    function selectNode(node){
      if(node.hasAttribute('data-cross')){
        if(node.dataset.cross==='return')state.index=steps.length;
        else{
          const start=steps.findIndex(t=>t.title==='Señal de la cruz');
          if(start<0)return;
          state.index=start;
        }
      }else if(node.hasAttribute('data-bead')){
        const index=steps.findIndex(t=>t.bead===Number(node.dataset.bead));
        if(index<0)return;
        state.index=index;
      }else if(node.hasAttribute('data-intro')){
        const start=steps.findIndex(t=>t.title==='Señal de la cruz');
        if(start<0)return;
        state.index=Math.min(steps.length-1,
          start+Math.round((5-Number(node.dataset.intro))));
      }
      render();
    }
    svg.addEventListener('click',e=>{
      const node=e.target.closest('[data-cross],[data-bead],[data-intro]');
      if(node)selectNode(node);
    });
    svg.addEventListener('keydown',e=>{
      if(e.key!=='Enter'&&e.key!==' ')return;
      const node=e.target.closest('[data-cross],[data-bead],[data-intro]');
      if(node){e.preventDefault();selectNode(node);}
    });
    const renderOriginal=render;
    render=function(){renderOriginal();paint();};
    const settingsOriginal=$('settings').onclick;
    $('settings').onclick=function(event){
      settingsOriginal.call(this,event);
      const root=$('modalContent');
      if(!root.querySelector('#groupSelect'))return;
      const field=document.createElement('fieldset');
      field.className='physical-layout-settings';
      const legend=document.createElement('legend');
      legend.textContent='Presentación del rosario';
      const list=document.createElement('div');
      list.className='physical-layout-options';
      [
        {id:'vertical',name:'Vista vertical',help:'Conserva exactamente el diseño actual.'},
        {id:'physical',name:'Rosario físico · experimental',help:'Cruz abajo, aro tenue y movimiento de las cuentas hacia arriba.'}
      ].forEach(item=>{
        const label=document.createElement('label');
        label.className='physical-layout-option';
        const radio=document.createElement('input');
        radio.type='radio';radio.name='rosaryViewLayout';radio.value=item.id;
        radio.checked=state.rosaryViewLayout===item.id;
        const body=document.createElement('span');
        const title=document.createElement('strong');
        title.textContent=item.name;
        const help=document.createElement('small');
        help.textContent=item.help;
        body.append(title,help);
        label.append(radio,body);
        label.classList.toggle('selected',radio.checked);
        radio.onchange=()=>{
          if(!radio.checked)return;
          state.rosaryViewLayout=item.id;
          persist();render();
          root.querySelectorAll('.physical-layout-option').forEach(row=>
            row.classList.toggle('selected',row.querySelector('input').checked));
        };
        list.append(label);
      });
      const hint=document.createElement('p');
      hint.className='physical-layout-hint';
      hint.textContent='Prueba visual: la cruz inferior es el punto inicial; las cuentas ascienden hacia el aro y se termina con el regreso simbólico a la cruz. La silueta tenue no es interactiva.';
      field.append(legend,list,hint);
      const controls=root.querySelector('.controls-position-setting');
      if(controls)root.insertBefore(field,controls);
      else root.append(field);
    };
    window.addEventListener('resize',()=>{
      if(state.rosaryViewLayout!=='physical')return;
      draw();oldIndex=-1;paint();
    });
    paint();
  });
})();
