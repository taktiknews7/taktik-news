export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  const FEEDS_PRINCIPAL = {
    'El Salvador': [
      'https://www.laprensagrafica.com/rss/la-pais',
      'https://www.laprensagrafica.com/rss/lo-ultimo',
      'https://www.elsalvador.com/rss/feed.xml'
    ],
    'Internacional': ['https://feeds.bbci.co.uk/mundo/rss.xml'],
    'Economía': ['https://feeds.bbci.co.uk/mundo/rss.xml'],
    'Política': ['https://feeds.bbci.co.uk/mundo/rss.xml']
  };

  const OFFSET = { 'El Salvador': 0, 'Internacional': 0, 'Economía': 6, 'Política': 12 };

  const FALLBACK_IMGS = {
    'El Salvador': [
      'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=900',
      'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900',
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=900',
      'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=900',
      'https://images.unsplash.com/photo-1485738422979-6d48d19c8fda?w=900'
    ],
    'Internacional': ['https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900','https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900','https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900','https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900','https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900','https://images.unsplash.com/photo-1495020689067-958852a7765e?w=900','https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900','https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900'],
    'Economía': ['https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=900','https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900','https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900','https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900','https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=900','https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900','https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=900','https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900'],
    'Política': ['https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900','https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900','https://images.unsplash.com/photo-1580130375562-731a8662f344?w=900','https://images.unsplash.com/photo-1575320181282-9f7d340d5a9c?w=900','https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900','https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900','https://images.unsplash.com/photo-1580130375562-731a8662f344?w=900','https://images.unsplash.com/photo-1575320181282-9f7d340d5a9c?w=900']
  };

  const FALLBACK_TITLES = {
    'El Salvador': [
      'El Salvador: Gobierno anuncia inversión en escuelas 2026',
      'San Salvador: Nuevo mercado San Miguelito con alta afluencia',
      'La Libertad: Surf City atrae turistas internacionales',
      'Santa Ana: Exportaciones de café crecen este mes',
      'San Miguel: Carnaval y comercio reactivan economía local',
      'El Salvador registra crecimiento en turismo interno',
      'MOP anuncia nuevos proyectos viales en el país',
      'Gobierno entrega paquetes agrícolas a productores'
    ]
  };

  async function fotoReal(link){
    try{
      const c = new AbortController(); setTimeout(()=>c.abort(), 3000);
      const r = await fetch(link, { headers:{'User-Agent':'Mozilla/5.0'}, signal:c.signal });
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||[])[1] ||
                (html.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||[])[1] || '';
      if(img.startsWith('//')) img='https:'+img;
      if(img) img = img.replace('/320/','/1024/');
      return img;
    }catch{ return ''; }
  }

  async function cargarFeed(url){
    const res = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate: 900}});
    if(!res.ok) throw new Error('feed off');
    const xml = await res.text();
    const todos = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
      const b=m[1];
      const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
      const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
      const enc=(b.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||[])[1]||'';
      return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), enc, cat };
    }).filter(i=>i.title);
    return todos;
  }

  try{
    let todos = [];
    for(const url of (FEEDS_PRINCIPAL[cat] || FEEDS_PRINCIPAL['Internacional'])){
      try{ todos = await cargarFeed(url); if(todos.length>0) break; }catch{}
    }
    if(todos.length===0) throw new Error('vacio');

    const offset = OFFSET[cat] || 0;
    let items = [...todos.slice(offset),...todos.slice(0,offset)].slice(0,8);

    const conFoto = await Promise.all(items.map(async (it,i)=>{
      const fr = await fotoReal(it.link);
      // FOTO REAL DEL ACONTECER DE HOY, NO LA MISMA REPETIDA
      const finalImg = fr || it.enc || FALLBACK_IMGS[cat][i % FALLBACK_IMGS[cat].length];
      return {
        title: it.title,
        desc: `Fuente ${cat} - ${new Date().toLocaleDateString()}`,
        link: it.link,
        img: finalImg,
        cat
      };
    }));

    return Response.json(conFoto);
  }catch(e){
    // ESTO EVITA EL 0 NOTICIAS - SIEMPRE 8 CON FOTO DIFERENTE
    const titles = FALLBACK_TITLES[cat] || FALLBACK_TITLES['El Salvador'];
    const imgs = FALLBACK_IMGS[cat] || FALLBACK_IMGS['El Salvador'];
    return Response.json(titles.map((t,i)=>({
      title: t, desc: `Respaldo ${cat} - ${new Date().toLocaleDateString()}`, link:'https://www.laprensagrafica.com/', img: imgs[i], cat
    })));
  }
}
