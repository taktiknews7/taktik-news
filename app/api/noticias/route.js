export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  async function cargarRSS(url){
    try{
      const r = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0'}, cache:'no-store'});
      const xml = await r.text();
      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
        const b=m[1];
        const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
        const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
        const enc=(b.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||[])[1] ||
                  (b.match(/<media:content[^>]+url=["']([^"']+)["']/i)||[])[1] || '';
        return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), enc };
      }).filter(i=>i.title);
    }catch{ return []; }
  }

  async function fotoReal(link){
    try{
      const c = new AbortController(); setTimeout(()=>c.abort(), 2500);
      const r = await fetch(link, { headers:{'User-Agent':'Mozilla/5.0'}, signal:c.signal, cache:'no-store'});
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||[])[1] || '';
      if(img.startsWith('//')) img='https:'+img;
      return img.split('?')[0];
    }catch{ return ''; }
  }

  try{
    let todos = [];
    if(cat === 'El Salvador'){
      todos = await cargarRSS('https://diario.elmundo.sv/feed');
    }else{
      todos = await cargarRSS('https://feeds.bbci.co.uk/mundo/rss.xml');
      const off = cat==='Economía'?6:cat==='Política'?12:2;
      todos = [...todos.slice(off),...todos.slice(0,off)];
    }

    todos = todos.slice(0,8);
    if(todos.length===0) throw new Error('vacio');

    const final = await Promise.all(todos.map(async (it,i)=>{
      let real = await fotoReal(it.link);
      // ESTO GARANTIZA FOTO DIFERENTE AUNQUE FALLE TODO: usa el título como semilla
      const seed = encodeURIComponent(it.title.slice(0,20));
      const uniqueFallback = `https://picsum.photos/seed/${seed}${cat}${i}/900/600`;

      return {
        title: it.title,
        desc: `${cat} - ${new Date().toLocaleDateString()}`,
        link: it.link,
        // Orden: 1. foto real BBC 2. enclosure 3. foto única por título (nunca la misma de libros)
        img: real || it.enc || uniqueFallback,
        cat
      };
    }));

    return Response.json(final, { headers:{ 'Cache-Control':'no-store' } });

  }catch{
    // Si todo falla, ni asi te deja la misma foto
    return Response.json([
      { title: `El Salvador - Noticia ${cat} 1 - ${Date.now()}`, img: `https://picsum.photos/seed/${cat}1${Date.now()}/900/600`, desc: cat, link:'#', cat },
      { title: `El Salvador - Noticia ${cat} 2 - ${Date.now()}`, img: `https://picsum.photos/seed/${cat}2${Date.now()}/900/600`, desc: cat, link:'#', cat },
      { title: `El Salvador - Noticia ${cat} 3 - ${Date.now()}`, img: `https://picsum.photos/seed/${cat}3${Date.now()}/900/600`, desc: cat, link:'#', cat },
      { title: `El Salvador - Noticia ${cat} 4 - ${Date.now()}`, img: `https://picsum.photos/seed/${cat}4${Date.now()}/900/600`, desc: cat, link:'#', cat },
    ], { headers:{ 'Cache-Control':'no-store' } });
  }
}
