export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(3000)
    });
    const html = await res.text();
    // Busca og:image, twitter:image
    let img = html.match(/property="og:image" content="([^"]+)"/)?.[1]
           || html.match(/name="twitter:image" content="([^"]+)"/)?.[1]
           || html.match(/property="og:image"[^>]+content="([^"]+)"/)?.[1];

    // Si es relativa, la hace absoluta
    if (img && img.startsWith('/')) {
      const u = new URL(url);
      img = u.origin + img;
    }
    return img || null;
  } catch {
    return null;
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  let query = 'El Salvador noticias';
  if (cat === 'Internacional') query = 'noticias internacionales';
  if (cat === 'Economía' || cat === 'Economia') query = 'El Salvador economia';
  if (cat === 'Política' || cat === 'Politica') query = 'El Salvador politica';

  try {
    const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es-419&gl=SV&ceid=SV:es-419`, { cache: 'no-store' });
    const xml = await res.text();

    const rawItems = [...xml.matchAll(/<item>(.*?)<\/item>/gs)].slice(0, 12).map(m => {
      const block = m[1];
      const title = (block.match(/<title>(.*?)<\/title>/)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g,'');
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || '#';
      return { title, link };
    }).filter(n => {
      const bad = ['cnn.com', 'yahoo.com'];
      return!bad.some(d => n.link.includes(d)) && n.title.length > 15;
    });

    // AHORA SI: Le sacamos la foto real a cada link en paralelo
    const items = await Promise.all(rawItems.map(async (n) => {
      const img = await getOgImage(n.link);
      return {...n, img };
    }));

    return Response.json(items);
  } catch (e) {
    console.log(e);
    return Response.json([]);
  }
}
