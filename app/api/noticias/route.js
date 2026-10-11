import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0' } });

const RSS = {
  'El Salvador': 'https://news.google.com/rss/search?q=El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
  'Internacional': 'https://news.google.com/rss/search?q=Internacional&hl=es-419&gl=SV&ceid=SV:es-419',
  'Economía': 'https://news.google.com/rss/search?q=Economia+El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
  'Política': 'https://news.google.com/rss/search?q=Politica+El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419'
};

const RESPALDO = {
  'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
  'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
  'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
  'Política': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900'
};

async function getOgImage(url){
  try{
    const controller = new AbortController();
    setTimeout(()=>controller.abort(), 3500);
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 TAKTIK NEWS Bot' } });
    const html = await res.text();
    // busca og:image o twitter:image
    const og = html.match(/property="og:image"\s+content="([^"]+)"/i) || html.match(/content="([^"]+)"\s+property="og:image"/i) || html.match(/name="twitter:image"\s+content="([^"]+)"/i) || html.match(/property="og:image:secure_url"\s+content="([^"]+)"/i);
    if(og && og[1]) return og[1].replace(/&amp;/g,'&');
  }catch(e){}
  return null;
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';
  try{
    const feed = await parser.parseURL(RSS[cat] || RSS['El Salvador']);
    const items = feed.items.slice(0, 26);

    // Solo jalamos imagen real para la PRINCIPAL para no matar Vercel
    let imgPrincipal = null;
    if(items[0]?.link){
      imgPrincipal = await getOgImage(items[0].link);
    }

    const noticias = items.map((item, idx)=>({
      title: item.title,
      link: item.link,
      img: idx===0? (imgPrincipal || RESPALDO[cat]) : null,
      fecha: new Date().toLocaleDateString('es-SV')
    }));

    return NextResponse.json(noticias, { headers: { 'Cache-Control': 's-maxage=86400' } }); // cache 24h
  }catch(e){
    return NextResponse.json([]);
  }
}
