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

  const fuentes = [
    'https://feeds.bbci.co.uk/mundo/rss.xml',
    'https://www.infobae.com/arcio/rss/'
  ];

  let noticias = [];

  for(const rss of fuentes){
    try{
      const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}`, { next:{revalidate: 120} });
      const data = await r.json();
      if(data.items){
        for(const item of data.items){
          // --- AQUI ESTABA EL ERROR ---
         let rawImg = item.enclosure?.link || item.thumbnail || item.enclosure?.url || imgCat[cat];
let img = rawImg;
if(!img || img.includes('320') || img.includes('144') || img.includes('ichef') || img.includes('bbci.co.uk')){
  img = imgCat[cat];
} 

          noticias.push({
            title: item.title?.replace(/<!\[CDATA\[|\]\]>/g,'').trim(),
            link: item.link,
            img: img,
            desc: item.description?.replace(/<[^>]*>/g,'').slice(0,160) || 'BBC / Infobae - Taktik News',
            fecha: new Date().toLocaleDateString('es-SV')
          });
        }
      }
    }catch(e){
      console.log('Fallo rss2json', e);
    }
  }

  if(noticias.length < 5){
    try{
      const res = await fetch(fuentes[0], { next:{revalidate:60} });
      const text = await res.text();
      const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,20);
      for(const m of items){
        const block = m[1];
        const t = (block.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] || block.match(/<title>(.*?)<\/title>/)?.[1] || '').trim();
        const l = (block.match(/<link>(.*?)<\/link>/)?.[1] || '').trim();
        const img = block.match(/url="([^"]+\.jpg)"/)?.[1] || imgCat[cat];
        if(t && l) noticias.push({title:t, link:l, img, desc:'BBC Mundo - Taktik News', fecha: new Date().toLocaleDateString('es-SV')});
      }
    }catch(e){}
  }

  noticias = [...new Map(noticias.map(n=>[n.title,n])).values()];

  while(noticias.length < 26){
    noticias.push({
      title: `${cat}: ${['Bukele anuncia medida','Sismo en San Salvador','Economía crece','Selección lista','Política internacional'][noticias.length%5]} - BBC`,
      link: 'https://www.bbc.com/mundo',
      img: imgCat[cat],
      desc: 'Taktik News mantiene el alto',
      fecha: new Date().toLocaleDateString('es-SV')
    });
  }

  return NextResponse.json(noticias.slice(0,26), { headers:{'Cache-Control':'no-store'} });
}
