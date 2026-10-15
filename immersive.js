const immersiveStyle=document.createElement('style');immersiveStyle.textContent=`
html,body{height:100%;overflow:hidden}body{overscroll-behavior:none}.layout{padding:0;max-width:none;height:100vh;height:100dvh}.layout>header,.intro,.tabs,footer,.panel,.hint,.section-dots,.simpleActions{display:none!important}main,.simple main{display:block;width:100%;height:100%}main>section{height:100%;width:100%}.rosary{touch-action:none;position:fixed;inset:0;width:100%;height:100dvh!important;max-width:none!important;border-radius:0;margin:0;background:#f6f4ef}.dark .rosary{background:#171e19}.rosary .center{display:none}.focus-chain{position:absolute;inset:0;touch-action:none}.immersive-prayer{position:absolute;left:42%;right:7%;top:50%;transform:translateY(-50%);max-height:calc(100dvh - 96px);overflow:hidden;overscroll-behavior:contain;touch-action:none;padding:18px 0;scrollbar-width:thin;pointer-events:auto}.immersive-prayer p{font:clamp(17px,2.3vw,25px)/1.75 Georgia,serif;white-space:pre-line;margin:0;color:#50594e}.dark .immersive-prayer p{color:#d9ded3}.immersive-prayer .quiet-count{display:block;margin-top:22px;font:10px system-ui;letter-spacing:2px;color:#9a937f}@media(min-width:900px){.immersive-prayer{left:38%;right:17%;max-width:650px}.immersive-prayer p{font-size:26px}}@media(max-height:500px){.immersive-prayer p{font-size:16px;line-height:1.5}.immersive-prayer{max-height:calc(100dvh - 40px)}}
`;document.head.append(immersiveStyle);
const reading=document.createElement('div');reading.className='immersive-prayer';reading.setAttribute('aria-live','polite');reading.innerHTML='<p id="immersiveText"></p><span class="quiet-count" id="immersiveCount"></span><button class="read-full" id="readFull" hidden>Leer oración completa</button>';document.querySelector('.rosary').append(reading);
const topControls=document.createElement('div');
topControls.className='top-controls';
topControls.setAttribute('role','group');
topControls.setAttribute('aria-label','Controles principales del rosario');
topControls.innerHTML='<button id="iTheme" class="top-control" type="button"></button><button id="iSettingsTop" class="top-control" type="button" aria-label="Ajustes" title="Ajustes"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M10 2.5h4l.6 2.3a8 8 0 0 1 2 1.1l2.3-.7 2 3.5-1.7 1.7a8 8 0 0 1 0 2.3l1.7 1.7-2 3.5-2.3-.7a8 8 0 0 1-2 1.1l-.6 2.3h-4l-.6-2.3a8 8 0 0 1-2-1.1l-2.3.7-2-3.5 1.7-1.7a8 8 0 0 1 0-2.3L3.1 8.7l2-3.5 2.3.7a8 8 0 0 1 2-1.1z"/></svg></button><span class="top-divider" aria-hidden="true"></span><button id="iFullscreen" class="top-control" type="button"></button>';
document.body.append(topControls);
const topStyle=document.createElement('style');
topStyle.textContent=`
.top-controls{position:fixed;top:calc(env(safe-area-inset-top,0px) + 14px);right:calc(env(safe-area-inset-right,0px) + 16px);z-index:6;display:flex;align-items:center;gap:2px;padding:3px;border:1px solid rgba(119,105,80,.12);border-radius:19px;background:rgba(255,254,250,.82);box-shadow:0 3px 16px rgba(52,43,27,.055),inset 0 1px 0 rgba(255,255,255,.8);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);touch-action:none}
.top-control{display:grid;place-items:center;width:36px;height:36px;padding:0;border:0;border-radius:14px;background:transparent;color:#56574f;touch-action:none;-webkit-tap-highlight-color:transparent;transition:background .18s,color .18s,transform .18s}
.top-control svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
.top-control:active{transform:scale(.93);background:rgba(121,106,77,.12)}
.top-control:focus-visible{outline:2px solid #a4875c;outline-offset:2px}
.top-divider{width:1px;height:18px;background:rgba(119,105,80,.13);margin:0 2px}
.dark .top-controls{background:rgba(38,46,40,.85);border-color:rgba(235,227,203,.12);box-shadow:0 4px 20px #0002,inset 0 1px 0 #ffffff08}
.dark .top-control{color:#e1decf}.dark .top-divider{background:#e8dfc522}
.dark .top-control:active{background:#e8dfc51a}
@media(hover:hover){.top-control:hover{background:rgba(121,106,77,.08)}.dark .top-control:hover{background:#e8dfc511}}
@media(prefers-reduced-motion:reduce){.top-control{transition:none}}
`;
document.head.append(topStyle);

