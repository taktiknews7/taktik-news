export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  const FEEDS = {
    'El Salvador': 'https://www.elsalvador.com/rss/feed.xml',
    'Internacional': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Economía': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Política': 'https://feeds.bbci.co.uk/mundo/rss.xml'
  };

  const OFFSET = { 'El Salvador': 0, 'Internacional': 0, 'Economía': 6, 'Política': 12 };

  const FALLBACK = {
    'El Salvador': [
      { t: 'El Salvador: Gobierno anuncia inversión en escuelas del país', img: 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900' },
      { t: 'San Salvador: Nuevo mercado San Miguelito registra alta afluencia', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900' },
      { t: 'La Libertad: Surf City atrae a turistas internacionales este fin de semana', img: 'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900' },
      { t: 'El Salvador registra crecimiento en exportaciones de café', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900' }
    ],
    'Internacional': [{ t: 'ONU convoca reunión urgente por crisis climática', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900' }],
    'Economía': [{ t: 'Bitcoin y mercados internacionales muestran recuperación', img: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=900' }],
    'Política': [{ t: 'Congreso debate reformas clave para 2026', img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900' }]
  };

  async function fotoReal(link){
    try{
      const c = new AbortController(); setTimeout(()=>c.abort(), 3500);
      const r = await fetch(link, { headers:{'User-Agent':'Mozilla/5.0'}, signal:c.signal });
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||[])[1] || '';
      if(img.startsWith('//')) img='https:'+img;
      if(img) img = img.replace('/320/','/1024/');
      return img;
    }catch{ return ''; }
  }

  try{
    const res = await fetch(FEEDS[cat], { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate: 900}});
    if(!res.ok) throw new Error('feed off');
    const xml = await res.text();
    let todos = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
      const b=m[1];
      const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
      const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
      return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), cat };
    }).filter(i=>i.title);

    if(todos.length===0) throw new Error('vacio');

    const offset = OFFSET[cat] || 0;
    let items = [...todos.slice(offset),...todos.slice(0,offset)].slice(0,8);

    const conFoto = await Promise.all(items.map(async it=>{
      const fr = await fotoReal(it.link);
      return { title: it.title, desc: `Fuente ${cat} - ${new Date().toLocaleDateString()}`, link: it.link, img: fr || FALLBACK[cat]?.[0]?.img || FALLBACK['Internacional'][0].img, cat };
    }));

    return Response.json(conFoto);
  }catch(e){
    // SI TODO FALLA, DEVUELVE RESPALDO PERO NO VACÍO - ASÍ NUNCA TE QUEDA EN 0
    const fb = FALLBACK[cat] || FALLBACK['Internacional'];
    return Response.json(fb.map(f=>({
      title: f.t, desc: `Respaldo ${cat} - ${new Date().toLocaleDateString()}`, link:'#', img: f.img, cat
    })));
  }
}
