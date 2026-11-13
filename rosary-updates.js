/* Aviso ligero de actualizaciones: una consulta al abrir, nunca sondeo continuo.
   GitHub Releases sigue siendo la fuente de APK firmadas, sin servidor adicional. */
(() => {
  'use strict';
  const API='https://api.github.com/repos/barccelo/rosario/releases/latest';
  const isNative=typeof window.RosarioAndroid?.getAppVersion==='function';
  const isAndroid=/Android/i.test(navigator.userAgent);
  if(!isNative&&!isAndroid)return;

  const compare=(a,b)=>{
    const parse=v=>{
      const match=/^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v||''));
      return match?match.slice(1).map(Number):null;
    };
    const aa=parse(a),bb=parse(b);
    if(!aa||!bb)return 0;
    for(let i=0;i<3;i++)if(aa[i]!==bb[i])return aa[i]>bb[i]?1:-1;
    return 0;
  };
  const releaseAsset=(release)=>{
    const tag=String(release?.tag_name||'');
    if(!/^v\d+\.\d+\.\d+$/.test(tag)||release.draft||release.prerelease)return null;
    const name='Rosario-'+tag+'.apk';
    const url='https://github.com/barccelo/rosario/releases/download/'+tag+'/'+name;
    if(!release.assets?.some(a=>a.name===name&&a.state==='uploaded'&&a.browser_download_url===url))
      return null;
    return {tag,url};
  };
  const createNotice=(title,detail)=>{
    document.getElementById('rosaryUpdateNotice')?.remove();
    const root=document.createElement('section');
    root.id='rosaryUpdateNotice';
    root.className='rosary-update-notice';
    root.setAttribute('role','status');
    const heading=document.createElement('strong');
    heading.textContent=title;
    const description=document.createElement('p');
    description.textContent=detail;
    const actions=document.createElement('div');
    actions.className='rosary-update-actions';
    const later=document.createElement('button');
    later.type='button';
    later.className='rosary-update-later';
    later.textContent='Más tarde';
    later.onclick=()=>root.remove();
    actions.append(later);
    root.append(heading,description,actions);
    document.body.append(root);
    return {root,description,actions,later};
  };
  const addButton=(actions,text,fn)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='rosary-update-primary';
    button.textContent=text;
    button.addEventListener('click',fn);
    actions.append(button);
    return button;
  };
  const nativeDownload=(asset)=>{
    const notice=createNotice('Rosario '+asset.tag+' disponible',
      'Hay una nueva versión. Descárgala y decide cuándo instalarla.');
    const button=addButton(notice.actions,'Descargar APK',()=>{
      try{
        if(!window.RosarioAndroid.downloadUpdate(asset.url,asset.tag))
          throw new Error('No se pudo iniciar la descarga.');
        button.disabled=true;
        button.textContent='Descargando…';
        notice.description.textContent='Android descargará el APK firmado. No se instalará sin tu confirmación.';
        monitorDownload(notice,asset);
      }catch{
        notice.description.textContent='No se pudo iniciar la descarga desde Android.';
        button.disabled=false;
      }
    });
    const monitorDownload=(notice,asset)=>{
      const check=()=>{
        if(!notice.root.isConnected)return;
        let status=0;
        try{status=Number(window.RosarioAndroid.getUpdateDownloadStatus());}catch{}
        if(status===8){
          button.disabled=true;
          button.textContent='Descargado';
          notice.description.textContent='La descarga terminó. Android te pedirá confirmar la instalación.';
          addButton(notice.actions,'Instalar',()=>{
            try{
              window.RosarioAndroid.installDownloadedUpdate();
              notice.description.textContent='Confirma la instalación en Android. Si pide permiso para instalar desde Rosario, concédelo y vuelve a pulsar Instalar.';
            }catch{
              notice.description.textContent='No se pudo abrir el instalador de Android.';
            }
          });
          return;
        }
        if(status===16){
          button.disabled=false;
          button.textContent='Reintentar descarga';
          notice.description.textContent='Falló la descarga. Comprueba la conexión e inténtalo de nuevo.';
          return;
        }
        if(status===1||status===2||status===4||status===0){
          window.setTimeout(check,1400); // Sólo mientras se descarga, no consulta versiones.
        }
      };
      check();
    };
    try{
      if(window.RosarioAndroid.getDownloadedUpdateVersion()===asset.tag &&
         Number(window.RosarioAndroid.getUpdateDownloadStatus())===8){
        button.disabled=true;
        button.textContent='Descargado';
        addButton(notice.actions,'Instalar',()=>window.RosarioAndroid.installDownloadedUpdate());
        notice.description.textContent='El APK ya está descargado. Puedes instalarlo cuando quieras.';
      }
    }catch{}
  };
  const webOffer=(asset)=>{
    const until=Number(localStorage.getItem('rosario.apkOfferDismissUntil')||0);
    if(Date.now()<until)return;
    const notice=createNotice('Rosario también está disponible como aplicación',
      'Puedes instalar la APK de Android para tener vibración nativa y usar el Rosario sin depender del navegador.');
    notice.later.onclick=()=>{
      try{localStorage.setItem('rosario.apkOfferDismissUntil',String(Date.now()+30*86400000));}catch{}
      notice.root.remove();
    };
    const link=document.createElement('a');
    link.className='rosary-update-primary';
    link.textContent='Descargar APK';
    link.href=asset.url; // APK directa, sin pasar por la página de Releases.
    link.rel='noopener';
    notice.actions.append(link);
  };
  const start=async()=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),9000);
    try{
      const response=await fetch(API,{
        cache:'no-store',
        headers:{Accept:'application/vnd.github+json'},
        signal:controller.signal
      });
      if(!response.ok)return;
      const asset=releaseAsset(await response.json());
      if(!asset)return;
      if(isNative){
        const installed=window.RosarioAndroid.getAppVersion();
        if(compare(asset.tag,installed)>0)nativeDownload(asset);
      }else if(isAndroid){
        webOffer(asset);
      }
    }catch{/* Sin conexión: Rosario sigue funcionando con normalidad. */}
    finally{clearTimeout(timeout);}
  };
  document.addEventListener('DOMContentLoaded',start,{once:true});
})();
