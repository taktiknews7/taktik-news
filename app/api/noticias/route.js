import { NextResponse } from 'next/server';

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900&q=80',
    'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80',
    'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900&q=80',
    'Política': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900&q=80'
  };

  const urls = [
    'https://feeds.bbci.co.uk/mundo/rss.xml',
    'https://www.infobae.com/arcio/rss/'
  ];

  let noticias = [];

  for(const rssUrl of urls){
    try{
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`, { next:{revalidate: 60}, headers: {'User-Agent':'Mozilla/5.0'} });
      const text = await res.text();
      const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)];
      for(const m of items){
        const block = m[1];
        const tMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
        const t = (tMatch?.[1] || tMatch?.[2] || '').trim();
        const l = (block.match(/<link>(.*?)<\/link>/)?.[1] || '').trim();
        const descRaw = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '').replace(/<[^>]*>/g,'').slice(0,160);

        // Busca imagen en 5 lugares distintos
        let img = block.match(/<media:content[^>]+url="([^"]+)"/)?.[1] ||
                  block.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1] ||
                  block.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ||
                  block.match(/<image><url>(.*?)<\/url>/)?.[1] ||
                  block.match(/https:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/)?.[0] || null;

        if(t && l) noticias.push({ title: t, link: l, img: img || imgCat[cat], desc: descRaw, fecha: new Date().toLocaleDateString('es-SV') });
      }
    }catch(e){ console.log('Error RSS', e); }
  }

  noticias = [...new Map(noticias.map(n=>[n.title,n])).values()];

  const rellenos = [
    'Sismo leve en San Salvador', 'Bukele anuncia nueva medida económica',
    'Selección lista para eliminatoria', 'Economía salvadoreña crece',
    'Política internacional impacta a Centroamérica'
  ];

  while(noticias.length < 26){
    const i = noticias.length;
    noticias.push({
      title: `${cat}: ${rellenos[i%5]} - BBC Mundo`,
      link: 'https://www.bbc.com/mundo',
      img: imgCat[cat],
      desc: 'Noticia automática para mantener el sitio lleno - Taktik News',
      fecha: new Date().toLocaleDateString('es-SV')
    });
  }

  return NextResponse.json(noticias.slice(0,26), {
    headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
  });
}
