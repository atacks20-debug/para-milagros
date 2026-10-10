const $=id=>document.getElementById(id);
const form=$('date-form'),date=$('date'),time=$('time'),message=$('message');
function localDay(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
date.min=localDay();
function validate(){date.min=localDay();message.setCustomValidity(message.value.trim()?'':'Escribe un mensajito para mí.');const selected=new Date(`${date.value}T${time.value}`);const past=date.value&&time.value&&selected<=new Date();time.setCustomValidity(past?'Elige una fecha y hora futuras.':'');const ready=!!(date.value&&time.value&&message.value.trim()&&form.checkValidity());$('confirm').disabled=!ready;$('form-help').textContent=past?'Elige una fecha y hora que todavía no hayan pasado.':ready?'Todo listo para nuestra próxima aventura. ♥':'Completa la fecha, la hora y tu mensajito para confirmar.';return ready;}
form.addEventListener('input',validate);form.addEventListener('change',validate);
let lastMove=-Infinity;const recentSpots=[];
function escapeNo(event){
 if(event)event.preventDefault();const now=performance.now();if(now-lastMove<130)return;lastMove=now;
 const no=$('no'),old=no.getBoundingClientRect(),yes=$('yes').getBoundingClientRect();
 const width=Math.max(76,Math.min(120,old.width)),height=48,pad=14;
 const vw=document.documentElement.clientWidth,vh=window.innerHeight;
 const maxX=Math.max(pad,vw-width-pad),maxY=Math.max(pad,vh-height-pad);
 const blocked=[yes,$('music').getBoundingClientRect()];
 let candidates=[];
 for(let row=0;row<8;row++)for(let col=0;col<9;col++){
  const x=Math.max(pad,Math.min(maxX,pad+(maxX-pad)*(col+Math.random()*.6)/8.6));
  const y=Math.max(pad,Math.min(maxY,pad+(maxY-pad)*(row+Math.random()*.6)/7.6));
  if(blocked.some(r=>x<r.right+16&&x+width>r.left-16&&y<r.bottom+16&&y+height>r.top-16))continue;
  if(event&&Number.isFinite(event.clientX)&&event.clientX>x-40&&event.clientX<x+width+40&&event.clientY>y-40&&event.clientY<y+height+40)continue;
  const distance=Math.hypot(x-old.left,y-old.top);
  if(distance<Math.min(140,vw*.32))continue;
  const novelty=recentSpots.length?Math.min(...recentSpots.map(p=>Math.hypot(x-p.x,y-p.y))):200;
  candidates.push({x,y,score:novelty+Math.random()*120});
 }
 if(!candidates.length)return;candidates.sort((a,b)=>b.score-a.score);const spot=candidates[Math.floor(Math.random()*Math.min(8,candidates.length))];
 no.classList.add('wandering');document.body.appendChild(no);no.style.width=width+'px';no.style.left=spot.x+'px';no.style.top=spot.y+'px';
 recentSpots.push(spot);if(recentSpots.length>6)recentSpots.shift();
 $('hint').textContent='¡Atrápame si puedes! Este ratoncito conoce muchos escondites. ♡';
}
$('no').addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')escapeNo(e)});$('no').addEventListener('pointerdown',escapeNo);$('no').addEventListener('click',escapeNo);
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||$('no').hidden)return;const r=$('no').getBoundingClientRect();if(e.clientX>r.left-25&&e.clientX<r.right+25&&e.clientY>r.top-25&&e.clientY<r.bottom+25)escapeNo(e)});
window.addEventListener('resize',()=>{const no=$('no');no.classList.remove('wandering');no.removeAttribute('style');$('playground').appendChild(no);recentSpots.length=0;});
const audio=$('song-audio');audio.volume=.75;
function musicState(active){$('music').setAttribute('aria-pressed',String(active));$('music').setAttribute('aria-label',active?'Pausar Tuyo de Mora':'Reproducir Tuyo de Mora');$('music').innerHTML=active?'♫ <span>Pausar</span>':'♫ <span>Tuyo · Mora</span>';}
async function setMusic(on){if(!on){audio.pause();return;}try{await audio.play();}catch{$('song-status').textContent='Pulsa el botón de reproducción para escuchar Tuyo.';}}
audio.addEventListener('play',()=>{musicState(true);$('song-status').textContent='Tuyo · Mora';});
audio.addEventListener('pause',()=>musicState(false));
audio.addEventListener('error',()=>{$('song-status').textContent='No se pudo cargar la música. Recarga la página para intentarlo de nuevo.';musicState(false);});
$('music').addEventListener('click',()=>setMusic(audio.paused));
function celebrate(){for(let i=0;i<30;i++){const h=document.createElement('span');h.className='floating-heart';h.textContent=i%3?'♥':'♡';h.style.left=Math.random()*100+'%';h.style.fontSize=16+Math.random()*30+'px';h.style.setProperty('--drift',Math.random()*160-80+'px');h.style.animationDelay=Math.random()*1.3+'s';$('hearts').appendChild(h);setTimeout(()=>h.remove(),6500);}}
$('yes').addEventListener('click',()=>{setMusic(true);celebrate();$('no').hidden=true;$('hint').hidden=true;$('choice').hidden=true;document.querySelector('.picture-card').classList.add('answered');$('accepted').hidden=false;$('details').hidden=false;$('details-title').focus({preventScroll:true});$('details').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
function whatsappUrl(day,hour,text){const [y,m,d]=day.split('-');return 'https://wa.me/51981947363?text='+encodeURIComponent(`¡Sí, quiero una cita contigo! ❤️\nSoy Milagros.\n📅 Fecha: ${d}/${m}/${y}\n🕒 Hora: ${hour}\n💌 Mi mensajito: ${text.trim()}`);}
form.addEventListener('submit',e=>{e.preventDefault();if(!validate()){form.reportValidity();return;}const url=whatsappUrl(date.value,time.value,message.value);$('retry').href=url;$('retry').target='_blank';$('retry').rel='noopener noreferrer';$('sent').hidden=false;window.open(url,'_blank','noopener,noreferrer');});