const controlsDot=document.createElement('button');
controlsDot.className='controls-dot';
controlsDot.type='button';
controlsDot.setAttribute('aria-label','Mostrar controles del rosario');
controlsDot.setAttribute('aria-expanded','false');
controlsDot.innerHTML='<span aria-hidden="true"></span>';
controlsDot.hidden=true;
document.body.append(controlsDot);
const compactStyle=document.createElement('style');
compactStyle.textContent=`
.top-controls[hidden],.controls-dot[hidden]{display:none!important}
.controls-dot{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);right:calc(env(safe-area-inset-right,0px) + 10px);z-index:7;width:40px;height:40px;display:grid;place-items:center;padding:0;border:0;background:transparent;border-radius:50%;color:#8c7957;touch-action:none;-webkit-tap-highlight-color:transparent}
.controls-dot span{width:7px;height:7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 4px #a4875c14}
.dark .controls-dot{color:#c7b48d}
.controls-dot:focus-visible{outline:2px solid currentColor;outline-offset:-4px}
`;
document.head.append(compactStyle);
let controlsTimer;
function collapseTopControls(){
  clearTimeout(controlsTimer);
  const full=Boolean(document.fullscreenElement);
  topControls.hidden=full;
  controlsDot.hidden=!full;
  controlsDot.setAttribute('aria-expanded','false');
}
function scheduleControlsCollapse(){
  clearTimeout(controlsTimer);
  if(document.fullscreenElement)controlsTimer=setTimeout(()=>{
    if(topControls.querySelector(':focus-visible')){scheduleControlsCollapse();return;}
    collapseTopControls();
  },3000);
}
controlsDot.onclick=()=>{
  topControls.hidden=false;
  controlsDot.hidden=true;
  controlsDot.setAttribute('aria-expanded','true');
  scheduleControlsCollapse();
};
topControls.addEventListener('click',scheduleControlsCollapse);
document.addEventListener('fullscreenchange',collapseTopControls);

const topIcons={
  moon:'<path d="M20.6 14.1A8.7 8.7 0 0 1 9.9 3.4 8.7 8.7 0 1 0 20.6 14.1Z"/>',
  sun:'<circle cx="12" cy="12" r="3.8"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  collapse:'<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/>'
};
function updateTopControls(){
  const full=Boolean(document.fullscreenElement);
  const themeLabel=state.dark?'Activar modo claro':'Activar modo oscuro';
  const fullLabel=full?'Salir de pantalla completa':'Entrar en pantalla completa';
  $('iTheme').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+topIcons[state.dark?'sun':'moon']+'</svg>';
  $('iFullscreen').innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+topIcons[full?'collapse':'expand']+'</svg>';
  $('iTheme').setAttribute('aria-label',themeLabel);
  $('iTheme').title=themeLabel;
  $('iFullscreen').setAttribute('aria-label',fullLabel);
  $('iFullscreen').title=fullLabel;
}

$('iSettingsTop').onclick=()=>$('settings').click();
$('iTheme').onclick=()=>$('theme').click();

