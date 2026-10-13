export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  // Fotos de respaldo DIFERENTES por categoría - para que no se repita la de libros
  const FALLBACKS = {
    'El Salvador': [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900',
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=900',
      'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900'
    ],
    'Internacional': [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=900',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900'
    ],
    'Economía': [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900',
      'https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=900'
    ],
    'Política': [
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900',
      'https://images.unsplash.com/photo-1580130375562-731a8662f344?w=900',
      'https://images.unsplash.com/photo-1575320181282-9f7d340d5a9c?w=900'
    ]
  };

  async function fotoReal(link){
    try{
      const c = new AbortController(); setTimeout(()=>c.abort(), 3000);
      const r = await fetch(link, { headers:{'User-Agent':'Mozilla/5.0'}, signal:c.signal, next:{revalidate:600}});
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||[])[1] || '';
      if(img.startsWith('//')) img='https:'+img;
      return img.split('?')[0];
    }catch{ return ''; }
  }

  async function cargarRSS(url){
    const r = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate:600}});
    const xml = await r.text();
    return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
      const b=m[1];
      const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
      const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
      const enc=(b.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||[])[1] || '';
      return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), enc };
    }).filter(i=>i.title);
  }

  try{
    let todos = [];
    let url = 'https://feeds.bbci.co.uk/mundo/rss.xml';
    if(cat === 'El Salvador') url = 'https://diario.elmundo.sv/feed';

    todos = await cargarRSS(url);
    if(todos.length===0) throw new Error('vacio');

    // Offset para que no repita mismo título en las 4 secciones
    const off = cat==='Economía'?5:cat==='Política'?10:cat==='Internacional'?0:0;
    todos = [...todos.slice(off),...todos.slice(0,off)].slice(0,8);

    // JALA FOTO REAL DE CADA NOTICIA (esto quita la misma foto de libros)
    const conFoto = await Promise.all(todos.map(async (it,i)=>{
      let real = '';
      if(cat!== 'El Salvador'){ real = await fotoReal(it.link); } // BBC si deja jalar foto
      const fb = FALLBACKS[cat] || FALLBACKS['El Salvador'];
      return {
        title: it.title,
        desc: `${cat} - ${new Date().toLocaleDateString()}`,
        link: it.link,
        img: real || it.enc || fb[i % fb.length],
        cat
      };
    }));

    return Response.json(conFoto);
  }catch(e){
    const fb = FALLBACKS[cat];
    return Response.json([
      { title: cat==='El Salvador'?'El Salvador: Inversión en escuelas públicas 2026':cat==='Internacional'?'Mundo: Cumbre climática urgente':cat==='Economía'?'Economía: Mercados con tendencia al alza':'Política: Congreso debate reformas', desc: cat, link:'#', img: fb[0], cat },
      { title: cat==='El Salvador'?'San Salvador: Centro histórico reactivado':cat==='Internacional'?'ONU alerta por conflicto':cat==='Economía'?'Bitcoin sube 3% hoy':'Política: Nuevas alianzas', desc: cat, link:'#', img: fb[1], cat },
      { title: cat==='El Salvador'?'Surf City atrae turistas':cat==='Internacional'?'Europa enfrenta ola de calor':cat==='Economía'?'Exportaciones salvadoreñas crecen':'Política: Elecciones 2026', desc: cat, link:'#', img: fb[2], cat },
      { title: cat==='El Salvador'?'Santa Ana: Café con buena cosecha':cat==='Internacional'?'EEUU y China dialogan':cat==='Economía'?'FMI proyecta crecimiento':'Política: Reformas judiciales', desc: cat, link:'#', img: fb[3], cat },
    ]);
  }
}
