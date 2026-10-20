/* Temas de color del Rosario: clásico, misionero y misterios.
   No modifica el progreso, el texto ni el desplazamiento nativo. */
(() => {
  'use strict';

  const missionary = [
    {name:'África', color:'#23845E', border:'#23845E', label:'#FFFFFF'},
    {name:'América', color:'#BD3948', border:'#BD3948', label:'#FFFFFF'},
    {name:'Europa', color:'#FAF9F6', border:'#9BA19D', label:'#37413C'},
    {name:'Oceanía', color:'#365DAB', border:'#365DAB', label:'#FFFFFF'},
    {name:'Asia', color:'#DEB82C', border:'#D3AA22', label:'#453816'}
  ];
  const defaultVariants = {
    Dolorosos:'purple', Luminosos:'gold', Gozosos:'sky', Gloriosos:'pearl'
  };

  // Cada tema tiene una variante clara y otra oscura, con colores de
  // cuentas, contraste, fondo y acento ajustados por separado.
  const palettes = {
    Dolorosos: {
      purple: {
        label:'Morado', sample:'#76579B',
        light:{bg:'#F5EFF8',surface:'#FFF9FF',text:'#3B3341',subtle:'#EDE0F2',bead:'#76579B',outline:'#694C89',beadLabel:'#FFFFFF',active:'#AD81C8',activeFill:'#654580',link:'#9780AB'},
        dark:{bg:'#211B2B',surface:'#2F263A',text:'#EEE7F3',subtle:'#392C45',bead:'#9F7BBD',outline:'#B696D1',beadLabel:'#211B2B',active:'#DBB5F1',activeFill:'#694C82',link:'#79638E'}
      },
      red: {
        label:'Rojo',sample:'#B54D61',
        light:{bg:'#FAF0F2',surface:'#FFF9FA',text:'#443137',subtle:'#F5DFE4',bead:'#B54D61',outline:'#A63F55',beadLabel:'#FFFFFF',active:'#C46B7D',activeFill:'#8E3547',link:'#AF7B83'},
        dark:{bg:'#2B1C23',surface:'#37252D',text:'#F6E9EC',subtle:'#492C35',bead:'#C66E80',outline:'#DA92A0',beadLabel:'#251A1E',active:'#F4B2BE',activeFill:'#944A5B',link:'#965C6C'}
      }
    },
    Luminosos: {
      gold: {
        label:'Dorado',sample:'#EFBF04',
        light:{bg:'#FFFCF0',surface:'#FFFDF8',text:'#403415',subtle:'#FFF2BE',bead:'#EFBF04',outline:'#CAA007',beadLabel:'#292009',active:'#D8A900',activeFill:'#FFE172',link:'#D4A70C'},
        dark:{bg:'#241F14',surface:'#31291A',text:'#FCF2D3',subtle:'#40351E',bead:'#EFBF04',outline:'#FBD64E',beadLabel:'#241B04',active:'#EFBF04',activeFill:'#FFE57A',link:'#E0B409'}
      },
      yellow: {
        label:'Amarillo',sample:'#FFE23A',
        light:{bg:'#FFFCED',surface:'#FFFDF5',text:'#453B17',subtle:'#FFF5CA',bead:'#FFE23A',outline:'#D5AF19',beadLabel:'#322909',active:'#D8AB16',activeFill:'#FFED98',link:'#D7B12B'},
        dark:{bg:'#242114',surface:'#302D1E',text:'#FFF6D6',subtle:'#3E3926',bead:'#FFE23A',outline:'#FFED80',beadLabel:'#2B260B',active:'#FFE23A',activeFill:'#FFF4A8',link:'#F2CD3D'}
      }
    },
    Gozosos: {
      sky: {
        label:'Celeste',sample:'#70B9DE',
        light:{bg:'#ECF7FB',surface:'#F9FDFF',text:'#2D444E',subtle:'#DDEEF5',bead:'#70B9DE',outline:'#4A9BC8',beadLabel:'#173F52',active:'#2679A6',activeFill:'#CAE8F7',link:'#7AAABE'},
        dark:{bg:'#14242D',surface:'#20333E',text:'#E2F2F9',subtle:'#2A4552',bead:'#5EACD3',outline:'#8ACAE9',beadLabel:'#173440',active:'#A5E0FC',activeFill:'#397DA2',link:'#517E92'}
      },
      blue: {
        label:'Azul',sample:'#387BB9',
        light:{bg:'#EDF3FC',surface:'#FAFCFF',text:'#2A3E55',subtle:'#E0EAF8',bead:'#387BB9',outline:'#266AA7',beadLabel:'#FFFFFF',active:'#225C96',activeFill:'#A9CCEA',link:'#7498BE'},
        dark:{bg:'#142337',surface:'#20334B',text:'#E5EFFA',subtle:'#2A425A',bead:'#659FD6',outline:'#8CBDEE',beadLabel:'#172B40',active:'#B1D9FF',activeFill:'#3A6B99',link:'#567DA9'}
      }
    },
    Gloriosos: {
      pearl: {
        label:'Blanco perla',sample:'#F7F6F1',
        light:{bg:'#F4F4F0',surface:'#FFFFFF',text:'#3B4645',subtle:'#EAECE9',bead:'#F7F6F1',outline:'#929D99',beadLabel:'#586460',active:'#A7844E',activeFill:'#E8D7B7',link:'#ADB3AD'},
        dark:{bg:'#202629',surface:'#2B3335',text:'#ECEFEE',subtle:'#323C3E',bead:'#DADFD9',outline:'#AEB6AF',beadLabel:'#36423C',active:'#ECD1A0',activeFill:'#8A7A5D',link:'#7B8987'}
      }
    }
  };

  const modes = ['classic','missionary','mystery'];
  const paletteGroups = ['Dolorosos','Luminosos','Gozosos','Gloriosos'];

  function validMode(value) {
    return modes.includes(value) ? value : 'classic';
  }
  function normaliseVariants(value) {
    const result = {};
    paletteGroups.forEach(group => {
      const proposed = value && typeof value === 'object' ? value[group] : null;
      result[group] = palettes[group][proposed] ? proposed : defaultVariants[group];
    });
    return result;
  }
  function selection(group,variants,dark) {
    const supported = palettes[group] ? group : 'Gloriosos';
    const variant = palettes[supported][variants[supported]] ?
      variants[supported] : defaultVariants[supported];
    const definition = palettes[supported][variant];
    return {...definition[dark?'dark':'light'], name:definition.label};
  }

  document.addEventListener('DOMContentLoaded', () => {
    state.rosaryColorMode = validMode(state.rosaryColorMode);
    state.rosaryColorVariants = normaliseVariants(state.rosaryColorVariants);

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'rosary-colors.css?v=20261015-2';
    document.head.append(stylesheet);

    const beads = [...chain.querySelectorAll('.focus-bead')];
    beads.forEach(bead => {
      const index = Number(bead.dataset.bead);
      const group = missionary[Math.min(4,Math.floor(index/11))];
      bead.style.setProperty('--mission-color',group.color);
      bead.style.setProperty('--mission-border',group.border);
      bead.style.setProperty('--mission-text',group.label);
    });
    const stops = [...chain.querySelectorAll('#focusGlow stop')];
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function applyColors() {
      const mode = validMode(state.rosaryColorMode);
      const colors = selection(state.group,state.rosaryColorVariants,Boolean(state.dark));
      document.body.dataset.rosaryColorMode=mode;
      if(mode==='mystery'){
        const cssMap = {
          '--rc-bg':colors.bg,'--rc-surface':colors.surface,
          '--rc-text':colors.text,'--rc-subtle':colors.subtle,
          '--rc-bead':colors.bead,'--rc-outline':colors.outline,
          '--rc-bead-label':colors.beadLabel,
          '--rc-active-fill':colors.activeFill,
          '--rc-accent':colors.active,'--rc-link':colors.link
        };
        Object.entries(cssMap).forEach(([key,value])=>
          document.body.style.setProperty(key,value));
      }
      const glow=mode==='mystery' ? colors.active : '#D8B66F';
      stops.forEach(stop=>stop.setAttribute('stop-color',glow));
      if(themeMeta)themeMeta.setAttribute('content',
        mode==='mystery' ? colors.bg : (state.dark?'#171E19':'#F6F4EF'));
    }

    // El render existente ya se invoca cuando se cambia de misterio o de día.
    // Este envoltorio conserva todos los módulos anteriores de la aplicación.
    const previousRender = render;
    render = function() {
      previousRender();
      applyColors();
    };

    function swatch(color) {
      const dot=document.createElement('span');
      dot.className='rosary-color-dot';
      dot.style.background=color;
      if(color.toUpperCase()==='#FAF9F6' || color.toUpperCase()==='#F7F6F1')
        dot.style.borderColor='#9BA19D';
      return dot;
    }
    function addMode(mode,label,swatches,list) {
      const row=document.createElement('label');
      row.className='rosary-colors-mode';
      const radio=document.createElement('input');
      radio.type='radio';radio.name='rosaryColorMode';radio.value=mode;
      radio.checked=state.rosaryColorMode===mode;
      const title=document.createElement('span');
      title.className='mode-label';
      title.textContent=label;
      const dots=document.createElement('span');
      dots.className='rosary-color-dots';
      swatches.forEach(color=>dots.append(swatch(color)));
      row.append(radio,title,dots);
      radio.onchange=()=>{
        if(!radio.checked)return;
        state.rosaryColorMode=mode;
        persist();
        render();
        refreshSettings();
      };
      list.append(row);
      return row;
    }
    let refreshSettings=()=>{};
    function insertSettings(){
      const root=$('modalContent');
      if(!root || !root.querySelector('#groupSelect'))return;
      const fieldset=document.createElement('fieldset');
      fieldset.className='rosary-colors-settings';
      const legend=document.createElement('legend');
      legend.textContent='Colores del rosario';
      const list=document.createElement('div');
      list.className='rosary-colors-mode-list';
      const classic=addMode('classic','Clásico',['#B79355'],list);
      const mission=addMode('missionary','Misionero',missionary.map(item=>item.color),list);
      const myst=addMode('mystery','Según los misterios',
        ['#76579B','#EFBF04','#70B9DE','#F7F6F1'],list);

      const variations=document.createElement('div');
      variations.className='rosary-colors-variants';
      const heading=document.createElement('h3');
      heading.textContent='Variantes para cada grupo';
      variations.append(heading);
      const variants=new Map();
      paletteGroups.forEach(group=>{
        const row=document.createElement('label');
        row.className='rosary-color-variant';
        const sample=swatch(palettes[group][state.rosaryColorVariants[group]].sample);
        sample.setAttribute('aria-hidden','true');
        const name=document.createElement('span');name.textContent=group;
        row.append(sample,name);
        const options=Object.entries(palettes[group]);
        if(options.length>1){
          const selector=document.createElement('select');
          selector.setAttribute('aria-label','Color de los misterios '+group.toLowerCase());
          options.forEach(([key,definition])=>{
            const option=document.createElement('option');
            option.value=key;option.textContent=definition.label;
            selector.append(option);
          });
          selector.value=state.rosaryColorVariants[group];
          selector.onchange=()=>{
            state.rosaryColorVariants[group]=selector.value;
            persist();render();refreshSettings();
          };
          variants.set(group,{selector,sample});
          row.append(selector);
        }else{
          const name=document.createElement('small');
          name.textContent='Blanco perla';
          row.append(name);
          variants.set(group,{sample});
        }
        variations.append(row);
      });

      const preview=document.createElement('div');
      preview.className='rosary-color-preview';
      preview.setAttribute('aria-label','Vista previa de los colores seleccionados');
      const previewBeads=document.createElement('div');
      previewBeads.className='rosary-color-preview-beads';
      const dots=[];
      for(let i=0;i<5;i++){
        const bead=document.createElement('span');
        bead.className='rosary-color-preview-bead';
        bead.textContent=(i+1);
        if(i===2)bead.classList.add('is-active');
        previewBeads.append(bead);
        dots.push(bead);
      }
      const caption=document.createElement('div');
      caption.className='rosary-color-preview-caption';
      preview.append(previewBeads,caption);

      fieldset.append(legend,list,variations,preview);
      root.insertBefore(fieldset,root.querySelector('.rosario-preferences-group'));

      refreshSettings=()=>{
        if(!fieldset.isConnected)return;
        const mode=validMode(state.rosaryColorMode);
        for(const [entry,label] of [
          ['classic',classic],['missionary',mission],['mystery',myst]
        ]){
          label.classList.toggle('selected',mode===entry);
          label.querySelector('input').checked=mode===entry;
        }
        variations.hidden=mode!=='mystery';
        variants.forEach((data,group)=>{
          const variant=state.rosaryColorVariants[group];
          data.sample.style.background=palettes[group][variant].sample;
          if(data.selector)data.selector.value=variant;
        });
        const palette=selection(state.group,state.rosaryColorVariants,Boolean(state.dark));
        const background=mode==='mystery'?palette.bg:
          (state.dark?'#171E19':'#F6F4EF');
        const foreground=mode==='mystery'?palette.text:
          (state.dark?'#E7E6DD':'#343C36');
        preview.style.setProperty('--preview-bg',background);
        preview.style.setProperty('--preview-text',foreground);
        const tones=mode==='missionary'
          ? missionary.map(item=>({fill:item.color,border:item.border,text:item.label}))
          : dots.map(()=>mode==='mystery'
            ? {fill:palette.bead,border:palette.outline,text:palette.beadLabel}
            : {fill:state.dark?'#54472E':'#F0E1C5',border:'#B79355',
              text:state.dark?'#F4E3C4':'#594B33'});
        dots.forEach((dot,i)=>{
          const tone=tones[i];
          dot.style.background=tone.fill;
          dot.style.borderColor=tone.border;
          dot.style.color=tone.text;
          dot.style.setProperty('--preview-active',
            mode==='mystery'?palette.active:'#C6A466');
        });
        const suffix=mode==='mystery'
          ? state.group+' · '+palette.name
          : mode==='missionary'?'Verde · rojo · blanco · azul · amarillo'
            :'Dorado original';
        caption.textContent=suffix+' · '+(state.dark?'Fondo oscuro':'Fondo claro');
      };
      $('groupSelect')?.addEventListener('change',()=>refreshSettings());
      refreshSettings();
    }

    const priorSettings=$('settings').onclick;
    $('settings').onclick=function(event){
      priorSettings.call(this,event);
      insertSettings();
    };

    render();
  });
})();
