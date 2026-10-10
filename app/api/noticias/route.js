export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  // FUENTES DIRECTAS QUE SI TRAEN FOTO
  const feeds = {
    'El Salvador': [
      'https://www.laprensagrafica.com/rss/nacion.xml',
      'https://www.elsalvador.com/rss/elsalvador.xml'
    ],
    'Internacional': ['https://feeds.bbci.co.uk/mundo/rss.xml'],
    'Economía': ['https://www.laprensagrafica.com/rss/economia.xml'],
    'Política': ['https://www.laprensagrafica.com/rss/nacion.xml']
  };

  const urls = feeds[cat] || feeds['El Salvador'];
  let todas = [];

  for (const feedUrl of urls) {
    try {
      const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(4000) });
      const xml = await res.text();
      const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].slice(0, 10).map(m => {
        const b = m[1];
        const title = (b.match(/<title>(.*?)<\/title>/)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/<[^>]+>/g,'');
        const link = (b.match(/<link>(.*?)<\/link>/)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g,'');
        // ESTA ES LA CLAVE: La foto viene en el RSS
        let img = b.match(/<enclosure url="([^"]+)"/)?.[1]
               || b.match(/<media:content[^>]+url="([^"]+)"/)?.[1]
               || b.match(/<media:thumbnail[^>]+url="([^"]+)"/)?.[1]
               || (b.match(/<description>.*?<img[^>]+src="([^"]+)"/s)?.[1]);

        if(img) img = img.replace(/<!\[CDATA\[|\]\]>/g,'').trim();
        return { title, link, img };
      });
      todas.push(...items);
    } catch(e){}
  }

  // Si por algo falla, usamos Google como respaldo pero SIN imagen (usa la de categoria)
  if(todas.length === 0){
    return Response.json([{title: "Taktik News - Actualizando...", link:"#", img:null}]);
  }

  return Response.json(todas.slice(0, 15));
}
