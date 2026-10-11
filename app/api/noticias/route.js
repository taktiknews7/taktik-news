import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
const parser = new Parser({
  headers: { 'User-Agent': 'Mozilla/5.0' },
  customFields: { item: [['media:content','media'], ['enclosure','enclosure']] }
});

// FUENTES REALES - NO GOOGLE - TODAS DAN FOTO
const RSS = {
  'El Salvador': [
    'https://www.laprensagrafica.com/feed',
    'https://www.elsalvador.com/arcio/rss/',
    'https://diario.elmundo.sv/feed'
  ],
  'Internacional': [
    'https://www.infobae.com/arcio/rss/',
    'https://feeds.bbci.co.uk/mundo/rss.xml'
  ],
  'Economía': [
    'https://www.elsalvador.com/arcio/rss/',
    'https://www.infobae.com/arcio/rss/economia/'
  ],
  'Política': [
    'https://www.laprensagrafica.com/feed',
    'https://www.infobae.com/arcio/rss/politica/'
  ]
};

function sacarImg(item){
  // Infobae, La Prensa, etc. traen la imagen en enclosure o media:content
  if(item.enclosure?.url) return item.enclosure.url;
  if(item.media?.$?.url) return item.media.$.url;
  if(item['media:content']?.$?.url) return item['media:content'].$.url;
  // busca en content
  const m = item.content?.match(/<img[^>]+src="([^"]+)"/i);
  if(m) return m[1];
  return null;
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';
  const fuentes = RSS[cat] || RSS['El Salvador'];

  try{
    let todas = [];
    for(const url of fuentes){
      try{
        const feed = await parser.parseURL(url);
        todas = todas.concat(feed.items.map(i=>({
          title: i.title,
          link: i.link,
          img: sacarImg(i),
          fecha: new Date(i.pubDate||Date.now()).toLocaleDateString('es-SV')
        })));
      }catch(e){}
    }
    // quitamos duplicadas y dejamos 26
    const unicas = [...new Map(todas.map(n=>[n.title,n])).values()].slice(0,26);

    return NextResponse.json(unicas, { headers: { 'Cache-Control': 's-maxage=86400' } });
  }catch(e){
    return NextResponse.json([]);
  }
}
