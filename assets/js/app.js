async function loadData(){
  const res = await fetch('data/index.json');
  return await res.json();
}
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
function fillPlayers(listEl, players, ev){
  listEl.innerHTML='';
  players.forEach(p=>{
    const url = new URL('gallery.html', location.href);
    url.searchParams.set('event', ev.id);
    url.searchParams.set('player', p.slug);
    url.searchParams.set('token', p.token||'');
    const a = el('a',{href:url.toString()}, 'Apri');
    const li = el('li',{}, el('span',{}, p.displayName||p.name), a);
    listEl.appendChild(li);
  });
}
(async ()=>{
  const data = await loadData();
  const sel = document.getElementById('eventSelect');
  data.events.forEach(ev=>{
    const o = document.createElement('option');
    o.value = ev.id; o.textContent = ev.title + ' — ' + ev.date;
    sel.appendChild(o);
  });
  function refresh(){
    const ev = data.events.find(e=> e.id===sel.value);
    const home = ev.players.filter(p=> p.side==='home');
    const away = ev.players.filter(p=> p.side==='away');
    fillPlayers(document.getElementById('homeList'), home, ev);
    fillPlayers(document.getElementById('awayList'), away, ev);
  }
  sel.addEventListener('change', refresh);
  sel.value = data.events[0]?.id || '';
  refresh();
})();