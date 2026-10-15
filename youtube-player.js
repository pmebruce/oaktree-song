(()=>{
'use strict';
function youtubeVideo(raw){
 try{
  const u=new URL(raw,location.href),host=u.hostname.toLowerCase().replace(/^www\./,'');
  let id='';
  if(host==='youtu.be')id=u.pathname.split('/')[1];
  else if(['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(host)){
   if(u.pathname==='/watch')id=u.searchParams.get('v')||'';
   else if(/^\/(embed|shorts|live)\//.test(u.pathname))id=u.pathname.split('/')[2];
  }
  return /^[a-zA-Z0-9_-]{11}$/.test(id)?id:null;
 }catch{return null}
}
let dialog,frame,title,replay,opener,currentId;
function build(){
 const css=document.createElement('style');
 css.textContent='.oak-video-dialog{box-sizing:border-box;width:min(900px,calc(100% - 24px));max-height:calc(100dvh - 24px);padding:20px;border:0;border-radius:22px;background:#f8f9f2;color:#274937;overflow:auto}.oak-video-dialog::backdrop{background:#102b24b8}.oak-video-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.oak-video-header h2{font-size:22px;line-height:1.4;margin:0;overflow-wrap:anywhere}.oak-video-dialog button{font:inherit;font-size:17px;font-weight:800;min-height:44px;padding:10px 16px;border:0;border-radius:12px;background:#28684d;color:white;cursor:pointer;white-space:nowrap}.oak-video-dialog button:focus-visible{outline:3px solid #eaaa60;outline-offset:3px}.oak-video-frame{display:block;width:100%;height:auto;aspect-ratio:16/9;min-height:200px;border:0;border-radius:12px;background:#000}.oak-video-footer{display:flex;justify-content:flex-end;margin-top:14px}@media(max-width:480px){.oak-video-dialog{padding:12px}.oak-video-header h2{font-size:19px}}';
 document.head.append(css);
 dialog=document.createElement('dialog');dialog.className='oak-video-dialog';dialog.setAttribute('aria-labelledby','oak-video-title');
 const header=document.createElement('div');header.className='oak-video-header';
 title=document.createElement('h2');title.id='oak-video-title';
 const close=document.createElement('button');close.type='button';close.textContent='關閉';close.addEventListener('click',()=>dialog.close());
 frame=document.createElement('iframe');frame.className='oak-video-frame';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
 replay=document.createElement('button');replay.type='button';replay.textContent='↻ 重播';replay.addEventListener('click',()=>load(true));
 const footer=document.createElement('div');footer.className='oak-video-footer';footer.append(replay);
 header.append(title,close);dialog.append(header,frame,footer);document.body.append(dialog);
 dialog.addEventListener('close',()=>{frame.removeAttribute('src');opener?.focus()});
}
function load(autoplay){
 const u=new URL('https://www.youtube-nocookie.com/embed/'+currentId);
 u.searchParams.set('rel','0');u.searchParams.set('playsinline','1');u.searchParams.set('origin',location.origin);
 if(autoplay)u.searchParams.set('autoplay','1');
 frame.src=u.href;
}
document.addEventListener('click',event=>{
 if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const anchor=event.target.closest?.('a[href]');if(!anchor)return;
 const id=youtubeVideo(anchor.href);if(!id)return;
 event.preventDefault();if(!dialog)build();
 opener=anchor;currentId=id;
 title.textContent=anchor.closest('.card')?.querySelector('h3')?.textContent||anchor.closest('.book-card')?.querySelector('h3')?.textContent||'影片播放';
 frame.title=title.textContent;load(false);if(!dialog.open)dialog.showModal();
});
})();
