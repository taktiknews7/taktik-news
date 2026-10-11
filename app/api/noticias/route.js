import { NextResponse } from 'next/server';

const FUENTES = {
  'El Salvador': ['https://feeds.bbci.co.uk/mundo/rss.xml','https://www.infobae.com/arcio/rss/'],
  'Internacional': ['https://feeds.bbci.co.uk/mundo/rss.xml','https://www.infobae.com/arcio/rss/'],
  'Economía': ['https://feeds.bbci.co.uk/mundo/rss.xml','https://www.infobae.com/arcio/rss/economia/'],
  'Política': ['https://feeds.bbci.co.uk/mundo/rss.xml','https://www.infobae.com/arcio/rss/politica/']
};

async function fetchRSS(url){
  try{
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const r = await fetch(api, { next: { revalidate: 86400 } });
    const data = await r.json();
    return (data.items||[]).map(i=>({
      title: i.title,
      link: i.link,
      img: i.enclosure?.link || i.thumbnail || null,
      desc: i.description?.replace(/<[^>]*>/g,'').slice(0,180) || '',
      fecha: new Date(i.pubDate).toLocaleDateString('es-SV')
    }));
  }catch{ return []; }
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';
  const urls = FUENTES[cat] || FUENTES['El Salvador'];
  let todas=[];
  for(const u of urls){ const n=await fetchRSS(u); todas=todas.concat(n); }
  todas.sort((a,b)=> (b.link.includes('bbc')?1:0) - (a.link.includes('bbc')?1:0));
  const unicas = [...new Map(todas.map(x=>[x.title,x])).values()].slice(0,26);
  return NextResponse.json(unicas, { headers:{ 'Cache-Control':'s-maxage=86400' } });
}
