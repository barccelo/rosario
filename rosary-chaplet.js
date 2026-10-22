/* La Coronilla utiliza el mismo rosario, cuentas, texto y controles. */
(()=>{
'use strict';
const key=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
const compact=(n,max)=>Math.max(0,Math.min(max,Number.isInteger(n)?n:0));
const chaplet=[
 {title:'Señal de la cruz',m:-1,chapletIntro:'cross'},
 {title:'Padrenuestro',m:-1,chapletIntro:0},
 {title:'Avemaría',m:-1,chapletIntro:1},
 {title:'Credo',m:-1,chapletIntro:3}
];
for(let m=0;m<5;m++){
 chaplet.push({title:'Padre Eterno',m,bead:m*11,kind:'chaplet-major'});
 for(let n=1;n<=10;n++)chaplet.push({title:'Por su dolorosa Pasión',m,n,bead:m*11+n,kind:'chaplet-minor'});
}
for(let n=1;n<=3;n++)chaplet.push({title:'Santo Dios',m:5,kind:'chaplet-holy',chapletClosing:'invocation',n});
chaplet.push({title:'Oración final de la Misericordia',m:5,kind:'chaplet-optional',chapletClosing:'cross'});
chaplet.push({title:'Coronilla completada',m:5,kind:'chaplet-end',chapletClosing:'cross'});
Object.assign(prayers,{
 'Credo':'Creo en Dios, Padre todopoderoso, creador del cielo y de la tierra. Creo en Jesucristo, su único Hijo, nuestro Señor, que fue concebido por obra y gracia del Espíritu Santo; nació de Santa María Virgen; padeció bajo el poder de Poncio Pilato; fue crucificado, muerto y sepultado; descendió a los infiernos; al tercer día resucitó de entre los muertos; subió a los cielos y está sentado a la derecha de Dios, Padre todopoderoso. Desde allí ha de venir a juzgar a vivos y muertos. Creo en el Espíritu Santo, la santa Iglesia católica, la comunión de los santos, el perdón de los pecados, la resurrección de la carne y la vida eterna. Amén.',
 'Padre Eterno':'Padre Eterno, te ofrezco el Cuerpo, la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.',
 'Por su dolorosa Pasión':'Por su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.',
 'Santo Dios':'Santo Dios, Santo Fuerte, Santo Inmortal, ten misericordia de nosotros y del mundo entero.',
 'Oración final de la Misericordia':'Oh Dios Eterno, en quien la misericordia es infinita y el tesoro de compasión inagotable, vuelve a nosotros tu mirada bondadosa y aumenta tu misericordia en nosotros, para que en momentos difíciles no nos desesperemos ni nos desalentemos, sino que, con gran confianza, nos sometamos a tu santa voluntad, que es el Amor y la Misericordia mismos. Amén.',
 'Coronilla completada':'Jesús, en Ti confío.'
});
const days=[['Lun',1],['Mar',2],['Mié',3],['Jue',4],['Vie',5],['Sáb',6],['Dom',0]];
let rosarySteps=steps;
// En una reapertura, app.js ya restauró el último índice visible.
// Si éste era de la Coronilla, no debe sobrescribir el progreso del Rosario.
const returningFromChaplet=saved.chapletActive===true;
let initialSwitch=true;
state.chapletRule=['off','ask','days'].includes(state.chapletRule)?state.chapletRule:'off';
state.chapletDays=Array.isArray(state.chapletDays)?state.chapletDays.filter(n=>Number.isInteger(n)&&n>=0&&n<=6):[];
state.chapletIndex=compact(state.chapletIndex,chaplet.length);
state.rosaryIndex=compact(state.rosaryIndex??(returningFromChaplet?0:state.index),steps.length);
state.chapletActive=false;
const previousPersist=persist;
persist=function(){
 if(state.chapletActive)state.chapletIndex=state.index;
 else state.rosaryIndex=state.index;
 previousPersist();
};
function activate(mode,manual=false){
 const use=mode==='chaplet';
 if(manual){state.chapletChoiceDate=key();state.chapletChoice=mode;}
 if(initialSwitch && returningFromChaplet && !use){
  // Restaurar el índice del Rosario antes del primer render.
  state.index=state.rosaryIndex;
 }
 if(state.chapletActive!==use){
  if(state.chapletActive)state.chapletIndex=compact(state.index,chaplet.length);
  else{
   if(!(initialSwitch&&returningFromChaplet))
    state.rosaryIndex=compact(state.index,rosarySteps.length);
   rosarySteps=steps;
  }
  state.chapletActive=use;
  steps=use?chaplet:rosarySteps;
  state.index=compact(use?state.chapletIndex:state.rosaryIndex,steps.length);
  document.body.classList.toggle('chaplet-active',use);
  window.rosarioPhysicalReset?.();
 }
 initialSwitch=false;
 persist();render();
}
window.rosarioChapletCurrent=()=>state.chapletActive;
const originalAdvance=advance;
advance=function(...args){
 if(state.chapletActive && steps[state.index]?.kind==='chaplet-end'){
   window.rosarioChapletReturn();return;
 }
 return originalAdvance(...args);
};
window.rosarioChapletStart=()=>{document.getElementById('modal')?.close();activate('chaplet',true)};
window.rosarioChapletReturn=()=>{document.getElementById('modal')?.close();activate('rosary',true)};
window.rosarioChapletSkipOptional=()=>{
 if(state.chapletActive&&steps[state.index]?.kind==='chaplet-optional'){
  state.index=steps.length;persist();render();
 }
};
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
window.rosarioOpenChapletSettings=()=>{
 const host=document.getElementById('modalContent'),modal=document.getElementById('modal');
 if(!host||!modal)return;
 modal.dataset.rosarioSettingsLevel='subpage';window.rosarioUpdateBackLabel?.();
 host.classList.remove('rosario-settings-dashboard');host.replaceChildren();
 const box=node('section','chaplet-settings'),back=node('button','chaplet-settings-back','← Volver a Ajustes');
 back.id='chapletSettingsBack';back.type='button';back.onclick=()=>window.rosarioSettingsGoHome?.();
 const heading=node('h2',null,'Coronilla de la Divina Misericordia');
 const begin=node('button','chaplet-start-button',state.chapletActive?'Continuar la Coronilla':'Rezar la Coronilla ahora');
 begin.type='button';begin.onclick=window.rosarioChapletStart;
 const returnTo=node('button','chaplet-return-button','Volver al Santo Rosario');
 returnTo.hidden=!state.chapletActive;returnTo.onclick=window.rosarioChapletReturn;
 const restart=node('button','chaplet-restart-button','Reiniciar Coronilla');
 restart.hidden=state.chapletIndex===0;
 restart.onclick=()=>{state.chapletIndex=0;if(state.chapletActive)state.index=0;persist();window.rosarioPhysicalReset?.();window.rosarioChapletStart()};
 const rules=node('fieldset','chaplet-settings-rules');
 rules.append(node('legend',null,'Inicio del día'));
 const daysHeading=node('p','chaplet-settings-days-title','Días para la Coronilla'),daysBox=node('div','chaplet-schedule-days');
 days.forEach(([label,n])=>{
  const wrap=node('label','chaplet-schedule-day'),input=document.createElement('input');
  input.type='checkbox';input.value=String(n);input.checked=state.chapletDays.includes(n);
  input.onchange=()=>{state.chapletDays=[...daysBox.querySelectorAll('input:checked')].map(x=>Number(x.value));persist()};
  wrap.append(input,node('span',null,label));daysBox.append(wrap);
 });
 const refresh=()=>{
  rules.querySelectorAll('label').forEach(x=>x.classList.toggle('is-selected',x.querySelector('input').checked));
  daysHeading.hidden=daysBox.hidden=state.chapletRule!=='days';
 };
 [['off','Rosario habitual','Sin preguntas al abrir.'],['ask','Preguntar siempre','Escoger cada nuevo día.'],['days','Elegir días','Sustituir en los días marcados.']].forEach(([value,title,desc])=>{
  const label=node('label','chaplet-setting-mode'),input=document.createElement('input'),copy=node('span','chaplet-setting-mode-copy');
  input.type='radio';input.name='chapletModeRule';input.value=value;input.checked=state.chapletRule===value;
  input.onchange=()=>{if(!input.checked)return;state.chapletRule=value;state.chapletChoiceDate=key();state.chapletChoice=state.chapletActive?'chaplet':'rosary';persist();refresh()};
  copy.append(node('strong',null,title),node('small',null,desc));label.append(input,copy);rules.append(label);
 });
 box.append(back,heading,begin,returnTo,restart,rules,daysHeading,daysBox);
 host.append(box);refresh();modal.scrollTop=0;
};
function promptDay(){
 const modal=document.getElementById('modal');
 show('<section class="chaplet-daily-prompt"><h2>¿Qué deseas rezar hoy?</h2><div class="chaplet-prompt-actions"><button id="chapletChooseRosary">Santo Rosario</button><button id="chapletChooseMercy">Divina Misericordia</button></div></section>');
 const choose=mode=>{state.chapletChoiceDate=key();state.chapletChoice=mode;modal.close();activate(mode)};
 document.getElementById('chapletChooseRosary').onclick=()=>choose('rosary');
 document.getElementById('chapletChooseMercy').onclick=()=>choose('chaplet');
 modal.addEventListener('close',()=>{if(state.chapletChoiceDate!==key())choose('rosary')},{once:true});
}
function checkDay(){
 const date=key();
 if(state.chapletProgressDate!==date){state.chapletProgressDate=date;state.chapletIndex=0;}
 if(state.chapletChoiceDate===date){activate(state.chapletChoice==='chaplet'?'chaplet':'rosary');return;}
 if(state.chapletRule==='ask'){
  const modal=document.getElementById('modal');
  if(modal?.open)modal.addEventListener('close',promptDay,{once:true});
  else promptDay();
  return;
 }
 state.chapletChoiceDate=date;
 state.chapletChoice=state.chapletRule==='days'&&state.chapletDays.includes(new Date().getDay())?'chaplet':'rosary';
 activate(state.chapletChoice);
}
document.addEventListener('DOMContentLoaded',()=>{
 checkDay();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state.chapletChoiceDate!==key())checkDay()});
 window.addEventListener('pageshow',()=>{if(state.chapletChoiceDate!==key())checkDay()});
});
})();