async function enterFullscreen() {
  if (document.fullscreenElement) return;
  if (!document.fullscreenEnabled || !document.documentElement.requestFullscreen)
    throw new Error('Este navegador no permite activar la pantalla completa aquí.');
  await document.documentElement.requestFullscreen({navigationUI:'hide'});
}
function notice(message) {
  show('<h2>Pantalla y controles</h2><p id="controlMessage"></p>');
  $('controlMessage').textContent=message;
}
async function fullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await enterFullscreen();
  } catch { notice('No se pudo activar la pantalla completa. Abre la web directamente en tu navegador y vuelve a pulsar el botón de pantalla completa.'); }
}
$('iFullscreen').onclick=fullscreen;
window.rosarioTestVolume=async()=>{
  try {
    await enterFullscreen();
    if (!navigator.keyboard?.lock) {
      notice('Este navegador no permite solicitar la captura de las teclas de volumen. Puedes probarlas al cerrar este aviso: si ajustan el sonido, el sistema las está reservando. Usa el swipe para avanzar.');
      return;
    }
    await navigator.keyboard.lock(['AudioVolumeUp','AudioVolumeDown']);
    notice('Captura solicitada. Cierra este aviso y prueba volumen arriba para avanzar y volumen abajo para volver. Si solo cambia el sonido, el sistema no entrega estas teclas a la web.');
  } catch {
    notice('No se pudo solicitar la captura de volumen. La pantalla completa puede funcionar aunque el sistema reserve esas teclas para el sonido.');
  }
};
document.addEventListener('fullscreenchange',()=>{
  const active=Boolean(document.fullscreenElement);
  updateTopControls();
  $('iFullscreen').setAttribute('aria-label',active?'Salir de pantalla completa':'Pantalla completa');
  $('iFullscreen').setAttribute('aria-pressed',String(active));
  if(!active) navigator.keyboard?.unlock?.();
});
let previousPrayerIndex=-1;const sectionRender=render;render=function(){sectionRender();updateTopControls();const s=steps[state.index],w=document.documentElement.clientWidth,h=window.innerHeight;let bead=s?.bead;if(bead===undefined)bead=!s||s.m>4?54:s.m<0?0:Math.min((s.m+1)*11,55);if(s?.kind==='mystery')bead=s.m*11;
const svgHeight=point(55).y+112;
const horizontalShift=Math.min(w*.22,220)-89;
chain.setAttribute('viewBox',(-horizontalShift)+' 0 '+w+' '+svgHeight);
chain.style.setProperty('--rosary-native-height',svgHeight+'px');
if(previousPrayerIndex!==state.index)
  window.rosarioScrollToBead?.(bead,!s||s.m>4||bead===55);$('immersiveText').textContent=s?prayers[s.title]:'El Señor nos bendiga, nos guarde de todo mal y nos lleve a la vida eterna. Amén.';$('immersiveCount').textContent=s?.n?`${s.n} / 10`:'';if(previousPrayerIndex!==state.index){reading.scrollTop=0;previousPrayerIndex=state.index}chain.querySelectorAll('.focus-bead').forEach(el=>{if(!s||s.m>4){el.classList.remove('active');el.setAttribute('aria-current','false')}});requestAnimationFrame(updateReading);};window.addEventListener('resize',()=>render());document.addEventListener('fullscreenchange',()=>render());
document.addEventListener('keydown',e=>{if($('modal').open||e.target.matches('input,select,textarea'))return;const volume=['AudioVolumeUp','AudioVolumeDown','VolumeUp','VolumeDown'].includes(e.key)||['AudioVolumeUp','AudioVolumeDown','VolumeUp','VolumeDown'].includes(e.code);if(!volume)return;e.preventDefault();if(e.repeat)return;if(/Up$/.test(e.key)||/Up$/.test(e.code))advance();else{state.index=Math.max(0,state.index-1);render()}},{capture:true});
// Entry point for a future Android wrapper to deliver hardware volume events.
window.rosarioHardwareKey=direction=>{if($('modal').open)return;if(direction==='up')advance();else if(direction==='down'){state.index=Math.max(0,state.index-1);render()}};

const readingStyle=document.createElement('style');
readingStyle.textContent=`
.immersive-prayer{max-height:none;overflow-y:auto;scrollbar-width:thin}
.immersive-prayer p{max-height:none;overflow:visible}
.read-full{display:block;margin-top:16px;padding:10px 0;border:0;background:none;color:#967746;text-align:left;font-size:12px;min-height:44px;touch-action:none}
.read-full[hidden]{display:none}.dark .read-full{color:#dbc18b}
#fullPrayerText{font:19px/1.8 Georgia,serif;white-space:pre-line}
.rosary-cross{filter:drop-shadow(0 3px 3px #5d452622)}
`;
document.head.append(readingStyle);
function updateReading() {
  // Nunca truncar una oración para forzar su lectura en otra ventana.
  $('readFull').hidden=true;
}
$('readFull').onclick=()=>{
  const step=steps[state.index];
  if(!step)return;
  show('<h2 id="fullPrayerTitle"></h2><div id="fullPrayerText"></div>');
  $('fullPrayerTitle').textContent=step.title;
  $('fullPrayerText').textContent=prayers[step.title];
};

