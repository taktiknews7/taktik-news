export const dynamic = 'force-dynamic';
export const revalidate = 0;

const IMG_POR_CAT = {
  'El Salvador': 'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=900', // centro historico
  'Internacional': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900',
  'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
  'Política': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900'
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  let query = 'El Salvador';
  if (cat === 'Internacional') query = 'mundo';
  if (cat === 'Economía' || cat === 'Economia') query = 'economia El Salvador';
  if (cat === 'Política' || cat === 'Politica') query = 'politica El Salvador';

  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es-419&gl=SV&ceid=SV:es-419`;
    // Usamos rss2json que SI funciona en Vercel y nos da la foto
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    const data = await res.json();

    if (!data.items) throw new Error('sin items');

    const items = data.items.slice(0, 12).map(item => {
      // rss2json a veces trae imagen en enclosure o description
      let img = item.enclosure?.link || null;
      if (!img) {
        const m = item.description?.match(/<img[^>]+src="([^"]+)"/);
        if (m) img = m[1];
      }
      // Si no hay foto, usa una bonita de El Salvador, no el futbolista
      if (!img || img.includes('news.google.com')) {
        img = IMG_POR_CAT[cat] || IMG_POR_CAT['El Salvador'];
      }

      return {
        title: item.title,
        link: item.link,
        img: img
      };
    }).filter(n => n.title.length > 20);

    return Response.json(items);
  } catch (e) {
    console.log("Error robot:", e);
    // Si todo falla, al menos no mostramos el futbolista, mostramos una de ES
    return Response.json([
      { title: `Noticias de ${cat} - Taktik News en vivo ${new Date().toLocaleDateString('es-SV')}`, link: '#', img: IMG_POR_CAT[cat] }
    ]);
  }
}
