/* Homepage installation control. Song lists and playback are unchanged. */
(()=>{
 'use strict';
 let pending=null;
 const get=id=>document.getElementById(id);
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();pending=e;});
 const installed=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone;
 function setup(){
  const button=get('oakInstallButton'),dialog=get('oakInstallDialog'),native=get('oakNativeInstall'),status=get('oakInstallStatus');
  const markInstalled=()=>{button.textContent='已加入主畫面';button.disabled=true;native.hidden=true;status.textContent='已加入主畫面。';};
  const help=()=>{native.hidden=!pending;status.textContent=installed()?'你已經從主畫面開啟歌單囉！':'';if(!dialog.open)dialog.showModal();};
  const requestInstall=async()=>{
   if(!pending){help();return}
   const prompt=pending;pending=null;
   try{await prompt.prompt();const choice=await prompt.userChoice;status.textContent=choice.outcome==='accepted'?'已送出安裝要求。':'也可以稍後再加入主畫面。';}
   catch{help();status.textContent='請依下方步驟加入主畫面。';}
   native.hidden=true;
  };
  button.onclick=requestInstall;native.onclick=requestInstall;
  window.addEventListener('appinstalled',()=>{pending=null;markInstalled();});
  if(installed())markInstalled();
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
