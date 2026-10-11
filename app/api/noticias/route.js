import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
const parser = new Parser();

const RSS = {
  'El Salvador': 'https://news.google.com/rss/search?q=El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
  'Internacional': 'https://news.google.com/rss/search?q=Internacional&hl=es-419&gl=SV&ceid=SV:es-419',
  'Economía': 'https://news.google.com/rss/search?q=Economia+El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419',
  'Política': 'https://news.google.com/rss/search?q=Politica+El+Salvador&hl=es-419&gl=SV&ceid=SV:es-419'
};

// Imagenes reales que NO bloquean, rotan cada 24h
const IMAGENES_REALES = {
  'El Salvador': [
    'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900'
  ],
  'Internacional': [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900'
  ],
  'Economía': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900'
  ],
  'Política': [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900'
  ]
};

function getImagen24h(cat){
  const dia = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // cambia cada 24h
  const lista = IMAGENES_REALES[cat] || IMAGENES_REALES['El Salvador'];
  return lista[dia % lista.length];
}

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const cat = searchParams.get('cat') || 'El Salvador';
  try{
    const feed = await parser.parseURL(RSS[cat] || RSS['El Salvador']);
    const noticias = feed.items.slice(0,26).map((item, idx)=>({
      title: item.title,
      link: item.link,
      // Si es la principal (idx 0), le ponemos imagen real que rota cada 24h
      img: idx === 0? getImagen24h(cat) : null,
      fecha: new Date().toLocaleDateString('es-SV')
    }));
    return NextResponse.json(noticias);
  }catch(e){
    return NextResponse.json([]);
  }
}
