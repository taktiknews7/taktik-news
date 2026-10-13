export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const FEEDS = {
    'El Salvador': 'https://www.laprensagrafica.com/rss/lo-ultimo',
    'Internacional': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Economía': 'https://www.infobae.com/arcio/rss/economia/',
    'Política': 'https://feeds.bbci.co.uk/mundo/temas/politica/rss.xml'
  };

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
    'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
    'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
    'Política': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900'
  };

  try{
    const url = FEEDS[cat] || FEEDS['Internacional'];
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].slice(0,26).map(m=>{
      const block = m[1];
      const title = (block.match(/<title><!\[CDATA\[(.*?)\]\]>/)||block.match(/<title>(.*?)<\/title>/)||[])[1]||'Sin título';
      const desc = (block.match(/<description><!\[CDATA\[(.*?)\]\]>/)||[])[1]||'';
      const link = (block.match(/<link>(.*?)<\/link>/)||[])[1]||'#';
      let img = (block.match(/<media:content[^>]+url="([^"]+)"/)||block.match(/<enclosure[^>]+url="([^"]+)"/)||[])[1]||'';

      // SI ES BORROSA 320px, PONER LA HD DE LA CATEGORIA
      if(!img || img.includes('320') || img.includes('144') || img.length < 10){
        img = imgCat[cat];
      }
      return { title: title.replace(/<[^>]+>/g,''), desc: desc.replace(/<[^>]+>/g,'').slice(0,160), link, img, cat };
    });

    return Response.json(items);
  }catch(e){
    // FALLBACK DISTINTO POR CATEGORIA, NO LA MISMA
    return Response.json([{ title: `Últimas de ${cat} - Actualizando...`, desc: 'Conectando con BBC/Infobae', link:'#', img: imgCat[cat], cat }]);
  }
}
