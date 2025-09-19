async function loadData(){
  const res = await fetch('data/index.json');
  return await res.json();
}
function qs(k){ return new URLSearchParams(location.search).get(k); }
function el(tag, attrs={}, ...children){
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') e.className=v;
    else if(k==='href') e.setAttribute('href',v);
    else if(k==='src') e.setAttribute('src',v);
    else e[k]=v;
  });
  children.forEach(c=> e.appendChild(typeof c==='string'? document.createTextNode(c): c));
  return e;
}
function deterRecord(){
  document.addEventListener('visibilitychange', ()=>{
    document.body.style.filter = document.hidden ? 'blur(8px)' : '';
  });
  window.addEventListener('contextmenu', e=> e.preventDefault());
  window.addEventListener('dragstart', e=> e.preventDefault());
}
(async ()=>{
  deterRecord();
  const data = await loadData();
  const evId = qs('event'); const slug = qs('player'); const token = qs('token')||'';
  const ev = data.events.find(e=> e.id===evId);
  if(!ev){ document.getElementById('info').textContent='Evento non trovato'; return; }
  const player = ev.players.find(p=> p.slug===slug);
  if(!player){ document.getElementById('info').textContent='Giocatore non trovato'; return; }
  if(player.token && player.token !== token){
    document.getElementById('info').textContent='Accesso non autorizzato (QR non valido).';
    return;
  }
  document.getElementById('title').textContent = (player.displayName||player.name) + ' — ' + ev.title;
  document.getElementById('info').textContent = 'Anteprime protette (bassa risoluzione + watermark).';
  const grid = document.getElementById('thumbs');
  player.images.forEach(src=>{
    const wrap = el('div',{class:'thumb'},
      el('img',{src}),
      el('div',{class:'wm'},'ANTEPRIMA — NON PER USO'),
      el('div',{class:'no-screenshot'},'Screenshot disattivato')
    );
    grid.appendChild(wrap);
  });
  document.getElementById('orderBtn').addEventListener('click', ()=>{
    const form = (data.settings && data.settings.orderForm) || '';
    if(!form){ alert('Modulo ordini non configurato. Vedi README.'); return; }
    const params = new URLSearchParams({
      event: ev.title,
      player: player.displayName||player.name,
      slug: player.slug
    });
    const url = form + '?' + params.toString();
    location.href = url;
  });
})();