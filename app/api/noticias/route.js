import { NextResponse } from 'next/server';

const FUENTES = {
  'El Salvador': [
    'https://www.infobae.com/arcio/rss/',
    'https://feeds.bbci.co.uk/mundo/rss.xml'
  ],
  'Internacional': [
    'https://www.infobae.com/arcio/rss/',
    'https://feeds.bbci.co.uk/mundo/rss.xml'
  ],
  'Economía': [
    'https://www.infobae.com/arcio/rss/economia/',
    'https://feeds.bbci.co.uk/mundo/rss.xml'
  ],
  'Política': [
    'https://www.infobae.com/arcio/rss/politica/',
    'https://feeds.bbci.co.uk/mundo/rss.xml'
  ]
};

async function fetchRSS(url){
  try{
    // rss2json convierte RSS a JSON y ya trae la imagen, no bloquea Google
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const r = await fetch(api, { next: { revalidate: 86400 } });
    const data = await r.json();
    if(!data.items) return [];
    return data.items.map(i=>({
      title: i.title,
      link: i.link,
      img: i.enclosure?.link || (i.thumbnail || null),
      fecha: new Date(i.pubDate).toLocaleDateString('es-SV')
    }));
  }catch(e){ return []; }
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';
  const urls = FUENTES[cat] || FUENTES['El Salvador'];

  let todas = [];
  for(const u of urls){
    const notas = await fetchRSS(u);
    todas = todas.concat(notas);
  }

  // quitamos duplicados
  const unicas = [...new Map(todas.map(n=>[n.title,n])).values()].slice(0,26);

  // si todo falla, regresa al menos 1 para que no quede en blanco como tu captura
  if(unicas.length===0){
    return NextResponse.json([{
      title: 'El Salvador: Últimas noticias en desarrollo - TAKTIK NEWS',
      link: 'https://www.infobae.com/america/america-latina/',
      img: 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
      fecha: new Date().toLocaleDateString('es-SV')
    }]);
  }

  return NextResponse.json(unicas, { headers: { 'Cache-Control': 's-maxage=86400' } });
}
