import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const feeds = {
    'El Salvador': 'https://news.google.com/rss/search?q=El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
    'Internacional': 'https://news.google.com/rss/search?q=noticias+internacionales&hl=es-419&gl=SV&ceid=SV:es-419',
    'Economía': 'https://news.google.com/rss/search?q=economia+El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
    'Política': 'https://news.google.com/rss/search?q=politica+El+Salvador+USA&hl=es-419&gl=SV&ceid=SV:es-419'
  };

  try {
    const url = feeds[cat] || feeds['El Salvador'];
    const res = await fetch(url, { next: { revalidate: 60 } });
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].slice(0, 10).map(m => {
      const b = m[1];
      const t = b.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const l = b.match(/<link>(.*?)<\/link>/)?.[1] || '#';
      return { title: t.replace(/<!\[CDATA\[|\]\]>/g,''), link: l, cat };
    });
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json([{ title: `Noticias de ${cat} - Actualizando...`, link: "#", cat }]);
  }
}
