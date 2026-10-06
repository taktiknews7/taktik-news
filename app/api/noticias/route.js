export const dynamic = 'force-dynamic';
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  let query = 'El Salvador noticias';
  if (cat === 'Internacional') query = 'noticias internacionales';
  if (cat === 'Economia') query = 'El Salvador economia';
  if (cat === 'Politica') query = 'El Salvador politica';

  try {
    const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es-419&gl=SV&ceid=SV:es-419`, { next: { revalidate: 300 } });
    const xml = await res.text();

    const items = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].slice(0, 20).map(m => {
      const block = m[1];
      const title = (block.match(/<title>(.*?)<\/title>/)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g,'');
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || '#';
      return { title, link };
    }).filter(n => {
      // FILTRO: Quitamos CNN, Yahoo que dan el Agree
      const bad = ['cnn.com', 'yahoo.com', 'bbc.com'];
      return!bad.some(d => n.link.includes(d));
    });

    return Response.json(items);
  } catch (e) {
    return Response.json([]);
  }
}
