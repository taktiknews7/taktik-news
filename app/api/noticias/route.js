export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
    'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
    'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
    'Política': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900'
  };

  // NOTICIAS DE RESPALDO PARA QUE NUNCA QUEDE EN 0
  const respaldo = {
    'El Salvador': [
      { title: 'El Salvador: Gobierno anuncia nuevas inversiones en infraestructura', desc: 'Proyectos en todo el país...', link: '#', img: imgCat['El Salvador'], cat },
      { title: 'San Salvador registra crecimiento económico este trimestre', desc: 'Datos del BCR...', link: '#', img: imgCat['El Salvador'], cat }
    ],
    'Internacional': [
      { title: 'Tensión internacional: Cumbre de líderes busca acuerdo climático', desc: 'Más de 100 países...', link: '#', img: imgCat['Internacional'], cat },
      { title: 'EEUU: Elecciones generan expectativa mundial', desc: 'Análisis...', link: '#', img: imgCat['Internacional'], cat }
    ],
    'Economía': [
      { title: 'Bitcoin se recupera y supera los $65,000', desc: 'Mercado cripto...', link: '#', img: imgCat['Economía'], cat },
      { title: 'FMI mejora proyección para América Latina', desc: 'Crecimiento...', link: '#', img: imgCat['Economía'], cat }
    ],
    'Política': [
      { title: 'Asamblea Legislativa aprueba reformas clave', desc: 'Debate intenso...', link: '#', img: imgCat['Política'], cat },
      { title: 'Encuestas muestran cambios en preferencia electoral', desc: 'Últimos datos...', link: '#', img: imgCat['Política'], cat }
    ]
  };

  const FEEDS = {
    'El Salvador': 'https://www.laprensagrafica.com/rss/lo-ultimo',
    'Internacional': 'https://feeds.bbci.co.uk/mundo/rss.xml',
    'Economía': 'https://www.infobae.com/arcio/rss/economia/',
    'Política': 'https://feeds.bbci.co.uk/mundo/rss.xml'
  };

  try{
    const url = FEEDS[cat] || FEEDS['Internacional'];
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 3600 } });
    if(!res.ok) throw new Error('feed fail');
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20).map(m=>{
      const b = m[1];
      const t = (b.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || b.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'Noticia';
      const l = (b.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '#';
      return { title: t.replace(/<[^>]+>/g,'').trim(), desc: 'Fuente BBC / Infobae - Click para leer', link: l.trim(), img: imgCat[cat], cat };
    });

    if(items.length === 0) throw new Error('sin items');
    return Response.json(items);
  }catch(e){
    console.log('USANDO RESPALDO PARA', cat);
    return Response.json(respaldo[cat] || respaldo['Internacional']);
  }
}
