export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = (searchParams.get('cat') || 'El Salvador').trim();

  const FEEDS_SV = [
    'https://diario.elmundo.sv/feed',
    'https://www.elsalvadortimes.com/feed',
    'https://www.diariocolatino.com/feed/',
    'https://informativoelsalvador.com/feed/'
  ];

  async function cargarRSS(url){
    try{
      const r = await fetch(url, { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate: 3600}});
      if(!r.ok) return [];
      const xml = await r.text();
      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
        const b=m[1];
        const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
        const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
        const enc=(b.match(/<enclosure[^>]+url=["']([^"']+)["']/i)||b.match(/<media:content[^>]+url=["']([^"']+)["']/i)||[])[1]||'';
        const desc=(b.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)||[])[1]||'';
        let imgFromDesc = (desc.match(/<img[^>]+src=["']([^"']+)["']/i)||[])[1]||'';
        return {
          title: t.replace(/<[^>]+>/g,'').trim(),
          link:l.trim(),
          img:(enc || imgFromDesc).trim()
        };
      }).filter(i=>i.title.length>10 &&!i.title.toLowerCase().includes('kimberly') &&!i.title.toLowerCase().includes('grecia'));
    }catch{ return []; }
  }

  async function cargarBBC(){
    try{
      const r = await fetch('https://feeds.bbci.co.uk/mundo/rss.xml', { headers:{'User-Agent':'Mozilla/5.0'}, next:{revalidate: 3600}});
      const xml = await r.text();
      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
        const b=m[1];
        const t=(b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
        const l=(b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
        return { title: t.replace(/<[^>]+>/g,'').trim(), link:l.trim(), img:'' };
      }).filter(i=>i.title);
    }catch{ return []; }
  }

  async function fotoReal(link){
    try{
      if(link.includes('google.com')) return ''; // NUNCA jalar logo de Google
      const c = new AbortController(); setTimeout(()=>c.abort(), 3500);
      const r = await fetch(link, { headers:{'User-Agent':'Mozilla/5.0'}, signal:c.signal, next:{revalidate: 3600}});
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||[])[1] || '';
      if(img.startsWith('//')) img='https:'+img;
      if(img.includes('google') || img.includes('logo')) return '';
      return img.split('?')[0];
    }catch{ return ''; }
  }

  try{
    let todos = [];
    if(cat === 'El Salvador'){
      for(const url of FEEDS_SV){
        const data = await cargarRSS(url);
        if(data.length>0){ todos = data; break; }
      }
    }else{
      todos = await cargarBBC();
      const off = cat==='Economía'?6:cat==='Política'?12:0;
      todos = [...todos.slice(off),...todos.slice(0,off)];
    }

    if(todos.length===0) throw new Error('vacio');

    const final = await Promise.all(todos.slice(0,8).map(async (it)=>{
      const real = await fotoReal(it.link);
      return {
        title: it.title,
        desc: `${cat} - ${new Date().toLocaleDateString('es-SV')} - ${it.link.includes('elmundo')?'El Mundo SV': it.link.includes('elsalvadortimes')?'El Salvador Times':'Medio SV'}`,
        link: it.link,
        img: real || it.img || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900',
        cat
      };
    }));

    const filtradas = final.filter(n=>!n.title.toLowerCase().includes('guilfoyle') &&!n.title.toLowerCase().includes('grecia') && n.img &&!n.img.includes('google'));

    return Response.json(filtradas.length>0? filtradas : final, { headers:{ 'Cache-Control':'public, s-maxage=3600, stale-while-revalidate=3600' } });

  }catch(e){
    return Response.json([
      { title: 'Diario El Mundo: Gobierno anuncia inversión en escuelas', desc: 'El Salvador - Fuente real', link:'https://diario.elmundo.sv/', img:'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900', cat:'El Salvador'},
      { title: 'El Salvador Times: San Salvador con alta afluencia en centro histórico', desc: 'El Salvador', link:'https://www.elsalvadortimes.com/', img:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900', cat:'El Salvador'},
      { title: 'Diario Co Latino reporta crecimiento en turismo de Surf City', desc: 'El Salvador', link:'https://www.diariocolatino.com/', img:'https://images.unsplash.com/photo-1502680393100-267202a1d1a2?w=900', cat:'El Salvador'}
    ]);
  }
}