// La cadena se desplaza con el scroll nativo de Android, no con
// transformaciones manuales ni timers. La barra de lectura es independiente.
window.rosarioManualOffset=0;
window.rosarioApplyChainPan=()=>{};
function stopChainInertia() {}
// One gesture handler for the entire prayer surface, including text and top edge.
// All buttons retain their own controls and scrolling.
let gesture=null,holdTimeout=null,suppressClickUntil=0;
function cancelGesture(){clearTimeout(holdTimeout);gesture=null;}
document.addEventListener('pointerdown',event=>{
  if(!event.isPrimary){cancelGesture();return;}
  if(event.button!==0||$('modal').open)return;
  suppressClickUntil=0;
  const bead=event.target.closest('.focus-bead');
  const leftArea=!!event.target.closest('.rosary-scroll-viewport,.physical-scroll-viewport');
  const scrollPane=event.target.closest('.immersive-prayer');
  const readingScroll=!!(scrollPane && scrollPane.scrollHeight>scrollPane.clientHeight+2);
  const scrollTop=scrollPane?.scrollTop||0;
  gesture={id:event.pointerId,x:event.clientX,y:event.clientY,bead,held:false,moved:false,
    readingScroll,scrollTop,scrollPane,
    leftPan:leftArea};
  if(bead)holdTimeout=setTimeout(()=>{
    if(!gesture||gesture.moved||$('modal').open)return;
    gesture.held=true;suppressClickUntil=performance.now()+800;
    selectFocusBead(bead);
  },500);
},true);
document.addEventListener('pointermove',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  if(Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y)>12){
    gesture.moved=true;clearTimeout(holdTimeout);
  }
},true);
document.addEventListener('pointerup',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const current=gesture,dy=event.clientY-current.y,dx=event.clientX-current.x;
  cancelGesture();
  if(current.held||current.moved)suppressClickUntil=performance.now()+800;
  // El desplazamiento táctil de las cuentas pertenece al navegador.
  if(current.leftPan)return;
  if($('modal').open||current.held)return;
  // Un texto largo primero se desplaza: no saltar de oración mientras se lee.
  // En sus límites se permite el avance/retroceso con otro deslizamiento.
  if(current.readingScroll){
    const pane=current.scrollPane;
    const atStart=current.scrollTop<=2;
    const atEnd=current.scrollTop>=pane.scrollHeight-pane.clientHeight-2;
    const movedScroll=Math.abs(pane.scrollTop-current.scrollTop)>5;
    if(movedScroll || !(dy>45&&atStart || dy< -45&&atEnd))return;
  }
  if(Math.abs(dy)>45&&Math.abs(dy)>Math.abs(dx)){
    suppressClickUntil=performance.now()+800;
    if(dy<0)advance();else{state.index=Math.max(0,state.index-1);render();}
  }
},true);
// En móvil, el navegador puede cancelar pointerup cuando activa pan-y.
// touchend permite continuar desde el principio o final de un texto extenso.
let touchReading=null;
reading.addEventListener('touchstart',event=>{
  if(event.touches.length!==1 || $('modal').open){touchReading=null;return;}
  const t=event.touches[0],overflow=reading.scrollHeight>reading.clientHeight+2;
  touchReading={y:t.clientY,x:t.clientX,scrollTop:reading.scrollTop,overflow,
    startedAtTop:reading.scrollTop<=2,
    startedAtBottom:reading.scrollTop>=reading.scrollHeight-reading.clientHeight-2};
},{passive:true,capture:true});
reading.addEventListener('touchend',event=>{
  if(!touchReading||!touchReading.overflow||$('modal').open)return;
  const info=touchReading;touchReading=null;
  const t=event.changedTouches[0];if(!t)return;
  const dy=t.clientY-info.y,dx=t.clientX-info.x;
  if(Math.abs(dy)<=60 || Math.abs(dy)<=Math.abs(dx))return;
  // Sólo un swipe cuyo inicio y fin estaban en el mismo límite es navegación.
  if(Math.abs(reading.scrollTop-info.scrollTop)>5)return;
  const back=dy>0&&info.startedAtTop;
  const next=dy<0&&info.startedAtBottom;
  if(!back&&!next)return;
  suppressClickUntil=performance.now()+850;
  cancelGesture();
  if(next)advance();else{state.index=Math.max(0,state.index-1);render();}
},{passive:true,capture:true});
for(const name of ['touchcancel'])
  reading.addEventListener(name,()=>{touchReading=null;},{passive:true,capture:true});
document.addEventListener('pointercancel',cancelGesture,true);
window.addEventListener('blur',cancelGesture);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelGesture();});
document.addEventListener('click',event=>{
  if(event.detail!==0&&performance.now()<suppressClickUntil){
    event.preventDefault();event.stopImmediatePropagation();return;
  }
  if($('modal').open)return;
  const bead=event.target.closest('.focus-bead');
  if(bead)selectFocusBead(bead);
  else if(event.target.closest('.rosary-cross'))advance();
},true);
render();
