export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const FEEDS = {
    'El Salvador': 'https://www.laprensagrafica.com/rss/lo-ultimo',
    'Internacional': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Economía': 'https://feeds.bbci.co.uk/mundo/topics/c340qqnh3q4t/economia/rss.xml',
    'Política': 'https://feeds.bbci.co.uk/mundo/topics/c340qqnl2k1t/politica/rss.xml'
  };

  const fallbackImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900';

  async function sacarFotoReal(link){
    try{
      const r = await fetch(link, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } });
      const html = await r.text();
      let img = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/)||[])[1] ||
                (html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/)||[])[1] || '';
      // Limpia la foto 320px de BBC y pon la grande
      if(img) img = img.replace('/320/','/1024/').replace('/144/','/800/');
      return img;
    }catch{ return ''; }
  }

  try{
    const res = await fetch(FEEDS[cat], { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 1800 } });
    const xml = await res.text();
    let items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10).map(m=>{
      const b = m[1];
      const t = (b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)||b.match(/<title>([\s\S]*?)<\/title>/)||[])[1]||'';
      const l = (b.match(/<link>([\s\S]*?)<\/link>/)||[])[1]||'#';
      return { title: t.replace(/<[^>]+>/g,'').trim(), link: l.trim(), desc: 'Fuente BBC', cat };
    }).filter(i=>i.title && i.link!=='#');

    // JALA LA FOTO REAL DE CADA NOTICIA DE HOY (solo 10 para no tardar)
    const conFoto = await Promise.all(items.map(async (it)=>{
      const fotoReal = await sacarFotoReal(it.link);
      return {...it, img: fotoReal || fallbackImg };
    }));

    return Response.json(conFoto);
  }catch(e){
    return Response.json([{ title: `${cat}: Actualizando noticias del día...`, desc: 'Reconectando', link:'#', img: fallbackImg, cat }]);
  }
}
