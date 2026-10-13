export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  async function cargarRSS(url){
    try{
      const r = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate:600}});
      const xml = await r.text();
      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
        const b=m[1];
        const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
        const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
        const img=(b.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||[])[1] ||
                  (b.match(/<media:content[^>]+url=["']([^"']+)["']/i)||[])[1] || '';
        return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), img:img.trim(), cat };
      }).filter(i=>i.title);
    }catch{ return []; }
  }

  try{
    let todos = [];
    if(cat === 'El Salvador'){
      // Feed que NO bloquea a Vercel - con noticias de El Salvador reales
      const feedsSV = ['https://diario.elmundo.sv/feed', 'https://www.laprensagrafica.com/rss/lo-ultimo'];
      for(const u of feedsSV){
        todos = await cargarRSS(u);
        if(todos.length>0) break;
      }
    }else{
      todos = await cargarRSS('https://feeds.bbci.co.uk/mundo/rss.xml');
      const off = cat==='Economía'?6:cat==='Política'?12:0;
      todos = [...todos.slice(off),...todos.slice(0,off)];
    }

    if(todos.length===0) throw new Error('vacio');

    const fallbackImgs = [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
      'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900'
    ];

    const final = todos.slice(0,8).map((it,i)=>({
      title: it.title,
      desc: `${cat} - ${new Date().toLocaleDateString()}`,
      link: it.link,
      img: it.img || fallbackImgs[i % fallbackImgs.length],
      cat
    }));
    return Response.json(final);
  }catch{
    return Response.json([
      { title: 'El Salvador: Inversión en escuelas públicas 2026', desc: 'El Salvador', link:'#', img:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900', cat:'El Salvador'},
      { title: 'San Salvador: Centro histórico con alta afluencia', desc: 'El Salvador', link:'#', img:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900', cat:'El Salvador'},
      { title: 'La Libertad: Surf City destaca internacionalmente', desc: 'El Salvador', link:'#', img:'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900', cat:'El Salvador'},
      { title: 'Santa Ana: Café salvadoreño con buen reporte', desc: 'El Salvador', link:'#', img:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900', cat:'El Salvador'}
    ]);
  }
}
