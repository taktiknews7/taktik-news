export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
    'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
    'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
    'Política': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900'
  };

  const FEEDS = {
    'El Salvador': 'https://www.laprensagrafica.com/rss/lo-ultimo',
    'Internacional': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Economía': 'https://feeds.bbci.co.uk/mundo/topics/c340qqnh3q4t/economia/rss.xml',
    'Política': 'https://feeds.bbci.co.uk/mundo/topics/c340qqnl2k1t/politica/rss.xml'
  };

  // OFFSET para que no repita el mismo titular en todas
  const OFFSET = { 'El Salvador': 0, 'Internacional': 0, 'Economía': 3, 'Política': 6 };

  try{
    const url = FEEDS[cat];
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 1800 } });
    if(!res.ok) throw new Error('feed');
    const xml = await res.text();
    let items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>{
      const b = m[1];
      const t = (b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || b.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
      const l = (b.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '#';
      return { title: t.replace(/<[^>]+>/g,'').trim(), desc: 'BBC / Infobae - Click para leer', link: l.trim(), img: imgCat[cat], cat };
    }).filter(i=>i.title);

    // Rotar según categoría para que Política no sea la misma que Internacional
    const offset = OFFSET[cat] || 0;
    items = [...items.slice(offset),...items.slice(0, offset)].slice(0, 20);

    if(items.length===0) throw new Error('vacío');
    return Response.json(items);
  }catch(e){
    // Si falla, al menos que no repita el título de Perú en Política
    const fallbackTitulos = {
      'El Salvador': 'Gobierno de El Salvador anuncia nuevo plan de seguridad',
      'Internacional': 'Tensión en Medio Oriente: ONU convoca reunión urgente',
      'Economía': 'El precio del oro alcanza máximo histórico por crisis global',
      'Política': 'Congreso de EE.UU. debate reforma migratoria clave para 2026'
    };
    return Response.json([
      { title: fallbackTitulos[cat], desc: 'Titular de respaldo', link: '#', img: imgCat[cat], cat },
     ...Array.from({length: 9}, (_,i)=>({ title: `${cat}: Noticia ${i+2} del día - Actualización`, desc: 'En desarrollo...', link: '#', img: imgCat[cat], cat }))
    ]);
  }
}
