/* Preferencias propias de la APK. La web en Chrome no muestra estas opciones. */
(() => {
  'use strict';
  if (!window.RosarioAndroid) return;
  const key='rosario.android.preferences.v1';
  const validActions=['next','previous','system'];
  const isoDays=['L','M','X','J','V','S','D'];
  const defaults={up:'next',down:'previous',remind:false,time:'20:00',days:[1,2,3,4,5,6,7]};
  let saved={};
  try { saved=JSON.parse(localStorage.getItem(key)||'{}'); } catch {}
  const pref={...defaults,...saved};
  if(!validActions.includes(pref.up))pref.up='next';
  if(!validActions.includes(pref.down))pref.down='previous';
  if(!Array.isArray(pref.days)||!pref.days.length)pref.days=defaults.days.slice();

  function persist(){
    try {localStorage.setItem(key,JSON.stringify(pref));}catch{}
  }
  window.rosarioAndroidGetVolumeActions=()=>({up:pref.up,down:pref.down});
  function syncKeys(){
    window.RosarioAndroid.configureVolumeActions(pref.up,pref.down);
  }
  syncKeys();

  window.rosarioAndroidReminderPermission=allowed=>{
    const message=document.getElementById('androidReminderStatus');
    if(message && !allowed && pref.remind) {
      message.textContent='Permite las notificaciones de Rosario desde los ajustes de Android.';
    }
  };

  function fieldTitle(name){
    const label=document.createElement('label');
    label.className='android-setting-label';
    label.textContent=name;
    return label;
  }
  function createRow(name,setting){
    const row=document.createElement('label');
    row.className='android-setting-row';
    const title=document.createElement('span');
    title.textContent=name;
    const select=document.createElement('select');
    const choices=[
      ['next','Siguiente oración'],
      ['previous','Oración anterior'],
      ['system','Volumen del teléfono']
    ];
    choices.forEach(([value,text])=>{
      const option=document.createElement('option');
      option.value=value;option.textContent=text;
      select.append(option);
    });
    select.value=pref[setting];
    select.setAttribute('aria-label',name);
    select.addEventListener('change',()=>{
      pref[setting]=select.value;
      persist();syncKeys();
    });
    row.append(title,select);
    return row;
  }
  function attachPreferences(){
    const host=document.getElementById('modalContent');
    if(!host || host.querySelector('.android-native-settings'))return;
    const root=document.createElement('section');
    root.className='android-native-settings';

    const title=document.createElement('h3');
    title.textContent='Android';
    root.append(title);

    const keys=document.createElement('fieldset');
    const keyTitle=document.createElement('legend');
    keyTitle.textContent='Botones de volumen';
    keys.append(keyTitle,
      createRow('Botón de subir volumen','up'),
      createRow('Botón de bajar volumen','down'));
    root.append(keys);

    const reminder=document.createElement('fieldset');
    reminder.className='android-reminder';
    const legend=document.createElement('legend');
    legend.textContent='Recordatorio para rezar';
    reminder.append(legend);
    const toggle=document.createElement('label');
    toggle.className='android-setting-row';
    const txt=document.createElement('span');
    txt.textContent='Activar recordatorio';
    const enabled=document.createElement('input');
    enabled.type='checkbox';enabled.checked=Boolean(pref.remind);
    enabled.setAttribute('aria-label','Activar recordatorio para rezar');
    toggle.append(txt,enabled);
    reminder.append(toggle);

    const timeLabel=fieldTitle('Hora del aviso');
    const time=document.createElement('input');
    time.type='time';
    time.value=/^([01]\d|2[0-3]):[0-5]\d$/.test(pref.time)?pref.time:'20:00';
    timeLabel.append(time);
    reminder.append(timeLabel);

    const daysTitle=document.createElement('p');
    daysTitle.className='android-setting-days-title';
    daysTitle.textContent='Días de la semana';
    const days=document.createElement('div');
    days.className='android-setting-days';
    isoDays.forEach((day,i)=>{
      const label=document.createElement('label');
      const input=document.createElement('input');
      input.type='checkbox';input.value=String(i+1);
      input.checked=pref.days.includes(i+1);
      const name=document.createElement('span');name.textContent=day;
      label.append(input,name);
      days.append(label);
    });
    reminder.append(daysTitle,days);

    const button=document.createElement('button');
    button.type='button';button.className='android-save-reminder';
    button.textContent='Guardar recordatorio';
    const status=document.createElement('p');
    status.id='androidReminderStatus';status.setAttribute('role','status');
    button.addEventListener('click',()=>{
      const selected=[...days.querySelectorAll('input:checked')]
        .map(el=>Number(el.value));
      if(enabled.checked&&!selected.length){
        status.textContent='Selecciona al menos un día.';return;
      }
      const [hour,minute]=(time.value||'20:00').split(':').map(Number);
      if(!Number.isInteger(hour)||!Number.isInteger(minute)){
        status.textContent='Selecciona una hora válida.';return;
      }
      pref.remind=enabled.checked;pref.time=time.value;
      pref.days=selected.length?selected:defaults.days.slice();
      persist();
      window.RosarioAndroid.configureReminder(
        pref.remind,hour,minute,pref.days.join(','));
      status.textContent=pref.remind?
        'Recordatorio configurado. Android puede ajustar ligeramente la hora.':
        'Recordatorio desactivado.';
    });
    reminder.append(button,status);
    root.append(reminder);
    host.append(root);
  }
  const settings=document.getElementById('settings');
  if(settings){
    const existing=settings.onclick;
    settings.onclick=()=>{existing?.();attachPreferences();};
  }
})();
